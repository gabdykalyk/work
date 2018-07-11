/***** Календарь *****/
function initDatepicker() {
    $('.datepicker').datetimepicker({
        language: 'ru',
        pickTime: false
    });    
}

/***** Всплывающие подсказки для графика "КОРФ / нагрузка / опоздания по категории" *****/
function initTooltipGraphEmpl() {
    $("[data-toggle='popover']").popover({
        html: true,
        trigger: 'hover',
        placement: 'top'
    }).on('shown.bs.popover', function () {
        var 
            legend_color   = $(this).attr('data-legend-color'),
            popover        = $(this).parent().find('.popover'),
            arrow_popover  = popover.children('.arrow');

            popover.css('border-color', legend_color);
            popover.children('.arrow').css('border-top-color', legend_color);
    });    
}

/***** Функции для легенды графика "Доставка сводный" *****/
function updateLegend(legend) {
    var 
        chbx_all = legend.find('input[type="checkbox"]').length,
        chbx_sel = legend.find('input[type="checkbox"]:checked').length;

    if (chbx_all == chbx_sel) {
        updateLegendMenu('all');
    } else if (chbx_sel == 0) {
        updateLegendMenu('none');
    } else {
        updateLegendMenu('some');
    }
}

function updateLegendMenu(chbx_sel) {
    var sel = $('#select-all'),
        unsel = $('#unselect-all');

    if (chbx_sel == 'all') {
        sel.addClass('disabled');
        unsel.removeClass('disabled');
    } else if (chbx_sel == 'none') {
        sel.removeClass('disabled');
        unsel.addClass('disabled');
    } else {
        sel.removeClass('disabled');
        unsel.removeClass('disabled');
    }
}

function selectAllChbx(is_select, update_menu) {
    $('#legend input[type=checkbox]').each(function () {
        if ($(this).is(":checked") != is_select){
            $(this).prop('checked', is_select).change();
        }
    });    
    if (update_menu) {
        var chbx_sel = is_select ? 'all' : 'none'; 
        updateLegendMenu(chbx_sel);
    }
}

function initChart(container, title, graph) {
    switch (graph) {
        case 'delivempl':
            var chart = getChartEmpl(container, title);
            break;
        case 'latesumm':
            var chart = getChartLate(container, title);
            break;
        default:
            var chart = getChart(container, title);
    }
    return chart;
}

function initLegend(legend, data, chart) {
    legend.on('change', 'input[type=checkbox]', function () {
        var series = data[$(this).data('index')];
        if ($(this).prop('checked')) {
            series.__series = chart.addSeries(series);
            series.index = series.__series.index;
        } else if (series.hasOwnProperty('__series')) {
            series.__series.remove();
            delete series.__series;
        }
    });
    legend.find('input[type=checkbox]:checked').each(function () {
        var 
            series = data[$(this).data('index')];
            series.__series = chart.addSeries(series);
            series.index = series.__series.index;
    });
}
function initDoubleLegend(legend, data, chart) {
    legend.on('change', 'input[type=checkbox]', function () {
		var i = $(this).data('index');
        var series = data[i],
			series2 = data[i + 1];

        if ($(this).prop('checked')) {
            series.__series = chart.addSeries(series);
            series.index = series.__series.index;

            series2.__series = chart.addSeries(series2);
            series2.index = series2.__series.index;
        } else if (series.hasOwnProperty('__series')) {
            series.__series.remove();
            delete series.__series;

            series2.__series.remove();
            delete series2.__series;
        }
    });
    legend.find('input[type=checkbox]:checked').each(function () {
		var i = $(this).data('index');
        var series = data[i],
			series2 = data[i + 1];

            series.__series = chart.addSeries(series);
            series.index = series.__series.index;

            series2.__series = chart.addSeries(series2);
            series2.index = series2.__series.index;			
    });
}

/***** График "Доставка сводный" *****/
function drawLegend(legend, data) {
    for (var i = 0, l = data.length; i < l; i ++) {
        addLegendItem(legend, i, data[i]);
    }
}

function addLegendItem(legend, i, line) {
    legend.append(
        '<li>' +
            '<div class="checkbox-inline">' +
                '<label>' +
                    '<input type="checkbox" data-index="' + i + '" checked> <span class="state" style="background-color: ' + line.color + '"></span>' + line.name +
                '</label>' +
            '</div>' +
        '</li>'
    );
}

function getChart(id, chart_title) {
    var categories = ['плохо', 'ниже нормы', 'норма', 'выше нормы', 'отлично'];

    return Highcharts.chart(id, {
        chart: {
            type: 'line'
        },
        legend: {
            enabled: false
        },
        title: {
            text: chart_title,
            align: 'left',
            style: {
                fontWeight: '600',
                fontFamily: '"Open Sans", sans-serif',
                color: '#000000',
                fontSize: '20px'
            }
        },
        tooltip: {
            useHTML: true,
            style: {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '12px',
                color: '#333333',
                fontWeight: '600'
            },
            borderRadius: 8,
            formatter: function() {
                return this.key + '<br>' + this.series.name + ': <b>' + categories[this.y - 1] + '</b>';
            }
        },
        xAxis: {
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            tickmarkPlacement: "on",
            gridLineWidth: 1,
            tickInterval: 1,
            type: 'category',
            labels: {
                style: {
                    color: '#333333',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '11px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#f0f0f0'
        },
        yAxis: {
            min: 1, 
            max: 5,
            tickmarkPlacement: 'on',
            startOnTick: true,
            endOnTick: true,
            tickInterval: 1,
            title: {
                enabled: false
            },
            labels: {
                enabled: true,
                formatter: function () {
                    return categories[this.value - 1];
                },
                style: {
                    color: '#555555',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '10px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#dddddd'
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        }
    });
}

/***** График "Доставка по сотрудникам" *****/
function drawLegendEmpl(legend, data) {
    for (var i = 0, l = data.length; i < l; i ++) {
        addLegendEmplItem(legend, i, data[i]);
    }
}

function addLegendEmplItem(legend, index, line) {
    var sum = 0
    for (var i in line.data){
        sum = sum + line.data[i][1];
    }
    legend.append(
        '<tr>' +
            '<td>' +
                '<div class="checkbox-inline">' +
                    '<label>' +
                        '<span class="state" style="background-color: ' + line.color + '"></span>' +
                        '<input type="checkbox" data-index="' + index + '" checked>'+ line.name +
                    '</label>' +
                '</div>' +
            '</td>' +
            '<td>' + (sum/line.data.length).toFixed(2) + '</td>' +
        '</tr>'
    );
}

function getChartEmpl(id, chart_title) {
    return Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            },
            series: {
                groupPadding: 0.1
            }
        },
        legend: {
            enabled: false
        },
        title: {
            text: chart_title
        },
        tooltip: {
            useHTML: true,
            style: {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '12px',
                color: '#333333',
                fontWeight: '600'
            },            
            headerFormat: '<span style="font-size: 11px;">{point.key}</span><table class="table-tooltip-empl">',
            pointFormat: '<tr><td style="color:{series.color};">{series.name}: </td>' +
                '<td><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true
        },        
        xAxis: {
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            type: 'category',
            min: 0,
            max: 10,
            labels: {
                style: {
                    color: '#333333',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '11px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#f0f0f0'
        },
        yAxis: {
            tickInterval: 1,
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            title: {
                enabled: false
            },
            labels: {
                style: {
                    color: '#555555',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '10px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#dddddd'
        },
        scrollbar: {
            enabled: true
        }
    });
}

function checkAllChbx() {
    var 
        all_check = $('#all-empls'),
        chbx_all  = $('#legend input[type="checkbox"]').length,
        chbx_sel  = $('#legend input[type="checkbox"]:checked').length;

    if (chbx_all == chbx_sel) {
        all_check.prop('checked', true);
    } else {
        all_check.prop('checked', false);
    }
}

/***** График "Опоздания сводный" *****/
function drawLegendLate(legend, data) {
    for (var i = 0, l = data.length; i < l; i ++) {
		if (i % 2 == 0) {
			addLegendLateItem(legend, i, data[i], data[i+1]);
		}
    }
}

function addLegendLateItem(legend, i, line, line2) {
    legend.append(
        '<div class="item">' +
            '<div class="checkbox">' +
                '<label>' +
                    '<input type="checkbox" data-index="' + i + '" checked><span class="state" style="background-color: ' + line.color + '"></span>' + line.name +
                '</label>' +
            '</div>'+
            '<div class="checkbox">' +
                '<label>' +
                    '<span class="state" style="background-color: ' + line2.color + '"></span>' + line2.name +
                '</label>' +
            '</div>' +
        '</div>'
    );
}

function getChartLate(id, chart_title) {
    return Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            },
            series: {
                groupPadding: 0.1
            }
        },
        legend: {
            enabled: false
        },
        title: {
            text: chart_title,
            align: 'left',
            style: {
                fontWeight: '600',
                fontFamily: '"Open Sans", sans-serif',
                color: '#000000',
                fontSize: '20px'
            }
        },
        tooltip: {
            useHTML: true,
            style: {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '12px',
                color: '#333333',
                fontWeight: '600'
            },            
            headerFormat: '<span style="font-size: 11px;">{point.key}</span><table class="table-tooltip-empl">',
            pointFormat: '<tr><td style="color:{series.color};">{series.name}: </td>' +
                '<td><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true
        },        
        xAxis: {
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            type: 'category',
            labels: {
                style: {
                    color: '#333333',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '11px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#f0f0f0'
        },
        yAxis: {
            tickInterval: 1,
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            title: {
                enabled: false
            },
            labels: {
                style: {
                    color: '#555555',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '10px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#dddddd'
        }
    });
}

function getChartSalary(id, chart_title) {
    return Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            },
            series: {
                groupPadding: 0.1
            }
        },
        legend: {
            enabled: false
        },
        title: {
            text: chart_title,
            align: 'left',
            style: {
                fontWeight: '600',
                fontFamily: '"Open Sans", sans-serif',
                color: '#000000',
                fontSize: '20px'
            }
        },
        tooltip: {
            useHTML: true,
            style: {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '12px',
                color: '#333333',
                fontWeight: '600'
            },            
            headerFormat: '<span style="font-size: 11px;">{point.key}</span><table class="table-tooltip-empl">',
            pointFormat: '<tr><td style="color:{series.color};">{series.name}: </td>' +
                '<td><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true
        },        
        xAxis: {
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            type: 'category',
            labels: {
                style: {
                    color: '#333333',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '11px',
                    fontWeight: '600'
                }
            },
            gridLineColor: '#f0f0f0'
        },
        yAxis: {
            startOnTick: true,
            endOnTick: true,
            minPadding: 0,
            maxPadding: 0,
            title: {
                enabled: false
            },
            labels: {
                style: {
                    color: '#555555',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '10px',
                    fontWeight: '600'
                },
				format: '{value} %'
            },
            gridLineColor: '#dddddd'
        }
    });
}