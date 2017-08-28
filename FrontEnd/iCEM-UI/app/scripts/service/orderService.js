'use strict';

app.factory('OrderService', function($http, $rootScope, $window) {
    var appData = {
        getMemberOrder: function(siteId,memberId,size,page) {
            var data = $http({
                    method:'GET',
                    url:'/api/order/' + siteId + '/' + memberId+'?size='+size+'&page='+ page,
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        saveMemberOrder: function(siteId,memberId,orderData) {
            var data = $http({
                    method:'POST',
                    url:'/api/order/' + siteId + '/' + memberId,
                    data: angular.toJson(orderData),
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getOrderItemList: function(siteId, orderId) {
            var data = $http({
                    method:'GET',
                    url:'/api/order/item/' + siteId + '/' + orderId,
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        saveOrderItem: function(siteId,orderData) {
            var data = $http({
                    method:'POST',
                    url:'/api/order/item/' + siteId,
                    data: angular.toJson(orderData),
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        }
   };
    return appData;
});