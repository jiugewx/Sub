/**
 * Created by xinye on 16/5/19.
 */

var $=require("../lib/zepto");
require("../lib/hammer.js");
var tip=require("./tip");
var drwSw=require("./drwMain");
var AllData=require("./AllData");
var DrwTraf=require("./drwtraffic");

var bindEv={
    //初始化事件绑定信息
    init: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        var self=this;
        document.addEventListener('touchstart', function() {});
        var $refresh=$(".refresh_btn");
        var $subway = $('#subway');
        var $citypage = $('#citypage');
        var $overlays = $('#overlays');
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
            tip.touchStatus = 'pan';
            lastAction = "pan";
            tip.mcdragSvg(ev);
        });

        mc.on("pinchstart pinchmove", function(ev) {
            if (!enableGesture) return;
            tip.touchStatus = 'pinch';
            lastAction = "pinch";
            if (ev.type == 'pinchstart') {
                tip.svgOffset = drwSw.svgOffset || tip.svgOffset;
                hasPenchend = false;
            }
            tip.mcScaleSvg(ev);
        });

        mc.on("pinchend", function(ev) {
            setTimeout(function() {
                if (!hasPenchend) {
                    tip.scaleSvgUpdate(tip.transform.scale);
                }
            }, 0)
        });
        mc.on("hammer.input", function(ev) {
            if (ev.isFinal) {
                if (lastAction == "pinch") {
                    tip.scaleSvgUpdate(tip.transform.scale);
                    hasPenchend = true;
                }
                if (lastAction == "pan") {
                    tip.svgUpdate(ev);
                }
                enableGesture = false;
                setTimeout(function() {
                    enableGesture = true;
                }, 50);
            }
        });

        $subway.on('touchend', 'g', function() {
            if (!tip.touchStatus) {
                if ($(this).hasClass('line_name')) {
                    //线路选择器显示线路名
                    var line_id = $(this).attr('lineid');
                    var SW_line_name = AllData.cache.lines[line_id].ln;
                    var line_name=SW_line_name.split("/")[0].toString().substr(0,4);
                    $(".filter_btn").html(line_name);
                    self.showFilterLine(line_id);
                    var select_obj = $('#g-select');
                    tip.setFitview(select_obj);
                    var center = tip.getFilterCenter();
                    tip.setCenter(center);
                }
            }
        });

        $subway.on('touchend', '#g-bg', function() {
            if (!tip.routeState) {
                if (!tip.touchStatus) {
                    $('#g-select').remove();
                    $('#g-bg').css('display', 'none');
                    $(".filter_btn").html("线路图");
                }
            }
        });

        //触击 非站点又不是换乘点的区域 关闭弹窗
        $subway.on('touchend','#drag_handle'&&".light_box",function(e) {
            if (!tip.touchStatus && !tip.routeState) {
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
            if (!tip.touchStatus && !tip.routeState) {
                var id = $(this).attr('station_id');
                tip.closeFilter();
                $('.light_box').css('display', 'block');
                window.location.hash = '#city=' + AllData.cache.curCity.adcode + '&station=' + id;
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
            tip.closeFilter();
            tip.closehelpBox()
        });

        $refresh.on('touchend', function (ev) {
            ev.stopPropagation();
            if(tip.refreshstate==0){
                tip.refreshstate=1;
                var $refresh = $(".refresh_btn");
                $refresh.addClass("refresh_active");
                var city_code = AllData.cache.curCity.adcode;
                var city_name = AllData.fileNameData[AllData.cache.curCity.adcode];
                var status = 'normal';
                DrwTraf.loadTraffic(city_code, city_name);
                //console.log("add前",drwSw.currLines);
                DrwTraf.drwTrafficLinesDefer(drwSw.currLines, status);
            }else {
                ev.stopPropagation();
            }
        });

        //点击线路图选择器，打开选择器
        $('.filter_btn').on('touchend', function() {
            console.log(tip.curScale);
            tip.closehelpBox();
            if (!tip.routeState) {
                tip.openFilter();
            }
        });
        //点击选择器中的路线：关闭选择器，显示地铁，设置屏幕中心点为地铁的中心
        $('.fliter_detail').on('touchend', '.fliter_item', function() {
            if (lockfd) return;
            var line_id = $(this).attr('lineid');
            var line_name=$(this).attr('name');
            var center={};
            if (line_id == "caption-allLines") {
                tip.closeFilter();
                $(".filter_btn").html("线路图");
                $('#g-bg').css('display','none');
                //tip.showFilterLine(line_id);

                var $Svg=$('#svg-g');
                var $Svg_offset = $Svg.offset();
                var $Svg_h = document.getElementById('svg-g').getBBox().height * tip.allScale,
                    $Svg_w = document.getElementById('svg-g').getBBox().width * tip.allScale;
                center.x = $Svg_offset.left + $Svg_w/2;
                center.y = $Svg_offset.top + $Svg_h/2;
                //var center2=tip.getStCenter($Svg);
                //console.log($Svg_offset,center,center2,$Svg_w,$Svg_h);
                //console.log(tip.realCenter);
                tip.setCenter(center);

            } else {
                tip.closeFilter();
                $(".filter_btn").html(line_name);
                self.showFilterLine(line_id);
                var select_obj = $('#g-select');
                tip.setFitview(select_obj);
                center = tip.getFilterCenter();
                tip.setCenter(center);
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
            tip.closeFilter();
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
    },
    //显示过滤后的地铁线
    showFilterLine: function(id) {
        var self=this;
        $('#g-select').remove();
        $('#g-bg').css('display', 'block');
        drwSw.drawSelectLine(AllData.cache.lines[id], 'select');
    }
};

module.exports=bindEv;