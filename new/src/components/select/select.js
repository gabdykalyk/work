ko.bindingHandlers.hrmSelect = {
    init: function (element, valueAccessor, allBindings) {
        const $element = $(element);
        const isMultiple = $element.prop('multiple');
        const value = !isMultiple ? allBindings.get('value') : allBindings.get('selectedOptions');
        const wrapperClass = allBindings.get('hrmSelectClass');
        const customValuesAllowed = allBindings.has('hrmSelectCustomValuesAllowed') ? allBindings.get('hrmSelectCustomValuesAllowed') : false;
        const searchEnabled = allBindings.has('hrmSelectSearchEnabled') ? allBindings.get('hrmSelectSearchEnabled') : false;
        const placeholder = allBindings.has('hrmSelectPlaceholder') ? allBindings.get('hrmSelectPlaceholder') : ' ';
        const allowClear = allBindings.has('hrmSelectAllowClear') ? allBindings.get('hrmSelectAllowClear') : false;

        if (customValuesAllowed && (!isMultiple && !searchEnabled)) {
            throw Error('You have to enable both options "hrmSelectCustomValuesAllowed" and "hrmSelectSearchEnabled"');
        }

        const options = {
            minimumResultsForSearch: searchEnabled ? 0 : Infinity,
            language: 'ru',
            width: '100%',
            dropdownAutoWidth: true,
            dropdownCssClass: 'hrm-select__dropdown',
            placeholder,
            allowClear,
            templateSelection: state => $('<span>').addClass('hrm-select__rendered-text').text(state.text),
            tags: customValuesAllowed
        };

        const Select = $.fn.select2.amd.require('jquery.select2');
        const Search = $.fn.select2.amd.require('select2/selection/search');

        const originalSelectRenderFn = Select.prototype.render;
        const originalSearchUpdateFn = Search.prototype.update;

        Select.prototype.render = function () {
            const $container = originalSelectRenderFn.call(this, ...arguments);
            $container.addClass('hrm-select');

            if (wrapperClass !== undefined) {
                $container.addClass(wrapperClass.split(' '));
            }

            return $container;
        };

        Search.prototype.update = function () {
            originalSearchUpdateFn.call(this, ...arguments);
            $element.trigger('hrm-select:search-update');
        };

        $element.select2(options);

        Select.prototype.render = originalSelectRenderFn;
        Search.prototype.update = originalSearchUpdateFn;

        const select2Instance = $element.data('select2');

        select2Instance.$results.unbind('mousewheel');

        const $dropdownResultsContainer = $element.data('select2').$results.parent();
        $dropdownResultsContainer.overlayScrollbars({
            callbacks: {
                    onUpdated: () => {
                    if (select2Instance.$dropdown.is(':visible')) {
                        select2Instance.dropdown._positionDropdown();

                        // Правка бага в Chrome с неправильным синхронным вычислением положения выпадающего списка
                        setTimeout(() => {
                            select2Instance.dropdown._positionDropdown();
                        });
                    }
                }
            }
        });

        function hasValue() {
            const value = $element.val();
            return value !== '' && value !== undefined && (!(value instanceof Array) || value.length !== 0);
        }

        select2Instance.$container.toggleClass('hrm-select--has-value', hasValue());

        const openHandler = () => {
            $dropdownResultsContainer.overlayScrollbars().scroll(0);
        };

        const openingHandler = () => {
            select2Instance.$dropdown.hide().fadeIn(150);
        };

        const changeHandler = () => {
            select2Instance.$container.toggleClass('hrm-select--has-value', hasValue());
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
        $element.on('change.select2', changeHandler);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $element.off('select2:open', openHandler);
            $element.off('select2:opening', openingHandler);
            $element.off('select2:closing', closingHandler);
            $element.off('change.select2', changeHandler);
        });
    },
    update: function (element, valueAccessor, allBindings) {
        const $element = $(element);
        const isMultiple = $element.prop('multiple');
        const value = !isMultiple ? allBindings.get('value') : allBindings.get('selectedOptions');

        if (value !== undefined && ko.isObservable(value)) {
            value.subscribe(v => {
                $element.trigger('change.select2');
            });
        }
    }
};
