'use strict';

app.factory('MemberService', function ($http, $rootScope, $window) {

    var appData = {

        getMemberList: function (id, size, page, model) {
            var data = $http({
                method: 'POST',
                url: '/api/member/list?siteId=' + id + '&size=' + size + '&page=' + page,
                data: angular.toJson(model),
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
        getMemberDetail: function (siteId, memberId) {
            var data = $http({
                method: 'GET',
                url: '/api/member/' + memberId + '?siteId=' + siteId,
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
        saveMember: function (id, model) {
            var data = $http({
                method: 'POST',
                url: '/api/member?siteId=' + id,
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
        getMemberAttribute: function (id, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/member/attribute?siteId=' + id + '&size=' + size + '&page=' + page,
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
        saveMemberAttribute: function (id, model) {
            var data = $http({
                method: 'POST',
                url: '/api/member/attribute?siteId=' + id,
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
        getMemberCustomAttribute: function (id, attributeId) {
            var data = $http({
                method: 'GET',
                url: '/api/member/attribute/' + attributeId + '?siteId=' + id,
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
        deleteCustomAttribute: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/member/attribute/' + model.id + '?siteId=' + model.siteId,
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
        deleteCustomAttributeValue: function (siteId, valueOptionId) {
            var data = $http({
                method: 'DELETE',
                url: '/api/member/attribute/memberCustomAttributeValueOption/' + valueOptionId + '?siteId=' + siteId,
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
        filterMember: function (siteId, field, value, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/member/query?siteId=' + siteId + '&field=' + field + '&value=' + value + '&size=' + size + '&page=' + page,
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