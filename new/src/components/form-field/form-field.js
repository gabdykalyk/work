// hrmFormField
(() => {
  class HrmFormFieldViewModel {
    constructor(element, control, label, fixedLabel) {
      this._subscriptions = [];
      this._$element = $(element);
      this._control = control;
      this._label = label;
      this._fixedLabel = fixedLabel;

      this.element = element;

      this._init();
    }

    _init() {
      this._$element.addClass(['hrm-form-field', 'hrm-notransition']);
      this._$element.toggleClass(
        'hrm-form-field--fixed-label',
        this._fixedLabel !== undefined,
      );

      this._subscriptions.push(
        ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
          this._$element.toggleClass(
            'hrm-form-field--has-label',
            this._label !== undefined,
          );

          this._$element.toggleClass(
            'hrm-form-field--focused',
            this._control().focused(),
          );
          this._subscriptions.push(
            this._control().focused.subscribe((focused) => {
              this._$element.toggleClass('hrm-form-field--focused', focused);
            }),
          );

          this._$element.toggleClass(
            'hrm-form-field--disabled',
            this._control().disabled(),
          );
          this._subscriptions.push(
            this._control().disabled.subscribe((disabled) => {
              this._$element.toggleClass('hrm-form-field--disabled', disabled);
            }),
          );

          this._$element.toggleClass(
            'hrm-form-field--should-label-float',
            this._control().shouldLabelFloat(),
          );
          this._subscriptions.push(
            this._control().shouldLabelFloat.subscribe((shouldLabelFloat) => {
              this._$element.toggleClass(
                'hrm-form-field--should-label-float',
                shouldLabelFloat,
              );
            }),
          );

          setTimeout(() => {
            this._$element.removeClass('hrm-notransition');
          });
        }),
      );
    }

    dispose() {
      this._subscriptions.forEach((s) => s.dispose());
    }
  }

  ko.bindingHandlers.hrmFormField = {
    init: function (element, valueAccessor, allBindings) {
      const control = allBindings.get('hrmFormFieldControlRef');
      const label = allBindings.get('hrmFormFieldLabelRef');
      const fixedLabel = allBindings.get('hrmFormFieldFixedLabel');
      const viewModel = new HrmFormFieldViewModel(
        element,
        control,
        label,
        fixedLabel,
      );

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
    },
  };
})();

// hrmFormFieldLabel
(() => {
  class HrmFormFieldLabelViewModel {
    constructor(element) {
      this._subscriptions = [];
      this._$element = $(element);

      this.element = element;

      this._init();
    }

    _init() {
      this._$element.addClass('hrm-form-field__label');
    }

    setFor(id) {
      this._$element.attr('for', id);
    }

    dispose() {
      this._subscriptions.forEach((s) => s.dispose());
    }
  }

  ko.bindingHandlers.hrmFormFieldLabel = {
    init: function (element, valueAccessor) {
      const viewModel = new HrmFormFieldLabelViewModel(element);

      if (valueAccessor() !== undefined) {
        if (ko.isObservableArray(valueAccessor())) {
          valueAccessor().push(viewModel);
        } else {
          valueAccessor()(viewModel);
        }
      }

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        if (valueAccessor() !== undefined) {
          if (ko.isObservableArray(valueAccessor())) {
            valueAccessor().remove(this);
          } else {
            valueAccessor()(null);
          }
        }

        viewModel.dispose();
      });
    },
  };
})();

// hrmFormFieldBasis
(() => {
  class HrmFormFieldBasisViewModel {
    constructor(element, control, withReset) {
      this._subscriptions = [];
      this._$element = $(element);
      this._control = control;
      this._clickHandler = null;
      this._mousedownHandler = null;
      this._changeHandler = null;

      this._withReset = withReset;
      this._reset = null;

      this.element = element;

      this._init();
    }

    _init() {
      this._$element.addClass('hrm-form-field__basis');

      if (this._withReset) {
        this._reset = $(
          '<i class="hrm-form-field-icon hrm-form-field-reset-icon"></i>',
        );
        this._$element.append(this._reset);
        this._reset.hide();
        this._reset.click(() => {
            if ('onBasicReset' in this._control()) {
                this._control().onBasicReset();
            }
        });
      }

      this._subscriptions.push(
        ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
          this._$element.toggleClass(
            'hrm-form-field__basis--focused',
            this._control().focused(),
          );
          this._subscriptions.push(
            this._control().focused.subscribe((focused) => {
              this._$element.toggleClass(
                'hrm-form-field__basis--focused',
                focused,
              );
            }),
          );

          this._$element.toggleClass(
            'hrm-form-field__basis--invalid',
            this._control().errorState(),
          );
          this._subscriptions.push(
            this._control().errorState.subscribe((errorState) => {
              this._$element.toggleClass(
                'hrm-form-field__basis--invalid',
                errorState,
              );
            }),
          );
        }),
      );

      this._clickHandler = (event) => {
        this._control().onBasisClick(event);
      };

      this._mousedownHandler = (event) => {
        this._control().onBasisMousedown(event);
      };

      this._changeHandler = (event) => {
        if (this._reset) {
            if (event.target.value.length) this._reset.fadeIn(250);
            else this._reset.fadeOut(250);
        }
      }

      this._$element.on('click', this._clickHandler);
      this._$element.on('mousedown', this._mousedownHandler);
      this._$element.on('input change', this._changeHandler);
    }

    dispose() {
      this._subscriptions.forEach((s) => s.dispose());
      this._$element.off('click', this._clickHandler);
      this._$element.off('mousedown', this._mousedownHandler);
      this._$element.off('input change', this._changeHandler);

      if (this._reset) {
        this._reset.off('click');
      }
    }
  }

  ko.bindingHandlers.hrmFormFieldBasis = {
    init: function (element, valueAccessor, allBindings) {
      const control = allBindings.get('hrmFormFieldBasisControl');
      const withReset = allBindings.has('hrmFormFieldBasisAllowClear');

      const viewModel = new HrmFormFieldBasisViewModel(
        element,
        control,
        withReset,
      );

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
    },
  };
})();

ko.components.register('hrm-form-field-error', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      const $element = $(componentInfo.element);

      $element.addClass(['hrm-form-field__error']);

      return new (function () {
        this.templateNodes = hrmSplitComponentTemplateNodes(
          componentInfo.templateNodes,
        );
      })();
    },
  },
  template: `
        <span class="hrm-form-field__error-text">
            <!-- ko template: {nodes: templateNodes.main} --><!-- /ko -->
        </span>
    `,
});
