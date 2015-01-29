define(['../constants'],
    function(constants) {

        var settings = {
            scoresDistribution: {
                positiveVerb: constants.verbs.passed
            },

            anonymousCredentials: {
                username: "",
                password: ""
            },

            xApi: {
                allowedVerbs: []
            },

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0",


            init: init
        };

        var defaultXapi = {
            lrs: {
                uri: '//reports.easygenerator.com/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            },
            allowedVerbs: ['started', 'stopped', 'mastered', 'answered', 'passed', 'failed']
        };

        return settings;

        function init(templateSettings) {
            return Q.fcall(function() {
                if (templateSettings.selectedLrs != 'default') {
                    $.extend(settings.xApi, templateSettings);
                } else {
                    $.extend(settings.xApi, defaultXapi);
                }
            });
        }
    }
);