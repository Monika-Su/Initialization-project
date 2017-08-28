'use strict';

// app.controller('recommendItemCtrl', function ($scope, $window, $q, $upload, ngTableParams, CommonService, ItemGroupService, ItemService, ValidateService) {
app.controller('recommendItemCtrl', recommendItemCtrl);

recommendItemCtrl.$inject = ['$scope', '$window', '$q', '$upload', 'ngTableParams', 'CommonService', 'ItemGroupService', 'ItemService', 'ValidateService'];

function recommendItemCtrl($scope, $window, $q, $upload, ngTableParams, CommonService, ItemGroupService, ItemService, ValidateService){

    // Loading animation
    $scope.isLoading = true;
    $scope.isLoadingItemList = false;

    // data from API
    $scope.tempItemGroupList = null;
    $scope.tempItemList = null;

    // panel show and hide
    $scope.isShowItemGroup = false;

    // container object
    $scope.itemGroupContainer = null;
    $scope.currentItemGroup = {
        "itemGroupId": "",
        "itemGroupName": ""
    };
    $scope.detailVOContainer = [];

    // for init and search object
    var vo = {
        "displayType": null,
        "name": null
    };

    $scope.items = { code: null, name: null, grouping: null, category: null };


    $scope.displayTypes = [
        { "name": "RANDOM" },
        { "name": "SCORE_ASC" },
        { "name": "SCORE_DESC" },
        { "name": "AUTO" }
    ];

    // init object
    $scope.initItemGroupObj = {
        "displayType": "RANDOM",
        "itemGroupDetailVOs": [],
        "itemGroupId": null,
        "memo": "",
        "name": "",
        "status": "UNUSED"
    };

    $scope.initItemUnit = {
        "itemGroupDetailId": null,
        "itemId": 0,
        "itemName": "",
        "score": 0
    };

    initTable(vo);


    $scope.isEditItemGroup = function (flag, model) {
        $scope.items = { code: null, name: null, grouping: null, category: null };
        $scope.filterChange($scope.items);
        if (flag) {
            // add or edit
            if (model.itemGroupId) {
                // edit
                ItemGroupService.getItemGroup($scope.cSite.id, model.itemGroupId).then(function (response) {
                    var data = response.data.data;
                    model = angular.copy(data);
                    mappingDetailVOContainer(model.itemGroupDetailVOs);
                    $scope.itemGroupContainer = angular.copy(model);
                });
            } else {
                // add
                mappingDetailVOContainer(model.itemGroupDetailVOs);
                $scope.itemGroupContainer = angular.copy(model);
            }
            mappingCurrentItemGroup(true, model);

            if (!$scope.tempItemList) {
                $scope.isLoadingItemList = false;
                loadItemList($scope.cSite.id, $scope.items);
            }
        } else {
            $scope.itemGroupContainer = null;
            $scope.detailVOContainer = null;
            mappingCurrentItemGroup(false);
        }
        $("html,body").animate({ scrollTop: 0 }, 700);
        $scope.isShowItemGroup = flag;
    };

    function mappingDetailVOContainer(model) {
        $scope.detailVOContainer = angular.copy(model);
    }

    function mappingCurrentItemGroup(flag, model) {
        if (flag) {
            $scope.currentItemGroup.itemGroupId = model.itemGroupId;
            $scope.currentItemGroup.itemGroupName = model.name;
        } else {
            $scope.currentItemGroup = {
                "itemGroupId": "",
                "itemGroupName": ""
            };
        }
    }

    $scope.addToList = function (model) {
        var excitedFlag = false;
        model.isExisted = true;
        for (var i = 0, item; item = $scope.detailVOContainer[i]; i++) {
            if (item.itemId === model.itemId) {
                excitedFlag = true;
                break;
            }
        }
        if (!excitedFlag) {
            var newItem = {
                "itemGroupDetailId": model.itemGroupId ? model.itemGroupId : null,
                "itemId": model.itemId,
                "itemName": model.name,
                "score": 0
            };
            $scope.detailVOContainer.push(newItem);
        }
    };

    $scope.removeFromList = function (itemId, idx) {
        for (var i = 0, item; item = $scope.detailVOContainer[i]; i++) {
            if (item.itemId === itemId) {
                $scope.detailVOContainer.splice(idx, 1);
                break;
            }
        }
    };

    $scope.saveItemGroup = function (itemGroup, itemGroupDetailVO) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.recommendItem.list.name"], [itemGroup.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        } else if (checkDuplicateName($scope.tempItemGroupList, itemGroup)) {
            alert("[" + i18n.t("icem.recommendItem.list.name") + "] "
                + i18n.t("icem.duplicate"));
            deferred.reject("Fail");
            return deferred.promise;
        } else if (itemGroupDetailVO.length === 0) {
            alert(i18n.t("icem.recommendItem.no.recommendItem"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        var finalItemGroup = mappingItemDetailVO(itemGroup, itemGroupDetailVO);

        ItemGroupService.saveItemGroup($scope.cSite.id, finalItemGroup).then(function (response) {
            $scope.itemGroupTableParams.reload();
            $scope.isEditItemGroup(false);
            deferred.resolve("Success : saveItemGroup");
        });

        return deferred.promise;
    };

    $scope.deleteItemGroup = function (id) {
        var deleteObj = {
            serviceApi: "ItemGroupService",
            deleteApi: "deleteItemGroup",
            siteId: $scope.cSite.id,
            id: id
        };
		CommonService.deleteItem(deleteObj).then(function(){
            $scope.itemGroupTableParams.reload();
            $scope.isEditItemGroup(false);
        });
    };

    function mappingItemDetailVO(itemGroup, itemGroupDetailVO) {
        itemGroup.itemGroupDetailVOs = angular.copy(itemGroupDetailVO);
        return itemGroup;
    }

    function checkDuplicateName(list, model) {
        var isFindFlag = false;
        angular.forEach(list, function (m) {
            if(!isFindFlag){
                if (m.name == model.name && m.itemGroupId != model.itemGroupId) {
                    isFindFlag = true;
                }
            }
        });
        return isFindFlag;
    }

    function initTable(model) {
        $scope.itemGroupTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {

                    ItemGroupService.saveItemGroupList($scope.cSite.id, params.count(), params.page() - 1, model).then(function (response) {
                        var data = response.data.data.content;
                        $scope.isLoading = false;
                        params.total(response.data.data.totalElements);

                        if (params.page() > 1 && (!data || data.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $scope.tempItemGroupList = angular.copy(data);
                            $defer.resolve(data);
                        }
                    });

                }
            });
    }

    function loadItemList(siteId, itmesObj) {
        $scope.itemListTableParams = new ngTableParams({
            page: 1,
            count: 7
        }, {
                total: 0,
                counts: [],
                getData: function ($defer, params) {

                    ItemService.getItemList(siteId, params.count(), params.page() - 1, itmesObj).then(function (response) {
                        var data = response.data.data;
                        $scope.isLoadingItemList = false;
                        params.total(data.totalElements);

                        if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $scope.tempItemList = angular.copy(data.content);
                            $defer.resolve(data.content);
                        }
                    });

                }
            });
    }

    $scope.filterChange = function (items) {
        items.code = (items.code != "") ? items.code : null;
        items.name = (items.name != "") ? items.name : null;
        items.grouping = (items.grouping != "") ? items.grouping : null;
        items.category = (items.category != "") ? items.category : null;
        loadItemList($scope.cSite.id, items);
    };
};
