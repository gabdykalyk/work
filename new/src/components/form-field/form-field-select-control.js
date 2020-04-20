// hrmFormFieldSelectControl
(() => {
    let nextId = 0;

    class HrmFormFieldSelectControlViewModel {
        constructor(element, value, selectedOptions, errorStateMatcher) {
            this._subscriptions = [];
            this._$element = $(element);
            this._valueChangeHandler = null;
            this._selectionFocusHandler = null;
            this._selectionBlurHandler = null;
            this._searchFocusHandler = null;
            this._searchBlurHandler = null;
            this._openingHandler = null;
            this._closeHandler = null;
            this._searchUpdateHandler = null;
            this._mutationObserver = null;

            if (errorStateMatcher === undefined) {
                errorStateMatcher = formControl => {
                    return ko.pureComputed(() => {
                        return 'isValid' in formControl && !formControl.isValid();
                    });
                }
            }

            this._errorStateMatcher = ko.observable(errorStateMatcher);
            this._value = ko.observable(value);
            this._selectedOptions = ko.observable(selectedOptions);
            this._control = null;
            this._isMultiple = null;
            this._select2Instance = null;

            this.element = element;
            this.id = 'hrm-form-field-select-control-' + nextId++;
            this.focused = null;
            this.disabled = null;
            this.shouldLabelFloat = null;
            this.errorState = null;

            this._init();
        }

        _init() {
            this._$element.attr('id', this.id);
            this._select2Instance = this._$element.data('select2');
            this._select2Instance.$container.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_select']);
            this._select2Instance.$dropdown.children().first().addClass(['hrm-form-field__dropdown']);
            this._isMultiple = this._$element.prop('multiple');

            this._control = ko.pureComputed(() => {
                if (this._value() !== undefined) {
                    return this._value();
                } else if (this._selectedOptions() !== undefined) {
                    return this._selectedOptions();
                } else {
                    return null;
                }
            });

            const selectionFocused = ko.observable(this._select2Instance.$selection.is(':focus'));
            const searchFocused = this._isMultiple ? ko.observable(this._select2Instance.selection.$search.is(':focus')) : null;
            const dropdownOpened = ko.observable(false);
            const hasValue = ko.observable(this._hasValue());
            const hasPlaceholder = ko.observable(this._hasPlaceholder());

            this._selectionFocusHandler = () => selectionFocused(true);
            this._selectionBlurHandler = () => selectionFocused(false);
            this._searchFocusHandler = () => searchFocused(true);
            this._searchBlurHandler = () => searchFocused(false);
            this._openingHandler = () => dropdownOpened(true);
            this._closeHandler = () => dropdownOpened(false);
            this._valueChangeHandler = () => hasValue(this._hasValue());
            this._searchUpdateHandler = () => {
                if (this._isMultiple) {
                    this._select2Instance.selection.$search.off('focus', this._searchFocusHandler);
                    this._select2Instance.selection.$search.off('blur', this._searchBlurHandler);

                    this._select2Instance.selection.$search.on('focus', this._searchFocusHandler);
                    this._select2Instance.selection.$search.on('blur', this._searchBlurHandler);
                }
            };

            this.focused = ko.pureComputed(() => {
                return selectionFocused() || dropdownOpened() || (searchFocused !== null && searchFocused());
            });

            this.disabled = ko.observable(this._isDisabled());

            this.shouldLabelFloat = ko.pureComputed(() => {
                return this.focused() || hasValue() || hasPlaceholder();
            });

            this.errorState = ko.pureComputed(() => {
                const errorStateMatcher = this._errorStateMatcher();
                const control = this._control();

                return control !== null ? errorStateMatcher(control)() : false;
            });

            this._select2Instance.$selection.on('focus', this._selectionFocusHandler);
            this._select2Instance.$selection.on('blur', this._selectionBlurHandler);
            if (this._isMultiple) {
                this._select2Instance.selection.$search.on('focus', this._searchFocusHandler);
                this._select2Instance.selection.$search.on('blur', this._searchBlurHandler);
            }
            this._$element.on('change.select2', this._valueChangeHandler);
            this._$element.on('select2:opening', this._openingHandler);
            this._$element.on('select2:close', this._closeHandler);
            this._$element.on('hrm-select:search-update', this._searchUpdateHandler);

            this._mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes') {
                        this.disabled(this._isDisabled());
                    }
                });
            });

            this._mutationObserver.observe(this.element, {
                attributes: true
            });

        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
            this._select2Instance.$selection.off('focus', this._selectionFocusHandler);
            this._select2Instance.$selection.off('blur', this._selectionBlurHandler);
            if (this._isMultiple) {
                this._select2Instance.selection.$search.off('focus', this._searchFocusHandler);
                this._select2Instance.selection.$search.off('blur', this._searchBlurHandler);
            }
            this._$element.off('change.select2', this._valueChangeHandler);
            this._$element.off('select2:opening', this._openingHandler);
            this._$element.off('select2:close', this._closeHandler);
            this._$element.off('hrm-select:search-update', this._searchUpdateHandler);
            this._mutationObserver.disconnect();
        }

        onBasisClick() {}

        onBasisMousedown(event) {
            if (!this.disabled()) {
                if (event.target !== this.element &&
                    this._select2Instance.$container.get()[0] !== event.target &&
                    this._select2Instance.$container.has(event.target).length === 0) {
                    const isOpen = this._select2Instance.isOpen();

                    setTimeout(() => {
                        this._select2Instance.$selection.focus();

                        if (!isOpen) {
                            this._select2Instance.open();
                        }
                    });
                }
            }
        }

        _setValue(value) {
            if (!ko.isObservable(value)) {
                throw Error('\'value\' binding have to be observable.');
            }

            this._value(value);
        }

        _setSelectedOptions(selectedOptions) {
            if (!ko.isObservable(selectedOptions)) {
                throw Error('\'selectedOptions\' binding have to be observable.');
            }

            this._selectedOptions(selectedOptions);
        }

        _setErrorStateMatcher(errorStateMatcher) {
            this._errorStateMatcher(errorStateMatcher);
        }

        _hasValue() {
            const value = this._$element.val();
            return value !== '' && value !== undefined && (!(value instanceof Array) || value.length !== 0);
        }

        _hasPlaceholder() {
            return this._select2Instance.options.options.placeholder !== ' ';
        }

        _isDisabled() {
            return this._$element.attr('disabled') !== undefined;
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmFormFieldSelectControl = {
        init: function (element, valueAccessor, allBindings) {
            const value = allBindings.get('value');
            const selectedOptions = allBindings.get('selectedOptions');
            const errorStateMatcher = allBindings.get('hrmFormFieldSelectControlErrorStateMatcher');
            const viewModel = new HrmFormFieldSelectControlViewModel(element, value, selectedOptions, errorStateMatcher);

            instances.set(element, viewModel);

            if (valueAccessor() !== undefined) {
                if (ko.isObservableArray(valueAccessor())) {
                    valueAccessor().push(viewModel);
                } else {
                    valueAccessor()(viewModel);
                }
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                if (valueAccessor() !== undefined) {
                    if (ko.isObservableArray(valueAccessor())) {
                        valueAccessor().remove(this);
                    } else {
                        valueAccessor()(null);
                    }
                }

                viewModel.dispose();
            });
        },
        update: function (element, valueAccessor, allBindings) {
            const instance = instances.get(element);
            const previousBindings = previousBindingsList.get(element);

            if (previousBindings !== undefined) {
                if (previousBindings['value'] !== allBindings.get('value')) {
                    instance._setValue(allBindings.get('value'));
                }
            }

            if (previousBindings !== undefined) {
                if (previousBindings['selectedOptions'] !== allBindings.get('selectedOptions')) {
                    instance._setTextInput(allBindings.get('selectedOptions'));
                }
            }

            if (previousBindings !== undefined) {
                if (previousBindings['hrmFormFieldSelectControlErrorStateMatcher'] !== allBindings.get('hrmFormFieldSelectControlErrorStateMatcher')) {
                    instance._setErrorStateMatcher(allBindings.get('hrmFormFieldSelectControlErrorStateMatcher'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();
