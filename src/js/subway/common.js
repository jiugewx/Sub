//定义SW，数据预处理
var SW = {
	status:{
		trafficTemp:0,/*精确到分*/
		trafficLoad:0/*精确到秒*/
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
		'1100': 'beijing',
		/*'3100': 'shanghai',
		'4401': 'guangzhou',
		'4403': 'shenzhen',
		'4201': 'wuhan',
		'1200': 'tianjin',
		'3201': 'nanjing',
		'8100': 'xianggang',
		'5000': 'chongqing',
		'3301': 'hangzhou',
		'2101': 'shenyang',
		'2102': 'dalian',
		'5101': 'chengdu',
		'2201': 'changchun',
		'3205': 'suzhou',
		'4406': 'foshan',
		'5301': 'kunming',
		'6101': 'xian',
		'4101': 'zhengzhou',
		'2301': 'haerbin',
		'4301': 'changsha',
		'3302': 'ningbo',
		'3202': 'wuxi',
		'3702': 'qingdao',
		'3601': 'nanchang'*/
	},
	cityname: {
		'1100': '\u5317\u4eac', //北京,
		/*'3100': '\u4e0a\u6d77', //上海,
		'4401': '\u5e7f\u5dde', //广州,
		'4403': '\u6df1\u5733', //深圳,
		'4201': '\u6b66\u6c49', //武汉,
		'1200': '\u5929\u6d25', //天津,
		'3201': '\u5357\u4eac', //南京,
		'8100': '\u9999\u6e2f', //香港,
		'5000': '\u91cd\u5e86', //重庆,
		'3301': '\u676d\u5dde', //杭州,
		'2101': '\u6c88\u9633', //沈阳,
		'2102': '\u5927\u8fde', //大连,
		'5101': '\u6210\u90fd', //成都,
		'2201': '\u957f\u6625', //长春,
		'3205': '\u82cf\u5dde', //苏州,
		'4406': '\u4f5b\u5c71', //佛山,
		'5301': '\u6606\u660e', //昆明,
		'6101': '\u897f\u5b89', //西安,
		'4101': '\u90d1\u5dde', //郑州,
		'2301': '\u54c8\u5c14\u6ee8', //哈尔滨,
		'4301': '\u957f\u6c99', //长沙
		'3302': '\u5b81\u6ce2', //宁波
		'3202': '\u65e0\u9521', //无锡
		'3702': '\u9752\u5c9b', //青岛
		'3601': '\u5357\u660c' //南昌*/
	},
	cityListData: [
		{
		adcode: '1100',
		spell: 'beijing',
		cityname: '北京'
	}
		/*{
		adcode: '3100',
		spell: 'shanghai',
		cityname: '上海'
	},
		{
		adcode: '4401',
		spell: 'guangzhou',
		cityname: '广州'
	},
		{
		adcode: '4403',
		spell: 'shenzhen',
		cityname: '深圳'
	},
		{
		adcode: '4201',
		spell: 'wuhan',
		cityname: '武汉'
	},
		{
		adcode: '1200',
		spell: 'tianjin',
		cityname: '天津'
	},
		{
		adcode: '3201',
		spell: 'nanjing',
		cityname: '南京'
	},
		{
		adcode: '8100',
		spell: 'xianggang',
		cityname: '香港'
	},
		{
		adcode: '5000',
		spell: 'chongqing',
		cityname: '重庆'
	},
		{
		adcode: '3301',
		spell: 'hangzhou',
		cityname: '杭州'
	},
		{
		adcode: '2101',
		spell: 'shenyang',
		cityname: '沈阳'
	},
		{
		adcode: '2102',
		spell: 'dalian',
		cityname: '大连'
	},
		{
		adcode: '5101',
		spell: 'chengdu',
		cityname: '成都'
	},
		{
		adcode: '2201',
		spell: 'changchun',
		cityname: '长春'
	},
		{
		adcode: '3205',
		spell: 'suzhou',
		cityname: '苏州'
	},
		{
		adcode: '4406',
		spell: 'foshan',
		cityname: '佛山'
	},
		{
		adcode: '5301',
		spell: 'kunming',
		cityname: '昆明'
	},
		{
		adcode: '6101',
		spell: 'xian',
		cityname: '西安'
	},
		{
		adcode: '4101',
		spell: 'zhengzhou',
		cityname: '郑州'
	},
		{
		adcode: '2301',
		spell: 'haerbin',
		cityname: '哈尔滨'
	},
		{
		adcode: '4301',
		spell: 'changsha',
		cityname: '长沙'
	},
		{
		adcode: '3302',
		spell: 'ningbo',
		cityname: '宁波'
	},
		{
		adcode: '3202',
		spell: 'wuxi',
		cityname: '无锡'
	},
		{
		adcode: '3702',
		spell: 'qingdao',
		cityname: '青岛'
	},
		{
		adcode: '3601',
		spell: 'nanchang',
		cityname: '南昌'
	}*/
	],
	//数据初始化!
	swInit: function() {
		var self = this;
		FastClick.attach(document.body);
		//调用缓存工具中的初始化方法
		amapCache.init({
			complete: function() {
				self.initCity(); //根据缓存加载相应城市
				tip.init(); //初始化事件绑定信息
				self.loadingOver();//加载完成
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
			cache = SW.cache;
		var hash = decodeURIComponent(window.location.hash).replace(/^\#/, '');
		//decodeURIComponent 对 encodeURIComponent() 函数编码的 URI 进行解码。replace(/^\#/, '')，把#号给去除了。
		var param = self.param2json(hash);
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
			if (!self.fileNameData[adcode]) {
				// 该城市没有对应地铁图,那就打开cityChange的列表
				self.subwayFlag = 0;
				return tip.cityChange();
			} else {
				// 该城市有对应地铁图,那就显示#subway
				self.subwayFlag = 1;
				$('#subway').show()
			}
		}
		//如果城市代码不存在
		else {
			self.subwayFlag = 0;
			return tip.cityChange();
		}

		$('.city_name').html(self.cityname[adcode]);
		//改变网页的标题
		document.title = self.cityname[adcode] + '地铁图';

		// 此城市代码与当前城市的代码不一致，即发生了变化，tip.hideCitylist();
		if (adcode != cache.curCity.adcode) {
			$("#subway-svg,#infowindow-content,#tip-content,.line-caption").remove();
			drwSw.svgReady = false;
			//开启加载对应城市的数据
			self.loading();
			$(".filter_btn").hide();
			self.loadData(adcode, function (drwData) {
				//这里的drwData是loadData方法中callback的参数。这个参数在loadData中被定义。
				self.loadingOver();
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
			var station = SW.cache.stations[stationId] || SW.cache.stationspoi[stationId];
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
			cache = SW.cache;
		var city_code = adcode;
		// var city_name = cache.citylistByAdcode[adcode].spell;
		var city_name = self.fileNameData[adcode];
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
			self.loadTraffic(city_code,city_name);
			self.loadMainData(city_code,city_name,callback);
			//self.loadTempTraffic();
		}
	},
	//这里是请求对应城市的地铁数据
	loadMainData: function (city_code,city_name,callback) {
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
			callback(self.cache.cities[city_code]);
		},
			function() {
			self.status.currLinesInfo=2;
			alert('城市地铁数据加载失败！');
			self.subwayFlag = 0;
			//tip.cityChange();
		});
	},
	//初步编译地铁的基础信息
	buildCurLinesData: function (city_code,data) {
		var self=this;
		var cache = SW.cache;
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
		self.status.currLinesInfo=1;
		var drwData = cache.cities[city_code];
		console.log("纯地铁信息编译完成!");
		//console.log(drwData);
	},
	//请求站点首末班车信息
	loadStInfo: function (city_code,city_name){
		var self=this;
		var infoData_Url = "data/" + city_code + "_info_" + city_name + ".json";
		amapCache.loadData(infoData_Url, function(info_data) {
			for (var k = 0; k < info_data.l.length; k++) {
				for (var l = 0; l < info_data.l[k].st.length; l++) {
					self.cache.stationsInfo[info_data.l[k].st[l].si] = info_data.l[k].st[l];
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
			for (var i in self.cache.convertData) {
				if (self.cache.convertData[i].line_id == current_City_lines[line_id].ls) {
					/*已经选择了一条地铁*/
					var length=self.cache.convertData[i].stations.length;
					//遍历转换器中的stations
					for (var j = 0; j < length; j++) {
						var acc = self.cache.convertData[i].stations[j].Acc;
						/*已经选中了单个车站*/
						var name = self.cache.convertData[i].stations[j].Name;
						var current_drwData = current_City_lines[line_id];
						var st = current_drwData.st;
						var dataset_line_arr = current_drwData.c;
						//以下获取start信息
						for (var k in self.cache.trafficInfo) {
							/*去遍历所有的路段信息*/
							if (self.cache.trafficInfo[k].startAcc == acc) {
								/*查到当前站点为起点的路段*/
								self.cache.trafficInfo[k].startName = name;
								self.cache.trafficInfo[k].reflineId = current_drwData.ls;
								self.cache.trafficInfo[k].reflineName = current_drwData.ln;
								for (var x in st) {
									//当drw信息中的station的名字与traffic信息中的名字匹配时
									if (st[x].n == name) {
										self.cache.trafficInfo[k].startPos = st[x].p;
									}
								}
								if (!(self.cache.trafficInfo[k].hasOwnProperty("startPos"))) {
									//self.cache.trafficInfo[k].startPos = self.cache.trafficInfo[k - 1].startPos;
									console.log(self.cache.trafficInfo[k], k)
								}
								var startPos = self.cache.trafficInfo[k].startPos;
								for (var y in dataset_line_arr) {
									if (dataset_line_arr[y] == startPos) {
										self.cache.trafficInfo[k].startIndex = y;
									}
								}
							}
						}
						//获取end信息
						for (var k in self.cache.trafficInfo) {
							if (self.cache.trafficInfo[k].endAcc == acc) {
								/*查到当前站点为起点的路段*/
								self.cache.trafficInfo[k].endName = name;
								for (var x in st) {
									if (st[x].n == name) {
										self.cache.trafficInfo[k].endPos = st[x].p;
									}
								}
								var endPos = self.cache.trafficInfo[k].endPos;
								//
								if (!(self.cache.trafficInfo[k].hasOwnProperty("endPos"))) {
									//self.cache.trafficInfo[k].endPos = self.cache.trafficInfo[k - 1].endPos;
									console.log(self.cache.trafficInfo[k], k)
								}
								for (var y in dataset_line_arr) {
									if (dataset_line_arr[y] == endPos) {
										self.cache.trafficInfo[k].endIndex = y;
									}
								}
							}
						}
						//修正环线的的首尾连接问题
						for (var k in self.cache.trafficInfo) {
							if (self.cache.trafficInfo[k].endIndex - self.cache.trafficInfo[k].startIndex> 30) {
								self.cache.trafficInfo[k].endIndex = 0;
							}else if(self.cache.trafficInfo[k].startIndex - self.cache.trafficInfo[k].endIndex> 30){
								self.cache.trafficInfo[k].startIndex = 0;
							}
							self.cache.trafficInfo[k].direction = self.cache.trafficInfo[k].startName+"-to-"+self.cache.trafficInfo[k].endName;
						}
						//增加path和color、direct
						for (var k in self.cache.trafficInfo) {
							var loadRate=self.cache.trafficInfo[k].loadRate;
							var color={};
							//增加path
							if (self.cache.trafficInfo[k].reflineId == current_drwData.ls) {
								var start = Number(self.cache.trafficInfo[k].startIndex);
								var end = Number(self.cache.trafficInfo[k].endIndex);
								if (start < end) {
									self.cache.trafficInfo[k].path = dataset_line_arr.slice(start, end + 1);
									self.cache.trafficInfo[k].ref_direct = "right";
								} else {
									self.cache.trafficInfo[k].path = dataset_line_arr.slice(end, start + 1);
									self.cache.trafficInfo[k].ref_direct = "left";
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
							self.cache.trafficInfo[k].color = color;
						}
					}
				}
			}
		}
		console.log("路况信息整理完毕！");
		//console.log("trafficInfo",self.cache.trafficInfo);
		//整理信息,增加st2st信息!
		for(var i in current_City_lines){
			var current_drwData = current_City_lines[i];
			//console.log("current_drwData",current_drwData);
			var obj={};
			obj.lineId=current_drwData.ls;
			obj.lineName=current_drwData.ln;
			obj.sections=[];
			//console.log(self.cache.trafficInfo);
			for(var k in self.cache.trafficInfo){
				if(current_drwData.ls==self.cache.trafficInfo[k].reflineId){
					var section={};
					section.directionAcc="Acc"+self.cache.trafficInfo[k].startAcc+"_"+self.cache.trafficInfo[k].endAcc;
					section.directionPos=self.cache.trafficInfo[k].startPos+"-to-"+self.cache.trafficInfo[k].endPos;
					section.directionName=self.cache.trafficInfo[k].direction;
					section.startPos=self.cache.trafficInfo[k].startPos;
					section.startName=self.cache.trafficInfo[k].startName;
					section.endPos=self.cache.trafficInfo[k].endPos;
					section.endName=self.cache.trafficInfo[k].endName;
					section.reflineId=self.cache.trafficInfo[k].reflineId;
					section.reflineName=self.cache.trafficInfo[k].reflineName;
					section.path=self.cache.trafficInfo[k].path;
					section.ref_direct=self.cache.trafficInfo[k].ref_direct;
					obj.sections.push(section);
				}
			}
			//console.log(obj);
			current_drwData.st2st=obj.sections;
			//console.log(current_drwData);
			self.cache.trafficNew.push(current_drwData);
		}
		console.log("新的画图数据drwData整理完毕！");
		//console.log("trafficNew",self.cache.trafficNew);
		//转json!
		console.log("正在转译成Json...");
		console.log(JSON.stringify(self.cache.trafficNew));
	},
	//请求交通状况信息
	loadTraffic: function (city_code,city_name,callback){
		SW.status.trafficInfo = 0;
		var self=this;
		var trafficData_Url="http://223.72.210.20:8388/PublicTripProvide/LoadAfcJtlDataJson?ask=t8ai8t4s3acb1ce";
		//var trafficData_Url="data/" + city_code + "_trafficinfo_" + city_name + ".json";
		amapCache.loadData(trafficData_Url, function(trafficData) {
			//编译最原始的trafficInfo
			//console.log(trafficData);
			//先清空，再遍历！
			self.cache.trafficInfo=[];
			self.refreshStatus="";
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
					info.rateColor = self.statusColor[0].color;
				} else if (loadRate > 0.6 && loadRate <= 0.9) {
					info.rateColor = self.statusColor[1].color;
				} else if (loadRate > 0.9 && loadRate <= 1.1) {
					info.rateColor = self.statusColor[2].color;
				} else if (loadRate > 1.1){
					info.rateColor = self.statusColor[3].color;
				} else {
					info.rateColor = "CCCCCC";
				}
				self.cache.trafficInfo.push(info);
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
			self.status.trafficInfo=1;
			console.log("路况信息请求完成!");
			self.refreshStatus=self.formatTime(self.cache.trafficInfo[0].refreshTime).trafficLoad;
			//callback();
			//console.log(self.refreshStatus);
			//console.log("self.cache.trafficInfo",self.cache.trafficInfo);
		},function() {
			self.status.trafficInfo=2;
			//self.loadMainData(city_code,city_name,callback);
			//延迟弹窗
			SW.loadingOver();
			setTimeout(function () {
				tip.refreshError();
			},1000);
		});
	},
	//路况信息编译到draData
	addTrafficInfo: function (city_code) {
		//这里依赖加载路况信息以及画图信息的加载状态
		var self = this;
		//console.log(SW.timer);
		//console.log("请求到了路况信息,开始编译...");
		var drwData = self.cache.cities[city_code];
		for (var line_id in drwData.lines) {
			for (var j in drwData.lines[line_id].st2st) {
				for (var k in self.cache.trafficInfo) {
					if (self.cache.trafficInfo[k].Acc2Acc == drwData.lines[line_id].st2st[j].directionAcc.slice(3)) {
						drwData.lines[line_id].st2st[j].loadRate = self.cache.trafficInfo[k].loadRate;
						drwData.lines[line_id].st2st[j].refreshTime = self.cache.trafficInfo[k].refreshTime;
						drwData.lines[line_id].st2st[j].rateColor = self.cache.trafficInfo[k].rateColor;
					}
				}
			}
		}
		console.log("路况信息编译成功！");
		//console.log("addTrafficInfo",drwData);
		//console.log("新的drwData",drwData);
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
			self.cache.tempTrafficinfo.pubTime=self.formatTime(pubTime).trafficTemp;
			self.cache.tempTrafficinfo.stInfo=tempInfo;
			self.status.tempTrafficinfo=1;
			console.log("限流管制信息请求完成!");
			//console.log(self.cache.tempTrafficinfo);
			//console.log(self.cache.stationsInfo);
			//console.log(self.refreshStatus);
		},function() {
			self.status.tempTrafficinfo=2;
			//self.loadMainData(city_code,city_name,callback);
			//延迟弹窗
			setTimeout(function () {
				alert("限流管制信息加载失败!");
			},1000);
		});
	},
	//正在加载
	loading: function() {
		$('.loading-outer').css('position', 'fixed');
		$('.loading-bg').css({
			'position': 'fixed',
			'display': 'block'
		});
		$('.loading-bg .loading').css('top', '-30px');
	},
	//加载完成
	loadingOver: function() {
		$('.loading-bg').css('display', 'none');
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
	},
};