ko.components.register('hrm-form-field', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-form-field']);

            const ViewModel = function () {
                this.subscriptions = [];

                this.hasError = (params !== undefined && 'hasError' in params) ? params.hasError : false;

                this.afterRender = function () {
                    const $input = $element.find('.hrm-form-field__input');

                    $input.on('input change', event => {
                        const value = event.target.value;

                        $element.toggleClass('hrm-form-field--has-value', value.length !== 0);
                    });

                    $element.toggleClass('hrm-form-field--has-value', $input.val().length !== 0);

                    $input.on('focus', () => {
                        $element.addClass('hrm-form-field--focused');
                    });

                    $input.on('blur', () => {
                        $element.removeClass('hrm-form-field--focused');
                    });

                    if (!ko.isObservable(this.hasError)) {
                        $element.toggleClass('hrm-form-field--has-error', this.hasError);
                    } else {
                        this.subscriptions.push(this.hasError.subscribe(hasError => {
                            $element.toggleClass('hrm-form-field--has-error', hasError);
                        }));
                    }
                };
            };

            ViewModel.prototype.dispose = function() {
                this.subscriptions.forEach(s => s.dispose());
            };

            return new ViewModel();
        }
    },
    template: `
        <!-- ko template: { afterRender: function () {afterRender();} } -->
            <!-- ko template: { nodes: $componentTemplateNodes } --><!-- /ko -->
        <!-- /ko -->
    `
});

ko.components.register('hrm-form-field-error', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-form-field__error']);

            return new (function () {});
        }
    },
    template: `
        <span class="hrm-form-field__error-text">
            <!-- ko template: { nodes: $componentTemplateNodes } --><!-- /ko -->
        </span>
    `
});