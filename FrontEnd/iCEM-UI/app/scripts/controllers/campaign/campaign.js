'use strict';

app.controller('campaignCtrl', campaignCtrl);

campaignCtrl.$inject = ['$scope', '$timeout', '$q', '$filter', '$window', '$upload', 'ngTableParams', 'CommonService', 'DmpService', 'ValidateService'];

function campaignCtrl($scope, $timeout, $q, $filter, $window, $upload, ngTableParams, CommonService, DmpService, ValidateService){

    // Loading animation
	$scope.isLoading = true;

    // const
	$scope.campaignLimit = 10;
	$scope.campaignCount = 0;
	$scope.selectedCategory = "Select Category";

    // data from API
	var tempCampaignList = [];

    // option
	$scope.DSP = ["Adwords", "DBM", "Facebook", "YAM", "ClickForce"];
	$scope.media = ["Video", "Display", "Social"];
	
    // container object
	var originCategory = null;
	$scope.category = [];
	$scope.newCampaign = {};
	$scope.campaignObject = {};
	$scope.catequery = '';
	$scope.selectedCampaign = {};

   // date
	$scope.format = 'yyyy-MM-dd';
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};


	loadCategory().then(function () {
		reloadCampaignTable();
	})
		.catch(function (error) {
			// console.log('error: ', error);
		});

	function loadCategory() {
		var deferred = $q.defer();
		DmpService.getLoadCategory($scope.cSite.id).then(function (response) {
			var data = response.data.data;
			deferred.resolve("Success : getLoadCategory");
			if (data.length > 0) {
				originCategory = angular.copy(data);
				$scope.category = $filter('filter')(data, { parentid: 0 }, true);
				for (var i = 0, pItem; pItem = $scope.category[i]; i++) {
					pItem['subCategory'] = [];
					for (var j = 0, item; item = data[j]; j++) {
						if (pItem.id == item.parentid) {
							pItem.subCategory.push(item);
						}
					}
				}
			} else {
				deferred.reject("Fail : no data in getLoadCategory");
			}
		});
		return deferred.promise;
	};

	$scope.onCategory = function (model, flag) {
		model.showSub = flag;
	};

	$scope.clickCategory = function (model, x) {
		$scope.selectedCategory = model.name;

		if (x) {
			// edit
			x.category = model.id;
		} else {
			// add new
			$scope.newCampaign.category = model.id;
		}
	};

	$scope.onCampaignFileSelect = function ($batchFile) {
		if ($batchFile.length > 0) {
			var AdsCampaignUrl = "/api/campaign/bulk";
			$scope.upload = $upload.upload({
				url: AdsCampaignUrl + "?siteId=" + $scope.cSite.id,
				file: $batchFile[0],
				headers: { 'auth': $window.sessionStorage['token'] }
			}).progress(function (evt) {
				// console.log('progress: ' + parseInt(100.0 * evt.loaded /
				// evt.total) + '% file :'+ evt.config.file.name);
			}).success(function (data, status, headers, config) {
				if (data.data.error.length > 0) {
					var errorMsg = i18n.t("icem.uploadFail") + ':\n';
					angular.forEach(data.data.error, function (err) {
						errorMsg += err + '\n';
					});
					alert(errorMsg);
				} else {
					if (!data.changed) {
						alert(i18n.t('icem.uploadSuccess') + ' 0 ' + i18n.t("icem.upload.row"));
					} else {
						var successMsg = i18n.t("icem.uploadSuccess") + ':\n';
						angular.forEach(data.data.info, function (err) {
							successMsg += err + '\n';
						});
						successMsg += i18n.t("icem.upload.row");
						alert(successMsg);
					}
				}
			});
		}
	};


	function reloadCampaignTable() {
		if ($scope.campaignTableParams) {
			$scope.campaignTableParams.reload();
		} else {
			$scope.campaignTableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10
			}, {
					total: 0,           // length of data
					getData: function ($defer, params) {
						var requestUrl = params.url();
						DmpService.getCampaignList($scope.cSite.id, params.count(), params.page() - 1).then(function (response) {
							var data = response.data.data;
							params.total(data.totalElements);
							$scope.campaignCount = data.grandTotal;
							$scope.isLoading = false;
							// set new data
							if (params.page() > 1 && (!data.content || data.content.length == 0)) {
								params.page(params.page() - 1);
							} else {
								angular.forEach(data.content, function (obj, idx) {
									var categoryName = $filter('filter')(originCategory, { id: obj.category }, true)[0];
									if (categoryName) {
										obj.categoryName = categoryName.name;
									} else {
										// console.log('no category', idx, obj)
									}
								});
								tempCampaignList = angular.copy(data.content);
								$defer.resolve(data.content);
							}
						});
					}
				})
		}
	};

	function checkDuplicateName(list, model) {
		var flag = false;
		for (var i = 0, item; item = list[i]; i++) {
			if (item.name == model.name && item.id != model.id) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	$scope.addRow = function () {
		$scope.newCampaign = { name: '', mediaType: '', category: '', dspchannel: '', dspclient: '', dspcampaign: '', id: null, sid: $scope.cSite.id };
		$scope.selectedCategory = "Select Category";
		$scope.isShow = true;
	};

	$scope.removeRow = function (model) {
		$scope.isShow = false;
		for (var key in model) {
			model[key] = '';
		}
	};

	$scope.copyCampaign = function (model) {
		$scope.isShow = true;
		$scope.newCampaign = angular.copy(model);
		$scope.newCampaign.id = null;
		$scope.catequery = '';
	};

	$scope.editCampaign = function (model) {
		model.$$edit = true;
		$scope.selectedCategory = model.categoryName;
		$scope.catequery = '';
	};

	$scope.cancelSaveCampaign = function (model) {
		$scope.catequery = '';
		var isFindFlag = false;
		angular.forEach(tempCampaignList, function (m) {
			if (!isFindFlag) {
				if (m.id == model.id) {
					for (var key in m) {
						model[key] = m[key];
					}
					model.$$edit = false;
					isFindFlag = true;
				}
			}
		});
	};

	$scope.deleteCampaign = function (model) {
		var deleteObj = {
			serviceApi: "DmpService",
			deleteApi: "deleteCampaignList",
			siteId: $scope.cSite.id,
			id: model.id
		};
		CommonService.deleteItem(deleteObj).then(function () {
			$scope.campaignTableParams.reload();
		});
	};

	$scope.uploadListCampaign = function (model) {
		$scope.selectedCampaign.name = model.name;
		DmpService.getCampaignListUploads($scope.cSite.id, model).then(function (response) {
			var data = response.data.data;
			$scope.selectedCampaign.total = data.totalElements;
			$scope.campaignObject = angular.copy(data.content);
			$('#uploadListModal').modal('show');
		});
	};

	$scope.saveCampaign = function (model) {
		var deferred = $q.defer();
		if (ValidateService.isEmptyInput(["icem.campaign.name", "icem.campaign.mediatype", "icem.campaign.category","icem.campaign.dsp","icem.campaign.dspclient","icem.campaign.dspcampaign"], [model.name, model.mediaType,model.category,model.dspchannel,model.dspclient,model.dspcampaign])) {
			deferred.reject("Fail - ValidateService");
		} else if (ValidateService.isValid.checkArray([model.name, model.dspclient, model.dspcampaign], ["icem.campaign.name", "icem.campaign.dspclient", "icem.campaign.dspcampaign"])) {
			deferred.reject("Fail");
		} else if (checkDuplicateName(tempCampaignList, model)) {
			alert("[" + i18n.t("icem.campaign.name") + "] "
				+ i18n.t("icem.duplicate"));
			deferred.reject("Fail");
		} else if (!model.startDate) {
			alert("[" + i18n.t("icem.campaign.startDate") + "] "
				+ i18n.t("icem.mandatory.invalid"));
			deferred.reject("Fail");
		} else if (!model.endDate) {
			alert("[" + i18n.t("icem.campaign.endDate") + "] "
				+ i18n.t("icem.mandatory.invalid"));
			deferred.reject("Fail");
		} else if (model.startDate && model.endDate && model.startDate > model.endDate) {
			alert(i18n.t("icem.items.date.compare"));
			deferred.reject("Fail");
		} else {
			delete model.categoryName;

			if (!model.id) {
				model["id"] = null;
			}

			DmpService.saveCampaignDetail($scope.cSite.id, model).then(function (response) {
				$scope.campaignTableParams.reload();
				$scope.isShow = false;
				deferred.resolve("Success");
			});
		}
		return deferred.promise;
	};
};
