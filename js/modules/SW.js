/**
 * Created by Wangxin on 2016/5/19.
 */

require("./amapCache");
var $=require("../lib/zepto");
var AllData=require("./AllData");
var drwSw=require("./drwMain");
var tip=require("./tip");
var DrwTraf=require("./drwtraffic");
var bindEv=require("./bindEvent");
var FastClick = require('./fastclick');

/**fastclick.js在commonJs规范中的引用方式
 * var FastClick = require('fastclick');
 * FastClick.attach(document.body);
 * */

//定义SW，数据预处理
var SW = {
    //数据初始化!
    swInit: function() {
        var self = this;
        FastClick.attach(document.body);
        //调用缓存工具中的初始化方法
        amapCache.init({
            complete: function() {
                self.initCity(); //根据缓存加载相应城市
                bindEv.init(); //初始化事件绑定信息
                tip.loadingOver();//加载完成
            }
        });
    },
    //初始化城市信息
    initCity: function() {
        var self = this;
        //如果有adcode那就展示城市
        self.showCity();
        // 通过监听hashchange事件来更改城市
        $(window).on('hashchange', function() {
            self.showCity();
        });
    },
    //显示城市：获取hash值，依据hash值匹配对应城市信息，
    showCity: function() {
        var self = this,
            cache = AllData.cache;
        var hash = decodeURIComponent(window.location.hash).replace(/^\#/, '');
        //decodeURIComponent 对 encodeURIComponent() 函数编码的 URI 进行解码。replace(/^\#/, '')，把#号给去除了。
        var param = self.param2json(hash);
        //self.param2json(hash)就是将hash转为json对象，"city=1100"字符串转换为了object的格式，｛"city":"1100"｝
        if (!param || !param.src || param.src && param.src != 'alipay') {
            $('#subway, #citypage').addClass('msubway');
        }
        //如果param不存在，那就打开城市选择列表。
        if (!param) {
            AllData.subwayFlag = 0;
            return tip.cityChange();
        }
        AllData.param = param;
        //取adcode为param中city的值。
        var adcode = param.city && param.city.substr(0, 4);
        //var adcode = "1100";

        //如果城市代码存在，那就判断文件中是否存有对应的地铁图
        if (adcode != '') {
            if (!AllData.fileNameData[adcode]) {
                // 该城市没有对应地铁图,那就打开cityChange的列表
                AllData.subwayFlag = 0;
                return tip.cityChange();
            } else {
                // 该城市有对应地铁图,那就显示#subway
                AllData.subwayFlag = 1;
                $('#subway').show()
            }
        }
        //如果城市代码不存在
        else {
            AllData.subwayFlag = 0;
            return tip.cityChange();
        }

        $('.city_name').html(AllData.cityname[adcode]);
        //改变网页的标题
        document.title = AllData.cityname[adcode] + '地铁图';

        // 此城市代码与当前城市的代码不一致，即发生了变化，tip.hideCitylist();
        if (adcode != cache.curCity.adcode) {
            $("#subway-svg,#infowindow-content,#tip-content,.line-caption").remove();
            drwSw.svgReady = false;
            //开启加载对应城市的数据
            tip.loading();
            $(".filter_btn").hide();
            self.loadData(adcode, function (drwData) {
                //这里的drwData是loadData方法中callback的参数。这个参数在loadData中被定义。
                tip.loadingOver();
                //绘制对应城市的地铁
                drwSw.draw(drwData, param);
            });
        } else {
            //显示车站
            SW.showStation(param);
        }
    },
    //显示城市的地铁站
    showStation: function (param) {
        var stationId = param.station;
        if(stationId){
            var station = AllData.cache.stations[stationId] || AllData.cache.stationspoi[stationId];
            var sid = 'st-' + station.si;
            var obj = $('#' + sid);
            if (drwSw.isNearTip) {
                drwSw.clearNearTip();
            }
            tip.openTip(obj);
            var center = tip.getStCenter(obj);
            tip.setCenter(center);
        }
    },
    //加载数据
    loadData: function(adcode, callback) {
        var self = this,
            cache = AllData.cache;
        var city_code = adcode;
        // var city_name = cache.citylistByAdcode[adcode].spell;
        var city_name = AllData.fileNameData[adcode];
        //如果对应的城市信息已经存在,那就直接调用callback.
        if (cache.cities[city_code]) {
            cache.curCity.adcode = city_code;
            cache.curCity.name = cache.cities[city_code].name;
            cache.curCity.offset = cache.offset[city_code];
            callback(cache.cities[city_code]);
        }
        //如果对应的城市信息不存在,那就发起请求
        else {
            //从服务器请求数据
            self.loadStInfo(city_code,city_name);
            DrwTraf.loadTraffic(city_code,city_name);
            self.loadMainData(city_code,city_name,callback);
            //self.loadTempTraffic();
        }
    },
    //这里是请求对应城市的地铁数据
    loadMainData: function (city_code,city_name,callback) {
        AllData.loadStatus.currLinesInfo=0;
        var self = this;
        var drwData_Url = "data/" + city_code + "_drw_" + city_name + ".json";
        amapCache.loadData(drwData_Url, function(loaddata) {
                //-------------JSON编译功能-------------
                //console.log("原始数据请求成功!",data);
                //给2秒钟的延迟去加载路况信息
                //self.loadConvert(city_code,city_name);
                //setTimeout(function () {
                //	SW.Traffic2JSON(loaddata);/*drwData增加st2st信息的开关*/
                //},2000);
                //————————————JSON编译结束——————————
                self.buildCurLinesData(city_code,loaddata);
                AllData.loadStatus.currLinesInfo=1,
                callback(AllData.cache.cities[city_code]);
            },
            function() {
                AllData.loadStatus.currLinesInfo=2;
                alert('城市地铁数据加载失败！');
                AllData.subwayFlag = 0;
                //tip.cityChange();
            });
    },
    //初步编译地铁的基础信息
    buildCurLinesData: function (city_code,data) {
        var self=this;
        var cache = AllData.cache;
        cache.sug[city_code] = {};
        cache.dataForDrw[data.i] = data;
        cache.cities[data.i] = cache.cities[data.i] || {};
        cache.cities[data.i].name = data.s;
        cache.cities[data.i].id = data.i;
        cache.cities[data.i].offset = data.o;
        cache.cities[data.i].lines = [];
        cache.cities[data.i].linesNamePos = {};
        // cache.cities[data.i].stations = [];
        cache.cities[data.i].stations = {};
        cache.cities[data.i].zolines = {};
        cache.cities[data.i].zostations = [];
        //data.o其实是人为的设定的一个地图中心，其他的数据就以这个做出偏移。
        var _offset = data.o.split(',');
        cache.offset[data.i] = cache.offset[data.i] || {};
        var _x = 0,
            _y = 0;
        cache.offset[data.i].x = _offset[0];
        cache.offset[data.i].y = _offset[1];
        //相对于（1000，1000）做偏移。
        _x = 1000 - Number(_offset[0]);
        _y = 1000 - Number(_offset[1]);
        var sugobj = {};
        //遍历每条地铁线
        for (var i = 0; i < data.l.length; i++) {
            //修改了地铁path的偏移
            if (data.l[i].su == '1') {
                //使path数据按照x,y数据偏移
                var _coords = data.l[i].c;
                for (var q = 0; q < _coords.length; q++) {
                    var _c = _coords[q].split(' ');
                    _coords[q] = (Number(_c[0]) + _x) + ' ' + (Number(_c[1]) + _y);
                }
                data.l[i].c = _coords;
                data.l[i].linesNamePos = {};
                data.l[i].linesNamePos[data.l[i].ls] = data.l[i].lp;
                data.l[i].stname = [];
                //遍历每天地铁线里的地铁站
                for (var j = 0; j < data.l[i].st.length; j++) {

                    data.l[i].stname.push(data.l[i].st[j].n);

                    //使站点中(data.l[i].st)的信息按照x,y数据偏移
                    var _p = data.l[i].st[j].p.split(' ');
                    data.l[i].st[j].p = (Number(_p[0]) + _x) + ' ' + (Number(_p[1]) + _y);
                    var rsArr = data.l[i].st[j].rs.split('|');
                    var newRsArr = [];
                    for (var h = 0; h < rsArr.length; h++) {
                        var rs = rsArr[h].split(' ');
                        newRsArr.push((Number(rs[0]) + _x) + ' ' + (Number(rs[1]) + _y))
                    }
                    data.l[i].st[j].rs = newRsArr.join('|');

                    //当该地铁站属于开通状态时,将该地铁站信息缓存进stations
                    if (data.l[i].st[j].su == '1') {
                        var cur = data.l[i].st[j];
                        // cache.cities[data.i].stations.push(cur);
                        cache.cities[data.i].stations[cur.si] = cur;
                        cache.cities[data.i].stations[cur.si].cl = data.l[i].cl;
                        cache.stations[cur.si] = cur;
                        cache.stations[cur.si].cl = data.l[i].cl;
                        sugobj[cur.sp.split(' ').join('').toLowerCase() + '|' + cur.n.toLowerCase()] = cur;
                        cache.stationspoi[cur.poiid] = cur;
                        cache.navStations[cur.n] = cur;
                        cache.navStPixel[cur.p] = cur;
                    }
                }
                //使lp也发生偏移
                var _lpo = data.l[i].lp;
                if (_lpo) {
                    for (var s = 0; s < _lpo.length; s++) {
                        var _lp = _lpo[s].split(' ');
                        _lpo[s] = (Number(_lp[0]) + _x) + ' ' + (Number(_lp[1]) + _y);
                    }
                    data.l[i].lp = _lpo;
                }
                //使_st2st的path偏移;
                var _st2st = data.l[i].st2st;
                for (var k in _st2st) {
                    //_st2st的path偏移;
                    var _st2stpath = _st2st[k].path;
                    for (var m in _st2stpath) {
                        var _st2stpathPos = _st2stpath[m].split(' ');
                        _st2stpath[m] = (Number(_st2stpathPos[0]) + _x) + ' ' + (Number(_st2stpathPos[1]) + _y)
                    }
                    //_st2st的startPos偏移;
                    var _startPos = _st2st[k].startPos.split(" ");
                    _st2st[k].startPos = (Number(_startPos[0]) + _x) + ' ' + (Number(_startPos[1]) + _y);
                    //	_st2st的endPos偏移;
                    var _endPos = _st2st[k].endPos.split(" ");
                    _st2st[k].endPos = (Number(_endPos[0]) + _x) + ' ' + (Number(_endPos[1]) + _y);
                    //	_st2st的directionPos偏移;
                    _st2st[k].directionPos = _st2st[k].startPos + "-to-" + _st2st[k].endPos;
                }

                cache.cities[data.i].linesNamePos[data.l[i].ls] = data.l[i].lp;
                cache.cities[data.i].lines.push(data.l[i]);
                cache.lines[data.l[i].ls] = data.l[i]; //写入line

                var busid = data.l[i].li && data.l[i].li.split('|');
                if (busid) {
                    for (var n = 0; n < busid.length; n++) {
                        cache.navlines[busid[n]] = data.l[i]

                    }
                }
            }

        }
        // self.toCache(data, info_data);
        cache.sug[city_code] = sugobj;
        cache.curCity.adcode = city_code;
        cache.curCity.name = cache.cities[city_code].name;
        cache.curCity.offset = cache.offset[city_code];
        var drwData = cache.cities[city_code];
        console.log("纯地铁信息编译完成!");
        //console.log(drwData);
    },
    //请求站点首末班车信息
    loadStInfo: function (city_code,city_name){
        var infoData_Url = "data/" + city_code + "_info_" + city_name + ".json";
        amapCache.loadData(infoData_Url, function(info_data) {
            for (var k = 0; k < info_data.l.length; k++) {
                for (var l = 0; l < info_data.l[k].st.length; l++) {
                    AllData.cache.stationsInfo[info_data.l[k].st[l].si] = info_data.l[k].st[l];
                }
            }
            console.log("站点首末车时间请求完成!");
        },function() {
            alert('地铁站点数据加载失败！');
        });
    },
    // 请求数据查询转换接口
    loadConvert: function (city_code,city_name) {
        var self=this;
        var trafficData_Url="data/" + city_code + "_conv_" + city_name + ".json";
        amapCache.loadData(trafficData_Url, function(convertData) {
            //遍历数据，缓存所有的路况信息到trafficInfo！
            var len=convertData.length;
            for(var i=0;i<len;i++){
                self.cache.convertData[i]=convertData[i];
            }
            console.log("数据转换接口请求成功！")
        },function() {
            alert('数据转换表加载出错！');
        });
    },
    /*给初始化的drwData增加st2st信息的开关,之后打印成JSON文本*/
    Traffic2JSON: function (drwData) {
        /*依赖self.cache.convertData,self.cache.trafficInfo,self.cache.stations;
         要在buildCurLinesData()之前运行,所以要先加载loadTraffic(),再loadMainData(),阻塞buildCurLinesData*/
        var self = this;
        var current_City_lines=drwData.l /*|| drwData.lines*/;
        //加入站点名称
        for (var line_id in current_City_lines) {
            //console.log(current_City_lines[line_id]);
            for (var i in AllData.cache.convertData) {
                if (AllData.cache.convertData[i].line_id == current_City_lines[line_id].ls) {
                    /*已经选择了一条地铁*/
                    var length=AllData.cache.convertData[i].stations.length;
                    //遍历转换器中的stations
                    for (var j = 0; j < length; j++) {
                        var acc = AllData.cache.convertData[i].stations[j].Acc;
                        /*已经选中了单个车站*/
                        var name = AllData.cache.convertData[i].stations[j].Name;
                        var current_drwData = current_City_lines[line_id];
                        var st = current_drwData.st;
                        var dataset_line_arr = current_drwData.c;
                        //以下获取start信息
                        for (var k in AllData.cache.trafficInfo) {
                            /*去遍历所有的路段信息*/
                            if (AllData.cache.trafficInfo[k].startAcc == acc) {
                                /*查到当前站点为起点的路段*/
                                AllData.cache.trafficInfo[k].startName = name;
                                AllData.cache.trafficInfo[k].reflineId = current_drwData.ls;
                                AllData.cache.trafficInfo[k].reflineName = current_drwData.ln;
                                for (var x in st) {
                                    //当drw信息中的station的名字与traffic信息中的名字匹配时
                                    if (st[x].n == name) {
                                        AllData.cache.trafficInfo[k].startPos = st[x].p;
                                    }
                                }
                                if (!(AllData.cache.trafficInfo[k].hasOwnProperty("startPos"))) {
                                    //AllData.cache.trafficInfo[k].startPos = AllData.cache.trafficInfo[k - 1].startPos;
                                    console.log(AllData.cache.trafficInfo[k], k)
                                }
                                var startPos = AllData.cache.trafficInfo[k].startPos;
                                for (var y in dataset_line_arr) {
                                    if (dataset_line_arr[y] == startPos) {
                                        AllData.cache.trafficInfo[k].startIndex = y;
                                    }
                                }
                            }
                        }
                        //获取end信息
                        for (var k in AllData.cache.trafficInfo) {
                            if (AllData.cache.trafficInfo[k].endAcc == acc) {
                                /*查到当前站点为起点的路段*/
                                AllData.cache.trafficInfo[k].endName = name;
                                for (var x in st) {
                                    if (st[x].n == name) {
                                        AllData.cache.trafficInfo[k].endPos = st[x].p;
                                    }
                                }
                                var endPos = AllData.cache.trafficInfo[k].endPos;
                                //
                                if (!(AllData.cache.trafficInfo[k].hasOwnProperty("endPos"))) {
                                    //AllData.cache.trafficInfo[k].endPos = AllData.cache.trafficInfo[k - 1].endPos;
                                    console.log(AllData.cache.trafficInfo[k], k)
                                }
                                for (var y in dataset_line_arr) {
                                    if (dataset_line_arr[y] == endPos) {
                                        AllData.cache.trafficInfo[k].endIndex = y;
                                    }
                                }
                            }
                        }
                        //修正环线的的首尾连接问题
                        for (var k in AllData.cache.trafficInfo) {
                            if (AllData.cache.trafficInfo[k].endIndex - AllData.cache.trafficInfo[k].startIndex> 30) {
                                AllData.cache.trafficInfo[k].endIndex = 0;
                            }else if(AllData.cache.trafficInfo[k].startIndex - AllData.cache.trafficInfo[k].endIndex> 30){
                                AllData.cache.trafficInfo[k].startIndex = 0;
                            }
                            AllData.cache.trafficInfo[k].direction = AllData.cache.trafficInfo[k].startName+"-to-"+self.cache.trafficInfo[k].endName;
                        }
                        //增加path和color、direct
                        for (var k in AllData.cache.trafficInfo) {
                            var loadRate=self.cache.trafficInfo[k].loadRate;
                            var color={};
                            //增加path
                            if (AllData.cache.trafficInfo[k].reflineId == current_drwData.ls) {
                                var start = Number(AllData.cache.trafficInfo[k].startIndex);
                                var end = Number(AllData.cache.trafficInfo[k].endIndex);
                                if (start < end) {
                                    AllData.cache.trafficInfo[k].path = dataset_line_arr.slice(start, end + 1);
                                    AllData.cache.trafficInfo[k].ref_direct = "right";
                                } else {
                                    AllData.cache.trafficInfo[k].path = dataset_line_arr.slice(end, start + 1);
                                    AllData.cache.trafficInfo[k].ref_direct = "left";
                                }
                            }
                            //增加color
                            if (loadRate >= 0 && loadRate <= 0.6) {
                                color = "00cc33";
                            } else if (loadRate > 0.6 && loadRate <= 0.9) {
                                color = "EFEA3A";
                            } else if (loadRate > 0.9 && loadRate <= 1.1) {
                                color = "E71F1A";
                            } else if (loadRate > 1.1){
                                color = "1D1D1D";
                            } else {
                                color = "CCCCCC";
                            }
                            AllData.cache.trafficInfo[k].color = color;
                        }
                    }
                }
            }
        }
        console.log("路况信息整理完毕！");
        //console.log("trafficInfo",AllData.cache.trafficInfo);
        //整理信息,增加st2st信息!
        for(var i in current_City_lines){
            var current_drwData = current_City_lines[i];
            //console.log("current_drwData",current_drwData);
            var obj={};
            obj.lineId=current_drwData.ls;
            obj.lineName=current_drwData.ln;
            obj.sections=[];
            //console.log(AllData.cache.trafficInfo);
            for(var k in AllData.cache.trafficInfo){
                if(current_drwData.ls==AllData.cache.trafficInfo[k].reflineId){
                    var section={};
                    section.directionAcc="Acc"+AllData.cache.trafficInfo[k].startAcc+"_"+AllData.cache.trafficInfo[k].endAcc;
                    section.directionPos=AllData.cache.trafficInfo[k].startPos+"-to-"+AllData.cache.trafficInfo[k].endPos;
                    section.directionName=AllData.cache.trafficInfo[k].direction;
                    section.startPos=AllData.cache.trafficInfo[k].startPos;
                    section.startName=AllData.cache.trafficInfo[k].startName;
                    section.endPos=AllData.cache.trafficInfo[k].endPos;
                    section.endName=AllData.cache.trafficInfo[k].endName;
                    section.reflineId=AllData.cache.trafficInfo[k].reflineId;
                    section.reflineName=AllData.cache.trafficInfo[k].reflineName;
                    section.path=AllData.cache.trafficInfo[k].path;
                    section.ref_direct=AllData.cache.trafficInfo[k].ref_direct;
                    obj.sections.push(section);
                }
            }
            //console.log(obj);
            current_drwData.st2st=obj.sections;
            //console.log(current_drwData);
            AllData.cache.trafficNew.push(current_drwData);
        }
        console.log("新的画图数据drwData整理完毕！");
        //console.log("trafficNew",AllData.cache.trafficNew);
        //转json!
        console.log("正在转译成Json...");
        console.log(JSON.stringify(AllData.cache.trafficNew));
    },
    //请求临时交通限流信息
    loadTempTraffic: function () {
        var self=this;
        var trafficData_Url="http://223.72.210.20:8388/PublicTripProvide/LoadAfcZdxlDataJson?ask=t8ai8t4s3acb1ce";
        amapCache.loadData(trafficData_Url, function(Temptraffic) {
            //编译最原始的trafficInfo
            //遍历数据，缓存所有的路况信息到trafficInfo！
            //console.log(trafficData);
            var tempInfo=[];
            var len=Temptraffic.zdxlList.length;
            for (var k = 0; k < len; k++) {
                var info={};
                var statCode=Temptraffic.zdxlList[k].statCode;
                info.stationAcc=statCode.slice(3).split("_")[0];
                info.stationName=Temptraffic.zdxlList[k].statName;
                info.endTime=Temptraffic.zdxlList[k].endTime;
                info.lineId=Temptraffic.zdxlList[k].lineId;
                info.startTime=Temptraffic.zdxlList[k].startTime;
                tempInfo.push(info);
                if(self.compTime(info.startTime,info.endTime)==1){
                    info.timeInside=true;
                }else{
                    info.timeInside=false;
                }
            }
            var publishTime=[];
            publishTime[0]=Temptraffic.publishTime.slice(0,4);
            publishTime[1]=Temptraffic.publishTime.slice(4,6);
            publishTime[2]=Temptraffic.publishTime.slice(6,8);
            publishTime[3]=Temptraffic.publishTime.slice(8,10);
            publishTime[4]=Temptraffic.publishTime.slice(10,12);
            publishTime[5]=Temptraffic.publishTime.slice(12,14);
            var pubTime=publishTime[0]+"-"+publishTime[1]+"-"+publishTime[2]+' '+publishTime[3]+":"+publishTime[4]+":"+publishTime[5];
            AllData.cache.tempTrafficinfo.pubTime=self.formatTime(pubTime).trafficTemp;
            AllData.cache.tempTrafficinfo.stInfo=tempInfo;
            AllData.loadStatus.tempTrafficinfo=1;
            console.log("限流管制信息请求完成!");
            //console.log(AllData.cache.tempTrafficinfo);
            //console.log(AllData.cache.stationsInfo);
            //console.log(self.refreshStatus);
        },function() {
            self.loadStatus.tempTrafficinfo=2;
            //self.loadMainData(city_code,city_name,callback);
            //延迟弹窗
            setTimeout(function () {
                alert("限流管制信息加载失败!");
            },1000);
        });
    },
    //地址栏里的参数转为一个json对象
    param2json: function(str) {
        if (!str || str == '') {
            return null
        } else {
            var strArr = str.split('&');
            var json = {};

            if (strArr.length > 0) {
                for (var i = 0; i < strArr.length; i++) {
                    var item = strArr[i].split('=');
                    var key = item[0];
                    var value = item[1];
                    json[key] = value;
                }
            }
            return json
        }
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

module.exports=SW;