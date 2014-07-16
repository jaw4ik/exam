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
            route: 'xapinotsupported',
            moduleId: 'xApi/viewmodels/xAPINotSupported',
            title: 'Progress tracking cannot be established',
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