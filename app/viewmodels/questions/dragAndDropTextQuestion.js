define(['plugins/http', 'eventManager', 'repositories/questionRepository', 'plugins/router'], function (http, eventManager, questionRepository, router) {
    "use strict";

    var ctor = function (question, index, questionsCount) {
        var that = this;

        that.id = question.id;
        that.objectiveId = question.objectiveId;
        that.index = index;
        that.questionsCount = questionsCount;
        that.title = question.title;
        that.hasContent = question.hasContent;
        that.content = '';
        that.background = question.background;
        that.dropspots = [];
        that.texts = [];

        that.activate = function () {
            return Q.fcall(function () {
                that.dropspots = _.map(question.dropspots, function (dropspot) {
                    return {
                        x: dropspot.x,
                        y: dropspot.y,
                        text: ko.observable()
                    }
                });
                that.texts = _.map(question.dropspots, function (dropspot) {
                    return {
                        id: dropspot.id,
                        text: dropspot.text
                    };
                });
            });
        };
        

        that.submit = function () {
            var answer = [];

            _.each(that.dropspots, function (dropspot) {
                var text = dropspot.text();
                if (text) {
                    answer.push({
                        id: text.id,
                        x: dropspot.x,
                        y: dropspot.y
                    });
                }

            });

            var question = questionRepository.get(that.objectiveId, that.id);
            question.answer(answer);
        };
    };

    return ctor;

});