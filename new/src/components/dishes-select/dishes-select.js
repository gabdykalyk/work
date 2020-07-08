let DishesSelect = {
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
};

ko.components.register('dishes-select', {
  viewModel: function (params) {
    this.dishes = params.dishes;
    this.isLoaded = ko.observable(false);

    this.dishesList = ko.observableArray([]);

    this.control = params.control;

    if (params.dishesList) {
      this.dishesList(params.dishesList);
      this.isLoaded(true);
    } else {
      DishesSelect.load().then(() => {
        this.dishesSet = DishesSelect.dishes;
        this.isLoaded(true);
      });
    }

    this.renderDishesSelectBlock = (el) => {
      DishesSelect.render().then(() => {
        this._renderDishesSelectBlock(el)
      });
    };

    this._renderDishesSelectBlock = (el) => {
      const that = this;
      const select = el.querySelector('select');
      const selectClone = DishesSelect.html.cloneNode(true);
      $(select).append($(selectClone).children());
      $(select)
        .find('option')
        .each(function (index, option) {
          option.selected = that.dishes().includes(option.value);
        });
      ko.applyBindingsToNode(select, {
        selectedOptions: this.dishes,
        valueAllowUnset: true,
        hrmSelect: true,
        hrmSelectPlaceholder: 'Все',
        hrmSelectAllowClear: true,
        hrmFormFieldSelectControl: params.control,
        hrmFormFieldSelectControlErrorStateMatcher: params.errorStateMatcher,
        select2: {
          containerCssClass: 'form-control',
          wrapperCssClass:
            'select2-container--form-control conditions-list__dish-select',
          allowClear: false,
          placeholder: 'Не выбрано',
          templateSelection: this.dishesAndCategoriesTemplateSelection,
          templateResult: this.dishesAndCategoriesTemplateResult,
          matcher: this.dishesAndCategoriesMatcher,
          minimumResultsForSearch: 0,
        },
        visible: true,
        event: {
          change: (_, event) => {
            this.dishesAndCategoriesChange(event);
          },
        },
      });
    };

    this.dishesAndCategoriesMatcher = ({ term }, data) => {
      if (!term) {
        return data;
      }

      term = term.toLowerCase();

      if (!data.id) {
        return null;
      }

      if (data.id[0] != 'c') {
        const categoryId = data.element.dataset.category;
        const category = this.dishesSet().find((c) => c.id === categoryId);
        if (!category) return null;

        const categoryName = category.name.toLowerCase();
        const dishText = data.text.toLowerCase();

        const match = categoryName.includes(term) || dishText.includes(term);
        return match ? data : null;
      } else {
        const category = this.dishesSet().find(
          (c) => c.id === data.id.slice(1),
        );
        if (!category) return null;

        const categoryName = category.name.toLowerCase();

        const match =
          categoryName.includes(term) ||
          category.dishes.some((d) => {
            return d.name.toLowerCase().includes(term);
          });
        return match ? data : null;
      }
    };

    this.dishesAndCategoriesTemplateSelection = function selection(state) {
      if (!state.id) {
        return state.text;
      }
      var $result = $('<span>').text(state.text);

      if (state.id[0] == 'c') {
        $result.addClass('dish-category-value');
      }
      return $result;
    };
    this.dishesAndCategoriesTemplateResult = function result(state) {
      if (!state.id) {
        return state.text;
      }

      var $result = $('<span>').text(state.text);

      if (state.id[0] == 'c') {
        $result.addClass('dish-category-option');
      } else {
        $result.addClass('dish-option');
      }

      return $result;
    };

    this.dishesAndCategoriesChange = function onChange(event) {
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
            }
          }
        });

        var newValue = [].concat(
          _toConsumableArray(selectedCategories),
          _toConsumableArray(selectedOptions),
        );

        $(event.target).val(newValue).trigger('change.select2');
      }
    };
  },
  template: `
  <!-- ko template: { onRender: renderDishesSelectBlock } -->
  <template id="dishes-select-template">
    <option></option>
    <!-- ko foreach: { data : $data.categories, as: 'category'} -->
    <option data-bind="attr: { value: 'c' + category.id, 'data-category': category.id }, text: category.name"></option>
    <!-- ko foreach: { data: category.dishes, as: 'dish' } -->
    <option data-dish data-bind="attr: { value: 'd' + dish.id, 'data-category': category.id }, text: dish.name"></option>
    <!-- /ko -->
    <!-- /ko -->
  </template>

  <div class="dishes-select" data-bind="descendantsComplete: renderDishesSelectBlock">
  <select multiple data-bind="visible: false, hrmFormFieldSelectControl: control" data-placeholder="Не выбрано">
  </select>
  </div>
  `,
});
