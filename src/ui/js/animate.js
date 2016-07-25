/**
 * Created by linxiaojie on 2016/3/24.
 */

(function(){

    var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        msTransition     : 'MSAnimationEnd',
        transition       : 'transitionend'
    };

    var animateEndEventNames = {
        WebkitAnimation: 'webkitAnimationEnd',
        OAnimation     : 'oAnimationEnd',
        msAnimation    : 'MSAnimationEnd',
        MozAnimation  : 'animationend',
        animation      : 'animationend'
    };

    function getPrefix(type) {
        var b = document.body || document.documentElement;
        var s = b.style;
        var p = type || 'animation', v;
        if(typeof s[p] == 'string')
            return p;

        // Tests for vendor specific prop
        v = ['Moz', 'Webkit', 'O', 'ms'],
            p = p.charAt(0).toUpperCase() + p.substr(1);
        for( var i=0; i<v.length; i++ ) {
            if(typeof s[v[i] + p] == 'string')
                return v[i] + p;
        }
        return false;
    }
    // animation end event name
    this.animationEndName = animateEndEventNames[getPrefix('animation')];
    this.transitionEndName = transEndEventNames[getPrefix('transition')];
})(this);