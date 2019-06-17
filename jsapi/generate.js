import {
	geometryFunctions, 
	mathFunctions, 
	glslBuiltInOneToOne, 
	glslBuiltInOther
} from './glsl-built-in.js';

import * as escodegen from 'escodegen';
import * as esprima from 'esprima';

function buildGeoSource(geo) {
	return `
float surfaceDistance(vec3 p) {
    vec3 normal = vec3(0.0,1.0,0.0);
    float d = 100.0;
    vec3 op = p;
${geo}
    return d;
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
    return color*light*occ;
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


export function sourceGenerator(userProvidedSrc) {

	let tree = esprima.parse(userProvidedSrc);
	replaceBinaryOp(tree);
	userProvidedSrc = escodegen.generate(tree);

	let generatedJSFuncsSource = "";
	let geoSrc = "";
	let colorSrc = "";
	let varCount = 0;
	let primCount = 0;
	let useLighting = true;
	let debug = false;

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
	let currentMode = modes.UNION;
	let blendAmount = 0.0;
	let mixAmount = 0.0;

	let time = new float("time", true);
	let x = new float("p.x", true);
	let y = new float("p.y", true);
	let z = new float("p.z", true);
	let p = new vec3("p", null, null, true);
	let mouse = new vec3("mouse", null, null, true);
	let normal = new vec3("normal", null, null, true);

	let currentColor = new vec3("color", null, null, true);

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
		currentMode = modes.UNION;
	}

	function difference() {
		currentMode = modes.DIFFERENCE;
	}

	function intersect() {
		currentMode = modes.INTERSECT;
	}

	function blend(amount) {
		currentMode = modes.BLEND;
		ensureScalar("blend",amount);
		blendAmount = amount;
	}

	function mixGeo(amount) {
		currentMode = modes.MIXGEO;
		ensureScalar("mixGeo",amount);
		mixAmount = amount;
	}

	function getMode() {
		switch (currentMode) {
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
				return ["smoothAdd",blendAmount];
				break;
			case modes.MIXGEO:
				return ["mix",mixAmount];
				break;
			default:
				return ["add"];
		}
	}

	function applyMode(prim) {
		let cmode = getMode();
		let primName = "prim_" + primCount;
		primCount += 1;
		appendSources("float " + primName + " = " + prim + ";\n");
		if (additiveModes.includes(currentMode)) {
			appendColorSource("if (" + primName + " < d) { color = selectedColor; }\n" );
		}
		appendSources("d = "+ cmode[0] + "( " + primName + ", d " +
			(cmode.length > 1 ? "," + collapseToString(cmode[1]) : "") + " );\n");
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
		primitivesJS += "    applyMode(\"" + funcName + "(p, \" + ";
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
		appendSources("p = op;\n");
	}

	function displace(xc, yc, zc) {
		if (yc === undefined || zc === undefined) {
			appendSources("p -= " + collapseToString(xc) + ";\n");
		} else {
			ensureScalar("displace",xc);
			ensureScalar("displace",yc);
			ensureScalar("displace",zc);
			appendSources("p -= vec3( " + collapseToString(xc) + ", " 
								 + collapseToString(yc) + ", " 
								 + collapseToString(zc) + ");\n");
		}
	}

	function expand(amount) {
		ensureScalar("expand",amount);
		appendSources("d -= " + collapseToString(amount) + ";\n");
	}

	function shell(depth) {
		ensureScalar("shell",depth);
		appendSources("d = shell( d," + collapseToString(depth) + ");\n");
	}

	function rotateX(angle) {
		ensureScalar("rotateX",angle);
		appendSources("p.yz = p.yz*rot2(" + collapseToString(angle) + ");\n");
	}

	function rotateY(angle) {
		ensureScalar("rotateY",angle);
		appendSources("p.xz = p.xz*rot2(" + collapseToString(angle) + ");\n");
	}

	function rotateZ(angle) {
		ensureScalar("rotateZ",angle);
		appendSources("p.xy = p.xy*rot2(" + collapseToString(angle) + ");\n");
	}

	function mirrorX() {
		appendSources("p.x = abs(p.x);\n");
	}

	function mirrorY() {
		appendSources("p.y = abs(p.y);\n");
	}

	function mirrorZ() {
		appendSources("p.z = abs(p.z);\n");
	}

	function mirrorXYZ() {
		appendSources("p = abs(p);\n");
	}

	// Color/Lighting

	function color(col, green, blue) {
		if (green !== undefined) {
			ensureScalar("color", col);
			ensureScalar("color", green);
			ensureScalar("color", blue);
			appendColorSource("selectedColor = vec3(" + 
				collapseToString(col) + ", " + 
				collapseToString(green) + ", " +
				collapseToString(blue) + ");\n");
		} else {
			if (col.type !== 'vec3') compileError("color must be vec3");
			appendColorSource("selectedColor = " + collapseToString(col) + ";\n");
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

	eval( generatedJSFuncsSource + userProvidedSrc );

	let geoFinal = buildGeoSource(geoSrc);
	let colorFinal = buildColorSource(colorSrc, useLighting);

	return {
		geoGLSL: geoFinal,
		colorGLSL: colorFinal
	};
}
