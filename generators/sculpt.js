/**
 * Converts sculpt lang to JS which generates GLSL
 */

import {
	geometryFunctions, 
	mathFunctions, 
	glslBuiltInOneToOne, 
	glslBuiltInOther
} from '../glsl/bindings.js';

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
		scope_0_material
		);
	#else
	return scope_0_material.albedo*simpleLighting(p, normal, lightDirection);*occ;
	#endif
}`;
}

let _operators = {
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'-': (a, b) => a - b,
	'+': (a, b) => a + b,
	'==': (a, b) => a == b,
	'!=': (a, b) => a != b,
	'===': (a, b) => a === b,
	'!==': (a, b) => a !== b,
	'>': (a, b) => a > b,
	'>=': (a, b) => a >= b,
	'<': (a, b) => a < b,
	'<=': (a, b) => a <= b,
}

// Converts binary math _operators to our own version
function replaceBinaryOp(syntaxTree) {

	if (typeof syntaxTree === 'object') {
		for (let node in syntaxTree) {
			if (syntaxTree.hasOwnProperty(node)) {
				replaceBinaryOp(syntaxTree[node]);
			}
		}
	}
	if(!syntaxTree) {
		console.log('no syntax tree')
		return;
	}

	// if (syntaxTree.type === 'UnaryExpression') {
	// 	let op = syntaxTree.operator;
	// 	if(op === '!') {
	// 		syntaxTree.callee = { type: 'Identifier', name: 'not' };
	// 		syntaxTree.type = 'CallExpression';
	// 		syntaxTree.arguments = [syntaxTree.argument];
	// 		delete syntaxTree.operator;
	// 	}
	// }

	if ( syntaxTree['type'] === 'BinaryExpression') {
		let op = syntaxTree.operator;

		console.log('hit Binary Expression')
		if(op in _operators) {
			let symbol = op
			// let operation = _operators[op];
			console.log(op, 'is in ', _operators);
			if(op === '===') {
				symbol = '==';
			} else if(op === '!==') {
				symbol = '!=';
			}

			syntaxTree['callee'] = { type: 'Identifier', name: 'binaryOp' };
			syntaxTree['type'] = 'CallExpression';
			syntaxTree['arguments'] = [syntaxTree.left, syntaxTree.right, symbol];
			syntaxTree['operator'] = undefined;
			console.log('set syntax tree');
		}
	}
}

function replaceOperatorOverload(syntaxTree) {
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
}

function replaceSliderInput(syntaxTree) {
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
		if (d && d.init && d.init.callee !== undefined && d.init.callee.name === 'input') {
			d.init.arguments.unshift({ type: "Literal", value: name, raw: name });
		}
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
		{name:'sculptureCenter', type: 'vec3', value: [0,0,0]},
		{name:'mouse', type: 'vec3', value: [0.5,0.5,0.5]},
		{name:'stepSize', type: 'float', value: 0.85}
	];
}

export function sculptToGLSL(userProvidedSrc) {
	const PI = Math.PI;
	const TWO_PI = Math.PI * 2;
	const TAU = TWO_PI;
	
	let debug = false;
	let tree = esprima.parse(userProvidedSrc);
	replaceOperatorOverload(tree);
	// replaceBinaryOp(tree);
	replaceSliderInput(tree);
	console.log('tree', tree)
	try {
		userProvidedSrc = escodegen.generate(tree);
	} catch (e) {
		console.log('errors')
		console.log(e)
	}
	console.log('userProvidedSrc', userProvidedSrc)
	if (debug) {
		console.log('tree', tree);
	}

	let generatedJSFuncsSource = "";
	let geoSrc = "";
	let colorSrc = "";
	let varCount = 0;
	let primCount = 0;
	let stateCount = 0;
	let useLighting = true;
	let stateStack = [];
	let uniforms = baseUniforms();

	let stepSizeConstant = 0.85;

	////////////////////////////////////////////////////////////
	// Generates JS from headers referenced in the bindings.js
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

	// Modes (prepend these with GEO or something to indicate they are geometry modes?)
	// Also 'mix' name needs to be changed to avoid collision with built in

	function union() {
		stateStack[stateStack.length-1].mode = modes.UNION;
	}

	function difference() {
		stateStack[stateStack.length-1].mode = modes.DIFFERENCE;
	}

	function intersect() {
		stateStack[stateStack.length-1].mode = modes.INTERSECT;
	}

	function blend(amount) {
		stateStack[stateStack.length-1].mode = modes.BLEND;
		ensureScalar("blend",amount);
		stateStack[stateStack.length-1].blendAmount = amount;
	}

	function mixGeo(amount) {
		stateStack[stateStack.length-1].mode = modes.MIXGEO;
		ensureScalar("mixGeo",amount);
		stateStack[stateStack.length-1].mixAmount = amount;
	}

	function getMode() {
		switch (getCurrentState().mode) {
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
				return ["mix",getCurrentState().mixAmount];
				break;
			default:
				return ["add"];
		}
	}

	function applyMode(prim, finalCol) {
		let cmode = getMode();
		let primName = "prim_" + primCount;
		primCount += 1;
		appendSources("float " + primName + " = " + prim + ";\n");
		if (additiveModes.includes(getCurrentState().mode)) {
			let selectedCC = finalCol !== undefined ? finalCol : getCurrentMaterial();
			appendColorSource("if (" + primName + " < "+ getCurrentDist() + ") { " + getMainMaterial() + " = " + selectedCC + "; }\n" );
		}
		appendSources(getCurrentDist() + " = "+ cmode[0] + "( " + primName + ", " + getCurrentDist() +  " " +
			(cmode.length > 1 ? "," + collapseToString(cmode[1]) : "") + " );\n");
	}

	function getSpace() {
		return getCurrentState().p;
	}
	
	function getSpherical() {
		return toSpherical(getSpace());	
	}

	function pushState() {
		stateStack.push({
			id: "scope_" + stateCount + "_",
			mode: modes.UNION,
			blendAmount: 0.0,
			mixAmount: 0.0,
		});
		appendSources("float " + getCurrentDist() + " = 100.0;\n");
		let lastP = stateStack.length > 1 ? stateStack[stateStack.length-2].id+"p" : "p";
		let lastMat = stateStack.length > 1 ? stateStack[stateStack.length-2].id+"currentMaterial" : "material";
		appendSources("vec3 " + getCurrentPos() + " = " + lastP + ";\n");
		appendColorSource("Material " + getMainMaterial() + " = " + lastMat + ";\n");
		appendColorSource("Material " + getCurrentMaterial() + " = " + lastMat + ";\n");
		stateStack[stateStack.length-1].p = vec3(stateStack[stateStack.length-1].id+"p", null, null, true);
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

	function binaryOp(left, right, symbol) {
		console.log('hit binaryOP')
		let expression = _operators[symbol];
		
		if (typeof left === 'number' && typeof right === 'number') return expression(left, right);
		console.log('Called expression')
		left = tryMakeNum(left);
		right = tryMakeNum(right);
		console.log('made left and right')
		// if (debug) {
		console.log(`left: ${left} ${symbol} ${right}`);
		// }
		
		if ( symbol === '==' || symbol === '!=' ||
			symbol === '>' || symbol === '>=' || symbol === '<' || symbol === '<=') {
			return new makeVar(`(${collapseToString(left)} ${symbol} ${collapseToString(right)})`, 'bool', 1, inline);
		} else {
			ensureGroupOp(symbol, left, right);
			// called for *, -, +, /
			let dims = Math.max(left.dims, right.dims);
			return new makeVarWithDims(`(${collapseToString(left)} ${symbol} ${collapseToString(right)})`, dims);
		}
		
	}

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
	eval( generatedJSFuncsSource + userProvidedSrc );
	let geoFinal = buildGeoSource(geoSrc);
	let colorFinal = buildColorSource(colorSrc, useLighting);
	return {
		uniforms: uniforms,
		stepSizeConstant: stepSizeConstant,
		geoGLSL: geoFinal,
		colorGLSL: colorFinal,
		error: error
	};
}
