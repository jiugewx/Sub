/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "a130a6255d55c766ae59"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

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
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Wangxin on 2016/5/18.
	 */

	'use strict';/*使用严格模式*/
	/*加载样式*/
	//require("./css/style.css");

	///*加载库*/
	//require('./js/lib/zepto.mim.js');
	//require('./js/lib/fastclick.js');
	//require("./js/lib/hammer.js");
	//
	///*加载js*/
	//require("./js/actions/amapCache");
	//require("./js/actions/common");
	//require("./js/actions/Data");
	//require("./js/actions/drwLines");
	//require("./js/actions/drwMain");
	//require("./js/actions/drwSelect");
	//require("./js/actions/drwtrafficlines");
	//require("./js/actions/tip");

	var SW=__webpack_require__(2);
	/*登陆客户端设备判断*/
	var userAgent = navigator.userAgent;
	var os = userAgent.match(/iphone|ipad|ipod/i) ? 'ios' : 'android';
	var osbody = document.getElementById('os');
	if (os === 'ios') {
	    osbody.className = 'ios'
	} else {
	    osbody.className = 'android'
	}
	SW.swInit();



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Wangxin on 2016/5/19.
	 */

	__webpack_require__(3);
	var $=__webpack_require__(4);
	var AllData=__webpack_require__(5);
	var drwSw=__webpack_require__(6);
	var tip=__webpack_require__(9);
	var DrwTraf=__webpack_require__(8);
	var bindEvent=__webpack_require__(11);
	var FastClick = __webpack_require__(13);

	/**fastclick.js在commonJs规范中的引用方式
	 * var FastClick = require('fastclick');
	 * FastClick.attach(document.body);
	 * */

	//定义SW，数据预处理
	var SW = {
	    //数据初始化!
	    swInit: function() {
	        var self = this;
	        FastClick.attach(document.body);
	        //调用缓存工具中的初始化方法
	        amapCache.init({
	            complete: function() {
	                self.initCity(); //根据缓存加载相应城市
	                bindEvent.init(); //初始化事件绑定信息
	                tip.loadingOver();//加载完成
	            }
	        });
	    },
	    //初始化城市信息
	    initCity: function() {
	        var self = this;
	        //如果有adcode那就展示城市
	        self.showCity();
	        // 通过监听hashchange事件来更改站点
	        $(window).on('hashchange', function () {
	            var hash = decodeURIComponent(window.location.hash).replace(/^\#/, '');
	            //decodeURIComponent 对 encodeURIComponent() 函数编码的 URI 进行解码。replace(/^\#/, '')，把#号给去除了
	            var param = bindEvent.param2json(hash);
	            if (param != null) {
	                self.showStation(param);
	            }
	        });
	    },
	    //显示城市：获取hash值，依据hash值匹配对应城市信息，
	    showCity: function() {
	        var self = this;
	        //var cache = AllData.cache;

	        var param = {"city":"1100"};
	        //self.param2json(hash)就是将hash转为json对象，"city=1100"字符串转换为了object的格式，｛"city":"1100"｝
	        //if (!param || !param.src || param.src && param.src != 'alipay') {
	        //    $('#subway, #citypage').addClass('msubway');
	        //}
	        ////如果param不存在，那就打开城市选择列表。
	        //if (!param) {
	        //    AllData.subwayFlag = 0;
	        //    return tip.cityChange();
	        //}

	        AllData.param = param;

	        //取adcode为param中city的值。
	        var adcode = param.city;
	        //var adcode = "1100";

	        //如果城市代码存在，那就判断文件中是否存有对应的地铁图
	        //if (adcode != '') {

	        if (!AllData.fileNameData[adcode]) {
	            // 该城市没有对应地铁图,那就打开cityChange的列表
	            AllData.subwayFlag = 0;
	            return tip.cityChange();
	        } else {
	            // 该城市有对应地铁图,那就显示#subway
	            AllData.subwayFlag = 1;
	            $('#subway').show()
	        }
	        //}
	        ////如果城市代码不存在
	        //else {
	        //    AllData.subwayFlag = 0;
	        //    return tip.cityChange();
	        //}



	        $('.city_name').html(AllData.cityname[adcode]);
	        //改变网页的标题
	        document.title = AllData.cityname[adcode] + '地铁图';

	        // 此城市代码与当前城市的代码不一致，即发生了变化，tip.hideCitylist();
	        //if (adcode != cache.curCity.adcode) {
	        //    $("#subway-svg,#infowindow-content,#tip-content,.line-caption").remove();
	            AllData.svgReady = false;
	            //开启加载对应城市的数据
	            tip.loading();
	            $(".filter_btn").hide();
	            self.loadData(adcode, function (drwData) {
	                //这里的drwData是loadData方法中callback的参数。这个参数在loadData中被定义。
	                tip.loadingOver();
	                tip.transformStateReset();
	                //绘制对应城市的地铁
	                drwSw.draw(drwData, param);
	            });
	        //} else {
	        //    //显示车站
	        //    SW.showStation(param);
	        //    console.log(param);
	        //}
	    },
	    //显示城市的地铁站
	    showStation: function (param) {
	        var stationId = param.station;
	        if(stationId){
	            var station = AllData.cache.stations[stationId] || AllData.cache.stationspoi[stationId];
	            var sid = 'st-' + station.si;
	            var obj = $('#' + sid);
	            if (AllData.isNearTip) {
	                drwSw.clearNearTip();
	            }
	            tip.openTip(obj);
	            var center = tip.getStCenter(obj);
	            tip.setCenter(center);
	        }
	    },
	    //加载数据
	    loadData: function(adcode, callback) {
	        var self = this,
	            cache = AllData.cache;
	        var city_code = adcode;
	        // var city_name = cache.citylistByAdcode[adcode].spell;
	        var city_name = AllData.fileNameData[adcode];
	        //如果对应的城市信息已经存在,那就直接调用callback.
	        if (cache.cities[city_code]) {
	            cache.curCity.adcode = city_code;
	            cache.curCity.name = cache.cities[city_code].name;
	            cache.curCity.offset = cache.offset[city_code];
	            callback(cache.cities[city_code]);
	        }
	        //如果对应的城市信息不存在,那就发起请求
	        else {
	            //从服务器请求数据
	            self.loadMainData(city_code,city_name,callback);
	            //self.loadTempTraffic();
	            self.loadStInfo(city_code,city_name);
	            DrwTraf.loadTraffic(city_code,city_name);
	        }
	    },
	    //请求站点首末班车信息
	    loadStInfo: function (city_code,city_name){
	        var self=this;
	        var infoData_Url = "data/" + city_code + "_info_" + city_name + ".json";
	        amapCache.loadData(infoData_Url, function(info_data) {
	            //------------获取的数据转成压缩的json--------
	            //转json!
	            //console.log("正在转译成Json...");
	            //console.log(JSON.stringify(info_data));
	            //
	            for (var k = 0; k < info_data.l.length; k++) {
	                for (var l = 0; l < info_data.l[k].st.length; l++) {
	                    AllData.cache.stationsInfo[info_data.l[k].st[l].si] = info_data.l[k].st[l];
	                }
	            }
	            console.log("站点首末车时间请求完成!");
	        },function() {
	            alert('地铁站点数据加载失败！');
	        });
	    },
	    //这里是请求对应城市的地铁数据
	    loadMainData: function (city_code,city_name,callback) {
	        var self = this;
	        AllData.loadStatus.currLinesInfo=0;
	        var drwData_Url = "data/" + city_code + "_drw_" + city_name + ".json";
	        amapCache.loadData(drwData_Url, function(loaddata) {
	                //------------获取的数据转成压缩的json--------
	                ////转json!
	                //console.log("正在转译成Json...");
	                //console.log(JSON.stringify(loaddata));
	                //-------------JSON编译功能-------------
	                //console.log("原始数据请求成功!",data);
	                //给2秒钟的延迟去加载路况信息
	                //self.loadConvert(city_code,city_name);
	                //setTimeout(function () {
	                //	SW.Traffic2JSON(loaddata);/*drwData增加st2st信息的开关*/
	                //},2000);
	                //————————————JSON编译结束——————————
	                tip.loading();
	                self.buildCurLinesData(city_code,loaddata);
	                AllData.loadStatus.currLinesInfo=1;
	                callback(AllData.cache.cities[city_code]);
	            },
	            function() {
	                AllData.loadStatus.currLinesInfo=2;
	                alert('城市地铁数据加载失败！');
	                AllData.subwayFlag = 0;
	                //tip.cityChange();
	            });
	    },
	    //初步编译地铁的基础信息
	    buildCurLinesData: function (city_code,data) {
	        var self=this;
	        var cache = AllData.cache;
	        cache.sug[city_code] = {};
	        cache.dataForDrw[data.i] = data;
	        cache.cities[data.i] = cache.cities[data.i] || {};
	        cache.cities[data.i].name = data.s;
	        cache.cities[data.i].id = data.i;
	        cache.cities[data.i].offset = data.o;
	        cache.cities[data.i].lines = [];
	        cache.cities[data.i].linesNamePos = {};
	        // cache.cities[data.i].stations = [];
	        cache.cities[data.i].stations = {};
	        cache.cities[data.i].zolines = {};
	        cache.cities[data.i].zostations = [];
	        //data.o其实是人为的设定的一个地图中心，其他的数据就以这个做出偏移。
	        var _offset = data.o.split(',');
	        cache.offset[data.i] = cache.offset[data.i] || {};

	        cache.offset[data.i].x = _offset[0];
	        cache.offset[data.i].y = _offset[1];
	        //相对于（1000，1000）做偏移。
	        var _x = 1000 - Number(_offset[0]),
	        _y = 1000 - Number(_offset[1]);
	        var sugobj = {};
	        //遍历每条地铁线
	        for (var i = 0; i < data.l.length; i++) {
	            //修改了地铁path的偏移
	            if (data.l[i].su == '1') {
	                //使path数据按照x,y数据偏移
	                var _coords = data.l[i].c;
	                for (var q = 0; q < _coords.length; q++) {
	                    var _c = _coords[q].split(' ');
	                    _coords[q] = (Number(_c[0]) + _x) + ' ' + (Number(_c[1]) + _y);
	                }
	                data.l[i].c = _coords;
	                data.l[i].linesNamePos = {};
	                data.l[i].linesNamePos[data.l[i].ls] = data.l[i].lp;
	                data.l[i].stname = [];
	                //遍历每天地铁线里的地铁站
	                for (var j = 0; j < data.l[i].st.length; j++) {

	                    data.l[i].stname.push(data.l[i].st[j].n);

	                    //使站点中(data.l[i].st)的信息按照x,y数据偏移
	                    var _p = data.l[i].st[j].p.split(' ');
	                    data.l[i].st[j].p = (Number(_p[0]) + _x) + ' ' + (Number(_p[1]) + _y);
	                    var rsArr = data.l[i].st[j].rs.split('|');
	                    var newRsArr = [];
	                    for (var h = 0; h < rsArr.length; h++) {
	                        var rs = rsArr[h].split(' ');
	                        newRsArr.push((Number(rs[0]) + _x) + ' ' + (Number(rs[1]) + _y))
	                    }
	                    data.l[i].st[j].rs = newRsArr.join('|');

	                    //当该地铁站属于开通状态时,将该地铁站信息缓存进stations
	                    if (data.l[i].st[j].su == '1') {
	                        var cur = data.l[i].st[j];
	                        // cache.cities[data.i].stations.push(cur);
	                        cache.cities[data.i].stations[cur.si] = cur;
	                        cache.cities[data.i].stations[cur.si].cl = data.l[i].cl;
	                        cache.stations[cur.si] = cur;
	                        cache.stations[cur.si].cl = data.l[i].cl;
	                        sugobj[cur.sp.split(' ').join('').toLowerCase() + '|' + cur.n.toLowerCase()] = cur;
	                        cache.stationspoi[cur.poiid] = cur;
	                        cache.navStations[cur.n] = cur;
	                        cache.navStPixel[cur.p] = cur;
	                    }
	                }
	                //使lp也发生偏移
	                var _lpo = data.l[i].lp;
	                if (_lpo) {
	                    for (var s = 0; s < _lpo.length; s++) {
	                        var _lp = _lpo[s].split(' ');
	                        _lpo[s] = (Number(_lp[0]) + _x) + ' ' + (Number(_lp[1]) + _y);
	                    }
	                    data.l[i].lp = _lpo;
	                }
	                //使_st2st的path偏移;
	                var _st2st = data.l[i].st2st;
	                for (var k in _st2st) {
	                    //_st2st的path偏移;
	                    var _st2stpath = _st2st[k].path;
	                    for (var m in _st2stpath) {
	                        var _st2stpathPos = _st2stpath[m].split(' ');
	                        _st2stpath[m] = (Number(_st2stpathPos[0]) + _x) + ' ' + (Number(_st2stpathPos[1]) + _y)
	                    }
	                    //_st2st的startPos偏移;
	                    var _startPos = _st2st[k].sP.split(" ");
	                    _st2st[k].sP = (Number(_startPos[0]) + _x) + ' ' + (Number(_startPos[1]) + _y);
	                    //	_st2st的endPos偏移;
	                    var _endPos = _st2st[k].eP.split(" ");
	                    _st2st[k].eP = (Number(_endPos[0]) + _x) + ' ' + (Number(_endPos[1]) + _y);
	                    //	_st2st的dP偏移;
	                    _st2st[k].dP = _st2st[k].sP + "-to-" + _st2st[k].eP;
	                }

	                cache.cities[data.i].linesNamePos[data.l[i].ls] = data.l[i].lp;
	                // 增加lines信息
	                cache.cities[data.i].lines.push(data.l[i]);
	                cache.lines[data.l[i].ls] = data.l[i]; //写入line

	                var busid = data.l[i].li && data.l[i].li.split('|');
	                if (busid) {
	                    for (var n = 0; n < busid.length; n++) {
	                        cache.navlines[busid[n]] = data.l[i]

	                    }
	                }
	            }

	        }
	        // self.toCache(data, info_data);
	        cache.sug[city_code] = sugobj;
	        cache.curCity.adcode = city_code;
	        cache.curCity.name = cache.cities[city_code].name;
	        cache.curCity.offset = cache.offset[city_code];
	        var drwData = cache.cities[city_code];
	        console.log("纯地铁信息编译完成!");
	        tip.loadingOver();
	        //console.log(drwData);
	    },
	    /*给初始化的drwData增加st2st信息的开关,之后打印成JSON文本*/
	    Traffic2JSON: function (drwData) {
	        /*依赖self.cache.convertData,self.cache.trafficInfo,self.cache.stations;
	         要在buildCurLinesData()之前运行,所以要先加载loadTraffic(),再loadMainData(),阻塞buildCurLinesData*/
	        var self = this;
	        var current_City_lines=drwData.l /*|| drwData.lines*/;
	        //加入站点名称
	        for (var line_id in current_City_lines) {
	            //console.log(current_City_lines[line_id]);
	            for (var i in AllData.cache.convertData) {
	                if (AllData.cache.convertData[i].line_id == current_City_lines[line_id].ls) {
	                    /*已经选择了一条地铁*/
	                    var length=AllData.cache.convertData[i].stations.length;
	                    //遍历转换器中的stations
	                    for (var j = 0; j < length; j++) {
	                        var acc = AllData.cache.convertData[i].stations[j].Acc;
	                        /*已经选中了单个车站*/
	                        var name = AllData.cache.convertData[i].stations[j].Name;
	                        var current_drwData = current_City_lines[line_id];
	                        var st = current_drwData.st;
	                        var dataset_line_arr = current_drwData.c;
	                        //以下获取start信息
	                        for (var k in AllData.cache.trafficInfo) {
	                            /*去遍历所有的路段信息*/
	                            if (AllData.cache.trafficInfo[k].startAcc == acc) {
	                                /*查到当前站点为起点的路段*/
	                                AllData.cache.trafficInfo[k].startName = name;
	                                AllData.cache.trafficInfo[k].reflineId = current_drwData.ls;
	                                AllData.cache.trafficInfo[k].reflineName = current_drwData.ln;
	                                for (var x in st) {
	                                    //当drw信息中的station的名字与traffic信息中的名字匹配时
	                                    if (st[x].n == name) {
	                                        AllData.cache.trafficInfo[k].startPos = st[x].p;
	                                    }
	                                }
	                                if (!(AllData.cache.trafficInfo[k].hasOwnProperty("startPos"))) {
	                                    //self.cache.trafficInfo[k].startPos = self.cache.trafficInfo[k - 1].startPos;
	                                    console.log(AllData.cache.trafficInfo[k], k)
	                                }
	                                var startPos = AllData.cache.trafficInfo[k].startPos;
	                                for (var y in dataset_line_arr) {
	                                    if (dataset_line_arr[y] == startPos) {
	                                        AllData.cache.trafficInfo[k].startIndex = y;
	                                    }
	                                }
	                            }
	                        }
	                        //获取end信息
	                        for (var k in AllData.cache.trafficInfo) {
	                            if (AllData.cache.trafficInfo[k].endAcc == acc) {
	                                /*查到当前站点为起点的路段*/
	                                AllData.cache.trafficInfo[k].endName = name;
	                                for (var x in st) {
	                                    if (st[x].n == name) {
	                                        AllData.cache.trafficInfo[k].endPos = st[x].p;
	                                    }
	                                }
	                                var endPos = AllData.cache.trafficInfo[k].endPos;
	                                //
	                                if (!(AllData.cache.trafficInfo[k].hasOwnProperty("endPos"))) {
	                                    //self.cache.trafficInfo[k].endPos = self.cache.trafficInfo[k - 1].endPos;
	                                    console.log(AllData.cache.trafficInfo[k], k)
	                                }
	                                for (var y in dataset_line_arr) {
	                                    if (dataset_line_arr[y] == endPos) {
	                                        AllData.cache.trafficInfo[k].endIndex = y;
	                                    }
	                                }
	                            }
	                        }
	                        //修正环线的的首尾连接问题
	                        for (var k in AllData.cache.trafficInfo) {
	                            if (AllData.cache.trafficInfo[k].endIndex - AllData.cache.trafficInfo[k].startIndex> 30) {
	                                AllData.cache.trafficInfo[k].endIndex = 0;
	                            }else if(self.cache.trafficInfo[k].startIndex - AllData.cache.trafficInfo[k].endIndex> 30){
	                                AllData.cache.trafficInfo[k].startIndex = 0;
	                            }
	                            AllData.cache.trafficInfo[k].direction = AllData.cache.trafficInfo[k].startName+"-to-"+AllData.cache.trafficInfo[k].endName;
	                        }
	                        //增加path和color、direct
	                        for (var k in AllData.cache.trafficInfo) {
	                            var loadRate=AllData.cache.trafficInfo[k].loadRate;
	                            var color={};
	                            //增加path
	                            if (AllData.cache.trafficInfo[k].reflineId == current_drwData.ls) {
	                                var start = Number(AllData.cache.trafficInfo[k].startIndex);
	                                var end = Number(AllData.cache.trafficInfo[k].endIndex);
	                                if (start < end) {
	                                    AllData.cache.trafficInfo[k].path = dataset_line_arr.slice(start, end + 1);
	                                    AllData.cache.trafficInfo[k].ref_direct = "right";
	                                } else {
	                                    AllData.cache.trafficInfo[k].path = dataset_line_arr.slice(end, start + 1);
	                                    AllData.cache.trafficInfo[k].ref_direct = "left";
	                                }
	                            }
	                            //增加color
	                            if (loadRate >= 0 && loadRate <= 0.6) {
	                                color = "00cc33";
	                            } else if (loadRate > 0.6 && loadRate <= 0.9) {
	                                color = "EFEA3A";
	                            } else if (loadRate > 0.9 && loadRate <= 1.1) {
	                                color = "E71F1A";
	                            } else if (loadRate > 1.1){
	                                color = "1D1D1D";
	                            } else {
	                                color = "CCCCCC";
	                            }
	                            AllData.cache.trafficInfo[k].color = color;
	                        }
	                    }
	                }
	            }
	        }
	        console.log("路况信息整理完毕！");
	        //console.log("trafficInfo",self.cache.trafficInfo);
	        //整理信息,增加st2st信息!
	        for(var i in current_City_lines){
	            var current_drwData = current_City_lines[i];
	            //console.log("current_drwData",current_drwData);
	            var obj={};
	            obj.lineId=current_drwData.ls;
	            obj.lineName=current_drwData.ln;
	            obj.sections=[];
	            //console.log(self.cache.trafficInfo);
	            for(var k in AllData.cache.trafficInfo){
	                if(current_drwData.ls==AllData.cache.trafficInfo[k].reflineId){
	                    var section={};
	                    section.dA="Acc"+AllData.cache.trafficInfo[k].startAcc+"_"+AllData.cache.trafficInfo[k].endAcc;
	                    section.dP=AllData.cache.trafficInfo[k].startPos+"-to-"+AllData.cache.trafficInfo[k].endPos;
	                    section.dN=AllData.cache.trafficInfo[k].direction;
	                    section.sP=AllData.cache.trafficInfo[k].startPos;
	                    section.sN=AllData.cache.trafficInfo[k].startName;
	                    section.eP=AllData.cache.trafficInfo[k].endPos;
	                    section.eN=AllData.cache.trafficInfo[k].endName;
	                    section.rli=AllData.cache.trafficInfo[k].reflineId;
	                    section.rln=AllData.cache.trafficInfo[k].reflineName;
	                    section.path=AllData.cache.trafficInfo[k].path;
	                    section.rd=AllData.cache.trafficInfo[k].ref_direct;
	                    obj.sections.push(section);
	                }
	            }
	            //console.log(obj);
	            current_drwData.st2st=obj.sections;
	            //console.log(current_drwData);
	            AllData.cache.trafficNew.push(current_drwData);
	        }
	        console.log("新的画图数据drwData整理完毕！");
	        //console.log("trafficNew",AllData.cache.trafficNew);
	        //转json!
	        console.log("正在转译成Json...");
	        console.log(JSON.stringify(self.cache.trafficNew));
	    }
	};

	module.exports=SW;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*数据缓存*/
	window.amapCache = window.amapCache || {};

	(function(window, undefined) {
	    var enabledLocalstorage = false,
	        defaultOption = {},
	        cacheFileListName = {},
	        cacheDomListName = {},
	        cacheFileListObj = {},
	        storage;

	    //to see if we can use localStorage
	    try {
	        storage = window.localStorage;
	        storage.setItem('TEST', 'TEST');
	        storage.getItem('TEST');
	        storage.removeItem('TEST');
	        window.enabledLocalstorage = true;
	    } catch (e) {
	        window.enabledLocalstorage = false;
	    }

	    // clear localStorage that not fetch to the file list from server
	    //清除浏览器中的缓存数�?
	    var _clearLocalStorage = function() {
	        for (var i = storage.length - 1; i >= 0; i--) {
	            var key = storage.key(i);
	            var subway_key = key.split("/")[0];
	            if(subway_key == 'data'){
	                if (!cacheFileListName[key]) {
	                    storage.removeItem(key);
	                }
	            }
	        }
	    };

	    // load the newest file list from server
	    //从服务器加载新的数据
	    var _loadNewestVersion = function(callback) {
	        //get方法请求数据
	        $.get(defaultOption.versionPath, function(data) {
	            cacheFileListObj = data;
	            window.amapCache.cacheFileListObj = data;
	            window.amapCache.newestVersion = data;
	            var key;
	            for (key in window.amapCache.newestVersion) {
	                if (window.amapCache.newestVersion.hasOwnProperty(key)) {
	                    var dom_key = key.split('/')[1].split('_')[0];
	                    cacheFileListName[key + '_' + window.amapCache.newestVersion[key]] = true;
	                    // if(key.split('/')[1].split('_')[1] == 'drw'){
	                    //     cacheFileListName[dom_key + '_dom_' + window.amapCache.newestVersion[key]] = true;
	                    // }
	                }
	            }
	            _clearLocalStorage();
	            callback && callback();
	        }, 'json');
	    };
	    //初始化数据,并采用一个complete的方法处理数
	    var _init = function(option) {
	        //如果浏览器可以缓存数据
	        if (enabledLocalstorage) {
	            //定义默认的数据请求地址
	            defaultOption.versionPath = option.versionPath || 'data/version/version.json';
	            _loadNewestVersion(option.complete);
	        } else {
	            option.complete();
	        }
	    };

	    // load data from server or localStorage
	    var _loadDataFromServer = function(url, callback, error) {
	        // $.get(url, callback);
	        $.ajax({
	            url: url,
	            type: 'get',
	            method: 'get',
	            dataType: 'json',
	            timeout: 15000,/*5秒后连接超时*/
	            success: callback,
	            error: error
	        })
	    };
	    //加载数据
	    var _loadData = function(filePath, callback, error) {
	        var fileMD5 = cacheFileListObj[filePath];
	        //如果浏览器可以存储数据
	        if (enabledLocalstorage) {
	            var storageKey = filePath + '_' + cacheFileListObj[filePath];
	            var subwayData = storage.getItem(storageKey);
	            //如果浏览器缓存中存有数据
	            if (subwayData) {
	                if(Object.prototype.toString.call(subwayData) == '[object String]'){
	                    callback(JSON.parse(subwayData));
	                } else {
	                    callback(subwayData);
	                }
	            }
	            //如果浏览器没有存储数,那就从服务器加载
	            else {
	                _loadDataFromServer(filePath, function(data) {
	                    if(Object.prototype.toString.call(data) == '[object String]'){
	                        data = JSON.parse(data);
	                    }
	                    //请求数据,对数据进行浏览器缓存
	                    storage.setItem(storageKey, JSON.stringify(data));
	                    callback(data);
	                }, error);
	            }
	        }
	        //如果浏览器不能存储数
	        else {
	            _loadDataFromServer(filePath, function(data) {
	                if(Object.prototype.toString.call(data) == '[object String]'){
	                    data = JSON.parse(data);
	                }
	                callback(data);
	            }, error);
	        }
	    };
	    //对外提供的操作方法
	    window.amapCache.init = _init;
	    window.amapCache.loadData = _loadData;
	    window.amapCache.cacheFileListObj = cacheFileListObj;
	    window.amapCache.enabledLocalstorage = enabledLocalstorage;
	}(window));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */

	var Zepto = (function() {
	    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
	        document = window.document,
	        elementDisplay = {}, classCache = {},
	        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	        rootNodeRE = /^(?:body|html)$/i,
	        capitalRE = /([A-Z])/g,

	    // special attributes that should be get/set via method calls
	        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

	        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	        table = document.createElement('table'),
	        tableRow = document.createElement('tr'),
	        containers = {
	            'tr': document.createElement('tbody'),
	            'tbody': table, 'thead': table, 'tfoot': table,
	            'td': tableRow, 'th': tableRow,
	            '*': document.createElement('div')
	        },
	        readyRE = /complete|loaded|interactive/,
	        simpleSelectorRE = /^[\w-]*$/,
	        class2type = {},
	        toString = class2type.toString,
	        zepto = {},
	        camelize, uniq,
	        tempParent = document.createElement('div'),
	        propMap = {
	            'tabindex': 'tabIndex',
	            'readonly': 'readOnly',
	            'for': 'htmlFor',
	            'class': 'className',
	            'maxlength': 'maxLength',
	            'cellspacing': 'cellSpacing',
	            'cellpadding': 'cellPadding',
	            'rowspan': 'rowSpan',
	            'colspan': 'colSpan',
	            'usemap': 'useMap',
	            'frameborder': 'frameBorder',
	            'contenteditable': 'contentEditable'
	        },
	        isArray = Array.isArray ||
	            function(object){ return object instanceof Array }

	    zepto.matches = function(element, selector) {
	        if (!selector || !element || element.nodeType !== 1) return false
	        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
	            element.oMatchesSelector || element.matchesSelector
	        if (matchesSelector) return matchesSelector.call(element, selector)
	        // fall back to performing a selector:
	        var match, parent = element.parentNode, temp = !parent
	        if (temp) (parent = tempParent).appendChild(element)
	        match = ~zepto.qsa(parent, selector).indexOf(element)
	        temp && tempParent.removeChild(element)
	        return match
	    }

	    function type(obj) {
	        return obj == null ? String(obj) :
	        class2type[toString.call(obj)] || "object"
	    }

	    function isFunction(value) { return type(value) == "function" }
	    function isWindow(obj)     { return obj != null && obj == obj.window }
	    function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	    function isObject(obj)     { return type(obj) == "object" }
	    function isPlainObject(obj) {
	        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	    }
	    function likeArray(obj) { return typeof obj.length == 'number' }

	    function compact(array) { return filter.call(array, function(item){ return item != null }) }
	    function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	    camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	    function dasherize(str) {
	        return str.replace(/::/g, '/')
	            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	            .replace(/_/g, '-')
	            .toLowerCase()
	    }
	    uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

	    function classRE(name) {
	        return name in classCache ?
	            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	    }

	    function maybeAddPx(name, value) {
	        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	    }

	    function defaultDisplay(nodeName) {
	        var element, display
	        if (!elementDisplay[nodeName]) {
	            element = document.createElement(nodeName)
	            document.body.appendChild(element)
	            display = getComputedStyle(element, '').getPropertyValue("display")
	            element.parentNode.removeChild(element)
	            display == "none" && (display = "block")
	            elementDisplay[nodeName] = display
	        }
	        return elementDisplay[nodeName]
	    }

	    function children(element) {
	        return 'children' in element ?
	            slice.call(element.children) :
	            $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
	    }

	    // `$.zepto.fragment` takes a html string and an optional tag name
	    // to generate DOM nodes nodes from the given html string.
	    // The generated DOM nodes are returned as an array.
	    // This function can be overriden in plugins for example to make
	    // it compatible with browsers that don't support the DOM fully.
	    zepto.fragment = function(html, name, properties) {
	        var dom, nodes, container

	        // A special case optimization for a single tag
	        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

	        if (!dom) {
	            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
	            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	            if (!(name in containers)) name = '*'

	            container = containers[name]
	            container.innerHTML = '' + html
	            dom = $.each(slice.call(container.childNodes), function(){
	                container.removeChild(this)
	            })
	        }

	        if (isPlainObject(properties)) {
	            nodes = $(dom)
	            $.each(properties, function(key, value) {
	                if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	                else nodes.attr(key, value)
	            })
	        }

	        return dom
	    }

	    // `$.zepto.Z` swaps out the prototype of the given `dom` array
	    // of nodes with `$.fn` and thus supplying all the Zepto functions
	    // to the array. Note that `__proto__` is not supported on Internet
	    // Explorer. This method can be overriden in plugins.
	    zepto.Z = function(dom, selector) {
	        dom = dom || []
	        dom.__proto__ = $.fn
	        dom.selector = selector || ''
	        return dom
	    }

	    // `$.zepto.isZ` should return `true` if the given object is a Zepto
	    // collection. This method can be overriden in plugins.
	    zepto.isZ = function(object) {
	        return object instanceof zepto.Z
	    }

	    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	    // takes a CSS selector and an optional context (and handles various
	    // special cases).
	    // This method can be overriden in plugins.
	    zepto.init = function(selector, context) {
	        var dom
	        // If nothing given, return an empty Zepto collection
	        if (!selector) return zepto.Z()
	        // Optimize for string selectors
	        else if (typeof selector == 'string') {
	            selector = selector.trim()
	            // If it's a html fragment, create nodes from it
	            // Note: In both Chrome 21 and Firefox 15, DOM error 12
	            // is thrown if the fragment doesn't begin with <
	            if (selector[0] == '<' && fragmentRE.test(selector))
	                dom = zepto.fragment(selector, RegExp.$1, context), selector = null
	            // If there's a context, create a collection on that context first, and select
	            // nodes from there
	            else if (context !== undefined) return $(context).find(selector)
	            // If it's a CSS selector, use it to select nodes.
	            else dom = zepto.qsa(document, selector)
	        }
	        // If a function is given, call it when the DOM is ready
	        else if (isFunction(selector)) return $(document).ready(selector)
	        // If a Zepto collection is given, just return it
	        else if (zepto.isZ(selector)) return selector
	        else {
	            // normalize array if an array of nodes is given
	            if (isArray(selector)) dom = compact(selector)
	            // Wrap DOM nodes.
	            else if (isObject(selector))
	                dom = [selector], selector = null
	            // If it's a html fragment, create nodes from it
	            else if (fragmentRE.test(selector))
	                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
	            // If there's a context, create a collection on that context first, and select
	            // nodes from there
	            else if (context !== undefined) return $(context).find(selector)
	            // And last but no least, if it's a CSS selector, use it to select nodes.
	            else dom = zepto.qsa(document, selector)
	        }
	        // create a new Zepto collection from the nodes found
	        return zepto.Z(dom, selector)
	    }

	    // `$` will be the base `Zepto` object. When calling this
	    // function just call `$.zepto.init, which makes the implementation
	    // details of selecting nodes and creating Zepto collections
	    // patchable in plugins.
	    $ = function(selector, context){
	        return zepto.init(selector, context)
	    }

	    function extend(target, source, deep) {
	        for (key in source)
	            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	                    target[key] = {}
	                if (isArray(source[key]) && !isArray(target[key]))
	                    target[key] = []
	                extend(target[key], source[key], deep)
	            }
	            else if (source[key] !== undefined) target[key] = source[key]
	    }

	    // Copy all but undefined properties from one or more
	    // objects to the `target` object.
	    $.extend = function(target){
	        var deep, args = slice.call(arguments, 1)
	        if (typeof target == 'boolean') {
	            deep = target
	            target = args.shift()
	        }
	        args.forEach(function(arg){ extend(target, arg, deep) })
	        return target
	    }

	    // `$.zepto.qsa` is Zepto's CSS selector implementation which
	    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	    // This method can be overriden in plugins.
	    zepto.qsa = function(element, selector){
	        var found,
	            maybeID = selector[0] == '#',
	            maybeClass = !maybeID && selector[0] == '.',
	            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
	            isSimple = simpleSelectorRE.test(nameOnly)
	        return (isDocument(element) && isSimple && maybeID) ?
	            ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
	            (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
	                slice.call(
	                    isSimple && !maybeID ?
	                        maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	                            element.getElementsByTagName(selector) : // Or a tag
	                        element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	                )
	    }

	    function filtered(nodes, selector) {
	        return selector == null ? $(nodes) : $(nodes).filter(selector)
	    }

	    $.contains = document.documentElement.contains ?
	        function(parent, node) {
	            return parent !== node && parent.contains(node)
	        } :
	        function(parent, node) {
	            while (node && (node = node.parentNode))
	                if (node === parent) return true
	            return false
	        }

	    function funcArg(context, arg, idx, payload) {
	        return isFunction(arg) ? arg.call(context, idx, payload) : arg
	    }

	    function setAttribute(node, name, value) {
	        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	    }

	    // access className property while respecting SVGAnimatedString
	    function className(node, value){
	        var klass = node.className || '',
	            svg   = klass && klass.baseVal !== undefined

	        if (value === undefined) return svg ? klass.baseVal : klass
	        svg ? (klass.baseVal = value) : (node.className = value)
	    }

	    // "true"  => true
	    // "false" => false
	    // "null"  => null
	    // "42"    => 42
	    // "42.5"  => 42.5
	    // "08"    => "08"
	    // JSON    => parse if valid
	    // String  => self
	    function deserializeValue(value) {
	        try {
	            return value ?
	            value == "true" ||
	            ( value == "false" ? false :
	                value == "null" ? null :
	                    +value + "" == value ? +value :
	                        /^[\[\{]/.test(value) ? $.parseJSON(value) :
	                            value )
	                : value
	        } catch(e) {
	            return value
	        }
	    }

	    $.type = type
	    $.isFunction = isFunction
	    $.isWindow = isWindow
	    $.isArray = isArray
	    $.isPlainObject = isPlainObject

	    $.isEmptyObject = function(obj) {
	        var name
	        for (name in obj) return false
	        return true
	    }

	    $.inArray = function(elem, array, i){
	        return emptyArray.indexOf.call(array, elem, i)
	    }

	    $.camelCase = camelize
	    $.trim = function(str) {
	        return str == null ? "" : String.prototype.trim.call(str)
	    }

	    // plugin compatibility
	    $.uuid = 0
	    $.support = { }
	    $.expr = { }

	    $.map = function(elements, callback){
	        var value, values = [], i, key
	        if (likeArray(elements))
	            for (i = 0; i < elements.length; i++) {
	                value = callback(elements[i], i)
	                if (value != null) values.push(value)
	            }
	        else
	            for (key in elements) {
	                value = callback(elements[key], key)
	                if (value != null) values.push(value)
	            }
	        return flatten(values)
	    }

	    $.each = function(elements, callback){
	        var i, key
	        if (likeArray(elements)) {
	            for (i = 0; i < elements.length; i++)
	                if (callback.call(elements[i], i, elements[i]) === false) return elements
	        } else {
	            for (key in elements)
	                if (callback.call(elements[key], key, elements[key]) === false) return elements
	        }

	        return elements
	    }

	    $.grep = function(elements, callback){
	        return filter.call(elements, callback)
	    }

	    if (window.JSON) $.parseJSON = JSON.parse

	    // Populate the class2type map
	    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	        class2type[ "[object " + name + "]" ] = name.toLowerCase()
	    })

	    // Define methods that will be available on all
	    // Zepto collections
	    $.fn = {
	        // Because a collection acts like an array
	        // copy over these useful array functions.
	        forEach: emptyArray.forEach,
	        reduce: emptyArray.reduce,
	        push: emptyArray.push,
	        sort: emptyArray.sort,
	        indexOf: emptyArray.indexOf,
	        concat: emptyArray.concat,

	        // `map` and `slice` in the jQuery API work differently
	        // from their array counterparts
	        map: function(fn){
	            return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
	        },
	        slice: function(){
	            return $(slice.apply(this, arguments))
	        },

	        ready: function(callback){
	            // need to check if document.body exists for IE as that browser reports
	            // document ready when it hasn't yet created the body element
	            if (readyRE.test(document.readyState) && document.body) callback($)
	            else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	            return this
	        },
	        get: function(idx){
	            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
	        },
	        toArray: function(){ return this.get() },
	        size: function(){
	            return this.length
	        },
	        remove: function(){
	            return this.each(function(){
	                if (this.parentNode != null)
	                    this.parentNode.removeChild(this)
	            })
	        },
	        each: function(callback){
	            emptyArray.every.call(this, function(el, idx){
	                return callback.call(el, idx, el) !== false
	            })
	            return this
	        },
	        filter: function(selector){
	            if (isFunction(selector)) return this.not(this.not(selector))
	            return $(filter.call(this, function(element){
	                return zepto.matches(element, selector)
	            }))
	        },
	        add: function(selector,context){
	            return $(uniq(this.concat($(selector,context))))
	        },
	        is: function(selector){
	            return this.length > 0 && zepto.matches(this[0], selector)
	        },
	        not: function(selector){
	            var nodes=[]
	            if (isFunction(selector) && selector.call !== undefined)
	                this.each(function(idx){
	                    if (!selector.call(this,idx)) nodes.push(this)
	                })
	            else {
	                var excludes = typeof selector == 'string' ? this.filter(selector) :
	                    (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	                this.forEach(function(el){
	                    if (excludes.indexOf(el) < 0) nodes.push(el)
	                })
	            }
	            return $(nodes)
	        },
	        has: function(selector){
	            return this.filter(function(){
	                return isObject(selector) ?
	                    $.contains(this, selector) :
	                    $(this).find(selector).size()
	            })
	        },
	        eq: function(idx){
	            return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	        },
	        first: function(){
	            var el = this[0]
	            return el && !isObject(el) ? el : $(el)
	        },
	        last: function(){
	            var el = this[this.length - 1]
	            return el && !isObject(el) ? el : $(el)
	        },
	        find: function(selector){
	            var result, $this = this
	            if (!selector) result = $()
	            else if (typeof selector == 'object')
	                result = $(selector).filter(function(){
	                    var node = this
	                    return emptyArray.some.call($this, function(parent){
	                        return $.contains(parent, node)
	                    })
	                })
	            else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
	            else result = this.map(function(){ return zepto.qsa(this, selector) })
	            return result
	        },
	        closest: function(selector, context){
	            var node = this[0], collection = false
	            if (typeof selector == 'object') collection = $(selector)
	            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
	                node = node !== context && !isDocument(node) && node.parentNode
	            return $(node)
	        },
	        parents: function(selector){
	            var ancestors = [], nodes = this
	            while (nodes.length > 0)
	                nodes = $.map(nodes, function(node){
	                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	                        ancestors.push(node)
	                        return node
	                    }
	                })
	            return filtered(ancestors, selector)
	        },
	        parent: function(selector){
	            return filtered(uniq(this.pluck('parentNode')), selector)
	        },
	        children: function(selector){
	            return filtered(this.map(function(){ return children(this) }), selector)
	        },
	        contents: function() {
	            return this.map(function() { return slice.call(this.childNodes) })
	        },
	        siblings: function(selector){
	            return filtered(this.map(function(i, el){
	                return filter.call(children(el.parentNode), function(child){ return child!==el })
	            }), selector)
	        },
	        empty: function(){
	            return this.each(function(){ this.innerHTML = '' })
	        },
	        // `pluck` is borrowed from Prototype.js
	        pluck: function(property){
	            return $.map(this, function(el){ return el[property] })
	        },
	        show: function(){
	            return this.each(function(){
	                this.style.display == "none" && (this.style.display = '')
	                if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	                    this.style.display = defaultDisplay(this.nodeName)
	            })
	        },
	        replaceWith: function(newContent){
	            return this.before(newContent).remove()
	        },
	        wrap: function(structure){
	            var func = isFunction(structure)
	            if (this[0] && !func)
	                var dom   = $(structure).get(0),
	                    clone = dom.parentNode || this.length > 1

	            return this.each(function(index){
	                $(this).wrapAll(
	                    func ? structure.call(this, index) :
	                        clone ? dom.cloneNode(true) : dom
	                )
	            })
	        },
	        wrapAll: function(structure){
	            if (this[0]) {
	                $(this[0]).before(structure = $(structure))
	                var children
	                // drill down to the inmost element
	                while ((children = structure.children()).length) structure = children.first()
	                $(structure).append(this)
	            }
	            return this
	        },
	        wrapInner: function(structure){
	            var func = isFunction(structure)
	            return this.each(function(index){
	                var self = $(this), contents = self.contents(),
	                    dom  = func ? structure.call(this, index) : structure
	                contents.length ? contents.wrapAll(dom) : self.append(dom)
	            })
	        },
	        unwrap: function(){
	            this.parent().each(function(){
	                $(this).replaceWith($(this).children())
	            })
	            return this
	        },
	        clone: function(){
	            return this.map(function(){ return this.cloneNode(true) })
	        },
	        hide: function(){
	            return this.css("display", "none")
	        },
	        toggle: function(setting){
	            return this.each(function(){
	                var el = $(this)
	                    ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
	            })
	        },
	        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
	        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
	        html: function(html){
	            return 0 in arguments ?
	                this.each(function(idx){
	                    var originHtml = this.innerHTML
	                    $(this).empty().append( funcArg(this, html, idx, originHtml) )
	                }) :
	                (0 in this ? this[0].innerHTML : null)
	        },
	        text: function(text){
	            return 0 in arguments ?
	                this.each(function(idx){
	                    var newText = funcArg(this, text, idx, this.textContent)
	                    this.textContent = newText == null ? '' : ''+newText
	                }) :
	                (0 in this ? this[0].textContent : null)
	        },
	        attr: function(name, value){
	            var result
	            return (typeof name == 'string' && !(1 in arguments)) ?
	                (!this.length || this[0].nodeType !== 1 ? undefined :
	                        (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	                ) :
	                this.each(function(idx){
	                    if (this.nodeType !== 1) return
	                    if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
	                    else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
	                })
	        },
	        removeAttr: function(name){
	            return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
	                setAttribute(this, attribute)
	            }, this)})
	        },
	        prop: function(name, value){
	            name = propMap[name] || name
	            return (1 in arguments) ?
	                this.each(function(idx){
	                    this[name] = funcArg(this, value, idx, this[name])
	                }) :
	                (this[0] && this[0][name])
	        },
	        data: function(name, value){
	            var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

	            var data = (1 in arguments) ?
	                this.attr(attrName, value) :
	                this.attr(attrName)

	            return data !== null ? deserializeValue(data) : undefined
	        },
	        val: function(value){
	            return 0 in arguments ?
	                this.each(function(idx){
	                    this.value = funcArg(this, value, idx, this.value)
	                }) :
	                (this[0] && (this[0].multiple ?
	                        $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
	                        this[0].value)
	                )
	        },
	        offset: function(coordinates){
	            if (coordinates) return this.each(function(index){
	                var $this = $(this),
	                    coords = funcArg(this, coordinates, index, $this.offset()),
	                    parentOffset = $this.offsetParent().offset(),
	                    props = {
	                        top:  coords.top  - parentOffset.top,
	                        left: coords.left - parentOffset.left
	                    }

	                if ($this.css('position') == 'static') props['position'] = 'relative'
	                $this.css(props)
	            })
	            if (!this.length) return null
	            var obj = this[0].getBoundingClientRect()
	            return {
	                left: obj.left + window.pageXOffset,
	                top: obj.top + window.pageYOffset,
	                width: Math.round(obj.width),
	                height: Math.round(obj.height)
	            }
	        },
	        css: function(property, value){
	            if (arguments.length < 2) {
	                var computedStyle, element = this[0]
	                if(!element) return
	                computedStyle = getComputedStyle(element, '')
	                if (typeof property == 'string')
	                    return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
	                else if (isArray(property)) {
	                    var props = {}
	                    $.each(property, function(_, prop){
	                        props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
	                    })
	                    return props
	                }
	            }

	            var css = ''
	            if (type(property) == 'string') {
	                if (!value && value !== 0)
	                    this.each(function(){ this.style.removeProperty(dasherize(property)) })
	                else
	                    css = dasherize(property) + ":" + maybeAddPx(property, value)
	            } else {
	                for (key in property)
	                    if (!property[key] && property[key] !== 0)
	                        this.each(function(){ this.style.removeProperty(dasherize(key)) })
	                    else
	                        css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
	            }

	            return this.each(function(){ this.style.cssText += ';' + css })
	        },
	        index: function(element){
	            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	        },
	        hasClass: function(name){
	            if (!name) return false
	            return emptyArray.some.call(this, function(el){
	                return this.test(className(el))
	            }, classRE(name))
	        },
	        addClass: function(name){
	            if (!name) return this
	            return this.each(function(idx){
	                if (!('className' in this)) return
	                classList = []
	                var cls = className(this), newName = funcArg(this, name, idx, cls)
	                newName.split(/\s+/g).forEach(function(klass){
	                    if (!$(this).hasClass(klass)) classList.push(klass)
	                }, this)
	                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
	            })
	        },
	        removeClass: function(name){
	            return this.each(function(idx){
	                if (!('className' in this)) return
	                if (name === undefined) return className(this, '')
	                classList = className(this)
	                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	                    classList = classList.replace(classRE(klass), " ")
	                })
	                className(this, classList.trim())
	            })
	        },
	        toggleClass: function(name, when){
	            if (!name) return this
	            return this.each(function(idx){
	                var $this = $(this), names = funcArg(this, name, idx, className(this))
	                names.split(/\s+/g).forEach(function(klass){
	                    (when === undefined ? !$this.hasClass(klass) : when) ?
	                        $this.addClass(klass) : $this.removeClass(klass)
	                })
	            })
	        },
	        scrollTop: function(value){
	            if (!this.length) return
	            var hasScrollTop = 'scrollTop' in this[0]
	            if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
	            return this.each(hasScrollTop ?
	                function(){ this.scrollTop = value } :
	                function(){ this.scrollTo(this.scrollX, value) })
	        },
	        scrollLeft: function(value){
	            if (!this.length) return
	            var hasScrollLeft = 'scrollLeft' in this[0]
	            if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
	            return this.each(hasScrollLeft ?
	                function(){ this.scrollLeft = value } :
	                function(){ this.scrollTo(value, this.scrollY) })
	        },
	        position: function() {
	            if (!this.length) return

	            var elem = this[0],
	            // Get *real* offsetParent
	                offsetParent = this.offsetParent(),
	            // Get correct offsets
	                offset       = this.offset(),
	                parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

	            // Subtract element margins
	            // note: when an element has margin: auto the offsetLeft and marginLeft
	            // are the same in Safari causing offset.left to incorrectly be 0
	            offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
	            offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

	            // Add offsetParent borders
	            parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
	            parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

	            // Subtract the two offsets
	            return {
	                top:  offset.top  - parentOffset.top,
	                left: offset.left - parentOffset.left
	            }
	        },
	        offsetParent: function() {
	            return this.map(function(){
	                var parent = this.offsetParent || document.body
	                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
	                    parent = parent.offsetParent
	                return parent
	            })
	        }
	    }

	    // for now
	    $.fn.detach = $.fn.remove

	        // Generate the `width` and `height` functions
	    ;['width', 'height'].forEach(function(dimension){
	        var dimensionProperty =
	            dimension.replace(/./, function(m){ return m[0].toUpperCase() })

	        $.fn[dimension] = function(value){
	            var offset, el = this[0]
	            if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
	                isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
	                (offset = this.offset()) && offset[dimension]
	            else return this.each(function(idx){
	                el = $(this)
	                el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	            })
	        }
	    })

	    function traverseNode(node, fun) {
	        fun(node)
	        for (var i = 0, len = node.childNodes.length; i < len; i++)
	            traverseNode(node.childNodes[i], fun)
	    }

	    // Generate the `after`, `prepend`, `before`, `append`,
	    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	    adjacencyOperators.forEach(function(operator, operatorIndex) {
	        var inside = operatorIndex % 2 //=> prepend, append

	        $.fn[operator] = function(){
	            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	            var argType, nodes = $.map(arguments, function(arg) {
	                    argType = type(arg)
	                    return argType == "object" || argType == "array" || arg == null ?
	                        arg : zepto.fragment(arg)
	                }),
	                parent, copyByClone = this.length > 1
	            if (nodes.length < 1) return this

	            return this.each(function(_, target){
	                parent = inside ? target : target.parentNode

	                // convert all methods to a "before" operation
	                target = operatorIndex == 0 ? target.nextSibling :
	                    operatorIndex == 1 ? target.firstChild :
	                        operatorIndex == 2 ? target :
	                            null

	                var parentInDocument = $.contains(document.documentElement, parent)

	                nodes.forEach(function(node){
	                    if (copyByClone) node = node.cloneNode(true)
	                    else if (!parent) return $(node).remove()

	                    parent.insertBefore(node, target)
	                    if (parentInDocument) traverseNode(node, function(el){
	                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
	                            (!el.type || el.type === 'text/javascript') && !el.src)
	                            window['eval'].call(window, el.innerHTML)
	                    })
	                })
	            })
	        }

	        // after    => insertAfter
	        // prepend  => prependTo
	        // before   => insertBefore
	        // append   => appendTo
	        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
	            $(html)[operator](this)
	            return this
	        }
	    })

	    zepto.Z.prototype = $.fn

	    // Export internal API functions in the `$.zepto` namespace
	    zepto.uniq = uniq
	    zepto.deserializeValue = deserializeValue
	    $.zepto = zepto

	    return $
	})()

	window.Zepto = Zepto
	window.$ === undefined && (window.$ = Zepto)
	//add support for requirejs
	if ( true ) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return Zepto; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	;(function($){
	    var _zid = 1, undefined,
	        slice = Array.prototype.slice,
	        isFunction = $.isFunction,
	        isString = function(obj){ return typeof obj == 'string' },
	        handlers = {},
	        specialEvents={},
	        focusinSupported = 'onfocusin' in window,
	        focus = { focus: 'focusin', blur: 'focusout' },
	        hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

	    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	    function zid(element) {
	        return element._zid || (element._zid = _zid++)
	    }
	    function findHandlers(element, event, fn, selector) {
	        event = parse(event)
	        if (event.ns) var matcher = matcherFor(event.ns)
	        return (handlers[zid(element)] || []).filter(function(handler) {
	            return handler
	                && (!event.e  || handler.e == event.e)
	                && (!event.ns || matcher.test(handler.ns))
	                && (!fn       || zid(handler.fn) === zid(fn))
	                && (!selector || handler.sel == selector)
	        })
	    }
	    function parse(event) {
	        var parts = ('' + event).split('.')
	        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	    }
	    function matcherFor(ns) {
	        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	    }

	    function eventCapture(handler, captureSetting) {
	        return handler.del &&
	            (!focusinSupported && (handler.e in focus)) ||
	            !!captureSetting
	    }

	    function realEvent(type) {
	        return hover[type] || (focusinSupported && focus[type]) || type
	    }

	    function add(element, events, fn, data, selector, delegator, capture){
	        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	        events.split(/\s/).forEach(function(event){
	            if (event == 'ready') return $(document).ready(fn)
	            var handler   = parse(event)
	            handler.fn    = fn
	            handler.sel   = selector
	            // emulate mouseenter, mouseleave
	            if (handler.e in hover) fn = function(e){
	                var related = e.relatedTarget
	                if (!related || (related !== this && !$.contains(this, related)))
	                    return handler.fn.apply(this, arguments)
	            }
	            handler.del   = delegator
	            var callback  = delegator || fn
	            handler.proxy = function(e){
	                e = compatible(e)
	                if (e.isImmediatePropagationStopped()) return
	                e.data = data
	                var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
	                if (result === false) e.preventDefault(), e.stopPropagation()
	                return result
	            }
	            handler.i = set.length
	            set.push(handler)
	            if ('addEventListener' in element)
	                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	        })
	    }
	    function remove(element, events, fn, selector, capture){
	        var id = zid(element)
	            ;(events || '').split(/\s/).forEach(function(event){
	            findHandlers(element, event, fn, selector).forEach(function(handler){
	                delete handlers[id][handler.i]
	                if ('removeEventListener' in element)
	                    element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	            })
	        })
	    }

	    $.event = { add: add, remove: remove }

	    $.proxy = function(fn, context) {
	        var args = (2 in arguments) && slice.call(arguments, 2)
	        if (isFunction(fn)) {
	            var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
	            proxyFn._zid = zid(fn)
	            return proxyFn
	        } else if (isString(context)) {
	            if (args) {
	                args.unshift(fn[context], fn)
	                return $.proxy.apply(null, args)
	            } else {
	                return $.proxy(fn[context], fn)
	            }
	        } else {
	            throw new TypeError("expected function")
	        }
	    }

	    $.fn.bind = function(event, data, callback){
	        return this.on(event, data, callback)
	    }
	    $.fn.unbind = function(event, callback){
	        return this.off(event, callback)
	    }
	    $.fn.one = function(event, selector, data, callback){
	        return this.on(event, selector, data, callback, 1)
	    }

	    var returnTrue = function(){return true},
	        returnFalse = function(){return false},
	        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
	        eventMethods = {
	            preventDefault: 'isDefaultPrevented',
	            stopImmediatePropagation: 'isImmediatePropagationStopped',
	            stopPropagation: 'isPropagationStopped'
	        }

	    function compatible(event, source) {
	        if (source || !event.isDefaultPrevented) {
	            source || (source = event)

	            $.each(eventMethods, function(name, predicate) {
	                var sourceMethod = source[name]
	                event[name] = function(){
	                    this[predicate] = returnTrue
	                    return sourceMethod && sourceMethod.apply(source, arguments)
	                }
	                event[predicate] = returnFalse
	            })

	            if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	                    'returnValue' in source ? source.returnValue === false :
	                    source.getPreventDefault && source.getPreventDefault())
	                event.isDefaultPrevented = returnTrue
	        }
	        return event
	    }

	    function createProxy(event) {
	        var key, proxy = { originalEvent: event }
	        for (key in event)
	            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

	        return compatible(proxy, event)
	    }

	    $.fn.delegate = function(selector, event, callback){
	        return this.on(event, selector, callback)
	    }
	    $.fn.undelegate = function(selector, event, callback){
	        return this.off(event, selector, callback)
	    }

	    $.fn.live = function(event, callback){
	        $(document.body).delegate(this.selector, event, callback)
	        return this
	    }
	    $.fn.die = function(event, callback){
	        $(document.body).undelegate(this.selector, event, callback)
	        return this
	    }

	    $.fn.on = function(event, selector, data, callback, one){
	        var autoRemove, delegator, $this = this
	        if (event && !isString(event)) {
	            $.each(event, function(type, fn){
	                $this.on(type, selector, data, fn, one)
	            })
	            return $this
	        }

	        if (!isString(selector) && !isFunction(callback) && callback !== false)
	            callback = data, data = selector, selector = undefined
	        if (isFunction(data) || data === false)
	            callback = data, data = undefined

	        if (callback === false) callback = returnFalse

	        return $this.each(function(_, element){
	            if (one) autoRemove = function(e){
	                remove(element, e.type, callback)
	                return callback.apply(this, arguments)
	            }

	            if (selector) delegator = function(e){
	                var evt, match = $(e.target).closest(selector, element).get(0)
	                if (match && match !== element) {
	                    evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	                    return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
	                }
	            }

	            add(element, event, callback, data, selector, delegator || autoRemove)
	        })
	    }
	    $.fn.off = function(event, selector, callback){
	        var $this = this
	        if (event && !isString(event)) {
	            $.each(event, function(type, fn){
	                $this.off(type, selector, fn)
	            })
	            return $this
	        }

	        if (!isString(selector) && !isFunction(callback) && callback !== false)
	            callback = selector, selector = undefined

	        if (callback === false) callback = returnFalse

	        return $this.each(function(){
	            remove(this, event, callback, selector)
	        })
	    }

	    $.fn.trigger = function(event, args){
	        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
	        event._args = args
	        return this.each(function(){
	            // handle focus(), blur() by calling them directly
	            if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
	            // items in the collection might not be DOM elements
	            else if ('dispatchEvent' in this) this.dispatchEvent(event)
	            else $(this).triggerHandler(event, args)
	        })
	    }

	    // triggers event handlers on current element just as if an event occurred,
	    // doesn't trigger an actual event, doesn't bubble
	    $.fn.triggerHandler = function(event, args){
	        var e, result
	        this.each(function(i, element){
	            e = createProxy(isString(event) ? $.Event(event) : event)
	            e._args = args
	            e.target = element
	            $.each(findHandlers(element, event.type || event), function(i, handler){
	                result = handler.proxy(e)
	                if (e.isImmediatePropagationStopped()) return false
	            })
	        })
	        return result
	    }

	        // shortcut methods for `.bind(event, fn)` for each event type
	    ;('focusin focusout focus blur load resize scroll unload click dblclick '+
	    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
	    'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	            $.fn[event] = function(callback) {
	                return (0 in arguments) ?
	                    this.bind(event, callback) :
	                    this.trigger(event)
	            }
	        })

	    $.Event = function(type, props) {
	        if (!isString(type)) props = type, type = props.type
	        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	        event.initEvent(type, bubbles, true)
	        return compatible(event)
	    }

	})(Zepto)

	;(function($){
	    var jsonpID = 0,
	        document = window.document,
	        key,
	        name,
	        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	        scriptTypeRE = /^(?:text|application)\/javascript/i,
	        xmlTypeRE = /^(?:text|application)\/xml/i,
	        jsonType = 'application/json',
	        htmlType = 'text/html',
	        blankRE = /^\s*$/,
	        originAnchor = document.createElement('a')

	    originAnchor.href = window.location.href

	    // trigger a custom event and return false if it was cancelled
	    function triggerAndReturn(context, eventName, data) {
	        var event = $.Event(eventName)
	        $(context).trigger(event, data)
	        return !event.isDefaultPrevented()
	    }

	    // trigger an Ajax "global" event
	    function triggerGlobal(settings, context, eventName, data) {
	        if (settings.global) return triggerAndReturn(context || document, eventName, data)
	    }

	    // Number of active Ajax requests
	    $.active = 0

	    function ajaxStart(settings) {
	        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	    }
	    function ajaxStop(settings) {
	        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	    }

	    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	    function ajaxBeforeSend(xhr, settings) {
	        var context = settings.context
	        if (settings.beforeSend.call(context, xhr, settings) === false ||
	            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
	            return false

	        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	    }
	    function ajaxSuccess(data, xhr, settings, deferred) {
	        var context = settings.context, status = 'success'
	        settings.success.call(context, data, status, xhr)
	        if (deferred) deferred.resolveWith(context, [data, status, xhr])
	        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
	        ajaxComplete(status, xhr, settings)
	    }
	    // type: "timeout", "error", "abort", "parsererror"
	    function ajaxError(error, type, xhr, settings, deferred) {
	        var context = settings.context
	        settings.error.call(context, xhr, type, error)
	        if (deferred) deferred.rejectWith(context, [xhr, type, error])
	        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
	        ajaxComplete(type, xhr, settings)
	    }
	    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	    function ajaxComplete(status, xhr, settings) {
	        var context = settings.context
	        settings.complete.call(context, xhr, status)
	        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
	        ajaxStop(settings)
	    }

	    // Empty function, used as default callback
	    function empty() {}

	    $.ajaxJSONP = function(options, deferred){
	        if (!('type' in options)) return $.ajax(options)

	        var _callbackName = options.jsonpCallback,
	            callbackName = ($.isFunction(_callbackName) ?
	                    _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
	            script = document.createElement('script'),
	            originalCallback = window[callbackName],
	            responseData,
	            abort = function(errorType) {
	                $(script).triggerHandler('error', errorType || 'abort')
	            },
	            xhr = { abort: abort }, abortTimeout

	        if (deferred) deferred.promise(xhr)

	        $(script).on('load error', function(e, errorType){
	            clearTimeout(abortTimeout)
	            $(script).off().remove()

	            if (e.type == 'error' || !responseData) {
	                ajaxError(null, errorType || 'error', xhr, options, deferred)
	            } else {
	                ajaxSuccess(responseData[0], xhr, options, deferred)
	            }

	            window[callbackName] = originalCallback
	            if (responseData && $.isFunction(originalCallback))
	                originalCallback(responseData[0])

	            originalCallback = responseData = undefined
	        })

	        if (ajaxBeforeSend(xhr, options) === false) {
	            abort('abort')
	            return xhr
	        }

	        window[callbackName] = function(){
	            responseData = arguments
	        }

	        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
	        document.head.appendChild(script)

	        if (options.timeout > 0) abortTimeout = setTimeout(function(){
	            abort('timeout')
	        }, options.timeout)

	        return xhr
	    }

	    $.ajaxSettings = {
	        // Default type of request
	        type: 'GET',
	        // Callback that is executed before request
	        beforeSend: empty,
	        // Callback that is executed if the request succeeds
	        success: empty,
	        // Callback that is executed the the server drops error
	        error: empty,
	        // Callback that is executed on request complete (both: error and success)
	        complete: empty,
	        // The context for the callbacks
	        context: null,
	        // Whether to trigger "global" Ajax events
	        global: true,
	        // Transport
	        xhr: function () {
	            return new window.XMLHttpRequest()
	        },
	        // MIME types mapping
	        // IIS returns Javascript as "application/x-javascript"
	        accepts: {
	            script: 'text/javascript, application/javascript, application/x-javascript',
	            json:   jsonType,
	            xml:    'application/xml, text/xml',
	            html:   htmlType,
	            text:   'text/plain'
	        },
	        // Whether the request is to another domain
	        crossDomain: false,
	        // Default timeout
	        timeout: 0,
	        // Whether data should be serialized to string
	        processData: true,
	        // Whether the browser should be allowed to cache GET responses
	        cache: true
	    }

	    function mimeToDataType(mime) {
	        if (mime) mime = mime.split(';', 2)[0]
	        return mime && ( mime == htmlType ? 'html' :
	                mime == jsonType ? 'json' :
	                    scriptTypeRE.test(mime) ? 'script' :
	                    xmlTypeRE.test(mime) && 'xml' ) || 'text'
	    }

	    function appendQuery(url, query) {
	        if (query == '') return url
	        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	    }

	    // serialize payload and append it to the URL for GET requests
	    function serializeData(options) {
	        if (options.processData && options.data && $.type(options.data) != "string")
	            options.data = $.param(options.data, options.traditional)
	        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
	            options.url = appendQuery(options.url, options.data), options.data = undefined
	    }

	    $.ajax = function(options){
	        var settings = $.extend({}, options || {}),
	            deferred = $.Deferred && $.Deferred(),
	            urlAnchor
	        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

	        ajaxStart(settings)

	        if (!settings.crossDomain) {
	            urlAnchor = document.createElement('a')
	            urlAnchor.href = settings.url
	            urlAnchor.href = urlAnchor.href
	            settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
	        }

	        if (!settings.url) settings.url = window.location.toString()
	        serializeData(settings)

	        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
	        if (hasPlaceholder) dataType = 'jsonp'

	        if (settings.cache === false || (
	                (!options || options.cache !== true) &&
	                ('script' == dataType || 'jsonp' == dataType)
	            ))
	            settings.url = appendQuery(settings.url, '_=' + Date.now())

	        if ('jsonp' == dataType) {
	            if (!hasPlaceholder)
	                settings.url = appendQuery(settings.url,
	                    settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
	            return $.ajaxJSONP(settings, deferred)
	        }

	        var mime = settings.accepts[dataType],
	            headers = { },
	            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
	            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	            xhr = settings.xhr(),
	            nativeSetHeader = xhr.setRequestHeader,
	            abortTimeout

	        if (deferred) deferred.promise(xhr)

	        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
	        setHeader('Accept', mime || '*/*')
	        if (mime = settings.mimeType || mime) {
	            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
	            xhr.overrideMimeType && xhr.overrideMimeType(mime)
	        }
	        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
	            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

	        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
	        xhr.setRequestHeader = setHeader

	        xhr.onreadystatechange = function(){
	            if (xhr.readyState == 4) {
	                xhr.onreadystatechange = empty
	                clearTimeout(abortTimeout)
	                var result, error = false
	                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
	                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
	                    result = xhr.responseText

	                    try {
	                        // http://perfectionkills.com/global-eval-what-are-the-options/
	                        if (dataType == 'script')    (1,eval)(result)
	                        else if (dataType == 'xml')  result = xhr.responseXML
	                        else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
	                    } catch (e) { error = e }

	                    if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
	                    else ajaxSuccess(result, xhr, settings, deferred)
	                } else {
	                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
	                }
	            }
	        }

	        if (ajaxBeforeSend(xhr, settings) === false) {
	            xhr.abort()
	            ajaxError(null, 'abort', xhr, settings, deferred)
	            return xhr
	        }

	        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

	        var async = 'async' in settings ? settings.async : true
	        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

	        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

	        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
	            xhr.onreadystatechange = empty
	            xhr.abort()
	            ajaxError(null, 'timeout', xhr, settings, deferred)
	        }, settings.timeout)

	        // avoid sending empty string (#319)
	        xhr.send(settings.data ? settings.data : null)
	        return xhr
	    }

	    // handle optional data/success arguments
	    function parseArguments(url, data, success, dataType) {
	        if ($.isFunction(data)) dataType = success, success = data, data = undefined
	        if (!$.isFunction(success)) dataType = success, success = undefined
	        return {
	            url: url
	            , data: data
	            , success: success
	            , dataType: dataType
	        }
	    }

	    $.get = function(/* url, data, success, dataType */){
	        return $.ajax(parseArguments.apply(null, arguments))
	    }

	    $.post = function(/* url, data, success, dataType */){
	        var options = parseArguments.apply(null, arguments)
	        options.type = 'POST'
	        return $.ajax(options)
	    }

	    $.getJSON = function(/* url, data, success */){
	        var options = parseArguments.apply(null, arguments)
	        options.dataType = 'json'
	        return $.ajax(options)
	    }

	    $.fn.load = function(url, data, success){
	        if (!this.length) return this
	        var self = this, parts = url.split(/\s/), selector,
	            options = parseArguments(url, data, success),
	            callback = options.success
	        if (parts.length > 1) options.url = parts[0], selector = parts[1]
	        options.success = function(response){
	            self.html(selector ?
	                $('<div>').html(response.replace(rscript, "")).find(selector)
	                : response)
	            callback && callback.apply(self, arguments)
	        }
	        $.ajax(options)
	        return this
	    }

	    var escape = encodeURIComponent

	    function serialize(params, obj, traditional, scope){
	        var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
	        $.each(obj, function(key, value) {
	            type = $.type(value)
	            if (scope) key = traditional ? scope :
	            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
	            // handle data in serializeArray() format
	            if (!scope && array) params.add(value.name, value.value)
	            // recurse into nested objects
	            else if (type == "array" || (!traditional && type == "object"))
	                serialize(params, value, traditional, key)
	            else params.add(key, value)
	        })
	    }

	    $.param = function(obj, traditional){
	        var params = []
	        params.add = function(key, value) {
	            if ($.isFunction(value)) value = value()
	            if (value == null) value = ""
	            this.push(escape(key) + '=' + escape(value))
	        }
	        serialize(params, obj, traditional)
	        return params.join('&').replace(/%20/g, '+')
	    }
	})(Zepto)

	;(function($){
	    $.fn.serializeArray = function() {
	        var name, type, result = [],
	            add = function(value) {
	                if (value.forEach) return value.forEach(add)
	                result.push({ name: name, value: value })
	            }
	        if (this[0]) $.each(this[0].elements, function(_, field){
	            type = field.type, name = field.name
	            if (name && field.nodeName.toLowerCase() != 'fieldset' &&
	                !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
	                ((type != 'radio' && type != 'checkbox') || field.checked))
	                add($(field).val())
	        })
	        return result
	    }

	    $.fn.serialize = function(){
	        var result = []
	        this.serializeArray().forEach(function(elm){
	            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
	        })
	        return result.join('&')
	    }

	    $.fn.submit = function(callback) {
	        if (0 in arguments) this.bind('submit', callback)
	        else if (this.length) {
	            var event = $.Event('submit')
	            this.eq(0).trigger(event)
	            if (!event.isDefaultPrevented()) this.get(0).submit()
	        }
	        return this
	    }

	})(Zepto)

	;(function($){
	    // __proto__ doesn't exist on IE<11, so redefine
	    // the Z function to use object extension instead
	    if (!('__proto__' in {})) {
	        $.extend($.zepto, {
	            Z: function(dom, selector){
	                dom = dom || []
	                $.extend(dom, $.fn)
	                dom.selector = selector || ''
	                dom.__Z = true
	                return dom
	            },
	            // this is a kludge but works
	            isZ: function(object){
	                return $.type(object) === 'array' && '__Z' in object
	            }
	        })
	    }

	    // getComputedStyle shouldn't freak out when called
	    // without a valid element as argument
	    try {
	        getComputedStyle(undefined)
	    } catch(e) {
	        var nativeGetComputedStyle = getComputedStyle;
	        window.getComputedStyle = function(element){
	            try {
	                return nativeGetComputedStyle(element)
	            } catch(e) {
	                return null
	            }
	        }
	    }
	})(Zepto)

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by Wangxin on 2016/5/19.
	 */

	var AllData={
	    status:{
	        trafficTemp:0,/*精确到分*/
	        trafficLoad:0/*精确到秒*/
	    },
	    loadStatus:{
	        currLinesInfo:0,
	        trafficInfo:0
	    },
	    statusColor: [
	        {
	            "color": "00cc33",
	            "instruction": "舒适"
	        },
	        {
	            "color": "EFEA3A",
	            "instruction": "较拥挤"
	        },
	        {
	            "color": "E71F1A",
	            "instruction": "拥挤"
	        },
	        {
	            "color": "1D1D1D",
	            "instruction": "极拥挤"
	        }
	    ],
	    refreshStatus:{},
	    cache: {
	        currLines:{},
	        citylist: [],
	        citylistByAdcode: null,
	        curCity: {
	            adcode: null,
	            name: null
	        },
	        dataForDrw: {},
	        cities: {},
	        lines: {},
	        stations: {},
	        sug: {},
	        stationsInfo: {},
	        trafficNew:[],
	        trafficInfo:[],
	        convertData:{},
	        tempTrafficinfo:[],
	        stationspoi: {},
	        offset: {},
	        navlines: {},
	        navStations: {},
	        navStPixel: {}
	    },
	    timer:{},
	    subwayFlag: 1, // 0 没有 , 1 有
	    param: null,
	    nearlnglat: null,
	    datas: [],
	    info_datas: [],
	    // 从adcode前四位读取文件名称
	    fileNameData: {
	        '1100': 'beijing'
	    },
	    cityname: {
	        '1100': '\u5317\u4eac'
	    },
	    cityListData: [
	        {
	            adcode: '1100',
	            spell: 'beijing',
	            cityname: '北京'
	        }
	    ],
	    ns_svg: "http://www.w3.org/2000/svg",
	    //=====tip===========
	    svgReady:false,
	    isNearTip: false,
	    w: document.documentElement.clientWidth,
	    h: document.documentElement.clientHeight,
	    //=====drwSw=========
	    /*站点名称的位置*/
	    //label_angle: {
	    //    '0': [0, -1],
	    //    '1': [1, -1],
	    //    '2': [1, 0],
	    //    '3': [1, 1],
	    //    '4': [0, 1],
	    //    '5': [-1, 1],
	    //    '6': [-1, 0],
	    //    '7': [-1, -1]
	    //},
	    //curOffset: {},
	};
	module.exports=AllData;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */

	var $=__webpack_require__(4);
	var AllData=__webpack_require__(5);
	var SW=__webpack_require__(2);
	var Drwlines=__webpack_require__(7);
	var DrwTraf=__webpack_require__(8);


	var drwSw = {
	    currLines: {},
	    t_top: 0,
	    t_left: 0,
	    moveX: 0,
	    moveY: 0,
	    font_size: 12,
	    specailPhone: false,
	    sortline: null,
	    nearId: null,
	    svgOffset: {
	        left: 0,
	        top: 0
	    },
	    w: AllData.w,
	    h: AllData.h,
	    isNearTip: AllData.isNearTip,
	    svgReady: AllData.svgReady,
	    defaultColor:AllData.statusColor[0].color,
	    ns_svg: AllData.ns_svg,
	    statusColor:AllData.statusColor,
	    trafficInfo:AllData.cache.trafficInfo,
	    stations:AllData.cache.stations,
	    convertData:AllData.cache.convertData,
	    stationsInfo: AllData.cache.stationsInfo, /*几个数据接口*/

	    isSpecailPhone: function() {
	        var self = this;
	        var ua = navigator.userAgent.toLowerCase();
	    },
	    draw: function(drwData, param) {
	        $('#subway-svg').remove();
	        this.currLines = {};
	        if(!this.svgReady){
	            this.initDraw(drwData, param);
	        }
	    },
	    //初始化画图数据;
	    initDraw: function(drwData, param) {
	        var self = this;
	        self.t_left = 0;
	        self.t_top = 0;
	        var screenX = parseInt(self.w / 2),
	            screenY = parseInt(self.h / 2),
	            originX,
	            originY,
	            ox,
	            oy,
	            lightStation = {},
	            adcode = drwData.id,
	            detail = param.detail;
	        if (detail == 'true') {
	            var detailStation = self.getDetailStation(drwData, param);
	            lightStation.id = detailStation;
	            lightStation.detail = true;
	            if (detailStation) {
	                var offset = AllData.cache.stations[detailStation].p;
	                ox = parseInt(offset.split(' ')[0]);
	                oy = parseInt(offset.split(' ')[1]);
	            } else {
	                ox = AllData.cache.curCity.offset.x;
	                oy = AllData.cache.curCity.offset.y;
	            }
	        }
	        else {
	            //'4401':广州
	            //'2102':大连
	            //'3205':苏州
	            var nearStation = self.getNearStation(drwData, param);
	            lightStation.id = nearStation;
	            lightStation.detail = false;
	            self.nearId = nearStation;
	            if (nearStation) {
	                var offset = AllData.cache.stations[nearStation].p;
	                ox = parseInt(offset.split(' ')[0]);
	                oy = parseInt(offset.split(' ')[1]);
	            }
	            else {
	                ox = AllData.cache.curCity.offset.x;
	                oy = AllData.cache.curCity.offset.y;
	            }
	        }
	        originX = ox;
	        originY = oy;
	        var moveX = Number(screenX) - Number(originX);
	        var moveY = Number(screenY) - Number(originY);
	        drwSw.moveX = moveX;
	        drwSw.moveY = moveY;

	        self.deletInProgress(drwData);
	        self.drawSvgSubway(drwData, lightStation, param);
	    },
	    //初始化currLines数据
	    deletInProgress: function(drwData) {
	        var self = this;
	        var j = 0;
	        for (var i = 0; i < drwData.lines.length; i++) {
	            if (drwData.lines[i].su != "3") {
	                self.currLines[drwData.lines[i].ls] = drwData.lines[i];
	            }
	        }
	    },
	    drawSvgSubway: function(drwData, station, param) {
	        var self = this;
	        $('#subwayCanvas').css('display', 'none');
	        $('.station-out-box').css('display', 'none');
	        $('#subwaySvg').css('display', 'block');
	        var adcode = drwData.id;
	        self.drwSwBox(drwData);
	        setTimeout(function() {
	            self.drawSvg(drwData, station, param);
	            self.svgReady = true;
	        }, 10)
	    },
	    drwSwBox: function(drwData) {
	        var self = this;
	        var subway_svg = document.getElementById("subwaySvg");
	        var subway_content = document.createElementNS(self.ns_svg, 'svg');
	        subway_content.setAttribute("class", "subway-content");
	        subway_content.setAttribute("id", "subway-svg");
	        subway_content.setAttribute("adcode", drwData.id);
	        subway_content.style.width = "2000px";
	        subway_content.style.height = "2000px";
	        subway_content.setAttribute('width', "2000px");
	        subway_content.setAttribute('height', "2000px");
	        subway_svg.appendChild(subway_content);
	        var subway_box = document.createElementNS(self.ns_svg, 'g');
	        var svg_g = document.createElementNS(self.ns_svg, 'g');
	        setTimeout(function() {
	            var svgW = $('#subway-svg').offset().width;
	            subway_content.style.left = -1000 + self.w / 2 + "px";
	            subway_content.style.top = -1000 + self.h / 2 + "px";
	            self.svgOffset.left = -1000 + self.w / 2;
	            self.svgOffset.top = -1000 + self.h / 2;
	            subway_box.setAttribute("id", "subway-box");
	            subway_content.appendChild(subway_box);
	            svg_g.setAttribute("id", "svg-g");
	            var top, left;
	            top = self.t_top;
	            left = self.t_left;
	            svg_g.setAttribute("transform", "translate(0,0) scale(1)");
	            subway_box.appendChild(svg_g);
	            // }
	        }, 0)
	    },
	    //地铁线按顺序排序
	    lineSort: function() {
	        var self = this;
	        self.sortline = [];
	        var id;
	        for (id in self.currLines) {
	            var index = parseInt(self.currLines[id].x);
	            var line_id = self.currLines[id].ls;
	            self.sortline[index - 1] = line_id;
	        }
	    },
	    addCaption: function(drwData) {
	        var self = this;
	        var subway_caption = $('#subway-caption');
	        for (var i = 0; i < self.sortline.length; i++) {
	            var caption_item = $('<div class="line-caption"></div>');
	            var la = AllData.cache.lines[self.sortline[i]].la;
	            var html = '';
	            if (!la || la == '') {
	                html = AllData.cache.lines[self.sortline[i]].ln;
	            } else {
	                html = AllData.cache.lines[self.sortline[i]].ln + '<div class="caption_la">( ' + AllData.cache.lines[self.sortline[i]].la + ' )</div>'
	            }
	            caption_item.html(html);
	            caption_item.attr('id', 'caption-' + self.sortline[i]);
	            caption_item.attr('lineid', self.sortline[i]);
	            caption_item.css('background', '#' + AllData.cache.lines[self.sortline[i]].cl);
	            subway_caption.append(caption_item);
	        }
	    },
	    //画图
	    drawSvg: function(drwData, station, param) {
	        var self = this;
	        var status = 'normal';
	        self.lineSort();
	        self.drwSwLines(self.currLines, status);
	        DrwTraf.drwTrafficLinesDefer(self.currLines, status);
	        self.drwSwStations(drwData, status, station);
	        self.drwSwStationsName(drwData, status, 10, 20); //缩小为0.5，第二个参数为24
	        self.drwSwLinesName(drwData, status);
	        self.drawBg(self.currLines);
	        self.addFilter(self.currLines);
	        self.addHelp();
	        var nearObj = $('.near-station');
	        if (nearObj.length > 0) {
	            var center = tip.getStCenter(nearObj);
	            tip.setCenter(center);
	        }
	    },
	    //绘制背景
	    drawBg: function() {
	        var self = this;
	        var svg_g = document.getElementById("svg-g");
	        var subway_bg = document.createElementNS(self.ns_svg, 'g');
	        subway_bg.setAttribute("id", "g-bg");
	        svg_g.appendChild(subway_bg);
	        var bg_rect = document.createElementNS(self.ns_svg, 'rect');
	        bg_rect.setAttribute('id', 'select_bg');
	        bg_rect.setAttribute('x', 0);
	        bg_rect.setAttribute('y', 0);
	        bg_rect.setAttribute('width', 2000);
	        bg_rect.setAttribute('height', 2000);
	        subway_bg.appendChild(bg_rect);
	    },
	    // 绘制默认的地铁线路
	    drwSwLines: function(drwData, status) {
	        var self = this;
	        var svg_g = document.getElementById("svg-g");
	        var subway_line = document.createElementNS(self.ns_svg, 'g');
	        subway_line.setAttribute("id", "g-line-" + status);
	        if (status == 'normal') {
	            svg_g.appendChild(subway_line);
	            //console.log("开始画主路");
	            //console.log(drwData);
	            for (var line_id in drwData) {
	                var current_drwData = drwData[line_id];
	                /*打印地铁线名称*/
	                //console.log("======##################=======" + drwData[line_id].ln + "=========############=====");
	                //画双线
	                Drwlines.drwDouble(subway_line,current_drwData);
	            }
	            $("#refresh_content").show();
	            $(".filter_btn").show();
	            $(".help_btn").show();
	            console.log("主路画完！");
	        } else if (status == 'select') {
	            var svg_select = document.getElementById("g-select");
	            svg_select.appendChild(subway_line);
	            Drwlines.drwDouble(subway_line, drwData);
	        }
	    },
	    //绘制地铁线路名
	    drwSwLinesName: function(drwData, status) {
	        var self = this;
	        var data = drwData.linesNamePos;
	        var svg_g = document.getElementById("svg-g");
	        var subway_line_name = document.createElementNS(self.ns_svg, 'g');
	        subway_line_name.setAttribute("id", "g-line-name");
	        if (status == 'normal') {
	            svg_g.appendChild(subway_line_name);
	        } else if (status == 'select') {
	            var svg_select = document.getElementById("g-select");
	            svg_select.appendChild(subway_line_name);
	        }
	        for (var id in data) {
	            if (data[id] != null) {
	                for (var i = 0; i < data[id].length; i++) {
	                    var line_name = AllData.cache.lines[id].ln;
	                    var line_name_w = line_name.length * self.font_size + 6;
	                    var line_name_h = 20;
	                    var line_color = AllData.cache.lines[id].cl;
	                    var line_name_x = parseInt(data[id][i].split(" ")[0]);
	                    var line_name_y = parseInt(data[id][i].split(" ")[1]) - 15;
	                    var _line_name = document.getElementById("g-line-name");
	                    var line_name_g = document.createElementNS(self.ns_svg, 'g');
	                    line_name_g.setAttribute('transform', 'translate(' + line_name_x + ',' + line_name_y + ')');
	                    line_name_g.setAttribute('class', 'line_name');
	                    line_name_g.setAttribute("lineid", id);
	                    var line_namr_bg = document.createElementNS(self.ns_svg, 'rect');
	                    line_namr_bg.setAttribute("rx", 3);
	                    line_namr_bg.setAttribute("ry", 3);
	                    line_namr_bg.setAttribute("width", line_name_w);
	                    line_namr_bg.setAttribute("height", line_name_h);
	                    line_namr_bg.setAttribute("fill", "#" + line_color);
	                    line_name_g.appendChild(line_namr_bg);
	                    var line_name_text = document.createElementNS(self.ns_svg, 'text');
	                    line_name_text.setAttribute("class", "line_name_txt");
	                    line_name_text.setAttribute("lineid", id);
	                    line_name_text.setAttribute("height", 20);
	                    line_name_text.setAttribute("x", line_name_w / 2);
	                    line_name_text.setAttribute("y", line_name_h / 2);
	                    line_name_text.setAttribute("dy", 4);
	                    line_name_text.setAttribute("fill", "#fff");
	                    line_name_text.setAttribute("text-anchor", "middle");
	                    line_name_text.textContent = line_name;
	                    line_name_g.appendChild(line_name_text);
	                    subway_line_name.appendChild(line_name_g);
	                }
	            }
	        }
	    },
	    // 绘制地铁站点，并设置站点的属性。
	    drwSwStations: function(drwData, status, lightstation) {
	        var self = this;
	        var svg_g = document.getElementById("svg-g");
	        var subway_station_g = document.createElementNS(self.ns_svg, 'g');
	        subway_station_g.setAttribute("id", "g-station-" + status);
	        if (status == 'normal') {
	            svg_g.appendChild(subway_station_g);
	        } else if (status == 'select') {
	            var svg_select = document.getElementById("g-select");
	            svg_select.appendChild(subway_station_g);
	        } else if (status == 'nav') {
	            var svg_nav = document.getElementById("g-nav");
	            svg_nav.appendChild(subway_station_g);
	        }

	        var station = drwData.stations || drwData.st;

	        $.each(station, function (idx, item) {
	            //如果是可以显示的车站
	            if (item.su == "1") {
	                var subway_circle_g = document.createElementNS(self.ns_svg, 'g');
	                subway_circle_g.setAttribute("id", "g-" + item.si);
	                subway_circle_g.setAttribute("class", "g-station");
	                subway_station_g.appendChild(subway_circle_g);

	                //如果不是换乘车站,画圆圈
	                if (item.t == "0") {
	                    var subway_station = document.createElementNS(self.ns_svg, 'circle');
	                    subway_station.setAttribute("cx", parseInt(item.p.split(" ")[0]));
	                    subway_station.setAttribute("cy", parseInt(item.p.split(" ")[1]));
	                    subway_station.setAttribute("r", 5);
	                    subway_station.setAttribute("fill", "#FFF");
	                    subway_station.setAttribute("stroke-width", 2);
	                    subway_station.setAttribute("stroke", "#"+"7D7E7E");/*画对应地铁线的颜色 item.cl , #7D7E7E是换乘站的外圈颜色*/
	                    subway_circle_g.appendChild(subway_station);
	                }
	                //如果是换乘车站
	                else if ((item.t == "1")) {
	                    var subway_station_transfer = document.createElementNS(self.ns_svg, 'image');
	                    if(item.si=="11000150" || item.si=="11000149"){
	                        //大型换乘车站
	                        subway_station_transfer.setAttribute("x", parseInt(item.p.split(" ")[0]) - 11);
	                        subway_station_transfer.setAttribute("y", parseInt(item.p.split(" ")[1]) - 11);
	                        subway_station_transfer.setAttribute("width", 22);
	                        subway_station_transfer.setAttribute("height", 22);
	                    }else{
	                        subway_station_transfer.setAttribute("x", parseInt(item.p.split(" ")[0]) - 9);
	                        subway_station_transfer.setAttribute("y", parseInt(item.p.split(" ")[1]) - 9);
	                        subway_station_transfer.setAttribute("width", 18);
	                        subway_station_transfer.setAttribute("height", 18);
	                    }
	                    subway_station_transfer.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "./img/subway/transfer-station.png");
	                    subway_circle_g.appendChild(subway_station_transfer);
	                }
	                //高亮显示站点
	                var lightId = lightstation && lightstation.id;
	                if (lightId) {
	                    if (item.si == lightId) {
	                        console.log(item.si);
	                        var data = AllData.cache.stations[lightId];
	                        var subway_station = document.createElementNS(self.ns_svg, 'circle');
	                        subway_station.setAttribute("id", "near-" + lightId);
	                        subway_station.setAttribute("class", "near-station");
	                        subway_station.setAttribute("cx", parseInt(data.p.split(" ")[0]));
	                        subway_station.setAttribute("cy", parseInt(data.p.split(" ")[1]));
	                        subway_station.setAttribute("r", 14);
	                        subway_station.setAttribute("fill", "#007aff");
	                        subway_station.setAttribute("fill-opacity", 0.4);
	                        subway_circle_g.appendChild(subway_station);
	                        if (!lightstation.detail) {
	                            if (!($("#tip-content").length > 0)) {
	                                self.nearTip(lightId);
	                                $("#tip-content").addClass("open");
	                            }
	                        }
	                    }
	                } else {
	                    self.clearNearTip();
	                }
	                var subway_station_out = document.createElementNS(self.ns_svg, 'circle');
	                subway_station_out.setAttribute("id", 'st-' + item.si);
	                subway_station_out.setAttribute("class", 'station_obj');
	                subway_station_out.setAttribute("cx", parseInt(item.p.split(" ")[0]));
	                subway_station_out.setAttribute("cy", parseInt(item.p.split(" ")[1]));
	                subway_station_out.setAttribute("station_id", item.si);
	                subway_station_out.setAttribute("station_name", item.n);
	                subway_station_out.setAttribute("station_poiid", item.poiid);
	                subway_station_out.setAttribute("station_lon", item.sl.split(',')[0]);
	                subway_station_out.setAttribute("station_lat", item.sl.split(',')[1]);
	                subway_station_out.setAttribute("r", 13);
	                subway_station_out.setAttribute("fill", "#FFF");
	                subway_station_out.setAttribute("fill-opacity", "0");
	                subway_circle_g.appendChild(subway_station_out);
	                //遍历换乘点
	                var line_id=[];
	                for(var i=0;i<item.r.split("|").length;i++){
	                    line_id.push(item.r.split("|")[i]);
	                }
	                subway_station_out.setAttribute("line_id", line_id);
	            }
	        })
	    },
	    // 绘制地铁站点名称
	    drwSwStationsName: function(drwData, status, fontSize, h) {
	        var self = this;
	        var data = drwData.stations || drwData.st || drwData;
	        var svg_g = document.getElementById("svg-g");
	        var subway_station_name_g = document.createElementNS(self.ns_svg, 'g');
	        subway_station_name_g.setAttribute("id", "g-station-name-" + status);
	        if (status == 'normal') {
	            svg_g.appendChild(subway_station_name_g);
	        } else if (status == 'select') {
	            var svg_select = document.getElementById("g-select");
	            svg_select.appendChild(subway_station_name_g);
	        } else if (status == 'nav') {
	            var svg_nav = document.getElementById("g-nav");
	            svg_nav.appendChild(subway_station_name_g);
	        }
	        var subway_station_name = document.createElementNS(self.ns_svg, 'g');
	        subway_station_name.setAttribute("id", "g-name");
	        subway_station_name_g.appendChild(subway_station_name);

	        $.each(data ,function (idx, item) {
	            if (item.su == "1") {
	                if (item.t != "2") {
	                    var station_name = document.createElementNS(self.ns_svg, 'text');
	                    station_name.style.fontSize = fontSize + "px";
	                    station_name.setAttribute("id", "name-" + item.si);
	                    station_name.setAttribute("name", item.n);
	                    station_name.textContent = item.n;
	                    var direct = item.lg,
	                        text_anchor, x, y;
	                    if (direct == "0" || direct == "4") {
	                        text_anchor = "middle";
	                    } else {
	                        text_anchor = "left";
	                    }
	                    station_name.setAttribute("text-anchor", text_anchor);
	                    if (direct == "0" || direct == "4") {
	                        x = parseInt(item.p.split(" ")[0]);
	                    } else if (direct == "5" || direct == "6" || direct == "7") {
	                        x = parseInt(item.p.split(" ")[0]) - item.n.length * fontSize - 10;
	                    } else if (direct == "1" || direct == "2" || direct == "3") {
	                        x = parseInt(item.p.split(" ")[0]) + 10;
	                    }
	                    if (direct == "2" || direct == "6") {
	                        y = parseInt(item.p.split(" ")[1]) + 5;
	                    } else if (direct == "0" || direct == "1" || direct == "7") {
	                        y = parseInt(item.p.split(" ")[1]) - 10;
	                    } else if (direct == "3" || direct == "4" || direct == "5") {
	                        y = parseInt(item.p.split(" ")[1]) + h; //缩小为最小级别是为30，其他为20
	                    }
	                    station_name.setAttribute("x", x);
	                    station_name.setAttribute("y", y);
	                    subway_station_name.appendChild(station_name);
	                }
	            }
	        })
	    },
	    //动态展示选择器内的内容
	    addFilter: function(drwData) {
	        var self = this;
	        var subway_caption = $('.fliter_detail');
	        subway_caption.html(' ');
	        //增加“显示全部地铁的功能”
	        var firstHtml=[];
	        firstHtml.push("<li class='fliter_item' id='caption-allLines' lineid='caption-allLines' name='全部地铁'>");
	        //firstHtml.push("<span class='line_color' style='background:#000'></span>");
	        //firstHtml.push("<span class='line_name'>全部地铁线路</span>");
	        firstHtml.push("<span class='line_name' style='margin-left: 0'>全部地铁线路</span>");
	        firstHtml.push("</li>");
	        subway_caption.html(firstHtml.join(""));
	        //添加地铁
	        for (var i = 0; i < self.sortline.length; i++) {
	            //定义每个路线的展示内容
	            var caption_item = $('<li class="fliter_item"></li>');
	            //如果是最后一条路线
	            if (i == self.sortline.length - 1) {
	                caption_item = $('<li class="fliter_item fliter_item_last"></li>');
	            }
	            var la = AllData.cache.lines[self.sortline[i]].la;
	            var html = '',
	                line_name = '';
	            if (!la || la == '') {
	                line_name = AllData.cache.lines[self.sortline[i]].ln;
	            } else {
	                line_name = AllData.cache.lines[self.sortline[i]].ln + '<b class="line_name_la">( ' + AllData.cache.lines[self.sortline[i]].la + ' )</b>';
	            }
	            html = '<span class="line_color" style="background:#' + AllData.cache.lines[self.sortline[i]].cl + '"></span><span class="line_name">' + line_name + '</span>';
	            //html = "<span class='line_name'>" + line_name + "</span>";
	            caption_item.html(html);
	            caption_item.attr('id', 'caption-' + self.sortline[i]);
	            caption_item.attr('lineid', self.sortline[i]);
	            caption_item.attr('name', line_name.split("/")[0].toString().substr(0,4));
	            subway_caption.append(caption_item);
	        }

	        $('.filter_btn').show().css({
	            'z-index': '20'
	        });
	    },
	    addHelp: function () {
	        var self = this;
	        var help_content = $('.help_content');
	        //添加地铁
	        for (var i = 0; i < self.statusColor.length; i++) {
	            var help_item=$("<div class='help_item'></div>");
	            var html='';
	            html = '<span class="help_color" style="background:#'+self.statusColor[i].color+'"></span><span class="help_text"><span style="float: left">'+self.statusColor[i].instruction+'</span></span>';
	            help_item.html(html);
	            help_content.append(help_item);
	        }
	        var html_warning_item=$('<div class="help_item help_warning"></div>');
	        var html_warning='<span class="help_color_warning"></span> <span class="help_text"> <span style="float: left">限流站点</span> </span>';
	        html_warning_item.html(html_warning);
	        help_content.append(html_warning_item);
	    },
	    //离我最近Tip
	    nearTip: function(id) {
	        var self = this;
	        //生成窗体
	        var subway_box = $('.overlays');
	        var tip_w = 172,
	            tip_h = 73;
	        var obj = $("#near-" + id);
	        var obj_left = obj.offset().left,
	            obj_top = obj.offset().top;
	        var tip_left, tip_top;
	        var type = 't';
	        var tip_content = $('<div class="tip-near-content" id="tip-near-content"><div class="tip-near tip-' + type + '"><img class="near-img" width=100 src="./img/subway/near_' + type + '.png"/></div></div>');
	        subway_box.append(tip_content);
	        var $overlays = $('.overlays');
	        var overlaysLeft = parseInt($overlays.css('left')) || 0,
	            overlaysTop = parseInt($overlays.css('top')) || 0;

	        tip_left = obj_left + 28 * tip.allScale / 2 - overlaysLeft,
	            tip_top = obj_top - overlaysTop;

	        $('.tip-near-content').css({
	            top: tip_top + 'px',
	            left: tip_left + 'px'
	        });
	        self.isNearTip = true;
	    },
	    clearNearTip: function() {
	        var self = this;
	        var tip = $('.tip-content');
	        if (tip.length > 0) {
	            tip.remove();
	        }
	    },
	    //getDistance 获得两点的距离
	    getDistance: function(a, b) { //a是当前位置
	        var self = this;
	        var R = 6378137, // earth radius in meters
	            d2r = Math.PI / 180,
	            dLat = (b.lat - a.lat) * d2r,
	            dLon = (b.lng - a.lng) * d2r,
	            lat1 = a.lat * d2r,
	            lat2 = b.lat * d2r,
	            sin1 = Math.sin(dLat / 2),
	            sin2 = Math.sin(dLon / 2);
	        var c = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);
	        return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
	    },
	    toLnglat: function(param) {
	        var self = this;
	        if (!param) {
	            return false;
	        }
	        var tmp = param.split(',');
	        var lng = tmp[0];
	        var lat = tmp[1];

	        return {
	            lng: lng,
	            lat: lat
	        }
	    },
	    getDetailStation: function(drwData, param) {
	        var self = this,
	            poiid = param.poiid,
	            lnglat = param.lnglat,
	            station = AllData.cache.stationspoi[poiid];
	        if (station) {
	            return station.si;
	        } else {
	            return self.getNearStation(drwData, param);
	        }
	    },
	    getNearStation: function(drwData, param) {
	        var self = this;
	        var lnglat = param.lnglat;
	        var minDistance = -1,
	            curDistance = 0;
	        var stations = drwData.stations;
	        var curPos = self.toLnglat(lnglat),
	            stationPos;
	        var minId, curId;
	        $.each(stations, function (idx, item) {
	            stationPos = self.toLnglat(item.sl);
	            curId = item.si;
	            if (item.sl != '') {
	                curDistance = self.getDistance(curPos, stationPos);
	            } else {
	                curDistance = 100000
	            }
	            if (minDistance == -1 || curDistance < minDistance) {
	                minDistance = curDistance;
	                minId = curId;
	            }
	        });
	        if (minDistance < 10000) {
	            return minId;
	        } else {
	            return false;
	        }
	    },

	};

	module.exports=drwSw;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */

	var AllData=__webpack_require__(5);
	var drwSw=__webpack_require__(6);

	var Drwlines={
	    defaultColor:AllData.statusColor[0].color,
	    ns_svg: AllData.ns_svg,
	    //输入主路的路径点,以及偏移量——输出两条路径的路径点信息
	    doublePathInfo: function (mainPathData,offset) {

	        /*计算主路径的偏离角度*/
	        var p_a = [];
	        var p0 = {}, p1 = {};
	        //遍历mainPathData上所有的路径点
	        for (var Path_id in mainPathData) {
	            var point = mainPathData[Path_id].split(' ').join(',');
	            var p = {};
	            p.x = parseInt(point.split(",")[0]);
	            p.y = parseInt(point.split(",")[1]);
	            /*如果p1不存在,那就定义p为p1*/
	            if (!p1) {
	                p1 = p;
	                return;
	            }
	            p1._a = Math.atan2(p.y - p1.y, p.x - p1.x);
	            if (p0) {
	                p1.angle = Math.atan2(Math.sin(p0._a) + Math.sin(p1._a), Math.cos(p0._a) + Math.cos(p1._a));
	                p1.angle -= Math.PI / 2;
	                var theta = Math.abs(p1._a - p0._a);
	                if (theta > Math.PI) {
	                    theta = 2 * Math.PI - theta;
	                }
	                p1.inclinedAngle = Math.PI - theta;
	            } else {
	                p1.angle = p1._a - Math.PI / 2;
	            }
	            p0 = p1;
	            p1 = p;
	            p_a.push(p0._a);
	        }
	        //p1.angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI / 2;
	        p_a[0] = p_a[1];

	        //编译Right,Left数组
	        var info={};
	        var LeftPath = [], RightPath=[];
	        info.LeftPath=LeftPath;
	        info.RightPath=RightPath;
	        //遍历mainPathData上所有的路径点
	        for(var Path_id in mainPathData){
	            var point = mainPathData[Path_id].split(' ').join(',');
	            var p = {};
	            p.x = parseInt(point.split(",")[0]);
	            p.y = parseInt(point.split(",")[1]);


	            //计算偏移量
	            var _p_a=parseInt(p_a[Path_id]*100000000);
	            var Xoffset="", Yoffset="";
	            if(_p_a==0 || _p_a==314159265 || _p_a==-157079632 || _p_a==157079632){
	                //直角或者平角的情况
	                Xoffset=parseInt(offset*Math.cos(Math.PI/2-p_a[Path_id]))/10;
	                Yoffset=parseInt(offset*Math.sin(Math.PI/2+p_a[Path_id]))/10;
	            }else{
	                //其他角度的情况
	                Xoffset=parseInt((offset+2)*Math.cos(Math.PI/2-p_a[Path_id]))/10;
	                Yoffset=parseInt((offset+2)*Math.sin(Math.PI/2+p_a[Path_id]))/10;
	            }

	            //左偏移
	            var LeftX=p.x+Xoffset;
	            var LeftY=p.y-Yoffset;
	            LeftPath.push(LeftX+" "+LeftY);
	            //右偏移
	            var RightX= p.x-Xoffset;
	            var RightY=p.y+Yoffset;
	            RightPath.push(RightX+" "+RightY);
	        }
	        return info;
	    },
	    drwDouble: function (parentNode,drwData) {
	        //画双线
	        var self=this;
	        var dataset_line_arr=drwData.c;
	        var station = drwData.st;
	        var start = station[0].n,
	            end = station[station.length - 1].n;
	        var Left = {}, Right = {};
	        //console.log(dataset_line_arr);
	        //获取到两条路径信息，分路径信息
	        Left.path = self.doublePathInfo(dataset_line_arr, 26).LeftPath;
	        Right.path = self.doublePathInfo(dataset_line_arr, 26).RightPath;

	        //获取左右两条线的颜色,若是地铁线颜色:current_drwData.cl;
	        Left.color = self.defaultColor;
	        Right.color = self.defaultColor;

	        //确定两条线的终点信息
	        Left.direction = end+"-to-"+start;
	        Right.direction = start+"-to-"+end;

	        //确定所属线段的line_id
	        Left.reflineName = drwData.ln;
	        Right.reflineName = drwData.ln;

	        var lineId=drwData.ls;
	        //区分机场线
	        if(lineId=="110005"){
	            self.drwlines(parentNode, Right, drwData);
	        }else{
	            self.drwlines(parentNode, Left, drwData);
	            self.drwlines(parentNode, Right, drwData);
	        }
	    },
	    //画单线:输入:挂载节点,路径的名称,地铁线的id/name数据,输出:单条地铁线
	    drwlines: function (parentNode,pathName,LineId_Data) {
	        var self=this;
	        var onepath=pathName.path;
	        var	direction=pathName.direction;
	        var node_first = 'M' + onepath[0].split(' ').join(',');
	        var path = node_first + 'L' + onepath.join('L');
	        var line_path = document.createElementNS(this.ns_svg, 'path');
	        //line_path.setAttribute("id", "line-"+ LineId_Data.ls+"-"+ direction);
	        line_path.setAttribute("name", "line-"+ pathName.reflineName +"-"+ direction);
	        var color={};
	        //如果提供了强制的数据颜色,那就使用提供的颜色,否则就画定义好的颜色
	        if(pathName.color){
	            color=pathName.color;
	        }else{
	            color=Drwlines.defaultColor;/*如果感应器没有数据,就画默认颜色*/
	            //color=LineId_Data.cl;
	        }
	        var loadRate="";
	        if(pathName.loadRate){
	            loadRate=pathName.loadRate
	        }else{
	            loadRate="No Data!"
	        }
	        line_path.setAttribute("stroke", "#" + color);
	        line_path.setAttribute("d", path);
	        line_path.setAttribute("loadRate", loadRate);
	        parentNode.appendChild(line_path);
	    }
	};

	module.exports=Drwlines;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */

	__webpack_require__(3);
	var AllData=__webpack_require__(5);
	var drwSw=__webpack_require__(6);
	var Drwlines=__webpack_require__(7);
	var tip=__webpack_require__(9);

	var DrwTraf = {
	    timer:null,
	    trafficInfo:[],
	    refreshStatus:"",
	    statusColor: AllData.statusColor,
	    ns_svg: AllData.ns_svg,
	    //请求交通状况信息
	    loadTraffic: function (city_code,city_name,callback){
	        AllData.loadStatus.trafficInfo = 0;
	        var self=this;
	        var trafficData_Url="http://223.72.210.20:8388/PublicTripProvide/LoadAfcJtlDataJson?ask=t8ai8t4s3acb1ce";
	        //var trafficData_Url="data/" + city_code + "_trafficinfo_" + city_name + ".json";
	        amapCache.loadData(trafficData_Url, function(trafficData) {
	            //编译最原始的trafficInfo
	            //console.log(trafficData);
	            //先清空，再遍历！
	            AllData.cache.trafficInfo=[];
	            AllData.refreshStatus="";
	            var len=trafficData.jtlList.length;
	            for (var k = 0; k < len; k++) {
	                var info={};
	                var flashCode=trafficData.jtlList[k].flashCode;
	                var start=flashCode.slice(3).split("_")[0];
	                var end=flashCode.slice(3).split("_")[1].slice(0,9);
	                var loadRate=trafficData.jtlList[k].loadData;
	                var refreshTime=trafficData.jtlList[k].startTime;
	                info.startAcc=start;
	                info.endAcc=end;
	                info.loadRate=loadRate;
	                info.refreshTime=refreshTime;
	                info.Acc2Acc=flashCode.slice(3,22);
	                if (loadRate >= 0 && loadRate <= 0.6) {
	                    info.rateColor = AllData.statusColor[0].color;
	                } else if (loadRate > 0.6 && loadRate <= 0.9) {
	                    info.rateColor = AllData.statusColor[1].color;
	                } else if (loadRate > 0.9 && loadRate <= 1.1) {
	                    info.rateColor = AllData.statusColor[2].color;
	                } else if (loadRate > 1.1){
	                    info.rateColor = AllData.statusColor[3].color;
	                } else {
	                    info.rateColor = "CCCCCC";
	                }
	                AllData.cache.trafficInfo.push(info);
	            }
	            //显示为publishTime
	            //var publishTime=[];
	            //publishTime[0]=trafficData.publishTime.slice(0,4);
	            //publishTime[1]=trafficData.publishTime.slice(4,6);
	            //publishTime[2]=trafficData.publishTime.slice(6,8);
	            //publishTime[3]=trafficData.publishTime.slice(8,10);
	            //publishTime[4]=trafficData.publishTime.slice(10,12);
	            //publishTime[5]=trafficData.publishTime.slice(12,14);
	            //var pubTime=publishTime[0]+"-"+publishTime[1]+"-"+publishTime[2]+' '+publishTime[3]+":"+publishTime[4]+":"+publishTime[5];
	            AllData.loadStatus.trafficInfo=1;
	            console.log("路况信息请求完成!");
	            AllData.refreshStatus=self.formatTime(AllData.cache.trafficInfo[0].refreshTime).trafficLoad;
	            //callback();
	            //console.log(AllData.refreshStatus);
	            //console.log("AllData.cache.trafficInfo",AllData.cache.trafficInfo);
	        },function() {
	            AllData.loadStatus.trafficInfo=2;
	            //延迟弹窗
	            tip.loadingOver();
	            setTimeout(function () {
	                tip.refreshError();
	            },1000);
	        });
	    },
	    addTrafficInfo: function (city_code) {
	        //这里依赖加载路况信息以及画图信息的加载状态
	        var self = this;
	        //console.log("请求到了路况信息,开始编译...");
	        var drwData = AllData.cache.cities[city_code];
	        for (var line_id in drwData.lines) {
	            for (var j in drwData.lines[line_id].st2st) {
	                for (var k in AllData.cache.trafficInfo) {
	                    if (AllData.cache.trafficInfo[k].Acc2Acc == drwData.lines[line_id].st2st[j].dA.slice(3)) {
	                        drwData.lines[line_id].st2st[j].loadRate = AllData.cache.trafficInfo[k].loadRate;
	                        drwData.lines[line_id].st2st[j].refreshTime = AllData.cache.trafficInfo[k].refreshTime;
	                        drwData.lines[line_id].st2st[j].rateColor = AllData.cache.trafficInfo[k].rateColor;
	                    }
	                }
	            }
	        }
	        console.log("路况信息编译成功！");
	        //console.log("addTrafficInfo",drwData);
	        //console.log("新的drwData",drwData);
	    },
	    drwTrafficLinesDefer: function (drwData, status) {
	        var self = this;
	        if (status == 'normal') {
	            clearTimeout(DrwTraf.timer);
	            //开一个定时器，检测画图和路况信息的加载状态
	            DrwTraf.timer = setTimeout(function () {
	                if (AllData.loadStatus.trafficInfo == 1 && AllData.loadStatus.currLinesInfo == 1) {
	                    //编译路况信息
	                    var city_code = AllData.cache.curCity.adcode;
	                    DrwTraf.addTrafficInfo(city_code);
	                    //console.log("add后",drwData);
	                    //开始画路况
	                    var svg_g = document.getElementById("svg-g");
	                    var st_normal = document.getElementById("g-station-normal");
	                    var traffic_line = document.createElementNS(self.ns_svg, 'g');
	                    traffic_line.setAttribute("id", "g-traffic-" + status);
	                    svg_g.insertBefore(traffic_line, st_normal);
	                    for (var line_id in drwData) {
	                        var current_drwData = drwData[line_id];
	                        self.drwTrafficFromSever(traffic_line, current_drwData);
	                    }
	                    console.log("路况信息已展示！");
	                    tip.refreshSuccess();
	                } else if (AllData.loadStatus.trafficInfo == 2 || AllData.loadStatus.currLinesInfo == 2) {
	                    clearTimeout(DrwTraf.timer);
	                } else {
	                    console.log("路况信息错误!", "traffic", AllData.loadStatus.trafficInfo, "currLines", AllData.loadStatus.currLinesInfo);
	                    DrwTraf.drwTrafficLinesDefer(drwData, status);
	                }
	            }, 10)
	        }else if (status == 'select') {
	            var st_select = document.getElementById("g-station-select");
	            var svg_select = document.getElementById("g-select");
	            var traffic_line = document.createElementNS(self.ns_svg, 'g');
	            traffic_line.setAttribute("id", "g-traffic-" + status);
	            svg_select.insertBefore(traffic_line, st_select);
	            self.drwTrafficFromSever(traffic_line, drwData);
	        }
	    },
	    //使用drw数据,需要提前编译好1100_drw_beijing.json文件(要在地铁全部在运营时,否则会缺数据)
	    drwTrafficFromSever: function (parentNode,LineId_Data) {
	        // 注意:当该线路已经停运,那么该线路将不会画出颜色来,就会显示出底色.
	        var Left={},Right={};
	        //console.log(LineId_Data);
	        for(var k in LineId_Data.st2st){
	            //console.log(LineId_Data.st2st[k],k);
	            if (LineId_Data.st2st[k].rd == "right") {
	                //console.log(LineId_Data.st2st[k],LineId_Data.st2st[k].dN,k);
	                var rightmain = LineId_Data.st2st[k].path;
	                var rightpath = Drwlines.doublePathInfo(rightmain, 26).RightPath;
	                var rightcolor = LineId_Data.st2st[k].rateColor;
	                Right.path = rightpath;
	                Right.color = "AF272B";
	                Right.color = rightcolor;/*注意停运时的颜色使用,停运时没有颜色值,没有颜色值就会在drwlines()中,使用line本身的颜色*/
	                Right.direction = LineId_Data.st2st[k].dN;
	                Right.loadRate = LineId_Data.st2st[k].loadRate;
	                Right.reflineName = LineId_Data.st2st[k].rln;
	                Drwlines.drwlines(parentNode, Right, LineId_Data);
	            }
	            if (LineId_Data.st2st[k].rd == "left") {
	                //console.log(LineId_Data.st2st[k],LineId_Data.st2st[k].dN,k);
	                var leftmain = LineId_Data.st2st[k].path;
	                var leftpath = Drwlines.doublePathInfo(leftmain, 26).LeftPath;
	                var leftcolor = LineId_Data.st2st[k].rateColor;
	                Left.path = leftpath;
	                Left.color = "C99616";
	                Left.color = leftcolor;/*注意停运时的颜色使用,停运时没有颜色值,没有颜色值就会在drwlines()中,使用line本身的颜色*/
	                Left.direction = LineId_Data.st2st[k].dN;
	                Left.loadRate = LineId_Data.st2st[k].loadRate;
	                Left.reflineName = LineId_Data.st2st[k].rln;
	                Drwlines.drwlines(parentNode, Left, LineId_Data);
	            }
	        }

	    },
	    //使用浏览器自行加工数据的方法,需打开addTrafficInfo(city_code);
	    //drwTrafficByUser: function (parentNode,LineId_Data) {
	    //    // 思路:从trafficData中获取lineid,stationname,
	    //    var self=this;
	    //    var Left={},Right={};
	    //    var line_id=LineId_Data.ls;
	    //    //console.log(self.trafficInfo);
	    //    for(var k in self.trafficInfo){
	    //        if (self.trafficInfo[k].reflineId == line_id) {
	    //            //console.log(self.trafficInfo[k],k);/*用来查看出问题的节点*/
	    //            if (self.trafficInfo[k].ref_direct == "right") {
	    //                var rightmain = self.trafficInfo[k].path;
	    //                var rightpath = self.doublePathInfo(rightmain, 3).RightPath;
	    //                var rightcolor = self.trafficInfo[k].color;
	    //                //console.log("right",rightpath,self.trafficInfo[k].startName+" to "+self.trafficInfo[k].endName);
	    //                Right.path = rightpath;
	    //                Right.color = "AF272B";
	    //                Right.color=rightcolor;
	    //                Right.direction = self.trafficInfo[k].direction;
	    //                Right.reflineName = self.trafficInfo[k].reflineName;
	    //                self.drwlines(parentNode, Right, LineId_Data);
	    //            }
	    //            if (self.trafficInfo[k].ref_direct == "left") {
	    //                var leftmain = self.trafficInfo[k].path;
	    //                var leftpath = self.doublePathInfo(leftmain, 3).LeftPath;
	    //                var leftcolor = self.trafficInfo[k].color;
	    //                Left.path = leftpath;
	    //                Left.color = "C99616";
	    //                Left.color=leftcolor;
	    //                Left.direction = self.trafficInfo[k].direction;
	    //                Left.reflineName = self.trafficInfo[k].reflineName;
	    //                //console.log("Left",leftpath,self.trafficInfo[k].startName+" to "+self.trafficInfo[k].endName);
	    //                self.drwlines(parentNode, Left, LineId_Data);
	    //            }
	    //        }
	    //    }
	    //
	    //},
	    formatTime:function(dateTime){
	        var timeInfo={};
	        var thedateTime = dateTime.replace(/-/g, "/");
	        var date = new Date(thedateTime).getTime();
	        var minute = 1000 * 60;
	        var hour = minute * 60;
	        var day = hour * 24;
	        //var halfamonth = day * 15;
	        //var month = day * 30;

	        //当前时间
	        var now = new Date().getTime();
	        var diffValue = now - date;
	        if (diffValue < 0) {
	            return false;
	        }
	        var dayC=diffValue/day;
	        var hourC = diffValue / hour;
	        var minC = diffValue / minute;

	        // 获取所给时间日期的 秒数
	        var oldData = dateTime.substr(0, 10).replace(/-/g, "/");
	        var oldDataSeconds = new Date(oldData).getTime();
	        // 获取当前日期的 秒数
	        var newtime = new Date();
	        var newYear = newtime.getFullYear();
	        var newMonth = newtime.getMonth() + 1;
	        var newData = newtime.getDate();
	        var today = newYear + "/" + newMonth + "/" + newData;
	        var todaySeconds = new Date(today).getTime();
	        // 计算日期的差值
	        var difference = todaySeconds - oldDataSeconds;
	        // 获取所给时间的 分时信息如 23:12
	        var TrafficInfoTime = dateTime.split(" ")[1].toString().substr(0, 8);
	        var TrafficTempTime = dateTime.split(" ")[1].toString().substr(0, 5);

	        //判断哪一天
	        var isToday1 = {},isToday2;
	        if (difference < 86400000 && difference >= 0) {
	            isToday1 = TrafficInfoTime;
	            isToday2 = TrafficTempTime;
	        } else if (difference == 86400000) {
	            isToday1 = TrafficInfoTime;
	            isToday2 = "昨天" + TrafficTempTime;
	        } else if (difference == 172800000) {
	            isToday1 = TrafficInfoTime;
	            isToday2 = "前天" + TrafficTempTime;
	        } else {
	            var dataArr = dateTime.split(" ")[0].toString().split("-");
	            isToday1 = dataArr[1] + "月" + dataArr[2] + "日";
	            isToday2 = dataArr[0] + "年" + dataArr[1] + "月" + dataArr[2] + "日";
	        }

	        timeInfo.trafficLoad=isToday1;
	        // 判断显示时间
	        if (dayC >= 1) {
	            result = "更新于" + parseInt(dayC) + "天前发布";
	        }
	        else if (hourC >= 1 && hourC < 24) {
	            result = "更新于" + parseInt(hourC) + "小时前发布";
	        }
	        else if (minC >= 30 && minC < 60) {
	            result = "更新于" + parseInt(minC) + "分钟前发布";
	        } else if (minC < 30 && minC > 0) {
	            result = "更新于"  + isToday2;
	        }
	        else
	            result = "刚刚";

	        timeInfo.trafficTemp=result;
	        return timeInfo;
	    }
	};

	module.exports=DrwTraf;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */
	var $ = __webpack_require__(4);
	var Hammer = __webpack_require__(10);

	var DrwTraf = __webpack_require__(8);
	var drwSw = __webpack_require__(6);
	var SW = __webpack_require__(2);
	var AllData = __webpack_require__(5);

	var getstureState = 0;
	var el = document.getElementById('drag_handle');
	el.style.transformOrigin = "top left";

	var debounceTransLabel = "debounce-transition",
	//缩放极限
	    MinScale = 0.35, MaxScale = 1.9,
	//单次缩放比例,单次的缩放比率范围超出缩放极限范围时，就会发生回弹！
	    MinTempScale = 0.25, MaxTempScale =2.2;



	var tip = {
	    refreshTimer: {},
	    refreshstate: 0,
	    station_w: 26,
	    touchStatus: null, //当前touch状态：drag, scale
	    curScale: 1, //当前缩放级别
	    allScale: 1,
	    dragObj: $("#subwaySvg"), //
	    svgOffset: {
	        left: 0,
	        top: 0
	    },
	    startOffset:{
	        left: 0,
	        top: 0
	    },
	    realCenter: {
	        x: $(window).width() / 2,
	        y: $(window).height() / 2
	    },
	    subwaySvg: document.getElementById("subway-svg"),
	    opentip: false,
	    transform: {
	        translate: {
	            x: 0,
	            y: 0
	        },
	        scale: 1
	    },
	    transformState: { //每次拖动结束后的transform值
	        translate: {
	            x: 0,
	            y: 0
	        },
	        scale: 1
	    },

	    debounceTransLabel:debounceTransLabel,
	    enableGesture : null,
	    //
	    transformOrigin: null,
	    routeState: false,
	    fromendState: false,
	    w: AllData.w,
	    h: AllData.h,
	    curCity: AllData.cache.curCity,
	    stationsInfo: AllData.cache.stationsInfo, /*几个数据接口*/
	    stations: AllData.cache.stations,
	    lines: AllData.cache.lines,
	    //pathData: null,
	    //初始化事件绑定信息

	    preventScrollBounce: function (eles) {
	        if (!eles.length && !eles.unshift) {
	            eles = [eles]
	        }

	        eles.forEach(function (el) {
	            new Hammer.Manager(el, {
	                recognizers: [
	                    [Hammer.Pinch, {
	                        direction: Hammer.DIRECTION_VERTICAL
	                    }],
	                    [Hammer.Swipe, {
	                        direction: Hammer.DIRECTION_VERTICAL
	                    }]
	                ]
	            })
	        })

	    },
	    refreshShow: function () {
	        $(".refresh_box").css("display", "block").addClass("refresh_box_show");
	        $(".refresh_time_text").css("display", "block").addClass("refresh_time_text_show");
	        tip.loadingOver();
	        //4秒后隐藏信息
	        clearTimeout(tip.refreshTimer);
	        tip.refreshTimer = setTimeout(function () {
	            $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
	            $(".refresh_box").removeClass("refresh_box_show").css("display", "none");
	            tip.refreshstate = 0;
	        }, 4000);
	    },
	    refreshSuccess: function () {
	        $('.refresh_time_text').html("更新于" + AllData.refreshStatus);
	        //去除刷新按钮转圈
	        var $refresh = $(".refresh_btn");
	        $refresh.removeClass("refresh_active");
	        tip.refreshstate = 1;
	        tip.refreshShow();
	    },
	    refreshError: function () {
	        var $refresh = $(".refresh_btn");
	        $refresh.removeClass("refresh_active");
	        $(".refresh_error").css("display", "block");
	        setTimeout(function () {
	            $(".refresh_error").css("display", "none");
	            tip.refreshstate = 0;
	        }, 1500);
	    },
	    stoprefresh: function () {
	        $(".refresh_btn").hide();
	        $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
	        $(".refresh_box").hide().removeClass("refresh_box_show").css("display", "none");
	    },
	    openhelpBox: function () {
	        $('.light_box').css('display', 'block');
	        var $helpContent = $(".help_content");
	        var width = parseInt($helpContent.css("width"));
	        var left = (tip.w - width) / 2 + "px";
	        $helpContent.css({"left": left});
	        $helpContent.css("display", "block");
	        $('.tip_wrap_out').hide();
	        $(".refresh_btn").hide();
	        $(".refresh_time").hide();
	    },
	    closehelpBox: function () {
	        $('.light_box').css('display', 'none');
	        $(".help_content").css("display", "none");
	    },
	    //拖动Svg
	    mcdragSvg: function (ev) {
	        var self = this;
	        // 降低渲染频率
	        if (self.transform.translate.x == ev.deltaX && self.transform.translate.y == ev.deltaY) {
	            return
	        }
	        self.transform.translate.x = ev.deltaX;
	        self.transform.translate.y = ev.deltaY;
	        self.handleUpdate();
	    },
	    //缩放
	    mcScaleSvg: function (ev) {
	        var self = this;
	        var scale;
	        var initScale = 1;
	        var center = ev.center; //{x:..,y:..}

	        if (ev.type == 'pinchstart') {
	            initScale = self.transform.scale || 1;
	        }
	        self.realCenter = {
	            'x': Number(center.x) - Number(self.svgOffset.left),
	            'y': Number(center.y) - Number(self.svgOffset.top)
	        };


	        var tmpscale = ev.scale;
	        tip.curScale = tmpscale;

	        //以下：超出缩放极限会有弹回效果
	        tmpscale = tmpscale > MaxTempScale ? MaxTempScale : tmpscale;
	        //tmpscale = tmpscale < MinTempScale ? MinTempScale : tmpscale;


	        //以下：超出缩放极限会禁止缩放
	        //tmpscale = self.transformState.scale * tmpscale > MaxTempScale ? MaxTempScale / self.transformState.scale : tmpscale;
	        tmpscale = self.transformState.scale * tmpscale < MinTempScale ? MinTempScale / self.transformState.scale : tmpscale;


	        scale = initScale * tmpscale;
	        // 渲染频率
	        if (self.transformOrigin == center && self.transform.scale == scale) {
	            return
	        }
	        self.transformOrigin = center;
	        self.transform.scale = scale;
	        self.handleUpdate();
	    },
	    //处理更新
	    handleUpdate: function () {
	        var self = this;
	        var value = [
	            'translate3d(' + self.transform.translate.x + 'px, ' + self.transform.translate.y + 'px, 0)',
	            'scale(' + self.transform.scale + ', ' + self.transform.scale + ')'
	        ];

	        value = value.join(" ");
	        var dragObj = document.querySelector("#drag_handle");

	        dragObj.style.webkitTransform = value;
	        dragObj.style.transform = value;

	        if (self.touchStatus == 'pinch') {
	            var originCenter = self.transformOrigin.x + 'px ' + self.transformOrigin.y + 'px';
	            dragObj.style.webkitTransformOrigin = originCenter;
	            dragObj.style.transformOrigin = originCenter;
	        }
	    },
	    //处理恢复默认
	    handleReset: function () {
	        var self = this;
	        self.transform.translate.x = 0;
	        self.transform.translate.y = 0;
	        self.transform.scale = 1;

	        self.handleUpdate();
	    },

	    svgUpdate1: function(a) {
	        var b = this
	            , c = $("#svg-g")
	            , d = c.offset()
	            , e = d && d.left
	            , f = d && d.top
	            , g = d && d.width
	            , h = d && d.height
	            , i = a.deltaX
	            , j = a.deltaY
	            , k = !0;


	        if (g > tip.w ? (Number(e) > Number(tip.w) / 2 || Math.abs(Number(e)) > Number(g - Number(tip.w) / 2)) && (Number(b.startOffset.left) > 0 ? k = !1 : g - Math.abs(Number(b.startOffset.left)) < Number(tip.w) / 2 ? k = !1 : (i = a.deltaX / 2,
	                $("#drag_handle").addClass(debounceTransLabel))) : (0 > e + g / 2 || e + g / 2 > tip.w) && (Number(b.startOffset.left) > 0 ? k = !1 : g - Math.abs(Number(b.startOffset.left)) < Number(tip.w) / 2 ? k = !1 : (i = a.deltaX / 2,
	                $("#drag_handle").addClass(debounceTransLabel))),

	                h > tip.h ? (Number(f) > Number(tip.h) / 2 || Math.abs(Number(f)) > Number(h - Number(tip.h) / 2)) && (Number(b.startOffset.top) > 0 ? k = !1 : h - Math.abs(Number(b.startOffset.top)) < Number(tip.h) / 2 ? k = !1 : (j = a.deltaY / 2,
	                    $("#drag_handle").addClass(debounceTransLabel))) : (0 > f + h / 2 || f + h / 2 > tip.h) && (Number(b.startOffset.top) > 0 ? k = !1 : h - Math.abs(Number(b.startOffset.top)) < Number(tip.h) / 2 ? k = !1 : (j = a.deltaY / 2,
	                    $("#drag_handle").addClass(debounceTransLabel))),
	                k) {
	            var l = tip.transformState.translate.x + i
	                , m = tip.transformState.translate.y + j
	                , n = tip.transformState.scale;
	            l && m && (c.attr("transform", "translate(" + l + "," + m + ") scale(" + n + ")"),
	                tip.transformState.translate.x = l,
	                tip.transformState.translate.y = m);
	            var o = $(".overlays")
	                , p = parseInt(o.css("left")) || 0
	                , q = parseInt(o.css("top")) || 0
	                , r = Number(p) + Number(i)
	                , s = Number(q) + Number(j);
	            o.css({
	                left: r + "px",
	                top: s + "px"
	            })
	        } else
	            $("#drag_handle").addClass(b.debounceTransLabel);
	        tip.handleReset(),
	            setTimeout(function() {
	                tip.touchStatus = null ,
	                    b.enableGesture = null
	            }, 100)
	    },
	    scaleSvgUpdate1: function(a, b) {
	        console.log("scaleSvgUpdate");
	        var c,
	            d = this,
	            e = ($("#svg-g"), $("#subwaySvgBody"), d.transformState.translate.x),
	            f = d.transformState.translate.y,
	            g = d.transformState.scale;
	        tip.allScale = c = tip.allScale * a;
	        var h = a * g;
	        h > MaxScale && (h = MaxScale, tip.allScale =MaxScale), MinScale> h && (h = MinScale, tip.allScale = MinScale),
	            a = h / g;
	        var i = tip.realCenter.x
	            , j = tip.realCenter.y;
	        b && (i = $(window).width() / 2,
	            j = $(window).height() / 2);
	        var k = (Number(a) - 1) * (Number(i) - Number(e))
	            , l = (Number(a) - 1) * (Number(j) - Number(f))
	            , m = e - k
	            , n = f - l;

	        if (d.newtransformState = {
	                translateX: m,
	                translateY: n,
	                scale: h
	            },
	            c >MaxScale ||  MinScale > c) {
	            var o = c > MaxScale? MaxScale / g :  MinScale/ g;
	            $("#drag_handle").addClass(d.debounceTransLabel).css({
	                "-webkit-transform": "translate3d(0px, 0px, 0) scale(" + o + ", " + o + ")"
	            })
	        } else
	            d.resetAllElem(m, n, h)
	    },
	    resetAllElem: function() {
	        console.log("resetAllElem")
	        var self = this
	            , newTranslate_x = self.newtransformState.translateX
	            , newTranslate_y = self.newtransformState.translateY
	            , newscale = self.newtransformState.scale;
	        newTranslate_x && newTranslate_y && ($("#svg-g").attr("transform", "translate(" + newTranslate_x + "," + newTranslate_y + ") scale(" + newscale + ")"),
	            self.transformState.translate.x = newTranslate_x,
	            self.transformState.translate.y = newTranslate_y,
	            self.transformState.scale = newscale),
	            tip.handleReset();
	        tip.updateTip();
	        tip.updateNear();
	        tip.updateMarker();
	        setTimeout(function () {
	            tip.touchStatus = null;
	        }, 100);
	        setTimeout(function () {
	            self.enableGesture = null;
	        }, 100);
	    },
	    //svg更新
	    svgUpdate: function (ev) {
	        console.log("svgUpdate");
	        var svg_g = $("#svg-g"),
	            $svg_body = $('#subwaySvgBody'),
	            svg_g_offset = svg_g.offset(),
	            svg_g_l = svg_g_offset.left,
	            svg_g_t = svg_g_offset.top,
	            svg_g_w = svg_g_offset.width,
	            svg_g_h = svg_g_offset.height;
	        var canUpdate = true;
	        if (svg_g_w > tip.w) {
	            if (Number(svg_g_l) > Number(tip.w) / 2 || Math.abs(Number(svg_g_l)) > (Number(svg_g_w - Number(tip.w) / 2))) {
	                canUpdate = false;
	            }
	        } else {
	            if (svg_g_l + svg_g_w / 2 < 0 || svg_g_l + svg_g_w / 2 > tip.w) {
	                canUpdate = false;
	            }
	        }
	        if (svg_g_h > tip.h) {
	            if (Number(svg_g_t) > Number(tip.h) / 2 || Math.abs(Number(svg_g_t)) > (Number(svg_g_h - Number(tip.h) / 2))) {
	                canUpdate = false;
	            }
	        } else {
	            if (svg_g_t + svg_g_h / 2 < 0 || svg_g_t + svg_g_h / 2 > tip.h) {
	                canUpdate = false;
	            }
	        }

	        if (canUpdate) {
	            var newTranslate_x = tip.transformState.translate.x + ev.deltaX,
	                newTranslate_y = tip.transformState.translate.y + ev.deltaY,
	                curscale = tip.transformState.scale;
	            if (newTranslate_x && newTranslate_y) {
	                svg_g.attr("transform", "translate(" + newTranslate_x + "," + newTranslate_y + ") scale(" + curscale + ")"); //重置translate
	                tip.transformState.translate.x = newTranslate_x;
	                tip.transformState.translate.y = newTranslate_y;
	            }
	            var $overlays = $('.overlays');
	            var oldLeft = parseInt($overlays.css('left')) || 0,
	                oldTop = parseInt($overlays.css('top')) || 0;
	            var newLeft = Number(oldLeft) + Number(ev.deltaX),
	                newTop = Number(oldTop) + Number(ev.deltaY);
	            $overlays.css({
	                left: newLeft + 'px',
	                top: newTop + 'px'
	            });
	        }

	        tip.handleReset();
	        setTimeout(function () {
	            tip.touchStatus = null;
	        }, 100);
	    },
	    //svg缩放更新
	    scaleSvgUpdate: function (scale, nav) {
	        var self = this;
	        var c;
	        var translate_x = ($("#svg-g"), $("#subwaySvgBody"),self.transformState.translate.x),
	            translate_y = self.transformState.translate.y,
	            curscale = self.transformState.scale;
	        tip.allScale = c = tip.allScale * scale;
	        var newscale = scale * curscale;
	        if (newscale > MaxScale) {
	            newscale = MaxScale;
	            tip.allScale = MaxScale;
	        }
	        if (newscale < MinScale) {
	            newscale = MinScale;
	            tip.allScale = MinScale;
	        }
	        scale = newscale / curscale;
	        var origin_x = tip.realCenter.x,
	            origin_y = tip.realCenter.y;
	        if (nav) {
	            origin_x = $(window).width() / 2;
	            origin_y = $(window).height() / 2;
	        }
	        var moveX = (Number(scale) - 1) * (Number(origin_x) - Number(translate_x)),
	            moveY = (Number(scale) - 1) * (Number(origin_y) - Number(translate_y));
	        var newTranslate_x = translate_x - moveX,
	            newTranslate_y = translate_y - moveY;



	        self.newtransformState = {translateX: newTranslate_x, translateY: newTranslate_y, scale: newscale};
	        if (c > MaxScale || MinScale > c) {
	            var _scale = c > MaxScale ? MaxScale / curscale : MinScale / curscale;
	            $("#drag_handle").addClass(self.debounceTransLabel).css({
	                "-webkit-transform": "translate3d(0px, 0px, 0) scale(" + _scale + ", " + _scale + ")"
	            });
	            console.log("addClass");
	        }else
	            self.resetAllElem(newTranslate_x,newTranslate_y,newscale);
	    },
	    transformStateReset: function() {
	        var self = this;
	        self.transformState.translate.x = 0;
	        self.transformState.translate.y = 0;
	        self.transformState.scale = 1;
	        var $overlays = $(".overlays");
	        $overlays.css({
	            left: "0px",
	            top: "0px"
	        })
	    },
	    //设置合适的屏幕视图大小
	    setFitview: function (obj) {
	        var self = this;
	        self.scaleSvgUpdate(1 / self.transformState.scale, true);
	        var obj_width = obj.width(),
	            obj_height = obj.height();
	        //var topbar_height = AllData.cache.param && AllData.cache.param.src == 'alipay' ? 0 : $('.top_bar').height(),
	        //    bottombar_height = $('.route_bar').height();
	        //var H_offset=topbar_height + bottombar_height;

	        var full_width = $(window).width(),
	            full_height = $(window).height()/* - H_offset*/;
	        var w_rate = full_width / obj_width,
	            h_rate = full_height / obj_height,
	            scale = 1;
	        if (w_rate < 1 || h_rate < 1) {
	            scale = w_rate < h_rate ? (w_rate - 0.05) : (h_rate - 0.06);
	            MinScale > scale && (scale = MinScale + .01),
	            self.scaleSvgUpdate(scale, true);
	        }
	    },
	    //获取缩放中心
	    getScaleCenter: function (xy1, xy2) {
	        var center = {};
	        if (xy1 && xy2) {
	            var x1 = eval(xy1.x),
	                y1 = eval(xy1.y),
	                x2 = eval(xy2.x),
	                y2 = eval(xy2.y);
	            center.x = (x1 + x2) / 2;
	            center.y = (y1 + y2) / 2;
	        }
	        return center;
	    },
	    //关闭最近的弹窗
	    closeNearTip: function () {
	        var self = this;
	        var obj = $(".tip-content");
	        if (drwSw.isNearTip) {
	            if (obj.hasClass('open')) {
	                obj.css("display", "none").removeClass("open");
	            }
	        }
	    },
	    //加载信息数据
	    loadinfo: function (lineId, StationId) {
	        var self = this;
	        var select_station_name,
	            infowHtml = [],
	            select_station_dpt_time = self.stationsInfo[StationId].d;
	        select_station_name = self.stations[StationId].n;
	        // var current_station = [];
	        var current_station = {};
	        for (var i = 0, len = select_station_dpt_time.length; i < len; i++) {
	            var item = select_station_dpt_time[i];
	            if (!current_station[item.ls]) {
	                current_station[item.ls] = [];
	            }
	            current_station[item.ls].push(item);
	        }
	        $("#tip_name").html(select_station_name);
	        //console.log(current_station);
	        // 输出地铁站点信息
	        for (var lineid in current_station) {
	            if (current_station.hasOwnProperty(lineid)) {
	                if (self.lines[lineid]) {
	                    var line_sub_name = self.lines[lineid].la;
	                    if (line_sub_name == '') {

	                    } else {
	                        line_sub_name = '(' + line_sub_name + ')';
	                    }
	                    infowHtml.push("<div class=\"tip_detail_line\">");
	                    //infowHtml.push("<label class=\"line-label\" style=\"background-color:#"+self.lines[lineid].cl+"\">地铁" + self.lines[lineid].ln + line_sub_name +"</label>");
	                    infowHtml.push("<label class=\"line-name\">" + self.lines[lineid].ln + line_sub_name + "</label>");
	                    infowHtml.push("<label class='line-white-label'></label>");
	                    infowHtml.push("<ul class=\"time-item-main\">");
	                    for (var j = 0; j < 2; j++) {
	                        if (current_station[lineid][j]) {
	                            var first_time = current_station[lineid][j].ft;
	                            var last_time = current_station[lineid][j].lt;
	                            first_time = self.resetTime(first_time);
	                            last_time = self.resetTime(last_time);
	                            var direction = self.stations[current_station[lineid][j].n];
	                            if (first_time.split(':')[0] != '--' || last_time.split(':')[0] != '--') {
	                                infowHtml.push("<li class=\"time-item-detail\">");
	                                infowHtml.push("<div class=\"train-direct\">" + direction.n + "方向" + "</div>"); //下一站名，表示方向
	                                infowHtml.push("<div class=\"train-time fr\">");
	                                infowHtml.push("<div class=\"start-time time-box fl\"><label class=\"time-label-start\">首</label><span class=\"time\">" + first_time + "</span></div>"); //首发
	                                infowHtml.push("<div class=\"last-time time-box fl\"><label class=\"time-label-end\">末</label><span class=\"time\">" + last_time + "</span></div>"); //末发
	                                infowHtml.push("</div>");
	                                infowHtml.push("</li>");
	                            }
	                        }
	                    }
	                    infowHtml.push("</ul>");
	                    infowHtml.push("</div>");
	                }

	            }
	        }

	        $("#tip_content").html(infowHtml.join(""));
	    },
	    //打开Tip弹窗
	    openTip: function (obj) {
	        if (obj && !tip.routeState) {
	            var self = this;
	            self.curopenStation = obj;

	            //设置站点的id和名称及关联线路id
	            var select_ref_line_id = obj.attr("line_id");
	            var select_station_id = obj.attr("station_id");

	            //运行loadinfo(),写首发时间数据
	            self.loadinfo(select_ref_line_id, select_station_id);

	            //设置站点的id和名称及关联线路id
	            var station_name = obj.attr("station_name"),
	                station_poiid = obj.attr("station_poiid"),
	                station_lon = obj.attr("station_lon"), /*经度*/
	                station_lat = obj.attr("station_lat"), /*纬度*/
	                station_id = obj.attr("station_id");

	            var line_id = obj.attr("line_id").toString();

	            //移除当前打开的info-window
	            //$('#tip_name').html(station_name);
	            $('.tip_wrap').attr('stid', station_id)
	                .attr('name', station_name)
	                .attr('poiid', station_poiid)
	                .attr('lon', station_lon)
	                .attr('lat', station_lat);
	            $('.tip_wrap_out').show();

	            self.setTipPos(obj);
	            self.opentip = true;
	            //打开窗口后就以弹窗的1/3为中心
	            var Top0ffset = self.topOffset(0.4);
	            tip.transformState.translate.y = tip.transformState.translate.y + Top0ffset;
	        }
	    },
	    topOffset: function (offset) {
	        var $tipBodyHeight = $('.tip_body').css("height"),
	            bodyHeight = parseInt($tipBodyHeight) * offset;
	        return bodyHeight;
	    },
	    //设置弹窗的位置属性
	    setTipPos: function (obj) {
	        var self = this;
	        var tip_content = $('.tip_wrap_out');
	        var obj_left = obj && obj.offset() && obj.offset().left,
	            obj_top = obj && obj.offset() && obj.offset().top;
	        var $overlays = $('.overlays');
	        var overlaysLeft = parseInt($overlays.css('left')) || 0,
	            overlaysTop = parseInt($overlays.css('top')) || 0;

	        infowindow_left = obj_left + self.station_w * self.allScale / 2 - overlaysLeft;
	        infowindow_top = obj_top + self.station_w * self.allScale / 2 - overlaysTop;

	        tip_content.css({
	            top: infowindow_top + 'px',
	            left: infowindow_left + 'px'
	        });
	    },
	    //关闭弹窗信息
	    closeTip: function (status) {
	        $('.tip_wrap_out').hide();
	        if (!status) {
	            tip.opentip = false;
	        }
	        $('.light_box').css('display', 'none');
	        //window.location.hash = '#city=' + AllData.cache.curCity.adcode;
	        window.location.hash = "";
	    },
	    //设置中心信息
	    setCenter: function (center) {
	        var self = this;
	        var svg_g = $('#svg-g');
	        if (!center) {
	            return;
	        }
	        var center_x = center.x,
	            center_y = center.y;
	        var translate_x = tip.transformState.translate.x,
	            translate_y = tip.transformState.translate.y,
	            scale = tip.transformState.scale;
	        var screen_w = document.documentElement.clientWidth,
	            screen_h = document.documentElement.clientHeight;

	        var moveX = center_x - screen_w * 0.5,
	            moveY = center_y - screen_h * 0.5;

	        translate_x = translate_x - moveX;
	        translate_y = translate_y - moveY;


	        svg_g.attr("transform", "translate(" + translate_x + "," + translate_y + ") scale(" + scale + ")");

	        tip.transformState.translate.x = translate_x;
	        tip.transformState.translate.y = translate_y;

	        //选取偏移量
	        var Top0ffset = self.topOffset(0.4);

	        var $overlays = $('.overlays');
	        var oldLeft = parseInt($overlays.css('left')) || 0,
	            oldTop = parseInt($overlays.css('top')) || 0;
	        var newLeft = Number(oldLeft) - Number(moveX),
	            newTop = Number(oldTop) - Number(moveY) + Top0ffset;
	        $overlays.css({
	            left: newLeft + 'px',
	            top: newTop + 'px'
	        });
	    },
	    //打开路线选择器
	    openFilter: function () {
	        var $filterContent = $(".filter_content");
	        $('.light_box, .filter_content').css('display', 'block');
	        var width = parseInt($filterContent.css("width")),
	            height = parseInt($filterContent.css("height"));
	        var left = (tip.w - width) / 2 + "px",
	            top = (tip.h - height) / 2 + "px";
	        $filterContent.css({"top": top, "left": left});
	        //线路选择器不能与弹窗同时存在
	        $('.tip_wrap_out').hide();
	        tip.stoprefresh();
	    },
	    //关闭路线选择器
	    closeFilter: function () {
	        $('.light_box, .filter_content').css('display', 'none');
	        $(".refresh_btn").show();
	        $(".refresh_box").show();
	        $(".refresh_time").show();
	    },
	    //获取选择后的中心
	    getFilterCenter: function () {
	        var self = this;
	        var select_g_offset = $('#g-select').offset();
	        var select_g_h = document.getElementById("g-select").getBBox().height * self.allScale,
	            select_g_w = document.getElementById("g-select").getBBox().width * self.allScale;

	        return {
	            'x': select_g_offset.left + select_g_w / 2,
	            'y': select_g_offset.top + select_g_h / 2
	        }
	    },
	    //改变城市
	    cityChange: function () {
	        $('#subway').hide();
	        tip.creatCitylist();
	        tip.showCitylist();
	    },
	    //创建城市列表
	    creatCitylist: function () {
	        var city = SW.cityListData;
	        if (city) {
	            var citylist = $('#citylist');
	            var cityListHtm = '';
	            for (var i = 0; i < city.length; i++) {
	                cityListHtm += '<li class="cityitem" adcode="' + city[i].adcode + '"><a href="javascript:void(0)">' + city[i].cityname + '</a></li>';
	            }
	            citylist.html(cityListHtm);
	        }
	    },
	    //初始化城市信息
	    initCity: function () {
	        tip.allScale = 1;
	    },
	    //显示城市列表
	    showCitylist: function () {
	        $('#citypage').show();
	    },
	    //隐藏城市列表
	    hideCitylist: function () {
	        $('#citypage').hide();
	    },
	    //获得对象中心位置
	    getStCenter: function (obj) {
	        if (obj) {
	            var st_offset = obj.offset();
	            if (st_offset) {
	                return {
	                    'x': st_offset.left + st_offset.width / 2,
	                    'y': st_offset.top + st_offset.height / 2
	                }
	            }

	        }
	    },
	    //清楚标记
	    clearMarker: function (type) {
	        var self = this;
	        if (type) {
	            var marker = $('#nav_' + type).find('.marker-out');
	            if (marker.length > 0) {
	                marker.remove();
	            }
	        }
	    },
	    //更新标记
	    updateMarker: function () {
	        if (tip.fromendState) {
	            var start_id = tip.routeId.start,
	                end_id = tip.routeId.end;
	            if (start_id) {
	                tip.updateStartEnd(start_id, 'start')
	            }
	            if (end_id) {
	                tip.updateStartEnd(end_id, 'end')
	            }
	        }
	    },
	    //更新起始点
	    updateStartEnd: function (id, type) {
	        var self = this;
	        if (id) {
	            var obj = null;

	            if ($('#st-' + id).length > 0) {
	                obj = $('#st-' + id)
	            } else {
	                obj = self.curStation;
	            }

	            var obj_left = obj.offset().left,
	                obj_top = obj.offset().top;

	            var $overlays = $('.overlays');
	            var overlaysLeft = parseInt($overlays.css('left')) || 0,
	                overlaysTop = parseInt($overlays.css('top')) || 0;

	            var left = obj_left + self.station_w * self.allScale / 2 - overlaysLeft,
	                top = obj_top + self.station_w * self.allScale / 2 - overlaysTop;

	            var marker_wrap = $('#nav_' + type);

	            marker_wrap.css({
	                top: top + 'px',
	                left: left + 'px'
	            });
	        }
	    },
	    //更新tip
	    updateTip: function () {
	        var self = this;
	        if (tip.opentip) {
	            var obj = tip.curopenStation;

	            var obj_left = obj.offset().left,
	                obj_top = obj.offset().top;

	            var $overlays = $('.overlays');
	            var overlaysLeft = parseInt($overlays.css('left')) || 0,
	                overlaysTop = parseInt($overlays.css('top')) || 0;

	            var left = obj_left + self.station_w * self.allScale / 2 - overlaysLeft,
	                top = obj_top + self.station_w * self.allScale / 2 - overlaysTop;

	            var tip_wrap = $('.tip_wrap_out');

	            tip_wrap.css({
	                top: top + 'px',
	                left: left + 'px'
	            });
	        }
	    },
	    //更新最近位置的信息
	    updateNear: function () {
	        var self = this;
	        if (drwSw.nearId) {
	            var obj = $('#near-' + drwSw.nearId);

	            if (obj) {
	                var obj_left = obj.offset().left,
	                    obj_top = obj.offset().top;

	                var $overlays = $('.overlays');
	                var overlaysLeft = parseInt($overlays.css('left')) || 0,
	                    overlaysTop = parseInt($overlays.css('top')) || 0;

	                var left = obj_left + 28 * self.allScale / 2 - overlaysLeft,
	                    top = obj_top - overlaysTop;

	                var tip_wrap = $('.tip-content');

	                tip_wrap.css({
	                    top: top + 'px',
	                    left: left + 'px'
	                });
	            }
	        }
	    },
	    //格式化时间
	    formatTime: function (le) {
	        if (!le || le == '0') {
	            return '';
	        }
	        le = le / 60;
	        if (le <= 60) {
	            return parseInt(Math.ceil(le)) + '分钟';
	        } else {
	            var o = Math.floor(le / 60) + '小时';
	            if (le % 60 !== 0) {
	                if (Math.floor(le % 60) === 0) {

	                } else {
	                    o += Math.floor(le % 60) + '分钟';
	                }
	            }
	            return o;
	        }
	    },
	    unableFlite: function () {
	        $('.filter_btn').css({
	            'z-index': '10'
	        })
	    },
	    ableFilte: function () {
	        $('.filter_btn').css({
	            'z-index': '20'
	        })
	    },
	    resetTime: function (timeString) {
	        if (timeString != "--:--") {
	            var hours = Number(timeString.split(":")[0]);
	            var mins = Number(timeString.split(":")[1]);
	            if (hours < 10 && hours > 0) {
	                hours = "0" + hours;
	            } else if (hours == 0) {
	                hours = "00";
	            } else {
	                hours = hours;
	            }

	            if (mins < 10 && mins > 0) {
	                mins = "0" + mins;
	            } else if (mins == 0) {
	                mins = "00";
	            } else {
	                mins = mins;
	            }

	            return hours + ":" + mins;
	        } else {
	            return timeString;
	        }
	    },
	    clearRouteIpt: function (type) {
	        var placeholder = {
	            'start': '输入起点',
	            'end': '输入终点'
	        };
	        var $obj = null;
	        if (type == 'start') {
	            $obj = $('#setStart')
	        } else if (type == 'end') {
	            $obj = $('#setEnd')
	        }
	        $obj.find('.route_startend').html(placeholder[type]).addClass('route_placeholder');
	        $obj.find('.route_close').addClass('hidden');
	    },
	    //正在加载
	    loading: function () {
	        $('.loading-outer').css('position', 'fixed');
	        $('.loading-bg').css({
	            'position': 'fixed',
	            'display': 'block'
	        });
	        $('.loading-bg .loading').css('top', '-30px');
	    },
	    //加载完成
	    loadingOver: function () {
	        $('.loading-bg').css('display', 'none');
	    }
	};


	module.exports = tip;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.6 - 2016-01-06
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the  license */
	!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&ha(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==ka?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ia.length;){if(c=ia[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return qa++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:ta?M:ua?P:sa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Aa&&d-e===0,g=b&(Ca|Da)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=na(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=ma(j.x)>ma(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===Aa||f.eventType===Ca)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Da&&(i>za||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=ma(l.x)>ma(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:la(a.pointers[c].clientX),clientY:la(a.pointers[c].clientY)},c++;return{timeStamp:na(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:la(a[0].clientX),y:la(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:la(c/b),y:la(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ea:ma(a)>=ma(b)?0>a?Fa:Ga:0>b?Ha:Ia}function H(a,b,c){c||(c=Ma);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Ma);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Na)+I(a[1],a[0],Na)}function K(a,b){return H(b[0],b[1],Na)/H(a[0],a[1],Na)}function L(){this.evEl=Pa,this.evWin=Qa,this.allow=!0,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Ta,this.evWin=Ua,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=Wa,this.evWin=Xa,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ca|Da)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=Za,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Aa|Ba)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Aa)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ca|Da)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a)}function S(a,b){this.manager=a,this.set(b)}function T(a){if(p(a,db))return db;var b=p(a,eb),c=p(a,fb);return b&&c?db:b||c?b?eb:fb:p(a,cb)?cb:bb}function U(a){this.options=ha({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=gb,this.simultaneous={},this.requireFail=[]}function V(a){return a&lb?"cancel":a&jb?"end":a&ib?"move":a&hb?"start":""}function W(a){return a==Ia?"down":a==Ha?"up":a==Fa?"left":a==Ga?"right":""}function X(a,b){var c=b.manager;return c?c.get(a):a}function Y(){U.apply(this,arguments)}function Z(){Y.apply(this,arguments),this.pX=null,this.pY=null}function $(){Y.apply(this,arguments)}function _(){U.apply(this,arguments),this._timer=null,this._input=null}function aa(){Y.apply(this,arguments)}function ba(){Y.apply(this,arguments)}function ca(){U.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function da(a,b){return b=b||{},b.recognizers=l(b.recognizers,da.defaults.preset),new ea(a,b)}function ea(a,b){this.options=ha({},da.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=y(this),this.touchAction=new S(this,this.options.touchAction),fa(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function fa(a,b){var c=a.element;c.style&&g(a.options.cssProps,function(a,d){c.style[u(c.style,d)]=b?a:""})}function ga(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ha,ia=["","webkit","Moz","MS","ms","o"],ja=b.createElement("div"),ka="function",la=Math.round,ma=Math.abs,na=Date.now;ha="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var oa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),pa=h(function(a,b){return oa(a,b,!0)},"merge","Use `assign`."),qa=1,ra=/mobile|tablet|ip(ad|hone|od)|android/i,sa="ontouchstart"in a,ta=u(a,"PointerEvent")!==d,ua=sa&&ra.test(navigator.userAgent),va="touch",wa="pen",xa="mouse",ya="kinect",za=25,Aa=1,Ba=2,Ca=4,Da=8,Ea=1,Fa=2,Ga=4,Ha=8,Ia=16,Ja=Fa|Ga,Ka=Ha|Ia,La=Ja|Ka,Ma=["x","y"],Na=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Oa={mousedown:Aa,mousemove:Ba,mouseup:Ca},Pa="mousedown",Qa="mousemove mouseup";i(L,x,{handler:function(a){var b=Oa[a.type];b&Aa&&0===a.button&&(this.pressed=!0),b&Ba&&1!==a.which&&(b=Ca),this.pressed&&this.allow&&(b&Ca&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:xa,srcEvent:a}))}});var Ra={pointerdown:Aa,pointermove:Ba,pointerup:Ca,pointercancel:Da,pointerout:Da},Sa={2:va,3:wa,4:xa,5:ya},Ta="pointerdown",Ua="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Ta="MSPointerDown",Ua="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Ra[d],f=Sa[a.pointerType]||a.pointerType,g=f==va,h=r(b,a.pointerId,"pointerId");e&Aa&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ca|Da)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Va={touchstart:Aa,touchmove:Ba,touchend:Ca,touchcancel:Da},Wa="touchstart",Xa="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Va[a.type];if(b===Aa&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ca|Da)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:va,srcEvent:a})}}});var Ya={touchstart:Aa,touchmove:Ba,touchend:Ca,touchcancel:Da},Za="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=Ya[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:va,srcEvent:a})}}),i(R,x,{handler:function(a,b,c){var d=c.pointerType==va,e=c.pointerType==xa;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ca|Da)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var $a=u(ja.style,"touchAction"),_a=$a!==d,ab="compute",bb="auto",cb="manipulation",db="none",eb="pan-x",fb="pan-y";S.prototype={set:function(a){a==ab&&(a=this.compute()),_a&&this.manager.element.style&&(this.manager.element.style[$a]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),T(a.join(" "))},preventDefaults:function(a){if(!_a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,db),f=p(d,fb),g=p(d,eb);if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}if(!g||!f)return e||f&&c&Ja||g&&c&Ka?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var gb=1,hb=2,ib=4,jb=8,kb=jb,lb=16,mb=32;U.prototype={defaults:{},set:function(a){return ha(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=X(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=X(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=X(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=X(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;jb>d&&b(c.options.event+V(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=jb&&b(c.options.event+V(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=mb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(mb|gb)))return!1;a++}return!0},recognize:function(a){var b=ha({},a);return k(this.options.enable,[this,b])?(this.state&(kb|lb|mb)&&(this.state=gb),this.state=this.process(b),void(this.state&(hb|ib|jb|lb)&&this.tryEmit(b))):(this.reset(),void(this.state=mb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(Y,U,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(hb|ib),e=this.attrTest(a);return d&&(c&Da||!e)?b|lb:d||e?c&Ca?b|jb:b&hb?b|ib:hb:mb}}),i(Z,Y,{defaults:{event:"pan",threshold:10,pointers:1,direction:La},getTouchAction:function(){var a=this.options.direction,b=[];return a&Ja&&b.push(fb),a&Ka&&b.push(eb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Ja?(e=0===f?Ea:0>f?Fa:Ga,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ea:0>g?Ha:Ia,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Y.prototype.attrTest.call(this,a)&&(this.state&hb||!(this.state&hb)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=W(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i($,Y,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[db]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&hb)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(_,U,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[bb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ca|Da)&&!f)this.reset();else if(a.eventType&Aa)this.reset(),this._timer=e(function(){this.state=kb,this.tryEmit()},b.time,this);else if(a.eventType&Ca)return kb;return mb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===kb&&(a&&a.eventType&Ca?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=na(),this.manager.emit(this.options.event,this._input)))}}),i(aa,Y,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[db]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&hb)}}),i(ba,Y,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Ja|Ka,pointers:1},getTouchAction:function(){return Z.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Ja|Ka)?b=a.overallVelocity:c&Ja?b=a.overallVelocityX:c&Ka&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&ma(b)>this.options.velocity&&a.eventType&Ca},emit:function(a){var b=W(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ca,U,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[cb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Aa&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ca)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=kb,this.tryEmit()},b.interval,this),hb):kb}return mb},failTimeout:function(){return this._timer=e(function(){this.state=mb},this.options.interval,this),mb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==kb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),da.VERSION="2.0.6",da.defaults={domEvents:!1,touchAction:ab,enable:!0,inputTarget:null,inputClass:null,preset:[[aa,{enable:!1}],[$,{enable:!1},["rotate"]],[ba,{direction:Ja}],[Z,{direction:Ja},["swipe"]],[ca],[ca,{event:"doubletap",taps:2},["tap"]],[_]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var nb=1,ob=2;ea.prototype={set:function(a){return ha(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?ob:nb},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&kb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===ob||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(hb|ib|jb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof U)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&ga(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&fa(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},ha(da,{INPUT_START:Aa,INPUT_MOVE:Ba,INPUT_END:Ca,INPUT_CANCEL:Da,STATE_POSSIBLE:gb,STATE_BEGAN:hb,STATE_CHANGED:ib,STATE_ENDED:jb,STATE_RECOGNIZED:kb,STATE_CANCELLED:lb,STATE_FAILED:mb,DIRECTION_NONE:Ea,DIRECTION_LEFT:Fa,DIRECTION_RIGHT:Ga,DIRECTION_UP:Ha,DIRECTION_DOWN:Ia,DIRECTION_HORIZONTAL:Ja,DIRECTION_VERTICAL:Ka,DIRECTION_ALL:La,Manager:ea,Input:x,TouchAction:S,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:U,AttrRecognizer:Y,Tap:ca,Pan:Z,Swipe:ba,Pinch:$,Rotate:aa,Press:_,on:m,off:n,each:g,merge:pa,extend:oa,assign:ha,inherit:i,bindFn:j,prefixed:u});var pb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};pb.Hammer=da, true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return da}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!=typeof module&&module.exports?module.exports=da:a[c]=da}(window,document,"Hammer");
	//# sourceMappingURL=hammer.min.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/20.
	 */

	var AllData=__webpack_require__(5);
	var drwSelect=__webpack_require__(12);
	var tip=__webpack_require__(9);
	var $=__webpack_require__(4);
	var DrwTraf=__webpack_require__(8);
	var drwSw=__webpack_require__(6);

	var bindEvent={
	    enableGesture :tip.enableGesture,
	    debounceTransLabel:tip.debounceTransLabel,
	    init: function() {
	        this.bindEvent();
	    },
	    //绑定事件
	    bindEvent: function() {
	        document.addEventListener('touchstart', function() {});
	        var self = this;
	        var $refresh=$(".refresh_btn");
	        var $subway = $('#subway');
	        var $citypage = $('#citypage');
	        var $overlays = $('#overlays');
	        var $srh = $('#srhpage');
	        var el = document.getElementById('drag_handle');
	        var mc = new Hammer.Manager(el, {
	            domEvents: true
	        });

	        mc.add(new Hammer.Pan());
	        mc.add(new Hammer.Pinch());

	        self.enableGesture=true;
	        var lastAction = "";
	        var hasPenchend = false;

	        mc.on("panstart panmove", function(ev) {
	            if ("panstart" == ev.type) {
	                var $svg_g = $("#svg-g")
	                    , $svg_g_offset = $svg_g.offset();
	                tip.startOffset.left = $svg_g_offset && $svg_g_offset.left;
	                tip.startOffset.top = $svg_g_offset && $svg_g_offset.top;
	            }
	            "pinch" != self.enableGesture && (self.enableGesture = "pan",
	                tip.touchStatus = "pan",
	                lastAction = "pan",
	                tip.mcdragSvg(ev))
	        });

	        mc.on("pinchstart pinchmove", function(ev) {
	            "pan" != self.enableGesture && (self.enableGesture = 'pinch',
	                tip.touchStatus = 'pinch',
	                lastAction = "pinch",
	            ev.type == 'pinchstart' && (tip.svgOffset = drwSw.svgOffset || tip.svgOffset,
	                hasPenchend = false),
	                tip.mcScaleSvg(ev))
	        });

	        mc.on("pinchend", function() {
	            setTimeout(function() {
	                if (!hasPenchend) {
	                    tip.scaleSvgUpdate(tip.transform.scale);
	                }
	            }, 0)
	        });
	        //在每一次有用户交互的时候都会被触发，可以得到非常有用的数据
	        mc.on("hammer.input", function(ev) {
	            if (ev.isFinal) {
	                if (lastAction == "pinch") {
	                    tip.scaleSvgUpdate(tip.transform.scale);
	                    hasPenchend = true;
	                }
	                if (lastAction == "pan") {
	                    tip.svgUpdate(ev);
	                }
	                self.enableGesture= false;
	                setTimeout(function() {
	                    self.enableGesture= true;
	                }, 50);
	            }
	            console.log(self.enableGesture);
	        });

	        $(document).on("webkitTransitionEnd", "." + self.debounceTransLabel, function() {
	            $(document.getElementById("drag_handle")).removeClass(self.debounceTransLabel);
	            console.log("removeClass");
	            console.log("webkitTransitionEnd-0",self.enableGesture);
	           /* "pinch"==self.enableGesture  && */tip.resetAllElem();
	            console.log("webkitTransitionEnd-1",self.enableGesture)
	        });

	        $subway.on('touchend', 'g', function() {
	            if (!tip.touchStatus) {
	                if ($(this).hasClass('line_name')) {
	                    //线路选择器显示线路名
	                    var line_id = $(this).attr('lineid');
	                    var SW_line_name = AllData.cache.lines[line_id].ln;
	                    var line_name=SW_line_name.split("/")[0].toString().substr(0,4);
	                    $(".filter_btn").html(line_name);
	                    self.showFilterLine(line_id);
	                    var select_obj = $('#g-select');
	                    tip.setFitview(select_obj);
	                    var center = tip.getFilterCenter();
	                    tip.setCenter(center);
	                }
	            }
	        });

	        $subway.on('touchend', '#g-bg', function() {
	            if (!tip.routeState) {
	                if (!tip.touchStatus) {
	                    $('#g-select').remove();
	                    $('#g-bg').css('display', 'none');
	                    $(".filter_btn").html("线路图");
	                }
	            }
	        });

	        //触击 非站点又不是换乘点的区域 关闭弹窗
	        $subway.on('touchend','#drag_handle'&&".light_box",function(e) {
	            if (!tip.touchStatus && !tip.routeState) {
	                var target = e.target;
	                if (target.getAttribute('class') != 'station_obj' || target.getAttribute('class') != 'nav-img') {
	                    tip.closeTip();
	                    tip.closehelpBox();
	                }
	            }
	        });


	        //$("#srhlist").on("touchmove", function(e) {
	        //    $("#srh_ipt").blur();
	        //});
	        //触击站点事件：打开一个#city=city代码&station=站点代码的网址;
	        $subway.on('touchend', '.station_obj', function (e) {
	            e.stopPropagation();
	            if (!tip.touchStatus && !tip.routeState) {
	                var id = $(this).attr('station_id');
	                tip.closeFilter();
	                $('.light_box').css('display', 'block');
	                //var obj = $("#overlays");
	                //if (drwSw.isNearTip) {
	                //    drwSw.clearNearTip();
	                //}
	                //tip.openTip(obj);
	                //var center = tip.getStCenter(obj);
	                //tip.setCenter(center);
	                //console.log(obj,center);
	                //console.log(AllData.cache.curCity.adcode);
	                //window.location.hash = '#city=' + AllData.cache.curCity.adcode + '&station=' + id;
	                window.location.hash ='#station=' + id;
	            }
	        });

	        //点击弹出层事件：阻止冒泡,接受事件,但是无动作
	        $overlays.on('touchend', '.tip_wrap', function(e) {
	            e.stopPropagation();
	        });
	        //点击弹出层事件：阻止冒泡
	        $overlays.on('touchstart', '.tip_wrap', function(e) {
	            e.stopPropagation();
	        });

	        $(".top_bar").on("touchend", function () {
	            tip.closeTip();
	            tip.closeFilter();
	        });

	        $('.light_box').on('touchmove', function(ev) {
	            ev.preventDefault();
	        });

	        $('#loading').on('touchmove', function(ev) {
	            ev.preventDefault();
	        });
	        //关闭背景暗箱
	        $('.light_box').on('touchend', function() {
	            tip.closeFilter();
	            tip.closehelpBox()
	        });

	        $refresh.on('touchend', function (ev) {
	            ev.stopPropagation();
	            if(tip.refreshstate==0){
	                tip.refreshstate=1;
	                var $refresh = $(".refresh_btn");
	                $refresh.addClass("refresh_active");
	                var city_code = AllData.cache.curCity.adcode;
	                var city_name = AllData.fileNameData[AllData.cache.curCity.adcode];
	                var status = 'normal';
	                DrwTraf.loadTraffic(city_code, city_name);
	                //console.log("add前",drwSw.currLines);
	                DrwTraf.drwTrafficLinesDefer(drwSw.currLines, status);
	            }else {
	                ev.stopPropagation();
	            }
	        });

	        //点击线路图选择器，打开选择器
	        $('.filter_btn').on('touchend', function() {
	            tip.closehelpBox();
	            if (!tip.routeState) {
	                tip.openFilter();
	            }
	        });
	        //点击选择器中的路线：关闭选择器，显示地铁，设置屏幕中心点为地铁的中心
	        $('.fliter_detail').on('touchend', '.fliter_item', function() {
	            if (lockfd) return;
	            var line_id = $(this).attr('lineid');
	            var line_name=$(this).attr('name');
	            if (line_id == "caption-allLines") {
	                tip.closeFilter();
	                bindEvent.showAlllines();
	                $("#g-select").remove();
	            } else {
	                tip.closeFilter();
	                $(".filter_btn").html(line_name);
	                self.showFilterLine(line_id);
	                var select_obj = $('#g-select');
	                tip.setFitview(select_obj);
	                var center = tip.getFilterCenter();
	                tip.setCenter(center);
	                //console.log(center);
	            }
	        });

	        //处理选择器中的移动事件
	        var fdTimer;
	        var lockfd = false;
	        $('.fliter_detail').on('touchmove', function(e) {
	            e.stopPropagation();
	            lockfd = true;
	            fdTimer && clearTimeout(fdTimer);
	            fdTimer = setTimeout(function() {
	                lockfd = false;
	            }, 60);
	        });

	        $(".help_btn").on("touchend", function (e) {
	            e.stopPropagation();
	            tip.closeFilter();
	            $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
	            $(".refresh_box").hide().removeClass("refresh_box_show").css("display", "none");
	            tip.openhelpBox();
	        });
	        $(".help_close").on("touchend", function (e) {
	            e.stopPropagation();
	            tip.closehelpBox();
	        });


	        $('.tip_close').on('touchend', function(e) {
	            e.stopPropagation();
	            tip.closeTip();/*调用closeTip的方法*/
	        });

	        $('#back_amap').on('touchend', function() {
	            tip.goback()
	        });

	        //导航栏中的城市名的触摸事件
	        $('.city_list_btn').on('touchend', function() {
	            tip.cityChange();
	        });

	        $citypage.on('touchend', '.cityitem', function() {
	            var adcode = $(this).attr('adcode');
	            // window.location.hash = "#city=" + adcode;
	            // $('#tip-content').remove();
	            tip.initCity();
	            window.location.hash = "#city=" + adcode;
	            // SW.changeCity(adcode);
	            tip.hideCitylist();
	            $('#subway').show();
	        });

	    },


	    //显示过滤后的地铁线
	    showFilterLine: function(id) {
	        $('#g-select').remove();
	        $('#g-bg').css('display', 'block');
	        drwSelect.drawSelectLine(AllData.cache.lines[id], 'select');/*画了一个select-DOM*/
	    },
	    //地址栏里的参数转为一个json对象
	    param2json: function(str) {
	        if (!str || str == '') {
	            return null
	        } else {
	            var strArr = str.split('&');
	            var json = {};

	            if (strArr.length > 0) {
	                for (var i = 0; i < strArr.length; i++) {
	                    var item = strArr[i].split('=');
	                    var key = item[0];
	                    var value = item[1];
	                    json[key] = value;
	                }
	            }
	            return json
	        }
	    },
	    showAlllines: function () {
	        $(".filter_btn").html("线路图");
	        $('#g-bg').css('display','none');
	        //获取中心相对于实际svg图像的偏移量
	        var adcode = AllData.param.city;
	        var curCity=AllData.cache.cities[adcode];
	        var centerOffset={};
	        centerOffset.x=curCity.offset.split(",")[0];
	        centerOffset.y=curCity.offset.split(",")[1];
	        //设置新的中心
	        var center={};
	        var $Svg=$('#svg-g');
	        tip.setFitview($Svg);
	        var $Svg_offset = $Svg.offset();
	        var $Svg_h = (document.getElementById('svg-g').getBBox().height) * tip.allScale,
	            $Svg_w = (document.getElementById('svg-g').getBBox().width*1.5-centerOffset.x) * tip.allScale;
	        center.x = $Svg_offset.left + $Svg_w/2;
	        center.y = $Svg_offset.top + $Svg_h/2;
	        tip.setCenter(center);
	    }
	};
	module.exports=bindEvent;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/20.
	 */

	var AllData = __webpack_require__(5);
	var DrwTraf = __webpack_require__(8);
	var drwSw = __webpack_require__(6);

	var drwSelect = {
	    ns_svg: AllData.ns_svg,
	    drawSelectLine: function (drwData) {
	        var self = this;
	        var status = 'select';
	        var svg_g = document.getElementById("svg-g");
	        var subway_select_g = document.createElementNS(self.ns_svg, 'g');
	        subway_select_g.setAttribute("id", "g-select");
	        svg_g.appendChild(subway_select_g);
	        drwSw.drwSwLines(drwData, status);
	        drwSw.drwSwStations(drwData, status);
	        drwSw.drwSwStationsName(drwData, status, 10, 20); //缩小为0.5，第二个参数为24
	        drwSw.drwSwLinesName(drwData, status);
	        DrwTraf.drwTrafficLinesDefer(drwData, status);
	    }
	};

	module.exports = drwSelect;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
		'use strict';

		/**
		 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
		 *
		 * @codingstandard ftlabs-jsv2
		 * @copyright The Financial Times Limited [All Rights Reserved]
		 * @license MIT License (see LICENSE.txt)
		 */

		/*jslint browser:true, node:true*/
		/*global define, Event, Node*/


		/**
		 * Instantiate fast-clicking listeners on the specified layer.
		 *
		 * @constructor
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		function FastClick(layer, options) {
			var oldOnClick;

			options = options || {};

			/**
			 * Whether a click is currently being tracked.
			 *
			 * @type boolean
			 */
			this.trackingClick = false;


			/**
			 * Timestamp for when click tracking started.
			 *
			 * @type number
			 */
			this.trackingClickStart = 0;


			/**
			 * The element being tracked for a click.
			 *
			 * @type EventTarget
			 */
			this.targetElement = null;


			/**
			 * X-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartX = 0;


			/**
			 * Y-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartY = 0;


			/**
			 * ID of the last touch, retrieved from Touch.identifier.
			 *
			 * @type number
			 */
			this.lastTouchIdentifier = 0;


			/**
			 * Touchmove boundary, beyond which a click will be cancelled.
			 *
			 * @type number
			 */
			this.touchBoundary = options.touchBoundary || 10;


			/**
			 * The FastClick layer.
			 *
			 * @type Element
			 */
			this.layer = layer;

			/**
			 * The minimum time between tap(touchstart and touchend) events
			 *
			 * @type number
			 */
			this.tapDelay = options.tapDelay || 200;

			/**
			 * The maximum time for a tap
			 *
			 * @type number
			 */
			this.tapTimeout = options.tapTimeout || 700;

			if (FastClick.notNeeded(layer)) {
				return;
			}

			// Some old versions of Android don't have Function.prototype.bind
			function bind(method, context) {
				return function() { return method.apply(context, arguments); };
			}


			var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
			var context = this;
			for (var i = 0, l = methods.length; i < l; i++) {
				context[methods[i]] = bind(context[methods[i]], context);
			}

			// Set up event handlers as required
			if (deviceIsAndroid) {
				layer.addEventListener('mouseover', this.onMouse, true);
				layer.addEventListener('mousedown', this.onMouse, true);
				layer.addEventListener('mouseup', this.onMouse, true);
			}

			layer.addEventListener('click', this.onClick, true);
			layer.addEventListener('touchstart', this.onTouchStart, false);
			layer.addEventListener('touchmove', this.onTouchMove, false);
			layer.addEventListener('touchend', this.onTouchEnd, false);
			layer.addEventListener('touchcancel', this.onTouchCancel, false);

			// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
			// layer when they are cancelled.
			if (!Event.prototype.stopImmediatePropagation) {
				layer.removeEventListener = function(type, callback, capture) {
					var rmv = Node.prototype.removeEventListener;
					if (type === 'click') {
						rmv.call(layer, type, callback.hijacked || callback, capture);
					} else {
						rmv.call(layer, type, callback, capture);
					}
				};

				layer.addEventListener = function(type, callback, capture) {
					var adv = Node.prototype.addEventListener;
					if (type === 'click') {
						adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
							if (!event.propagationStopped) {
								callback(event);
							}
						}), capture);
					} else {
						adv.call(layer, type, callback, capture);
					}
				};
			}

			// If a handler is already declared in the element's onclick attribute, it will be fired before
			// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
			// adding it as listener.
			if (typeof layer.onclick === 'function') {

				// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
				// - the old one won't work if passed to addEventListener directly.
				oldOnClick = layer.onclick;
				layer.addEventListener('click', function(event) {
					oldOnClick(event);
				}, false);
				layer.onclick = null;
			}
		}

		/**
		* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
		*
		* @type boolean
		*/
		var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

		/**
		 * Android requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


		/**
		 * iOS requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


		/**
		 * iOS 4 requires an exception for select elements.
		 *
		 * @type boolean
		 */
		var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


		/**
		 * iOS 6.0-7.* requires the target element to be manually derived
		 *
		 * @type boolean
		 */
		var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

		/**
		 * BlackBerry requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

		/**
		 * Determine whether a given element requires a native click.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element needs a native click
		 */
		FastClick.prototype.needsClick = function(target) {
			switch (target.nodeName.toLowerCase()) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ((deviceIsIOS && target.type === 'file') || target.disabled) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
			}

			return (/\bneedsclick\b/).test(target.className);
		};


		/**
		 * Determine whether a given element requires a call to focus to simulate click into element.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
		 */
		FastClick.prototype.needsFocus = function(target) {
			switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
				case 'button':
				case 'checkbox':
				case 'file':
				case 'image':
				case 'radio':
				case 'submit':
					return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/).test(target.className);
			}
		};


		/**
		 * Send a click event to the specified element.
		 *
		 * @param {EventTarget|Element} targetElement
		 * @param {Event} event
		 */
		FastClick.prototype.sendClick = function(targetElement, event) {
			var clickEvent, touch;

			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}

			touch = event.changedTouches[0];

			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
		};

		FastClick.prototype.determineEventType = function(targetElement) {

			//Issue #159: Android Chrome Select Box does not open with a synthetic click event
			if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
				return 'mousedown';
			}

			return 'click';
		};


		/**
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.focus = function(targetElement) {
			var length;

			// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
			if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
				length = targetElement.value.length;
				targetElement.setSelectionRange(length, length);
			} else {
				targetElement.focus();
			}
		};


		/**
		 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
		 *
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.updateScrollParent = function(targetElement) {
			var scrollParent, parentElement;

			scrollParent = targetElement.fastClickScrollParent;

			// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
			// target element was moved to another parent.
			if (!scrollParent || !scrollParent.contains(targetElement)) {
				parentElement = targetElement;
				do {
					if (parentElement.scrollHeight > parentElement.offsetHeight) {
						scrollParent = parentElement;
						targetElement.fastClickScrollParent = parentElement;
						break;
					}

					parentElement = parentElement.parentElement;
				} while (parentElement);
			}

			// Always update the scroll top tracker if possible.
			if (scrollParent) {
				scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
			}
		};


		/**
		 * @param {EventTarget} targetElement
		 * @returns {Element|EventTarget}
		 */
		FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

			// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
			if (eventTarget.nodeType === Node.TEXT_NODE) {
				return eventTarget.parentNode;
			}

			return eventTarget;
		};


		/**
		 * On touch start, record the position and scroll offset.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchStart = function(event) {
			var targetElement, touch, selection;

			// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
			if (event.targetTouches.length > 1) {
				return true;
			}

			targetElement = this.getTargetElementFromEventTarget(event.target);
			touch = event.targetTouches[0];

			if (deviceIsIOS) {

				// Only trusted events will deselect text on iOS (issue #49)
				selection = window.getSelection();
				if (selection.rangeCount && !selection.isCollapsed) {
					return true;
				}

				if (!deviceIsIOS4) {

					// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
					// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
					// with the same identifier as the touch event that previously triggered the click that triggered the alert.
					// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
					// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
					// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
					// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
					// random integers, it's safe to to continue if the identifier is 0 here.
					if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
						event.preventDefault();
						return false;
					}

					this.lastTouchIdentifier = touch.identifier;

					// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
					// 1) the user does a fling scroll on the scrollable layer
					// 2) the user stops the fling scroll with another tap
					// then the event.target of the last 'touchend' event will be the element that was under the user's finger
					// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
					// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
					this.updateScrollParent(targetElement);
				}
			}

			this.trackingClick = true;
			this.trackingClickStart = event.timeStamp;
			this.targetElement = targetElement;

			this.touchStartX = touch.pageX;
			this.touchStartY = touch.pageY;

			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				event.preventDefault();
			}

			return true;
		};


		/**
		 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.touchHasMoved = function(event) {
			var touch = event.changedTouches[0], boundary = this.touchBoundary;

			if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
				return true;
			}

			return false;
		};


		/**
		 * Update the last position.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchMove = function(event) {
			if (!this.trackingClick) {
				return true;
			}

			// If the touch has moved, cancel the click tracking
			if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
				this.trackingClick = false;
				this.targetElement = null;
			}

			return true;
		};


		/**
		 * Attempt to find the labelled control for the given label element.
		 *
		 * @param {EventTarget|HTMLLabelElement} labelElement
		 * @returns {Element|null}
		 */
		FastClick.prototype.findControl = function(labelElement) {

			// Fast path for newer browsers supporting the HTML5 control attribute
			if (labelElement.control !== undefined) {
				return labelElement.control;
			}

			// All browsers under test that support touch events also support the HTML5 htmlFor attribute
			if (labelElement.htmlFor) {
				return document.getElementById(labelElement.htmlFor);
			}

			// If no for attribute exists, attempt to retrieve the first labellable descendant element
			// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
			return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
		};


		/**
		 * On touch end, determine whether to send a click event at once.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchEnd = function(event) {
			var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

			if (!this.trackingClick) {
				return true;
			}

			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				this.cancelNextClick = true;
				return true;
			}

			if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
				return true;
			}

			// Reset to prevent wrong click cancel on input (issue #156).
			this.cancelNextClick = false;

			this.lastClickTime = event.timeStamp;

			trackingClickStart = this.trackingClickStart;
			this.trackingClick = false;
			this.trackingClickStart = 0;

			// On some iOS devices, the targetElement supplied with the event is invalid if the layer
			// is performing a transition or scroll, and has to be re-detected manually. Note that
			// for this to function correctly, it must be called *after* the event target is checked!
			// See issue #57; also filed as rdar://13048589 .
			if (deviceIsIOSWithBadTarget) {
				touch = event.changedTouches[0];

				// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
				targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
				targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
			}

			targetTagName = targetElement.tagName.toLowerCase();
			if (targetTagName === 'label') {
				forElement = this.findControl(targetElement);
				if (forElement) {
					this.focus(targetElement);
					if (deviceIsAndroid) {
						return false;
					}

					targetElement = forElement;
				}
			} else if (this.needsFocus(targetElement)) {

				// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
				// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
				if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
					this.targetElement = null;
					return false;
				}

				this.focus(targetElement);
				this.sendClick(targetElement, event);

				// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
				// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
				if (!deviceIsIOS || targetTagName !== 'select') {
					this.targetElement = null;
					event.preventDefault();
				}

				return false;
			}

			if (deviceIsIOS && !deviceIsIOS4) {

				// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
				// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
				scrollParent = targetElement.fastClickScrollParent;
				if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
					return true;
				}
			}

			// Prevent the actual click from going though - unless the target node is marked as requiring
			// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
			if (!this.needsClick(targetElement)) {
				event.preventDefault();
				this.sendClick(targetElement, event);
			}

			return false;
		};


		/**
		 * On touch cancel, stop tracking the click.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.onTouchCancel = function() {
			this.trackingClick = false;
			this.targetElement = null;
		};


		/**
		 * Determine mouse events which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onMouse = function(event) {

			// If a target element was never set (because a touch event was never fired) allow the event
			if (!this.targetElement) {
				return true;
			}

			if (event.forwardedTouchEvent) {
				return true;
			}

			// Programmatically generated events targeting a specific element should be permitted
			if (!event.cancelable) {
				return true;
			}

			// Derive and check the target element to see whether the mouse event needs to be permitted;
			// unless explicitly enabled, prevent non-touch click events from triggering actions,
			// to prevent ghost/doubleclicks.
			if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

				// Prevent any user-added listeners declared on FastClick element from being fired.
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {

					// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
					event.propagationStopped = true;
				}

				// Cancel the event
				event.stopPropagation();
				event.preventDefault();

				return false;
			}

			// If the mouse event is permitted, return true for the action to go through.
			return true;
		};


		/**
		 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
		 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
		 * an actual click which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onClick = function(event) {
			var permitted;

			// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
			if (this.trackingClick) {
				this.targetElement = null;
				this.trackingClick = false;
				return true;
			}

			// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
			if (event.target.type === 'submit' && event.detail === 0) {
				return true;
			}

			permitted = this.onMouse(event);

			// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
			if (!permitted) {
				this.targetElement = null;
			}

			// If clicks are permitted, return true for the action to go through.
			return permitted;
		};


		/**
		 * Remove all FastClick's event listeners.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.destroy = function() {
			var layer = this.layer;

			if (deviceIsAndroid) {
				layer.removeEventListener('mouseover', this.onMouse, true);
				layer.removeEventListener('mousedown', this.onMouse, true);
				layer.removeEventListener('mouseup', this.onMouse, true);
			}

			layer.removeEventListener('click', this.onClick, true);
			layer.removeEventListener('touchstart', this.onTouchStart, false);
			layer.removeEventListener('touchmove', this.onTouchMove, false);
			layer.removeEventListener('touchend', this.onTouchEnd, false);
			layer.removeEventListener('touchcancel', this.onTouchCancel, false);
		};


		/**
		 * Check whether FastClick is needed.
		 *
		 * @param {Element} layer The layer to listen on
		 */
		FastClick.notNeeded = function(layer) {
			var metaViewport;
			var chromeVersion;
			var blackberryVersion;
			var firefoxVersion;

			// Devices that don't support touch don't need FastClick
			if (typeof window.ontouchstart === 'undefined') {
				return true;
			}

			// Chrome version - zero for other browsers
			chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

			if (chromeVersion) {

				if (deviceIsAndroid) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// Chrome 32 and above with width=device-width or less don't need FastClick
						if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}

				// Chrome desktop doesn't need FastClick (issue #15)
				} else {
					return true;
				}
			}

			if (deviceIsBlackBerry10) {
				blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

				// BlackBerry 10.3+ does not require Fastclick library.
				// https://github.com/ftlabs/fastclick/issues/251
				if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// user-scalable=no eliminates click delay.
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// width=device-width (or less than device-width) eliminates click delay.
						if (document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}
				}
			}

			// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
			if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			// Firefox version - zero for other browsers
			firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

			if (firefoxVersion >= 27) {
				// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

				metaViewport = document.querySelector('meta[name=viewport]');
				if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
					return true;
				}
			}

			// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
			// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
			if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			return false;
		};


		/**
		 * Factory method for creating a FastClick object
		 *
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		FastClick.attach = function(layer, options) {
			return new FastClick(layer, options);
		};


		if (true) {

			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return FastClick;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = FastClick.attach;
			module.exports.FastClick = FastClick;
		} else {
			window.FastClick = FastClick;
		}
	}());


/***/ }
/******/ ]);