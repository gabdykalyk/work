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
  init: function init(element, valueAccessor) {
    if (ko.isObservableArray(valueAccessor())) {
      valueAccessor().push(element);
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
  return function (element) {
    return $(element).slideUp(duration, function () {
      return $(element).remove();
    });
  };
}

function hrmSlideAfterAddFactory() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  return function (element) {
    return $(element).hide().slideDown(duration);
  };
}

ko.validation.rules['hrmTime'] = {
  validator: function validator(val) {
    return val.length === 5 && moment(val, 'HH:mm').isValid();
  },
  message: 'Неверный формат времени'
};
ko.validation.registerExtenders();
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
    var select2Instance = $element.data('select2');
    var selectionFocused = ko.observable(select2Instance.$selection.is(':focus'));
    var dropdownOpened = ko.observable(false);
    subscriptions.push(ko.computed(function () {
      return selectionFocused() || dropdownOpened();
    }).subscribe(function (value) {
      return formField().focused(value);
    }));
    $element.attr('id', formField().controlId);
    select2Instance.$container.addClass(['hrm-form-field__control', 'hrm-form-field__control--type_select']);
    select2Instance.$dropdown.children().first().addClass(['hrm-form-field__dropdown']);

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

    var focusHandler = function focusHandler() {
      return selectionFocused(true);
    };

    var blurHandler = function blurHandler() {
      return selectionFocused(false);
    };

    var openingHandler = function openingHandler() {
      return dropdownOpened(true);
    };

    var closingHandler = function closingHandler() {
      return dropdownOpened(false);
    };

    var valueHandler = function valueHandler(event) {
      var value = event.target.value;
      formField().hasValue(value !== '');
    };

    select2Instance.$selection.on('focus', focusHandler);
    select2Instance.$selection.on('blur', blurHandler);
    $wrapper.on('mousedown', wrapperMousedownHandler);
    $element.on('input change', valueHandler);
    $element.on('select2:opening', openingHandler);
    $element.on('select2:closing', closingHandler);
    formField().focused(select2Instance.$selection.is(':focus'));
    formField().hasValue($element.val() !== '');
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      subscriptions.forEach(function (s) {
        return s.dispose();
      });
      $wrapper.off('mousedown', wrapperMousedownHandler);
      select2Instance.$selection.off('focus', focusHandler);
      select2Instance.$selection.off('blur', blurHandler);
      $(element).off('input change', valueHandler);
      $element.off('select2:opening', openingHandler);
      $element.off('select2:closing', closingHandler);
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
    var value = allBindings.get('value');
    var wrapperClass = allBindings.get('hrmSelectClass');
    var options = {
      minimumResultsForSearch: Infinity,
      language: 'ru',
      width: '100%',
      dropdownAutoWidth: true,
      dropdownCssClass: 'hrm-select__dropdown',
      placeholder: ' '
    };

    if (value) {
      $element.val(ko.utils.unwrapObservable(value));
    }

    var Select = $.fn.select2.amd.require('jquery.select2');

    var originalSelectRenderFn = Select.prototype.render;

    Select.prototype.render = function () {
      var $container = originalSelectRenderFn.call.apply(originalSelectRenderFn, [this].concat(Array.prototype.slice.call(arguments)));
      $container.addClass('hrm-select');

      if (wrapperClass !== undefined) {
        $container.addClass(wrapperClass.split(' '));
      }

      return $container;
    };

    $element.select2(options);
    Select.prototype.render = originalSelectRenderFn;
    var select2Instance = $element.data('select2');
    select2Instance.$results.unbind('mousewheel');
    var $dropdownResultsContainer = $element.data('select2').$results.parent();
    $dropdownResultsContainer.overlayScrollbars({
      callbacks: {
        onUpdated: function onUpdated() {
          select2Instance.dropdown._positionDropdown();
        }
      }
    });

    var openHandler = function openHandler() {
      $dropdownResultsContainer.overlayScrollbars().update(true);
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

    var changeHandler = function changeHandler() {
      if (value !== undefined && ko.isObservable(value)) {
        var _value = $element.val();

        _value(_value);
      }
    };

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      $element.off('change', changeHandler);
      $element.off('select2:open', openHandler);
      $element.off('select2:opening', openingHandler);
      $element.off('select2:closing', closingHandler);
    });
  },
  update: function update(element, valueAccessor, allBindings) {
    var $element = $(element);
    var value = allBindings.get('value');

    if (value !== undefined && ko.isObservable(value)) {
      value.subscribe(function (v) {
        $element.val(v).trigger('change');
      });
    }
  }
};
"use strict";

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

      this._focusHandler = null;
      this._blurHandler = null;
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

        this._focusHandler = function () {
          return ko.unwrap(_this4._owner).focused(true);
        };

        this._blurHandler = function () {
          return ko.unwrap(_this4._owner).focused(false);
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

  ko.bindingHandlers.hrmTableEditableCellSelectControl = {
    init: function init(element, valueAccessor, allBindings) {
      var owner = allBindings.get('hrmTableEditableCellSelectControlOwner');
      var viewModel = new ViewModel(element, owner);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel._destroy();
      });
    }
  };
})();
//# sourceMappingURL=main.js.map
