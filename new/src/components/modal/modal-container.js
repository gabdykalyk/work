ko.bindingHandlers.hrmModalContainerModalWrapper = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const options = $.extend(
            {
                closeOnBackdropClick: true,
                escapePress: 'close'
            },
            allBindings()['hrmModalContainerModalWrapperOptions']
        );

        const close = allBindings()['hrmModalContainerModalWrapperClose'];

        const $element = $(element);
        const $modal = $element.find('.hrm-modal');

        $modal.appendTo('body');

        $modal.modal({
            backdrop: false,
            keyboard: false,
            focus: true
        });

        if ('modalClass' in options) {
            $modal.addClass(options.modalClass);
        }

        $modal.keyup(event => {
            if (event.keyCode === 27) {
                if (options.escapePress === 'close') {
                    close.call(viewModel);
                } else if (options.escapePress instanceof Function) {
                    options.escapePress();
                }
            }
        });

        if (options.closeOnBackdropClick) {
            $modal.on('click', event => {
                if (event.target === $modal.get()[0]) {
                    close.call(viewModel);
                }
            });
        }

        const innerBindingContext = ko.bindingEvent.startPossiblyAsyncContentBinding($modal.get()[0], bindingContext);
        ko.applyBindings(innerBindingContext, $modal.get()[0]);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $modal.modal('hide').remove();
        });
    }
};

ko.components.register('hrm-modal-container', {
    viewModel: {
        createViewModel: function (params) {
            const viewModel = new (function () {
                this.opens = params.opens;

                this.close = function (open, value) {
                    this.opens.remove(open);

                    if ('close' in open) {
                        open.close(value);
                    }
                };
            });

            viewModel.initializing = ko.observable(true);

            viewModel.onInit = function () {
                viewModel.initializing(false);
            };

            return viewModel;
        }
    },
    template: `
        <!-- ko template: {afterRender: onInit} -->
            <!-- ko foreach: opens -->
                <!-- ko let: {modalElement: ko.observable()} -->
                    <div data-bind="
                         hrmModalContainerModalWrapper,
                         hrmModalContainerModalWrapperOptions: $data.options,
                         hrmModalContainerModalWrapperClose: function (value) {$component.close($data, value);}
                    ">
                        <div class="modal hrm-modal" role="dialog" tabindex="1" data-bind="element: modalElement">
                            <!-- ko template: {
                                name: dialogTemplateName,
                                data: {
                                    data: $data.data,
                                    modalElement: modalElement(),
                                    close: function (value) {$component.close($data, value);}
                                }
                            } -->
                            <!-- /ko -->
                        </div>
                    </div>
                <!-- /ko -->
            <!-- /ko -->
        <!-- /ko -->
    `
});
