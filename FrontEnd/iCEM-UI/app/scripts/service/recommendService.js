'use strict';

app.factory('RecommendService', function($http,$rootScope,$window) {

    var appData = {

        getRecommendItem: function(siteId,recommendContentId) {
            var data = $http({
                    method:'GET',
                    url:'/api/recommend/item/' + siteId + '/' + recommendContentId,
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
        getRecommendFieldList: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api/recommend/field/list/' + siteId,
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
        deleteRecommend: function(model) {
            var data = $http({
                    method:'DELETE',
                    url:'/api/recommend/' + model.siteId + '/' + model.id,
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
        saveRecommend: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/recommend/'+siteId,
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
        saveRecommendList: function(siteId, model, size, page) {
            var data = $http({
                    method:'POST',
                    url:'/api/recommend/list/' + siteId + '?size=' + size + '&page=' + page,
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
        saveRecommendItem: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/recommend/item/'+siteId,
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
        }
   };
    return appData;
});
