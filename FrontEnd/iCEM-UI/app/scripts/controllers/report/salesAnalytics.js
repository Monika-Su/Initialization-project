'use strict';

app.controller('salesAnalyticsCtrl', salesAnalyticsCtrl);

salesAnalyticsCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$window', '$q', '$filter', 'ngTableParams', 'CommonService', 'ReportService'];

function salesAnalyticsCtrl($rootScope, $scope, $timeout, $window, $q, $filter, ngTableParams, CommonService, ReportService){

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
    $scope.chartType = 'line';
    $scope.chartShow = true;
    $scope.chartCategory = [
        { 'name': 'report.chart.type.line', 'value': 'line' },
        { 'name': 'report.chart.type.bar', 'value': 'bar' },
        { 'name': 'report.chart.type.spline', 'value': 'spline' },
        { 'name': 'report.chart.type.step', 'value': 'step' },
        { 'name': 'report.chart.type.area', 'value': 'area' },
        { 'name': 'report.chart.type.area-spline', 'value': 'area-spline' },
        { 'name': 'report.chart.type.area-step', 'value': 'area-step' },
        { 'name': 'report.chart.type.scatter', 'value': 'scatter' },
    ];

    $scope.topList = {
        top10Item: [],
        top10Member: [],
        totalAmount: null,
        totalMember: null,
        totalOrder: null
    };


    // init page
    initDatePicker();
    var range = new DateRangeFormater('YYYYMMDD');
    loadSalesActivity(range).then(function () {
        var salesChart = setChartData($scope.topList.dailyReport);
        generateSalesChart(salesChart);
    });

    $scope.changeChartType = function () {
        if (!chart) return;
        chart.transform($scope.chartType);
    };

    $scope.getSales = function () {
        var range = new DateRangeFormater('YYYYMMDD');
        loadSalesActivity(range).then(function () {
            var salesChart = setChartData($scope.topList.dailyReport);
            generateSalesChart(salesChart);
        });
    };

    function setChartData(data) {
        var salesChart = [];
        var unitObj = data[0]; // read properties from first data

        for (var prop in unitObj) {
            var unitArray = [prop];
            salesChart.push(unitArray);
        }

        for (var j = 0; j < salesChart.length; j++) {
            for (var i = 0; i < data.length; i++) {
                salesChart[j].push(data[i][salesChart[j][0]]);
            };
        };

        for (var j = 0; j < salesChart.length; j++) {
            if (salesChart[j][0] === 'statisticsDate') {
                salesChart[j][0] = 'x';
                break;
            }
        }

        return salesChart;
    }

    /*=================================================================================*/
    //                                D3 Chart                
    /*=================================================================================*/

    function generateSalesChart(columns) {
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
        //chart.zoom.enable(true);
    }

    /*=================================================================================*/
    //                                API : load Behavior                 
    /*=================================================================================*/
    function loadSalesActivity(dateobj) {
        var deferred = $q.defer();

        ReportService.getSalesActivity($scope.cSite.id, dateobj.start, dateobj.end).then(function (response) {
            var data = response.data;
            $scope.topList.dailyReport = angular.copy(data.dailyReport);
            $scope.topList.top10Item = angular.copy(data.top10Item);
            $scope.topList.top10Member = angular.copy(data.top10Member);
            $scope.topList.totalAmount = angular.copy(data.totalAmount);
            $scope.topList.totalMember = angular.copy(data.totalMember);
            $scope.topList.totalOrder = angular.copy(data.totalOrder);
            deferred.resolve("Success");
        });

        return deferred.promise;
    }

    /*=================================================================================*/
    //                                   DatePicker                
    /*=================================================================================*/

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

    function DateRangeFormater(str) {
        var reportRange = getReportRange();
        var range = {};
        range.start = moment(reportRange.from).format(str);
        range.end = moment(reportRange.to).format(str);
        return range;
    }

    function initDatePicker() {

        var cb = function (start, end, label) {
            $('#reportrange span').html(start.format(dateFormat) + ' - ' + end.format(dateFormat));
        };

        var optionSet = {
            startDate: moment().subtract('days', reportStartDateInterval),
            endDate: moment(),
            minDate: reportMinDate,
            //maxDate: moment(),
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
    }
};
