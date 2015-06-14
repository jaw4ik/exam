define([], function () {

    var defaultTranslationsCode = 'en';

    var defaultTemplateSetting = {
        "logo": {
            "url": ""
        },
        'background': {
            "image": {
                'src': ''
            }
        },
        "xApi": {
            "enabled": true,
            "selectedLrs": "default",
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
        "languages": {
            "selected": "",
            "customTranslations": {}
        }
    };


    return {
        init: init,

        masteryScore: {
            score: 100
        },

        logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAAAcCAYAAAAA7n9nAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTNDREFFQ0NFQUU3MTFFMjhDRkZDNEQyMDc1NTBDM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTNDREFFQ0RFQUU3MTFFMjhDRkZDNEQyMDc1NTBDM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5M0NEQUVDQUVBRTcxMUUyOENGRkM0RDIwNzU1MEMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5M0NEQUVDQkVBRTcxMUUyOENGRkM0RDIwNzU1MEMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkL3KQIAAAtiSURBVHja7FsLdBTV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',
        background: {
            "image": {
                'src': ''
            }
        },
        xApi: {}
    };

    function init(settings) {
        var that = this;

        var fullSettings = _.defaults(settings, defaultTemplateSetting);
        return Q.fcall(function () {
            //Mastery score initialization
            if (fullSettings.masteryScore) {
                var score = Number(fullSettings.masteryScore.score);
                that.masteryScore.score = (_.isNumber(score) && score >= 0 && score <= 100) ? score : 100;
            }

            //Course logo initialization
            if (!_.isEmptyOrWhitespace(fullSettings.logo.url)) {
                that.logoUrl = fullSettings.logo.url;
            }
            //Course background initialization
            if (fullSettings.background) {
                that.background = fullSettings.background;
            }

            that.xApi = fullSettings.xApi;
        });
    }

});