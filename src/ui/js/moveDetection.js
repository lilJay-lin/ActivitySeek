/**
 * Created by liljay on 2017/3/19.
 * 处理对象按顺时针方向旋转，读取旋转距离，并在指定时机触发事件
 */
/*延时处理*/
function deal(duration, fn) {
  var deferred = new $.Deferred();
  setTimeout(function(){
    fn();
    deferred.resolve();
  }, duration)
  return deferred;
}

/**
 * 按钮触摸处理
 * options: {
 *    cricle: 2,//几圈
 *    container: '',//容器
 *    indicator: ''//旋转的指示器
 * }
 */
function MoveDetection(options) {
  var me = this, offsetTop = 0, $el;
  $el = me.$detectCnt = $(options.container || document.body);
  offsetTop = $el.offset();
  /*触摸区域中心点坐标*/
  me.center = {
    x: offsetTop.left + ($el.width() / 2),
    y: offsetTop.top + ($el.height() / 2)
  };
  me.disable = 0;
  /*
   * 是否有效滑动
   * */
  me.isMove = 0;
  /*
   pageX: 0,
   pageY: 0
   * */
  me.startTouch = null;
  me.lastTouch = null;
  me.event = $({});
  /*旋转弧度*/
  me.totalRotate = 0;
  /*周长*/
  me.totalDis = 3.1415926 *　$el.width();
  me.circle = options.circle || 1;
  /*旋转对象*/
  me.$rotateCnt = me.$detectCnt.find(options.indicator);
  me.STATE_ND_EVENT = 'STATE_ND_EVENT'
  me.init();
}
MoveDetection.prototype = {
  init: function () {
    var me = this;
    var detectCnt = me.$detectCnt.get(0);
    function touchStart(evt){
      var touch = evt.touches[0];
      me.startTouch = {
        pageX: touch.pageX,
        pageY: touch.pageY
      };
    }
    function touchMove(evt){
      evt.preventDefault();
      var changeTouches = evt.changedTouches;
      if (changeTouches.length === 0 || me.startTouch === null) {
        return
      }
      var lastTouch = me.lastTouch = {
        pageX: changeTouches[0].pageX,
        pageY: changeTouches[0].pageY
      },disX = lastTouch.pageX - me.startTouch.pageX,disY = lastTouch.pageY - me.startTouch.pageY;
      if (Math.max(Math.abs(disX), Math.abs(disY)) > 10) {
        me.rotate(Math.abs(me.computeMove(disX, disY)))
        me.startTouch = me.lastTouch
      }
    }
    function touchEnd(){
      me.startTouch = null
      me.isMove = 0
    }
    detectCnt.addEventListener('touchstart', touchStart, false)
    detectCnt.addEventListener('touchmove', touchMove, false)
    detectCnt.addEventListener('touchend', touchEnd, false)

    return me.destroy = function () {
      detectCnt.removeEventListener('touchstart', touchStart, false)
      detectCnt.removeEventListener('touchmove', touchMove, false)
      detectCnt.removeEventListener('touchend', touchEnd, false)
      me.detectCnt = me.startTouch = me.lastTouch = null
    }
  },
  reset: function () {
    var me = this;
    me.isMove = 0;
    me.startTouch = null;
    me.lastTouch = null;
    me.totalRotate = 0;
    me.disable = 0;
    me.rotate(0);
  },
  /*
   * 把触摸区域分成上下左右四个部分来处理
   * 各个部分的触摸，按顺时针的方向来判断移动是否有效
   * */
  computeMove: function (disX, disY) {
    var me = this,
      startTouch = me.startTouch,
      center = this.center,
      top = 'top',
      left = 'left',
      right = 'right',
      bottom = 'bottom',
      horizon = 'horizon',
      vertical = 'vertical',
      dirHorizon = center.x > startTouch.pageX ? left : right,
      dirVertical = center.y >startTouch.pageY ? top : bottom,
      touchDir = Math.abs(disX) > Math.abs(disY) ? horizon : vertical,
      move = Math.abs(disX) > Math.abs(disY) ? disX : disY;
    if (me.disable) {
      return 0;
    }

    /*top right*/
    if (dirVertical === top && dirHorizon === right) {
      return  move > 0 ? move : 0;
    }
    if (dirVertical === bottom && dirHorizon === right) {
      return touchDir === horizon ? (move < 0 ? move : 0) : (move > 0 ? move : 0);
    }
    if (dirVertical === top && dirHorizon === left) {
      return touchDir === horizon ? (move > 0 ? move : 0) : (move < 0 ? move : 0) ;
    }
    if (dirVertical === bottom && dirHorizon === left) {
      return move < 0 ? move : 0
    }
    return 0;
  },
  /*旋转按钮*/
  rotate: function (dis) {
    var me = this, deg = 0;
    me.totalRotate = dis + me.totalRotate;
    deg = (me.totalRotate / me.totalDis) * 360
    me.$rotateCnt.css({
      transform: 'rotate3d(0, 0, 1, ' + deg + 'deg)'
    });
    if (me.totalRotate > me.totalDis * me.circle) {
      me.reset();
      me.trigger(me.STATE_ND_EVENT);
    }
  },
  on: function () {
    var args = [].slice.call(arguments);
    args.unshift(this.STATE_ND_EVENT);
    this.event.on.apply(this.event, args)
  },
  trigger: function (type) {
    this.event.trigger(type)
  },
  setDisable: function (status) {
    this.disable = !!status;
  }
}