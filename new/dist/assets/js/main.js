"use strict";

var HRM_BREAKPOINTS = {
  tableMaxWidth: 1219,
  mobileMaxWidth: 767
};
ko.validation.init({
  insertMessages: false
});
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

ko.bindingHandlers.hrmSlide = {
  init: function init(element, valueAccessor, allBindings) {
    var value = ko.unwrap(allBindings.get('hrmSlideValue'));

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
  update: function update(element, valueAccessor, allBindings) {
    var value = ko.unwrap(allBindings.get('hrmSlideValue'));
    var duration = allBindings.get('hrmSlideDuration') || 200;

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
  init: function init(element, valueAccessor, allBindings) {
    var value = ko.unwrap(allBindings.get('hrmFadeValue'));

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
  update: function update(element, valueAccessor, allBindings) {
    var value = ko.unwrap(allBindings.get('hrmFadeValue'));
    var duration = allBindings.get('hrmFadeDuration') || 200;
    var inDelay = allBindings.get('hrmFadeInDelay') || 0;
    var outDelay = allBindings.get('hrmFadeOutDelay') || 0;

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
  init: function init(element, valueAccessor, allBindings) {
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
  init: function init(element, valueAccessor, allBindings) {
    var pattern = allBindings.get('hrmMaskPattern');
    var options = allBindings.get('hrmMaskOptions');
    $(element).inputmask(pattern, _objectSpread({
      jitMasking: true,
      showMaskOnFocus: false,
      showMaskOnHover: false
    }, options));
  }
};
ko.bindingHandlers.hrmTimeAutocompleter = {
  init: function init(element) {
    $(element).on('blur', function () {
      var value = $(element).val();
      var regExpExecuteResult = /^([0-9]{2}):\s$/.exec(value);

      if (regExpExecuteResult !== null && +regExpExecuteResult[1] < 24) {
        $(element).val(regExpExecuteResult[1] + ':00').trigger('change');
      }
    });
  }
};

function hrmSplitComponentTemplateNodes(nodes) {
  var result = {
    main: [],
    slots: {}
  };
  $(nodes).filter('hrm-slot').each(function (index, slotElement) {
    var $slot = $(slotElement);
    result.slots[$slot.attr('name')] = $slot.contents();
  });
  result.main = nodes.filter(function (node) {
    return !(node.nodeType === 1 && node.tagName === 'HRM-SLOT');
  });
  return result;
}

function hrmSlideBeforeRemoveFactory() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (element) {
    return $(element).delay(delay).slideUp(duration, function () {
      return $(element).remove();
    });
  };
}

function hrmSlideAfterAddFactory() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (element) {
    return $(element).hide().delay(delay).slideDown(duration);
  };
}

function hrmFadeBeforeRemoveFactory() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (element) {
    return $(element).delay(delay).fadeOut(duration, function () {
      return $(element).remove();
    });
  };
}

function hrmFadeAfterAddFactory() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (element) {
    return $(element).hide().delay(delay).fadeIn(duration);
  };
}

ko.validation.rules['hrmTime'] = {
  validator: function validator(val) {
    return val.length === 5 && moment(val, 'HH:mm').isValid();
  },
  message: 'Неверный формат времени'
};
ko.validation.registerExtenders();

function hrmTemplateIf(condition, data) {
  return condition ? [data] : undefined;
}
"use strict";

ko.components.register('hrm-checkbox', {
  viewModel: {
    createViewModel: function createViewModel(params, componentInfo) {
      var $element = $(componentInfo.element);
      $element.addClass(['hrm-checkbox']);

      var ViewModel = function ViewModel() {
        var _this = this;

        this._subscriptions = [];

        if (params !== undefined && 'checked' in params) {
          this.checked = ko.isObservable(params.checked) ? params.checked : ko.observable(params.checked);
        } else {
          this.checked = ko.observable(false);
        }

        this.checkboxGroup = params !== undefined && 'owner' in params ? params.owner : null;

        (function () {
          $element.toggleClass('hrm-checkbox--checked', _this.checked());

          _this._subscriptions.push(_this.checked.subscribe(function (checked) {
            $element.toggleClass('hrm-checkbox--checked', checked);
          }));
        })();
      };

      ViewModel.prototype.dispose = function () {
        this._subscriptions.forEach(function (s) {
          return s.dispose();
        });
      };

      return new ViewModel();
    }
  },
  template: "\n        <label class=\"hrm-checkbox__layout\">\n            <input data-bind=\"checked: checked, attr: {id: checkboxGroup !== null && checkboxGroup() !== null ? checkboxGroup().id : undefined}\"\n                   type=\"checkbox\" hidden>\n        </label>\n    "
});
var hrmCheckboxGroupNextId = 0;
ko.components.register('hrm-checkbox-group', {
  viewModel: {
    createViewModel: function createViewModel(params, componentInfo) {
      var $element = $(componentInfo.element);
      $element.addClass(['hrm-checkbox-group']);

      var ViewModel = function ViewModel() {
        var _this2 = this;

        this.id = 'hrm-checkbox-group-' + hrmCheckboxGroupNextId++;

        (function () {
          if (params !== undefined && 'exportAs' in params) {
            if (ko.isObservableArray(params.exportAs)) {
              params.exportAs.push(_this2);
            } else {
              params.exportAs(_this2);
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
  template: "\n        <!-- ko template: {nodes: $componentTemplateNodes} --><!-- /ko -->\n    "
});
ko.bindingHandlers.hrmCheckboxGroupLabel = {
  init: function init(element, valueAccessor, allBindings) {
    var checkboxGroup = allBindings.get('hrmCheckboxGroupLabelOwner');
    var $element = $(element);
    $element.addClass('hrm-checkbox-group__label');
    $element.attr('for', checkboxGroup().id);
  }
};
"use strict";

var hrmFormFieldNextId = 0;
ko.components.register('hrm-form-field', {
  viewModel: {
    createViewModel: function createViewModel(params, componentInfo) {
      var $element = $(componentInfo.element);
      $element.addClass(['hrm-form-field']);

      if ('noLabel' in params && params.noLabel) {
        $element.addClass(['hrm-form-field--no-label']);
      }

      var ViewModel = function ViewModel() {
        this.subscriptions = [];
        this.templateNodes = hrmSplitComponentTemplateNodes(componentInfo.templateNodes);
        this.element = componentInfo.element;
        this.controlWrapperElement = ko.observable(null);
        this.controlId = 'hrm-form-field-control-' + hrmFormFieldNextId++;
        this.hasError = params !== undefined && 'hasError' in params ? params.hasError : false;
        this.focused = ko.observable(false);
        this.hasValue = ko.observable(false);

        this.afterRender = function () {
          $element.toggleClass('hrm-form-field--focused', this.focused());
          this.subscriptions.push(this.focused.subscribe(function (focused) {
            $element.toggleClass('hrm-form-field--focused', focused);
          }));
          $element.toggleClass('hrm-form-field--has-value', this.hasValue());
          this.subscriptions.push(this.hasValue.subscribe(function (hasValue) {
            $element.toggleClass('hrm-form-field--has-value', hasValue);
          }));

          if (!ko.isObservable(this.hasError)) {
            $element.toggleClass('hrm-form-field--has-error', this.hasError);
          } else {
            $element.toggleClass('hrm-form-field--has-error', this.hasError());
            this.subscriptions.push(this.hasError.subscribe(function (hasError) {
              $element.toggleClass('hrm-form-field--has-error', hasError);
            }));
          }
        };

        if (params !== undefined && 'exportAs' in params) {
          if (ko.isObservableArray(params.exportAs)) {
            params.exportAs.push(this);
          } else {
            params.exportAs(this);
          }
        }
      };

      ViewModel.prototype.dispose = function () {
        this.subscriptions.forEach(function (s) {
          return s.dispose();
        });

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
  template: "\n        <!-- ko template: {afterRender: function () {afterRender();}} -->\n            <!-- ko template: {nodes: templateNodes.slots['label']} --><!-- /ko -->\n            <div class=\"hrm-form-field__control-wrapper\" data-bind=\"hrmElement: controlWrapperElement\">\n                <!-- ko template: {nodes: templateNodes.main} --><!-- /ko -->\n            </div>\n            <!-- ko template: {nodes: templateNodes.slots['error']} --><!-- /ko -->\n        <!-- /ko -->\n    "
});
ko.components.register('hrm-form-field-error', {
  viewModel: {
    createViewModel: function createViewModel(params, componentInfo) {
      var $element = $(componentInfo.element);
      $element.addClass(['hrm-form-field__error']);
      return new function () {
        this.templateNodes = hrmSplitComponentTemplateNodes(componentInfo.templateNodes);
      }();
    }
  },
  template: "\n        <span class=\"hrm-form-field__error-text\">\n            <!-- ko template: {nodes: templateNodes.main} --><!-- /ko -->\n        </span>\n    "
});
ko.bindingHandlers.hrmFormFieldInputControl = {
  init: function init(element, valueAccessor, allBindings) {
    var formField = allBindings.get('hrmFormFieldInputControlOwner');
    var $wrapper = $(formField().controlWrapperElement());
    var $element = $(element);
    $element.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_input']);
    $element.attr('id', formField().controlId);

    var wrapperClickHandler = function wrapperClickHandler() {
      return $element.focus();
    };

    var focusHandler = function focusHandler() {
      return formField().focused(true);
    };

    var blurHandler = function blurHandler() {
      return formField().focused(false);
    };

    var valueHandler = function valueHandler(event) {
      var value = event.target.value;
      formField().hasValue(value !== '');
    };

    $wrapper.on('click', wrapperClickHandler);
    $element.on('focus', focusHandler);
    $element.on('blur', blurHandler);
    $element.on('input change', valueHandler);
    formField().focused($element.is(':focus'));
    formField().hasValue($element.val() !== '');
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $wrapper.off('click', wrapperClickHandler);
      $element.off('focus', focusHandler);
      $element.off('blur', blurHandler);
      $element.off('input change', valueHandler);
    });
  }
};
ko.bindingHandlers.hrmFormFieldSelectControl = {
  init: function init(element, valueAccessor, allBindings) {
    var subscriptions = [];
    var formField = allBindings.get('hrmFormFieldSelectControlOwner');
    var $wrapper = $(formField().controlWrapperElement());
    var $element = $(element);
    var isMultiple = $element.prop('multiple');
    var select2Instance = $element.data('select2');
    var selectionFocused = ko.observable(select2Instance.$selection.is(':focus'));
    var searchFocused = isMultiple ? ko.observable(select2Instance.selection.$search.is(':focus')) : null;
    var dropdownOpened = ko.observable(false);
    subscriptions.push(ko.computed(function () {
      return selectionFocused() || dropdownOpened() || searchFocused !== null && searchFocused();
    }).subscribe(function (value) {
      return formField().focused(value);
    }));
    $element.attr('id', formField().controlId);
    select2Instance.$container.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_select']);
    select2Instance.$dropdown.children().first().addClass(['hrm-form-field__dropdown']);

    var emptyCheckFn = function emptyCheckFn(value) {
      return value !== '' && value !== undefined && (!(value instanceof Array) || value.length !== 0);
    };

    var wrapperMousedownHandler = function wrapperMousedownHandler(event) {
      if (event.target !== element && select2Instance.$container.get()[0] !== event.target && select2Instance.$container.has(event.target).length === 0) {
        var isOpen = select2Instance.isOpen();
        setTimeout(function () {
          select2Instance.$selection.focus();

          if (!isOpen) {
            select2Instance.open();
          }
        });
      }
    };

    var selectionFocusHandler = function selectionFocusHandler() {
      return selectionFocused(true);
    };

    var selectionBlurHandler = function selectionBlurHandler() {
      return selectionFocused(false);
    };

    var searchFocusHandler = function searchFocusHandler() {
      return searchFocused(true);
    };

    var searchBlurHandler = function searchBlurHandler() {
      return searchFocused(false);
    };

    var openingHandler = function openingHandler() {
      return dropdownOpened(true);
    };

    var closeHandler = function closeHandler() {
      return dropdownOpened(false);
    };

    var changeHandler = function changeHandler() {
      var value = $element.val();
      formField().hasValue(emptyCheckFn(value));
    };

    var searchUpdate = function searchUpdate() {
      if (isMultiple) {
        select2Instance.selection.$search.off('focus', searchFocusHandler);
        select2Instance.selection.$search.off('blur', searchBlurHandler);
        select2Instance.selection.$search.on('focus', searchFocusHandler);
        select2Instance.selection.$search.on('blur', searchBlurHandler);
      }
    };

    select2Instance.$selection.on('focus', selectionFocusHandler);
    select2Instance.$selection.on('blur', selectionBlurHandler);

    if (isMultiple) {
      select2Instance.selection.$search.on('focus', searchFocusHandler);
      select2Instance.selection.$search.on('blur', searchBlurHandler);
    }

    $wrapper.on('mousedown', wrapperMousedownHandler);
    $element.on('change.select2', changeHandler);
    $element.on('select2:opening', openingHandler);
    $element.on('select2:close', closeHandler);
    $element.on('hrm-select:search-update', searchUpdate);
    formField().hasValue(emptyCheckFn($element.val()));
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      subscriptions.forEach(function (s) {
        return s.dispose();
      });
      $wrapper.off('mousedown', wrapperMousedownHandler);
      select2Instance.$selection.off('focus', selectionFocusHandler);
      select2Instance.$selection.off('blur', selectionBlurHandler);

      if (isMultiple) {
        select2Instance.selection.$search.off('focus', searchFocusHandler);
        select2Instance.selection.$search.off('blur', searchBlurHandler);
      }

      $(element).off('change.select2', changeHandler);
      $element.off('select2:opening', openingHandler);
      $element.off('select2:close', closeHandler);
      $element.off('hrm-select:search-update', searchUpdate);
    });
  }
};
ko.bindingHandlers.hrmFormFieldLabel = {
  init: function init(element, valueAccessor, allBindings) {
    var formField = allBindings.get('hrmFormFieldLabelOwner');
    var $element = $(element);
    $element.addClass('hrm-form-field__label');
    $element.attr('for', formField().controlId);
  }
};
"use strict";

ko.components.register('hrm-footer', {
  viewModel: {
    createViewModel: function createViewModel(params, componentInfo) {
      var $element = $(componentInfo.element);
      $element.addClass(['hrm-footer']);
      return new function () {}();
    }
  },
  template: "\n        <div class=\"hrm-footer__branding\">\n            <div class=\"hrm-footer__logo\"></div>\n            <span class=\"hrm-footer__copyright\">\xA9 Lookin, 2020</span>\n        </div>\n        <a class=\"hrm-footer__support-link\" href=\"#\">\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430</a>\n    "
});
"use strict";

ko.bindingHandlers.hrmScrollable = {
  init: function init(element) {
    var $element = $(element);
    $element.addClass('hrm-scrollable__content');
    $element.overlayScrollbars({
      className: 'hrm-scrollable'
    });
  }
};
"use strict";

ko.bindingHandlers.hrmSelect = {
  init: function init(element, valueAccessor, allBindings) {
    var $element = $(element);
    var isMultiple = $element.prop('multiple');
    var value = !isMultiple ? allBindings.get('value') : allBindings.get('selectedOptions');
    var wrapperClass = allBindings.get('hrmSelectClass');
    var customValuesAllowed = allBindings.has('hrmSelectCustomValuesAllowed') ? allBindings.get('hrmSelectCustomValuesAllowed') : false;
    var options = {
      minimumResultsForSearch: customValuesAllowed ? 0 : Infinity,
      language: 'ru',
      width: '100%',
      dropdownAutoWidth: true,
      dropdownCssClass: 'hrm-select__dropdown',
      placeholder: ' ',
      tags: customValuesAllowed
    };

    var Select = $.fn.select2.amd.require('jquery.select2');

    var Search = $.fn.select2.amd.require('select2/selection/search');

    var originalSelectRenderFn = Select.prototype.render;
    var originalSearchUpdateFn = Search.prototype.update;

    Select.prototype.render = function () {
      var $container = originalSelectRenderFn.call.apply(originalSelectRenderFn, [this].concat(Array.prototype.slice.call(arguments)));
      $container.addClass('hrm-select');

      if (wrapperClass !== undefined) {
        $container.addClass(wrapperClass.split(' '));
      }

      return $container;
    };

    Search.prototype.update = function () {
      originalSearchUpdateFn.call.apply(originalSearchUpdateFn, [this].concat(Array.prototype.slice.call(arguments)));
      $element.trigger('hrm-select:search-update');
    };

    $element.select2(options);
    Select.prototype.render = originalSelectRenderFn;
    Search.prototype.update = originalSearchUpdateFn;
    var select2Instance = $element.data('select2');
    select2Instance.$results.unbind('mousewheel');
    var $dropdownResultsContainer = $element.data('select2').$results.parent();
    $dropdownResultsContainer.overlayScrollbars({
      callbacks: {
        onUpdated: function onUpdated() {
          if (select2Instance.$dropdown.is(':visible')) {
            select2Instance.dropdown._positionDropdown(); // Правка бага в Chrome с неправильным синхронным вычислением положения выпадающего списка


            setTimeout(function () {
              select2Instance.dropdown._positionDropdown();
            });
          }
        }
      }
    });

    var openHandler = function openHandler() {
      $dropdownResultsContainer.overlayScrollbars().scroll(0);
    };

    var openingHandler = function openingHandler() {
      select2Instance.$dropdown.hide().fadeIn(150);
    };

    var isClosingAnimated = false;

    var closingHandler = function closingHandler() {
      if (!isClosingAnimated) {
        select2Instance.$dropdown.fadeOut(150, function () {
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
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $element.off('select2:open', openHandler);
      $element.off('select2:opening', openingHandler);
      $element.off('select2:closing', closingHandler);
    });
  },
  update: function update(element, valueAccessor, allBindings) {
    var $element = $(element);
    var isMultiple = $element.prop('multiple');
    var value = !isMultiple ? allBindings.get('value') : allBindings.get('selectedOptions');

    if (value !== undefined && ko.isObservable(value)) {
      value.subscribe(function (v) {
        $element.trigger('change.select2');
      });
    }
  }
};
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

ko.bindingHandlers.hrmTable = {
  init: function init(element) {
    var $element = $(element);
    $element.addClass('hrm-table');
  }
}; // hrmEditableTableCell

(function () {
  var ViewModel =
  /*#__PURE__*/
  function () {
    function ViewModel(element, error) {
      _classCallCheck(this, ViewModel);

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

    _createClass(ViewModel, [{
      key: "_init",
      value: function _init() {
        var _this = this;

        var $element = $(this.element);
        $element.addClass('hrm-table__editable-cell');

        this._subscriptions.push(this.focused.subscribe(function (focused) {
          $element.toggleClass('hrm-table__editable-cell--focused', focused);
        }));

        this._windowResizeHandler = function () {
          _this._onWindowResize($(window).width(), $(window).height());
        };

        $(window).on('resize', this._windowResizeHandler);

        this._errorTippyClickHandler = function (event) {
          var $target = $(event.target);

          if ($target.hasClass('hrm-table__editable-cell-error-tooltip-close-button')) {
            _this._errorTippyInstance.hide();
          }
        };

        this._errorTippyInstance = tippy(this.element, {
          arrow: false,
          distance: 7,
          placement: 'bottom',
          onCreate: function onCreate(instance) {
            $(instance.popperChildren.tooltip).addClass('hrm-table__editable-cell-error-tooltip');
            $(instance.popperChildren.tooltip).on('click', _this._errorTippyClickHandler);
            instance.disable();
          }
        });

        this._windowResizeHandler();

        this._setError(this._error);
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        this._subscriptions.forEach(function (s) {
          return s.dispose();
        });

        $(window).off('resize', this._windowResizeHandler);
        $(this._errorTippyInstance.popperChildren.tooltip).on('click', this._errorTippyClickHandler);

        this._errorTippyInstance.destroy();
      }
    }, {
      key: "_setError",
      value: function _setError(error) {
        var _this2 = this;

        if (this._errorSubscription !== null) {
          this._errorSubscription.dispose();
        }

        if (ko.isObservable(error)) {
          this._errorSubscription = error.subscribe(function (error) {
            _this2._error = error;

            _this2._updateErrorView();
          });
          this._error = error();
        } else {
          this._error = error;
        }

        this._updateErrorView();
      }
    }, {
      key: "_updateErrorView",
      value: function _updateErrorView() {
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
    }, {
      key: "_onWindowResize",
      value: function _onWindowResize(width, height) {
        var isTableOrMobile = width <= HRM_BREAKPOINTS.tableMaxWidth;

        if (this._isTabletOrMobile !== isTableOrMobile) {
          this._isTabletOrMobile = isTableOrMobile;

          this._updateErrorView();
        }
      }
    }, {
      key: "_createErrorTooltipContent",
      value: function _createErrorTooltipContent(message) {
        return "\n                <span class=\"hrm-table__editable-cell-error-tooltip-text\">".concat(message, "</span>\n                <button class=\"hrm-button hrm-table__editable-cell-error-tooltip-close-button\">\n                </button>\n            ");
      }
    }]);

    return ViewModel;
  }();

  var instances = new Map();
  var previousBindingsList = new Map();
  ko.bindingHandlers.hrmTableEditableCell = {
    init: function init(element, valueAccessor, allBindings) {
      var error = allBindings.get('hrmTableEditableCellError');
      var viewModel = new ViewModel(element, error);
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
    update: function update(element, valueAccessor, allBindings) {
      var instance = instances.get(element);
      var previousBindings = previousBindingsList.get(element);

      if (previousBindings !== undefined) {
        if (previousBindings['hrmTableEditableCellError'] !== allBindings.get('hrmTableEditableCellError')) {
          instance._setError(allBindings.get('hrmTableEditableCellError'));
        }
      }

      previousBindingsList.set(element, allBindings());
    }
  };
})(); // hrmEditableTableCellInputControl


(function () {
  var ViewModel =
  /*#__PURE__*/
  function () {
    function ViewModel(element, owner) {
      _classCallCheck(this, ViewModel);

      this._focusHandler = null;
      this._blurHandler = null;
      this.element = element;
      this._owner = owner;

      this._init();
    }

    _createClass(ViewModel, [{
      key: "_init",
      value: function _init() {
        var _this3 = this;

        var $element = $(this.element);
        $element.addClass(['hrm-table__editable-cell-control', 'hrm-table__editable-cell-control--type_input']);

        this._focusHandler = function () {
          return ko.unwrap(_this3._owner).focused(true);
        };

        this._blurHandler = function () {
          return ko.unwrap(_this3._owner).focused(false);
        };

        $element.on('focus', this._focusHandler);
        $element.on('blur', this._blurHandler);
        ko.unwrap(this._owner).focused($element.is(':focus'));
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        var $element = $(this.element);
        $element.off('focus', this._focusHandler);
        $element.off('blur', this._blurHandler);
      }
    }]);

    return ViewModel;
  }();

  ko.bindingHandlers.hrmTableEditableCellInputControl = {
    init: function init(element, valueAccessor, allBindings) {
      var owner = allBindings.get('hrmTableEditableCellInputControlOwner');
      var viewModel = new ViewModel(element, owner);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel._destroy();
      });
    }
  };
})(); // hrmEditableTableCellSelectControl


(function () {
  var ViewModel =
  /*#__PURE__*/
  function () {
    function ViewModel(element, owner) {
      _classCallCheck(this, ViewModel);

      this._subscriptions = [];
      this._selectionFocusHandler = null;
      this._selectionBlurHandler = null;
      this._openingHandler = null;
      this._closeHandler = null;
      this.element = element;
      this._owner = owner;

      this._init();
    }

    _createClass(ViewModel, [{
      key: "_init",
      value: function _init() {
        var _this4 = this;

        var $element = $(this.element);
        var select2Instance = $element.data('select2');
        select2Instance.$container.addClass(['hrm-table__editable-cell-control', 'hrm-table__editable-cell-control--type_select']);
        select2Instance.$dropdown.children().first().addClass(['hrm-table__editable-cell-dropdown']);
        var selectionFocused = ko.observable(select2Instance.$selection.is(':focus'));
        var dropdownOpened = ko.observable(false);

        this._subscriptions.push(ko.computed(function () {
          return selectionFocused() || dropdownOpened();
        }).subscribe(function (value) {
          return ko.unwrap(_this4._owner).focused(value);
        }));

        this._selectionFocusHandler = function () {
          return selectionFocused(true);
        };

        this._selectionBlurHandler = function () {
          return selectionFocused(false);
        };

        this._openingHandler = function () {
          return dropdownOpened(true);
        };

        this._closeHandler = function () {
          return dropdownOpened(false);
        };

        select2Instance.$selection.on('focus', this._selectionFocusHandler);
        select2Instance.$selection.on('blur', this._selectionBlurHandler);
        $element.on('select2:opening', this._openingHandler);
        $element.on('select2:close', this._closeHandler);
        selectionFocused(select2Instance.$selection.is(':focus'));
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        var $element = $(this.element);
        var select2Instance = $element.data('select2');
        select2Instance.$selection.off('focus', this._selectionFocusHandler);
        select2Instance.$selection.off('blur', this._selectionBlurHandler);
        $element.off('select2:opening', this._openingHandler);
        $element.off('select2:close', this._closeHandler);

        this._subscriptions.forEach(function (s) {
          return s.dispose();
        });
      }
    }]);

    return ViewModel;
  }();

  ko.bindingHandlers.hrmTableEditableCellSelectControl = {
    init: function init(element, valueAccessor, allBindings) {
      var owner = allBindings.get('hrmTableEditableCellSelectControlOwner');
      var viewModel = new ViewModel(element, owner);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel._destroy();
      });
    }
  };
})(); // hrmTableStickySectionContainer


(function () {
  var StickyEvents = window['stickyEvents'];

  var ViewModel =
  /*#__PURE__*/
  function () {
    function ViewModel(element, sectionWrappers) {
      _classCallCheck(this, ViewModel);

      this._subscriptions = [];
      this._sectionWrappers = sectionWrappers;
      this._sectionWrapperElementStuckHandler = null;
      this._sectionWrapperElementUnstuckHandler = null;
      this.element = element;
      this._stickyEvents = null;

      this._init();
    }

    _createClass(ViewModel, [{
      key: "_init",
      value: function _init() {
        var _this5 = this;

        var $element = $(this.element);
        $element.addClass('hrm-table__sticky-section-container');
        this._stickyEvents = new StickyEvents();

        this._stickyEvents.addStickies(this._sectionWrappers());

        this._sectionWrapperElementStuckHandler = function (event) {
          var wrapper = _this5._sectionWrappers().find(function (wrapper) {
            return wrapper.element === event.target;
          });

          wrapper.stuck(true);
        };

        this._sectionWrapperElementUnstuckHandler = function (event) {
          var wrapper = _this5._sectionWrappers().find(function (wrapper) {
            return wrapper.element === event.target;
          });

          wrapper.stuck(false);
        };

        this._sectionWrappers().forEach(function (wrapper) {
          wrapper.element.addEventListener(StickyEvents.STUCK, _this5._sectionWrapperElementStuckHandler);
          wrapper.element.addEventListener(StickyEvents.UNSTUCK, _this5._sectionWrapperElementUnstuckHandler);
        });

        var lastSectionWrappers = _toConsumableArray(this._sectionWrappers());

        this._subscriptions.push(this._sectionWrappers.subscribe(function (addedWrapper) {
          _.difference(lastSectionWrappers, addedWrapper).forEach(function (removedElement) {
            removedElement.element.removeEventListener(StickyEvents.STUCK, _this5._sectionWrapperElementStuckHandler);
            removedElement.element.removeEventListener(StickyEvents.UNSTUCK, _this5._sectionWrapperElementUnstuckHandler);
          });

          _.difference(addedWrapper, lastSectionWrappers).forEach(function (addedWrapper) {
            addedWrapper.element.addEventListener(StickyEvents.STUCK, _this5._sectionWrapperElementStuckHandler);
            addedWrapper.element.addEventListener(StickyEvents.UNSTUCK, _this5._sectionWrapperElementUnstuckHandler);

            _this5._stickyEvents.addSticky(addedWrapper.element);

            $(addedWrapper.element).addClass('sticky-events');
          });

          lastSectionWrappers = _toConsumableArray(addedWrapper);
        }));
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        var _this6 = this;

        this._subscriptions.forEach(function (s) {
          return s.dispose();
        });

        this._sectionWrappers().forEach(function (wrapper) {
          wrapper.element.removeEventListener(StickyEvents.STUCK, _this6._sectionWrapperElementStuckHandler);
          wrapper.element.removeEventListener(StickyEvents.UNSTUCK, _this6._sectionWrapperElementUnstuckHandler);
        });

        this._stickyEvents.disableEvents();
      }
    }]);

    return ViewModel;
  }();

  ko.bindingHandlers.hrmTableStickySectionContainer = {
    init: function init(element, valueAccessor, allBindings) {
      var sectionWrappers = allBindings.get('hrmTableStickySectionContainerSectionWrappers');
      var viewModel = new ViewModel(element, sectionWrappers);

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


(function () {
  var ViewModel =
  /*#__PURE__*/
  function () {
    function ViewModel(element, sectionWrappers) {
      _classCallCheck(this, ViewModel);

      this._subscriptions = [];
      this.element = element;
      this.stuck = ko.observable(false);

      this._init();
    }

    _createClass(ViewModel, [{
      key: "_init",
      value: function _init() {
        var $element = $(this.element);
        $element.addClass('hrm-table__sticky-section-wrapper');
        $element.toggleClass('hrm-table__sticky-section-wrapper--stuck', this.stuck());

        this._subscriptions.push(this.stuck.subscribe(function (stuck) {
          $element.toggleClass('hrm-table__sticky-section-wrapper--stuck', stuck);
        }));
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        this._subscriptions.forEach(function (s) {
          return s.dispose();
        });
      }
    }]);

    return ViewModel;
  }();

  ko.bindingHandlers.hrmTableStickySectionWrapper = {
    init: function init(element, valueAccessor) {
      var viewModel = new ViewModel(element);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// hrmTooltip
(function () {
  var ViewModel =
  /*#__PURE__*/
  function () {
    function ViewModel(element, text) {
      var _this = this;

      _classCallCheck(this, ViewModel);

      this._subscriptions = [];
      this._textSubscription = null;

      this._clickHandler = function () {
        _this._tippyInstance.show();
      };

      this._text = null;
      this.element = element;
      this._tippyInstance = null;

      this._init(text);
    }

    _createClass(ViewModel, [{
      key: "_init",
      value: function _init(text) {
        var _this2 = this;

        $(this.element).on('click', this._clickHandler);

        this._tooltipClickHandler = function (event) {
          var $target = $(event.target);

          if ($target.hasClass('hrm-tooltip__close-button')) {
            _this2._tippyInstance.hide();
          }
        };

        this._tippyInstance = tippy(this.element, {
          arrow: false,
          distance: 7,
          placement: 'bottom',
          interactive: true,
          appendTo: document.body,
          boundary: 'viewport',
          hideOnClick: false,
          trigger: 'manual',
          onCreate: function onCreate(instance) {
            $(instance.popperChildren.tooltip).addClass('hrm-tooltip');
            $(instance.popperChildren.tooltip).on('click', _this2._tooltipClickHandler);
          }
        });

        this._setText(text);
      }
    }, {
      key: "_setText",
      value: function _setText(text) {
        var _this3 = this;

        if (this._textSubscription !== null) {
          this._textSubscription.dispose();
        }

        if (ko.isObservable(text)) {
          this._textSubscription = text.subscribe(function (text) {
            _this3._text = text;

            _this3._update();
          });
          this._text = text();
        } else {
          this._text = text;
        }

        this._update();
      }
    }, {
      key: "_update",
      value: function _update() {
        this._tippyInstance.setContent(this._createContent(this._text));
      }
    }, {
      key: "_createContent",
      value: function _createContent(text) {
        return "\n                <div class=\"hrm-tooltip__text\">".concat(text, "</div>\n                <button class=\"hrm-button hrm-tooltip__close-button\">\u041E\u043A</button>\n            ");
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        this._subscriptions.forEach(function (s) {
          return s.dispose();
        });

        $(this.element).off('click', this._clickHandler);
      }
    }]);

    return ViewModel;
  }();

  var instances = new Map();
  var previousBindingsList = new Map();
  ko.bindingHandlers.hrmTooltip = {
    init: function init(element, valueAccessor, allBindings) {
      var text = allBindings.get('hrmTooltipText');
      var viewModel = new ViewModel(element, text);
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
    update: function update(element, valueAccessor, allBindings) {
      var instance = instances.get(element);
      var previousBindings = previousBindingsList.get(element);

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
