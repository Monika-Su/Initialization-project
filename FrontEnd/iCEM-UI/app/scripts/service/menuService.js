'use strict';

app.factory('MenuService', function ($http, $rootScope, $window) {
    var appData = {
        getMenuListButton: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/list/button?siteId=' + sid,
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
        getMenuListInjection: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/list/injection/button?siteId=' + sid,
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
        getMenuList: function (sid, size, page) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/list?siteId=' + sid + '&size=' + size + '&page=' + page,
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
        deleteMenuList: function (model) {
            var data = $http({
                method: 'DELETE',
                url: '/api/menu/' + model.id + '?siteId=' + model.siteId,
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
        getMenuDetail: function (sid, mid) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/' + mid + '?siteId=' + sid,
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
        getMenuTemplate: function (sid, menuType) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/template?siteId=' + sid + '&menuType=' + menuType,
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
        savePromotionMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/promotionMenu?siteId=' + sid,
                data: angular.toJson(menu),
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
        savePersonalizedMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/personalizedMenu?siteId=' + sid,
                data: menu,
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
        saveRankingMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/rankingMenu?siteId=' + sid,
                data: menu,
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
        saveReminderMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/reminderMenu?siteId=' + sid,
                data: menu,
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
        saveCustomMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/customMenu?siteId=' + sid,
                data: menu,
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
        savePointMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/pointMenu?siteId=' + sid,
                data: menu,
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
        saveInjectionMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/injectionMenu?siteId=' + sid,
                data: menu,
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
        saveRegistrationMenu: function (sid, menu) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/registrationMenu?siteId=' + sid,
                data: menu,
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
        getMenuThemeList: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/theme/list?siteId=' + sid,
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
        getMenuThemeCustom: function (sid) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/theme/custom?siteId=' + sid,
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
        getMenuPublishDetail: function (sid, mid) {
            var data = $http({
                method: 'GET',
                url: '/api/menu/publish/' + mid + '?siteId=' + sid,
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
        saveMenuPublish: function (sid, mid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/publish/' + mid + '?siteId=' + sid,
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
        uploadLogoFile: function (sid, mid, model) {
            var data = $http({
                method: 'POST',
                url: '/api/menu/upload/logo',
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
        }
    };
    return appData;
});