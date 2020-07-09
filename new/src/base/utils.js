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
  },
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
  },
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
  },
};

ko.bindingHandlers.hrmMask = {
  init: function (element, valueAccessor, allBindings) {
    // DEPRECATED! Use options.alias instead.
    const pattern = allBindings.get('hrmMaskPattern');

    let options = allBindings.get('hrmMaskOptions');

    if (pattern !== undefined) {
      if (options !== undefined) {
        options = { alias: pattern, ...options };
      } else {
        options = { alias: pattern };
      }
    }

    $(element).inputmask({
      jitMasking: true,
      showMaskOnFocus: false,
      showMaskOnHover: false,
      ...options,
    });
  },
};

ko.bindingHandlers.hrmTimeAutocompleter = {
  init: function (element) {
    $(element).on('blur', () => {
      const value = $(element).val();

      const regExpExecuteResult = /^([0-9]{2}):\s$/.exec(value);

      if (regExpExecuteResult !== null && +regExpExecuteResult[1] < 24) {
        $(element)
          .val(regExpExecuteResult[1] + ':00')
          .trigger('change');
      }
    });
  },
};

function hrmSplitComponentTemplateNodes(nodes) {
  const result = {
    main: [],
    slots: {},
  };

  $(nodes)
    .filter('hrm-slot')
    .each((index, slotElement) => {
      const $slot = $(slotElement);
      result.slots[$slot.attr('name')] = $slot.contents();
    });

  result.main = nodes.filter((node) => {
    return !(node.nodeType === 1 && node.tagName === 'HRM-SLOT');
  });

  return result;
}

function hrmSlideBeforeRemoveFactory(duration = 200, delay = 0) {
  return (element) =>
    $(element)
      .delay(delay)
      .slideUp(duration, () => $(element).remove());
}

function hrmSlideAfterAddFactory(duration = 200, delay = 0) {
  return (element) => $(element).hide().delay(delay).slideDown(duration);
}

function hrmFadeBeforeRemoveFactory(duration = 200, delay = 0) {
  return (element) =>
    $(element)
      .delay(delay)
      .fadeOut(duration, () => $(element).remove());
}

function hrmFadeAfterAddFactory(duration = 200, delay = 0) {
  return (element) => $(element).hide().delay(delay).fadeIn(duration);
}

ko.validation.rules['hrmDate'] = {
  validator: function (val, params) {
    return moment(val, params, true).isValid();
  },
  message: 'Неверный формат даты и времени',
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
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext,
  ) {
    console.group('hrmLog');
    console.info('element', element);
    console.info('valueAccessor', valueAccessor());
    console.info('allBindings', allBindings());
    console.info('viewModel', viewModel);
    console.info('bindingContext', bindingContext);
    console.groupEnd('hrmLog');
  },
};

ko.bindingHandlers.hrmAutoResize = {
  init: function (element) {
    const autoResizeInstance = $(element).addClass('hrm-auto-resize').autoResize();
    $(element).data('resizeInstance', autoResizeInstance);
    $(element).on('reset', () => {
      $(element).height('');
    });
  },
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
  },
};

ko.bindingHandlers.stopEvents = {
  init: function(element) {
    $(element).on('click input change mousedown', e => {
      e.stopPropagation();
    })
  }
}
