'use strict';

app.config(function ($routeProvider) {
  $routeProvider
    .when('/member', {
      templateUrl: 'views/member/member.html',
      controller: 'memberCtrl'
    })
    .when('/memberAttribute', {
      templateUrl: 'views/member/memberAttribute.html',
      controller: 'memberAttributeCtrl'
    })
});