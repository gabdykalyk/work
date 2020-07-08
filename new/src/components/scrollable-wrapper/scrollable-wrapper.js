// hrmScrollableWrapper
(() => {
    class HrmScrollableWrapperViewModel {
        constructor(params, componentInfo) {
            this._subscriptions = [];
            this._$element = $(componentInfo.element);
            this._$contentElement = null;
            this._contentScrollHandler = null;
            this._windowResizeHandler = null;
            this._childData = ko.contextFor(componentInfo.element).$data;
            this._contentElement = ko.observable(null);
            this._scrolledHorizontalStart = ko.observable(true);
            this._scrolledHorizontalEnd = ko.observable(true);
            this._scrolledVerticalStart = ko.observable(true);
            this._scrolledVerticalEnd = ko.observable(true);

            this.element = componentInfo.element;

            this.options = {
                top: {
                    disabled: false
                },
                right: {
                    disabled: false
                },
                bottom: {
                    disabled: false
                },
                left: {
                    disabled: false
                }
            };

            if ('options' in params) {
                this.options = {
                    ...this.options,
                    top: {
                        ...this.options.top,
                        ...params.options.top
                    },
                    right: {
                        ...this.options.right,
                        ...params.options.right
                    },
                    bottom: {
                        ...this.options.bottom,
                        ...params.options.bottom
                    },
                    left: {
                        ...this.options.left,
                        ...params.options.left
                    }
                }
            }

            this._init();
        }

        _init() {
            this._$element.addClass('hrm-scrollable-wrapper');

            this._contentScrollHandler = function () {
                this.check();
            };

            this._windowResizeHandler = function () {
                this.check();
            };

            this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
                this._$contentElement = $(this._contentElement());
                this._$contentElement.overlayScrollbars({
                    scrollbars: {
                        clickScrolling: true,
                    },
                    nativeScrollbarsOverlaid: {
                        initialize: true,
                    },
                    callbacks: {
                        onScroll: () => {
                            this._contentScrollHandler();
                        }
                    }
                });

                this.check();
            }));

            $(window).on('resize', this._windowResizeHandler.bind(this));
        }

        check() {
            let container = this._$contentElement.find('.os-viewport').get(0);
            let scrollLeft = container.scrollLeft;
            let scrollTop = container.scrollTop;


            this._scrolledHorizontalStart(scrollLeft === 0);
            this._scrolledHorizontalEnd(container.offsetWidth + scrollLeft + 5 >= container.scrollWidth);
            this._scrolledVerticalStart(scrollTop === 0);
            this._scrolledVerticalEnd(container.offsetHeight + scrollTop + 5 >= container.scrollHeight);
        }

        dispose() {
            this._subscriptions.forEach(s => s.dispose());
            this._$contentElement.off('scroll', this._contentScrollHandler);
            $(window).off('resize', this._windowResizeHandler);
        }
    }

    ko.components.register('hrm-scrollable-wrapper', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                return new HrmScrollableWrapperViewModel(params, componentInfo);
            }
        },
        template: `
            <div class="hrm-scrollable-wrapper__content">
                 <div class="hrm-scrollable-wrapper__wrapper" data-bind="hrmElement: _contentElement">
                 <!-- ko template: {nodes: $componentTemplateNodes, data: _childData} --><!-- /ko -->
                 </div>


                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledVerticalStart() && !options.top.disabled, $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(0)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__top-curtain"></div>
                <!-- /ko -->

                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledHorizontalEnd() && !options.right.disabled, $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(200)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__right-curtain"></div>
                <!-- /ko -->

                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledVerticalEnd() && !options.bottom.disabled, $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(200)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__bottom-curtain"></div>
                <!-- /ko -->

                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledHorizontalStart() && !options.left.disabled, $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(200)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__left-curtain"></div>
                <!-- /ko -->
            </div>
        `
    });
})();
