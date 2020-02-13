let hrmFormFieldNextId = 0;

ko.components.register('hrm-form-field', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-form-field']);

            if ('noLabel' in params && params.noLabel) {
                $element.addClass(['hrm-form-field--no-label']);
            }

            const ViewModel = function () {
                this.subscriptions = [];
                this.templateNodes = hrmSplitComponentTemplateNodes(componentInfo.templateNodes);
                this.element = componentInfo.element;
                this.controlWrapperElement = ko.observable(null);
                this.controlId = 'hrm-form-field-control-' + hrmFormFieldNextId++;

                this.hasError = (params !== undefined && 'hasError' in params) ? params.hasError : false;
                this.focused = ko.observable(false);
                this.hasValue = ko.observable(false);

                this.afterRender = function () {
                    $element.toggleClass('hrm-form-field--focused', this.focused());
                    this.subscriptions.push(this.focused.subscribe(focused => {
                        $element.toggleClass('hrm-form-field--focused', focused);
                    }));

                    $element.toggleClass('hrm-form-field--has-value', this.hasValue());
                    this.subscriptions.push(this.hasValue.subscribe(hasValue => {
                        $element.toggleClass('hrm-form-field--has-value', hasValue);
                    }));

                    if (!ko.isObservable(this.hasError)) {
                        $element.toggleClass('hrm-form-field--has-error', this.hasError);
                    } else {
                        $element.toggleClass('hrm-form-field--has-error', this.hasError());
                        this.subscriptions.push(this.hasError.subscribe(hasError => {
                            $element.toggleClass('hrm-form-field--has-error', hasError);
                        }));
                    }
                };

                if (params !== undefined && 'exportAs' in params) {
                    if (ko.isObservableArray(params.exportAs)) {
                        params.exportAs.push(this);
                    } else {
                        params.exportAs(this);
                    }
                }
            };

            ViewModel.prototype.dispose = function() {
                this.subscriptions.forEach(s => s.dispose());

                if (params !== undefined && 'exportAs' in params) {
                    if (ko.isObservableArray(params.exportAs)) {
                        params.exportAs.remove(this);
                    } else {
                        params.exportAs(null);
                    }
                }
            };

            return new ViewModel();
        }
    },
    template: `
        <!-- ko template: {afterRender: function () {afterRender();}} -->
            <!-- ko template: {nodes: templateNodes.slots['label']} --><!-- /ko -->
            <div class="hrm-form-field__control-wrapper" data-bind="hrmElement: controlWrapperElement">
                <!-- ko template: {nodes: templateNodes.main} --><!-- /ko -->
                <!-- ko template: {nodes: templateNodes.slots['suffix']} --><!-- /ko -->
            </div>
            <!-- ko template: {nodes: templateNodes.slots['error']} --><!-- /ko -->
        <!-- /ko -->
    `
});

ko.components.register('hrm-form-field-error', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-form-field__error']);

            return new (function () {
                this.templateNodes = hrmSplitComponentTemplateNodes(componentInfo.templateNodes);
            });
        }
    },
    template: `
        <span class="hrm-form-field__error-text">
            <!-- ko template: {nodes: templateNodes.main} --><!-- /ko -->
        </span>
    `
});

ko.bindingHandlers.hrmFormFieldInputControl = {
    init: function(element, valueAccessor, allBindings) {
        const formField = allBindings.get('hrmFormFieldInputControlOwner');
        const $wrapper = $(formField().controlWrapperElement());

        const $element = $(element);
        $element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_input']);
        $element.attr('id', formField().controlId);

        const wrapperClickHandler = () => $element.focus();
        const focusHandler = () => formField().focused(true);
        const blurHandler = () => formField().focused(false);
        const valueHandler = event => {
            const value = event.target.value;
            formField().hasValue(value !== '');
        };

        $wrapper.on('click', wrapperClickHandler);
        $element.on('focus', focusHandler);
        $element.on('blur', blurHandler);
        $element.on('input change', valueHandler);

        formField().focused($element.is(':focus'));
        formField().hasValue($element.val() !== '');

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $wrapper.off('click', wrapperClickHandler);
            $element.off('focus', focusHandler);
            $element.off('blur', blurHandler);
            $element.off('input change', valueHandler);
        });
    }
};

ko.bindingHandlers.hrmFormFieldSelectControl = {
    init: function(element, valueAccessor, allBindings) {
        const subscriptions = [];

        const formField = allBindings.get('hrmFormFieldSelectControlOwner');
        const $wrapper = $(formField().controlWrapperElement());

        const $element = $(element);
        const isMultiple = $element.prop('multiple');
        const select2Instance = $element.data('select2');

        const selectionFocused = ko.observable(select2Instance.$selection.is(':focus'));
        const searchFocused = isMultiple ? ko.observable(select2Instance.selection.$search.is(':focus')) : null;
        const dropdownOpened = ko.observable(false);

        subscriptions.push(
            ko.computed(() => selectionFocused() || dropdownOpened() || (searchFocused !== null && searchFocused()))
                .subscribe(value => formField().focused(value))
        );

        $element.attr('id', formField().controlId);

        select2Instance.$container.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_select']);
        select2Instance.$dropdown.children().first().addClass(['hrm-form-field__dropdown']);

        const emptyCheckFn = value => {
            return value !== '' && value !== undefined && (!(value instanceof Array) || value.length !== 0);
        };

        const wrapperMousedownHandler = event => {
            if (event.target !== element &&
                select2Instance.$container.get()[0] !== event.target &&
                select2Instance.$container.has(event.target).length === 0) {
                const isOpen = select2Instance.isOpen();

                setTimeout(() => {
                    select2Instance.$selection.focus();

                    if (!isOpen) {
                        select2Instance.open();
                    }
                });
            }
        };
        const selectionFocusHandler = () => selectionFocused(true);
        const selectionBlurHandler = () => selectionFocused(false);
        const searchFocusHandler = () => searchFocused(true);
        const searchBlurHandler = () => searchFocused(false);
        const openingHandler = () => dropdownOpened(true);
        const closeHandler = () => dropdownOpened(false);
        const changeHandler = () => {
            const value = $element.val();
            formField().hasValue(emptyCheckFn(value));
        };
        const searchUpdate = () => {
            if (isMultiple) {
                select2Instance.selection.$search.off('focus', searchFocusHandler);
                select2Instance.selection.$search.off('blur', searchBlurHandler);

                select2Instance.selection.$search.on('focus', searchFocusHandler);
                select2Instance.selection.$search.on('blur', searchBlurHandler);
            }
        };

        select2Instance.$selection.on('focus', selectionFocusHandler);
        select2Instance.$selection.on('blur', selectionBlurHandler);
        if (isMultiple) {
            select2Instance.selection.$search.on('focus', searchFocusHandler);
            select2Instance.selection.$search.on('blur', searchBlurHandler);
        }
        $wrapper.on('mousedown', wrapperMousedownHandler);
        $element.on('change.select2', changeHandler);
        $element.on('select2:opening', openingHandler);
        $element.on('select2:close', closeHandler);
        $element.on('hrm-select:search-update', searchUpdate);

        formField().hasValue(emptyCheckFn($element.val()));

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            subscriptions.forEach(s => s.dispose());
            $wrapper.off('mousedown', wrapperMousedownHandler);
            select2Instance.$selection.off('focus', selectionFocusHandler);
            select2Instance.$selection.off('blur', selectionBlurHandler);
            if (isMultiple) {
                select2Instance.selection.$search.off('focus', searchFocusHandler);
                select2Instance.selection.$search.off('blur', searchBlurHandler);
            }
            $(element).off('change.select2', changeHandler);
            $element.off('select2:opening', openingHandler);
            $element.off('select2:close', closeHandler);
            $element.off('hrm-select:search-update', searchUpdate);
        });
    }
};

ko.bindingHandlers.hrmFormFieldDatepickerControl = {
    init: function(element, valueAccessor, allBindings) {
        const formField = allBindings.get('hrmFormFieldDatepickerControlOwner');
        const $wrapper = $(formField().controlWrapperElement());

        const $element = $(element);
        $element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_datepicker']);
        $element.attr('id', formField().controlId);

        const daterangepickerInstance = $element.data('daterangepicker');

        daterangepickerInstance.container.addClass('hrm-form-field__dropdown');

        const wrapperClickHandler = () => $element.focus();
        const focusHandler = () => formField().focused(true);
        const blurHandler = () => formField().focused(false);
        const valueHandler = event => {
            const value = event.target.value;
            formField().hasValue(value !== '');
        };

        $wrapper.on('click', wrapperClickHandler);
        $element.on('focus', focusHandler);
        $element.on('blur', blurHandler);
        $element.on('input change', valueHandler);

        formField().focused($element.is(':focus'));
        formField().hasValue($element.val() !== '');

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $wrapper.off('click', wrapperClickHandler);
            $element.off('focus', focusHandler);
            $element.off('blur', blurHandler);
            $element.off('input change', valueHandler);
        });
    }
};

ko.bindingHandlers.hrmFormFieldLabel = {
    init: function(element, valueAccessor, allBindings) {
        const formField = allBindings.get('hrmFormFieldLabelOwner');

        const $element = $(element);
        $element.addClass('hrm-form-field__label');
        $element.attr('for', formField().controlId);
    }
};