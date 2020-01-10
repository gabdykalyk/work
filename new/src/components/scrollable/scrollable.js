ko.bindingHandlers.hrmScrollable = {
    init: function (element) {
        const $element = $(element);
        $element.addClass('hrm-scrollable__content');
        $element.overlayScrollbars({
            className: 'hrm-scrollable'
        });
    }
};