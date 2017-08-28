'use strict';

app.controller('reportCtrl', reportCtrl);

reportCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$q', '$window', '$filter', 'ngTableParams', 'CommonService', 'ReportService'];

function reportCtrl($rootScope, $scope, $timeout, $q, $window, $filter, ngTableParams, CommonService, ReportService) {

    // date
    var reportMinDate = '2014/01/01';
    var reportStartDateInterval = 13;
    var dateFormat = 'YYYY-MM-DD';

    // for C3.js chart
    var dateParseFormat = '%Y-%m-%d';
    var chart = null;
    var c3padding = {
        right: 10,
        bottom: 5
    };
    var mapColumnCount = "count";
    var mapUnitId = "category";
    $scope.geoMapHeight = 500;
    $scope.pathMapHeight = 500;
    $scope.chartType = 'line';
    $scope.chartShow = true;
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

    $scope.behavorList = [];

    $scope.behavorReportDateType = 1;

    $scope.tabSwitch = {
        tabBehavior: true,
        tabGeoSum: false,
        tabFootprint: false,
        tabPixelFootprint: false,
        tabLandingInfoTop: false,
        tabPageInfoTop: false,
        tabReferPageInfoTop: false,
        tabReferSiteInfoTop: false
    };

    $scope.currentChart = {
        chartType: 'Behavior', // Behavior, GeoSum, FootprintSum
        dateType: 1,
        apiStr: 'getBehaviorDay',
        loadFun: 'loadBehavior',
        drawFun: 'drawBehavorChart',
    };

    $scope.mapData = null;

    $scope.topList = {
        top10Item: [],
        top10Member: [],
        totalAmount: null,
        totalMember: null,
        totalOrder: null
    };


    /*=================================================================================*/
    //                                API : load Behavior                 
    /*=================================================================================*/

    $scope.loadBehavior = function (dateobj) {
        var deferred = $q.defer();
        ReportService[$scope.currentChart.apiStr]($scope.cSite.id, dateobj.start, dateobj.end).then(function (response) {
            if (!response.data) {
                deferred.reject("Fail");
            }
            var data = response.data;
            for (var i = 0, item; item = data[i]; i++) {
                delete item.siteId;
            }
            var inputData = setBehavors(response);
            deferred.resolve(inputData);
        });
        return deferred.promise;
    };

    /*=================================================================================*/
    //                                API : Path Map
    /*=================================================================================*/

    $scope.loadFootprint = function (dateobj) {
        ReportService[$scope.currentChart.apiStr]($scope.cSite.id, dateobj.start, dateobj.end).then(function (response) {
            var data = response.data;
            $scope[$scope.currentChart.drawFun](data);
        });
    };

    /*=================================================================================*/
    //                                API : pie Chart
    /*=================================================================================*/

    $scope.loadInfoTop = function (dateobj, str) {
        ReportService[$scope.currentChart.apiStr]($scope.cSite.id, dateobj.start, dateobj.end).then(function (response) {
            var data = response.data;
            $scope.reportList = angular.copy(data);
            var chartData = setPieChartData(data, str);
            $scope[$scope.currentChart.drawFun](chartData);
        });
    };

    $scope.tabControl = tabControl;
    $scope.changeDateType = changeDateType;

    $scope.dateTypeOption = '1';
    // init report
    initDatePicker();
    tabControl('Behavior');

    function tabControl(tab) {
        switchTab('tab' + tab);
        switch (tab) {

            case 'Behavior':

                $scope.currentChart.chartType = 'Behavior';
                $scope.currentChart.loadFun = 'loadBehavior';
                $scope.currentChart.drawFun = 'drawBehavorChart';

                var dateObj = changeDateType($scope.dateTypeOption);// init dateType is 'DAYS'

                $scope[$scope.currentChart.loadFun](dateObj).then(function (response) {
                    var behavorDataChart = response
                    $scope[$scope.currentChart.drawFun](behavorDataChart);
                });
                break;

            case 'GeoSum':

                $scope.currentChart.chartType = 'GeoSum';
                $scope.currentChart.loadFun = 'loadGeoSum';
                $scope.currentChart.drawFun = 'drawGeoSum';
                $scope.dateTypeOption = 1; // init dateType is 'DAYS'
                changeGeoSumDateType($scope.dateTypeOption);
                $scope[$scope.currentChart.drawFun]();
                break;

            case 'Footprint':

                $scope.currentChart.chartType = 'Footprint';
                $scope.currentChart.loadFun = 'loadFootprint';
                $scope.currentChart.drawFun = 'drawTrackingPath';
                var range = changeFootprintDateType(1);// init dateType is 'DAYS'
                $scope[$scope.currentChart.loadFun](range);
                break;

            case 'PixelFootprint':

                $scope.currentChart.chartType = 'PixelFootprint';
                $scope.currentChart.loadFun = 'loadFootprint';
                $scope.currentChart.drawFun = 'drawTrackingPath';
                var range = changeFootprintDateType(1);// init dateType is 'DAYS'
                $scope[$scope.currentChart.loadFun](range);
                break;

            // case 'tabLandingInfoTop':

            //     switchTab('tabLandingInfoTop');
            //     $scope.currentChart.chartType = 'LandingInfoTop';
            //     $scope.currentChart.loadFun = 'loadInfoTop';
            //     $scope.currentChart.drawFun = 'drawLandingInfoTop';
            //     var dateObj = changeDateType(1);// init dateType is 'DAYS'
            //     $scope[$scope.currentChart.loadFun](dateObj, 'refersite');

            case 'PageInfoTop':

                $scope.currentChart.chartType = 'PageInfoTop';
                $scope.currentChart.loadFun = 'loadInfoTop';
                $scope.currentChart.drawFun = 'drawLandingInfoTop';
                var dateObj = changeDateType(1);// init dateType is 'DAYS'
                $scope[$scope.currentChart.loadFun](dateObj, 'page');
                break;

            case 'ReferPageInfoTop':

                $scope.currentChart.chartType = 'ReferPageInfoTop';
                $scope.currentChart.loadFun = 'loadInfoTop';
                $scope.currentChart.drawFun = 'drawLandingInfoTop';
                var dateObj = changeDateType(1);// init dateType is 'DAYS'
                $scope[$scope.currentChart.loadFun](dateObj, 'referpage');
                break;

            case 'ReferSiteInfoTop':

                $scope.currentChart.chartType = 'ReferSiteInfoTop';
                $scope.currentChart.loadFun = 'loadInfoTop';
                $scope.currentChart.drawFun = 'drawLandingInfoTop';
                var dateObj = changeDateType(1);// init dateType is 'DAYS'
                $scope[$scope.currentChart.loadFun](dateObj, 'refersite');
                break;

            default:
                console.log('no input tab');
        }
    }

    $scope.reportListName = function () {
        return i18n.t('report.behavor.' + $scope.currentChart.chartType);
    }

    function switchTab(str) {
        $scope.tabSwitch[str] = true;
        for (var prop in $scope.tabSwitch) {
            if (prop !== str) {
                $scope.tabSwitch[prop] = false;
            }
        }
    }

    function DateRangeFormater(str) {
        var reportRange = getReportRange();
        var range = {};
        range.start = moment(reportRange.from).format(str);
        range.end = moment(reportRange.to).format(str);
        return range;
    }

    function changeFootprintDateType(type) {
        var range = {};
        range = new DateRangeFormater('YYYYMMDD');
        $scope.behavorReportDateType = parseInt(type);
        $scope.currentChart.dateType = 1;
        $scope.currentChart.apiStr = "get" + $scope.currentChart.chartType;
        dateParseFormat = '%Y%m%d';
        return range;
    };

    function changeGeoSumDateType(type) {
        $scope.behavorReportDateType = parseInt(type);
        $scope.currentChart.dateType = 1;
        $scope.currentChart.apiStr = "get" + $scope.currentChart.chartType;
        dateParseFormat = '%Y%m%d';
    };


    function changeDateType(type) {
        $scope.behavorReportDateType = parseInt(type);
        $scope.dateTypeOption = $scope.behavorReportDateType;

        var range = {};

        switch ($scope.behavorReportDateType) {
            case 1:
                range = new DateRangeFormater('YYYYMMDD');
                $scope.currentChart.dateType = 1;
                $scope.currentChart.apiStr = "get" + $scope.currentChart.chartType + "Day";
                dateParseFormat = '%Y%m%d'
                break;
            case 2:
                range = new DateRangeFormater('YYYYMM');
                $scope.currentChart.dateType = 2;
                $scope.currentChart.apiStr = "get" + $scope.currentChart.chartType + "Month";
                dateParseFormat = '%Y%m';
                break;
            // case 3:
            //     range = new DateRangeFormater('YYYY');
            //     $scope.currentChart.dateType = 3;
            //     $scope.currentChart.apiStr = "get" + $scope.currentChart.chartType + "Year";
            //     dateParseFormat = '%Y';
            //     break;
        }
        return range;
    }

    function setBehavors(behavorList) {
        var data = behavorList.data;
        var behavorDataChart = [];
        var unitObj = data[0]; // read properties from first data
        for (var prop in unitObj) {
            var unitArray = [prop];
            behavorDataChart.push(unitArray);
        }

        for (var j = 0, keyItem; keyItem = behavorDataChart[j]; j++) {
            for (var i = 0, item; item = data[i]; i++) {
                keyItem.push(item[keyItem[0]]);
            }
        }

        behavorDataChart.map(function (arr) {
            if (arr[0] === 'time') {
                arr[0] = 'x';
            };
            return arr[0];
        });

        for (var i = 0, item; item = behavorDataChart[i]; i++) {
            if (item[0] === 'x') {
                var dateArray = behavorDataChart.splice(i, 1)[0];
                behavorDataChart.unshift(dateArray);
            }
        }

        return behavorDataChart;
    }

    function setPieChartData(data, main) {
        var pieDataList = [];
        if (data.length !== 0) {
            data.forEach(function (obj) {
                var unitArray = [obj[main]];
                unitArray.push(obj.percentage);
                // unitArray.push(obj.impressionnum);
                pieDataList.push(unitArray);
            });
        }
        return pieDataList;
    }

    $scope.drawBehavorChart = function (data) {
        generateCategory(data);
        $scope.chartShow = true;
    }

    $scope.isShowChart = function (flag) {
        if (flag) {
            $scope.chartShow = true;
        } else {
            $scope.chartShow = false;
        }
    };

    $scope.changeChartType = function () {
        if (!chart) return;
        chart.transform($scope.chartType);
    }

    $scope.drawPageInfoTop = function (json, mainArray) {
        if (chart) {
            chart = null;
        }
        var chart = c3.generate({
            bindto: '#landingInfoTop',
            padding: c3padding,
            size: {
                height: 400
            },
            data: {
                json: json,
                keys: {
                    value: mainArray,
                },
                type: 'pie'
            }
        });
    }

    $scope.drawLandingInfoTop = function (columns) {
        if (chart) {
            chart = null;
        }
        var chart = c3.generate({
            bindto: '#landingInfoTop',
            padding: c3padding,
            size: {
                height: 400
            },
            data: {
                columns: columns,
                type: 'pie'
            }
        });
    };

    $scope.drawTrackingPath = function (data) {
        d3.select('#sankey').html('');

        var raw_data = [];
        var sankey = new Sankey();
        var level0Count = 0;

        angular.forEach(data.pairs, function (obj, idx) {
            var pairData = [];
            if (obj.current == '0-') {
                level0Count += obj.count;
            }
            pairData.push(obj.current);
            pairData.push(obj.count);
            pairData.push(obj.next);
            raw_data.push(pairData);
        });

        var name_conversions = {
            "0-": i18n.t("report.footprint.starting.point")
        };

        sankey.convert_box_description_labels_callback = function (name) {
            var alternative_name = name_conversions[name];
            if (alternative_name == null) alternative_name = name;
            return alternative_name;
        };

        var startNode = [];
        startNode.push(data.startNode);
        sankey.stack(0, startNode);
        sankey.stack(1, data.level1Nodes);
        sankey.stack(2, data.level2Nodes);
        sankey.stack(3, data.level3Nodes);
        sankey.stack(4, data.level4Nodes);
        sankey.stack(5, data.level5Nodes);

        var nodeColor = {};
        angular.forEach(data.allNodes, function (obj, idx) {
            nodeColor[obj] = getRandomColor();
        });

        sankey.setColors(nodeColor);
        var chartHeight = 300;
        sankey.convert_flow_values_callback = function (flow) {
            return flow * (chartHeight / level0Count); // Pixels per track
            //dynamically define
        };

        sankey.nudge_colours_callback = function () {
            //Fix the root color
            this.recolour(this.boxes["0-"].right_lines, "#CCEEFF");
        };

        sankey.y_space = 30;
        sankey.right_margin = 220;
        sankey.left_margin = 80;

        sankey.convert_box_value_labels_callback = function (flow) {
            return (flow + " " + i18n.t("report.footprint.unit"));
        };

        sankey.setData(raw_data);
        sankey.draw();

    };

    $scope.drawGeoSum = function (mapElement) {

        var width = $('#chart').innerWidth();
        var height = $scope.geoMapHeight;
        var map = null;

        var range = {};
        range = new DateRangeFormater('YYYYMMDD');

        var args = {
            initProvince: false,
            initCountry: null
        };

        if (mapElement && mapElement.id) {
            width = $('#map').innerWidth();
            if (mapElement.id === 'USA') {
                d3.select('#map').html('');
                args.initCountry = mapElement.id;
                map = d3.geomap.choropleth()
                    .geofile('topojson/countries/' + mapElement.id + '.json')
                    .projection(d3.geo.albersUsa)
                    .column(mapColumnCount)
                    .unitId(mapUnitId)
                    .scale(width * 0.8)
                    .height(height)
                    .translate([width / 2, height / 2])
                    .postUpdate(countryPostUpdate)
                    .format(format)
                    .legend(true);
            } else if (mapElement.id === 'CHN') {
                d3.select('#map').html('');
                args.initCountry = mapElement.id;
                args.initProvince = true;
                var topojson = i18n.t("report.topo.country.china.path");
                var topojson = 'topojson/countries/CHN_CN.json';
                map = d3.geomap.choropleth()
                    .geofile(topojson)
                    .scale(width * 0.5)
                    .format(format)
                    .postUpdate(countryPostUpdate)
                    //smaller x shift window center to the east
                    //smaller y shift window center to the south
                    .translate([-width / 2.5, 500 + (height * 0.25)])
                    .column(mapColumnCount)
                    .unitId(mapUnitId)
                    .legend(true);
            } else {
                return true;
            }
        } else {
            d3.select('#map').html('');
            var topojson = i18n.t("report.topo.country.path");
            map = d3.geomap.choropleth()
                .geofile(topojson)
                .column(mapColumnCount)
                .format(format)
                .legend(true)
                .height(height)
                .postUpdate(worldPostUpdate)
                .unitId(mapUnitId);
        }

        ReportService[$scope.currentChart.apiStr]($scope.cSite.id, range.start, range.end, args.initProvince, args.initCountry).then(function (response) {
            var data = response.data;
            $scope.mapData = data;
            // add a zero object to $scope.mapData for preventing legend failing
            $scope.mapData.push({ category: "-", count: 0 });
            d3.select('#map')
                .datum($scope.mapData)
                .call(map.draw, map);
        });
    };

    function format(d) {
        if (d > 100000) {
            d = d / 1000000;
            return $filter('number')(d, 2) + ' ' + i18n.t('report.unit.million');
        } else {
            return $filter('number')(d, 0);
        }
    }

    function worldPostUpdate() {
        var svg = d3.select("#map").select("svg");
        svg.selectAll("path").on('mousedown', $scope.drawGeoSum);
    }

    function countryPostUpdate() {
        var svg = d3.select("#map").select("svg");
        //svg.selectAll("path").on('mousedown',countryPathClick);
        svg.selectAll(".background").on('click', function () { $scope.drawGeoSum(); });
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    //==================================== d3 chart ========================================= S

    function generateCategory(columns, category) {
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
    }

};
