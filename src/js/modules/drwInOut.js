/**
 * Created by Wangxin on 2016/5/30. 这里是预留功能
 */

require("./amapCache");
var AllData=require("./AllData");
var tip=require("./tip");

var DrwInOut = {
    //请求交通状况信息
    loadInOut: function (stationName){
        var self=this;
        AllData.loadStatus.InOut = 0;
        var limitTraffic_Url="http://223.72.210.20:8388/PublicTripProvide/LoadAfcZdjckDataJson?ask=t8ai8t4s3acb1ce&statname="+stationName;
        amapCache.loadData(limitTraffic_Url, function(InOutData) {
            //编译最原始的limitTraffic
            //console.log(limitTraffic);
            AllData.InOutRefreshTime="";
            var len=InOutData.zdxlList.length;
            for(var j in AllData.cache.stations){
                //先清空，再遍历！



            }
            //显示为publishTime
            var publishTime=[];
            publishTime[0]=InOutData.publishTime.slice(0,4);
            publishTime[1]=InOutData.publishTime.slice(4,6);
            publishTime[2]=InOutData.publishTime.slice(6,8);
            publishTime[3]=InOutData.publishTime.slice(8,10);
            publishTime[4]=InOutData.publishTime.slice(10,12);
            publishTime[5]=InOutData.publishTime.slice(12,14);
            var pubTime=publishTime[0]+"-"+publishTime[1]+"-"+publishTime[2]+' '+publishTime[3]+":"+publishTime[4]+":"+publishTime[5];
            AllData.loadStatus.InOut=1;
            console.log("限流信息请求成功!");
            AllData.InOutRefreshTime = self.formatlimitTime(pubTime);
            //console.log(AllData.limitRefreshTime);
            //console.log(AllData.cache.stations);
        },function() {
            AllData.loadStatus.InOut=2;
            alert("限流信息未加载！");
        });
    },
    formatlimitTime:function(dateTime){
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
        var TrafficTempTime = dateTime.split(" ")[1].toString().substr(0, 5);

        //判断哪一天
        var isToday2;
        if (difference < 86400000 && difference >= 0) {
            isToday2 = "今天"+TrafficTempTime;
        }
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
        return result;
    }
};

module.exports=DrwInOut;
