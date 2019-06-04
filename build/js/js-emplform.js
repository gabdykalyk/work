function initStep1() {
	initDatepicker();
	initPhoneMask();
	initTooltip();
	//initKladr();
	initSelect();
	showBlockWork();
}

function initStep2() {
	initDatepicker();
	initTooltip();
	initSelect();
	funcChbx();
	showBlockChildren();
}

/***** Календарь *****/
function initDatepicker() {
    $('.datepicker').datetimepicker({
		dateFormat: 'dd.mm.yyyy',
        language: 'ru'
    });
}

/***** Маска для телефона *****/
function initPhoneMask() {
	$("#phone-number-rec").inputmask('8(999)999-9999', {
		clearMaskOnLostFocus: false
	});
	$("#phone-number").inputmask('8(999)999-9999', {
		clearMaskOnLostFocus: false
	});	
}

function initTooltip() {
	$('[data-toggle="tooltip"]').tooltip()
}

function initKladr() {
	$('#address').kladr({
		oneString: true
	});	
}

function initSelect() {
	 $('.js-select-single').select2({
		tags: true,
		width: '100%'
	 });
}

function showBlockChbx(elem) {
	var id = elem.attr('id');
	var block = $('#bl-' + id);
	var show = elem.is(":checked");

	if (show)  {
		block.show(200);
	} else {
		block.hide(200);
	}
}

function funcChbx() {
	$('#check-work').change(function() {
		showBlockChbx($(this));
	});
	$('#check-medical').change(function() {
		showBlockChbx($(this));
	});
	$('#check-friends').change(function() {
		showBlockChbx($(this));
	});
}

function showBlockChildren() {
	$('input:radio[name=children]').change(function () {
		var id = $(this).attr('id');
		var block = $('#bl-children');
		if (id == 'children-yes') {
			block.show(200);
		} else {
			block.hide(200);
		}
	});
}

function showBlockWork() {
	$('input:radio[name=experience]').change(function () {
		var id = $(this).attr('id');
		var block = $('#bl-work');
		if (id == 'expr-yes') {
			block.show(200);
		} else {
			block.hide(200);
		}
	});
}
