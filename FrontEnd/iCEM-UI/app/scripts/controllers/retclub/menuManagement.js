'use strict';

app.controller('menuListCtrl', menuListCtrl);

menuListCtrl.$inject = ['$scope', '$window', '$upload', '$q', 'ngTableParams', 'CommonService', 'MenuService', 'ItemService', 'ValidateService'];

function menuListCtrl($scope, $window, $upload, $q, ngTableParams, CommonService, MenuService, ItemService, ValidateService){

    $scope.buttons = [];
    $scope.promotionHourRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    $scope.checkboxes = { 'checked': false, items: {} };
    $scope.itemCount = 2;
    $scope.maxCount = 20;
    $scope.menuId = "";
    $scope.basicMode = true;
    $scope.configfiles = [];
    $scope.zipfileName = '';
    $scope.logoPath = '';
    $scope.footerlogoPath = '';
    $scope.injectionMenus = null;

    $scope.slides = [];
    $scope.custom = [];
    $scope.themeType = 0;
    $scope.headerType = 0;
    $scope.footerType = 0;

    CKEDITOR.disableAutoInline = true;
    var instance = CKEDITOR.inline('customContentEditor');
    if (instance) {
        CKEDITOR.remove(instance);
    }
    CKEDITOR.replace('customContentEditor');


    initPage();

    function initPage(){
        $('.dropdown-toggle').dropdownHover();
        loadMenuTable();
        loadInjectionMenu();
        MenuService.getMenuListButton($scope.cSite.id).then(function (response) {
            if (response.data.data.length == 0) return;
            $scope.buttons = response.data.data;
        });

        MenuService.getMenuThemeList($scope.cSite.id).then(function (response) {
            $scope.slides = response.data.data;
            // console.log("getMenuThemeList:",$scope.slides);
        });
    }

    $scope.getTitle = function (key) {
        return i18n.t(key);
    };

    function loadMenuTable(){
        $scope.menuTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {
                    MenuService.getMenuList($scope.cSite.id, params.count(), params.page() - 1).then(function (response) {
                        var data = response.data.data;

                        params.total(data.totalElements);
                        $.each(data.content, function (i) {
                            data.content[i].type = i18n.t(data.content[i].typei18nKey);
                        });

                        if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $defer.resolve(data.content);
                        }
                    });
                }
            });
    }

    function loadInjectionMenu() {
        if (!$scope.cSite.id) return;
        MenuService.getMenuListInjection($scope.cSite.id).then(function (response) {
            var data = response.data.data.content;
            $scope.injectionMenus = angular.copy(data);
        });
    };

    $scope.saveInjection = function (model) {
        var deferred = $q.defer();
        if (!$scope.cSite.id) {
            return deferred.promise
        };
        if (ValidateService.isEmptyInput(["icem.menu.name"], [model.name])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        };
        MenuService.saveInjectionMenu($scope.cSite.id, model).then(function (response) {
            var data = response.data;
            deferred.resolve("Success");
            if (data.message === "ok") {
                // loadInjectionMenu();
                $scope.menuTableParams.reload();
                $('#injectionModal').modal('hide');
            }
        });
        return deferred.promise;
    };

    $scope.newInjection = function (model) {
        $scope.injectionMenu = angular.copy(model);
        $scope.injectionMenu.name = null;
        loadClubTemplate("INJECTION");
        $('#injectionModal').modal('show');
    };

    $scope.closeInjection = function () {
        $scope.injectionMenu = null;
        $('#injectionModal').modal('hide');
    };

    $scope.editMenu = function (menu) {
        MenuService.getMenuDetail($scope.cSite.id, menu.id).then(function (response) {
            var data = response.data.data;
            // console.log("getMenuDetail:",data);
            switch (menu.typei18nKey) {
                case "icem.menu.promotion":
                    loadClubTemplate("PROMOTION");
                    $scope.checkboxes = { 'checked': false, items: {} };
                    $scope.promotionMenu = angular.copy(data);
                    $.each(data.items, function (i) {
                        $scope.checkboxes.items[data.items[i]] = true;
                    });
                    reloadItem($scope.cSite.id, $scope.filterItems);
                    $('#promotionModal').modal('show');
                    break;
                case "icem.menu.personalized":
                    loadClubTemplate("PERSONALIZED");
                    $scope.personalizedMenu = angular.copy(data);
                    $('#personalizedModal').modal('show');
                    break;
                case "icem.menu.ranking":
                    loadClubTemplate("RANKING");
                    $scope.rankingMenu = angular.copy(data);
                    $('#rankingModal').modal('show');
                    break;
                case "icem.menu.reminder":
                    loadClubTemplate("REMINDER");
                    $scope.reminderMenu = angular.copy(data);
                    $('#reminderModal').modal('show');
                    break;
                case "icem.menu.point":
                    loadClubTemplate("POINT");
                    $scope.pointMenu = angular.copy(data);
                    $('#pointModal').modal('show');
                    break;
                case "icem.menu.registration":
                    loadClubTemplate("REGISTRATION");
                    $scope.registrationMenu = angular.copy(data);
                    $('#registrationModal').modal('show');
                    break;
                case "icem.menu.custom":
                    loadClubTemplate("CUSTOM");
                    $scope.customMenu = angular.copy(data);
                    CKEDITOR.instances['customContentEditor'].setData(data.content);
                    $('#customModal').modal('show');
                    break;
                case "icem.menu.injection":
                    loadClubTemplate("INJECTION");
                    $scope.injectionMenu = angular.copy(data);
                    $('#injectionModal').modal('show');
                    break;
                default:
                    alert(i18n.t("icem.error"));
            }
        });
    };

    $scope.deleteMenu = function (mid, microSiteId) {
        if (microSiteId > 0) {
            alert(i18n.t("icem.menu.unable.delete"));
            return false;
        }
        var deleteObj = {
            serviceApi: "MenuService",
            deleteApi: "deleteMenuList",
            siteId: $scope.cSite.id,
            id: mid
        };
        CommonService.deleteItem(deleteObj).then(function () {
            $scope.menuTableParams.reload();
        });
    };

    $scope.clickButtonList = function (type) {
        switch (type) {
            case "icem.menu.promotion.new":
                $scope.promotionMenu = { id: null, items: [] };
                loadClubTemplate("PROMOTION");
                $scope.checkboxes = { 'checked': false, items: {} };
                $scope.clearDate();
                reloadItem($scope.cSite.id, $scope.filterItems);
                $('#promotionModal').modal('show');
                break;
            case "icem.menu.personalized.new":
                $scope.personalizedMenu = { id: null, personalizedType: 1 };
                loadClubTemplate("PERSONALIZED");
                $('#personalizedModal').modal('show');
                break;
            case "icem.menu.ranking.new":
                $scope.rankingMenu = { rankingType: 1 };
                loadClubTemplate("RANKING");
                $('#rankingModal').modal('show');
                break;
            case "icem.menu.reminder.new":
                $scope.reminderMenu = { id: null };
                loadClubTemplate("REMINDER");
                $('#reminderModal').modal('show');
                break;
            case "icem.menu.point.new":
                $scope.pointMenu = { id: null };
                loadClubTemplate("POINT");
                $('#pointModal').modal('show');
                break;
            case "icem.menu.registration.new":
                $scope.registrationMenu = { id: null };
                loadClubTemplate("REGISTRATION");
                $('#registrationModal').modal('show');
                break;
            case "icem.menu.custom.new":
                $scope.customMenu = { id: null };
                loadClubTemplate("CUSTOM");
                CKEDITOR.instances['customContentEditor'].setData(i18n.t('icem.menu.custom.content.example'));
                $('#customModal').modal('show');
                break;
            default:
                alert(i18n.t("icem.error"));
        }
    };

    $scope.initPromotion = function () {
        $scope.filterItems = { code: null, name: null, grouping: null, category: null };
        $scope.format = 'yyyy-MM-dd';
        $scope.minDate = new Date();
        $scope.dateOptions = { formatYear: 'yy', startingDay: 1 };
        $scope.hstep = 1;
        $scope.mstep = 10;
        $scope.ismeridian = false;
    };

    $scope.initPromotion();

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        return false;
    };

    $scope.openEnd = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedEnd = true;
    };

    $scope.openStart = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = true;
    };

    $scope.savePromotion = function (menu) {
        var deferred = $q.defer();

        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.promotion.count", "icem.menu.template"], [$scope.promotionMenu.name, $scope.promotionMenu.promotionCount, $scope.promotionMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        if ($scope.promotionMenu.promotionCount > $scope.maxCount || $scope.promotionMenu.promotionCount == 0) {
            alert("[" + i18n.t("icem.menu.promotion.count") + "] "
                + i18n.t("icem.lessThan") + " " + $scope.maxCount);
            deferred.reject("Fail");
            return deferred.promise;
        }

        if (!$scope.promotionMenu.promotionStartTime) {
            alert("[" + i18n.t("icem.menu.promotion.date.start.time") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        if (!$scope.promotionMenu.promotionEndTime) {
            alert("[" + i18n.t("icem.menu.promotion.date.end.time") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        if (!$scope.promotionMenu.promotionStartDate) {
            alert("[" + i18n.t("icem.menu.promotion.date.start") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        if (!$scope.promotionMenu.promotionEndDate) {
            alert("[" + i18n.t("icem.menu.promotion.date.end") + "] "
                + i18n.t("icem.error"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        if (angular.isDate($scope.promotionMenu.promotionStartDate)) {
            $scope.promotionMenu.promotionStartDate = $scope.promotionMenu.promotionStartDate.getTime();
        }

        if (angular.isDate($scope.promotionMenu.promotionEndDate)) {
            $scope.promotionMenu.promotionEndDate = $scope.promotionMenu.promotionEndDate.getTime();
        }

        if (angular.isDate($scope.promotionMenu.promotionStartTime)) {
            $scope.promotionMenu.promotionStartTime = $scope.promotionMenu.promotionStartTime.getTime();
        }

        if (angular.isDate($scope.promotionMenu.promotionEndTime)) {
            $scope.promotionMenu.promotionEndTime = $scope.promotionMenu.promotionEndTime.getTime();
        }

        if ($scope.promotionMenu.promotionStartDate > $scope.promotionMenu.promotionEndDate) {
            alert(i18n.t("icem.menu.promotion.date.compare"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        if ($scope.promotionMenu.promotionStartDate == $scope.promotionMenu.promotionEndDate
            && $scope.promotionMenu.promotionStartTime >= $scope.promotionMenu.promotionEndTime) {
            alert(i18n.t("icem.menu.promotion.date.time.compare"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        if ($scope.promotionMenu.promotionRangeStart > $scope.promotionMenu.promotionRangeEnd) {
            alert(i18n.t("icem.menu.promotion.range.compare"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        menu.items = [];
        for (var key in $scope.checkboxes.items) {
            if ($scope.checkboxes.items[key]) {
                $scope.promotionMenu.items.push(key);
            }
        }

        if ($scope.promotionMenu.items.length == 0) {
            alert(i18n.t("icem.orderEntry.checkout.select.item"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        MenuService.savePromotionMenu($scope.cSite.id, menu).then(function () {
            deferred.resolve("Success");
            $scope.menuTableParams.reload();
            $scope.promotionMenu = { id: null, items: {}, promotionRangeStart: $scope.promotionHourRange[0], promotionRangeEnd: $scope.promotionHourRange[23] };
            $('#promotionModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearPromotion = function (menu) {
        if (menu.id) {
            $scope.promotionMenu = { id: menu.id, items: [], promotionRangeStart: $scope.promotionHourRange[0], promotionRangeEnd: $scope.promotionHourRange[23] };
        } else {
            $scope.promotionMenu = { items: [], promotionRangeStart: $scope.promotionHourRange[0], promotionRangeEnd: $scope.promotionHourRange[23] };
        }
        $scope.clearDate();
        $scope.checkboxes = { 'checked': false, items: {} };
    };

    $scope.clearDate = function () {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0, 0);

        $scope.promotionMenu.promotionStartDate = d.getTime();

        var d2 = new Date();
        d2.setHours(0);
        d2.setMinutes(0);
        d2.setSeconds(0, 0);
        d2.setDate(d.getDate() + 7);

        $scope.promotionMenu.promotionEndDate = d2.getTime();

        $scope.promotionMenu.promotionStartTime = d.getTime();
        $scope.promotionMenu.promotionEndTime = d.getTime();

        $scope.promotionMenu.promotionRangeStart = $scope.promotionHourRange[0];
        $scope.promotionMenu.promotionRangeEnd = $scope.promotionHourRange[23];
    };

    $scope.filterChange = function (items) {
        items.code = (items.code != "") ? items.code : null;
        items.name = (items.name != "") ? items.name : null;
        items.grouping = (items.grouping != "") ? items.grouping : null;
        items.category = (items.category != "") ? items.category : null;
        reloadItem($scope.cSite.id, items);
    };

    $scope.saveItem = function (model) {
        if (ValidateService.isEmptyInput(["icem.items.code", "icem.items.name", "icem.items.grouping", "icem.items.category"], [model.code, model.name, model.grouping, model.category])) {
        } else if (isNaN(parseFloat(model.price))) {
            alert("[" + i18n.t("icem.items.price") + "] "
                + i18n.t("icem.mandatory"));
        } else if (isNaN(parseFloat(model.discount))) {
            alert("[" + i18n.t("icem.items.special.price") + "] "
                + i18n.t("icem.mandatory"));
        } else {
            model.$$edit = false;
            ItemService.saveItem($scope.cSite.id, model).then(function () {
                $scope.itemTableParams.reload();
            });
        }
    };

    $scope.checkBoxClick = function (item, checkItem) {
        if (!item.discount) {
            for (var key in checkItem) {
                if (key == item.itemId)
                    checkItem[key] = false;
            }
            alert("[" + i18n.t("icem.items.special.price") + "] "
                + i18n.t("icem.mandatory"));
        }
    };

    // watch for check all checkbox
    $scope.$watch('checkboxes.checked', function (value) {
        angular.forEach($scope.items, function (item) {
            if (angular.isDefined(item.itemId)) {
                if (value) {
                    if (item.discount) {
                        $scope.checkboxes.items[item.itemId] = value;
                        $scope.checkboxes.checked = true;
                    } else {
                        $scope.checkboxes.checked = false;
                    }
                } else {
                    $scope.checkboxes.items[item.itemId] = false;
                }
            }
        });
    });

    $scope.savePersonalized = function (menu) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.personalized.type", "icem.menu.personalized.count", "icem.menu.template"], [$scope.personalizedMenu.name, $scope.personalizedMenu.personalizedType, $scope.personalizedMenu.personalizedCount, $scope.personalizedMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }
        if ($scope.personalizedMenu.personalizedCount > $scope.maxCount || $scope.personalizedMenu.personalizedCount == 0) {
            alert("[" + i18n.t("icem.menu.personalized.count") + "] "
                + i18n.t("icem.lessThan") + " " + $scope.maxCount);
            deferred.reject("Fail");
            return deferred.promise;
        }
        MenuService.savePersonalizedMenu($scope.cSite.id, menu).then(function (response) {
            deferred.resolve("Success");
            $scope.menuTableParams.reload();
            $scope.personalizedMenu = { id: null, personalizedType: 1 };
            $('#personalizedModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearPersonalized = function (menu) {
        if (menu.id) {
            $scope.personalizedMenu = { id: menu.id, personalizedType: 1 };
        } else {
            $scope.personalizedMenu = { id: null, personalizedType: 1 };
        }
    };

    $scope.saveRanking = function (menu) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.ranking.type", "icem.menu.ranking.count", "icem.menu.template"], [$scope.rankingMenu.name, $scope.rankingMenu.rankingType, $scope.rankingMenu.rankingCount, $scope.rankingMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        if ($scope.rankingMenu.rankingCount > $scope.maxCount || $scope.rankingMenu.rankingCount == 0) {
            alert("[" + i18n.t("icem.menu.ranking.count") + "] "
                + i18n.t("icem.lessThan") + " " + $scope.maxCount);
            deferred.reject("Fail");
            return deferred.promise;
        }

        MenuService.saveRankingMenu($scope.cSite.id, menu).then(function (response) {
            deferred.resolve("Success");
            $scope.menuTableParams.reload();
            $scope.rankingMenu = { id: null, rankingType: 1 };
            $('#rankingModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearRanking = function (menu) {
        if (menu.id) {
            $scope.rankingMenu = { id: menu.id, rankingType: 1 };
        } else {
            $scope.rankingMenu = { id: null, rankingType: 1 };
        }
    };

    $scope.saveReminder = function (menu) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.reminder.count", "icem.menu.template"], [$scope.reminderMenu.name, $scope.reminderMenu.reminderCount, $scope.reminderMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        if ($scope.reminderMenu.reminderCount > $scope.maxCount || $scope.reminderMenu.reminderCount == 0) {
            alert("[" + i18n.t("icem.menu.reminder.count") + "] "
                + i18n.t("icem.lessThan") + " " + $scope.maxCount);
            deferred.reject("Fail");
            return deferred.promise;
        }

        MenuService.saveReminderMenu($scope.cSite.id, menu).then(function () {
            deferred.resolve("Success");
            $scope.menuTableParams.reload();
            $scope.reminderMenu = {};
            $('#reminderModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearReminder = function (menu) {
        if (menu.id) {
            $scope.reminderMenu = { id: menu.id };
        } else {
            $scope.reminderMenu = { id: null };
        }
    };

    $scope.savePoint = function (menu) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.template"], [$scope.pointMenu.name, $scope.pointMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        MenuService.savePointMenu($scope.cSite.id, menu).then(function (response) {
            deferred.resolve("Success");
            var data = response.data;
            $scope.menuTableParams.reload();
            $scope.pointMenu = {};
            $('#pointModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearPoint = function (menu) {
        if (menu.id) {
            $scope.pointMenu = { id: menu.id };
        } else {
            $scope.pointMenu = { id: null };
        }
    };

    $scope.saveRegistration = function (menu) {
        var deferred = $q.defer();
        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.template"], [$scope.registrationMenu.name, $scope.registrationMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        MenuService.saveRegistrationMenu($scope.cSite.id, menu).then(function () {
            deferred.resolve("Success");
            $scope.menuTableParams.reload();
            $scope.registrationMenu = {};
            $('#registrationModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearRegistration = function (menu) {
        if (menu.id) {
            $scope.registrationMenu = { id: menu.id };
        } else {
            $scope.registrationMenu = { id: null };
        }
    };

    $scope.saveCustom = function (menu) {
        var deferred = $q.defer();

        menu.clubTemplate = $scope.customOption[0].id;

        if (ValidateService.isEmptyInput(["icem.menu.name", "icem.menu.template"], [$scope.customMenu.name, $scope.customMenu.clubTemplate])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        if (!CKEDITOR.instances['customContentEditor'].getData()) {
            alert("[" + i18n.t("icem.menu.custom.content") + "] "
                + i18n.t("icem.mandatory"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        menu.content = CKEDITOR.instances['customContentEditor'].getData();

        MenuService.saveCustomMenu($scope.cSite.id, menu).then(function () {
            deferred.resolve("Success");
            $scope.menuTableParams.reload();
            $scope.customMenu = {};
            $('#customModal').modal('hide');
        });
        return deferred.promise;
    };

    $scope.clearCustom = function (menu) {
        CKEDITOR.instances['customContentEditor'].setData('');
        if (menu.id) {
            $scope.customMenu = { id: menu.id };
        } else {
            $scope.customMenu = {};
        }
    };

    $scope.editPublicClub = function (id) {
        $scope.menuId = id;
        $scope.edit = { appId: '', appSecret: '', publicId: '' };
        $scope.security = false;
        $scope.registration = false;
        $scope.themeType = 0;
        $scope.configfiles = [];
        $scope.zipfileName = '';
        $scope.logoPath = '';
        $scope.footerlogoPath = '';
        $scope.basicMode = true;

        MenuService.getMenuPublishDetail($scope.cSite.id, $scope.menuId).then(function (response) {
            var data = response.data.data;
            // console.log("getMenuPublishDetail:",data);
            if (data) {
                $scope.edit = { appId: data.appId, appSecret: data.appSecret, publicId: data.publicId, mchId: data.mchId };
                if (data.security) $scope.security = data.security;
                if (data.registration) $scope.registration = data.registration;
                if (data.logoPath) $scope.logoPath = data.logoPath;
                if (data.footerlogoPath) $scope.footerlogoPath = data.footerlogoPath;

            }
        });
        $('#publishClubModal').modal('show');
    };

    $scope.onZipFileSelect = function ($files) {
        if ($files.length > 0) {
            if ($files[0].size > 1 * 1024 * 1024) {  //limit to 1MB
                alert(i18n.t("icem.menu.publish.upload.template.size.limit"));
            } else {
                $scope.upload = $upload.upload({
                    url: '/api/menu/upload/clubTemplate?siteId=' + $scope.cSite.id,
                    file: $files[0],
                    headers: { 'auth': $window.sessionStorage['token'] }
                }).progress(function (evt) {
                    // console.log('progress: ' + parseInt(100.0 * evt.loaded /
                    // evt.total) + '% file :'+ evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    if ($scope.zipfileName.indexOf(data.data) < 0) {
                        if ($scope.zipfileName) {
                            $scope.zipfileName = $scope.zipfileName + "," + data.data;
                        } else {
                            $scope.zipfileName = data.data;
                        }
                    }

                });
            }
        }
    };

    $scope.onLogoFileSelect = function ($files, logotype) {
        console.log("onLogoFileSelect:", $files);
        if ($files.length > 0) {
            //limit to 512KB
            if ($files[0].size > 512 * 1024) {
                alert(i18n.t("icem.menu.publish.upload.xml.size.limit"));
            } else {
                $scope.upload = $upload.upload({
                    url: '/api/menu/upload/logo?siteId=' + $scope.cSite.id + "&menuId=" + $scope.menuId + "&logoType=" + logotype,
                    file: $files[0],
                    headers: { 'auth': $window.sessionStorage['token'] }
                }).progress(function (evt) {
                    // console.log('progress: ' + parseInt(100.0 * evt.loaded /
                    // evt.total) + '% file :'+ evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    // console.log("logotype:", logotype, "data:", data);
                    if (logotype == 0) {
                        $scope.logoPath = data.data;
                    } else if (logotype = 1) {
                        $scope.footerlogoPath = data.data;
                    }
                });
            }
        }
    };

    $scope.onConfigFileSelect = function (files) {
        //limit to 512KB
        if (files[0].size > 512 * 1024) {
            alert(i18n.t("icem.menu.publish.upload.xml.size.limit"));
        } else {
            $scope.configfiles = files;
        }
    };

    $scope.onFileSelect = function ($files) {
        if ($files.length > 0) {
            $scope.upload = $upload.upload({
                url: 'api/menu/theme/bulk?siteId=' + $scope.cSite.id,
                file: $files[0],
                headers: { 'auth': $window.sessionStorage['token'] }
            }).progress(function (evt) {
                // console.log('progress: ' + parseInt(100.0 * evt.loaded /
                // evt.total) + '% file :'+ evt.config.file.name);
            }).success(function (data, status, headers, config) {
                $scope.customImage = data.data.imgPath;
                $scope.customTemplateId = data.data.id;
                loadCustomTheme();
            });
        }
    };

    $scope.publish = function (themeType, model, basicMode, files) {
        var deferred = $q.defer();
        if (!model) {
            deferred.reject("Fail");
            return deferred.promise;
        }

        if (!model.template) {
            model.template = { id: "" };
        }

        if (themeType == 0) {
            for (var i = 0; i < $scope.slides.length; i++) {
                if ($scope.slides[i].active) {
                    model.template.id = $scope.slides[i].id;
                }
            }
        } else if (themeType == 1) {
            model.template.id = $scope.customTemplateId;
        } else {
            model.template.id = 1;
        }

        if (ValidateService.isEmptyInput(["icem.microSite.template"], [model.template.id])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

        model.security = $scope.security;
        model.registration = $scope.registration;
        if (basicMode) {
            if (ValidateService.isEmptyInput(["icem.microSite.appId", "icem.microSite.appSecret", "icem.microSite.publicI"], [model.appId, model.appSecret, model.publicId])) {
                deferred.reject("Fail - ValidateService");
            } else {
                model.logoPath = $scope.logoPath;
                model.footerlogoPath = $scope.footerlogoPath;

                MenuService.saveMenuPublish($scope.cSite.id, $scope.menuId, model).then(function (response) {
                    var data = response.data;
                    $scope.menuTableParams.reload();
                    $('#publishClubModal').modal('hide');
                    deferred.resolve("Success");
                });
                // return deferred.promise;
            }
        } else {
            // console.log("publish model:", model);
            if (files[0] != null) {
                $scope.upload = $upload.upload({
                    url: '/api/menu/publish/bulk',
                    file: files[0],
                    data: {
                        siteId: $scope.cSite.id,
                        menuId: $scope.menuId,
                        templateId: model.template.id,
                        security: model.security,
                        registraion: model.registration,
                        zipfileName: $scope.zipfileName,
                        logoPath: $scope.logoPath,
                        footerlogoPath: $scope.footerlogoPath
                    },
                    headers: { 'auth': $window.sessionStorage['token'] }
                }).progress(function (evt) {
                    // console.log('progress: ' + parseInt(100.0 * evt.loaded /
                    // evt.total) + '% file :'+ evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    if (data.message != 'ok') {
                        deferred.reject("Fail");
                        alert(data.message);
                    } else {
                        deferred.resolve("Success");
                        $scope.menuTableParams.reload();
                        $('#publishClubModal').modal('hide');
                    }
                }).error(function (data) {
                    alert(data.message);
                    deferred.reject("Fail");
                });
            }
        }
        return deferred.promise;

    };

    function loadClubTemplate(menuType) {
        MenuService.getMenuTemplate($scope.cSite.id, menuType).then(function (response) {
            var data = response.data.data;
            // console.log("menuType:",menuType,"getMenuTemplate:",data);
            switch (menuType) {
                case "PROMOTION":
                    $scope.promotionOption = data;
                    break;
                case "PERSONALIZED":
                    $scope.personalizedOption = data;
                    break;
                case "RANKING":
                    $scope.rankingOption = data;
                    break;
                case "REMINDER":
                    $scope.reminderOption = data;
                    break;
                case "POINT":
                    $scope.pointOption = data;
                    break;
                case "REGISTRATION":
                    $scope.registrationOption = data;
                    break;
                case "CUSTOM":
                    $scope.customOption = data;
                    break;
                case "INJECTION":
                    $scope.injectionOption = data;
                    break;
            }
        });
    }

    function reloadItem(siteId, filters) {
        $scope.itemTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
                total: 0,
                getData: function ($defer, params) {
                    ItemService.getItemList(siteId, params.count(), params.page() - 1, filters).then(function (response) {
                        var data = response.data.data;
                        params.total(data.totalElements);
                        if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                            params.page(params.page() - 1);
                        } else {
                            $defer.resolve($scope.items = data.content);
                        }
                    });
                }
            });
    }

};


