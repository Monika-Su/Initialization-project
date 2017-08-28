'use strict';

app.controller('planCtrl', planCtrl);

planCtrl.$inject = ['$scope', '$timeout', '$q', '$window', '$filter', 'ngTableParams', 'PlanService', 'ValidateService', 'CommonService'];

function planCtrl($scope, $timeout, $q, $window, $filter, ngTableParams, PlanService, ValidateService, CommonService) {

    // Loading animation
    $scope.isLoading = true;
    $scope.isLoadingDetail = true;
    $scope.isLoadingChart = true;

    // data from API
    $scope.tempPlanList = null;
    $scope.mediaList = null;
    $scope.categoryList = null;
    $scope.tempPlanChart = null;

    // panel show and hide
    $scope.isShowPlanDetail = false;
    $scope.isShowPlanChart = false;

    // container object
    $scope.planDetailContainer = null;
    $scope.unitContainer = null;
    $scope.currentPlanContainer = { name: '' };

    // C3 chart
    var chart = null;
    var c3padding = {
        right: 10,
        bottom: 5
    };


    // Init object
    var vo = {
        "name": null
    };

    $scope.initPlanDetailObj = {
        "memo": "",
        "name": "",
        "planId": null,
        "categoryId": null,
        "planItemVOs": [],
        "totalbudget": 0
    };

    var unit = {
        "mediaId": null,
        "memo": "",
        "planItemId": null,
        "price": null,
        "threshold": null
    };


    //init the page
    loadCategoryList().then(function (response) {
        initTable(vo);
    });

    $scope.isEditPlanDetail = function (flag, model) {
        if (flag) {
            $scope.isEditPlanChart(false);
            // add or edit
            if (!model.planId) {
                // add new
                $scope.planDetailContainer = angular.copy(model);
                $scope.planDetailContainer.categoryId = $scope.categoryList[0].categoryId;
                $scope.isShowPlanDetail = flag;
                loadMediaList().then(function () {
                    mappingMediaList();
                    $scope.isLoadingDetail = false;
                    reloadMediaDropdown();
                });
            } else {
                // edit existed one
                loadPlanDetail(model.planId).then(function () {
                    loadMediaList().then(function () {
                        mappingMediaList();
                        reloadMediaDropdown();
                        $scope.isShowPlanDetail = flag;
                        $scope.isLoadingDetail = false;
                    });
                });
            }
        } else {
            // close panel and clean up container
            $scope.planDetailContainer = null;
            $scope.unitContainer = null;
            $scope.isLoadingDetail = true;
            $scope.isShowPlanDetail = flag;
        }
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.changeUnitContainer = function (model) {
        for (var i = 0; i < $scope.mediaList.length; i++) {
            if ($scope.mediaList[i].mediaId == $scope.unitContainer.mediaId) {
                $scope.unitContainer.price = $scope.mediaList[i].defaultPrice ? $scope.mediaList[i].defaultPrice : 0;
                $scope.unitContainer.threshold = $scope.mediaList[i].defaultThreshold ? $scope.mediaList[i].defaultThreshold : 0;
                break;
            }
        }
    };

    // $scope.reloadMediaDropdown = reloadMediaDropdown;
    function reloadMediaDropdown() {
        initUnitContainer();
        var notUsedMediaList = $filter('filter')($scope.mediaList, { isUsed: false }, true);
        if (notUsedMediaList[0]) {
            $scope.unitContainer.mediaId = notUsedMediaList[0].mediaId ? notUsedMediaList[0].mediaId : null;
            $scope.unitContainer.price = notUsedMediaList[0].defaultPrice ? notUsedMediaList[0].defaultPrice : 0;
            $scope.unitContainer.threshold = notUsedMediaList[0].defaultThreshold ? notUsedMediaList[0].defaultThreshold : 0;
        }
    }

    $scope.savePlanDetail = function (model) {
        var deferred = $q.defer();

        if (ValidateService.isEmptyInput(["icem.campaignPlan.name", "icem.campaignPlan.category", "icem.campaignPlan.totalBudget"], [model.name, model.categoryId, model.totalbudget])) {
            deferred.reject("Fail");
            return deferred.promise;
        }
        if (model.planItemVOs.length === 0) {
            alert("[" + i18n.t("icem.campaignPlan.list") + "] "
                + i18n.t("icem.no.data"));
            deferred.reject("Fail");
            return deferred.promise;
        }
        PlanService.savePlanDetail($scope.cSite.id, model).then(function (response) {
            $scope.planTableParams.reload();
            $scope.isEditPlanDetail(false);
            $("html,body").animate({ scrollTop: 0 }, 700);
            deferred.resolve("Success");
        });
        return deferred.promise;
    };

    $scope.editUnit = function (model) {
        model.$$backup = angular.copy(model);
    };

    $scope.cancelSaveUnit = function (model, idx) {
        $scope.planDetailContainer.planItemVOs[idx].price = model.$$backup.price;
        $scope.planDetailContainer.planItemVOs[idx].$$edit = false;
    };

    $scope.deleteUnit = function (idx, mediaId) {
        $scope.planDetailContainer.planItemVOs.splice(idx, 1);
        mappingUnit(mediaId, false);
        reloadMediaDropdown();
    };

    function mappingUnit(id, flag) {
        // $scope.mediaList.map(obj => {
        //     if (obj.mediaId == id) {
        //         obj.isUsed = flag;
        //     }
        // });
        $scope.mediaList.map(function (obj) {
            if (obj.mediaId == id) {
                obj.isUsed = flag;
            }
            return obj;
        });
    }

    $scope.isAllUsed = function () {
        var flag = true;
        for (var i = 0; i < $scope.mediaList.length; i++) {
            if ($scope.mediaList[i].isUsed === false) {
                flag = false;
                break;
            }
        }
        return flag;
    };


    $scope.saveUnit = function (model) {
        if (ValidateService.isEmptyInput(["icem.campaignPlan.media", "icem.campaignPlan.price", "icem.campaignPlan.threshold"], [model.mediaId, model.price, model.threshold])) {
            return;
        }
        if (model.threshold <= 0 || model.threshold > 1) {
            alert(i18n.t("icem.campaignPlan.threshold.alert"));
            return;
        }

        if ($scope.planDetailContainer.planItemVOs.length > 0) {
            if (sumLessThenOne(model)) {
                alert(i18n.t("icem.campaignPlan.threshold.sumAlert"));
                return;
            }
        }

        if (model.$$backup) {
            // edit existed one
            model.$$edit = false;
        } else {
            // add new one
            mappingUnit(model.mediaId, true);
            $scope.planDetailContainer.planItemVOs.push(model);
        }
        reloadMediaDropdown();
    };

    function sumLessThenOne(model) {
        var numArray = $scope.planDetailContainer.planItemVOs.filter(function (obj) {
            return obj.mediaId !== model.mediaId;
        })
            // .map(obj => obj.threshold);
            .map(function (obj) { return obj.threshold });

        if (numArray.length > 0) {
            var currentSum = numArray.reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
            });
            return currentSum + model.threshold > 1;
        } else {
            return false;
        }
    }

    function initUnitContainer() {
        $scope.unitContainer = angular.copy(unit);
    }

    $scope.isEditPlanChart = function (flag, model) {
        mappingCurrentPlan(model);
        if (flag) {
            $scope.isEditPlanDetail(false);
            loadPlanChart(model.planId).then(function (response) {
                $scope.tempPlanChart = response;
                // var mediaArr = ['x'].concat($scope.tempPlanChart.map(obj => obj.name));
                var mediaArr = ['x'].concat($scope.tempPlanChart.map(function (obj) { return obj.name }));
                // var resultArr = [i18n.t("icem.campaignPlan.distribution")].concat($scope.tempPlanChart.map(obj => obj.calcResult));
                var resultArr = [i18n.t("icem.campaignPlan.distribution")].concat($scope.tempPlanChart.map(function (obj) { return obj.calcResult }));
                generateMediaChart(mediaArr, resultArr);
                $scope.isLoadingChart = false;
            });
        } else {
            $scope.isLoadingChart = true;
            $scope.tempPlanChart = null;
            $scope.currentPlanContainer.name = '';
        }
        $scope.isShowPlanChart = flag;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    function mappingCurrentPlan(model) {
        $scope.currentPlanContainer.name = model ? model.name : '';
    }

    //==================================== d3 chart ========================================= S

    function generateMediaChart(mediaArr, resultArr) {
        if (chart) {
            chart = null;
        }
        chart = c3.generate({
            padding: c3padding,
            bindto: '#planChart',
            data: {
                x: 'x',
                columns: [mediaArr, resultArr],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                }
            },
            bar: {
                width: {
                    ratio: 0.2
                }
            }
        });
    }

    //==================================== d3 chart ========================================= END

    $scope.deletePlan = function (id) {
        var deleteObj = {
            serviceApi: "PlanService",
            deleteApi: "deletePlan",
            siteId: $scope.cSite.id,
            id: id
        };
        CommonService.deleteItem(deleteObj).then(function () {
            $scope.planTableParams.reload();
            $scope.isEditPlanDetail(false);
            $scope.isEditPlanChart(false);
        });
    };

    function loadPlanChart(planId) {
        var deferred = $q.defer();
        if (!$scope.cSite) {
            deferred.reject("Fail - getPlanChart");
            return deferred.promise;
        }
        PlanService.getPlanChart($scope.cSite.id, planId).then(function (response) {
            var data = response.data.data;
            $scope.isLoadingChart = true;
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function loadPlanDetail(planId) {
        var deferred = $q.defer();
        if (!$scope.cSite) {
            deferred.reject("Fail - getPlanDetail");
            return deferred.promise;
        }
        PlanService.getPlanDetail($scope.cSite.id, planId).then(function (response) {
            var data = response.data.data;
            deferred.resolve("Success - getPlanDetail");
            $scope.planDetailContainer = angular.copy(data);
        });
        return deferred.promise;
    }

    $scope.changeCategory = function () {
        loadMediaList().then(function () {
            mappingMediaList();
            $scope.isLoadingDetail = false;
            reloadMediaDropdown();
        });
    };


    function loadMediaList() {
        var deferred = $q.defer();
        if (!$scope.cSite) {
            deferred.reject("Fail - getMediaList");
            return deferred.promise;
        }
        // if ($scope.mediaList && $scope.mediaList.length > 0) {
        //     deferred.resolve("Success - mediaList existed");
        //     return deferred.promise;
        // }
        PlanService.getMediaList($scope.cSite.id, $scope.planDetailContainer.categoryId).then(function (response) {
            var data = response.data.data;
            deferred.resolve("Success - getMediaList");
            $scope.mediaList = angular.copy(data);
        });
        return deferred.promise;
    }

    function loadCategoryList() {
        var deferred = $q.defer();
        if (!$scope.cSite) {
            deferred.reject("Fail - getCategoryList");
            return deferred.promise;
        }
        if ($scope.categoryList && $scope.categoryList.length > 0) {
            deferred.resolve("Success - categoryList existed");
            return deferred.promise;
        }
        PlanService.getCategoryList($scope.cSite.id).then(function (response) {
            var data = response.data.data;
            deferred.resolve("Success - getCategoryList");
            $scope.categoryList = angular.copy(data);
        });
        return deferred.promise;
    }

    function mappingMediaList() {
        if ($scope.planDetailContainer.planItemVOs.length > 0) {
            // var usedMedia = $scope.planDetailContainer.planItemVOs.map(obj => obj.mediaId);
            var usedMedia = $scope.planDetailContainer.planItemVOs.map(function (obj) { return obj.mediaId });
            // $scope.mediaList.map(obj => {
            //     if (usedMedia.indexOf(obj.mediaId) > -1) {
            //         obj.isUsed = true;
            //     } else {
            //         obj.isUsed = false;
            //     }
            // });
            $scope.mediaList.map(function (obj) {
                if (usedMedia.indexOf(obj.mediaId) > -1) {
                    obj.isUsed = true;
                } else {
                    obj.isUsed = false;
                }
                return obj;
            });
        } else {
            // $scope.mediaList.map(obj => {
            //     obj.isUsed = false;
            // });
            $scope.mediaList.map(function(obj){
                obj.isUsed = false;
                return obj;
            });
        }
    }

    function initTable(model) {
        $scope.planTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {

                    PlanService.savePlanList($scope.cSite.id, model, params.count(), params.page() - 1).then(function (response) {
                        var data = response.data.data.content;
                        $scope.isLoading = false;
                        params.total(response.data.data.totalElements);

                        if (params.page() > 1 && (!data || data.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $scope.tempPlanList = angular.copy(data);
                            $defer.resolve(data);
                        }
                    });

                }
            });
    }
};