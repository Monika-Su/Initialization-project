'use strict';

app.controller('pixelCtrl', pixelCtrl);

pixelCtrl.$inject = ['$scope', '$timeout', '$window', '$filter', '$q', 'ngTableParams', 'CommonService', 'DmpService'];

function pixelCtrl($scope, $timeout, $window, $filter, $q, ngTableParams, CommonService, DmpService){


    // Loading animation
	$scope.isLoading = true;

    // container object
	var tempPixelList = [];
	$scope.newPixel = {};
	$scope.infoModal = {};

	// const
	$scope.pixelLimit = 10;
	$scope.pixelCount = 0;
	$scope.pixelLabels = ["Landing", "ViewContent", "AddToCart", "Checkout", "PaymentInfo", "Purchase", "Lead", "CompleteRegistration"];

	loadPixelTable();

	$scope.openInfo = function (model) {
		$scope.infoModal = {};
		$scope.infoModal.trackingCode = '<img src="http://amnet.tw/p/?a=' + $scope.cSite.account + '&cat=' + model.pixelid + '>';
		$scope.infoModal.conversionCode = '<img src="http://amnet.tw/p/?a=' + $scope.cSite.account + '&catcv=' + model.pixelid + '>';
		$('#infoModal').modal('show');
	};

	function loadPixelTable(){
		$scope.pixelTableParams = new ngTableParams({
			page: 1,            // show first page
			count: 10
		}, {
				total: 0,           // length of data
				getData: function ($defer, params) {
					// ajax request to api
					var requestUrl = params.url();
					//custom filter object
					if ($scope.filterLabel) {
						requestUrl['filter[label]'] = $scope.filterLabel;
					}
					if ($scope.filterName) {
						requestUrl['filter[name]'] = $scope.filterName;
					}

					DmpService.getPixelList($scope.cSite.id, requestUrl).then(function (response) {
						var data = response.data;
						params.total(data.total);
						$scope.isLoading = false;
						$scope.pixelCount = data.grandTotal;
						// set new data
						if (params.page() > 1 && (!data.list || data.list.length == 0)) {
							//go previous page when no recommend in this page
							params.page(params.page() - 1);
						} else {
							tempPixelList = angular.copy(data.list);
							$defer.resolve(data.list);
						}
					});
				}
			});
	}

	$scope.filterChange = function (column, filter) {
		if (column == 'label') {
			$scope.filterLabel = filter;
		}
		if (column == 'name') {
			$scope.filterName = filter;
		}
		$scope.pixelTableParams.reload();
	};

	$scope.addPixel = function () {
		$scope.newPixel = { name: '', label: '' };
		$scope.isShow = true;
	};

	$scope.removePixel = function (model) {
		$scope.isShow = false;
		for (var key in model) {
			model[key] = '';
		}
	};

	$scope.deletePixel = function (model) {
		var deletePixel = $window.confirm(i18n.t('icem.delete.confirm'));
		if (deletePixel) {
			DmpService.deletePixelList($scope.cSite.id, model).then(function () {
				$scope.pixelTableParams.reload();
			});
		}
	};

	$scope.editPixel = function (model) {
		model.$$edit = true;
	};

	$scope.cancelSavePixel = function (model) {
		var isFindFlag = false;
		angular.forEach(tempPixelList, function (m) {
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

	$scope.savePixel = function (model) {
		if (!model || !model.name) {
			alert("[" + i18n.t("icem.pixel.name") + "] "
				+ i18n.t("icem.mandatory"));
		} else if (!model.label) {
			alert("[" + i18n.t("icem.pixel.label") + "] "
				+ i18n.t("icem.mandatory.invalid"));
		} else {
			if (model.id) {
				//update
				DmpService.upPixelDetail($scope.cSite.id, model).then(function () {
					$scope.pixelTableParams.reload();
					$scope.isShow = false;
					$scope.newPixel = {};
				});
			} else {
				//create
				DmpService.savePixelDetail($scope.cSite.id, model).then(function () {
					$scope.pixelTableParams.reload();
					$scope.isShow = false;
					$scope.newPixel = {};
				});
			}
		}
	};

};
