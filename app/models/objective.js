define(['templateSettings'],
    function (templateSettings) {

        function Objective(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.image = spec.image;
            this.questions = spec.questions;
            this.score = spec.score;
            this.calculateScore = calculateScore;
            this.isCompleted = false;
        }

        var calculateScore = function () {
            var result = _.reduce(this.questions, function (memo, question) { return memo + question.score; }, 0);
            var questionsLength = this.questions.length;
            this.score = questionsLength == 0 ? 0 : Math.floor(result / questionsLength);
            this.isCompleted = this.score >= templateSettings.masteryScore.score;
        };

        return Objective;
    }
);