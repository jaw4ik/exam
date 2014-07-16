define(['./configuration/xApiSettings', './base64', './errorsHandler'],
    function (defaults, base64, errorsHandler) {

        var lrsSettings = null;

        var eventManager = {
            init: init,
            sendStatement: sendStatement
        };
        return eventManager;

        function init(settings) {
            lrsSettings = settings.lrs;
            return Q.fcall(function () {
                initXDomainRequestTransport();
            });
        }

        function sendStatement(statement) {
            var request = createRequest(statement);

            if (!$.support.cors) {
                request = getOptionsForIEMode(request);
            }

            return Q($.ajax(request));
        }

        function initXDomainRequestTransport() {
            if (window.XDomainRequest) {
                jQuery.ajaxTransport(function (s) {

                    var xdr;

                    return {

                        send: function (headers, complete) {

                            function callback(status, statusText, responses, responseHeaders) {
                                xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                                xdr = undefined;
                                complete(status, statusText, responses, responseHeaders);
                            }

                            xdr = new window.XDomainRequest();

                            xdr.onload = function () {
                                callback(200, "OK", { text: xdr.responseText });
                            };

                            xdr.onerror = function () {
                                callback(-1, errorsHandler.errors.xDomainRequestError);
                            };

                            if (s.timeout) {
                                xdr.timeout = s.timeout;
                                xdr.ontimeout = function () {
                                    callback(-1, errorsHandler.errors.timeoutError);
                                };
                            }

                            try {
                                xdr.open(s.type, s.url, true);
                            }
                            catch (e) {
                                var errorMessage;

                                if (location.protocol != s.url.split("/")[0])
                                    errorMessage = errorsHandler.errors.invalidProtocol;
                                else
                                    errorMessage = e.message;

                                callback(-1, errorMessage);
                                return;
                            }

                            xdr.send((s.hasContent && s.data) || null);
                        },

                        abort: function () {
                            if (xdr) {
                                xdr.onerror = jQuery.noop();
                                xdr.abort();
                            }
                        }
                    };

                });
            }
        }

        function getOptionsForIEMode(options) {
            var newUrl = options.url;

            //Everything that was on query string goes into form vars
            var formData = new Array();
            var qsIndex = newUrl.indexOf('?');
            if (qsIndex > 0) {
                formData.push(newUrl.substr(qsIndex + 1));
                newUrl = newUrl.substr(0, qsIndex);
            }

            //Method has to go on querystring, and nothing else
            options.url = newUrl + '?method=' + options.type;

            //Headers
            if (!_.isUndefined(options.headers) && _.isArray(options.headers)) {
                for (var headerName in options.headers)
                    formData.push(
                        headerName + "=" + encodeURIComponent(options.headers[headerName]));
            }

            options.headers = {};

            //The original data is repackaged as "content" form var
            if (!_.isUndefined(options.data)) {
                formData.push('content=' + encodeURIComponent(options.data));
            }

            options.data = formData.join("&");
            options.type = "POST";

            return options;
        }

        function createRequest(statement) {
            var lrsUrl = lrsSettings.uri;

            if (lrsUrl.indexOf("/statements") === -1)
                lrsUrl = lrsUrl + "/statements";

            var userName = '';
            var password = '';

            if (lrsSettings.authenticationRequired) {
                userName = lrsSettings.credentials.username;
                password = lrsSettings.credentials.password;
            } else {
                userName = defaults.anonymousCredentials.username;
                password = defaults.anonymousCredentials.password;
            }

            var headers = [];
            headers["X-Experience-API-Version"] = defaults.xApiVersion;
            headers["Content-Type"] = "application/json";
            var auth = "Basic " + base64.encode(userName + ':' + password);
            headers["Authorization"] = auth;


            var options = {};

            options.url = lrsUrl;
            options.data = JSON.stringify(statement);
            options.type = 'POST';
            options.headers = headers;
            options.timeout = defaults.timeout;
            options.contentType = 'application/json';
            options.dataType = 'json';
            options.async = true;

            options.beforeSend = function (xmlHttpRequest) {
                if (!_.isUndefined(options.headers) && _.isArray(options.headers)) {
                    for (var headerName in options.headers)
                        xmlHttpRequest.setRequestHeader(headerName, options.headers[headerName]);
                }
                options.headers = null;
            };

            options.success = function (response) {
            };

            options.error = function (request, textStatus, error) {
                switch (request.status) {
                    case 0:
                        error = errorsHandler.errors.invalidEndpoint;
                        break;
                    case 400:
                        if (request.responseText.indexOf("Mbox") !== -1)
                            error = errorsHandler.errors.invalidEmail;

                        else if (request.responseText.indexOf("URL") !== -1 || request.responseText.indexOf("endpoint") !== -1)
                            error = errorsHandler.errors.invalidEndpoint;

                        else error = errorsHandler.errors.badRequest + request.responseText;

                        break;
                    case 401:
                        error = errorsHandler.errors.invalidCredentials;
                        break;
                    case 404:
                        error = errorsHandler.errors.notFoundEndpoint;
                        break;
                    default:
                        error = errorsHandler.errors.unhandledMessage + request.statusText;
                        break;
                }

                errorsHandler.handleError(error);
            };

            return options;
        }
    }
);