(function (app) {

    app.localize = function (key) {
        return translations[key];
    };

    var translations = {
        'changes are saved': 'All changes are saved',
        'changes are not saved': 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',
        'settings are not initialize': 'Template settings are not initialized. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',

        //graphical customization tab
        'graphical customization': 'Graphical customization',
        'customize your course': 'Customize your course',
        'look and feel of the course': 'Change the look and feel of the course',
        'custom course logo': 'Custom course logo:',
        'or': 'or',
        'upload logo image': 'Upload logo image',
        'logo hint': 'Your logo will appear here<p>(recommended size 300 x 50 px)</p>',
        'clear logo': 'Clear logo',
        'choose color scheme': 'Choose color scheme:',
        'upgrade account hint': 'You have to <a target="_blank" href="/account/upgrade">upgrade your account</a> in order to set custom course logo'
    };

})(window.app = window.app || {});
