define(['translation'], function (translation) {
        "use strict";

        var
            windowOperations = {
                close: close
            };

        return windowOperations;

        function close() {
            window.close();
			_.delay(function() {
			    window.alert(translation.getTextByKey('[thank you message]'));
			}, 100);
        }

    }
);