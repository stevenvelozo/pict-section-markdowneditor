"use strict";

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.MarkdownEditorExample = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      const libPictApplication = require('pict-application');
      const libPictSectionMarkdownEditor = require('../../source/Pict-Section-MarkdownEditor.js');
      class ExampleMarkdownEditorView extends libPictSectionMarkdownEditor {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }
      }
      const _ExampleMarkdownEditorConfiguration = {
        "ViewIdentifier": "ExampleMarkdownEditor",
        "TargetElementAddress": "#MarkdownEditorContainer",
        "ContentDataAddress": "AppData.Document.Segments",
        "ReadOnly": false
      };
      class MarkdownEditorExampleApplication extends libPictApplication {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.pict.addView('ExampleMarkdownEditorView', _ExampleMarkdownEditorConfiguration, ExampleMarkdownEditorView);
        }
        onAfterInitialize() {
          super.onAfterInitialize();

          // The view will pick up CodeMirror modules from window.CodeMirrorModules
          // (set up in the HTML via the codemirror-bundle.js script)
          let tmpView = this.pict.views.ExampleMarkdownEditorView;
          if (tmpView) {
            tmpView.render();
          }
        }
      }
      module.exports = MarkdownEditorExampleApplication;
      module.exports.default_configuration = {
        "Name": "Markdown Editor Example",
        "Hash": "MarkdownEditorExample",
        "MainViewportViewIdentifier": "ExampleMarkdownEditorView",
        "pict_configuration": {
          "Product": "MarkdownEditor-Example",
          "DefaultAppData": {
            "Document": {
              "Segments": [{
                "Content": "# Welcome to the Markdown Editor\n\nThis is the first segment. Start typing here."
              }, {
                "Content": "## Second Section\n\nThis is a second segment. You can add, remove, and reorder segments."
              }, {
                "Content": "## Diagrams & Math\n\n```mermaid\ngraph LR;\n    A[Editor] --> B[Preview];\n    B --> C[Rendered];\n```\n\nEinstein's equation: $E=mc^2$\n\nDisplay math:\n\n$$\n\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}\n$$"
              }, {
                "Content": "## Code Highlighting\n\nSyntax highlighting is powered by **pict-section-code** via the rich preview:\n\n```javascript\nconst greeting = 'Hello, World!';\n\nfunction fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));\n```\n\nInline code like `const x = 42` also works."
              }]
            }
          }
        }
      };
    }, {
      "../../source/Pict-Section-MarkdownEditor.js": 24,
      "pict-application": 5
    }],
    2: [function (require, module, exports) {
      module.exports = {
        "name": "fable-serviceproviderbase",
        "version": "3.0.18",
        "description": "Simple base classes for fable services.",
        "main": "source/Fable-ServiceProviderBase.js",
        "scripts": {
          "start": "node source/Fable-ServiceProviderBase.js",
          "test": "npx mocha -u tdd -R spec",
          "tests": "npx mocha -u tdd --exit -R spec --grep",
          "coverage": "npx nyc --reporter=lcov --reporter=text-lcov npx mocha -- -u tdd -R spec",
          "build": "npx quack build",
          "types": "tsc -p ./tsconfig.build.json",
          "check": "tsc -p . --noEmit"
        },
        "types": "types/source/Fable-ServiceProviderBase.d.ts",
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase.git"
        },
        "keywords": ["entity", "behavior"],
        "author": "Steven Velozo <steven@velozo.com> (http://velozo.com/)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase/issues"
        },
        "homepage": "https://github.com/stevenvelozo/fable-serviceproviderbase",
        "devDependencies": {
          "@types/mocha": "^10.0.10",
          "fable": "^3.1.55",
          "quackage": "^1.0.51",
          "typescript": "^5.9.3"
        }
      };
    }, {}],
    3: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @author <steven@velozo.com>
      */

      const libPackage = require('../package.json');
      class FableServiceProviderBase {
        /**
         * The constructor can be used in two ways:
         * 1) With a fable, options object and service hash (the options object and service hash are optional)a
         * 2) With an object or nothing as the first parameter, where it will be treated as the options object
         *
         * @param {import('fable')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
         * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
         * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
         */
        constructor(pFable, pOptions, pServiceHash) {
          /** @type {import('fable')} */
          this.fable;
          /** @type {string} */
          this.UUID;
          /** @type {Record<string, any>} */
          this.options;
          /** @type {Record<string, any>} */
          this.services;
          /** @type {Record<string, any>} */
          this.servicesMap;

          // Check if a fable was passed in; connect it if so
          if (typeof pFable === 'object' && pFable.isFable) {
            this.connectFable(pFable);
          } else {
            this.fable = false;
          }

          // Initialize the services map if it wasn't passed in
          /** @type {Record<string, any>} */
          this._PackageFableServiceProvider = libPackage;

          // initialize options and UUID based on whether the fable was passed in or not.
          if (this.fable) {
            this.UUID = pFable.getUUID();
            this.options = typeof pOptions === 'object' ? pOptions : {};
          } else {
            // With no fable, check to see if there was an object passed into either of the first two
            // Parameters, and if so, treat it as the options object
            this.options = typeof pFable === 'object' && !pFable.isFable ? pFable : typeof pOptions === 'object' ? pOptions : {};
            this.UUID = "CORE-SVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
          }

          // It's expected that the deriving class will set this
          this.serviceType = "Unknown-".concat(this.UUID);

          // The service hash is used to identify the specific instantiation of the service in the services map
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : !this.fable && typeof pOptions === 'string' ? pOptions : "".concat(this.UUID);
        }

        /**
         * @param {import('fable')} pFable
         */
        connectFable(pFable) {
          if (typeof pFable !== 'object' || !pFable.isFable) {
            let tmpErrorMessage = "Fable Service Provider Base: Cannot connect to Fable, invalid Fable object passed in.  The pFable parameter was a [".concat(typeof pFable, "].}");
            console.log(tmpErrorMessage);
            return new Error(tmpErrorMessage);
          }
          if (!this.fable) {
            this.fable = pFable;
          }
          if (!this.log) {
            this.log = this.fable.Logging;
          }
          if (!this.services) {
            this.services = this.fable.services;
          }
          if (!this.servicesMap) {
            this.servicesMap = this.fable.servicesMap;
          }
          return true;
        }
      }
      _defineProperty(FableServiceProviderBase, "isFableService", true);
      module.exports = FableServiceProviderBase;

      // This is left here in case we want to go back to having different code/base class for "core" services
      module.exports.CoreServiceProviderBase = FableServiceProviderBase;
    }, {
      "../package.json": 2
    }],
    4: [function (require, module, exports) {
      module.exports = {
        "name": "pict-application",
        "version": "1.0.32",
        "description": "Application base class for a pict view-based application",
        "main": "source/Pict-Application.js",
        "scripts": {
          "test": "npx mocha -u tdd -R spec",
          "start": "node source/Pict-Application.js",
          "coverage": "npx nyc --reporter=lcov --reporter=text-lcov npx mocha -- -u tdd -R spec",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-application-image:local",
          "docker-dev-run": "docker run -it -d --name pict-application-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-application\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-application-image:local",
          "docker-dev-shell": "docker exec -it pict-application-dev /bin/bash",
          "tests": "npx mocha -u tdd --exit -R spec --grep",
          "lint": "eslint source/**",
          "types": "tsc -p ."
        },
        "types": "types/source/Pict-Application.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-application.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-application/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-application#readme",
        "devDependencies": {
          "@eslint/js": "^9.28.0",
          "browser-env": "^3.3.0",
          "eslint": "^9.28.0",
          "pict": "^1.0.348",
          "pict-provider": "^1.0.10",
          "pict-view": "^1.0.66",
          "quackage": "^1.0.51",
          "typescript": "^5.9.3"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "dependencies": {
          "fable-serviceproviderbase": "^3.0.18"
        }
      };
    }, {}],
    5: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictSettings = {
        Name: 'DefaultPictApplication',
        // The main "viewport" is the view that is used to host our application
        MainViewportViewIdentifier: 'Default-View',
        MainViewportRenderableHash: false,
        MainViewportDestinationAddress: false,
        MainViewportDefaultDataAddress: false,
        // Whether or not we should automatically render the main viewport and other autorender views after we initialize the pict application
        AutoSolveAfterInitialize: true,
        AutoRenderMainViewportViewAfterInitialize: true,
        AutoRenderViewsAfterInitialize: false,
        AutoLoginAfterInitialize: false,
        AutoLoadDataAfterLogin: false,
        ConfigurationOnlyViews: [],
        Manifests: {},
        // The prefix to prepend on all template destination hashes
        IdentifierAddressPrefix: 'PICT-'
      };

      /**
       * Base class for pict applications.
       */
      class PictApplication extends libFableServiceBase {
        /**
         * @param {import('fable')} pFable
         * @param {Record<string, any>} [pOptions]
         * @param {string} [pServiceHash]
         */
        constructor(pFable, pOptions, pServiceHash) {
          let tmpCarryOverConfiguration = typeof pFable.settings.PictApplicationConfiguration === 'object' ? pFable.settings.PictApplicationConfiguration : {};
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictSettings)), tmpCarryOverConfiguration, pOptions);
          super(pFable, tmpOptions, pServiceHash);

          /** @type {any} */
          this.options;
          /** @type {any} */
          this.log;
          /** @type {import('pict') & import('fable')} */
          this.fable;
          /** @type {string} */
          this.UUID;
          /** @type {string} */
          this.Hash;
          /**
           * @type {{ [key: string]: any }}
           */
          this.servicesMap;
          this.serviceType = 'PictApplication';
          /** @type {Record<string, any>} */
          this._Package = libPackage;

          // Convenience and consistency naming
          this.pict = this.fable;
          // Wire in the essential Pict state
          /** @type {Record<string, any>} */
          this.AppData = this.fable.AppData;
          /** @type {Record<string, any>} */
          this.Bundle = this.fable.Bundle;

          /** @type {number} */
          this.initializeTimestamp;
          /** @type {number} */
          this.lastSolvedTimestamp;
          /** @type {number} */
          this.lastLoginTimestamp;
          /** @type {number} */
          this.lastMarshalFromViewsTimestamp;
          /** @type {number} */
          this.lastMarshalToViewsTimestamp;
          /** @type {number} */
          this.lastAutoRenderTimestamp;
          /** @type {number} */
          this.lastLoadDataTimestamp;

          // Load all the manifests for the application
          let tmpManifestKeys = Object.keys(this.options.Manifests);
          if (tmpManifestKeys.length > 0) {
            for (let i = 0; i < tmpManifestKeys.length; i++) {
              // Load each manifest
              let tmpManifestKey = tmpManifestKeys[i];
              this.fable.instantiateServiceProvider('Manifest', this.options.Manifests[tmpManifestKey], tmpManifestKey);
            }
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Solve All Views                          */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onPreSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onPreSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onPreSolveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onBeforeSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeSolveAsync(fCallback) {
          this.onBeforeSolve();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onSolveAsync(fCallback) {
          this.onSolve();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        solve() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " executing solve() function..."));
          }

          // Walk through any loaded providers and solve them as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToSolve = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoSolveWithApp) {
              tmpProvidersToSolve.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToSolve.sort((a, b) => {
            return a.options.AutoSolveOrdinal - b.options.AutoSolveOrdinal;
          });
          for (let i = 0; i < tmpProvidersToSolve.length; i++) {
            tmpProvidersToSolve[i].solve(tmpProvidersToSolve[i]);
          }
          this.onBeforeSolve();
          // Now walk through any loaded views and initialize them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToSolve = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoInitialize) {
              tmpViewsToSolve.push(tmpView);
            }
          }
          // Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpViewsToSolve.sort((a, b) => {
            return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
          });
          for (let i = 0; i < tmpViewsToSolve.length; i++) {
            tmpViewsToSolve[i].solve();
          }
          this.onSolve();
          this.onAfterSolve();
          this.lastSolvedTimestamp = this.fable.log.getTimeStamp();
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        solveAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          // Walk through any loaded providers and solve them as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToSolve = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoSolveWithApp) {
              tmpProvidersToSolve.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToSolve.sort((a, b) => {
            return a.options.AutoSolveOrdinal - b.options.AutoSolveOrdinal;
          });
          for (let i = 0; i < tmpProvidersToSolve.length; i++) {
            tmpAnticipate.anticipate(tmpProvidersToSolve[i].solveAsync.bind(tmpProvidersToSolve[i]));
          }

          // Walk through any loaded views and solve them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToSolve = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoSolveWithApp) {
              tmpViewsToSolve.push(tmpView);
            }
          }
          // Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpViewsToSolve.sort((a, b) => {
            return a.options.AutoSolveOrdinal - b.options.AutoSolveOrdinal;
          });
          for (let i = 0; i < tmpViewsToSolve.length; i++) {
            tmpAnticipate.anticipate(tmpViewsToSolve[i].solveAsync.bind(tmpViewsToSolve[i]));
          }
          tmpAnticipate.anticipate(this.onSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync() complete."));
            }
            this.lastSolvedTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        onAfterSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterSolveAsync(fCallback) {
          this.onAfterSolve();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Application Login                        */
        /* -------------------------------------------------------------------------- */

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeLoginAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeLoginAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onLoginAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onLoginAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        loginAsync(fCallback) {
          const tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          let tmpCallback = fCallback;
          if (typeof tmpCallback !== 'function') {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loginAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loginAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeLoginAsync.bind(this));
          tmpAnticipate.anticipate(this.onLoginAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterLoginAsync.bind(this));

          // check and see if we should automatically trigger a data load
          if (this.options.AutoLoadDataAfterLogin) {
            tmpAnticipate.anticipate(fNext => {
              if (!this.isLoggedIn()) {
                return fNext();
              }
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto loading data after login..."));
              }
              //TODO: should data load errors funnel here? this creates a weird coupling between login and data load callbacks
              this.loadDataAsync(pError => {
                fNext(pError);
              });
            });
          }
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loginAsync() complete."));
            }
            this.lastLoginTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Check if the application state is logged in. Defaults to true. Override this method in your application based on login requirements.
         *
         * @return {boolean}
         */
        isLoggedIn() {
          return true;
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterLoginAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterLoginAsync:"));
          }
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Application LoadData                     */
        /* -------------------------------------------------------------------------- */

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        loadDataAsync(fCallback) {
          const tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          let tmpCallback = fCallback;
          if (typeof tmpCallback !== 'function') {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loadDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loadDataAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeLoadDataAsync.bind(this));

          // Walk through any loaded providers and load their data as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToLoadData = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoLoadDataWithApp) {
              tmpProvidersToLoadData.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToLoadData.sort((a, b) => {
            return a.options.AutoLoadDataOrdinal - b.options.AutoLoadDataOrdinal;
          });
          for (const tmpProvider of tmpProvidersToLoadData) {
            tmpAnticipate.anticipate(tmpProvider.onBeforeLoadDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onLoadDataAsync.bind(this));

          //TODO: think about ways to parallelize these
          for (const tmpProvider of tmpProvidersToLoadData) {
            tmpAnticipate.anticipate(tmpProvider.onLoadDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onAfterLoadDataAsync.bind(this));
          for (const tmpProvider of tmpProvidersToLoadData) {
            tmpAnticipate.anticipate(tmpProvider.onAfterLoadDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.wait(/** @param {Error} [pError] */
          pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loadDataAsync() complete."));
            }
            this.lastLoadDataTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterLoadDataAsync:"));
          }
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Application SaveData                     */
        /* -------------------------------------------------------------------------- */

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        saveDataAsync(fCallback) {
          const tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          let tmpCallback = fCallback;
          if (typeof tmpCallback !== 'function') {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " saveDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " saveDataAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeSaveDataAsync.bind(this));

          // Walk through any loaded providers and load their data as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToSaveData = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoSaveDataWithApp) {
              tmpProvidersToSaveData.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToSaveData.sort((a, b) => {
            return a.options.AutoSaveDataOrdinal - b.options.AutoSaveDataOrdinal;
          });
          for (const tmpProvider of tmpProvidersToSaveData) {
            tmpAnticipate.anticipate(tmpProvider.onBeforeSaveDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onSaveDataAsync.bind(this));

          //TODO: think about ways to parallelize these
          for (const tmpProvider of tmpProvidersToSaveData) {
            tmpAnticipate.anticipate(tmpProvider.onSaveDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onAfterSaveDataAsync.bind(this));
          for (const tmpProvider of tmpProvidersToSaveData) {
            tmpAnticipate.anticipate(tmpProvider.onAfterSaveDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.wait(/** @param {Error} [pError] */
          pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " saveDataAsync() complete."));
            }
            this.lastSaveDataTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterSaveDataAsync:"));
          }
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Initialize Application                   */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            if ('ConfigurationOnlyViews' in this.options) {
              // Load all the configuration only views
              for (let i = 0; i < this.options.ConfigurationOnlyViews.length; i++) {
                let tmpViewIdentifier = typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier === 'undefined' ? "AutoView-".concat(this.fable.getUUID()) : this.options.ConfigurationOnlyViews[i].ViewIdentifier;
                this.log.info("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " adding configuration only view: ").concat(tmpViewIdentifier));
                this.pict.addView(tmpViewIdentifier, this.options.ConfigurationOnlyViews[i]);
              }
            }
            this.onInitialize();

            // Walk through any loaded providers and initialize them as well.
            let tmpLoadedProviders = Object.keys(this.pict.providers);
            let tmpProvidersToInitialize = [];
            for (let i = 0; i < tmpLoadedProviders.length; i++) {
              let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
              if (tmpProvider.options.AutoInitialize) {
                tmpProvidersToInitialize.push(tmpProvider);
              }
            }
            // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
            tmpProvidersToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpProvidersToInitialize.length; i++) {
              tmpProvidersToInitialize[i].initialize();
            }

            // Now walk through any loaded views and initialize them as well.
            let tmpLoadedViews = Object.keys(this.pict.views);
            let tmpViewsToInitialize = [];
            for (let i = 0; i < tmpLoadedViews.length; i++) {
              let tmpView = this.pict.views[tmpLoadedViews[i]];
              if (tmpView.options.AutoInitialize) {
                tmpViewsToInitialize.push(tmpView);
              }
            }
            // Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
            tmpViewsToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpViewsToInitialize.length; i++) {
              tmpViewsToInitialize[i].initialize();
            }
            this.onAfterInitialize();
            if (this.options.AutoSolveAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto solving after initialization..."));
              }
              // Solve the template synchronously
              this.solve();
            }
            // Now check and see if we should automatically render as well
            if (this.options.AutoRenderMainViewportViewAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto rendering after initialization..."));
              }
              // Render the template synchronously
              this.render();
            }
            this.initializeTimestamp = this.fable.log.getTimeStamp();
            this.onCompletionOfInitialize();
            return true;
          } else {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync:"));
          }

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 3) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " beginning initialization..."));
            }
            if ('ConfigurationOnlyViews' in this.options) {
              // Load all the configuration only views
              for (let i = 0; i < this.options.ConfigurationOnlyViews.length; i++) {
                let tmpViewIdentifier = typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier === 'undefined' ? "AutoView-".concat(this.fable.getUUID()) : this.options.ConfigurationOnlyViews[i].ViewIdentifier;
                this.log.info("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " adding configuration only view: ").concat(tmpViewIdentifier));
                this.pict.addView(tmpViewIdentifier, this.options.ConfigurationOnlyViews[i]);
              }
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));

            // Walk through any loaded providers and solve them as well.
            let tmpLoadedProviders = Object.keys(this.pict.providers);
            let tmpProvidersToInitialize = [];
            for (let i = 0; i < tmpLoadedProviders.length; i++) {
              let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
              if (tmpProvider.options.AutoInitialize) {
                tmpProvidersToInitialize.push(tmpProvider);
              }
            }
            // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
            tmpProvidersToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpProvidersToInitialize.length; i++) {
              tmpAnticipate.anticipate(tmpProvidersToInitialize[i].initializeAsync.bind(tmpProvidersToInitialize[i]));
            }

            // Now walk through any loaded views and initialize them as well.
            // TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
            let tmpLoadedViews = Object.keys(this.pict.views);
            let tmpViewsToInitialize = [];
            for (let i = 0; i < tmpLoadedViews.length; i++) {
              let tmpView = this.pict.views[tmpLoadedViews[i]];
              if (tmpView.options.AutoInitialize) {
                tmpViewsToInitialize.push(tmpView);
              }
            }
            // Sort the views by their priority
            // If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
            tmpViewsToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpViewsToInitialize.length; i++) {
              let tmpView = tmpViewsToInitialize[i];
              tmpAnticipate.anticipate(tmpView.initializeAsync.bind(tmpView));
            }
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            if (this.options.AutoLoginAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto login (asynchronously) after initialization..."));
              }
              tmpAnticipate.anticipate(this.loginAsync.bind(this));
            }
            if (this.options.AutoSolveAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto solving (asynchronously) after initialization..."));
              }
              tmpAnticipate.anticipate(this.solveAsync.bind(this));
            }
            if (this.options.AutoRenderMainViewportViewAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto rendering (asynchronously) after initialization..."));
              }
              tmpAnticipate.anticipate(this.renderMainViewportAsync.bind(this));
            }
            tmpAnticipate.wait(pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync Error: ").concat(pError.message || pError), {
                  stack: pError.stack
                });
              }
              this.initializeTimestamp = this.fable.log.getTimeStamp();
              if (this.pict.LogNoisiness > 2) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initialization complete."));
              }
              return tmpCallback();
            });
          } else {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return this.onCompletionOfInitializeAsync(tmpCallback);
          }
        }

        /**
         * @return {boolean}
         */
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onCompletionOfInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onCompletionOfInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onCompletionOfInitializeAsync(fCallback) {
          this.onCompletionOfInitialize();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal Data From All Views              */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeMarshalFromViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeMarshalFromViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeMarshalFromViewsAsync(fCallback) {
          this.onBeforeMarshalFromViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onMarshalFromViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onMarshalFromViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onMarshalFromViewsAsync(fCallback) {
          this.onMarshalFromViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        marshalFromViews() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " executing marshalFromViews() function..."));
          }
          this.onBeforeMarshalFromViews();
          // Now walk through any loaded views and initialize them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalFromViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalFromViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalFromViews.length; i++) {
            tmpViewsToMarshalFromViews[i].marshalFromView();
          }
          this.onMarshalFromViews();
          this.onAfterMarshalFromViews();
          this.lastMarshalFromViewsTimestamp = this.fable.log.getTimeStamp();
          return true;
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        marshalFromViewsAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewsAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalFromViewsAsync.bind(this));
          // Walk through any loaded views and marshalFromViews them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalFromViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalFromViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalFromViews.length; i++) {
            tmpAnticipate.anticipate(tmpViewsToMarshalFromViews[i].marshalFromViewAsync.bind(tmpViewsToMarshalFromViews[i]));
          }
          tmpAnticipate.anticipate(this.onMarshalFromViewsAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalFromViewsAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewsAsync() complete."));
            }
            this.lastMarshalFromViewsTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        onAfterMarshalFromViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterMarshalFromViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterMarshalFromViewsAsync(fCallback) {
          this.onAfterMarshalFromViews();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal Data To All Views                */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeMarshalToViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeMarshalToViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeMarshalToViewsAsync(fCallback) {
          this.onBeforeMarshalToViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onMarshalToViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onMarshalToViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onMarshalToViewsAsync(fCallback) {
          this.onMarshalToViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        marshalToViews() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " executing marshalToViews() function..."));
          }
          this.onBeforeMarshalToViews();
          // Now walk through any loaded views and initialize them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalToViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalToViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalToViews.length; i++) {
            tmpViewsToMarshalToViews[i].marshalToView();
          }
          this.onMarshalToViews();
          this.onAfterMarshalToViews();
          this.lastMarshalToViewsTimestamp = this.fable.log.getTimeStamp();
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        marshalToViewsAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewsAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalToViewsAsync.bind(this));
          // Walk through any loaded views and marshalToViews them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalToViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalToViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalToViews.length; i++) {
            tmpAnticipate.anticipate(tmpViewsToMarshalToViews[i].marshalToViewAsync.bind(tmpViewsToMarshalToViews[i]));
          }
          tmpAnticipate.anticipate(this.onMarshalToViewsAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalToViewsAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewsAsync() complete."));
            }
            this.lastMarshalToViewsTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        onAfterMarshalToViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterMarshalToViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterMarshalToViewsAsync(fCallback) {
          this.onAfterMarshalToViews();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Render View                              */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeRender:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeRenderAsync(fCallback) {
          this.onBeforeRender();
          return fCallback();
        }

        /**
         * @param {string} [pViewIdentifier] - The hash of the view to render. By default, the main viewport view is rendered.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string} [pTemplateDataAddress] - The address where the data for the template is stored.
         *
         * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
         */
        render(pViewIdentifier, pRenderableHash, pRenderDestinationAddress, pTemplateDataAddress) {
          let tmpViewIdentifier = typeof pViewIdentifier !== 'string' ? this.options.MainViewportViewIdentifier : pViewIdentifier;
          let tmpRenderableHash = typeof pRenderableHash !== 'string' ? this.options.MainViewportRenderableHash : pRenderableHash;
          let tmpRenderDestinationAddress = typeof pRenderDestinationAddress !== 'string' ? this.options.MainViewportDestinationAddress : pRenderDestinationAddress;
          let tmpTemplateDataAddress = typeof pTemplateDataAddress !== 'string' ? this.options.MainViewportDefaultDataAddress : pTemplateDataAddress;
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " VIEW Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderDestinationAddress, "] TemplateDataAddress[").concat(tmpTemplateDataAddress, "] render:"));
          }
          this.onBeforeRender();

          // Now get the view (by hash) from the loaded views
          let tmpView = typeof tmpViewIdentifier === 'string' ? this.servicesMap.PictView[tmpViewIdentifier] : false;
          if (!tmpView) {
            this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " could not render from View ").concat(tmpViewIdentifier, " because it is not a valid view."));
            return false;
          }
          this.onRender();
          tmpView.render(tmpRenderableHash, tmpRenderDestinationAddress, tmpTemplateDataAddress);
          this.onAfterRender();
          return true;
        }
        /**
         * @return {boolean}
         */
        onRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onRender:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onRenderAsync(fCallback) {
          this.onRender();
          return fCallback();
        }

        /**
         * @param {string|((error?: Error) => void)} pViewIdentifier - The hash of the view to render. By default, the main viewport view is rendered. (or the callback)
         * @param {string|((error?: Error) => void)} [pRenderableHash] - The hash of the renderable to render. (or the callback)
         * @param {string|((error?: Error) => void)} [pRenderDestinationAddress] - The address where the renderable will be rendered. (or the callback)
         * @param {string|((error?: Error) => void)} [pTemplateDataAddress] - The address where the data for the template is stored. (or the callback)
         * @param {(error?: Error) => void} [fCallback] - The callback, if all other parameters are provided.
         *
         * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
         */
        renderAsync(pViewIdentifier, pRenderableHash, pRenderDestinationAddress, pTemplateDataAddress, fCallback) {
          let tmpViewIdentifier = typeof pViewIdentifier !== 'string' ? this.options.MainViewportViewIdentifier : pViewIdentifier;
          let tmpRenderableHash = typeof pRenderableHash !== 'string' ? this.options.MainViewportRenderableHash : pRenderableHash;
          let tmpRenderDestinationAddress = typeof pRenderDestinationAddress !== 'string' ? this.options.MainViewportDestinationAddress : pRenderDestinationAddress;
          let tmpTemplateDataAddress = typeof pTemplateDataAddress !== 'string' ? this.options.MainViewportDefaultDataAddress : pTemplateDataAddress;

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateDataAddress === 'function' ? pTemplateDataAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : typeof pViewIdentifier === 'function' ? pViewIdentifier : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " VIEW Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderDestinationAddress, "] TemplateDataAddress[").concat(tmpTemplateDataAddress, "] renderAsync:"));
          }
          let tmpRenderAnticipate = this.fable.newAnticipate();
          tmpRenderAnticipate.anticipate(this.onBeforeRenderAsync.bind(this));
          let tmpView = typeof tmpViewIdentifier === 'string' ? this.servicesMap.PictView[tmpViewIdentifier] : false;
          if (!tmpView) {
            let tmpErrorMessage = "PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " could not asynchronously render from View ").concat(tmpViewIdentifier, " because it is not a valid view.");
            if (this.pict.LogNoisiness > 3) {
              this.log.error(tmpErrorMessage);
            }
            return tmpCallback(new Error(tmpErrorMessage));
          }
          tmpRenderAnticipate.anticipate(this.onRenderAsync.bind(this));
          tmpRenderAnticipate.anticipate(fNext => {
            tmpView.renderAsync.call(tmpView, tmpRenderableHash, tmpRenderDestinationAddress, tmpTemplateDataAddress, fNext);
          });
          tmpRenderAnticipate.anticipate(this.onAfterRenderAsync.bind(this));
          return tmpRenderAnticipate.wait(tmpCallback);
        }

        /**
         * @return {boolean}
         */
        onAfterRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterRender:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterRenderAsync(fCallback) {
          this.onAfterRender();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        renderMainViewport() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderMainViewport:"));
          }
          return this.render();
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        renderMainViewportAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderMainViewportAsync:"));
          }
          return this.renderAsync(fCallback);
        }
        /**
         * @return {void}
         */
        renderAutoViews() {
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " beginning renderAutoViews..."));
          }
          // Now walk through any loaded views and sort them by the AutoRender ordinal
          let tmpLoadedViews = Object.keys(this.pict.views);
          // Sort the views by their priority
          // If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
          tmpLoadedViews.sort((a, b) => {
            return this.pict.views[a].options.AutoRenderOrdinal - this.pict.views[b].options.AutoRenderOrdinal;
          });
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoRender) {
              tmpView.render();
            }
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync complete."));
          }
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        renderAutoViewsAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " beginning renderAutoViewsAsync..."));
          }

          // Now walk through any loaded views and sort them by the AutoRender ordinal
          // TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
          let tmpLoadedViews = Object.keys(this.pict.views);
          // Sort the views by their priority
          // If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
          tmpLoadedViews.sort((a, b) => {
            return this.pict.views[a].options.AutoRenderOrdinal - this.pict.views[b].options.AutoRenderOrdinal;
          });
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoRender) {
              tmpAnticipate.anticipate(tmpView.renderAsync.bind(tmpView));
            }
          }
          tmpAnticipate.wait(pError => {
            this.lastAutoRenderTimestamp = this.fable.log.getTimeStamp();
            if (this.pict.LogNoisiness > 0) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync complete."));
            }
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        get isPictApplication() {
          return true;
        }
      }
      module.exports = PictApplication;
    }, {
      "../package.json": 4,
      "fable-serviceproviderbase": 3
    }],
    6: [function (require, module, exports) {
      module.exports = {
        "name": "fable-serviceproviderbase",
        "version": "3.0.19",
        "description": "Simple base classes for fable services.",
        "main": "source/Fable-ServiceProviderBase.js",
        "scripts": {
          "start": "node source/Fable-ServiceProviderBase.js",
          "test": "npx quack test",
          "tests": "npx quack test -g",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "types": "tsc -p ./tsconfig.build.json",
          "check": "tsc -p . --noEmit"
        },
        "types": "types/source/Fable-ServiceProviderBase.d.ts",
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase.git"
        },
        "keywords": ["entity", "behavior"],
        "author": "Steven Velozo <steven@velozo.com> (http://velozo.com/)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase/issues"
        },
        "homepage": "https://github.com/stevenvelozo/fable-serviceproviderbase",
        "devDependencies": {
          "@types/mocha": "^10.0.10",
          "fable": "^3.1.62",
          "quackage": "^1.0.58",
          "typescript": "^5.9.3"
        }
      };
    }, {}],
    7: [function (require, module, exports) {
      arguments[4][3][0].apply(exports, arguments);
    }, {
      "../package.json": 6,
      "dup": 3
    }],
    8: [function (require, module, exports) {
      module.exports = {
        "name": "pict-provider",
        "version": "1.0.12",
        "description": "Pict Provider Base Class",
        "main": "source/Pict-Provider.js",
        "scripts": {
          "start": "node source/Pict-Provider.js",
          "test": "npx quack test",
          "tests": "npx quack test -g",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-provider-image:local",
          "docker-dev-run": "docker run -it -d --name pict-provider-dev -p 24125:8080 -p 30027:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-provider\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-provider-image:local",
          "docker-dev-shell": "docker exec -it pict-provider-dev /bin/bash",
          "lint": "eslint source/**",
          "types": "tsc -p ."
        },
        "types": "types/source/Pict-Provider.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-provider.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-provider/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-provider#readme",
        "devDependencies": {
          "@eslint/js": "^9.39.1",
          "eslint": "^9.39.1",
          "pict": "^1.0.351",
          "quackage": "^1.0.58",
          "typescript": "^5.9.3"
        },
        "dependencies": {
          "fable-serviceproviderbase": "^3.0.19"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        }
      };
    }, {}],
    9: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictProviderSettings = {
        ProviderIdentifier: false,
        // If this is set to true, when the App initializes this will.
        // After the App initializes, initialize will be called as soon as it's added.
        AutoInitialize: true,
        AutoInitializeOrdinal: 0,
        AutoLoadDataWithApp: true,
        AutoLoadDataOrdinal: 0,
        AutoSolveWithApp: true,
        AutoSolveOrdinal: 0,
        Manifests: {},
        Templates: []
      };
      class PictProvider extends libFableServiceBase {
        /**
         * @param {import('fable')} pFable - The Fable instance.
         * @param {Record<string, any>} [pOptions] - The options for the provider.
         * @param {string} [pServiceHash] - The service hash for the provider.
         */
        constructor(pFable, pOptions, pServiceHash) {
          // Intersect default options, parent constructor, service information
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictProviderSettings)), pOptions);
          super(pFable, tmpOptions, pServiceHash);

          /** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */
          this.fable;
          /** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */
          this.pict;
          /** @type {any} */
          this.log;
          /** @type {Record<string, any>} */
          this.options;
          /** @type {string} */
          this.UUID;
          /** @type {string} */
          this.Hash;
          if (!this.options.ProviderIdentifier) {
            this.options.ProviderIdentifier = "AutoProviderID-".concat(this.fable.getUUID());
          }
          this.serviceType = 'PictProvider';
          /** @type {Record<string, any>} */
          this._Package = libPackage;

          // Convenience and consistency naming
          this.pict = this.fable;

          // Wire in the essential Pict application state
          /** @type {Record<string, any>} */
          this.AppData = this.pict.AppData;
          /** @type {Record<string, any>} */
          this.Bundle = this.pict.Bundle;
          this.initializeTimestamp = false;
          this.lastSolvedTimestamp = false;
          for (let i = 0; i < this.options.Templates.length; i++) {
            let tmpDefaultTemplate = this.options.Templates[i];
            if (!tmpDefaultTemplate.hasOwnProperty('Postfix') || !tmpDefaultTemplate.hasOwnProperty('Template')) {
              this.log.error("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " could not load Default Template ").concat(i, " in the options array."), tmpDefaultTemplate);
            } else {
              if (!tmpDefaultTemplate.Source) {
                tmpDefaultTemplate.Source = "PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix, tmpDefaultTemplate.Postfix, tmpDefaultTemplate.Template, tmpDefaultTemplate.Source);
            }
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                        Code Section: Initialization                        */
        /* -------------------------------------------------------------------------- */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onBeforeInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-pinitialization.
         *
         * @return {void}
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            this.onInitialize();
            this.onAfterInitialize();
            this.initializeTimestamp = this.pict.log.getTimeStamp();
            return true;
          } else {
            this.log.warn("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initializeAsync:"));
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 0) {
              this.log.info("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " beginning initialization..."));
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            tmpAnticipate.wait(pError => {
              this.initializeTimestamp = this.pict.log.getTimeStamp();
              if (pError) {
                this.log.error("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialization failed: ").concat(pError.message || pError), {
                  Stack: pError.stack
                });
              } else if (this.pict.LogNoisiness > 0) {
                this.log.info("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialization complete."));
              }
              return fCallback();
            });
          } else {
            this.log.warn("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return fCallback();
          }
        }
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onAfterInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }
        onPreRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onPreRender:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-render.
         *
         * @return {void}
         */
        onPreRenderAsync(fCallback) {
          this.onPreRender();
          return fCallback();
        }
        render() {
          return this.onPreRender();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after render.
         *
         * @return {void}
         */
        renderAsync(fCallback) {
          this.onPreRender();
          return fCallback();
        }
        onPreSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onPreSolve:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-solve.
         *
         * @return {void}
         */
        onPreSolveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }
        solve() {
          return this.onPreSolve();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after solve.
         *
         * @return {void}
         */
        solveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
         */
        onBeforeLoadDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * Hook to allow the provider to load data during application data load.
         *
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
         */
        onLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
         */
        onAfterLoadDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
         *
         * @return {void}
         */
        onBeforeSaveDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * Hook to allow the provider to load data during application data load.
         *
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
         *
         * @return {void}
         */
        onSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
         *
         * @return {void}
         */
        onAfterSaveDataAsync(fCallback) {
          return fCallback();
        }
      }
      module.exports = PictProvider;
    }, {
      "../package.json": 8,
      "fable-serviceproviderbase": 7
    }],
    10: [function (require, module, exports) {
      /**
       * Simple syntax highlighter for use with CodeJar.
       *
       * Provides basic keyword/string/number/comment highlighting for common languages.
       * Can be replaced with Prism.js or highlight.js for more sophisticated highlighting
       * by passing a custom highlight function to the view options.
       *
       * @module Pict-Code-Highlighter
       */

      // Language definition map
      const _LanguageDefinitions = {
        'javascript': {
          // Combined regex to tokenize: comments, strings, template literals, regex, then everything else
          tokenizer: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2|(`(?:[^`\\]|\\.)*?`)|(\/(?![/*])(?:\\.|\[(?:\\.|[^\]])*\]|[^/\\\n])+\/[gimsuvy]*)/g,
          keywords: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
          builtins: /\b(true|false|null|undefined|NaN|Infinity|console|window|document|Math|JSON|Array|Object|String|Number|Boolean|Date|RegExp|Map|Set|Promise|Error|Symbol|parseInt|parseFloat|require|module|exports)\b/g,
          numbers: /\b(\d+\.?\d*(?:e[+-]?\d+)?|0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)\b/g
        },
        'json': {
          tokenizer: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")/g,
          keywords: /\b(true|false|null)\b/g,
          numbers: /-?\b\d+\.?\d*(?:e[+-]?\d+)?\b/g
        },
        'html': {
          // Tokenizer captures: (1) comments, (2) strings, (3) tags with attributes
          tokenizer: /(<!--[\s\S]*?-->)|(["'])(?:(?!\2|\\).|\\.)*?\2|(<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*\s*\/?>)/g,
          // tagToken group index for identifying tag matches
          tagGroupIndex: 3
        },
        'css': {
          tokenizer: /(\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,
          selectors: /([.#]?[a-zA-Z_][\w-]*(?:\s*[>+~]\s*[.#]?[a-zA-Z_][\w-]*)*)\s*\{/g,
          properties: /\b([a-zA-Z-]+)\s*:/g,
          numbers: /\b(\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/g,
          keywords: /\b(important|inherit|initial|unset|none|auto|block|inline|flex|grid)\b/g
        },
        'sql': {
          tokenizer: /(--[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,
          keywords: /\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CHECK|UNIQUE|CASCADE|GRANT|REVOKE|COMMIT|ROLLBACK|BEGIN|TRANSACTION|INT|VARCHAR|DATETIME|AUTO_INCREMENT|CURRENT_TIMESTAMP)\b/gi,
          numbers: /\b\d+\.?\d*\b/g
        }
      };

      // Alias some common language names
      _LanguageDefinitions['js'] = _LanguageDefinitions['javascript'];
      _LanguageDefinitions['htm'] = _LanguageDefinitions['html'];

      /**
       * Escape HTML special characters to prevent XSS when inserting into innerHTML.
       *
       * @param {string} pString - The string to escape
       * @returns {string} The escaped string
       */
      function escapeHTML(pString) {
        return pString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      /**
       * Highlight a segment of code that is NOT inside a string or comment.
       * This applies keyword, number, and structural highlighting.
       *
       * @param {string} pCode - The code segment to highlight (already HTML-escaped)
       * @param {object} pLanguageDef - The language definition
       * @returns {string} The highlighted HTML
       */
      function highlightCodeSegment(pCode, pLanguageDef) {
        let tmpResult = pCode;

        // CSS selectors
        if (pLanguageDef.selectors) {
          pLanguageDef.selectors.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.selectors, '<span class="function-name">$1</span>{');
        }

        // CSS properties
        if (pLanguageDef.properties) {
          pLanguageDef.properties.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.properties, '<span class="property">$1</span>:');
        }

        // Keywords
        if (pLanguageDef.keywords) {
          pLanguageDef.keywords.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.keywords, '<span class="keyword">$1</span>');
        }

        // Builtins
        if (pLanguageDef.builtins) {
          pLanguageDef.builtins.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.builtins, '<span class="keyword">$1</span>');
        }

        // Numbers (CSS numbers may have units as a capture group, others do not)
        if (pLanguageDef.numbers) {
          pLanguageDef.numbers.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.numbers, pMatch => {
            return "<span class=\"number\">".concat(pMatch, "</span>");
          });
        }
        return tmpResult;
      }

      /**
       * Highlight an HTML tag token, applying tag name, attribute name, and attribute value colors.
       *
       * The approach: parse the raw tag into structured pieces first, then build the
       * highlighted output from those pieces. This avoids mixing raw text with HTML span
       * tags, which would cause regex replacements to match span attributes on subsequent passes.
       *
       * @param {string} pTag - The raw (unescaped) tag string
       * @returns {string} The highlighted HTML
       */
      function highlightHTMLTag(pTag) {
        let tmpResult = '';
        let tmpRest = pTag;

        // 1. Extract the opening bracket and tag name: < or </  followed by tagname
        let tmpTagNameMatch = tmpRest.match(/^(<\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
        if (!tmpTagNameMatch) {
          // Not a recognizable tag, just escape the whole thing
          return escapeHTML(pTag);
        }
        tmpResult += escapeHTML(tmpTagNameMatch[1]);
        tmpResult += '<span class="tag">' + escapeHTML(tmpTagNameMatch[2]) + '</span>';
        tmpRest = tmpRest.substring(tmpTagNameMatch[0].length);

        // 2. Parse attributes from the remaining text (before the closing > or />)
        // Repeatedly match: whitespace + attr-name + optional =value
        let tmpAttrRegex = /^(\s+)([a-zA-Z-]+)(?:(\s*=\s*)(["'])([^"']*?)\4)?/;
        let tmpAttrMatch;
        while ((tmpAttrMatch = tmpRest.match(tmpAttrRegex)) !== null) {
          // Whitespace before the attribute
          tmpResult += tmpAttrMatch[1];
          // Attribute name
          tmpResult += '<span class="attr-name">' + escapeHTML(tmpAttrMatch[2]) + '</span>';

          // If there's an = value part
          if (tmpAttrMatch[3]) {
            tmpResult += escapeHTML(tmpAttrMatch[3]);
            tmpResult += '<span class="attr-value">' + escapeHTML(tmpAttrMatch[4]) + escapeHTML(tmpAttrMatch[5]) + escapeHTML(tmpAttrMatch[4]) + '</span>';
          }
          tmpRest = tmpRest.substring(tmpAttrMatch[0].length);
        }

        // 3. Whatever remains (whitespace, />, >) — escape it all
        tmpResult += escapeHTML(tmpRest);
        return tmpResult;
      }

      /**
       * Create a highlight function for a given language.
       *
       * The approach: use a single tokenizer regex to split the code into protected tokens
       * (comments, strings) and code segments. Process each segment independently.
       * This avoids placeholder/sentinel issues entirely.
       *
       * @param {string} pLanguage - The language identifier (e.g. "javascript", "json", "html")
       * @returns {function} A function that takes an element and highlights its textContent
       */
      function createHighlighter(pLanguage) {
        return function highlightElement(pElement) {
          let tmpCode = pElement.textContent;
          let tmpLanguageName = typeof pLanguage === 'string' ? pLanguage.toLowerCase() : 'javascript';
          let tmpLanguageDef = _LanguageDefinitions[tmpLanguageName];
          if (!tmpLanguageDef) {
            // No highlighting rules for this language; just escape and return
            pElement.innerHTML = escapeHTML(tmpCode);
            return;
          }
          if (!tmpLanguageDef.tokenizer) {
            // No tokenizer; just escape and apply keyword highlighting
            pElement.innerHTML = highlightCodeSegment(escapeHTML(tmpCode), tmpLanguageDef);
            return;
          }

          // Split the code into tokens using the tokenizer regex.
          // The tokenizer captures comments and strings as groups.
          // We process everything between matches as code.
          let tmpResult = '';
          let tmpLastIndex = 0;
          let tmpTagGroupIndex = tmpLanguageDef.tagGroupIndex || 0;
          tmpLanguageDef.tokenizer.lastIndex = 0;
          let tmpMatch;
          while ((tmpMatch = tmpLanguageDef.tokenizer.exec(tmpCode)) !== null) {
            // Add the code segment before this match
            if (tmpMatch.index > tmpLastIndex) {
              let tmpSegment = tmpCode.substring(tmpLastIndex, tmpMatch.index);
              tmpResult += highlightCodeSegment(escapeHTML(tmpSegment), tmpLanguageDef);
            }
            let tmpFullMatch = tmpMatch[0];

            // Determine token type from capture groups
            // Group 1 is always comments, Group 2+ are strings/template literals/regex
            if (tmpMatch[1]) {
              // Comment
              tmpResult += "<span class=\"comment\">".concat(escapeHTML(tmpFullMatch), "</span>");
            } else if (tmpTagGroupIndex > 0 && tmpMatch[tmpTagGroupIndex]) {
              // HTML tag — highlight tag name, attributes, and values
              tmpResult += highlightHTMLTag(tmpFullMatch);
            } else {
              // String, template literal, or regex
              tmpResult += "<span class=\"string\">".concat(escapeHTML(tmpFullMatch), "</span>");
            }
            tmpLastIndex = tmpLanguageDef.tokenizer.lastIndex;
          }

          // Add any remaining code after the last match
          if (tmpLastIndex < tmpCode.length) {
            let tmpSegment = tmpCode.substring(tmpLastIndex);
            tmpResult += highlightCodeSegment(escapeHTML(tmpSegment), tmpLanguageDef);
          }
          pElement.innerHTML = tmpResult;
        };
      }
      module.exports = createHighlighter;
      module.exports.LanguageDefinitions = _LanguageDefinitions;
    }, {}],
    11: [function (require, module, exports) {
      module.exports = {
        "RenderOnLoad": true,
        "DefaultRenderable": "CodeEditor-Wrap",
        "DefaultDestinationAddress": "#CodeEditor-Container-Div",
        "Templates": [{
          "Hash": "CodeEditor-Container",
          "Template": "<!-- CodeEditor-Container Rendering Soon -->"
        }],
        "Renderables": [{
          "RenderableHash": "CodeEditor-Wrap",
          "TemplateHash": "CodeEditor-Container",
          "DestinationAddress": "#CodeEditor-Container-Div"
        }],
        "TargetElementAddress": "#CodeEditor-Container-Div",
        // Address in AppData or other Pict address space to read/write code content
        "CodeDataAddress": false,
        // The language for syntax highlighting (e.g. "javascript", "html", "css", "json")
        "Language": "javascript",
        // Whether the editor is read-only
        "ReadOnly": false,
        // Tab character: use tab or spaces
        "Tab": "\t",
        // Whether to indent with the same whitespace as the previous line
        "IndentOn": /[({[]$/,
        // Whether to add a closing bracket/paren/brace
        "MoveToNewLine": /^[)}\]]/,
        // Whether to handle the closing character
        "AddClosing": true,
        // Whether to preserve indentation on new lines
        "CatchTab": true,
        // Whether to show line numbers
        "LineNumbers": true,
        // Default code content if no address is provided
        "DefaultCode": "// Enter your code here\n",
        // CSS for the code editor
        "CSS": ".pict-code-editor-wrap\n{\n\tdisplay: flex;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;\n\tfont-size: 14px;\n\tline-height: 1.5;\n\tborder: 1px solid #D0D0D0;\n\tborder-radius: 4px;\n\toverflow: auto;\n}\n.pict-code-editor-wrap .pict-code-line-numbers\n{\n\tposition: sticky;\n\tleft: 0;\n\twidth: 40px;\n\tmin-width: 40px;\n\tpadding: 10px 0;\n\ttext-align: right;\n\tbackground: #F5F5F5;\n\tborder-right: 1px solid #D0D0D0;\n\tcolor: #999;\n\tfont-size: 13px;\n\tline-height: 1.5;\n\tuser-select: none;\n\tpointer-events: none;\n\tbox-sizing: border-box;\n\tz-index: 1;\n}\n.pict-code-editor-wrap .pict-code-line-numbers span\n{\n\tdisplay: block;\n\tpadding: 0 8px 0 0;\n}\n.pict-code-editor-wrap .pict-code-editor\n{\n\tmargin: 0;\n\tpadding: 10px 10px 10px 8px;\n\tmin-height: 100px;\n\tflex: 1;\n\tmin-width: 0;\n\toutline: none;\n\ttab-size: 4;\n\twhite-space: pre;\n\toverflow-wrap: normal;\n\tcolor: #383A42;\n\tbackground: #FAFAFA;\n\tcaret-color: #526FFF;\n\tborder-radius: 0 4px 4px 0;\n}\n.pict-code-editor-wrap .pict-code-editor.pict-code-no-line-numbers\n{\n\tpadding-left: 10px;\n\tborder-radius: 4px;\n}\n.pict-code-editor-wrap .pict-code-editor .keyword { color: #A626A4; }\n.pict-code-editor-wrap .pict-code-editor .string { color: #50A14F; }\n.pict-code-editor-wrap .pict-code-editor .number { color: #986801; }\n.pict-code-editor-wrap .pict-code-editor .comment { color: #A0A1A7; font-style: italic; }\n.pict-code-editor-wrap .pict-code-editor .operator { color: #0184BC; }\n.pict-code-editor-wrap .pict-code-editor .punctuation { color: #383A42; }\n.pict-code-editor-wrap .pict-code-editor .function-name { color: #4078F2; }\n.pict-code-editor-wrap .pict-code-editor .property { color: #E45649; }\n.pict-code-editor-wrap .pict-code-editor .tag { color: #E45649; }\n.pict-code-editor-wrap .pict-code-editor .attr-name { color: #986801; }\n.pict-code-editor-wrap .pict-code-editor .attr-value { color: #50A14F; }\n"
      };
    }, {}],
    12: [function (require, module, exports) {
      const libPictViewClass = require('pict-view');
      const libCreateHighlighter = require('./Pict-Code-Highlighter.js');
      const _DefaultConfiguration = require('./Pict-Section-Code-DefaultConfiguration.js');
      class PictSectionCode extends libPictViewClass {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);
          super(pFable, tmpOptions, pServiceHash);
          this.initialRenderComplete = false;

          // The CodeJar instance
          this.codeJar = null;

          // The highlight function (can be overridden)
          this._highlightFunction = null;

          // The current language
          this._language = this.options.Language || 'javascript';
        }
        onBeforeInitialize() {
          super.onBeforeInitialize();
          this._codeJarPrototype = null;
          this.targetElement = false;

          // Build the default highlight function for the configured language
          this._highlightFunction = libCreateHighlighter(this._language);
          return super.onBeforeInitialize();
        }

        /**
         * Connect the CodeJar prototype.  If not passed explicitly, try to find it
         * as a global (window.CodeJar) or require it from the npm package.
         *
         * @param {function} [pCodeJarPrototype] - The CodeJar constructor function
         * @returns {boolean|void}
         */
        connectCodeJarPrototype(pCodeJarPrototype) {
          if (typeof pCodeJarPrototype === 'function') {
            this._codeJarPrototype = pCodeJarPrototype;
            return;
          }

          // Try to find CodeJar in global scope
          if (typeof window !== 'undefined') {
            if (typeof window.CodeJar === 'function') {
              this.log.trace("PICT-Code Found CodeJar in window.CodeJar.");
              this._codeJarPrototype = window.CodeJar;
              return;
            }
          }
          this.log.error("PICT-Code No CodeJar prototype found. Include codejar via script tag or call connectCodeJarPrototype(CodeJar) explicitly.");
          return false;
        }
        onAfterRender(pRenderable) {
          // Ensure the CSS from all registered views is injected into the DOM
          this.pict.CSSMap.injectCSS();
          if (!this.initialRenderComplete) {
            this.onAfterInitialRender();
            this.initialRenderComplete = true;
          }
          return super.onAfterRender(pRenderable);
        }
        onAfterInitialRender() {
          // Resolve the CodeJar prototype if not already set
          if (!this._codeJarPrototype) {
            this.connectCodeJarPrototype();
          }
          if (!this._codeJarPrototype) {
            this.log.error("PICT-Code Cannot initialize editor; no CodeJar prototype available.");
            return false;
          }
          if (this.codeJar) {
            this.log.error("PICT-Code editor is already initialized!");
            return false;
          }

          // Find the target element
          let tmpTargetElementSet = this.services.ContentAssignment.getElement(this.options.TargetElementAddress);
          if (!tmpTargetElementSet || tmpTargetElementSet.length < 1) {
            this.log.error("PICT-Code Could not find target element [".concat(this.options.TargetElementAddress, "]!"));
            this.targetElement = false;
            return false;
          }
          this.targetElement = tmpTargetElementSet[0];

          // Build the editor DOM structure
          this._buildEditorDOM();

          // Get initial code content
          let tmpCode = this._resolveCodeContent();

          // Create the CodeJar options
          let tmpCodeJarOptions = {};
          if (this.options.Tab) {
            tmpCodeJarOptions.tab = this.options.Tab;
          }
          if (this.options.IndentOn) {
            tmpCodeJarOptions.indentOn = this.options.IndentOn;
          }
          if (this.options.MoveToNewLine) {
            tmpCodeJarOptions.moveToNewLine = this.options.MoveToNewLine;
          }
          if (typeof this.options.AddClosing !== 'undefined') {
            tmpCodeJarOptions.addClosing = this.options.AddClosing;
          }
          if (typeof this.options.CatchTab !== 'undefined') {
            tmpCodeJarOptions.catchTab = this.options.CatchTab;
          }
          this.customConfigureEditorOptions(tmpCodeJarOptions);

          // Instantiate CodeJar on the editor element
          let tmpEditorElement = this._editorElement;
          this.codeJar = this._codeJarPrototype(tmpEditorElement, this._highlightFunction, tmpCodeJarOptions);

          // CodeJar forces white-space:pre-wrap and overflow-wrap:break-word
          // via inline styles, which causes line wrapping that breaks the
          // line-number alignment.  Override back to non-wrapping so the
          // wrap container scrolls horizontally instead.
          this._resetEditorWrapStyles();

          // Set the initial code
          if (tmpCode) {
            this.codeJar.updateCode(tmpCode);
          }

          // Wire up the change handler
          this.codeJar.onUpdate(pCode => {
            this._updateLineNumbers();
            this.onCodeChange(pCode);
          });

          // Initial line number render
          this._updateLineNumbers();

          // Handle read-only
          if (this.options.ReadOnly) {
            tmpEditorElement.setAttribute('contenteditable', 'false');
          }
        }

        /**
         * Build the editor DOM elements inside the target container.
         */
        _buildEditorDOM() {
          // Clear the target
          this.targetElement.innerHTML = '';

          // Create wrapper
          let tmpWrap = document.createElement('div');
          tmpWrap.className = 'pict-code-editor-wrap';

          // Create line numbers container
          if (this.options.LineNumbers) {
            let tmpLineNumbers = document.createElement('div');
            tmpLineNumbers.className = 'pict-code-line-numbers';
            tmpWrap.appendChild(tmpLineNumbers);
            this._lineNumbersElement = tmpLineNumbers;
          }

          // Create the editor element (CodeJar needs a pre or div)
          let tmpEditor = document.createElement('div');
          tmpEditor.className = 'pict-code-editor language-' + this._language;
          if (!this.options.LineNumbers) {
            tmpEditor.className += ' pict-code-no-line-numbers';
          }
          tmpWrap.appendChild(tmpEditor);
          this.targetElement.appendChild(tmpWrap);
          this._editorElement = tmpEditor;
          this._wrapElement = tmpWrap;
        }

        /**
         * Update the line numbers display based on current code content.
         */
        _updateLineNumbers() {
          if (!this.options.LineNumbers || !this._lineNumbersElement || !this._editorElement) {
            return;
          }
          let tmpCode = this._editorElement.textContent || '';
          let tmpLineCount = tmpCode.split('\n').length;
          let tmpHTML = '';
          for (let i = 1; i <= tmpLineCount; i++) {
            tmpHTML += "<span>".concat(i, "</span>");
          }
          this._lineNumbersElement.innerHTML = tmpHTML;
        }

        /**
         * Reset inline styles that CodeJar sets on the editor element.
         *
         * CodeJar forces white-space:pre-wrap and overflow-wrap:break-word so
         * long lines wrap visually.  That breaks line-number alignment because
         * each wrapped visual row is not a logical line.  Resetting to pre /
         * normal makes the outer .pict-code-editor-wrap scroll horizontally.
         */
        _resetEditorWrapStyles() {
          if (!this._editorElement) {
            return;
          }
          this._editorElement.style.whiteSpace = 'pre';
          this._editorElement.style.overflowWrap = 'normal';
        }

        /**
         * Resolve the initial code content from address or default.
         *
         * @returns {string} The code content
         */
        _resolveCodeContent() {
          if (this.options.CodeDataAddress) {
            const tmpAddressSpace = {
              Fable: this.fable,
              Pict: this.fable,
              AppData: this.AppData,
              Bundle: this.Bundle,
              Options: this.options
            };
            let tmpAddressedData = this.fable.manifest.getValueByHash(tmpAddressSpace, this.options.CodeDataAddress);
            if (typeof tmpAddressedData === 'string') {
              return tmpAddressedData;
            } else {
              this.log.warn("PICT-Code Address [".concat(this.options.CodeDataAddress, "] did not return a string; it was ").concat(typeof tmpAddressedData, "."));
            }
          }
          return this.options.DefaultCode || '';
        }

        /**
         * Hook for subclasses to customize CodeJar options before instantiation.
         *
         * @param {object} pOptions - The CodeJar options object to modify
         */
        customConfigureEditorOptions(pOptions) {
          // Override in subclass to tweak options
        }

        /**
         * Called when the code content changes.  Override in subclasses to handle changes.
         *
         * @param {string} pCode - The new code content
         */
        onCodeChange(pCode) {
          // Write back to data address if configured
          if (this.options.CodeDataAddress) {
            const tmpAddressSpace = {
              Fable: this.fable,
              Pict: this.fable,
              AppData: this.AppData,
              Bundle: this.Bundle,
              Options: this.options
            };
            this.fable.manifest.setValueByHash(tmpAddressSpace, this.options.CodeDataAddress, pCode);
          }
        }

        // -- Public API Methods --

        /**
         * Get the current code content.
         *
         * @returns {string} The current code
         */
        getCode() {
          if (!this.codeJar) {
            this.log.warn('PICT-Code getCode called before editor initialized.');
            return '';
          }
          return this.codeJar.toString();
        }

        /**
         * Set the code content.
         *
         * @param {string} pCode - The code to set
         */
        setCode(pCode) {
          if (!this.codeJar) {
            this.log.warn('PICT-Code setCode called before editor initialized.');
            return;
          }
          this.codeJar.updateCode(pCode);
          this._updateLineNumbers();
        }

        /**
         * Change the editor language and re-highlight.
         *
         * @param {string} pLanguage - The language identifier
         */
        setLanguage(pLanguage) {
          this._language = pLanguage;
          this._highlightFunction = libCreateHighlighter(pLanguage);
          if (this._editorElement) {
            // Update the class
            this._editorElement.className = 'pict-code-editor language-' + pLanguage;
            if (!this.options.LineNumbers) {
              this._editorElement.className += ' pict-code-no-line-numbers';
            }
          }
          if (this.codeJar) {
            // Re-create the editor with the new highlight function
            let tmpCode = this.codeJar.toString();
            this.codeJar.destroy();
            this.codeJar = this._codeJarPrototype(this._editorElement, this._highlightFunction, {
              tab: this.options.Tab,
              catchTab: this.options.CatchTab,
              addClosing: this.options.AddClosing
            });
            this._resetEditorWrapStyles();
            this.codeJar.updateCode(tmpCode);
            this.codeJar.onUpdate(pCode => {
              this._updateLineNumbers();
              this.onCodeChange(pCode);
            });
          }
        }

        /**
         * Set a custom highlight function to replace the built-in highlighter.
         * Useful for integrating Prism.js, highlight.js, or any other library.
         *
         * @param {function} pHighlightFunction - A function that takes a DOM element and highlights its textContent
         */
        setHighlightFunction(pHighlightFunction) {
          if (typeof pHighlightFunction !== 'function') {
            this.log.error('PICT-Code setHighlightFunction requires a function.');
            return;
          }
          this._highlightFunction = pHighlightFunction;
          if (this.codeJar) {
            let tmpCode = this.codeJar.toString();
            this.codeJar.destroy();
            this.codeJar = this._codeJarPrototype(this._editorElement, this._highlightFunction, {
              tab: this.options.Tab,
              catchTab: this.options.CatchTab,
              addClosing: this.options.AddClosing
            });
            this._resetEditorWrapStyles();
            this.codeJar.updateCode(tmpCode);
            this.codeJar.onUpdate(pCode => {
              this._updateLineNumbers();
              this.onCodeChange(pCode);
            });
          }
        }

        /**
         * Set the read-only state of the editor.
         *
         * @param {boolean} pReadOnly - Whether the editor should be read-only
         */
        setReadOnly(pReadOnly) {
          this.options.ReadOnly = pReadOnly;
          if (this._editorElement) {
            this._editorElement.setAttribute('contenteditable', pReadOnly ? 'false' : 'true');
          }
        }

        /**
         * Destroy the editor and clean up.
         */
        destroy() {
          if (this.codeJar) {
            this.codeJar.destroy();
            this.codeJar = null;
          }
        }

        /**
         * Marshal code content from the data address into the view.
         */
        marshalToView() {
          super.marshalToView();
          if (this.codeJar && this.options.CodeDataAddress) {
            let tmpCode = this._resolveCodeContent();
            if (typeof tmpCode === 'string') {
              this.codeJar.updateCode(tmpCode);
              this._updateLineNumbers();
            }
          }
        }

        /**
         * Marshal the current code content back to the data address.
         */
        marshalFromView() {
          super.marshalFromView();
          if (this.codeJar && this.options.CodeDataAddress) {
            this.onCodeChange(this.codeJar.toString());
          }
        }
      }
      module.exports = PictSectionCode;
      module.exports.default_configuration = _DefaultConfiguration;
      module.exports.createHighlighter = libCreateHighlighter;
    }, {
      "./Pict-Code-Highlighter.js": 10,
      "./Pict-Section-Code-DefaultConfiguration.js": 11,
      "pict-view": 17
    }],
    13: [function (require, module, exports) {
      // The container for all the Pict-Section-Content related code.

      // The main content view class
      module.exports = require('./views/Pict-View-Content.js');

      // The content provider (markdown parsing, HTML escaping)
      module.exports.PictContentProvider = require('./providers/Pict-Provider-Content.js');
    }, {
      "./providers/Pict-Provider-Content.js": 14,
      "./views/Pict-View-Content.js": 15
    }],
    14: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const libCreateHighlighter = require('pict-section-code').createHighlighter;

      /**
       * Content Provider for Pict Section Content
       *
       * A general-purpose markdown-to-HTML parser with support for:
       * - Headings, paragraphs, lists, blockquotes, horizontal rules
       * - Fenced code blocks with language tags (nested fence support)
       * - Syntax highlighting and line numbers for code blocks (via pict-section-code)
       * - Tables (GFM pipe syntax)
       * - Mermaid diagram blocks
       * - KaTeX math (inline and display)
       * - Bold, italic, inline code, links, images
       *
       * Link resolution is customizable via an optional callback.
       */
      class PictContentProvider extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }

        /**
         * Highlight a code string using pict-section-code's syntax highlighter.
         * Uses a mock element to interface with the highlighter's DOM-based API.
         *
         * @param {string} pCode - The raw code string
         * @param {string} pLanguage - The language identifier (e.g. "javascript", "html")
         * @returns {string} The syntax-highlighted HTML
         */
        highlightCode(pCode, pLanguage) {
          if (!pCode) {
            return '';
          }
          let tmpHighlighter = libCreateHighlighter(pLanguage);
          // Create a mock element to interface with the highlighter
          let tmpMockElement = {
            textContent: pCode,
            innerHTML: ''
          };
          tmpHighlighter(tmpMockElement);
          return tmpMockElement.innerHTML;
        }

        /**
         * Generate line number HTML for a code block.
         *
         * @param {string} pCode - The raw code string
         * @returns {string} HTML string with line number spans
         */
        generateLineNumbers(pCode) {
          if (!pCode) {
            return '<span>1</span>';
          }
          let tmpLineCount = pCode.split('\n').length;
          let tmpHTML = '';
          for (let i = 1; i <= tmpLineCount; i++) {
            tmpHTML += '<span>' + i + '</span>';
          }
          return tmpHTML;
        }

        /**
         * Parse a markdown string into HTML.
         *
         * @param {string} pMarkdown - The raw markdown text
         * @param {Function} [pLinkResolver] - Optional callback for link resolution: (pHref, pLinkText) => { href, target, rel } or null
         * @param {Function} [pImageResolver] - Optional callback for image URL resolution: (pSrc, pAlt) => resolvedSrc or null
         * @returns {string} The parsed HTML
         */
        parseMarkdown(pMarkdown, pLinkResolver, pImageResolver) {
          if (!pMarkdown) {
            return '';
          }
          let tmpLines = pMarkdown.split('\n');
          let tmpHTML = [];
          let tmpInCodeBlock = false;
          let tmpCodeFenceLength = 0;
          let tmpCodeLang = '';
          let tmpCodeLines = [];
          let tmpInList = false;
          let tmpListType = '';
          let tmpInBlockquote = false;
          let tmpBlockquoteLines = [];
          let tmpInMathBlock = false;
          let tmpMathLines = [];
          let tmpParagraphLines = [];

          // Helper to flush accumulated paragraph lines into a single <p> tag
          let fFlushParagraph = () => {
            if (tmpParagraphLines.length > 0) {
              tmpHTML.push('<p>' + tmpParagraphLines.map(pLine => {
                return this.parseInline(pLine, pLinkResolver, pImageResolver);
              }).join(' ') + '</p>');
              tmpParagraphLines = [];
            }
          };
          for (let i = 0; i < tmpLines.length; i++) {
            let tmpLine = tmpLines[i];

            // Display math blocks ($$...$$) — skip if inside a code block
            if (!tmpInCodeBlock && tmpLine.trim().match(/^\$\$/)) {
              if (tmpInMathBlock) {
                // End math block
                tmpHTML.push('<div class="pict-content-katex-display">' + tmpMathLines.join('\n') + '</div>');
                tmpInMathBlock = false;
                tmpMathLines = [];
              } else {
                // Flush any pending paragraph
                fFlushParagraph();
                // Close any open list or blockquote
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                  tmpInList = false;
                }
                if (tmpInBlockquote) {
                  tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
                  tmpInBlockquote = false;
                  tmpBlockquoteLines = [];
                }
                tmpInMathBlock = true;
              }
              continue;
            }
            if (tmpInMathBlock) {
              tmpMathLines.push(tmpLine);
              continue;
            }

            // Code blocks (fenced) — track fence length so ````x```` nests around ```y```
            let tmpFenceMatch = tmpLine.match(/^(`{3,})/);
            if (tmpFenceMatch) {
              let tmpFenceLen = tmpFenceMatch[1].length;
              if (tmpInCodeBlock) {
                // Only close if the closing fence is at least as long as the opening
                if (tmpFenceLen >= tmpCodeFenceLength && tmpLine.trim() === tmpFenceMatch[1]) {
                  // End code block
                  if (tmpCodeLang === 'mermaid') {
                    // Mermaid diagrams: output raw content for client-side rendering
                    tmpHTML.push('<pre class="mermaid">' + tmpCodeLines.join('\n') + '</pre>');
                  } else {
                    let tmpCodeText = tmpCodeLines.join('\n');
                    let tmpHighlightedCode = this.highlightCode(tmpCodeText, tmpCodeLang);
                    let tmpLineNumbersHTML = this.generateLineNumbers(tmpCodeText);
                    tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">' + tmpLineNumbersHTML + '</div><pre><code class="language-' + this.escapeHTML(tmpCodeLang) + '">' + tmpHighlightedCode + '</code></pre></div>');
                  }
                  tmpInCodeBlock = false;
                  tmpCodeFenceLength = 0;
                  tmpCodeLang = '';
                  tmpCodeLines = [];
                  continue;
                } else {
                  // Inner fence with fewer backticks — treat as content
                  tmpCodeLines.push(tmpLine);
                  continue;
                }
              } else {
                // Flush any pending paragraph
                fFlushParagraph();
                // Close any open list or blockquote
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                  tmpInList = false;
                }
                if (tmpInBlockquote) {
                  tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
                  tmpInBlockquote = false;
                  tmpBlockquoteLines = [];
                }
                // Start code block — record fence length
                tmpCodeFenceLength = tmpFenceLen;
                tmpCodeLang = tmpLine.replace(/^`{3,}/, '').trim();
                tmpInCodeBlock = true;
                continue;
              }
            }
            if (tmpInCodeBlock) {
              tmpCodeLines.push(tmpLine);
              continue;
            }

            // Blockquotes
            if (tmpLine.match(/^>\s?/)) {
              if (!tmpInBlockquote) {
                // Flush any pending paragraph
                fFlushParagraph();
                // Close any open list
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                  tmpInList = false;
                }
                tmpInBlockquote = true;
                tmpBlockquoteLines = [];
              }
              tmpBlockquoteLines.push(tmpLine.replace(/^>\s?/, ''));
              continue;
            } else if (tmpInBlockquote) {
              tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
              tmpInBlockquote = false;
              tmpBlockquoteLines = [];
            }

            // Horizontal rule
            if (tmpLine.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
              fFlushParagraph();
              if (tmpInList) {
                tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                tmpInList = false;
              }
              tmpHTML.push('<hr>');
              continue;
            }

            // Headings
            let tmpHeadingMatch = tmpLine.match(/^(#{1,6})\s+(.+)/);
            if (tmpHeadingMatch) {
              fFlushParagraph();
              if (tmpInList) {
                tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                tmpInList = false;
              }
              let tmpLevel = tmpHeadingMatch[1].length;
              let tmpText = this.parseInline(tmpHeadingMatch[2], pLinkResolver, pImageResolver);
              let tmpID = tmpHeadingMatch[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
              tmpHTML.push('<h' + tmpLevel + ' id="' + tmpID + '">' + tmpText + '</h' + tmpLevel + '>');
              continue;
            }

            // Unordered list items
            let tmpULMatch = tmpLine.match(/^(\s*)[-*+]\s+(.*)/);
            if (tmpULMatch) {
              fFlushParagraph();
              if (!tmpInList || tmpListType !== 'ul') {
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                }
                tmpHTML.push('<ul>');
                tmpInList = true;
                tmpListType = 'ul';
              }
              tmpHTML.push('<li>' + this.parseInline(tmpULMatch[2], pLinkResolver, pImageResolver) + '</li>');
              continue;
            }

            // Ordered list items
            let tmpOLMatch = tmpLine.match(/^(\s*)\d+\.\s+(.*)/);
            if (tmpOLMatch) {
              fFlushParagraph();
              if (!tmpInList || tmpListType !== 'ol') {
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                }
                tmpHTML.push('<ol>');
                tmpInList = true;
                tmpListType = 'ol';
              }
              tmpHTML.push('<li>' + this.parseInline(tmpOLMatch[2], pLinkResolver, pImageResolver) + '</li>');
              continue;
            }

            // Close list if we've left list items
            if (tmpInList && tmpLine.trim() !== '') {
              tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
              tmpInList = false;
            }

            // Empty line — flush any accumulated paragraph
            if (tmpLine.trim() === '') {
              fFlushParagraph();
              continue;
            }

            // Table detection
            if (tmpLine.match(/^\|/) && i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|[\s-:|]+\|/)) {
              fFlushParagraph();
              // Close any open list
              if (tmpInList) {
                tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                tmpInList = false;
              }
              let tmpTableHTML = '<table>';

              // Header row
              let tmpHeaders = tmpLine.split('|').filter(pCell => {
                return pCell.trim() !== '';
              });
              tmpTableHTML += '<thead><tr>';
              for (let h = 0; h < tmpHeaders.length; h++) {
                tmpTableHTML += '<th>' + this.parseInline(tmpHeaders[h].trim(), pLinkResolver, pImageResolver) + '</th>';
              }
              tmpTableHTML += '</tr></thead>';

              // Skip separator row
              i++;

              // Body rows
              tmpTableHTML += '<tbody>';
              while (i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|/)) {
                i++;
                let tmpCells = tmpLines[i].split('|').filter(pCell => {
                  return pCell.trim() !== '';
                });
                tmpTableHTML += '<tr>';
                for (let c = 0; c < tmpCells.length; c++) {
                  tmpTableHTML += '<td>' + this.parseInline(tmpCells[c].trim(), pLinkResolver, pImageResolver) + '</td>';
                }
                tmpTableHTML += '</tr>';
              }
              tmpTableHTML += '</tbody></table>';
              tmpHTML.push(tmpTableHTML);
              continue;
            }

            // Accumulate paragraph lines — consecutive non-blank text lines
            // will be joined into a single <p> tag when flushed
            tmpParagraphLines.push(tmpLine);
          }

          // Flush any remaining accumulated paragraph
          fFlushParagraph();

          // Close any trailing open elements
          if (tmpInList) {
            tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
          }
          if (tmpInBlockquote) {
            tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
          }
          if (tmpInCodeBlock) {
            let tmpCodeText = tmpCodeLines.join('\n');
            let tmpHighlightedCode = this.highlightCode(tmpCodeText, tmpCodeLang);
            let tmpLineNumbersHTML = this.generateLineNumbers(tmpCodeText);
            tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">' + tmpLineNumbersHTML + '</div><pre><code>' + tmpHighlightedCode + '</code></pre></div>');
          }
          return tmpHTML.join('\n');
        }

        /**
         * Parse inline markdown elements (bold, italic, code, links, images, KaTeX).
         *
         * @param {string} pText - The text to parse
         * @param {Function} [pLinkResolver] - Optional callback: (pHref, pLinkText) => { href, target, rel } or null
         * @param {Function} [pImageResolver] - Optional callback: (pSrc, pAlt) => resolvedSrc or null
         * @returns {string} HTML with inline elements
         */
        parseInline(pText, pLinkResolver, pImageResolver) {
          if (!pText) {
            return '';
          }
          let tmpResult = pText;

          // Extract inline code spans into placeholders so bold/italic regexes don't mangle their contents
          let tmpCodeSpans = [];
          tmpResult = tmpResult.replace(/`([^`]+)`/g, (pMatch, pCode) => {
            let tmpIndex = tmpCodeSpans.length;
            tmpCodeSpans.push('<code>' + pCode + '</code>');
            return '\x00CODEINLINE' + tmpIndex + '\x00';
          });

          // Inline LaTeX equations ($...$) — must be processed before other inline patterns
          // Match single $ delimiters that aren't adjacent to spaces (to avoid false positives with currency)
          tmpResult = tmpResult.replace(/\$([^\$\s][^\$]*?[^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');
          // Also match single-character inline math like $x$
          tmpResult = tmpResult.replace(/\$([^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');

          // Images
          tmpResult = tmpResult.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (pMatch, pAlt, pSrc) => {
            let tmpSrc = pSrc;
            if (typeof pImageResolver === 'function') {
              let tmpResolved = pImageResolver(pSrc, pAlt);
              if (tmpResolved) {
                tmpSrc = tmpResolved;
              }
            }
            return '<img src="' + tmpSrc + '" alt="' + pAlt + '">';
          });

          // Links
          tmpResult = tmpResult.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (pMatch, pLinkText, pHref) => {
            if (typeof pLinkResolver === 'function') {
              let tmpResolved = pLinkResolver(pHref, pLinkText);
              if (tmpResolved) {
                let tmpTarget = tmpResolved.target ? ' target="' + tmpResolved.target + '"' : '';
                let tmpRel = tmpResolved.rel ? ' rel="' + tmpResolved.rel + '"' : '';
                return '<a href="' + tmpResolved.href + '"' + tmpTarget + tmpRel + '>' + pLinkText + '</a>';
              }
            }
            // Default behavior: external links open in new tab
            if (pHref.match(/^https?:\/\//)) {
              return '<a href="' + pHref + '" target="_blank" rel="noopener">' + pLinkText + '</a>';
            }
            return '<a href="' + pHref + '">' + pLinkText + '</a>';
          });

          // Bold
          tmpResult = tmpResult.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          tmpResult = tmpResult.replace(/__([^_]+)__/g, '<strong>$1</strong>');

          // Italic
          tmpResult = tmpResult.replace(/\*([^*]+)\*/g, '<em>$1</em>');
          tmpResult = tmpResult.replace(/_([^_]+)_/g, '<em>$1</em>');

          // Restore inline code spans from placeholders
          tmpResult = tmpResult.replace(/\x00CODEINLINE(\d+)\x00/g, (pMatch, pIndex) => {
            return tmpCodeSpans[parseInt(pIndex)];
          });
          return tmpResult;
        }

        /**
         * Escape HTML special characters.
         *
         * @param {string} pText - The text to escape
         * @returns {string} The escaped text
         */
        escapeHTML(pText) {
          if (!pText) {
            return '';
          }
          return pText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
      }
      module.exports = PictContentProvider;
      module.exports.default_configuration = {
        ProviderIdentifier: "Pict-Content",
        AutoInitialize: true,
        AutoInitializeOrdinal: 0
      };
    }, {
      "pict-provider": 9,
      "pict-section-code": 12
    }],
    15: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Content",
        DefaultRenderable: "Pict-Content-Display",
        DefaultDestinationAddress: "#Pict-Content-Container",
        AutoRender: false,
        CSS: /*css*/"\n\t\t.pict-content {\n\t\t\tpadding: 2em 3em;\n\t\t\tmax-width: 900px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t.pict-content-loading {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tmin-height: 200px;\n\t\t\tcolor: #8A7F72;\n\t\t\tfont-size: 1em;\n\t\t}\n\t\t.pict-content h1 {\n\t\t\tfont-size: 2em;\n\t\t\tcolor: #3D3229;\n\t\t\tborder-bottom: 1px solid #DDD6CA;\n\t\t\tpadding-bottom: 0.3em;\n\t\t\tmargin-top: 0;\n\t\t}\n\t\t.pict-content h2 {\n\t\t\tfont-size: 1.5em;\n\t\t\tcolor: #3D3229;\n\t\t\tborder-bottom: 1px solid #EAE3D8;\n\t\t\tpadding-bottom: 0.25em;\n\t\t\tmargin-top: 1.5em;\n\t\t}\n\t\t.pict-content h3 {\n\t\t\tfont-size: 1.25em;\n\t\t\tcolor: #3D3229;\n\t\t\tmargin-top: 1.25em;\n\t\t}\n\t\t.pict-content h4, .pict-content h5, .pict-content h6 {\n\t\t\tcolor: #5E5549;\n\t\t\tmargin-top: 1em;\n\t\t}\n\t\t.pict-content p {\n\t\t\tline-height: 1.7;\n\t\t\tcolor: #423D37;\n\t\t\tmargin: 0.75em 0;\n\t\t}\n\t\t.pict-content a {\n\t\t\tcolor: #2E7D74;\n\t\t\ttext-decoration: none;\n\t\t}\n\t\t.pict-content a:hover {\n\t\t\ttext-decoration: underline;\n\t\t}\n\t\t.pict-content-code-wrap {\n\t\t\tposition: relative;\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;\n\t\t\tfont-size: 14px;\n\t\t\tline-height: 1.5;\n\t\t\tborder-radius: 6px;\n\t\t\toverflow: auto;\n\t\t\tmargin: 1em 0;\n\t\t\tbackground: #3D3229;\n\t\t}\n\t\t.pict-content-code-wrap .pict-content-code-line-numbers {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\twidth: 40px;\n\t\t\tpadding: 1.25em 0;\n\t\t\ttext-align: right;\n\t\t\tbackground: #342A22;\n\t\t\tborder-right: 1px solid #4A3F35;\n\t\t\tcolor: #8A7F72;\n\t\t\tfont-size: 13px;\n\t\t\tline-height: 1.5;\n\t\t\tuser-select: none;\n\t\t\tpointer-events: none;\n\t\t\tbox-sizing: border-box;\n\t\t}\n\t\t.pict-content-code-wrap .pict-content-code-line-numbers span {\n\t\t\tdisplay: block;\n\t\t\tpadding: 0 8px 0 0;\n\t\t}\n\t\t.pict-content-code-wrap pre {\n\t\t\tmargin: 0;\n\t\t\tbackground: #3D3229;\n\t\t\tcolor: #E8E0D4;\n\t\t\tpadding: 1.25em 1.25em 1.25em 52px;\n\t\t\tborder-radius: 6px;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: inherit;\n\t\t}\n\t\t.pict-content-code-wrap pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t\tfont-family: inherit;\n\t\t}\n\t\t.pict-content-code-wrap .keyword { color: #C678DD; }\n\t\t.pict-content-code-wrap .string { color: #98C379; }\n\t\t.pict-content-code-wrap .number { color: #D19A66; }\n\t\t.pict-content-code-wrap .comment { color: #7F848E; font-style: italic; }\n\t\t.pict-content-code-wrap .operator { color: #56B6C2; }\n\t\t.pict-content-code-wrap .punctuation { color: #E8E0D4; }\n\t\t.pict-content-code-wrap .function-name { color: #61AFEF; }\n\t\t.pict-content-code-wrap .property { color: #E06C75; }\n\t\t.pict-content-code-wrap .tag { color: #E06C75; }\n\t\t.pict-content-code-wrap .attr-name { color: #D19A66; }\n\t\t.pict-content-code-wrap .attr-value { color: #98C379; }\n\t\t.pict-content pre {\n\t\t\tbackground: #3D3229;\n\t\t\tcolor: #E8E0D4;\n\t\t\tpadding: 1.25em;\n\t\t\tborder-radius: 6px;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: 0.9em;\n\t\t}\n\t\t.pict-content code {\n\t\t\tbackground: #F0ECE4;\n\t\t\tpadding: 0.15em 0.4em;\n\t\t\tborder-radius: 3px;\n\t\t\tfont-size: 0.9em;\n\t\t\tcolor: #9E6B47;\n\t\t}\n\t\t.pict-content pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t}\n\t\t.pict-content blockquote {\n\t\t\tborder-left: 4px solid #2E7D74;\n\t\t\tmargin: 1em 0;\n\t\t\tpadding: 0.5em 1em;\n\t\t\tbackground: #F7F5F0;\n\t\t\tcolor: #5E5549;\n\t\t}\n\t\t.pict-content blockquote p {\n\t\t\tmargin: 0.25em 0;\n\t\t}\n\t\t.pict-content ul, .pict-content ol {\n\t\t\tpadding-left: 2em;\n\t\t\tline-height: 1.8;\n\t\t}\n\t\t.pict-content li {\n\t\t\tmargin: 0.25em 0;\n\t\t\tcolor: #423D37;\n\t\t}\n\t\t.pict-content hr {\n\t\t\tborder: none;\n\t\t\tborder-top: 1px solid #DDD6CA;\n\t\t\tmargin: 2em 0;\n\t\t}\n\t\t.pict-content table {\n\t\t\twidth: 100%;\n\t\t\tborder-collapse: collapse;\n\t\t\tmargin: 1em 0;\n\t\t}\n\t\t.pict-content table th {\n\t\t\tbackground: #F5F0E8;\n\t\t\tborder: 1px solid #DDD6CA;\n\t\t\tpadding: 0.6em 0.8em;\n\t\t\ttext-align: left;\n\t\t\tfont-weight: 600;\n\t\t\tcolor: #3D3229;\n\t\t}\n\t\t.pict-content table td {\n\t\t\tborder: 1px solid #DDD6CA;\n\t\t\tpadding: 0.5em 0.8em;\n\t\t\tcolor: #423D37;\n\t\t}\n\t\t.pict-content table tr:nth-child(even) {\n\t\t\tbackground: #F7F5F0;\n\t\t}\n\t\t.pict-content img {\n\t\t\tmax-width: 100%;\n\t\t\theight: auto;\n\t\t}\n\t\t.pict-content pre.mermaid {\n\t\t\tbackground: #fff;\n\t\t\tcolor: #3D3229;\n\t\t\ttext-align: center;\n\t\t\tpadding: 1em;\n\t\t}\n\t\t.pict-content .pict-content-katex-display {\n\t\t\ttext-align: center;\n\t\t\tmargin: 1em 0;\n\t\t\tpadding: 0.5em;\n\t\t\toverflow-x: auto;\n\t\t}\n\t\t.pict-content .pict-content-katex-inline {\n\t\t\tdisplay: inline;\n\t\t}\n\t",
        Templates: [{
          Hash: "Pict-Content-Template",
          Template: /*html*/"\n<div class=\"pict-content\" id=\"Pict-Content-Body\">\n\t<div class=\"pict-content-loading\">Loading content...</div>\n</div>\n"
        }],
        Renderables: [{
          RenderableHash: "Pict-Content-Display",
          TemplateHash: "Pict-Content-Template",
          DestinationAddress: "#Pict-Content-Container",
          RenderMethod: "replace"
        }]
      };
      class PictContentView extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }

        /**
         * Display parsed HTML content in the content area.
         *
         * @param {string} pHTMLContent - The HTML to display
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        displayContent(pHTMLContent, pContainerID) {
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          this.pict.ContentAssignment.assignContent('#' + tmpContainerID, pHTMLContent);

          // Scroll to top of content area
          let tmpContentContainer = document.getElementById(tmpContainerID);
          if (tmpContentContainer && tmpContentContainer.parentElement) {
            tmpContentContainer.parentElement.scrollTop = 0;
          }

          // Post-render: initialize Mermaid diagrams if mermaid is available
          this.renderMermaidDiagrams(tmpContainerID);

          // Post-render: render KaTeX equations if katex is available
          this.renderKaTeXEquations(tmpContainerID);
        }

        /**
         * Render any Mermaid diagram blocks in the content area.
         * Mermaid blocks are `<pre class="mermaid">` elements produced by parseMarkdown.
         *
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        renderMermaidDiagrams(pContainerID) {
          if (typeof mermaid === 'undefined') {
            return;
          }
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpContentBody = document.getElementById(tmpContainerID);
          if (!tmpContentBody) {
            return;
          }
          let tmpMermaidElements = tmpContentBody.querySelectorAll('pre.mermaid');
          if (tmpMermaidElements.length < 1) {
            return;
          }

          // mermaid.run() will process all pre.mermaid elements in the container
          try {
            mermaid.run({
              nodes: tmpMermaidElements
            });
          } catch (pError) {
            this.log.error('Mermaid rendering error: ' + pError.message);
          }
        }

        /**
         * Render KaTeX inline and display math elements in the content area.
         * Inline: `<span class="pict-content-katex-inline">`
         * Display: `<div class="pict-content-katex-display">`
         *
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        renderKaTeXEquations(pContainerID) {
          if (typeof katex === 'undefined') {
            return;
          }
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpContentBody = document.getElementById(tmpContainerID);
          if (!tmpContentBody) {
            return;
          }

          // Render inline math
          let tmpInlineElements = tmpContentBody.querySelectorAll('.pict-content-katex-inline');
          for (let i = 0; i < tmpInlineElements.length; i++) {
            try {
              katex.render(tmpInlineElements[i].textContent, tmpInlineElements[i], {
                throwOnError: false,
                displayMode: false
              });
            } catch (pError) {
              this.log.warn('KaTeX inline error: ' + pError.message);
            }
          }

          // Render display math
          let tmpDisplayElements = tmpContentBody.querySelectorAll('.pict-content-katex-display');
          for (let i = 0; i < tmpDisplayElements.length; i++) {
            try {
              katex.render(tmpDisplayElements[i].textContent, tmpDisplayElements[i], {
                throwOnError: false,
                displayMode: true
              });
            } catch (pError) {
              this.log.warn('KaTeX display error: ' + pError.message);
            }
          }
        }

        /**
         * Show a loading indicator.
         *
         * @param {string} [pMessage] - Loading message (defaults to 'Loading content...')
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        showLoading(pMessage, pContainerID) {
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpMessage = pMessage || 'Loading content...';
          this.pict.ContentAssignment.assignContent('#' + tmpContainerID, '<div class="pict-content-loading">' + tmpMessage + '</div>');
        }
      }
      module.exports = PictContentView;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 17
    }],
    16: [function (require, module, exports) {
      module.exports = {
        "name": "pict-view",
        "version": "1.0.67",
        "description": "Pict View Base Class",
        "main": "source/Pict-View.js",
        "scripts": {
          "test": "npx quack test",
          "tests": "npx quack test -g",
          "start": "node source/Pict-View.js",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-view-image:local",
          "docker-dev-run": "docker run -it -d --name pict-view-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-view\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-view-image:local",
          "docker-dev-shell": "docker exec -it pict-view-dev /bin/bash",
          "types": "tsc -p .",
          "lint": "eslint source/**"
        },
        "types": "types/source/Pict-View.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-view.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-view/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-view#readme",
        "devDependencies": {
          "@eslint/js": "^9.39.1",
          "browser-env": "^3.3.0",
          "eslint": "^9.39.1",
          "pict": "^1.0.348",
          "quackage": "^1.0.58",
          "typescript": "^5.9.3"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "dependencies": {
          "fable": "^3.1.63",
          "fable-serviceproviderbase": "^3.0.19"
        }
      };
    }, {}],
    17: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictViewSettings = {
        DefaultRenderable: false,
        DefaultDestinationAddress: false,
        DefaultTemplateRecordAddress: false,
        ViewIdentifier: false,
        // If this is set to true, when the App initializes this will.
        // After the App initializes, initialize will be called as soon as it's added.
        AutoInitialize: true,
        AutoInitializeOrdinal: 0,
        // If this is set to true, when the App autorenders (on load) this will.
        // After the App initializes, render will be called as soon as it's added.
        AutoRender: true,
        AutoRenderOrdinal: 0,
        AutoSolveWithApp: true,
        AutoSolveOrdinal: 0,
        CSSHash: false,
        CSS: false,
        CSSProvider: false,
        CSSPriority: 500,
        Templates: [],
        DefaultTemplates: [],
        Renderables: [],
        Manifests: {}
      };

      /** @typedef {(error?: Error) => void} ErrorCallback */
      /** @typedef {number | boolean} PictTimestamp */

      /**
       * @typedef {'replace' | 'append' | 'prepend' | 'append_once' | 'virtual-assignment'} RenderMethod
       */
      /**
       * @typedef {Object} Renderable
       *
       * @property {string} RenderableHash - A unique hash for the renderable.
       * @property {string} TemplateHash - The hash of the template to use for rendering this renderable.
       * @property {string} [DefaultTemplateRecordAddress] - The default address for resolving the data record for this renderable.
       * @property {string} [ContentDestinationAddress] - The default address (DOM CSS selector) for rendering the content of this renderable.
       * @property {RenderMethod} [RenderMethod=replace] - The method to use when projecting the renderable to the DOM ('replace', 'append', 'prepend', 'append_once', 'virtual-assignment').
       * @property {string} [TestAddress] - The address to use for testing the renderable.
       * @property {string} [TransactionHash] - The transaction hash for the root renderable.
       * @property {string} [RootRenderableViewHash] - The hash of the root renderable.
       * @property {string} [Content] - The rendered content for this renderable, if applicable.
       */

      /**
       * Represents a view in the Pict ecosystem.
       */
      class PictView extends libFableServiceBase {
        /**
         * @param {any} pFable - The Fable object that this service is attached to.
         * @param {any} [pOptions] - (optional) The options for this service.
         * @param {string} [pServiceHash] - (optional) The hash of the service.
         */
        constructor(pFable, pOptions, pServiceHash) {
          // Intersect default options, parent constructor, service information
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictViewSettings)), pOptions);
          super(pFable, tmpOptions, pServiceHash);
          //FIXME: add types to fable and ancillaries
          /** @type {any} */
          this.fable;
          /** @type {any} */
          this.options;
          /** @type {String} */
          this.UUID;
          /** @type {String} */
          this.Hash;
          /** @type {any} */
          this.log;
          const tmpHashIsUUID = this.Hash === this.UUID;
          //NOTE: since many places are using the view UUID as the HTML element ID, we prefix it to avoid starting with a number
          this.UUID = "V-".concat(this.UUID);
          if (tmpHashIsUUID) {
            this.Hash = this.UUID;
          }
          if (!this.options.ViewIdentifier) {
            this.options.ViewIdentifier = "AutoViewID-".concat(this.fable.getUUID());
          }
          this.serviceType = 'PictView';
          /** @type {Record<string, any>} */
          this._Package = libPackage;
          // Convenience and consistency naming
          /** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, instantiateServiceProviderIfNotExists: (hash: string) => any, TransactionTracking: import('pict/types/source/services/Fable-Service-TransactionTracking') }} */
          this.pict = this.fable;
          // Wire in the essential Pict application state
          this.AppData = this.pict.AppData;
          this.Bundle = this.pict.Bundle;

          /** @type {PictTimestamp} */
          this.initializeTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastSolvedTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastRenderedTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastMarshalFromViewTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastMarshalToViewTimestamp = false;
          this.pict.instantiateServiceProviderIfNotExists('TransactionTracking');

          // Load all templates from the array in the options
          // Templates are in the form of {Hash:'Some-Template-Hash',Template:'Template content',Source:'TemplateSource'}
          for (let i = 0; i < this.options.Templates.length; i++) {
            let tmpTemplate = this.options.Templates[i];
            if (!('Hash' in tmpTemplate) || !('Template' in tmpTemplate)) {
              this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Template ").concat(i, " in the options array."), tmpTemplate);
            } else {
              if (!tmpTemplate.Source) {
                tmpTemplate.Source = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addTemplate(tmpTemplate.Hash, tmpTemplate.Template, tmpTemplate.Source);
            }
          }

          // Load all default templates from the array in the options
          // Templates are in the form of {Prefix:'',Postfix:'-List-Row',Template:'Template content',Source:'TemplateSourceString'}
          for (let i = 0; i < this.options.DefaultTemplates.length; i++) {
            let tmpDefaultTemplate = this.options.DefaultTemplates[i];
            if (!('Postfix' in tmpDefaultTemplate) || !('Template' in tmpDefaultTemplate)) {
              this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Default Template ").concat(i, " in the options array."), tmpDefaultTemplate);
            } else {
              if (!tmpDefaultTemplate.Source) {
                tmpDefaultTemplate.Source = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix, tmpDefaultTemplate.Postfix, tmpDefaultTemplate.Template, tmpDefaultTemplate.Source);
            }
          }

          // Load the CSS if it's available
          if (this.options.CSS) {
            let tmpCSSHash = this.options.CSSHash ? this.options.CSSHash : "View-".concat(this.options.ViewIdentifier);
            let tmpCSSProvider = this.options.CSSProvider ? this.options.CSSProvider : tmpCSSHash;
            this.pict.CSSMap.addCSS(tmpCSSHash, this.options.CSS, tmpCSSProvider, this.options.CSSPriority);
          }

          // Load all renderables
          // Renderables are launchable renderable instructions with templates
          // They look as such: {Identifier:'ContentEntry', TemplateHash:'Content-Entry-Section-Main', ContentDestinationAddress:'#ContentSection', RecordAddress:'AppData.Content.DefaultText', ManifestTransformation:'ManyfestHash', ManifestDestinationAddress:'AppData.Content.DataToTransformContent'}
          // The only parts that are necessary are Identifier and Template
          // A developer can then do render('ContentEntry') and it just kinda works.  Or they can override the ContentDestinationAddress
          /** @type {Record<String, Renderable>} */
          this.renderables = {};
          for (let i = 0; i < this.options.Renderables.length; i++) {
            /** @type {Renderable} */
            let tmpRenderable = this.options.Renderables[i];
            this.addRenderable(tmpRenderable);
          }
        }

        /**
         * Adds a renderable to the view.
         *
         * @param {string | Renderable} pRenderableHash - The hash of the renderable, or a renderable object.
         * @param {string} [pTemplateHash] - (optional) The hash of the template for the renderable.
         * @param {string} [pDefaultTemplateRecordAddress] - (optional) The default data address for the template.
         * @param {string} [pDefaultDestinationAddress] - (optional) The default destination address for the renderable.
         * @param {RenderMethod} [pRenderMethod=replace] - (optional) The method to use when rendering the renderable (ex. 'replace').
         */
        addRenderable(pRenderableHash, pTemplateHash, pDefaultTemplateRecordAddress, pDefaultDestinationAddress, pRenderMethod) {
          /** @type {Renderable} */
          let tmpRenderable;
          if (typeof pRenderableHash == 'object') {
            // The developer passed in the renderable as an object.
            // Use theirs instead!
            tmpRenderable = pRenderableHash;
          } else {
            /** @type {RenderMethod} */
            let tmpRenderMethod = typeof pRenderMethod !== 'string' ? pRenderMethod : 'replace';
            tmpRenderable = {
              RenderableHash: pRenderableHash,
              TemplateHash: pTemplateHash,
              DefaultTemplateRecordAddress: pDefaultTemplateRecordAddress,
              ContentDestinationAddress: pDefaultDestinationAddress,
              RenderMethod: tmpRenderMethod
            };
          }
          if (typeof tmpRenderable.RenderableHash != 'string' || typeof tmpRenderable.TemplateHash != 'string') {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Renderable; RenderableHash or TemplateHash are invalid."), tmpRenderable);
          } else {
            if (this.pict.LogNoisiness > 0) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " adding renderable [").concat(tmpRenderable.RenderableHash, "] pointed to template ").concat(tmpRenderable.TemplateHash, "."));
            }
            this.renderables[tmpRenderable.RenderableHash] = tmpRenderable;
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                        Code Section: Initialization                        */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is initialized.
         */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when the view is initialized.
         */
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }

        /**
         * Performs view initialization.
         */
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            this.onInitialize();
            this.onAfterInitialize();
            this.initializeTimestamp = this.pict.log.getTimeStamp();
            return true;
          } else {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }

        /**
         * Performs view initialization (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initializeAsync:"));
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 0) {
              this.log.info("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " beginning initialization..."));
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            tmpAnticipate.wait(/** @param {Error} pError */
            pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialization failed: ").concat(pError.message || pError), {
                  stack: pError.stack
                });
              }
              this.initializeTimestamp = this.pict.log.getTimeStamp();
              if (this.pict.LogNoisiness > 0) {
                this.log.info("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialization complete."));
              }
              return fCallback();
            });
          } else {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return fCallback();
          }
        }
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                            Code Section: Render                            */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is rendered.
         *
         * @param {Renderable} pRenderable - The renderable that will be rendered.
         */
        onBeforeRender(pRenderable) {
          // Overload this to mess with stuff before the content gets generated from the template
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeRender:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is rendered (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that will be rendered.
         */
        onBeforeRenderAsync(fCallback, pRenderable) {
          this.onBeforeRender(pRenderable);
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers before the view is projected into the DOM.
         *
         * @param {Renderable} pRenderable - The renderable that will be projected.
         */
        onBeforeProject(pRenderable) {
          // Overload this to mess with stuff before the content gets generated from the template
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeProject:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is projected into the DOM (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that will be projected.
         */
        onBeforeProjectAsync(fCallback, pRenderable) {
          this.onBeforeProject(pRenderable);
          return fCallback();
        }

        /**
         * Builds the render options for a renderable.
         *
         * For DRY purposes on the three flavors of render.
         *
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          let tmpRenderOptions = {
            Valid: true
          };
          tmpRenderOptions.RenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;
          if (!tmpRenderOptions.RenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not find a suitable RenderableHash ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable."));
            tmpRenderOptions.Valid = false;
          }
          tmpRenderOptions.Renderable = this.renderables[tmpRenderOptions.RenderableHash];
          if (!tmpRenderOptions.Renderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            tmpRenderOptions.Valid = false;
          }
          tmpRenderOptions.DestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderOptions.Renderable.ContentDestinationAddress === 'string' ? tmpRenderOptions.Renderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : false;
          if (!tmpRenderOptions.DestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address (param ").concat(pRenderDestinationAddress, ")."));
            tmpRenderOptions.Valid = false;
          }
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRenderOptions.RecordAddress = 'Passed in as object';
            tmpRenderOptions.Record = pTemplateRecordAddress;
          } else {
            tmpRenderOptions.RecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderOptions.Renderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderOptions.Renderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRenderOptions.Record = typeof tmpRenderOptions.RecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRenderOptions.RecordAddress) : undefined;
          }
          return tmpRenderOptions;
        }

        /**
         * Assigns the content to the destination address.
         *
         * For DRY purposes on the three flavors of render.
         *
         * @param {Renderable} pRenderable - The renderable to render.
         * @param {string} pRenderDestinationAddress - The address where the renderable will be rendered.
         * @param {string} pContent - The content to render.
         * @returns {boolean} - Returns true if the content was assigned successfully.
         * @memberof PictView
         */
        assignRenderContent(pRenderable, pRenderDestinationAddress, pContent) {
          return this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod, pRenderDestinationAddress, pContent, pRenderable.TestAddress);
        }

        /**
         * Render a renderable from this view.
         *
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @return {boolean}
         */
        render(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable) {
          return this.renderWithScope(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable);
        }

        /**
         * Render a renderable from this view, providing a specifici scope for the template.
         *
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @return {boolean}
         */
        renderWithScope(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable) {
          let tmpRenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;
          if (!tmpRenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it is not a valid renderable."));
            return false;
          }

          /** @type {Renderable} */
          let tmpRenderable;
          if (tmpRenderableHash == '__Virtual') {
            tmpRenderable = {
              RenderableHash: '__Virtual',
              TemplateHash: this.renderables[this.options.DefaultRenderable].TemplateHash,
              ContentDestinationAddress: typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null,
              RenderMethod: 'virtual-assignment',
              TransactionHash: pRootRenderable && pRootRenderable.TransactionHash,
              RootRenderableViewHash: pRootRenderable && pRootRenderable.RootRenderableViewHash
            };
          } else {
            tmpRenderable = Object.assign({}, this.renderables[tmpRenderableHash]);
            tmpRenderable.ContentDestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null;
          }
          if (!tmpRenderable.TransactionHash) {
            tmpRenderable.TransactionHash = "ViewRender-V-".concat(this.options.ViewIdentifier, "-R-").concat(tmpRenderableHash, "-U-").concat(this.pict.getUUID());
            tmpRenderable.RootRenderableViewHash = this.Hash;
            this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);
          }
          if (!tmpRenderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            return false;
          }
          if (!tmpRenderable.ContentDestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address."));
            return false;
          }
          let tmpRecordAddress;
          let tmpRecord;
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRecord = pTemplateRecordAddress;
            tmpRecordAddress = 'Passed in as object';
          } else {
            tmpRecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRecord = typeof tmpRecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRecordAddress) : undefined;
          }

          // Execute the developer-overridable pre-render behavior
          this.onBeforeRender(tmpRenderable);
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderable.ContentDestinationAddress, "] TemplateRecordAddress[").concat(tmpRecordAddress, "] render:"));
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Beginning Render of Renderable[").concat(tmpRenderableHash, "] to Destination [").concat(tmpRenderable.ContentDestinationAddress, "]..."));
          }
          // Generate the content output from the template and data
          tmpRenderable.Content = this.pict.parseTemplateByHash(tmpRenderable.TemplateHash, tmpRecord, null, [this], pScope, {
            RootRenderable: typeof pRootRenderable === 'object' ? pRootRenderable : tmpRenderable
          });
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Assigning Renderable[").concat(tmpRenderableHash, "] content length ").concat(tmpRenderable.Content.length, " to Destination [").concat(tmpRenderable.ContentDestinationAddress, "] using render method [").concat(tmpRenderable.RenderMethod, "]."));
          }
          this.onBeforeProject(tmpRenderable);
          this.onProject(tmpRenderable);
          if (tmpRenderable.RenderMethod !== 'virtual-assignment') {
            this.onAfterProject(tmpRenderable);

            // Execute the developer-overridable post-render behavior
            this.onAfterRender(tmpRenderable);
          }
          return true;
        }

        /**
         * Render a renderable from this view.
         *
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         *
         * @return {void}
         */
        renderAsync(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback) {
          return this.renderWithScopeAsync(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback);
        }

        /**
         * Render a renderable from this view.
         *
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         *
         * @return {void}
         */
        renderWithScopeAsync(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback) {
          let tmpRenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;

          // Allow the callback to be passed in as the last parameter no matter what
          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateRecordAddress === 'function' ? pTemplateRecordAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : typeof pRootRenderable === 'function' ? pRootRenderable : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (!tmpRenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not asynchronously render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable."));
            return tmpCallback(new Error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not asynchronously render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable.")));
          }

          /** @type {Renderable} */
          let tmpRenderable;
          if (tmpRenderableHash == '__Virtual') {
            tmpRenderable = {
              RenderableHash: '__Virtual',
              TemplateHash: this.renderables[this.options.DefaultRenderable].TemplateHash,
              ContentDestinationAddress: typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null,
              RenderMethod: 'virtual-assignment',
              TransactionHash: pRootRenderable && typeof pRootRenderable !== 'function' && pRootRenderable.TransactionHash,
              RootRenderableViewHash: pRootRenderable && typeof pRootRenderable !== 'function' && pRootRenderable.RootRenderableViewHash
            };
          } else {
            tmpRenderable = Object.assign({}, this.renderables[tmpRenderableHash]);
            tmpRenderable.ContentDestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null;
          }
          if (!tmpRenderable.TransactionHash) {
            tmpRenderable.TransactionHash = "ViewRender-V-".concat(this.options.ViewIdentifier, "-R-").concat(tmpRenderableHash, "-U-").concat(this.pict.getUUID());
            tmpRenderable.RootRenderableViewHash = this.Hash;
            this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);
          }
          if (!tmpRenderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            return tmpCallback(new Error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist.")));
          }
          if (!tmpRenderable.ContentDestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address."));
            return tmpCallback(new Error("Could not render ".concat(tmpRenderableHash)));
          }
          let tmpRecordAddress;
          let tmpRecord;
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRecord = pTemplateRecordAddress;
            tmpRecordAddress = 'Passed in as object';
          } else {
            tmpRecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRecord = typeof tmpRecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRecordAddress) : undefined;
          }
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderable.ContentDestinationAddress, "] TemplateRecordAddress[").concat(tmpRecordAddress, "] renderAsync:"));
          }
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Beginning Asynchronous Render (callback-style)..."));
          }
          let tmpAnticipate = this.fable.newAnticipate();
          tmpAnticipate.anticipate(fOnBeforeRenderCallback => {
            this.onBeforeRenderAsync(fOnBeforeRenderCallback, tmpRenderable);
          });
          tmpAnticipate.anticipate(fAsyncTemplateCallback => {
            // Render the template (asynchronously)
            this.pict.parseTemplateByHash(tmpRenderable.TemplateHash, tmpRecord, (pError, pContent) => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render (asynchronously) ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it did not parse the template."), pError);
                return fAsyncTemplateCallback(pError);
              }
              tmpRenderable.Content = pContent;
              return fAsyncTemplateCallback();
            }, [this], pScope, {
              RootRenderable: typeof pRootRenderable === 'object' ? pRootRenderable : tmpRenderable
            });
          });
          tmpAnticipate.anticipate(fNext => {
            this.onBeforeProjectAsync(fNext, tmpRenderable);
          });
          tmpAnticipate.anticipate(fNext => {
            this.onProjectAsync(fNext, tmpRenderable);
          });
          if (tmpRenderable.RenderMethod !== 'virtual-assignment') {
            tmpAnticipate.anticipate(fNext => {
              this.onAfterProjectAsync(fNext, tmpRenderable);
            });

            // Execute the developer-overridable post-render behavior
            tmpAnticipate.anticipate(fNext => {
              this.onAfterRenderAsync(fNext, tmpRenderable);
            });
          }
          tmpAnticipate.wait(tmpCallback);
        }

        /**
         * Renders the default renderable.
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        renderDefaultAsync(fCallback) {
          // Render the default renderable
          this.renderAsync(fCallback);
        }

        /**
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        basicRender(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          return this.basicRenderWithScope(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
        }

        /**
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        basicRenderWithScope(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          let tmpRenderOptions = this.buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
          if (tmpRenderOptions.Valid) {
            this.assignRenderContent(tmpRenderOptions.Renderable, tmpRenderOptions.DestinationAddress, this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash, tmpRenderOptions.Record, null, [this], pScope, {
              RootRenderable: tmpRenderOptions.Renderable
            }));
            return true;
          } else {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash, " because it is not valid."));
            return false;
          }
        }

        /**
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         */
        basicRenderAsync(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback) {
          return this.basicRenderWithScopeAsync(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback);
        }

        /**
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         */
        basicRenderWithScopeAsync(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback) {
          // Allow the callback to be passed in as the last parameter no matter what
          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateRecordAddress === 'function' ? pTemplateRecordAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " basicRenderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " basicRenderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          const tmpRenderOptions = this.buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
          if (tmpRenderOptions.Valid) {
            this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash, tmpRenderOptions.Record,
            /**
             * @param {Error} [pError] - The error that occurred during template parsing.
             * @param {string} [pContent] - The content that was rendered from the template.
             */
            (pError, pContent) => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render (asynchronously) ").concat(tmpRenderOptions.RenderableHash, " because it did not parse the template."), pError);
                return tmpCallback(pError);
              }
              this.assignRenderContent(tmpRenderOptions.Renderable, tmpRenderOptions.DestinationAddress, pContent);
              return tmpCallback();
            }, [this], pScope, {
              RootRenderable: tmpRenderOptions.Renderable
            });
          } else {
            let tmpErrorMessage = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash, " because it is not valid.");
            this.log.error(tmpErrorMessage);
            return tmpCallback(new Error(tmpErrorMessage));
          }
        }

        /**
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onProject(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onProject:"));
          }
          if (pRenderable.RenderMethod === 'virtual-assignment') {
            this.pict.TransactionTracking.pushToTransactionQueue(pRenderable.TransactionHash, {
              ViewHash: this.Hash,
              Renderable: pRenderable
            }, 'Deferred-Post-Content-Assignment');
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Assigning Renderable[").concat(pRenderable.RenderableHash, "] content length ").concat(pRenderable.Content.length, " to Destination [").concat(pRenderable.ContentDestinationAddress, "] using Async render method ").concat(pRenderable.RenderMethod, "."));
          }

          // Assign the content to the destination address
          this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod, pRenderable.ContentDestinationAddress, pRenderable.Content, pRenderable.TestAddress);
          this.lastRenderedTimestamp = this.pict.log.getTimeStamp();
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
         *
         * @param {(error?: Error, content?: string) => void} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that is being projected.
         */
        onProjectAsync(fCallback, pRenderable) {
          this.onProject(pRenderable);
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers after the view is rendered.
         *
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onAfterRender(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRender:"));
          }
          if (pRenderable && pRenderable.RootRenderableViewHash === this.Hash) {
            const tmpTransactionQueue = this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash) || [];
            for (const tmpEvent of tmpTransactionQueue) {
              const tmpView = this.pict.views[tmpEvent.Data.ViewHash];
              if (!tmpView) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRender: Could not find view for transaction hash ").concat(pRenderable.TransactionHash, " and ViewHash ").concat(tmpEvent.Data.ViewHash, "."));
                continue;
              }
              tmpView.onAfterProject();

              // Execute the developer-overridable post-render behavior
              tmpView.onAfterRender(tmpEvent.Data.Renderable);
            }
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is rendered (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onAfterRenderAsync(fCallback, pRenderable) {
          this.onAfterRender(pRenderable);
          const tmpAnticipate = this.fable.newAnticipate();
          if (pRenderable && pRenderable.RootRenderableViewHash === this.Hash) {
            const queue = this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash) || [];
            for (const event of queue) {
              /** @type {PictView} */
              const tmpView = this.pict.views[event.Data.ViewHash];
              if (!tmpView) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRenderAsync: Could not find view for transaction hash ").concat(pRenderable.TransactionHash, " and ViewHash ").concat(event.Data.ViewHash, "."));
                continue;
              }
              tmpAnticipate.anticipate(tmpView.onAfterProjectAsync.bind(tmpView));
              tmpAnticipate.anticipate(fNext => {
                tmpView.onAfterRenderAsync(fNext, event.Data.Renderable);
              });

              // Execute the developer-overridable post-render behavior
            }
          }
          return tmpAnticipate.wait(fCallback);
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM.
         *
         * @param {Renderable} pRenderable - The renderable that was projected.
         */
        onAfterProject(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterProject:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that was projected.
         */
        onAfterProjectAsync(fCallback, pRenderable) {
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                            Code Section: Solver                            */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is solved.
         */
        onBeforeSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeSolveAsync(fCallback) {
          this.onBeforeSolve();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when the view is solved.
         */
        onSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onSolveAsync(fCallback) {
          this.onSolve();
          return fCallback();
        }

        /**
         * Performs view solving and triggers lifecycle hooks.
         *
         * @return {boolean} - True if the view was solved successfully, false otherwise.
         */
        solve() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeSolve();
          this.onSolve();
          this.onAfterSolve();
          this.lastSolvedTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Performs view solving and triggers lifecycle hooks (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        solveAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " solveAsync() complete."));
            }
            this.lastSolvedTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after the view is solved.
         */
        onAfterSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterSolveAsync(fCallback) {
          this.onAfterSolve();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal From View                        */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before data is marshaled from the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        onBeforeMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeMarshalFromViewAsync(fCallback) {
          this.onBeforeMarshalFromView();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when data is marshaled from the view.
         */
        onMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onMarshalFromViewAsync(fCallback) {
          this.onMarshalFromView();
          return fCallback();
        }

        /**
         * Marshals data from the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        marshalFromView() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeMarshalFromView();
          this.onMarshalFromView();
          this.onAfterMarshalFromView();
          this.lastMarshalFromViewTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Marshals data from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        marshalFromViewAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalFromViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onMarshalFromViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalFromViewAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " marshalFromViewAsync() complete."));
            }
            this.lastMarshalFromViewTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after data is marshaled from the view.
         */
        onAfterMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterMarshalFromViewAsync(fCallback) {
          this.onAfterMarshalFromView();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal To View                          */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before data is marshaled into the view.
         */
        onBeforeMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeMarshalToViewAsync(fCallback) {
          this.onBeforeMarshalToView();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when data is marshaled into the view.
         */
        onMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onMarshalToViewAsync(fCallback) {
          this.onMarshalToView();
          return fCallback();
        }

        /**
         * Marshals data into the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        marshalToView() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeMarshalToView();
          this.onMarshalToView();
          this.onAfterMarshalToView();
          this.lastMarshalToViewTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Marshals data into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        marshalToViewAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalToViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onMarshalToViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalToViewAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " marshalToViewAsync() complete."));
            }
            this.lastMarshalToViewTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after data is marshaled into the view.
         */
        onAfterMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterMarshalToViewAsync(fCallback) {
          this.onAfterMarshalToView();
          return fCallback();
        }

        /** @return {boolean} - True if the object is a PictView. */
        get isPictView() {
          return true;
        }
      }
      module.exports = PictView;
    }, {
      "../package.json": 16,
      "fable-serviceproviderbase": 7
    }],
    18: [function (require, module, exports) {
      /**
       * Pict-MDE-CodeMirror: Helper module for PictSectionMarkdownEditor
       *
       * Handles CodeMirror editor instance creation, extension configuration,
       * keyboard shortcuts, paste handling, and the data URI collapse extension.
       */

      /**
       * Attach CodeMirror editor creation methods to the view instance.
       *
       * @param {object} pView - The PictSectionMarkdownEditor instance
       */
      module.exports.attach = function attach(pView) {
        /**
         * Create a CodeMirror editor instance inside a container element.
         *
         * @param {HTMLElement} pContainer - The DOM element to mount the editor in
         * @param {number} pSegmentIndex - The segment index
         * @param {string} pContent - The initial content
         */
        pView._createEditorInContainer = function _createEditorInContainer(pContainer, pSegmentIndex, pContent) {
          let tmpCM = pView._codeMirrorModules;

          // Build the extensions array
          let tmpExtensions = [];

          // Keyboard shortcuts for formatting, inter-segment navigation, and image paste handling
          // IMPORTANT: Must be added BEFORE consumer extensions (e.g. basicSetup) so that
          // our domEventHandlers fire before CM6's internal keymap handlers.
          tmpExtensions.push(tmpCM.EditorView.domEventHandlers({
            keydown: (pEvent, pEditorView) => {
              // Ctrl/Cmd + B = bold
              if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'b') {
                pEvent.preventDefault();
                pView.applyFormatting(pSegmentIndex, 'bold');
                return true;
              }
              // Ctrl/Cmd + I = italic
              if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'i') {
                pEvent.preventDefault();
                pView.applyFormatting(pSegmentIndex, 'italic');
                return true;
              }
              // Ctrl/Cmd + E = inline code
              if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'e') {
                pEvent.preventDefault();
                pView.applyFormatting(pSegmentIndex, 'code');
                return true;
              }
            },
            paste: (pEvent, pEditorView) => {
              // Check clipboard for image data
              let tmpItems = pEvent.clipboardData && pEvent.clipboardData.items;
              if (!tmpItems) {
                return false;
              }
              for (let i = 0; i < tmpItems.length; i++) {
                if (tmpItems[i].type.startsWith('image/')) {
                  pEvent.preventDefault();
                  let tmpFile = tmpItems[i].getAsFile();
                  if (tmpFile) {
                    pView._processImageFile(tmpFile, pSegmentIndex);
                  }
                  return true;
                }
              }
              return false;
            }
          }));

          // Add consumer-provided extensions (e.g. basicSetup, markdown())
          if (tmpCM.extensions && Array.isArray(tmpCM.extensions)) {
            tmpExtensions = tmpExtensions.concat(tmpCM.extensions);
          }

          // Update listener for content changes, focus, and cursor tracking
          tmpExtensions.push(tmpCM.EditorView.updateListener.of(pUpdate => {
            if (pUpdate.docChanged) {
              pView._onSegmentContentChange(pSegmentIndex, pUpdate.state.doc.toString());
            }

            // Track focus changes to toggle the active class
            if (pUpdate.focusChanged) {
              if (pUpdate.view.hasFocus) {
                pView._setActiveSegment(pSegmentIndex);
                // Position sidebar at cursor on focus
                pView._updateSidebarPosition(pSegmentIndex);
              } else {
                // Small delay so clicking a sidebar button doesn't immediately deactivate
                setTimeout(() => {
                  if (pView._activeSegmentIndex === pSegmentIndex) {
                    // Check if focus moved to another segment or truly left
                    let tmpSegEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
                    if (tmpSegEl && !tmpSegEl.contains(document.activeElement)) {
                      pView._clearActiveSegment(pSegmentIndex);
                      pView._resetSidebarPosition(pSegmentIndex);
                    }
                  }
                }, 100);
              }
            }

            // Track cursor/selection changes to move the sidebar
            if (pUpdate.selectionSet && pUpdate.view.hasFocus) {
              pView._updateSidebarPosition(pSegmentIndex);
            }
          }));

          // Collapse long data URIs in image markdown so the editor is readable
          let tmpCollapseExtension = pView._buildDataURICollapseExtension();
          if (tmpCollapseExtension) {
            tmpExtensions.push(tmpCollapseExtension);
          }

          // Make read-only if configured
          if (pView.options.ReadOnly) {
            tmpExtensions.push(tmpCM.EditorState.readOnly.of(true));
            tmpExtensions.push(tmpCM.EditorView.editable.of(false));
          }

          // Allow consumer to customize extensions
          tmpExtensions = pView.customConfigureExtensions(tmpExtensions, pSegmentIndex);
          let tmpState = tmpCM.EditorState.create({
            doc: pContent || '',
            extensions: tmpExtensions
          });
          let tmpEditorView = new tmpCM.EditorView({
            state: tmpState,
            parent: pContainer
          });
          pView._segmentEditors[pSegmentIndex] = tmpEditorView;

          // -- Inter-segment arrow-key navigation --
          // Use a capture-phase DOM listener so we intercept ArrowDown/ArrowUp
          // BEFORE CodeMirror's internal keymap handlers process them.
          tmpEditorView.contentDOM.addEventListener('keydown', function (pEvent) {
            if (pEvent.key !== 'ArrowDown' && pEvent.key !== 'ArrowUp') {
              return;
            }
            // Don't interfere if a modifier key is held (selection, etc.)
            if (pEvent.shiftKey || pEvent.ctrlKey || pEvent.metaKey || pEvent.altKey) {
              return;
            }
            let tmpState = tmpEditorView.state;
            let tmpCursorPos = tmpState.selection.main.head;
            let tmpLine = tmpState.doc.lineAt(tmpCursorPos);
            let tmpColumnOffset = tmpCursorPos - tmpLine.from;
            if (pEvent.key === 'ArrowDown') {
              // Only navigate when cursor is on the very last line
              if (tmpLine.to < tmpState.doc.length) {
                return; // not on last line — let CM handle it
              }

              // Find next segment
              let tmpOrderedIndices = pView._getOrderedSegmentIndices();
              let tmpLogicalIndex = pView._getLogicalIndex(pSegmentIndex);
              if (tmpLogicalIndex < 0 || tmpLogicalIndex >= tmpOrderedIndices.length - 1) {
                return; // last segment — nowhere to go
              }
              let tmpNextInternalIndex = tmpOrderedIndices[tmpLogicalIndex + 1];
              let tmpNextEditor = pView._segmentEditors[tmpNextInternalIndex];
              if (!tmpNextEditor) {
                return;
              }
              pEvent.preventDefault();
              pEvent.stopPropagation();

              // Focus the next editor and place cursor on the first line
              let tmpFirstLine = tmpNextEditor.state.doc.line(1);
              let tmpTargetCol = Math.min(tmpColumnOffset, tmpFirstLine.to - tmpFirstLine.from);
              tmpNextEditor.focus();
              tmpNextEditor.dispatch({
                selection: {
                  anchor: tmpFirstLine.from + tmpTargetCol
                }
              });
              pView._setActiveSegment(tmpNextInternalIndex);
            } else if (pEvent.key === 'ArrowUp') {
              // Only navigate when cursor is on the very first line
              if (tmpLine.number > 1) {
                return; // not on first line — let CM handle it
              }

              // Find previous segment
              let tmpOrderedIndices = pView._getOrderedSegmentIndices();
              let tmpLogicalIndex = pView._getLogicalIndex(pSegmentIndex);
              if (tmpLogicalIndex <= 0) {
                return; // first segment — nowhere to go
              }
              let tmpPrevInternalIndex = tmpOrderedIndices[tmpLogicalIndex - 1];
              let tmpPrevEditor = pView._segmentEditors[tmpPrevInternalIndex];
              if (!tmpPrevEditor) {
                return;
              }
              pEvent.preventDefault();
              pEvent.stopPropagation();

              // Focus the previous editor and place cursor on the last line
              let tmpLastLine = tmpPrevEditor.state.doc.line(tmpPrevEditor.state.doc.lines);
              let tmpTargetCol = Math.min(tmpColumnOffset, tmpLastLine.to - tmpLastLine.from);
              tmpPrevEditor.focus();
              tmpPrevEditor.dispatch({
                selection: {
                  anchor: tmpLastLine.from + tmpTargetCol
                }
              });
              pView._setActiveSegment(tmpPrevInternalIndex);
            }
          }, true); // <-- capture phase
        };

        /**
         * Build a CodeMirror extension that visually collapses long data URIs
         * inside markdown image syntax.
         *
         * The extension uses Decoration.replace() to hide the long base64 portion
         * and show a compact widget instead, e.g. "data:image/jpeg;base64...28KB".
         * The actual document content is unchanged -- only the visual display
         * is affected.
         *
         * Returns null if the required CodeMirror modules (Decoration, ViewPlugin,
         * WidgetType) are not available.
         *
         * @returns {object|null} A CodeMirror ViewPlugin extension, or null
         */
        pView._buildDataURICollapseExtension = function _buildDataURICollapseExtension() {
          let tmpCM = pView._codeMirrorModules;

          // All three classes are required -- degrade gracefully if not available
          if (!tmpCM || !tmpCM.Decoration || !tmpCM.ViewPlugin || !tmpCM.WidgetType) {
            return null;
          }
          let tmpDecoration = tmpCM.Decoration;
          let tmpViewPlugin = tmpCM.ViewPlugin;
          let tmpWidgetType = tmpCM.WidgetType;

          // Minimum data URI length before collapsing (short URIs are left alone)
          let tmpMinLength = 200;

          // Widget class: renders the collapsed placeholder inline
          class DataURIWidget extends tmpWidgetType {
            constructor(pLabel) {
              super();
              this.label = pLabel;
            }
            toDOM() {
              let tmpSpan = document.createElement('span');
              tmpSpan.className = 'pict-mde-data-uri-collapsed';
              tmpSpan.textContent = this.label;
              tmpSpan.title = 'Data URI (click to expand in image preview below)';
              return tmpSpan;
            }
            eq(pOther) {
              return this.label === pOther.label;
            }
          }

          /**
           * Scan the visible ranges of the document for data URIs inside image
           * markdown and build a DecorationSet that replaces the long portion.
           *
           * Pattern:  ![alt](data:image/TYPE;base64,LONGSTRING)
           *
           * We keep "![alt](data:image/TYPE;base64," visible and replace only the
           * long base64 payload plus the closing ")" with a compact widget.
           */
          function buildDecorations(pEditorView) {
            let tmpDecorations = [];
            let tmpDoc = pEditorView.state.doc;
            for (let tmpVisRange of pEditorView.visibleRanges) {
              let tmpFrom = tmpVisRange.from;
              let tmpTo = tmpVisRange.to;
              let tmpText = tmpDoc.sliceString(tmpFrom, tmpTo);

              // Match: ![...](data:image/...;base64,...) -- we need positions of the base64 payload
              let tmpRegex = /!\[[^\]]*\]\(data:([^;]+);base64,/g;
              let tmpMatch;
              while ((tmpMatch = tmpRegex.exec(tmpText)) !== null) {
                // tmpMatch[0] is "![alt](data:image/png;base64,"
                // tmpMatch[1] is the MIME subtype, e.g. "image/png"
                let tmpPayloadStart = tmpFrom + tmpMatch.index + tmpMatch[0].length;

                // Find the closing parenthesis -- scan forward from payloadStart
                let tmpPayloadEnd = -1;
                let tmpSearchFrom = tmpPayloadStart;
                let tmpDocLength = tmpDoc.length;

                // Scan character by character in the document for the closing ')'
                // We need to handle this carefully since the payload could be huge
                // and span beyond the visible range.
                // Search up to 5MB worth of characters (way more than any realistic image).
                let tmpMaxScan = Math.min(tmpDocLength, tmpSearchFrom + 5 * 1024 * 1024);
                let tmpChunkSize = 4096;
                for (let tmpPos = tmpSearchFrom; tmpPos < tmpMaxScan; tmpPos += tmpChunkSize) {
                  let tmpEnd = Math.min(tmpPos + tmpChunkSize, tmpMaxScan);
                  let tmpChunk = tmpDoc.sliceString(tmpPos, tmpEnd);
                  let tmpParenIdx = tmpChunk.indexOf(')');
                  if (tmpParenIdx >= 0) {
                    tmpPayloadEnd = tmpPos + tmpParenIdx;
                    break;
                  }
                }
                if (tmpPayloadEnd < 0) {
                  // No closing paren found -- skip this match
                  continue;
                }

                // Calculate the payload length (base64 data between comma and closing paren)
                let tmpPayloadLength = tmpPayloadEnd - tmpPayloadStart;
                if (tmpPayloadLength < tmpMinLength) {
                  // Too short to bother collapsing
                  continue;
                }

                // Build a human-readable size label
                let tmpSizeBytes = Math.round(tmpPayloadLength * 0.75); // base64 to bytes approx
                let tmpSizeLabel;
                if (tmpSizeBytes >= 1024 * 1024) {
                  tmpSizeLabel = (tmpSizeBytes / (1024 * 1024)).toFixed(1) + 'MB';
                } else if (tmpSizeBytes >= 1024) {
                  tmpSizeLabel = Math.round(tmpSizeBytes / 1024) + 'KB';
                } else {
                  tmpSizeLabel = tmpSizeBytes + 'B';
                }
                let tmpMimeType = tmpMatch[1] || 'image';
                let tmpWidgetLabel = "\u2026".concat(tmpSizeLabel, ")");

                // Replace from the start of the base64 payload to after the closing paren
                let tmpWidget = tmpDecoration.replace({
                  widget: new DataURIWidget(tmpWidgetLabel)
                });
                tmpDecorations.push(tmpWidget.range(tmpPayloadStart, tmpPayloadEnd + 1));
              }
            }
            return tmpDecoration.set(tmpDecorations, true);
          }

          // Create the ViewPlugin
          let tmpPlugin = tmpViewPlugin.fromClass(class {
            constructor(pEditorView) {
              this.decorations = buildDecorations(pEditorView);
            }
            update(pUpdate) {
              if (pUpdate.docChanged || pUpdate.viewportChanged) {
                this.decorations = buildDecorations(pUpdate.view);
              }
            }
          }, {
            decorations: pPlugin => pPlugin.decorations
          });
          return tmpPlugin;
        };
      };
    }, {}],
    19: [function (require, module, exports) {
      /**
       * Pict-MDE-DragAndReorder: Helper module for PictSectionMarkdownEditor
       *
       * Handles segment drag-and-drop reordering, active segment management,
       * sidebar cursor-tracking positioning, and hidden-preview state maintenance
       * across reorder operations.
       */

      /**
       * Attach drag/reorder and active-segment methods to the view instance.
       *
       * @param {object} pView - The PictSectionMarkdownEditor instance
       */
      module.exports.attach = function attach(pView) {
        /**
         * Wire drag-and-drop events on a segment element for reorder via the drag handle.
         *
         * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._wireSegmentDragEvents = function _wireSegmentDragEvents(pSegmentElement, pSegmentIndex) {
          let tmpHandle = pSegmentElement.querySelector('.pict-mde-drag-handle');
          if (!tmpHandle) {
            return;
          }

          // The drag handle is the draggable element
          tmpHandle.addEventListener('dragstart', pEvent => {
            pView._dragSourceIndex = pSegmentIndex;
            pEvent.dataTransfer.effectAllowed = 'move';
            pEvent.dataTransfer.setData('text/plain', String(pSegmentIndex));
            // Add a dragging class to the container so CSS can disable pointer-events
            // on CodeMirror editors (preventing them from intercepting the drop event)
            let tmpContainerEl = pView._getContainerElement();
            if (tmpContainerEl) {
              tmpContainerEl.classList.add('pict-mde-dragging');
            }
            setTimeout(() => {
              pSegmentElement.style.opacity = '0.4';
            }, 0);
          });
          tmpHandle.addEventListener('dragend', () => {
            pSegmentElement.style.opacity = '';
            pView._dragSourceIndex = -1;
            pView._clearAllDropIndicators();
            // Remove the dragging class from the container
            let tmpContainerEl = pView._getContainerElement();
            if (tmpContainerEl) {
              tmpContainerEl.classList.remove('pict-mde-dragging');
            }
          });

          // Drop target: the whole segment row. We determine above/below from mouse Y.
          pSegmentElement.addEventListener('dragover', pEvent => {
            pEvent.preventDefault();
            pEvent.dataTransfer.dropEffect = 'move';

            // Clear all indicators first, then set the correct one
            pView._clearAllDropIndicators();

            // Determine if cursor is in the top or bottom half of this segment
            let tmpRect = pSegmentElement.getBoundingClientRect();
            let tmpMidY = tmpRect.top + tmpRect.height / 2;
            if (pEvent.clientY < tmpMidY) {
              pSegmentElement.classList.add('pict-mde-drag-over-top');
            } else {
              pSegmentElement.classList.add('pict-mde-drag-over-bottom');
            }
          });
          pSegmentElement.addEventListener('dragleave', pEvent => {
            // Only clear if we're actually leaving the element (not entering a child)
            if (!pSegmentElement.contains(pEvent.relatedTarget)) {
              pSegmentElement.classList.remove('pict-mde-drag-over-top');
              pSegmentElement.classList.remove('pict-mde-drag-over-bottom');
            }
          });
          pSegmentElement.addEventListener('drop', pEvent => {
            pEvent.preventDefault();
            let tmpDropBelow = pSegmentElement.classList.contains('pict-mde-drag-over-bottom');
            pView._clearAllDropIndicators();
            let tmpSourceIndex = pView._dragSourceIndex;
            if (tmpSourceIndex < 0 || tmpSourceIndex === pSegmentIndex) {
              return;
            }
            pView._reorderSegment(tmpSourceIndex, pSegmentIndex, tmpDropBelow);
          });
        };

        /**
         * Clear all drop indicator classes from all segments.
         */
        pView._clearAllDropIndicators = function _clearAllDropIndicators() {
          let tmpContainer = pView._getContainerElement();
          if (!tmpContainer) {
            return;
          }
          let tmpAllSegments = tmpContainer.querySelectorAll('.pict-mde-segment');
          for (let i = 0; i < tmpAllSegments.length; i++) {
            tmpAllSegments[i].classList.remove('pict-mde-drag-over-top');
            tmpAllSegments[i].classList.remove('pict-mde-drag-over-bottom');
          }
        };

        /**
         * Reorder a segment from one position to another via drag.
         *
         * @param {number} pFromInternalIndex - The internal index of the dragged segment
         * @param {number} pToInternalIndex - The internal index of the drop target
         * @param {boolean} pDropBelow - Whether the drop was on the bottom half of the target
         */
        pView._reorderSegment = function _reorderSegment(pFromInternalIndex, pToInternalIndex, pDropBelow) {
          let tmpFromLogical = pView._getLogicalIndex(pFromInternalIndex);
          let tmpToLogical = pView._getLogicalIndex(pToInternalIndex);
          if (tmpFromLogical < 0 || tmpToLogical < 0) {
            pView.log.warn("PICT-MarkdownEditor _reorderSegment: could not resolve logical indices (from=".concat(tmpFromLogical, ", to=").concat(tmpToLogical, ")."));
            return;
          }
          if (tmpFromLogical === tmpToLogical) {
            return;
          }

          // Marshal all editor content back to data before manipulating the array
          pView._marshalAllEditorsToData();
          let tmpSegments = pView._getSegmentsFromData();
          if (!tmpSegments || tmpSegments.length < 2) {
            return;
          }

          // Calculate the target insertion index
          let tmpInsertAt = pDropBelow ? tmpToLogical + 1 : tmpToLogical;

          // Adjust for the removal shifting indices down
          if (tmpFromLogical < tmpInsertAt) {
            tmpInsertAt--;
          }

          // If the insert position equals the source, no move needed
          if (tmpInsertAt === tmpFromLogical) {
            return;
          }

          // Perform the reorder: remove from old position, insert at new
          let tmpMoved = tmpSegments.splice(tmpFromLogical, 1)[0];
          tmpSegments.splice(tmpInsertAt, 0, tmpMoved);

          // Explicitly write the reordered array back to the data address
          pView._setSegmentsToData(tmpSegments);

          // Reorder per-segment hidden preview state to follow the moved segment
          pView._reorderHiddenPreviewState(tmpFromLogical, tmpInsertAt);
          pView._buildEditorUI();
        };

        /**
         * Reorder the hidden preview state after a splice-based move
         * (remove from pFrom, insert at pTo).
         *
         * @param {number} pFrom - The logical index the segment was removed from
         * @param {number} pTo - The logical index the segment was inserted at
         */
        pView._reorderHiddenPreviewState = function _reorderHiddenPreviewState(pFrom, pTo) {
          if (pFrom === pTo) {
            return;
          }

          // Build an ordered array of hidden-state booleans
          let tmpKeys = Object.keys(pView._hiddenPreviewSegments).map(k => parseInt(k, 10));
          if (tmpKeys.length === 0) {
            return;
          }
          let tmpMaxIndex = Math.max(...tmpKeys, pFrom, pTo);
          let tmpStates = [];
          for (let i = 0; i <= tmpMaxIndex; i++) {
            tmpStates.push(!!pView._hiddenPreviewSegments[i]);
          }

          // Perform the same splice on the states array
          let tmpMovedState = tmpStates.splice(pFrom, 1)[0];
          tmpStates.splice(pTo, 0, tmpMovedState);

          // Rebuild the hidden map
          pView._hiddenPreviewSegments = {};
          for (let i = 0; i < tmpStates.length; i++) {
            if (tmpStates[i]) {
              pView._hiddenPreviewSegments[i] = true;
            }
          }
        };

        /**
         * Swap the hidden preview state of two logical indices.
         * Used when moveSegmentUp/Down swaps adjacent segments.
         *
         * @param {number} pIndexA - First logical index
         * @param {number} pIndexB - Second logical index
         */
        pView._swapHiddenPreviewState = function _swapHiddenPreviewState(pIndexA, pIndexB) {
          let tmpAHidden = !!pView._hiddenPreviewSegments[pIndexA];
          let tmpBHidden = !!pView._hiddenPreviewSegments[pIndexB];
          if (tmpBHidden) {
            pView._hiddenPreviewSegments[pIndexA] = true;
          } else {
            delete pView._hiddenPreviewSegments[pIndexA];
          }
          if (tmpAHidden) {
            pView._hiddenPreviewSegments[pIndexB] = true;
          } else {
            delete pView._hiddenPreviewSegments[pIndexB];
          }
        };

        // -- Active Segment Management --

        /**
         * Set a segment as the active (focused) segment.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._setActiveSegment = function _setActiveSegment(pSegmentIndex) {
          // Clear previous active
          if (pView._activeSegmentIndex >= 0 && pView._activeSegmentIndex !== pSegmentIndex) {
            let tmpPrevEl = document.getElementById("PictMDE-Segment-".concat(pView._activeSegmentIndex));
            if (tmpPrevEl) {
              tmpPrevEl.classList.remove('pict-mde-active');
            }
          }
          pView._activeSegmentIndex = pSegmentIndex;
          let tmpSegEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (tmpSegEl) {
            tmpSegEl.classList.add('pict-mde-active');
          }
        };

        /**
         * Clear the active state from a segment (on blur).
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._clearActiveSegment = function _clearActiveSegment(pSegmentIndex) {
          if (pView._activeSegmentIndex === pSegmentIndex) {
            pView._activeSegmentIndex = -1;
          }
          let tmpSegEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (tmpSegEl) {
            tmpSegEl.classList.remove('pict-mde-active');
          }

          // Reset sidebar back to sticky when segment is no longer active
          pView._resetSidebarPosition(pSegmentIndex);
        };

        // -- Sidebar Cursor Tracking --

        /**
         * Update the sidebar formatting-buttons position so they float next to the
         * cursor / selection in the active segment.
         *
         * When a segment is active and has a cursor, we switch the sidebar-actions
         * from sticky positioning to absolute, offset to align with the cursor line.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._updateSidebarPosition = function _updateSidebarPosition(pSegmentIndex) {
          let tmpSegmentEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (!tmpSegmentEl) {
            return;
          }
          let tmpQuadrantTR = tmpSegmentEl.querySelector('.pict-mde-quadrant-tr');
          if (!tmpQuadrantTR) {
            return;
          }
          let tmpEditor = pView._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            return;
          }

          // Get the cursor position in the editor
          let tmpCursorPos = tmpEditor.state.selection.main.head;
          let tmpCursorCoords = tmpEditor.coordsAtPos(tmpCursorPos);
          if (!tmpCursorCoords) {
            // If we can't get coords, revert to sticky
            pView._resetSidebarPosition(pSegmentIndex);
            return;
          }

          // Calculate the offset relative to the segment element
          let tmpSegmentRect = tmpSegmentEl.getBoundingClientRect();
          let tmpOffsetTop = tmpCursorCoords.top - tmpSegmentRect.top;

          // Clamp so the sidebar buttons don't go above the segment or below it
          let tmpSidebarHeight = tmpQuadrantTR.offsetHeight || 0;
          let tmpSegmentHeight = tmpSegmentEl.offsetHeight || 0;
          let tmpMaxOffset = Math.max(0, tmpSegmentHeight - tmpSidebarHeight);
          tmpOffsetTop = Math.max(0, Math.min(tmpOffsetTop, tmpMaxOffset));

          // Apply the cursor-relative positioning
          tmpQuadrantTR.classList.add('pict-mde-sidebar-at-cursor');
          tmpQuadrantTR.style.setProperty('--pict-mde-sidebar-top', "".concat(tmpOffsetTop, "px"));
        };

        /**
         * Reset the sidebar back to default sticky positioning (no cursor tracking).
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._resetSidebarPosition = function _resetSidebarPosition(pSegmentIndex) {
          let tmpSegmentEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (!tmpSegmentEl) {
            return;
          }
          let tmpQuadrantTR = tmpSegmentEl.querySelector('.pict-mde-quadrant-tr');
          if (!tmpQuadrantTR) {
            return;
          }
          tmpQuadrantTR.classList.remove('pict-mde-sidebar-at-cursor');
          tmpQuadrantTR.style.removeProperty('--pict-mde-sidebar-top');
        };
      };
    }, {}],
    20: [function (require, module, exports) {
      /**
       * Pict-MDE-Formatting: Helper module for PictSectionMarkdownEditor
       *
       * Handles markdown formatting operations (bold, italic, code, heading, link)
       * applied to selections or at the cursor position in CodeMirror editors.
       */

      // Markdown formatting definitions: wrapper characters for toggle-style formatting
      const _FormattingMap = {
        bold: {
          wrap: '**'
        },
        italic: {
          wrap: '*'
        },
        code: {
          wrap: '`'
        },
        heading: {
          prefix: '# '
        },
        link: {
          before: '[',
          after: '](url)'
        }
      };

      /**
       * Attach formatting methods to the view instance.
       *
       * @param {object} pView - The PictSectionMarkdownEditor instance
       */
      module.exports.attach = function attach(pView) {
        /**
         * Apply markdown formatting to the selection (or insert formatting at cursor)
         * in a specific segment.
         *
         * If text is selected, wraps it.  If no selection, inserts the formatting
         * markers and places the cursor between them.
         *
         * @param {number} pSegmentIndex - The internal segment index
         * @param {string} pFormatType - One of: 'bold', 'italic', 'code', 'heading', 'link'
         */
        pView.applyFormatting = function applyFormatting(pSegmentIndex, pFormatType) {
          let tmpEditor = pView._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            pView.log.warn("PICT-MarkdownEditor applyFormatting: no editor for segment ".concat(pSegmentIndex, "."));
            return;
          }
          let tmpFormat = _FormattingMap[pFormatType];
          if (!tmpFormat) {
            pView.log.warn("PICT-MarkdownEditor applyFormatting: unknown format type \"".concat(pFormatType, "\"."));
            return;
          }
          let tmpState = tmpEditor.state;
          let tmpSelection = tmpState.selection.main;
          let tmpFrom = tmpSelection.from;
          let tmpTo = tmpSelection.to;
          let tmpHasSelection = tmpFrom !== tmpTo;
          let tmpSelectedText = tmpHasSelection ? tmpState.sliceDoc(tmpFrom, tmpTo) : '';
          let tmpChanges;
          let tmpCursorPos;
          if (tmpFormat.wrap) {
            // Toggle-style: wrap selection or insert empty wrapper
            let tmpWrap = tmpFormat.wrap;
            if (tmpHasSelection) {
              // Check if already wrapped — if so, unwrap
              let tmpBefore = tmpState.sliceDoc(Math.max(0, tmpFrom - tmpWrap.length), tmpFrom);
              let tmpAfter = tmpState.sliceDoc(tmpTo, Math.min(tmpState.doc.length, tmpTo + tmpWrap.length));
              if (tmpBefore === tmpWrap && tmpAfter === tmpWrap) {
                // Unwrap
                tmpChanges = [{
                  from: tmpFrom - tmpWrap.length,
                  to: tmpFrom,
                  insert: ''
                }, {
                  from: tmpTo,
                  to: tmpTo + tmpWrap.length,
                  insert: ''
                }];
                tmpCursorPos = tmpFrom - tmpWrap.length;
                tmpEditor.dispatch({
                  changes: tmpChanges,
                  selection: {
                    anchor: tmpCursorPos,
                    head: tmpCursorPos + tmpSelectedText.length
                  }
                });
                return;
              }

              // Wrap the selection
              let tmpInsert = tmpWrap + tmpSelectedText + tmpWrap;
              tmpChanges = {
                from: tmpFrom,
                to: tmpTo,
                insert: tmpInsert
              };
              tmpCursorPos = tmpFrom + tmpWrap.length;
              tmpEditor.dispatch({
                changes: tmpChanges,
                selection: {
                  anchor: tmpCursorPos,
                  head: tmpCursorPos + tmpSelectedText.length
                }
              });
            } else {
              // No selection: insert empty wrapper and place cursor inside
              let tmpInsert = tmpWrap + tmpWrap;
              tmpChanges = {
                from: tmpFrom,
                insert: tmpInsert
              };
              tmpCursorPos = tmpFrom + tmpWrap.length;
              tmpEditor.dispatch({
                changes: tmpChanges,
                selection: {
                  anchor: tmpCursorPos
                }
              });
            }
          } else if (tmpFormat.prefix) {
            // Line-prefix style (headings)
            let tmpLine = tmpState.doc.lineAt(tmpFrom);
            let tmpLineText = tmpLine.text;

            // Toggle: if line already starts with the prefix, remove it; otherwise add
            if (tmpLineText.startsWith(tmpFormat.prefix)) {
              tmpChanges = {
                from: tmpLine.from,
                to: tmpLine.from + tmpFormat.prefix.length,
                insert: ''
              };
            } else {
              tmpChanges = {
                from: tmpLine.from,
                insert: tmpFormat.prefix
              };
            }
            tmpEditor.dispatch({
              changes: tmpChanges
            });
          } else if (tmpFormat.before && tmpFormat.after) {
            // Surround style (links)
            if (tmpHasSelection) {
              let tmpInsert = tmpFormat.before + tmpSelectedText + tmpFormat.after;
              tmpChanges = {
                from: tmpFrom,
                to: tmpTo,
                insert: tmpInsert
              };
              // Place cursor on the "url" part
              tmpCursorPos = tmpFrom + tmpFormat.before.length + tmpSelectedText.length + 2;
              tmpEditor.dispatch({
                changes: tmpChanges,
                selection: {
                  anchor: tmpCursorPos,
                  head: tmpCursorPos + 3
                }
              });
            } else {
              let tmpInsert = tmpFormat.before + tmpFormat.after;
              tmpChanges = {
                from: tmpFrom,
                insert: tmpInsert
              };
              tmpCursorPos = tmpFrom + tmpFormat.before.length;
              tmpEditor.dispatch({
                changes: tmpChanges,
                selection: {
                  anchor: tmpCursorPos
                }
              });
            }
          }

          // Re-focus the editor after clicking a sidebar button
          tmpEditor.focus();
        };
      };
    }, {}],
    21: [function (require, module, exports) {
      /**
       * Pict-MDE-ImageHandling: Helper module for PictSectionMarkdownEditor
       *
       * Handles image operations: file picker, file processing (hook or base64
       * fallback), markdown insertion, preview thumbnail rendering, and
       * drag-and-drop for image files onto the editor.
       */

      /**
       * Attach image handling methods to the view instance.
       *
       * @param {object} pView - The PictSectionMarkdownEditor instance
       */
      module.exports.attach = function attach(pView) {
        /**
         * Open a file picker to select an image for insertion into a segment.
         * Called by the sidebar image button onclick handler.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView.openImagePicker = function openImagePicker(pSegmentIndex) {
          let tmpFileInput = document.getElementById("PictMDE-ImageInput-".concat(pSegmentIndex));
          if (!tmpFileInput) {
            pView.log.warn("PICT-MarkdownEditor openImagePicker: file input not found for segment ".concat(pSegmentIndex, "."));
            return;
          }

          // Wire the change handler fresh each time (in case it was already used)
          tmpFileInput.onchange = () => {
            if (tmpFileInput.files && tmpFileInput.files.length > 0) {
              pView._processImageFile(tmpFileInput.files[0], pSegmentIndex);
            }
            // Reset the input so the same file can be re-selected
            tmpFileInput.value = '';
          };
          tmpFileInput.click();
        };

        /**
         * Process an image File object from any input method (picker, drag, paste).
         *
         * If the consumer has overridden onImageUpload and it returns true, the
         * consumer handles the upload and calls the callback with a URL.
         * Otherwise, the image is converted to a base64 data URI inline.
         *
         * @param {File} pFile - The image File object
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._processImageFile = function _processImageFile(pFile, pSegmentIndex) {
          if (!pFile || !pFile.type || !pFile.type.startsWith('image/')) {
            pView.log.warn("PICT-MarkdownEditor _processImageFile: not an image file (type: ".concat(pFile ? pFile.type : 'null', ")."));
            return;
          }
          let tmpAltText = pFile.name ? pFile.name.replace(/\.[^.]+$/, '') : 'image';

          // Check if the consumer wants to handle the upload
          let tmpCallback = (pError, pURL) => {
            if (pError) {
              pView.log.error("PICT-MarkdownEditor image upload error: ".concat(pError));
              return;
            }
            if (pURL) {
              pView._insertImageMarkdown(pSegmentIndex, pURL, tmpAltText);
            }
          };
          let tmpHandled = pView.onImageUpload(pFile, pSegmentIndex, tmpCallback);
          if (tmpHandled) {
            // Consumer is handling the upload asynchronously
            return;
          }

          // Default: convert to base64 data URI
          if (typeof FileReader === 'undefined') {
            pView.log.error("PICT-MarkdownEditor _processImageFile: FileReader not available in this environment.");
            return;
          }
          let tmpReader = new FileReader();
          tmpReader.onload = () => {
            pView._insertImageMarkdown(pSegmentIndex, tmpReader.result, tmpAltText);
          };
          tmpReader.onerror = () => {
            pView.log.error("PICT-MarkdownEditor _processImageFile: FileReader error.");
          };
          tmpReader.readAsDataURL(pFile);
        };

        /**
         * Insert markdown image syntax at the cursor position in a segment editor.
         *
         * @param {number} pSegmentIndex - The internal segment index
         * @param {string} pURL - The image URL (data URI or remote URL)
         * @param {string} [pAltText] - The alt text (default: 'image')
         */
        pView._insertImageMarkdown = function _insertImageMarkdown(pSegmentIndex, pURL, pAltText) {
          let tmpEditor = pView._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            pView.log.warn("PICT-MarkdownEditor _insertImageMarkdown: no editor for segment ".concat(pSegmentIndex, "."));
            return;
          }
          let tmpAlt = pAltText || 'image';
          let tmpInsert = "![".concat(tmpAlt, "](").concat(pURL, ")");
          let tmpState = tmpEditor.state;
          let tmpCursorPos = tmpState.selection.main.head;
          tmpEditor.dispatch({
            changes: {
              from: tmpCursorPos,
              insert: tmpInsert
            },
            selection: {
              anchor: tmpCursorPos + tmpInsert.length
            }
          });
          tmpEditor.focus();

          // Update the image preview area for this segment
          pView._updateImagePreviews(pSegmentIndex);
        };

        /**
         * Scan the content of a segment for markdown image references and render
         * preview thumbnails in the preview area below the editor.
         *
         * Matches the pattern ![alt](url) and creates <img> elements for each.
         * The preview area is hidden when there are no images.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._updateImagePreviews = function _updateImagePreviews(pSegmentIndex) {
          let tmpPreviewEl = document.getElementById("PictMDE-ImagePreview-".concat(pSegmentIndex));
          if (!tmpPreviewEl) {
            return;
          }
          let tmpEditor = pView._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-images');
            return;
          }
          let tmpContent = tmpEditor.state.doc.toString();

          // Match markdown image syntax: ![alt text](url)
          let tmpImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
          let tmpMatches = [];
          let tmpMatch;
          while ((tmpMatch = tmpImageRegex.exec(tmpContent)) !== null) {
            tmpMatches.push({
              alt: tmpMatch[1] || 'image',
              url: tmpMatch[2]
            });
          }
          if (tmpMatches.length === 0) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-images');
            return;
          }

          // Build preview HTML
          let tmpHTML = '';
          for (let i = 0; i < tmpMatches.length; i++) {
            let tmpAlt = tmpMatches[i].alt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            let tmpURL = tmpMatches[i].url.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
            tmpHTML += "<div class=\"pict-mde-image-preview-item\"><img src=\"".concat(tmpURL, "\" alt=\"").concat(tmpAlt, "\" /><span class=\"pict-mde-image-preview-label\">").concat(tmpAlt, "</span></div>");
          }
          tmpPreviewEl.innerHTML = tmpHTML;
          tmpPreviewEl.classList.add('pict-mde-has-images');
        };

        /**
         * Wire drag-and-drop events for image files on a segment editor container.
         *
         * These events are separate from the segment-reorder drag events.
         * File drags are distinguished from segment reorder drags by checking
         * dataTransfer.types for 'Files' and ensuring _dragSourceIndex is -1.
         *
         * @param {HTMLElement} pEditorContainer - The .pict-mde-segment-editor element
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._wireImageDragEvents = function _wireImageDragEvents(pEditorContainer, pSegmentIndex) {
          pEditorContainer.addEventListener('dragover', pEvent => {
            // Only handle file drags, not segment-reorder drags
            if (pView._dragSourceIndex >= 0) {
              return;
            }
            if (!pEvent.dataTransfer || !pEvent.dataTransfer.types || pEvent.dataTransfer.types.indexOf('Files') < 0) {
              return;
            }
            pEvent.preventDefault();
            pEvent.dataTransfer.dropEffect = 'copy';
            pEditorContainer.classList.add('pict-mde-image-dragover');
          });
          pEditorContainer.addEventListener('dragleave', pEvent => {
            // Only clear if actually leaving the element
            if (!pEditorContainer.contains(pEvent.relatedTarget)) {
              pEditorContainer.classList.remove('pict-mde-image-dragover');
            }
          });
          pEditorContainer.addEventListener('drop', pEvent => {
            pEditorContainer.classList.remove('pict-mde-image-dragover');

            // Only handle file drops, not segment-reorder drops
            if (pView._dragSourceIndex >= 0) {
              return;
            }
            if (!pEvent.dataTransfer || !pEvent.dataTransfer.files || pEvent.dataTransfer.files.length < 1) {
              return;
            }
            let tmpFile = pEvent.dataTransfer.files[0];
            if (tmpFile.type && tmpFile.type.startsWith('image/')) {
              pEvent.preventDefault();
              pEvent.stopPropagation();
              pView._processImageFile(tmpFile, pSegmentIndex);
            }
          });
        };
      };
    }, {}],
    22: [function (require, module, exports) {
      /**
       * Pict-MDE-RichPreview: Helper module for PictSectionMarkdownEditor
       *
       * Handles rich content preview rendering via pict-section-content:
       * markdown-to-HTML parsing, mermaid diagram rendering, KaTeX math
       * rendering, and the full rendered-view toggle.
       */

      const libPictSectionContent = require('pict-section-content');
      const libPictContentProvider = libPictSectionContent.PictContentProvider;

      /**
       * Attach rich preview methods to the view instance.
       *
       * @param {object} pView - The PictSectionMarkdownEditor instance
       */
      module.exports.attach = function attach(pView) {
        /**
         * Get the pict-section-content provider instance for markdown parsing.
         * Lazily instantiated on first use.
         *
         * @returns {object} The PictContentProvider instance
         */
        pView._getContentProvider = function _getContentProvider() {
          if (!pView._contentProvider) {
            pView._contentProvider = new libPictContentProvider(pView.fable, {}, 'Pict-Content-Provider-MDE');
          }
          return pView._contentProvider;
        };

        /**
         * Render the raw markdown content of a segment into the rich preview area
         * using pict-section-content's parseMarkdown() provider method.
         *
         * The rendered HTML includes syntax-highlighted code blocks, mermaid diagram
         * placeholders, KaTeX math placeholders, headings, lists, tables, etc.
         *
         * After setting innerHTML, post-render hooks call mermaid.run() and
         * katex.render() to activate diagrams and equations (if those libraries
         * are available on window -- loaded by the consumer via CDN).
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        pView._updateRichPreviews = function _updateRichPreviews(pSegmentIndex) {
          if (!pView.options.EnableRichPreview) {
            return;
          }
          let tmpPreviewEl = document.getElementById("PictMDE-RichPreview-".concat(pSegmentIndex));
          if (!tmpPreviewEl) {
            return;
          }
          let tmpEditor = pView._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
            return;
          }
          let tmpContent = tmpEditor.state.doc.toString();
          if (!tmpContent || tmpContent.trim().length === 0) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
            return;
          }

          // Use pict-section-content's provider to parse the raw markdown into HTML
          let tmpProvider = pView._getContentProvider();
          let tmpRenderedHTML = tmpProvider.parseMarkdown(tmpContent);
          if (!tmpRenderedHTML || tmpRenderedHTML.trim().length === 0) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
            return;
          }

          // Wrap the rendered HTML in a pict-content container so that
          // pict-section-content's CSS classes take effect
          let tmpPreviewID = "PictMDE-RichPreviewBody-".concat(pSegmentIndex);
          tmpPreviewEl.innerHTML = "<div class=\"pict-content\" id=\"".concat(tmpPreviewID, "\">").concat(tmpRenderedHTML, "</div>");
          tmpPreviewEl.classList.add('pict-mde-has-rich-preview');

          // Bump generation counter for stale-render protection (mermaid is async)
          let tmpGeneration = (pView._richPreviewGenerations[pSegmentIndex] || 0) + 1;
          pView._richPreviewGenerations[pSegmentIndex] = tmpGeneration;

          // Post-render: call mermaid.run() for mermaid diagram elements
          pView._postRenderMermaid(tmpPreviewID, pSegmentIndex, tmpGeneration);

          // Post-render: call katex.render() for KaTeX math elements
          pView._postRenderKaTeX(tmpPreviewID);
        };

        /**
         * Post-render hook: render Mermaid diagrams in the preview container.
         * Uses the same approach as pict-section-content's renderMermaidDiagrams().
         *
         * @param {string} pContainerID - The container element ID
         * @param {number} pSegmentIndex - The segment index (for stale-render protection)
         * @param {number} pGeneration - The generation counter value
         */
        pView._postRenderMermaid = function _postRenderMermaid(pContainerID, pSegmentIndex, pGeneration) {
          if (typeof mermaid === 'undefined') {
            return;
          }
          let tmpContainer = document.getElementById(pContainerID);
          if (!tmpContainer) {
            return;
          }
          let tmpMermaidElements = tmpContainer.querySelectorAll('pre.mermaid');
          if (tmpMermaidElements.length < 1) {
            return;
          }
          try {
            let tmpPromise = mermaid.run({
              nodes: tmpMermaidElements
            });
            if (tmpPromise && typeof tmpPromise.catch === 'function') {
              tmpPromise.catch(pError => {
                // Check stale-render: rendered view uses _renderedViewGeneration,
                // per-segment previews use _richPreviewGenerations
                let tmpCurrentGen = pSegmentIndex === -1 ? pView._renderedViewGeneration : pView._richPreviewGenerations[pSegmentIndex];
                if (tmpCurrentGen !== pGeneration) {
                  return; // stale render -- a newer update has replaced us
                }
                pView.log.warn("PICT-MarkdownEditor mermaid render error: ".concat(pError.message || pError));
              });
            }
          } catch (pError) {
            pView.log.warn("PICT-MarkdownEditor mermaid render error: ".concat(pError.message || pError));
          }
        };

        /**
         * Post-render hook: render KaTeX inline and display math in the preview container.
         * Uses the same approach as pict-section-content's renderKaTeXEquations().
         *
         * @param {string} pContainerID - The container element ID
         */
        pView._postRenderKaTeX = function _postRenderKaTeX(pContainerID) {
          if (typeof katex === 'undefined') {
            return;
          }
          let tmpContainer = document.getElementById(pContainerID);
          if (!tmpContainer) {
            return;
          }

          // Render inline math: <span class="pict-content-katex-inline">
          let tmpInlineElements = tmpContainer.querySelectorAll('.pict-content-katex-inline');
          for (let i = 0; i < tmpInlineElements.length; i++) {
            try {
              katex.render(tmpInlineElements[i].textContent, tmpInlineElements[i], {
                throwOnError: false,
                displayMode: false
              });
            } catch (pError) {
              pView.log.warn("PICT-MarkdownEditor KaTeX inline error: ".concat(pError.message || pError));
            }
          }

          // Render display math: <div class="pict-content-katex-display">
          let tmpDisplayElements = tmpContainer.querySelectorAll('.pict-content-katex-display');
          for (let i = 0; i < tmpDisplayElements.length; i++) {
            try {
              katex.render(tmpDisplayElements[i].textContent, tmpDisplayElements[i], {
                throwOnError: false,
                displayMode: true
              });
            } catch (pError) {
              pView.log.warn("PICT-MarkdownEditor KaTeX display error: ".concat(pError.message || pError));
            }
          }
        };

        /**
         * Simple HTML escape for error messages in the rich preview.
         *
         * @param {string} pText - The text to escape
         * @returns {string}
         */
        pView._escapeHTMLForPreview = function _escapeHTMLForPreview(pText) {
          return pText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };

        // -- Rendered View (full document preview) --

        /**
         * Toggle between the editing view (CodeMirror segments) and a fully rendered
         * view of the combined markdown output using pict-section-content.
         *
         * @param {boolean} [pRendered] - If provided, set to this value; otherwise toggle
         */
        pView.toggleRenderedView = function toggleRenderedView(pRendered) {
          if (typeof pRendered === 'boolean') {
            pView._renderedViewActive = pRendered;
          } else {
            pView._renderedViewActive = !pView._renderedViewActive;
          }
          if (pView._renderedViewActive) {
            pView._renderRenderedView();
          } else {
            pView._restoreEditingView();
          }
        };

        /**
         * Switch to the rendered view: marshal all editors, combine all segment
         * content, render to HTML via pict-section-content, and replace the
         * container contents with the rendered output.
         */
        pView._renderRenderedView = function _renderRenderedView() {
          let tmpContainer = pView._getContainerElement();
          if (!tmpContainer) {
            return;
          }

          // Marshal current editor content back to data before switching
          pView._marshalAllEditorsToData();

          // Combine all segments into a single markdown document
          let tmpSegments = pView._getSegmentsFromData();
          let tmpCombinedContent = '';
          if (tmpSegments && tmpSegments.length > 0) {
            let tmpParts = [];
            for (let i = 0; i < tmpSegments.length; i++) {
              tmpParts.push(tmpSegments[i].Content || '');
            }
            tmpCombinedContent = tmpParts.join('\n\n');
          }

          // Destroy existing CodeMirror editors
          for (let tmpIdx in pView._segmentEditors) {
            if (pView._segmentEditors[tmpIdx]) {
              pView._segmentEditors[tmpIdx].destroy();
            }
          }
          pView._segmentEditors = {};

          // Render the combined markdown via pict-section-content
          let tmpProvider = pView._getContentProvider();
          let tmpRenderedHTML = tmpProvider.parseMarkdown(tmpCombinedContent);

          // Build the rendered view container
          let tmpRenderedViewID = 'PictMDE-RenderedView';
          tmpContainer.innerHTML = "<div class=\"pict-mde-rendered-view\" id=\"".concat(tmpRenderedViewID, "\"><div class=\"pict-content\">").concat(tmpRenderedHTML || '', "</div></div>");
          tmpContainer.classList.add('pict-mde-rendered-mode');

          // Bump generation for stale-render protection
          pView._renderedViewGeneration++;
          let tmpGeneration = pView._renderedViewGeneration;

          // Post-render hooks for mermaid diagrams and KaTeX equations
          let tmpContentContainer = tmpContainer.querySelector("#".concat(tmpRenderedViewID, " .pict-content"));
          if (tmpContentContainer) {
            let tmpContentID = 'PictMDE-RenderedViewContent';
            tmpContentContainer.id = tmpContentID;
            pView._postRenderMermaid(tmpContentID, -1, tmpGeneration);
            pView._postRenderKaTeX(tmpContentID);
          }
        };

        /**
         * Switch back from rendered view to the editing view: rebuild the
         * full editor UI from the data.
         */
        pView._restoreEditingView = function _restoreEditingView() {
          let tmpContainer = pView._getContainerElement();
          if (!tmpContainer) {
            return;
          }
          tmpContainer.classList.remove('pict-mde-rendered-mode');
          pView._buildEditorUI();
        };
      };
    }, {
      "pict-section-content": 13
    }],
    23: [function (require, module, exports) {
      module.exports = {
        "DefaultRenderable": "MarkdownEditor-Wrap",
        "DefaultDestinationAddress": "#MarkdownEditor-Container-Div",
        "Templates": [{
          "Hash": "MarkdownEditor-Container",
          "Template": /*html*/"<div class=\"pict-mde\" id=\"PictMDE-Container\"></div>"
        }, {
          "Hash": "MarkdownEditor-Segment",
          "Template": /*html*/"<div class=\"pict-mde-segment\" id=\"PictMDE-Segment-{~D:Record.SegmentIndex~}\" data-segment-index=\"{~D:Record.SegmentIndex~}\">\n\t<div class=\"pict-mde-left-controls\">\n\t\t<div class=\"pict-mde-quadrant-tl\"></div>\n\t\t<div class=\"pict-mde-quadrant-bl\"></div>\n\t</div>\n\t<div class=\"pict-mde-drag-handle\" draggable=\"true\" title=\"Drag to reorder\"></div>\n\t<div class=\"pict-mde-segment-body\">\n\t\t<div class=\"pict-mde-segment-editor\" id=\"PictMDE-SegmentEditor-{~D:Record.SegmentIndex~}\"></div>\n\t\t<div class=\"pict-mde-image-preview\" id=\"PictMDE-ImagePreview-{~D:Record.SegmentIndex~}\"></div>\n\t\t<div class=\"pict-mde-rich-preview\" id=\"PictMDE-RichPreview-{~D:Record.SegmentIndex~}\"></div>\n\t</div>\n\t<div class=\"pict-mde-sidebar\" id=\"PictMDE-Sidebar-{~D:Record.SegmentIndex~}\">\n\t\t<div class=\"pict-mde-quadrant-tr\"></div>\n\t\t<div class=\"pict-mde-quadrant-br\"></div>\n\t\t<input type=\"file\" accept=\"image/*\" class=\"pict-mde-image-input\" id=\"PictMDE-ImageInput-{~D:Record.SegmentIndex~}\" style=\"display:none\" />\n\t</div>\n</div>"
        }, {
          "Hash": "MarkdownEditor-AddSegment",
          "Template": /*html*/"<div class=\"pict-mde-add-segment\">\n\t<button type=\"button\" class=\"pict-mde-btn-add\" onclick=\"{~D:Record.ViewIdentifier~}.addSegment()\">+ Add Segment</button>\n</div>"
        }],
        "Renderables": [{
          "RenderableHash": "MarkdownEditor-Wrap",
          "TemplateHash": "MarkdownEditor-Container",
          "DestinationAddress": "#MarkdownEditor-Container-Div"
        }],
        "TargetElementAddress": "#MarkdownEditor-Container-Div",
        // Address in AppData to read/write the segments array
        // The data at this address should be an array of objects, each with a "Content" property
        // e.g. AppData.Document.Segments = [ { Content: "# Hello" }, { Content: "Some text" } ]
        "ContentDataAddress": false,
        // Whether the editor should be read-only
        "ReadOnly": false,
        // Whether to show rich content previews (rendered markdown with syntax-highlighted
        // code, mermaid diagrams, KaTeX equations, tables, etc. via pict-section-content).
        // Requires the consumer to load the mermaid and/or katex libraries via CDN
        // for diagram/equation rendering; code highlighting works without CDN scripts.
        "EnableRichPreview": true,
        // ---- Quadrant button definitions ----
        // Each quadrant is an array of button objects:
        //   HTML   — innerHTML for the button
        //   Action — method name, optionally "method:arg" (receives segment index as first param)
        //   Class  — additional CSS class(es) appended to the base class
        //   Title  — tooltip text
        //
        // Consumers can override any quadrant to add, remove, or reorder buttons.
        // Left quadrant buttons (TL, BL) get the "pict-mde-left-btn" base class.
        // Right quadrant buttons (TR, BR) get the "pict-mde-sidebar-btn" base class.

        "ButtonsTL": [{
          "HTML": "&times;",
          "Action": "removeSegment",
          "Class": "pict-mde-btn-remove",
          "Title": "Remove Segment"
        }],
        "ButtonsBL": [{
          "HTML": "&uarr;",
          "Action": "moveSegmentUp",
          "Class": "pict-mde-btn-move",
          "Title": "Move Up"
        }, {
          "HTML": "&darr;",
          "Action": "moveSegmentDown",
          "Class": "pict-mde-btn-move",
          "Title": "Move Down"
        }, {
          "HTML": "&#x229E;",
          "Action": "toggleControls",
          "Class": "pict-mde-btn-linenums",
          "Title": "Toggle Controls"
        }, {
          "HTML": "&#x25CE;",
          "Action": "toggleSegmentPreview",
          "Class": "pict-mde-btn-preview",
          "Title": "Toggle Preview"
        }],
        "ButtonsTR": [{
          "HTML": "<b>B</b>",
          "Action": "applyFormatting:bold",
          "Class": "",
          "Title": "Bold (Ctrl+B)"
        }, {
          "HTML": "<i>I</i>",
          "Action": "applyFormatting:italic",
          "Class": "",
          "Title": "Italic (Ctrl+I)"
        }, {
          "HTML": "<code>&lt;&gt;</code>",
          "Action": "applyFormatting:code",
          "Class": "",
          "Title": "Inline Code (Ctrl+E)"
        }, {
          "HTML": "#",
          "Action": "applyFormatting:heading",
          "Class": "",
          "Title": "Heading"
        }, {
          "HTML": "[&thinsp;]",
          "Action": "applyFormatting:link",
          "Class": "",
          "Title": "Link"
        }, {
          "HTML": "&#x25A3;",
          "Action": "openImagePicker",
          "Class": "pict-mde-sidebar-btn-image",
          "Title": "Insert Image"
        }],
        "ButtonsBR": [],
        // CSS for the markdown editor
        "CSS": /*css*/"\n/* ---- Container ---- */\n.pict-mde\n{\n\tfont-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\n\tfont-size: 14px;\n}\n\n/* ---- Segment row: left-controls | drag-handle | editor body | sidebar ---- */\n.pict-mde-segment\n{\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: row;\n\talign-items: stretch;\n\tmargin-bottom: 6px;\n\tmin-height: 48px;\n\ttransition: background-color 0.15s ease;\n}\n\n/* ---- Left controls column ---- */\n.pict-mde-left-controls\n{\n\tflex: 0 0 22px;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 2px 0;\n}\n\n/* ---- Left-side quadrants ---- */\n.pict-mde-quadrant-tl\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tposition: sticky;\n\ttop: 2px;\n\tz-index: 2;\n}\n.pict-mde-quadrant-bl\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tposition: sticky;\n\tbottom: 2px;\n\tz-index: 2;\n}\n\n/* ---- Left-side buttons (shared base) ---- */\n.pict-mde-left-btn\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 20px;\n\theight: 20px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tpadding: 0;\n\tcolor: #888;\n\tline-height: 1;\n\tfont-family: inherit;\n\topacity: 0;\n\ttransition: opacity 0.15s ease;\n}\n.pict-mde-segment:hover .pict-mde-left-btn,\n.pict-mde-segment.pict-mde-active .pict-mde-left-btn\n{\n\topacity: 1;\n}\n.pict-mde-left-btn:hover\n{\n\tcolor: #222;\n}\n.pict-mde-btn-remove:hover\n{\n\tcolor: #CC3333;\n}\n.pict-mde-btn-linenums\n{\n\tfont-size: 11px;\n\tfont-weight: 600;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;\n}\n/* Highlight when controls are active */\n.pict-mde.pict-mde-controls-on .pict-mde-btn-linenums\n{\n\tcolor: #4A90D9;\n}\n.pict-mde-btn-preview\n{\n\tfont-size: 11px;\n}\n/* Highlight the preview button when preview is visible (not hidden) */\n.pict-mde-segment:not(.pict-mde-preview-hidden) .pict-mde-btn-preview\n{\n\tcolor: #4A90D9;\n}\n/* Dim preview button when this segment's preview is individually hidden */\n.pict-mde-segment.pict-mde-preview-hidden .pict-mde-btn-preview\n{\n\tcolor: #CCC;\n}\n\n/* ---- Drag handle (simple grey bar) ---- */\n.pict-mde-drag-handle\n{\n\tflex: 0 0 8px;\n\tcursor: grab;\n\tbackground: #EDEDED;\n\ttransition: background-color 0.15s ease;\n\tuser-select: none;\n}\n.pict-mde-drag-handle:active\n{\n\tcursor: grabbing;\n}\n.pict-mde-drag-handle:hover\n{\n\tbackground: #C8C8C8;\n}\n\n/* ---- Editor body (middle column) ---- */\n.pict-mde-segment-body\n{\n\tflex: 1 1 auto;\n\tmin-width: 0;\n\tbackground: #FFFFFF;\n\ttransition: background-color 0.15s ease;\n}\n.pict-mde-segment-editor\n{\n\tmin-height: 48px;\n}\n\n/* ---- Image preview area below the editor ---- */\n.pict-mde-image-preview\n{\n\tdisplay: none;\n}\n.pict-mde-image-preview.pict-mde-has-images\n{\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 8px;\n\tpadding: 8px 12px;\n\tborder-top: 1px solid #EDEDED;\n}\n.pict-mde-image-preview img\n{\n\tmax-width: 200px;\n\tmax-height: 150px;\n\tborder-radius: 3px;\n\tborder: 1px solid #E0E0E0;\n\tobject-fit: contain;\n\tbackground: #F8F8F8;\n}\n.pict-mde-image-preview-item\n{\n\tposition: relative;\n\tdisplay: inline-block;\n}\n.pict-mde-image-preview-label\n{\n\tdisplay: block;\n\tfont-size: 10px;\n\tcolor: #999;\n\tmargin-top: 2px;\n\tmax-width: 200px;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n/* ---- Rich content preview area (rendered via pict-section-content) ---- */\n.pict-mde-rich-preview\n{\n\tdisplay: none;\n}\n.pict-mde-rich-preview.pict-mde-has-rich-preview\n{\n\tdisplay: block;\n\tborder-top: 1px solid #EDEDED;\n\tbackground: #FCFCFC;\n}\n/* Global preview toggle: hide all previews when container has class */\n.pict-mde.pict-mde-previews-hidden .pict-mde-rich-preview.pict-mde-has-rich-preview,\n.pict-mde.pict-mde-previews-hidden .pict-mde-image-preview.pict-mde-has-images\n{\n\tdisplay: none;\n}\n/* Per-segment preview toggle: hide previews for a specific segment */\n.pict-mde-segment.pict-mde-preview-hidden .pict-mde-rich-preview.pict-mde-has-rich-preview,\n.pict-mde-segment.pict-mde-preview-hidden .pict-mde-image-preview.pict-mde-has-images\n{\n\tdisplay: none;\n}\n/* Constrain the pict-content inside the preview to fit the segment */\n.pict-mde-rich-preview .pict-content\n{\n\tpadding: 12px;\n\tmax-width: none;\n\tmargin: 0;\n\tfont-size: 13px;\n}\n/* Reduce heading sizes in the preview to be proportional */\n.pict-mde-rich-preview .pict-content h1\n{\n\tfont-size: 1.4em;\n\tmargin-top: 0;\n}\n.pict-mde-rich-preview .pict-content h2\n{\n\tfont-size: 1.2em;\n\tmargin-top: 0.75em;\n}\n.pict-mde-rich-preview .pict-content h3\n{\n\tfont-size: 1.1em;\n\tmargin-top: 0.6em;\n}\n\n/* ---- Rendered view (full document preview mode) ---- */\n.pict-mde-rendered-view\n{\n\tpadding: 16px 20px;\n\tbackground: #FFFFFF;\n\tmin-height: 120px;\n}\n.pict-mde-rendered-view .pict-content\n{\n\tmax-width: none;\n\tmargin: 0;\n}\n/* Hide the add-segment button in rendered mode */\n.pict-mde.pict-mde-rendered-mode .pict-mde-add-segment\n{\n\tdisplay: none;\n}\n\n/* Focused / active editor gets subtle warm background */\n.pict-mde-segment.pict-mde-active .pict-mde-segment-body\n{\n\tbackground: #FAFAF5;\n}\n.pict-mde-segment.pict-mde-active .pict-mde-drag-handle\n{\n\tbackground: #9CB4C8;\n}\n\n/* ---- Right sidebar column ---- */\n.pict-mde-sidebar\n{\n\tflex: 0 0 30px;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: flex-start;\n\tjustify-content: space-between;\n\tposition: relative;\n}\n\n/* ---- Right-side quadrants ---- */\n.pict-mde-quadrant-tr\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tpadding: 4px 0;\n\twidth: 100%;\n\topacity: 0;\n\ttransition: opacity 0.15s ease, top 0.1s ease;\n\tposition: sticky;\n\ttop: 0;\n}\n.pict-mde-quadrant-br\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tpadding: 4px 0;\n\twidth: 100%;\n\topacity: 0;\n\ttransition: opacity 0.15s ease;\n\tposition: sticky;\n\tbottom: 0;\n}\n\n/* Active segment always shows its right-side quadrants */\n.pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,\n.pict-mde-segment.pict-mde-active .pict-mde-quadrant-br\n{\n\topacity: 1;\n}\n/* When no segment is active, hovering shows both left + right controls */\n.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-quadrant-tr,\n.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-quadrant-br\n{\n\topacity: 1;\n}\n\n/* ---- Controls-hidden mode: right quadrants show faintly on hover ---- */\n.pict-mde.pict-mde-controls-hidden .pict-mde-quadrant-tr,\n.pict-mde.pict-mde-controls-hidden .pict-mde-quadrant-br\n{\n\topacity: 0;\n}\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment:hover .pict-mde-quadrant-tr,\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment:hover .pict-mde-quadrant-br\n{\n\topacity: 0.3;\n}\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment.pict-mde-active .pict-mde-quadrant-br\n{\n\topacity: 0.3;\n}\n\n/* When JS sets a cursor-relative offset, switch TR from sticky to absolute positioning */\n.pict-mde-quadrant-tr.pict-mde-sidebar-at-cursor\n{\n\tposition: absolute;\n\ttop: var(--pict-mde-sidebar-top, 0px);\n}\n\n/* ---- Right-side buttons (shared base) ---- */\n.pict-mde-sidebar-btn\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 24px;\n\theight: 22px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tpadding: 0;\n\tborder-radius: 3px;\n\tcolor: #666;\n\tline-height: 1;\n\tfont-family: inherit;\n}\n.pict-mde-sidebar-btn:hover\n{\n\tcolor: #222;\n}\n.pict-mde-sidebar-btn b\n{\n\tfont-size: 13px;\n\tfont-weight: 700;\n}\n.pict-mde-sidebar-btn i\n{\n\tfont-size: 13px;\n\tfont-style: italic;\n}\n.pict-mde-sidebar-btn code\n{\n\tfont-size: 10px;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;\n}\n\n/* ---- Add segment button ---- */\n.pict-mde-add-segment\n{\n\tmargin-top: 6px;\n\tpadding-left: 30px;\n}\n.pict-mde-btn-add\n{\n\tdisplay: block;\n\twidth: 100%;\n\tpadding: 7px;\n\tborder: 2px dashed #D0D0D0;\n\tborder-radius: 4px;\n\tbackground: transparent;\n\tcolor: #999;\n\tfont-size: 12px;\n\tfont-weight: 600;\n\tcursor: pointer;\n\ttransition: all 0.15s ease;\n}\n.pict-mde-btn-add:hover\n{\n\tborder-color: #4A90D9;\n\tcolor: #4A90D9;\n\tbackground: rgba(74, 144, 217, 0.04);\n}\n\n/* ---- Image drag-over indicator ---- */\n.pict-mde-segment-editor.pict-mde-image-dragover\n{\n\toutline: 2px dashed #4A90D9;\n\toutline-offset: -2px;\n}\n\n/* ---- Drag-in-progress: prevent CodeMirror from intercepting drop events ---- */\n.pict-mde.pict-mde-dragging .pict-mde-segment-editor\n{\n\tpointer-events: none;\n}\n\n/* ---- Drop target indicators for drag reorder ---- */\n.pict-mde-segment.pict-mde-drag-over-top\n{\n\tbox-shadow: 0 -2px 0 0 #4A90D9;\n}\n.pict-mde-segment.pict-mde-drag-over-bottom\n{\n\tbox-shadow: 0 2px 0 0 #4A90D9;\n}\n\n/* ---- CodeMirror overrides inside segments ---- */\n.pict-mde-segment-editor .cm-editor\n{\n\tborder: none;\n}\n.pict-mde-segment-editor .cm-editor .cm-scroller\n{\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;\n\tfont-size: 14px;\n\tline-height: 1.6;\n}\n.pict-mde-segment-editor .cm-editor.cm-focused\n{\n\toutline: none;\n}\n.pict-mde-segment-editor .cm-editor .cm-content\n{\n\tpadding: 8px 12px;\n\tmin-height: 36px;\n}\n.pict-mde-segment-editor .cm-editor .cm-gutters\n{\n\tbackground: #F8F8F8;\n\tborder-right: 1px solid #E8E8E8;\n\tcolor: #BBB;\n}\n\n/* ---- Collapsed data URI widget ---- */\n.pict-mde-data-uri-collapsed\n{\n\tdisplay: inline;\n\tbackground: #F0F0F0;\n\tcolor: #888;\n\tfont-size: 11px;\n\tpadding: 1px 4px;\n\tborder-radius: 3px;\n\tborder: 1px solid #E0E0E0;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;\n\tcursor: default;\n\twhite-space: nowrap;\n}\n\n/* ---- Line number / controls toggle: gutters hidden by default ---- */\n.pict-mde .cm-editor .cm-gutters\n{\n\tdisplay: none;\n}\n.pict-mde.pict-mde-controls-on .cm-editor .cm-gutters\n{\n\tdisplay: flex;\n}\n"
      };
    }, {}],
    24: [function (require, module, exports) {
      const libPictViewClass = require('pict-view');
      const libPictSectionContent = require('pict-section-content');
      const _DefaultConfiguration = require('./Pict-Section-MarkdownEditor-DefaultConfiguration.js');

      // Helper modules
      const libFormatting = require('./Pict-MDE-Formatting.js');
      const libImageHandling = require('./Pict-MDE-ImageHandling.js');
      const libDragAndReorder = require('./Pict-MDE-DragAndReorder.js');
      const libRichPreview = require('./Pict-MDE-RichPreview.js');
      const libCodeMirror = require('./Pict-MDE-CodeMirror.js');
      class PictSectionMarkdownEditor extends libPictViewClass {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);
          super(pFable, tmpOptions, pServiceHash);
          this.initialRenderComplete = false;

          // CodeMirror prototype references (injected by consumer or found on window)
          this._codeMirrorModules = null;

          // Map of segment index to CodeMirror EditorView instance
          this._segmentEditors = {};

          // Internal segment counter (monotonically increasing for unique IDs)
          this._segmentCounter = 0;

          // The view identifier used for onclick handlers in templates
          this._viewCallIdentifier = false;

          // Currently active (focused) segment index, or -1
          this._activeSegmentIndex = -1;

          // Drag state for reorder
          this._dragSourceIndex = -1;

          // Whether controls (line numbers + right sidebar) are currently visible
          this._controlsVisible = true;

          // Whether rich previews are globally visible
          this._previewsVisible = true;

          // Set of logical segment indices where preview has been individually hidden
          this._hiddenPreviewSegments = {};

          // Debounce timers for image preview updates (keyed by segment index)
          this._imagePreviewTimers = {};

          // Debounce timers for rich content preview updates (keyed by segment index)
          this._richPreviewTimers = {};

          // Generation counters for mermaid async rendering (keyed by segment index)
          this._richPreviewGenerations = {};

          // Content provider for markdown-to-HTML rendering in rich previews
          // (pict-section-content provides parseMarkdown, code highlighting, etc.)
          this._contentProvider = null;

          // Whether the rendered (read-mode) view is currently active
          this._renderedViewActive = false;

          // Generation counter for rendered view mermaid async rendering
          this._renderedViewGeneration = 0;

          // Attach helper modules
          libFormatting.attach(this);
          libImageHandling.attach(this);
          libDragAndReorder.attach(this);
          libRichPreview.attach(this);
          libCodeMirror.attach(this);
        }
        onBeforeInitialize() {
          super.onBeforeInitialize();
          this.targetElement = false;
          return super.onBeforeInitialize();
        }

        /**
         * Connect the CodeMirror modules.  The consumer must pass an object with:
         *   - EditorView: the EditorView class
         *   - EditorState: the EditorState class
         *   - extensions: an array of extensions to use (e.g. basicSetup, markdown(), etc.)
         *
         * If not called explicitly, the view will attempt to find them on window.CodeMirrorModules.
         *
         * @param {object} [pCodeMirrorModules] - The CodeMirror modules object
         * @returns {boolean|void}
         */
        connectCodeMirrorModules(pCodeMirrorModules) {
          if (pCodeMirrorModules && typeof pCodeMirrorModules === 'object') {
            if (typeof pCodeMirrorModules.EditorView === 'function' && typeof pCodeMirrorModules.EditorState === 'function') {
              this._codeMirrorModules = pCodeMirrorModules;
              return;
            }
          }

          // Try to find CodeMirror modules in global scope
          if (typeof window !== 'undefined') {
            if (window.CodeMirrorModules && typeof window.CodeMirrorModules.EditorView === 'function') {
              this.log.trace("PICT-MarkdownEditor Found CodeMirror modules on window.CodeMirrorModules.");
              this._codeMirrorModules = window.CodeMirrorModules;
              return;
            }
          }
          this.log.error("PICT-MarkdownEditor No CodeMirror modules found. Provide them via connectCodeMirrorModules() or set window.CodeMirrorModules.");
          return false;
        }
        onAfterRender(pRenderable) {
          // Inject CSS from all registered views
          this.pict.CSSMap.injectCSS();
          if (!this.initialRenderComplete) {
            this.onAfterInitialRender();
            this.initialRenderComplete = true;
          }
          return super.onAfterRender(pRenderable);
        }
        onAfterInitialRender() {
          // Resolve CodeMirror modules if not already set
          if (!this._codeMirrorModules) {
            this.connectCodeMirrorModules();
          }
          if (!this._codeMirrorModules) {
            this.log.error("PICT-MarkdownEditor Cannot initialize; no CodeMirror modules available.");
            return false;
          }

          // Register pict-section-content's CSS for rich preview rendering.
          // This ensures the rendered markdown (headings, code blocks, tables, etc.)
          // is styled correctly inside the preview area.
          if (this.options.EnableRichPreview) {
            let tmpContentViewConfig = libPictSectionContent.default_configuration;
            if (tmpContentViewConfig && tmpContentViewConfig.CSS) {
              this.pict.CSSMap.addCSS('Pict-Content-View', tmpContentViewConfig.CSS);
            }
          }

          // Find the target element
          let tmpTargetElementSet = this.services.ContentAssignment.getElement(this.options.TargetElementAddress);
          if (!tmpTargetElementSet || tmpTargetElementSet.length < 1) {
            this.log.error("PICT-MarkdownEditor Could not find target element [".concat(this.options.TargetElementAddress, "]!"));
            this.targetElement = false;
            return false;
          }
          this.targetElement = tmpTargetElementSet[0];

          // Determine the view call identifier for onclick handlers
          this._viewCallIdentifier = this._resolveViewCallIdentifier();

          // Build the editor UI
          this._buildEditorUI();
        }

        /**
         * Resolve how the view can be referenced from global onclick handlers.
         * Returns a string like "_Pict.views.MyViewHash"
         *
         * @returns {string}
         */
        _resolveViewCallIdentifier() {
          let tmpViews = this.pict.views;
          for (let tmpViewHash in tmpViews) {
            if (tmpViews[tmpViewHash] === this) {
              return "_Pict.views.".concat(tmpViewHash);
            }
          }
          return "_Pict.servicesMap.PictView['".concat(this.Hash, "']");
        }

        /**
         * Get the .pict-mde container element.  Always does a fresh DOM lookup
         * because pict's async render pipeline can replace the element between calls.
         *
         * @returns {HTMLElement|null}
         */
        _getContainerElement() {
          if (this.targetElement) {
            let tmpContainer = this.targetElement.querySelector('.pict-mde');
            if (tmpContainer) {
              return tmpContainer;
            }
          }
          return this.targetElement || null;
        }

        /**
         * Build the full editor UI: render existing segments from data and the add-segment button.
         */
        _buildEditorUI() {
          let tmpContainer = this._getContainerElement();

          // Ensure the container has the pict-mde class (the template's wrapper
          // may have been replaced by pict's async render pipeline)
          if (tmpContainer && !tmpContainer.classList.contains('pict-mde')) {
            tmpContainer.classList.add('pict-mde');
          }

          // Destroy existing editors before clearing
          for (let tmpIdx in this._segmentEditors) {
            if (this._segmentEditors[tmpIdx]) {
              this._segmentEditors[tmpIdx].destroy();
            }
          }
          tmpContainer.innerHTML = '';

          // Restore toggle states on the container after clearing
          if (!this._previewsVisible) {
            tmpContainer.classList.add('pict-mde-previews-hidden');
          }
          if (this._controlsVisible) {
            tmpContainer.classList.add('pict-mde-controls-on');
          } else {
            tmpContainer.classList.add('pict-mde-controls-hidden');
          }

          // Load existing segments from data address, or start with one empty segment
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments || tmpSegments.length === 0) {
            tmpSegments = [{
              Content: ''
            }];
            this._setSegmentsToData(tmpSegments);
          }
          this._segmentCounter = 0;
          this._segmentEditors = {};
          for (let i = 0; i < tmpSegments.length; i++) {
            this._renderSegment(tmpContainer, i, tmpSegments[i].Content || '');
          }
          this._renderAddButton(tmpContainer);
        }

        /**
         * Render a single segment into the container.
         *
         * @param {HTMLElement} pContainer - The container element
         * @param {number} pIndex - The segment index
         * @param {string} pContent - The initial content
         */
        _renderSegment(pContainer, pIndex, pContent) {
          let tmpSegmentIndex = this._segmentCounter++;
          let tmpRecord = {
            SegmentIndex: tmpSegmentIndex,
            SegmentDisplayIndex: pIndex + 1,
            ViewIdentifier: this._viewCallIdentifier
          };
          let tmpHTML = this.pict.parseTemplateByHash('MarkdownEditor-Segment', tmpRecord);
          let tmpTempDiv = document.createElement('div');
          tmpTempDiv.innerHTML = tmpHTML;
          let tmpSegmentElement = tmpTempDiv.firstElementChild;
          pContainer.appendChild(tmpSegmentElement);

          // Build quadrant buttons from configuration arrays
          this._buildQuadrantButtons(tmpSegmentElement, tmpSegmentIndex);

          // Restore per-segment preview hidden state (tracked by logical index)
          if (this._hiddenPreviewSegments[pIndex]) {
            tmpSegmentElement.classList.add('pict-mde-preview-hidden');
          }

          // Wire up drag-and-drop on the drag handle
          this._wireSegmentDragEvents(tmpSegmentElement, tmpSegmentIndex);

          // Create the CodeMirror editor in the segment editor container
          let tmpEditorContainer = document.getElementById("PictMDE-SegmentEditor-".concat(tmpSegmentIndex));
          if (tmpEditorContainer) {
            this._createEditorInContainer(tmpEditorContainer, tmpSegmentIndex, pContent);

            // Wire image drag-and-drop on the editor container
            this._wireImageDragEvents(tmpEditorContainer, tmpSegmentIndex);

            // Render image previews for existing content
            if (pContent) {
              this._updateImagePreviews(tmpSegmentIndex);
              this._updateRichPreviews(tmpSegmentIndex);
            }
          }
        }

        /**
         * Build buttons in all four quadrants (TL, BL, TR, BR) from the
         * configuration arrays.  Each button config has:
         *   HTML   — innerHTML
         *   Action — "methodName" or "methodName:arg"
         *   Class  — additional CSS class(es)
         *   Title  — tooltip text
         *
         * Left quadrant buttons (TL, BL) get the "pict-mde-left-btn" base class.
         * Right quadrant buttons (TR, BR) get the "pict-mde-sidebar-btn" base class.
         *
         * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
         * @param {number} pSegmentIndex - The internal segment index
         */
        _buildQuadrantButtons(pSegmentElement, pSegmentIndex) {
          let tmpQuadrants = [{
            key: 'ButtonsTL',
            selector: '.pict-mde-quadrant-tl',
            baseClass: 'pict-mde-left-btn'
          }, {
            key: 'ButtonsBL',
            selector: '.pict-mde-quadrant-bl',
            baseClass: 'pict-mde-left-btn'
          }, {
            key: 'ButtonsTR',
            selector: '.pict-mde-quadrant-tr',
            baseClass: 'pict-mde-sidebar-btn'
          }, {
            key: 'ButtonsBR',
            selector: '.pict-mde-quadrant-br',
            baseClass: 'pict-mde-sidebar-btn'
          }];
          let tmpSelf = this;
          for (let q = 0; q < tmpQuadrants.length; q++) {
            let tmpQuadrant = tmpQuadrants[q];
            let tmpContainer = pSegmentElement.querySelector(tmpQuadrant.selector);
            if (!tmpContainer) {
              continue;
            }
            let tmpButtons = this.options[tmpQuadrant.key];
            if (!Array.isArray(tmpButtons)) {
              continue;
            }
            for (let b = 0; b < tmpButtons.length; b++) {
              let tmpBtnConfig = tmpButtons[b];
              let tmpButton = document.createElement('button');
              tmpButton.type = 'button';
              tmpButton.className = tmpQuadrant.baseClass;
              if (tmpBtnConfig.Class) {
                tmpButton.className += ' ' + tmpBtnConfig.Class;
              }
              tmpButton.innerHTML = tmpBtnConfig.HTML || '';
              tmpButton.title = tmpBtnConfig.Title || '';

              // Parse the action string: "methodName" or "methodName:arg"
              let tmpAction = tmpBtnConfig.Action || '';
              let tmpMethod = tmpAction;
              let tmpArg = null;
              let tmpColonIndex = tmpAction.indexOf(':');
              if (tmpColonIndex >= 0) {
                tmpMethod = tmpAction.substring(0, tmpColonIndex);
                tmpArg = tmpAction.substring(tmpColonIndex + 1);
              }

              // Build the click handler
              (function (pMethod, pArg, pSegIdx) {
                tmpButton.addEventListener('click', () => {
                  if (typeof tmpSelf[pMethod] === 'function') {
                    if (pArg !== null) {
                      tmpSelf[pMethod](pSegIdx, pArg);
                    } else {
                      tmpSelf[pMethod](pSegIdx);
                    }
                  } else {
                    tmpSelf.log.warn("PICT-MarkdownEditor _buildQuadrantButtons: method \"".concat(pMethod, "\" not found."));
                  }
                });
              })(tmpMethod, tmpArg, pSegmentIndex);
              tmpContainer.appendChild(tmpButton);
            }
          }
        }

        /**
         * Hook for subclasses to customize the CodeMirror extensions before editor creation.
         *
         * @param {Array} pExtensions - The extensions array to modify
         * @param {number} pSegmentIndex - The segment index
         * @returns {Array} The modified extensions array
         */
        customConfigureExtensions(pExtensions, pSegmentIndex) {
          return pExtensions;
        }

        /**
         * Render the "Add Segment" button at the bottom of the container.
         *
         * @param {HTMLElement} pContainer - The container element
         */
        _renderAddButton(pContainer) {
          let tmpRecord = {
            ViewIdentifier: this._viewCallIdentifier
          };
          let tmpHTML = this.pict.parseTemplateByHash('MarkdownEditor-AddSegment', tmpRecord);
          let tmpTempDiv = document.createElement('div');
          tmpTempDiv.innerHTML = tmpHTML;
          let tmpButtonElement = tmpTempDiv.firstElementChild;
          pContainer.appendChild(tmpButtonElement);
        }

        /**
         * Hook for consumers to handle image uploads.
         *
         * Override this in a subclass or consumer to upload images to a server/CDN.
         * Return true to indicate you are handling the upload asynchronously.
         * Call fCallback(null, url) on success, or fCallback(error) on failure.
         * Return false/undefined to fall back to base64 data URI inline.
         *
         * @param {File} pFile - The image File object
         * @param {number} pSegmentIndex - The logical segment index
         * @param {function} fCallback - Callback: fCallback(pError, pURL)
         * @returns {boolean} true if handling the upload, false to use base64 default
         */
        onImageUpload(pFile, pSegmentIndex, fCallback) {
          // Override in subclass or consumer
          return false;
        }

        // -- Controls Toggle (line numbers + right sidebar) --

        /**
         * Toggle controls (line number gutters and right sidebar formatting
         * buttons) on or off for all segments.
         *
         * When controls are hidden the right-side quadrants (TR, BR) appear
         * faintly on hover but are otherwise invisible, and CodeMirror line
         * number gutters are hidden.
         *
         * This method is called by the quadrant button system with the segment
         * index as the first argument — it ignores that argument and uses only
         * the optional boolean.
         *
         * @param {number|boolean} [pSegmentIndexOrVisible] - Segment index (ignored) or boolean
         * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
         */
        toggleControls(pSegmentIndexOrVisible, pVisible) {
          // When called from a quadrant button, first arg is segment index (number).
          // When called programmatically, first arg may be a boolean.
          let tmpVisible = pVisible;
          if (typeof pSegmentIndexOrVisible === 'boolean') {
            tmpVisible = pSegmentIndexOrVisible;
          }
          if (typeof tmpVisible === 'boolean') {
            this._controlsVisible = tmpVisible;
          } else {
            this._controlsVisible = !this._controlsVisible;
          }
          let tmpContainer = this._getContainerElement();
          if (tmpContainer) {
            if (this._controlsVisible) {
              tmpContainer.classList.add('pict-mde-controls-on');
              tmpContainer.classList.remove('pict-mde-controls-hidden');
            } else {
              tmpContainer.classList.remove('pict-mde-controls-on');
              tmpContainer.classList.add('pict-mde-controls-hidden');
            }
          }
        }

        /**
         * Toggle line numbers on or off for all segments.
         * Backward-compatible alias for toggleControls().
         *
         * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
         */
        toggleLineNumbers(pVisible) {
          this.toggleControls(pVisible);
        }

        // -- Preview Toggle --

        /**
         * Toggle rich previews on or off for all segments globally.
         *
         * When hidden globally, individual segment overrides are preserved
         * so that restoring global visibility returns to the per-segment state.
         *
         * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
         */
        togglePreview(pVisible) {
          if (typeof pVisible === 'boolean') {
            this._previewsVisible = pVisible;
          } else {
            this._previewsVisible = !this._previewsVisible;
          }
          let tmpContainer = this._getContainerElement();
          if (tmpContainer) {
            if (this._previewsVisible) {
              tmpContainer.classList.remove('pict-mde-previews-hidden');
            } else {
              tmpContainer.classList.add('pict-mde-previews-hidden');
            }
          }
        }

        /**
         * Toggle the rich preview for a single segment.
         *
         * This adds/removes the .pict-mde-preview-hidden class on the
         * individual segment element, independent of the global toggle.
         *
         * @param {number} pSegmentIndex - The internal segment index
         * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
         */
        toggleSegmentPreview(pSegmentIndex, pVisible) {
          // Convert internal index to logical index for persistent tracking
          let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
          if (tmpLogicalIndex < 0) {
            return;
          }
          let tmpCurrentlyHidden = !!this._hiddenPreviewSegments[tmpLogicalIndex];
          if (typeof pVisible === 'boolean') {
            tmpCurrentlyHidden = !pVisible;
          } else {
            tmpCurrentlyHidden = !tmpCurrentlyHidden;
          }
          if (tmpCurrentlyHidden) {
            this._hiddenPreviewSegments[tmpLogicalIndex] = true;
          } else {
            delete this._hiddenPreviewSegments[tmpLogicalIndex];
          }
          let tmpSegmentEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (tmpSegmentEl) {
            if (tmpCurrentlyHidden) {
              tmpSegmentEl.classList.add('pict-mde-preview-hidden');
            } else {
              tmpSegmentEl.classList.remove('pict-mde-preview-hidden');
              // Render preview content when making it visible
              this._updateRichPreviews(pSegmentIndex);
              this._updateImagePreviews(pSegmentIndex);
            }
          }
        }

        // -- Segment Data Management --

        /**
         * Get the segments array from the configured data address.
         *
         * @returns {Array|null}
         */
        _getSegmentsFromData() {
          if (!this.options.ContentDataAddress) {
            return null;
          }
          const tmpAddressSpace = {
            Fable: this.fable,
            Pict: this.fable,
            AppData: this.AppData,
            Bundle: this.Bundle,
            Options: this.options
          };
          let tmpData = this.fable.manifest.getValueByHash(tmpAddressSpace, this.options.ContentDataAddress);
          if (Array.isArray(tmpData)) {
            return tmpData;
          }
          return null;
        }

        /**
         * Write the segments array to the configured data address.
         *
         * @param {Array} pSegments - The segments array
         */
        _setSegmentsToData(pSegments) {
          if (!this.options.ContentDataAddress) {
            return;
          }
          const tmpAddressSpace = {
            Fable: this.fable,
            Pict: this.fable,
            AppData: this.AppData,
            Bundle: this.Bundle,
            Options: this.options
          };
          this.fable.manifest.setValueByHash(tmpAddressSpace, this.options.ContentDataAddress, pSegments);
        }

        /**
         * Called when a segment's content changes in the CodeMirror editor.
         *
         * @param {number} pSegmentIndex - The internal segment index
         * @param {string} pContent - The new content
         */
        _onSegmentContentChange(pSegmentIndex, pContent) {
          let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
          if (tmpLogicalIndex < 0) {
            return;
          }
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments) {
            return;
          }
          if (tmpLogicalIndex < tmpSegments.length) {
            tmpSegments[tmpLogicalIndex].Content = pContent;
          }
          this.onContentChange(tmpLogicalIndex, pContent);

          // Debounce image preview updates (500ms) to avoid thrashing on every keystroke
          let tmpSelf = this;
          if (this._imagePreviewTimers[pSegmentIndex]) {
            clearTimeout(this._imagePreviewTimers[pSegmentIndex]);
          }
          this._imagePreviewTimers[pSegmentIndex] = setTimeout(() => {
            tmpSelf._updateImagePreviews(pSegmentIndex);
            delete tmpSelf._imagePreviewTimers[pSegmentIndex];
          }, 500);

          // Debounce rich content preview updates (mermaid / KaTeX) at 500ms
          if (this._richPreviewTimers[pSegmentIndex]) {
            clearTimeout(this._richPreviewTimers[pSegmentIndex]);
          }
          this._richPreviewTimers[pSegmentIndex] = setTimeout(() => {
            tmpSelf._updateRichPreviews(pSegmentIndex);
            delete tmpSelf._richPreviewTimers[pSegmentIndex];
          }, 500);
        }

        /**
         * Hook for subclasses to respond to content changes.
         *
         * @param {number} pSegmentIndex - The logical segment index
         * @param {string} pContent - The new content
         */
        onContentChange(pSegmentIndex, pContent) {
          // Override in subclass
        }

        /**
         * Get the logical (ordered) index for an internal segment index.
         *
         * @param {number} pInternalIndex - The internal segment index
         * @returns {number} The logical index, or -1 if not found
         */
        _getLogicalIndex(pInternalIndex) {
          let tmpContainer = this._getContainerElement();
          if (!tmpContainer) {
            return -1;
          }
          let tmpSegmentElements = tmpContainer.querySelectorAll('.pict-mde-segment');
          for (let i = 0; i < tmpSegmentElements.length; i++) {
            let tmpIndex = parseInt(tmpSegmentElements[i].getAttribute('data-segment-index'), 10);
            if (tmpIndex === pInternalIndex) {
              return i;
            }
          }
          return -1;
        }

        /**
         * Get the ordered list of internal segment indices from the DOM.
         *
         * @returns {Array<number>}
         */
        _getOrderedSegmentIndices() {
          let tmpContainer = this._getContainerElement();
          if (!tmpContainer) {
            return [];
          }
          let tmpSegmentElements = tmpContainer.querySelectorAll('.pict-mde-segment');
          let tmpIndices = [];
          for (let i = 0; i < tmpSegmentElements.length; i++) {
            tmpIndices.push(parseInt(tmpSegmentElements[i].getAttribute('data-segment-index'), 10));
          }
          return tmpIndices;
        }

        // -- Public API --

        /**
         * Add a new empty segment at the end.
         *
         * @param {string} [pContent] - Optional initial content for the new segment
         */
        addSegment(pContent) {
          let tmpContent = typeof pContent === 'string' ? pContent : '';
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments) {
            tmpSegments = [];
          }
          tmpSegments.push({
            Content: tmpContent
          });
          this._setSegmentsToData(tmpSegments);
          this._buildEditorUI();
        }

        /**
         * Remove a segment by its internal index.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        removeSegment(pSegmentIndex) {
          let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
          if (tmpLogicalIndex < 0) {
            this.log.warn("PICT-MarkdownEditor removeSegment: segment index ".concat(pSegmentIndex, " not found."));
            return;
          }
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments || tmpSegments.length <= 1) {
            this.log.warn("PICT-MarkdownEditor removeSegment: cannot remove the last segment.");
            return;
          }
          if (this._segmentEditors[pSegmentIndex]) {
            this._segmentEditors[pSegmentIndex].destroy();
            delete this._segmentEditors[pSegmentIndex];
          }
          tmpSegments.splice(tmpLogicalIndex, 1);
          this._setSegmentsToData(tmpSegments);

          // Update per-segment hidden preview state after removal
          let tmpNewHidden = {};
          for (let tmpKey in this._hiddenPreviewSegments) {
            let tmpIdx = parseInt(tmpKey, 10);
            if (tmpIdx < tmpLogicalIndex) {
              tmpNewHidden[tmpIdx] = true;
            } else if (tmpIdx > tmpLogicalIndex) {
              tmpNewHidden[tmpIdx - 1] = true;
            }
            // tmpIdx === tmpLogicalIndex is the removed segment; skip it
          }
          this._hiddenPreviewSegments = tmpNewHidden;
          this._buildEditorUI();
        }

        /**
         * Move a segment up by its internal index.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        moveSegmentUp(pSegmentIndex) {
          let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
          if (tmpLogicalIndex <= 0) {
            return;
          }
          this._marshalAllEditorsToData();
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments) {
            return;
          }
          let tmpTemp = tmpSegments[tmpLogicalIndex];
          tmpSegments[tmpLogicalIndex] = tmpSegments[tmpLogicalIndex - 1];
          tmpSegments[tmpLogicalIndex - 1] = tmpTemp;

          // Swap per-segment hidden preview state to follow the moved segment
          this._swapHiddenPreviewState(tmpLogicalIndex, tmpLogicalIndex - 1);
          this._buildEditorUI();
        }

        /**
         * Move a segment down by its internal index.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        moveSegmentDown(pSegmentIndex) {
          let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments || tmpLogicalIndex < 0 || tmpLogicalIndex >= tmpSegments.length - 1) {
            return;
          }
          this._marshalAllEditorsToData();
          let tmpTemp = tmpSegments[tmpLogicalIndex];
          tmpSegments[tmpLogicalIndex] = tmpSegments[tmpLogicalIndex + 1];
          tmpSegments[tmpLogicalIndex + 1] = tmpTemp;

          // Swap per-segment hidden preview state to follow the moved segment
          this._swapHiddenPreviewState(tmpLogicalIndex, tmpLogicalIndex + 1);
          this._buildEditorUI();
        }

        /**
         * Get the content of a specific segment by logical index.
         *
         * @param {number} pLogicalIndex - The logical (0-based) index
         * @returns {string} The segment content
         */
        getSegmentContent(pLogicalIndex) {
          let tmpOrderedIndices = this._getOrderedSegmentIndices();
          if (pLogicalIndex < 0 || pLogicalIndex >= tmpOrderedIndices.length) {
            return '';
          }
          let tmpInternalIndex = tmpOrderedIndices[pLogicalIndex];
          let tmpEditor = this._segmentEditors[tmpInternalIndex];
          if (tmpEditor) {
            return tmpEditor.state.doc.toString();
          }
          return '';
        }

        /**
         * Set the content of a specific segment by logical index.
         *
         * @param {number} pLogicalIndex - The logical (0-based) index
         * @param {string} pContent - The content to set
         */
        setSegmentContent(pLogicalIndex, pContent) {
          let tmpOrderedIndices = this._getOrderedSegmentIndices();
          if (pLogicalIndex < 0 || pLogicalIndex >= tmpOrderedIndices.length) {
            this.log.warn("PICT-MarkdownEditor setSegmentContent: index ".concat(pLogicalIndex, " out of range."));
            return;
          }
          let tmpInternalIndex = tmpOrderedIndices[pLogicalIndex];
          let tmpEditor = this._segmentEditors[tmpInternalIndex];
          if (tmpEditor) {
            tmpEditor.dispatch({
              changes: {
                from: 0,
                to: tmpEditor.state.doc.length,
                insert: pContent
              }
            });
          }
        }

        /**
         * Get the total number of segments.
         *
         * @returns {number}
         */
        getSegmentCount() {
          return this._getOrderedSegmentIndices().length;
        }

        /**
         * Get all content from all segments joined together.
         *
         * @param {string} [pSeparator] - The separator between segments (default: "\n\n")
         * @returns {string}
         */
        getAllContent(pSeparator) {
          let tmpSeparator = typeof pSeparator === 'string' ? pSeparator : '\n\n';
          let tmpOrderedIndices = this._getOrderedSegmentIndices();
          let tmpParts = [];
          for (let i = 0; i < tmpOrderedIndices.length; i++) {
            let tmpEditor = this._segmentEditors[tmpOrderedIndices[i]];
            if (tmpEditor) {
              tmpParts.push(tmpEditor.state.doc.toString());
            }
          }
          return tmpParts.join(tmpSeparator);
        }

        /**
         * Marshal all editor contents back into the data address.
         */
        _marshalAllEditorsToData() {
          let tmpSegments = this._getSegmentsFromData();
          if (!tmpSegments) {
            return;
          }
          let tmpOrderedIndices = this._getOrderedSegmentIndices();
          for (let i = 0; i < tmpOrderedIndices.length; i++) {
            let tmpEditor = this._segmentEditors[tmpOrderedIndices[i]];
            if (tmpEditor && i < tmpSegments.length) {
              tmpSegments[i].Content = tmpEditor.state.doc.toString();
            }
          }
        }

        /**
         * Set the read-only state of all editors.
         *
         * @param {boolean} pReadOnly - Whether editors should be read-only
         */
        setReadOnly(pReadOnly) {
          this.options.ReadOnly = pReadOnly;
          if (this.initialRenderComplete) {
            this._marshalAllEditorsToData();
            this._buildEditorUI();
          }
        }

        /**
         * Marshal content from the data address into the view.
         */
        marshalToView() {
          super.marshalToView();
          if (this.initialRenderComplete && this.options.ContentDataAddress) {
            this._buildEditorUI();
          }
        }

        /**
         * Marshal the current editor content back to the data address.
         */
        marshalFromView() {
          super.marshalFromView();
          this._marshalAllEditorsToData();
        }

        /**
         * Destroy all editors and clean up.
         */
        destroy() {
          for (let tmpIndex in this._segmentEditors) {
            if (this._segmentEditors[tmpIndex]) {
              this._segmentEditors[tmpIndex].destroy();
            }
          }
          this._segmentEditors = {};

          // Clear rich preview debounce timers
          for (let tmpIndex in this._richPreviewTimers) {
            clearTimeout(this._richPreviewTimers[tmpIndex]);
          }
          this._richPreviewTimers = {};
          this._richPreviewGenerations = {};
        }
      }
      module.exports = PictSectionMarkdownEditor;
      module.exports.default_configuration = _DefaultConfiguration;
    }, {
      "./Pict-MDE-CodeMirror.js": 18,
      "./Pict-MDE-DragAndReorder.js": 19,
      "./Pict-MDE-Formatting.js": 20,
      "./Pict-MDE-ImageHandling.js": 21,
      "./Pict-MDE-RichPreview.js": 22,
      "./Pict-Section-MarkdownEditor-DefaultConfiguration.js": 23,
      "pict-section-content": 13,
      "pict-view": 17
    }]
  }, {}, [1])(1);
});
//# sourceMappingURL=markdown_editor_example.js.map
