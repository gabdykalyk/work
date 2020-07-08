(() => {
    class HrmDatepickerViewModel {
        constructor(element, value, config) {
            this._subscriptions = [];
            this._valueSubscription = null;
            this._value = null;
            this._daterangepicker = null;
            this._applyHandler = null;
            this.element = element;

            this.config = config || {};

            this._init(value);
        }

        _init(value) {
            const $element = $(this.element);

            $element.attr('autocomplete', 'off');

            const params = {
                singleDatePicker: true,
                showDropdown: false,
                autoUpdateInput: this.config.autoUpdateInput,
                autoApply: true,
                locale: {
                    format: this.config.format || 'DD.MM.YYYY, dddd',
                    monthNames: [
                        'Январь',
                        'Февраль',
                        'Март',
                        'Апрель',
                        'Май',
                        'Июнь',
                        'Июль',
                        'Август',
                        'Сентябрь',
                        'Октябрь',
                        'Ноябрь',
                        'Декабрь'
                    ],
                    daysOfWeek: [
                        'Вс',
                        'Пн',
                        'Вт',
                        'Ср',
                        'Чт',
                        'Пт',
                        'Сб'
                    ],
                    firstDay: 1
                }
            };

            $element.daterangepicker(params);

            this._applyHandler = () => {
                let newValue = this._daterangepicker.startDate.format(this._daterangepicker.locale.format);

                if (newValue !== $element.val()) {
                    $element.val(newValue).trigger('change');
                }
            };

            $element.on('apply.daterangepicker', this._applyHandler);

            this._daterangepicker = $element.data('daterangepicker');

            this._daterangepicker.container.addClass('hrm-datepicker');

            this._setValue(value);
        }

        _setValue(value) {
            if (this._valueSubscription !== null) {
                this._valueSubscription.dispose();
                this._valueSubscription = null;
            }

            if (value !== undefined) {
                if (ko.isObservable(value)) {
                    this._valueSubscription = value.subscribe(v => {
                        this._daterangepicker.elementChanged();
                    });
                } else {
                    this._daterangepicker.elementChanged();
                }
            }

            this._value = value;
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());

            if (this._valueSubscription !== null) {
                this._valueSubscription.dispose();
            }

            $element.off('apply.daterangepicker', this._applyHandler);
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmDatepicker = {
        init: function (element, valueAccessor, allBindings) {
            const value = allBindings.get('value');
            const config = allBindings.get('hrmDatepickerConfig');
            const viewModel = new HrmDatepickerViewModel(element, value, config);

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
                if (previousBindings['value'] !== allBindings.get('value')) {
                    instance._setValue(allBindings.get('value'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();
