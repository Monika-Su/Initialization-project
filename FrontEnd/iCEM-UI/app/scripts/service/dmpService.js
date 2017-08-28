'use strict';

app.factory('DmpService', function ($http, $rootScope, $window) {
    var appData = {
        getCampaignList: function (sid, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/campaign/list?siteId=' + sid + '&size=' + size + '&page=' + page,
                // params: requestUrl,
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
        deleteCampaignList: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/campaign/' + model.siteId + '/' + model.id,
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
        getCampaignListUploads: function (sid, model) {
            var data = $http({
                method: 'GET',
                url: '/api/campaign/listUploads?siteId=' + sid + '&dsp=' + model.dspchannel + '&client=' + model.dspclient + '&campaign=' + model.dspcampaign,
                // data: angular.toJson({}),
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
        saveCampaignDetail: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/' + sid,
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
        // upCampaignDetail: function(sid, model) {
        //     var data = $http({
        //             method:'PUT',
        //             url: '/api/ipcrm/dmp/campaign/detail?sid=' + sid,
        //             data: model,
        //             contentType: 'application/json',
        //             headers:{'auth': $window.sessionStorage['token']}
        //         })
        //         .success(function(response) {
        //             return response;
        //         })
        //         .error(function(err) {
        //             return err;
        //         });
        //     return data;
        // },
        getLoadCategory: function (siteId) {
            var data = $http({
                method: 'GET',
                url: '/api/campaign/loadCategory/' + siteId + "?refresh=true",
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
        saveImportBulk: function (sid, file) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/bulk?siteId=' + sid,
                file: file[0],
                contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
        getCampaignReportList: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/listCampaigns?siteId=' + sid,
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
        getCampaignReportGetData: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/getChannelData?siteId=' + sid,
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
        getCampaignReportTransition: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/transitionCampaign?siteId=' + sid,
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
        getCampaignReportListTrend: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/listTrend?siteId=' + sid,
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
        getCampaignReportTransitionTrend: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/campaign/transitionTrend?siteId=' + sid,
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
        getPixelList: function (sid, requestUrl) {
            var data = $http({
                method: 'GET',
                url: '/api/tag/getTagPixelBySiteId/' + sid,
                params: requestUrl,
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
        deletePixelList: function (sid, model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/ipcrm/dmp/pixel/list?sid=' + sid + '&pid=' + model.id,
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
        savePixelDetail: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/ipcrm/dmp/pixel/detail?sid=' + sid,
                data: model,
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
        upPixelDetail: function (sid, model) {
            var data = $http({
                method: 'PUT',
                url: '/api/ipcrm/dmp/pixel/detail?sid=' + sid,
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
        getSegmentList: function (sid, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/segment/list?siteId=' + sid + '&size=' + size + '&page=' + page,
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
        deleteSegmentList: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/segment/' + model.id + '?siteId=' + model.siteId,
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
        saveSegmentDetail: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/segment/detail?siteId=' + sid,
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
        upSegmentDetail: function (sid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/segment/detail?siteId=' + sid,
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
        saveSegmentRuleList: function (siteId, model, size, page) {
            var data = $http({
                method: 'POST',
                url: '/api/segment/list/segmentRule/' + siteId + '?size=' + size + '&page=' + page,
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
        getSegmentRule: function (siteId, recommendationId) {
            var data = $http({
                method: 'GET',
                url: '/api/segment/segmentRule/' + siteId + '/' + recommendationId,
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
        getSegmentRuleAttr: function (siteId) {
            var data = $http({
                method: 'GET',
                url: '/api/segment/segmentRule/attribute/' + siteId,
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
        saveSegmentRule: function (siteId, model) {
            var data = $http({
                method: 'POST',
                data: angular.toJson(model),
                url: '/api/segment/segmentRule/' + siteId,
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
