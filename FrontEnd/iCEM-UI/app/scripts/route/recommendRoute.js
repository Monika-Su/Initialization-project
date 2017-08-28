'use strict';

app.config(function ($routeProvider) {
  $routeProvider
    .when('/recommendContent', {
      templateUrl: 'views/recommend/recommendContent.html',
      controller: 'recommendContentCtrl'
    })
    .when('/recommendConfiguration', {
      templateUrl: 'views/recommend/recommendConfiguration.html',
      controller: 'recommendConfCtrl'
    })
    .when('/tags', {
      templateUrl: 'views/recommend/tags.html',
      controller: 'tagsCtrl'
    })
    .when('/recommendItem', {
      templateUrl: 'views/recommend/recommendItem.html',
      controller: 'recommendItemCtrl'
    })
    .when('/scoreRule', {
      templateUrl: 'views/recommend/scoreRule.html',
      controller: 'scoreRuleCtrl'
    })
});
