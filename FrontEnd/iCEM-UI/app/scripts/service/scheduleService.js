

app.factory('ScheduleService', function ($http, $rootScope, $window) {
    var appData = {
        getScheMethodAds: function (sid, scheduleJobGroup) {
            var data = $http({
                method: 'GET',
                url: '/api/schedule/adsMethod?siteId=' + sid + '&scheduleJobGroup=' + scheduleJobGroup,
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
        getScheList: function (sid, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/schedule/list?siteId=' + sid + '&method=&size=' + size + '&page=' + page,
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
        getScheListAll: function (sid, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/schedule/all?siteId=' + sid,
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
        deleteScheList: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/schedule/' + model.id + '?siteId=' + model.siteId + '&ads=true',
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
        getScheDetail: function (sid, model) {
            var data = $http({
                method: 'GET',
                url: '/api/schedule/detail/' + model.scheduleId + '?siteId=' + sid,
                params: model,
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
        //url: '/api/schedule/detail/' + method + '?siteId=' + sid,
        upScheDetail: function (sid, method, model) {
            var data = $http({
                method: 'POST',
                url: '/api/schedule/detail/doubleclick?siteId=' + sid,
                data: angular.toJson(model),
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
        saveScheDetail: function (sid, method, model) {
            var data = $http({
                method: 'POST',
                url: '/api/schedule/detail/doubleclick?siteId=' + sid,
                data: angular.toJson(model),
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
        getScheRun: function (sid, url) {
            var data = $http({
                method: 'GET',
                url: '/api/schedule/run/' + url.scheduleId + '?siteId=' + sid,
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
