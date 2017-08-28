'use strict';

app.controller('tagsCtrl', tagsCtrl);

tagsCtrl.$inject = ['$scope', '$window', '$q', '$timeout', 'ngTableParams', 'CommonService', 'RecommendService', 'TagService', 'RecommendSetService', 'ValidateService'];

function tagsCtrl($scope, $window, $q, $timeout, ngTableParams, CommonService, RecommendService, TagService, RecommendSetService, ValidateService){
    // Loading animation
	$scope.isLoading = true;

    // panel show and hide
	$scope.isShowTagExternal = false;
	$scope.isShowTrigger = false;
	$scope.isShowTriggerItem = false;
	$scope.rightPanel = false;
	$scope.saveAlert = false;


    // data from API
	$scope.tempAllTag = null;
	$scope.recommendSetList = [];

    // container object
	$scope.tempTagList = {};
	$scope.snippet = null;
	$scope.tagItem = null;
	$scope.isModified = false;
	$scope.backupAllTag = null;
	$scope.tagExternalItem = {};
	$scope.externalList = [];
	$scope.currentTagExternal = { id: '', name: '' };



	// Pixel
	$scope.tagPixelItem = {};
	$scope.pixelList = [];
	$scope.currentTagPixel = { id: '', name: '' };

	// init object for external
	$scope.initExternalVO = {
		"id": null,
		"name": "",
		"memo": "",
		"codeSnippet": "",
		"status": "OFF",
		"tagManagerId": null, // need to be filled
		"triggerVOList": [],
		"type": "GOOGLE_ANALYTICS" // default value
	};

	$scope.initExternalTriggerItem = {
		"id": null,
		"tagExternalId": null, // need to be filled
		"tagPixelId": null, // keep null
		"type": "PAGE_VIEW",
		"triggerDomList": [],
		"urlPatternList": []
    };

	$scope.initPixelTriggerItem = {
		"id": null,
		"tagExternalId": null, // keep null
		"tagPixelId": null, // need to be filled
		"type": "PAGE_VIEW_PIXEL_TRACK", // default value
		"triggerDomList": [],
		"urlPatternList": []
	};

	// init object for pixel
	$scope.initPixelVO = {
		"htmlConversion": "",
		"htmlTracking": "",
		"id": null,
		"label": "",
		"memo": "",
		"name": "",
		"pixelid": null,
		"status": "OFF",
		"tagManagerId": null, // need to be filled
		"triggerVOList": []
	};

	var pairObj = {
		pairKey: '',
		pairValue: ''
	};

	$scope.cookiePair = [
		{ name: 'MEMBER_ID' },
		{ name: 'GOOGLE_ID' }
	];

	$scope.externalTypeList = [
		{ name: 'GOOGLE_ANALYTICS' },
		{ name: 'FACEBOOK' },
		{ name: 'OTHER' }
	];

	$scope.externalTriggerList = [
		{ name: 'PAGE_VIEW' },
		{ name: 'CLICK' }
	];

	$scope.pixelTriggerList = [
		{ name: 'PAGE_VIEW_PIXEL_TRACK' },
		{ name: 'PAGE_VIEW_PIXEL_CONVERT' }
	];

	$scope.ApiObj = {
		setApi: '',
		deleteApi: '',
		loadBySiteId: '',
		mainVO: '',
		list: ''
	};


	loadTagManager();

	function loadTagManager() {
		if (!$scope.cSite) return;
		TagService.getTagManager($scope.cSite.id).then(function (response) {
			var data = response.data.data;

			$scope.tempAllTag = angular.copy(data);
			$scope.backupAllTag = angular.copy(data);

			// must call loadCodeSnippet after getTagManager call
			loadSnippet();
			syncAlltag();
			$scope.isLoading = false;
		});
	}

	function syncAlltag() {
		for (var prop in $scope.tempAllTag) {
			if (prop.indexOf("VO") > -1) {
				$scope.tempTagList[prop] = $scope.tempAllTag[prop];
				$scope.tempTagList[prop]['tagType'] = prop;
			}
		}
		$scope.pixelList = $scope.tempAllTag.tagPixelVOList;
		$scope.externalList = $scope.tempAllTag.tagExternalVOList;
	}

	function loadSnippet() {
		TagService.getSnippetCode($scope.cSite.id).then(function (response) {
			var data = response.data.data;
			$scope.snippet = angular.copy(data);
		});
	}

	function saveTagManager(model) {
		var sendObj = angular.copy(model);
		for (var prop in sendObj) {
			if (sendObj[prop].hasOwnProperty('tagType')) {
				delete sendObj[prop].tagType;
			}
		}
		if (!$scope.cSite) return;
		TagService.setTagManager($scope.cSite.id, sendObj).then(function () {
			loadTagManager();
			showSaveAlert();
		});
	}

	function showSaveAlert() {
		$scope.saveAlert = true;
		$timeout(function () {
			$scope.saveAlert = false;
		}, 2000);
	}

	$scope.openRightPanel = function (model) {
		$scope.rightPanel = true;
		$scope.tagItem = $scope.tempTagList[model.tagType];

		switch (model.tagType) {
			case "tagTrackVO":
				mappingPairObj();
				$scope.tagItem.urlFetchMap.hasOwnProperty('URL_PARAM') || ($scope.tagItem.urlFetchMap.URL_PARAM = []);
				$scope.tagItem.urlFetchMap.hasOwnProperty('URL_LAST_PATH') || ($scope.tagItem.urlFetchMap.URL_LAST_PATH = "OFF");
				$scope.ApiObj = {
					setApi: 'setTagTrack'
				};
				break;

			case "tagRecommendVO":
				if ($scope.recommendSetList.length === 0) {
					var vo = {
						"name": null,
						"status": null
					};
					loadRecommendSetList(vo);
				}
				mappingPairObj();
				$scope.ApiObj = {
					setApi: 'setTagRecommend'
				};
				break;

			case "tagClickVO":
				mappingPairObj();
				$scope.ApiObj = {
					setApi: 'setTagClick'
				};
				// console.log('$scope.tagItem : ', $scope.tagItem);
				break;

			case "tagExternalVOList":
				delete $scope.tagItemPairList;
				$scope.isOpenTagExternal(false);

				$scope.ApiObj.setApi = 'setTagExternal';
				$scope.ApiObj.deleteApi = 'removeTagExternal';
				$scope.ApiObj.loadBySiteId = 'getTagExternalBySiteId';
				$scope.ApiObj.mainVO = 'tagExternalVOList';
				$scope.ApiObj.list = 'externalList';
				// console.log('$scope.tagItem : ', $scope.tagItem);
				break;

			case "tagPixelVOList":
				delete $scope.tagItemPairList;
				$scope.isOpenTagExternal(false);

				$scope.ApiObj.setApi = 'setTagPixel';
				$scope.ApiObj.deleteApi = 'removeTagPixel';
				$scope.ApiObj.loadBySiteId = 'getTagPixelBySiteId';
				$scope.ApiObj.mainVO = 'tagPixelVOList';
				$scope.ApiObj.list = 'pixelList';
				// console.log('$scope.tagItem : ', $scope.tagItem);
				break;

			default:
				delete $scope.tagItemPairList;
				$scope.rightPanel = false;
				$scope.tagItem = null;
		}
	};

	function mappingPairObj() {
		for (var prop in $scope.tagItem) {
			if (prop.indexOf('Pair') > -1) {
				$scope.tagItemPairList = [];
				for (var item in $scope.tagItem[prop]) {
					pairObj = {
						pairKey: item,
						pairValue: $scope.tagItem[prop][item]
					};
					$scope.tagItemPairList.push(pairObj);
				}
				break;
			} else {
				delete $scope.tagItemPairList;
			}
		}
	}

	$scope.convertPair = function () {
		for (var prop in $scope.tagItem) {
			if (prop.indexOf('Pair') > -1) {
				$scope.tagItem[prop] = {};
				for (var i = 0, item; item = $scope.tagItemPairList[i]; i++) {
					$scope.tagItem[prop][item.pairKey] = angular.copy(item.pairValue.toString());
				}
				break;
			}
		}
	};

	$scope.deletePair = function (idx) {
		$scope.tagItemPairList.splice(idx, 1);
		$scope.convertPair();
	};

	$scope.addPair = function (tagType) {
		switch (tagType) {
			case "tagTrackVO":
				pairObj = {
					pairKey: '',
					pairValue: $scope.cookiePair[0].name,
				};
				break;
			case "tagClickVO":
				pairObj = {
					pairKey: '',
					pairValue: '',
				};
				break;
			case "tagRecommendVO":
				if ($scope.recommendSetList.length === 0) {
					alert(i18n.t("icem.recommendSet.no.Recommendation"));
					return;
				}
				pairObj = {
					pairKey: '',
					pairValue: $scope.recommendSetList[0].id,
				};
				break;
			default:
				console.log('switch default');
		}
		$scope.tagItemPairList.push(pairObj);
	};



	$scope.saveExternalTrigger = function (model, flag) {

		if (hasEmptyField($scope.tagItem.tagType, $scope.tempAllTag, model)) return;

		model.tagExternalId = $scope.currentTagExternal.id;
		if (!model.id) {
			// add
			$scope.tagExternalItem.triggerVOList.push(model);
		} else {
			//edit
			for (var i = 0, item; item = $scope.tagExternalItem.triggerVOList[i]; i++) {
				if (item.id === model.id) {
					$scope.tagExternalItem.triggerVOList[i] = model;
					break;
				}
			}

		}
		$scope.isShowTriggerItem = false;
		$scope.isShowTrigger = true;
		$scope.saveExternal($scope.tagExternalItem, true);
	};

	$scope.cancelExternalTrigger = function (model) {
		$scope.isShowTriggerItem = false;
		$scope.isShowTrigger = true;
	};

	$scope.saveExternal = function (model, flag, str) {
		if (!model.tagManagerId) {
			model.tagManagerId = $scope.tempAllTag.id;
		}
		switch (str) {
			case 'setTagExternal':
				if (ValidateService.isEmptyInput(["icem.name", "icem.tag.codeSnippet"], [model.name, model.codeSnippet])) return;
				break;
			case 'setTagPixel':
				if (ValidateService.isEmptyInput(["icem.name"], [model.name])) return;
				break;
			default:
				console.log('default saveExternal');
		}
		if (!flag) {
			// close the panel
			$scope.isOpenTagExternal(false);
		}
		saveTagExternalApi(model, flag, $scope.ApiObj);
	};

	function saveTagExternalApi(model, flag, ApiObj) {
		if (!$scope.cSite) return;
		TagService[ApiObj.setApi]($scope.cSite.id, model).then(function () {
			showSaveAlert();
			loadTagExternalBySiteId(ApiObj);
			if (!flag) {
				// don't clean up current TagExternal
				mapCurrentTag(false);
			}
		});
	}

	function loadTagExternalBySiteId(ApiObj) {
		if (!$scope.cSite) return;
		TagService[ApiObj.loadBySiteId]($scope.cSite.id).then(function (response) {
			var data = response.data.data;
			$scope[ApiObj.list] = angular.copy(data);
			// $scope.tempAllTag.tagExternalVOList = $scope.externalList;
			$scope.tempAllTag[ApiObj.mainVO] = $scope[ApiObj.list];
			syncTagExternalItem(ApiObj);
		});
	}

	function syncTagExternalItem(ApiObj) {
		for (var i = 0, item; item = $scope.tempAllTag[ApiObj.mainVO][i]; i++) {
			if ($scope.currentTagExternal.id === item.id) {
				$scope.tagExternalItem = item;
			}
		}
	}

	$scope.deleteTagExternal = function (idx) {
		var deleteItem = $window.confirm(i18n.t('icem.delete.confirm') + " " + i18n.t('icem.items.deleteWarning'));
		if (deleteItem) {
			$scope[$scope.ApiObj.list].splice(idx, 1);
			$scope.saveAllTag($scope.tempAllTag);
			$scope.isOpenTrigger(false);
		}
	};

	$scope.isOpenTagExternal = function (flag, model) {
		if (flag) {
			// open panel
			$scope.tagExternalItem = angular.copy(model);
			mapCurrentTag(true, model);

		} else {
			// close panel
			$scope.tagExternalItem = null;
			mapCurrentTag(false);
		}
		$scope.isShowTagExternal = flag;
		$scope.isShowTrigger = false;
		$scope.isShowTriggerItem = false;
	};

	$scope.isOpenTrigger = function (flag, model) {
		if (flag) {
			// open trigger panel
			mapCurrentTag(true, model);
			$scope.tagExternalItem = angular.copy(model);
		} else {
			mapCurrentTag(false);
		}
		$scope.isShowTagExternal = false;
		$scope.isShowTriggerItem = false;
		$scope.isShowTrigger = flag;
	};

	$scope.addNewTrigger = function (flag, type, model) {
		$scope.isShowTriggerItem = true;
		if (flag) {
			switch (type) {
				// 1.external 2.pixel
				case 1:
					$scope.triggerItem = angular.copy($scope.initExternalTriggerItem);
					$scope.triggerItem.tagExternalId = $scope.currentTagExternal.id;
					$scope.triggerItem.tagPixelId = null;
					break;
				case 2:
					$scope.triggerItem = angular.copy($scope.initPixelTriggerItem);
					$scope.triggerItem.tagExternalId = null;
					$scope.triggerItem.tagPixelId = $scope.currentTagExternal.id;
					break;
				default:
					console.log('switch default');
			}
		} else {
			$scope.triggerItem = angular.copy(model);
		}

		if ($scope.triggerItem.type == "") {
			$scope.triggerItem.type = "PAGE_VIEW";
		}
	};

	function mapCurrentTag(flag, model) {
		if (flag) {
			$scope.currentTagExternal.id = model.id;
			$scope.currentTagExternal.name = model.name;
		} else {
			$scope.currentTagExternal = { id: '', name: '' };
		}
	}

	$scope.addTriggerItem = function (model) {
		var str = '';
		switch (model) {
			case "PAGE_VIEW":
			case "PAGE_VIEW_PIXEL_TRACK":
			case "PAGE_VIEW_PIXEL_CONVERT":
				$scope.triggerItem.triggerDomList = [];
				$scope.triggerItem.urlPatternList.push(str);
				break;
			case "CLICK":
				$scope.triggerItem.triggerDomList.push(str);
				$scope.triggerItem.urlPatternList = [];
				break;
			default:
				console.log('switch default');
		}
	};

	$scope.deleteTriggerItem = function (idx) {
		var deleteItem = $window.confirm(i18n.t('icem.delete.confirm') + " " + i18n.t('icem.items.deleteWarning'));
		if (deleteItem) {
			$scope.tagExternalItem.triggerVOList.splice(idx, 1);
			$scope.saveExternal($scope.tagExternalItem, true);
		}
	};

	$scope.deleteTriggerItemUnit = function (idx, model) {
		switch (model) {
			case "PAGE_VIEW":
			case "PAGE_VIEW_PIXEL_TRACK":
			case "PAGE_VIEW_PIXEL_CONVERT":
				$scope.triggerItem.triggerDomList = [];
				$scope.triggerItem.urlPatternList.splice(idx, 1);
				break;
			case "CLICK":
				$scope.triggerItem.triggerDomList.splice(idx, 1);
				$scope.triggerItem.urlPatternList = [];
				break;
			default:
				console.log('switch default');
		}
	};

	$scope.saveAllTag = function (model) {
		model['tagExternalVOList'] = angular.copy($scope.externalList);
		model['tagPixelVOList'] = angular.copy($scope.pixelList);
		saveTagManager(model);
		if ($scope.backupAllTag.retUrlPrefix !== model.retUrlPrefix) {
			loadSnippet();
		}
	};

	$scope.saveCurrentTag = function (tagType, tempAllTag) {
		var deferred = $q.defer();

		switch (tagType) {
			case "tagTrackVO":
				if (hasEmptyField(tagType, tempAllTag, $scope.tagItemPairList)) {
					deferred.reject("Fail");
					return deferred.promise;
				}
				saveCurrentTagApi(tempAllTag.tagTrackVO, deferred, tempAllTag.retUrlPrefix);
				break;
			case "tagClickVO":
				if (hasEmptyField(tagType, tempAllTag, $scope.tagItemPairList)) {
					deferred.reject("Fail");
					return deferred.promise;
				}
				saveCurrentTagApi(tempAllTag.tagClickVO, deferred, tempAllTag.retUrlPrefix);
				break;
			case "tagRecommendVO":
				if (hasEmptyField(tagType, tempAllTag, $scope.tagItemPairList)) {
					deferred.reject("Fail");
					return deferred.promise;
				}
				saveCurrentTagApi(tempAllTag.tagRecommendVO, deferred, tempAllTag.retUrlPrefix);
				break;
			case "tagExternalVOList":
				tempAllTag['tagExternalVOList'] = angular.copy($scope.externalList);
				saveCurrentTagApi(tempAllTag.tagExternalVOList, deferred, tempAllTag.retUrlPrefix);
				break;
			case "tagPixelVOList":
				tempAllTag['tagPixelVOList'] = angular.copy($scope.pixelList);
				saveCurrentTagApi(tempAllTag.tagPixelVOList, deferred, tempAllTag.retUrlPrefix);
				break;
			default:
		}

		return deferred.promise;

	};

	function saveUrlPrefix(model) {
		var obj = {
			"retUrlPrefix": model,
			"siteId": $scope.cSite.id
		};
		TagService.setUrlPrefix($scope.cSite.id, obj).then(function (response) {
			var data = response.data;
		});
	}

	function hasEmptyField(tagType, tempAllTag, array) {
		var flag = false;

		switch (tagType) {
			case "tagTrackVO":
				for (var i = 0, item; item = array[i]; i++) {
					if (item.hasOwnProperty('pairKey')) {
						if (!Boolean(item.pairKey)) {
							alert("[" + i18n.t("icem.tag.cookieTag") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
					}
				}

				var URL_PARAM_ARRAY = tempAllTag["tagTrackVO"].urlFetchMap.URL_PARAM;

				for (var i = 0; i < URL_PARAM_ARRAY.length; i++) {
					if (!Boolean(URL_PARAM_ARRAY[i])) {
						alert("[" + i18n.t("icem.tag.track.URL_PARAM") + "] "
							+ i18n.t("icem.tag.alertBlank"));
						flag = true;
						break;
					}
				}
				break;
			case "tagClickVO":
				for (var i = 0, item; item = array[i]; i++) {
					if (item.hasOwnProperty('pairKey')) {
						if (!Boolean(item.pairKey)) {
							alert("[" + i18n.t("icem.tag.pairKey") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
						if (!Boolean(item.pairValue)) {
							alert("[" + i18n.t("icem.tag.pairValue") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
					}
				}
				break;
			case "tagRecommendVO":
				for (var i = 0, item; item = array[i]; i++) {
					if (item.hasOwnProperty('pairKey')) {
						if (!Boolean(item.pairKey)) {
							alert("[" + i18n.t("icem.tag.pairKey") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
						if (!Boolean(item.pairValue)) {
							alert("[" + i18n.t("icem.tag.recommendId") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
					}
				}
				break;
			case "tagExternalVOList":

				if (array.type === "PAGE_VIEW" && array.urlPatternList && array.urlPatternList.length > 0) {
					for (var i = 0; i < array.urlPatternList.length; i++) {
						if (!Boolean(array.urlPatternList[i])) {
							alert("[" + i18n.t("icem.tag.Trigger.url") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
					}
				} else if (array.type === "PAGE_VIEW") {
					alert(i18n.t("icem.tag.noTrigger")
						+ " [" + i18n.t("icem.tag.Trigger.url") + "] ");
					flag = true;
				}

				if (array.type === "CLICK" && array.triggerDomList && array.triggerDomList.length > 0) {
					for (var i = 0; i < array.triggerDomList.length; i++) {
						if (!Boolean(array.triggerDomList[i])) {
							alert("[" + i18n.t("icem.tag.Trigger.domId") + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
					}
				} else if (array.type === "CLICK") {
					alert(i18n.t("icem.tag.noTrigger")
						+ " [" + i18n.t("icem.tag.Trigger.domId") + "] ");
					flag = true;
				}
				break;
			case "tagPixelVOList":
				if (array.urlPatternList && array.urlPatternList.length > 0) {
					for (var i = 0; i < array.urlPatternList.length; i++) {
						if (!Boolean(array.urlPatternList[i])) {
							alert("[" + i18n.t("icem.tag.Trigger." + array.type) + "] "
								+ i18n.t("icem.tag.alertBlank"));
							flag = true;
							break;
						}
					}
				} else {
					alert(i18n.t("icem.tag.noTrigger")
						+ " [" + i18n.t("icem.tag.Trigger." + array.type) + "]");
					flag = true;
				}
				break;
			default:
				console.log('hasEmptyField : switch error');

		}
		return flag;
	}

	function saveCurrentTagApi(model, deferred, retUrlPrefix) {
		if (!$scope.cSite) {
			deferred.reject("Fail");
			return deferred.promise
		}
		var sendObj = angular.copy(model);
		if (sendObj.hasOwnProperty('tagType')) {
			delete sendObj.tagType;
		}
		if ($scope.backupAllTag.retUrlPrefix !== retUrlPrefix) {
			saveUrlPrefix(retUrlPrefix);
			loadSnippet();
		}
		TagService[$scope.ApiObj.setApi]($scope.cSite.id, sendObj).then(function (response) {
			var data = response.data;
			if (data.success) {
				loadTagManager();
				showSaveAlert();
				deferred.resolve("Success : TagService " + $scope.ApiObj.setApi);
			} else {
				deferred.reject("Fail : TagService " + $scope.ApiObj.setApi);
			}
		});
		return deferred.promise;
	}

	$scope.resetAllTag = function (model) {
		var resetRc = $window.confirm(i18n.t("icem.undo.confirm"));
		if (resetRc) {
			$scope.tempAllTag = angular.copy($scope.backupAllTag);
			syncAlltag();
			if ($scope.tagItem) {
				$scope.openRightPanel($scope.tagItem);
			}
			$scope.saveAlert = false;
		}
	};

	function loadRecommendSetList(model) {
		if (!$scope.cSite) return;
		RecommendSetService.saveRecommendSetList($scope.cSite.id, model, 100, 0).then(function (response) {
			var data = response.data.data.content;
			$scope.recommendSetList = angular.copy(data);
		});
	}

	$scope.convertToString = function (model) {
		model.pairValue = model.pairValue.toString();
	};

	$scope.addToArray = function (type, array) {
		switch (type) {
			case "trackUrlMap":
				var str = '';
				array.push(str);
				break;
			default:
				console.log('switch default');
		}
	};

	$scope.deleteFromArray = function (type, array, idx) {
		switch (type) {
			case "trackUrlMap":
				array.splice(idx, 1);
				break;
			default:
				console.log('switch default');
		}
	};

};
