'use strict';

// app.controller('trendViewCtrl', function ($scope, $filter, $window, $timeout, ngTableParams, CommonService, $location, DmpService) {
app.controller('trendViewCtrl', trendViewCtrl);

trendViewCtrl.$inject = ['$scope', '$filter', '$window', '$timeout', 'ngTableParams', 'CommonService', '$location', 'DmpService'];

function trendViewCtrl($scope, $filter, $window, $timeout, ngTableParams, CommonService, $location, DmpService){

   // date
	var milliInDay = 86400000;
	var reportMinDate = '2016/01/01';
	var reportStartDateInterval = 60;
	var dateFormat = 'YYYY-MM-DD';

	// chart
	var chart = null;
    var mapColumnCount = "count";
    var dateParseFormat = '%Y-%m-%d';
    var mapUnitId = "category";
    var activity = [];
    var activityPre = [];
    var c3padding = {
		right: 10,
		bottom: 5
	};
    var enableLegend = [];
    var nSite = [];
    var npage = 1;
    var ncount = 30;
    var tempListObj = null;
    var dateIndex = [];
    var prefixArray = [];
    var prefixMarkupArray = [];
    var originCategory = null;

    // model
	$scope.prefixObj = {};
	$scope.prefixMarkupObj = {};
    $scope.subPanel = { mediaType: 'Display' };
    $scope.DSP = ["Adwords", "DBM", "Facebook", "YAM", "ClickForce"];
    $scope.showTogglePopover = false;
    $scope.chartType = 'line';
   	$scope.chartShow = false;
    $scope.markup = true;
    $scope.aggAdvertiser = true;
    $scope.individualAdv = !$scope.aggAdvertiser;
    $scope.inAdv = true;
    $scope.listNoData = false;
    $scope.endAJAX = false;
    $scope.transDataLength = null;
    $scope.getDataArray = [];
	$scope.columns = [];
    $scope.markupcolumns = [];
	$scope.selectionSite = [];
	$scope.category = [];
	$scope.media = ["Display", "Video", "Social"];
	$scope.metric = [
		'cpm',
		'cpc',
		'cpa',
		'cpv',
		'ctr',
		'vtr'
	];
	$scope.topPanel = { category: '', mediaType: 'Display', metric: $scope.metric[0] };
	$scope.storedData = [];
    $scope.storedMarkupData = [];
    $scope.selectedCategory = " - All - ";
    $scope.catequery = '';

    // function
	$scope.changeChartType = changeChartType;
	$scope.applyDayRange = applyDayRange;
	$scope.getTransition = getTransition;
	$scope.creatPrefix = creatPrefix;
	$scope.pushToColumns = pushToColumns;
	$scope.generateChart = generateChart;

    function loadCategory() {
        DmpService.getLoadCategory($scope.cSite.id).then(function (response) {
            var data = response.data;
            if (data.data.length > 0) {
                originCategory = angular.copy(data.data);
                $scope.category = $filter('filter')(data.data, { parentid: 0 }, true);
                for (var i = 0, pItem; pItem = $scope.category[i]; i++) {
                    pItem['subCategory'] = [];
                    for (var j = 0, item; item = data.data[j]; j++) {
                        if (pItem.id == item.parentid) {
                            pItem.subCategory.push(item);
                        }
                    }
                }
                var allCategory = {
					id: null,
					name: " - All - ",
					parentid: null
				}
                $scope.category.unshift(allCategory)
                $scope.selectedCategory = $scope.category[0].name;
            }
        });
    };

    $scope.onCategory = function (model) {
        model.showSub = true;
    };

    $scope.clickCategory = function (model, x) {
        $scope.selectedCategory = model.name;
        if (x) {
            // edit
            x.category = model.id;
        } else {
            // add new
            $scope.topPanel.category = model.id;
        }
    };

    $scope.saveSite = function (name, id) {
		var siteObj = { name: name, id: id };
		var arr = [];
		if ($scope.selectionSite.length > 0) {
			angular.forEach($scope.selectionSite, function (obj, idx) {
				arr = $filter('filter')($scope.selectionSite, { id: id });
				if (obj.id == id) {
					$scope.selectionSite.splice(idx, 1);
				} else if (arr.length == 0) {
					$scope.selectionSite.push(siteObj);
				}
			});
		} else {
			$scope.selectionSite.push(siteObj);
		}
    };

    $scope.openSiteList = function () {
		$('#uploadListModal').modal('show');
    };

    $scope.cancelSite = function () {
		$scope.selectionSite = [];
    };

    function changeChartType() {
		chart.transform($scope.chartType);
    };

    function isRatio(type) {
		return type.indexOf('CTR') >= 0 || type.indexOf('CVR') >= 0 || type.indexOf('Effectiveness') >= 0 || type.indexOf('VTR') >= 0;
    };

    function initDatePicker() {
		var cb = function (start, end, label) {
			$('#reportrange span').html(start.format(dateFormat) + ' - ' + end.format(dateFormat));
		};

		var optionSet = {
			startDate: moment().subtract('days', reportStartDateInterval),
			endDate: moment(),
			minDate: reportMinDate,
			//maxDate: moment(),
			dateLimit: { days: 60 },
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
					i18n.t("reportrange.daysOfWeek7")],
				monthNames: [i18n.t("reportrange.month1"), i18n.t("reportrange.month2"), i18n.t("reportrange.month3"),
					i18n.t("reportrange.month4"), i18n.t("reportrange.month5"), i18n.t("reportrange.month6"),
					i18n.t("reportrange.month7"), i18n.t("reportrange.month8"), i18n.t("reportrange.month9"),
					i18n.t("reportrange.month10"), i18n.t("reportrange.month11"), i18n.t("reportrange.month12")],
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
    };

    function format(d) {
		if (d > 100000) {
			d = d / 1000000;
			return $filter('number')(d, 2) + ' ' + i18n.t('report.unit.million');
		} else {
			return $filter('number')(d, 0);
		}
	};

    function getReportRange() {
		var picker = $('#reportrange').data('daterangepicker');
        if (!picker) {
            return;
        }
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


    function applyDayRange(item) {
		if (!item || !item.mediaType) {
			alert("[" + i18n.t("icem.campaign.mediatype") + "] "
				+ i18n.t("icem.mandatory"));
			return;
		}
		$scope.getDataArray = [];
		$scope.columns = [];
        $scope.markupcolumns = [];
        dateIndex = [];
       	$scope.chartShow = false;
       	$scope.subPanel = { mediaType: item.mediaType };
       	$scope.storedData = [];
        $scope.storedMarkupData = [];
        $scope.catequery = '';
        refreshCampaignTable();
    };

    function getTransition() {
		var args;
		if ($scope.aggAdvertiser) {
			// sids is optional
			args = requestParam('Transition-IndiTrue');
		} else {
			// must have sids
			args = requestParam('Transition-IndiFalse');
		}

        if (args) {
			var transitionVO = {
				"aggAdv": args.aggAdv,
				"campaign": null,
				"category": args.category,
				"dataFromUTCMSec": args.dateFrom,
				"dataToUTCMSec": args.dateTo,
				"dsp": null,
				"mediaType": args.mediaType,
				"siteIds": args.sids.toString()
			}
			// console.log('transitionVO->',transitionVO);
            DmpService.getCampaignReportTransitionTrend($scope.cSite.id, transitionVO).then(function (response) {
                var data = response.data;
                if (data.data.length > 0) {
                    if ($scope.aggAdvertiser) {
                        var transitionObj = angular.copy(data.data[0].listCampData);
                        creatPrefix(null, transitionObj, $scope.markup);
                    } else {
                        $scope.transDataLength = data.data.length;
                        for (var i = 0; i < data.data.length; i++) {
                            var transitionObjTwo = angular.copy(data.data[i].listCampData);
							creatPrefix(i, transitionObjTwo, $scope.markup);
                        }
                    }
                    $scope.$watch('endAJAX', function (newValue, oldValue) {
                        if (newValue == true && oldValue == true) {
                            generateChart($scope.markup);
                        }
                    }, true);
                } else {
                    generateChart($scope.markup);
                }
            });
        }
    }

    function creatPrefix(i, transitionObj, markup) {

		$scope.prefixObj = {};
		$scope.prefixMarkupObj = {};

		var label1Prefix;
		if ($scope.aggAdvertiser) {
			if (transitionObj[0].campaign == null) {
				label1Prefix = i18n.t("icem.campaign.sum");
			} else {
				label1Prefix = transitionObj[0].campaign;
			}
		} else {
			var siteNameFilter = $filter('filter')($scope.siteList, { id: transitionObj[0].siteId })[0];
			label1Prefix = siteNameFilter.name;
		}

		$scope.prefixObj.base = ['date' + label1Prefix];

		$scope.prefixObj.cpm = [label1Prefix + ' - ' + i18n.t("report.type.avgcpm")];
		$scope.prefixObj.cpc = [label1Prefix + ' - ' + i18n.t("report.type.avgcpc")];
		$scope.prefixObj.cpa = [label1Prefix + ' - ' + i18n.t("report.type.cpa")];
		$scope.prefixObj.cpv = [label1Prefix + ' - ' + i18n.t("report.type.cpv")];
		$scope.prefixObj.ctr = [label1Prefix + ' - ' + i18n.t("report.type.ctrRatio")];
		$scope.prefixObj.vtr = [label1Prefix + ' - ' + i18n.t("report.type.vtr")];
		$scope.prefixObj.cvr = [label1Prefix + ' - ' + i18n.t("report.type.cvr")];

        // for store markup data (prefix are the same)
		$scope.prefixMarkupObj.base = ['date' + label1Prefix];
		$scope.prefixMarkupObj.mcpm = [label1Prefix + ' - ' + i18n.t("report.type.avgcpm")];
		$scope.prefixMarkupObj.mcpc = [label1Prefix + ' - ' + i18n.t("report.type.avgcpc")];
		$scope.prefixMarkupObj.mcpa = [label1Prefix + ' - ' + i18n.t("report.type.cpa")];
		$scope.prefixMarkupObj.mcpv = [label1Prefix + ' - ' + i18n.t("report.type.cpv")];
		$scope.prefixMarkupObj.mctr = [label1Prefix + ' - ' + i18n.t("report.type.ctrRatio")];
		$scope.prefixMarkupObj.mvtr = [label1Prefix + ' - ' + i18n.t("report.type.vtr")];
		$scope.prefixMarkupObj.mcvr = [label1Prefix + ' - ' + i18n.t("report.type.cvr")];

		pushToColumns(transitionObj, markup, i);
    };

    function pushToColumns(transitionObj, markup, i) {
		angular.forEach(transitionObj, function (obj) {
			$scope.prefixObj.base.push($filter('date')(obj.date, 'yyyy-MM-dd'));
			$scope.prefixObj.cpm.push(obj.cpm ? obj.cpm : 0);
			$scope.prefixObj.cpc.push(obj.cpc ? obj.cpc : 0);
			$scope.prefixObj.cpa.push(obj.cpa ? obj.cpa : 0);
			$scope.prefixObj.cpv.push(obj.cpv ? obj.cpv : 0);
			$scope.prefixObj.ctr.push(obj.ctr ? obj.ctr : 0);
			$scope.prefixObj.vtr.push(obj.vtr ? obj.vtr : 0);
			$scope.prefixObj.cvr.push(obj.cvr ? obj.cvr : 0);

			$scope.prefixMarkupObj.base.push($filter('date')(obj.date, 'yyyy-MM-dd'));
			$scope.prefixMarkupObj.mcpm.push(obj.mcpm ? obj.mcpm : 0);
			$scope.prefixMarkupObj.mcpc.push(obj.mcpc ? obj.mcpc : 0);
			$scope.prefixMarkupObj.mcpa.push(obj.mcpa ? obj.mcpa : 0);
			$scope.prefixMarkupObj.mcpv.push(obj.mcpv ? obj.mcpv : 0);
			$scope.prefixMarkupObj.mcvr.push(obj.mcvr ? obj.mcvr : 0);
			$scope.prefixMarkupObj.mvtr.push(obj.mvtr ? obj.mvtr : 0);
			$scope.prefixMarkupObj.mctr.push(obj.mctr ? obj.mctr : 0);
		});

		$scope.storedData.push($scope.prefixObj);
		$scope.storedMarkupData.push($scope.prefixMarkupObj);

		makeColumns($scope.topPanel.metric);
		endAJAXdata(i);
    }

    function makeColumns(model) {
		angular.forEach($scope.storedData, function (obj, idx) {
			var metricCols = [obj.base, obj[model]];
			for (var i = 0; i < metricCols.length; i++) {
				$scope.columns.push(metricCols[i]);
			}
		});
		angular.forEach($scope.storedMarkupData, function (obj, idx) {
			var metricMarkupCols = [obj.base, obj["m" + model]];
			for (var i = 0; i < metricMarkupCols.length; i++) {
				$scope.markupcolumns.push(metricMarkupCols[i]);
			}
		});
    }

    function endAJAXdata(i) {
		if ($scope.aggAdvertiser) {
			$scope.endAJAX = true;
		} else {
			if (i == $scope.transDataLength - 1) {
				$scope.endAJAX = true;
			}
		}
    }

    $scope.changeMetric = function () {
		$scope.columns = [];
		$scope.markupcolumns = [];
		makeColumns($scope.topPanel.metric);
		generateChart($scope.markup)
    }

    $scope.changeMarkup = function () {
		generateChart($scope.markup)
    }

    function generateChart(markup) {
		var cols = $scope.columns;
		if (markup) {
			cols = $scope.markupcolumns;
		}
		$scope.chartShow = true;

		$timeout(function () {
			if (cols.length > 0) {
				var xs = {};
				dateIndex = [];
				angular.forEach(cols, function (obj, idx) {
					if (obj[0].substring(0, 4) == 'date') {
						dateIndex.push(idx);
					}
				});

				for (var k = 0; k < dateIndex.length; k++) {
					xs[cols[dateIndex[k] + 1][0]] = cols[dateIndex[k]][0];
				}

				chart = c3.generate({
					padding: c3padding,
					data: {
						xs: xs,
						xFormat: dateParseFormat, // 'xFormat' can be used as custom format parsing 'x'
						columns: cols,
						type: $scope.chartType,
					},
					legend: {
						show: true,
					},
					bar: {
						width: {
							ratio: 0.5 // this makes bar width 50% of length between ticks
						}
					},
					axis: {
						x: {
							type: 'timeseries',
							tick: {
								format: dateParseFormat
							}
						},
						y: {
							tick: {
								format: function (d) {
									if (d > 9999 || d < -999) {
										var formatA = d3.format(".4g");
										return formatA(d);
									} else if (d < 1 && d > -1) {
										var formatB = d3.format(".2f");
										return formatB(d);
									} else {
										var formatC = d3.format(".2f");
										return formatC(d * 100) / 100;
									}
								},
							}
						}
					},
					tooltip: {
						format: {
							title: function (d) {
								if (d instanceof Date) {
									var format = d3.time.format(dateParseFormat);
									return format(d);
								} else {
									return d;
								}
							},
							value: function (value, ratio, id) {
								var format = isRatio(id) ? d3.format('%') : d3.format(',');
								return format(value);
							}
						}
					},
				});
			}
		}, 0); //timeout, used to solve chart exceed problem
		if (cols.length == 0) {
			$scope.chartShow = false;
		}
    }

    function requestParam(type) {

		var args = {};
		var cate = '';
		if ($scope.topPanel.category) {
			cate = $scope.topPanel.category;
		}
		args.category = cate;
		args.mediaType = $scope.topPanel.mediaType;
		var range = getReportRange();
        if (!range) {
            return;
        }
		args.dateFrom = range.from;
		args.dateTo = range.to;
		args.aggAdv = $scope.aggAdvertiser;
		if ($scope.selectionSite.length > 0) {
			args.sids = $scope.selectionSite[0].id;
			for (var i = 1; i < $scope.selectionSite.length; i++) {
				args.sids += "," + $scope.selectionSite[i].id;
			}
		} else {
			args.sids = $scope.siteList[0].id;
			for (var i = 1; i < $scope.siteList.length; i++) {
				args.sids += "," + $scope.siteList[i].id;
			}
		}

		switch (type) {
			case 'ListTrend-aggAdvTrue':
				args.page = npage;
				args.count = ncount;
				break;

			case 'ListTrend-aggAdvFalse':
				args.page = npage;
				args.count = ncount;
				break;

			case 'Transition-IndiTrue':
				break;

			case 'Transition-IndiFalse':
				break;
        }
		return args;
    }

    function refreshCampaignTable() {
		var args = {};
		var FirstTableApi = null;

		if ($scope.campaignTableParams) {
			$scope.campaignTableParams.reload();
		} else {
			$scope.campaignTableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10
			}, {
					total: 0,           // length of data
					counts: [],
					getData: function ($defer, params) {
						// FirstTableApi = CampaignListTrend;
						if ($scope.aggAdvertiser) {
							args = requestParam('ListTrend-aggAdvTrue');
						} else {
							args = requestParam('ListTrend-aggAdvFalse');
						}

						// console.log('args : ', args);
						var queryVO = {
							"aggAdv": args.aggAdv,
							"campaign": null,
							"category": args.category,
							"dataFromUTCMSec": args.dateFrom,
							"dataToUTCMSec": args.dateTo,
							"dsp": null,
							"mediaType": args.mediaType,
							"siteIds": args.sids.toString(),
							"page": params.page(),
							"pageSize": params.count()
						};

						DmpService.getCampaignReportListTrend($scope.cSite.id, queryVO).then(function (response) {
							var data = response.data;
							var currentPageLink = $location.url();
							var type = currentPageLink.slice(1, currentPageLink.length);
							if (type !== "campaignTrendView") {
								return;
							}

							if (data.data.campaignreportvos.length === 0) {
								$scope.listNoData = true;
							} else if (data.data.campaignreportvos.length == 1) {
								if (data.data.campaignreportvos[0].siteId) {
									$scope.inAdv = false;
									getSiteName(data.data);
								} else {
									$scope.inAdv = true;
								}
								$scope.listNoData = false;
							} else {
								$scope.inAdv = false;
								$scope.listNoData = false;
								getSiteName(data.data);
							}

							tempListObj = angular.copy(data.data.campaignreportvos);
							getTransition();

							params.total(data.data.totalElements);
							if (params.page() > 1 && (!data.data || data.data.campaignreportvos.length == 0)) {
								//go previous page when no recommend in this page
								params.page(params.page() - 1);
							} else {
								$defer.resolve(data.data.campaignreportvos);
							}
						});
					}
				});
		}
    }

    function getSiteName(data) {
		angular.forEach(data.campaignreportvos, function (obj, idx) {
			var siteName = $filter('filter')($scope.siteList, { id: obj.siteId })[0];
			obj.name = siteName.name;
		});
    }

    $scope.initReport = function () {
		initDatePicker();
		loadCategory();
		applyDayRange($scope.topPanel);
		$timeout(function () {
			$scope.showTogglePopover = false;
			if (chart) {
				chart.flush();
			}
        }, 1500);
    };
};
