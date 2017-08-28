'use strict';

app.controller('scoreRuleCtrl', scoreRuleCtrl);

scoreRuleCtrl.$inject = ['$scope', '$window', '$q', '$upload', 'ngTableParams', 'CommonService', 'ScoreService', 'ValidateService'];

function scoreRuleCtrl($scope, $window, $q, $upload, ngTableParams, CommonService, ScoreService, ValidateService){

    // Loading animation
    $scope.isLoading = true;

    // data from API
    $scope.tempScoreRuleList = null;

    // panel show and hide
    $scope.isShowScoreRule = false;

    // container object
    $scope.scoreRuleContainer = null;
    initTabSet();
    function initTabSet() {
        $scope.scheduleContainer = {
            "day": [],
            "endDate": null,
            "fromHour": null,
            "month": [],
            "startDate": null,
            "toHour": null,
            "week": []
        };

        $scope.requestContainer = {
            "page": null,
            "pageOperator": null,
            "url": null,
            "urlOperator": null,
            "urlParams": []
        };
        $scope.referrerContainer = {
            "referPage": null,
            "referPageOperator": null,
            "referSite": null,
            "referSiteOperator": null
        };
    }
    // operator
    $scope.rewardCalcOperatorList = [
        "ADD",
        "MINUS",
        "SET"
    ];

    // for init and search object
    var vo = {
        "name": null,
        "status": null
    };

    var initScheduleObj = {
        "startDate": null,
        "endDate": null,
        "fromHour": null,
        "toHour": null,
        "month": [],
        "week": [],
        "day": []
    };

    $scope.initScoreRuleObj = {
        "id": null,
        "memo": "",
        "name": "",
        "dateAttr": {},
        "referrer": {},
        "request": {},
        "memberAttrs": [],
        "rewardCalcOperator": "ADD",
        "rewardCalcValue": 0,
        "status": "DRAFT"
    };

    // member attribute directive
    $scope.attributeContainer = [];

    $scope.attributeList = [];

	// Options
	$scope.numericOperator = [
		"EQUAL",
		"NOT_EQUAL",
		"GREATER_OR_EQUAL",
		"GREATER_THAN",
		"LESS_OR_EQUAL",
		"LESS_THAN"
    ];

	$scope.optionOperator = [
		"EQUAL",
		"NOT_EQUAL",
	];

    // init the page
    initTable(vo);
    $scope.selectRuleTab = function (tab) {
        $scope.ruleTab = tab;
    };
    loadMemberAttribute();

    $scope.isEditScoreRule = function (flag, model) {
        if (flag) {
            // add or edit
            if (!model.id) {
                // add new
                $scope.scoreRuleContainer = angular.copy(model);
                initTabSet();
                $scope.isShowScoreRule = flag;
            } else {
                // edit existed one
                loadScoreRule(model.id).then(function () {
                    $scope.isShowScoreRule = flag;
                });
            }
            // init tabSet
            // $scope.ruleTab = 'schedule';
        } else {
            // close panel and clean up container
            $scope.scoreRuleContainer = null;
            $scope.isShowScoreRule = flag;
        }
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    function loadMemberAttribute() {
        if (!$scope.cSite) return;
        if ($scope.attributeList.length > 0) {
            return;
        }
        ScoreService.getAttributes($scope.cSite.id).then(function (response) {
            var data = response.data.data;
            $scope.attributeList = angular.copy(data);
        });
    }

    $scope.saveScoreRule = function (model) {
        var deferred = $q.defer();
        model.dateAttr = angular.copy($scope.scheduleContainer);
        model.request = angular.copy($scope.requestContainer);
        model.referrer = angular.copy($scope.referrerContainer);
        model.memberAttrs = angular.copy($scope.attributeContainer);

       if (ValidateService.isEmptyInput(["icem.score.rule.name"], [model.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        } else if (!model.rewardCalcOperator || !model.rewardCalcValue) {
            alert("[" + i18n.t("icem.score.rule.rewards") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
            return deferred.promise;
        } else if (ValidateService.isEmptyDateAttr(model)) {
            deferred.reject("Fail - isEmptyDateAttr");
            return deferred.promise;
        } else if (ValidateService.isEmptyRequest(model)) {
            deferred.reject("Fail - isEmptyRequest");
            return deferred.promise;
        } else if (ValidateService.isEmptyReferrer(model)) {
            deferred.reject("Fail - isEmptyReferrer");
            return deferred.promise;
        }
        // else if (ValidateService.isEmptyAll()){
        //     alert('must have one condition');
        //     deferred.reject("Fail - isEmptyAll");
        //     return deferred.promise;
        // }

        model.rewardCalcValue = +model.rewardCalcValue;
        ScoreService.saveScoreRule($scope.cSite.id, model).then(function () {
            $scope.isEditScoreRule(false);
            $scope.scoreRuleTableParams.reload();
            $("html,body").animate({ scrollTop: 0 }, 700);
            deferred.resolve("Success");

            // clean the memberAttrs in directive
            $scope.attributeContainer = [];
        });
        return deferred.promise;
    };

    function initTable(model) {
        $scope.scoreRuleTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {

                    ScoreService.saveScoreRuleList($scope.cSite.id, model, params.count(), params.page() - 1).then(function (response) {
                        var data = response.data.data.content;
                        $scope.isLoading = false;
                        params.total(response.data.data.totalElements);

                        if (params.page() > 1 && (!data || data.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $scope.tempScoreRuleList = angular.copy(data);
                            $defer.resolve(data);
                        }
                    });

                }
            });
    }

    function loadScoreRule(scoreRuleId) {
        var deferred = $q.defer();

        ScoreService.getScoreRule($scope.cSite.id, scoreRuleId).then(function (response) {
            var data = response.data.data;
            $scope.scoreRuleContainer = angular.copy(data);
            $scope.scheduleContainer = angular.copy($scope.scoreRuleContainer.dateAttr || $scope.scheduleContainer);
            $scope.requestContainer = angular.copy($scope.scoreRuleContainer.request || $scope.requestContainer);
            $scope.referrerContainer = angular.copy($scope.scoreRuleContainer.referrer || $scope.referrerContainer);
            $scope.attributeContainer = angular.copy($scope.scoreRuleContainer.memberAttrs || []);
            deferred.resolve("Success - getScoreRule");
        }).catch(function (err) {
            deferred.reject("Fail - getScoreRule ", err);
        });
        return deferred.promise;
    }

    $scope.deleteScoreRule = function (id) {
        var deleteObj = {
            serviceApi: "ScoreService",
            deleteApi: "deleteScoreRule",
            siteId: $scope.cSite.id,
            id: id
        };
		CommonService.deleteItem(deleteObj).then(function(){
            $scope.scoreRuleTableParams.reload();
        });
    };
};
