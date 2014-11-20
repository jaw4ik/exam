define([],
    function () {

        "use strict";

        var
            windowOperations = {
                close: close
            };

        return windowOperations;

        function close() {
            window.close();
			_.delay(function() {
				window.alert('Thank you. It is now safe to close this page.');
			}, 100);
        }

    }
);