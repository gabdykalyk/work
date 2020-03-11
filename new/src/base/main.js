const HRM_BREAKPOINTS = {
    tabletMaxWidth: 1200,
    mobileMaxWidth: 767
};

ko.validation.init({insertMessages: false});

moment.locale('ru');

const HRM_SIDEBAR_COLLAPSED_LOCAL_STORAGE_KEY = 'hrmSidebarCollapsed';

// Fix stacking modals
$(document).on('hidden.bs.modal', function (event) {
    //const scrollbarWidth = $(event.target).data("bs.modal")._scrollbarWidth;

    if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
        //$('body').css('padding-right', scrollbarWidth);
    }

    $('.modal:visible').last().focus();
});
