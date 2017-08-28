'use strict';

/**
 * @ngdoc overview
 * @name iCemApp
 * @description
 * # iCemApp
 * Main module of the application.
 */

var app = window.App = window.app = angular.module('iCemApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngTouch',
  'ngTable',
  'ng-common',
  'jm.i18next',
  'ui.bootstrap',
  'popoverToggle',
  'angularFileUpload'
]);

var $routeProviderReference;

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'loginCtrl'
    })
    .otherwise({
      redirectTo: '/'
    })
    ;
  $routeProviderReference = $routeProvider;
})
  .run(['$rootScope', '$location', 'AuthService', '$timeout', '$route',
    function ($rootScope, $location, AuthService, $timeout, $route) {

      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var nextPath = next && next.$$route && next.$$route.originalPath.substr(1);
        if(AuthService.checkRouteAuth(nextPath)){
          //  console.log('no auth');
           $location.path('/');
        }
        if (!AuthService.token() || !AuthService.accountId()) {
          // console.log('no auth !');
          $location.path('/');
        };

        // default scroll to top
        $("html,body").animate({ scrollTop: 0 }, 700);

        // show sidebar when changing page with fade in animation
        if ($("#page-wrapper").css("margin-left") !== '250px') {
          $("#menuBar").css({
            "opacity": 0,
            "display": "block"
          })
            .stop()
            .animate({
              opacity: 1
            });
        }
        // inject functions in headController
        angular.element(document.getElementById('wrapper')).injector().get('$rootScope');
        if ($rootScope.$$childHead.clickSidebar) {
          $rootScope.$$childHead.clickSidebar();
        }
      });

      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        // open top-menu panel in default
        var expandStatus = $("#topExpandBtn").attr("aria-expanded");
        if ((expandStatus === "false") || (typeof expandStatus === "undefined")) {
          $timeout(function () {
            $("#topExpandBtn").click();
          }, 0);
        };

        var cPath = current && current.$$route && current.$$route.originalPath.substr(1);
        angular.element(document.getElementById('wrapper')).injector().get('$rootScope');
        if ($rootScope.$$childHead.injectionMenu) {
          activeMenu:
          for (var i = 0, item; item = $rootScope.$$childHead.injectionMenu[i]; i++) {
            for (var j = 0, subitem; subitem = item.subFunctions[j]; j++) {
              if (subitem.url === cPath) {
                $rootScope.$$childHead.clickMenu($rootScope.$$childHead.injectionMenu[i]);
                break activeMenu;
              }
            }
          }
        }
      });



    }]);

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('noCacheInterceptor');
}])
  .run(function ($rootScope, $window, $location) {
    // register listener to watch route changes
    $rootScope.$on("Error_Message", function (event, val) {
      $rootScope.errorHappen = true;
      $location.url("/");
      $window.location.reload();
    });
  })
  .factory('noCacheInterceptor', ['$q', '$injector', '$rootScope', function ($q, $injector, $rootScope, $window, $location) {
    var canceler = $q.defer();
    return {
      request: function (config) {
        if ((config.method == 'GET' || config.method == 'POST') && config.url.indexOf('.html') == -1) {
          var separator = config.url.indexOf('?') === -1 ? '?' : '&';
          config.url = config.url + separator + 'r=' + Math.random();
        }
        if (config.method == 'GET' && config.url.indexOf('.png') > -1) {
          // console.log('#request config: ',config);
        }

        config.timeout = canceler.promise;
        if ($rootScope.errorHappen) {
          // Canceling request
          canceler.resolve();
        }
        return config;
      },
      response: function (response) {
        // console.log("## response", response);
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        // console.log("## responseError", rejection);
        if (rejection.status === 401) {
          console.log("Response Error 401", rejection);
          alert("Response Error 401");
        }
        if (rejection.status === 404) {
          console.log("Response Error 404", rejection);
          alert("Response Error 404");
        }
        if (rejection.status === 403) {
          console.log("Response Error 403", rejection);
          alert("Response Error 403");
        }
        if (rejection.status === 500) {
          switch (rejection.data.message) {
            case 'error.unauthorized':
              alert("Error : " + i18n.t("AUTH_FAIL"));
              break;
            case 'incorrect password':
              alert("Error : " + i18n.t("login.error"));
              break;
            default:
              alert("Error : " + rejection.data.message);
          }
          return false;
        }
        $rootScope.$broadcast('Error_Message', rejection.status);
        return $q.reject(rejection);
      }
    };
  }]);

require('scripts/controllers/**/*');
require('scripts/service/**/*');
require('scripts/directives/**/*');
require('scripts/filter/**/*');
require('scripts/route/*');
