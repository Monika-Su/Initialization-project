'use strict';
app.controller('itemCtrl', itemCtrl);

itemCtrl.$inject = ['$scope', '$window', '$upload', '$q', 'ngTableParams', 'CommonService', 'ItemService', 'ValidateService'];

function itemCtrl($scope, $window, $upload, $q, ngTableParams, CommonService, ItemService, ValidateService){

    // Loading animation
	$scope.isLoading = true;

    // container object
	var editedItemBackup = null;

    // data from API
	var tempItemList = null;
	$scope.itemAlias = [];

    // Date
	$scope.format = 'yyyy-MM-dd';
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	// option
	$scope.uploadFileType = [
		{ name: 'CSV' },
		{ name: 'EXCEL' }
	];

   // for init and search object
	$scope.items = { code: null, name: null, grouping: null, category: null };


	loadItemListTable($scope.cSite.id, $scope.items);

	$scope.editItem = function (model) {
		model.$$edit = true;
		editedItemBackup = angular.copy(model);
	}

	ItemService.getItemAttribute($scope.cSite.id).then(function (response) {
		$scope.itemAlias = response.data.data;
	});

	$scope.addRow = function () {
		$scope.isShow = true;
		$scope.itemAttr = {
			itemId: null,
			code: "",
			name: "",
			price: "",
			grouping: "",
			category: "",
			img: "",
			startDate: "",
			endDate: "",
			description: "",
			attributes: {}
						  };
	};

	$scope.removeRow = function () {
		$scope.isShow = false;
	};

	$scope.filterChange = function (items) {
		items.code = (items.code != "") ? items.code : null;
		items.name = (items.name != "") ? items.name : null;
		items.grouping = (items.grouping != "") ? items.grouping : null;
		items.category = (items.category != "") ? items.category : null;
		loadItemListTable($scope.cSite.id, items);
	};

	$scope.saveItem = function (model) {
		var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.items.code", "icem.items.name", "icem.items.grouping", "icem.items.category"], [model.code, model.name, model.grouping, model.category])) {
            deferred.reject("Fail - ValidateService");
        } else if (ValidateService.isValid.checkArray([model.code, model.name, model.grouping, model.category], ["icem.items.code", "icem.items.name", "icem.items.grouping", "icem.items.category"])) {
			deferred.reject("Fail");
		} else if (isNaN(parseFloat(model.price))) {
			alert("[" + i18n.t("icem.items.price") + "] "
				+ i18n.t("icem.mandatory"));
			deferred.reject("Fail");
		} else if (model.startDate && model.endDate && model.startDate > model.endDate) {
			alert(i18n.t("icem.items.date.compare"));
			deferred.reject("Fail");
		} else {
			model.$$edit = false;
			ItemService.saveItem($scope.cSite.id, model).then(function (response) {
				deferred.resolve("Success");
				$scope.tableParams.reload();
				$scope.isShow = false;
			});
		}
		return deferred.promise;
	};

	$scope.cancelSaveItem = function (model) {
		for (var key in editedItemBackup) {
			model[key] = editedItemBackup[key];
		}
		model.$$edit = false;
	};

	$scope.deleteItem = function (model) {
		var deleteObj = {
			serviceApi: "ItemService",
			deleteApi: "deleteItem",
			siteId: $scope.cSite.id,
			id: model.itemId
		};
		CommonService.deleteItem(deleteObj).then(function () {
			model.status = 'DELETED';
			$scope.tableParams.reload();
			$scope.isShow = false;
		});
		// var deleteItem = $window.confirm(i18n.t('icem.delete.confirm') + " " + i18n.t('icem.items.deleteWarning'));
		// if (deleteItem) {
		// 	model.status = 'DELETED';
		// 	ItemService.deleteItem($scope.cSite.id, model.itemId).then(function () {
		// 		$scope.tableParams.reload();
		// 		$scope.isShow = false;
		// 	});
		// }
	};

	$scope.onFileSelect = function (x, $files) {
		if ($files.length > 0) {
			if ($files[0].size > 200000) {
				alert(i18n.t("icem.items.UploadLimit"));
			} else {
				$scope.upload = $upload.upload({
					url: '/api/item/bulk?siteId=' + $scope.cSite.id + "&id=" + x.itemId,
					file: $files[0],
					headers: { 'auth': $window.sessionStorage['token'] }
				}).success(function (data, status, headers, config) {
					if (data.success) {
						alert(i18n.t("icem.uploadSuccess"));
						// $timeout(function () {
						$scope.tableParams.reload();
						// }, 2000);
					} else {
						x.$$edit = false;
						alert(i18n.t("icem.uploadFail"));
					}
				});
			}
		}
	};

	function loadItemListTable(siteId, itmesObj) {
		if ($scope.tableParams) {
			$scope.tableParams.reload();
		} else {
			$scope.tableParams = new ngTableParams({
				page: 1,
				count: 10
			}, {
					total: 0,
					getData: function ($defer, params) {

						ItemService.getItemList(siteId, params.count(), params.page() - 1, itmesObj).then(function (response) {
							var data = response.data.data;
							$scope.isLoading = false;
							params.total(data.totalElements);

							if (params.page() > 1 && (!data.content || data.content.length == 0)) {
								params.page(params.page() - 1);
							} else {
								tempItemList = data.content.map(function (obj) {
									obj.img = obj.img + '?r=' + Math.random();;
									return obj;
								});
								$defer.resolve(data.content);
							}
						});

					}
				});
		}
	};

	$scope.onBatchImageUpload = function ($batchDataFile) {
		if ($batchDataFile.length > 0) {
			$scope.upload = $upload.upload({
				url: '/api/item/bulkZip?siteId=' + $scope.cSite.id,
				file: $batchDataFile[0],
				headers: { 'auth': $window.sessionStorage['token'] }
			}).progress(function (evt) {
				// console.log('progress: ' + parseInt(100.0 * evt.loaded /
				// evt.total) + '% file :'+ evt.config.file.name);
			}).success(function (data, status, headers, config) {
				if (data.success) {
					if (data.data.error.length === 0) {
						var successMsg = i18n.t("icem.uploadSuccess") + ':\n';
						angular.forEach(data.data.info, function (str) {
							successMsg += str + '\n';
						});
						alert(successMsg);
					} else {
						var errorMsg = i18n.t("icem.uploadFail") + ':\n';
						angular.forEach(data.data.error, function (str) {
							errorMsg += str + '\n';
						});
						alert(errorMsg);
					}
					$scope.tableParams.reload();
				} else {
					alert(i18n.t("icem.uploadFail"));
				}
			});
		}
	};

	$scope.onBatchFileUpload = function ($batchFile) {
		var fileType;
		if ($batchFile[0].name.indexOf('.xlsx') > -1) {
			fileType = 'EXCEL';
		} else if ($batchFile[0].name.indexOf('.csv') > -1) {
			fileType = 'CSV';
		} else {
			alert(i18n.t("icem.items.UploadTypeLimit"));
			return;
		};

		if ($batchFile.length > 0) {
			$scope.upload = $upload.upload({
				url: '/api/item/bulkItems?siteId=' + $scope.cSite.id + '&fileType=' + fileType,
				file: $batchFile[0],
				headers: { 'auth': $window.sessionStorage['token'] }
			}).progress(function (evt) {
				// console.log('progress: ' + parseInt(100.0 * evt.loaded /
				// 	evt.total) + '% file :' + evt.config.file.name);
			}).success(function (data, status, headers, config) {
				if (data.success) {
					if (data.data.error.length === 0) {
						var successMsg = i18n.t("icem.uploadSuccess") + ':\n';
						angular.forEach(data.data.info, function (str) {
							successMsg += str + '\n';
						});
						alert(successMsg);
					} else {
						var errorMsg = i18n.t("icem.uploadFail") + ':\n';
						angular.forEach(data.data.error, function (str) {
							errorMsg += str + '\n';
						});
						alert(errorMsg);
					}
					$scope.tableParams.reload();
				} else {
					alert(i18n.t("icem.uploadFail"));
				}
			});
		}
	};
};
