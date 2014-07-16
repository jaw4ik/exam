define(['../guard'], function(guard) {
    var timeToISODurationString = function (timeInMilliseconds) {
        guard.throwIfNotNumber(timeInMilliseconds, 'You should provide only number');
        timeInMilliseconds /= 1000;

        var hours = parseInt(timeInMilliseconds / 3600, 10);
        timeInMilliseconds -= hours * 3600;

        var minutes = parseInt(timeInMilliseconds / 60, 10);
        timeInMilliseconds -= minutes * 60;

        var seconds = parseInt(timeInMilliseconds, 10);

        return 'PT' + hours + 'H' + minutes + 'M' + seconds + 'S';
    };

    return {
         timeToISODurationString: timeToISODurationString
    };
});