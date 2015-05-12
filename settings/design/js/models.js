(function (app) {

    app.UserAccessModel = UserAccessModel;
    app.LogoModel = LogoModel;

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
            })
                .done(function (url) {
                    setUrl(url);
                    setDefaultStatus();
                })
                .fail(function (reason) {
                    setFailedStatus(reason.title, reason.description)
                });
        }

        function setDefaultStatus() {
            that.isLoading(false);
            that.isError(false);
        }

        function setFailedStatus(reasonTitle, reasonDescription) {
            that.clear();
            that.isLoading(false);
            that.errorText(reasonTitle);
            that.errorDescription(reasonDescription);
            that.isError(true);
        }

        function setLoadingStatus() {
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

})(window.app = window.app || {});
