'use strict';

app.config(function ($routeProvider) {
  $routeProvider
    .when('/campaignRecord', {
      templateUrl: 'views/campaign/campaign.html',
      controller: 'campaignCtrl'
    })
    .when('/campaignCampaignView', {
      templateUrl: 'views/campaign/campaignView.html',
      controller: 'campaignViewCtrl'
    })
    .when('/campaignTrendView', {
      templateUrl: 'views/campaign/trendView.html',
      controller: 'trendViewCtrl'
    })
    .when('/campaignPixel', {
      templateUrl: 'views/campaign/pixel.html',
      controller: 'pixelCtrl'
    })
    .when('/campaignPixelReport', {
      templateUrl: 'views/campaign/pixelReport.html',
      controller: 'pixelReportCtrl'
    })
    .when('/campaignSegmentation', {
      templateUrl: 'views/campaign/segmentation.html',
      controller: 'segmentationCtrl'
    })
    .when('/campaignPlan', {
      templateUrl: 'views/campaign/plan.html',
      controller: 'planCtrl'
    })
});