'use strict';

// app.controller('expiringSiteCtrl', function ($scope, $window, $q, ngTableParams, CommonService, SiteService, ValidateService) {
app.controller('expiringSiteCtrl', expiringSiteCtrl);

expiringSiteCtrl.$inject = ['$scope', '$window', '$q', 'ngTableParams', 'CommonService', 'SiteService', 'ValidateService'];

function expiringSiteCtrl($scope, $window, $q, ngTableParams, CommonService, SiteService, ValidateService) {

	// Loading animation
	$scope.isLoading = true;

	// date
	$scope.format = 'yyyy-MM-dd';
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	// const
	$scope.hstep = 1;
	$scope.mstep = 10;

	// data from API


	initPage();
	
	function initPage(){
		$("#page-wrapper").css('margin-left', '0px');
		loadSiteTable();
	}

	function loadSiteTable() {
		$scope.siteTableParams = new ngTableParams({
			page: 1,
			count: 10
		}, {
				total: 0,
				counts: [],
				getData: function ($defer, params) {
					SiteService.getExpiredSites().then(function (response) {
						var data = response.data.data;
						params.total(data.length);
						if (params.page() > 1 && (!data || data.length == 0)) {
							params.page(params.page() - 1);
						} else {
							$defer.resolve(data);
						}
						$scope.isLoading = false;
					});
				}
			});
	};

	$scope.editSite = function (model) {
		$scope.accountId = model.accountId;

		SiteService.getEditSite(model.id).then(function (response) {
			var data = response.data.data;
			$scope.newSiteModal = data.site;
			$scope.tabs = [{ active: true }, { active: false }, { active: false }, { active: false }];
			$('#editSiteModal').modal('show');
		});
	};

	$scope.deleteSite = function (model) {
		var deleteRc = $window.confirm(i18n.t('icem.delete.confirm'));
		if (deleteRc) {
			SiteService.deleteSite(model.id).then(function (response) {
				$scope.siteTableParams.reload();
			});
		}
	};

	$scope.saveSite = function (model) {
		if (ValidateService.isEmptyInput(["icem.site.name", "icem.site.domain"], [model.name, model.domain])) {
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
				$('#editSiteModal').modal('hide');
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
		if (!adsName) {
			alert("[" + i18n.t("icem.site.adsRecommendationName") + "] "
				+ i18n.t("icem.mandatory"));
		} else if (CommonService.checkDuplicateAdsName($scope.newSiteModal.siteAdRecommendList, adsName)) {
			alert("[" + i18n.t("icem.site.adsRecommendationName") + "] "
				+ i18n.t("icem.duplicate"));
		} else {
			$scope.isShowAds = false;
			$scope.newSiteModal.siteAdRecommendList.push({ id: 0, name: adsName });
		}
	};

};


