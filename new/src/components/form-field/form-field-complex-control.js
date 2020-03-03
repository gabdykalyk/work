// hrmFormFieldComplexControl
(() => {
    let nextId = 0;

    class HrmFormFieldComplexControlViewModel {
        constructor(element, disabled) {
            this._subscriptions = [];
            this._$element = $(element);
            this._disabled = null;
            this._disabledSubscription = null;

            this.element = element;
            this.id = 'hrm-form-field-complex-control-' + nextId++;
            this.focused = null;
            this.disabled = null;
            this.shouldLabelFloat = null;
            this.errorState = null;

            this._init(disabled);
        }

        _init(disabled) {
            this._$element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_complex']);

            this.focused = ko.observable(false);
            this.disabled = ko.observable(false);
            this.shouldLabelFloat = ko.observable(true);
            this.errorState = ko.observable(false);

            this._setDisabled(disabled);
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
        }

        onBasisClick() {}

        onBasisMousedown() {}

        _setDisabled(disabled) {
            if (this._disabledSubscription !== null) {
                this._disabledSubscription.dispose();
            }

            if (ko.isObservable(disabled)) {
                this._disabledSubscription = disabled.subscribe(disabled => {
                    this._disabled = disabled;
                    this._updateDisabled();
                });

                this._disabled = disabled();
            } else {
                this._disabled = disabled;
            }

            this._updateDisabled();
        }

        _updateDisabled() {
            this.disabled(this._disabled === true);
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmFormFieldComplexControl = {
        init: function (element, valueAccessor, allBindings) {
            const disabled = allBindings.get('hrmFormFieldComplexControlDisabled');
            const viewModel = new HrmFormFieldComplexControlViewModel(element, disabled);

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
                if (previousBindings['hrmFormFieldComplexControlDisabled'] !== allBindings.get('hrmFormFieldComplexControlDisabled')) {
                    instance._setDisabled(allBindings.get('hrmFormFieldComplexControlDisabled'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();
