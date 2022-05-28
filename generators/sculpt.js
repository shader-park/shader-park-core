/**
 * Converts sculpt lang to JS which generates GLSL
 */

import {
	geometryFunctions, 
	mathFunctions, 
	glslBuiltInOneToOne, 
	glslBuiltInOther
} from '../glsl/bindings.js';

import {convertFunctionToString} from '../targets/helpers.js'

import glsl from './glslParser.js';

import { parser } from  '@shaderfrog/glsl-parser';

import { sdfs } from '../glsl/sdfs.js';

import * as escodegen from 'escodegen';
import * as esprima from 'esprima';

function buildGeoSource(geo) {
	return `
float surfaceDistance(vec3 p) {
	vec3 normal = vec3(0.0,1.0,0.0);
	vec3 mouseIntersect = vec3(0.0,1.0,0.0);
    float d = 100.0;
    vec3 op = p;
${geo}
    return scope_0_d;
}`;
}

function buildColorSource(col, useLighting) {
	let lgt = useLighting ? '' : '    return scope_0_material.albedo;';
	return `
vec3 shade(vec3 p, vec3 normal) {
    float d = 100.0;
    vec3 op = p;
	vec3 lightDirection = vec3(0.0, 1.0, 0.0);
	vec3 backgroundColor = vec3(1.0, 1.0, 1.0);
	vec3 mouseIntersect = vec3(0.0,1.0,0.0);
	#ifdef USE_PBR
	Material material = Material(vec3(1.0),0.5,0.7,1.0);
	Material selectedMaterial = Material(vec3(1.0),0.5,0.7,1.0);
	#else
	float light = 1.0;
	float occ = 1.0;
    vec3 color = vec3(1.0,1.0,1.0);
	vec3 selectedColor = vec3(1.0,1.0,1.0);
	#endif
${col}
${lgt}
	#ifdef USE_PBR
	return pbrLighting(
		worldPos.xyz,
		normal,
		lightDirection,
		scope_0_material,
		backgroundColor
		);
	#else
	return scope_0_material.albedo*simpleLighting(p, normal, lightDirection, );*occ;
	#endif
}`;
}

// Converts binary math operators to our own version
function replaceBinaryOp(syntaxTree) {

	if (typeof syntaxTree === 'object') {
		for (let node in syntaxTree) {
			if (syntaxTree.hasOwnProperty(node)) {
				replaceBinaryOp(syntaxTree[node]);
			}
		}
	}

	if (syntaxTree !== null && syntaxTree['type'] === 'BinaryExpression') {
		let op = syntaxTree['operator'];
		if (op === '*' || op === '/' || op === '-' || op === '+') {
			if (op === '*' ) {
				syntaxTree['callee'] = {type:'Identifier', name:'mult'};
			} else if (op === '/') {
				syntaxTree['callee'] = {type:'Identifier', name:'divide'};
			} else if (op === '-') {
				syntaxTree['callee'] = {type:'Identifier', name:'sub'};
			} else if (op === '+') {
				syntaxTree['callee'] = {type:'Identifier', name:'add'};
			}
			syntaxTree['type'] = 'CallExpression';
			syntaxTree['arguments'] = [syntaxTree['left'], syntaxTree['right']];
			syntaxTree['operator'] = undefined;
		}
	}
}

function replaceOperatorOverload(syntaxTree) {
	try {
		if (syntaxTree && typeof syntaxTree === "object") {
			for (let node in syntaxTree) {
				if (syntaxTree.hasOwnProperty(node)) {
					replaceOperatorOverload(syntaxTree[node]);
				}
			}
		}
		if (syntaxTree && typeof syntaxTree === "object" && 'type' in syntaxTree 
			&& syntaxTree.type === 'ExpressionStatement'
			&& 'expression' in syntaxTree
			&& syntaxTree.expression.type === 'AssignmentExpression') {
			
			let op = syntaxTree.expression.operator;
			if (op === '+=' || op === '-=' || op === '/=' || op === '*=' || op === '%=') {
				syntaxTree.expression.operator = "=";

				syntaxTree.expression.right = {
					type: 'BinaryExpression',
					left: syntaxTree.expression.left,
					right: syntaxTree.expression.right
				}

				if(op === '+=') {
					syntaxTree.expression.right.operator =  '+';
				} else if(op === '-=') {
					syntaxTree.expression.right.operator = '-';
				} else if (op === '/=') {
					syntaxTree.expression.right.operator = '/';
				} else if (op === '*=') {
					syntaxTree.expression.right.operator = '*';
				} else if (op === '%=') {
					syntaxTree.expression.right.operator = '%';
				}
			}
		}
	} catch (e) {
		console.error(e);
		throw e
	}
}

function replaceSliderInput(syntaxTree) {
	try {
		if (syntaxTree && typeof syntaxTree === "object") {
			for (let node in syntaxTree) {
				if (syntaxTree.hasOwnProperty(node)) {
					replaceSliderInput(syntaxTree[node]);
				}
			}
		}
		if (syntaxTree && typeof syntaxTree === "object" && 'type' in syntaxTree && syntaxTree['type'] === 'VariableDeclaration') {
			
			let d = syntaxTree['declarations'][0];
			let name = d.id.name;
			if (d && d.init && d.init.callee !== undefined && (d.init.callee.name === 'input' || d.init.callee.name === 'input2D')) {
				d.init.arguments.unshift({ type: "Literal", value: name, raw: name });
			}
		}
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export function uniformsToGLSL(uniforms) {
	let uniformsHeader = '';
	for (let i=0; i<uniforms.length; i++) {
		let uniform = uniforms[i];
		uniformsHeader += `uniform ${uniform.type} ${uniform.name};\n`;
	}
	return uniformsHeader;
}

export function baseUniforms() {
	return [
		{name:'time', type: 'float', value: 0.0},
		{name:'opacity', type: 'float', value: 1.0},
		{name:'_scale', type: 'float', value: 1.0},
		// {name:'sculptureCenter', type: 'vec3', value: [0,0,0]},
		{name:'mouse', type: 'vec3', value: [0.5,0.5,0.5]},
		{name:'stepSize', type: 'float', value: 0.85},
		{name:'resolution', type: 'vec2', value: [800, 600]}
	];
}

export function bindStaticData(staticData, spCode) {
	spCode = convertFunctionToString(spCode);
	return `const staticData = JSON.parse(\`${JSON.stringify(staticData)}\`)\n` + spCode;
}

export function replaceMathOps(codeSrc) {
	let tree = esprima.parse(codeSrc);
	replaceOperatorOverload(tree);
	replaceBinaryOp(tree);
	replaceSliderInput(tree);
	return escodegen.generate(tree);
}

export function sculptToGLSL(userProvidedSrc) {
	const PI = Math.PI;
	const TWO_PI = Math.PI * 2;
	const TAU = TWO_PI;
	
	let debug = false;
	userProvidedSrc = replaceMathOps(userProvidedSrc);

	if (debug) {
		console.log('tree', tree);
	}

	let generatedJSFuncsSource = "";
	let geoSrc = "";
	let colorSrc = "";
	let userGLSL = "";
	let varCount = 0;
	let primCount = 0;
	let stateCount = 0;
	let useLighting = true;
	let enable2DFlag = false;
	let stateStack = [];
	let uniforms = baseUniforms();

	let stepSizeConstant = 0.85;
	let maxIterations = 300;

	////////////////////////////////////////////////////////////
	// Generates JS from headers referenced in the bindings.js
	const dimsMapping = {
		'float': 1,
		'vec2': 2,
		'vec3': 3,
		'vec4': 4,
	}

	function glslFunc(src) {
		userGLSL += src + '\n';
		const state = glsl.runParse(src, {});
		if(state.errors.length) {
			state.errors.forEach(err=> {
				compileError(`glsl error: ${err}`); 
			});
		}

		let func = state.ast[state.ast.length-1];
		let proto = func.proto_type;
		
		let funcName = proto.identifier;
		let params = proto.parameters;
		let returnType = proto.return_type.specifier.type_name;
		
 	 	const funcArgCount = params.length;
		let boundFunc = (...args) => {
			if (args.length !== funcArgCount) {
				compileError(`Incorrect number of arguments: function ${funcName} takes ${funcArgCount} and was given ${args.length}`); 
			}
			let expression = funcName + "(";
			for (let i = 0; i < funcArgCount; i++) {
				const userParam = args[i];
				const requiredParam = params[i];
				const reqDim = requiredParam.type.specifier.type_specifier.size;
				if (reqDim === 1) {
					ensureScalar(funcName, userParam);
				} else {
					ensureDims(funcName, reqDim, userParam);
				}
				expression += collapseToString(userParam);
				if (i < funcArgCount-1) expression += ", ";
			}
			expression += ")";
			return makeVarWithDims(expression, proto.return_type.specifier.type_specifier.size, false);
		}
		
		return boundFunc;
	
	}	

	function glslFuncES3(src) {
		userGLSL += src + '\n';

		let parsedSrc;
		try {
			parsedSrc = parser.parse(src);
		} catch(e) {
			compileError(`glsl error in glslFuncES3 when parsing: ${e}`)
		}

		let prototype = parsedSrc.program[parsedSrc.program.length-1].prototype;
		let funcName = prototype.header.name.identifier;
		let returnType = prototype.header.returnType.specifier.specifier.token;
		let params = prototype.parameters;

		let checkTypes = returnType === 'void' || returnType in dimsMapping;
		if(!checkTypes) {
			compileError(`glsl error: glslFuncES3 currently supports binding to ${Object.keys(dimsMapping)} Return type was ${returnType}`); 
		}
		params.forEach(param => {
			let type = param.declaration.specifier.specifier.token;
			checkTypes = checkTypes && type in dimsMapping;
			if(debug) {
				console.log('glslFunc', funcName, type, checkTypes)
			}
			if(!checkTypes) {
				compileError(`glsl error: glslFuncES3 currently supports binding to ${Object.keys(dimsMapping)} param type was ${type}`); 
			}
		})
		
 	 	const funcArgCount = params.length;
		let boundFunc = (...args) => {
			if (args.length !== funcArgCount) {
				compileError(`Incorrect number of arguments: function ${funcName} takes ${funcArgCount} and was given ${args.length}`); 
			}
			let expression = funcName + "(";
			for (let i = 0; i < funcArgCount; i++) {
				const userParam = args[i];
				let type = params[i].declaration.specifier.specifier.token;
				const reqDim = dimsMapping[type];
				if (reqDim === 1) {
					ensureScalar(funcName, userParam);
				} else {
					ensureDims(funcName, reqDim, userParam);
				}
				expression += collapseToString(userParam);
				if (i < funcArgCount-1) expression += ", ";
			}
			expression += ")";

			return makeVarWithDims(expression, dimsMapping[returnType], false);
		}
		
		return boundFunc;
	}

	function glslSDF(src) {
		let sdfFunc = glslFunc(src);
		return (...args) => {
		  setSDF(sdfFunc(getSpace(), ...args));
		};
	}

	////////////// DESTRUCT SDFs
	let boundSDFs = {};
	for (const [key, value] of Object.entries(sdfs)) {
		boundSDFs[key] = glslSDF(value);
	}

	let {boxFrame, link, cappedTorus}  = boundSDFs;

	

	//
	function box(arg_0, arg_1, arg_2) {
		if(arg_1 !== undefined) {
			ensureScalar('box', arg_0);
			ensureScalar('box', arg_1);
			ensureScalar('box', arg_2);
			applyMode(`box(${getCurrentState().p}, ${collapseToString(arg_0)}, ${collapseToString(arg_1)}, ${collapseToString(arg_2)})`);
		} else if (arg_0.type === 'vec3') {
			applyMode(`box(${getCurrentState().p}, ${collapseToString(arg_0)})`);
		} else {
			compileError("'box' accepts either an x, y, z, or a vec3");
		}
	}

	function torus(arg_0, arg_1) {
		overloadVec2GeomFunc('torus', arg_0, arg_1);
	}

	function cylinder(arg_0, arg_1) {
		overloadVec2GeomFunc('cylinder', arg_0, arg_1);
	}

	function overloadVec2GeomFunc(funcName, arg_0, arg_1) {
		if(arg_1 !== undefined) {
			ensureScalar(funcName, arg_0);
			ensureScalar(funcName, arg_1);
			applyMode(`${funcName}(${getCurrentState().p}, ${collapseToString(arg_0)}, ${collapseToString(arg_1)})`);
		} else if (arg_0.type === 'vec2') {
			applyMode(`${funcName}(${getCurrentState().p}, ${collapseToString(arg_0)})`);
		} else {
			compileError(`'${funcName}' accepts either an x, y or a vec2`);
		}
	}

	let primitivesJS = "";
	for (let [funcName, body] of Object.entries(geometryFunctions)) {
		let argList = body['args'];
		primitivesJS += "function " + funcName + "(";
		for (let argIdx = 0; argIdx < argList.length; argIdx++) {
			if (argIdx !== 0) primitivesJS += ", ";
			primitivesJS += "arg_" + argIdx;
		}
		primitivesJS += ") {\n";
		let argIdxB = 0;
		for (let argDim of argList) {
			if (argDim === 1) {
				primitivesJS += "    ensureScalar(\"" + funcName + "\", arg_" + argIdxB + ");\n";
			}
			argIdxB += 1;
		}
		primitivesJS += "    applyMode(\"" + funcName + "(\"+getCurrentState().p+\", \" + ";
		for (let argIdx = 0; argIdx < argList.length; argIdx++) {
			primitivesJS += "collapseToString(arg_" + argIdx + ") + ";
			if (argIdx < argList.length - 1) primitivesJS += "\", \" + ";
		}
		primitivesJS += "\")\");\n}\n\n";
	}
	generatedJSFuncsSource += primitivesJS;

	function generateGLSLWrapper(funcJSON) {
		let wrapperSrc = "";
		for (let [funcName, body] of Object.entries(funcJSON)) {
			let argList = body['args'];
			let returnType = body['ret'];
			wrapperSrc += "function " + funcName + "(";
			for (let argIdx = 0; argIdx < argList.length; argIdx++) {
				if (argIdx !== 0) wrapperSrc += ", ";
				wrapperSrc += "arg_" + argIdx;
			}
			wrapperSrc += ") {\n";
			let argIdxB = 0;
			for (let arg of argList) {
				wrapperSrc += "    arg_" + argIdxB + " = tryMakeNum(arg_" + argIdxB + ");\n";
				argIdxB += 1;
			}
			// debug here
			wrapperSrc += "    return new makeVarWithDims(\"" + funcName + "(\" + ";
			for (let argIdx = 0; argIdx < argList.length; argIdx++) {
				wrapperSrc += "arg_" + argIdx + " + ";
				if (argIdx < argList.length - 1) wrapperSrc += "\", \" + ";
			}
			wrapperSrc += "\")\", " + returnType + ");\n}\n";
		}
		
		return wrapperSrc;
		
	}

	function mix(arg_0, arg_1, arg_2) {
		ensureSameDims('mix', arg_0, arg_1);
		if (arg_2.dims !== 1 && arg_2.dims !== arg_0.dims) {
			compileError(`'mix' third argument must be float or match dim of first args`);
		}
		ensureScalar('mix', arg_2);
		if(typeof arg_1 == 'number' || arg_1.type == 'float') {
			arg_0 = tryMakeNum(arg_0);
			arg_1 = tryMakeNum(arg_1);
		}
		arg_2 = tryMakeNum(arg_2);
		return new makeVarWithDims(`mix(${collapseToString(arg_0)}, ${collapseToString(arg_1)}, ${collapseToString(arg_2)})`, arg_0.dims);
	}

	function pow(arg_0, arg_1) {
		if(typeof arg_1 == 'number' || arg_1.type == 'float') {
			arg_0 = tryMakeNum(arg_0);
			arg_1 = tryMakeNum(arg_1);
		}
		ensureSameDims('pow', arg_0, arg_1);
		return new makeVarWithDims(`pow(${collapseToString(arg_0)}, ${collapseToString(arg_1)})`, arg_0.dims);
	}	


	function ensureSameDims(funcName, ...args) {
		let dims = args.map(arg => {
			if (arg.type === undefined) {
				return typeof arg;
				//compileError("'"+funcName+"' expected a vector");
			}
			return arg.dim;
		});
		
		const initialDim = dims[0];
		for(let i = 1; i < dims.length; i++) {
			let next = dims[i];
			if(initialDim !== next) {
				compileError(`'${funcName}' argument dimensions do not match`);
			}
		}
	}

	let mathFunctionsJS = generateGLSLWrapper(mathFunctions);
	generatedJSFuncsSource += mathFunctionsJS;

	let builtInOtherJS = generateGLSLWrapper(glslBuiltInOther);
	generatedJSFuncsSource += builtInOtherJS;

	let builtInOneToOneJS = "";
	for (let funcName of glslBuiltInOneToOne) {
		builtInOneToOneJS +=
`function ${funcName}(x) {
    x = tryMakeNum(x);
	// debug here
	return new makeVarWithDims("${funcName}(" + x + ")", x.dims);
}
`;
	}
	generatedJSFuncsSource += builtInOneToOneJS;
	////////////////////////////////////////////////////////////
	//End Auto Generated Code

	// set step size directly
	function setStepSize(val) {
		if (typeof val !== 'number') {
			compileError("setStepSize accepts only a constant number. Was given: '" + val.type + "'");
		}
		stepSizeConstant = val;
	}
	// set step size on a scale 0-100
	function setGeometryQuality(val) {
		if (typeof val !== 'number') {
			compileError("setGeometryQuality accepts only a constant number between 0 and 100. Was given: '" + val.type + "'");
		}
		stepSizeConstant = 1-0.01*val*0.995;
	}

	function setMaxIterations(val) {
		if (typeof val !== 'number' || val < 0) {
			compileError("setMaxIterations accepts only a constant number >= 0. Was given: '" + val.type + "'");
		}
		maxIterations = Math.round(val);
	}

	function getCurrentState() {
		return stateStack[stateStack.length-1];
	}

	function getCurrentMode() {
		return getCurrentState().mode;
	}

	function getCurrentDist() {
		return getCurrentState().id+"d";
	}

	function getCurrentPos() {
		return getCurrentState().id+"p";
	}

	function getMainMaterial() {
		return getCurrentState().id+"material";
	}

	function getCurrentMaterial() {
		return getCurrentState().id+"currentMaterial";
	}

	function appendSources(source) {
		geoSrc += "    " + source;
		colorSrc += "    " + source;
	}

	function appendColorSource(source) {
		colorSrc += "    " + source;
	}

	// General Variable class
	function makeVar(source, type, dims, inline) {
		this.type = type;
		this.dims = dims;
		if (inline) {
			this.name = source;
		} else {
			let vname = "v_" + varCount;
			appendSources(this.type + " " + vname + " = " + source + ";\n");
			varCount += 1;
			this.name = vname;
		}
		this.toString = function() {
			return this.name;
		}
		return this;
	}

	// Need to handle cases like - vec3(v.x, 0.1, mult(0.1, time))

	function float(source, inline) {
		//if (typeof source !== 'string') {
			source = collapseToString(source);
		//}
		return new makeVar(source, 'float', 1, inline);
	}

	function vec2(source, y, inline) {
		if (y === undefined ) {
			y = source;
		}
		if (typeof source !== 'string') {
			source = "vec2(" + collapseToString(source) + ", " 
							 + collapseToString(y) + ")";
		}
		let self = new makeVar(source, 'vec2', 2, inline);

		let currX = new makeVarWithDims(self.name + ".x", 1, true); 
		let currY = new makeVarWithDims(self.name + ".y", 1, true);
		let objs = { 'x': currX, 'y': currY};
		applyVectorAssignmentOverload(self, objs);

		return self;
	}

	function vec3(source, y, z, inline) {
		if (y === undefined) {
			y = source;
			z = source;
		}
		if (typeof source !== 'string') {
			
			source = "vec3(" + collapseToString(source) + ", " 
							 + collapseToString(y) + ", " 
							 + collapseToString(z) + ")";
			
		}
		let self = new makeVar(source, 'vec3', 3, inline);
		let currX = new makeVarWithDims(self.name + ".x", 1, true);
		let currY = new makeVarWithDims(self.name + ".y", 1, true);
		let currZ = new makeVarWithDims(self.name + ".z", 1, true);
		let objs = {'x': currX, 'y': currY, 'z': currZ};
		applyVectorAssignmentOverload(self, objs);
		return self;
	}

	function vec4(source, y, z, w, inline) {
		if (y === undefined && z === undefined) {
			y = source;
			z = source;
			w = source;
		}
		if (typeof source !== 'string') {
			source = "vec4(" + collapseToString(source) + ", " 
							 + collapseToString(y) + ", " 
							 + collapseToString(z) + ", "
							 + collapseToString(w) + ")";
		}
		let self = new makeVar(source, 'vec4', 4, inline);
		let currX = new makeVarWithDims(self.name + ".x", 1, true);
		let currY = new makeVarWithDims(self.name + ".y", 1, true);
		let currZ = new makeVarWithDims(self.name + ".z", 1, true);
		let currW = new makeVarWithDims(self.name + ".w", 1, true);
		let objs = { 'x': currX, 'y': currY, 'z': currZ, 'w': currW };
		applyVectorAssignmentOverload(self, objs);
		return self;
	}

	// allows the user to re-assign a vector's components
	function applyVectorAssignmentOverload(self, objs) {
		Object.entries(objs).forEach(([key, func]) => {
			Object.defineProperty(self, key, {
				get: () => func,
				set: (val) => appendSources(`${self.name}.${key} = ${val};\n`)
			});
		});
	}

	function makeVarWithDims(source, dims, inline) {
		if (dims < 1 || dims > 4) compileError("Tried creating variable with dim: " + dims);
		if (dims === 1) return new float(source, inline);
		if (dims === 2) return new vec2(source, null, inline);
		if (dims === 3) return new vec3(source, null, null, inline);
		if (dims === 4) return new vec4(source, null, null, null, inline);
	}

	// Modes enum
	const modes = {
		UNION: 10,
		DIFFERENCE: 11,
		INTERSECT: 12,
		BLEND: 13,
		MIXGEO: 14,
	};
	const additiveModes = [modes.UNION, modes.BLEND, modes.MIXGEO];

	const materialModes = {
		NORMAL: 20, // F it let's start at 20 why not
		MIXMAT: 21
	};

	let time = new float("time", true);
	let mouse = new vec3("mouse", null, null, true);
	let normal = new vec3("normal", null, null, true);

	function mouseIntersection() {
		appendColorSource("mouseIntersect = mouseIntersection();\n");
		return new vec3("mouseIntersect", null, null, true);
	}

	function getRayDirection() {
		return new vec3("getRayDirection()", null, null, false);
	}

	function compileError(err) {
		// todo: throw actual error (and color error?)
		console.error(err, " char: " + geoSrc.length);
		throw err;
	}

	function ensureScalar(funcName, val) {
		let tp = typeof val;
		if (typeof val !== 'number' && val.type !== 'float') {
			compileError("'"+funcName+"'" + " accepts only a scalar. Was given: '" + val.type + "'");
		}
	}
	
	function ensureDims(funcName, size, val) {
 		// for now this only verifies vector dims not scalars/floats!
		if (val.type === undefined) {
			compileError("'"+funcName+"' expected a vector");
		}
		if (size !== val.dims) {
			compileError("'"+funcName+"' expected a vector dim: " + size + ", was given: " + val.dims );
		}
 	}

	function ensureGroupOp(funcName, a, b) {
		if (typeof a !== 'string' && typeof b !== 'string') {
			if (a.dims !== 1 && b.dims !== 1 && a.dims !== b.dims) {
				compileError("'" + funcName + "'" + 
					" dimension mismatch. Was given: '" + a.type + "' and '" + b.type + "'");
			}
		}
	}

	function collapseToString(val) {
		if (typeof val === 'string') {
			return val;
		} else if (typeof val === 'number') {
			return val.toFixed(8);
		} else {
			return val.toString();
		}
	}

	function mixMat(amount) {
		getCurrentState().materialMode = materialModes.MIXMAT;
		ensureScalar("mixMat", amount);
		getCurrentState().matMixAmount = amount;
	}

	function resetMixColor() {
		getCurrentState().materialMode = materialModes.NORMAL;
	}

	// Modes (prepend these with GEO or something to indicate they are geometry modes?)

	function union() {
		getCurrentState().mode = modes.UNION;
	}

	function difference() {
		getCurrentState().mode = modes.DIFFERENCE;
	}

	function intersect() {
		getCurrentState().mode = modes.INTERSECT;
	}

	function blend(amount) {
		getCurrentState().mode = modes.BLEND;
		ensureScalar("blend", amount);
		getCurrentState().blendAmount = amount;
	}

	function mixGeo(amount) {
		getCurrentState().mode = modes.MIXGEO;
		ensureScalar("mixGeo",amount);
		getCurrentState().mixAmount = amount;
	}

	function getMode() {
		switch (getCurrentMode()) {
			case modes.UNION:
				return ["add"];
				break;
			case modes.DIFFERENCE:
				return ["subtract"];
				break;
			case modes.INTERSECT:
				return ["intersect"];
				break;
			case modes.BLEND:
				return ["smoothAdd",getCurrentState().blendAmount];
				break;
			case modes.MIXGEO:
				return ["mix", getCurrentState().mixAmount];
				break;
			default:
				return ["add"];
		}
	}

	function applyMode(prim, finalCol) {
		let primName = "prim_" + primCount;
		primCount += 1;
		appendSources("float " + primName + " = " + prim + ";\n");
		if (additiveModes.includes(getCurrentMode())) {
			let selectedCC = finalCol !== undefined ? finalCol : getCurrentMaterial();
			if (getCurrentState().materialMode === materialModes.NORMAL) {
				appendColorSource("if (" + primName + " < "+ getCurrentDist() + ") { " + getMainMaterial() + " = " + selectedCC + "; }\n" );
			} else if (getCurrentState().materialMode === materialModes.MIXMAT) {
				appendColorSource(getMainMaterial() + " = blendMaterial(" + selectedCC + ", " + 
				getMainMaterial() + ", " + collapseToString(getCurrentState().matMixAmount) + ");\n" );
			}
		}
		let cmode = getMode();
		appendSources(getCurrentDist() + " = "+ cmode[0] + "( " + primName + ", " + getCurrentDist() +  " " +
			(cmode.length > 1 ? "," + collapseToString(cmode[1]) : "") + " );\n");
	}

	function getSpace() {
		return makeVarWithDims(getCurrentState().p.name, 3);
	}

	function pushState() {
		stateStack.push({
			id: "scope_" + stateCount + "_",
			mode: modes.UNION,
			materialMode: materialModes.NORMAL,
			matMixAmount: 0.0,
			blendAmount: 0.0,
			mixAmount: 0.0,
		});
		appendSources("float " + getCurrentDist() + " = 100.0;\n");
		let lastP = stateStack.length > 1 ? stateStack[stateStack.length-2].id+"p" : "p";
		let lastMat = stateStack.length > 1 ? stateStack[stateStack.length-2].id+"currentMaterial" : "material";
		appendSources("vec3 " + getCurrentPos() + " = " + lastP + ";\n");
		appendColorSource("Material " + getMainMaterial() + " = " + lastMat + ";\n");
		appendColorSource("Material " + getCurrentMaterial() + " = " + lastMat + ";\n");
		getCurrentState().p = vec3(getCurrentPos(), null, null, true);
		stateCount++;
	}

	function popState() {
		let lastDist = getCurrentDist();
		let lastMaty = getMainMaterial();
		stateStack.pop();
		applyMode(lastDist, lastMaty);
	}
	// !!! puts initial state on stack, this never comes off !!!
	pushState();

	function shape(func) {
		let makeShape = function() {
			pushState();
			let output = func.apply(this, arguments);
			popState();
			return output;
		}
		return makeShape;
	}

	function tryMakeNum(v) {
		if (typeof v === 'number') {
			return new float(v);
		} else {
			return v;
		}
	}

	/// Math ///

	// Group ops

	function mult(a,b) {
		if (typeof a === 'number' && typeof b === 'number') return (a*b);
		a = tryMakeNum(a);
 		b = tryMakeNum(b);
 		if (debug) {
			console.log("multiplying...");
			console.log("a: ", a);
			console.log("b: ", b);
		}
 		ensureGroupOp("mult", a, b);
 		let dims = Math.max(a.dims, b.dims);
 		return new makeVarWithDims("(" + collapseToString(a) + "*" + collapseToString(b) + ")", dims);
	}

	function add(a,b) {
 		if (typeof a === 'number' && typeof b === 'number') return (a+b);
 		a = tryMakeNum(a);
 		b = tryMakeNum(b);
 		if (debug) {
			console.log("adding...");
			console.log("a: ", a);
			console.log("b: ", b);
		}
 		ensureGroupOp("add", a, b);
 		let dims = Math.max(a.dims, b.dims);
 		return new makeVarWithDims("(" + collapseToString(a) + "+" + collapseToString(b) + ")", dims);
	}

	function sub(a,b) {
 		if (typeof a === 'number' && typeof b === 'number') return (a-b);
 		a = tryMakeNum(a);
 		b = tryMakeNum(b);
 		if (debug) {
			console.log("subtracting...");
			console.log("a: ", a);
			console.log("b: ", b);
		}
 		ensureGroupOp("sub", a, b);
 		let dims = Math.max(a.dims, b.dims);
 		return new makeVarWithDims("(" + collapseToString(a) + "-" + collapseToString(b) + ")", dims);
	}

	function divide(a,b) {
		if (typeof a === 'number' && typeof b === 'number') return (a/b);
		a = tryMakeNum(a);
		b = tryMakeNum(b);
		if (debug) {
		   console.log("dividing...");
		   console.log("a: ", a);
		   console.log("b: ", b);
	   }
		ensureGroupOp("divide", a, b);
		let dims = Math.max(a.dims, b.dims);
		return new makeVarWithDims("(" + collapseToString(a) + "/" + collapseToString(b) + ")", dims);
	}
	
	function setSDF(dist) {
		ensureScalar("setSDF", dist);
		applyMode(collapseToString(dist));
	}
	
	function getSDF() {
		return float(getCurrentDist(), true);
	}

	// Displacements

	function reset() {
		if (stateStack.length > 1) {
			appendSources(getCurrentPos()+" = " + stateStack[stateStack.length-2].id+"p;\n");
		} else {
			appendSources(getCurrentPos()+" = op;\n");
		}
	}

	function displace(xc, yc, zc) {
		if (yc === undefined || zc === undefined) {
			appendSources(getCurrentPos()+" -= " + collapseToString(xc) + ";\n");
		} else {
			ensureScalar("displace",xc);
			ensureScalar("displace",yc);
			ensureScalar("displace",zc);
			appendSources(getCurrentPos()+" -= vec3( " + collapseToString(xc) + ", " 
								 + collapseToString(yc) + ", " 
								 + collapseToString(zc) + ");\n");
		}
	}

	function setSpace(xc, yc, zc) {
		if (yc === undefined || zc === undefined) {
			appendSources(getCurrentPos()+" = " + collapseToString(xc) + ";\n");
		} else {
			ensureScalar("setSpace",xc);
			ensureScalar("setSpace",yc);
			ensureScalar("setSpace",zc);
			appendSources(getCurrentPos()+" = vec3( " + collapseToString(xc) + ", " 
								 + collapseToString(yc) + ", " 
								 + collapseToString(zc) + ");\n");
		}
	}
	
	function repeat(spacing, repetitions) {
		let spc = collapseToString(spacing);
		let reps = collapseToString(repetitions);
		appendSources(getCurrentPos()+" = " + getCurrentPos() + "-" + spc +"*clamp(round(" + getCurrentPos() + "/" + spc + "),-" + reps + " ," + reps + ");\n");
	}

	function rotateX(angle) {
		ensureScalar("rotateX",angle);
		appendSources(getCurrentPos()+".yz = " + getCurrentPos() + ".yz*rot2(" + collapseToString(angle) + ");\n");
	}

	function rotateY(angle) {
		ensureScalar("rotateY",angle);
		appendSources(getCurrentPos()+".xz = " + getCurrentPos() + ".xz*rot2(" + collapseToString(angle) + ");\n");
	}

	function rotateZ(angle) {
		ensureScalar("rotateZ",angle);
		appendSources(getCurrentPos()+".xy = " + getCurrentPos() + ".xy*rot2(" + collapseToString(angle) + ");\n");
	}

	function mirrorX() {
		appendSources(getCurrentPos()+".x = abs(" + getCurrentPos() + ".x);\n");
	}

	function mirrorY() {
		appendSources(getCurrentPos()+".y = abs(" + getCurrentPos() + ".y);\n");
	}

	function mirrorZ() {
		appendSources(getCurrentPos()+".z = abs(" + getCurrentPos() + ".z);\n");
	}

	function mirrorXYZ() {
		appendSources(getCurrentPos()+" = abs(" + getCurrentPos() + ");\n");
	}

	function flipX() {
		appendSources(getCurrentPos()+".x = -" + getCurrentPos() + ".x;\n");
	}

	function flipY() {
		appendSources(getCurrentPos()+".y = -" + getCurrentPos() + ".y;\n");
	}

	function flipZ() {
		appendSources(getCurrentPos()+".z = -" + getCurrentPos() + ".z;\n");
	}

	function expand(amount) {
		ensureScalar("expand",amount);
		appendSources(getCurrentDist() + " -= " + collapseToString(amount) + ";\n");
	}

	function shell(depth) {
		ensureScalar("shell",depth);
		appendSources(getCurrentDist() + " = shell( " + getCurrentDist() +  "," + collapseToString(depth) + ");\n");
	}

	// Color/Lighting

	function color(col, green, blue) {
		if (green !== undefined) {
			ensureScalar("color", col);
			ensureScalar("color", green);
			ensureScalar("color", blue);
			appendColorSource(getCurrentMaterial() + ".albedo = vec3(" + 
				collapseToString(col) + ", " + 
				collapseToString(green) + ", " +
				collapseToString(blue) + ");\n");
		} else {
			if (col.type !== 'vec3') compileError("albedo must be vec3");
			appendColorSource(getCurrentMaterial() + ".albedo = " + collapseToString(col) + ";\n");
		}
	}

	function metal(val) {
		ensureScalar("metal", val);
		appendColorSource(getCurrentMaterial() + ".metallic = " + 
			collapseToString(val) + ";\n");
	}

	function shine(val) {
		ensureScalar("shine", val);
		appendColorSource(getCurrentMaterial() + ".roughness = 1.0-" + 
			collapseToString(val) + ";\n");
	}
	
	function fresnel(val) {
		ensureScalar("fresnel", val);
		return pow(1 + dot(getRayDirection(), normal), val);
	}

	function lightDirection(x, y, z) {
		if (y === undefined || z === undefined) {
			appendColorSource("lightDirection = " + collapseToString(x) + ";\n");
		} else {
			ensureScalar("lightDirection", x);
			ensureScalar("lightDirection", y);
			ensureScalar("lightDirection", z);
			appendColorSource("lightDirection = vec3( " + collapseToString(x) + ", "
				+ collapseToString(y) + ", "
				+ collapseToString(z) + ");\n");
		}
	}

	function backgroundColor(x, y, z) {
		if (y === undefined || z === undefined) {
			appendColorSource("backgroundColor = " + collapseToString(x) + ";\n");
		} else {
			ensureScalar("backgroundColor", x);
			ensureScalar("backgroundColor", y);
			ensureScalar("backgroundColor", z);
			appendColorSource("backgroundColor = vec3( " + collapseToString(x) + ", "
				+ collapseToString(y) + ", "
				+ collapseToString(z) + ");\n");
		}
	}
	// should this also be 'op'? 
	function noLighting() {
		useLighting = false;
	}

	// replaced with a noop for now to prevent errors
	function basicLighting() {}

	function occlusion(amount) {
		let amt = "1.0";
		if (amount !== undefined) {
			ensureScalar("occlusion", amount);
			amt = collapseToString(amount);
		} 
		appendColorSource(getCurrentMaterial() + ".ao = mix(1.0, occlusion(op,normal), " + amt + ");\n");
	}

	function test() {
		appendSources("//this is a test\n");
	}

	function input(name, value=0.0, min = 0.0, max = 1.0) {
		if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
			compileError('input value, min, and max must be constant numbers');
		}
		uniforms.push({name, type:'float', value, min, max});
		return new float(name, true);
	}


	
	function input2D(name, value={x: 0.0, y: 0.0}, min = {x: 0.0, y: 0.0}, max = {x: 1.0, y: 1.0}) {
		if(typeof value === 'number' && typeof min === 'number' && typeof max === 'object') {
			// syntax input2D(.2, 1.2);
			let x = value;
			let y = min;
			uniforms.push({name, type:'vec2', value: {x, y}, min: {x:0, y:0}, max: {x:1, y:1} });
			return new vec2(name, true);
		}
		if (typeof value !== 'object' || typeof min !== 'object' || typeof max !== 'object') {
			compileError('input2D: value, min, and max must be a vec2');
		} 
		
		let xyExist = [value, min, max].reduce((acc, curr) => acc && ('x' in curr) && ('y' in curr));
		if(!xyExist) {
			compileError('input2D: value, min, and max must be a vec2');
		}
		uniforms.push({name, type:'vec2', value, min, max});
		return new vec2(name, true);
	}

	function getPixelCoord() {
		return makeVarWithDims('gl_FragCoord.xy', 2, true);
	}

	function getResolution() {
		return makeVarWithDims('resolution', 2, true);
	}

	function get2DCoords() {
		return makeVarWithDims('vec2((gl_FragCoord.x/resolution.x-0.5)*(resolution.x/resolution.y),gl_FragCoord.y/resolution.y-0.5)', 2, false);
	}

	function enable2D() {
		setMaxIterations(0);
		noLighting();
		enable2DFlag = true;
		return get2DCoords();
	}



	/*
	function input2(name, x, y) {
		console.log('input2',name, x, y);
		let uniform = {name, type: 'vec2'};
		let out = x;
		if(y === undefined) {
			uniform.value = x;
		} else {
			out = new vec2(x, y, true);
			uniform.value = out;
		}
		uniforms.push(uniform);
		return out;
	}
	*/

	let error = undefined;
	
	function revolve2D(sdf) {
	  return (r, ...args) => {
	    ensureScalar('revolve2D', r);
	    let s = getSpace();
	    let q = vec2(length(vec3(s.x, s.z, 0)) - r, s.y);
	    setSDF(sdf(q, ...args));
	  }
	}

	//https://iquilezles.org/www/articles/distfunctions/distfunctions.htm
	function extrude2D(sdf) {
		return (h, ...args) => {
			ensureScalar('extrude2D', h);
			let s = getSpace();
			let d = sdf(vec2(s.x, s.y), ...args);
			let w = vec2(d, abs(s.z) - h );
			let t = vec3(max(w.x, 0.0), max(w.y, 0.0), 0);
			setSDF(min(max(w.x,w.y),0.0) + length(t));
		}
	}

	function getSpherical() {
		return toSpherical(getSpace());	
	}

	function mirrorN(iterations, scale) {
		ensureScalar('mirrorN', scale);
		for (let i=iterations-1; i >= 0; i--) {
		  mirrorXYZ();
		  displace(scale * pow(2, i));
		}
	  }
	  
	function grid(num=2, scale=.2, roundness=.05) {
		// ensureScalar('num', num);
		ensureScalar('num', scale);
		ensureScalar('num', roundness);
		// num = collapseToString(num);
		// scale = collapseToString(scale);
		// roundness = collapseToString(roundness);
		shape(() => {
		  mirrorN(num, scale);
		  boxFrame(vec3(scale), 0);
		  expand(roundness*scale);
		})();
	}
	
	function repeatLinear(scale, spacing, counts) {
		ensureDims("repeatSpace", 3, scale);
		ensureDims("repeatSpace", 3, spacing);
		ensureDims("repeatSpace", 3, counts);
		spacing *= 2 * scale;
		counts -= 1;
		const s = getSpace();
		const rounded = floor(s/spacing + 0.5);
		const clamped = vec3(
			clamp(rounded.x, -1*counts.x, counts.x),
			clamp(rounded.y, -1*counts.y, counts.y),
			clamp(rounded.z, -1*counts.z, counts.z)
		);
		displace(spacing*clamped);
		// return instance x, y, z index 
		// and instances local coordinates
		const coordScaled = s / (spacing);
		const index = floor(coordScaled + 0.5);
		return { "index": index, "local": coordScaled-index };
	}
	
	// based on https://mercury.sexy/hg_sdf/
	function repeatRadial(repeats) {
		const s = getSpace();
		const p = vec3(s.x, 0, s.z);
		const angle = 2 * PI / repeats;
		const a = atan(p.z, p.x) + angle / 2;
		const r = length(p);
		let c = floor(a / angle);
		const ma = mod(a, angle) - angle / 2;
		const px = cos(ma) * r;
		const pz = sin(ma) * r;
		setSpace(vec3(px, s.y, pz));
		const absC = abs(c);
		// account for odd number of repeats
		const diff = step(absC, (repeats/2));
		c = diff*absC + (1-diff)*c;
		// return radial index
		return c;
	}
	
	function scaleShape(primitive, factor) {
		return (...args) => {
			setSpace(getSpace()/factor);
			primitive(...args);
			setSDF(getSDF()*factor);
		};
	}
	
	// Define any code that needs to reference auto generated from bindings.js code here
	let postGeneratedFunctions = replaceMathOps([
		getSpherical,
		fresnel,
		revolve2D, 
		extrude2D,
		mirrorN,
		grid,
		repeatLinear,
		repeatRadial,
		scaleShape
	].map(el => el.toString()).join('\n'));

	eval(generatedJSFuncsSource + postGeneratedFunctions + userProvidedSrc);
	
	if(enable2DFlag) {
		setSDF(0);
	}
	let geoFinal = userGLSL + '\n' +  buildGeoSource(geoSrc);
	let colorFinal = buildColorSource(colorSrc, useLighting);
	
	return {
		uniforms: uniforms,
		stepSizeConstant: stepSizeConstant,
		maxIterations: maxIterations,
		userGLSL: userGLSL,
		geoGLSL: geoFinal,
		colorGLSL: colorFinal,
		error: error
	};
}
