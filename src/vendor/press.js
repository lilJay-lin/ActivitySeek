/**
 * Created by linxiaojie on 2016/8/3.
 按钮触摸
 */
$(function(){
    var classes = [];
    var touch = {}, touchTimeout, prevEl, longTapTimeout,
        longTapDelay = 750;
    function longTap() {
        longTapTimeout = null;
        if(touch && touch.el){
            touch.el.removeClass('pressed')
        }
    }
    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout);
        longTapTimeout = null;
    }
    function parentIfText(node) {
        node = "tagName" in node ? node : node.parentNode;
        var  $el = $(node);
        while($el.length > 0){
            if ($el.hasClass('ignore-pressed')){
                return null
            }
            if(is($el)){
                return $el[0];
            }else{
                $el = $el.parent();
            }
        }
        return null;
    }
    function is($el){
        var res = 0;
        $.each(classes, function(i, c){
            var has = $el.hasClass(c);
            if(has) res = 1;
        })
        return res;
    }
    $(document.body).on('touchstart', function(e){
        if(e.originalEvent){
            e = e.originalEvent;
        }
        if(!e.touches || e.touches.length == 0){
            return ;
        }
        var now = Date.now(), delta = now - (touch.last || now);
        touch.el = $(parentIfText(e.touches[0].target));
        if(!touch.el[0]){
            return;
        }
        touchTimeout && clearTimeout(touchTimeout);
        touch.x1 = e.touches[0].pageX;
        touch.y1 = e.touches[0].pageY;
        touch.last = now;
        if (!touch.el.data("ignore-pressed")){
            touch.el.addClass("pressed");
        }
        if (prevEl && !prevEl.data("ignore-pressed") && prevEl[0] !== touch.el[0]){
            prevEl.removeClass("pressed");
        }
        longTapTimeout = setTimeout(longTap, longTapDelay)
        prevEl = touch.el;
    }).on('touchmove', function(e){
        if(!touch.el){
            return;
        }
    }).on('touchend', function(e){
        if(e.originalEvent){
            e=e.originalEvent;
        }
        if(!touch.el){
            return;
        }
        if (!touch.el.data("ignore-pressed")){
            touch.el.removeClass("pressed");
        }
        cancelLongTap();
    }).on('touchcancle', function(e){
        if(touch.el && !touch.el.data("ignore-pressed")){
            touch.el.removeClass("pressed");
        }
        touch = {};
        cancelLongTap();
    });

    window.press = {
        add: function(cls){
            if($.isArray(cls)){
                classes = classes.concat(cls)
            }else{
                classes.push(cls);
            }
        },
        remove: function(cls){
            var i = $.inArray(cls, add );
            i != -1 && classes.length > 0 && (
                classes.splice(i, 1), 1
            )
        },
        removeAll: function(){
            classes = [];
        }
    }
});