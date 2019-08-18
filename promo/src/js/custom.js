
var uiSlider 	= $(".calc-slider"),
		slider 		= $('.production-slider'),
		thumbs 		= $(".production-thumbs"),
		modalBtn 	= $("[data-modal]"),
		formInp 	= $('.form-input'),
		carousel 	= $('.carousel'),
		testimonialAuthors = $(".testimonials-authors"),
		phoneMask = $('.phone-mask');

if(uiSlider.length){
  include("js/jquery-ui.js");
  include("js/jquery.ui.touch-punch.min.js");
}

if(phoneMask.length){
  include("js/jquery.inputmask.js");
}

include("js/swiper.min.js");


// if (modalBtn.length){
// 	// include("js/jquery.arcticmodal.js");
// }

function include(url){ 
  document.write('<script src="'+ url + '"></script>'); 
}

function inpSync(name, newVal){
		var groupInp = $("body").find('input[name="'+name+'"]');

				groupInp.val(newVal).trigger('change');
				groupInp.closest('.form-input').addClass('focus');
	}

$(document).ready(function(){

	// phone mask
	if (phoneMask.length){
		phoneMask.inputmask("8(999) 999-9999");  //static mask
	}

	// init of jquery UI Slider
	if (uiSlider.length){
		
		uiSlider.each(function() {
			var currentSlider = $(this),
					currentInp 		= currentSlider.closest('.form-input').find('input'),
					currentInpVal = +currentInp.val(),
					currentInpName = currentInp.attr('name'),
					min 					= +currentSlider.data('min'),
					max						= +currentSlider.data('max');

			if (!currentInpVal){
				currentInpVal = min;
				currentInp.val(min);
			}

			if (currentInp.length){
				currentSlider.slider({
					range: "min",
					min: min,
		      max: max,
		      value : currentInpVal,
		      slide: function( event, ui ){
		      	currentInp.val(ui.value);

		      	if (currentInpName){
		      		inpSync(currentInpName, ui.value);
		      	}

		      }
				});
			}

			currentInp.on('change', function(){
				currentSlider.slider('value', currentInp.val());
			})

		});

	}

	// call a modal
	// modalBtn.on('click', function(e){
	// 	e.preventDefault();

	// 	var currentBtn 	= $(this),
	// 			targetModal = $(currentBtn.data('modal'));

	// 	if (targetModal.length) {
	// 		targetModal.arcticmodal();
	// 	}
	// })


	// simulate focus
	$('.form-input').each(function(index, el) {
		var currentInp 			= $(this),
				currentInpField	= currentInp.find('input'),
				currentInpFieldVal = currentInpField.val();

		currentInpFieldVal ? currentInp.addClass('focus') : currentInp.removeClass('focus');

	});

	$('.form-input')
	.on('focus', 'input', function(e){
		var currentInp 		= $(this),
				currentInpVal = currentInp.val(),
				parent 				= $(e.delegateTarget);

		parent.addClass('focus');

	})
	.on('blur', 'input', function(e){
		var currentInp 		= $(this),
				currentInpVal = currentInp.val(),
				parent 				= $(e.delegateTarget),
				groupName 		= currentInp.attr('name');

		currentInpVal.length ? parent.removeClass('form-input--state-error') : parent.addClass('form-input--state-error');

		if (groupName){

			inpSync(groupName, currentInpVal);

		}

		currentInpVal.length ? parent.addClass('focus') : parent.removeClass('focus');

	})

	// init of carousel
	if (carousel.length){

  	carousel.each(function(){
  		var currentCarousel = $(this),
	  			items 			= currentCarousel.data('items'),
	  			singleItem  = false,
	  			itemsDesc 	= currentCarousel.data('items-desc'),
	  			itemsDescSm	= currentCarousel.data('items-desc-sm'),
	  			itemsTab 		= currentCarousel.data('items-tab'),
	  			swiper,
	  			currentPagination = currentCarousel.find('.swiper-pagination');

  		if (items < 1){
  			return false;
  		}

  		if (items == 1){
  			singleItem = 1;
  			itemsDesc = 1;
	  		itemsDescSm = 1;
  			itemsTab = 1;
  		}

  		swiper = new Swiper(currentCarousel[0], {
  			autoHeight: true, //enable auto height
	      slidesPerView: items,
	      spaceBetween: 30,
	      pagination: {
	        el: '.swiper-pagination',
	        type: 'bullets',
	        clickable: true,
	      },
	      navigation: {
	        nextEl: '#carouselNext',
	        prevEl: '#carouselPrev',
	      },
	      breakpoints: {
			    995: {
			      slidesPerView: 'auto',
			      spaceBetween: 30,
			      autoHeight : false
			    },
			    400: {
			      slidesPerView: 1,
			      spaceBetween: 30,
			      autoHeight : true
			    }
		  	}
	    });

  	})
	}

	// testimonials carousel
	if (testimonialAuthors.length){

		var testimonials,
				testimonialsAuthors;

		testimonialsAuthors = new Swiper(testimonialAuthors[0], {
	      slidesPerView: 'auto',
	      spaceBetween: 0,
	      initialSlide : 2,
	      centeredSlides: true,
	      freeMode: true,
	      watchSlidesVisibility: true,
	      watchSlidesProgress: true,
	      navigation: {
	        nextEl: '#author-next',
	        prevEl: '#author-prev',
	      },
	      pagination: {
	        el: '#testimonialsPagination',
	        type: 'bullets',
	        clickable: true,
	      },
	      on: {
	      	slideChangeTransitionEnd: function () {
			      var activeSlide 			= testimonialAuthors.find(".swiper-slide-active"),
			      		activeSlideIndex 	= activeSlide.index();

					if (testimonials) {
					  testimonials.slideTo(activeSlideIndex);
					}				  

			    }
	      }
	    });

		testimonials = new Swiper('#testimonials', {
	      spaceBetween: 0,
	      initialSlide : 2,
	      navigation: false,
	      speed : 1000,
	      thumbs: {
	        swiper: testimonialsAuthors
	      },
	      on: {
		      	slideChangeTransitionEnd: function () {
				      var activeSlide 			= $("#testimonials").find(".swiper-slide-active"),
				      		activeSlideIndex 	= activeSlide.index();

				      testimonialsAuthors.slideTo(activeSlideIndex);
				     
				    }
		      }
	    });

		
	}

	// production gallery
	var galleryThumbs = new Swiper('.production-thumbs', {
    spaceBetween: 14,
    slidesPerView: 7,
    loop: true,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });
  var galleryTop = new Swiper('.production-slider', {
    spaceBetween: 0,
    loop:true,
    navigation: {
      nextEl: '#production-next',
      prevEl: '#production-prev',
    },
    thumbs: {
      swiper: galleryThumbs,
    },
    pagination: {
      el: '#productionGalleryPagination',
      type: 'bullets',
      clickable: true,
    },
  });


})