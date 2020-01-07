ko.components.register('hrm-footer', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-footer']);

            return new (function () {});
        }
    },
    template: `
        <div class="hrm-footer__branding">
            <div class="hrm-footer__logo"></div>
            <span class="hrm-footer__copyright">© Lookin, 2020</span>
        </div>
        <a class="hrm-footer__support-link" href="#">Техническая поддержка</a>
    `
});