// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"src/js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODAL_CLOSE_SEC = exports.KEY = exports.RES_PER_PAGE = exports.TIMEOUT_SEC = exports.API_URL = void 0;
var API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes';
exports.API_URL = API_URL;
var TIMEOUT_SEC = 10;
exports.TIMEOUT_SEC = TIMEOUT_SEC;
var RES_PER_PAGE = 10;
exports.RES_PER_PAGE = RES_PER_PAGE;
var KEY = 'be3e16b6-1c79-4900-9087-bfe71b89ee58';
exports.KEY = KEY;
var MODAL_CLOSE_SEC = 2.5;
exports.MODAL_CLOSE_SEC = MODAL_CLOSE_SEC;
},{}],"src/js/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AJAX = void 0;

var _regeneratorRuntime = require("regenerator-runtime");

var _config = require("./config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var timeout = function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request took too long! Timeout after ".concat(s, " second")));
    }, s * 1000);
  });
};

var AJAX = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var uploadData,
        fetchPro,
        res,
        data,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            uploadData = _args.length > 1 && _args[1] !== undefined ? _args[1] : undefined;
            _context.prev = 1;
            fetchPro = uploadData ? fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(uploadData)
            }) : fetch(url);
            _context.next = 5;
            return Promise.race([fetchPro, timeout(_config.TIMEOUT_SEC)]);

          case 5:
            res = _context.sent;
            _context.next = 8;
            return res.json();

          case 8:
            data = _context.sent;

            if (res.ok) {
              _context.next = 11;
              break;
            }

            throw new Error("".concat(data.message, " (").concat(res.status, ")"));

          case 11:
            return _context.abrupt("return", data);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            throw _context.t0;

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 14]]);
  }));

  return function AJAX(_x) {
    return _ref.apply(this, arguments);
  };
}();
/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/


exports.AJAX = AJAX;
},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js","./config":"src/js/config.js"}],"src/js/model.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadRecipe = exports.deleteBookmark = exports.addBookmark = exports.updateServings = exports.getSearchResultsPage = exports.loadSearchResults = exports.loadRecipe = exports.state = void 0;

var _regeneratorRuntime = require("regenerator-runtime");

var _config = require("./config.js");

var _helpers = require("./helpers.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: _config.RES_PER_PAGE
  },
  bookmarks: []
};
exports.state = state;

var createRecipeObject = function createRecipeObject(data) {
  var recipe = data.data.recipe;
  return _objectSpread({
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients
  }, recipe.key && {
    key: recipe.key
  });
};

var loadRecipe = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    var data, recipe;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _helpers.AJAX)("".concat(_config.API_URL, "/").concat(id, "?key=").concat(_config.KEY));

          case 3:
            data = _context.sent;
            state.recipe = createRecipeObject(data);
            recipe = data.data.recipe;
            state.recipe = _objectSpread({
              id: recipe.id,
              title: recipe.title,
              publisher: recipe.publisher,
              sourceUrl: recipe.source_url,
              image: recipe.image_url,
              servings: recipe.servings,
              cookingTime: recipe.cooking_time,
              ingredients: recipe.ingredients
            }, recipe.key && {
              key: recipe.key
            });
            if (state.bookmarks.some(function (bookmark) {
              return bookmark.id === id;
            })) state.recipe.bookmarked = true;else state.recipe.bookmarked = false;
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            //Temp err handling
            console.error("".concat(_context.t0, "\uD83D\uDE25"));
            throw _context.t0;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function loadRecipe(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.loadRecipe = loadRecipe;

var loadSearchResults = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(query) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            state.search.query = query;
            _context2.next = 4;
            return (0, _helpers.AJAX)("".concat(_config.API_URL, "?search=").concat(query, "&key=").concat(_config.KEY));

          case 4:
            data = _context2.sent;
            console.log(data);
            state.search.results = data.data.recipes.map(function (rec) {
              return _objectSpread({
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url
              }, rec.key && {
                key: rec.key
              });
            });
            state.search.page = 1;
            _context2.next = 14;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            console.error("".concat(_context2.t0, "\uD83D\uDE25"));
            throw _context2.t0;

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function loadSearchResults(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.loadSearchResults = loadSearchResults;

var getSearchResultsPage = function getSearchResultsPage() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.search.page;
  state.search.page = page;
  var start = (page - 1) * state.search.resultsPerPage; // 0;

  var end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

exports.getSearchResultsPage = getSearchResultsPage;

var updateServings = function updateServings(newServings) {
  state.recipe.ingredients.forEach(function (ing) {
    ing.quantity = ing.quantity * newServings / state.recipe.servings; // newQt = oldQt * newServings / oldServings // (2 * 8) / 4 = 4
  });
  state.recipe.servings = newServings;
};

exports.updateServings = updateServings;

var persistBookmarks = function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

var addBookmark = function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe); // Mark current recipe as bookmarked

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

exports.addBookmark = addBookmark;

var deleteBookmark = function deleteBookmark(id) {
  // Delete bookmark
  var index = state.bookmarks.findIndex(function (el) {
    return el.id === id;
  });
  state.bookmarks.splice(index, 1); // Mark current recipe as NOT bookmark

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

exports.deleteBookmark = deleteBookmark;

var init = function init() {
  var storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

var clearBookmarks = function clearBookmarks() {
  localStorage.clear('bookmarks');
}; // clearBookmarks();


var uploadRecipe = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(newRecipe) {
    var ingredients, recipe, data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            ingredients = Object.entries(newRecipe).filter(function (entry) {
              return entry[0].startsWith('ingredient') && entry[1] !== '';
            }).map(function (ing) {
              var ingArr = ing[1].split(',').map(function (el) {
                return el.trim();
              }); // const ingArr = ing[1].replaceAll(' ', '').split(',');

              if (ingArr.length !== 3) throw new Error('Wrong ingredient fromat! Please use the correct format :)');

              var _ingArr = _slicedToArray(ingArr, 3),
                  quantity = _ingArr[0],
                  unit = _ingArr[1],
                  description = _ingArr[2];

              return {
                quantity: quantity ? +quantity : null,
                unit: unit,
                description: description
              };
            });
            recipe = {
              title: newRecipe.title,
              source_url: newRecipe.sourceUrl,
              image_url: newRecipe.image,
              publisher: newRecipe.publisher,
              cooking_time: +newRecipe.cookingTime,
              servings: +newRecipe.servings,
              ingredients: ingredients
            };
            _context3.next = 5;
            return (0, _helpers.AJAX)("".concat(_config.API_URL, "?key=").concat(_config.KEY), recipe);

          case 5:
            data = _context3.sent;
            state.recipe = createRecipeObject(data);
            addBookmark(state.recipe);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
  }));

  return function uploadRecipe(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.uploadRecipe = uploadRecipe;
},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js","./config.js":"src/js/config.js","./helpers.js":"src/js/helpers.js"}],"src/img/icons.svg":[function(require,module,exports) {
module.exports = "/icons.ae3c38d5.svg";
},{}],"src/js/views/View.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var View = /*#__PURE__*/function () {
  function View() {
    _classCallCheck(this, View);

    _defineProperty(this, "_data", void 0);
  }

  _createClass(View, [{
    key: "render",
    value:
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} {render=true} if false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Gasper Hajdinjak
     * @todo Finish inplementation
     */
    function render(data) {
      var _render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!data || Array.isArray(data) && data.length === 0) return this.renderError();
      this._data = data;

      var markup = this._generateMarkup();

      if (!_render) return markup;

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }, {
    key: "update",
    value: function update(data) {
      this._data = data;

      var newMarkup = this._generateMarkup();

      var newDOM = document.createRange().createContextualFragment(newMarkup);
      var newElements = Array.from(newDOM.querySelectorAll('*'));
      var curElements = Array.from(this._parentElement.querySelectorAll('*'));
      newElements.forEach(function (newEl, i) {
        var _newEl$firstChild;

        var curEl = curElements[i]; //   console.log(curEl, newEl.isEqualNode(curEl));
        // Updates changed TEXT

        if (!newEl.isEqualNode(curEl) && ((_newEl$firstChild = newEl.firstChild) === null || _newEl$firstChild === void 0 ? void 0 : _newEl$firstChild.nodeValue.trim()) !== '') {
          curEl.textContent = newEl.textContent;
        } // Updates changed ATTRIBUTES


        if (!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(function (attr) {
          return curEl.setAttribute(attr.name, attr.value);
        });
      });
    }
  }, {
    key: "_clear",
    value: function _clear() {
      this._parentElement.innerHTML = '';
    }
  }, {
    key: "renderSpinner",
    value: function renderSpinner() {
      var markup = "\n    \n      <div class=\"spinner\">\n              <svg>\n                <use href=\"".concat(_icons.default, "#icon-loader\"></use>\n              </svg>\n            </div>\n    ");

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }, {
    key: "renderError",
    value: function renderError() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._errorMessage;
      var markup = "\n        <div class=\"error\">\n              <div>\n                <svg>\n                  <use href=".concat(_icons.default, "#icon-alert-triangle\"></use>\n                </svg>\n              </div>\n              <p>").concat(message, "!</p>\n            </div>\n            ");

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }, {
    key: "renderMessage",
    value: function renderMessage() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._message;
      var markup = "\n        <div class=\"message\">\n              <div>\n                <svg>\n                  <use href=".concat(_icons.default, "#icon-smile></use>\n                </svg>\n              </div>\n              <p>").concat(message, "!</p>\n            </div>\n            ");

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }]);

  return View;
}();

exports.default = View;
},{"../../img/icons.svg":"src/img/icons.svg"}],"node_modules/fractional/index.js":[function(require,module,exports) {
/*
fraction.js
A Javascript fraction library.

Copyright (c) 2009  Erik Garrison <erik@hypervolu.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


/* Fractions */
/* 
 *
 * Fraction objects are comprised of a numerator and a denomenator.  These
 * values can be accessed at fraction.numerator and fraction.denomenator.
 *
 * Fractions are always returned and stored in lowest-form normalized format.
 * This is accomplished via Fraction.normalize.
 *
 * The following mathematical operations on fractions are supported:
 *
 * Fraction.equals
 * Fraction.add
 * Fraction.subtract
 * Fraction.multiply
 * Fraction.divide
 *
 * These operations accept both numbers and fraction objects.  (Best results
 * are guaranteed when the input is a fraction object.)  They all return a new
 * Fraction object.
 *
 * Usage:
 *
 * TODO
 *
 */

/*
 * The Fraction constructor takes one of:
 *   an explicit numerator (integer) and denominator (integer),
 *   a string representation of the fraction (string),
 *   or a floating-point number (float)
 *
 * These initialization methods are provided for convenience.  Because of
 * rounding issues the best results will be given when the fraction is
 * constructed from an explicit integer numerator and denomenator, and not a
 * decimal number.
 *
 *
 * e.g. new Fraction(1, 2) --> 1/2
 *      new Fraction('1/2') --> 1/2
 *      new Fraction('2 3/4') --> 11/4  (prints as 2 3/4)
 *
 */
Fraction = function(numerator, denominator)
{
    /* double argument invocation */
    if (typeof numerator !== 'undefined' && denominator) {
        if (typeof(numerator) === 'number' && typeof(denominator) === 'number') {
            this.numerator = numerator;
            this.denominator = denominator;
        } else if (typeof(numerator) === 'string' && typeof(denominator) === 'string') {
            // what are they?
            // hmm....
            // assume they are ints?
            this.numerator = parseInt(numerator);
            this.denominator = parseInt(denominator);
        }
    /* single-argument invocation */
    } else if (typeof denominator === 'undefined') {
        num = numerator; // swap variable names for legibility
        if (typeof(num) === 'number') {  // just a straight number init
            this.numerator = num;
            this.denominator = 1;
        } else if (typeof(num) === 'string') {
            var a, b;  // hold the first and second part of the fraction, e.g. a = '1' and b = '2/3' in 1 2/3
                       // or a = '2/3' and b = undefined if we are just passed a single-part number
            var arr = num.split(' ')
            if (arr[0]) a = arr[0]
            if (arr[1]) b = arr[1]
            /* compound fraction e.g. 'A B/C' */
            //  if a is an integer ...
            if (a % 1 === 0 && b && b.match('/')) {
                return (new Fraction(a)).add(new Fraction(b));
            } else if (a && !b) {
                /* simple fraction e.g. 'A/B' */
                if (typeof(a) === 'string' && a.match('/')) {
                    // it's not a whole number... it's actually a fraction without a whole part written
                    var f = a.split('/');
                    this.numerator = f[0]; this.denominator = f[1];
                /* string floating point */
                } else if (typeof(a) === 'string' && a.match('\.')) {
                    return new Fraction(parseFloat(a));
                /* whole number e.g. 'A' */
                } else { // just passed a whole number as a string
                    this.numerator = parseInt(a);
                    this.denominator = 1;
                }
            } else {
                return undefined; // could not parse
            }
        }
    }
    this.normalize();
}


Fraction.prototype.clone = function()
{
    return new Fraction(this.numerator, this.denominator);
}


/* pretty-printer, converts fractions into whole numbers and fractions */
Fraction.prototype.toString = function()
{
    if (this.denominator==='NaN') return 'NaN'
    var wholepart = (this.numerator/this.denominator>0) ?
      Math.floor(this.numerator / this.denominator) :
      Math.ceil(this.numerator / this.denominator)
    var numerator = this.numerator % this.denominator 
    var denominator = this.denominator;
    var result = []; 
    if (wholepart != 0)  
        result.push(wholepart);
    if (numerator != 0)  
        result.push(((wholepart===0) ? numerator : Math.abs(numerator)) + '/' + denominator);
    return result.length > 0 ? result.join(' ') : 0;
}


/* destructively rescale the fraction by some integral factor */
Fraction.prototype.rescale = function(factor)
{
    this.numerator *= factor;
    this.denominator *= factor;
    return this;
}


Fraction.prototype.add = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction) {
        b = b.clone();
    } else {
        b = new Fraction(b);
    }
    td = a.denominator;
    a.rescale(b.denominator);
    b.rescale(td);

    a.numerator += b.numerator;

    return a.normalize();
}


Fraction.prototype.subtract = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction) {
        b = b.clone();  // we scale our argument destructively, so clone
    } else {
        b = new Fraction(b);
    }
    td = a.denominator;
    a.rescale(b.denominator);
    b.rescale(td);

    a.numerator -= b.numerator;

    return a.normalize();
}


Fraction.prototype.multiply = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction)
    {
        a.numerator *= b.numerator;
        a.denominator *= b.denominator;
    } else if (typeof b === 'number') {
        a.numerator *= b;
    } else {
        return a.multiply(new Fraction(b));
    }
    return a.normalize();
}

Fraction.prototype.divide = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction)
    {
        a.numerator *= b.denominator;
        a.denominator *= b.numerator;
    } else if (typeof b === 'number') {
        a.denominator *= b;
    } else {
        return a.divide(new Fraction(b));
    }
    return a.normalize();
}

Fraction.prototype.equals = function(b)
{
    if (!(b instanceof Fraction)) {
        b = new Fraction(b);
    }
    // fractions that are equal should have equal normalized forms
    var a = this.clone().normalize();
    var b = b.clone().normalize();
    return (a.numerator === b.numerator && a.denominator === b.denominator);
}


/* Utility functions */

/* Destructively normalize the fraction to its smallest representation. 
 * e.g. 4/16 -> 1/4, 14/28 -> 1/2, etc.
 * This is called after all math ops.
 */
Fraction.prototype.normalize = (function()
{

    var isFloat = function(n)
    {
        return (typeof(n) === 'number' && 
                ((n > 0 && n % 1 > 0 && n % 1 < 1) || 
                 (n < 0 && n % -1 < 0 && n % -1 > -1))
               );
    }

    var roundToPlaces = function(n, places) 
    {
        if (!places) {
            return Math.round(n);
        } else {
            var scalar = Math.pow(10, places);
            return Math.round(n*scalar)/scalar;
        }
    }
        
    return (function() {

        // XXX hackish.  Is there a better way to address this issue?
        //
        /* first check if we have decimals, and if we do eliminate them
         * multiply by the 10 ^ number of decimal places in the number
         * round the number to nine decimal places
         * to avoid js floating point funnies
         */
        if (isFloat(this.denominator)) {
            var rounded = roundToPlaces(this.denominator, 9);
            var scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
            this.denominator = Math.round(this.denominator * scaleup); // this !!! should be a whole number
            //this.numerator *= scaleup;
            this.numerator *= scaleup;
        } 
        if (isFloat(this.numerator)) {
            var rounded = roundToPlaces(this.numerator, 9);
            var scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
            this.numerator = Math.round(this.numerator * scaleup); // this !!! should be a whole number
            //this.numerator *= scaleup;
            this.denominator *= scaleup;
        }
        var gcf = Fraction.gcf(this.numerator, this.denominator);
        this.numerator /= gcf;
        this.denominator /= gcf;
        if ((this.numerator < 0 && this.denominator < 0) || (this.numerator > 0 && this.denominator < 0)) {
            this.numerator *= -1;
            this.denominator *= -1;
        }
        return this;
    });

})();


/* Takes two numbers and returns their greatest common factor.
 */
Fraction.gcf = function(a, b)
{

    var common_factors = [];
    var fa = Fraction.primeFactors(a);
    var fb = Fraction.primeFactors(b);
    // for each factor in fa
    // if it's also in fb
    // put it into the common factors
    fa.forEach(function (factor) 
    { 
        var i = fb.indexOf(factor);
        if (i >= 0) {
            common_factors.push(factor);
            fb.splice(i,1); // remove from fb
        }
    });

    if (common_factors.length === 0)
        return 1;

    var gcf = (function() {
        var r = common_factors[0];
        var i;
        for (i=1;i<common_factors.length;i++)
        {
            r = r * common_factors[i];
        }
        return r;
    })();

    return gcf;

};


// Adapted from: 
// http://www.btinternet.com/~se16/js/factor.htm
Fraction.primeFactors = function(n) 
{

    var num = Math.abs(n);
    var factors = [];
    var _factor = 2;  // first potential prime factor

    while (_factor * _factor <= num)  // should we keep looking for factors?
    {      
      if (num % _factor === 0)  // this is a factor
        { 
            factors.push(_factor);  // so keep it
            num = num/_factor;  // and divide our search point by it
        }
        else
        {
            _factor++;  // and increment
        }
    }

    if (num != 1)                    // If there is anything left at the end...
    {                                // ...this must be the last prime factor
        factors.push(num);           //    so it too should be recorded
    }

    return factors;                  // Return the prime factors
}

module.exports.Fraction = Fraction

},{}],"src/js/views/recipeView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

var _fractional = require("fractional");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RecipeView = /*#__PURE__*/function (_View) {
  _inherits(RecipeView, _View);

  var _super = _createSuper(RecipeView);

  function RecipeView() {
    var _this;

    _classCallCheck(this, RecipeView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.recipe'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not find the recipe. Please try another one!');

    _defineProperty(_assertThisInitialized(_this), "_mesasge", '');

    return _this;
  }

  _createClass(RecipeView, [{
    key: "addHandlerRender",
    value: function addHandlerRender(handler) {
      ['hashchange', 'load'].forEach(function (ev) {
        return window.addEventListener(ev, handler);
      });
    }
  }, {
    key: "addHandlerUpdateServings",
    value: function addHandlerUpdateServings(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn--update-servings');
        if (!btn) return;
        var updateTo = btn.dataset.updateTo;
        if (+updateTo > 0) handler(+updateTo);
      });
    }
  }, {
    key: "addHandlerAddBookmark",
    value: function addHandlerAddBookmark(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn--bookmark');
        if (!btn) return;
        handler();
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      return "\n    <figure class=\"recipe__fig\">\n          <img src=\"".concat(this._data.image, "\" alt=\"").concat(this._data.title, "\" class=\"recipe__img\" />\n          <h1 class=\"recipe__title\">\n            <span>").concat(this._data.title, "</span>\n          </h1>\n        </figure>\n\n        <div class=\"recipe__details\">\n          <div class=\"recipe__info\">\n            <svg class=\"recipe__info-icon\">\n              <use href=\"").concat(_icons.default, "#icon-clock\"></use>\n            </svg>\n            <span class=\"recipe__info-data recipe__info-data--minutes\">").concat(this._data.cookingTime, "</span>\n            <span class=\"recipe__info-text\">minutes</span>\n          </div>\n          <div class=\"recipe__info\">\n            <svg class=\"recipe__info-icon\">\n              <use href=\"").concat(_icons.default, "#icon-users\"></use>\n            </svg>\n            <span class=\"recipe__info-data recipe__info-data--people\">").concat(this._data.servings, "</span>\n            <span class=\"recipe__info-text\">servings</span>\n\n            <div class=\"recipe__info-buttons\">\n              <button class=\"btn--tiny btn--update-servings\" data-update-to=\"").concat(this._data.servings - 1, "\">\n                <svg>\n                  <use href=\"").concat(_icons.default, "#icon-minus-circle\"></use>\n                </svg>\n              </button>\n              <button class=\"btn--tiny btn--update-servings\" data-update-to=\"").concat(this._data.servings + 1, "\">\n                <svg>\n                  <use href=\"").concat(_icons.default, "#icon-plus-circle\"></use>\n                </svg>\n              </button>\n            </div>\n          </div>\n\n          <div class=\"recipe__user-generated ").concat(this._data.key ? '' : 'hidden', " \">\n            <svg>\n              <use href=\"").concat(_icons.default, "#icon-user\"></use>\n            </svg>\n          </div>\n          <button class=\"btn--round btn--bookmark\">\n            <svg class=\"\">\n              <use href=\"").concat(_icons.default, "#icon-bookmark").concat(this._data.bookmarked ? '-fill' : '', "\"></use>\n            </svg>\n          </button>\n        </div>\n\n        <div class=\"recipe__ingredients\">\n          <h2 class=\"heading--2\">Recipe ingredients</h2>\n          <ul class=\"recipe__ingredient-list\">\n          ").concat(this._data.ingredients.map(this._generateMarkupIngredient).join(''), "\n            \n\n          \n        </div>\n\n        <div class=\"recipe__directions\">\n          <h2 class=\"heading--2\">How to cook it</h2>\n          <p class=\"recipe__directions-text\">\n            This recipe was carefully designed and tested by\n            <span class=\"recipe__publisher\">").concat(this._data.publisher, "</span>. Please check out\n            directions at their website.\n          </p>\n          <a\n            class=\"btn--small recipe__btn\"\n            href=\"").concat(this._data.sourceUrl, "\"\n            target=\"_blank\"\n          >\n            <span>Directions</span>\n            <svg class=\"search__icon\">\n              <use href=\"src/img/icons.svg#icon-arrow-right\"></use>\n            </svg>\n          </a>\n        </div>");
    }
  }, {
    key: "_generateMarkupIngredient",
    value: function _generateMarkupIngredient(ing) {
      return "\n      <li class=\"recipe__ingredient\">\n        <svg class=\"recipe__icon\">\n          <use href=\"src/img/icons.svg#icon-check\"></use>\n        </svg>\n        <div class=\"recipe__quantity\">".concat(ing.quantity ? new _fractional.Fraction(ing.quantity).toString() : '', "</div>\n        <div class=\"recipe__description\">\n          <span class=\"recipe__unit\">").concat(ing.unit, "</span>\n          ").concat(ing.description, "\n        </div>\n      </li>");
    }
  }]);

  return RecipeView;
}(_View2.default);

var _default = new RecipeView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js","../../img/icons.svg":"src/img/icons.svg","fractional":"node_modules/fractional/index.js"}],"src/js/views/searchView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchView = /*#__PURE__*/function () {
  function SearchView() {
    _classCallCheck(this, SearchView);

    _defineProperty(this, "_parentEl", document.querySelector('.search'));
  }

  _createClass(SearchView, [{
    key: "getQuery",
    value: function getQuery() {
      var query = this._parentEl.querySelector('.search__field').value;

      this._clearInput();

      return query;
    }
  }, {
    key: "_clearInput",
    value: function _clearInput() {
      this._parentEl.querySelector('.search__field').value = '';
    }
  }, {
    key: "addHandlerSearch",
    value: function addHandlerSearch(handler) {
      this._parentEl.addEventListener('submit', function (e) {
        e.preventDefault();
        handler();
      });
    }
  }]);

  return SearchView;
}();

var _default = new SearchView();

exports.default = _default;
},{"../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/previewView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PreviewView = /*#__PURE__*/function (_View) {
  _inherits(PreviewView, _View);

  var _super = _createSuper(PreviewView);

  function PreviewView() {
    var _this;

    _classCallCheck(this, PreviewView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", '');

    return _this;
  }

  _createClass(PreviewView, [{
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var id = window.location.hash.slice(1);
      return "\n    <li class=\"preview\">\n            <a class=\"preview__link ".concat(this._data.id === id ? 'preview__link--active' : '', "\" href=\"#").concat(this._data.id, "\">\n              <figure class=\"preview__fig\">\n                <img src=\"").concat(this._data.image, "\" alt=\"").concat(this._data.title, "\" />\n              </figure>\n              <div class=\"preview__data\">\n                <h4 class=\"preview__title\">").concat(this._data.title, "</h4>\n                <p class=\"preview__publisher\">").concat(this._data.publisher, "</p>\n                \n                <div class=\"preview__user-generated ").concat(this._data.key ? '' : 'hidden', " \">\n                <svg>\n                <use href=\"").concat(_icons.default, "#icon-user\"></use>\n                </svg>\n                </div>\n              </div>\n            </a>\n          </li>\n    ");
    }
  }]);

  return PreviewView;
}(_View2.default);

var _default = new PreviewView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/resultsView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

var _previewView = _interopRequireDefault(require("./previewView.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ResultsView = /*#__PURE__*/function (_View) {
  _inherits(ResultsView, _View);

  var _super = _createSuper(ResultsView);

  function ResultsView() {
    var _this;

    _classCallCheck(this, ResultsView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.results'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'No recipes found for your query! Please try again.');

    _defineProperty(_assertThisInitialized(_this), "_mesasge", '');

    return _this;
  }

  _createClass(ResultsView, [{
    key: "_generateMarkup",
    value: function _generateMarkup() {
      return this._data.map(function (result) {
        return _previewView.default.render(result, false);
      }).join('');
    }
  }]);

  return ResultsView;
}(_View2.default);

var _default = new ResultsView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js","./previewView.js":"src/js/views/previewView.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/paginationView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PaginationView = /*#__PURE__*/function (_View) {
  _inherits(PaginationView, _View);

  var _super = _createSuper(PaginationView);

  function PaginationView() {
    var _this;

    _classCallCheck(this, PaginationView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.pagination'));

    return _this;
  }

  _createClass(PaginationView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement - addEventListener('click', function (e) {
        var btn = e.target.closest('.btn--inline');
        if (!btn) return;
        var goToPage = +btn.dataset.goto;
        handler(goToPage);
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var currentPage = this._data.page;
      var numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); //Page 1 and there are other pages

      if (currentPage === 1 && numPages > 1) {
        return "<button data-goto=\"".concat(currentPage + 1, "\" \n      class=\"btn--inline pagination__btn--next\">\n                    <span>Page ").concat(currentPage + 1, "</span>\n               <svg class=\"search__icon\">\n                     <use href=\"").concat(_icons.default, "#icon-arrow-right\"></use>\n               </svg>\n          </button>\n          ");
      } //Last page


      if (currentPage === numPages && numPages > 1) {
        return "<button data-goto=\"".concat(currentPage - 1, "\"\n       class=\"btn--inline pagination__btn--prev\">\n                    <svg class=\"search__icon\">\n                     <use href=\"").concat(_icons.default, "#icon-arrow-left\"></use>\n                    </svg>\n                          <span>Page ").concat(currentPage - 1, "</span>\n                  </button>\n                  ");
      } //Other page


      if (currentPage < numPages) {
        return "<button data-goto=\"".concat(currentPage - 1, "\" \n      class=\"btn--inline pagination__btn--prev\">\n        <svg class=\"search__icon\">\n         <use href=\"").concat(_icons.default, "#icon-arrow-left\"></use>\n        </svg>\n              <span>Page ").concat(currentPage - 1, "</span>\n      </button>\n      <button data-goto=\"").concat(currentPage + 1, "\" \n      class=\"btn--inline pagination__btn--next\">\n      <span>Page ").concat(currentPage + 1, "</span>\n <svg class=\"search__icon\">\n       <use href=\"").concat(_icons.default, "#icon-arrow-right\"></use>\n </svg>\n</button>");
      } //page 1 and no other pages


      return '';
    }
  }]);

  return PaginationView;
}(_View2.default);

var _default = new PaginationView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/bookmarksView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

var _previewView = _interopRequireDefault(require("./previewView.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BookmarksView = /*#__PURE__*/function (_View) {
  _inherits(BookmarksView, _View);

  var _super = _createSuper(BookmarksView);

  function BookmarksView() {
    var _this;

    _classCallCheck(this, BookmarksView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.bookmarks__list'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'No bookmarks yet. Find a nice recipe and bookmark it:)');

    _defineProperty(_assertThisInitialized(_this), "_mesasge", '');

    return _this;
  }

  _createClass(BookmarksView, [{
    key: "addHandlerRender",
    value: function addHandlerRender(handler) {
      window.addEventListener('load', handler);
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      return this._data.map(function (bookmark) {
        return _previewView.default.render(bookmark, false);
      }).join('');
    }
  }]);

  return BookmarksView;
}(_View2.default);

var _default = new BookmarksView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js","./previewView.js":"src/js/views/previewView.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/addRecipeView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AddRecipeView = /*#__PURE__*/function (_View) {
  _inherits(AddRecipeView, _View);

  var _super = _createSuper(AddRecipeView);

  function AddRecipeView() {
    var _this;

    _classCallCheck(this, AddRecipeView);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.upload'));

    _defineProperty(_assertThisInitialized(_this), "_message", 'Recipe was successfuly uploaded. :)');

    _defineProperty(_assertThisInitialized(_this), "_window", document.querySelector('.add-recipe-window'));

    _defineProperty(_assertThisInitialized(_this), "_overlay", document.querySelector('.overlay'));

    _defineProperty(_assertThisInitialized(_this), "_btnOpen", document.querySelector('.nav__btn--add-recipe'));

    _defineProperty(_assertThisInitialized(_this), "_btnClose", document.querySelector('.btn--close-modal'));

    _this._addHandlerShowWindow();

    _this._addHandlerHideWindow();

    return _this;
  }

  _createClass(AddRecipeView, [{
    key: "toggleWindow",
    value: function toggleWindow() {
      this._overlay.classList.toggle('hidden');

      this._window.classList.toggle('hidden');
    }
  }, {
    key: "_addHandlerShowWindow",
    value: function _addHandlerShowWindow() {
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
  }, {
    key: "_addHandlerHideWindow",
    value: function _addHandlerHideWindow() {
      this._btnClose.addEventListener('click', this.toggleWindow.bind(this));

      this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }
  }, {
    key: "addHandlerUpload",
    value: function addHandlerUpload(handler) {
      this._parentElement.addEventListener('submit', function (e) {
        e.preventDefault();

        var dataArr = _toConsumableArray(new FormData(this));

        var data = Object.fromEntries(dataArr);
        handler(data);
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {}
  }]);

  return AddRecipeView;
}(_View2.default);

var _default = new AddRecipeView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js","../../img/icons.svg":"src/img/icons.svg"}],"node_modules/core-js/internals/global.js":[function(require,module,exports) {
var global = arguments[3];
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

},{}],"node_modules/core-js/internals/fails.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],"node_modules/core-js/internals/descriptors.js":[function(require,module,exports) {
var fails = require('../internals/fails');

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/function-call.js":[function(require,module,exports) {
var call = Function.prototype.call;

module.exports = call.bind ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

},{}],"node_modules/core-js/internals/object-property-is-enumerable.js":[function(require,module,exports) {
'use strict';
var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

},{}],"node_modules/core-js/internals/create-property-descriptor.js":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"node_modules/core-js/internals/function-uncurry-this.js":[function(require,module,exports) {
var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var callBind = bind && bind.bind(call);

module.exports = bind ? function (fn) {
  return fn && callBind(call, fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};

},{}],"node_modules/core-js/internals/classof-raw.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/internals/indexed-object.js":[function(require,module,exports) {

var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var Object = global.Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : Object(it);
} : Object;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js"}],"node_modules/core-js/internals/require-object-coercible.js":[function(require,module,exports) {

var global = require('../internals/global');

var TypeError = global.TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/to-indexed-object.js":[function(require,module,exports) {
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/is-callable.js":[function(require,module,exports) {
// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};

},{}],"node_modules/core-js/internals/is-object.js":[function(require,module,exports) {
var isCallable = require('../internals/is-callable');

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

},{"../internals/is-callable":"node_modules/core-js/internals/is-callable.js"}],"node_modules/core-js/internals/get-built-in.js":[function(require,module,exports) {

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js"}],"node_modules/core-js/internals/object-is-prototype-of.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');

module.exports = uncurryThis({}.isPrototypeOf);

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/internals/engine-user-agent.js":[function(require,module,exports) {
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('navigator', 'userAgent') || '';

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js"}],"node_modules/core-js/internals/engine-v8-version.js":[function(require,module,exports) {


var global = require('../internals/global');
var userAgent = require('../internals/engine-user-agent');

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/internals/native-symbol.js":[function(require,module,exports) {
/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = require('../internals/engine-v8-version');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

},{"../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/use-symbol-as-uid.js":[function(require,module,exports) {
/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":"node_modules/core-js/internals/native-symbol.js"}],"node_modules/core-js/internals/is-symbol.js":[function(require,module,exports) {

var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var Object = global.Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/use-symbol-as-uid":"node_modules/core-js/internals/use-symbol-as-uid.js"}],"node_modules/core-js/internals/try-to-string.js":[function(require,module,exports) {

var global = require('../internals/global');

var String = global.String;

module.exports = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/a-callable.js":[function(require,module,exports) {

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var tryToString = require('../internals/try-to-string');

var TypeError = global.TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/try-to-string":"node_modules/core-js/internals/try-to-string.js"}],"node_modules/core-js/internals/get-method.js":[function(require,module,exports) {
var aCallable = require('../internals/a-callable');

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

},{"../internals/a-callable":"node_modules/core-js/internals/a-callable.js"}],"node_modules/core-js/internals/ordinary-to-primitive.js":[function(require,module,exports) {

var global = require('../internals/global');
var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');

var TypeError = global.TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/is-pure.js":[function(require,module,exports) {
module.exports = false;

},{}],"node_modules/core-js/internals/set-global.js":[function(require,module,exports) {

var global = require('../internals/global');

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/shared-store.js":[function(require,module,exports) {

var global = require('../internals/global');
var setGlobal = require('../internals/set-global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/set-global":"node_modules/core-js/internals/set-global.js"}],"node_modules/core-js/internals/shared.js":[function(require,module,exports) {
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.19.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/shared-store":"node_modules/core-js/internals/shared-store.js"}],"node_modules/core-js/internals/to-object.js":[function(require,module,exports) {

var global = require('../internals/global');
var requireObjectCoercible = require('../internals/require-object-coercible');

var Object = global.Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/has-own-property.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-object":"node_modules/core-js/internals/to-object.js"}],"node_modules/core-js/internals/uid.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/internals/well-known-symbol.js":[function(require,module,exports) {

var global = require('../internals/global');
var shared = require('../internals/shared');
var hasOwn = require('../internals/has-own-property');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/shared":"node_modules/core-js/internals/shared.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/uid":"node_modules/core-js/internals/uid.js","../internals/native-symbol":"node_modules/core-js/internals/native-symbol.js","../internals/use-symbol-as-uid":"node_modules/core-js/internals/use-symbol-as-uid.js"}],"node_modules/core-js/internals/to-primitive.js":[function(require,module,exports) {

var global = require('../internals/global');
var call = require('../internals/function-call');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var getMethod = require('../internals/get-method');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TypeError = global.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/is-symbol":"node_modules/core-js/internals/is-symbol.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/ordinary-to-primitive":"node_modules/core-js/internals/ordinary-to-primitive.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/to-property-key.js":[function(require,module,exports) {
var toPrimitive = require('../internals/to-primitive');
var isSymbol = require('../internals/is-symbol');

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

},{"../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/is-symbol":"node_modules/core-js/internals/is-symbol.js"}],"node_modules/core-js/internals/document-create-element.js":[function(require,module,exports) {

var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/ie8-dom-define.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js"}],"node_modules/core-js/internals/object-get-own-property-descriptor.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var call = require('../internals/function-call');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var hasOwn = require('../internals/has-own-property');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/ie8-dom-define":"node_modules/core-js/internals/ie8-dom-define.js"}],"node_modules/core-js/internals/an-object.js":[function(require,module,exports) {

var global = require('../internals/global');
var isObject = require('../internals/is-object');

var String = global.String;
var TypeError = global.TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/object-define-property.js":[function(require,module,exports) {

var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');

var TypeError = global.TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/ie8-dom-define":"node_modules/core-js/internals/ie8-dom-define.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js"}],"node_modules/core-js/internals/create-non-enumerable-property.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/internals/inspect-source.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var isCallable = require('../internals/is-callable');
var store = require('../internals/shared-store');

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/shared-store":"node_modules/core-js/internals/shared-store.js"}],"node_modules/core-js/internals/native-weak-map.js":[function(require,module,exports) {

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js"}],"node_modules/core-js/internals/shared-key.js":[function(require,module,exports) {
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":"node_modules/core-js/internals/shared.js","../internals/uid":"node_modules/core-js/internals/uid.js"}],"node_modules/core-js/internals/hidden-keys.js":[function(require,module,exports) {
module.exports = {};

},{}],"node_modules/core-js/internals/internal-state.js":[function(require,module,exports) {

var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var hasOwn = require('../internals/has-own-property');
var shared = require('../internals/shared-store');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/native-weak-map":"node_modules/core-js/internals/native-weak-map.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/shared-store":"node_modules/core-js/internals/shared-store.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js"}],"node_modules/core-js/internals/function-name.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var hasOwn = require('../internals/has-own-property');

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js"}],"node_modules/core-js/internals/redefine.js":[function(require,module,exports) {

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var setGlobal = require('../internals/set-global');
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');
var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE;

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  var state;
  if (isCallable(value)) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
      createNonEnumerableProperty(value, 'name', name);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
});

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/set-global":"node_modules/core-js/internals/set-global.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/function-name":"node_modules/core-js/internals/function-name.js"}],"node_modules/core-js/internals/to-integer-or-infinity.js":[function(require,module,exports) {
var ceil = Math.ceil;
var floor = Math.floor;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- safe
  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};

},{}],"node_modules/core-js/internals/to-absolute-index.js":[function(require,module,exports) {
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js"}],"node_modules/core-js/internals/to-length.js":[function(require,module,exports) {
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js"}],"node_modules/core-js/internals/length-of-array-like.js":[function(require,module,exports) {
var toLength = require('../internals/to-length');

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

},{"../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/internals/array-includes.js":[function(require,module,exports) {
var toIndexedObject = require('../internals/to-indexed-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js"}],"node_modules/core-js/internals/object-keys-internal.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js"}],"node_modules/core-js/internals/enum-bug-keys.js":[function(require,module,exports) {
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],"node_modules/core-js/internals/object-get-own-property-names.js":[function(require,module,exports) {
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/object-keys-internal":"node_modules/core-js/internals/object-keys-internal.js","../internals/enum-bug-keys":"node_modules/core-js/internals/enum-bug-keys.js"}],"node_modules/core-js/internals/object-get-own-property-symbols.js":[function(require,module,exports) {
// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

},{}],"node_modules/core-js/internals/own-keys.js":[function(require,module,exports) {
var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-symbols":"node_modules/core-js/internals/object-get-own-property-symbols.js","../internals/an-object":"node_modules/core-js/internals/an-object.js"}],"node_modules/core-js/internals/copy-constructor-properties.js":[function(require,module,exports) {
var hasOwn = require('../internals/has-own-property');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

},{"../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/own-keys":"node_modules/core-js/internals/own-keys.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/internals/is-forced.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js"}],"node_modules/core-js/internals/export.js":[function(require,module,exports) {

var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/set-global":"node_modules/core-js/internals/set-global.js","../internals/copy-constructor-properties":"node_modules/core-js/internals/copy-constructor-properties.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js"}],"node_modules/core-js/internals/function-apply.js":[function(require,module,exports) {
var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (bind ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

},{}],"node_modules/core-js/internals/is-array.js":[function(require,module,exports) {
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};

},{"../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js"}],"node_modules/core-js/internals/to-string-tag-support.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/classof.js":[function(require,module,exports) {

var global = require('../internals/global');
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var isCallable = require('../internals/is-callable');
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var Object = global.Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/to-string-tag-support":"node_modules/core-js/internals/to-string-tag-support.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/to-string.js":[function(require,module,exports) {

var global = require('../internals/global');
var classof = require('../internals/classof');

var String = global.String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/classof":"node_modules/core-js/internals/classof.js"}],"node_modules/core-js/internals/object-keys.js":[function(require,module,exports) {
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/object-keys-internal":"node_modules/core-js/internals/object-keys-internal.js","../internals/enum-bug-keys":"node_modules/core-js/internals/enum-bug-keys.js"}],"node_modules/core-js/internals/object-define-properties.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var toIndexedObject = require('../internals/to-indexed-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js"}],"node_modules/core-js/internals/html.js":[function(require,module,exports) {
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js"}],"node_modules/core-js/internals/object-create.js":[function(require,module,exports) {
/* global ActiveXObject -- old IE, WSH */
var anObject = require('../internals/an-object');
var defineProperties = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-define-properties":"node_modules/core-js/internals/object-define-properties.js","../internals/enum-bug-keys":"node_modules/core-js/internals/enum-bug-keys.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js","../internals/html":"node_modules/core-js/internals/html.js","../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js"}],"node_modules/core-js/internals/array-slice.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');

module.exports = uncurryThis([].slice);

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/internals/object-get-own-property-names-external.js":[function(require,module,exports) {
/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = require('../internals/classof-raw');
var toIndexedObject = require('../internals/to-indexed-object');
var $getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var arraySlice = require('../internals/array-slice');

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/internals/well-known-symbol-wrapped.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

exports.f = wellKnownSymbol;

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/path.js":[function(require,module,exports) {

var global = require('../internals/global');

module.exports = global;

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/define-well-known-symbol.js":[function(require,module,exports) {
var path = require('../internals/path');
var hasOwn = require('../internals/has-own-property');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/path":"node_modules/core-js/internals/path.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/well-known-symbol-wrapped":"node_modules/core-js/internals/well-known-symbol-wrapped.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/internals/set-to-string-tag.js":[function(require,module,exports) {
var defineProperty = require('../internals/object-define-property').f;
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !hasOwn(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/function-bind-context.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : bind ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js"}],"node_modules/core-js/internals/is-constructor.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof');
var getBuiltIn = require('../internals/get-built-in');
var inspectSource = require('../internals/inspect-source');

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function (argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function (argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
    // we can't check .prototype since constructors produced by .bind haven't it
  } return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
};

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js"}],"node_modules/core-js/internals/array-species-constructor.js":[function(require,module,exports) {

var global = require('../internals/global');
var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');
var Array = global.Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/is-constructor":"node_modules/core-js/internals/is-constructor.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/array-species-create.js":[function(require,module,exports) {
var arraySpeciesConstructor = require('../internals/array-species-constructor');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

},{"../internals/array-species-constructor":"node_modules/core-js/internals/array-species-constructor.js"}],"node_modules/core-js/internals/array-iteration.js":[function(require,module,exports) {
var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

},{"../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js"}],"node_modules/core-js/modules/es.symbol.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var fails = require('../internals/fails');
var hasOwn = require('../internals/has-own-property');
var isArray = require('../internals/is-array');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var isSymbol = require('../internals/is-symbol');
var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var $toString = require('../internals/to-string');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var objectKeys = require('../internals/object-keys');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var arraySlice = require('../internals/array-slice');
var redefine = require('../internals/redefine');
var shared = require('../internals/shared');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var $forEach = require('../internals/array-iteration').forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  redefine(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = $toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (isCallable($replacer)) value = call($replacer, this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return apply($stringify, null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!SymbolPrototype[TO_PRIMITIVE]) {
  var valueOf = SymbolPrototype.valueOf;
  // eslint-disable-next-line no-unused-vars -- required for .length
  redefine(SymbolPrototype, TO_PRIMITIVE, function (hint) {
    // TODO: improve hint logic
    return call(valueOf, this);
  });
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/native-symbol":"node_modules/core-js/internals/native-symbol.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/is-symbol":"node_modules/core-js/internals/is-symbol.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-names-external":"node_modules/core-js/internals/object-get-own-property-names-external.js","../internals/object-get-own-property-symbols":"node_modules/core-js/internals/object-get-own-property-symbols.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/shared":"node_modules/core-js/internals/shared.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js","../internals/uid":"node_modules/core-js/internals/uid.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/well-known-symbol-wrapped":"node_modules/core-js/internals/well-known-symbol-wrapped.js","../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.symbol.description.js":[function(require,module,exports) {

// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var toString = require('../internals/to-string');
var defineProperty = require('../internals/object-define-property').f;
var copyConstructorProperties = require('../internals/copy-constructor-properties');

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineProperty(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/copy-constructor-properties":"node_modules/core-js/internals/copy-constructor-properties.js"}],"node_modules/core-js/modules/es.symbol.async-iterator.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.has-instance.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.is-concat-spreadable.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.iterator.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.match.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.match-all.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol('matchAll');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.replace.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.search.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.species.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.split.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.to-primitive.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.to-string-tag.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.unscopables.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/internals/correct-prototype-getter.js":[function(require,module,exports) {
var fails = require('../internals/fails');

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/object-get-prototype-of.js":[function(require,module,exports) {

var global = require('../internals/global');
var hasOwn = require('../internals/has-own-property');
var isCallable = require('../internals/is-callable');
var toObject = require('../internals/to-object');
var sharedKey = require('../internals/shared-key');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var IE_PROTO = sharedKey('IE_PROTO');
var Object = global.Object;
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof Object ? ObjectPrototype : null;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js","../internals/correct-prototype-getter":"node_modules/core-js/internals/correct-prototype-getter.js"}],"node_modules/core-js/internals/a-possible-prototype.js":[function(require,module,exports) {

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');

var String = global.String;
var TypeError = global.TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js"}],"node_modules/core-js/internals/object-set-prototype-of.js":[function(require,module,exports) {
/* eslint-disable no-proto -- safe */
var uncurryThis = require('../internals/function-uncurry-this');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/a-possible-prototype":"node_modules/core-js/internals/a-possible-prototype.js"}],"node_modules/core-js/internals/clear-error-stack.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var arraySlice = require('../internals/array-slice');

var replace = uncurryThis(''.replace);
var split = uncurryThis(''.split);
var join = uncurryThis([].join);

var TEST = (function (arg) { return String(Error(arg).stack); })('zxcasd');
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);
var IS_FIREFOX_OR_SAFARI_STACK = /@[^\n]*\n/.test(TEST) && !/zxcasd/.test(TEST);

module.exports = function (stack, dropEntries) {
  if (typeof stack != 'string') return stack;
  if (IS_V8_OR_CHAKRA_STACK) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } else if (IS_FIREFOX_OR_SAFARI_STACK) {
    return join(arraySlice(split(stack, '\n'), dropEntries), '\n');
  } return stack;
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/internals/install-error-cause.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js"}],"node_modules/core-js/internals/iterators.js":[function(require,module,exports) {
module.exports = {};

},{}],"node_modules/core-js/internals/is-array-iterator-method.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/iterators":"node_modules/core-js/internals/iterators.js"}],"node_modules/core-js/internals/get-iterator-method.js":[function(require,module,exports) {
var classof = require('../internals/classof');
var getMethod = require('../internals/get-method');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};

},{"../internals/classof":"node_modules/core-js/internals/classof.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/iterators":"node_modules/core-js/internals/iterators.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/get-iterator.js":[function(require,module,exports) {

var global = require('../internals/global');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var getIteratorMethod = require('../internals/get-iterator-method');

var TypeError = global.TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw TypeError(tryToString(argument) + ' is not iterable');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/try-to-string":"node_modules/core-js/internals/try-to-string.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js"}],"node_modules/core-js/internals/iterator-close.js":[function(require,module,exports) {
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getMethod = require('../internals/get-method');

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

},{"../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/get-method":"node_modules/core-js/internals/get-method.js"}],"node_modules/core-js/internals/iterate.js":[function(require,module,exports) {

var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var iteratorClose = require('../internals/iterator-close');

var TypeError = global.TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/try-to-string":"node_modules/core-js/internals/try-to-string.js","../internals/is-array-iterator-method":"node_modules/core-js/internals/is-array-iterator-method.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/get-iterator":"node_modules/core-js/internals/get-iterator.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js","../internals/iterator-close":"node_modules/core-js/internals/iterator-close.js"}],"node_modules/core-js/internals/normalize-string-argument.js":[function(require,module,exports) {
var toString = require('../internals/to-string');

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};

},{"../internals/to-string":"node_modules/core-js/internals/to-string.js"}],"node_modules/core-js/internals/error-stack-installable.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/modules/es.aggregate-error.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var create = require('../internals/object-create');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var clearErrorStack = require('../internals/clear-error-stack');
var installErrorCause = require('../internals/install-error-cause');
var iterate = require('../internals/iterate');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ERROR_STACK_INSTALLABLE = require('../internals/error-stack-installable');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var Error = global.Error;
var push = [].push;

var $AggregateError = function AggregateError(errors, message /* , options */) {
  var options = arguments.length > 2 ? arguments[2] : undefined;
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf(new Error(undefined), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  createNonEnumerableProperty(that, 'message', normalizeStringArgument(message, ''));
  if (ERROR_STACK_INSTALLABLE) createNonEnumerableProperty(that, 'stack', clearErrorStack(that.stack, 1));
  installErrorCause(that, options);
  var errorsArray = [];
  iterate(errors, push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf) setPrototypeOf($AggregateError, Error);
else copyConstructorProperties($AggregateError, Error);

var AggregateErrorPrototype = $AggregateError.prototype = create(Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({ global: true }, {
  AggregateError: $AggregateError
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/copy-constructor-properties":"node_modules/core-js/internals/copy-constructor-properties.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/clear-error-stack":"node_modules/core-js/internals/clear-error-stack.js","../internals/install-error-cause":"node_modules/core-js/internals/install-error-cause.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/normalize-string-argument":"node_modules/core-js/internals/normalize-string-argument.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/error-stack-installable":"node_modules/core-js/internals/error-stack-installable.js"}],"node_modules/core-js/internals/add-to-unscopables.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var definePropertyModule = require('../internals/object-define-property');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.array.at.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
$({ target: 'Array', proto: true }, {
  at: function at(index) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : O[k];
  }
});

addToUnscopables('at');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/create-property.js":[function(require,module,exports) {
'use strict';
var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/internals/array-method-has-species-support.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js"}],"node_modules/core-js/modules/es.array.concat.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var fails = require('../internals/fails');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
var TypeError = global.TypeError;

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js"}],"node_modules/core-js/internals/array-copy-within.js":[function(require,module,exports) {
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

var min = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = lengthOfArrayLike(O);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js"}],"node_modules/core-js/modules/es.array.copy-within.js":[function(require,module,exports) {
var $ = require('../internals/export');
var copyWithin = require('../internals/array-copy-within');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
$({ target: 'Array', proto: true }, {
  copyWithin: copyWithin
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('copyWithin');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-copy-within":"node_modules/core-js/internals/array-copy-within.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/array-method-is-strict.js":[function(require,module,exports) {
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.array.every.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $every = require('../internals/array-iteration').every;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var STRICT_METHOD = arrayMethodIsStrict('every');

// `Array.prototype.every` method
// https://tc39.es/ecma262/#sec-array.prototype.every
$({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js"}],"node_modules/core-js/internals/array-fill.js":[function(require,module,exports) {
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = lengthOfArrayLike(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js"}],"node_modules/core-js/modules/es.array.fill.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fill = require('../internals/array-fill');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
$({ target: 'Array', proto: true }, {
  fill: fill
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-fill":"node_modules/core-js/internals/array-fill.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.filter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $filter = require('../internals/array-iteration').filter;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js"}],"node_modules/core-js/modules/es.array.find.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $find = require('../internals/array-iteration').find;
var addToUnscopables = require('../internals/add-to-unscopables');

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.find-index.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $findIndex = require('../internals/array-iteration').findIndex;
var addToUnscopables = require('../internals/add-to-unscopables');

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/flatten-into-array.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var isArray = require('../internals/is-array');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var bind = require('../internals/function-bind-context');

var TypeError = global.TypeError;

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? bind(mapper, thisArg) : false;
  var element, elementLen;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      if (depth > 0 && isArray(element)) {
        elementLen = lengthOfArrayLike(element);
        targetIndex = flattenIntoArray(target, original, element, elementLen, targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};

module.exports = flattenIntoArray;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js"}],"node_modules/core-js/modules/es.array.flat.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var flattenIntoArray = require('../internals/flatten-into-array');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.flat` method
// https://tc39.es/ecma262/#sec-array.prototype.flat
$({ target: 'Array', proto: true }, {
  flat: function flat(/* depthArg = 1 */) {
    var depthArg = arguments.length ? arguments[0] : undefined;
    var O = toObject(this);
    var sourceLen = lengthOfArrayLike(O);
    var A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toIntegerOrInfinity(depthArg));
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/flatten-into-array":"node_modules/core-js/internals/flatten-into-array.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js"}],"node_modules/core-js/modules/es.array.flat-map.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var flattenIntoArray = require('../internals/flatten-into-array');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.flatMap` method
// https://tc39.es/ecma262/#sec-array.prototype.flatmap
$({ target: 'Array', proto: true }, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen = lengthOfArrayLike(O);
    var A;
    aCallable(callbackfn);
    A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/flatten-into-array":"node_modules/core-js/internals/flatten-into-array.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js"}],"node_modules/core-js/internals/array-for-each.js":[function(require,module,exports) {
'use strict';
var $forEach = require('../internals/array-iteration').forEach;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

},{"../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js"}],"node_modules/core-js/modules/es.array.for-each.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-for-each":"node_modules/core-js/internals/array-for-each.js"}],"node_modules/core-js/internals/call-with-safe-iteration-closing.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var iteratorClose = require('../internals/iterator-close');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/iterator-close":"node_modules/core-js/internals/iterator-close.js"}],"node_modules/core-js/internals/array-from.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var isConstructor = require('../internals/is-constructor');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');

var Array = global.Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/call-with-safe-iteration-closing":"node_modules/core-js/internals/call-with-safe-iteration-closing.js","../internals/is-array-iterator-method":"node_modules/core-js/internals/is-array-iterator-method.js","../internals/is-constructor":"node_modules/core-js/internals/is-constructor.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/get-iterator":"node_modules/core-js/internals/get-iterator.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js"}],"node_modules/core-js/internals/check-correctness-of-iteration.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.array.from.js":[function(require,module,exports) {
var $ = require('../internals/export');
var from = require('../internals/array-from');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-from":"node_modules/core-js/internals/array-from.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js"}],"node_modules/core-js/modules/es.array.includes.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $includes = require('../internals/array-includes').includes;
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.index-of.js":[function(require,module,exports) {
'use strict';
/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var $IndexOf = require('../internals/array-includes').indexOf;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var un$IndexOf = uncurryThis([].indexOf);

var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? un$IndexOf(this, searchElement, fromIndex) || 0
      : $IndexOf(this, searchElement, fromIndex);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js"}],"node_modules/core-js/modules/es.array.is-array.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isArray = require('../internals/is-array');

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-array":"node_modules/core-js/internals/is-array.js"}],"node_modules/core-js/internals/iterators-core.js":[function(require,module,exports) {
'use strict';
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var create = require('../internals/object-create');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var redefine = require('../internals/redefine');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  redefine(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/create-iterator-constructor.js":[function(require,module,exports) {
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/iterators-core":"node_modules/core-js/internals/iterators-core.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/iterators":"node_modules/core-js/internals/iterators.js"}],"node_modules/core-js/internals/define-iterator.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');
var IS_PURE = require('../internals/is-pure');
var FunctionName = require('../internals/function-name');
var isCallable = require('../internals/is-callable');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          redefine(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    redefine(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/function-name":"node_modules/core-js/internals/function-name.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/create-iterator-constructor":"node_modules/core-js/internals/create-iterator-constructor.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/iterators":"node_modules/core-js/internals/iterators.js","../internals/iterators-core":"node_modules/core-js/internals/iterators-core.js"}],"node_modules/core-js/modules/es.array.iterator.js":[function(require,module,exports) {
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js","../internals/iterators":"node_modules/core-js/internals/iterators.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/define-iterator":"node_modules/core-js/internals/define-iterator.js"}],"node_modules/core-js/modules/es.array.join.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toIndexedObject = require('../internals/to-indexed-object');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var un$Join = uncurryThis([].join);

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js"}],"node_modules/core-js/internals/array-last-index-of.js":[function(require,module,exports) {
'use strict';
/* eslint-disable es/no-array-prototype-lastindexof -- safe */
var apply = require('../internals/function-apply');
var toIndexedObject = require('../internals/to-indexed-object');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var min = Math.min;
var $lastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
var FORCED = NEGATIVE_ZERO || !STRICT_METHOD;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
module.exports = FORCED ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return apply($lastIndexOf, this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = lengthOfArrayLike(O);
  var index = length - 1;
  if (arguments.length > 1) index = min(index, toIntegerOrInfinity(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : $lastIndexOf;

},{"../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js"}],"node_modules/core-js/modules/es.array.last-index-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var lastIndexOf = require('../internals/array-last-index-of');

// `Array.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
// eslint-disable-next-line es/no-array-prototype-lastindexof -- required for testing
$({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: lastIndexOf
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-last-index-of":"node_modules/core-js/internals/array-last-index-of.js"}],"node_modules/core-js/modules/es.array.map.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $map = require('../internals/array-iteration').map;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js"}],"node_modules/core-js/modules/es.array.of.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var fails = require('../internals/fails');
var isConstructor = require('../internals/is-constructor');
var createProperty = require('../internals/create-property');

var Array = global.Array;

var ISNT_GENERIC = fails(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
});

// `Array.of` method
// https://tc39.es/ecma262/#sec-array.of
// WebKit Array.of isn't generic
$({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
  of: function of(/* ...args */) {
    var index = 0;
    var argumentsLength = arguments.length;
    var result = new (isConstructor(this) ? this : Array)(argumentsLength);
    while (argumentsLength > index) createProperty(result, index, arguments[index++]);
    result.length = argumentsLength;
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-constructor":"node_modules/core-js/internals/is-constructor.js","../internals/create-property":"node_modules/core-js/internals/create-property.js"}],"node_modules/core-js/internals/array-reduce.js":[function(require,module,exports) {

var global = require('../internals/global');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');

var TypeError = global.TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js"}],"node_modules/core-js/internals/engine-is-node.js":[function(require,module,exports) {

var classof = require('../internals/classof-raw');
var global = require('../internals/global');

module.exports = classof(global.process) == 'process';

},{"../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/modules/es.array.reduce.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $reduce = require('../internals/array-reduce').left;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var CHROME_VERSION = require('../internals/engine-v8-version');
var IS_NODE = require('../internals/engine-is-node');

var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js","../internals/engine-is-node":"node_modules/core-js/internals/engine-is-node.js"}],"node_modules/core-js/modules/es.array.reduce-right.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $reduceRight = require('../internals/array-reduce').right;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var CHROME_VERSION = require('../internals/engine-v8-version');
var IS_NODE = require('../internals/engine-is-node');

var STRICT_METHOD = arrayMethodIsStrict('reduceRight');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduceRight` method
// https://tc39.es/ecma262/#sec-array.prototype.reduceright
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js","../internals/engine-is-node":"node_modules/core-js/internals/engine-is-node.js"}],"node_modules/core-js/modules/es.array.reverse.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var isArray = require('../internals/is-array');

var un$Reverse = uncurryThis([].reverse);
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign -- dirty hack
    if (isArray(this)) this.length = this.length;
    return un$Reverse(this);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-array":"node_modules/core-js/internals/is-array.js"}],"node_modules/core-js/modules/es.array.slice.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var un$Slice = require('../internals/array-slice');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var Array = global.Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return un$Slice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/is-constructor":"node_modules/core-js/internals/is-constructor.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/modules/es.array.some.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $some = require('../internals/array-iteration').some;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var STRICT_METHOD = arrayMethodIsStrict('some');

// `Array.prototype.some` method
// https://tc39.es/ecma262/#sec-array.prototype.some
$({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js"}],"node_modules/core-js/internals/array-sort.js":[function(require,module,exports) {
var arraySlice = require('../internals/array-slice');

var floor = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    array,
    mergeSort(arraySlice(array, 0, middle), comparefn),
    mergeSort(arraySlice(array, middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;

  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = (lindex < llength && rindex < rlength)
      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
      : lindex < llength ? left[lindex++] : right[rindex++];
  } return array;
};

module.exports = mergeSort;

},{"../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/internals/engine-ff-version.js":[function(require,module,exports) {
var userAgent = require('../internals/engine-user-agent');

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/internals/engine-is-ie-or-edge.js":[function(require,module,exports) {
var UA = require('../internals/engine-user-agent');

module.exports = /MSIE|Trident/.test(UA);

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/internals/engine-webkit-version.js":[function(require,module,exports) {
var userAgent = require('../internals/engine-user-agent');

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/modules/es.array.sort.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toString = require('../internals/to-string');
var fails = require('../internals/fails');
var internalSort = require('../internals/array-sort');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var FF = require('../internals/engine-ff-version');
var IE_OR_EDGE = require('../internals/engine-is-ie-or-edge');
var V8 = require('../internals/engine-v8-version');
var WEBKIT = require('../internals/engine-webkit-version');

var test = [];
var un$Sort = uncurryThis(test.sort);
var push = uncurryThis(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var STABLE_SORT = !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 70;
  if (FF && FF > 3) return;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }

  test.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString(x) > toString(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable(comparefn);

    var array = toObject(this);

    if (STABLE_SORT) return comparefn === undefined ? un$Sort(array) : un$Sort(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push(items, array[index]);
    }

    internalSort(items, getSortCompare(comparefn));

    itemsLength = items.length;
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) delete array[index++];

    return array;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-sort":"node_modules/core-js/internals/array-sort.js","../internals/array-method-is-strict":"node_modules/core-js/internals/array-method-is-strict.js","../internals/engine-ff-version":"node_modules/core-js/internals/engine-ff-version.js","../internals/engine-is-ie-or-edge":"node_modules/core-js/internals/engine-is-ie-or-edge.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js","../internals/engine-webkit-version":"node_modules/core-js/internals/engine-webkit-version.js"}],"node_modules/core-js/internals/set-species.js":[function(require,module,exports) {
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js"}],"node_modules/core-js/modules/es.array.species.js":[function(require,module,exports) {
var setSpecies = require('../internals/set-species');

// `Array[@@species]` getter
// https://tc39.es/ecma262/#sec-get-array-@@species
setSpecies('Array');

},{"../internals/set-species":"node_modules/core-js/internals/set-species.js"}],"node_modules/core-js/modules/es.array.splice.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toObject = require('../internals/to-object');
var arraySpeciesCreate = require('../internals/array-species-create');
var createProperty = require('../internals/create-property');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var TypeError = global.TypeError;
var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js"}],"node_modules/core-js/modules/es.array.unscopables.flat.js":[function(require,module,exports) {
// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = require('../internals/add-to-unscopables');

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flat');

},{"../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.unscopables.flat-map.js":[function(require,module,exports) {
// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = require('../internals/add-to-unscopables');

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flatMap');

},{"../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/array-buffer-native.js":[function(require,module,exports) {
// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

},{}],"node_modules/core-js/internals/redefine-all.js":[function(require,module,exports) {
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":"node_modules/core-js/internals/redefine.js"}],"node_modules/core-js/internals/an-instance.js":[function(require,module,exports) {

var global = require('../internals/global');
var isPrototypeOf = require('../internals/object-is-prototype-of');

var TypeError = global.TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw TypeError('Incorrect invocation');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js"}],"node_modules/core-js/internals/to-index.js":[function(require,module,exports) {

var global = require('../internals/global');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');

var RangeError = global.RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/internals/ieee754.js":[function(require,module,exports) {

// IEEE754 conversions based on https://github.com/feross/ieee754
var global = require('../internals/global');

var Array = global.Array;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    if (number * (c = pow(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

module.exports = {
  pack: pack,
  unpack: unpack
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/array-buffer.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native');
var FunctionName = require('../internals/function-name');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefineAll = require('../internals/redefine-all');
var fails = require('../internals/fails');
var anInstance = require('../internals/an-instance');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var IEEE754 = require('../internals/ieee754');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var defineProperty = require('../internals/object-define-property').f;
var arrayFill = require('../internals/array-fill');
var arraySlice = require('../internals/array-slice');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
var $DataView = global[DATA_VIEW];
var DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype = Object.prototype;
var Array = global.Array;
var RangeError = global.RangeError;
var fill = uncurryThis(arrayFill);
var reverse = uncurryThis([].reverse);

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = arraySlice(bytes, start, start + count);
  return isLittleEndian ? pack : reverse(pack);
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, ArrayBufferPrototype);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: fill(Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, DataViewPrototype);
    anInstance(buffer, ArrayBufferPrototype);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toIntegerOrInfinity(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  DataViewPrototype = $DataView[PROTOTYPE];

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll(DataViewPrototype, {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME && NativeArrayBuffer.name !== ARRAY_BUFFER;
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, ArrayBufferPrototype);
      return new NativeArrayBuffer(toIndex(length));
    };

    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;

    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }

    ArrayBufferPrototype.constructor = $ArrayBuffer;
  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
    createNonEnumerableProperty(NativeArrayBuffer, 'name', ARRAY_BUFFER);
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (setPrototypeOf && getPrototypeOf(DataViewPrototype) !== ObjectPrototype) {
    setPrototypeOf(DataViewPrototype, ObjectPrototype);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = uncurryThis(DataViewPrototype.setInt8);
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll(DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

module.exports = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/array-buffer-native":"node_modules/core-js/internals/array-buffer-native.js","../internals/function-name":"node_modules/core-js/internals/function-name.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-index":"node_modules/core-js/internals/to-index.js","../internals/ieee754":"node_modules/core-js/internals/ieee754.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/array-fill":"node_modules/core-js/internals/array-fill.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.array-buffer.constructor.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var arrayBufferModule = require('../internals/array-buffer');
var setSpecies = require('../internals/set-species');

var ARRAY_BUFFER = 'ArrayBuffer';
var ArrayBuffer = arrayBufferModule[ARRAY_BUFFER];
var NativeArrayBuffer = global[ARRAY_BUFFER];

// `ArrayBuffer` constructor
// https://tc39.es/ecma262/#sec-arraybuffer-constructor
$({ global: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
  ArrayBuffer: ArrayBuffer
});

setSpecies(ARRAY_BUFFER);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/set-species":"node_modules/core-js/internals/set-species.js"}],"node_modules/core-js/internals/array-buffer-view-core.js":[function(require,module,exports) {

'use strict';
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var classof = require('../internals/classof');
var tryToString = require('../internals/try-to-string');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var defineProperty = require('../internals/object-define-property').f;
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var wellKnownSymbol = require('../internals/well-known-symbol');
var uid = require('../internals/uid');

var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = uid('TYPED_ARRAY_CONSTRUCTOR');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) { /* empty */ }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR, Constructor);
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR, Constructor);
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

},{"../internals/array-buffer-native":"node_modules/core-js/internals/array-buffer-native.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/try-to-string":"node_modules/core-js/internals/try-to-string.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/uid":"node_modules/core-js/internals/uid.js"}],"node_modules/core-js/modules/es.array-buffer.is-view.js":[function(require,module,exports) {
var $ = require('../internals/export');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

// `ArrayBuffer.isView` method
// https://tc39.es/ecma262/#sec-arraybuffer.isview
$({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
  isView: ArrayBufferViewCore.isView
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/internals/a-constructor.js":[function(require,module,exports) {

var global = require('../internals/global');
var isConstructor = require('../internals/is-constructor');
var tryToString = require('../internals/try-to-string');

var TypeError = global.TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a constructor');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-constructor":"node_modules/core-js/internals/is-constructor.js","../internals/try-to-string":"node_modules/core-js/internals/try-to-string.js"}],"node_modules/core-js/internals/species-constructor.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var aConstructor = require('../internals/a-constructor');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/a-constructor":"node_modules/core-js/internals/a-constructor.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.array-buffer.slice.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var ArrayBufferModule = require('../internals/array-buffer');
var anObject = require('../internals/an-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var speciesConstructor = require('../internals/species-constructor');

var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var DataViewPrototype = DataView.prototype;
var un$ArrayBufferSlice = uncurryThis(ArrayBuffer.prototype.slice);
var getUint8 = uncurryThis(DataViewPrototype.getUint8);
var setUint8 = uncurryThis(DataViewPrototype.setUint8);

var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
$({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (un$ArrayBufferSlice && end === undefined) {
      return un$ArrayBufferSlice(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
    var viewSource = new DataView(this);
    var viewTarget = new DataView(result);
    var index = 0;
    while (first < fin) {
      setUint8(viewTarget, index++, getUint8(viewSource, first++));
    } return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js"}],"node_modules/core-js/modules/es.data-view.js":[function(require,module,exports) {
var $ = require('../internals/export');
var ArrayBufferModule = require('../internals/array-buffer');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native');

// `DataView` constructor
// https://tc39.es/ecma262/#sec-dataview-constructor
$({ global: true, forced: !NATIVE_ARRAY_BUFFER }, {
  DataView: ArrayBufferModule.DataView
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/array-buffer-native":"node_modules/core-js/internals/array-buffer-native.js"}],"node_modules/core-js/modules/es.date.get-year.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');

var FORCED = fails(function () {
  return new Date(16e11).getYear() !== 120;
});

var getFullYear = uncurryThis(Date.prototype.getFullYear);

// `Date.prototype.getYear` method
// https://tc39.es/ecma262/#sec-date.prototype.getyear
$({ target: 'Date', proto: true, forced: FORCED }, {
  getYear: function getYear() {
    return getFullYear(this) - 1900;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.date.now.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');

var Date = global.Date;
var getTime = uncurryThis(Date.prototype.getTime);

// `Date.now` method
// https://tc39.es/ecma262/#sec-date.now
$({ target: 'Date', stat: true }, {
  now: function now() {
    return getTime(new Date());
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/modules/es.date.set-year.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var DatePrototype = Date.prototype;
var getTime = uncurryThis(DatePrototype.getTime);
var setFullYear = uncurryThis(DatePrototype.setFullYear);

// `Date.prototype.setYear` method
// https://tc39.es/ecma262/#sec-date.prototype.setyear
$({ target: 'Date', proto: true }, {
  setYear: function setYear(year) {
    // validate
    getTime(this);
    var yi = toIntegerOrInfinity(year);
    var yyyy = 0 <= yi && yi <= 99 ? yi + 1900 : yi;
    return setFullYear(this, yyyy);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js"}],"node_modules/core-js/modules/es.date.to-gmt-string.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Date.prototype.toGMTString` method
// https://tc39.es/ecma262/#sec-date.prototype.togmtstring
$({ target: 'Date', proto: true }, {
  toGMTString: Date.prototype.toUTCString
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/string-repeat.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');

var RangeError = global.RangeError;

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
module.exports = function repeat(count) {
  var str = toString(requireObjectCoercible(this));
  var result = '';
  var n = toIntegerOrInfinity(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/string-pad.js":[function(require,module,exports) {
// https://github.com/tc39/proposal-string-pad-start-end
var uncurryThis = require('../internals/function-uncurry-this');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var $repeat = require('../internals/string-repeat');
var requireObjectCoercible = require('../internals/require-object-coercible');

var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var ceil = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod = function (IS_END) {
  return function ($this, maxLength, fillString) {
    var S = toString(requireObjectCoercible($this));
    var intMaxLength = toLength(maxLength);
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : toString(fillString);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr == '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};

module.exports = {
  // `String.prototype.padStart` method
  // https://tc39.es/ecma262/#sec-string.prototype.padstart
  start: createMethod(false),
  // `String.prototype.padEnd` method
  // https://tc39.es/ecma262/#sec-string.prototype.padend
  end: createMethod(true)
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/string-repeat":"node_modules/core-js/internals/string-repeat.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/date-to-iso-string.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var padStart = require('../internals/string-pad').start;

var RangeError = global.RangeError;
var abs = Math.abs;
var DatePrototype = Date.prototype;
var n$DateToISOString = DatePrototype.toISOString;
var getTime = uncurryThis(DatePrototype.getTime);
var getUTCDate = uncurryThis(DatePrototype.getUTCDate);
var getUTCFullYear = uncurryThis(DatePrototype.getUTCFullYear);
var getUTCHours = uncurryThis(DatePrototype.getUTCHours);
var getUTCMilliseconds = uncurryThis(DatePrototype.getUTCMilliseconds);
var getUTCMinutes = uncurryThis(DatePrototype.getUTCMinutes);
var getUTCMonth = uncurryThis(DatePrototype.getUTCMonth);
var getUTCSeconds = uncurryThis(DatePrototype.getUTCSeconds);

// `Date.prototype.toISOString` method implementation
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit fails here:
module.exports = (fails(function () {
  return n$DateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  n$DateToISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime(this))) throw RangeError('Invalid time value');
  var date = this;
  var year = getUTCFullYear(date);
  var milliseconds = getUTCMilliseconds(date);
  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return sign + padStart(abs(year), sign ? 6 : 4, 0) +
    '-' + padStart(getUTCMonth(date) + 1, 2, 0) +
    '-' + padStart(getUTCDate(date), 2, 0) +
    'T' + padStart(getUTCHours(date), 2, 0) +
    ':' + padStart(getUTCMinutes(date), 2, 0) +
    ':' + padStart(getUTCSeconds(date), 2, 0) +
    '.' + padStart(milliseconds, 3, 0) +
    'Z';
} : n$DateToISOString;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/string-pad":"node_modules/core-js/internals/string-pad.js"}],"node_modules/core-js/modules/es.date.to-iso-string.js":[function(require,module,exports) {
var $ = require('../internals/export');
var toISOString = require('../internals/date-to-iso-string');

// `Date.prototype.toISOString` method
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit has a broken implementations
$({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== toISOString }, {
  toISOString: toISOString
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/date-to-iso-string":"node_modules/core-js/internals/date-to-iso-string.js"}],"node_modules/core-js/modules/es.date.to-json.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var toPrimitive = require('../internals/to-primitive');

var FORCED = fails(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.es/ecma262/#sec-date.prototype.tojson
$({ target: 'Date', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O, 'number');
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js"}],"node_modules/core-js/internals/date-to-primitive.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var anObject = require('../internals/an-object');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');

var TypeError = global.TypeError;

// `Date.prototype[@@toPrimitive](hint)` method implementation
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
module.exports = function (hint) {
  anObject(this);
  if (hint === 'string' || hint === 'default') hint = 'string';
  else if (hint !== 'number') throw TypeError('Incorrect hint');
  return ordinaryToPrimitive(this, hint);
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/ordinary-to-primitive":"node_modules/core-js/internals/ordinary-to-primitive.js"}],"node_modules/core-js/modules/es.date.to-primitive.js":[function(require,module,exports) {
var hasOwn = require('../internals/has-own-property');
var redefine = require('../internals/redefine');
var dateToPrimitive = require('../internals/date-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var DatePrototype = Date.prototype;

// `Date.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
if (!hasOwn(DatePrototype, TO_PRIMITIVE)) {
  redefine(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
}

},{"../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/date-to-primitive":"node_modules/core-js/internals/date-to-primitive.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.date.to-string.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var redefine = require('../internals/redefine');

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var un$DateToString = uncurryThis(DatePrototype[TO_STRING]);
var getTime = uncurryThis(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? un$DateToString(this) : INVALID_DATE;
  });
}

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/redefine":"node_modules/core-js/internals/redefine.js"}],"node_modules/core-js/modules/es.escape.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var exec = uncurryThis(/./.exec);
var numberToString = uncurryThis(1.0.toString);
var toUpperCase = uncurryThis(''.toUpperCase);

var raw = /[\w*+\-./@]/;

var hex = function (code, length) {
  var result = numberToString(code, 16);
  while (result.length < length) result = '0' + result;
  return result;
};

// `escape` method
// https://tc39.es/ecma262/#sec-escape-string
$({ global: true }, {
  escape: function escape(string) {
    var str = toString(string);
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, code;
    while (index < length) {
      chr = charAt(str, index++);
      if (exec(raw, chr)) {
        result += chr;
      } else {
        code = charCodeAt(chr, 0);
        if (code < 256) {
          result += '%' + hex(code, 2);
        } else {
          result += '%u' + toUpperCase(hex(code, 4));
        }
      }
    } return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-string":"node_modules/core-js/internals/to-string.js"}],"node_modules/core-js/internals/function-bind.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var arraySlice = require('../internals/array-slice');

var Function = global.Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = Function('C,a', 'return new C(' + join(list, ',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/modules/es.function.bind.js":[function(require,module,exports) {
var $ = require('../internals/export');
var bind = require('../internals/function-bind');

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
$({ target: 'Function', proto: true }, {
  bind: bind
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-bind":"node_modules/core-js/internals/function-bind.js"}],"node_modules/core-js/modules/es.function.has-instance.js":[function(require,module,exports) {
'use strict';
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var definePropertyModule = require('../internals/object-define-property');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var wellKnownSymbol = require('../internals/well-known-symbol');

var HAS_INSTANCE = wellKnownSymbol('hasInstance');
var FunctionPrototype = Function.prototype;

// `Function.prototype[@@hasInstance]` method
// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
if (!(HAS_INSTANCE in FunctionPrototype)) {
  definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, { value: function (O) {
    if (!isCallable(this) || !isObject(O)) return false;
    var P = this.prototype;
    if (!isObject(P)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = getPrototypeOf(O)) if (P === O) return true;
    return false;
  } });
}

},{"../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.function.name.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var FUNCTION_NAME_EXISTS = require('../internals/function-name').EXISTS;
var uncurryThis = require('../internals/function-uncurry-this');
var defineProperty = require('../internals/object-define-property').f;

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /^\s*function ([^ (]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/function-name":"node_modules/core-js/internals/function-name.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.global-this.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');

// `globalThis` object
// https://tc39.es/ecma262/#sec-globalthis
$({ global: true }, {
  globalThis: global
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/modules/es.json.stringify.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');

var Array = global.Array;
var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var fix = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

var FORCED = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  // https://github.com/tc39/proposal-well-formed-stringify
  $({ target: 'JSON', stat: true, forced: FORCED }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      for (var i = 0, l = arguments.length, args = Array(l); i < l; i++) args[i] = arguments[i];
      var result = apply($stringify, null, args);
      return typeof result == 'string' ? replace(result, tester, fix) : result;
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.json.to-string-tag.js":[function(require,module,exports) {

var global = require('../internals/global');
var setToStringTag = require('../internals/set-to-string-tag');

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js"}],"node_modules/core-js/internals/array-buffer-non-extensible.js":[function(require,module,exports) {
// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = require('../internals/fails');

module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/object-is-extensible.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/array-buffer-non-extensible":"node_modules/core-js/internals/array-buffer-non-extensible.js"}],"node_modules/core-js/internals/freezing.js":[function(require,module,exports) {
var fails = require('../internals/fails');

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/internal-metadata.js":[function(require,module,exports) {
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var hiddenKeys = require('../internals/hidden-keys');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternalModule = require('../internals/object-get-own-property-names-external');
var isExtensible = require('../internals/object-is-extensible');
var uid = require('../internals/uid');
var FREEZING = require('../internals/freezing');

var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };

    $({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-names-external":"node_modules/core-js/internals/object-get-own-property-names-external.js","../internals/object-is-extensible":"node_modules/core-js/internals/object-is-extensible.js","../internals/uid":"node_modules/core-js/internals/uid.js","../internals/freezing":"node_modules/core-js/internals/freezing.js"}],"node_modules/core-js/internals/inherit-if-required.js":[function(require,module,exports) {
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};

},{"../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js"}],"node_modules/core-js/internals/collection.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var redefine = require('../internals/redefine');
var InternalMetadataModule = require('../internals/internal-metadata');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var setToStringTag = require('../internals/set-to-string-tag');
var inheritIfRequired = require('../internals/inherit-if-required');

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        uncurriedNativeMethod(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  var REPLACE = isForced(
    CONSTRUCTOR_NAME,
    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    }))
  );

  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, NativePrototype);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js"}],"node_modules/core-js/internals/collection-strong.js":[function(require,module,exports) {
var define;
'use strict';
var defineProperty = require('../internals/object-define-property').f;
var create = require('../internals/object-create');
var redefineAll = require('../internals/redefine-all');
var bind = require('../internals/function-bind-context');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/define-iterator');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(Prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(Prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(Prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return Constructor;
  },
  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/define-iterator":"node_modules/core-js/internals/define-iterator.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.map.js":[function(require,module,exports) {
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-strong":"node_modules/core-js/internals/collection-strong.js"}],"node_modules/core-js/internals/math-log1p.js":[function(require,module,exports) {
var log = Math.log;

// `Math.log1p` method implementation
// https://tc39.es/ecma262/#sec-math.log1p
// eslint-disable-next-line es/no-math-log1p -- safe
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
};

},{}],"node_modules/core-js/modules/es.math.acosh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var log1p = require('../internals/math-log1p');

// eslint-disable-next-line es/no-math-acosh -- required for testing
var $acosh = Math.acosh;
var log = Math.log;
var sqrt = Math.sqrt;
var LN2 = Math.LN2;

var FORCED = !$acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  || Math.floor($acosh(Number.MAX_VALUE)) != 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  || $acosh(Infinity) != Infinity;

// `Math.acosh` method
// https://tc39.es/ecma262/#sec-math.acosh
$({ target: 'Math', stat: true, forced: FORCED }, {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? log(x) + LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-log1p":"node_modules/core-js/internals/math-log1p.js"}],"node_modules/core-js/modules/es.math.asinh.js":[function(require,module,exports) {
var $ = require('../internals/export');

// eslint-disable-next-line es/no-math-asinh -- required for testing
var $asinh = Math.asinh;
var log = Math.log;
var sqrt = Math.sqrt;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
}

// `Math.asinh` method
// https://tc39.es/ecma262/#sec-math.asinh
// Tor Browser bug: Math.asinh(0) -> -0
$({ target: 'Math', stat: true, forced: !($asinh && 1 / $asinh(0) > 0) }, {
  asinh: asinh
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.atanh.js":[function(require,module,exports) {
var $ = require('../internals/export');

// eslint-disable-next-line es/no-math-atanh -- required for testing
var $atanh = Math.atanh;
var log = Math.log;

// `Math.atanh` method
// https://tc39.es/ecma262/#sec-math.atanh
// Tor Browser bug: Math.atanh(-0) -> 0
$({ target: 'Math', stat: true, forced: !($atanh && 1 / $atanh(-0) < 0) }, {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/math-sign.js":[function(require,module,exports) {
// `Math.sign` method implementation
// https://tc39.es/ecma262/#sec-math.sign
// eslint-disable-next-line es/no-math-sign -- safe
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],"node_modules/core-js/modules/es.math.cbrt.js":[function(require,module,exports) {
var $ = require('../internals/export');
var sign = require('../internals/math-sign');

var abs = Math.abs;
var pow = Math.pow;

// `Math.cbrt` method
// https://tc39.es/ecma262/#sec-math.cbrt
$({ target: 'Math', stat: true }, {
  cbrt: function cbrt(x) {
    return sign(x = +x) * pow(abs(x), 1 / 3);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-sign":"node_modules/core-js/internals/math-sign.js"}],"node_modules/core-js/modules/es.math.clz32.js":[function(require,module,exports) {
var $ = require('../internals/export');

var floor = Math.floor;
var log = Math.log;
var LOG2E = Math.LOG2E;

// `Math.clz32` method
// https://tc39.es/ecma262/#sec-math.clz32
$({ target: 'Math', stat: true }, {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - floor(log(x + 0.5) * LOG2E) : 32;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/math-expm1.js":[function(require,module,exports) {
// eslint-disable-next-line es/no-math-expm1 -- safe
var $expm1 = Math.expm1;
var exp = Math.exp;

// `Math.expm1` method implementation
// https://tc39.es/ecma262/#sec-math.expm1
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
} : $expm1;

},{}],"node_modules/core-js/modules/es.math.cosh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

// eslint-disable-next-line es/no-math-cosh -- required for testing
var $cosh = Math.cosh;
var abs = Math.abs;
var E = Math.E;

// `Math.cosh` method
// https://tc39.es/ecma262/#sec-math.cosh
$({ target: 'Math', stat: true, forced: !$cosh || $cosh(710) === Infinity }, {
  cosh: function cosh(x) {
    var t = expm1(abs(x) - 1) + 1;
    return (t + 1 / (t * E * E)) * (E / 2);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/modules/es.math.expm1.js":[function(require,module,exports) {
var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

// `Math.expm1` method
// https://tc39.es/ecma262/#sec-math.expm1
// eslint-disable-next-line es/no-math-expm1 -- required for testing
$({ target: 'Math', stat: true, forced: expm1 != Math.expm1 }, { expm1: expm1 });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/internals/math-fround.js":[function(require,module,exports) {
var sign = require('../internals/math-sign');

var abs = Math.abs;
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

// `Math.fround` method implementation
// https://tc39.es/ecma262/#sec-math.fround
// eslint-disable-next-line es/no-math-fround -- safe
module.exports = Math.fround || function fround(x) {
  var $abs = abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"../internals/math-sign":"node_modules/core-js/internals/math-sign.js"}],"node_modules/core-js/modules/es.math.fround.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fround = require('../internals/math-fround');

// `Math.fround` method
// https://tc39.es/ecma262/#sec-math.fround
$({ target: 'Math', stat: true }, { fround: fround });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-fround":"node_modules/core-js/internals/math-fround.js"}],"node_modules/core-js/modules/es.math.hypot.js":[function(require,module,exports) {
var $ = require('../internals/export');

// eslint-disable-next-line es/no-math-hypot -- required for testing
var $hypot = Math.hypot;
var abs = Math.abs;
var sqrt = Math.sqrt;

// Chrome 77 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=9546
var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

// `Math.hypot` method
// https://tc39.es/ecma262/#sec-math.hypot
$({ target: 'Math', stat: true, forced: BUGGY }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  hypot: function hypot(value1, value2) {
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.imul.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-math-imul -- required for testing
var $imul = Math.imul;

var FORCED = fails(function () {
  return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
});

// `Math.imul` method
// https://tc39.es/ecma262/#sec-math.imul
// some WebKit versions fails with big numbers, some has wrong arity
$({ target: 'Math', stat: true, forced: FORCED }, {
  imul: function imul(x, y) {
    var UINT16 = 0xFFFF;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.math.log10.js":[function(require,module,exports) {
var $ = require('../internals/export');

var log = Math.log;
var LOG10E = Math.LOG10E;

// `Math.log10` method
// https://tc39.es/ecma262/#sec-math.log10
$({ target: 'Math', stat: true }, {
  log10: function log10(x) {
    return log(x) * LOG10E;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.log1p.js":[function(require,module,exports) {
var $ = require('../internals/export');
var log1p = require('../internals/math-log1p');

// `Math.log1p` method
// https://tc39.es/ecma262/#sec-math.log1p
$({ target: 'Math', stat: true }, { log1p: log1p });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-log1p":"node_modules/core-js/internals/math-log1p.js"}],"node_modules/core-js/modules/es.math.log2.js":[function(require,module,exports) {
var $ = require('../internals/export');

var log = Math.log;
var LN2 = Math.LN2;

// `Math.log2` method
// https://tc39.es/ecma262/#sec-math.log2
$({ target: 'Math', stat: true }, {
  log2: function log2(x) {
    return log(x) / LN2;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.sign.js":[function(require,module,exports) {
var $ = require('../internals/export');
var sign = require('../internals/math-sign');

// `Math.sign` method
// https://tc39.es/ecma262/#sec-math.sign
$({ target: 'Math', stat: true }, {
  sign: sign
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-sign":"node_modules/core-js/internals/math-sign.js"}],"node_modules/core-js/modules/es.math.sinh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var expm1 = require('../internals/math-expm1');

var abs = Math.abs;
var exp = Math.exp;
var E = Math.E;

var FORCED = fails(function () {
  // eslint-disable-next-line es/no-math-sinh -- required for testing
  return Math.sinh(-2e-17) != -2e-17;
});

// `Math.sinh` method
// https://tc39.es/ecma262/#sec-math.sinh
// V8 near Chromium 38 has a problem with very small numbers
$({ target: 'Math', stat: true, forced: FORCED }, {
  sinh: function sinh(x) {
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/modules/es.math.tanh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

var exp = Math.exp;

// `Math.tanh` method
// https://tc39.es/ecma262/#sec-math.tanh
$({ target: 'Math', stat: true }, {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/modules/es.math.to-string-tag.js":[function(require,module,exports) {
var setToStringTag = require('../internals/set-to-string-tag');

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

},{"../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js"}],"node_modules/core-js/modules/es.math.trunc.js":[function(require,module,exports) {
var $ = require('../internals/export');

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
$({ target: 'Math', stat: true }, {
  trunc: function trunc(it) {
    return (it > 0 ? floor : ceil)(it);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/this-number-value.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
module.exports = uncurryThis(1.0.valueOf);

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/internals/whitespaces.js":[function(require,module,exports) {
// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],"node_modules/core-js/internals/string-trim.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var whitespaces = require('../internals/whitespaces');

var replace = uncurryThis(''.replace);
var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.number.constructor.js":[function(require,module,exports) {

'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var redefine = require('../internals/redefine');
var hasOwn = require('../internals/has-own-property');
var inheritIfRequired = require('../internals/inherit-if-required');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var isSymbol = require('../internals/is-symbol');
var toPrimitive = require('../internals/to-primitive');
var fails = require('../internals/fails');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var defineProperty = require('../internals/object-define-property').f;
var thisNumberValue = require('../internals/this-number-value');
var trim = require('../internals/string-trim').trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;
var TypeError = global.TypeError;
var arraySlice = uncurryThis(''.slice);
var charCodeAt = uncurryThis(''.charCodeAt);

// `ToNumeric` abstract operation
// https://tc39.es/ecma262/#sec-tonumeric
var toNumeric = function (value) {
  var primValue = toPrimitive(value, 'number');
  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
};

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (isSymbol(it)) throw TypeError('Cannot convert a Symbol value to a number');
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = charCodeAt(it, 0);
    if (first === 43 || first === 45) {
      third = charCodeAt(it, 2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (charCodeAt(it, 1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = arraySlice(it, 2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = charCodeAt(digits, index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
    var dummy = this;
    // check on 1..constructor(foo) case
    return isPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue(dummy); })
      ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (hasOwn(NativeNumber, key = keys[j]) && !hasOwn(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/is-symbol":"node_modules/core-js/internals/is-symbol.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/this-number-value":"node_modules/core-js/internals/this-number-value.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js"}],"node_modules/core-js/modules/es.number.epsilon.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.EPSILON` constant
// https://tc39.es/ecma262/#sec-number.epsilon
$({ target: 'Number', stat: true }, {
  EPSILON: Math.pow(2, -52)
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/number-is-finite.js":[function(require,module,exports) {

var global = require('../internals/global');

var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
// eslint-disable-next-line es/no-number-isfinite -- safe
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/modules/es.number.is-finite.js":[function(require,module,exports) {
var $ = require('../internals/export');
var numberIsFinite = require('../internals/number-is-finite');

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
$({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/number-is-finite":"node_modules/core-js/internals/number-is-finite.js"}],"node_modules/core-js/internals/is-integral-number.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');

var floor = Math.floor;

// `IsIntegralNumber` abstract operation
// https://tc39.es/ecma262/#sec-isintegralnumber
// eslint-disable-next-line es/no-number-isinteger -- safe
module.exports = Number.isInteger || function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.number.is-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isIntegralNumber = require('../internals/is-integral-number');

// `Number.isInteger` method
// https://tc39.es/ecma262/#sec-number.isinteger
$({ target: 'Number', stat: true }, {
  isInteger: isIntegralNumber
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-integral-number":"node_modules/core-js/internals/is-integral-number.js"}],"node_modules/core-js/modules/es.number.is-nan.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.isNaN` method
// https://tc39.es/ecma262/#sec-number.isnan
$({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare -- NaN check
    return number != number;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.number.is-safe-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isIntegralNumber = require('../internals/is-integral-number');

var abs = Math.abs;

// `Number.isSafeInteger` method
// https://tc39.es/ecma262/#sec-number.issafeinteger
$({ target: 'Number', stat: true }, {
  isSafeInteger: function isSafeInteger(number) {
    return isIntegralNumber(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-integral-number":"node_modules/core-js/internals/is-integral-number.js"}],"node_modules/core-js/modules/es.number.max-safe-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.max_safe_integer
$({ target: 'Number', stat: true }, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.number.min-safe-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.MIN_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.min_safe_integer
$({ target: 'Number', stat: true }, {
  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/number-parse-float.js":[function(require,module,exports) {

var global = require('../internals/global');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var charAt = uncurryThis(''.charAt);
var n$ParseFloat = global.parseFloat;
var Symbol = global.Symbol;
var ITERATOR = Symbol && Symbol.iterator;
var FORCED = 1 / n$ParseFloat(whitespaces + '-0') !== -Infinity
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails(function () { n$ParseFloat(Object(ITERATOR)); }));

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
module.exports = FORCED ? function parseFloat(string) {
  var trimmedString = trim(toString(string));
  var result = n$ParseFloat(trimmedString);
  return result === 0 && charAt(trimmedString, 0) == '-' ? -0 : result;
} : n$ParseFloat;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.number.parse-float.js":[function(require,module,exports) {
var $ = require('../internals/export');
var parseFloat = require('../internals/number-parse-float');

// `Number.parseFloat` method
// https://tc39.es/ecma262/#sec-number.parseFloat
// eslint-disable-next-line es/no-number-parsefloat -- required for testing
$({ target: 'Number', stat: true, forced: Number.parseFloat != parseFloat }, {
  parseFloat: parseFloat
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/number-parse-float":"node_modules/core-js/internals/number-parse-float.js"}],"node_modules/core-js/internals/number-parse-int.js":[function(require,module,exports) {

var global = require('../internals/global');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var $parseInt = global.parseInt;
var Symbol = global.Symbol;
var ITERATOR = Symbol && Symbol.iterator;
var hex = /^[+-]?0x/i;
var exec = uncurryThis(hex.exec);
var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails(function () { $parseInt(Object(ITERATOR)); }));

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(toString(string));
  return $parseInt(S, (radix >>> 0) || (exec(hex, S) ? 16 : 10));
} : $parseInt;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.number.parse-int.js":[function(require,module,exports) {
var $ = require('../internals/export');
var parseInt = require('../internals/number-parse-int');

// `Number.parseInt` method
// https://tc39.es/ecma262/#sec-number.parseint
// eslint-disable-next-line es/no-number-parseint -- required for testing
$({ target: 'Number', stat: true, forced: Number.parseInt != parseInt }, {
  parseInt: parseInt
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/number-parse-int":"node_modules/core-js/internals/number-parse-int.js"}],"node_modules/core-js/modules/es.number.to-fixed.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var thisNumberValue = require('../internals/this-number-value');
var $repeat = require('../internals/string-repeat');
var fails = require('../internals/fails');

var RangeError = global.RangeError;
var String = global.String;
var floor = Math.floor;
var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var un$ToFixed = uncurryThis(1.0.toFixed);

var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};

var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

var multiply = function (data, n, c) {
  var index = -1;
  var c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};

var divide = function (data, n) {
  var index = 6;
  var c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor(c / n);
    c = (c % n) * 1e7;
  }
};

var dataToString = function (data) {
  var index = 6;
  var s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      var t = String(data[index]);
      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
    }
  } return s;
};

var FORCED = fails(function () {
  return un$ToFixed(0.00008, 3) !== '0.000' ||
    un$ToFixed(0.9, 0) !== '1' ||
    un$ToFixed(1.255, 2) !== '1.25' ||
    un$ToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  un$ToFixed({});
});

// `Number.prototype.toFixed` method
// https://tc39.es/ecma262/#sec-number.prototype.tofixed
$({ target: 'Number', proto: true, forced: FORCED }, {
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toIntegerOrInfinity(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow(2, 69, 1)) - 69;
      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(data, 1 << 23);
          j -= 23;
        }
        divide(data, 1 << j);
        multiply(data, 1, 1);
        divide(data, 2);
        result = dataToString(data);
      } else {
        multiply(data, 0, z);
        multiply(data, 1 << -e, 0);
        result = dataToString(data) + repeat('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + repeat('0', fractDigits - k) + result
        : stringSlice(result, 0, k - fractDigits) + '.' + stringSlice(result, k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/this-number-value":"node_modules/core-js/internals/this-number-value.js","../internals/string-repeat":"node_modules/core-js/internals/string-repeat.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.number.to-precision.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var thisNumberValue = require('../internals/this-number-value');

var un$ToPrecision = uncurryThis(1.0.toPrecision);

var FORCED = fails(function () {
  // IE7-
  return un$ToPrecision(1, undefined) !== '1';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  un$ToPrecision({});
});

// `Number.prototype.toPrecision` method
// https://tc39.es/ecma262/#sec-number.prototype.toprecision
$({ target: 'Number', proto: true, forced: FORCED }, {
  toPrecision: function toPrecision(precision) {
    return precision === undefined
      ? un$ToPrecision(thisNumberValue(this))
      : un$ToPrecision(thisNumberValue(this), precision);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/this-number-value":"node_modules/core-js/internals/this-number-value.js"}],"node_modules/core-js/internals/object-assign.js":[function(require,module,exports) {
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var uncurryThis = require('../internals/function-uncurry-this');
var call = require('../internals/function-call');
var fails = require('../internals/fails');
var objectKeys = require('../internals/object-keys');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/object-get-own-property-symbols":"node_modules/core-js/internals/object-get-own-property-symbols.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js"}],"node_modules/core-js/modules/es.object.assign.js":[function(require,module,exports) {
var $ = require('../internals/export');
var assign = require('../internals/object-assign');

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-assign":"node_modules/core-js/internals/object-assign.js"}],"node_modules/core-js/modules/es.object.create.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var create = require('../internals/object-create');

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-create":"node_modules/core-js/internals/object-create.js"}],"node_modules/core-js/internals/object-prototype-accessors-forced.js":[function(require,module,exports) {

'use strict';
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var fails = require('../internals/fails');
var WEBKIT = require('../internals/engine-webkit-version');

// Forced replacement object prototype accessors methods
module.exports = IS_PURE || !fails(function () {
  // This feature detection crashes old WebKit
  // https://github.com/zloirock/core-js/issues/232
  if (WEBKIT && WEBKIT < 535) return;
  var key = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call -- required for testing
  __defineSetter__.call(null, key, function () { /* empty */ });
  delete global[key];
});

},{"../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/engine-webkit-version":"node_modules/core-js/internals/engine-webkit-version.js"}],"node_modules/core-js/modules/es.object.define-getter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var definePropertyModule = require('../internals/object-define-property');

// `Object.prototype.__defineGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __defineGetter__: function __defineGetter__(P, getter) {
      definePropertyModule.f(toObject(this), P, { get: aCallable(getter), enumerable: true, configurable: true });
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-prototype-accessors-forced":"node_modules/core-js/internals/object-prototype-accessors-forced.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.object.define-properties.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var defineProperties = require('../internals/object-define-properties');

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperties: defineProperties
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-properties":"node_modules/core-js/internals/object-define-properties.js"}],"node_modules/core-js/modules/es.object.define-property.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var objectDefinePropertyModile = require('../internals/object-define-property');

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.object.define-setter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var definePropertyModule = require('../internals/object-define-property');

// `Object.prototype.__defineSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __defineSetter__: function __defineSetter__(P, setter) {
      definePropertyModule.f(toObject(this), P, { set: aCallable(setter), enumerable: true, configurable: true });
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-prototype-accessors-forced":"node_modules/core-js/internals/object-prototype-accessors-forced.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/internals/object-to-array.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var uncurryThis = require('../internals/function-uncurry-this');
var objectKeys = require('../internals/object-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var $propertyIsEnumerable = require('../internals/object-property-is-enumerable').f;

var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
var push = uncurryThis([].push);

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable(O, key)) {
        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js"}],"node_modules/core-js/modules/es.object.entries.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $entries = require('../internals/object-to-array').entries;

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-to-array":"node_modules/core-js/internals/object-to-array.js"}],"node_modules/core-js/modules/es.object.freeze.js":[function(require,module,exports) {
var $ = require('../internals/export');
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;

// eslint-disable-next-line es/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { $freeze(1); });

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  freeze: function freeze(it) {
    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/freezing":"node_modules/core-js/internals/freezing.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js"}],"node_modules/core-js/modules/es.object.from-entries.js":[function(require,module,exports) {
var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var createProperty = require('../internals/create-property');

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
$({ target: 'Object', stat: true }, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, { AS_ENTRIES: true });
    return obj;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/create-property":"node_modules/core-js/internals/create-property.js"}],"node_modules/core-js/modules/es.object.get-own-property-descriptor.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var DESCRIPTORS = require('../internals/descriptors');

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js"}],"node_modules/core-js/modules/es.object.get-own-property-descriptors.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var ownKeys = require('../internals/own-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var createProperty = require('../internals/create-property');

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/own-keys":"node_modules/core-js/internals/own-keys.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/create-property":"node_modules/core-js/internals/create-property.js"}],"node_modules/core-js/modules/es.object.get-own-property-names.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var getOwnPropertyNames = require('../internals/object-get-own-property-names-external').f;

// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  getOwnPropertyNames: getOwnPropertyNames
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-get-own-property-names-external":"node_modules/core-js/internals/object-get-own-property-names-external.js"}],"node_modules/core-js/modules/es.object.get-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var nativeGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});


},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/correct-prototype-getter":"node_modules/core-js/internals/correct-prototype-getter.js"}],"node_modules/core-js/modules/es.object.has-own.js":[function(require,module,exports) {
var $ = require('../internals/export');
var hasOwn = require('../internals/has-own-property');

// `Object.hasOwn` method
// https://github.com/tc39/proposal-accessible-object-hasownproperty
$({ target: 'Object', stat: true }, {
  hasOwn: hasOwn
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js"}],"node_modules/core-js/internals/same-value.js":[function(require,module,exports) {
// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],"node_modules/core-js/modules/es.object.is.js":[function(require,module,exports) {
var $ = require('../internals/export');
var is = require('../internals/same-value');

// `Object.is` method
// https://tc39.es/ecma262/#sec-object.is
$({ target: 'Object', stat: true }, {
  is: is
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/same-value":"node_modules/core-js/internals/same-value.js"}],"node_modules/core-js/modules/es.object.is-extensible.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $isExtensible = require('../internals/object-is-extensible');

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
// eslint-disable-next-line es/no-object-isextensible -- safe
$({ target: 'Object', stat: true, forced: Object.isExtensible !== $isExtensible }, {
  isExtensible: $isExtensible
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-is-extensible":"node_modules/core-js/internals/object-is-extensible.js"}],"node_modules/core-js/modules/es.object.is-frozen.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es/no-object-isfrozen -- safe
var $isFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES = fails(function () { $isFrozen(1); });

// `Object.isFrozen` method
// https://tc39.es/ecma262/#sec-object.isfrozen
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE }, {
  isFrozen: function isFrozen(it) {
    if (!isObject(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return true;
    return $isFrozen ? $isFrozen(it) : false;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/array-buffer-non-extensible":"node_modules/core-js/internals/array-buffer-non-extensible.js"}],"node_modules/core-js/modules/es.object.is-sealed.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es/no-object-issealed -- safe
var $isSealed = Object.isSealed;
var FAILS_ON_PRIMITIVES = fails(function () { $isSealed(1); });

// `Object.isSealed` method
// https://tc39.es/ecma262/#sec-object.issealed
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE }, {
  isSealed: function isSealed(it) {
    if (!isObject(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return true;
    return $isSealed ? $isSealed(it) : false;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/array-buffer-non-extensible":"node_modules/core-js/internals/array-buffer-non-extensible.js"}],"node_modules/core-js/modules/es.object.keys.js":[function(require,module,exports) {
var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var nativeKeys = require('../internals/object-keys');
var fails = require('../internals/fails');

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.object.lookup-getter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var toObject = require('../internals/to-object');
var toPropertyKey = require('../internals/to-property-key');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Object.prototype.__lookupGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __lookupGetter__: function __lookupGetter__(P) {
      var O = toObject(this);
      var key = toPropertyKey(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.get;
      } while (O = getPrototypeOf(O));
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-prototype-accessors-forced":"node_modules/core-js/internals/object-prototype-accessors-forced.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/modules/es.object.lookup-setter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var toObject = require('../internals/to-object');
var toPropertyKey = require('../internals/to-property-key');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Object.prototype.__lookupSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __lookupSetter__: function __lookupSetter__(P) {
      var O = toObject(this);
      var key = toPropertyKey(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.set;
      } while (O = getPrototypeOf(O));
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-prototype-accessors-forced":"node_modules/core-js/internals/object-prototype-accessors-forced.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/modules/es.object.prevent-extensions.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-preventextensions -- safe
var $preventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES = fails(function () { $preventExtensions(1); });

// `Object.preventExtensions` method
// https://tc39.es/ecma262/#sec-object.preventextensions
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  preventExtensions: function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze(it)) : it;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/freezing":"node_modules/core-js/internals/freezing.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.object.seal.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-seal -- safe
var $seal = Object.seal;
var FAILS_ON_PRIMITIVES = fails(function () { $seal(1); });

// `Object.seal` method
// https://tc39.es/ecma262/#sec-object.seal
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  seal: function seal(it) {
    return $seal && isObject(it) ? $seal(onFreeze(it)) : it;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/freezing":"node_modules/core-js/internals/freezing.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.object.set-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js"}],"node_modules/core-js/internals/object-to-string.js":[function(require,module,exports) {
'use strict';
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classof = require('../internals/classof');

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

},{"../internals/to-string-tag-support":"node_modules/core-js/internals/to-string-tag-support.js","../internals/classof":"node_modules/core-js/internals/classof.js"}],"node_modules/core-js/modules/es.object.to-string.js":[function(require,module,exports) {
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var redefine = require('../internals/redefine');
var toString = require('../internals/object-to-string');

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}

},{"../internals/to-string-tag-support":"node_modules/core-js/internals/to-string-tag-support.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/object-to-string":"node_modules/core-js/internals/object-to-string.js"}],"node_modules/core-js/modules/es.object.values.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $values = require('../internals/object-to-array').values;

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-to-array":"node_modules/core-js/internals/object-to-array.js"}],"node_modules/core-js/modules/es.parse-float.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $parseFloat = require('../internals/number-parse-float');

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
$({ global: true, forced: parseFloat != $parseFloat }, {
  parseFloat: $parseFloat
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/number-parse-float":"node_modules/core-js/internals/number-parse-float.js"}],"node_modules/core-js/modules/es.parse-int.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $parseInt = require('../internals/number-parse-int');

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt != $parseInt }, {
  parseInt: $parseInt
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/number-parse-int":"node_modules/core-js/internals/number-parse-int.js"}],"node_modules/core-js/internals/native-promise-constructor.js":[function(require,module,exports) {

var global = require('../internals/global');

module.exports = global.Promise;

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/engine-is-ios.js":[function(require,module,exports) {
var userAgent = require('../internals/engine-user-agent');

module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/internals/task.js":[function(require,module,exports) {


var global = require('../internals/global');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind-context');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var fails = require('../internals/fails');
var html = require('../internals/html');
var arraySlice = require('../internals/array-slice');
var createElement = require('../internals/document-create-element');
var IS_IOS = require('../internals/engine-is-ios');
var IS_NODE = require('../internals/engine-is-node');

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global.location;
} catch (error) { /* empty */ }

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(isCallable(fn) ? fn : Function(fn), undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/html":"node_modules/core-js/internals/html.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js","../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js","../internals/engine-is-ios":"node_modules/core-js/internals/engine-is-ios.js","../internals/engine-is-node":"node_modules/core-js/internals/engine-is-node.js"}],"node_modules/core-js/internals/engine-is-ios-pebble.js":[function(require,module,exports) {

var userAgent = require('../internals/engine-user-agent');
var global = require('../internals/global');

module.exports = /ipad|iphone|ipod/i.test(userAgent) && global.Pebble !== undefined;

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/engine-is-webos-webkit.js":[function(require,module,exports) {
var userAgent = require('../internals/engine-user-agent');

module.exports = /web0s(?!.*chrome)/i.test(userAgent);

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/internals/microtask.js":[function(require,module,exports) {


var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var macrotask = require('../internals/task').set;
var IS_IOS = require('../internals/engine-is-ios');
var IS_IOS_PEBBLE = require('../internals/engine-is-ios-pebble');
var IS_WEBOS_WEBKIT = require('../internals/engine-is-webos-webkit');
var IS_NODE = require('../internals/engine-is-node');

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    // strange IE + webpack dev server bug - use .bind(global)
    macrotask = bind(macrotask, global);
    notify = function () {
      macrotask(flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/task":"node_modules/core-js/internals/task.js","../internals/engine-is-ios":"node_modules/core-js/internals/engine-is-ios.js","../internals/engine-is-ios-pebble":"node_modules/core-js/internals/engine-is-ios-pebble.js","../internals/engine-is-webos-webkit":"node_modules/core-js/internals/engine-is-webos-webkit.js","../internals/engine-is-node":"node_modules/core-js/internals/engine-is-node.js"}],"node_modules/core-js/internals/new-promise-capability.js":[function(require,module,exports) {
'use strict';
var aCallable = require('../internals/a-callable');

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-callable":"node_modules/core-js/internals/a-callable.js"}],"node_modules/core-js/internals/promise-resolve.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js"}],"node_modules/core-js/internals/host-report-errors.js":[function(require,module,exports) {

var global = require('../internals/global');

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  }
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/perform.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

},{}],"node_modules/core-js/internals/engine-is-browser.js":[function(require,module,exports) {
module.exports = typeof window == 'object';

},{}],"node_modules/core-js/modules/es.promise.js":[function(require,module,exports) {


'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var call = require('../internals/function-call');
var NativePromise = require('../internals/native-promise-constructor');
var redefine = require('../internals/redefine');
var redefineAll = require('../internals/redefine-all');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var setSpecies = require('../internals/set-species');
var aCallable = require('../internals/a-callable');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var anInstance = require('../internals/an-instance');
var inspectSource = require('../internals/inspect-source');
var iterate = require('../internals/iterate');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var promiseResolve = require('../internals/promise-resolve');
var hostReportErrors = require('../internals/host-report-errors');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var InternalStateModule = require('../internals/internal-state');
var isForced = require('../internals/is-forced');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_BROWSER = require('../internals/engine-is-browser');
var IS_NODE = require('../internals/engine-is-node');
var V8_VERSION = require('../internals/engine-v8-version');

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var NativePromisePrototype = NativePromise && NativePromise.prototype;
var PromiseConstructor = NativePromise;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var NATIVE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var SUBCLASSING = false;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromisePrototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT;
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            call(then, result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromisePrototype = PromiseConstructor.prototype;
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromisePrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reactions = state.reactions;
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
      reaction.fail = isCallable(onRejected) && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      reactions[reactions.length] = reaction;
      if (state.state != PENDING) notify(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromise) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
      redefine(NativePromisePrototype, 'catch', PromisePrototype['catch'], { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/native-promise-constructor":"node_modules/core-js/internals/native-promise-constructor.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/task":"node_modules/core-js/internals/task.js","../internals/microtask":"node_modules/core-js/internals/microtask.js","../internals/promise-resolve":"node_modules/core-js/internals/promise-resolve.js","../internals/host-report-errors":"node_modules/core-js/internals/host-report-errors.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js","../internals/perform":"node_modules/core-js/internals/perform.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/engine-is-browser":"node_modules/core-js/internals/engine-is-browser.js","../internals/engine-is-node":"node_modules/core-js/internals/engine-is-node.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js"}],"node_modules/core-js/modules/es.promise.all-settled.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({ target: 'Promise', stat: true }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js","../internals/perform":"node_modules/core-js/internals/perform.js","../internals/iterate":"node_modules/core-js/internals/iterate.js"}],"node_modules/core-js/modules/es.promise.any.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var aCallable = require('../internals/a-callable');
var getBuiltIn = require('../internals/get-built-in');
var call = require('../internals/function-call');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({ target: 'Promise', stat: true }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js","../internals/perform":"node_modules/core-js/internals/perform.js","../internals/iterate":"node_modules/core-js/internals/iterate.js"}],"node_modules/core-js/modules/es.promise.finally.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var NativePromise = require('../internals/native-promise-constructor');
var fails = require('../internals/fails');
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var speciesConstructor = require('../internals/species-constructor');
var promiseResolve = require('../internals/promise-resolve');
var redefine = require('../internals/redefine');

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromise && fails(function () {
  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromise)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromise.prototype['finally'] !== method) {
    redefine(NativePromise.prototype, 'finally', method, { unsafe: true });
  }
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/native-promise-constructor":"node_modules/core-js/internals/native-promise-constructor.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/promise-resolve":"node_modules/core-js/internals/promise-resolve.js","../internals/redefine":"node_modules/core-js/internals/redefine.js"}],"node_modules/core-js/modules/es.reflect.apply.js":[function(require,module,exports) {
var $ = require('../internals/export');
var functionApply = require('../internals/function-apply');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var fails = require('../internals/fails');

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
  // eslint-disable-next-line es/no-reflect -- required for testing
  Reflect.apply(function () { /* empty */ });
});

// `Reflect.apply` method
// https://tc39.es/ecma262/#sec-reflect.apply
$({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
  apply: function apply(target, thisArgument, argumentsList) {
    return functionApply(aCallable(target), thisArgument, anObject(argumentsList));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.reflect.construct.js":[function(require,module,exports) {
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind');
var aConstructor = require('../internals/a-constructor');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var fails = require('../internals/fails');

var nativeConstruct = getBuiltIn('Reflect', 'construct');
var ObjectPrototype = Object.prototype;
var push = [].push;

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});

var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});

var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aConstructor(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      apply(push, $args, args);
      return new (apply(bind, Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : ObjectPrototype);
    var result = apply(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/function-bind":"node_modules/core-js/internals/function-bind.js","../internals/a-constructor":"node_modules/core-js/internals/a-constructor.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.reflect.define-property.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var fails = require('../internals/fails');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
var ERROR_INSTEAD_OF_FALSE = fails(function () {
  // eslint-disable-next-line es/no-reflect -- required for testing
  Reflect.defineProperty(definePropertyModule.f({}, 1, { value: 1 }), 1, { value: 2 });
});

// `Reflect.defineProperty` method
// https://tc39.es/ecma262/#sec-reflect.defineproperty
$({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS }, {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    var key = toPropertyKey(propertyKey);
    anObject(attributes);
    try {
      definePropertyModule.f(target, key, attributes);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.reflect.delete-property.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Reflect.deleteProperty` method
// https://tc39.es/ecma262/#sec-reflect.deleteproperty
$({ target: 'Reflect', stat: true }, {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey);
    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/internals/is-data-descriptor.js":[function(require,module,exports) {
var hasOwn = require('../internals/has-own-property');

module.exports = function (descriptor) {
  return descriptor !== undefined && (hasOwn(descriptor, 'value') || hasOwn(descriptor, 'writable'));
};

},{"../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js"}],"node_modules/core-js/modules/es.reflect.get.js":[function(require,module,exports) {
var $ = require('../internals/export');
var call = require('../internals/function-call');
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');
var isDataDescriptor = require('../internals/is-data-descriptor');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var getPrototypeOf = require('../internals/object-get-prototype-of');

// `Reflect.get` method
// https://tc39.es/ecma262/#sec-reflect.get
function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject(target) === receiver) return target[propertyKey];
  descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey);
  if (descriptor) return isDataDescriptor(descriptor)
    ? descriptor.value
    : descriptor.get === undefined ? undefined : call(descriptor.get, receiver);
  if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
}

$({ target: 'Reflect', stat: true }, {
  get: get
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-data-descriptor":"node_modules/core-js/internals/is-data-descriptor.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js"}],"node_modules/core-js/modules/es.reflect.get-own-property-descriptor.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');

// `Reflect.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-reflect.getownpropertydescriptor
$({ target: 'Reflect', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/modules/es.reflect.get-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var objectGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

// `Reflect.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.getprototypeof
$({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(target) {
    return objectGetPrototypeOf(anObject(target));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/correct-prototype-getter":"node_modules/core-js/internals/correct-prototype-getter.js"}],"node_modules/core-js/modules/es.reflect.has.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Reflect.has` method
// https://tc39.es/ecma262/#sec-reflect.has
$({ target: 'Reflect', stat: true }, {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.reflect.is-extensible.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var $isExtensible = require('../internals/object-is-extensible');

// `Reflect.isExtensible` method
// https://tc39.es/ecma262/#sec-reflect.isextensible
$({ target: 'Reflect', stat: true }, {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible(target);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-is-extensible":"node_modules/core-js/internals/object-is-extensible.js"}],"node_modules/core-js/modules/es.reflect.own-keys.js":[function(require,module,exports) {
var $ = require('../internals/export');
var ownKeys = require('../internals/own-keys');

// `Reflect.ownKeys` method
// https://tc39.es/ecma262/#sec-reflect.ownkeys
$({ target: 'Reflect', stat: true }, {
  ownKeys: ownKeys
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/own-keys":"node_modules/core-js/internals/own-keys.js"}],"node_modules/core-js/modules/es.reflect.prevent-extensions.js":[function(require,module,exports) {
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var anObject = require('../internals/an-object');
var FREEZING = require('../internals/freezing');

// `Reflect.preventExtensions` method
// https://tc39.es/ecma262/#sec-reflect.preventextensions
$({ target: 'Reflect', stat: true, sham: !FREEZING }, {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
      if (objectPreventExtensions) objectPreventExtensions(target);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/freezing":"node_modules/core-js/internals/freezing.js"}],"node_modules/core-js/modules/es.reflect.set.js":[function(require,module,exports) {
var $ = require('../internals/export');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var isDataDescriptor = require('../internals/is-data-descriptor');
var fails = require('../internals/fails');
var definePropertyModule = require('../internals/object-define-property');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

// `Reflect.set` method
// https://tc39.es/ecma262/#sec-reflect.set
function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  var existingDescriptor, prototype, setter;
  if (!ownDescriptor) {
    if (isObject(prototype = getPrototypeOf(target))) {
      return set(prototype, propertyKey, V, receiver);
    }
    ownDescriptor = createPropertyDescriptor(0);
  }
  if (isDataDescriptor(ownDescriptor)) {
    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      definePropertyModule.f(receiver, propertyKey, existingDescriptor);
    } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
  } else {
    setter = ownDescriptor.set;
    if (setter === undefined) return false;
    call(setter, receiver, V);
  } return true;
}

// MS Edge 17-18 Reflect.set allows setting the property to object
// with non-writable property on the prototype
var MS_EDGE_BUG = fails(function () {
  var Constructor = function () { /* empty */ };
  var object = definePropertyModule.f(new Constructor(), 'a', { configurable: true });
  // eslint-disable-next-line es/no-reflect -- required for testing
  return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
});

$({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
  set: set
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/is-data-descriptor":"node_modules/core-js/internals/is-data-descriptor.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/modules/es.reflect.set-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');
var objectSetPrototypeOf = require('../internals/object-set-prototype-of');

// `Reflect.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.setprototypeof
if (objectSetPrototypeOf) $({ target: 'Reflect', stat: true }, {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    anObject(target);
    aPossiblePrototype(proto);
    try {
      objectSetPrototypeOf(target, proto);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/a-possible-prototype":"node_modules/core-js/internals/a-possible-prototype.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js"}],"node_modules/core-js/modules/es.reflect.to-string-tag.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var setToStringTag = require('../internals/set-to-string-tag');

$({ global: true }, { Reflect: {} });

// Reflect[@@toStringTag] property
// https://tc39.es/ecma262/#sec-reflect-@@tostringtag
setToStringTag(global.Reflect, 'Reflect', true);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js"}],"node_modules/core-js/internals/is-regexp.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/regexp-flags.js":[function(require,module,exports) {
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js"}],"node_modules/core-js/internals/regexp-sticky-helpers.js":[function(require,module,exports) {

var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

exports.UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/regexp-unsupported-dot-all.js":[function(require,module,exports) {

var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/regexp-unsupported-ncg.js":[function(require,module,exports) {

var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/modules/es.regexp.constructor.js":[function(require,module,exports) {

var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var inheritIfRequired = require('../internals/inherit-if-required');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var isPrototypeOf = require('../internals/object-is-prototype-of');
var isRegExp = require('../internals/is-regexp');
var toString = require('../internals/to-string');
var regExpFlags = require('../internals/regexp-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var hasOwn = require('../internals/has-own-property');
var enforceInternalState = require('../internals/internal-state').enforce;
var setSpecies = require('../internals/set-species');
var wellKnownSymbol = require('../internals/well-known-symbol');
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');

var MATCH = wellKnownSymbol('match');
var NativeRegExp = global.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var SyntaxError = global.SyntaxError;
var getFlags = uncurryThis(regExpFlags);
var exec = uncurryThis(RegExpPrototype.exec);
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);
// TODO: Use only propper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

var BASE_FORCED = DESCRIPTORS &&
  (!CORRECT_NEW || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function () {
    re2[MATCH] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  }));

var handleDotAll = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      result += chr + charAt(string, ++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      } result += chr;
    }
  } return result;
};

var handleNCG = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      chr = chr + charAt(string, ++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        if (exec(IS_NCG, stringSlice(string, index + 1))) {
          index += 2;
          ncg = true;
        }
        result += chr;
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || hasOwn(names, groupname)) {
          throw new SyntaxError('Invalid capture group name');
        }
        names[groupname] = true;
        named[named.length] = [groupname, groupid];
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;
    else result += chr;
  } return [result, named];
};

// `RegExp` constructor
// https://tc39.es/ecma262/#sec-regexp-constructor
if (isForced('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
    var patternIsRegExp = isRegExp(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;

    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }

    if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : getFlags(rawPattern);
    }

    pattern = pattern === undefined ? '' : toString(pattern);
    flags = flags === undefined ? '' : toString(flags);
    rawPattern = pattern;

    if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
      if (dotAll) flags = replace(flags, /s/g, '');
    }

    rawFlags = flags;

    if (UNSUPPORTED_Y && 'sticky' in re1) {
      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
      if (sticky) flags = replace(flags, /y/g, '');
    }

    if (UNSUPPORTED_NCG) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }

    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);

    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }

    if (pattern !== rawPattern) try {
      // fails in old engines, but we have no alternatives for unsupported regex syntax
      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) { /* empty */ }

    return result;
  };

  var proxy = function (key) {
    key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };

  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
    proxy(keys[index++]);
  }

  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  redefine(global, 'RegExp', RegExpWrapper);
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/regexp-unsupported-dot-all":"node_modules/core-js/internals/regexp-unsupported-dot-all.js","../internals/regexp-unsupported-ncg":"node_modules/core-js/internals/regexp-unsupported-ncg.js"}],"node_modules/core-js/modules/es.regexp.dot-all.js":[function(require,module,exports) {

var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var classof = require('../internals/classof-raw');
var defineProperty = require('../internals/object-define-property').f;
var getInternalState = require('../internals/internal-state').get;

var RegExpPrototype = RegExp.prototype;
var TypeError = global.TypeError;

// `RegExp.prototype.dotAll` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
if (DESCRIPTORS && UNSUPPORTED_DOT_ALL) {
  defineProperty(RegExpPrototype, 'dotAll', {
    configurable: true,
    get: function () {
      if (this === RegExpPrototype) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (classof(this) === 'RegExp') {
        return !!getInternalState(this).dotAll;
      }
      throw TypeError('Incompatible receiver, RegExp required');
    }
  });
}

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/regexp-unsupported-dot-all":"node_modules/core-js/internals/regexp-unsupported-dot-all.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/internals/regexp-exec.js":[function(require,module,exports) {
'use strict';
/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var regexpFlags = require('../internals/regexp-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var shared = require('../internals/shared');
var create = require('../internals/object-create');
var getInternalState = require('../internals/internal-state').get;
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  // eslint-disable-next-line max-statements -- TODO
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;

},{"../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js","../internals/shared":"node_modules/core-js/internals/shared.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/regexp-unsupported-dot-all":"node_modules/core-js/internals/regexp-unsupported-dot-all.js","../internals/regexp-unsupported-ncg":"node_modules/core-js/internals/regexp-unsupported-ncg.js"}],"node_modules/core-js/modules/es.regexp.exec.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var exec = require('../internals/regexp-exec');

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js"}],"node_modules/core-js/modules/es.regexp.flags.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var objectDefinePropertyModule = require('../internals/object-define-property');
var regExpFlags = require('../internals/regexp-flags');
var fails = require('../internals/fails');

var RegExpPrototype = RegExp.prototype;

var FORCED = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  return Object.getOwnPropertyDescriptor(RegExpPrototype, 'flags').get.call({ dotAll: true, sticky: true }) !== 'sy';
});

// `RegExp.prototype.flags` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
if (FORCED) objectDefinePropertyModule.f(RegExpPrototype, 'flags', {
  configurable: true,
  get: regExpFlags
});

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.regexp.sticky.js":[function(require,module,exports) {

var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var UNSUPPORTED_Y = require('../internals/regexp-sticky-helpers').UNSUPPORTED_Y;
var classof = require('../internals/classof-raw');
var defineProperty = require('../internals/object-define-property').f;
var getInternalState = require('../internals/internal-state').get;

var RegExpPrototype = RegExp.prototype;
var TypeError = global.TypeError;

// `RegExp.prototype.sticky` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
if (DESCRIPTORS && UNSUPPORTED_Y) {
  defineProperty(RegExpPrototype, 'sticky', {
    configurable: true,
    get: function () {
      if (this === RegExpPrototype) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (classof(this) === 'RegExp') {
        return !!getInternalState(this).sticky;
      }
      throw TypeError('Incompatible receiver, RegExp required');
    }
  });
}

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.regexp.test.js":[function(require,module,exports) {

'use strict';
// TODO: Remove from `core-js@4` since it's moved to entry points
require('../modules/es.regexp.exec');
var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');

var DELEGATES_TO_EXEC = function () {
  var execCalled = false;
  var re = /[ac]/;
  re.exec = function () {
    execCalled = true;
    return /./.exec.apply(this, arguments);
  };
  return re.test('abc') === true && execCalled;
}();

var Error = global.Error;
var un$Test = uncurryThis(/./.test);

// `RegExp.prototype.test` method
// https://tc39.es/ecma262/#sec-regexp.prototype.test
$({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
  test: function (str) {
    var exec = this.exec;
    if (!isCallable(exec)) return un$Test(this, str);
    var result = call(exec, this, str);
    if (result !== null && !isObject(result)) {
      throw new Error('RegExp exec method returned something other than an Object or null');
    }
    return !!result;
  }
});

},{"../modules/es.regexp.exec":"node_modules/core-js/modules/es.regexp.exec.js","../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.regexp.to-string.js":[function(require,module,exports) {
'use strict';
var uncurryThis = require('../internals/function-uncurry-this');
var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
var redefine = require('../internals/redefine');
var anObject = require('../internals/an-object');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var $toString = require('../internals/to-string');
var fails = require('../internals/fails');
var regExpFlags = require('../internals/regexp-flags');

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var n$ToString = RegExpPrototype[TO_STRING];
var getFlags = uncurryThis(regExpFlags);

var NOT_GENERIC = fails(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && n$ToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = $toString(R.source);
    var rf = R.flags;
    var f = $toString(rf === undefined && isPrototypeOf(RegExpPrototype, R) && !('flags' in RegExpPrototype) ? getFlags(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/function-name":"node_modules/core-js/internals/function-name.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js"}],"node_modules/core-js/modules/es.set.js":[function(require,module,exports) {
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Set` constructor
// https://tc39.es/ecma262/#sec-set-objects
collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-strong":"node_modules/core-js/internals/collection-strong.js"}],"node_modules/core-js/modules/es.string.at-alternative.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var fails = require('../internals/fails');

var charAt = uncurryThis(''.charAt);

var FORCED = fails(function () {
  return '𠮷'.at(0) !== '\uD842';
});

// `String.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
$({ target: 'String', proto: true, forced: FORCED }, {
  at: function at(index) {
    var S = toString(requireObjectCoercible(this));
    var len = S.length;
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : charAt(S, k);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/string-multibyte.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/modules/es.string.code-point-at.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var codeAt = require('../internals/string-multibyte').codeAt;

// `String.prototype.codePointAt` method
// https://tc39.es/ecma262/#sec-string.prototype.codepointat
$({ target: 'String', proto: true }, {
  codePointAt: function codePointAt(pos) {
    return codeAt(this, pos);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js"}],"node_modules/core-js/internals/not-a-regexp.js":[function(require,module,exports) {

var global = require('../internals/global');
var isRegExp = require('../internals/is-regexp');

var TypeError = global.TypeError;

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js"}],"node_modules/core-js/internals/correct-is-regexp-logic.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.string.ends-with.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

// eslint-disable-next-line es/no-string-prototype-endswith -- safe
var un$EndsWith = uncurryThis(''.endsWith);
var slice = uncurryThis(''.slice);
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.endsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.endswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = toString(requireObjectCoercible(this));
    notARegExp(searchString);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = that.length;
    var end = endPosition === undefined ? len : min(toLength(endPosition), len);
    var search = toString(searchString);
    return un$EndsWith
      ? un$EndsWith(that, search, end)
      : slice(that, end - search.length, end) === search;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/not-a-regexp":"node_modules/core-js/internals/not-a-regexp.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/correct-is-regexp-logic":"node_modules/core-js/internals/correct-is-regexp-logic.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/modules/es.string.from-code-point.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var toAbsoluteIndex = require('../internals/to-absolute-index');

var RangeError = global.RangeError;
var fromCharCode = String.fromCharCode;
// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
var $fromCodePoint = String.fromCodePoint;
var join = uncurryThis([].join);

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length != 1;

// `String.fromCodePoint` method
// https://tc39.es/ecma262/#sec-string.fromcodepoint
$({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  fromCodePoint: function fromCodePoint(x) {
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
      elements[i] = code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
    } return join(elements, '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js"}],"node_modules/core-js/modules/es.string.includes.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');

var stringIndexOf = uncurryThis(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(
      toString(requireObjectCoercible(this)),
      toString(notARegExp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/not-a-regexp":"node_modules/core-js/internals/not-a-regexp.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/correct-is-regexp-logic":"node_modules/core-js/internals/correct-is-regexp-logic.js"}],"node_modules/core-js/modules/es.string.iterator.js":[function(require,module,exports) {
'use strict';
var charAt = require('../internals/string-multibyte').charAt;
var toString = require('../internals/to-string');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/define-iterator":"node_modules/core-js/internals/define-iterator.js"}],"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js":[function(require,module,exports) {
'use strict';
// TODO: Remove from `core-js@4` since it's moved to entry points
require('../modules/es.regexp.exec');
var uncurryThis = require('../internals/function-uncurry-this');
var redefine = require('../internals/redefine');
var regexpExec = require('../internals/regexp-exec');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

},{"../modules/es.regexp.exec":"node_modules/core-js/modules/es.regexp.exec.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js"}],"node_modules/core-js/internals/advance-string-index.js":[function(require,module,exports) {
'use strict';
var charAt = require('../internals/string-multibyte').charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

},{"../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js"}],"node_modules/core-js/internals/regexp-exec-abstract.js":[function(require,module,exports) {

var global = require('../internals/global');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof-raw');
var regexpExec = require('../internals/regexp-exec');

var TypeError = global.TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw TypeError('RegExp#exec called on incompatible receiver');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js"}],"node_modules/core-js/modules/es.string.match.js":[function(require,module,exports) {
'use strict';
var call = require('../internals/function-call');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var getMethod = require('../internals/get-method');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@match logic
fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : getMethod(regexp, MATCH);
      return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = toString(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js"}],"node_modules/core-js/modules/es.string.match-all.js":[function(require,module,exports) {

'use strict';
/* eslint-disable es/no-string-prototype-matchall -- safe */
var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var anObject = require('../internals/an-object');
var classof = require('../internals/classof-raw');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var isRegExp = require('../internals/is-regexp');
var regExpFlags = require('../internals/regexp-flags');
var getMethod = require('../internals/get-method');
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');
var InternalStateModule = require('../internals/internal-state');
var IS_PURE = require('../internals/is-pure');

var MATCH_ALL = wellKnownSymbol('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var TypeError = global.TypeError;
var getFlags = uncurryThis(regExpFlags);
var stringIndexOf = uncurryThis(''.indexOf);
var un$MatchAll = uncurryThis(''.matchAll);

var WORKS_WITH_NON_GLOBAL_REGEX = !!un$MatchAll && !fails(function () {
  un$MatchAll('a', /./);
});

var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
  setInternalState(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: $global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState(this);
  if (state.done) return { value: undefined, done: true };
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec(R, S);
  if (match === null) return { value: undefined, done: state.done = true };
  if (state.global) {
    if (toString(match[0]) === '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
    return { value: match, done: false };
  }
  state.done = true;
  return { value: match, done: false };
});

var $matchAll = function (string) {
  var R = anObject(this);
  var S = toString(string);
  var C, flagsValue, flags, matcher, $global, fullUnicode;
  C = speciesConstructor(R, RegExp);
  flagsValue = R.flags;
  if (flagsValue === undefined && isPrototypeOf(RegExpPrototype, R) && !('flags' in RegExpPrototype)) {
    flagsValue = getFlags(R);
  }
  flags = flagsValue === undefined ? '' : toString(flagsValue);
  matcher = new C(C === RegExp ? R.source : R, flags);
  $global = !!~stringIndexOf(flags, 'g');
  fullUnicode = !!~stringIndexOf(flags, 'u');
  matcher.lastIndex = toLength(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://tc39.es/ecma262/#sec-string.prototype.matchall
$({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible(this);
    var flags, S, matcher, rx;
    if (regexp != null) {
      if (isRegExp(regexp)) {
        flags = toString(requireObjectCoercible('flags' in RegExpPrototype
          ? regexp.flags
          : getFlags(regexp)
        ));
        if (!~stringIndexOf(flags, 'g')) throw TypeError('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return un$MatchAll(O, regexp);
      matcher = getMethod(regexp, MATCH_ALL);
      if (matcher === undefined && IS_PURE && classof(regexp) == 'RegExp') matcher = $matchAll;
      if (matcher) return call(matcher, regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return un$MatchAll(O, regexp);
    S = toString(O);
    rx = new RegExp(regexp, 'g');
    return IS_PURE ? call($matchAll, rx, S) : rx[MATCH_ALL](S);
  }
});

IS_PURE || MATCH_ALL in RegExpPrototype || redefine(RegExpPrototype, MATCH_ALL, $matchAll);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/create-iterator-constructor":"node_modules/core-js/internals/create-iterator-constructor.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/string-pad-webkit-bug.js":[function(require,module,exports) {
// https://github.com/zloirock/core-js/issues/280
var userAgent = require('../internals/engine-user-agent');

module.exports = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent);

},{"../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js"}],"node_modules/core-js/modules/es.string.pad-end.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $padEnd = require('../internals/string-pad').end;
var WEBKIT_BUG = require('../internals/string-pad-webkit-bug');

// `String.prototype.padEnd` method
// https://tc39.es/ecma262/#sec-string.prototype.padend
$({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-pad":"node_modules/core-js/internals/string-pad.js","../internals/string-pad-webkit-bug":"node_modules/core-js/internals/string-pad-webkit-bug.js"}],"node_modules/core-js/modules/es.string.pad-start.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $padStart = require('../internals/string-pad').start;
var WEBKIT_BUG = require('../internals/string-pad-webkit-bug');

// `String.prototype.padStart` method
// https://tc39.es/ecma262/#sec-string.prototype.padstart
$({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-pad":"node_modules/core-js/internals/string-pad.js","../internals/string-pad-webkit-bug":"node_modules/core-js/internals/string-pad-webkit-bug.js"}],"node_modules/core-js/modules/es.string.raw.js":[function(require,module,exports) {
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toIndexedObject = require('../internals/to-indexed-object');
var toObject = require('../internals/to-object');
var toString = require('../internals/to-string');
var lengthOfArrayLike = require('../internals/length-of-array-like');

var push = uncurryThis([].push);
var join = uncurryThis([].join);

// `String.raw` method
// https://tc39.es/ecma262/#sec-string.raw
$({ target: 'String', stat: true }, {
  raw: function raw(template) {
    var rawTemplate = toIndexedObject(toObject(template).raw);
    var literalSegments = lengthOfArrayLike(rawTemplate);
    var argumentsLength = arguments.length;
    var elements = [];
    var i = 0;
    while (literalSegments > i) {
      push(elements, toString(rawTemplate[i++]));
      if (i === literalSegments) return join(elements, '');
      if (i < argumentsLength) push(elements, toString(arguments[i]));
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js"}],"node_modules/core-js/modules/es.string.repeat.js":[function(require,module,exports) {
var $ = require('../internals/export');
var repeat = require('../internals/string-repeat');

// `String.prototype.repeat` method
// https://tc39.es/ecma262/#sec-string.prototype.repeat
$({ target: 'String', proto: true }, {
  repeat: repeat
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-repeat":"node_modules/core-js/internals/string-repeat.js"}],"node_modules/core-js/internals/get-substitution.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-object":"node_modules/core-js/internals/to-object.js"}],"node_modules/core-js/modules/es.string.replace.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';
var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var fails = require('../internals/fails');
var anObject = require('../internals/an-object');
var isCallable = require('../internals/is-callable');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var getMethod = require('../internals/get-method');
var getSubstitution = require('../internals/get-substitution');
var regExpExec = require('../internals/regexp-exec-abstract');
var wellKnownSymbol = require('../internals/well-known-symbol');

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
      return replacer
        ? call(replacer, searchValue, O, replaceValue)
        : call(nativeReplace, toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          var replacement = toString(apply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

},{"../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/get-substitution":"node_modules/core-js/internals/get-substitution.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.string.replace-all.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var isCallable = require('../internals/is-callable');
var isRegExp = require('../internals/is-regexp');
var toString = require('../internals/to-string');
var getMethod = require('../internals/get-method');
var regExpFlags = require('../internals/regexp-flags');
var getSubstitution = require('../internals/get-substitution');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var REPLACE = wellKnownSymbol('replace');
var RegExpPrototype = RegExp.prototype;
var TypeError = global.TypeError;
var getFlags = uncurryThis(regExpFlags);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var max = Math.max;

var stringIndexOf = function (string, searchValue, fromIndex) {
  if (fromIndex > string.length) return -1;
  if (searchValue === '') return fromIndex;
  return indexOf(string, searchValue, fromIndex);
};

// `String.prototype.replaceAll` method
// https://tc39.es/ecma262/#sec-string.prototype.replaceall
$({ target: 'String', proto: true }, {
  replaceAll: function replaceAll(searchValue, replaceValue) {
    var O = requireObjectCoercible(this);
    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement;
    var position = 0;
    var endOfLastMatch = 0;
    var result = '';
    if (searchValue != null) {
      IS_REG_EXP = isRegExp(searchValue);
      if (IS_REG_EXP) {
        flags = toString(requireObjectCoercible('flags' in RegExpPrototype
          ? searchValue.flags
          : getFlags(searchValue)
        ));
        if (!~indexOf(flags, 'g')) throw TypeError('`.replaceAll` does not allow non-global regexes');
      }
      replacer = getMethod(searchValue, REPLACE);
      if (replacer) {
        return call(replacer, searchValue, O, replaceValue);
      } else if (IS_PURE && IS_REG_EXP) {
        return replace(toString(O), searchValue, replaceValue);
      }
    }
    string = toString(O);
    searchString = toString(searchValue);
    functionalReplace = isCallable(replaceValue);
    if (!functionalReplace) replaceValue = toString(replaceValue);
    searchLength = searchString.length;
    advanceBy = max(1, searchLength);
    position = stringIndexOf(string, searchString, 0);
    while (position !== -1) {
      replacement = functionalReplace
        ? toString(replaceValue(searchString, position, string))
        : getSubstitution(searchString, string, position, [], undefined, replaceValue);
      result += stringSlice(string, endOfLastMatch, position) + replacement;
      endOfLastMatch = position + searchLength;
      position = stringIndexOf(string, searchString, position + advanceBy);
    }
    if (endOfLastMatch < string.length) {
      result += stringSlice(string, endOfLastMatch);
    }
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/get-substitution":"node_modules/core-js/internals/get-substitution.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/modules/es.string.search.js":[function(require,module,exports) {
'use strict';
var call = require('../internals/function-call');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
var sameValue = require('../internals/same-value');
var toString = require('../internals/to-string');
var getMethod = require('../internals/get-method');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@search logic
fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.es/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : getMethod(regexp, SEARCH);
      return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeSearch, rx, S);

      if (res.done) return res.value;

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

},{"../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/same-value":"node_modules/core-js/internals/same-value.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js"}],"node_modules/core-js/modules/es.string.split.js":[function(require,module,exports) {
'use strict';
var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var isRegExp = require('../internals/is-regexp');
var anObject = require('../internals/an-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var getMethod = require('../internals/get-method');
var arraySlice = require('../internals/array-slice');
var callRegExpExec = require('../internals/regexp-exec-abstract');
var regexpExec = require('../internals/regexp-exec');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var fails = require('../internals/fails');

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 0xFFFFFFFF;
var min = Math.min;
var $push = [].push;
var exec = uncurryThis(/./.exec);
var push = uncurryThis($push);
var stringSlice = uncurryThis(''.slice);

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return call(nativeSplit, string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = call(regexpExec, separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          push(output, stringSlice(string, lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) apply($push, output, arraySlice(match, 1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !exec(separatorCopy, '')) push(output, '');
      } else push(output, stringSlice(string, lastLastIndex));
      return output.length > lim ? arraySlice(output, 0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
      return splitter
        ? call(splitter, separator, O, limit)
        : call(internalSplit, toString(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          push(A, stringSlice(S, p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            push(A, z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      push(A, stringSlice(S, p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

},{"../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/get-method":"node_modules/core-js/internals/get-method.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.string.starts-with.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

// eslint-disable-next-line es/no-string-prototype-startswith -- safe
var un$StartsWith = uncurryThis(''.startsWith);
var stringSlice = uncurryThis(''.slice);
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = toString(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString(searchString);
    return un$StartsWith
      ? un$StartsWith(that, search, index)
      : stringSlice(that, index, index + search.length) === search;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/not-a-regexp":"node_modules/core-js/internals/not-a-regexp.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/correct-is-regexp-logic":"node_modules/core-js/internals/correct-is-regexp-logic.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/modules/es.string.substr.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');

var stringSlice = uncurryThis(''.slice);
var max = Math.max;
var min = Math.min;

// eslint-disable-next-line unicorn/prefer-string-slice -- required for testing
var FORCED = !''.substr || 'ab'.substr(-1) !== 'b';

// `String.prototype.substr` method
// https://tc39.es/ecma262/#sec-string.prototype.substr
$({ target: 'String', proto: true, forced: FORCED }, {
  substr: function substr(start, length) {
    var that = toString(requireObjectCoercible(this));
    var size = that.length;
    var intStart = toIntegerOrInfinity(start);
    var intLength, intEnd;
    if (intStart === Infinity) intStart = 0;
    if (intStart < 0) intStart = max(size + intStart, 0);
    intLength = length === undefined ? size : toIntegerOrInfinity(length);
    if (intLength <= 0 || intLength === Infinity) return '';
    intEnd = min(intStart + intLength, size);
    return intStart >= intEnd ? '' : stringSlice(that, intStart, intEnd);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js","../internals/to-string":"node_modules/core-js/internals/to-string.js"}],"node_modules/core-js/internals/string-trim-forced.js":[function(require,module,exports) {
var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
var fails = require('../internals/fails');
var whitespaces = require('../internals/whitespaces');

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]()
      || non[METHOD_NAME]() !== non
      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
  });
};

},{"../internals/function-name":"node_modules/core-js/internals/function-name.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.string.trim.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $trim = require('../internals/string-trim').trim;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/string-trim-forced":"node_modules/core-js/internals/string-trim-forced.js"}],"node_modules/core-js/modules/es.string.trim-end.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $trimEnd = require('../internals/string-trim').end;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

var FORCED = forcedStringTrimMethod('trimEnd');

var trimEnd = FORCED ? function trimEnd() {
  return $trimEnd(this);
// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
} : ''.trimEnd;

// `String.prototype.{ trimEnd, trimRight }` methods
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// https://tc39.es/ecma262/#String.prototype.trimright
$({ target: 'String', proto: true, name: 'trimEnd', forced: FORCED }, {
  trimEnd: trimEnd,
  trimRight: trimEnd
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/string-trim-forced":"node_modules/core-js/internals/string-trim-forced.js"}],"node_modules/core-js/modules/es.string.trim-start.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $trimStart = require('../internals/string-trim').start;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

var FORCED = forcedStringTrimMethod('trimStart');

var trimStart = FORCED ? function trimStart() {
  return $trimStart(this);
// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
} : ''.trimStart;

// `String.prototype.{ trimStart, trimLeft }` methods
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
// https://tc39.es/ecma262/#String.prototype.trimleft
$({ target: 'String', proto: true, name: 'trimStart', forced: FORCED }, {
  trimStart: trimStart,
  trimLeft: trimStart
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/string-trim-forced":"node_modules/core-js/internals/string-trim-forced.js"}],"node_modules/core-js/internals/create-html.js":[function(require,module,exports) {
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');

var quot = /"/g;
var replace = uncurryThis(''.replace);

// `CreateHTML` abstract operation
// https://tc39.es/ecma262/#sec-createhtml
module.exports = function (string, tag, attribute, value) {
  var S = toString(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + replace(toString(value), quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-string":"node_modules/core-js/internals/to-string.js"}],"node_modules/core-js/internals/string-html-forced.js":[function(require,module,exports) {
var fails = require('../internals/fails');

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
module.exports = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.string.anchor.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.anchor` method
// https://tc39.es/ecma262/#sec-string.prototype.anchor
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('anchor') }, {
  anchor: function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.big.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.big` method
// https://tc39.es/ecma262/#sec-string.prototype.big
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('big') }, {
  big: function big() {
    return createHTML(this, 'big', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.blink.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.blink` method
// https://tc39.es/ecma262/#sec-string.prototype.blink
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('blink') }, {
  blink: function blink() {
    return createHTML(this, 'blink', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.bold.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.bold` method
// https://tc39.es/ecma262/#sec-string.prototype.bold
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('bold') }, {
  bold: function bold() {
    return createHTML(this, 'b', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.fixed.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.fixed` method
// https://tc39.es/ecma262/#sec-string.prototype.fixed
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fixed') }, {
  fixed: function fixed() {
    return createHTML(this, 'tt', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.fontcolor.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.fontcolor` method
// https://tc39.es/ecma262/#sec-string.prototype.fontcolor
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fontcolor') }, {
  fontcolor: function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.fontsize.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.fontsize` method
// https://tc39.es/ecma262/#sec-string.prototype.fontsize
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fontsize') }, {
  fontsize: function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.italics.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.italics` method
// https://tc39.es/ecma262/#sec-string.prototype.italics
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('italics') }, {
  italics: function italics() {
    return createHTML(this, 'i', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.link.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.link` method
// https://tc39.es/ecma262/#sec-string.prototype.link
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {
  link: function link(url) {
    return createHTML(this, 'a', 'href', url);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.small.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.small` method
// https://tc39.es/ecma262/#sec-string.prototype.small
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('small') }, {
  small: function small() {
    return createHTML(this, 'small', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.strike.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.strike` method
// https://tc39.es/ecma262/#sec-string.prototype.strike
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('strike') }, {
  strike: function strike() {
    return createHTML(this, 'strike', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.sub.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.sub` method
// https://tc39.es/ecma262/#sec-string.prototype.sub
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sub') }, {
  sub: function sub() {
    return createHTML(this, 'sub', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/modules/es.string.sup.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.sup` method
// https://tc39.es/ecma262/#sec-string.prototype.sup
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sup') }, {
  sup: function sup() {
    return createHTML(this, 'sup', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/string-html-forced":"node_modules/core-js/internals/string-html-forced.js"}],"node_modules/core-js/internals/typed-array-constructors-require-wrappers.js":[function(require,module,exports) {

/* eslint-disable no-new -- required for testing */
var global = require('../internals/global');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var NATIVE_ARRAY_BUFFER_VIEWS = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/internals/to-positive-integer.js":[function(require,module,exports) {

var global = require('../internals/global');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var RangeError = global.RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js"}],"node_modules/core-js/internals/to-offset.js":[function(require,module,exports) {

var global = require('../internals/global');
var toPositiveInteger = require('../internals/to-positive-integer');

var RangeError = global.RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/to-positive-integer":"node_modules/core-js/internals/to-positive-integer.js"}],"node_modules/core-js/internals/typed-array-from.js":[function(require,module,exports) {
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var aConstructor = require('../internals/a-constructor');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var aTypedArrayConstructor = require('../internals/array-buffer-view-core').aTypedArrayConstructor;

module.exports = function from(source /* , mapfn, thisArg */) {
  var C = aConstructor(this);
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    O = [];
    while (!(step = call(next, iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2]);
  }
  length = lengthOfArrayLike(O);
  result = new (aTypedArrayConstructor(C))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

},{"../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/a-constructor":"node_modules/core-js/internals/a-constructor.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/get-iterator":"node_modules/core-js/internals/get-iterator.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js","../internals/is-array-iterator-method":"node_modules/core-js/internals/is-array-iterator-method.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/internals/typed-array-constructor.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var DESCRIPTORS = require('../internals/descriptors');
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ArrayBufferModule = require('../internals/array-buffer');
var anInstance = require('../internals/an-instance');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var isIntegralNumber = require('../internals/is-integral-number');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var toOffset = require('../internals/to-offset');
var toPropertyKey = require('../internals/to-property-key');
var hasOwn = require('../internals/has-own-property');
var classof = require('../internals/classof');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var create = require('../internals/object-create');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var typedArrayFrom = require('../internals/typed-array-from');
var forEach = require('../internals/array-iteration').forEach;
var setSpecies = require('../internals/set-species');
var definePropertyModule = require('../internals/object-define-property');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var InternalStateModule = require('../internals/internal-state');
var inheritIfRequired = require('../internals/inherit-if-required');

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError = global.RangeError;
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataView = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_CONSTRUCTOR = ArrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore.TypedArray;
var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  aTypedArrayConstructor(C);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return isPrototypeOf(ArrayBufferPrototype, it) || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && !isSymbol(key)
    && key in target
    && isIntegralNumber(+key)
    && key >= 0;
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  key = toPropertyKey(key);
  return isTypedArrayIndex(target, key)
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  key = toPropertyKey(key);
  if (isTypedArrayIndex(target, key)
    && isObject(descriptor)
    && hasOwn(descriptor, 'value')
    && !hasOwn(descriptor, 'get')
    && !hasOwn(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!hasOwn(descriptor, 'writable') || descriptor.writable)
    && (!hasOwn(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (DESCRIPTORS) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  $({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructorPrototype);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return call(typedArrayFrom, TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructorPrototype);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return call(typedArrayFrom, TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_CONSTRUCTOR, TypedArrayConstructor);

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/typed-array-constructors-require-wrappers":"node_modules/core-js/internals/typed-array-constructors-require-wrappers.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/is-integral-number":"node_modules/core-js/internals/is-integral-number.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-index":"node_modules/core-js/internals/to-index.js","../internals/to-offset":"node_modules/core-js/internals/to-offset.js","../internals/to-property-key":"node_modules/core-js/internals/to-property-key.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/is-symbol":"node_modules/core-js/internals/is-symbol.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-is-prototype-of":"node_modules/core-js/internals/object-is-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/typed-array-from":"node_modules/core-js/internals/typed-array-from.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js"}],"node_modules/core-js/modules/es.typed-array.float32-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Float32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.float64-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Float64Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.int8-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.int16-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.int32-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint8-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint8-clamped-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8ClampedArray` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint16-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint32-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.at.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod('at', function at(index) {
  var O = aTypedArray(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-integer-or-infinity":"node_modules/core-js/internals/to-integer-or-infinity.js"}],"node_modules/core-js/modules/es.typed-array.copy-within.js":[function(require,module,exports) {
'use strict';
var uncurryThis = require('../internals/function-uncurry-this');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $ArrayCopyWithin = require('../internals/array-copy-within');

var u$ArrayCopyWithin = uncurryThis($ArrayCopyWithin);
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod('copyWithin', function copyWithin(target, start /* , end */) {
  return u$ArrayCopyWithin(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-copy-within":"node_modules/core-js/internals/array-copy-within.js"}],"node_modules/core-js/modules/es.typed-array.every.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $every = require('../internals/array-iteration').every;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod('every', function every(callbackfn /* , thisArg */) {
  return $every(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.fill.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var call = require('../internals/function-call');
var $fill = require('../internals/array-fill');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  var length = arguments.length;
  return call(
    $fill,
    aTypedArray(this),
    value,
    length > 1 ? arguments[1] : undefined,
    length > 2 ? arguments[2] : undefined
  );
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/array-fill":"node_modules/core-js/internals/array-fill.js"}],"node_modules/core-js/internals/array-from-constructor-and-list.js":[function(require,module,exports) {
module.exports = function (Constructor, list) {
  var index = 0;
  var length = list.length;
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};

},{}],"node_modules/core-js/internals/typed-array-species-constructor.js":[function(require,module,exports) {
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var speciesConstructor = require('../internals/species-constructor');

var TYPED_ARRAY_CONSTRUCTOR = ArrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;

// a part of `TypedArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#typedarray-species-create
module.exports = function (originalArray) {
  return aTypedArrayConstructor(speciesConstructor(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR]));
};

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js"}],"node_modules/core-js/internals/typed-array-from-species-and-list.js":[function(require,module,exports) {
var arrayFromConstructorAndList = require('../internals/array-from-constructor-and-list');
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');

module.exports = function (instance, list) {
  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
};

},{"../internals/array-from-constructor-and-list":"node_modules/core-js/internals/array-from-constructor-and-list.js","../internals/typed-array-species-constructor":"node_modules/core-js/internals/typed-array-species-constructor.js"}],"node_modules/core-js/modules/es.typed-array.filter.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $filter = require('../internals/array-iteration').filter;
var fromSpeciesAndList = require('../internals/typed-array-from-species-and-list');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList(this, list);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/typed-array-from-species-and-list":"node_modules/core-js/internals/typed-array-from-species-and-list.js"}],"node_modules/core-js/modules/es.typed-array.find.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $find = require('../internals/array-iteration').find;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod('find', function find(predicate /* , thisArg */) {
  return $find(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.find-index.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $findIndex = require('../internals/array-iteration').findIndex;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.for-each.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $forEach = require('../internals/array-iteration').forEach;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.from.js":[function(require,module,exports) {
'use strict';
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');
var exportTypedArrayStaticMethod = require('../internals/array-buffer-view-core').exportTypedArrayStaticMethod;
var typedArrayFrom = require('../internals/typed-array-from');

// `%TypedArray%.from` method
// https://tc39.es/ecma262/#sec-%typedarray%.from
exportTypedArrayStaticMethod('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

},{"../internals/typed-array-constructors-require-wrappers":"node_modules/core-js/internals/typed-array-constructors-require-wrappers.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/typed-array-from":"node_modules/core-js/internals/typed-array-from.js"}],"node_modules/core-js/modules/es.typed-array.includes.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $includes = require('../internals/array-includes').includes;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js"}],"node_modules/core-js/modules/es.typed-array.index-of.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $indexOf = require('../internals/array-includes').indexOf;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js"}],"node_modules/core-js/modules/es.typed-array.iterator.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ArrayIterators = require('../modules/es.array.iterator');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var Uint8Array = global.Uint8Array;
var arrayValues = uncurryThis(ArrayIterators.values);
var arrayKeys = uncurryThis(ArrayIterators.keys);
var arrayEntries = uncurryThis(ArrayIterators.entries);
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR];

var PROPER_ARRAY_VALUES_NAME = !!nativeTypedArrayIterator && nativeTypedArrayIterator.name === 'values';

var typedArrayValues = function values() {
  return arrayValues(aTypedArray(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod('entries', function entries() {
  return arrayEntries(aTypedArray(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod('keys', function keys() {
  return arrayKeys(aTypedArray(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod('values', typedArrayValues, PROPER_FUNCTION_NAME && !PROPER_ARRAY_VALUES_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod(ITERATOR, typedArrayValues, PROPER_FUNCTION_NAME && !PROPER_ARRAY_VALUES_NAME);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/function-name":"node_modules/core-js/internals/function-name.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.typed-array.join.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var uncurryThis = require('../internals/function-uncurry-this');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $join = uncurryThis([].join);

// `%TypedArray%.prototype.join` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
exportTypedArrayMethod('join', function join(separator) {
  return $join(aTypedArray(this), separator);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/modules/es.typed-array.last-index-of.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var apply = require('../internals/function-apply');
var $lastIndexOf = require('../internals/array-last-index-of');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
exportTypedArrayMethod('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  var length = arguments.length;
  return apply($lastIndexOf, aTypedArray(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/array-last-index-of":"node_modules/core-js/internals/array-last-index-of.js"}],"node_modules/core-js/modules/es.typed-array.map.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $map = require('../internals/array-iteration').map;
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (typedArraySpeciesConstructor(O))(length);
  });
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/typed-array-species-constructor":"node_modules/core-js/internals/typed-array-species-constructor.js"}],"node_modules/core-js/modules/es.typed-array.of.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');

var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayStaticMethod = ArrayBufferViewCore.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.es/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod('of', function of(/* ...items */) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/typed-array-constructors-require-wrappers":"node_modules/core-js/internals/typed-array-constructors-require-wrappers.js"}],"node_modules/core-js/modules/es.typed-array.reduce.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $reduce = require('../internals/array-reduce').left;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod('reduce', function reduce(callbackfn /* , initialValue */) {
  var length = arguments.length;
  return $reduce(aTypedArray(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js"}],"node_modules/core-js/modules/es.typed-array.reduce-right.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $reduceRight = require('../internals/array-reduce').right;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  var length = arguments.length;
  return $reduceRight(aTypedArray(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js"}],"node_modules/core-js/modules/es.typed-array.reverse.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var floor = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod('reverse', function reverse() {
  var that = this;
  var length = aTypedArray(that).length;
  var middle = floor(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/modules/es.typed-array.set.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toOffset = require('../internals/to-offset');
var toObject = require('../internals/to-object');
var fails = require('../internals/fails');

var RangeError = global.RangeError;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var FORCED = fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/length-of-array-like":"node_modules/core-js/internals/length-of-array-like.js","../internals/to-offset":"node_modules/core-js/internals/to-offset.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.typed-array.slice.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');
var fails = require('../internals/fails');
var arraySlice = require('../internals/array-slice');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var FORCED = fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod('slice', function slice(start, end) {
  var list = arraySlice(aTypedArray(this), start, end);
  var C = typedArraySpeciesConstructor(this);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/typed-array-species-constructor":"node_modules/core-js/internals/typed-array-species-constructor.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/modules/es.typed-array.some.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $some = require('../internals/array-iteration').some;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod('some', function some(callbackfn /* , thisArg */) {
  return $some(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.sort.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var aCallable = require('../internals/a-callable');
var internalSort = require('../internals/array-sort');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var FF = require('../internals/engine-ff-version');
var IE_OR_EDGE = require('../internals/engine-is-ie-or-edge');
var V8 = require('../internals/engine-v8-version');
var WEBKIT = require('../internals/engine-webkit-version');

var Array = global.Array;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = global.Uint16Array;
var un$Sort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!un$Sort && !(fails(function () {
  un$Sort(new Uint16Array(2), null);
}) && fails(function () {
  un$Sort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!un$Sort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  un$Sort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return un$Sort(this, comparefn);

  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/a-callable":"node_modules/core-js/internals/a-callable.js","../internals/array-sort":"node_modules/core-js/internals/array-sort.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/engine-ff-version":"node_modules/core-js/internals/engine-ff-version.js","../internals/engine-is-ie-or-edge":"node_modules/core-js/internals/engine-is-ie-or-edge.js","../internals/engine-v8-version":"node_modules/core-js/internals/engine-v8-version.js","../internals/engine-webkit-version":"node_modules/core-js/internals/engine-webkit-version.js"}],"node_modules/core-js/modules/es.typed-array.subarray.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod('subarray', function subarray(begin, end) {
  var O = aTypedArray(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  var C = typedArraySpeciesConstructor(O);
  return new C(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/typed-array-species-constructor":"node_modules/core-js/internals/typed-array-species-constructor.js"}],"node_modules/core-js/modules/es.typed-array.to-locale-string.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var apply = require('../internals/function-apply');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var fails = require('../internals/fails');
var arraySlice = require('../internals/array-slice');

var Int8Array = global.Int8Array;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array && fails(function () {
  $toLocaleString.call(new Int8Array(1));
});

var FORCED = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod('toLocaleString', function toLocaleString() {
  return apply(
    $toLocaleString,
    TO_LOCALE_STRING_BUG ? arraySlice(aTypedArray(this)) : aTypedArray(this),
    arraySlice(arguments)
  );
}, FORCED);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/modules/es.typed-array.to-string.js":[function(require,module,exports) {

'use strict';
var exportTypedArrayMethod = require('../internals/array-buffer-view-core').exportTypedArrayMethod;
var fails = require('../internals/fails');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');

var Uint8Array = global.Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
var arrayToString = [].toString;
var join = uncurryThis([].join);

if (fails(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return join(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/modules/es.unescape.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');

var fromCharCode = String.fromCharCode;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var stringSlice = uncurryThis(''.slice);

var hex2 = /^[\da-f]{2}$/i;
var hex4 = /^[\da-f]{4}$/i;

// `unescape` method
// https://tc39.es/ecma262/#sec-unescape-string
$({ global: true }, {
  unescape: function unescape(string) {
    var str = toString(string);
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, part;
    while (index < length) {
      chr = charAt(str, index++);
      if (chr === '%') {
        if (charAt(str, index) === 'u') {
          part = stringSlice(str, index + 1, index + 5);
          if (exec(hex4, part)) {
            result += fromCharCode(parseInt(part, 16));
            index += 5;
            continue;
          }
        } else {
          part = stringSlice(str, index, index + 2);
          if (exec(hex2, part)) {
            result += fromCharCode(parseInt(part, 16));
            index += 2;
            continue;
          }
        }
      }
      result += chr;
    } return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/to-string":"node_modules/core-js/internals/to-string.js"}],"node_modules/core-js/internals/collection-weak.js":[function(require,module,exports) {
var define;
'use strict';
var uncurryThis = require('../internals/function-uncurry-this');
var redefineAll = require('../internals/redefine-all');
var getWeakData = require('../internals/internal-metadata').getWeakData;
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var ArrayIterationModule = require('../internals/array-iteration');
var hasOwn = require('../internals/has-own-property');
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var find = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var splice = uncurryThis([].splice);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
  return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) splice(this.entries, index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: undefined
      });
      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    redefineAll(Prototype, {
      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && hasOwn(data, state.id) && delete data[state.id];
      },
      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
      // https://tc39.es/ecma262/#sec-weakset.prototype.has
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && hasOwn(data, state.id);
      }
    });

    redefineAll(Prototype, IS_MAP ? {
      // `WeakMap.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // `WeakMap.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // `WeakSet.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-weakset.prototype.add
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return Constructor;
  }
};

},{"../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.weak-map.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var redefineAll = require('../internals/redefine-all');
var InternalMetadataModule = require('../internals/internal-metadata');
var collection = require('../internals/collection');
var collectionWeak = require('../internals/collection-weak');
var isObject = require('../internals/is-object');
var isExtensible = require('../internals/object-is-extensible');
var enforceIternalState = require('../internals/internal-state').enforce;
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');

var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var InternalWeakMap;

var wrapper = function (init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.es/ecma262/#sec-weakmap-constructor
var $WeakMap = collection('WeakMap', wrapper, collectionWeak);

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  InternalMetadataModule.enable();
  var WeakMapPrototype = $WeakMap.prototype;
  var nativeDelete = uncurryThis(WeakMapPrototype['delete']);
  var nativeHas = uncurryThis(WeakMapPrototype.has);
  var nativeGet = uncurryThis(WeakMapPrototype.get);
  var nativeSet = uncurryThis(WeakMapPrototype.set);
  redefineAll(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete(this, key) || state.frozen['delete'](key);
      } return nativeDelete(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) || state.frozen.has(key);
      } return nativeHas(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
      } return nativeGet(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
      } else nativeSet(this, key, value);
      return this;
    }
  });
}

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-weak":"node_modules/core-js/internals/collection-weak.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-is-extensible":"node_modules/core-js/internals/object-is-extensible.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/native-weak-map":"node_modules/core-js/internals/native-weak-map.js"}],"node_modules/core-js/modules/es.weak-set.js":[function(require,module,exports) {
'use strict';
var collection = require('../internals/collection');
var collectionWeak = require('../internals/collection-weak');

// `WeakSet` constructor
// https://tc39.es/ecma262/#sec-weakset-constructor
collection('WeakSet', function (init) {
  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionWeak);

},{"../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-weak":"node_modules/core-js/internals/collection-weak.js"}],"node_modules/core-js/internals/dom-iterables.js":[function(require,module,exports) {
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],"node_modules/core-js/internals/dom-token-list-prototype.js":[function(require,module,exports) {
// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = require('../internals/document-create-element');

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

},{"../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js"}],"node_modules/core-js/modules/web.dom-collections.for-each.js":[function(require,module,exports) {

var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
var forEach = require('../internals/array-for-each');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/dom-iterables":"node_modules/core-js/internals/dom-iterables.js","../internals/dom-token-list-prototype":"node_modules/core-js/internals/dom-token-list-prototype.js","../internals/array-for-each":"node_modules/core-js/internals/array-for-each.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js"}],"node_modules/core-js/modules/web.dom-collections.iterator.js":[function(require,module,exports) {

var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/dom-iterables":"node_modules/core-js/internals/dom-iterables.js","../internals/dom-token-list-prototype":"node_modules/core-js/internals/dom-token-list-prototype.js","../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/web.immediate.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var task = require('../internals/task');

var FORCED = !global.setImmediate || !global.clearImmediate;

// http://w3c.github.io/setImmediate/
$({ global: true, bind: true, enumerable: true, forced: FORCED }, {
  // `setImmediate` method
  // http://w3c.github.io/setImmediate/#si-setImmediate
  setImmediate: task.set,
  // `clearImmediate` method
  // http://w3c.github.io/setImmediate/#si-clearImmediate
  clearImmediate: task.clear
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/task":"node_modules/core-js/internals/task.js"}],"node_modules/core-js/modules/web.queue-microtask.js":[function(require,module,exports) {


var $ = require('../internals/export');
var global = require('../internals/global');
var microtask = require('../internals/microtask');
var IS_NODE = require('../internals/engine-is-node');

var process = global.process;

// `queueMicrotask` method
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
$({ global: true, enumerable: true, noTargetGet: true }, {
  queueMicrotask: function queueMicrotask(fn) {
    var domain = IS_NODE && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/microtask":"node_modules/core-js/internals/microtask.js","../internals/engine-is-node":"node_modules/core-js/internals/engine-is-node.js"}],"node_modules/core-js/modules/web.timers.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var apply = require('../internals/function-apply');
var isCallable = require('../internals/is-callable');
var userAgent = require('../internals/engine-user-agent');
var arraySlice = require('../internals/array-slice');

var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var Function = global.Function;

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? arraySlice(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      apply(isCallable(handler) ? handler : Function(handler), this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-apply":"node_modules/core-js/internals/function-apply.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/engine-user-agent":"node_modules/core-js/internals/engine-user-agent.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js"}],"node_modules/core-js/internals/native-url.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/string-punycode-to-ascii.js":[function(require,module,exports) {

'use strict';
// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;

var RangeError = global.RangeError;
var exec = uncurryThis(regexSeparators.exec);
var floor = Math.floor;
var fromCharCode = String.fromCharCode;
var charCodeAt = uncurryThis(''.charCodeAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var split = uncurryThis(''.split);
var toLowerCase = uncurryThis(''.toLowerCase);

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = charCodeAt(string, counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = charCodeAt(string, counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        push(output, value);
        counter--;
      }
    } else {
      push(output, value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      push(output, fromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    push(output, delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        push(output, fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return join(output, '');
};

module.exports = function (input) {
  var encoded = [];
  var labels = split(replace(toLowerCase(input), regexSeparators, '\u002E'), '.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
  }
  return join(encoded, '.');
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js"}],"node_modules/core-js/modules/web.url-search-params.js":[function(require,module,exports) {

'use strict';
// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.array.iterator');
var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var USE_NATIVE_URL = require('../internals/native-url');
var redefine = require('../internals/redefine');
var redefineAll = require('../internals/redefine-all');
var setToStringTag = require('../internals/set-to-string-tag');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var InternalStateModule = require('../internals/internal-state');
var anInstance = require('../internals/an-instance');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var bind = require('../internals/function-bind-context');
var classof = require('../internals/classof');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var $toString = require('../internals/to-string');
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var wellKnownSymbol = require('../internals/well-known-symbol');
var arraySort = require('../internals/array-sort');

var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var n$Fetch = getBuiltIn('fetch');
var N$Request = getBuiltIn('Request');
var Headers = getBuiltIn('Headers');
var RequestPrototype = N$Request && N$Request.prototype;
var HeadersPrototype = Headers && Headers.prototype;
var RegExp = global.RegExp;
var TypeError = global.TypeError;
var decodeURIComponent = global.decodeURIComponent;
var encodeURIComponent = global.encodeURIComponent;
var charAt = uncurryThis(''.charAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var splice = uncurryThis([].splice);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = replace(it, plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = replace(result, percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replacements = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replacements[match];
};

var serialize = function (it) {
  return replace(encodeURIComponent(it), find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = split(query, '&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = split(attribute, '=');
        push(result, {
          key: deserialize(shift(entry)),
          value: deserialize(join(entry, '='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsPrototype);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (iteratorMethod) {
        iterator = getIterator(init, iteratorMethod);
        next = iterator.next;
        while (!(step = call(next, iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = call(entryNext, entryIterator)).done ||
            (second = call(entryNext, entryIterator)).done ||
            !call(entryNext, entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          push(entries, { key: $toString(first.value), value: $toString(second.value) });
        }
      } else for (key in init) if (hasOwn(init, key)) push(entries, { key: key, value: $toString(init[key]) });
    } else {
      parseSearchParams(
        entries,
        typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init)
      );
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    push(state.entries, { key: $toString(name), value: $toString(value) });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = $toString(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) splice(entries, index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) push(result, entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = $toString(name);
    var val = $toString(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) splice(entries, index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) push(entries, { key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    arraySort(state.entries, function (a, b) {
      return a.key > b.key ? 1 : -1;
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    push(result, serialize(entry.key) + '=' + serialize(entry.value));
  } return join(result, '&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!USE_NATIVE_URL && isCallable(Headers)) {
  var headersHas = uncurryThis(HeadersPrototype.has);
  var headersSet = uncurryThis(HeadersPrototype.set);

  var wrapRequestOptions = function (init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headersHas(headers, 'content-type')) {
          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return create(init, {
          body: createPropertyDescriptor(0, $toString(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (isCallable(n$Fetch)) {
    $({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return n$Fetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (isCallable(N$Request)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestPrototype);
      return new N$Request(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    $({ global: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

},{"../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/native-url":"node_modules/core-js/internals/native-url.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/create-iterator-constructor":"node_modules/core-js/internals/create-iterator-constructor.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/is-callable":"node_modules/core-js/internals/is-callable.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/get-iterator":"node_modules/core-js/internals/get-iterator.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/array-sort":"node_modules/core-js/internals/array-sort.js"}],"node_modules/core-js/modules/web.url.js":[function(require,module,exports) {

'use strict';
// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.string.iterator');
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var USE_NATIVE_URL = require('../internals/native-url');
var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var defineProperties = require('../internals/object-define-properties');
var redefine = require('../internals/redefine');
var anInstance = require('../internals/an-instance');
var hasOwn = require('../internals/has-own-property');
var assign = require('../internals/object-assign');
var arrayFrom = require('../internals/array-from');
var arraySlice = require('../internals/array-slice');
var codeAt = require('../internals/string-multibyte').codeAt;
var toASCII = require('../internals/string-punycode-to-ascii');
var $toString = require('../internals/to-string');
var setToStringTag = require('../internals/set-to-string-tag');
var URLSearchParamsModule = require('../modules/web.url-search-params');
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;

var NativeURL = global.URL;
var TypeError = global.TypeError;
var parseInt = global.parseInt;
var floor = Math.floor;
var pow = Math.pow;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var join = uncurryThis([].join);
var numberToString = uncurryThis(1.0.toString);
var pop = uncurryThis([].pop);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);
var toLowerCase = uncurryThis(''.toLowerCase);
var unshift = uncurryThis([].unshift);

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[a-z]/i;
// eslint-disable-next-line regexp/no-obscure-range -- safe
var ALPHANUMERIC = /[\d+-.a-z]/i;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\da-f]+$/i;
/* eslint-disable regexp/no-control-character -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
/* eslint-enable regexp/no-control-character -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (charAt(input, 0) == '[') {
    if (charAt(input, input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(stringSlice(input, 1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = toASCII(input);
    if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = split(input, '.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.length--;
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && charAt(part, 0) == '0') {
      radix = exec(HEX_START, part) ? 16 : 8;
      part = stringSlice(part, radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!exec(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) return input;
      number = parseInt(part, radix);
    }
    push(numbers, number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = pop(numbers);
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var chr = function () {
    return charAt(input, pointer);
  };

  if (chr() == ':') {
    if (charAt(input, 1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex == 8) return;
    if (chr() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && exec(HEX, chr())) {
      value = value * 16 + parseInt(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!exec(DIGIT, chr())) return;
        while (exec(DIGIT, chr())) {
          number = parseInt(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (chr() == ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      unshift(result, host % 256);
      host = floor(host / 256);
    } return join(result, '.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += numberToString(host[index], 16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (chr, set) {
  var code = codeAt(chr, 0);
  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return hasOwn(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && exec(ALPHA, charAt(string, 0))
    && ((second = charAt(string, 1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
    string.length == 2 ||
    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.length--;
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || toLowerCase(segment) === '%2e';
};

var isDoubleDot = function (segment) {
  segment = toLowerCase(segment);
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, chr, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = replace(input, LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = replace(input, TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    chr = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (chr && exec(ALPHA, chr)) {
          buffer += toLowerCase(chr);
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (chr && (exec(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
          buffer += toLowerCase(chr);
        } else if (chr == ':') {
          if (stateOverride && (
            (isSpecial(url) != hasOwn(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            push(url.path, '');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && chr == '#') {
          url.scheme = base.scheme;
          url.path = arraySlice(base.path);
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (chr == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (chr == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (chr == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = arraySlice(base.path);
          url.query = base.query;
        } else if (chr == '/' || (chr == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (chr == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = arraySlice(base.path);
          url.query = '';
          state = QUERY;
        } else if (chr == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = arraySlice(base.path);
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = arraySlice(base.path);
          url.path.length--;
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (chr == '/' || chr == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (chr == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (chr != '/' || charAt(buffer, pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (chr != '/' && chr != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (chr == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
          (chr == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += chr;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (chr == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
          (chr == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (chr == '[') seenBracket = true;
          else if (chr == ']') seenBracket = false;
          buffer += chr;
        } break;

      case PORT:
        if (exec(DIGIT, chr)) {
          buffer += chr;
        } else if (
          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
          (chr == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (chr == '/' || chr == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (chr == EOF) {
            url.host = base.host;
            url.path = arraySlice(base.path);
            url.query = base.query;
          } else if (chr == '?') {
            url.host = base.host;
            url.path = arraySlice(base.path);
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.host = base.host;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
              url.host = base.host;
              url.path = arraySlice(base.path);
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (chr == '/' || chr == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
          if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += chr;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (chr != '/' && chr != '\\') continue;
        } else if (!stateOverride && chr == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && chr == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (chr != EOF) {
          state = PATH;
          if (chr != '/') continue;
        } break;

      case PATH:
        if (
          chr == EOF || chr == '/' ||
          (chr == '\\' && isSpecial(url)) ||
          (!stateOverride && (chr == '?' || chr == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (chr != '/' && !(chr == '\\' && isSpecial(url))) {
              push(url.path, '');
            }
          } else if (isSingleDot(buffer)) {
            if (chr != '/' && !(chr == '\\' && isSpecial(url))) {
              push(url.path, '');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
            }
            push(url.path, buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              shift(url.path);
            }
          }
          if (chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(chr, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (chr == '?') {
          url.query = '';
          state = QUERY;
        } else if (chr == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (chr != EOF) {
          url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && chr == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (chr != EOF) {
          if (chr == "'" && isSpecial(url)) url.query += '%27';
          else if (chr == '#') url.query += '%23';
          else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLPrototype);
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = $toString(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    try {
      baseState = getInternalURLState(base);
    } catch (error) {
      failure = parseURL(baseState = {}, $toString(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = $toString(searchParams) || null;
  };
  if (!DESCRIPTORS) {
    that.href = call(serializeURL, that);
    that.origin = call(getOrigin, that);
    that.protocol = call(getProtocol, that);
    that.username = call(getUsername, that);
    that.password = call(getPassword, that);
    that.host = call(getHost, that);
    that.hostname = call(getHostname, that);
    that.port = call(getPort, that);
    that.pathname = call(getPathname, that);
    that.search = call(getSearch, that);
    that.searchParams = call(getSearchParams, that);
    that.hash = call(getHash, that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URLConstructor(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : $toString(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = $toString(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, $toString(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom($toString(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom($toString(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, $toString(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, $toString(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = $toString(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, $toString(pathname), PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = $toString(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == charAt(search, 0)) search = stringSlice(search, 1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = $toString(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == charAt(hash, 0)) hash = stringSlice(hash, 1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return call(serializeURL, this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return call(serializeURL, this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});

},{"../modules/es.string.iterator":"node_modules/core-js/modules/es.string.iterator.js","../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/native-url":"node_modules/core-js/internals/native-url.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/function-bind-context":"node_modules/core-js/internals/function-bind-context.js","../internals/function-call":"node_modules/core-js/internals/function-call.js","../internals/function-uncurry-this":"node_modules/core-js/internals/function-uncurry-this.js","../internals/object-define-properties":"node_modules/core-js/internals/object-define-properties.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/has-own-property":"node_modules/core-js/internals/has-own-property.js","../internals/object-assign":"node_modules/core-js/internals/object-assign.js","../internals/array-from":"node_modules/core-js/internals/array-from.js","../internals/array-slice":"node_modules/core-js/internals/array-slice.js","../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js","../internals/string-punycode-to-ascii":"node_modules/core-js/internals/string-punycode-to-ascii.js","../internals/to-string":"node_modules/core-js/internals/to-string.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../modules/web.url-search-params":"node_modules/core-js/modules/web.url-search-params.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/web.url.to-json.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return call(URL.prototype.toString, this);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-call":"node_modules/core-js/internals/function-call.js"}],"node_modules/core-js/stable/index.js":[function(require,module,exports) {
require('../modules/es.symbol');
require('../modules/es.symbol.description');
require('../modules/es.symbol.async-iterator');
require('../modules/es.symbol.has-instance');
require('../modules/es.symbol.is-concat-spreadable');
require('../modules/es.symbol.iterator');
require('../modules/es.symbol.match');
require('../modules/es.symbol.match-all');
require('../modules/es.symbol.replace');
require('../modules/es.symbol.search');
require('../modules/es.symbol.species');
require('../modules/es.symbol.split');
require('../modules/es.symbol.to-primitive');
require('../modules/es.symbol.to-string-tag');
require('../modules/es.symbol.unscopables');
require('../modules/es.aggregate-error');
require('../modules/es.array.at');
require('../modules/es.array.concat');
require('../modules/es.array.copy-within');
require('../modules/es.array.every');
require('../modules/es.array.fill');
require('../modules/es.array.filter');
require('../modules/es.array.find');
require('../modules/es.array.find-index');
require('../modules/es.array.flat');
require('../modules/es.array.flat-map');
require('../modules/es.array.for-each');
require('../modules/es.array.from');
require('../modules/es.array.includes');
require('../modules/es.array.index-of');
require('../modules/es.array.is-array');
require('../modules/es.array.iterator');
require('../modules/es.array.join');
require('../modules/es.array.last-index-of');
require('../modules/es.array.map');
require('../modules/es.array.of');
require('../modules/es.array.reduce');
require('../modules/es.array.reduce-right');
require('../modules/es.array.reverse');
require('../modules/es.array.slice');
require('../modules/es.array.some');
require('../modules/es.array.sort');
require('../modules/es.array.species');
require('../modules/es.array.splice');
require('../modules/es.array.unscopables.flat');
require('../modules/es.array.unscopables.flat-map');
require('../modules/es.array-buffer.constructor');
require('../modules/es.array-buffer.is-view');
require('../modules/es.array-buffer.slice');
require('../modules/es.data-view');
require('../modules/es.date.get-year');
require('../modules/es.date.now');
require('../modules/es.date.set-year');
require('../modules/es.date.to-gmt-string');
require('../modules/es.date.to-iso-string');
require('../modules/es.date.to-json');
require('../modules/es.date.to-primitive');
require('../modules/es.date.to-string');
require('../modules/es.escape');
require('../modules/es.function.bind');
require('../modules/es.function.has-instance');
require('../modules/es.function.name');
require('../modules/es.global-this');
require('../modules/es.json.stringify');
require('../modules/es.json.to-string-tag');
require('../modules/es.map');
require('../modules/es.math.acosh');
require('../modules/es.math.asinh');
require('../modules/es.math.atanh');
require('../modules/es.math.cbrt');
require('../modules/es.math.clz32');
require('../modules/es.math.cosh');
require('../modules/es.math.expm1');
require('../modules/es.math.fround');
require('../modules/es.math.hypot');
require('../modules/es.math.imul');
require('../modules/es.math.log10');
require('../modules/es.math.log1p');
require('../modules/es.math.log2');
require('../modules/es.math.sign');
require('../modules/es.math.sinh');
require('../modules/es.math.tanh');
require('../modules/es.math.to-string-tag');
require('../modules/es.math.trunc');
require('../modules/es.number.constructor');
require('../modules/es.number.epsilon');
require('../modules/es.number.is-finite');
require('../modules/es.number.is-integer');
require('../modules/es.number.is-nan');
require('../modules/es.number.is-safe-integer');
require('../modules/es.number.max-safe-integer');
require('../modules/es.number.min-safe-integer');
require('../modules/es.number.parse-float');
require('../modules/es.number.parse-int');
require('../modules/es.number.to-fixed');
require('../modules/es.number.to-precision');
require('../modules/es.object.assign');
require('../modules/es.object.create');
require('../modules/es.object.define-getter');
require('../modules/es.object.define-properties');
require('../modules/es.object.define-property');
require('../modules/es.object.define-setter');
require('../modules/es.object.entries');
require('../modules/es.object.freeze');
require('../modules/es.object.from-entries');
require('../modules/es.object.get-own-property-descriptor');
require('../modules/es.object.get-own-property-descriptors');
require('../modules/es.object.get-own-property-names');
require('../modules/es.object.get-prototype-of');
require('../modules/es.object.has-own');
require('../modules/es.object.is');
require('../modules/es.object.is-extensible');
require('../modules/es.object.is-frozen');
require('../modules/es.object.is-sealed');
require('../modules/es.object.keys');
require('../modules/es.object.lookup-getter');
require('../modules/es.object.lookup-setter');
require('../modules/es.object.prevent-extensions');
require('../modules/es.object.seal');
require('../modules/es.object.set-prototype-of');
require('../modules/es.object.to-string');
require('../modules/es.object.values');
require('../modules/es.parse-float');
require('../modules/es.parse-int');
require('../modules/es.promise');
require('../modules/es.promise.all-settled');
require('../modules/es.promise.any');
require('../modules/es.promise.finally');
require('../modules/es.reflect.apply');
require('../modules/es.reflect.construct');
require('../modules/es.reflect.define-property');
require('../modules/es.reflect.delete-property');
require('../modules/es.reflect.get');
require('../modules/es.reflect.get-own-property-descriptor');
require('../modules/es.reflect.get-prototype-of');
require('../modules/es.reflect.has');
require('../modules/es.reflect.is-extensible');
require('../modules/es.reflect.own-keys');
require('../modules/es.reflect.prevent-extensions');
require('../modules/es.reflect.set');
require('../modules/es.reflect.set-prototype-of');
require('../modules/es.reflect.to-string-tag');
require('../modules/es.regexp.constructor');
require('../modules/es.regexp.dot-all');
require('../modules/es.regexp.exec');
require('../modules/es.regexp.flags');
require('../modules/es.regexp.sticky');
require('../modules/es.regexp.test');
require('../modules/es.regexp.to-string');
require('../modules/es.set');
require('../modules/es.string.at-alternative');
require('../modules/es.string.code-point-at');
require('../modules/es.string.ends-with');
require('../modules/es.string.from-code-point');
require('../modules/es.string.includes');
require('../modules/es.string.iterator');
require('../modules/es.string.match');
require('../modules/es.string.match-all');
require('../modules/es.string.pad-end');
require('../modules/es.string.pad-start');
require('../modules/es.string.raw');
require('../modules/es.string.repeat');
require('../modules/es.string.replace');
require('../modules/es.string.replace-all');
require('../modules/es.string.search');
require('../modules/es.string.split');
require('../modules/es.string.starts-with');
require('../modules/es.string.substr');
require('../modules/es.string.trim');
require('../modules/es.string.trim-end');
require('../modules/es.string.trim-start');
require('../modules/es.string.anchor');
require('../modules/es.string.big');
require('../modules/es.string.blink');
require('../modules/es.string.bold');
require('../modules/es.string.fixed');
require('../modules/es.string.fontcolor');
require('../modules/es.string.fontsize');
require('../modules/es.string.italics');
require('../modules/es.string.link');
require('../modules/es.string.small');
require('../modules/es.string.strike');
require('../modules/es.string.sub');
require('../modules/es.string.sup');
require('../modules/es.typed-array.float32-array');
require('../modules/es.typed-array.float64-array');
require('../modules/es.typed-array.int8-array');
require('../modules/es.typed-array.int16-array');
require('../modules/es.typed-array.int32-array');
require('../modules/es.typed-array.uint8-array');
require('../modules/es.typed-array.uint8-clamped-array');
require('../modules/es.typed-array.uint16-array');
require('../modules/es.typed-array.uint32-array');
require('../modules/es.typed-array.at');
require('../modules/es.typed-array.copy-within');
require('../modules/es.typed-array.every');
require('../modules/es.typed-array.fill');
require('../modules/es.typed-array.filter');
require('../modules/es.typed-array.find');
require('../modules/es.typed-array.find-index');
require('../modules/es.typed-array.for-each');
require('../modules/es.typed-array.from');
require('../modules/es.typed-array.includes');
require('../modules/es.typed-array.index-of');
require('../modules/es.typed-array.iterator');
require('../modules/es.typed-array.join');
require('../modules/es.typed-array.last-index-of');
require('../modules/es.typed-array.map');
require('../modules/es.typed-array.of');
require('../modules/es.typed-array.reduce');
require('../modules/es.typed-array.reduce-right');
require('../modules/es.typed-array.reverse');
require('../modules/es.typed-array.set');
require('../modules/es.typed-array.slice');
require('../modules/es.typed-array.some');
require('../modules/es.typed-array.sort');
require('../modules/es.typed-array.subarray');
require('../modules/es.typed-array.to-locale-string');
require('../modules/es.typed-array.to-string');
require('../modules/es.unescape');
require('../modules/es.weak-map');
require('../modules/es.weak-set');
require('../modules/web.dom-collections.for-each');
require('../modules/web.dom-collections.iterator');
require('../modules/web.immediate');
require('../modules/web.queue-microtask');
require('../modules/web.timers');
require('../modules/web.url');
require('../modules/web.url.to-json');
require('../modules/web.url-search-params');

module.exports = require('../internals/path');

},{"../modules/es.symbol":"node_modules/core-js/modules/es.symbol.js","../modules/es.symbol.description":"node_modules/core-js/modules/es.symbol.description.js","../modules/es.symbol.async-iterator":"node_modules/core-js/modules/es.symbol.async-iterator.js","../modules/es.symbol.has-instance":"node_modules/core-js/modules/es.symbol.has-instance.js","../modules/es.symbol.is-concat-spreadable":"node_modules/core-js/modules/es.symbol.is-concat-spreadable.js","../modules/es.symbol.iterator":"node_modules/core-js/modules/es.symbol.iterator.js","../modules/es.symbol.match":"node_modules/core-js/modules/es.symbol.match.js","../modules/es.symbol.match-all":"node_modules/core-js/modules/es.symbol.match-all.js","../modules/es.symbol.replace":"node_modules/core-js/modules/es.symbol.replace.js","../modules/es.symbol.search":"node_modules/core-js/modules/es.symbol.search.js","../modules/es.symbol.species":"node_modules/core-js/modules/es.symbol.species.js","../modules/es.symbol.split":"node_modules/core-js/modules/es.symbol.split.js","../modules/es.symbol.to-primitive":"node_modules/core-js/modules/es.symbol.to-primitive.js","../modules/es.symbol.to-string-tag":"node_modules/core-js/modules/es.symbol.to-string-tag.js","../modules/es.symbol.unscopables":"node_modules/core-js/modules/es.symbol.unscopables.js","../modules/es.aggregate-error":"node_modules/core-js/modules/es.aggregate-error.js","../modules/es.array.at":"node_modules/core-js/modules/es.array.at.js","../modules/es.array.concat":"node_modules/core-js/modules/es.array.concat.js","../modules/es.array.copy-within":"node_modules/core-js/modules/es.array.copy-within.js","../modules/es.array.every":"node_modules/core-js/modules/es.array.every.js","../modules/es.array.fill":"node_modules/core-js/modules/es.array.fill.js","../modules/es.array.filter":"node_modules/core-js/modules/es.array.filter.js","../modules/es.array.find":"node_modules/core-js/modules/es.array.find.js","../modules/es.array.find-index":"node_modules/core-js/modules/es.array.find-index.js","../modules/es.array.flat":"node_modules/core-js/modules/es.array.flat.js","../modules/es.array.flat-map":"node_modules/core-js/modules/es.array.flat-map.js","../modules/es.array.for-each":"node_modules/core-js/modules/es.array.for-each.js","../modules/es.array.from":"node_modules/core-js/modules/es.array.from.js","../modules/es.array.includes":"node_modules/core-js/modules/es.array.includes.js","../modules/es.array.index-of":"node_modules/core-js/modules/es.array.index-of.js","../modules/es.array.is-array":"node_modules/core-js/modules/es.array.is-array.js","../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../modules/es.array.join":"node_modules/core-js/modules/es.array.join.js","../modules/es.array.last-index-of":"node_modules/core-js/modules/es.array.last-index-of.js","../modules/es.array.map":"node_modules/core-js/modules/es.array.map.js","../modules/es.array.of":"node_modules/core-js/modules/es.array.of.js","../modules/es.array.reduce":"node_modules/core-js/modules/es.array.reduce.js","../modules/es.array.reduce-right":"node_modules/core-js/modules/es.array.reduce-right.js","../modules/es.array.reverse":"node_modules/core-js/modules/es.array.reverse.js","../modules/es.array.slice":"node_modules/core-js/modules/es.array.slice.js","../modules/es.array.some":"node_modules/core-js/modules/es.array.some.js","../modules/es.array.sort":"node_modules/core-js/modules/es.array.sort.js","../modules/es.array.species":"node_modules/core-js/modules/es.array.species.js","../modules/es.array.splice":"node_modules/core-js/modules/es.array.splice.js","../modules/es.array.unscopables.flat":"node_modules/core-js/modules/es.array.unscopables.flat.js","../modules/es.array.unscopables.flat-map":"node_modules/core-js/modules/es.array.unscopables.flat-map.js","../modules/es.array-buffer.constructor":"node_modules/core-js/modules/es.array-buffer.constructor.js","../modules/es.array-buffer.is-view":"node_modules/core-js/modules/es.array-buffer.is-view.js","../modules/es.array-buffer.slice":"node_modules/core-js/modules/es.array-buffer.slice.js","../modules/es.data-view":"node_modules/core-js/modules/es.data-view.js","../modules/es.date.get-year":"node_modules/core-js/modules/es.date.get-year.js","../modules/es.date.now":"node_modules/core-js/modules/es.date.now.js","../modules/es.date.set-year":"node_modules/core-js/modules/es.date.set-year.js","../modules/es.date.to-gmt-string":"node_modules/core-js/modules/es.date.to-gmt-string.js","../modules/es.date.to-iso-string":"node_modules/core-js/modules/es.date.to-iso-string.js","../modules/es.date.to-json":"node_modules/core-js/modules/es.date.to-json.js","../modules/es.date.to-primitive":"node_modules/core-js/modules/es.date.to-primitive.js","../modules/es.date.to-string":"node_modules/core-js/modules/es.date.to-string.js","../modules/es.escape":"node_modules/core-js/modules/es.escape.js","../modules/es.function.bind":"node_modules/core-js/modules/es.function.bind.js","../modules/es.function.has-instance":"node_modules/core-js/modules/es.function.has-instance.js","../modules/es.function.name":"node_modules/core-js/modules/es.function.name.js","../modules/es.global-this":"node_modules/core-js/modules/es.global-this.js","../modules/es.json.stringify":"node_modules/core-js/modules/es.json.stringify.js","../modules/es.json.to-string-tag":"node_modules/core-js/modules/es.json.to-string-tag.js","../modules/es.map":"node_modules/core-js/modules/es.map.js","../modules/es.math.acosh":"node_modules/core-js/modules/es.math.acosh.js","../modules/es.math.asinh":"node_modules/core-js/modules/es.math.asinh.js","../modules/es.math.atanh":"node_modules/core-js/modules/es.math.atanh.js","../modules/es.math.cbrt":"node_modules/core-js/modules/es.math.cbrt.js","../modules/es.math.clz32":"node_modules/core-js/modules/es.math.clz32.js","../modules/es.math.cosh":"node_modules/core-js/modules/es.math.cosh.js","../modules/es.math.expm1":"node_modules/core-js/modules/es.math.expm1.js","../modules/es.math.fround":"node_modules/core-js/modules/es.math.fround.js","../modules/es.math.hypot":"node_modules/core-js/modules/es.math.hypot.js","../modules/es.math.imul":"node_modules/core-js/modules/es.math.imul.js","../modules/es.math.log10":"node_modules/core-js/modules/es.math.log10.js","../modules/es.math.log1p":"node_modules/core-js/modules/es.math.log1p.js","../modules/es.math.log2":"node_modules/core-js/modules/es.math.log2.js","../modules/es.math.sign":"node_modules/core-js/modules/es.math.sign.js","../modules/es.math.sinh":"node_modules/core-js/modules/es.math.sinh.js","../modules/es.math.tanh":"node_modules/core-js/modules/es.math.tanh.js","../modules/es.math.to-string-tag":"node_modules/core-js/modules/es.math.to-string-tag.js","../modules/es.math.trunc":"node_modules/core-js/modules/es.math.trunc.js","../modules/es.number.constructor":"node_modules/core-js/modules/es.number.constructor.js","../modules/es.number.epsilon":"node_modules/core-js/modules/es.number.epsilon.js","../modules/es.number.is-finite":"node_modules/core-js/modules/es.number.is-finite.js","../modules/es.number.is-integer":"node_modules/core-js/modules/es.number.is-integer.js","../modules/es.number.is-nan":"node_modules/core-js/modules/es.number.is-nan.js","../modules/es.number.is-safe-integer":"node_modules/core-js/modules/es.number.is-safe-integer.js","../modules/es.number.max-safe-integer":"node_modules/core-js/modules/es.number.max-safe-integer.js","../modules/es.number.min-safe-integer":"node_modules/core-js/modules/es.number.min-safe-integer.js","../modules/es.number.parse-float":"node_modules/core-js/modules/es.number.parse-float.js","../modules/es.number.parse-int":"node_modules/core-js/modules/es.number.parse-int.js","../modules/es.number.to-fixed":"node_modules/core-js/modules/es.number.to-fixed.js","../modules/es.number.to-precision":"node_modules/core-js/modules/es.number.to-precision.js","../modules/es.object.assign":"node_modules/core-js/modules/es.object.assign.js","../modules/es.object.create":"node_modules/core-js/modules/es.object.create.js","../modules/es.object.define-getter":"node_modules/core-js/modules/es.object.define-getter.js","../modules/es.object.define-properties":"node_modules/core-js/modules/es.object.define-properties.js","../modules/es.object.define-property":"node_modules/core-js/modules/es.object.define-property.js","../modules/es.object.define-setter":"node_modules/core-js/modules/es.object.define-setter.js","../modules/es.object.entries":"node_modules/core-js/modules/es.object.entries.js","../modules/es.object.freeze":"node_modules/core-js/modules/es.object.freeze.js","../modules/es.object.from-entries":"node_modules/core-js/modules/es.object.from-entries.js","../modules/es.object.get-own-property-descriptor":"node_modules/core-js/modules/es.object.get-own-property-descriptor.js","../modules/es.object.get-own-property-descriptors":"node_modules/core-js/modules/es.object.get-own-property-descriptors.js","../modules/es.object.get-own-property-names":"node_modules/core-js/modules/es.object.get-own-property-names.js","../modules/es.object.get-prototype-of":"node_modules/core-js/modules/es.object.get-prototype-of.js","../modules/es.object.has-own":"node_modules/core-js/modules/es.object.has-own.js","../modules/es.object.is":"node_modules/core-js/modules/es.object.is.js","../modules/es.object.is-extensible":"node_modules/core-js/modules/es.object.is-extensible.js","../modules/es.object.is-frozen":"node_modules/core-js/modules/es.object.is-frozen.js","../modules/es.object.is-sealed":"node_modules/core-js/modules/es.object.is-sealed.js","../modules/es.object.keys":"node_modules/core-js/modules/es.object.keys.js","../modules/es.object.lookup-getter":"node_modules/core-js/modules/es.object.lookup-getter.js","../modules/es.object.lookup-setter":"node_modules/core-js/modules/es.object.lookup-setter.js","../modules/es.object.prevent-extensions":"node_modules/core-js/modules/es.object.prevent-extensions.js","../modules/es.object.seal":"node_modules/core-js/modules/es.object.seal.js","../modules/es.object.set-prototype-of":"node_modules/core-js/modules/es.object.set-prototype-of.js","../modules/es.object.to-string":"node_modules/core-js/modules/es.object.to-string.js","../modules/es.object.values":"node_modules/core-js/modules/es.object.values.js","../modules/es.parse-float":"node_modules/core-js/modules/es.parse-float.js","../modules/es.parse-int":"node_modules/core-js/modules/es.parse-int.js","../modules/es.promise":"node_modules/core-js/modules/es.promise.js","../modules/es.promise.all-settled":"node_modules/core-js/modules/es.promise.all-settled.js","../modules/es.promise.any":"node_modules/core-js/modules/es.promise.any.js","../modules/es.promise.finally":"node_modules/core-js/modules/es.promise.finally.js","../modules/es.reflect.apply":"node_modules/core-js/modules/es.reflect.apply.js","../modules/es.reflect.construct":"node_modules/core-js/modules/es.reflect.construct.js","../modules/es.reflect.define-property":"node_modules/core-js/modules/es.reflect.define-property.js","../modules/es.reflect.delete-property":"node_modules/core-js/modules/es.reflect.delete-property.js","../modules/es.reflect.get":"node_modules/core-js/modules/es.reflect.get.js","../modules/es.reflect.get-own-property-descriptor":"node_modules/core-js/modules/es.reflect.get-own-property-descriptor.js","../modules/es.reflect.get-prototype-of":"node_modules/core-js/modules/es.reflect.get-prototype-of.js","../modules/es.reflect.has":"node_modules/core-js/modules/es.reflect.has.js","../modules/es.reflect.is-extensible":"node_modules/core-js/modules/es.reflect.is-extensible.js","../modules/es.reflect.own-keys":"node_modules/core-js/modules/es.reflect.own-keys.js","../modules/es.reflect.prevent-extensions":"node_modules/core-js/modules/es.reflect.prevent-extensions.js","../modules/es.reflect.set":"node_modules/core-js/modules/es.reflect.set.js","../modules/es.reflect.set-prototype-of":"node_modules/core-js/modules/es.reflect.set-prototype-of.js","../modules/es.reflect.to-string-tag":"node_modules/core-js/modules/es.reflect.to-string-tag.js","../modules/es.regexp.constructor":"node_modules/core-js/modules/es.regexp.constructor.js","../modules/es.regexp.dot-all":"node_modules/core-js/modules/es.regexp.dot-all.js","../modules/es.regexp.exec":"node_modules/core-js/modules/es.regexp.exec.js","../modules/es.regexp.flags":"node_modules/core-js/modules/es.regexp.flags.js","../modules/es.regexp.sticky":"node_modules/core-js/modules/es.regexp.sticky.js","../modules/es.regexp.test":"node_modules/core-js/modules/es.regexp.test.js","../modules/es.regexp.to-string":"node_modules/core-js/modules/es.regexp.to-string.js","../modules/es.set":"node_modules/core-js/modules/es.set.js","../modules/es.string.at-alternative":"node_modules/core-js/modules/es.string.at-alternative.js","../modules/es.string.code-point-at":"node_modules/core-js/modules/es.string.code-point-at.js","../modules/es.string.ends-with":"node_modules/core-js/modules/es.string.ends-with.js","../modules/es.string.from-code-point":"node_modules/core-js/modules/es.string.from-code-point.js","../modules/es.string.includes":"node_modules/core-js/modules/es.string.includes.js","../modules/es.string.iterator":"node_modules/core-js/modules/es.string.iterator.js","../modules/es.string.match":"node_modules/core-js/modules/es.string.match.js","../modules/es.string.match-all":"node_modules/core-js/modules/es.string.match-all.js","../modules/es.string.pad-end":"node_modules/core-js/modules/es.string.pad-end.js","../modules/es.string.pad-start":"node_modules/core-js/modules/es.string.pad-start.js","../modules/es.string.raw":"node_modules/core-js/modules/es.string.raw.js","../modules/es.string.repeat":"node_modules/core-js/modules/es.string.repeat.js","../modules/es.string.replace":"node_modules/core-js/modules/es.string.replace.js","../modules/es.string.replace-all":"node_modules/core-js/modules/es.string.replace-all.js","../modules/es.string.search":"node_modules/core-js/modules/es.string.search.js","../modules/es.string.split":"node_modules/core-js/modules/es.string.split.js","../modules/es.string.starts-with":"node_modules/core-js/modules/es.string.starts-with.js","../modules/es.string.substr":"node_modules/core-js/modules/es.string.substr.js","../modules/es.string.trim":"node_modules/core-js/modules/es.string.trim.js","../modules/es.string.trim-end":"node_modules/core-js/modules/es.string.trim-end.js","../modules/es.string.trim-start":"node_modules/core-js/modules/es.string.trim-start.js","../modules/es.string.anchor":"node_modules/core-js/modules/es.string.anchor.js","../modules/es.string.big":"node_modules/core-js/modules/es.string.big.js","../modules/es.string.blink":"node_modules/core-js/modules/es.string.blink.js","../modules/es.string.bold":"node_modules/core-js/modules/es.string.bold.js","../modules/es.string.fixed":"node_modules/core-js/modules/es.string.fixed.js","../modules/es.string.fontcolor":"node_modules/core-js/modules/es.string.fontcolor.js","../modules/es.string.fontsize":"node_modules/core-js/modules/es.string.fontsize.js","../modules/es.string.italics":"node_modules/core-js/modules/es.string.italics.js","../modules/es.string.link":"node_modules/core-js/modules/es.string.link.js","../modules/es.string.small":"node_modules/core-js/modules/es.string.small.js","../modules/es.string.strike":"node_modules/core-js/modules/es.string.strike.js","../modules/es.string.sub":"node_modules/core-js/modules/es.string.sub.js","../modules/es.string.sup":"node_modules/core-js/modules/es.string.sup.js","../modules/es.typed-array.float32-array":"node_modules/core-js/modules/es.typed-array.float32-array.js","../modules/es.typed-array.float64-array":"node_modules/core-js/modules/es.typed-array.float64-array.js","../modules/es.typed-array.int8-array":"node_modules/core-js/modules/es.typed-array.int8-array.js","../modules/es.typed-array.int16-array":"node_modules/core-js/modules/es.typed-array.int16-array.js","../modules/es.typed-array.int32-array":"node_modules/core-js/modules/es.typed-array.int32-array.js","../modules/es.typed-array.uint8-array":"node_modules/core-js/modules/es.typed-array.uint8-array.js","../modules/es.typed-array.uint8-clamped-array":"node_modules/core-js/modules/es.typed-array.uint8-clamped-array.js","../modules/es.typed-array.uint16-array":"node_modules/core-js/modules/es.typed-array.uint16-array.js","../modules/es.typed-array.uint32-array":"node_modules/core-js/modules/es.typed-array.uint32-array.js","../modules/es.typed-array.at":"node_modules/core-js/modules/es.typed-array.at.js","../modules/es.typed-array.copy-within":"node_modules/core-js/modules/es.typed-array.copy-within.js","../modules/es.typed-array.every":"node_modules/core-js/modules/es.typed-array.every.js","../modules/es.typed-array.fill":"node_modules/core-js/modules/es.typed-array.fill.js","../modules/es.typed-array.filter":"node_modules/core-js/modules/es.typed-array.filter.js","../modules/es.typed-array.find":"node_modules/core-js/modules/es.typed-array.find.js","../modules/es.typed-array.find-index":"node_modules/core-js/modules/es.typed-array.find-index.js","../modules/es.typed-array.for-each":"node_modules/core-js/modules/es.typed-array.for-each.js","../modules/es.typed-array.from":"node_modules/core-js/modules/es.typed-array.from.js","../modules/es.typed-array.includes":"node_modules/core-js/modules/es.typed-array.includes.js","../modules/es.typed-array.index-of":"node_modules/core-js/modules/es.typed-array.index-of.js","../modules/es.typed-array.iterator":"node_modules/core-js/modules/es.typed-array.iterator.js","../modules/es.typed-array.join":"node_modules/core-js/modules/es.typed-array.join.js","../modules/es.typed-array.last-index-of":"node_modules/core-js/modules/es.typed-array.last-index-of.js","../modules/es.typed-array.map":"node_modules/core-js/modules/es.typed-array.map.js","../modules/es.typed-array.of":"node_modules/core-js/modules/es.typed-array.of.js","../modules/es.typed-array.reduce":"node_modules/core-js/modules/es.typed-array.reduce.js","../modules/es.typed-array.reduce-right":"node_modules/core-js/modules/es.typed-array.reduce-right.js","../modules/es.typed-array.reverse":"node_modules/core-js/modules/es.typed-array.reverse.js","../modules/es.typed-array.set":"node_modules/core-js/modules/es.typed-array.set.js","../modules/es.typed-array.slice":"node_modules/core-js/modules/es.typed-array.slice.js","../modules/es.typed-array.some":"node_modules/core-js/modules/es.typed-array.some.js","../modules/es.typed-array.sort":"node_modules/core-js/modules/es.typed-array.sort.js","../modules/es.typed-array.subarray":"node_modules/core-js/modules/es.typed-array.subarray.js","../modules/es.typed-array.to-locale-string":"node_modules/core-js/modules/es.typed-array.to-locale-string.js","../modules/es.typed-array.to-string":"node_modules/core-js/modules/es.typed-array.to-string.js","../modules/es.unescape":"node_modules/core-js/modules/es.unescape.js","../modules/es.weak-map":"node_modules/core-js/modules/es.weak-map.js","../modules/es.weak-set":"node_modules/core-js/modules/es.weak-set.js","../modules/web.dom-collections.for-each":"node_modules/core-js/modules/web.dom-collections.for-each.js","../modules/web.dom-collections.iterator":"node_modules/core-js/modules/web.dom-collections.iterator.js","../modules/web.immediate":"node_modules/core-js/modules/web.immediate.js","../modules/web.queue-microtask":"node_modules/core-js/modules/web.queue-microtask.js","../modules/web.timers":"node_modules/core-js/modules/web.timers.js","../modules/web.url":"node_modules/core-js/modules/web.url.js","../modules/web.url.to-json":"node_modules/core-js/modules/web.url.to-json.js","../modules/web.url-search-params":"node_modules/core-js/modules/web.url-search-params.js","../internals/path":"node_modules/core-js/internals/path.js"}],"src/js/controller.js":[function(require,module,exports) {
"use strict";

var model = _interopRequireWildcard(require("./model.js"));

var _recipeView = _interopRequireDefault(require("./views/recipeView.js"));

var _searchView = _interopRequireDefault(require("./views/searchView.js"));

var _resultsView = _interopRequireDefault(require("./views/resultsView.js"));

var _paginationView = _interopRequireDefault(require("./views/paginationView.js"));

var _bookmarksView = _interopRequireDefault(require("./views/bookmarksView.js"));

var _addRecipeView = _interopRequireDefault(require("./views/addRecipeView.js"));

var _config = require("./config.js");

require("core-js/stable");

require("regenerator-runtime/runtime");

var _regeneratorRuntime = require("regenerator-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// if (module.hot) {
//   module.hot.accept();
// }
///////////////////////////////////////
var controlRecipes = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var id;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            // resultsView.renderSpinner();
            id = window.location.hash.slice(1);

            if (id) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            _recipeView.default.renderSpinner(); // update results view to mark selected search result


            _resultsView.default.update(model.getSearchResultsPage()); // Updating bookmarks view


            _bookmarksView.default.update(model.state.bookmarks); //Loading recipe


            _context.next = 9;
            return model.loadRecipe(id);

          case 9:
            //Rendering recipe
            _recipeView.default.render(model.state.recipe);

            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

            _recipeView.default.renderError();

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function controlRecipes() {
    return _ref.apply(this, arguments);
  };
}();

var controlSearchResults = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var query;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            _resultsView.default.renderSpinner(); //1 Get search query


            query = _searchView.default.getQuery();

            if (query) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return");

          case 5:
            _context2.next = 7;
            return model.loadSearchResults(query);

          case 7:
            // 3 Render results
            // resultsView.render(model.state.search.results);
            _resultsView.default.render(model.getSearchResultsPage()); // 4) Render initial pagination buttons


            _paginationView.default.render(model.state.search);

            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 11]]);
  }));

  return function controlSearchResults() {
    return _ref2.apply(this, arguments);
  };
}();

var controlPagination = function controlPagination(goToPage) {
  // 1 Render new  results
  // resultsView.render(model.state.search.results);
  _resultsView.default.render(model.getSearchResultsPage(goToPage)); // 2) Render new pagination buttons


  _paginationView.default.render(model.state.search);
};

var controlServings = function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings); // Update the recipe view
  // recipeView.render(model.state.recipe);

  _recipeView.default.update(model.state.recipe);
};

var controlAddBookmark = function controlAddBookmark() {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);else model.deleteBookmark(model.state.recipe.id); // 2) Update recipe view

  _recipeView.default.update(model.state.recipe); // 3) Render bookmarks


  _bookmarksView.default.render(model.state.bookmarks);
};

var controlBookmarks = function controlBookmarks() {
  _bookmarksView.default.render(model.state.bookmarks);
};

var controlAddRecipe = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(newRecipe) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            // Show loading spinner
            _addRecipeView.default.renderSpinner(); // Upload the new recipe data


            _context3.next = 4;
            return model.uploadRecipe(newRecipe);

          case 4:
            console.log(model.state.recipe); // Render recipe

            _recipeView.default.render(model.state.recipe); // Success message


            _addRecipeView.default.renderMessage(); // Render bookmark view


            _bookmarksView.default.render(model.state.bookmarks); // Change ID in the URL


            window.history.pushState(null, '', "#".concat(model.state.recipe.id)); // Close form window

            setTimeout(function () {
              _addRecipeView.default.toggleWindow();
            }, _config.MODAL_CLOSE_SEC * 1000);
            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            console.error('😫', _context3.t0);

            _addRecipeView.default.renderError(_context3.t0.message);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 12]]);
  }));

  return function controlAddRecipe(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var init = function init() {
  _bookmarksView.default.addHandlerRender(controlBookmarks);

  _recipeView.default.addHandlerRender(controlRecipes);

  _recipeView.default.addHandlerUpdateServings(controlServings);

  _recipeView.default.addHandlerAddBookmark(controlAddBookmark);

  _searchView.default.addHandlerSearch(controlSearchResults);

  _paginationView.default.addHandlerClick(controlPagination);

  _addRecipeView.default.addHandlerUpload(controlAddRecipe);
};

init();
},{"./model.js":"src/js/model.js","./views/recipeView.js":"src/js/views/recipeView.js","./views/searchView.js":"src/js/views/searchView.js","./views/resultsView.js":"src/js/views/resultsView.js","./views/paginationView.js":"src/js/views/paginationView.js","./views/bookmarksView.js":"src/js/views/bookmarksView.js","./views/addRecipeView.js":"src/js/views/addRecipeView.js","./config.js":"src/js/config.js","core-js/stable":"node_modules/core-js/stable/index.js","regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","regenerator-runtime":"node_modules/regenerator-runtime/runtime.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59257" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/controller.js"], null)
//# sourceMappingURL=/controller.e87f5190.js.map