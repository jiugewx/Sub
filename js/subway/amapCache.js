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
            timeout: 3000,
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