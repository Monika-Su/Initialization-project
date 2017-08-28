'use strict';

app.factory('SessionService', function($http, $httpParamSerializer) {

    var appData = {

        SignIn: function(obj) {
            
            var data = $http({
                    method:'POST',
                    url: '/api/console/login',
                    data: $httpParamSerializer(obj),
                    headers:{ 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    // console.log("login error: ",JSON.stringify(err));
                    return err;
                });
            return data;
        },

        SignOut: function(token) {
            var headersObj = {
                'auth': token
            };
            var data = $http({
                    method:'GET',
                    url: '/api/console/logout',
                    headers:headersObj
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    console.log("login error: ",JSON.stringify(err));
                    return err;
                });
            return data;
        },

        ResetPassword: function(model,token) {
            
            var headersObj = {
                'auth': token,
                'Access-Control-Allow-origin': '*',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            var data = $http({
                    method:'POST',
                    url: '/api/operator/resetPassword',
                    data: $httpParamSerializer(model),
                    headers:headersObj
                })
                .success(function(response) {
                    return response;
                })
                .error(function(err) {
                    console.log("login error: ",JSON.stringify(err));
                    return err;
                });
            return data;
        },
   };

    return appData;
});