'use strict';

app.factory('AuthService', ['$window', '$timeout', function ($window, $timeout) {

    var authService = {};

    authService.accountId = function () {
        var accountId = $window.sessionStorage.accountId || false;
        return accountId;
    };

    authService.token = function () {
        var token = $window.sessionStorage.token || false;
        return token;
    };

    authService.menuAuthority = function () {
        var menuAuthority = {};
        var allSiteMenu = $window.sessionStorage.functions;
        var currentSiteMenu = $window.sessionStorage.menuList;
        menuAuthority.allSiteMenu = allSiteMenu ? JSON.parse(allSiteMenu) : false;
        menuAuthority.currentSiteMenu = currentSiteMenu ? JSON.parse(currentSiteMenu) : false;
        return menuAuthority;
    };

    authService.urlAuthority = function () {
        var urlList = $window.sessionStorage.urlList ? JSON.parse($window.sessionStorage.urlList) : false;
        return urlList;
    };

    authService.siteAuthority = function () {
        var siteAuthority = {};
        var allSiteInfo = $window.sessionStorage.siteStorage;
        var currentSiteInfo = $window.sessionStorage.cSite;
        siteAuthority.allSiteInfo = $window.sessionStorage.siteStorage ? JSON.parse($window.sessionStorage.siteStorage) : false;
        siteAuthority.currentSiteInfo = $window.sessionStorage.cSite ? JSON.parse($window.sessionStorage.cSite) : false;
        return siteAuthority;
    };

    authService.checkRouteAuth = function (model) {
        var urlList = this.urlAuthority();
        return urlList ? urlList.indexOf(model) === -1 : false
    };

    return authService;

}]);