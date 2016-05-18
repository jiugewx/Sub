/**
 * Created by xinye on 16/5/18.
 */


var Cache = require("./Cache");
var drwSw = {
    statusColor: SW.statusColor,
    defaultColor: SW.statusColor[0].color,
    timer: {},
    currLines: {},
    trafficInfo: Cache.trafficInfo,
    stations: Cache.stations,
    convertData: Cache.convertData,
    stationsInfo: Cache.stationsInfo, /*几个数据接口*/
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight,
    t_top: 0,
    t_left: 0,
    moveX: 0,
    moveY: 0,
    font_size: 12,
    nearHightLight: 14,
    isNearTip: false,
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
    sortline: null,
    ns_svg: "http://www.w3.org/2000/svg",
    nearId: null,
    svgReady: false,
    svgOffset: {
        left: 0,
        top: 0
    }
};

module.exports=drwSw;