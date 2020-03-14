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
                this._$contentElement.on('scroll', this._contentScrollHandler.bind(this));
                
                this.check();
            }));

            $(window).on('resize', this._windowResizeHandler.bind(this));
        }

        check() {
            this._scrolledHorizontalStart(this._$contentElement.scrollLeft() === 0);
            this._scrolledHorizontalEnd(this._$contentElement.outerWidth() + this._$contentElement.scrollLeft() + 5 >= this._$contentElement.prop('scrollWidth'));
            this._scrolledVerticalStart(this._$contentElement.scrollTop() === 0);
            this._scrolledVerticalEnd(this._$contentElement.outerHeight() + this._$contentElement.scrollTop() + 5 >= this._$contentElement.prop('scrollHeight'));
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
            <div class="hrm-scrollable-wrapper__content"
                 data-bind="hrmElement: _contentElement">
                <!-- ko template: {nodes: $componentTemplateNodes, data: _childData} --><!-- /ko -->
                
                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledVerticalStart(), $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(0)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__top-curtain"></div>
                <!-- /ko -->
                
                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledHorizontalEnd(), $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(200)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__right-curtain"></div>
                <!-- /ko -->
                
                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledVerticalEnd(), $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(200)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__bottom-curtain"></div>
                <!-- /ko -->
                
                <!-- ko template: {
                    foreach: hrmTemplateIf(!_scrolledHorizontalStart(), $data),
                    afterAdd: hrmFadeAfterAddFactory(200),
                    beforeRemove: hrmFadeBeforeRemoveFactory(200)
                } -->
                    <div class="hrm-scrollable-wrapper__curtain hrm-scrollable-wrapper__left-curtain"></div>
                <!-- /ko -->
            </div>
        `
    });
})();
