'use strict';

app.controller('channelConfigCtrl', channelConfigCtrl);

channelConfigCtrl.$inject = ['$scope', '$window', '$q', '$upload', 'ngTableParams', 'ChannelService', 'ValidateService'];

function channelConfigCtrl($scope, $window, $q, $upload, ngTableParams, ChannelService, ValidateService){

    // Loading animation 
    $scope.isLoading = true;

    // data from API
    $scope.tempChannelConfigList = null;

    // panel show and hide
    $scope.isShowChannelConfig = false;

    // container object
    $scope.channelConfContainer = null;
    $scope.extraConfigContainer = null;

    $scope.channelTypeList = [
        { "name": "EMAIL", isShow: true },
        { "name": "SMS", isShow: true },
    ];
        // { "name": "WEB", isShow: true }

    // init object
    $scope.initChannelConfigObj = {
        "extraConfig": {},
        "id": null,
        "memo": "",
        "name": "",
        "siteId": null,
        "type": "EMAIL"
    };

    $scope.initMailExtraObj = {
        "mailHost": "",
        "mailPasswd": "",
        "mailUser": ""
    };

    $scope.initSMSExtraObj = {
        "gatewayId": "",
        "hostname": "",
        "port": null,
        "programName": "",
        "textParamName": "",
        "toParamName": ""
    };

    initTable();

    function initTable(model) {
        $scope.channelConfigTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {
                    ChannelService.getChannelConfList($scope.cSite.id).then(function (response) {
                        var data = response.data.data;
                        $scope.isLoading = false;
                        params.total(data.length);

                        if (params.page() > 1 && (!data || data.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $scope.tempChannelConfigList = angular.copy(data);
                            $defer.resolve(data);
                            for (var i = 0; i < $scope.tempChannelConfigList.length; i++) {
                                for (var j = 0; j < $scope.channelTypeList.length; j++) {
                                    if ($scope.tempChannelConfigList[i].type === $scope.channelTypeList[j].name) {
                                        $scope.channelTypeList[j].isShow = false;
                                    }
                                }
                            }
                        }
                    });

                }
            });
    }

    $scope.changeChannelType = function (model) {
        switch (model.type) {
            case 'EMAIL':
                model.$$api = 'saveEmailConf';
                $scope.extraConfigContainer = angular.copy($scope.initMailExtraObj);
                break;
            case 'SMS':
                model.$$api = 'saveSmsConf';
                $scope.extraConfigContainer = angular.copy($scope.initSMSExtraObj);
                break;
            case 'WEB':
                break;
            default:
                console.log('switch error');
        }
    };

    $scope.isEditChannelConfig = function (flag, mainModel) {
        if (flag) {
            if (!mainModel.id) {
                // add new Channe lConfig
                $scope.channelConfContainer = angular.copy(mainModel);
                $scope.channelConfContainer.siteId = $scope.cSite.id;
                $scope.changeChannelType($scope.channelConfContainer);
            } else {
                // edit existed one
                loadChannelConfDetail(mainModel.id).then(function(response){
                    $scope.channelConfContainer = angular.copy(response);
                    $scope.changeChannelType($scope.channelConfContainer);
                    $scope.extraConfigContainer = angular.copy($scope.channelConfContainer.extraConfig);
                }).catch(function(error){
                    console.log(error);
                });
            }
        } else {
            $scope.channelConfContainer = null;
            $scope.extraConfigContainer = null;
        }
        $("html,body").animate({ scrollTop: 0 }, 700);
        $scope.isShowChannelConfig = flag;
    };

    function loadChannelConfDetail(confId) {
        var deferred = $q.defer();
        ChannelService.getChannelConfById(confId).then( function(response){
            var data = response.data.data;
            deferred.resolve(data);
        }).catch(function(error) {
            deferred.reject("Fail - ", error);
        });
        return deferred.promise;
    }

    $scope.saveChannelConfig = function (mainModel, subModel) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.name"], [mainModel.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        if (ValidateService.isEmptyInputAll("icem.channelConfig.", subModel)) {
            deferred.reject("Fail");
            return deferred.promise;
        }

        mainModel.extraConfig = angular.copy(subModel);
        ChannelService[mainModel.$$api]($scope.cSite.id, mainModel).then(function () {
            $scope.channelConfigTableParams.reload();
            $scope.isEditChannelConfig(false);
            deferred.resolve("Success - getChannelConfList");
        });
        return deferred.promise;
    };

};
