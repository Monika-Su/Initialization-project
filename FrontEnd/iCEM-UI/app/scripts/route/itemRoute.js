'use strict';

app.config(function ($routeProvider) {
  $routeProvider
    .when('/item', {
      templateUrl: 'views/item/item.html',
      controller: 'itemCtrl'
    })
    .when('/itemAttribute', {
      templateUrl: 'views/item/itemAlias.html',
      controller: 'itemAliasCtrl'
    })
});
