/**
 * Created by linxiaojie on 2016/2/25.
 */
(function(){
    /*
     按钮触摸
     */
    var classes = [];
    $(function(){
        var touch = {}, touchTimeout, prevEl;
        function parentIfText(node) {
            node = "tagName" in node ? node : node.parentNode;
            var  $el = $(node);
            while($el.length > 0){
                if(is($el)){
                    return $el[0];
                }else{
                    $el = $el.parent();
                }
            }
            return node;
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
            touchTimeout && clearTimeout(touchTimeout);
            touch.x1 = e.touches[0].pageX;
            touch.y1 = e.touches[0].pageY;
            touch.last = now;
            console.log('sss');
            if (!touch.el.data("ignore-pressed")){
                touch.el.addClass("pressed");
            }
            if (prevEl && !prevEl.data("ignore-pressed") && prevEl[0] !== touch.el[0]){
                prevEl.removeClass("pressed");
            }
            prevEl = touch.el;
        }).on('touchend', function(e){
            if(e.originalEvent){
                e=e.originalEvent;
            }
            if (!touch.el){
                return;
            }
            if (!touch.el.data("ignore-pressed")){
                touch.el.removeClass("pressed");
            }
        }).on('touchcancle', function(e){
            if(touch.el && !touch.el.data("ignore-pressed")){
                touch.el.removeClass("pressed");
            }
            touch = {};
        });
    });
    window.press = {
        add: function(cls){
            classes.push(cls);
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