exports.config = function (weyland) {
    weyland.build('main')
        //.task.jshint({
        //    include: 'App/**/*.js',
        //    exclude: ['App/main-built.js']
        //})
        .task.rjs({
            include: ['app/**/*.{js,html}', 'js/durandal/**/*.js'],
            exclude: ['app/**/*.spec.js', 'app/specs.html'],
            loaderPluginExtensionMaps: {
                '.html': 'text'
            },
            rjs: {
                name: 'main',
                insertRequire: ['main'],
                mainConfigFile: 'app/main.js',
                baseUrl: 'app',
                paths: {
                    'text': '../js/text',
                    'durandal': '../js/durandal',
                    'plugins': '../js/durandal/plugins',
                    'transitions': '../js/durandal/transitions',
                    'knockout': 'empty:',
                    'jquery': 'empty:'
                },
                inlineText: true,
                optimize: 'uglify2',
                stubModules: ['text', 'knockout', 'jquery'],
                pragmas: {
                    build: true
                },
                out: 'app/main-built.js'
            }
        });
}
