define(['plugins/http', 'eventManager', 'repositories/questionRepository', 'viewmodels/questions/helpers/textMatchingQuestion'], function (http, eventManager, questionRepository, textMatchingViewHandler) {
    "use strict";

    var ctor = function (question, index, questionsCount) {
        var
            that = this,
            values = _.chain(question.answers)
                .map(function (answer) {
                    return answer.value;
                })
                .shuffle()
                .value()
        ;

        that.id = question.id;
        that.objectiveId = question.objectiveId;
        that.index = index;
        that.questionsCount = questionsCount;
        that.title = question.title;
        that.hasContent = question.hasContent;
        that.content = '';
        that.sources = [];
        that.targets = [];

        that.activate = function () {
            return Q.fcall(function () {
                that.sources = _.map(question.answers, function (answer) {
                    return new Source(answer.id, answer.key);
                });
                that.targets = _.map(values, function (value) {
                    return new Target(value);
                });
            });
        };
        that.compositionComplete = function (element) {
            return Q.fcall(function () {
                textMatchingViewHandler(element);
            });
        }

        that.submit = function () {
            question.answer(_.map(that.sources, function (source) {
                return { id: source.id, value: ko.utils.unwrapObservable(source.value) };
            }));
        };
    };

    return ctor;

    function Source(id, key) {
        this.id = id;
        this.key = key;
        this.value = ko.observable();

        this.acceptValue = function (value) {
            this.value(value);
        }
        this.rejectValue = function () {
            this.value(null);
        }
    }

    function Target(value) {
        this.value = ko.observable(value);
        this.acceptValue = function (value) {
            this.value(value);
        }
        this.rejectValue = function () {
            this.value(null);
        }
    }

});