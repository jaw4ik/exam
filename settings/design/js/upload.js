(function (app) {

    var url = location.protocol + '//' + location.host + '/storage/image/upload';

    var somethingWentWrongMessage = {
        title: 'Something went wrong',
        description: 'Please, try again'
    };

    var settings = {
        maxFileSize: 10, //MB
        supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif']
    };


    app.upload = function (callback) {

        var deffered = $.Deferred();

        var form = $("<form>")
            .hide()
            .attr('method', 'post')
            .attr('enctype', 'multipart/form-data')
            .insertAfter("body");

        var input = $("<input>")
            .attr('accept', settings.supportedExtensions.map(function (e) {
                return '.' + e;
            }).join(', '))
            .attr('type', 'file')
            .attr('name', 'file')
            .on('change', function () {
                if (callback) {
                    callback();
                }

                var file = this.files[0];

                var validationResult = validate(file);

                if (validationResult !== true) {
                    deffered.reject(validationResult);
                    return;
                }

                var formData = new FormData();
                formData.append('file', file);
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                }).done(function (response) {
                    try {
                        var obj = JSON.parse(response)
                        if (obj && obj.success && obj.data && obj.data.url) {
                            deffered.resolve(obj.data.url);
                        } else {
                            deffered.reject(somethingWentWrongMessage);
                        }

                    } catch (e) {
                        deffered.reject(somethingWentWrongMessage);
                    }

                }).fail(function () {
                    deffered.reject(somethingWentWrongMessage);
                });

            })
            .appendTo(form);

        input.click();

        return deffered.promise();
    };

    function validate(file) {
        var extension = file.name.split('.').pop().toLowerCase();

        if ($.inArray(extension, settings.supportedExtensions) === -1) {
            return {
                title: 'Unsupported image format',
                description: '(Allowed formats: ' + settings.supportedExtensions.join(', ') + ')'
            };
        }
        if (file.size > settings.maxFileSize * 1024 * 1024) {
            return {
                title: 'File is too large',
                description: '(Max file size: ' + settings.maxFileSize + 'MB)'
            };
        }

        return true;
    }

})(window.app = window.app || {});
