ko.bindingHandlers.hrmTable = {
    init: function (element) {
        const $element = $(element);
        $element.addClass('hrm-table');
    }
};

// hrmEditableTableCell
(() => {
    class ViewModel {
        constructor(element, error) {
            this._subscriptions = [];
            this._windowResizeHandler = null;
            this._errorSubscription = null;
            this._error = error;
            this._isTabletOrMobile = null;
            this.element = element;
            this.focused = ko.observable(false);
            this._errorTippyInstance = null;
            this._errorTippyClickHandler = null;

            this._init();
        }

        _init() {
            const $element = $(this.element);
            $element.addClass('hrm-table__editable-cell');

            this._subscriptions.push(this.focused.subscribe(focused => {
                $element.toggleClass('hrm-table__editable-cell--focused', focused);
            }));

            this._windowResizeHandler = () => {
                this._onWindowResize($(window).width(), $(window).height());
            };

            $(window).on('resize', this._windowResizeHandler);

            this._errorTippyClickHandler = event => {
                const $target = $(event.target);
                if ($target.hasClass('hrm-table__editable-cell-error-tooltip-close-button')) {
                    this._errorTippyInstance.hide();
                }
            };

            this._errorTippyInstance = tippy(this.element, {
                arrow: false,
                distance: 7,
                placement: 'bottom',
                onCreate: instance => {
                    $(instance.popperChildren.tooltip).addClass('hrm-table__editable-cell-error-tooltip');
                    $(instance.popperChildren.tooltip).on('click', this._errorTippyClickHandler);
                    instance.disable();
                }
            });

            this._windowResizeHandler();

            this._setError(this._error);
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());
            $(window).off('resize', this._windowResizeHandler);
            $(this._errorTippyInstance.popperChildren.tooltip).on('click', this._errorTippyClickHandler);
            this._errorTippyInstance.destroy();
        }

        _setError(error) {
            if (this._errorSubscription !== null) {
                this._errorSubscription.dispose();
            }

            if (ko.isObservable(error)) {
                this._errorSubscription = error.subscribe(error => {
                    this._error = error;
                    this._updateErrorView();
                });

                this._error = error();
            } else {
                this._error = error;
            }

            this._updateErrorView();
        }

        _updateErrorView() {
            $(this.element).toggleClass('hrm-table__editable-cell--has-error', !!this._error);

            if (!!this._error && this._error.message !== null) {
                this._errorTippyInstance.enable();
                this._errorTippyInstance.setContent(this._createErrorTooltipContent(this._error.message));

                if (this._isTabletOrMobile) {
                    this._errorTippyInstance.show(0);
                    this._errorTippyInstance.setProps({
                        interactive: true,
                        appendTo: document.body,
                        boundary: 'viewport',
                        hideOnClick: false,
                        trigger: 'manual'
                    });
                } else {
                    this._errorTippyInstance.setProps({
                        interactive: false,
                        hideOnClick: true,
                        trigger: 'mouseenter'
                    });
                }
            } else {
                this._errorTippyInstance.disable();
            }
        }

        _onWindowResize(width, height) {
            const isTableOrMobile = width <= HRM_BREAKPOINTS.tableMaxWidth;

            if (this._isTabletOrMobile !== isTableOrMobile) {
                this._isTabletOrMobile = isTableOrMobile;
                this._updateErrorView();
            }
        }

        _createErrorTooltipContent(message) {
            return `
                <span class="hrm-table__editable-cell-error-tooltip-text">${message}</span>
                <button class="hrm-button hrm-table__editable-cell-error-tooltip-close-button">
                </button>
            `;
        }
    }

    const instances = new Map();
    const previousBindingsList = new Map();

    ko.bindingHandlers.hrmTableEditableCell = {
        init: function (element, valueAccessor, allBindings) {
            const error = allBindings.get('hrmTableEditableCellError');
            const viewModel = new ViewModel(element, error);

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
                if (previousBindings['hrmTableEditableCellError'] !== allBindings.get('hrmTableEditableCellError')) {
                    instance._setError(allBindings.get('hrmTableEditableCellError'));
                }
            }

            previousBindingsList.set(element, allBindings());
        }
    };
})();

// hrmEditableTableCellInputControl
(() => {
    class ViewModel {
        constructor(element, owner) {
            this._focusHandler = null;
            this._blurHandler = null;
            this.element = element;
            this._owner = owner;

            this._init();
        }

        _init() {
            const $element = $(this.element);
            $element.addClass(['hrm-table__editable-cell-control', 'hrm-table__editable-cell-control--type_input']);

            this._focusHandler = () => ko.unwrap(this._owner).focused(true);
            this._blurHandler = () => ko.unwrap(this._owner).focused(false);

            $element.on('focus', this._focusHandler);
            $element.on('blur', this._blurHandler);

            ko.unwrap(this._owner).focused($element.is(':focus'));
        }

        _destroy() {
            const $element = $(this.element);
            $element.off('focus', this._focusHandler);
            $element.off('blur', this._blurHandler);
        }
    }

    ko.bindingHandlers.hrmTableEditableCellInputControl = {
        init: function (element, valueAccessor, allBindings) {
            const owner = allBindings.get('hrmTableEditableCellInputControlOwner');
            const viewModel = new ViewModel(element, owner);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                viewModel._destroy();
            });
        }
    };
})();

// hrmEditableTableCellSelectControl
(() => {
    class ViewModel {
        constructor(element, owner) {
            this._subscriptions = [];
            this._selectionFocusHandler = null;
            this._selectionBlurHandler = null;
            this._openingHandler = null;
            this._closeHandler = null;
            this.element = element;
            this._owner = owner;

            this._init();
        }

        _init() {
            const $element = $(this.element);
            const select2Instance = $element.data('select2');

            select2Instance.$container.addClass(['hrm-table__editable-cell-control', 'hrm-table__editable-cell-control--type_select']);
            select2Instance.$dropdown.children().first().addClass(['hrm-table__editable-cell-dropdown']);

            const selectionFocused = ko.observable(select2Instance.$selection.is(':focus'));
            const dropdownOpened = ko.observable(false);

            this._subscriptions.push(
                ko.computed(() => selectionFocused() || dropdownOpened())
                    .subscribe(value => ko.unwrap(this._owner).focused(value))
            );

            this._selectionFocusHandler = () => selectionFocused(true);
            this._selectionBlurHandler = () => selectionFocused(false);
            this._openingHandler = () => dropdownOpened(true);
            this._closeHandler = () => dropdownOpened(false);

            select2Instance.$selection.on('focus', this._selectionFocusHandler);
            select2Instance.$selection.on('blur', this._selectionBlurHandler);
            $element.on('select2:opening', this._openingHandler);
            $element.on('select2:close', this._closeHandler);

            selectionFocused(select2Instance.$selection.is(':focus'));
        }

        _destroy() {
            const $element = $(this.element);
            const select2Instance = $element.data('select2');
            select2Instance.$selection.off('focus', this._selectionFocusHandler);
            select2Instance.$selection.off('blur', this._selectionBlurHandler);
            $element.off('select2:opening', this._openingHandler);
            $element.off('select2:close', this._closeHandler);
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.bindingHandlers.hrmTableEditableCellSelectControl = {
        init: function (element, valueAccessor, allBindings) {
            const owner = allBindings.get('hrmTableEditableCellSelectControlOwner');
            const viewModel = new ViewModel(element, owner);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                viewModel._destroy();
            });
        }
    };
})();

// hrmTableStickySectionContainer
(() => {
    const StickyEvents = window['stickyEvents'];

    class ViewModel {
        constructor(element, sectionWrappers) {
            this._subscriptions = [];
            this._sectionWrappers = sectionWrappers;
            this._sectionWrapperElementStuckHandler = null;
            this._sectionWrapperElementUnstuckHandler = null;
            this.element = element;
            this._stickyEvents = null;

            this._init();
        }

        _init() {
            const $element = $(this.element);
            $element.addClass('hrm-table__sticky-section-container');

            this._stickyEvents = new StickyEvents();

            this._stickyEvents.addStickies(this._sectionWrappers());

            this._sectionWrapperElementStuckHandler = event => {
                const wrapper = this._sectionWrappers().find(wrapper => wrapper.element === event.target);
                wrapper.stuck(true);
            };

            this._sectionWrapperElementUnstuckHandler = event => {
                const wrapper = this._sectionWrappers().find(wrapper => wrapper.element === event.target);
                wrapper.stuck(false);
            };

            this._sectionWrappers().forEach(wrapper => {
                wrapper.element.addEventListener(StickyEvents.STUCK, this._sectionWrapperElementStuckHandler);
                wrapper.element.addEventListener(StickyEvents.UNSTUCK, this._sectionWrapperElementUnstuckHandler);
            });

            let lastSectionWrappers = [...this._sectionWrappers()];

            this._subscriptions.push(this._sectionWrappers.subscribe(addedWrapper => {
                _.difference(lastSectionWrappers, addedWrapper).forEach(removedElement => {
                    removedElement.element.removeEventListener(StickyEvents.STUCK, this._sectionWrapperElementStuckHandler);
                    removedElement.element.removeEventListener(StickyEvents.UNSTUCK, this._sectionWrapperElementUnstuckHandler);
                });

                _.difference(addedWrapper, lastSectionWrappers).forEach(addedWrapper => {
                    addedWrapper.element.addEventListener(StickyEvents.STUCK, this._sectionWrapperElementStuckHandler);
                    addedWrapper.element.addEventListener(StickyEvents.UNSTUCK, this._sectionWrapperElementUnstuckHandler);

                    this._stickyEvents.addSticky(addedWrapper.element);
                    $(addedWrapper.element).addClass('sticky-events');
                });

                lastSectionWrappers = [...addedWrapper];
            }))
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());
            this._sectionWrappers().forEach(wrapper => {
                wrapper.element.removeEventListener(StickyEvents.STUCK, this._sectionWrapperElementStuckHandler);
                wrapper.element.removeEventListener(StickyEvents.UNSTUCK, this._sectionWrapperElementUnstuckHandler);
            });

            this._stickyEvents.disableEvents();
        }
    }

    ko.bindingHandlers.hrmTableStickySectionContainer = {
        init: function (element, valueAccessor, allBindings) {
            const sectionWrappers = allBindings.get('hrmTableStickySectionContainerSectionWrappers');
            const viewModel = new ViewModel(element, sectionWrappers);

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

// hrmTableStickySectionWrapper
(() => {
    class ViewModel {
        constructor(element, sectionWrappers) {
            this._subscriptions = [];
            this.element = element;
            this.stuck = ko.observable(false);

            this._init();
        }

        _init() {
            const $element = $(this.element);
            $element.addClass('hrm-table__sticky-section-wrapper');
            $element.toggleClass('hrm-table__sticky-section-wrapper--stuck', this.stuck());

            this._subscriptions.push(this.stuck.subscribe(stuck => {
                $element.toggleClass('hrm-table__sticky-section-wrapper--stuck', stuck);
            }));
        }

        _destroy() {
            this._subscriptions.forEach(s => s.dispose());
        }
    }

    ko.bindingHandlers.hrmTableStickySectionWrapper = {
        init: function (element, valueAccessor) {
            const viewModel = new ViewModel(element);

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

