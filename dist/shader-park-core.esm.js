// Numbers represent type - 
// 1:float 2:vec2 3:vec3 4:vec4

const geometryFunctions = {
    sphere: { args: [1] },
    line: { args: [3,3,1] },
    cone: { args: [1,1] },
    roundCone: { args: [3,3,1,1] },
    plane: { args: [1,1,1,1] },
};

const mathFunctions = {
    nsin: { args: [1], ret:1 },
    ncos: { args: [1], ret:1 },
    round: { args: [1], ret:1 },
    hsv2rgb: { args: [3], ret:3 },
    rgb2hsv: { args: [3], ret:3 },
    toSpherical: { args: [3], ret:3 },
    fromSpherical: { args: [3], ret:3 },
    getRayDirection: { args: [], ret:3 },
    osc: { args: [1], ret:1 },
    _hash33: { args: [3], ret:1 },
    noise: { args: [3], ret:1 },
    fractalNoise: { args: [3], ret:1 },
    sphericalDistribution: { args: [3,1], ret:4 },
};

// these all have a single input/output and are overloaded for 
// all types so a list of names is all we need to generate them
const glslBuiltInOneToOne = [
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "exp",
    "log",
    "exp2",
    "log2",
    "sqrt",
    "inversesqrt",
    "abs",
    "sign",
    "floor",
    "ceil",
    "fract",
];

// need better overloading system
const glslBuiltInOther = {
    // overload pow somehow?
    pow: { args:[1,1], ret:1 },
    mod: { args: [1,1], ret:1 },
    min: { args: [1,1], ret:1 },
    max: { args: [1,1], ret:1 },
    atan: { args: [1,1], ret:1 },
    clamp: { args: [1,1,1], ret:1 },
    step: { args: [1, 1], ret: 1 },
    smoothstep: { args: [1,1,1], ret:1 },
    // also overload length for vec3 and vec2?
    length: { args: [3], ret: 1 },
    distance: { args: [3,3], ret:1 },
    dot: { args: [3,3], ret: 1 },
    cross: { args: [3,3], ret:3 },
    normalize: { args: [3], ret:3 },
    reflect: { args: [3,3], ret:3 },
    refract: { args: [3,3], ret:3 },
};

// let arg = {
//     'mix' : (a, b, c) => (a.dim === b.dim && (c.dim === 1 || c.dim === a.dim))? a.dim: -1,
// };

function convertFunctionToString(source) {
    if (typeof source === "function") {
        source = source.toString();
        return source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
    } else if (!(typeof source === "string")) {
        throw "your Shader Park code requires the source code to be a function, or a string"
    }
    return source;
}

/**
 * Converts sculpt lang to JS which generates GLSL
 */

// import * as escodegen from 'escodegen';
// import * as esprima from 'esprima';

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
				};

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
	}
}

function uniformsToGLSL(uniforms) {
	let uniformsHeader = '';
	for (let i=0; i<uniforms.length; i++) {
		let uniform = uniforms[i];
		uniformsHeader += `uniform ${uniform.type} ${uniform.name};\n`;
	}
	return uniformsHeader;
}

function baseUniforms() {
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

function bindStaticData(staticData, spCode) {
	spCode = convertFunctionToString(spCode);
	return `const staticData = JSON.parse(\`${JSON.stringify(staticData)}\`)\n` + spCode;
}

function sculptToGLSL(userProvidedSrc) {
	const PI = Math.PI;
	const TWO_PI = Math.PI * 2;
	const TAU = TWO_PI;
	
	let debug = false;
	// let tree = esprima.parse(userProvidedSrc);
	// replaceOperatorOverload(tree);
	// replaceBinaryOp(tree);
	// replaceSliderInput(tree);
	// userProvidedSrc = escodegen.generate(tree);
	// userProvidedSrc = {}
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
	let enable2DFlag = false;
	let stateStack = [];
	let uniforms = baseUniforms();

	let stepSizeConstant = 0.85;
	let maxIterations = 300;

	////////////////////////////////////////////////////////////
	// Generates JS from headers referenced in the bindings.js

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
		arg_0 = tryMakeNum(arg_0);
		arg_1 = tryMakeNum(arg_1);
		arg_2 = tryMakeNum(arg_2);
		return new makeVarWithDims(`mix(${arg_0}, ${arg_1}, ${arg_2})`, arg_0.dims);
	}


	function ensureSameDims(funcName, ...args) {
		let dims = args.map(arg => arg.dim);
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
		};
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
		};
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

	function getSpherical() {
		return toSpherical(getSpace());	
	}
	
	// Define any code that needs to reference auto generated from bindings.js code here
	let postGeneratedFunctions = [
		getSpherical,
	].map(el => el.toString()).join('\n');
	
	eval(generatedJSFuncsSource + postGeneratedFunctions + userProvidedSrc );
	
	if(enable2DFlag) {
		setSDF(0);
	}
	let geoFinal = buildGeoSource(geoSrc);
	let colorFinal = buildColorSource(colorSrc, useLighting);
	
	return {
		uniforms: uniforms,
		stepSizeConstant: stepSizeConstant,
		maxIterations: maxIterations,
		geoGLSL: geoFinal,
		colorGLSL: colorFinal,
		error: error
	};
}

const defaultFragSourceGLSL = `float surfaceDistance(vec3 p) {
    float d = sphere(p, 0.3);
	return d;
}

vec3 shade(vec3 p, vec3 normal) {
    vec3 lightDirection = vec3(0.0, 1.0, 0.0);
    float light = simpleLighting(p, normal, lightDirection);
    vec3 color = vec3(1.0, 1.0, 1.0);
	return color*light;
}
`;

const threeJSVertexSource = `
varying vec4 worldPos;
//varying vec2 vUv;
varying vec3 sculptureCenter;
void main()
{
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    worldPos = modelMatrix*vec4(position,1.0);
    sculptureCenter = (modelMatrix * vec4(0., 0., 0., 1.)).xyz;
    //vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const minimalVertexSource = `
attribute vec3 coordinates;
varying vec3 sculptureCenter;
void main(void) {
     sculptureCenter = vec3(0.0);
     gl_Position = vec4(coordinates, 1.0);
}`;

const threeHeader = `
#define GLSL_NEED_ROUND
uniform mat4 projectionMatrix;
uniform sampler2D msdf;

//varying vec2 vUv;
varying vec4 worldPos;
varying vec3 sculptureCenter;
`;

const minimalHeader = `
precision highp float;
#define GLSL_NEED_ROUND
uniform mat4 projectionMatrix;
varying vec3 sculptureCenter;
#define cameraPosition vec3(0.0,0.0,-2.0)
#define vUv vec2(0.0)
#define worldPos vec4(vec2((gl_FragCoord.x/resolution.x-0.5)*(resolution.x/resolution.y),gl_FragCoord.y/resolution.y-0.5)*1.75,0.0,0.0)
`;

const usePBRHeader = '#define USE_PBR\n';
const useHemisphereLight = '#define HEMISPHERE_LIGHT\n';

const sculptureStarterCode = `
float surfaceDistance(vec3 p);

const float PI = 3.14159265;
const float TAU = PI*2.0;
const float TWO_PI = TAU;

const float max_dist = 100.0;
const float intersection_threshold = 0.00001;

struct Material {
    vec3 albedo;
    float metallic;
    float roughness;
    float ao;
};

Material blendMaterial(Material a, Material b, float amount) {
    return Material(
        mix(a.albedo, b.albedo, amount), 
        mix(a.metallic, b.metallic, amount), 
        mix(a.roughness, b.roughness, amount), 
        mix(a.ao, b.ao, amount)
    );
}

// Trig functions normalized to the range 0.0-1.0
float nsin(float x) {
    return sin(x)*0.5+0.5;
}

float ncos(float x) {
    return cos(x)*0.5+0.5;
}

#ifdef GLSL_NEED_ROUND
float round(float x) {
    return floor(x+0.5);
}
vec2 round(vec2 x) {
    return floor(x+0.5);
}
vec3 round(vec3 x) {
    return floor(x+0.5);
}
vec4 round(vec4 x) {
    return floor(x+0.5);
}
#endif

float softSquare(float x, int pw) {
    return 1.0/(pow(tan(x),float(pw+1)*2.0)+1.0);
}

// Simple oscillators 

float osc(float freq, float amp, float base, float phase) {
    return base+amp*sin(TWO_PI*(freq*time+phase));
}

float osc(float freq, float amp, float base) {
    return osc(freq, amp, base, 0.0);
}

float osc(float freq, float amp) {
    return osc(freq, amp, 1.0);
}

float osc(float freq) {
    return osc(freq, 0.5);
}

float osc() {
    return osc(1.0);
}

// Color Conversion
// https://www.shadertoy.com/view/lsS3Wc
vec3 hsv2rgb( vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 rgb2hsv( vec3 c)
{
    const float eps = 0.0000001;
    vec4 k = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z<c.y) ? 1.0 : 0.0);
    vec4 q = mix(vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x<c.x) ? 1.0 : 0.0);
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0*d+eps)), d / (q.x+eps), q.x);
}


// Primitives

float line(vec3 p, vec3 a, vec3 b) {
	vec3 pa = p-a;
  	vec3 ba = b-a;
	float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  	return length(pa - ba*t);
}

//line with radius
float line( vec3 p, vec3 a, vec3 b, float radius ){
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - radius;
}

float sphere( vec3 p, float size ){
  return length(p)-size;
}

float uBox( vec3 p, vec3 b ){
  return length(max(abs(p)-b,0.0));
}

float uRoundBox( vec3 p, vec3 b, float r ){
  return length(max(abs(p)-b,0.0))-r;
}

float box( vec3 p, vec3 box ){
  vec3 d = abs(p) - box;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float box( vec3 p, float bx, float by, float bz) {
    vec3 box = vec3(bx,by,bz);
    vec3 d = abs(p) - box;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float roundedBox( vec3 p, vec3 box , float r){
  return length(max(abs(p)-box,0.0))-r;
}

float torus( vec3 p, vec2 t ){
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float torus( vec3 p, float tx, float ty ){
    vec2 q = vec2(length(p.xz)-tx,p.y);
    return length(q)-ty;
}

float infCylinder( vec3 p, vec3 c )
{
  return length(p.xz-c.xy)-c.z;
}

float cylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float cylinder( vec3 p, float hx, float hy)
{
    return cylinder(p, vec2(hx,hy));
}

float cone( vec3 p, vec2 c )
{
    // c must be normalized
    float q = length(p.xy);
    return dot(c,vec2(q,p.z));
}

float plane( vec3 p, vec4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}

float plane( vec3 p, float nx, float ny, float nz, float nw)
{
  // n must be normalized
  return dot(p,normalize(vec3(nx,ny,nz))) + nw;
}

float hexPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

float triPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

float capsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float triangularPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

float cappedCone( vec3 p, vec3 c )
{
    vec2 q = vec2( length(p.xz), p.y );
    vec2 v = vec2( c.z*c.y/c.x, -c.z );
    vec2 w = v - q;
    vec2 vv = vec2( dot(v,v), v.x*v.x );
    vec2 qv = vec2( dot(v,w), v.x*w.x );
    vec2 d = max(qv,0.0)*qv/vv;
    return sqrt( dot(w,w) - max(d.x,d.y) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

float roundCone(vec3 p, vec3 a, vec3 b, float r1, float r2)
{
    // sampling independent computations (only depend on shape)
    vec3  ba = b - a;
    float l2 = dot(ba,ba);
    float rr = r1 - r2;
    float a2 = l2 - rr*rr;
    float il2 = 1.0/l2;
    
    // sampling dependant computations
    vec3 pa = p - a;
    float y = dot(pa,ba);
    float z = y - l2;
    vec3 rv = pa*l2 - ba*y;
    float x2 = dot(rv,rv);
    float y2 = y*y*l2;
    float z2 = z*z*l2;

    // single square root!
    float k = sign(rr)*rr*rr*x2;
    if( sign(z)*a2*z2 > k ) return  sqrt(x2 + z2)        *il2 - r2;
    if( sign(y)*a2*y2 < k ) return  sqrt(x2 + y2)        *il2 - r1;
                            return (sqrt(x2*a2*il2)+y*rr)*il2 - r1;
}

float ellipsoid( vec3 p, vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

vec3 toSpherical(vec3 p) {
    float phi = atan(p.x,p.z);
    float r = length(p);
    float theta = acos(-p.y/r);
    return vec3(r,theta,phi);
}

vec3 fromSpherical(vec3 p) {
    return vec3(p.x*sin(p.y)*cos(p.z), p.x*sin(p.y)*sin(p.z), p.x*cos(p.y));
}

float dot2( vec3 v ) { return dot(v,v); }

float uTriangle( vec3 p, vec3 a, vec3 b, vec3 c )
{
    vec3 ba = b - a; vec3 pa = p - a;
    vec3 cb = c - b; vec3 pb = p - b;
    vec3 ac = a - c; vec3 pc = p - c;
    vec3 nor = cross( ba, ac );
    return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
     sign(dot(cross(cb,nor),pb)) +
     sign(dot(cross(ac,nor),pc))<2.0)
     ?
     min( min(
     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
     dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc) )
     :
     dot(nor,pa)*dot(nor,pa)/dot2(nor) );
}

float add( float d1, float d2 )
{
    return min(d1,d2);
}

float add(float d1, float d2, float d3) {
   return min(d1, min(d2,d3));
}

float add(float d1, float d2, float d3, float d4) {
    return min(min(d1,d2),min(d3,d4));
}

float add(float d1, float d2, float d3, float d4, float d5) {
    return min(min(min(d1,d2), min(d3,d4)),d5);
}

float add(float d1, float d2, float d3, float d4, float d5, float d6) {
    return min(min(min(d1,d2),min(d3,d4)),min(d5,d6));
}

float add(float d1, float d2, float d3, float d4, float d5, float d6, float d7) {
    return min(min(min(d1,d2),min(d3,d4)),min(min(d5,d6),d7));
}

float subtract( float d1, float d2 )
{
    return max(-d1,d2);
}

float intersect( float d1, float d2 )
{
    return max(d1,d2);
}

float shell(float d, float thickness) {
    return abs(d)-thickness;
}

vec3 repeat3D(vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

float repeat1D(float p, float size)
{
	float halfSize = size * 0.5;
	float c = floor((p + halfSize) / size);
  	p = mod(p + halfSize, size)-halfSize;
  	return c;
}

mat2 rot2(float a){
    float c = cos(a); float s = sin(a);
	return mat2(c, s, -s, c);
}

// polynomial smooth min (k = 0.1) (from IQ)
float smoothAdd( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float smoothSubtract(float a,float b, float k)
{
    return -smoothAdd(-a,-b,k);
}

vec2 _hash( vec2 p ) // replace this by something better
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor( p + (p.x+p.y)*K1 );
	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = step(a.yx,a.xy);    
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h*h*h*h*vec3( dot(a,_hash(i+0.0)), dot(b,_hash(i+o)), dot(c,_hash(i+1.0)));
    return dot( n, vec3(70.0) );
}

vec3 _hash33(vec3 p3)
{
    p3 = fract(p3 * vec3(.1031,.11369,.13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

// simplex noise from https://www.shadertoy.com/view/4sc3z2
float noise(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    
    // thx nikita: https://www.shadertoy.com/view/XsX3zB
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - 1.0 * K2);
    vec3 d2 = d0 - (i2 - 2.0 * K2);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);
    
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, _hash33(i)), dot(d1, _hash33(i + i1)), dot(d2, _hash33(i + i2)), dot(d3, _hash33(i + 1.0)));
    
    return dot(vec4(31.316), n);
}

float fractalNoise(vec3 p, float falloff, int iterations) {
    float v = 0.0;
    float amp = 1.0;
    float invFalloff = 1.0/falloff;
    for (int i=0; i<10; i++) {
        v += noise(p)*amp;
	if (i>=iterations) break;
        amp *= invFalloff;
        p *= falloff;
    }
    return v;
} 

float fractalNoise(vec3 p) {
    return fractalNoise(p, 2.0, 5);
}

// Adapted from IQ's usage at https://www.shadertoy.com/view/lllXz4
// Spherical Fibonnacci points, Benjamin Keinert, Matthias Innmann,
// Michael Sanger and Marc Stamminger

const float PHI = 1.61803398875;

vec4 sphericalDistribution( vec3 p, float n )
{
    p = normalize(p);
    float m = 1.0 - 1.0/n;

    float phi = min(atan(p.y, p.x), PI), cosTheta = p.z;

    float k = max(2.0, floor( log(n * PI * sqrt(5.0) * (1.0 - cosTheta*cosTheta))/ log(PHI+1.0)));
    float Fk = pow(PHI, k)/sqrt(5.0);
    vec2 F = vec2( round(Fk), round(Fk * PHI) ); // k, k+1

    vec2 ka = 2.0*F/n;
    vec2 kb = 2.0*PI*( fract((F+1.0)*PHI) - (PHI-1.0) );

    mat2 iB = mat2( ka.y, -ka.x,
    kb.y, -kb.x ) / (ka.y*kb.x - ka.x*kb.y);

    vec2 c = floor( iB * vec2(phi, cosTheta - m));
    float d = 8.0;
    float j = 0.0;
    vec3 bestQ = vec3(0.0,0.0,8.0);
    for( int s=0; s<4; s++ )
    {
        vec2 uv = vec2( float(s-2*(s/2)), float(s/2) );

        float i = dot(F, uv + c); // all quantities are ingeters (can take a round() for extra safety)

        float phi = 2.0*PI*fract(i*PHI);
        float cosTheta = m - 2.0*i/n;
        float sinTheta = sqrt(1.0 - cosTheta*cosTheta);

        vec3 q = vec3( cos(phi)*sinTheta, sin(phi)*sinTheta, cosTheta );
        float squaredDistance = dot(q-p, q-p);
        if (squaredDistance < d)
        {
            d = squaredDistance;
            j = i;
            bestQ = q;
        }
    }
    return vec4(bestQ,sqrt(d));
}

// Compute intersection of ray and SDF. You probably won't need to modify this.
float intersect(vec3 ro, vec3 rd, float stepFraction) {
    float t = 0.0;
	for(int i = 0; i < MAX_ITERATIONS; ++i) {
		float h = surfaceDistance((ro+rd*t));
		if(h < intersection_threshold || t > max_dist) break;
		t += h*STEP_SIZE_CONSTANT;
    }
	return t;
}

vec3 getRayDirection() {
	return normalize(worldPos.xyz-cameraPosition);
}

vec3 mouseIntersection() {
    vec3 rayDirection = getRayDirection();
    return mouse+rayDirection*intersect(mouse, rayDirection, 0.8);
}

// Calculate the normal of a SDF
vec3 calcNormal( vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.0005;
    return normalize( e.xyy*surfaceDistance( pos + e.xyy ) + 
		      e.yyx*surfaceDistance( pos + e.yyx ) + 
		      e.yxy*surfaceDistance( pos + e.yxy ) + 
		      e.xxx*surfaceDistance( pos + e.xxx ) );
}

// from https://learnopengl.com/PBR/Lighting
vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}  

float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
	
    float num   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
	
    return num / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float num   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
	
    return num / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
	
    return ggx1 * ggx2;
}

// adapted from https://learnopengl.com/PBR/Lighting
vec3 pbrLighting(vec3 WordPos, vec3 N, vec3 lightdir, Material mat, vec3 backgroundColor) {

    vec3 V = -getRayDirection();
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, mat.albedo, mat.metallic);
	
    // reflectance equation
    vec3 Lo = vec3(0.0);

    // calculate per-light radiance
    vec3 L = normalize(lightdir);
    vec3 H = normalize(V + L);        
    
    // cook-torrance brdf
    float NDF = DistributionGGX(N, H, mat.roughness);        
    float G   = GeometrySmith(N, V, L, mat.roughness);      
    vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);    

    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - mat.metallic;	  
    
    vec3 numerator    = NDF * G * F;
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
    vec3 specular     = numerator / max(denominator, 0.001);  
    
    // add to outgoing radiance Lo
    float NdotL = max(dot(N, L), 0.0);                
    Lo += (kD * mat.albedo / PI + specular) * NdotL;  
  
    float hemi = 1.0;
    #ifdef HEMISPHERE_LIGHT
    // ground is black, taken into account by ambient light
    hemi = NdotL*1.25;
    #endif

    vec3 ambient = (vec3(1.2+hemi) * mat.albedo) * mat.ao;
    vec3 color = ambient + Lo*1.7;
    
    /// this section adds edge glow as if there were a white env map ///
    /// there should probably be a way to disable it //
    float lt = 1.0-max(dot(N,V),0.0);
    lt = pow(lt,6.0);
    color += 16.0*lt*(0.2+mat.albedo)*mat.metallic*backgroundColor*(1.3-mat.roughness);
    ///
    
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));
   
    return color;
}

float simpleLighting(vec3 p, vec3 normal, vec3 lightdir) {
    // Simple phong-like shading
    float value = clamp(dot(normal, normalize(lightdir)),0.0, 1.0);
    return value * 0.3 + 0.7;
}

float specularLighting(vec3 p, vec3 normal, vec3 lightDirection, float shine) {
    float lamb = clamp(dot(normal,normalize(lightDirection)),0.0,1.0);
    float spec = pow(lamb, exp(10.0*shine));
    lamb = 0.4*lamb + 0.4 + 0.2*spec;
    return lamb;
}

float shadow(vec3 p, vec3 lightDirection, float amount) {
    float t = intersect(p+0.001*lightDirection, lightDirection, stepSize);
    return t < (max_dist - 0.1) ? 1.0-amount : 1.0;
}

// From https://www.shadertoy.com/view/XslSWl
float occlusion(vec3 p,vec3 n) { 
    const int AO_SAMPLES = 8;
    const float INV_AO_SAMPLES = 1.0/float(AO_SAMPLES);
    const float R = 0.9;
    const float D = 0.8;
    float r = 0.0;
    for(int i = 0; i < AO_SAMPLES; i++) {
        float f = float(i)*INV_AO_SAMPLES;
        float h = 0.05+f*R;
        float d = surfaceDistance(p + n * h) - 0.003;
        r += clamp(h*D-d,0.0,1.0) * (1.0-f);
    }    
    return clamp(1.0-r,0.0,1.0);
}
`;

const fragFooter = `
// For advanced users //
void main() {

    vec3 rayOrigin = (cameraPosition - sculptureCenter) / max(intersection_threshold, _scale);
    vec3 rayDirection = getRayDirection();
    float t = intersect(rayOrigin, rayDirection, stepSize);
    if(t < max_dist) {
        vec3 p = (rayOrigin + rayDirection*t);
        //vec4 sp = projectionMatrix*viewMatrix*vec4(p,1.0); //could be used to set FragDepth
        vec3 normal = calcNormal(p);
        // p *= _scale;
        vec3 col = shade(p, normal);
        gl_FragColor = vec4(col, opacity);
        
    } else {
        discard;
    }
}
`;

// import { Texture, Vector2, Vector3, ShaderMaterial, Mesh, BoxBufferGeometry, BackSide, SphereBufferGeometry} from 'three';

/**
 *  Three targets are provided for both GLSL and Sculpt/JS api.
 * 
 *  1: source -> Threejs shader source components (easy customization)
 *  2: source -> Threejs material
 *  3: source -> Threejs mesh (easy to use)
 * 
 * TODO: make these materials 'plug in' to threejs' lighting model, like unity's surface shaders
 */

function glslToThreeJSShaderSource(source) {
    return {
        uniforms: baseUniforms(),
        frag: threeHeader + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + 'const int MAX_ITERATIONS = 300;\n' + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + fragFooter,
        vert: threeJSVertexSource
    }
}

function glslToThreeJSMaterial(source, payload) {
    let src = glslToThreeJSShaderSource(source);
    return makeMaterial(src.uniforms, src.vert, src.frag, payload);
}

function glslToThreeJSMesh(source, payload) {
    return makeBasicMesh(glslToThreeJSMaterial(source, payload));
}

function sculptToThreeJSShaderSource(source) {
    const src = sculptToGLSL(source);
    if (src.error) {
        console.log(src.error);
    }
    let frg = 
          threeHeader
        + usePBRHeader
        + useHemisphereLight
        + uniformsToGLSL(src.uniforms) 
        + 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n'
        + 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n'
        + sculptureStarterCode 
        + src.geoGLSL 
        + '\n' 
        + src.colorGLSL 
        + '\n' 
        + fragFooter;

    return {
        uniforms: src.uniforms,
        frag: frg,
        vert: threeJSVertexSource,
        error: src.error,
        geoGLSL: src.geoGLSL,
        colorGLSL: src.colorGLSL
    };
}

function sculptToThreeJSMaterial(source, payload) {
    let src = sculptToThreeJSShaderSource(source);
    let material = makeMaterial(src.uniforms, src.vert, src.frag, payload);
    material.uniformDescriptions = src.uniforms;
    return material;
}

function sculptToThreeJSMesh(source, payload) {
    source = convertFunctionToString(source);
    return makeBasicMesh(sculptToThreeJSMaterial(source, payload));
}

function createSculptureWithGeometry(geometry, source, uniformCallback=() => {return {}}, params={}) {
    geometry.computeBoundingSphere();
    let radius = ('radius' in params)? params.radius: geometry.boundingSphere.radius;
    params.radius = radius;
    params.geometry = geometry;
    return createSculpture(source, uniformCallback, params);
}

// uniformCallback 
function createSculpture(source, uniformCallback=() => {return {}}, params={}) {
    source = convertFunctionToString(source);

    let radius = ('radius' in params)? params.radius: 2;

    let geometry;
    if ('geometry' in params) {
        geometry = params.geometry;
    } else {
        let segments = ('segments' in params)? params.segments: 8;
        geometry = new THREE.SphereBufferGeometry( radius, segments, segments );   
    }
    let material = sculptToThreeJSMaterial(source);
    
    material.uniforms['opacity'].value = 1.0;
    material.uniforms['mouse'].value = new THREE.Vector3();
    material.uniforms['_scale'].value = radius;
    let mesh = new THREE.Mesh(geometry, material);

    mesh.onBeforeRender = function( renderer, scene, camera, geometry, material, group ) {
        let uniformsToUpdate = uniformCallback();
        if (!(typeof uniformsToUpdate === "object")) {
            throw "createSculpture takes, (source, uniformCallback, params) the uniformCallback must be a function that returns a dictionary of uniforms to update"
        }

        for (const [uniform, value] of Object.entries(uniformsToUpdate)) {
            material.uniforms[uniform].value = value;
        }
        // material.uniforms['sculptureCenter'].value = geometry.position;
    };

    return mesh;
}

function uniformDescriptionToThreeJSFormat(unifs, payload) {
    
    let finalUniforms = {};
    
    // if (payload && payload !== undefined && payload.msdfTexture !== undefined) {
    //     finalUniforms["msdf"] = { value: payload.msdfTexture || new Texture() };
    // }
    unifs.forEach(uniform => {
        if (uniform.type === 'float') {
            finalUniforms[uniform.name] = {value: uniform.value};
        } else if (uniform.type === 'vec2') {
            finalUniforms[uniform.name] = {value: new THREE.Vector2(uniform.value.x, uniform.value.y)};
        } else if (uniform.type === 'vec3') {
            finalUniforms[uniform.name] = {value: new THREE.Vector3(uniform.value.x, uniform.value.y, uniform.value.z)};
        } else if (uniform.type === 'vec4') {
            finalUniforms[uniform.name] = {value: new THREE.Vector4(uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w)};
        }
    });
    return finalUniforms;
} 

// could use a scale parameter
function makeMaterial(unifs, vert, frag, payload) {
    const material = new THREE.ShaderMaterial({
        uniforms: uniformDescriptionToThreeJSFormat(unifs, payload),
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        side: THREE.BackSide
    });
    material.extensions.fragDepth = false;
    return material;
}

// There should be more options supported like size and shape
function makeBasicMesh(material) {
    return new Mesh(new THREE.BoxBufferGeometry(2, 2, 2), material);
}

// import {
//     glslToOfflineRenderer,
//     sculptToOfflineRenderer
// } from './targets/offlineRenderer.js'

// import {
//     sculptToMinimalRenderer,
//     glslToMinimalRenderer
// } from './targets/minimalRenderer.js'

// import {
//     sculptToMinimalHTMLRenderer,
//     glslToMinimalHTMLRenderer,
// } from './targets/minimalHTMLRenderer.js'

// import {
//     sculptToRawSDF4Meshing
// } from './targets/rawSDF4Meshing.js'

// import {
//     glslToTouchDesignerShaderSource, 
//     sculptToTouchDesignerShaderSource
// } from './targets/touchDesigner.js'

// import {
//     defaultFragSourceGLSL
// } from './glsl/glsl-lib.js'

// import {
//     bindStaticData
// } from './generators/sculpt.js'

console.log(`using shader-park version: 0.1.4`);

export { createSculpture, createSculptureWithGeometry, sculptToThreeJSMaterial };
