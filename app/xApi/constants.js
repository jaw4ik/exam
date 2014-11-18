define([], function () {

    var
        verbs = {
            started: {
                id: "http://adlnet.gov/expapi/verbs/launched",
                display: {
                    "en-US": "started"
                }
            },
            stopped: {
                id: "http://adlnet.gov/expapi/verbs/exited",
                display: {
                    "en-US": "stopped"
                }
            },
            passed: {
                id: "http://adlnet.gov/expapi/verbs/passed",
                display: {
                    "en-US": "passed"
                }
            },
            failed: {
                id: "http://adlnet.gov/expapi/verbs/failed",
                display: {
                    "en-US": "failed"
                }
            },
            answered: {
                id: "http://adlnet.gov/expapi/verbs/answered",
                display: {
                    "en-US": "answered"
                }
            },
            mastered: {
                id: "http://adlnet.gov/expapi/verbs/mastered",
                display: {
                    "en-US": "mastered"
                }
            }
        },

    interactionTypes = {
        choice: "choice",
        fillIn: "fill-in",
        other: "other",
        matching: "matching",
        dragAndDrop: "dragAndDrop",
        hotspot: "hotspot"
    },

    extenstionKeys = {
        courseId: "http://easygenerator/expapi/course/id"
    };

    return {
        interactionTypes: interactionTypes,
        verbs: verbs,
        extenstionKeys: extenstionKeys
    };

});