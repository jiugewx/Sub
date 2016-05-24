/**
 * Created by xinye on 16/5/18.
 */

require("./amapCache");
var AllData=require("./AllData");
var drwSw=require("./drwMain");
var Drwlines=require("./drwLines");
var tip=require("./tip");

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
