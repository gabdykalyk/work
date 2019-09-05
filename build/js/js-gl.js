function initNavbar() {
    $('#navbar-toggle').click(function () {
        var window_w = $(window).width();
        var body = $('body');
        var navbar = $('.navbar');
        var login = $('.navbar-login');
        var panel_collapse = $('#navbar-collapse-block');
        var btn = $(this);
        var is_show_panel = $(this).attr('class').indexOf('collapsed');

        if (window_w < 992) {
            if (is_show_panel == -1) {
                panel_collapse.removeClass('in');
                btn.addClass('collapsed');
                $('.modal-backdrop-navbar').remove();
                body.removeClass('modal-open');
                body.css('padding-right', '0px');
                login.removeClass('navbar-login-collapse');
            } else {
                panel_collapse.addClass('in');
                btn.removeClass('collapsed');
                navbar.append('<div class="modal-backdrop modal-backdrop-navbar fade in"></div>');
                body.addClass('modal-open');
                body.css('padding-right', '17px');
                login.addClass('navbar-login-collapse');
            }
        } else {
            if (is_show_panel == -1) {
                panel_collapse.removeClass('in');
                btn.addClass('collapsed');

            } else {
                panel_collapse.addClass('in');
                btn.removeClass('collapsed');
            }
        }
    });

    $("[data-toggle=popover]").each(function (i, obj) {
        var id = $(this).attr('id');

        $(this).popover({
            html: true,
            content: function () {
                return $('#popover-content-' + id).html();
            },
            template: '<div class="popover popover-' + id +
                '" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
        });

        $(this).on('shown.bs.popover', function (e) {
            $('.scrollbar-inner').scrollbar();
        });

        $(this).on('hidden.bs.popover', function (e) {
            $('.scrollbar-inner').scrollbar('destroy');
        });
    });
}

(function($) {
    $.fn.inputFilter = function(inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };
}(jQuery));


$.widget("custom.hatNavbarContentsSearchField", $.ui.autocomplete, {
    _renderItem: function (ul, item) {
        console.log(item);

        const text = $('<div/>').html(item.label).text();

        return $('<a>')
            .addClass('hat-navbar__contents-search-field-item')
            .attr('href', item.link)
            .text(text)
            .appendTo(ul);
    },

    _renderMenu: function (ul, items) {
        const that = this;
        $.each(items.slice(0, 5), function (index, item) {
            that._renderItemData(ul, item);
        });
        $(ul).addClass('hat-navbar__contents-search-field-list');
    }
});

class HatNavbar {
    constructor(element) {
        this._isCollapsed = false;
        this._isUserSelected = false;
        this._isNotificationsSelected = false;
        this._selectedMenuItemIndex = null;
        this._selectedDrawerContentName = null;
        this._$element = $(element);
        this._$toggleElement = this._$element.find('.hat-navbar__toggle');
        this._$menuItems = this._$element.find('.hat-navbar__menu-item');
        this._$user = this._$element.find('.hat-navbar__user');
        this._$notifications = this._$element.find('.hat-navbar__notifications');
        this._$drawer = this._$element.find('.hat-navbar__drawer');
        this._$additionalUserName = this._$element.find('.hat-navbar__additional-user-name');
        this._$backdrop = this._$element.find('.hat-navbar__backdrop');

        this._drawerContents = new Map(
            this._$element.find('.hat-navbar__drawer-content')
                .toArray()
                .map(element => {
                    const $element = $(element);
                    return [$element.data('hat-navbar-drawer-content-name'), $element];
                })
        );

        this._$contentsSearchField = this._$element.find('.hat-navbar__contents-search-field');
        this._$contentsSubmenuItems = this._$element.find('.hat-navbar__contents .hat-navbar__submenu-item');

        this._init();
    }

    _init() {
        this._$element.find('.hat-navbar__user').on('click', async () => {
            if (this._isUserSelected) {
                this.clearSelection();
            } else {
                this.selectUser();
            }
        });

        this._$element.find('.hat-navbar__drawer-content-wrapper').scrollbar();

        this._$element.find('.hat-navbar__notifications').on('click', async () => {
            if (this._isNotificationsSelected) {
                this.clearSelection();
            } else {
                this.selectNotifications();
            }
        });

        this._$backdrop.on('click', async () => {
            this.clearSelection();
        });

        this._$toggleElement.on('click', () => this.setCollapsed(!this._isCollapsed));

        this._$menuItems.each((index, menuItem) => {
            $(menuItem).on('click', () => {
                if (this._selectedMenuItemIndex === index) {
                    this.clearSelection();
                } else {
                    this.selectMenuItem(index);
                }
            });
        });

        const $contentsSearchFieldInput = this._$contentsSearchField.find('.hat-navbar__contents-search-field-input');

        $contentsSearchFieldInput.hatNavbarContentsSearchField({
            appendTo: this._$contentsSearchField,
            source: this._$contentsSubmenuItems.toArray().map(i => {
                return {
                    label: i.text,
                    value: i.text,
                    link: i.getAttribute('href')
                }
            })
        });

        $contentsSearchFieldInput.on('input', event => {
            this._$contentsSearchField.toggleClass('hat-navbar__contents-search-field--empty', event.target.value.length === 0);
        });

        this._$contentsSearchField.find('.hat-navbar__contents-search-field-clear-button').on('click', () => {
            $contentsSearchFieldInput.val('');
            this._$contentsSearchField.addClass('hat-navbar__contents-search-field--empty');
        })
    }

    setCollapsed(isCollapsed) {
        this._isCollapsed = isCollapsed;
        this._$element.toggleClass('hat-navbar--collapsed', isCollapsed);

        if (isCollapsed) {
            this._$additionalUserName.show(200, 'easeInCubic');
        } else {
            this._$additionalUserName.hide(200, 'easeInCubic');
        }

        const $toggleIcon = this._$toggleElement.find('i');

        if (isCollapsed) {
            $toggleIcon.addClass('fa-chevron-right');
            $toggleIcon.removeClass('fa-chevron-left');
        } else {
            $toggleIcon.addClass('fa-chevron-left');
            $toggleIcon.removeClass('fa-chevron-right');
        }
    }

    async selectUser() {
        if (!this._isUserSelected) {
            await this.clearSelection();

            this._$user.addClass('hat-navbar__user--active');
            this._isUserSelected = true;
            await this._openDrawer('user');
        }
    }

    async selectNotifications() {
        if (!this._isNotificationsSelected) {
            await this.clearSelection();

            this._$notifications.addClass('hat-navbar__notifications--active');
            this._isNotificationsSelected = true;
            await this._openDrawer('notifications');
        }
    }

    async selectMenuItem(index) {
        if (this._selectedMenuItemIndex !== index) {
            await this.clearSelection();

            this._$menuItems.eq(index).addClass('hat-navbar__menu-item--active');
            this._selectedMenuItemIndex = index;
            this._isUserSelected = false;
            await this._openDrawer(this._$menuItems.eq(index).data('hat-navbar-drawer-content-name'));
        }
    }

    async clearSelection() {
        if (this._selectedMenuItemIndex !== null) {
            this._$menuItems.eq(this._selectedMenuItemIndex).removeClass('hat-navbar__menu-item--active');
            this._selectedMenuItemIndex = null;
        } else if (this._isUserSelected) {
            this._$user.removeClass('hat-navbar__user--active');
            this._isUserSelected = false;
        } else if (this._isNotificationsSelected) {
            this._$notifications.removeClass('hat-navbar__notifications--active');
            this._isNotificationsSelected = false;
        }

        await this._closeDrawer();
    }

    async _openDrawer(contentName) {
        if (this._selectedDrawerContentName !== contentName) {
            await this._closeDrawer();

            const $drawerContent = this._drawerContents.get(contentName);

            $drawerContent.addClass('hat-navbar__drawer-content--active');
            this._$drawer.addClass('hat-navbar__drawer--open');
            this._$backdrop.addClass('hat-navbar__backdrop--visible');

            if ($drawerContent.data('hat-navbar-drawer-class') !== undefined) {
                this._$drawer.addClass($drawerContent.data('hat-navbar-drawer-class'));
            }

            this._selectedDrawerContentName = contentName;
        }
    }

    async _closeDrawer() {
        if (this._selectedDrawerContentName !== null) {
            this._$drawer.removeClass('hat-navbar__drawer--open');
            this._$backdrop.removeClass('hat-navbar__backdrop--visible');

            await new Promise(resolve => setTimeout(resolve, 200));

            const $drawerContent = this._drawerContents.get(this._selectedDrawerContentName);

            this._$drawer.removeClass($drawerContent.data('hat-navbar-drawer-class'));

            $drawerContent.removeClass('hat-navbar__drawer-content--active');

            this._selectedDrawerContentName = null;
        }
    }
}

function initHatNavbar(element) {
    const $navbar = $(element).find('.hat-navbar');
    new HatNavbar($navbar.get());
}

function initSearch(searchInputElement, items, valueExtractorFn) {
    $(searchInputElement).on('input', event => {
        const searchValue = event.target.value.toLowerCase();

        $(items).each((_, item) => {
            const value = valueExtractorFn(item).toLowerCase();
            $(item).toggle(value.indexOf(searchValue) !== -1);
        });
    });
}

function switchPayments(lnk) {
    $('.nav-pay li').removeClass('active');
    lnk.parent().addClass('active');

    var pay = lnk.attr('data-payment');
    var pay = lnk.attr('data-payment');
    $('.row-pay').hide();
    $('.row-pay-' + pay).css('display', 'block');
}

function selectPlaceholder(selectID) {
    var COLOR_PLACEHOLDER = '#999';
    var COLOR_SELECT = '#000';

    var selected = $(selectID + ' option:selected');
    var val = selected.val();

    $(selectID + ' option').css('color', COLOR_SELECT);
    selected.css('color', COLOR_PLACEHOLDER);

    if (val == "") {
        $(selectID).css('color', COLOR_PLACEHOLDER);
    }
    ;

    $(selectID).change(function () {
        var val = $(selectID + ' option:selected').val();
        if (val == "") {
            $(selectID).css('color', COLOR_PLACEHOLDER);
        } else {
            $(selectID).css('color', COLOR_SELECT);
        }
        ;
    });
};

function initShowDoc() {
    var win_width = $(window).width();

    if (win_width > 991) {
        $('#docs-cand .cell-name a').mouseover(function () {
            showDoc($(this), 'over');
        });
        $('#docs-cand .cell-name a').mouseout(function () {
            hideDoc();
        });

    } else {
        $('#docs-cand .cell-name a').click(function () {
            showDoc($(this), 'click');
            return false;
        });
    }
}

function showDoc(lnk, evnt) {
    var body = $('body');
    var img_src = lnk.attr('href');
    var win_width = $(window).width();

    var tooltip;
    var coord_top, coord_left;

    if (evnt == 'over') {
        body.append('<div class="block-tooltip"><img src="' + img_src + '" alt=""></div>');
        tooltip = $('.block-tooltip');

        coord_top = lnk.offset().top - tooltip.height();
        coord_left = lnk.offset().left + lnk.width();

        tooltip.css({'top': coord_top, 'left': coord_left});

        tooltip.show({
            duration: 300
        });

    } else {
        body.append('<div class="block-tooltip block-tooltip-fix"><img src="' + img_src + '" alt=""><button type="button" class="btn btn-default btn-close-tooltip" title="Закрыть"><i class="fa fa-times" aria-hidden="true"></i></button></div>');
        tooltip = $('.block-tooltip');

        console.log(tooltip.width());

        if (win_width < 768) {
            tooltip.css({'margin-left': -tooltip.width() / 2});
        } else {
            tooltip.css({'margin-left': -tooltip.width() / 2, 'margin-top': -tooltip.height() / 2});
        }

        tooltip.show({
            duration: 300,
            start: function () {
                body.append('<div class="modal-backdrop modal-backdrop-tooltip fade in"></div>');

                if (win_width < 768) {
                    body.addClass('modal-open');
                }

                $('.btn-close-tooltip, .modal-backdrop-tooltip').bind('click', function () {
                    hideDoc();
                });
            }
        });
    }
}

function hideDoc() {
    $('body').removeClass('modal-open');
    $('.block-tooltip').remove();
    $('.modal-backdrop-tooltip').remove();
}

function initSurcharge(number = 0) {
    var count = $('.js-surcharge').length;
    if (number != 0) {
        $('.form-surcharge').attr('surcharge-number', number);
    } else {
        $('.form-surcharge').attr('surcharge-number', count);
    }
}

function changeSurchargePeriodType() {
    var select = $(document).find('.js-emplsurcharge-period'),
        now = $(document).find('.js-emplsurcharge-period').val(),
        block = select.closest('.js-surcharge'),
        types = block.find('.js-types');

    types.find('.form-group').hide();
    types.find('.form-group[data-type="' + now + '"]').show();
}

function changeSurchargeType() {
    var checked = $(document).find('.js-surcharge-type:checked'),
        type = checked.data('type'),
        to = checked.closest('.js-surcharge-price').find('.js-surcharge-type-label');

    if (type == 'percent') {
        to.html('%');
    } else {
        to.html('<i class="fa fa-rouble"></i>');
    }
}

// инициализация информационного окна для кол-ва заказов
function initTooltipProviders() {
    var win_width = $(window).width();

    if (win_width > 991) {
        $('.table-providers .cell-sum.td-red').tooltip({
            html: true,
            title: $(this).attr('data-title'),
            container: '.table-responsive-wrapper-provider',
            template: '<div class="tooltip-provider tooltip top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });

    } else {
        $('.table-providers .cell-sum.td-red').tooltip({
            html: true,
            title: $(this).attr('data-title'),
            trigger: 'click',
            container: '.table-responsive-wrapper-provider',
            template: '<div class="tooltip-provider tooltip top" role="tooltip"><button type="button" class="btn btn-close" onclick="hideTooltipProviders();"><i class="fas fa-times"></i></button><div class="tooltip-inner"></div></div>'
        });
    }
}

function hideTooltipProviders() {
    $('.table-providers .cell-sum.td-red').tooltip('hide');
}

// инициализация блока фильтров для раздела Сотрудники
function changeHeightCellMobile(table) {
    resetDefaultHeight(table);
    var h = setDefaultHeightCell(table);
    h = calcMaxHeightCell(table, h);
    setHeightCellMobile(table, h);
}

var resetDefaultHeight = function (table) {
    table.find('thead > tr > th.js-cell-mobile').each(function (key, value) {
        $(value).removeAttr('style');
    });
    var tr, td, td_h;
    table.find('tbody > tr').each(function (key, value) {
        tr = $(value);
        tr.find('td.js-cell-mobile').each(function (key, value) {
            td = $(value)
            td.removeAttr('style');
        });
    });
}

function setDefaultHeightCell(table) {
    var h = [];
    var h_size = table.find('thead > tr > th.js-cell-mobile').size();
    for (var i = 0; i < h_size; i++) {
        h[i] = 0;
    }

    var th, th_h;
    table.find('thead > tr > th.js-cell-mobile').each(function (key, value) {
        th = $(value)
        th_h = th.outerHeight();
        h[key] = th_h;
    });

    return h;
}

function calcMaxHeightCell(table, h) {
    var tr, td, td_h;

    table.find('tbody > tr').each(function (key, value) {
        tr = $(value);

        tr.find('td.js-cell-mobile').each(function (key, value) {
            td = $(value)
            td_h = td.outerHeight();

            if (td_h > h[key]) h[key] = td_h;
        });
    });

    return h;
}

function setHeightCellMobile(table, h) {
    var tr, td, th;

    table.find('tbody > tr').each(function (key, value) {
        tr = $(value);

        tr.find('td.js-cell-mobile').each(function (key, value) {
            td = $(value);
            td.css('height', h[key]);
        });
    });

    table.find('thead > tr > th.js-cell-mobile').each(function (key, value) {
        th = $(value);
        th.css('height', h[key]);
    });
}

var resetDefaultHeightTR = function (table) {
    table.find('thead > tr > th.js-cell-mobile').each(function (key, value) {
        $(value).removeAttr('style');
    });
    var tr, td, td_h;
    table.find('tbody > tr').each(function (key, value) {
        tr = $(value);
        tr.removeAttr('style');
        tr.find('td.js-cell-mobile').each(function (key, value) {
            td = $(value)
            td.removeAttr('style');
        });
    });
}

function setHeightCellReverse(table, h) {
    var tr, td, th;
    table.find('tbody > tr.js-row').each(function (key, value) {
        tr = $(value).css('height', h[key]);
    });
    table.find('thead > tr > th.js-cell-mobile').each(function (key, value) {
        th = $(value);
        th.css('height', h[key]);
    });
}

// Вызов скролла внутри модалки
$('#modalLaw, #modalRoleFines, .modal-report').on('shown.bs.modal', function (e) {
    $(document).ready(function () {
        $('.scrollbar-inner').scrollbar();
    });
});

// Проверяет, выбран ли элемент в select2
var isItemInSelect2 = (function (item, itemName, now) {
    return now.indexOf(itemName) > -1;
});
// Показывает блоки, которые выбраны в select2
var showOrHideBlock = (function (item, itemName, now) {
    return (isItemInSelect2(item, itemName, now) ? item.show() : item.hide());
});

// Функция задает placeholder для select2
var placeholderSelect2 = (function (select, placeholder) {
    return $(select).select2({
        width: '100%',
        placeholder: placeholder,
    });
});

// Массив data для выбора даты в select2
var dataDays = [
    {
        "text": "",
        "children": [
            {id: 1, text: '1'},
            {id: 2, text: '2'},
            {id: 3, text: '3'},
            {id: 4, text: '4'},
            {id: 5, text: '5'},
            {id: 6, text: '6'},
            {id: 7, text: '7'}
        ]
    },
    {
        "text": "",
        "children": [
            {id: 8, text: '8'},
            {id: 9, text: '9'},
            {id: 10, text: '10'},
            {id: 11, text: '11'},
            {id: 12, text: '12'},
            {id: 13, text: '13'},
            {id: 14, text: '14'}
        ]
    },
    {
        "text": "",
        "children": [
            {id: 15, text: '15'},
            {id: 16, text: '16'},
            {id: 17, text: '17'},
            {id: 18, text: '18'},
            {id: 19, text: '19'},
            {id: 20, text: '20'},
            {id: 21, text: '21'}
        ]
    },
    {
        "text": "",
        "children": [
            {id: 22, text: '22'},
            {id: 23, text: '23'},
            {id: 24, text: '24'},
            {id: 25, text: '25'},
            {id: 26, text: '26'},
            {id: 27, text: '27'},
            {id: 28, text: '28'}
        ]
    },
    {
        "text": "",
        "children": [
            {id: 29, text: '29'},
            {id: 30, text: '30'},
            {id: 31, text: '31'}
        ]
    }
];

// Выбор дней месяца в select2
var dayOfMonth = (function (block) {
    var block_select2 = $(block).select2({
        width: '100%',
        data: dataDays,
        minimumResultsForSearch: Infinity
    });
    block_select2.data('select2').$dropdown.addClass('day-of-month-block');
    block_select2.data('select2').$container.addClass('day-of-month-input');
});
