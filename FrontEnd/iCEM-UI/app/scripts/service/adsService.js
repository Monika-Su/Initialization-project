'use strict';

app.factory('AdsService', function($http, $rootScope, $window) {
    var appData = {
        getAdsSegRuleList: function(sid, url) {
            var data = $http({
                    method:'GET',
                    url: '/api/ipcrm/ads/segment/rule/list?sid=' + sid,
                    params: url,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        upAdsSegRuleList: function(sid, url) {
            var data = $http({
                    method:'PUT',
                    url: '/api/ipcrm/ads/segment/rule/list?sid=' + sid,
                    params: url,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        deleteAdsSegRuleList: function(sid, url) {
            var data = $http({
                    method:'DELETE',
                    url: '/api/ipcrm/ads/segment/rule/list?sid=' + sid,
                    params: url,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegRuleDetail: function(sid, url) {
            var data = $http({
                    method:'GET',
                    url: '/api/ipcrm/ads/segment/rule/detail?sid=' + sid,
                    params: url,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        upAdsSegRuleDetail: function(sid, adsSegmentId, model) {
            var data = $http({
                    method:'PUT',
                    url: '/api/ipcrm/ads/segment/rule/detail?sid=' + sid + '&adsSegmentId=' + adsSegmentId,
                    data: model,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        saveAdsSegRuleDetail: function(sid, adsSegmentId, model) {
            var data = $http({
                    method:'POST',
                    url: '/api/ipcrm/ads/segment/rule/detail?sid=' + sid + '&adsSegmentId=' + adsSegmentId,
                    data: model,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegList: function(sid, url) {
            var data = $http({
                    method:'GET',
                    url: '/api/ipcrm/ads/segment/list?sid=' + sid,
                    params: url,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        deleteAdsSegList: function(sid, adsSegmentId) {
            var data = $http({
                    method:'DELETE',
                    url: '/api/ipcrm/ads/segment/list?sid=' + sid + '&adsSegmentId=' + adsSegmentId,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegNames: function(sid, scheduleJobGroup) {
            var data = $http({
                    method:'GET',
                    url: '/api/segment/adsSegment?siteId=' + sid + '&scheduleJobGroup=' + scheduleJobGroup,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        upAdsSegDetail: function(sid, model) {
            var data = $http({
                    method:'PUT',
                    url: '/api/ipcrm/ads/segment/detail?sid=' + sid,
                    data: model,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        saveAdsSegDetail: function(sid, model) {
            var data = $http({
                    method:'POST',
                    url: '/api/ipcrm/ads/segment/detail?sid=' + sid,
                    data: model,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegStatList: function(sid) {
            var data = $http({
                    method:'GET',
                    url: '/api/segment/segmentHistory?siteId=' + sid,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegStatAllList: function(sid) {
            var data = $http({
                    method:'GET',
                    url: '/api/segment/segmentHistory/all?siteId=' + sid,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegStatAllDetail: function(sid, model) {
            var data = $http({
                    method:'GET',
                    url: '/api/segment/segmentResults/all?siteId=' + sid,
                    data: model,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegStatAllResultList: function(sid) {
            var data = $http({
                    method:'GET',
                    url: '/api/segment/segmentResults/all?siteId=' + sid,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        deleteAdsSegStatAllResultList: function(sid, model) {
            var data = $http({
                    method:'DELETE',
                    url: '/api/segment/segmentResults?siteId=' + sid + '&name=' + model.name,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegStatAllResultPush: function(sid, scheduleId, url) {
            var data = $http({
                    method:'GET',
                    url: '/api/segment/segmentResults/push/'+scheduleId+'?siteId=' + sid,
                    params: url,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
        getAdsSegStatAllScheduleList: function(sid) {
            var data = $http({
                    method:'GET',
                    url: '/api/schedule/all?siteId=' + sid,
                    contentType: 'application/json',
                    headers:{'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        }
   };
    return appData;
});
