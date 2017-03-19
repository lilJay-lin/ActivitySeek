/**
 * Created by liljay on 2017/3/19.
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
function Danmu (options) {
  if (!(this instanceof  Danmu)) {
    return new Danmu(options)
  }
  var me = this, width = window.innerWidth, height = window.innerHeight, $el = null;
  me.$el = $el = $(options.container || document.body);
  me.speed = options.speed || 8;
  me.barrageHeight = options.height || rem2px(0.6);//默认字幕高度
  me.viewport = {
    width: width > $el.width() ? $el.width() : width,
    height: height > $el.height() ? $el.height() : height
  };
  me.colors = options.colors || ['orange', 'gold', 'lawngreen', 'darkcyan', 'fuchsia'];
  me.queue = [] ;//字幕队列
  me.queueState = 0; //0 :  stop; 1: running
  me.maxSize = Math.floor(me.viewport.height / me.barrageHeight - 1); //垂直方向最大条数
  me.init();
}
Danmu.prototype = {
  init: function () {
    var me = this, i = 1;
    me.positionQueue = Array.apply(null, { length: me.maxSize }).map(function () {
      return i++;
    });
    me.positionQueue = me.shuffle(me.positionQueue);
    me.takedQueue = [];
  },
  shuffle: function (arr) {
    var tempArr = arr.slice(),
      len = tempArr.length,
      i = len,
      r = 0,
      temp = 0;
    for (; i > 0; i--) {
      r = Math.floor(Math.random() * i)
      temp = tempArr[r]
      tempArr[r] = tempArr[i - 1]
      tempArr[i - 1] = temp
    }
    return tempArr
  },
  getPosition: function () {
    var me = this, pos = 0;
    if (me.positionQueue.length < me.maxSize / 2) {
      me.positionQueue = me.positionQueue.concat(me.takedQueue);
      me.takedQueue.splice(0, me.takedQueue.length);
    }
    pos = me.positionQueue.splice(0, 1);
    me.takedQueue.push(pos);
    return pos;
  },
  add: function (data) {
    var me = this;
    if (data.length > 0) {
      me.queue = me.queue.concat(data);
      me.deal();
    }
  },
  deal: function () {
    var me = this;
    if (me.queueState || me.queue.length === 0) {
      me.queueState = 0;
      return
    }
    me.queueState = 1;
    deal(500, function () {
      me._addBarrage(me.queue.shift());
    }).done(function () {
      me.queue.splice(0, 1);
      me.queueState = 0;
      me.deal();
    })
  },
  /*
   * data : {
   *  info: 弹幕文字
   * }
   * */
  _addBarrage: function (data) {
    var me = this, $barrage = $('<div class="barrage"> </div>'), barrageId = 'barrage_' + Date.now(),
      id = '#' + barrageId,
      viewHeight = me.viewport.height,
      bottom = me.getPosition() * me.barrageHeight;
    if (data.info) {
      $barrage.attr('id', barrageId).text(data.info);
      $barrage.css({
        bottom: bottom + 'px',
        color: me.colors[Math.floor(Math.random() * me.colors.length)]
      });
      me.$el.append($barrage);
      $barrage.animate({right: me.viewport.width + rem2px(2) + 'px'}, me.speed * 1000, function(){
        $barrage.remove();
      });
    }
  }
}