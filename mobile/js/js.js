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
		$(menuis).css({
            transform: "translatex(" + x + "px)"
        })
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
    }

    function onSwipeEnd(e) {
        if (x < -100) {
            slide(-240);
        } else {
            slide(0);
        }
    }
}