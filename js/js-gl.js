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
function fixedFiltersEmpllist(is_change) {
	const PADDING_TOP_DEFAULT = 70;

	var btn = $('#btn-filter-empllist');
	var is_fixed = btn.attr('class').indexOf('is-fixed');

	var body = $('body');
	var block_fix = $('#filter-fixed-empllist');
	var padding_top = PADDING_TOP_DEFAULT;

	if (is_change) {
		if (is_fixed == -1) {
			btn.addClass('is-fixed');
			block_fix.addClass('filter-fixed-empllist');
			padding_top = PADDING_TOP_DEFAULT + block_fix.height();
		} else {
			btn.removeClass('is-fixed');
			block_fix.removeClass('filter-fixed-empllist');
		}
		body.css('padding-top', padding_top + 'px');
	} else {
		if (is_fixed > -1) {
			padding_top = PADDING_TOP_DEFAULT + block_fix.height();
			body.css('padding-top', padding_top + 'px');
		}
	}
}

// Вызов сролла внутри модалки
$('#modalLaw, #modalRoleFines').on('shown.bs.modal', function (e) {
  	$(document).ready(function(){
	    $('.scrollbar-inner').scrollbar();
	});
});
