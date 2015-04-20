var gulp = require('gulp'),
    del = require('del'),
    durandal = require('gulp-durandal'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    eventStream = require('event-stream'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    output = ".output",
    buildVersion = +new Date();

var addBuildVersion = function () {
    var doReplace = function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\?|\&)v=([0-9]+)/gi, '')                                                                          // remove build version
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([?])/gi, '.$1?v=' + buildVersion + '&')          // add build version to resource with existing query param
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([\s\"\'\)])/gi, '.$1?v=' + buildVersion + '$2')  // add build version to resource without query param
            .replace(/urlArgs: 'v=buildVersion'/gi, 'urlArgs: \'v=' + buildVersion + '\'');                              // replace build version for require config
        file.contents = new Buffer(fileContent);
        callback(null, file);
    }
    return eventStream.map(doReplace);
};

gulp.task('build', ['clean', 'build-app', 'build-settings'], function () {
});

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('build-app', ['clean'], function () {
    var assets = useref.assets();

    gulp.src('index.html')        
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output));

    gulp.src(['settings.js', 'publishSettings.js'])
       .pipe(gulp.dest(output));

    gulp.src('css/fonts/**')
       .pipe(gulp.dest(output + '/css/fonts'));

    gulp.src('css/images/**')
    .pipe(gulp.dest(output + '/css/images'));

    gulp.src('img/**')
       .pipe(gulp.dest(output + '/img'));

    gulp.src(['js/require.js'])
       .pipe(gulp.dest(output + '/js'));

    gulp.src('lang/*.json')
       .pipe(gulp.dest(output + '/lang'));

    gulp.src('manifest.json')
        .pipe(gulp.dest(output));

    return durandal(
        {
            minify: true
        })
       .pipe(addBuildVersion())
       .pipe(gulp.dest(output + '/app'));
});

gulp.task('build-settings', ['clean'], function () {
    var assets = useref.assets();

    gulp.src(['settings/settings.html'])         
      .pipe(assets)
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(addBuildVersion())
      .pipe(gulp.dest(output + '/settings'));

    gulp.src('settings/css/fonts/**')
      .pipe(gulp.dest(output + '/settings/css/fonts'));

    gulp.src('settings/css/settings.css')
      .pipe(addBuildVersion())
      .pipe(minifyCss())
      .pipe(gulp.dest(output + '/settings/css'));

    return gulp.src('settings/img/**')
      .pipe(gulp.dest(output + '/settings/img'));
});