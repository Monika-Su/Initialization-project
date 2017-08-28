'use strict';

app.controller('headbarController', headbarController);

headbarController.$inject = ['$scope', '$window', '$location', '$modal', '$route', '$timeout', '$rootScope', 'AuthService', 'CommonService', 'SessionService', 'SiteService', 'ChangeService'];

function headbarController($scope, $window, $location, $modal, $route, $timeout, $rootScope, AuthService, CommonService, SessionService, SiteService, ChangeService) {

    $scope.initHeader = function () {

        var head = document.getElementById("headbar");
        head.setAttribute("style", "display: none");

        $("title").text(i18n.t('page.title'));
        $scope.accountId = AuthService.accountId();

        if (!$scope.accountId) return;

        var loginInfo = AuthService.token();
        var menuList = AuthService.menuAuthority().currentSiteMenu;
        var functions = AuthService.menuAuthority().allSiteMenu;
        $scope.siteList = AuthService.siteAuthority().allSiteInfo;
        $scope.cSite = AuthService.siteAuthority().currentSiteInfo;

        head.setAttribute("style", "display: block");
        $scope.menuCategory = null;
        $scope.CommonService = CommonService;

        $("html,body").animate({ scrollTop: 0 }, 700);

        $scope.clickMenu = function (model) {
            menuList.map(function (obj) {
                if (obj.name === model.name) {
                    obj.active = true
                } else {
                    obj.active = false;
                }
                return obj;
            });
        };

        // initial first login 
        if (menuList.length > 0) {
            refreshInjectionMenu();;
            $scope.clickMenu(menuList[0]);// init the first menu class:active 
        };

        function refreshInjectionMenu() {
            menuList = AuthService.menuAuthority().currentSiteMenu;
            $scope.injectionMenu = menuList;
        };

        $scope.clickSite = function (site) {
            var currentPageLink = $location.url();
            var pageName = currentPageLink.slice(1, currentPageLink.length);
            functions = AuthService.menuAuthority().allSiteMenu;
            var hasAuth = false;
            window.sessionStorage['cSite'] = angular.toJson(site);

            for (var prop in functions) {
                if (prop == site.id) {
                    window.sessionStorage['menuList'] = angular.toJson(functions[prop]);

                    // refresh urlList
                    var tempUrlList = functions[prop].map(function (obj) {
                        if (obj.url === null && obj.subFunctions.length > 0) {
                            // return obj.subFunctions.map(obj => obj.url);
                            return obj.subFunctions.map(function (obj) { return obj.url });
                        } else {
                            return obj.url;
                        }
                    });
                    // var urlList = [].concat(...tempUrlList)
                    var urlList = tempUrlList.reduce(function (prev, curr) {
                        return prev.concat(curr);
                    });
                    $window.sessionStorage.setItem('urlList', angular.toJson(urlList));

                    refreshInjectionMenu();
                    $scope.clickSidebar(); // refresh sidebar
                    for (var i = 0, item; item = functions[prop][i]; i++) {
                        for (var j = 0, subitem; subitem = item.subFunctions[j]; j++) {
                            if (pageName == subitem.url) {
                                hasAuth = true;
                                $scope.clickMenu(functions[prop][i]); // re-active menu class
                                break;
                            }
                        }
                    }
                    if (hasAuth) {
                        // reload current page
                        $route.reload();
                    } else {
                        // user don't have authority of current page, redirect to default page
                        $location.url("/" + functions[prop][0].subFunctions[0].url);
                        $scope.clickMenu(functions[prop][0]);
                    }
                    break;
                }
            }
            // refresh Current Site
            $scope.cSite = AuthService.siteAuthority().currentSiteInfo;
        };

        $scope.resetPwd = function () {
            $modal.open({
                templateUrl: 'views/template/resetPwd-tpl.html',
                controller: 'resetPwdController',
                size: 'sm',
                scope: $scope,
            });
        };

        $scope.logOut = function () {
            SessionService.SignOut(loginInfo).then(function (response) {
                if (response.statusText == "OK") {
                    $window.sessionStorage.removeItem('token');
                    $location.url("/");
                }
            });
        };

        $scope.seeBroswer = function () {
            var isFirefox = typeof InstallTrigger !== 'undefined';
            var isIE = /*@cc_on!@*/false || !!document.documentMode;
            var isEdge = !isIE && !!window.StyleMedia;
            return Boolean(isFirefox || isIE || isEdge);
        };

        $scope.clickSidebar = function () {
            $timeout(function () {
                $scope.currentPath = $location.path().slice(1);
                for (var i = 0, item; item = menuList[i]; i++) {
                    for (var j = 0, subitem; subitem = item.subFunctions[j]; j++) {
                        if ($scope.currentPath === subitem.url) {
                            $scope.subFunctions = item.subFunctions;
                            break;
                        }
                    }
                }
            }, 0);
        };
        $scope.clickSidebar();

    };

    //init header
    $scope.initHeader();

};