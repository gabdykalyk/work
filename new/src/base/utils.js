ko.bindingHandlers.hrmSlide = {
    init: function (element, valueAccessor, allBindings) {
        const value = ko.unwrap(allBindings.get('hrmSlideValue'));

        if (value) {
            $(element).slideDown(0);
        } else {
            $(element).slideUp(0);
        }

        $(element).data('hrmSlide', value);
    },
    update: function (element, valueAccessor, allBindings) {
        const value = ko.unwrap(allBindings.get('hrmSlideValue'));
        const duration = allBindings.get('hrmSlideDuration') || 200;

        if ($(element).data('hrmSlide') !== value) {
            if (value) {
                $(element).slideDown(duration);
            } else {
                $(element).slideUp(duration);
            }

            $(element).data('hrmSlide', value);
        }
    }
};

ko.bindingHandlers.hrmFade = {
    init: function (element, valueAccessor, allBindings) {
        const value = ko.unwrap(allBindings.get('hrmFadeValue'));

        if (value) {
            $(element).fadeIn(0);
        } else {
            $(element).fadeOut(0);
        }

        $(element).data('hrmFade', value);
    },
    update: function (element, valueAccessor, allBindings) {
        const value = ko.unwrap(allBindings.get('hrmFadeValue'));
        const duration = allBindings.get('hrmFadeDuration') || 200;
        const inDelay = allBindings.get('hrmFadeInDelay') || 0;
        const outDelay = allBindings.get('hrmFadeOutDelay') || 0;

        if ($(element).data('hrmFade') !== value) {
            if (value) {
                $(element).delay(inDelay).fadeIn(duration);
            } else {
                $(element).delay(outDelay).fadeOut(duration);
            }

            $(element).data('hrmFade', value);
        }
    }
};