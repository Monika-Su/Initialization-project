'use strict';

app.factory('ReportService', function ($http, $rootScope, $window) {

    var appData = {
        getitemOrderInfoTopDay: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/itemOrderInfoTopDay?siteId=' + sid + '&startTime=' + start + '&endTime=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getReferPageInfoTopDay: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/referPageInfoTopDay?siteId=' + sid + '&startTime=' + start + '&endTime=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getReferSiteInfoTopDay: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/referSiteInfoTopDay?siteId=' + sid + '&startTime=' + start + '&endTime=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getLandingInfoTopDay: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/landingInfoTopDay?siteId=' + sid + '&startTime=' + start + '&endTime=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getPageInfoTopDay: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/pageInfoTopDay?siteId=' + sid + '&startTime=' + start + '&endTime=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getBehaviorDay: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/behaviorDay?siteId=' + sid + '&startDate=' + start + '&endDate=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getBehaviorMonth: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/behaviorMonth?siteId=' + sid + '&startMonth=' + start + '&endMonth=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getBehaviorYear: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/behaviorYear?siteId=' + sid + '&startYear=' + start + '&endYear=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getGeoSum: function (sid, start, end, province, country) {
            var data = $http({
                method: 'GET',
                url: '/api/report/geoSum?siteId=' + sid + '&startTime=' + start + '&endTime=' + end + '&province=' + province + '&country=' + country,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getTrackingGeo: function (sid, dateType, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/report/tracking/Geo',
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getFootprint: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/footprintSum?siteId=' + sid + '&startTime=' + start + '&endTime=' + end + "&limit=5",
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getPixelFootprint: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/pixelFootprintSum?siteId=' + sid + '&startTime=' + start + '&endTime=' + end + "&limit=5",
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getPixelByDay: function (sid, pixel, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/pixelByDay?siteId=' + sid + '&pixel=' + pixel + '&startTime=' + start + '&endTime=' + end,
                // contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getPixelDaySum: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/pixelDaySum?siteId=' + sid + '&startTime=' + start + '&endTime=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        },
        getSalesActivity: function (sid, start, end) {
            var data = $http({
                method: 'GET',
                url: '/api/report/salesActivityDay?siteId=' + sid + '&startDate=' + start + '&endDate=' + end,
                contentType: 'application/json',
                headers: { 'auth': $window.sessionStorage['token'] }
            })
                .success(function (response) {
                    return response;
                })
                .error(function (err) {
                    return err;
                });
            return data;
        }
    };
    return appData;
});
