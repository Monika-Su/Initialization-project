'use strict';

app.controller('memberCtrl', memberCtrl);

memberCtrl.$inject = ['$scope', '$window', '$upload', '$filter', '$q', 'ngTableParams', 'CommonService', 'MemberService', 'ValidateService'];

function memberCtrl($scope, $window, $upload, $filter, $q, ngTableParams, CommonService, MemberService, ValidateService) {


    // Loading animation
    $scope.isLoading = true;

    // panel show and hide
    $scope.isShowMember = false;

    // data from API
    $scope.tempMemberList = null;
    $scope.backupMemberList = null;
    $scope.attributeList = [];
    $scope.memberDetail = {};
    $scope.attributeValueList = [];

    // bind to view
    $scope.displayAttrList = [];
    $scope.mappingAttrList = [];

    // for init and search object
    $scope.memberFilter = { name: null, phoneNumber: null, email: null, accountName: null, memberBinding: null };

    // flag
    var attrApiFlag = false;
    var memberApiFlag = false;

    loadMemberListTable($scope.cSite.id, $scope.memberFilter);

    $scope.getTitle = function (key) {
        return i18n.t(key);
    };

    $scope.attrIdFilter = function (actual, expected) {
        // auto transform number and string
        return actual == expected;
    };

    $scope.filterMember = function () {
        loadMemberListTable($scope.cSite.id, $scope.memberFilter);
    };

    $scope.cancelSaveMember = function (model) {
        var cusListBackup = angular.copy(model.customerValues);
        for (var i = 0, item; item = $scope.backupMemberList[i]; i++) {
            if (item.memberId === model.memberId) {
                $scope.tempMemberList[i] = angular.copy(item);
                break;
            }
        }
    };

    $scope.editMember = function (model) {
        $scope.editMemberDataObj = angular.copy(model);
        model.$$edit = true;
    };

    $scope.newMember = function () {
        if ($scope.newModal) {
            $scope.newModal.memberId = null;
            $scope.newModal.name = "";
            $scope.newModal.phoneNumber = "";
            $scope.newModal.email = "";
            $scope.newModal.accountName = "";
            $scope.newModal.allPoints = 0;
            $scope.newModal.availablePoints = 0;
        }
        $scope.isShowMember = true;
    };

    $scope.closeMember = function (id) {
        $scope.isShowMember = false;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.saveMember = function (model) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.member.name", "icem.member.phone", "icem.member.email", "icem.member.account"], [model.name, model.phoneNumber, model.email, model.accountName])) {
            deferred.reject("Fail - ValidateService");
        } else if (!CommonService.isNumber(model.availablePoints)) {
            alert("[" + i18n.t("icem.member.remain.point") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else if (!CommonService.isNumber(model.allPoints)) {
            alert("[" + i18n.t("icem.member.total.point") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else if (parseInt(model.allPoints) < parseInt(model.availablePoints)) {
            alert("[" + i18n.t("icem.member.remain.point") + "] "
                + i18n.t("icem.larger") + " [" + i18n.t("icem.member.total.point") + "]");
            deferred.reject("Fail");
        } else {
            MemberService.saveMember($scope.cSite.id, model).then(function (response) {
                if (!response) {
                    deferred.reject("Fail");
                    return deferred.promise
                };
                deferred.resolve("Success");
                var data = response.data.data;
                $scope.memberTableParams.reload();
                $scope.isShowMember = false;
            });
        }
        return deferred.promise;
    };



    $scope.updateMember = function (model) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.member.name", "icem.member.phone", "icem.member.email", "icem.member.account"], [model.name, model.phoneNumber, model.email, model.accountName])) {
            deferred.reject("Fail - ValidateService");
        } else if (parseInt(model.allPoints) < parseInt(model.availablePoints)) {
            alert("[" + i18n.t("icem.member.remain.point") + "] "
                + i18n.t("icem.larger") + " [" + i18n.t("icem.member.total.point") + "]");
            deferred.reject("Fail");
        } else if (!CommonService.isNumber(model.availablePoints)) {
            alert("[" + i18n.t("icem.member.remain.point") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else if (!CommonService.isNumber(model.allPoints)) {
            alert("[" + i18n.t("icem.member.total.point") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else {
            model.$$edit = false;
            // var customerArr = creatcustomerValues(model);
            var dataObj = {
                memberId: model.memberId,
                name: model.name,
                phoneNumber: model.phoneNumber,
                email: model.email,
                accountName: model.accountName,
                allPoints: model.allPoints,
                availablePoints: model.availablePoints,
                customerValues: model.customerValues
            };

            MemberService.saveMember($scope.cSite.id, dataObj).then(function (response) {
                var data = response.data.data;
                $scope.memberTableParams.reload();
                $scope.isShowMember = false;
                deferred.resolve("Success");
            }).catch(function (error) {
                //Reset back to member
                deferred.reject("Fail");
                resetMember(model);
            });
        }
        return deferred.promise;
    };


    function resetMember(model) {
        model.name = $scope.editMemberDataObj.name;
        model.phoneNumber = $scope.editMemberDataObj.phoneNumber;
        model.accountName = $scope.editMemberDataObj.accountName;
        model.email = $scope.editMemberDataObj.email;
        model.allPoints = $scope.editMemberDataObj.allPoints;
        model.availablePoints = $scope.editMemberDataObj.availablePoints;
    }

    $scope.clickMember = function (memberId) {

        MemberService.getMemberDetail($scope.cSite.id, memberId).then(function (response) {
            var data = response.data.data;
            var index = data.attributes.length - 1;
            for (var i = index; i >= 0; i--) {
                var key = i18n.t(data.attributes[i].key);
                if (key) {
                    data.attributes[i].key = key;
                }
            }

            $scope.memberDetail = angular.copy(data);
            $scope.attributeList = angular.copy(data.attributes);
            $scope.scoreList = angular.copy(data.scores);
            $scope.historyItems = angular.copy(data.histories);
            $scope.recommendItems = angular.copy(data.recommendItems);
            if (data.cart) {
                $scope.cartItems = angular.copy(data.cart.cartItems);
            }
            $('#memberModal').modal('show');
        });
    };

    function loadMemberListTable(siteId, memberObj) {
        $scope.memberTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {
                    if (!$scope.cSite) return;
                    MemberService.getMemberList(siteId, params.count(), params.page() - 1, memberObj).then(function (response) {
                        var data = response.data.data;
                        memberAttrList(siteId);
                        params.total(data.totalElements);
                        $scope.tempMemberList = angular.copy(data.content);
                        $scope.isLoading = false;
                        memberApiFlag = true;
                        if (attrApiFlag && memberApiFlag) {
                            syncAttrList();
                        }
                        if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $defer.resolve(data.content);
                        }
                    });
                }
            });
    };


    var customerValueObj = function customerValueObj(originAttrObj, memberAttrObj) {
        // var arr =[];        
        var obj = {
            customAttributeId: null,
            attributeValue: null,
            valueOptionId: null
        };

        // the whole customerValues is empty array
        if (memberAttrObj === null || memberAttrObj.length === 0) {
            obj.customAttributeId = originAttrObj.attributeId;
            return obj;
        } else {
            var isExisted = true;
            for (var i = 0, item; item = memberAttrObj[i]; i++) {
                if (originAttrObj.attributeId === item.customAttributeId) {
                    if (Boolean(item.valueOptionId) && item.valueOptionId !== 0) {
                        item.valueOptionId = item.valueOptionId.toString();
                    }
                    return item;
                }
                isExisted = false;
            }
            if (!isExisted) {
                obj.customAttributeId = originAttrObj.attributeId;
                return obj;
            }
        }
    }

    function syncAttrList() {
        for (var j = 0, member; member = $scope.tempMemberList[j]; j++) {
            $scope.mappingAttrList = [];
            for (var i = 0, item; item = $scope.displayAttrList[i]; i++) {
                var obj = new customerValueObj(item, member.customerValues);
                $scope.mappingAttrList.push(obj);
            }
            $scope.tempMemberList[j].customerValues = angular.copy($scope.mappingAttrList);
            $scope.backupMemberList = angular.copy($scope.tempMemberList);
        }
    }

    function memberAttrList(siteId) {
        if (!$scope.cSite) return;
        MemberService.getMemberAttribute(siteId, 50, 0).then(function (response) {
            var data = response.data.data.content;
            attrApiFlag = true;
            $scope.displayAttrList = $filter('filter')(data, { status: true });
            if (attrApiFlag && memberApiFlag) {
                syncAttrList();
            }
        });
    };

    $scope.uploadMember = function ($batchFile) {
        var fileType;
        if ($batchFile[0].name.indexOf('.xlsx') > -1) {
            fileType = 'EXCEL';
        } else if ($batchFile[0].name.indexOf('.csv') > -1) {
            fileType = 'CSV';
        } else {
            alert(i18n.t("icem.items.UploadTypeLimit"));
            return;
        };

        if ($batchFile.length > 0) {
            $scope.upload = $upload.upload({
                url: '/api/member/bulkMembers?siteId=' + $scope.cSite.id + '&fileType=' + fileType,
                file: $batchFile[0],
                headers: { 'auth': $window.sessionStorage['token'] }
            }).progress(function (evt) {
                // console.log('progress: ' + parseInt(100.0 * evt.loaded /
                // 	evt.total) + '% file :' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                if (data.success) {
                    if (data.data.error.length === 0) {
                        var successMsg = i18n.t("icem.uploadSuccess") + ':\n';
                        angular.forEach(data.data.info, function (str) {
                            successMsg += str + '\n';
                        });
                        alert(successMsg);
                    } else {
                        var errorMsg = i18n.t("icem.uploadFail") + ':\n';
                        angular.forEach(data.data.error, function (str) {
                            errorMsg += str + '\n';
                        });
                        alert(errorMsg);
                    }
                    $scope.memberTableParams.reload();
                } else {
                    alert("icem.uploadFail");
                }
            });
        }
    };
};