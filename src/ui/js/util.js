/**
 * Created by linxiaojie on 2016/7/16.
 */
(function(root){
    function repeat(s, l) {
        return (new Array(l - (new String(s)).length + 1)).join('0') + s;
    }

    /*获取当前时间,格式：yyyymmddHHMMSS*/
    function getTime() {
        var date = new Date();
        var y = date.getFullYear(), m = repeat(date.getMonth() + 1, 2)
            , d = repeat(date.getDay(), 2)
            , h = repeat(date.getHours(), 2)
            , mm = repeat(date.getMinutes(), 2)
            , s = repeat(date.getSeconds(), 2);
        return [y, m, d, h, mm, s].join('');
    }

    /*
        mth:用整数表示月份，从0（１月）到１１（１２月）
     *  new date(yyyy,mth,dd,hh,mm,ss);
     *  距离指定时间现场N天N小时N分钟N秒
     * */
    function getCount(yyyy,mth,dd,hh,mm,ss){
        var end = new Date(yyyy,mth,dd,hh,mm,ss),
            now = Date.now(),
            r = end - now,
            rs = 1000,
            rm = 60 * rs,
            rh = 60 * rm,
            rd = 24 * rh,
            d = Math.floor(r / rd), //距离多少天
            h = Math.floor((r - d * rd) / rh), //距离多少小时
            m = Math.floor((r - d * rd - h * rh) / rm), //距离多少分
            s = Math.floor((r - d * rd - h * rh - rm * m) / rs); //距离多少秒
        return {
            day: d,
            hours: h,
            minute: m,
            second: s
        }
    }

    root.Util = {
        getTime: getTime,
        count: getCount
    };
})(this);