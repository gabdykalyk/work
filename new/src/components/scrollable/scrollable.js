// hrmScrollable
(() => {
    class HrmScrollableViewModel {
        constructor(element, disabled) {
            this._subscriptions = [];
            this._disabledSubscription = null;
            this._disabled = null;
            this._overlayScrollbarsInstance = null;
            this._overlayScrollbarsOptions = {
                className: 'hrm-scrollable'
            };
            this.element = element;

            this._init(disabled);
        }

        _init(disabled) {
            this._setDisabled(disabled);
            this._update();
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());
            if (this._disabledSubscription !== null) {
                this._disabledSubscription.dispose();
            }
        }

        _setDisabled(disabled) {
            if (disabled === undefined) {
                disabled = false;
            }

            if (this._disabledSubscription !== null) {
                this._disabledSubscription.dispose();
            }

            if (ko.isObservable(disabled)) {
                this._disabledSubscription = disabled.subscribe(disabled => {
                    this._disabled = disabled;
                    this._update();
                });

                this._disabled = disabled();
            } else {
                this._disabled = disabled;
                this._update();
            }
        }

        _update() {
            const $element = $(this.element);

            if (!this._disabled) {
                if (this._overlayScrollbarsInstance === null) {
                    $element.overlayScrollbars(this._overlayScrollbarsOptions);
                    this._overlayScrollbarsInstance = $element.overlayScrollbars();
                }
            } else {
                if (this._overlayScrollbarsInstance !== null) {
                    this._overlayScrollbarsInstance.destroy();
                    this._overlayScrollbarsInstance = null;
                }
            }
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmScrollable = {
        init: function (element, valueAccessor, allBindings) {
            const disabled = allBindings.get('hrmScrollableDisabled');
            const viewModel = new HrmScrollableViewModel(element, disabled);

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

                viewModel._destroy();
            });
        },
        update: function (element, valueAccessor, allBindings) {
            const instance = instances.get(element);
            const previousBindings = previousBindingsList.get(element);

            if (previousBindings !== undefined) {
                if (previousBindings['hrmScrollableDisabled'] !== allBindings.get('hrmScrollableDisabled')) {
                    instance._setDisabled(allBindings.get('hrmScrollableDisabled'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();
