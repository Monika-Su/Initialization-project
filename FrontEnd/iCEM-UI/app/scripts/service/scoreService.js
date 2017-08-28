app.factory('ScoreService', function($http, $rootScope, $window) {
    var appData = {
        saveScoreRuleList: function(sid, model, size, page) {
            var data = $http({
                    method:'POST',
                    url: '/api/score/list/scoreRule/' + sid + '?size=' + size + '&page=' + page,
                    data: angular.toJson(model),
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
         getAttributes: function(sid) {
            var data = $http({
                    method:'GET',
                    url:'/api/score/scoreRule/attribute/'+ sid,
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
        saveScoreRule: function(sid, model) {
            var data = $http({
                    method:'POST',
                    url: '/api/score/scoreRule/' + sid,
                    data: angular.toJson(model),
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
        getScoreRule: function(sid, scoreRuleId) {
            var data = $http({
                    method:'GET',
                    url: '/api/score/scoreRule/' + sid + '/' + scoreRuleId,
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
        deleteScoreRule: function(model) {
            var data = $http({
                    method: 'DELETE',
                    url: '/api/score/scoreRule/' + model.id + '?siteId=' + model.siteId,
                    contentType: 'application/json',
                    headers: {'auth': $window.sessionStorage['token']}
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    return err;
                });
            return data;
        },
   };
    return appData;
});
