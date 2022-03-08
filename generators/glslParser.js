// Adapted from https://github.com/cimaron/cwebgl/blob/master/external/glsl2js/glsl.js

/*
Copyright (c) 2011 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	var glsl = {
		
		runParse : function(src, options) {
			var state,
				result,
			    irs
			    ;
	
			state = new GlslState(options);
			state.setSource(src);
	
			//Preprocess
			result = this.preprocessor.process(state);
	
			//Parse into AST
			if (result) {
				result = this.parser.parse(state);
			}
            
            /*
			//Generate IR
			if (result) {
				result = this.generate(state);
			}
            */
	
			if (result) {
				state.status = true;	
			}
	
			return state;
		},
	
		/**
		 * Compilation targets
		 */
		target : {
			fragment : 0,
			'x-fragment' : 0,
			'x-shader/x-fragment' : 0,
			vertex : 1,
			'x-vertex' : 1,
			'x-shader/x-vertex' : 1
		}
	};
	
	
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	/**
	 * Select node.js util functions
	 */
	
	var util = {};
	
	(function(exports) {
	
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    //if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    //} else {
	    //  str += ' ' + inspect(x);
	    //}
	  }
	  return str;
	};
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 * prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = function(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = Object.create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	};
	
	}(util));
	
	
	/*
	Copyright (c) 2014 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	function GlslState(options) {
		var i;
	
		this.options = {
			target : 0,
			language_version : 100,
			opt : {
				fold_constants : true	
			}
		};
	
		for (i in options) {
			this.options[i] = options[i];	
		}
	
		this.symbols = new SymbolTable();
		symbol_table_init(this.symbols, options.target);
	
		this.status = false;
		this.translation_unit = "";
		this.ast = [];
		this.ir = null;
	
		this.errors = [];
		this.warnings = [];
	}
	
	proto = GlslState.prototype = {};
	
	/**
	 * Get identifier type
	 *
	 * @param   object   state   GLSL state
	 * @param   string   name    Identifier name
	 * Add error to state
	 *
	 * @return  string
	 * @param   string   msg      Message
	 * @param   int      line     Message
	 * @param   int      column   Message
	 */
	proto.classify_identifier = function(state, name) {
		if (this.symbols.get_variable(name) || this.symbols.get_function(name)) {
			return 'IDENTIFIER';
		} else if (this.symbols.get_type(name)) {
			return 'TYPE_IDENTIFIER';
		} else {
			return 'NEW_IDENTIFIER';
		}
	};
	
	proto.setSource = function(src) {
		this.src = src;
	};
	
	proto.getSource = function() {
		return this.src;
	};
	
	proto.setTranslationUnit = function(tu) {
		this.translation_unit = tu;	
	};
	
	proto.getTranslationUnit = function() {
		return this.translation_unit;
	};
	
	proto.addAstNode = function(node) {
		this.ast.push(node);
	};
	
	proto.getAst = function() {
		return this.ast;
	};
	
	proto.setIR = function(ir) {
		this.ir = ir;
	};
	
	proto.getIR = function() {
		return this.ir;
	};
	
	proto.getStatus = function() {
		return this.status;
	};
	
	
	/**
	 * Add error to state
	 *
	 * @param   string   msg      Message
	 * @param   int      line     Message
	 * @param   int      column   Message
	 */
	proto.addError = function(msg, line, column) {
		var err;
	
		if (!line && !column) {
			this.errors.push(msg);
			return;
		}
	
		err = util.format("%s at line %s, column %s", msg, line, column);
	
		this.errors.push(err);
	};
	
	/**
	 * Add warning to state
	 *
	 * @param   string   msg      Message
	 * @param   int      line     Message
	 * @param   int      column   Message
	 */
	proto.addWarning = function(msg, line, column) {
		var warn;
	
		if (!line && !column) {
			this.warnings.push(msg);
			return;
		}
	
		warn = util.format("%s at line %s, column %s", msg, line, column);
	
		this.warnings.push(warn);
	};
	
	/**
	 * Get compile errors
	 *
	 * @return  mixed
	 */
	proto.getErrors = function() {
		return this.errors;
	};
	
	/**
	 * Get compile errors
	 *
	 * @return  mixed
	 */
	proto.getWarnings = function() {
		return this.warnings;
	};
	
	
	/*
	Copyright (c) 2014 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	/**
	 * Preprocessor Class
	 */
	function Preprocessor() {
	}
	
	Preprocessor.modules = {};
	
	var proto = Preprocessor.prototype;
	
	proto.process = function(state) {
		var m,
		    out = state.getSource()
			;
	
		for (m in Preprocessor.modules) {
	
			try {
				out = Preprocessor.modules[m].process(out);
			} catch (e) {
				state.addError(e.message, e.lineNumber, e.columnNumber);
				return false;
			}
		}
	
		state.setTranslationUnit(out);
	
		return true;
	};
	
	glsl.preprocessor = new Preprocessor();
	
	
	/*
	Copyright (c) 2014 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	Preprocessor.modules.comments = {
	
		process : function(src) {
			var i,
			    chr,
			    la,
			    out = "",
			    line = 1,
			    in_single = 0,
			    in_multi = 0
				;
			
			for (i = 0; i < src.length; i++) {
	
				chr = src.substr(i, 1);
				la = src.substr(i + 1, 1);
				
				//Enter single line comment
				if (chr == '/' && la == '/' && !in_single && !in_multi) {
					in_single = line;
					i++;
					continue;
				}
				
				//Exit single line comment
				if (chr == "\n" && in_single) {
					in_single = 0;
				}
				
				//Enter multi line comment
				if (chr == '/' && la == '*' && !in_multi && !in_single) {
					in_multi = line;
					i++;
					continue;
				}
				
				//Exit multi line comment
				if (chr == '*' && la == '/' && in_multi) {
	
					//Treat single line multi-comment as space
					if (in_multi == line) {
						out += " ";
					}
	
					in_multi = 0;
					i++;				
					continue;
				}
	
				//Newlines are preserved
				if ((!in_multi && !in_single) || chr == "\n") {
					out += 	chr;
					line++;
				}
			}
			
			return out;
		}
	
	};
	
	
	/*
	Copyright (c) 2014 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	Preprocessor.modules.directives = {
	
		state : {
			lines : [],
			defines : {
			}
		},
	
		process : function(src) {
			var i, l;
			
			this.state.lines = src.split("\n");
			this.state.defines = {
				GL_ES : '1',
				__FILE__ : '0',
				__LINE__ : '0',
				__VERSION__ : '300'
			};
			this.state.cond_stack = [];
	
			i = 0;
			l = this.state.lines.length;
	
			while (i < l) {
				this.state.lines[i] = this.processLine(this.state.lines[i], i);
				i++;
			}
	
			return this.state.lines.join("\n");
		},
		
		processLine : function(line, i) {
			var d, matches, raw, e, sub, cond;
	
			matches = line.match(/^([ \t]*)#(.*)$/);
			if (!matches) {
	
				if (this.state.cond_stack.length != 0 && !this.state.cond_stack.slice(-1)[0]) {
					return "";
				}
	
				line = this.processDefines(line, i);
	
				return line;
			}
	
			raw = matches[2];
	
			if (raw.match(/^\s*$/)) {
				return "";
			}
	
			lmatches = raw.split(/\s+/);
			
			try {
	
				switch (lmatches[0]) {
					
					case 'define':
					case 'undef':
					case 'ifdef':
					case 'endif':
						this[lmatches[0]](line, lmatches);
						return "";
				}
	
				throw new Error("Invalid directive");
	
			} catch (e) {
	
				e.lineNumber = i + 1;
				e.columnNumber = matches[1].length + 1;
		
				throw e;
			}
	
		},
	
		processDefines : function(line, i) {
			
			this.state.defines.__LINE__ = i + 1;
	
			for (d in this.state.defines) {
				//easy global replace
				line = line.split(d).join(this.state.defines[d]);
			}
	
			return line;
		},
	
		define : function(line, matches) {
	
			if (matches.length <= 1 || matches.length > 3) {
				throw new Error("Syntax error in #define");
			}
	
			this.state.defines[matches[1]] = matches[2] || "";		
		},
	
		undef : function(line, matches) {
	
			if (matches.length != 2) {
				throw new Error("Syntax error in #undef");
			}
	
			delete this.state.defines[matches[1]];
		},
		
		ifdef : function(line, matches) {
	
			var def;
	
			def = !!this.state.defines[matches[1]];
	
			this.state.cond_stack.push(def);		
		},
	
		endif : function(line, matches) {
	
			if (this.state.cond_stack.length) {
				this.state.cond_stack.pop();	
			} else {
				throw new Error("unmatched #endif");
			}
		}
	
	};
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	function Type(name, size, slots, base) {
		this.name = name;
		this.size = size;
		this.slots = slots;
		this.swizzle = (size / slots != 4) ? "xyzw".slice(0, size / slots) : "";
		this.base = base || name;
	}
	
	
	/**
	 * Do a cast on a constant
	 *
	 * @param   string   val    Value to cast
	 * @param   string   from   From type
	 * @param   string   to     To type
	 *
	 * @return  string
	 */
	Type.castTo = function(val, from, to) {
		var f32;
	
		switch (to) {
			
			case 'int':
				return "" + parseInt(val);
	
			case 'float':
				//Should we keep maximum precision, or use the following to force to 32bit precision??
				/*
				f32 = new Float32Array(1);
				f32[0] = parseFloat(val);
				return "" + f32[0];
				*/
				return "" + parseFloat(val);
	
			case 'bool':
				return parseFloat(val) ? "1" : "0";
		}
	
		return val;
	};
	
	/**
	 * Determine if can cast from one type to another
	 *
	 * @param   string   from   From type
	 * @param   string   to     To type
	 *
	 * @return  bool
	 */
	Type.canCast = function(from, to) {
		var t1, t2;
	
		t1 = types[from];
		t2 = types[to];
	
		return t1.size === 1 && t2.size === 1;
	};
	
	
	
	var types = {
		_void : new Type("void", 1, 1),
		bool : new Type("bool", 1, 1),
		int : new Type("int", 1, 1),
		float : new Type("float", 1, 1),
		vec2 : new Type("vec2", 2, 1, 'float'),
		vec3 : new Type("vec3", 3, 1, 'float'),
		vec4 : new Type("vec4", 4, 1, 'float'),
		bvec2 : new Type("bvec2", 2, 1, 'bool'),
		bvec3 : new Type("bvec3", 3, 1, 'bool'),
		bvec4 : new Type("bvec4", 4, 1, 'bool'),
		ivec2 : new Type("ivec2", 2, 1, 'int'),
		ivec3 : new Type("ivec3", 3, 1, 'int'),
		ivec4 : new Type("ivec4", 4, 1, 'int'),
		mat2 : new Type("mat2", 4, 2, 'float'),
		mat3 : new Type("mat3", 9, 3, 'float'),
		mat4 : new Type("mat4", 16, 4, 'float'),
		sampler2D : new Type("sampler2D", 1, 1),
		samplerCube : new Type("samplerCube", 1, 1)
	};
	
	//Compatibility
	types['void'] = types._void;
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * SymbolTableEntry constructor
	 */
	function SymbolTableEntry(name, typedef) {
	
		this.depth = null;
		this.typedef = typedef;
	
		//Variable name
		this.name = name;
	
		//Type
		this.type = null;
	
		//Base type (if array)
		this.base_type = null;
	
		//Function definition
		this.definition = [];	
	
		//Qualifier
		this.qualifier = null;
	
		//IR name
		this.out = name;
		
		//Constant value
		this.constant = null;
		
		//Array size
		this.size = null;
	
		//Temp vars for IR generation
		this.code = null;
		this.Ast = null;
	}
	
	SymbolTableEntry.typedef = {
		variable : 0,
		func : 1,
		type : 2
	};
	
	SymbolTableEntry.prototype.getType = function() {
		return types[this.type];
	};
	
	
	/**
	 * symbol_table constructor
	 */
	function SymbolTable() {
		this.table = {};
		this.depth = 0;
	}
	
	SymbolTable.prototype = {};
	var proto = SymbolTable.prototype;
	
	/**
	 * 
	 */
	proto.push_scope = function() {
		this.depth++;
	};
	
	/**
	 * 
	 */
	proto.pop_scope = function() {
		var n, t;
		
		for (n in this.table) {
			
			if (this.table.hasOwnProperty(n)) {
				t = this.table[n];
				
				while (t[0] && t[0].depth === this.depth) {
					t.splice(0, 1);	
				}
				
				if (t.length === 0) {
					delete this.table[n];	
				}
			}
		}
	
		this.depth--;
	};
	
	/**
	 * 
	 */
	proto.name_declared_this_scope = function(name) {
		
		var e = this.get_entry(name);
		
		return e && e.depth === this.depth;
	};
	
	/**
	 * 
	 */
	proto.add_variable = function(name, type) {
		
		var entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.variable);
		entry.type = type;
		
		return this._add_entry(entry);
	};
	
	/**
	 * 
	 */
	proto.add_type = function(name, t) {
		
		var entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.type);
		entry.definition = t;
		
		return this._add_entry(entry);
	};
	
	/**
	 * 
	 */
	proto.add_function = function(name, type, def) {
		var entry;
	
		entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.func);
		entry.type = type;
	
		if (def) {
			entry.definition = def;
		}
	
		return this._add_entry(entry);
	};
	
	/**
	 * 
	 */
	proto.get_variable = function(name) {
		
		var entry = this.get_entry(name, SymbolTableEntry.typedef.variable);
	
		return entry;
	};
	
	/**
	 * 
	 */
	proto.get_type = function(name) {
	
		var entry = this.get_entry(name, SymbolTableEntry.typedef.type);
	
		return entry;
	};
	
	/**
	 * 
	 */
	proto.get_function = function(name, def) {
		
		var entry = this.get_entry(name, SymbolTableEntry.typedef.func, def);
		
		return entry;
	};
	
	/**
	 * @protected
	 */
	proto._match_definition = function(def, entry) {
	
		var i;
		
		if (!def) {
			return true;	
		}
		
		if (def.length !== entry.length) {
			return false;	
		}
		
		for (i = 0; i < def.length; i++) {
			if (def[i] !== entry[i]) {
				return false;
			}
		}
		
		return true;
	};
	
	/**
	 * @protected
	 */
	proto._add_entry = function(entry) {
	
		if (!this.table[entry.name]) {
			this.table[entry.name] = [];	
		}
		
		this.table[entry.name].splice(0, 0, entry);
		entry.depth = this.depth;
		
		return entry;
	};
	
	/**
	 * @protected
	 */
	proto.get_entry = function(name, typedef, def) {
	
		var t, i, entry;
		
		t = this.table[name] || [];
		
		//Look for 'void' instead of empty definition list
		if (def && def.length == 0) {
			def = ["void"];	
		}
	
		for (i = 0; i < t.length; i++) {
			
			entry = t[i];
			
			//Not type of variable we're looking for
			if (entry.typedef !== typedef) {
				continue;	
			}
			
			//Normal variable
			if (typedef !== SymbolTableEntry.typedef.func) {
				return entry;
			}
	
			//Match any function definition
			if (!def) {
				return entry;
			}
			
			//Match specific function definition
			if (def.join(',') === entry.definition.join(',')) {
				return entry;
			}
	
		}
		
		return null;
	};
	
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * Base class of all abstract syntax tree nodes
	 */
	function AstNode() {
	
		//public:
		this.location = {
			first_line : 0,
			first_column : 0,
			last_line : 0,
			last_column : 0
		};
	
		//The following are used during IR generation
		this.Dest = null;
		this.Type = null;
		this.Const = false;
	}
	
	var proto = AstNode.prototype;
	
	//public:
	proto.getLocation = function() {
		return this.location;
	};
	
	proto.setLocation = function(loc) {
		this.location.first_line = loc.first_line;
		this.location.first_column = loc.first_column;
		this.location.last_line = loc.last_line;
		this.location.last_column = loc.last_column;
	};
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return this.constructor.name;
	};
	
	proto.ir = function(state, irs) {
		//throw new Error("Missing ir generator for node of type " + this.constructor.name);
	};
	
	
	//inverse of operators
	var ast_operators = [
		"=",
		"POS",
		"NEG",
		"+",
		"-",
		"*",
		"/",
		"%",
		"<<",
		">>",
		"<",
		">",
		"<=",
		">=",
		"==",
		"!=",
		"&",
		"^",
		"|",
		"~",
		"&&",
		"^^",
		"||",
		"!",		
		"*=",
		"/=",
		"%=",
		"+=",
		"-=",
		"<<=",
		">>=",
		"&=",
		"^=",
		"|=",
		"?:",
		"++x",
		"--x",
		"x++",
		"x--",
		".",
		"[]",
		"()",
		"ident",
		"float",
		"int",
		"bool"
	];
	
	var ast_precision = {
		none : 0,
		highp : 1,
		mediump : 2,
		lowp : 3
	};
	
	
	
	/**
	 * AST Type Specifier Class
	 */
	function AstTypeSpecifier(specifier) {
		AstNode.apply(this);
		this.type_specifier = null;
		this.type_name = null;
		this.structure = null;
		this.is_array = 0;
		this.array_size = null;	
		this.precision = 2;
		this.is_precision_statement = null;
	
		if (AstTypeSpecifier[typeof specifier]) {
			AstTypeSpecifier[typeof specifier].call(this, specifier);
		}
	}
	
	util.inherits(AstTypeSpecifier, AstNode);
	proto = AstTypeSpecifier.prototype;
	
	//overloaded constructors
	AstTypeSpecifier.number = function(specifier) {
		this.type_specifier = specifier;
		this.precision = ast_precision.none;
		this.is_precision_statement = false;
		this.type_name = types[specifier].name;
	};
	
	AstTypeSpecifier.string = function(name) {
		this.type_specifier = types[name];
		this.type_name = name;
		this.is_array = false;
		this.precision = ast_precision.none;
		this.is_precision_statement = false;
	};
	
	AstTypeSpecifier.object = function(s) {
		this.type_specifier = types.struct;
		this.type_name = s.name;
		this.structure = s;
		this.is_array = false;
		this.precision = ast_precision.none;
		this.is_precision_statement = false;			
	};
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		var i, prec;
		
		if (this.is_precision_statement) {
			
			for (i in ast_precision) {
				if (ast_precision.hasOwnProperty(i) && ast_precision[i] === this.precision) {
					prec = i;
					break;
				}
			}
			
			return util.format("precision %s %s;\n", prec, this.type_name);
		}
		
		return (this.type_specifier === types.struct ? this.structure : this.type_name)
		    + (this.is_array ? util.format("[%s]", this.array_size || "") : "")
			;
	};
	
	
	/**
	 * AST Function Class
	 */
	function AstFunction() {
		AstNode.apply(this);
	
		this.return_type = null;
		this.identifier = null;
		this.parameters = [];
	
		this.entry = null;
	}
	
	util.inherits(AstFunction, AstNode);
	proto = AstFunction.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return util.format("%s %s(%s)", this.return_type, this.identifier, this.parameters.join(", "));			
	};
	
	/**
	 * AST Expression Class
	 */
	function AstExpression(oper, ex0, ex1, ex2) {
		AstNode.apply(this);
	
		this.oper = oper;
		this.grouped = false;
		this.subexpressions = [null, null, null];
		this.primary_expression = {};
		this.expressions = [];
	
		if (ast_operators.indexOf(this.oper) === -1) {
			this.oper = 'ident';
			this.primary_expression.identifier = oper;
		} else {
			this.subexpressions[0] = ex0;
			this.subexpressions[1] = ex1;
			this.subexpressions[2] = ex2;
		}
	}
	
	util.inherits(AstExpression, AstNode);
	proto = AstExpression.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
	
		var output;
	
		switch (this.oper) {
			case '=':
			case '+':
			case '-':
			case '*':
			case '/':
			case '%':
			case "<<":
			case ">>":
			case "<":
			case ">":
			case "<=":
			case ">=":
			case "==":
			case "!=":
			case "&":
			case "^":
			case "|":
			case "~":
			case "&&":
			case "^^":
			case "||":
			case '*=':
			case '/=':
			case '%=':
			case '+=':
			case '-=':
			case '<<=':
			case '>>=':
			case '&=':
			case '^=':
			case '|=':
				output = util.format("%s %s %s", this.subexpressions[0], this.oper, this.subexpressions[1]);
				break;
	
			case '.':
				output = util.format("%s.%s", this.subexpressions[0], this.primary_expression.identifier);
				break;
	
			case 'POS':
				output = util.format("+%s", this.subexpressions[0]);
				break;
			case 'NEG':
				output = util.format("-%s", this.subexpressions[0]);			
				break;
	
			case '~':
			case '!':
				output = util.format("%s%s", this.oper, this.subexpressions[0]);			
				break;
	
			case '++x':
			case '--x':
				output = util.format("%s%s", this.oper.replace('x', ''), this.subexpressions[0]);
				break;
			
			case 'x++':
			case 'x--':
				output = util.format("%s%s", this.subexpressions[0], this.oper.replace('x', '') );
				break;
	
			case '?:':
				output = util.format("%s ? %s : %s", this.subexpressions[0], this.subexpressions[1], this.subexpressions[2]);				
				break;
	
			case '[]':
				output = util.format("%s[%s]", this.subexpressions[0], this.subexpressions[1]);				
				break;
	
			case '()':
				output = util.format("%s(%s)", this.subexpressions[0], this.expressions.join(", "));
				break;
	
			case 'ident':
				output = util.format("%s", this.primary_expression.identifier);
				break;
			
			case 'float':
				output = util.format("%s", this.primary_expression.float_constant);
				break;
			
			case 'int':
				output = util.format("%s", this.primary_expression.int_constant);
				break;
			
			case 'bool':
				output = util.format("%s", this.primary_expression.bool_constant ? 'true' : 'false');
				break;
	
		}
	
		return this.grouped ? util.format("(%s)", output ) : output;
	};
	
	/**
	 * AST Fully Specified Type Class
	 */
	function AstFullySpecifiedType() {
		AstNode.apply(this);
		
		this.qualifier = [];
		this.specifier = null;
	}
	
	util.inherits(AstFullySpecifiedType, AstNode);
	proto = AstFullySpecifiedType.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		var output;
	
		output = this.qualifier.slice(0);
		output.push(this.specifier);
	
		return output.join(' ');
	};
	
	/**
	 * AST Declaration Class
	 */
	function AstDeclaration(identifier, is_array, array_size, initializer) {
		AstNode.apply(this);
	
		this.identifier = identifier;
		this.is_array = is_array;
		this.array_size = array_size;
		this.initializer = initializer;
	}
	
	util.inherits(AstDeclaration, AstNode);
	proto = AstDeclaration.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return this.identifier
			+ (this.is_array ? util.format("[%s]", this.array_size === undefined ? '' : this.array_size) : '')
			+ (this.initializer ? util.format(" = %s", this.initializer) : "")
			;
	};
	
	
	/**
	 * AST Declarator List Class
	 */
	function AstDeclaratorList(type) {
		AstNode.apply(this);
	
		this.type = type;
		this.declarations = [];
		this.invariant = 0;
	}
	
	util.inherits(AstDeclaratorList, AstNode);
	proto = AstDeclaratorList.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return util.format("%s %s;\n", this.type || "invariant ", this.declarations.join(", "));
	};
	
	
	/**
	 * AST Parameter Declarator Class
	 */
	function AstParameterDeclarator() {
		AstNode.apply(this);
		this.type = null;
		this.identifier = null;
		this.is_array = false;
		this.array_size = 0;
		this.formal_parameter = null;
		this.is_void = null;
	}
	
	util.inherits(AstParameterDeclarator, AstNode);
	proto = AstParameterDeclarator.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return this.type
		    + (this.identifier ? " " + this.identifier : "")
			+ (this.is_array ? util.format("[%s]", this.array_size) : "")
			;
	};
	
	
	/**
	 * AST Expression Statement Class
	 */
	function AstExpressionStatement(ex) {
		AstNode.apply(this);
	
		this.expression = ex;
	}
	
	util.inherits(AstExpressionStatement, AstNode);
	proto = AstExpressionStatement.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return util.format("%s;\n", this.expression || "");
	};
	
	
	/**
	 * AST Compound Statement Class
	 */
	function AstCompoundStatement(new_scope, statements) {
		AstNode.apply(this);
		this.new_scope = new_scope;
		if (statements) {
			this.statements = statements;
		} else {
			this.statements = [];
		}
	}
	
	util.inherits(AstCompoundStatement, AstNode);
	proto = AstCompoundStatement.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		var str,
			stmts,
		    indent
			;
	
		AstCompoundStatement._depth++;
		indent = new Array(AstCompoundStatement._depth).join("  ")
	
		stmts = indent + "  " + this.statements.join(indent + "  ");
	
		str = "\n" + indent + "{\n"
		    + stmts
			+ indent + "}\n"
			;
	
		AstCompoundStatement._depth--;
	
		return str;
	};
	
	//Used for toString indentation
	AstCompoundStatement._depth = 0;
	
	/**
	 * AST Function Definition Class
	 */
	function AstFunctionDefinition() {
		AstNode.apply(this);
	
		this.proto_type = null;
		this.body = null;
	}
	
	util.inherits(AstFunctionDefinition, AstNode);
	proto = AstFunctionDefinition.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return util.format("%s %s", this.proto_type, this.body);
	};
	
	/**
	 * AST Function Definition Class
	 */
	function AstExpressionBin(oper, ex0, ex1) {
		AstExpression.apply(this, [oper, ex0, ex1]);
	}
	
	util.inherits(AstExpressionBin, AstExpression);
	proto = AstExpressionBin.prototype;
	
	/**
	 * AST Function Expression Class
	 */
	function AstFunctionExpression(arg) {
		AstExpression.apply(this);
		this.cons = false;
	
		if (arg.constructor.name === 'AstExpression') {
			this.cons = false;
			AstExpression.call(this, '()', arg);
		} else if (arg.constructor.name === 'AstTypeSpecifier') {
			this.cons = true;
			AstExpression.call(this, '()', arg);
		}
	
	}
	
	util.inherits(AstFunctionExpression, AstExpression);
	proto = AstFunctionExpression.prototype;
	
	proto.is_constructor = function() {
		return this.cons;
	};
	
	proto.toString = function() {
		return util.format("%s(%s)", this.subexpressions[0], this.expressions.join(", "));
	};
	
	
	
	/**
	 * AST Selection Statement Class
	 */
	function AstSelectionStatement(condition, then_statement, else_statement) {
		AstNode.apply(this);
		this.condition = condition;
		this.then_statement = then_statement;
		this.else_statement = else_statement;
	}
	
	util.inherits(AstSelectionStatement, AstNode);
	proto = AstSelectionStatement.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		return util.format("if (%s) %s %s", this.condition, this.then_statement, this.else_statement ? util.format("else %s", this.else_statement) : "");
	};
	
	
	/**
	 * AST Struct Specifier Class
	 */
	function AstStructSpecifier(identifier, declarator_list) {
		AstNode.apply(this);
		this.name = null;
		this.declarations = [];
	
		if (identifier === null) {
			identifier = util.format("#anon_struct%d", AstStructSpecifier.anon_count);
			AstStructSpecifier.anon_count++;
		}
		this.name = identifier;
		this.declarations = declarator_list.declarations;
	}
	
	AstStructSpecifier.anon_count = 1;
	
	util.inherits(AstStructSpecifier, AstNode);
	proto = AstStructSpecifier.prototype;
	
	
	
	/**
	 * AST Jump 
	 */
	function AstJumpStatement(mode, return_value) {
		AstNode.apply(this);
	
		this.opt_return_value = null;
		this.mode = mode;
	
		if (mode === 'return') {
			this.opt_return_value = return_value;	
		}	
	}
	
	util.inherits(AstJumpStatement, AstNode);
	proto = AstJumpStatement.prototype;
	
	/**
	 * Return string representation of node
	 *
	 * @return  string
	 */
	proto.toString = function() {
		
		switch (this.mode) {
	
			case 'continue':
			case 'break':
			case 'discard':
			case 'debugger':
				return this.mode + ";\n";
			
			case 'return':
				return util.format("return%s;\n", this.opt_return_value ? " " + this.opt_return_value : "");
		}
	};
	
	
	glsl.ast = {
		Node : AstNode,
		TypeSpecifier : AstTypeSpecifier,
		Function : AstFunction,
		Expression : AstExpression,	
		FullySpecifiedType : AstFullySpecifiedType,
		Declaration : AstDeclaration,
		DeclaratorList : AstDeclaratorList,
		ParameterDeclarator : AstParameterDeclarator,
		ExpressionStatement : AstExpressionStatement,
		CompoundStatement : AstCompoundStatement,
		FunctionDefinition : AstFunctionDefinition,
		ExpressionBin : AstExpressionBin,
		FunctionExpression : AstFunctionExpression,
		SelectionStatement : AstSelectionStatement,
		StructSpecifier : AstStructSpecifier,
		JumpStatement : AstJumpStatement	
	};
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	var builtin = {
		
		vars : {
		
			vertex : [
				{
					position : 0,
					type : 'vec4',
					name : 'gl_Position',
					out : 'result@0'
				},
				{
					position : 1,
					type : 'float',
					name : 'gl_PointSize',
					out : 'result@1'
				}
			],
	
			fragment : [
				{
					position : 0,
					type : 'vec4',
					name : 'gl_FragColor',
					out : 'result@0'
				}
			]
		},
		
		/**
		 * List of instructions for operators
		 * 
		 * Denoted by operator, then by definition of param types to output type
		 */
		oper : {
			"!" : {
				"bool:bool" : [
					"SEQ %1.x %2.x 0.0"
					]
				},
			"+" : {
				"int,int:int" : ["ADD %1.x %2.x %3.x"],
				"float,float:float" : ["ADD %1.x %2.x %3.x"],
				"float,vec2:vec2" : ["ADD %1.xy %2.x %3.xy"],
				"float,vec3:vec3" : ["ADD %1.xyz %2.x %3.xyz"],
				"float,vec4:vec4" : ["ADD %1 %2.x %3"],
				"vec2,float:vec2" : ["ADD %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["ADD %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["ADD %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["ADD %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["ADD %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["ADD %1 %2 %3"]
				},
			"-" : {
				"int,int:int" : ["SUB %1.x %2.x %3.x"],
				"float,float:float" : ["SUB %1.x %2.x %3.x"],
				"float,vec2:vec2" : ["SUB %1.xy %2.x %3.xy"],
				"float,vec3:vec3" : ["SUB %1.xyz %2.x %3.xyz"],
				"float,vec4:vec4" : ["SUB %1 %2.x %3"],
				"vec2,float:vec2" : ["SUB %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["SUB %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["SUB %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["SUB %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["SUB %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["SUB %1 %2 %3"]
			},
			"*" : {
				"int,int:int" : ["MUL %1.x %2.x %3.x"],
				"float,float:float" : ["MUL %1.x %2.x %3.x"],
				"float,vec2:vec2" : ["MUL %1.xy %2.x %3.xy"],
				"float,vec3:vec3" : ["MUL %1.xyz %2.x %3.xyz"],
				"float,vec4:vec4" : ["MUL %1 %2.x %3"],
				"vec2,float:vec2" : ["MUL %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["MUL %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["MUL %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["MUL %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["MUL %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["MUL %1 %2 %3"],
				"mat3,vec3:vec3" : [
					"MUL %1.xyz %2.xyz %3.x",
					"MAD %1.xyz %2@1.xyz %3.y %1",
					"MAD %1.xyz %2@2.xyz %3.z %1"
					],
				"mat4,vec4:vec4" : [
					"MUL %1 %2 %3.x",
					"MAD %1 %2@1 %3.y %1",
					"MAD %1 %2@2 %3.z %1",
					"MAD %1 %2@3 %3.w %1"
					],
				"mat4,mat4:mat4" : [
					"MUL %1 %2 %3.x",
					"MAD %1 %2@1 %3.y %1",
					"MAD %1 %2@2 %3.z %1",
					"MAD %1 %2@3 %3.w %1",
					"MUL %1@1 %2 %3@1.x",
					"MAD %1@1 %2@1 %3@1.y %1@1",
					"MAD %1@1 %2@2 %3@1.z %1@1",
					"MAD %1@1 %2@3 %3@1.w %1@1",
					"MUL %1@2 %2 %3@2.x",
					"MAD %1@2 %2@1 %3@2.y %1@2",
					"MAD %1@2 %2@2 %3@2.z %1@2",
					"MAD %1@2 %2@3 %3@2.w %1@2",
					"MUL %1@3 %2 %3@3.x",
					"MAD %1@3 %2@1 %3@3.y %1@3",
					"MAD %1@3 %2@2 %3@3.z %1@3",
					"MAD %1@3 %2@3 %3@3.w %1@3"
					]
				},
			"/" : {
				"int,int:int" : ["DIV %1.x %2.x %3.x"],
				"float,float:float" : ["DIV %1.x %2.x %3.x"],
				"float,vec2:vec2" : ["DIV %1.xy %2.x %3.xy"],
				"float,vec3:vec3" : ["DIV %1.xyz %2.x %3.xyz"],
				"float,vec4:vec4" : ["DIV %1 %2.x %3"],
				"vec2,float:vec2" : ["DIV %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["DIV %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["DIV %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["DIV %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["DIV %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["DIV %1 %2 %3"]
				},
			"<" : {
				"int,int:bool" : ["SLT %1.x %2.x %3.x"],
				"float,float:bool" : ["SLT %1.x %2.x %3.x"]
				},
			">" : {
				"int,int:bool" : ["SGT %1.x %2.x %3.x"],
				"float,float:bool" : ["SGT %1.x %2.x %3.x"]
				},
			"<=" : {
				"int,int:bool" : ["SLE %1.x %2.x %3.x"],
				"float,float:bool" : ["SLE %1.x %2.x %3.x"]
				},
			">=" : {
				"int,int:bool" : ["SGE %1.x %2.x %3.x"],
				"float,float:bool" : ["SGE %1.x %2.x %3.x"]
				},
			"==" : {
				"int,int:bool" : ["SEQ %1.x %2.x %3.x"],
				"float,float:bool" : ["SEQ %1.x %2.x %3.x"]
				},
			"!=" : {
				"int,int:bool" : ["SNE %1.x %2.x %3.x"],
				"float,float:bool" : ["SNE %1.x %2.x %3.x"]
				},
			"&&" : {
				"bool,bool:bool" : [
					"AND %1.x %2.x %3.x",
					"AND %1.x %1.x 1"
					]
				},
			"^^" : {
				"bool,bool:bool" : [
					"XOR %1.x %2.x %3.x",
					"AND %1.x %1.x 1"
					]
				},
			"||" : {
				"bool,bool:bool" : [
					"OR %1.x %2.x %3.x",
					"AND %1.x %1.x 1"
					]
				}
		},
	
		/**
		 * List of instructions for built in functions
		 * 
		 * Denoted by function name, then by definition of param types to output type
		 */
		func : {
			"abs": {
				"float:float" : ["ABS %1.x %2.x"],
				"vec2:vec2" : ["ABS %1.xy %2.xy"],
				"vec3:vec3" : ["ABS %1.xyz %2.xyz"],
				"vec4:vec4" : ["ABS %1 %2"],
				},
			"ceil": {
				"float:float" : ["CEIL %1.x %2.x"],
				"vec2:vec2" : ["CEIL %1.xy %2.xy"],
				"vec3:vec3" : ["CEIL %1.xyz %2.xyz"],
				"vec4:vec4" : ["CEIL %1 %2"],
				},
			"clamp": {
				"float,float,float:float" : [
					"MAX %1.x %2.x %3.x",
					"MIN %1.x %1.x %4.x"
					],
				"vec2,float,float:vec2" : [
					"MAX %1.xy %2.xy %3.x",
					"MIN %1.xy %1.xy %4.x"
					],
				"vec3,float,float:vec3" : [
					"MAX %1.xyz %2.xyz %3.x",
					"MIN %1.xyz %1.xyz %4.x"
					],
				"vec4,float,float:vec4" : [
					"MAX %1 %2 %3.x",
					"MIN %1 %1 %4.x"
					],
				"vec2,vec2,vec2:vec2" : [
					"MAX %1.xy %2.xy %3.xy",
					"MIN %1.xy %1.xy %4.xy"
					],
				"vec3,vec3,vec3:vec3" : [
					"MAX %1.xyz %2.xyz %3.xyz",
					"MIN %1.xyz %1.xyz %4.xyz"
					],
				"vec4,vec4,vec4:vec4" : [
					"MAX %1 %2 %3",
					"MIN %1 %1 %4"
					]
				},
			"cos": {
				"float:float" : ["COS %1.x %2.x"],
				"vec2:vec2" : ["COS %1.xy %2.xy"],
				"vec3:vec3" : ["COS %1.xyz %2.xyz"],
				"vec4:vec4" : ["COS %1 %2"],
				},
			"degrees": {
				"float:float" : ["MUL %1.x %2.x " + (180 / Math.PI)],
				"vec2:vec2" : ["MUL %1.xy %2.xy " + (180 / Math.PI)],
				"vec3:vec3" : ["MUL %1.xyz %2.xyz " + (180 / Math.PI)],
				"vec4:vec4" : ["MUL %1 %2 " + (180 / Math.PI)]
				},
			"dot": {
				"vec2,vec2:float" : ["DP2 %1.x %2.xy %3.xy"],
				"vec3,vec3:float" : ["DP3 %1.x %2.xyz %3.xyz"],
				"vec4,vec4:float" : ["DP4 %1.x %2 %3"]
				},
			"floor": {
				"float:float" : ["FLR %1.x %2.x"],
				"vec2:vec2" : ["FLR %1.xy %2.xy"],
				"vec3:vec3" : ["FLR %1.xyz %2.xyz"],
				"vec4:vec4" : ["FLR %1 %2"],
				},
			"fract": {
				"float:float" : ["FRC %1.x %2.x"],
				"vec2:vec2" : ["FRC %1.xy %2.xy"],
				"vec3:vec3" : ["FRC %1.xyz %2.xyz"],
				"vec4:vec4" : ["FRC %1 %2"],
				},
	        "max": {
				"float,float:float" : ["MAX %1.x %2.x %3.x"],
				"vec2,float:vec2" : ["MAX %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["MAX %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["MAX %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["MAX %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["MAX %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["MAX %1 %2 %3"]
				},
	        "min": {
				"float,float:float" : ["MIN %1.x %2.x %3.x"],
				"vec2,float:vec2" : ["MIN %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["MIN %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["MIN %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["MIN %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["MIN %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["MIN %1 %2 %3"]
				},
	        "mix": {
				"float,float,float:float" : [
					"MAD %1.x -%2.x %4.x %2.x",
					"MAD %1.x %3.x %4.x %1.x"
					],
				"vec2,vec2,float:vec2" : [
					"MAD %1.xy -%2.xy %4.x %2.xy",
					"MAD %1.xy %3.xy %4.x %1.xy"
					],
				"vec3,vec3,float:vec3" : [
					"MAD %1.xyz -%2.xyz %4.x %2.xyz",
					"MAD %1.xyz %3.xyz %4.x %1.xyz"
					],
				"vec4,vec4,float:vec4" : [
					"MAD %1 -%2 %4.x %2",
					"MAD %1 %3 %4.x %1"
					],
				"vec2,vec2,vec2:vec2" : [
					"MAD %1.xy -%2.xy %4.xy %2.xy",
					"MAD %1.xy %3.xy %4.xy %1.xy"
					],
				"vec3,vec3,vec3:vec3" : [
					"MAD %1.xyz -%2.xyz %4.xyz %2.xyz",
					"MAD %1.xyz %3.xyz %4.xyz %1.xyz"
					],
				"vec4,vec4,vec4:vec4" : [
					"MAD %1 -%2 %4 %2",
					"MAD %1 %3 %4 %1"
					]
				},
	        "mod": {
				"float,float:float" : ["MOD %1.x %2.x %3.x"],
				"vec2,float:vec2" : ["MOD %1.xy %2.xy %3.x"],
				"vec3,float:vec3" : ["MOD %1.xyz %2.xyz %3.x"],
				"vec4,float:vec4" : ["MOD %1 %2 %3.x"],
				"vec2,vec2:vec2" : ["MOD %1.xy %2.xy %3.xy"],
				"vec3,vec3:vec3" : ["MOD %1.xyz %2.xyz %3.xyz"],
				"vec4,vec4:vec4" : ["MOD %1 %2 %3"]
				},
	        "normalize": {
				"vec3:vec3" : [
					"DP3 %1.x %2 %2",
					"RSQ %1.x %1.x",
					"MUL %1.xyz %2.xyz %1.x"
					],
				"vec4:vec4" : [
					"DP4 %1.x %2 %2",
					"RSQ %1.x %1.x",
					"MUL %1 %2 %1.x"
					]
				},
			"pow": {
				"float,float:float" : ["POW %1.x %2.x %3.x"]
				},
	        "reflect": {
				"vec3,vec3:vec3" : [
					"DP3 %1.x %3 %2",
					"MUL %1.xyz %3 %1.x",
					"MAD %1.xyz -%1 2.0 %2"
					]
				},
			"radians": {
				"float:float" : ["MUL %1.x %2.x " + (Math.PI / 180)],
				"vec2:vec2" : ["MUL %1.xy %2.xy " + (Math.PI / 180)],
				"vec3:vec3" : ["MUL %1.xyz %2.xyz " + (Math.PI / 180)],
				"vec4:vec4" : ["MUL %1 %2 " + (Math.PI / 180)],
				},
			"sign": {
				"float:float" : [
					"SGT %t1.x %2.x 0",
					"SLT %t1.y %2.x 0",
					"ADD %1.x %t1.x -%t1.y"
					],
				"vec2:vec2" : [
					"SGT %t1.xy %2.xy 0",
					"SLT %t1.zw %2.zw 0",
					"ADD %1.xy %t1.xy -%t1.zw"
					],
				"vec3:vec3" : [
					"SGT %t1.xyz %2.xyz 0",
					"SLT %t2.xyz %2.xyz 0",
					"ADD %1.xyz %t1.xyz -%t2.xyz"
					],
				"vec4:vec4" : [
					"SGT %t1 %2 0",
					"SLT %t2 %2 0",
					"ADD %1 %t1 -%t2"
					],
				},
			"sin": {
				"float:float" : ["SIN %1.x %2.x"],
				"vec2:vec2" : ["SIN %1.xy %2.xy"],
				"vec3:vec3" : ["SIN %1.xyz %2.xyz"],
				"vec4:vec4" : ["SIN %1 %2"],
				},
			"step": {
				"float,float:float" : ["SGE %1.x %3.x %2.x"],
				"float,vec2:vec2" : ["SGE %1.xy %3.x %2.xy"],
				"float,vec3:vec3" : ["SGE %1.xyz %3.x %2.xyz"],
				"float,vec4:vec4" : ["SGE %1 %3.x %2"],
				"vec2,vec2:vec2" : ["SGE %1.xy %3.xy %2.xy"],
				"vec3,vec3:vec3" : ["SGE %1.xyz %3.xyz %2.xyz"],
				"vec4,vec4:vec4" : ["SGE %1 %3 %3"],
				},
			"tan": {
				"float:float" : ["TAN %1.x %2.x"],
				"vec2:vec2" : ["TAN %1.xy %2.xy"],
				"vec3:vec3" : ["TAN %1.xyz %2.xyz"],
				"vec4:vec4" : ["TAN %1 %2"],
				},
			"texture2D": {
				"sampler2D,vec2:vec4" : ["TEX %1 %3 %2 \"2D\""]
				}
		}
	};
	
	function _builtinParseType(str) {
		var parts, ret;
	
		parts = str.split(":");
		parts[0] = parts[0].split(",");
		
		ret = {
			src : parts[0],
			dest : parts[1]
		};
		
		return ret;
	}
	
	
	function symbol_table_init(table, target) {
		var i, j, vars, v, entry, types, name;
	
		vars = (target === glsl.target.vertex) ? builtin.vars.vertex : builtin.vars.fragment;
	
		for (i = 0; i < vars.length; i++) {
			v = vars[i];
			entry = table.add_variable(v.name, v.type);
			entry.position = v.position;
			entry.out = v.out;
		}
	
		vars = builtin.func;
	
		for (name in vars) {
			v = vars[name];
			for (j in v) {
				types = _builtinParseType(j);	
				entry = table.add_function(name, types.dest, types.src);
				entry.code = v[j]
			}
		}
	}
	
	
	/* parser generated by jison 0.4.15 */
	/*
	  Returns a Parser object of the following structure:
	
	  Parser: {
	    yy: {}
	  }
	
	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),
	
	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),
	
	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },
	
	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }
	
	
	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }
	
	
	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = (function(){
	var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[13,14,15,16,17,21,22,47,108,120,121,125,128,132,133,134,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],$V1=[1,18],$V2=[1,19],$V3=[1,20],$V4=[1,21],$V5=[1,22],$V6=[1,53],$V7=[1,54],$V8=[1,17],$V9=[1,44],$Va=[1,45],$Vb=[1,28],$Vc=[1,47],$Vd=[1,48],$Ve=[1,49],$Vf=[1,50],$Vg=[1,40],$Vh=[1,41],$Vi=[1,42],$Vj=[1,43],$Vk=[1,46],$Vl=[1,55],$Vm=[1,56],$Vn=[1,57],$Vo=[1,58],$Vp=[1,59],$Vq=[1,60],$Vr=[1,61],$Vs=[1,62],$Vt=[1,63],$Vu=[1,64],$Vv=[1,65],$Vw=[1,66],$Vx=[1,67],$Vy=[1,68],$Vz=[1,69],$VA=[1,70],$VB=[1,71],$VC=[1,72],$VD=[1,73],$VE=[1,74],$VF=[1,75],$VG=[1,76],$VH=[1,37],$VI=[1,38],$VJ=[1,39],$VK=[1,77],$VL=[5,13,14,15,16,17,21,47,108,120,121,125,128,132,133,134,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],$VM=[1,82],$VN=[1,83],$VO=[1,84],$VP=[1,86],$VQ=[1,87],$VR=[49,106],$VS=[21,47,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],$VT=[2,121],$VU=[1,101],$VV=[1,102],$VW=[1,103],$VX=[1,100],$VY=[2,159],$VZ=[21,25,26,49,106],$V_=[2,141],$V$=[21,25,26,30,32,49,106],$V01=[21,47,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,169],$V11=[21,47,120,121,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],$V21=[21,25,26,30,32,34,49,106],$V31=[2,177],$V41=[2,12],$V51=[11,23,30,32,34,36,38,39,40,49,57,58,62,63,64,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,92,93,94,95,96,97,98,99,100,101,102,106,170],$V61=[5,10,13,14,15,16,17,21,25,26,28,29,30,39,40,47,51,57,58,59,60,106,108,120,121,125,128,132,133,134,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,172,189,191,193,194,195,196,197,198,202,203,204,205,206],$V71=[1,169],$V81=[1,170],$V91=[1,171],$Va1=[1,172],$Vb1=[1,156],$Vc1=[1,157],$Vd1=[1,182],$Ve1=[1,163],$Vf1=[1,164],$Vg1=[1,165],$Vh1=[1,166],$Vi1=[1,136],$Vj1=[1,127],$Vk1=[1,138],$Vl1=[1,139],$Vm1=[1,140],$Vn1=[1,141],$Vo1=[1,142],$Vp1=[1,143],$Vq1=[1,144],$Vr1=[1,145],$Vs1=[1,146],$Vt1=[1,147],$Vu1=[1,148],$Vv1=[1,149],$Vw1=[32,49],$Vx1=[10,21,25,26,28,29,30,39,40,47,51,57,58,59,60,106,108,120,121,125,128,132,133,134,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,172,189,193,194,195,196,197,198,202,203,204,205,206],$Vy1=[10,21,25,26,28,29,30,39,40,47,51,57,58,59,60,106,108,120,121,125,128,132,133,134,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,172,189,191,193,194,195,196,197,198,202,203,204,205,206],$Vz1=[1,216],$VA1=[23,32,36,49,106],$VB1=[23,32,36,49,57,58,62,63,64,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,106],$VC1=[2,58],$VD1=[23,32,36,49,57,58,62,63,64,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,92,93,94,95,96,97,98,99,100,101,102,106],$VE1=[1,251],$VF1=[23,32,36,49,88,90,106],$VG1=[1,252],$VH1=[23,32,34,36,38,39,40,49,57,58,62,63,64,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,92,93,94,95,96,97,98,99,100,101,102,106],$VI1=[10,21,25,26,28,29,30,39,40,47,51,57,58,59,60,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],$VJ1=[23,32,36,49,86,88,90,106],$VK1=[1,253],$VL1=[23,32,36,49,84,86,88,90,106],$VM1=[1,256],$VN1=[23,32,36,49,82,84,86,88,90,106],$VO1=[1,257],$VP1=[23,32,36,49,80,82,84,86,88,90,106],$VQ1=[1,261],$VR1=[23,32,36,49,78,80,82,84,86,88,90,106],$VS1=[1,264],$VT1=[1,265],$VU1=[10,21,25,26,28,29,30,32,39,40,47,51,57,58,59,60,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],$VV1=[23,32,36,49,75,76,78,80,82,84,86,88,90,106],$VW1=[1,266],$VX1=[1,267],$VY1=[1,268],$VZ1=[1,269],$V_1=[23,32,36,49,70,71,72,73,75,76,78,80,82,84,86,88,90,106],$V$1=[1,270],$V02=[1,271],$V12=[23,32,36,49,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,106],$V22=[1,272],$V32=[1,273],$V42=[23,32,36,49,57,58,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,106],$V52=[1,274],$V62=[1,275],$V72=[1,276],$V82=[21,47,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,172],$V92=[1,306],$Va2=[30,34],$Vb2=[32,106],$Vc2=[10,21,25,26,28,29,30,39,40,47,51,57,58,59,60,106,120,121,125,128,132,133,134,135,137,138,139,140,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169];
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"glsl-start":3,"translation_unit":4,"EOF":5,"version_statement":6,"extension_statement_list":7,"external_declaration_list":8,"VERSION":9,"INTCONSTANT":10,"EOL":11,"pragma_statement":12,"PRAGMA_DEBUG_ON":13,"PRAGMA_DEBUG_OFF":14,"PRAGMA_OPTIMIZE_ON":15,"PRAGMA_OPTIMIZE_OFF":16,"PRAGMA_INVARIANT_ALL":17,"extension_statement":18,"any_identifier":19,"variable_identifier":20,"TYPE_IDENTIFIER":21,"EXTENSION":22,":":23,"external_declaration":24,"IDENTIFIER":25,"NEW_IDENTIFIER":26,"primary_expression":27,"FLOATCONSTANT":28,"BOOLCONSTANT":29,"(":30,"expression":31,")":32,"postfix_expression":33,"[":34,"integer_expression":35,"]":36,"function_call":37,".":38,"++":39,"--":40,"function_call_or_method":41,"function_call_generic":42,"method_call_generic":43,"function_call_header_with_parameters":44,"function_call_header_no_parameters":45,"function_call_header":46,"VOID":47,"assignment_expression":48,",":49,"type_specifier":50,"FIELD_SELECTION":51,"method_call_header_with_parameters":52,"method_call_header_no_parameters":53,"method_call_header":54,"unary_expression":55,"unary_operator":56,"+":57,"-":58,"!":59,"~":60,"multiplicative_expression":61,"*":62,"/":63,"%":64,"additive_expression":65,"shift_expression":66,"<<":67,">>":68,"relational_expression":69,"<":70,">":71,"<=":72,">=":73,"equality_expression":74,"==":75,"!=":76,"and_expression":77,"&":78,"exclusive_or_expression":79,"^":80,"inclusive_or_expression":81,"|":82,"logical_and_expression":83,"&&":84,"logical_xor_expression":85,"^^":86,"logical_or_expression":87,"||":88,"conditional_expression":89,"?":90,"assignment_operator":91,"=":92,"*=":93,"/=":94,"%=":95,"+=":96,"-=":97,"<<=":98,">>=":99,"&=":100,"^=":101,"|=":102,"constant_expression":103,"declaration":104,"function_prototype":105,";":106,"init_declarator_list":107,"PRECISION":108,"precision_qualifier":109,"type_specifier_no_prec":110,"function_declarator":111,"function_header":112,"function_header_with_parameters":113,"parameter_declaration":114,"fully_specified_type":115,"parameter_declarator":116,"parameter_type_qualifier":117,"parameter_qualifier":118,"parameter_type_specifier":119,"IN":120,"OUT":121,"INOUT":122,"single_declaration":123,"initializer":124,"INVARIANT":125,"type_qualifier":126,"layout_qualifier":127,"LAYOUT":128,"layout_qualifier_id_list":129,"layout_qualifier_id":130,"interpolation_qualifier":131,"SMOOTH":132,"FLAT":133,"NOPERSPECTIVE":134,"CONST":135,"storage_qualifier":136,"ATTRIBUTE":137,"VARYING":138,"CENTROID":139,"UNIFORM":140,"type_specifier_nonarray":141,"basic_type_specifier_nonarray":142,"struct_specifier":143,"FLOAT":144,"DOUBLE":145,"INT":146,"BOOL":147,"VEC2":148,"VEC3":149,"VEC4":150,"BVEC2":151,"BVEC3":152,"BVEC4":153,"IVEC2":154,"IVEC3":155,"IVEC4":156,"MAT2X2":157,"MAT3X3":158,"MAT4X4":159,"SAMPLER1D":160,"SAMPLER2D":161,"SAMPLER3D":162,"SAMPLERCUBE":163,"SAMPLER1DSHADOW":164,"SAMPLER2DSHADOW":165,"HIGHP":166,"MEDIUMP":167,"LOWP":168,"STRUCT":169,"{":170,"struct_declaration_list":171,"}":172,"struct_declaration":173,"struct_declarator_list":174,"struct_declarator":175,"declaration_statement":176,"statement":177,"compound_statement":178,"simple_statement":179,"expression_statement":180,"selection_statement":181,"switch_statement":182,"case_label":183,"iteration_statement":184,"jump_statement":185,"statement_list":186,"statement_no_new_scope":187,"compound_statement_no_new_scope":188,"IF":189,"selection_rest_statement":190,"ELSE":191,"condition":192,"SWITCH":193,"CASE":194,"DEFAULT":195,"WHILE":196,"DO":197,"FOR":198,"for_init_statement":199,"for_rest_statement":200,"conditionopt":201,"CONTINUE":202,"BREAK":203,"RETURN":204,"DISCARD":205,"DEBUGGER":206,"function_definition":207,"$accept":0,"$end":1},
	terminals_: {2:"error",5:"EOF",9:"VERSION",10:"INTCONSTANT",11:"EOL",13:"PRAGMA_DEBUG_ON",14:"PRAGMA_DEBUG_OFF",15:"PRAGMA_OPTIMIZE_ON",16:"PRAGMA_OPTIMIZE_OFF",17:"PRAGMA_INVARIANT_ALL",21:"TYPE_IDENTIFIER",22:"EXTENSION",23:":",25:"IDENTIFIER",26:"NEW_IDENTIFIER",28:"FLOATCONSTANT",29:"BOOLCONSTANT",30:"(",32:")",34:"[",36:"]",38:".",39:"++",40:"--",47:"VOID",49:",",51:"FIELD_SELECTION",57:"+",58:"-",59:"!",60:"~",62:"*",63:"/",64:"%",67:"<<",68:">>",70:"<",71:">",72:"<=",73:">=",75:"==",76:"!=",78:"&",80:"^",82:"|",84:"&&",86:"^^",88:"||",90:"?",92:"=",93:"*=",94:"/=",95:"%=",96:"+=",97:"-=",98:"<<=",99:">>=",100:"&=",101:"^=",102:"|=",106:";",108:"PRECISION",120:"IN",121:"OUT",122:"INOUT",125:"INVARIANT",128:"LAYOUT",132:"SMOOTH",133:"FLAT",134:"NOPERSPECTIVE",135:"CONST",137:"ATTRIBUTE",138:"VARYING",139:"CENTROID",140:"UNIFORM",144:"FLOAT",145:"DOUBLE",146:"INT",147:"BOOL",148:"VEC2",149:"VEC3",150:"VEC4",151:"BVEC2",152:"BVEC3",153:"BVEC4",154:"IVEC2",155:"IVEC3",156:"IVEC4",157:"MAT2X2",158:"MAT3X3",159:"MAT4X4",160:"SAMPLER1D",161:"SAMPLER2D",162:"SAMPLER3D",163:"SAMPLERCUBE",164:"SAMPLER1DSHADOW",165:"SAMPLER2DSHADOW",166:"HIGHP",167:"MEDIUMP",168:"LOWP",169:"STRUCT",170:"{",172:"}",189:"IF",191:"ELSE",193:"SWITCH",194:"CASE",195:"DEFAULT",196:"WHILE",197:"DO",198:"FOR",202:"CONTINUE",203:"BREAK",204:"RETURN",205:"DISCARD",206:"DEBUGGER"},
	productions_: [0,[3,2],[4,3],[6,0],[6,3],[12,2],[12,2],[12,2],[12,2],[12,2],[7,0],[7,2],[19,1],[19,1],[18,5],[8,1],[8,2],[20,1],[20,1],[27,1],[27,1],[27,1],[27,1],[27,3],[33,1],[33,4],[33,1],[33,3],[33,2],[33,2],[35,1],[37,1],[41,1],[41,3],[42,2],[42,2],[45,2],[45,1],[44,2],[44,3],[46,2],[46,2],[46,1],[43,2],[43,2],[53,2],[53,1],[52,2],[52,3],[54,2],[55,1],[55,2],[55,2],[55,2],[56,1],[56,1],[56,1],[56,1],[61,1],[61,3],[61,3],[61,3],[65,1],[65,3],[65,3],[66,1],[66,3],[66,3],[69,1],[69,3],[69,3],[69,3],[69,3],[74,1],[74,3],[74,3],[77,1],[77,3],[79,1],[79,3],[81,1],[81,3],[83,1],[83,3],[85,1],[85,3],[87,1],[87,3],[89,1],[89,5],[48,1],[48,3],[91,1],[91,1],[91,1],[91,1],[91,1],[91,1],[91,1],[91,1],[91,1],[91,1],[91,1],[31,1],[31,3],[103,1],[104,2],[104,2],[104,4],[105,2],[111,1],[111,1],[113,2],[113,3],[112,3],[116,2],[116,5],[114,3],[114,2],[114,3],[114,2],[118,0],[118,1],[118,1],[118,1],[119,1],[107,1],[107,3],[107,5],[107,6],[107,7],[107,8],[107,5],[123,1],[123,2],[123,4],[123,5],[123,6],[123,7],[123,4],[123,2],[115,1],[115,2],[127,4],[129,1],[129,3],[130,1],[130,3],[131,1],[131,1],[131,1],[117,1],[126,1],[126,1],[126,2],[126,1],[126,2],[126,2],[126,3],[126,1],[136,1],[136,1],[136,1],[136,2],[136,1],[136,1],[136,2],[136,2],[136,1],[50,1],[50,2],[110,1],[110,3],[110,4],[141,1],[141,1],[141,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[142,1],[109,1],[109,1],[109,1],[143,5],[143,4],[171,1],[171,2],[173,3],[174,1],[174,3],[175,1],[175,4],[124,1],[176,1],[177,1],[177,1],[179,1],[179,1],[179,1],[179,1],[179,1],[179,1],[179,1],[178,2],[178,3],[187,1],[187,1],[188,2],[188,3],[186,1],[186,2],[180,1],[180,2],[181,5],[190,3],[190,1],[192,1],[192,4],[182,5],[183,3],[183,2],[184,5],[184,7],[184,6],[199,1],[199,1],[201,1],[201,0],[200,2],[200,3],[185,2],[185,2],[185,2],[185,3],[185,2],[185,2],[24,1],[24,1],[24,1],[207,2]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */
	
	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:
	 return $$[$0-1]; 
	break;
	case 15: case 16:
	
				if ($$[$0] !== null) {
					yy.state.addAstNode($$[$0]);
				}
			
	break;
	case 19:
	
					this.$ = new AstExpression('ident');
					this.$.setLocation(_$[$0]);
					this.$.primary_expression.identifier = $$[$0]; 
	break;
	case 20:
	
					this.$ = new AstExpression('int');
					this.$.setLocation(_$[$0]);
					this.$.primary_expression.int_constant = $$[$0];
					this.$.primary_expression.type = 'int'; 
	break;
	case 21:
	
					this.$ = new AstExpression('float');
					this.$.setLocation(_$[$0]);
					this.$.primary_expression.float_constant = $$[$0];
					this.$.primary_expression.type = 'float'; 
	break;
	case 22:
	
					this.$ = new AstExpression('bool');
					this.$.setLocation(_$[$0]);
					this.$.primary_expression.bool_constant = $$[$0];
					this.$.primary_expression.type = 'bool'; 
	break;
	case 23:
	
					this.$ = $$[$0-1];
					this.$.grouped = true;
			
	break;
	case 25:
	
					this.$ = new AstExpression('[]', $$[$0-3], $$[$0-1]);
					this.$.setLocation(_$[$0-3]); 
	break;
	case 27:
	
					this.$ = new AstExpression('.', $$[$0-2]);
					this.$.setLocation(_$[$0-2]);
					this.$.primary_expression.identifier = $$[$0]; 
	break;
	case 28:
	
					this.$ = new AstExpression('x++', $$[$0-1]);
					this.$.setLocation(_$[$0-1]); 
	break;
	case 29:
	
					this.$ = new AstExpression('x--', $$[$0-1]);
					this.$.setLocation(_$[$0-1]); 
	break;
	case 38:
	
					this.$ = $$[$0-1];
					this.$.setLocation(_$[$0-1]);
					this.$.expressions.push($$[$0]); 
	break;
	case 39:
	
					this.$ = $$[$0-2];
					this.$.setLocation(_$[$0-2]);
					this.$.expressions.push($$[$0]); 
	break;
	case 40:
	
					this.$ = new AstFunctionExpression($$[$0-1]);
					this.$.setLocation(_$[$0-1]);
				
	break;
	case 41:
	
					var callee = new AstExpression($$[$0-1]);
					this.$ = new AstFunctionExpression(callee);
					this.$.setLocation(_$[$0-1]); 
	break;
	case 51:
	
					this.$ = new AstExpression('++x', $$[$0]);
					this.$.setLocation(_$[$0-1]);
				
	break;
	case 52:
	
					this.$ = new AstExpression('--x', $$[$0]);
					this.$.setLocation(_$[$0-1]);
				
	break;
	case 53:
	
					this.$ = new AstExpression($$[$0-1], $$[$0]);
					this.$.setLocation(_$[$0-1]);
				
	break;
	case 54:
	
					this.$ = 'POS'; 
	break;
	case 55:
	
					this.$ = 'NEG'; 
	break;
	case 59: case 60: case 61: case 63: case 64: case 66: case 67: case 69: case 70: case 71: case 72: case 74: case 75: case 77: case 79: case 81: case 83: case 85: case 87:
	
					this.$ = new AstExpressionBin($$[$0-1], $$[$0-2], $$[$0]);
					this.$.setLocation(_$[$0-2]);
				
	break;
	case 89:
	
					this.$ = new AstExpression($$[$0-3], $$[$0-4], $$[$0-2], $$[$0]);
					this.$.setLocation(_$[$0-4]);
				
	break;
	case 91:
	
					this.$ = new AstExpression($$[$0-1], $$[$0-2], $$[$0]);
					this.$.setLocation(_$[$0-2]);
				
	break;
	case 103:
	
					this.$ = $$[$0];
				
	break;
	case 104:
	
					if ($$[$0-2].oper !== $$[$0-1]) {
						this.$ = new AstExpression($$[$0-1]);
						this.$.setLocation(_$[$0-2]);
						this.$.expressions.push($$[$0-2]);
					} else {
						this.$ = $$[$0-2];
					}
					this.$.expressions.push($$[$0]);
				
	break;
	case 106:
	
					yy.state.symbols.pop_scope();
					this.$ = $$[$0-1];
				
	break;
	case 107:
	
					this.$ = $$[$0-1];
				
	break;
	case 108:
	
					$$[$0-1].precision = $$[$0-2];
					$$[$0-1].is_precision_statement = true;
					this.$ = $$[$0-1]; 
	break;
	case 112:
	
				  	this.$ = $$[$0-1];
					this.$.parameters.push($$[$0]);
				
	break;
	case 113:
	
				  	this.$ = $$[$0-2];
					this.$.parameters.push($$[$0]);
	        
	break;
	case 114:
	
					this.$ = new AstFunction();
					this.$.setLocation(_$[$0-2]);
					this.$.return_type = $$[$0-2];
					this.$.identifier = $$[$0-1];
					
					//Check for duplicates
					if ($$[$0-1] == 'main') {
						if (yy.state.symbols.get_function($$[$0-1])) {
							var e = new Error("Cannot define main() more than once");
							e.lineNumber = _$[$0-2].first_line;
							e.columnNumber = _$[$0-2].first_column;
							throw e;
						}
					}
	
					this.$.entry = yy.state.symbols.add_function($$[$0-1], $$[$0-2].specifier.type_name);
					this.$.entry.Ast = this.$;
					yy.state.symbols.push_scope();
				
	break;
	case 115:
	
					this.$ = new AstParameterDeclarator();
					this.$.setLocation(_$[$0-1]);
					this.$.type = new AstFullySpecifiedType();
					this.$.type.setLocation(_$[$0-1]);
					this.$.type.specifier = $$[$0-1];
					this.$.identifier = $$[$0]; 
	break;
	case 117:
	
					$$[$0-2].concat($$[$0-1]);
					this.$ = $$[$0];
					this.$.type.qualifier = $$[$0-2]; 
	break;
	case 118:
	
					this.$ = $$[$0];
					this.$.type.qualifier = $$[$0-1]; 
	break;
	case 119:
	
					$$[$0-2].concat($$[$0-1]);
					this.$ = new AstParameterDeclarator();
					this.$.setLocation(_$[$0-2]);
					this.$.type = new AstFullySpecifiedType();
					this.$.type.qualifier = $$[$0-2];
					this.$.type.specifier = $$[$0]; 
	break;
	case 120:
	
					this.$ = new AstParameterDeclarator();
					this.$.setLocation(_$[$0-1]);
					this.$.type = new AstFullySpecifiedType();
					this.$.type.qualifier = $$[$0-1];
					this.$.type.specifier = $$[$0]; 
	break;
	case 121:
	
				  this.$ = []; 
	break;
	case 122:
	
				this.$ = ['in']; 
	break;
	case 123:
	
				this.$ = ['out']; 
	break;
	case 124:
	
				this.$ = ['inout']; 
	break;
	case 127:
	
				var decl = new AstDeclaration($$[$0], false);
				decl.setLocation(_$[$0-2]);
				this.$ = $$[$0-2];
				this.$.declarations.push(decl);
				/*yy.state.symbols.add_variable($$[$0]);*/ 
	break;
	case 129:
	
				var decl = new AstDeclaration($$[$0-3], true, $$[$0-1]);
				decl.setLocation(_$[$0-5]);
				this.$ = $$[$0-5];
				this.$.declarations.push(decl);
				/*yy.state.symbols.add_variable($$[$0-3]);*/ 
	break;
	case 132:
	
				var decl = new AstDeclaration($$[$0-2], false, null, $$[$0]);
				decl.setLocation(_$[$0-4]);
				this.$ = $$[$0-4];
				this.$.declarations.push(decl);
				/*yy.state.symbols.add_variable($$[$0-2]);*/ 
	break;
	case 133:
	
					if ($$[$0].specifier.type_specifier !== types.struct) {
						yy.state.addError("empty declaration list", _$[$0].first_line, _$[$0].first_column);
						return 0;
					}
	
					this.$ = new AstDeclaratorList($$[$0]);
					this.$.setLocation(_$[$0]); 
	break;
	case 134:
	
					var decl = new AstDeclaration($$[$0], false);
					decl.setLocation(_$[$0]);
					this.$ = new AstDeclaratorList($$[$0-1]);
					this.$.setLocation(_$[$0-1]);
					this.$.declarations.push(decl); 
	break;
	case 135:
	
					var decl = new AstDeclaration($$[$0-2], true);
					decl.setLocation(_$[$0-2]);
					this.$ = new AstDeclaratorList($$[$0-3]);
					this.$.setLocation(_$[$0-3]);
					this.$.declarations.push(decl); 
	break;
	case 136:
	
					var decl = new AstDeclaration($$[$0-3], true, $$[$0-1]);
					decl.setLocation(_$[$0-3]);
					this.$ = new AstDeclaratorList($$[$0-4]);
					this.$.setLocation(_$[$0-4]);
					this.$.declarations.push(decl); 
	break;
	case 137:
	
					var decl = new AstDeclaration($$[$0-4], true, null, $$[$0]);
					decl.setLocation(_$[$0-4]);
					this.$ = new AstDeclaratorList($$[$0-5]);
					this.$.setLocation(_$[$0-5]);
					this.$.declarations.push(decl); 
	break;
	case 138:
	
					var decl = new AstDeclaration($$[$0-5], true, $$[$0-3], $$[$0]);
					decl.setLocation(_$[$0-5]);
					this.$ = new AstDeclaratorList($$[$0-6]);
					this.$.setLocation(_$[$0-6]);
					this.$.declarations.push(decl); 
	break;
	case 139:
	
					var decl = new AstDeclaration($$[$0-2], false, null, $$[$0]);
					decl.setLocation(_$[$0-2]);
					this.$ = new AstDeclaratorList($$[$0-3]);
					this.$.setLocation(_$[$0-3]);
					this.$.declarations.push(decl); 
	break;
	case 141:
	
					this.$ = new AstFullySpecifiedType();
					this.$.setLocation(_$[$0]);
					this.$.specifier = $$[$0]; 
	break;
	case 142:
	
					this.$ = new AstFullySpecifiedType();
					this.$.setLocation(_$[$0-1]);
					this.$.qualifier = $$[$0-1];
					this.$.specifier = $$[$0]; 
	break;
	case 143:
	
					this.$ = $$[$0-1]; 
	break;
	case 151: case 160:
	
					this.$ = ['const']; 
	break;
	case 161:
	
					this.$ = ['attribute']; 
	break;
	case 162:
	
					this.$ = ['varying']; 
	break;
	case 163:
	
					this.$ = ['centroid', 'varying']; 
	break;
	case 164:
	
					this.$ = ['in']; 
	break;
	case 165:
	
					this.$ = ['out']; 
	break;
	case 166:
	
					this.$ = ['centroid', 'in']; 
	break;
	case 167:
	
					this.$ = ['centroid', 'out']; 
	break;
	case 168:
	
					this.$ = ['uniform']; 
	break;
	case 169:
	
					this.$ = $$[$0];  
				
	break;
	case 170:
	
					this.$ = $$[$0];
					this.$.precision = $$[$0-1];
				
	break;
	case 174: case 175: case 176:
	
			  	this.$ = new AstTypeSpecifier($$[$0]);
				this.$.setLocation(_$[$0]);
			
	break;
	case 200:
	
					this.$ = ast_precision.highp; 
	break;
	case 201:
	
					this.$ = ast_precision.mediump; 
	break;
	case 202:
	
					this.$ = ast_precision.lowp; 
	break;
	case 203:
	
					this.$ = new AstStructSpecifier($$[$0-3], $$[$0-1]);
					this.$.setLocation(_$[$0-4]);
					yy.state.symbols.add_type($$[$0-3], types._void);
				
	break;
	case 205:
	
					this.$ = [$$[$0]];
				
	break;
	case 206:
	
					this.$ = $$[$0-1];
					this.$.push($$[$0]);
				
	break;
	case 207:
	
					var type = new AstFullySpecifiedType();
					type.setLocation(_$[$0-2]);
					type.specifier = $$[$0-2];
					
					this.$ = new AstDeclaratorList(type);
					this.$.setLocation(_$[$0-2]);
					this.$.declarations = $$[$0-1]; 
	break;
	case 210:
	
					this.$ = new AstDeclaration($$[$0], false);
					this.$.setLocation(_$[$0]);
					yy.state.symbols.add_variable($$[$0]);
				
	break;
	case 219: case 220: case 258:
	
					this.$ = null; 
	break;
	case 223:
	
					this.$ = new AstCompoundStatement(true);
					this.$.setLocation(_$[$0-1]); 
	break;
	case 224:
	
				  	yy.state.symbols.push_scope();
					this.$ = new AstCompoundStatement(true, $$[$0-1]);
					this.$.setLocation(_$[$0-2]);
					yy.state.symbols.pop_scope(); 
	break;
	case 228:
	
					this.$ = new AstCompoundStatement(false, $$[$0-1]);
					this.$.setLocation(_$[$0-2]); 
	break;
	case 229:
	
					if ($$[$0] === null) {
						yy.state.addError("<nil> statement", _$[$0].first_line, _$[$0].first_column);
					} else {
						this.$ = [$$[$0]];
					}
				
	break;
	case 230:
	
					if ($$[$0] === null) {
						yy.state.addError("<nil> statement", _$[$0-1].first_line, _$[$0-1].first_column);
					}
					this.$ = $$[$0-1];
					this.$.push($$[$0]);
				
	break;
	case 232:
	
					this.$ = new AstExpressionStatement($$[$0-1]);
					this.$.setLocation(_$[$0-1]); 
	break;
	case 233:
	
					this.$ = new AstSelectionStatement($$[$0-2], $$[$0].then_statement, $$[$0].else_statement);
					this.$.setLocation(_$[$0-4]); 
	break;
	case 234:
	
			  		this.$ = {};
					this.$.then_statement = $$[$0-2];
					this.$.else_statement = $$[$0]; 
	break;
	case 235:
	
					this.$.then_statement = $$[$0]; 
	break;
	case 250:
	
				this.$ = new AstJumpStatement('continue');
				this.$.setLocation(_$[$0-1]); 
	break;
	case 251:
	
				this.$ = new AstJumpStatement('break');
				this.$.setLocation(_$[$0-1]); 
	break;
	case 252:
	
				this.$ = new AstJumpStatement('return');
				this.$.setLocation(_$[$0-1]); 
	break;
	case 253:
	
				this.$ = new AstJumpStatement('return', $$[$0-1]);
				this.$.setLocation(_$[$0-2]); 
	break;
	case 254:
	 /* Fragment shader only.*/
				this.$ = new AstJumpStatement('discard');
				this.$.setLocation(_$[$0-1]); 
	break;
	case 255:
	
				this.$ = new AstJumpStatement('debugger');
				this.$.setLocation(_$[$0-1]); 
	break;
	case 256: case 257:
	
					this.$ = $$[$0]; 
	break;
	case 259:
	
					this.$ = new AstFunctionDefinition();
					this.$.setLocation(_$[$0-1]);
					this.$.proto_type = $$[$0-1];
					this.$.body = $$[$0];
					yy.state.symbols.pop_scope(); 
	break;
	}
	},
	table: [o($V0,[2,3],{3:1,4:2,6:3,9:[1,4]}),{1:[3]},{5:[1,5]},o($V0,[2,10],{7:6}),{10:[1,7]},{1:[2,1]},{8:8,12:14,13:$V1,14:$V2,15:$V3,16:$V4,17:$V5,18:9,21:$V6,22:[1,11],24:10,47:$V7,50:29,104:13,105:15,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,207:12},{11:[1,78]},{5:[2,2],12:14,13:$V1,14:$V2,15:$V3,16:$V4,17:$V5,21:$V6,24:79,47:$V7,50:29,104:13,105:15,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,207:12},o($V0,[2,11]),o($VL,[2,15]),{19:80,20:81,21:$VM,25:$VN,26:$VO},o($VL,[2,256]),o($VL,[2,257]),o($VL,[2,258]),{106:$VP,170:$VQ,188:85},{49:[1,89],106:[1,88]},{109:90,166:$VH,167:$VI,168:$VJ},{11:[1,91]},{11:[1,92]},{11:[1,93]},{11:[1,94]},{11:[1,95]},{32:[1,96]},o($VR,[2,126]),o($VS,$VT,{114:97,117:98,118:99,32:[2,110],120:$VU,121:$VV,122:$VW,135:$VX}),{32:[2,111],49:[1,104]},o($VR,[2,133],{19:105,20:106,21:$VM,25:$VN,26:$VO}),o($VS,$VY,{20:107,136:108,131:109,25:$VN,26:$VO,120:$V9,121:$Va,132:$Vd,133:$Ve,134:$Vf,135:$Vg,137:$Vh,138:$Vi,139:$Vj,140:$Vk}),o($VZ,$V_),{21:$V6,47:$V7,50:110,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($V$,[2,169]),{21:$V6,47:$V7,110:111,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,169:$VK},o($VS,[2,152]),o($VS,[2,153],{136:112,120:$V9,121:$Va,135:$Vg,137:$Vh,138:$Vi,139:$Vj,140:$Vk}),o($VS,[2,155],{136:113,120:$V9,121:$Va,135:$Vg,137:$Vh,138:$Vi,139:$Vj,140:$Vk}),o($V$,[2,171],{34:[1,114]}),o($V01,[2,200]),o($V01,[2,201]),o($V01,[2,202]),o($VS,[2,160]),o($VS,[2,161]),o($VS,[2,162]),{120:[1,116],121:[1,117],138:[1,115]},o($VS,[2,164]),o($VS,[2,165]),o($VS,[2,168]),{30:[1,118]},o($V11,[2,148]),o($V11,[2,149]),o($V11,[2,150]),o($V21,[2,174]),o($V21,[2,175]),o($V21,[2,176]),o($V21,$V31),o($V21,[2,178]),o($V21,[2,179]),o($V21,[2,180]),o($V21,[2,181]),o($V21,[2,182]),o($V21,[2,183]),o($V21,[2,184]),o($V21,[2,185]),o($V21,[2,186]),o($V21,[2,187]),o($V21,[2,188]),o($V21,[2,189]),o($V21,[2,190]),o($V21,[2,191]),o($V21,[2,192]),o($V21,[2,193]),o($V21,[2,194]),o($V21,[2,195]),o($V21,[2,196]),o($V21,[2,197]),o($V21,[2,198]),o($V21,[2,199]),{19:119,20:81,21:$VM,25:$VN,26:$VO,170:[1,120]},o($V0,[2,4]),o($VL,[2,16]),{23:[1,121]},o([11,23,32,34,49,92,106,170],$V41),o([11,23,32,34,36,38,39,40,49,57,58,62,63,64,67,68,70,71,72,73,75,76,78,80,82,84,86,88,90,92,93,94,95,96,97,98,99,100,101,102,106,170],[2,13]),o($V51,[2,17]),o($V51,[2,18]),o($VL,[2,259]),o($V61,[2,106]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,172:[1,122],176:128,177:124,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,186:123,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},o($V61,[2,107]),{19:187,20:81,21:$VM,25:$VN,26:$VO},{21:$V6,47:$V7,110:188,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,169:$VK},o($VL,[2,5]),o($VL,[2,6]),o($VL,[2,7]),o($VL,[2,8]),o($VL,[2,9]),o([106,170],[2,109]),o($Vw1,[2,112]),o($VS,$VT,{118:189,120:$VU,121:$VV,122:$VW}),{21:$V6,47:$V7,50:192,109:32,110:31,116:190,119:191,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o([21,47,120,121,122,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],[2,151]),o($VS,[2,122]),o($VS,[2,123]),o($VS,[2,124]),o($VS,$VT,{117:98,118:99,114:193,120:$VU,121:$VV,122:$VW,135:$VX}),o($VR,[2,134],{34:[1,194],92:[1,195]}),o([34,49,92,106],$V41,{30:[1,196]}),o($VR,[2,140]),o($VS,[2,157]),{120:$V9,121:$Va,135:$Vg,136:197,137:$Vh,138:$Vi,139:$Vj,140:$Vk},o($VZ,[2,142]),o($V$,[2,170]),o($VS,[2,154]),o($VS,[2,156]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,36:[1,198],37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:200,103:199,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VS,[2,163]),o($VS,[2,166]),o($VS,[2,167]),{19:205,20:81,21:$VM,25:$VN,26:$VO,129:203,130:204},{170:[1,206]},{21:$V6,47:$V7,50:209,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,171:207,173:208},{19:210,20:81,21:$VM,25:$VN,26:$VO},o($V61,[2,227]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,172:[1,211],176:128,177:212,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},o($Vx1,[2,229]),o($Vy1,[2,214]),o($Vy1,[2,215]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,172:[1,213],176:128,177:124,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,186:214,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},o($Vy1,[2,216]),o($Vy1,[2,217]),o($Vy1,[2,218]),o($Vy1,[2,219]),o($Vy1,[2,220]),o($Vy1,[2,221]),o($Vy1,[2,222]),o($Vy1,[2,213]),o($Vy1,[2,231]),{49:$Vz1,106:[1,215]},{30:[1,217]},{30:[1,218]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:219,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{23:[1,220]},{30:[1,221]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,176:128,177:222,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},{30:[1,223]},{106:[1,224]},{106:[1,225]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:227,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,106:[1,226],109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{106:[1,228]},{106:[1,229]},{106:$VP},o($VA1,[2,103]),o($VA1,[2,90]),o($VB1,$VC1,{91:230,92:[1,231],93:[1,232],94:[1,233],95:[1,234],96:[1,235],97:[1,236],98:[1,237],99:[1,238],100:[1,239],101:[1,240],102:[1,241]}),o($VA1,[2,88],{88:[1,243],90:[1,242]}),o($VD1,[2,50],{34:[1,244],38:[1,245],39:[1,246],40:[1,247]}),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:248,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:249,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:250,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VZ,$V_,{30:$VE1}),o($VF1,[2,86],{86:$VG1}),o($VH1,[2,24]),o($VH1,[2,26]),o($VI1,[2,54]),o($VI1,[2,55]),o($VI1,[2,56]),o($VI1,[2,57]),o($VJ1,[2,84],{84:$VK1}),o($VH1,[2,19],{30:[1,254]}),o($VH1,[2,20]),o($VH1,[2,21]),o($VH1,[2,22]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:255,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VH1,[2,31]),o($VL1,[2,82],{82:$VM1}),o($VH1,[2,32]),o($VN1,[2,80],{80:$VO1}),{32:[1,258],49:[1,259]},{32:[1,260]},o($VP1,[2,78],{78:$VQ1}),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,32:[2,37],33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:[1,263],48:262,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VR1,[2,76],{75:$VS1,76:$VT1}),o($VU1,[2,42]),o($VV1,[2,73],{70:$VW1,71:$VX1,72:$VY1,73:$VZ1}),o($V_1,[2,68],{67:$V$1,68:$V02}),o($V12,[2,65],{57:$V22,58:$V32}),o($V42,[2,62],{62:$V52,63:$V62,64:$V72}),o($VR,[2,127],{34:[1,277],92:[1,278]}),{106:[1,279]},{21:$V6,47:$V7,50:192,109:32,110:31,116:280,119:281,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($Vw1,[2,118]),o($Vw1,[2,120]),o($Vw1,[2,125],{20:81,19:282,21:$VM,25:$VN,26:$VO}),o($Vw1,[2,113]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,36:[1,283],37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:200,103:284,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:285,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o([21,32,47,120,121,122,135,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169],[2,114]),o($VS,[2,158]),o($V$,[2,172]),{36:[1,287]},{36:[2,105]},o($VB1,$VC1),{30:$VE1},{32:[1,288],49:[1,289]},o($Vw1,[2,144]),o($Vw1,[2,146],{92:[1,290]}),{21:$V6,47:$V7,50:209,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,171:291,173:208},{21:$V6,47:$V7,50:209,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,172:[1,292],173:293},o($V82,[2,205]),{19:296,20:81,21:$VM,25:$VN,26:$VO,174:294,175:295},{11:[1,297]},o($V61,[2,228]),o($Vx1,[2,230]),o($Vy1,[2,223]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,172:[1,298],176:128,177:212,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},o($Vy1,[2,232]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:299,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:300,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:301,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{23:[1,302],49:$Vz1},o($Vy1,[2,240]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:304,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,115:305,120:$V9,121:$Va,125:$V92,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,192:303},{196:[1,307]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,176:310,180:309,199:308},o($Vy1,[2,250]),o($Vy1,[2,251]),o($Vy1,[2,252]),{49:$Vz1,106:[1,311]},o($Vy1,[2,254]),o($Vy1,[2,255]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:312,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VI1,[2,92]),o($VI1,[2,93]),o($VI1,[2,94]),o($VI1,[2,95]),o($VI1,[2,96]),o($VI1,[2,97]),o($VI1,[2,98]),o($VI1,[2,99]),o($VI1,[2,100]),o($VI1,[2,101]),o($VI1,[2,102]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:313,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:314,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:316,33:155,35:315,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{19:317,20:319,21:$VM,25:$VN,26:$VO,43:318,52:320,53:321,54:322},o($VH1,[2,28]),o($VH1,[2,29]),o($VD1,[2,51]),o($VD1,[2,52]),o($VD1,[2,53]),o($VU1,[2,40]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:323,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:324,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VU1,[2,41]),{32:[1,325],49:$Vz1},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:326,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:327,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VH1,[2,34]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:328,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VH1,[2,35]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:329,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($Vw1,[2,38]),o($Va2,$V31,{32:[2,36]}),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:330,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:331,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:332,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:333,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:334,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:335,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:336,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:337,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:338,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:339,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:340,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:341,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:342,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,36:[1,343],37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:200,103:344,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:345,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($V61,[2,108]),o($Vw1,[2,117]),o($Vw1,[2,119]),o($Vw1,[2,115],{34:[1,346]}),o($VR,[2,135],{92:[1,347]}),{36:[1,348]},o($VR,[2,139]),o([32,49,106],[2,212]),o($V$,[2,173]),o($V11,[2,143]),{19:205,20:81,21:$VM,25:$VN,26:$VO,130:349},{10:[1,350]},{21:$V6,47:$V7,50:209,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,172:[1,351],173:293},o($V21,[2,204]),o($V82,[2,206]),{49:[1,353],106:[1,352]},o($VR,[2,208]),o($VR,[2,210],{34:[1,354]}),o($V0,[2,14]),o($Vy1,[2,224]),o($VA1,[2,104]),{32:[1,355],49:$Vz1},{32:[1,356],49:$Vz1},o($Vy1,[2,239]),{32:[1,357]},o($Vb2,[2,236],{49:$Vz1}),{19:358,20:81,21:$VM,25:$VN,26:$VO},o($VS,$VY,{136:108,131:109,120:$V9,121:$Va,132:$Vd,133:$Ve,134:$Vf,135:$Vg,137:$Vh,138:$Vi,139:$Vj,140:$Vk}),{30:[1,359]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:304,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,106:[2,247],109:32,110:31,115:305,120:$V9,121:$Va,125:$V92,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,192:362,200:360,201:361},o($Vc2,[2,244]),o($Vc2,[2,245]),o($Vy1,[2,253]),o($VA1,[2,91]),{23:[1,363],49:$Vz1},o($VF1,[2,87],{86:$VG1}),{36:[1,364]},{36:[2,30],49:$Vz1},o($VH1,[2,27]),o($VH1,[2,33]),o($VH1,$V41,{30:[1,365]}),{32:[1,366],49:[1,367]},{32:[1,368]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,32:[2,46],33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:[1,370],48:369,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VJ1,[2,85],{84:$VK1}),o($VL1,[2,83],{82:$VM1}),o($VH1,[2,23]),o($VN1,[2,81],{80:$VO1}),o($VP1,[2,79],{78:$VQ1}),o($Vw1,[2,39]),o($VR1,[2,77],{75:$VS1,76:$VT1}),o($VV1,[2,74],{70:$VW1,71:$VX1,72:$VY1,73:$VZ1}),o($VV1,[2,75],{70:$VW1,71:$VX1,72:$VY1,73:$VZ1}),o($V_1,[2,69],{67:$V$1,68:$V02}),o($V_1,[2,70],{67:$V$1,68:$V02}),o($V_1,[2,71],{67:$V$1,68:$V02}),o($V_1,[2,72],{67:$V$1,68:$V02}),o($V12,[2,66],{57:$V22,58:$V32}),o($V12,[2,67],{57:$V22,58:$V32}),o($V42,[2,63],{62:$V52,63:$V62,64:$V72}),o($V42,[2,64],{62:$V52,63:$V62,64:$V72}),o($VB1,[2,59]),o($VB1,[2,60]),o($VB1,[2,61]),o($VR,[2,128],{92:[1,371]}),{36:[1,372]},o($VR,[2,132]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:200,103:373,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:374,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VR,[2,136],{92:[1,375]}),o($Vw1,[2,145]),o($Vw1,[2,147]),o($V21,[2,203]),o($V82,[2,207]),{19:296,20:81,21:$VM,25:$VN,26:$VO,175:376},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,50:202,51:$Vd1,55:201,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:200,103:377,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,176:128,177:379,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,189:$Vk1,190:378,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},{170:$Vj1,178:380},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$VQ,176:128,179:383,180:129,181:130,182:131,183:132,184:133,185:134,187:381,188:382,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},{92:[1,384]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:385,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{32:[1,386]},{106:[1,387]},{106:[2,246]},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:388,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VH1,[2,25]),o($VU1,[2,49]),o($VH1,[2,43]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:389,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VH1,[2,44]),o($Vw1,[2,47]),o($Va2,$V31,{32:[2,45]}),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:390,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VR,[2,129],{92:[1,391]}),{36:[1,392]},o($VR,[2,137]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:393,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VR,[2,209]),{36:[1,394]},o($Vy1,[2,233]),o($Vx1,[2,235],{191:[1,395]}),o($Vy1,[2,238]),o($Vy1,[2,241]),o($Vy1,[2,225]),o($Vy1,[2,226]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:396,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},{32:[1,397],49:$Vz1},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$VQ,176:128,179:383,180:129,181:130,182:131,183:132,184:133,185:134,187:398,188:382,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:399,32:[2,248],33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($VA1,[2,89]),o($Vw1,[2,48]),o($VR,[2,130]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:286,50:202,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,109:32,110:31,124:400,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK},o($Vw1,[2,116]),o($VR,[2,138]),o($VR,[2,211]),{10:$V71,20:168,21:$V6,25:$VN,26:$VO,27:161,28:$V81,29:$V91,30:$Va1,31:137,33:155,37:162,39:$Vb1,40:$Vc1,41:173,42:175,44:177,45:178,46:180,47:$V7,48:151,50:159,51:$Vd1,55:153,56:158,57:$Ve1,58:$Vf1,59:$Vg1,60:$Vh1,61:186,65:185,66:184,69:183,74:181,77:179,79:176,81:174,83:167,85:160,87:154,89:152,104:135,105:150,106:$Vi1,107:16,108:$V8,109:32,110:31,111:23,112:25,113:26,115:27,120:$V9,121:$Va,123:24,125:$Vb,126:30,127:34,128:$Vc,131:35,132:$Vd,133:$Ve,134:$Vf,135:$Vg,136:33,137:$Vh,138:$Vi,139:$Vj,140:$Vk,141:36,142:51,143:52,144:$Vl,145:$Vm,146:$Vn,147:$Vo,148:$Vp,149:$Vq,150:$Vr,151:$Vs,152:$Vt,153:$Vu,154:$Vv,155:$Vw,156:$Vx,157:$Vy,158:$Vz,159:$VA,160:$VB,161:$VC,162:$VD,163:$VE,164:$VF,165:$VG,166:$VH,167:$VI,168:$VJ,169:$VK,170:$Vj1,176:128,177:401,178:125,179:126,180:129,181:130,182:131,183:132,184:133,185:134,189:$Vk1,193:$Vl1,194:$Vm1,195:$Vn1,196:$Vo1,197:$Vp1,198:$Vq1,202:$Vr1,203:$Vs1,204:$Vt1,205:$Vu1,206:$Vv1},o($Vb2,[2,237]),{106:[1,402]},o($Vy1,[2,243]),{32:[2,249],49:$Vz1},o($VR,[2,131]),o($Vy1,[2,234]),o($Vy1,[2,242])],
	defaultActions: {5:[2,1],200:[2,105],362:[2,246]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    var lexer = Object.create(this.lexer);
	    var sharedState = { yy: {} };
	    for (var k in this.yy) {
	        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	            sharedState.yy[k] = this.yy[k];
	        }
	    }
	    lexer.setInput(input, sharedState.yy);
	    sharedState.yy.lexer = lexer;
	    sharedState.yy.parser = this;
	    if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	    }
	    var yyloc = lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = lexer.options && lexer.options.ranges;
	    if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }

	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(lexer.yytext);
	            lstack.push(lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = lexer.yyleng;
	                yytext = lexer.yytext;
	                yylineno = lexer.yylineno;
	                yyloc = lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                sharedState.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};
	
	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();
	
	
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function () { return parser.parse.apply(parser, arguments); };
	}
	/* generated by jison-lex 0.3.4 */
	var lexer = (function(){
	var lexer = ({
	
	EOF:1,
	
	parseError:function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },
	
	// resets the lexer, sets new input
	setInput:function (input, yy) {
	        this.yy = yy || this.yy || {};
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },
	
	// consumes and returns one char from the input
	input:function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }
	
	        this._input = this._input.slice(1);
	        return ch;
	    },
	
	// unshifts one char (or a string) into the input
	unput:function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);
	
	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);
	
	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;
	
	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };
	
	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },
	
	// When called from action, caches matched text and appends it on next action
	more:function () {
	        this._more = true;
	        return this;
	    },
	
	// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	reject:function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	
	        }
	        return this;
	    },
	
	// retain first n characters of the match
	less:function (n) {
	        this.unput(this.match.slice(n));
	    },
	
	// displays already matched input, i.e. for error messages
	pastInput:function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },
	
	// displays upcoming input, i.e. for error messages
	upcomingInput:function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },
	
	// displays the character position where the lexing error occurred, i.e. for error messages
	showPosition:function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },
	
	// test the lexed token: return FALSE when not a match, otherwise return token
	test_match:function (match, indexed_rule) {
	        var token,
	            lines,
	            backup;
	
	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }
	
	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },
	
	// return next match in input
	next:function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }
	
	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },
	
	// return next match that has a token
	lex:function lex() {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },
	
	// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	begin:function begin(condition) {
	        this.conditionStack.push(condition);
	    },
	
	// pop the previously active lexer condition state off the condition stack
	popState:function popState() {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },
	
	// produce the lexer rule set which is active for the currently active lexer condition state
	_currentRules:function _currentRules() {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },
	
	// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	topState:function topState(n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },
	
	// alias for begin(condition)
	pushState:function pushState(condition) {
	        this.begin(condition);
	    },
	
	// return the number of states currently on the stack
	stateStackSize:function stateStackSize() {
	        return this.conditionStack.length;
	    },
	options: {"moduleName":""},
	performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
	
	var YYSTATE=YY_START;
	switch($avoiding_name_collisions) {
	case 0:;
	break;
	case 1:
	break;
	case 2: this.begin('PP'); return 'VERSION'; 
	break;
	case 3: this.begin('PP'); return 'EXTENSION'; 
	break;
	case 4:
		
		/* Eat characters until the first digit is
		 * encountered
		 */
		
		var ptr = 0;
		while (yy_.yytext.slice(0, 1) < '0' || yy_.yytext.slice(0, 1) > '9') {
			ptr++;
		}
	
		/* Subtract one from the line number because
		 * yy_.yylineno is zero-based instead of
		 * one-based.
		 */
		yy_.yylineno = parseInt(yy_.yytext.slice(0, 1), 10) - 1;
		yy_.yylloc.source = parseInt(yy_.yytext.slice(0), 10);
	
	break;
	case 5:
					   /* Eat characters until the first digit is
					    * encountered
					    */
						var ptr = 0;
						while (yy_.yytext.slice(0, 1) < '0' || yy_.yytext.slice(0, 1) > '9')
							ptr++;
	
					   /* Subtract one from the line number because
					    * yy_.yylineno is zero-based instead of
					    * one-based.
					    */
					   yy_.yylineno = parseInt(yy_.yytext.slice(0, 1), 10) - 1;
					
	break;
	case 6:
					  this.begin('PP');
					  return 'PRAGMA_DEBUG_ON';
					
	break;
	case 7:
					  this.begin('PP');
					  return 'PRAGMA_DEBUG_OFF';
					
	break;
	case 8:
					  this.begin('PP');
					  return 'PRAGMA_OPTIMIZE_ON';
					
	break;
	case 9:
					  this.begin('PP');
					  return 'PRAGMA_OPTIMIZE_OFF';
					
	break;
	case 10:
					  this.begin('PP');
					  return 'PRAGMA_INVARIANT_ALL';
					
	break;
	case 11: this.begin('PRAGMA'); 
	break;
	case 12: this.begin('INITIAL'); yy_.yylineno++; yycolumn = 0; 
	break;
	case 13: 
	break;
	case 14: 
	break;
	case 15: 
	break;
	case 16:return ":";
	break;
	case 17:
					   yylval.identifier = strdup(yy_.yytext);
					   return 'IDENTIFIER';
					
	break;
	case 18:
					    yylval.n = parseInt(yy_.yytext);
					    return 'INTCONSTANT';
					
	break;
	case 19: this.begin('INITIAL'); yy_.yylineno++; yycolumn = 0; return 'EOL'; 
	break;
	case 20: /*yy_.yylineno++; yycolumn = 0;*/ 
	break;
	case 21:return 'ATTRIBUTE';
	break;
	case 22:return 'CONST';
	break;
	case 23:return 'BOOL';
	break;
	case 24:return 'FLOAT';
	break;
	case 25:return 'INT';
	break;
	case 26:return 'BREAK';
	break;
	case 27:return 'CONTINUE';
	break;
	case 28:return 'DO';
	break;
	case 29:return 'WHILE';
	break;
	case 30:return 'ELSE';
	break;
	case 31:return 'FOR';
	break;
	case 32:return 'IF';
	break;
	case 33:return 'DISCARD';
	break;
	case 34:return 'RETURN';
	break;
	case 35:return 'DEBUGGER';
	break;
	case 36:return 'BVEC2';
	break;
	case 37:return 'BVEC3';
	break;
	case 38:return 'BVEC4';
	break;
	case 39:return 'IVEC2';
	break;
	case 40:return 'IVEC3';
	break;
	case 41:return 'IVEC4';
	break;
	case 42:return 'VEC2';
	break;
	case 43:return 'VEC3';
	break;
	case 44:return 'VEC4';
	break;
	case 45:return 'MAT2X2';
	break;
	case 46:return 'MAT3X3';
	break;
	case 47:return 'MAT4X4';
	break;
	case 48:return 'IN';
	break;
	case 49:return 'OUT';
	break;
	case 50:return 'INOUT';
	break;
	case 51:return 'UNIFORM';
	break;
	case 52:return 'VARYING';
	break;
	case 53:return 'INVARIANT';
	break;
	case 54:return 'FLAT';
	break;
	case 55:return 'SMOOTH';
	break;
	case 56:return 'SAMPLER1D';
	break;
	case 57:return 'SAMPLER2D';
	break;
	case 58:return 'SAMPLER3D';
	break;
	case 59:return 'SAMPLERCUBE';
	break;
	case 60:return 'SAMPLER1DSHADOW';
	break;
	case 61:return 'SAMPLER2DSHADOW';
	break;
	case 62:return 'STRUCT';
	break;
	case 63:return 'VOID';
	break;
	case 64:/*copy manually*/
	break;
	case 65:return '++';
	break;
	case 66:return '--';
	break;
	case 67:return '<=';
	break;
	case 68:return '>=';
	break;
	case 69:return '==';
	break;
	case 70:return '!=';
	break;
	case 71:return '&&';
	break;
	case 72:return '||';
	break;
	case 73:return '^^';
	break;
	case 74:return '<<';
	break;
	case 75:return '>>';
	break;
	case 76:return '*=';
	break;
	case 77:return '/=';
	break;
	case 78:return '+=';
	break;
	case 79:return '%=';
	break;
	case 80:return '<<=';
	break;
	case 81:return '>>=';
	break;
	case 82:return '&=';
	break;
	case 83:return '^=';
	break;
	case 84:return '|=';
	break;
	case 85:return '-=';
	break;
	case 86:
				    this.yylval = parseFloat(yy_.yytext);
				    return 'FLOATCONSTANT';
				
	break;
	case 87:
					this.yylval = parseFloat(yy_.yytext);
					return 'FLOATCONSTANT';
				
	break;
	case 88:
				    this.yylval = parseFloat(yy_.yytext);
				    return 'FLOATCONSTANT';
				
	break;
	case 89:
				    this.yylval = parseFloat(yy_.yytext);
				    return 'FLOATCONSTANT';
				
	break;
	case 90:
				    this.yylval = parseFloat(yy_.yytext);
				    return 'FLOATCONSTANT';
				
	break;
	case 91:
				    this.yylval = parseInt(yy_.yytext + 2, 16);
				    return 'INTCONSTANT';
				
	break;
	case 92:
				    this.yylval = parseInt(yy_.yytext, 8);
				    return 'INTCONSTANT';
				
	break;
	case 93:
					this.yylval = parseInt(yy_.yytext);
					return 'INTCONSTANT';
				
	break;
	case 94:
				    this.yylval = 1;
				    return 'BOOLCONSTANT';
				
	break;
	case 95:
				    this.yylval = 0;
				    return 'BOOLCONSTANT';
				
	break;
	case 96:return 'ASM'
	break;
	case 97:return 'CLASS'
	break;
	case 98:return 'UNION'
	break;
	case 99:return 'ENUM'
	break;
	case 100:return 'TYPEDEF'
	break;
	case 101:return 'TEMPLATE'
	break;
	case 102:return 'THIS'
	break;
	case 103:return 'PACKED'
	break;
	case 104:return 'GOTO'
	break;
	case 105:return 'SWITCH'
	break;
	case 106:return 'DEFAULT'
	break;
	case 107:return 'INLINE'
	break;
	case 108:return 'NOINLINE'
	break;
	case 109:return 'VOLATILE'
	break;
	case 110:return 'PUBLIC'
	break;
	case 111:return 'STATIC'
	break;
	case 112:return 'EXTERN'
	break;
	case 113:return 'EXTERNAL'
	break;
	case 114:return 'INTERFACE'
	break;
	case 115:return 'LONG'
	break;
	case 116:return 'SHORT'
	break;
	case 117:return 'DOUBLE'
	break;
	case 118:return 'HALF'
	break;
	case 119:return 'FIXED'
	break;
	case 120:return 'UNSIGNED'
	break;
	case 121:return 'INPUT'
	break;
	case 122:return 'OUTPUT'
	break;
	case 123:return 'HVEC2'
	break;
	case 124:return 'HVEC3'
	break;
	case 125:return 'HVEC4'
	break;
	case 126:return 'DVEC2'
	break;
	case 127:return 'DVEC3'
	break;
	case 128:return 'DVEC4'
	break;
	case 129:return 'FVEC2'
	break;
	case 130:return 'FVEC3'
	break;
	case 131:return 'FVEC4'
	break;
	case 132:return 'SAMPLER2DRECT';
	break;
	case 133:return 'SAMPLER3DRECT';
	break;
	case 134:return 'SAMPLER2DRECTSHADOW';
	break;
	case 135:return 'SIZEOF';
	break;
	case 136:return 'CAST';
	break;
	case 137:return 'NAMESPACE';
	break;
	case 138:return 'USING';
	break;
	case 139:return 'LOWP';
	break;
	case 140:return 'MEDIUMP';
	break;
	case 141:return 'HIGHP';
	break;
	case 142:return 'PRECISION';
	break;
	case 143:
		yy.yylval = yy_.yytext;
		return yy.state.classify_identifier(yy.state, yy_.yytext);
	
	break;
	case 144:return yy_.yytext;
	break;
	case 145:return 'EOF';
	break;
	}
	},
	rules: [/^(?:[ \r\t]+)/,/^(?:[ \t]*#[ \t]*$)/,/^(?:[ \t]*#[ \t]*version\b)/,/^(?:[ \t]*#[ \t]*extension\b)/,/^(?:(^([ \t]*)([ \t]*))line([ \t]+)((([1-9][0-9]*)|([xX][0-9a-fA-F]+)|([0-7]*)))([ \t]+)((([1-9][0-9]*)|([xX][0-9a-fA-F]+)|([0-7]*)))([ \t]*)$)/,/^(?:(^([ \t]*)([ \t]*))line([ \t]+)((([1-9][0-9]*)|([xX][0-9a-fA-F]+)|([0-7]*)))([ \t]*)$)/,/^(?:([ \t]*)#([ \t]*)pragma([ \t]+)debug([ \t]*)\(([ \t]*)on([ \t]*)\))/,/^(?:([ \t]*)#([ \t]*)pragma([ \t]+)debug([ \t]*)\(([ \t]*)off([ \t]*)\))/,/^(?:([ \t]*)#([ \t]*)pragma([ \t]+)optimize([ \t]*)\(([ \t]*)on([ \t]*)\))/,/^(?:([ \t]*)#([ \t]*)pragma([ \t]+)optimize([ \t]*)\(([ \t]*)off([ \t]*)\))/,/^(?:([ \t]*)#([ \t]*)pragma([ \t]+)STDGL([ \t]+)invariant([ \t]*)\(([ \t]*)all([ \t]*)\))/,/^(?:([ \t]*)#([ \t]*)pragma([ \t]+))/,/^(?:[\n])/,/^(?:.)/,/^(?:\/\/[^\n]*)/,/^(?:[ \t\r]*)/,/^(?::)/,/^(?:[_a-zA-Z][_a-zA-Z0-9]*)/,/^(?:[1-9][0-9]*)/,/^(?:[\n])/,/^(?:[\n])/,/^(?:attribute\b)/,/^(?:const\b)/,/^(?:bool\b)/,/^(?:float\b)/,/^(?:int\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:do\b)/,/^(?:while\b)/,/^(?:else\b)/,/^(?:for\b)/,/^(?:if\b)/,/^(?:discard\b)/,/^(?:return\b)/,/^(?:debugger\b)/,/^(?:bvec2\b)/,/^(?:bvec3\b)/,/^(?:bvec4\b)/,/^(?:ivec2\b)/,/^(?:ivec3\b)/,/^(?:ivec4\b)/,/^(?:vec2\b)/,/^(?:vec3\b)/,/^(?:vec4\b)/,/^(?:mat2\b)/,/^(?:mat3\b)/,/^(?:mat4\b)/,/^(?:in\b)/,/^(?:out\b)/,/^(?:inout\b)/,/^(?:uniform\b)/,/^(?:varying\b)/,/^(?:invariant\b)/,/^(?:flat\b)/,/^(?:smooth\b)/,/^(?:sampler1D\b)/,/^(?:sampler2D\b)/,/^(?:sampler3D\b)/,/^(?:samplerCube\b)/,/^(?:sampler1DShadow\b)/,/^(?:sampler2DShadow\b)/,/^(?:struct\b)/,/^(?:void\b)/,/^(?:layout\b)/,/^(?:\+\+)/,/^(?:--)/,/^(?:<=)/,/^(?:>=)/,/^(?:==)/,/^(?:!=)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:\^\^)/,/^(?:<<)/,/^(?:>>)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:\+=)/,/^(?:%=)/,/^(?:<<=)/,/^(?:>>=)/,/^(?:&=)/,/^(?:\^=)/,/^(?:\|=)/,/^(?:-=)/,/^(?:[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?[fF]?)/,/^(?:\.[0-9]+([eE][+-]?[0-9]+)?[fF]?)/,/^(?:[0-9]+\.([eE][+-]?[0-9]+)?[fF]?)/,/^(?:[0-9]+[eE][+-]?[0-9]+[fF]?)/,/^(?:[0-9]+[fF])/,/^(?:0[xX][0-9a-fA-F]+)/,/^(?:0[0-7]*)/,/^(?:[1-9][0-9]*)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:asm\b)/,/^(?:class\b)/,/^(?:union\b)/,/^(?:enum\b)/,/^(?:typedef\b)/,/^(?:template\b)/,/^(?:this\b)/,/^(?:packed\b)/,/^(?:goto\b)/,/^(?:switch\b)/,/^(?:default\b)/,/^(?:inline\b)/,/^(?:noinline\b)/,/^(?:volatile\b)/,/^(?:public\b)/,/^(?:static\b)/,/^(?:extern\b)/,/^(?:external\b)/,/^(?:interface\b)/,/^(?:long\b)/,/^(?:short\b)/,/^(?:double\b)/,/^(?:half\b)/,/^(?:fixed\b)/,/^(?:unsigned\b)/,/^(?:input\b)/,/^(?:output\b)/,/^(?:hvec2\b)/,/^(?:hvec3\b)/,/^(?:hvec4\b)/,/^(?:dvec2\b)/,/^(?:dvec3\b)/,/^(?:dvec4\b)/,/^(?:fvec2\b)/,/^(?:fvec3\b)/,/^(?:fvec4\b)/,/^(?:sampler2DRect\b)/,/^(?:sampler3DRect\b)/,/^(?:sampler2DRectShadow\b)/,/^(?:sizeof\b)/,/^(?:cast\b)/,/^(?:namespace\b)/,/^(?:using\b)/,/^(?:lowp\b)/,/^(?:mediump\b)/,/^(?:highp\b)/,/^(?:precision\b)/,/^(?:[_a-zA-Z][_a-zA-Z0-9]*)/,/^(?:.)/,/^(?:$)/],
	conditions: {"PRAGMA":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145],"inclusive":true},"PP":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145],"inclusive":true}}
	});
	return lexer;
	})();
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	/**
	 * GLSL Parser Class
	 */
	function GlslParser() {
		
		//Jison Global
		this.jison = parser;
		this.jison.lexer = lexer;
	}
	
	var proto = GlslParser.prototype;
	
	/**
	 * Parse Program
	 */
	proto.parse = function(state) {
		var result;
	
		this.jison.yy =  {
			test : 1,
			state : state
		};
	
		try {
			this.jison.parse(state.getTranslationUnit());
		} catch(e) {
			state.addError(e.message, e.lineNumber, e.columnNumber);
			return false;
		}
	
		return true;
	};
	
	glsl.parser = new GlslParser();
	
	
	
	/**
	 * External Parse
	 *
	 * @param   string   src        Source code
	 * @param   object   options    Compilation options
	 *
	 * @return  object
	 */
	glsl.parse = function(src, options) {
		var state,
			result,
			irs
			;
	
		state = new GlslState(options);
		state.setSource(src);
	
		//Preprocess
		result = this.preprocessor.process(state);
	
		//Parse into AST
		if (result) {
			result = this.parser.parse(state);
		}
	
		if (result) {
			state.status = true;	
		}
	
		return state;
	};
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * Constructs a program's object code from an ast and symbol table
	 *
	 * @param   string     The error message
	 * @param   AstNode    The error AstNode
	 *
	 * @return  string
	 */
	glsl.generate = function(state) {
		var irs,
		    ast,
		    i,
			main
			;
	
		irs = new Ir(state.options.target);
		ast = state.getAst();
		
		try {
	
			for (i = 0; i < ast.length; i++) {
				ast[i].ir(state, irs);
			}
	
			main = state.symbols.get_function('main');
	
			//Accept main, but warn if params not void
			if (main.definition.join(",") !== "void") {
				state.addWarning("main() should take no parameters");
			}
	
			state.symbols.add_variable("<returned>", irs.getTemp(main.getType().slots));
			
			if (main.type != 'void') {
				state.addWarning("main() should be type void");	
			}
	
			if (!main) {
				state.addError("main() is not defined");
				return false;
			}
	
			main.Ast.body.ir(state, irs);
	
		} catch (e) {
	
			if (!e.ir) {
				e.message = "compiler error: " + e.message;
			}
	
			state.addError(e.message, e.lineNumber, e.columnNumber);
			return false;
		}
	
		state.setIR(irs);
	
		return true;
	};
	
	/**
	 * Constructs an error message
	 *
	 * @param   string     The error message
	 * @param   AstNode    The error AstNode
	 *
	 * @return  string
	 */
	AstNode.prototype.ir_error = function(message) {
		var e = new IrError();
	
		if (this.location) {
			e.lineNumber = this.location.first_line;
			e.columnNumber = this.location.first_column;
			e.message = message;
		}
	
		throw e;
	}
	
	/**
	 * Default IR
	 */
	AstNode.prototype.irx = function(state, irs) {
		this.ir_error(util.format("Can't generate ir for %s", this.typeOf()));
	};
	
	/**
	 * Constructs a type specifier code block
	 *
	 * @param   object   state    parser state
	 */
	AstTypeSpecifier.prototype.ir = function(state, irs) {
	
		if (this.is_precision_statement) {
			return;
		}
	
	//	this.ir_error("Cannot generate type specifier");
	};
	
	
	/**
	 * Constructs a declaration list
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstDeclaratorList.prototype.ir = function(state, irs) {
		var i;
	
		for (i = 0; i < this.declarations.length; i++) {
			this.declarations[i].ir(state, irs, this.type);
		}
	};
	
	/**
	 * Constructs a declaration
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstDeclaration.prototype.ir = function(state, irs, type) {
		var qualifier, name, entry, constant, assign, lhs, size;
	
		if (type.qualifier) {
			qualifier = type.qualifier;
		}
	
		name = this.identifier;
	
		//add symbol table entry
		entry = state.symbols.add_variable(name);
		entry.type = type.specifier.type_name;
		entry.qualifier = qualifier;
	
		if (qualifier.indexOf('uniform') !== -1) {
			entry.out = irs.getUniform(entry);
		} else if (qualifier.indexOf('attribute') !== -1) {
			entry.out = irs.getAttribute(entry);
		} else if (qualifier.indexOf('varying') !== -1) {
			entry.out = irs.getVarying(entry);
		} else {
			entry.out = irs.getTemp(entry.getType().slots);
		}
	
		constant = (qualifier === 'const');
	
		if (this.is_array) {
			
			this.array_size.ir(state, irs);
	
			if (this.array_size.Type != 'int') {
				this.ir_error("array size must be an integer");
			}
	
			if (!this.array_size.Const) {
				this.ir_error("array size must be constant");
			}
	
			size = parseInt(this.array_size.Dest);
	
			if (size < 1) {
				this.ir_error("array size cannot be less than 1");
			}
	
			entry.size = size;
	
			//Change the type of the entry so that expressions without indexing will fail
			entry.base_type = entry.type;
			entry.type += '[]';
		}
	
		if (this.initializer) {
	
			//@todo: generate constants at compile time (this may be able to be taken care of in the generator)
			if (constant) {
				//entry.constant = this.initializer.Dest;
			} else {
				lhs = new AstExpression('ident');
				lhs.primary_expression.identifier = name;
				assign = new AstExpression('=', lhs, this.initializer);
				assign.setLocation(this.location);
				assign.ir(state, irs);
			}
	
		} else {
			if (constant) {
				this.ir_error("Declaring const without initialier");
			}
		}	
	};
	
	/**
	 * Constructs a function definition block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstFunctionDefinition.prototype.ir = function(state, irs) {
	
		//handle function proto
		this.proto_type.ir(state, irs);
	
		this.proto_type.entry.Ast = this;
	};
	
	
	/**
	 * Constructs a function header code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstFunction.prototype.ir = function(state, irs) {
		var i;
	
		if (this.parameters.length == 0) {
			this.entry.definition.push('void');
		}
	
		//generate param list
		for (i = 0; i < this.parameters.length; i++) {
			this.entry.definition.push(this.parameters[i].type.specifier.type_name);
		}
	};
	
	
	/**
	 * Constructs a compound statement code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstCompoundStatement.prototype.ir = function(state, irs) {
		var i, stmt, retd_entry, maybe_returned;
	
		retd_entry = state.symbols.get_variable("<returned>");
		maybe_returned = false;
	
		for (i = 0; i < this.statements.length; i++) {
	
			stmt = this.statements[i];
	
			stmt.ir(state, irs);
	
			if (stmt instanceof AstJumpStatement && stmt.mode == 'return') {
				
				//Returning from block, set return status, and skip following instructions in block (unreachable)
				retd_entry.Passed = true;
				irs.push(new IrInstruction("MOV", retd_entry.out + ".x", "1.0"));
				break;
			}
			
			if (!maybe_returned && retd_entry.Passed) {
				maybe_returned = true;
				irs.push(new IrInstruction("IF", retd_entry.out + ".x"));
			}
		}
		
		if (maybe_returned) {
			irs.push(new IrInstruction("ENDIF"));	
		}
	};
	
	
	/**
	 * Constructs an expression statement code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpressionStatement.prototype.ir = function(state, irs) {
		this.expression.ir(state, irs);
	};
	
	
	
	
	/**
	 * Constructs an expression code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir = function(state, irs) {
		var i;
	
		//simple (variable, or value)
		for (i in this.primary_expression) {
			return this.ir_simple(state, irs);
		}
	
		//operator
		if (this.oper) {
			return this.ir_op(state, irs);
		}
	
		//cast
		if (this.constructor.name ==  'AstTypeSpecifier') {
			this.Type = this.type_specifier;
			return;
		}
	
		this.ir_error("Could not translate unknown expression type");
	};
	
	
	
	/**
	 * Constructs an operator expression code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_op = function(state, irs) {
		var se, temp, ops;
	
		if (se = this.subexpressions) {
			se[0] ? se[0].ir(state, irs) : null;
			se[1] ? se[1].ir(state, irs) : null;
			se[2] ? se[2].ir(state, irs) : null;
		}
		
		switch (this.oper) {
	
			//case '+=':
			case '=':
				this.ir_assign(state, irs);
				break;
	
			case 'POS':
				//useless
				this.Dest = se[0].Dest;
				this.Type = se[0].Type;
				break;
	
			case 'NEG':
	
				if (se[0].Dest.substring(0, 1) != '-') {
					this.Dest = "-" + se[0].Dest;	
				} else {
					this.Dest = se[0].Dest.substring(1);	
				}
				
				this.Type = se[0].Type;
				
				if (se[0].Const) {
					this.Const = se[0].Const;	
				}
				
				break;
	
			//Arithmetic
			case '+':
			case '-':
			case '*':
			case '/':
			case '%':
			case '&':
			case '^':
			case '|':
			case '~':
			case '<<':
			case '>>':
				this.ir_generate(state, irs, 2, true);
				break;
			
			//Boolean
			case '<':
			case '>':
			case '<=':
			case '>=':
			case '==':
			case '!=':
			case '&&':
			case '^^':
			case '||':
				this.ir_generate(state, irs, 2);
				break;
			case '!':
				this.ir_generate(state, irs, 1);
				break;
	
			/*
			case '*=':
			case '/=':
			case '%=':
			case '+=':
			case '-=':
			case '<<=':
			case '>>=':
			case '&=':
			case '^=':
			case '|=':
				break;
			case '?:':
				break;
			*/
			
			//Increment / Decrement
			case '++x':
			case '--x':
			case 'x++':
			case 'x--':
				this.ir_incdec(state, irs);
				break;
			//case '.': break;
			case '[]':
				this.ir_arr_index(state, irs);
				break;
			/*
			case 'VAR':
			case 'int':
			case 'float':
			case 'bool':
				ir_expression_simple(e, se);
				break;
			*/
			default:
				this.ir_error(util.format("Could not translate unknown expression %s (%s)", this, this.oper));
		}
	};
	
	
	/**
	 * Constructs an assignment expression
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_assign = function(state, irs, skip_comment/*, local*/) {
		var cond, ir, temp, size, slots, swz, i, entry, lhs, rhs, com;
	
		lhs = this.subexpressions[0];
		rhs = this.subexpressions[1];
	
		if (lhs.Type != rhs.Type || rhs.Const) {
			this.ir_cast.apply(rhs, [state, irs, lhs.Type]);
		}
	
		this.Type = lhs.Type;
	
		if (lhs.Entry && lhs.Entry.constant) {
			this.ir_error(util.format("Cannot assign value to constant %s", lhs.Dest));
		}
	
		if (!skip_comment) {
			com = util.format("%s => %s %s <%s>", rhs.Dest, lhs.Type, lhs.Dest, lhs.toString());
			irs.push(new IrComment(com, this.location));
		}
	
		size = types[this.Type].size;
		slots = types[this.Type].slots;
	
		//get the swizzle for each slot
		swz = Ir.swizzles[0].substring(0, 4 - (((slots * 4) - size) / slots));
	
		//all components are used up in all slots
		if (swz == Ir.swizzles[0]) {
			swz = "";
		}
	
		for (i = 0; i < slots; i++) {
			/*
			if (cond && !local) {
				ir = new IR('CMP', se[0].Dest, "-" + cond, se[1].Dest, se[0].Dest);
				ir.addOffset(i);
				ir.setSwizzle(swz);
				irs.push(ir);
	
			} else {
			*/
				ir = new IrInstruction('MOV', lhs.Dest, rhs.Dest);
				ir.addOffset(i);
				ir.setSwizzle(swz);
				irs.push(ir);
			/*
			}
			*/
		}
	};
	
	
	/**
	 * Constructs a cast operation
	 */
	AstExpression.prototype.ir_cast = function(state, irs, type) {
	
		//Can cast to type?
		if (Type.canCast(this.Type, type)) {
	
			//Simple case, constant
			if (this.Const) {
				this.Dest = Type.castTo(this.Dest, this.Type, type);
				this.Type = type;
			} else {
				//@todo: generate cast instructions
				this.ir_error(util.format("Could not assign value of type %s to %s", this.Type, type));
			}
	
		} else {
			this.ir_error(util.format("Could not assign value of type %s to %s", this.Type, type));
		}
	};
	
	/**
	 * Constructs a simple expression code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_simple = function(state, irs) {
		var name, entry, t;
	
		if (this.oper == '.') {
			this.ir_field(state, irs);
			return;
		}
	
		//identifier
		if (name = this.primary_expression.identifier) {
	
			//lookup identifier in symbol table
			entry = state.symbols.get_variable(name) || state.symbols.get_function(name);
	
			if (!entry /*|| !entry.type*/) {
				this.ir_error(util.format("%s is undefined", name));
			}
	
			this.Type = entry.type;
			this.Entry = entry;
	
			if (entry.constant) {
				this.Dest = entry.constant;
			} else {
				this.Dest = entry.out;
			}
	
			return;
		}
	
		//float constant
		if (this.primary_expression.type == 'float') {
			this.Type = 'float';
			this.Dest = this.primary_expression.float_constant;
			this.Const = true;
			return;
		}
	
		//int constant
		if (this.primary_expression.type == 'int') {
			this.Type = 'int';
			this.Dest = this.primary_expression.int_constant;
			this.Const = true;
			return;
		}
	
		this.ir_error("Cannot translate unknown simple expression type");
	};
	
	/**
	 * Constructs the code for an expression
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_generate = function(state, irs, len, arith) {
		var table, se, oprd_types, dest, i, j, def, match, comment, cnst;
	
		if (!(table = builtin.oper[this.oper])) {
			this.ir_error(util.format("Could not generate operation %s", this.oper));
		}
	
		se = this.subexpressions;
	
		//Fold constants
		if (state.options.opt.fold_constants && arith) {
			if (se[0].Const && se[1].Const) {
	
				cnst = eval(se[0].Dest + this.oper + se[1].Dest);
	
				//If the calculation results in an error, resume normal IR generation and let it be handled at runtime
				if (Number.isFinite(cnst)) {
					this.Dest = "" + cnst;
					this.Type = 'float';
					this.Const = true;
					return;
				}
			}
		}
	
		oprd_types = [];
		dest = [];
	
		for (i = 0; i < len; i++) {
			oprd_types.push(se[i].Type);
			dest.push(se[i].Dest);
		}
	
		def = new RegExp(oprd_types.join(",") + "\:(.*)");
		for (j in table) {
			if (match = j.match(def)) {
				break;
			}
		}
	
		if (!match) {
			this.ir_error(util.format("Could not apply operation %s to %s", this.oper, oprd_types.join(", ")));
		}
	
		this.Type = match[1];
		this.Dest = irs.getTemp(types[this.Type].slots);
		
		dest.splice(0, 0, this.Dest);
	
		if (len <= 4) {
			//this.Dest += util.format(".%s", swizzles[0].substring(0, glsl.type.size[this.Type]));
		}
	
		if (len == 1) {
			comment = util.format("(%s %s %s) => %s %s", this.oper, se[0].Type, se[0].Dest, this.Type, this.Dest);
		} else if (len == 2) {
			comment = util.format("(%s %s %s %s %s) => %s %s", se[0].Type, se[0].Dest, this.oper, se[1].Type, se[1].Dest, this.Type, this.Dest);
		} else if (len == 3) {
			comment = util.format("(%s %s ? %s %s : %s %s) => %s %s", se[0].Type, se[0].Dest, se[1].Type, se[1].Dest, se[2].Type, se[2].Dest, this.Type, this.Dest);
		}
	
		irs.push(new IrComment(comment, this.location));
	
		irs.build(table[j], dest);
	};
	
	/**
	 * Constructs an pre/post increment/decrement expression
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_incdec = function(state, irs) {
		var se, op, ins, post, type, i, ir;
	
		se = this.subexpressions[0];
	
		op = this.oper.replace('x', '');
		ins = op === '++' ? 'ADD' : 'SUB';
		post = this.oper.indexOf('x') === 0;
		type = types[se.Type];
	
		//Type check: base type must be int or float
		if (type.base != 'int' && type.base != 'float') {
			this.ir_error(util.format("Could not apply operation %s to %s", op, se.Type));
		}
	
		this.Type = se.Type;
	
		if (post) {
			//For post increment, the returned happens before the increment, so we need a temp to store it
			this.Dest = irs.getTemp(type.slots);
		} else {
			this.Dest = se.Dest;
		}
	
		irs.push(new IrComment(util.format("(%s%s) => %s %s", post ? se.Dest : op, post ? op : se.Dest, this.Type, this.Dest), this.location));
		
		for (i = 0; i < type.slots; i++) {
	
			if (post) {
				this.Dest = irs.getTemp(type.slots);
				ir = new IrInstruction('MOV', this.Dest, se.Dest);
				ir.addOffset(i);
				ir.setSwizzle(type.swizzle);
				irs.push(ir);
			}
	
			ir = new IrInstruction(ins, se.Dest, se.Dest, "1.0");
			ir.addOffset(i);
			ir.setSwizzle(type.swizzle);
			irs.push(ir);
		}
	
	};
	
	/**
	 * Constructs an array index expression
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_arr_index = function(state, irs) {
		var arr, idx, entry, size, cnst, oprd;
		
		arr = this.subexpressions[0];
		idx = this.subexpressions[1];
		
		entry = arr.Entry;
	
		//Ensure array index is integer
		if (idx.Type != 'int') {
			this.ir_error("array index out of bounds");
		}
	
		//@todo: Need to implement array indexing syntax for vector components
		if (!entry.size) {
			this.ir_error("cannot index a non-array value");	
		}
	
		//@todo: Need to implement array indexing for matrices
		if (types[entry.base_type].slots > 1) {
			this.ir_error("array indexing for matrices not implemented yet");	
		}
	
		this.Type = entry.base_type;
	
		//If constant index, we can do some additional error checking
		if (idx.Const) {
	
			cnst = parseInt(idx.Dest);
	
			if (cnst < 0 || cnst >= entry.size) {
				this.ir_error("array index out of bounds");	
			}
	
			oprd = new IrOperand(arr.Dest);
			oprd.index = cnst;
		
			this.Dest = oprd.toString();
	
		} else {
	
			//@todo: variable indexing is permitted by spec, but behavior is undefined for out of bounds
	
			this.ir_error("variable indexing not implemented yet");	
		}
	};
	
	/**
	 * Constructs a function expression
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstFunctionExpression.prototype.ir = function(state, irs) {
		var i, e, name, entry, ret_entry, retd_entry, call_types, operands, param, proto, loc;
	
		if (this.cons) {
			return this.ir_constructor(state, irs);
		}
	
		name = this.subexpressions[0].primary_expression.identifier;
	
		operands = [];
		call_types = [];
		
		for (i = 0; i < this.expressions.length; i++) {
	
			e = this.expressions[i];
			e.ir(state, irs);
	
			call_types.push(e.Type);
			operands.push(e.Dest);
		}
	
		entry = state.symbols.get_function(name, call_types);
		if (!entry) {
			this.ir_error(util.format("Function %s(%s) is not defined", name, call_types.join(", ")));
		}
	
		this.Type = entry.type;
		this.Dest = irs.getTemp(entry.getType().slots);
	
		irs.push(new IrComment(util.format("%s(%s) => %s %s", name, operands.join(", "), this.Type, this.Dest), this.location));
	
		if (entry.code) {
	
			//Use function template
			operands.unshift(this.Dest);
			irs.build(entry.code, operands);
			
		} else if (entry.Ast) {
	
			//Rebuild inline function from AST
			state.symbols.push_scope();
	
			//Enter vars into local symbol table
			proto = entry.Ast.proto_type;
			for (i = 0; i < proto.parameters.length; i++) {
				param = proto.parameters[i];
				loc = state.symbols.add_variable(param.identifier, param.type.specifier.type_name);
				loc.out = irs.getTemp(loc.getType().slots);
				
				//Add MOV operation from called param to local param
				irs.push(new IrComment(util.format("PARAM %s => %s %s", operands[i], loc.out, param.type.specifier.type_name), param.location));
	
				//Piggy-back off assignment generation
				lhs = new AstExpression('<param>');
				lhs.setLocation(this.getLocation());
				lhs.Type = loc.type;
				lhs.Dest = loc.out;
	
				assign = new AstExpression('=', lhs, this.expressions[i]);
				assign.setLocation(this.getLocation());
				assign.ir_assign(state, irs, true);
			}
			
			//Create a return entry for the new call scope
			ret_entry = state.symbols.add_variable("<return>", this.Type);
			ret_entry.out = this.Dest;
	
			retd_entry = state.symbols.add_variable("<returned>", "bool");
			retd_entry.out = irs.getTemp(retd_entry.getType().slots);
	
			entry.Ast.body.ir(state, irs);
	
			state.symbols.pop_scope();
		}
	};
	
	
	/**
	 * Constructs a type constructor
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstFunctionExpression.prototype.ir_constructor = function(state, irs) {
		var type, comment_text, comment, i, expr, src_expr, src_i, src_c, oprd, dest;
	
		type = this.subexpressions[0].type_specifier;
	
		this.Type = type.name;
		this.Dest = irs.getTemp(type.slots);
	
		comment_text = [];
		comment = new IrComment("", this.location);
		irs.push(comment);
	
		//Prepare components
		for (i = 0; i < this.expressions.length; i++) {
			
			expr = this.expressions[i];
	
			if (expr) {
				expr.ir(state, irs);	
				comment_text.push(expr.Dest);
			}
			
		}
	
		src_expr = this.expressions[0];
		src_i = 0; //Source expression index
		src_c = 0; //Component of source expression
	
		for (dest_i = 0; dest_i < type.size; dest_i++) {
	
			if (!src_expr) {
				this.ir_error("Not enough parameters to constructor");				
			}
	
			//@todo: need to add support for > vec4
			if (types[src_expr.Type].size > 4) {
				this.ir_error("Matrix components not implemented yet");	
			}
	
			//compute destination
			dest = util.format("%s.%s", this.Dest, Ir.swizzles[0][dest_i]);
	
			//compute source
			oprd = new IrOperand(src_expr.Dest);
	
			if (!oprd.swizzle) {
				oprd.swizzle = Ir.swizzles[0][src_c];
			}
	
			irs.push(new IrInstruction('MOV', dest, oprd.toString()));
	
			src_c++;
	
			//Get next source component expression
			if (src_c >= types[src_expr.Type].size) {
				if (this.expressions[src_i + 1]) {
					src_i++;
					src_expr = this.expressions[src_i];
					src_c = 0;
				}
			}
	
		}
	
		comment.comment = util.format("%s(%s) => %s %s", this.Type, comment_text.join(", "), this.Type, this.Dest);
	};
	
	
	/**
	 * Constructs a field selection code block
	 *
	 * @param   object   state   GLSL state
	 * @param   object   irs     IR representation
	 */
	AstExpression.prototype.ir_field = function(state, irs) {
		var field, swz, base, se;
	
		//pick swizzle set
		field = this.primary_expression.identifier;
	
		se = this.subexpressions[0];
		se.ir(state, irs);
	
		if (Ir.isSwizzle(field)) {
	
			base = types[se.Type].base;
			if (field.length > 1) {
				if (base == 'int') {
					base = 'ivec' + field.length;	
				}
				if (base == 'bool') {
					base = 'bvec' + field.length;	
				}
				if (base == 'float') {
					base = 'vec' + field.length;	
				}
			}
	
			this.Type = base;
	
			if (field.length > 4 || !this.Type) {
				this.ir_error(util.format("Invalid field selection %s.%s", se, field));
			}
	
			this.Dest = util.format("%s.%s", se.Dest, Ir.normalizeSwizzle(field));
		}
	}
	
	
	/**
	 * Constructs a selection statement
	 *
	 * @param   ast_node    Statement
	 */
	AstSelectionStatement.prototype.ir = function(state, irs) {
		var ir, cond;
	
		this.condition.ir(state, irs);
		//@todo: add a check that condition is bool type?
	
		irs.push(new IrComment(util.format("if %s then", this.condition.Dest), this.location));
	
		//set a flag based on the result
		ir = new IrInstruction('IF', this.condition.Dest);
	
		if (['bool', 'int', 'float'].indexOf(this.condition.Type) === -1) {
			this.ir_error("boolean expression expected");
		}
	
		if (!ir.d.swizzle) {
			ir.d.swizzle = 'x';
		}
	
		irs.push(ir);
	
		this.then_statement.ir(state, irs);
	
		if (this.else_statement) {
	
			irs.push(new IrInstruction('ELSE'));
	
			this.else_statement.ir(state, irs);
		}
	
		irs.push(new IrInstruction('ENDIF'));
	}
	
	/**
	 * Constructs a jump statement
	 *
	 * Note: jump semantics are a bit different in glsl as there is no true "jumping":
	 * functions are inlined, loops are unrolled, etc.
	 *
	 * @param   ast_node    Statement
	 */
	AstJumpStatement.prototype.ir = function(state, irs) {
		var ret, ret_entry, assign, lhs;
	
		switch (this.mode) {
	
			case 'return':
	
				ret = this.opt_return_value;
			
				if (ret) {
					
					ret.ir(state, irs);
			
					ret_entry = state.symbols.get_variable('<return>');
			
					//@todo: need to compare return value type with current function type
			
					irs.push(new IrComment(util.format("return => %s %s", ret.Dest, ret.Type), this.location));
			
					//Piggy-back off assignment generation
					lhs = new AstExpression('<return>');
					lhs.setLocation(this.getLocation());
					lhs.Type = ret.Type;
					lhs.Dest = ret_entry.out;
			
					assign = new AstExpression('=', lhs, ret);
					assign.setLocation(this.getLocation());
					assign.ir_assign(state, irs, true);
			
				} else {
					irs.push(new IrComment("return", this.location));
				}
			
				break;
			
			case 'debugger':
				
				irs.push(new IrComment("debugger", this.location));
				irs.push(new IrInstruction("DBGR"));
				break;
			
			default:
				//@todo:
		}
	
	};
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * IR Class
	 *
	 * Stores IR code tree
	 */	
	function Ir(target) {
	
		this.target = target;
	
		this.symbols = {
			uniform : {
				next : 0,
				entries : {}
			},
			attribute : {
				next : 0,
				entries : {}
			},
			varying : {
				next : 0,
				entries : {}
			},
			temp : {
				next : 0
			}
		};
	
		this.code = [];
		this.last = null;
	}
	
	Ir.prototype.getTemp = function(n) {
		var t;
	
		n = n || 1;
		t = 'temp@' + this.symbols.temp.next;
	
		this.symbols.temp.next += n;
	
		return t;
	};
	
	/**
	 * Add a symbol table entry into the local symbol table and return a new IR identifier
	 *
	 * @param   object   entry   Symbol table entry
	 *
	 * @return  string
	 */
	Ir.prototype.getUniform = function(entry) {
	
		var table = this.symbols.uniform, out;
	
		if (!table.entries[entry.name]) {
			table.entries[entry.name] = entry;
			entry.out = 'uniform@' + table.next;
			table.next += entry.getType().slots;
		}
	
		return entry.out;
	};
	
	/**
	 * Add a symbol table entry into the local symbol table and return a new IR identifier
	 *
	 * @param   object   entry   Symbol table entry
	 *
	 * @return  string
	 */
	Ir.prototype.getAttribute = function(entry) {
	
		var table = this.symbols.attribute, out;
	
		if (!table.entries[entry.name]) {
			table.entries[entry.name] = entry;
			entry.out = 'attribute@' + table.next;
			table.next += entry.getType().slots;
		}
	
		return entry.out;
	};
	
	/**
	 * Add a symbol table entry into the local symbol table and return a new IR identifier
	 *
	 * @param   object   entry   Symbol table entry
	 *
	 * @return  string
	 */
	Ir.prototype.getVarying = function(entry) {
	
		var table = this.symbols.varying, out;
	
		if (!table.entries[entry.name]) {
			table.entries[entry.name] = entry;
			entry.out = 'varying@' + table.next;
			table.next += entry.getType().slots;
		}
	
		return entry.out;
	};
	
	
	Ir.prototype.get = function(i) {
		return this.code[i];	
	};
	
	Ir.prototype.push = function(ir) {
		this.code.push(ir);
		this.last = ir;
	};
	
	Ir.isSwizzle = function(swz) {
	
		if (swz.match(/[xyzw]+/)) {
			return true;	
		}
	
		if (swz.match(/[rgba]+/)) {
			return true;	
		}
	
		if (swz.match(/[stpq]+/)) {
			return true;	
		}
	};
	
	Ir.normalizeSwizzle = function(swz) {
		var n;
	
		if (!this.isSwizzle(swz)) {
			return null;
		}
		
		n = swz
		   .replace(/[rs]/g, 'x')
		   .replace(/[gt]/g, 'y')
		   .replace(/[bp]/g, 'z')
		   .replace(/[aq]/g, 'w')
		   ;
	
		return n;
	};
	
	Ir.swizzles = ["xyzw", "rgba", "stpq"];
	
	
	/**
	 * Replaces all instances of an operand name and base index in all instructions after start
	 *
	 * @param   integer     Starting instruction number
	 * @param   string      Old name to search for
	 * @param   string      New name to replace with
	 * @param   integer     Add offset
	 * @param   boolean     True if replacing with a completely new operand
	 */
	Ir.prototype.replaceName = function(start, old, nw, index, repl) {
		var i, j, ir, f, name, neg_const;
		neg_const = old.match(/^\-([0-9]+\.[0-9]+)/);
		if (neg_const) {
			old = neg_const[1];
			neg_const = true;
		}
	
		for (i = start; i < this.code.length; i++) {
			ir = this.code[i];
	
			//foreach each operand field
			for (j = 0; j < IR.operands.length; j++) {
				f = IR.operands[j];
				if (ir[f] && ir[f].name == old) {
					if (repl) {
						ir[f] = new Ir.Operand(ir[f].neg + nw);
					} else {
						ir[f].name = nw;
						ir[f].addOffset(index);
					}
					if (neg_const && ir[f].neg) {
						ir[f].neg = "";
					}
				}	
			}
			
		}
	};
		
	Ir.prototype.toString = function() {
		return this.code.join("\n");
	};
	
	
	/**
	 * Builds instructions from code table record
	 *
	 * @param   array       List of instruction strings
	 * @param   array       List of operands
	 */
	Ir.prototype.build = function(code, oprds) {
		var dest, i, j, k, o, n, t, oprd, ir, new_swz, temps;
	
		//Parse operands
		for (i = 0; i < oprds.length; i++) {
	
			oprd = new IrOperand(oprds[i]);
	
			if (oprd.swizzle) {
	
				//need a new temp to move the swizzle so our code pattern works
				new_swz = Ir.swizzles[0].substring(0, oprd.swizzle.length);
	
				if (oprd.swizzle != new_swz) {
					dest = this.getTemp();
					ir = new IrInstruction('MOV', util.format("%s.%s", dest, new_swz), oprd.full);
					this.push(ir);
					oprd = new IrOperand(dest);
				}
			}
	
			oprds[i] = oprd;
		}
	
		temps = [];
	
		//Merge template with passed operands
		for (i = 0; i < code.length; i++) {
	
			ir = new IrInstruction(code[i]);
	
			//For each operand
			for (j = 0; j < IrInstruction.operands.length; j++) {		
				
				o = IrInstruction.operands[j];
				oprd = ir[o];
				
				if (!oprd) {
					break;
				}
	
				//Normal src/dest
				n = oprd.name.match(/%(\d+)/);
				if (n) {
					n = parseInt(n[1]);
					ir[o] = new IrOperand(oprds[n - 1].toString());
					ir[o].addOffset(oprd.address);
					ir[o].swizzle = oprd.swizzle;
					ir[o].neg = oprd.neg;
				}
				
				//Need temp
				t = oprd.name.match(/%t(\d+)/);
				if (t) {
	
					//Build up enough temps
					t = parseInt(t[1]);
					while (temps.length < t) {
						temps.push(this.getTemp());	
					}
					t = temps[t - 1].split('@');
					
					oprd.name = t[0];
					oprd.address = t[1];
					oprd.full = oprd.toString();
				}
				
			}
	
			this.push(ir);
		}
	};
	
	
	/**
	 * Ir Error Class
	 *
	 * Used to differentiate between a compilation error and a compiler error
	 */
	function IrError(msg) {
		this.msg = msg;
		this.ir = true;
	}
	IrError.prototype = Error.prototype;
	
	
	
	
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * IR Instruction Class
	 *
	 * Represents a single assembly-like instruction
	 */
	function IrInstruction(op, d, s1, s2, s3) {
		var args;
	
		this.str = null;
		this.line = null;
	
		if (arguments.length == 1) {
			args = op.split(/[\s,]/);
			op = args[0];
			d = args[1];
			s1 = args[2];
			s2 = args[3];
			s3 = args[4];
		}
	
		this.op = op;
		this.d = this.operand(d);
		this.s1 = this.operand(s1);
		this.s2 = this.operand(s2);
		this.s3 = this.operand(s3);
	}
	
	IrInstruction.operands = ['d', 's1', 's2', 's3'];
	
	
	IrInstruction.prototype.operand = function(opr) {
		return opr ? new IrOperand(opr) : "";
	};
	
	/**
	 * Adds the offset to all operands
	 *
	 * @param   integer    The offset to set
	 */
	IrInstruction.prototype.addOffset = function(offset) {
		var i, o;
	
		for (i = 0; i < IrInstruction.operands.length; i++) {
			o = IrInstruction.operands[i];
			if (this[o]) {
				this[o].addOffset(offset);	
			}
		}
	};
	
	/**
	 * Set the swizzle components on all operands
	 *
	 * @param   string    The swizzle to set
	 */
	IrInstruction.prototype.setSwizzle = function(swz) {
		var i, o;
	
		for (i = 0; i < IrInstruction.operands.length; i++) {
			o = IrInstruction.operands[i];
			if (this[o] && !this[o].swizzle) {
				this[o].swizzle = swz;
			}
		}
	};
	
	/**
	 * toString method
	 *
	 * @return  string
	 */
	IrInstruction.prototype.toString = function() {
		var out;
		out = util.format("%s%s%s%s%s;",
			this.op,
			this.d  ? ' '  + this.d  : '',
			this.s1 ? ', ' + this.s1 : '',
			this.s2 ? ', ' + this.s2 : '',
			this.s3 ? ', ' + this.s3 : ''
			);
		return out;
	};
	
	/**
	 * IR Comment Class
	 *
	 * Represents a single comment
	 */
	function IrComment(comment, loc) {
		this.comment = comment;
		this.loc = loc;
	}
	
	IrComment.prototype.toString = function() {
		var c = this.comment;
	
		if (this.loc) {
			c = util.format("%s [%s:%s-%s:%s]", c, this.loc.first_line, this.loc.first_column, this.loc.last_line, this.loc.last_column);
		}
		c = "\n# " + c;
	
		return c;
	};
	
	
	/**
	 * IR Operand Class
	 *
	 * Represents a single operand
	 */
	function IrOperand(str, raw) {
	
		this.full = "";
		this.neg = "";
		this.name = "";
		this.address = "";
		this.swizzle = "";
		this.number = "";
		this.raw = "";
		this.index = "";
	
		if (raw) {
			this.full = str;
			this.raw = str;
		} else {
			this.parse(str);
		}
	}
	
	/**
	 * Parses operand string
	 *
	 * @param   string    string that represents a single variable
	 */
	IrOperand.prototype.parse = function(str) {
		var parts, regex;
	
		if (!str) {
			return;
		}
	
		if (!isNaN(parseFloat(str))) {
			this.raw = str;
			return;
		}
	
		//neg
		regex = "(\-)?";
	
		//name (include '%' for our code substitution rules)
		regex += "([\\w%]+)";
	
		//number
		regex += "(?:@(\\d+))?";
	
		//index
		regex += "(?:\\[(\\d+)\\])?";
	
		//swizzle
		regex += "(?:\\.([xyzw]+))?";
	
		regex = new RegExp("^" + regex + "$");
	
		if (parts = str.match(regex)) {
	
			this.neg = parts[1] || "";
			this.name = parts[2];
			this.address = parseInt(parts[3]) || 0;
			this.index = parseInt(parts[4]) || 0;
			this.swizzle = parts[5] || "";
		} else {
			if (parts = str.match(/^"(.*)"$/)) {
				this.raw = parts[1];
			} else {
				this.raw = str;
			}
		}
	
		this.full = this.toString();
	};
	
	/**
	 * Adds an offset
	 *
	 * @param   integer    Offset to add
	 */
	IrOperand.prototype.addOffset = function(offset) {
	
		this.address = this.address || 0;
	
		this.address += offset;
	};
	
	/**
	 * toString method
	 *
	 * @return  string
	 */
	IrOperand.prototype.toString = function() {
		var str;
	
		if (this.raw) {
			str = this.raw;	
		} else {
			str = this.neg + this.name + ("@" + this.address) + (this.index !== "" ? "[" + this.index + "]" : "") + (this.swizzle ? "." + this.swizzle : "");
		}
		
		return str;
	};
	
	
	
	
	
	
	/*
	Copyright (c) 2014 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * GlslProgramJavascript class
	 */
	function GlslProgramJavascript() {
	
		this.vertex_code = [];
		this.fragment_code = [];
	
		this.symbols = new GlslProgramJavascriptVars();
		this.context = new GlslProgramJavascriptContext();
	
		this.library = {
			tex : function(dest, i, sampler, src, j, dim) {
				dest[i] = 0;
				dest[i + 1] = 0;
				dest[i + 2] = 0;
				dest[i + 3] = 1;
			}
		};
	
		this.vertex = null;
		this.shader = null;
	}
	
	var proto = GlslProgramJavascript.prototype;
	
	GlslProgramJavascript.translation_table = {
		'ABS'  : '%1.* = Math.abs(%2.*);',
		'ADD'  : '%1.* = %2.* + %3.*;',
		'AND'  : '%1.* = %2.* & %3.*;',
		//'ARL' : false,
		'CEIL' : '%1.* = Math.ceil(%2.*);',
		'CMP'  : '%1.* = (%2.* < 0.0) ? %3.* : %4.*;',
		'COS'  : '%1.* = Math.cos(%2.*);',
		'DIV'  : '%1.* = %2.* / %3.*;',
		'DBGR' : 'debugger;',
		'DP2'  : '%1.x = (%2.x * %3.x) + (%2.y * %3.y);',
		'DP3'  : '%1.x = (%2.x * %3.x) + (%2.y * %3.y) + (%2.z * %3.z);',
		'DP4'  : '%1.x = (%2.x * %3.x) + (%2.y * %3.y) + (%2.z * %3.z) + (%2.w * %3.w);',
		//'DPH' : '%1.* = (%2.x * %3.x + %2.y * %3.y + %2.z + %3.z + %3.w);',
		//'DST' : '%1.* = [1, %2.y * %3.y, %2.z, %3.w];',
		'ELSE' : '} else {',
		'ENDIF': '}',
		'FLR'  : '%1.* = Math.floor(%2.*);',
		'FRC'  : '%1.* = %2.* - Math.floor(%2.*);',
		'IF'   : 'if (%1.x) {',
		'MAD'  : '%1.* = (%2.* * %3.*) + %4.*;',
		'MAX'  : '%1.* = Math.max(%2.*, %3.*);',
		'MIN'  : '%1.* = Math.min(%2.*, %3.*);',
		'MOD'  : '%1.* = %2.* % %3.*;',
		'MOV'  : '%1.* = %2.*;',
		'MUL'  : '%1.* = %2.* * %3.*;',
		'OR'   : '%1.* = %2.* | %3.*;',
		'POW'  : '%1.x = Math.pow(%2.x, %3.x);',
		'RET'  : 'return;',
		'RSQ'  : '%1.* = (1.0 / Math.sqrt(%2.*));',
		'SEQ'  : '%1.* = (%2.* === %3.*) ? 1.0 : 0.0;',
		'SGE'  : '%1.* = (%2.* >=  %3.*) ? 1.0 : 0.0;',
		'SGT'  : '%1.* = (%2.* >   %3.*) ? 1.0 : 0.0;',
		'SIN'  : '%1.* = Math.sin(%2.*);',
		'SLE'  : '%1.* = (%2.* <=  %3.*) ? 1.0 : 0.0;',
		'SLT'  : '%1.* = (%2.* <   %3.*) ? 1.0 : 0.0;',
		'SNE'  : '%1.* = (%2.* !== %3.*) ? 1.0 : 0.0;',
		'SUB'  : '%1.* = %2.* - %3.*;',
		'TAN'  : '%1.* = Math.tan(%2.*);', //Non-standard opcode for NV_gpu
		'TEX'  : 'tex(%1, %4, %2, %5, %3.x, 0);', //%4 = address of %1, %5 = address of %2
		'XOR'  : '%1.* = %2.* ^ %3.*;'
	}; 
	
	/**
	 * Return string representation of program
	 *
	 * @param   int   target   target
	 *
	 * @return  string
	 */
	proto.toString = function(target) {
	
		if (target === glsl.target.fragment) {
			return this.fragment_code.join("\n");	
		} else if (target === glsl.target.vertex) {
			return this.vertex_code.join("\n");	
		} else {
			return this.current.join("\n");
		}
	};
	
	/**
	 * Translates IR code into a javascript representation
	 *
	 * @return  bool      true if there were no errors
	 */
	proto.addObjectCode = function(object, target) {
		var i, errors;
	
		//optimize(irs, symbols);
	
		this.mergeSymbols(object);
	
		this.current = [];
	
		for (i = 0; i < object.code.length; i++) {
			try {
				this.instruction(object.code[i]);
			} catch (e) {
				this.error = util.format("%s at %s:%s", e.message, e.lineNumber, e.columnNumber);
				return false;
			}
		}
	
		if (target == glsl.target.vertex) {
			this.vertex_code = this.current;
		} else if (target == glsl.target.fragment) {
			this.fragment_code = this.current;
		}
	
		return true;
	};
	
	/**
	 * Merge symbol code into program table
	 */
	proto.mergeSymbols = function(object) {
		var s, t, n, entry, sym, start, slots, comp;
		
		for (s in object.symbols) {
	
			t = object.symbols[s].entries;	
	
			for (n in t) {
	
				entry = t[n];
				start = parseInt(entry.out.split('@')[1]);
				slots = entry.getType().slots;
				comp = entry.getType().size / slots;
	
				if (s == 'uniform') {
					
					sym = this.symbols.addUniform(entry.name, start, slots, comp);
					
					if (this.findSymbolCollision(this.symbols.uniform, sym)) {
						this.rewriteSymbol(this.symbols.uniform, sym, object);
					}
	
				} else if (s == 'attribute') {					
					this.symbols.addAttribute(entry.name, start, slots, comp);
				} else if (s == 'varying') {
					this.symbols.addVarying(entry.name, start, slots, comp);				
				}
	
			}
		}
	};
	
	/**
	 * Scan symbol table to find collisions
	 */
	proto.findSymbolCollision = function(table, symbol) {
		var i, my_start, my_end, start, end;
	
		my_start = symbol.pos;
		my_end = my_start + symbol.slots - 1;
	
		for (i in table) {
	
			if (i == symbol.name) {
				continue;	
			}
			
			start = table[i].pos;
			end = start + table[i].slots - 1;
			
			if ((my_start >= start && my_start <= end) || (my_end >= start && my_end <= end)) {
				return true;
			}
			
		}
	
		return false;
	};
	
	/**
	 * Rewrite symbol table entry position in code
	 */
	proto.findNewSymbolPosition = function(table, symbol) {
		var i, size, addresses, last, next;
	
		addresses = [];
	
		//find new address
		for (i in table) {
			
			if (symbol.name == i) {
				continue;	
			}
			
			//start address
			addresses.push(table[i].pos);
			
			//end address
			addresses.push(table[i].pos + table[i].slots - 1);
		}
		
		addresses.sort();
		
		//Can insert at beginning
		if (addresses[0] >= symbol.slots) {
			return 0;
		}
	
		//Can insert in between
		for (i = 1; i < addresses.length; i += 2) {		
			last = addresses[i];
			next = addresses[i];
			
			if (next - last - 1 > symbol.slots) {
				return last + 1;	
			}
		}
	
		//Can insert at end
	
		return addresses.slice(-1)[0] + 1;
	};
	
	/**
	 * Rewrite symbol table entry position in code
	 */
	proto.rewriteSymbol = function(table, symbol, object) {
		var pos, old_start, old_end, diff, i, ins;
	
		old_start = symbol.pos;
		old_end = old_start + symbol.slots - 1;
	
		symbol.pos = this.findNewSymbolPosition(table, symbol);
		diff = symbol.pos - old_start;
	
		for (i = 0; i < object.code.length; i++) {
	
			ins = object.code[i];
			
			if (!(ins instanceof IrInstruction)) {
				continue;	  
			}
	
			this.rewriteOperandAddress(ins.d, old_start, old_end, diff, symbol);
			this.rewriteOperandAddress(ins.s1, old_start, old_end, diff, symbol);
			this.rewriteOperandAddress(ins.s2, old_start, old_end, diff, symbol);
			this.rewriteOperandAddress(ins.s3, old_start, old_end, diff, symbol);
		}
	};
	
	/**
	 * Rewrite symbol table entry position in code
	 */
	proto.rewriteOperandAddress = function(oprd, old_start, old_end, diff, symbol) {
		var diff;
		
		if (!oprd) {
			return;	
		}
	
		if (oprd.name != symbol.type) {
			return;
		}
	
		if (oprd.address >= old_start && oprd.address <= old_end) {
			oprd.address += diff;
		}
	};
	
	/**
	 * Build a program
	 *
	 * @return  function
	 */
	proto.build = function() {
	
		var module, shaders;
	
		module = new Function("stdlib", "foreign", "heap",
			"//\"use asm\";\n" +
			"var\n" +
			"uniform_f32   = new stdlib.Float32Array(heap,   0, 128),\n" +
			"attribute_f32 = new stdlib.Float32Array(heap, 512, 128),\n" +
			"varying_f32   = new stdlib.Float32Array(heap, 1024, 128),\n" +
			"result_f32    = new stdlib.Float32Array(heap, 1536, 128),\n" +
			"temp_f32      = new stdlib.Float32Array(heap, 2048, 128),\n" +
			"jstemp        = new stdlib.Float32Array(heap, 2544,   4),\n" +
			"tex           = foreign.tex;\n" +
			";\n" +
			"function vs() {\n" +
				this.vertex_code.join("\n") + "\n" +
			"}\n" +
			"function fs() {\n" +
				this.fragment_code.join("\n") + "\n" +
			"}\n" +
			"return { fragment : fs, vertex : vs };"
		);
	
		shaders = module(window, this.library, this.context.heap);
	
		this.vertex = shaders.vertex;
		this.fragment = shaders.fragment;	
	};
	
	/**
	 * Translates ASM instruction into output format
	 *
	 * @param   string    string that represents a single instruction
	 */
	proto.instruction = function(ins) {
		var tpl, dest, src, i, j, k, code, js;
	
		if (ins instanceof IrComment) {
			this.current.push('// ' + ins.toString().replace("\n", ""));
			return;
		}
	
		this.current.push('// ' + ins.toString());
	
		if (!(tpl = GlslProgramJavascript.translation_table[ins.op])) {
			throw new Error(util.format("Could not translate opcode '%s'", ins.op));
		}
	
		//variables
		dest = this.buildComponents(ins.d, true);
	
		if (!dest) {
			this.current.push(tpl);
			return;
		}
	
		src = [];
		src.push(this.buildComponents(ins.s1));
		src.push(this.buildComponents(ins.s2));
		src.push(this.buildComponents(ins.s3));
	
		if (ins.op == 'TEX') {
			js = tpl.replace(/%1/g, dest.name);
			js = js.replace(/%2/g, src[0].name);
			js = this.replaceOperand(js, '%3', src[1], 0);
			js = js.replace(/%4/g, dest.start);
			js = js.replace(/%5/g, src[0].start);
	
			this.current.push(js);
			this.current.push("");
			return;
		}
	
		this.generateTemp(dest, src, tpl);
	
		for (i = 0; i < dest.components.length; i++) {
	
			js = this.replaceOperand(tpl, '%1', dest, i);
	
			for (j = 0; j < 3; j++) {
				
				if (src[j]) {
					js = this.replaceOperand(js, '%' + (j + 2), src[j], i);
				}
	
			}
	
			this.current.push(js);
		}
	
		this.current.push("");
	};
	
	
	/**
	 * Replace an operand into code template
	 *
	 * @param   string   tpl    Template
	 * @param   string   from   Template operand
	 * @param   object   op     Operand info
	 * @param   int      n      Current component iteration  
	 */
	proto.replaceOperand = function(tpl, from, op, n) {
		var i,
		    out,
		    name,
		    addr,
		    swz = ['x', 'y', 'z', 'w']
			;
	
		if (op.raw) {
			name = op.name;
		} else {
			if (op.jstemp && op.jstemp[n]) {
				name = 'jstemp';
				addr = n;
			} else {
				name = op.name;
				if (op.components) {
					addr = op.start + op.components[n];
				}
			}
		}
	
		if (op.components) {
			out = tpl.replace(from + '.*', util.format("%s[%s]", name, addr));
		} else {
			out = tpl.replace(from + '.*', name);
		}
	
		for (i = 0; i < swz.length; i++) {
			out = out.replace(new RegExp(from + '\.' + swz[i], 'g'), util.format("%s[%s]", name, op.start + i));
		}
	
		return out;
	};
	
	
	/**
	 * Prepares info on IR operand
	 *
	 * @param   IrOperand   opr    Operand
	 * @param   bool        dest   Is destination?
	 *
	 * @return  object
	 */
	proto.buildComponents = function(opr, dest) {
		var i, swz, out;
	
		if (!opr) {
			return null;	
		}
	
		out = {};
	
		if (opr.raw) {
			out.name = opr.raw;
			out.raw = true;
			return out;
		}
	
		out.name = opr.neg + opr.name + '_f32';
		out.start = 4 * opr.address + 4 * opr.index;
		out.components = [];
		out.jstemp = [];
	
		//generate array representation of swizzle components, expanding if necessary
		swz = opr.swizzle || "xyzw";
		swz = swz.split("");
	
		for (i = 0; i < 4; i++) {
			//exact swizzle specified and less than 4 components, grab last one
			if (swz.length <= i) {
				if (!dest) {
					//repeat last one
					out.components.push(out.components[i - 1]);	
					out.jstemp.push(null);
				}
			} else {
				out.components.push("xyzw".indexOf(swz[i]));
				out.jstemp.push(null);
			}
		}
	
		return out;
	};
	
	proto.generateTemp = function(dest, src, tpl) {
		var i,
		    c,
			op,
		    written
			;
		
		for (i = 0; i < dest.components.length; i++) {
			written = dest.components.slice(0, i);
	
			for (c = 0; c < src.length; c++) {
				op = src[c];
				if (op && op.name == dest.name && op.start == dest.start && written.indexOf(op.components[i]) != -1) {
					op.jstemp[i] = true;
					this.current.push(util.format("jstemp[%s] = %s[%s]", i, op.name, op.start + op.components[i]));
				}
			}
		}
		
		//console.log(tpl, dest, src);
		//debugger;
	};
	
	/**
	 * Get Uniform Location
	 *
	 * @param   string   name   Name
	 *
	 * @return  int
	 */
	proto.getUniformLocation = function(name) {
	
		if (this.symbols.uniform[name]) {
			return this.symbols.uniform[name].start;	
		}
	
		return false;
	};
	
	/**
	 * Get Uniform Size
	 *
	 * @param   string   name   Name
	 *
	 * @return  int
	 */
	proto.getUniformSize = function(name) {
	
		if (this.symbols.uniform[name]) {
			return this.symbols.uniform[name].size;	
		}
		
		return false;
	};
	
	/**
	 * Set Uniform data
	 * 
	 * @param   string   name   Name
	 * @param   array    data   Data
	 */
	proto.setUniformData = function(name, data) {
		var i, l, s, d;
		
		d = data.length;
		l = this.getUniformSize(name);
		s = this.getUniformLocation(name);
		
		if (l === false) {
			return;	
		}
		
		this.context.uniform_f32.set(data, i + s);
	};
	
	/**
	 * Get Attribute Location
	 *
	 * @param   string   name   Name
	 *
	 * @return  int
	 */
	proto.getAttributeLocation = function(name) {
	
		if (this.symbols.attribute[name]) {
			return this.symbols.attribute[name].start;	
		}
		
		return false;
	};
	
	/**
	 * Get Attribute Size
	 *
	 * @param   string   name   Name
	 *
	 * @return  int
	 */
	proto.getAttributeSize = function(name) {
	
		if (this.symbols.attribute[name]) {
			return this.symbols.attribute[name].size;	
		}
		
		return false;
	};
	
	/**
	 * Set Attribute data
	 * 
	 * @param   string   name   Name
	 * @param   array    data   Data
	 */
	proto.setAttributeData = function(name, data) {
		var i, l, s, d;
		
		d = data.length;
		l = this.getAttributeSize(name);
		s = this.getAttributeLocation(name);
		
		if (l === false) {
			return;	
		}
		
		this.context.attribute_f32.set(data, i + s);
	};
	
	/**
	 * Get result data
	 *
	 * @param   int   start   Start pos
	 * @param   int   size    Size
	 *
	 * @return  array
	 */
	proto.getResultData = function(start, size) {
		var res;
		res = Array.prototype.slice.apply(this.context.result_f32, [start, size]);
		return res;
	};
	
	/**
	 * Set TEX lookup function
	 *
	 * 
	 */
	proto.setTexFunction = function(func) {
		this.library.tex = func;
	};
	
	
	glsl.program = GlslProgramJavascript;
	
	
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * GlslProgramJavascriptContext class
	 */
	function GlslProgramJavascriptContext() {
	
		this.heap = new ArrayBuffer(640 * 4);
	
		this.uniform_f32 = new Float32Array(this.heap, 0, 128);
		this.attribute_f32 = new Float32Array(this.heap, 128 * 4, 128);
		this.varying_f32 = new Float32Array(this.heap, 256 * 4, 128);
		this.result_f32 = new Float32Array(this.heap, 384 * 4, 128);
	}
	
	var proto = GlslProgramJavascriptContext.prototype;
	
	
	
	/*
	Copyright (c) 2011 Cimaron Shanahan
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	
	
	/**
	 * GlslProgramJavascriptVars Class
	 */
	function GlslProgramJavascriptVars() {
		this.uniform = {};
		this.attribute = {};
		this.varying = {};
	}
	
	var proto = GlslProgramJavascriptVars.prototype;
	
	
	/**
	 * Add uniform variable
	 */
	proto.addUniform = function(name, pos, slots, comp) {
	
		this.uniform[name] = new GlslProgramJavascriptVar(name, pos, slots, comp, 'uniform');
		
		return this.uniform[name];	
	};
	
	/**
	 * Add attribute variable
	 */
	proto.addAttribute = function(name, pos, slots, comp) {
	
		this.attribute[name] = new GlslProgramJavascriptVar(name, pos, slots, comp, 'attribute');
	
		return this.attribute[name];	
	};
	
	/**
	 * Add varying variable
	 */
	proto.addVarying = function(name, pos, slots, comp) {
	
		this.varying[name] = new GlslProgramJavascriptVar(name, pos, slots, comp, 'varying');
	
		return this.varying[name];
	};
	
	
	
	/**
	 * GlslProgramJavascriptVar Class
	 */
	function GlslProgramJavascriptVar(name, pos, slots, comp, type) {
		this.name = name;
		this.pos = pos;
		this.slots = slots;
		this.components = comp;
		this.type = type;
	}
	
	


	//this.glsl = glsl;

	if (typeof module !== 'undefined') {
		module.exports = glsl;
	}

}());
