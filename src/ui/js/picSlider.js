/**
 * Created by linxiaojie on 2016/6/7.
 */
function Slider(opts) {
    if (!(this instanceof Slider)) {
        return new Slider(opts)
    }
    var me = this;
    me.$el = $(opts.el);
    me.padding = opts.padding || 10;
    me.$sliders = me.$el.find('.sliders');
    me.init()
}
Slider.prototype = {
    constructor: Slider,
    init: function () {
        var me = this;
        var lis = me.$sliders.children();
        var len = lis.length;
        var width = lis.eq(0).width();
        var totalWidth = width * len  + len * me.padding;
        me.bindEvents(me.$sliders, width, totalWidth);
        me.$sliders.css({
            width: totalWidth + 'px'
        });
        me.$el.css({
            visibility: 'visible'
        });
    },
    bindEvents: function ($el, w, totalWidth){
        var move = 0, start = {}, dist = {},
            latest = 0, viewW = $(window).width(), maxRW = viewW - totalWidth;
        $el.on('touchstart', function(e){
            if(e.originalEvent){
                e = e.originalEvent;
            }
            start.x = e.touches[0].pageX,
                move = 1;
        }).on('touchmove', function(e){
            e.preventDefault();
            if(!move){
                return;
            }
            if(e.originalEvent){
                e = e.originalEvent;
            }
            var x = e.changedTouches[0].pageX;
            var temp =  x - start.x + latest;
            dist.x = temp > 0 ? 0 : (temp < maxRW ? maxRW : temp);
            setPosition(dist.x, 0);
        }).on('touchend', function(e){
            move = 0;
            latest = dist.x;
            start = {};
            dist = {};
        });

        function setPosition(x, d){
            $el.css({
                '-webkit-transform': 'translate3d(' + x + 'px, 0, 0)',
                'transform': 'translate3d(' + x + 'px, 0, 0)',
                'transition-duration': d / 1000 + 's',
                ' -webkit-transition-duration': d / 1000 + 's'
            });
        }
    }
}