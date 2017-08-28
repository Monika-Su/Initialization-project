'use strict';

app.factory('TagService', function($http,$rootScope,$window) {

    var appData = {

        getTagManager: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagManager/' + siteId,
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
        setTagManager: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setTagManager/' + siteId,
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
        getTagTrack: function(tagId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagTrack/' + tagId,
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
        setTagTrack: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setTagTrack/' + siteId,
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
        getTagRecommend: function(tagId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagRecommend/' + tagId,
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
        setTagRecommend: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setTagRecommend/' + siteId,
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
        getTagClick: function(tagId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagClick/' + tagId,
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
        setTagClick: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setTagClick/' + siteId,
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
        getSnippetCode: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getSnippetCode/' + siteId,
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
        setTagProperty: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api' + siteId,
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
        getTagsBySiteId: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api' + siteId,
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
        setTagExternal: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setTagExternal/'+ siteId,
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
        getTagExternalBySiteId: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagExternalBySiteId/' + siteId,
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
        getTagPixelBySiteId: function(siteId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagPixelBySiteId/' + siteId,
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
        getTagPixel: function(tagId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getTagPixel/' + tagId,
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
        getPixelEmbeddedCode: function(tagId) {
            var data = $http({
                    method:'GET',
                    url:'/api/tag/getPixelEmbeddedCode/' + tagId,
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
        setTagPixel: function(siteId,model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setTagPixel/'+ siteId,
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
        removeTagPixel: function(tagId) {
            var data = $http({
                    method:'DELETE',
                    url:'/api/tag/delTagPixel/'+ tagId,
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
        removeTagExternal: function(tagId) {
            var data = $http({
                    method:'DELETE',
                    url:'/api/tag/delTagExternal/'+ tagId,
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
        setUrlPrefix: function(siteId, model) {
            var data = $http({
                    method:'POST',
                    url:'/api/tag/setUrlPrefix/'+ siteId,
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
