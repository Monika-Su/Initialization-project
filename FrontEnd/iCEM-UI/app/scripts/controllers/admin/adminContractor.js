'use strict';

app.controller('contractorCtrl', contractorCtrl);

contractorCtrl.$inject = ['$scope', '$window', '$q', 'ngTableParams', 'CommonService', 'AdminService', 'SiteService', 'ValidateService'];

function contractorCtrl($scope, $window, $q, ngTableParams, CommonService, AdminService, SiteService, ValidateService) {
	// Loading animation
	$scope.isLoading = true;

	// panel show and hide
	$scope.showAddContractor = false;
	$scope.isShowAddSite = false;

	// UI container object
	// bind to view

	// data from API

	// option
	$scope.featureOption = ['APPKEY', 'ATTRIBUTE', 'USER_EXTERNAL', 'USER_AUTO', 'ITEM_AUTO', 'ITEM_EXTERNAL', 'RANKING', 'FILL_UP', 'GEOLOCATION', 'WEATHER', 'MANAGER_API', 'MAIL_EXPORT', 'MAIL_RULE', 'ADS_EXPORT'];
	$scope.tabs = [{ active: true }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }];

	// container object
	$scope.search = { name: "", option: "" };
	$scope.selection = [];

	// for init and search object

	// const
	$scope.hstep = 1;
	$scope.mstep = 10;

	// date
	$scope.format = 'yyyy/MM/dd';
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	initPage();

	function initPage(){
		$("#page-wrapper").css('margin-left', '0px');
		loadContractorTable();
	}

	function loadContractorTable() {
		$scope.contractorTableParams = new ngTableParams({
			page: 1,
			count: 20
		}, {
				total: 0,
				counts: [],
				getData: function ($defer, params) {
					AdminService.getAccountManagerList(params.page() - 1).then(function (response) {
						var data = response.data.data;
						$scope.contentCount = data.operatorList.totalElements;
						params.total($scope.contentCount);

						if (params.page() > 1 && (!data.operatorList.content || data.operatorList.content.length == 0)) {
							params.page(params.page() - 1);
						} else {
							$defer.resolve(data.operatorList.content);
						}
						$scope.isLoading = false;
					});
				}
			});
	}
	$scope.searchBtn = function () {
		$scope.contractorTableParams.reload();
	};

	$scope.clearSearch = function () {
		$scope.search = { name: "", option: "" };
	};

	$scope.newContractor = function () {
		AdminService.getNewAccountManager().then(function (response) {
			// mapOperatorAuth(response.data.data.operatorAuthorities);
			$scope.newModal = response.data.data;
			$scope.showAddContractor = true;
		});
	};

	$scope.closeContractor = function () {
		$scope.showAddContractor = false;
	};

	$scope.editContractor = function (model) {
		AdminService.getAccountManager(model.id).then(function (response) {
			var data = response.data.data;
			// mapOperatorAuth(data.operatorAuthorities);
			$scope.newModal = data;
			$scope.showAddContractor = true;
			$("html,body").animate({ scrollTop: 0 }, 700);
		});
	};

	$scope.saveContractor = function (model) {
		if (ValidateService.isEmptyInput(["icem.contractor.name", "icem.contractor.loginId", "icem.contractor.email"], [model.name, model.loginId, model.email])) {
		} else if (!validateEmail(model.email)) {
			alert("[" + i18n.t("icem.contractor.email") + "] "
				+ i18n.t("icem.invalid"));
		} else {
			$scope.showAddContractor = false;
			AdminService.saveAccountManager(model).then(function (response) {
				$scope.contractorTableParams.reload();
			});
		}
	};

	$scope.deleteContractor = function (model) {
		var deleteRc = $window.confirm(i18n.t('icem.delete.confirm'));
		if (deleteRc) {
			AdminService.deleteContractor(model.owningAccountId).then(function (response) {
				$scope.contractorTableParams.reload();
			});
		}
	};

	$scope.resetPassword = function (model) {
		var resetRc = $window.confirm(i18n.t('icem.resetPassword.confirm'));
		if (resetRc) {
			AdminService.upContractorPwd(model).then(function (response) {
				$('#passwordModal').modal('show');
				$scope.newPassword = response.data.data.newPassword;
			});
		}
	};

	$scope.managerSiteList = function (model) {
		$scope.accountId = model.owningAccountId;
		$scope.accountName = model.loginId;

		if ($scope.siteTableParams) {
			$scope.siteTableParams.reload();
		} else {
			$scope.siteTableParams = new ngTableParams({
				page: 1,
				count: 10
			}, {
					total: 0,
					counts: [],
					getData: function ($defer, params) {

						SiteService.getSiteList($scope.accountId).then(function (response) {
							var data = response.data.data;
							if (params.page() > 1 && (!data || data.length == 0)) {
								params.page(params.page() - 1);
							} else {
								$defer.resolve(data);
							}
							$('#siteModal').modal('show');
						});
					}
				});
		}
	};

	$scope.addManagerSite = function () {
		SiteService.getNewSite().then(function (response) {
			var data = response.data.data;
			$scope.newSiteModal = data.site;
			$scope.isShowAddSite = true;
			$scope.isShowAds = false;
			$scope.tabs = [{ active: true }, { active: false }, { active: false }, { active: false }];
		});
	};

	$scope.editManagerSite = function (model) {
		SiteService.getEditSite(model.id).then(function (response) {
			var data = response.data.data;
			$scope.newSiteModal = data.site;
			$scope.siteAdSystems = data.siteAdSystems;
			$scope.isShowAddSite = true;
			$scope.isShowAds = false;
		});
	};

	$scope.closeAddSite = function () {
		$scope.isShowAddSite = false;
	};

	$scope.saveSite = function (model) {
		if (ValidateService.isEmptyInput(["icem.site.name", "icem.site.uri", "icem.site.domain"], [model.name, model.uri, model.domain])) {
		} else if (!validUrl(model.uri)) {
			alert("[" + i18n.t("icem.site.uri") + "] "
				+ i18n.t("icem.invalid"));
		} else if (!model.adPoints.toString()) {
			alert("[" + i18n.t("icem.site.adsPoint") + "] "
				+ i18n.t("icem.invalid"));
		} else if (!model.expireDate && !model.autoRenew) {
			alert("[" + i18n.t("icem.site.expire") + "] "
				+ i18n.t("icem.mandatory"));
		} else {
			SiteService.saveSite($scope.accountId, model).then(function (response) {
				var data = response.data;
				$scope.siteTableParams.reload();
				$scope.isShowAddSite = false;
			});
		}
	};

	$scope.deleteManagerSite = function (model) {
		var deleteRc = $window.confirm(i18n.t('icem.delete.confirm'));
		if (deleteRc) {
			SiteService.deleteSite(model.id).then(function (response) {
				$scope.siteTableParams.reload();
			});
		}
	};

	$scope.addAds = function () {
		$scope.isShowAds = true;
		$scope.oneAds = [];
	};

	$scope.cancelAds = function () {
		$scope.isShowAds = false;
	};

	$scope.deleteAds = function (model) {
		var index = $scope.newSiteModal.siteAdRecommendList.indexOf(model);
		$scope.newSiteModal.siteAdRecommendList.splice(index, 1);
	};

	$scope.saveAds = function (adsName) {
		if (ValidateService.isEmptyInput(["icem.site.adsRecommendationName"], [adsName])) {
		} else if (CommonService.checkDuplicateAdsName($scope.newSiteModal.siteAdRecommendList, adsName)) {
			alert("[" + i18n.t("icem.site.adsRecommendationName") + "] "
				+ i18n.t("icem.duplicate"));
		} else {
			$scope.isShowAds = false;
			$scope.newSiteModal.siteAdRecommendList.push({ id: null, name: adsName });
		}
	};

	$scope.permission = function (main, sub) {
		if (sub) {
			// Sub Authority
			switch (sub.permission) {
				case 'NOT_AVAILABLE':
					var lastOneFlag = false;
					var count = 0;
					var subLength = main.sfoaList.length;
					for (var i = 0, item; item = main.sfoaList[i]; i++) {
						if (item.permission == 'NOT_AVAILABLE') {
							count++;
						};
					}
					if (count == subLength) {
						main.permission = 'NOT_AVAILABLE'
					}
					break;
				case 'ENABLED':
					main.permission = 'ENABLED';
					break;
			}
		} else {
			// Main Authority
			switch (main.permission) {
				case 'NOT_AVAILABLE':
					changePermission(main, 'NOT_AVAILABLE')
					break;
				case 'ENABLED':
					changePermission(main, 'ENABLED')
					break;
			}
		}
	};

	function changePermission(model, str) {
		for (var i = 0, item; item = model.sfoaList[i]; i++) {
			item.permission = str;
		}
		return model
	};

};
