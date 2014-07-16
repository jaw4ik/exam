define([], function () {

    return {
        initialize: initialize,
        masteryScore: {
            score: 100
        }
    };

    function initialize(settings) {
        var that = this;
        return Q.fcall(function () {
            var score = Number(settings.score);
            that.masteryScore.score = (_.isNumber(score) && score >= 0 && score <= 100) ? score : 100;
        });
    }
})