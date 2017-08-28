'use strict';

app.factory('PointService', function ($http, $rootScope, $window) {

    var appData = {
        getPointRuleList: function (siteId, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/point/getPointRuleList/' + siteId + '?size=' + size + '&page=' + page,
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getCalcDiscount: function (siteId, originalPrice, costPoints) {
            var data = $http({
                method: 'GET',
                url: '/api/point/calcDiscount/' + siteId + '?originalPrice=' + originalPrice + '&costPoints=' + costPoints,
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getMaxUsefulPoints: function (siteId, originalPrice, memberId) {
            var data = $http({
                method: 'GET',
                url: '/api/point/getMaxUsefulPoints/' + siteId + "?originalPrice=" + originalPrice +'&memberId=' + memberId,
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        savePointRule: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/point/savePointRule/' + siteId,
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        removePointRule: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/point/deletePointRule/' + model.siteId + '?ruleId=' + model.id,
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        }
    };
    return appData;
});
