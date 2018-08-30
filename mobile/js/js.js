// инициализация фильтров
function initFilters() {

	$('.js-filters-main > li > a').click(function() {
		var lnk = $(this);
		var li = lnk.parent();
		var is_active = li.hasClass('active');

		if (!is_active) {

			$('.js-filters-main > li').removeClass('active');
			$('.js-filters-block-sub').hide(100);

			var has_menu = li.attr('class');

			if (has_menu) {
				var sub_name = has_menu.replace('filter-has-sub', '').trim();
				var sub_menu = $('.' + sub_name + '-menu');
				
				lnk.parent().addClass('active');
				sub_menu.show(300);
			}

			lnk.parent().addClass('active');
		}
	});
}

// инициализация модального окна для сотрудников
function initModalEmpl() {
	$('.js-empl-list .item').click(function() {
		$('.modal-cc-empl').modal({
			show: 'true'
		}); 
	});
}

// инициализация модального окна для заказа
function initModalOrder() {
	$('.js-order-list .order-item').click(function() {
		$('.modal-cc-card').modal({
			show: 'true'
		}); 
	});
}