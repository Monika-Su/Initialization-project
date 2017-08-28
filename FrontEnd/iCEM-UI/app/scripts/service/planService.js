'use strict';

app.factory('PlanService', function ($http, $window) {
    var appData = {
        savePlanList: function (sid, model, size, page) {
            var data = $http({
                method: 'POST',
                url: '/api/Plan/list/' + sid + '?size=' + size + '&page=' + page,
                data: angular.toJson(model),
                contentType: 'application/json',
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
        getMediaList: function (sid, categoryId) {
            var data = $http({
                method: 'GET',
                url: '/api/Plan/media/' + sid + '/' + categoryId,
                contentType: 'application/json',
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
        getCategoryList: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/Plan/category/' + sid,
                contentType: 'application/json',
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
        getPlanDetail: function (sid, planId) {
            var data = $http({
                method: 'GET',
                url: '/api/Plan/' + sid + '/' + planId,
                contentType: 'application/json',
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
        getPlanChart: function (sid, planId) {
            var data = $http({
                method: 'GET',
                url: '/api/Plan/chart/' + sid + '/' + planId,
                contentType: 'application/json',
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
        savePlanDetail: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/Plan/' + sid,
                contentType: 'application/json',
                data: angular.toJson(model),
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
        deletePlan: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/Plan/' + model.siteId + '/' + model.id,
                contentType: 'application/json',
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
    };

    return appData;
});