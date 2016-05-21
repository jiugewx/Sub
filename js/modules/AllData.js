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
