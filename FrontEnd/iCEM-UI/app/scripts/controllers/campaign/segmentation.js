'use strict';

app.controller('segmentationCtrl', segmentationCtrl);

segmentationCtrl.$inject = ['$scope', '$timeout', '$window', '$upload', '$resource', '$filter', '$q', 'ngTableParams', 'CommonService', 'ValidateService', 'RecommendService', 'RecommendSetService', 'AdsService', 'UserService', 'ItemService', 'ScoreService', 'ScheduleService', 'SiteService', 'DmpService'];

function segmentationCtrl($scope, $timeout, $window, $upload, $resource, $filter, $q, ngTableParams, CommonService, ValidateService, RecommendService, RecommendSetService, AdsService, UserService, ItemService, ScoreService, ScheduleService, SiteService, DmpService){


    $scope.getTitle = function (key) {
        return i18n.t(key);
    };

    $scope.recommendTypeList = ["USER_AUTO", "HISTORY", "ABANDONMENT", "TRANSACTION_AUTO"];
    $scope.categoryFilterType = ["IGNORE", "PRIOR_SAME", "PRIOR_OTHER", "FORCE_SAME", "FORCE_OTHER"];
    $scope.numericOperator = [
        "EQUALS",
        "NOT_EQUAL",
        "GREATER_EQUAL",
        "GREATER_THAN",
        "LESS_EQUAL",
        "LESS_THAN"
    ];

    $scope.stringTableOperator = [
        "EQUALS",
        "NOT_EQUAL",
        "CONTAINS",
        "NOT_CONTAIN",
        "STARTS_WITH",
        "NOT_START_WITH",
        "ENDS_WITH",
        "NOT_END_WITH",
    ];

    $scope.stringOperator = [
        "EQUALS",
        "NOT_EQUAL",
        "CONTAINS",
        "NOT_CONTAIN",
        "STARTS_WITH",
        "NOT_START_WITH",
        "ENDS_WITH",
        "NOT_END_WITH",
        "REGEXP"
    ];

    $scope.recommendTemplateField = [
        "code",
        "name",
        "linkUrl",
        "imageUrl",
        "price",
        "description"
    ];

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

    $scope.optionObj = [
        {
            id: 0, behaviorType: 'Frequency', behavior: {
                frequency: '',
                durationType: [{ id: 0, name: 'At any time' },
                { id: 1, name: 'During 7 days' },
                { id: 2, name: 'During 1 month' },
                { id: 3, name: 'During 3 months' },
                { id: 4, name: 'During 6 months' }]
            }
        },
        {
            id: 1, behaviorType: 'Recency', behavior: {
                durationType: [{ id: 0, name: 'During 7 days' },
                { id: 1, name: 'During 1 month' },
                { id: 2, name: 'During 3 months' },
                { id: 3, name: 'During 6 months' }]
            }
        },
        {
            id: 2, behaviorType: 'Velocity', behavior: {
                durationType: [{ id: 0, name: '7 days' },
                { id: 1, name: '1 month' },
                { id: 2, name: '3 months' },
                { id: 3, name: '6 months' }],
                operation: [{ id: 0, name: 'increased' },
                { id: 1, name: 'decreased' }],
                percentage: ''
            }
        }];

    $scope.concatenateOp = [
        "INTERSECT", "UNION", "EXCEPT"
    ];

    $scope.dataTypes = [
        { id: 0, name: 'pixel.impression' },
        { id: 1, name: 'campaignClick' },
        { id: 2, name: 'campaignView' }
    ];

    $scope.recommendDataTypes = [
        { id: 3, name: 'recommendRule' }
    ];

    //for category filter
    $scope.categoryList = {};
    //for category name and index mapping
    $scope.categoryNameMapping = [];
    $scope.userSegmentList = [];
    $scope.scheduleList = [];
    $scope.pushFiles = [];
    $scope.pushCheckboxes = { 'checked': false, items: {} };
    $scope.pushSchedule = {};

    $scope.isShowRecommendPreview = true;
    $scope.showScoreEdit = false;
    $scope.showAttributeEdit = false;
    $scope.showRuleList = true;
    $scope.showRecommendType = true;
    $scope.showProfit = false;
    $scope.showPrice = false;
    $scope.showExportResult = true;
    $scope.pushingResult = false;

    $scope.schedulerLimit = 15;
    $scope.schedulerCount = 0;
    $scope.clickSegment = null;

    $scope.auth = CommonService.getPermission();

    $scope.dayOfWeek = [null, "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    $scope.hourOfDay = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    $scope.schedulerStatus = [{ "label": "icem.scheduler.status.disable", "value": 0 }, { "label": "icem.scheduler.status.enable", "value": 1 }];
    $scope.schedulerMethod = [];
    $scope.scheduler = {};
    $scope.scheduler.method = 'DoubleClick';
    $scope.adsSegmentList = [];
    $scope.newSegmentId = null;
    $scope.selected = null;
    $scope.reloadSelectAdvertiser = reloadSelectAdvertiser;
    $scope.reloadSelectPixel = reloadSelectPixel;

    // new segmentation
    $scope.addSegmentArea = false;
    $scope.newSegmentObj = {};
    $scope.showNewPixel = false;
    $scope.tempPixelList = [];
    $scope.tempCampaignList = [];
    $scope.showOperator = false;
    $scope.newPixelObj = {};
    $scope.tempRuleList = [];
    $scope.segmentList = [];
    $scope.tempSegmentList = [];
    $scope.tempSelectedPixel = [];
    var editNewObjectIds = true;

    // isShow
    $scope.isShowSchedulerDetail = false;
    $scope.isShowExportModal = false;

    // member attribute list
    $scope.attributeList = [];

    var recommendTypeIcon =
        {
            "RULE_BASE": "fa fa-list-ul fa-fw",
            "USER_AUTO": "fa fa-user fa-fw",
            "USER_EXTERNAL": "fa fa-user-plus fa-fw",
            "ITEM_AUTO": "fa fa-gift fa-fw",
            "ITEM_EXTERNAL": "fa fa-truck fa-fw",
            "HISTORY": "fa fa-history fa-fw",
            "HISTORY_AUTO": "fa fa-magic fa-fw",
            "RANKING": "fa fa-sort-amount-desc fa-fw",
            "BUY_AFTER_VIEWING": "fa fa-credit-card fa-fw",
            "REMINDER": "fa fa-bell fa-fw",
            "ABANDONMENT": "fa fa-shopping-cart fa-fw",
            "ABANDONMENT_AUTO": "fa fa-cart-plus fa-fw",
            "TRANSACTION_AUTO": "fa fa-exchange fa-fw"
        };

    var adsSegmentUrl = "/api/ipcrm/ads/segment";
    var ruleUrl = "/api/ipcrm/ads/segment/rule";

    $scope.imTitlePreview = [{ title: "icem.import.status", width: "10%" },
    { title: "icem.recommend.ads.segment.name", width: "30%" },
    { title: "icem.memo", width: "35%" },
    { title: "icem.recommend.ads.segment.type", width: "30%" }];

    $scope.imTitlePreviewTwo = [{ title: "icem.import.status", width: "5%" },
    { title: "icem.ads.segment.rule.list", width: "10%" },
    { title: "icem.enable.status", width: "5%" },
    { title: "icem.rule.condition", width: "20%" },
    { title: "icem.recommend.rule.memo", width: "10%" }];

    var c3padding = {
        right: 10,
        bottom: 5,
        // left: 95
    };

    var chart = null;
    var ruleId = 1;
    var backupTempRule = null;
    var backupTempSegment = null;
    var backupTempObjects = null;

    // init object
    $scope.initRecomSegmentObj = {
        "dateAttr": {
            "day": [],
            "endDate": null,
            "fromHour": null,
            "month": [],
            "startDate": null,
            "toHour": null,
            "week": []
        },
        "memberAttrs": [],
        "ruleId": null,
        "ruleMemo": "",
        "ruleName": "",
        "visit": {
            "clickNum": null,
            "clickOperator": null,
            "impressionNum": null,
            "impressionOperator": null,
            "recencyNum": null,
            "recencyOperator": null
        },
    };

    // tabset container
    $scope.scoreContainer = {
        "scoreOperator": null,
        "scoreRuleId": null,
        "score": null,
        "percent": null,
        "percentOperator": null,
        "ranking": null,
        "rankingOperator": null,
        "exist": true
    };

    $scope.attributeContainer = [];

    var vo = {
        "name": null
    };

    var scoreVo = {
        "name": null,
        "status": null
    };

    var recommendContentVo = {
        "name": null,
        "status": null
    };
    $scope.recommendContentList = null;
    loadRecommendContentList(recommendContentVo);

    function loadRecommendContentList(model) {
        if (!$scope.cSite) return;
        if ($scope.recommendContentList !== null) {
            return;
        }
        RecommendService.saveRecommendList($scope.cSite.id, model, 100, 0).then(function (response) {
            var data = response.data.data.content;
            if (data.length === 0) {
                alert(i18n.t("icem.recommendSet.no.recommendContent"));
            }
            $scope.recommendContentList = angular.copy(data);
        });
    };

    ScoreService.saveScoreRuleList($scope.cSite.id, scoreVo, 200, 0).then(function (response) {
        var data = response.data.data.content;
        $scope.scoreRuleList = angular.copy(data);
    });

    function isEmpty(obj) {
        // return true if object has empty value
        var flag = false;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && obj[prop] !== null) {
                if (!obj[prop] && obj[prop] !== 0) {
                    flag = true;
                }
            }
        }
        return flag;
    }

    $scope.saveNewRule = function (model) {
        if (model.objectIds.length == 0) {
            switch (model.dataTypes) {
                case 0:
                case '0':
                    alert(i18n.t("icem.choose") + " " + i18n.t("icem.segmentation.pixel"));
                    break;
                case 1:
                case '1':
                case 2:
                case '2':
                    alert(i18n.t("icem.choose") + " " + i18n.t("icem.segmentation.campaign"));
                    break;
            }
        } else if (isEmpty(model.behavior)) {
            notCompleteAlert();
        } else {
            model.$$edit = false;
            var checkRuleList = false;
            for (var i = 0, item; item = $scope.tempRuleList[i]; i++) {
                if (model.hasOwnProperty('id')) {
                    if (item.id == model.id) {
                        item = model;
                        checkRuleList = true;
                    }
                } else if (model.hasOwnProperty('index')) {
                    if (item.index == model.index) {
                        item = model;
                        checkRuleList = true;
                    }
                }

            }
            if (checkRuleList == false) {
                var arrLength = $scope.tempRuleList.length;

                if (arrLength > 0) {
                    // last one in the tempRuleList will have null concatenateOp
                    $scope.tempRuleList[arrLength - 1].concatenateOp = $scope.concatenateOp[0];
                    // $scope.tempRuleList.splice(arrLength - 1, 0, model);
                }
                $scope.tempRuleList.push(model);
            }
            $scope.newSegmentObj.rules = $scope.tempRuleList;
            $scope.showNewPixel = false;
            $scope.newPixelObj = {};
        }
    };

    function notCompleteAlert() {
        alert("[" + i18n.t("icem.segmentation.not.complete") + "]");
    }

    $scope.tempRuleCopy = function (model) {
        for (var i = 0, item; item = $scope.tempRuleList[i]; i++) {
            if (item.hasOwnProperty('id')) {
                if (item.id != model.id && item.$$edit == true) {
                    alert(i18n.t("icem.segmentation.edit.not.complete"));
                    model.$$edit = false;
                    return;
                }
            } else {
                if (item.index != model.index && item.$$edit == true) {
                    alert(i18n.t("icem.segmentation.edit.not.complete"));
                    model.$$edit = false;
                    return;
                }
            }
        }
        backupTempRule = angular.copy(model);
        editNewObjectIds = false;
    };

    $scope.cancelSaveRule = function (model) {
        angular.forEach($scope.tempRuleList, function (m) {
            if (m.hasOwnProperty('id')) {
                if (m.id == model.id) {
                    for (var key in backupTempRule) {
                        model[key] = backupTempRule[key];
                    }
                    m.$$edit = false;
                    return;
                }
            } else {
                if (m.index == model.index) {
                    for (var key in backupTempRule) {
                        model[key] = backupTempRule[key];
                    }
                    m.$$edit = false;
                    return;
                }
            }
        });
    };

    $scope.deleteTempRule = function (model) {
        var deleteItem = $window.confirm(i18n.t('icem.delete.confirm') + " " + i18n.t('icem.items.deleteWarning'));
        if (deleteItem) {
            for (var i = 0, item; item = $scope.tempRuleList[i]; i++) {
                if (model.hasOwnProperty("id")) {
                    if (item.id == model.id) {
                        $scope.tempRuleList.splice(i, 1);
                    }
                } else if (model.hasOwnProperty("index")) {
                    if (item.index == model.index) {
                        $scope.tempRuleList.splice(i, 1);
                    }
                }
            }
            $scope.newSegmentObj.rules = angular.copy($scope.tempRuleList);
        }
    };

    $scope.addNewRule = function (flag) {
        // default value
        $scope.newPixelObj = {
            id: ruleId++,
            dataTypes: flag ? $scope.dataTypes[0].id : $scope.recommendDataTypes[0].id,
            objectIds: [],
            behavior: { behaviorType: 0, frequency: '', durationType: 0 },
            concatenateOp: $scope.concatenateOp[0]
        };
        editNewObjectIds = true;
        $scope.showNewPixel = true;
        $scope.showOperator = false;
        $scope.tempPixelList = [];
        $scope.tempCampaignList = [];
        $scope.tempSelectedPixel = [];
        $scope.tempSelectedCampaign = [];
    };

    $scope.cancelNewRule = function () {
        $scope.showNewPixel = false;
        $scope.newPixelObj = {};
    };

    $scope.changeRuleOption = function (model) {
        for (var i = 0, item; item = $scope.optionObj[i]; i++) {
            if (model.behavior.behaviorType == item.id) {
                model.behavior.behaviorType = item.id;
                model.behavior = { behaviorType: item.id };
                for (var prop in item.behavior) {
                    if (typeof item.behavior[prop] === 'object') {
                        model.behavior[prop] = item.behavior[prop][0].id
                    } else if (typeof item.behavior[prop] === 'string') {
                        model.behavior[prop] = item.behavior[prop];
                    }
                }
                break;
            }
        }
    };

    $scope.addNewSegment = function () {
        $scope.newSegmentObj = {};
        $scope.tempRuleList = [];
        $scope.addSegmentArea = true;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.newRecommendSetItem = null;
    // $scope.newRecommendSetItem = $scope.recomSegmentContainer;
    $scope.scheduleContainer = null;
    var initScheduleObj = {
        "startDate": null,
        "endDate": null,
        "fromHour": null,
        "toHour": null,
        "month": [],
        "week": [],
        "day": []
    };

    $scope.isLoadingRecomSegment = true;
    $scope.isShowRecomSegment = false;

    $scope.addNewRecommendSegment = function (flag, model) {
        // Item Detail block
        if (flag) {
            loadMemberAttribute();
            // if(!model.id){
            //     // add new one
            // }else{
            //     // edit old one
            // }
            $scope.newRecommendSetItem = angular.copy(model);
            $scope.scheduleContainer = angular.copy(model.dateAttr || initScheduleObj);
            $scope.attributeContainer = angular.copy(model.memberAttrs || []);
        } else {
            // close the panel
            $scope.newRecommendSetItem = null;
            $scope.scheduleContainer = null;
        }
        $scope.isShowRecomSegment = flag;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.saveRecomSegment = function (model) {
        model.scoreAttr = angular.copy($scope.scoreContainer);
        model.memberAttrs = angular.copy($scope.attributeContainer);
        console.log('save model.memberAttrs :', model.memberAttrs);
        var deferred = $q.defer();

        model.dateAttr = angular.copy($scope.scheduleContainer);
        if (!model || !model.ruleName) {
            alert("[" + i18n.t("icem.recommendSet.name") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
            return deferred.promise;
        } else if (checkDuplicateName($scope.tempRecomSegmentList, model)) {
            alert("[" + i18n.t("icem.recommendSet.name") + "] "
                + i18n.t("icem.duplicate"));
            deferred.reject("Fail");
            return deferred.promise;
        } else if (ValidateService.isEmptyDateAttr(model)) {
            deferred.reject("Fail - isEmptyDateAttr");
            return deferred.promise;
        } else if (ValidateService.isEmptyScore(model)) {
            deferred.reject("Fail - isEmptyScore");
            return deferred.promise;
        } else {
            var visitObj = checkVisit(model.visit);
            if (visitObj.notFill) {
                alert("[" + i18n.t(visitObj.str) + "] "
                    + i18n.t("icem.mandatory"));
                deferred.reject("Fail");
                return deferred.promise;
            };
            if (model.memberAttrs !== null) {
                for (var i = 0, item; item = model.memberAttrs[i]; i++) {
                    delete item.$$hashKey;
                }
            };
            DmpService.saveSegmentRule($scope.cSite.id, model).then(function (response) {
                var data = response.data.data;
                deferred.resolve("Success");
                $scope.isLoadingRecomSegment = true;
                $scope.recomSegmentTableParams.reload();
                $scope.addNewRecommendSegment();
            });
        }
        return deferred.promise;
    };

    function checkVisit(model) {
        for (var prop in model) {
            if (model[prop] === '') {
                model[prop] = null;
            }
        };

        if (model.clickNum && model.clickOperator === null) {
            return { notFill: true, str: 'icem.recommend.rule.pvCount' };
        } else if (model.impressionNum && model.impressionOperator === null) {
            return { notFill: true, str: 'icem.recommend.rule.visitCount' };
        } else if (model.recencyNum && model.recencyOperator === null) {
            return { notFill: true, str: 'icem.recommend.rule.visitInterval' };
        } else if (model.clickOperator !== null && model.clickNum === null) {
            return { notFill: true, str: 'icem.recommend.rule.pvCount' };
        } else if (model.impressionOperator !== null && model.impressionNum === null) {
            return { notFill: true, str: 'icem.recommend.rule.visitCount' };
        } else if (model.recencyOperator !== null && model.recencyNum === null) {
            return { notFill: true, str: 'icem.recommend.rule.visitInterval' };
        }
        return { notFill: false };
    };

    function checkDuplicateName(list, model) {
        var flag = false;
        for (var i = 0, item; item = list[i]; i++) {
            if (item.ruleName == model.ruleName && item.ruleId != model.ruleId) {
                flag = true;
            }
        }
        return flag;
    }

    function loadMemberAttribute() {
        if (!$scope.cSite) return;
        if ($scope.attributeList.length > 0) {
            return;
        }
        RecommendSetService.getRecommendSetAttribute($scope.cSite.id).then(function (response) {
            var data = response.data.data;
            $scope.attributeList = angular.copy(data);
        });
    }

    $scope.deleteSegmentList = function (model) {
        var deleteObj = {
            serviceApi: "DmpService",
            deleteApi: "deleteSegmentList",
            siteId: $scope.cSite.id,
            id: model.id
        };
        CommonService.deleteItem(deleteObj).then(function () {
            $scope.newSegmentObj = {};
            $scope.tempRuleList = [];
            $scope.addSegmentArea = false;
            $scope.segmentTableParams.reload();
        });
    };

    $scope.deleteRecomSegment = function (model) {
        var deleteObj = {
            serviceApi: "RecommendSetService",
            deleteApi: "removeRecommendSet",
            siteId: $scope.cSite.id,
            id: model.ruleId
        };
        CommonService.deleteItem(deleteObj).then(function () {
            $scope.addNewRecommendSegment(false);
            $scope.recomSegmentTableParams.reload();
        });
    };

    $scope.tempSegmentCopy = function (model) {
        backupTempSegment = angular.copy(model);
    };

    $scope.cancelSaveSegment = function (model) {
        var isFindFlag = false;
        angular.forEach($scope.segmentList, function (m) {
            if (!isFindFlag) {
                if (m.id == model.id) {
                    for (var key in backupTempRule) {
                        model[key] = backupTempRule[key];
                    }
                    m.$$edit = false;
                    isFindFlag = true;
                }
            }
        });
    };

    $scope.editSegment = function (model) {
        $scope.newSegmentObj = angular.copy(model);
        $scope.tempRuleList = angular.copy(model.rules);
        $scope.addSegmentArea = true;
        $scope.showNewPixel = false;
        $scope.tempPixelList = [];
        $scope.tempCampaignList = [];
        $scope.tempSelectedPixel = [];
        $scope.tempSelectedCampaign = [];
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.changeDataTypes = function (model) {
        model.objectIds = [];
        $scope.tempSelectedPixel = [];
        $scope.tempSelectedCampaign = [];
    };

    function checkSegmentName(model) {
        var flag = false;
        for (var i = 0, item; item = $scope.tempSegmentList[i]; i++) {
            if (model.name == item.name && model.id != item.id) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    $scope.saveNewSegment = function (model, temp) {
        var deferred = $q.defer();

        for (var i = 0, item; item = temp[i]; i++) {
            for (var propName in item) {
                if (propName == 'items') {
                    delete item['items'];
                }
                if (propName == 'objectIds') {
                    for (var j = 0, itemObj; itemObj = item['objectIds'][j]; j++) {
                        for (var prop in itemObj) {
                            if (prop == 'pixelid') {
                                itemObj['key'] = itemObj[prop];
                            } else if (prop == 'dspclient') {
                                itemObj['key'] = itemObj[prop];
                            }
                        }
                    }
                    break;
                }
            }
        }
        model.rules = angular.copy(temp);
        if (!model || !model.name) {
            alert("[" + i18n.t("icem.segmentation.name") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
            return deferred.promise;
        }
        if (checkSegmentName(model)) {
            alert(i18n.t("icem.segmentation.name.inuse"));
            deferred.reject("Fail");
            return deferred.promise;
        }
        if ($scope.showNewPixel) {
            alert(i18n.t("icem.segmentation.edit.not.complete"));
            deferred.reject("Fail");
            return deferred.promise;
        }
        if (!model.rules || model.rules.length == 0) {
            alert(i18n.t("icem.segmentation.empty.rules"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        for (var i = 0, item; item = model.rules[i]; i++) {
            if (item.$$edit == true) {
                alert(i18n.t("icem.segmentation.edit.not.complete"));
                deferred.reject("Fail");
                return deferred.promise;
            }
        }

        for (var i = 0, item; item = model.rules[i]; i++) {
            if (i == model.rules.length - 1) {
                item.concatenateOp = null;
            }
            // new rules, objectIds needs to be re-arrange
            if (item.hasOwnProperty('id')) {
                delete item.id;
            } else if (item.hasOwnProperty('index')) {
                delete item.index;
            }

            // reset index
            item['index'] = i;
            var tempObjectIds = angular.copy(item.objectIds);
            delete item['objectIds'];
            item.objectIds = [];

            for (var j = 0, obj; obj = tempObjectIds[j]; j++) {
                var selectedItem = {
                    id: obj.id,
                    name: obj.name,
                    siteId: obj.siteId,
                    key: obj.key
                };

                item.objectIds.push(selectedItem);
            }
            item.dataTypes = parseInt(item.dataTypes);
        }
        // $save API part
        if (model.hasOwnProperty('id')) {
            // edit
            DmpService.upSegmentDetail($scope.cSite.id, model).then(function () {
                $scope.segmentTableParams.reload();
                loadAdsSegment();
                deferred.resolve("Success");
            });
        } else {
            // new
            DmpService.saveSegmentDetail($scope.cSite.id, model).then(function () {
                $scope.segmentTableParams.reload();
                loadAdsSegment();
                deferred.resolve("Success");
            });
        }
        $scope.newSegmentObj = {};
        $scope.tempRuleList = [];
        $scope.addSegmentArea = false;
        $("html,body").animate({ scrollTop: 0 }, 700);
        $scope.segmentList.push(model);
        return deferred.promise;
    };


    $scope.segmentTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10
    }, {
            total: 0,           // length of data
            getData: function ($defer, params) {
                DmpService.getSegmentList($scope.cSite.id, params.count(), params.page() - 1).then(function (response) {
                    var data = response.data.data;

                    params.total(data.totalElements);

                    if (params.page() > 1 && (!data.content || data.content == 0)) {
                        //go previous page when no recommend in this page
                    } else {
                        $scope.tempSegmentList = angular.copy(data.content);
                        $defer.resolve(data.content);
                    }
                });
            }
        });

    $scope.cancelNewSegment = function () {
        $scope.newSegmentObj = {};
        $scope.tempRuleList = {};
        $scope.tempPixelList = [];
        $scope.tempCampaignList = [];
        $scope.tempSelectedRules = [];
        $scope.addSegmentArea = false;
    };

    // $scope.openRecommendRuleModal = function(model){

    // };

    $scope.openPixelModal = function (model) {
        if (model.hasOwnProperty('objectIds')) {
            backupTempObjects = angular.copy(model.objectIds);
        }
        $scope.editObj = null;
        var checkRuleList = false;

        if ($scope.tempRuleList.length > 0) {
            for (var i = 0, item; item = $scope.tempRuleList[i]; i++) {
                if (item.id == model.id) {
                    $scope.editObj = item;
                    checkRuleList = true;
                    break;
                }
            }
        }
        if (checkRuleList == false) {
            $scope.editObj = $scope.newPixelObj;
        }

        // default site
        $scope.selected = $scope.cSite.id;

        for (var i = 0, item; item = model.objectIds[i]; i++) {
            if (!item.hasOwnProperty('inUse')) {
                item['inUse'] = true;
            }
        }

        model.dataTypes = +model.dataTypes;
        switch (model.dataTypes) {
            case 0:
            case '0':
                // 'pixel.impression'
                $scope.tempSelectedPixel = model.objectIds;
                reloadSelectPixel();
                $('#pixelModal').modal({ backdrop: "static", show: true });
                break;
            case 1:
            case '1':
                // 'campaignClick'
                $scope.tempSelectedCampaign = model.objectIds;
                reloadSelectAdvertiser(false);
                $('#advertiserModal').modal({ backdrop: "static", show: true });
                break;
            case 2:
            case '2':
                // 'campaignView'
                $scope.tempSelectedCampaign = model.objectIds;
                reloadSelectAdvertiser(false);
                $('#advertiserModal').modal({ backdrop: "static", show: true });
                break;
            case 3:
                $scope.tempSelectedRules = model.objectIds;
                $('#recommendRuleModal').modal({ backdrop: "static", show: true });
                break;
            default:
                alert(i18n.t("icem.segmentation.dataType.not.select"));
        }

    };



    $scope.filterChange = function (column, filter) {
        if (column == 'label') {
            $scope.filterLabel = filter;
        }
        if (column == 'name') {
            $scope.filterName = filter;
        }
        $scope.pixelTableParams.reload();
    };

    var selectAdvFlag = {};
    function reloadSelectAdvertiser(flag) {
        // function reloadSelectAdvertiser() {
        $scope.tempCampaignList = [];
        var flag = flag;
        selectAdvFlag = {
            getFlag: function () {
                return flag;
            }
        };
        if ($scope.campaignTableParams) {
            $scope.campaignTableParams.reload();
        } else {
            $scope.campaignTableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10
            }, {
                    total: 0,           // length of data
                    getData: function ($defer, params) {
                        var requestUrl = params.url();
                        DmpService.getCampaignList($scope.selected, requestUrl).then(function (response) {
                            var data = response.data.data;
                            // set new data
                            if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                                //go previous page when no recommend in this page                        params.page(params.page() - 1);
                            } else {
                                // load left panel
                                $scope.tempCampaignList = $filter('filter')(data.content, { dspchannel: 'DBM' });
                                params.total($scope.tempCampaignList.length);
                                $scope.campaignCount = $scope.tempCampaignList.length;

                                var selectedItems = $scope.tempSelectedCampaign || [];
                                if (!selectAdvFlag.getFlag() && $scope.editObj.items) {
                                    selectedItems = $scope.editObj.items;
                                }

                                angular.forEach($scope.tempCampaignList, function (obj, idx) {
                                    if (selectedItems.length > 0) {
                                        // check if it was selected before
                                        for (var i = 0, item; item = selectedItems[i]; i++) {
                                            if (obj.id === item.id) {
                                                if (!obj.hasOwnProperty('inUse')) {
                                                    obj['inUse'] = true;
                                                }
                                            }
                                        }
                                    }

                                    if (!obj.hasOwnProperty('inUse')) {
                                        obj['inUse'] = false;
                                    }
                                    if (!obj.hasOwnProperty('siteId')) {
                                        obj['siteId'] = $scope.selected;
                                    }
                                });
                                $defer.resolve(data.content);

                                if (selectAdvFlag.getFlag()) {
                                    inUseArrUpdate($scope.editObj, $scope.tempCampaignList);
                                }
                            }
                        });
                    }
                });
        }
    }

    $scope.tempRecomSegmentList = null;
    $scope.recomSegmentTableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
            total: 0,
            getData: function ($defer, params) {

                DmpService.saveSegmentRuleList($scope.cSite.id, vo, params.count(), params.page() - 1).then(function (response) {
                    var data = response.data.data.content;
                    $scope.isLoadingRecomSegment = false;
                    params.total(response.data.data.totalElements);

                    if (params.page() > 1 && (!data || data.length == 0)) {
                        params.page(params.page() - 1);
                    } else {
                        $scope.tempRecomSegmentList = angular.copy(data);
                        $defer.resolve(data);
                    }
                });

            }
        });


    function reloadSelectPixel(flag) {
        // clear the left panel
        $scope.tempPixelList = [];
        $scope.flag = flag;

        if ($scope.pixelTableParams) {
            $scope.pixelTableParams.reload();
        } else {
            $scope.pixelTableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10
            }, {
                    total: 0,           // length of data
                    counts: [],
                    getData: function ($defer, params) {
                        var requestUrl = params.url();
                        if ($scope.filterLabel) {
                            requestUrl['filter[label]'] = $scope.filterLabel;
                        }
                        if ($scope.filterName) {
                            requestUrl['filter[name]'] = $scope.filterName;
                        }
                        DmpService.getPixelList($scope.selected, requestUrl).then(function (response) {
                            var data = response.data;
                            params.total(data.total);
                            $scope.pixelCount = data.grandTotal;
                            // set new data
                            if (params.page() > 1 && (!data.data || data.data.length == 0)) {
                                params.page(params.page() - 1);
                            } else {
                                // load left panel
                                $scope.tempPixelList = angular.copy(data.data);
                                // default right panel to tempSelectedPixel
                                var selectedItems = $scope.tempSelectedPixel || [];
                                if (!$scope.flag && $scope.editObj.items) {
                                    selectedItems = $scope.editObj.items;
                                }
                                angular.forEach($scope.tempPixelList, function (obj, idx) {
                                    if (selectedItems.length > 0) {
                                        // check if it was selected before
                                        for (var i = 0, item; item = selectedItems[i]; i++) {
                                            if (obj.id === item.id) {
                                                if (!obj.hasOwnProperty('inUse')) {
                                                    obj['inUse'] = true;
                                                }
                                            }
                                        }
                                    }
                                    if (!obj.hasOwnProperty('inUse')) {
                                        obj['inUse'] = false;
                                    }
                                    if (!obj.hasOwnProperty('siteId')) {
                                        obj['siteId'] = $scope.selected;
                                    }
                                });

                                if ($scope.flag) {
                                    inUseArrUpdate($scope.editObj, $scope.tempPixelList);
                                }
                                $defer.resolve(data.list);
                            }
                        });
                    }
                });
        }
    }

    $scope.cancelok = function (modalID, tempArr) {
        $(modalID).modal('hide');
        tempArr = angular.copy(backupTempObjects);
        updateObjects(tempArr);
    };

    $scope.ok = function (modalID, tempArr) {
        $(modalID).modal('hide');
        updateObjects(tempArr);
    };

    function updateObjects(tempArr) {
        if (editNewObjectIds) {
            $scope.newPixelObj.objectIds = tempArr;
        } else {
            for (var i = 0, item; item = $scope.tempRuleList[i]; i++) {
                if (item.hasOwnProperty('id')) {
                    if (item.id == backupTempRule.id) {
                        item.objectIds = tempArr;
                        break;
                    }
                } else {
                    // index
                    if (item.index == backupTempRule.index) {
                        item.objectIds = tempArr;
                        break;
                    }
                }
            }
        }
        $scope.tempSelectedPixel = [];
        $scope.tempSelectedCampaign = [];
    }


    $scope.saveSelectedPixel = function () {
        if ($scope.tempRuleList.length > 0) {
            for (var i = 0, item; item = $scope.tempRuleList[i]; i++) {
                if ($scope.newPixelObj.id != item.id) {
                    inUseArrUpdate($scope.newPixelObj, $scope.tempPixelList);
                    break;
                } else if (item.id == $scope.tempPixelList.id) {
                    inUseArrUpdate(item, $scope.tempPixelList);
                    break;
                }
            }
        } else {
            inUseArrUpdate($scope.newPixelObj);
        }
    };

    $scope.isUserRecommendType = function (type) {
        if ($scope.getShortName(type) === "USER_AUTO" || $scope.getShortName(type) === "USER_EXTERNAL" || $scope.getShortName(type) === "REMINDER") {
            return true;
        } else {
            return false;
        }
    };

    $scope.isItemRecommendType = function (type) {
        if ($scope.getShortName(type) === "ITEM_AUTO" || $scope.getShortName(type) === "ABANDONMENT" || $scope.getShortName(type) === "ABANDONMENT_AUTO" || $scope.getShortName(type) === "TRANSACTION_AUTO" || $scope.getShortName(type) === "ITEM_EXTERNAL" || $scope.getShortName(type) === "BUY_AFTER_VIEWING" || $scope.getShortName(type) === "HISTORY" || $scope.getShortName(type) === "HISTORY_AUTO") {
            return true;
        } else {
            return false;
        }
    };

    $scope.isAutoRecommendType = function (type) {
        if ($scope.getShortName(type) === "ITEM_AUTO" || $scope.getShortName(type) === "HISTORY_AUTO" || $scope.getShortName(type) === "USER_AUTO" || $scope.getShortName(type) === "ABANDONMENT_AUTO" || $scope.getShortName(type) === "TRANSACTION_AUTO") {
            return true;
        } else {
            return false;
        }
    };

    $scope.getShortName = function (type) {
        if (type === "USER_AUTO_VIEW" || type === "USER_AUTO_CONVERSION") {
            return "USER_AUTO";
        } else if (type === "ITEM_AUTO_VIEW" || type === "ITEM_AUTO_CONVERSION") {
            return "ITEM_AUTO";
        } else if (type === "HISTORY_AUTO_VIEW" || type === "HISTORY_AUTO_CONVERSION") {
            return "HISTORY_AUTO";
        } else if (type === "RANKING_ANALYSIS_VIEW" || type === "RANKING_DEFINED_VIEW" || type === "RANKING_ANALYSIS_CONVERSION" || type === "RANKING_DEFINED_CONVERSION") {
            return "RANKING";
        } else if (type === "ABANDONMENT_AUTO_VIEW" || type === "ABANDONMENT_AUTO_CONVERSION") {
            //Remain in shopping cart
            return "ABANDONMENT_AUTO";
        } else if (type === "TRANSACTION_AUTO_VIEW" || type === "TRANSACTION_AUTO_CONVERSION") {
            return "TRANSACTION_AUTO";
        } else {
            return type;
        }
    };

    $scope.getTypePrefix = function (type) {
        if (type) {
            return type.replace("_VIEW", "").replace("_CONVERSION", "");
        }
    };

    $scope.isConversionType = function (type) {
        if (type) {
            return type.indexOf("CONVERSION") > -1;
        }
        return false;
    };

    $scope.changeTypeAnalysis = function (type) {
        if (type) {
            return type.replace("DEFINED", "ANALYSIS");
        }
    };

    $scope.changeTypeDefined = function (type) {
        if (type) {
            return type.replace("ANALYSIS", "DEFINED");
        }
    };


    $scope.getRecommendTypeIcon = function (type) {
        return recommendTypeIcon[type];
    };

    $scope.openStart = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = true;
    };

    $scope.openEnd = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedEnd = true;
    };

    $scope.selectAdsTab = function (tab) {
        $scope.adsTab = tab;
        if (tab === 'segment') {
            // reload new table
            // reloadRecommendSegment();
            $scope.cancelNewRule();
            $scope.cancelNewSegment();
        } else if (tab === 'scheduler') {
            $scope.closeSchedule();
            reloadScheduler();
        } else if (tab === 'report') {
            showSegmentReport();
        } else if (tab === 'contractor') {
            $scope.closeExportModal();
            // $scope.exportResultTableParams = null;
            showContractorReport();
        } else if (tab === 'recommend') {
            $scope.cancelNewRule();
            $scope.cancelNewSegment();
            $scope.addNewRecommendSegment(false);
        }
    };

    function showContractorReport() {
        clearChart();
        $scope.clickSegment = '';

        AdsService.getAdsSegStatAllList($scope.cSite.id).then(function (response) {
            var data = response.data;
            if (data.data.length) {
                var columns = [];
                //for segment name comparison
                var categoryObj = [];
                //for chart
                var categories = ['x'];
                angular.forEach(data.data, function (obj) {
                    categories.push(obj.name);
                    var cat = {};
                    cat.name = obj.name;
                    categoryObj.push(cat);
                });
                columns.push(categories);
                angular.forEach(data.data, function (obj) {
                    var column = [];
                    column.push(obj.name);
                    angular.forEach(categoryObj, function (cat) {
                        //check name for cross site segment
                        if (cat.name === obj.name) {
                            column.push(obj.count);
                        } else {
                            column.push(0);
                        }
                    });
                    columns.push(column);
                });
                generateCategory(columns, categories, 'contractorChart', showSiteSegmentReport);
            }
        });
    }

    function showSiteSegmentReport(d, element) {
        clearChart();
        //trigger apply() event to angular control in a async callback function
        $timeout(function () {
            $scope.clickSegment = d.name;
        }, 0);

        AdsService.getAdsSegStatAllDetail($scope.cSite.id, { segment: d.name }).then(function (response) {
            var data = response.data;
            if (data.data.items.length) {
                var columns = [];
                var categories = ['x'];
                var categoryObj = [];
                angular.forEach(data.data.items, function (obj) {
                    categories.push(obj.name);
                    var cat = {};
                    cat.name = obj.name;
                    categoryObj.push(cat);
                });
                columns.push(categories);
                angular.forEach(data.data.items, function (obj) {
                    var column = [];
                    column.push(obj.name);
                    angular.forEach(categoryObj, function (cat) {
                        //check name for cross site segment
                        if (cat.name === obj.name) {
                            column.push(obj.count);
                        } else {
                            column.push(0);
                        }
                    });
                    columns.push(column);
                });
                generateCategory(columns, categories, 'contractorChart', showContractorReport);
            }
        });
    }

    $scope.selectSchedule = function () {
        $scope.pushFiles = [];
        for (var key in $scope.pushCheckboxes.items) {
            if ($scope.pushCheckboxes.items[key]) {
                $scope.pushFiles.push(key);
            }
        }

        if ($scope.pushFiles.length <= 0) {
            alert(i18n.t("icem.ads.export.push.no.file"));
            $scope.showExportResult = true;
            return;
        }

        $scope.showExportResult = false;

        AdsService.getAdsSegStatAllScheduleList($scope.cSite.id).then(function (response) {
            var data = response.data;
            $scope.scheduleList = $filter('filter')(data.data, { name: $scope.cSite.name });
        });
    };

    $scope.pushResult = function () {
        if (!$scope.pushSchedule.id) {
            alert(i18n.t("icem.ads.export.push.no.schedule"));
            return;
        }
        var pushRc = $window.confirm(i18n.t('icem.push.confirm'));
        if (pushRc) {
            $scope.pushingResult = true;
            var obj = { resultFiles: $scope.pushFiles.toString() };
            AdsService.getAdsSegStatAllResultPush($scope.cSite.id, $scope.pushSchedule.id, obj).then(function (response) {
                var data = response.data;
                // $('#exportModal').modal('hide');
                $scope.isShowExportModal = false;
                $scope.exportResultTableParams = null;
                clearPush();
                if (data.data) {
                    alert(i18n.t(data.data));
                } else {
                    alert(i18n.t('DONE'));
                }
            });
        }
    };

    $scope.uploadSegment = function () {
        //init
        clearPush();
        reloadExportTable();
        $scope.isShowExportModal = true;
    };

    $scope.cancelUploadSegment = function () {
        clearPush();
        $scope.isShowExportModal = false;
    };

    function clearPush() {
        $scope.pushingResult = false;
        $scope.showExportResult = true;
        $scope.pushCheckboxes = { 'checked': false, items: {} };
        $scope.pushSchedule = {};
        $scope.pushFiles = [];
    }

    $scope.deleteResult = function (result) {
        var deleteRc = $window.confirm(i18n.t('icem.delete.confirm'));
        if (deleteRc) {
            AdsService.deleteAdsSegStatAllResultList($scope.cSite.id, { name: result.fileName }).then(function () {
                reloadExportTable();
            });
        }
    };

    function reloadExportTable() {
        if ($scope.exportResultTableParams) {
            $scope.exportResultTableParams.reload();
        } else {
            $scope.exportResultTableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10
            }, {
                    total: 0,           // length of data
                    getData: function ($defer, params) {
                        AdsService.getAdsSegStatAllResultList($scope.cSite.id).then(function (response) {
                            var data = response.data;
                            var exportData = params.filter() ? $filter('filter')(data.data, params.filter()) : data;
                            exportData = $filter('orderBy')(exportData, params.orderBy());
                            params.total(exportData.length); // set total for recalc pagination
                            $defer.resolve(exportData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        });
                    }
                });
        }
    }

    function showSegmentReport() {
        clearChart();

        AdsService.getAdsSegStatList($scope.cSite.id).then(function (response) {
            var data = response.data;
            if (data.data.length) {
                var columns = [];
                //for checking
                var categoryObj = [];
                //for chart
                var categories = ['x'];
                angular.forEach(data.data, function (obj) {
                    categories.push(obj.name);
                    var cat = {};
                    cat.id = obj.id;
                    cat.name = obj.name;
                    categoryObj.push(cat);
                });
                columns.push(categories);
                angular.forEach(data.data, function (obj) {
                    var column = [];
                    column.push(obj.name);
                    angular.forEach(categoryObj, function (cat) {
                        //check name and id
                        if (cat.id === obj.id && cat.name === obj.name) {
                            column.push(obj.count);
                        } else {
                            column.push(0);
                        }
                    });
                    columns.push(column);
                });
                generateCategory(columns, categories, 'siteChart');
            }
        });
    }

    function clearChart() {
        if (chart) {
            chart.unload();
            chart = null;
        }
    }

    function generateCategory(columns, categories, id, onclick) {
        clearChart();
        chart = c3.generate({
            bindto: '#' + id,
            padding: c3padding,
            data: {
                x: 'x',
                columns: columns,
                groups: [
                    categories
                ],
                type: 'bar',
                onclick: onclick
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                },
                // y: {
                //     padding: {
                //         left: 50,
                //     }
                // },

                rotated: true
            },
            bar: {
                width: {
                    ratio: 0.6
                }
            },
            tooltip: {
                grouped: false // Default true
            }
        });
    }

    //return not sorted array
    $scope.notSorted = function (obj) {
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    };

    $scope.selectRuleTab = function (tab) {
        $scope.ruleTab = tab;
    };

    $scope.changeRuleScoreGroup = function () {
        filterScoreKey();
    };

    function filterScoreKey() {
        var isFindFlag = false;
        angular.forEach($scope.scoreGroupList, function (obj, idx) {
            if (!isFindFlag) {
                if (obj.id === $scope.ruleScoreEdit.group) {
                    $scope.scoreKeyList = angular.copy(obj.keys);
                    isFindFlag = true;
                }
            }
        });
    }

    $scope.clickRecommendType = function (type) {

        if (type === 'TRANSACTION_AUTO') {
            type = type + '_VIEW';
        } else if (type === 'USER_AUTO') {
            type = type + '_CONVERSION';
        }

        $scope.recommendObject.type = type;
        $scope.showRecommendType = false;
    };

    function initItemSetting(recommendObject) {
        ItemService.getItemAliasDetail($scope.cSite.id).then(function (response) {
            var data = response.data;
            $scope.itemAliasName = [];
            for (var key in data.data) {
                if (data.data[key]) {
                    $scope.itemAliasName.push(data.data[key]);
                }
            }
            $scope.categoryList = {};
            $scope.categoryNameMapping = [];
            if (data.data.category0) {
                $scope.categoryList[data.data.category0] = recommendObject.categories && recommendObject.categories[0] ? recommendObject.categories[0] : "";
            }
            $scope.categoryNameMapping.push(data.data.category0);
            if (data.data.category1) {
                $scope.categoryList[data.data.category1] = recommendObject.categories && recommendObject.categories[1] ? recommendObject.categories[1] : "";
            }
            $scope.categoryNameMapping.push(data.data.category1);
            if (data.data.category2) {
                $scope.categoryList[data.data.category2] = recommendObject.categories && recommendObject.categories[2] ? recommendObject.categories[2] : "";
            }
            $scope.categoryNameMapping.push(data.data.category2);
            if (data.data.category3) {
                $scope.categoryList[data.data.category3] = recommendObject.categories && recommendObject.categories[3] ? recommendObject.categories[3] : "";
            }
            $scope.categoryNameMapping.push(data.data.category3);
            if (data.data.category4) {
                $scope.categoryList[data.data.category4] = recommendObject.categories && recommendObject.categories[4] ? recommendObject.categories[4] : "";
            }
            $scope.categoryNameMapping.push(data.data.category4);
            if (data.data.profit) {
                $scope.showProfit = true;
            }
            if (data.data.price) {
                $scope.showPrice = true;
            }
        });
    }


    function inUseArrUpdate(model, arr) {
        var inUseArr = $filter('filter')(arr, { inUse: true });
        model.items = inUseArr;
    }

    function changeByAttr(arr, attr, value, changeAttr, changeValue) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {
                arr[i][changeAttr] = changeValue;
            }
        }
        return arr;
    }


    $scope.checkPixel = function (model, flag) {
        changeByAttr($scope.tempPixelList, 'id', model.id, 'inUse', flag);
        var pixelObj = model;
        var arr = [];

        for (var i = 0, item; item = $scope.tempSelectedPixel[i]; i++) {
            if (item['id'] === model.id) {
                arr.push(item);
                break;
            }
        }
        if ($scope.tempSelectedPixel.length > 0) {
            for (var i = 0, item; item = $scope.tempSelectedPixel[i]; i++) {
                if (item.id == model.id) {
                    $scope.tempSelectedPixel.splice(i, 1);
                    break;
                } else if (arr.length == 0) {
                    $scope.tempSelectedPixel.push(pixelObj);
                    break;
                }
            }
        } else {
            $scope.tempSelectedPixel.push(pixelObj);
        }
    };

    $scope.tempSelectedCampaign = [];
    $scope.checkCampaign = function (model, flag) {
        changeByAttr($scope.tempCampaignList, 'id', model.id, 'inUse', flag);

        var campaignObj = model;
        var arr = [];

        for (var i = 0, item; item = $scope.tempSelectedCampaign[i]; i++) {
            if (item['id'] === model.id) {
                arr.push(item);
                break;
            }
        }
        if ($scope.tempSelectedCampaign.length > 0) {
            for (var i = 0, item; item = $scope.tempSelectedCampaign[i]; i++) {
                if (item.id == model.id) {
                    $scope.tempSelectedCampaign.splice(i, 1);
                    break;
                } else if (arr.length == 0) {
                    $scope.tempSelectedCampaign.push(campaignObj);
                    break;
                }
            }
        } else {
            $scope.tempSelectedCampaign.push(campaignObj);
        }
    };

    $scope.tempSchedulerList = null;
    //Begin Schduler
    function reloadScheduler() {
        if ($scope.schedulerTableParams) {
            $scope.schedulerTableParams.reload();
        } else {
            $scope.schedulerTableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10
            }, {
                    total: 0,           // length of data
                    getData: function ($defer, params) {
                        ScheduleService.getScheList($scope.cSite.id, params.count(), params.page() - 1).then(function (response) {
                            var data = response.data.data;
                            params.total(data.totalElements);
                            $scope.schedulerCount = data.totalElements;
                            // set new data
                            if (params.page() > 1 && (!data.content || data.content == 0)) {
                                //go previous page when no recommend in this page
                                params.page(params.page() - 1);
                            } else {
                                $scope.tempSchedulerList = angular.copy(data.content);
                                $defer.resolve(data.content);
                            }
                        });
                    }
                });
        }
        ScheduleService.getScheMethodAds($scope.cSite.id).then(function (response) {
            var data = response.data;
            $scope.schedulerMethod = data.data;
        });
    }

    $scope.format = 'yyyy-MM-dd';
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    // $scope.openStart = function ($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.openedStart = true;
    //     $scope.openedEnd = false;
    // };

    // $scope.openEnd = function ($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.openedEnd = true;
    //     $scope.openedStart = false;
    // };

    // // $scope.openedExpires = function(){

    // // }

    // $scope.changeScheduleMethod = function (model) {
    //     switch (model.method) {
    //         case "DoubleClick":

    //             break;
    //         case "MailRecommend":

    //             break;
    //         default:
    //             console.log('no method');
    //     }
    // };

    $scope.newScheduler = function () {
        if (!$scope.scheduler.method) {
            alert("[" + i18n.t("icem.scheduler.method") + "] "
                + i18n.t("icem.selection.mandatory"));
            return;
        }
        loadAdsSegment();

        var method = $scope.scheduler.method;

        //init new scheduler object
        $scope.scheduler = {};
        $scope.scheduler.method = method;
        $scope.scheduler.exeWeek = $scope.dayOfWeek[0];



        var sDate = new Date();
        sDate.setHours(0);
        sDate.setMinutes(0);
        sDate.setSeconds(0);
        sDate.setMilliseconds(0);
        $scope.scheduler.startDate = sDate;
        // $scope.scheduler.startDate = "";
        $scope.scheduler.endDate = "";
        $scope.scheduler.exeTime = "22";
        $scope.scheduler.status = 0;

        //handle extra_config here
        $scope.scheduler.extraConfig = {};
        $scope.scheduler.extraConfig.segments = [];
        $scope.isShowSchedulerDetail = true;
        $("html,body").animate({ scrollTop: 0 }, 700);
        openedDatePicker();

        switch ($scope.scheduler.method) {
            case "DoubleClick":
                if ($scope.schedulerTableParams.data == 0) {
                    // default setting
                    $scope.scheduler.listenerUrl = "https://cm.g.doubleclick.net/upload";
                } else {
                    angular.forEach($scope.schedulerTableParams.data, function (scheduler, idx) {
                        //fill in existing setting
                        if (scheduler.method === 'DoubleClick') {
                            $scope.scheduler.elementId = scheduler.elementId;
                            $scope.scheduler.listenerUrl = scheduler.listenerUrl;
                        }
                    });
                }
                break;

            case "MailRecommend":
                $scope.scheduler.extraConfig.contentId = $scope.recommendContentList[0].id
                break;

            default:
                console.log('no method');
        }
    };

    function openedDatePicker() {
        $scope.openedStart = false;
        $scope.openedEnd = false;
    }

    $scope.closeSchedule = function () {
        $scope.isShowSchedulerDetail = false;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };

    $scope.closeExportModal = function () {
        $scope.isShowExportModal = false;
        $scope.exportResultTableParams = null;
        $("html,body").animate({ scrollTop: 0 }, 700);
    };


    function loadAdsSegment(syncList) {
        var scheduleJobGroup = null;
        switch ($scope.scheduler.method) {
            case 'DoubleClick':
                scheduleJobGroup = 'DOUBLE_CLICK';
                break;
            case 'MailRecommend':
                scheduleJobGroup = 'MAILRECOMMEND';
                break;
            case 'Expired':
                scheduleJobGroup = 'EXPIRED';
                break;
            case 'Broadcase':
                scheduleJobGroup = 'BROADCASE';
                break;
            case 'Single':
                scheduleJobGroup = 'SINGLE';
                break;
            default: console.log('loadAdsSegment error');
        }

        AdsService.getAdsSegNames($scope.cSite.id, scheduleJobGroup).then(function (response) {
            var data = response.data.data;
            $scope.adsSegmentList = angular.copy(data);
            if ($scope.adsSegmentList.length > 0) {
                $scope.newSegmentId = $scope.adsSegmentList[0].id;
            }

            if (syncList) {
                angular.forEach(syncList, function (obj, idx) {
                    angular.forEach($scope.adsSegmentList, function (segment) {
                        if (obj.id === segment.id) {
                            syncList[idx] = angular.copy(segment);
                        }
                    });
                });
            }
        });
    }

    $scope.editScheduler = function (model) {
        var obj = { scheduleId: model.id };
        ScheduleService.getScheDetail($scope.cSite.id, obj).then(function (response) {
            var data = response.data;
            $scope.scheduler = angular.copy(data.data);
            if (!$scope.scheduler.extraConfig) {
                $scope.scheduler.extraConfig = {};
                $scope.scheduler.extraConfig.segments = [];


                if ($scope.recommendContentList != null && $scope.recommendContentList.length > 0) {
                    $scope.scheduler.extraConfig.contentId = $scope.recommendContentList[0].id
                }

            } else {
                loadAdsSegment($scope.scheduler.extraConfig.segments);
            }
            $scope.isShowSchedulerDetail = true;
            $("html,body").animate({ scrollTop: 0 }, 700);
            openedDatePicker();
        });
    };

    $scope.runJob = function (model) {
        var runConfirm = $window.confirm(i18n.t('icem.schedule.run.confirm'));
        if (runConfirm) {
            model.running = true;

            var obj = { scheduleId: model.id };
            ScheduleService.getScheRun($scope.cSite.id, obj).then(function (response) {
                var data = response.data;
                if (data.data) {
                    alert(model.name + ": " + data.data);
                } else {
                    alert(model.name + ": " + i18n.t('DONE'));
                }
                model.running = false;
            });
        }
    };

    $scope.changeSchedulerStatus = function (model) {
        var updateConfirm = $window.confirm(i18n.t('icem.update.confirm'));
        if (updateConfirm) {
            model.status = (model.status == 1 ? 0 : 1);
            $scope.saveScheduler(model);
        }
    };

    $scope.addSegment = function (segmentId) {
        var conflict = false;
        angular.forEach($scope.scheduler.extraConfig.segments, function (segment, idx) {
            if (segment.id === segmentId) {
                conflict = true;
            }
        });

        if (!conflict) {
            angular.forEach($scope.adsSegmentList, function (segment, idx) {
                if (segment.id === segmentId) {
                    $scope.scheduler.extraConfig.segments.push(segment);
                }
            });
        }
    };

    $scope.deleteSegment = function (model) {
        var isFindFlag = false;
        angular.forEach($scope.scheduler.extraConfig.segments, function (segment, idx) {
            if (!isFindFlag) {
                if (segment.id === model.id) {
                    $scope.scheduler.extraConfig.segments.splice(idx, 1);
                    isFindFlag = true;
                }
            }
        });
    };

    $scope.saveScheduler = function (model, detail) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.scheduler.name"], [model.name])) {
            deferred.reject("Fail - ValidateService");
        } else if (model.method === "DoubleClick" && !model.extraConfig.advertiserId) {
            alert("[" + i18n.t("icem.site.advertiserId") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
        } else if (model.method === "DoubleClick" && !model.elementId) {
            alert("[" + i18n.t("icem.scheduler.ads.double.click.networkId") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (model.method === "DoubleClick" && detail && !model.extraConfig.userListId) {
            alert("[" + i18n.t("icem.scheduler.ads.userListName") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (model.method === "DoubleClick" && detail && !model.extraConfig.appId) {
            alert("[" + i18n.t("icem.scheduler.ads.appId") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (detail && model.extraConfig.segments.length === 0) {
            alert("[" + i18n.t("icem.recommend.ads.segment") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (model.method === "DoubleClick" && !model.method) {
            alert("[" + i18n.t("icem.scheduler.method") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (model.method === "DoubleClick" && !model.listenerUrl) {
            alert("[" + i18n.t("icem.scheduler.push.url") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (model.status != 0 && model.status != 1) {
            alert("[" + i18n.t("icem.scheduler.status") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
        } else if (!model.startDate) {
            alert("[" + i18n.t("icem.scheduler.start.date") + "] "
                + i18n.t("icem.mandatory.invalid"));
            deferred.reject("Fail");
        } else if (model.exeWeek && $scope.dayOfWeek.indexOf(model.exeWeek) < 0) {
            alert("[" + i18n.t("icem.scheduler.day.of.week") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
        } else if ($scope.hourOfDay.indexOf(model.exeTime) < 0) {
            alert("[" + i18n.t("icem.scheduler.hour.of.day") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
        } else {
            if (model.endDate) {
                var start = model.startDate instanceof Date ? model.startDate : new Date(model.startDate);
                var end = model.endDate instanceof Date ? model.endDate : new Date(model.endDate);
                if (start.getTime() >= end.getTime()) {
                    alert(i18n.t("icem.date.compare.error"));
                    deferred.reject("Fail");
                    return deferred.promise;
                }
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);
                if (end.getTime() <= today.getTime()) {
                    alert(i18n.t("icem.end.date.compare.error"));
                    deferred.reject("Fail");
                    return deferred.promise;
                }
            }

            //remove timezone shift
            var start = model.startDate instanceof Date ? model.startDate : new Date(model.startDate);
            start.setHours(0);
            if (model.endDate) {
                var end = model.endDate instanceof Date ? model.endDate : new Date(model.endDate);
                end.setHours(0);
            }


            if (model.id) {
                ScheduleService.upScheDetail($scope.cSite.id, model.method.toLowerCase(), model).then(function (response) {
                    var data = response.data;
                    deferred.resolve("Success");
                    for (var key in model) {
                        //clear temp object
                        if (model.method !== "DoubleClick") {
                            model[key] = null;
                        }
                    }
                    reloadScheduler();
                    if (data.status != 'OK') {
                        alert(i18n.t(data.message));
                    }
                    $scope.isShowSchedulerDetail = false;
                });
            } else {
                ScheduleService.saveScheDetail($scope.cSite.id, model.method.toLowerCase(), model).then(function () {
                    deferred.resolve("Success");
                    reloadScheduler();
                    $scope.isShowSchedulerDetail = false;
                });
            }
        }
        return deferred.promise;
    };

    $scope.deleteScheduler = function (model) {
        var deleteObj = {
            serviceApi: "ScheduleService",
            deleteApi: "deleteScheList",
            siteId: $scope.cSite.id,
            id: model.id
        };
        CommonService.deleteItem(deleteObj).then(function () {
            reloadScheduler();
        });
    };
    //End Scheduler

    $scope.exportRuleBtn = function () {
        window.open(ruleUrl + "/bulk?siteId=" + $scope.cSite.id + "&adsSegmentId=" + $scope.recommendObject.id);
    };

    $scope.exportAdsSegmentBtn = function () {
        window.open(adsSegmentUrl + "/stat/bulk?siteId=" + $scope.cSite.id);
    };

    $scope.exportAdsContractorSegmentBtn = function () {
        window.open(adsSegmentUrl + "/stat/all/bulk?siteId=" + $scope.cSite.id);
    };




};

    app.filter('concatenateOpFilter', function () {
        return function (operator) {
            var conOpList = [{ name: 'AND', operator: 'INTERSECT' },
            { name: 'OR', operator: 'UNION' },
            { name: 'NOT', operator: 'EXCEPT' }
            ];
            for (var i = 0, item; item = conOpList[i]; i++) {
                if (operator == item.operator) {
                    return item.name;
                    // break;
                }
            }
        };
    })

    app.filter('siteIdFilter', function () {
        return function (id, scope) {
            for (var i = 0, item; item = scope.siteList[i]; i++) {
                if (item.id == id) {
                    return item.name;
                    // break;
                }
            }
        };
    })

    app.filter('dataTypesFilter', function () {
        return function (number, scope) {
            for (var i = 0, item; item = scope.dataTypes[i]; i++) {
                if (item.id == number) {
                    return item.name;
                    // break;
                }
            }
        };
    })

    app.filter('behaviorTypeFilter', function () {
        return function (number, scope) {
            for (var i = 0, item; item = scope.optionObj[i]; i++) {
                if (item.id == number) {
                    return item.behaviorType;
                    // break;
                }
            }
        };
    });
