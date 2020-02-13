ko.components.register('hrm-basic-footer', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['hrm-basic-footer']);

            return new (function () {});
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