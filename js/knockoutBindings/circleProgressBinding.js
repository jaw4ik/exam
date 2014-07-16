ko.bindingHandlers.circleProgress = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var score = valueAccessor().progress || 0;
        var lineWidth = valueAccessor().lineWidth || 13;
        var circleColor = valueAccessor().basicColor || '#d2c8bf',
            strokeColor = valueAccessor().strokeColor || 'white';
        var progressColor = valueAccessor().progressColor || '#92ae46';

        var centerX = element.width / 2;
        var centerY = element.height / 2;
        var radius = (centerX < centerY ? centerX : centerY - lineWidth / 2) - 1;

        var progress = score / 100;

        var cnxt = element.getContext('2d');

        cnxt.beginPath();
        cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        cnxt.strokeStyle = strokeColor;
        cnxt.lineWidth = lineWidth + 2;
        cnxt.closePath();
        cnxt.stroke();

        cnxt.beginPath();
        cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        cnxt.strokeStyle = circleColor;
        cnxt.lineWidth = lineWidth;
        cnxt.closePath();
        cnxt.stroke();

        if (progress > 0) {
            cnxt.beginPath();
            cnxt.strokeStyle = progressColor;
            cnxt.lineWidth = lineWidth - 1;

            if (progress == 1) {
                cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            }
            else {
                cnxt.arc(centerX, centerY, radius, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
            }

            cnxt.stroke();
        }

        var ang, sinAng, cosAng,
            sx, sy,
            ex, ey;

        for (var i = 1; i <= 60; i += 6) {
            ang = Math.PI / 30 * i + 0.55;
            sinAng = Math.sin(ang);
            cosAng = Math.cos(ang);

            cnxt.lineWidth = 1;
            sx = sinAng * 30;
            sy = cosAng * -30;
            ex = sinAng * 45;
            ey = cosAng * -45;

            cnxt.strokeStyle = "#fff";
            cnxt.beginPath();
            cnxt.moveTo(sx + 45, sy + 45);
            cnxt.lineTo(ex + 45, ey + 45);
            cnxt.stroke();
        }
    }
};