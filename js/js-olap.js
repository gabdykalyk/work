/* см. страницы hatimaki-OLAP-report-many.html, hatimaki-OLAP-report.html */

/* свернуть или развернуть несколько строк */
function toggleWrappableRow(btnEl) {
    var isExpanded = $(btnEl).hasClass('wrap-btn-down');
    if (isExpanded) {
        collapseRows(btnEl);
    } else {
        expandeRows(btnEl);
    }
}

function collapseRows(btnEl) {
    var rowId = $(btnEl).closest('tr').data('row-id');

    $(btnEl).removeClass('wrap-btn-down').addClass('wrap-btn-up');
    $(btnEl).closest('.olap-report-table-container').find("tr[data-parent-row-id='"+rowId+"']").each(function(idx, trItem) {
        $(trItem).css('display', 'none');
    });

    $(btnEl).closest('.olap-report-table-container').find("tr[data-row-id='"+rowId+"']").each(function(idx, trItem) {
        $(trItem).find('td:first-child').attr('rowspan', 1);
    });
}

function expandeRows(btnEl) {
    var rowId = $(btnEl).closest('tr').data('row-id');

    $(btnEl).removeClass('wrap-btn-up').addClass('wrap-btn-down');
    var size = $(btnEl).closest('td').data('wrap');
    $(btnEl).closest('.olap-report-table-container').find("tr[data-row-id='"+rowId+"']").each(function(idx, trItem) {
        console.log("TR "+$(trItem).data('row-id')+" / "+$(trItem).find('td:first-child')[0]);
        $(trItem).find('td:first-child').attr('rowspan', size);
    });
    $(btnEl).closest('.olap-report-table-container').find("tr[data-parent-row-id='"+rowId+"']").each(function(idx, trItem) {
        $(trItem).css('display', 'table-row');
    });
}

/* обновление ширины колонок в таблице с данными на основе ширины заголовков */
function updateOlapTableDimensions() {
    var winW = $(window).outerWidth();

    // ширина контейнера с данными
    var listW = $('.group-list-container').outerWidth();
    if ($(window).outerWidth() < 768) {
        listW = 0;
    } else {
        listW += 15;
    }
    var bldW = $('.olap-report-table-builder').outerWidth();
    $('.olap-report-table-container').outerWidth(bldW - listW); // компенс гэп между списком и таблицей

    // высота таблицы
    var ortcH = $('.olap-report-table-container').outerHeight();
    var dzdH = $('.dropzone-data').outerHeight();
    $('.olap-report-table').outerHeight(ortcH - dzdH - 2);

    // высота скроллируемой области с данными
    var tblH = $('.olap-report-table').outerHeight();
    var hdrH = $('.olap-table-head').outerHeight();
    $('.olap-table-data-vscroll').outerHeight(tblH - hdrH - 18);

    let thWidths = [];
    // ширина колонок с данными, которые подпадают под первую колонку заголовка
    // расчитываются из ширины "кнопок", которые туда добавлены
    var firstThW = $('.olap-table-head thead tr .th-dropzone-row').outerWidth();
    var sumRowBtnW = 0; // суммарная ширина колонок в первой ячейке заголовка
    $('.olap-table-head thead tr .dropzone-row .draggable-olap-item').each(function(idx, item) {
        var tmpW = sumRowBtnW + $(item).outerWidth() + 30;
        if (tmpW <= firstThW) {
            thWidths.push($(item).outerWidth()+2);
            sumRowBtnW += ($(item).outerWidth()+2);
        } else {
            thWidths.push(firstThW - sumRowBtnW);
            sumRowBtnW = firstThW;
            return false;
        }
        if (winW <= 480) {
            thWidths.push($(item).outerWidth());
            return false;
        }
    });
    if (thWidths.length == 0) {
        thWidths.push(firstThW);
    } else if (thWidths.length == 1 && sumRowBtnW < firstThW) {
        thWidths.pop();
        thWidths.push(firstThW);
    } else if (thWidths.length > 1 && sumRowBtnW < firstThW) {
        var w = thWidths.pop();
        thWidths.push(firstThW - sumRowBtnW + w);
    }

    $('.olap-table-head thead tr:last-child th').each(function(idx, th) {
        thWidths.push($(th).outerWidth());
    });
    $('.olap-table-data tbody td').each(function(idx, td) {
        $(td).css('min-width', thWidths[idx]).css('max-width', thWidths[idx]);
    });
}

// скроллить данные в первой колонке таблицы в моб.версии
function onDataScrollUpdateFirstColumnY(posY) {
    $('.table-first-column .table-first-column-data').css("top", posY+"px");
}

// обновить размеры первой колонки таблицы в мобильной версии
function updateOlapTableFirstColumn() {
    // размеры заголовка
    var ptH = $('.olap-table-head').outerHeight();
    $('.table-first-column-head thead tr th:first-child').outerHeight(ptH);

    var ptW = $('.olap-table-head thead tr th:first-child').outerWidth();
    $('.table-first-column-head thead tr th:first-child').outerWidth(ptW-2);

    // размеры данных в первой колонке
    var dtH = $('.olap-report-table').outerHeight();
    $('.table-first-column').outerHeight(dtH - 18);
    $('.table-first-column-data-vscroll').outerHeight(dtH - ptH - 20);
}

/* быстрый поиск в левом списке групп */
function initGroupListSearch() {
    $('.group-list-search input').on('change input keydown keyup', function(e) {
        var val = $(e.target).val();
        $('.group-list-scroll .group-list .draggable-olap-item').each(function(idx, item) {
            var txt = $(item).find('label').html();
            if (new RegExp(val, 'i').test(txt)) {
                $(item).show();
            } else {
                $(item).hide();
            }
        });
    });
}

function onDragStart(event) {
    // event.relatedTarget - что перетаскиваем
    console.log('onDragStart. '+ event.relatedTarget);

    dragFromGroupList = $(event.relatedTarget).parent().hasClass('group-list');
    if (dragFromGroupList) {
        return;
    }

    //$('.dropzone-in-grouplist').css('height', '48px');
}

function onDrop(item, event) {
    // event.target - куда перетаскиваем
    // event.relatedTarget - что перетаскиваем
    console.log('onDrop. '+event.target+' / '+event.relatedTarget);

    var dropzoneRow = $(event.target).hasClass('dropzone-row');
    if (dropzoneRow) {
        // begin: демонстрация добавления колонок
        $('.olap-table-data tbody tr .th-total').remove();

        var itemCount = $(event.target).find('.draggable-olap-item').length;
        $(event.target).closest('th').attr('colspan', itemCount);
        if (itemCount == 1) {
            addTestColumn1();
        } else {
            addTestColumn2();
        }
        // end: демонстрация добавления колонок
    }

    // пересчет ширины колонок
    updateOlapTableDimensions();
    //  $('.dropzone-in-grouplist').css('height', '0');

    // рефреш гориз. скролбара
    $(".olap-report-table").mCustomScrollbar("destroy");
    $(".olap-report-table").mCustomScrollbar({
        axis: "x",
        theme: "dark"
    });
}

function onGroupListDragStart(event) {
    var dragFromGroupList = $(event.relatedTarget).parent().hasClass('group-list');
    if (dragFromGroupList) {
        $('.dropzone-in-grouplist').removeClass('ui-dropzone--accessible');
    }
}

function onGroupListDrop(item, event) {
    console.log('onGroupListDrop. '+event.target+' / '+event.relatedTarget);
    item.prependTo('.group-list');
}

function addTestColumn1() {
    $('.olap-table-data tbody tr').each(function(idx, tr) {
        if (idx%4 == 0) {
            $(tr).prepend('<td rowspan="4" data-wrap="4">Московский<span class="wrap-btn wrap-btn-down" onclick="toggleWrappableRow(this)"></span></td>');
        }
    });
}

function addTestColumn2() {
    $('.olap-table-data tbody tr').each(function(idx, tr) {
        $('<td>Агапова Ю.</td>').insertAfter($(tr).find('td:first-child'));
    });
}

function initDragAndDrop() {
    initDraggable(".ui-draggable");
    setupDropzone(".dropzone-data", ".ui-draggable", "non-numeric", false, onDragStart, onDrop);
    setupDropzone(".dropzone-column", ".ui-draggable", "", false, onDragStart, onDrop);
    setupDropzone(".dropzone-row", ".ui-draggable", "", false, onDragStart, onDrop);
    setupDropzone(".dropzone-in-grouplist", ".ui-draggable", "", true, onGroupListDragStart, onGroupListDrop);
}

var draggableItem;

function initDraggable(draggableElementSelector) {
    interact(draggableElementSelector)
        .draggable({
            inertia: true,
            max: Infinity
        })
        .on('dragstart', function (event) {
            draggableItem = $(event.target).clone();
            $(draggableItem).addClass('ui-draggable--captured').appendTo('body');
            $(event.target).addClass('ui-draggable--empty-placeholder');
        })
        .on('dragmove', function (event) {
            $(draggableItem).offset({ top: event.pageY, left: event.pageX });
        })
        .on('dragend', function (event) {
            $(event.target).removeClass('ui-draggable--empty-placeholder');
            $(draggableItem).remove();
        });
}

/**
 * dropzoneSelector - куда перетаскиваем
 * draggableElementSelector - что перетаскиваем
 * forbiddenElementClass - класс элементов, которые запрещено перетаскивать
 * customPlacement - новое место элемента в DOM задается в ф-ции onDrop
 * onDragStart - функция вызывается в момент начала перетаскивания
 * onDrop - функция вызывается в момент размещения элемента в целевой области
 */
function setupDropzone(dropzoneSelector, draggableElementSelector, forbiddenElementClass, customPlacement, onDragStart, onDrop) {
    interact(dropzoneSelector)
        .dropzone({
            accept: draggableElementSelector,
            ondropactivate: function (event) { /* вызывается вторым при начале перетаскивания */
            },
            ondropdeactivate: function (event) { /* вызывается последним при завершении перетаскивания */
                $(event.target)
                    .removeClass('ui-dropzone--accessible ui-dropzone--inaccessible');
            },
        })
        .on('dropactivate', function (event) { /* вызывается первым при начале перетаскивания */
            var frb =$(event.relatedTarget).hasClass(forbiddenElementClass);
            $(event.target).addClass('ui-dropzone--'+(frb?'in':'')+'accessible');
            if (onDragStart) {
                onDragStart(event);
            }
        })
        .on('dropdeactivate', function (event) { /* вызывается предпоследним при завершении перетаскивания */
        })
        .on('dragenter', function (event) {
        })
        .on('dragleave', function (event) {
        })
        .on('drop', function (event) {
            // перетаскиваемый элемент запрещено перетаскивать в эту область
            var frb =$(event.relatedTarget).hasClass(forbiddenElementClass);
            if (frb) {
                return true;
            }

            // удалить текст подсказки
            $(dropzoneSelector + ' .ui-dropzone-placeholder').remove();

            var item = $(event.relatedTarget); // перетаскиваемый элемент
            item.detach(); // отсоединить его из старого списка

            if (!customPlacement) {
                item.appendTo(dropzoneSelector); // добавить в новую область
            }
            //item.removeClass('ui-draggable'); // отключить возможность перетаскивания

            // вызвать функцию после перетаскивания
            if (onDrop) {
                onDrop(item, event);
            }
        });
}

/* проверяет, если страница в режиме редактирования */
function isSetupMode() {
    return $(".head-toolbar .btn-group a[data-mode='setup']").hasClass('active');
}

/* проверяет, если в селекте выбран период, для которого надо показать только одну дату */
var singleDayArray = ['today','yesterday'];
function isSingleDaySelected() {
    var val = $('#period-select').val();
    return singleDayArray.includes(val);
}

function alignApplyFilterButton() {
    $('#olap-filter-apply-btn').find('.form-btns')
        .removeClass('form-btns--setup-period form-btns--setup-singleday form-btns--view-period form-btns--view-singleday')
        .addClass('form-btns--'+(isSetupMode()?'setup':'view')+'-'+(isSingleDaySelected()?'singleday':'period'));
}

/* вызывается при изменении в селекте Период. Меняет видимость второго календаря */
function onPeriodChanged(sel) {
    var el = $(sel);
    var val = el.val();

    var datePicker = $('#olap-filter-period-datepicker');
    var btnCol = $('#olap-filter-apply-btn');

    if (singleDayArray.includes(val)) { // режим одного дня

        // скрыть вторую дату
        datePicker.find('.input-group-dash').hide();
        datePicker.find('.period-end').hide();

        $('#olap-filter-period-datepicker')
            .attr('class', (isSetupMode()?'col-md-8 col-sm-3 col-xs-10':'col-md-3 col-sm-3 col-xs-10')+' form-group form-group-datepicker');
        datePicker.find('.period-start')
            .attr('class', (isSetupMode()?'col-md-6 col-sm-12 col-xs-6':'col-md-12 col-sm-12 col-xs-6')+' period-start');
        btnCol.attr('class', isSetupMode()?'col-md-8 col-sm-6 col-xs-12':'col-md-6 col-sm-6 col-xs-12');

    } else {

        datePicker.find('.input-group-dash').show();
        datePicker.find('.period-end').show();

        $('#olap-filter-period-datepicker')
            .attr('class', (isSetupMode()?'col-md-8 col-sm-6 col-xs-10':'col-md-6 col-sm-6 col-xs-10')+' form-group form-group-datepicker');
        datePicker.find('.period-start')
            .attr('class', (isSetupMode()?'col-md-6 col-sm-6 col-xs-6':'col-md-6 col-sm-6 col-xs-6')+' period-start');
        btnCol.attr('class', isSetupMode()?'col-md-12 col-sm-3 col-xs-12':'col-md-3 col-sm-3 col-xs-12');

    }

    alignApplyFilterButton();
}

function checkFilterMode() {
    if ($(window).outerWidth() >= 768) {
        return;
    }
    $('.head-toolbar .btn-group a').each(function(idx, item) {
        $(item).removeClass('active');
    });
    $(".head-toolbar [data-mode='view']").addClass('active');

    activateViewMode();
}

/* вид фильтра при изменении режима отчёта */
function toggleFilterMode(aEl) {
    var el = $(aEl);
    el.parent().find('a').each(function(idx,item) {
        $(item).removeClass('active');
    });
    if ($(window).outerWidth() < 768) {
        $(".head-toolbar [data-mode='view']").addClass('active');
        activateViewMode();
        return;
    }

    el.addClass('active');
    var mode = el.data('mode');

    if ('setup' == mode) {
        activateSetupMode();
    } else {
        activateViewMode();
    }

}

function activateSetupMode() {
    var datePicker = $('#olap-filter-period-datepicker');
    var btnCol = $('#olap-filter-apply-btn');

    $('#olap-filter-1').attr('class', 'col-md-6 col-sm-12 col-sx-12');
    $('.form-olap-report .form-btns--save').show();
    $('#olap-filter-2').attr('class', 'col-md-6 col-sm-12 col-sx-12');

    $('#olap-filter-period-select').attr('class', 'col-md-4 col-sm-3 col-xs-12 form-group');

    datePicker.attr('class', (isSingleDaySelected()?'col-md-8 col-sm-3 col-xs-10':'col-md-8 col-sm-6 col-xs-10')+' form-group form-group-datepicker');
    datePicker.find('.period-start')
        .attr('class', (isSingleDaySelected()?'col-md-6 col-sm-12 col-xs-6':'col-md-6 col-sm-6 col-xs-6')+' period-start');

    btnCol.attr('class', isSingleDaySelected()?'col-md-8 col-sm-6 col-xs-12':'col-md-12 col-sm-3 col-xs-12');

    alignApplyFilterButton();
}

function activateViewMode() {
    var datePicker = $('#olap-filter-period-datepicker');
    var btnCol = $('#olap-filter-apply-btn');

    $('#olap-filter-1').attr('class', 'col-md-4 col-sm-6 col-sx-6');
    $('.form-olap-report .form-btns--save').hide();
    $('#olap-filter-2').attr('class', 'col-md-8 col-sm-12 col-sx-12');

    $('#olap-filter-period-select').attr('class', 'col-md-3 col-sm-3 col-xs-12 form-group');

    datePicker.attr('class', (isSingleDaySelected()?'col-md-3 col-sm-3 col-xs-10':'col-md-6 col-sm-6 col-xs-10')+' form-group form-group-datepicker');
    datePicker.find('.period-start')
        .attr('class', (isSingleDaySelected()?'col-md-12 col-sm-12 col-xs-6':'col-md-6 col-sm-6 col-xs-6')+' period-start');

    btnCol.attr('class', isSingleDaySelected()?'col-md-6 col-sm-6 col-xs-12':'col-md-3 col-sm-3 col-xs-12');

    alignApplyFilterButton();
}

/* выбрать или сбросить все группы */
function onToggleAllGroupButtons(btn) {
    var is_active = btn.hasClass('active');

    if (is_active) {
        btn.removeClass('active');
        btn.parent().find('button').removeClass('active');
    } else {
        btn.addClass('active');
        btn.parent().find('button').addClass('active');
    }
}

// инициализация фильтров
function onClickGroupButton(btn, single) {
    var is_active = btn.hasClass('active');

    if (single) {
        var ul = btn.closest('div');
        ul.find('button').removeClass('active');
    }

    if (!is_active) {
        btn.addClass('active');
    } else {
        btn.removeClass('active');
    }
}

function obj2Str(obj) {
    var sz = '{';
    for(var p in obj) {
        sz = sz + p + ':' + obj[p] + ', ';
    }
    return sz+'}';
}
