// hrmFormField
(() => {
    class HrmFormFieldViewModel {
        constructor(element, control, label) {
            this._subscriptions = [];
            this._$element = $(element);
            this._control = control;
            this._label = label;

            this.element = element;

            this._init();
        }

        _init() {
            this._$element.addClass(['hrm-form-field', 'hrm-notransition']);

            this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
                this._$element.toggleClass('hrm-form-field--has-label', this._label !== undefined);

                this._$element.toggleClass('hrm-form-field--focused', this._control().focused());
                this._subscriptions.push(this._control().focused.subscribe(focused => {
                    this._$element.toggleClass('hrm-form-field--focused', focused);
                }));

                this._$element.toggleClass('hrm-form-field--disabled', this._control().disabled());
                this._subscriptions.push(this._control().disabled.subscribe(disabled => {
                    this._$element.toggleClass('hrm-form-field--disabled', disabled);
                }));

                this._$element.toggleClass('hrm-form-field--should-label-float', this._control().shouldLabelFloat());
                this._subscriptions.push(this._control().shouldLabelFloat.subscribe(shouldLabelFloat => {
                    this._$element.toggleClass('hrm-form-field--should-label-float', shouldLabelFloat);
                }));

                setTimeout(() => {
                    this._$element.removeClass('hrm-notransition');
                })
            }));
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.bindingHandlers.hrmFormField = {
        init: function (element, valueAccessor, allBindings) {
            const control = allBindings.get('hrmFormFieldControlRef');
            const label = allBindings.get('hrmFormFieldLabelRef');
            const viewModel = new HrmFormFieldViewModel(element, control, label);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                viewModel.dispose();
            });
        }
    };
})();

// hrmFormFieldLabel
(() => {
    class HrmFormFieldLabelViewModel {
        constructor(element) {
            this._subscriptions = [];
            this._$element = $(element);

            this.element = element;

            this._init();
        }

        _init() {
            this._$element.addClass('hrm-form-field__label');
        }

        setFor(id) {
            this._$element.attr('for', id);
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.bindingHandlers.hrmFormFieldLabel = {
        init: function (element, valueAccessor) {
            const viewModel = new HrmFormFieldLabelViewModel(element);

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
        }
    };
})();

// hrmFormFieldBasis
(() => {
    class HrmFormFieldBasisViewModel {
        constructor(element, control) {
            this._subscriptions = [];
            this._$element = $(element);
            this._control = control;
            this._clickHandler = null;
            this._mousedownHandler = null;

            this.element = element;

            this._init();
        }

        _init() {
            this._$element.addClass('hrm-form-field__basis');

            this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
                this._$element.toggleClass('hrm-form-field__basis--focused', this._control().focused());
                this._subscriptions.push(this._control().focused.subscribe(focused => {
                    this._$element.toggleClass('hrm-form-field__basis--focused', focused);
                }));

                this._$element.toggleClass('hrm-form-field__basis--invalid', this._control().errorState());
                this._subscriptions.push(this._control().errorState.subscribe(errorState => {
                    this._$element.toggleClass('hrm-form-field__basis--invalid', errorState);
                }));
            }));

            this._clickHandler = event => {
                this._control().onBasisClick(event);
            };

            this._mousedownHandler = event => {
                this._control().onBasisMousedown(event);
            };

            this._$element.on('click', this._clickHandler);
            this._$element.on('mousedown', this._mousedownHandler);
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
            this._$element.off('click', this._clickHandler);
            this._$element.off('mousedown', this._mousedownHandler);
        }
    }

    ko.bindingHandlers.hrmFormFieldBasis = {
        init: function (element, valueAccessor, allBindings) {
            const control = allBindings.get('hrmFormFieldBasisControl');
            const viewModel = new HrmFormFieldBasisViewModel(element, control);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                viewModel.dispose();
            });
        }
    };
})();

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
