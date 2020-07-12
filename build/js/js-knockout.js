ko.validation.init({
    insertMessages: false
});

function slideBeforeRemoveFactory (duration = 200, delay = 0) {
    return element => $(element).delay(delay).slideUp(duration, () => $(element).remove());
}

function slideAfterAddFactory (duration = 200, delay = 0) {
    return element => $(element).hide().delay(delay).slideDown(duration);
}

function fadeBeforeRemoveFactory (duration = 200, delay = 0) {
    return element => $(element).delay(delay).fadeOut(duration, () => $(element).remove());
}

function fadeAfterAddFactory (duration = 200, delay = 0) {
    return element => $(element).hide().delay(delay).fadeIn(duration);
}

function templateIf (condition, data) {
    return condition ? [data] : undefined;
}

ko.bindingHandlers.select2 = {
    init: function (element, valueAccessor, allBindings) {
        const $element = $(element);
        const isMultiple = $element.prop('multiple');
        const valueObservable = allBindings()[!isMultiple ? 'value' : 'selectedOptions'];

        const customOptionNames = ['wrapperCssClass'];

        const defaultOptions = {
            minimumResultsForSearch: Infinity,
            language: 'ru',
            width: 'element',
            dropdownAutoWidth: true
        };

        if (valueObservable) {
            $element.val(ko.utils.unwrapObservable(valueObservable));
        }

        const options = ko.utils.unwrapObservable(valueAccessor());

        const customOptions = _.pick(options, customOptionNames);

        const originalRenderFn = $.fn.select2.amd.require('jquery.select2').prototype.render;

        $.fn.select2.amd.require('jquery.select2').prototype.render = function () {
            const $container = originalRenderFn.call(this, ...arguments);

            if ('wrapperCssClass' in customOptions) {
                $container.addClass(customOptions.wrapperCssClass);
            }

            return $container;
        };

        $element.select2($.extend(defaultOptions, _.omit(options, customOptionNames)));

        $.fn.select2.amd.require('jquery.select2').prototype.render = originalRenderFn;

        if ('wrapperCssClass' in customOptions) {
            const $wrapper = $element.data('select2').$container;
            $wrapper.addClass(customOptions.wrapperCssClass);
        }

        $element.data('select2').$results.addClass('scrollbar-inner').scrollbar();

        if (valueObservable) {
            if (ko.isObservable(valueObservable)) {
                $element.on('change', () => {
                    const value = $element.val();
                    valueObservable(value);
                });
            }
        }
    },
    update: function (element, valueAccessor, allBindings) {
        const $element = $(element);
        const isMultiple = $element.prop('multiple');
        const value = !isMultiple
            ? allBindings.get('value')
            : allBindings.get('selectedOptions');

        if (value !== undefined && ko.isObservable(value)) {
            value.subscribe((v) => {
                $element.trigger('change.select2');
            });
        }
    }
};

ko.bindingHandlers.log = {
    update: function (
        element,
        valueAccessor,
        allBindings,
        viewModel,
        bindingContext,
    ) {
        console.group('log');
        console.info('element', element);
        console.info('valueAccessor', valueAccessor());
        console.info('allBindings', allBindings());
        console.info('viewModel', viewModel);
        console.info('bindingContext', bindingContext);
        console.groupEnd('log');
    },
};
