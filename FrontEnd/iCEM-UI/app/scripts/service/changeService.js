'use strict';

app.factory('ChangeService', function($http, $rootScope) {

    var appData = {

        getApplycheck: function(id) {
            var data = $http({
                    method:'GET',
                    url: serverName+'api/ipcrm/changes/check?siteId='+id,
                    data: angular.toJson({}),
                    contentType: 'application/json',
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        saveApply: function() {
            var data = $http({
                    method:'POST',
                    url: serverName+'api/ipcrm/changes/list',
                    data: angular.toJson({}),
                    contentType: 'application/json',
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getList: function(id) {
            var data = $http({
                    method:'GET',
                    url: serverName+'api/ipcrm/changes/list?siteId='+id,
                    data: angular.toJson({}),
                    contentType: 'application/json',
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getApplyDetail: function(id,obj) {
            var data = $http({
                    method:'GET',
                    url: serverName+'api/ipcrm/changes/detail?siteId='+id,
                    data: angular.toJson(obj),
                    contentType: 'application/json',
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