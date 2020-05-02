"use strict";

const HRM_BREAKPOINTS = {
  tabletMaxWidth: 1200,
  mobileMaxWidth: 767
};
ko.validation.init({
  insertMessages: false
});
moment.locale('ru');
const HRM_SIDEBAR_COLLAPSED_LOCAL_STORAGE_KEY = 'hrmSidebarCollapsed'; // Fix stacking modals

$(document).on('hidden.bs.modal', function (event) {
  //const scrollbarWidth = $(event.target).data("bs.modal")._scrollbarWidth;
  if ($('.modal:visible').length) {
    $('body').addClass('modal-open'); //$('body').css('padding-right', scrollbarWidth);
  }

  $('.modal:visible').last().focus();
});
"use strict";

ko.bindingHandlers.hrmSlide = {
  init: function (element, valueAccessor, allBindings) {
    const value = ko.unwrap(allBindings.get('hrmSlideValue'));

    if (value) {
      $(element).slideDown(0);
    } else {
      $(element).slideUp(0);
    }

    $(element).data('hrmSlide', value);
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $(element).removeData('hrmSlide');
    });
  },
  update: function (element, valueAccessor, allBindings) {
    const value = ko.unwrap(allBindings.get('hrmSlideValue'));
    const duration = allBindings.get('hrmSlideDuration') || 200;

    if ($(element).data('hrmSlide') !== value) {
      if (value) {
        $(element).slideDown(duration);
      } else {
        $(element).slideUp(duration);
      }

      $(element).data('hrmSlide', value);
    }
  }
};
ko.bindingHandlers.hrmFade = {
  init: function (element, valueAccessor, allBindings) {
    const value = ko.unwrap(allBindings.get('hrmFadeValue'));

    if (value) {
      $(element).fadeIn(0);
    } else {
      $(element).fadeOut(0);
    }

    $(element).data('hrmFade', value);
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $(element).removeData('hrmFade');
    });
  },
  update: function (element, valueAccessor, allBindings) {
    const value = ko.unwrap(allBindings.get('hrmFadeValue'));
    const duration = allBindings.get('hrmFadeDuration') || 200;
    const inDelay = allBindings.get('hrmFadeInDelay') || 0;
    const outDelay = allBindings.get('hrmFadeOutDelay') || 0;

    if ($(element).data('hrmFade') !== value) {
      if (value) {
        $(element).delay(inDelay).fadeIn(duration);
      } else {
        $(element).delay(outDelay).fadeOut(duration);
      }

      $(element).data('hrmFade', value);
    }
  }
};
ko.bindingHandlers.hrmElement = {
  init: function (element, valueAccessor, allBindings) {
    if (ko.isObservableArray(valueAccessor())) {
      if (allBindings.has('hrmElementIndex')) {
        valueAccessor().splice(allBindings.get('hrmElementIndex'), 0, element);
      } else {
        valueAccessor().push(element);
      }
    } else {
      valueAccessor()(element);
    }

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      if (ko.isObservableArray(valueAccessor())) {
        valueAccessor().remove(element);
      } else {
        valueAccessor()(null);
      }
    });
  }
};
ko.bindingHandlers.hrmMask = {
  init: function (element, valueAccessor, allBindings) {
    // DEPRECATED! Use options.alias instead.
    const pattern = allBindings.get('hrmMaskPattern');
    let options = allBindings.get('hrmMaskOptions');

    if (pattern !== undefined) {
      if (options !== undefined) {
        options = {
          alias: pattern,
          ...options
        };
      } else {
        options = {
          alias: pattern
        };
      }
    }

    $(element).inputmask({
      jitMasking: true,
      showMaskOnFocus: false,
      showMaskOnHover: false,
      ...options
    });
  }
};
ko.bindingHandlers.hrmTimeAutocompleter = {
  init: function (element) {
    $(element).on('blur', () => {
      const value = $(element).val();
      const regExpExecuteResult = /^([0-9]{2}):\s$/.exec(value);

      if (regExpExecuteResult !== null && +regExpExecuteResult[1] < 24) {
        $(element).val(regExpExecuteResult[1] + ':00').trigger('change');
      }
    });
  }
};

function hrmSplitComponentTemplateNodes(nodes) {
  const result = {
    main: [],
    slots: {}
  };
  $(nodes).filter('hrm-slot').each((index, slotElement) => {
    const $slot = $(slotElement);
    result.slots[$slot.attr('name')] = $slot.contents();
  });
  result.main = nodes.filter(node => {
    return !(node.nodeType === 1 && node.tagName === 'HRM-SLOT');
  });
  return result;
}

function hrmSlideBeforeRemoveFactory(duration = 200, delay = 0) {
  return element => $(element).delay(delay).slideUp(duration, () => $(element).remove());
}

function hrmSlideAfterAddFactory(duration = 200, delay = 0) {
  return element => $(element).hide().delay(delay).slideDown(duration);
}

function hrmFadeBeforeRemoveFactory(duration = 200, delay = 0) {
  return element => $(element).delay(delay).fadeOut(duration, () => $(element).remove());
}

function hrmFadeAfterAddFactory(duration = 200, delay = 0) {
  return element => $(element).hide().delay(delay).fadeIn(duration);
}

ko.validation.rules['hrmDate'] = {
  validator: function (val, params) {
    return moment(val, params, true).isValid();
  },
  message: 'Неверный формат даты и времени'
};
ko.validation.registerExtenders();

function hrmTemplateIf(condition, data) {
  return condition ? [data] : undefined;
}

function hrmExtractComponentParam(params, name, defaultValue) {
  if (params !== undefined && name in params) {
    if (ko.isObservable(params[name])) {
      return params[name];
    } else {
      return ko.observable(params[name]);
    }
  } else {
    return ko.observable(defaultValue);
  }
}

ko.bindingHandlers.hrmLog = {
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    console.group('hrmLog');
    console.info('element', element);
    console.info('valueAccessor', valueAccessor());
    console.info('allBindings', allBindings());
    console.info('viewModel', viewModel);
    console.info('bindingContext', bindingContext);
    console.groupEnd('hrmLog');
  }
};
ko.bindingHandlers.hrmAutoResize = {
  init: function (element) {
    $(element).addClass('hrm-auto-resize').autoResize();
  }
};
ko.bindingHandlers.hrmColoredSign = {
  init: function (element, valueAccessor) {
    let value = parseInt(ko.unwrap(valueAccessor()));
    $(element).toggleClass('color--positive', value && value > 0);
    $(element).toggleClass('color--negative', value && value < 0);
    $(element).toggleClass('color--secondary', value === 0);
  },
  update: function (element, valueAccessor) {
    let value = parseInt(ko.unwrap(valueAccessor()));
    $(element).toggleClass('color--positive', value && value > 0);
    $(element).toggleClass('color--negative', value && value < 0);
    $(element).toggleClass('color--secondary', value === 0);
  }
};
"use strict";

ko.components.register('hrm-basic-footer', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      const $element = $(componentInfo.element);
      $element.addClass(['hrm-basic-footer']);
      return new function () {}();
    }
  },
  template: `
        <div class="hrm-basic-footer__branding">
            <div class="hrm-basic-footer__logo"></div>
            <span class="hrm-basic-footer__copyright">© Lookin, 2020</span>
        </div>
        <a class="hrm-basic-footer__support-link" href="#">Техническая поддержка</a>
    `
});
"use strict";

ko.components.register('hrm-basic-sidebar', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      const $element = $(componentInfo.element);
      $element.addClass(['hrm-basic-sidebar']);
      return new function () {}();
    }
  },
  template: `
        <button class="hrm-button hrm-circle-icon-button hrm-circle-logout-icon-button hrm-basic-sidebar__logout-button"
                title="Войти/зарегистрироваться">
        </button>
        <a class="hrm-basic-sidebar__support-link" href="#" title="Помощь"></a>
    `
});
"use strict";

ko.components.register('hrm-checkbox', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      const $element = $(componentInfo.element);
      $element.addClass(['hrm-checkbox']);

      const ViewModel = function () {
        this._subscriptions = [];

        if (params !== undefined && 'checked' in params) {
          this.checked = ko.isObservable(params.checked) ? params.checked : ko.observable(params.checked);
        } else {
          this.checked = ko.observable(false);
        }

        this.checkboxGroup = params !== undefined && 'owner' in params ? params.owner : null;

        (() => {
          $element.toggleClass('hrm-checkbox--checked', this.checked());

          this._subscriptions.push(this.checked.subscribe(checked => {
            $element.toggleClass('hrm-checkbox--checked', checked);
          }));
        })();
      };

      ViewModel.prototype.dispose = function () {
        this._subscriptions.forEach(s => s.dispose());
      };

      return new ViewModel();
    }
  },
  template: `
        <label class="hrm-checkbox__layout">
            <input data-bind="checked: checked, attr: {id: checkboxGroup !== null && checkboxGroup() !== null ? checkboxGroup().id : undefined}"
                   type="checkbox" hidden>
        </label>
    `
});
let hrmCheckboxGroupNextId = 0;
ko.components.register('hrm-checkbox-group', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      const $element = $(componentInfo.element);
      $element.addClass(['hrm-checkbox-group']);

      const ViewModel = function () {
        this.id = 'hrm-checkbox-group-' + hrmCheckboxGroupNextId++;

        (() => {
          if (params !== undefined && 'exportAs' in params) {
            if (ko.isObservableArray(params.exportAs)) {
              params.exportAs.push(this);
            } else {
              params.exportAs(this);
            }
          }
        })();
      };

      ViewModel.prototype.dispose = function () {
        if (params !== undefined && 'exportAs' in params) {
          if (ko.isObservableArray(params.exportAs)) {
            params.exportAs.remove(this);
          } else {
            params.exportAs(null);
          }
        }
      };

      return new ViewModel();
    }
  },
  template: `
        <!-- ko template: {nodes: $componentTemplateNodes} --><!-- /ko -->
    `
});
ko.bindingHandlers.hrmCheckboxGroupLabel = {
  init: function (element, valueAccessor, allBindings) {
    const checkboxGroup = allBindings.get('hrmCheckboxGroupLabelOwner');
    const $element = $(element);
    $element.addClass('hrm-checkbox-group__label');
    $element.attr('for', checkboxGroup().id);
  }
};
"use strict";

(() => {
  class HrmDatepickerViewModel {
    constructor(element, value) {
      this._subscriptions = [];
      this._valueSubscription = null;
      this._value = null;
      this._daterangepicker = null;
      this._applyHandler = null;
      this.element = element;

      this._init(value);
    }

    _init(value) {
      const $element = $(this.element);
      $element.attr('autocomplete', 'off');
      $element.daterangepicker({
        singleDatePicker: true,
        showDropdown: false,
        autoUpdateInput: false,
        locale: {
          format: 'DD.MM.YYYY, dddd',
          monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          firstDay: 1
        }
      });

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
      const viewModel = new HrmDatepickerViewModel(element, value);
      instances.set(element, viewModel);

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
"use strict";

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

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
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
"use strict";

// hrmFormFieldComplexControl
(() => {
  let nextId = 0;

  class HrmFormFieldComplexControlViewModel {
    constructor(element, disabled) {
      this._subscriptions = [];
      this._$element = $(element);
      this._disabled = null;
      this._disabledSubscription = null;
      this.element = element;
      this.id = 'hrm-form-field-complex-control-' + nextId++;
      this.focused = null;
      this.disabled = null;
      this.shouldLabelFloat = null;
      this.errorState = null;

      this._init(disabled);
    }

    _init(disabled) {
      this._$element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_complex']);

      this.focused = ko.observable(false);
      this.disabled = ko.observable(false);
      this.shouldLabelFloat = ko.observable(true);
      this.errorState = ko.observable(false);

      this._setDisabled(disabled);
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());
    }

    onBasisClick() {}

    onBasisMousedown() {}

    _setDisabled(disabled) {
      if (this._disabledSubscription !== null) {
        this._disabledSubscription.dispose();
      }

      if (ko.isObservable(disabled)) {
        this._disabledSubscription = disabled.subscribe(disabled => {
          this._disabled = disabled;

          this._updateDisabled();
        });
        this._disabled = disabled();
      } else {
        this._disabled = disabled;
      }

      this._updateDisabled();
    }

    _updateDisabled() {
      this.disabled(this._disabled === true);
    }

  }

  const instances = new Map();
  const previousBindingsList = new Map();
  ko.bindingHandlers.hrmFormFieldComplexControl = {
    init: function (element, valueAccessor, allBindings) {
      const disabled = allBindings.get('hrmFormFieldComplexControlDisabled');
      const viewModel = new HrmFormFieldComplexControlViewModel(element, disabled);
      instances.set(element, viewModel);

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
    update: function (element, valueAccessor, allBindings) {
      const instance = instances.get(element);
      const previousBindings = previousBindingsList.get(element);

      if (previousBindings !== undefined) {
        if (previousBindings['hrmFormFieldComplexControlDisabled'] !== allBindings.get('hrmFormFieldComplexControlDisabled')) {
          instance._setDisabled(allBindings.get('hrmFormFieldComplexControlDisabled'));
        }
      }

      previousBindingsList.set(element, allBindings());
    }
  };
})();
"use strict";

// hrmFormFieldDatepickerControl
(() => {
  let nextId = 0;

  class HrmFormFieldDatepickerControlViewModel {
    constructor(element, value, textInput, errorStateMatcher) {
      this._subscriptions = [];
      this._$element = $(element);
      this._focusChangeHandler = null;
      this._valueChangeHandler = null;
      this._mutationObserver = null;

      if (errorStateMatcher === undefined) {
        errorStateMatcher = formControl => {
          return ko.pureComputed(() => {
            return 'isValid' in formControl && !formControl.isValid();
          });
        };
      }

      this._errorStateMatcher = ko.observable(errorStateMatcher);
      this._value = ko.observable(value);
      this._textInput = ko.observable(textInput);
      this._control = null;
      this._daterangepickerInstance = null;
      this.element = element;
      this.id = 'hrm-form-field-datepicker-control-' + nextId++;
      this.focused = null;
      this.disabled = null;
      this.shouldLabelFloat = null;
      this.errorState = null;

      this._init();
    }

    _init() {
      this._$element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_input']);

      this._$element.attr('id', this.id);

      this._daterangepickerInstance = this._$element.data('daterangepicker');

      this._daterangepickerInstance.container.addClass('hrm-form-field__dropdown');

      this._control = ko.pureComputed(() => {
        if (this._value() !== undefined) {
          return this._value();
        } else if (this._textInput() !== undefined) {
          return this._textInput();
        } else {
          return null;
        }
      });

      this._subscriptions.push(ko.pureComputed(() => {
        if (this._control() !== null) {
          return this._control()();
        } else {
          return null;
        }
      }).subscribe(() => {
        this._$element.trigger('change.hrm-form-field-datepicker-control');
      }));

      this.focused = ko.observable(this._hasFocus());
      this.disabled = ko.observable(this._isDisabled());
      const hasValue = ko.observable(this._hasValue());
      const hasPlaceholder = ko.observable(this._hasPlaceholder());

      this._focusChangeHandler = () => this.focused(this._hasFocus());

      this._valueChangeHandler = () => hasValue(this._hasValue());

      this._mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes') {
            hasPlaceholder(this._hasPlaceholder());
            this.disabled(this._isDisabled());
          }
        });
      });

      this._mutationObserver.observe(this.element, {
        attributes: true
      });

      this.shouldLabelFloat = ko.pureComputed(() => {
        return this.focused() || hasValue() || hasPlaceholder();
      });
      this.errorState = ko.pureComputed(() => {
        const errorStateMatcher = this._errorStateMatcher();

        const control = this._control();

        return control !== null ? errorStateMatcher(control)() : false;
      });

      this._$element.on('focus blur', this._focusChangeHandler);

      this._$element.on('input change', this._valueChangeHandler);
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());

      this._$element.off('focus blur', this._focusChangeHandler);

      this._$element.off('input change change.hrm-form-field-datepicker-control', this._valueChangeHandler);

      this._mutationObserver.disconnect();
    }

    onBasisClick() {
      this._$element.focus();
    }

    onBasisMousedown() {}

    _setValue(value) {
      if (!ko.isObservable(value)) {
        throw Error('\'value\' binding have to be observable.');
      }

      this._value(value);
    }

    _setTextInput(textInput) {
      if (!ko.isObservable(textInput)) {
        throw Error('\'textInput\' binding have to be observable.');
      }

      this._textInput(textInput);
    }

    _setErrorStateMatcher(errorStateMatcher) {
      this._errorStateMatcher(errorStateMatcher);
    }

    _hasFocus() {
      return this._$element.is(':focus');
    }

    _hasValue() {
      return this._$element.val() !== '';
    }

    _hasPlaceholder() {
      return this._$element.attr('placeholder') !== undefined;
    }

    _isDisabled() {
      return this._$element.attr('disabled') !== undefined;
    }

  }

  const instances = new Map();
  const previousBindingsList = new Map();
  ko.bindingHandlers.hrmFormFieldDatepickerControl = {
    init: function (element, valueAccessor, allBindings) {
      const value = allBindings.get('value');
      const textInput = allBindings.get('textInput');
      const errorStateMatcher = allBindings.get('hrmFormFieldDatepickerControlErrorStateMatcher');
      const viewModel = new HrmFormFieldDatepickerControlViewModel(element, value, textInput, errorStateMatcher);
      instances.set(element, viewModel);

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
    update: function (element, valueAccessor, allBindings) {
      const instance = instances.get(element);
      const previousBindings = previousBindingsList.get(element);

      if (previousBindings !== undefined) {
        if (previousBindings['value'] !== allBindings.get('value')) {
          instance._setValue(allBindings.get('value'));
        }
      }

      if (previousBindings !== undefined) {
        if (previousBindings['textInput'] !== allBindings.get('textInput')) {
          instance._setTextInput(allBindings.get('textInput'));
        }
      }

      if (previousBindings !== undefined) {
        if (previousBindings['hrmFormFieldDatepickerControlErrorStateMatcher'] !== allBindings.get('hrmFormFieldDatepickerControlErrorStateMatcher')) {
          instance._setErrorStateMatcher(allBindings.get('hrmFormFieldDatepickerControlErrorStateMatcher'));
        }
      }

      previousBindingsList.set(element, allBindings());
    }
  };
})();
"use strict";

// hrmFormFieldInputControl
(() => {
  let nextId = 0;

  class HrmFormFieldInputControlViewModel {
    constructor(element, value, textInput, errorStateMatcher) {
      this._subscriptions = [];
      this._$element = $(element);
      this._focusChangeHandler = null;
      this._valueChangeHandler = null;
      this._mutationObserver = null;

      if (errorStateMatcher === undefined) {
        errorStateMatcher = formControl => {
          return ko.pureComputed(() => {
            return 'isValid' in formControl && !formControl.isValid();
          });
        };
      }

      this._errorStateMatcher = ko.observable(errorStateMatcher);
      this._value = ko.observable(value);
      this._textInput = ko.observable(textInput);
      this._control = null;
      this.element = element;
      this.id = 'hrm-form-field-input-control-' + nextId++;
      this.focused = null;
      this.disabled = null;
      this.shouldLabelFloat = null;
      this.errorState = null;

      this._init();
    }

    _init() {
      this._$element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_input']);

      this._$element.attr('id', this.id);

      this._control = ko.pureComputed(() => {
        if (this._value() !== undefined) {
          return this._value();
        } else if (this._textInput() !== undefined) {
          return this._textInput();
        } else {
          return null;
        }
      });

      this._subscriptions.push(ko.pureComputed(() => {
        if (this._control() !== null) {
          return this._control()();
        } else {
          return null;
        }
      }).subscribe(() => {
        this._$element.trigger('change.hrm-form-field-input-control');
      }));

      this.focused = ko.observable(this._hasFocus());
      this.disabled = ko.observable(this._isDisabled());
      const hasValue = ko.observable(this._hasValue());
      const hasPlaceholder = ko.observable(this._hasPlaceholder());

      this._focusChangeHandler = () => this.focused(this._hasFocus());

      this._valueChangeHandler = () => hasValue(this._hasValue());

      this._mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes') {
            hasPlaceholder(this._hasPlaceholder());
            this.disabled(this._isDisabled());
          }
        });
      });

      this._mutationObserver.observe(this.element, {
        attributes: true
      });

      this.shouldLabelFloat = ko.pureComputed(() => {
        return this.focused() || hasValue() || hasPlaceholder();
      });
      this.errorState = ko.pureComputed(() => {
        const errorStateMatcher = this._errorStateMatcher();

        const control = this._control();

        return control !== null ? errorStateMatcher(control)() : false;
      });

      this._$element.on('focus blur', this._focusChangeHandler);

      this._$element.on('input change change.hrm-form-field-input-control', this._valueChangeHandler);
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());

      this._$element.off('focus blur', this._focusChangeHandler);

      this._$element.off('input change', this._valueChangeHandler);

      this._mutationObserver.disconnect();
    }

    onBasisClick() {
      this._$element.focus();
    }

    onBasicReset() {
      this._$element.val('').trigger('change');
    }

    onBasisMousedown() {}

    _setValue(value) {
      if (!ko.isObservable(value)) {
        throw Error('\'value\' binding have to be observable.');
      }

      this._value(value);
    }

    _setTextInput(textInput) {
      if (!ko.isObservable(textInput)) {
        throw Error('\'textInput\' binding have to be observable.');
      }

      this._textInput(textInput);
    }

    _setErrorStateMatcher(errorStateMatcher) {
      this._errorStateMatcher(errorStateMatcher);
    }

    _hasFocus() {
      return this._$element.is(':focus');
    }

    _hasValue() {
      return this._$element.val() !== '';
    }

    _hasPlaceholder() {
      return this._$element.attr('placeholder') !== undefined;
    }

    _isDisabled() {
      return this._$element.attr('disabled') !== undefined;
    }

  }

  const instances = new Map();
  const previousBindingsList = new Map();
  ko.bindingHandlers.hrmFormFieldInputControl = {
    init: function (element, valueAccessor, allBindings) {
      const value = allBindings.get('value');
      const textInput = allBindings.get('textInput');
      const errorStateMatcher = allBindings.get('hrmFormFieldInputControlErrorStateMatcher');
      const viewModel = new HrmFormFieldInputControlViewModel(element, value, textInput, errorStateMatcher);
      instances.set(element, viewModel);

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
    update: function (element, valueAccessor, allBindings) {
      const instance = instances.get(element);
      const previousBindings = previousBindingsList.get(element);

      if (previousBindings !== undefined) {
        if (previousBindings['value'] !== allBindings.get('value')) {
          instance._setValue(allBindings.get('value'));
        }
      }

      if (previousBindings !== undefined) {
        if (previousBindings['textInput'] !== allBindings.get('textInput')) {
          instance._setTextInput(allBindings.get('textInput'));
        }
      }

      if (previousBindings !== undefined) {
        if (previousBindings['hrmFormFieldInputControlErrorStateMatcher'] !== allBindings.get('hrmFormFieldInputControlErrorStateMatcher')) {
          instance._setErrorStateMatcher(allBindings.get('hrmFormFieldInputControlErrorStateMatcher'));
        }
      }

      previousBindingsList.set(element, allBindings());
    }
  };
})();
"use strict";

// hrmFormFieldSelectControl
(() => {
  let nextId = 0;

  class HrmFormFieldSelectControlViewModel {
    constructor(element, value, selectedOptions, errorStateMatcher) {
      this._subscriptions = [];
      this._$element = $(element);
      this._valueChangeHandler = null;
      this._selectionFocusHandler = null;
      this._selectionBlurHandler = null;
      this._searchFocusHandler = null;
      this._searchBlurHandler = null;
      this._openingHandler = null;
      this._closeHandler = null;
      this._searchUpdateHandler = null;
      this._mutationObserver = null;

      if (errorStateMatcher === undefined) {
        errorStateMatcher = formControl => {
          return ko.pureComputed(() => {
            return 'isValid' in formControl && !formControl.isValid();
          });
        };
      }

      this._errorStateMatcher = ko.observable(errorStateMatcher);
      this._value = ko.observable(value);
      this._selectedOptions = ko.observable(selectedOptions);
      this._control = null;
      this._isMultiple = null;
      this._select2Instance = null;
      this.element = element;
      this.id = 'hrm-form-field-select-control-' + nextId++;
      this.focused = null;
      this.disabled = null;
      this.shouldLabelFloat = null;
      this.errorState = null;

      this._init();
    }

    _init() {
      this._$element.attr('id', this.id);

      this._select2Instance = this._$element.data('select2');

      this._select2Instance.$container.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_select']);

      this._select2Instance.$dropdown.children().first().addClass(['hrm-form-field__dropdown']);

      this._isMultiple = this._$element.prop('multiple');
      this._control = ko.pureComputed(() => {
        if (this._value() !== undefined) {
          return this._value();
        } else if (this._selectedOptions() !== undefined) {
          return this._selectedOptions();
        } else {
          return null;
        }
      });
      const selectionFocused = ko.observable(this._select2Instance.$selection.is(':focus'));
      const searchFocused = this._isMultiple ? ko.observable(this._select2Instance.selection.$search.is(':focus')) : null;
      const dropdownOpened = ko.observable(false);
      const hasValue = ko.observable(this._hasValue());
      const hasPlaceholder = ko.observable(this._hasPlaceholder());

      this._selectionFocusHandler = () => selectionFocused(true);

      this._selectionBlurHandler = () => selectionFocused(false);

      this._searchFocusHandler = () => searchFocused(true);

      this._searchBlurHandler = () => searchFocused(false);

      this._openingHandler = () => dropdownOpened(true);

      this._closeHandler = () => dropdownOpened(false);

      this._valueChangeHandler = () => hasValue(this._hasValue());

      this._searchUpdateHandler = () => {
        if (this._isMultiple) {
          this._select2Instance.selection.$search.off('focus', this._searchFocusHandler);

          this._select2Instance.selection.$search.off('blur', this._searchBlurHandler);

          this._select2Instance.selection.$search.on('focus', this._searchFocusHandler);

          this._select2Instance.selection.$search.on('blur', this._searchBlurHandler);
        }
      };

      this.focused = ko.pureComputed(() => {
        return selectionFocused() || dropdownOpened() || searchFocused !== null && searchFocused();
      });
      this.disabled = ko.observable(this._isDisabled());
      this.shouldLabelFloat = ko.pureComputed(() => {
        return this.focused() || hasValue() || hasPlaceholder();
      });
      this.errorState = ko.pureComputed(() => {
        const errorStateMatcher = this._errorStateMatcher();

        const control = this._control();

        return control !== null ? errorStateMatcher(control)() : false;
      });

      this._select2Instance.$selection.on('focus', this._selectionFocusHandler);

      this._select2Instance.$selection.on('blur', this._selectionBlurHandler);

      if (this._isMultiple) {
        this._select2Instance.selection.$search.on('focus', this._searchFocusHandler);

        this._select2Instance.selection.$search.on('blur', this._searchBlurHandler);
      }

      this._$element.on('change.select2', this._valueChangeHandler);

      this._$element.on('select2:opening', this._openingHandler);

      this._$element.on('select2:close', this._closeHandler);

      this._$element.on('hrm-select:search-update', this._searchUpdateHandler);

      this._mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes') {
            this.disabled(this._isDisabled());
          }
        });
      });

      this._mutationObserver.observe(this.element, {
        attributes: true
      });
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());

      this._select2Instance.$selection.off('focus', this._selectionFocusHandler);

      this._select2Instance.$selection.off('blur', this._selectionBlurHandler);

      if (this._isMultiple) {
        this._select2Instance.selection.$search.off('focus', this._searchFocusHandler);

        this._select2Instance.selection.$search.off('blur', this._searchBlurHandler);
      }

      this._$element.off('change.select2', this._valueChangeHandler);

      this._$element.off('select2:opening', this._openingHandler);

      this._$element.off('select2:close', this._closeHandler);

      this._$element.off('hrm-select:search-update', this._searchUpdateHandler);

      this._mutationObserver.disconnect();
    }

    onBasisClick() {}

    onBasisMousedown(event) {
      if (!this.disabled()) {
        if (event.target !== this.element && this._select2Instance.$container.get()[0] !== event.target && this._select2Instance.$container.has(event.target).length === 0) {
          const isOpen = this._select2Instance.isOpen();

          setTimeout(() => {
            this._select2Instance.$selection.focus();

            if (!isOpen) {
              this._select2Instance.open();
            }
          });
        }
      }
    }

    _setValue(value) {
      if (!ko.isObservable(value)) {
        throw Error('\'value\' binding have to be observable.');
      }

      this._value(value);
    }

    _setSelectedOptions(selectedOptions) {
      if (!ko.isObservable(selectedOptions)) {
        throw Error('\'selectedOptions\' binding have to be observable.');
      }

      this._selectedOptions(selectedOptions);
    }

    _setErrorStateMatcher(errorStateMatcher) {
      this._errorStateMatcher(errorStateMatcher);
    }

    _hasValue() {
      const value = this._$element.val();

      return value !== '' && value !== undefined && (!(value instanceof Array) || value.length !== 0);
    }

    _hasPlaceholder() {
      return this._select2Instance.options.options.placeholder !== ' ';
    }

    _isDisabled() {
      return this._$element.attr('disabled') !== undefined;
    }

  }

  const instances = new Map();
  const previousBindingsList = new Map();
  ko.bindingHandlers.hrmFormFieldSelectControl = {
    init: function (element, valueAccessor, allBindings) {
      const value = allBindings.get('value');
      const selectedOptions = allBindings.get('selectedOptions');
      const errorStateMatcher = allBindings.get('hrmFormFieldSelectControlErrorStateMatcher');
      const viewModel = new HrmFormFieldSelectControlViewModel(element, value, selectedOptions, errorStateMatcher);
      instances.set(element, viewModel);

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
    update: function (element, valueAccessor, allBindings) {
      const instance = instances.get(element);
      const previousBindings = previousBindingsList.get(element);

      if (previousBindings !== undefined) {
        if (previousBindings['value'] !== allBindings.get('value')) {
          instance._setValue(allBindings.get('value'));
        }
      }

      if (previousBindings !== undefined) {
        if (previousBindings['selectedOptions'] !== allBindings.get('selectedOptions')) {
          instance._setTextInput(allBindings.get('selectedOptions'));
        }
      }

      if (previousBindings !== undefined) {
        if (previousBindings['hrmFormFieldSelectControlErrorStateMatcher'] !== allBindings.get('hrmFormFieldSelectControlErrorStateMatcher')) {
          instance._setErrorStateMatcher(allBindings.get('hrmFormFieldSelectControlErrorStateMatcher'));
        }
      }

      previousBindingsList.set(element, allBindings());
    }
  };
})();
"use strict";

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

      this._$element.toggleClass('hrm-form-field--fixed-label', this._fixedLabel !== undefined);

      this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
        this._$element.toggleClass('hrm-form-field--has-label', this._label !== undefined);

        this._$element.toggleClass('hrm-form-field--focused', this._control().focused());

        this._subscriptions.push(this._control().focused.subscribe(focused => {
          this._$element.toggleClass('hrm-form-field--focused', focused);
        }));

        this._$element.toggleClass('hrm-form-field--disabled', this._control().disabled());

        this._subscriptions.push(this._control().disabled.subscribe(disabled => {
          this._$element.toggleClass('hrm-form-field--disabled', disabled);
        }));

        this._$element.toggleClass('hrm-form-field--should-label-float', this._control().shouldLabelFloat());

        this._subscriptions.push(this._control().shouldLabelFloat.subscribe(shouldLabelFloat => {
          this._$element.toggleClass('hrm-form-field--should-label-float', shouldLabelFloat);
        }));

        setTimeout(() => {
          this._$element.removeClass('hrm-notransition');
        });
      }));
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());
    }

  }

  ko.bindingHandlers.hrmFormField = {
    init: function (element, valueAccessor, allBindings) {
      const control = allBindings.get('hrmFormFieldControlRef');
      const label = allBindings.get('hrmFormFieldLabelRef');
      const fixedLabel = allBindings.get('hrmFormFieldFixedLabel');
      const viewModel = new HrmFormFieldViewModel(element, control, label, fixedLabel);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
    }
  };
})(); // hrmFormFieldLabel


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
      this._subscriptions.forEach(s => s.dispose());
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
    }
  };
})(); // hrmFormFieldBasis


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
        this._reset = $('<i class="hrm-form-field-icon hrm-form-field-reset-icon"></i>');

        this._$element.append(this._reset);

        this._reset.hide();

        this._reset.click(() => {
          if ('onBasicReset' in this._control()) {
            this._control().onBasicReset();
          }
        });
      }

      this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'childrenComplete', () => {
        this._$element.toggleClass('hrm-form-field__basis--focused', this._control().focused());

        this._subscriptions.push(this._control().focused.subscribe(focused => {
          this._$element.toggleClass('hrm-form-field__basis--focused', focused);
        }));

        this._$element.toggleClass('hrm-form-field__basis--invalid', this._control().errorState());

        this._subscriptions.push(this._control().errorState.subscribe(errorState => {
          this._$element.toggleClass('hrm-form-field__basis--invalid', errorState);
        }));
      }));

      this._clickHandler = event => {
        this._control().onBasisClick(event);
      };

      this._mousedownHandler = event => {
        this._control().onBasisMousedown(event);
      };

      this._changeHandler = event => {
        if (this._reset) {
          if (event.target.value.length) this._reset.fadeIn(250);else this._reset.fadeOut(250);
        }
      };

      this._$element.on('click', this._clickHandler);

      this._$element.on('mousedown', this._mousedownHandler);

      this._$element.on('input change', this._changeHandler);
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());

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
      const viewModel = new HrmFormFieldBasisViewModel(element, control, withReset);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
    }
  };
})();

ko.components.register('hrm-form-field-error', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      const $element = $(componentInfo.element);
      $element.addClass(['hrm-form-field__error']);
      return new function () {
        this.templateNodes = hrmSplitComponentTemplateNodes(componentInfo.templateNodes);
      }();
    }
  },
  template: `
        <span class="hrm-form-field__error-text">
            <!-- ko template: {nodes: templateNodes.main} --><!-- /ko -->
        </span>
    `
});
"use strict";

(() => {
  ko.components.register('hrm-main-sidebar', {
    viewModel: {
      createViewModel: function (params, componentInfo) {
        const $element = $(componentInfo.element);
        $element.addClass(['hrm-main-sidebar']);
        return new class {
          constructor() {
            this._isCollapsed = hrmExtractComponentParam(params, 'collapsed', false);
            this._isUserSelected = false;
            this._isNotificationsSelected = false;
            this._selectedMenuItemIndex = null;
            this._selectedDrawerContentName = null;
            this._$element = $element;
            this._$collapseToggleElement = this._$element.find('.hrm-main-sidebar__collapse-toggle');
            this._$user = this._$element.find('.hrm-main-sidebar__user');
            this._$notifications = this._$element.find('.hrm-main-sidebar__notifications');
            this._$menuItems = this._$element.find('.hrm-main-sidebar__menu-item');
            this._$drawer = this._$element.find('.hrm-main-sidebar__drawer');
            this._$backdrop = this._$element.find('.hrm-main-sidebar__backdrop');
            this._drawerContents = new Map(this._$element.find('.hrm-main-sidebar__drawer-content').toArray().map(element => {
              const $element = $(element);
              return [$element.data('hrm-main-sidebar-drawer-content-name'), $element];
            }));
            this.viewportSize = ko.observable({
              width: $(window).width(),
              height: $(window).height()
            });

            this._init();
          }

          _init() {
            this._$element.addClass('hrm-notransition');

            this._$element.find('.hrm-main-sidebar__user').on('click', async () => {
              if (this._isUserSelected) {
                this.clearSelection();
              } else {
                this.selectUser();
              }
            });

            this._$element.find('.hrm-main-sidebar__notifications').on('click', async () => {
              if (this._isNotificationsSelected) {
                this.clearSelection();
              } else {
                this.selectNotifications();
              }
            });

            this._$backdrop.on('click', async () => {
              this.clearSelection();
            });

            this._$menuItems.each((index, menuItem) => {
              $(menuItem).on('click', () => {
                if (this._selectedMenuItemIndex === index) {
                  this.clearSelection();
                } else {
                  this.selectMenuItem(index);
                }
              });
            });

            $(window).on('resize', () => {
              this.viewportSize({
                width: $(window).width(),
                height: $(window).height()
              });
            });

            this._$element.toggleClass('hrm-main-sidebar--collapsed', this._isCollapsed());

            this._isCollapsed.subscribe(collapsed => {
              this._$element.toggleClass('hrm-main-sidebar--collapsed', collapsed);
            });

            setTimeout(() => {
              this._$element.removeClass('hrm-notransition');
            }, 0);
            this.viewportSize.subscribe(() => {
              this._$element.addClass('hrm-notransition');

              setTimeout(() => {
                this._$element.removeClass('hrm-notransition');
              }, 0);
            });
          }

          async selectUser() {
            if (!this._isUserSelected) {
              await this.clearSelection();

              this._$user.addClass('hrm-main-sidebar__user--active');

              this._isUserSelected = true;
              await this._openDrawer('user');
            }
          }

          async selectNotifications() {
            if (!this._isNotificationsSelected) {
              await this.clearSelection();

              this._$notifications.addClass('hrm-main-sidebar__notifications--active');

              this._isNotificationsSelected = true;
              await this._openDrawer('notifications');
            }
          }

          async selectMenuItem(index) {
            if (this._selectedMenuItemIndex !== index) {
              await this.clearSelection();

              this._$menuItems.eq(index).addClass('hrm-main-sidebar__menu-item--active');

              this._selectedMenuItemIndex = index;
              this._isUserSelected = false;
              await this._openDrawer(this._$menuItems.eq(index).data('hrm-main-sidebar-drawer-content-name'));
            }
          }

          async clearSelection() {
            if (this._selectedMenuItemIndex !== null) {
              this._$menuItems.eq(this._selectedMenuItemIndex).removeClass('hrm-main-sidebar__menu-item--active');

              this._selectedMenuItemIndex = null;
            } else if (this._isUserSelected) {
              this._$user.removeClass('hrm-main-sidebar__user--active');

              this._isUserSelected = false;
            } else if (this._isNotificationsSelected) {
              this._$notifications.removeClass('hrm-main-sidebar__notifications--active');

              this._isNotificationsSelected = false;
            }

            await this._closeDrawer();
          }

          async _openDrawer(contentName) {
            if (this._selectedDrawerContentName !== contentName) {
              await this._closeDrawer();

              const $drawerContent = this._drawerContents.get(contentName);

              $drawerContent.addClass('hrm-main-sidebar__drawer-content--active');

              this._$drawer.addClass('hrm-main-sidebar__drawer--open');

              this._$backdrop.addClass('hrm-main-sidebar__backdrop--visible');

              if ($drawerContent.data('hrm-main-sidebar-drawer-class') !== undefined) {
                this._$drawer.addClass($drawerContent.data('hrm-main-sidebar-drawer-class'));
              }

              this._selectedDrawerContentName = contentName;
            }
          }

          async _closeDrawer() {
            if (this._selectedDrawerContentName !== null) {
              this._$drawer.removeClass('hrm-main-sidebar__drawer--open');

              this._$backdrop.removeClass('hrm-main-sidebar__backdrop--visible');

              await new Promise(resolve => setTimeout(resolve, 200));

              const $drawerContent = this._drawerContents.get(this._selectedDrawerContentName);

              this._$drawer.removeClass($drawerContent.data('hrm-main-sidebar-drawer-class'));

              $drawerContent.removeClass('hrm-main-sidebar__drawer-content--active');
              this._selectedDrawerContentName = null;
            }
          }

        }();
      }
    },
    template: `
            <div class="hrm-main-sidebar__content-wrapper">
                <div class="hrm-main-sidebar__content">
                    <div class="hrm-main-sidebar__header">
                        <div class="hrm-main-sidebar__user">
                            <!--<img class="hrm-main-sidebar__avatar" src="assets/examples/avatar.jpg">-->
                            <img class="hrm-main-sidebar__avatar" src="assets/img/avatar-placeholder.png">
        
                            <div class="hrm-main-sidebar__user-name">
                                Пётр Петров
                            </div>
                        </div>
        
                        <div class="hrm-main-sidebar__notifications">
                            <div class="hrm-main-sidebar__notifications-icon">
                                <div class="hrm-main-sidebar__notifications-icon-counter">28</div>
                            </div>
                        </div>
                    </div>
        
                    <ul class="nav hrm-main-sidebar__menu">
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-calculations-item"
                            data-hrm-main-sidebar-drawer-content-name="calculations">
                            <span class="hrm-main-sidebar__menu-item-name">Расчёты</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-hr-item"
                            data-hrm-main-sidebar-drawer-content-name="hr">
                            <span class="hrm-main-sidebar__menu-item-name">Кадры</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-documents-item"
                            data-hrm-main-sidebar-drawer-content-name="documents">
                            <span class="hrm-main-sidebar__menu-item-name">Отчёты</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-reference-item"
                            data-hrm-main-sidebar-drawer-content-name="reference">
                            <span class="hrm-main-sidebar__menu-item-name">Справочники</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-contents-item"
                            data-hrm-main-sidebar-drawer-content-name="contents">
                            <span class="hrm-main-sidebar__menu-item-name">Все разделы</span>
                        </li>
                    </ul>
        
                    <div class="hrm-spacer"></div>
                    
                    <div class="hrm-main-sidebar__actions">
                        <a class="hrm-main-sidebar__settings-link" href="#" title="Настройки"></a>
        
                        <a class="hrm-main-sidebar__support-link" href="#" title="Помощь"></a>
            
                        <button class="hrm-button hrm-main-sidebar__collapse-toggle"
                                data-bind="click: function() {_isCollapsed(!_isCollapsed());}">
                        </button>
                    </div>
                </div>
            </div>
        
            <div class="hrm-main-sidebar__drawer">
                <div class="hrm-main-sidebar__drawer-content-wrapper" 
                     data-bind="hrmScrollable, hrmScrollableDisabled: viewportSize().width <= HRM_BREAKPOINTS.tabletMaxWidth">
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="calculations"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                    </div>
        
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="hr"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-hr-content'} --><!-- /ko -->
                    </div >
        
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="documents"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-documents-content'} --><!-- /ko -->
                    </div>
        
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="reference"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-reference-content'} --><!-- /ko -->
                    </div>
                    
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="contents"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__contents-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-contents-content'} --><!-- /ko -->
                    </div>
                    
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="user">
                         <!-- ko template: {name: 'hrm-main-sidebar-user-content'} --><!-- /ko -->
                    </div>
                    
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="notifications">
                         <!-- ko template: {name: 'hrm-main-sidebar-notifications-content'} --><!-- /ko -->
                    </div>
                </div>
            </div>
        
            <div class="hrm-main-sidebar__backdrop"></div>
            
            <script id="hrm-main-sidebar-calculations-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-hr-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-documents-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-reference-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-user-content" type="text/html">
                Пользователь
            </script>
            
            <script id="hrm-main-sidebar-notifications-content" type="text/html">
                Уведомления
            </script>
            
            <script id="hrm-main-sidebar-contents-content" type="text/html">
                <!-- ko if: viewportSize().width > HRM_BREAKPOINTS.mobileMaxWidth -->
                    Все разделы
                <!-- /ko -->
                
                <!-- ko if: viewportSize().width <= HRM_BREAKPOINTS.mobileMaxWidth -->
                    <div class="hrm-main-sidebar__contents">
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Расчеты
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Кадры
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-hr-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Документы
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-documents-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Справочники
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-reference-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Графики
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Листовки
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Маркетинг
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Штрафы/Премии
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Нарушения
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Плохие отзывы
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Жалобы и предложения
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Зоны доставки
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Инструкции
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Календарь событий
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                    </div>
                <!-- /ko -->
            </script>
        `
  });
})();
"use strict";

ko.bindingHandlers.hrmModalContainerModalWrapper = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    const options = $.extend({
      closeOnBackdropClick: true,
      escapePress: 'close'
    }, allBindings()['hrmModalContainerModalWrapperOptions']);
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
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $modal.modal('hide').remove();
    });
  }
};
ko.components.register('hrm-modal-container', {
  viewModel: {
    createViewModel: function (params) {
      const viewModel = new function () {
        this.opens = params.opens;

        this.close = function (open, value) {
          this.opens.remove(open);

          if ('close' in open) {
            open.close(value);
          }
        };
      }();
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
"use strict";

// hrmScrollable
(() => {
  class HrmScrollableViewModel {
    constructor(element, disabled) {
      this._subscriptions = [];
      this._disabledSubscription = null;
      this._disabled = null;
      this._overlayScrollbarsInstance = null;
      this._overlayScrollbarsOptions = {
        className: 'hrm-scrollable'
      };
      this.element = element;

      this._init(disabled);
    }

    _init(disabled) {
      this._setDisabled(disabled);

      this._update();
    }

    _destroy() {
      this._subscriptions.forEach(s => s.dispose());

      if (this._disabledSubscription !== null) {
        this._disabledSubscription.dispose();
      }
    }

    _setDisabled(disabled) {
      if (disabled === undefined) {
        disabled = false;
      }

      if (this._disabledSubscription !== null) {
        this._disabledSubscription.dispose();
      }

      if (ko.isObservable(disabled)) {
        this._disabledSubscription = disabled.subscribe(disabled => {
          this._disabled = disabled;

          this._update();
        });
        this._disabled = disabled();
      } else {
        this._disabled = disabled;

        this._update();
      }
    }

    _update() {
      const $element = $(this.element);

      if (!this._disabled) {
        if (this._overlayScrollbarsInstance === null) {
          $element.overlayScrollbars(this._overlayScrollbarsOptions);
          this._overlayScrollbarsInstance = $element.overlayScrollbars();
        }
      } else {
        if (this._overlayScrollbarsInstance !== null) {
          this._overlayScrollbarsInstance.destroy();

          this._overlayScrollbarsInstance = null;
        }
      }
    }

  }

  const instances = new Map();
  const previousBindingsList = new Map();
  ko.bindingHandlers.hrmScrollable = {
    init: function (element, valueAccessor, allBindings) {
      const disabled = allBindings.get('hrmScrollableDisabled');
      const viewModel = new HrmScrollableViewModel(element, disabled);
      instances.set(element, viewModel);

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

        viewModel._destroy();
      });
    },
    update: function (element, valueAccessor, allBindings) {
      const instance = instances.get(element);
      const previousBindings = previousBindingsList.get(element);

      if (previousBindings !== undefined) {
        if (previousBindings['hrmScrollableDisabled'] !== allBindings.get('hrmScrollableDisabled')) {
          instance._setDisabled(allBindings.get('hrmScrollableDisabled'));
        }
      }

      previousBindingsList.set(element, allBindings());
    }
  };
})();
"use strict";

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
        this.options = { ...this.options,
          top: { ...this.options.top,
            ...params.options.top
          },
          right: { ...this.options.right,
            ...params.options.right
          },
          bottom: { ...this.options.bottom,
            ...params.options.bottom
          },
          left: { ...this.options.left,
            ...params.options.left
          }
        };
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
"use strict";

ko.components.register('hrm-search-field', {
  viewModel: {
    createViewModel: function (params, componentInfo) {
      params = params || {};
      const $element = $(componentInfo.element);

      const ViewModel = function () {
        this._subscriptions = [];
        this.term = params.termModel || ko.observable('');
        this.placeholder = params.placeholder || 'Поиск';

        this.clear = () => this.term('');

        this.empty = ko.pureComputed(() => {
          return !this.term() || this.term().length === 0;
        }); // if (params !== undefined && 'checked' in params) {
        //     this.checked = ko.isObservable(params.checked) ? params.checked : ko.observable(params.checked);
        // } else {
        //     this.checked = ko.observable(false);
        // }
        // this.checkboxGroup = params !== undefined && 'owner' in params ? params.owner : null;
        // (() => {
        //     $element.toggleClass('hrm-checkbox--checked', this.checked());
        //     this._subscriptions.push(this.checked.subscribe(checked => {
        //         $element.toggleClass('hrm-checkbox--checked', checked);
        //     }));
        // })();
      };

      ViewModel.prototype.dispose = function () {
        this._subscriptions.forEach(s => s.dispose());
      };

      return new ViewModel();
    }
  },
  template: `
    <!-- ko let: {control: ko.observable(null)} -->
    <div class="hrm-search-form-field"
      data-bind="hrmFormField, hrmFormFieldControlRef: control">
      <div data-bind="hrmFormFieldBasis, hrmFormFieldBasisControl: control">
          <i class="hrm-form-field__basis-prefix hrm-form-field-icon hrm-form-field-search-icon"></i>

          <input data-bind="
                  textInput: $component.term,
                  hrmFormFieldInputControl: control,
                  attr: {placeholder: placeholder}
              ">

          <!-- ko ifnot: empty -->
          <i class="hrm-form-field__basis-prefix hrm-form-field-icon hrm-form-field-reset-icon" data-bind="click: clear"></i>
          <!-- /ko -->
      </div>
    </div>
    <!-- /ko -->
  `
});
"use strict";

ko.bindingHandlers.hrmSelect = {
  init: function (element, valueAccessor, allBindings) {
    const $element = $(element);
    const isMultiple = $element.prop('multiple');
    const value = !isMultiple ? allBindings.get('value') : allBindings.get('selectedOptions');
    const wrapperClass = allBindings.get('hrmSelectClass');
    const customValuesAllowed = allBindings.has('hrmSelectCustomValuesAllowed') ? allBindings.get('hrmSelectCustomValuesAllowed') : false;
    const searchEnabled = allBindings.has('hrmSelectSearchEnabled') ? allBindings.get('hrmSelectSearchEnabled') : false;
    const placeholder = allBindings.has('hrmSelectPlaceholder') ? allBindings.get('hrmSelectPlaceholder') : ' ';
    const allowClear = allBindings.has('hrmSelectAllowClear') ? allBindings.get('hrmSelectAllowClear') : false;

    if (customValuesAllowed && !isMultiple && !searchEnabled) {
      throw Error('You have to enable both options "hrmSelectCustomValuesAllowed" and "hrmSelectSearchEnabled"');
    }

    const options = {
      minimumResultsForSearch: searchEnabled ? 0 : Infinity,
      language: 'ru',
      width: '100%',
      dropdownAutoWidth: true,
      dropdownCssClass: 'hrm-select__dropdown',
      placeholder,
      allowClear,
      templateSelection: state => $('<span>').addClass('hrm-select__rendered-text').text(state.text),
      tags: customValuesAllowed
    };

    const Select = $.fn.select2.amd.require('jquery.select2');

    const Search = $.fn.select2.amd.require('select2/selection/search');

    const originalSelectRenderFn = Select.prototype.render;
    const originalSearchUpdateFn = Search.prototype.update;

    Select.prototype.render = function () {
      const $container = originalSelectRenderFn.call(this, ...arguments);
      $container.addClass('hrm-select');

      if (wrapperClass !== undefined) {
        $container.addClass(wrapperClass.split(' '));
      }

      return $container;
    };

    Search.prototype.update = function () {
      originalSearchUpdateFn.call(this, ...arguments);
      $element.trigger('hrm-select:search-update');
    };

    $element.select2(options);
    Select.prototype.render = originalSelectRenderFn;
    Search.prototype.update = originalSearchUpdateFn;
    const select2Instance = $element.data('select2');
    select2Instance.$results.unbind('mousewheel');
    const $dropdownResultsContainer = $element.data('select2').$results.parent();
    $dropdownResultsContainer.overlayScrollbars({
      callbacks: {
        onUpdated: () => {
          if (select2Instance.$dropdown.is(':visible')) {
            select2Instance.dropdown._positionDropdown(); // Правка бага в Chrome с неправильным синхронным вычислением положения выпадающего списка


            setTimeout(() => {
              select2Instance.dropdown._positionDropdown();
            });
          }
        }
      }
    });

    function hasValue() {
      const value = $element.val();
      return value !== '' && value !== undefined && (!(value instanceof Array) || value.length !== 0);
    }

    select2Instance.$container.toggleClass('hrm-select--has-value', hasValue());

    const openHandler = () => {
      $dropdownResultsContainer.overlayScrollbars().scroll(0);
    };

    const openingHandler = () => {
      select2Instance.$dropdown.hide().fadeIn(150);
    };

    const changeHandler = () => {
      select2Instance.$container.toggleClass('hrm-select--has-value', hasValue());
    };

    let isClosingAnimated = false;

    const closingHandler = () => {
      if (!isClosingAnimated) {
        select2Instance.$dropdown.fadeOut(150, () => {
          isClosingAnimated = true;
          select2Instance.close();
        });
        return false;
      } else {
        isClosingAnimated = false;
        return true;
      }
    };

    $element.on('select2:open', openHandler);
    $element.on('select2:opening', openingHandler);
    $element.on('select2:closing', closingHandler);
    $element.on('change.select2', changeHandler);
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $element.off('select2:open', openHandler);
      $element.off('select2:opening', openingHandler);
      $element.off('select2:closing', closingHandler);
      $element.off('change.select2', changeHandler);
      select2Instance.close();
    });
  },
  update: function (element, valueAccessor, allBindings) {
    const $element = $(element);
    const isMultiple = $element.prop('multiple');
    const value = !isMultiple ? allBindings.get('value') : allBindings.get('selectedOptions');

    if (value !== undefined && ko.isObservable(value)) {
      value.subscribe(v => {
        $element.trigger('change.select2');
      });
    }
  }
};
"use strict";

// hrmSwitch
(() => {
  let nextId = 0;

  class HrmSwitchViewModel {
    constructor(params, componentInfo) {
      this._subscriptions = [];
      this._$element = $(componentInfo.element);
      this._exportAs = params !== undefined ? params.exportAs : undefined;
      this.element = componentInfo.element;
      this.id = 'hrm-switch-' + nextId++;
      this.checked = hrmExtractComponentParam(params, 'checked', false);

      this._init();
    }

    _init() {
      this._$element.addClass(['hrm-switch']);

      this._$element.toggleClass('hrm-switch--checked', this.checked());

      this._subscriptions.push(this.checked.subscribe(checked => {
        this._$element.toggleClass('hrm-switch--checked', checked);
      }));

      if (this._exportAs !== undefined) {
        if (ko.isObservableArray(this._exportAs)) {
          this._exportAs.push(this);
        } else {
          this._exportAs(this);
        }
      }
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());
    }

  }

  ko.components.register('hrm-switch', {
    viewModel: {
      createViewModel: function (params, componentInfo) {
        return new HrmSwitchViewModel(params, componentInfo);
      }
    },
    template: `
            <label class="hrm-switch__layout">
                <input data-bind="checked: checked, attr: {id: id}" type="checkbox" hidden>
            </label>
        `
  });
})(); // hrmSwitchGroup


(() => {
  class HrmSwitchGroupViewModel {
    constructor(element, control, label) {
      this._subscriptions = [];
      this._$element = $(element);
      this._control = control;
      this._label = label;
      this.element = element;

      this._init();
    }

    _init() {
      this._$element.addClass('hrm-switch-group');

      this._subscriptions.push(ko.bindingEvent.subscribe(this.element, 'descendantsComplete', () => {
        this._label().setFor(this._control().id);
      }));
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());
    }

  }

  ko.bindingHandlers.hrmSwitchGroup = {
    init: function (element, valueAccessor, allBindings, _, bindingContext) {
      const control = allBindings.get('hrmSwitchGroupControlRef');
      const label = allBindings.get('hrmSwitchGroupLabelRef');
      const viewModel = new HrmSwitchGroupViewModel(element, control, label);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
      const innerBindingContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);
      ko.applyBindingsToDescendants(innerBindingContext, element);
      return {
        controlsDescendantBindings: true
      };
    }
  };
})(); // hrmSwitchGroupLabel


(() => {
  class HrmSwitchGroupLabelViewModel {
    constructor(element) {
      this._subscriptions = [];
      this._$element = $(element);
      this.element = element;

      this._init();
    }

    _init() {
      this._$element.addClass('hrm-switch-group__label');
    }

    setFor(id) {
      this._$element.attr('for', id);
    }

    dispose() {
      this._subscriptions.forEach(s => s.dispose());
    }

  }

  ko.bindingHandlers.hrmSwitchGroupLabel = {
    init: function (element, valueAccessor) {
      const viewModel = new HrmSwitchGroupLabelViewModel(element);

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
    }
  };
})();
"use strict";

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
          this.viewportSize({
            width: $(window).width(),
            height: $(window).height()
          });
          this.updateWidth();
        };

        this.viewportSize = ko.observable({
          width: $(window).width(),
          height: $(window).height()
        });
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
              w += itemWidths[i] + this.itemMargin;
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

        this.timer = ko.observable(0);
        setInterval(() => {
          this.timer(this.timer() + 1);
        }, 1000);

        (() => {
          $(window).on('resize', this.windowResizeHandler);
        })();
      };

      HrmTabGroupViewModel.prototype.dispose = function () {
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
                    <!-- ko foreach: viewportSize().width > HRM_BREAKPOINTS.tabletMaxWidth ? items.slice(0, maxFitItem() + 1) : items -->
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
                    
                    <!-- ko if: viewportSize().width > HRM_BREAKPOINTS.tabletMaxWidth -->
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
"use strict";

ko.bindingHandlers.hrmTable = {
  init: function (element) {
    const $element = $(element);
    $element.addClass('hrm-table');
  }
}; // hrmEditableTableCell

(() => {
  class ViewModel {
    constructor(element, error) {
      this._subscriptions = [];
      this._windowResizeHandler = null;
      this._clickHandler = null;
      this._errorSubscription = null;
      this._error = error;
      this._isTabletOrMobile = null;
      this._errorTippyInstance = null;
      this._errorTippyClickHandler = null;
      this.element = element;
      this.focused = ko.observable(false);
      this.click = new ko.subscribable();

      this._init();
    }

    _init() {
      const $element = $(this.element);
      const $content = $element.find('.hrm-table__editable-cell-content');
      $element.addClass('hrm-table__editable-cell');

      this._clickHandler = event => {
        if (event.target === $element[0] || $content.length > 0 && event.target === $content[0]) {
          this.click.notifySubscribers();
        }
      };

      $element.on('click', this._clickHandler);

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
      const isTabletOrMobile = width <= HRM_BREAKPOINTS.tabletMaxWidth;

      if (this._isTabletOrMobile !== isTabletOrMobile) {
        this._isTabletOrMobile = isTabletOrMobile;

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

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
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
})(); // hrmEditableTableCellInputControl


(() => {
  class ViewModel {
    constructor(element, owner) {
      this._subscriptions = [];
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

      this._subscriptions.push(ko.unwrap(this._owner).click.subscribe(() => {
        $element.focus();
      }));

      ko.unwrap(this._owner).focused($element.is(':focus'));
    }

    _destroy() {
      const $element = $(this.element);
      $element.off('focus', this._focusHandler);
      $element.off('blur', this._blurHandler);

      this._subscriptions.forEach(s => s.dispose());
    }

  }

  ko.bindingHandlers.hrmTableEditableCellInputControl = {
    init: function (element, valueAccessor, allBindings) {
      const owner = allBindings.get('hrmTableEditableCellInputControlOwner');
      const viewModel = new ViewModel(element, owner);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel._destroy();
      });
    }
  };
})(); // hrmEditableTableCellSelectControl


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

      this._subscriptions.push(ko.computed(() => selectionFocused() || dropdownOpened()).subscribe(value => ko.unwrap(this._owner).focused(value)));

      this._selectionFocusHandler = () => selectionFocused(true);

      this._selectionBlurHandler = () => selectionFocused(false);

      this._openingHandler = () => dropdownOpened(true);

      this._closeHandler = () => dropdownOpened(false);

      select2Instance.$selection.on('focus', this._selectionFocusHandler);
      select2Instance.$selection.on('blur', this._selectionBlurHandler);
      $element.on('select2:opening', this._openingHandler);
      $element.on('select2:close', this._closeHandler);
      selectionFocused(select2Instance.$selection.is(':focus'));

      this._subscriptions.push(ko.unwrap(this._owner).click.subscribe(() => {
        select2Instance.open();
      }));
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
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel._destroy();
      });
    }
  };
})(); // hrmTableStickySectionContainer


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
      const scrollableContainer = $('.hrm-scaffold__body').length > 0 ? $('.hrm-scaffold__body')[0] : $('body')[0];
      this._stickyEvents = new StickyEvents({
        container: scrollableContainer
      });

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
      }));
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

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
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
})(); // hrmTableStickySectionWrapper


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

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
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
"use strict";

// hrmTooltip
(() => {
  class ViewModel {
    constructor(element, text, mode = 'basic', hideOnClick) {
      this._subscriptions = [];
      this._textSubscription = null;
      this._clickHandler = null;
      this._text = null;
      this._mode = mode;
      this._hideOnClick = hideOnClick;
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

      const triggers = [];
      if (this._mode !== 'basic') triggers.push('manual');else {
        triggers.push('mouseenter');
        if (!this._hideOnClick) triggers.push('click');
      }
      this._tippyInstance = tippy(this.element, {
        arrow: false,
        distance: 7,
        placement: 'bottom',
        interactive: true,
        appendTo: document.body,
        boundary: 'viewport',
        hideOnClick: true,
        trigger: triggers.join(' '),
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
      this._tippyInstance.destroy();

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
      const hideOnClick = allBindings.has('hrmTooltipHideOnClick');
      const viewModel = new ViewModel(element, text, mode, hideOnClick);
      instances.set(element, viewModel);

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
//# sourceMappingURL=main.js.map
