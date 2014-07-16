define(['xApi/constants'],
    function (constants) {

        var settings = {
            LRS: {
                uri: 'http://cloud.scorm.com/ScormEngineInterface/TCAPI/public/',

                credentials: {
                    username: "",
                    password: ""
                }
            },

            scoresDistribution: {
                minScoreForPositiveResult: 1,
                positiveVerb: constants.verbs.passed
            },

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0"
        };

        return settings;
    }
);