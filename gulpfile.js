var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require('browser-sync');
var minicss = require('gulp-clean-css');
var minijs = require('gulp-uglify');
var miniImage = require('gulp-imagemin');
var cssver = require('gulp-make-css-url-version');
var del = require('del');
var rev = require('gulp-rev');
var runSequence = require('run-sequence');
var revCollector = require('gulp-rev-collector');
var path = require('path');
var fs = require('fs');
const babel = require('gulp-babel');
const transform = require('gulp-transform');
const messup = require('decent-messup');

/* 加密js文件  */
// gulp.task('a', function() {
//   return gulp.src('./script/trunPage.js')
//     .pipe(transform('utf8', code => messup(code,{headCnt:5,es6:false})))
//     .pipe(minijs())
//     .pipe(gulp.dest('jiami'));
// });
//定义css、js源文件路径
var cssSrc = './style/css/*.css',
    jsSrc = './script/*.js';


//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(gulp.dest('./dist/style/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/style/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
    return gulp.src(jsSrc)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rev())                                //给文件添加hash编码
        .pipe(gulp.dest('./dist/script'))
        .pipe(rev.manifest())                       //生成rev-mainfest.json文件作为记录
        .pipe(gulp.dest('./dist/script'));
});


//Html替换css、js文件版本
gulp.task('revHtmlCss', function () {
    return gulp.src(['./dist/style/css/*.json','./page/*.html'])
        .pipe(revCollector())                         //替换html中对应的记录
        .pipe(gulp.dest('./dist/page'));                     //输出到该文件夹中
});
gulp.task('revHtmlJs', function () {
    return gulp.src(['./dist/script/*.json', './dist/page/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dist/page'));
});
gulp.task('indexRevCss', function () {
    return gulp.src(['./dist/style/css/*.json','./index.html'])
        .pipe(revCollector())                         //替换html中对应的记录
        .pipe(gulp.dest('./dist'));                     //输出到该文件夹中
});
gulp.task('indexRevJs', function () {
    return gulp.src(['./dist/script/*.json', './dist/index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dist'));
});

let file = ['image','lib'];
gulp.task('package',function(){
    for(let i = 0; i < file.length; i ++){
        if(file[i] == 'image'){
            gulp.src('./' + file[i] + '/*',{base: '.'})
                .pipe(gulp.dest('./dist'))
        }else{
            gulp.src('./' + file[i] + '/*',{base: '.'})
                .pipe(gulp.dest('./dist'))
        }
    }
})
//开发构建
gulp.task('dev', function (done) {
    //condition = false;
    //依次顺序执行
    runSequence(
        ['revCss'],
        ['revHtmlCss'],
        ['revJs'],
        ['revHtmlJs'],
        ['indexRevCss'],
        ['indexRevJs'],
        ['package']
        ,done);
});
gulp.task('browser', function() {
    browserSync.init({
        files: ['**'],
        server: {
            baseDir: './',
            index: 'page/wangdai.html'
        }
    })
})

gulp.task('task-name', function() {
    return gulp.src('style/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('style/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('watch',function() {
    gulp.watch('style/less/*.less',['task-name']);
    gulp.watch('page/*.html', browserSync.reload);
    gulp.watch('style/css/*.css', browserSync.reload);
  	gulp.watch('script/*.js', browserSync.reload);
})

gulp.task('default',['browser','task-name','watch']);

let a = 1;