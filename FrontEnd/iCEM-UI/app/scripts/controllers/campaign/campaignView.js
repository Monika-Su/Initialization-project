'use strict';

app.controller('campaignViewCtrl', campaignViewCtrl);

campaignViewCtrl.$inject = ['$scope', '$filter', '$window', '$timeout', 'ngTableParams', 'CommonService', 'DmpService'];

function campaignViewCtrl($scope, $filter, $window, $timeout, ngTableParams, CommonService, DmpService){

    // panel show and hide
	$scope.showDsp = false;
	$scope.showSubDsp = true;
	$scope.showTogglePopover = false;
	$scope.chartShow = false;
	$scope.chartReportShow = true;

   // date
	var milliInDay = 86400000;
	var reportMinDate = '2014/01/01';
	var reportStartDateInterval = 60;
	var dateFormat = 'YYYY-MM-DD';
	var dateParseFormat = '%Y-%m-%d';

	// chart
	var chart = null;
	var mapColumnCount = "count";
	var mapUnitId = "category";
	var activity = [];
	var activityPre = [];
	var c3padding = {
		right: 50,
		bottom: 5
	};
	var enableLegend = [];
	var nSite = [];
	var npage = 1;
	var ncount = 30;
	var dateIndex = [];
	var dspLength = null;
	var originCategory = null;

    // model
	$scope.saveDsp = saveDsp;
	$scope.topPanel = { category: '', mediaType: '' };
	$scope.chartType = 'line';
	$scope.markup = true;
	$scope.listNoData = false;
	$scope.endAJAX = false;
	$scope.getDataArray = [];
	$scope.columns = [];
	$scope.markupcolumns = [];
	$scope.selectionSite = [];
	$scope.selectionCampaign = [];
	$scope.category = [];
	$scope.DSP = ["Adwords", "DBM", "Facebook", "YAM", "ClickForce"];
	$scope.media = ["Display", "Video", "Social"];
	$scope.metric = [
		'impression',
		'click',
		'spending',
		'view',
		'cvr',
		'cpm',
		'cpc',
		'cpa',
		'cpv',
		'ctr',
		'vtr'
	];
	$scope.chartPanel = { metricA: $scope.metric[0], metricB: $scope.metric[1] };
	$scope.storedData = [];
	$scope.storedMarkupData = [];
	$scope.sumOfTrans = 0;
	$scope.countOfTrans = 0;
	$scope.selectedCategory = " - All - ";
	$scope.catequery = '';

	// function
	$scope.changeChartType = changeChartType;
	$scope.applyDayRange = applyDayRange;
	$scope.applyCampaignDaily = applyCampaignDaily;
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
				};
                $scope.category.unshift(allCategory)
                $scope.selectedCategory = $scope.category[0].name;
            }
        });
	}

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

	$scope.markupChange = function () {
		generateChart($scope.markup);
	};

	$scope.saveSite = function (name, id) {
		var siteObj = { name: name, id: id };
		var arr = [];
		arr = $filter('filter')($scope.selectionSite, { id: id });

		if ($scope.selectionSite.length > 0) {
			angular.forEach($scope.selectionSite, function (obj, idx) {
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

	$scope.saveCampaign = function (model) {
		model.dsp = [];
		var campaignObj = model;
		var arr = [];

		for (var i = 0, item; item = $scope.selectionCampaign[i]; i++) {
			if (item['campaign'] === model.campaign) {
				arr.push(item);
				break;
			}
		}

		if ($scope.selectionCampaign.length > 0) {
			angular.forEach($scope.selectionCampaign, function (obj, idx) {
				if (obj.campaign == model.campaign) {
					$scope.selectionCampaign.splice(idx, 1);
				} else if (arr.length == 0) {
					$scope.selectionCampaign.push(campaignObj);
					$scope.showDsp = true;
				}
			});
		} else {
			$scope.selectionCampaign.push(campaignObj);
			$scope.showDsp = true;
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
	}

	function isRatio(type) {
		return type.indexOf('CTR') >= 0 || type.indexOf('CVR') >= 0 || type.indexOf('Effectiveness') >= 0 || type.indexOf('VTR') >= 0;
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
    }

    function format(d) {
		if (d > 100000) {
			d = d / 1000000;
			return $filter('number')(d, 2) + ' ' + i18n.t('report.unit.million');
		} else {
			return $filter('number')(d, 0);
		}
	}

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


    function applyDayRange(item) {
		if (!item || !item.mediaType) {
			alert("[" + i18n.t("icem.campaign.mediatype") + "] "
				+ i18n.t("icem.mandatory"));
			return;
		}
		$scope.chartPanel = { metricA: $scope.metric[0], metricB: $scope.metric[1] };
		$scope.selectionCampaign = [];
		$scope.getDataArray = [];
		$scope.columns = [];
        $scope.markupcolumns = [];
        $scope.storedData = [];
        $scope.storedMarkupData = [];
        $scope.chartShow = false;
        $scope.showSubDsp = true;
        $scope.sumOfTrans = 0;
        $scope.countOfTrans = 0;
        $scope.catequery = '';
		refreshCampaignTable(item);
    }


    function applyCampaignDaily() {
		$scope.getDataArray = [];
		$scope.columns = [];
		$scope.markupcolumns = [];
		$scope.storedData = [];
        $scope.storedMarkupData = [];
		$scope.endAJAX = false;
		$scope.sumOfTrans = 0;
		$scope.countOfTrans = 0;
		dateIndex = [];
		if (chart) {
			chart = chart.destroy();
		}

		$scope.sumOfTrans = countTotalTransition();

		for (var i = 0; i < $scope.selectionCampaign.length; i++) {
			if ($scope.selectionCampaign[i].dsp.length == 0) {
				getTransition(i);
			} else {
				for (var j = 0; j < $scope.selectionCampaign[i].dsp.length; j++) {
					getData(i, j);
					getTransition(i, j);
				}
			}
		}
    }

    function countTotalTransition() {
		var count = 0;
		for (var i = 0; i < $scope.selectionCampaign.length; i++) {
			if ($scope.selectionCampaign[i].dsp.length == 0) {
				count++;
			} else {
				for (var j = 0; j < $scope.selectionCampaign[i].dsp.length; j++) {
					count++;
				}
			}
		}
		return count;
    }

    function saveDsp(Campaign, dsp) {
		var hasdsp = Campaign.dsp.indexOf(dsp);
		if (hasdsp > -1) {
			Campaign.dsp.splice(hasdsp, 1);
		} else {
			Campaign.dsp.push(dsp);
		}
    }

    function getData(i, j) {
		var args = {};
		args.sid = $scope.selectionCampaign[i].siteId;
		var cate = '';
		if ($scope.topPanel.category) {
			cate = $scope.topPanel.category;
		}
		args.category = cate;
		args.campaign = $scope.selectionCampaign[i].campaign;
		args.mediaType = $scope.topPanel.mediaType;
		args.dsp = '';
		if ($scope.selectionCampaign[i].dsp.length > 0) {
			args.dsp = $scope.selectionCampaign[i].dsp[j];
		}
		var range = getReportRange();
		args.dateFrom = range.from;
		args.dateTo = range.to;

		var getDataVO = {
			"campaign": args.campaign || '',
			"category": args.category || '',
			"dataFromUTCMSec": args.dateFrom,
			"dataToUTCMSec": args.dateTo,
			"dsp": args.dsp,
			"mediaType": args.mediaType,
			"siteIds": args.sid.toString()
		};

        DmpService.getCampaignReportGetData($scope.cSite.id, getDataVO).then(function (response) {
            var data = response.data;
            if (data.data) {
                var getDataObj = angular.copy(data.data);
                $scope.getDataArray.push(getDataObj);
            }
        });
    }

    function getTransition(i, j) {
		var args = {};
		args.sid = $scope.selectionCampaign[i].siteId;
		var cate = '';
		if ($scope.topPanel.category) {
			cate = $scope.topPanel.category;
		}
		args.category = cate;
		args.campaign = $scope.selectionCampaign[i].campaign;
		args.mediaType = $scope.topPanel.mediaType;
		args.dsp = '';
		if ($scope.selectionCampaign[i].dsp.length > 0) {
			args.dsp = $scope.selectionCampaign[i].dsp[j];
		}
		args.dateFrom = $scope.selectionCampaign[i].startDate;
		args.dateTo = $scope.selectionCampaign[i].endDate;

		var transitionVO = {
			"campaign": args.campaign || '',
			"category": args.category || '',
			"dataFromUTCMSec": args.dateFrom,
			"dataToUTCMSec": args.dateTo,
			"dsp": args.dsp,
			"mediaType": args.mediaType,
			"siteIds": args.sid.toString()
		}


        DmpService.getCampaignReportTransition($scope.cSite.id, transitionVO).then(function (response) {
            var data = response.data;
            $scope.countOfTrans++;
            if (data.data.length > 0) {
                var transitionObj = angular.copy(data.data);
                creatPrefix(i, j, transitionObj, $scope.markup);
                $("html,body").animate({scrollTop: $("#digram-scroll").offset().top-70}, 700);

            } else {
                endAJAXdata();
            }
            $scope.$watch('endAJAX', function (newValue, oldValue) {
                if (newValue == true && oldValue == true) {
                    var copyChartPanel = angular.copy($scope.chartPanel);
                    makeColumns(copyChartPanel);
                    generateChart($scope.markup);
                }
            }, true);
        });
    }

    $scope.changeMetric = function () {
		$scope.columns = [];
		$scope.markupcolumns = [];
		var copyChartPanel = angular.copy($scope.chartPanel);
		makeColumns(copyChartPanel);
		generateChart($scope.markup);
    };

    function cleanArray(actual) {
		var newArray = new Array();
		for (var i = 0; i < actual.length; i++) {
			if (actual[i]) {
				newArray.push(actual[i]);
			}
		}
		return newArray;
    }

    function makeColumns(model) {
		if (model.metricA == 'spending') {
			model.metricA = 'cost';
		}
		if (model.metricB == 'spending') {
			model.metricB = 'cost';
		}

		angular.forEach($scope.storedData, function (obj, idx) {
			if (obj.cpcgoal) {
				var A = obj[model.metricA];
				var B = obj[model.metricB];
				var AA = obj[model.metricA + 'goal'];
				var BB = obj[model.metricB + 'goal'];
				var metricCols = cleanArray([obj.base, A, AA, B, BB]);
			} else {
				var A = obj[model.metricA];
				var B = obj[model.metricB];
				var metricCols = [obj.base, A, B];
			}

			for (var i = 0; i < metricCols.length; i++) {
				$scope.columns.push(metricCols[i]);
			}
		});
		angular.forEach($scope.storedMarkupData, function (obj, idx) {
			if (obj.cpcgoal) {
				var markupA = obj["m" + model.metricA];
				var markupB = obj["m" + model.metricB];
				var markupAA = obj[model.metricA + 'goal'];
				var markupBB = obj[model.metricB + 'goal'];
				var metricMarkupCols = cleanArray([obj.base, markupA, markupAA, markupB, markupBB]);
			} else {
				var markupA = obj["m" + model.metricA];
				var markupB = obj["m" + model.metricB];
				var metricMarkupCols = [obj.base, markupA, markupB];
			}
			for (var i = 0; i < metricMarkupCols.length; i++) {
				$scope.markupcolumns.push(metricMarkupCols[i]);
			}
		});
    }

    function creatPrefix(i, j, transitionObj, markup) {

		if (transitionObj.dsp == '') {
			return;
		}

		var prefixObj = {};
		var prefixMarkupObj = {};
		dspLength = $scope.selectionCampaign[i].dsp.length;

		var label1Prefix = transitionObj[0].campaign;
		if (dspLength > 0) {
			label1Prefix += ' - ' + transitionObj[0].dsp;
			prefixObj.ctrgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.ctr")];
			prefixObj.cpcgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.cpc")];
			prefixObj.cpmgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.cpm")];
			prefixObj.cpvgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.cpv")];
			prefixMarkupObj.ctrgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.ctr")];
			prefixMarkupObj.cpcgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.cpc")];
			prefixMarkupObj.cpmgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.cpm")];
			prefixMarkupObj.cpvgoal = [label1Prefix + ' - ' + i18n.t("report.type.goal.cpv")];
		}

		if (j == undefined) {
			j = $scope.selectionCampaign[i].campaign;
		}
		prefixObj.base = ['date' + i + j];

		prefixObj.impression = [label1Prefix + ' - ' + i18n.t("icem.campaign.impression")];
		prefixObj.click = [label1Prefix + ' - ' + i18n.t("icem.campaign.click")];
		prefixObj.cost = [label1Prefix + ' - ' + i18n.t("icem.campaign.budget")];
		prefixObj.ctr = [label1Prefix + ' - ' + i18n.t("report.type.ctrRatio")];
		prefixObj.cpc = [label1Prefix + ' - ' + i18n.t("report.type.avgcpc")];
		prefixObj.cpa = [label1Prefix + ' - ' + i18n.t("report.type.cpa")];
		prefixObj.cpm = [label1Prefix + ' - ' + i18n.t("report.type.avgcpm")];
		prefixObj.cvr = [label1Prefix + ' - ' + i18n.t("report.type.cvr")];
		prefixObj.cpv = [label1Prefix + ' - ' + i18n.t("report.type.cpv")];
		prefixObj.vtr = [label1Prefix + ' - ' + i18n.t("report.type.vtr")];
		prefixObj.view = [label1Prefix + ' - ' + i18n.t("icem.adwords.views")];

        // for store markup data (prefix are the same)
		prefixMarkupObj.base = ['date' + i + j];
		prefixMarkupObj.mimpression = [label1Prefix + ' - ' + i18n.t("icem.campaign.impression")];
		prefixMarkupObj.mclick = [label1Prefix + ' - ' + i18n.t("icem.campaign.click")];
		prefixMarkupObj.mcost = [label1Prefix + ' - ' + i18n.t("icem.campaign.budget")];
		prefixMarkupObj.mctr = [label1Prefix + ' - ' + i18n.t("report.type.ctrRatio")];
		prefixMarkupObj.mcpc = [label1Prefix + ' - ' + i18n.t("report.type.avgcpc")];
		prefixMarkupObj.mcpa = [label1Prefix + ' - ' + i18n.t("report.type.cpa")];
		prefixMarkupObj.mcpm = [label1Prefix + ' - ' + i18n.t("report.type.avgcpm")];
		prefixMarkupObj.mcpv = [label1Prefix + ' - ' + i18n.t("report.type.cpv")];
		prefixMarkupObj.mcvr = [label1Prefix + ' - ' + i18n.t("report.type.cvr")];
		prefixMarkupObj.mvtr = [label1Prefix + ' - ' + i18n.t("report.type.vtr")];
		prefixMarkupObj.mview = [label1Prefix + ' - ' + i18n.t("icem.adwords.views")];

		pushToColumns(transitionObj, markup, prefixObj, prefixMarkupObj, dspLength);
    }

    function pushToColumns(transitionObj, markup, prefixObj, prefixMarkupObj, dspLength) {

		angular.forEach(transitionObj, function (obj, idx) {
			if (dspLength > 0) {
				prefixObj.ctrgoal.push(obj.ctr_goal ? obj.ctr_goal : 0);
				prefixObj.cpcgoal.push(obj.cpc_goal ? obj.cpc_goal : 0);
				prefixObj.cpmgoal.push(obj.cpm_goal ? obj.cpm_goal : 0);
				prefixObj.cpvgoal.push(obj.cpv_goal ? obj.cpv_goal : 0);
				prefixMarkupObj.ctrgoal.push(obj.ctr_goal ? obj.ctr_goal : 0);
				prefixMarkupObj.cpcgoal.push(obj.cpc_goal ? obj.cpc_goal : 0);
				prefixMarkupObj.cpmgoal.push(obj.cpm_goal ? obj.cpm_goal : 0);
				prefixMarkupObj.cpvgoal.push(obj.cpv_goal ? obj.cpv_goal : 0);
			}
			prefixObj.base.push($filter('date')(obj.date, 'yyyy-MM-dd'));
			prefixObj.impression.push(obj.impression);
			prefixObj.click.push(obj.click);
			prefixObj.cost.push(obj.cost ? obj.cost : 0);
			prefixObj.ctr.push(obj.ctr ? obj.ctr : 0);
			prefixObj.cpc.push(obj.cpc ? obj.cpc : 0);
			prefixObj.cpa.push(obj.cpa ? obj.cpa : 0);
			prefixObj.cpm.push(obj.cpm ? obj.cpm : 0);
			prefixObj.cpv.push(obj.cpv ? obj.cpv : 0);
			prefixObj.cvr.push(obj.cvr ? obj.cvr : 0);
			prefixObj.vtr.push(obj.vtr ? obj.vtr : 0);
			prefixObj.view.push(obj.view ? obj.view : 0);

			prefixMarkupObj.base.push($filter('date')(obj.date, 'yyyy-MM-dd'));
			prefixMarkupObj.mimpression.push(obj.mimpression ? obj.mimpression : 0);
			prefixMarkupObj.mclick.push(obj.mclick ? obj.mclick : 0);
			prefixMarkupObj.mcost.push(obj.mcost ? obj.mcost : 0);
			prefixMarkupObj.mctr.push(obj.mctr ? obj.mctr : 0);
			prefixMarkupObj.mcpc.push(obj.mcpc ? obj.mcpc : 0);
			prefixMarkupObj.mcpa.push(obj.mcpa ? obj.mcpa : 0);
			prefixMarkupObj.mcpm.push(obj.mcpm ? obj.mcpm : 0);
			prefixMarkupObj.mcpv.push(obj.mcpv ? obj.mcpv : 0);
			prefixMarkupObj.mcvr.push(obj.mcvr ? obj.mcvr : 0);
			prefixMarkupObj.mvtr.push(obj.mvtr ? obj.mvtr : 0);
			prefixMarkupObj.mview.push(obj.mview ? obj.mview : 0);
        });

		$scope.storedData.push(prefixObj);
		$scope.storedMarkupData.push(prefixMarkupObj);

		endAJAXdata();
    }

    function endAJAXdata() {
		if ($scope.countOfTrans == $scope.sumOfTrans) {
			$scope.endAJAX = true;
		}
    }

    function getMaxOfArray(arr) {
		$scope.legendMax = {};
		for (var i = 0, item; item = arr[i]; i++) {
			var name = item.shift();
			var maxNN = Math.max.apply(null, item);
			$scope.legendMax[name] = maxNN;
		}
    }

    function generateChart(markup) {
		var cols = $scope.columns;
		if (markup) {
			cols = $scope.markupcolumns;
		}

		$scope.chartShow = true;

		var axesMatch = {};
		var showY2 = true;

		if ($scope.chartPanel.metricA != $scope.chartPanel.metricB) {
			angular.forEach(cols, function (obj, idx) {
				var objLower = obj[0].toLowerCase();
				if (objLower.indexOf($scope.chartPanel.metricA) > -1) {
					axesMatch[obj[0]] = 'y';
				}
				if (objLower.indexOf($scope.chartPanel.metricB) > -1) {
					axesMatch[obj[0]] = 'y2';
				}
			});
			showY2 = true;
		} else {
			// y2 need to be unload here
			angular.forEach(cols, function (obj, idx) {
				var objLower = obj[0].toLowerCase();
				if (objLower.indexOf($scope.chartPanel.metricA) > -1) {
					axesMatch[obj[0]] = 'y';
				}
			});
			showY2 = false;
		};

		$timeout(function () {
			if (cols.length > 0) {
				var xs = {};
				dateIndex = [];
				angular.forEach(cols, function (obj, idx) {
					if (obj[0].substring(0, 4) == 'date') {
						dateIndex.push(idx);
					}
				});

				var colsCopy = angular.copy(cols);
				getMaxOfArray(colsCopy);

				if (dateIndex.length == 1) {
					for (var i = 1; i < cols.length; i++) {
						xs[cols[i][0]] = cols[0][0];
					}
				}

				if (dateIndex.length == 2) {
					for (var i = 1; i < dateIndex[1]; i++) {
						xs[cols[i][0]] = cols[0][0];
					}
					for (var y = dateIndex[1] + 1; y < cols.length; y++) {
						xs[cols[y][0]] = cols[dateIndex[1]][0];
					}
				}

				if (dateIndex.length == 3) {
					for (var i = 1; i < dateIndex[1]; i++) {
						xs[cols[i][0]] = cols[0][0];
					}
					for (var y = dateIndex[1] + 1; y < dateIndex[2]; y++) {
						xs[cols[y][0]] = cols[dateIndex[1]][0];
					}
					for (var y = dateIndex[2] + 1; y < cols.length; y++) {
						xs[cols[y][0]] = cols[dateIndex[2]][0];
					}
				}

				if (dateIndex.length == 4) {
					for (var i = 1; i < dateIndex[1]; i++) {
						xs[cols[i][0]] = cols[0][0];
					}
					for (var y = dateIndex[1] + 1; y < dateIndex[2]; y++) {
						xs[cols[y][0]] = cols[dateIndex[1]][0];
					}
					for (var y = dateIndex[2] + 1; y < dateIndex[3]; y++) {
						xs[cols[y][0]] = cols[dateIndex[2]][0];
					}
					for (var y = dateIndex[3] + 1; y < cols.length; y++) {
						xs[cols[y][0]] = cols[dateIndex[3]][0];
					}
				}

				chart = c3.generate({
					padding: c3padding,
					data: {
						xs: xs,
						xFormat: dateParseFormat, // 'xFormat' can be used as custom format parsing 'x'
						columns: cols,
						type: $scope.chartType,
						axes: axesMatch
					},
					legend: {
						show: true,
						item: {
							onclick: function (id) {

								chart.toggle(id);

								var hiddenArray = $('.c3-legend-item-hidden text').map(function () {
									return $(this).text();
								}).get();

								var allArray = $('.c3-legend-item text').map(function () {
									return $(this).text();
								}).get();

								var enableItem = [];

								angular.forEach(allArray, function (obj, idx) {
									if (hiddenArray.indexOf(obj) == -1) {
										enableItem.push(allArray[idx]);
									};
								});

								var maxArr = [];
								for (var i = 0, item; item = enableItem[i]; i++) {
									maxArr.push($scope.legendMax[item]);
								}
								$scope.maxValueY = Math.max.apply(null, maxArr);

								if (maxArr.length > 0) {
									if ($scope.maxValueY <= 0.1 && $scope.maxValueY != 0) {
										chart.axis.range({
											min: {
												y: 0
											},
											max: {
												y: 0.1
											}
                                        });
									} else {
										chart.axis.range({
											min: {
												y: 0
											},
											max: {
												y: $scope.maxValueY
											}
										});
									}
								}
								$timeout(function () {
									chart.flush();
								}, 500);

							}
						}
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
									return chartTickFormat(d);
								},
							}
						},
						y2: {
							tick: {
								format: function (d) {
									return chartTickFormat(d);
								},
							},
							show: showY2
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
								var format = isRatio(id) ? d3.format('.2%') : d3.format(',');
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

    function chartTickFormat(d) {
		if (d > 9999 || d < -999) {
			var formatA = d3.format(",");
            return formatA(d);
		} else if (d < 1 && d > -1) {
			var formatB = d3.format(".2f");
			return formatB(d);
		} else {
			var formatC = d3.format(".2f");
			return formatC(d * 100) / 100;
		}
    }

    function refreshCampaignTable(item) {
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
						var args = {};
						if ($scope.selectionSite[0]) {
							args.sids = [$scope.selectionSite[0].id];
						} else {
							args.sids = $scope.siteList[0].id;
							for (var i = 1; i < $scope.siteList.length; i++) {
								args.sids += "," + $scope.siteList[i].id;
							}
						}
						if ($scope.selectionSite.length > 1) {
							args.sids += ',' + $scope.selectionSite[1].id;
						}
						var cate = '';
						if (item.category) {
							cate = $scope.topPanel.category;
						}
						args.category = cate;
						args.mediaType = item.mediaType;
						args.page = npage;
						args.count = ncount;
						var range = getReportRange();
						args.dateFrom = range.from;
						args.dateTo = range.to;

						var reportVO = {
							// "campaign": null,
							"category": args.category,
							"dataFromUTCMSec": args.dateFrom,
							"dataToUTCMSec": args.dateTo,
							// "dsp": null,
							"mediaType": args.mediaType,
							"siteIds": args.sids.toString(),
                            "page": params.page(),
							"pageSize": params.count()
						};

						DmpService.getCampaignReportList($scope.cSite.id, reportVO).then(function (response) {
							var data = response.data;
							params.total(data.data.totalElements);
							if (data.data.campaignreportvos.length == 0) {
								$scope.listNoData = true;
							} else {
								$scope.listNoData = false;
								angular.forEach(data.data.campaignreportvos, function (obj, idx) {
									var siteName = $filter('filter')($scope.siteList, { id: obj.siteId })[0];
									obj.siteName = siteName.name;
								});
							}
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

    $scope.initReport = function () {
		initDatePicker();
		loadCategory();
		$timeout(function () {
			$scope.showTogglePopover = false;
			if (chart) {
				chart.flush();
			}
        }, 1500);
    };

};
