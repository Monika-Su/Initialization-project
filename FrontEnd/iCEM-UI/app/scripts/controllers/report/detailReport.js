'use strict';

app.controller('detailReportCtrl', detailReportCtrl);

detailReportCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$q', '$window', '$filter', 'ngTableParams', 'CommonService', 'ReportService'];

function detailReportCtrl($rootScope, $scope, $timeout, $q, $window, $filter, ngTableParams, CommonService, ReportService) {

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

    $scope.currentChart = {
        chartType: '',
        apiStr: '',
        loadFun: '',
        drawFun: '',
    };

    // panel shows and hide
    $scope.tabSwitch = {
        tabitemOrderInfoTop: true
    };

    $scope.tabControl = tabControl;

    initPage();

    function initPage() {
        initDatePicker();
        tabControl('itemOrderInfoTop');
    };


    function tabControl(tab) {
        switchTab('tab' + tab);

        $scope.currentChart.chartType = tab;
        $scope.currentChart.loadFun = 'load' + tab;
        $scope.currentChart.drawFun = 'draw' + tab;
        $scope.currentChart.apiStr = "get" + $scope.currentChart.chartType + "Day";

        var range = new DateRangeFormater('YYYYMMDD');
        loadData(range).then(function (response) {
            var Processer = new ProcessData(response);
            var categoryData = Processer.categoryColumns('itemname');
            var subData = Processer.dataColumns('quantity');
            var groupsArray = Processer.getGroupsArray();
            var finalColumns = Processer.finalColumns(categoryData, subData);
            // console.log(categoryData, subData, groupsArray, finalColumns);
            // window[$scope.currentChart.drawFun](finalColumns, groupsArray);
            $scope[$scope.currentChart.drawFun](finalColumns, groupsArray);

        });
    };

    function ProcessData(data) {
        this.rawData = data;
        this.categoryColumns = function (main) {
            if (!this.rawData || this.rawData.length === 0) {
                return [];
            }
            var arr = this.rawData.map(function (obj) {
                return obj[main];
            });
            arr.unshift('x');
            return arr;
        };
        this.dataColumns = function (sub) {
            if (!this.rawData || this.rawData.length === 0) {
                return [];
            }
            var propArray = Object.keys(this.rawData[0])
                .filter(function (obj) {
                    return obj === sub;
                });
            this.setGroupsArray(propArray);

            var allDataArray = [];
            for (var i = 0; i < propArray.length; i++) {
                var arr = this.rawData.map(function (obj) { return obj[propArray[i]] });
                var unitArr = [this.getGroupsArray()[i]].concat(arr);
                allDataArray.push(unitArr);
            }
            return allDataArray;
        };
        this.setGroupsArray = function (arr) {
            this.groupsArray = arr.map(function(obj){
                obj =i18n.t('icem.detailReport.' + obj)
                return obj;
            });
        };
        this.getGroupsArray = function () {
            return this.groupsArray || [];
        };
        this.finalColumns = function (categoryData, subData) {
            var finalArr = [categoryData];
            subData.forEach(function (obj) {
                finalArr.push(obj);
            });
            return finalArr;
        }
    }

    function switchTab(str) {
        $scope.tabSwitch[str] = true;
        for (var prop in $scope.tabSwitch) {
            if (prop !== str) {
                $scope.tabSwitch[prop] = false;
            }
        }
    };

    function DateRangeFormater(str) {
        var reportRange = getReportRange();
        var range = {};
        range.start = moment(reportRange.from).format(str);
        range.end = moment(reportRange.to).format(str);
        return range;
    };

    /*=================================================================================*/
    //                                C3js chart                
    /*=================================================================================*/
    // function drawitemOrderInfoTop(finalColumns, groupsArray) {
    $scope.drawitemOrderInfoTop = function (finalColumns, groupsArray) {
        if (chart) {
            chart = null;
        }
        chart = c3.generate({
            padding: c3padding,
            bindto: '#chart',
            data: {
                x: 'x',
                columns: finalColumns,
                groups: [
                    groupsArray
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                }
            },
            bar: {
                width: {
                    ratio: 0.2
                }
            },
            // tooltip: {
            //     format: {
            //         title: function (d) { 
            //             console.log('title: ',d); 
            //             console.log('groupsArray: ',groupsArray); 
            //             return i18n.t('icem.detailReport.' + groupsArray[0])
            //         },
            //         value: function (value, ratio, id) {
            //             console.log('value, ratio, id : ',value, ratio, id);
            //             // var format = id === 'data1' ? d3.format(',') : d3.format('$');
            //             return value;
            //         }
            //     }
            // }
        });
    }

    /*=================================================================================*/
    //                                API : load data                 
    /*=================================================================================*/

    function loadData(dateobj) {
        var deferred = $q.defer();
        ReportService[$scope.currentChart.apiStr]($scope.cSite.id, dateobj.start, dateobj.end).then(function (response) {
            if (!response.data) {
                deferred.reject(false);
            }
            var data = angular.copy(response.data);
            deferred.resolve(data);

            // var inputData = setBehavors(response);
            // deferred.resolve(inputData);
        });
        return deferred.promise;
    };

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
        if ($scope.tabBehavior === true) {
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
    };


}