define(['../constants'],
    function (constants) {

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

        return settings;

        function init(templateSettings) {
            return Q.fcall(function () {
                $.extend(settings.xApi, templateSettings);
            });
        }
    }
);