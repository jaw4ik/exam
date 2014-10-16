define(['guard', 'eventManager', 'repositories/objectiveRepository'],
    function (guard, eventManager, objectiveRepository) {
        "use strict";

        function Hotspot(spec) {
            var that = this;

            that.id = spec.id;
            that.objectiveId = spec.objectiveId;
            that.title = spec.title;

            that.background = spec.background;
            that.spots = spec.spots;
            that.isMultiple = spec.isMultiple;

            that.learningContents = spec.learningContents;
            that.score = spec.score;
            that.isAnswered = false;
            that.hasContent = spec.hasContent;

            that.answer = function (marks) {
                guard.throwIfNotArray(marks, 'Marks is not array.');

                that.isAnswered = true;

                that.score = calculateScore(that.isMultiple, that.spots, marks);

                var objective = objectiveRepository.get(that.objectiveId);
                guard.throwIfNotAnObject(objective, 'Objective is not found');

                var eventData = {
                    type: "hotspot",
                    question: {
                        id: that.id,
                        title: that.title,
                        score: that.score,
                        spots: _.map(that.spots, function (spot) {
                            var polygonCoordinates = _.map(spot, function (spotCoordinates) {
                                return '(' + spotCoordinates.x + ',' + spotCoordinates.y + ')';
                            });
                            return polygonCoordinates.join("[,]");
                        }),
                        placedMarkers: _.map(marks, function (mark) {
                            return '(' + mark.x + ',' + mark.y + ')';
                        })
                    },
                    objective: {
                        id: objective.id,
                        title: objective.title
                    }
                };

                eventManager.answersSubmitted(eventData);
            };

            that.resetProgress = function () {
                that.score = 0;
            };
        };

        return Hotspot;

        function calculateScore(isMultiple, spots, placedMarks) {
            if (!_.isArray(spots) || spots.length == 0) {
                return 100;
            }

            if (!_.isArray(placedMarks)) {
                return 0;
            }

            var answerCorrect;
            if (!isMultiple) {
                answerCorrect = _.some(spots, function (spot) {
                    return _.some(placedMarks, function (mark) {
                        return markIsInSpot(mark, spot);
                    });
                });
            } else {
                var spotsWithMarks = [];
                var marksOnSpots = [];

                _.each(placedMarks, function (mark) {
                    _.each(spots, function (spot) {
                        if (markIsInSpot(mark, spot)) {
                            spotsWithMarks.push(spot);
                            marksOnSpots.push(mark);
                        }
                    });
                });

                answerCorrect = _.uniq(spotsWithMarks).length === spots.length && _.uniq(marksOnSpots).length === marks.length;
            }

            return answerCorrect ? 100 : 0;
        }

        function markIsInSpot(mark, spot) {
            var x = mark.x, y = mark.y;

            var inside = false;
            for (var i = 0, j = spot.length - 1; i < spot.length; j = i++) {
                var xi = spot[i].x, yi = spot[i].y;
                var xj = spot[j].x, yj = spot[j].y;

                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }

            return inside;
        };
    });