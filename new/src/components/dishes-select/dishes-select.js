function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.DishesSelect = {
  loaded: ko.observable(false),
  loading: ko.observable(false),
  loadPromise: null,
  dishes: [],
  load() {
    this.loadPromise = new Promise((res) => {
      if (this.loaded()) {
        res();
        return;
      }
      this.loading(true);
      setTimeout(() => {
        // Загрузить блюда
        this.dishes = [
          {
            id: '1',
            name: 'Напитки',
            dishes: [
              {
                id: '373',
                name: 'Кока кола',
              },
              {
                id: '374',
                name: 'Фанта',
              },
              {
                id: '665',
                name: 'Аква мин.',
              },
            ],
          },
          {
            id: '2',
            name: 'Салаты',
            dishes: [
              {
                id: '1373',
                name: 'Морковь по-корейски',
              },
              {
                id: '1374',
                name: 'Армейский с квашеной капустой',
              },
              {
                id: '1665',
                name: 'Баклажаны имеретинские',
              },
            ],
          },
          {
            id: '3',
            name: 'Вторые блюда',
            dishes: [
              {
                id: '3373',
                name: 'Рис с овощами+куриная грудка гриль',
              },
              {
                id: '3374',
                name: 'Паста с сыром и зеленью+свинина в соусе BBQ',
              },
              {
                id: '3665',
                name: 'Цветная капуста в яйце+рыбные тефтели терияки',
              },
            ],
          },
          {
            noCategory: true,
            id: '',
            name: '',
            dishes: [
              {
                id: '5373',
                name: 'Блюдо без категории 1',
              },
              {
                id: '5374',
                name: 'Блюдо без категории 2',
              },
              {
                id: '5665',
                name: 'Блюдо без категории 3',
              },
            ]
          }
        ];
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
      ko.renderTemplate(
        'dishes-select-template',
        {
          categories: this.dishes,
        },
        {},
        this.html,
      );
      this.rendered(true);
      res();
    })

  },
  matcher({ term }, data) {
    if (!term) {
      return data;
    }

    term = term.toLowerCase();

    if (!data.id) {
      return null;
    }

    if (data.id[0] != 'c') {
      const categoryId = data.element.dataset.category;
      const category = DishesSelect.dishes.find((c) => c.id === categoryId);
      if (!category) return null;

      const categoryName = category.name.toLowerCase();
      const dishText = data.text.toLowerCase();

      const match = categoryName.includes(term) || dishText.includes(term);
      return match ? data : null;
    } else {
      const category = DishesSelect.dishes.find(
        (c) => c.id === data.id.slice(1),
      );
      if (!category) return null;
      if (!category.id) return null;

      const categoryName = category.name.toLowerCase();

      const match =
        categoryName.includes(term) ||
        category.dishes.some((d) => {
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
            if (selectedOptions.includes(optionValue)) {

            }
          }
        }
      });

      var newValue = [].concat(
        _toConsumableArray(selectedCategories),
        _toConsumableArray(selectedOptions),
      );

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
    })

    return {
      controlsDescendantBindings: true
    };
  }
}
