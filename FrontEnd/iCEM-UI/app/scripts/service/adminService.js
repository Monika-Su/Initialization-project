'use strict';

app.factory('AdminService', function ($http, $rootScope, $window, $httpParamSerializer) {

    var appData = {
        //Contractor
        getAccountManagerList: function (page) {
            var data = $http({
                method: 'GET',
                url: '/api/operator/manager?size=20&' + 'page=' + page,
                headers: { 'auth': $window.sessionStorage['token'] },
                contentType: 'application/json'
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        saveAccountManager: function (obj) {
            var data = $http({
                method: 'POST',
                url: '/api/operator/manager',
                data: angular.toJson(obj),
                headers: { 'auth': $window.sessionStorage['token'] },
                contentType: 'application/json'
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    console.log("saveContractor fail:", JSON.stringify(err));
                    return err;
                });
            return data;
        },
        getNewAccountManager: function () {
            var data = $http({
                method: 'GET',
                url: '/api/operator/manager/new',
                headers: { 'auth': $window.sessionStorage['token'] },
                contentType: 'application/json'
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getAccountManager: function (operatorId) {
            var data = $http({
                method: 'GET',
                url: '/api/operator/manager/' + operatorId,
                headers: { 'auth': $window.sessionStorage['token'] },
                contentType: 'application/json'
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        deleteContractor: function (owningAccountId) {
            var data = $http({
                method: 'DELETE',
                url: '/api/account/' + owningAccountId,
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
        upContractorPwd: function (obj) {
            var headersObj = {
                'auth': $window.sessionStorage['token'],
                'Access-Control-Allow-origin': '*',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            var data = $http({
                method: 'POST',
                url: '/api/operator/regeneratePassword',
                data: $httpParamSerializer({ operatorId: obj.id }),
                headers: headersObj
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },

        //Operator
        getOperatorList: function (page) {
            var data = $http({
                method: 'GET',
                url: '/api/operator/admin_operator?size=20&' + 'page=' + page,
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
        getEditOperatorList: function () {
            var data = $http({
                method: 'GET',
                url: '/api/operator/admin_operator/edit',
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
        saveOperator: function (obj) {
            var data = $http({
                method: 'POST',
                url: '/api/operator/admin_operator',
                data: angular.toJson(obj),
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