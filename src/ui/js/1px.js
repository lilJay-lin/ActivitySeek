/**
 * Created by linxiaojie on 2016/7/16.
 */
!function (n) {
    var e = n.document, t = e.documentElement, dpr, scale;
    var isAndroid = n.navigator.appVersion.match(/android/gi),
        isIPhone = n.navigator.appVersion.match(/iphone/gi),
        devicePixelRatio = n.devicePixelRatio;
    if (isIPhone) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        dpr = 1;
    }
    scale = 1 / dpr;
    var metaEl = e.createElement('meta');
    var scale = dpr === 1 ? 1 : 0.5;
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    if (t.firstElementChild) {
        t.firstElementChild.appendChild(metaEl);
    } else {
        var wrap = e.createElement('div');
        wrap.appendChild(metaEl);
        e.write(wrap.innerHTML);
    }
    var i = 720 * 1 /scale , d = i / 100 * scale, rem, o = "orientationchange"in n ? "orientationchange" : "resize", a = function () {
        var n = t.clientWidth || 320;
        n > 720 && (n = 720), t.style.fontSize = (rem = n / d) + "px"
    };
    n.px2rem = function (px) {
        var v = parseFloat(px);
        return v / rem;
    };
    n.rem2px = function (r) {
        var v = parseFloat(r);
        return rem * v
    };
    e.addEventListener && (n.addEventListener(o, a, !1), e.addEventListener("DOMContentLoaded", a, !1))

}(window);