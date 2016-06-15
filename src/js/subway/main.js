var getstureState = 0;
var el = document.getElementById('drag_handle');
el.style.transformOrigin = "top left";

var tip = {
    refreshTimer:{},
    refreshstate:0,
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight,
    curCity:SW.cache.curCity,
    //host: "http://m.amap.com/",
    //isHighlight: false,
    //isInfoShow: false,
    stationsInfo: SW.cache.stationsInfo,/*几个数据接口*/
    stations: SW.cache.stations,
    lines: SW.cache.lines,
    //tempTrafficinfo:SW.cache.tempTrafficinfo,
    station_w: 26,
    //dragObjXY: {}, //拖拽div时的实时xy
    //dragX: null,
    //dragY: null,
    //onePoint: {}, //单手touch时的初始xy
    //twoPoint1: {}, //双手touch时的初始x1y1
    //twoPoint2: {}, //双手touch时的初始x2y2
    //twoOriginPointDis: null, //双手touch时的两手指的初始距离
    touchStatus: null, //当前touch状态：drag, scale
    curScale: 1, //当前缩放级别
    allScale: 1,
    //zoomCenter: null, //搜索初始中心点
    //dragHandle: $("#drag_handle"), //touch对象
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
    //dragObjOffset: {
    //    x: null,
    //    y: null
    //},
    opentip: false,
    //curopenStation: null,
    //routeInfo: { //路线规划起始点信息
    //    start: null,
    //    end: null
    //},
    //routeDtailInfo: {
    //    start: null,
    //    end: null
    //},
    //routeId: {
    //    start: null,
    //    end: null
    //},
    //navDrwData: {
    //    linesbar: [],
    //    lines: {},
    //    stations: []
    //},
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
    //pathData: null,
    //初始化事件绑定信息
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
        var $refresh=$(".refresh_btn");
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

        $subway.on('touchend', 'g', function() {
            if (!self.touchStatus) {
                if ($(this).hasClass('line_name')) {
                    //线路选择器显示线路名
                    var line_id = $(this).attr('lineid');
                    var SW_line_name = SW.cache.lines[line_id].ln;
                    var line_name=SW_line_name.split("/")[0].toString().substr(0,4);
                    $(".filter_btn").html(line_name);
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
                    $(".filter_btn").html("线路图");
                }
            }
        });

        //触击 非站点又不是换乘点的区域 关闭弹窗
        $subway.on('touchend','#drag_handle'&&".light_box",function(e) {
            if (!self.touchStatus && !tip.routeState) {
                var target = e.target;
                if (target.getAttribute('class') != 'station_obj' || target.getAttribute('class') != 'nav-img') {
                    tip.closeTip();
                    tip.closehelpBox();
                }
            }
        });



        //$("#srhlist").on("touchmove", function(e) {
        //    $("#srh_ipt").blur();
        //});
        //触击站点事件：打开一个#city=city代码&station=站点代码的网址;
        $subway.on('touchend', '.station_obj', function (e) {
            e.stopPropagation();
            if (!self.touchStatus && !tip.routeState) {
                var id = $(this).attr('station_id');
                self.closeFilter();
                $('.light_box').css('display', 'block');
                //var obj = $("#overlays");
                //if (drwSw.isNearTip) {
                //    drwSw.clearNearTip();
                //}
                //tip.openTip(obj);
                //var center = tip.getStCenter(obj);
                //tip.setCenter(center);
                //console.log(obj,center);
                window.location.hash = '#city=' + SW.cache.curCity.adcode + '&station=' + id;
            }
        });

        //点击弹出层事件：阻止冒泡,接受事件,但是无动作
        $overlays.on('touchend', '.tip_wrap', function(e) {
            e.stopPropagation();
        });
        //点击弹出层事件：阻止冒泡
        $overlays.on('touchstart', '.tip_wrap', function(e) {
            e.stopPropagation();
        });

        $(".top_bar").on("touchend", function () {
            tip.closeTip();
            tip.closeFilter();
        });

        $('.light_box').on('touchmove', function(ev) {
            ev.preventDefault();
        });

        $('#loading').on('touchmove', function(ev) {
            ev.preventDefault();
        });
        //关闭背景暗箱
        $('.light_box').on('touchend', function() {
            self.closeFilter();
            self.closehelpBox()
        });

        $refresh.on('touchend', function (ev) {
            ev.stopPropagation();
            if(self.refreshstate==0){
                self.refreshstate=1;
                var $refresh = $(".refresh_btn");
                $refresh.addClass("refresh_active");
                var city_code = SW.cache.curCity.adcode;
                var city_name = SW.fileNameData[SW.cache.curCity.adcode];
                var status = 'normal';
                SW.loadTraffic(city_code, city_name);
                //console.log("add前",drwSw.currLines);
                drwSw.drwTrafficLinesDefer(drwSw.currLines, status);
            }else {
                ev.stopPropagation();
            }
        });

        //点击线路图选择器，打开选择器
        $('.filter_btn').on('touchend', function() {
            self.closehelpBox();
            if (!tip.routeState) {
                self.openFilter();
            }
        });
        //点击选择器中的路线：关闭选择器，显示地铁，设置屏幕中心点为地铁的中心
        $('.fliter_detail').on('touchend', '.fliter_item', function() {
            if (lockfd) return;
            var line_id = $(this).attr('lineid');
            var line_name=$(this).attr('name');
            var center={};
            if (line_id == "caption-allLines") {
                self.closeFilter();
                $(".filter_btn").html("线路图");
                $('#g-bg').css('display','none');
                //获取中心相对于实际svg图像的偏移量
                var hash = decodeURIComponent(window.location.hash).replace(/^\#/, '');
                var param = SW.param2json(hash);
                var adcode = param.city && param.city.substr(0, 4);
                var curCity=SW.cache.cities[adcode];
                var centerOffset={};
                centerOffset.x=curCity.offset.split(",")[0];
                centerOffset.y=curCity.offset.split(",")[1];
                //设置新的中心
                var $Svg=$('#svg-g');
                tip.setFitview($Svg);
                var $Svg_offset = $Svg.offset();
                var $Svg_h = (document.getElementById('svg-g').getBBox().height) * self.allScale,
                    $Svg_w = (document.getElementById('svg-g').getBBox().width*1.5-centerOffset.x) * tip.allScale;
                center.x = $Svg_offset.left + $Svg_w/2;
                center.y = $Svg_offset.top + $Svg_h/2;
                tip.setCenter(center);

            } else {
                self.closeFilter();
                $(".filter_btn").html(line_name);
                self.showFilterLine(line_id);
                var select_obj = $('#g-select');
                tip.setFitview(select_obj);
                center = self.getFilterCenter();
                self.setCenter(center);
            }
        });

        //处理选择器中的移动事件
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

        $(".help_btn").on("touchend", function (e) {
            e.stopPropagation();
            self.closeFilter();
            $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
            $(".refresh_box").hide().removeClass("refresh_box_show").css("display", "none");
            tip.openhelpBox();
        });
        $(".help_close").on("touchend", function (e) {
            e.stopPropagation();
            tip.closehelpBox();
        });


        $('.tip_close').on('touchend', function(e) {
            e.stopPropagation();
            tip.closeTip();/*调用closeTip的方法*/
        });

        $('#back_amap').on('touchend', function() {
            tip.goback()
        });

        //导航栏中的城市名的触摸事件
        $('.city_list_btn').on('touchend', function() {
            tip.cityChange();
        });

        //$citypage.on('touchend', '#back_subway', function() {
        //    // 如果没有地铁图，点击城市列表后退直接退回路线视图
        //    if (!SW.subwayFlag) {
        //        // history.go(-1);
        //        // var hostname = window.location.origin;
        //        // window.location.href = hostname + '/navigation/index/';
        //        window.location.href = tip.host + 'navigation/index/';
        //    } else {
        //        $('#subway, .filter_btn').show();
        //        tip.hideCitylist();
        //    }
        //});

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

        //$(".route_startend").on('touchend', function() {
        //    var type = $(this).closest('.route_ipt').attr('srhtype');
        //    tip.showSrhPage(type);
        //});

        //$("#setSwitch").on("touchend", function() {
        //    var start_id = tip.routeId.start,
        //        end_id = tip.routeId.end;
        //    if (start_id && end_id) {
        //        var startInfo = $.extend(true, {}, tip.routeInfo.start),
        //            endInfo = $.extend(true, {}, tip.routeInfo.end);
        //        var typeArr = ['start', 'end'];
        //        // tip.closeRoute(typeArr);
        //
        //        tip.setStartEnd(end_id, 'start', endInfo);
        //        tip.setStartEnd(start_id, 'end', startInfo);
        //
        //        if (tip.routeInfo && tip.routeInfo.start && tip.routeInfo.end) {
        //            var param = {
        //                'city': SW.cache.curCity.adcode,
        //                'startid': tip.routeInfo.start.poiid,
        //                'startname': tip.routeInfo.start.name,
        //                'destid': tip.routeInfo.end.poiid,
        //                'destname': tip.routeInfo.end.name
        //            };
        //            window.location.hash = '#' + $.param(param);
        //        }
        //    }
        //});

        //$('.route_close').on('touchend', function() {
        //    var type = $(this).closest('.route_ipt').attr('srhtype');
        //    var placeholder = {
        //        'start': '输入起点',
        //        'end': '输入终点'
        //    };
        //    $('.route_close_' + type).addClass('hidden');
        //    $('.route_' + type).html(placeholder[type]).addClass('route_placeholder');
        //    tip.closeRoute([type]);
        //});
        //
        //$('.route_close_btn').on('touchend', function(e) {
        //    e.preventDefault();
        //    var typeArr = ['start', 'end'];
        //    tip.closeRoute(typeArr);
        //});

        //$srh.on('input', '#srh_ipt', function() {
        //    var value = $(this).val();
        //    tip.getSug(value);
        //});
        //
        //$srh.on('touchend', '#back_ipt', function() {
        //    var type = $(this).closest('#srhpage').attr('type');
        //    tip.hideSrhPage();
        //});

        //$srh.on('click', '.st_item', function() {
        //    var $this = $(this);
        //    var id = $this.data('stid'),
        //        poiid = $(this).data('poiid'),
        //        name = $this.data('name'),
        //        lon = $this.data('lon'),
        //        lat = $this.data('lat');
        //    var type = $this.closest('#srhpage').attr('type');
        //    var info = {
        //        'name': name,
        //        'poiid': poiid,
        //        'lon': lon,
        //        'lat': lat
        //    };
        //    tip.hideSrhPage();
        //    tip.setStartEnd(id, type, info);
        //    var center = tip.getStCenter($('#st-' + id));
        //    tip.setCenter(center);
        //    tip.closeTip();
        //    if (tip.routeInfo && tip.routeInfo.start && tip.routeInfo.end) {
        //        var param = {
        //            'city': SW.cache.curCity.adcode,
        //            'startid': tip.routeInfo.start.poiid,
        //            'startname': tip.routeInfo.start.name,
        //            'destid': tip.routeInfo.end.poiid,
        //            'destname': tip.routeInfo.end.name
        //        };
        //        window.location.hash = '#' + $.param(param);
        //    }
        //});



        //$('.route_bar').on('click', function() {
        //    // if(SW.param.src != 'alipay'){
        //    tip.searchRouteDetail();
        //    // }
        //});
    },
    refreshShow: function () {
        $(".refresh_box").css("display", "block").addClass("refresh_box_show");
        $(".refresh_time_text").css("display", "block").addClass("refresh_time_text_show");
        SW.loadingOver();
        //4秒后隐藏信息
        clearTimeout(tip.refreshTimer);
        tip.refreshTimer = setTimeout(function () {
            $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
            $(".refresh_box").removeClass("refresh_box_show").css("display", "none");
            tip.refreshstate = 0;
        }, 4000);
    },
    refreshSuccess: function () {
        $('.refresh_time_text').html("更新于"+SW.refreshStatus);
        //去除加载状态
        var $refresh=$(".refresh_btn");
        $refresh.removeClass("refresh_active");
        tip.refreshstate = 1;
        tip.refreshShow();
    },
    refreshError: function () {
        var $refresh=$(".refresh_btn");
        $refresh.removeClass("refresh_active");
        $(".refresh_error").css("display","block");
        setTimeout(function () {
            $(".refresh_error").css("display","none");
            tip.refreshstate = 0;
        },1500);
    },
    stoprefresh:function (){
        $(".refresh_btn").hide();
        $(".refresh_time_text").removeClass("refresh_time_text_show").css("display", "none");
        $(".refresh_box").hide().removeClass("refresh_box_show").css("display", "none");
    },
    openhelpBox: function () {
        $('.light_box').css('display', 'block');
        var $helpContent=$(".help_content");
        var width=parseInt($helpContent.css("width"));
        var left=(tip.w-width)/2+"px";
        $helpContent.css({"left":left});
        $helpContent.css("display","block");
        $('.tip_wrap_out').hide();
        $(".refresh_btn").hide();
        $(".refresh_time").hide();
    },
    closehelpBox: function () {
        $('.light_box').css('display', 'none');
        $(".help_content").css("display","none");
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
    //获取距离
    //getDistance: function(xy1, xy2) {
    //    var distance = null;
    //    if (xy1 && xy2) {
    //        var x1 = eval(xy1.x),
    //            y1 = eval(xy1.y),
    //            x2 = eval(xy2.x),
    //            y2 = eval(xy2.y);
    //        var xdiff = x2 - x1,
    //            ydiff = y2 - y1;
    //        distance = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
    //    }
    //    return distance;
    //},
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
    loadinfo: function(lineId, StationId) {
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
                    infowHtml.push("<label class=\"line-name\">" + self.lines[lineid].ln + line_sub_name +"</label>");
                    infowHtml.push("<label class='line-white-label'></label>");
                    infowHtml.push("<ul class=\"time-item-main\">");
                    for (var j = 0; j < 2; j++) {
                        if (current_station[lineid][j]) {
                            var first_time = current_station[lineid][j].ft;
                            var last_time = current_station[lineid][j].lt;
                            first_time=self.resetTime(first_time);
                            last_time=self.resetTime(last_time);
                            var direction = self.stations[current_station[lineid][j].n];
                            if (first_time.split(':')[0] != '--' || last_time.split(':')[0] != '--') {
                                infowHtml.push("<li class=\"time-item-detail\">");
                                infowHtml.push("<div class=\"train-direct fl\"><span class=\"direct-name\">" + direction.n + "</span><label class=\"direct-label\">方向</label></div>"); //下一站名，表示方向
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
    openTip: function(obj) {
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
            //打开窗口后就以弹窗的1/3为中心
            var Top0ffset=self.topOffset(0.4);
            tip.transformState.translate.y = tip.transformState.translate.y + Top0ffset;
        }
    },
    topOffset: function (offset) {
        var topBar=parseInt($(".top_bar").css("height"))/2,
            $tipBodyHeight = $('.tip_body').css("height"),
            bodyHeight = parseInt($tipBodyHeight)*offset;
            return bodyHeight+topBar
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

        var moveX = center_x - screen_w *0.5,
            moveY = center_y - screen_h *0.5;

        translate_x = translate_x - moveX;
        translate_y = translate_y - moveY;

        svg_g.attr("transform", "translate(" + translate_x + "," + translate_y + ") scale(" + scale + ")");

        tip.transformState.translate.x = translate_x;
        tip.transformState.translate.y = translate_y;

        //选取偏移量
        var Top0ffset=self.topOffset(0.4);

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
        var $filterContent=$(".filter_content");
        $('.light_box, .filter_content').css('display', 'block');
        var width=parseInt($filterContent.css("width")),
            height=parseInt($filterContent.css("height"));
        var left=(tip.w-width)/2+"px",
            top=(tip.h-height)/2+"px";
        $filterContent.css({"top":top,"left":left});
        //线路选择器不能与弹窗同时存在
        $('.tip_wrap_out').hide();
        tip.stoprefresh();
    },
    //关闭路线选择器
    closeFilter: function() {
        $('.light_box, .filter_content').css('display', 'none');
        $(".refresh_btn").show();
        $(".refresh_box").show();
        $(".refresh_time").show();
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

    //showSrhPage: function(type) {
    //    $('.filter_btn').hide();
    //    var placeholder_txt = '输入起点';
    //    var $srhpage = $('#srhpage');
    //    if (type == 'end') {
    //        placeholder_txt = '输入终点'
    //    }
    //    $srhpage.attr('type', type);
    //    $srhpage.find('#srh_ipt').attr('placeholder', placeholder_txt).val('');
    //    $srhpage.find('#srhlist').html(' ').addClass('hidden');
    //    $srhpage.find('.sug_err').addClass('hidden');
    //    $('#subway').hide();
    //    $srhpage.show();
    //    $srhpage.find('#srh_ipt').focus();
    //},
    //hideSrhPage: function() {
    //    $('.filter_btn').show();
    //    var $srhpage = $('#srhpage');
    //    $srhpage.hide();
    //    $('#subway').show();
    //},
    //获得对象中心位置
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
    //获取导航中心
    //getNavCenter: function() {
    //    var self = this;
    //    var select_g_offset = $('#g-nav').offset();
    //    var select_g_h = document.getElementById("g-nav").getBBox().height * self.allScale,
    //        select_g_w = document.getElementById("g-nav").getBBox().width * self.allScale;
    //
    //    return {
    //        'x': select_g_offset.left + select_g_w / 2,
    //        'y': select_g_offset.top + select_g_h / 2
    //    }
    //},
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
    //重设导航数据
    //resetNavData: function(type) {
    //    tip.routeInfo[type] = null;
    //    tip.routeId[type] = null;
    //    tip.navDrwData.linesbar = [];
    //    tip.navDrwData.lines = {};
    //    tip.navDrwData.stations = {};
    //    if (!tip.routeId.start && !tip.routeId.end) {
    //        tip.fromendState = false;
    //    }
    //},
    //创建导航画图数据
    //createNavDrwData: function(param) {
    //    var self = this;
    //    var busList = param.buslist[0];
    //    var navList = busList.segmentlist;
    //    var navSt = SW.cache.navStations;
    //    var navLines = SW.cache.navlines;
    //    self.routeDtailInfo.start = busList.spoi;
    //    self.routeDtailInfo.end = busList.epoi;
    //    var stationName = [];
    //    for (var i = 0; i < navList.length; i++) {
    //        var lineid = navList[i].busid;
    //        var startName = navList[i].startname;
    //        var endName = navList[i].endname;
    //        if (navList[i].passdepotname != '') {
    //            stationName = navList[i].passdepotname.split(' '); //st
    //        } else {
    //            stationName = [];
    //        }
    //        stationName.unshift(startName);
    //        stationName.push(endName);
    //
    //        for (var j = 0; j < stationName.length; j++) {
    //            self.navDrwData.stations[navSt[stationName[j]].si] = navSt[stationName[j]];
    //        }
    //        var navline = $.extend(true, {}, navLines[lineid]);
    //        var sortedName = self.sortStation(stationName, navline, lineid);
    //        var coords = self.setLineCoords(sortedName, navline);
    //        navline.c = coords;
    //        self.navDrwData.lines[navline.ls] = navline;
    //        tip.navDrwData.linesbar.push(navline);
    //    }
    //},
    //站点排序
    //sortStation: function(stationName, navline, lineid) {
    //    var self = this;
    //    if (navline) {
    //        var navSt = navline.stname;
    //        var startIndx = navSt.indexOf(stationName[0]);
    //        if (navSt[startIndx] != stationName[1]) {
    //            return stationName.reverse();
    //        } else {
    //            return stationName
    //        }
    //    } else {
    //        $('.route_close').triggerHandler('touchend');
    //
    //    }
    //},
    //设置线路的坐标
    //setLineCoords: function(st, navline) {
    //    var navStPxl = [],
    //        navStRs = [],
    //        navCoord = null,
    //        navSt = SW.cache.navStations,
    //        line_id = navline.ls,
    //        line_coord = [].concat(navline.c),
    //        line_loop = navline.lo; //1为环线
    //    for (var m = 0; m < st.length; m++) {
    //        var _navst = navSt[st[m]];
    //        navStPxl.push(_navst.p);
    //        var _navst_rf = _navst.r.split('|');
    //        var rf_index = _navst_rf.indexOf(line_id);
    //        navStRs.push(_navst.rs.split('|')[rf_index]);
    //    }
    //    var startNavSt = navStRs[0],
    //        secondNavSt = navStRs[1],
    //        endNavSt = navStRs[navStRs.length - 1];
    //    if (line_loop == '1') {
    //        var line_coord_tmp = [].concat(line_coord);
    //        line_coord_tmp.shift();
    //        line_coord = line_coord.concat(line_coord_tmp);
    //        aa = line_coord;
    //        var line_slice = [].concat(line_coord);
    //        var coordStartIndex = line_coord.indexOf(startNavSt);
    //        if (navStRs.length == 2) {
    //            var coordEndIndex = line_coord.indexOf(endNavSt, coordStartIndex);
    //            var dis1 = Math.abs(coordEndIndex - coordStartIndex);
    //            var coordNextStartIndex = line_coord.indexOf(startNavSt, coordEndIndex);
    //            var dis2 = Math.abs(coordNextStartIndex - coordEndIndex);
    //            if (dis1 > dis2) {
    //                coordStartIndex = coordEndIndex;
    //                coordEndIndex = coordNextStartIndex;
    //            }
    //        } else {
    //            line_coord = line_coord.slice(coordStartIndex);
    //
    //            var coordStartIndex = line_coord.indexOf(startNavSt),
    //                coordSecondIndex = line_coord.indexOf(secondNavSt),
    //                coordEndIndex = line_coord.indexOf(endNavSt);
    //
    //            if (coordSecondIndex > coordEndIndex) {
    //                coordStartIndex = coordEndIndex;
    //                line_coord = line_coord.slice(coordStartIndex);
    //
    //                coordStartIndex = line_coord.indexOf(endNavSt);
    //                coordEndIndex = line_coord.indexOf(startNavSt);
    //            }
    //        }
    //
    //    } else {
    //        var coordStartIndex = line_coord.indexOf(startNavSt),
    //            coordEndIndex = line_coord.indexOf(endNavSt);
    //    }
    //
    //    if (coordStartIndex < coordEndIndex) {
    //        navCoord = line_coord.slice(coordStartIndex, coordEndIndex + 1)
    //    } else {
    //        navCoord = line_coord.slice(coordEndIndex, coordStartIndex + 1)
    //    }
    //
    //    return navCoord;
    //},
    //设置起始点
    //setStartEnd: function(id, type, info) {
    //    var self = this;
    //    var name = info.name || info.attr('name');
    //    var route_info = {
    //        'name': name,
    //        'poiid': info.poiid || info.attr('poiid'),
    //        'lon': info.lon || info.attr('lon'),
    //        'lat': info.lat || info.attr('lat')
    //    };
    //
    //    if (type == 'end' && tip.routeId.start == id) {
    //        tip.routeId.start = null;
    //        tip.routeInfo.start = null;
    //        tip.clearMarker('start');
    //        var placeholder = '输入起点';
    //        $('.route_start').html(placeholder).addClass('route_placeholder');
    //        tip.routeInfo.end = route_info;
    //        tip.routeId.end = id;
    //        $('#setStart').find('.route_close').addClass('hidden');
    //    } else if (type == 'start' && tip.routeId.end == id) {
    //        tip.routeId.end = null;
    //        tip.routeInfo.end = null;
    //        tip.clearMarker('end');
    //        var placeholder = '输入终点';
    //        $('.route_end').html(placeholder).addClass('route_placeholder');
    //        tip.routeInfo.start = route_info;
    //        tip.routeId.start = id;
    //        $('#setEnd').find('.route_close').addClass('hidden');
    //    } else {
    //        tip.routeInfo[type] = route_info;
    //        tip.routeId[type] = id;
    //    }
    //    tip.setStartEndIpt(name, type);
    //    tip.setStartEndIcon(id, type);
    //},
    //
    //setStartEndIpt: function(name, type) {
    //    var $srh_item = null;
    //    if (type == 'start') {
    //        $srh_item = $('#setStart')
    //    } else if (type == 'end') {
    //        $srh_item = $('#setEnd')
    //    }
    //    $srh_item.find('.route_startend').html(name).removeClass('route_placeholder');
    //    $srh_item.find('.route_close').removeClass('hidden');
    //},
    //设置起始点的图标
    //setStartEndIcon: function(id, type) {
    //    var self = this;
    //    var obj = null;
    //    if ($('#st-' + id).length > 0) {
    //        obj = $('#st-' + id)
    //    } else {
    //        obj = self.curStation;
    //    }
    //
    //    var obj_left = obj && obj.offset().left,
    //        obj_top = obj && obj.offset().top;
    //
    //    var $overlays = $('.overlays');
    //    var overlaysLeft = parseInt($overlays.css('left')) || 0,
    //        overlaysTop = parseInt($overlays.css('top')) || 0;
    //
    //    var pos = {
    //        left: obj_left + self.station_w * self.allScale / 2 - overlaysLeft,
    //        top: obj_top + self.station_w * self.allScale / 2 - overlaysTop
    //    };
    //
    //    self.clearMarker(type);
    //    self.addMarker(type, pos);
    //},
    //增加标记
    //addMarker: function(type, pos) {
    //    var self = this;
    //    var marker_wrap = $('#nav_' + type);
    //    var marker_out = $('<div class="marker-out">');
    //    var marker = '<img class="nav-img" src="./img/subway/' + type + '-marker.png"/>';
    //    marker_wrap.append(marker_out);
    //    marker_out.append(marker);
    //    var marker_top = pos.top;
    //    var marker_left = pos.left;
    //
    //    marker_wrap.css({
    //        top: marker_top + 'px',
    //        left: marker_left + 'px'
    //    });
    //
    //    tip.fromendState = true;
    //},
    //清楚标记
    clearMarker: function(type) {
        var self = this;
        if (type) {
            var marker = $('#nav_' + type).find('.marker-out');
            if (marker.length > 0) {
                marker.remove();
            }
        }
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
    //显示路线的标题
    //showRouteTitle: function() {
    //    var start_name = tip.routeInfo.start.name,
    //        end_name = tip.routeInfo.end.name;
    //    $('#start_name_title').html(start_name);
    //    $('#end_name_title').html(end_name);
    //    $('.route_title_wrap').css('display', 'inline-block');
    //    $('.city_name').hide();
    //},
    //隐藏路线的标题
    //hideRouteTitle: function() {
    //    $('.route_title_wrap').hide();
    //    $('.city_name').show();
    //},
    //显示航线条
    //showRouteBar: function(data) {
    //    var bus = data.buslist[0];
    //    if (bus) {
    //        var lines = tip.navDrwData.linesbar;
    //        var line_name_arr = [];
    //        for (var i = 0; i < lines.length; i++) {
    //            line_name_arr.push(lines[i].ln);
    //        }
    //        var line_name = line_name_arr.join(' > ');
    //        var fee = bus.expense + '元',
    //            time = tip.formatTime(bus.expensetime),
    //            stop_count = 0;
    //        for (var j = 0; j < bus.segmentlist.length; j++) {
    //            stop_count += Number(bus.segmentlist[j].passdepotcount) + 1;
    //        }
    //        var line_info = time + ' | ' + stop_count + '站 | ' + fee;
    //
    //        $('.route_line').html(line_name);
    //        $('.route_info').html(line_info);
    //        $('.route_bar').show();
    //    }
    //},
    // 过滤地铁数据中重复站名
    //uniqSubwayName: function(data) {
    //    var obj = {};
    //
    //    data.forEach(function(item) {
    //        // item.n 是地铁站点名字
    //        obj[item.n] = 1
    //    });
    //
    //    return Object.keys(obj)
    //},
    //隐藏航线条
    //hideRouteBar: function() {
    //    $('.route_bar').hide();
    //},
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
    },
    resetTime: function (timeString) {
        if(timeString!="--:--"){
            var hours=Number(timeString.split(":")[0]);
            var mins=Number(timeString.split(":")[1]);
            if(hours<10 && hours>0){
                hours="0"+hours;
            }else if(hours==0){
                hours="00";
            }else{
                hours=hours;
            }

            if(mins<10 && mins>0){
                mins="0"+mins;
            }else if(mins==0){
                mins="00";
            }else{
                mins=mins;
            }

            return hours+":"+mins;
        }else{
            return timeString;
        }
    },
    //航线
    //route: function() {
    //    var self = this;
    //    if (tip.routeInfo && tip.routeInfo.start && tip.routeInfo.end) {
    //        $('#g-select').remove();
    //        $('#g-bg').css('display', 'none');
    //        tip.clearRoute();
    //        SW.loading();
    //        var cbk = function(res) {
    //            var data = res;
    //            SW.loadingOver();
    //            // data.code =  '1';
    //            // data.result = false;
    //            // if ((data.code == '1' && data.result == false) && !(location.href.indexOf('%E6%B2%A1%E6%9C%89%E5%8B%BA%E5%AD%90') != -1 && document.referrer.indexOf('amap.com/verify') != -1)) {
    //            //     //被verify接口block到的请求
    //            //     window.location.href = location.origin + tip.verify + encodeURIComponent(location.href) + '&channel=mo';
    //
    //            // } else
    //            if (data.count == '1') {
    //                tip.pathData = data;
    //                tip.createNavDrwData(data);
    //                $('#g-bg').css('display', 'block');
    //                $('.route_close_btn').removeClass('hidden');
    //                drwSw.drawNavLine(tip.navDrwData);
    //                // tip.showRouteTitle();
    //                tip.showRouteBar(tip.pathData);
    //                var nav_obj = $('#g-nav');
    //                tip.setFitview(nav_obj);
    //                var center = self.getNavCenter();
    //                tip.setCenter(center);
    //
    //                tip.unableFlite();
    //                tip.routeState = true;
    //
    //            } else {
    //                $('.route_close').triggerHandler('touchend')
    //                tip.routeState = false;
    //            }
    //        };
    //        tip.getRouteData(cbk);
    //    }
    //},
    clearRouteIpt: function(type) {
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
    //清除航线
    //clearRoute: function() {
    //    $('#g-nav').remove();
    //    $('#g-bg').css('display', 'none');
    //    $('.route_close_btn').addClass('hidden');
    //    tip.navDrwData.linesbar = [];
    //    tip.navDrwData.lines = {};
    //    tip.navDrwData.stations = {};
    //},
    //关闭航线
    //closeRoute: function(typeArr) {
    //    $('#g-nav').remove();
    //    $('#g-bg').css('display', 'none');
    //    window.location.hash = '#city=' + SW.cache.curCity.adcode;
    //    $.each(typeArr, function(idx, item) {
    //        //tip.clearMarker(item);
    //        //tip.clearRouteIpt(item);
    //        //tip.resetNavData(item);
    //    });
    //    //tip.hideRouteTitle();
    //    //tip.hideRouteBar();
    //    tip.ableFilte();
    //    $('.route_close_btn').addClass('hidden');
    //    tip.routeState = false;
    //},
    //获取路线信息数据,用于导航
    //getRouteData: function(cbk) {
    //    var start_info = tip.routeInfo.start,
    //        end_info = tip.routeInfo.end;
    //    $.ajax({
    //        url: tip.host + 'service/navigation/busExt?',
    //        data: {
    //            "x1": start_info.lon,
    //            "y1": start_info.lat,
    //            "x2": end_info.lon,
    //            "y2": end_info.lat,
    //            "poiid1": start_info.poiid,
    //            "poiid2": end_info.poiid,
    //            'uuid': tip.UUID(),
    //            "type": "6",
    //            "Ver": 3
    //        },
    //        type: 'get',
    //        method: 'get',
    //        dataType: "jsonp",
    //
    //        success: function(data) {
    //            // debugger
    //            cbk(data);
    //        },
    //        error: function() {
    //            alert('\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5');
    //        }
    //    });
    //
    //},
    //获取路线的详细信息
    //searchRouteDetail: function() {
    //    //http://30.28.183.162/navigation/busdetail/saddr=116.401216,39.90778,%E5%A4%A9%E5%AE%89%E9%97%A8%E4%B8%9C(%E5%9C%B0%E9%93%81%E7%AB%99),BV10006499&daddr=116.394193,39.976953,%E5%8C%97%E5%9C%9F%E5%9F%8E(%E5%9C%B0%E9%93%81%E7%AB%99),BV10013465&src=subway
    //    var detailHost = 'http://m.amap.com',
    //        detailPath = '/navigation/busdetail/';
    //    var startPoi = [
    //            tip.routeDtailInfo.start.x,
    //            tip.routeDtailInfo.start.y,
    //            tip.routeInfo.start.name,
    //            tip.routeInfo.start.poiid
    //        ],
    //        endPoi = [
    //            tip.routeDtailInfo.end.x,
    //            tip.routeDtailInfo.end.y,
    //            tip.routeInfo.end.name,
    //            tip.routeInfo.end.poiid
    //        ];
    //
    //
    //    window.location.href = detailHost + detailPath + 'saddr=' + startPoi.join(',') + '&daddr=' + endPoi.join(',') + '&src=subway';
    //},
    //后退
    //goback: function() {
    //    if (tip.routeState) {
    //        var type = ['start', 'end'];
    //        tip.closeRoute(type);
    //    } else {
    //        // var hostname = window.location.origin;
    //        // window.location.href = hostname + '/navigation/index/';
    //        window.location.href = tip.host + 'navigation/index/';
    //        // history.go()
    //    }
    //},
    //getSug: function(sug) {
    //    var sug = sug.toLowerCase();
    //    var curAdcode = SW.cache.curCity.adcode;
    //    var sugArr = SW.cache.sug[curAdcode];
    //    if (sug != '') {
    //        if (sugArr) {
    //            var sug_length = sug.length;
    //            var new_sug = [];
    //            for (var key in sugArr) {
    //                var keys = key.split('|');
    //                for (var i = 0; i < keys.length; i++) {
    //                    var sug_match = keys[i].substr(0, sug_length);
    //                    if (sug_match == sug) {
    //                        new_sug.push(sugArr[key]);
    //                            // 否则会出现两份 exp. T2航站楼
    //                        break
    //                    }
    //                }
    //            }
    //            tip.showSug(new_sug, sug);
    //        }
    //    } else {
    //        $('#srhlist').html(' ').addClass('hidden');
    //    }
    //},
    //showSug: function(sugarr, sug) {
    //    var $suglist = $('#srhlist'),
    //        $sugerr = $('.sug_err');
    //    if (sugarr.length > 0) {
    //        var html = [];
    //        var lines = SW.cache.lines;
    //        $.each(sugarr, function(idx, item) {
    //            var rf = item.r.split('|');
    //            var subhtml = '';
    //            $.each(rf, function(subidx, subitem) {
    //                var curline = lines[subitem];
    //                if (curline) {
    //                    var knstyle = ''
    //                    if (!/^\d+$/.test(curline.kn)) {
    //                        var knstyle = 'knlong'
    //                    }
    //                    subhtml += '<li class="rfline ' + knstyle + '" style="background:#' + curline.cl + '">' + curline.ln + '</li>'
    //                }
    //            });
    //            var name = item.n;
    //            if (name.indexOf(sug) >= 0) {
    //                var sugname = '<b class="match">' + sug + '</b>' + name.substring(sug.length, name.length);
    //            } else {
    //                var sugname = name;
    //            }
    //
    //            var lon = item.sl.split(',')[0],
    //                lat = item.sl.split(',')[1];
    //
    //            html.push('<li class="st_item" data-poiid="' + item.poiid + '" data-stid="' + item.si + '" data-name="' + item.n + '" data-lon="' + lon + '" data-lat="' + lat + '" data-rf="' + item.r + '"><div class="st_item_wrap"><span class="st_name">' + sugname + '</span><ul class="st_rfline">' + subhtml + '</ul><div class="clr"></div></div></li>');
    //        });
    //        $sugerr.addClass('hidden');
    //        $suglist.html(' ').removeClass('hidden').html(html.join(''));
    //    } else {
    //        $suglist.html(' ').addClass('hidden');
    //        $sugerr.removeClass('hidden');
    //    }
    //},
    //UUID: function() {
    //    var storage = window.localStorage;
    //    if(enabledLocalstorage){
    //       var uuid = storage.getItem('subway-uuid');
    //    }
    //
    //    if (!uuid) {
    //        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //            var r = Math.random() * 16 | 0;
    //            var v = c == 'x' ? r : (r & 0x3 | 0x8);
    //            return v.toString(16);
    //        });
    //        if(enabledLocalstorage){
    //            storage.setItem('subway-uuid', uuid);
    //        }
    //        this.uuid = uuid;
    //    }
    //
    //    return uuid;
    //
    //}
};