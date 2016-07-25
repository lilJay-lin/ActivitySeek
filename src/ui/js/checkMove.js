/**
 * Created by linxiaojie on 2016/5/12.
 */
function checkMove(el){
    var deferred = $.Deferred();
    var $el = $(el),
        start = {}, delta = {}, isMove = 0;
    $el.on('touchstart', function(e){
        if(e.originalEvent){
            e = e.originalEvent;
        }
        isMove = 1;
        start = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        };
    }).on('touchmove', function(e){
        e.preventDefault();
        if(e.originalEvent){
            e = e.originalEvent;
        }
        if(!isMove){
            return ;
        }
        if(e.changedTouches.length > 0){
            e = e.changedTouches[0];
            delta = {
                x: e.pageX,
                y: e.pageY
            }
        }
    }).on('touchend', function(){
        isMove = 0;
        var m = 0, x = Math.abs(parseFloat(start.x - delta.x)),
            y = Math.abs(parseFloat(start.y - delta.y));
        !isNaN(x) && !isNaN(y) && (x > 50 || y > 50) && (m = 1);
        deferred.resolve(m);
    });
    return deferred;
}