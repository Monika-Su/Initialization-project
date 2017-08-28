'use strict';

app.controller('pointRuleCtrl', pointRuleCtrl);

pointRuleCtrl.$inject = ['$scope', '$window', '$q', 'ngTableParams', 'CommonService', 'PointService', 'ValidateService'];

function pointRuleCtrl($scope, $window, $q, ngTableParams, CommonService, PointService, ValidateService) {

    // Loading animation
    $scope.isLoading = true;

    // panel show and hide
    $scope.isShowPointDetail = false;


    // UI container object
    $scope.pointRuleContainer = null;

    // data from API
    $scope.tempPointRuleList = null;

    // option
    $scope.pointRuleType = [
        { name: "ACCUMULATION_PERCENT" },
        { name: "REDUCE_PERCENT" }
    ];

    $scope.channels = [
        { name: "ADMIN" },
        { name: "WECHAT" },
        { name: "PC" }
    ];

    // init object
    $scope.initPointRuleObj = {
        "channel": $scope.channels[0].name,
        "endDate": "",
        "id": null,
        "name": "",
        "percentage": "",
        "siteId": null,
        "startDate": "",
        "status": "DEACTIVATED",
        "type": "ACCUMULATION_PERCENT"
    };

    // datepicker
    $scope.format = 'yyyy-MM-dd';
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    loadPointTable();

    $scope.isEditRule = function (model, flag) {
        if (flag) {
            if (!model.id) {
                // add new point rule
                $scope.pointRuleContainer = angular.copy(model);
            } else {
                // edit existed rule
                $scope.pointRuleContainer = angular.copy(model);
            }
        } else {
            $scope.pointRuleContainer = null;
        }
        $("html,body").animate({ scrollTop: 0 }, 700);
        $scope.isShowPointDetail = flag;
    };

    $scope.deleteRule = function (ruleId) {
        var deleteObj = {
            serviceApi: "PointService",
            deleteApi: "removePointRule",
            siteId: $scope.cSite.id,
            id: ruleId
        };
        CommonService.deleteItem(deleteObj).then(function () {
            $scope.pointTableParams.reload();
        });
    };

    function loadPointTable() {
        $scope.pointTableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
                total: 0,           // length of data
                getData: function ($defer, params) {
                    PointService.getPointRuleList($scope.cSite.id, params.count(), params.page() - 1).then(function (response) {
                        var data = response.data.data;
                        params.total(data.totalElements);
                        $scope.isLoading = false;
                        $scope.tempPointRuleList = angular.copy(data.content);
                        $defer.resolve(data.content);
                    });
                }
            });
    }

    $scope.savePointRule = function (model) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.point.rule.name", "icem.point.acc.percent.rule"], [model.name, model.percentage])) {
            deferred.reject("Fail - ValidateService");
        } else if (isNaN(model.percentage)) {
            alert("[" + i18n.t("icem.point.acc.percent.rule") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
        } else if (!model.startDate) {
            alert("[" + i18n.t("icem.startDate") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else if (!model.endDate) {
            alert("[" + i18n.t("icem.endDate") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else if (model.startDate && model.endDate && model.startDate > model.endDate) {
            alert(i18n.t("icem.items.date.compare"));
            deferred.reject("Fail");
        } else {
            PointService.savePointRule($scope.cSite.id, model).then(function () {
                $scope.pointTableParams.reload();
                $scope.isEditRule(null, false);
                deferred.resolve("Success : savePointRule");
            });
        }
        return deferred.promise;

    };
};