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
    const autoResizeInstance = $(element).addClass('hrm-auto-resize').autoResize();
    $(element).data('resizeInstance', autoResizeInstance);
    $(element).on('reset', () => {
      $(element).height('');
    });
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
ko.bindingHandlers.stopEvents = {
  init: function (element) {
    $(element).on('click input change mousedown', e => {
      e.stopPropagation();
    });
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

        if (params !== undefined && 'disabled' in params) {
          this.disabled = ko.isObservable(params.disabled) ? params.disabled : ko.observable(params.disabled);
        } else {
          this.disabled = ko.observable(false);
        }

        $element.toggleClass('disabled', this.disabled());
        this.disabled.subscribe(v => {
          $element.toggleClass('disabled', v);
        });
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
            <input data-bind="checked: checked, disable: disabled, attr: {id: checkboxGroup !== null && checkboxGroup() !== null ? checkboxGroup().id : undefined}"
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
          monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
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

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return Array.from(arr);
  }
}

window.DishesSelect = {
  loaded: ko.observable(false),
  loading: ko.observable(false),
  loadPromise: null,
  dishes: [],

  load() {
    this.loadPromise = new Promise(res => {
      if (this.loaded()) {
        res();
        return;
      }

      this.loading(true);
      setTimeout(() => {
        // Загрузить блюда
        this.dishes = [{
          id: '1',
          name: 'Напитки',
          dishes: [{
            id: '373',
            name: 'Кока кола'
          }, {
            id: '374',
            name: 'Фанта'
          }, {
            id: '665',
            name: 'Аква мин.'
          }]
        }, {
          id: '2',
          name: 'Салаты',
          dishes: [{
            id: '1373',
            name: 'Морковь по-корейски'
          }, {
            id: '1374',
            name: 'Армейский с квашеной капустой'
          }, {
            id: '1665',
            name: 'Баклажаны имеретинские'
          }]
        }, {
          id: '3',
          name: 'Вторые блюда',
          dishes: [{
            id: '3373',
            name: 'Рис с овощами+куриная грудка гриль'
          }, {
            id: '3374',
            name: 'Паста с сыром и зеленью+свинина в соусе BBQ'
          }, {
            id: '3665',
            name: 'Цветная капуста в яйце+рыбные тефтели терияки'
          }]
        }, {
          noCategory: true,
          id: '',
          name: '',
          dishes: [{
            id: '5373',
            name: 'Блюдо без категории 1'
          }, {
            id: '5374',
            name: 'Блюдо без категории 2'
          }, {
            id: '5665',
            name: 'Блюдо без категории 3'
          }]
        }];
        this.render();
        this.loading(false);
        this.loaded(true);
        res();
      }, 1000);
    });
    return this.loadPromise;
  },

  html: document.createElement('div'),
  rendered: ko.observable(false),

  render() {
    if (this.rendered()) return Promise.resolve();
    if (this.loading()) return this.loadPromise.then(() => {
      return this.render();
    });
    return new Promise(res => {
      ko.renderTemplate('dishes-select-template', {
        categories: this.dishes
      }, {}, this.html);
      this.rendered(true);
      res();
    });
  },

  matcher({
    term
  }, data) {
    if (!term) {
      return data;
    }

    term = term.toLowerCase();

    if (!data.id) {
      return null;
    }

    if (data.id[0] != 'c') {
      const categoryId = data.element.dataset.category;
      const category = DishesSelect.dishes.find(c => c.id === categoryId);
      if (!category) return null;
      const categoryName = category.name.toLowerCase();
      const dishText = data.text.toLowerCase();
      const match = categoryName.includes(term) || dishText.includes(term);
      return match ? data : null;
    } else {
      const category = DishesSelect.dishes.find(c => c.id === data.id.slice(1));
      if (!category) return null;
      if (!category.id) return null;
      const categoryName = category.name.toLowerCase();
      const match = categoryName.includes(term) || category.dishes.some(d => {
        return d.name.toLowerCase().includes(term);
      });
      return match ? data : null;
    }
  },

  templateSelection(state) {
    if (!state.id) {
      return state.text;
    }

    var $result = $('<span>').text(state.text);

    if (state.id[0] == 'c') {
      $result.addClass('dish-category-value');
    }

    return $result;
  },

  templateResult(state) {
    if (!state.id) {
      return state.text;
    }

    var $result = $('<span>').text(state.text);

    if (state.id[0] == 'c') {
      $result.addClass('dish-category-option');
    } else {
      $result.addClass('dish-option');
    }

    let category = state.element.dataset.category;
    if (category) $result.attr('has-category', category);
    return $result;
  },

  onChange(event) {
    var options = $(event.target).find('option').get();
    var value = $(event.target).val();

    if (value) {
      var selectedCategories = value.filter(function (v) {
        return v[0] == 'c';
      });
      var selectedOptions = value.filter(function (v) {
        return v[0] != 'c';
      });
      options.forEach(function (option) {
        var optionValue = $(option).attr('value');
        if (!optionValue) return;
        var isCategory = optionValue[0] == 'c';

        if (!isCategory) {
          var categoryId = $(option).data('category');

          if (selectedCategories.includes('c' + categoryId)) {
            if (selectedOptions.includes(optionValue)) {
              var index = selectedOptions.indexOf(optionValue);
              selectedOptions.splice(index, 1);
            }

            $(option).attr('disabled', true);
          } else {
            $(option).attr('disabled', false);

            if (selectedOptions.includes(optionValue)) {}
          }
        }
      });
      var newValue = [].concat(_toConsumableArray(selectedCategories), _toConsumableArray(selectedOptions));
      $(event.target).val(newValue).trigger('change.select2');
    }
  }

};
ko.bindingHandlers.hrmLoadDishes = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    const $element = $(element);
    let value = allBindings.get('selectedOptions');
    ko.applyBindingsToDescendants(bindingContext, element);
    DishesSelect.load().then(() => {
      DishesSelect.render().then(() => {
        const selectClone = DishesSelect.html.cloneNode(true);
        $element.append($(selectClone).children());
        let options = allBindings.get('selectedOptions');
        $element.val(options());
      });
    });
    $element.on('change.select2', () => {
      let currentVal = value();
      let newVal = $element.val();

      if (currentVal.toString() !== newVal.toString()) {
        value(newVal);
      }
    });
    return {
      controlsDescendantBindings: true
    };
  }
};
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
      this._$element.val('').trigger('change').trigger('reset');
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
            return typeof formControl == 'function' && 'isValid' in formControl && !formControl.isValid();
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

        this._$contentElement.overlayScrollbars({
          scrollbars: {
            clickScrolling: true
          },
          nativeScrollbarsOverlaid: {
            initialize: true
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
    const dropdownParent = allBindings.has('hrmSelectDropdownParent') ? allBindings.get('hrmSelectDropdownParent') : $('body');
    const templateSelection = allBindings.has('hrmSelectTemplateSelection') ? allBindings.get('hrmSelectTemplateSelection') : state => $('<span>').addClass('hrm-select__rendered-text').text(state.text);
    const templateResult = allBindings.has('hrmSelectTemplateResult') ? allBindings.get('hrmSelectTemplateResult') : null;
    const matcher = allBindings.has('hrmSelectMatcher') ? allBindings.get('hrmSelectMatcher') : null;
    const dropdownClass = allBindings.has('hrmSelectDropdownCssClass') ? allBindings.get('hrmSelectDropdownCssClass') : '';

    if (customValuesAllowed && !isMultiple && !searchEnabled) {
      throw Error('You have to enable both options "hrmSelectCustomValuesAllowed" and "hrmSelectSearchEnabled"');
    }

    const options = {
      minimumResultsForSearch: searchEnabled ? 0 : Infinity,
      language: 'ru',
      width: '100%',
      dropdownAutoWidth: true,
      dropdownCssClass: 'hrm-select__dropdown ' + dropdownClass,
      dropdownParent,
      placeholder,
      allowClear,
      tags: customValuesAllowed
    };

    if (templateSelection) {
      options.templateSelection = templateSelection;
    }

    if (templateResult) {
      options.templateResult = templateResult;
    }

    if (matcher) {
      options.matcher = matcher;
    }

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
ko.bindingHandlers.bindInner = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToDescendants(bindingContext, element);
    return {
      controlsDescendantBindings: true
    };
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

        (() => {
          $(window).on('resize', this.windowResizeHandler);
          this.windowResizeHandler();
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
            <div class="hrm-tab-group__content"">

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

      this.hideError = () => {
        this._errorTippyInstance.hide();
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
"use strict";

/**
* @version: 3.1
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2019 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: http://www.daterangepicker.com/
*/
// Following the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Make globaly available as well
    define(['moment', 'jquery'], function (moment, jquery) {
      if (!jquery.fn) jquery.fn = {}; // webpack server rendering

      if (typeof moment !== 'function' && moment.hasOwnProperty('default')) moment = moment['default'];
      return factory(moment, jquery);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node / Browserify
    //isomorphic issue
    var jQuery = typeof window != 'undefined' ? window.jQuery : undefined;

    if (!jQuery) {
      jQuery = require('jquery');
      if (!jQuery.fn) jQuery.fn = {};
    }

    var moment = typeof window != 'undefined' && typeof window.moment != 'undefined' ? window.moment : require('moment');
    module.exports = factory(moment, jQuery);
  } else {
    // Browser globals
    root.daterangepicker = factory(root.moment, root.jQuery);
  }
})(typeof window !== 'undefined' ? window : void 0, function (moment, $) {
  var DateRangePicker = function (element, options, cb) {
    //default settings for options
    this.parentEl = 'body';
    this.element = $(element);
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.minDate = false;
    this.maxDate = false;
    this.maxSpan = false;
    this.autoApply = false;
    this.singleDatePicker = false;
    this.showDropdowns = false;
    this.minYear = moment().subtract(100, 'year').format('YYYY');
    this.maxYear = moment().add(100, 'year').format('YYYY');
    this.showWeekNumbers = false;
    this.showISOWeekNumbers = false;
    this.showCustomRangeLabel = true;
    this.timePicker = false;
    this.timePicker24Hour = false;
    this.timePickerIncrement = 1;
    this.timePickerSeconds = false;
    this.linkedCalendars = true;
    this.autoUpdateInput = true;
    this.alwaysShowCalendars = true;
    this.ranges = {};
    this.opens = 'right';
    if (this.element.hasClass('pull-right')) this.opens = 'left';
    this.drops = 'down';
    if (this.element.hasClass('dropup')) this.drops = 'up';
    this.buttonClasses = 'btn btn-sm';
    this.applyButtonClasses = 'btn-primary';
    this.cancelButtonClasses = 'btn-default';
    this.locale = {
      direction: 'ltr',
      format: moment.localeData().longDateFormat('L'),
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek()
    };

    this.callback = function () {}; //some state information


    this.isShowing = false;
    this.leftCalendar = {};
    this.rightCalendar = {}; //custom options from user

    if (typeof options !== 'object' || options === null) options = {}; //allow setting options with data attributes
    //data-api options will be overwritten with custom javascript options

    options = $.extend(this.element.data(), options); //html template for the picker UI

    if (typeof options.template !== 'string' && !(options.template instanceof $)) options.template = '<div class="daterangepicker">' + '<span class="drp-selected"></span>' + '<div class="drp-calendar left">' + '<div class="calendar-table"></div>' + '<div class="calendar-time"></div>' + '</div>' + '<div class="drp-calendar right">' + '<div class="calendar-table"></div>' + '<div class="calendar-time"></div>' + '</div>' + '<div class="ranges"></div>' + '<div class="drp-buttons">' + '<button class="cancelBtn" type="button"></button>' + '<button class="applyBtn" disabled="disabled" type="button"></button> ' + '</div>' + '</div>';
    this.parentEl = options.parentEl && $(options.parentEl).length ? $(options.parentEl) : $(this.parentEl);
    this.container = $(options.template).appendTo(this.parentEl); //
    // handle all the possible options overriding defaults
    //

    if (typeof options.locale === 'object') {
      if (typeof options.locale.direction === 'string') this.locale.direction = options.locale.direction;
      if (typeof options.locale.format === 'string') this.locale.format = options.locale.format;
      if (typeof options.locale.separator === 'string') this.locale.separator = options.locale.separator;
      if (typeof options.locale.daysOfWeek === 'object') this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
      if (typeof options.locale.monthNames === 'object') this.locale.monthNames = options.locale.monthNames.slice();
      if (typeof options.locale.firstDay === 'number') this.locale.firstDay = options.locale.firstDay;
      if (typeof options.locale.applyLabel === 'string') this.locale.applyLabel = options.locale.applyLabel;
      if (typeof options.locale.cancelLabel === 'string') this.locale.cancelLabel = options.locale.cancelLabel;
      if (typeof options.locale.weekLabel === 'string') this.locale.weekLabel = options.locale.weekLabel;

      if (typeof options.locale.customRangeLabel === 'string') {
        //Support unicode chars in the custom range name.
        var elem = document.createElement('textarea');
        elem.innerHTML = options.locale.customRangeLabel;
        var rangeHtml = elem.value;
        this.locale.customRangeLabel = rangeHtml;
      }
    }

    this.container.addClass(this.locale.direction);
    if (typeof options.startDate === 'string') this.startDate = moment(options.startDate, this.locale.format);
    if (typeof options.endDate === 'string') this.endDate = moment(options.endDate, this.locale.format);
    if (typeof options.minDate === 'string') this.minDate = moment(options.minDate, this.locale.format);
    if (typeof options.maxDate === 'string') this.maxDate = moment(options.maxDate, this.locale.format);
    if (typeof options.startDate === 'object') this.startDate = moment(options.startDate);
    if (typeof options.endDate === 'object') this.endDate = moment(options.endDate);
    if (typeof options.minDate === 'object') this.minDate = moment(options.minDate);
    if (typeof options.maxDate === 'object') this.maxDate = moment(options.maxDate); // sanity check for bad options

    if (this.minDate && this.startDate.isBefore(this.minDate)) this.startDate = this.minDate.clone(); // sanity check for bad options

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) this.endDate = this.maxDate.clone();
    if (typeof options.applyButtonClasses === 'string') this.applyButtonClasses = options.applyButtonClasses;
    if (typeof options.applyClass === 'string') //backwards compat
      this.applyButtonClasses = options.applyClass;
    if (typeof options.cancelButtonClasses === 'string') this.cancelButtonClasses = options.cancelButtonClasses;
    if (typeof options.cancelClass === 'string') //backwards compat
      this.cancelButtonClasses = options.cancelClass;
    if (typeof options.maxSpan === 'object') this.maxSpan = options.maxSpan;
    if (typeof options.dateLimit === 'object') //backwards compat
      this.maxSpan = options.dateLimit;
    if (typeof options.opens === 'string') this.opens = options.opens;
    if (typeof options.drops === 'string') this.drops = options.drops;
    if (typeof options.showWeekNumbers === 'boolean') this.showWeekNumbers = options.showWeekNumbers;
    if (typeof options.showISOWeekNumbers === 'boolean') this.showISOWeekNumbers = options.showISOWeekNumbers;
    if (typeof options.buttonClasses === 'string') this.buttonClasses = options.buttonClasses;
    if (typeof options.buttonClasses === 'object') this.buttonClasses = options.buttonClasses.join(' ');
    if (typeof options.showDropdowns === 'boolean') this.showDropdowns = options.showDropdowns;
    if (typeof options.minYear === 'number') this.minYear = options.minYear;
    if (typeof options.maxYear === 'number') this.maxYear = options.maxYear;
    if (typeof options.showCustomRangeLabel === 'boolean') this.showCustomRangeLabel = options.showCustomRangeLabel;

    if (typeof options.singleDatePicker === 'boolean') {
      this.singleDatePicker = options.singleDatePicker;
      if (this.singleDatePicker) this.endDate = this.startDate.clone();
    }

    if (typeof options.timePicker === 'boolean') this.timePicker = options.timePicker;
    if (typeof options.timePickerSeconds === 'boolean') this.timePickerSeconds = options.timePickerSeconds;
    if (typeof options.timePickerIncrement === 'number') this.timePickerIncrement = options.timePickerIncrement;
    if (typeof options.timePicker24Hour === 'boolean') this.timePicker24Hour = options.timePicker24Hour;
    if (typeof options.autoApply === 'boolean') this.autoApply = options.autoApply;
    if (typeof options.autoUpdateInput === 'boolean') this.autoUpdateInput = options.autoUpdateInput;
    if (typeof options.linkedCalendars === 'boolean') this.linkedCalendars = options.linkedCalendars;
    if (typeof options.isInvalidDate === 'function') this.isInvalidDate = options.isInvalidDate;
    if (typeof options.isCustomDate === 'function') this.isCustomDate = options.isCustomDate;
    if (typeof options.alwaysShowCalendars === 'boolean') this.alwaysShowCalendars = options.alwaysShowCalendars; // update day names order to firstDay

    if (this.locale.firstDay != 0) {
      var iterator = this.locale.firstDay;

      while (iterator > 0) {
        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
        iterator--;
      }
    }

    var start, end, range; //if no start/end dates set, check if an input element contains initial values

    if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
      if ($(this.element).is(':text')) {
        var val = $(this.element).val(),
            split = val.split(this.locale.separator);
        start = end = null;

        if (split.length == 2) {
          start = moment(split[0], this.locale.format);
          end = moment(split[1], this.locale.format);
        } else if (this.singleDatePicker && val !== "") {
          start = moment(val, this.locale.format);
          end = moment(val, this.locale.format);
        }

        if (start !== null && end !== null) {
          this.setStartDate(start);
          this.setEndDate(end);
        }
      }
    }

    if (typeof options.ranges === 'object') {
      for (range in options.ranges) {
        if (typeof options.ranges[range][0] === 'string') start = moment(options.ranges[range][0], this.locale.format);else start = moment(options.ranges[range][0]);
        if (typeof options.ranges[range][1] === 'string') end = moment(options.ranges[range][1], this.locale.format);else end = moment(options.ranges[range][1]); // If the start or end date exceed those allowed by the minDate or maxSpan
        // options, shorten the range to the allowable period.

        if (this.minDate && start.isBefore(this.minDate)) start = this.minDate.clone();
        var maxDate = this.maxDate;
        if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) maxDate = start.clone().add(this.maxSpan);
        if (maxDate && end.isAfter(maxDate)) end = maxDate.clone(); // If the end of the range is before the minimum or the start of the range is
        // after the maximum, don't display this range option at all.

        if (this.minDate && end.isBefore(this.minDate, this.timepicker ? 'minute' : 'day') || maxDate && start.isAfter(maxDate, this.timepicker ? 'minute' : 'day')) continue; //Support unicode chars in the range names.

        var elem = document.createElement('textarea');
        elem.innerHTML = range;
        var rangeHtml = elem.value;
        this.ranges[rangeHtml] = [start, end];
      }

      var list = '<ul>';

      for (range in this.ranges) {
        list += '<li data-range-key="' + range + '">' + range + '</li>';
      }

      if (this.showCustomRangeLabel) {
        list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + '</li>';
      }

      list += '</ul>';
      this.container.find('.ranges').prepend(list);
    }

    if (typeof cb === 'function') {
      this.callback = cb;
    }

    if (!this.timePicker) {
      this.startDate = this.startDate.startOf('day');
      this.endDate = this.endDate.endOf('day');
      this.container.find('.calendar-time').hide();
    } //can't be used together for now


    if (this.timePicker && this.autoApply) this.autoApply = false;

    if (this.autoApply) {
      this.container.addClass('auto-apply');
    }

    if (typeof options.ranges === 'object') this.container.addClass('show-ranges');

    if (this.singleDatePicker) {
      this.container.addClass('single');
      this.container.find('.drp-calendar.left').addClass('single');
      this.container.find('.drp-calendar.left').show();
      this.container.find('.drp-calendar.right').hide();

      if (!this.timePicker && this.autoApply) {
        this.container.addClass('auto-apply');
      }
    }

    if (typeof options.ranges === 'undefined' && !this.singleDatePicker || this.alwaysShowCalendars) {
      this.container.addClass('show-calendar');
    }

    this.container.addClass('opens' + this.opens); //apply CSS classes and labels to buttons

    this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
    if (this.applyButtonClasses.length) this.container.find('.applyBtn').addClass(this.applyButtonClasses);
    if (this.cancelButtonClasses.length) this.container.find('.cancelBtn').addClass(this.cancelButtonClasses);
    this.container.find('.applyBtn').html(this.locale.applyLabel);
    this.container.find('.cancelBtn').html(this.locale.cancelLabel); //
    // event listeners
    //

    this.container.find('.drp-calendar').on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this)).on('click.daterangepicker', '.next', $.proxy(this.clickNext, this)).on('mousedown.daterangepicker', 'td.available', $.proxy(this.clickDate, this)).on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this)).on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this));
    this.container.find('.ranges').on('click.daterangepicker', 'li', $.proxy(this.clickRange, this));
    this.container.find('.drp-buttons').on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this)).on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this));

    if (this.element.is('input') || this.element.is('button')) {
      this.element.on({
        'click.daterangepicker': $.proxy(this.show, this),
        'focus.daterangepicker': $.proxy(this.show, this),
        'keyup.daterangepicker': $.proxy(this.elementChanged, this),
        'keydown.daterangepicker': $.proxy(this.keydown, this) //IE 11 compatibility

      });
    } else {
      this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
      this.element.on('keydown.daterangepicker', $.proxy(this.toggle, this));
    } //
    // if attached to a text input, set the initial value
    //


    this.updateElement();
  };

  DateRangePicker.prototype = {
    constructor: DateRangePicker,
    setStartDate: function (startDate) {
      if (typeof startDate === 'string') this.startDate = moment(startDate, this.locale.format);
      if (typeof startDate === 'object') this.startDate = moment(startDate);
      if (!this.timePicker) this.startDate = this.startDate.startOf('day');
      if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

      if (this.minDate && this.startDate.isBefore(this.minDate)) {
        this.startDate = this.minDate.clone();
        if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }

      if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
        this.startDate = this.maxDate.clone();
        if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }

      if (!this.isShowing) this.updateElement();
      this.updateMonthsInView();
    },
    setEndDate: function (endDate) {
      if (typeof endDate === 'string') this.endDate = moment(endDate, this.locale.format);
      if (typeof endDate === 'object') this.endDate = moment(endDate);
      if (!this.timePicker) this.endDate = this.endDate.endOf('day');
      if (this.timePicker && this.timePickerIncrement) this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      if (this.endDate.isBefore(this.startDate)) this.endDate = this.startDate.clone();
      if (this.maxDate && this.endDate.isAfter(this.maxDate)) this.endDate = this.maxDate.clone();
      if (this.maxSpan && this.startDate.clone().add(this.maxSpan).isBefore(this.endDate)) this.endDate = this.startDate.clone().add(this.maxSpan);
      this.previousRightTime = this.endDate.clone();
      this.container.find('.drp-selected').html(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
      if (!this.isShowing) this.updateElement();
      this.updateMonthsInView();
    },
    isInvalidDate: function () {
      return false;
    },
    isCustomDate: function () {
      return false;
    },
    updateView: function () {
      if (this.timePicker) {
        this.renderTimePicker('left');
        this.renderTimePicker('right');

        if (!this.endDate) {
          this.container.find('.right .calendar-time select').prop('disabled', true).addClass('disabled');
        } else {
          this.container.find('.right .calendar-time select').prop('disabled', false).removeClass('disabled');
        }
      }

      if (this.endDate) this.container.find('.drp-selected').html(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
      this.updateMonthsInView();
      this.updateCalendars();
      this.updateFormInputs();
    },
    updateMonthsInView: function () {
      if (this.endDate) {
        //if both dates are visible already, do nothing
        if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM')) && (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))) {
          return;
        }

        this.leftCalendar.month = this.startDate.clone().date(2);

        if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
          this.rightCalendar.month = this.endDate.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      } else {
        if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
          this.leftCalendar.month = this.startDate.clone().date(2);
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      }

      if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
        this.rightCalendar.month = this.maxDate.clone().date(2);
        this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
      }
    },
    updateCalendars: function () {
      if (this.timePicker) {
        var hour, minute, second;

        if (this.endDate) {
          hour = parseInt(this.container.find('.left .hourselect').val(), 10);
          minute = parseInt(this.container.find('.left .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
          }

          second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.left .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }
        } else {
          hour = parseInt(this.container.find('.right .hourselect').val(), 10);
          minute = parseInt(this.container.find('.right .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
          }

          second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.right .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }
        }

        this.leftCalendar.month.hour(hour).minute(minute).second(second);
        this.rightCalendar.month.hour(hour).minute(minute).second(second);
      }

      this.renderCalendar('left');
      this.renderCalendar('right'); //highlight any predefined range matching the current start and end dates

      this.container.find('.ranges li').removeClass('active');
      if (this.endDate == null) return;
      this.calculateChosenLabel();
    },
    renderCalendar: function (side) {
      //
      // Build the matrix of dates that will populate the calendar
      //
      var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
      var month = calendar.month.month();
      var year = calendar.month.year();
      var hour = calendar.month.hour();
      var minute = calendar.month.minute();
      var second = calendar.month.second();
      var daysInMonth = moment([year, month]).daysInMonth();
      var firstDay = moment([year, month, 1]);
      var lastDay = moment([year, month, daysInMonth]);
      var lastMonth = moment(firstDay).subtract(1, 'month').month();
      var lastYear = moment(firstDay).subtract(1, 'month').year();
      var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
      var dayOfWeek = firstDay.day(); //initialize a 6 rows x 7 columns array for the calendar

      var calendar = [];
      calendar.firstDay = firstDay;
      calendar.lastDay = lastDay;

      for (var i = 0; i < 6; i++) {
        calendar[i] = [];
      } //populate the calendar with date objects


      var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
      if (startDay > daysInLastMonth) startDay -= 7;
      if (dayOfWeek == this.locale.firstDay) startDay = daysInLastMonth - 6;
      var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
      var col, row;

      for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
        if (i > 0 && col % 7 === 0) {
          col = 0;
          row++;
        }

        calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
        curDate.hour(12);

        if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
          calendar[row][col] = this.minDate.clone();
        }

        if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
          calendar[row][col] = this.maxDate.clone();
        }
      } //make the calendar object available to hoverDate/clickDate


      if (side == 'left') {
        this.leftCalendar.calendar = calendar;
      } else {
        this.rightCalendar.calendar = calendar;
      } //
      // Display the calendar
      //


      var minDate = side == 'left' ? this.minDate : this.startDate;
      var maxDate = this.maxDate;
      var selected = side == 'left' ? this.startDate : this.endDate;
      var arrow = this.locale.direction == 'ltr' ? {
        left: 'chevron-left',
        right: 'chevron-right'
      } : {
        left: 'chevron-right',
        right: 'chevron-left'
      };
      var html = '<table class="table-condensed">';
      html += '<thead>';
      html += '<tr>'; // add empty cell for week number

      if (this.showWeekNumbers || this.showISOWeekNumbers) html += '<th></th>';

      if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
        html += '<th class="prev available"><span></span></th>';
      } else {
        html += '<th></th>';
      }

      var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

      if (this.showDropdowns) {
        var currentMonth = calendar[1][1].month();
        var currentYear = calendar[1][1].year();
        var maxYear = maxDate && maxDate.year() || this.maxYear;
        var minYear = minDate && minDate.year() || this.minYear;
        var inMinYear = currentYear == minYear;
        var inMaxYear = currentYear == maxYear;
        var monthHtml = '<select class="monthselect">';

        for (var m = 0; m < 12; m++) {
          if ((!inMinYear || minDate && m >= minDate.month()) && (!inMaxYear || maxDate && m <= maxDate.month())) {
            monthHtml += "<option value='" + m + "'" + (m === currentMonth ? " selected='selected'" : "") + ">" + this.locale.monthNames[m] + "</option>";
          } else {
            monthHtml += "<option value='" + m + "'" + (m === currentMonth ? " selected='selected'" : "") + " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
          }
        }

        monthHtml += "</select>";
        var yearHtml = '<select class="yearselect">';

        for (var y = minYear; y <= maxYear; y++) {
          yearHtml += '<option value="' + y + '"' + (y === currentYear ? ' selected="selected"' : '') + '>' + y + '</option>';
        }

        yearHtml += '</select>';
        dateHtml = monthHtml + yearHtml;
      }

      html += '<th colspan="5" class="month">' + dateHtml + '</th>';

      if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
        html += '<th class="next available"><span></span></th>';
      } else {
        html += '<th></th>';
      }

      html += '</tr>';
      html += '<tr>'; // add week number label

      if (this.showWeekNumbers || this.showISOWeekNumbers) html += '<th class="week">' + this.locale.weekLabel + '</th>';
      $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
        html += '<th>' + dayOfWeek + '</th>';
      });
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>'; //adjust maxDate to reflect the maxSpan setting in order to
      //grey out end dates beyond the maxSpan

      if (this.endDate == null && this.maxSpan) {
        var maxLimit = this.startDate.clone().add(this.maxSpan).endOf('day');

        if (!maxDate || maxLimit.isBefore(maxDate)) {
          maxDate = maxLimit;
        }
      }

      for (var row = 0; row < 6; row++) {
        html += '<tr>'; // add week number

        if (this.showWeekNumbers) html += '<td class="week">' + calendar[row][0].week() + '</td>';else if (this.showISOWeekNumbers) html += '<td class="week">' + calendar[row][0].isoWeek() + '</td>';

        for (var col = 0; col < 7; col++) {
          var classes = []; //highlight today's date

          if (calendar[row][col].isSame(new Date(), "day")) classes.push('today'); //highlight weekends

          if (calendar[row][col].isoWeekday() > 5) classes.push('weekend'); //grey out the dates in other months displayed at beginning and end of this calendar

          if (calendar[row][col].month() != calendar[1][1].month()) classes.push('off', 'ends'); //don't allow selection of dates before the minimum date

          if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) classes.push('off', 'disabled'); //don't allow selection of dates after the maximum date

          if (maxDate && calendar[row][col].isAfter(maxDate, 'day')) classes.push('off', 'disabled'); //don't allow selection of date if a custom function decides it's invalid

          if (this.isInvalidDate(calendar[row][col])) classes.push('off', 'disabled'); //highlight the currently selected start date

          if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD')) classes.push('active', 'start-date'); //highlight the currently selected end date

          if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD')) classes.push('active', 'end-date'); //highlight dates in-between the selected dates

          if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) classes.push('in-range'); //apply custom classes for this date

          var isCustom = this.isCustomDate(calendar[row][col]);

          if (isCustom !== false) {
            if (typeof isCustom === 'string') classes.push(isCustom);else Array.prototype.push.apply(classes, isCustom);
          }

          var cname = '',
              disabled = false;

          for (var i = 0; i < classes.length; i++) {
            cname += classes[i] + ' ';
            if (classes[i] == 'disabled') disabled = true;
          }

          if (!disabled) cname += 'available';
          html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';
        }

        html += '</tr>';
      }

      html += '</tbody>';
      html += '</table>';
      this.container.find('.drp-calendar.' + side + ' .calendar-table').html(html);
    },
    renderTimePicker: function (side) {
      // Don't bother updating the time picker if it's currently disabled
      // because an end date hasn't been clicked yet
      if (side == 'right' && !this.endDate) return;
      var html,
          selected,
          minDate,
          maxDate = this.maxDate;
      if (this.maxSpan && (!this.maxDate || this.startDate.clone().add(this.maxSpan).isBefore(this.maxDate))) maxDate = this.startDate.clone().add(this.maxSpan);

      if (side == 'left') {
        selected = this.startDate.clone();
        minDate = this.minDate;
      } else if (side == 'right') {
        selected = this.endDate.clone();
        minDate = this.startDate; //Preserve the time already selected

        var timeSelector = this.container.find('.drp-calendar.right .calendar-time');

        if (timeSelector.html() != '') {
          selected.hour(!isNaN(selected.hour()) ? selected.hour() : timeSelector.find('.hourselect option:selected').val());
          selected.minute(!isNaN(selected.minute()) ? selected.minute() : timeSelector.find('.minuteselect option:selected').val());
          selected.second(!isNaN(selected.second()) ? selected.second() : timeSelector.find('.secondselect option:selected').val());

          if (!this.timePicker24Hour) {
            var ampm = timeSelector.find('.ampmselect option:selected').val();
            if (ampm === 'PM' && selected.hour() < 12) selected.hour(selected.hour() + 12);
            if (ampm === 'AM' && selected.hour() === 12) selected.hour(0);
          }
        }

        if (selected.isBefore(this.startDate)) selected = this.startDate.clone();
        if (maxDate && selected.isAfter(maxDate)) selected = maxDate.clone();
      } //
      // hours
      //


      html = '<select class="hourselect">';
      var start = this.timePicker24Hour ? 0 : 1;
      var end = this.timePicker24Hour ? 23 : 12;

      for (var i = start; i <= end; i++) {
        var i_in_24 = i;
        if (!this.timePicker24Hour) i_in_24 = selected.hour() >= 12 ? i == 12 ? 12 : i + 12 : i == 12 ? 0 : i;
        var time = selected.clone().hour(i_in_24);
        var disabled = false;
        if (minDate && time.minute(59).isBefore(minDate)) disabled = true;
        if (maxDate && time.minute(0).isAfter(maxDate)) disabled = true;

        if (i_in_24 == selected.hour() && !disabled) {
          html += '<option value="' + i + '" selected="selected">' + i + '</option>';
        } else if (disabled) {
          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
        } else {
          html += '<option value="' + i + '">' + i + '</option>';
        }
      }

      html += '</select> '; //
      // minutes
      //

      html += ': <select class="minuteselect">';

      for (var i = 0; i < 60; i += this.timePickerIncrement) {
        var padded = i < 10 ? '0' + i : i;
        var time = selected.clone().minute(i);
        var disabled = false;
        if (minDate && time.second(59).isBefore(minDate)) disabled = true;
        if (maxDate && time.second(0).isAfter(maxDate)) disabled = true;

        if (selected.minute() == i && !disabled) {
          html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
        } else if (disabled) {
          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
        } else {
          html += '<option value="' + i + '">' + padded + '</option>';
        }
      }

      html += '</select> '; //
      // seconds
      //

      if (this.timePickerSeconds) {
        html += ': <select class="secondselect">';

        for (var i = 0; i < 60; i++) {
          var padded = i < 10 ? '0' + i : i;
          var time = selected.clone().second(i);
          var disabled = false;
          if (minDate && time.isBefore(minDate)) disabled = true;
          if (maxDate && time.isAfter(maxDate)) disabled = true;

          if (selected.second() == i && !disabled) {
            html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
          } else if (disabled) {
            html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
          } else {
            html += '<option value="' + i + '">' + padded + '</option>';
          }
        }

        html += '</select> ';
      } //
      // AM/PM
      //


      if (!this.timePicker24Hour) {
        html += '<select class="ampmselect">';
        var am_html = '';
        var pm_html = '';
        if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) am_html = ' disabled="disabled" class="disabled"';
        if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) pm_html = ' disabled="disabled" class="disabled"';

        if (selected.hour() >= 12) {
          html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
        } else {
          html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
        }

        html += '</select>';
      }

      this.container.find('.drp-calendar.' + side + ' .calendar-time').html(html);
    },
    updateFormInputs: function () {
      if (this.singleDatePicker || this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate))) {
        this.container.find('button.applyBtn').prop('disabled', false);
      } else {
        this.container.find('button.applyBtn').prop('disabled', true);
      }
    },
    move: function () {
      var parentOffset = {
        top: 0,
        left: 0
      },
          containerTop,
          drops = this.drops;
      var parentRightEdge = $(window).width();

      if (!this.parentEl.is('body')) {
        parentOffset = {
          top: this.parentEl.offset().top - this.parentEl.scrollTop(),
          left: this.parentEl.offset().left - this.parentEl.scrollLeft()
        };
        parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
      }

      switch (drops) {
        case 'auto':
          containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;

          if (containerTop + this.container.outerHeight() >= this.parentEl[0].scrollHeight) {
            containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            drops = 'up';
          }

          break;

        case 'up':
          containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
          break;

        default:
          containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
          break;
      } // Force the container to it's actual width


      this.container.css({
        top: 0,
        left: 0,
        right: 'auto'
      });
      var containerWidth = this.container.outerWidth();
      this.container.toggleClass('drop-up', drops == 'up');

      if (this.opens == 'left') {
        var containerRight = parentRightEdge - this.element.offset().left - this.element.outerWidth();

        if (containerWidth + containerRight > $(window).width()) {
          this.container.css({
            top: containerTop,
            right: 'auto',
            left: 9
          });
        } else {
          this.container.css({
            top: containerTop,
            right: containerRight,
            left: 'auto'
          });
        }
      } else if (this.opens == 'center') {
        var containerLeft = this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2 - containerWidth / 2;

        if (containerLeft < 0) {
          this.container.css({
            top: containerTop,
            right: 'auto',
            left: 9
          });
        } else if (containerLeft + containerWidth > $(window).width()) {
          this.container.css({
            top: containerTop,
            left: 'auto',
            right: 0
          });
        } else {
          this.container.css({
            top: containerTop,
            left: containerLeft,
            right: 'auto'
          });
        }
      } else {
        var containerLeft = this.element.offset().left - parentOffset.left;

        if (containerLeft + containerWidth > $(window).width()) {
          this.container.css({
            top: containerTop,
            left: 'auto',
            right: 0
          });
        } else {
          this.container.css({
            top: containerTop,
            left: containerLeft,
            right: 'auto'
          });
        }
      }
    },
    show: function (e) {
      if (this.isShowing) return; // Create a click proxy that is private to this instance of datepicker, for unbinding

      this._outsideClickProxy = $.proxy(function (e) {
        this.outsideClick(e);
      }, this); // Bind global datepicker mousedown for hiding and

      $(document).on('mousedown.daterangepicker', this._outsideClickProxy) // also support mobile devices
      .on('touchend.daterangepicker', this._outsideClickProxy) // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
      .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy) // and also close when focus changes to outside the picker (eg. tabbing between controls)
      .on('focusin.daterangepicker', this._outsideClickProxy); // Reposition the picker if the window is resized while it's open

      $(window).on('resize.daterangepicker', $.proxy(function (e) {
        this.move(e);
      }, this));
      this.oldStartDate = this.startDate.clone();
      this.oldEndDate = this.endDate.clone();
      this.previousRightTime = this.endDate.clone();
      this.updateView();
      this.container.show();
      this.move();
      this.element.trigger('show.daterangepicker', this);
      this.isShowing = true;
    },
    hide: function (e) {
      if (!this.isShowing) return; //incomplete date selection, revert to last values

      if (!this.endDate) {
        this.startDate = this.oldStartDate.clone();
        this.endDate = this.oldEndDate.clone();
      } //if a new date range was selected, invoke the user callback function


      if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)) this.callback(this.startDate.clone(), this.endDate.clone(), this.chosenLabel); //if picker is attached to a text input, update it

      this.updateElement();
      $(document).off('.daterangepicker');
      $(window).off('.daterangepicker');
      this.container.hide();
      this.element.trigger('hide.daterangepicker', this);
      this.isShowing = false;
    },
    toggle: function (e) {
      if (this.isShowing) {
        this.hide();
      } else {
        this.show();
      }
    },
    outsideClick: function (e) {
      var target = $(e.target); // if the page is clicked anywhere except within the daterangerpicker/button
      // itself then call this.hide()

      if ( // ie modal dialog fix
      e.type == "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest('.calendar-table').length) return;
      this.hide();
      this.element.trigger('outsideClick.daterangepicker', this);
    },
    showCalendars: function () {
      this.container.addClass('show-calendar');
      this.move();
      this.element.trigger('showCalendar.daterangepicker', this);
    },
    hideCalendars: function () {
      this.container.removeClass('show-calendar');
      this.element.trigger('hideCalendar.daterangepicker', this);
    },
    clickRange: function (e) {
      var label = e.target.getAttribute('data-range-key');
      this.chosenLabel = label;

      if (label == this.locale.customRangeLabel) {
        this.showCalendars();
      } else {
        var dates = this.ranges[label];
        this.startDate = dates[0];
        this.endDate = dates[1];

        if (!this.timePicker) {
          this.startDate.startOf('day');
          this.endDate.endOf('day');
        }

        if (!this.alwaysShowCalendars) this.hideCalendars();
        this.clickApply();
      }
    },
    clickPrev: function (e) {
      var cal = $(e.target).parents('.drp-calendar');

      if (cal.hasClass('left')) {
        this.leftCalendar.month.subtract(1, 'month');
        if (this.linkedCalendars) this.rightCalendar.month.subtract(1, 'month');
      } else {
        this.rightCalendar.month.subtract(1, 'month');
      }

      this.updateCalendars();
    },
    clickNext: function (e) {
      var cal = $(e.target).parents('.drp-calendar');

      if (cal.hasClass('left')) {
        this.leftCalendar.month.add(1, 'month');
      } else {
        this.rightCalendar.month.add(1, 'month');
        if (this.linkedCalendars) this.leftCalendar.month.add(1, 'month');
      }

      this.updateCalendars();
    },
    hoverDate: function (e) {
      //ignore dates that can't be selected
      if (!$(e.target).hasClass('available')) return;
      var title = $(e.target).attr('data-title');
      var row = title.substr(1, 1);
      var col = title.substr(3, 1);
      var cal = $(e.target).parents('.drp-calendar');
      var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col]; //highlight the dates between the start date and the date being hovered as a potential end date

      var leftCalendar = this.leftCalendar;
      var rightCalendar = this.rightCalendar;
      var startDate = this.startDate;

      if (!this.endDate) {
        this.container.find('.drp-calendar tbody td').each(function (index, el) {
          //skip week numbers, only look at dates
          if ($(el).hasClass('week')) return;
          var title = $(el).attr('data-title');
          var row = title.substr(1, 1);
          var col = title.substr(3, 1);
          var cal = $(el).parents('.drp-calendar');
          var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

          if (dt.isAfter(startDate) && dt.isBefore(date) || dt.isSame(date, 'day')) {
            $(el).addClass('in-range');
          } else {
            $(el).removeClass('in-range');
          }
        });
      }
    },
    clickDate: function (e) {
      if (!$(e.target).hasClass('available')) return;
      var title = $(e.target).attr('data-title');
      var row = title.substr(1, 1);
      var col = title.substr(3, 1);
      var cal = $(e.target).parents('.drp-calendar');
      var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col]; //
      // this function needs to do a few things:
      // * alternate between selecting a start and end date for the range,
      // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
      // * if autoapply is enabled, and an end date was chosen, apply the selection
      // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
      // * if one of the inputs above the calendars was focused, cancel that manual input
      //

      if (this.endDate || date.isBefore(this.startDate, 'day')) {
        //picking start
        if (this.timePicker) {
          var hour = parseInt(this.container.find('.left .hourselect').val(), 10);

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.left .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }

          var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
          }

          var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
          date = date.clone().hour(hour).minute(minute).second(second);
        }

        this.endDate = null;
        this.setStartDate(date.clone());
      } else if (!this.endDate && date.isBefore(this.startDate)) {
        //special case: clicking the same date for start/end,
        //but the time of the end date is before the start date
        this.setEndDate(this.startDate.clone());
      } else {
        // picking end
        if (this.timePicker) {
          var hour = parseInt(this.container.find('.right .hourselect').val(), 10);

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.right .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }

          var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
          }

          var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
          date = date.clone().hour(hour).minute(minute).second(second);
        }

        this.setEndDate(date.clone());

        if (this.autoApply) {
          this.calculateChosenLabel();
          this.clickApply();
        }
      }

      if (this.singleDatePicker) {
        this.setEndDate(this.startDate);
        if (!this.timePicker && this.autoApply) this.clickApply();
      }

      this.updateView(); //This is to cancel the blur event handler if the mouse was in one of the inputs

      e.stopPropagation();
    },
    calculateChosenLabel: function () {
      var customRange = true;
      var i = 0;

      for (var range in this.ranges) {
        if (this.timePicker) {
          var format = this.timePickerSeconds ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm"; //ignore times when comparing dates if time picker seconds is not enabled

          if (this.startDate.format(format) == this.ranges[range][0].format(format) && this.endDate.format(format) == this.ranges[range][1].format(format)) {
            customRange = false;
            this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').attr('data-range-key');
            break;
          }
        } else {
          //ignore times when comparing dates if time picker is not enabled
          if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
            customRange = false;
            this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').attr('data-range-key');
            break;
          }
        }

        i++;
      }

      if (customRange) {
        if (this.showCustomRangeLabel) {
          this.chosenLabel = this.container.find('.ranges li:last').addClass('active').attr('data-range-key');
        } else {
          this.chosenLabel = null;
        }

        this.showCalendars();
      }
    },
    clickApply: function (e) {
      this.hide();
      this.element.trigger('apply.daterangepicker', this);
    },
    clickCancel: function (e) {
      this.startDate = moment().subtract(1, 'days');
      this.endDate = moment().subtract(1, 'days');
      this.hide();
      this.element.trigger('cancel.daterangepicker', this);
    },
    monthOrYearChanged: function (e) {
      var isLeft = $(e.target).closest('.drp-calendar').hasClass('left'),
          leftOrRight = isLeft ? 'left' : 'right',
          cal = this.container.find('.drp-calendar.' + leftOrRight); // Month must be Number for new moment versions

      var month = parseInt(cal.find('.monthselect').val(), 10);
      var year = cal.find('.yearselect').val();

      if (!isLeft) {
        if (year < this.startDate.year() || year == this.startDate.year() && month < this.startDate.month()) {
          month = this.startDate.month();
          year = this.startDate.year();
        }
      }

      if (this.minDate) {
        if (year < this.minDate.year() || year == this.minDate.year() && month < this.minDate.month()) {
          month = this.minDate.month();
          year = this.minDate.year();
        }
      }

      if (this.maxDate) {
        if (year > this.maxDate.year() || year == this.maxDate.year() && month > this.maxDate.month()) {
          month = this.maxDate.month();
          year = this.maxDate.year();
        }
      }

      if (isLeft) {
        this.leftCalendar.month.month(month).year(year);
        if (this.linkedCalendars) this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
      } else {
        this.rightCalendar.month.month(month).year(year);
        if (this.linkedCalendars) this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
      }

      this.updateCalendars();
    },
    timeChanged: function (e) {
      var cal = $(e.target).closest('.drp-calendar'),
          isLeft = cal.hasClass('left');
      var hour = parseInt(cal.find('.hourselect').val(), 10);
      var minute = parseInt(cal.find('.minuteselect').val(), 10);

      if (isNaN(minute)) {
        minute = parseInt(cal.find('.minuteselect option:last').val(), 10);
      }

      var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;

      if (!this.timePicker24Hour) {
        var ampm = cal.find('.ampmselect').val();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
      }

      if (isLeft) {
        var start = this.startDate.clone();
        start.hour(hour);
        start.minute(minute);
        start.second(second);
        this.setStartDate(start);

        if (this.singleDatePicker) {
          this.endDate = this.startDate.clone();
        } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
          this.setEndDate(start.clone());
        }
      } else if (this.endDate) {
        var end = this.endDate.clone();
        end.hour(hour);
        end.minute(minute);
        end.second(second);
        this.setEndDate(end);
      } //update the calendars so all clickable dates reflect the new time component


      this.updateCalendars(); //update the form inputs above the calendars with the new time

      this.updateFormInputs(); //re-render the time pickers because changing one selection can affect what's enabled in another

      this.renderTimePicker('left');
      this.renderTimePicker('right');
    },
    elementChanged: function () {
      if (!this.element.is('input')) return;
      if (!this.element.val().length) return;
      var dateString = this.element.val().split(this.locale.separator),
          start = null,
          end = null;

      if (dateString.length === 2) {
        start = moment(dateString[0], this.locale.format);
        end = moment(dateString[1], this.locale.format);
      }

      if (this.singleDatePicker || start === null || end === null) {
        start = moment(this.element.val(), this.locale.format);
        end = start;
      }

      if (!start.isValid() || !end.isValid()) return;
      this.setStartDate(start);
      this.setEndDate(end);
      this.updateView();
    },
    keydown: function (e) {
      //hide on tab or enter
      if (e.keyCode === 9 || e.keyCode === 13) {
        this.hide();
      } //hide on esc and prevent propagation


      if (e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
      }
    },
    updateElement: function () {
      if (this.element.is('input') && this.autoUpdateInput) {
        var newValue = this.startDate.format(this.locale.format);

        if (!this.singleDatePicker) {
          newValue += this.locale.separator + this.endDate.format(this.locale.format);
        }

        if (newValue !== this.element.val()) {
          this.element.val(newValue).trigger('change');
        }
      }
    },
    remove: function () {
      this.container.remove();
      this.element.off('.daterangepicker');
      this.element.removeData();
    }
  };

  $.fn.daterangepicker = function (options, callback) {
    var implementOptions = $.extend(true, {}, $.fn.daterangepicker.defaultOptions, options);
    this.each(function () {
      var el = $(this);
      if (el.data('daterangepicker')) el.data('daterangepicker').remove();
      el.data('daterangepicker', new DateRangePicker(el, implementOptions, callback));
    });
    return this;
  };

  return DateRangePicker;
});
"use strict";

/**
* @version: 3.1
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2019 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: http://www.daterangepicker.com/
*/
// Following the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Make globaly available as well
    define(['moment', 'jquery'], function (moment, jquery) {
      if (!jquery.fn) jquery.fn = {}; // webpack server rendering

      if (typeof moment !== 'function' && moment.hasOwnProperty('default')) moment = moment['default'];
      return factory(moment, jquery);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node / Browserify
    //isomorphic issue
    var jQuery = typeof window != 'undefined' ? window.jQuery : undefined;

    if (!jQuery) {
      jQuery = require('jquery');
      if (!jQuery.fn) jQuery.fn = {};
    }

    var moment = typeof window != 'undefined' && typeof window.moment != 'undefined' ? window.moment : require('moment');
    module.exports = factory(moment, jQuery);
  } else {
    // Browser globals
    root.daterangepicker = factory(root.moment, root.jQuery);
  }
})(typeof window !== 'undefined' ? window : void 0, function (moment, $) {
  var DateRangePicker = function (element, options, cb) {
    //default settings for options
    this.parentEl = 'body';
    this.element = $(element);
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.minDate = false;
    this.maxDate = false;
    this.maxSpan = false;
    this.autoApply = false;
    this.singleDatePicker = false;
    this.showDropdowns = false;
    this.minYear = moment().subtract(100, 'year').format('YYYY');
    this.maxYear = moment().add(100, 'year').format('YYYY');
    this.showWeekNumbers = false;
    this.showISOWeekNumbers = false;
    this.showCustomRangeLabel = true;
    this.timePicker = false;
    this.timePicker24Hour = false;
    this.timePickerIncrement = 1;
    this.timePickerSeconds = false;
    this.linkedCalendars = true;
    this.autoUpdateInput = true;
    this.alwaysShowCalendars = true;
    this.ranges = {};
    this.opens = 'right';
    if (this.element.hasClass('pull-right')) this.opens = 'left';
    this.drops = 'down';
    if (this.element.hasClass('dropup')) this.drops = 'up';
    this.buttonClasses = 'btn btn-sm';
    this.applyButtonClasses = 'btn-primary';
    this.cancelButtonClasses = 'btn-default';
    this.locale = {
      direction: 'ltr',
      format: moment.localeData().longDateFormat('L'),
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek()
    };

    this.callback = function () {}; //some state information


    this.isShowing = false;
    this.leftCalendar = {};
    this.rightCalendar = {}; //custom options from user

    if (typeof options !== 'object' || options === null) options = {}; //allow setting options with data attributes
    //data-api options will be overwritten with custom javascript options

    options = $.extend(this.element.data(), options); //html template for the picker UI

    if (typeof options.template !== 'string' && !(options.template instanceof $)) options.template = '<div class="daterangepicker">' + '<span class="drp-selected"></span>' + '<div class="drp-calendar left">' + '<div class="calendar-table"></div>' + '<div class="calendar-time"></div>' + '</div>' + '<div class="drp-calendar right">' + '<div class="calendar-table"></div>' + '<div class="calendar-time"></div>' + '</div>' + '<div class="ranges"></div>' + '<div class="drp-buttons">' + '<button class="cancelBtn" type="button"></button>' + '<button class="applyBtn" disabled="disabled" type="button"></button> ' + '</div>' + '</div>';
    this.parentEl = options.parentEl && $(options.parentEl).length ? $(options.parentEl) : $(this.parentEl);
    this.container = $(options.template).appendTo(this.parentEl); //
    // handle all the possible options overriding defaults
    //

    if (typeof options.locale === 'object') {
      if (typeof options.locale.direction === 'string') this.locale.direction = options.locale.direction;
      if (typeof options.locale.format === 'string') this.locale.format = options.locale.format;
      if (typeof options.locale.separator === 'string') this.locale.separator = options.locale.separator;
      if (typeof options.locale.daysOfWeek === 'object') this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
      if (typeof options.locale.monthNames === 'object') this.locale.monthNames = options.locale.monthNames.slice();
      if (typeof options.locale.firstDay === 'number') this.locale.firstDay = options.locale.firstDay;
      if (typeof options.locale.applyLabel === 'string') this.locale.applyLabel = options.locale.applyLabel;
      if (typeof options.locale.cancelLabel === 'string') this.locale.cancelLabel = options.locale.cancelLabel;
      if (typeof options.locale.weekLabel === 'string') this.locale.weekLabel = options.locale.weekLabel;

      if (typeof options.locale.customRangeLabel === 'string') {
        //Support unicode chars in the custom range name.
        var elem = document.createElement('textarea');
        elem.innerHTML = options.locale.customRangeLabel;
        var rangeHtml = elem.value;
        this.locale.customRangeLabel = rangeHtml;
      }
    }

    this.container.addClass(this.locale.direction);
    if (typeof options.startDate === 'string') this.startDate = moment(options.startDate, this.locale.format);
    if (typeof options.endDate === 'string') this.endDate = moment(options.endDate, this.locale.format);
    if (typeof options.minDate === 'string') this.minDate = moment(options.minDate, this.locale.format);
    if (typeof options.maxDate === 'string') this.maxDate = moment(options.maxDate, this.locale.format);
    if (typeof options.startDate === 'object') this.startDate = moment(options.startDate);
    if (typeof options.endDate === 'object') this.endDate = moment(options.endDate);
    if (typeof options.minDate === 'object') this.minDate = moment(options.minDate);
    if (typeof options.maxDate === 'object') this.maxDate = moment(options.maxDate); // sanity check for bad options

    if (this.minDate && this.startDate.isBefore(this.minDate)) this.startDate = this.minDate.clone(); // sanity check for bad options

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) this.endDate = this.maxDate.clone();
    if (typeof options.applyButtonClasses === 'string') this.applyButtonClasses = options.applyButtonClasses;
    if (typeof options.applyClass === 'string') //backwards compat
      this.applyButtonClasses = options.applyClass;
    if (typeof options.cancelButtonClasses === 'string') this.cancelButtonClasses = options.cancelButtonClasses;
    if (typeof options.cancelClass === 'string') //backwards compat
      this.cancelButtonClasses = options.cancelClass;
    if (typeof options.maxSpan === 'object') this.maxSpan = options.maxSpan;
    if (typeof options.dateLimit === 'object') //backwards compat
      this.maxSpan = options.dateLimit;
    if (typeof options.opens === 'string') this.opens = options.opens;
    if (typeof options.drops === 'string') this.drops = options.drops;
    if (typeof options.showWeekNumbers === 'boolean') this.showWeekNumbers = options.showWeekNumbers;
    if (typeof options.showISOWeekNumbers === 'boolean') this.showISOWeekNumbers = options.showISOWeekNumbers;
    if (typeof options.buttonClasses === 'string') this.buttonClasses = options.buttonClasses;
    if (typeof options.buttonClasses === 'object') this.buttonClasses = options.buttonClasses.join(' ');
    if (typeof options.showDropdowns === 'boolean') this.showDropdowns = options.showDropdowns;
    if (typeof options.minYear === 'number') this.minYear = options.minYear;
    if (typeof options.maxYear === 'number') this.maxYear = options.maxYear;
    if (typeof options.showCustomRangeLabel === 'boolean') this.showCustomRangeLabel = options.showCustomRangeLabel;

    if (typeof options.singleDatePicker === 'boolean') {
      this.singleDatePicker = options.singleDatePicker;
      if (this.singleDatePicker) this.endDate = this.startDate.clone();
    }

    if (typeof options.timePicker === 'boolean') this.timePicker = options.timePicker;
    if (typeof options.timePickerSeconds === 'boolean') this.timePickerSeconds = options.timePickerSeconds;
    if (typeof options.timePickerIncrement === 'number') this.timePickerIncrement = options.timePickerIncrement;
    if (typeof options.timePicker24Hour === 'boolean') this.timePicker24Hour = options.timePicker24Hour;
    if (typeof options.autoApply === 'boolean') this.autoApply = options.autoApply;
    if (typeof options.autoUpdateInput === 'boolean') this.autoUpdateInput = options.autoUpdateInput;
    if (typeof options.linkedCalendars === 'boolean') this.linkedCalendars = options.linkedCalendars;
    if (typeof options.isInvalidDate === 'function') this.isInvalidDate = options.isInvalidDate;
    if (typeof options.isCustomDate === 'function') this.isCustomDate = options.isCustomDate;
    if (typeof options.alwaysShowCalendars === 'boolean') this.alwaysShowCalendars = options.alwaysShowCalendars; // update day names order to firstDay

    if (this.locale.firstDay != 0) {
      var iterator = this.locale.firstDay;

      while (iterator > 0) {
        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
        iterator--;
      }
    }

    var start, end, range; //if no start/end dates set, check if an input element contains initial values

    if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
      if ($(this.element).is(':text')) {
        var val = $(this.element).val(),
            split = val.split(this.locale.separator);
        start = end = null;

        if (split.length == 2) {
          start = moment(split[0], this.locale.format);
          end = moment(split[1], this.locale.format);
        } else if (this.singleDatePicker && val !== "") {
          start = moment(val, this.locale.format);
          end = moment(val, this.locale.format);
        }

        if (start !== null && end !== null) {
          this.setStartDate(start);
          this.setEndDate(end);
        }
      }
    }

    if (typeof options.ranges === 'object') {
      for (range in options.ranges) {
        if (typeof options.ranges[range][0] === 'string') start = moment(options.ranges[range][0], this.locale.format);else start = moment(options.ranges[range][0]);
        if (typeof options.ranges[range][1] === 'string') end = moment(options.ranges[range][1], this.locale.format);else end = moment(options.ranges[range][1]); // If the start or end date exceed those allowed by the minDate or maxSpan
        // options, shorten the range to the allowable period.

        if (this.minDate && start.isBefore(this.minDate)) start = this.minDate.clone();
        var maxDate = this.maxDate;
        if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) maxDate = start.clone().add(this.maxSpan);
        if (maxDate && end.isAfter(maxDate)) end = maxDate.clone(); // If the end of the range is before the minimum or the start of the range is
        // after the maximum, don't display this range option at all.

        if (this.minDate && end.isBefore(this.minDate, this.timepicker ? 'minute' : 'day') || maxDate && start.isAfter(maxDate, this.timepicker ? 'minute' : 'day')) continue; //Support unicode chars in the range names.

        var elem = document.createElement('textarea');
        elem.innerHTML = range;
        var rangeHtml = elem.value;
        this.ranges[rangeHtml] = [start, end];
      }

      var list = '<ul>';

      for (range in this.ranges) {
        list += '<li data-range-key="' + range + '">' + range + '</li>';
      }

      if (this.showCustomRangeLabel) {
        list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + '</li>';
      }

      list += '</ul>';
      this.container.find('.ranges').prepend(list);
    }

    if (typeof cb === 'function') {
      this.callback = cb;
    }

    if (!this.timePicker) {
      this.startDate = this.startDate.startOf('day');
      this.endDate = this.endDate.endOf('day');
      this.container.find('.calendar-time').hide();
    } //can't be used together for now


    if (this.timePicker && this.autoApply) this.autoApply = false;

    if (this.autoApply) {
      this.container.addClass('auto-apply');
    }

    if (typeof options.ranges === 'object') this.container.addClass('show-ranges');

    if (this.singleDatePicker) {
      this.container.addClass('single');
      this.container.find('.drp-calendar.left').addClass('single');
      this.container.find('.drp-calendar.left').show();
      this.container.find('.drp-calendar.right').hide();

      if (!this.timePicker && this.autoApply) {
        this.container.addClass('auto-apply');
      }
    }

    if (typeof options.ranges === 'undefined' && !this.singleDatePicker || this.alwaysShowCalendars) {
      this.container.addClass('show-calendar');
    }

    this.container.addClass('opens' + this.opens); //apply CSS classes and labels to buttons

    this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
    if (this.applyButtonClasses.length) this.container.find('.applyBtn').addClass(this.applyButtonClasses);
    if (this.cancelButtonClasses.length) this.container.find('.cancelBtn').addClass(this.cancelButtonClasses);
    this.container.find('.applyBtn').html(this.locale.applyLabel);
    this.container.find('.cancelBtn').html(this.locale.cancelLabel); //
    // event listeners
    //

    this.container.find('.drp-calendar').on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this)).on('click.daterangepicker', '.next', $.proxy(this.clickNext, this)).on('mousedown.daterangepicker', 'td.available', $.proxy(this.clickDate, this)).on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this)).on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this));
    this.container.find('.ranges').on('click.daterangepicker', 'li', $.proxy(this.clickRange, this));
    this.container.find('.drp-buttons').on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this)).on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this));

    if (this.element.is('input') || this.element.is('button')) {
      this.element.on({
        'click.daterangepicker': $.proxy(this.show, this),
        'focus.daterangepicker': $.proxy(this.show, this),
        'keyup.daterangepicker': $.proxy(this.elementChanged, this),
        'keydown.daterangepicker': $.proxy(this.keydown, this) //IE 11 compatibility

      });
    } else {
      this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
      this.element.on('keydown.daterangepicker', $.proxy(this.toggle, this));
    } //
    // if attached to a text input, set the initial value
    //


    this.updateElement();
  };

  DateRangePicker.prototype = {
    constructor: DateRangePicker,
    setStartDate: function (startDate) {
      if (typeof startDate === 'string') this.startDate = moment(startDate, this.locale.format);
      if (typeof startDate === 'object') this.startDate = moment(startDate);
      if (!this.timePicker) this.startDate = this.startDate.startOf('day');
      if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

      if (this.minDate && this.startDate.isBefore(this.minDate)) {
        this.startDate = this.minDate.clone();
        if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }

      if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
        this.startDate = this.maxDate.clone();
        if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }

      if (!this.isShowing) this.updateElement();
      this.updateMonthsInView();
    },
    setEndDate: function (endDate) {
      if (typeof endDate === 'string') this.endDate = moment(endDate, this.locale.format);
      if (typeof endDate === 'object') this.endDate = moment(endDate);
      if (!this.timePicker) this.endDate = this.endDate.endOf('day');
      if (this.timePicker && this.timePickerIncrement) this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      if (this.endDate.isBefore(this.startDate)) this.endDate = this.startDate.clone();
      if (this.maxDate && this.endDate.isAfter(this.maxDate)) this.endDate = this.maxDate.clone();
      if (this.maxSpan && this.startDate.clone().add(this.maxSpan).isBefore(this.endDate)) this.endDate = this.startDate.clone().add(this.maxSpan);
      this.previousRightTime = this.endDate.clone();
      this.container.find('.drp-selected').html(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
      if (!this.isShowing) this.updateElement();
      this.updateMonthsInView();
    },
    isInvalidDate: function () {
      return false;
    },
    isCustomDate: function () {
      return false;
    },
    updateView: function () {
      if (this.timePicker) {
        this.renderTimePicker('left');
        this.renderTimePicker('right');

        if (!this.endDate) {
          this.container.find('.right .calendar-time select').prop('disabled', true).addClass('disabled');
        } else {
          this.container.find('.right .calendar-time select').prop('disabled', false).removeClass('disabled');
        }
      }

      if (this.endDate) this.container.find('.drp-selected').html(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
      this.updateMonthsInView();
      this.updateCalendars();
      this.updateFormInputs();
    },
    updateMonthsInView: function () {
      if (this.endDate) {
        //if both dates are visible already, do nothing
        if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM')) && (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))) {
          return;
        }

        this.leftCalendar.month = this.startDate.clone().date(2);

        if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
          this.rightCalendar.month = this.endDate.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      } else {
        if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
          this.leftCalendar.month = this.startDate.clone().date(2);
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      }

      if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
        this.rightCalendar.month = this.maxDate.clone().date(2);
        this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
      }
    },
    updateCalendars: function () {
      if (this.timePicker) {
        var hour, minute, second;

        if (this.endDate) {
          hour = parseInt(this.container.find('.left .hourselect').val(), 10);
          minute = parseInt(this.container.find('.left .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
          }

          second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.left .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }
        } else {
          hour = parseInt(this.container.find('.right .hourselect').val(), 10);
          minute = parseInt(this.container.find('.right .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
          }

          second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.right .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }
        }

        this.leftCalendar.month.hour(hour).minute(minute).second(second);
        this.rightCalendar.month.hour(hour).minute(minute).second(second);
      }

      this.renderCalendar('left');
      this.renderCalendar('right'); //highlight any predefined range matching the current start and end dates

      this.container.find('.ranges li').removeClass('active');
      if (this.endDate == null) return;
      this.calculateChosenLabel();
    },
    renderCalendar: function (side) {
      //
      // Build the matrix of dates that will populate the calendar
      //
      var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
      var month = calendar.month.month();
      var year = calendar.month.year();
      var hour = calendar.month.hour();
      var minute = calendar.month.minute();
      var second = calendar.month.second();
      var daysInMonth = moment([year, month]).daysInMonth();
      var firstDay = moment([year, month, 1]);
      var lastDay = moment([year, month, daysInMonth]);
      var lastMonth = moment(firstDay).subtract(1, 'month').month();
      var lastYear = moment(firstDay).subtract(1, 'month').year();
      var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
      var dayOfWeek = firstDay.day(); //initialize a 6 rows x 7 columns array for the calendar

      var calendar = [];
      calendar.firstDay = firstDay;
      calendar.lastDay = lastDay;

      for (var i = 0; i < 6; i++) {
        calendar[i] = [];
      } //populate the calendar with date objects


      var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
      if (startDay > daysInLastMonth) startDay -= 7;
      if (dayOfWeek == this.locale.firstDay) startDay = daysInLastMonth - 6;
      var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
      var col, row;

      for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
        if (i > 0 && col % 7 === 0) {
          col = 0;
          row++;
        }

        calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
        curDate.hour(12);

        if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
          calendar[row][col] = this.minDate.clone();
        }

        if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
          calendar[row][col] = this.maxDate.clone();
        }
      } //make the calendar object available to hoverDate/clickDate


      if (side == 'left') {
        this.leftCalendar.calendar = calendar;
      } else {
        this.rightCalendar.calendar = calendar;
      } //
      // Display the calendar
      //


      var minDate = side == 'left' ? this.minDate : this.startDate;
      var maxDate = this.maxDate;
      var selected = side == 'left' ? this.startDate : this.endDate;
      var arrow = this.locale.direction == 'ltr' ? {
        left: 'chevron-left',
        right: 'chevron-right'
      } : {
        left: 'chevron-right',
        right: 'chevron-left'
      };
      var html = '<table class="table-condensed">';
      html += '<thead>';
      html += '<tr>'; // add empty cell for week number

      if (this.showWeekNumbers || this.showISOWeekNumbers) html += '<th></th>';

      if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
        html += '<th class="prev available"><span></span></th>';
      } else {
        html += '<th></th>';
      }

      var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

      if (this.showDropdowns) {
        var currentMonth = calendar[1][1].month();
        var currentYear = calendar[1][1].year();
        var maxYear = maxDate && maxDate.year() || this.maxYear;
        var minYear = minDate && minDate.year() || this.minYear;
        var inMinYear = currentYear == minYear;
        var inMaxYear = currentYear == maxYear;
        var monthHtml = '<select class="monthselect">';

        for (var m = 0; m < 12; m++) {
          if ((!inMinYear || minDate && m >= minDate.month()) && (!inMaxYear || maxDate && m <= maxDate.month())) {
            monthHtml += "<option value='" + m + "'" + (m === currentMonth ? " selected='selected'" : "") + ">" + this.locale.monthNames[m] + "</option>";
          } else {
            monthHtml += "<option value='" + m + "'" + (m === currentMonth ? " selected='selected'" : "") + " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
          }
        }

        monthHtml += "</select>";
        var yearHtml = '<select class="yearselect">';

        for (var y = minYear; y <= maxYear; y++) {
          yearHtml += '<option value="' + y + '"' + (y === currentYear ? ' selected="selected"' : '') + '>' + y + '</option>';
        }

        yearHtml += '</select>';
        dateHtml = monthHtml + yearHtml;
      }

      html += '<th colspan="5" class="month">' + dateHtml + '</th>';

      if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
        html += '<th class="next available"><span></span></th>';
      } else {
        html += '<th></th>';
      }

      html += '</tr>';
      html += '<tr>'; // add week number label

      if (this.showWeekNumbers || this.showISOWeekNumbers) html += '<th class="week">' + this.locale.weekLabel + '</th>';
      $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
        html += '<th>' + dayOfWeek + '</th>';
      });
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>'; //adjust maxDate to reflect the maxSpan setting in order to
      //grey out end dates beyond the maxSpan

      if (this.endDate == null && this.maxSpan) {
        var maxLimit = this.startDate.clone().add(this.maxSpan).endOf('day');

        if (!maxDate || maxLimit.isBefore(maxDate)) {
          maxDate = maxLimit;
        }
      }

      for (var row = 0; row < 6; row++) {
        html += '<tr>'; // add week number

        if (this.showWeekNumbers) html += '<td class="week">' + calendar[row][0].week() + '</td>';else if (this.showISOWeekNumbers) html += '<td class="week">' + calendar[row][0].isoWeek() + '</td>';

        for (var col = 0; col < 7; col++) {
          var classes = []; //highlight today's date

          if (calendar[row][col].isSame(new Date(), "day")) classes.push('today'); //highlight weekends

          if (calendar[row][col].isoWeekday() > 5) classes.push('weekend'); //grey out the dates in other months displayed at beginning and end of this calendar

          if (calendar[row][col].month() != calendar[1][1].month()) classes.push('off', 'ends'); //don't allow selection of dates before the minimum date

          if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) classes.push('off', 'disabled'); //don't allow selection of dates after the maximum date

          if (maxDate && calendar[row][col].isAfter(maxDate, 'day')) classes.push('off', 'disabled'); //don't allow selection of date if a custom function decides it's invalid

          if (this.isInvalidDate(calendar[row][col])) classes.push('off', 'disabled'); //highlight the currently selected start date

          if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD')) classes.push('active', 'start-date'); //highlight the currently selected end date

          if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD')) classes.push('active', 'end-date'); //highlight dates in-between the selected dates

          if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) classes.push('in-range'); //apply custom classes for this date

          var isCustom = this.isCustomDate(calendar[row][col]);

          if (isCustom !== false) {
            if (typeof isCustom === 'string') classes.push(isCustom);else Array.prototype.push.apply(classes, isCustom);
          }

          var cname = '',
              disabled = false;

          for (var i = 0; i < classes.length; i++) {
            cname += classes[i] + ' ';
            if (classes[i] == 'disabled') disabled = true;
          }

          if (!disabled) cname += 'available';
          html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';
        }

        html += '</tr>';
      }

      html += '</tbody>';
      html += '</table>';
      this.container.find('.drp-calendar.' + side + ' .calendar-table').html(html);
    },
    renderTimePicker: function (side) {
      // Don't bother updating the time picker if it's currently disabled
      // because an end date hasn't been clicked yet
      if (side == 'right' && !this.endDate) return;
      var html,
          selected,
          minDate,
          maxDate = this.maxDate;
      if (this.maxSpan && (!this.maxDate || this.startDate.clone().add(this.maxSpan).isBefore(this.maxDate))) maxDate = this.startDate.clone().add(this.maxSpan);

      if (side == 'left') {
        selected = this.startDate.clone();
        minDate = this.minDate;
      } else if (side == 'right') {
        selected = this.endDate.clone();
        minDate = this.startDate; //Preserve the time already selected

        var timeSelector = this.container.find('.drp-calendar.right .calendar-time');

        if (timeSelector.html() != '') {
          selected.hour(!isNaN(selected.hour()) ? selected.hour() : timeSelector.find('.hourselect option:selected').val());
          selected.minute(!isNaN(selected.minute()) ? selected.minute() : timeSelector.find('.minuteselect option:selected').val());
          selected.second(!isNaN(selected.second()) ? selected.second() : timeSelector.find('.secondselect option:selected').val());

          if (!this.timePicker24Hour) {
            var ampm = timeSelector.find('.ampmselect option:selected').val();
            if (ampm === 'PM' && selected.hour() < 12) selected.hour(selected.hour() + 12);
            if (ampm === 'AM' && selected.hour() === 12) selected.hour(0);
          }
        }

        if (selected.isBefore(this.startDate)) selected = this.startDate.clone();
        if (maxDate && selected.isAfter(maxDate)) selected = maxDate.clone();
      } //
      // hours
      //


      html = '<select class="hourselect">';
      var start = this.timePicker24Hour ? 0 : 1;
      var end = this.timePicker24Hour ? 23 : 12;

      for (var i = start; i <= end; i++) {
        var i_in_24 = i;
        if (!this.timePicker24Hour) i_in_24 = selected.hour() >= 12 ? i == 12 ? 12 : i + 12 : i == 12 ? 0 : i;
        var time = selected.clone().hour(i_in_24);
        var disabled = false;
        if (minDate && time.minute(59).isBefore(minDate)) disabled = true;
        if (maxDate && time.minute(0).isAfter(maxDate)) disabled = true;

        if (i_in_24 == selected.hour() && !disabled) {
          html += '<option value="' + i + '" selected="selected">' + i + '</option>';
        } else if (disabled) {
          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
        } else {
          html += '<option value="' + i + '">' + i + '</option>';
        }
      }

      html += '</select> '; //
      // minutes
      //

      html += ': <select class="minuteselect">';

      for (var i = 0; i < 60; i += this.timePickerIncrement) {
        var padded = i < 10 ? '0' + i : i;
        var time = selected.clone().minute(i);
        var disabled = false;
        if (minDate && time.second(59).isBefore(minDate)) disabled = true;
        if (maxDate && time.second(0).isAfter(maxDate)) disabled = true;

        if (selected.minute() == i && !disabled) {
          html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
        } else if (disabled) {
          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
        } else {
          html += '<option value="' + i + '">' + padded + '</option>';
        }
      }

      html += '</select> '; //
      // seconds
      //

      if (this.timePickerSeconds) {
        html += ': <select class="secondselect">';

        for (var i = 0; i < 60; i++) {
          var padded = i < 10 ? '0' + i : i;
          var time = selected.clone().second(i);
          var disabled = false;
          if (minDate && time.isBefore(minDate)) disabled = true;
          if (maxDate && time.isAfter(maxDate)) disabled = true;

          if (selected.second() == i && !disabled) {
            html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
          } else if (disabled) {
            html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
          } else {
            html += '<option value="' + i + '">' + padded + '</option>';
          }
        }

        html += '</select> ';
      } //
      // AM/PM
      //


      if (!this.timePicker24Hour) {
        html += '<select class="ampmselect">';
        var am_html = '';
        var pm_html = '';
        if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) am_html = ' disabled="disabled" class="disabled"';
        if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) pm_html = ' disabled="disabled" class="disabled"';

        if (selected.hour() >= 12) {
          html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
        } else {
          html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
        }

        html += '</select>';
      }

      this.container.find('.drp-calendar.' + side + ' .calendar-time').html(html);
    },
    updateFormInputs: function () {
      if (this.singleDatePicker || this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate))) {
        this.container.find('button.applyBtn').prop('disabled', false);
      } else {
        this.container.find('button.applyBtn').prop('disabled', true);
      }
    },
    move: function () {
      var parentOffset = {
        top: 0,
        left: 0
      },
          containerTop,
          drops = this.drops;
      var parentRightEdge = $(window).width();

      if (!this.parentEl.is('body')) {
        parentOffset = {
          top: this.parentEl.offset().top - this.parentEl.scrollTop(),
          left: this.parentEl.offset().left - this.parentEl.scrollLeft()
        };
        parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
      }

      switch (drops) {
        case 'auto':
          containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;

          if (containerTop + this.container.outerHeight() >= this.parentEl[0].scrollHeight) {
            containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            drops = 'up';
          }

          break;

        case 'up':
          containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
          break;

        default:
          containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
          break;
      } // Force the container to it's actual width


      this.container.css({
        top: 0,
        left: 0,
        right: 'auto'
      });
      var containerWidth = this.container.outerWidth();
      this.container.toggleClass('drop-up', drops == 'up');

      if (this.opens == 'left') {
        var containerRight = parentRightEdge - this.element.offset().left - this.element.outerWidth();

        if (containerWidth + containerRight > $(window).width()) {
          this.container.css({
            top: containerTop,
            right: 'auto',
            left: 9
          });
        } else {
          this.container.css({
            top: containerTop,
            right: containerRight,
            left: 'auto'
          });
        }
      } else if (this.opens == 'center') {
        var containerLeft = this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2 - containerWidth / 2;

        if (containerLeft < 0) {
          this.container.css({
            top: containerTop,
            right: 'auto',
            left: 9
          });
        } else if (containerLeft + containerWidth > $(window).width()) {
          this.container.css({
            top: containerTop,
            left: 'auto',
            right: 0
          });
        } else {
          this.container.css({
            top: containerTop,
            left: containerLeft,
            right: 'auto'
          });
        }
      } else {
        var containerLeft = this.element.offset().left - parentOffset.left;

        if (containerLeft + containerWidth > $(window).width()) {
          this.container.css({
            top: containerTop,
            left: 'auto',
            right: 0
          });
        } else {
          this.container.css({
            top: containerTop,
            left: containerLeft,
            right: 'auto'
          });
        }
      }
    },
    show: function (e) {
      if (this.isShowing) return; // Create a click proxy that is private to this instance of datepicker, for unbinding

      this._outsideClickProxy = $.proxy(function (e) {
        this.outsideClick(e);
      }, this); // Bind global datepicker mousedown for hiding and

      $(document).on('mousedown.daterangepicker', this._outsideClickProxy) // also support mobile devices
      .on('touchend.daterangepicker', this._outsideClickProxy) // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
      .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy) // and also close when focus changes to outside the picker (eg. tabbing between controls)
      .on('focusin.daterangepicker', this._outsideClickProxy); // Reposition the picker if the window is resized while it's open

      $(window).on('resize.daterangepicker', $.proxy(function (e) {
        this.move(e);
      }, this));
      this.oldStartDate = this.startDate.clone();
      this.oldEndDate = this.endDate.clone();
      this.previousRightTime = this.endDate.clone();
      this.updateView();
      this.container.show();
      this.move();
      this.element.trigger('show.daterangepicker', this);
      this.isShowing = true;
    },
    hide: function (e) {
      if (!this.isShowing) return; //incomplete date selection, revert to last values

      if (!this.endDate) {
        this.startDate = this.oldStartDate.clone();
        this.endDate = this.oldEndDate.clone();
      } //if a new date range was selected, invoke the user callback function


      if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)) this.callback(this.startDate.clone(), this.endDate.clone(), this.chosenLabel); //if picker is attached to a text input, update it

      this.updateElement();
      $(document).off('.daterangepicker');
      $(window).off('.daterangepicker');
      this.container.hide();
      this.element.trigger('hide.daterangepicker', this);
      this.isShowing = false;
    },
    toggle: function (e) {
      if (this.isShowing) {
        this.hide();
      } else {
        this.show();
      }
    },
    outsideClick: function (e) {
      var target = $(e.target); // if the page is clicked anywhere except within the daterangerpicker/button
      // itself then call this.hide()

      if ( // ie modal dialog fix
      e.type == "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest('.calendar-table').length) return;
      this.hide();
      this.element.trigger('outsideClick.daterangepicker', this);
    },
    showCalendars: function () {
      this.container.addClass('show-calendar');
      this.move();
      this.element.trigger('showCalendar.daterangepicker', this);
    },
    hideCalendars: function () {
      this.container.removeClass('show-calendar');
      this.element.trigger('hideCalendar.daterangepicker', this);
    },
    clickRange: function (e) {
      var label = e.target.getAttribute('data-range-key');
      this.chosenLabel = label;

      if (label == this.locale.customRangeLabel) {
        this.showCalendars();
      } else {
        var dates = this.ranges[label];
        this.startDate = dates[0];
        this.endDate = dates[1];

        if (!this.timePicker) {
          this.startDate.startOf('day');
          this.endDate.endOf('day');
        }

        if (!this.alwaysShowCalendars) this.hideCalendars();
        this.clickApply();
      }
    },
    clickPrev: function (e) {
      var cal = $(e.target).parents('.drp-calendar');

      if (cal.hasClass('left')) {
        this.leftCalendar.month.subtract(1, 'month');
        if (this.linkedCalendars) this.rightCalendar.month.subtract(1, 'month');
      } else {
        this.rightCalendar.month.subtract(1, 'month');
      }

      this.updateCalendars();
    },
    clickNext: function (e) {
      var cal = $(e.target).parents('.drp-calendar');

      if (cal.hasClass('left')) {
        this.leftCalendar.month.add(1, 'month');
      } else {
        this.rightCalendar.month.add(1, 'month');
        if (this.linkedCalendars) this.leftCalendar.month.add(1, 'month');
      }

      this.updateCalendars();
    },
    hoverDate: function (e) {
      //ignore dates that can't be selected
      if (!$(e.target).hasClass('available')) return;
      var title = $(e.target).attr('data-title');
      var row = title.substr(1, 1);
      var col = title.substr(3, 1);
      var cal = $(e.target).parents('.drp-calendar');
      var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col]; //highlight the dates between the start date and the date being hovered as a potential end date

      var leftCalendar = this.leftCalendar;
      var rightCalendar = this.rightCalendar;
      var startDate = this.startDate;

      if (!this.endDate) {
        this.container.find('.drp-calendar tbody td').each(function (index, el) {
          //skip week numbers, only look at dates
          if ($(el).hasClass('week')) return;
          var title = $(el).attr('data-title');
          var row = title.substr(1, 1);
          var col = title.substr(3, 1);
          var cal = $(el).parents('.drp-calendar');
          var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

          if (dt.isAfter(startDate) && dt.isBefore(date) || dt.isSame(date, 'day')) {
            $(el).addClass('in-range');
          } else {
            $(el).removeClass('in-range');
          }
        });
      }
    },
    clickDate: function (e) {
      if (!$(e.target).hasClass('available')) return;
      var title = $(e.target).attr('data-title');
      var row = title.substr(1, 1);
      var col = title.substr(3, 1);
      var cal = $(e.target).parents('.drp-calendar');
      var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col]; //
      // this function needs to do a few things:
      // * alternate between selecting a start and end date for the range,
      // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
      // * if autoapply is enabled, and an end date was chosen, apply the selection
      // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
      // * if one of the inputs above the calendars was focused, cancel that manual input
      //

      if (this.endDate || date.isBefore(this.startDate, 'day')) {
        //picking start
        if (this.timePicker) {
          var hour = parseInt(this.container.find('.left .hourselect').val(), 10);

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.left .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }

          var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
          }

          var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
          date = date.clone().hour(hour).minute(minute).second(second);
        }

        this.endDate = null;
        this.setStartDate(date.clone());
      } else if (!this.endDate && date.isBefore(this.startDate)) {
        //special case: clicking the same date for start/end,
        //but the time of the end date is before the start date
        this.setEndDate(this.startDate.clone());
      } else {
        // picking end
        if (this.timePicker) {
          var hour = parseInt(this.container.find('.right .hourselect').val(), 10);

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.right .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }

          var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);

          if (isNaN(minute)) {
            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
          }

          var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
          date = date.clone().hour(hour).minute(minute).second(second);
        }

        this.setEndDate(date.clone());

        if (this.autoApply) {
          this.calculateChosenLabel();
          this.clickApply();
        }
      }

      if (this.singleDatePicker) {
        this.setEndDate(this.startDate);
        if (!this.timePicker && this.autoApply) this.clickApply();
      }

      this.updateView(); //This is to cancel the blur event handler if the mouse was in one of the inputs

      e.stopPropagation();
    },
    calculateChosenLabel: function () {
      var customRange = true;
      var i = 0;

      for (var range in this.ranges) {
        if (this.timePicker) {
          var format = this.timePickerSeconds ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm"; //ignore times when comparing dates if time picker seconds is not enabled

          if (this.startDate.format(format) == this.ranges[range][0].format(format) && this.endDate.format(format) == this.ranges[range][1].format(format)) {
            customRange = false;
            this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').attr('data-range-key');
            break;
          }
        } else {
          //ignore times when comparing dates if time picker is not enabled
          if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
            customRange = false;
            this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').attr('data-range-key');
            break;
          }
        }

        i++;
      }

      if (customRange) {
        if (this.showCustomRangeLabel) {
          this.chosenLabel = this.container.find('.ranges li:last').addClass('active').attr('data-range-key');
        } else {
          this.chosenLabel = null;
        }

        this.showCalendars();
      }
    },
    clickApply: function (e) {
      this.hide();
      this.element.trigger('apply.daterangepicker', this);
    },
    clickCancel: function (e) {
      this.startDate = moment().subtract(1, 'days');
      this.endDate = moment().subtract(1, 'days');
      this.hide();
      this.element.trigger('cancel.daterangepicker', this);
    },
    monthOrYearChanged: function (e) {
      var isLeft = $(e.target).closest('.drp-calendar').hasClass('left'),
          leftOrRight = isLeft ? 'left' : 'right',
          cal = this.container.find('.drp-calendar.' + leftOrRight); // Month must be Number for new moment versions

      var month = parseInt(cal.find('.monthselect').val(), 10);
      var year = cal.find('.yearselect').val();

      if (!isLeft) {
        if (year < this.startDate.year() || year == this.startDate.year() && month < this.startDate.month()) {
          month = this.startDate.month();
          year = this.startDate.year();
        }
      }

      if (this.minDate) {
        if (year < this.minDate.year() || year == this.minDate.year() && month < this.minDate.month()) {
          month = this.minDate.month();
          year = this.minDate.year();
        }
      }

      if (this.maxDate) {
        if (year > this.maxDate.year() || year == this.maxDate.year() && month > this.maxDate.month()) {
          month = this.maxDate.month();
          year = this.maxDate.year();
        }
      }

      if (isLeft) {
        this.leftCalendar.month.month(month).year(year);
        if (this.linkedCalendars) this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
      } else {
        this.rightCalendar.month.month(month).year(year);
        if (this.linkedCalendars) this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
      }

      this.updateCalendars();
    },
    timeChanged: function (e) {
      var cal = $(e.target).closest('.drp-calendar'),
          isLeft = cal.hasClass('left');
      var hour = parseInt(cal.find('.hourselect').val(), 10);
      var minute = parseInt(cal.find('.minuteselect').val(), 10);

      if (isNaN(minute)) {
        minute = parseInt(cal.find('.minuteselect option:last').val(), 10);
      }

      var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;

      if (!this.timePicker24Hour) {
        var ampm = cal.find('.ampmselect').val();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
      }

      if (isLeft) {
        var start = this.startDate.clone();
        start.hour(hour);
        start.minute(minute);
        start.second(second);
        this.setStartDate(start);

        if (this.singleDatePicker) {
          this.endDate = this.startDate.clone();
        } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
          this.setEndDate(start.clone());
        }
      } else if (this.endDate) {
        var end = this.endDate.clone();
        end.hour(hour);
        end.minute(minute);
        end.second(second);
        this.setEndDate(end);
      } //update the calendars so all clickable dates reflect the new time component


      this.updateCalendars(); //update the form inputs above the calendars with the new time

      this.updateFormInputs(); //re-render the time pickers because changing one selection can affect what's enabled in another

      this.renderTimePicker('left');
      this.renderTimePicker('right');
    },
    elementChanged: function () {
      if (!this.element.is('input')) return;
      if (!this.element.val().length) return;
      var dateString = this.element.val().split(this.locale.separator),
          start = null,
          end = null;

      if (dateString.length === 2) {
        start = moment(dateString[0], this.locale.format);
        end = moment(dateString[1], this.locale.format);
      }

      if (this.singleDatePicker || start === null || end === null) {
        start = moment(this.element.val(), this.locale.format);
        end = start;
      }

      if (!start.isValid() || !end.isValid()) return;
      this.setStartDate(start);
      this.setEndDate(end);
      this.updateView();
    },
    keydown: function (e) {
      //hide on tab or enter
      if (e.keyCode === 9 || e.keyCode === 13) {
        this.hide();
      } //hide on esc and prevent propagation


      if (e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
      }
    },
    updateElement: function () {
      if (this.element.is('input') && this.autoUpdateInput) {
        var newValue = this.startDate.format(this.locale.format);

        if (!this.singleDatePicker) {
          newValue += this.locale.separator + this.endDate.format(this.locale.format);
        }

        if (newValue !== this.element.val()) {
          this.element.val(newValue).trigger('change');
        }
      }
    },
    remove: function () {
      this.container.remove();
      this.element.off('.daterangepicker');
      this.element.removeData();
    }
  };

  $.fn.daterangepicker = function (options, callback) {
    var implementOptions = $.extend(true, {}, $.fn.daterangepicker.defaultOptions, options);
    this.each(function () {
      var el = $(this);
      if (el.data('daterangepicker')) el.data('daterangepicker').remove();
      el.data('daterangepicker', new DateRangePicker(el, implementOptions, callback));
    });
    return this;
  };

  return DateRangePicker;
});
//# sourceMappingURL=main.js.map
