'use strict';

app.factory('SiteService', function($http,$rootScope,$window) {

    var appData = {

        getSiteList: function(accountId) {
            var data = $http({
                    method:'GET',
                    url: '/api/site/account/'+accountId,
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
        getNewSite: function() {
            var data = $http({
                    method:'GET',
                    url: '/api/site/new',
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
        saveSite: function(accountId,obj) {
            var data = $http({
                    method:'POST',
                    url: '/api/site/account/'+accountId,
                    data: obj,
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
        getEditSite: function(siteId) {
            var data = $http({
                    method:'GET',
                    url: '/api/site/'+siteId,
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
        deleteSite: function(siteId) {
            var data = $http({
                    method:'DELETE',
                    url: '/api/site/'+siteId,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    console.log("deleteSite failed " + JSON.stringify(err));
                    return err;
                });
            return data;
        },
        getExpiredSites: function() {
            var data = $http({
                    method:'GET',
                    url: '/api/site/expired',
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
        getSiteGroupList: function(siteId) {
            var data = $http({
                    method:'GET',
                    url: '/api/site/'+siteId+'/siteGroup',
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
        saveSiteGroupList: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url: '/api/site/'+siteId+'/siteGroup',
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']},
                    data: model
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        deleteSiteGroupList: function(siteId, siteGroupId) {
            var data = $http({
                    method:'DELETE',
                    url: '/api/site/'+siteId+'/siteGroup/'+siteGroupId,
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
