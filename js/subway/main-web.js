var getstureState = 0;
var el = document.getElementById('drag_handle');
el.style.transformOrigin = "top left";

var tip = {
    toggle:0,
    host: "http://m.amap.com/",
    verify: "/verify/?from=",
    isHighlight: false,
    isInfoShow: false,
    stationsInfo: SW.cache.stationsInfo,/*几个数据接口*/
    stations: SW.cache.stations,
    lines: SW.cache.lines,
    station_w: 26,
    dragObjXY: {}, //拖拽div时的实时xy
    dragX: null,
    dragY: null,
    onePoint: {}, //单手touch时的初始xy
    twoPoint1: {}, //双手touch时的初始x1y1
    twoPoint2: {}, //双手touch时的初始x2y2
    twoOriginPointDis: null, //双手touch时的两手指的初始距离
    touchStatus: null, //当前touch状态：drag, scale
    curScale: 1, //当前缩放级别
    allScale: 1,
    zoomCenter: null, //搜索初始中心点
    dragHandle: $("#drag_handle"), //touch对象
    dragObj: $("#subwaySvg"), //
    svgOffset: {
        left: 0,
        top: 0
    },
    realCenter: {
        x: $(window).width() / 2,
        y: $(window).height() / 2
    },
    subwaySvg: document.getElementById("subway-svg"),
    dragObjOffset: {
        x: null,
        y: null
    },
    opentip: false,
    curopenStation: null,
    routeInfo: { //路线规划起始点信息
        start: null,
        end: null
    },
    routeDtailInfo: {
        start: null,
        end: null
    },
    routeId: {
        start: null,
        end: null
    },
    navDrwData: {
        linesbar: [],
        lines: {},
        stations: []
    },
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
    transformOrigin: null,
    routeState: false,
    fromendState: false,
    pathData: null,
    //初始化信息
    init: function() {
        this.bindEvent();
    },
    preventScrollBounce: function(eles) {
        if (!eles.length && !eles.unshift) {
            eles = [eles]
        }

        eles.forEach(function(el) {
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
    //绑定事件
    bindEvent: function() {
        document.addEventListener('touchstart', function() {});
        var self = this;
        var font_size = 12;
        var $subway = $('#subway');
        var $citypage = $('#citypage');
        var $overlays = $('#overlays');
        //var $srh = $('#srhpage');
        var el = document.getElementById('drag_handle');
        var mc = new Hammer.Manager(el, {
            domEvents: true
        });

        mc.add(new Hammer.Pan());
        mc.add(new Hammer.Pinch());

        var enableGesture = true;
        var lastAction = "";
        var hasPenchend = false;

        mc.on("panmove", function(ev) {

            if (!enableGesture) return;

            self.touchStatus = 'pan';
            lastAction = "pan";
            self.mcdragSvg(ev);
        });

        var pinchTimer;
        mc.on("pinchstart pinchmove", function(ev) {

            if (!enableGesture) return;

            self.touchStatus = 'pinch';
            lastAction = "pinch";
            if (ev.type == 'pinchstart') {
                self.svgOffset = drwSw.svgOffset || tip.svgOffset;
                hasPenchend = false;
            }
            self.mcScaleSvg(ev);

        });

        mc.on("pinchend", function(ev) {
            setTimeout(function() {
                if (!hasPenchend) {
                    self.scaleSvgUpdate(self.transform.scale);
                }
            }, 0)
        });
        mc.on("hammer.input", function(ev) {

            if (ev.isFinal) {

                if (lastAction == "pinch") {
                    self.scaleSvgUpdate(self.transform.scale);
                    hasPenchend = true;
                }

                if (lastAction == "pan") {
                    self.svgUpdate(ev);
                }

                enableGesture = false;
                setTimeout(function() {
                    enableGesture = true;
                }, 50);
            }
        });

        $('.light_box').on('touchmove', function(ev) {
            ev.preventDefault();
        });

        $('#loading').on('touchmove', function(ev) {
            ev.preventDefault();
        });

        $subway.on('touchend', 'g', function() {
            if (!self.touchStatus) {
                if ($(this).hasClass('line_name')) {
                    var line_id = $(this).attr('lineid');
                    self.showFilterLine(line_id);
                    var select_obj = $('#g-select');
                    tip.setFitview(select_obj);
                    var center = self.getFilterCenter();
                    self.setCenter(center);
                }
            }
        });

        $subway.on('touchend', '#g-bg', function() {
            if (!tip.routeState) {
                if (!self.touchStatus) {
                    $('#g-select').remove();
                    $('#g-bg').css('display', 'none');
                }
            }
        });

        //触击 非站点又不是换乘点的区域 关闭弹窗
        $subway.on('touchend', function(e) {
            if (!self.touchStatus && !tip.routeState) {
                var target = e.target;
                if (target.getAttribute('class') != 'station_obj' || target.getAttribute('class') != 'nav-img') {
                    tip.closeTip();
                }
            }
        });

        $("#srhlist").on("touchmove", function(e) {
            $("#srh_ipt").blur();
        });
        //触击站点事件：打开一个#city=city代码&station=站点代码的网址;
        $subway.on('touchend', '.station_obj', function (e) {
            e.stopPropagation();
            if (!self.touchStatus && !tip.routeState) {
                var id = $(this).attr('station_id');
                $('.light_box').css('display', 'block');
                //var obj = $("#overlays");
                //if (drwSw.isNearTip) {
                //    drwSw.clearNearTip();
                //}
                //tip.openTip(obj);
                //var center = tip.getStCenter(obj);
                //tip.setCenter(center);
                window.location.hash = '#city=' + SW.cache.curCity.adcode + '&station=' + id;
            }
        });

        //点击弹出层事件：阻止冒泡
        $overlays.on('touchend', '.tip_wrap', function(e) {
            e.stopPropagation();
        });
        //点击弹出层事件：阻止冒泡
        $overlays.on('touchstart', '.tip_wrap', function(e) {
            e.stopPropagation();
        });
        //点击线路图选择器，打开选择器
        $('.filter_btn').on('touchend', function() {
            if (!tip.routeState) {
                self.openFilter();
            }
        });
        //关闭线路选择器
        $('.flier_close_btn').on('touchend', function() {
            self.closeFilter();
        });
        //关闭线路选择器
        $('.light_box').on('touchend', function() {
            self.closeFilter();
        });
        //点击选择器中的路线：关闭选择器，显示地铁，设置屏幕中心点为地铁的中心
        $('.fliter_detail').on('touchend', '.fliter_item', function() {
            if (lockfd) return;
            var line_id = $(this).attr('lineid');
            self.closeFilter();
            self.showFilterLine(line_id);
            var select_obj = $('#g-select');
            tip.setFitview(select_obj);
            var center = self.getFilterCenter();
            self.setCenter(center);
        });
        //阻止选择器中的移动事件
        var fdTimer;
        var lockfd = false;
        $('.fliter_detail').on('touchmove', function(e) {
            e.stopPropagation();
            lockfd = true;
            fdTimer && clearTimeout(fdTimer);
            fdTimer = setTimeout(function() {
                lockfd = false;
            }, 60);
        });

        $citypage.on('touchend', '.cityitem', function() {
            var adcode = $(this).attr('adcode');
            // window.location.hash = "#city=" + adcode;
            // $('#tip-content').remove();
            tip.initCity();
            window.location.hash = "#city=" + adcode;
            // SW.changeCity(adcode);
            tip.hideCitylist();
            $('#subway').show();
        });

        $('.tip_close').on('touchend', function(e) {
            e.stopPropagation();
            tip.closeTip();/*调用closeTip的方法*/
        });

        //$('#back_amap').on('touchend', function() {
        //    tip.goback()
        //});
    },
    //拖动Svg
    mcdragSvg: function(ev) {
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
    mcScaleSvg: function(ev) {
        var self = this;
        var scale;
        var initScale = 1;
        var center = ev.center; //{x:..,y:..}

        if (ev.type == 'pinchstart') {
            initScale = self.transform.scale || 1;
        }

        // $('#transform').html(self.svgOffset.left + ',' + self.svgOffset.top);
        self.realCenter = {
            'x': Number(center.x) - Number(self.svgOffset.left),
            'y': Number(center.y) - Number(self.svgOffset.top)
        };

        // self.realCenter = {
        //     'x': Number(center.x),
        //     'y': Number(center.y)
        // }

        var tmpscale = ev.scale;
        tip.curScale = tmpscale;

        tmpscale = tmpscale > 2 ? 2 : tmpscale;
        tmpscale = tmpscale < 0.5 ? 0.5 : tmpscale;

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
    handleUpdate: function() {
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
    handleReset: function() {
        var self = this;
        self.transform.translate.x = 0;
        self.transform.translate.y = 0;
        self.transform.scale = 1;

        self.handleUpdate();
    },
    //svg更新
    svgUpdate: function(ev) {
        var svg_g = $("#svg-g"),
            $svg_body = $('#subwaySvgBody'),
            svg_g_offset = svg_g.offset(),
            svg_g_l = svg_g_offset.left,
            svg_g_t = svg_g_offset.top,
            svg_g_w = svg_g_offset.width,
            svg_g_h = svg_g_offset.height;

        var canUpdate = true;
        if (svg_g_w > drwSw.w) {
            if (Number(svg_g_l) > Number(drwSw.w) / 2 || Math.abs(Number(svg_g_l)) > (Number(svg_g_w - Number(drwSw.w) / 2))) {
                canUpdate = false;
            }
        } else {
            if (svg_g_l + svg_g_w / 2 < 0 || svg_g_l + svg_g_w / 2 > drwSw.w) {
                canUpdate = false;
            }
        }
        if (svg_g_h > drwSw.h) {
            if (Number(svg_g_t) > Number(drwSw.h) / 2 || Math.abs(Number(svg_g_t)) > (Number(svg_g_h - Number(drwSw.h) / 2))) {
                canUpdate = false;
            }
        } else {
            if (svg_g_t + svg_g_h / 2 < 0 || svg_g_t + svg_g_h / 2 > drwSw.h) {
                canUpdate = false;
            }
        }

        if (canUpdate) {
            // var transform_arr = svg_g.attr("transform").match(/(-?\d+(\.\d+)?)/g),
            //     translate_x = Number(transform_arr[0]),
            //     translate_y = Number(transform_arr[1]),
            //     curscale = transform_arr[2];

            // self.transformState.translate.x = self.transform.translate.x;
            // self.transformState.translate.y = self.transform.translate.y;

            var newTranslate_x = tip.transformState.translate.x + ev.deltaX,
                newTranslate_y = tip.transformState.translate.y + ev.deltaY,
                curscale = tip.transformState.scale;



            if (newTranslate_x && newTranslate_y) {
                // $svg_body.css({
                //     "-webkit-transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + curscale + ")",
                //     "transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + curscale + ")"
                // });
                // $('#transform').html(newTranslate_x + ',' + newTranslate_y);
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

        setTimeout(function() {
            tip.touchStatus = null;
        }, 100);
    },
    //svg缩放更新
    scaleSvgUpdate: function(scale, nav) {
        var self = this;

        enableGesture = true;

        var svg_g = $("#svg-g");
        var $svg_body = $("#subwaySvgBody"),
            translate_x = self.transformState.translate.x,
            translate_y = self.transformState.translate.y,
            curscale = self.transformState.scale;

        tip.allScale = tip.allScale * scale;

        var newscale = scale * curscale;
        if (newscale > 1.3) {
            newscale = 1.3;
            tip.allScale = 1.3;
        }
        if (newscale < 0.3) {
            newscale = 0.3;
            tip.allScale = 0.3;
        }
        scale = newscale / curscale;

        var origin_x = tip.realCenter.x,
            origin_y = tip.realCenter.y;

        if (nav) {
            origin_x = $(window).width() / 2;
            origin_y = $(window).height() / 2;
        } else {
            // if (drwSw.specailPhone) {
            //     origin_x = tip.transformOrigin.x,
            //         origin_y = tip.transformOrigin.y;
            // }
        }


        var moveX = (Number(scale) - 1) * (Number(origin_x) - Number(translate_x)),
            moveY = (Number(scale) - 1) * (Number(origin_y) - Number(translate_y));

        // $('#transformOrigin').html(tip.transformOrigin.x + ',' + tip.transformOrigin.y);

        var newTranslate_x = translate_x - moveX,
            newTranslate_y = translate_y - moveY;
        if (newTranslate_x && newTranslate_y) {
            // $svg_body.css({
            //     "-webkit-transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + newscale + ")",
            //     "transform": "translate(" + newTranslate_x + "px," + newTranslate_y + "px) scale(" + newscale + ")"
            // });
            svg_g.attr("transform", "translate(" + newTranslate_x + "," + newTranslate_y + ") scale(" + newscale + ")");

            self.transformState.translate.x = newTranslate_x;
            self.transformState.translate.y = newTranslate_y;
            self.transformState.scale = newscale;
        }

        tip.handleReset();
        tip.updateTip();
        tip.updateNear();
        tip.updateMarker();
        setTimeout(function() {
            tip.touchStatus = null;
        }, 100);

        setTimeout(function() {
            enableGesture = false;
        }, 100);

    },
    //设置合适的屏幕视图大小
    setFitview: function(obj) {
        var self = this;
        self.scaleSvgUpdate(1 / self.transformState.scale, true);
        var obj_width = obj.width(),
            obj_height = obj.height();
        var topbar_height = SW.cache.param && SW.cache.param.src == 'alipay' ? 0 : $('.top_bar').height(),
            bottombar_height = $('.route_bar').height();
        var full_width = $(window).width(),
            full_height = $(window).height() - topbar_height - bottombar_height;
        var w_rate = full_width / obj_width,
            h_rate = full_height / obj_height,
            scale = 1;
        if (w_rate < 1 || h_rate < 1) {
            scale = w_rate < h_rate ? (w_rate - 0.05) : (h_rate - 0.06);
            self.scaleSvgUpdate(scale, true);
        }
    },
    //获取缩放中心
    getScaleCenter: function(xy1, xy2) {
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
    closeNearTip: function() {
        var self = this;
        var obj = $(".tip-content");
        if (drwSw.isNearTip) {
            if (obj.hasClass('open')) {
                obj.css("display", "none").removeClass("open");
            }
        }
    },
    //加载信息数据
    laodinfo: function(lineId, StationId) {
        var self = this;
        var select_station_dpt_time = [],
            select_station_name, select_station_ref_line = [],
            infowHtml = [];
        select_station_dpt_time = self.stationsInfo[StationId].d;
        select_station_name = self.stations[StationId].n;
        select_station_ref_line = self.stations[StationId].r.split("|");
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
        // 输出地铁站点信息
        var lineid = '';
        for (lineid in current_station) {
            if (current_station.hasOwnProperty(lineid)) {
                if (self.lines[lineid]) {
                    var line_sub_name = self.lines[lineid].la;
                    if (line_sub_name == '') {

                    } else {
                        line_sub_name = '(' + line_sub_name + ')';
                    }
                    infowHtml.push("<div class=\"tip_detail_line\">");
                    infowHtml.push("<label class=\"line-label\" style=\"background-color:#"+self.lines[lineid].cl+"\">地铁" + self.lines[lineid].ln + line_sub_name +"</label>");
                    infowHtml.push("<label class='line-sub-label'></label>");
                    infowHtml.push("<ul class=\"time-item-main\">");
                    for (var j = 0; j < 2; j++) {
                        if (current_station[lineid][j]) {
                            var first_time = current_station[lineid][j].ft;
                            var last_time = current_station[lineid][j].lt;
                            var direction = self.stations[current_station[lineid][j].n];
                            if (first_time.split(':')[0] != '--' || last_time.split(':')[0] != '--') {
                                infowHtml.push("<li class=\"time-item-detail\">");
                                infowHtml.push("<div class=\"train-direct fl\"><label class=\"direct-label\">开往</label><span class=\"direct-name\">" + direction.n + "</span></div>"); //下一站名，表示方向
                                infowHtml.push("<div class=\"train-time fl\">");
                                infowHtml.push("<div class=\"start-time time-box fl\"><label class=\"time-label-start\">首</label><span class\"time\">" + first_time + "</span></div>"); //首发
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
    openTip: function(obj) {
        if (obj && !tip.routeState) {
            var self = this;
            self.curopenStation = obj;

            //设置站点的id和名称及关联线路id
            var select_ref_line_id = obj.attr("line_id");
            var select_station_id = obj.attr("station_id");

            //写首发时间数据
            self.laodinfo(select_ref_line_id, select_station_id);

            //设置站点的id和名称及关联线路id
            var station_name = obj.attr("station_name"),
                station_poiid = obj.attr("station_poiid"),
                station_lon = obj.attr("station_lon"),/*经度*/
                station_lat = obj.attr("station_lat"),/*纬度*/
                station_id = obj.attr("station_id");

            var line_id=obj.attr("line_id").toString();

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
            //打开窗口后就以弹窗为中心
            var topBar=parseInt($(".top_bar").css("height"))/2,
                $tipBodyHeight = $('.tip_body').css("height"),
                bodyHeight = parseInt($tipBodyHeight) / 2,
                Top0ffset=bodyHeight+topBar;
            tip.transformState.translate.y = tip.transformState.translate.y + Top0ffset;
        }
    },
    //设置弹窗的位置属性
    setTipPos: function(obj) {
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
    closeTip: function(status) {
        $('.tip_wrap_out').hide();
        if (!status) {
            tip.opentip = false;
        }
        $('.light_box').css('display', 'none');
        window.location.hash = '#city=' + SW.cache.curCity.adcode;
    },
    //设置中心信息
    setCenter: function(center) {
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

        //计算弹窗高度的1/2
        var topBar=parseInt($(".top_bar").css("height"))/2,
            $tipBodyHeight = $('.tip_body').css("height"),
            bodyHeight = parseInt($tipBodyHeight) / 2,
            Top0ffset=bodyHeight+topBar;

        var moveX = center_x - screen_w *0.5,
            moveY = center_y - screen_h *0.5;

        translate_x = translate_x - moveX;
        translate_y = translate_y - moveY;

        svg_g.attr("transform", "translate(" + translate_x + "," + translate_y + ") scale(" + scale + ")");

        tip.transformState.translate.x = translate_x;
        tip.transformState.translate.y = translate_y;

        var $overlays = $('.overlays');
        var oldLeft = parseInt($overlays.css('left')) || 0,
            oldTop = parseInt($overlays.css('top')) || 0;
        var newLeft = Number(oldLeft) - Number(moveX),
            newTop = Number(oldTop) - Number(moveY)+Top0ffset;

        $overlays.css({
            left: newLeft + 'px',
            top: newTop + 'px'
        });
    },
    //打开路线选择器
    openFilter: function() {
        $('.light_box, .filter_content').css('display', 'block');
    },
    //关闭路线选择器
    closeFilter: function() {
        $('.light_box, .filter_content').css('display', 'none');
    },
    //获取选择后的中心
    getFilterCenter: function() {
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
    cityChange: function() {
        $('#subway').hide();
        tip.creatCitylist();
        tip.showCitylist();
    },
    //创建城市列表
    creatCitylist: function() {
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
    initCity: function() {
        var type = ['start', 'end'];
        //tip.closeRoute(type);
        tip.allScale = 1;
    },
    //显示城市列表
    showCitylist: function() {
        $('#citypage').show();
    },
    //隐藏城市列表
    hideCitylist: function() {
        $('#citypage').hide();
    },

    //获得中心位置
    getStCenter: function(obj) {
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
    //显示过滤后的地铁线
    showFilterLine: function(id) {
        $('#g-select').remove();
        $('#g-bg').css('display', 'block');
        drwSw.drawSelectLine(SW.cache.lines[id], 'select');

        // var typeArr = ['start', 'end'];
        // $.each(typeArr, function(idx, item) {
        //     tip.clearMarker(item);
        //     tip.clearRouteIpt(item);
        //     tip.resetNavData(item);
        // });
    },
    //更新标记
    updateMarker: function() {
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
    updateStartEnd: function(id, type) {
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
    updateTip: function() {
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
    updateNear: function() {
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
    formatTime: function(le) {
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
    unableFlite: function() {
        $('.filter_btn').css({
            'z-index': '10'
        })
    },
    ableFilte: function() {
        $('.filter_btn').css({
            'z-index': '20'
        })
    }
};