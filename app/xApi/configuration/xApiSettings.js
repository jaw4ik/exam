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
                uri: 'https://easydev.waxlrs.com/TCAPI/statements',
                authenticationRequired: true,
                credentials: {
                    username: 'RvSn9J4KbNpx37l6WSN6',
                    password: 'xS59aSths74X6fQUnG4H'
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