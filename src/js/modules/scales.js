/**
 * Created by xinye on 16/5/24.
 */

var tip=require("./tip");

var pinch={
    debounceTransLabel:"debounce-transition",
    enableGesture : null,
    MaxScale:tip.max_scale,
    MinScale:tip.min_scale,

    svgUpdate: function(a) {
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
                $("#drag_handle").addClass(b.debounceTransLabel))) : (0 > e + g / 2 || e + g / 2 > tip.w) && (Number(b.startOffset.left) > 0 ? k = !1 : g - Math.abs(Number(b.startOffset.left)) < Number(tip.w) / 2 ? k = !1 : (i = a.deltaX / 2,
                $("#drag_handle").addClass(b.debounceTransLabel))),
                h > tip.h ? (Number(f) > Number(tip.h) / 2 || Math.abs(Number(f)) > Number(h - Number(tip.h) / 2)) && (Number(b.startOffset.top) > 0 ? k = !1 : h - Math.abs(Number(b.startOffset.top)) < Number(tip.h) / 2 ? k = !1 : (j = a.deltaY / 2,
                    $("#drag_handle").addClass(b.debounceTransLabel))) : (0 > f + h / 2 || f + h / 2 > tip.h) && (Number(b.startOffset.top) > 0 ? k = !1 : h - Math.abs(Number(b.startOffset.top)) < Number(tip.h) / 2 ? k = !1 : (j = a.deltaY / 2,
                    $("#drag_handle").addClass(b.debounceTransLabel))),
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
    scaleSvgUpdate: function(a, b) {
        var c, d = this, e = ($("#svg-g"),
            $("#subwaySvgBody"),
            d.transformState.translate.x), f = d.transformState.translate.y, g = d.transformState.scale;
        tip.allScale = c = tip.allScale * a;
        var h = a * g;
        h > pinch.MaxScale && (h = pinch.MaxScale, tip.allScale = pinch.MaxScale), pinch.MinScale > h && (h = pinch.MinScale, tip.allScale = pinch.MinScale),
            a = h / g;
        var i = tip.realCenter.x
            , j = tip.realCenter.y;
        b && (i = $(window).width() / 2,
            j = $(window).height() / 2);
        var k = (Number(a) - 1) * (Number(i) - Number(e))
            , l = (Number(a) - 1) * (Number(j) - Number(f))
            , m = e - k
            , n = f - l;
        if (d.newState = {
                translateX: m,
                translateY: n,
                scale: h
            },
            c > pinch.MaxScale ||  pinch.MinScale > c) {
            var o = c > pinch.MaxScale ? pinch.MaxScale / g :  pinch.MinScale / g;
            $("#drag_handle").addClass(d.debounceTransLabel).css({
                "-webkit-transform": "translate3d(0px, 0px, 0) scale(" + o + ", " + o + ")"
            })
        } else
            d.resetAllElem(m, n, h)
    },
    resetAllElem: function() {
        var a = this
            , b = a.newState
            , c = b.translateX
            , d = b.translateY
            , e = b.scale;
        c && d && ($("#svg-g").attr("transform", "translate(" + c + "," + d + ") scale(" + e + ")"),
            a.transformState.translate.x = c,
            a.transformState.translate.y = d,
            a.transformState.scale = e),
            tip.handleReset(),
            tip.updateTip(),
            tip.updateNear(),
            tip.updateMarker(),
            setTimeout(function() {
                tip.touchStatus = null
            }, 100),
            setTimeout(function() {
                a.enableGesture = null
            }, 100)
    },
}

module.exports=pinch;