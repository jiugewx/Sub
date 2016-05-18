/**
 * Created by xinye on 16/5/18.
 */

//定义一个缓存机
var Cache={
    cities:{},
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
};

module.exports=Cache;