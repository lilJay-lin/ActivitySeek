/* jshint -W097*/
/* jshint node:true */

'use strict';

var browersync = require('browser-sync'),
    path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    fs = require('fs'),
    $ = require('gulp-load-plugins')(),
    parseArgs  = require('minimist'),
    runSequence = require('run-sequence');
var date = new Date();
var argv = parseArgs(process.argv.slice(2),{
    string: ['f', 'o'],
    default: {
        'f': 'nofound',
        'o': date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()//输出文件名
    }
});

var pth = 'src/' + (argv.f == 'nofound' ? '**' : argv.f),
    dist = 'dist/' + (argv.f == 'nofound' ? '' : argv.f);

var config = {
    dist:{
        css: dist + '/css',
        js: dist + '/js',
        html: dist
    },
    build: {
        zip: 'dist/build',
        js:  pth + '/js/*.js',
        less:  pth + '/css/*.*',
        html: pth + '/**/*.html',
        vendor: 'src/vendor'
    },
    AUTOPREFIXER_BROWSERS: [
        'ie >= 8',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 2.3',
        'bb >= 10'
    ],
    uglify: {
        compress: {
            warnings: false
        },
        output: {
            ascii_only: true
        }
    }
};


/*gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
        // configuration
        myConfig
        , function(err, stats) {
            // if(err) throw new gutil.PluginError("webpack", err);
            // gutil.log("[webpack]", stats.toString({
            //     // output options
            // }));
            callback();
            //this.emit('end');//报错不中断
        });
});*/

gulp.task('appServer',function(){
    var dir = './dist' +  (argv.f == 'nofound' ? '' : '/' + argv.f);
    var files = [
        dir
    ];

    browersync.init(files, {
        server: {
            baseDir: dir
        }
    });
});

gulp.task('lint', function() {
    return gulp.src(config.build.js)
        .pipe($.jshint())
        .pipe($.jshint.reporter('hint'));
});


gulp.task("build:js", function(){
   return gulp.src(config.build.js)
       .pipe($.watch(config.build.js))
       .pipe($.jshint())
       .pipe($.jshint.reporter('default'))
       .pipe($.uglify())
       .pipe($.plumber({errorHandler: function (err) {
           // 处理编译less错误提示  防止错误之后gulp任务直接中断
           // $.notify.onError({
           //           title:    "编译错误",
           //           message:  "错误信息: <%= error.message %>",
           //           sound:    "Bottle"
           //       })(err);
           console.log(err);
           this.emit('end');
       }}))
       //.pipe($.rev()) //添加MD5
       .pipe(gulp.dest(config.dist.js))
       .pipe($.size({showFiles: true, title: 'uglify'}))
       .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}));
});

gulp.task("build:less", function(){
    return gulp.src(config.build.less)
        .pipe($.watch(config.build.less))
        .pipe($.plumber({errorHandler: function (err) {
            // 处理编译less错误提示  防止错误之后gulp任务直接中断
            // $.notify.onError({
            //           title:    "编译错误",
            //           message:  "错误信息: <%= error.message %>",
            //           sound:    "Bottle"
            //       })(err);
            console.log(err);
            this.emit('end');
        }}))
        .pipe($.less({
            paths: [ path.join(__dirname, 'src/common') ]
        }))
        .pipe($.autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
        .pipe($.size({showFiles: true, title: 'source'}))
        .pipe($.minifyCss({noAdvanced: true}))
/*        .pipe($.rename({
            suffix: '.min',
            extname: '.css'
        }))*/
        .pipe(gulp.dest(config.dist.css))
        .pipe($.size({showFiles: true, title: 'minified'}))
        .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}));
});


/*
gulp.task("build:package", function(){
    var pkg = require(config.build.pkg);
    console.log(JSON.stringify(pkg));
});
*/


gulp.task('build', ['build:less', 'build:js']);

gulp.task('copy:html', function(){
    gulp.src(config.build.html)
      .pipe($.watch(config.build.html))
      .pipe(gulp.dest(config.dist.html))
});

gulp.task('copy:js', function(){
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js'
    ])
      .pipe(gulp.dest(config.build.vendor));
});

gulp.task('copy', ['copy:html', 'copy:js']);

gulp.task('watch', function(){
    gulp.watch(config.build.less, ['build:less']);
    gulp.watch(config.build.js, ['build:js']);
    gulp.watch(config.build.html, ['copy']);
});

gulp.task("clean", function(cb){
    return del([
        dist
    ], cb);
});

gulp.task("archive:clean", function(cb){
    return del([
        config.build.zip + '/' + argv.f
    ], cb);
});

gulp.task('archive:zip', function() {
    var file = 'dist/' + argv.f + '/**' ;

    return gulp.src(file)
        .pipe($.zip(argv.o + '.zip'))
        .pipe(gulp.dest(config.build.zip + '/' + argv.f ));
});

gulp.task('zip', function(cb){
    runSequence(
        'archive:clean',
        'archive:zip',
        cb);
});


//创建文件夹
function ensureDir(pth){
    fs.mkdirSync(pth);
    fs.mkdirSync(pth + '/css');
    fs.mkdirSync(pth + '/js');
    createHtmlTemplate(pth);
}

function createHtmlTemplate(pth){
    var html = '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '   <head>\n' +
      '       <meta charset="UTF-8">\n' +
      '       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\n' +
      '       <meta http-equiv="Cache-Control" content="no-transform">\n' +
      '       <meta http-equiv="Cache-Control" content="no-siteapp">\n' +
      '       <meta name="apple-mobile-web-app-capable" content="yes">\n' +
      '       <meta name="apple-mobile-web-app-status-bar-style" content="black">\n' +
      '       <title></title>\n' +
      '   </head>\n' +
      '   <body>\n' +
      '       hello world\n' +
      '   </body>\n' +
      '</html>' ;
    fs.writeFileSync(pth + '/index.html', html)
}

gulp.task('prepare', function(){
    try{
        fs.statSync(pth)
    }catch(e){
        ensureDir(pth);
/*        return gulp.src(config.build.html)
            .pipe(gulp.dest(config.dist.html))*/
    }
});
gulp.task('preview',function(cb){
    runSequence(
        'prepare',
        'clean',
        'copy',
        ['appServer', 'build'],
        cb
    )
});
gulp.task('default',function(cb){
    runSequence(
        'prepare',
        'clean',
        'copy',
        'build',
        cb
    )
});