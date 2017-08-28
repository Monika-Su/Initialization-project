'use strict';

app.controller('resetPwdController', function ($scope, $window, $modalInstance, CommonService, SessionService, ValidateService) {
	var token = $window.sessionStorage['token'];
	$scope.changePwd = {};
	$scope.confirmResetPwd = function (model) {
		if (ValidateService.isEmptyInput(["icem.newPassword", "icem.newPassword.again", ""], [model.newPassword, model.again,])) {
		} else if (model.newPassword !== model.again) {
			alert(i18n.t("icem.newPassword.different"));
		} else if (model.newPassword.length < 6) {
			alert(i18n.t("icem.newPassword.number"));
		} else {
			SessionService.ResetPassword(model, token).then(function (response) {
				$scope.cancel();
			});
		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
		$scope.changePwd = {};
	};

});