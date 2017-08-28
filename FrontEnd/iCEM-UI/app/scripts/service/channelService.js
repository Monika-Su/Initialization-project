app.factory('ChannelService', function($http, $rootScope, $window) {
    var appData = {
        getChannelConfList: function(sid) {
            var data = $http({
                    method:'GET',
                    url: '/api/channelConf/list/' + sid,
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
        getChannelConfListType: function(sid, type) {
            var data = $http({
                    method:'GET',
                    url: '/api/channelConf/list/' + sid + '/' + type,
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
        getChannelConfById: function(id) {
            var data = $http({
                    method:'GET',
                    url: '/api/channelConf/getConfById/?id=' + id,
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
        saveEmailConf: function(sid, model) {
            var data = $http({
                    method:'POST',
                    url: '/api/channelConf/saveEmailConf/' + sid,
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
        saveSmsConf: function(sid, model) {
            var data = $http({
                    method:'POST',
                    url: '/api/channelConf/saveSmsConf/' + sid,
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
   };
    return appData;
});
