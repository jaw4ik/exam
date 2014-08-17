define(function (require) {
    return {
        getCollection: function () {
            return [
                require('bootstrapping/browserSupportTask'),
                require('bootstrapping/viewLocatorTask'),
                require('bootstrapping/fillInTheBlankAnswersBindingTask'),
                require('bootstrapping/dragAndDropTextQuestionBindingTask'),
                require('bootstrapping/textMatchingQuestionBindingTask'),
                require('bootstrapping/imageWrapBindingTask'),
                require('bootstrapping/thumbnailBindingHandlerTask')
            ];
        }
    };
})