define([], function() {
    var ctor = function(spec) {

        var templateSetting = _.defaults(spec, {
            "logo": {
                "url": ""
            },
            "theme": {
                "key": ""
            },
            "xApi": {
                "enabled": false,
                "lrs": {
                    "uri": "",
                    "credentials": {
                        "username": "",
                        "password": ""
                    },
                    "authenticationRequired": false
                },
                "allowedVerbs": []
            },
            "masteryScore": {
                "score": "100"
            }
        });

        return templateSetting;
    };

    return ctor;

});