/**
 * Created by xinye on 16/5/18.
 */

var Cache=require("./Cache");
var Drw2lines=require("./drwDoublelines");
var DrwMain=require("./drwMain");
var Common=require("./common");
require("./amapCache");

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
