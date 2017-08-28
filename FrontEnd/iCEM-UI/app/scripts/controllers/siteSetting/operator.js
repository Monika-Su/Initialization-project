'use strict';

// app.controller('operatorCtrl', function ($scope, $window, $q, ngTableParams, CommonService, OperatorService, ValidateService) {
app.controller('operatorCtrl', operatorCtrl);

operatorCtrl.$inject = ['$scope', '$window', '$q', 'ngTableParams', 'CommonService', 'OperatorService', 'ValidateService'];

function operatorCtrl($scope, $window, $q, ngTableParams, CommonService, OperatorService, ValidateService){


    // Loading animation
    $scope.isLoading = true;
    $scope.isLoadingModal = true;

    // panel show and hide
    $scope.authModal = false;

    // const
    $scope.accountId = JSON.parse($window.sessionStorage['accountId']);

    // container object
    $scope.commonAuths = [];
    $scope.selectedSiteId = $scope.cSite.id;
    var currentSite, currentOperatorId, tempAuthList;

    reloadOperator();



    // option
    $scope.authOptions = [{ name: i18n.t("NOT_AVAILABLE"), value: 'NOT_AVAILABLE' },
        { name: i18n.t("READ_ONLY"), value: 'READ_ONLY' },
        { name: i18n.t("EDITABLE"), value: 'EDITABLE' }];

    $scope.enableOptions = [{ name: i18n.t("NOT_AVAILABLE"), value: 'NOT_AVAILABLE' },
        { name: i18n.t("ENABLED"), value: "ENABLED" }];

    $scope.readOptions = [{ name: i18n.t("NOT_AVAILABLE"), value: 'NOT_AVAILABLE' },
        { name: i18n.t("READ_ONLY"), value: "READ_ONLY" }];

    $scope.newOp = function () {
        $scope.newModel = {
            email: null,
            id: null,
            lastLoginDate: null,
            loginId: null,
            name: null,
            operatorAuthorities: [],
            operatorSettings: {},
            owningAccountId: null,
            owningOperatorId: null,
            owningOperatorName: null,
            relatedOwners: [],
            status: "ENABLED"
        };
        $scope.newPassword = null;
        $scope.showAddContractor = true;
        $scope.authModal = false;
    };

    $scope.closeOp = function () {
        $scope.showAddContractor = false;
        $scope.newPassword = null;
    };

    $scope.editOp = function (model) {
        $scope.newModel = angular.copy(model);
        $scope.newPassword = null;
        $scope.showAddContractor = true;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.deleteOp = function (model) {
        var deleteObj = {
            serviceApi: "OperatorService",
            deleteApi: "deleteOperator",
            siteId: null,
            id: model.id
        };
        CommonService.deleteItem(deleteObj).then(function () {
            $scope.operatorTableParams.reload();
        });
    };

    $scope.regeneratePwd = function (model) {
        $scope.newPassword = "";
        $scope.currentOploginId = model.loginId;
        var resetRc = $window.confirm(i18n.t("icem.resetPassword.confirm"));
        if (resetRc) {
            OperatorService.saveOperatorRegeneratePwd(model.id).then(function (response) {
                var data = response.data;
                $("#passwordModal").modal("show");
                $scope.newPassword = data.data.newPassword;
            });
        }
    };

    $scope.authOp = function (model) {
        $scope.closeOp();
        if (!$scope.cSite.id) {
            return;
        }
        $("html,body").animate({ scrollTop: 0 }, 700);
        $scope.selectedSiteId = $scope.cSite.id;
        $scope.authModal = true;
        currentOperatorId = model.id;
        $scope.currentOploginId = model.loginId;

        OperatorService.getOperatorSiteSetting(currentOperatorId).then(function (response) {
            var data = response.data;
            tempAuthList = angular.copy(data.data.siteSettings);
            for (var prop in tempAuthList) {
                if (prop == $scope.cSite.id) {
                    $scope.currentSiteObj = tempAuthList[prop];
                    $scope.commonAuths = $scope.currentSiteObj.siteFunctions;
                    break;
                }
            }
            $scope.isLoadingModal = false;
        });
    };

    $scope.saveAuth = function () {
        var deferred = $q.defer();
        applyToSites();
        var saveObj = { siteSettings: tempAuthList };
        OperatorService.saveOperatorSiteSetting(currentOperatorId, saveObj).then(function () {
            deferred.resolve("Success");
            $scope.authModal = false;
            $("html,body").animate({ scrollTop: 0 }, 700);
        });
        return deferred.promise;
    };

    function applyToSites() {
        for (var i = 0, item; item = $scope.siteList[i]; i++) {
            if (item.hasOwnProperty('apply')) {
                if (item['apply'] == true) {
                    tempAuthList[item.id].siteFunctions = angular.copy($scope.commonAuths);
                }
            }
        }
    };

    $scope.selectAllSites = function (flag) {
        for (var i = 0, item; item = $scope.siteList[i]; i++) {
            item['apply'] = flag;
        }
    };

    $scope.saveOp = function (model) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.operator.userName", "icem.name"], [model.loginId, model.name])) {
            deferred.reject("Fail - ValidateService");
        } else {
            OperatorService.saveOperator(model).then(function (response) {
                if (!response) {
                    deferred.reject("Fail");
                    return deferred.promise;
                };
                var data = response.data;
                deferred.resolve("Success");
                if (model.id === null) {
                    // add new Operator
                    $scope.newPassword = data.data;
                } else {
                    // edit existed Operator
                    $scope.showAddContractor = false;
                }
                reloadOperator();
            });
        }
        return deferred.promise;
    };

    function reloadOperator() {
        if ($scope.operatorTableParams) {
            $scope.operatorTableParams.reload();
        } else {
            $scope.operatorTableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10
            }, {
                    total: 0,           // length of data
                    getData: function ($defer, params) {
                        OperatorService.getOperator().then(function (response) {
                            var data = response.data.data;
                            $scope.isLoading = false;
                            $scope.contentCount = data.content.length;
                            params.total(data.content.length);

                            if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                                params.page(params.page() - 1);
                            } else {
                                $defer.resolve(data.content.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                    }
                });
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
