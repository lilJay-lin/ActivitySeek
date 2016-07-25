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

    /*时间对比，判断距离指定时间是否超过duration分钟；传入赛事时间，duration不传默认为10(分钟）*/
/*    function compare(date, duration) {
        duration = duration === void 0 || 10;
        var now = getTime();
        return parseInt(date, 10) - parseInt(now, 10) > duration * 100;
    }*/

    /*使用例子:距离11点55分是否大于10分钟，结果为true*/
    //var res = compare('20160706115521');
    root.Util = {
        getTime: getTime()
    };
})(this);