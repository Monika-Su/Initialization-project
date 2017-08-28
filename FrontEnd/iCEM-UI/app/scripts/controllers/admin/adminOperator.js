'use strict';

app.controller('adminOperatorCtrl', adminOperatorCtrl);

adminOperatorCtrl.$inject = ['$scope', '$window', '$q', 'ngTableParams', 'CommonService', 'AdminService', 'ValidateService'];

function adminOperatorCtrl($scope, $window, $q, ngTableParams, CommonService, AdminService, ValidateService){


    // Loading animation
    $scope.isLoading = true;

    // panel show and hide
    $scope.showEditOperator = false;

    // container object
    $scope.newPassword = "";

    initPage();

    function initPage(){
        $("#page-wrapper").css('margin-left', '0px');
        AdminService.getEditOperatorList().then(function (response) {
            $scope.cList = response.data.data;
        });
        loadOperatorTable();
    }

    function loadOperatorTable(){
        $scope.operatorTableParams = new ngTableParams({
            page: 1,
            count: 20
        }, {
                total: 0,
                getData: function ($defer, params) {

                    AdminService.getOperatorList(params.page() - 1).then(function (response) {
                        var data = response.data.data;
                        $scope.opCount = data.totalElements;
                        params.total(data.totalElements);
                        if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $defer.resolve(data.content);
                        }
                        $scope.isLoading = false;
                    });
                }
            });
    }

    $scope.editOp = function (model) {
        $scope.selectedContractor = null
        var isFindFlag = false;
        angular.forEach($scope.cList, function (c) {
            if (!isFindFlag) {
                if (model.owningOperatorName == c.loginId) {
                    $scope.selectedContractor = c;
                    isFindFlag = true;
                }
            }
        });
        $scope.newModel = angular.copy(model);
        $scope.showEditOperator = true;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.closeOperatorPanel = function () {
        $scope.showEditOperator = false;
    };

    $scope.unlock = function (model) {
        var lockoutRc = $window.confirm(i18n.t('icem.lockout.confirm'));
        if (lockoutRc) {
            AdminService.upOperatorLockout(model).then(function (response) {
                $scope.operatorTableParams.reload();
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

    $scope.saveOp = function (model) {
        if (ValidateService.isEmptyInput(["icem.operator.userName", "icem.operator.userName", "icem.name"], [model.loginId, model.name, model.owningOperatorName])) {
        } else {

            if (model.id) {
                $scope.showEditOperator = false;
                model.owningOperatorName = $scope.selectedContractor.loginId;
                for (var i = 0; i < $scope.cList.length; i++) {
                    if ($scope.cList[i].loginId == model.owningOperatorName) {
                        model.owningOperatorId = $scope.cList[i].id;
                    }
                }
                AdminService.saveOperator(model).then(function (response) {
                    var data = response.data;
                    if (!data.success) {
                        alert("saveOperator fail !");
                    }
                    $scope.operatorTableParams.reload();
                });
            }
        }
    };

};


