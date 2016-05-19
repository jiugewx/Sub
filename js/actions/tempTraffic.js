
/**
 * Created by Wangxin on 2016/5/19.
 */
var Cache=require("./Cache");
var Common=require("./common");

var TempTraF={
    tempTrafficinfoStatus:0,
    //请求临时交通限流信息
    loadTempTraffic: function () {
        var self = this;
        var cache = Cache;
        var trafficData_Url = "http://223.72.210.20:8388/PublicTripProvide/LoadAfcZdxlDataJson?ask=t8ai8t4s3acb1ce";
        amapCache.loadData(trafficData_Url, function (Temptraffic) {
            //编译最原始的trafficInfo
            //遍历数据，缓存所有的路况信息到trafficInfo！
            //console.log(trafficData);
            var tempInfo = [];
            var len = Temptraffic.zdxlList.length;
            for (var k = 0; k < len; k++) {
                var info = {};
                var statCode = Temptraffic.zdxlList[k].statCode;
                info.stationAcc = statCode.slice(3).split("_")[0];
                info.stationName = Temptraffic.zdxlList[k].statName;
                info.endTime = Temptraffic.zdxlList[k].endTime;
                info.lineId = Temptraffic.zdxlList[k].lineId;
                info.startTime = Temptraffic.zdxlList[k].startTime;
                tempInfo.push(info);
                if (self.compTime(info.startTime, info.endTime) == 1) {
                    info.timeInside = true;
                } else {
                    info.timeInside = false;
                }
            }
            var publishTime = [];
            publishTime[0] = Temptraffic.publishTime.slice(0, 4);
            publishTime[1] = Temptraffic.publishTime.slice(4, 6);
            publishTime[2] = Temptraffic.publishTime.slice(6, 8);
            publishTime[3] = Temptraffic.publishTime.slice(8, 10);
            publishTime[4] = Temptraffic.publishTime.slice(10, 12);
            publishTime[5] = Temptraffic.publishTime.slice(12, 14);
            var pubTime = publishTime[0] + "-" + publishTime[1] + "-" + publishTime[2] + ' ' + publishTime[3] + ":" + publishTime[4] + ":" + publishTime[5];
            cache.tempTrafficinfo.pubTime = Common.formatTime(pubTime).trafficTemp;
            cache.tempTrafficinfo.stInfo = tempInfo;
            TempTraF.tempTrafficinfoStatus = 1;
            console.log("限流管制信息请求完成!");
            //console.log(self.cache.tempTrafficinfo);
            //console.log(self.cache.stationsInfo);
            //console.log(self.refreshStatus);
        }, function () {
            TempTraF.tempTrafficinfoStatus = 2;
            //self.loadMainData(city_code,city_name,callback);
            //延迟弹窗
            setTimeout(function () {
                alert("限流管制信息加载失败!");
            }, 1000);
        })
    },
    compTime: function (startTime,endTime) {
        var newtime = new Date();
        var newYear = newtime.getFullYear();
        var newMonth = newtime.getMonth() + 1;
        var newData = newtime.getDate();
        var newHours = newtime.getHours();
        var newMinutes = newtime.getMinutes();
        var newSeconds = newtime.getSeconds();

        if(newHours<10){
            newHours="0"+newHours;
        }
        if(newMinutes<10){
            newMinutes="0"+newMinutes;
        }
        if(newSeconds<10){
            newSeconds="0"+newSeconds;
        }
        if(newMonth<10){
            newMonth="0"+newMonth;
        }
        if(newData<10){
            newData="0"+newData;
        }

        var today = newYear + "-" + newMonth + "-" + newData;
        var now =today+newHours + ":" + newMinutes + ":" + newSeconds;
        var _now=newtime.getTime();
        var beginTime =today+" "+startTime;
        var endTime =today+" "+endTime;
        var _endTime=Date.parse(endTime);
        var _beginTime=Date.parse(beginTime);
        var timeInfo="";
        if(_beginTime<_now && _now<_endTime){
            timeInfo=1;
        }else{
            timeInfo=0;
        }
        return timeInfo;
    }
};

module.exports=TempTraF;