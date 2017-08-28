'use strict';

app.factory('CommonService', function ($rootScope, $window, $location, $injector, $q) {
	var commonService = {};

	commonService.checkDuplicateName = function (list, model, IdName, modelName, alertStr) {
		var flag = false;
		for (var i = 0; i < list.length; i++) {
			if (list[i][modelName] == model[modelName] && list[i][IdName] != model[IdName]) {
				flag = true;
				alert("[" + i18n.t(alertStr) + "] "
					+ i18n.t("icem.duplicate"));
				break;
			}
		}
		return flag;
	};

    commonService.deleteItem = function (model) {
		// serviceApi, deleteApi, cSiteId, id
        var deferred = $q.defer();
		var deleteItem = $window.confirm(i18n.t("icem.delete.confirm"));
        if (deleteItem) {
			var useService = $injector.get(model.serviceApi);
            useService[model.deleteApi](model).then(function (response) {
				deferred.resolve("Success - " + response);
            });
        } else {
			deferred.reject("Fail");
		}
		return deferred.promise;
	};

	commonService.ajaxErrorMsg = function (data, i18nKey) {
		if (data.status != 'OK') {
			var errors = i18n.t(data.status) + ':\n';
			angular.forEach(data.data, function (obj) {
				errors += i18n.t(i18nKey + obj.target.key);
				errors += ' ' + i18n.t(obj.type);
				errors += '\n';
			});
			alert(errors);
		}
    };
    commonService.checkDuplicateAdsName = function (list, name) {
        var isFindFlag = false;
		angular.forEach(list, function (m) {
			if(!isFindFlag){
				if (m.name == name) {
					isFindFlag = true;
				}
			}
		});
		return isFindFlag;
	};
    commonService.validateIPaddress = function (ipaddress) {
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
			return true;
		}
		return false;
    };
    commonService.getFormattedDate = function (date) {
		if (typeof date === 'string' || date instanceof String) {
			return date.split("-").join("/");
		} else {
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : '0' + day;
			return year + '/' + month + '/' + day;
		}
	};
	commonService.toggleBtn = function () {
		if ($("#page-wrapper").css("margin-left") == '0px') {
			$("#menuBar").show('slide');
			$("#page-wrapper").css('margin-left', '250px');
		} else {
			$("#menuBar").hide('slide');
			$("#page-wrapper").css('margin-left', '0px');
		}
    };
    commonService.isLogin = function () {
        var loginInfo = $window.sessionStorage['token'];
        if (!loginInfo) {
			$location.url("/");
			console.log("no isLogin !!");
			return null;
        }
        return loginInfo;
    };
    commonService.isNumber = function (n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
    };

    commonService.getPermission = function () {
		var loginInfo = $window.sessionStorage['token'];
		var r = [];
		if (!loginInfo) {
			return r;
		}

		if (loginInfo.site && loginInfo.site.siteAuthorities) {
			angular.forEach(loginInfo.site.siteAuthorities, function (obj) {
				r[obj.type] = obj.permission;
			});
			//console.log(loginInfo.site);
			for (var k in loginInfo.site.visibleSiteGroups) {
				if (loginInfo.site.visibleSiteGroups[k].length > 0) {
					r[k] = 'READ_ONLY';
				}
			}

			for (var k in loginInfo.site.editableSiteGroups) {
				if (loginInfo.site.editableSiteGroups[k].length > 0) {
					r[k] = 'EDITABLE';
				}
			}

			//console.log(r)
			if (!loginInfo.site.enabledMailRecommend) {
				delete r["MAIL_RECOMMEND_CONTENT"];
			}
		}
		return r;
    };
    return commonService;
});