// hrmDropdownMenu
(() => {
    class HrmDropdownMenuViewModel {
        constructor(element, context, template, placement) {
            this._subscriptions = [];
            this._template = template;
            this._placement = placement;
            this._context = context;
            this.element = element;
            this._tippyInstance = null;
            this._tooltipClickHandler = null;

            this._init();
        }

        _init() {
            let hidingFlag = false;

            this._tooltipClickHandler = event => {
                const $target = $(event.target);

                if ($target.is('.hrm-dropdown-menu__item:not(.hrm-dropdown-menu__item--disabled)') || $target.parents('.hrm-dropdown-menu__item:not(.hrm-dropdown-menu__item--disabled)').length > 0) {
                    this._tippyInstance.hide();
                }
            };

            this._tippyInstance = tippy(this.element, {
                content: this._createContent(document.getElementById(this._template).innerHTML),
                arrow: false,
                distance: 7,
                interactive: true,
                placement: this._placement !== undefined ? this._placement : 'bottom',
                appendTo: document.body,
                boundary: 'viewport',
                hideOnClick: true,
                trigger: 'click',
                onCreate: instance => {
                    $(instance.popperChildren.tooltip).addClass('hrm-dropdown-menu');
                    $(instance.popperChildren.tooltip).on('click', this._tooltipClickHandler);
                },
                onShow: () => {
                    return !hidingFlag;
                },
                onMount: instance => {
                    $(instance.popperChildren.content).find('.hrm-dropdown-menu__content').overlayScrollbars({});
                    ko.applyBindingsToDescendants(this._context, instance.popperChildren.content);

                    setTimeout(() => {
                        instance.popperInstance.update();
                    });
                },
                onHide: () => {
                    hidingFlag = true;
                },
                onHidden: instance => {
                    // Хак, чтобы tippy пересоздал содержимое и можно было применить заново биндинги Knockout
                    instance.setContent(this._createContent(document.getElementById(this._template).innerHTML));
                    hidingFlag = false;
                }
            });
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());
            this._tippyInstance.destroy();
        }

        _createContent(template) {
            return $('<div>').addClass('hrm-dropdown-menu__content').append(template).get()[0];
        }
    }

    ko.bindingHandlers.hrmDropdownMenu = {
        init: function (element, valueAccessor, allBindings, _, bindingContext) {
            const template = allBindings.get('hrmDropdownMenuTemplate');
            const placement = allBindings.get('hrmDropdownMenuPlacement');
            const viewModel = new HrmDropdownMenuViewModel(element, bindingContext, template, placement);

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
        }
    };
})();
