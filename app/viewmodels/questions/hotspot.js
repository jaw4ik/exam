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
        that.isMultiple = question.isMultiple;
        that.marks = ko.observableArray([]);

        that.activate = function () {
            return Q.fcall(function () {
                that.marks = ko.observableArray(question.placedMarks ? _.map(question.placedMarks, function (mark) { return { x: mark.x, y: mark.y }; }) : []);
                if (that.hasContent) {
                    return that.loadQuestionContent();
                }
            });
        };

        that.loadQuestionContent = function () {
            var contentUrl = 'content/' + that.objectiveId + '/' + that.id + '/content.html';
            return Q(http.get(contentUrl)).then(function (response) {
                that.content = response;
            }).fail(function () {
                that.content = settings.questionContentNonExistError;
            });
        };

        that.addMark = function (mark) {
            if (!that.isMultiple) {
                that.marks.removeAll();
            }
            that.marks.push(mark);
        };

        that.removeMark = function (mark) {
            that.marks.remove(mark);
        };

        that.submit = function () {
            question.answer(that.marks());
        };
    };

    return ctor;

});