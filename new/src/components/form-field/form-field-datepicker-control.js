// hrmFormFieldDatepickerControl
(() => {
    let nextId = 0;

    class HrmFormFieldDatepickerControlViewModel {
        constructor(element, value, textInput, errorStateMatcher) {
            this._subscriptions = [];
            this._$element = $(element);
            this._focusChangeHandler = null;
            this._valueChangeHandler = null;
            this._mutationObserver = null;
            this._errorStateMatcher = ko.observable(errorStateMatcher);
            this._value = ko.observable(value);
            this._textInput = ko.observable(textInput);
            this._control = null;
            this._daterangepickerInstance = null;

            this.element = element;
            this.id = 'hrm-form-field-input-control-' + nextId++;
            this.focused = null;
            this.disabled = null;
            this.shouldLabelFloat = null;
            this.errorState = null;

            this._init();
        }

        _init() {
            this._$element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_input']);
            this._$element.attr('id', this.id);

            this._daterangepickerInstance = this._$element.data('daterangepicker');
            this._daterangepickerInstance.container.addClass('hrm-form-field__dropdown');

            this._control = ko.pureComputed(() => {
                if (this._value() !== undefined) {
                    return this._value();
                } else if (this._textInput() !== undefined) {
                    return this._textInput();
                } else {
                    return null;
                }
            });

            this._subscriptions.push(ko.pureComputed(() => {
                if (this._control() !== null) {
                    return this._control()();
                } else {
                    return null;
                }
            }).subscribe(() => {
                this._$element.trigger('change.hrm-form-field-datepicker-control');
            }));

            this.focused = ko.observable(this._hasFocus());
            this.disabled = ko.observable(this._isDisabled());
            const hasValue = ko.observable(this._hasValue());
            const hasPlaceholder = ko.observable(this._hasPlaceholder());

            this._focusChangeHandler = () => this.focused(this._hasFocus());
            this._valueChangeHandler = () => hasValue(this._hasValue());

            this._mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes') {
                        hasPlaceholder(this._hasPlaceholder());
                        this.disabled(this._isDisabled());
                    }
                });
            });

            this._mutationObserver.observe(this.element, {
                attributes: true
            });

            this.shouldLabelFloat = ko.pureComputed(() => {
                return this.focused() || hasValue() || hasPlaceholder();
            });

            this.errorState = ko.pureComputed(() => {
                const errorStateMatcher = this._errorStateMatcher();
                const control = this._control();

                return errorStateMatcher !== undefined ? errorStateMatcher(control)() : false;
            });

            this._$element.on('focus blur', this._focusChangeHandler);
            this._$element.on('input change', this._valueChangeHandler);
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
            this._$element.off('focus blur', this._focusChangeHandler);
            this._$element.off('input change change.hrm-form-field-datepicker-control', this._valueChangeHandler);
            this._mutationObserver.disconnect();
        }

        onBasisClick() {
            this._$element.focus();
        }

        onBasisMousedown() {}

        _setValue(value) {
            if (!ko.isObservable(value)) {
                throw Error('\'value\' binding have to be observable.');
            }

            this._value(value);
        }

        _setTextInput(textInput) {
            if (!ko.isObservable(textInput)) {
                throw Error('\'textInput\' binding have to be observable.');
            }

            this._textInput(textInput);
        }

        _setErrorStateMatcher(errorStateMatcher) {
            this._errorStateMatcher(errorStateMatcher);
        }

        _hasFocus() {
            return this._$element.is(':focus');
        }

        _hasValue() {
            return this._$element.val() !== '';
        }

        _hasPlaceholder() {
            return this._$element.attr('placeholder') !== undefined;
        }

        _isDisabled() {
            return this._$element.attr('disabled') !== undefined;
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmFormFieldDatepickerControl = {
        init: function (element, valueAccessor, allBindings) {
            const value = allBindings.get('value');
            const textInput = allBindings.get('textInput');
            const errorStateMatcher = allBindings.get('hrmFormFieldDatepickerControlErrorStateMatcher');
            const viewModel = new HrmFormFieldDatepickerControlViewModel(element, value, textInput, errorStateMatcher);

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
                if (previousBindings['textInput'] !== allBindings.get('textInput')) {
                    instance._setTextInput(allBindings.get('textInput'));
                }
            }

            if (previousBindings !== undefined) {
                if (previousBindings['hrmFormFieldDatepickerControlErrorStateMatcher'] !== allBindings.get('hrmFormFieldDatepickerControlErrorStateMatcher')) {
                    instance._setErrorStateMatcher(allBindings.get('hrmFormFieldDatepickerControlErrorStateMatcher'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();
