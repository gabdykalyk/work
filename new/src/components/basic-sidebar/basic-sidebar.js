ko.components.register('hrm-basic-sidebar', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-basic-sidebar']);

            return new (function () {});
        }
    },
    template: `
        <button class="hrm-button hrm-circle-icon-button hrm-circle-logout-icon-button hrm-basic-sidebar__logout-button"
                title="Войти/зарегистрироваться">
        </button>
        <a class="hrm-basic-sidebar__support-link" href="#" title="Помощь"></a>
    `
});
