'use strict';

app.factory('MicroSiteService', function($http, $rootScope,$window) {
    var appData = {
        getMicroSiteList: function(sid) {
            var data = $http({
                    method:'GET',
                    url: '/api/microSite?siteId=' + sid,
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
        saveMicroSiteDetail: function(sid, model) {
            var data = $http({
                    method:'POST',
                    url: '/api/microSite?siteId=' + sid,
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
        deleteMicroSiteDetail: function(sid, microSiteId) {
            var data = $http({
                    method:'DELETE',
                    url: '/api/microSite/'+microSiteId+'?siteId=' + sid,
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
        getMicroSiteSyncMenu: function(sid, microSiteId) {
            var data = $http({
                    method:'GET',
                    url: '/api/microSite/syncMenu/'+microSiteId+'?siteId=' + sid,
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
        getMicroSiteDetailJson: function(sid,microSiteId) {
            var data = $http({
                    method:'GET',
                    url: '/api/microSite/menuDetail/'+microSiteId+'?siteId=' + sid,
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
        saveMicroSitePublish: function(sid, microSiteId) {
            var data = $http({
                    method:'POST',
                    url: '/api/microSite/publish/'+microSiteId+'?siteId=' + sid,
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
        saveMicroSiteUpdateMenuJson: function(sid,microSiteId,model) {
            var data = $http({
                    method:'POST',
                    url: '/api/microSite/menuDetail/'+microSiteId+'?siteId=' + sid,
                    data: angular.toJson(model),
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
        getMicroSiteMenuPublishedList: function(sid, microSiteId) {
            var data = $http({
                    method:'GET',
                    url: '/api/microSite/menuPublished/list/'+microSiteId+'?siteId='+sid,
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
   };
    return appData;
});