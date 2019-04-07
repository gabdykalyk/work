function initNavbar() {
	$('#navbar-toggle').click(function() {
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
}

function switchPayments(lnk) {
	$('.nav-pay li').removeClass('active');
	lnk.parent().addClass('active');

	var pay = lnk.attr('data-payment');var pay = lnk.attr('data-payment');
	$('.row-pay').hide();
	$('.row-pay-' + pay).css('display', 'block');
}

function selectPlaceholder(selectID){
	var COLOR_PLACEHOLDER = '#999';
	var COLOR_SELECT = '#000';

	var selected = $(selectID + ' option:selected');
	var val = selected.val();

	$(selectID + ' option' ).css('color', COLOR_SELECT);
	selected.css('color', COLOR_PLACEHOLDER);

	if (val == "") {
		$(selectID).css('color', COLOR_PLACEHOLDER);
	};

	$(selectID).change(function(){
		var val = $(selectID + ' option:selected' ).val();
		if (val == "") {
			$(selectID).css('color', COLOR_PLACEHOLDER);
		} else {
			$(selectID).css('color', COLOR_SELECT);
		};
	});
};

function initShowDoc() {
	var win_width = $(window).width();

	if (win_width > 991) {
		$('#docs-cand .cell-name a').mouseover(function() {
			showDoc($(this), 'over');
		});
		$('#docs-cand .cell-name a').mouseout(function() {
			hideDoc();
		});

	} else {
		$('#docs-cand .cell-name a').click(function() {
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

		coord_top = lnk.offset().top  - tooltip.height();
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
			tooltip.css({'margin-left': - tooltip.width() / 2});
		} else {
			tooltip.css({'margin-left': - tooltip.width() / 2, 'margin-top': - tooltip.height() / 2});
		}

		tooltip.show({
			duration: 300,
			start: function() {
				body.append('<div class="modal-backdrop modal-backdrop-tooltip fade in"></div>');

				if (win_width < 768) {
					body.addClass('modal-open');
				}

				$('.btn-close-tooltip, .modal-backdrop-tooltip').bind('click', function() {
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
		if (number != 0 ) {
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
var resetDefaultHeight = function(table) {
	table.find('thead > tr > th.js-cell-mobile').each(function(key, value) {
		$(value).removeAttr('style');
	});
	var tr, td, td_h;
	table.find('tbody > tr').each(function(key, value) {
		tr = $(value);
		tr.find('td.js-cell-mobile').each(function(key, value) {
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
	table.find('thead > tr > th.js-cell-mobile').each(function(key, value) {
		th = $(value)
		th_h = th.outerHeight();
		h[key] = th_h;
	});

	return h;
}

function calcMaxHeightCell(table, h) {
	var tr, td, td_h;
	
	table.find('tbody > tr').each(function(key, value) {
		tr = $(value);

		tr.find('td.js-cell-mobile').each(function(key, value) {
			td = $(value)
			td_h = td.outerHeight();

			if (td_h > h[key]) h[key] = td_h;
		});
	});
	
	return h;
}

function setHeightCellMobile(table, h) {
	var tr, td, th;

	table.find('tbody > tr').each(function(key, value) {
		tr = $(value);

		tr.find('td.js-cell-mobile').each(function(key, value) {
			td = $(value);
			td.css('height', h[key]);
		});
	});

	table.find('thead > tr > th.js-cell-mobile').each(function(key, value) {
		th = $(value);
		th.css('height', h[key]);
	});
}

// Вызов скролла внутри модалки
$('#modalLaw, #modalRoleFines').on('shown.bs.modal', function (e) {
  	$(document).ready(function(){
	    $('.scrollbar-inner').scrollbar();
	});
});

// Проверяет, выбран ли элемент в select2
var isItemInSelect2 = (function(item, itemName, now) {
	return now.indexOf(itemName) > -1;
});
// Показывает блоки, которые выбраны в select2
var showOrHideBlock = (function(item, itemName, now) {
	return (isItemInSelect2(item, itemName, now) ? item.show() : item.hide());
});

// Функция задает placeholder для select2
var placeholderSelect2 = (function(select, placeholder) {
	return $(select).select2({
		width: '100%',
		placeholder: placeholder,
	});
});

// Массив data для выбора даты в select2
var dataDays = [
	{ 
		"text": "", 
		"children" : [
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
		"children" : [
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
		"children" : [
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
		"children" : [
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
		"children" : [
			{id: 29, text: '29'},
			{id: 30, text: '30'},
			{id: 31, text: '31'}
		]
	}
];

// Выбор дней месяца в select2
var dayOfMonth = (function(block) {
	var block_select2 = $(block).select2({
		width: '100%',
		data: dataDays,
		minimumResultsForSearch: Infinity
	});
	block_select2.data('select2').$dropdown.addClass('day-of-month-block');
	block_select2.data('select2').$container.addClass('day-of-month-input');
});