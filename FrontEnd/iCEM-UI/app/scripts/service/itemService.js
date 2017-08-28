'use strict';

app.factory('ItemService', function ($http, $rootScope, $window) {

    var appData = {

        getItemList: function (id, size, page, model) {
            var data = $http({
                method: 'POST',
                url: '/api/item/list?siteId=' + id + '&size=' + size + '&page=' + page,
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
        saveItem: function (id, model) {
            var data = $http({
                method: 'POST',
                url: '/api/item?siteId=' + id,
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
        deleteItem: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/item/' + model.id + '?siteId=' + model.siteId,
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
        getItemAttribute: function (id) {
            var data = $http({
                method: 'GET',
                url: '/api/item/attribute?siteId=' + id,
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
        saveItemAttribute: function (id, model) {
            var data = $http({
                method: 'POST',
                url: '/api/item/attribute?siteId=' + id,
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
        }
    };

    return appData;
});