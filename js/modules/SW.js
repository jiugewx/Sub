/**
 * Created by Wangxin on 2016/5/19.
 */

require("./amapCache");
var $=require("./zepto");
var AllData=require("./AllData");
var drwSw=require("./drwMain");
var tip=require("./tip");
var DrwTraf=require("./drwtraffic");
var bindEvent=require("./bindEvent");
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
                bindEvent.init(); //初始化事件绑定信息
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
        var param = bindEvent.param2json(hash);
        //self.param2json(hash)就是将hash转为json对象，"city=1100"字符串转换为了object的格式，｛"city":"1100"｝
        if (!param || !param.src || param.src && param.src != 'alipay') {
            $('#subway, #citypage').addClass('msubway');
        }
        //如果param不存在，那就打开城市选择列表。
        if (!param) {
            self.subwayFlag = 0;
            return tip.cityChange();
        }
        self.param = param;
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
            self.subwayFlag = 0;
            return tip.cityChange();
        }

        $('.city_name').html(AllData.cityname[adcode]);
        //改变网页的标题
        document.title = AllData.cityname[adcode] + '地铁图';

        // 此城市代码与当前城市的代码不一致，即发生了变化，tip.hideCitylist();
        if (adcode != cache.curCity.adcode) {
            $("#subway-svg,#infowindow-content,#tip-content,.line-caption").remove();
            AllData.svgReady = false;
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
            if (AllData.isNearTip) {
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
    //请求站点首末班车信息
    loadStInfo: function (city_code,city_name){
        var self=this;
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
    //这里是请求对应城市的地铁数据
    loadMainData: function (city_code,city_name,callback) {
        var self = this;
        AllData.loadStatus.currLinesInfo=0;
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
                AllData.loadStatus.currLinesInfo=1;
                callback(AllData.cache.cities[city_code]);
            },
            function() {
                AllData.loadStatus.currLinesInfo=2;
                alert('城市地铁数据加载失败！');
                self.subwayFlag = 0;
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
    }
};

module.exports=SW;