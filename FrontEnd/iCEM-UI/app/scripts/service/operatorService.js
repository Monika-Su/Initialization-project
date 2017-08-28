'use strict';

app.factory('OperatorService', function ($http, $rootScope, $window, $httpParamSerializer) {

    var appData = {
        getOperator: function () {
            var data = $http({
                method: 'GET',
                url: '/api/operator/',
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
        saveOperator: function (model) {
            var data = $http({
                method: 'POST',
                url: '/api/operator/',
                headers: { 'auth': $window.sessionStorage['token'] },
                data: model,
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        deleteOperator: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/operator/' + model.id, // operatorId
                headers: { 'auth': $window.sessionStorage['token'] },
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getOperatorSiteSetting: function (operatorId) {
            var data = $http({
                method: 'GET',
                url: '/api/operator/' + operatorId + '/siteSetting',
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
        saveOperatorSiteSetting: function (operatorId, model) {
            var data = $http({
                method: 'POST',
                url: '/api/operator/' + operatorId + '/siteSetting',
                headers: { 'auth': $window.sessionStorage['token'] },
                data: model
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        saveOperatorRegeneratePwd: function (operatorId) {
            var headersObj = {
                'auth': $window.sessionStorage['token'],
                'Access-Control-Allow-origin': '*',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            var data = $http({
                method: 'POST',
                url: '/api/operator/regeneratePassword',
                data: $httpParamSerializer({ operatorId: operatorId }),
                headers: headersObj
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
