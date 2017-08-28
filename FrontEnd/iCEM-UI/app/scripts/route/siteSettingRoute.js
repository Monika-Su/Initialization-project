'use strict';

app.config(function ($routeProvider) {
  $routeProvider
    .when('/operator', {
      templateUrl: 'views/siteSetting/operator.html',
      controller: 'operatorCtrl'
    })
    .when('/channelConfig', {
      templateUrl: 'views/siteSetting/channelConfig.html',
      controller: 'channelConfigCtrl'
    })
});