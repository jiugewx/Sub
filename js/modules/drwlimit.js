/**
 * Created by Wangxin on 2016/5/30.
 */

require("./amapCache");
var AllData=require("./AllData");
var tip=require("./tip");

var DrwLimit = {
    stations:AllData.cache.stations,
    ns_svg:AllData.ns_svg,
    timer:null,
    //请求交通状况信息
    loadlimit: function (city_code,city_name,callback){
        var self=this;
        AllData.loadStatus.limitTraffic = 0;
        var limitTraffic_Url="http://223.72.210.20:8388/PublicTripProvide/LoadAfcZdxlDataJson?ask=t8ai8t4s3acb1ce";
        amapCache.loadData(limitTraffic_Url, function(limitTraffic) {
            //编译最原始的limitTraffic
            //console.log(limitTraffic);
            AllData.limitRefreshTime="";
            var len=limitTraffic.zdxlList.length;
            for(var j in AllData.cache.stations){
                //先清空，再遍历！
                AllData.cache.stations[j].limit=[];
                AllData.cache.stations[j].inTime=false;
                for (var k = 0; k < len; k++) {
                    var info = {};
                    info.startTime = limitTraffic.zdxlList[k].startTime;
                    info.endTime = limitTraffic.zdxlList[k].endTime;
                    info.lineId=limitTraffic.zdxlList[k].lineId;
                    var stationName=limitTraffic.zdxlList[k].statName;
                    if(AllData.cache.stations[j].n==stationName){
                        var isLimitTime=self.inTime(info.startTime,info.endTime);
                        AllData.cache.stations[j].inTime=isLimitTime;
                        AllData.cache.stations[j].limit.push(info);
                    }
                }
            }
            //显示为publishTime
            var publishTime=[];
            publishTime[0]=limitTraffic.publishTime.slice(0,4);
            publishTime[1]=limitTraffic.publishTime.slice(4,6);
            publishTime[2]=limitTraffic.publishTime.slice(6,8);
            publishTime[3]=limitTraffic.publishTime.slice(8,10);
            publishTime[4]=limitTraffic.publishTime.slice(10,12);
            publishTime[5]=limitTraffic.publishTime.slice(12,14);
            var pubTime=publishTime[0]+"-"+publishTime[1]+"-"+publishTime[2]+' '+publishTime[3]+":"+publishTime[4]+":"+publishTime[5];
            AllData.loadStatus.limitTraffic=1;
            console.log("限流信息请求成功!");
            AllData.limitRefreshTime = self.formatlimitTime(pubTime);
            //console.log(AllData.limitRefreshTime);
            //console.log(AllData.cache.stations);
        },function() {
            AllData.loadStatus.limitTraffic=2;
            alert("限流信息未加载！");
        });
    },
    //限流信息压入画图的主数据库
    addLimit_Info: function () {
        //console.log("请求到了路况信息,开始编译...");
        var city_code = AllData.cache.curCity.adcode;
        var drwData = AllData.cache.cities[city_code];
        for (var line_id in drwData.lines) {
            for (var j in drwData.lines[line_id].st) {
                for (var k in AllData.cache.stations) {
                    if (AllData.cache.stations[k].n== drwData.lines[line_id].st[j].n) {
                        drwData.lines[line_id].st[j].inTime = AllData.cache.stations[k].inTime;
                        drwData.lines[line_id].st[j].limit = AllData.cache.stations[k].limit;
                    }
                }
            }
        }
        console.log("限流信息压入成功！");
    },
    showlimit_info: function (lineId, StationId) {
        var self = this;
        var limitInfo = self.stations[StationId].limit;
        var infowHtml = [];
        if (limitInfo.length>0) {
            //$(".tip_detail_time").html(AllData.limitRefreshTime ? "(" + AllData.limitRefreshTime + ")" : null);
            infowHtml.push("<div class='limit_info'> <p>由于本站在客流高峰时段进站客流较大，为了保障轨道交通运营安全，本站在以下时段采取限制进站措施。</p>");
            for (var i in limitInfo) {
                infowHtml.push(" <span class='limit_info_item'>" + limitInfo[i].startTime + "--" + limitInfo[i].endTime + "</span>");
            }
            infowHtml.push("</div>");
        }
        $(".tip_detail").html(infowHtml.join(""));
    },
    // 绘制地铁站点，并设置站点的属性。
    drwlimitStDefer: function(drwData, status) {
        var self = this;
        if (status == 'normal') {
            clearTimeout(self.timer);
            //开一个定时器，检测画图和限流信息的加载状态
            self.timer = setTimeout(function () {
                if (AllData.loadStatus.limitTraffic == 1 && AllData.loadStatus.currLinesInfo == 1) {
                    //把限流信息压入drwData
                    //console.log(AllData.cache.stations);
                    //self.addLimit_Info();
                    //开始画限流点
                    var svg_g = document.getElementById("svg-g");
                    var st_station_normal = document.getElementById("g-station-name-"+status);
                    var limit_station_g = document.createElementNS(self.ns_svg, 'g');
                    limit_station_g.setAttribute("id", "g-limit-" + status);
                    svg_g.insertBefore(limit_station_g, st_station_normal);
                    self.drwlimitSt(drwData,limit_station_g);

                } else if (AllData.loadStatus.limitTraffic == 2 || AllData.loadStatus.currLinesInfo == 2) {
                    clearTimeout(self.timer);
                } else {
                    console.log("限流信息错误!", "limitTraffic", AllData.loadStatus.limitTraffic, "currLines", AllData.loadStatus.currLinesInfo);
                    self.drwlimitStDefer(drwData, status);
                }
            }, 10)
        }else if (status == 'select') {
            var st_select = document.getElementById("g-station-name-"+status);
            var svg_select = document.getElementById("g-select");
            var limit_station_g = document.createElementNS(self.ns_svg, 'g');
            limit_station_g.setAttribute("id", "g-limit-" + status);
            svg_select.insertBefore(limit_station_g, st_select);
            self.drwlimitSt(drwData,limit_station_g);
        }
    },
    drwlimitSt:function(drwData,ParentNode){
        var self=this;
        var station = drwData.stations || drwData;
        //for(var idx=0;idx<station.length;idx++){
        //var item=station[idx];
        $.each(station, function (idx, item) {
            //如果是可以显示的车站
            if (item.su == "1") {
                //如果在限流时间内,画限流符号
                if (item.inTime) {
                    var subway_circle_g = document.createElementNS(self.ns_svg, 'g');
                    subway_circle_g.setAttribute("id", "g-" + item.si);
                    subway_circle_g.setAttribute("class", "g-station");
                    ParentNode.appendChild(subway_circle_g);
                    var limit_station_icon = document.createElementNS(self.ns_svg, 'image');
                    limit_station_icon.setAttribute("x", parseInt(item.p.split(" ")[0]) - 8);
                    limit_station_icon.setAttribute("y", parseInt(item.p.split(" ")[1]) - 8);
                    limit_station_icon.setAttribute("width", 16);
                    limit_station_icon.setAttribute("height", 16);
                    limit_station_icon.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "./img/subway/traffic_limit.png");
                    subway_circle_g.appendChild(limit_station_icon);

                    var subway_station_out = document.createElementNS(self.ns_svg, 'circle');
                    subway_station_out.setAttribute("id", 'st-' + item.si);
                    subway_station_out.setAttribute("class", 'station_obj');
                    subway_station_out.setAttribute("cx", parseInt(item.p.split(" ")[0]));
                    subway_station_out.setAttribute("cy", parseInt(item.p.split(" ")[1]));
                    subway_station_out.setAttribute("station_id", item.si);
                    subway_station_out.setAttribute("station_name", item.n);
                    subway_station_out.setAttribute("station_poiid", item.poiid);
                    subway_station_out.setAttribute("station_lon", item.sl.split(',')[0]);
                    subway_station_out.setAttribute("station_lat", item.sl.split(',')[1]);
                    subway_station_out.setAttribute("r", 13);
                    subway_station_out.setAttribute("fill", "#FFF");
                    subway_station_out.setAttribute("fill-opacity", "0");
                    subway_circle_g.appendChild(subway_station_out);
                }
            }
        });
        console.log("限流信息已展示！");
    },
    inTime:function(startTime,endTime){
        // 获取当前日期的 秒数
        var newtime = new Date();
        var newYear = newtime.getFullYear();
        var newMonth = newtime.getMonth() + 1;
        var newData = newtime.getDate();
        var today = newYear + "/" + newMonth + "/" + newData;
        /*模拟时间*/
        //startTime="07:00:00";
        //endTime="23:00:00";

        var limitStart = today+" "+startTime;
        var limitend = today+" "+endTime;
        var now=new Date().getTime();
        limitStart=new Date(limitStart).getTime();
        limitend= new Date(limitend).getTime();
        var isInside=false;

        if(limitStart<now && limitend>now){
            isInside=true;
        }else{
            isInside=false;
        }
        return isInside
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

module.exports=DrwLimit;
