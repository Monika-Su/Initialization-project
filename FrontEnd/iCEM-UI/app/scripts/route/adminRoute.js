'use strict';

app.config(function ($routeProvider) {
  $routeProvider
    .when('/adminContractor', {
      templateUrl: 'views/admin/adminContractor.html',
      controller: 'contractorCtrl'
    })
    .when('/adminOperator', {
      templateUrl: 'views/admin/adminOperator.html',
      controller: 'adminOperatorCtrl'
    })
    .when('/adminExpiringSite', {
      templateUrl: 'views/admin/adminExpiringSite.html',
      controller: 'expiringSiteCtrl'
    })
});