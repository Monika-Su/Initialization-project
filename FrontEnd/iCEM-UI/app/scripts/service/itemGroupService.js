'use strict';

app.factory('ItemGroupService', function($http,$rootScope,$window) {

    var appData = {

        saveItemGroupList: function(sid,size,page,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/itemGroup/list/'+sid+'?size='+size+'&page='+page,
                    data: angular.toJson(model),
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
        saveItemGroup: function(sid,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/itemGroup/'+sid,
                    data: model,
                    contentType: 'application/json',
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
        deleteItemGroup: function(model) {
            var data = $http({
                    method:'DELETE',
                    url:'/api/itemGroup/' + model.siteId + '/' + model.id,
                    contentType: 'application/json',
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
        getItemGroup: function(sid,gid) {
            var data = $http({
                    method:'GET',
                    url:'/api/itemGroup/' + sid + '/' + gid,
                    contentType: 'application/json',
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