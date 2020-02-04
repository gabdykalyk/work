ko.bindingHandlers.hrmSelect = {
    init: function (element, valueAccessor, allBindings) {
        const $element = $(element);
        const value = allBindings.get('value');
        const wrapperClass = allBindings.get('hrmSelectClass');

        const options = {
            minimumResultsForSearch: Infinity,
            language: 'ru',
            width: '100%',
            dropdownAutoWidth: true,
            dropdownCssClass: 'hrm-select__dropdown',
            placeholder: ' '
        };

        if (value) {
            $element.val(ko.utils.unwrapObservable(value));
        }

        const Select = $.fn.select2.amd.require('jquery.select2');

        const originalSelectRenderFn = Select.prototype.render;

        Select.prototype.render = function () {
            const $container = originalSelectRenderFn.call(this, ...arguments);
            $container.addClass('hrm-select');

            if (wrapperClass !== undefined) {
                $container.addClass(wrapperClass.split(' '));
            }

            return $container;
        };

        $element.select2(options);

        Select.prototype.render = originalSelectRenderFn;

        const select2Instance = $element.data('select2');

        select2Instance.$results.unbind('mousewheel');

        const $dropdownResultsContainer = $element.data('select2').$results.parent();
        $dropdownResultsContainer.overlayScrollbars({});

        const openHandler = () => {
            $dropdownResultsContainer.overlayScrollbars().update(true);
        };

        const openingHandler = () => {
            select2Instance.$dropdown.hide().fadeIn(150);
        };

        let isClosingAnimated = false;
        const closingHandler = () => {
            if (!isClosingAnimated) {
                select2Instance.$dropdown.fadeOut(150, () => {
                    isClosingAnimated = true;
                    select2Instance.close();
                });

                return false;
            } else {
                isClosingAnimated = false;
                return true;
            }
        };

        $element.on('select2:open', openHandler);
        $element.on('select2:opening', openingHandler);
        $element.on('select2:closing', closingHandler);

        const changeHandler = () => {
            if (value !== undefined && ko.isObservable(value)) {
                const value = $element.val();
                value(value);
            }
        };

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $element.off('change', changeHandler);
            $element.off('select2:open', openHandler);
            $element.off('select2:opening', openingHandler);
            $element.off('select2:closing', closingHandler);
        });
    },
    update: function (element, valueAccessor, allBindings) {
        const $element = $(element);
        const value = allBindings.get('value');

        if (value !== undefined && ko.isObservable(value)) {
            value.subscribe(v => {
                $element.val(v).trigger('change');
            });
        }
    }
};