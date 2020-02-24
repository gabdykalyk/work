// hrmTooltip
(() => {
    class ViewModel {
        constructor(element, text, mode = 'basic') {
            this._subscriptions = [];
            this._textSubscription = null;
            this._clickHandler = null;
            this._text = null;
            this._mode = mode;
            this.element = element;
            this._tippyInstance = null;

            this._init(text);
        }

        _init(text) {
            if (this._mode === 'large') {
                this._clickHandler = () => {
                    this._tippyInstance.show();
                };

                $(this.element).on('click', this._clickHandler);

                this._tooltipClickHandler = event => {
                    const $target = $(event.target);
                    if ($target.hasClass('hrm-tooltip__close-button')) {
                        this._tippyInstance.hide();
                    }
                };
            }

            this._tippyInstance = tippy(this.element, {
                arrow: false,
                distance: 7,
                placement: 'bottom',
                interactive: true,
                appendTo: document.body,
                boundary: 'viewport',
                hideOnClick: this._mode === 'basic',
                trigger: this._mode === 'basic' ? 'mouseenter click' : 'manual',
                onCreate: instance => {
                    $(instance.popperChildren.tooltip).addClass('hrm-tooltip');
                    $(instance.popperChildren.tooltip).addClass(this._mode === 'basic' ? 'hrm-tooltip--mode_basic' : 'hrm-tooltip--mode_large');

                    if (this._mode === 'large') {
                        $(instance.popperChildren.tooltip).on('click', this._tooltipClickHandler);
                    }
                }
            });

            this._setText(text);
        }

        _setText(text) {
            if (this._textSubscription !== null) {
                this._textSubscription.dispose();
            }

            if (ko.isObservable(text)) {
                this._textSubscription = text.subscribe(text => {
                    this._text = text;
                    this._update();
                });

                this._text = text();
            } else {
                this._text = text;
            }

            this._update();
        }

        _update() {
            this._tippyInstance.setContent(this._createContent(this._text, this._mode));
        }

        _createContent(text, mode) {
            let result = `<div class="hrm-tooltip__text">${text}</div>`;

            if (mode === 'large') {
                result += '<button class="hrm-button hrm-tooltip__close-button">Ок</button>';
            }

            return result;
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());

            if (this._mode === 'large') {
                $(this.element).off('click', this._clickHandler);
            }
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmTooltip = {
        init: function (element, valueAccessor, allBindings) {
            const text = allBindings.get('hrmTooltipText');
            const mode = allBindings.get('hrmTooltipMode');
            const viewModel = new ViewModel(element, text, mode);

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
                if (previousBindings['hrmTooltipText'] !== allBindings.get('hrmTooltipText')) {
                    instance._setText(allBindings.get('hrmTooltipText'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();
