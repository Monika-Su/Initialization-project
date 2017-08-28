'use strict';

app.controller('microSiteCtrl', microSiteCtrl);

microSiteCtrl.$inject = ['$scope', '$modal', '$window', '$q', '$timeout', 'ngTableParams', 'CommonService', 'MicroSiteService', 'ValidateService'];

function microSiteCtrl($scope, $modal, $window, $q, $timeout, ngTableParams, CommonService, MicroSiteService, ValidateService){

    // container object
	var tempMicroSiteList = null;

	// const
	$scope.microSiteCount = 0;
	$scope.microSiteLimit = 5;

	reloadMicroSite();

	$scope.getTitle = function (key) {
		return i18n.t(key);
	};

	$scope.addMicroSite = function () {
		$scope.isShow = true;
		$scope.microSiteObj = {
			"id": null,
			"name": "",
			"appId": "",
			"appSecret": ""
		};
	};

	$scope.closeMicroSite = function () {
		$scope.isShow = false;
	};

	$scope.saveMicroSite = function (model) {
		var deferred = $q.defer();
		if (!model) {
			deferred.reject("Fail");
			return deferred.promise;
		}
		if (ValidateService.isEmptyInput(["icem.microSite.name", "icem.microSite.appId", "icem.microSite.appSecret"], [model.name, model.appId,model.appSecret])) {
			deferred.reject("Fail - ValidateService");
		} else {
			model.$$edit = false;
			$scope.isShow = false;

			MicroSiteService.saveMicroSiteDetail($scope.cSite.id, model).then(function (response) {
				if (!response) {
					$scope.cancelMicroSite(model);
				} else {
					var data = response.data.data;
					reloadMicroSite();
					$modal.open({
						templateUrl: 'editNewMenu.html',
						controller: 'weixinMenuCtrl',
						resolve: { microSiteId: function () { return data.id; } }
					});
				}
				deferred.resolve("Success");
			});
		}
		return deferred.promise;
	};

	$scope.cancelMicroSite = function (model) {
		var isFindFlag = false;
		angular.forEach(tempMicroSiteList, function (m) {
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

	$scope.deleteMircoSite = function (model) {
		var deleteItem = $window.confirm(i18n.t('icem.delete.confirm'));
		if (deleteItem) {
			MicroSiteService.deleteMicroSiteDetail($scope.cSite.id, model.id).then(function (response) {
				reloadMicroSite();
			});
		}
	};

	function reloadMicroSite() {
		if ($scope.microSiteTableParams) {
			$scope.microSiteTableParams.reload();
		} else {
			$scope.microSiteTableParams = new ngTableParams({
				page: 1,
				count: 10
			}, {
					total: 0,
					getData: function ($defer, params) {
						MicroSiteService.getMicroSiteList($scope.cSite.id).then(function (response) {
							var data = response.data.data;
							params.total(data.totalElements);
							tempMicroSiteList = angular.copy(data.content);
							$scope.microSiteCount = data.totalElements;
							if (params.page() > 1 && data.content.slice((params.page() - 1) * params.count(), params.page() * params.count()).length == 0) {
								params.page(params.page() - 1);
							}
							$defer.resolve(data.content.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						});
					}
				});
		}
	}

};

app.controller('weixinMenuCtrl', weixinMenuCtrl);

weixinMenuCtrl.$inject = ['$scope', '$window', '$q', '$timeout', '$modalInstance', 'microSiteId', 'CommonService', 'MicroSiteService', 'ValidateService'];

function weixinMenuCtrl($scope, $window, $q, $timeout, $modalInstance, microSiteId, CommonService, MicroSiteService, ValidateService){

	$scope.CommonService = CommonService;
	$scope.cSite = JSON.parse($window.sessionStorage.getItem('cSite'));
	// const
	$scope.isRoot = 0;

	// container
	var orgiMenu = [];
	var newMenu = [];

	hideAllBtn();
	loadMenu();
	loadPublishedMenu();

	$scope.selectLv1 = function (modal) {
		hideAllBtn();
		$scope.isRoot = 1;
		$scope.showModule = true;
		$scope.showBtn = true;
		$scope.tempMenu = modal;
		$scope.setMenu = {
			menuId: null,
			name: '',
			key: null,
			subButton: [],
			type: null,
			url: null
		};
		if (modal.menuId) {
			$scope.rootType = 1;
			selectMenuOption(modal.menuId);
		} else {
			$scope.rootType = 0;
			$scope.setMenu.name = angular.copy(modal.name);
		}

	};

	$scope.selectLv2 = function (modal, event) {
		event.stopPropagation();
		hideAllBtn();
		$scope.isRoot = 0;
		$scope.rootType = 1;
		$scope.showModule = true;
		$scope.showBtn = true;
		$scope.tempMenu = modal;
		selectMenuOption(modal.menuId);
	};

	$scope.addSubMenu = function (modal) {
		hideAllBtn();
		$scope.rootType = 1;
		$scope.tempMenu = modal;
		$scope.showSubBtn = true;
	};

	$scope.addMenu = function () {
		hideAllBtn();
		$scope.isRoot = 1;
		$scope.showBtn = true;
		$scope.tempMenu = null;
		$scope.setMenu = {
			menuId: null,
			name: '',
			key: null,
			subButton: [],
			type: null,
			url: null
		};
	};

	$scope.saveBtn = function (modal, rootType) {
		if (rootType == 0) {
			if (ValidateService.isEmptyInput(["icem.microSite.menuName"], [modal.name])) {
				return;
			} else {
				if (countLength(modal.name) > 8) {
					alert("[" + i18n.t("icem.microSite.menuName") + "] "
						+ i18n.t("icem.microSite.limitWord"));
					return;
				}
				modal.menuId = null;
			}
		} else if (rootType == 1) {
			if (ValidateService.isEmptyInput(["icem.microSite.module"], [modal.id])) {
				return;
			}
		} else {
			return;
		}
		// console.log("saveBtn:", modal);

		if ($scope.isRoot === 1) {
			if ($scope.tempMenu) {//update root
				$scope.tempMenu.menuId = null;
				$scope.tempMenu.name = modal.name;
				$scope.tempMenu.key = modal.key;
				$scope.tempMenu.type = 'view';
				$scope.tempMenu.url = modal.url;
				$scope.tempMenu.subButton = [];
				// console.log("saveBtn tempMenu:", $scope.tempMenu);
			} else {//add new root
				var btnMenu = { key: modal.key, menuId: null, name: modal.name, type: null, url: modal.url };
				if (!$scope.menuList) {
					$scope.menuList = [];
				}
				$scope.menuList.push(btnMenu);
				// console.log("saveBtn menuList:", $scope.menuList);
			}
		} else {//sub menu
			$scope.tempMenu.menuId = modal.id;
			$scope.tempMenu.name = modal.name;
		}
		hideAllBtn();
	};

	$scope.saveSubMenu = function (modal) {
		// console.log("saveSubMenu:", modal);
		if (ValidateService.isEmptyInput(["icem.microSite.module"], [modal.id])) {
		} else {
			if (!$scope.tempMenu.subButton) {
				$scope.tempMenu.subButton = [];
			}

			var subBtn = { key: null, menuId: modal.id, name: modal.name, type: 'view', url: modal.url, subButton: [] };
			$scope.tempMenu.subButton.splice(0, 0, subBtn);
			hideAllBtn();
		}
	};

	$scope.deleteMenu = function (modal) {
		angular.forEach($scope.menuList, function (menu, index) {
			if (menu === $scope.tempMenu) {
				$scope.menuList.splice(index, 1);
			} else {
				angular.forEach(menu.subButton, function (subMenu, subIndex) {
					if (subMenu === $scope.tempMenu) {
						$scope.menuList[index].subButton.splice(subIndex, 1);
					}
				});
			}
		});
		hideAllBtn();
	};

	$scope.syncMenu = function () {
		var deferred = $q.defer();
		if ($window.confirm(i18n.t('icem.microSite.sync.confirm'))) {
			MicroSiteService.getMicroSiteSyncMenu($scope.cSite.id, microSiteId).then(function () {
				deferred.resolve("Success : getMicroSiteSyncMenu");
				loadMenu();
			});
		}
		return deferred.promise;
	};

	$scope.publish = function () {
		var deferred = $q.defer();
		if ($scope.menuList) {
			updateMenuJson(publishMenu, deferred);
		} else {
			$modalInstance.close();
			deferred.resolve("Success");
			// return deferred.promise;
		}
		return deferred.promise;
	};

	$scope.save = function () {
		var deferred = $q.defer();
		if ($scope.menuList) {
			updateMenuJson();
		}
		$modalInstance.close();
		$timeout(function () {
			deferred.resolve("Success");
		}, 1000);
		return deferred.promise;
	};

	$scope.cancel = function () {
		$modalInstance.close();
	};

	function publishMenu() {
		MicroSiteService.saveMicroSitePublish($scope.cSite.id, microSiteId).then(function (response) {
			var data = response.data.data;
			if (data.errcode != 0) {
				alert(data.errmsg);
			} else {
				$modalInstance.close();
			}
		});
	}

	function updateMenuJson(callback, deferred) {
		newMenu = getMenuIdArray($scope.menuList);
		// console.log("newMenu:",newMenu);
		for (var orgikey in orgiMenu) {
			for (var newkey in newMenu) {
				if (orgikey == newkey) {//reduce the same menuId
					delete orgiMenu[orgikey];
					delete newMenu[orgikey];
				}
			}
		}

		var newMenuId = "";
		var deleteMenuId = "";
		for (var orgikey in newMenu) {
			if (newMenuId.length > 0) {
				newMenuId = newMenuId + ',';
			}
			newMenuId = newMenuId + orgikey;
		}

		for (var orgikey in orgiMenu) {
			if (deleteMenuId.length > 0) {
				deleteMenuId = deleteMenuId + ',';
			}
			deleteMenuId = deleteMenuId + orgikey;
		}

		var upMenuObj = {
			buttonVOs: $scope.menuList,
			deleteMenuId: deleteMenuId,
			newMenuId: newMenuId
		};

		// console.log("upMenuObj:", upMenuObj);
		MicroSiteService.saveMicroSiteUpdateMenuJson($scope.cSite.id, microSiteId, upMenuObj).then(function (response) {
			if (callback) {
				callback();
			}
			loadMenu();
			hideAllBtn();
			deferred.resolve("Success : saveMicroSiteUpdateMenuJson");
			return deferred.promise;
		});
	}

	function loadMenu() {
		MicroSiteService.getMicroSiteDetailJson($scope.cSite.id, microSiteId).then(function (response) {
			var data = response.data.data;
			if (!data) return;
			$scope.menuList = JSON.parse(data);
			orgiMenu = getMenuIdArray($scope.menuList);
			// console.log("loadMenu:", $scope.menuList);
		});
	}

	function getMenuIdArray(menuList) {
		var menuArray = [];
		angular.forEach(menuList, function (menu) {
			if (menu.menuId) {
				menuArray[menu.menuId] = {};
			}
			angular.forEach(menu.subButton, function (subMenu, index) {
				if (subMenu.menuId) {
					menuArray[subMenu.menuId] = {};
				}
			});
		});
		return menuArray;
	}

	function loadPublishedMenu() {
		MicroSiteService.getMicroSiteMenuPublishedList($scope.cSite.id, microSiteId).then(function (response) {
			var data = response.data.data;
			$scope.menuOption = data;
		});
	}

	function selectMenuOption(menuId) {
		var isFindFlag = false;
		angular.forEach($scope.menuOption, function (menu, index) {
			if (!isFindFlag) {
				if (menu.id == menuId) {
					$scope.setMenu = $scope.menuOption[index];
					isFindFlag = true;
				}
			}
		});
	}

	function countLength(stringToCount) {
		var c = stringToCount.match(/[^ -~]/g);
		return stringToCount.length + (c ? c.length : 0);
	}

	function hideAllBtn() {
		$scope.showBtn = false;
		$scope.showSubBtn = false;
		$scope.isRoot = 0;
		$scope.rootType = 2;
	}
};
