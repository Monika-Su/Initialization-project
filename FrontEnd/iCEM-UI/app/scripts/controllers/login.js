'use strict';

app.controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$cookies', '$scope', '$window', '$timeout', '$location', '$rootScope', 'SessionService', 'SiteService', 'OperatorService', 'AuthService'];

function loginCtrl($cookies, $scope, $window, $timeout, $location, $rootScope, SessionService, SiteService, OperatorService, AuthService) {

	init();

	$scope.login = function (model, e) {
		if (!model.loginId) {
			alert("[" + i18n.t("login.account") + "] "
				+ i18n.t("icem.mandatory"));
			return;
		} else if (!model.password) {
			alert("[" + i18n.t("login.password") + "] "
				+ i18n.t("icem.mandatory"));
			return;
		}

		if ($scope.loginRemember) {
			$cookies.put('username', model.loginId);
			$cookies.put('password', model.password);
			$cookies.put('remember', true);
		} else {
			$cookies.remove('username', null);
			$cookies.remove('password', null);
			$cookies.remove('remember', null);
		}

		$scope.loginButton = true;
		$scope.dataLoading = "<i class='fa fa-spin fa-spinner'></i>";
		e.preventDefault();

		SessionService.SignIn(model).then(function (response) {
			var data = response.data.data;
			var menuList = [];
			var functions = [];
			var path = "";

			if (response.data.success) {

				if (data.owningSiteList && data.owningSiteList.length > 0) {
					$window.sessionStorage.setItem('siteStorage', angular.toJson(data.owningSiteList));
					$window.sessionStorage.setItem('cSite', angular.toJson(data.owningSiteList[0]));
				} else {
					alert(i18n.t("login.site.empty"));
					$window.location.reload();
					return;
				}

				angular.forEach(data.functions, function (value, key) {
					this.push(value);
				}, functions);

				menuList = (functions.length > 0) ? data.functions[data.owningSiteList[0].id] : [];

				if (menuList[0].subFunctions && menuList[0].subFunctions.length > 0) {
					path = (menuList.length > 0) ? "/" + menuList[0].subFunctions[0].url : "/";
				} else {
					path = (menuList.length > 0) ? "/" + menuList[0].url : "/";
				}

				var tempUrlList = menuList.map(function (obj) {
					if (obj.url === null && obj.subFunctions.length > 0) {
						// return obj.subFunctions.map(obj => obj.url);
						return obj.subFunctions.map(function (obj) { return obj.url });
					} else {
						return obj.url;
					}
				});
				// var urlList = [].concat(...tempUrlList)
				var urlList = tempUrlList.reduce(function (prev, curr) {
					return prev.concat(curr);
				});

				$window.sessionStorage.setItem('token', data.sessionToken);
				$window.sessionStorage.setItem('accountId', data.owningAccountId);
				// all site menu authorities
				$window.sessionStorage.setItem('functions', angular.toJson(data.functions));
				// current site menu authorities
				$window.sessionStorage.setItem('menuList', angular.toJson(menuList));
				// url list
				$window.sessionStorage.setItem('urlList', angular.toJson(urlList));


				// console.log('## inside app login controller');
				// $rootScope.startLoadRoute();
				// AuthService.loadDynamicRoute($routeProviderReference);

				$timeout(function () {
					$location.url(path);
					$scope.initHeader(); // in headerbarController
				}, 0);
			}
		})
			.catch(function (response) {
				$scope.loginButton = false;
				$scope.dataLoading = i18n.t("login.login");
				console.error('Gists error', response);
			});
	};

	function init() {

		$scope.loginButton = false;
		$scope.dataLoading = i18n.t("login.login");
		$scope.loginRemember = ($cookies.get('remember') == 'true') ? true : false;
		$scope.user = { loginId: '', password: '' };
		$window.sessionStorage.removeItem('token');
		$window.sessionStorage.removeItem('accountId');
		$window.sessionStorage.removeItem('siteStorage');
		$window.sessionStorage.removeItem('cSite');
		$window.sessionStorage.removeItem('menuList');
		$window.sessionStorage.removeItem('functions');
		$window.sessionStorage.removeItem('urlList');

		if ($scope.loginRemember) {
			$scope.user.loginId = $cookies.get('username');
			$scope.user.password = $cookies.get('password');
		}

		$scope.initHeader(); // in headerbarController
	};
};
