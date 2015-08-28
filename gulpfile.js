var gulp = require('gulp'),
    del = require('del'),
    durandal = require('gulp-durandal'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    eventStream = require('event-stream'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    bower = require('gulp-bower'),
    output = ".output",
    buildVersion = +new Date();

function addBuildVersion() {
    return eventStream.map(function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\?|\&)v=([0-9]+)/gi, '')                                                                          // remove build version
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([?])/gi, '.$1?v=' + buildVersion + '&')          // add build version to resource with existing query param
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([\s\"\'\)])/gi, '.$1?v=' + buildVersion + '$2')  // add build version to resource without query param
            .replace(/urlArgs: 'v=buildVersion'/gi, 'urlArgs: \'v=' + buildVersion + '\'');                              // replace build version for require config
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
};

function removeDebugBlocks() {
    return eventStream.map(function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\/\* DEBUG \*\/)([\s\S])*(\/\* END_DEBUG \*\/)/gmi, '') // remove all code between '/* DEBUG */' and '/* END_DEBUG */' comment tags
            .replace(/(\/\* RELEASE)|(END_RELEASE \*\/)/gmi, ''); // remove '/* RELEASE' and 'END_RELEASE */' tags to uncomment release code
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
};

gulp.task('build', ['pre-build', 'build-app', 'build-settings'], function () {
});

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('bower', ['clean'], function () {
    return bower({ cmd: 'update' });
});

gulp.task('assets', ['clean', 'bower'], function () {
    gulp.src('vendor/easy-supported-browser/css/img/**')
        .pipe(gulp.dest(output + '/css/img'));
    gulp.src('vendor/easy-supported-browser/css/font/**')
        .pipe(gulp.dest(output + '/css/font'));
});

gulp.task('pre-build', ['clean', 'bower', 'assets'], function () {
});

gulp.task('build-app', ['pre-build'], function () {
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

    gulp.src('css/font/**')
        .pipe(gulp.dest(output + '/css/font'));

    gulp.src('css/img/**')
        .pipe(gulp.dest(output + '/css/img'));

    gulp.src('img/**')
        .pipe(gulp.dest(output + '/img'));

    gulp.src(['js/require.js'])
        .pipe(gulp.dest(output + '/js'));

    gulp.src('lang/*.json')
        .pipe(gulp.dest(output + '/lang'));

    gulp.src('manifest.json')
        .pipe(gulp.dest(output));

    gulp.src('preview/**')
        .pipe(gulp.dest(output + '/preview'));

    return durandal(
        {
            minify: true
        })
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/app'));
});

gulp.task('build-settings', ['build-design-settings', 'build-configure-settings'], function () {
    gulp.src('settings/api.js')
        .pipe(removeDebugBlocks())
        .pipe(uglify())
        .pipe(gulp.dest(output + '/settings'));

});

gulp.task('build-design-settings', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src(['settings/design/design.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/settings/design'));

    gulp.src('settings/design/css/fonts/**')
        .pipe(gulp.dest(output + '/settings/design/css/fonts'));

    gulp.src('settings/design/css/design.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(output + '/settings/design/css'));

});

gulp.task('build-configure-settings', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src(['settings/configure/configure.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/settings/configure'));

    gulp.src('settings/configure/img/**')
        .pipe(gulp.dest(output + '/settings/configure/img'));

    gulp.src('settings/configure/css/img/**')
        .pipe(gulp.dest(output + '/settings/configure/css/img'));

    gulp.src('settings/configure/css/fonts/**')
        .pipe(gulp.dest(output + '/settings/configure/css/fonts'));

    gulp.src('settings/configure/css/configure.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(output + '/settings/configure/css'));

});