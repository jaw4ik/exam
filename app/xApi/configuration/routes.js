define([], function () {

    return [
        {
            route: 'login',
            moduleId: 'xApi/viewmodels/login',
            title: 'Login',
            hideNav: true,
            rootLinkDisabled: true
        },
        {
            route: 'xapierror(/:backUrl)',
            moduleId: 'xApi/viewmodels/xAPIError',
            title: 'xAPI Error',
            hideNav: true,
            rootLinkDisabled: true
        }
    ];

});