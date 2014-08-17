define([], function () {

    var TextMatching = function (spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;
        that.hasContent = spec.hasContent;
        that.answers = spec.answers;

        that.isAnswered = false;
        that.isCorrectAnswered = false;
        that.score = 0;

        that.answer = function (pairs) {
            var correct = 0;
            _.each(that.answers, function (answer) {
                if (_.find(pairs, function (pair) {
                    return pair.id == answer.id && pair.value == answer.value;
                })) {
                    correct++;
                }

            });

            that.score = correct == that.answers.length ? 100 : 0;

            that.isAnswered = true;
            that.isCorrectAnswered = that.score == 100;
        };

        that.resetProgress = function () {
            that.isAnswered = false;
            that.isCorrectAnswered = false;
            that.score = 0;
        };
    };

    return TextMatching;

})