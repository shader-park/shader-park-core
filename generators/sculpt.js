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
    float d = 100.0;
    vec3 op = p;
${geo}
    return scope_0_d;
}`;
}

function buildColorSource(col, useLighting) {
	let lgt = useLighting ? '    light = simpleLighting(p, normal, lightDirection);' : '';
	return `
vec3 shade(vec3 p, vec3 normal) {
    float d = 100.0;
    vec3 op = p;
	vec3 lightDirection = vec3(0.0, 1.0, 0.0);
	float light = 1.0;
    float occ = 1.0;
    vec3 color = vec3(1.0,1.0,1.0);
    vec3 selectedColor = vec3(1.0,1.0,1.0);
${col}
${lgt}
    return scope_0_color*light*occ;
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
			if (d.init.callee !== undefined && d.init.callee.name === 'input') {
				d.init.arguments.unshift({ type: "Literal", value: name, raw: name });
			}
		}
	} catch (e) {
		console.error(e);
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

	let debug = false;
	let tree = esprima.parse(userProvidedSrc);
	replaceBinaryOp(tree);
	// replaceSliderInput(tree);
	userProvidedSrc = escodegen.generate(tree);
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

	function getMainColor() {
		return getCurrentState().id+"color";
	}

	function getCurrentColor() {
		return getCurrentState().id+"currentColor";
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
		if (typeof source !== 'string') {
			source = "vec2(" + collapseToString(source) + ", " 
							 + collapseToString(y) + ")";
		}
		let self = new makeVar(source, 'vec2', 2, inline);
		self.x = new makeVarWithDims(self.name + ".x", 1, true); //self.name + ".x";
		self.y = new makeVarWithDims(self.name + ".y", 1, true); //self.name + ".y";
		return self;
	}

	function vec3(source, y, z, inline) {
		if (typeof source !== 'string') {
			source = "vec3(" + collapseToString(source) + ", " 
							 + collapseToString(y) + ", " 
							 + collapseToString(z) + ")";
		}
		let self = new makeVar(source, 'vec3', 3, inline);
		self.x = new makeVarWithDims(self.name + ".x", 1, true);//self.name + ".x";
		self.y = new makeVarWithDims(self.name + ".y", 1, true);//self.name + ".y";
		self.z = new makeVarWithDims(self.name + ".z", 1, true);//self.name + ".z";
		return self;
	}

	function vec4(source, y, z, w, inline) {
		if (typeof source !== 'string') {
			source = "vec4(" + collapseToString(source) + ", " 
							 + collapseToString(y) + ", " 
							 + collapseToString(z) + ", "
							 + collapseToString(w) + ")";
		}
		let self = new makeVar(source, 'vec4', 4, inline);
		self.x = new makeVarWithDims(self.name + ".x", 1, true);//self.name + ".x";
		self.y = new makeVarWithDims(self.name + ".y", 1, true);//self.name + ".y";
		self.z = new makeVarWithDims(self.name + ".z", 1, true);//self.name + ".z";
		self.w = new makeVarWithDims(self.name + ".w", 1, true);//self.name + ".w";
		return self;
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

	function compileError(err) {
		// todo: throw actual error (and color error?)
		console.log(err, " char: " + geoSrc.length);
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
			let selectedCC = finalCol !== undefined ? finalCol : getCurrentColor();
			appendColorSource("if (" + primName + " < "+ getCurrentDist() + ") { " + getMainColor() + " = " + selectedCC + "; }\n" );
		}
		appendSources(getCurrentDist() + " = "+ cmode[0] + "( " + primName + ", " + getCurrentDist() +  " " +
			(cmode.length > 1 ? "," + collapseToString(cmode[1]) : "") + " );\n");
	}

	function getPosition() {
		return getCurrentState().p;
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
		let lastCol = stateStack.length > 1 ? stateStack[stateStack.length-2].id+"currentColor" : "color";
		appendSources("vec3 " + getCurrentPos() + " = " + lastP + ";\n");
		appendColorSource("vec3 " + getMainColor() + " = " + lastCol + ";\n");
		appendColorSource("vec3 " + getCurrentColor() + " = " + lastCol + ";\n");
		stateStack[stateStack.length-1].p = vec3(stateStack[stateStack.length-1].id+"p", null, null, true);
                stateCount++;
	}

	function popState() {
		let lastDist = getCurrentDist();
		let lastColy = getMainColor();
		stateStack.pop();
		applyMode(lastDist, lastColy);
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
	
	function applyDistance(dist) {
		ensureScalar("applyDistance", dist);
		applyMode(collapseToString(dist));
	}

    let primitivesJS = "";
	// generate js which generates glsl geometry
    for (let [funcName, body] of Object.entries(geometryFunctions)) {
		let argList = body['args'];
		primitivesJS += "function " + funcName + "(";
		for (let argIdx = 0;argIdx<argList.length; argIdx++) {
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
		for (let argIdx = 0; argIdx<argList.length; argIdx++) {
			primitivesJS += "collapseToString(arg_" + argIdx + ") + ";
			if (argIdx < argList.length-1) primitivesJS += "\", \" + ";
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
			for (let argIdx = 0; argIdx<argList.length; argIdx++) {
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
			for (let argIdx = 0; argIdx<argList.length; argIdx++) {
				wrapperSrc += "arg_" + argIdx + " + ";
				if (argIdx < argList.length-1) wrapperSrc += "\", \" + ";
			}
			wrapperSrc += "\")\", " + returnType + ");\n}\n";
		}
		return wrapperSrc;
	}
	
	let mathFunctionsJS = generateGLSLWrapper(mathFunctions);
	generatedJSFuncsSource += mathFunctionsJS;

	let builtInOtherJS = generateGLSLWrapper(glslBuiltInOther);
	generatedJSFuncsSource += builtInOtherJS;

	
	// constants.forEach(constant => {
	// 	generatedJSFuncsSource += `let ${constant};\n`
	// });

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

	function expand(amount) {
		ensureScalar("expand",amount);
		appendSources(getCurrentDist() + " -= " + collapseToString(amount) + ";\n");
	}

	function shell(depth) {
		ensureScalar("shell",depth);
		appendSources(getCurrentDist() + " = shell( " + getCurrentDist() +  "," + collapseToString(depth) + ");\n");
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

	// Color/Lighting

	function color(col, green, blue) {
		if (green !== undefined) {
			ensureScalar("color", col);
			ensureScalar("color", green);
			ensureScalar("color", blue);
			appendColorSource(getCurrentColor() + " = vec3(" + 
				collapseToString(col) + ", " + 
				collapseToString(green) + ", " +
				collapseToString(blue) + ");\n");
		} else {
			if (col.type !== 'vec3') compileError("color must be vec3");
			appendColorSource(getCurrentColor() + " = " + collapseToString(col) + ";\n");
		}
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
		appendColorSource("occ = mix(1.0, occlusion(op,normal), " + amt + ");\n");
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
	try {
		eval( generatedJSFuncsSource + userProvidedSrc );
	} catch (e) {
		error = e;
	}

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
