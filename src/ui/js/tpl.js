/**
 * Created by linxiaojie on 2016/3/24.
 */
(function(){
    String.prototype.render = function(context){
        return render(this, context);
    }

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
    }

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
    }
})(this);