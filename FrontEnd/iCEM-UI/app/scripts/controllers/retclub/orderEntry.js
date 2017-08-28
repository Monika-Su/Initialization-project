'use strict';

app.controller('orderEntryCtrl', orderEntryCtrl);

orderEntryCtrl.$inject = ['$scope', '$filter', '$q', '$window', 'ngTableParams', 'CommonService', 'MemberService', 'OrderService', 'MenuService', 'ItemService', 'PointService', 'ValidateService'];

function orderEntryCtrl($scope, $filter, $q, $window, ngTableParams, CommonService, MemberService, OrderService, MenuService, ItemService, PointService, ValidateService){

    // panel show and hide
    $scope.showMemberOrder = false;

    // container object
    $scope.tempOrderItems = [];
    
   // for init and search object
    $scope.memberObj = { name: null, phoneNumber: null, email: null, accountName: null, memberBinding: null };
    $scope.items = { code: null, name: null, grouping: null, category: null };


    if ($scope.cSite) {
        ItemService.getItemList($scope.cSite.id, 1000, 0, $scope.items).then(function (response) {
            $scope.itemList = response.data.data.content;
            $scope.item = $scope.itemList[0];
        });
    }

    // Options
    $scope.memberProperties = ["name", "phoneNumber", "email"];

    $scope.channels = [
        { name: "ADMIN" },
        { name: "WECHAT" },
        { name: "PC" }
    ];

    function PointConstructor() {
        this.costPoints = 0;
        this.accumulationRule = null;
        this.reductionRule = null;
        this.originTotalPrice = 0;
        this.addedPoints = 0;
        this.discountPrice = 0;
        this.member = {
            "memberId": null,
            "availablePoints": null,
            "maxUsefulPoints": null
        };

        this.init = function () {
            this.originTotalPrice = 0;
            this.costPoints = 0;
            this.addedPoints = 0;
            this.discountPrice = 0;
            this.accumulationRule = null;
            this.reductionRule = null;
        };

        this.allPointCal = function () {
            this.originTotalCal();
            this.maxUsefulPointsCal();
            this.discountPriceCal();
            this.addedPointsCal();
        };

        this.maxUsefulPointsCal = function () {
            if (this.reductionRule && this.reductionRule !== null) {
                this.member.maxUsefulPoints = (100 * this.originTotalPrice) / this.reductionRule.percentage;
            }
        };

        this.originTotalCal = function () {
            // var self = this;
            var total = 0;
            angular.forEach($scope.cartList, function (item) {
                if (!item.discount) {
                    total += item.number * item.price;
                } else {
                    total += item.number * item.discount;
                }
            });
            this.originTotalPrice = total || 0;
        };

        this.addedPointsCal = function () {
            var addedPointsValue = 0
            if (this.accumulationRule !== null && this.accumulationRule.percentage) {
                if (this.discountPrice > -1) {
                    addedPointsValue = this.discountPrice * (this.accumulationRule.percentage / 100);
                } else {
                    addedPointsValue = this.originTotalPrice * (this.accumulationRule.percentage / 100);
                }
            }
            this.addedPoints = addedPointsValue;
        };

        this.discountPriceCal = function () {
            this.costPoints = this.costPoints < this.member.maxUsefulPoints ? this.costPoints : this.member.maxUsefulPoints;
            var discountPriceValue = 0
            if (this.reductionRule !== null && this.reductionRule.percentage) {
                discountPriceValue = this.originTotalPrice - this.costPoints * (this.reductionRule.percentage / 100)
            } else {
                discountPriceValue = this.originTotalPrice;
            }
            this.discountPrice = discountPriceValue;
        };

        this.reload = function (flag) {
            if (!$scope.cSite) return;
            var self = this;
            self.originTotalCal();
            PointService.getCalcDiscount($scope.cSite.id, self.originTotalPrice, +self.costPoints).then(function (response) {
                var data = response.data.data;
                self.accumulationRule = data.accumulationRule;
                self.reductionRule = data.reductionRule;
                self.allPointCal();
                // console.log('PointService ajax pointCalculator : \n', $scope.pointCalculator);
            });
        };
    };

    $scope.pointCalculator = new PointConstructor();

    initSearch();
    loadMemberListTable();

    $scope.searchUser = function (model) {
        // console.log("searchUser:", model);
        $("#rt_checkout_event").html("&nbsp;");

        if (model.text == "") {
            alert("[" + i18n.t("icem.orderEntry.SearchUser") + "] "
                + i18n.t("icem.mandatory"));
            return;
        };

        if ($("#rt_discount").length > 0) {
            $("#rt_discount").html("");
        }

        $scope.memberListTableParams = new ngTableParams({
            page: 1,
            count: 5
        }, {
                total: 0,
                getData: function ($defer, params) {

                    MemberService.filterMember($scope.cSite.id, model.type, model.text, params.count(), params.page() - 1).then(function (response) {
                        var data = response.data.data;
                        params.total(data.totalElements);
                        $scope.tempMemberList = angular.copy(data.content);
                        $defer.resolve(data.content);
                        if ($scope.tempMemberList === undefined || $scope.tempMemberList.length == 0) {
                            alert(i18n.t("icem.orderEntry.checkout.no.data"));
                            initSearch();
                            return;
                        }
                        // $scope.clickMember($scope.tempMemberList[0]);
                        if ($scope.tempMemberList.length > 0) {
                            if ($scope.choosenMember !== null) {
                                $scope.clickMember($scope.choosenMember);
                            } else {
                                $scope.clickMember($scope.tempMemberList[0]);
                            }
                        }
                    });
                }
            });
    };

    $scope.changeSearchType = function () {
        $scope.search.text = "";
    };

    $scope.clearSearch = function () {
        initSearch();
    };

    function loadMemberListTable() {
        if ($scope.memberListTableParams) {
            $scope.memberListTableParams.reload();
        } else {
            $scope.memberListTableParams = new ngTableParams({
                page: 1,
                count: 5,
            }, {
                    total: 0,
                    getData: function ($defer, params) {

                        if (!$scope.cSite) return;

                        MemberService.getMemberList($scope.cSite.id, params.count(), params.page() - 1, $scope.memberObj).then(function (response) {
                            var data = response.data.data;

                            params.total(data.totalElements);

                            $scope.tempMemberList = angular.copy(data.content);

                            if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                                params.page(params.page() - 1);
                            } else {
                                $defer.resolve(data.content);
                            }

                            if ($scope.tempMemberList.length > 0) {
                                if ($scope.choosenMember !== null) {
                                    refreshChoosenMember();
                                    $scope.clickMember($scope.choosenMember);
                                } else {
                                    $scope.clickMember($scope.tempMemberList[0]);
                                }
                            }

                        });
                    }
                });
        }
    }

    function refreshChoosenMember() {
        for (var i = 0, item; item = $scope.tempMemberList[i]; i++) {
            if (item.memberId === $scope.choosenMember.memberId) {
                $scope.choosenMember.availablePoints = item.availablePoints;
                $scope.choosenMember.allPoints = item.allPoints;
                $scope.pointCalculator.member.availablePoints = $scope.choosenMember.availablePoints;
                $scope.pointCalculator.member.memberId = $scope.choosenMember.memberId;
                break;
            }
        }
    }

    $scope.clickMember = function (model) {

        $scope.choosenMember = model;
        $scope.pointCalculator.member.availablePoints = $scope.choosenMember.availablePoints;
        $scope.pointCalculator.member.memberId = $scope.choosenMember.memberId;

        if ($scope.TradeListTableParams) {
            $scope.TradeListTableParams.reload();
        } else {
            $scope.TradeListTableParams = new ngTableParams({
                page: 1,
                count: 5,
            }, {
                    total: 0,
                    getData: function ($defer, params) {

                        OrderService.getMemberOrder($scope.cSite.id, $scope.choosenMember.memberId, params.count(), params.page() - 1).then(function (response) {
                            var data = response.data.data;

                            params.total(data.totalElements);
                            $scope.tempTradeList = angular.copy(data.content);

                            if (params.page() > 1 && (!data.content || data.content.length == 0)) {
                                params.page(params.page() - 1);
                            } else {
                                // $defer.resolve(data.content.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                $defer.resolve(data.content);
                            }

                            $scope.showMemberOrder = (data.content.length > 0) ? true : false;
                        });
                    }
                });
        }
    };

    $scope.filterItem = function (model) {

        if (!$scope.cSite) return;
        model = (model != "") ? model : null;
        $scope.items = { code: null, name: model, grouping: null, category: null };

        ItemService.getItemList($scope.cSite.id, 1000, 0, $scope.items).then(function (response) {
            $scope.itemList = response.data.data.content;
            if ($scope.itemList.length > 0) {
                $scope.item = $scope.itemList[0];
            }
        });
    };

    $scope.addItem = function (model, count) {

        if ($scope.choosenMember === null) {
            alert(i18n.t("icem.orderEntry.member.selected"));
            return;
        }

        var item;
        if (typeof model === 'string') {
            item = JSON.parse(model);
        } else if (typeof model === 'object') {
            item = model;
        }

        if (!item && $scope.itemList.length > 0) {
            item = $scope.itemList[0];
        };

        if (!item) {
            alert("[" + i18n.t("icem.orderEntry.add.item.name") + "] "
                + i18n.t("icem.mandatory"));
            return;
        };

        if ($scope.itemList[0].itemId != item.itemId && $scope.itemList.length == 1) {
            item = $scope.itemList[0];
        };

        if (!count | !count > 0) {
            alert("[" + i18n.t("icem.orderEntry.add.item.number") + "] "
                + i18n.t("icem.mandatory"));
            return;
        };

        var duplicateItem = [];
        duplicateItem = $filter('filter')($scope.cartList, { itemId: item.itemId }, true);
        if (duplicateItem.length > 0) {
            alert("[" + i18n.t("icem.orderEntry.add.item.name") + "] "
                + i18n.t("icem.duplicate"));
            return;
        };

        var choosenItem = [];
        choosenItem = $filter('filter')($scope.itemList, { itemId: item.itemId }, true);
        choosenItem[0].number = count;
        $scope.cartList.push(choosenItem[0]);

        $scope.pointCalculator.reload();
        // $scope.pointCalculator.loadUsefulPoints();
        clearAddItem();
    };

    $scope.removeItem = function (model) {
        angular.forEach($scope.cartList, function (obj, idx) {
            if (obj.itemId === model) {
                $scope.cartList.splice(idx, 1);
            }
        });

        if ($scope.cartList.length > 0 || $scope.cartList != undefined) {
            $scope.pointCalculator.reload();
        } else {
            $scope.pointCalculator.init();
        }
    };

    $scope.checkout = function () {
        var deferred = $q.defer();
        if ($scope.choosenMember === null) {
            alert(i18n.t("icem.orderEntry.member.selected"));
            deferred.reject("Fail");
            return deferred.promise;
        }

        var itemList = formatItemData($scope.cartList);
        var finalPointCalculator = Object.assign({}, $scope.pointCalculator);

        var orderData = {
            orderId: null,
            memberId: $scope.choosenMember.memberId,
            total: finalPointCalculator.originTotalPrice || 0,
            orderDate: null,
            usedPoints: finalPointCalculator.costPoints || 0,
            getPoints: finalPointCalculator.addedPoints || 0,
            discountTotal: finalPointCalculator.discountPrice || 0,
            remark: null,
            orderItems: itemList
        };

        // console.log("orderData:", orderData);
        OrderService.saveMemberOrder($scope.cSite.id, $scope.choosenMember.memberId, orderData).then(function (response) {
            if (response.data.success) {
                resetCheckout();
                // $scope.memberListTableParams.reload();
                // $scope.clickMember($scope.choosenMember);
                // $scope.choosenMember.availablePoints = ;
                // $scope.choosenMember.allPoints = ;
                // $scope.memberListTableParams.reload();
                loadMemberListTable();
                alert(i18n.t('icem.orderEntry.checkout.complete'));
                deferred.resolve("Success : saveMemberOrder");
            } else {
                deferred.reject("Fail : saveMemberOrder");
            }
        });
        return deferred.promise;
    };

    $scope.getOrderItems = function (orderId) {

        OrderService.getOrderItemList($scope.cSite.id, orderId).then(function (response) {
            var data = response.data.data;
            // console.log("getOrderItems:", data);
            $scope.getOrderData = [];
            $scope.getOrderData = angular.copy(data);
            $scope.tempOrderItems = angular.copy(data);
            $('#orderItemsModal').modal('show');
        });
    };

    $scope.editDetail = function (model) {
        model.$$edit = true;
    };

    $scope.cancelSaveOrderDetail = function (model) {
        // console.log("cancelSaveOrderDetail:", model);
        var isFindFlag = false;
        angular.forEach($scope.tempOrderItems, function (m) {
            if (!isFindFlag) {
                if (m.id == model.id) {
                    for (var key in m) {
                        model[key] = m[key];
                    }
                    model.$$edit = false;
                    isFindFlag = true;
                }
            }
        });
    };

    $scope.saveOrderDetail = function (model) {
        if (ValidateService.isEmptyInput(["icem.orderEntry.add.item.number"], [model.quantity])) {
            return;
        }
        model.$$edit = false;
        var newOrderObj = {
            category: model.category,
            discount: model.discount,
            id: model.id,
            itemId: model.itemId,
            name: model.name,
            orderId: model.orderId,
            quantity: model.quantity,
            unitPrice: model.unitPrice
        };

        OrderService.saveOrderItem($scope.cSite.id, newOrderObj).then(function (response) {
            $scope.clickMember($scope.choosenMember);
            alert(i18n.t("icem.orderEntry.detail.change.complete"));
        });
    };

    function initSearch() {
        $scope.search = { type: $scope.memberProperties[0], text: "" };
        $scope.tempMemberList = [];
        $scope.tempTradeList = [];
        $scope.item = {};
        $scope.count = '';
        $scope.cartList = [];
        $scope.choosenMember = null;
        $scope.memberTradeData = {};
        $scope.searchItemName = '';
        $scope.itemId = '';
        $scope.pointCalculator.init();
        $scope.email = {};
        $scope.emailObj = { emailAddress: '', emailMemberName: '', emailMemberPhone: '', emailMemberAddress: '', emailOrderDetail: '', emailTotalPrice: '' };
    };




    function sprintf(template, values) {
        return template.replace(/%s/g, function () {
            return values.shift();
        });
    };

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    function resetCheckout() {
        $scope.pointCalculator.init();
        $scope.cartTotal = 0;
        $scope.itemTable = '';
        $scope.seatItemName = '';
        $scope.itemCount = 1;
        $scope.cartList = [];
    };

    function clearAddItem() {
        $scope.item = {};
        $scope.count = '';
        $scope.searchItemName = '';
    }

    function formatItemData(list) {
        // console.log('list : ',list);
        var data = [];
        for (var i = 0; i < list.length; i++) {
            var itemObj = {
                id: null,
                orderId: null,
                itemId: list[i].itemId,
                name: list[i].name,
                category: null,
                quantity: list[i].number,
                unitPrice: list[i].price,
                discount: list[i].discount
            };
            data.push(itemObj);
        }
        return data;
    }

};
