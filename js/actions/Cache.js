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