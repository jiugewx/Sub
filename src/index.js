/**
 * Created by Wangxin on 2016/5/18.
 */

'use strict';/*使用严格模式*/
/*加载样式*/
require("./css/style.css");

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

var SW=require("./js/modules/SW");
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

