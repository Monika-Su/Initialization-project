'use strict';

app.factory('UserService', function ($http, $rootScope, $window) {
    var appData = {
        getLoginFields: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/retclubCommon/loginFields?siteId=' + sid,
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
        getLoginFieldTypes: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/retclubCommon/loginFields/type?siteId=' + sid,
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
        getLoginField: function (sid, fieldId) {
            var data = $http({
                method: 'GET',
                url: '/api/retclubCommon/loginFields/' + fieldId + '?siteId=' + sid,
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
        saveLoginField: function (sid, field) {
            var data = $http({
                method: 'POST',
                url: '/api/retclubCommon/loginFields?siteId=' + sid,
                data: angular.toJson(field),
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
        deleteLoginFieldsDetail: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/retclubCommon/loginFields/' + model.id + '?siteId=' + model.siteId,
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
        }
    };
    return appData;
});