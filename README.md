
# 基于项目活动页面的打包解决方案

本项目主要是负责活动页面开发，考虑一下几点：

* 1.页面需求都是独立的，这样样式和js页面也是独立的

* 2.前端开发人员输出html之后是直接给到后台，后台人员通过smarty模板嵌套数据，这里后台人员多用到jquery/zepto

基于以上两点，目前考虑以下方案：

* 1.前端在文件夹src下新建文件夹作为新需求的文件夹名，格式：六位日期 + '_' + 姓名首字母拼音,如20151127_lxj。
如果一天内新建了多个文件夹，后面 + '_' + N(第几个）, 如：20151127_lxj_2。

* 2.需求相关的css / less / js 在src/新建文件夹 下新建;同文件夹下如果有多个样式需要做合并，可通过@import处理，
 编译工具暂不做自动合并做一步。

* 3.html页面则在 dist目录下 新建同名文件夹存放

>  ~~因为页面JS需要给平台做二次开发，暂时去掉js压缩这块~~

> js文件夹内的js会做压缩，写在html里面的css和js不会做压缩

> 考虑活动页的独立性，不做公共js的引用，公共js都放在src/vendor 目录，如需应用copy到具体活动的js文件夹内使用

## 编码约束：

* 1.less 至少需要有一个导入基础类 `@import 'base.less'`


## 使用：
   安装依赖`npm install`
   
   编译所有文件 `gulp build` 
   
   编译所有，并开启服务`gulp preview`
   
   编译指定文件夹，如果fileName不存在则自动在src目录下新建fileName目录结构`gulp build -f fileName`
   
   编译指定文件夹，如果fileName不存在则自动在src目录下新建fileName目录结构`gulp preview  -f fileName`
   
   打包指定文件夹下fileName的文件，指定包名ofileName.zip，未指定包名默认使用当前日期名称 `gulp zip -f fileName -o ofileName`