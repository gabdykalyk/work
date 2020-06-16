class HrmTabGroupItem {
    constructor(text, disabled = false) {
        this.text = text;
        this.disabled = ko.observable(disabled);
    }
}

ko.components.register('hrm-tab-group', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);
            $element.addClass(['hrm-tab-group']);

            const HrmTabGroupViewModel = function () {
                this.moreButtonElementWidth = 33.5;
                this.itemMargin = 30;

                this.subscriptions = [];
                this.element = componentInfo.element;

                this.windowResizeHandler = () => {
                    this.viewportSize({width: $(window).width(), height: $(window).height()});
                    this.updateWidth();
                };
                this.viewportSize = ko.observable({width: $(window).width(), height: $(window).height()});

                this.items = params.items;
                this.activeItem = hrmExtractComponentParam(params, 'activeItem', 0);
                this.width = ko.observable($element.width());
                this.itemWidths = ko.pureComputed(() => {
                    const $itemMirror = $('<span>').css({
                        'font-weight': 500,
                        'font-size': '13px',
                        'white-space': 'nowrap'
                    });

                    const $container = $('<div>').css({
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        width: '100%',
                        height: '100%',
                        visibility: 'hidden'
                    });

                    $container.appendTo(document.body);
                    $container.append($itemMirror);

                    const result = ko.unwrap(this.items).map(item => {
                        $itemMirror.text(item.text);
                        return $itemMirror.width();
                    });

                    $container.remove();

                    return result;
                });
                this.maxFitItem = ko.pureComputed(() => {
                    const itemWidths = this.itemWidths();
                    const width = this.width();

                    let w = 0;
                    for (let i = 0; i < itemWidths.length; i++) {
                        if (i > 0) {
                            w += (itemWidths[i] + this.itemMargin);
                        } else {
                            w += itemWidths[i];
                        }

                        if (w >= width - this.moreButtonElementWidth - this.itemMargin) {
                            return i !== 0 ? i - 1 : null;
                        }
                    }

                    return itemWidths.length > 0 ? itemWidths.length - 1 : null;
                });

                this.updateWidth = function () {
                    this.width($element.width());
                };

                // this.timer = ko.observable(0);

                // setInterval(() => {
                //     this.timer(this.timer() + 1);
                // }, 1000);

                (() => {
                    $(window).on('resize', this.windowResizeHandler);
                    this.windowResizeHandler();
                })();


            };

            HrmTabGroupViewModel.prototype.dispose = function() {
                this.subscriptions.forEach(s => s.dispose());
                $(window).off('resize', this.windowResizeHandler);
            };

            return new HrmTabGroupViewModel();
        }
    },
    template: `
        <div class="hrm-tab-group__content-wrapper">
            <div class="hrm-tab-group__content">

                <!-- ko if: items.length > 0 -->
                    <!-- ko foreach: viewportSize().width <= HRM_BREAKPOINTS.tabletMaxWidth ? items.slice(0, maxFitItem() + 1) : items -->
                        <div class="hrm-tab-group__item"
                             data-bind="
                                click: function() {if (!disabled()) {$component.activeItem($index());}},
                                css: {
                                    'hrm-tab-group__item--active': $component.activeItem() === $index(),
                                    'hrm-tab-group__item--disabled': disabled
                                },
                                text: text
                             ">
                        </div>
                    <!-- /ko -->

                    <!-- ko if: viewportSize().width <= HRM_BREAKPOINTS.tabletMaxWidth -->
                        <!-- ko if: maxFitItem() < items.length - 1 -->
                            <button class="hrm-button hrm-tab-group__more-button"
                                    data-bind="
                                        hrmDropdownMenu,
                                        hrmDropdownMenuTemplate: 'hrm-tab-group-more-button-dropdown-menu-template',
                                        hrmDropdownMenuPlacement: 'bottom-end'
                                    ">
                                Еще...
                            </button>

                            <script id="hrm-tab-group-more-button-dropdown-menu-template" type="text/html">
                                <!-- ko foreach: items.slice(maxFitItem() + 1) -->
                                    <div class="hrm-dropdown-menu__item"
                                         data-bind="
                                            text: text,
                                            click: function() {if (!disabled()) {$component.activeItem($index() + $component.maxFitItem() + 1);}},
                                            css: {'hrm-dropdown-menu__item--disabled': disabled}
                                         ">
                                    </div>
                                <!-- /ko -->
                            </script>
                        <!-- /ko -->
                    <!-- /ko -->
                <!-- /ko -->
            </div>
        </div>
    `
});
