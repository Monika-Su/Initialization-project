'use strict';

app.config(function ($routeProvider) {
    $routeProvider
        .when('/menuManagement', {
            templateUrl: 'views/retclub/menuManagement.html',
            controller: 'menuListCtrl'
        })
        .when('/loginAttribute', {
            templateUrl: 'views/retclub/loginAttribute.html',
            controller: 'loginAttributeCtrl'
        })
        .when('/microSite', {
            templateUrl: 'views/retclub/microSite.html',
            controller: 'microSiteCtrl'
        })
        .when('/orderEntry', {
            templateUrl: 'views/retclub/orderEntry.html',
            controller: 'orderEntryCtrl'
        })
        .when('/pointRule', {
            templateUrl: 'views/retclub/pointRule.html',
            controller: 'pointRuleCtrl'
        })
});