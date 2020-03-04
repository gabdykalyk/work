// hrmSwitch
(() => {
    let nextId = 0;

    class HrmSwitchViewModel {
        constructor(params, componentInfo) {
            this._subscriptions = [];
            this._$element = $(componentInfo.element);
            this._exportAs = params !== undefined ? params.exportAs : undefined;

            this.element = componentInfo.element;
            this.id = 'hrm-switch-' + nextId++;
            this.checked = hrmExtractComponentParam(params, 'checked', false);

            this._init();
        }

        _init() {
            this._$element.addClass(['hrm-switch']);

            this._$element.toggleClass('hrm-switch--checked', this.checked());

            this._subscriptions.push(this.checked.subscribe(checked => {
                this._$element.toggleClass('hrm-switch--checked', checked);
            }));

            if (this._exportAs !== undefined) {
                if (ko.isObservableArray(this._exportAs)) {
                    this._exportAs.push(this);
                } else {
                    this._exportAs(this);
                }
            }
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.components.register('hrm-switch', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                return new HrmSwitchViewModel(params, componentInfo);
            }
        },
        template: `
            <label class="hrm-switch__layout">
                <input data-bind="checked: checked, attr: {id: id}" type="checkbox" hidden>
            </label>
        `
    });
})();

// hrmSwitchGroup
(() => {
    class HrmSwitchGroupViewModel {
        constructor(element, control, label) {
            this._subscriptions = [];
            this._$element = $(element);
            this._control = control;
            this._label = label;

            this.element = element;

            this._init();
        }

        _init() {
            this._$element.addClass('hrm-switch-group');

            this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'descendantsComplete', () => {
                this._label().setFor(this._control().id);
            }));
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.bindingHandlers.hrmSwitchGroup = {
        init: function (element, valueAccessor, allBindings, _, bindingContext) {
            const control = allBindings.get('hrmSwitchGroupControlRef');
            const label = allBindings.get('hrmSwitchGroupLabelRef');
            const viewModel = new HrmSwitchGroupViewModel(element, control, label);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                viewModel.dispose();
            });

            const innerBindingContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);

            ko.applyBindingsToDescendants(innerBindingContext, element);

            return { controlsDescendantBindings: true };
        }
    };
})();

// hrmSwitchGroupLabel
(() => {
    class HrmSwitchGroupLabelViewModel {
        constructor(element) {
            this._subscriptions = [];
            this._$element = $(element);

            this.element = element;

            this._init();
        }

        _init() {
            this._$element.addClass('hrm-switch-group__label');
        }

        setFor(id) {
            this._$element.attr('for', id);
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.bindingHandlers.hrmSwitchGroupLabel = {
        init: function (element, valueAccessor) {
            const viewModel = new HrmSwitchGroupLabelViewModel(element);

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
