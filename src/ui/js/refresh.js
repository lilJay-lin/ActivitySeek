/**
 * Created by linxiaojie on 2015/12/15.
 */
function Loader(opts){
    this.isLoading = !1;
    this.url = opts.url || '';
    this.$el = $(opts.el || window);
    this.$cnt = opts.cnt ? $(opts.cnt) : $(document.body);
    this.eventType = 'scroll.refresh';
    this.init();
    this.disable = opts.disable || !1;
    this.curPage = parseInt(opts.curPage || 1, 10);
    this.totalPage = parseInt(opts.totalPage || 0, 10);
    this.totalRows = parseInt(opts.totalRows || 0, 10);
    this.event = $({});
}

Loader.prototype = {
    load : function(){
        var me = this,
            curPage = me.curPage;
        curPage++;
        if(curPage > me.totalPage || me.isLoading){
            return ;
        }
        me.$el.off(me.eventType);
        me.isLoading = 1;
        var url = me.url ;
        url += (url.indexOf('?') > -1 ? '&' : '?' ) + 'currentPage=' + curPage + '&totalRows=' + me.totalRows;
        $.ajax({
            url: url,
            method: 'GET',
            /* timeout: 5000,请求超时，看平台需不要设就设吧*/
            cache: false
        }).done(function(res){
            /*
             此处把取到的模板spend到指定节点 $cnt
             */
            me.curPage = curPage;
            me.event.trigger('loader.loaded', res);
        }).fail(function(xml){
            me.event.trigger('loader.error', xml);
        }).always(function(){
            me.isLoading = !1;
            me.event.trigger('loader.always');
            me.init();
        })
    },
    init: function(){
        var me = this,
            $el = me.$el,
            el = me.$cnt[0],
            $cnt = me.$cnt;
        $el.on(me.eventType, function(){
            if(me.disable ||me.isLoading || me.curPage == me.totalPage){
                return;
            };
            var height = $el.height(),
                scrollTop = $el.scrollTop();
            if(scrollTop + height + 200 > $cnt.height()){
                me.load();
            }
        })

    },
    setDisabled: function(disable){
        this.disable = !!disable;
    },
    on: function(){
        this.event.on.apply(this.event, [].slice.call(arguments));
    },
    destroy: function () {
        var me = this;
        me.$el.off(me.eventType);
    }
};