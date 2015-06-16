(function (app) {

    app.UserAccessModel = UserAccessModel;
    app.LogoModel = LogoModel;
    app.BackgroundModel = BackgroundModel;

    function UserAccessModel(userData) {
        this.hasStarterPlan = userData && userData.accessType > 0;
    }

    function LogoModel(logoSettings) {
        var that = this;

        that.url = ko.observable('');
        that.hasLogo = ko.computed(function () {
            return that.url() !== '';
        });
        that.clear = function () {
            that.url('');
        };
        that.isError = ko.observable(false);
        that.errorText = ko.observable('');
        that.errorDescription = ko.observable('');
        that.isLoading = ko.observable(false);

        that.setUrl = setUrl;
        that.getData = getData;

        that.upload = upload;

        init(logoSettings);

        return that;

        function init(logoSettings) {
            if (!logoSettings) {
                return;
            }

            that.setUrl(logoSettings.url);
        }

        function upload() {
            if (that.isLoading()) {
                return;
            }

            app.upload(function () {
                setLoadingStatus();
            }).done(function (url) {
                setUrl(url);
                setDefaultStatus();
            }).fail(function (reason) {
                setFailedStatus(reason.title, reason.description);
            });
        }

        function setDefaultStatus() {
            that.isLoading(false);
            that.isError(false);
        }

        function setFailedStatus(reasonTitle, reasonDescription) {
            that.clear();
            that.isLoading(false);
            that.isError(true);
            that.errorText(reasonTitle);
            that.errorDescription(reasonDescription);
        }

        function setLoadingStatus() {
            that.clear();
            that.isLoading(true);
        }

        function setUrl(url) {
            that.url(url || '');
        }

        function getData() {
            return {
                url: that.url()
            };
        }
    }
    function BackgroundModel(backgroundSettings) {
        var settings = $.extend(true, {
            image: {
                src: null,
                type: 'default'
            }
        }, backgroundSettings);

        var that = this;
        that.image = ko.observable(settings.image.src);
        that.image.isUploading = ko.observable(false);
        that.image.isEmpty = ko.computed(function () {
            return !(that.image() && that.image().length > 0);
        });

        that.type = ko.observable(settings.image.type);
        that.type.default = function () {
            that.type('default');
        };
        that.type.repeat = function () {
            that.type('repeat');
        };
        that.type.fullscreen = function () {
            that.type('fullscreen');
        };

        that.errorTitle = ko.observable();
        that.errorDescription = ko.observable();
        that.hasError = ko.observable(false);

        that.changeImage = function () {
            if (that.image.isUploading()) {
                return;
            }

            app.upload(function () {
                that.image.isUploading(true);

                that.hasError(false);
                that.errorTitle(undefined);
                that.errorDescription(undefined);
            }).done(function (url) {
                that.image(url);
            }).fail(function (reason) {
                that.image(undefined);
                that.hasError(true);
                that.errorTitle(reason.title);
                that.errorDescription(reason.description);
            }).always(function () {
                that.image.isUploading(false);
            });
        };

        that.clearImage = function () {
            that.image(null);
        };

        that.getData = function () {
            return {
                image: {
                    src: that.image(),
                    type: that.type()
                }
            };
        };
    }

})(window.app = window.app || {});
