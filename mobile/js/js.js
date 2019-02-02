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
				sub_menu.show(300, function() {
                    initFiltersDatesSwipers();
                    initFiltersGoodsSwipers();
                });
			}

			lnk.parent().addClass('active');
		}
	});
}

function initFiltersDatesSwipers() {
    // прокрутка для фильтра с датами
    new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        mousewheel: {
            invert: false
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
    });

}

function initFiltersGoodsSwipers() {

    // прокрутка для фильтра с товарами
    new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        mousewheel: {
            invert: false
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
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

// инициализация swipe
function initSwipe() {
	var startPos;
	var handlingTouch = false;
	var itemis, menuis;

    document.addEventListener('touchstart', function (e) {
        // Is this the first finger going down? 

        if (e.touches.length == e.changedTouches.length) {
            startPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    });
	
    document.addEventListener('touchmove', function (e) {
        // If this is the first movement event in a sequence:
        if (startPos) {
            // Is the axis of movement horizontal?
            if (Math.abs(e.changedTouches[0].clientX - startPos.x) > Math.abs(e.changedTouches[0].clientY - startPos.y)) {
                handlingTouch = true;
                e.preventDefault();
                onSwipeStart(e);
            }
            startPos = undefined;
        } else if (handlingTouch) {
            e.preventDefault();
            onSwipeMove(e);
        }
    }, { passive: false });

    document.addEventListener('touchend', function (e) {
        if (handlingTouch && e.touches.length == 0) {
            e.preventDefault();
            onSwipeEnd(e);
            handlingTouch = false;
        }
    }, { passive: false });

    function slide(x) {
        $(itemis).css({
            transform: "translatex(" + x + "px)"
        })
		if (x < 0) {
			$(menuis).css({
				width: Math.abs(x) + "px"
				//transform: "translatex(" + x + "px)"
			})
		} else {
			$(menuis).css({
				width: "0px"
				//transform: "translatex(" + x + "px)"
			})			
		}

    }

    var swipeOrigin, x, itempos;

    function onSwipeStart(e) {
		itemis = $(e.target).closest(".order-item").find(".order-item--body");
		menuis = $(e.target).closest(".order-item").find(".menu-action");
        swipeOrigin = e.touches[0].clientX;
    }

    function onSwipeMove(e) {
        x = e.touches[0].clientX - swipeOrigin;
        slide(x);
		console.log('move ' + x);
    }

    function onSwipeEnd(e) {
        if (x < -100) {
            slide(-240);
        } else {
            slide(0);
        }
    }
}

// datepicker
function initDatePicker(dateSelector, onSelected) {
    $(dateSelector).daterangepicker({
        "singleDatePicker": true,
        "minYear": 1901,
        "maxYear": 2040,
        "linkedCalendars": false,
        "opens": "left",
        "locale": {
            "format": "MM.DD.YYYY",
            "separator": " - ",
            "applyLabel": "Применить",
            "cancelLabel": "Отмена",
            "fromLabel": "От",
            "toLabel": "До",
            "customRangeLabel": "Custom",
            "weekLabel": "Н",
            "daysOfWeek": [
                "Пн",
                "Вт",
                "Ср",
                "Чт",
                "Пт",
                "Сб",
                "Вс"
            ],
            "monthNames": [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь"
            ],
            "firstDay": 0
        },
    });

    $(dateSelector).on('apply.daterangepicker', function(ev, picker) {
        $(dateSelector+' input').val(picker.startDate.format('DD.MM.YYYY'));
        $(dateSelector+' label').addClass('active');
        if (onSelected) {
            onSelected(dateSelector, picker.startDate, picker.endDate);
        }
    });
}

// daterangepicker
function initDateRangePicker(dateSelector, onSelected) {
    $(dateSelector).daterangepicker({
        "minYear": 1901,
        "maxYear": 2040,
        "linkedCalendars": false,
        "opens": "left",
        "locale": {
            "format": "MM.DD.YYYY",
            "separator": " - ",
            "applyLabel": "Применить",
            "cancelLabel": "Отмена",
            "fromLabel": "От",
            "toLabel": "До",
            "customRangeLabel": "Custom",
            "weekLabel": "Н",
            "daysOfWeek": [
                "Пн",
                "Вт",
                "Ср",
                "Чт",
                "Пт",
                "Сб",
                "Вс"
            ],
            "monthNames": [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь"
            ],
            "firstDay": 0
        },
    });
    $(dateSelector).on('apply.daterangepicker', function(ev, picker) {
        if (onSelected) {
            onSelected(dateSelector, picker.startDate, picker.endDate);
        }
    });
}

function initToggleFilters(lnk, single) {
    var li = lnk.parent();
    var is_active = li.hasClass('active');

    if (single) {
        var ul = lnk.closest('ul');
        ul.find('li').removeClass('active');
    }

    if (!is_active) {
        li.addClass('active');
    } else {
        li.removeClass('active');
    }
}