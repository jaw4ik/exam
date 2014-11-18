define(['plugins/router', 'context', '../configuration/viewConstants', '../errorsHandler', 'xApi/xApiInitializer', 'repositories/courseRepository'],
    function (router, context, viewConstants, errorsHandler, xApiInitializer, repository) {

        "use strict";

        var
            usermail = (function () {
                var value = ko.observable('');
                value.trim = function () {
                    value(ko.utils.unwrapObservable(value).trim());
                };
                value.isValid = ko.computed(function () {
                    return !!value() && viewConstants.patterns.email.test(value().trim());
                });
                value.isModified = ko.observable(false);
                value.markAsModified = function () {
                    value.isModified(true);
                    return value;
                };
                return value;
            })(),
            username = (function () {
                var value = ko.observable('');
                value.trim = function () {
                    value(ko.utils.unwrapObservable(value).trim());
                };
                value.isValid = ko.computed(function () {
                    return !!value() && !!value().trim();
                });
                value.isModified = ko.observable(false);
                value.markAsModified = function () {
                    value.isModified(true);
                    return value;
                };
                return value;
            })(),

            skip = function () {
                xApiInitializer.turnOff();
                startCourse();
            },

            login = function () {
                if (usermail.isValid() && username.isValid()) {
                    var course = repository.get();
                    var title = course.title;

                    var pageUrl = "";
                    if (window != window.top && ('referrer' in document)) {
                        pageUrl = document.referrer;
                    } else {
                        pageUrl = window.location.toString();
                    }

                    var url = pageUrl + '?course_id=' + context.courseId;
                    var actor = xApiInitializer.createActor(username(), usermail());
                    xApiInitializer.init(context.courseId, actor, title, url).then(function () {
                        startCourse();
                    }).fail(function (reason) {
                        xApiInitializer.turnOff();
                        errorsHandler.handleError(reason);
                    });
                }
                else {
                    usermail.markAsModified();
                    username.markAsModified();
                }
            },

            startCourse = function () {
                var course = repository.get();
                course.start();
                router.navigate('');
            },

            activate = function () {
            };

        return {
            activate: activate,

            usermail: usermail,
            username: username,

            skip: skip,
            login: login
        };

    });