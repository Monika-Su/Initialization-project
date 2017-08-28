'use strict';

app.config(function ($routeProvider) {

$routeProvider
    .when('/behaviorAnalytics', {
        templateUrl: 'views/report/behavior.html',
        controller: 'reportCtrl'
    }).
    when('/salesAnalytics', {
        templateUrl: 'views/report/salesAnalytics.html',
        controller: 'salesAnalyticsCtrl'
    }).
    when('/trackingMap', {
        templateUrl: 'views/report/trackingMap.html',
        controller: 'reportCtrl',
        activetab: 'trackingMap'
    }).
    when('/lab', {
        templateUrl: 'views/report/trackingMap.html',
        controller: 'reportCtrl',
        activetab: 'lab'
    }).
    when('/detailReport', {
        templateUrl: 'views/report/detailReport.html',
        controller: 'detailReportCtrl',
    });
});