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
        })


        // if (params !== undefined && 'checked' in params) {
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
        this._subscriptions.forEach((s) => s.dispose());
      };

      return new ViewModel();
    },
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
  `,
});
