ko.components.register('hrm-checkbox', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-checkbox']);

            const ViewModel = function () {
                this._subscriptions = [];

                if (params !== undefined && 'checked' in params) {
                    this.checked = ko.isObservable(params.checked) ? params.checked : ko.observable(params.checked);
                } else {
                    this.checked = ko.observable(false);
                }

                this.checkboxGroup = params !== undefined && 'owner' in params ? params.owner : null;

                (() => {
                    $element.toggleClass('hrm-checkbox--checked', this.checked());

                    this._subscriptions.push(this.checked.subscribe(checked => {
                        $element.toggleClass('hrm-checkbox--checked', checked);
                    }));
                })();
            };

            ViewModel.prototype.dispose = function() {
                this._subscriptions.forEach(s => s.dispose());
            };

            return new ViewModel();
        }
    },
    template: `
        <label class="hrm-checkbox__layout">
            <input data-bind="checked: checked, attr: {id: checkboxGroup !== null && checkboxGroup() !== null ? checkboxGroup().id : undefined}"
                   type="checkbox" hidden>
        </label>
    `
});

let hrmCheckboxGroupNextId = 0;

ko.components.register('hrm-checkbox-group', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-checkbox-group']);

            const ViewModel = function () {
                this.id = 'hrm-checkbox-group-' + hrmCheckboxGroupNextId++;

                (() => {
                    if (params !== undefined && 'exportAs' in params) {
                        if (ko.isObservableArray(params.exportAs)) {
                            params.exportAs.push(this);
                        } else {
                            params.exportAs(this);
                        }
                    }
                })();
            };

            ViewModel.prototype.dispose = function() {
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
        <!-- ko template: {nodes: $componentTemplateNodes} --><!-- /ko -->
    `
});

ko.bindingHandlers.hrmCheckboxGroupLabel = {
    init: function(element, valueAccessor, allBindings) {
        const checkboxGroup = allBindings.get('hrmCheckboxGroupLabelOwner');

        const $element = $(element);
        $element.addClass('hrm-checkbox-group__label');
        $element.attr('for', checkboxGroup().id);
    }
};