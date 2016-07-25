/**
 * Created by linxiaojie on 2016/7/18.
 */
/*滚动*/
(function(root){
    /*
     * 渲染，
     * param{html string} template,
     * param{obj} context
     * 根据传入String做变量替换，返回替换之后的字符串
     */
    function render(template, context) {

        var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

        return template.replace(tokenReg, function (word, slash1, token, slash2) {
            if (slash1 || slash2) {
                return word.replace('\\', '');
            }

            var variables = token.replace(/\s/g, '').split('.');
            var currentObject = context;
            var i, length, variable;

            for (i = 0, length = variables.length; i < length; ++i) {
                variable = variables[i];
                currentObject = currentObject[variable];
                if (currentObject === undefined || currentObject === null) return '';
            }
            return currentObject;
        })
    };

    /*不处理多重内嵌的数组，只处理一元数组*/
    function renderArray(template, arr){
        if(arr == null || !$.isArray(arr)){
            return template;
        }
        var html = '', obj = {};
        $.each(arr, function(i){
            if(Object.prototype.toString.call(arr[i]) == '[object Object]'){
                obj = arr[i];
                obj._order = i + 1;
            }else{
                obj.value = arr[i];
                obj._order = i + 1;
            }
            html += render(template, obj);
        })
        return html;
    };
    /*
     *
     * opts{
     * mode: '',
     * arr: []//文本
     * }
     * */
    function Marquee(el, opts){
        var me = this;
        me.$el = $('<ul></ul>');
        me.$ctn = $(el);
        me.$ctn.append(me.$el);
        me.mode = opts &&  opts.mode ? opts.mode: 'normal';
        me.duration = opts &&  opts.duration ? opts.duration : 1000;
        me.$ctn.addClass(me.mode);
        me.arr = opts && opts.arr || [];
        me.ctnWidth = me.$ctn.width();
        me.updateList = [];
        me.render();
    }
    Marquee.strange = {
        inline: function(marquee, cb){
            var $el = marquee.$el, d = marquee.duration;
            var ctnWidth = parseInt(marquee.ctnWidth, 10) + parseInt(marquee.width, 10);
            d = ctnWidth / d;
            marquee.animate($el, '-' + marquee.width + 'px', 0,  d, function(){
                marquee.animate($el, '100%' , 0,  0, function(){
                    setTimeout(cb, 300);
                })
            });
        },
        normal: function(marquee, cb){
            var $el = marquee.$el, d = marquee.arr.length * marquee.duration;
            marquee.animate(marquee.$el, 0, '-' + marquee.height + 'px',  marquee.arr.length * marquee.duration, function(){
                marquee.animate($el, 0, 0,  0, function(){
                    setTimeout(cb, 300);
                })
            });
        }
    };
    Marquee.prototype = {
        template: '<li>{text}</li>',
        render: function(){
            var me = this;
            if(me.arr.length > 0){
                var newArr = me.arr.slice();
                /*无限循环处理*/
                me.mode === 'normal' && newArr.push(me.arr[0]);
                me.$el.append(renderArray(me.template, newArr));
            }
            me.refresh();
        },
        push: function(text){
            this.updateList.push(text);
        },
        update: function(text){
            var me = this, n = {text: text};
            if(me.mode === 'inline'){
                me.arr.push(n);
                me.$el.append(render(me.template, n))
            }else{
                if(me.arr.length === 0 && me.mode === 'normal'){
                    me.arr.push(n);
                    me.render();
                }else{
                    me.arr.push(n);
                    me.$el.find('li:last').before(render(me.template, n));
                }
            }
            me.refresh();
        },
        refresh: function(){
            var me = this;
            if(me.arr.length == 0){
                return ;
            }
            me.width = 0,
                me.height = 0;
            var childrens = me.$el.find('li');
            /*
             * inline:模式末尾加了第一个text,实现无限循环
             * normal：不做此处理
             * */
            if(me.mode === 'inline') {
                me.$el.width(me.$el.find('li').length * 100 + '%');
                $.each(me.arr, function(idx){
                    me.width += childrens.eq(idx).outerWidth();
                })
                me.$el.width(me.width);
            }else if(me.mode === 'normal'){
                $.each(me.arr, function(idx){
                    me.height += childrens.eq(idx).outerHeight();
                })
            }
        },
        start: function(){
            var me = this;
            if(me.updateList.length > 0){
                $.each(me.updateList, function(idx){
                    me.update(me.updateList[idx]);
                })
                me.updateList.splice(0)
            }
            Marquee.strange[me.mode](me, function(){
                var me = this;
                setTimeout(function(){
                    me.start();
                }, 100)
            }.bind(me));
        },
        animate : function($el, x, y, duration, cb){
            var d = duration === undefined ? 1 : duration;
            $el.css({
                'margin-left': x,
                'margin-top': y,
                'transition-duration' : d + 's',
                '-webkit-transition-duration' : d + 's',
                '-moz-transition-duration' : d + 's',
                '-o-transition-duration' : d + 's'
            });
            setTimeout(function(){
                cb();
            }, d * 1000)
        }
    }
    root.Marquee = Marquee;
})(this);

/*
var marquee = new Marquee('.zw-shows',{
    mode: 'inline',
    arr:[{text:'中奖啦111111111'}, {text:'中奖啦122222211'},{text:'中奖啦4444444'},],
    duration: 200 //inline时表示速度； mode表示秒
});
marquee.start();
setTimeout(function(){
    marquee.push('中奖啦eeeee11')
}, 2000)*/
