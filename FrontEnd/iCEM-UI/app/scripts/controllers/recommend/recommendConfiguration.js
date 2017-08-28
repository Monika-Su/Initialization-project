'use strict';

app.controller('recommendConfCtrl', recommendConfCtrl);

recommendConfCtrl.$inject = ['$scope', '$window', '$q','$upload', '$timeout', 'ngTableParams', 'CommonService', 'RecommendSetService', 'ValidateService', 'RecommendService', 'MemberService', 'ItemGroupService'];

function recommendConfCtrl($scope, $window, $q, $upload, $timeout, ngTableParams, CommonService, RecommendSetService, ValidateService, RecommendService, MemberService, ItemGroupService){

    // Loading animation
	$scope.isLoading = true;
	$scope.isLoadingSetItemList = true;

    // panel show and hide
	$scope.isShowRecommendSet = false;
	$scope.isShowRecommendSetItemList = false;
	$scope.isShowRecommendSetItemObj = false;

    // data from API
	$scope.tempRecommendSetList = null;
	$scope.itemGroupList = null;

    // container object
	$scope.newRecommendSet = null;
	$scope.newRecommendSetItem = null;
	$scope.recommendSetItemList = [];
	$scope.recommendContentList = null;
	$scope.currentSet = null;

	// schedule
	$scope.scheduleContainer = {};
	$scope.attributeContainer = [];

	// for init and search object
	$scope.ruleTab = 'visit';
	var vo = {
		"name": null,
		"status": null
	};
    var itemVO = {
        "displayType": null,
        "name": null
    };
	var initScheduleObj = {
		"startDate": null,
		"endDate": null,
		"fromHour": null,
		"toHour": null,
		// "month": [],
		// "week": [],
		// "day": []
				};

	$scope.initRecommentSetItemObj = {
		"id": null,
		"memberAttrs": [
		],
		"memo": "",
		"name": "",
		"recommendContentId": null,
		"recommendationId": null,
		"itemGroupId": null,
		"status": "DRAFT",
		"visit": {
			"clickNum": null,
			"clickOperator": null,
			"impressionNum": null,
			"impressionOperator": null,
			"recencyNum": null,
			"recencyOperator": null
		},
		"dateAttr": {
			"day": [],
			"endDate": null,
			"fromHour": null,
			"month": [],
			"startDate": null,
			"toHour": null,
			"week": []
		},
	};

	$scope.initRecommentSetObj = {
		"displayNum": null,
		"id": null,
		"isLimit": false,
		"name": "",
		"memo": "",
		"status": "DRAFT",
		"updatedAt": "",
		"type": 'RULE_BASE',
		"channel": "WEB"
	};

	// Options
	$scope.numericOperator = [
		"EQUAL",
		"NOT_EQUAL",
		"GREATER_OR_EQUAL",
		"GREATER_THAN",
		"LESS_OR_EQUAL",
		"LESS_THAN"
    ];

	$scope.optionOperator = [
		"EQUAL",
		"NOT_EQUAL",
	];

	$scope.recommendType = [
		{ name: 'RULE_BASE' },
		{ name: 'ITEM_AUTO' },
		{ name: 'USER_AUTO' },
		{ name: 'RANKING' },
		{ name: 'REMINDER' },
		{ name: 'BUY_AFTER_VIEWING' },
		{ name: 'HISTORY_ORIENTED_AUTO' }
	];

	$scope.behaviorTypeList = [
		{ name: 'BROWSING' },
		{ name: 'CONVERSION' }
	];

	$scope.channelList = [
		{ name: 'WEB' }
	];
	// { name: 'EMAIL' },
	// { name: 'SMS' }

	initTable(vo);
	loadRecommendContentList(vo);

	$scope.openRecommendPanel = function (panel, flag, model) {
		switch (panel) {
			case 0:
				// Recommend Set Panel
				if (flag) {
					if (!model.id) {
						// add new one
						$scope.newRecommendSet = angular.copy(model);
					} else {
						// edit the existed one
						loadRecommendSet(model);
					}
					$("html,body").animate({ scrollTop: 0 }, 700);
					// close 1 & 2 panel
					$scope.openRecommendPanel(1, false);
				} else {
					// close the panel
					$scope.newRecommendSet = null;
				}
				$scope.isShowRecommendSet = flag;
				break;
			case 1:
				// Recommend Set - Item List Panel
				if (flag) {
					$scope.currentSet = {
						setId: model.id,
						setName: model.name
					};
					$("html,body").animate({ scrollTop: 0 }, 700);
					showRecommendSetItemList(model);
					// close 0 & 2 panel
					$scope.openRecommendPanel(0, false);
					$scope.openRecommendPanel(2, false);
				}
				$scope.isShowRecommendSetItemList = flag;
				$scope.isShowRecommendSet = false;
				break;
			case 2:
				// Item Detail block
				if (flag) {
					mappingRecommendSetItem(model);
					$scope.scheduleContainer = angular.copy(model.dateAttr || initScheduleObj);
					$scope.attributeContainer = angular.copy(model.memberAttrs || []);
					// loadMemberAttribute();
					loadItemGroup(itemVO);
				} else {
					// close the panel
					$scope.newRecommendSetItem = null;
				}
				$scope.isShowRecommendSetItemObj = flag;
				$scope.isShowRecommendSet = false;
				break;
			default:
				console.log('switch error');
		}
	};

	function loadRecommendSet(model) {
		var loadSingleRecommendSetApi = null;
		switch (model.type) {
			case 'RULE_BASE':
				loadSingleRecommendSetApi = "getRecommendSetRuleBase";
				break;
			case 'ITEM_AUTO':
				loadSingleRecommendSetApi = "getRecommendSetItemAuto";
				break;
			case 'USER_AUTO':
				loadSingleRecommendSetApi = "getRecommendSetUserAuto";
				break;
			case 'RANKING':
				loadSingleRecommendSetApi = "getRecommendSetRanking";
				break;
			case 'REMINDER':
				loadSingleRecommendSetApi = "getRecommendSetReminder";
				break;
			case 'BUY_AFTER_VIEWING':
				loadSingleRecommendSetApi = "getRecommendSetBuyAfterView";
				break;
			case 'HISTORY_ORIENTED_AUTO':
				loadSingleRecommendSetApi = "getRecommendSetHistory";
				break;
			default:
				console.log('switch default');
		}
		RecommendSetService[loadSingleRecommendSetApi]($scope.cSite.id, model.id).then(function (response) {
			var data = response.data.data;
			$scope.newRecommendSet = angular.copy(data);
		});
	}

	$scope.changeRecommendType = function (model) {
		switch (model.type) {
			case 'RULE_BASE':
				delete model.recommendContentId;
				delete model.behaviorType;
				break;
			case 'ITEM_AUTO':
				model.recommendContentId = $scope.recommendContentList[0].id;
				model.behaviorType = $scope.behaviorTypeList[0].name;
				break;

			case 'USER_AUTO':
				model.recommendContentId = $scope.recommendContentList[0].id;
				model.behaviorType = $scope.behaviorTypeList[0].name;
				break;
			case 'RANKING':
				model.recommendContentId = $scope.recommendContentList[0].id;
				model.behaviorType = $scope.behaviorTypeList[0].name;
				break;
			case 'REMINDER':
				model.recommendContentId = $scope.recommendContentList[0].id;
				delete model.behaviorType;
				break;
			case 'BUY_AFTER_VIEWING':
				model.recommendContentId = $scope.recommendContentList[0].id;
				delete model.behaviorType;
				break;
			case 'HISTORY_ORIENTED_AUTO':
				model.recommendContentId = $scope.recommendContentList[0].id;
				model.behaviorType = $scope.behaviorTypeList[0].name;
				break;
			default:
		}
	};

    function loadItemGroup(model) {
		ItemGroupService.saveItemGroupList($scope.cSite.id, 100, 0, model).then(function (response) {
			var data = response.data.data.content;
			$scope.itemGroupList = angular.copy(data);
			$scope.itemGroupList.unshift({itemGroupId:null, name:''});
			// not checking list length for now
			// if ($scope.itemGroupList.length === 0) {
			// 	alert(i18n.t("icem.recommendSet.no.recommendItemGroup"));
			// }
		});
	}

	function showRecommendSetItemList(model) {

		var getApiType = null;
		$scope.recommendItemListTableParams = new ngTableParams({
			page: 1,
			count: 10
		}, {
				total: 0,
				counts: [],
				getData: function ($defer, params) {

					RecommendSetService.getRecommendSetItem($scope.cSite.id, model.id).then(function (response) {
						// RecommendSetService[getApiType]($scope.cSite.id, model.id).then(function (response) {
						var data = response.data.data;
						$scope.isLoadingSetItemList = false;
						params.total(response.data.data.totalElements);

						if (params.page() > 1 && (!data || data.length == 0)) {
							params.page(params.page() - 1);
						} else {
							$scope.recommendSetItemList = angular.copy(data);
							$scope.isLoadingSetItemList = false;
							$defer.resolve(data);
						}
					});
				}
			});
	}

	$scope.selectRuleTab = function (tab) {
        $scope.ruleTab = tab;
    };

	// function showRecommendItem(model, choosedItem) {
	// 	loadRecommendContentList(model, choosedItem);
	// 	loadMemberAttribute();
	// if (!$scope.cSite) return;
	// RecommendService.saveRecommendList($scope.cSite.id, model, 100, 0).then(function (response) {
	// 	var data = response.data.data.content;
	// 	$scope.recommendContentList = angular.copy(data);
	// 	// set the initial recommendContentId
	// 	if ($scope.recommendContentList.length > 0) {
	// 		if (!choosedItem.id) {
	// 			// add new Item
	// 			$scope.newRecommendSetItem = angular.copy($scope.initRecommentSetItemObj);
	// 			$scope.newRecommendSetItem.recommendContentId = $scope.recommendContentList[0].newRecommendSetItem;
	// 		} else {
	// 			// edit existed Item
	// 			$scope.newRecommendSetItem = angular.copy(choosedItem);
	// 			if ($scope.newRecommendSetItem.memberAttrs === null) {
	// 				$scope.newRecommendSetItem.memberAttrs = [];
	// 			}
	// 		}
	// 		$scope.newRecommendSetItem.recommendationId = $scope.currentSet.setId;
	// 	} else {
	// 		alert(i18n.t("icem.recommendSet.no.recommendContent"));
	// 	}
	// });
	// MemberService.getMemberAttribute($scope.cSite.id).then(function (response) {
	// 	var data = response.data.data.content;
	// 	$scope.attributeList = angular.copy(data);

	// });
	// };

	function loadRecommendContentList(model) {
		if (!$scope.cSite) return;
		if ($scope.recommendContentList !== null) {
			return;
		}
		RecommendService.saveRecommendList($scope.cSite.id, model, 100, 0).then(function (response) {
			var data = response.data.data.content;
			if (data.length === 0) {
				alert(i18n.t("icem.recommendSet.no.recommendContent"));
			}
			$scope.recommendContentList = angular.copy(data);
		});
	}

	function mappingRecommendSetItem(choosedItem) {

		// set the initial recommendContentId
		if ($scope.recommendContentList.length > 0) {
			if (!choosedItem.id) {
				// add new Item
				$scope.newRecommendSetItem = angular.copy($scope.initRecommentSetItemObj);
				$scope.newRecommendSetItem.recommendContentId = $scope.recommendContentList[0].id;
			} else {
				// edit existed Item
				$scope.newRecommendSetItem = angular.copy(choosedItem);
				// if ($scope.newRecommendSetItem.memberAttrs === null) {
				// 	$scope.newRecommendSetItem.memberAttrs = [];
				// }
			}
			$scope.newRecommendSetItem.recommendationId = $scope.currentSet.setId;
		} else {
			alert(i18n.t("icem.recommendSet.no.recommendContent"));
		}

	}

	$scope.saveRecommendSet = function (model) {
		var deferred = $q.defer();
		if (ValidateService.isEmptyInput(["icem.recommendSet.name"], [model.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
		} else if (checkDuplicateName($scope.tempRecommendSetList, model)) {
			alert("[" + i18n.t("icem.recommendSet.name") + "] "
				+ i18n.t("icem.duplicate"));
			deferred.reject("Fail");
			return deferred.promise;
		} else if (model.isLimit && !model.displayNum) {
			alert("[" + i18n.t("icem.recommendSet.displayNum") + "] "
				+ i18n.t("icem.mandatory"));
			deferred.reject("Fail");
			return deferred.promise;
		}
		if (!model.isLimit) {
			model.displayNum = null;
		}
		var apiType = null;
		switch (model.type) {
			case 'RULE_BASE':
				apiType = "saveRecommendSetRuleBase";
				break;
			case 'ITEM_AUTO':
				apiType = "saveRecommendSetItemAuto";
				break;
			case 'USER_AUTO':
				apiType = "saveRecommendSetUserAuto";
				break;
			case 'RANKING':
				apiType = "saveRecommendSetRanking";
				break;
			case 'REMINDER':
				apiType = "saveRecommendSetReminder";
				break;
			case 'BUY_AFTER_VIEWING':
				apiType = "saveRecommendSetBuyAfterView";
				break;
			case 'HISTORY_ORIENTED_AUTO':
				apiType = "saveRecommendSetHistory";
				break;
			default:
				console.log('switch empty');
		}

		RecommendSetService[apiType]($scope.cSite.id, model).then(function () {
			$scope.openRecommendPanel(0, false);
			$scope.isLoading = false;
			$scope.recommendSetListTableParams.reload();
			deferred.resolve("Success");
		});
		return deferred.promise;
	};


	$scope.saveRecommendItem = function (model) {
		var deferred = $q.defer();
		// convert to number
		model.recommendContentId = +model.recommendContentId;
		model.dateAttr = angular.copy($scope.scheduleContainer);
		model.memberAttrs = angular.copy($scope.attributeContainer);
		if (ValidateService.isEmptyInput(["icem.recommendSet.name"], [model.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
		} else if (checkDuplicateName($scope.recommendSetItemList, model)) {
			alert("[" + i18n.t("icem.recommendSet.name") + "] "
				+ i18n.t("icem.duplicate"));
			deferred.reject("Fail");
			return deferred.promise;
		} else if (!model.recommendContentId) {
			alert("[" + i18n.t("icem.rule.content") + "] "
				+ i18n.t("icem.mandatory"));
			deferred.reject("Fail");
			return deferred.promise;
		} else if (ValidateService.isEmptyDateAttr(model)) {
            deferred.reject("Fail - isEmptyDateAttr");
            return deferred.promise;
		}
		// not neceserry for now
		// else if (!model.itemGroupId) {
		// 	alert("[" + i18n.t("icem.menu.recommendItem") + "] "
		// 		+ i18n.t("icem.mandatory"));
		// 	return;
		// }
		var visitObj = checkVisit(model.visit);
		if (visitObj.notFill) {
			alert("[" + i18n.t(visitObj.str) + "] "
				+ i18n.t("icem.mandatory"));
			deferred.reject("Fail");
			return deferred.promise;
		}
		// if (model.memberAttrs !== null) {
		// 	for (var i = 0, item; item = model.memberAttrs[i]; i++) {
		// 		delete item.$$hashKey;
		// 	}
		// }
		RecommendSetService.saveRecommendSetItem($scope.cSite.id, model).then(function (response) {
			var data = response.data.data;
			$scope.openRecommendPanel(2, false);
			$scope.isLoadingSetItemList = false;
			$("html,body").animate({ scrollTop: 0 }, 700);
			deferred.resolve("Success : saveRecommendSetItem");
			$scope.recommendItemListTableParams.reload();
		});
		return deferred.promise;
	};

	function checkVisit(model) {
		for (var prop in model) {
			if (model[prop] === '') {
				model[prop] = null;
			}
		}

		if (model.clickNum && model.clickOperator === null) {
			return { notFill: true, str: 'icem.recommend.rule.pvCount' };
		} else if (model.impressionNum && model.impressionOperator === null) {
			return { notFill: true, str: 'icem.recommend.rule.visitCount' };
		} else if (model.recencyNum && model.recencyOperator === null) {
			return { notFill: true, str: 'icem.recommend.rule.visitInterval' };
		} else if (model.clickOperator !== null && model.clickNum === null) {
			return { notFill: true, str: 'icem.recommend.rule.pvCount' };
		} else if (model.impressionOperator !== null && model.impressionNum === null) {
			return { notFill: true, str: 'icem.recommend.rule.visitCount' };
		} else if (model.recencyOperator !== null && model.recencyNum === null) {
			return { notFill: true, str: 'icem.recommend.rule.visitInterval' };
		}
        return { notFill: false };
	}

	function checkDuplicateName(list, model) {
		var isFindFlag = false;
		angular.forEach(list, function (m) {
			if(!isFindFlag){
				if (m.name == model.name && m.id != model.id) {
					isFindFlag = true;
				}
			}
		});
		return isFindFlag;
	}

	$scope.removeRecommend = function (method, table, id) {
		var deleteObj = {
            serviceApi: "RecommendSetService",
            deleteApi: method,
            siteId: $scope.cSite.id,
            id: id
        };
		CommonService.deleteItem(deleteObj).then(function () {
            $scope[table].reload();
			if (method == "removeRecommendSetItem") {
				$scope.openRecommendPanel(2, false);
			} else {
				$scope.openRecommendPanel(0, false);
				$scope.openRecommendPanel(1, false);
			}
        });
	};

	function initTable(model) {
		$scope.recommendSetListTableParams = new ngTableParams({
			page: 1,
			count: 10
		}, {
				total: 0,
				getData: function ($defer, params) {

					RecommendSetService.saveRecommendSetList($scope.cSite.id, model, params.count(), params.page() - 1).then(function (response) {
						var data = response.data.data.content;
						$scope.isLoading = false;
						params.total(response.data.data.totalElements);

						if (params.page() > 1 && (!data || data.length == 0)) {
							params.page(params.page() - 1);
						} else {
							$scope.tempRecommendSetList = angular.copy(data);
							$defer.resolve(data);
						}
					});

				}
			});
	}
};
