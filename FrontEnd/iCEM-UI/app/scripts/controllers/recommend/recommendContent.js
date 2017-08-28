'use strict';

app.controller('recommendContentCtrl', recommendContentCtrl);

recommendContentCtrl.$inject = ['$scope', '$window', '$q', '$upload', '$sce', '$sanitize', 'ngTableParams', 'CommonService', 'RecommendService', 'ValidateService'];

function recommendContentCtrl($scope, $window, $q, $upload, $sce, $sanitize, ngTableParams, CommonService, RecommendService, ValidateService){

    // Loading animation
	$scope.isLoading = true;

    // panel show and hide
	$scope.isShowRecommendContent = false;


    // data from API
	$scope.tempRecommendContentList = null;
	$scope.fieldList = null;

    // container object
	$scope.newRecommendContent = null;

   // for init and search object
	var vo = {
		"name": null,
		"status": null
	};
	var initContentObj = null;


	initTable(vo);

	RecommendService.getRecommendFieldList($scope.cSite.id).then(function (response) {
		var data = response.data.data;
		$scope.fieldList = angular.copy(data);
	});

    $scope.renderHtml = function (html) {
        return $sce.trustAsHtml(html);
    };

	$scope.isShowPreview = function(model){
		return model.indexOf('${') === -1
	};

	function openRecommendContentPanel(flag) {
		$scope.isShowRecommendContent = flag;
	}

	$scope.addRecommendContent = function () {
		openRecommendContentPanel(true);
		$scope.newRecommendContent = angular.copy(initContentObj);
	};


	$scope.editRecommendContent = function (model) {
		openRecommendContentPanel(true);
		$scope.newRecommendContent = angular.copy(model);
	};

	$scope.saveRecommendContent = function (model) {
		var deferred = $q.defer();
		if (ValidateService.isEmptyInput(["icem.recommendContent.name"], [model.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
		} else if (CommonService.checkDuplicateName($scope.tempRecommendContentList, model, 'id', 'name', "icem.recommendContent.name")) {
			deferred.reject("Fail - DuplicateName");
			return deferred.promise;
		} else if (ValidateService.isEmptyInput(["icem.template.html"], [model.item.html])) {
			deferred.reject("Fail - ValidateService");
			return deferred.promise;
		}
		openRecommendContentPanel(false);
		RecommendService.saveRecommend($scope.cSite.id, model).then(function () {
			$scope.isLoading = false;
			$scope.recommendContentTableParams.reload();
			deferred.resolve("Success");
		});
		return deferred.promise;
	};

	$scope.closeRecommendContent = function () {
		openRecommendContentPanel(false);
	};

	$scope.deleteRecommendContent = function (recommendContentId) {
		var deleteObj = {
            serviceApi: "RecommendService",
            deleteApi: "deleteRecommend",
            siteId: $scope.cSite.id,
            id: recommendContentId
        };
		CommonService.deleteItem(deleteObj).then(function(){
            $scope.recommendContentTableParams.reload();
        });
	};

	$scope.undoRecommendContent = function () {

	};

	function initTable(model) {
		$scope.recommendContentTableParams = new ngTableParams({
			page: 1,
			count: 10
		}, {
				total: 0,
				getData: function ($defer, params) {

					RecommendService.saveRecommendList($scope.cSite.id, model, params.count(), params.page() - 1).then(function (response) {
						var data = response.data.data.content;
						$scope.isLoading = false;
						params.total(response.data.data.totalElements);

						if (!initContentObj) {
							newContentObj(data[0]);
						}

						if (params.page() > 1 && (!data || data.length == 0)) {
							params.page(params.page() - 1);
						} else {
							$scope.tempRecommendContentList = angular.copy(data);
							$defer.resolve(data);
						}
					});

				}
			});
	}

	function newContentObj(model) {
		initContentObj = angular.copy(model);
		for (var prop in initContentObj) {
			if (prop !== 'item') {
				if (prop == 'status') {
					// set default item.status value
					initContentObj[prop] = "DRAFT";
				} else {
					initContentObj[prop] = null;
				}
			} else {
				for (var subprop in initContentObj['item']) {
					initContentObj['item'][subprop] = null;
				}
			}
		}
	}
};
	app.directive("popoverHtmlUnsafePopup", function () {
		return {
			restrict: "EA",
			replace: true,
			scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
			templateUrl: "popover-html-unsafe-popup.html",
			controller: function ($scope, $resource, $window, $filter, $q, $injector) {
			}
		};
	})
	app.directive("popoverHtmlUnsafe", ["$tooltip", function ($tooltip) {
		return $tooltip("popoverHtmlUnsafe", "popover", "click");
	}]);
