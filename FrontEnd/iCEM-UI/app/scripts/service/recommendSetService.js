'use strict';

app.factory('RecommendSetService', function ($http, $rootScope, $window) {

    var appData = {

        saveRecommendSetList: function (siteId, model, size, page) {
            var data = $http({
                method: 'POST',
                url: '/api/recommendSet/list/' + siteId + '?size=' + size + '&page=' + page,
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
        saveRecommendSetItem: function (siteId, model) {
            var data = $http({
                method: 'POST',
                url: '/api/recommendSet/item/' + siteId,
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
        removeRecommendSet: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/recommendSet/' + model.siteId + '/' + model.id,
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
        getRecommendSetItem: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/item/' + siteId + '/' + recommendationId,
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
        removeRecommendSetItem: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/recommendSet/item/' + model.siteId + '/' + model.id,
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
        getRecommendSetItemAuto: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/itemAuto/' + siteId + '/' + recommendationId,
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
        getRecommendSetRuleBase: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/ruleBase/' + siteId + '/' + recommendationId,
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
        getRecommendSetUserAuto: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/userAuto/' + siteId + '/' + recommendationId,
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
        getRecommendSetRanking: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/ranking/' + siteId + '/' + recommendationId,
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
        getRecommendSetReminder: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/reminder/' + siteId + '/' + recommendationId,
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
        getRecommendSetBuyAfterView: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/buyAfterView/' + siteId + '/' + recommendationId,
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
        getRecommendSetHistory: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/historyOrient/' + siteId + '/' + recommendationId,
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
        getRecommendSetAttribute: function (siteId) {
            var data = $http({
                method: 'GET',
                url: '/api/recommendSet/attribute/' + siteId,
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

        saveRecommendSetItemAuto: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/itemAuto/' + siteId,
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
        saveRecommendSetRuleBase: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/ruleBase/' + siteId,
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
        saveRecommendSetUserAuto: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/userAuto/' + siteId,
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
        saveRecommendSetRanking: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/ranking/' + siteId,
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
        saveRecommendSetReminder: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/reminder/' + siteId,
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
        saveRecommendSetBuyAfterView: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/buyAfterView/' + siteId,
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
        saveRecommendSetHistory: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/recommendSet/historyOrient/' + siteId,
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
    };
    return appData;
});
