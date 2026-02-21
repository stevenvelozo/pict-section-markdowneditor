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
              }]
            }
          }
        }
      };
    }, {
      "../../source/Pict-Section-MarkdownEditor.js": 11,
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
      arguments[4][2][0].apply(exports, arguments);
    }, {
      "dup": 2
    }],
    7: [function (require, module, exports) {
      arguments[4][3][0].apply(exports, arguments);
    }, {
      "../package.json": 6,
      "dup": 3
    }],
    8: [function (require, module, exports) {
      module.exports = {
        "name": "pict-view",
        "version": "1.0.66",
        "description": "Pict View Base Class",
        "main": "source/Pict-View.js",
        "scripts": {
          "test": "mocha -u tdd -R spec",
          "tests": "mocha -u tdd -R spec -g",
          "start": "node source/Pict-View.js",
          "coverage": "nyc --reporter=lcov --reporter=text-lcov npm test",
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
          "fable": "^3.1.57",
          "fable-serviceproviderbase": "^3.0.18"
        }
      };
    }, {}],
    9: [function (require, module, exports) {
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
      "../package.json": 8,
      "fable-serviceproviderbase": 7
    }],
    10: [function (require, module, exports) {
      module.exports = {
        "DefaultRenderable": "MarkdownEditor-Wrap",
        "DefaultDestinationAddress": "#MarkdownEditor-Container-Div",
        "Templates": [{
          "Hash": "MarkdownEditor-Container",
          "Template": /*html*/"<div class=\"pict-mde\" id=\"PictMDE-Container\"></div>"
        }, {
          "Hash": "MarkdownEditor-Segment",
          "Template": /*html*/"<div class=\"pict-mde-segment\" id=\"PictMDE-Segment-{~D:Record.SegmentIndex~}\" data-segment-index=\"{~D:Record.SegmentIndex~}\">\n\t<div class=\"pict-mde-left-controls\">\n\t\t<button type=\"button\" class=\"pict-mde-left-btn pict-mde-left-btn-remove\" onclick=\"{~D:Record.ViewIdentifier~}.removeSegment({~D:Record.SegmentIndex~})\" title=\"Remove Segment\">&times;</button>\n\t\t<div class=\"pict-mde-left-controls-bottom\">\n\t\t\t<button type=\"button\" class=\"pict-mde-left-btn pict-mde-left-btn-move\" onclick=\"{~D:Record.ViewIdentifier~}.moveSegmentUp({~D:Record.SegmentIndex~})\" title=\"Move Up\">&uarr;</button>\n\t\t\t<button type=\"button\" class=\"pict-mde-left-btn pict-mde-left-btn-linenums\" onclick=\"{~D:Record.ViewIdentifier~}.toggleLineNumbers()\" title=\"Toggle Line Numbers\">1</button>\n\t\t\t<button type=\"button\" class=\"pict-mde-left-btn pict-mde-left-btn-move\" onclick=\"{~D:Record.ViewIdentifier~}.moveSegmentDown({~D:Record.SegmentIndex~})\" title=\"Move Down\">&darr;</button>\n\t\t</div>\n\t</div>\n\t<div class=\"pict-mde-drag-handle\" draggable=\"true\" title=\"Drag to reorder\"></div>\n\t<div class=\"pict-mde-segment-body\">\n\t\t<div class=\"pict-mde-segment-editor\" id=\"PictMDE-SegmentEditor-{~D:Record.SegmentIndex~}\"></div>\n\t\t<div class=\"pict-mde-image-preview\" id=\"PictMDE-ImagePreview-{~D:Record.SegmentIndex~}\"></div>\n\t\t<div class=\"pict-mde-rich-preview\" id=\"PictMDE-RichPreview-{~D:Record.SegmentIndex~}\"></div>\n\t</div>\n\t<div class=\"pict-mde-sidebar\" id=\"PictMDE-Sidebar-{~D:Record.SegmentIndex~}\">\n\t\t<div class=\"pict-mde-sidebar-actions\">\n\t\t\t<button type=\"button\" class=\"pict-mde-sidebar-btn\" onclick=\"{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'bold')\" title=\"Bold (Ctrl+B)\"><b>B</b></button>\n\t\t\t<button type=\"button\" class=\"pict-mde-sidebar-btn\" onclick=\"{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'italic')\" title=\"Italic (Ctrl+I)\"><i>I</i></button>\n\t\t\t<button type=\"button\" class=\"pict-mde-sidebar-btn\" onclick=\"{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'code')\" title=\"Inline Code (Ctrl+E)\"><code>&lt;&gt;</code></button>\n\t\t\t<button type=\"button\" class=\"pict-mde-sidebar-btn\" onclick=\"{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'heading')\" title=\"Heading\">#</button>\n\t\t\t<button type=\"button\" class=\"pict-mde-sidebar-btn\" onclick=\"{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'link')\" title=\"Link\">[&thinsp;]</button>\n\t\t\t<button type=\"button\" class=\"pict-mde-sidebar-btn pict-mde-sidebar-btn-image\" onclick=\"{~D:Record.ViewIdentifier~}.openImagePicker({~D:Record.SegmentIndex~})\" title=\"Insert Image\">&#x25A3;</button>\n\t\t</div>\n\t\t<input type=\"file\" accept=\"image/*\" class=\"pict-mde-image-input\" id=\"PictMDE-ImageInput-{~D:Record.SegmentIndex~}\" style=\"display:none\" />\n\t</div>\n</div>"
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
        // Whether to show rich content previews (mermaid diagrams, KaTeX equations)
        // Requires the consumer to load the mermaid and/or katex libraries via CDN
        "EnableRichPreview": true,
        // CSS for the markdown editor
        "CSS": /*css*/"\n/* ---- Container ---- */\n.pict-mde\n{\n\tfont-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\n\tfont-size: 14px;\n}\n\n/* ---- Segment row: left-controls | drag-handle | editor body | sidebar ---- */\n.pict-mde-segment\n{\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: row;\n\talign-items: stretch;\n\tmargin-bottom: 6px;\n\tmin-height: 48px;\n\ttransition: background-color 0.15s ease;\n}\n\n/* ---- Left controls (\u2715 top, \u2191\u2193 bottom) ---- */\n.pict-mde-left-controls\n{\n\tflex: 0 0 22px;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 2px 0;\n}\n.pict-mde-left-btn-remove\n{\n\tposition: sticky;\n\ttop: 2px;\n\tz-index: 2;\n}\n.pict-mde-left-controls-bottom\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tposition: sticky;\n\tbottom: 2px;\n\tz-index: 2;\n}\n.pict-mde-left-btn\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 20px;\n\theight: 20px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tpadding: 0;\n\tcolor: #888;\n\tline-height: 1;\n\tfont-family: inherit;\n\topacity: 0;\n\ttransition: opacity 0.15s ease;\n}\n.pict-mde-segment:hover .pict-mde-left-btn,\n.pict-mde-segment.pict-mde-active .pict-mde-left-btn\n{\n\topacity: 1;\n}\n.pict-mde-left-btn:hover\n{\n\tcolor: #222;\n}\n.pict-mde-left-btn-remove:hover\n{\n\tcolor: #CC3333;\n}\n.pict-mde-left-btn-linenums\n{\n\tfont-size: 11px;\n\tfont-weight: 600;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;\n}\n/* Highlight when line numbers are active */\n.pict-mde.pict-mde-linenums-on .pict-mde-left-btn-linenums\n{\n\tcolor: #4A90D9;\n}\n\n/* ---- Drag handle (simple grey bar) ---- */\n.pict-mde-drag-handle\n{\n\tflex: 0 0 8px;\n\tcursor: grab;\n\tbackground: #EDEDED;\n\ttransition: background-color 0.15s ease;\n\tuser-select: none;\n}\n.pict-mde-drag-handle:active\n{\n\tcursor: grabbing;\n}\n.pict-mde-drag-handle:hover\n{\n\tbackground: #C8C8C8;\n}\n\n/* ---- Editor body (middle column) ---- */\n.pict-mde-segment-body\n{\n\tflex: 1 1 auto;\n\tmin-width: 0;\n\tbackground: #FFFFFF;\n\ttransition: background-color 0.15s ease;\n}\n.pict-mde-segment-editor\n{\n\tmin-height: 48px;\n}\n\n/* ---- Image preview area below the editor ---- */\n.pict-mde-image-preview\n{\n\tdisplay: none;\n}\n.pict-mde-image-preview.pict-mde-has-images\n{\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 8px;\n\tpadding: 8px 12px;\n\tborder-top: 1px solid #EDEDED;\n}\n.pict-mde-image-preview img\n{\n\tmax-width: 200px;\n\tmax-height: 150px;\n\tborder-radius: 3px;\n\tborder: 1px solid #E0E0E0;\n\tobject-fit: contain;\n\tbackground: #F8F8F8;\n}\n.pict-mde-image-preview-item\n{\n\tposition: relative;\n\tdisplay: inline-block;\n}\n.pict-mde-image-preview-label\n{\n\tdisplay: block;\n\tfont-size: 10px;\n\tcolor: #999;\n\tmargin-top: 2px;\n\tmax-width: 200px;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n/* ---- Rich content preview area (mermaid + KaTeX) ---- */\n.pict-mde-rich-preview\n{\n\tdisplay: none;\n}\n.pict-mde-rich-preview.pict-mde-has-rich-preview\n{\n\tdisplay: block;\n\tpadding: 12px;\n\tborder-top: 1px solid #EDEDED;\n\tbackground: #FCFCFC;\n}\n.pict-mde-rich-preview-section\n{\n\tmargin-bottom: 8px;\n}\n.pict-mde-rich-preview-section:last-child\n{\n\tmargin-bottom: 0;\n}\n.pict-mde-rich-preview-label\n{\n\tfont-size: 10px;\n\tcolor: #999;\n\ttext-transform: uppercase;\n\tletter-spacing: 0.05em;\n\tmargin-bottom: 4px;\n}\n.pict-mde-rich-preview-mermaid\n{\n\ttext-align: center;\n\tpadding: 8px;\n\tbackground: #FFFFFF;\n\tborder: 1px solid #EDEDED;\n\tborder-radius: 4px;\n\toverflow-x: auto;\n}\n.pict-mde-rich-preview-mermaid pre.mermaid\n{\n\tbackground: #FFFFFF;\n\ttext-align: center;\n\tmargin: 0;\n}\n.pict-mde-rich-preview-katex-display\n{\n\ttext-align: center;\n\tpadding: 8px;\n\toverflow-x: auto;\n}\n.pict-mde-rich-preview-katex-inline\n{\n\tdisplay: inline;\n\tpadding: 2px 4px;\n}\n.pict-mde-rich-preview-error\n{\n\tcolor: #CC3333;\n\tfont-size: 11px;\n\tfont-style: italic;\n\tpadding: 4px 0;\n}\n\n/* Focused / active editor gets subtle warm background */\n.pict-mde-segment.pict-mde-active .pict-mde-segment-body\n{\n\tbackground: #FAFAF5;\n}\n.pict-mde-segment.pict-mde-active .pict-mde-drag-handle\n{\n\tbackground: #9CB4C8;\n}\n\n/* ---- Right sidebar (formatting buttons) ---- */\n.pict-mde-sidebar\n{\n\tflex: 0 0 30px;\n\tdisplay: flex;\n\talign-items: flex-start;\n\tposition: relative;\n}\n\n.pict-mde-sidebar-actions\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tpadding: 4px 0;\n\twidth: 100%;\n\topacity: 0;\n\ttransition: opacity 0.15s ease, top 0.1s ease;\n\tposition: sticky;\n\ttop: 0;\n}\n/* Active segment always shows its sidebar */\n.pict-mde-segment.pict-mde-active .pict-mde-sidebar-actions\n{\n\topacity: 1;\n}\n/* When no segment is active, hovering shows both left + right controls */\n.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-sidebar-actions\n{\n\topacity: 1;\n}\n/* When JS sets a cursor-relative offset, switch from sticky to absolute positioning */\n.pict-mde-sidebar-actions.pict-mde-sidebar-at-cursor\n{\n\tposition: absolute;\n\ttop: var(--pict-mde-sidebar-top, 0px);\n}\n\n.pict-mde-sidebar-btn\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 24px;\n\theight: 22px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tpadding: 0;\n\tborder-radius: 3px;\n\tcolor: #666;\n\tline-height: 1;\n\tfont-family: inherit;\n}\n.pict-mde-sidebar-btn:hover\n{\n\tcolor: #222;\n}\n.pict-mde-sidebar-btn b\n{\n\tfont-size: 13px;\n\tfont-weight: 700;\n}\n.pict-mde-sidebar-btn i\n{\n\tfont-size: 13px;\n\tfont-style: italic;\n}\n.pict-mde-sidebar-btn code\n{\n\tfont-size: 10px;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;\n}\n\n/* ---- Add segment button ---- */\n.pict-mde-add-segment\n{\n\tmargin-top: 6px;\n\tpadding-left: 30px;\n}\n.pict-mde-btn-add\n{\n\tdisplay: block;\n\twidth: 100%;\n\tpadding: 7px;\n\tborder: 2px dashed #D0D0D0;\n\tborder-radius: 4px;\n\tbackground: transparent;\n\tcolor: #999;\n\tfont-size: 12px;\n\tfont-weight: 600;\n\tcursor: pointer;\n\ttransition: all 0.15s ease;\n}\n.pict-mde-btn-add:hover\n{\n\tborder-color: #4A90D9;\n\tcolor: #4A90D9;\n\tbackground: rgba(74, 144, 217, 0.04);\n}\n\n/* ---- Image drag-over indicator ---- */\n.pict-mde-segment-editor.pict-mde-image-dragover\n{\n\toutline: 2px dashed #4A90D9;\n\toutline-offset: -2px;\n}\n\n/* ---- Drag-in-progress: prevent CodeMirror from intercepting drop events ---- */\n.pict-mde.pict-mde-dragging .pict-mde-segment-editor\n{\n\tpointer-events: none;\n}\n\n/* ---- Drop target indicators for drag reorder ---- */\n.pict-mde-segment.pict-mde-drag-over-top\n{\n\tbox-shadow: 0 -2px 0 0 #4A90D9;\n}\n.pict-mde-segment.pict-mde-drag-over-bottom\n{\n\tbox-shadow: 0 2px 0 0 #4A90D9;\n}\n\n/* ---- CodeMirror overrides inside segments ---- */\n.pict-mde-segment-editor .cm-editor\n{\n\tborder: none;\n}\n.pict-mde-segment-editor .cm-editor .cm-scroller\n{\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;\n\tfont-size: 14px;\n\tline-height: 1.6;\n}\n.pict-mde-segment-editor .cm-editor.cm-focused\n{\n\toutline: none;\n}\n.pict-mde-segment-editor .cm-editor .cm-content\n{\n\tpadding: 8px 12px;\n\tmin-height: 36px;\n}\n.pict-mde-segment-editor .cm-editor .cm-gutters\n{\n\tbackground: #F8F8F8;\n\tborder-right: 1px solid #E8E8E8;\n\tcolor: #BBB;\n}\n\n/* ---- Collapsed data URI widget ---- */\n.pict-mde-data-uri-collapsed\n{\n\tdisplay: inline;\n\tbackground: #F0F0F0;\n\tcolor: #888;\n\tfont-size: 11px;\n\tpadding: 1px 4px;\n\tborder-radius: 3px;\n\tborder: 1px solid #E0E0E0;\n\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;\n\tcursor: default;\n\twhite-space: nowrap;\n}\n\n/* ---- Line number toggle: hidden by default, shown when class present ---- */\n.pict-mde .cm-editor .cm-gutters\n{\n\tdisplay: none;\n}\n.pict-mde.pict-mde-linenums-on .cm-editor .cm-gutters\n{\n\tdisplay: flex;\n}\n"
      };
    }, {}],
    11: [function (require, module, exports) {
      const libPictViewClass = require('pict-view');
      const _DefaultConfiguration = require('./Pict-Section-MarkdownEditor-DefaultConfiguration.js');

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

          // Whether line numbers are currently shown
          this._lineNumbersVisible = false;

          // Debounce timers for image preview updates (keyed by segment index)
          this._imagePreviewTimers = {};

          // Debounce timers for rich content preview updates (keyed by segment index)
          this._richPreviewTimers = {};

          // Generation counters for mermaid async rendering (keyed by segment index)
          this._richPreviewGenerations = {};
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
         * Wire drag-and-drop events on a segment element for reorder via the drag handle.
         *
         * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
         * @param {number} pSegmentIndex - The internal segment index
         */
        _wireSegmentDragEvents(pSegmentElement, pSegmentIndex) {
          let tmpHandle = pSegmentElement.querySelector('.pict-mde-drag-handle');
          if (!tmpHandle) {
            return;
          }
          let tmpSelf = this;

          // The drag handle is the draggable element
          tmpHandle.addEventListener('dragstart', pEvent => {
            tmpSelf._dragSourceIndex = pSegmentIndex;
            pEvent.dataTransfer.effectAllowed = 'move';
            pEvent.dataTransfer.setData('text/plain', String(pSegmentIndex));
            // Add a dragging class to the container so CSS can disable pointer-events
            // on CodeMirror editors (preventing them from intercepting the drop event)
            let tmpContainerEl = tmpSelf._getContainerElement();
            if (tmpContainerEl) {
              tmpContainerEl.classList.add('pict-mde-dragging');
            }
            setTimeout(() => {
              pSegmentElement.style.opacity = '0.4';
            }, 0);
          });
          tmpHandle.addEventListener('dragend', () => {
            pSegmentElement.style.opacity = '';
            tmpSelf._dragSourceIndex = -1;
            tmpSelf._clearAllDropIndicators();
            // Remove the dragging class from the container
            let tmpContainerEl = tmpSelf._getContainerElement();
            if (tmpContainerEl) {
              tmpContainerEl.classList.remove('pict-mde-dragging');
            }
          });

          // Drop target: the whole segment row. We determine above/below from mouse Y.
          pSegmentElement.addEventListener('dragover', pEvent => {
            pEvent.preventDefault();
            pEvent.dataTransfer.dropEffect = 'move';

            // Clear all indicators first, then set the correct one
            tmpSelf._clearAllDropIndicators();

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
            tmpSelf._clearAllDropIndicators();
            let tmpSourceIndex = tmpSelf._dragSourceIndex;
            if (tmpSourceIndex < 0 || tmpSourceIndex === pSegmentIndex) {
              return;
            }
            tmpSelf._reorderSegment(tmpSourceIndex, pSegmentIndex, tmpDropBelow);
          });
        }

        /**
         * Clear all drop indicator classes from all segments.
         */
        _clearAllDropIndicators() {
          let tmpContainer = this._getContainerElement();
          if (!tmpContainer) {
            return;
          }
          let tmpAllSegments = tmpContainer.querySelectorAll('.pict-mde-segment');
          for (let i = 0; i < tmpAllSegments.length; i++) {
            tmpAllSegments[i].classList.remove('pict-mde-drag-over-top');
            tmpAllSegments[i].classList.remove('pict-mde-drag-over-bottom');
          }
        }

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
        _wireImageDragEvents(pEditorContainer, pSegmentIndex) {
          let tmpSelf = this;
          pEditorContainer.addEventListener('dragover', pEvent => {
            // Only handle file drags, not segment-reorder drags
            if (tmpSelf._dragSourceIndex >= 0) {
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
            if (tmpSelf._dragSourceIndex >= 0) {
              return;
            }
            if (!pEvent.dataTransfer || !pEvent.dataTransfer.files || pEvent.dataTransfer.files.length < 1) {
              return;
            }
            let tmpFile = pEvent.dataTransfer.files[0];
            if (tmpFile.type && tmpFile.type.startsWith('image/')) {
              pEvent.preventDefault();
              pEvent.stopPropagation();
              tmpSelf._processImageFile(tmpFile, pSegmentIndex);
            }
          });
        }

        /**
         * Reorder a segment from one position to another via drag.
         *
         * @param {number} pFromInternalIndex - The internal index of the dragged segment
         * @param {number} pToInternalIndex - The internal index of the drop target
         * @param {boolean} pDropBelow - Whether the drop was on the bottom half of the target
         */
        _reorderSegment(pFromInternalIndex, pToInternalIndex, pDropBelow) {
          let tmpFromLogical = this._getLogicalIndex(pFromInternalIndex);
          let tmpToLogical = this._getLogicalIndex(pToInternalIndex);
          if (tmpFromLogical < 0 || tmpToLogical < 0) {
            this.log.warn("PICT-MarkdownEditor _reorderSegment: could not resolve logical indices (from=".concat(tmpFromLogical, ", to=").concat(tmpToLogical, ")."));
            return;
          }
          if (tmpFromLogical === tmpToLogical) {
            return;
          }

          // Marshal all editor content back to data before manipulating the array
          this._marshalAllEditorsToData();
          let tmpSegments = this._getSegmentsFromData();
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
          this._setSegmentsToData(tmpSegments);
          this._buildEditorUI();
        }

        /**
         * Create a CodeMirror editor instance inside a container element.
         *
         * @param {HTMLElement} pContainer - The DOM element to mount the editor in
         * @param {number} pSegmentIndex - The segment index
         * @param {string} pContent - The initial content
         */
        _createEditorInContainer(pContainer, pSegmentIndex, pContent) {
          let tmpCM = this._codeMirrorModules;
          let tmpSelf = this;

          // Build the extensions array
          let tmpExtensions = [];

          // Add consumer-provided extensions (e.g. basicSetup, markdown())
          if (tmpCM.extensions && Array.isArray(tmpCM.extensions)) {
            tmpExtensions = tmpExtensions.concat(tmpCM.extensions);
          }

          // Update listener for content changes, focus, and cursor tracking
          tmpExtensions.push(tmpCM.EditorView.updateListener.of(pUpdate => {
            if (pUpdate.docChanged) {
              tmpSelf._onSegmentContentChange(pSegmentIndex, pUpdate.state.doc.toString());
            }

            // Track focus changes to toggle the active class
            if (pUpdate.focusChanged) {
              if (pUpdate.view.hasFocus) {
                tmpSelf._setActiveSegment(pSegmentIndex);
                // Position sidebar at cursor on focus
                tmpSelf._updateSidebarPosition(pSegmentIndex);
              } else {
                // Small delay so clicking a sidebar button doesn't immediately deactivate
                setTimeout(() => {
                  if (tmpSelf._activeSegmentIndex === pSegmentIndex) {
                    // Check if focus moved to another segment or truly left
                    let tmpSegEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
                    if (tmpSegEl && !tmpSegEl.contains(document.activeElement)) {
                      tmpSelf._clearActiveSegment(pSegmentIndex);
                      tmpSelf._resetSidebarPosition(pSegmentIndex);
                    }
                  }
                }, 100);
              }
            }

            // Track cursor/selection changes to move the sidebar
            if (pUpdate.selectionSet && pUpdate.view.hasFocus) {
              tmpSelf._updateSidebarPosition(pSegmentIndex);
            }
          }));

          // Keyboard shortcuts for formatting and image paste handling
          tmpExtensions.push(tmpCM.EditorView.domEventHandlers({
            keydown: (pEvent, pView) => {
              // Ctrl/Cmd + B = bold
              if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'b') {
                pEvent.preventDefault();
                tmpSelf.applyFormatting(pSegmentIndex, 'bold');
                return true;
              }
              // Ctrl/Cmd + I = italic
              if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'i') {
                pEvent.preventDefault();
                tmpSelf.applyFormatting(pSegmentIndex, 'italic');
                return true;
              }
              // Ctrl/Cmd + E = inline code
              if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'e') {
                pEvent.preventDefault();
                tmpSelf.applyFormatting(pSegmentIndex, 'code');
                return true;
              }
            },
            paste: (pEvent, pView) => {
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
                    tmpSelf._processImageFile(tmpFile, pSegmentIndex);
                  }
                  return true;
                }
              }
              return false;
            }
          }));

          // Collapse long data URIs in image markdown so the editor is readable
          let tmpCollapseExtension = this._buildDataURICollapseExtension();
          if (tmpCollapseExtension) {
            tmpExtensions.push(tmpCollapseExtension);
          }

          // Make read-only if configured
          if (this.options.ReadOnly) {
            tmpExtensions.push(tmpCM.EditorState.readOnly.of(true));
            tmpExtensions.push(tmpCM.EditorView.editable.of(false));
          }

          // Allow consumer to customize extensions
          tmpExtensions = this.customConfigureExtensions(tmpExtensions, pSegmentIndex);
          let tmpState = tmpCM.EditorState.create({
            doc: pContent || '',
            extensions: tmpExtensions
          });
          let tmpEditorView = new tmpCM.EditorView({
            state: tmpState,
            parent: pContainer
          });
          this._segmentEditors[pSegmentIndex] = tmpEditorView;
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
         * Build a CodeMirror extension that visually collapses long data URIs
         * inside markdown image syntax.
         *
         * The extension uses Decoration.replace() to hide the long base64 portion
         * and show a compact widget instead, e.g. "data:image/jpeg;base64…28KB".
         * The actual document content is unchanged — only the visual display
         * is affected.
         *
         * Returns null if the required CodeMirror modules (Decoration, ViewPlugin,
         * WidgetType) are not available.
         *
         * @returns {object|null} A CodeMirror ViewPlugin extension, or null
         */
        _buildDataURICollapseExtension() {
          let tmpCM = this._codeMirrorModules;

          // All three classes are required — degrade gracefully if not available
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
          function buildDecorations(pView) {
            let tmpDecorations = [];
            let tmpDoc = pView.state.doc;
            for (let tmpVisRange of pView.visibleRanges) {
              let tmpFrom = tmpVisRange.from;
              let tmpTo = tmpVisRange.to;
              let tmpText = tmpDoc.sliceString(tmpFrom, tmpTo);

              // Match: ![...](data:image/...;base64,...) — we need positions of the base64 payload
              let tmpRegex = /!\[[^\]]*\]\(data:([^;]+);base64,/g;
              let tmpMatch;
              while ((tmpMatch = tmpRegex.exec(tmpText)) !== null) {
                // tmpMatch[0] is "![alt](data:image/png;base64,"
                // tmpMatch[1] is the MIME subtype, e.g. "image/png"
                let tmpPayloadStart = tmpFrom + tmpMatch.index + tmpMatch[0].length;

                // Find the closing parenthesis — scan forward from payloadStart
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
                  // No closing paren found — skip this match
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
            constructor(pView) {
              this.decorations = buildDecorations(pView);
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

        // -- Active Segment Management --

        /**
         * Set a segment as the active (focused) segment.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        _setActiveSegment(pSegmentIndex) {
          // Clear previous active
          if (this._activeSegmentIndex >= 0 && this._activeSegmentIndex !== pSegmentIndex) {
            let tmpPrevEl = document.getElementById("PictMDE-Segment-".concat(this._activeSegmentIndex));
            if (tmpPrevEl) {
              tmpPrevEl.classList.remove('pict-mde-active');
            }
          }
          this._activeSegmentIndex = pSegmentIndex;
          let tmpSegEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (tmpSegEl) {
            tmpSegEl.classList.add('pict-mde-active');
          }
        }

        /**
         * Clear the active state from a segment (on blur).
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        _clearActiveSegment(pSegmentIndex) {
          if (this._activeSegmentIndex === pSegmentIndex) {
            this._activeSegmentIndex = -1;
          }
          let tmpSegEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (tmpSegEl) {
            tmpSegEl.classList.remove('pict-mde-active');
          }

          // Reset sidebar back to sticky when segment is no longer active
          this._resetSidebarPosition(pSegmentIndex);
        }

        // -- Formatting --

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
        applyFormatting(pSegmentIndex, pFormatType) {
          let tmpEditor = this._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            this.log.warn("PICT-MarkdownEditor applyFormatting: no editor for segment ".concat(pSegmentIndex, "."));
            return;
          }
          let tmpFormat = _FormattingMap[pFormatType];
          if (!tmpFormat) {
            this.log.warn("PICT-MarkdownEditor applyFormatting: unknown format type \"".concat(pFormatType, "\"."));
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
        }

        // -- Image Handling --

        /**
         * Open a file picker to select an image for insertion into a segment.
         * Called by the sidebar image button onclick handler.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        openImagePicker(pSegmentIndex) {
          let tmpFileInput = document.getElementById("PictMDE-ImageInput-".concat(pSegmentIndex));
          if (!tmpFileInput) {
            this.log.warn("PICT-MarkdownEditor openImagePicker: file input not found for segment ".concat(pSegmentIndex, "."));
            return;
          }
          let tmpSelf = this;

          // Wire the change handler fresh each time (in case it was already used)
          tmpFileInput.onchange = () => {
            if (tmpFileInput.files && tmpFileInput.files.length > 0) {
              tmpSelf._processImageFile(tmpFileInput.files[0], pSegmentIndex);
            }
            // Reset the input so the same file can be re-selected
            tmpFileInput.value = '';
          };
          tmpFileInput.click();
        }

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
        _processImageFile(pFile, pSegmentIndex) {
          if (!pFile || !pFile.type || !pFile.type.startsWith('image/')) {
            this.log.warn("PICT-MarkdownEditor _processImageFile: not an image file (type: ".concat(pFile ? pFile.type : 'null', ")."));
            return;
          }
          let tmpSelf = this;
          let tmpAltText = pFile.name ? pFile.name.replace(/\.[^.]+$/, '') : 'image';

          // Check if the consumer wants to handle the upload
          let tmpCallback = (pError, pURL) => {
            if (pError) {
              tmpSelf.log.error("PICT-MarkdownEditor image upload error: ".concat(pError));
              return;
            }
            if (pURL) {
              tmpSelf._insertImageMarkdown(pSegmentIndex, pURL, tmpAltText);
            }
          };
          let tmpHandled = this.onImageUpload(pFile, pSegmentIndex, tmpCallback);
          if (tmpHandled) {
            // Consumer is handling the upload asynchronously
            return;
          }

          // Default: convert to base64 data URI
          if (typeof FileReader === 'undefined') {
            this.log.error("PICT-MarkdownEditor _processImageFile: FileReader not available in this environment.");
            return;
          }
          let tmpReader = new FileReader();
          tmpReader.onload = () => {
            tmpSelf._insertImageMarkdown(pSegmentIndex, tmpReader.result, tmpAltText);
          };
          tmpReader.onerror = () => {
            tmpSelf.log.error("PICT-MarkdownEditor _processImageFile: FileReader error.");
          };
          tmpReader.readAsDataURL(pFile);
        }

        /**
         * Insert markdown image syntax at the cursor position in a segment editor.
         *
         * @param {number} pSegmentIndex - The internal segment index
         * @param {string} pURL - The image URL (data URI or remote URL)
         * @param {string} [pAltText] - The alt text (default: 'image')
         */
        _insertImageMarkdown(pSegmentIndex, pURL, pAltText) {
          let tmpEditor = this._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            this.log.warn("PICT-MarkdownEditor _insertImageMarkdown: no editor for segment ".concat(pSegmentIndex, "."));
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
          this._updateImagePreviews(pSegmentIndex);
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

        /**
         * Scan the content of a segment for markdown image references and render
         * preview thumbnails in the preview area below the editor.
         *
         * Matches the pattern ![alt](url) and creates <img> elements for each.
         * The preview area is hidden when there are no images.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        _updateImagePreviews(pSegmentIndex) {
          let tmpPreviewEl = document.getElementById("PictMDE-ImagePreview-".concat(pSegmentIndex));
          if (!tmpPreviewEl) {
            return;
          }
          let tmpEditor = this._segmentEditors[pSegmentIndex];
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
        }

        // -- Rich Content Preview (Mermaid / KaTeX) --

        /**
         * Extract mermaid code block contents from raw markdown text.
         * Matches ```mermaid ... ``` patterns.
         *
         * @param {string} pContent - The raw markdown text
         * @returns {Array<string>} Array of mermaid diagram source strings
         */
        _extractMermaidBlocks(pContent) {
          let tmpBlocks = [];
          let tmpRegex = /```mermaid\s*\n([\s\S]*?)```/g;
          let tmpMatch;
          while ((tmpMatch = tmpRegex.exec(pContent)) !== null) {
            let tmpBlock = tmpMatch[1].trim();
            if (tmpBlock.length > 0) {
              tmpBlocks.push(tmpBlock);
            }
          }
          return tmpBlocks;
        }

        /**
         * Extract KaTeX display math blocks from raw markdown text.
         * Matches $$ ... $$ patterns (on separate lines).
         *
         * @param {string} pContent - The raw markdown text
         * @returns {Array<string>} Array of LaTeX display math strings
         */
        _extractKaTeXDisplayBlocks(pContent) {
          let tmpBlocks = [];
          let tmpRegex = /\$\$\s*\n([\s\S]*?)\n\s*\$\$/g;
          let tmpMatch;
          while ((tmpMatch = tmpRegex.exec(pContent)) !== null) {
            let tmpBlock = tmpMatch[1].trim();
            if (tmpBlock.length > 0) {
              tmpBlocks.push(tmpBlock);
            }
          }
          return tmpBlocks;
        }

        /**
         * Extract KaTeX inline math expressions from raw markdown text.
         * Matches $...$ patterns (content must not start or end with whitespace).
         * Strips code blocks and display math before scanning to avoid false matches.
         *
         * @param {string} pContent - The raw markdown text
         * @returns {Array<string>} Array of LaTeX inline math strings
         */
        _extractKaTeXInlineExpressions(pContent) {
          let tmpExpressions = [];

          // Strip code blocks and display math to avoid false matches
          let tmpStripped = pContent.replace(/```[\s\S]*?```/g, '');
          tmpStripped = tmpStripped.replace(/\$\$[\s\S]*?\$\$/g, '');

          // Multi-character inline math: $E=mc^2$
          let tmpRegex = /\$([^\$\s][^\$]*?[^\$\s])\$/g;
          let tmpMatch;
          while ((tmpMatch = tmpRegex.exec(tmpStripped)) !== null) {
            tmpExpressions.push(tmpMatch[1]);
          }

          // Single-character inline math: $x$
          let tmpSingleRegex = /\$([^\$\s])\$/g;
          while ((tmpMatch = tmpSingleRegex.exec(tmpStripped)) !== null) {
            tmpExpressions.push(tmpMatch[1]);
          }
          return tmpExpressions;
        }

        /**
         * Scan the content of a segment for mermaid code blocks and KaTeX math
         * expressions, then render previews in the rich preview area below the
         * image preview.
         *
         * Mermaid blocks: ```mermaid ... ```
         * Display math: $$ ... $$
         * Inline math: $...$
         *
         * Libraries must be available on window (mermaid, katex).
         * If neither is available, this method does nothing.
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        _updateRichPreviews(pSegmentIndex) {
          if (!this.options.EnableRichPreview) {
            return;
          }
          let tmpPreviewEl = document.getElementById("PictMDE-RichPreview-".concat(pSegmentIndex));
          if (!tmpPreviewEl) {
            return;
          }
          let tmpEditor = this._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
            return;
          }
          let tmpContent = tmpEditor.state.doc.toString();
          let tmpHasMermaid = typeof mermaid !== 'undefined';
          let tmpHasKaTeX = typeof katex !== 'undefined';
          if (!tmpHasMermaid && !tmpHasKaTeX) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
            return;
          }

          // Detect content
          let tmpMermaidBlocks = tmpHasMermaid ? this._extractMermaidBlocks(tmpContent) : [];
          let tmpKaTeXDisplayBlocks = tmpHasKaTeX ? this._extractKaTeXDisplayBlocks(tmpContent) : [];
          let tmpKaTeXInlineBlocks = tmpHasKaTeX ? this._extractKaTeXInlineExpressions(tmpContent) : [];
          if (tmpMermaidBlocks.length === 0 && tmpKaTeXDisplayBlocks.length === 0 && tmpKaTeXInlineBlocks.length === 0) {
            tmpPreviewEl.innerHTML = '';
            tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
            return;
          }

          // Build preview HTML
          let tmpHTML = '';

          // Mermaid sections
          for (let i = 0; i < tmpMermaidBlocks.length; i++) {
            let tmpMermaidID = "PictMDE-Mermaid-".concat(pSegmentIndex, "-").concat(i);
            let tmpEscaped = tmpMermaidBlocks[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tmpHTML += "<div class=\"pict-mde-rich-preview-section\"><div class=\"pict-mde-rich-preview-label\">Mermaid Diagram</div><div class=\"pict-mde-rich-preview-mermaid\"><pre class=\"mermaid\" id=\"".concat(tmpMermaidID, "\">").concat(tmpEscaped, "</pre></div></div>");
          }

          // KaTeX display blocks
          for (let i = 0; i < tmpKaTeXDisplayBlocks.length; i++) {
            let tmpKaTeXID = "PictMDE-KaTeX-Display-".concat(pSegmentIndex, "-").concat(i);
            tmpHTML += "<div class=\"pict-mde-rich-preview-section\"><div class=\"pict-mde-rich-preview-label\">Math (Display)</div><div class=\"pict-mde-rich-preview-katex-display\" id=\"".concat(tmpKaTeXID, "\"></div></div>");
          }

          // KaTeX inline expressions (grouped into one section)
          if (tmpKaTeXInlineBlocks.length > 0) {
            tmpHTML += "<div class=\"pict-mde-rich-preview-section\"><div class=\"pict-mde-rich-preview-label\">Math (Inline)</div><div>";
            for (let i = 0; i < tmpKaTeXInlineBlocks.length; i++) {
              let tmpKaTeXID = "PictMDE-KaTeX-Inline-".concat(pSegmentIndex, "-").concat(i);
              tmpHTML += "<span class=\"pict-mde-rich-preview-katex-inline\" id=\"".concat(tmpKaTeXID, "\"></span> ");
            }
            tmpHTML += "</div></div>";
          }
          tmpPreviewEl.innerHTML = tmpHTML;
          tmpPreviewEl.classList.add('pict-mde-has-rich-preview');

          // Bump generation counter for stale-render protection
          let tmpGeneration = (this._richPreviewGenerations[pSegmentIndex] || 0) + 1;
          this._richPreviewGenerations[pSegmentIndex] = tmpGeneration;
          let tmpSelf = this;

          // Post-render: call mermaid.run() for mermaid diagrams
          if (tmpMermaidBlocks.length > 0 && tmpHasMermaid) {
            let tmpMermaidNodes = tmpPreviewEl.querySelectorAll('pre.mermaid');
            if (tmpMermaidNodes.length > 0) {
              try {
                let tmpPromise = mermaid.run({
                  nodes: tmpMermaidNodes
                });
                if (tmpPromise && typeof tmpPromise.catch === 'function') {
                  tmpPromise.catch(pError => {
                    if (tmpSelf._richPreviewGenerations[pSegmentIndex] !== tmpGeneration) {
                      return; // stale render
                    }
                    tmpSelf.log.warn("PICT-MarkdownEditor mermaid render error: ".concat(pError.message || pError));
                  });
                }
              } catch (pError) {
                this.log.warn("PICT-MarkdownEditor mermaid render error: ".concat(pError.message || pError));
              }
            }
          }

          // Post-render: call katex.render() for display math
          for (let i = 0; i < tmpKaTeXDisplayBlocks.length; i++) {
            let tmpEl = document.getElementById("PictMDE-KaTeX-Display-".concat(pSegmentIndex, "-").concat(i));
            if (tmpEl) {
              try {
                katex.render(tmpKaTeXDisplayBlocks[i], tmpEl, {
                  throwOnError: false,
                  displayMode: true
                });
              } catch (pError) {
                tmpEl.innerHTML = "<span class=\"pict-mde-rich-preview-error\">KaTeX error: ".concat(this._escapeHTMLForPreview(pError.message || String(pError)), "</span>");
              }
            }
          }

          // Post-render: call katex.render() for inline math
          for (let i = 0; i < tmpKaTeXInlineBlocks.length; i++) {
            let tmpEl = document.getElementById("PictMDE-KaTeX-Inline-".concat(pSegmentIndex, "-").concat(i));
            if (tmpEl) {
              try {
                katex.render(tmpKaTeXInlineBlocks[i], tmpEl, {
                  throwOnError: false,
                  displayMode: false
                });
              } catch (pError) {
                tmpEl.innerHTML = "<span class=\"pict-mde-rich-preview-error\">KaTeX error</span>";
              }
            }
          }
        }

        /**
         * Simple HTML escape for error messages in the rich preview.
         *
         * @param {string} pText - The text to escape
         * @returns {string}
         */
        _escapeHTMLForPreview(pText) {
          return pText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

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
        _updateSidebarPosition(pSegmentIndex) {
          let tmpSegmentEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (!tmpSegmentEl) {
            return;
          }
          let tmpSidebarActions = tmpSegmentEl.querySelector('.pict-mde-sidebar-actions');
          if (!tmpSidebarActions) {
            return;
          }
          let tmpEditor = this._segmentEditors[pSegmentIndex];
          if (!tmpEditor) {
            return;
          }

          // Get the cursor position in the editor
          let tmpCursorPos = tmpEditor.state.selection.main.head;
          let tmpCursorCoords = tmpEditor.coordsAtPos(tmpCursorPos);
          if (!tmpCursorCoords) {
            // If we can't get coords, revert to sticky
            this._resetSidebarPosition(pSegmentIndex);
            return;
          }

          // Calculate the offset relative to the segment element
          let tmpSegmentRect = tmpSegmentEl.getBoundingClientRect();
          let tmpOffsetTop = tmpCursorCoords.top - tmpSegmentRect.top;

          // Clamp so the sidebar buttons don't go above the segment or below it
          let tmpSidebarHeight = tmpSidebarActions.offsetHeight || 0;
          let tmpSegmentHeight = tmpSegmentEl.offsetHeight || 0;
          let tmpMaxOffset = Math.max(0, tmpSegmentHeight - tmpSidebarHeight);
          tmpOffsetTop = Math.max(0, Math.min(tmpOffsetTop, tmpMaxOffset));

          // Apply the cursor-relative positioning
          tmpSidebarActions.classList.add('pict-mde-sidebar-at-cursor');
          tmpSidebarActions.style.setProperty('--pict-mde-sidebar-top', "".concat(tmpOffsetTop, "px"));
        }

        /**
         * Reset the sidebar back to default sticky positioning (no cursor tracking).
         *
         * @param {number} pSegmentIndex - The internal segment index
         */
        _resetSidebarPosition(pSegmentIndex) {
          let tmpSegmentEl = document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));
          if (!tmpSegmentEl) {
            return;
          }
          let tmpSidebarActions = tmpSegmentEl.querySelector('.pict-mde-sidebar-actions');
          if (!tmpSidebarActions) {
            return;
          }
          tmpSidebarActions.classList.remove('pict-mde-sidebar-at-cursor');
          tmpSidebarActions.style.removeProperty('--pict-mde-sidebar-top');
        }

        // -- Line Numbers --

        /**
         * Toggle line numbers on or off for all segments.
         *
         * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
         */
        toggleLineNumbers(pVisible) {
          if (typeof pVisible === 'boolean') {
            this._lineNumbersVisible = pVisible;
          } else {
            this._lineNumbersVisible = !this._lineNumbersVisible;
          }
          let tmpContainer = this._getContainerElement();
          if (tmpContainer) {
            if (this._lineNumbersVisible) {
              tmpContainer.classList.add('pict-mde-linenums-on');
            } else {
              tmpContainer.classList.remove('pict-mde-linenums-on');
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
      "./Pict-Section-MarkdownEditor-DefaultConfiguration.js": 10,
      "pict-view": 9
    }]
  }, {}, [1])(1);
});
//# sourceMappingURL=markdown_editor_example.js.map
