'use strict';

app.controller('itemAliasCtrl', itemAliasCtrl);

itemAliasCtrl.$inject = ['$scope', '$q', '$window', 'ngTableParams', 'CommonService', 'ItemService', 'ValidateService'];

function itemAliasCtrl($scope, $q, $window, ngTableParams, CommonService, ItemService, ValidateService){

    // Loading animation
	$scope.isLoading = true;

    // panel show and hide
	$scope.isShowAdd = false;

    // container object
	$scope.cpoyAliasList = [];

    // const
	$scope.attributeLimit = 10;
	$scope.attributeCount = 0;

	loadItemAlias();

	$scope.addAttribute = function () {

		if ($scope.isShowAdd) return;

		if ($scope.attributeCount < $scope.attributeLimit) {
			$scope.isShowAdd = true;
			$scope.attributeCount++;
			var subType = "ITEM_COMMON_ATTR" + $scope.attributeCount;
			$scope.itemAttr = [{ attributeId: null, name: "", subType: subType, type: "ITEM_ATTRIBUTE", value: null, status: true }];
		} else {
			alert(i18n.t("EXCEED_MAX"));
		}
	};

	$scope.addItemAlias = function (model) {
		var deferred = $q.defer();
		if (ValidateService.isEmptyInput(["ITEM_NAME"], [model[0].name])) {
            deferred.reject("Fail - ValidateService");
		} else if (CommonService.checkDuplicateName($scope.cpoyAliasList, model[0], 'attributeId', 'name', "icem.campaign.name")) {
			deferred.reject("Fail - Duplicated");
		} else {
			ItemService.saveItemAttribute($scope.cSite.id, model).then(function (response) {
				$scope.isShowAdd = false;
				loadItemAlias();
				deferred.resolve("Success");
			});
		}
		return deferred.promise;
	};

	$scope.closeItemAlias = function () {
		$scope.attributeCount--;
		$scope.isShowAdd = false;
	};

	$scope.saveEditItem = function (model) {
		var deferred = $q.defer();
		if (CommonService.checkDuplicateName($scope.cpoyAliasList, model, 'attributeId', 'name', "icem.campaign.name")) {
			deferred.reject("Fail - Duplicated");
			return deferred.promise;
		}
		if (model.name != "") {
			for (var i = 0; i < $scope.itemAlias.length; i++) {
				if ($scope.itemAlias[i].subType == model.subType) {
					$scope.itemAlias[i].name = model.name;
					ItemService.saveItemAttribute($scope.cSite.id, $scope.itemAlias).then(function (response) {
						deferred.resolve("Success");
						model.$$edit = false;
						$scope.isShowAdd = false;
						loadItemAlias();
					});
				}
			}

		} else {
			alert("[" + i18n.t("ITEM_NAME") + "] " + i18n.t("icem.mandatory"));
			deferred.reject("Fail");
		}
		return deferred.promise;
	};

	$scope.cancelItem = function (model) {
		model.$$edit = false;
		for (var i = 0; i < $scope.cpoyAliasList.length; i++) {
			if ($scope.cpoyAliasList[i].subType == model.subType) {
				model.status = $scope.cpoyAliasList[i].status;
				model.name = $scope.cpoyAliasList[i].name;
				break;
			}
		}
		$scope.isShowAdd = false;
	};

	function loadItemAlias() {
		ItemService.getItemAttribute($scope.cSite.id).then(function (response) {
			var list = response.data.data;
			$scope.itemAlias = angular.copy(list);
			$scope.cpoyAliasList = angular.copy(list);
			$scope.attributeCount = $scope.itemAlias.length;
			$scope.isShow = ($scope.itemAlias.length > 0) ? true : false;
			$scope.isLoading = false;
		});
	}
};
