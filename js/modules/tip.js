/**
 * Created by xinye on 16/5/18.
 */
var $ = require("./zepto");
var Hammer = require("../lib/hammer.js");

var DrwTraf = require("./drwtraffic");
var drwSw = require("./drwMain");
var SW = require("./SW");
var AllData = require("./AllData");

var getstureState = 0;
var el = document.getElementById('drag_handle');
el.style.transformOrigin = "top left";

var debounceTransLabel = "debounce-transition",
//缩放极限
    MinScale = 0.35, MaxScale = 1.9,
//单次缩放比例,单次的缩放比率范围超出缩放极限范围时，就会发生回弹！
    MinTempScale = 0.25, MaxTempScale =2.2;



var tip = {
    refreshTimer: {},
    refreshstate: 0,
    station_w: 26,
    touchStatus: null, //当前touch状态：drag, scale
    curScale: 1, //当前缩放级别
    allScale: 1,
    dragObj: $("#subwaySvg"), //
    svgOffset: {
        left: 0,
        top: 0
    },
    startOffset:{
        left: 0,
        top: 0
    },
    realCenter: {
        x: $(window).width() / 2,
        y: $(window).height() / 2
    },
    subwaySvg: document.getElementById("subway-svg"),
    opentip: false,
    transform: {
        translate: {
            x: 0,
            y: 0
        },
        scale: 1
    },
    transformState: { //每次拖动结束后的transform值
        translate: {
            x: 0,
            y: 0
        },
        scale: 1
    },

    debounceTransLabel:debounceTransLabel,
    enableGesture : null,
    //
    transformOrigin: null,
    routeState: false,
    fromendState: false,
    w: AllData.w,
    h: AllData.h,
    curCity: AllData.cache.curCity,
    stationsInfo: AllData.cache.stationsInfo, /*几个数据接口*/
    stations: AllData.cache.stations,
    lines: AllData.cache.lines,
    //pathData: null,
    //初始化事件绑定信息

    preventScrollBounce: function (eles) {
        if (!eles.length && !eles.unshift) {
            eles = [eles]
        }

        eles.forEach(function (el) {
            new Hammer.Manager(el, {
                recognizers: [
                    [Hammer.Pinch, {
                        direction: Hammer.DIRECTION_VERTICAL
                    }],
                    [Hammer.Swipe, {
                        direction: Hammer.DIRECTION_VERTICAL
                    }]
                ]
            })
        })

    },
    refreshShow: function () {
        $(".refresh_box").css("display", "block").addClass("refresh_box_show");
        $(".refresh_time_text").css("display", "block").addClass("refresh_time_text_show");
        tip.loadingOver();
        //4秒后隐藏信息
        clearTimeout(tip.refreshTimer);
        tip.refreshTimer = setTimeout(function () {
            $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
            $(".refresh_box").removeClass("refresh_box_show").css("display", "none");
            tip.refreshstate = 0;
        }, 4000);
    },
    refreshSuccess: function () {
        $('.refresh_time_text').html("更新于" + AllData.refreshStatus);
        //去除刷新按钮转圈
        var $refresh = $(".refresh_btn");
        $refresh.removeClass("refresh_active");
        tip.refreshstate = 1;
        tip.refreshShow();
    },
    refreshError: function () {
        var $refresh = $(".refresh_btn");
        $refresh.removeClass("refresh_active");
        $(".refresh_error").css("display", "block");
        setTimeout(function () {
            $(".refresh_error").css("display", "none");
            tip.refreshstate = 0;
        }, 1500);
    },
    stoprefresh: function () {
        $(".refresh_btn").hide();
        $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
        $(".refresh_box").hide().removeClass("refresh_box_show").css("display", "none");
    },
    openhelpBox: function () {
        $('.light_box').css('display', 'block');
        var $helpContent = $(".help_content");
        var width = parseInt($helpContent.css("width"));
        var left = (tip.w - width) / 2 + "px";
        $helpContent.css({"left": left});
        $helpContent.css("display", "block");
        $('.tip_wrap_out').hide();
        $(".refresh_btn").hide();
        $(".refresh_time").hide();
    },
    closehelpBox: function () {
        $('.light_box').css('display', 'none');
        $(".help_content").css("display", "none");
    },
    //拖动Svg
    mcdragSvg: function (ev) {
        var self = this;
        // 降低渲染频率
        if (self.transform.translate.x == ev.deltaX && self.transform.translate.y == ev.deltaY) {
            return
        }
        self.transform.translate.x = ev.deltaX;
        self.transform.translate.y = ev.deltaY;
        self.handleUpdate();
    },
    //缩放
    mcScaleSvg: function (ev) {
        var self = this;
        var scale;
        var initScale = 1;
        var center = ev.center; //{x:..,y:..}

        if (ev.type == 'pinchstart') {
            initScale = self.transform.scale || 1;
        }
        self.realCenter = {
            'x': Number(center.x) - Number(self.svgOffset.left),
            'y': Number(center.y) - Number(self.svgOffset.top)
        };


        var tmpscale = ev.scale;
        tip.curScale = tmpscale;

        //以下：超出缩放极限会有弹回效果
        tmpscale = tmpscale > MaxTempScale ? MaxTempScale : tmpscale;
        //tmpscale = tmpscale < MinTempScale ? MinTempScale : tmpscale;


        //以下：超出缩放极限会禁止缩放
        //tmpscale = self.transformState.scale * tmpscale > MaxTempScale ? MaxTempScale / self.transformState.scale : tmpscale;
        tmpscale = self.transformState.scale * tmpscale < MinTempScale ? MinTempScale / self.transformState.scale : tmpscale;


        scale = initScale * tmpscale;
        // 渲染频率
        if (self.transformOrigin == center && self.transform.scale == scale) {
            return
        }
        self.transformOrigin = center;
        self.transform.scale = scale;
        self.handleUpdate();
    },
    //处理更新
    handleUpdate: function () {
        var self = this;
        var value = [
            'translate3d(' + self.transform.translate.x + 'px, ' + self.transform.translate.y + 'px, 0)',
            'scale(' + self.transform.scale + ', ' + self.transform.scale + ')'
        ];

        value = value.join(" ");
        var dragObj = document.querySelector("#drag_handle");

        dragObj.style.webkitTransform = value;
        dragObj.style.transform = value;

        if (self.touchStatus == 'pinch') {
            var originCenter = self.transformOrigin.x + 'px ' + self.transformOrigin.y + 'px';
            dragObj.style.webkitTransformOrigin = originCenter;
            dragObj.style.transformOrigin = originCenter;
        }
    },
    //处理恢复默认
    handleReset: function () {
        var self = this;
        self.transform.translate.x = 0;
        self.transform.translate.y = 0;
        self.transform.scale = 1;

        self.handleUpdate();
    },

    svgUpdate1: function(a) {
        var b = this
            , c = $("#svg-g")
            , d = c.offset()
            , e = d && d.left
            , f = d && d.top
            , g = d && d.width
            , h = d && d.height
            , i = a.deltaX
            , j = a.deltaY
            , k = !0;


        if (g > tip.w ? (Number(e) > Number(tip.w) / 2 || Math.abs(Number(e)) > Number(g - Number(tip.w) / 2)) && (Number(b.startOffset.left) > 0 ? k = !1 : g - Math.abs(Number(b.startOffset.left)) < Number(tip.w) / 2 ? k = !1 : (i = a.deltaX / 2,
                $("#drag_handle").addClass(debounceTransLabel))) : (0 > e + g / 2 || e + g / 2 > tip.w) && (Number(b.startOffset.left) > 0 ? k = !1 : g - Math.abs(Number(b.startOffset.left)) < Number(tip.w) / 2 ? k = !1 : (i = a.deltaX / 2,
                $("#drag_handle").addClass(debounceTransLabel))),

                h > tip.h ? (Number(f) > Number(tip.h) / 2 || Math.abs(Number(f)) > Number(h - Number(tip.h) / 2)) && (Number(b.startOffset.top) > 0 ? k = !1 : h - Math.abs(Number(b.startOffset.top)) < Number(tip.h) / 2 ? k = !1 : (j = a.deltaY / 2,
                    $("#drag_handle").addClass(debounceTransLabel))) : (0 > f + h / 2 || f + h / 2 > tip.h) && (Number(b.startOffset.top) > 0 ? k = !1 : h - Math.abs(Number(b.startOffset.top)) < Number(tip.h) / 2 ? k = !1 : (j = a.deltaY / 2,
                    $("#drag_handle").addClass(debounceTransLabel))),
                k) {
            var l = tip.transformState.translate.x + i
                , m = tip.transformState.translate.y + j
                , n = tip.transformState.scale;
            l && m && (c.attr("transform", "translate(" + l + "," + m + ") scale(" + n + ")"),
                tip.transformState.translate.x = l,
                tip.transformState.translate.y = m);
            var o = $(".overlays")
                , p = parseInt(o.css("left")) || 0
                , q = parseInt(o.css("top")) || 0
                , r = Number(p) + Number(i)
                , s = Number(q) + Number(j);
            o.css({
                left: r + "px",
                top: s + "px"
            })
        } else
            $("#drag_handle").addClass(b.debounceTransLabel);
        tip.handleReset(),
            setTimeout(function() {
                tip.touchStatus = null ,
                    b.enableGesture = null
            }, 100)
    },
    scaleSvgUpdate1: function(a, b) {
        console.log("scaleSvgUpdate");
        var c,
            d = this,
            e = ($("#svg-g"), $("#subwaySvgBody"), d.transformState.translate.x),
            f = d.transformState.translate.y,
            g = d.transformState.scale;
        tip.allScale = c = tip.allScale * a;
        var h = a * g;
        h > MaxScale && (h = MaxScale, tip.allScale =MaxScale), MinScale> h && (h = MinScale, tip.allScale = MinScale),
            a = h / g;
        var i = tip.realCenter.x
            , j = tip.realCenter.y;
        b && (i = $(window).width() / 2,
            j = $(window).height() / 2);
        var k = (Number(a) - 1) * (Number(i) - Number(e))
            , l = (Number(a) - 1) * (Number(j) - Number(f))
            , m = e - k
            , n = f - l;

        if (d.newtransformState = {
                translateX: m,
                translateY: n,
                scale: h
            },
            c >MaxScale ||  MinScale > c) {
            var o = c > MaxScale? MaxScale / g :  MinScale/ g;
            $("#drag_handle").addClass(d.debounceTransLabel).css({
                "-webkit-transform": "translate3d(0px, 0px, 0) scale(" + o + ", " + o + ")"
            })
        } else
            d.resetAllElem(m, n, h)
    },
    resetAllElem: function() {
        console.log("resetAllElem")
        var self = this
            , newTranslate_x = self.newtransformState.translateX
            , newTranslate_y = self.newtransformState.translateY
            , newscale = self.newtransformState.scale;
        newTranslate_x && newTranslate_y && ($("#svg-g").attr("transform", "translate(" + newTranslate_x + "," + newTranslate_y + ") scale(" + newscale + ")"),
            self.transformState.translate.x = newTranslate_x,
            self.transformState.translate.y = newTranslate_y,
            self.transformState.scale = newscale),
            tip.handleReset();
        tip.updateTip();
        tip.updateNear();
        tip.updateMarker();
        setTimeout(function () {
            tip.touchStatus = null;
        }, 100);
        setTimeout(function () {
            self.enableGesture = null;
        }, 100);
    },
    //svg更新
    svgUpdate: function (ev) {
        console.log("svgUpdate");
        var svg_g = $("#svg-g"),
            $svg_body = $('#subwaySvgBody'),
            svg_g_offset = svg_g.offset(),
            svg_g_l = svg_g_offset.left,
            svg_g_t = svg_g_offset.top,
            svg_g_w = svg_g_offset.width,
            svg_g_h = svg_g_offset.height;
        var canUpdate = true;
        if (svg_g_w > tip.w) {
            if (Number(svg_g_l) > Number(tip.w) / 2 || Math.abs(Number(svg_g_l)) > (Number(svg_g_w - Number(tip.w) / 2))) {
                canUpdate = false;
            }
        } else {
            if (svg_g_l + svg_g_w / 2 < 0 || svg_g_l + svg_g_w / 2 > tip.w) {
                canUpdate = false;
            }
        }
        if (svg_g_h > tip.h) {
            if (Number(svg_g_t) > Number(tip.h) / 2 || Math.abs(Number(svg_g_t)) > (Number(svg_g_h - Number(tip.h) / 2))) {
                canUpdate = false;
            }
        } else {
            if (svg_g_t + svg_g_h / 2 < 0 || svg_g_t + svg_g_h / 2 > tip.h) {
                canUpdate = false;
            }
        }

        if (canUpdate) {
            var newTranslate_x = tip.transformState.translate.x + ev.deltaX,
                newTranslate_y = tip.transformState.translate.y + ev.deltaY,
                curscale = tip.transformState.scale;
            if (newTranslate_x && newTranslate_y) {
                svg_g.attr("transform", "translate(" + newTranslate_x + "," + newTranslate_y + ") scale(" + curscale + ")"); //重置translate
                tip.transformState.translate.x = newTranslate_x;
                tip.transformState.translate.y = newTranslate_y;
            }
            var $overlays = $('.overlays');
            var oldLeft = parseInt($overlays.css('left')) || 0,
                oldTop = parseInt($overlays.css('top')) || 0;
            var newLeft = Number(oldLeft) + Number(ev.deltaX),
                newTop = Number(oldTop) + Number(ev.deltaY);
            $overlays.css({
                left: newLeft + 'px',
                top: newTop + 'px'
            });
        }

        tip.handleReset();
        setTimeout(function () {
            tip.touchStatus = null;
        }, 100);
    },
    //svg缩放更新
    scaleSvgUpdate: function (scale, nav) {
        var self = this;
        var c;
        var translate_x = ($("#svg-g"), $("#subwaySvgBody"),self.transformState.translate.x),
            translate_y = self.transformState.translate.y,
            curscale = self.transformState.scale;
        tip.allScale = c = tip.allScale * scale;
        var newscale = scale * curscale;
        if (newscale > MaxScale) {
            newscale = MaxScale;
            tip.allScale = MaxScale;
        }
        if (newscale < MinScale) {
            newscale = MinScale;
            tip.allScale = MinScale;
        }
        scale = newscale / curscale;
        var origin_x = tip.realCenter.x,
            origin_y = tip.realCenter.y;
        if (nav) {
            origin_x = $(window).width() / 2;
            origin_y = $(window).height() / 2;
        }
        var moveX = (Number(scale) - 1) * (Number(origin_x) - Number(translate_x)),
            moveY = (Number(scale) - 1) * (Number(origin_y) - Number(translate_y));
        var newTranslate_x = translate_x - moveX,
            newTranslate_y = translate_y - moveY;



        self.newtransformState = {translateX: newTranslate_x, translateY: newTranslate_y, scale: newscale};
        if (c > MaxScale || MinScale > c) {
            var _scale = c > MaxScale ? MaxScale / curscale : MinScale / curscale;
            $("#drag_handle").addClass(self.debounceTransLabel).css({
                "-webkit-transform": "translate3d(0px, 0px, 0) scale(" + _scale + ", " + _scale + ")"
            });
            console.log("addClass");
        }else
            self.resetAllElem(newTranslate_x,newTranslate_y,newscale);
    },
    transformStateReset: function() {
        var self = this;
        self.transformState.translate.x = 0;
        self.transformState.translate.y = 0;
        self.transformState.scale = 1;
        var $overlays = $(".overlays");
        $overlays.css({
            left: "0px",
            top: "0px"
        })
    },
    //设置合适的屏幕视图大小
    setFitview: function (obj) {
        var self = this;
        self.scaleSvgUpdate(1 / self.transformState.scale, true);
        var obj_width = obj.width(),
            obj_height = obj.height();
        //var topbar_height = AllData.cache.param && AllData.cache.param.src == 'alipay' ? 0 : $('.top_bar').height(),
        //    bottombar_height = $('.route_bar').height();
        //var H_offset=topbar_height + bottombar_height;

        var full_width = $(window).width(),
            full_height = $(window).height()/* - H_offset*/;
        var w_rate = full_width / obj_width,
            h_rate = full_height / obj_height,
            scale = 1;
        if (w_rate < 1 || h_rate < 1) {
            scale = w_rate < h_rate ? (w_rate - 0.05) : (h_rate - 0.06);
            MinScale > scale && (scale = MinScale + .01),
            self.scaleSvgUpdate(scale, true);
        }
    },
    //获取缩放中心
    getScaleCenter: function (xy1, xy2) {
        var center = {};
        if (xy1 && xy2) {
            var x1 = eval(xy1.x),
                y1 = eval(xy1.y),
                x2 = eval(xy2.x),
                y2 = eval(xy2.y);
            center.x = (x1 + x2) / 2;
            center.y = (y1 + y2) / 2;
        }
        return center;
    },
    //关闭最近的弹窗
    closeNearTip: function () {
        var self = this;
        var obj = $(".tip-content");
        if (drwSw.isNearTip) {
            if (obj.hasClass('open')) {
                obj.css("display", "none").removeClass("open");
            }
        }
    },
    //加载信息数据
    loadinfo: function (lineId, StationId) {
        var self = this;
        var select_station_name,
            infowHtml = [],
            select_station_dpt_time = self.stationsInfo[StationId].d;
        select_station_name = self.stations[StationId].n;
        // var current_station = [];
        var current_station = {};
        for (var i = 0, len = select_station_dpt_time.length; i < len; i++) {
            var item = select_station_dpt_time[i];
            if (!current_station[item.ls]) {
                current_station[item.ls] = [];
            }
            current_station[item.ls].push(item);
        }
        $("#tip_name").html(select_station_name);
        //console.log(current_station);
        // 输出地铁站点信息
        for (var lineid in current_station) {
            if (current_station.hasOwnProperty(lineid)) {
                if (self.lines[lineid]) {
                    var line_sub_name = self.lines[lineid].la;
                    if (line_sub_name == '') {

                    } else {
                        line_sub_name = '(' + line_sub_name + ')';
                    }
                    infowHtml.push("<div class=\"tip_detail_line\">");
                    //infowHtml.push("<label class=\"line-label\" style=\"background-color:#"+self.lines[lineid].cl+"\">地铁" + self.lines[lineid].ln + line_sub_name +"</label>");
                    infowHtml.push("<label class=\"line-name\">" + self.lines[lineid].ln + line_sub_name + "</label>");
                    infowHtml.push("<label class='line-white-label'></label>");
                    infowHtml.push("<ul class=\"time-item-main\">");
                    for (var j = 0; j < 2; j++) {
                        if (current_station[lineid][j]) {
                            var first_time = current_station[lineid][j].ft;
                            var last_time = current_station[lineid][j].lt;
                            first_time = self.resetTime(first_time);
                            last_time = self.resetTime(last_time);
                            var direction = self.stations[current_station[lineid][j].n];
                            if (first_time.split(':')[0] != '--' || last_time.split(':')[0] != '--') {
                                infowHtml.push("<li class=\"time-item-detail\">");
                                infowHtml.push("<div class=\"train-direct\">" + direction.n + "方向" + "</div>"); //下一站名，表示方向
                                infowHtml.push("<div class=\"train-time fr\">");
                                infowHtml.push("<div class=\"start-time time-box fl\"><label class=\"time-label-start\">首</label><span class=\"time\">" + first_time + "</span></div>"); //首发
                                infowHtml.push("<div class=\"last-time time-box fl\"><label class=\"time-label-end\">末</label><span class=\"time\">" + last_time + "</span></div>"); //末发
                                infowHtml.push("</div>");
                                infowHtml.push("</li>");
                            }
                        }
                    }
                    infowHtml.push("</ul>");
                    infowHtml.push("</div>");
                }

            }
        }

        $("#tip_content").html(infowHtml.join(""));
    },
    //打开Tip弹窗
    openTip: function (obj) {
        if (obj && !tip.routeState) {
            var self = this;
            self.curopenStation = obj;

            //设置站点的id和名称及关联线路id
            var select_ref_line_id = obj.attr("line_id");
            var select_station_id = obj.attr("station_id");

            //运行loadinfo(),写首发时间数据
            self.loadinfo(select_ref_line_id, select_station_id);

            //设置站点的id和名称及关联线路id
            var station_name = obj.attr("station_name"),
                station_poiid = obj.attr("station_poiid"),
                station_lon = obj.attr("station_lon"), /*经度*/
                station_lat = obj.attr("station_lat"), /*纬度*/
                station_id = obj.attr("station_id");

            var line_id = obj.attr("line_id").toString();

            //移除当前打开的info-window
            //$('#tip_name').html(station_name);
            $('.tip_wrap').attr('stid', station_id)
                .attr('name', station_name)
                .attr('poiid', station_poiid)
                .attr('lon', station_lon)
                .attr('lat', station_lat);
            $('.tip_wrap_out').show();

            self.setTipPos(obj);
            self.opentip = true;
            //打开窗口后就以弹窗的1/3为中心
            var Top0ffset = self.topOffset(0.4);
            tip.transformState.translate.y = tip.transformState.translate.y + Top0ffset;
        }
    },
    topOffset: function (offset) {
        var $tipBodyHeight = $('.tip_body').css("height"),
            bodyHeight = parseInt($tipBodyHeight) * offset;
        return bodyHeight;
    },
    //设置弹窗的位置属性
    setTipPos: function (obj) {
        var self = this;
        var tip_content = $('.tip_wrap_out');
        var obj_left = obj && obj.offset() && obj.offset().left,
            obj_top = obj && obj.offset() && obj.offset().top;
        var $overlays = $('.overlays');
        var overlaysLeft = parseInt($overlays.css('left')) || 0,
            overlaysTop = parseInt($overlays.css('top')) || 0;

        infowindow_left = obj_left + self.station_w * self.allScale / 2 - overlaysLeft;
        infowindow_top = obj_top + self.station_w * self.allScale / 2 - overlaysTop;

        tip_content.css({
            top: infowindow_top + 'px',
            left: infowindow_left + 'px'
        });
    },
    //关闭弹窗信息
    closeTip: function (status) {
        $('.tip_wrap_out').hide();
        if (!status) {
            tip.opentip = false;
        }
        $('.light_box').css('display', 'none');
        //window.location.hash = '#city=' + AllData.cache.curCity.adcode;
        window.location.hash = "";
    },
    //设置中心信息
    setCenter: function (center) {
        var self = this;
        var svg_g = $('#svg-g');
        if (!center) {
            return;
        }
        var center_x = center.x,
            center_y = center.y;
        var translate_x = tip.transformState.translate.x,
            translate_y = tip.transformState.translate.y,
            scale = tip.transformState.scale;
        var screen_w = document.documentElement.clientWidth,
            screen_h = document.documentElement.clientHeight;

        var moveX = center_x - screen_w * 0.5,
            moveY = center_y - screen_h * 0.5;

        translate_x = translate_x - moveX;
        translate_y = translate_y - moveY;


        svg_g.attr("transform", "translate(" + translate_x + "," + translate_y + ") scale(" + scale + ")");

        tip.transformState.translate.x = translate_x;
        tip.transformState.translate.y = translate_y;

        //选取偏移量
        var Top0ffset = self.topOffset(0.4);

        var $overlays = $('.overlays');
        var oldLeft = parseInt($overlays.css('left')) || 0,
            oldTop = parseInt($overlays.css('top')) || 0;
        var newLeft = Number(oldLeft) - Number(moveX),
            newTop = Number(oldTop) - Number(moveY) + Top0ffset;
        $overlays.css({
            left: newLeft + 'px',
            top: newTop + 'px'
        });
    },
    //打开路线选择器
    openFilter: function () {
        var $filterContent = $(".filter_content");
        $('.light_box, .filter_content').css('display', 'block');
        var width = parseInt($filterContent.css("width")),
            height = parseInt($filterContent.css("height"));
        var left = (tip.w - width) / 2 + "px",
            top = (tip.h - height) / 2 + "px";
        $filterContent.css({"top": top, "left": left});
        //线路选择器不能与弹窗同时存在
        $('.tip_wrap_out').hide();
        tip.stoprefresh();
    },
    //关闭路线选择器
    closeFilter: function () {
        $('.light_box, .filter_content').css('display', 'none');
        $(".refresh_btn").show();
        $(".refresh_box").show();
        $(".refresh_time").show();
    },
    //获取选择后的中心
    getFilterCenter: function () {
        var self = this;
        var select_g_offset = $('#g-select').offset();
        var select_g_h = document.getElementById("g-select").getBBox().height * self.allScale,
            select_g_w = document.getElementById("g-select").getBBox().width * self.allScale;

        return {
            'x': select_g_offset.left + select_g_w / 2,
            'y': select_g_offset.top + select_g_h / 2
        }
    },
    //改变城市
    cityChange: function () {
        $('#subway').hide();
        tip.creatCitylist();
        tip.showCitylist();
    },
    //创建城市列表
    creatCitylist: function () {
        var city = SW.cityListData;
        if (city) {
            var citylist = $('#citylist');
            var cityListHtm = '';
            for (var i = 0; i < city.length; i++) {
                cityListHtm += '<li class="cityitem" adcode="' + city[i].adcode + '"><a href="javascript:void(0)">' + city[i].cityname + '</a></li>';
            }
            citylist.html(cityListHtm);
        }
    },
    //初始化城市信息
    initCity: function () {
        tip.allScale = 1;
    },
    //显示城市列表
    showCitylist: function () {
        $('#citypage').show();
    },
    //隐藏城市列表
    hideCitylist: function () {
        $('#citypage').hide();
    },
    //获得对象中心位置
    getStCenter: function (obj) {
        if (obj) {
            var st_offset = obj.offset();
            if (st_offset) {
                return {
                    'x': st_offset.left + st_offset.width / 2,
                    'y': st_offset.top + st_offset.height / 2
                }
            }

        }
    },
    //清楚标记
    clearMarker: function (type) {
        var self = this;
        if (type) {
            var marker = $('#nav_' + type).find('.marker-out');
            if (marker.length > 0) {
                marker.remove();
            }
        }
    },
    //更新标记
    updateMarker: function () {
        if (tip.fromendState) {
            var start_id = tip.routeId.start,
                end_id = tip.routeId.end;
            if (start_id) {
                tip.updateStartEnd(start_id, 'start')
            }
            if (end_id) {
                tip.updateStartEnd(end_id, 'end')
            }
        }
    },
    //更新起始点
    updateStartEnd: function (id, type) {
        var self = this;
        if (id) {
            var obj = null;

            if ($('#st-' + id).length > 0) {
                obj = $('#st-' + id)
            } else {
                obj = self.curStation;
            }

            var obj_left = obj.offset().left,
                obj_top = obj.offset().top;

            var $overlays = $('.overlays');
            var overlaysLeft = parseInt($overlays.css('left')) || 0,
                overlaysTop = parseInt($overlays.css('top')) || 0;

            var left = obj_left + self.station_w * self.allScale / 2 - overlaysLeft,
                top = obj_top + self.station_w * self.allScale / 2 - overlaysTop;

            var marker_wrap = $('#nav_' + type);

            marker_wrap.css({
                top: top + 'px',
                left: left + 'px'
            });
        }
    },
    //更新tip
    updateTip: function () {
        var self = this;
        if (tip.opentip) {
            var obj = tip.curopenStation;

            var obj_left = obj.offset().left,
                obj_top = obj.offset().top;

            var $overlays = $('.overlays');
            var overlaysLeft = parseInt($overlays.css('left')) || 0,
                overlaysTop = parseInt($overlays.css('top')) || 0;

            var left = obj_left + self.station_w * self.allScale / 2 - overlaysLeft,
                top = obj_top + self.station_w * self.allScale / 2 - overlaysTop;

            var tip_wrap = $('.tip_wrap_out');

            tip_wrap.css({
                top: top + 'px',
                left: left + 'px'
            });
        }
    },
    //更新最近位置的信息
    updateNear: function () {
        var self = this;
        if (drwSw.nearId) {
            var obj = $('#near-' + drwSw.nearId);

            if (obj) {
                var obj_left = obj.offset().left,
                    obj_top = obj.offset().top;

                var $overlays = $('.overlays');
                var overlaysLeft = parseInt($overlays.css('left')) || 0,
                    overlaysTop = parseInt($overlays.css('top')) || 0;

                var left = obj_left + 28 * self.allScale / 2 - overlaysLeft,
                    top = obj_top - overlaysTop;

                var tip_wrap = $('.tip-content');

                tip_wrap.css({
                    top: top + 'px',
                    left: left + 'px'
                });
            }
        }
    },
    //格式化时间
    formatTime: function (le) {
        if (!le || le == '0') {
            return '';
        }
        le = le / 60;
        if (le <= 60) {
            return parseInt(Math.ceil(le)) + '分钟';
        } else {
            var o = Math.floor(le / 60) + '小时';
            if (le % 60 !== 0) {
                if (Math.floor(le % 60) === 0) {

                } else {
                    o += Math.floor(le % 60) + '分钟';
                }
            }
            return o;
        }
    },
    unableFlite: function () {
        $('.filter_btn').css({
            'z-index': '10'
        })
    },
    ableFilte: function () {
        $('.filter_btn').css({
            'z-index': '20'
        })
    },
    resetTime: function (timeString) {
        if (timeString != "--:--") {
            var hours = Number(timeString.split(":")[0]);
            var mins = Number(timeString.split(":")[1]);
            if (hours < 10 && hours > 0) {
                hours = "0" + hours;
            } else if (hours == 0) {
                hours = "00";
            } else {
                hours = hours;
            }

            if (mins < 10 && mins > 0) {
                mins = "0" + mins;
            } else if (mins == 0) {
                mins = "00";
            } else {
                mins = mins;
            }

            return hours + ":" + mins;
        } else {
            return timeString;
        }
    },
    clearRouteIpt: function (type) {
        var placeholder = {
            'start': '输入起点',
            'end': '输入终点'
        };
        var $obj = null;
        if (type == 'start') {
            $obj = $('#setStart')
        } else if (type == 'end') {
            $obj = $('#setEnd')
        }
        $obj.find('.route_startend').html(placeholder[type]).addClass('route_placeholder');
        $obj.find('.route_close').addClass('hidden');
    },
    //正在加载
    loading: function () {
        $('.loading-outer').css('position', 'fixed');
        $('.loading-bg').css({
            'position': 'fixed',
            'display': 'block'
        });
        $('.loading-bg .loading').css('top', '-30px');
    },
    //加载完成
    loadingOver: function () {
        $('.loading-bg').css('display', 'none');
    }
};


module.exports = tip;