'use strict';

// app.controller('pixelReportCtrl', function ($rootScope, $scope, $timeout, $window, $filter, ngTableParams, CommonService, ReportService) {
app.controller('pixelReportCtrl', pixelReportCtrl);

pixelReportCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$window', '$filter', 'ngTableParams', 'CommonService', 'ReportService'];

function pixelReportCtrl($rootScope, $scope, $timeout, $window, $filter, ngTableParams, CommonService, ReportService){

    // Loading animation
    $scope.isLoading = true;

   // date
    var reportMinDate = '2014/01/01';
    var reportStartDateInterval = 13;
    var dateFormat = 'YYYY-MM-DD';

    // for C3.js chart
    var dateParseFormat = '%Y%m%d';
    var chart = null;
    var c3padding = {
        right: 10,
        bottom: 5
    };

    $scope.chartType = 'area';

    $scope.chartShow = true;

    $scope.noDataAlert = false;

    $scope.chartCategory = [
        { 'name': 'report.chart.type.line', 'value': 'line' },
        { 'name': 'report.chart.type.bar', 'value': 'bar' },
        // {'name': 'report.chart.type.pie', 'value': 'pie'},
        { 'name': 'report.chart.type.spline', 'value': 'spline' },
        { 'name': 'report.chart.type.step', 'value': 'step' },
        { 'name': 'report.chart.type.area', 'value': 'area' },
        { 'name': 'report.chart.type.area-spline', 'value': 'area-spline' },
        { 'name': 'report.chart.type.area-step', 'value': 'area-step' },
        { 'name': 'report.chart.type.scatter', 'value': 'scatter' },
        // {'name': 'report.chart.type.donut', 'value': 'donut'}
    ];

    $scope.behavorReportDateType = 1;

    $scope.tabSwitch = {
        tabBehavor: false,
        tabTrackingMap: false,
        tabTrackingPath: false,
        tabPixel: true,
    };

    $scope.currentChart = {
        chartType: 'Behavior', // Behavior, GeoSum, FootprintSum
        dateType: 1,
        apiStr: 'getBehaviorDay',
        loadFun: 'loadBehavior',
        drawFun: 'drawBehavorChart',
    };

    $scope.tempPixelSumList = null;
    $scope.gridItemCheckCount = 0;
    $scope.loadpixelSumTable = loadpixelSumTable;

    $scope.series1Item = null;
    $scope.series2Item = null;
    var pixel1DataContainer = null;
    var pixel2DataContainer = null;

    // init report
    initDatePicker();
    loadpixelSumTable(true);

    /*=================================================================================*/
    //                                API : Pixel Report - Sum Table
    /*=================================================================================*/
    function loadpixelSumTable(flag) {
        var range = {};
        range = new DateRangeFormater('YYYYMMDD');

        $scope.pixelSumTableParams = new ngTableParams({
            page: 1,            // show first page
            count: 20
        }, {
                total: 0,           // length of data
                counts: [],
                getData: function ($defer, params) {
                    ReportService.getPixelDaySum($scope.cSite.id, range.start, range.end).then(function (response) {
                        var data = response.data;
                        $scope.isLoading = false;
                        $scope.tempPixelSumList = angular.copy(data);
                        if (data.length > 0) {
                            params.total(data.length);//series1Item
                            if (flag) {
                                $scope.gridItemCheckCount = 0;
                                // if (pixel1DataContainer === null && pixel2DataContainer === null) {
                                if ($scope.series1Item === null && $scope.series2Item === null) {
                                    data[0]['checked'] = true;
                                    checkGridItem(data[0]);
                                } else {
                                    var counter = 0;
                                    data.map(function (obj) {
                                        if (($scope.series1Item && obj.pixel === $scope.series1Item.pixel) || ($scope.series2Item && obj.pixel === $scope.series2Item.pixel)) {
                                            obj['checked'] = true;
                                            obj['ngClass'] = 'info';
                                            counter++;
                                        } else {
                                            obj['checked'] = false;
                                            obj['ngClass'] = null;
                                        }
                                        return obj;
                                    });
                                    $scope.gridItemCheckCount = counter;
                                }
                            }
                            $scope.getPixelData();
                            $scope.tempPixelSumList = angular.copy(data);
                            $defer.resolve(data);
                        } else {
                            showNoDataAlert();
                            if (chart) {
                                chart = null;
                                $scope.chartShow = false;
                            }
                            $scope.series1Item = null;
                            $scope.series2Item = null;
                            pixel1DataContainer = null;
                            pixel2DataContainer = null;
                            $scope.gridItemCheckCount = 0;
                            $scope.tempPixelSumList = [];
                        }
                    });
                }
            });
    }
    /*=================================================================================*/
    //                                API : Pixel Report - by Day Chart
    /*=================================================================================*/


    function loadPixelByDay(pixel, start, end) {
        ReportService.getPixelByDay($scope.cSite.id, pixel, start, end).then(function (response) {
            var data = response.data;
            for (var i = 0, item; item = data.values[i]; i++) {
                delete item.siteId;
            }
            $scope.isLoading = false;
            if (pixel1DataContainer === null) {
                pixel1DataContainer = {};
                pixel1DataContainer.originData = angular.copy(data);
                pixel1DataContainer.newData = setPixelData(pixel1DataContainer.originData);
                generateCategory(pixel1DataContainer.newData);
            } else if (pixel2DataContainer === null) {
                pixel2DataContainer = {};
                pixel2DataContainer.originData = angular.copy(data);
                pixel2DataContainer.newData = setPixelData(pixel2DataContainer.originData);
                generateCategory(pixel2DataContainer.newData);
            }
        });
    }



    $scope.tabControl = tabControl;
    $scope.checkGridItem = checkGridItem;
    $scope.dateTypeOption = '1';

    // tabControl(4);

    function tabControl(tab) {
        $scope.dateTypeOption = '1';
        if (tab == 1) {
            $scope.tabSwitch.tabBehavor = true;
            $scope.tabSwitch.tabTrackingMap = false;
            $scope.tabSwitch.tabTrackingPath = false;
            $scope.tabSwitch.tabPixel = false;

            $scope.currentChart.chartType = 'Behavior';
            $scope.currentChart.loadFun = 'loadBehavior';
            $scope.currentChart.drawFun = 'drawBehavorChart';
            // changeDateType(1);// init dateType is 'DAYS'

        } else if (tab == 2) {
            $scope.tabSwitch.tabBehavor = false;
            $scope.tabSwitch.tabTrackingMap = true;
            $scope.tabSwitch.tabTrackingPath = false;
            $scope.tabSwitch.tabPixel = false;

            $scope.currentChart.chartType = 'GeoSum';
            $scope.currentChart.loadFun = 'loadGeoSum';
            $scope.currentChart.drawFun = 'drawTrackingMap';
            // changeGeoSumDateType(1);// init dateType is 'DAYS'

        } else if (tab == 3) {
            $scope.tabSwitch.tabBehavor = false;
            $scope.tabSwitch.tabTrackingMap = false;
            $scope.tabSwitch.tabTrackingPath = true;
            $scope.tabSwitch.tabPixel = false;

            $scope.currentChart.chartType = 'Footprint';
            $scope.currentChart.loadFun = 'loadFootprint';
            $scope.currentChart.drawFun = 'drawTrackingPath';
            // changeFootprintDateType(1);// init dateType is 'DAYS'
        } else if (tab == 4) {
            $scope.tabSwitch.tabBehavor = false;
            $scope.tabSwitch.tabTrackingMap = false;
            $scope.tabSwitch.tabTrackingPath = false;
            $scope.tabSwitch.tabPixel = true;
        }
    }

    function DateRangeFormater(str) {
        var reportRange = getReportRange();
        var range = {};
        range.start = moment(reportRange.from).format(str);
        range.end = moment(reportRange.to).format(str);
        return range;
    }

    function showNoDataAlert() {
        $scope.noDataAlert = true;
        $timeout(function () {
            $scope.noDataAlert = false;
        }, 3000);
    };

    $scope.firstRowClass = function (model, first) {
        if ($scope.tabSwitch.tabPixel) {
            return model.ngClass = first ? model.ngClass = 'active bold' : model.ngClass;
        } else {
            return model.ngClass = model.ngClass ? model.ngClass : '';
        }
    };

    function checkGridItem(item) {
        if (item.checked) {
            item.ngClass = 'info';
            if ($scope.gridItemCheckCount == 2) {
                angular.forEach($scope.tempPixelSumList, function (obj, idx) {
                    if ($scope.gridItemCheckCount > 1 && obj.checked && obj.pixel != item.pixel) {
                        obj.checked = false;
                        obj.ngClass = null;
                        $scope.gridItemCheckCount--;
                        if ($scope.series1Item.pixel == obj.pixel) {
                            $scope.series1Item = item;
                        } else {
                            $scope.series2Item = item;
                        }
                    }
                });

            } else {
                //1 or 0 item has been checked
                if ($scope.series1Item == null) {
                    $scope.series1Item = item;
                } else {
                    $scope.series2Item = item;
                }
            }
            $scope.gridItemCheckCount++;
        } else {
            item.ngClass = null;
            $scope.gridItemCheckCount--;
            if ($scope.series1Item.pixel == item.pixel) {
                //keep the only one checked item in series1Item
                $scope.series1Item = $scope.series2Item;
            }
            $scope.series2Item = null;
        }
    }

    function setPixelData(originData) {
        var data = originData.values;
        var dataChart = [];
        var unitArray = null;
        var unitObj = data[0]; // read properties from first data
        for (var prop in unitObj) {
            unitArray = [prop]
            dataChart.push(unitArray);
        }

        for (var j = 0, keyItem; keyItem = dataChart[j]; j++) {
            for (var i = 0, item; item = data[i]; i++) {
                keyItem.push(item[keyItem[0]]);
            }
        }

        dataChart.map(function (arr) {
            if (arr[0] === 'time') {
                arr[0] = 'x';
            } else {
                arr[0] = originData.label + ' - ' + i18n.t('icem.report.type.' + arr[0]);
            };
            return arr[0];
        });

        for (var i = 0, item; item = dataChart[i]; i++) {
            if (item[0] === 'x') {
                var dateArray = dataChart.splice(i, 1)[0];
                dataChart.unshift(dateArray);
            }
        }

        return dataChart;
    }

    $scope.changeChartType = function () {
        if (!chart) return;
        chart.transform($scope.chartType);
    };

    //==================================== d3 chart ========================================= S

    function generateCategory(columns) {
        $scope.chartShow = true;
        if (chart && (pixel1DataContainer !== null && pixel2DataContainer !== null)) {
            chart.transform($scope.chartType);
            chart.load({ columns: columns });
        } else {
            if (chart) {
                chart = null;
            }
            chart = c3.generate({
                padding: c3padding,
                data: {
                    x: 'x',
                    xFormat: dateParseFormat, // 'xFormat' can be used as custom
                    columns: columns,
                    type: $scope.chartType
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: dateParseFormat
                        }
                    }
                },
                bar: {
                    width: {
                        ratio: 0.6
                    }
                },
            });
        }
        // filterReportType();
    }

    function isRatio(type) {
        return type.indexOf('CTR') >= 0 || type.indexOf('CVR') >= 0 || type.indexOf('Effectiveness') >= 0;
    };

    function filterReportType() {
        var option = { withLegend: false };

        if (pixel1DataContainer !== null) {
            for (var i = 0, item; item = pixel1DataContainer.newData[i]; i++) {
                if (i === 1) {
                    chart.show(item[0], option);
                } else if (i !== 0) {
                    chart.hide(item[0], option);
                }
            }
        }

        if (pixel2DataContainer !== null) {
            for (var i = 0, item; item = pixel2DataContainer.newData[i]; i++) {
                if (i === 1) {
                    chart.show(item[0], option);
                } else if (i !== 0) {
                    chart.hide(item[0], option);
                }
            }
        }
        chart.flush();
    }

    $scope.getPixelData = function () {
        var range = {};
        range = new DateRangeFormater('YYYYMMDD');

        // reset pixelDataContainer
        pixel1DataContainer = null;
        pixel2DataContainer = null;

        if ($scope.series1Item !== null && $scope.series1Item.checked === true) {
            loadPixelByDay($scope.series1Item.pixelid, range.start, range.end);
        }

        if ($scope.series2Item !== null && $scope.series2Item.checked === true) {
            loadPixelByDay($scope.series2Item.pixelid, range.start, range.end);
        }

    };

    //==================================== d3 chart ========================================= END


    //==================================== date picker ==============================================S
    function getReportRange() {
        var picker = $('#reportrange').data('daterangepicker');
        var sDate = new Date(picker.startDate.format(dateFormat));
        var eDate = new Date(picker.endDate.format(dateFormat));
        sDate.setHours(0);
        eDate.setHours(23);
        eDate.setMinutes(59);
        eDate.setSeconds(59);
        eDate.setMilliseconds(999);

        var range = {};
        range.from = sDate.getTime();
        range.to = eDate.getTime();
        return range;
    }

    /*=================================================================================*/
    //                                   DatePicker                
    /*=================================================================================*/
    function initDatePicker() {

        var dateLimit = { months: 24 };
        if ($scope.tabBehavor === true) {
            if ($scope.behavorReportDateType !== 1) {
                dateLimit = false;
            }
        }

        var cb = function (start, end, label) {
            $('#reportrange span').html(start.format(dateFormat) + ' - ' + end.format(dateFormat));
        };

        var optionSet = {
            startDate: moment().subtract('days', reportStartDateInterval),
            endDate: moment(),
            minDate: reportMinDate,
            //maxDate: moment(),
            // dateLimit: dateLimit,
            dateLimit: { days: 2 * 365 },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {},
            opens: 'left',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: dateFormat,
            separator: ' to ',
            locale: {
                applyLabel: i18n.t("reportrange.submit"),
                cancelLabel: i18n.t("reportrange.clear"),
                fromLabel: i18n.t("reportrange.dateFrom"),
                toLabel: i18n.t("reportrange.dateTo"),
                customRangeLabel: i18n.t("reportrange.custom"),
                daysOfWeek: [i18n.t("reportrange.daysOfWeek1"), i18n.t("reportrange.daysOfWeek2"), i18n.t("reportrange.daysOfWeek3"),
                    i18n.t("reportrange.daysOfWeek4"), i18n.t("reportrange.daysOfWeek5"), i18n.t("reportrange.daysOfWeek6"),
                    i18n.t("reportrange.daysOfWeek7")
                ],
                monthNames: [i18n.t("reportrange.month1"), i18n.t("reportrange.month2"), i18n.t("reportrange.month3"),
                    i18n.t("reportrange.month4"), i18n.t("reportrange.month5"), i18n.t("reportrange.month6"),
                    i18n.t("reportrange.month7"), i18n.t("reportrange.month8"), i18n.t("reportrange.month9"),
                    i18n.t("reportrange.month10"), i18n.t("reportrange.month11"), i18n.t("reportrange.month12")
                ],
                firstDay: 1
            }
        };

        var text = i18n.t("reportrange.today");
        optionSet.ranges[text] = [moment(), moment()];
        text = i18n.t("reportrange.yesterday");
        optionSet.ranges[text] = [moment().subtract('days', 1), moment().subtract('days', 1)];
        text = i18n.t("reportrange.last7days");
        optionSet.ranges[text] = [moment().subtract('days', 6), moment()];
        text = i18n.t("reportrange.last30days");
        optionSet.ranges[text] = [moment().subtract('days', 29), moment()];
        text = i18n.t("reportrange.thisMonth");
        optionSet.ranges[text] = [moment().startOf('month'), moment().endOf('month')];
        text = i18n.t("reportrange.lastMonth");
        optionSet.ranges[text] = [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')];
        //js will check ranges[text][1] < 'maxDate', so assign it at last
        optionSet['maxDate'] = moment();

        $('#reportrange span').html(moment().subtract('days', reportStartDateInterval).format(dateFormat) + ' - ' + moment().format(dateFormat));

        $('#reportrange').daterangepicker(optionSet, cb);

        //$('#reportrange').on('apply.daterangepicker', drawChart);
    }

};
