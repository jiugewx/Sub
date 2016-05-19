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
/******/ 	var hotCurrentHash = "9daeae75f79dfdb8bf43"; // eslint-disable-line no-unused-vars
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

	__webpack_require__(1);
	__webpack_require__(3);
	module.exports = __webpack_require__(76);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				__webpack_require__(2)(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});

		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}

		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {var url = __webpack_require__(4);
	var SockJS = __webpack_require__(10);
	var stripAnsi = __webpack_require__(74);
	var scriptElements = document.getElementsByTagName("script");
	var scriptHost = scriptElements[scriptElements.length-1].getAttribute("src").replace(/\/[^\/]+$/, "");

	// If this bundle is inlined, use the resource query to get the correct url.
	// Else, get the url from the <script> this file was called with.
	var urlParts = url.parse( true ?
		__resourceQuery.substr(1) :
		(scriptHost ? scriptHost : "/")
	);

	var sock = null;
	var hot = false;
	var initial = true;
	var currentHash = "";

	var onSocketMsg = {
		hot: function() {
			hot = true;
			console.log("[WDS] Hot Module Replacement enabled.");
		},
		invalid: function() {
			console.log("[WDS] App updated. Recompiling...");
		},
		hash: function(hash) {
			currentHash = hash;
		},
		"still-ok": function() {
			console.log("[WDS] Nothing changed.")
		},
		ok: function() {
			if(initial) return initial = false;
			reloadApp();
		},
		warnings: function(warnings) {
			console.log("[WDS] Warnings while compiling.");
			for(var i = 0; i < warnings.length; i++)
				console.warn(stripAnsi(warnings[i]));
			if(initial) return initial = false;
			reloadApp();
		},
		errors: function(errors) {
			console.log("[WDS] Errors while compiling.");
			for(var i = 0; i < errors.length; i++)
				console.error(stripAnsi(errors[i]));
			if(initial) return initial = false;
			reloadApp();
		},
		"proxy-error": function(errors) {
			console.log("[WDS] Proxy error.");
			for(var i = 0; i < errors.length; i++)
				console.error(stripAnsi(errors[i]));
			if(initial) return initial = false;
			reloadApp();
		}
	};

	var newConnection = function() {
		sock = new SockJS(url.format({
			protocol: urlParts.protocol,
			auth: urlParts.auth,
			hostname: (urlParts.hostname === '0.0.0.0') ? window.location.hostname : urlParts.hostname,
			port: urlParts.port,
			pathname: urlParts.path === '/' ? "/sockjs-node" : urlParts.path
		}));

		sock.onclose = function() {
			console.error("[WDS] Disconnected!");

			// Try to reconnect.
			sock = null;
			setTimeout(function () {
				newConnection();
			}, 2000);
		};

		sock.onmessage = function(e) {
			// This assumes that all data sent via the websocket is JSON.
			var msg = JSON.parse(e.data);
			onSocketMsg[msg.type](msg.data);
		};
	};

	newConnection();

	function reloadApp() {
		if(hot) {
			console.log("[WDS] App hot update...");
			window.postMessage("webpackHotUpdate" + currentHash, "*");
		} else {
			console.log("[WDS] App updated. Reloading...");
			window.location.reload();
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:8080"))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

	var punycode = __webpack_require__(5);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(7);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(8);
	exports.encode = exports.stringify = __webpack_require__(9);


/***/ },
/* 8 */
/***/ function(module, exports) {

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

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

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

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var transportList = __webpack_require__(11);

	module.exports = __webpack_require__(58)(transportList);

	// TODO can't get rid of this until all servers do
	if ('_sockjs_onload' in global) {
	  setTimeout(global._sockjs_onload, 1);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = [
	  // streaming transports
	  __webpack_require__(12)
	, __webpack_require__(29)
	, __webpack_require__(39)
	, __webpack_require__(41)
	, __webpack_require__(44)(__webpack_require__(41))

	  // polling transports
	, __webpack_require__(51)
	, __webpack_require__(44)(__webpack_require__(51))
	, __webpack_require__(53)
	, __webpack_require__(54)
	, __webpack_require__(44)(__webpack_require__(53))
	, __webpack_require__(55)
	];


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(14)
	  , urlUtils = __webpack_require__(17)
	  , inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  , WebsocketDriver = __webpack_require__(28)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:websocket');
	}

	function WebSocketTransport(transUrl, ignore, options) {
	  if (!WebSocketTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }

	  EventEmitter.call(this);
	  debug('constructor', transUrl);

	  var self = this;
	  var url = urlUtils.addPath(transUrl, '/websocket');
	  if (url.slice(0, 5) === 'https') {
	    url = 'wss' + url.slice(5);
	  } else {
	    url = 'ws' + url.slice(4);
	  }
	  this.url = url;

	  this.ws = new WebsocketDriver(this.url, undefined, options);
	  this.ws.onmessage = function(e) {
	    debug('message event', e.data);
	    self.emit('message', e.data);
	  };
	  // Firefox has an interesting bug. If a websocket connection is
	  // created after onunload, it stays alive even when user
	  // navigates away from the page. In such situation let's lie -
	  // let's not open the ws connection at all. See:
	  // https://github.com/sockjs/sockjs-client/issues/28
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
	  this.unloadRef = utils.unloadAdd(function() {
	    debug('unload');
	    self.ws.close();
	  });
	  this.ws.onclose = function(e) {
	    debug('close event', e.code, e.reason);
	    self.emit('close', e.code, e.reason);
	    self._cleanup();
	  };
	  this.ws.onerror = function(e) {
	    debug('error event', e);
	    self.emit('close', 1006, 'WebSocket connection broken');
	    self._cleanup();
	  };
	}

	inherits(WebSocketTransport, EventEmitter);

	WebSocketTransport.prototype.send = function(data) {
	  var msg = '[' + data + ']';
	  debug('send', msg);
	  this.ws.send(msg);
	};

	WebSocketTransport.prototype.close = function() {
	  debug('close');
	  if (this.ws) {
	    this.ws.close();
	  }
	  this._cleanup();
	};

	WebSocketTransport.prototype._cleanup = function() {
	  debug('_cleanup');
	  var ws = this.ws;
	  if (ws) {
	    ws.onmessage = ws.onclose = ws.onerror = null;
	  }
	  utils.unloadDel(this.unloadRef);
	  this.unloadRef = this.ws = null;
	  this.removeAllListeners();
	};

	WebSocketTransport.enabled = function() {
	  debug('enabled');
	  return !!WebsocketDriver;
	};
	WebSocketTransport.transportName = 'websocket';

	// In theory, ws should require 1 round trip. But in chrome, this is
	// not very stable over SSL. Most likely a ws connection requires a
	// separate SSL connection, in which case 2 round trips are an
	// absolute minumum.
	WebSocketTransport.roundTrips = 2;

	module.exports = WebSocketTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var random = __webpack_require__(15);

	var onUnload = {}
	  , afterUnload = false
	    // detect google chrome packaged apps because they don't allow the 'unload' event
	  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
	  ;

	module.exports = {
	  attachEvent: function(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.addEventListener(event, listener, false);
	    } else if (global.document && global.attachEvent) {
	      // IE quirks.
	      // According to: http://stevesouders.com/misc/test-postmessage.php
	      // the message gets delivered only to 'document', not 'window'.
	      global.document.attachEvent('on' + event, listener);
	      // I get 'window' for ie8.
	      global.attachEvent('on' + event, listener);
	    }
	  }

	, detachEvent: function(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.removeEventListener(event, listener, false);
	    } else if (global.document && global.detachEvent) {
	      global.document.detachEvent('on' + event, listener);
	      global.detachEvent('on' + event, listener);
	    }
	  }

	, unloadAdd: function(listener) {
	    if (isChromePackagedApp) {
	      return null;
	    }

	    var ref = random.string(8);
	    onUnload[ref] = listener;
	    if (afterUnload) {
	      setTimeout(this.triggerUnloadCallbacks, 0);
	    }
	    return ref;
	  }

	, unloadDel: function(ref) {
	    if (ref in onUnload) {
	      delete onUnload[ref];
	    }
	  }

	, triggerUnloadCallbacks: function() {
	    for (var ref in onUnload) {
	      onUnload[ref]();
	      delete onUnload[ref];
	    }
	  }
	};

	var unloadTriggered = function() {
	  if (afterUnload) {
	    return;
	  }
	  afterUnload = true;
	  module.exports.triggerUnloadCallbacks();
	};

	// 'unload' alone is not reliable in opera within an iframe, but we
	// can't use `beforeunload` as IE fires it on javascript: links.
	if (!isChromePackagedApp) {
	  module.exports.attachEvent('unload', unloadTriggered);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* global crypto:true */
	var crypto = __webpack_require__(16);

	// This string has length 32, a power of 2, so the modulus doesn't introduce a
	// bias.
	var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
	module.exports = {
	  string: function(length) {
	    var max = _randomStringChars.length;
	    var bytes = crypto.randomBytes(length);
	    var ret = [];
	    for (var i = 0; i < length; i++) {
	      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
	    }
	    return ret.join('');
	  }

	, number: function(max) {
	    return Math.floor(Math.random() * max);
	  }

	, numberString: function(max) {
	    var t = ('' + (max - 1)).length;
	    var p = new Array(t + 1).join('0');
	    return (p + this.number(max)).slice(-t);
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	if (global.crypto && global.crypto.getRandomValues) {
	  module.exports.randomBytes = function(length) {
	    var bytes = new Uint8Array(length);
	    global.crypto.getRandomValues(bytes);
	    return bytes;
	  };
	} else {
	  module.exports.randomBytes = function(length) {
	    var bytes = new Array(length);
	    for (var i = 0; i < length; i++) {
	      bytes[i] = Math.floor(Math.random() * 256);
	    }
	    return bytes;
	  };
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var URL = __webpack_require__(18);

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:utils:url');
	}

	module.exports = {
	  getOrigin: function(url) {
	    if (!url) {
	      return null;
	    }

	    var p = new URL(url);
	    if (p.protocol === 'file:') {
	      return null;
	    }

	    var port = p.port;
	    if (!port) {
	      port = (p.protocol === 'https:') ? '443' : '80';
	    }

	    return p.protocol + '//' + p.hostname + ':' + port;
	  }

	, isOriginEqual: function(a, b) {
	    var res = this.getOrigin(a) === this.getOrigin(b);
	    debug('same', a, b, res);
	    return res;
	  }

	, isSchemeEqual: function(a, b) {
	    return (a.split(':')[0] === b.split(':')[0]);
	  }

	, addPath: function (url, path) {
	    var qs = url.split('?');
	    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
	  }

	, addQuery: function (url, q) {
	    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var required = __webpack_require__(19)
	  , lolcation = __webpack_require__(20)
	  , qs = __webpack_require__(21)
	  , relativere = /^\/(?!\/)/
	  , protocolre = /^([a-z0-9.+-]+:)?(\/\/)?(.*)$/i; // actual protocol is first match

	/**
	 * These are the parse instructions for the URL parsers, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var instructions = [
	  ['#', 'hash'],                        // Extract from the back.
	  ['?', 'query'],                       // Extract from the back.
	  ['/', 'pathname'],                    // Extract from the back.
	  ['@', 'auth', 1],                     // Extract from the front.
	  [NaN, 'host', undefined, 1, 1],       // Set left over value.
	  [/\:(\d+)$/, 'port'],                 // RegExp the back.
	  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
	];

	 /**
	 * @typedef ProtocolExtract
	 * @type Object
	 * @property {String} protocol Protocol matched in the URL, in lowercase
	 * @property {Boolean} slashes Indicates whether the protocol is followed by double slash ("//")
	 * @property {String} rest     Rest of the URL that is not part of the protocol
	 */

	 /**
	  * Extract protocol information from a URL with/without double slash ("//")
	  *
	  * @param  {String} address   URL we want to extract from.
	  * @return {ProtocolExtract}  Extracted information
	  * @private
	  */
	function extractProtocol(address) {
	  var match = protocolre.exec(address);
	  return {
	    protocol: match[1] ? match[1].toLowerCase() : '',
	    slashes: !!match[2],
	    rest: match[3] ? match[3] : ''
	  };
	}

	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my CDO.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Object|String} location Location defaults for relative paths.
	 * @param {Boolean|Function} parser Parser for the query string.
	 * @api public
	 */
	function URL(address, location, parser) {
	  if (!(this instanceof URL)) {
	    return new URL(address, location, parser);
	  }

	  var relative = relativere.test(address)
	    , parse, instruction, index, key
	    , type = typeof location
	    , url = this
	    , i = 0;

	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }

	  if (parser && 'function' !== typeof parser) {
	    parser = qs.parse;
	  }

	  location = lolcation(location);

	  // extract protocol information before running the instructions
	  var extracted = extractProtocol(address);
	  url.protocol = extracted.protocol || location.protocol || '';
	  url.slashes = extracted.slashes || location.slashes;
	  address = extracted.rest;

	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];
	    parse = instruction[0];
	    key = instruction[1];

	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if (index = parse.exec(address)) {
	      url[key] = index[1];
	      address = address.slice(0, address.length - index[0].length);
	    }

	    url[key] = url[key] || (instruction[3] || ('port' === key && relative) ? location[key] || '' : '');

	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) {
	      url[key] = url[key].toLowerCase();
	    }
	  }

	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);

	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }

	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }

	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}

	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} prop          Property we need to adjust.
	 * @param {Mixed} value          The newly assigned value.
	 * @param {Boolean|Function} fn  When setting the query, it will be the function used to parse
	 *                               the query.
	 *                               When setting the protocol, double slash will be removed from
	 *                               the final url if it is true.
	 * @returns {URL}
	 * @api public
	 */
	URL.prototype.set = function set(part, value, fn) {
	  var url = this;

	  if ('query' === part) {
	    if ('string' === typeof value && value.length) {
	      value = (fn || qs.parse)(value);
	    }

	    url[part] = value;
	  } else if ('port' === part) {
	    url[part] = value;

	    if (!required(value, url.protocol)) {
	      url.host = url.hostname;
	      url[part] = '';
	    } else if (value) {
	      url.host = url.hostname +':'+ value;
	    }
	  } else if ('hostname' === part) {
	    url[part] = value;

	    if (url.port) value += ':'+ url.port;
	    url.host = value;
	  } else if ('host' === part) {
	    url[part] = value;

	    if (/\:\d+/.test(value)) {
	      value = value.split(':');
	      url.hostname = value[0];
	      url.port = value[1];
	    }
	  } else if ('protocol' === part) {
	    url.protocol = value;
	    url.slashes = !fn;
	  } else {
	    url[part] = value;
	  }

	  url.href = url.toString();
	  return url;
	};

	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String}
	 * @api public
	 */
	URL.prototype.toString = function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

	  var query
	    , url = this
	    , protocol = url.protocol;

	  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

	  var result = protocol + (url.slashes ? '//' : '');

	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':'+ url.password;
	    result += '@';
	  }

	  result += url.hostname;
	  if (url.port) result += ':'+ url.port;

	  result += url.pathname;

	  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

	  if (url.hash) result += url.hash;

	  return result;
	};

	//
	// Expose the URL parser and some additional properties that might be useful for
	// others.
	//
	URL.qs = qs;
	URL.location = lolcation;
	module.exports = URL;


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */
	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;

	  if (!port) return false;

	  switch (protocol) {
	    case 'http':
	    case 'ws':
	    return port !== 80;

	    case 'https':
	    case 'wss':
	    return port !== 443;

	    case 'ftp':
	    return port !== 21;

	    case 'gopher':
	    return port !== 70;

	    case 'file':
	    return false;
	  }

	  return port !== 0;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 }
	  , URL;

	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object|String} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @api public
	 */
	module.exports = function lolcation(loc) {
	  loc = loc || global.location || {};
	  URL = URL || __webpack_require__(18);

	  var finaldestination = {}
	    , type = typeof loc
	    , key;

	  if ('blob:' === loc.protocol) {
	    finaldestination = new URL(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new URL(loc, {});
	    for (key in ignore) delete finaldestination[key];
	  } else if ('object' === type) {
	    for (key in loc) {
	      if (key in ignore) continue;
	      finaldestination[key] = loc[key];
	    }

	    if (finaldestination.slashes === undefined) {
	      finaldestination.slashes = slashes.test(loc.href);
	    }
	  }

	  return finaldestination;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=([^&]*)/g
	    , result = {}
	    , part;

	  //
	  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
	  // the lastIndex property so we can continue executing this loop until we've
	  // parsed all results.
	  //
	  for (;
	    part = parser.exec(query);
	    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
	  );

	  return result;
	}

	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';

	  var pairs = [];

	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';

	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
	    }
	  }

	  return pairs.length ? prefix + pairs.join('&') : '';
	}

	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(23);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(24);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 25 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , EventTarget = __webpack_require__(27)
	  ;

	function EventEmitter() {
	  EventTarget.call(this);
	}

	inherits(EventEmitter, EventTarget);

	EventEmitter.prototype.removeAllListeners = function(type) {
	  if (type) {
	    delete this._listeners[type];
	  } else {
	    this._listeners = {};
	  }
	};

	EventEmitter.prototype.once = function(type, listener) {
	  var self = this
	    , fired = false;

	  function g() {
	    self.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  this.on(type, g);
	};

	EventEmitter.prototype.emit = function() {
	  var type = arguments[0];
	  var listeners = this._listeners[type];
	  if (!listeners) {
	    return;
	  }
	  // equivalent of Array.prototype.slice.call(arguments, 1);
	  var l = arguments.length;
	  var args = new Array(l - 1);
	  for (var ai = 1; ai < l; ai++) {
	    args[ai - 1] = arguments[ai];
	  }
	  for (var i = 0; i < listeners.length; i++) {
	    listeners[i].apply(this, args);
	  }
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
	EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

	module.exports.EventEmitter = EventEmitter;


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	/* Simplified implementation of DOM2 EventTarget.
	 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
	 */

	function EventTarget() {
	  this._listeners = {};
	}

	EventTarget.prototype.addEventListener = function(eventType, listener) {
	  if (!(eventType in this._listeners)) {
	    this._listeners[eventType] = [];
	  }
	  var arr = this._listeners[eventType];
	  // #4
	  if (arr.indexOf(listener) === -1) {
	    // Make a copy so as not to interfere with a current dispatchEvent.
	    arr = arr.concat([listener]);
	  }
	  this._listeners[eventType] = arr;
	};

	EventTarget.prototype.removeEventListener = function(eventType, listener) {
	  var arr = this._listeners[eventType];
	  if (!arr) {
	    return;
	  }
	  var idx = arr.indexOf(listener);
	  if (idx !== -1) {
	    if (arr.length > 1) {
	      // Make a copy so as not to interfere with a current dispatchEvent.
	      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
	    } else {
	      delete this._listeners[eventType];
	    }
	    return;
	  }
	};

	EventTarget.prototype.dispatchEvent = function() {
	  var event = arguments[0];
	  var t = event.type;
	  // equivalent of Array.prototype.slice.call(arguments, 0);
	  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
	  // TODO: This doesn't match the real behavior; per spec, onfoo get
	  // their place in line from the /first/ time they're set from
	  // non-null. Although WebKit bumps it to the end every time it's
	  // set.
	  if (this['on' + t]) {
	    this['on' + t].apply(this, args);
	  }
	  if (t in this._listeners) {
	    // Grab a reference to the listeners list. removeEventListener may alter the list.
	    var listeners = this._listeners[t];
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i].apply(this, args);
	    }
	  }
	};

	module.exports = EventTarget;


/***/ },
/* 28 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.WebSocket || global.MozWebSocket;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(25)
	  , AjaxBasedTransport = __webpack_require__(30)
	  , XhrReceiver = __webpack_require__(34)
	  , XHRCorsObject = __webpack_require__(35)
	  , XHRLocalObject = __webpack_require__(37)
	  , browser = __webpack_require__(38)
	  ;

	function XhrStreamingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
	}

	inherits(XhrStreamingTransport, AjaxBasedTransport);

	XhrStreamingTransport.enabled = function(info) {
	  if (info.nullOrigin) {
	    return false;
	  }
	  // Opera doesn't support xhr-streaming #60
	  // But it might be able to #92
	  if (browser.isOpera()) {
	    return false;
	  }

	  return XHRCorsObject.enabled;
	};

	XhrStreamingTransport.transportName = 'xhr-streaming';
	XhrStreamingTransport.roundTrips = 2; // preflight, ajax

	// Safari gets confused when a streaming ajax request is started
	// before onload. This causes the load indicator to spin indefinetely.
	// Only require body when used in a browser
	XhrStreamingTransport.needBody = !!global.document;

	module.exports = XhrStreamingTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(25)
	  , urlUtils = __webpack_require__(17)
	  , SenderReceiver = __webpack_require__(31)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:ajax-based');
	}

	function createAjaxSender(AjaxObject) {
	  return function(url, payload, callback) {
	    debug('create ajax sender', url, payload);
	    var opt = {};
	    if (typeof payload === 'string') {
	      opt.headers = {'Content-type': 'text/plain'};
	    }
	    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
	    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
	    xo.once('finish', function(status) {
	      debug('finish', status);
	      xo = null;

	      if (status !== 200 && status !== 204) {
	        return callback(new Error('http status ' + status));
	      }
	      callback();
	    });
	    return function() {
	      debug('abort');
	      xo.close();
	      xo = null;

	      var err = new Error('Aborted');
	      err.code = 1000;
	      callback(err);
	    };
	  };
	}

	function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
	  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
	}

	inherits(AjaxBasedTransport, SenderReceiver);

	module.exports = AjaxBasedTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(25)
	  , urlUtils = __webpack_require__(17)
	  , BufferedSender = __webpack_require__(32)
	  , Polling = __webpack_require__(33)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:sender-receiver');
	}

	function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
	  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
	  debug(pollUrl);
	  var self = this;
	  BufferedSender.call(this, transUrl, senderFunc);

	  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
	  this.poll.on('message', function(msg) {
	    debug('poll message', msg);
	    self.emit('message', msg);
	  });
	  this.poll.once('close', function(code, reason) {
	    debug('poll close', code, reason);
	    self.poll = null;
	    self.emit('close', code, reason);
	    self.close();
	  });
	}

	inherits(SenderReceiver, BufferedSender);

	SenderReceiver.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  if (this.poll) {
	    this.poll.abort();
	    this.poll = null;
	  }
	  this.stop();
	};

	module.exports = SenderReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:buffered-sender');
	}

	function BufferedSender(url, sender) {
	  debug(url);
	  EventEmitter.call(this);
	  this.sendBuffer = [];
	  this.sender = sender;
	  this.url = url;
	}

	inherits(BufferedSender, EventEmitter);

	BufferedSender.prototype.send = function(message) {
	  debug('send', message);
	  this.sendBuffer.push(message);
	  if (!this.sendStop) {
	    this.sendSchedule();
	  }
	};

	// For polling transports in a situation when in the message callback,
	// new message is being send. If the sending connection was started
	// before receiving one, it is possible to saturate the network and
	// timeout due to the lack of receiving socket. To avoid that we delay
	// sending messages by some small time, in order to let receiving
	// connection be started beforehand. This is only a halfmeasure and
	// does not fix the big problem, but it does make the tests go more
	// stable on slow networks.
	BufferedSender.prototype.sendScheduleWait = function() {
	  debug('sendScheduleWait');
	  var self = this;
	  var tref;
	  this.sendStop = function() {
	    debug('sendStop');
	    self.sendStop = null;
	    clearTimeout(tref);
	  };
	  tref = setTimeout(function() {
	    debug('timeout');
	    self.sendStop = null;
	    self.sendSchedule();
	  }, 25);
	};

	BufferedSender.prototype.sendSchedule = function() {
	  debug('sendSchedule', this.sendBuffer.length);
	  var self = this;
	  if (this.sendBuffer.length > 0) {
	    var payload = '[' + this.sendBuffer.join(',') + ']';
	    this.sendStop = this.sender(this.url, payload, function(err) {
	      self.sendStop = null;
	      if (err) {
	        debug('error', err);
	        self.emit('close', err.code || 1006, 'Sending error: ' + err);
	        self._cleanup();
	      } else {
	        self.sendScheduleWait();
	      }
	    });
	    this.sendBuffer = [];
	  }
	};

	BufferedSender.prototype._cleanup = function() {
	  debug('_cleanup');
	  this.removeAllListeners();
	};

	BufferedSender.prototype.stop = function() {
	  debug('stop');
	  this._cleanup();
	  if (this.sendStop) {
	    this.sendStop();
	    this.sendStop = null;
	  }
	};

	module.exports = BufferedSender;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:polling');
	}

	function Polling(Receiver, receiveUrl, AjaxObject) {
	  debug(receiveUrl);
	  EventEmitter.call(this);
	  this.Receiver = Receiver;
	  this.receiveUrl = receiveUrl;
	  this.AjaxObject = AjaxObject;
	  this._scheduleReceiver();
	}

	inherits(Polling, EventEmitter);

	Polling.prototype._scheduleReceiver = function() {
	  debug('_scheduleReceiver');
	  var self = this;
	  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

	  poll.on('message', function(msg) {
	    debug('message', msg);
	    self.emit('message', msg);
	  });

	  poll.once('close', function(code, reason) {
	    debug('close', code, reason, self.pollIsClosing);
	    self.poll = poll = null;

	    if (!self.pollIsClosing) {
	      if (reason === 'network') {
	        self._scheduleReceiver();
	      } else {
	        self.emit('close', code || 1006, reason);
	        self.removeAllListeners();
	      }
	    }
	  });
	};

	Polling.prototype.abort = function() {
	  debug('abort');
	  this.removeAllListeners();
	  this.pollIsClosing = true;
	  if (this.poll) {
	    this.poll.abort();
	  }
	};

	module.exports = Polling;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:receiver:xhr');
	}

	function XhrReceiver(url, AjaxObject) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;

	  this.bufferPosition = 0;

	  this.xo = new AjaxObject('POST', url, null);
	  this.xo.on('chunk', this._chunkHandler.bind(this));
	  this.xo.once('finish', function(status, text) {
	    debug('finish', status, text);
	    self._chunkHandler(status, text);
	    self.xo = null;
	    var reason = status === 200 ? 'network' : 'permanent';
	    debug('close', reason);
	    self.emit('close', null, reason);
	    self._cleanup();
	  });
	}

	inherits(XhrReceiver, EventEmitter);

	XhrReceiver.prototype._chunkHandler = function(status, text) {
	  debug('_chunkHandler', status);
	  if (status !== 200 || !text) {
	    return;
	  }

	  for (var idx = -1; ; this.bufferPosition += idx + 1) {
	    var buf = text.slice(this.bufferPosition);
	    idx = buf.indexOf('\n');
	    if (idx === -1) {
	      break;
	    }
	    var msg = buf.slice(0, idx);
	    if (msg) {
	      debug('message', msg);
	      this.emit('message', msg);
	    }
	  }
	};

	XhrReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  this.removeAllListeners();
	};

	XhrReceiver.prototype.abort = function() {
	  debug('abort');
	  if (this.xo) {
	    this.xo.close();
	    debug('close');
	    this.emit('close', null, 'user');
	    this.xo = null;
	  }
	  this._cleanup();
	};

	module.exports = XhrReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , XhrDriver = __webpack_require__(36)
	  ;

	function XHRCorsObject(method, url, payload, opts) {
	  XhrDriver.call(this, method, url, payload, opts);
	}

	inherits(XHRCorsObject, XhrDriver);

	XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

	module.exports = XHRCorsObject;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var EventEmitter = __webpack_require__(26).EventEmitter
	  , inherits = __webpack_require__(25)
	  , utils = __webpack_require__(14)
	  , urlUtils = __webpack_require__(17)
	  , XHR = global.XMLHttpRequest
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:browser:xhr');
	}

	function AbstractXHRObject(method, url, payload, opts) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function () {
	    self._start(method, url, payload, opts);
	  }, 0);
	}

	inherits(AbstractXHRObject, EventEmitter);

	AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
	  var self = this;

	  try {
	    this.xhr = new XHR();
	  } catch (x) {
	    // intentionally empty
	  }

	  if (!this.xhr) {
	    debug('no xhr');
	    this.emit('finish', 0, 'no xhr support');
	    this._cleanup();
	    return;
	  }

	  // several browsers cache POSTs
	  url = urlUtils.addQuery(url, 't=' + (+new Date()));

	  // Explorer tends to keep connection open, even after the
	  // tab gets closed: http://bugs.jquery.com/ticket/5280
	  this.unloadRef = utils.unloadAdd(function() {
	    debug('unload cleanup');
	    self._cleanup(true);
	  });
	  try {
	    this.xhr.open(method, url, true);
	    if (this.timeout && 'timeout' in this.xhr) {
	      this.xhr.timeout = this.timeout;
	      this.xhr.ontimeout = function() {
	        debug('xhr timeout');
	        self.emit('finish', 0, '');
	        self._cleanup(false);
	      };
	    }
	  } catch (e) {
	    debug('exception', e);
	    // IE raises an exception on wrong port.
	    this.emit('finish', 0, '');
	    this._cleanup(false);
	    return;
	  }

	  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
	    debug('withCredentials');
	    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
	    // "This never affects same-site requests."

	    this.xhr.withCredentials = 'true';
	  }
	  if (opts && opts.headers) {
	    for (var key in opts.headers) {
	      this.xhr.setRequestHeader(key, opts.headers[key]);
	    }
	  }

	  this.xhr.onreadystatechange = function() {
	    if (self.xhr) {
	      var x = self.xhr;
	      var text, status;
	      debug('readyState', x.readyState);
	      switch (x.readyState) {
	      case 3:
	        // IE doesn't like peeking into responseText or status
	        // on Microsoft.XMLHTTP and readystate=3
	        try {
	          status = x.status;
	          text = x.responseText;
	        } catch (e) {
	          // intentionally empty
	        }
	        debug('status', status);
	        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	        if (status === 1223) {
	          status = 204;
	        }

	        // IE does return readystate == 3 for 404 answers.
	        if (status === 200 && text && text.length > 0) {
	          debug('chunk');
	          self.emit('chunk', status, text);
	        }
	        break;
	      case 4:
	        status = x.status;
	        debug('status', status);
	        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	        if (status === 1223) {
	          status = 204;
	        }
	        // IE returns this for a bad port
	        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
	        if (status === 12005 || status === 12029) {
	          status = 0;
	        }

	        debug('finish', status, x.responseText);
	        self.emit('finish', status, x.responseText);
	        self._cleanup(false);
	        break;
	      }
	    }
	  };

	  try {
	    self.xhr.send(payload);
	  } catch (e) {
	    self.emit('finish', 0, '');
	    self._cleanup(false);
	  }
	};

	AbstractXHRObject.prototype._cleanup = function(abort) {
	  debug('cleanup');
	  if (!this.xhr) {
	    return;
	  }
	  this.removeAllListeners();
	  utils.unloadDel(this.unloadRef);

	  // IE needs this field to be a function
	  this.xhr.onreadystatechange = function() {};
	  if (this.xhr.ontimeout) {
	    this.xhr.ontimeout = null;
	  }

	  if (abort) {
	    try {
	      this.xhr.abort();
	    } catch (x) {
	      // intentionally empty
	    }
	  }
	  this.unloadRef = this.xhr = null;
	};

	AbstractXHRObject.prototype.close = function() {
	  debug('close');
	  this._cleanup(true);
	};

	AbstractXHRObject.enabled = !!XHR;
	// override XMLHttpRequest for IE6/7
	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (!AbstractXHRObject.enabled && (axo in global)) {
	  debug('overriding xmlhttprequest');
	  XHR = function() {
	    try {
	      return new global[axo]('Microsoft.XMLHTTP');
	    } catch (e) {
	      return null;
	    }
	  };
	  AbstractXHRObject.enabled = !!new XHR();
	}

	var cors = false;
	try {
	  cors = 'withCredentials' in new XHR();
	} catch (ignored) {
	  // intentionally empty
	}

	AbstractXHRObject.supportsCORS = cors;

	module.exports = AbstractXHRObject;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(13)))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , XhrDriver = __webpack_require__(36)
	  ;

	function XHRLocalObject(method, url, payload /*, opts */) {
	  XhrDriver.call(this, method, url, payload, {
	    noCredentials: true
	  });
	}

	inherits(XHRLocalObject, XhrDriver);

	XHRLocalObject.enabled = XhrDriver.enabled;

	module.exports = XHRLocalObject;


/***/ },
/* 38 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = {
	  isOpera: function() {
	    return global.navigator &&
	      /opera/i.test(global.navigator.userAgent);
	  }

	, isKonqueror: function() {
	    return global.navigator &&
	      /konqueror/i.test(global.navigator.userAgent);
	  }

	  // #187 wrap document.domain in try/catch because of WP8 from file:///
	, hasDomain: function () {
	    // non-browser client always has a domain
	    if (!global.document) {
	      return true;
	    }

	    try {
	      return !!global.document.domain;
	    } catch (e) {
	      return false;
	    }
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , AjaxBasedTransport = __webpack_require__(30)
	  , XhrReceiver = __webpack_require__(34)
	  , XDRObject = __webpack_require__(40)
	  ;

	// According to:
	//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
	//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

	function XdrStreamingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
	}

	inherits(XdrStreamingTransport, AjaxBasedTransport);

	XdrStreamingTransport.enabled = function(info) {
	  if (info.cookie_needed || info.nullOrigin) {
	    return false;
	  }
	  return XDRObject.enabled && info.sameScheme;
	};

	XdrStreamingTransport.transportName = 'xdr-streaming';
	XdrStreamingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XdrStreamingTransport;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var EventEmitter = __webpack_require__(26).EventEmitter
	  , inherits = __webpack_require__(25)
	  , eventUtils = __webpack_require__(14)
	  , browser = __webpack_require__(38)
	  , urlUtils = __webpack_require__(17)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:sender:xdr');
	}

	// References:
	//   http://ajaxian.com/archives/100-line-ajax-wrapper
	//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

	function XDRObject(method, url, payload) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function() {
	    self._start(method, url, payload);
	  }, 0);
	}

	inherits(XDRObject, EventEmitter);

	XDRObject.prototype._start = function(method, url, payload) {
	  debug('_start');
	  var self = this;
	  var xdr = new global.XDomainRequest();
	  // IE caches even POSTs
	  url = urlUtils.addQuery(url, 't=' + (+new Date()));

	  xdr.onerror = function() {
	    debug('onerror');
	    self._error();
	  };
	  xdr.ontimeout = function() {
	    debug('ontimeout');
	    self._error();
	  };
	  xdr.onprogress = function() {
	    debug('progress', xdr.responseText);
	    self.emit('chunk', 200, xdr.responseText);
	  };
	  xdr.onload = function() {
	    debug('load');
	    self.emit('finish', 200, xdr.responseText);
	    self._cleanup(false);
	  };
	  this.xdr = xdr;
	  this.unloadRef = eventUtils.unloadAdd(function() {
	    self._cleanup(true);
	  });
	  try {
	    // Fails with AccessDenied if port number is bogus
	    this.xdr.open(method, url);
	    if (this.timeout) {
	      this.xdr.timeout = this.timeout;
	    }
	    this.xdr.send(payload);
	  } catch (x) {
	    this._error();
	  }
	};

	XDRObject.prototype._error = function() {
	  this.emit('finish', 0, '');
	  this._cleanup(false);
	};

	XDRObject.prototype._cleanup = function(abort) {
	  debug('cleanup', abort);
	  if (!this.xdr) {
	    return;
	  }
	  this.removeAllListeners();
	  eventUtils.unloadDel(this.unloadRef);

	  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
	  if (abort) {
	    try {
	      this.xdr.abort();
	    } catch (x) {
	      // intentionally empty
	    }
	  }
	  this.unloadRef = this.xdr = null;
	};

	XDRObject.prototype.close = function() {
	  debug('close');
	  this._cleanup(true);
	};

	// IE 8/9 if the request target uses the same scheme - #79
	XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

	module.exports = XDRObject;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , AjaxBasedTransport = __webpack_require__(30)
	  , EventSourceReceiver = __webpack_require__(42)
	  , XHRCorsObject = __webpack_require__(35)
	  , EventSourceDriver = __webpack_require__(43)
	  ;

	function EventSourceTransport(transUrl) {
	  if (!EventSourceTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }

	  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
	}

	inherits(EventSourceTransport, AjaxBasedTransport);

	EventSourceTransport.enabled = function() {
	  return !!EventSourceDriver;
	};

	EventSourceTransport.transportName = 'eventsource';
	EventSourceTransport.roundTrips = 2;

	module.exports = EventSourceTransport;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  , EventSourceDriver = __webpack_require__(43)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:receiver:eventsource');
	}

	function EventSourceReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);

	  var self = this;
	  var es = this.es = new EventSourceDriver(url);
	  es.onmessage = function(e) {
	    debug('message', e.data);
	    self.emit('message', decodeURI(e.data));
	  };
	  es.onerror = function(e) {
	    debug('error', es.readyState, e);
	    // ES on reconnection has readyState = 0 or 1.
	    // on network error it's CLOSED = 2
	    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
	    self._cleanup();
	    self._close(reason);
	  };
	}

	inherits(EventSourceReceiver, EventEmitter);

	EventSourceReceiver.prototype.abort = function() {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};

	EventSourceReceiver.prototype._cleanup = function() {
	  debug('cleanup');
	  var es = this.es;
	  if (es) {
	    es.onmessage = es.onerror = null;
	    es.close();
	    this.es = null;
	  }
	};

	EventSourceReceiver.prototype._close = function(reason) {
	  debug('close', reason);
	  var self = this;
	  // Safari and chrome < 15 crash if we close window before
	  // waiting for ES cleanup. See:
	  // https://code.google.com/p/chromium/issues/detail?id=89155
	  setTimeout(function() {
	    self.emit('close', null, reason);
	    self.removeAllListeners();
	  }, 200);
	};

	module.exports = EventSourceReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 43 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.EventSource;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(25)
	  , IframeTransport = __webpack_require__(45)
	  , objectUtils = __webpack_require__(50)
	  ;

	module.exports = function(transport) {

	  function IframeWrapTransport(transUrl, baseUrl) {
	    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
	  }

	  inherits(IframeWrapTransport, IframeTransport);

	  IframeWrapTransport.enabled = function(url, info) {
	    if (!global.document) {
	      return false;
	    }

	    var iframeInfo = objectUtils.extend({}, info);
	    iframeInfo.sameOrigin = true;
	    return transport.enabled(iframeInfo) && IframeTransport.enabled();
	  };

	  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
	  IframeWrapTransport.needBody = true;
	  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

	  IframeWrapTransport.facadeTransport = transport;

	  return IframeWrapTransport;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	// Few cool transports do work only for same-origin. In order to make
	// them work cross-domain we shall use iframe, served from the
	// remote domain. New browsers have capabilities to communicate with
	// cross domain iframe using postMessage(). In IE it was implemented
	// from IE 8+, but of course, IE got some details wrong:
	//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
	//    http://stevesouders.com/misc/test-postmessage.php

	var inherits = __webpack_require__(25)
	  , JSON3 = __webpack_require__(46)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  , version = __webpack_require__(48)
	  , urlUtils = __webpack_require__(17)
	  , iframeUtils = __webpack_require__(49)
	  , eventUtils = __webpack_require__(14)
	  , random = __webpack_require__(15)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:transport:iframe');
	}

	function IframeTransport(transport, transUrl, baseUrl) {
	  if (!IframeTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  EventEmitter.call(this);

	  var self = this;
	  this.origin = urlUtils.getOrigin(baseUrl);
	  this.baseUrl = baseUrl;
	  this.transUrl = transUrl;
	  this.transport = transport;
	  this.windowId = random.string(8);

	  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
	  debug(transport, transUrl, iframeUrl);

	  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
	    debug('err callback');
	    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
	    self.close();
	  });

	  this.onmessageCallback = this._message.bind(this);
	  eventUtils.attachEvent('message', this.onmessageCallback);
	}

	inherits(IframeTransport, EventEmitter);

	IframeTransport.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  if (this.iframeObj) {
	    eventUtils.detachEvent('message', this.onmessageCallback);
	    try {
	      // When the iframe is not loaded, IE raises an exception
	      // on 'contentWindow'.
	      this.postMessage('c');
	    } catch (x) {
	      // intentionally empty
	    }
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	    this.onmessageCallback = this.iframeObj = null;
	  }
	};

	IframeTransport.prototype._message = function(e) {
	  debug('message', e.data);
	  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
	    debug('not same origin', e.origin, this.origin);
	    return;
	  }

	  var iframeMessage;
	  try {
	    iframeMessage = JSON3.parse(e.data);
	  } catch (ignored) {
	    debug('bad json', e.data);
	    return;
	  }

	  if (iframeMessage.windowId !== this.windowId) {
	    debug('mismatched window id', iframeMessage.windowId, this.windowId);
	    return;
	  }

	  switch (iframeMessage.type) {
	  case 's':
	    this.iframeObj.loaded();
	    // window global dependency
	    this.postMessage('s', JSON3.stringify([
	      version
	    , this.transport
	    , this.transUrl
	    , this.baseUrl
	    ]));
	    break;
	  case 't':
	    this.emit('message', iframeMessage.data);
	    break;
	  case 'c':
	    var cdata;
	    try {
	      cdata = JSON3.parse(iframeMessage.data);
	    } catch (ignored) {
	      debug('bad json', iframeMessage.data);
	      return;
	    }
	    this.emit('close', cdata[0], cdata[1]);
	    this.close();
	    break;
	  }
	};

	IframeTransport.prototype.postMessage = function(type, data) {
	  debug('postMessage', type, data);
	  this.iframeObj.post(JSON3.stringify({
	    windowId: this.windowId
	  , type: type
	  , data: data || ''
	  }), this.origin);
	};

	IframeTransport.prototype.send = function(message) {
	  debug('send', message);
	  this.postMessage('m', message);
	};

	IframeTransport.enabled = function() {
	  return iframeUtils.iframeEnabled;
	};

	IframeTransport.transportName = 'iframe';
	IframeTransport.roundTrips = 2;

	module.exports = IframeTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
	;(function () {
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(47);

	  // A set of types used to distinguish objects from primitives.
	  var objectTypes = {
	    "function": true,
	    "object": true
	  };

	  // Detect the `exports` object exposed by CommonJS implementations.
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  // Use the `global` object exposed by Node (including Browserify via
	  // `insert-module-globals`), Narwhal, and Ringo as the default context,
	  // and the `window` object in browsers. Rhino exports a `global` function
	  // instead.
	  var root = objectTypes[typeof window] && window || this,
	      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

	  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Public: Initializes JSON 3 using the given `context` object, attaching the
	  // `stringify` and `parse` functions to the specified `exports` object.
	  function runInContext(context, exports) {
	    context || (context = root["Object"]());
	    exports || (exports = root["Object"]());

	    // Native constructor aliases.
	    var Number = context["Number"] || root["Number"],
	        String = context["String"] || root["String"],
	        Object = context["Object"] || root["Object"],
	        Date = context["Date"] || root["Date"],
	        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
	        TypeError = context["TypeError"] || root["TypeError"],
	        Math = context["Math"] || root["Math"],
	        nativeJSON = context["JSON"] || root["JSON"];

	    // Delegate to the native `stringify` and `parse` implementations.
	    if (typeof nativeJSON == "object" && nativeJSON) {
	      exports.stringify = nativeJSON.stringify;
	      exports.parse = nativeJSON.parse;
	    }

	    // Convenience aliases.
	    var objectProto = Object.prototype,
	        getClass = objectProto.toString,
	        isProperty, forEach, undef;

	    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	    var isExtended = new Date(-3509827334573292);
	    try {
	      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	      // results for certain dates in Opera >= 10.53.
	      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	        // Safari < 2.0.2 stores the internal millisecond time value correctly,
	        // but clips the values returned by the date methods to the range of
	        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	    } catch (exception) {}

	    // Internal: Determines whether the native `JSON.stringify` and `parse`
	    // implementations are spec-compliant. Based on work by Ken Snyder.
	    function has(name) {
	      if (has[name] !== undef) {
	        // Return cached feature test result.
	        return has[name];
	      }
	      var isSupported;
	      if (name == "bug-string-char-index") {
	        // IE <= 7 doesn't support accessing string characters using square
	        // bracket notation. IE 8 only supports this for primitives.
	        isSupported = "a"[0] != "a";
	      } else if (name == "json") {
	        // Indicates whether both `JSON.stringify` and `JSON.parse` are
	        // supported.
	        isSupported = has("json-stringify") && has("json-parse");
	      } else {
	        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	        // Test `JSON.stringify`.
	        if (name == "json-stringify") {
	          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	          if (stringifySupported) {
	            // A test function object with a custom `toJSON` method.
	            (value = function () {
	              return 1;
	            }).toJSON = value;
	            try {
	              stringifySupported =
	                // Firefox 3.1b1 and b2 serialize string, number, and boolean
	                // primitives as object literals.
	                stringify(0) === "0" &&
	                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	                // literals.
	                stringify(new Number()) === "0" &&
	                stringify(new String()) == '""' &&
	                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	                // does not define a canonical JSON representation (this applies to
	                // objects with `toJSON` properties as well, *unless* they are nested
	                // within an object or array).
	                stringify(getClass) === undef &&
	                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	                // FF 3.1b3 pass this test.
	                stringify(undef) === undef &&
	                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	                // respectively, if the value is omitted entirely.
	                stringify() === undef &&
	                // FF 3.1b1, 2 throw an error if the given value is not a number,
	                // string, array, object, Boolean, or `null` literal. This applies to
	                // objects with custom `toJSON` methods as well, unless they are nested
	                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	                // methods entirely.
	                stringify(value) === "1" &&
	                stringify([value]) == "[1]" &&
	                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	                // `"[null]"`.
	                stringify([undef]) == "[null]" &&
	                // YUI 3.0.0b1 fails to serialize `null` literals.
	                stringify(null) == "null" &&
	                // FF 3.1b1, 2 halts serialization if an array contains a function:
	                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	                // elides non-JSON values from objects and arrays, unless they
	                // define custom `toJSON` methods.
	                stringify([undef, getClass, null]) == "[null,null,null]" &&
	                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	                // where character escape codes are expected (e.g., `\b` => `\u0008`).
	                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	                stringify(null, value) === "1" &&
	                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	                // serialize extended years.
	                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	                // The milliseconds are optional in ES 5, but required in 5.1.
	                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	                // four-digit years instead of six-digit years. Credits: @Yaffle.
	                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	                // values less than 1000. Credits: @Yaffle.
	                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	            } catch (exception) {
	              stringifySupported = false;
	            }
	          }
	          isSupported = stringifySupported;
	        }
	        // Test `JSON.parse`.
	        if (name == "json-parse") {
	          var parse = exports.parse;
	          if (typeof parse == "function") {
	            try {
	              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	              // Conforming implementations should also coerce the initial argument to
	              // a string prior to parsing.
	              if (parse("0") === 0 && !parse(false)) {
	                // Simple parsing test.
	                value = parse(serialized);
	                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	                if (parseSupported) {
	                  try {
	                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                    parseSupported = !parse('"\t"');
	                  } catch (exception) {}
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                      // certain octal literals.
	                      parseSupported = parse("01") !== 1;
	                    } catch (exception) {}
	                  }
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                      // points. These environments, along with FF 3.1b1 and 2,
	                      // also allow trailing commas in JSON objects and arrays.
	                      parseSupported = parse("1.") !== 1;
	                    } catch (exception) {}
	                  }
	                }
	              }
	            } catch (exception) {
	              parseSupported = false;
	            }
	          }
	          isSupported = parseSupported;
	        }
	      }
	      return has[name] = !!isSupported;
	    }

	    if (!has("json")) {
	      // Common `[[Class]]` name aliases.
	      var functionClass = "[object Function]",
	          dateClass = "[object Date]",
	          numberClass = "[object Number]",
	          stringClass = "[object String]",
	          arrayClass = "[object Array]",
	          booleanClass = "[object Boolean]";

	      // Detect incomplete support for accessing string characters by index.
	      var charIndexBuggy = has("bug-string-char-index");

	      // Define additional utility methods if the `Date` methods are buggy.
	      if (!isExtended) {
	        var floor = Math.floor;
	        // A mapping between the months of the year and the number of days between
	        // January 1st and the first of the respective month.
	        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	        // Internal: Calculates the number of days between the Unix epoch and the
	        // first day of the given month.
	        var getDay = function (year, month) {
	          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	        };
	      }

	      // Internal: Determines if a property is a direct property of the given
	      // object. Delegates to the native `Object#hasOwnProperty` method.
	      if (!(isProperty = objectProto.hasOwnProperty)) {
	        isProperty = function (property) {
	          var members = {}, constructor;
	          if ((members.__proto__ = null, members.__proto__ = {
	            // The *proto* property cannot be set multiple times in recent
	            // versions of Firefox and SeaMonkey.
	            "toString": 1
	          }, members).toString != getClass) {
	            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	            // supports the mutable *proto* property.
	            isProperty = function (property) {
	              // Capture and break the object's prototype chain (see section 8.6.2
	              // of the ES 5.1 spec). The parenthesized expression prevents an
	              // unsafe transformation by the Closure Compiler.
	              var original = this.__proto__, result = property in (this.__proto__ = null, this);
	              // Restore the original prototype chain.
	              this.__proto__ = original;
	              return result;
	            };
	          } else {
	            // Capture a reference to the top-level `Object` constructor.
	            constructor = members.constructor;
	            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	            // other environments.
	            isProperty = function (property) {
	              var parent = (this.constructor || constructor).prototype;
	              return property in this && !(property in parent && this[property] === parent[property]);
	            };
	          }
	          members = null;
	          return isProperty.call(this, property);
	        };
	      }

	      // Internal: Normalizes the `for...in` iteration algorithm across
	      // environments. Each enumerated key is yielded to a `callback` function.
	      forEach = function (object, callback) {
	        var size = 0, Properties, members, property;

	        // Tests for bugs in the current environment's `for...in` algorithm. The
	        // `valueOf` property inherits the non-enumerable flag from
	        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	        (Properties = function () {
	          this.valueOf = 0;
	        }).prototype.valueOf = 0;

	        // Iterate over a new instance of the `Properties` class.
	        members = new Properties();
	        for (property in members) {
	          // Ignore all properties inherited from `Object.prototype`.
	          if (isProperty.call(members, property)) {
	            size++;
	          }
	        }
	        Properties = members = null;

	        // Normalize the iteration algorithm.
	        if (!size) {
	          // A list of non-enumerable properties inherited from `Object.prototype`.
	          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	          // properties.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, length;
	            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
	            for (property in object) {
	              // Gecko <= 1.0 enumerates the `prototype` property of functions under
	              // certain conditions; IE does not.
	              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for each non-enumerable property.
	            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	          };
	        } else if (size == 2) {
	          // Safari <= 2.0.4 enumerates shadowed properties twice.
	          forEach = function (object, callback) {
	            // Create a set of iterated properties.
	            var members = {}, isFunction = getClass.call(object) == functionClass, property;
	            for (property in object) {
	              // Store each property name to prevent double enumeration. The
	              // `prototype` property of functions is not enumerated due to cross-
	              // environment inconsistencies.
	              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	          };
	        } else {
	          // No bugs detected; use the standard `for...in` algorithm.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	            for (property in object) {
	              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for the `constructor` property due to
	            // cross-environment inconsistencies.
	            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	              callback(property);
	            }
	          };
	        }
	        return forEach(object, callback);
	      };

	      // Public: Serializes a JavaScript `value` as a JSON string. The optional
	      // `filter` argument may specify either a function that alters how object and
	      // array members are serialized, or an array of strings and numbers that
	      // indicates which properties should be serialized. The optional `width`
	      // argument may be either a string or number that specifies the indentation
	      // level of the output.
	      if (!has("json-stringify")) {
	        // Internal: A map of control characters and their escaped equivalents.
	        var Escapes = {
	          92: "\\\\",
	          34: '\\"',
	          8: "\\b",
	          12: "\\f",
	          10: "\\n",
	          13: "\\r",
	          9: "\\t"
	        };

	        // Internal: Converts `value` into a zero-padded string such that its
	        // length is at least equal to `width`. The `width` must be <= 6.
	        var leadingZeroes = "000000";
	        var toPaddedString = function (width, value) {
	          // The `|| 0` expression is necessary to work around a bug in
	          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	          return (leadingZeroes + (value || 0)).slice(-width);
	        };

	        // Internal: Double-quotes a string `value`, replacing all ASCII control
	        // characters (characters with code unit values between 0 and 31) with
	        // their escaped equivalents. This is an implementation of the
	        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	        var unicodePrefix = "\\u00";
	        var quote = function (value) {
	          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
	          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	          for (; index < length; index++) {
	            var charCode = value.charCodeAt(index);
	            // If the character is a control character, append its Unicode or
	            // shorthand escape sequence; otherwise, append the character as-is.
	            switch (charCode) {
	              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	                result += Escapes[charCode];
	                break;
	              default:
	                if (charCode < 32) {
	                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                  break;
	                }
	                result += useCharIndex ? symbols[index] : value.charAt(index);
	            }
	          }
	          return result + '"';
	        };

	        // Internal: Recursively serializes an object. Implements the
	        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	          try {
	            // Necessary for host object support.
	            value = object[property];
	          } catch (exception) {}
	          if (typeof value == "object" && value) {
	            className = getClass.call(value);
	            if (className == dateClass && !isProperty.call(value, "toJSON")) {
	              if (value > -1 / 0 && value < 1 / 0) {
	                // Dates are serialized according to the `Date#toJSON` method
	                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	                // for the ISO 8601 date time string format.
	                if (getDay) {
	                  // Manually compute the year, month, date, hours, minutes,
	                  // seconds, and milliseconds if the `getUTC*` methods are
	                  // buggy. Adapted from @Yaffle's `date-shim` project.
	                  date = floor(value / 864e5);
	                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                  date = 1 + date - getDay(year, month);
	                  // The `time` value specifies the time within the day (see ES
	                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                  // to compute `A modulo B`, as the `%` operator does not
	                  // correspond to the `modulo` operation for negative numbers.
	                  time = (value % 864e5 + 864e5) % 864e5;
	                  // The hours, minutes, seconds, and milliseconds are obtained by
	                  // decomposing the time within the day. See section 15.9.1.10.
	                  hours = floor(time / 36e5) % 24;
	                  minutes = floor(time / 6e4) % 60;
	                  seconds = floor(time / 1e3) % 60;
	                  milliseconds = time % 1e3;
	                } else {
	                  year = value.getUTCFullYear();
	                  month = value.getUTCMonth();
	                  date = value.getUTCDate();
	                  hours = value.getUTCHours();
	                  minutes = value.getUTCMinutes();
	                  seconds = value.getUTCSeconds();
	                  milliseconds = value.getUTCMilliseconds();
	                }
	                // Serialize extended years correctly.
	                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                  // Months, dates, hours, minutes, and seconds should have two
	                  // digits; milliseconds should have three.
	                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                  // Milliseconds are optional in ES 5.0, but required in 5.1.
	                  "." + toPaddedString(3, milliseconds) + "Z";
	              } else {
	                value = null;
	              }
	            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	              // ignores all `toJSON` methods on these objects unless they are
	              // defined directly on an instance.
	              value = value.toJSON(property);
	            }
	          }
	          if (callback) {
	            // If a replacement function was provided, call it to obtain the value
	            // for serialization.
	            value = callback.call(object, property, value);
	          }
	          if (value === null) {
	            return "null";
	          }
	          className = getClass.call(value);
	          if (className == booleanClass) {
	            // Booleans are represented literally.
	            return "" + value;
	          } else if (className == numberClass) {
	            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	            // `"null"`.
	            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	          } else if (className == stringClass) {
	            // Strings are double-quoted and escaped.
	            return quote("" + value);
	          }
	          // Recursively serialize objects and arrays.
	          if (typeof value == "object") {
	            // Check for cyclic structures. This is a linear search; performance
	            // is inversely proportional to the number of unique nested objects.
	            for (length = stack.length; length--;) {
	              if (stack[length] === value) {
	                // Cyclic structures cannot be serialized by `JSON.stringify`.
	                throw TypeError();
	              }
	            }
	            // Add the object to the stack of traversed objects.
	            stack.push(value);
	            results = [];
	            // Save the current indentation level and indent one additional level.
	            prefix = indentation;
	            indentation += whitespace;
	            if (className == arrayClass) {
	              // Recursively serialize array elements.
	              for (index = 0, length = value.length; index < length; index++) {
	                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	                results.push(element === undef ? "null" : element);
	              }
	              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	            } else {
	              // Recursively serialize object members. Members are selected from
	              // either a user-specified list of property names, or the object
	              // itself.
	              forEach(properties || value, function (property) {
	                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	                if (element !== undef) {
	                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                  // is not the empty string, let `member` {quote(property) + ":"}
	                  // be the concatenation of `member` and the `space` character."
	                  // The "`space` character" refers to the literal space
	                  // character, not the `space` {width} argument provided to
	                  // `JSON.stringify`.
	                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	                }
	              });
	              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	            }
	            // Remove the object from the traversed object stack.
	            stack.pop();
	            return result;
	          }
	        };

	        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	        exports.stringify = function (source, filter, width) {
	          var whitespace, callback, properties, className;
	          if (objectTypes[typeof filter] && filter) {
	            if ((className = getClass.call(filter)) == functionClass) {
	              callback = filter;
	            } else if (className == arrayClass) {
	              // Convert the property names array into a makeshift set.
	              properties = {};
	              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	            }
	          }
	          if (width) {
	            if ((className = getClass.call(width)) == numberClass) {
	              // Convert the `width` to an integer and create a string containing
	              // `width` number of space characters.
	              if ((width -= width % 1) > 0) {
	                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	              }
	            } else if (className == stringClass) {
	              whitespace = width.length <= 10 ? width : width.slice(0, 10);
	            }
	          }
	          // Opera <= 7.54u2 discards the values associated with empty string keys
	          // (`""`) only if they are used directly within an object member list
	          // (e.g., `!("" in { "": 1})`).
	          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	        };
	      }

	      // Public: Parses a JSON source string.
	      if (!has("json-parse")) {
	        var fromCharCode = String.fromCharCode;

	        // Internal: A map of escaped control characters and their unescaped
	        // equivalents.
	        var Unescapes = {
	          92: "\\",
	          34: '"',
	          47: "/",
	          98: "\b",
	          116: "\t",
	          110: "\n",
	          102: "\f",
	          114: "\r"
	        };

	        // Internal: Stores the parser state.
	        var Index, Source;

	        // Internal: Resets the parser state and throws a `SyntaxError`.
	        var abort = function () {
	          Index = Source = null;
	          throw SyntaxError();
	        };

	        // Internal: Returns the next token, or `"$"` if the parser has reached
	        // the end of the source string. A token may be a string, number, `null`
	        // literal, or Boolean literal.
	        var lex = function () {
	          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	          while (Index < length) {
	            charCode = source.charCodeAt(Index);
	            switch (charCode) {
	              case 9: case 10: case 13: case 32:
	                // Skip whitespace tokens, including tabs, carriage returns, line
	                // feeds, and space characters.
	                Index++;
	                break;
	              case 123: case 125: case 91: case 93: case 58: case 44:
	                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	                // the current position.
	                value = charIndexBuggy ? source.charAt(Index) : source[Index];
	                Index++;
	                return value;
	              case 34:
	                // `"` delimits a JSON string; advance to the next character and
	                // begin parsing the string. String tokens are prefixed with the
	                // sentinel `@` character to distinguish them from punctuators and
	                // end-of-string tokens.
	                for (value = "@", Index++; Index < length;) {
	                  charCode = source.charCodeAt(Index);
	                  if (charCode < 32) {
	                    // Unescaped ASCII control characters (those with a code unit
	                    // less than the space character) are not permitted.
	                    abort();
	                  } else if (charCode == 92) {
	                    // A reverse solidus (`\`) marks the beginning of an escaped
	                    // control character (including `"`, `\`, and `/`) or Unicode
	                    // escape sequence.
	                    charCode = source.charCodeAt(++Index);
	                    switch (charCode) {
	                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                        // Revive escaped control characters.
	                        value += Unescapes[charCode];
	                        Index++;
	                        break;
	                      case 117:
	                        // `\u` marks the beginning of a Unicode escape sequence.
	                        // Advance to the first character and validate the
	                        // four-digit code point.
	                        begin = ++Index;
	                        for (position = Index + 4; Index < position; Index++) {
	                          charCode = source.charCodeAt(Index);
	                          // A valid sequence comprises four hexdigits (case-
	                          // insensitive) that form a single hexadecimal value.
	                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                            // Invalid Unicode escape sequence.
	                            abort();
	                          }
	                        }
	                        // Revive the escaped character.
	                        value += fromCharCode("0x" + source.slice(begin, Index));
	                        break;
	                      default:
	                        // Invalid escape sequence.
	                        abort();
	                    }
	                  } else {
	                    if (charCode == 34) {
	                      // An unescaped double-quote character marks the end of the
	                      // string.
	                      break;
	                    }
	                    charCode = source.charCodeAt(Index);
	                    begin = Index;
	                    // Optimize for the common case where a string is valid.
	                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                      charCode = source.charCodeAt(++Index);
	                    }
	                    // Append the string as-is.
	                    value += source.slice(begin, Index);
	                  }
	                }
	                if (source.charCodeAt(Index) == 34) {
	                  // Advance to the next character and return the revived string.
	                  Index++;
	                  return value;
	                }
	                // Unterminated string.
	                abort();
	              default:
	                // Parse numbers and literals.
	                begin = Index;
	                // Advance past the negative sign, if one is specified.
	                if (charCode == 45) {
	                  isSigned = true;
	                  charCode = source.charCodeAt(++Index);
	                }
	                // Parse an integer or floating-point value.
	                if (charCode >= 48 && charCode <= 57) {
	                  // Leading zeroes are interpreted as octal literals.
	                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                    // Illegal octal literal.
	                    abort();
	                  }
	                  isSigned = false;
	                  // Parse the integer component.
	                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                  // Floats cannot contain a leading decimal point; however, this
	                  // case is already accounted for by the parser.
	                  if (source.charCodeAt(Index) == 46) {
	                    position = ++Index;
	                    // Parse the decimal component.
	                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal trailing decimal.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Parse exponents. The `e` denoting the exponent is
	                  // case-insensitive.
	                  charCode = source.charCodeAt(Index);
	                  if (charCode == 101 || charCode == 69) {
	                    charCode = source.charCodeAt(++Index);
	                    // Skip past the sign following the exponent, if one is
	                    // specified.
	                    if (charCode == 43 || charCode == 45) {
	                      Index++;
	                    }
	                    // Parse the exponential component.
	                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal empty exponent.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Coerce the parsed value to a JavaScript number.
	                  return +source.slice(begin, Index);
	                }
	                // A negative sign may only precede numbers.
	                if (isSigned) {
	                  abort();
	                }
	                // `true`, `false`, and `null` literals.
	                if (source.slice(Index, Index + 4) == "true") {
	                  Index += 4;
	                  return true;
	                } else if (source.slice(Index, Index + 5) == "false") {
	                  Index += 5;
	                  return false;
	                } else if (source.slice(Index, Index + 4) == "null") {
	                  Index += 4;
	                  return null;
	                }
	                // Unrecognized token.
	                abort();
	            }
	          }
	          // Return the sentinel `$` character if the parser has reached the end
	          // of the source string.
	          return "$";
	        };

	        // Internal: Parses a JSON `value` token.
	        var get = function (value) {
	          var results, hasMembers;
	          if (value == "$") {
	            // Unexpected end of input.
	            abort();
	          }
	          if (typeof value == "string") {
	            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	              // Remove the sentinel `@` character.
	              return value.slice(1);
	            }
	            // Parse object and array literals.
	            if (value == "[") {
	              // Parses a JSON array, returning a new JavaScript array.
	              results = [];
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing square bracket marks the end of the array literal.
	                if (value == "]") {
	                  break;
	                }
	                // If the array literal contains elements, the current token
	                // should be a comma separating the previous element from the
	                // next.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "]") {
	                      // Unexpected trailing `,` in array literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each array element.
	                    abort();
	                  }
	                }
	                // Elisions and leading commas are not permitted.
	                if (value == ",") {
	                  abort();
	                }
	                results.push(get(value));
	              }
	              return results;
	            } else if (value == "{") {
	              // Parses a JSON object, returning a new JavaScript object.
	              results = {};
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing curly brace marks the end of the object literal.
	                if (value == "}") {
	                  break;
	                }
	                // If the object literal contains members, the current token
	                // should be a comma separator.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "}") {
	                      // Unexpected trailing `,` in object literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each object member.
	                    abort();
	                  }
	                }
	                // Leading commas are not permitted, object property names must be
	                // double-quoted strings, and a `:` must separate each property
	                // name and value.
	                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                  abort();
	                }
	                results[value.slice(1)] = get(lex());
	              }
	              return results;
	            }
	            // Unexpected token encountered.
	            abort();
	          }
	          return value;
	        };

	        // Internal: Updates a traversed object member.
	        var update = function (source, property, callback) {
	          var element = walk(source, property, callback);
	          if (element === undef) {
	            delete source[property];
	          } else {
	            source[property] = element;
	          }
	        };

	        // Internal: Recursively traverses a parsed JSON object, invoking the
	        // `callback` function for each value. This is an implementation of the
	        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	        var walk = function (source, property, callback) {
	          var value = source[property], length;
	          if (typeof value == "object" && value) {
	            // `forEach` can't be used to traverse an array in Opera <= 8.54
	            // because its `Object#hasOwnProperty` implementation returns `false`
	            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	            if (getClass.call(value) == arrayClass) {
	              for (length = value.length; length--;) {
	                update(value, length, callback);
	              }
	            } else {
	              forEach(value, function (property) {
	                update(value, property, callback);
	              });
	            }
	          }
	          return callback.call(source, property, value);
	        };

	        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	        exports.parse = function (source, callback) {
	          var result, value;
	          Index = 0;
	          Source = "" + source;
	          result = get(lex());
	          // If a JSON string contains multiple tokens, it is invalid.
	          if (lex() != "$") {
	            abort();
	          }
	          // Reset the parser state.
	          Index = Source = null;
	          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	        };
	      }
	    }

	    exports["runInContext"] = runInContext;
	    return exports;
	  }

	  if (freeExports && !isLoader) {
	    // Export for CommonJS environments.
	    runInContext(root, freeExports);
	  } else {
	    // Export for web browsers and JavaScript engines.
	    var nativeJSON = root.JSON,
	        previousJSON = root["JSON3"],
	        isRestored = false;

	    var JSON3 = runInContext(root, (root["JSON3"] = {
	      // Public: Restores the original value of the global `JSON` object and
	      // returns a reference to the `JSON3` object.
	      "noConflict": function () {
	        if (!isRestored) {
	          isRestored = true;
	          root.JSON = nativeJSON;
	          root["JSON3"] = previousJSON;
	          nativeJSON = previousJSON = null;
	        }
	        return JSON3;
	      }
	    }));

	    root.JSON = {
	      "parse": JSON3.parse,
	      "stringify": JSON3.stringify
	    };
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 47 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = '1.1.0';


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var eventUtils = __webpack_require__(14)
	  , JSON3 = __webpack_require__(46)
	  , browser = __webpack_require__(38)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:utils:iframe');
	}

	module.exports = {
	  WPrefix: '_jp'
	, currentWindowId: null

	, polluteGlobalNamespace: function() {
	    if (!(module.exports.WPrefix in global)) {
	      global[module.exports.WPrefix] = {};
	    }
	  }

	, postMessage: function(type, data) {
	    if (global.parent !== global) {
	      global.parent.postMessage(JSON3.stringify({
	        windowId: module.exports.currentWindowId
	      , type: type
	      , data: data || ''
	      }), '*');
	    } else {
	      debug('Cannot postMessage, no parent window.', type, data);
	    }
	  }

	, createIframe: function(iframeUrl, errorCallback) {
	    var iframe = global.document.createElement('iframe');
	    var tref, unloadRef;
	    var unattach = function() {
	      debug('unattach');
	      clearTimeout(tref);
	      // Explorer had problems with that.
	      try {
	        iframe.onload = null;
	      } catch (x) {
	        // intentionally empty
	      }
	      iframe.onerror = null;
	    };
	    var cleanup = function() {
	      debug('cleanup');
	      if (iframe) {
	        unattach();
	        // This timeout makes chrome fire onbeforeunload event
	        // within iframe. Without the timeout it goes straight to
	        // onunload.
	        setTimeout(function() {
	          if (iframe) {
	            iframe.parentNode.removeChild(iframe);
	          }
	          iframe = null;
	        }, 0);
	        eventUtils.unloadDel(unloadRef);
	      }
	    };
	    var onerror = function(err) {
	      debug('onerror', err);
	      if (iframe) {
	        cleanup();
	        errorCallback(err);
	      }
	    };
	    var post = function(msg, origin) {
	      debug('post', msg, origin);
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function() {
	          if (iframe && iframe.contentWindow) {
	            iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {
	        // intentionally empty
	      }
	    };

	    iframe.src = iframeUrl;
	    iframe.style.display = 'none';
	    iframe.style.position = 'absolute';
	    iframe.onerror = function() {
	      onerror('onerror');
	    };
	    iframe.onload = function() {
	      debug('onload');
	      // `onload` is triggered before scripts on the iframe are
	      // executed. Give it few seconds to actually load stuff.
	      clearTimeout(tref);
	      tref = setTimeout(function() {
	        onerror('onload timeout');
	      }, 2000);
	    };
	    global.document.body.appendChild(iframe);
	    tref = setTimeout(function() {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post
	    , cleanup: cleanup
	    , loaded: unattach
	    };
	  }

	/* jshint undef: false, newcap: false */
	/* eslint no-undef: 0, new-cap: 0 */
	, createHtmlfile: function(iframeUrl, errorCallback) {
	    var axo = ['Active'].concat('Object').join('X');
	    var doc = new global[axo]('htmlfile');
	    var tref, unloadRef;
	    var iframe;
	    var unattach = function() {
	      clearTimeout(tref);
	      iframe.onerror = null;
	    };
	    var cleanup = function() {
	      if (doc) {
	        unattach();
	        eventUtils.unloadDel(unloadRef);
	        iframe.parentNode.removeChild(iframe);
	        iframe = doc = null;
	        CollectGarbage();
	      }
	    };
	    var onerror = function(r) {
	      debug('onerror', r);
	      if (doc) {
	        cleanup();
	        errorCallback(r);
	      }
	    };
	    var post = function(msg, origin) {
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function() {
	          if (iframe && iframe.contentWindow) {
	              iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {
	        // intentionally empty
	      }
	    };

	    doc.open();
	    doc.write('<html><s' + 'cript>' +
	              'document.domain="' + global.document.domain + '";' +
	              '</s' + 'cript></html>');
	    doc.close();
	    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
	    var c = doc.createElement('div');
	    doc.body.appendChild(c);
	    iframe = doc.createElement('iframe');
	    c.appendChild(iframe);
	    iframe.src = iframeUrl;
	    iframe.onerror = function() {
	      onerror('onerror');
	    };
	    tref = setTimeout(function() {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post
	    , cleanup: cleanup
	    , loaded: unattach
	    };
	  }
	};

	module.exports.iframeEnabled = false;
	if (global.document) {
	  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
	  // huge delay, or not at all.
	  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
	    typeof global.postMessage === 'object') && (!browser.isKonqueror());
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  isObject: function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  }

	, extend: function(obj) {
	    if (!this.isObject(obj)) {
	      return obj;
	    }
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (Object.prototype.hasOwnProperty.call(source, prop)) {
	          obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  }
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , HtmlfileReceiver = __webpack_require__(52)
	  , XHRLocalObject = __webpack_require__(37)
	  , AjaxBasedTransport = __webpack_require__(30)
	  ;

	function HtmlFileTransport(transUrl) {
	  if (!HtmlfileReceiver.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
	}

	inherits(HtmlFileTransport, AjaxBasedTransport);

	HtmlFileTransport.enabled = function(info) {
	  return HtmlfileReceiver.enabled && info.sameOrigin;
	};

	HtmlFileTransport.transportName = 'htmlfile';
	HtmlFileTransport.roundTrips = 2;

	module.exports = HtmlFileTransport;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var inherits = __webpack_require__(25)
	  , iframeUtils = __webpack_require__(49)
	  , urlUtils = __webpack_require__(17)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  , random = __webpack_require__(15)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:receiver:htmlfile');
	}

	function HtmlfileReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;
	  iframeUtils.polluteGlobalNamespace();

	  this.id = 'a' + random.string(6);
	  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

	  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
	  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
	      iframeUtils.createHtmlfile : iframeUtils.createIframe;

	  global[iframeUtils.WPrefix][this.id] = {
	    start: function() {
	      debug('start');
	      self.iframeObj.loaded();
	    }
	  , message: function(data) {
	      debug('message', data);
	      self.emit('message', data);
	    }
	  , stop: function() {
	      debug('stop');
	      self._cleanup();
	      self._close('network');
	    }
	  };
	  this.iframeObj = constructFunc(url, function() {
	    debug('callback');
	    self._cleanup();
	    self._close('permanent');
	  });
	}

	inherits(HtmlfileReceiver, EventEmitter);

	HtmlfileReceiver.prototype.abort = function() {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};

	HtmlfileReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  if (this.iframeObj) {
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	  }
	  delete global[iframeUtils.WPrefix][this.id];
	};

	HtmlfileReceiver.prototype._close = function(reason) {
	  debug('_close', reason);
	  this.emit('close', null, reason);
	  this.removeAllListeners();
	};

	HtmlfileReceiver.htmlfileEnabled = false;

	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (axo in global) {
	  try {
	    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
	  } catch (x) {
	    // intentionally empty
	  }
	}

	HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

	module.exports = HtmlfileReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , AjaxBasedTransport = __webpack_require__(30)
	  , XhrReceiver = __webpack_require__(34)
	  , XHRCorsObject = __webpack_require__(35)
	  , XHRLocalObject = __webpack_require__(37)
	  ;

	function XhrPollingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
	}

	inherits(XhrPollingTransport, AjaxBasedTransport);

	XhrPollingTransport.enabled = function(info) {
	  if (info.nullOrigin) {
	    return false;
	  }

	  if (XHRLocalObject.enabled && info.sameOrigin) {
	    return true;
	  }
	  return XHRCorsObject.enabled;
	};

	XhrPollingTransport.transportName = 'xhr-polling';
	XhrPollingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XhrPollingTransport;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , AjaxBasedTransport = __webpack_require__(30)
	  , XdrStreamingTransport = __webpack_require__(39)
	  , XhrReceiver = __webpack_require__(34)
	  , XDRObject = __webpack_require__(40)
	  ;

	function XdrPollingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
	}

	inherits(XdrPollingTransport, AjaxBasedTransport);

	XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
	XdrPollingTransport.transportName = 'xdr-polling';
	XdrPollingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XdrPollingTransport;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// The simplest and most robust transport, using the well-know cross
	// domain hack - JSONP. This transport is quite inefficient - one
	// message could use up to one http request. But at least it works almost
	// everywhere.
	// Known limitations:
	//   o you will get a spinning cursor
	//   o for Konqueror a dumb timer is needed to detect errors

	var inherits = __webpack_require__(25)
	  , SenderReceiver = __webpack_require__(31)
	  , JsonpReceiver = __webpack_require__(56)
	  , jsonpSender = __webpack_require__(57)
	  ;

	function JsonPTransport(transUrl) {
	  if (!JsonPTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
	}

	inherits(JsonPTransport, SenderReceiver);

	JsonPTransport.enabled = function() {
	  return !!global.document;
	};

	JsonPTransport.transportName = 'jsonp-polling';
	JsonPTransport.roundTrips = 1;
	JsonPTransport.needBody = true;

	module.exports = JsonPTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var utils = __webpack_require__(49)
	  , random = __webpack_require__(15)
	  , browser = __webpack_require__(38)
	  , urlUtils = __webpack_require__(17)
	  , inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:receiver:jsonp');
	}

	function JsonpReceiver(url) {
	  debug(url);
	  var self = this;
	  EventEmitter.call(this);

	  utils.polluteGlobalNamespace();

	  this.id = 'a' + random.string(6);
	  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

	  global[utils.WPrefix][this.id] = this._callback.bind(this);
	  this._createScript(urlWithId);

	  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
	  this.timeoutId = setTimeout(function() {
	    debug('timeout');
	    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
	  }, JsonpReceiver.timeout);
	}

	inherits(JsonpReceiver, EventEmitter);

	JsonpReceiver.prototype.abort = function() {
	  debug('abort');
	  if (global[utils.WPrefix][this.id]) {
	    var err = new Error('JSONP user aborted read');
	    err.code = 1000;
	    this._abort(err);
	  }
	};

	JsonpReceiver.timeout = 35000;
	JsonpReceiver.scriptErrorTimeout = 1000;

	JsonpReceiver.prototype._callback = function(data) {
	  debug('_callback', data);
	  this._cleanup();

	  if (this.aborting) {
	    return;
	  }

	  if (data) {
	    debug('message', data);
	    this.emit('message', data);
	  }
	  this.emit('close', null, 'network');
	  this.removeAllListeners();
	};

	JsonpReceiver.prototype._abort = function(err) {
	  debug('_abort', err);
	  this._cleanup();
	  this.aborting = true;
	  this.emit('close', err.code, err.message);
	  this.removeAllListeners();
	};

	JsonpReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  clearTimeout(this.timeoutId);
	  if (this.script2) {
	    this.script2.parentNode.removeChild(this.script2);
	    this.script2 = null;
	  }
	  if (this.script) {
	    var script = this.script;
	    // Unfortunately, you can't really abort script loading of
	    // the script.
	    script.parentNode.removeChild(script);
	    script.onreadystatechange = script.onerror =
	        script.onload = script.onclick = null;
	    this.script = null;
	  }
	  delete global[utils.WPrefix][this.id];
	};

	JsonpReceiver.prototype._scriptError = function() {
	  debug('_scriptError');
	  var self = this;
	  if (this.errorTimer) {
	    return;
	  }

	  this.errorTimer = setTimeout(function() {
	    if (!self.loadedOkay) {
	      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
	    }
	  }, JsonpReceiver.scriptErrorTimeout);
	};

	JsonpReceiver.prototype._createScript = function(url) {
	  debug('_createScript', url);
	  var self = this;
	  var script = this.script = global.document.createElement('script');
	  var script2;  // Opera synchronous load trick.

	  script.id = 'a' + random.string(8);
	  script.src = url;
	  script.type = 'text/javascript';
	  script.charset = 'UTF-8';
	  script.onerror = this._scriptError.bind(this);
	  script.onload = function() {
	    debug('onload');
	    self._abort(new Error('JSONP script loaded abnormally (onload)'));
	  };

	  // IE9 fires 'error' event after onreadystatechange or before, in random order.
	  // Use loadedOkay to determine if actually errored
	  script.onreadystatechange = function() {
	    debug('onreadystatechange', script.readyState);
	    if (/loaded|closed/.test(script.readyState)) {
	      if (script && script.htmlFor && script.onclick) {
	        self.loadedOkay = true;
	        try {
	          // In IE, actually execute the script.
	          script.onclick();
	        } catch (x) {
	          // intentionally empty
	        }
	      }
	      if (script) {
	        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
	      }
	    }
	  };
	  // IE: event/htmlFor/onclick trick.
	  // One can't rely on proper order for onreadystatechange. In order to
	  // make sure, set a 'htmlFor' and 'event' properties, so that
	  // script code will be installed as 'onclick' handler for the
	  // script object. Later, onreadystatechange, manually execute this
	  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
	  // set. For reference see:
	  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
	  // Also, read on that about script ordering:
	  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	  if (typeof script.async === 'undefined' && global.document.attachEvent) {
	    // According to mozilla docs, in recent browsers script.async defaults
	    // to 'true', so we may use it to detect a good browser:
	    // https://developer.mozilla.org/en/HTML/Element/script
	    if (!browser.isOpera()) {
	      // Naively assume we're in IE
	      try {
	        script.htmlFor = script.id;
	        script.event = 'onclick';
	      } catch (x) {
	        // intentionally empty
	      }
	      script.async = true;
	    } else {
	      // Opera, second sync script hack
	      script2 = this.script2 = global.document.createElement('script');
	      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
	      script.async = script2.async = false;
	    }
	  }
	  if (typeof script.async !== 'undefined') {
	    script.async = true;
	  }

	  var head = global.document.getElementsByTagName('head')[0];
	  head.insertBefore(script, head.firstChild);
	  if (script2) {
	    head.insertBefore(script2, head.firstChild);
	  }
	};

	module.exports = JsonpReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var random = __webpack_require__(15)
	  , urlUtils = __webpack_require__(17)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:sender:jsonp');
	}

	var form, area;

	function createIframe(id) {
	  debug('createIframe', id);
	  try {
	    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	    return global.document.createElement('<iframe name="' + id + '">');
	  } catch (x) {
	    var iframe = global.document.createElement('iframe');
	    iframe.name = id;
	    return iframe;
	  }
	}

	function createForm() {
	  debug('createForm');
	  form = global.document.createElement('form');
	  form.style.display = 'none';
	  form.style.position = 'absolute';
	  form.method = 'POST';
	  form.enctype = 'application/x-www-form-urlencoded';
	  form.acceptCharset = 'UTF-8';

	  area = global.document.createElement('textarea');
	  area.name = 'd';
	  form.appendChild(area);

	  global.document.body.appendChild(form);
	}

	module.exports = function(url, payload, callback) {
	  debug(url, payload);
	  if (!form) {
	    createForm();
	  }
	  var id = 'a' + random.string(8);
	  form.target = id;
	  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

	  var iframe = createIframe(id);
	  iframe.id = id;
	  iframe.style.display = 'none';
	  form.appendChild(iframe);

	  try {
	    area.value = payload;
	  } catch (e) {
	    // seriously broken browsers get here
	  }
	  form.submit();

	  var completed = function(err) {
	    debug('completed', id, err);
	    if (!iframe.onerror) {
	      return;
	    }
	    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
	    // Opera mini doesn't like if we GC iframe
	    // immediately, thus this timeout.
	    setTimeout(function() {
	      debug('cleaning up', id);
	      iframe.parentNode.removeChild(iframe);
	      iframe = null;
	    }, 500);
	    area.value = '';
	    // It is not possible to detect if the iframe succeeded or
	    // failed to submit our form.
	    callback(err);
	  };
	  iframe.onerror = function() {
	    debug('onerror', id);
	    completed();
	  };
	  iframe.onload = function() {
	    debug('onload', id);
	    completed();
	  };
	  iframe.onreadystatechange = function(e) {
	    debug('onreadystatechange', id, iframe.readyState, e);
	    if (iframe.readyState === 'complete') {
	      completed();
	    }
	  };
	  return function() {
	    debug('aborted', id);
	    completed(new Error('Aborted'));
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	__webpack_require__(59);

	var URL = __webpack_require__(18)
	  , inherits = __webpack_require__(25)
	  , JSON3 = __webpack_require__(46)
	  , random = __webpack_require__(15)
	  , escape = __webpack_require__(60)
	  , urlUtils = __webpack_require__(17)
	  , eventUtils = __webpack_require__(14)
	  , transport = __webpack_require__(61)
	  , objectUtils = __webpack_require__(50)
	  , browser = __webpack_require__(38)
	  , log = __webpack_require__(62)
	  , Event = __webpack_require__(63)
	  , EventTarget = __webpack_require__(27)
	  , loc = __webpack_require__(64)
	  , CloseEvent = __webpack_require__(65)
	  , TransportMessageEvent = __webpack_require__(66)
	  , InfoReceiver = __webpack_require__(67)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:main');
	}

	var transports;

	// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
	function SockJS(url, protocols, options) {
	  if (!(this instanceof SockJS)) {
	    return new SockJS(url, protocols, options);
	  }
	  if (arguments.length < 1) {
	    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
	  }
	  EventTarget.call(this);

	  this.readyState = SockJS.CONNECTING;
	  this.extensions = '';
	  this.protocol = '';

	  // non-standard extension
	  options = options || {};
	  if (options.protocols_whitelist) {
	    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
	  }
	  this._transportsWhitelist = options.transports;
	  this._transportOptions = options.transportOptions || {};

	  var sessionId = options.sessionId || 8;
	  if (typeof sessionId === 'function') {
	    this._generateSessionId = sessionId;
	  } else if (typeof sessionId === 'number') {
	    this._generateSessionId = function() {
	      return random.string(sessionId);
	    };
	  } else {
	    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
	  }

	  this._server = options.server || random.numberString(1000);

	  // Step 1 of WS spec - parse and validate the url. Issue #8
	  var parsedUrl = new URL(url);
	  if (!parsedUrl.host || !parsedUrl.protocol) {
	    throw new SyntaxError("The URL '" + url + "' is invalid");
	  } else if (parsedUrl.hash) {
	    throw new SyntaxError('The URL must not contain a fragment');
	  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
	    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
	  }

	  var secure = parsedUrl.protocol === 'https:';
	  // Step 2 - don't allow secure origin with an insecure protocol
	  if (loc.protocol === 'https' && !secure) {
	    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
	  }

	  // Step 3 - check port access - no need here
	  // Step 4 - parse protocols argument
	  if (!protocols) {
	    protocols = [];
	  } else if (!Array.isArray(protocols)) {
	    protocols = [protocols];
	  }

	  // Step 5 - check protocols argument
	  var sortedProtocols = protocols.sort();
	  sortedProtocols.forEach(function(proto, i) {
	    if (!proto) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
	    }
	    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
	    }
	  });

	  // Step 6 - convert origin
	  var o = urlUtils.getOrigin(loc.href);
	  this._origin = o ? o.toLowerCase() : null;

	  // remove the trailing slash
	  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

	  // store the sanitized url
	  this.url = parsedUrl.href;
	  debug('using url', this.url);

	  // Step 7 - start connection in background
	  // obtain server info
	  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
	  this._urlInfo = {
	    nullOrigin: !browser.hasDomain()
	  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
	  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
	  };

	  this._ir = new InfoReceiver(this.url, this._urlInfo);
	  this._ir.once('finish', this._receiveInfo.bind(this));
	}

	inherits(SockJS, EventTarget);

	function userSetCode(code) {
	  return code === 1000 || (code >= 3000 && code <= 4999);
	}

	SockJS.prototype.close = function(code, reason) {
	  // Step 1
	  if (code && !userSetCode(code)) {
	    throw new Error('InvalidAccessError: Invalid code');
	  }
	  // Step 2.4 states the max is 123 bytes, but we are just checking length
	  if (reason && reason.length > 123) {
	    throw new SyntaxError('reason argument has an invalid length');
	  }

	  // Step 3.1
	  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
	    return;
	  }

	  // TODO look at docs to determine how to set this
	  var wasClean = true;
	  this._close(code || 1000, reason || 'Normal closure', wasClean);
	};

	SockJS.prototype.send = function(data) {
	  // #13 - convert anything non-string to string
	  // TODO this currently turns objects into [object Object]
	  if (typeof data !== 'string') {
	    data = '' + data;
	  }
	  if (this.readyState === SockJS.CONNECTING) {
	    throw new Error('InvalidStateError: The connection has not been established yet');
	  }
	  if (this.readyState !== SockJS.OPEN) {
	    return;
	  }
	  this._transport.send(escape.quote(data));
	};

	SockJS.version = __webpack_require__(48);

	SockJS.CONNECTING = 0;
	SockJS.OPEN = 1;
	SockJS.CLOSING = 2;
	SockJS.CLOSED = 3;

	SockJS.prototype._receiveInfo = function(info, rtt) {
	  debug('_receiveInfo', rtt);
	  this._ir = null;
	  if (!info) {
	    this._close(1002, 'Cannot connect to server');
	    return;
	  }

	  // establish a round-trip timeout (RTO) based on the
	  // round-trip time (RTT)
	  this._rto = this.countRTO(rtt);
	  // allow server to override url used for the actual transport
	  this._transUrl = info.base_url ? info.base_url : this.url;
	  info = objectUtils.extend(info, this._urlInfo);
	  debug('info', info);
	  // determine list of desired and supported transports
	  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
	  this._transports = enabledTransports.main;
	  debug(this._transports.length + ' enabled transports');

	  this._connect();
	};

	SockJS.prototype._connect = function() {
	  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
	    debug('attempt', Transport.transportName);
	    if (Transport.needBody) {
	      if (!global.document.body ||
	          (typeof global.document.readyState !== 'undefined' &&
	            global.document.readyState !== 'complete' &&
	            global.document.readyState !== 'interactive')) {
	        debug('waiting for body');
	        this._transports.unshift(Transport);
	        eventUtils.attachEvent('load', this._connect.bind(this));
	        return;
	      }
	    }

	    // calculate timeout based on RTO and round trips. Default to 5s
	    var timeoutMs = (this._rto * Transport.roundTrips) || 5000;
	    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
	    debug('using timeout', timeoutMs);

	    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
	    var options = this._transportOptions[Transport.transportName];
	    debug('transport url', transportUrl);
	    var transportObj = new Transport(transportUrl, this._transUrl, options);
	    transportObj.on('message', this._transportMessage.bind(this));
	    transportObj.once('close', this._transportClose.bind(this));
	    transportObj.transportName = Transport.transportName;
	    this._transport = transportObj;

	    return;
	  }
	  this._close(2000, 'All transports failed', false);
	};

	SockJS.prototype._transportTimeout = function() {
	  debug('_transportTimeout');
	  if (this.readyState === SockJS.CONNECTING) {
	    this._transportClose(2007, 'Transport timed out');
	  }
	};

	SockJS.prototype._transportMessage = function(msg) {
	  debug('_transportMessage', msg);
	  var self = this
	    , type = msg.slice(0, 1)
	    , content = msg.slice(1)
	    , payload
	    ;

	  // first check for messages that don't need a payload
	  switch (type) {
	    case 'o':
	      this._open();
	      return;
	    case 'h':
	      this.dispatchEvent(new Event('heartbeat'));
	      debug('heartbeat', this.transport);
	      return;
	  }

	  if (content) {
	    try {
	      payload = JSON3.parse(content);
	    } catch (e) {
	      debug('bad json', content);
	    }
	  }

	  if (typeof payload === 'undefined') {
	    debug('empty payload', content);
	    return;
	  }

	  switch (type) {
	    case 'a':
	      if (Array.isArray(payload)) {
	        payload.forEach(function(p) {
	          debug('message', self.transport, p);
	          self.dispatchEvent(new TransportMessageEvent(p));
	        });
	      }
	      break;
	    case 'm':
	      debug('message', this.transport, payload);
	      this.dispatchEvent(new TransportMessageEvent(payload));
	      break;
	    case 'c':
	      if (Array.isArray(payload) && payload.length === 2) {
	        this._close(payload[0], payload[1], true);
	      }
	      break;
	  }
	};

	SockJS.prototype._transportClose = function(code, reason) {
	  debug('_transportClose', this.transport, code, reason);
	  if (this._transport) {
	    this._transport.removeAllListeners();
	    this._transport = null;
	    this.transport = null;
	  }

	  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
	    this._connect();
	    return;
	  }

	  this._close(code, reason);
	};

	SockJS.prototype._open = function() {
	  debug('_open', this._transport.transportName, this.readyState);
	  if (this.readyState === SockJS.CONNECTING) {
	    if (this._transportTimeoutId) {
	      clearTimeout(this._transportTimeoutId);
	      this._transportTimeoutId = null;
	    }
	    this.readyState = SockJS.OPEN;
	    this.transport = this._transport.transportName;
	    this.dispatchEvent(new Event('open'));
	    debug('connected', this.transport);
	  } else {
	    // The server might have been restarted, and lost track of our
	    // connection.
	    this._close(1006, 'Server lost session');
	  }
	};

	SockJS.prototype._close = function(code, reason, wasClean) {
	  debug('_close', this.transport, code, reason, wasClean, this.readyState);
	  var forceFail = false;

	  if (this._ir) {
	    forceFail = true;
	    this._ir.close();
	    this._ir = null;
	  }
	  if (this._transport) {
	    this._transport.close();
	    this._transport = null;
	    this.transport = null;
	  }

	  if (this.readyState === SockJS.CLOSED) {
	    throw new Error('InvalidStateError: SockJS has already been closed');
	  }

	  this.readyState = SockJS.CLOSING;
	  setTimeout(function() {
	    this.readyState = SockJS.CLOSED;

	    if (forceFail) {
	      this.dispatchEvent(new Event('error'));
	    }

	    var e = new CloseEvent('close');
	    e.wasClean = wasClean || false;
	    e.code = code || 1000;
	    e.reason = reason;

	    this.dispatchEvent(e);
	    this.onmessage = this.onclose = this.onerror = null;
	    debug('disconnected');
	  }.bind(this), 0);
	};

	// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
	// and RFC 2988.
	SockJS.prototype.countRTO = function(rtt) {
	  // In a local environment, when using IE8/9 and the `jsonp-polling`
	  // transport the time needed to establish a connection (the time that pass
	  // from the opening of the transport to the call of `_dispatchOpen`) is
	  // around 200msec (the lower bound used in the article above) and this
	  // causes spurious timeouts. For this reason we calculate a value slightly
	  // larger than that used in the article.
	  if (rtt > 100) {
	    return 4 * rtt; // rto > 400msec
	  }
	  return 300 + rtt; // 300msec < rto <= 400msec
	};

	module.exports = function(availableTransports) {
	  transports = transport(availableTransports);
	  __webpack_require__(72)(SockJS, availableTransports);
	  return SockJS;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 59 */
/***/ function(module, exports) {

	/* eslint-disable */
	/* jscs: disable */
	'use strict';

	// pulled specific shims from https://github.com/es-shims/es5-shim

	var ArrayPrototype = Array.prototype;
	var ObjectPrototype = Object.prototype;
	var FunctionPrototype = Function.prototype;
	var StringPrototype = String.prototype;
	var array_slice = ArrayPrototype.slice;

	var _toString = ObjectPrototype.toString;
	var isFunction = function (val) {
	    return ObjectPrototype.toString.call(val) === '[object Function]';
	};
	var isArray = function isArray(obj) {
	    return _toString.call(obj) === '[object Array]';
	};
	var isString = function isString(obj) {
	    return _toString.call(obj) === '[object String]';
	};

	var supportsDescriptors = Object.defineProperty && (function () {
	    try {
	        Object.defineProperty({}, 'x', {});
	        return true;
	    } catch (e) { /* this is ES3 */
	        return false;
	    }
	}());

	// Define configurable, writable and non-enumerable props
	// if they don't exist.
	var defineProperty;
	if (supportsDescriptors) {
	    defineProperty = function (object, name, method, forceAssign) {
	        if (!forceAssign && (name in object)) { return; }
	        Object.defineProperty(object, name, {
	            configurable: true,
	            enumerable: false,
	            writable: true,
	            value: method
	        });
	    };
	} else {
	    defineProperty = function (object, name, method, forceAssign) {
	        if (!forceAssign && (name in object)) { return; }
	        object[name] = method;
	    };
	}
	var defineProperties = function (object, map, forceAssign) {
	    for (var name in map) {
	        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
	          defineProperty(object, name, map[name], forceAssign);
	        }
	    }
	};

	var toObject = function (o) {
	    if (o == null) { // this matches both null and undefined
	        throw new TypeError("can't convert " + o + ' to object');
	    }
	    return Object(o);
	};

	//
	// Util
	// ======
	//

	// ES5 9.4
	// http://es5.github.com/#x9.4
	// http://jsperf.com/to-integer

	function toInteger(num) {
	    var n = +num;
	    if (n !== n) { // isNaN
	        n = 0;
	    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
	        n = (n > 0 || -1) * Math.floor(Math.abs(n));
	    }
	    return n;
	}

	function ToUint32(x) {
	    return x >>> 0;
	}

	//
	// Function
	// ========
	//

	// ES-5 15.3.4.5
	// http://es5.github.com/#x15.3.4.5

	function Empty() {}

	defineProperties(FunctionPrototype, {
	    bind: function bind(that) { // .length is 1
	        // 1. Let Target be the this value.
	        var target = this;
	        // 2. If IsCallable(Target) is false, throw a TypeError exception.
	        if (!isFunction(target)) {
	            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	        }
	        // 3. Let A be a new (possibly empty) internal list of all of the
	        //   argument values provided after thisArg (arg1, arg2 etc), in order.
	        // XXX slicedArgs will stand in for "A" if used
	        var args = array_slice.call(arguments, 1); // for normal call
	        // 4. Let F be a new native ECMAScript object.
	        // 11. Set the [[Prototype]] internal property of F to the standard
	        //   built-in Function prototype object as specified in 15.3.3.1.
	        // 12. Set the [[Call]] internal property of F as described in
	        //   15.3.4.5.1.
	        // 13. Set the [[Construct]] internal property of F as described in
	        //   15.3.4.5.2.
	        // 14. Set the [[HasInstance]] internal property of F as described in
	        //   15.3.4.5.3.
	        var binder = function () {

	            if (this instanceof bound) {
	                // 15.3.4.5.2 [[Construct]]
	                // When the [[Construct]] internal method of a function object,
	                // F that was created using the bind function is called with a
	                // list of arguments ExtraArgs, the following steps are taken:
	                // 1. Let target be the value of F's [[TargetFunction]]
	                //   internal property.
	                // 2. If target has no [[Construct]] internal method, a
	                //   TypeError exception is thrown.
	                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Construct]] internal
	                //   method of target providing args as the arguments.

	                var result = target.apply(
	                    this,
	                    args.concat(array_slice.call(arguments))
	                );
	                if (Object(result) === result) {
	                    return result;
	                }
	                return this;

	            } else {
	                // 15.3.4.5.1 [[Call]]
	                // When the [[Call]] internal method of a function object, F,
	                // which was created using the bind function is called with a
	                // this value and a list of arguments ExtraArgs, the following
	                // steps are taken:
	                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 2. Let boundThis be the value of F's [[BoundThis]] internal
	                //   property.
	                // 3. Let target be the value of F's [[TargetFunction]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Call]] internal method
	                //   of target providing boundThis as the this value and
	                //   providing args as the arguments.

	                // equiv: target.call(this, ...boundArgs, ...args)
	                return target.apply(
	                    that,
	                    args.concat(array_slice.call(arguments))
	                );

	            }

	        };

	        // 15. If the [[Class]] internal property of Target is "Function", then
	        //     a. Let L be the length property of Target minus the length of A.
	        //     b. Set the length own property of F to either 0 or L, whichever is
	        //       larger.
	        // 16. Else set the length own property of F to 0.

	        var boundLength = Math.max(0, target.length - args.length);

	        // 17. Set the attributes of the length own property of F to the values
	        //   specified in 15.3.5.1.
	        var boundArgs = [];
	        for (var i = 0; i < boundLength; i++) {
	            boundArgs.push('$' + i);
	        }

	        // XXX Build a dynamic function with desired amount of arguments is the only
	        // way to set the length property of a function.
	        // In environments where Content Security Policies enabled (Chrome extensions,
	        // for ex.) all use of eval or Function costructor throws an exception.
	        // However in all of these environments Function.prototype.bind exists
	        // and so this code will never be executed.
	        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

	        if (target.prototype) {
	            Empty.prototype = target.prototype;
	            bound.prototype = new Empty();
	            // Clean up dangling references.
	            Empty.prototype = null;
	        }

	        // TODO
	        // 18. Set the [[Extensible]] internal property of F to true.

	        // TODO
	        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	        // 20. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	        //   false.
	        // 21. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	        //   and false.

	        // TODO
	        // NOTE Function objects created using Function.prototype.bind do not
	        // have a prototype property or the [[Code]], [[FormalParameters]], and
	        // [[Scope]] internal properties.
	        // XXX can't delete prototype in pure-js.

	        // 22. Return F.
	        return bound;
	    }
	});

	//
	// Array
	// =====
	//

	// ES5 15.4.3.2
	// http://es5.github.com/#x15.4.3.2
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	defineProperties(Array, { isArray: isArray });


	var boxedString = Object('a');
	var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

	var properlyBoxesContext = function properlyBoxed(method) {
	    // Check node 0.6.21 bug where third parameter is not boxed
	    var properlyBoxesNonStrict = true;
	    var properlyBoxesStrict = true;
	    if (method) {
	        method.call('foo', function (_, __, context) {
	            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
	        });

	        method.call([1], function () {
	            'use strict';
	            properlyBoxesStrict = typeof this === 'string';
	        }, 'x');
	    }
	    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
	};

	defineProperties(ArrayPrototype, {
	    forEach: function forEach(fun /*, thisp*/) {
	        var object = toObject(this),
	            self = splitString && isString(this) ? this.split('') : object,
	            thisp = arguments[1],
	            i = -1,
	            length = self.length >>> 0;

	        // If no callback function or if callback is not a callable function
	        if (!isFunction(fun)) {
	            throw new TypeError(); // TODO message
	        }

	        while (++i < length) {
	            if (i in self) {
	                // Invoke the callback function with call, passing arguments:
	                // context, property value, property key, thisArg object
	                // context
	                fun.call(thisp, self[i], i, object);
	            }
	        }
	    }
	}, !properlyBoxesContext(ArrayPrototype.forEach));

	// ES5 15.4.4.14
	// http://es5.github.com/#x15.4.4.14
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
	defineProperties(ArrayPrototype, {
	    indexOf: function indexOf(sought /*, fromIndex */ ) {
	        var self = splitString && isString(this) ? this.split('') : toObject(this),
	            length = self.length >>> 0;

	        if (!length) {
	            return -1;
	        }

	        var i = 0;
	        if (arguments.length > 1) {
	            i = toInteger(arguments[1]);
	        }

	        // handle negative indices
	        i = i >= 0 ? i : Math.max(0, length + i);
	        for (; i < length; i++) {
	            if (i in self && self[i] === sought) {
	                return i;
	            }
	        }
	        return -1;
	    }
	}, hasFirefox2IndexOfBug);

	//
	// String
	// ======
	//

	// ES5 15.5.4.14
	// http://es5.github.com/#x15.5.4.14

	// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
	// Many browsers do not split properly with regular expressions or they
	// do not perform the split correctly under obscure conditions.
	// See http://blog.stevenlevithan.com/archives/cross-browser-split
	// I've tested in many browsers and this seems to cover the deviant ones:
	//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
	//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
	//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
	//       [undefined, "t", undefined, "e", ...]
	//    ''.split(/.?/) should be [], not [""]
	//    '.'.split(/()()/) should be ["."], not ["", "", "."]

	var string_split = StringPrototype.split;
	if (
	    'ab'.split(/(?:ab)*/).length !== 2 ||
	    '.'.split(/(.?)(.?)/).length !== 4 ||
	    'tesst'.split(/(s)*/)[1] === 't' ||
	    'test'.split(/(?:)/, -1).length !== 4 ||
	    ''.split(/.?/).length ||
	    '.'.split(/()()/).length > 1
	) {
	    (function () {
	        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

	        StringPrototype.split = function (separator, limit) {
	            var string = this;
	            if (separator === void 0 && limit === 0) {
	                return [];
	            }

	            // If `separator` is not a regex, use native split
	            if (_toString.call(separator) !== '[object RegExp]') {
	                return string_split.call(this, separator, limit);
	            }

	            var output = [],
	                flags = (separator.ignoreCase ? 'i' : '') +
	                        (separator.multiline  ? 'm' : '') +
	                        (separator.extended   ? 'x' : '') + // Proposed for ES6
	                        (separator.sticky     ? 'y' : ''), // Firefox 3+
	                lastLastIndex = 0,
	                // Make `global` and avoid `lastIndex` issues by working with a copy
	                separator2, match, lastIndex, lastLength;
	            separator = new RegExp(separator.source, flags + 'g');
	            string += ''; // Type-convert
	            if (!compliantExecNpcg) {
	                // Doesn't need flags gy, but they don't hurt
	                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
	            }
	            /* Values for `limit`, per the spec:
	             * If undefined: 4294967295 // Math.pow(2, 32) - 1
	             * If 0, Infinity, or NaN: 0
	             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	             * If other: Type-convert, then use the above rules
	             */
	            limit = limit === void 0 ?
	                -1 >>> 0 : // Math.pow(2, 32) - 1
	                ToUint32(limit);
	            while (match = separator.exec(string)) {
	                // `separator.lastIndex` is not reliable cross-browser
	                lastIndex = match.index + match[0].length;
	                if (lastIndex > lastLastIndex) {
	                    output.push(string.slice(lastLastIndex, match.index));
	                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
	                    // nonparticipating capturing groups
	                    if (!compliantExecNpcg && match.length > 1) {
	                        match[0].replace(separator2, function () {
	                            for (var i = 1; i < arguments.length - 2; i++) {
	                                if (arguments[i] === void 0) {
	                                    match[i] = void 0;
	                                }
	                            }
	                        });
	                    }
	                    if (match.length > 1 && match.index < string.length) {
	                        ArrayPrototype.push.apply(output, match.slice(1));
	                    }
	                    lastLength = match[0].length;
	                    lastLastIndex = lastIndex;
	                    if (output.length >= limit) {
	                        break;
	                    }
	                }
	                if (separator.lastIndex === match.index) {
	                    separator.lastIndex++; // Avoid an infinite loop
	                }
	            }
	            if (lastLastIndex === string.length) {
	                if (lastLength || !separator.test('')) {
	                    output.push('');
	                }
	            } else {
	                output.push(string.slice(lastLastIndex));
	            }
	            return output.length > limit ? output.slice(0, limit) : output;
	        };
	    }());

	// [bugfix, chrome]
	// If separator is undefined, then the result array contains just one String,
	// which is the this value (converted to a String). If limit is not undefined,
	// then the output array is truncated so that it contains no more than limit
	// elements.
	// "0".split(undefined, 0) -> []
	} else if ('0'.split(void 0, 0).length) {
	    StringPrototype.split = function split(separator, limit) {
	        if (separator === void 0 && limit === 0) { return []; }
	        return string_split.call(this, separator, limit);
	    };
	}

	// ES5 15.5.4.20
	// whitespace from: http://es5.github.io/#x15.5.4.20
	var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	    '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
	    '\u2029\uFEFF';
	var zeroWidth = '\u200b';
	var wsRegexChars = '[' + ws + ']';
	var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
	var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
	var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
	defineProperties(StringPrototype, {
	    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
	    // http://perfectionkills.com/whitespace-deviations/
	    trim: function trim() {
	        if (this === void 0 || this === null) {
	            throw new TypeError("can't convert " + this + ' to object');
	        }
	        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
	    }
	}, hasTrimWhitespaceBug);

	// ECMA-262, 3rd B.2.3
	// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
	// non-normative section suggesting uniform semantics and it should be
	// normalized across all browsers
	// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
	var string_substr = StringPrototype.substr;
	var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
	defineProperties(StringPrototype, {
	    substr: function substr(start, length) {
	        return string_substr.call(
	            this,
	            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
	            length
	        );
	    }
	}, hasNegativeSubstrBug);


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var JSON3 = __webpack_require__(46);

	// Some extra characters that Chrome gets wrong, and substitutes with
	// something else on the wire.
	var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
	  , extraLookup;

	// This may be quite slow, so let's delay until user actually uses bad
	// characters.
	var unrollLookup = function(escapable) {
	  var i;
	  var unrolled = {};
	  var c = [];
	  for (i = 0; i < 65536; i++) {
	    c.push( String.fromCharCode(i) );
	  }
	  escapable.lastIndex = 0;
	  c.join('').replace(escapable, function(a) {
	    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    return '';
	  });
	  escapable.lastIndex = 0;
	  return unrolled;
	};

	// Quote string, also taking care of unicode characters that browsers
	// often break. Especially, take care of unicode surrogates:
	// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
	module.exports = {
	  quote: function(string) {
	    var quoted = JSON3.stringify(string);

	    // In most cases this should be very fast and good enough.
	    extraEscapable.lastIndex = 0;
	    if (!extraEscapable.test(quoted)) {
	      return quoted;
	    }

	    if (!extraLookup) {
	      extraLookup = unrollLookup(extraEscapable);
	    }

	    return quoted.replace(extraEscapable, function(a) {
	      return extraLookup[a];
	    });
	  }
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:utils:transport');
	}

	module.exports = function(availableTransports) {
	  return {
	    filterToEnabled: function(transportsWhitelist, info) {
	      var transports = {
	        main: []
	      , facade: []
	      };
	      if (!transportsWhitelist) {
	        transportsWhitelist = [];
	      } else if (typeof transportsWhitelist === 'string') {
	        transportsWhitelist = [transportsWhitelist];
	      }

	      availableTransports.forEach(function(trans) {
	        if (!trans) {
	          return;
	        }

	        if (trans.transportName === 'websocket' && info.websocket === false) {
	          debug('disabled from server', 'websocket');
	          return;
	        }

	        if (transportsWhitelist.length &&
	            transportsWhitelist.indexOf(trans.transportName) === -1) {
	          debug('not in whitelist', trans.transportName);
	          return;
	        }

	        if (trans.enabled(info)) {
	          debug('enabled', trans.transportName);
	          transports.main.push(trans);
	          if (trans.facadeTransport) {
	            transports.facade.push(trans.facadeTransport);
	          }
	        } else {
	          debug('disabled', trans.transportName);
	        }
	      });
	      return transports;
	    }
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 62 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var logObject = {};
	['log', 'debug', 'warn'].forEach(function (level) {
	  var levelExists;

	  try {
	    levelExists = global.console && global.console[level] && global.console[level].apply;
	  } catch(e) {
	    // do nothing
	  }

	  logObject[level] = levelExists ? function () {
	    return global.console[level].apply(global.console, arguments);
	  } : (level === 'log' ? function () {} : logObject.log);
	});

	module.exports = logObject;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';

	function Event(eventType) {
	  this.type = eventType;
	}

	Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
	  this.type = eventType;
	  this.bubbles = canBubble;
	  this.cancelable = cancelable;
	  this.timeStamp = +new Date();
	  return this;
	};

	Event.prototype.stopPropagation = function() {};
	Event.prototype.preventDefault = function() {};

	Event.CAPTURING_PHASE = 1;
	Event.AT_TARGET = 2;
	Event.BUBBLING_PHASE = 3;

	module.exports = Event;


/***/ },
/* 64 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = global.location || {
	  origin: 'http://localhost:80'
	, protocol: 'http'
	, host: 'localhost'
	, port: 80
	, href: 'http://localhost/'
	, hash: ''
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , Event = __webpack_require__(63)
	  ;

	function CloseEvent() {
	  Event.call(this);
	  this.initEvent('close', false, false);
	  this.wasClean = false;
	  this.code = 0;
	  this.reason = '';
	}

	inherits(CloseEvent, Event);

	module.exports = CloseEvent;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , Event = __webpack_require__(63)
	  ;

	function TransportMessageEvent(data) {
	  Event.call(this);
	  this.initEvent('message', false, false);
	  this.data = data;
	}

	inherits(TransportMessageEvent, Event);

	module.exports = TransportMessageEvent;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var EventEmitter = __webpack_require__(26).EventEmitter
	  , inherits = __webpack_require__(25)
	  , urlUtils = __webpack_require__(17)
	  , XDR = __webpack_require__(40)
	  , XHRCors = __webpack_require__(35)
	  , XHRLocal = __webpack_require__(37)
	  , XHRFake = __webpack_require__(68)
	  , InfoIframe = __webpack_require__(69)
	  , InfoAjax = __webpack_require__(71)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:info-receiver');
	}

	function InfoReceiver(baseUrl, urlInfo) {
	  debug(baseUrl);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function() {
	    self.doXhr(baseUrl, urlInfo);
	  }, 0);
	}

	inherits(InfoReceiver, EventEmitter);

	// TODO this is currently ignoring the list of available transports and the whitelist

	InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
	  // determine method of CORS support (if needed)
	  if (urlInfo.sameOrigin) {
	    return new InfoAjax(url, XHRLocal);
	  }
	  if (XHRCors.enabled) {
	    return new InfoAjax(url, XHRCors);
	  }
	  if (XDR.enabled && urlInfo.sameScheme) {
	    return new InfoAjax(url, XDR);
	  }
	  if (InfoIframe.enabled()) {
	    return new InfoIframe(baseUrl, url);
	  }
	  return new InfoAjax(url, XHRFake);
	};

	InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
	  var self = this
	    , url = urlUtils.addPath(baseUrl, '/info')
	    ;
	  debug('doXhr', url);

	  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

	  this.timeoutRef = setTimeout(function() {
	    debug('timeout');
	    self._cleanup(false);
	    self.emit('finish');
	  }, InfoReceiver.timeout);

	  this.xo.once('finish', function(info, rtt) {
	    debug('finish', info, rtt);
	    self._cleanup(true);
	    self.emit('finish', info, rtt);
	  });
	};

	InfoReceiver.prototype._cleanup = function(wasClean) {
	  debug('_cleanup');
	  clearTimeout(this.timeoutRef);
	  this.timeoutRef = null;
	  if (!wasClean && this.xo) {
	    this.xo.close();
	  }
	  this.xo = null;
	};

	InfoReceiver.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  this._cleanup(false);
	};

	InfoReceiver.timeout = 8000;

	module.exports = InfoReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EventEmitter = __webpack_require__(26).EventEmitter
	  , inherits = __webpack_require__(25)
	  ;

	function XHRFake(/* method, url, payload, opts */) {
	  var self = this;
	  EventEmitter.call(this);

	  this.to = setTimeout(function() {
	    self.emit('finish', 200, '{}');
	  }, XHRFake.timeout);
	}

	inherits(XHRFake, EventEmitter);

	XHRFake.prototype.close = function() {
	  clearTimeout(this.to);
	};

	XHRFake.timeout = 2000;

	module.exports = XHRFake;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var EventEmitter = __webpack_require__(26).EventEmitter
	  , inherits = __webpack_require__(25)
	  , JSON3 = __webpack_require__(46)
	  , utils = __webpack_require__(14)
	  , IframeTransport = __webpack_require__(45)
	  , InfoReceiverIframe = __webpack_require__(70)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:info-iframe');
	}

	function InfoIframe(baseUrl, url) {
	  var self = this;
	  EventEmitter.call(this);

	  var go = function() {
	    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

	    ifr.once('message', function(msg) {
	      if (msg) {
	        var d;
	        try {
	          d = JSON3.parse(msg);
	        } catch (e) {
	          debug('bad json', msg);
	          self.emit('finish');
	          self.close();
	          return;
	        }

	        var info = d[0], rtt = d[1];
	        self.emit('finish', info, rtt);
	      }
	      self.close();
	    });

	    ifr.once('close', function() {
	      self.emit('finish');
	      self.close();
	    });
	  };

	  // TODO this seems the same as the 'needBody' from transports
	  if (!global.document.body) {
	    utils.attachEvent('load', go);
	  } else {
	    go();
	  }
	}

	inherits(InfoIframe, EventEmitter);

	InfoIframe.enabled = function() {
	  return IframeTransport.enabled();
	};

	InfoIframe.prototype.close = function() {
	  if (this.ifr) {
	    this.ifr.close();
	  }
	  this.removeAllListeners();
	  this.ifr = null;
	};

	module.exports = InfoIframe;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), (function() { return this; }())))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(25)
	  , EventEmitter = __webpack_require__(26).EventEmitter
	  , JSON3 = __webpack_require__(46)
	  , XHRLocalObject = __webpack_require__(37)
	  , InfoAjax = __webpack_require__(71)
	  ;

	function InfoReceiverIframe(transUrl) {
	  var self = this;
	  EventEmitter.call(this);

	  this.ir = new InfoAjax(transUrl, XHRLocalObject);
	  this.ir.once('finish', function(info, rtt) {
	    self.ir = null;
	    self.emit('message', JSON3.stringify([info, rtt]));
	  });
	}

	inherits(InfoReceiverIframe, EventEmitter);

	InfoReceiverIframe.transportName = 'iframe-info-receiver';

	InfoReceiverIframe.prototype.close = function() {
	  if (this.ir) {
	    this.ir.close();
	    this.ir = null;
	  }
	  this.removeAllListeners();
	};

	module.exports = InfoReceiverIframe;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var EventEmitter = __webpack_require__(26).EventEmitter
	  , inherits = __webpack_require__(25)
	  , JSON3 = __webpack_require__(46)
	  , objectUtils = __webpack_require__(50)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:info-ajax');
	}

	function InfoAjax(url, AjaxObject) {
	  EventEmitter.call(this);

	  var self = this;
	  var t0 = +new Date();
	  this.xo = new AjaxObject('GET', url);

	  this.xo.once('finish', function(status, text) {
	    var info, rtt;
	    if (status === 200) {
	      rtt = (+new Date()) - t0;
	      if (text) {
	        try {
	          info = JSON3.parse(text);
	        } catch (e) {
	          debug('bad json', text);
	        }
	      }

	      if (!objectUtils.isObject(info)) {
	        info = {};
	      }
	    }
	    self.emit('finish', info, rtt);
	    self.removeAllListeners();
	  });
	}

	inherits(InfoAjax, EventEmitter);

	InfoAjax.prototype.close = function() {
	  this.removeAllListeners();
	  this.xo.close();
	};

	module.exports = InfoAjax;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var urlUtils = __webpack_require__(17)
	  , eventUtils = __webpack_require__(14)
	  , JSON3 = __webpack_require__(46)
	  , FacadeJS = __webpack_require__(73)
	  , InfoIframeReceiver = __webpack_require__(70)
	  , iframeUtils = __webpack_require__(49)
	  , loc = __webpack_require__(64)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(22)('sockjs-client:iframe-bootstrap');
	}

	module.exports = function(SockJS, availableTransports) {
	  var transportMap = {};
	  availableTransports.forEach(function(at) {
	    if (at.facadeTransport) {
	      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
	    }
	  });

	  // hard-coded for the info iframe
	  // TODO see if we can make this more dynamic
	  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
	  var parentOrigin;

	  /* eslint-disable camelcase */
	  SockJS.bootstrap_iframe = function() {
	    /* eslint-enable camelcase */
	    var facade;
	    iframeUtils.currentWindowId = loc.hash.slice(1);
	    var onMessage = function(e) {
	      if (e.source !== parent) {
	        return;
	      }
	      if (typeof parentOrigin === 'undefined') {
	        parentOrigin = e.origin;
	      }
	      if (e.origin !== parentOrigin) {
	        return;
	      }

	      var iframeMessage;
	      try {
	        iframeMessage = JSON3.parse(e.data);
	      } catch (ignored) {
	        debug('bad json', e.data);
	        return;
	      }

	      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
	        return;
	      }
	      switch (iframeMessage.type) {
	      case 's':
	        var p;
	        try {
	          p = JSON3.parse(iframeMessage.data);
	        } catch (ignored) {
	          debug('bad json', iframeMessage.data);
	          break;
	        }
	        var version = p[0];
	        var transport = p[1];
	        var transUrl = p[2];
	        var baseUrl = p[3];
	        debug(version, transport, transUrl, baseUrl);
	        // change this to semver logic
	        if (version !== SockJS.version) {
	          throw new Error('Incompatible SockJS! Main site uses:' +
	                    ' "' + version + '", the iframe:' +
	                    ' "' + SockJS.version + '".');
	        }

	        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
	            !urlUtils.isOriginEqual(baseUrl, loc.href)) {
	          throw new Error('Can\'t connect to different domain from within an ' +
	                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
	        }
	        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
	        break;
	      case 'm':
	        facade._send(iframeMessage.data);
	        break;
	      case 'c':
	        if (facade) {
	          facade._close();
	        }
	        facade = null;
	        break;
	      }
	    };

	    eventUtils.attachEvent('message', onMessage);

	    // Start
	    iframeUtils.postMessage('s');
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var JSON3 = __webpack_require__(46)
	  , iframeUtils = __webpack_require__(49)
	  ;

	function FacadeJS(transport) {
	  this._transport = transport;
	  transport.on('message', this._transportMessage.bind(this));
	  transport.on('close', this._transportClose.bind(this));
	}

	FacadeJS.prototype._transportClose = function(code, reason) {
	  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
	};
	FacadeJS.prototype._transportMessage = function(frame) {
	  iframeUtils.postMessage('t', frame);
	};
	FacadeJS.prototype._send = function(data) {
	  this._transport.send(data);
	};
	FacadeJS.prototype._close = function() {
	  this._transport.close();
	  this._transport.removeAllListeners();
	};

	module.exports = FacadeJS;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(75)();

	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Wangxin on 2016/5/18.
	 */

	'use strict';/*使用严格模式*/
	/*加载样式*/
	__webpack_require__(77);

	/////*加载库*/
	//require('./js/lib/zepto.mim.js');
	__webpack_require__(91);
	__webpack_require__(92);

	/*加载js*/
	__webpack_require__(93);
	__webpack_require__(94);
	__webpack_require__(95);
	__webpack_require__(96);
	__webpack_require__(98);
	__webpack_require__(101);
	__webpack_require__(100);
	__webpack_require__(99);

	var Common=__webpack_require__(99);

	console.log("!!");
	Common.swInit();



/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(78);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(90)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(78, function() {
				var newContent = __webpack_require__(78);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(79)();
	// imports


	// module
	exports.push([module.id, "/*****************reset*******************/\r\nhtml {\r\n    font-size: 100%;\r\n    cursor: default;\r\n}\r\n\r\nbody, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, textarea, p, blockquote, th, td {\r\n    margin: 0;\r\n    padding: 0;\r\n    font-family: \"Microsoft YaHei\", Arial, Verdana, Helvetica, sans-serif;\r\n}\r\n\r\n/*html{-webkit-text-size-adjust:none;}*/\r\ntable {\r\n    border-collapse: collapse;\r\n    border-spacing: 0;\r\n}\r\n\r\nfieldset, img {\r\n    border: 0;\r\n}\r\n\r\naddress, caption, cite, code, dfn, em, strong, th, var {\r\n    font-style: normal;\r\n    font-weight: normal;\r\n}\r\n\r\nol, ul {\r\n    list-style: none;\r\n}\r\n\r\ncaption, th {\r\n    text-align: left;\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n    font-weight: normal;\r\n}\r\n\r\nq:before, q:after {\r\n    content: '';\r\n}\r\n\r\nabbr, acronym {\r\n    border: 0;\r\n}\r\n\r\n/*****************base********************/\r\nhtml, body {\r\n    height: 100%;\r\n    width: 100%;\r\n    overflow: auto;\r\n}\r\n\r\n.fl {\r\n    float: left;\r\n}\r\n\r\n.fr {\r\n    float: right;\r\n}\r\n\r\n.clr {\r\n    clear: both;\r\n}\r\n\r\n.hidden {\r\n    display: none;\r\n}\r\n\r\ninput::-webkit-input-placeholder, textarea::-webkit-input-placeholder {\r\n    color: #c8c8c8;\r\n}\r\n\r\ninput:-moz-placeholder, textarea:-moz-placeholder {\r\n    color: #c8c8c8;\r\n}\r\n\r\ninput::-moz-placeholder, textarea::-moz-placeholder {\r\n    color: #c8c8c8;\r\n}\r\n\r\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\r\n    color: #c8c8c8;\r\n}\r\n\r\nv\\: * {\r\n    behavior: url(#default#vml);\r\n    display: inline-block;\r\n    position: absolute;\r\n}\r\n\r\nv\\:shape {\r\n    behavior: url(#default#VML);\r\n    display: inline-block;\r\n    position: absolute;\r\n}\r\n\r\nv\\:group {\r\n    behavior: url(#default#VML);\r\n    position: absolute;\r\n    display: inline-block;\r\n}\r\n\r\nv\\:oval {\r\n    behavior: url(#default#VML);\r\n    position: absolute;\r\n}\r\n\r\nv\\:TextBox {\r\n    behavior: url(#default#VML);\r\n    position: absolute;\r\n    font-size: 12px;\r\n    text-align: center;\r\n}\r\n\r\npath {\r\n    fill: none;\r\n    stroke-width: 3;\r\n}\r\n\r\ncircle {\r\n}\r\n\r\n/*#subway-content,#subwaySvg{width: 2000px; height: 2000px;}*/\r\n#subway-svg {\r\n    position: absolute;\r\n}\r\n\r\n#subwaySvgBody {\r\n    position: absolute;\r\n    left: 0px;\r\n    top: 0px;\r\n    /*background: yellow;*/\r\n}\r\n\r\n.subway_svg {\r\n    width: 2000px;\r\n    height: 2000px;\r\n    position: relative;\r\n}\r\n\r\n#g-bg {\r\n    display: none;\r\n}\r\n\r\n#select_bg {\r\n    fill: #FFF;\r\n    fill-opacity: 0.8;\r\n}\r\n\r\n/*#subway{width: 2000px;height: 2000px; position: relative; overflow: hidden;}*/\r\n#subway, #citypage {\r\n    display: none;\r\n}\r\n\r\n#subway {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0; /*overflow: hidden;*/\r\n}\r\n\r\n\r\n.line_name {\r\n}\r\n\r\n.line_name_txt {\r\n    font-size: 12px;\r\n}\r\n\r\n.station-out {\r\n    display: block;\r\n}\r\n\r\n.infowindow-out {\r\n    position: absolute;\r\n}\r\n\r\n.infowindow-content {\r\n    position: absolute;\r\n}\r\n\r\nbody.disable-default-action {\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n.ust {\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n/*****************style********************/\r\n.os {\r\n    display: none;\r\n}\r\n\r\n#os {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.top_bar {\r\n    display: none;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 45px;\r\n    z-index: 999999;\r\n    background: #f8f8f8;\r\n    border-bottom: 1px #9a9997 solid;\r\n    text-align: center;\r\n}\r\n\r\n/*.ios .top_bar{padding-top: 20px;}*/\r\n.top_bar .city_name, .top_bar .city_title {\r\n    display: inline-block;\r\n    font-size: 20px;\r\n    text-align: center;\r\n    line-height: 45px;\r\n}\r\n\r\n.top_bar .back_btn {\r\n    position: absolute;\r\n    height: 45px;\r\n    width: 45px;\r\n    background: url(" + __webpack_require__(80) + ") center center no-repeat;\r\n    background-size: 10px 18px;\r\n}\r\n\r\n.top_bar .city_list_btn {\r\n    display: inline-block;\r\n    position: absolute;\r\n    right: 12px;\r\n    bottom: 9px;\r\n    width: 50px;\r\n    text-align: center;\r\n    text-decoration: none;\r\n    color: #0091ff;\r\n    font-size: 16px; /*border: 1px #0091ff solid;*//*padding: 4px 12px 4px 4px;*//*border-radius: 3px;*/\r\n    line-height: 26px;\r\n    min-height: 26px;\r\n    min-width: 30px; /*background: url(../img/subway/arrow.png) center right no-repeat;background-size: 10px 12px;*/\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n/*.route_entry{margin-top: 10px;display: -moz-box; display: -webkit-box; display: box;  width: calc(100% - 126px); margin-left:45px; }*/\r\n.msubway .top_bar {\r\n    display: block;\r\n}\r\n\r\n.page-title {\r\n    margin: 10px auto;\r\n    font-size: 20px;\r\n    /*color: #6a6968;*/\r\n}\r\n\r\n#subwaySvg {\r\n    position: absolute;\r\n    z-index: 10;\r\n    transform: scale3d(1, 1, 1);\r\n}\r\n\r\n#drag_handle {\r\n    height: 100%;\r\n    width: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: 10\r\n}\r\n\r\n/*.subway-content{overflow: visible;}*/\r\n.light_box {\r\n    display: none;\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    background: rgba(0, 0, 0, 0.2);\r\n    z-index: 15;\r\n}\r\n\r\n.filter_btn {\r\n    display: none;\r\n    position: fixed;\r\n    width: 36px;\r\n    height: 14px;\r\n    line-height: 9px;\r\n    top: 14px;\r\n    right: 8px;\r\n    box-shadow: 0 0 6px 0 rgba(0, 0, 0,.3);\r\n    border-radius: 2px;\r\n    z-index: 20;\r\n    background: rgba(102,102,102,1) url(" + __webpack_require__(81) + ") no-repeat;\r\n    background-size: 24px 14px;\r\n    background-position: 6px 5px;\r\n    -webkit-text-size-adjust:none;\r\n    font-size: 9px;\r\n    text-align: center;\r\n    padding-top: 22px;\r\n    color: #fff;\r\n}\r\n\r\n.filter_content {\r\n    display: none;\r\n    position: absolute;\r\n    width: 200px;\r\n    z-index: 21;\r\n    background: #fff;\r\n    box-shadow: 0 0 6px 1px rgba(0, 0, 0, .3);\r\n    border-radius: 5px;\r\n}\r\n\r\n/*.ios .filter_content{top: 112px;}*/\r\n\r\n.fliter_detail {\r\n    max-height: 286px;\r\n    min-width : 130px;\r\n    padding: 0 11px;\r\n    overflow-y: scroll;\r\n    -webkit-overflow-scrolling: touch;\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n.fliter_item {\r\n    font-size: 12px;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    border-bottom: 1px #eaeaea solid;\r\n    overflow: hidden;\r\n    zoom: 1;\r\n}\r\n\r\n.help_btn{\r\n    display: none;\r\n    position: fixed;\r\n    width: 36px;\r\n    height: 14px;\r\n    line-height: 9px;\r\n    top: 58px;\r\n    right: 8px;\r\n    box-shadow: 0 0 6px 0 rgba(0, 0, 0,.3);\r\n    border-radius: 2px;\r\n    z-index: 20;\r\n    background: rgba(102,102,102,1) url(" + __webpack_require__(82) + ") center center no-repeat;\r\n    background-size: 24px 14px;\r\n    background-position: 6px 5px;\r\n    -webkit-text-size-adjust:none;\r\n    font-size: 9px;\r\n    text-align: center;\r\n    padding-top: 22px;\r\n    color: #fff;\r\n}\r\n\r\n\r\n.help_content{\r\n    display:none;\r\n    position: absolute;\r\n    width:180px;\r\n    top:30%;\r\n    z-index: 20;\r\n    background: #fff;\r\n    box-shadow: 0 0 6px 1px rgba(0, 0, 0, .3);\r\n    border-radius: 5px;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    padding-bottom: 5px;\r\n}\r\n\r\n.help_title{\r\n    display: block;\r\n    margin: 0 auto;\r\n    height: 16px;\r\n    font-size: 16px;\r\n    line-height: 16px;\r\n    padding:8px 16px;\r\n    border-bottom: 1px solid #cccccc;\r\n}\r\n.help_name{\r\n    float: left;\r\n}\r\n\r\n\r\n.help_close{\r\n    position: absolute;\r\n    top: 4px;\r\n    right: 6px;\r\n    width: 22px;\r\n    height: 22px;\r\n    background:url(" + __webpack_require__(83) + ") center center no-repeat;\r\n    background-size: 22px 22px;\r\n}\r\n\r\n.help_item{\r\n    width: 200px;\r\n    height: 20px;\r\n    margin: 5px auto;\r\n    text-decoration: none;\r\n}\r\n.help_color{\r\n    display:block;\r\n    float: left;\r\n    height: 8px;\r\n    width: 30px;\r\n    margin: 6px 3px 6px 40px;\r\n}\r\n.help_color_warning{\r\n    display:block;\r\n    float: left;\r\n    height: 20px;\r\n    width: 30px;\r\n    margin: 0 3px  0 40px;\r\n    background:url(" + __webpack_require__(84) + ") no-repeat;\r\n    background-position: 5px 0;\r\n    background-size: 20px 20px;\r\n}\r\n.help_text{\r\n    float: right;\r\n    display: block;\r\n    font-size: 14px;\r\n    line-height: 14px;\r\n    text-align: left;\r\n    margin:3px 40px 3px 13px;\r\n    height: 14px;\r\n    width: 70px;\r\n}\r\n\r\n/*.ios .filter_btn{top: 76px;}*/\r\n.msubway .filter_btn {\r\n    display: block;\r\n}\r\n\r\n.route_close_btn {\r\n    position: fixed;\r\n    width: 40px;\r\n    height: 36px;\r\n    top: 56px;\r\n    right: 10px;\r\n    z-index: 20;\r\n    background: #fff url(" + __webpack_require__(85) + ") center center no-repeat;\r\n    background-size: 16px 16px;\r\n    box-shadow: 0 0 6px 1px rgba(0, 0, 0, .3);\r\n}\r\n\r\n#refresh_content{\r\n    display:none;\r\n}\r\n.refresh_content{\r\n    display: block;\r\n}\r\n\r\n\r\n.refresh_btn {\r\n    position: fixed;\r\n    width: 30px;\r\n    height: 30px;\r\n    bottom: 15px;\r\n    left: 15px;\r\n    border-radius: 50%;\r\n    z-index: 20;\r\n    border: solid #ffffff 1px;\r\n    background-color: rgba(156,156,156,1);\r\n}\r\n.refresh{\r\n    display: block;\r\n    margin: 0 auto;\r\n    width: 30px;\r\n    height: 30px;\r\n    border-radius: 50%;\r\n    background: url(" + __webpack_require__(86) + ") center center no-repeat;\r\n    background-size: 20px 20px;\r\n}\r\n\r\n.refresh_active{\r\n    animation: updata 1.5s infinite linear;\r\n    -webkit-animation:updata 1.5s infinite linear;\r\n}\r\n\r\n@-webkit-keyframes updata {\r\n    from {\r\n        -webkit-transform: rotate(0deg);\r\n    }\r\n    to {\r\n        -webkit-transform: rotate(720deg);\r\n    }\r\n}\r\n\r\n\r\n.refresh_box{\r\n    position: fixed;\r\n    bottom: 17px;\r\n    left: 30px;\r\n    border: solid #ffffff 1px;\r\n    display: none;\r\n    height: 25px;\r\n    line-height: 25px;\r\n    width: 0;\r\n    font-size: 12px;\r\n    color:#fff;\r\n    background-color: rgba(156,156,156,0.8);\r\n    border-radius: 20px;\r\n    z-index: 11;\r\n}\r\n.refresh_box_show{\r\n    animation: showBox 4s;\r\n    -webkit-animation:showBox 4s;\r\n}\r\n\r\n@-webkit-keyframes showBox {\r\n    0% {\r\n        width: 0;\r\n    }\r\n    10% {\r\n        width: 120px;\r\n    }\r\n    93% {\r\n        width: 120px;\r\n    }\r\n    98% {\r\n        width: 0;\r\n    }\r\n    100% {\r\n        width: 0;\r\n    }\r\n}\r\n.refresh_time_text{\r\n    display: block;\r\n    opacity: 0;\r\n    margin-left: 25px;\r\n    text-align: left;\r\n    width: 98px;\r\n    font-weight: bold;\r\n}\r\n.refresh_time_text_show{\r\n    animation: showText 4s;\r\n    -webkit-animation:showText 4s;\r\n}\r\n@-webkit-keyframes showText {\r\n    0% {\r\n        opacity: 0;\r\n    }\r\n    10% {\r\n        opacity: 0;\r\n    }\r\n    20%{\r\n        opacity: 1;\r\n    }\r\n    90% {\r\n        opacity: 1;\r\n    }\r\n    95%{\r\n        opacity: 0;\r\n    }\r\n    98% {\r\n        opacity: 0;\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n    }\r\n}\r\n\r\n.refresh_error{\r\n    display: none;\r\n    position: absolute;\r\n    top:40%;\r\n    left: 30px;\r\n    right: 30px;\r\n    background-color: rgba(102,102,102,0.8);\r\n    border-radius:10px;\r\n    width:auto;\r\n    height: 50px;\r\n}\r\n.refresh_error_text{\r\n    color:#fff;\r\n    display: block;\r\n    width: 200px;\r\n    height: 20px;\r\n    line-height: 20px;\r\n    text-align: center;\r\n    margin:14px auto;\r\n    font-size: 14px;\r\n}\r\n\r\n\r\n\r\n/*.ios .route_close_btn{top: 76px;}*/\r\n\r\n/*.fliter_item_last{margin-bottom: 30px;}*/\r\n.line_color {\r\n    display: block;\r\n    height: 8px;\r\n    width: 60px;\r\n    float: left;\r\n    margin-top: 16px;\r\n    margin-right: 10px;\r\n}\r\n\r\n.line_name {\r\n    display: block;\r\n    float: left;\r\n    margin-left: 20px;\r\n}\r\n\r\n.overlays {\r\n    position: absolute;\r\n}\r\n\r\n/*.tip_wrap_out{display: none; position: absolute;z-index: 23; -webkit-transform-origin: 50% bottom;transform-origin: 50% bottom;}*/\r\n.tip_wrap_out {\r\n    display: none;\r\n    position: absolute;\r\n    z-index: 20;\r\n}\r\n\r\n.tip_wrap {\r\n    /*调整模态框的位置*/\r\n    position: absolute;\r\n    left: -150px; /*body-width/2+8*/\r\n    bottom: 0;\r\n    z-index: 101;\r\n    margin-bottom: 3px;\r\n}\r\n\r\n.tip_body {\r\n    width: 300px;\r\n    height: auto;\r\n    overflow: hidden;\r\n    font-size: 16px;\r\n    background: rgba(255, 255, 255, 1);\r\n    box-shadow: 0 0 6px 1px rgba(0, 0, 0, .3);\r\n    border-radius: 5px;\r\n}\r\n\r\n.tip_title {\r\n    /*width: 100%;*/\r\n    height: auto;\r\n    padding: 0 16px 0 16px;\r\n    border-bottom: solid 1px #cccccc;\r\n}\r\n\r\n.tip_name {\r\n    display: inline-block;\r\n    font-size: 16px;\r\n    font-weight: 600;\r\n    color: black;\r\n    padding: 10px 0;\r\n    height: 16px;\r\n    line-height: 16px;\r\n}\r\n\r\n.tip_detail_time {\r\n    display: inline-block;\r\n    font-size: 12px;\r\n    padding: 10px 0;\r\n    height: 12px;\r\n    color:#848484;\r\n}\r\n\r\n.tip_close {\r\n    position: absolute;\r\n    top: 7px;\r\n    right: 6px;\r\n    width: 22px;\r\n    height: 22px;\r\n    background: url(" + __webpack_require__(83) + ") center center no-repeat;\r\n    background-size: 22px 22px;\r\n}\r\n\r\n.tip_detail {\r\n    display: block;\r\n    color: red;\r\n    font-size: 9px;\r\n}\r\n\r\n.tip_detail_error, .tip_detail_success {\r\n    padding-bottom: 4px;\r\n}\r\n\r\n.tip_content {\r\n    padding: 4px 16px 0 16px;\r\n    height: auto;\r\n}\r\n\r\n.tip_detail_line {\r\n    overflow: hidden;\r\n    color: #6a6968;\r\n    font-size: 10px;\r\n    padding-bottom: 8px;\r\n    width: 100%;\r\n    display: block;\r\n    margin-top: 5px;\r\n    line-height: 24px;\r\n}\r\n\r\n.tip_detail_btn {\r\n    padding-left: 16px;\r\n    padding-right: 5px;\r\n}\r\n\r\n.line-label {\r\n    color:black;\r\n    display: inline-block;\r\n    /*padding: 0 5px;*/\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    /*border-radius: 5px;*/\r\n}\r\n\r\n.line-sub-label {\r\n    padding-left: 5px;\r\n    font-size: 14px;\r\n    color: #000;\r\n}\r\n\r\n.line-sub-label {\r\n    padding-left: 5px;\r\n}\r\n\r\n.time-item {\r\n    padding-bottom: 10px;\r\n}\r\n\r\n.time-item .time-item-title {\r\n    height: 24px;\r\n    line-height: 24px;\r\n    color: black;\r\n}\r\n\r\n.time-item .time-item-main {\r\n    overflow: hidden;\r\n    font-size: 14px;\r\n    color: #848484;\r\n}\r\n\r\n.time-item .time-item-main .time-item-detail {\r\n    line-height: 24px;\r\n    padding: 6px 0;\r\n    overflow: hidden;\r\n    zoom: 1;\r\n}\r\n\r\n\r\n.time-item-detail .train-direct .direct-label {\r\n    display: block;\r\n    width: 40px;\r\n    float: left;\r\n    font-size: 14px;\r\n}\r\n\r\n.time-item-detail .train-direct .direct-name {\r\n    display: block;\r\n    float: left;\r\n    width:auto;\r\n    font-size: 14px;\r\n}\r\n\r\n.time-item-detail .train-time .time-box {\r\n    width:66px;\r\n    overflow: hidden;\r\n    margin-left: 2px;\r\n}\r\n\r\n.time-item-detail .train-time .time-box .time-label-start{\r\n    display: block;\r\n    width: 16px;\r\n    height: 16px;\r\n    line-height: 16px;\r\n    float: left;\r\n    margin: 2px 0 0 0;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    color: #1774ff;\r\n    border: solid 1px #1774ff;\r\n}\r\n\r\n.time-item-detail .train-time .time-box .time-label-end {\r\n    display: block;\r\n    width: 16px;\r\n    height: 16px;\r\n    line-height: 16px;\r\n    float: left;\r\n    margin: 2px 0 0 0;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    color: #ff0033;\r\n    border: solid 1px #ff0033;\r\n}\r\n\r\n.time-item-detail .train-time .time {\r\n    font-size: 14px;\r\n    display: block;\r\n    width: 40px;\r\n    float: right;\r\n    margin-left: 8px;\r\n}\r\n\r\n.tip_footer {\r\n    width: 0;\r\n    height: 0;\r\n    border: 10px solid transparent;\r\n    border-top: 10px solid rgba(255, 255, 255, 1);\r\n    margin-left: 140px;\r\n}\r\n\r\n.android .tip_footer {\r\n    bottom: -24px;\r\n}\r\n\r\n.tip_footer .arrow {\r\n    display: inline-block;\r\n    width: 0;\r\n    height: 0;\r\n    margin: 0 auto;\r\n    margin-left: -10px;\r\n    border: 10px solid rgba(0, 0, 0, 0);\r\n    border-top: 10px solid rgba(51, 51, 51, 0.8);\r\n}\r\n\r\n.citylistTitle {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n}\r\n\r\n/*.subway-box*/\r\n.subway-box {\r\n    position: relative;\r\n}\r\n\r\n#citypage {\r\n    display: none;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    z-index: 50;\r\n    background: #fff;\r\n}\r\n\r\n.city_bar {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 45px;\r\n    z-index: 11;\r\n    background: #f8f8f8;\r\n    border-bottom: 1px #9a9997 solid;\r\n    text-align: center;\r\n}\r\n\r\n.citylist_wrap {\r\n    margin-top: 46px;\r\n    background: #fff;\r\n}\r\n\r\n/*.ios .citylist_wrap{margin-top: 66px;height: calc(100% - 60px); overflow-y:scroll;}*/\r\n/*.ios .citylist_wrap .citylist{background: #fff; max-height: 400px; overflow-y:scroll;}*/\r\ndiv.citylistTitle {\r\n    width: 100%;\r\n    height: 45px;\r\n    line-height: 45px;\r\n    background: #f8f8f8;\r\n    border-bottom: 1px #9a9997 solid;\r\n    text-align: center;\r\n    font-size: 18px;\r\n}\r\n\r\ndiv.citylistTitle .back_btn {\r\n    position: absolute;\r\n    height: 18px;\r\n    width: 10px;\r\n    background: url(" + __webpack_require__(80) + ") no-repeat;\r\n    background-size: 10px 18px;\r\n    top: 14px;\r\n    left: 15px;\r\n}\r\n\r\nul.citylist {\r\n    padding-left: 12px;\r\n    background: #fff;\r\n}\r\n\r\nul.citylist li {\r\n    height: 44px;\r\n    line-height: 44px;\r\n    font-size: 16px;\r\n    border-bottom: 1px #ddd solid;\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n/*ul.citylist li.active{background: #f8f8f8;}*/\r\nul.citylist li a {\r\n    display: block;\r\n    text-decoration: none;\r\n    color: #000;\r\n}\r\n\r\nul.citylist li a:active {\r\n    background: #f8f8f8;\r\n}\r\n\r\n#srhpage {\r\n    display: none;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    max-height: 100%;\r\n    z-index: 50;\r\n    background: #fff; /*overflow:auto;*/\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n.srh_wrap {\r\n    padding: 0 15px 0 45px;\r\n    margin-top: 7px;\r\n}\r\n\r\n.srh_wrap .srh_ipt {\r\n    width: 100%;\r\n    webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n    -webkit-appearance: none;\r\n    border-radius: 2px;\r\n    border: 1px #bbb solid;\r\n    height: 32px;\r\n    padding: 9px 10px 9px 30px;\r\n    background: #fff url(" + __webpack_require__(87) + ") no-repeat;\r\n    background-size: 62px 25px;\r\n    background-position: -38px 2px;\r\n    font-size: 14px;\r\n    color: #333;\r\n}\r\n\r\n.android .srh_wrap .srh_ipt {\r\n    line-height: normal;\r\n}\r\n\r\n/*.srh_wrap .srh_ipt.route_placeholder{color: #c8c8c8;}*/\r\n.srhlist_wrap {\r\n    margin-top: 46px; /*padding:10px;*/\r\n    background: #fff;\r\n    overflow: hidden;\r\n    zoom: 1;\r\n}\r\n\r\n/*.ios .srhlist_wrap{margin-top: 66px;}*/\r\n.sug_err {\r\n    text-align: center;\r\n    margin-top: 20px;\r\n}\r\n\r\n.srhlist {\r\n    border-radius: 2px; /*border:1px #ccc solid;*/\r\n    padding-left: 20px;\r\n    background: #fff;\r\n}\r\n\r\n.srhlist .st_item {\r\n    /*line-height: 40px; */\r\n    font-size: 14px; /*border-bottom: 1px #ccc solid;*/\r\n    overflow: hidden;\r\n    zoom: 1;\r\n    background: url(" + __webpack_require__(88) + ") no-repeat;\r\n    background-size: 20px 22px;\r\n    background-position: left center;\r\n}\r\n\r\n.st_item_wrap {\r\n    margin-left: 40px;\r\n    border-bottom: 1px #eaeaea solid;\r\n    background: url(" + __webpack_require__(89) + ") right center no-repeat;\r\n    background-size: 36px 14px;\r\n}\r\n\r\n.srhlist li:last-child {\r\n    border: 0;\r\n}\r\n\r\n.st_item .st_name {\r\n    display: inline-block;\r\n    font-size: 16px; /*height: 30px;line-height: 30px;*/\r\n    margin: 7px 0;\r\n    color: #333;\r\n}\r\n\r\n.st_item .st_name .match {\r\n    color: #0091ff;\r\n    font-weight: normal;\r\n}\r\n\r\n.st_item .st_rfline {\r\n    /*float: right;*/\r\n    overflow: hidden;\r\n    zoom: 1;\r\n    margin-bottom: 12px;\r\n}\r\n\r\n.st_rfline .rfline {\r\n    display: inline-block;\r\n    margin-right: 8px;\r\n    min-width: 20px;\r\n    border-radius: 2px;\r\n    padding: 2px 6px 0;\r\n    color: #fff;\r\n    font-size: 10px;\r\n    text-align: center;\r\n    height: 18px;\r\n    line-height: 18px;\r\n}\r\n\r\n.st_rfline .rfline.knlong {\r\n    padding: 0 6px;\r\n}\r\n\r\n.loading-bg {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background: #FFF;\r\n    opacity: 0.8;\r\n    filter: alpha(opacity=80);\r\n    z-index: 100;\r\n}\r\n\r\n.loading-bg .loading-outer {\r\n    width: 0px;\r\n    height: 0px;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n}\r\n\r\n.loading-bg .loading {\r\n    width: 110px;\r\n    position: absolute;\r\n    left: -55px;\r\n    top: -30px;\r\n    margin: 0 auto;\r\n    font-size: 12px;\r\n    font-weight: bold;\r\n}\r\n\r\n.loading-bg .loading .loading-img {\r\n    display: block;\r\n    width: 32px;\r\n    height: 32px;\r\n    margin: 0 auto;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n/*.tip-content*/\r\n.tip-content {\r\n    position: absolute;\r\n}\r\n\r\n.tip-content .tip-t {\r\n    width: 100px;\r\n    height: 42px;\r\n    position: absolute;\r\n    left: -50px;\r\n    bottom: 0;\r\n    overflow: hidden;\r\n    z-index: 10;\r\n}\r\n\r\n/*\r\noverflow: hidden\r\n\r\n;\r\n}*/\r\n.tip-content .tip-t .near-img {\r\n    width: 100px;\r\n    height: 42px;\r\n}\r\n\r\n.tip-content .tip-l {\r\n    width: 110px;\r\n    height: 40px;\r\n    position: absolute;\r\n    left: 28px;\r\n    top: -6px;\r\n    overflow: hidden;\r\n}\r\n\r\n.tip-content .tip-l .near-img {\r\n    width: 110px;\r\n    height: 40px;\r\n}\r\n\r\n.tip-content .tip-r {\r\n    width: 100px;\r\n    height: 40px;\r\n    position: absolute;\r\n    left: -50px;\r\n    bottom: 0;\r\n    overflow: hidden;\r\n}\r\n\r\n.tip-content .tip-r .near-img {\r\n    width: 100px;\r\n    height: 42px;\r\n}\r\n\r\n.line-caption {\r\n    font-size: 22px;\r\n    font-weight: bold;\r\n    color: #fff;\r\n    padding: 3px 10px 5px;\r\n    border-radius: 5px;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.line-caption .caption_la {\r\n    font-size: 14px;\r\n}\r\n\r\n.info-tip-top-out {\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n}\r\n\r\n.info-tip {\r\n    position: relative;\r\n    padding: 10px;\r\n    width: 200px;\r\n    background: rgba(26, 26, 26, 0.9);\r\n    border-radius: 3px;\r\n    box-shadow: 0 0 6px 1px #767676\r\n}\r\n\r\n.info-tip .close-info-btn {\r\n    position: absolute;\r\n    width: 28px;\r\n    height: 28px;\r\n    top: -12px;\r\n    right: -12px;\r\n}\r\n\r\n.info-tip .close-info-btn img {\r\n    width: 28px;\r\n    height: 28px;\r\n}\r\n\r\n.info-tip .info-content {\r\n    margin-bottom: 10px;\r\n    overflow: hidden;\r\n    zoom: 1;\r\n    display: table;\r\n}\r\n\r\n.info-tip .info-content .info-l {\r\n    width: 148px;\r\n    margin-right: 10px;\r\n}\r\n\r\n.info-tip .info-content .info-l .info-st-name {\r\n    color: #e5e5e5;\r\n}\r\n\r\n.info-tip .info-content .info-l .info-st-name .st-near-lbl {\r\n    font-size: 14px;\r\n    color: #35bc00;\r\n    margin-left: 5px;\r\n}\r\n\r\n.info-tip .info-content .info-l .info-st-line {\r\n    color: #999;\r\n    font-size: 12px;\r\n    line-height: 18px;\r\n}\r\n\r\n.info-tip .info-content .info-l .info-st-line span {\r\n    margin-right: 2px;\r\n}\r\n\r\n.info-tip .info-content .info-r {\r\n    display: table-cell;\r\n    vertical-align: middle;\r\n    color: #007aff;\r\n    font-size: 14px;\r\n    height: 40px;\r\n}\r\n\r\n.info-tip .info-event {\r\n    overflow: hidden;\r\n    zoom: 1;\r\n}\r\n\r\n.info-tip .info-event .info-event-btn {\r\n    float: left;\r\n    color: #FFF;\r\n    font-size: 14px;\r\n    height: 26px;\r\n    line-height: 26px;\r\n    padding: 0 19px;\r\n}\r\n\r\n.info-tip .info-event .set-start {\r\n    margin-right: 10px;\r\n    background: #007aff;\r\n}\r\n\r\n.info-tip .info-event .set-end {\r\n    background: #fc3e39;\r\n}\r\n\r\n.info-tip-bottom {\r\n    height: 8px; /*margin-top: -1px;*/\r\n}\r\n\r\n.info-tip-bottom .arrow-bg {\r\n    margin: 0 auto;\r\n    width: 20px;\r\n    position: relative;\r\n    z-index: 10;\r\n}\r\n\r\n.info-tip-bottom .arrow {\r\n    display: inline-block;\r\n    width: 0;\r\n    height: 0;\r\n    margin: 0 auto;\r\n    border: 10px solid rgba(0, 0, 0, 0);\r\n    border-top: 8px solid rgba(26, 26, 26, 0.9);\r\n}\r\n\r\n.nav-detail-title {\r\n    text-align: center;\r\n    padding: 20px 0;\r\n    font-size: 20px;\r\n}\r\n\r\n.nav-detail-general {\r\n    padding: 10px;\r\n    border: 1px #9C9D9E solid;\r\n    border-left: 0;\r\n    border-right: 0;\r\n    margin-bottom: 12px;\r\n    background: #FFF;\r\n}\r\n\r\n.nav-detail-general .nav-line {\r\n    overflow: hidden;\r\n    zoom: 1;\r\n    line-height: 30px;\r\n    font-size: 20px;\r\n}\r\n\r\n.nav-detail-general .nav-line span {\r\n    float: left;\r\n    color: #3B3B3B;\r\n    margin-right: 4px;\r\n}\r\n\r\n.nav-nav-sum {\r\n    font-size: 14px;\r\n}\r\n\r\n.nav-detail-general .nav-line .nav-line-arrow {\r\n    float: left;\r\n    width: 20px;\r\n    height: 9px;\r\n    margin-right: 4px;\r\n    margin-top: 10px;\r\n}\r\n\r\n.nav-detail-general .nav-info {\r\n}\r\n\r\n.nav-detail-general .nav-info .nav-info-item {\r\n    color: #818181;\r\n    font-size: 14px;\r\n}\r\n\r\n.nav-detail-general .nav-info .nav-info-item .nav-red {\r\n    font-weight: normal;\r\n    color: #f00;\r\n}\r\n\r\n.nav-detail-box {\r\n    padding: 0 8px;\r\n    padding-bottom: 20px;\r\n}\r\n\r\n.nav-detail-box .nav-detail {\r\n    border-radius: 2px;\r\n    border: 1px #E5E8E8 solid;\r\n    box-shadow: 0 0 6px 1px #E5E8E8;\r\n    background: #FFF url(/img/subway/axis.png) repeat-y 25px 0;\r\n}\r\n\r\n.nav-detail-box .nav-detail .nav-detail-li {\r\n    padding-left: 60px;\r\n}\r\n\r\n.nav-detail-box .nav-detail .nav-start {\r\n    background: url(/img/subway/nav-start.png) no-repeat 19px center;\r\n    background-size: 20px 294px;\r\n}\r\n\r\n.nav-detail-box .nav-detail .nav-end {\r\n    background: url(/img/subway/nav-end.png) no-repeat 19px center;\r\n    background-size: 20px 294px;\r\n}\r\n\r\n.nav-detail-box .nav-detail .nav-trans {\r\n    background: url(/img/subway/nav-transfor.png) no-repeat 14px center;\r\n    background-size: 30px 30px;\r\n}\r\n\r\n.nav-detail-box .nav-detail .nav-normal {\r\n    padding: 0;\r\n}\r\n\r\n.nav-detail-box .nav-detail .nav-end .nav-detail-item {\r\n    border-bottom: 0;\r\n}\r\n\r\n.nav-detail-item {\r\n    border-bottom: 1px #E5E8E8 solid;\r\n    padding: 10px 0;\r\n}\r\n\r\n.nav-detail-item .nav-st-name {\r\n    font-size: 18px;\r\n    line-height: 30px;\r\n}\r\n\r\n.nav-detail-item .nav-line-direc {\r\n    font-size: 14px;\r\n    color: #818181;\r\n    line-height: 20px;\r\n}\r\n\r\n.nav-detail-item .nav-line-direc .nav-line-icon {\r\n    float: left;\r\n    padding: 0 2px;\r\n    line-height: 20px;\r\n    border-radius: 2px;\r\n    margin-right: 4px;\r\n    background: red;\r\n    color: #FFF;\r\n    text-align: center;\r\n}\r\n\r\n.nav-detail-item .nav-line-direc .nav-line-number {\r\n    width: 20px;\r\n    height: 20px;\r\n    padding: 0;\r\n    border-radius: 10px;\r\n}\r\n\r\n.nav-detail-item .nav-line-direc .nav-direc {\r\n    color: #818181;\r\n}\r\n\r\n.nav-detail-item .nav-line-direc .nav-direc .nav-nxt-st {\r\n    padding: 0 4px;\r\n    color: #333333;\r\n}\r\n\r\n.nav-normal-ul {\r\n    padding: 10px 0;\r\n    margin-left: 60px;\r\n    border-bottom: 1px #E5E8E8 solid;\r\n}\r\n\r\n.nav-normal-ul .nav-normal-li {\r\n    line-height: 22px;\r\n    font-size: 14px;\r\n    background: url(/img/subway/nav-st.png) no-repeat 20px center;\r\n    background-size: 18px 18px;\r\n    padding-left: 60px;\r\n    margin-left: -60px;\r\n    color: #3b3b3b;\r\n}\r\n\r\n.nav-normal-ul .nav-normal-last {\r\n    height: 10px;\r\n    margin-left: 60px;\r\n    border-bottom: 1px #E5E8E8 solid;\r\n}\r\n\r\n.back {\r\n    padding-bottom: 20px;\r\n    text-align: center;\r\n}\r\n\r\n.back .back-subway {\r\n    display: inline-block;\r\n    padding: 0 10px;\r\n    border-radius: 2px;\r\n    font-size: 14px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    background: #007AFF;\r\n    color: #FFF;\r\n}\r\n\r\n.nav-tip .info-tip {\r\n    width: 292px;\r\n}\r\n\r\n.nav-tip .info-tip .info-content .info-l {\r\n    width: 240px;\r\n    margin-right: 10px;\r\n}\r\n\r\n.nav-tip .info-tip .info-content .info-l .info-st-name {\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.nav-tip .info-tip .info-content .info-l .info-st-line {\r\n    font-size: 14px;\r\n}\r\n\r\n.nav-tip .info-st-name .nav-line-ref {\r\n    display: inline-block;\r\n    line-height: 8px;\r\n}\r\n\r\n.nav-tip .info-st-name .nav-line-arrow {\r\n    width: 40px;\r\n    height: 8px;\r\n}\r\n\r\n.nav-tip .info-st-name .nav-line-icon {\r\n    line-height: 20px;\r\n    margin: 0 auto;\r\n    padding: 0 2px;\r\n    border-radius: 2px;\r\n    background: red;\r\n    color: #FFF;\r\n    text-align: center;\r\n    font-size: 14px;\r\n}\r\n\r\n.nav-tip .info-st-name .nav-line-number {\r\n    width: 20px;\r\n    height: 20px;\r\n    border-radius: 10px;\r\n    padding: 0;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 79 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAkCAYAAACJ8xqgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5YmY5MjI0OS0yZTBjLTQ1OWEtYjc0Yy1iNGViMjNiNWYyMDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjZCQTY0NUU4NUYxMTFFNTg3OTlDNTgwNkU3RkFBQjgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjZCQTY0NUQ4NUYxMTFFNTg3OTlDNTgwNkU3RkFBQjgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpkZGMxODhlNC03NzFkLTQ3YjAtYTllYS1jYmIyOTVhYTI1M2MiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiYWVkNzc3NC04NzllLTExNzgtOTdmNy1iNzA0YzExMjliMDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ANQseAAABb0lEQVR42qzWWU7DMBAG4Dj4BhwlJ4AXOEmeWEoKlKUtlG5IlJblMLy2byAOA1yAMpb+kUYRSR2PLf2qI0VfJ41rj8nzPIkwzinblI6NgHUo95i/pUrsQmCuyqVVYlPMzygzNwmt8PI/LBS8okwwP5WYGzYAG2PepszLN6QxsSbgtcCKKswX7FJGmJ9QFnU3px7YUGBPm769DuwBW/tidWCfcges8MWqlo3DBqKy5ybrytZgLcpL01UvH/lGi8kKbwE67JjyGrpjWFTVj4HxIxtxvdbutqlYIga/24EW5Bci0UMtKN+ywdoLQreyLJPXS3zuUPYpX5SP0Ap5DFCtwV/uSFMhjxXeOFf67VtpFVhG9yg/lHcNyOgvZdcX9dmxh9gbDXbrlhZMcAT0MF9gW1OBjHYxn1ehTQ/6MU5ARgstmKBrYPSxjIb2NhMc/Iy2tWCCZonRGfqcRNtwTrH43ecD5TNGB8sNp2uJV38CDAAT6limaMVZ4QAAAABJRU5ErkJggg=="

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0RENTkyNEExN0ZGMTFFNjgzMTJGRDBDQzlEQTlGQzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0RENTkyNEIxN0ZGMTFFNjgzMTJGRDBDQzlEQTlGQzIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozREQ1OTI0ODE3RkYxMUU2ODMxMkZEMENDOURBOUZDMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozREQ1OTI0OTE3RkYxMUU2ODMxMkZEMENDOURBOUZDMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PolQJ5sAAAJQSURBVHjazJjNS1RRGMbvSJaaWaSSM4PSxkZq0dqVJCFYBOI2apMb7Q+QFv0F0aaoVa5cFISK4Jj0RVG0imohuK2gD4wKBUNp7PY79Iwdr+N4z9x7ZV744b0z7+E8933Pee4ZU77v93ueNwZpr7riC1xKIfBzFYrbEFljiXsAGUiFoBipGJgMzJ/RtYm0qaCvm4zKGiZ8S2DUWIKmwPymaKazXk2g57sd5gH3lCnAJoG7HSfgGTTo/g60QVab9t8TWC12aVeUFh+BK3BZ1fsGtXCo9Ez/w3OgkjEdcB1WNPY33IJmyMEELIsJe4IkBTbCeXgE6xpTgLtwPMwcSQjcBwNwD35Zud/hJnS6zOEqsNMuv66LEx6Da7BofW8E3odBCXcugotAs05++lvDfDYDf6wW5tXaRkdRkQQWKzcLaTFrjf8IV6E9gqgtAm2b2SmWyzj+KhyAQow+6cdh1MWHK8Qsziv1Jtnppf64jOM/TOx947AGu7bZJGZT9MS07iLbTC5gM3YswA04B/VJbJKw79W9sKbrC9ANvdBl5azoTDcFeR2pKlrflQg8Ce/gBzRbnx+FPjirv3XWBnoFc/Ac5uUIiQm8DcMwDQPb5BjLOQOD0K97O97DB1nUomxqTZu2VvkjlQg0bXyr6pyGJyHGmNxTyu/WObAp9InWQaB5qhdq8ThcjGAeHZCTXbVCi86GB2FdS2A0aDPpMjtqPzxV3htoSMBWbNpK2UxeXwSTs/BaOS/hcMListKyYTPV/Lv4q9k1Q+aiCsV9Mv9Z+CvAAKiCiZPMrr7MAAAAAElFTkSuQmCC"

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAWCAYAAABDhYU9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjFGRDE0QzQxQjNFMTFFNjhBM0ZGQTc4QUE5NkNGMEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjFGRDE0QzUxQjNFMTFFNjhBM0ZGQTc4QUE5NkNGMEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMUZEMTRDMjFCM0UxMUU2OEEzRkZBNzhBQTk2Q0YwQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMUZEMTRDMzFCM0UxMUU2OEEzRkZBNzhBQTk2Q0YwQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoqqZzYAAAGZSURBVHjavJa/SgNBEMYvJ14EjaYQGwvtfQD7INbxSKdvkETfQsgriL2FD3JFwESxUNMo2tiqRWLA9Rv5DhbZPblz7gZ+7N382XwJs7MJjDGBhwgcgwS8k4S+KKNOgx/zBTfByPhtxJzKxUWWsAcQg1US0yc2BvWqxfUZuwdNR1x8d8zpVy0uYSzOKI6Zk2iI8Plr8vLLZiACa+AtcFuDMcldCopb+uE1lz/856bzoERzibviupdRt8/1NseXMRriLriegqYj3mTMzi3HHM1Y55iwR0mDxDzFYtc5Rklm42sP4XHOIawqLh3GJ2AIPsiQvkhThM/vO60yStpgF6yDRTb0Cn1t5gRV99wBmJi/beIY1Kq/nO1YAAOr4IbX0w5YJvLcYyy1AWtLFZcKm4Juent4qDFnagkU/2UZ4jp8n4FWjlPYYo3hHhvgVVOcnLxnvvcKXN5d1r5wr46muEOrx8IC4kKrB480R0zIsSB2Dr4KHHipOeNzW3OSSGM/Yt1S2u8JbOf9a+Tzi7gp1rqSuE/PXoXEfQswALgwJiUO822rAAAAAElFTkSuQmCC"

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjcwRDNEQjMxQjNEMTFFNkJEMERFMUVGOUQwNjJFQjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjcwRDNEQjQxQjNEMTFFNkJEMERFMUVGOUQwNjJFQjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNzBEM0RCMTFCM0QxMUU2QkQwREUxRUY5RDA2MkVCMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNzBEM0RCMjFCM0QxMUU2QkQwREUxRUY5RDA2MkVCMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpFT6AcAAAR6SURBVHjavJldSBRRFMfvjlH5lRBlEWglbVFIGUQvta5ChW/6ohUYFWmQkUGREFbaYkGgDylRKlFhQelD9pYaaGUvESQiQW1oKkRiBPmRGoidQ/8rl2H2Y2bueuDPzH7MPb+ZuXPOmXM9jY2NwoUlkPaTckg7SFtJ60hJ+H2KNEb6QvpE6iH1kv44dbjMwTEe0iHScVIBKT7Mf1dD20n5pMukGVI76RGpk7QQS2B2WkXarXw3QXpD6iMFSd9J0/gtkbSB5CVlkbJJq0hHoY+kAE5AK3AG6Q4pD59nSU9ILbjF81GOE4cpVAzxiT8nvSSdJQ1GGsCIwkkhrgTD/iXVkjaRSkivbcAK/JePKcUYtRgzDz4K3QJfJ7XiNvKVzCRdwoPk1sYwFo/5Fj5a4dMRcD3pGh6KG4gEQaHfeMxc+FiAz9t2gfksz+EW8u27YvPW27V5+CjFfnmoK22EmLPyypaR7oulM/Z1RrnSRZGAORo0Y/8mqcn0+1pSmkbANIypWjOmh4D/jHDAHLpS8BBUWcB24SlP1wCbjrFeWUBXI7angMkSuADhZY50yjRnJewu0mak2HSXsD0Ya6cF9DzC5hyYCszAHuWK1ltEg5UIO9LcQKuw0pItUnwQLAJsHhX4IFIn5/k6CyejCGtDLqGtYIcQ1kYs/l8HpiwwLgKfxPZZmKQw4hI6HOxwmOTyVGU0UCLm48uWCE6dQjuBlfZYKbwSGNiH+TOBp1a4gN6oGVaA6RcYfQZKPoFQFm02CwXdbYJ2Cysjxjvs+w0UH2zvbT7tkaB1wEr7gG2mgdcatq8OQlQ4aF2wKpvXUAL2T4dJIBS0Lli2HzKBGQja8oVRaITWBSuUl9ZkQ+i1BZvf2zYGnsR+ksvaoNtcWWlI42o7gW2SgcfxYY1G2CENaVy19diOG2hysG3RCJurqfYQJrYgAw/gw16HVVdGiAdsRCP0HmwHDBTKAv2COA1V17DGgkn2MvbJNG0gJc+iuvfHoOpyC+1Hu4sZew3EONkqOhaDEtEtdDG2L7gFJuPwA2wPo/uou0R0Cs0sR1RGCdyFZh6XcBdDvN3qqA3sQl8AUx86nYvAC0rjohzdRtVmlQTjNt1aQU/iVUg1ZjiP/YDMlmpqbkcXcQV6A2rE4ORygNSvqTZQofsx9rgpMjSDpQMdTsu+BLc8f+PJrDb9JqFzXMKq0H4LWNmX8OMtqCxcI4X7s6exX4lelxl6RGOxNGoBWwLfAv4HI/XWuOVZgz7AXTRVlsrY1z34rgFLVN3Lq6QGZS7V2MiCTiwOPuSz0wCGqNutMloEcLaVKHK8MYD1YuxK+ArAt7ALLFtERZj8PhRKt0ipGkBTMdYAxp6Ar6pIBXwkaxP/F084cC8nVZC+oRWabXOqxOGYJoxRgTE74aMt0gAemwuLBbgCWcp36rLXZ7wwTilvMVx8b8MxPhRZ0vqQsKJe9vI4WAmVC4sn0D6Kt3n8DAqZh2IJFhZlGu+AElFHc5BXl26TlZSrLt1y24lXo6adTvx/AgwArkFW26xxUwYAAAAASUVORK5CYII="

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAiCAYAAAAtZZsLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjhCMkE3RDYxQjNEMTFFNkJFNUE4MzJBNzBERUNCNjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjhCMkE3RDcxQjNEMTFFNkJFNUE4MzJBNzBERUNCNjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCOEIyQTdENDFCM0QxMUU2QkU1QTgzMkE3MERFQ0I2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCOEIyQTdENTFCM0QxMUU2QkU1QTgzMkE3MERFQ0I2NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoZOUsEAAAILSURBVHjazJg7SMNAGMcvQQfBx+agOAlCHyDiY7CLdXRwbgVHcevg4NhanNqqQ1tFFBwUwdFdEJfiUkRF7OIkFIq6aCsoCvX74CRp2rsmuUuaD/7Qy+Py4+5+F1KlTiaJhJqGbEJCtH0FSUKKoh0rEgAXIOeQbsPxL8gi5KKTgD2QJ8gQ43wZMgr5tvsAVXD0khw4rGHIRqdG0A+5bTG1xvqBjENKbo9g3gQcodfsuj3FUUi44cjdCSH1opZ5v/4sXhtxC7APkrFx3xak1w3ABF38VsuWMFYBA5CYwLqNUbkcA8yZFIMnTN4pwKUmMfRV+2xsXz6yrgxTyaQCohhp7hXVmpWBydA+pQHaFYMnTEIWoKgYPGECMgBFxeAJkxMF5Iuhrw/dGnx5MwsZps+wBdheDBagtUrzhFFdFMOWMCzAoENi8IQJmgVUIFmHxOAJk6XPbgsYNS0Gqyqvdu5q+YYxAvZbEkNf71UZI5mmDEzAuEti8ISJs75JcJHeuLz2WtUvZALyoB/BTojBqi76hlH0gOJiyK25f2EQ0AfZE+5ye1X7YCrsEzI2KNojMvkQMAUZEOoqEiJkbUVrz07BglkXBUSmlOqxqW3aG1X65S9WZwVCdg619n0JdrQjKUbjNnMMP5Y9OoKnCIib4zVkxGNwz7iacYrxL7IZCM5RxQNg+CI/oEzlPwEGADSiZHrtfuHhAAAAAElFTkSuQmCC"

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA4RTkyODhCOTFFMDExRTU5NDVBRDk2N0E5ODg1OUUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA4RTkyODhDOTFFMDExRTU5NDVBRDk2N0E5ODg1OUUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDhFOTI4ODk5MUUwMTFFNTk0NUFEOTY3QTk4ODU5RTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDhFOTI4OEE5MUUwMTFFNTk0NUFEOTY3QTk4ODU5RTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4hE1o8AAABIUlEQVR42rTX0QnCMBCA4Xhr9CngDL4JGUPoe2frGEJ9cgahIHQMwRQSiLHJXS53gSBqy/+hqTWnaZqMH9bP2c/Rz5fRHT8tCC8sfl78vPt5Vo6nLQtBM4QDBkVEjKetGcJHsSUHaiDyuAnNEcJ37hQRpbiLa8AoIqrx/Qkkb0gj0HgOkESQ4kcACQQ5XgJgCCsVrwFqiKWAaI5jgIi4EhCsOAWwjxVBsONUAIZgx1sANQQ73gooIdhxDgAbn9YTWgFHC45yiYoASqt960FAZ9wRfye6ANh1Hhfmm4OAznh6dTgOAgRvLCwESN3VuAgQjLMQIBxvRoBCvAkBSnEyAhTjJES+NZOOY4i/rZlGvITYW7d0a/ZUjOf/Jx7hcf0KMABwP6hpikSb/gAAAABJRU5ErkJggg=="

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUM0Q0E1MEUxQ0RBMTFFNkFCMjZCNDlEMjI2RTk5RTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUM0Q0E1MEYxQ0RBMTFFNkFCMjZCNDlEMjI2RTk5RTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQzRDQTUwQzFDREExMUU2QUIyNkI0OUQyMjZFOTlFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQzRDQTUwRDFDREExMUU2QUIyNkI0OUQyMjZFOTlFNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpeFk7MAAANuSURBVHja1JlLSBVhFMfn3sRSryFUSkUSGQYauIveDyOzpxUYVma5aBHVok2tetxFBi0kEwmiwBa5ihZRUhGI4kaM0FArq4W1Kiiy1DSt6X/gTA2Hb57euXc68OPe+z3/8813vzlzTkTXdW0aNgusBhtBEVgG5oEsQAMPMy9BL+gC7eCn3wkjPgVvBrWgAsQ89v0GWkEzeMIXZmd54CT4Beo1EuyBneCZnjh7AXY7zNlnav/ArdDF1FgPzlrBEsW8C0S7yTQXt3AfuAVyLOrHQSczAIbACJgEc8BCsBysAptAumKMbaAHHAd3TOVSX5rTyp63WZXn4CjI9rClcsAR0GMz7mUQ4fb5stJu8KsWA77lfRfxuP/NUN9d4J3FHE3cxrXgixYDNYKMaQiVZIIGm5V2JXi/ovMEqE6gUEkNGFfMe9ZJMP1TvyrElgco1mArz2W2KSfBT0X9b3AoCWINqp3OP3PjvYr6hiSKNbhuJ9g45yLggjjz3oAzWjA2nx+3cxV1Gfy4jqg6GoLLQImoOw0mAhBLQtrYUfJsUf6sFeXd4GFAq5vnVyxsKsreVoWoaNSCs4+8IH7sLm2JUvZrDRsD9wIUrLN7WgMWeej3CrSQ4DWighzsUS1Y+w6a/O7hIlHWqYXYSHChKOsPu+BcUTYUdsHZiv0VasH/lUUVK5oddsGfRFl+2AUPirLisAuWx9i6sAtuVwjOCom+EnZDC/492HU9Bn4IP7k6BY67pNT0ijQCiqk8ykGP++LKToVgdS+BGfyd7vgO8zncLBqv4GhMqqwcrBRlvcaWMAIbvWJbvAYzU7AVaM5+oaXfCNxETT5qXFwROUV1KVjduMKDPPc3LCuu7rHiNf9gEld3D89ptjZzG9mhAAwrAillSToVRsXc9HupnWCiyiJUVRWg2ANgTDHvYdnWaoA6RWe6VfUJ/iOmOwQDNbeCiWsWAw2C7QkQuwUMWMxxwyqc6zRo3CZq1M23LOZBJLU9Brpsxr1iF3t2k0WqBDfBbIt6Cgt08Msrpbfec6ZoypQyKOb02AYbP4Xe1E+A2/ZBAncrQ2HYRwEmZejoKnSjxeu+q+DcRqKMnmCVXtIPfvMTFHxusTiKnIz6NIP1fvIkfjOhhmWCtbw3jdRtLu9Tylx+Bl/AB9DH+7yDPURf9keAAQDbKNydaY+RvQAAAABJRU5ErkJggg=="

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAyCAMAAABGUCSuAAACdlBMVEWvr6////8Aev96enqvr6+vr68Aev96enqvr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr68Aev96enoAev96enqvr68Aev96enqvr68Aev96enoAev96enoAev96enqvr68Aev96enqvr6+vr6+vr68Aev96enqvr6+vr6+vr6+vr68Aev96enqvr6+vr6+vr6+vr6+vr68Aev96enqvr68Aev96enqvr68Aev96enqvr6+vr6+vr68Aev96enoAev96enqvr68Aev96enqvr68Aev96enqvr6+vr6+vr6+vr68Aev96enoAev96enqvr68Aev96enqvr6+vr6+vr6+vr6+vr6+vr68Aev96enqvr6+vr6+vr6+vr6+vr6+vr6+vr68Aev96enqvr68Aev96enqvr68Aev96enqvr6+vr68Aev96enqvr6+vr6+vr68Aev96enqvr68Aev96enqvr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr68Aev96enqvr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr68Aev96enqvr6+vr6+vr68Aev96enqvr6+vr68Aev96enqvr6+vr6+vr68Aev96enqvr6+vr68Aev96enqvr68Aev96enqvr68Aev96enqvr68Aev96enqvr68Aev96enqvr6+vr68Aev96enqvr6+tbRINAAAAz3RSTlMAAAEBAQIDAwMEBQYHCAoLDA0ODxMUFxgbHB0eHyIjJCkrLCwtLS8zMzM1NTc3ODg6Ozs7Pj9CQkNISkxOTk5SVFVXWVlZWlpaW1tbX2BiYmNjY2lpam5ubm9xdnh4eXl6e3t9foCBg4aIiIiJjo+QkpOUlJSVlZWXl5udnp6foKGioqKlpaeqrK6vsLGytba4vb6/wMHExcfKzM3S0tLT1NXX2Nrb3d7f4OPm6evr6+3u7+/v8PHx8fL09vb29/j4+Pn5+fr6+vz8/P39/f4CIM3LAAADWElEQVRYw+3Y+T9UURQA8PvsTI1Ce2nXRjtKVNpRlogSbcjSqlS0aaHSQoq0qqRdG1mKtNJCM3P+o96deRne3PfevX1uH784v8ybX+73cz/vvnPPOUjozUB9um1E1taG0S8TVVcXzlGPNRqNtdSrxJlMpjp+OsbpdYxz1OMxboykXCMB46YoXnoStjuiKZdIxnZnDK9TZ8HDmPBwXmeeC440g6xvZcK3KezcqniG7imuKD+XPs+NQs/EeNtSSjwL4+3LBEXd+8gHkKIm1VNLt+DBTHiIoKQ7bmkV2V9PrpU/+CY+PF+orvPCLbr+kkhej/DAz/2DLhjAkKqmc8PNuq4UoH6J1Zv5CGC7om6Xi/GPlLh9HsY/hQiK+iGAx2O6v+pBZQCLFHQL3hzAgrcECoq6vwFqRvY85/pb8MqLqHPFsX4DYIH8Ix/dCjtJOl9c1OcAXLbNMTugSW+rO51kwZ1PaeCing0w31Yf+vvvm++mOxVgvGE6JV6I8cYZahkc3YMmV0KCrYC9cl3CfZlwP9X7w+07XCGl911wVabzxwU0GOAESU+E+zL9AAsuHKTABTQc4DBJXwcPZfoXEf8xifZS/iriPydr3dzuAOdJehrclOm38d4LnCj1O3jvhc4aOqqBapJ+Fs7I9HEvWPjxLyl4hC4CjLLF3V7DBvmZn2Dmj9rR8RPN/DF7dX0tQIatHgoGb5vvfWoD5nMp+WmNmM+zV9UHvoWmIXLc9S6UEjKtLxPvp8mLy6eIqdZFpqeDYS4pz3PmcT1RBZDj0ANfbYDj5BvWwu8TWPj9ajoaWw9w2t1qO6YYoNJd4X6f1Yz5TEp+dgvms9R05P8O4GmEVMs6BFUCVA1TrG0CmPhAVd4i+FTjWjY/MWLx+myxrIISL5RTv1GhruPISxsckPEeuuLZGgekF3/TFKpKfry1lkss+4zpN0WrdPh/EUilJaGiDmjD/CZavh3zm1V1MVxGTPHp+vL7lUg8qZsINvNJlHyImU/W0HuGTuKJnRQnHmny5C6SD4+0+OUKHbSFj2fiE5g6aF0xQKrS9GBFB+ZjKfmVnZiPY+rfdem7PRQnJ2FMfDiJ/9fpgZWPZOK5TY0knnpiZuY5zuuEaKZpYQxnvXcnpX0T8v8dfwC0K0RQFs76UQAAAABJRU5ErkJggg=="

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAlCAYAAAAnQjt6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MEMwOTEzMTI1MjA2ODExODIyQThDRjJDMkJGNjc5RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4OTEzMTc1Q0RBQzQxMUU1OUQxMEFCMDQxQkFCNkZFNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4OTEzMTc1QkRBQzQxMUU1OUQxMEFCMDQxQkFCNkZFNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNjN2YyZTE4LTlkMmUtNDllMy05NmQ4LWE4MTUyYzZhZTM3OSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjRlODg4NDFiLTFiNTEtMTE3OS04NmM2LWM5MTJiODM2NWRiZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqFFCEgAAAJ7SURBVHja7JjBZxxRHMdnp7EREiGUkGsJOUSipxL6B5QQGiGnkNpI9LQlStesWVs9hJ4i7BBySQilhJJTKCGnnEIIOVVKCCEaImFtv7/1fTyvszOz76Wbqvz4eDM7M7/f9/3e7715s7lareZltCdggrwAg6AXDPP6CbgG5+AA7JN6ktNCodBsuzIIeA7egtcM3MqGteNXbEXYF7AKDpOCJAkZAmtgUvvtFHwHe8zADTjmtRHQA55R/CTFzZEdsAR+tiNkliL6eS69+syUtzIlSHq+DZY5hEVmU4S9pJgt82E/xmEINilCej0KplNEtLIDPjtKX/30HaYJeQ8CHkdgHBx57nZEXxHPA8aKFSIF9kkTscAauC+7oU8lRmLNmEJkNqh5/JXj+LdsiTHE1qIoGtCFfOAsuQBv0ua+o9UZQ2INMHZTiEy5Rd70EVxqD+VBFZyBhiVn9JHX/F4yltg8stIjQqZYzdfa+OkzSGXL1obow5wpEuuKsad8LtkeFxyzOOfZlkDOkpLhSy/ebzyeECFjPNmN6c1TtisOGVkxfOmmYo75XJK9lPXizkHIXcr60nxP+doy/sPrvKmYvb5WzVcPIETFzPvG/O601ZNeeg9ij0La2aHp1njMiGE5xziN/7ZYq+xd1fGeP1OOD6xGQvrNa7+4m5MtQ18Ln3H3pMZoNyOrRmt7j3VGuh3ewPIuu3XNyAXbokMdFg1fVsW6rm39bfes6hNlw2UdKTO1s/z6t7FzfmKWXIRIXbwj/8Q6EjDNYRu+Qz4TZJ01WUSEjh2WIa4k/VHjd0CEyk5gOzRKRMXhm0ZRSRPTlUFE+R4yUtYy48UN028BBgAuHa50U84otwAAAABJRU5ErkJggg=="

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAWCAYAAACcy/8iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU1NUEyNERDREFDNjExRTVCRTM1QTI2QUNCMURFMzVCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU1NUEyNEREREFDNjExRTVCRTM1QTI2QUNCMURFMzVCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTU1QTI0REFEQUM2MTFFNUJFMzVBMjZBQ0IxREUzNUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTU1QTI0REJEQUM2MTFFNUJFMzVBMjZBQ0IxREUzNUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5qcpNtAAAAxUlEQVR42uTTuw0CMQwGYOcXzS0AO8AQ6BgmBaPQUqW7SQ6WOIZgAVqcAimKeNwjSLZj6S+S2JE+RXEhhCsR7alwee8dCSz8Ayu5kK0HzobjCkQ8+MbZcXrOuoYXbmtAp+B7Dej8D5tH482eaTQ+7JtF48tZjr5YQOPHeYreWkBjRI8pNEb2mUFjQq8JNCb2q0djxswLPWhEY+ZcRB80orFgViUaC+fVoVHgjhx94jSWwSm645w5D6ngVcG7IvooGRvrKcAArX07sRLJsOUAAAAASUVORK5CYII="

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @version 1.0.0
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specificed layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 */
	function FastClick(layer) {
		'use strict';
		var oldOnClick;


		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when when click tracking started.
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
		this.touchBoundary = 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', bind(this.onMouse, this), true);
			layer.addEventListener('mousedown', bind(this.onMouse, this), true);
			layer.addEventListener('mouseup', bind(this.onMouse, this), true);
		}

		layer.addEventListener('click', bind(this.onClick, this), true);
		layer.addEventListener('touchstart', bind(this.onTouchStart, this), false);
		layer.addEventListener('touchmove', bind(this.onTouchMove, this), false);
		layer.addEventListener('touchend', bind(this.onTouchEnd, this), false);
		layer.addEventListener('touchcancel', bind(this.onTouchCancel, this), false);

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
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0(+?) requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		'use strict';
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
		'use strict';
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
		'use strict';
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
		'use strict';

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
		'use strict';
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
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
		'use strict';
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
		'use strict';

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
		'use strict';
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
				if (touch.identifier === this.lastTouchIdentifier) {
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
		if ((event.timeStamp - this.lastClickTime) < 200) {
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
		'use strict';
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
		'use strict';
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
		'use strict';

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
		'use strict';
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < 200) {
			this.cancelNextClick = true;
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
			if (!deviceIsIOS4 || targetTagName !== 'select') {
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
		'use strict';
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
		'use strict';

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
		'use strict';
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
		'use strict';
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
		'use strict';
		var metaViewport;
		var chromeVersion;

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
					if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.attach = function(layer) {
		'use strict';
		return new FastClick(layer);
	};


	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			'use strict';
			return FastClick;
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.6 - 2016-01-06
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the  license */
	!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&ha(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==ka?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ia.length;){if(c=ia[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return qa++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:ta?M:ua?P:sa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Aa&&d-e===0,g=b&(Ca|Da)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=na(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=ma(j.x)>ma(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===Aa||f.eventType===Ca)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Da&&(i>za||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=ma(l.x)>ma(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:la(a.pointers[c].clientX),clientY:la(a.pointers[c].clientY)},c++;return{timeStamp:na(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:la(a[0].clientX),y:la(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:la(c/b),y:la(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ea:ma(a)>=ma(b)?0>a?Fa:Ga:0>b?Ha:Ia}function H(a,b,c){c||(c=Ma);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Ma);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Na)+I(a[1],a[0],Na)}function K(a,b){return H(b[0],b[1],Na)/H(a[0],a[1],Na)}function L(){this.evEl=Pa,this.evWin=Qa,this.allow=!0,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Ta,this.evWin=Ua,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=Wa,this.evWin=Xa,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ca|Da)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=Za,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Aa|Ba)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Aa)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ca|Da)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a)}function S(a,b){this.manager=a,this.set(b)}function T(a){if(p(a,db))return db;var b=p(a,eb),c=p(a,fb);return b&&c?db:b||c?b?eb:fb:p(a,cb)?cb:bb}function U(a){this.options=ha({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=gb,this.simultaneous={},this.requireFail=[]}function V(a){return a&lb?"cancel":a&jb?"end":a&ib?"move":a&hb?"start":""}function W(a){return a==Ia?"down":a==Ha?"up":a==Fa?"left":a==Ga?"right":""}function X(a,b){var c=b.manager;return c?c.get(a):a}function Y(){U.apply(this,arguments)}function Z(){Y.apply(this,arguments),this.pX=null,this.pY=null}function $(){Y.apply(this,arguments)}function _(){U.apply(this,arguments),this._timer=null,this._input=null}function aa(){Y.apply(this,arguments)}function ba(){Y.apply(this,arguments)}function ca(){U.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function da(a,b){return b=b||{},b.recognizers=l(b.recognizers,da.defaults.preset),new ea(a,b)}function ea(a,b){this.options=ha({},da.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=y(this),this.touchAction=new S(this,this.options.touchAction),fa(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function fa(a,b){var c=a.element;c.style&&g(a.options.cssProps,function(a,d){c.style[u(c.style,d)]=b?a:""})}function ga(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ha,ia=["","webkit","Moz","MS","ms","o"],ja=b.createElement("div"),ka="function",la=Math.round,ma=Math.abs,na=Date.now;ha="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var oa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),pa=h(function(a,b){return oa(a,b,!0)},"merge","Use `assign`."),qa=1,ra=/mobile|tablet|ip(ad|hone|od)|android/i,sa="ontouchstart"in a,ta=u(a,"PointerEvent")!==d,ua=sa&&ra.test(navigator.userAgent),va="touch",wa="pen",xa="mouse",ya="kinect",za=25,Aa=1,Ba=2,Ca=4,Da=8,Ea=1,Fa=2,Ga=4,Ha=8,Ia=16,Ja=Fa|Ga,Ka=Ha|Ia,La=Ja|Ka,Ma=["x","y"],Na=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Oa={mousedown:Aa,mousemove:Ba,mouseup:Ca},Pa="mousedown",Qa="mousemove mouseup";i(L,x,{handler:function(a){var b=Oa[a.type];b&Aa&&0===a.button&&(this.pressed=!0),b&Ba&&1!==a.which&&(b=Ca),this.pressed&&this.allow&&(b&Ca&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:xa,srcEvent:a}))}});var Ra={pointerdown:Aa,pointermove:Ba,pointerup:Ca,pointercancel:Da,pointerout:Da},Sa={2:va,3:wa,4:xa,5:ya},Ta="pointerdown",Ua="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Ta="MSPointerDown",Ua="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Ra[d],f=Sa[a.pointerType]||a.pointerType,g=f==va,h=r(b,a.pointerId,"pointerId");e&Aa&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ca|Da)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Va={touchstart:Aa,touchmove:Ba,touchend:Ca,touchcancel:Da},Wa="touchstart",Xa="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Va[a.type];if(b===Aa&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ca|Da)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:va,srcEvent:a})}}});var Ya={touchstart:Aa,touchmove:Ba,touchend:Ca,touchcancel:Da},Za="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=Ya[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:va,srcEvent:a})}}),i(R,x,{handler:function(a,b,c){var d=c.pointerType==va,e=c.pointerType==xa;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ca|Da)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var $a=u(ja.style,"touchAction"),_a=$a!==d,ab="compute",bb="auto",cb="manipulation",db="none",eb="pan-x",fb="pan-y";S.prototype={set:function(a){a==ab&&(a=this.compute()),_a&&this.manager.element.style&&(this.manager.element.style[$a]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),T(a.join(" "))},preventDefaults:function(a){if(!_a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,db),f=p(d,fb),g=p(d,eb);if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}if(!g||!f)return e||f&&c&Ja||g&&c&Ka?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var gb=1,hb=2,ib=4,jb=8,kb=jb,lb=16,mb=32;U.prototype={defaults:{},set:function(a){return ha(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=X(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=X(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=X(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=X(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;jb>d&&b(c.options.event+V(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=jb&&b(c.options.event+V(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=mb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(mb|gb)))return!1;a++}return!0},recognize:function(a){var b=ha({},a);return k(this.options.enable,[this,b])?(this.state&(kb|lb|mb)&&(this.state=gb),this.state=this.process(b),void(this.state&(hb|ib|jb|lb)&&this.tryEmit(b))):(this.reset(),void(this.state=mb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(Y,U,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(hb|ib),e=this.attrTest(a);return d&&(c&Da||!e)?b|lb:d||e?c&Ca?b|jb:b&hb?b|ib:hb:mb}}),i(Z,Y,{defaults:{event:"pan",threshold:10,pointers:1,direction:La},getTouchAction:function(){var a=this.options.direction,b=[];return a&Ja&&b.push(fb),a&Ka&&b.push(eb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Ja?(e=0===f?Ea:0>f?Fa:Ga,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ea:0>g?Ha:Ia,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Y.prototype.attrTest.call(this,a)&&(this.state&hb||!(this.state&hb)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=W(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i($,Y,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[db]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&hb)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(_,U,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[bb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ca|Da)&&!f)this.reset();else if(a.eventType&Aa)this.reset(),this._timer=e(function(){this.state=kb,this.tryEmit()},b.time,this);else if(a.eventType&Ca)return kb;return mb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===kb&&(a&&a.eventType&Ca?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=na(),this.manager.emit(this.options.event,this._input)))}}),i(aa,Y,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[db]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&hb)}}),i(ba,Y,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Ja|Ka,pointers:1},getTouchAction:function(){return Z.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Ja|Ka)?b=a.overallVelocity:c&Ja?b=a.overallVelocityX:c&Ka&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&ma(b)>this.options.velocity&&a.eventType&Ca},emit:function(a){var b=W(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ca,U,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[cb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Aa&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ca)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=kb,this.tryEmit()},b.interval,this),hb):kb}return mb},failTimeout:function(){return this._timer=e(function(){this.state=mb},this.options.interval,this),mb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==kb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),da.VERSION="2.0.6",da.defaults={domEvents:!1,touchAction:ab,enable:!0,inputTarget:null,inputClass:null,preset:[[aa,{enable:!1}],[$,{enable:!1},["rotate"]],[ba,{direction:Ja}],[Z,{direction:Ja},["swipe"]],[ca],[ca,{event:"doubletap",taps:2},["tap"]],[_]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var nb=1,ob=2;ea.prototype={set:function(a){return ha(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?ob:nb},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&kb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===ob||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(hb|ib|jb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof U)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&ga(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&fa(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},ha(da,{INPUT_START:Aa,INPUT_MOVE:Ba,INPUT_END:Ca,INPUT_CANCEL:Da,STATE_POSSIBLE:gb,STATE_BEGAN:hb,STATE_CHANGED:ib,STATE_ENDED:jb,STATE_RECOGNIZED:kb,STATE_CANCELLED:lb,STATE_FAILED:mb,DIRECTION_NONE:Ea,DIRECTION_LEFT:Fa,DIRECTION_RIGHT:Ga,DIRECTION_UP:Ha,DIRECTION_DOWN:Ia,DIRECTION_HORIZONTAL:Ja,DIRECTION_VERTICAL:Ka,DIRECTION_ALL:La,Manager:ea,Input:x,TouchAction:S,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:U,AttrRecognizer:Y,Tap:ca,Pan:Z,Swipe:ba,Pinch:$,Rotate:aa,Press:_,on:m,off:n,each:g,merge:pa,extend:oa,assign:ha,inherit:i,bindFn:j,prefixed:u});var pb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};pb.Hammer=da, true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return da}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!=typeof module&&module.exports?module.exports=da:a[c]=da}(window,document,"Hammer");
	//# sourceMappingURL=hammer.min.map

/***/ },
/* 93 */
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
	            timeout: 5000,/*5秒后连接超时*/
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
/* 94 */
/***/ function(module, exports) {

	/**
	 * Created by xinye on 16/5/18.
	 */

	//定义一个缓存机
	var Cache={
	    loadStatus:{
	        currLines:0,
	        trafficInfo:0
	    },
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
	    stationspoi: {},
	    offset: {},
	    navStations:{},
	    navStPixel:{},
	    navlines:{},
	    trafficNew:[],
	    trafficInfo:[],
	    convertData:{},
	    tempTrafficinfo:[]
	};

	module.exports=Cache;

/***/ },
/* 95 */
/***/ function(module, exports) {

	/**
	 * Created by xinye on 16/5/18.
	 */




	var Drw2lines={
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
	            //计算偏离度
	            var Xoffset=parseInt(offset*Math.cos(Math.PI/2-p_a[Path_id])),
	                Yoffset=parseInt(offset*Math.sin(Math.PI/2+p_a[Path_id]));
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
	        //获取到两条路径信息，分路径信息
	        Left.path = self.doublePathInfo(dataset_line_arr, 3).LeftPath;
	        Right.path = self.doublePathInfo(dataset_line_arr, 3).RightPath;

	        //获取左右两条线的颜色,若是地铁线颜色:current_drwData.cl;
	        Left.color = drwSw.defaultColor;
	        Right.color = drwSw.defaultColor;

	        //确定两条线的终点信息
	        Left.direction = end+"-to-"+start;
	        Right.direction = start+"-to-"+end;

	        //确定所属线段的line_id
	        Left.reflineName = drwData.ln;
	        Right.reflineName = drwData.ln;

	        var lineId=drwData.ls;
	        //区分机场线
	        if(lineId=="110005"){
	            drwSw.drwlines(parentNode, Right, drwData);
	        }else{
	            drwSw.drwlines(parentNode, Left, drwData);
	            drwSw.drwlines(parentNode, Right, drwData);
	        }
	    },
	};

	module.exports=Drw2lines;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */

	var $=__webpack_require__(97);
	var Drw2lines=__webpack_require__(95);
	var TraF=__webpack_require__(98);
	var Cache=__webpack_require__(94);

	var DrwMain={
	    defaultColor:TraF.statusColor[0].color,
	    currLines: {},
	    svgReady: false,
	    sortline:[],
	    statusColor:TraF.statusColor,
	    w: document.documentElement.clientWidth,
	    h: document.documentElement.clientHeight,
	    t_top: 0,
	    t_left: 0,
	    moveX: 0,
	    moveY: 0,
	    font_size: 12,
	    isNearTip: false,
	    ns_svg: "http://www.w3.org/2000/svg",
	    nearId: null,
	    svgOffset: {
	        left: 0,
	        top: 0
	    },
	    timer: {},
	    trafficInfo: Cache.trafficInfo,
	    stations: Cache.stations,
	    convertData: Cache.convertData,
	    stationsInfo: Cache.stationsInfo, /*几个数据接口*/
	    nearHightLight: 14,
	    /*站点名称的位置*/
	    label_angle: {
	        '0': [0, -1],
	        '1': [1, -1],
	        '2': [1, 0],
	        '3': [1, 1],
	        '4': [0, 1],
	        '5': [-1, 1],
	        '6': [-1, 0],
	        '7': [-1, -1]
	    },
	    specailPhone: false,
	    curOffset: {},

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
	                var offset = Cache.stations[detailStation].p;
	                ox = parseInt(offset.split(' ')[0]);
	                oy = parseInt(offset.split(' ')[1]);
	            } else {
	                ox = Cache.curCity.offset.x;
	                oy = Cache.curCity.offset.y;
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
	                var offset = Cache.stations[nearStation].p;
	                ox = parseInt(offset.split(' ')[0]);
	                oy = parseInt(offset.split(' ')[1]);
	            }
	            else {
	                ox = Cache.curCity.offset.x;
	                oy = Cache.curCity.offset.y;
	            }
	        }
	        originX = ox;
	        originY = oy;
	        var moveX = Number(screenX) - Number(originX);
	        var moveY = Number(screenY) - Number(originY);
	        DrwMain.moveX = moveX;
	        DrwMain.moveY = moveY;

	        self.deletInProgress(drwData);
	        self.drawSvgSubway(drwData, lightStation, param);
	    },
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
	    //画图
	    drawSvg: function(drwData, station, param) {
	        var self = this;
	        var status = 'normal';
	        self.lineSort();
	        self.drwSwLines(self.currLines, status);
	        TraF.drwTrafficLinesDefer(self.currLines, status);
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
	        //SW.showStation(param);
	        //SW.showRoute(param);
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
	    drwSwLines: function(drwData, status) {
	        var self = this;
	        var svg_g = document.getElementById("svg-g");
	        var subway_line = document.createElementNS(self.ns_svg, 'g');
	        subway_line.setAttribute("id", "g-line-" + status);
	        if (status == 'normal') {
	            svg_g.appendChild(subway_line);
	            //console.log("开始画主路");
	            for (var line_id in drwData) {
	                var current_drwData = drwData[line_id];
	                /*打印地铁线名称*/
	                //console.log("======##################=======" + drwData[line_id].ln + "=========############=====");
	                //画双线
	                Drw2lines.drwDouble(subway_line,current_drwData);
	            }
	            $("#refresh_content").show();
	            $(".filter_btn").show();
	            $(".help_btn").show();
	            console.log("主路画完！");
	        } else if (status == 'select') {
	            var svg_select = document.getElementById("g-select");
	            svg_select.appendChild(subway_line);
	            Drw2lines.drwDouble(subway_line, drwData);
	        }
	    },
	    //画单线:输入:挂载节点,路径的名称,地铁线的id/name数据,输出:单条地铁线
	    drwlines: function (parentNode,pathName,LineId_Data) {
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
	            color=DrwMain.defaultColor;/*如果感应器没有数据,就画默认颜色*/
	            //color=LineId_Data.cl;
	        }
	        line_path.setAttribute("stroke", "#" + color);
	        line_path.setAttribute("d", path);
	        parentNode.appendChild(line_path);
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
	                    var line_name = Cache.lines[id].ln;
	                    var line_name_w = line_name.length * self.font_size + 6;
	                    var line_name_h = 20;
	                    var line_color = Cache.lines[id].cl;
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
	                    subway_station.setAttribute("r", 7);
	                    subway_station.setAttribute("fill", "#FFF");
	                    subway_station.setAttribute("stroke-width", 2);
	                    subway_station.setAttribute("stroke", "#"+item.cl);/*画对应地铁线的颜色*/
	                    subway_circle_g.appendChild(subway_station);
	                }
	                //如果是换乘车站
	                else if ((item.t == "1")) {
	                    var subway_station_transfer = document.createElementNS(self.ns_svg, 'image');
	                    subway_station_transfer.setAttribute("x", parseInt(item.p.split(" ")[0]) - 13);
	                    subway_station_transfer.setAttribute("y", parseInt(item.p.split(" ")[1]) - 13);
	                    subway_station_transfer.setAttribute("width", 26);
	                    subway_station_transfer.setAttribute("height", 26);
	                    subway_station_transfer.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "./img/subway/transfer-station.png");
	                    subway_circle_g.appendChild(subway_station_transfer);
	                }
	                //高亮显示站点
	                var lightId = lightstation && lightstation.id;
	                if (lightId) {
	                    if (item.si == lightId) {
	                        console.log(item.si);
	                        var data = Cache.stations[lightId];
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
	    //动态展示选择器内的内容
	    addFilter: function(drwData) {
	        var self = this;
	        var subway_caption = $('.fliter_detail');
	        subway_caption.html(' ');
	        //增加“显示全部地铁的功能”
	        var firstHtml=[];
	        firstHtml.push("<li class='fliter_item' id='caption-allLines' lineid='caption-allLines' name='全部地铁'>");
	        //firstHtml.push("<span class='line_color' style='background:#000'></span>");
	        firstHtml.push("<span class='line_name'>全部地铁线路</span>");
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
	            var la = SW.cache.lines[self.sortline[i]].la;
	            var html = '',
	                line_name = '';
	            if (!la || la == '') {
	                line_name = SW.cache.lines[self.sortline[i]].ln;
	            } else {
	                line_name = SW.cache.lines[self.sortline[i]].ln + '<b class="line_name_la">( ' + SW.cache.lines[self.sortline[i]].la + ' )</b>';
	            }
	            //html = '<span class="line_color" style="background:#' + SW.cache.lines[self.sortline[i]].cl + '"></span><span class="line_name">' + line_name + '</span>';
	            html = "<span class='line_name'>" + line_name + "</span>";
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
	    getDetailStation: function(drwData, param) {
	        var self = this,
	            poiid = param.poiid,
	            lnglat = param.lnglat,
	            station = SW.cache.stationspoi[poiid];
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

	};

	module.exports=DrwMain;


/***/ },
/* 97 */
/***/ function(module, exports) {

	/* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */
	var Zepto=function(){function L(t){return null==t?String(t):j[S.call(t)]||"object"}function Z(t){return"function"==L(t)}function _(t){return null!=t&&t==t.window}function $(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function M(t){return D(t)&&!_(t)&&Object.getPrototypeOf(t)==Object.prototype}function R(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function B(n,i,r){for(e in i)r&&(M(i[e])||A(i[e]))?(M(i[e])&&!M(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),B(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function U(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className||"",r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){try{return t?"true"==t||("false"==t?!1:"null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?n.parseJSON(t):t):t}catch(e){return t}}function G(t,e){e(t);for(var n=0,i=t.childNodes.length;i>n;n++)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},S=j.toString,T={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return T.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~T.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},T.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),M(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},T.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},T.isZ=function(t){return t instanceof T.Z},T.init=function(e,i){var r;if(!e)return T.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=T.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(T.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=T.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}}return T.Z(r,e)},n=function(t,e){return T.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){B(t,n,e)}),t},T.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return $(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=a.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},n.type=L,n.isFunction=Z,n.isWindow=_,n.isArray=A,n.isPlainObject=M,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(R(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(R(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return T.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&T.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):R(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(T.qsa(this[0],t)):this.map(function(){return T.qsa(this,t)}):n()},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:T.matches(i,t));)i=i!==e&&!$(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!$(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return U(e,t)},parent:function(t){return U(N(this.pluck("parentNode")),t)},children:function(t){return U(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return U(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=J(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(n,i){var r;return"string"!=typeof n||1 in arguments?this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))}):this.length&&1===this[0].nodeType?!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:t},removeAttr:function(t){return this.each(function(){1===this.nodeType&&t.split(" ").forEach(function(t){X(this,t)},this)})},prop:function(t,e){return t=P[t]||t,1 in arguments?this.each(function(n){this[t]=J(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(e,n){var i="data-"+e.replace(m,"-$1").toLowerCase(),r=1 in arguments?this.attr(i,n):this.attr(i);return null!==r?Y(r):t},val:function(t){return 0 in arguments?this.each(function(e){this.value=J(this,t,e,this.value)}):this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r,o=this[0];if(!o)return;if(r=getComputedStyle(o,""),"string"==typeof t)return o.style[C(t)]||r.getPropertyValue(t);if(A(t)){var s={};return n.each(t,function(t,e){s[e]=o.style[C(e)]||r.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){if("className"in this){i=[];var r=W(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}}):this},removeClass:function(e){return this.each(function(n){if("className"in this){if(e===t)return W(this,"");i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),W(this,i.trim())}})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?_(s)?s["inner"+i]:$(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:T.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,u){o=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null;var f=n.contains(a.documentElement,o);r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();o.insertBefore(t,u),f&&G(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),T.Z.prototype=n.fn,T.uniq=N,T.deserializeValue=Y,n.zepto=T,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function S(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){var s=2 in arguments&&i.call(arguments,2);if(r(e)){var a=function(){return e.apply(n,s?s.concat(i.call(arguments)):arguments)};return a._zid=l(e),a}if(o(n))return s?(s.unshift(e[n],e),t.proxy.apply(null,s)):t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(S(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){e.type in f&&"function"==typeof this[e.type]?this[e.type]():"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=S(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return 0 in arguments?this.bind(e,t):this.trigger(e)}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function h(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function p(t,e,i,r){return t.global?h(e||n,i,r):void 0}function d(e){e.global&&0===t.active++&&p(e,null,"ajaxStart")}function m(e){e.global&&!--t.active&&p(e,null,"ajaxStop")}function g(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||p(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void p(e,n,"ajaxSend",[t,e])}function v(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),p(n,r,"ajaxSuccess",[e,n,t]),x(o,e,n)}function y(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),p(i,o,"ajaxError",[n,i,t||e]),x(e,n,i)}function x(t,e,n){var i=n.context;n.complete.call(i,e,t),p(n,i,"ajaxComplete",[e,n]),m(n)}function b(){}function w(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function E(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function j(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=E(e.url,e.data),e.data=void 0)}function S(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function C(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?C(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/,l=n.createElement("a");l.href=window.location.href,t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?v(f[0],l,i,r):y(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),g(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:b,success:b,error:b,complete:b,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var a,o=t.extend({},e||{}),s=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===o[i]&&(o[i]=t.ajaxSettings[i]);d(o),o.crossDomain||(a=n.createElement("a"),a.href=o.url,a.href=a.href,o.crossDomain=l.protocol+"//"+l.host!=a.protocol+"//"+a.host),o.url||(o.url=window.location.toString()),j(o);var u=o.dataType,f=/\?.+=\?/.test(o.url);if(f&&(u="jsonp"),o.cache!==!1&&(e&&e.cache===!0||"script"!=u&&"jsonp"!=u)||(o.url=E(o.url,"_="+Date.now())),"jsonp"==u)return f||(o.url=E(o.url,o.jsonp?o.jsonp+"=?":o.jsonp===!1?"":"callback=?")),t.ajaxJSONP(o,s);var C,h=o.accepts[u],p={},m=function(t,e){p[t.toLowerCase()]=[t,e]},x=/^([\w-]+:)\/\//.test(o.url)?RegExp.$1:window.location.protocol,S=o.xhr(),T=S.setRequestHeader;if(s&&s.promise(S),o.crossDomain||m("X-Requested-With","XMLHttpRequest"),m("Accept",h||"*/*"),(h=o.mimeType||h)&&(h.indexOf(",")>-1&&(h=h.split(",",2)[0]),S.overrideMimeType&&S.overrideMimeType(h)),(o.contentType||o.contentType!==!1&&o.data&&"GET"!=o.type.toUpperCase())&&m("Content-Type",o.contentType||"application/x-www-form-urlencoded"),o.headers)for(r in o.headers)m(r,o.headers[r]);if(S.setRequestHeader=m,S.onreadystatechange=function(){if(4==S.readyState){S.onreadystatechange=b,clearTimeout(C);var e,n=!1;if(S.status>=200&&S.status<300||304==S.status||0==S.status&&"file:"==x){u=u||w(o.mimeType||S.getResponseHeader("content-type")),e=S.responseText;try{"script"==u?(1,eval)(e):"xml"==u?e=S.responseXML:"json"==u&&(e=c.test(e)?null:t.parseJSON(e))}catch(i){n=i}n?y(n,"parsererror",S,o,s):v(e,S,o,s)}else y(S.statusText||null,S.status?"error":"abort",S,o,s)}},g(S,o)===!1)return S.abort(),y(null,"abort",S,o,s),S;if(o.xhrFields)for(r in o.xhrFields)S[r]=o.xhrFields[r];var N="async"in o?o.async:!0;S.open(o.type,o.url,N,o.username,o.password);for(r in p)T.apply(S,p[r]);return o.timeout>0&&(C=setTimeout(function(){S.onreadystatechange=b,S.abort(),y(null,"timeout",S,o,s)},o.timeout)),S.send(o.data?o.data:null),S},t.get=function(){return t.ajax(S.apply(null,arguments))},t.post=function(){var e=S.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=S.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=S(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var T=encodeURIComponent;t.param=function(e,n){var i=[];return i.add=function(e,n){t.isFunction(n)&&(n=n()),null==n&&(n=""),this.push(T(e)+"="+T(n))},C(i,e,n),i.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var e,n,i=[],r=function(t){return t.forEach?t.forEach(r):void i.push({name:e,value:t})};return this[0]&&t.each(this[0].elements,function(i,o){n=o.type,e=o.name,e&&"fieldset"!=o.nodeName.toLowerCase()&&!o.disabled&&"submit"!=n&&"reset"!=n&&"button"!=n&&"file"!=n&&("radio"!=n&&"checkbox"!=n||o.checked)&&r(t(o).val())}),i},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(0 in arguments)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);

	//     Zepto.js
	//     (c) 2010-2015 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function($, undefined){
	  var prefix = '', eventPrefix,
	    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
	    testEl = document.createElement('div'),
	    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	    transform,
	    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
	    animationName, animationDuration, animationTiming, animationDelay,
	    cssReset = {}

	  function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
	  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

	  $.each(vendors, function(vendor, event){
	    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
	      prefix = '-' + vendor.toLowerCase() + '-'
	      eventPrefix = event
	      return false
	    }
	  })

	  transform = prefix + 'transform'
	  cssReset[transitionProperty = prefix + 'transition-property'] =
	  cssReset[transitionDuration = prefix + 'transition-duration'] =
	  cssReset[transitionDelay    = prefix + 'transition-delay'] =
	  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
	  cssReset[animationName      = prefix + 'animation-name'] =
	  cssReset[animationDuration  = prefix + 'animation-duration'] =
	  cssReset[animationDelay     = prefix + 'animation-delay'] =
	  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

	  $.fx = {
	    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
	    speeds: { _default: 400, fast: 200, slow: 600 },
	    cssPrefix: prefix,
	    transitionEnd: normalizeEvent('TransitionEnd'),
	    animationEnd: normalizeEvent('AnimationEnd')
	  }

	  $.fn.animate = function(properties, duration, ease, callback, delay){
	    if ($.isFunction(duration))
	      callback = duration, ease = undefined, duration = undefined
	    if ($.isFunction(ease))
	      callback = ease, ease = undefined
	    if ($.isPlainObject(duration))
	      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
	    if (duration) duration = (typeof duration == 'number' ? duration :
	                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
	    if (delay) delay = parseFloat(delay) / 1000
	    return this.anim(properties, duration, ease, callback, delay)
	  }

	  $.fn.anim = function(properties, duration, ease, callback, delay){
	    var key, cssValues = {}, cssProperties, transforms = '',
	        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
	        fired = false

	    if (duration === undefined) duration = $.fx.speeds._default / 1000
	    if (delay === undefined) delay = 0
	    if ($.fx.off) duration = 0

	    if (typeof properties == 'string') {
	      // keyframe animation
	      cssValues[animationName] = properties
	      cssValues[animationDuration] = duration + 's'
	      cssValues[animationDelay] = delay + 's'
	      cssValues[animationTiming] = (ease || 'linear')
	      endEvent = $.fx.animationEnd
	    } else {
	      cssProperties = []
	      // CSS transitions
	      for (key in properties)
	        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
	        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

	      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
	      if (duration > 0 && typeof properties === 'object') {
	        cssValues[transitionProperty] = cssProperties.join(', ')
	        cssValues[transitionDuration] = duration + 's'
	        cssValues[transitionDelay] = delay + 's'
	        cssValues[transitionTiming] = (ease || 'linear')
	      }
	    }

	    wrappedCallback = function(event){
	      if (typeof event !== 'undefined') {
	        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
	        $(event.target).unbind(endEvent, wrappedCallback)
	      } else
	        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

	      fired = true
	      $(this).css(cssReset)
	      callback && callback.call(this)
	    }
	    if (duration > 0){
	      this.bind(endEvent, wrappedCallback)
	      // transitionEnd is not always firing on older Android phones
	      // so make sure it gets fired
	      setTimeout(function(){
	        if (fired) return
	        wrappedCallback.call(that)
	      }, ((duration + delay) * 1000) + 25)
	    }

	    // trigger page reflow so new elements can animate
	    this.size() && this.get(0).clientLeft

	    this.css(cssValues)

	    if (duration <= 0) setTimeout(function() {
	      that.each(function(){ wrappedCallback.call(this) })
	    }, 0)

	    return this
	  }

	  testEl = null
	})(Zepto)

	//     Zepto.js
	//     (c) 2010-2015 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function($){
	  var touch = {},
	    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
	    longTapDelay = 750,
	    gesture

	  function swipeDirection(x1, x2, y1, y2) {
	    return Math.abs(x1 - x2) >=
	      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	  }

	  function longTap() {
	    longTapTimeout = null
	    if (touch.last) {
	      touch.el.trigger('longTap')
	      touch = {}
	    }
	  }

	  function cancelLongTap() {
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    longTapTimeout = null
	  }

	  function cancelAll() {
	    if (touchTimeout) clearTimeout(touchTimeout)
	    if (tapTimeout) clearTimeout(tapTimeout)
	    if (swipeTimeout) clearTimeout(swipeTimeout)
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
	    touch = {}
	  }

	  function isPrimaryTouch(event){
	    return (event.pointerType == 'touch' ||
	      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
	      && event.isPrimary
	  }

	  function isPointerEventType(e, type){
	    return (e.type == 'pointer'+type ||
	      e.type.toLowerCase() == 'mspointer'+type)
	  }

	  $(document).ready(function(){
	    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

	    if ('MSGesture' in window) {
	      gesture = new MSGesture()
	      gesture.target = document.body
	    }

	    $(document)
	      .bind('MSGestureEnd', function(e){
	        var swipeDirectionFromVelocity =
	          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
	        if (swipeDirectionFromVelocity) {
	          touch.el.trigger('swipe')
	          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
	        }
	      })
	      .on('touchstart MSPointerDown pointerdown', function(e){
	        if((_isPointerType = isPointerEventType(e, 'down')) &&
	          !isPrimaryTouch(e)) return
	        firstTouch = _isPointerType ? e : e.touches[0]
	        if (e.touches && e.touches.length === 1 && touch.x2) {
	          // Clear out touch movement data if we have it sticking around
	          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
	          touch.x2 = undefined
	          touch.y2 = undefined
	        }
	        now = Date.now()
	        delta = now - (touch.last || now)
	        touch.el = $('tagName' in firstTouch.target ?
	          firstTouch.target : firstTouch.target.parentNode)
	        touchTimeout && clearTimeout(touchTimeout)
	        touch.x1 = firstTouch.pageX
	        touch.y1 = firstTouch.pageY
	        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
	        touch.last = now
	        longTapTimeout = setTimeout(longTap, longTapDelay)
	        // adds the current touch contact for IE gesture recognition
	        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
	      })
	      .on('touchmove MSPointerMove pointermove', function(e){
	        if((_isPointerType = isPointerEventType(e, 'move')) &&
	          !isPrimaryTouch(e)) return
	        firstTouch = _isPointerType ? e : e.touches[0]
	        cancelLongTap()
	        touch.x2 = firstTouch.pageX
	        touch.y2 = firstTouch.pageY

	        deltaX += Math.abs(touch.x1 - touch.x2)
	        deltaY += Math.abs(touch.y1 - touch.y2)
	      })
	      .on('touchend MSPointerUp pointerup', function(e){
	        if((_isPointerType = isPointerEventType(e, 'up')) &&
	          !isPrimaryTouch(e)) return
	        cancelLongTap()

	        // swipe
	        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
	            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

	          swipeTimeout = setTimeout(function() {
	            touch.el.trigger('swipe')
	            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
	            touch = {}
	          }, 0)

	        // normal tap
	        else if ('last' in touch)
	          // don't fire tap when delta position changed by more than 30 pixels,
	          // for instance when moving to a point and back to origin
	          if (deltaX < 30 && deltaY < 30) {
	            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
	            // ('tap' fires before 'scroll')
	            tapTimeout = setTimeout(function() {

	              // trigger universal 'tap' with the option to cancelTouch()
	              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
	              var event = $.Event('tap')
	              event.cancelTouch = cancelAll
	              touch.el.trigger(event)

	              // trigger double tap immediately
	              if (touch.isDoubleTap) {
	                if (touch.el) touch.el.trigger('doubleTap')
	                touch = {}
	              }

	              // trigger single tap after 250ms of inactivity
	              else {
	                touchTimeout = setTimeout(function(){
	                  touchTimeout = null
	                  if (touch.el) touch.el.trigger('singleTap')
	                  touch = {}
	                }, 250)
	              }
	            }, 0)
	          } else {
	            touch = {}
	          }
	          deltaX = deltaY = 0

	      })
	      // when the browser window loses focus,
	      // for example when a modal dialog is shown,
	      // cancel all ongoing events
	      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

	    // scrolling the window indicates intention of the user
	    // to scroll, not tap or swipe, so cancel all ongoing events
	    $(window).on('scroll', cancelAll)
	  })

	  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
	    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
	    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
	  })
	})(Zepto)

	//     Zepto.js
	//     (c) 2010-2015 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function($){
	  $.fn.end = function(){
	    return this.prevObject || $()
	  }

	  $.fn.andSelf = function(){
	    return this.add(this.prevObject || $())
	  }

	  'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property){
	    var fn = $.fn[property]
	    $.fn[property] = function(){
	      var ret = fn.apply(this, arguments)
	      ret.prevObject = this
	      return ret
	    }
	  })
	})(Zepto)


	//     Zepto.js
	//     (c) 2010-2015 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function($){
	  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

	  function visible(elem){
	    elem = $(elem)
	    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
	  }

	  // Implements a subset from:
	  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
	  //
	  // Each filter function receives the current index, all nodes in the
	  // considered set, and a value if there were parentheses. The value
	  // of `this` is the node currently being considered. The function returns the
	  // resulting node(s), null, or undefined.
	  //
	  // Complex selectors are not supported:
	  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	  //   ul.inner:first > li
	  var filters = $.expr[':'] = {
	    visible:  function(){ if (visible(this)) return this },
	    hidden:   function(){ if (!visible(this)) return this },
	    selected: function(){ if (this.selected) return this },
	    checked:  function(){ if (this.checked) return this },
	    parent:   function(){ return this.parentNode },
	    first:    function(idx){ if (idx === 0) return this },
	    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
	    eq:       function(idx, _, value){ if (idx === value) return this },
	    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
	    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
	  }

	  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
	      childRe  = /^\s*>/,
	      classTag = 'Zepto' + (+new Date())

	  function process(sel, fn) {
	    // quote the hash in `a[href^=#]` expression
	    sel = sel.replace(/=#\]/g, '="#"]')
	    var filter, arg, match = filterRe.exec(sel)
	    if (match && match[2] in filters) {
	      filter = filters[match[2]], arg = match[3]
	      sel = match[1]
	      if (arg) {
	        var num = Number(arg)
	        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
	        else arg = num
	      }
	    }
	    return fn(sel, filter, arg)
	  }

	  zepto.qsa = function(node, selector) {
	    return process(selector, function(sel, filter, arg){
	      try {
	        var taggedParent
	        if (!sel && filter) sel = '*'
	        else if (childRe.test(sel))
	          // support "> *" child queries by tagging the parent node with a
	          // unique class and prepending that classname onto the selector
	          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

	        var nodes = oldQsa(node, sel)
	      } catch(e) {
	        console.error('error performing selector: %o', selector)
	        throw e
	      } finally {
	        if (taggedParent) taggedParent.removeClass(classTag)
	      }
	      return !filter ? nodes :
	        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
	    })
	  }

	  zepto.matches = function(node, selector){
	    return process(selector, function(sel, filter, arg){
	      return (!sel || oldMatches(node, sel)) &&
	        (!filter || filter.call(node, null, arg) === node)
	    })
	  }
	})(Zepto)

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */

	var Cache=__webpack_require__(94);
	var Drw2lines=__webpack_require__(95);
	var DrwMain=__webpack_require__(96);
	var Common=__webpack_require__(99);


	var TraF = {
	    timer:null,
	    trafficInfo:[],
	    refreshStatus:"",
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
	    loadTraffic: function (city_code, city_name) {
	        var self = this;
	        Cache.loadStatus.trafficInfo = 0;
	        var trafficData_Url = "http://223.72.210.20:8388/PublicTripProvide/LoadAfcJtlDataJson?ask=t8ai8t4s3acb1ce";
	        //var trafficData_Url="data/" + city_code + "_trafficinfo_" + city_name + ".json";
	        amapCache.loadData(trafficData_Url, function (trafficData) {
	            //编译最原始的trafficInfo
	            //console.log(trafficData);
	            //先清空，再遍历！
	            self.trafficInfo = [];
	            self.refreshStatus = "";
	            var len = trafficData.jtlList.length;
	            for (var k = 0; k < len; k++) {
	                var info = {};
	                var flashCode = trafficData.jtlList[k].flashCode;
	                var start = flashCode.slice(3).split("_")[0];
	                var end = flashCode.slice(3).split("_")[1].slice(0, 9);
	                var loadRate = trafficData.jtlList[k].loadData;
	                var refreshTime = trafficData.jtlList[k].startTime;
	                info.startAcc = start;
	                info.endAcc = end;
	                info.loadRate = loadRate;
	                info.refreshTime = refreshTime;
	                info.Acc2Acc = flashCode.slice(3, 22);
	                if (loadRate >= 0 && loadRate <= 0.6) {
	                    info.rateColor = self.statusColor[0].color;
	                } else if (loadRate > 0.6 && loadRate <= 0.9) {
	                    info.rateColor = self.statusColor[1].color;
	                } else if (loadRate > 0.9 && loadRate <= 1.1) {
	                    info.rateColor = self.statusColor[2].color;
	                } else if (loadRate > 1.1) {
	                    info.rateColor = self.statusColor[3].color;
	                } else {
	                    info.rateColor = "CCCCCC";
	                }
	                self.trafficInfo.push(info);
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
	            Cache.loadStatus.trafficInfo = 1;
	            console.log("路况信息请求完成!");
	            self.refreshStatus = Common.formatTime(self.trafficInfo[0].refreshTime).trafficLoad;
	            //callback();
	            //console.log(self.refreshStatus);
	            //console.log("self.cache.trafficInfo",self.cache.trafficInfo);
	        }, function () {
	            Cache.loadStatus.trafficInfo = 2;
	            //self.loadMainData(city_code,city_name,callback);
	            //延迟弹窗
	            setTimeout(function () {
	                tip.refreshError();
	            }, 1000);
	        });
	    },
	    addTrafficInfo: function (city_code) {
	        //这里依赖加载路况信息以及画图信息的加载状态
	        var self = this;
	        //console.log(SW.timer);
	        //console.log("请求到了路况信息,开始编译...");
	        var drwData = Cache.cities[city_code];
	        for (var line_id in drwData.lines) {
	            for (var j in drwData.lines[line_id].st2st) {
	                for (var k in self.trafficInfo) {
	                    if (self.trafficInfo[k].Acc2Acc == drwData.lines[line_id].st2st[j].directionAcc.slice(3)) {
	                        drwData.lines[line_id].st2st[j].loadRate = self.trafficInfo[k].loadRate;
	                        drwData.lines[line_id].st2st[j].refreshTime = self.trafficInfo[k].refreshTime;
	                        drwData.lines[line_id].st2st[j].rateColor = self.trafficInfo[k].rateColor;
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
	            clearTimeout(TraF.timer);
	            //开一个定时器，检测画图和路况信息的加载状态
	            TraF.timer = setTimeout(function () {
	                if (Cache.loadStatus.trafficInfo == 1&& Cache.loadStatus.currLines==1) {
	                    //编译路况信息
	                    var city_code = Cache.curCity.adcode;
	                    TraF.addTrafficInfo(city_code);
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
	                } else if (Cache.loadStatus.trafficInfo == 2|| Cache.loadStatus.currLines==2) {
	                    clearTimeout(TraF.timer);
	                } else {
	                    console.log("路况信息错误!", "traffic", Cache.loadStatus.trafficInfo);
	                    TraF.drwTrafficLinesDefer(drwData, status);
	                }
	            }, 10)
	        } else if (status == 'select') {
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
	            if (LineId_Data.st2st[k].ref_direct == "right") {
	                //console.log(LineId_Data.st2st[k],LineId_Data.st2st[k].directionName,k);
	                var rightmain = LineId_Data.st2st[k].path;
	                var rightpath = Drw2lines.doublePathInfo(rightmain, 3).RightPath;
	                var rightcolor = LineId_Data.st2st[k].rateColor;
	                Right.path = rightpath;
	                Right.color = "AF272B";
	                //Right.color = rightcolor;/*注意停运时的颜色使用,停运时没有颜色值,没有颜色值就会在drwlines()中,使用line本身的颜色*/
	                Right.direction = LineId_Data.st2st[k].directionName;
	                Right.reflineName = LineId_Data.st2st[k].reflineName;
	                DrwMain.drwlines(parentNode, Right, LineId_Data);
	            }
	            if (LineId_Data.st2st[k].ref_direct == "left") {
	                //console.log(LineId_Data.st2st[k],LineId_Data.st2st[k].directionName,k);
	                var leftmain = LineId_Data.st2st[k].path;
	                var leftpath = Drw2lines.doublePathInfo(leftmain, 3).LeftPath;
	                var leftcolor = LineId_Data.st2st[k].rateColor;
	                Left.path = leftpath;
	                Left.color = "C99616";
	                //Left.color = leftcolor;/*注意停运时的颜色使用,停运时没有颜色值,没有颜色值就会在drwlines()中,使用line本身的颜色*/
	                Left.direction = LineId_Data.st2st[k].directionName;
	                Left.reflineName = LineId_Data.st2st[k].reflineName;
	                DrwMain.drwlines(parentNode, Left, LineId_Data);
	            }
	        }

	    },
	};

	module.exports=TraF;


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Wangxin on 2016/5/19.
	 */

	var $=__webpack_require__(97);
	var attachFastClick = __webpack_require__(91);
	var Cache=__webpack_require__(94);
	var DrwMain=__webpack_require__(96);
	var loadTraffic=__webpack_require__(98);
	var Data=__webpack_require__(100);

	var Common={
	    subwayFlag:0,
	    param:{},

	    //数据初始化!
	    swInit: function() {
	        var self = this;

	        attachFastClick(document.body);
	        //调用缓存工具中的初始化方法
	        amapCache.init({
	            complete: function() {
	                self.initCity(); //根据缓存加载相应城市
	                tip.init(); //初始化事件绑定信息
	                self.loadingOver();//加载完成
	            }
	        });
	    },

	    //初始化城市信息
	    initCity: function() {
	        var self = this;
	        //如果有adcode那就展示城市
	        self.showCity();
	        // 通过监听hashchange事件来更改城市
	        $(window).on('hashchange', function() {
	            self.showCity();
	        });
	    },
	    //显示城市：获取hash值，依据hash值匹配对应城市信息，
	    showCity: function() {
	        var self = this,
	            cache = Cache;
	        var hash = decodeURIComponent(window.location.hash).replace(/^\#/, '');
	        //decodeURIComponent 对 encodeURIComponent() 函数编码的 URI 进行解码。replace(/^\#/, '')，把#号给去除了。
	        var param = self.param2json(hash);
	        //self.param2json(hash)就是将hash转为json对象，"city=1100"字符串转换为了object的格式，｛"city":"1100"｝
	        if (!param || !param.src || param.src && param.src != 'alipay') {
	            $('#subway, #citypage').addClass('msubway');
	        }
	        //如果param不存在，那就打开城市选择列表。
	        if (!param) {
	            self.subwayFlag = 0;
	            return tip.cityChange();
	        }
	        self.param = param;
	        //取adcode为param中city的值。
	        var adcode = param.city && param.city.substr(0, 4);
	        //var adcode = "1100";

	        //如果城市代码存在，那就判断文件中是否存有对应的地铁图
	        if (adcode != '') {
	            if (!Data.fileNameData[adcode]) {
	                // 该城市没有对应地铁图,那就打开cityChange的列表
	                self.subwayFlag = 0;
	                return tip.cityChange();
	            } else {
	                // 该城市有对应地铁图,那就显示#subway
	                self.subwayFlag = 1;
	                $('#subway').show()
	            }
	        }
	        //如果城市代码不存在
	        else {
	            self.subwayFlag = 0;
	            return tip.cityChange();
	        }

	        $('.city_name').html(Data.cityname[adcode]);
	        //改变网页的标题
	        document.title = Data.cityname[adcode] + '地铁图';

	        // 此城市代码与当前城市的代码不一致，即发生了变化，tip.hideCitylist();
	        if (adcode != cache.curCity.adcode) {
	            $("#subway-svg,#infowindow-content,#tip-content,.line-caption").remove();
	            DrwMain.svgReady = false;
	            //开启加载对应城市的数据
	            self.loading();
	            $(".filter_btn").hide();
	            self.loadData(adcode, function (drwData) {
	                //这里的drwData是loadData方法中callback的参数。这个参数在loadData中被定义。
	                self.loadingOver();
	                console.log(Cache);
	                //绘制对应城市的地铁
	                //DrwMain.draw(drwData, param);
	            });
	        } else {
	            //显示车站
	            self.showStation(param);
	        }
	    },
	    //显示城市的地铁站
	    showStation: function (param) {
	        var stationId = param.station;
	        if(stationId){
	            var station = Cache.stations[stationId] || Cache.stationspoi[stationId];
	            var sid = 'st-' + station.si;
	            var obj = $('#' + sid);
	            if (DrwMain.isNearTip) {
	                DrwMain.clearNearTip();
	            }
	            tip.openTip(obj);
	            var center = tip.getStCenter(obj);
	            tip.setCenter(center);
	        }
	    },
	    //加载数据
	    loadData: function(adcode, callback) {
	        var self = this,
	            cache = Cache;
	        var city_code = adcode;
	        // var city_name = cache.citylistByAdcode[adcode].spell;
	        var city_name = Data.fileNameData[adcode];
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
	            self.loadStInfo(city_code,city_name);
	            loadTraffic.loadTraffic(city_code,city_name);
	            self.loadMainData(city_code,city_name,callback);
	        }
	    },
	    //这里是请求对应城市的地铁数据
	    loadMainData: function (city_code,city_name,callback) {
	        Cache.loadStatus.currLines=0;
	        var self = this;
	        var drwData_Url = "data/" + city_code + "_drw_" + city_name + ".json";
	        amapCache.loadData(drwData_Url, function(loaddata) {
	                //-------------JSON编译功能-------------
	                //console.log("原始数据请求成功!",data);
	                //给2秒钟的延迟去加载路况信息
	                //self.loadConvert(city_code,city_name);
	                //setTimeout(function () {
	                //	SW.Traffic2JSON(loaddata);/*drwData增加st2st信息的开关*/
	                //},2000);
	                //————————————JSON编译结束——————————
	                self.buildCurLinesData(city_code,loaddata);
	                Cache.loadStatus.currLines=1;
	                callback(Cache.cities[city_code]);
	            },
	            function() {
	                Cache.loadStatus.currLines=2;
	                alert('城市地铁数据加载失败！');
	                self.subwayFlag = 0;
	                //tip.cityChange();
	            });
	    },
	    //初步编译地铁的基础信息
	    buildCurLinesData: function (city_code,data) {
	        var self=this;
	        var cache = Cache;
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
	        var _x = 0,
	            _y = 0;
	        cache.offset[data.i].x = _offset[0];
	        cache.offset[data.i].y = _offset[1];
	        //相对于（1000，1000）做偏移。
	        _x = 1000 - Number(_offset[0]);
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
	                    var _startPos = _st2st[k].startPos.split(" ");
	                    _st2st[k].startPos = (Number(_startPos[0]) + _x) + ' ' + (Number(_startPos[1]) + _y);
	                    //	_st2st的endPos偏移;
	                    var _endPos = _st2st[k].endPos.split(" ");
	                    _st2st[k].endPos = (Number(_endPos[0]) + _x) + ' ' + (Number(_endPos[1]) + _y);
	                    //	_st2st的directionPos偏移;
	                    _st2st[k].directionPos = _st2st[k].startPos + "-to-" + _st2st[k].endPos;
	                }

	                cache.cities[data.i].linesNamePos[data.l[i].ls] = data.l[i].lp;
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
	        //console.log(drwData);
	    },
	    //请求站点首末班车信息
	    loadStInfo: function (city_code,city_name){
	        var infoData_Url = "data/" + city_code + "_info_" + city_name + ".json";
	        amapCache.loadData(infoData_Url, function(info_data) {
	            for (var k = 0; k < info_data.l.length; k++) {
	                for (var l = 0; l < info_data.l[k].st.length; l++) {
	                    Cache.stationsInfo[info_data.l[k].st[l].si] = info_data.l[k].st[l];
	                }
	            }
	            console.log("站点首末车时间请求完成!");
	        },function() {
	            alert('地铁站点数据加载失败！');
	        });
	    },
	    // 请求数据查询转换接口
	    loadConvert: function (city_code,city_name) {
	        var self=this;
	        var trafficData_Url="data/" + city_code + "_conv_" + city_name + ".json";
	        amapCache.loadData(trafficData_Url, function(convertData) {
	            //遍历数据，缓存所有的路况信息到trafficInfo！
	            var len=convertData.length;
	            for(var i=0;i<len;i++){
	                Cache.convertData[i]=convertData[i];
	            }
	            console.log("数据转换接口请求成功！")
	        },function() {
	            alert('数据转换表加载出错！');
	        });
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
	            for (var i in self.cache.convertData) {
	                if (self.cache.convertData[i].line_id == current_City_lines[line_id].ls) {
	                    /*已经选择了一条地铁*/
	                    var length=self.cache.convertData[i].stations.length;
	                    //遍历转换器中的stations
	                    for (var j = 0; j < length; j++) {
	                        var acc = self.cache.convertData[i].stations[j].Acc;
	                        /*已经选中了单个车站*/
	                        var name = self.cache.convertData[i].stations[j].Name;
	                        var current_drwData = current_City_lines[line_id];
	                        var st = current_drwData.st;
	                        var dataset_line_arr = current_drwData.c;
	                        //以下获取start信息
	                        for (var k in self.cache.trafficInfo) {
	                            /*去遍历所有的路段信息*/
	                            if (self.cache.trafficInfo[k].startAcc == acc) {
	                                /*查到当前站点为起点的路段*/
	                                self.cache.trafficInfo[k].startName = name;
	                                self.cache.trafficInfo[k].reflineId = current_drwData.ls;
	                                self.cache.trafficInfo[k].reflineName = current_drwData.ln;
	                                for (var x in st) {
	                                    //当drw信息中的station的名字与traffic信息中的名字匹配时
	                                    if (st[x].n == name) {
	                                        self.cache.trafficInfo[k].startPos = st[x].p;
	                                    }
	                                }
	                                if (!(self.cache.trafficInfo[k].hasOwnProperty("startPos"))) {
	                                    //self.cache.trafficInfo[k].startPos = self.cache.trafficInfo[k - 1].startPos;
	                                    console.log(self.cache.trafficInfo[k], k)
	                                }
	                                var startPos = self.cache.trafficInfo[k].startPos;
	                                for (var y in dataset_line_arr) {
	                                    if (dataset_line_arr[y] == startPos) {
	                                        self.cache.trafficInfo[k].startIndex = y;
	                                    }
	                                }
	                            }
	                        }
	                        //获取end信息
	                        for (var k in self.cache.trafficInfo) {
	                            if (self.cache.trafficInfo[k].endAcc == acc) {
	                                /*查到当前站点为起点的路段*/
	                                self.cache.trafficInfo[k].endName = name;
	                                for (var x in st) {
	                                    if (st[x].n == name) {
	                                        self.cache.trafficInfo[k].endPos = st[x].p;
	                                    }
	                                }
	                                var endPos = self.cache.trafficInfo[k].endPos;
	                                //
	                                if (!(self.cache.trafficInfo[k].hasOwnProperty("endPos"))) {
	                                    //self.cache.trafficInfo[k].endPos = self.cache.trafficInfo[k - 1].endPos;
	                                    console.log(self.cache.trafficInfo[k], k)
	                                }
	                                for (var y in dataset_line_arr) {
	                                    if (dataset_line_arr[y] == endPos) {
	                                        self.cache.trafficInfo[k].endIndex = y;
	                                    }
	                                }
	                            }
	                        }
	                        //修正环线的的首尾连接问题
	                        for (var k in self.cache.trafficInfo) {
	                            if (self.cache.trafficInfo[k].endIndex - self.cache.trafficInfo[k].startIndex> 30) {
	                                self.cache.trafficInfo[k].endIndex = 0;
	                            }else if(self.cache.trafficInfo[k].startIndex - self.cache.trafficInfo[k].endIndex> 30){
	                                self.cache.trafficInfo[k].startIndex = 0;
	                            }
	                            self.cache.trafficInfo[k].direction = self.cache.trafficInfo[k].startName+"-to-"+self.cache.trafficInfo[k].endName;
	                        }
	                        //增加path和color、direct
	                        for (var k in self.cache.trafficInfo) {
	                            var loadRate=self.cache.trafficInfo[k].loadRate;
	                            var color={};
	                            //增加path
	                            if (self.cache.trafficInfo[k].reflineId == current_drwData.ls) {
	                                var start = Number(self.cache.trafficInfo[k].startIndex);
	                                var end = Number(self.cache.trafficInfo[k].endIndex);
	                                if (start < end) {
	                                    self.cache.trafficInfo[k].path = dataset_line_arr.slice(start, end + 1);
	                                    self.cache.trafficInfo[k].ref_direct = "right";
	                                } else {
	                                    self.cache.trafficInfo[k].path = dataset_line_arr.slice(end, start + 1);
	                                    self.cache.trafficInfo[k].ref_direct = "left";
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
	                            self.cache.trafficInfo[k].color = color;
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
	            for(var k in self.cache.trafficInfo){
	                if(current_drwData.ls==self.cache.trafficInfo[k].reflineId){
	                    var section={};
	                    section.directionAcc="Acc"+self.cache.trafficInfo[k].startAcc+"_"+self.cache.trafficInfo[k].endAcc;
	                    section.directionPos=self.cache.trafficInfo[k].startPos+"-to-"+self.cache.trafficInfo[k].endPos;
	                    section.directionName=self.cache.trafficInfo[k].direction;
	                    section.startPos=self.cache.trafficInfo[k].startPos;
	                    section.startName=self.cache.trafficInfo[k].startName;
	                    section.endPos=self.cache.trafficInfo[k].endPos;
	                    section.endName=self.cache.trafficInfo[k].endName;
	                    section.reflineId=self.cache.trafficInfo[k].reflineId;
	                    section.reflineName=self.cache.trafficInfo[k].reflineName;
	                    section.path=self.cache.trafficInfo[k].path;
	                    section.ref_direct=self.cache.trafficInfo[k].ref_direct;
	                    obj.sections.push(section);
	                }
	            }
	            //console.log(obj);
	            current_drwData.st2st=obj.sections;
	            //console.log(current_drwData);
	            self.cache.trafficNew.push(current_drwData);
	        }
	        console.log("新的画图数据drwData整理完毕！");
	        //console.log("trafficNew",self.cache.trafficNew);
	        //转json!
	        console.log("正在转译成Json...");
	        console.log(JSON.stringify(self.cache.trafficNew));
	    },
	    //正在加载
	    loading: function() {
	        $('.loading-outer').css('position', 'fixed');
	        $('.loading-bg').css({
	            'position': 'fixed',
	            'display': 'block'
	        });
	        $('.loading-bg .loading').css('top', '-30px');
	    },
	    //加载完成
	    loadingOver: function() {
	        $('.loading-bg').css('display', 'none');
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


	module.exports=Common;

/***/ },
/* 100 */
/***/ function(module, exports) {

	/**
	 * Created by Wangxin on 2016/5/19.
	 */

	var DataAll={
	    fileNameData: {
	        '1100': 'beijing'
	    },
	    cityname: {
	        '1100': '\u5317\u4eac' //北京,
	    },
	    cityListData: [
	        {
	            adcode: '1100',
	            spell: 'beijing',
	            cityname: '北京'
	        }
	    ]
	};
	module.exports=DataAll;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xinye on 16/5/18.
	 */
	var $ = __webpack_require__(97);
	__webpack_require__(91);
	__webpack_require__(92);


	var Cache = __webpack_require__(94);
	var DataAll=__webpack_require__(100);
	var DrwMain=__webpack_require__(96);
	var TraF=__webpack_require__(98);
	var Common=__webpack_require__(99);

	var getstureState = 0;
	var el = document.getElementById('drag_handle');
	el.style.transformOrigin = "top left";

	var tip = {
	    refreshTimer:{},
	    refreshstate:0,
	    timer:{},
	    curCity:Cache.curCity,
	    w: document.documentElement.clientWidth,
	    h: document.documentElement.clientHeight,
	    stationsInfo: Cache.stationsInfo,/*几个数据接口*/
	    stations: Cache.stations,
	    lines: Cache.lines,
	    tempTrafficinfo:Cache.tempTrafficinfo,
	    station_w: 26,
	    touchStatus: null, //当前touch状态：drag, scale
	    curScale: 1, //当前缩放级别
	    allScale: 1,
	    svgOffset: {
	        left: 0,
	        top: 0
	    },
	    realCenter: {
	        x: $(window).width() / 2,
	        y: $(window).height() / 2
	    },
	    subwaySvg: document.getElementById("subway-svg"),
	    dragObjOffset: {
	        x: null,
	        y: null
	    },
	    opentip: false,
	    curopenStation: null,
	    routeId: {
	        start: null,
	        end: null
	    },
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
	    transformOrigin: null,
	    routeState: false,
	    fromendState: false,
	    //初始化事件绑定信息
	    init: function() {
	        this.bindEvent();
	    },
	    preventScrollBounce: function(eles) {
	        if (!eles.length && !eles.unshift) {
	            eles = [eles]
	        }

	        eles.forEach(function(el) {
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
	    //绑定事件
	    bindEvent: function() {
	        document.addEventListener('touchstart', function() {});
	        var self = this;
	        var $refresh=$(".refresh_btn");
	        var $subway = $('#subway');
	        var $citypage = $('#citypage');
	        var $overlays = $('#overlays');
	        //var $srh = $('#srhpage');
	        var el = document.getElementById('drag_handle');
	        var mc = new Hammer.Manager(el, {
	            domEvents: true
	        });

	        mc.add(new Hammer.Pan());
	        mc.add(new Hammer.Pinch());

	        var enableGesture = true;
	        var lastAction = "";
	        var hasPenchend = false;

	        mc.on("panmove", function(ev) {
	            if (!enableGesture) return;
	            self.touchStatus = 'pan';
	            lastAction = "pan";
	            self.mcdragSvg(ev);
	        });

	        mc.on("pinchstart pinchmove", function(ev) {

	            if (!enableGesture) return;

	            self.touchStatus = 'pinch';
	            lastAction = "pinch";
	            if (ev.type == 'pinchstart') {
	                self.svgOffset = DrwMain.svgOffset || tip.svgOffset;
	                hasPenchend = false;
	            }
	            self.mcScaleSvg(ev);

	        });

	        mc.on("pinchend", function(ev) {
	            setTimeout(function() {
	                if (!hasPenchend) {
	                    self.scaleSvgUpdate(self.transform.scale);
	                }
	            }, 0)
	        });
	        mc.on("hammer.input", function(ev) {

	            if (ev.isFinal) {

	                if (lastAction == "pinch") {
	                    self.scaleSvgUpdate(self.transform.scale);
	                    hasPenchend = true;
	                }

	                if (lastAction == "pan") {
	                    self.svgUpdate(ev);
	                }

	                enableGesture = false;
	                setTimeout(function() {
	                    enableGesture = true;
	                }, 50);
	            }
	        });

	        $subway.on('touchend', 'g', function() {
	            if (!self.touchStatus) {
	                if ($(this).hasClass('line_name')) {
	                    var line_id = $(this).attr('lineid');
	                    var SW_line_name = Cache.lines[line_id].ln;
	                    var line_name=SW_line_name.split("/")[0].toString().substr(0,4);
	                    $(".filter_btn").html(line_name);
	                    self.showFilterLine(line_id);
	                    var select_obj = $('#g-select');
	                    tip.setFitview(select_obj);
	                    var center = self.getFilterCenter();
	                    self.setCenter(center);
	                }
	            }
	        });

	        $subway.on('touchend', '#g-bg', function() {
	            if (!tip.routeState) {
	                if (!self.touchStatus) {
	                    $('#g-select').remove();
	                    $('#g-bg').css('display', 'none');
	                    $(".filter_btn").html("线路图");
	                }
	            }
	        });

	        //触击 非站点又不是换乘点的区域 关闭弹窗
	        $subway.on('touchend','#drag_handle'&&".light_box",function(e) {
	            if (!self.touchStatus && !tip.routeState) {
	                var target = e.target;
	                if (target.getAttribute('class') != 'station_obj' || target.getAttribute('class') != 'nav-img') {
	                    tip.closeTip();
	                    tip.closehelpBox();
	                }
	            }
	        });

	        //触击站点事件：打开一个#city=city代码&station=站点代码的网址;
	        $subway.on('touchend', '.station_obj', function (e) {
	            e.stopPropagation();
	            if (!self.touchStatus && !tip.routeState) {
	                var id = $(this).attr('station_id');
	                self.closeFilter();
	                $('.light_box').css('display', 'block');
	                window.location.hash = '#city=' + Cache.curCity.adcode + '&station=' + id;
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
	            self.closeFilter();
	            self.closehelpBox()
	        });

	        $refresh.on('touchend', function (ev) {
	            ev.stopPropagation();
	            if(self.refreshstate==0){
	                self.refreshstate=1;
	                var $refresh = $(".refresh_btn");
	                $refresh.addClass("refresh_active");
	                var city_code = Cache.curCity.adcode;
	                var city_name = DataAll.fileNameData[Cache.curCity.adcode];
	                var status = 'normal';
	                SW.loadTraffic(city_code, city_name);
	                //console.log("add前",drwSw.currLines);
	                TraF.drwTrafficLinesDefer(DrwMain.currLines, status);
	            }else {
	                ev.stopPropagation();
	            }
	        });

	        //点击线路图选择器，打开选择器
	        $('.filter_btn').on('touchend', function() {
	            self.closehelpBox();
	            if (!tip.routeState) {
	                self.openFilter();
	            }
	        });
	        //点击选择器中的路线：关闭选择器，显示地铁，设置屏幕中心点为地铁的中心
	        $('.fliter_detail').on('touchend', '.fliter_item', function() {
	            if (lockfd) return;
	            var line_id = $(this).attr('lineid');
	            var line_name=$(this).attr('name');
	            if (line_id == "caption-allLines") {
	                self.closeFilter();
	                $(".filter_btn").html("线路图");
	                $('#g-bg').css('display','none');
	                //self.showFilterLine(line_id);
	                var center={};
	                var $Svg=$('#svg-g');
	                var $Svg_offset = $Svg.offset();
	                var $Svg_h = document.getElementById('svg-g').getBBox().height * self.allScale,
	                    $Svg_w = document.getElementById('svg-g').getBBox().width * self.allScale;
	                center.x = $Svg_offset.left + $Svg_w/2;
	                center.y = $Svg_offset.top + $Svg_h/2;
	                //var center2=self.getStCenter($Svg);
	                //console.log($Svg_offset,center,center2,$Svg_w,$Svg_h);
	                //console.log(tip.realCenter);
	                tip.setCenter(center);

	            } else {
	                self.closeFilter();
	                $(".filter_btn").html(line_name);
	                self.showFilterLine(line_id);
	                var select_obj = $('#g-select');
	                tip.setFitview(select_obj);
	                var center = self.getFilterCenter();
	                self.setCenter(center);
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
	            self.closeFilter();
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
	    refreshShow: function () {
	        $(".refresh_box").css("display", "block").addClass("refresh_box_show");
	        $(".refresh_time_text").css("display", "block").addClass("refresh_time_text_show");
	        Common.loadingOver();
	        //4秒后隐藏信息
	        clearTimeout(tip.refreshTimer);
	        tip.refreshTimer = setTimeout(function () {
	            $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
	            $(".refresh_box").removeClass("refresh_box_show").css("display", "none");
	            tip.refreshstate = 0;
	        }, 4000);
	    },
	    refreshSuccess: function () {
	        $('.refresh_time_text').html("更新于"+SW.refreshStatus);
	        //去除加载状态
	        var $refresh=$(".refresh_btn");
	        $refresh.removeClass("refresh_active");
	        tip.refreshstate = 1;
	        tip.refreshShow();
	    },
	    refreshError: function () {
	        var $refresh=$(".refresh_btn");
	        $refresh.removeClass("refresh_active");
	        $(".refresh_error").css("display","block");
	        setTimeout(function () {
	            $(".refresh_error").css("display","none");
	            tip.refreshstate = 0;
	        },1500);
	    },
	    stoprefresh:function (){
	        $(".refresh_btn").hide();
	        $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
	        $(".refresh_box").hide().removeClass("refresh_box_show").css("display", "none");
	    },
	    openhelpBox: function () {
	        $('.light_box').css('display', 'block');
	        var $helpContent=$(".help_content");
	        var width=parseInt($helpContent.css("width"));
	        var left=(tip.w-width)/2+"px";
	        $helpContent.css({"left":left});
	        $helpContent.css("display","block");
	        $('.tip_wrap_out').hide();
	        $(".refresh_btn").hide();
	        $(".refresh_time").hide();
	    },
	    closehelpBox: function () {
	        $('.light_box').css('display', 'none');
	        $(".help_content").css("display","none");
	    },
	    //拖动Svg
	    mcdragSvg: function(ev) {
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
	    mcScaleSvg: function(ev) {
	        var self = this;
	        var scale;
	        var initScale = 1;
	        var center = ev.center; //{x:..,y:..}

	        if (ev.type == 'pinchstart') {
	            initScale = self.transform.scale || 1;
	        }

	        // $('#transform').html(self.svgOffset.left + ',' + self.svgOffset.top);
	        self.realCenter = {
	            'x': Number(center.x) - Number(self.svgOffset.left),
	            'y': Number(center.y) - Number(self.svgOffset.top)
	        };

	        // self.realCenter = {
	        //     'x': Number(center.x),
	        //     'y': Number(center.y)
	        // }

	        var tmpscale = ev.scale;
	        tip.curScale = tmpscale;

	        tmpscale = tmpscale > 2 ? 2 : tmpscale;
	        tmpscale = tmpscale < 0.5 ? 0.5 : tmpscale;

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
	    handleUpdate: function() {
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
	    handleReset: function() {
	        var self = this;
	        self.transform.translate.x = 0;
	        self.transform.translate.y = 0;
	        self.transform.scale = 1;

	        self.handleUpdate();
	    },
	    //svg更新
	    svgUpdate: function(ev) {
	        var svg_g = $("#svg-g"),
	            $svg_body = $('#subwaySvgBody'),
	            svg_g_offset = svg_g.offset(),
	            svg_g_l = svg_g_offset.left,
	            svg_g_t = svg_g_offset.top,
	            svg_g_w = svg_g_offset.width,
	            svg_g_h = svg_g_offset.height;

	        var canUpdate = true;
	        if (svg_g_w > DrwMain.w) {
	            if (Number(svg_g_l) > Number(DrwMain.w) / 2 || Math.abs(Number(svg_g_l)) > (Number(svg_g_w - Number(DrwMain.w) / 2))) {
	                canUpdate = false;
	            }
	        } else {
	            if (svg_g_l + svg_g_w / 2 < 0 || svg_g_l + svg_g_w / 2 > DrwMain.w) {
	                canUpdate = false;
	            }
	        }
	        if (svg_g_h > DrwMain.h) {
	            if (Number(svg_g_t) > Number(DrwMain.h) / 2 || Math.abs(Number(svg_g_t)) > (Number(svg_g_h - Number(DrwMain.h) / 2))) {
	                canUpdate = false;
	            }
	        } else {
	            if (svg_g_t + svg_g_h / 2 < 0 || svg_g_t + svg_g_h / 2 > DrwMain.h) {
	                canUpdate = false;
	            }
	        }

	        if (canUpdate) {
	            // var transform_arr = svg_g.attr("transform").match(/(-?\d+(\.\d+)?)/g),
	            //     translate_x = Number(transform_arr[0]),
	            //     translate_y = Number(transform_arr[1]),
	            //     curscale = transform_arr[2];

	            // self.transformState.translate.x = self.transform.translate.x;
	            // self.transformState.translate.y = self.transform.translate.y;

	            var newTranslate_x = tip.transformState.translate.x + ev.deltaX,
	                newTranslate_y = tip.transformState.translate.y + ev.deltaY,
	                curscale = tip.transformState.scale;



	            if (newTranslate_x && newTranslate_y) {
	                // $svg_body.css({
	                //     "-webkit-transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + curscale + ")",
	                //     "transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + curscale + ")"
	                // });
	                // $('#transform').html(newTranslate_x + ',' + newTranslate_y);
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

	        setTimeout(function() {
	            tip.touchStatus = null;
	        }, 100);
	    },
	    //svg缩放更新
	    scaleSvgUpdate: function(scale, nav) {
	        var self = this;

	        enableGesture = true;

	        var svg_g = $("#svg-g");
	        var $svg_body = $("#subwaySvgBody"),
	            translate_x = self.transformState.translate.x,
	            translate_y = self.transformState.translate.y,
	            curscale = self.transformState.scale;

	        tip.allScale = tip.allScale * scale;

	        var newscale = scale * curscale;
	        if (newscale > 1.3) {
	            newscale = 1.3;
	            tip.allScale = 1.3;
	        }
	        if (newscale < 0.3) {
	            newscale = 0.3;
	            tip.allScale = 0.3;
	        }
	        scale = newscale / curscale;

	        var origin_x = tip.realCenter.x,
	            origin_y = tip.realCenter.y;

	        if (nav) {
	            origin_x = $(window).width() / 2;
	            origin_y = $(window).height() / 2;
	        } else {
	            // if (drwSw.specailPhone) {
	            //     origin_x = tip.transformOrigin.x,
	            //         origin_y = tip.transformOrigin.y;
	            // }
	        }


	        var moveX = (Number(scale) - 1) * (Number(origin_x) - Number(translate_x)),
	            moveY = (Number(scale) - 1) * (Number(origin_y) - Number(translate_y));

	        // $('#transformOrigin').html(tip.transformOrigin.x + ',' + tip.transformOrigin.y);

	        var newTranslate_x = translate_x - moveX,
	            newTranslate_y = translate_y - moveY;
	        if (newTranslate_x && newTranslate_y) {
	            // $svg_body.css({
	            //     "-webkit-transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + newscale + ")",
	            //     "transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + newscale + ")"
	            // });
	            svg_g.attr("transform", "translate(" + newTranslate_x + "," + newTranslate_y + ") scale(" + newscale + ")");

	            self.transformState.translate.x = newTranslate_x;
	            self.transformState.translate.y = newTranslate_y;
	            self.transformState.scale = newscale;
	        }

	        tip.handleReset();
	        tip.updateTip();
	        tip.updateNear();
	        tip.updateMarker();
	        setTimeout(function() {
	            tip.touchStatus = null;
	        }, 100);

	        setTimeout(function() {
	            enableGesture = false;
	        }, 100);

	    },

	    //获取缩放中心
	    getScaleCenter: function(xy1, xy2) {
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
	    closeNearTip: function() {
	        var self = this;
	        var obj = $(".tip-content");
	        if (DrwMain.isNearTip) {
	            if (obj.hasClass('open')) {
	                obj.css("display", "none").removeClass("open");
	            }
	        }
	    },
	    //加载信息数据
	    loadinfo: function(lineId, StationId) {
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
	        console.log(current_station);
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
	                    infowHtml.push("<label class=\"line-label\">" + self.lines[lineid].ln + line_sub_name +"</label>");
	                    infowHtml.push("<label class='line-sub-label'></label>");
	                    infowHtml.push("<ul class=\"time-item-main\">");
	                    for (var j = 0; j < 2; j++) {
	                        if (current_station[lineid][j]) {
	                            var first_time = current_station[lineid][j].ft;
	                            var last_time = current_station[lineid][j].lt;
	                            var direction = self.stations[current_station[lineid][j].n];
	                            if (first_time.split(':')[0] != '--' || last_time.split(':')[0] != '--') {
	                                infowHtml.push("<li class=\"time-item-detail\">");
	                                infowHtml.push("<div class=\"train-direct fl\"><span class=\"direct-name\">" + direction.n + "</span><label class=\"direct-label\">方向</label></div>"); //下一站名，表示方向
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
	            //for(var k in self.tempTrafficinfo.stInfo){
	            //    if(self.tempTrafficinfo.stInfo[k].timeInside==true){
	            //        $("#tip_detail_error").html("由于现在客流量较大，现在该站采取限流措施。")
	            //    }
	            //}
	        }

	        $("#tip_content").html(infowHtml.join(""));
	    },
	    //打开Tip弹窗
	    openTip: function(obj) {
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
	                station_lon = obj.attr("station_lon"),/*经度*/
	                station_lat = obj.attr("station_lat"),/*纬度*/
	                station_id = obj.attr("station_id");

	            var line_id=obj.attr("line_id").toString();

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
	            var Top0ffset=self.topOffset(0.4);
	            tip.transformState.translate.y = tip.transformState.translate.y + Top0ffset;
	        }
	    },
	    topOffset: function (offset) {
	        var topBar=parseInt($(".top_bar").css("height"))/2,
	            $tipBodyHeight = $('.tip_body').css("height"),
	            bodyHeight = parseInt($tipBodyHeight)*offset;
	        return bodyHeight+topBar
	    },
	    //设置弹窗的位置属性
	    setTipPos: function(obj) {
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
	    closeTip: function(status) {
	        $('.tip_wrap_out').hide();
	        if (!status) {
	            tip.opentip = false;
	        }
	        $('.light_box').css('display', 'none');
	        window.location.hash = '#city=' + SW.cache.curCity.adcode;
	    },
	    //设置中心信息
	    setCenter: function(center) {
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

	        var moveX = center_x - screen_w *0.5,
	            moveY = center_y - screen_h *0.5;

	        translate_x = translate_x - moveX;
	        translate_y = translate_y - moveY;

	        svg_g.attr("transform", "translate(" + translate_x + "," + translate_y + ") scale(" + scale + ")");

	        tip.transformState.translate.x = translate_x;
	        tip.transformState.translate.y = translate_y;

	        //选取偏移量
	        var Top0ffset=self.topOffset(0.4);

	        var $overlays = $('.overlays');
	        var oldLeft = parseInt($overlays.css('left')) || 0,
	            oldTop = parseInt($overlays.css('top')) || 0;
	        var newLeft = Number(oldLeft) - Number(moveX),
	            newTop = Number(oldTop) - Number(moveY)+Top0ffset;
	        $overlays.css({
	            left: newLeft + 'px',
	            top: newTop + 'px'
	        });
	    },
	    //打开路线选择器
	    openFilter: function() {
	        $('.light_box, .filter_content').css('display', 'block');
	        //线路选择器不能与弹窗同时存在
	        $('.tip_wrap_out').hide();
	        tip.stoprefresh();
	    },
	    //关闭路线选择器
	    closeFilter: function() {
	        $('.light_box, .filter_content').css('display', 'none');
	        $(".refresh_btn").show();
	        $(".refresh_box").show();
	        $(".refresh_time").show();
	    },
	    //设置合适的屏幕视图大小
	    setFitview: function(obj) {
	        var self = this;
	        self.scaleSvgUpdate(1 / self.transformState.scale, true);
	        var obj_width = obj.width(),
	            obj_height = obj.height();
	        var topbar_height = SW.cache.param && SW.cache.param.src == 'alipay' ? 0 : $('.top_bar').height(),
	            bottombar_height = $('.route_bar').height();
	        var full_width = $(window).width(),
	            full_height = $(window).height() - topbar_height - bottombar_height;
	        var w_rate = full_width / obj_width,
	            h_rate = full_height / obj_height,
	            scale = 1;
	        if (w_rate < 1 || h_rate < 1) {
	            scale = w_rate < h_rate ? (w_rate - 0.05) : (h_rate - 0.06);
	            self.scaleSvgUpdate(scale, true);
	        }
	    },
	    //显示过滤后的地铁线
	    showFilterLine: function(id) {
	        $('#g-select').remove();
	        $('#g-bg').css('display', 'block');
	        drwSw.drawSelectLine(SW.cache.lines[id], 'select');
	    },
	    //获取选择后的中心
	    getFilterCenter: function() {
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
	    cityChange: function() {
	        $('#subway').hide();
	        tip.creatCitylist();
	        tip.showCitylist();
	    },
	    //创建城市列表
	    creatCitylist: function() {
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
	    initCity: function() {
	        tip.allScale = 1;
	    },
	    //显示城市列表
	    showCitylist: function() {
	        $('#citypage').show();
	    },
	    //隐藏城市列表
	    hideCitylist: function() {
	        $('#citypage').hide();
	    },

	    //获得对象中心位置
	    getStCenter: function(obj) {
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
	    clearMarker: function(type) {
	        var self = this;
	        if (type) {
	            var marker = $('#nav_' + type).find('.marker-out');
	            if (marker.length > 0) {
	                marker.remove();
	            }
	        }
	    },
	    //更新标记
	    updateMarker: function() {
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
	    updateStartEnd: function(id, type) {
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
	    updateTip: function() {
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
	    updateNear: function() {
	        var self = this;
	        if (DrwMain.nearId) {
	            var obj = $('#near-' + DrwMain.nearId);

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
	    formatTime: function(le) {
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
	    unableFlite: function() {
	        $('.filter_btn').css({
	            'z-index': '10'
	        })
	    },
	    ableFilte: function() {
	        $('.filter_btn').css({
	            'z-index': '20'
	        })
	    },
	    clearRouteIpt: function(type) {
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
	    }
	};

/***/ }
/******/ ]);