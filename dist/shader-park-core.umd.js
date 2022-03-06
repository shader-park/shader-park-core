(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['shader-park-core'] = {}, global.three));
}(this, (function (exports, three) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var REACT_ELEMENT_TYPE;

  function _jsx(type, props, key, children) {
    if (!REACT_ELEMENT_TYPE) {
      REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7;
    }

    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {
        children: void 0
      };
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = new Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  }

  function _asyncIterator(iterable) {
    var method;

    if (typeof Symbol !== "undefined") {
      if (Symbol.asyncIterator) {
        method = iterable[Symbol.asyncIterator];
        if (method != null) return method.call(iterable);
      }

      if (Symbol.iterator) {
        method = iterable[Symbol.iterator];
        if (method != null) return method.call(iterable);
      }
    }

    throw new TypeError("Object is not async iterable");
  }

  function _AwaitValue(value) {
    this.wrapped = value;
  }

  function _AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;
        var wrappedAwait = value instanceof _AwaitValue;
        Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
          if (wrappedAwait) {
            resume(key === "return" ? "return" : "next", arg);
            return;
          }

          settle(result.done ? "return" : "normal", arg);
        }, function (err) {
          resume("throw", err);
        });
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  _AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  _AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  _AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  function _wrapAsyncGenerator(fn) {
    return function () {
      return new _AsyncGenerator(fn.apply(this, arguments));
    };
  }

  function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
  }

  function _asyncGeneratorDelegate(inner, awaitWrap) {
    var iter = {},
        waiting = false;

    function pump(key, value) {
      waiting = true;
      value = new Promise(function (resolve) {
        resolve(inner[key](value));
      });
      return {
        done: false,
        value: awaitWrap(value)
      };
    }

    ;

    if (typeof Symbol === "function" && Symbol.iterator) {
      iter[Symbol.iterator] = function () {
        return this;
      };
    }

    iter.next = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump("next", value);
    };

    if (typeof inner.throw === "function") {
      iter.throw = function (value) {
        if (waiting) {
          waiting = false;
          throw value;
        }

        return pump("throw", value);
      };
    }

    if (typeof inner.return === "function") {
      iter.return = function (value) {
        if (waiting) {
          waiting = false;
          return value;
        }

        return pump("return", value);
      };
    }

    return iter;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineEnumerableProperties(obj, descs) {
    for (var key in descs) {
      var desc = descs[key];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, key, desc);
    }

    if (Object.getOwnPropertySymbols) {
      var objectSymbols = Object.getOwnPropertySymbols(descs);

      for (var i = 0; i < objectSymbols.length; i++) {
        var sym = objectSymbols[i];
        var desc = descs[sym];
        desc.configurable = desc.enumerable = true;
        if ("value" in desc) desc.writable = true;
        Object.defineProperty(obj, sym, desc);
      }
    }

    return obj;
  }

  function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);

      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }

    return obj;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
      return !!right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();

    _getRequireWildcardCache = function () {
      return cache;
    };

    return cache;
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return {
        default: obj
      };
    }

    var cache = _getRequireWildcardCache();

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj.default = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _taggedTemplateLiteralLoose(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    strings.raw = raw;
    return strings;
  }

  function _readOnlyError(name) {
    throw new TypeError("\"" + name + "\" is read-only");
  }

  function _writeOnlyError(name) {
    throw new TypeError("\"" + name + "\" is write-only");
  }

  function _classNameTDZError(name) {
    throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
  }

  function _temporalUndefined() {}

  function _tdz(name) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  }

  function _temporalRef(val, name) {
    return val === _temporalUndefined ? _tdz(name) : val;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _slicedToArrayLoose(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _maybeArrayLike(next, arr, i) {
    if (arr && !Array.isArray(arr) && typeof arr.length === "number") {
      var len = arr.length;
      return _arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
    }

    return next(arr, i);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _iterableToArrayLimitLoose(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  function _skipFirstGeneratorNext(fn) {
    return function () {
      var it = fn.apply(this, arguments);
      it.next();
      return it;
    };
  }

  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];

    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }

    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");

    return typeof key === "symbol" ? key : String(key);
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.');
  }

  function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object.keys(descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object.defineProperty(target, property, desc);
      desc = null;
    }

    return desc;
  }

  var id = 0;

  function _classPrivateFieldLooseKey(name) {
    return "__private_" + id++ + "_" + name;
  }

  function _classPrivateFieldLooseBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError("attempted to use private field on non-instance");
    }

    return receiver;
  }

  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

    return _classApplyDescriptorGet(receiver, descriptor);
  }

  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

    _classApplyDescriptorSet(receiver, descriptor, value);

    return value;
  }

  function _classPrivateFieldDestructureSet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

    return _classApplyDescriptorDestructureSet(receiver, descriptor);
  }

  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }

    return privateMap.get(receiver);
  }

  function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);

    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");

    return _classApplyDescriptorGet(receiver, descriptor);
  }

  function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);

    _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

    _classApplyDescriptorSet(receiver, descriptor, value);

    return value;
  }

  function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);

    return method;
  }

  function _classStaticPrivateMethodSet() {
    throw new TypeError("attempted to set read only static private field");
  }

  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }

  function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }

      descriptor.value = value;
    }
  }

  function _classApplyDescriptorDestructureSet(receiver, descriptor) {
    if (descriptor.set) {
      if (!("__destrObj" in descriptor)) {
        descriptor.__destrObj = {
          set value(v) {
            descriptor.set.call(receiver, v);
          }

        };
      }

      return descriptor.__destrObj;
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }

      return descriptor;
    }
  }

  function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);

    _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

    return _classApplyDescriptorDestructureSet(receiver, descriptor);
  }

  function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
      throw new TypeError("Private static access of wrong provenance");
    }
  }

  function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
      throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
  }

  function _decorate(decorators, factory, superClass, mixins) {
    var api = _getDecoratorsApi();

    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        api = mixins[i](api);
      }
    }

    var r = factory(function initialize(O) {
      api.initializeInstanceElements(O, decorated.elements);
    }, superClass);
    var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
    api.initializeClassElements(r.F, decorated.elements);
    return api.runClassFinishers(r.F, decorated.finishers);
  }

  function _getDecoratorsApi() {
    _getDecoratorsApi = function () {
      return api;
    };

    var api = {
      elementsDefinitionOrder: [["method"], ["field"]],
      initializeInstanceElements: function (O, elements) {
        ["method", "field"].forEach(function (kind) {
          elements.forEach(function (element) {
            if (element.kind === kind && element.placement === "own") {
              this.defineClassElement(O, element);
            }
          }, this);
        }, this);
      },
      initializeClassElements: function (F, elements) {
        var proto = F.prototype;
        ["method", "field"].forEach(function (kind) {
          elements.forEach(function (element) {
            var placement = element.placement;

            if (element.kind === kind && (placement === "static" || placement === "prototype")) {
              var receiver = placement === "static" ? F : proto;
              this.defineClassElement(receiver, element);
            }
          }, this);
        }, this);
      },
      defineClassElement: function (receiver, element) {
        var descriptor = element.descriptor;

        if (element.kind === "field") {
          var initializer = element.initializer;
          descriptor = {
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            configurable: descriptor.configurable,
            value: initializer === void 0 ? void 0 : initializer.call(receiver)
          };
        }

        Object.defineProperty(receiver, element.key, descriptor);
      },
      decorateClass: function (elements, decorators) {
        var newElements = [];
        var finishers = [];
        var placements = {
          static: [],
          prototype: [],
          own: []
        };
        elements.forEach(function (element) {
          this.addElementPlacement(element, placements);
        }, this);
        elements.forEach(function (element) {
          if (!_hasDecorators(element)) return newElements.push(element);
          var elementFinishersExtras = this.decorateElement(element, placements);
          newElements.push(elementFinishersExtras.element);
          newElements.push.apply(newElements, elementFinishersExtras.extras);
          finishers.push.apply(finishers, elementFinishersExtras.finishers);
        }, this);

        if (!decorators) {
          return {
            elements: newElements,
            finishers: finishers
          };
        }

        var result = this.decorateConstructor(newElements, decorators);
        finishers.push.apply(finishers, result.finishers);
        result.finishers = finishers;
        return result;
      },
      addElementPlacement: function (element, placements, silent) {
        var keys = placements[element.placement];

        if (!silent && keys.indexOf(element.key) !== -1) {
          throw new TypeError("Duplicated element (" + element.key + ")");
        }

        keys.push(element.key);
      },
      decorateElement: function (element, placements) {
        var extras = [];
        var finishers = [];

        for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
          var keys = placements[element.placement];
          keys.splice(keys.indexOf(element.key), 1);
          var elementObject = this.fromElementDescriptor(element);
          var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
          element = elementFinisherExtras.element;
          this.addElementPlacement(element, placements);

          if (elementFinisherExtras.finisher) {
            finishers.push(elementFinisherExtras.finisher);
          }

          var newExtras = elementFinisherExtras.extras;

          if (newExtras) {
            for (var j = 0; j < newExtras.length; j++) {
              this.addElementPlacement(newExtras[j], placements);
            }

            extras.push.apply(extras, newExtras);
          }
        }

        return {
          element: element,
          finishers: finishers,
          extras: extras
        };
      },
      decorateConstructor: function (elements, decorators) {
        var finishers = [];

        for (var i = decorators.length - 1; i >= 0; i--) {
          var obj = this.fromClassDescriptor(elements);
          var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

          if (elementsAndFinisher.finisher !== undefined) {
            finishers.push(elementsAndFinisher.finisher);
          }

          if (elementsAndFinisher.elements !== undefined) {
            elements = elementsAndFinisher.elements;

            for (var j = 0; j < elements.length - 1; j++) {
              for (var k = j + 1; k < elements.length; k++) {
                if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                  throw new TypeError("Duplicated element (" + elements[j].key + ")");
                }
              }
            }
          }
        }

        return {
          elements: elements,
          finishers: finishers
        };
      },
      fromElementDescriptor: function (element) {
        var obj = {
          kind: element.kind,
          key: element.key,
          placement: element.placement,
          descriptor: element.descriptor
        };
        var desc = {
          value: "Descriptor",
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        if (element.kind === "field") obj.initializer = element.initializer;
        return obj;
      },
      toElementDescriptors: function (elementObjects) {
        if (elementObjects === undefined) return;
        return _toArray(elementObjects).map(function (elementObject) {
          var element = this.toElementDescriptor(elementObject);
          this.disallowProperty(elementObject, "finisher", "An element descriptor");
          this.disallowProperty(elementObject, "extras", "An element descriptor");
          return element;
        }, this);
      },
      toElementDescriptor: function (elementObject) {
        var kind = String(elementObject.kind);

        if (kind !== "method" && kind !== "field") {
          throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
        }

        var key = _toPropertyKey(elementObject.key);

        var placement = String(elementObject.placement);

        if (placement !== "static" && placement !== "prototype" && placement !== "own") {
          throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
        }

        var descriptor = elementObject.descriptor;
        this.disallowProperty(elementObject, "elements", "An element descriptor");
        var element = {
          kind: kind,
          key: key,
          placement: placement,
          descriptor: Object.assign({}, descriptor)
        };

        if (kind !== "field") {
          this.disallowProperty(elementObject, "initializer", "A method descriptor");
        } else {
          this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
          this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
          this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
          element.initializer = elementObject.initializer;
        }

        return element;
      },
      toElementFinisherExtras: function (elementObject) {
        var element = this.toElementDescriptor(elementObject);

        var finisher = _optionalCallableProperty(elementObject, "finisher");

        var extras = this.toElementDescriptors(elementObject.extras);
        return {
          element: element,
          finisher: finisher,
          extras: extras
        };
      },
      fromClassDescriptor: function (elements) {
        var obj = {
          kind: "class",
          elements: elements.map(this.fromElementDescriptor, this)
        };
        var desc = {
          value: "Descriptor",
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        return obj;
      },
      toClassDescriptor: function (obj) {
        var kind = String(obj.kind);

        if (kind !== "class") {
          throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
        }

        this.disallowProperty(obj, "key", "A class descriptor");
        this.disallowProperty(obj, "placement", "A class descriptor");
        this.disallowProperty(obj, "descriptor", "A class descriptor");
        this.disallowProperty(obj, "initializer", "A class descriptor");
        this.disallowProperty(obj, "extras", "A class descriptor");

        var finisher = _optionalCallableProperty(obj, "finisher");

        var elements = this.toElementDescriptors(obj.elements);
        return {
          elements: elements,
          finisher: finisher
        };
      },
      runClassFinishers: function (constructor, finishers) {
        for (var i = 0; i < finishers.length; i++) {
          var newConstructor = (0, finishers[i])(constructor);

          if (newConstructor !== undefined) {
            if (typeof newConstructor !== "function") {
              throw new TypeError("Finishers must return a constructor.");
            }

            constructor = newConstructor;
          }
        }

        return constructor;
      },
      disallowProperty: function (obj, name, objectType) {
        if (obj[name] !== undefined) {
          throw new TypeError(objectType + " can't have a ." + name + " property.");
        }
      }
    };
    return api;
  }

  function _createElementDescriptor(def) {
    var key = _toPropertyKey(def.key);

    var descriptor;

    if (def.kind === "method") {
      descriptor = {
        value: def.value,
        writable: true,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "get") {
      descriptor = {
        get: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "set") {
      descriptor = {
        set: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "field") {
      descriptor = {
        configurable: true,
        writable: true,
        enumerable: true
      };
    }

    var element = {
      kind: def.kind === "field" ? "field" : "method",
      key: key,
      placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
      descriptor: descriptor
    };
    if (def.decorators) element.decorators = def.decorators;
    if (def.kind === "field") element.initializer = def.value;
    return element;
  }

  function _coalesceGetterSetter(element, other) {
    if (element.descriptor.get !== undefined) {
      other.descriptor.get = element.descriptor.get;
    } else {
      other.descriptor.set = element.descriptor.set;
    }
  }

  function _coalesceClassElements(elements) {
    var newElements = [];

    var isSameElement = function (other) {
      return other.kind === "method" && other.key === element.key && other.placement === element.placement;
    };

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var other;

      if (element.kind === "method" && (other = newElements.find(isSameElement))) {
        if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
          if (_hasDecorators(element) || _hasDecorators(other)) {
            throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
          }

          other.descriptor = element.descriptor;
        } else {
          if (_hasDecorators(element)) {
            if (_hasDecorators(other)) {
              throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
            }

            other.decorators = element.decorators;
          }

          _coalesceGetterSetter(element, other);
        }
      } else {
        newElements.push(element);
      }
    }

    return newElements;
  }

  function _hasDecorators(element) {
    return element.decorators && element.decorators.length;
  }

  function _isDataDescriptor(desc) {
    return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
  }

  function _optionalCallableProperty(obj, name) {
    var value = obj[name];

    if (value !== undefined && typeof value !== "function") {
      throw new TypeError("Expected '" + name + "' to be a function");
    }

    return value;
  }

  function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    return fn;
  }

  function _classPrivateMethodSet() {
    throw new TypeError("attempted to reassign private method");
  }

  function _wrapRegExp(re, groups) {
    _wrapRegExp = function (re, groups) {
      return new BabelRegExp(re, undefined, groups);
    };

    var _RegExp = _wrapNativeSuper(RegExp);

    var _super = RegExp.prototype;

    var _groups = new WeakMap();

    function BabelRegExp(re, flags, groups) {
      var _this = _RegExp.call(this, re, flags);

      _groups.set(_this, groups || _groups.get(re));

      return _this;
    }

    _inherits(BabelRegExp, _RegExp);

    BabelRegExp.prototype.exec = function (str) {
      var result = _super.exec.call(this, str);

      if (result) result.groups = buildGroups(result, this);
      return result;
    };

    BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
      if (typeof substitution === "string") {
        var groups = _groups.get(this);

        return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
          return "$" + groups[name];
        }));
      } else if (typeof substitution === "function") {
        var _this = this;

        return _super[Symbol.replace].call(this, str, function () {
          var args = [];
          args.push.apply(args, arguments);

          if (typeof args[args.length - 1] !== "object") {
            args.push(buildGroups(args, _this));
          }

          return substitution.apply(this, args);
        });
      } else {
        return _super[Symbol.replace].call(this, str, substitution);
      }
    };

    function buildGroups(result, re) {
      var g = _groups.get(re);

      return Object.keys(g).reduce(function (groups, name) {
        groups[name] = result[g[name]];
        return groups;
      }, Object.create(null));
    }

    return _wrapRegExp.apply(this, arguments);
  }

  // Numbers represent type - 
  // 1:float 2:vec2 3:vec3 4:vec4
  var geometryFunctions = {
    sphere: {
      args: [1]
    },
    line: {
      args: [3, 3, 1]
    },
    cone: {
      args: [1, 1]
    },
    roundCone: {
      args: [3, 3, 1, 1]
    },
    plane: {
      args: [1, 1, 1, 1]
    }
  };
  var mathFunctions = {
    nsin: {
      args: [1],
      ret: 1
    },
    ncos: {
      args: [1],
      ret: 1
    },
    round: {
      args: [1],
      ret: 1
    },
    hsv2rgb: {
      args: [3],
      ret: 3
    },
    rgb2hsv: {
      args: [3],
      ret: 3
    },
    toSpherical: {
      args: [3],
      ret: 3
    },
    fromSpherical: {
      args: [3],
      ret: 3
    },
    getRayDirection: {
      args: [],
      ret: 3
    },
    osc: {
      args: [1],
      ret: 1
    },
    _hash33: {
      args: [3],
      ret: 3
    },
    _hash13: {
      args: [3],
      ret: 1
    },
    noise: {
      args: [3],
      ret: 1
    },
    fractalNoise: {
      args: [3],
      ret: 1
    },
    sphericalDistribution: {
      args: [3, 1],
      ret: 4
    }
  }; // these all have a single input/output and are overloaded for 
  // all types so a list of names is all we need to generate them

  var glslBuiltInOneToOne = ["sin", "cos", "tan", "asin", "acos", "exp", "log", "exp2", "log2", "sqrt", "inversesqrt", "abs", "sign", "floor", "ceil", "fract"]; // need better overloading system

  var glslBuiltInOther = {
    // overload pow somehow?
    pow: {
      args: [1, 1],
      ret: 1
    },
    mod: {
      args: [1, 1],
      ret: 1
    },
    min: {
      args: [1, 1],
      ret: 1
    },
    max: {
      args: [1, 1],
      ret: 1
    },
    atan: {
      args: [1, 1],
      ret: 1
    },
    clamp: {
      args: [1, 1, 1],
      ret: 1
    },
    step: {
      args: [1, 1],
      ret: 1
    },
    smoothstep: {
      args: [1, 1, 1],
      ret: 1
    },
    // also overload length for vec3 and vec2?
    length: {
      args: [3],
      ret: 1
    },
    distance: {
      args: [3, 3],
      ret: 1
    },
    dot: {
      args: [3, 3],
      ret: 1
    },
    cross: {
      args: [3, 3],
      ret: 3
    },
    normalize: {
      args: [3],
      ret: 3
    },
    reflect: {
      args: [3, 3],
      ret: 3
    },
    refract: {
      args: [3, 3],
      ret: 3
    }
  }; // let arg = {
  //     'mix' : (a, b, c) => (a.dim === b.dim && (c.dim === 1 || c.dim === a.dim))? a.dim: -1,
  // };

  function convertFunctionToString(source) {
    if (typeof source === "function") {
      source = source.toString();
      return source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
    } else if (!(typeof source === "string")) {
      throw "your Shader Park code requires the source code to be a function, or a string";
    }

    return source;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function getDefaultExportFromNamespaceIfPresent (n) {
  	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
  }

  function getDefaultExportFromNamespaceIfNotNamed (n) {
  	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
  }

  function getAugmentedNamespace(n) {
  	if (n.__esModule) return n;
  	var a = Object.defineProperty({}, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  function commonjsRequire (path) {
  	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }

  const name$1="estraverse";const description$1="ECMAScript JS AST traversal functions";const homepage$1="https://github.com/estools/estraverse";const main$1="estraverse.js";const version$1="4.3.0";const engines$1={node:">=4.0"};const maintainers$1=[{name:"Yusuke Suzuki",email:"utatane.tea@gmail.com",web:"http://github.com/Constellation"}];const repository$1={type:"git",url:"http://github.com/estools/estraverse.git"};const devDependencies$1={"babel-preset-env":"^1.6.1","babel-register":"^6.3.13",chai:"^2.1.1",espree:"^1.11.0",gulp:"^3.8.10","gulp-bump":"^0.2.2","gulp-filter":"^2.0.0","gulp-git":"^1.0.1","gulp-tag-version":"^1.3.0",jshint:"^2.5.6",mocha:"^2.1.0"};const license$1="BSD-2-Clause";const scripts$1={test:"npm run-script lint && npm run-script unit-test",lint:"jshint estraverse.js","unit-test":"mocha --compilers js:babel-register"};var require$$0 = {name:name$1,description:description$1,homepage:homepage$1,main:main$1,version:version$1,engines:engines$1,maintainers:maintainers$1,repository:repository$1,devDependencies:devDependencies$1,license:license$1,scripts:scripts$1};

  /*
    Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
    Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  var estraverse = createCommonjsModule(function (module, exports) {
  /*jslint vars:false, bitwise:true*/
  /*jshint indent:4*/
  /*global exports:true*/
  (function clone(exports) {
      'use strict';

      var Syntax,
          VisitorOption,
          VisitorKeys,
          BREAK,
          SKIP,
          REMOVE;

      function deepCopy(obj) {
          var ret = {}, key, val;
          for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                  val = obj[key];
                  if (typeof val === 'object' && val !== null) {
                      ret[key] = deepCopy(val);
                  } else {
                      ret[key] = val;
                  }
              }
          }
          return ret;
      }

      // based on LLVM libc++ upper_bound / lower_bound
      // MIT License

      function upperBound(array, func) {
          var diff, len, i, current;

          len = array.length;
          i = 0;

          while (len) {
              diff = len >>> 1;
              current = i + diff;
              if (func(array[current])) {
                  len = diff;
              } else {
                  i = current + 1;
                  len -= diff + 1;
              }
          }
          return i;
      }

      Syntax = {
          AssignmentExpression: 'AssignmentExpression',
          AssignmentPattern: 'AssignmentPattern',
          ArrayExpression: 'ArrayExpression',
          ArrayPattern: 'ArrayPattern',
          ArrowFunctionExpression: 'ArrowFunctionExpression',
          AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
          BlockStatement: 'BlockStatement',
          BinaryExpression: 'BinaryExpression',
          BreakStatement: 'BreakStatement',
          CallExpression: 'CallExpression',
          CatchClause: 'CatchClause',
          ClassBody: 'ClassBody',
          ClassDeclaration: 'ClassDeclaration',
          ClassExpression: 'ClassExpression',
          ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
          ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
          ConditionalExpression: 'ConditionalExpression',
          ContinueStatement: 'ContinueStatement',
          DebuggerStatement: 'DebuggerStatement',
          DirectiveStatement: 'DirectiveStatement',
          DoWhileStatement: 'DoWhileStatement',
          EmptyStatement: 'EmptyStatement',
          ExportAllDeclaration: 'ExportAllDeclaration',
          ExportDefaultDeclaration: 'ExportDefaultDeclaration',
          ExportNamedDeclaration: 'ExportNamedDeclaration',
          ExportSpecifier: 'ExportSpecifier',
          ExpressionStatement: 'ExpressionStatement',
          ForStatement: 'ForStatement',
          ForInStatement: 'ForInStatement',
          ForOfStatement: 'ForOfStatement',
          FunctionDeclaration: 'FunctionDeclaration',
          FunctionExpression: 'FunctionExpression',
          GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
          Identifier: 'Identifier',
          IfStatement: 'IfStatement',
          ImportExpression: 'ImportExpression',
          ImportDeclaration: 'ImportDeclaration',
          ImportDefaultSpecifier: 'ImportDefaultSpecifier',
          ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
          ImportSpecifier: 'ImportSpecifier',
          Literal: 'Literal',
          LabeledStatement: 'LabeledStatement',
          LogicalExpression: 'LogicalExpression',
          MemberExpression: 'MemberExpression',
          MetaProperty: 'MetaProperty',
          MethodDefinition: 'MethodDefinition',
          ModuleSpecifier: 'ModuleSpecifier',
          NewExpression: 'NewExpression',
          ObjectExpression: 'ObjectExpression',
          ObjectPattern: 'ObjectPattern',
          Program: 'Program',
          Property: 'Property',
          RestElement: 'RestElement',
          ReturnStatement: 'ReturnStatement',
          SequenceExpression: 'SequenceExpression',
          SpreadElement: 'SpreadElement',
          Super: 'Super',
          SwitchStatement: 'SwitchStatement',
          SwitchCase: 'SwitchCase',
          TaggedTemplateExpression: 'TaggedTemplateExpression',
          TemplateElement: 'TemplateElement',
          TemplateLiteral: 'TemplateLiteral',
          ThisExpression: 'ThisExpression',
          ThrowStatement: 'ThrowStatement',
          TryStatement: 'TryStatement',
          UnaryExpression: 'UnaryExpression',
          UpdateExpression: 'UpdateExpression',
          VariableDeclaration: 'VariableDeclaration',
          VariableDeclarator: 'VariableDeclarator',
          WhileStatement: 'WhileStatement',
          WithStatement: 'WithStatement',
          YieldExpression: 'YieldExpression'
      };

      VisitorKeys = {
          AssignmentExpression: ['left', 'right'],
          AssignmentPattern: ['left', 'right'],
          ArrayExpression: ['elements'],
          ArrayPattern: ['elements'],
          ArrowFunctionExpression: ['params', 'body'],
          AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
          BlockStatement: ['body'],
          BinaryExpression: ['left', 'right'],
          BreakStatement: ['label'],
          CallExpression: ['callee', 'arguments'],
          CatchClause: ['param', 'body'],
          ClassBody: ['body'],
          ClassDeclaration: ['id', 'superClass', 'body'],
          ClassExpression: ['id', 'superClass', 'body'],
          ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
          ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
          ConditionalExpression: ['test', 'consequent', 'alternate'],
          ContinueStatement: ['label'],
          DebuggerStatement: [],
          DirectiveStatement: [],
          DoWhileStatement: ['body', 'test'],
          EmptyStatement: [],
          ExportAllDeclaration: ['source'],
          ExportDefaultDeclaration: ['declaration'],
          ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
          ExportSpecifier: ['exported', 'local'],
          ExpressionStatement: ['expression'],
          ForStatement: ['init', 'test', 'update', 'body'],
          ForInStatement: ['left', 'right', 'body'],
          ForOfStatement: ['left', 'right', 'body'],
          FunctionDeclaration: ['id', 'params', 'body'],
          FunctionExpression: ['id', 'params', 'body'],
          GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
          Identifier: [],
          IfStatement: ['test', 'consequent', 'alternate'],
          ImportExpression: ['source'],
          ImportDeclaration: ['specifiers', 'source'],
          ImportDefaultSpecifier: ['local'],
          ImportNamespaceSpecifier: ['local'],
          ImportSpecifier: ['imported', 'local'],
          Literal: [],
          LabeledStatement: ['label', 'body'],
          LogicalExpression: ['left', 'right'],
          MemberExpression: ['object', 'property'],
          MetaProperty: ['meta', 'property'],
          MethodDefinition: ['key', 'value'],
          ModuleSpecifier: [],
          NewExpression: ['callee', 'arguments'],
          ObjectExpression: ['properties'],
          ObjectPattern: ['properties'],
          Program: ['body'],
          Property: ['key', 'value'],
          RestElement: [ 'argument' ],
          ReturnStatement: ['argument'],
          SequenceExpression: ['expressions'],
          SpreadElement: ['argument'],
          Super: [],
          SwitchStatement: ['discriminant', 'cases'],
          SwitchCase: ['test', 'consequent'],
          TaggedTemplateExpression: ['tag', 'quasi'],
          TemplateElement: [],
          TemplateLiteral: ['quasis', 'expressions'],
          ThisExpression: [],
          ThrowStatement: ['argument'],
          TryStatement: ['block', 'handler', 'finalizer'],
          UnaryExpression: ['argument'],
          UpdateExpression: ['argument'],
          VariableDeclaration: ['declarations'],
          VariableDeclarator: ['id', 'init'],
          WhileStatement: ['test', 'body'],
          WithStatement: ['object', 'body'],
          YieldExpression: ['argument']
      };

      // unique id
      BREAK = {};
      SKIP = {};
      REMOVE = {};

      VisitorOption = {
          Break: BREAK,
          Skip: SKIP,
          Remove: REMOVE
      };

      function Reference(parent, key) {
          this.parent = parent;
          this.key = key;
      }

      Reference.prototype.replace = function replace(node) {
          this.parent[this.key] = node;
      };

      Reference.prototype.remove = function remove() {
          if (Array.isArray(this.parent)) {
              this.parent.splice(this.key, 1);
              return true;
          } else {
              this.replace(null);
              return false;
          }
      };

      function Element(node, path, wrap, ref) {
          this.node = node;
          this.path = path;
          this.wrap = wrap;
          this.ref = ref;
      }

      function Controller() { }

      // API:
      // return property path array from root to current node
      Controller.prototype.path = function path() {
          var i, iz, j, jz, result, element;

          function addToPath(result, path) {
              if (Array.isArray(path)) {
                  for (j = 0, jz = path.length; j < jz; ++j) {
                      result.push(path[j]);
                  }
              } else {
                  result.push(path);
              }
          }

          // root node
          if (!this.__current.path) {
              return null;
          }

          // first node is sentinel, second node is root element
          result = [];
          for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
              element = this.__leavelist[i];
              addToPath(result, element.path);
          }
          addToPath(result, this.__current.path);
          return result;
      };

      // API:
      // return type of current node
      Controller.prototype.type = function () {
          var node = this.current();
          return node.type || this.__current.wrap;
      };

      // API:
      // return array of parent elements
      Controller.prototype.parents = function parents() {
          var i, iz, result;

          // first node is sentinel
          result = [];
          for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
              result.push(this.__leavelist[i].node);
          }

          return result;
      };

      // API:
      // return current node
      Controller.prototype.current = function current() {
          return this.__current.node;
      };

      Controller.prototype.__execute = function __execute(callback, element) {
          var previous, result;

          result = undefined;

          previous  = this.__current;
          this.__current = element;
          this.__state = null;
          if (callback) {
              result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
          }
          this.__current = previous;

          return result;
      };

      // API:
      // notify control skip / break
      Controller.prototype.notify = function notify(flag) {
          this.__state = flag;
      };

      // API:
      // skip child nodes of current node
      Controller.prototype.skip = function () {
          this.notify(SKIP);
      };

      // API:
      // break traversals
      Controller.prototype['break'] = function () {
          this.notify(BREAK);
      };

      // API:
      // remove node
      Controller.prototype.remove = function () {
          this.notify(REMOVE);
      };

      Controller.prototype.__initialize = function(root, visitor) {
          this.visitor = visitor;
          this.root = root;
          this.__worklist = [];
          this.__leavelist = [];
          this.__current = null;
          this.__state = null;
          this.__fallback = null;
          if (visitor.fallback === 'iteration') {
              this.__fallback = Object.keys;
          } else if (typeof visitor.fallback === 'function') {
              this.__fallback = visitor.fallback;
          }

          this.__keys = VisitorKeys;
          if (visitor.keys) {
              this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
          }
      };

      function isNode(node) {
          if (node == null) {
              return false;
          }
          return typeof node === 'object' && typeof node.type === 'string';
      }

      function isProperty(nodeType, key) {
          return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
      }

      Controller.prototype.traverse = function traverse(root, visitor) {
          var worklist,
              leavelist,
              element,
              node,
              nodeType,
              ret,
              key,
              current,
              current2,
              candidates,
              candidate,
              sentinel;

          this.__initialize(root, visitor);

          sentinel = {};

          // reference
          worklist = this.__worklist;
          leavelist = this.__leavelist;

          // initialize
          worklist.push(new Element(root, null, null, null));
          leavelist.push(new Element(null, null, null, null));

          while (worklist.length) {
              element = worklist.pop();

              if (element === sentinel) {
                  element = leavelist.pop();

                  ret = this.__execute(visitor.leave, element);

                  if (this.__state === BREAK || ret === BREAK) {
                      return;
                  }
                  continue;
              }

              if (element.node) {

                  ret = this.__execute(visitor.enter, element);

                  if (this.__state === BREAK || ret === BREAK) {
                      return;
                  }

                  worklist.push(sentinel);
                  leavelist.push(element);

                  if (this.__state === SKIP || ret === SKIP) {
                      continue;
                  }

                  node = element.node;
                  nodeType = node.type || element.wrap;
                  candidates = this.__keys[nodeType];
                  if (!candidates) {
                      if (this.__fallback) {
                          candidates = this.__fallback(node);
                      } else {
                          throw new Error('Unknown node type ' + nodeType + '.');
                      }
                  }

                  current = candidates.length;
                  while ((current -= 1) >= 0) {
                      key = candidates[current];
                      candidate = node[key];
                      if (!candidate) {
                          continue;
                      }

                      if (Array.isArray(candidate)) {
                          current2 = candidate.length;
                          while ((current2 -= 1) >= 0) {
                              if (!candidate[current2]) {
                                  continue;
                              }
                              if (isProperty(nodeType, candidates[current])) {
                                  element = new Element(candidate[current2], [key, current2], 'Property', null);
                              } else if (isNode(candidate[current2])) {
                                  element = new Element(candidate[current2], [key, current2], null, null);
                              } else {
                                  continue;
                              }
                              worklist.push(element);
                          }
                      } else if (isNode(candidate)) {
                          worklist.push(new Element(candidate, key, null, null));
                      }
                  }
              }
          }
      };

      Controller.prototype.replace = function replace(root, visitor) {
          var worklist,
              leavelist,
              node,
              nodeType,
              target,
              element,
              current,
              current2,
              candidates,
              candidate,
              sentinel,
              outer,
              key;

          function removeElem(element) {
              var i,
                  key,
                  nextElem,
                  parent;

              if (element.ref.remove()) {
                  // When the reference is an element of an array.
                  key = element.ref.key;
                  parent = element.ref.parent;

                  // If removed from array, then decrease following items' keys.
                  i = worklist.length;
                  while (i--) {
                      nextElem = worklist[i];
                      if (nextElem.ref && nextElem.ref.parent === parent) {
                          if  (nextElem.ref.key < key) {
                              break;
                          }
                          --nextElem.ref.key;
                      }
                  }
              }
          }

          this.__initialize(root, visitor);

          sentinel = {};

          // reference
          worklist = this.__worklist;
          leavelist = this.__leavelist;

          // initialize
          outer = {
              root: root
          };
          element = new Element(root, null, null, new Reference(outer, 'root'));
          worklist.push(element);
          leavelist.push(element);

          while (worklist.length) {
              element = worklist.pop();

              if (element === sentinel) {
                  element = leavelist.pop();

                  target = this.__execute(visitor.leave, element);

                  // node may be replaced with null,
                  // so distinguish between undefined and null in this place
                  if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                      // replace
                      element.ref.replace(target);
                  }

                  if (this.__state === REMOVE || target === REMOVE) {
                      removeElem(element);
                  }

                  if (this.__state === BREAK || target === BREAK) {
                      return outer.root;
                  }
                  continue;
              }

              target = this.__execute(visitor.enter, element);

              // node may be replaced with null,
              // so distinguish between undefined and null in this place
              if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                  // replace
                  element.ref.replace(target);
                  element.node = target;
              }

              if (this.__state === REMOVE || target === REMOVE) {
                  removeElem(element);
                  element.node = null;
              }

              if (this.__state === BREAK || target === BREAK) {
                  return outer.root;
              }

              // node may be null
              node = element.node;
              if (!node) {
                  continue;
              }

              worklist.push(sentinel);
              leavelist.push(element);

              if (this.__state === SKIP || target === SKIP) {
                  continue;
              }

              nodeType = node.type || element.wrap;
              candidates = this.__keys[nodeType];
              if (!candidates) {
                  if (this.__fallback) {
                      candidates = this.__fallback(node);
                  } else {
                      throw new Error('Unknown node type ' + nodeType + '.');
                  }
              }

              current = candidates.length;
              while ((current -= 1) >= 0) {
                  key = candidates[current];
                  candidate = node[key];
                  if (!candidate) {
                      continue;
                  }

                  if (Array.isArray(candidate)) {
                      current2 = candidate.length;
                      while ((current2 -= 1) >= 0) {
                          if (!candidate[current2]) {
                              continue;
                          }
                          if (isProperty(nodeType, candidates[current])) {
                              element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                          } else if (isNode(candidate[current2])) {
                              element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                          } else {
                              continue;
                          }
                          worklist.push(element);
                      }
                  } else if (isNode(candidate)) {
                      worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                  }
              }
          }

          return outer.root;
      };

      function traverse(root, visitor) {
          var controller = new Controller();
          return controller.traverse(root, visitor);
      }

      function replace(root, visitor) {
          var controller = new Controller();
          return controller.replace(root, visitor);
      }

      function extendCommentRange(comment, tokens) {
          var target;

          target = upperBound(tokens, function search(token) {
              return token.range[0] > comment.range[0];
          });

          comment.extendedRange = [comment.range[0], comment.range[1]];

          if (target !== tokens.length) {
              comment.extendedRange[1] = tokens[target].range[0];
          }

          target -= 1;
          if (target >= 0) {
              comment.extendedRange[0] = tokens[target].range[1];
          }

          return comment;
      }

      function attachComments(tree, providedComments, tokens) {
          // At first, we should calculate extended comment ranges.
          var comments = [], comment, len, i, cursor;

          if (!tree.range) {
              throw new Error('attachComments needs range information');
          }

          // tokens array is empty, we attach comments to tree as 'leadingComments'
          if (!tokens.length) {
              if (providedComments.length) {
                  for (i = 0, len = providedComments.length; i < len; i += 1) {
                      comment = deepCopy(providedComments[i]);
                      comment.extendedRange = [0, tree.range[0]];
                      comments.push(comment);
                  }
                  tree.leadingComments = comments;
              }
              return tree;
          }

          for (i = 0, len = providedComments.length; i < len; i += 1) {
              comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
          }

          // This is based on John Freeman's implementation.
          cursor = 0;
          traverse(tree, {
              enter: function (node) {
                  var comment;

                  while (cursor < comments.length) {
                      comment = comments[cursor];
                      if (comment.extendedRange[1] > node.range[0]) {
                          break;
                      }

                      if (comment.extendedRange[1] === node.range[0]) {
                          if (!node.leadingComments) {
                              node.leadingComments = [];
                          }
                          node.leadingComments.push(comment);
                          comments.splice(cursor, 1);
                      } else {
                          cursor += 1;
                      }
                  }

                  // already out of owned node
                  if (cursor === comments.length) {
                      return VisitorOption.Break;
                  }

                  if (comments[cursor].extendedRange[0] > node.range[1]) {
                      return VisitorOption.Skip;
                  }
              }
          });

          cursor = 0;
          traverse(tree, {
              leave: function (node) {
                  var comment;

                  while (cursor < comments.length) {
                      comment = comments[cursor];
                      if (node.range[1] < comment.extendedRange[0]) {
                          break;
                      }

                      if (node.range[1] === comment.extendedRange[0]) {
                          if (!node.trailingComments) {
                              node.trailingComments = [];
                          }
                          node.trailingComments.push(comment);
                          comments.splice(cursor, 1);
                      } else {
                          cursor += 1;
                      }
                  }

                  // already out of owned node
                  if (cursor === comments.length) {
                      return VisitorOption.Break;
                  }

                  if (comments[cursor].extendedRange[0] > node.range[1]) {
                      return VisitorOption.Skip;
                  }
              }
          });

          return tree;
      }

      exports.version = require$$0.version;
      exports.Syntax = Syntax;
      exports.traverse = traverse;
      exports.replace = replace;
      exports.attachComments = attachComments;
      exports.VisitorKeys = VisitorKeys;
      exports.VisitorOption = VisitorOption;
      exports.Controller = Controller;
      exports.cloneEnvironment = function () { return clone({}); };

      return exports;
  }(exports));
  /* vim: set sw=4 ts=4 et tw=80 : */
  });

  /*
    Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  var ast = createCommonjsModule(function (module) {
  (function () {
      'use strict';

      function isExpression(node) {
          if (node == null) { return false; }
          switch (node.type) {
              case 'ArrayExpression':
              case 'AssignmentExpression':
              case 'BinaryExpression':
              case 'CallExpression':
              case 'ConditionalExpression':
              case 'FunctionExpression':
              case 'Identifier':
              case 'Literal':
              case 'LogicalExpression':
              case 'MemberExpression':
              case 'NewExpression':
              case 'ObjectExpression':
              case 'SequenceExpression':
              case 'ThisExpression':
              case 'UnaryExpression':
              case 'UpdateExpression':
                  return true;
          }
          return false;
      }

      function isIterationStatement(node) {
          if (node == null) { return false; }
          switch (node.type) {
              case 'DoWhileStatement':
              case 'ForInStatement':
              case 'ForStatement':
              case 'WhileStatement':
                  return true;
          }
          return false;
      }

      function isStatement(node) {
          if (node == null) { return false; }
          switch (node.type) {
              case 'BlockStatement':
              case 'BreakStatement':
              case 'ContinueStatement':
              case 'DebuggerStatement':
              case 'DoWhileStatement':
              case 'EmptyStatement':
              case 'ExpressionStatement':
              case 'ForInStatement':
              case 'ForStatement':
              case 'IfStatement':
              case 'LabeledStatement':
              case 'ReturnStatement':
              case 'SwitchStatement':
              case 'ThrowStatement':
              case 'TryStatement':
              case 'VariableDeclaration':
              case 'WhileStatement':
              case 'WithStatement':
                  return true;
          }
          return false;
      }

      function isSourceElement(node) {
        return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
      }

      function trailingStatement(node) {
          switch (node.type) {
          case 'IfStatement':
              if (node.alternate != null) {
                  return node.alternate;
              }
              return node.consequent;

          case 'LabeledStatement':
          case 'ForStatement':
          case 'ForInStatement':
          case 'WhileStatement':
          case 'WithStatement':
              return node.body;
          }
          return null;
      }

      function isProblematicIfStatement(node) {
          var current;

          if (node.type !== 'IfStatement') {
              return false;
          }
          if (node.alternate == null) {
              return false;
          }
          current = node.consequent;
          do {
              if (current.type === 'IfStatement') {
                  if (current.alternate == null)  {
                      return true;
                  }
              }
              current = trailingStatement(current);
          } while (current);

          return false;
      }

      module.exports = {
          isExpression: isExpression,
          isStatement: isStatement,
          isIterationStatement: isIterationStatement,
          isSourceElement: isSourceElement,
          isProblematicIfStatement: isProblematicIfStatement,

          trailingStatement: trailingStatement
      };
  }());
  /* vim: set sw=4 ts=4 et tw=80 : */
  });

  /*
    Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
    Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  var code = createCommonjsModule(function (module) {
  (function () {
      'use strict';

      var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

      // See `tools/generate-identifier-regex.js`.
      ES5Regex = {
          // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
          NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
          // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
          NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
      };

      ES6Regex = {
          // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
          NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
          // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
          NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
      };

      function isDecimalDigit(ch) {
          return 0x30 <= ch && ch <= 0x39;  // 0..9
      }

      function isHexDigit(ch) {
          return 0x30 <= ch && ch <= 0x39 ||  // 0..9
              0x61 <= ch && ch <= 0x66 ||     // a..f
              0x41 <= ch && ch <= 0x46;       // A..F
      }

      function isOctalDigit(ch) {
          return ch >= 0x30 && ch <= 0x37;  // 0..7
      }

      // 7.2 White Space

      NON_ASCII_WHITESPACES = [
          0x1680,
          0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
          0x202F, 0x205F,
          0x3000,
          0xFEFF
      ];

      function isWhiteSpace(ch) {
          return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
              ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
      }

      // 7.3 Line Terminators

      function isLineTerminator(ch) {
          return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
      }

      // 7.6 Identifier Names and Identifiers

      function fromCodePoint(cp) {
          if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
          var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
          var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
          return cu1 + cu2;
      }

      IDENTIFIER_START = new Array(0x80);
      for(ch = 0; ch < 0x80; ++ch) {
          IDENTIFIER_START[ch] =
              ch >= 0x61 && ch <= 0x7A ||  // a..z
              ch >= 0x41 && ch <= 0x5A ||  // A..Z
              ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
      }

      IDENTIFIER_PART = new Array(0x80);
      for(ch = 0; ch < 0x80; ++ch) {
          IDENTIFIER_PART[ch] =
              ch >= 0x61 && ch <= 0x7A ||  // a..z
              ch >= 0x41 && ch <= 0x5A ||  // A..Z
              ch >= 0x30 && ch <= 0x39 ||  // 0..9
              ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
      }

      function isIdentifierStartES5(ch) {
          return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
      }

      function isIdentifierPartES5(ch) {
          return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
      }

      function isIdentifierStartES6(ch) {
          return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
      }

      function isIdentifierPartES6(ch) {
          return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
      }

      module.exports = {
          isDecimalDigit: isDecimalDigit,
          isHexDigit: isHexDigit,
          isOctalDigit: isOctalDigit,
          isWhiteSpace: isWhiteSpace,
          isLineTerminator: isLineTerminator,
          isIdentifierStartES5: isIdentifierStartES5,
          isIdentifierPartES5: isIdentifierPartES5,
          isIdentifierStartES6: isIdentifierStartES6,
          isIdentifierPartES6: isIdentifierPartES6
      };
  }());
  /* vim: set sw=4 ts=4 et tw=80 : */
  });

  /*
    Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  var keyword = createCommonjsModule(function (module) {
  (function () {
      'use strict';

      var code$1 = code;

      function isStrictModeReservedWordES6(id) {
          switch (id) {
          case 'implements':
          case 'interface':
          case 'package':
          case 'private':
          case 'protected':
          case 'public':
          case 'static':
          case 'let':
              return true;
          default:
              return false;
          }
      }

      function isKeywordES5(id, strict) {
          // yield should not be treated as keyword under non-strict mode.
          if (!strict && id === 'yield') {
              return false;
          }
          return isKeywordES6(id, strict);
      }

      function isKeywordES6(id, strict) {
          if (strict && isStrictModeReservedWordES6(id)) {
              return true;
          }

          switch (id.length) {
          case 2:
              return (id === 'if') || (id === 'in') || (id === 'do');
          case 3:
              return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
          case 4:
              return (id === 'this') || (id === 'else') || (id === 'case') ||
                  (id === 'void') || (id === 'with') || (id === 'enum');
          case 5:
              return (id === 'while') || (id === 'break') || (id === 'catch') ||
                  (id === 'throw') || (id === 'const') || (id === 'yield') ||
                  (id === 'class') || (id === 'super');
          case 6:
              return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                  (id === 'switch') || (id === 'export') || (id === 'import');
          case 7:
              return (id === 'default') || (id === 'finally') || (id === 'extends');
          case 8:
              return (id === 'function') || (id === 'continue') || (id === 'debugger');
          case 10:
              return (id === 'instanceof');
          default:
              return false;
          }
      }

      function isReservedWordES5(id, strict) {
          return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
      }

      function isReservedWordES6(id, strict) {
          return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
      }

      function isRestrictedWord(id) {
          return id === 'eval' || id === 'arguments';
      }

      function isIdentifierNameES5(id) {
          var i, iz, ch;

          if (id.length === 0) { return false; }

          ch = id.charCodeAt(0);
          if (!code$1.isIdentifierStartES5(ch)) {
              return false;
          }

          for (i = 1, iz = id.length; i < iz; ++i) {
              ch = id.charCodeAt(i);
              if (!code$1.isIdentifierPartES5(ch)) {
                  return false;
              }
          }
          return true;
      }

      function decodeUtf16(lead, trail) {
          return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
      }

      function isIdentifierNameES6(id) {
          var i, iz, ch, lowCh, check;

          if (id.length === 0) { return false; }

          check = code$1.isIdentifierStartES6;
          for (i = 0, iz = id.length; i < iz; ++i) {
              ch = id.charCodeAt(i);
              if (0xD800 <= ch && ch <= 0xDBFF) {
                  ++i;
                  if (i >= iz) { return false; }
                  lowCh = id.charCodeAt(i);
                  if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                      return false;
                  }
                  ch = decodeUtf16(ch, lowCh);
              }
              if (!check(ch)) {
                  return false;
              }
              check = code$1.isIdentifierPartES6;
          }
          return true;
      }

      function isIdentifierES5(id, strict) {
          return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
      }

      function isIdentifierES6(id, strict) {
          return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
      }

      module.exports = {
          isKeywordES5: isKeywordES5,
          isKeywordES6: isKeywordES6,
          isReservedWordES5: isReservedWordES5,
          isReservedWordES6: isReservedWordES6,
          isRestrictedWord: isRestrictedWord,
          isIdentifierNameES5: isIdentifierNameES5,
          isIdentifierNameES6: isIdentifierNameES6,
          isIdentifierES5: isIdentifierES5,
          isIdentifierES6: isIdentifierES6
      };
  }());
  /* vim: set sw=4 ts=4 et tw=80 : */
  });

  /*
    Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  var utils = createCommonjsModule(function (module, exports) {
  (function () {
      'use strict';

      exports.ast = ast;
      exports.code = code;
      exports.keyword = keyword;
  }());
  /* vim: set sw=4 ts=4 et tw=80 : */
  });

  /* -*- Mode: js; js-indent-level: 2; -*- */
  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  var encode$1 = function (number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };

  /**
   * Decode a single base 64 character code digit to an integer. Returns -1 on
   * failure.
   */
  var decode$1 = function (charCode) {
    var bigA = 65;     // 'A'
    var bigZ = 90;     // 'Z'

    var littleA = 97;  // 'a'
    var littleZ = 122; // 'z'

    var zero = 48;     // '0'
    var nine = 57;     // '9'

    var plus = 43;     // '+'
    var slash = 47;    // '/'

    var littleOffset = 26;
    var numberOffset = 52;

    // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
    if (bigA <= charCode && charCode <= bigZ) {
      return (charCode - bigA);
    }

    // 26 - 51: abcdefghijklmnopqrstuvwxyz
    if (littleA <= charCode && charCode <= littleZ) {
      return (charCode - littleA + littleOffset);
    }

    // 52 - 61: 0123456789
    if (zero <= charCode && charCode <= nine) {
      return (charCode - zero + numberOffset);
    }

    // 62: +
    if (charCode == plus) {
      return 62;
    }

    // 63: /
    if (charCode == slash) {
      return 63;
    }

    // Invalid base64 digit.
    return -1;
  };

  var base64 = {
  	encode: encode$1,
  	decode: decode$1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   *
   * Based on the Base 64 VLQ implementation in Closure Compiler:
   * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
   *
   * Copyright 2011 The Closure Compiler Authors. All rights reserved.
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are
   * met:
   *
   *  * Redistributions of source code must retain the above copyright
   *    notice, this list of conditions and the following disclaimer.
   *  * Redistributions in binary form must reproduce the above
   *    copyright notice, this list of conditions and the following
   *    disclaimer in the documentation and/or other materials provided
   *    with the distribution.
   *  * Neither the name of Google Inc. nor the names of its
   *    contributors may be used to endorse or promote products derived
   *    from this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
   * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
   * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
   * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */



  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  var encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string via the out parameter.
   */
  var decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }

      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }

      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };

  var base64Vlq = {
  	encode: encode,
  	decode: decode
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  var util = createCommonjsModule(function (module, exports) {
  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = '';
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':';
    }
    url += '//';
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@';
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port;
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consecutive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = exports.isAbsolute(path);

    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === '.') {
        parts.splice(i, 1);
      } else if (part === '..') {
        up++;
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join('/');

    if (path === '') {
      path = isAbsolute ? '/' : '.';
    }

    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/';
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }

    var joined = aPath.charAt(0) === '/'
      ? aPath
      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;

  exports.isAbsolute = function (aPath) {
    return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
  };

  /**
   * Make a path relative to a URL or another path.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be made relative to aRoot.
   */
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }

    aRoot = aRoot.replace(/\/$/, '');

    // It is possible for the path to be above the root. In this case, simply
    // checking whether the root is a prefix of the path won't work. Instead, we
    // need to remove components from the root one by one, until either we find
    // a prefix that fits, or we run out of components to remove.
    var level = 0;
    while (aPath.indexOf(aRoot + '/') !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }

      // If the only part of the root that is left is the scheme (i.e. http://,
      // file:///, etc.), one or more slashes (/), or simply nothing at all, we
      // have exhausted all components, so the path is not relative to the root.
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }

      ++level;
    }

    // Make sure we add a "../" for each component we removed from the root.
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports.relative = relative;

  var supportsNullProto = (function () {
    var obj = Object.create(null);
    return !('__proto__' in obj);
  }());

  function identity (s) {
    return s;
  }

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return '$' + aStr;
    }

    return aStr;
  }
  exports.toSetString = supportsNullProto ? identity : toSetString;

  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1);
    }

    return aStr;
  }
  exports.fromSetString = supportsNullProto ? identity : fromSetString;

  function isProtoString(s) {
    if (!s) {
      return false;
    }

    var length = s.length;

    if (length < 9 /* "__proto__".length */) {
      return false;
    }

    if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
        s.charCodeAt(length - 2) !== 95  /* '_' */ ||
        s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
        s.charCodeAt(length - 4) !== 116 /* 't' */ ||
        s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
        s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
        s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
        s.charCodeAt(length - 8) !== 95  /* '_' */ ||
        s.charCodeAt(length - 9) !== 95  /* '_' */) {
      return false;
    }

    for (var i = length - 10; i >= 0; i--) {
      if (s.charCodeAt(i) !== 36 /* '$' */) {
        return false;
      }
    }

    return true;
  }

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings with deflated source and name indices where
   * the generated positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }

    if (aStr1 === null) {
      return 1; // aStr2 !== null
    }

    if (aStr2 === null) {
      return -1; // aStr1 !== null
    }

    if (aStr1 > aStr2) {
      return 1;
    }

    return -1;
  }

  /**
   * Comparator between two mappings with inflated source and name strings where
   * the generated positions are compared.
   */
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

  /**
   * Strip any JSON XSSI avoidance prefix from the string (as documented
   * in the source maps specification), and then parse the string as
   * JSON.
   */
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
  }
  exports.parseSourceMapInput = parseSourceMapInput;

  /**
   * Compute the URL of a source given the the source root, the source's
   * URL, and the source map's URL.
   */
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || '';

    if (sourceRoot) {
      // This follows what Chrome does.
      if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
        sourceRoot += '/';
      }
      // The spec says:
      //   Line 4: An optional source root, useful for relocating source
      //   files on a server or removing repeated values in the
      //   “sources” entry.  This value is prepended to the individual
      //   entries in the “source” field.
      sourceURL = sourceRoot + sourceURL;
    }

    // Historically, SourceMapConsumer did not take the sourceMapURL as
    // a parameter.  This mode is still somewhat supported, which is why
    // this code block is conditional.  However, it's preferable to pass
    // the source map URL to SourceMapConsumer, so that this function
    // can implement the source URL resolution algorithm as outlined in
    // the spec.  This block is basically the equivalent of:
    //    new URL(sourceURL, sourceMapURL).toString()
    // ... except it avoids using URL, which wasn't available in the
    // older releases of node still supported by this library.
    //
    // The spec says:
    //   If the sources are not absolute URLs after prepending of the
    //   “sourceRoot”, the sources are resolved relative to the
    //   SourceMap (like resolving script src in a html document).
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL);
      if (!parsed) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (parsed.path) {
        // Strip the last path component, but keep the "/".
        var index = parsed.path.lastIndexOf('/');
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1);
        }
      }
      sourceURL = join(urlGenerate(parsed), sourceURL);
    }

    return normalize(sourceURL);
  }
  exports.computeSourceURL = computeSourceURL;
  });

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */


  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet$2() {
    this._array = [];
    this._set = hasNativeMap ? new Map() : Object.create(null);
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet$2.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet$2();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Return how many unique items are in this ArraySet. If duplicates have been
   * added, than those do not count towards the size.
   *
   * @returns Number
   */
  ArraySet$2.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet$2.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet$2.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet$2.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
          return idx;
      }
    } else {
      var sStr = util.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }

    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet$2.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet$2.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  var ArraySet_1 = ArraySet$2;

  var arraySet = {
  	ArraySet: ArraySet_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2014 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */



  /**
   * Determine whether mappingB is after mappingA with respect to generated
   * position.
   */
  function generatedPositionAfter(mappingA, mappingB) {
    // Optimized for most common case
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA ||
           util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }

  /**
   * A data structure to provide a sorted view of accumulated mappings in a
   * performance conscious manner. It trades a neglibable overhead in general
   * case for a large speedup in case of mappings being added in order.
   */
  function MappingList$1() {
    this._array = [];
    this._sorted = true;
    // Serves as infimum
    this._last = {generatedLine: -1, generatedColumn: 0};
  }

  /**
   * Iterate through internal items. This method takes the same arguments that
   * `Array.prototype.forEach` takes.
   *
   * NOTE: The order of the mappings is NOT guaranteed.
   */
  MappingList$1.prototype.unsortedForEach =
    function MappingList_forEach(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };

  /**
   * Add the given source mapping.
   *
   * @param Object aMapping
   */
  MappingList$1.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };

  /**
   * Returns the flat, sorted array of mappings. The mappings are sorted by
   * generated position.
   *
   * WARNING: This method returns internal data without copying, for
   * performance. The return value must NOT be mutated, and should be treated as
   * an immutable borrow. If you want to take ownership, you must make your own
   * copy.
   */
  MappingList$1.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };

  var MappingList_1 = MappingList$1;

  var mappingList = {
  	MappingList: MappingList_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */



  var ArraySet$1 = arraySet.ArraySet;
  var MappingList = mappingList.MappingList;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */
  function SourceMapGenerator$2(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
    this._sources = new ArraySet$1();
    this._names = new ArraySet$1();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }

  SourceMapGenerator$2.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator$2.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator$2({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var sourceRelative = sourceFile;
        if (sourceRoot !== null) {
          sourceRelative = util.relative(sourceRoot, sourceFile);
        }

        if (!generator._sources.has(sourceRelative)) {
          generator._sources.add(sourceRelative);
        }

        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator$2.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      if (!this._skipValidation) {
        this._validateMapping(generated, original, source, name);
      }

      if (source != null) {
        source = String(source);
        if (!this._sources.has(source)) {
          this._sources.add(source);
        }
      }

      if (name != null) {
        name = String(name);
        if (!this._names.has(name)) {
          this._names.add(name);
        }
      }

      this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator$2.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent != null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = Object.create(null);
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  SourceMapGenerator$2.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(
            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
          );
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "sourceFile" relative if an absolute Url is passed.
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet$1();
      var newNames = new ArraySet$1();

      // Find mappings for the "sourceFile"
      this._mappings.unsortedForEach(function (mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            // Copy mapping
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util.join(aSourceMapPath, mapping.source);
            }
            if (sourceRoot != null) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile = util.join(aSourceMapPath, sourceFile);
          }
          if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator$2.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      // When aOriginal is truthy but has empty values for .line and .column,
      // it is most likely a programmer error. In this case we throw a very
      // specific error message to try to guide them the right way.
      // For example: https://github.com/Polymer/polymer-bundler/pull/519
      if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
          throw new Error(
              'original.line and original.column are not numbers -- you probably meant to omit ' +
              'the original mapping entirely and only map the generated position. If so, pass ' +
              'null for the original mapping instead of an object with empty or null values.'
          );
      }

      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator$2.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var next;
      var mapping;
      var nameIdx;
      var sourceIdx;

      var mappings = this._mappings.toArray();
      for (var i = 0, len = mappings.length; i < len; i++) {
        mapping = mappings[i];
        next = '';

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            next += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            next += ',';
          }
        }

        next += base64Vlq.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source != null) {
          sourceIdx = this._sources.indexOf(mapping.source);
          next += base64Vlq.encode(sourceIdx - previousSource);
          previousSource = sourceIdx;

          // lines are stored 0-based in SourceMap spec version 3
          next += base64Vlq.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          next += base64Vlq.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name != null) {
            nameIdx = this._names.indexOf(mapping.name);
            next += base64Vlq.encode(nameIdx - previousName);
            previousName = nameIdx;
          }
        }

        result += next;
      }

      return result;
    };

  SourceMapGenerator$2.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator$2.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator$2.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this.toJSON());
    };

  var SourceMapGenerator_1 = SourceMapGenerator$2;

  var sourceMapGenerator = {
  	SourceMapGenerator: SourceMapGenerator_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  var binarySearch = createCommonjsModule(function (module, exports) {
  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  exports.GREATEST_LOWER_BOUND = 1;
  exports.LEAST_UPPER_BOUND = 2;

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the index of
    //      the next-closest element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element than the one we are searching for, so we return -1.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return mid;
    }
    else if (cmp > 0) {
      // Our needle is greater than aHaystack[mid].
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }

      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    }
    else {
      // Our needle is less than aHaystack[mid].
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }

      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the index of the closest element if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }

    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                                aCompare, aBias || exports.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }

    // We have found either the exact element, or the next-closest element than
    // the one we are searching for. However, there may be more than one such
    // element. Make sure we always return the smallest of these.
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }

    return index;
  };
  });

  /* -*- Mode: js; js-indent-level: 2; -*- */
  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  // It turns out that some (most?) JavaScript engines don't self-host
  // `Array.prototype.sort`. This makes sense because C++ will likely remain
  // faster than JS when doing raw CPU-intensive sorting. However, when using a
  // custom comparator function, calling back and forth between the VM's C++ and
  // JIT'd JS is rather slow *and* loses JIT type information, resulting in
  // worse generated code for the comparator function than would be optimal. In
  // fact, when sorting with a comparator, these costs outweigh the benefits of
  // sorting in C++. By using our own JS-implemented Quick Sort (below), we get
  // a ~3500ms mean speed-up in `bench/bench.html`.

  /**
   * Swap the elements indexed by `x` and `y` in the array `ary`.
   *
   * @param {Array} ary
   *        The array.
   * @param {Number} x
   *        The index of the first item.
   * @param {Number} y
   *        The index of the second item.
   */
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }

  /**
   * Returns a random integer within the range `low .. high` inclusive.
   *
   * @param {Number} low
   *        The lower bound on the range.
   * @param {Number} high
   *        The upper bound on the range.
   */
  function randomIntInRange(low, high) {
    return Math.round(low + (Math.random() * (high - low)));
  }

  /**
   * The Quick Sort algorithm.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   * @param {Number} p
   *        Start index of the array
   * @param {Number} r
   *        End index of the array
   */
  function doQuickSort(ary, comparator, p, r) {
    // If our lower bound is less than our upper bound, we (1) partition the
    // array into two pieces and (2) recurse on each half. If it is not, this is
    // the empty array and our base case.

    if (p < r) {
      // (1) Partitioning.
      //
      // The partitioning chooses a pivot between `p` and `r` and moves all
      // elements that are less than or equal to the pivot to the before it, and
      // all the elements that are greater than it after it. The effect is that
      // once partition is done, the pivot is in the exact place it will be when
      // the array is put in sorted order, and it will not need to be moved
      // again. This runs in O(n) time.

      // Always choose a random pivot so that an input array which is reverse
      // sorted does not cause O(n^2) running time.
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;

      swap(ary, pivotIndex, r);
      var pivot = ary[r];

      // Immediately after `j` is incremented in this loop, the following hold
      // true:
      //
      //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
      //
      //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }

      swap(ary, i + 1, j);
      var q = i + 1;

      // (2) Recurse on each half.

      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }

  /**
   * Sort the given array in-place with the given comparator function.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   */
  var quickSort_1 = function (ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };

  var quickSort$1 = {
  	quickSort: quickSort_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */



  var ArraySet = arraySet.ArraySet;

  var quickSort = quickSort$1.quickSort;

  function SourceMapConsumer$1(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }

    return sourceMap.sections != null
      ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
      : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
  }

  SourceMapConsumer$1.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer$1.prototype._version = 3;

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer$1.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer$1.prototype, '_generatedMappings', {
    configurable: true,
    enumerable: true,
    get: function () {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer$1.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer$1.prototype, '_originalMappings', {
    configurable: true,
    enumerable: true,
    get: function () {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  SourceMapConsumer$1.prototype._charIsMappingSeparator =
    function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
      var c = aStr.charAt(index);
      return c === ";" || c === ",";
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer$1.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      throw new Error("Subclasses must implement _parseMappings");
    };

  SourceMapConsumer$1.GENERATED_ORDER = 1;
  SourceMapConsumer$1.ORIGINAL_ORDER = 2;

  SourceMapConsumer$1.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer$1.LEAST_UPPER_BOUND = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer$1.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer$1.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer$1.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer$1.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source === null ? null : this._sources.at(mapping.source);
        source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : this._names.at(mapping.name)
        };
      }, this).forEach(aCallback, context);
    };

  /**
   * Returns all generated line and column information for the original source,
   * line, and column provided. If no column is provided, returns all mappings
   * corresponding to a either the line we are searching for or the next
   * closest line that has any mappings. Otherwise, returns all mappings
   * corresponding to the given line and either the column we are searching for
   * or the next closest column that has any offsets.
   *
   * The only argument is an object with the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.  The line number is 1-based.
   *   - column: Optional. the column number in the original source.
   *    The column number is 0-based.
   *
   * and an array of objects is returned, each with the following properties:
   *
   *   - line: The line number in the generated source, or null.  The
   *    line number is 1-based.
   *   - column: The column number in the generated source, or null.
   *    The column number is 0-based.
   */
  SourceMapConsumer$1.prototype.allGeneratedPositionsFor =
    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
      var line = util.getArg(aArgs, 'line');

      // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
      // returns the index of the closest mapping less than the needle. By
      // setting needle.originalColumn to 0, we thus find the last mapping for
      // the given line, provided such a mapping exists.
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: line,
        originalColumn: util.getArg(aArgs, 'column', 0)
      };

      needle.source = this._findSourceIndex(needle.source);
      if (needle.source < 0) {
        return [];
      }

      var mappings = [];

      var index = this._findMapping(needle,
                                    this._originalMappings,
                                    "originalLine",
                                    "originalColumn",
                                    util.compareByOriginalPositions,
                                    binarySearch.LEAST_UPPER_BOUND);
      if (index >= 0) {
        var mapping = this._originalMappings[index];

        if (aArgs.column === undefined) {
          var originalLine = mapping.originalLine;

          // Iterate until either we run out of mappings, or we run into
          // a mapping for a different line than the one we found. Since
          // mappings are sorted, this is guaranteed to find all mappings for
          // the line we found.
          while (mapping && mapping.originalLine === originalLine) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });

            mapping = this._originalMappings[++index];
          }
        } else {
          var originalColumn = mapping.originalColumn;

          // Iterate until either we run out of mappings, or we run into
          // a mapping for a different line than the one we were searching for.
          // Since mappings are sorted, this is guaranteed to find all mappings for
          // the line we are searching for.
          while (mapping &&
                 mapping.originalLine === line &&
                 mapping.originalColumn == originalColumn) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });

            mapping = this._originalMappings[++index];
          }
        }
      }

      return mappings;
    };

  var SourceMapConsumer_1 = SourceMapConsumer$1;

  /**
   * A BasicSourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The first parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: Optional. The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * The second parameter, if given, is a string whose value is the URL
   * at which the source map was found.  This URL is used to compute the
   * sources array.
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    if (sourceRoot) {
      sourceRoot = util.normalize(sourceRoot);
    }

    sources = sources
      .map(String)
      // Some source maps produce relative source paths like "./foo.js" instead of
      // "foo.js".  Normalize these first so that future comparisons will succeed.
      // See bugzil.la/1090768.
      .map(util.normalize)
      // Always ensure that absolute sources are internally stored relative to
      // the source root, if the source root is absolute. Not doing this would
      // be particularly problematic when the source root is a prefix of the
      // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
      .map(function (source) {
        return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
          ? util.relative(sourceRoot, source)
          : source;
      });

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);

    this._absoluteSources = this._sources.toArray().map(function (s) {
      return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }

  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer$1.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer$1;

  /**
   * Utility function to find the index of a source.  Returns -1 if not
   * found.
   */
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }

    // Maybe aSource is an absolute URL as returned by |sources|.  In
    // this case we can't simply undo the transform.
    var i;
    for (i = 0; i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }

    return -1;
  };

  /**
   * Create a BasicSourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @param String aSourceMapURL
   *        The URL at which the source map can be found (optional)
   * @returns BasicSourceMapConsumer
   */
  BasicSourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
      var smc = Object.create(BasicSourceMapConsumer.prototype);

      var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;
      smc._sourceMapURL = aSourceMapURL;
      smc._absoluteSources = smc._sources.toArray().map(function (s) {
        return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
      });

      // Because we are modifying the entries (by converting string sources and
      // names to indices into the sources and names ArraySets), we have to make
      // a copy of the entry or else bad things happen. Shared mutable state
      // strikes again! See github issue #191.

      var generatedMappings = aSourceMap._mappings.toArray().slice();
      var destGeneratedMappings = smc.__generatedMappings = [];
      var destOriginalMappings = smc.__originalMappings = [];

      for (var i = 0, length = generatedMappings.length; i < length; i++) {
        var srcMapping = generatedMappings[i];
        var destMapping = new Mapping;
        destMapping.generatedLine = srcMapping.generatedLine;
        destMapping.generatedColumn = srcMapping.generatedColumn;

        if (srcMapping.source) {
          destMapping.source = sources.indexOf(srcMapping.source);
          destMapping.originalLine = srcMapping.originalLine;
          destMapping.originalColumn = srcMapping.originalColumn;

          if (srcMapping.name) {
            destMapping.name = names.indexOf(srcMapping.name);
          }

          destOriginalMappings.push(destMapping);
        }

        destGeneratedMappings.push(destMapping);
      }

      quickSort(smc.__originalMappings, util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  BasicSourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._absoluteSources.slice();
    }
  });

  /**
   * Provide the JIT with a nice shape / hidden class.
   */
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  BasicSourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var length = aStr.length;
      var index = 0;
      var cachedSegments = {};
      var temp = {};
      var originalMappings = [];
      var generatedMappings = [];
      var mapping, str, segment, end, value;

      while (index < length) {
        if (aStr.charAt(index) === ';') {
          generatedLine++;
          index++;
          previousGeneratedColumn = 0;
        }
        else if (aStr.charAt(index) === ',') {
          index++;
        }
        else {
          mapping = new Mapping();
          mapping.generatedLine = generatedLine;

          // Because each offset is encoded relative to the previous one,
          // many segments often have the same encoding. We can exploit this
          // fact by caching the parsed variable length fields of each segment,
          // allowing us to avoid a second parse if we encounter the same
          // segment again.
          for (end = index; end < length; end++) {
            if (this._charIsMappingSeparator(aStr, end)) {
              break;
            }
          }
          str = aStr.slice(index, end);

          segment = cachedSegments[str];
          if (segment) {
            index += str.length;
          } else {
            segment = [];
            while (index < end) {
              base64Vlq.decode(aStr, index, temp);
              value = temp.value;
              index = temp.rest;
              segment.push(value);
            }

            if (segment.length === 2) {
              throw new Error('Found a source, but no line and column');
            }

            if (segment.length === 3) {
              throw new Error('Found a source and line, but no column');
            }

            cachedSegments[str] = segment;
          }

          // Generated column.
          mapping.generatedColumn = previousGeneratedColumn + segment[0];
          previousGeneratedColumn = mapping.generatedColumn;

          if (segment.length > 1) {
            // Original source.
            mapping.source = previousSource + segment[1];
            previousSource += segment[1];

            // Original line.
            mapping.originalLine = previousOriginalLine + segment[2];
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;

            // Original column.
            mapping.originalColumn = previousOriginalColumn + segment[3];
            previousOriginalColumn = mapping.originalColumn;

            if (segment.length > 4) {
              // Original name.
              mapping.name = previousName + segment[4];
              previousName += segment[4];
            }
          }

          generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            originalMappings.push(mapping);
          }
        }
      }

      quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
      this.__generatedMappings = generatedMappings;

      quickSort(originalMappings, util.compareByOriginalPositions);
      this.__originalMappings = originalMappings;
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  BasicSourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator, aBias) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };

  /**
   * Compute the last column for each generated mapping. The last column is
   * inclusive.
   */
  BasicSourceMapConsumer.prototype.computeColumnSpans =
    function SourceMapConsumer_computeColumnSpans() {
      for (var index = 0; index < this._generatedMappings.length; ++index) {
        var mapping = this._generatedMappings[index];

        // Mappings do not contain a field for the last generated columnt. We
        // can come up with an optimistic estimate, however, by assuming that
        // mappings are contiguous (i.e. given two consecutive mappings, the
        // first mapping ends where the second one starts).
        if (index + 1 < this._generatedMappings.length) {
          var nextMapping = this._generatedMappings[index + 1];

          if (mapping.generatedLine === nextMapping.generatedLine) {
            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
            continue;
          }
        }

        // The last mapping for each line spans the entire line.
        mapping.lastGeneratedColumn = Infinity;
      }
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.  The line number
   *     is 1-based.
   *   - column: The column number in the generated source.  The column
   *     number is 0-based.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the original source, or null.  The
   *     column number is 0-based.
   *   - name: The original identifier, or null.
   */
  BasicSourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var index = this._findMapping(
        needle,
        this._generatedMappings,
        "generatedLine",
        "generatedColumn",
        util.compareByGeneratedPositionsDeflated,
        util.getArg(aArgs, 'bias', SourceMapConsumer$1.GREATEST_LOWER_BOUND)
      );

      if (index >= 0) {
        var mapping = this._generatedMappings[index];

        if (mapping.generatedLine === needle.generatedLine) {
          var source = util.getArg(mapping, 'source', null);
          if (source !== null) {
            source = this._sources.at(source);
            source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
          }
          var name = util.getArg(mapping, 'name', null);
          if (name !== null) {
            name = this._names.at(name);
          }
          return {
            source: source,
            line: util.getArg(mapping, 'originalLine', null),
            column: util.getArg(mapping, 'originalColumn', null),
            name: name
          };
        }
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
    function BasicSourceMapConsumer_hasContentsOfAllSources() {
      if (!this.sourcesContent) {
        return false;
      }
      return this.sourcesContent.length >= this._sources.size() &&
        !this.sourcesContent.some(function (sc) { return sc == null; });
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * available.
   */
  BasicSourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      if (!this.sourcesContent) {
        return null;
      }

      var index = this._findSourceIndex(aSource);
      if (index >= 0) {
        return this.sourcesContent[index];
      }

      var relativeSource = aSource;
      if (this.sourceRoot != null) {
        relativeSource = util.relative(this.sourceRoot, relativeSource);
      }

      var url;
      if (this.sourceRoot != null
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + relativeSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
        }
      }

      // This function is used recursively from
      // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
      // don't want to throw if we can't find the source - we just want to
      // return null, so we provide a flag to exit gracefully.
      if (nullOnMissing) {
        return null;
      }
      else {
        throw new Error('"' + relativeSource + '" is not in the SourceMap.');
      }
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.  The line number
   *     is 1-based.
   *   - column: The column number in the original source.  The column
   *     number is 0-based.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the generated source, or null.
   *     The column number is 0-based.
   */
  BasicSourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var source = util.getArg(aArgs, 'source');
      source = this._findSourceIndex(source);
      if (source < 0) {
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }

      var needle = {
        source: source,
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      var index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        util.getArg(aArgs, 'bias', SourceMapConsumer$1.GREATEST_LOWER_BOUND)
      );

      if (index >= 0) {
        var mapping = this._originalMappings[index];

        if (mapping.source === needle.source) {
          return {
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          };
        }
      }

      return {
        line: null,
        column: null,
        lastColumn: null
      };
    };

  var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

  /**
   * An IndexedSourceMapConsumer instance represents a parsed source map which
   * we can query for information. It differs from BasicSourceMapConsumer in
   * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
   * input.
   *
   * The first parameter is a raw source map (either as a JSON string, or already
   * parsed to an object). According to the spec for indexed source maps, they
   * have the following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - file: Optional. The generated file this source map is associated with.
   *   - sections: A list of section definitions.
   *
   * Each value under the "sections" field has two fields:
   *   - offset: The offset into the original specified at which this section
   *       begins to apply, defined as an object with a "line" and "column"
   *       field.
   *   - map: A source map definition. This source map could also be indexed,
   *       but doesn't have to be.
   *
   * Instead of the "map" field, it's also possible to have a "url" field
   * specifying a URL to retrieve a source map from, but that's currently
   * unsupported.
   *
   * Here's an example source map, taken from the source map spec[0], but
   * modified to omit a section which uses the "url" field.
   *
   *  {
   *    version : 3,
   *    file: "app.js",
   *    sections: [{
   *      offset: {line:100, column:10},
   *      map: {
   *        version : 3,
   *        file: "section.js",
   *        sources: ["foo.js", "bar.js"],
   *        names: ["src", "maps", "are", "fun"],
   *        mappings: "AAAA,E;;ABCDE;"
   *      }
   *    }],
   *  }
   *
   * The second parameter, if given, is a string whose value is the URL
   * at which the source map was found.  This URL is used to compute the
   * sources array.
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
   */
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }

    var version = util.getArg(sourceMap, 'version');
    var sections = util.getArg(sourceMap, 'sections');

    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    this._sources = new ArraySet();
    this._names = new ArraySet();

    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function (s) {
      if (s.url) {
        // The url field will require support for asynchronicity.
        // See https://github.com/mozilla/source-map/issues/16
        throw new Error('Support for url field in sections not implemented.');
      }
      var offset = util.getArg(s, 'offset');
      var offsetLine = util.getArg(offset, 'line');
      var offsetColumn = util.getArg(offset, 'column');

      if (offsetLine < lastOffset.line ||
          (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
        throw new Error('Section offsets must be ordered and non-overlapping.');
      }
      lastOffset = offset;

      return {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer$1(util.getArg(s, 'map'), aSourceMapURL)
      }
    });
  }

  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer$1.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer$1;

  /**
   * The version of the source mapping spec that we are consuming.
   */
  IndexedSourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
    get: function () {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.  The line number
   *     is 1-based.
   *   - column: The column number in the generated source.  The column
   *     number is 0-based.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the original source, or null.  The
   *     column number is 0-based.
   *   - name: The original identifier, or null.
   */
  IndexedSourceMapConsumer.prototype.originalPositionFor =
    function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      // Find the section containing the generated position we're trying to map
      // to an original position.
      var sectionIndex = binarySearch.search(needle, this._sections,
        function(needle, section) {
          var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }

          return (needle.generatedColumn -
                  section.generatedOffset.generatedColumn);
        });
      var section = this._sections[sectionIndex];

      if (!section) {
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }

      return section.consumer.originalPositionFor({
        line: needle.generatedLine -
          (section.generatedOffset.generatedLine - 1),
        column: needle.generatedColumn -
          (section.generatedOffset.generatedLine === needle.generatedLine
           ? section.generatedOffset.generatedColumn - 1
           : 0),
        bias: aArgs.bias
      });
    };

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
    function IndexedSourceMapConsumer_hasContentsOfAllSources() {
      return this._sections.every(function (s) {
        return s.consumer.hasContentsOfAllSources();
      });
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * available.
   */
  IndexedSourceMapConsumer.prototype.sourceContentFor =
    function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];

        var content = section.consumer.sourceContentFor(aSource, true);
        if (content) {
          return content;
        }
      }
      if (nullOnMissing) {
        return null;
      }
      else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.  The line number
   *     is 1-based.
   *   - column: The column number in the original source.  The column
   *     number is 0-based.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.  The
   *     line number is 1-based. 
   *   - column: The column number in the generated source, or null.
   *     The column number is 0-based.
   */
  IndexedSourceMapConsumer.prototype.generatedPositionFor =
    function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];

        // Only consider this section if the requested source is in the list of
        // sources of the consumer.
        if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
          continue;
        }
        var generatedPosition = section.consumer.generatedPositionFor(aArgs);
        if (generatedPosition) {
          var ret = {
            line: generatedPosition.line +
              (section.generatedOffset.generatedLine - 1),
            column: generatedPosition.column +
              (section.generatedOffset.generatedLine === generatedPosition.line
               ? section.generatedOffset.generatedColumn - 1
               : 0)
          };
          return ret;
        }
      }

      return {
        line: null,
        column: null
      };
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  IndexedSourceMapConsumer.prototype._parseMappings =
    function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      this.__generatedMappings = [];
      this.__originalMappings = [];
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var sectionMappings = section.consumer._generatedMappings;
        for (var j = 0; j < sectionMappings.length; j++) {
          var mapping = sectionMappings[j];

          var source = section.consumer._sources.at(mapping.source);
          source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
          this._sources.add(source);
          source = this._sources.indexOf(source);

          var name = null;
          if (mapping.name) {
            name = section.consumer._names.at(mapping.name);
            this._names.add(name);
            name = this._names.indexOf(name);
          }

          // The mappings coming from the consumer for the section have
          // generated positions relative to the start of the section, so we
          // need to offset them to be relative to the start of the concatenated
          // generated file.
          var adjustedMapping = {
            source: source,
            generatedLine: mapping.generatedLine +
              (section.generatedOffset.generatedLine - 1),
            generatedColumn: mapping.generatedColumn +
              (section.generatedOffset.generatedLine === mapping.generatedLine
              ? section.generatedOffset.generatedColumn - 1
              : 0),
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: name
          };

          this.__generatedMappings.push(adjustedMapping);
          if (typeof adjustedMapping.originalLine === 'number') {
            this.__originalMappings.push(adjustedMapping);
          }
        }
      }

      quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
      quickSort(this.__originalMappings, util.compareByOriginalPositions);
    };

  var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

  var sourceMapConsumer = {
  	SourceMapConsumer: SourceMapConsumer_1,
  	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
  	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  var SourceMapGenerator$1 = sourceMapGenerator.SourceMapGenerator;


  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
  // operating systems these days (capturing the result).
  var REGEX_NEWLINE = /(\r?\n)/;

  // Newline character code for charCodeAt() comparisons
  var NEWLINE_CODE = 10;

  // Private symbol for identifying `SourceNode`s when multiple versions of
  // the source-map library are loaded. This MUST NOT CHANGE across
  // versions!
  var isSourceNode = "$$$isSourceNode$$$";

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode$1(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  SourceNode$1.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode$1();

      // All even indices of this array are one line of the generated code,
      // while all odd indices are the newlines between two adjacent lines
      // (since `REGEX_NEWLINE` captures its match).
      // Processed fragments are accessed by calling `shiftNextLine`.
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var remainingLinesIndex = 0;
      var shiftNextLine = function() {
        var lineContents = getNextLine();
        // The last line of a file might not have a newline.
        var newLine = getNextLine() || "";
        return lineContents + newLine;

        function getNextLine() {
          return remainingLinesIndex < remainingLines.length ?
              remainingLines[remainingLinesIndex++] : undefined;
        }
      };

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping !== null) {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            // Associate first line with "lastMapping"
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
            // The remaining code is added without mapping
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[remainingLinesIndex] || '';
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            // No more remaining code, continue
            lastMapping = mapping;
            return;
          }
        }
        // We add the generated code until the first mapping
        // to the SourceNode without any mapping.
        // Each line is added as separate string.
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[remainingLinesIndex] || '';
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      if (remainingLinesIndex < remainingLines.length) {
        if (lastMapping) {
          // Associate the remaining code in the current line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        // and add the remaining lines without any mapping
        node.add(remainingLines.splice(remainingLinesIndex).join(""));
      }

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          var source = aRelativePath
            ? util.join(aRelativePath, mapping.source)
            : mapping.source;
          node.add(new SourceNode$1(mapping.originalLine,
                                  mapping.originalColumn,
                                  source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode$1.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode$1.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode$1.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode$1.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode$1.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode$1.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode$1.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i][isSourceNode]) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode$1.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode$1.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator$1(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  var SourceNode_1 = SourceNode$1;

  var sourceNode = {
  	SourceNode: SourceNode_1
  };

  /*
   * Copyright 2009-2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE.txt or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  var SourceMapGenerator = sourceMapGenerator.SourceMapGenerator;
  var SourceMapConsumer = sourceMapConsumer.SourceMapConsumer;
  var SourceNode = sourceNode.SourceNode;

  var sourceMap = {
  	SourceMapGenerator: SourceMapGenerator,
  	SourceMapConsumer: SourceMapConsumer,
  	SourceNode: SourceNode
  };

  const name="escodegen";const description="ECMAScript code generator";const homepage="http://github.com/estools/escodegen";const main="escodegen.js";const bin={esgenerate:"./bin/esgenerate.js",escodegen:"./bin/escodegen.js"};const files=["LICENSE.BSD","README.md","bin","escodegen.js","package.json"];const version="1.14.1";const engines={node:">=4.0"};const maintainers=[{name:"Yusuke Suzuki",email:"utatane.tea@gmail.com",web:"http://github.com/Constellation"}];const repository={type:"git",url:"http://github.com/estools/escodegen.git"};const dependencies={estraverse:"^4.2.0",esutils:"^2.0.2",esprima:"^4.0.1",optionator:"^0.8.1"};const optionalDependencies={"source-map":"~0.6.1"};const devDependencies={acorn:"^7.1.0",bluebird:"^3.4.7","bower-registry-client":"^1.0.0",chai:"^3.5.0","commonjs-everywhere":"^0.9.7",gulp:"^3.8.10","gulp-eslint":"^3.0.1","gulp-mocha":"^3.0.1",semver:"^5.1.0"};const license="BSD-2-Clause";const scripts={test:"gulp travis","unit-test":"gulp test",lint:"gulp lint",release:"node tools/release.js","build-min":"./node_modules/.bin/cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",build:"./node_modules/.bin/cjsify -a path: tools/entry-point.js > escodegen.browser.js"};var require$$3 = {name:name,description:description,homepage:homepage,main:main,bin:bin,files:files,version:version,engines:engines,maintainers:maintainers,repository:repository,dependencies:dependencies,optionalDependencies:optionalDependencies,devDependencies:devDependencies,license:license,scripts:scripts};

  /*
    Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
    Copyright (C) 2015 Ingvar Stepanyan <me@rreverser.com>
    Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
    Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
    Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
    Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
    Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
    Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
    Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
    Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
    Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
    Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  var escodegen = createCommonjsModule(function (module, exports) {
  /*global exports:true, require:true, global:true*/
  (function () {
      'use strict';

      var Syntax,
          Precedence,
          BinaryPrecedence,
          SourceNode,
          estraverse$1,
          esutils,
          base,
          indent,
          json,
          renumber,
          hexadecimal,
          quotes,
          escapeless,
          newline,
          space,
          parentheses,
          semicolons,
          safeConcatenation,
          directive,
          extra,
          parse,
          sourceMap$1,
          sourceCode,
          preserveBlankLines,
          FORMAT_MINIFY,
          FORMAT_DEFAULTS;

      estraverse$1 = estraverse;
      esutils = utils;

      Syntax = estraverse$1.Syntax;

      // Generation is done by generateExpression.
      function isExpression(node) {
          return CodeGenerator.Expression.hasOwnProperty(node.type);
      }

      // Generation is done by generateStatement.
      function isStatement(node) {
          return CodeGenerator.Statement.hasOwnProperty(node.type);
      }

      Precedence = {
          Sequence: 0,
          Yield: 1,
          Assignment: 1,
          Conditional: 2,
          ArrowFunction: 2,
          LogicalOR: 3,
          LogicalAND: 4,
          BitwiseOR: 5,
          BitwiseXOR: 6,
          BitwiseAND: 7,
          Equality: 8,
          Relational: 9,
          BitwiseSHIFT: 10,
          Additive: 11,
          Multiplicative: 12,
          Exponentiation: 13,
          Await: 14,
          Unary: 14,
          Postfix: 15,
          Call: 16,
          New: 17,
          TaggedTemplate: 18,
          Member: 19,
          Primary: 20
      };

      BinaryPrecedence = {
          '||': Precedence.LogicalOR,
          '&&': Precedence.LogicalAND,
          '|': Precedence.BitwiseOR,
          '^': Precedence.BitwiseXOR,
          '&': Precedence.BitwiseAND,
          '==': Precedence.Equality,
          '!=': Precedence.Equality,
          '===': Precedence.Equality,
          '!==': Precedence.Equality,
          'is': Precedence.Equality,
          'isnt': Precedence.Equality,
          '<': Precedence.Relational,
          '>': Precedence.Relational,
          '<=': Precedence.Relational,
          '>=': Precedence.Relational,
          'in': Precedence.Relational,
          'instanceof': Precedence.Relational,
          '<<': Precedence.BitwiseSHIFT,
          '>>': Precedence.BitwiseSHIFT,
          '>>>': Precedence.BitwiseSHIFT,
          '+': Precedence.Additive,
          '-': Precedence.Additive,
          '*': Precedence.Multiplicative,
          '%': Precedence.Multiplicative,
          '/': Precedence.Multiplicative,
          '**': Precedence.Exponentiation
      };

      //Flags
      var F_ALLOW_IN = 1,
          F_ALLOW_CALL = 1 << 1,
          F_ALLOW_UNPARATH_NEW = 1 << 2,
          F_FUNC_BODY = 1 << 3,
          F_DIRECTIVE_CTX = 1 << 4,
          F_SEMICOLON_OPT = 1 << 5;

      //Expression flag sets
      //NOTE: Flag order:
      // F_ALLOW_IN
      // F_ALLOW_CALL
      // F_ALLOW_UNPARATH_NEW
      var E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
          E_TTF = F_ALLOW_IN | F_ALLOW_CALL,
          E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
          E_TFF = F_ALLOW_IN,
          E_FFT = F_ALLOW_UNPARATH_NEW,
          E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;

      //Statement flag sets
      //NOTE: Flag order:
      // F_ALLOW_IN
      // F_FUNC_BODY
      // F_DIRECTIVE_CTX
      // F_SEMICOLON_OPT
      var S_TFFF = F_ALLOW_IN,
          S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT,
          S_FFFF = 0x00,
          S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX,
          S_TTFF = F_ALLOW_IN | F_FUNC_BODY;

      function getDefaultOptions() {
          // default options
          return {
              indent: null,
              base: null,
              parse: null,
              comment: false,
              format: {
                  indent: {
                      style: '    ',
                      base: 0,
                      adjustMultilineComment: false
                  },
                  newline: '\n',
                  space: ' ',
                  json: false,
                  renumber: false,
                  hexadecimal: false,
                  quotes: 'single',
                  escapeless: false,
                  compact: false,
                  parentheses: true,
                  semicolons: true,
                  safeConcatenation: false,
                  preserveBlankLines: false
              },
              moz: {
                  comprehensionExpressionStartsWithAssignment: false,
                  starlessGenerator: false
              },
              sourceMap: null,
              sourceMapRoot: null,
              sourceMapWithCode: false,
              directive: false,
              raw: true,
              verbatim: null,
              sourceCode: null
          };
      }

      function stringRepeat(str, num) {
          var result = '';

          for (num |= 0; num > 0; num >>>= 1, str += str) {
              if (num & 1) {
                  result += str;
              }
          }

          return result;
      }

      function hasLineTerminator(str) {
          return (/[\r\n]/g).test(str);
      }

      function endsWithLineTerminator(str) {
          var len = str.length;
          return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
      }

      function merge(target, override) {
          var key;
          for (key in override) {
              if (override.hasOwnProperty(key)) {
                  target[key] = override[key];
              }
          }
          return target;
      }

      function updateDeeply(target, override) {
          var key, val;

          function isHashObject(target) {
              return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
          }

          for (key in override) {
              if (override.hasOwnProperty(key)) {
                  val = override[key];
                  if (isHashObject(val)) {
                      if (isHashObject(target[key])) {
                          updateDeeply(target[key], val);
                      } else {
                          target[key] = updateDeeply({}, val);
                      }
                  } else {
                      target[key] = val;
                  }
              }
          }
          return target;
      }

      function generateNumber(value) {
          var result, point, temp, exponent, pos;

          if (value !== value) {
              throw new Error('Numeric literal whose value is NaN');
          }
          if (value < 0 || (value === 0 && 1 / value < 0)) {
              throw new Error('Numeric literal whose value is negative');
          }

          if (value === 1 / 0) {
              return json ? 'null' : renumber ? '1e400' : '1e+400';
          }

          result = '' + value;
          if (!renumber || result.length < 3) {
              return result;
          }

          point = result.indexOf('.');
          if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
              point = 0;
              result = result.slice(1);
          }
          temp = result;
          result = result.replace('e+', 'e');
          exponent = 0;
          if ((pos = temp.indexOf('e')) > 0) {
              exponent = +temp.slice(pos + 1);
              temp = temp.slice(0, pos);
          }
          if (point >= 0) {
              exponent -= temp.length - point - 1;
              temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
          }
          pos = 0;
          while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
              --pos;
          }
          if (pos !== 0) {
              exponent -= pos;
              temp = temp.slice(0, pos);
          }
          if (exponent !== 0) {
              temp += 'e' + exponent;
          }
          if ((temp.length < result.length ||
                      (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
                  +temp === value) {
              result = temp;
          }

          return result;
      }

      // Generate valid RegExp expression.
      // This function is based on https://github.com/Constellation/iv Engine

      function escapeRegExpCharacter(ch, previousIsBackslash) {
          // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
          if ((ch & ~1) === 0x2028) {
              return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
          } else if (ch === 10 || ch === 13) {  // \n, \r
              return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
          }
          return String.fromCharCode(ch);
      }

      function generateRegExp(reg) {
          var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

          result = reg.toString();

          if (reg.source) {
              // extract flag from toString result
              match = result.match(/\/([^/]*)$/);
              if (!match) {
                  return result;
              }

              flags = match[1];
              result = '';

              characterInBrack = false;
              previousIsBackslash = false;
              for (i = 0, iz = reg.source.length; i < iz; ++i) {
                  ch = reg.source.charCodeAt(i);

                  if (!previousIsBackslash) {
                      if (characterInBrack) {
                          if (ch === 93) {  // ]
                              characterInBrack = false;
                          }
                      } else {
                          if (ch === 47) {  // /
                              result += '\\';
                          } else if (ch === 91) {  // [
                              characterInBrack = true;
                          }
                      }
                      result += escapeRegExpCharacter(ch, previousIsBackslash);
                      previousIsBackslash = ch === 92;  // \
                  } else {
                      // if new RegExp("\\\n') is provided, create /\n/
                      result += escapeRegExpCharacter(ch, previousIsBackslash);
                      // prevent like /\\[/]/
                      previousIsBackslash = false;
                  }
              }

              return '/' + result + '/' + flags;
          }

          return result;
      }

      function escapeAllowedCharacter(code, next) {
          var hex;

          if (code === 0x08  /* \b */) {
              return '\\b';
          }

          if (code === 0x0C  /* \f */) {
              return '\\f';
          }

          if (code === 0x09  /* \t */) {
              return '\\t';
          }

          hex = code.toString(16).toUpperCase();
          if (json || code > 0xFF) {
              return '\\u' + '0000'.slice(hex.length) + hex;
          } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
              return '\\0';
          } else if (code === 0x000B  /* \v */) { // '\v'
              return '\\x0B';
          } else {
              return '\\x' + '00'.slice(hex.length) + hex;
          }
      }

      function escapeDisallowedCharacter(code) {
          if (code === 0x5C  /* \ */) {
              return '\\\\';
          }

          if (code === 0x0A  /* \n */) {
              return '\\n';
          }

          if (code === 0x0D  /* \r */) {
              return '\\r';
          }

          if (code === 0x2028) {
              return '\\u2028';
          }

          if (code === 0x2029) {
              return '\\u2029';
          }

          throw new Error('Incorrectly classified character');
      }

      function escapeDirective(str) {
          var i, iz, code, quote;

          quote = quotes === 'double' ? '"' : '\'';
          for (i = 0, iz = str.length; i < iz; ++i) {
              code = str.charCodeAt(i);
              if (code === 0x27  /* ' */) {
                  quote = '"';
                  break;
              } else if (code === 0x22  /* " */) {
                  quote = '\'';
                  break;
              } else if (code === 0x5C  /* \ */) {
                  ++i;
              }
          }

          return quote + str + quote;
      }

      function escapeString(str) {
          var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

          for (i = 0, len = str.length; i < len; ++i) {
              code = str.charCodeAt(i);
              if (code === 0x27  /* ' */) {
                  ++singleQuotes;
              } else if (code === 0x22  /* " */) {
                  ++doubleQuotes;
              } else if (code === 0x2F  /* / */ && json) {
                  result += '\\';
              } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
                  result += escapeDisallowedCharacter(code);
                  continue;
              } else if (!esutils.code.isIdentifierPartES5(code) && (json && code < 0x20  /* SP */ || !json && !escapeless && (code < 0x20  /* SP */ || code > 0x7E  /* ~ */))) {
                  result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
                  continue;
              }
              result += String.fromCharCode(code);
          }

          single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
          quote = single ? '\'' : '"';

          if (!(single ? singleQuotes : doubleQuotes)) {
              return quote + result + quote;
          }

          str = result;
          result = quote;

          for (i = 0, len = str.length; i < len; ++i) {
              code = str.charCodeAt(i);
              if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
                  result += '\\';
              }
              result += String.fromCharCode(code);
          }

          return result + quote;
      }

      /**
       * flatten an array to a string, where the array can contain
       * either strings or nested arrays
       */
      function flattenToString(arr) {
          var i, iz, elem, result = '';
          for (i = 0, iz = arr.length; i < iz; ++i) {
              elem = arr[i];
              result += Array.isArray(elem) ? flattenToString(elem) : elem;
          }
          return result;
      }

      /**
       * convert generated to a SourceNode when source maps are enabled.
       */
      function toSourceNodeWhenNeeded(generated, node) {
          if (!sourceMap$1) {
              // with no source maps, generated is either an
              // array or a string.  if an array, flatten it.
              // if a string, just return it
              if (Array.isArray(generated)) {
                  return flattenToString(generated);
              } else {
                  return generated;
              }
          }
          if (node == null) {
              if (generated instanceof SourceNode) {
                  return generated;
              } else {
                  node = {};
              }
          }
          if (node.loc == null) {
              return new SourceNode(null, null, sourceMap$1, generated, node.name || null);
          }
          return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap$1 === true ? node.loc.source || null : sourceMap$1), generated, node.name || null);
      }

      function noEmptySpace() {
          return (space) ? space : ' ';
      }

      function join(left, right) {
          var leftSource,
              rightSource,
              leftCharCode,
              rightCharCode;

          leftSource = toSourceNodeWhenNeeded(left).toString();
          if (leftSource.length === 0) {
              return [right];
          }

          rightSource = toSourceNodeWhenNeeded(right).toString();
          if (rightSource.length === 0) {
              return [left];
          }

          leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
          rightCharCode = rightSource.charCodeAt(0);

          if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
              esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode) ||
              leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
              return [left, noEmptySpace(), right];
          } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
                  esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
              return [left, right];
          }
          return [left, space, right];
      }

      function addIndent(stmt) {
          return [base, stmt];
      }

      function withIndent(fn) {
          var previousBase;
          previousBase = base;
          base += indent;
          fn(base);
          base = previousBase;
      }

      function calculateSpaces(str) {
          var i;
          for (i = str.length - 1; i >= 0; --i) {
              if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
                  break;
              }
          }
          return (str.length - 1) - i;
      }

      function adjustMultilineComment(value, specialBase) {
          var array, i, len, line, j, spaces, previousBase, sn;

          array = value.split(/\r\n|[\r\n]/);
          spaces = Number.MAX_VALUE;

          // first line doesn't have indentation
          for (i = 1, len = array.length; i < len; ++i) {
              line = array[i];
              j = 0;
              while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
                  ++j;
              }
              if (spaces > j) {
                  spaces = j;
              }
          }

          if (typeof specialBase !== 'undefined') {
              // pattern like
              // {
              //   var t = 20;  /*
              //                 * this is comment
              //                 */
              // }
              previousBase = base;
              if (array[1][spaces] === '*') {
                  specialBase += ' ';
              }
              base = specialBase;
          } else {
              if (spaces & 1) {
                  // /*
                  //  *
                  //  */
                  // If spaces are odd number, above pattern is considered.
                  // We waste 1 space.
                  --spaces;
              }
              previousBase = base;
          }

          for (i = 1, len = array.length; i < len; ++i) {
              sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
              array[i] = sourceMap$1 ? sn.join('') : sn;
          }

          base = previousBase;

          return array.join('\n');
      }

      function generateComment(comment, specialBase) {
          if (comment.type === 'Line') {
              if (endsWithLineTerminator(comment.value)) {
                  return '//' + comment.value;
              } else {
                  // Always use LineTerminator
                  var result = '//' + comment.value;
                  if (!preserveBlankLines) {
                      result += '\n';
                  }
                  return result;
              }
          }
          if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
              return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
          }
          return '/*' + comment.value + '*/';
      }

      function addComments(stmt, result) {
          var i, len, comment, save, tailingToStatement, specialBase, fragment,
              extRange, range, prevRange, prefix, infix, suffix, count;

          if (stmt.leadingComments && stmt.leadingComments.length > 0) {
              save = result;

              if (preserveBlankLines) {
                  comment = stmt.leadingComments[0];
                  result = [];

                  extRange = comment.extendedRange;
                  range = comment.range;

                  prefix = sourceCode.substring(extRange[0], range[0]);
                  count = (prefix.match(/\n/g) || []).length;
                  if (count > 0) {
                      result.push(stringRepeat('\n', count));
                      result.push(addIndent(generateComment(comment)));
                  } else {
                      result.push(prefix);
                      result.push(generateComment(comment));
                  }

                  prevRange = range;

                  for (i = 1, len = stmt.leadingComments.length; i < len; i++) {
                      comment = stmt.leadingComments[i];
                      range = comment.range;

                      infix = sourceCode.substring(prevRange[1], range[0]);
                      count = (infix.match(/\n/g) || []).length;
                      result.push(stringRepeat('\n', count));
                      result.push(addIndent(generateComment(comment)));

                      prevRange = range;
                  }

                  suffix = sourceCode.substring(range[1], extRange[1]);
                  count = (suffix.match(/\n/g) || []).length;
                  result.push(stringRepeat('\n', count));
              } else {
                  comment = stmt.leadingComments[0];
                  result = [];
                  if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
                      result.push('\n');
                  }
                  result.push(generateComment(comment));
                  if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                      result.push('\n');
                  }

                  for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
                      comment = stmt.leadingComments[i];
                      fragment = [generateComment(comment)];
                      if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                          fragment.push('\n');
                      }
                      result.push(addIndent(fragment));
                  }
              }

              result.push(addIndent(save));
          }

          if (stmt.trailingComments) {

              if (preserveBlankLines) {
                  comment = stmt.trailingComments[0];
                  extRange = comment.extendedRange;
                  range = comment.range;

                  prefix = sourceCode.substring(extRange[0], range[0]);
                  count = (prefix.match(/\n/g) || []).length;

                  if (count > 0) {
                      result.push(stringRepeat('\n', count));
                      result.push(addIndent(generateComment(comment)));
                  } else {
                      result.push(prefix);
                      result.push(generateComment(comment));
                  }
              } else {
                  tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
                  specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
                  for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
                      comment = stmt.trailingComments[i];
                      if (tailingToStatement) {
                          // We assume target like following script
                          //
                          // var t = 20;  /**
                          //               * This is comment of t
                          //               */
                          if (i === 0) {
                              // first case
                              result = [result, indent];
                          } else {
                              result = [result, specialBase];
                          }
                          result.push(generateComment(comment, specialBase));
                      } else {
                          result = [result, addIndent(generateComment(comment))];
                      }
                      if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                          result = [result, '\n'];
                      }
                  }
              }
          }

          return result;
      }

      function generateBlankLines(start, end, result) {
          var j, newlineCount = 0;

          for (j = start; j < end; j++) {
              if (sourceCode[j] === '\n') {
                  newlineCount++;
              }
          }

          for (j = 1; j < newlineCount; j++) {
              result.push(newline);
          }
      }

      function parenthesize(text, current, should) {
          if (current < should) {
              return ['(', text, ')'];
          }
          return text;
      }

      function generateVerbatimString(string) {
          var i, iz, result;
          result = string.split(/\r\n|\n/);
          for (i = 1, iz = result.length; i < iz; i++) {
              result[i] = newline + base + result[i];
          }
          return result;
      }

      function generateVerbatim(expr, precedence) {
          var verbatim, result, prec;
          verbatim = expr[extra.verbatim];

          if (typeof verbatim === 'string') {
              result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence);
          } else {
              // verbatim is object
              result = generateVerbatimString(verbatim.content);
              prec = (verbatim.precedence != null) ? verbatim.precedence : Precedence.Sequence;
              result = parenthesize(result, prec, precedence);
          }

          return toSourceNodeWhenNeeded(result, expr);
      }

      function CodeGenerator() {
      }

      // Helpers.

      CodeGenerator.prototype.maybeBlock = function(stmt, flags) {
          var result, noLeadingComment, that = this;

          noLeadingComment = !extra.comment || !stmt.leadingComments;

          if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
              return [space, this.generateStatement(stmt, flags)];
          }

          if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
              return ';';
          }

          withIndent(function () {
              result = [
                  newline,
                  addIndent(that.generateStatement(stmt, flags))
              ];
          });

          return result;
      };

      CodeGenerator.prototype.maybeBlockSuffix = function (stmt, result) {
          var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
          if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
              return [result, space];
          }
          if (ends) {
              return [result, base];
          }
          return [result, newline, base];
      };

      function generateIdentifier(node) {
          return toSourceNodeWhenNeeded(node.name, node);
      }

      function generateAsyncPrefix(node, spaceRequired) {
          return node.async ? 'async' + (spaceRequired ? noEmptySpace() : space) : '';
      }

      function generateStarSuffix(node) {
          var isGenerator = node.generator && !extra.moz.starlessGenerator;
          return isGenerator ? '*' + space : '';
      }

      function generateMethodPrefix(prop) {
          var func = prop.value, prefix = '';
          if (func.async) {
              prefix += generateAsyncPrefix(func, !prop.computed);
          }
          if (func.generator) {
              // avoid space before method name
              prefix += generateStarSuffix(func) ? '*' : '';
          }
          return prefix;
      }

      CodeGenerator.prototype.generatePattern = function (node, precedence, flags) {
          if (node.type === Syntax.Identifier) {
              return generateIdentifier(node);
          }
          return this.generateExpression(node, precedence, flags);
      };

      CodeGenerator.prototype.generateFunctionParams = function (node) {
          var i, iz, result, hasDefault;

          hasDefault = false;

          if (node.type === Syntax.ArrowFunctionExpression &&
                  !node.rest && (!node.defaults || node.defaults.length === 0) &&
                  node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
              // arg => { } case
              result = [generateAsyncPrefix(node, true), generateIdentifier(node.params[0])];
          } else {
              result = node.type === Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, false)] : [];
              result.push('(');
              if (node.defaults) {
                  hasDefault = true;
              }
              for (i = 0, iz = node.params.length; i < iz; ++i) {
                  if (hasDefault && node.defaults[i]) {
                      // Handle default values.
                      result.push(this.generateAssignment(node.params[i], node.defaults[i], '=', Precedence.Assignment, E_TTT));
                  } else {
                      result.push(this.generatePattern(node.params[i], Precedence.Assignment, E_TTT));
                  }
                  if (i + 1 < iz) {
                      result.push(',' + space);
                  }
              }

              if (node.rest) {
                  if (node.params.length) {
                      result.push(',' + space);
                  }
                  result.push('...');
                  result.push(generateIdentifier(node.rest));
              }

              result.push(')');
          }

          return result;
      };

      CodeGenerator.prototype.generateFunctionBody = function (node) {
          var result, expr;

          result = this.generateFunctionParams(node);

          if (node.type === Syntax.ArrowFunctionExpression) {
              result.push(space);
              result.push('=>');
          }

          if (node.expression) {
              result.push(space);
              expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT);
              if (expr.toString().charAt(0) === '{') {
                  expr = ['(', expr, ')'];
              }
              result.push(expr);
          } else {
              result.push(this.maybeBlock(node.body, S_TTFF));
          }

          return result;
      };

      CodeGenerator.prototype.generateIterationForStatement = function (operator, stmt, flags) {
          var result = ['for' + (stmt.await ? noEmptySpace() + 'await' : '') + space + '('], that = this;
          withIndent(function () {
              if (stmt.left.type === Syntax.VariableDeclaration) {
                  withIndent(function () {
                      result.push(stmt.left.kind + noEmptySpace());
                      result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
                  });
              } else {
                  result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT));
              }

              result = join(result, operator);
              result = [join(
                  result,
                  that.generateExpression(stmt.right, Precedence.Assignment, E_TTT)
              ), ')'];
          });
          result.push(this.maybeBlock(stmt.body, flags));
          return result;
      };

      CodeGenerator.prototype.generatePropertyKey = function (expr, computed) {
          var result = [];

          if (computed) {
              result.push('[');
          }

          result.push(this.generateExpression(expr, Precedence.Sequence, E_TTT));

          if (computed) {
              result.push(']');
          }

          return result;
      };

      CodeGenerator.prototype.generateAssignment = function (left, right, operator, precedence, flags) {
          if (Precedence.Assignment < precedence) {
              flags |= F_ALLOW_IN;
          }

          return parenthesize(
              [
                  this.generateExpression(left, Precedence.Call, flags),
                  space + operator + space,
                  this.generateExpression(right, Precedence.Assignment, flags)
              ],
              Precedence.Assignment,
              precedence
          );
      };

      CodeGenerator.prototype.semicolon = function (flags) {
          if (!semicolons && flags & F_SEMICOLON_OPT) {
              return '';
          }
          return ';';
      };

      // Statements.

      CodeGenerator.Statement = {

          BlockStatement: function (stmt, flags) {
              var range, content, result = ['{', newline], that = this;

              withIndent(function () {
                  // handle functions without any code
                  if (stmt.body.length === 0 && preserveBlankLines) {
                      range = stmt.range;
                      if (range[1] - range[0] > 2) {
                          content = sourceCode.substring(range[0] + 1, range[1] - 1);
                          if (content[0] === '\n') {
                              result = ['{'];
                          }
                          result.push(content);
                      }
                  }

                  var i, iz, fragment, bodyFlags;
                  bodyFlags = S_TFFF;
                  if (flags & F_FUNC_BODY) {
                      bodyFlags |= F_DIRECTIVE_CTX;
                  }

                  for (i = 0, iz = stmt.body.length; i < iz; ++i) {
                      if (preserveBlankLines) {
                          // handle spaces before the first line
                          if (i === 0) {
                              if (stmt.body[0].leadingComments) {
                                  range = stmt.body[0].leadingComments[0].extendedRange;
                                  content = sourceCode.substring(range[0], range[1]);
                                  if (content[0] === '\n') {
                                      result = ['{'];
                                  }
                              }
                              if (!stmt.body[0].leadingComments) {
                                  generateBlankLines(stmt.range[0], stmt.body[0].range[0], result);
                              }
                          }

                          // handle spaces between lines
                          if (i > 0) {
                              if (!stmt.body[i - 1].trailingComments  && !stmt.body[i].leadingComments) {
                                  generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                              }
                          }
                      }

                      if (i === iz - 1) {
                          bodyFlags |= F_SEMICOLON_OPT;
                      }

                      if (stmt.body[i].leadingComments && preserveBlankLines) {
                          fragment = that.generateStatement(stmt.body[i], bodyFlags);
                      } else {
                          fragment = addIndent(that.generateStatement(stmt.body[i], bodyFlags));
                      }

                      result.push(fragment);
                      if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                          if (preserveBlankLines && i < iz - 1) {
                              // don't add a new line if there are leading coments
                              // in the next statement
                              if (!stmt.body[i + 1].leadingComments) {
                                  result.push(newline);
                              }
                          } else {
                              result.push(newline);
                          }
                      }

                      if (preserveBlankLines) {
                          // handle spaces after the last line
                          if (i === iz - 1) {
                              if (!stmt.body[i].trailingComments) {
                                  generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                              }
                          }
                      }
                  }
              });

              result.push(addIndent('}'));
              return result;
          },

          BreakStatement: function (stmt, flags) {
              if (stmt.label) {
                  return 'break ' + stmt.label.name + this.semicolon(flags);
              }
              return 'break' + this.semicolon(flags);
          },

          ContinueStatement: function (stmt, flags) {
              if (stmt.label) {
                  return 'continue ' + stmt.label.name + this.semicolon(flags);
              }
              return 'continue' + this.semicolon(flags);
          },

          ClassBody: function (stmt, flags) {
              var result = [ '{', newline], that = this;

              withIndent(function (indent) {
                  var i, iz;

                  for (i = 0, iz = stmt.body.length; i < iz; ++i) {
                      result.push(indent);
                      result.push(that.generateExpression(stmt.body[i], Precedence.Sequence, E_TTT));
                      if (i + 1 < iz) {
                          result.push(newline);
                      }
                  }
              });

              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                  result.push(newline);
              }
              result.push(base);
              result.push('}');
              return result;
          },

          ClassDeclaration: function (stmt, flags) {
              var result, fragment;
              result  = ['class'];
              if (stmt.id) {
                  result = join(result, this.generateExpression(stmt.id, Precedence.Sequence, E_TTT));
              }
              if (stmt.superClass) {
                  fragment = join('extends', this.generateExpression(stmt.superClass, Precedence.Unary, E_TTT));
                  result = join(result, fragment);
              }
              result.push(space);
              result.push(this.generateStatement(stmt.body, S_TFFT));
              return result;
          },

          DirectiveStatement: function (stmt, flags) {
              if (extra.raw && stmt.raw) {
                  return stmt.raw + this.semicolon(flags);
              }
              return escapeDirective(stmt.directive) + this.semicolon(flags);
          },

          DoWhileStatement: function (stmt, flags) {
              // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
              var result = join('do', this.maybeBlock(stmt.body, S_TFFF));
              result = this.maybeBlockSuffix(stmt.body, result);
              return join(result, [
                  'while' + space + '(',
                  this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
                  ')' + this.semicolon(flags)
              ]);
          },

          CatchClause: function (stmt, flags) {
              var result, that = this;
              withIndent(function () {
                  var guard;

                  if (stmt.param) {
                      result = [
                          'catch' + space + '(',
                          that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
                          ')'
                      ];

                      if (stmt.guard) {
                          guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT);
                          result.splice(2, 0, ' if ', guard);
                      }
                  } else {
                      result = ['catch'];
                  }
              });
              result.push(this.maybeBlock(stmt.body, S_TFFF));
              return result;
          },

          DebuggerStatement: function (stmt, flags) {
              return 'debugger' + this.semicolon(flags);
          },

          EmptyStatement: function (stmt, flags) {
              return ';';
          },

          ExportDefaultDeclaration: function (stmt, flags) {
              var result = [ 'export' ], bodyFlags;

              bodyFlags = (flags & F_SEMICOLON_OPT) ? S_TFFT : S_TFFF;

              // export default HoistableDeclaration[Default]
              // export default AssignmentExpression[In] ;
              result = join(result, 'default');
              if (isStatement(stmt.declaration)) {
                  result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
              } else {
                  result = join(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags));
              }
              return result;
          },

          ExportNamedDeclaration: function (stmt, flags) {
              var result = [ 'export' ], bodyFlags, that = this;

              bodyFlags = (flags & F_SEMICOLON_OPT) ? S_TFFT : S_TFFF;

              // export VariableStatement
              // export Declaration[Default]
              if (stmt.declaration) {
                  return join(result, this.generateStatement(stmt.declaration, bodyFlags));
              }

              // export ExportClause[NoReference] FromClause ;
              // export ExportClause ;
              if (stmt.specifiers) {
                  if (stmt.specifiers.length === 0) {
                      result = join(result, '{' + space + '}');
                  } else if (stmt.specifiers[0].type === Syntax.ExportBatchSpecifier) {
                      result = join(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT));
                  } else {
                      result = join(result, '{');
                      withIndent(function (indent) {
                          var i, iz;
                          result.push(newline);
                          for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
                              result.push(indent);
                              result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
                              if (i + 1 < iz) {
                                  result.push(',' + newline);
                              }
                          }
                      });
                      if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                          result.push(newline);
                      }
                      result.push(base + '}');
                  }

                  if (stmt.source) {
                      result = join(result, [
                          'from' + space,
                          // ModuleSpecifier
                          this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                          this.semicolon(flags)
                      ]);
                  } else {
                      result.push(this.semicolon(flags));
                  }
              }
              return result;
          },

          ExportAllDeclaration: function (stmt, flags) {
              // export * FromClause ;
              return [
                  'export' + space,
                  '*' + space,
                  'from' + space,
                  // ModuleSpecifier
                  this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                  this.semicolon(flags)
              ];
          },

          ExpressionStatement: function (stmt, flags) {
              var result, fragment;

              function isClassPrefixed(fragment) {
                  var code;
                  if (fragment.slice(0, 5) !== 'class') {
                      return false;
                  }
                  code = fragment.charCodeAt(5);
                  return code === 0x7B  /* '{' */ || esutils.code.isWhiteSpace(code) || esutils.code.isLineTerminator(code);
              }

              function isFunctionPrefixed(fragment) {
                  var code;
                  if (fragment.slice(0, 8) !== 'function') {
                      return false;
                  }
                  code = fragment.charCodeAt(8);
                  return code === 0x28 /* '(' */ || esutils.code.isWhiteSpace(code) || code === 0x2A  /* '*' */ || esutils.code.isLineTerminator(code);
              }

              function isAsyncPrefixed(fragment) {
                  var code, i, iz;
                  if (fragment.slice(0, 5) !== 'async') {
                      return false;
                  }
                  if (!esutils.code.isWhiteSpace(fragment.charCodeAt(5))) {
                      return false;
                  }
                  for (i = 6, iz = fragment.length; i < iz; ++i) {
                      if (!esutils.code.isWhiteSpace(fragment.charCodeAt(i))) {
                          break;
                      }
                  }
                  if (i === iz) {
                      return false;
                  }
                  if (fragment.slice(i, i + 8) !== 'function') {
                      return false;
                  }
                  code = fragment.charCodeAt(i + 8);
                  return code === 0x28 /* '(' */ || esutils.code.isWhiteSpace(code) || code === 0x2A  /* '*' */ || esutils.code.isLineTerminator(code);
              }

              result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT)];
              // 12.4 '{', 'function', 'class' is not allowed in this position.
              // wrap expression with parentheses
              fragment = toSourceNodeWhenNeeded(result).toString();
              if (fragment.charCodeAt(0) === 0x7B  /* '{' */ ||  // ObjectExpression
                      isClassPrefixed(fragment) ||
                      isFunctionPrefixed(fragment) ||
                      isAsyncPrefixed(fragment) ||
                      (directive && (flags & F_DIRECTIVE_CTX) && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
                  result = ['(', result, ')' + this.semicolon(flags)];
              } else {
                  result.push(this.semicolon(flags));
              }
              return result;
          },

          ImportDeclaration: function (stmt, flags) {
              // ES6: 15.2.1 valid import declarations:
              //     - import ImportClause FromClause ;
              //     - import ModuleSpecifier ;
              var result, cursor, that = this;

              // If no ImportClause is present,
              // this should be `import ModuleSpecifier` so skip `from`
              // ModuleSpecifier is StringLiteral.
              if (stmt.specifiers.length === 0) {
                  // import ModuleSpecifier ;
                  return [
                      'import',
                      space,
                      // ModuleSpecifier
                      this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                      this.semicolon(flags)
                  ];
              }

              // import ImportClause FromClause ;
              result = [
                  'import'
              ];
              cursor = 0;

              // ImportedBinding
              if (stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier) {
                  result = join(result, [
                          this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
                  ]);
                  ++cursor;
              }

              if (stmt.specifiers[cursor]) {
                  if (cursor !== 0) {
                      result.push(',');
                  }

                  if (stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier) {
                      // NameSpaceImport
                      result = join(result, [
                              space,
                              this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
                      ]);
                  } else {
                      // NamedImports
                      result.push(space + '{');

                      if ((stmt.specifiers.length - cursor) === 1) {
                          // import { ... } from "...";
                          result.push(space);
                          result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT));
                          result.push(space + '}' + space);
                      } else {
                          // import {
                          //    ...,
                          //    ...,
                          // } from "...";
                          withIndent(function (indent) {
                              var i, iz;
                              result.push(newline);
                              for (i = cursor, iz = stmt.specifiers.length; i < iz; ++i) {
                                  result.push(indent);
                                  result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
                                  if (i + 1 < iz) {
                                      result.push(',' + newline);
                                  }
                              }
                          });
                          if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                              result.push(newline);
                          }
                          result.push(base + '}' + space);
                      }
                  }
              }

              result = join(result, [
                  'from' + space,
                  // ModuleSpecifier
                  this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                  this.semicolon(flags)
              ]);
              return result;
          },

          VariableDeclarator: function (stmt, flags) {
              var itemFlags = (flags & F_ALLOW_IN) ? E_TTT : E_FTT;
              if (stmt.init) {
                  return [
                      this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
                      space,
                      '=',
                      space,
                      this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
                  ];
              }
              return this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
          },

          VariableDeclaration: function (stmt, flags) {
              // VariableDeclarator is typed as Statement,
              // but joined with comma (not LineTerminator).
              // So if comment is attached to target node, we should specialize.
              var result, i, iz, node, bodyFlags, that = this;

              result = [ stmt.kind ];

              bodyFlags = (flags & F_ALLOW_IN) ? S_TFFF : S_FFFF;

              function block() {
                  node = stmt.declarations[0];
                  if (extra.comment && node.leadingComments) {
                      result.push('\n');
                      result.push(addIndent(that.generateStatement(node, bodyFlags)));
                  } else {
                      result.push(noEmptySpace());
                      result.push(that.generateStatement(node, bodyFlags));
                  }

                  for (i = 1, iz = stmt.declarations.length; i < iz; ++i) {
                      node = stmt.declarations[i];
                      if (extra.comment && node.leadingComments) {
                          result.push(',' + newline);
                          result.push(addIndent(that.generateStatement(node, bodyFlags)));
                      } else {
                          result.push(',' + space);
                          result.push(that.generateStatement(node, bodyFlags));
                      }
                  }
              }

              if (stmt.declarations.length > 1) {
                  withIndent(block);
              } else {
                  block();
              }

              result.push(this.semicolon(flags));

              return result;
          },

          ThrowStatement: function (stmt, flags) {
              return [join(
                  'throw',
                  this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
              ), this.semicolon(flags)];
          },

          TryStatement: function (stmt, flags) {
              var result, i, iz, guardedHandlers;

              result = ['try', this.maybeBlock(stmt.block, S_TFFF)];
              result = this.maybeBlockSuffix(stmt.block, result);

              if (stmt.handlers) {
                  // old interface
                  for (i = 0, iz = stmt.handlers.length; i < iz; ++i) {
                      result = join(result, this.generateStatement(stmt.handlers[i], S_TFFF));
                      if (stmt.finalizer || i + 1 !== iz) {
                          result = this.maybeBlockSuffix(stmt.handlers[i].body, result);
                      }
                  }
              } else {
                  guardedHandlers = stmt.guardedHandlers || [];

                  for (i = 0, iz = guardedHandlers.length; i < iz; ++i) {
                      result = join(result, this.generateStatement(guardedHandlers[i], S_TFFF));
                      if (stmt.finalizer || i + 1 !== iz) {
                          result = this.maybeBlockSuffix(guardedHandlers[i].body, result);
                      }
                  }

                  // new interface
                  if (stmt.handler) {
                      if (Array.isArray(stmt.handler)) {
                          for (i = 0, iz = stmt.handler.length; i < iz; ++i) {
                              result = join(result, this.generateStatement(stmt.handler[i], S_TFFF));
                              if (stmt.finalizer || i + 1 !== iz) {
                                  result = this.maybeBlockSuffix(stmt.handler[i].body, result);
                              }
                          }
                      } else {
                          result = join(result, this.generateStatement(stmt.handler, S_TFFF));
                          if (stmt.finalizer) {
                              result = this.maybeBlockSuffix(stmt.handler.body, result);
                          }
                      }
                  }
              }
              if (stmt.finalizer) {
                  result = join(result, ['finally', this.maybeBlock(stmt.finalizer, S_TFFF)]);
              }
              return result;
          },

          SwitchStatement: function (stmt, flags) {
              var result, fragment, i, iz, bodyFlags, that = this;
              withIndent(function () {
                  result = [
                      'switch' + space + '(',
                      that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
                      ')' + space + '{' + newline
                  ];
              });
              if (stmt.cases) {
                  bodyFlags = S_TFFF;
                  for (i = 0, iz = stmt.cases.length; i < iz; ++i) {
                      if (i === iz - 1) {
                          bodyFlags |= F_SEMICOLON_OPT;
                      }
                      fragment = addIndent(this.generateStatement(stmt.cases[i], bodyFlags));
                      result.push(fragment);
                      if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                          result.push(newline);
                      }
                  }
              }
              result.push(addIndent('}'));
              return result;
          },

          SwitchCase: function (stmt, flags) {
              var result, fragment, i, iz, bodyFlags, that = this;
              withIndent(function () {
                  if (stmt.test) {
                      result = [
                          join('case', that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
                          ':'
                      ];
                  } else {
                      result = ['default:'];
                  }

                  i = 0;
                  iz = stmt.consequent.length;
                  if (iz && stmt.consequent[0].type === Syntax.BlockStatement) {
                      fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
                      result.push(fragment);
                      i = 1;
                  }

                  if (i !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                      result.push(newline);
                  }

                  bodyFlags = S_TFFF;
                  for (; i < iz; ++i) {
                      if (i === iz - 1 && flags & F_SEMICOLON_OPT) {
                          bodyFlags |= F_SEMICOLON_OPT;
                      }
                      fragment = addIndent(that.generateStatement(stmt.consequent[i], bodyFlags));
                      result.push(fragment);
                      if (i + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                          result.push(newline);
                      }
                  }
              });
              return result;
          },

          IfStatement: function (stmt, flags) {
              var result, bodyFlags, semicolonOptional, that = this;
              withIndent(function () {
                  result = [
                      'if' + space + '(',
                      that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
                      ')'
                  ];
              });
              semicolonOptional = flags & F_SEMICOLON_OPT;
              bodyFlags = S_TFFF;
              if (semicolonOptional) {
                  bodyFlags |= F_SEMICOLON_OPT;
              }
              if (stmt.alternate) {
                  result.push(this.maybeBlock(stmt.consequent, S_TFFF));
                  result = this.maybeBlockSuffix(stmt.consequent, result);
                  if (stmt.alternate.type === Syntax.IfStatement) {
                      result = join(result, ['else ', this.generateStatement(stmt.alternate, bodyFlags)]);
                  } else {
                      result = join(result, join('else', this.maybeBlock(stmt.alternate, bodyFlags)));
                  }
              } else {
                  result.push(this.maybeBlock(stmt.consequent, bodyFlags));
              }
              return result;
          },

          ForStatement: function (stmt, flags) {
              var result, that = this;
              withIndent(function () {
                  result = ['for' + space + '('];
                  if (stmt.init) {
                      if (stmt.init.type === Syntax.VariableDeclaration) {
                          result.push(that.generateStatement(stmt.init, S_FFFF));
                      } else {
                          // F_ALLOW_IN becomes false.
                          result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT));
                          result.push(';');
                      }
                  } else {
                      result.push(';');
                  }

                  if (stmt.test) {
                      result.push(space);
                      result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT));
                      result.push(';');
                  } else {
                      result.push(';');
                  }

                  if (stmt.update) {
                      result.push(space);
                      result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT));
                      result.push(')');
                  } else {
                      result.push(')');
                  }
              });

              result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
              return result;
          },

          ForInStatement: function (stmt, flags) {
              return this.generateIterationForStatement('in', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
          },

          ForOfStatement: function (stmt, flags) {
              return this.generateIterationForStatement('of', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
          },

          LabeledStatement: function (stmt, flags) {
              return [stmt.label.name + ':', this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
          },

          Program: function (stmt, flags) {
              var result, fragment, i, iz, bodyFlags;
              iz = stmt.body.length;
              result = [safeConcatenation && iz > 0 ? '\n' : ''];
              bodyFlags = S_TFTF;
              for (i = 0; i < iz; ++i) {
                  if (!safeConcatenation && i === iz - 1) {
                      bodyFlags |= F_SEMICOLON_OPT;
                  }

                  if (preserveBlankLines) {
                      // handle spaces before the first line
                      if (i === 0) {
                          if (!stmt.body[0].leadingComments) {
                              generateBlankLines(stmt.range[0], stmt.body[i].range[0], result);
                          }
                      }

                      // handle spaces between lines
                      if (i > 0) {
                          if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
                              generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                          }
                      }
                  }

                  fragment = addIndent(this.generateStatement(stmt.body[i], bodyFlags));
                  result.push(fragment);
                  if (i + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                      if (preserveBlankLines) {
                          if (!stmt.body[i + 1].leadingComments) {
                              result.push(newline);
                          }
                      } else {
                          result.push(newline);
                      }
                  }

                  if (preserveBlankLines) {
                      // handle spaces after the last line
                      if (i === iz - 1) {
                          if (!stmt.body[i].trailingComments) {
                              generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                          }
                      }
                  }
              }
              return result;
          },

          FunctionDeclaration: function (stmt, flags) {
              return [
                  generateAsyncPrefix(stmt, true),
                  'function',
                  generateStarSuffix(stmt) || noEmptySpace(),
                  stmt.id ? generateIdentifier(stmt.id) : '',
                  this.generateFunctionBody(stmt)
              ];
          },

          ReturnStatement: function (stmt, flags) {
              if (stmt.argument) {
                  return [join(
                      'return',
                      this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
                  ), this.semicolon(flags)];
              }
              return ['return' + this.semicolon(flags)];
          },

          WhileStatement: function (stmt, flags) {
              var result, that = this;
              withIndent(function () {
                  result = [
                      'while' + space + '(',
                      that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
                      ')'
                  ];
              });
              result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
              return result;
          },

          WithStatement: function (stmt, flags) {
              var result, that = this;
              withIndent(function () {
                  result = [
                      'with' + space + '(',
                      that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
                      ')'
                  ];
              });
              result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
              return result;
          }

      };

      merge(CodeGenerator.prototype, CodeGenerator.Statement);

      // Expressions.

      CodeGenerator.Expression = {

          SequenceExpression: function (expr, precedence, flags) {
              var result, i, iz;
              if (Precedence.Sequence < precedence) {
                  flags |= F_ALLOW_IN;
              }
              result = [];
              for (i = 0, iz = expr.expressions.length; i < iz; ++i) {
                  result.push(this.generateExpression(expr.expressions[i], Precedence.Assignment, flags));
                  if (i + 1 < iz) {
                      result.push(',' + space);
                  }
              }
              return parenthesize(result, Precedence.Sequence, precedence);
          },

          AssignmentExpression: function (expr, precedence, flags) {
              return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
          },

          ArrowFunctionExpression: function (expr, precedence, flags) {
              return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
          },

          ConditionalExpression: function (expr, precedence, flags) {
              if (Precedence.Conditional < precedence) {
                  flags |= F_ALLOW_IN;
              }
              return parenthesize(
                  [
                      this.generateExpression(expr.test, Precedence.LogicalOR, flags),
                      space + '?' + space,
                      this.generateExpression(expr.consequent, Precedence.Assignment, flags),
                      space + ':' + space,
                      this.generateExpression(expr.alternate, Precedence.Assignment, flags)
                  ],
                  Precedence.Conditional,
                  precedence
              );
          },

          LogicalExpression: function (expr, precedence, flags) {
              return this.BinaryExpression(expr, precedence, flags);
          },

          BinaryExpression: function (expr, precedence, flags) {
              var result, leftPrecedence, rightPrecedence, currentPrecedence, fragment, leftSource;
              currentPrecedence = BinaryPrecedence[expr.operator];
              leftPrecedence = expr.operator === '**' ? Precedence.Postfix : currentPrecedence;
              rightPrecedence = expr.operator === '**' ? currentPrecedence : currentPrecedence + 1;

              if (currentPrecedence < precedence) {
                  flags |= F_ALLOW_IN;
              }

              fragment = this.generateExpression(expr.left, leftPrecedence, flags);

              leftSource = fragment.toString();

              if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPartES5(expr.operator.charCodeAt(0))) {
                  result = [fragment, noEmptySpace(), expr.operator];
              } else {
                  result = join(fragment, expr.operator);
              }

              fragment = this.generateExpression(expr.right, rightPrecedence, flags);

              if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
              expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
                  // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
                  result.push(noEmptySpace());
                  result.push(fragment);
              } else {
                  result = join(result, fragment);
              }

              if (expr.operator === 'in' && !(flags & F_ALLOW_IN)) {
                  return ['(', result, ')'];
              }
              return parenthesize(result, currentPrecedence, precedence);
          },

          CallExpression: function (expr, precedence, flags) {
              var result, i, iz;
              // F_ALLOW_UNPARATH_NEW becomes false.
              result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)];
              result.push('(');
              for (i = 0, iz = expr['arguments'].length; i < iz; ++i) {
                  result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
                  if (i + 1 < iz) {
                      result.push(',' + space);
                  }
              }
              result.push(')');

              if (!(flags & F_ALLOW_CALL)) {
                  return ['(', result, ')'];
              }
              return parenthesize(result, Precedence.Call, precedence);
          },

          NewExpression: function (expr, precedence, flags) {
              var result, length, i, iz, itemFlags;
              length = expr['arguments'].length;

              // F_ALLOW_CALL becomes false.
              // F_ALLOW_UNPARATH_NEW may become false.
              itemFlags = (flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0) ? E_TFT : E_TFF;

              result = join(
                  'new',
                  this.generateExpression(expr.callee, Precedence.New, itemFlags)
              );

              if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
                  result.push('(');
                  for (i = 0, iz = length; i < iz; ++i) {
                      result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
                      if (i + 1 < iz) {
                          result.push(',' + space);
                      }
                  }
                  result.push(')');
              }

              return parenthesize(result, Precedence.New, precedence);
          },

          MemberExpression: function (expr, precedence, flags) {
              var result, fragment;

              // F_ALLOW_UNPARATH_NEW becomes false.
              result = [this.generateExpression(expr.object, Precedence.Call, (flags & F_ALLOW_CALL) ? E_TTF : E_TFF)];

              if (expr.computed) {
                  result.push('[');
                  result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
                  result.push(']');
              } else {
                  if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
                      fragment = toSourceNodeWhenNeeded(result).toString();
                      // When the following conditions are all true,
                      //   1. No floating point
                      //   2. Don't have exponents
                      //   3. The last character is a decimal digit
                      //   4. Not hexadecimal OR octal number literal
                      // we should add a floating point.
                      if (
                              fragment.indexOf('.') < 0 &&
                              !/[eExX]/.test(fragment) &&
                              esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
                              !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
                              ) {
                          result.push(' ');
                      }
                  }
                  result.push('.');
                  result.push(generateIdentifier(expr.property));
              }

              return parenthesize(result, Precedence.Member, precedence);
          },

          MetaProperty: function (expr, precedence, flags) {
              var result;
              result = [];
              result.push(typeof expr.meta === "string" ? expr.meta : generateIdentifier(expr.meta));
              result.push('.');
              result.push(typeof expr.property === "string" ? expr.property : generateIdentifier(expr.property));
              return parenthesize(result, Precedence.Member, precedence);
          },

          UnaryExpression: function (expr, precedence, flags) {
              var result, fragment, rightCharCode, leftSource, leftCharCode;
              fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT);

              if (space === '') {
                  result = join(expr.operator, fragment);
              } else {
                  result = [expr.operator];
                  if (expr.operator.length > 2) {
                      // delete, void, typeof
                      // get `typeof []`, not `typeof[]`
                      result = join(result, fragment);
                  } else {
                      // Prevent inserting spaces between operator and argument if it is unnecessary
                      // like, `!cond`
                      leftSource = toSourceNodeWhenNeeded(result).toString();
                      leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
                      rightCharCode = fragment.toString().charCodeAt(0);

                      if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
                              (esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode))) {
                          result.push(noEmptySpace());
                          result.push(fragment);
                      } else {
                          result.push(fragment);
                      }
                  }
              }
              return parenthesize(result, Precedence.Unary, precedence);
          },

          YieldExpression: function (expr, precedence, flags) {
              var result;
              if (expr.delegate) {
                  result = 'yield*';
              } else {
                  result = 'yield';
              }
              if (expr.argument) {
                  result = join(
                      result,
                      this.generateExpression(expr.argument, Precedence.Yield, E_TTT)
                  );
              }
              return parenthesize(result, Precedence.Yield, precedence);
          },

          AwaitExpression: function (expr, precedence, flags) {
              var result = join(
                  expr.all ? 'await*' : 'await',
                  this.generateExpression(expr.argument, Precedence.Await, E_TTT)
              );
              return parenthesize(result, Precedence.Await, precedence);
          },

          UpdateExpression: function (expr, precedence, flags) {
              if (expr.prefix) {
                  return parenthesize(
                      [
                          expr.operator,
                          this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
                      ],
                      Precedence.Unary,
                      precedence
                  );
              }
              return parenthesize(
                  [
                      this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
                      expr.operator
                  ],
                  Precedence.Postfix,
                  precedence
              );
          },

          FunctionExpression: function (expr, precedence, flags) {
              var result = [
                  generateAsyncPrefix(expr, true),
                  'function'
              ];
              if (expr.id) {
                  result.push(generateStarSuffix(expr) || noEmptySpace());
                  result.push(generateIdentifier(expr.id));
              } else {
                  result.push(generateStarSuffix(expr) || space);
              }
              result.push(this.generateFunctionBody(expr));
              return result;
          },

          ArrayPattern: function (expr, precedence, flags) {
              return this.ArrayExpression(expr, precedence, flags, true);
          },

          ArrayExpression: function (expr, precedence, flags, isPattern) {
              var result, multiline, that = this;
              if (!expr.elements.length) {
                  return '[]';
              }
              multiline = isPattern ? false : expr.elements.length > 1;
              result = ['[', multiline ? newline : ''];
              withIndent(function (indent) {
                  var i, iz;
                  for (i = 0, iz = expr.elements.length; i < iz; ++i) {
                      if (!expr.elements[i]) {
                          if (multiline) {
                              result.push(indent);
                          }
                          if (i + 1 === iz) {
                              result.push(',');
                          }
                      } else {
                          result.push(multiline ? indent : '');
                          result.push(that.generateExpression(expr.elements[i], Precedence.Assignment, E_TTT));
                      }
                      if (i + 1 < iz) {
                          result.push(',' + (multiline ? newline : space));
                      }
                  }
              });
              if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                  result.push(newline);
              }
              result.push(multiline ? base : '');
              result.push(']');
              return result;
          },

          RestElement: function(expr, precedence, flags) {
              return '...' + this.generatePattern(expr.argument);
          },

          ClassExpression: function (expr, precedence, flags) {
              var result, fragment;
              result = ['class'];
              if (expr.id) {
                  result = join(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT));
              }
              if (expr.superClass) {
                  fragment = join('extends', this.generateExpression(expr.superClass, Precedence.Unary, E_TTT));
                  result = join(result, fragment);
              }
              result.push(space);
              result.push(this.generateStatement(expr.body, S_TFFT));
              return result;
          },

          MethodDefinition: function (expr, precedence, flags) {
              var result, fragment;
              if (expr['static']) {
                  result = ['static' + space];
              } else {
                  result = [];
              }
              if (expr.kind === 'get' || expr.kind === 'set') {
                  fragment = [
                      join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
                      this.generateFunctionBody(expr.value)
                  ];
              } else {
                  fragment = [
                      generateMethodPrefix(expr),
                      this.generatePropertyKey(expr.key, expr.computed),
                      this.generateFunctionBody(expr.value)
                  ];
              }
              return join(result, fragment);
          },

          Property: function (expr, precedence, flags) {
              if (expr.kind === 'get' || expr.kind === 'set') {
                  return [
                      expr.kind, noEmptySpace(),
                      this.generatePropertyKey(expr.key, expr.computed),
                      this.generateFunctionBody(expr.value)
                  ];
              }

              if (expr.shorthand) {
                  if (expr.value.type === "AssignmentPattern") {
                      return this.AssignmentPattern(expr.value, Precedence.Sequence, E_TTT);
                  }
                  return this.generatePropertyKey(expr.key, expr.computed);
              }

              if (expr.method) {
                  return [
                      generateMethodPrefix(expr),
                      this.generatePropertyKey(expr.key, expr.computed),
                      this.generateFunctionBody(expr.value)
                  ];
              }

              return [
                  this.generatePropertyKey(expr.key, expr.computed),
                  ':' + space,
                  this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
              ];
          },

          ObjectExpression: function (expr, precedence, flags) {
              var multiline, result, fragment, that = this;

              if (!expr.properties.length) {
                  return '{}';
              }
              multiline = expr.properties.length > 1;

              withIndent(function () {
                  fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
              });

              if (!multiline) {
                  // issues 4
                  // Do not transform from
                  //   dejavu.Class.declare({
                  //       method2: function () {}
                  //   });
                  // to
                  //   dejavu.Class.declare({method2: function () {
                  //       }});
                  if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                      return [ '{', space, fragment, space, '}' ];
                  }
              }

              withIndent(function (indent) {
                  var i, iz;
                  result = [ '{', newline, indent, fragment ];

                  if (multiline) {
                      result.push(',' + newline);
                      for (i = 1, iz = expr.properties.length; i < iz; ++i) {
                          result.push(indent);
                          result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
                          if (i + 1 < iz) {
                              result.push(',' + newline);
                          }
                      }
                  }
              });

              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                  result.push(newline);
              }
              result.push(base);
              result.push('}');
              return result;
          },

          AssignmentPattern: function(expr, precedence, flags) {
              return this.generateAssignment(expr.left, expr.right, '=', precedence, flags);
          },

          ObjectPattern: function (expr, precedence, flags) {
              var result, i, iz, multiline, property, that = this;
              if (!expr.properties.length) {
                  return '{}';
              }

              multiline = false;
              if (expr.properties.length === 1) {
                  property = expr.properties[0];
                  if (property.value.type !== Syntax.Identifier) {
                      multiline = true;
                  }
              } else {
                  for (i = 0, iz = expr.properties.length; i < iz; ++i) {
                      property = expr.properties[i];
                      if (!property.shorthand) {
                          multiline = true;
                          break;
                      }
                  }
              }
              result = ['{', multiline ? newline : '' ];

              withIndent(function (indent) {
                  var i, iz;
                  for (i = 0, iz = expr.properties.length; i < iz; ++i) {
                      result.push(multiline ? indent : '');
                      result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
                      if (i + 1 < iz) {
                          result.push(',' + (multiline ? newline : space));
                      }
                  }
              });

              if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                  result.push(newline);
              }
              result.push(multiline ? base : '');
              result.push('}');
              return result;
          },

          ThisExpression: function (expr, precedence, flags) {
              return 'this';
          },

          Super: function (expr, precedence, flags) {
              return 'super';
          },

          Identifier: function (expr, precedence, flags) {
              return generateIdentifier(expr);
          },

          ImportDefaultSpecifier: function (expr, precedence, flags) {
              return generateIdentifier(expr.id || expr.local);
          },

          ImportNamespaceSpecifier: function (expr, precedence, flags) {
              var result = ['*'];
              var id = expr.id || expr.local;
              if (id) {
                  result.push(space + 'as' + noEmptySpace() + generateIdentifier(id));
              }
              return result;
          },

          ImportSpecifier: function (expr, precedence, flags) {
              var imported = expr.imported;
              var result = [ imported.name ];
              var local = expr.local;
              if (local && local.name !== imported.name) {
                  result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(local));
              }
              return result;
          },

          ExportSpecifier: function (expr, precedence, flags) {
              var local = expr.local;
              var result = [ local.name ];
              var exported = expr.exported;
              if (exported && exported.name !== local.name) {
                  result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(exported));
              }
              return result;
          },

          Literal: function (expr, precedence, flags) {
              var raw;
              if (expr.hasOwnProperty('raw') && parse && extra.raw) {
                  try {
                      raw = parse(expr.raw).body[0].expression;
                      if (raw.type === Syntax.Literal) {
                          if (raw.value === expr.value) {
                              return expr.raw;
                          }
                      }
                  } catch (e) {
                      // not use raw property
                  }
              }

              if (expr.regex) {
                return '/' + expr.regex.pattern + '/' + expr.regex.flags;
              }

              if (expr.value === null) {
                  return 'null';
              }

              if (typeof expr.value === 'string') {
                  return escapeString(expr.value);
              }

              if (typeof expr.value === 'number') {
                  return generateNumber(expr.value);
              }

              if (typeof expr.value === 'boolean') {
                  return expr.value ? 'true' : 'false';
              }

              return generateRegExp(expr.value);
          },

          GeneratorExpression: function (expr, precedence, flags) {
              return this.ComprehensionExpression(expr, precedence, flags);
          },

          ComprehensionExpression: function (expr, precedence, flags) {
              // GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
              // Due to https://bugzilla.mozilla.org/show_bug.cgi?id=883468 position of expr.body can differ in Spidermonkey and ES6

              var result, i, iz, fragment, that = this;
              result = (expr.type === Syntax.GeneratorExpression) ? ['('] : ['['];

              if (extra.moz.comprehensionExpressionStartsWithAssignment) {
                  fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
                  result.push(fragment);
              }

              if (expr.blocks) {
                  withIndent(function () {
                      for (i = 0, iz = expr.blocks.length; i < iz; ++i) {
                          fragment = that.generateExpression(expr.blocks[i], Precedence.Sequence, E_TTT);
                          if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                              result = join(result, fragment);
                          } else {
                              result.push(fragment);
                          }
                      }
                  });
              }

              if (expr.filter) {
                  result = join(result, 'if' + space);
                  fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT);
                  result = join(result, [ '(', fragment, ')' ]);
              }

              if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
                  fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);

                  result = join(result, fragment);
              }

              result.push((expr.type === Syntax.GeneratorExpression) ? ')' : ']');
              return result;
          },

          ComprehensionBlock: function (expr, precedence, flags) {
              var fragment;
              if (expr.left.type === Syntax.VariableDeclaration) {
                  fragment = [
                      expr.left.kind, noEmptySpace(),
                      this.generateStatement(expr.left.declarations[0], S_FFFF)
                  ];
              } else {
                  fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT);
              }

              fragment = join(fragment, expr.of ? 'of' : 'in');
              fragment = join(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT));

              return [ 'for' + space + '(', fragment, ')' ];
          },

          SpreadElement: function (expr, precedence, flags) {
              return [
                  '...',
                  this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
              ];
          },

          TaggedTemplateExpression: function (expr, precedence, flags) {
              var itemFlags = E_TTF;
              if (!(flags & F_ALLOW_CALL)) {
                  itemFlags = E_TFF;
              }
              var result = [
                  this.generateExpression(expr.tag, Precedence.Call, itemFlags),
                  this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
              ];
              return parenthesize(result, Precedence.TaggedTemplate, precedence);
          },

          TemplateElement: function (expr, precedence, flags) {
              // Don't use "cooked". Since tagged template can use raw template
              // representation. So if we do so, it breaks the script semantics.
              return expr.value.raw;
          },

          TemplateLiteral: function (expr, precedence, flags) {
              var result, i, iz;
              result = [ '`' ];
              for (i = 0, iz = expr.quasis.length; i < iz; ++i) {
                  result.push(this.generateExpression(expr.quasis[i], Precedence.Primary, E_TTT));
                  if (i + 1 < iz) {
                      result.push('${' + space);
                      result.push(this.generateExpression(expr.expressions[i], Precedence.Sequence, E_TTT));
                      result.push(space + '}');
                  }
              }
              result.push('`');
              return result;
          },

          ModuleSpecifier: function (expr, precedence, flags) {
              return this.Literal(expr, precedence, flags);
          },

          ImportExpression: function(expr, precedence, flag) {
              return parenthesize([
                  'import(',
                  this.generateExpression(expr.source, Precedence.Assignment, E_TTT),
                  ')'
              ], Precedence.Call, precedence);
          },

      };

      merge(CodeGenerator.prototype, CodeGenerator.Expression);

      CodeGenerator.prototype.generateExpression = function (expr, precedence, flags) {
          var result, type;

          type = expr.type || Syntax.Property;

          if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
              return generateVerbatim(expr, precedence);
          }

          result = this[type](expr, precedence, flags);


          if (extra.comment) {
              result = addComments(expr, result);
          }
          return toSourceNodeWhenNeeded(result, expr);
      };

      CodeGenerator.prototype.generateStatement = function (stmt, flags) {
          var result,
              fragment;

          result = this[stmt.type](stmt, flags);

          // Attach comments

          if (extra.comment) {
              result = addComments(stmt, result);
          }

          fragment = toSourceNodeWhenNeeded(result).toString();
          if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
              result = sourceMap$1 ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
          }

          return toSourceNodeWhenNeeded(result, stmt);
      };

      function generateInternal(node) {
          var codegen;

          codegen = new CodeGenerator();
          if (isStatement(node)) {
              return codegen.generateStatement(node, S_TFFF);
          }

          if (isExpression(node)) {
              return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
          }

          throw new Error('Unknown node type: ' + node.type);
      }

      function generate(node, options) {
          var defaultOptions = getDefaultOptions(), result, pair;

          if (options != null) {
              // Obsolete options
              //
              //   `options.indent`
              //   `options.base`
              //
              // Instead of them, we can use `option.format.indent`.
              if (typeof options.indent === 'string') {
                  defaultOptions.format.indent.style = options.indent;
              }
              if (typeof options.base === 'number') {
                  defaultOptions.format.indent.base = options.base;
              }
              options = updateDeeply(defaultOptions, options);
              indent = options.format.indent.style;
              if (typeof options.base === 'string') {
                  base = options.base;
              } else {
                  base = stringRepeat(indent, options.format.indent.base);
              }
          } else {
              options = defaultOptions;
              indent = options.format.indent.style;
              base = stringRepeat(indent, options.format.indent.base);
          }
          json = options.format.json;
          renumber = options.format.renumber;
          hexadecimal = json ? false : options.format.hexadecimal;
          quotes = json ? 'double' : options.format.quotes;
          escapeless = options.format.escapeless;
          newline = options.format.newline;
          space = options.format.space;
          if (options.format.compact) {
              newline = space = indent = base = '';
          }
          parentheses = options.format.parentheses;
          semicolons = options.format.semicolons;
          safeConcatenation = options.format.safeConcatenation;
          directive = options.directive;
          parse = json ? null : options.parse;
          sourceMap$1 = options.sourceMap;
          sourceCode = options.sourceCode;
          preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null;
          extra = options;

          if (sourceMap$1) {
              if (!exports.browser) {
                  // We assume environment is node.js
                  // And prevent from including source-map by browserify
                  SourceNode = sourceMap.SourceNode;
              } else {
                  SourceNode = commonjsGlobal.sourceMap.SourceNode;
              }
          }

          result = generateInternal(node);

          if (!sourceMap$1) {
              pair = {code: result.toString(), map: null};
              return options.sourceMapWithCode ? pair : pair.code;
          }


          pair = result.toStringWithSourceMap({
              file: options.file,
              sourceRoot: options.sourceMapRoot
          });

          if (options.sourceContent) {
              pair.map.setSourceContent(options.sourceMap,
                                        options.sourceContent);
          }

          if (options.sourceMapWithCode) {
              return pair;
          }

          return pair.map.toString();
      }

      FORMAT_MINIFY = {
          indent: {
              style: '',
              base: 0
          },
          renumber: true,
          hexadecimal: true,
          quotes: 'auto',
          escapeless: true,
          compact: true,
          parentheses: false,
          semicolons: false
      };

      FORMAT_DEFAULTS = getDefaultOptions().format;

      exports.version = require$$3.version;
      exports.generate = generate;
      exports.attachComments = estraverse$1.attachComments;
      exports.Precedence = updateDeeply({}, Precedence);
      exports.browser = false;
      exports.FORMAT_MINIFY = FORMAT_MINIFY;
      exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
  }());
  /* vim: set sw=4 ts=4 et tw=80 : */
  });

  var esprima = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
  /* istanbul ignore next */
  	if('object' === 'object' && 'object' === 'object')
  		module.exports = factory();
  	else if(typeof undefined === 'function' && undefined.amd)
  		undefined([], factory);
  /* istanbul ignore next */
  	else if('object' === 'object')
  		exports["esprima"] = factory();
  	else
  		root["esprima"] = factory();
  })(commonjsGlobal, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};

  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {

  /******/ 		// Check if module is in cache
  /* istanbul ignore if */
  /******/ 		if(installedModules[moduleId])
  /******/ 			return installedModules[moduleId].exports;

  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			exports: {},
  /******/ 			id: moduleId,
  /******/ 			loaded: false
  /******/ 		};

  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

  /******/ 		// Flag the module as loaded
  /******/ 		module.loaded = true;

  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}


  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;

  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;

  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";

  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	/*
  	  Copyright JS Foundation and other contributors, https://js.foundation/

  	  Redistribution and use in source and binary forms, with or without
  	  modification, are permitted provided that the following conditions are met:

  	    * Redistributions of source code must retain the above copyright
  	      notice, this list of conditions and the following disclaimer.
  	    * Redistributions in binary form must reproduce the above copyright
  	      notice, this list of conditions and the following disclaimer in the
  	      documentation and/or other materials provided with the distribution.

  	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  	*/
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var comment_handler_1 = __webpack_require__(1);
  	var jsx_parser_1 = __webpack_require__(3);
  	var parser_1 = __webpack_require__(8);
  	var tokenizer_1 = __webpack_require__(15);
  	function parse(code, options, delegate) {
  	    var commentHandler = null;
  	    var proxyDelegate = function (node, metadata) {
  	        if (delegate) {
  	            delegate(node, metadata);
  	        }
  	        if (commentHandler) {
  	            commentHandler.visit(node, metadata);
  	        }
  	    };
  	    var parserDelegate = (typeof delegate === 'function') ? proxyDelegate : null;
  	    var collectComment = false;
  	    if (options) {
  	        collectComment = (typeof options.comment === 'boolean' && options.comment);
  	        var attachComment = (typeof options.attachComment === 'boolean' && options.attachComment);
  	        if (collectComment || attachComment) {
  	            commentHandler = new comment_handler_1.CommentHandler();
  	            commentHandler.attach = attachComment;
  	            options.comment = true;
  	            parserDelegate = proxyDelegate;
  	        }
  	    }
  	    var isModule = false;
  	    if (options && typeof options.sourceType === 'string') {
  	        isModule = (options.sourceType === 'module');
  	    }
  	    var parser;
  	    if (options && typeof options.jsx === 'boolean' && options.jsx) {
  	        parser = new jsx_parser_1.JSXParser(code, options, parserDelegate);
  	    }
  	    else {
  	        parser = new parser_1.Parser(code, options, parserDelegate);
  	    }
  	    var program = isModule ? parser.parseModule() : parser.parseScript();
  	    var ast = program;
  	    if (collectComment && commentHandler) {
  	        ast.comments = commentHandler.comments;
  	    }
  	    if (parser.config.tokens) {
  	        ast.tokens = parser.tokens;
  	    }
  	    if (parser.config.tolerant) {
  	        ast.errors = parser.errorHandler.errors;
  	    }
  	    return ast;
  	}
  	exports.parse = parse;
  	function parseModule(code, options, delegate) {
  	    var parsingOptions = options || {};
  	    parsingOptions.sourceType = 'module';
  	    return parse(code, parsingOptions, delegate);
  	}
  	exports.parseModule = parseModule;
  	function parseScript(code, options, delegate) {
  	    var parsingOptions = options || {};
  	    parsingOptions.sourceType = 'script';
  	    return parse(code, parsingOptions, delegate);
  	}
  	exports.parseScript = parseScript;
  	function tokenize(code, options, delegate) {
  	    var tokenizer = new tokenizer_1.Tokenizer(code, options);
  	    var tokens;
  	    tokens = [];
  	    try {
  	        while (true) {
  	            var token = tokenizer.getNextToken();
  	            if (!token) {
  	                break;
  	            }
  	            if (delegate) {
  	                token = delegate(token);
  	            }
  	            tokens.push(token);
  	        }
  	    }
  	    catch (e) {
  	        tokenizer.errorHandler.tolerate(e);
  	    }
  	    if (tokenizer.errorHandler.tolerant) {
  	        tokens.errors = tokenizer.errors();
  	    }
  	    return tokens;
  	}
  	exports.tokenize = tokenize;
  	var syntax_1 = __webpack_require__(2);
  	exports.Syntax = syntax_1.Syntax;
  	// Sync with *.json manifests.
  	exports.version = '4.0.1';


  /***/ },
  /* 1 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var syntax_1 = __webpack_require__(2);
  	var CommentHandler = (function () {
  	    function CommentHandler() {
  	        this.attach = false;
  	        this.comments = [];
  	        this.stack = [];
  	        this.leading = [];
  	        this.trailing = [];
  	    }
  	    CommentHandler.prototype.insertInnerComments = function (node, metadata) {
  	        //  innnerComments for properties empty block
  	        //  `function a() {/** comments **\/}`
  	        if (node.type === syntax_1.Syntax.BlockStatement && node.body.length === 0) {
  	            var innerComments = [];
  	            for (var i = this.leading.length - 1; i >= 0; --i) {
  	                var entry = this.leading[i];
  	                if (metadata.end.offset >= entry.start) {
  	                    innerComments.unshift(entry.comment);
  	                    this.leading.splice(i, 1);
  	                    this.trailing.splice(i, 1);
  	                }
  	            }
  	            if (innerComments.length) {
  	                node.innerComments = innerComments;
  	            }
  	        }
  	    };
  	    CommentHandler.prototype.findTrailingComments = function (metadata) {
  	        var trailingComments = [];
  	        if (this.trailing.length > 0) {
  	            for (var i = this.trailing.length - 1; i >= 0; --i) {
  	                var entry_1 = this.trailing[i];
  	                if (entry_1.start >= metadata.end.offset) {
  	                    trailingComments.unshift(entry_1.comment);
  	                }
  	            }
  	            this.trailing.length = 0;
  	            return trailingComments;
  	        }
  	        var entry = this.stack[this.stack.length - 1];
  	        if (entry && entry.node.trailingComments) {
  	            var firstComment = entry.node.trailingComments[0];
  	            if (firstComment && firstComment.range[0] >= metadata.end.offset) {
  	                trailingComments = entry.node.trailingComments;
  	                delete entry.node.trailingComments;
  	            }
  	        }
  	        return trailingComments;
  	    };
  	    CommentHandler.prototype.findLeadingComments = function (metadata) {
  	        var leadingComments = [];
  	        var target;
  	        while (this.stack.length > 0) {
  	            var entry = this.stack[this.stack.length - 1];
  	            if (entry && entry.start >= metadata.start.offset) {
  	                target = entry.node;
  	                this.stack.pop();
  	            }
  	            else {
  	                break;
  	            }
  	        }
  	        if (target) {
  	            var count = target.leadingComments ? target.leadingComments.length : 0;
  	            for (var i = count - 1; i >= 0; --i) {
  	                var comment = target.leadingComments[i];
  	                if (comment.range[1] <= metadata.start.offset) {
  	                    leadingComments.unshift(comment);
  	                    target.leadingComments.splice(i, 1);
  	                }
  	            }
  	            if (target.leadingComments && target.leadingComments.length === 0) {
  	                delete target.leadingComments;
  	            }
  	            return leadingComments;
  	        }
  	        for (var i = this.leading.length - 1; i >= 0; --i) {
  	            var entry = this.leading[i];
  	            if (entry.start <= metadata.start.offset) {
  	                leadingComments.unshift(entry.comment);
  	                this.leading.splice(i, 1);
  	            }
  	        }
  	        return leadingComments;
  	    };
  	    CommentHandler.prototype.visitNode = function (node, metadata) {
  	        if (node.type === syntax_1.Syntax.Program && node.body.length > 0) {
  	            return;
  	        }
  	        this.insertInnerComments(node, metadata);
  	        var trailingComments = this.findTrailingComments(metadata);
  	        var leadingComments = this.findLeadingComments(metadata);
  	        if (leadingComments.length > 0) {
  	            node.leadingComments = leadingComments;
  	        }
  	        if (trailingComments.length > 0) {
  	            node.trailingComments = trailingComments;
  	        }
  	        this.stack.push({
  	            node: node,
  	            start: metadata.start.offset
  	        });
  	    };
  	    CommentHandler.prototype.visitComment = function (node, metadata) {
  	        var type = (node.type[0] === 'L') ? 'Line' : 'Block';
  	        var comment = {
  	            type: type,
  	            value: node.value
  	        };
  	        if (node.range) {
  	            comment.range = node.range;
  	        }
  	        if (node.loc) {
  	            comment.loc = node.loc;
  	        }
  	        this.comments.push(comment);
  	        if (this.attach) {
  	            var entry = {
  	                comment: {
  	                    type: type,
  	                    value: node.value,
  	                    range: [metadata.start.offset, metadata.end.offset]
  	                },
  	                start: metadata.start.offset
  	            };
  	            if (node.loc) {
  	                entry.comment.loc = node.loc;
  	            }
  	            node.type = type;
  	            this.leading.push(entry);
  	            this.trailing.push(entry);
  	        }
  	    };
  	    CommentHandler.prototype.visit = function (node, metadata) {
  	        if (node.type === 'LineComment') {
  	            this.visitComment(node, metadata);
  	        }
  	        else if (node.type === 'BlockComment') {
  	            this.visitComment(node, metadata);
  	        }
  	        else if (this.attach) {
  	            this.visitNode(node, metadata);
  	        }
  	    };
  	    return CommentHandler;
  	}());
  	exports.CommentHandler = CommentHandler;


  /***/ },
  /* 2 */
  /***/ function(module, exports) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	exports.Syntax = {
  	    AssignmentExpression: 'AssignmentExpression',
  	    AssignmentPattern: 'AssignmentPattern',
  	    ArrayExpression: 'ArrayExpression',
  	    ArrayPattern: 'ArrayPattern',
  	    ArrowFunctionExpression: 'ArrowFunctionExpression',
  	    AwaitExpression: 'AwaitExpression',
  	    BlockStatement: 'BlockStatement',
  	    BinaryExpression: 'BinaryExpression',
  	    BreakStatement: 'BreakStatement',
  	    CallExpression: 'CallExpression',
  	    CatchClause: 'CatchClause',
  	    ClassBody: 'ClassBody',
  	    ClassDeclaration: 'ClassDeclaration',
  	    ClassExpression: 'ClassExpression',
  	    ConditionalExpression: 'ConditionalExpression',
  	    ContinueStatement: 'ContinueStatement',
  	    DoWhileStatement: 'DoWhileStatement',
  	    DebuggerStatement: 'DebuggerStatement',
  	    EmptyStatement: 'EmptyStatement',
  	    ExportAllDeclaration: 'ExportAllDeclaration',
  	    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  	    ExportNamedDeclaration: 'ExportNamedDeclaration',
  	    ExportSpecifier: 'ExportSpecifier',
  	    ExpressionStatement: 'ExpressionStatement',
  	    ForStatement: 'ForStatement',
  	    ForOfStatement: 'ForOfStatement',
  	    ForInStatement: 'ForInStatement',
  	    FunctionDeclaration: 'FunctionDeclaration',
  	    FunctionExpression: 'FunctionExpression',
  	    Identifier: 'Identifier',
  	    IfStatement: 'IfStatement',
  	    ImportDeclaration: 'ImportDeclaration',
  	    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  	    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
  	    ImportSpecifier: 'ImportSpecifier',
  	    Literal: 'Literal',
  	    LabeledStatement: 'LabeledStatement',
  	    LogicalExpression: 'LogicalExpression',
  	    MemberExpression: 'MemberExpression',
  	    MetaProperty: 'MetaProperty',
  	    MethodDefinition: 'MethodDefinition',
  	    NewExpression: 'NewExpression',
  	    ObjectExpression: 'ObjectExpression',
  	    ObjectPattern: 'ObjectPattern',
  	    Program: 'Program',
  	    Property: 'Property',
  	    RestElement: 'RestElement',
  	    ReturnStatement: 'ReturnStatement',
  	    SequenceExpression: 'SequenceExpression',
  	    SpreadElement: 'SpreadElement',
  	    Super: 'Super',
  	    SwitchCase: 'SwitchCase',
  	    SwitchStatement: 'SwitchStatement',
  	    TaggedTemplateExpression: 'TaggedTemplateExpression',
  	    TemplateElement: 'TemplateElement',
  	    TemplateLiteral: 'TemplateLiteral',
  	    ThisExpression: 'ThisExpression',
  	    ThrowStatement: 'ThrowStatement',
  	    TryStatement: 'TryStatement',
  	    UnaryExpression: 'UnaryExpression',
  	    UpdateExpression: 'UpdateExpression',
  	    VariableDeclaration: 'VariableDeclaration',
  	    VariableDeclarator: 'VariableDeclarator',
  	    WhileStatement: 'WhileStatement',
  	    WithStatement: 'WithStatement',
  	    YieldExpression: 'YieldExpression'
  	};


  /***/ },
  /* 3 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  /* istanbul ignore next */
  	var __extends = (this && this.__extends) || (function () {
  	    var extendStatics = Object.setPrototypeOf ||
  	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
  	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  	    return function (d, b) {
  	        extendStatics(d, b);
  	        function __() { this.constructor = d; }
  	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  	    };
  	})();
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var character_1 = __webpack_require__(4);
  	var JSXNode = __webpack_require__(5);
  	var jsx_syntax_1 = __webpack_require__(6);
  	var Node = __webpack_require__(7);
  	var parser_1 = __webpack_require__(8);
  	var token_1 = __webpack_require__(13);
  	var xhtml_entities_1 = __webpack_require__(14);
  	token_1.TokenName[100 /* Identifier */] = 'JSXIdentifier';
  	token_1.TokenName[101 /* Text */] = 'JSXText';
  	// Fully qualified element name, e.g. <svg:path> returns "svg:path"
  	function getQualifiedElementName(elementName) {
  	    var qualifiedName;
  	    switch (elementName.type) {
  	        case jsx_syntax_1.JSXSyntax.JSXIdentifier:
  	            var id = elementName;
  	            qualifiedName = id.name;
  	            break;
  	        case jsx_syntax_1.JSXSyntax.JSXNamespacedName:
  	            var ns = elementName;
  	            qualifiedName = getQualifiedElementName(ns.namespace) + ':' +
  	                getQualifiedElementName(ns.name);
  	            break;
  	        case jsx_syntax_1.JSXSyntax.JSXMemberExpression:
  	            var expr = elementName;
  	            qualifiedName = getQualifiedElementName(expr.object) + '.' +
  	                getQualifiedElementName(expr.property);
  	            break;
  	        /* istanbul ignore next */
  	        default:
  	            break;
  	    }
  	    return qualifiedName;
  	}
  	var JSXParser = (function (_super) {
  	    __extends(JSXParser, _super);
  	    function JSXParser(code, options, delegate) {
  	        return _super.call(this, code, options, delegate) || this;
  	    }
  	    JSXParser.prototype.parsePrimaryExpression = function () {
  	        return this.match('<') ? this.parseJSXRoot() : _super.prototype.parsePrimaryExpression.call(this);
  	    };
  	    JSXParser.prototype.startJSX = function () {
  	        // Unwind the scanner before the lookahead token.
  	        this.scanner.index = this.startMarker.index;
  	        this.scanner.lineNumber = this.startMarker.line;
  	        this.scanner.lineStart = this.startMarker.index - this.startMarker.column;
  	    };
  	    JSXParser.prototype.finishJSX = function () {
  	        // Prime the next lookahead.
  	        this.nextToken();
  	    };
  	    JSXParser.prototype.reenterJSX = function () {
  	        this.startJSX();
  	        this.expectJSX('}');
  	        // Pop the closing '}' added from the lookahead.
  	        if (this.config.tokens) {
  	            this.tokens.pop();
  	        }
  	    };
  	    JSXParser.prototype.createJSXNode = function () {
  	        this.collectComments();
  	        return {
  	            index: this.scanner.index,
  	            line: this.scanner.lineNumber,
  	            column: this.scanner.index - this.scanner.lineStart
  	        };
  	    };
  	    JSXParser.prototype.createJSXChildNode = function () {
  	        return {
  	            index: this.scanner.index,
  	            line: this.scanner.lineNumber,
  	            column: this.scanner.index - this.scanner.lineStart
  	        };
  	    };
  	    JSXParser.prototype.scanXHTMLEntity = function (quote) {
  	        var result = '&';
  	        var valid = true;
  	        var terminated = false;
  	        var numeric = false;
  	        var hex = false;
  	        while (!this.scanner.eof() && valid && !terminated) {
  	            var ch = this.scanner.source[this.scanner.index];
  	            if (ch === quote) {
  	                break;
  	            }
  	            terminated = (ch === ';');
  	            result += ch;
  	            ++this.scanner.index;
  	            if (!terminated) {
  	                switch (result.length) {
  	                    case 2:
  	                        // e.g. '&#123;'
  	                        numeric = (ch === '#');
  	                        break;
  	                    case 3:
  	                        if (numeric) {
  	                            // e.g. '&#x41;'
  	                            hex = (ch === 'x');
  	                            valid = hex || character_1.Character.isDecimalDigit(ch.charCodeAt(0));
  	                            numeric = numeric && !hex;
  	                        }
  	                        break;
  	                    default:
  	                        valid = valid && !(numeric && !character_1.Character.isDecimalDigit(ch.charCodeAt(0)));
  	                        valid = valid && !(hex && !character_1.Character.isHexDigit(ch.charCodeAt(0)));
  	                        break;
  	                }
  	            }
  	        }
  	        if (valid && terminated && result.length > 2) {
  	            // e.g. '&#x41;' becomes just '#x41'
  	            var str = result.substr(1, result.length - 2);
  	            if (numeric && str.length > 1) {
  	                result = String.fromCharCode(parseInt(str.substr(1), 10));
  	            }
  	            else if (hex && str.length > 2) {
  	                result = String.fromCharCode(parseInt('0' + str.substr(1), 16));
  	            }
  	            else if (!numeric && !hex && xhtml_entities_1.XHTMLEntities[str]) {
  	                result = xhtml_entities_1.XHTMLEntities[str];
  	            }
  	        }
  	        return result;
  	    };
  	    // Scan the next JSX token. This replaces Scanner#lex when in JSX mode.
  	    JSXParser.prototype.lexJSX = function () {
  	        var cp = this.scanner.source.charCodeAt(this.scanner.index);
  	        // < > / : = { }
  	        if (cp === 60 || cp === 62 || cp === 47 || cp === 58 || cp === 61 || cp === 123 || cp === 125) {
  	            var value = this.scanner.source[this.scanner.index++];
  	            return {
  	                type: 7 /* Punctuator */,
  	                value: value,
  	                lineNumber: this.scanner.lineNumber,
  	                lineStart: this.scanner.lineStart,
  	                start: this.scanner.index - 1,
  	                end: this.scanner.index
  	            };
  	        }
  	        // " '
  	        if (cp === 34 || cp === 39) {
  	            var start = this.scanner.index;
  	            var quote = this.scanner.source[this.scanner.index++];
  	            var str = '';
  	            while (!this.scanner.eof()) {
  	                var ch = this.scanner.source[this.scanner.index++];
  	                if (ch === quote) {
  	                    break;
  	                }
  	                else if (ch === '&') {
  	                    str += this.scanXHTMLEntity(quote);
  	                }
  	                else {
  	                    str += ch;
  	                }
  	            }
  	            return {
  	                type: 8 /* StringLiteral */,
  	                value: str,
  	                lineNumber: this.scanner.lineNumber,
  	                lineStart: this.scanner.lineStart,
  	                start: start,
  	                end: this.scanner.index
  	            };
  	        }
  	        // ... or .
  	        if (cp === 46) {
  	            var n1 = this.scanner.source.charCodeAt(this.scanner.index + 1);
  	            var n2 = this.scanner.source.charCodeAt(this.scanner.index + 2);
  	            var value = (n1 === 46 && n2 === 46) ? '...' : '.';
  	            var start = this.scanner.index;
  	            this.scanner.index += value.length;
  	            return {
  	                type: 7 /* Punctuator */,
  	                value: value,
  	                lineNumber: this.scanner.lineNumber,
  	                lineStart: this.scanner.lineStart,
  	                start: start,
  	                end: this.scanner.index
  	            };
  	        }
  	        // `
  	        if (cp === 96) {
  	            // Only placeholder, since it will be rescanned as a real assignment expression.
  	            return {
  	                type: 10 /* Template */,
  	                value: '',
  	                lineNumber: this.scanner.lineNumber,
  	                lineStart: this.scanner.lineStart,
  	                start: this.scanner.index,
  	                end: this.scanner.index
  	            };
  	        }
  	        // Identifer can not contain backslash (char code 92).
  	        if (character_1.Character.isIdentifierStart(cp) && (cp !== 92)) {
  	            var start = this.scanner.index;
  	            ++this.scanner.index;
  	            while (!this.scanner.eof()) {
  	                var ch = this.scanner.source.charCodeAt(this.scanner.index);
  	                if (character_1.Character.isIdentifierPart(ch) && (ch !== 92)) {
  	                    ++this.scanner.index;
  	                }
  	                else if (ch === 45) {
  	                    // Hyphen (char code 45) can be part of an identifier.
  	                    ++this.scanner.index;
  	                }
  	                else {
  	                    break;
  	                }
  	            }
  	            var id = this.scanner.source.slice(start, this.scanner.index);
  	            return {
  	                type: 100 /* Identifier */,
  	                value: id,
  	                lineNumber: this.scanner.lineNumber,
  	                lineStart: this.scanner.lineStart,
  	                start: start,
  	                end: this.scanner.index
  	            };
  	        }
  	        return this.scanner.lex();
  	    };
  	    JSXParser.prototype.nextJSXToken = function () {
  	        this.collectComments();
  	        this.startMarker.index = this.scanner.index;
  	        this.startMarker.line = this.scanner.lineNumber;
  	        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
  	        var token = this.lexJSX();
  	        this.lastMarker.index = this.scanner.index;
  	        this.lastMarker.line = this.scanner.lineNumber;
  	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
  	        if (this.config.tokens) {
  	            this.tokens.push(this.convertToken(token));
  	        }
  	        return token;
  	    };
  	    JSXParser.prototype.nextJSXText = function () {
  	        this.startMarker.index = this.scanner.index;
  	        this.startMarker.line = this.scanner.lineNumber;
  	        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
  	        var start = this.scanner.index;
  	        var text = '';
  	        while (!this.scanner.eof()) {
  	            var ch = this.scanner.source[this.scanner.index];
  	            if (ch === '{' || ch === '<') {
  	                break;
  	            }
  	            ++this.scanner.index;
  	            text += ch;
  	            if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                ++this.scanner.lineNumber;
  	                if (ch === '\r' && this.scanner.source[this.scanner.index] === '\n') {
  	                    ++this.scanner.index;
  	                }
  	                this.scanner.lineStart = this.scanner.index;
  	            }
  	        }
  	        this.lastMarker.index = this.scanner.index;
  	        this.lastMarker.line = this.scanner.lineNumber;
  	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
  	        var token = {
  	            type: 101 /* Text */,
  	            value: text,
  	            lineNumber: this.scanner.lineNumber,
  	            lineStart: this.scanner.lineStart,
  	            start: start,
  	            end: this.scanner.index
  	        };
  	        if ((text.length > 0) && this.config.tokens) {
  	            this.tokens.push(this.convertToken(token));
  	        }
  	        return token;
  	    };
  	    JSXParser.prototype.peekJSXToken = function () {
  	        var state = this.scanner.saveState();
  	        this.scanner.scanComments();
  	        var next = this.lexJSX();
  	        this.scanner.restoreState(state);
  	        return next;
  	    };
  	    // Expect the next JSX token to match the specified punctuator.
  	    // If not, an exception will be thrown.
  	    JSXParser.prototype.expectJSX = function (value) {
  	        var token = this.nextJSXToken();
  	        if (token.type !== 7 /* Punctuator */ || token.value !== value) {
  	            this.throwUnexpectedToken(token);
  	        }
  	    };
  	    // Return true if the next JSX token matches the specified punctuator.
  	    JSXParser.prototype.matchJSX = function (value) {
  	        var next = this.peekJSXToken();
  	        return next.type === 7 /* Punctuator */ && next.value === value;
  	    };
  	    JSXParser.prototype.parseJSXIdentifier = function () {
  	        var node = this.createJSXNode();
  	        var token = this.nextJSXToken();
  	        if (token.type !== 100 /* Identifier */) {
  	            this.throwUnexpectedToken(token);
  	        }
  	        return this.finalize(node, new JSXNode.JSXIdentifier(token.value));
  	    };
  	    JSXParser.prototype.parseJSXElementName = function () {
  	        var node = this.createJSXNode();
  	        var elementName = this.parseJSXIdentifier();
  	        if (this.matchJSX(':')) {
  	            var namespace = elementName;
  	            this.expectJSX(':');
  	            var name_1 = this.parseJSXIdentifier();
  	            elementName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_1));
  	        }
  	        else if (this.matchJSX('.')) {
  	            while (this.matchJSX('.')) {
  	                var object = elementName;
  	                this.expectJSX('.');
  	                var property = this.parseJSXIdentifier();
  	                elementName = this.finalize(node, new JSXNode.JSXMemberExpression(object, property));
  	            }
  	        }
  	        return elementName;
  	    };
  	    JSXParser.prototype.parseJSXAttributeName = function () {
  	        var node = this.createJSXNode();
  	        var attributeName;
  	        var identifier = this.parseJSXIdentifier();
  	        if (this.matchJSX(':')) {
  	            var namespace = identifier;
  	            this.expectJSX(':');
  	            var name_2 = this.parseJSXIdentifier();
  	            attributeName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_2));
  	        }
  	        else {
  	            attributeName = identifier;
  	        }
  	        return attributeName;
  	    };
  	    JSXParser.prototype.parseJSXStringLiteralAttribute = function () {
  	        var node = this.createJSXNode();
  	        var token = this.nextJSXToken();
  	        if (token.type !== 8 /* StringLiteral */) {
  	            this.throwUnexpectedToken(token);
  	        }
  	        var raw = this.getTokenRaw(token);
  	        return this.finalize(node, new Node.Literal(token.value, raw));
  	    };
  	    JSXParser.prototype.parseJSXExpressionAttribute = function () {
  	        var node = this.createJSXNode();
  	        this.expectJSX('{');
  	        this.finishJSX();
  	        if (this.match('}')) {
  	            this.tolerateError('JSX attributes must only be assigned a non-empty expression');
  	        }
  	        var expression = this.parseAssignmentExpression();
  	        this.reenterJSX();
  	        return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
  	    };
  	    JSXParser.prototype.parseJSXAttributeValue = function () {
  	        return this.matchJSX('{') ? this.parseJSXExpressionAttribute() :
  	            this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
  	    };
  	    JSXParser.prototype.parseJSXNameValueAttribute = function () {
  	        var node = this.createJSXNode();
  	        var name = this.parseJSXAttributeName();
  	        var value = null;
  	        if (this.matchJSX('=')) {
  	            this.expectJSX('=');
  	            value = this.parseJSXAttributeValue();
  	        }
  	        return this.finalize(node, new JSXNode.JSXAttribute(name, value));
  	    };
  	    JSXParser.prototype.parseJSXSpreadAttribute = function () {
  	        var node = this.createJSXNode();
  	        this.expectJSX('{');
  	        this.expectJSX('...');
  	        this.finishJSX();
  	        var argument = this.parseAssignmentExpression();
  	        this.reenterJSX();
  	        return this.finalize(node, new JSXNode.JSXSpreadAttribute(argument));
  	    };
  	    JSXParser.prototype.parseJSXAttributes = function () {
  	        var attributes = [];
  	        while (!this.matchJSX('/') && !this.matchJSX('>')) {
  	            var attribute = this.matchJSX('{') ? this.parseJSXSpreadAttribute() :
  	                this.parseJSXNameValueAttribute();
  	            attributes.push(attribute);
  	        }
  	        return attributes;
  	    };
  	    JSXParser.prototype.parseJSXOpeningElement = function () {
  	        var node = this.createJSXNode();
  	        this.expectJSX('<');
  	        var name = this.parseJSXElementName();
  	        var attributes = this.parseJSXAttributes();
  	        var selfClosing = this.matchJSX('/');
  	        if (selfClosing) {
  	            this.expectJSX('/');
  	        }
  	        this.expectJSX('>');
  	        return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
  	    };
  	    JSXParser.prototype.parseJSXBoundaryElement = function () {
  	        var node = this.createJSXNode();
  	        this.expectJSX('<');
  	        if (this.matchJSX('/')) {
  	            this.expectJSX('/');
  	            var name_3 = this.parseJSXElementName();
  	            this.expectJSX('>');
  	            return this.finalize(node, new JSXNode.JSXClosingElement(name_3));
  	        }
  	        var name = this.parseJSXElementName();
  	        var attributes = this.parseJSXAttributes();
  	        var selfClosing = this.matchJSX('/');
  	        if (selfClosing) {
  	            this.expectJSX('/');
  	        }
  	        this.expectJSX('>');
  	        return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
  	    };
  	    JSXParser.prototype.parseJSXEmptyExpression = function () {
  	        var node = this.createJSXChildNode();
  	        this.collectComments();
  	        this.lastMarker.index = this.scanner.index;
  	        this.lastMarker.line = this.scanner.lineNumber;
  	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
  	        return this.finalize(node, new JSXNode.JSXEmptyExpression());
  	    };
  	    JSXParser.prototype.parseJSXExpressionContainer = function () {
  	        var node = this.createJSXNode();
  	        this.expectJSX('{');
  	        var expression;
  	        if (this.matchJSX('}')) {
  	            expression = this.parseJSXEmptyExpression();
  	            this.expectJSX('}');
  	        }
  	        else {
  	            this.finishJSX();
  	            expression = this.parseAssignmentExpression();
  	            this.reenterJSX();
  	        }
  	        return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
  	    };
  	    JSXParser.prototype.parseJSXChildren = function () {
  	        var children = [];
  	        while (!this.scanner.eof()) {
  	            var node = this.createJSXChildNode();
  	            var token = this.nextJSXText();
  	            if (token.start < token.end) {
  	                var raw = this.getTokenRaw(token);
  	                var child = this.finalize(node, new JSXNode.JSXText(token.value, raw));
  	                children.push(child);
  	            }
  	            if (this.scanner.source[this.scanner.index] === '{') {
  	                var container = this.parseJSXExpressionContainer();
  	                children.push(container);
  	            }
  	            else {
  	                break;
  	            }
  	        }
  	        return children;
  	    };
  	    JSXParser.prototype.parseComplexJSXElement = function (el) {
  	        var stack = [];
  	        while (!this.scanner.eof()) {
  	            el.children = el.children.concat(this.parseJSXChildren());
  	            var node = this.createJSXChildNode();
  	            var element = this.parseJSXBoundaryElement();
  	            if (element.type === jsx_syntax_1.JSXSyntax.JSXOpeningElement) {
  	                var opening = element;
  	                if (opening.selfClosing) {
  	                    var child = this.finalize(node, new JSXNode.JSXElement(opening, [], null));
  	                    el.children.push(child);
  	                }
  	                else {
  	                    stack.push(el);
  	                    el = { node: node, opening: opening, closing: null, children: [] };
  	                }
  	            }
  	            if (element.type === jsx_syntax_1.JSXSyntax.JSXClosingElement) {
  	                el.closing = element;
  	                var open_1 = getQualifiedElementName(el.opening.name);
  	                var close_1 = getQualifiedElementName(el.closing.name);
  	                if (open_1 !== close_1) {
  	                    this.tolerateError('Expected corresponding JSX closing tag for %0', open_1);
  	                }
  	                if (stack.length > 0) {
  	                    var child = this.finalize(el.node, new JSXNode.JSXElement(el.opening, el.children, el.closing));
  	                    el = stack[stack.length - 1];
  	                    el.children.push(child);
  	                    stack.pop();
  	                }
  	                else {
  	                    break;
  	                }
  	            }
  	        }
  	        return el;
  	    };
  	    JSXParser.prototype.parseJSXElement = function () {
  	        var node = this.createJSXNode();
  	        var opening = this.parseJSXOpeningElement();
  	        var children = [];
  	        var closing = null;
  	        if (!opening.selfClosing) {
  	            var el = this.parseComplexJSXElement({ node: node, opening: opening, closing: closing, children: children });
  	            children = el.children;
  	            closing = el.closing;
  	        }
  	        return this.finalize(node, new JSXNode.JSXElement(opening, children, closing));
  	    };
  	    JSXParser.prototype.parseJSXRoot = function () {
  	        // Pop the opening '<' added from the lookahead.
  	        if (this.config.tokens) {
  	            this.tokens.pop();
  	        }
  	        this.startJSX();
  	        var element = this.parseJSXElement();
  	        this.finishJSX();
  	        return element;
  	    };
  	    JSXParser.prototype.isStartOfExpression = function () {
  	        return _super.prototype.isStartOfExpression.call(this) || this.match('<');
  	    };
  	    return JSXParser;
  	}(parser_1.Parser));
  	exports.JSXParser = JSXParser;


  /***/ },
  /* 4 */
  /***/ function(module, exports) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	// See also tools/generate-unicode-regex.js.
  	var Regex = {
  	    // Unicode v8.0.0 NonAsciiIdentifierStart:
  	    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
  	    // Unicode v8.0.0 NonAsciiIdentifierPart:
  	    NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
  	};
  	exports.Character = {
  	    /* tslint:disable:no-bitwise */
  	    fromCodePoint: function (cp) {
  	        return (cp < 0x10000) ? String.fromCharCode(cp) :
  	            String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
  	                String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
  	    },
  	    // https://tc39.github.io/ecma262/#sec-white-space
  	    isWhiteSpace: function (cp) {
  	        return (cp === 0x20) || (cp === 0x09) || (cp === 0x0B) || (cp === 0x0C) || (cp === 0xA0) ||
  	            (cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0);
  	    },
  	    // https://tc39.github.io/ecma262/#sec-line-terminators
  	    isLineTerminator: function (cp) {
  	        return (cp === 0x0A) || (cp === 0x0D) || (cp === 0x2028) || (cp === 0x2029);
  	    },
  	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
  	    isIdentifierStart: function (cp) {
  	        return (cp === 0x24) || (cp === 0x5F) ||
  	            (cp >= 0x41 && cp <= 0x5A) ||
  	            (cp >= 0x61 && cp <= 0x7A) ||
  	            (cp === 0x5C) ||
  	            ((cp >= 0x80) && Regex.NonAsciiIdentifierStart.test(exports.Character.fromCodePoint(cp)));
  	    },
  	    isIdentifierPart: function (cp) {
  	        return (cp === 0x24) || (cp === 0x5F) ||
  	            (cp >= 0x41 && cp <= 0x5A) ||
  	            (cp >= 0x61 && cp <= 0x7A) ||
  	            (cp >= 0x30 && cp <= 0x39) ||
  	            (cp === 0x5C) ||
  	            ((cp >= 0x80) && Regex.NonAsciiIdentifierPart.test(exports.Character.fromCodePoint(cp)));
  	    },
  	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
  	    isDecimalDigit: function (cp) {
  	        return (cp >= 0x30 && cp <= 0x39); // 0..9
  	    },
  	    isHexDigit: function (cp) {
  	        return (cp >= 0x30 && cp <= 0x39) ||
  	            (cp >= 0x41 && cp <= 0x46) ||
  	            (cp >= 0x61 && cp <= 0x66); // a..f
  	    },
  	    isOctalDigit: function (cp) {
  	        return (cp >= 0x30 && cp <= 0x37); // 0..7
  	    }
  	};


  /***/ },
  /* 5 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var jsx_syntax_1 = __webpack_require__(6);
  	/* tslint:disable:max-classes-per-file */
  	var JSXClosingElement = (function () {
  	    function JSXClosingElement(name) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXClosingElement;
  	        this.name = name;
  	    }
  	    return JSXClosingElement;
  	}());
  	exports.JSXClosingElement = JSXClosingElement;
  	var JSXElement = (function () {
  	    function JSXElement(openingElement, children, closingElement) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXElement;
  	        this.openingElement = openingElement;
  	        this.children = children;
  	        this.closingElement = closingElement;
  	    }
  	    return JSXElement;
  	}());
  	exports.JSXElement = JSXElement;
  	var JSXEmptyExpression = (function () {
  	    function JSXEmptyExpression() {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXEmptyExpression;
  	    }
  	    return JSXEmptyExpression;
  	}());
  	exports.JSXEmptyExpression = JSXEmptyExpression;
  	var JSXExpressionContainer = (function () {
  	    function JSXExpressionContainer(expression) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXExpressionContainer;
  	        this.expression = expression;
  	    }
  	    return JSXExpressionContainer;
  	}());
  	exports.JSXExpressionContainer = JSXExpressionContainer;
  	var JSXIdentifier = (function () {
  	    function JSXIdentifier(name) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXIdentifier;
  	        this.name = name;
  	    }
  	    return JSXIdentifier;
  	}());
  	exports.JSXIdentifier = JSXIdentifier;
  	var JSXMemberExpression = (function () {
  	    function JSXMemberExpression(object, property) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXMemberExpression;
  	        this.object = object;
  	        this.property = property;
  	    }
  	    return JSXMemberExpression;
  	}());
  	exports.JSXMemberExpression = JSXMemberExpression;
  	var JSXAttribute = (function () {
  	    function JSXAttribute(name, value) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXAttribute;
  	        this.name = name;
  	        this.value = value;
  	    }
  	    return JSXAttribute;
  	}());
  	exports.JSXAttribute = JSXAttribute;
  	var JSXNamespacedName = (function () {
  	    function JSXNamespacedName(namespace, name) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXNamespacedName;
  	        this.namespace = namespace;
  	        this.name = name;
  	    }
  	    return JSXNamespacedName;
  	}());
  	exports.JSXNamespacedName = JSXNamespacedName;
  	var JSXOpeningElement = (function () {
  	    function JSXOpeningElement(name, selfClosing, attributes) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXOpeningElement;
  	        this.name = name;
  	        this.selfClosing = selfClosing;
  	        this.attributes = attributes;
  	    }
  	    return JSXOpeningElement;
  	}());
  	exports.JSXOpeningElement = JSXOpeningElement;
  	var JSXSpreadAttribute = (function () {
  	    function JSXSpreadAttribute(argument) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXSpreadAttribute;
  	        this.argument = argument;
  	    }
  	    return JSXSpreadAttribute;
  	}());
  	exports.JSXSpreadAttribute = JSXSpreadAttribute;
  	var JSXText = (function () {
  	    function JSXText(value, raw) {
  	        this.type = jsx_syntax_1.JSXSyntax.JSXText;
  	        this.value = value;
  	        this.raw = raw;
  	    }
  	    return JSXText;
  	}());
  	exports.JSXText = JSXText;


  /***/ },
  /* 6 */
  /***/ function(module, exports) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	exports.JSXSyntax = {
  	    JSXAttribute: 'JSXAttribute',
  	    JSXClosingElement: 'JSXClosingElement',
  	    JSXElement: 'JSXElement',
  	    JSXEmptyExpression: 'JSXEmptyExpression',
  	    JSXExpressionContainer: 'JSXExpressionContainer',
  	    JSXIdentifier: 'JSXIdentifier',
  	    JSXMemberExpression: 'JSXMemberExpression',
  	    JSXNamespacedName: 'JSXNamespacedName',
  	    JSXOpeningElement: 'JSXOpeningElement',
  	    JSXSpreadAttribute: 'JSXSpreadAttribute',
  	    JSXText: 'JSXText'
  	};


  /***/ },
  /* 7 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var syntax_1 = __webpack_require__(2);
  	/* tslint:disable:max-classes-per-file */
  	var ArrayExpression = (function () {
  	    function ArrayExpression(elements) {
  	        this.type = syntax_1.Syntax.ArrayExpression;
  	        this.elements = elements;
  	    }
  	    return ArrayExpression;
  	}());
  	exports.ArrayExpression = ArrayExpression;
  	var ArrayPattern = (function () {
  	    function ArrayPattern(elements) {
  	        this.type = syntax_1.Syntax.ArrayPattern;
  	        this.elements = elements;
  	    }
  	    return ArrayPattern;
  	}());
  	exports.ArrayPattern = ArrayPattern;
  	var ArrowFunctionExpression = (function () {
  	    function ArrowFunctionExpression(params, body, expression) {
  	        this.type = syntax_1.Syntax.ArrowFunctionExpression;
  	        this.id = null;
  	        this.params = params;
  	        this.body = body;
  	        this.generator = false;
  	        this.expression = expression;
  	        this.async = false;
  	    }
  	    return ArrowFunctionExpression;
  	}());
  	exports.ArrowFunctionExpression = ArrowFunctionExpression;
  	var AssignmentExpression = (function () {
  	    function AssignmentExpression(operator, left, right) {
  	        this.type = syntax_1.Syntax.AssignmentExpression;
  	        this.operator = operator;
  	        this.left = left;
  	        this.right = right;
  	    }
  	    return AssignmentExpression;
  	}());
  	exports.AssignmentExpression = AssignmentExpression;
  	var AssignmentPattern = (function () {
  	    function AssignmentPattern(left, right) {
  	        this.type = syntax_1.Syntax.AssignmentPattern;
  	        this.left = left;
  	        this.right = right;
  	    }
  	    return AssignmentPattern;
  	}());
  	exports.AssignmentPattern = AssignmentPattern;
  	var AsyncArrowFunctionExpression = (function () {
  	    function AsyncArrowFunctionExpression(params, body, expression) {
  	        this.type = syntax_1.Syntax.ArrowFunctionExpression;
  	        this.id = null;
  	        this.params = params;
  	        this.body = body;
  	        this.generator = false;
  	        this.expression = expression;
  	        this.async = true;
  	    }
  	    return AsyncArrowFunctionExpression;
  	}());
  	exports.AsyncArrowFunctionExpression = AsyncArrowFunctionExpression;
  	var AsyncFunctionDeclaration = (function () {
  	    function AsyncFunctionDeclaration(id, params, body) {
  	        this.type = syntax_1.Syntax.FunctionDeclaration;
  	        this.id = id;
  	        this.params = params;
  	        this.body = body;
  	        this.generator = false;
  	        this.expression = false;
  	        this.async = true;
  	    }
  	    return AsyncFunctionDeclaration;
  	}());
  	exports.AsyncFunctionDeclaration = AsyncFunctionDeclaration;
  	var AsyncFunctionExpression = (function () {
  	    function AsyncFunctionExpression(id, params, body) {
  	        this.type = syntax_1.Syntax.FunctionExpression;
  	        this.id = id;
  	        this.params = params;
  	        this.body = body;
  	        this.generator = false;
  	        this.expression = false;
  	        this.async = true;
  	    }
  	    return AsyncFunctionExpression;
  	}());
  	exports.AsyncFunctionExpression = AsyncFunctionExpression;
  	var AwaitExpression = (function () {
  	    function AwaitExpression(argument) {
  	        this.type = syntax_1.Syntax.AwaitExpression;
  	        this.argument = argument;
  	    }
  	    return AwaitExpression;
  	}());
  	exports.AwaitExpression = AwaitExpression;
  	var BinaryExpression = (function () {
  	    function BinaryExpression(operator, left, right) {
  	        var logical = (operator === '||' || operator === '&&');
  	        this.type = logical ? syntax_1.Syntax.LogicalExpression : syntax_1.Syntax.BinaryExpression;
  	        this.operator = operator;
  	        this.left = left;
  	        this.right = right;
  	    }
  	    return BinaryExpression;
  	}());
  	exports.BinaryExpression = BinaryExpression;
  	var BlockStatement = (function () {
  	    function BlockStatement(body) {
  	        this.type = syntax_1.Syntax.BlockStatement;
  	        this.body = body;
  	    }
  	    return BlockStatement;
  	}());
  	exports.BlockStatement = BlockStatement;
  	var BreakStatement = (function () {
  	    function BreakStatement(label) {
  	        this.type = syntax_1.Syntax.BreakStatement;
  	        this.label = label;
  	    }
  	    return BreakStatement;
  	}());
  	exports.BreakStatement = BreakStatement;
  	var CallExpression = (function () {
  	    function CallExpression(callee, args) {
  	        this.type = syntax_1.Syntax.CallExpression;
  	        this.callee = callee;
  	        this.arguments = args;
  	    }
  	    return CallExpression;
  	}());
  	exports.CallExpression = CallExpression;
  	var CatchClause = (function () {
  	    function CatchClause(param, body) {
  	        this.type = syntax_1.Syntax.CatchClause;
  	        this.param = param;
  	        this.body = body;
  	    }
  	    return CatchClause;
  	}());
  	exports.CatchClause = CatchClause;
  	var ClassBody = (function () {
  	    function ClassBody(body) {
  	        this.type = syntax_1.Syntax.ClassBody;
  	        this.body = body;
  	    }
  	    return ClassBody;
  	}());
  	exports.ClassBody = ClassBody;
  	var ClassDeclaration = (function () {
  	    function ClassDeclaration(id, superClass, body) {
  	        this.type = syntax_1.Syntax.ClassDeclaration;
  	        this.id = id;
  	        this.superClass = superClass;
  	        this.body = body;
  	    }
  	    return ClassDeclaration;
  	}());
  	exports.ClassDeclaration = ClassDeclaration;
  	var ClassExpression = (function () {
  	    function ClassExpression(id, superClass, body) {
  	        this.type = syntax_1.Syntax.ClassExpression;
  	        this.id = id;
  	        this.superClass = superClass;
  	        this.body = body;
  	    }
  	    return ClassExpression;
  	}());
  	exports.ClassExpression = ClassExpression;
  	var ComputedMemberExpression = (function () {
  	    function ComputedMemberExpression(object, property) {
  	        this.type = syntax_1.Syntax.MemberExpression;
  	        this.computed = true;
  	        this.object = object;
  	        this.property = property;
  	    }
  	    return ComputedMemberExpression;
  	}());
  	exports.ComputedMemberExpression = ComputedMemberExpression;
  	var ConditionalExpression = (function () {
  	    function ConditionalExpression(test, consequent, alternate) {
  	        this.type = syntax_1.Syntax.ConditionalExpression;
  	        this.test = test;
  	        this.consequent = consequent;
  	        this.alternate = alternate;
  	    }
  	    return ConditionalExpression;
  	}());
  	exports.ConditionalExpression = ConditionalExpression;
  	var ContinueStatement = (function () {
  	    function ContinueStatement(label) {
  	        this.type = syntax_1.Syntax.ContinueStatement;
  	        this.label = label;
  	    }
  	    return ContinueStatement;
  	}());
  	exports.ContinueStatement = ContinueStatement;
  	var DebuggerStatement = (function () {
  	    function DebuggerStatement() {
  	        this.type = syntax_1.Syntax.DebuggerStatement;
  	    }
  	    return DebuggerStatement;
  	}());
  	exports.DebuggerStatement = DebuggerStatement;
  	var Directive = (function () {
  	    function Directive(expression, directive) {
  	        this.type = syntax_1.Syntax.ExpressionStatement;
  	        this.expression = expression;
  	        this.directive = directive;
  	    }
  	    return Directive;
  	}());
  	exports.Directive = Directive;
  	var DoWhileStatement = (function () {
  	    function DoWhileStatement(body, test) {
  	        this.type = syntax_1.Syntax.DoWhileStatement;
  	        this.body = body;
  	        this.test = test;
  	    }
  	    return DoWhileStatement;
  	}());
  	exports.DoWhileStatement = DoWhileStatement;
  	var EmptyStatement = (function () {
  	    function EmptyStatement() {
  	        this.type = syntax_1.Syntax.EmptyStatement;
  	    }
  	    return EmptyStatement;
  	}());
  	exports.EmptyStatement = EmptyStatement;
  	var ExportAllDeclaration = (function () {
  	    function ExportAllDeclaration(source) {
  	        this.type = syntax_1.Syntax.ExportAllDeclaration;
  	        this.source = source;
  	    }
  	    return ExportAllDeclaration;
  	}());
  	exports.ExportAllDeclaration = ExportAllDeclaration;
  	var ExportDefaultDeclaration = (function () {
  	    function ExportDefaultDeclaration(declaration) {
  	        this.type = syntax_1.Syntax.ExportDefaultDeclaration;
  	        this.declaration = declaration;
  	    }
  	    return ExportDefaultDeclaration;
  	}());
  	exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
  	var ExportNamedDeclaration = (function () {
  	    function ExportNamedDeclaration(declaration, specifiers, source) {
  	        this.type = syntax_1.Syntax.ExportNamedDeclaration;
  	        this.declaration = declaration;
  	        this.specifiers = specifiers;
  	        this.source = source;
  	    }
  	    return ExportNamedDeclaration;
  	}());
  	exports.ExportNamedDeclaration = ExportNamedDeclaration;
  	var ExportSpecifier = (function () {
  	    function ExportSpecifier(local, exported) {
  	        this.type = syntax_1.Syntax.ExportSpecifier;
  	        this.exported = exported;
  	        this.local = local;
  	    }
  	    return ExportSpecifier;
  	}());
  	exports.ExportSpecifier = ExportSpecifier;
  	var ExpressionStatement = (function () {
  	    function ExpressionStatement(expression) {
  	        this.type = syntax_1.Syntax.ExpressionStatement;
  	        this.expression = expression;
  	    }
  	    return ExpressionStatement;
  	}());
  	exports.ExpressionStatement = ExpressionStatement;
  	var ForInStatement = (function () {
  	    function ForInStatement(left, right, body) {
  	        this.type = syntax_1.Syntax.ForInStatement;
  	        this.left = left;
  	        this.right = right;
  	        this.body = body;
  	        this.each = false;
  	    }
  	    return ForInStatement;
  	}());
  	exports.ForInStatement = ForInStatement;
  	var ForOfStatement = (function () {
  	    function ForOfStatement(left, right, body) {
  	        this.type = syntax_1.Syntax.ForOfStatement;
  	        this.left = left;
  	        this.right = right;
  	        this.body = body;
  	    }
  	    return ForOfStatement;
  	}());
  	exports.ForOfStatement = ForOfStatement;
  	var ForStatement = (function () {
  	    function ForStatement(init, test, update, body) {
  	        this.type = syntax_1.Syntax.ForStatement;
  	        this.init = init;
  	        this.test = test;
  	        this.update = update;
  	        this.body = body;
  	    }
  	    return ForStatement;
  	}());
  	exports.ForStatement = ForStatement;
  	var FunctionDeclaration = (function () {
  	    function FunctionDeclaration(id, params, body, generator) {
  	        this.type = syntax_1.Syntax.FunctionDeclaration;
  	        this.id = id;
  	        this.params = params;
  	        this.body = body;
  	        this.generator = generator;
  	        this.expression = false;
  	        this.async = false;
  	    }
  	    return FunctionDeclaration;
  	}());
  	exports.FunctionDeclaration = FunctionDeclaration;
  	var FunctionExpression = (function () {
  	    function FunctionExpression(id, params, body, generator) {
  	        this.type = syntax_1.Syntax.FunctionExpression;
  	        this.id = id;
  	        this.params = params;
  	        this.body = body;
  	        this.generator = generator;
  	        this.expression = false;
  	        this.async = false;
  	    }
  	    return FunctionExpression;
  	}());
  	exports.FunctionExpression = FunctionExpression;
  	var Identifier = (function () {
  	    function Identifier(name) {
  	        this.type = syntax_1.Syntax.Identifier;
  	        this.name = name;
  	    }
  	    return Identifier;
  	}());
  	exports.Identifier = Identifier;
  	var IfStatement = (function () {
  	    function IfStatement(test, consequent, alternate) {
  	        this.type = syntax_1.Syntax.IfStatement;
  	        this.test = test;
  	        this.consequent = consequent;
  	        this.alternate = alternate;
  	    }
  	    return IfStatement;
  	}());
  	exports.IfStatement = IfStatement;
  	var ImportDeclaration = (function () {
  	    function ImportDeclaration(specifiers, source) {
  	        this.type = syntax_1.Syntax.ImportDeclaration;
  	        this.specifiers = specifiers;
  	        this.source = source;
  	    }
  	    return ImportDeclaration;
  	}());
  	exports.ImportDeclaration = ImportDeclaration;
  	var ImportDefaultSpecifier = (function () {
  	    function ImportDefaultSpecifier(local) {
  	        this.type = syntax_1.Syntax.ImportDefaultSpecifier;
  	        this.local = local;
  	    }
  	    return ImportDefaultSpecifier;
  	}());
  	exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
  	var ImportNamespaceSpecifier = (function () {
  	    function ImportNamespaceSpecifier(local) {
  	        this.type = syntax_1.Syntax.ImportNamespaceSpecifier;
  	        this.local = local;
  	    }
  	    return ImportNamespaceSpecifier;
  	}());
  	exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
  	var ImportSpecifier = (function () {
  	    function ImportSpecifier(local, imported) {
  	        this.type = syntax_1.Syntax.ImportSpecifier;
  	        this.local = local;
  	        this.imported = imported;
  	    }
  	    return ImportSpecifier;
  	}());
  	exports.ImportSpecifier = ImportSpecifier;
  	var LabeledStatement = (function () {
  	    function LabeledStatement(label, body) {
  	        this.type = syntax_1.Syntax.LabeledStatement;
  	        this.label = label;
  	        this.body = body;
  	    }
  	    return LabeledStatement;
  	}());
  	exports.LabeledStatement = LabeledStatement;
  	var Literal = (function () {
  	    function Literal(value, raw) {
  	        this.type = syntax_1.Syntax.Literal;
  	        this.value = value;
  	        this.raw = raw;
  	    }
  	    return Literal;
  	}());
  	exports.Literal = Literal;
  	var MetaProperty = (function () {
  	    function MetaProperty(meta, property) {
  	        this.type = syntax_1.Syntax.MetaProperty;
  	        this.meta = meta;
  	        this.property = property;
  	    }
  	    return MetaProperty;
  	}());
  	exports.MetaProperty = MetaProperty;
  	var MethodDefinition = (function () {
  	    function MethodDefinition(key, computed, value, kind, isStatic) {
  	        this.type = syntax_1.Syntax.MethodDefinition;
  	        this.key = key;
  	        this.computed = computed;
  	        this.value = value;
  	        this.kind = kind;
  	        this.static = isStatic;
  	    }
  	    return MethodDefinition;
  	}());
  	exports.MethodDefinition = MethodDefinition;
  	var Module = (function () {
  	    function Module(body) {
  	        this.type = syntax_1.Syntax.Program;
  	        this.body = body;
  	        this.sourceType = 'module';
  	    }
  	    return Module;
  	}());
  	exports.Module = Module;
  	var NewExpression = (function () {
  	    function NewExpression(callee, args) {
  	        this.type = syntax_1.Syntax.NewExpression;
  	        this.callee = callee;
  	        this.arguments = args;
  	    }
  	    return NewExpression;
  	}());
  	exports.NewExpression = NewExpression;
  	var ObjectExpression = (function () {
  	    function ObjectExpression(properties) {
  	        this.type = syntax_1.Syntax.ObjectExpression;
  	        this.properties = properties;
  	    }
  	    return ObjectExpression;
  	}());
  	exports.ObjectExpression = ObjectExpression;
  	var ObjectPattern = (function () {
  	    function ObjectPattern(properties) {
  	        this.type = syntax_1.Syntax.ObjectPattern;
  	        this.properties = properties;
  	    }
  	    return ObjectPattern;
  	}());
  	exports.ObjectPattern = ObjectPattern;
  	var Property = (function () {
  	    function Property(kind, key, computed, value, method, shorthand) {
  	        this.type = syntax_1.Syntax.Property;
  	        this.key = key;
  	        this.computed = computed;
  	        this.value = value;
  	        this.kind = kind;
  	        this.method = method;
  	        this.shorthand = shorthand;
  	    }
  	    return Property;
  	}());
  	exports.Property = Property;
  	var RegexLiteral = (function () {
  	    function RegexLiteral(value, raw, pattern, flags) {
  	        this.type = syntax_1.Syntax.Literal;
  	        this.value = value;
  	        this.raw = raw;
  	        this.regex = { pattern: pattern, flags: flags };
  	    }
  	    return RegexLiteral;
  	}());
  	exports.RegexLiteral = RegexLiteral;
  	var RestElement = (function () {
  	    function RestElement(argument) {
  	        this.type = syntax_1.Syntax.RestElement;
  	        this.argument = argument;
  	    }
  	    return RestElement;
  	}());
  	exports.RestElement = RestElement;
  	var ReturnStatement = (function () {
  	    function ReturnStatement(argument) {
  	        this.type = syntax_1.Syntax.ReturnStatement;
  	        this.argument = argument;
  	    }
  	    return ReturnStatement;
  	}());
  	exports.ReturnStatement = ReturnStatement;
  	var Script = (function () {
  	    function Script(body) {
  	        this.type = syntax_1.Syntax.Program;
  	        this.body = body;
  	        this.sourceType = 'script';
  	    }
  	    return Script;
  	}());
  	exports.Script = Script;
  	var SequenceExpression = (function () {
  	    function SequenceExpression(expressions) {
  	        this.type = syntax_1.Syntax.SequenceExpression;
  	        this.expressions = expressions;
  	    }
  	    return SequenceExpression;
  	}());
  	exports.SequenceExpression = SequenceExpression;
  	var SpreadElement = (function () {
  	    function SpreadElement(argument) {
  	        this.type = syntax_1.Syntax.SpreadElement;
  	        this.argument = argument;
  	    }
  	    return SpreadElement;
  	}());
  	exports.SpreadElement = SpreadElement;
  	var StaticMemberExpression = (function () {
  	    function StaticMemberExpression(object, property) {
  	        this.type = syntax_1.Syntax.MemberExpression;
  	        this.computed = false;
  	        this.object = object;
  	        this.property = property;
  	    }
  	    return StaticMemberExpression;
  	}());
  	exports.StaticMemberExpression = StaticMemberExpression;
  	var Super = (function () {
  	    function Super() {
  	        this.type = syntax_1.Syntax.Super;
  	    }
  	    return Super;
  	}());
  	exports.Super = Super;
  	var SwitchCase = (function () {
  	    function SwitchCase(test, consequent) {
  	        this.type = syntax_1.Syntax.SwitchCase;
  	        this.test = test;
  	        this.consequent = consequent;
  	    }
  	    return SwitchCase;
  	}());
  	exports.SwitchCase = SwitchCase;
  	var SwitchStatement = (function () {
  	    function SwitchStatement(discriminant, cases) {
  	        this.type = syntax_1.Syntax.SwitchStatement;
  	        this.discriminant = discriminant;
  	        this.cases = cases;
  	    }
  	    return SwitchStatement;
  	}());
  	exports.SwitchStatement = SwitchStatement;
  	var TaggedTemplateExpression = (function () {
  	    function TaggedTemplateExpression(tag, quasi) {
  	        this.type = syntax_1.Syntax.TaggedTemplateExpression;
  	        this.tag = tag;
  	        this.quasi = quasi;
  	    }
  	    return TaggedTemplateExpression;
  	}());
  	exports.TaggedTemplateExpression = TaggedTemplateExpression;
  	var TemplateElement = (function () {
  	    function TemplateElement(value, tail) {
  	        this.type = syntax_1.Syntax.TemplateElement;
  	        this.value = value;
  	        this.tail = tail;
  	    }
  	    return TemplateElement;
  	}());
  	exports.TemplateElement = TemplateElement;
  	var TemplateLiteral = (function () {
  	    function TemplateLiteral(quasis, expressions) {
  	        this.type = syntax_1.Syntax.TemplateLiteral;
  	        this.quasis = quasis;
  	        this.expressions = expressions;
  	    }
  	    return TemplateLiteral;
  	}());
  	exports.TemplateLiteral = TemplateLiteral;
  	var ThisExpression = (function () {
  	    function ThisExpression() {
  	        this.type = syntax_1.Syntax.ThisExpression;
  	    }
  	    return ThisExpression;
  	}());
  	exports.ThisExpression = ThisExpression;
  	var ThrowStatement = (function () {
  	    function ThrowStatement(argument) {
  	        this.type = syntax_1.Syntax.ThrowStatement;
  	        this.argument = argument;
  	    }
  	    return ThrowStatement;
  	}());
  	exports.ThrowStatement = ThrowStatement;
  	var TryStatement = (function () {
  	    function TryStatement(block, handler, finalizer) {
  	        this.type = syntax_1.Syntax.TryStatement;
  	        this.block = block;
  	        this.handler = handler;
  	        this.finalizer = finalizer;
  	    }
  	    return TryStatement;
  	}());
  	exports.TryStatement = TryStatement;
  	var UnaryExpression = (function () {
  	    function UnaryExpression(operator, argument) {
  	        this.type = syntax_1.Syntax.UnaryExpression;
  	        this.operator = operator;
  	        this.argument = argument;
  	        this.prefix = true;
  	    }
  	    return UnaryExpression;
  	}());
  	exports.UnaryExpression = UnaryExpression;
  	var UpdateExpression = (function () {
  	    function UpdateExpression(operator, argument, prefix) {
  	        this.type = syntax_1.Syntax.UpdateExpression;
  	        this.operator = operator;
  	        this.argument = argument;
  	        this.prefix = prefix;
  	    }
  	    return UpdateExpression;
  	}());
  	exports.UpdateExpression = UpdateExpression;
  	var VariableDeclaration = (function () {
  	    function VariableDeclaration(declarations, kind) {
  	        this.type = syntax_1.Syntax.VariableDeclaration;
  	        this.declarations = declarations;
  	        this.kind = kind;
  	    }
  	    return VariableDeclaration;
  	}());
  	exports.VariableDeclaration = VariableDeclaration;
  	var VariableDeclarator = (function () {
  	    function VariableDeclarator(id, init) {
  	        this.type = syntax_1.Syntax.VariableDeclarator;
  	        this.id = id;
  	        this.init = init;
  	    }
  	    return VariableDeclarator;
  	}());
  	exports.VariableDeclarator = VariableDeclarator;
  	var WhileStatement = (function () {
  	    function WhileStatement(test, body) {
  	        this.type = syntax_1.Syntax.WhileStatement;
  	        this.test = test;
  	        this.body = body;
  	    }
  	    return WhileStatement;
  	}());
  	exports.WhileStatement = WhileStatement;
  	var WithStatement = (function () {
  	    function WithStatement(object, body) {
  	        this.type = syntax_1.Syntax.WithStatement;
  	        this.object = object;
  	        this.body = body;
  	    }
  	    return WithStatement;
  	}());
  	exports.WithStatement = WithStatement;
  	var YieldExpression = (function () {
  	    function YieldExpression(argument, delegate) {
  	        this.type = syntax_1.Syntax.YieldExpression;
  	        this.argument = argument;
  	        this.delegate = delegate;
  	    }
  	    return YieldExpression;
  	}());
  	exports.YieldExpression = YieldExpression;


  /***/ },
  /* 8 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var assert_1 = __webpack_require__(9);
  	var error_handler_1 = __webpack_require__(10);
  	var messages_1 = __webpack_require__(11);
  	var Node = __webpack_require__(7);
  	var scanner_1 = __webpack_require__(12);
  	var syntax_1 = __webpack_require__(2);
  	var token_1 = __webpack_require__(13);
  	var ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
  	var Parser = (function () {
  	    function Parser(code, options, delegate) {
  	        if (options === void 0) { options = {}; }
  	        this.config = {
  	            range: (typeof options.range === 'boolean') && options.range,
  	            loc: (typeof options.loc === 'boolean') && options.loc,
  	            source: null,
  	            tokens: (typeof options.tokens === 'boolean') && options.tokens,
  	            comment: (typeof options.comment === 'boolean') && options.comment,
  	            tolerant: (typeof options.tolerant === 'boolean') && options.tolerant
  	        };
  	        if (this.config.loc && options.source && options.source !== null) {
  	            this.config.source = String(options.source);
  	        }
  	        this.delegate = delegate;
  	        this.errorHandler = new error_handler_1.ErrorHandler();
  	        this.errorHandler.tolerant = this.config.tolerant;
  	        this.scanner = new scanner_1.Scanner(code, this.errorHandler);
  	        this.scanner.trackComment = this.config.comment;
  	        this.operatorPrecedence = {
  	            ')': 0,
  	            ';': 0,
  	            ',': 0,
  	            '=': 0,
  	            ']': 0,
  	            '||': 1,
  	            '&&': 2,
  	            '|': 3,
  	            '^': 4,
  	            '&': 5,
  	            '==': 6,
  	            '!=': 6,
  	            '===': 6,
  	            '!==': 6,
  	            '<': 7,
  	            '>': 7,
  	            '<=': 7,
  	            '>=': 7,
  	            '<<': 8,
  	            '>>': 8,
  	            '>>>': 8,
  	            '+': 9,
  	            '-': 9,
  	            '*': 11,
  	            '/': 11,
  	            '%': 11
  	        };
  	        this.lookahead = {
  	            type: 2 /* EOF */,
  	            value: '',
  	            lineNumber: this.scanner.lineNumber,
  	            lineStart: 0,
  	            start: 0,
  	            end: 0
  	        };
  	        this.hasLineTerminator = false;
  	        this.context = {
  	            isModule: false,
  	            await: false,
  	            allowIn: true,
  	            allowStrictDirective: true,
  	            allowYield: true,
  	            firstCoverInitializedNameError: null,
  	            isAssignmentTarget: false,
  	            isBindingElement: false,
  	            inFunctionBody: false,
  	            inIteration: false,
  	            inSwitch: false,
  	            labelSet: {},
  	            strict: false
  	        };
  	        this.tokens = [];
  	        this.startMarker = {
  	            index: 0,
  	            line: this.scanner.lineNumber,
  	            column: 0
  	        };
  	        this.lastMarker = {
  	            index: 0,
  	            line: this.scanner.lineNumber,
  	            column: 0
  	        };
  	        this.nextToken();
  	        this.lastMarker = {
  	            index: this.scanner.index,
  	            line: this.scanner.lineNumber,
  	            column: this.scanner.index - this.scanner.lineStart
  	        };
  	    }
  	    Parser.prototype.throwError = function (messageFormat) {
  	        var values = [];
  	        for (var _i = 1; _i < arguments.length; _i++) {
  	            values[_i - 1] = arguments[_i];
  	        }
  	        var args = Array.prototype.slice.call(arguments, 1);
  	        var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
  	            assert_1.assert(idx < args.length, 'Message reference must be in range');
  	            return args[idx];
  	        });
  	        var index = this.lastMarker.index;
  	        var line = this.lastMarker.line;
  	        var column = this.lastMarker.column + 1;
  	        throw this.errorHandler.createError(index, line, column, msg);
  	    };
  	    Parser.prototype.tolerateError = function (messageFormat) {
  	        var values = [];
  	        for (var _i = 1; _i < arguments.length; _i++) {
  	            values[_i - 1] = arguments[_i];
  	        }
  	        var args = Array.prototype.slice.call(arguments, 1);
  	        var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
  	            assert_1.assert(idx < args.length, 'Message reference must be in range');
  	            return args[idx];
  	        });
  	        var index = this.lastMarker.index;
  	        var line = this.scanner.lineNumber;
  	        var column = this.lastMarker.column + 1;
  	        this.errorHandler.tolerateError(index, line, column, msg);
  	    };
  	    // Throw an exception because of the token.
  	    Parser.prototype.unexpectedTokenError = function (token, message) {
  	        var msg = message || messages_1.Messages.UnexpectedToken;
  	        var value;
  	        if (token) {
  	            if (!message) {
  	                msg = (token.type === 2 /* EOF */) ? messages_1.Messages.UnexpectedEOS :
  	                    (token.type === 3 /* Identifier */) ? messages_1.Messages.UnexpectedIdentifier :
  	                        (token.type === 6 /* NumericLiteral */) ? messages_1.Messages.UnexpectedNumber :
  	                            (token.type === 8 /* StringLiteral */) ? messages_1.Messages.UnexpectedString :
  	                                (token.type === 10 /* Template */) ? messages_1.Messages.UnexpectedTemplate :
  	                                    messages_1.Messages.UnexpectedToken;
  	                if (token.type === 4 /* Keyword */) {
  	                    if (this.scanner.isFutureReservedWord(token.value)) {
  	                        msg = messages_1.Messages.UnexpectedReserved;
  	                    }
  	                    else if (this.context.strict && this.scanner.isStrictModeReservedWord(token.value)) {
  	                        msg = messages_1.Messages.StrictReservedWord;
  	                    }
  	                }
  	            }
  	            value = token.value;
  	        }
  	        else {
  	            value = 'ILLEGAL';
  	        }
  	        msg = msg.replace('%0', value);
  	        if (token && typeof token.lineNumber === 'number') {
  	            var index = token.start;
  	            var line = token.lineNumber;
  	            var lastMarkerLineStart = this.lastMarker.index - this.lastMarker.column;
  	            var column = token.start - lastMarkerLineStart + 1;
  	            return this.errorHandler.createError(index, line, column, msg);
  	        }
  	        else {
  	            var index = this.lastMarker.index;
  	            var line = this.lastMarker.line;
  	            var column = this.lastMarker.column + 1;
  	            return this.errorHandler.createError(index, line, column, msg);
  	        }
  	    };
  	    Parser.prototype.throwUnexpectedToken = function (token, message) {
  	        throw this.unexpectedTokenError(token, message);
  	    };
  	    Parser.prototype.tolerateUnexpectedToken = function (token, message) {
  	        this.errorHandler.tolerate(this.unexpectedTokenError(token, message));
  	    };
  	    Parser.prototype.collectComments = function () {
  	        if (!this.config.comment) {
  	            this.scanner.scanComments();
  	        }
  	        else {
  	            var comments = this.scanner.scanComments();
  	            if (comments.length > 0 && this.delegate) {
  	                for (var i = 0; i < comments.length; ++i) {
  	                    var e = comments[i];
  	                    var node = void 0;
  	                    node = {
  	                        type: e.multiLine ? 'BlockComment' : 'LineComment',
  	                        value: this.scanner.source.slice(e.slice[0], e.slice[1])
  	                    };
  	                    if (this.config.range) {
  	                        node.range = e.range;
  	                    }
  	                    if (this.config.loc) {
  	                        node.loc = e.loc;
  	                    }
  	                    var metadata = {
  	                        start: {
  	                            line: e.loc.start.line,
  	                            column: e.loc.start.column,
  	                            offset: e.range[0]
  	                        },
  	                        end: {
  	                            line: e.loc.end.line,
  	                            column: e.loc.end.column,
  	                            offset: e.range[1]
  	                        }
  	                    };
  	                    this.delegate(node, metadata);
  	                }
  	            }
  	        }
  	    };
  	    // From internal representation to an external structure
  	    Parser.prototype.getTokenRaw = function (token) {
  	        return this.scanner.source.slice(token.start, token.end);
  	    };
  	    Parser.prototype.convertToken = function (token) {
  	        var t = {
  	            type: token_1.TokenName[token.type],
  	            value: this.getTokenRaw(token)
  	        };
  	        if (this.config.range) {
  	            t.range = [token.start, token.end];
  	        }
  	        if (this.config.loc) {
  	            t.loc = {
  	                start: {
  	                    line: this.startMarker.line,
  	                    column: this.startMarker.column
  	                },
  	                end: {
  	                    line: this.scanner.lineNumber,
  	                    column: this.scanner.index - this.scanner.lineStart
  	                }
  	            };
  	        }
  	        if (token.type === 9 /* RegularExpression */) {
  	            var pattern = token.pattern;
  	            var flags = token.flags;
  	            t.regex = { pattern: pattern, flags: flags };
  	        }
  	        return t;
  	    };
  	    Parser.prototype.nextToken = function () {
  	        var token = this.lookahead;
  	        this.lastMarker.index = this.scanner.index;
  	        this.lastMarker.line = this.scanner.lineNumber;
  	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
  	        this.collectComments();
  	        if (this.scanner.index !== this.startMarker.index) {
  	            this.startMarker.index = this.scanner.index;
  	            this.startMarker.line = this.scanner.lineNumber;
  	            this.startMarker.column = this.scanner.index - this.scanner.lineStart;
  	        }
  	        var next = this.scanner.lex();
  	        this.hasLineTerminator = (token.lineNumber !== next.lineNumber);
  	        if (next && this.context.strict && next.type === 3 /* Identifier */) {
  	            if (this.scanner.isStrictModeReservedWord(next.value)) {
  	                next.type = 4 /* Keyword */;
  	            }
  	        }
  	        this.lookahead = next;
  	        if (this.config.tokens && next.type !== 2 /* EOF */) {
  	            this.tokens.push(this.convertToken(next));
  	        }
  	        return token;
  	    };
  	    Parser.prototype.nextRegexToken = function () {
  	        this.collectComments();
  	        var token = this.scanner.scanRegExp();
  	        if (this.config.tokens) {
  	            // Pop the previous token, '/' or '/='
  	            // This is added from the lookahead token.
  	            this.tokens.pop();
  	            this.tokens.push(this.convertToken(token));
  	        }
  	        // Prime the next lookahead.
  	        this.lookahead = token;
  	        this.nextToken();
  	        return token;
  	    };
  	    Parser.prototype.createNode = function () {
  	        return {
  	            index: this.startMarker.index,
  	            line: this.startMarker.line,
  	            column: this.startMarker.column
  	        };
  	    };
  	    Parser.prototype.startNode = function (token, lastLineStart) {
  	        if (lastLineStart === void 0) { lastLineStart = 0; }
  	        var column = token.start - token.lineStart;
  	        var line = token.lineNumber;
  	        if (column < 0) {
  	            column += lastLineStart;
  	            line--;
  	        }
  	        return {
  	            index: token.start,
  	            line: line,
  	            column: column
  	        };
  	    };
  	    Parser.prototype.finalize = function (marker, node) {
  	        if (this.config.range) {
  	            node.range = [marker.index, this.lastMarker.index];
  	        }
  	        if (this.config.loc) {
  	            node.loc = {
  	                start: {
  	                    line: marker.line,
  	                    column: marker.column,
  	                },
  	                end: {
  	                    line: this.lastMarker.line,
  	                    column: this.lastMarker.column
  	                }
  	            };
  	            if (this.config.source) {
  	                node.loc.source = this.config.source;
  	            }
  	        }
  	        if (this.delegate) {
  	            var metadata = {
  	                start: {
  	                    line: marker.line,
  	                    column: marker.column,
  	                    offset: marker.index
  	                },
  	                end: {
  	                    line: this.lastMarker.line,
  	                    column: this.lastMarker.column,
  	                    offset: this.lastMarker.index
  	                }
  	            };
  	            this.delegate(node, metadata);
  	        }
  	        return node;
  	    };
  	    // Expect the next token to match the specified punctuator.
  	    // If not, an exception will be thrown.
  	    Parser.prototype.expect = function (value) {
  	        var token = this.nextToken();
  	        if (token.type !== 7 /* Punctuator */ || token.value !== value) {
  	            this.throwUnexpectedToken(token);
  	        }
  	    };
  	    // Quietly expect a comma when in tolerant mode, otherwise delegates to expect().
  	    Parser.prototype.expectCommaSeparator = function () {
  	        if (this.config.tolerant) {
  	            var token = this.lookahead;
  	            if (token.type === 7 /* Punctuator */ && token.value === ',') {
  	                this.nextToken();
  	            }
  	            else if (token.type === 7 /* Punctuator */ && token.value === ';') {
  	                this.nextToken();
  	                this.tolerateUnexpectedToken(token);
  	            }
  	            else {
  	                this.tolerateUnexpectedToken(token, messages_1.Messages.UnexpectedToken);
  	            }
  	        }
  	        else {
  	            this.expect(',');
  	        }
  	    };
  	    // Expect the next token to match the specified keyword.
  	    // If not, an exception will be thrown.
  	    Parser.prototype.expectKeyword = function (keyword) {
  	        var token = this.nextToken();
  	        if (token.type !== 4 /* Keyword */ || token.value !== keyword) {
  	            this.throwUnexpectedToken(token);
  	        }
  	    };
  	    // Return true if the next token matches the specified punctuator.
  	    Parser.prototype.match = function (value) {
  	        return this.lookahead.type === 7 /* Punctuator */ && this.lookahead.value === value;
  	    };
  	    // Return true if the next token matches the specified keyword
  	    Parser.prototype.matchKeyword = function (keyword) {
  	        return this.lookahead.type === 4 /* Keyword */ && this.lookahead.value === keyword;
  	    };
  	    // Return true if the next token matches the specified contextual keyword
  	    // (where an identifier is sometimes a keyword depending on the context)
  	    Parser.prototype.matchContextualKeyword = function (keyword) {
  	        return this.lookahead.type === 3 /* Identifier */ && this.lookahead.value === keyword;
  	    };
  	    // Return true if the next token is an assignment operator
  	    Parser.prototype.matchAssign = function () {
  	        if (this.lookahead.type !== 7 /* Punctuator */) {
  	            return false;
  	        }
  	        var op = this.lookahead.value;
  	        return op === '=' ||
  	            op === '*=' ||
  	            op === '**=' ||
  	            op === '/=' ||
  	            op === '%=' ||
  	            op === '+=' ||
  	            op === '-=' ||
  	            op === '<<=' ||
  	            op === '>>=' ||
  	            op === '>>>=' ||
  	            op === '&=' ||
  	            op === '^=' ||
  	            op === '|=';
  	    };
  	    // Cover grammar support.
  	    //
  	    // When an assignment expression position starts with an left parenthesis, the determination of the type
  	    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
  	    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
  	    //
  	    // There are three productions that can be parsed in a parentheses pair that needs to be determined
  	    // after the outermost pair is closed. They are:
  	    //
  	    //   1. AssignmentExpression
  	    //   2. BindingElements
  	    //   3. AssignmentTargets
  	    //
  	    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
  	    // binding element or assignment target.
  	    //
  	    // The three productions have the relationship:
  	    //
  	    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
  	    //
  	    // with a single exception that CoverInitializedName when used directly in an Expression, generates
  	    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
  	    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
  	    //
  	    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
  	    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
  	    // the CoverInitializedName check is conducted.
  	    //
  	    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
  	    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
  	    // pattern. The CoverInitializedName check is deferred.
  	    Parser.prototype.isolateCoverGrammar = function (parseFunction) {
  	        var previousIsBindingElement = this.context.isBindingElement;
  	        var previousIsAssignmentTarget = this.context.isAssignmentTarget;
  	        var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
  	        this.context.isBindingElement = true;
  	        this.context.isAssignmentTarget = true;
  	        this.context.firstCoverInitializedNameError = null;
  	        var result = parseFunction.call(this);
  	        if (this.context.firstCoverInitializedNameError !== null) {
  	            this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
  	        }
  	        this.context.isBindingElement = previousIsBindingElement;
  	        this.context.isAssignmentTarget = previousIsAssignmentTarget;
  	        this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError;
  	        return result;
  	    };
  	    Parser.prototype.inheritCoverGrammar = function (parseFunction) {
  	        var previousIsBindingElement = this.context.isBindingElement;
  	        var previousIsAssignmentTarget = this.context.isAssignmentTarget;
  	        var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
  	        this.context.isBindingElement = true;
  	        this.context.isAssignmentTarget = true;
  	        this.context.firstCoverInitializedNameError = null;
  	        var result = parseFunction.call(this);
  	        this.context.isBindingElement = this.context.isBindingElement && previousIsBindingElement;
  	        this.context.isAssignmentTarget = this.context.isAssignmentTarget && previousIsAssignmentTarget;
  	        this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError || this.context.firstCoverInitializedNameError;
  	        return result;
  	    };
  	    Parser.prototype.consumeSemicolon = function () {
  	        if (this.match(';')) {
  	            this.nextToken();
  	        }
  	        else if (!this.hasLineTerminator) {
  	            if (this.lookahead.type !== 2 /* EOF */ && !this.match('}')) {
  	                this.throwUnexpectedToken(this.lookahead);
  	            }
  	            this.lastMarker.index = this.startMarker.index;
  	            this.lastMarker.line = this.startMarker.line;
  	            this.lastMarker.column = this.startMarker.column;
  	        }
  	    };
  	    // https://tc39.github.io/ecma262/#sec-primary-expression
  	    Parser.prototype.parsePrimaryExpression = function () {
  	        var node = this.createNode();
  	        var expr;
  	        var token, raw;
  	        switch (this.lookahead.type) {
  	            case 3 /* Identifier */:
  	                if ((this.context.isModule || this.context.await) && this.lookahead.value === 'await') {
  	                    this.tolerateUnexpectedToken(this.lookahead);
  	                }
  	                expr = this.matchAsyncFunction() ? this.parseFunctionExpression() : this.finalize(node, new Node.Identifier(this.nextToken().value));
  	                break;
  	            case 6 /* NumericLiteral */:
  	            case 8 /* StringLiteral */:
  	                if (this.context.strict && this.lookahead.octal) {
  	                    this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.StrictOctalLiteral);
  	                }
  	                this.context.isAssignmentTarget = false;
  	                this.context.isBindingElement = false;
  	                token = this.nextToken();
  	                raw = this.getTokenRaw(token);
  	                expr = this.finalize(node, new Node.Literal(token.value, raw));
  	                break;
  	            case 1 /* BooleanLiteral */:
  	                this.context.isAssignmentTarget = false;
  	                this.context.isBindingElement = false;
  	                token = this.nextToken();
  	                raw = this.getTokenRaw(token);
  	                expr = this.finalize(node, new Node.Literal(token.value === 'true', raw));
  	                break;
  	            case 5 /* NullLiteral */:
  	                this.context.isAssignmentTarget = false;
  	                this.context.isBindingElement = false;
  	                token = this.nextToken();
  	                raw = this.getTokenRaw(token);
  	                expr = this.finalize(node, new Node.Literal(null, raw));
  	                break;
  	            case 10 /* Template */:
  	                expr = this.parseTemplateLiteral();
  	                break;
  	            case 7 /* Punctuator */:
  	                switch (this.lookahead.value) {
  	                    case '(':
  	                        this.context.isBindingElement = false;
  	                        expr = this.inheritCoverGrammar(this.parseGroupExpression);
  	                        break;
  	                    case '[':
  	                        expr = this.inheritCoverGrammar(this.parseArrayInitializer);
  	                        break;
  	                    case '{':
  	                        expr = this.inheritCoverGrammar(this.parseObjectInitializer);
  	                        break;
  	                    case '/':
  	                    case '/=':
  	                        this.context.isAssignmentTarget = false;
  	                        this.context.isBindingElement = false;
  	                        this.scanner.index = this.startMarker.index;
  	                        token = this.nextRegexToken();
  	                        raw = this.getTokenRaw(token);
  	                        expr = this.finalize(node, new Node.RegexLiteral(token.regex, raw, token.pattern, token.flags));
  	                        break;
  	                    default:
  	                        expr = this.throwUnexpectedToken(this.nextToken());
  	                }
  	                break;
  	            case 4 /* Keyword */:
  	                if (!this.context.strict && this.context.allowYield && this.matchKeyword('yield')) {
  	                    expr = this.parseIdentifierName();
  	                }
  	                else if (!this.context.strict && this.matchKeyword('let')) {
  	                    expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
  	                }
  	                else {
  	                    this.context.isAssignmentTarget = false;
  	                    this.context.isBindingElement = false;
  	                    if (this.matchKeyword('function')) {
  	                        expr = this.parseFunctionExpression();
  	                    }
  	                    else if (this.matchKeyword('this')) {
  	                        this.nextToken();
  	                        expr = this.finalize(node, new Node.ThisExpression());
  	                    }
  	                    else if (this.matchKeyword('class')) {
  	                        expr = this.parseClassExpression();
  	                    }
  	                    else {
  	                        expr = this.throwUnexpectedToken(this.nextToken());
  	                    }
  	                }
  	                break;
  	            default:
  	                expr = this.throwUnexpectedToken(this.nextToken());
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-array-initializer
  	    Parser.prototype.parseSpreadElement = function () {
  	        var node = this.createNode();
  	        this.expect('...');
  	        var arg = this.inheritCoverGrammar(this.parseAssignmentExpression);
  	        return this.finalize(node, new Node.SpreadElement(arg));
  	    };
  	    Parser.prototype.parseArrayInitializer = function () {
  	        var node = this.createNode();
  	        var elements = [];
  	        this.expect('[');
  	        while (!this.match(']')) {
  	            if (this.match(',')) {
  	                this.nextToken();
  	                elements.push(null);
  	            }
  	            else if (this.match('...')) {
  	                var element = this.parseSpreadElement();
  	                if (!this.match(']')) {
  	                    this.context.isAssignmentTarget = false;
  	                    this.context.isBindingElement = false;
  	                    this.expect(',');
  	                }
  	                elements.push(element);
  	            }
  	            else {
  	                elements.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
  	                if (!this.match(']')) {
  	                    this.expect(',');
  	                }
  	            }
  	        }
  	        this.expect(']');
  	        return this.finalize(node, new Node.ArrayExpression(elements));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-object-initializer
  	    Parser.prototype.parsePropertyMethod = function (params) {
  	        this.context.isAssignmentTarget = false;
  	        this.context.isBindingElement = false;
  	        var previousStrict = this.context.strict;
  	        var previousAllowStrictDirective = this.context.allowStrictDirective;
  	        this.context.allowStrictDirective = params.simple;
  	        var body = this.isolateCoverGrammar(this.parseFunctionSourceElements);
  	        if (this.context.strict && params.firstRestricted) {
  	            this.tolerateUnexpectedToken(params.firstRestricted, params.message);
  	        }
  	        if (this.context.strict && params.stricted) {
  	            this.tolerateUnexpectedToken(params.stricted, params.message);
  	        }
  	        this.context.strict = previousStrict;
  	        this.context.allowStrictDirective = previousAllowStrictDirective;
  	        return body;
  	    };
  	    Parser.prototype.parsePropertyMethodFunction = function () {
  	        var isGenerator = false;
  	        var node = this.createNode();
  	        var previousAllowYield = this.context.allowYield;
  	        this.context.allowYield = true;
  	        var params = this.parseFormalParameters();
  	        var method = this.parsePropertyMethod(params);
  	        this.context.allowYield = previousAllowYield;
  	        return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
  	    };
  	    Parser.prototype.parsePropertyMethodAsyncFunction = function () {
  	        var node = this.createNode();
  	        var previousAllowYield = this.context.allowYield;
  	        var previousAwait = this.context.await;
  	        this.context.allowYield = false;
  	        this.context.await = true;
  	        var params = this.parseFormalParameters();
  	        var method = this.parsePropertyMethod(params);
  	        this.context.allowYield = previousAllowYield;
  	        this.context.await = previousAwait;
  	        return this.finalize(node, new Node.AsyncFunctionExpression(null, params.params, method));
  	    };
  	    Parser.prototype.parseObjectPropertyKey = function () {
  	        var node = this.createNode();
  	        var token = this.nextToken();
  	        var key;
  	        switch (token.type) {
  	            case 8 /* StringLiteral */:
  	            case 6 /* NumericLiteral */:
  	                if (this.context.strict && token.octal) {
  	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictOctalLiteral);
  	                }
  	                var raw = this.getTokenRaw(token);
  	                key = this.finalize(node, new Node.Literal(token.value, raw));
  	                break;
  	            case 3 /* Identifier */:
  	            case 1 /* BooleanLiteral */:
  	            case 5 /* NullLiteral */:
  	            case 4 /* Keyword */:
  	                key = this.finalize(node, new Node.Identifier(token.value));
  	                break;
  	            case 7 /* Punctuator */:
  	                if (token.value === '[') {
  	                    key = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	                    this.expect(']');
  	                }
  	                else {
  	                    key = this.throwUnexpectedToken(token);
  	                }
  	                break;
  	            default:
  	                key = this.throwUnexpectedToken(token);
  	        }
  	        return key;
  	    };
  	    Parser.prototype.isPropertyKey = function (key, value) {
  	        return (key.type === syntax_1.Syntax.Identifier && key.name === value) ||
  	            (key.type === syntax_1.Syntax.Literal && key.value === value);
  	    };
  	    Parser.prototype.parseObjectProperty = function (hasProto) {
  	        var node = this.createNode();
  	        var token = this.lookahead;
  	        var kind;
  	        var key = null;
  	        var value = null;
  	        var computed = false;
  	        var method = false;
  	        var shorthand = false;
  	        var isAsync = false;
  	        if (token.type === 3 /* Identifier */) {
  	            var id = token.value;
  	            this.nextToken();
  	            computed = this.match('[');
  	            isAsync = !this.hasLineTerminator && (id === 'async') &&
  	                !this.match(':') && !this.match('(') && !this.match('*') && !this.match(',');
  	            key = isAsync ? this.parseObjectPropertyKey() : this.finalize(node, new Node.Identifier(id));
  	        }
  	        else if (this.match('*')) {
  	            this.nextToken();
  	        }
  	        else {
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	        }
  	        var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
  	        if (token.type === 3 /* Identifier */ && !isAsync && token.value === 'get' && lookaheadPropertyKey) {
  	            kind = 'get';
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	            this.context.allowYield = false;
  	            value = this.parseGetterMethod();
  	        }
  	        else if (token.type === 3 /* Identifier */ && !isAsync && token.value === 'set' && lookaheadPropertyKey) {
  	            kind = 'set';
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	            value = this.parseSetterMethod();
  	        }
  	        else if (token.type === 7 /* Punctuator */ && token.value === '*' && lookaheadPropertyKey) {
  	            kind = 'init';
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	            value = this.parseGeneratorMethod();
  	            method = true;
  	        }
  	        else {
  	            if (!key) {
  	                this.throwUnexpectedToken(this.lookahead);
  	            }
  	            kind = 'init';
  	            if (this.match(':') && !isAsync) {
  	                if (!computed && this.isPropertyKey(key, '__proto__')) {
  	                    if (hasProto.value) {
  	                        this.tolerateError(messages_1.Messages.DuplicateProtoProperty);
  	                    }
  	                    hasProto.value = true;
  	                }
  	                this.nextToken();
  	                value = this.inheritCoverGrammar(this.parseAssignmentExpression);
  	            }
  	            else if (this.match('(')) {
  	                value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
  	                method = true;
  	            }
  	            else if (token.type === 3 /* Identifier */) {
  	                var id = this.finalize(node, new Node.Identifier(token.value));
  	                if (this.match('=')) {
  	                    this.context.firstCoverInitializedNameError = this.lookahead;
  	                    this.nextToken();
  	                    shorthand = true;
  	                    var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	                    value = this.finalize(node, new Node.AssignmentPattern(id, init));
  	                }
  	                else {
  	                    shorthand = true;
  	                    value = id;
  	                }
  	            }
  	            else {
  	                this.throwUnexpectedToken(this.nextToken());
  	            }
  	        }
  	        return this.finalize(node, new Node.Property(kind, key, computed, value, method, shorthand));
  	    };
  	    Parser.prototype.parseObjectInitializer = function () {
  	        var node = this.createNode();
  	        this.expect('{');
  	        var properties = [];
  	        var hasProto = { value: false };
  	        while (!this.match('}')) {
  	            properties.push(this.parseObjectProperty(hasProto));
  	            if (!this.match('}')) {
  	                this.expectCommaSeparator();
  	            }
  	        }
  	        this.expect('}');
  	        return this.finalize(node, new Node.ObjectExpression(properties));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-template-literals
  	    Parser.prototype.parseTemplateHead = function () {
  	        assert_1.assert(this.lookahead.head, 'Template literal must start with a template head');
  	        var node = this.createNode();
  	        var token = this.nextToken();
  	        var raw = token.value;
  	        var cooked = token.cooked;
  	        return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
  	    };
  	    Parser.prototype.parseTemplateElement = function () {
  	        if (this.lookahead.type !== 10 /* Template */) {
  	            this.throwUnexpectedToken();
  	        }
  	        var node = this.createNode();
  	        var token = this.nextToken();
  	        var raw = token.value;
  	        var cooked = token.cooked;
  	        return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
  	    };
  	    Parser.prototype.parseTemplateLiteral = function () {
  	        var node = this.createNode();
  	        var expressions = [];
  	        var quasis = [];
  	        var quasi = this.parseTemplateHead();
  	        quasis.push(quasi);
  	        while (!quasi.tail) {
  	            expressions.push(this.parseExpression());
  	            quasi = this.parseTemplateElement();
  	            quasis.push(quasi);
  	        }
  	        return this.finalize(node, new Node.TemplateLiteral(quasis, expressions));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-grouping-operator
  	    Parser.prototype.reinterpretExpressionAsPattern = function (expr) {
  	        switch (expr.type) {
  	            case syntax_1.Syntax.Identifier:
  	            case syntax_1.Syntax.MemberExpression:
  	            case syntax_1.Syntax.RestElement:
  	            case syntax_1.Syntax.AssignmentPattern:
  	                break;
  	            case syntax_1.Syntax.SpreadElement:
  	                expr.type = syntax_1.Syntax.RestElement;
  	                this.reinterpretExpressionAsPattern(expr.argument);
  	                break;
  	            case syntax_1.Syntax.ArrayExpression:
  	                expr.type = syntax_1.Syntax.ArrayPattern;
  	                for (var i = 0; i < expr.elements.length; i++) {
  	                    if (expr.elements[i] !== null) {
  	                        this.reinterpretExpressionAsPattern(expr.elements[i]);
  	                    }
  	                }
  	                break;
  	            case syntax_1.Syntax.ObjectExpression:
  	                expr.type = syntax_1.Syntax.ObjectPattern;
  	                for (var i = 0; i < expr.properties.length; i++) {
  	                    this.reinterpretExpressionAsPattern(expr.properties[i].value);
  	                }
  	                break;
  	            case syntax_1.Syntax.AssignmentExpression:
  	                expr.type = syntax_1.Syntax.AssignmentPattern;
  	                delete expr.operator;
  	                this.reinterpretExpressionAsPattern(expr.left);
  	                break;
  	            default:
  	                // Allow other node type for tolerant parsing.
  	                break;
  	        }
  	    };
  	    Parser.prototype.parseGroupExpression = function () {
  	        var expr;
  	        this.expect('(');
  	        if (this.match(')')) {
  	            this.nextToken();
  	            if (!this.match('=>')) {
  	                this.expect('=>');
  	            }
  	            expr = {
  	                type: ArrowParameterPlaceHolder,
  	                params: [],
  	                async: false
  	            };
  	        }
  	        else {
  	            var startToken = this.lookahead;
  	            var params = [];
  	            if (this.match('...')) {
  	                expr = this.parseRestElement(params);
  	                this.expect(')');
  	                if (!this.match('=>')) {
  	                    this.expect('=>');
  	                }
  	                expr = {
  	                    type: ArrowParameterPlaceHolder,
  	                    params: [expr],
  	                    async: false
  	                };
  	            }
  	            else {
  	                var arrow = false;
  	                this.context.isBindingElement = true;
  	                expr = this.inheritCoverGrammar(this.parseAssignmentExpression);
  	                if (this.match(',')) {
  	                    var expressions = [];
  	                    this.context.isAssignmentTarget = false;
  	                    expressions.push(expr);
  	                    while (this.lookahead.type !== 2 /* EOF */) {
  	                        if (!this.match(',')) {
  	                            break;
  	                        }
  	                        this.nextToken();
  	                        if (this.match(')')) {
  	                            this.nextToken();
  	                            for (var i = 0; i < expressions.length; i++) {
  	                                this.reinterpretExpressionAsPattern(expressions[i]);
  	                            }
  	                            arrow = true;
  	                            expr = {
  	                                type: ArrowParameterPlaceHolder,
  	                                params: expressions,
  	                                async: false
  	                            };
  	                        }
  	                        else if (this.match('...')) {
  	                            if (!this.context.isBindingElement) {
  	                                this.throwUnexpectedToken(this.lookahead);
  	                            }
  	                            expressions.push(this.parseRestElement(params));
  	                            this.expect(')');
  	                            if (!this.match('=>')) {
  	                                this.expect('=>');
  	                            }
  	                            this.context.isBindingElement = false;
  	                            for (var i = 0; i < expressions.length; i++) {
  	                                this.reinterpretExpressionAsPattern(expressions[i]);
  	                            }
  	                            arrow = true;
  	                            expr = {
  	                                type: ArrowParameterPlaceHolder,
  	                                params: expressions,
  	                                async: false
  	                            };
  	                        }
  	                        else {
  	                            expressions.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
  	                        }
  	                        if (arrow) {
  	                            break;
  	                        }
  	                    }
  	                    if (!arrow) {
  	                        expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
  	                    }
  	                }
  	                if (!arrow) {
  	                    this.expect(')');
  	                    if (this.match('=>')) {
  	                        if (expr.type === syntax_1.Syntax.Identifier && expr.name === 'yield') {
  	                            arrow = true;
  	                            expr = {
  	                                type: ArrowParameterPlaceHolder,
  	                                params: [expr],
  	                                async: false
  	                            };
  	                        }
  	                        if (!arrow) {
  	                            if (!this.context.isBindingElement) {
  	                                this.throwUnexpectedToken(this.lookahead);
  	                            }
  	                            if (expr.type === syntax_1.Syntax.SequenceExpression) {
  	                                for (var i = 0; i < expr.expressions.length; i++) {
  	                                    this.reinterpretExpressionAsPattern(expr.expressions[i]);
  	                                }
  	                            }
  	                            else {
  	                                this.reinterpretExpressionAsPattern(expr);
  	                            }
  	                            var parameters = (expr.type === syntax_1.Syntax.SequenceExpression ? expr.expressions : [expr]);
  	                            expr = {
  	                                type: ArrowParameterPlaceHolder,
  	                                params: parameters,
  	                                async: false
  	                            };
  	                        }
  	                    }
  	                    this.context.isBindingElement = false;
  	                }
  	            }
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-left-hand-side-expressions
  	    Parser.prototype.parseArguments = function () {
  	        this.expect('(');
  	        var args = [];
  	        if (!this.match(')')) {
  	            while (true) {
  	                var expr = this.match('...') ? this.parseSpreadElement() :
  	                    this.isolateCoverGrammar(this.parseAssignmentExpression);
  	                args.push(expr);
  	                if (this.match(')')) {
  	                    break;
  	                }
  	                this.expectCommaSeparator();
  	                if (this.match(')')) {
  	                    break;
  	                }
  	            }
  	        }
  	        this.expect(')');
  	        return args;
  	    };
  	    Parser.prototype.isIdentifierName = function (token) {
  	        return token.type === 3 /* Identifier */ ||
  	            token.type === 4 /* Keyword */ ||
  	            token.type === 1 /* BooleanLiteral */ ||
  	            token.type === 5 /* NullLiteral */;
  	    };
  	    Parser.prototype.parseIdentifierName = function () {
  	        var node = this.createNode();
  	        var token = this.nextToken();
  	        if (!this.isIdentifierName(token)) {
  	            this.throwUnexpectedToken(token);
  	        }
  	        return this.finalize(node, new Node.Identifier(token.value));
  	    };
  	    Parser.prototype.parseNewExpression = function () {
  	        var node = this.createNode();
  	        var id = this.parseIdentifierName();
  	        assert_1.assert(id.name === 'new', 'New expression must start with `new`');
  	        var expr;
  	        if (this.match('.')) {
  	            this.nextToken();
  	            if (this.lookahead.type === 3 /* Identifier */ && this.context.inFunctionBody && this.lookahead.value === 'target') {
  	                var property = this.parseIdentifierName();
  	                expr = new Node.MetaProperty(id, property);
  	            }
  	            else {
  	                this.throwUnexpectedToken(this.lookahead);
  	            }
  	        }
  	        else {
  	            var callee = this.isolateCoverGrammar(this.parseLeftHandSideExpression);
  	            var args = this.match('(') ? this.parseArguments() : [];
  	            expr = new Node.NewExpression(callee, args);
  	            this.context.isAssignmentTarget = false;
  	            this.context.isBindingElement = false;
  	        }
  	        return this.finalize(node, expr);
  	    };
  	    Parser.prototype.parseAsyncArgument = function () {
  	        var arg = this.parseAssignmentExpression();
  	        this.context.firstCoverInitializedNameError = null;
  	        return arg;
  	    };
  	    Parser.prototype.parseAsyncArguments = function () {
  	        this.expect('(');
  	        var args = [];
  	        if (!this.match(')')) {
  	            while (true) {
  	                var expr = this.match('...') ? this.parseSpreadElement() :
  	                    this.isolateCoverGrammar(this.parseAsyncArgument);
  	                args.push(expr);
  	                if (this.match(')')) {
  	                    break;
  	                }
  	                this.expectCommaSeparator();
  	                if (this.match(')')) {
  	                    break;
  	                }
  	            }
  	        }
  	        this.expect(')');
  	        return args;
  	    };
  	    Parser.prototype.parseLeftHandSideExpressionAllowCall = function () {
  	        var startToken = this.lookahead;
  	        var maybeAsync = this.matchContextualKeyword('async');
  	        var previousAllowIn = this.context.allowIn;
  	        this.context.allowIn = true;
  	        var expr;
  	        if (this.matchKeyword('super') && this.context.inFunctionBody) {
  	            expr = this.createNode();
  	            this.nextToken();
  	            expr = this.finalize(expr, new Node.Super());
  	            if (!this.match('(') && !this.match('.') && !this.match('[')) {
  	                this.throwUnexpectedToken(this.lookahead);
  	            }
  	        }
  	        else {
  	            expr = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
  	        }
  	        while (true) {
  	            if (this.match('.')) {
  	                this.context.isBindingElement = false;
  	                this.context.isAssignmentTarget = true;
  	                this.expect('.');
  	                var property = this.parseIdentifierName();
  	                expr = this.finalize(this.startNode(startToken), new Node.StaticMemberExpression(expr, property));
  	            }
  	            else if (this.match('(')) {
  	                var asyncArrow = maybeAsync && (startToken.lineNumber === this.lookahead.lineNumber);
  	                this.context.isBindingElement = false;
  	                this.context.isAssignmentTarget = false;
  	                var args = asyncArrow ? this.parseAsyncArguments() : this.parseArguments();
  	                expr = this.finalize(this.startNode(startToken), new Node.CallExpression(expr, args));
  	                if (asyncArrow && this.match('=>')) {
  	                    for (var i = 0; i < args.length; ++i) {
  	                        this.reinterpretExpressionAsPattern(args[i]);
  	                    }
  	                    expr = {
  	                        type: ArrowParameterPlaceHolder,
  	                        params: args,
  	                        async: true
  	                    };
  	                }
  	            }
  	            else if (this.match('[')) {
  	                this.context.isBindingElement = false;
  	                this.context.isAssignmentTarget = true;
  	                this.expect('[');
  	                var property = this.isolateCoverGrammar(this.parseExpression);
  	                this.expect(']');
  	                expr = this.finalize(this.startNode(startToken), new Node.ComputedMemberExpression(expr, property));
  	            }
  	            else if (this.lookahead.type === 10 /* Template */ && this.lookahead.head) {
  	                var quasi = this.parseTemplateLiteral();
  	                expr = this.finalize(this.startNode(startToken), new Node.TaggedTemplateExpression(expr, quasi));
  	            }
  	            else {
  	                break;
  	            }
  	        }
  	        this.context.allowIn = previousAllowIn;
  	        return expr;
  	    };
  	    Parser.prototype.parseSuper = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('super');
  	        if (!this.match('[') && !this.match('.')) {
  	            this.throwUnexpectedToken(this.lookahead);
  	        }
  	        return this.finalize(node, new Node.Super());
  	    };
  	    Parser.prototype.parseLeftHandSideExpression = function () {
  	        assert_1.assert(this.context.allowIn, 'callee of new expression always allow in keyword.');
  	        var node = this.startNode(this.lookahead);
  	        var expr = (this.matchKeyword('super') && this.context.inFunctionBody) ? this.parseSuper() :
  	            this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
  	        while (true) {
  	            if (this.match('[')) {
  	                this.context.isBindingElement = false;
  	                this.context.isAssignmentTarget = true;
  	                this.expect('[');
  	                var property = this.isolateCoverGrammar(this.parseExpression);
  	                this.expect(']');
  	                expr = this.finalize(node, new Node.ComputedMemberExpression(expr, property));
  	            }
  	            else if (this.match('.')) {
  	                this.context.isBindingElement = false;
  	                this.context.isAssignmentTarget = true;
  	                this.expect('.');
  	                var property = this.parseIdentifierName();
  	                expr = this.finalize(node, new Node.StaticMemberExpression(expr, property));
  	            }
  	            else if (this.lookahead.type === 10 /* Template */ && this.lookahead.head) {
  	                var quasi = this.parseTemplateLiteral();
  	                expr = this.finalize(node, new Node.TaggedTemplateExpression(expr, quasi));
  	            }
  	            else {
  	                break;
  	            }
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-update-expressions
  	    Parser.prototype.parseUpdateExpression = function () {
  	        var expr;
  	        var startToken = this.lookahead;
  	        if (this.match('++') || this.match('--')) {
  	            var node = this.startNode(startToken);
  	            var token = this.nextToken();
  	            expr = this.inheritCoverGrammar(this.parseUnaryExpression);
  	            if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
  	                this.tolerateError(messages_1.Messages.StrictLHSPrefix);
  	            }
  	            if (!this.context.isAssignmentTarget) {
  	                this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
  	            }
  	            var prefix = true;
  	            expr = this.finalize(node, new Node.UpdateExpression(token.value, expr, prefix));
  	            this.context.isAssignmentTarget = false;
  	            this.context.isBindingElement = false;
  	        }
  	        else {
  	            expr = this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
  	            if (!this.hasLineTerminator && this.lookahead.type === 7 /* Punctuator */) {
  	                if (this.match('++') || this.match('--')) {
  	                    if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
  	                        this.tolerateError(messages_1.Messages.StrictLHSPostfix);
  	                    }
  	                    if (!this.context.isAssignmentTarget) {
  	                        this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
  	                    }
  	                    this.context.isAssignmentTarget = false;
  	                    this.context.isBindingElement = false;
  	                    var operator = this.nextToken().value;
  	                    var prefix = false;
  	                    expr = this.finalize(this.startNode(startToken), new Node.UpdateExpression(operator, expr, prefix));
  	                }
  	            }
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-unary-operators
  	    Parser.prototype.parseAwaitExpression = function () {
  	        var node = this.createNode();
  	        this.nextToken();
  	        var argument = this.parseUnaryExpression();
  	        return this.finalize(node, new Node.AwaitExpression(argument));
  	    };
  	    Parser.prototype.parseUnaryExpression = function () {
  	        var expr;
  	        if (this.match('+') || this.match('-') || this.match('~') || this.match('!') ||
  	            this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
  	            var node = this.startNode(this.lookahead);
  	            var token = this.nextToken();
  	            expr = this.inheritCoverGrammar(this.parseUnaryExpression);
  	            expr = this.finalize(node, new Node.UnaryExpression(token.value, expr));
  	            if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.Syntax.Identifier) {
  	                this.tolerateError(messages_1.Messages.StrictDelete);
  	            }
  	            this.context.isAssignmentTarget = false;
  	            this.context.isBindingElement = false;
  	        }
  	        else if (this.context.await && this.matchContextualKeyword('await')) {
  	            expr = this.parseAwaitExpression();
  	        }
  	        else {
  	            expr = this.parseUpdateExpression();
  	        }
  	        return expr;
  	    };
  	    Parser.prototype.parseExponentiationExpression = function () {
  	        var startToken = this.lookahead;
  	        var expr = this.inheritCoverGrammar(this.parseUnaryExpression);
  	        if (expr.type !== syntax_1.Syntax.UnaryExpression && this.match('**')) {
  	            this.nextToken();
  	            this.context.isAssignmentTarget = false;
  	            this.context.isBindingElement = false;
  	            var left = expr;
  	            var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
  	            expr = this.finalize(this.startNode(startToken), new Node.BinaryExpression('**', left, right));
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-exp-operator
  	    // https://tc39.github.io/ecma262/#sec-multiplicative-operators
  	    // https://tc39.github.io/ecma262/#sec-additive-operators
  	    // https://tc39.github.io/ecma262/#sec-bitwise-shift-operators
  	    // https://tc39.github.io/ecma262/#sec-relational-operators
  	    // https://tc39.github.io/ecma262/#sec-equality-operators
  	    // https://tc39.github.io/ecma262/#sec-binary-bitwise-operators
  	    // https://tc39.github.io/ecma262/#sec-binary-logical-operators
  	    Parser.prototype.binaryPrecedence = function (token) {
  	        var op = token.value;
  	        var precedence;
  	        if (token.type === 7 /* Punctuator */) {
  	            precedence = this.operatorPrecedence[op] || 0;
  	        }
  	        else if (token.type === 4 /* Keyword */) {
  	            precedence = (op === 'instanceof' || (this.context.allowIn && op === 'in')) ? 7 : 0;
  	        }
  	        else {
  	            precedence = 0;
  	        }
  	        return precedence;
  	    };
  	    Parser.prototype.parseBinaryExpression = function () {
  	        var startToken = this.lookahead;
  	        var expr = this.inheritCoverGrammar(this.parseExponentiationExpression);
  	        var token = this.lookahead;
  	        var prec = this.binaryPrecedence(token);
  	        if (prec > 0) {
  	            this.nextToken();
  	            this.context.isAssignmentTarget = false;
  	            this.context.isBindingElement = false;
  	            var markers = [startToken, this.lookahead];
  	            var left = expr;
  	            var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
  	            var stack = [left, token.value, right];
  	            var precedences = [prec];
  	            while (true) {
  	                prec = this.binaryPrecedence(this.lookahead);
  	                if (prec <= 0) {
  	                    break;
  	                }
  	                // Reduce: make a binary expression from the three topmost entries.
  	                while ((stack.length > 2) && (prec <= precedences[precedences.length - 1])) {
  	                    right = stack.pop();
  	                    var operator = stack.pop();
  	                    precedences.pop();
  	                    left = stack.pop();
  	                    markers.pop();
  	                    var node = this.startNode(markers[markers.length - 1]);
  	                    stack.push(this.finalize(node, new Node.BinaryExpression(operator, left, right)));
  	                }
  	                // Shift.
  	                stack.push(this.nextToken().value);
  	                precedences.push(prec);
  	                markers.push(this.lookahead);
  	                stack.push(this.isolateCoverGrammar(this.parseExponentiationExpression));
  	            }
  	            // Final reduce to clean-up the stack.
  	            var i = stack.length - 1;
  	            expr = stack[i];
  	            var lastMarker = markers.pop();
  	            while (i > 1) {
  	                var marker = markers.pop();
  	                var lastLineStart = lastMarker && lastMarker.lineStart;
  	                var node = this.startNode(marker, lastLineStart);
  	                var operator = stack[i - 1];
  	                expr = this.finalize(node, new Node.BinaryExpression(operator, stack[i - 2], expr));
  	                i -= 2;
  	                lastMarker = marker;
  	            }
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-conditional-operator
  	    Parser.prototype.parseConditionalExpression = function () {
  	        var startToken = this.lookahead;
  	        var expr = this.inheritCoverGrammar(this.parseBinaryExpression);
  	        if (this.match('?')) {
  	            this.nextToken();
  	            var previousAllowIn = this.context.allowIn;
  	            this.context.allowIn = true;
  	            var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	            this.context.allowIn = previousAllowIn;
  	            this.expect(':');
  	            var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	            expr = this.finalize(this.startNode(startToken), new Node.ConditionalExpression(expr, consequent, alternate));
  	            this.context.isAssignmentTarget = false;
  	            this.context.isBindingElement = false;
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-assignment-operators
  	    Parser.prototype.checkPatternParam = function (options, param) {
  	        switch (param.type) {
  	            case syntax_1.Syntax.Identifier:
  	                this.validateParam(options, param, param.name);
  	                break;
  	            case syntax_1.Syntax.RestElement:
  	                this.checkPatternParam(options, param.argument);
  	                break;
  	            case syntax_1.Syntax.AssignmentPattern:
  	                this.checkPatternParam(options, param.left);
  	                break;
  	            case syntax_1.Syntax.ArrayPattern:
  	                for (var i = 0; i < param.elements.length; i++) {
  	                    if (param.elements[i] !== null) {
  	                        this.checkPatternParam(options, param.elements[i]);
  	                    }
  	                }
  	                break;
  	            case syntax_1.Syntax.ObjectPattern:
  	                for (var i = 0; i < param.properties.length; i++) {
  	                    this.checkPatternParam(options, param.properties[i].value);
  	                }
  	                break;
  	            default:
  	                break;
  	        }
  	        options.simple = options.simple && (param instanceof Node.Identifier);
  	    };
  	    Parser.prototype.reinterpretAsCoverFormalsList = function (expr) {
  	        var params = [expr];
  	        var options;
  	        var asyncArrow = false;
  	        switch (expr.type) {
  	            case syntax_1.Syntax.Identifier:
  	                break;
  	            case ArrowParameterPlaceHolder:
  	                params = expr.params;
  	                asyncArrow = expr.async;
  	                break;
  	            default:
  	                return null;
  	        }
  	        options = {
  	            simple: true,
  	            paramSet: {}
  	        };
  	        for (var i = 0; i < params.length; ++i) {
  	            var param = params[i];
  	            if (param.type === syntax_1.Syntax.AssignmentPattern) {
  	                if (param.right.type === syntax_1.Syntax.YieldExpression) {
  	                    if (param.right.argument) {
  	                        this.throwUnexpectedToken(this.lookahead);
  	                    }
  	                    param.right.type = syntax_1.Syntax.Identifier;
  	                    param.right.name = 'yield';
  	                    delete param.right.argument;
  	                    delete param.right.delegate;
  	                }
  	            }
  	            else if (asyncArrow && param.type === syntax_1.Syntax.Identifier && param.name === 'await') {
  	                this.throwUnexpectedToken(this.lookahead);
  	            }
  	            this.checkPatternParam(options, param);
  	            params[i] = param;
  	        }
  	        if (this.context.strict || !this.context.allowYield) {
  	            for (var i = 0; i < params.length; ++i) {
  	                var param = params[i];
  	                if (param.type === syntax_1.Syntax.YieldExpression) {
  	                    this.throwUnexpectedToken(this.lookahead);
  	                }
  	            }
  	        }
  	        if (options.message === messages_1.Messages.StrictParamDupe) {
  	            var token = this.context.strict ? options.stricted : options.firstRestricted;
  	            this.throwUnexpectedToken(token, options.message);
  	        }
  	        return {
  	            simple: options.simple,
  	            params: params,
  	            stricted: options.stricted,
  	            firstRestricted: options.firstRestricted,
  	            message: options.message
  	        };
  	    };
  	    Parser.prototype.parseAssignmentExpression = function () {
  	        var expr;
  	        if (!this.context.allowYield && this.matchKeyword('yield')) {
  	            expr = this.parseYieldExpression();
  	        }
  	        else {
  	            var startToken = this.lookahead;
  	            var token = startToken;
  	            expr = this.parseConditionalExpression();
  	            if (token.type === 3 /* Identifier */ && (token.lineNumber === this.lookahead.lineNumber) && token.value === 'async') {
  	                if (this.lookahead.type === 3 /* Identifier */ || this.matchKeyword('yield')) {
  	                    var arg = this.parsePrimaryExpression();
  	                    this.reinterpretExpressionAsPattern(arg);
  	                    expr = {
  	                        type: ArrowParameterPlaceHolder,
  	                        params: [arg],
  	                        async: true
  	                    };
  	                }
  	            }
  	            if (expr.type === ArrowParameterPlaceHolder || this.match('=>')) {
  	                // https://tc39.github.io/ecma262/#sec-arrow-function-definitions
  	                this.context.isAssignmentTarget = false;
  	                this.context.isBindingElement = false;
  	                var isAsync = expr.async;
  	                var list = this.reinterpretAsCoverFormalsList(expr);
  	                if (list) {
  	                    if (this.hasLineTerminator) {
  	                        this.tolerateUnexpectedToken(this.lookahead);
  	                    }
  	                    this.context.firstCoverInitializedNameError = null;
  	                    var previousStrict = this.context.strict;
  	                    var previousAllowStrictDirective = this.context.allowStrictDirective;
  	                    this.context.allowStrictDirective = list.simple;
  	                    var previousAllowYield = this.context.allowYield;
  	                    var previousAwait = this.context.await;
  	                    this.context.allowYield = true;
  	                    this.context.await = isAsync;
  	                    var node = this.startNode(startToken);
  	                    this.expect('=>');
  	                    var body = void 0;
  	                    if (this.match('{')) {
  	                        var previousAllowIn = this.context.allowIn;
  	                        this.context.allowIn = true;
  	                        body = this.parseFunctionSourceElements();
  	                        this.context.allowIn = previousAllowIn;
  	                    }
  	                    else {
  	                        body = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	                    }
  	                    var expression = body.type !== syntax_1.Syntax.BlockStatement;
  	                    if (this.context.strict && list.firstRestricted) {
  	                        this.throwUnexpectedToken(list.firstRestricted, list.message);
  	                    }
  	                    if (this.context.strict && list.stricted) {
  	                        this.tolerateUnexpectedToken(list.stricted, list.message);
  	                    }
  	                    expr = isAsync ? this.finalize(node, new Node.AsyncArrowFunctionExpression(list.params, body, expression)) :
  	                        this.finalize(node, new Node.ArrowFunctionExpression(list.params, body, expression));
  	                    this.context.strict = previousStrict;
  	                    this.context.allowStrictDirective = previousAllowStrictDirective;
  	                    this.context.allowYield = previousAllowYield;
  	                    this.context.await = previousAwait;
  	                }
  	            }
  	            else {
  	                if (this.matchAssign()) {
  	                    if (!this.context.isAssignmentTarget) {
  	                        this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
  	                    }
  	                    if (this.context.strict && expr.type === syntax_1.Syntax.Identifier) {
  	                        var id = expr;
  	                        if (this.scanner.isRestrictedWord(id.name)) {
  	                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictLHSAssignment);
  	                        }
  	                        if (this.scanner.isStrictModeReservedWord(id.name)) {
  	                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
  	                        }
  	                    }
  	                    if (!this.match('=')) {
  	                        this.context.isAssignmentTarget = false;
  	                        this.context.isBindingElement = false;
  	                    }
  	                    else {
  	                        this.reinterpretExpressionAsPattern(expr);
  	                    }
  	                    token = this.nextToken();
  	                    var operator = token.value;
  	                    var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	                    expr = this.finalize(this.startNode(startToken), new Node.AssignmentExpression(operator, expr, right));
  	                    this.context.firstCoverInitializedNameError = null;
  	                }
  	            }
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-comma-operator
  	    Parser.prototype.parseExpression = function () {
  	        var startToken = this.lookahead;
  	        var expr = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	        if (this.match(',')) {
  	            var expressions = [];
  	            expressions.push(expr);
  	            while (this.lookahead.type !== 2 /* EOF */) {
  	                if (!this.match(',')) {
  	                    break;
  	                }
  	                this.nextToken();
  	                expressions.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
  	            }
  	            expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
  	        }
  	        return expr;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-block
  	    Parser.prototype.parseStatementListItem = function () {
  	        var statement;
  	        this.context.isAssignmentTarget = true;
  	        this.context.isBindingElement = true;
  	        if (this.lookahead.type === 4 /* Keyword */) {
  	            switch (this.lookahead.value) {
  	                case 'export':
  	                    if (!this.context.isModule) {
  	                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalExportDeclaration);
  	                    }
  	                    statement = this.parseExportDeclaration();
  	                    break;
  	                case 'import':
  	                    if (!this.context.isModule) {
  	                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalImportDeclaration);
  	                    }
  	                    statement = this.parseImportDeclaration();
  	                    break;
  	                case 'const':
  	                    statement = this.parseLexicalDeclaration({ inFor: false });
  	                    break;
  	                case 'function':
  	                    statement = this.parseFunctionDeclaration();
  	                    break;
  	                case 'class':
  	                    statement = this.parseClassDeclaration();
  	                    break;
  	                case 'let':
  	                    statement = this.isLexicalDeclaration() ? this.parseLexicalDeclaration({ inFor: false }) : this.parseStatement();
  	                    break;
  	                default:
  	                    statement = this.parseStatement();
  	                    break;
  	            }
  	        }
  	        else {
  	            statement = this.parseStatement();
  	        }
  	        return statement;
  	    };
  	    Parser.prototype.parseBlock = function () {
  	        var node = this.createNode();
  	        this.expect('{');
  	        var block = [];
  	        while (true) {
  	            if (this.match('}')) {
  	                break;
  	            }
  	            block.push(this.parseStatementListItem());
  	        }
  	        this.expect('}');
  	        return this.finalize(node, new Node.BlockStatement(block));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-let-and-const-declarations
  	    Parser.prototype.parseLexicalBinding = function (kind, options) {
  	        var node = this.createNode();
  	        var params = [];
  	        var id = this.parsePattern(params, kind);
  	        if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
  	            if (this.scanner.isRestrictedWord(id.name)) {
  	                this.tolerateError(messages_1.Messages.StrictVarName);
  	            }
  	        }
  	        var init = null;
  	        if (kind === 'const') {
  	            if (!this.matchKeyword('in') && !this.matchContextualKeyword('of')) {
  	                if (this.match('=')) {
  	                    this.nextToken();
  	                    init = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	                }
  	                else {
  	                    this.throwError(messages_1.Messages.DeclarationMissingInitializer, 'const');
  	                }
  	            }
  	        }
  	        else if ((!options.inFor && id.type !== syntax_1.Syntax.Identifier) || this.match('=')) {
  	            this.expect('=');
  	            init = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	        }
  	        return this.finalize(node, new Node.VariableDeclarator(id, init));
  	    };
  	    Parser.prototype.parseBindingList = function (kind, options) {
  	        var list = [this.parseLexicalBinding(kind, options)];
  	        while (this.match(',')) {
  	            this.nextToken();
  	            list.push(this.parseLexicalBinding(kind, options));
  	        }
  	        return list;
  	    };
  	    Parser.prototype.isLexicalDeclaration = function () {
  	        var state = this.scanner.saveState();
  	        this.scanner.scanComments();
  	        var next = this.scanner.lex();
  	        this.scanner.restoreState(state);
  	        return (next.type === 3 /* Identifier */) ||
  	            (next.type === 7 /* Punctuator */ && next.value === '[') ||
  	            (next.type === 7 /* Punctuator */ && next.value === '{') ||
  	            (next.type === 4 /* Keyword */ && next.value === 'let') ||
  	            (next.type === 4 /* Keyword */ && next.value === 'yield');
  	    };
  	    Parser.prototype.parseLexicalDeclaration = function (options) {
  	        var node = this.createNode();
  	        var kind = this.nextToken().value;
  	        assert_1.assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');
  	        var declarations = this.parseBindingList(kind, options);
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.VariableDeclaration(declarations, kind));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-destructuring-binding-patterns
  	    Parser.prototype.parseBindingRestElement = function (params, kind) {
  	        var node = this.createNode();
  	        this.expect('...');
  	        var arg = this.parsePattern(params, kind);
  	        return this.finalize(node, new Node.RestElement(arg));
  	    };
  	    Parser.prototype.parseArrayPattern = function (params, kind) {
  	        var node = this.createNode();
  	        this.expect('[');
  	        var elements = [];
  	        while (!this.match(']')) {
  	            if (this.match(',')) {
  	                this.nextToken();
  	                elements.push(null);
  	            }
  	            else {
  	                if (this.match('...')) {
  	                    elements.push(this.parseBindingRestElement(params, kind));
  	                    break;
  	                }
  	                else {
  	                    elements.push(this.parsePatternWithDefault(params, kind));
  	                }
  	                if (!this.match(']')) {
  	                    this.expect(',');
  	                }
  	            }
  	        }
  	        this.expect(']');
  	        return this.finalize(node, new Node.ArrayPattern(elements));
  	    };
  	    Parser.prototype.parsePropertyPattern = function (params, kind) {
  	        var node = this.createNode();
  	        var computed = false;
  	        var shorthand = false;
  	        var method = false;
  	        var key;
  	        var value;
  	        if (this.lookahead.type === 3 /* Identifier */) {
  	            var keyToken = this.lookahead;
  	            key = this.parseVariableIdentifier();
  	            var init = this.finalize(node, new Node.Identifier(keyToken.value));
  	            if (this.match('=')) {
  	                params.push(keyToken);
  	                shorthand = true;
  	                this.nextToken();
  	                var expr = this.parseAssignmentExpression();
  	                value = this.finalize(this.startNode(keyToken), new Node.AssignmentPattern(init, expr));
  	            }
  	            else if (!this.match(':')) {
  	                params.push(keyToken);
  	                shorthand = true;
  	                value = init;
  	            }
  	            else {
  	                this.expect(':');
  	                value = this.parsePatternWithDefault(params, kind);
  	            }
  	        }
  	        else {
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	            this.expect(':');
  	            value = this.parsePatternWithDefault(params, kind);
  	        }
  	        return this.finalize(node, new Node.Property('init', key, computed, value, method, shorthand));
  	    };
  	    Parser.prototype.parseObjectPattern = function (params, kind) {
  	        var node = this.createNode();
  	        var properties = [];
  	        this.expect('{');
  	        while (!this.match('}')) {
  	            properties.push(this.parsePropertyPattern(params, kind));
  	            if (!this.match('}')) {
  	                this.expect(',');
  	            }
  	        }
  	        this.expect('}');
  	        return this.finalize(node, new Node.ObjectPattern(properties));
  	    };
  	    Parser.prototype.parsePattern = function (params, kind) {
  	        var pattern;
  	        if (this.match('[')) {
  	            pattern = this.parseArrayPattern(params, kind);
  	        }
  	        else if (this.match('{')) {
  	            pattern = this.parseObjectPattern(params, kind);
  	        }
  	        else {
  	            if (this.matchKeyword('let') && (kind === 'const' || kind === 'let')) {
  	                this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.LetInLexicalBinding);
  	            }
  	            params.push(this.lookahead);
  	            pattern = this.parseVariableIdentifier(kind);
  	        }
  	        return pattern;
  	    };
  	    Parser.prototype.parsePatternWithDefault = function (params, kind) {
  	        var startToken = this.lookahead;
  	        var pattern = this.parsePattern(params, kind);
  	        if (this.match('=')) {
  	            this.nextToken();
  	            var previousAllowYield = this.context.allowYield;
  	            this.context.allowYield = true;
  	            var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	            this.context.allowYield = previousAllowYield;
  	            pattern = this.finalize(this.startNode(startToken), new Node.AssignmentPattern(pattern, right));
  	        }
  	        return pattern;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-variable-statement
  	    Parser.prototype.parseVariableIdentifier = function (kind) {
  	        var node = this.createNode();
  	        var token = this.nextToken();
  	        if (token.type === 4 /* Keyword */ && token.value === 'yield') {
  	            if (this.context.strict) {
  	                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
  	            }
  	            else if (!this.context.allowYield) {
  	                this.throwUnexpectedToken(token);
  	            }
  	        }
  	        else if (token.type !== 3 /* Identifier */) {
  	            if (this.context.strict && token.type === 4 /* Keyword */ && this.scanner.isStrictModeReservedWord(token.value)) {
  	                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
  	            }
  	            else {
  	                if (this.context.strict || token.value !== 'let' || kind !== 'var') {
  	                    this.throwUnexpectedToken(token);
  	                }
  	            }
  	        }
  	        else if ((this.context.isModule || this.context.await) && token.type === 3 /* Identifier */ && token.value === 'await') {
  	            this.tolerateUnexpectedToken(token);
  	        }
  	        return this.finalize(node, new Node.Identifier(token.value));
  	    };
  	    Parser.prototype.parseVariableDeclaration = function (options) {
  	        var node = this.createNode();
  	        var params = [];
  	        var id = this.parsePattern(params, 'var');
  	        if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
  	            if (this.scanner.isRestrictedWord(id.name)) {
  	                this.tolerateError(messages_1.Messages.StrictVarName);
  	            }
  	        }
  	        var init = null;
  	        if (this.match('=')) {
  	            this.nextToken();
  	            init = this.isolateCoverGrammar(this.parseAssignmentExpression);
  	        }
  	        else if (id.type !== syntax_1.Syntax.Identifier && !options.inFor) {
  	            this.expect('=');
  	        }
  	        return this.finalize(node, new Node.VariableDeclarator(id, init));
  	    };
  	    Parser.prototype.parseVariableDeclarationList = function (options) {
  	        var opt = { inFor: options.inFor };
  	        var list = [];
  	        list.push(this.parseVariableDeclaration(opt));
  	        while (this.match(',')) {
  	            this.nextToken();
  	            list.push(this.parseVariableDeclaration(opt));
  	        }
  	        return list;
  	    };
  	    Parser.prototype.parseVariableStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('var');
  	        var declarations = this.parseVariableDeclarationList({ inFor: false });
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.VariableDeclaration(declarations, 'var'));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-empty-statement
  	    Parser.prototype.parseEmptyStatement = function () {
  	        var node = this.createNode();
  	        this.expect(';');
  	        return this.finalize(node, new Node.EmptyStatement());
  	    };
  	    // https://tc39.github.io/ecma262/#sec-expression-statement
  	    Parser.prototype.parseExpressionStatement = function () {
  	        var node = this.createNode();
  	        var expr = this.parseExpression();
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.ExpressionStatement(expr));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-if-statement
  	    Parser.prototype.parseIfClause = function () {
  	        if (this.context.strict && this.matchKeyword('function')) {
  	            this.tolerateError(messages_1.Messages.StrictFunction);
  	        }
  	        return this.parseStatement();
  	    };
  	    Parser.prototype.parseIfStatement = function () {
  	        var node = this.createNode();
  	        var consequent;
  	        var alternate = null;
  	        this.expectKeyword('if');
  	        this.expect('(');
  	        var test = this.parseExpression();
  	        if (!this.match(')') && this.config.tolerant) {
  	            this.tolerateUnexpectedToken(this.nextToken());
  	            consequent = this.finalize(this.createNode(), new Node.EmptyStatement());
  	        }
  	        else {
  	            this.expect(')');
  	            consequent = this.parseIfClause();
  	            if (this.matchKeyword('else')) {
  	                this.nextToken();
  	                alternate = this.parseIfClause();
  	            }
  	        }
  	        return this.finalize(node, new Node.IfStatement(test, consequent, alternate));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-do-while-statement
  	    Parser.prototype.parseDoWhileStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('do');
  	        var previousInIteration = this.context.inIteration;
  	        this.context.inIteration = true;
  	        var body = this.parseStatement();
  	        this.context.inIteration = previousInIteration;
  	        this.expectKeyword('while');
  	        this.expect('(');
  	        var test = this.parseExpression();
  	        if (!this.match(')') && this.config.tolerant) {
  	            this.tolerateUnexpectedToken(this.nextToken());
  	        }
  	        else {
  	            this.expect(')');
  	            if (this.match(';')) {
  	                this.nextToken();
  	            }
  	        }
  	        return this.finalize(node, new Node.DoWhileStatement(body, test));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-while-statement
  	    Parser.prototype.parseWhileStatement = function () {
  	        var node = this.createNode();
  	        var body;
  	        this.expectKeyword('while');
  	        this.expect('(');
  	        var test = this.parseExpression();
  	        if (!this.match(')') && this.config.tolerant) {
  	            this.tolerateUnexpectedToken(this.nextToken());
  	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
  	        }
  	        else {
  	            this.expect(')');
  	            var previousInIteration = this.context.inIteration;
  	            this.context.inIteration = true;
  	            body = this.parseStatement();
  	            this.context.inIteration = previousInIteration;
  	        }
  	        return this.finalize(node, new Node.WhileStatement(test, body));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-for-statement
  	    // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements
  	    Parser.prototype.parseForStatement = function () {
  	        var init = null;
  	        var test = null;
  	        var update = null;
  	        var forIn = true;
  	        var left, right;
  	        var node = this.createNode();
  	        this.expectKeyword('for');
  	        this.expect('(');
  	        if (this.match(';')) {
  	            this.nextToken();
  	        }
  	        else {
  	            if (this.matchKeyword('var')) {
  	                init = this.createNode();
  	                this.nextToken();
  	                var previousAllowIn = this.context.allowIn;
  	                this.context.allowIn = false;
  	                var declarations = this.parseVariableDeclarationList({ inFor: true });
  	                this.context.allowIn = previousAllowIn;
  	                if (declarations.length === 1 && this.matchKeyword('in')) {
  	                    var decl = declarations[0];
  	                    if (decl.init && (decl.id.type === syntax_1.Syntax.ArrayPattern || decl.id.type === syntax_1.Syntax.ObjectPattern || this.context.strict)) {
  	                        this.tolerateError(messages_1.Messages.ForInOfLoopInitializer, 'for-in');
  	                    }
  	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
  	                    this.nextToken();
  	                    left = init;
  	                    right = this.parseExpression();
  	                    init = null;
  	                }
  	                else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
  	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
  	                    this.nextToken();
  	                    left = init;
  	                    right = this.parseAssignmentExpression();
  	                    init = null;
  	                    forIn = false;
  	                }
  	                else {
  	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
  	                    this.expect(';');
  	                }
  	            }
  	            else if (this.matchKeyword('const') || this.matchKeyword('let')) {
  	                init = this.createNode();
  	                var kind = this.nextToken().value;
  	                if (!this.context.strict && this.lookahead.value === 'in') {
  	                    init = this.finalize(init, new Node.Identifier(kind));
  	                    this.nextToken();
  	                    left = init;
  	                    right = this.parseExpression();
  	                    init = null;
  	                }
  	                else {
  	                    var previousAllowIn = this.context.allowIn;
  	                    this.context.allowIn = false;
  	                    var declarations = this.parseBindingList(kind, { inFor: true });
  	                    this.context.allowIn = previousAllowIn;
  	                    if (declarations.length === 1 && declarations[0].init === null && this.matchKeyword('in')) {
  	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
  	                        this.nextToken();
  	                        left = init;
  	                        right = this.parseExpression();
  	                        init = null;
  	                    }
  	                    else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
  	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
  	                        this.nextToken();
  	                        left = init;
  	                        right = this.parseAssignmentExpression();
  	                        init = null;
  	                        forIn = false;
  	                    }
  	                    else {
  	                        this.consumeSemicolon();
  	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
  	                    }
  	                }
  	            }
  	            else {
  	                var initStartToken = this.lookahead;
  	                var previousAllowIn = this.context.allowIn;
  	                this.context.allowIn = false;
  	                init = this.inheritCoverGrammar(this.parseAssignmentExpression);
  	                this.context.allowIn = previousAllowIn;
  	                if (this.matchKeyword('in')) {
  	                    if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
  	                        this.tolerateError(messages_1.Messages.InvalidLHSInForIn);
  	                    }
  	                    this.nextToken();
  	                    this.reinterpretExpressionAsPattern(init);
  	                    left = init;
  	                    right = this.parseExpression();
  	                    init = null;
  	                }
  	                else if (this.matchContextualKeyword('of')) {
  	                    if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
  	                        this.tolerateError(messages_1.Messages.InvalidLHSInForLoop);
  	                    }
  	                    this.nextToken();
  	                    this.reinterpretExpressionAsPattern(init);
  	                    left = init;
  	                    right = this.parseAssignmentExpression();
  	                    init = null;
  	                    forIn = false;
  	                }
  	                else {
  	                    if (this.match(',')) {
  	                        var initSeq = [init];
  	                        while (this.match(',')) {
  	                            this.nextToken();
  	                            initSeq.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
  	                        }
  	                        init = this.finalize(this.startNode(initStartToken), new Node.SequenceExpression(initSeq));
  	                    }
  	                    this.expect(';');
  	                }
  	            }
  	        }
  	        if (typeof left === 'undefined') {
  	            if (!this.match(';')) {
  	                test = this.parseExpression();
  	            }
  	            this.expect(';');
  	            if (!this.match(')')) {
  	                update = this.parseExpression();
  	            }
  	        }
  	        var body;
  	        if (!this.match(')') && this.config.tolerant) {
  	            this.tolerateUnexpectedToken(this.nextToken());
  	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
  	        }
  	        else {
  	            this.expect(')');
  	            var previousInIteration = this.context.inIteration;
  	            this.context.inIteration = true;
  	            body = this.isolateCoverGrammar(this.parseStatement);
  	            this.context.inIteration = previousInIteration;
  	        }
  	        return (typeof left === 'undefined') ?
  	            this.finalize(node, new Node.ForStatement(init, test, update, body)) :
  	            forIn ? this.finalize(node, new Node.ForInStatement(left, right, body)) :
  	                this.finalize(node, new Node.ForOfStatement(left, right, body));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-continue-statement
  	    Parser.prototype.parseContinueStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('continue');
  	        var label = null;
  	        if (this.lookahead.type === 3 /* Identifier */ && !this.hasLineTerminator) {
  	            var id = this.parseVariableIdentifier();
  	            label = id;
  	            var key = '$' + id.name;
  	            if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
  	                this.throwError(messages_1.Messages.UnknownLabel, id.name);
  	            }
  	        }
  	        this.consumeSemicolon();
  	        if (label === null && !this.context.inIteration) {
  	            this.throwError(messages_1.Messages.IllegalContinue);
  	        }
  	        return this.finalize(node, new Node.ContinueStatement(label));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-break-statement
  	    Parser.prototype.parseBreakStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('break');
  	        var label = null;
  	        if (this.lookahead.type === 3 /* Identifier */ && !this.hasLineTerminator) {
  	            var id = this.parseVariableIdentifier();
  	            var key = '$' + id.name;
  	            if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
  	                this.throwError(messages_1.Messages.UnknownLabel, id.name);
  	            }
  	            label = id;
  	        }
  	        this.consumeSemicolon();
  	        if (label === null && !this.context.inIteration && !this.context.inSwitch) {
  	            this.throwError(messages_1.Messages.IllegalBreak);
  	        }
  	        return this.finalize(node, new Node.BreakStatement(label));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-return-statement
  	    Parser.prototype.parseReturnStatement = function () {
  	        if (!this.context.inFunctionBody) {
  	            this.tolerateError(messages_1.Messages.IllegalReturn);
  	        }
  	        var node = this.createNode();
  	        this.expectKeyword('return');
  	        var hasArgument = (!this.match(';') && !this.match('}') &&
  	            !this.hasLineTerminator && this.lookahead.type !== 2 /* EOF */) ||
  	            this.lookahead.type === 8 /* StringLiteral */ ||
  	            this.lookahead.type === 10 /* Template */;
  	        var argument = hasArgument ? this.parseExpression() : null;
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.ReturnStatement(argument));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-with-statement
  	    Parser.prototype.parseWithStatement = function () {
  	        if (this.context.strict) {
  	            this.tolerateError(messages_1.Messages.StrictModeWith);
  	        }
  	        var node = this.createNode();
  	        var body;
  	        this.expectKeyword('with');
  	        this.expect('(');
  	        var object = this.parseExpression();
  	        if (!this.match(')') && this.config.tolerant) {
  	            this.tolerateUnexpectedToken(this.nextToken());
  	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
  	        }
  	        else {
  	            this.expect(')');
  	            body = this.parseStatement();
  	        }
  	        return this.finalize(node, new Node.WithStatement(object, body));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-switch-statement
  	    Parser.prototype.parseSwitchCase = function () {
  	        var node = this.createNode();
  	        var test;
  	        if (this.matchKeyword('default')) {
  	            this.nextToken();
  	            test = null;
  	        }
  	        else {
  	            this.expectKeyword('case');
  	            test = this.parseExpression();
  	        }
  	        this.expect(':');
  	        var consequent = [];
  	        while (true) {
  	            if (this.match('}') || this.matchKeyword('default') || this.matchKeyword('case')) {
  	                break;
  	            }
  	            consequent.push(this.parseStatementListItem());
  	        }
  	        return this.finalize(node, new Node.SwitchCase(test, consequent));
  	    };
  	    Parser.prototype.parseSwitchStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('switch');
  	        this.expect('(');
  	        var discriminant = this.parseExpression();
  	        this.expect(')');
  	        var previousInSwitch = this.context.inSwitch;
  	        this.context.inSwitch = true;
  	        var cases = [];
  	        var defaultFound = false;
  	        this.expect('{');
  	        while (true) {
  	            if (this.match('}')) {
  	                break;
  	            }
  	            var clause = this.parseSwitchCase();
  	            if (clause.test === null) {
  	                if (defaultFound) {
  	                    this.throwError(messages_1.Messages.MultipleDefaultsInSwitch);
  	                }
  	                defaultFound = true;
  	            }
  	            cases.push(clause);
  	        }
  	        this.expect('}');
  	        this.context.inSwitch = previousInSwitch;
  	        return this.finalize(node, new Node.SwitchStatement(discriminant, cases));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-labelled-statements
  	    Parser.prototype.parseLabelledStatement = function () {
  	        var node = this.createNode();
  	        var expr = this.parseExpression();
  	        var statement;
  	        if ((expr.type === syntax_1.Syntax.Identifier) && this.match(':')) {
  	            this.nextToken();
  	            var id = expr;
  	            var key = '$' + id.name;
  	            if (Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
  	                this.throwError(messages_1.Messages.Redeclaration, 'Label', id.name);
  	            }
  	            this.context.labelSet[key] = true;
  	            var body = void 0;
  	            if (this.matchKeyword('class')) {
  	                this.tolerateUnexpectedToken(this.lookahead);
  	                body = this.parseClassDeclaration();
  	            }
  	            else if (this.matchKeyword('function')) {
  	                var token = this.lookahead;
  	                var declaration = this.parseFunctionDeclaration();
  	                if (this.context.strict) {
  	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunction);
  	                }
  	                else if (declaration.generator) {
  	                    this.tolerateUnexpectedToken(token, messages_1.Messages.GeneratorInLegacyContext);
  	                }
  	                body = declaration;
  	            }
  	            else {
  	                body = this.parseStatement();
  	            }
  	            delete this.context.labelSet[key];
  	            statement = new Node.LabeledStatement(id, body);
  	        }
  	        else {
  	            this.consumeSemicolon();
  	            statement = new Node.ExpressionStatement(expr);
  	        }
  	        return this.finalize(node, statement);
  	    };
  	    // https://tc39.github.io/ecma262/#sec-throw-statement
  	    Parser.prototype.parseThrowStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('throw');
  	        if (this.hasLineTerminator) {
  	            this.throwError(messages_1.Messages.NewlineAfterThrow);
  	        }
  	        var argument = this.parseExpression();
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.ThrowStatement(argument));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-try-statement
  	    Parser.prototype.parseCatchClause = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('catch');
  	        this.expect('(');
  	        if (this.match(')')) {
  	            this.throwUnexpectedToken(this.lookahead);
  	        }
  	        var params = [];
  	        var param = this.parsePattern(params);
  	        var paramMap = {};
  	        for (var i = 0; i < params.length; i++) {
  	            var key = '$' + params[i].value;
  	            if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
  	                this.tolerateError(messages_1.Messages.DuplicateBinding, params[i].value);
  	            }
  	            paramMap[key] = true;
  	        }
  	        if (this.context.strict && param.type === syntax_1.Syntax.Identifier) {
  	            if (this.scanner.isRestrictedWord(param.name)) {
  	                this.tolerateError(messages_1.Messages.StrictCatchVariable);
  	            }
  	        }
  	        this.expect(')');
  	        var body = this.parseBlock();
  	        return this.finalize(node, new Node.CatchClause(param, body));
  	    };
  	    Parser.prototype.parseFinallyClause = function () {
  	        this.expectKeyword('finally');
  	        return this.parseBlock();
  	    };
  	    Parser.prototype.parseTryStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('try');
  	        var block = this.parseBlock();
  	        var handler = this.matchKeyword('catch') ? this.parseCatchClause() : null;
  	        var finalizer = this.matchKeyword('finally') ? this.parseFinallyClause() : null;
  	        if (!handler && !finalizer) {
  	            this.throwError(messages_1.Messages.NoCatchOrFinally);
  	        }
  	        return this.finalize(node, new Node.TryStatement(block, handler, finalizer));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-debugger-statement
  	    Parser.prototype.parseDebuggerStatement = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('debugger');
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.DebuggerStatement());
  	    };
  	    // https://tc39.github.io/ecma262/#sec-ecmascript-language-statements-and-declarations
  	    Parser.prototype.parseStatement = function () {
  	        var statement;
  	        switch (this.lookahead.type) {
  	            case 1 /* BooleanLiteral */:
  	            case 5 /* NullLiteral */:
  	            case 6 /* NumericLiteral */:
  	            case 8 /* StringLiteral */:
  	            case 10 /* Template */:
  	            case 9 /* RegularExpression */:
  	                statement = this.parseExpressionStatement();
  	                break;
  	            case 7 /* Punctuator */:
  	                var value = this.lookahead.value;
  	                if (value === '{') {
  	                    statement = this.parseBlock();
  	                }
  	                else if (value === '(') {
  	                    statement = this.parseExpressionStatement();
  	                }
  	                else if (value === ';') {
  	                    statement = this.parseEmptyStatement();
  	                }
  	                else {
  	                    statement = this.parseExpressionStatement();
  	                }
  	                break;
  	            case 3 /* Identifier */:
  	                statement = this.matchAsyncFunction() ? this.parseFunctionDeclaration() : this.parseLabelledStatement();
  	                break;
  	            case 4 /* Keyword */:
  	                switch (this.lookahead.value) {
  	                    case 'break':
  	                        statement = this.parseBreakStatement();
  	                        break;
  	                    case 'continue':
  	                        statement = this.parseContinueStatement();
  	                        break;
  	                    case 'debugger':
  	                        statement = this.parseDebuggerStatement();
  	                        break;
  	                    case 'do':
  	                        statement = this.parseDoWhileStatement();
  	                        break;
  	                    case 'for':
  	                        statement = this.parseForStatement();
  	                        break;
  	                    case 'function':
  	                        statement = this.parseFunctionDeclaration();
  	                        break;
  	                    case 'if':
  	                        statement = this.parseIfStatement();
  	                        break;
  	                    case 'return':
  	                        statement = this.parseReturnStatement();
  	                        break;
  	                    case 'switch':
  	                        statement = this.parseSwitchStatement();
  	                        break;
  	                    case 'throw':
  	                        statement = this.parseThrowStatement();
  	                        break;
  	                    case 'try':
  	                        statement = this.parseTryStatement();
  	                        break;
  	                    case 'var':
  	                        statement = this.parseVariableStatement();
  	                        break;
  	                    case 'while':
  	                        statement = this.parseWhileStatement();
  	                        break;
  	                    case 'with':
  	                        statement = this.parseWithStatement();
  	                        break;
  	                    default:
  	                        statement = this.parseExpressionStatement();
  	                        break;
  	                }
  	                break;
  	            default:
  	                statement = this.throwUnexpectedToken(this.lookahead);
  	        }
  	        return statement;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-function-definitions
  	    Parser.prototype.parseFunctionSourceElements = function () {
  	        var node = this.createNode();
  	        this.expect('{');
  	        var body = this.parseDirectivePrologues();
  	        var previousLabelSet = this.context.labelSet;
  	        var previousInIteration = this.context.inIteration;
  	        var previousInSwitch = this.context.inSwitch;
  	        var previousInFunctionBody = this.context.inFunctionBody;
  	        this.context.labelSet = {};
  	        this.context.inIteration = false;
  	        this.context.inSwitch = false;
  	        this.context.inFunctionBody = true;
  	        while (this.lookahead.type !== 2 /* EOF */) {
  	            if (this.match('}')) {
  	                break;
  	            }
  	            body.push(this.parseStatementListItem());
  	        }
  	        this.expect('}');
  	        this.context.labelSet = previousLabelSet;
  	        this.context.inIteration = previousInIteration;
  	        this.context.inSwitch = previousInSwitch;
  	        this.context.inFunctionBody = previousInFunctionBody;
  	        return this.finalize(node, new Node.BlockStatement(body));
  	    };
  	    Parser.prototype.validateParam = function (options, param, name) {
  	        var key = '$' + name;
  	        if (this.context.strict) {
  	            if (this.scanner.isRestrictedWord(name)) {
  	                options.stricted = param;
  	                options.message = messages_1.Messages.StrictParamName;
  	            }
  	            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
  	                options.stricted = param;
  	                options.message = messages_1.Messages.StrictParamDupe;
  	            }
  	        }
  	        else if (!options.firstRestricted) {
  	            if (this.scanner.isRestrictedWord(name)) {
  	                options.firstRestricted = param;
  	                options.message = messages_1.Messages.StrictParamName;
  	            }
  	            else if (this.scanner.isStrictModeReservedWord(name)) {
  	                options.firstRestricted = param;
  	                options.message = messages_1.Messages.StrictReservedWord;
  	            }
  	            else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
  	                options.stricted = param;
  	                options.message = messages_1.Messages.StrictParamDupe;
  	            }
  	        }
  	        /* istanbul ignore next */
  	        if (typeof Object.defineProperty === 'function') {
  	            Object.defineProperty(options.paramSet, key, { value: true, enumerable: true, writable: true, configurable: true });
  	        }
  	        else {
  	            options.paramSet[key] = true;
  	        }
  	    };
  	    Parser.prototype.parseRestElement = function (params) {
  	        var node = this.createNode();
  	        this.expect('...');
  	        var arg = this.parsePattern(params);
  	        if (this.match('=')) {
  	            this.throwError(messages_1.Messages.DefaultRestParameter);
  	        }
  	        if (!this.match(')')) {
  	            this.throwError(messages_1.Messages.ParameterAfterRestParameter);
  	        }
  	        return this.finalize(node, new Node.RestElement(arg));
  	    };
  	    Parser.prototype.parseFormalParameter = function (options) {
  	        var params = [];
  	        var param = this.match('...') ? this.parseRestElement(params) : this.parsePatternWithDefault(params);
  	        for (var i = 0; i < params.length; i++) {
  	            this.validateParam(options, params[i], params[i].value);
  	        }
  	        options.simple = options.simple && (param instanceof Node.Identifier);
  	        options.params.push(param);
  	    };
  	    Parser.prototype.parseFormalParameters = function (firstRestricted) {
  	        var options;
  	        options = {
  	            simple: true,
  	            params: [],
  	            firstRestricted: firstRestricted
  	        };
  	        this.expect('(');
  	        if (!this.match(')')) {
  	            options.paramSet = {};
  	            while (this.lookahead.type !== 2 /* EOF */) {
  	                this.parseFormalParameter(options);
  	                if (this.match(')')) {
  	                    break;
  	                }
  	                this.expect(',');
  	                if (this.match(')')) {
  	                    break;
  	                }
  	            }
  	        }
  	        this.expect(')');
  	        return {
  	            simple: options.simple,
  	            params: options.params,
  	            stricted: options.stricted,
  	            firstRestricted: options.firstRestricted,
  	            message: options.message
  	        };
  	    };
  	    Parser.prototype.matchAsyncFunction = function () {
  	        var match = this.matchContextualKeyword('async');
  	        if (match) {
  	            var state = this.scanner.saveState();
  	            this.scanner.scanComments();
  	            var next = this.scanner.lex();
  	            this.scanner.restoreState(state);
  	            match = (state.lineNumber === next.lineNumber) && (next.type === 4 /* Keyword */) && (next.value === 'function');
  	        }
  	        return match;
  	    };
  	    Parser.prototype.parseFunctionDeclaration = function (identifierIsOptional) {
  	        var node = this.createNode();
  	        var isAsync = this.matchContextualKeyword('async');
  	        if (isAsync) {
  	            this.nextToken();
  	        }
  	        this.expectKeyword('function');
  	        var isGenerator = isAsync ? false : this.match('*');
  	        if (isGenerator) {
  	            this.nextToken();
  	        }
  	        var message;
  	        var id = null;
  	        var firstRestricted = null;
  	        if (!identifierIsOptional || !this.match('(')) {
  	            var token = this.lookahead;
  	            id = this.parseVariableIdentifier();
  	            if (this.context.strict) {
  	                if (this.scanner.isRestrictedWord(token.value)) {
  	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
  	                }
  	            }
  	            else {
  	                if (this.scanner.isRestrictedWord(token.value)) {
  	                    firstRestricted = token;
  	                    message = messages_1.Messages.StrictFunctionName;
  	                }
  	                else if (this.scanner.isStrictModeReservedWord(token.value)) {
  	                    firstRestricted = token;
  	                    message = messages_1.Messages.StrictReservedWord;
  	                }
  	            }
  	        }
  	        var previousAllowAwait = this.context.await;
  	        var previousAllowYield = this.context.allowYield;
  	        this.context.await = isAsync;
  	        this.context.allowYield = !isGenerator;
  	        var formalParameters = this.parseFormalParameters(firstRestricted);
  	        var params = formalParameters.params;
  	        var stricted = formalParameters.stricted;
  	        firstRestricted = formalParameters.firstRestricted;
  	        if (formalParameters.message) {
  	            message = formalParameters.message;
  	        }
  	        var previousStrict = this.context.strict;
  	        var previousAllowStrictDirective = this.context.allowStrictDirective;
  	        this.context.allowStrictDirective = formalParameters.simple;
  	        var body = this.parseFunctionSourceElements();
  	        if (this.context.strict && firstRestricted) {
  	            this.throwUnexpectedToken(firstRestricted, message);
  	        }
  	        if (this.context.strict && stricted) {
  	            this.tolerateUnexpectedToken(stricted, message);
  	        }
  	        this.context.strict = previousStrict;
  	        this.context.allowStrictDirective = previousAllowStrictDirective;
  	        this.context.await = previousAllowAwait;
  	        this.context.allowYield = previousAllowYield;
  	        return isAsync ? this.finalize(node, new Node.AsyncFunctionDeclaration(id, params, body)) :
  	            this.finalize(node, new Node.FunctionDeclaration(id, params, body, isGenerator));
  	    };
  	    Parser.prototype.parseFunctionExpression = function () {
  	        var node = this.createNode();
  	        var isAsync = this.matchContextualKeyword('async');
  	        if (isAsync) {
  	            this.nextToken();
  	        }
  	        this.expectKeyword('function');
  	        var isGenerator = isAsync ? false : this.match('*');
  	        if (isGenerator) {
  	            this.nextToken();
  	        }
  	        var message;
  	        var id = null;
  	        var firstRestricted;
  	        var previousAllowAwait = this.context.await;
  	        var previousAllowYield = this.context.allowYield;
  	        this.context.await = isAsync;
  	        this.context.allowYield = !isGenerator;
  	        if (!this.match('(')) {
  	            var token = this.lookahead;
  	            id = (!this.context.strict && !isGenerator && this.matchKeyword('yield')) ? this.parseIdentifierName() : this.parseVariableIdentifier();
  	            if (this.context.strict) {
  	                if (this.scanner.isRestrictedWord(token.value)) {
  	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
  	                }
  	            }
  	            else {
  	                if (this.scanner.isRestrictedWord(token.value)) {
  	                    firstRestricted = token;
  	                    message = messages_1.Messages.StrictFunctionName;
  	                }
  	                else if (this.scanner.isStrictModeReservedWord(token.value)) {
  	                    firstRestricted = token;
  	                    message = messages_1.Messages.StrictReservedWord;
  	                }
  	            }
  	        }
  	        var formalParameters = this.parseFormalParameters(firstRestricted);
  	        var params = formalParameters.params;
  	        var stricted = formalParameters.stricted;
  	        firstRestricted = formalParameters.firstRestricted;
  	        if (formalParameters.message) {
  	            message = formalParameters.message;
  	        }
  	        var previousStrict = this.context.strict;
  	        var previousAllowStrictDirective = this.context.allowStrictDirective;
  	        this.context.allowStrictDirective = formalParameters.simple;
  	        var body = this.parseFunctionSourceElements();
  	        if (this.context.strict && firstRestricted) {
  	            this.throwUnexpectedToken(firstRestricted, message);
  	        }
  	        if (this.context.strict && stricted) {
  	            this.tolerateUnexpectedToken(stricted, message);
  	        }
  	        this.context.strict = previousStrict;
  	        this.context.allowStrictDirective = previousAllowStrictDirective;
  	        this.context.await = previousAllowAwait;
  	        this.context.allowYield = previousAllowYield;
  	        return isAsync ? this.finalize(node, new Node.AsyncFunctionExpression(id, params, body)) :
  	            this.finalize(node, new Node.FunctionExpression(id, params, body, isGenerator));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive
  	    Parser.prototype.parseDirective = function () {
  	        var token = this.lookahead;
  	        var node = this.createNode();
  	        var expr = this.parseExpression();
  	        var directive = (expr.type === syntax_1.Syntax.Literal) ? this.getTokenRaw(token).slice(1, -1) : null;
  	        this.consumeSemicolon();
  	        return this.finalize(node, directive ? new Node.Directive(expr, directive) : new Node.ExpressionStatement(expr));
  	    };
  	    Parser.prototype.parseDirectivePrologues = function () {
  	        var firstRestricted = null;
  	        var body = [];
  	        while (true) {
  	            var token = this.lookahead;
  	            if (token.type !== 8 /* StringLiteral */) {
  	                break;
  	            }
  	            var statement = this.parseDirective();
  	            body.push(statement);
  	            var directive = statement.directive;
  	            if (typeof directive !== 'string') {
  	                break;
  	            }
  	            if (directive === 'use strict') {
  	                this.context.strict = true;
  	                if (firstRestricted) {
  	                    this.tolerateUnexpectedToken(firstRestricted, messages_1.Messages.StrictOctalLiteral);
  	                }
  	                if (!this.context.allowStrictDirective) {
  	                    this.tolerateUnexpectedToken(token, messages_1.Messages.IllegalLanguageModeDirective);
  	                }
  	            }
  	            else {
  	                if (!firstRestricted && token.octal) {
  	                    firstRestricted = token;
  	                }
  	            }
  	        }
  	        return body;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-method-definitions
  	    Parser.prototype.qualifiedPropertyName = function (token) {
  	        switch (token.type) {
  	            case 3 /* Identifier */:
  	            case 8 /* StringLiteral */:
  	            case 1 /* BooleanLiteral */:
  	            case 5 /* NullLiteral */:
  	            case 6 /* NumericLiteral */:
  	            case 4 /* Keyword */:
  	                return true;
  	            case 7 /* Punctuator */:
  	                return token.value === '[';
  	            default:
  	                break;
  	        }
  	        return false;
  	    };
  	    Parser.prototype.parseGetterMethod = function () {
  	        var node = this.createNode();
  	        var isGenerator = false;
  	        var previousAllowYield = this.context.allowYield;
  	        this.context.allowYield = !isGenerator;
  	        var formalParameters = this.parseFormalParameters();
  	        if (formalParameters.params.length > 0) {
  	            this.tolerateError(messages_1.Messages.BadGetterArity);
  	        }
  	        var method = this.parsePropertyMethod(formalParameters);
  	        this.context.allowYield = previousAllowYield;
  	        return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
  	    };
  	    Parser.prototype.parseSetterMethod = function () {
  	        var node = this.createNode();
  	        var isGenerator = false;
  	        var previousAllowYield = this.context.allowYield;
  	        this.context.allowYield = !isGenerator;
  	        var formalParameters = this.parseFormalParameters();
  	        if (formalParameters.params.length !== 1) {
  	            this.tolerateError(messages_1.Messages.BadSetterArity);
  	        }
  	        else if (formalParameters.params[0] instanceof Node.RestElement) {
  	            this.tolerateError(messages_1.Messages.BadSetterRestParameter);
  	        }
  	        var method = this.parsePropertyMethod(formalParameters);
  	        this.context.allowYield = previousAllowYield;
  	        return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
  	    };
  	    Parser.prototype.parseGeneratorMethod = function () {
  	        var node = this.createNode();
  	        var isGenerator = true;
  	        var previousAllowYield = this.context.allowYield;
  	        this.context.allowYield = true;
  	        var params = this.parseFormalParameters();
  	        this.context.allowYield = false;
  	        var method = this.parsePropertyMethod(params);
  	        this.context.allowYield = previousAllowYield;
  	        return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-generator-function-definitions
  	    Parser.prototype.isStartOfExpression = function () {
  	        var start = true;
  	        var value = this.lookahead.value;
  	        switch (this.lookahead.type) {
  	            case 7 /* Punctuator */:
  	                start = (value === '[') || (value === '(') || (value === '{') ||
  	                    (value === '+') || (value === '-') ||
  	                    (value === '!') || (value === '~') ||
  	                    (value === '++') || (value === '--') ||
  	                    (value === '/') || (value === '/='); // regular expression literal
  	                break;
  	            case 4 /* Keyword */:
  	                start = (value === 'class') || (value === 'delete') ||
  	                    (value === 'function') || (value === 'let') || (value === 'new') ||
  	                    (value === 'super') || (value === 'this') || (value === 'typeof') ||
  	                    (value === 'void') || (value === 'yield');
  	                break;
  	            default:
  	                break;
  	        }
  	        return start;
  	    };
  	    Parser.prototype.parseYieldExpression = function () {
  	        var node = this.createNode();
  	        this.expectKeyword('yield');
  	        var argument = null;
  	        var delegate = false;
  	        if (!this.hasLineTerminator) {
  	            var previousAllowYield = this.context.allowYield;
  	            this.context.allowYield = false;
  	            delegate = this.match('*');
  	            if (delegate) {
  	                this.nextToken();
  	                argument = this.parseAssignmentExpression();
  	            }
  	            else if (this.isStartOfExpression()) {
  	                argument = this.parseAssignmentExpression();
  	            }
  	            this.context.allowYield = previousAllowYield;
  	        }
  	        return this.finalize(node, new Node.YieldExpression(argument, delegate));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-class-definitions
  	    Parser.prototype.parseClassElement = function (hasConstructor) {
  	        var token = this.lookahead;
  	        var node = this.createNode();
  	        var kind = '';
  	        var key = null;
  	        var value = null;
  	        var computed = false;
  	        var method = false;
  	        var isStatic = false;
  	        var isAsync = false;
  	        if (this.match('*')) {
  	            this.nextToken();
  	        }
  	        else {
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	            var id = key;
  	            if (id.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*'))) {
  	                token = this.lookahead;
  	                isStatic = true;
  	                computed = this.match('[');
  	                if (this.match('*')) {
  	                    this.nextToken();
  	                }
  	                else {
  	                    key = this.parseObjectPropertyKey();
  	                }
  	            }
  	            if ((token.type === 3 /* Identifier */) && !this.hasLineTerminator && (token.value === 'async')) {
  	                var punctuator = this.lookahead.value;
  	                if (punctuator !== ':' && punctuator !== '(' && punctuator !== '*') {
  	                    isAsync = true;
  	                    token = this.lookahead;
  	                    key = this.parseObjectPropertyKey();
  	                    if (token.type === 3 /* Identifier */ && token.value === 'constructor') {
  	                        this.tolerateUnexpectedToken(token, messages_1.Messages.ConstructorIsAsync);
  	                    }
  	                }
  	            }
  	        }
  	        var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
  	        if (token.type === 3 /* Identifier */) {
  	            if (token.value === 'get' && lookaheadPropertyKey) {
  	                kind = 'get';
  	                computed = this.match('[');
  	                key = this.parseObjectPropertyKey();
  	                this.context.allowYield = false;
  	                value = this.parseGetterMethod();
  	            }
  	            else if (token.value === 'set' && lookaheadPropertyKey) {
  	                kind = 'set';
  	                computed = this.match('[');
  	                key = this.parseObjectPropertyKey();
  	                value = this.parseSetterMethod();
  	            }
  	        }
  	        else if (token.type === 7 /* Punctuator */ && token.value === '*' && lookaheadPropertyKey) {
  	            kind = 'init';
  	            computed = this.match('[');
  	            key = this.parseObjectPropertyKey();
  	            value = this.parseGeneratorMethod();
  	            method = true;
  	        }
  	        if (!kind && key && this.match('(')) {
  	            kind = 'init';
  	            value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
  	            method = true;
  	        }
  	        if (!kind) {
  	            this.throwUnexpectedToken(this.lookahead);
  	        }
  	        if (kind === 'init') {
  	            kind = 'method';
  	        }
  	        if (!computed) {
  	            if (isStatic && this.isPropertyKey(key, 'prototype')) {
  	                this.throwUnexpectedToken(token, messages_1.Messages.StaticPrototype);
  	            }
  	            if (!isStatic && this.isPropertyKey(key, 'constructor')) {
  	                if (kind !== 'method' || !method || (value && value.generator)) {
  	                    this.throwUnexpectedToken(token, messages_1.Messages.ConstructorSpecialMethod);
  	                }
  	                if (hasConstructor.value) {
  	                    this.throwUnexpectedToken(token, messages_1.Messages.DuplicateConstructor);
  	                }
  	                else {
  	                    hasConstructor.value = true;
  	                }
  	                kind = 'constructor';
  	            }
  	        }
  	        return this.finalize(node, new Node.MethodDefinition(key, computed, value, kind, isStatic));
  	    };
  	    Parser.prototype.parseClassElementList = function () {
  	        var body = [];
  	        var hasConstructor = { value: false };
  	        this.expect('{');
  	        while (!this.match('}')) {
  	            if (this.match(';')) {
  	                this.nextToken();
  	            }
  	            else {
  	                body.push(this.parseClassElement(hasConstructor));
  	            }
  	        }
  	        this.expect('}');
  	        return body;
  	    };
  	    Parser.prototype.parseClassBody = function () {
  	        var node = this.createNode();
  	        var elementList = this.parseClassElementList();
  	        return this.finalize(node, new Node.ClassBody(elementList));
  	    };
  	    Parser.prototype.parseClassDeclaration = function (identifierIsOptional) {
  	        var node = this.createNode();
  	        var previousStrict = this.context.strict;
  	        this.context.strict = true;
  	        this.expectKeyword('class');
  	        var id = (identifierIsOptional && (this.lookahead.type !== 3 /* Identifier */)) ? null : this.parseVariableIdentifier();
  	        var superClass = null;
  	        if (this.matchKeyword('extends')) {
  	            this.nextToken();
  	            superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
  	        }
  	        var classBody = this.parseClassBody();
  	        this.context.strict = previousStrict;
  	        return this.finalize(node, new Node.ClassDeclaration(id, superClass, classBody));
  	    };
  	    Parser.prototype.parseClassExpression = function () {
  	        var node = this.createNode();
  	        var previousStrict = this.context.strict;
  	        this.context.strict = true;
  	        this.expectKeyword('class');
  	        var id = (this.lookahead.type === 3 /* Identifier */) ? this.parseVariableIdentifier() : null;
  	        var superClass = null;
  	        if (this.matchKeyword('extends')) {
  	            this.nextToken();
  	            superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
  	        }
  	        var classBody = this.parseClassBody();
  	        this.context.strict = previousStrict;
  	        return this.finalize(node, new Node.ClassExpression(id, superClass, classBody));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-scripts
  	    // https://tc39.github.io/ecma262/#sec-modules
  	    Parser.prototype.parseModule = function () {
  	        this.context.strict = true;
  	        this.context.isModule = true;
  	        this.scanner.isModule = true;
  	        var node = this.createNode();
  	        var body = this.parseDirectivePrologues();
  	        while (this.lookahead.type !== 2 /* EOF */) {
  	            body.push(this.parseStatementListItem());
  	        }
  	        return this.finalize(node, new Node.Module(body));
  	    };
  	    Parser.prototype.parseScript = function () {
  	        var node = this.createNode();
  	        var body = this.parseDirectivePrologues();
  	        while (this.lookahead.type !== 2 /* EOF */) {
  	            body.push(this.parseStatementListItem());
  	        }
  	        return this.finalize(node, new Node.Script(body));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-imports
  	    Parser.prototype.parseModuleSpecifier = function () {
  	        var node = this.createNode();
  	        if (this.lookahead.type !== 8 /* StringLiteral */) {
  	            this.throwError(messages_1.Messages.InvalidModuleSpecifier);
  	        }
  	        var token = this.nextToken();
  	        var raw = this.getTokenRaw(token);
  	        return this.finalize(node, new Node.Literal(token.value, raw));
  	    };
  	    // import {<foo as bar>} ...;
  	    Parser.prototype.parseImportSpecifier = function () {
  	        var node = this.createNode();
  	        var imported;
  	        var local;
  	        if (this.lookahead.type === 3 /* Identifier */) {
  	            imported = this.parseVariableIdentifier();
  	            local = imported;
  	            if (this.matchContextualKeyword('as')) {
  	                this.nextToken();
  	                local = this.parseVariableIdentifier();
  	            }
  	        }
  	        else {
  	            imported = this.parseIdentifierName();
  	            local = imported;
  	            if (this.matchContextualKeyword('as')) {
  	                this.nextToken();
  	                local = this.parseVariableIdentifier();
  	            }
  	            else {
  	                this.throwUnexpectedToken(this.nextToken());
  	            }
  	        }
  	        return this.finalize(node, new Node.ImportSpecifier(local, imported));
  	    };
  	    // {foo, bar as bas}
  	    Parser.prototype.parseNamedImports = function () {
  	        this.expect('{');
  	        var specifiers = [];
  	        while (!this.match('}')) {
  	            specifiers.push(this.parseImportSpecifier());
  	            if (!this.match('}')) {
  	                this.expect(',');
  	            }
  	        }
  	        this.expect('}');
  	        return specifiers;
  	    };
  	    // import <foo> ...;
  	    Parser.prototype.parseImportDefaultSpecifier = function () {
  	        var node = this.createNode();
  	        var local = this.parseIdentifierName();
  	        return this.finalize(node, new Node.ImportDefaultSpecifier(local));
  	    };
  	    // import <* as foo> ...;
  	    Parser.prototype.parseImportNamespaceSpecifier = function () {
  	        var node = this.createNode();
  	        this.expect('*');
  	        if (!this.matchContextualKeyword('as')) {
  	            this.throwError(messages_1.Messages.NoAsAfterImportNamespace);
  	        }
  	        this.nextToken();
  	        var local = this.parseIdentifierName();
  	        return this.finalize(node, new Node.ImportNamespaceSpecifier(local));
  	    };
  	    Parser.prototype.parseImportDeclaration = function () {
  	        if (this.context.inFunctionBody) {
  	            this.throwError(messages_1.Messages.IllegalImportDeclaration);
  	        }
  	        var node = this.createNode();
  	        this.expectKeyword('import');
  	        var src;
  	        var specifiers = [];
  	        if (this.lookahead.type === 8 /* StringLiteral */) {
  	            // import 'foo';
  	            src = this.parseModuleSpecifier();
  	        }
  	        else {
  	            if (this.match('{')) {
  	                // import {bar}
  	                specifiers = specifiers.concat(this.parseNamedImports());
  	            }
  	            else if (this.match('*')) {
  	                // import * as foo
  	                specifiers.push(this.parseImportNamespaceSpecifier());
  	            }
  	            else if (this.isIdentifierName(this.lookahead) && !this.matchKeyword('default')) {
  	                // import foo
  	                specifiers.push(this.parseImportDefaultSpecifier());
  	                if (this.match(',')) {
  	                    this.nextToken();
  	                    if (this.match('*')) {
  	                        // import foo, * as foo
  	                        specifiers.push(this.parseImportNamespaceSpecifier());
  	                    }
  	                    else if (this.match('{')) {
  	                        // import foo, {bar}
  	                        specifiers = specifiers.concat(this.parseNamedImports());
  	                    }
  	                    else {
  	                        this.throwUnexpectedToken(this.lookahead);
  	                    }
  	                }
  	            }
  	            else {
  	                this.throwUnexpectedToken(this.nextToken());
  	            }
  	            if (!this.matchContextualKeyword('from')) {
  	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
  	                this.throwError(message, this.lookahead.value);
  	            }
  	            this.nextToken();
  	            src = this.parseModuleSpecifier();
  	        }
  	        this.consumeSemicolon();
  	        return this.finalize(node, new Node.ImportDeclaration(specifiers, src));
  	    };
  	    // https://tc39.github.io/ecma262/#sec-exports
  	    Parser.prototype.parseExportSpecifier = function () {
  	        var node = this.createNode();
  	        var local = this.parseIdentifierName();
  	        var exported = local;
  	        if (this.matchContextualKeyword('as')) {
  	            this.nextToken();
  	            exported = this.parseIdentifierName();
  	        }
  	        return this.finalize(node, new Node.ExportSpecifier(local, exported));
  	    };
  	    Parser.prototype.parseExportDeclaration = function () {
  	        if (this.context.inFunctionBody) {
  	            this.throwError(messages_1.Messages.IllegalExportDeclaration);
  	        }
  	        var node = this.createNode();
  	        this.expectKeyword('export');
  	        var exportDeclaration;
  	        if (this.matchKeyword('default')) {
  	            // export default ...
  	            this.nextToken();
  	            if (this.matchKeyword('function')) {
  	                // export default function foo () {}
  	                // export default function () {}
  	                var declaration = this.parseFunctionDeclaration(true);
  	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
  	            }
  	            else if (this.matchKeyword('class')) {
  	                // export default class foo {}
  	                var declaration = this.parseClassDeclaration(true);
  	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
  	            }
  	            else if (this.matchContextualKeyword('async')) {
  	                // export default async function f () {}
  	                // export default async function () {}
  	                // export default async x => x
  	                var declaration = this.matchAsyncFunction() ? this.parseFunctionDeclaration(true) : this.parseAssignmentExpression();
  	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
  	            }
  	            else {
  	                if (this.matchContextualKeyword('from')) {
  	                    this.throwError(messages_1.Messages.UnexpectedToken, this.lookahead.value);
  	                }
  	                // export default {};
  	                // export default [];
  	                // export default (1 + 2);
  	                var declaration = this.match('{') ? this.parseObjectInitializer() :
  	                    this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
  	                this.consumeSemicolon();
  	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
  	            }
  	        }
  	        else if (this.match('*')) {
  	            // export * from 'foo';
  	            this.nextToken();
  	            if (!this.matchContextualKeyword('from')) {
  	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
  	                this.throwError(message, this.lookahead.value);
  	            }
  	            this.nextToken();
  	            var src = this.parseModuleSpecifier();
  	            this.consumeSemicolon();
  	            exportDeclaration = this.finalize(node, new Node.ExportAllDeclaration(src));
  	        }
  	        else if (this.lookahead.type === 4 /* Keyword */) {
  	            // export var f = 1;
  	            var declaration = void 0;
  	            switch (this.lookahead.value) {
  	                case 'let':
  	                case 'const':
  	                    declaration = this.parseLexicalDeclaration({ inFor: false });
  	                    break;
  	                case 'var':
  	                case 'class':
  	                case 'function':
  	                    declaration = this.parseStatementListItem();
  	                    break;
  	                default:
  	                    this.throwUnexpectedToken(this.lookahead);
  	            }
  	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
  	        }
  	        else if (this.matchAsyncFunction()) {
  	            var declaration = this.parseFunctionDeclaration();
  	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
  	        }
  	        else {
  	            var specifiers = [];
  	            var source = null;
  	            var isExportFromIdentifier = false;
  	            this.expect('{');
  	            while (!this.match('}')) {
  	                isExportFromIdentifier = isExportFromIdentifier || this.matchKeyword('default');
  	                specifiers.push(this.parseExportSpecifier());
  	                if (!this.match('}')) {
  	                    this.expect(',');
  	                }
  	            }
  	            this.expect('}');
  	            if (this.matchContextualKeyword('from')) {
  	                // export {default} from 'foo';
  	                // export {foo} from 'foo';
  	                this.nextToken();
  	                source = this.parseModuleSpecifier();
  	                this.consumeSemicolon();
  	            }
  	            else if (isExportFromIdentifier) {
  	                // export {default}; // missing fromClause
  	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
  	                this.throwError(message, this.lookahead.value);
  	            }
  	            else {
  	                // export {foo};
  	                this.consumeSemicolon();
  	            }
  	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(null, specifiers, source));
  	        }
  	        return exportDeclaration;
  	    };
  	    return Parser;
  	}());
  	exports.Parser = Parser;


  /***/ },
  /* 9 */
  /***/ function(module, exports) {

  	"use strict";
  	// Ensure the condition is true, otherwise throw an error.
  	// This is only to have a better contract semantic, i.e. another safety net
  	// to catch a logic error. The condition shall be fulfilled in normal case.
  	// Do NOT use this to enforce a certain condition on any user input.
  	Object.defineProperty(exports, "__esModule", { value: true });
  	function assert(condition, message) {
  	    /* istanbul ignore if */
  	    if (!condition) {
  	        throw new Error('ASSERT: ' + message);
  	    }
  	}
  	exports.assert = assert;


  /***/ },
  /* 10 */
  /***/ function(module, exports) {

  	"use strict";
  	/* tslint:disable:max-classes-per-file */
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var ErrorHandler = (function () {
  	    function ErrorHandler() {
  	        this.errors = [];
  	        this.tolerant = false;
  	    }
  	    ErrorHandler.prototype.recordError = function (error) {
  	        this.errors.push(error);
  	    };
  	    ErrorHandler.prototype.tolerate = function (error) {
  	        if (this.tolerant) {
  	            this.recordError(error);
  	        }
  	        else {
  	            throw error;
  	        }
  	    };
  	    ErrorHandler.prototype.constructError = function (msg, column) {
  	        var error = new Error(msg);
  	        try {
  	            throw error;
  	        }
  	        catch (base) {
  	            /* istanbul ignore else */
  	            if (Object.create && Object.defineProperty) {
  	                error = Object.create(base);
  	                Object.defineProperty(error, 'column', { value: column });
  	            }
  	        }
  	        /* istanbul ignore next */
  	        return error;
  	    };
  	    ErrorHandler.prototype.createError = function (index, line, col, description) {
  	        var msg = 'Line ' + line + ': ' + description;
  	        var error = this.constructError(msg, col);
  	        error.index = index;
  	        error.lineNumber = line;
  	        error.description = description;
  	        return error;
  	    };
  	    ErrorHandler.prototype.throwError = function (index, line, col, description) {
  	        throw this.createError(index, line, col, description);
  	    };
  	    ErrorHandler.prototype.tolerateError = function (index, line, col, description) {
  	        var error = this.createError(index, line, col, description);
  	        if (this.tolerant) {
  	            this.recordError(error);
  	        }
  	        else {
  	            throw error;
  	        }
  	    };
  	    return ErrorHandler;
  	}());
  	exports.ErrorHandler = ErrorHandler;


  /***/ },
  /* 11 */
  /***/ function(module, exports) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	// Error messages should be identical to V8.
  	exports.Messages = {
  	    BadGetterArity: 'Getter must not have any formal parameters',
  	    BadSetterArity: 'Setter must have exactly one formal parameter',
  	    BadSetterRestParameter: 'Setter function argument must not be a rest parameter',
  	    ConstructorIsAsync: 'Class constructor may not be an async method',
  	    ConstructorSpecialMethod: 'Class constructor may not be an accessor',
  	    DeclarationMissingInitializer: 'Missing initializer in %0 declaration',
  	    DefaultRestParameter: 'Unexpected token =',
  	    DuplicateBinding: 'Duplicate binding %0',
  	    DuplicateConstructor: 'A class may only have one constructor',
  	    DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
  	    ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer',
  	    GeneratorInLegacyContext: 'Generator declarations are not allowed in legacy contexts',
  	    IllegalBreak: 'Illegal break statement',
  	    IllegalContinue: 'Illegal continue statement',
  	    IllegalExportDeclaration: 'Unexpected token',
  	    IllegalImportDeclaration: 'Unexpected token',
  	    IllegalLanguageModeDirective: 'Illegal \'use strict\' directive in function with non-simple parameter list',
  	    IllegalReturn: 'Illegal return statement',
  	    InvalidEscapedReservedWord: 'Keyword must not contain escaped characters',
  	    InvalidHexEscapeSequence: 'Invalid hexadecimal escape sequence',
  	    InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
  	    InvalidLHSInForIn: 'Invalid left-hand side in for-in',
  	    InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
  	    InvalidModuleSpecifier: 'Unexpected token',
  	    InvalidRegExp: 'Invalid regular expression',
  	    LetInLexicalBinding: 'let is disallowed as a lexically bound name',
  	    MissingFromClause: 'Unexpected token',
  	    MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
  	    NewlineAfterThrow: 'Illegal newline after throw',
  	    NoAsAfterImportNamespace: 'Unexpected token',
  	    NoCatchOrFinally: 'Missing catch or finally after try',
  	    ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
  	    Redeclaration: '%0 \'%1\' has already been declared',
  	    StaticPrototype: 'Classes may not have static property named prototype',
  	    StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
  	    StrictDelete: 'Delete of an unqualified identifier in strict mode.',
  	    StrictFunction: 'In strict mode code, functions can only be declared at top level or inside a block',
  	    StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
  	    StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
  	    StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
  	    StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
  	    StrictModeWith: 'Strict mode code may not include a with statement',
  	    StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
  	    StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
  	    StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
  	    StrictReservedWord: 'Use of future reserved word in strict mode',
  	    StrictVarName: 'Variable name may not be eval or arguments in strict mode',
  	    TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
  	    UnexpectedEOS: 'Unexpected end of input',
  	    UnexpectedIdentifier: 'Unexpected identifier',
  	    UnexpectedNumber: 'Unexpected number',
  	    UnexpectedReserved: 'Unexpected reserved word',
  	    UnexpectedString: 'Unexpected string',
  	    UnexpectedTemplate: 'Unexpected quasi %0',
  	    UnexpectedToken: 'Unexpected token %0',
  	    UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
  	    UnknownLabel: 'Undefined label \'%0\'',
  	    UnterminatedRegExp: 'Invalid regular expression: missing /'
  	};


  /***/ },
  /* 12 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var assert_1 = __webpack_require__(9);
  	var character_1 = __webpack_require__(4);
  	var messages_1 = __webpack_require__(11);
  	function hexValue(ch) {
  	    return '0123456789abcdef'.indexOf(ch.toLowerCase());
  	}
  	function octalValue(ch) {
  	    return '01234567'.indexOf(ch);
  	}
  	var Scanner = (function () {
  	    function Scanner(code, handler) {
  	        this.source = code;
  	        this.errorHandler = handler;
  	        this.trackComment = false;
  	        this.isModule = false;
  	        this.length = code.length;
  	        this.index = 0;
  	        this.lineNumber = (code.length > 0) ? 1 : 0;
  	        this.lineStart = 0;
  	        this.curlyStack = [];
  	    }
  	    Scanner.prototype.saveState = function () {
  	        return {
  	            index: this.index,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart
  	        };
  	    };
  	    Scanner.prototype.restoreState = function (state) {
  	        this.index = state.index;
  	        this.lineNumber = state.lineNumber;
  	        this.lineStart = state.lineStart;
  	    };
  	    Scanner.prototype.eof = function () {
  	        return this.index >= this.length;
  	    };
  	    Scanner.prototype.throwUnexpectedToken = function (message) {
  	        if (message === void 0) { message = messages_1.Messages.UnexpectedTokenIllegal; }
  	        return this.errorHandler.throwError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
  	    };
  	    Scanner.prototype.tolerateUnexpectedToken = function (message) {
  	        if (message === void 0) { message = messages_1.Messages.UnexpectedTokenIllegal; }
  	        this.errorHandler.tolerateError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
  	    };
  	    // https://tc39.github.io/ecma262/#sec-comments
  	    Scanner.prototype.skipSingleLineComment = function (offset) {
  	        var comments = [];
  	        var start, loc;
  	        if (this.trackComment) {
  	            comments = [];
  	            start = this.index - offset;
  	            loc = {
  	                start: {
  	                    line: this.lineNumber,
  	                    column: this.index - this.lineStart - offset
  	                },
  	                end: {}
  	            };
  	        }
  	        while (!this.eof()) {
  	            var ch = this.source.charCodeAt(this.index);
  	            ++this.index;
  	            if (character_1.Character.isLineTerminator(ch)) {
  	                if (this.trackComment) {
  	                    loc.end = {
  	                        line: this.lineNumber,
  	                        column: this.index - this.lineStart - 1
  	                    };
  	                    var entry = {
  	                        multiLine: false,
  	                        slice: [start + offset, this.index - 1],
  	                        range: [start, this.index - 1],
  	                        loc: loc
  	                    };
  	                    comments.push(entry);
  	                }
  	                if (ch === 13 && this.source.charCodeAt(this.index) === 10) {
  	                    ++this.index;
  	                }
  	                ++this.lineNumber;
  	                this.lineStart = this.index;
  	                return comments;
  	            }
  	        }
  	        if (this.trackComment) {
  	            loc.end = {
  	                line: this.lineNumber,
  	                column: this.index - this.lineStart
  	            };
  	            var entry = {
  	                multiLine: false,
  	                slice: [start + offset, this.index],
  	                range: [start, this.index],
  	                loc: loc
  	            };
  	            comments.push(entry);
  	        }
  	        return comments;
  	    };
  	    Scanner.prototype.skipMultiLineComment = function () {
  	        var comments = [];
  	        var start, loc;
  	        if (this.trackComment) {
  	            comments = [];
  	            start = this.index - 2;
  	            loc = {
  	                start: {
  	                    line: this.lineNumber,
  	                    column: this.index - this.lineStart - 2
  	                },
  	                end: {}
  	            };
  	        }
  	        while (!this.eof()) {
  	            var ch = this.source.charCodeAt(this.index);
  	            if (character_1.Character.isLineTerminator(ch)) {
  	                if (ch === 0x0D && this.source.charCodeAt(this.index + 1) === 0x0A) {
  	                    ++this.index;
  	                }
  	                ++this.lineNumber;
  	                ++this.index;
  	                this.lineStart = this.index;
  	            }
  	            else if (ch === 0x2A) {
  	                // Block comment ends with '*/'.
  	                if (this.source.charCodeAt(this.index + 1) === 0x2F) {
  	                    this.index += 2;
  	                    if (this.trackComment) {
  	                        loc.end = {
  	                            line: this.lineNumber,
  	                            column: this.index - this.lineStart
  	                        };
  	                        var entry = {
  	                            multiLine: true,
  	                            slice: [start + 2, this.index - 2],
  	                            range: [start, this.index],
  	                            loc: loc
  	                        };
  	                        comments.push(entry);
  	                    }
  	                    return comments;
  	                }
  	                ++this.index;
  	            }
  	            else {
  	                ++this.index;
  	            }
  	        }
  	        // Ran off the end of the file - the whole thing is a comment
  	        if (this.trackComment) {
  	            loc.end = {
  	                line: this.lineNumber,
  	                column: this.index - this.lineStart
  	            };
  	            var entry = {
  	                multiLine: true,
  	                slice: [start + 2, this.index],
  	                range: [start, this.index],
  	                loc: loc
  	            };
  	            comments.push(entry);
  	        }
  	        this.tolerateUnexpectedToken();
  	        return comments;
  	    };
  	    Scanner.prototype.scanComments = function () {
  	        var comments;
  	        if (this.trackComment) {
  	            comments = [];
  	        }
  	        var start = (this.index === 0);
  	        while (!this.eof()) {
  	            var ch = this.source.charCodeAt(this.index);
  	            if (character_1.Character.isWhiteSpace(ch)) {
  	                ++this.index;
  	            }
  	            else if (character_1.Character.isLineTerminator(ch)) {
  	                ++this.index;
  	                if (ch === 0x0D && this.source.charCodeAt(this.index) === 0x0A) {
  	                    ++this.index;
  	                }
  	                ++this.lineNumber;
  	                this.lineStart = this.index;
  	                start = true;
  	            }
  	            else if (ch === 0x2F) {
  	                ch = this.source.charCodeAt(this.index + 1);
  	                if (ch === 0x2F) {
  	                    this.index += 2;
  	                    var comment = this.skipSingleLineComment(2);
  	                    if (this.trackComment) {
  	                        comments = comments.concat(comment);
  	                    }
  	                    start = true;
  	                }
  	                else if (ch === 0x2A) {
  	                    this.index += 2;
  	                    var comment = this.skipMultiLineComment();
  	                    if (this.trackComment) {
  	                        comments = comments.concat(comment);
  	                    }
  	                }
  	                else {
  	                    break;
  	                }
  	            }
  	            else if (start && ch === 0x2D) {
  	                // U+003E is '>'
  	                if ((this.source.charCodeAt(this.index + 1) === 0x2D) && (this.source.charCodeAt(this.index + 2) === 0x3E)) {
  	                    // '-->' is a single-line comment
  	                    this.index += 3;
  	                    var comment = this.skipSingleLineComment(3);
  	                    if (this.trackComment) {
  	                        comments = comments.concat(comment);
  	                    }
  	                }
  	                else {
  	                    break;
  	                }
  	            }
  	            else if (ch === 0x3C && !this.isModule) {
  	                if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
  	                    this.index += 4; // `<!--`
  	                    var comment = this.skipSingleLineComment(4);
  	                    if (this.trackComment) {
  	                        comments = comments.concat(comment);
  	                    }
  	                }
  	                else {
  	                    break;
  	                }
  	            }
  	            else {
  	                break;
  	            }
  	        }
  	        return comments;
  	    };
  	    // https://tc39.github.io/ecma262/#sec-future-reserved-words
  	    Scanner.prototype.isFutureReservedWord = function (id) {
  	        switch (id) {
  	            case 'enum':
  	            case 'export':
  	            case 'import':
  	            case 'super':
  	                return true;
  	            default:
  	                return false;
  	        }
  	    };
  	    Scanner.prototype.isStrictModeReservedWord = function (id) {
  	        switch (id) {
  	            case 'implements':
  	            case 'interface':
  	            case 'package':
  	            case 'private':
  	            case 'protected':
  	            case 'public':
  	            case 'static':
  	            case 'yield':
  	            case 'let':
  	                return true;
  	            default:
  	                return false;
  	        }
  	    };
  	    Scanner.prototype.isRestrictedWord = function (id) {
  	        return id === 'eval' || id === 'arguments';
  	    };
  	    // https://tc39.github.io/ecma262/#sec-keywords
  	    Scanner.prototype.isKeyword = function (id) {
  	        switch (id.length) {
  	            case 2:
  	                return (id === 'if') || (id === 'in') || (id === 'do');
  	            case 3:
  	                return (id === 'var') || (id === 'for') || (id === 'new') ||
  	                    (id === 'try') || (id === 'let');
  	            case 4:
  	                return (id === 'this') || (id === 'else') || (id === 'case') ||
  	                    (id === 'void') || (id === 'with') || (id === 'enum');
  	            case 5:
  	                return (id === 'while') || (id === 'break') || (id === 'catch') ||
  	                    (id === 'throw') || (id === 'const') || (id === 'yield') ||
  	                    (id === 'class') || (id === 'super');
  	            case 6:
  	                return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
  	                    (id === 'switch') || (id === 'export') || (id === 'import');
  	            case 7:
  	                return (id === 'default') || (id === 'finally') || (id === 'extends');
  	            case 8:
  	                return (id === 'function') || (id === 'continue') || (id === 'debugger');
  	            case 10:
  	                return (id === 'instanceof');
  	            default:
  	                return false;
  	        }
  	    };
  	    Scanner.prototype.codePointAt = function (i) {
  	        var cp = this.source.charCodeAt(i);
  	        if (cp >= 0xD800 && cp <= 0xDBFF) {
  	            var second = this.source.charCodeAt(i + 1);
  	            if (second >= 0xDC00 && second <= 0xDFFF) {
  	                var first = cp;
  	                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
  	            }
  	        }
  	        return cp;
  	    };
  	    Scanner.prototype.scanHexEscape = function (prefix) {
  	        var len = (prefix === 'u') ? 4 : 2;
  	        var code = 0;
  	        for (var i = 0; i < len; ++i) {
  	            if (!this.eof() && character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
  	                code = code * 16 + hexValue(this.source[this.index++]);
  	            }
  	            else {
  	                return null;
  	            }
  	        }
  	        return String.fromCharCode(code);
  	    };
  	    Scanner.prototype.scanUnicodeCodePointEscape = function () {
  	        var ch = this.source[this.index];
  	        var code = 0;
  	        // At least, one hex digit is required.
  	        if (ch === '}') {
  	            this.throwUnexpectedToken();
  	        }
  	        while (!this.eof()) {
  	            ch = this.source[this.index++];
  	            if (!character_1.Character.isHexDigit(ch.charCodeAt(0))) {
  	                break;
  	            }
  	            code = code * 16 + hexValue(ch);
  	        }
  	        if (code > 0x10FFFF || ch !== '}') {
  	            this.throwUnexpectedToken();
  	        }
  	        return character_1.Character.fromCodePoint(code);
  	    };
  	    Scanner.prototype.getIdentifier = function () {
  	        var start = this.index++;
  	        while (!this.eof()) {
  	            var ch = this.source.charCodeAt(this.index);
  	            if (ch === 0x5C) {
  	                // Blackslash (U+005C) marks Unicode escape sequence.
  	                this.index = start;
  	                return this.getComplexIdentifier();
  	            }
  	            else if (ch >= 0xD800 && ch < 0xDFFF) {
  	                // Need to handle surrogate pairs.
  	                this.index = start;
  	                return this.getComplexIdentifier();
  	            }
  	            if (character_1.Character.isIdentifierPart(ch)) {
  	                ++this.index;
  	            }
  	            else {
  	                break;
  	            }
  	        }
  	        return this.source.slice(start, this.index);
  	    };
  	    Scanner.prototype.getComplexIdentifier = function () {
  	        var cp = this.codePointAt(this.index);
  	        var id = character_1.Character.fromCodePoint(cp);
  	        this.index += id.length;
  	        // '\u' (U+005C, U+0075) denotes an escaped character.
  	        var ch;
  	        if (cp === 0x5C) {
  	            if (this.source.charCodeAt(this.index) !== 0x75) {
  	                this.throwUnexpectedToken();
  	            }
  	            ++this.index;
  	            if (this.source[this.index] === '{') {
  	                ++this.index;
  	                ch = this.scanUnicodeCodePointEscape();
  	            }
  	            else {
  	                ch = this.scanHexEscape('u');
  	                if (ch === null || ch === '\\' || !character_1.Character.isIdentifierStart(ch.charCodeAt(0))) {
  	                    this.throwUnexpectedToken();
  	                }
  	            }
  	            id = ch;
  	        }
  	        while (!this.eof()) {
  	            cp = this.codePointAt(this.index);
  	            if (!character_1.Character.isIdentifierPart(cp)) {
  	                break;
  	            }
  	            ch = character_1.Character.fromCodePoint(cp);
  	            id += ch;
  	            this.index += ch.length;
  	            // '\u' (U+005C, U+0075) denotes an escaped character.
  	            if (cp === 0x5C) {
  	                id = id.substr(0, id.length - 1);
  	                if (this.source.charCodeAt(this.index) !== 0x75) {
  	                    this.throwUnexpectedToken();
  	                }
  	                ++this.index;
  	                if (this.source[this.index] === '{') {
  	                    ++this.index;
  	                    ch = this.scanUnicodeCodePointEscape();
  	                }
  	                else {
  	                    ch = this.scanHexEscape('u');
  	                    if (ch === null || ch === '\\' || !character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
  	                        this.throwUnexpectedToken();
  	                    }
  	                }
  	                id += ch;
  	            }
  	        }
  	        return id;
  	    };
  	    Scanner.prototype.octalToDecimal = function (ch) {
  	        // \0 is not octal escape sequence
  	        var octal = (ch !== '0');
  	        var code = octalValue(ch);
  	        if (!this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
  	            octal = true;
  	            code = code * 8 + octalValue(this.source[this.index++]);
  	            // 3 digits are only allowed when string starts
  	            // with 0, 1, 2, 3
  	            if ('0123'.indexOf(ch) >= 0 && !this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
  	                code = code * 8 + octalValue(this.source[this.index++]);
  	            }
  	        }
  	        return {
  	            code: code,
  	            octal: octal
  	        };
  	    };
  	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
  	    Scanner.prototype.scanIdentifier = function () {
  	        var type;
  	        var start = this.index;
  	        // Backslash (U+005C) starts an escaped character.
  	        var id = (this.source.charCodeAt(start) === 0x5C) ? this.getComplexIdentifier() : this.getIdentifier();
  	        // There is no keyword or literal with only one character.
  	        // Thus, it must be an identifier.
  	        if (id.length === 1) {
  	            type = 3 /* Identifier */;
  	        }
  	        else if (this.isKeyword(id)) {
  	            type = 4 /* Keyword */;
  	        }
  	        else if (id === 'null') {
  	            type = 5 /* NullLiteral */;
  	        }
  	        else if (id === 'true' || id === 'false') {
  	            type = 1 /* BooleanLiteral */;
  	        }
  	        else {
  	            type = 3 /* Identifier */;
  	        }
  	        if (type !== 3 /* Identifier */ && (start + id.length !== this.index)) {
  	            var restore = this.index;
  	            this.index = start;
  	            this.tolerateUnexpectedToken(messages_1.Messages.InvalidEscapedReservedWord);
  	            this.index = restore;
  	        }
  	        return {
  	            type: type,
  	            value: id,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    // https://tc39.github.io/ecma262/#sec-punctuators
  	    Scanner.prototype.scanPunctuator = function () {
  	        var start = this.index;
  	        // Check for most common single-character punctuators.
  	        var str = this.source[this.index];
  	        switch (str) {
  	            case '(':
  	            case '{':
  	                if (str === '{') {
  	                    this.curlyStack.push('{');
  	                }
  	                ++this.index;
  	                break;
  	            case '.':
  	                ++this.index;
  	                if (this.source[this.index] === '.' && this.source[this.index + 1] === '.') {
  	                    // Spread operator: ...
  	                    this.index += 2;
  	                    str = '...';
  	                }
  	                break;
  	            case '}':
  	                ++this.index;
  	                this.curlyStack.pop();
  	                break;
  	            case ')':
  	            case ';':
  	            case ',':
  	            case '[':
  	            case ']':
  	            case ':':
  	            case '?':
  	            case '~':
  	                ++this.index;
  	                break;
  	            default:
  	                // 4-character punctuator.
  	                str = this.source.substr(this.index, 4);
  	                if (str === '>>>=') {
  	                    this.index += 4;
  	                }
  	                else {
  	                    // 3-character punctuators.
  	                    str = str.substr(0, 3);
  	                    if (str === '===' || str === '!==' || str === '>>>' ||
  	                        str === '<<=' || str === '>>=' || str === '**=') {
  	                        this.index += 3;
  	                    }
  	                    else {
  	                        // 2-character punctuators.
  	                        str = str.substr(0, 2);
  	                        if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
  	                            str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
  	                            str === '++' || str === '--' || str === '<<' || str === '>>' ||
  	                            str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
  	                            str === '<=' || str === '>=' || str === '=>' || str === '**') {
  	                            this.index += 2;
  	                        }
  	                        else {
  	                            // 1-character punctuators.
  	                            str = this.source[this.index];
  	                            if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
  	                                ++this.index;
  	                            }
  	                        }
  	                    }
  	                }
  	        }
  	        if (this.index === start) {
  	            this.throwUnexpectedToken();
  	        }
  	        return {
  	            type: 7 /* Punctuator */,
  	            value: str,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
  	    Scanner.prototype.scanHexLiteral = function (start) {
  	        var num = '';
  	        while (!this.eof()) {
  	            if (!character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
  	                break;
  	            }
  	            num += this.source[this.index++];
  	        }
  	        if (num.length === 0) {
  	            this.throwUnexpectedToken();
  	        }
  	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
  	            this.throwUnexpectedToken();
  	        }
  	        return {
  	            type: 6 /* NumericLiteral */,
  	            value: parseInt('0x' + num, 16),
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    Scanner.prototype.scanBinaryLiteral = function (start) {
  	        var num = '';
  	        var ch;
  	        while (!this.eof()) {
  	            ch = this.source[this.index];
  	            if (ch !== '0' && ch !== '1') {
  	                break;
  	            }
  	            num += this.source[this.index++];
  	        }
  	        if (num.length === 0) {
  	            // only 0b or 0B
  	            this.throwUnexpectedToken();
  	        }
  	        if (!this.eof()) {
  	            ch = this.source.charCodeAt(this.index);
  	            /* istanbul ignore else */
  	            if (character_1.Character.isIdentifierStart(ch) || character_1.Character.isDecimalDigit(ch)) {
  	                this.throwUnexpectedToken();
  	            }
  	        }
  	        return {
  	            type: 6 /* NumericLiteral */,
  	            value: parseInt(num, 2),
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    Scanner.prototype.scanOctalLiteral = function (prefix, start) {
  	        var num = '';
  	        var octal = false;
  	        if (character_1.Character.isOctalDigit(prefix.charCodeAt(0))) {
  	            octal = true;
  	            num = '0' + this.source[this.index++];
  	        }
  	        else {
  	            ++this.index;
  	        }
  	        while (!this.eof()) {
  	            if (!character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
  	                break;
  	            }
  	            num += this.source[this.index++];
  	        }
  	        if (!octal && num.length === 0) {
  	            // only 0o or 0O
  	            this.throwUnexpectedToken();
  	        }
  	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index)) || character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
  	            this.throwUnexpectedToken();
  	        }
  	        return {
  	            type: 6 /* NumericLiteral */,
  	            value: parseInt(num, 8),
  	            octal: octal,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    Scanner.prototype.isImplicitOctalLiteral = function () {
  	        // Implicit octal, unless there is a non-octal digit.
  	        // (Annex B.1.1 on Numeric Literals)
  	        for (var i = this.index + 1; i < this.length; ++i) {
  	            var ch = this.source[i];
  	            if (ch === '8' || ch === '9') {
  	                return false;
  	            }
  	            if (!character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
  	                return true;
  	            }
  	        }
  	        return true;
  	    };
  	    Scanner.prototype.scanNumericLiteral = function () {
  	        var start = this.index;
  	        var ch = this.source[start];
  	        assert_1.assert(character_1.Character.isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'), 'Numeric literal must start with a decimal digit or a decimal point');
  	        var num = '';
  	        if (ch !== '.') {
  	            num = this.source[this.index++];
  	            ch = this.source[this.index];
  	            // Hex number starts with '0x'.
  	            // Octal number starts with '0'.
  	            // Octal number in ES6 starts with '0o'.
  	            // Binary number in ES6 starts with '0b'.
  	            if (num === '0') {
  	                if (ch === 'x' || ch === 'X') {
  	                    ++this.index;
  	                    return this.scanHexLiteral(start);
  	                }
  	                if (ch === 'b' || ch === 'B') {
  	                    ++this.index;
  	                    return this.scanBinaryLiteral(start);
  	                }
  	                if (ch === 'o' || ch === 'O') {
  	                    return this.scanOctalLiteral(ch, start);
  	                }
  	                if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
  	                    if (this.isImplicitOctalLiteral()) {
  	                        return this.scanOctalLiteral(ch, start);
  	                    }
  	                }
  	            }
  	            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
  	                num += this.source[this.index++];
  	            }
  	            ch = this.source[this.index];
  	        }
  	        if (ch === '.') {
  	            num += this.source[this.index++];
  	            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
  	                num += this.source[this.index++];
  	            }
  	            ch = this.source[this.index];
  	        }
  	        if (ch === 'e' || ch === 'E') {
  	            num += this.source[this.index++];
  	            ch = this.source[this.index];
  	            if (ch === '+' || ch === '-') {
  	                num += this.source[this.index++];
  	            }
  	            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
  	                while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
  	                    num += this.source[this.index++];
  	                }
  	            }
  	            else {
  	                this.throwUnexpectedToken();
  	            }
  	        }
  	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
  	            this.throwUnexpectedToken();
  	        }
  	        return {
  	            type: 6 /* NumericLiteral */,
  	            value: parseFloat(num),
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    // https://tc39.github.io/ecma262/#sec-literals-string-literals
  	    Scanner.prototype.scanStringLiteral = function () {
  	        var start = this.index;
  	        var quote = this.source[start];
  	        assert_1.assert((quote === '\'' || quote === '"'), 'String literal must starts with a quote');
  	        ++this.index;
  	        var octal = false;
  	        var str = '';
  	        while (!this.eof()) {
  	            var ch = this.source[this.index++];
  	            if (ch === quote) {
  	                quote = '';
  	                break;
  	            }
  	            else if (ch === '\\') {
  	                ch = this.source[this.index++];
  	                if (!ch || !character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                    switch (ch) {
  	                        case 'u':
  	                            if (this.source[this.index] === '{') {
  	                                ++this.index;
  	                                str += this.scanUnicodeCodePointEscape();
  	                            }
  	                            else {
  	                                var unescaped_1 = this.scanHexEscape(ch);
  	                                if (unescaped_1 === null) {
  	                                    this.throwUnexpectedToken();
  	                                }
  	                                str += unescaped_1;
  	                            }
  	                            break;
  	                        case 'x':
  	                            var unescaped = this.scanHexEscape(ch);
  	                            if (unescaped === null) {
  	                                this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
  	                            }
  	                            str += unescaped;
  	                            break;
  	                        case 'n':
  	                            str += '\n';
  	                            break;
  	                        case 'r':
  	                            str += '\r';
  	                            break;
  	                        case 't':
  	                            str += '\t';
  	                            break;
  	                        case 'b':
  	                            str += '\b';
  	                            break;
  	                        case 'f':
  	                            str += '\f';
  	                            break;
  	                        case 'v':
  	                            str += '\x0B';
  	                            break;
  	                        case '8':
  	                        case '9':
  	                            str += ch;
  	                            this.tolerateUnexpectedToken();
  	                            break;
  	                        default:
  	                            if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
  	                                var octToDec = this.octalToDecimal(ch);
  	                                octal = octToDec.octal || octal;
  	                                str += String.fromCharCode(octToDec.code);
  	                            }
  	                            else {
  	                                str += ch;
  	                            }
  	                            break;
  	                    }
  	                }
  	                else {
  	                    ++this.lineNumber;
  	                    if (ch === '\r' && this.source[this.index] === '\n') {
  	                        ++this.index;
  	                    }
  	                    this.lineStart = this.index;
  	                }
  	            }
  	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                break;
  	            }
  	            else {
  	                str += ch;
  	            }
  	        }
  	        if (quote !== '') {
  	            this.index = start;
  	            this.throwUnexpectedToken();
  	        }
  	        return {
  	            type: 8 /* StringLiteral */,
  	            value: str,
  	            octal: octal,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    // https://tc39.github.io/ecma262/#sec-template-literal-lexical-components
  	    Scanner.prototype.scanTemplate = function () {
  	        var cooked = '';
  	        var terminated = false;
  	        var start = this.index;
  	        var head = (this.source[start] === '`');
  	        var tail = false;
  	        var rawOffset = 2;
  	        ++this.index;
  	        while (!this.eof()) {
  	            var ch = this.source[this.index++];
  	            if (ch === '`') {
  	                rawOffset = 1;
  	                tail = true;
  	                terminated = true;
  	                break;
  	            }
  	            else if (ch === '$') {
  	                if (this.source[this.index] === '{') {
  	                    this.curlyStack.push('${');
  	                    ++this.index;
  	                    terminated = true;
  	                    break;
  	                }
  	                cooked += ch;
  	            }
  	            else if (ch === '\\') {
  	                ch = this.source[this.index++];
  	                if (!character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                    switch (ch) {
  	                        case 'n':
  	                            cooked += '\n';
  	                            break;
  	                        case 'r':
  	                            cooked += '\r';
  	                            break;
  	                        case 't':
  	                            cooked += '\t';
  	                            break;
  	                        case 'u':
  	                            if (this.source[this.index] === '{') {
  	                                ++this.index;
  	                                cooked += this.scanUnicodeCodePointEscape();
  	                            }
  	                            else {
  	                                var restore = this.index;
  	                                var unescaped_2 = this.scanHexEscape(ch);
  	                                if (unescaped_2 !== null) {
  	                                    cooked += unescaped_2;
  	                                }
  	                                else {
  	                                    this.index = restore;
  	                                    cooked += ch;
  	                                }
  	                            }
  	                            break;
  	                        case 'x':
  	                            var unescaped = this.scanHexEscape(ch);
  	                            if (unescaped === null) {
  	                                this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
  	                            }
  	                            cooked += unescaped;
  	                            break;
  	                        case 'b':
  	                            cooked += '\b';
  	                            break;
  	                        case 'f':
  	                            cooked += '\f';
  	                            break;
  	                        case 'v':
  	                            cooked += '\v';
  	                            break;
  	                        default:
  	                            if (ch === '0') {
  	                                if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
  	                                    // Illegal: \01 \02 and so on
  	                                    this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
  	                                }
  	                                cooked += '\0';
  	                            }
  	                            else if (character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
  	                                // Illegal: \1 \2
  	                                this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
  	                            }
  	                            else {
  	                                cooked += ch;
  	                            }
  	                            break;
  	                    }
  	                }
  	                else {
  	                    ++this.lineNumber;
  	                    if (ch === '\r' && this.source[this.index] === '\n') {
  	                        ++this.index;
  	                    }
  	                    this.lineStart = this.index;
  	                }
  	            }
  	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                ++this.lineNumber;
  	                if (ch === '\r' && this.source[this.index] === '\n') {
  	                    ++this.index;
  	                }
  	                this.lineStart = this.index;
  	                cooked += '\n';
  	            }
  	            else {
  	                cooked += ch;
  	            }
  	        }
  	        if (!terminated) {
  	            this.throwUnexpectedToken();
  	        }
  	        if (!head) {
  	            this.curlyStack.pop();
  	        }
  	        return {
  	            type: 10 /* Template */,
  	            value: this.source.slice(start + 1, this.index - rawOffset),
  	            cooked: cooked,
  	            head: head,
  	            tail: tail,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
  	    Scanner.prototype.testRegExp = function (pattern, flags) {
  	        // The BMP character to use as a replacement for astral symbols when
  	        // translating an ES6 "u"-flagged pattern to an ES5-compatible
  	        // approximation.
  	        // Note: replacing with '\uFFFF' enables false positives in unlikely
  	        // scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
  	        // pattern that would not be detected by this substitution.
  	        var astralSubstitute = '\uFFFF';
  	        var tmp = pattern;
  	        var self = this;
  	        if (flags.indexOf('u') >= 0) {
  	            tmp = tmp
  	                .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
  	                var codePoint = parseInt($1 || $2, 16);
  	                if (codePoint > 0x10FFFF) {
  	                    self.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
  	                }
  	                if (codePoint <= 0xFFFF) {
  	                    return String.fromCharCode(codePoint);
  	                }
  	                return astralSubstitute;
  	            })
  	                .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, astralSubstitute);
  	        }
  	        // First, detect invalid regular expressions.
  	        try {
  	            RegExp(tmp);
  	        }
  	        catch (e) {
  	            this.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
  	        }
  	        // Return a regular expression object for this pattern-flag pair, or
  	        // `null` in case the current environment doesn't support the flags it
  	        // uses.
  	        try {
  	            return new RegExp(pattern, flags);
  	        }
  	        catch (exception) {
  	            /* istanbul ignore next */
  	            return null;
  	        }
  	    };
  	    Scanner.prototype.scanRegExpBody = function () {
  	        var ch = this.source[this.index];
  	        assert_1.assert(ch === '/', 'Regular expression literal must start with a slash');
  	        var str = this.source[this.index++];
  	        var classMarker = false;
  	        var terminated = false;
  	        while (!this.eof()) {
  	            ch = this.source[this.index++];
  	            str += ch;
  	            if (ch === '\\') {
  	                ch = this.source[this.index++];
  	                // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
  	                if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                    this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
  	                }
  	                str += ch;
  	            }
  	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
  	                this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
  	            }
  	            else if (classMarker) {
  	                if (ch === ']') {
  	                    classMarker = false;
  	                }
  	            }
  	            else {
  	                if (ch === '/') {
  	                    terminated = true;
  	                    break;
  	                }
  	                else if (ch === '[') {
  	                    classMarker = true;
  	                }
  	            }
  	        }
  	        if (!terminated) {
  	            this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
  	        }
  	        // Exclude leading and trailing slash.
  	        return str.substr(1, str.length - 2);
  	    };
  	    Scanner.prototype.scanRegExpFlags = function () {
  	        var str = '';
  	        var flags = '';
  	        while (!this.eof()) {
  	            var ch = this.source[this.index];
  	            if (!character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
  	                break;
  	            }
  	            ++this.index;
  	            if (ch === '\\' && !this.eof()) {
  	                ch = this.source[this.index];
  	                if (ch === 'u') {
  	                    ++this.index;
  	                    var restore = this.index;
  	                    var char = this.scanHexEscape('u');
  	                    if (char !== null) {
  	                        flags += char;
  	                        for (str += '\\u'; restore < this.index; ++restore) {
  	                            str += this.source[restore];
  	                        }
  	                    }
  	                    else {
  	                        this.index = restore;
  	                        flags += 'u';
  	                        str += '\\u';
  	                    }
  	                    this.tolerateUnexpectedToken();
  	                }
  	                else {
  	                    str += '\\';
  	                    this.tolerateUnexpectedToken();
  	                }
  	            }
  	            else {
  	                flags += ch;
  	                str += ch;
  	            }
  	        }
  	        return flags;
  	    };
  	    Scanner.prototype.scanRegExp = function () {
  	        var start = this.index;
  	        var pattern = this.scanRegExpBody();
  	        var flags = this.scanRegExpFlags();
  	        var value = this.testRegExp(pattern, flags);
  	        return {
  	            type: 9 /* RegularExpression */,
  	            value: '',
  	            pattern: pattern,
  	            flags: flags,
  	            regex: value,
  	            lineNumber: this.lineNumber,
  	            lineStart: this.lineStart,
  	            start: start,
  	            end: this.index
  	        };
  	    };
  	    Scanner.prototype.lex = function () {
  	        if (this.eof()) {
  	            return {
  	                type: 2 /* EOF */,
  	                value: '',
  	                lineNumber: this.lineNumber,
  	                lineStart: this.lineStart,
  	                start: this.index,
  	                end: this.index
  	            };
  	        }
  	        var cp = this.source.charCodeAt(this.index);
  	        if (character_1.Character.isIdentifierStart(cp)) {
  	            return this.scanIdentifier();
  	        }
  	        // Very common: ( and ) and ;
  	        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
  	            return this.scanPunctuator();
  	        }
  	        // String literal starts with single quote (U+0027) or double quote (U+0022).
  	        if (cp === 0x27 || cp === 0x22) {
  	            return this.scanStringLiteral();
  	        }
  	        // Dot (.) U+002E can also start a floating-point number, hence the need
  	        // to check the next character.
  	        if (cp === 0x2E) {
  	            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index + 1))) {
  	                return this.scanNumericLiteral();
  	            }
  	            return this.scanPunctuator();
  	        }
  	        if (character_1.Character.isDecimalDigit(cp)) {
  	            return this.scanNumericLiteral();
  	        }
  	        // Template literals start with ` (U+0060) for template head
  	        // or } (U+007D) for template middle or template tail.
  	        if (cp === 0x60 || (cp === 0x7D && this.curlyStack[this.curlyStack.length - 1] === '${')) {
  	            return this.scanTemplate();
  	        }
  	        // Possible identifier start in a surrogate pair.
  	        if (cp >= 0xD800 && cp < 0xDFFF) {
  	            if (character_1.Character.isIdentifierStart(this.codePointAt(this.index))) {
  	                return this.scanIdentifier();
  	            }
  	        }
  	        return this.scanPunctuator();
  	    };
  	    return Scanner;
  	}());
  	exports.Scanner = Scanner;


  /***/ },
  /* 13 */
  /***/ function(module, exports) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	exports.TokenName = {};
  	exports.TokenName[1 /* BooleanLiteral */] = 'Boolean';
  	exports.TokenName[2 /* EOF */] = '<end>';
  	exports.TokenName[3 /* Identifier */] = 'Identifier';
  	exports.TokenName[4 /* Keyword */] = 'Keyword';
  	exports.TokenName[5 /* NullLiteral */] = 'Null';
  	exports.TokenName[6 /* NumericLiteral */] = 'Numeric';
  	exports.TokenName[7 /* Punctuator */] = 'Punctuator';
  	exports.TokenName[8 /* StringLiteral */] = 'String';
  	exports.TokenName[9 /* RegularExpression */] = 'RegularExpression';
  	exports.TokenName[10 /* Template */] = 'Template';


  /***/ },
  /* 14 */
  /***/ function(module, exports) {

  	"use strict";
  	// Generated by generate-xhtml-entities.js. DO NOT MODIFY!
  	Object.defineProperty(exports, "__esModule", { value: true });
  	exports.XHTMLEntities = {
  	    quot: '\u0022',
  	    amp: '\u0026',
  	    apos: '\u0027',
  	    gt: '\u003E',
  	    nbsp: '\u00A0',
  	    iexcl: '\u00A1',
  	    cent: '\u00A2',
  	    pound: '\u00A3',
  	    curren: '\u00A4',
  	    yen: '\u00A5',
  	    brvbar: '\u00A6',
  	    sect: '\u00A7',
  	    uml: '\u00A8',
  	    copy: '\u00A9',
  	    ordf: '\u00AA',
  	    laquo: '\u00AB',
  	    not: '\u00AC',
  	    shy: '\u00AD',
  	    reg: '\u00AE',
  	    macr: '\u00AF',
  	    deg: '\u00B0',
  	    plusmn: '\u00B1',
  	    sup2: '\u00B2',
  	    sup3: '\u00B3',
  	    acute: '\u00B4',
  	    micro: '\u00B5',
  	    para: '\u00B6',
  	    middot: '\u00B7',
  	    cedil: '\u00B8',
  	    sup1: '\u00B9',
  	    ordm: '\u00BA',
  	    raquo: '\u00BB',
  	    frac14: '\u00BC',
  	    frac12: '\u00BD',
  	    frac34: '\u00BE',
  	    iquest: '\u00BF',
  	    Agrave: '\u00C0',
  	    Aacute: '\u00C1',
  	    Acirc: '\u00C2',
  	    Atilde: '\u00C3',
  	    Auml: '\u00C4',
  	    Aring: '\u00C5',
  	    AElig: '\u00C6',
  	    Ccedil: '\u00C7',
  	    Egrave: '\u00C8',
  	    Eacute: '\u00C9',
  	    Ecirc: '\u00CA',
  	    Euml: '\u00CB',
  	    Igrave: '\u00CC',
  	    Iacute: '\u00CD',
  	    Icirc: '\u00CE',
  	    Iuml: '\u00CF',
  	    ETH: '\u00D0',
  	    Ntilde: '\u00D1',
  	    Ograve: '\u00D2',
  	    Oacute: '\u00D3',
  	    Ocirc: '\u00D4',
  	    Otilde: '\u00D5',
  	    Ouml: '\u00D6',
  	    times: '\u00D7',
  	    Oslash: '\u00D8',
  	    Ugrave: '\u00D9',
  	    Uacute: '\u00DA',
  	    Ucirc: '\u00DB',
  	    Uuml: '\u00DC',
  	    Yacute: '\u00DD',
  	    THORN: '\u00DE',
  	    szlig: '\u00DF',
  	    agrave: '\u00E0',
  	    aacute: '\u00E1',
  	    acirc: '\u00E2',
  	    atilde: '\u00E3',
  	    auml: '\u00E4',
  	    aring: '\u00E5',
  	    aelig: '\u00E6',
  	    ccedil: '\u00E7',
  	    egrave: '\u00E8',
  	    eacute: '\u00E9',
  	    ecirc: '\u00EA',
  	    euml: '\u00EB',
  	    igrave: '\u00EC',
  	    iacute: '\u00ED',
  	    icirc: '\u00EE',
  	    iuml: '\u00EF',
  	    eth: '\u00F0',
  	    ntilde: '\u00F1',
  	    ograve: '\u00F2',
  	    oacute: '\u00F3',
  	    ocirc: '\u00F4',
  	    otilde: '\u00F5',
  	    ouml: '\u00F6',
  	    divide: '\u00F7',
  	    oslash: '\u00F8',
  	    ugrave: '\u00F9',
  	    uacute: '\u00FA',
  	    ucirc: '\u00FB',
  	    uuml: '\u00FC',
  	    yacute: '\u00FD',
  	    thorn: '\u00FE',
  	    yuml: '\u00FF',
  	    OElig: '\u0152',
  	    oelig: '\u0153',
  	    Scaron: '\u0160',
  	    scaron: '\u0161',
  	    Yuml: '\u0178',
  	    fnof: '\u0192',
  	    circ: '\u02C6',
  	    tilde: '\u02DC',
  	    Alpha: '\u0391',
  	    Beta: '\u0392',
  	    Gamma: '\u0393',
  	    Delta: '\u0394',
  	    Epsilon: '\u0395',
  	    Zeta: '\u0396',
  	    Eta: '\u0397',
  	    Theta: '\u0398',
  	    Iota: '\u0399',
  	    Kappa: '\u039A',
  	    Lambda: '\u039B',
  	    Mu: '\u039C',
  	    Nu: '\u039D',
  	    Xi: '\u039E',
  	    Omicron: '\u039F',
  	    Pi: '\u03A0',
  	    Rho: '\u03A1',
  	    Sigma: '\u03A3',
  	    Tau: '\u03A4',
  	    Upsilon: '\u03A5',
  	    Phi: '\u03A6',
  	    Chi: '\u03A7',
  	    Psi: '\u03A8',
  	    Omega: '\u03A9',
  	    alpha: '\u03B1',
  	    beta: '\u03B2',
  	    gamma: '\u03B3',
  	    delta: '\u03B4',
  	    epsilon: '\u03B5',
  	    zeta: '\u03B6',
  	    eta: '\u03B7',
  	    theta: '\u03B8',
  	    iota: '\u03B9',
  	    kappa: '\u03BA',
  	    lambda: '\u03BB',
  	    mu: '\u03BC',
  	    nu: '\u03BD',
  	    xi: '\u03BE',
  	    omicron: '\u03BF',
  	    pi: '\u03C0',
  	    rho: '\u03C1',
  	    sigmaf: '\u03C2',
  	    sigma: '\u03C3',
  	    tau: '\u03C4',
  	    upsilon: '\u03C5',
  	    phi: '\u03C6',
  	    chi: '\u03C7',
  	    psi: '\u03C8',
  	    omega: '\u03C9',
  	    thetasym: '\u03D1',
  	    upsih: '\u03D2',
  	    piv: '\u03D6',
  	    ensp: '\u2002',
  	    emsp: '\u2003',
  	    thinsp: '\u2009',
  	    zwnj: '\u200C',
  	    zwj: '\u200D',
  	    lrm: '\u200E',
  	    rlm: '\u200F',
  	    ndash: '\u2013',
  	    mdash: '\u2014',
  	    lsquo: '\u2018',
  	    rsquo: '\u2019',
  	    sbquo: '\u201A',
  	    ldquo: '\u201C',
  	    rdquo: '\u201D',
  	    bdquo: '\u201E',
  	    dagger: '\u2020',
  	    Dagger: '\u2021',
  	    bull: '\u2022',
  	    hellip: '\u2026',
  	    permil: '\u2030',
  	    prime: '\u2032',
  	    Prime: '\u2033',
  	    lsaquo: '\u2039',
  	    rsaquo: '\u203A',
  	    oline: '\u203E',
  	    frasl: '\u2044',
  	    euro: '\u20AC',
  	    image: '\u2111',
  	    weierp: '\u2118',
  	    real: '\u211C',
  	    trade: '\u2122',
  	    alefsym: '\u2135',
  	    larr: '\u2190',
  	    uarr: '\u2191',
  	    rarr: '\u2192',
  	    darr: '\u2193',
  	    harr: '\u2194',
  	    crarr: '\u21B5',
  	    lArr: '\u21D0',
  	    uArr: '\u21D1',
  	    rArr: '\u21D2',
  	    dArr: '\u21D3',
  	    hArr: '\u21D4',
  	    forall: '\u2200',
  	    part: '\u2202',
  	    exist: '\u2203',
  	    empty: '\u2205',
  	    nabla: '\u2207',
  	    isin: '\u2208',
  	    notin: '\u2209',
  	    ni: '\u220B',
  	    prod: '\u220F',
  	    sum: '\u2211',
  	    minus: '\u2212',
  	    lowast: '\u2217',
  	    radic: '\u221A',
  	    prop: '\u221D',
  	    infin: '\u221E',
  	    ang: '\u2220',
  	    and: '\u2227',
  	    or: '\u2228',
  	    cap: '\u2229',
  	    cup: '\u222A',
  	    int: '\u222B',
  	    there4: '\u2234',
  	    sim: '\u223C',
  	    cong: '\u2245',
  	    asymp: '\u2248',
  	    ne: '\u2260',
  	    equiv: '\u2261',
  	    le: '\u2264',
  	    ge: '\u2265',
  	    sub: '\u2282',
  	    sup: '\u2283',
  	    nsub: '\u2284',
  	    sube: '\u2286',
  	    supe: '\u2287',
  	    oplus: '\u2295',
  	    otimes: '\u2297',
  	    perp: '\u22A5',
  	    sdot: '\u22C5',
  	    lceil: '\u2308',
  	    rceil: '\u2309',
  	    lfloor: '\u230A',
  	    rfloor: '\u230B',
  	    loz: '\u25CA',
  	    spades: '\u2660',
  	    clubs: '\u2663',
  	    hearts: '\u2665',
  	    diams: '\u2666',
  	    lang: '\u27E8',
  	    rang: '\u27E9'
  	};


  /***/ },
  /* 15 */
  /***/ function(module, exports, __webpack_require__) {

  	"use strict";
  	Object.defineProperty(exports, "__esModule", { value: true });
  	var error_handler_1 = __webpack_require__(10);
  	var scanner_1 = __webpack_require__(12);
  	var token_1 = __webpack_require__(13);
  	var Reader = (function () {
  	    function Reader() {
  	        this.values = [];
  	        this.curly = this.paren = -1;
  	    }
  	    // A function following one of those tokens is an expression.
  	    Reader.prototype.beforeFunctionExpression = function (t) {
  	        return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
  	            'return', 'case', 'delete', 'throw', 'void',
  	            // assignment operators
  	            '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=',
  	            '&=', '|=', '^=', ',',
  	            // binary/unary operators
  	            '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
  	            '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
  	            '<=', '<', '>', '!=', '!=='].indexOf(t) >= 0;
  	    };
  	    // Determine if forward slash (/) is an operator or part of a regular expression
  	    // https://github.com/mozilla/sweet.js/wiki/design
  	    Reader.prototype.isRegexStart = function () {
  	        var previous = this.values[this.values.length - 1];
  	        var regex = (previous !== null);
  	        switch (previous) {
  	            case 'this':
  	            case ']':
  	                regex = false;
  	                break;
  	            case ')':
  	                var keyword = this.values[this.paren - 1];
  	                regex = (keyword === 'if' || keyword === 'while' || keyword === 'for' || keyword === 'with');
  	                break;
  	            case '}':
  	                // Dividing a function by anything makes little sense,
  	                // but we have to check for that.
  	                regex = false;
  	                if (this.values[this.curly - 3] === 'function') {
  	                    // Anonymous function, e.g. function(){} /42
  	                    var check = this.values[this.curly - 4];
  	                    regex = check ? !this.beforeFunctionExpression(check) : false;
  	                }
  	                else if (this.values[this.curly - 4] === 'function') {
  	                    // Named function, e.g. function f(){} /42/
  	                    var check = this.values[this.curly - 5];
  	                    regex = check ? !this.beforeFunctionExpression(check) : true;
  	                }
  	                break;
  	            default:
  	                break;
  	        }
  	        return regex;
  	    };
  	    Reader.prototype.push = function (token) {
  	        if (token.type === 7 /* Punctuator */ || token.type === 4 /* Keyword */) {
  	            if (token.value === '{') {
  	                this.curly = this.values.length;
  	            }
  	            else if (token.value === '(') {
  	                this.paren = this.values.length;
  	            }
  	            this.values.push(token.value);
  	        }
  	        else {
  	            this.values.push(null);
  	        }
  	    };
  	    return Reader;
  	}());
  	var Tokenizer = (function () {
  	    function Tokenizer(code, config) {
  	        this.errorHandler = new error_handler_1.ErrorHandler();
  	        this.errorHandler.tolerant = config ? (typeof config.tolerant === 'boolean' && config.tolerant) : false;
  	        this.scanner = new scanner_1.Scanner(code, this.errorHandler);
  	        this.scanner.trackComment = config ? (typeof config.comment === 'boolean' && config.comment) : false;
  	        this.trackRange = config ? (typeof config.range === 'boolean' && config.range) : false;
  	        this.trackLoc = config ? (typeof config.loc === 'boolean' && config.loc) : false;
  	        this.buffer = [];
  	        this.reader = new Reader();
  	    }
  	    Tokenizer.prototype.errors = function () {
  	        return this.errorHandler.errors;
  	    };
  	    Tokenizer.prototype.getNextToken = function () {
  	        if (this.buffer.length === 0) {
  	            var comments = this.scanner.scanComments();
  	            if (this.scanner.trackComment) {
  	                for (var i = 0; i < comments.length; ++i) {
  	                    var e = comments[i];
  	                    var value = this.scanner.source.slice(e.slice[0], e.slice[1]);
  	                    var comment = {
  	                        type: e.multiLine ? 'BlockComment' : 'LineComment',
  	                        value: value
  	                    };
  	                    if (this.trackRange) {
  	                        comment.range = e.range;
  	                    }
  	                    if (this.trackLoc) {
  	                        comment.loc = e.loc;
  	                    }
  	                    this.buffer.push(comment);
  	                }
  	            }
  	            if (!this.scanner.eof()) {
  	                var loc = void 0;
  	                if (this.trackLoc) {
  	                    loc = {
  	                        start: {
  	                            line: this.scanner.lineNumber,
  	                            column: this.scanner.index - this.scanner.lineStart
  	                        },
  	                        end: {}
  	                    };
  	                }
  	                var startRegex = (this.scanner.source[this.scanner.index] === '/') && this.reader.isRegexStart();
  	                var token = startRegex ? this.scanner.scanRegExp() : this.scanner.lex();
  	                this.reader.push(token);
  	                var entry = {
  	                    type: token_1.TokenName[token.type],
  	                    value: this.scanner.source.slice(token.start, token.end)
  	                };
  	                if (this.trackRange) {
  	                    entry.range = [token.start, token.end];
  	                }
  	                if (this.trackLoc) {
  	                    loc.end = {
  	                        line: this.scanner.lineNumber,
  	                        column: this.scanner.index - this.scanner.lineStart
  	                    };
  	                    entry.loc = loc;
  	                }
  	                if (token.type === 9 /* RegularExpression */) {
  	                    var pattern = token.pattern;
  	                    var flags = token.flags;
  	                    entry.regex = { pattern: pattern, flags: flags };
  	                }
  	                this.buffer.push(entry);
  	            }
  	        }
  	        return this.buffer.shift();
  	    };
  	    return Tokenizer;
  	}());
  	exports.Tokenizer = Tokenizer;


  /***/ }
  /******/ ])
  });
  ;
  });

  var esprima$1 = /*@__PURE__*/getDefaultExportFromCjs(esprima);

  function buildGeoSource(geo) {
    return "\nfloat surfaceDistance(vec3 p) {\n\tvec3 normal = vec3(0.0,1.0,0.0);\n\tvec3 mouseIntersect = vec3(0.0,1.0,0.0);\n    float d = 100.0;\n    vec3 op = p;\n".concat(geo, "\n    return scope_0_d;\n}");
  }

  function buildColorSource(col, useLighting) {
    var lgt = useLighting ? '' : '    return scope_0_material.albedo;';
    return "\nvec3 shade(vec3 p, vec3 normal) {\n    float d = 100.0;\n    vec3 op = p;\n\tvec3 lightDirection = vec3(0.0, 1.0, 0.0);\n\tvec3 backgroundColor = vec3(1.0, 1.0, 1.0);\n\tvec3 mouseIntersect = vec3(0.0,1.0,0.0);\n\t#ifdef USE_PBR\n\tMaterial material = Material(vec3(1.0),0.5,0.7,1.0);\n\tMaterial selectedMaterial = Material(vec3(1.0),0.5,0.7,1.0);\n\t#else\n\tfloat light = 1.0;\n\tfloat occ = 1.0;\n    vec3 color = vec3(1.0,1.0,1.0);\n\tvec3 selectedColor = vec3(1.0,1.0,1.0);\n\t#endif\n".concat(col, "\n").concat(lgt, "\n\t#ifdef USE_PBR\n\treturn pbrLighting(\n\t\tworldPos.xyz,\n\t\tnormal,\n\t\tlightDirection,\n\t\tscope_0_material,\n\t\tbackgroundColor\n\t\t);\n\t#else\n\treturn scope_0_material.albedo*simpleLighting(p, normal, lightDirection, );*occ;\n\t#endif\n}");
  } // Converts binary math operators to our own version


  function replaceBinaryOp(syntaxTree) {
    if (_typeof(syntaxTree) === 'object') {
      for (var node in syntaxTree) {
        if (syntaxTree.hasOwnProperty(node)) {
          replaceBinaryOp(syntaxTree[node]);
        }
      }
    }

    if (syntaxTree !== null && syntaxTree['type'] === 'BinaryExpression') {
      var op = syntaxTree['operator'];

      if (op === '*' || op === '/' || op === '-' || op === '+') {
        if (op === '*') {
          syntaxTree['callee'] = {
            type: 'Identifier',
            name: 'mult'
          };
        } else if (op === '/') {
          syntaxTree['callee'] = {
            type: 'Identifier',
            name: 'divide'
          };
        } else if (op === '-') {
          syntaxTree['callee'] = {
            type: 'Identifier',
            name: 'sub'
          };
        } else if (op === '+') {
          syntaxTree['callee'] = {
            type: 'Identifier',
            name: 'add'
          };
        }

        syntaxTree['type'] = 'CallExpression';
        syntaxTree['arguments'] = [syntaxTree['left'], syntaxTree['right']];
        syntaxTree['operator'] = undefined;
      }
    }
  }

  function replaceOperatorOverload(syntaxTree) {
    try {
      if (syntaxTree && _typeof(syntaxTree) === "object") {
        for (var node in syntaxTree) {
          if (syntaxTree.hasOwnProperty(node)) {
            replaceOperatorOverload(syntaxTree[node]);
          }
        }
      }

      if (syntaxTree && _typeof(syntaxTree) === "object" && 'type' in syntaxTree && syntaxTree.type === 'ExpressionStatement' && 'expression' in syntaxTree && syntaxTree.expression.type === 'AssignmentExpression') {
        var op = syntaxTree.expression.operator;

        if (op === '+=' || op === '-=' || op === '/=' || op === '*=' || op === '%=') {
          syntaxTree.expression.operator = "=";
          syntaxTree.expression.right = {
            type: 'BinaryExpression',
            left: syntaxTree.expression.left,
            right: syntaxTree.expression.right
          };

          if (op === '+=') {
            syntaxTree.expression.right.operator = '+';
          } else if (op === '-=') {
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
      if (syntaxTree && _typeof(syntaxTree) === "object") {
        for (var node in syntaxTree) {
          if (syntaxTree.hasOwnProperty(node)) {
            replaceSliderInput(syntaxTree[node]);
          }
        }
      }

      if (syntaxTree && _typeof(syntaxTree) === "object" && 'type' in syntaxTree && syntaxTree['type'] === 'VariableDeclaration') {
        var d = syntaxTree['declarations'][0];
        var name = d.id.name;

        if (d && d.init && d.init.callee !== undefined && (d.init.callee.name === 'input' || d.init.callee.name === 'input2D')) {
          d.init.arguments.unshift({
            type: "Literal",
            value: name,
            raw: name
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  function uniformsToGLSL(uniforms) {
    var uniformsHeader = '';

    for (var i = 0; i < uniforms.length; i++) {
      var uniform = uniforms[i];
      uniformsHeader += "uniform ".concat(uniform.type, " ").concat(uniform.name, ";\n");
    }

    return uniformsHeader;
  }
  function baseUniforms() {
    return [{
      name: 'time',
      type: 'float',
      value: 0.0
    }, {
      name: 'opacity',
      type: 'float',
      value: 1.0
    }, {
      name: '_scale',
      type: 'float',
      value: 1.0
    }, // {name:'sculptureCenter', type: 'vec3', value: [0,0,0]},
    {
      name: 'mouse',
      type: 'vec3',
      value: [0.5, 0.5, 0.5]
    }, {
      name: 'stepSize',
      type: 'float',
      value: 0.85
    }, {
      name: 'resolution',
      type: 'vec2',
      value: [800, 600]
    }];
  }
  function bindStaticData(staticData, spCode) {
    spCode = convertFunctionToString(spCode);
    return "const staticData = JSON.parse(`".concat(JSON.stringify(staticData), "`)\n") + spCode;
  }
  function sculptToGLSL(userProvidedSrc) {
    var PI = Math.PI;
    var TWO_PI = Math.PI * 2;
    var TAU = TWO_PI;
    var debug = false;
    var tree = esprima.parse(userProvidedSrc);
    replaceOperatorOverload(tree);
    replaceBinaryOp(tree);
    replaceSliderInput(tree);
    userProvidedSrc = escodegen.generate(tree);

    if (debug) {
      console.log('tree', tree);
    }

    var generatedJSFuncsSource = "";
    var geoSrc = "";
    var colorSrc = "";
    var varCount = 0;
    var primCount = 0;
    var stateCount = 0;
    var useLighting = true;
    var enable2DFlag = false;
    var stateStack = [];
    var uniforms = baseUniforms();
    var stepSizeConstant = 0.85;
    var maxIterations = 300; ////////////////////////////////////////////////////////////
    // Generates JS from headers referenced in the bindings.js
    //

    function box(arg_0, arg_1, arg_2) {
      if (arg_1 !== undefined) {
        ensureScalar('box', arg_0);
        ensureScalar('box', arg_1);
        ensureScalar('box', arg_2);
        applyMode("box(".concat(getCurrentState().p, ", ").concat(collapseToString(arg_0), ", ").concat(collapseToString(arg_1), ", ").concat(collapseToString(arg_2), ")"));
      } else if (arg_0.type === 'vec3') {
        applyMode("box(".concat(getCurrentState().p, ", ").concat(collapseToString(arg_0), ")"));
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
      if (arg_1 !== undefined) {
        ensureScalar(funcName, arg_0);
        ensureScalar(funcName, arg_1);
        applyMode("".concat(funcName, "(").concat(getCurrentState().p, ", ").concat(collapseToString(arg_0), ", ").concat(collapseToString(arg_1), ")"));
      } else if (arg_0.type === 'vec2') {
        applyMode("".concat(funcName, "(").concat(getCurrentState().p, ", ").concat(collapseToString(arg_0), ")"));
      } else {
        compileError("'".concat(funcName, "' accepts either an x, y or a vec2"));
      }
    }

    var primitivesJS = "";

    for (var _i = 0, _Object$entries = Object.entries(geometryFunctions); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          funcName = _Object$entries$_i[0],
          body = _Object$entries$_i[1];

      var argList = body['args'];
      primitivesJS += "function " + funcName + "(";

      for (var argIdx = 0; argIdx < argList.length; argIdx++) {
        if (argIdx !== 0) primitivesJS += ", ";
        primitivesJS += "arg_" + argIdx;
      }

      primitivesJS += ") {\n";
      var argIdxB = 0;

      var _iterator = _createForOfIteratorHelper(argList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var argDim = _step.value;

          if (argDim === 1) {
            primitivesJS += "    ensureScalar(\"" + funcName + "\", arg_" + argIdxB + ");\n";
          }

          argIdxB += 1;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      primitivesJS += "    applyMode(\"" + funcName + "(\"+getCurrentState().p+\", \" + ";

      for (var _argIdx = 0; _argIdx < argList.length; _argIdx++) {
        primitivesJS += "collapseToString(arg_" + _argIdx + ") + ";
        if (_argIdx < argList.length - 1) primitivesJS += "\", \" + ";
      }

      primitivesJS += "\")\");\n}\n\n";
    }

    generatedJSFuncsSource += primitivesJS;

    function generateGLSLWrapper(funcJSON) {
      var wrapperSrc = "";

      for (var _i2 = 0, _Object$entries2 = Object.entries(funcJSON); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            _funcName = _Object$entries2$_i[0],
            _body = _Object$entries2$_i[1];

        var _argList = _body['args'];
        var returnType = _body['ret'];
        wrapperSrc += "function " + _funcName + "(";

        for (var _argIdx2 = 0; _argIdx2 < _argList.length; _argIdx2++) {
          if (_argIdx2 !== 0) wrapperSrc += ", ";
          wrapperSrc += "arg_" + _argIdx2;
        }

        wrapperSrc += ") {\n";
        var _argIdxB = 0;

        var _iterator2 = _createForOfIteratorHelper(_argList),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var arg = _step2.value;
            wrapperSrc += "    arg_" + _argIdxB + " = tryMakeNum(arg_" + _argIdxB + ");\n";
            _argIdxB += 1;
          } // debug here

        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        wrapperSrc += "    return new makeVarWithDims(\"" + _funcName + "(\" + ";

        for (var _argIdx3 = 0; _argIdx3 < _argList.length; _argIdx3++) {
          wrapperSrc += "arg_" + _argIdx3 + " + ";
          if (_argIdx3 < _argList.length - 1) wrapperSrc += "\", \" + ";
        }

        wrapperSrc += "\")\", " + returnType + ");\n}\n";
      }

      return wrapperSrc;
    }

    function mix(arg_0, arg_1, arg_2) {
      ensureSameDims('mix', arg_0, arg_1);

      if (arg_2.dims !== 1 && arg_2.dims !== arg_0.dims) {
        compileError("'mix' third argument must be float or match dim of first args");
      }

      ensureScalar('mix', arg_2);
      arg_0 = tryMakeNum(arg_0);
      arg_1 = tryMakeNum(arg_1);
      arg_2 = tryMakeNum(arg_2);
      return new makeVarWithDims("mix(".concat(arg_0, ", ").concat(arg_1, ", ").concat(arg_2, ")"), arg_0.dims);
    }

    function ensureSameDims(funcName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var dims = args.map(function (arg) {
        return arg.dim;
      });
      var initialDim = dims[0];

      for (var i = 1; i < dims.length; i++) {
        var next = dims[i];

        if (initialDim !== next) {
          compileError("'".concat(funcName, "' argument dimensions do not match"));
        }
      }
    }

    var mathFunctionsJS = generateGLSLWrapper(mathFunctions);
    generatedJSFuncsSource += mathFunctionsJS;
    var builtInOtherJS = generateGLSLWrapper(glslBuiltInOther);
    generatedJSFuncsSource += builtInOtherJS;
    var builtInOneToOneJS = "";

    var _iterator3 = _createForOfIteratorHelper(glslBuiltInOneToOne),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _funcName2 = _step3.value;
        builtInOneToOneJS += "function ".concat(_funcName2, "(x) {\n    x = tryMakeNum(x);\n\t// debug here\n\treturn new makeVarWithDims(\"").concat(_funcName2, "(\" + x + \")\", x.dims);\n}\n");
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    generatedJSFuncsSource += builtInOneToOneJS; ////////////////////////////////////////////////////////////
    //End Auto Generated Code
    // set step size directly

    function setStepSize(val) {
      if (typeof val !== 'number') {
        compileError("setStepSize accepts only a constant number. Was given: '" + val.type + "'");
      }

      stepSizeConstant = val;
    } // set step size on a scale 0-100


    function setGeometryQuality(val) {
      if (typeof val !== 'number') {
        compileError("setGeometryQuality accepts only a constant number between 0 and 100. Was given: '" + val.type + "'");
      }

      stepSizeConstant = 1 - 0.01 * val * 0.995;
    }

    function setMaxIterations(val) {
      if (typeof val !== 'number' || val < 0) {
        compileError("setMaxIterations accepts only a constant number >= 0. Was given: '" + val.type + "'");
      }

      maxIterations = Math.round(val);
    }

    function getCurrentState() {
      return stateStack[stateStack.length - 1];
    }

    function getCurrentMode() {
      return getCurrentState().mode;
    }

    function getCurrentDist() {
      return getCurrentState().id + "d";
    }

    function getCurrentPos() {
      return getCurrentState().id + "p";
    }

    function getMainMaterial() {
      return getCurrentState().id + "material";
    }

    function getCurrentMaterial() {
      return getCurrentState().id + "currentMaterial";
    }

    function appendSources(source) {
      geoSrc += "    " + source;
      colorSrc += "    " + source;
    }

    function appendColorSource(source) {
      colorSrc += "    " + source;
    } // General Variable class


    function makeVar(source, type, dims, inline) {
      this.type = type;
      this.dims = dims;

      if (inline) {
        this.name = source;
      } else {
        var vname = "v_" + varCount;
        appendSources(this.type + " " + vname + " = " + source + ";\n");
        varCount += 1;
        this.name = vname;
      }

      this.toString = function () {
        return this.name;
      };

      return this;
    } // Need to handle cases like - vec3(v.x, 0.1, mult(0.1, time))


    function float(source, inline) {
      //if (typeof source !== 'string') {
      source = collapseToString(source); //}

      return new makeVar(source, 'float', 1, inline);
    }

    function vec2(source, y, inline) {
      if (y === undefined) {
        y = source;
      }

      if (typeof source !== 'string') {
        source = "vec2(" + collapseToString(source) + ", " + collapseToString(y) + ")";
      }

      var self = new makeVar(source, 'vec2', 2, inline);
      var currX = new makeVarWithDims(self.name + ".x", 1, true);
      var currY = new makeVarWithDims(self.name + ".y", 1, true);
      var objs = {
        'x': currX,
        'y': currY
      };
      applyVectorAssignmentOverload(self, objs);
      return self;
    }

    function vec3(source, y, z, inline) {
      if (y === undefined) {
        y = source;
        z = source;
      }

      if (typeof source !== 'string') {
        source = "vec3(" + collapseToString(source) + ", " + collapseToString(y) + ", " + collapseToString(z) + ")";
      }

      var self = new makeVar(source, 'vec3', 3, inline);
      var currX = new makeVarWithDims(self.name + ".x", 1, true);
      var currY = new makeVarWithDims(self.name + ".y", 1, true);
      var currZ = new makeVarWithDims(self.name + ".z", 1, true);
      var objs = {
        'x': currX,
        'y': currY,
        'z': currZ
      };
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
        source = "vec4(" + collapseToString(source) + ", " + collapseToString(y) + ", " + collapseToString(z) + ", " + collapseToString(w) + ")";
      }

      var self = new makeVar(source, 'vec4', 4, inline);
      var currX = new makeVarWithDims(self.name + ".x", 1, true);
      var currY = new makeVarWithDims(self.name + ".y", 1, true);
      var currZ = new makeVarWithDims(self.name + ".z", 1, true);
      var currW = new makeVarWithDims(self.name + ".w", 1, true);
      var objs = {
        'x': currX,
        'y': currY,
        'z': currZ,
        'w': currW
      };
      applyVectorAssignmentOverload(self, objs);
      return self;
    } // allows the user to re-assign a vector's components


    function applyVectorAssignmentOverload(self, objs) {
      Object.entries(objs).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            func = _ref2[1];

        Object.defineProperty(self, key, {
          get: function get() {
            return func;
          },
          set: function set(val) {
            return appendSources("".concat(self.name, ".").concat(key, " = ").concat(val, ";\n"));
          }
        });
      });
    }

    function makeVarWithDims(source, dims, inline) {
      if (dims < 1 || dims > 4) compileError("Tried creating variable with dim: " + dims);
      if (dims === 1) return new float(source, inline);
      if (dims === 2) return new vec2(source, null, inline);
      if (dims === 3) return new vec3(source, null, null, inline);
      if (dims === 4) return new vec4(source, null, null, null, inline);
    } // Modes enum


    var modes = {
      UNION: 10,
      DIFFERENCE: 11,
      INTERSECT: 12,
      BLEND: 13,
      MIXGEO: 14
    };
    var additiveModes = [modes.UNION, modes.BLEND, modes.MIXGEO];
    var materialModes = {
      NORMAL: 20,
      // F it let's start at 20 why not
      MIXMAT: 21
    };
    var time = new float("time", true);
    var mouse = new vec3("mouse", null, null, true);
    var normal = new vec3("normal", null, null, true);

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
      var tp = _typeof(val);

      if (typeof val !== 'number' && val.type !== 'float') {
        compileError("'" + funcName + "'" + " accepts only a scalar. Was given: '" + val.type + "'");
      }
    }

    function ensureGroupOp(funcName, a, b) {
      if (typeof a !== 'string' && typeof b !== 'string') {
        if (a.dims !== 1 && b.dims !== 1 && a.dims !== b.dims) {
          compileError("'" + funcName + "'" + " dimension mismatch. Was given: '" + a.type + "' and '" + b.type + "'");
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
    } // Modes (prepend these with GEO or something to indicate they are geometry modes?)


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
      ensureScalar("mixGeo", amount);
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
          return ["smoothAdd", getCurrentState().blendAmount];
          break;

        case modes.MIXGEO:
          return ["mix", getCurrentState().mixAmount];
          break;

        default:
          return ["add"];
      }
    }

    function applyMode(prim, finalCol) {
      var primName = "prim_" + primCount;
      primCount += 1;
      appendSources("float " + primName + " = " + prim + ";\n");

      if (additiveModes.includes(getCurrentMode())) {
        var selectedCC = finalCol !== undefined ? finalCol : getCurrentMaterial();

        if (getCurrentState().materialMode === materialModes.NORMAL) {
          appendColorSource("if (" + primName + " < " + getCurrentDist() + ") { " + getMainMaterial() + " = " + selectedCC + "; }\n");
        } else if (getCurrentState().materialMode === materialModes.MIXMAT) {
          appendColorSource(getMainMaterial() + " = blendMaterial(" + selectedCC + ", " + getMainMaterial() + ", " + collapseToString(getCurrentState().matMixAmount) + ");\n");
        }
      }

      var cmode = getMode();
      appendSources(getCurrentDist() + " = " + cmode[0] + "( " + primName + ", " + getCurrentDist() + " " + (cmode.length > 1 ? "," + collapseToString(cmode[1]) : "") + " );\n");
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
        mixAmount: 0.0
      });
      appendSources("float " + getCurrentDist() + " = 100.0;\n");
      var lastP = stateStack.length > 1 ? stateStack[stateStack.length - 2].id + "p" : "p";
      var lastMat = stateStack.length > 1 ? stateStack[stateStack.length - 2].id + "currentMaterial" : "material";
      appendSources("vec3 " + getCurrentPos() + " = " + lastP + ";\n");
      appendColorSource("Material " + getMainMaterial() + " = " + lastMat + ";\n");
      appendColorSource("Material " + getCurrentMaterial() + " = " + lastMat + ";\n");
      getCurrentState().p = vec3(getCurrentPos(), null, null, true);
      stateCount++;
    }

    function popState() {
      var lastDist = getCurrentDist();
      var lastMaty = getMainMaterial();
      stateStack.pop();
      applyMode(lastDist, lastMaty);
    } // !!! puts initial state on stack, this never comes off !!!


    pushState();

    function shape(func) {
      var makeShape = function makeShape() {
        pushState();
        var output = func.apply(this, arguments);
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
    } /// Math ///
    // Group ops


    function mult(a, b) {
      if (typeof a === 'number' && typeof b === 'number') return a * b;
      a = tryMakeNum(a);
      b = tryMakeNum(b);

      if (debug) {
        console.log("multiplying...");
        console.log("a: ", a);
        console.log("b: ", b);
      }

      ensureGroupOp("mult", a, b);
      var dims = Math.max(a.dims, b.dims);
      return new makeVarWithDims("(" + collapseToString(a) + "*" + collapseToString(b) + ")", dims);
    }

    function add(a, b) {
      if (typeof a === 'number' && typeof b === 'number') return a + b;
      a = tryMakeNum(a);
      b = tryMakeNum(b);

      if (debug) {
        console.log("adding...");
        console.log("a: ", a);
        console.log("b: ", b);
      }

      ensureGroupOp("add", a, b);
      var dims = Math.max(a.dims, b.dims);
      return new makeVarWithDims("(" + collapseToString(a) + "+" + collapseToString(b) + ")", dims);
    }

    function sub(a, b) {
      if (typeof a === 'number' && typeof b === 'number') return a - b;
      a = tryMakeNum(a);
      b = tryMakeNum(b);

      if (debug) {
        console.log("subtracting...");
        console.log("a: ", a);
        console.log("b: ", b);
      }

      ensureGroupOp("sub", a, b);
      var dims = Math.max(a.dims, b.dims);
      return new makeVarWithDims("(" + collapseToString(a) + "-" + collapseToString(b) + ")", dims);
    }

    function divide(a, b) {
      if (typeof a === 'number' && typeof b === 'number') return a / b;
      a = tryMakeNum(a);
      b = tryMakeNum(b);

      if (debug) {
        console.log("dividing...");
        console.log("a: ", a);
        console.log("b: ", b);
      }

      ensureGroupOp("divide", a, b);
      var dims = Math.max(a.dims, b.dims);
      return new makeVarWithDims("(" + collapseToString(a) + "/" + collapseToString(b) + ")", dims);
    }

    function setSDF(dist) {
      ensureScalar("setSDF", dist);
      applyMode(collapseToString(dist));
    }

    function getSDF() {
      return float(getCurrentDist(), true);
    } // Displacements


    function reset() {
      if (stateStack.length > 1) {
        appendSources(getCurrentPos() + " = " + stateStack[stateStack.length - 2].id + "p;\n");
      } else {
        appendSources(getCurrentPos() + " = op;\n");
      }
    }

    function displace(xc, yc, zc) {
      if (yc === undefined || zc === undefined) {
        appendSources(getCurrentPos() + " -= " + collapseToString(xc) + ";\n");
      } else {
        ensureScalar("displace", xc);
        ensureScalar("displace", yc);
        ensureScalar("displace", zc);
        appendSources(getCurrentPos() + " -= vec3( " + collapseToString(xc) + ", " + collapseToString(yc) + ", " + collapseToString(zc) + ");\n");
      }
    }

    function setSpace(xc, yc, zc) {
      if (yc === undefined || zc === undefined) {
        appendSources(getCurrentPos() + " = " + collapseToString(xc) + ";\n");
      } else {
        ensureScalar("setSpace", xc);
        ensureScalar("setSpace", yc);
        ensureScalar("setSpace", zc);
        appendSources(getCurrentPos() + " = vec3( " + collapseToString(xc) + ", " + collapseToString(yc) + ", " + collapseToString(zc) + ");\n");
      }
    }

    function repeat(spacing, repetitions) {
      var spc = collapseToString(spacing);
      var reps = collapseToString(repetitions);
      appendSources(getCurrentPos() + " = " + getCurrentPos() + "-" + spc + "*clamp(round(" + getCurrentPos() + "/" + spc + "),-" + reps + " ," + reps + ");\n");
    }

    function rotateX(angle) {
      ensureScalar("rotateX", angle);
      appendSources(getCurrentPos() + ".yz = " + getCurrentPos() + ".yz*rot2(" + collapseToString(angle) + ");\n");
    }

    function rotateY(angle) {
      ensureScalar("rotateY", angle);
      appendSources(getCurrentPos() + ".xz = " + getCurrentPos() + ".xz*rot2(" + collapseToString(angle) + ");\n");
    }

    function rotateZ(angle) {
      ensureScalar("rotateZ", angle);
      appendSources(getCurrentPos() + ".xy = " + getCurrentPos() + ".xy*rot2(" + collapseToString(angle) + ");\n");
    }

    function mirrorX() {
      appendSources(getCurrentPos() + ".x = abs(" + getCurrentPos() + ".x);\n");
    }

    function mirrorY() {
      appendSources(getCurrentPos() + ".y = abs(" + getCurrentPos() + ".y);\n");
    }

    function mirrorZ() {
      appendSources(getCurrentPos() + ".z = abs(" + getCurrentPos() + ".z);\n");
    }

    function mirrorXYZ() {
      appendSources(getCurrentPos() + " = abs(" + getCurrentPos() + ");\n");
    }

    function flipX() {
      appendSources(getCurrentPos() + ".x = -" + getCurrentPos() + ".x;\n");
    }

    function flipY() {
      appendSources(getCurrentPos() + ".y = -" + getCurrentPos() + ".y;\n");
    }

    function flipZ() {
      appendSources(getCurrentPos() + ".z = -" + getCurrentPos() + ".z;\n");
    }

    function expand(amount) {
      ensureScalar("expand", amount);
      appendSources(getCurrentDist() + " -= " + collapseToString(amount) + ";\n");
    }

    function shell(depth) {
      ensureScalar("shell", depth);
      appendSources(getCurrentDist() + " = shell( " + getCurrentDist() + "," + collapseToString(depth) + ");\n");
    } // Color/Lighting


    function color(col, green, blue) {
      if (green !== undefined) {
        ensureScalar("color", col);
        ensureScalar("color", green);
        ensureScalar("color", blue);
        appendColorSource(getCurrentMaterial() + ".albedo = vec3(" + collapseToString(col) + ", " + collapseToString(green) + ", " + collapseToString(blue) + ");\n");
      } else {
        if (col.type !== 'vec3') compileError("albedo must be vec3");
        appendColorSource(getCurrentMaterial() + ".albedo = " + collapseToString(col) + ";\n");
      }
    }

    function metal(val) {
      ensureScalar("metal", val);
      appendColorSource(getCurrentMaterial() + ".metallic = " + collapseToString(val) + ";\n");
    }

    function shine(val) {
      ensureScalar("shine", val);
      appendColorSource(getCurrentMaterial() + ".roughness = 1.0-" + collapseToString(val) + ";\n");
    }

    function lightDirection(x, y, z) {
      if (y === undefined || z === undefined) {
        appendColorSource("lightDirection = " + collapseToString(x) + ";\n");
      } else {
        ensureScalar("lightDirection", x);
        ensureScalar("lightDirection", y);
        ensureScalar("lightDirection", z);
        appendColorSource("lightDirection = vec3( " + collapseToString(x) + ", " + collapseToString(y) + ", " + collapseToString(z) + ");\n");
      }
    }

    function backgroundColor(x, y, z) {
      if (y === undefined || z === undefined) {
        appendColorSource("backgroundColor = " + collapseToString(x) + ";\n");
      } else {
        ensureScalar("backgroundColor", x);
        ensureScalar("backgroundColor", y);
        ensureScalar("backgroundColor", z);
        appendColorSource("backgroundColor = vec3( " + collapseToString(x) + ", " + collapseToString(y) + ", " + collapseToString(z) + ");\n");
      }
    } // should this also be 'op'? 


    function noLighting() {
      useLighting = false;
    } // replaced with a noop for now to prevent errors


    function basicLighting() {}

    function occlusion(amount) {
      var amt = "1.0";

      if (amount !== undefined) {
        ensureScalar("occlusion", amount);
        amt = collapseToString(amount);
      }

      appendColorSource(getCurrentMaterial() + ".ao = mix(1.0, occlusion(op,normal), " + amt + ");\n");
    }

    function test() {
      appendSources("//this is a test\n");
    }

    function input(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
      var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;

      if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
        compileError('input value, min, and max must be constant numbers');
      }

      uniforms.push({
        name: name,
        type: 'float',
        value: value,
        min: min,
        max: max
      });
      return new float(name, true);
    }

    function input2D(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        x: 0.0,
        y: 0.0
      };
      var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        x: 0.0,
        y: 0.0
      };
      var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        x: 1.0,
        y: 1.0
      };

      if (typeof value === 'number' && typeof min === 'number' && _typeof(max) === 'object') {
        // syntax input2D(.2, 1.2);
        var x = value;
        var y = min;
        uniforms.push({
          name: name,
          type: 'vec2',
          value: {
            x: x,
            y: y
          },
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: 1,
            y: 1
          }
        });
        return new vec2(name, true);
      }

      if (_typeof(value) !== 'object' || _typeof(min) !== 'object' || _typeof(max) !== 'object') {
        compileError('input2D: value, min, and max must be a vec2');
      }

      var xyExist = [value, min, max].reduce(function (acc, curr) {
        return acc && 'x' in curr && 'y' in curr;
      });

      if (!xyExist) {
        compileError('input2D: value, min, and max must be a vec2');
      }

      uniforms.push({
        name: name,
        type: 'vec2',
        value: value,
        min: min,
        max: max
      });
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


    var error = undefined;

    function getSpherical() {
      return toSpherical(getSpace());
    } // Define any code that needs to reference auto generated from bindings.js code here


    var postGeneratedFunctions = [getSpherical].map(function (el) {
      return el.toString();
    }).join('\n');
    eval(generatedJSFuncsSource + postGeneratedFunctions + userProvidedSrc);

    if (enable2DFlag) {
      setSDF(0);
    }

    var geoFinal = buildGeoSource(geoSrc);
    var colorFinal = buildColorSource(colorSrc, useLighting);
    return {
      uniforms: uniforms,
      stepSizeConstant: stepSizeConstant,
      maxIterations: maxIterations,
      geoGLSL: geoFinal,
      colorGLSL: colorFinal,
      error: error
    };
  }

  var defaultFragSourceGLSL = "float surfaceDistance(vec3 p) {\n    float d = sphere(p, 0.3);\n\treturn d;\n}\n\nvec3 shade(vec3 p, vec3 normal) {\n    vec3 lightDirection = vec3(0.0, 1.0, 0.0);\n    float light = simpleLighting(p, normal, lightDirection);\n    vec3 color = vec3(1.0, 1.0, 1.0);\n\treturn color*light;\n}\n";
  var threeJSVertexSource = "\nvarying vec4 worldPos;\n//varying vec2 vUv;\nvarying vec3 sculptureCenter;\nvoid main()\n{\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    worldPos = modelMatrix*vec4(position,1.0);\n    sculptureCenter = (modelMatrix * vec4(0., 0., 0., 1.)).xyz;\n    //vUv = uv;\n    gl_Position = projectionMatrix * mvPosition;\n}\n";
  var minimalVertexSource = "\nattribute vec3 coordinates;\nvarying vec3 sculptureCenter;\nvoid main(void) {\n     sculptureCenter = vec3(0.0);\n     gl_Position = vec4(coordinates, 1.0);\n}";
  var threeHeader = "\n#define GLSL_NEED_ROUND\nuniform mat4 projectionMatrix;\nuniform sampler2D msdf;\n\n//varying vec2 vUv;\nvarying vec4 worldPos;\nvarying vec3 sculptureCenter;\n";
  var minimalHeader = "\nprecision highp float;\n#define GLSL_NEED_ROUND\nuniform mat4 projectionMatrix;\nvarying vec3 sculptureCenter;\n#define cameraPosition vec3(0.0,0.0,-2.0)\n#define vUv vec2(0.0)\n#define worldPos vec4(vec2((gl_FragCoord.x/resolution.x-0.5)*(resolution.x/resolution.y),gl_FragCoord.y/resolution.y-0.5)*1.75,0.0,0.0)\n";
  var usePBRHeader = '#define USE_PBR\n';
  var useHemisphereLight = '#define HEMISPHERE_LIGHT\n';
  var sculptureStarterCode = "\nfloat surfaceDistance(vec3 p);\n\nconst float PI = 3.14159265;\nconst float TAU = PI*2.0;\nconst float TWO_PI = TAU;\n\nconst float max_dist = 100.0;\nconst float intersection_threshold = 0.00001;\n\nstruct Material {\n    vec3 albedo;\n    float metallic;\n    float roughness;\n    float ao;\n};\n\nMaterial blendMaterial(Material a, Material b, float amount) {\n    return Material(\n        mix(a.albedo, b.albedo, amount), \n        mix(a.metallic, b.metallic, amount), \n        mix(a.roughness, b.roughness, amount), \n        mix(a.ao, b.ao, amount)\n    );\n}\n\n// Trig functions normalized to the range 0.0-1.0\nfloat nsin(float x) {\n    return sin(x)*0.5+0.5;\n}\n\nfloat ncos(float x) {\n    return cos(x)*0.5+0.5;\n}\n\n#ifdef GLSL_NEED_ROUND\nfloat round(float x) {\n    return floor(x+0.5);\n}\nvec2 round(vec2 x) {\n    return floor(x+0.5);\n}\nvec3 round(vec3 x) {\n    return floor(x+0.5);\n}\nvec4 round(vec4 x) {\n    return floor(x+0.5);\n}\n#endif\n\nfloat softSquare(float x, int pw) {\n    return 1.0/(pow(tan(x),float(pw+1)*2.0)+1.0);\n}\n\n// Simple oscillators \n\nfloat osc(float freq, float amp, float base, float phase) {\n    return base+amp*sin(TWO_PI*(freq*time+phase));\n}\n\nfloat osc(float freq, float amp, float base) {\n    return osc(freq, amp, base, 0.0);\n}\n\nfloat osc(float freq, float amp) {\n    return osc(freq, amp, 1.0);\n}\n\nfloat osc(float freq) {\n    return osc(freq, 0.5);\n}\n\nfloat osc() {\n    return osc(1.0);\n}\n\n// Color Conversion\n// https://www.shadertoy.com/view/lsS3Wc\nvec3 hsv2rgb( vec3 c )\n{\n    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );\n    return c.z * mix( vec3(1.0), rgb, c.y);\n}\n\nvec3 rgb2hsv( vec3 c)\n{\n    const float eps = 0.0000001;\n    vec4 k = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);\n    vec4 p = mix(vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z<c.y) ? 1.0 : 0.0);\n    vec4 q = mix(vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x<c.x) ? 1.0 : 0.0);\n    float d = q.x - min(q.w, q.y);\n    return vec3(abs(q.z + (q.w - q.y) / (6.0*d+eps)), d / (q.x+eps), q.x);\n}\n\n\n// Primitives\n\nfloat line(vec3 p, vec3 a, vec3 b) {\n\tvec3 pa = p-a;\n  \tvec3 ba = b-a;\n\tfloat t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\n  \treturn length(pa - ba*t);\n}\n\n//line with radius\nfloat line( vec3 p, vec3 a, vec3 b, float radius ){\n    vec3 pa = p - a, ba = b - a;\n    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );\n    return length( pa - ba*h ) - radius;\n}\n\nfloat sphere( vec3 p, float size ){\n  return length(p)-size;\n}\n\nfloat uBox( vec3 p, vec3 b ){\n  return length(max(abs(p)-b,0.0));\n}\n\nfloat uRoundBox( vec3 p, vec3 b, float r ){\n  return length(max(abs(p)-b,0.0))-r;\n}\n\nfloat box( vec3 p, vec3 box ){\n  vec3 d = abs(p) - box;\n  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));\n}\n\nfloat box( vec3 p, float bx, float by, float bz) {\n    vec3 box = vec3(bx,by,bz);\n    vec3 d = abs(p) - box;\n    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));\n}\n\nfloat roundedBox( vec3 p, vec3 box , float r){\n  return length(max(abs(p)-box,0.0))-r;\n}\n\nfloat torus( vec3 p, vec2 t ){\n  vec2 q = vec2(length(p.xz)-t.x,p.y);\n  return length(q)-t.y;\n}\n\nfloat torus( vec3 p, float tx, float ty ){\n    vec2 q = vec2(length(p.xz)-tx,p.y);\n    return length(q)-ty;\n}\n\nfloat infCylinder( vec3 p, vec3 c )\n{\n  return length(p.xz-c.xy)-c.z;\n}\n\nfloat cylinder( vec3 p, vec2 h )\n{\n  vec2 d = abs(vec2(length(p.xz),p.y)) - h;\n  return min(max(d.x,d.y),0.0) + length(max(d,0.0));\n}\n\nfloat cylinder( vec3 p, float hx, float hy)\n{\n    return cylinder(p, vec2(hx,hy));\n}\n\nfloat cone( vec3 p, vec2 c )\n{\n    // c must be normalized\n    float q = length(p.xy);\n    return dot(c,vec2(q,p.z));\n}\n\nfloat plane( vec3 p, vec4 n )\n{\n  // n must be normalized\n  return dot(p,n.xyz) + n.w;\n}\n\nfloat plane( vec3 p, float nx, float ny, float nz, float nw)\n{\n  // n must be normalized\n  return dot(p,normalize(vec3(nx,ny,nz))) + nw;\n}\n\nfloat hexPrism( vec3 p, vec2 h )\n{\n    vec3 q = abs(p);\n    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);\n}\n\nfloat triPrism( vec3 p, vec2 h )\n{\n    vec3 q = abs(p);\n    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);\n}\n\nfloat capsule( vec3 p, vec3 a, vec3 b, float r )\n{\n    vec3 pa = p - a, ba = b - a;\n    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );\n    return length( pa - ba*h ) - r;\n}\n\nfloat triangularPrism( vec3 p, vec2 h ) {\n    vec3 q = abs(p);\n    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);\n}\n\nfloat cappedCone( vec3 p, vec3 c )\n{\n    vec2 q = vec2( length(p.xz), p.y );\n    vec2 v = vec2( c.z*c.y/c.x, -c.z );\n    vec2 w = v - q;\n    vec2 vv = vec2( dot(v,v), v.x*v.x );\n    vec2 qv = vec2( dot(v,w), v.x*w.x );\n    vec2 d = max(qv,0.0)*qv/vv;\n    return sqrt( dot(w,w) - max(d.x,d.y) ) * sign(max(q.y*v.x-q.x*v.y,w.y));\n}\n\nfloat roundCone(vec3 p, vec3 a, vec3 b, float r1, float r2)\n{\n    // sampling independent computations (only depend on shape)\n    vec3  ba = b - a;\n    float l2 = dot(ba,ba);\n    float rr = r1 - r2;\n    float a2 = l2 - rr*rr;\n    float il2 = 1.0/l2;\n    \n    // sampling dependant computations\n    vec3 pa = p - a;\n    float y = dot(pa,ba);\n    float z = y - l2;\n    vec3 rv = pa*l2 - ba*y;\n    float x2 = dot(rv,rv);\n    float y2 = y*y*l2;\n    float z2 = z*z*l2;\n\n    // single square root!\n    float k = sign(rr)*rr*rr*x2;\n    if( sign(z)*a2*z2 > k ) return  sqrt(x2 + z2)        *il2 - r2;\n    if( sign(y)*a2*y2 < k ) return  sqrt(x2 + y2)        *il2 - r1;\n                            return (sqrt(x2*a2*il2)+y*rr)*il2 - r1;\n}\n\nfloat ellipsoid( vec3 p, vec3 r )\n{\n    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);\n}\n\nvec3 toSpherical(vec3 p) {\n    float phi = atan(p.x,p.z);\n    float r = length(p);\n    float theta = acos(-p.y/r);\n    return vec3(r,theta,phi);\n}\n\nvec3 fromSpherical(vec3 p) {\n    return vec3(p.x*sin(p.y)*cos(p.z), p.x*sin(p.y)*sin(p.z), p.x*cos(p.y));\n}\n\nfloat dot2( vec3 v ) { return dot(v,v); }\n\nfloat uTriangle( vec3 p, vec3 a, vec3 b, vec3 c )\n{\n    vec3 ba = b - a; vec3 pa = p - a;\n    vec3 cb = c - b; vec3 pb = p - b;\n    vec3 ac = a - c; vec3 pc = p - c;\n    vec3 nor = cross( ba, ac );\n    return sqrt(\n    (sign(dot(cross(ba,nor),pa)) +\n     sign(dot(cross(cb,nor),pb)) +\n     sign(dot(cross(ac,nor),pc))<2.0)\n     ?\n     min( min(\n     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),\n     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),\n     dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc) )\n     :\n     dot(nor,pa)*dot(nor,pa)/dot2(nor) );\n}\n\nfloat add( float d1, float d2 )\n{\n    return min(d1,d2);\n}\n\nfloat add(float d1, float d2, float d3) {\n   return min(d1, min(d2,d3));\n}\n\nfloat add(float d1, float d2, float d3, float d4) {\n    return min(min(d1,d2),min(d3,d4));\n}\n\nfloat add(float d1, float d2, float d3, float d4, float d5) {\n    return min(min(min(d1,d2), min(d3,d4)),d5);\n}\n\nfloat add(float d1, float d2, float d3, float d4, float d5, float d6) {\n    return min(min(min(d1,d2),min(d3,d4)),min(d5,d6));\n}\n\nfloat add(float d1, float d2, float d3, float d4, float d5, float d6, float d7) {\n    return min(min(min(d1,d2),min(d3,d4)),min(min(d5,d6),d7));\n}\n\nfloat subtract( float d1, float d2 )\n{\n    return max(-d1,d2);\n}\n\nfloat intersect( float d1, float d2 )\n{\n    return max(d1,d2);\n}\n\nfloat shell(float d, float thickness) {\n    return abs(d)-thickness;\n}\n\nvec3 repeat3D(vec3 p, vec3 c )\n{\n    return mod(p,c)-0.5*c;\n}\n\nfloat repeat1D(float p, float size)\n{\n\tfloat halfSize = size * 0.5;\n\tfloat c = floor((p + halfSize) / size);\n  \tp = mod(p + halfSize, size)-halfSize;\n  \treturn c;\n}\n\nmat2 rot2(float a){\n    float c = cos(a); float s = sin(a);\n\treturn mat2(c, s, -s, c);\n}\n\n// polynomial smooth min (k = 0.1) (from IQ)\nfloat smoothAdd( float a, float b, float k )\n{\n    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );\n    return mix( b, a, h ) - k*h*(1.0-h);\n}\n\nfloat smoothSubtract(float a,float b, float k)\n{\n    return -smoothAdd(-a,-b,k);\n}\n\nvec2 _hash( vec2 p ) // replace this by something better\n{\n\tp = vec2( dot(p,vec2(127.1,311.7)),\n\t\t\t  dot(p,vec2(269.5,183.3)) );\n\treturn -1.0 + 2.0*fract(sin(p)*43758.5453123);\n}\n\nfloat noise( vec2 p )\n{\n    const float K1 = 0.366025404; // (sqrt(3)-1)/2;\n    const float K2 = 0.211324865; // (3-sqrt(3))/6;\n\tvec2 i = floor( p + (p.x+p.y)*K1 );\n\t\n    vec2 a = p - i + (i.x+i.y)*K2;\n    vec2 o = step(a.yx,a.xy);    \n    vec2 b = a - o + K2;\n\tvec2 c = a - 1.0 + 2.0*K2;\n    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );\n\tvec3 n = h*h*h*h*vec3( dot(a,_hash(i+0.0)), dot(b,_hash(i+o)), dot(c,_hash(i+1.0)));\n    return dot( n, vec3(70.0) );\n}\n\n// from https://www.shadertoy.com/view/4djSRW\nfloat _hash13(vec3 p3)\n{\n    p3  = fract(p3 * .1031);\n    p3 += dot(p3, p3.zyx + 31.32);\n    return fract((p3.x + p3.y) * p3.z);\n}\n\nvec3 _hash33(vec3 p3)\n{\n    p3 = fract(p3 * vec3(.1031,.11369,.13787));\n    p3 += dot(p3, p3.yxz+19.19);\n    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));\n}\n\n// simplex noise from https://www.shadertoy.com/view/4sc3z2\nfloat noise(vec3 p)\n{\n    const float K1 = 0.333333333;\n    const float K2 = 0.166666667;\n    \n    vec3 i = floor(p + (p.x + p.y + p.z) * K1);\n    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);\n    \n    // thx nikita: https://www.shadertoy.com/view/XsX3zB\n    vec3 e = step(vec3(0.0), d0 - d0.yzx);\n\tvec3 i1 = e * (1.0 - e.zxy);\n\tvec3 i2 = 1.0 - e.zxy * (1.0 - e);\n    \n    vec3 d1 = d0 - (i1 - 1.0 * K2);\n    vec3 d2 = d0 - (i2 - 2.0 * K2);\n    vec3 d3 = d0 - (1.0 - 3.0 * K2);\n    \n    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);\n    vec4 n = h * h * h * h * vec4(dot(d0, _hash33(i)), dot(d1, _hash33(i + i1)), dot(d2, _hash33(i + i2)), dot(d3, _hash33(i + 1.0)));\n    \n    return dot(vec4(31.316), n);\n}\n\nfloat fractalNoise(vec3 p, float falloff, int iterations) {\n    float v = 0.0;\n    float amp = 1.0;\n    float invFalloff = 1.0/falloff;\n    for (int i=0; i<10; i++) {\n        v += noise(p)*amp;\n\tif (i>=iterations) break;\n        amp *= invFalloff;\n        p *= falloff;\n    }\n    return v;\n} \n\nfloat fractalNoise(vec3 p) {\n    return fractalNoise(p, 2.0, 5);\n}\n\n// Adapted from IQ's usage at https://www.shadertoy.com/view/lllXz4\n// Spherical Fibonnacci points, Benjamin Keinert, Matthias Innmann,\n// Michael Sanger and Marc Stamminger\n\nconst float PHI = 1.61803398875;\n\nvec4 sphericalDistribution( vec3 p, float n )\n{\n    p = normalize(p);\n    float m = 1.0 - 1.0/n;\n\n    float phi = min(atan(p.y, p.x), PI), cosTheta = p.z;\n\n    float k = max(2.0, floor( log(n * PI * sqrt(5.0) * (1.0 - cosTheta*cosTheta))/ log(PHI+1.0)));\n    float Fk = pow(PHI, k)/sqrt(5.0);\n    vec2 F = vec2( round(Fk), round(Fk * PHI) ); // k, k+1\n\n    vec2 ka = 2.0*F/n;\n    vec2 kb = 2.0*PI*( fract((F+1.0)*PHI) - (PHI-1.0) );\n\n    mat2 iB = mat2( ka.y, -ka.x,\n    kb.y, -kb.x ) / (ka.y*kb.x - ka.x*kb.y);\n\n    vec2 c = floor( iB * vec2(phi, cosTheta - m));\n    float d = 8.0;\n    float j = 0.0;\n    vec3 bestQ = vec3(0.0,0.0,8.0);\n    for( int s=0; s<4; s++ )\n    {\n        vec2 uv = vec2( float(s-2*(s/2)), float(s/2) );\n\n        float i = dot(F, uv + c); // all quantities are ingeters (can take a round() for extra safety)\n\n        float phi = 2.0*PI*fract(i*PHI);\n        float cosTheta = m - 2.0*i/n;\n        float sinTheta = sqrt(1.0 - cosTheta*cosTheta);\n\n        vec3 q = vec3( cos(phi)*sinTheta, sin(phi)*sinTheta, cosTheta );\n        float squaredDistance = dot(q-p, q-p);\n        if (squaredDistance < d)\n        {\n            d = squaredDistance;\n            j = i;\n            bestQ = q;\n        }\n    }\n    return vec4(bestQ,sqrt(d));\n}\n\n// Compute intersection of ray and SDF. You probably won't need to modify this.\nfloat intersect(vec3 ro, vec3 rd, float stepFraction) {\n    float t = 0.0;\n\tfor(int i = 0; i < MAX_ITERATIONS; ++i) {\n\t\tfloat h = surfaceDistance((ro+rd*t));\n\t\tif(h < intersection_threshold || t > max_dist) break;\n\t\tt += h*STEP_SIZE_CONSTANT;\n    }\n\treturn t;\n}\n\nvec3 getRayDirection() {\n\treturn normalize(worldPos.xyz-cameraPosition);\n}\n\nvec3 mouseIntersection() {\n    vec3 rayDirection = getRayDirection();\n    return mouse+rayDirection*intersect(mouse, rayDirection, 0.8);\n}\n\n// Calculate the normal of a SDF\nvec3 calcNormal( vec3 pos )\n{\n    vec2 e = vec2(1.0,-1.0)*0.0005;\n    return normalize( e.xyy*surfaceDistance( pos + e.xyy ) + \n\t\t      e.yyx*surfaceDistance( pos + e.yyx ) + \n\t\t      e.yxy*surfaceDistance( pos + e.yxy ) + \n\t\t      e.xxx*surfaceDistance( pos + e.xxx ) );\n}\n\n// from https://learnopengl.com/PBR/Lighting\nvec3 fresnelSchlick(float cosTheta, vec3 F0)\n{\n    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);\n}  \n\nfloat DistributionGGX(vec3 N, vec3 H, float roughness)\n{\n    float a      = roughness*roughness;\n    float a2     = a*a;\n    float NdotH  = max(dot(N, H), 0.0);\n    float NdotH2 = NdotH*NdotH;\n\t\n    float num   = a2;\n    float denom = (NdotH2 * (a2 - 1.0) + 1.0);\n    denom = PI * denom * denom;\n\t\n    return num / denom;\n}\n\nfloat GeometrySchlickGGX(float NdotV, float roughness)\n{\n    float r = (roughness + 1.0);\n    float k = (r*r) / 8.0;\n\n    float num   = NdotV;\n    float denom = NdotV * (1.0 - k) + k;\n\t\n    return num / denom;\n}\n\nfloat GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)\n{\n    float NdotV = max(dot(N, V), 0.0);\n    float NdotL = max(dot(N, L), 0.0);\n    float ggx2  = GeometrySchlickGGX(NdotV, roughness);\n    float ggx1  = GeometrySchlickGGX(NdotL, roughness);\n\t\n    return ggx1 * ggx2;\n}\n\n// adapted from https://learnopengl.com/PBR/Lighting\nvec3 pbrLighting(vec3 WordPos, vec3 N, vec3 lightdir, Material mat, vec3 backgroundColor) {\n\n    vec3 V = -getRayDirection();\n    vec3 F0 = vec3(0.04); \n    F0 = mix(F0, mat.albedo, mat.metallic);\n\t\n    // reflectance equation\n    vec3 Lo = vec3(0.0);\n\n    // calculate per-light radiance\n    vec3 L = normalize(lightdir);\n    vec3 H = normalize(V + L);        \n    \n    // cook-torrance brdf\n    float NDF = DistributionGGX(N, H, mat.roughness);        \n    float G   = GeometrySmith(N, V, L, mat.roughness);      \n    vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);    \n\n    vec3 kS = F;\n    vec3 kD = vec3(1.0) - kS;\n    kD *= 1.0 - mat.metallic;\t  \n    \n    vec3 numerator    = NDF * G * F;\n    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);\n    vec3 specular     = numerator / max(denominator, 0.001);  \n    \n    // add to outgoing radiance Lo\n    float NdotL = max(dot(N, L), 0.0);                \n    Lo += (kD * mat.albedo / PI + specular) * NdotL;  \n  \n    float hemi = 1.0;\n    #ifdef HEMISPHERE_LIGHT\n    // ground is black, taken into account by ambient light\n    hemi = NdotL*1.25;\n    #endif\n\n    vec3 ambient = (vec3(1.2+hemi) * mat.albedo) * mat.ao;\n    vec3 color = ambient + Lo*1.7;\n    \n    /// this section adds edge glow as if there were a white env map ///\n    /// there should probably be a way to disable it //\n    float lt = 1.0-max(dot(N,V),0.0);\n    lt = pow(lt,6.0);\n    color += 16.0*lt*(0.2+mat.albedo)*mat.metallic*backgroundColor*(1.3-mat.roughness);\n    ///\n    \n    color = color / (color + vec3(1.0));\n    color = pow(color, vec3(1.0/2.2));\n   \n    return color;\n}\n\nfloat simpleLighting(vec3 p, vec3 normal, vec3 lightdir) {\n    // Simple phong-like shading\n    float value = clamp(dot(normal, normalize(lightdir)),0.0, 1.0);\n    return value * 0.3 + 0.7;\n}\n\nfloat specularLighting(vec3 p, vec3 normal, vec3 lightDirection, float shine) {\n    float lamb = clamp(dot(normal,normalize(lightDirection)),0.0,1.0);\n    float spec = pow(lamb, exp(10.0*shine));\n    lamb = 0.4*lamb + 0.4 + 0.2*spec;\n    return lamb;\n}\n\nfloat shadow(vec3 p, vec3 lightDirection, float amount) {\n    float t = intersect(p+0.001*lightDirection, lightDirection, stepSize);\n    return t < (max_dist - 0.1) ? 1.0-amount : 1.0;\n}\n\n// From https://www.shadertoy.com/view/XslSWl\nfloat occlusion(vec3 p,vec3 n) { \n    const int AO_SAMPLES = 8;\n    const float INV_AO_SAMPLES = 1.0/float(AO_SAMPLES);\n    const float R = 0.9;\n    const float D = 0.8;\n    float r = 0.0;\n    for(int i = 0; i < AO_SAMPLES; i++) {\n        float f = float(i)*INV_AO_SAMPLES;\n        float h = 0.05+f*R;\n        float d = surfaceDistance(p + n * h) - 0.003;\n        r += clamp(h*D-d,0.0,1.0) * (1.0-f);\n    }    \n    return clamp(1.0-r,0.0,1.0);\n}\n";
  var fragFooter = "\n// For advanced users //\nvoid main() {\n\n    vec3 rayOrigin = (cameraPosition - sculptureCenter) / max(intersection_threshold, _scale);\n    vec3 rayDirection = getRayDirection();\n    float t = intersect(rayOrigin, rayDirection, stepSize);\n    if(t < max_dist) {\n        vec3 p = (rayOrigin + rayDirection*t);\n        //vec4 sp = projectionMatrix*viewMatrix*vec4(p,1.0); //could be used to set FragDepth\n        vec3 normal = calcNormal(p);\n        // p *= _scale;\n        vec3 col = shade(p, normal);\n        gl_FragColor = vec4(col, opacity);\n        \n    } else {\n        discard;\n    }\n}\n";

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
    };
  }
  function glslToThreeJSMaterial(source, payload) {
    var src = glslToThreeJSShaderSource(source);
    return makeMaterial(src.uniforms, src.vert, src.frag, payload);
  }
  function glslToThreeJSMesh(source, payload) {
    return makeBasicMesh(glslToThreeJSMaterial(source, payload));
  }
  function sculptToThreeJSShaderSource(source) {
    var src = sculptToGLSL(source);

    if (src.error) {
      console.log(src.error);
    }

    var frg = threeHeader + usePBRHeader + useHemisphereLight + uniformsToGLSL(src.uniforms) + 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n' + 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n' + sculptureStarterCode + src.geoGLSL + '\n' + src.colorGLSL + '\n' + fragFooter;
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
    var src = sculptToThreeJSShaderSource(source);
    var material = makeMaterial(src.uniforms, src.vert, src.frag, payload);
    material.uniformDescriptions = src.uniforms;
    return material;
  }
  function sculptToThreeJSMesh(source, payload) {
    source = convertFunctionToString(source);
    return makeBasicMesh(sculptToThreeJSMaterial(source, payload));
  }
  function createSculptureWithGeometry(geometry, source) {
    var uniformCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
      return {};
    };
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    geometry.computeBoundingSphere();
    var radius = 'radius' in params ? params.radius : geometry.boundingSphere.radius;
    params.radius = radius;
    params.geometry = geometry;
    return createSculpture(source, uniformCallback, params);
  } // uniformCallback 

  function createSculpture(source) {
    var uniformCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return {};
    };
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    source = convertFunctionToString(source);
    var radius = 'radius' in params ? params.radius : 2;
    var geometry;

    if ('geometry' in params) {
      geometry = params.geometry;
    } else {
      var segments = 'segments' in params ? params.segments : 8;
      geometry = new three.SphereBufferGeometry(radius, segments, segments);
    }

    var material = sculptToThreeJSMaterial(source);
    material.uniforms['opacity'].value = 1.0;
    material.uniforms['mouse'].value = new three.Vector3();
    material.uniforms['_scale'].value = radius;
    var mesh = new three.Mesh(geometry, material);

    mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
      var uniformsToUpdate = uniformCallback();

      if (!(_typeof(uniformsToUpdate) === "object")) {
        throw "createSculpture takes, (source, uniformCallback, params) the uniformCallback must be a function that returns a dictionary of uniforms to update";
      }

      for (var _i = 0, _Object$entries = Object.entries(uniformsToUpdate); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            uniform = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        material.uniforms[uniform].value = value;
      } // material.uniforms['sculptureCenter'].value = geometry.position;

    };

    return mesh;
  }

  function uniformDescriptionToThreeJSFormat(unifs, payload) {
    var finalUniforms = {};

    if (payload && payload !== undefined && payload.msdfTexture !== undefined) {
      finalUniforms["msdf"] = {
        value: payload.msdfTexture || new three.Texture()
      };
    }

    unifs.forEach(function (uniform) {
      if (uniform.type === 'float') {
        finalUniforms[uniform.name] = {
          value: uniform.value
        };
      } else if (uniform.type === 'vec2') {
        finalUniforms[uniform.name] = {
          value: new three.Vector2(uniform.value.x, uniform.value.y)
        };
      } else if (uniform.type === 'vec3') {
        finalUniforms[uniform.name] = {
          value: new three.Vector3(uniform.value.x, uniform.value.y, uniform.value.z)
        };
      } else if (uniform.type === 'vec4') {
        finalUniforms[uniform.name] = {
          value: new Vector4(uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w)
        };
      }
    });
    return finalUniforms;
  } // could use a scale parameter


  function makeMaterial(unifs, vert, frag, payload) {
    var material = new three.ShaderMaterial({
      uniforms: uniformDescriptionToThreeJSFormat(unifs, payload),
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      side: three.BackSide
    });
    material.extensions.fragDepth = false;
    return material;
  } // There should be more options supported like size and shape


  function makeBasicMesh(material) {
    return new three.Mesh(new three.BoxBufferGeometry(2, 2, 2), material);
  }

  function uniformToCpp(uniforms) {
    var res = '';

    for (var i = 0; i < uniforms.length; i++) {
      var unif = uniforms[i];
      res += unif.type + ' ' + unif.name + ' = ';

      if (typeof unif.value === 'number') {
        // float
        res += unif.value + 0.0000001 + 'f';
      } else {
        // vec
        res += 'vec' + unif.value.length + '(';

        for (var j = 0; j < unif.value.length; j++) {
          res += unif.value[j] + 0.0000001 + 'f';

          if (j + 1 < unif.value.length) {
            res += ', ';
          }
        }

        res += ')';
      }

      res += ';\n';
    }

    return res;
  }

  var cppFooter = "\n\n";
  var cppHeader = uniformToCpp(baseUniforms());

  function glslToGLM(source) {
    // converts all numbers to floats
    var result = source.replace(/([^a-zA-Z][0-9]+([.][^a-zA-Z][0-9]*)|[.][0-9]+)()/g, '$1f'); // adds parentheses after swizzling for glm to pick up  

    result = result.replace(/([a-zA-Z0-9][.][w-z]{2,})()/g, '$1()');
    return result;
  }

  function glslToOfflineRenderer(source) {}
  function sculptToOfflineRenderer(source) {
    var src = sculptToGLSL(source); //console.log(filteredStarter);

    return cppHeader + glslToGLM('const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + 'f;\n' + 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n' + sculptureStarterCode + src.geoGLSL + src.colorGLSL) + cppFooter;
  }

  function glslToMinimalRenderer(canvas, source, updateUniforms) {
    var fullFrag = minimalHeader + usePBRHeader + useHemisphereLight + uniformsToGLSL(baseUniforms()) + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + 'const int MAX_ITERATIONS = 300;\n' + sculptureStarterCode + source + fragFooter;
    return fragToMinimalRenderer(canvas, fullFrag, updateUniforms);
  }
  /**
   * for fast and efficient use on the web
   * input - sculpt code
   * output - a fully self-contained lightweight html file which renders the sculpture
   **/

  function sculptToMinimalRenderer(canvas, source, updateUniforms) {
    if (typeof source === "function") {
      source = source.toString();
      source = source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
    } else if (!(typeof source === "string")) {
      throw "sculptToMinimalRenderer requires the source code to be a function, or a string";
    }

    var generatedGLSL = sculptToGLSL(source);
    var fullFrag = minimalHeader + usePBRHeader + useHemisphereLight + uniformsToGLSL(generatedGLSL.uniforms) + 'const float STEP_SIZE_CONSTANT = ' + generatedGLSL.stepSizeConstant + ';\n' + 'const int MAX_ITERATIONS = ' + generatedGLSL.maxIterations + ';\n' + sculptureStarterCode + generatedGLSL.geoGLSL + '\n' + generatedGLSL.colorGLSL + '\n' + fragFooter;
    return fragToMinimalRenderer(canvas, fullFrag, updateUniforms);
  }

  function fragToMinimalRenderer(canvas, fullFrag, updateUniforms) {
    // if no update function is provided assume no-op
    if (updateUniforms === undefined) {
      updateUniforms = function updateUniforms() {
        return {};
      };
    }

    function resizeCanvas() {
      var devicePixelRatio = window.devicePixelRatio || 1; // change this so canvas doesn't have to fill entire window

      var width = window.innerWidth * devicePixelRatio;
      var height = window.innerHeight * devicePixelRatio;

      if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    var gl = canvas.getContext('webgl');
    var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0];
    var indices = [3, 2, 1, 3, 1, 0];
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, minimalVertexSource);
    gl.compileShader(vertShader);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fullFrag);
    gl.compileShader(fragShader);
    var compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    console.log('Shader compiled successfully: ' + compiled);
    var compilationLog = gl.getShaderInfoLog(fragShader);
    if (!compiled) console.log('Shader compiler log: ' + compilationLog);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.clearColor(1.0, 1.0, 1.0, 0.9);
    gl.enable(gl.DEPTH_TEST);
    var oTime = Date.now();
    var loc = gl.getUniformLocation(shaderProgram, "time");

    var _scale = gl.getUniformLocation(shaderProgram, "_scale");

    var resolution = gl.getUniformLocation(shaderProgram, "resolution");
    var opac = gl.getUniformLocation(shaderProgram, "opacity");
    var mouseloc = gl.getUniformLocation(shaderProgram, "mouse");
    gl.uniform1f(opac, 1.0);
    gl.uniform1f(_scale, 1.0);
    var userUniformUpdateFuncs = assignUniforms(updateUniforms);
    canvas.addEventListener("pointermove", function (e) {
      var devicePixelRatio = window.devicePixelRatio || 1;
      var canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
      var canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
      gl.uniform3f(mouseloc, 2.0 * canvasX / canvas.width - 1.0, 2.0 * (1.0 - canvasY / canvas.height) - 1.0, -0.5);
    }, false);

    function updateDraw() {
      if (typeof updateUniforms === 'function') {
        callUniformFuncs(userUniformUpdateFuncs, updateUniforms());
      }

      gl.uniform1f(loc, (Date.now() - oTime) * 0.001);
      var devicePixelRatio = window.devicePixelRatio || 1;
      var wwidth = window.innerWidth * devicePixelRatio;
      var wheight = window.innerHeight * devicePixelRatio;
      gl.uniform2fv(resolution, [wwidth, wheight]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      window.requestAnimationFrame(updateDraw);
    }

    updateDraw(); // loops through a dictionary and calls the function sotred in the value

    function callUniformFuncs(uniformFuncs, updatedUniforms) {
      if (_typeof(updatedUniforms) !== 'object') {
        console.error('updateUniforms must return a dictionary of uniform names and values. Instead got: ', updateUniforms);
        return;
      }

      Object.entries(uniformFuncs).forEach(function (keys) {
        var _keys = _slicedToArray(keys, 2),
            key = _keys[0],
            uniformUpdateFunc = _keys[1];

        if (key in updatedUniforms) {
          uniformUpdateFunc(updatedUniforms[key]);
        }
      });
    }

    function assignUniforms(updateUniforms) {
      if (typeof updateUniforms !== 'function') {
        console.error('updateUniforms must be a function that returns a dictionary of uniform names and values');
        return {};
      }

      var userUniformUpdateFuncs = {};
      var uniformsDict = updateUniforms();

      if (uniformsDict !== undefined && _typeof(uniformsDict) === 'object') {
        Object.entries(uniformsDict).forEach(function (keys) {
          var _keys2 = _slicedToArray(keys, 2),
              key = _keys2[0],
              val = _keys2[1];

          var unifLocation = gl.getUniformLocation(shaderProgram, key);

          if (typeof val === 'number') {
            userUniformUpdateFuncs[key] = function (unif) {
              return gl.uniform1f(unifLocation, unif);
            };
          } else if (Array.isArray(val)) {
            if (val.length === 1) {
              userUniformUpdateFuncs[key] = function (unif) {
                return gl.uniform1f(unifLocation, unif[0]);
              };
            } else if (val.length === 2) {
              userUniformUpdateFuncs[key] = function (unif) {
                return gl.uniform2iv(unifLocation, unif);
              };
            } else if (val.length === 3) {
              userUniformUpdateFuncs[key] = function (unif) {
                return gl.uniform3iv(unifLocation, unif);
              };
            } else if (val.length === 4) {
              userUniformUpdateFuncs[key] = function (unif) {
                return gl.uniform4iv(unifLocation, unif);
              };
            } else {
              console.error('Uniforms must be either a float or an array with length 1, 2, 3 or 4');
            }
          } else {
            console.error('Uniforms must be either a float or an array with length 1, 2, 3 or 4');
          }
        });
      }

      return userUniformUpdateFuncs;
    }
  }

  /**
   * for fast tesing
   * input - sculpt code
   * output - self-contained lightweight html which renders the sculpture
   **/
  function sculptToMinimalHTMLRenderer(spCode, libPath) {
    return makeHTML(spCode, 'sculptToMinimalRenderer', libPath);
  }
  function glslToMinimalHTMLRenderer(spCode, libPath) {
    return makeHTML(spCode, 'glslToMinimalRenderer', libPath);
  }

  function makeHTML(spCode, minRenderFunc, libPath) {
    return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <title>Shader Park</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style>\n        body {\n            margin: 2em;\n            width: 100vw; \n            height: 100vh; \n            margin : 0px; \n            padding : 0px;\n            border : 0px; \n            background-color : white;\n        }\n        canvas {\n            width: 100%;\n            height:100%;\n            margin : 0px;\n            padding : 0px;\n            border : 0px;\n            background-color : transparent;\n        }\n    </style>\n</head>  \n<body>    \n    <canvas class=\"my-canvas\"></canvas>\n    <script type=\"module\">\n    import {".concat(minRenderFunc, "} from '").concat(libPath, "';\n    let canvas = document.querySelector('.my-canvas');\n    ").concat(minRenderFunc, "(canvas, `").concat(spCode, "`);          \n    </script>\n</body>\n</html>");
  }

  /**
   * export for meshing with https://github.com/tdhooper/glsl-marching-cubes
   * input - sculpt code
   * output - glsl containing "mapDistance"
   **/

  function sculptToRawSDF4Meshing(source) {
    var minimalHeader = "\nprecision highp float;\n#define GLSL_NEED_ROUND\nuniform float w_width;\nuniform float w_height;\nuniform mat4 projectionMatrix;\n#define cameraPosition vec3(0.0,0.0,-1.0)\n#define vUv vec2(0.0)\n#define worldPos vec4(vec2((gl_FragCoord.x/w_width-0.5)*(w_width/w_height),gl_FragCoord.y/w_height-0.5)*1.75,0.0,0.0)\n#define STEP_SIZE_CONSTANT 0.9\n#define MAX_ITERATIONS 300\n#define stepSize 0.9\n#define mouse vec3(0.0)\n#define time 0.0\n";
    var generatedGLSL = sculptToGLSL(source);
    var fullFrag = minimalHeader + usePBRHeader + useHemisphereLight //+ uniformsToGLSL(generatedGLSL.uniforms) 
    + sculptureStarterCode + generatedGLSL.geoGLSL;
    return fullFrag.replace(/surfaceDistance/g, 'mapDistance');
  }

  /**
   *  TD target for GLSL and  Sculpt/JS api.
   * 
   *  TODO: make these materials 'plug in' to Touch Designer's ' PBR lighting model.
   */

  var TDHeader = "\nuniform float uShadowStrength;\nuniform vec3 uShadowColor;\nuniform vec4 uBaseColor;\nuniform float uMetallic;\nuniform float uRoughness;\nuniform float uSpecularLevel;\nuniform float uAmbientOcclusion;\nuniform vec3 cameraPosition;\nuniform sampler2D sBaseColorMap;\nuniform float useTDLighting;\n\n\nin Vertex\n{\n\tvec4 color;\n\tvec3 worldSpacePos;\n\tvec3 worldSpaceNorm;\n\tflat int cameraIndex;\n\tvec2 texCoord0;\n\tvec3 sculptureCenter;\n} iVert;\n\n#define sculptureCenter iVert.sculptureCenter;\n#define GLSL_NEED_ROUND\n#define worldPos iVert.worldSpacePos\nlayout(location = 0) out vec4 oFragColor[TD_NUM_COLOR_BUFFERS];\nout float depthTexture;\n";
  var TDFooter = "\nvoid main()\n{\n\t// This allows things such as order independent transparency\n\t// and Dual-Paraboloid rendering to work properly\n\tTDCheckDiscard();\n\n\t// Raymarching\n\tvec3 rayOrigin = worldPos.xyz-sculptureCenter;\n\tvec3 rayDirection = getRayDirection();\n\trayOrigin -= rayDirection*2.0;\n\tfloat t = intersect(rayOrigin, rayDirection, stepSize);\n    depthTexture = t;\n\n\tvec4 outcol = vec4(0.0, 0.0, 0.0, 0.0);\n\tvec3 diffuseSum = vec3(0.0, 0.0, 0.0);\n\tvec3 specularSum = vec3(0.0, 0.0, 0.0);\n\n\tvec3 worldSpaceNorm = normalize(iVert.worldSpaceNorm.xyz);\n\t// vec3 normal = normalize(worldSpaceNorm.xyz);\n\tif(t < 2.5) {\n\t\tvec3 p = (rayOrigin + rayDirection*t);\n\t\tvec3 normal = calcNormal(p);\n\t\tvec3 raymarchedColor = shade(p, normal);\n\t\n\t\tvec3 baseColor = uBaseColor.rgb;\n\n\t\t// 0.08 is the value for dielectric specular that\n\t\t// Substance Designer uses for it's top-end.\n\t\tfloat specularLevel = 0.08 * uSpecularLevel;\n\t\tfloat metallic = uMetallic;\n\n\t\tfloat roughness = uRoughness;\n\n\t\tfloat ambientOcclusion = uAmbientOcclusion;\n\n\t\tvec3 finalBaseColor = baseColor.rgb * iVert.color.rgb;\n\n\t\tvec2 texCoord0 = iVert.texCoord0.st;\n\t\tvec4 baseColorMap = texture(sBaseColorMap, texCoord0.st);\n\t\tfinalBaseColor *= baseColorMap.rgb;\n\n\n\t\t// A roughness of exactly 0 is not allowed\n\t\troughness = max(roughness, 0.0001);\n\n\t\tvec3 pbrDiffuseColor = finalBaseColor * (1.0 - metallic);\n\t\tvec3 pbrSpecularColor = mix(vec3(specularLevel), finalBaseColor, metallic);\n\n\t\tvec3 viewVec = normalize(uTDMats[iVert.cameraIndex].camInverse[3].xyz - iVert.worldSpacePos.xyz );\n\n\n\t\t// Your shader will be recompiled based on the number\n\t\t// of lights in your scene, so this continues to work\n\t\t// even if you change your lighting setup after the shader\n\t\t// has been exported from the Phong MAT\n\t\tfor (int i = 0; i < TD_NUM_LIGHTS; i++)\n\t\t{\n\t\t\tTDPBRResult res;\n\t\t\tres = TDLightingPBR(i,\n\t\t\t\t\t\t\t\tpbrDiffuseColor,\n\t\t\t\t\t\t\t\tpbrSpecularColor,\n\t\t\t\t\t\t\t\tiVert.worldSpacePos.xyz,\n\t\t\t\t\t\t\t\tnormal,\n\t\t\t\t\t\t\t\tuShadowStrength, uShadowColor,\n\t\t\t\t\t\t\t\tviewVec,\n\t\t\t\t\t\t\t\troughness);\n\t\t\tdiffuseSum += res.diffuse;\n\t\t\tspecularSum += res.specular;\n\t\t}\n\n\t\t// Environment lights\n\t\tfor (int i = 0; i < TD_NUM_ENV_LIGHTS; i++)\n\t\t{\n\t\t\tTDPBRResult res;\n\t\t\tres = TDEnvLightingPBR(i,\n\t\t\t\t\t\tpbrDiffuseColor,\n\t\t\t\t\t\tpbrSpecularColor,\n\t\t\t\t\t\tnormal,\n\t\t\t\t\t\tviewVec,\n\t\t\t\t\t\troughness,\n\t\t\t\t\t\tambientOcclusion);\n\t\t\tdiffuseSum += res.diffuse;\n\t\t\tspecularSum += res.specular;\n\t\t}\n\t\t// Final Diffuse Contribution\n\t\tvec3 finalDiffuse = diffuseSum;\n\t\toutcol.rgb += finalDiffuse;\n\n\t\t// Final Specular Contribution\n\t\tvec3 finalSpecular = vec3(0.0);\n\t\tfinalSpecular += specularSum;\n\n\t\toutcol.rgb += finalSpecular;\n\n\n\t\t// Apply fog, this does nothing if fog is disabled\n\t\toutcol = TDFog(outcol, iVert.worldSpacePos.xyz, iVert.cameraIndex);\n\n\t\t// Alpha Calculation\n\t\tfloat alpha = uBaseColor.a * iVert.color.a ;\n\n\t\t// Dithering, does nothing if dithering is disabled\n\t\toutcol = TDDither(outcol);\n\n\t\toutcol.rgb *= alpha;\n\n\t\t// Modern GL removed the implicit alpha test, so we need to apply\n\t\t// it manually here. This function does nothing if alpha test is disabled.\n\t\tTDAlphaTest(alpha);\n\n\t\toutcol.a = alpha;\n\t\toutcol = mix(vec4(raymarchedColor, 1.0), outcol, useTDLighting);\n\t\toFragColor[0] = TDOutputSwizzle(outcol);\n\n\n\t\t// TD_NUM_COLOR_BUFFERS will be set to the number of color buffers\n\t\t// active in the render. By default we want to output zero to every\n\t\t// buffer except the first one.\n\t\tfor (int i = 1; i < TD_NUM_COLOR_BUFFERS; i++)\n\t\t{\n\t\t\toFragColor[i] = vec4(0.0);\n\t\t}\n\t} else {\n\t\tdiscard;\n\t}\n}\n";
  function glslToTouchDesignerShaderSource(source) {
    return {
      uniforms: baseUniforms(),
      frag: TDHeader + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + 'const int MAX_ITERATIONS = 300;\n' + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + TDFooter,
      vert: minimalVertexSource
    };
  }
  function sculptToTouchDesignerShaderSource(source) {
    var src = sculptToGLSL(source);

    if (src.error) {
      console.log(src.error);
    }

    var frg = TDHeader + usePBRHeader + useHemisphereLight + uniformsToGLSL(src.uniforms) + 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n' + 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n' + sculptureStarterCode + src.geoGLSL + '\n' + src.colorGLSL + '\n' + TDFooter;
    var sdf = 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n' + 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n' + sculptureStarterCode + src.geoGLSL;
    return {
      uniforms: src.uniforms,
      frag: frg,
      vert: minimalVertexSource,
      error: src.error,
      geoGLSL: src.geoGLSL,
      colorGLSL: src.colorGLSL,
      sdf: sdf,
      glslUniforms: uniformsToGLSL(src.uniforms)
    };
  }

  console.log("using shader-park version: 0.1.6"); /// Generate code for various targets

  exports.bindStaticData = bindStaticData;
  exports.createSculpture = createSculpture;
  exports.createSculptureWithGeometry = createSculptureWithGeometry;
  exports.defaultFragSourceGLSL = defaultFragSourceGLSL;
  exports.glslToMinimalHTMLRenderer = glslToMinimalHTMLRenderer;
  exports.glslToMinimalRenderer = glslToMinimalRenderer;
  exports.glslToOfflineRenderer = glslToOfflineRenderer;
  exports.glslToThreeJSMaterial = glslToThreeJSMaterial;
  exports.glslToThreeJSMesh = glslToThreeJSMesh;
  exports.glslToThreeJSShaderSource = glslToThreeJSShaderSource;
  exports.glslToTouchDesignerShaderSource = glslToTouchDesignerShaderSource;
  exports.sculptToMinimalHTMLRenderer = sculptToMinimalHTMLRenderer;
  exports.sculptToMinimalRenderer = sculptToMinimalRenderer;
  exports.sculptToOfflineRenderer = sculptToOfflineRenderer;
  exports.sculptToRawSDF4Meshing = sculptToRawSDF4Meshing;
  exports.sculptToThreeJSMaterial = sculptToThreeJSMaterial;
  exports.sculptToThreeJSMesh = sculptToThreeJSMesh;
  exports.sculptToThreeJSShaderSource = sculptToThreeJSShaderSource;
  exports.sculptToTouchDesignerShaderSource = sculptToTouchDesignerShaderSource;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
