/**
 * Created by linxiaojie on 2016/5/23.
 */
function Share(opts){
    this.opts = $.extend({
        isMG: 0,//是否是咪咕
        shareBtn: '', //分享按钮
        privBtn: '',//查看版权按钮
        privMsg: '', //版权信息DIV
        privCloseBtn: '', //版权信息关闭按钮
        shareIcon: '',//分享ICON
        shareUrl: '',//分享URL
        shareTitle: '',//分享标题
        shareDesc: ''//分享描述
    }, opts)
    this.init();
}
Share.prototype = {
    constructor:Share,
    shareTemplate: '<div class="zw-mask-tips"><div class="zw-arrow-line"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAD3AQMAAAAZnktpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAn9JREFUWMPtmT2OGzEMhSlMoc66wGJ1jS0Mz5W2dGFk1OVaA+QiOoK6qBhY2Y2RUDY5zwUReLzIVAY+m+QjqR+OCTwuE8QV4wYxjdh6aBbr04htT9B0q/DHPwrArfh5nfpGMYGcVBpRYIlOwPZC9LaOI853S4gOCy5WwaVOEJ8hHSrEHsuK2PUEKWHVA1YdZktkB0tkrtzJmSlwsgReLYEPGeuasa4E8SukdHpWXZZ62WUbDpgBy/ZYdiBDtY1ZOWJszMpmk3YH701Je3/WnHrabMrfbG38DyviZlPB0uMKtjMV7MVWz8etMMp38Ga7YcPNYuylh7WavRMx3mwfm9sc4wcuku9wKh7ax7MuLn7i82rgn5Z9y/BNwLis4PHnxUZase0v3yoq9vWCvW49Zo+m44k8mK3dQuGPF811oR0YgONMOzA+j/QXB8X5wliZn11lrDj3mbHiPCTGivORGCvOvzHWxth6hUdt4mYckzInMfZZBM5YDieRGCuxHW7wQQTOWMTmCmNlxh7yDR6y0NVjV4SuHlMVuq7w/kYXY3msnAQOV7IF9knE6Ve2oSEL7HIvW2AqvWyII0l8FCJ90vOyV3bFl84QYy1tRcG7XqPckYOoveuxZzxD7BM7kZjd9HhIQkNR8QFizt+7io/8QcOFzSjYqdgn0TevPeakQeyT1txBYp+UgoarjhWOXtVVvZdyHMZUiVAqT8oyKNp+5bKCoxThsrZfhcRYeRU6agvdLf1pIxfexMeFhuPMh40oEx+v48ylkX8VuPPKvXkqv31Uzr28friWV7BrZ6LW+tLIq09Zv5x+0DO6nF5Rl7/oW47/Q/PWpuLnLfdX7QYb/gUeHf9S+PGpBwAAAABJRU5ErkJggg==" alt=""></div><div class="zw-tips-text"><div class="zw-tips1">点击右上角</div><div class="zw-tips2">选择从浏览器中打开</div></div></div>',
    shareCss: '<style>.zw-mask-tips{display:none;position:fixed;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,0.5);z-index:100}.zw-arrow-line{width:2.40rem;height:2.47rem;position:absolute;right:.8rem;top:0}.zw-arrow-line img{width:2.40rem;height:2.47rem}.zw-tips-text{margin-top:2.55rem;font-size:.32rem;color:#fff}.zw-tips1{text-align:center}.zw-tips2{margin-top:.15rem;text-align:center}</style>',
    init: function(){
        var self = this;
        var $wxShareIcon = $('<div style="width:0;height:0;opacity:0;overflow: hidden"><img src="' + this.opts.shareIcon + '" alt=""></div>')
        $(document.head).append($(this.shareCss));
        $(document.body).append($(this.shareTemplate)).prepend($wxShareIcon);
        setTimeout(function(){
            self.setShareAction()
        }, 500)
    },
    setShareAction: function(){
        var opts = this.opts;
        /*
         * 分享页版权信息
         */
        var $PrivMsg = $(opts.privMsg);
        $(opts.privBtn).on('touchstart', function(e){
            e.preventDefault();
            $PrivMsg.toggle();
        });
        var $PrivCloseBtn = $(opts.privCloseBtn)
        $PrivCloseBtn.on('touchstart',function(e){
            e.preventDefault();
            $PrivMsg.hide();
        });

        /*弹窗点击隐藏*/
        var $mask = $('.zw-mask-tips');
        $mask.on('touchstart', function(e){
            e.preventDefault();
            $mask.hide();
        });

        /*判断是否微信*/
        function isWeChat(){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return 1;
            }
            return 0;
        };

        /*判断是否IOS*/
        function isIos(){
            var ua = navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(ua);
        };
        /*
         分享，点击分享按钮判断：
         1. 微信，弹遮罩引导
         2. 浏览器，弹遮罩提示
         3. 客户端，使用js接口分享
         */
        var $shareBtn  = $(opts.shareBtn);
        $shareBtn.on('touchstart', function(e){
            e.preventDefault();
            if(isWeChat()){
                showShareMask(tips[1]);
            }else if(opts.isMG){
                /*客户端分享,PPS填充url，标题名，描述;*/
                window.migu.shareUrlWithIconToWxFriends(opts.shareUrl, opts.shareTitle,opts.shareIcon, opts.shareDesc);
            }/*else if(isIos()){
             showShareMask(tips[3]);
             }*/else{
                showShareMask(tips[2]);
            }
        });

        var tips = ['选择从浏览器中打开', '选择分享到朋友圈', '请使用浏览器分享功能', '咪咕Zone暂不支持IOS系统，敬请期待']
        function showShareMask(txt){
            if(isWeChat()){
                $mask.find('.zw-tips1').show();
                $mask.find('.zw-tips2').text(txt);;
                $mask.find('.zw-arrow-line').show();
            }else{
                $mask.find('.zw-tips1').hide();
                $mask.find('.zw-tips2').text(txt);;
                $mask.find('.zw-arrow-line').hide();
            }
            $mask.show();
        };
    }
}

