'use strict';

app.controller('loginAttributeCtrl', loginAttributeCtrl);

loginAttributeCtrl.$inject = ['$scope', '$window', '$filter', '$q', 'ngTableParams', 'CommonService', 'UserService', 'MemberService', 'ValidateService'];

function loginAttributeCtrl($scope, $window, $filter, $q, ngTableParams, CommonService, UserService, MemberService, ValidateService){


    // Loading animation
	$scope.isLoading = true;

    // panel show and hide
	$scope.isShowAdd = false;

    // container object
	$scope.userAttributes = [];
	$scope.temploginList = [];
	
	// const
	$scope.attributeLimit = 10;
	$scope.attributeCount = 0;

	reloadDynamicField();

    $scope.getTitle = function (key) {
		return i18n.t(key);
    };

	function reloadDynamicField() {
		UserService.getLoginFieldTypes($scope.cSite.id).then(function (response) {
			var data = response.data.data;
			if (data) {
				$scope.loginFieldTypes = data;
			}
		});

		if ($scope.dynamicFieldTableParams) {
			$scope.dynamicFieldTableParams.reload();
		} else {
			$scope.dynamicFieldTableParams = new ngTableParams({
				page: 1,
				count: 10
			}, {
					total: 0,
					getData: function ($defer, params) {
						UserService.getLoginFields($scope.cSite.id).then(function (response) {
							var data = response.data.data;
							params.total(data.totalElements);
							$scope.temploginList = angular.copy(data.content);
							$scope.attributeCount = data.totalElements;
							$scope.isLoading = false;

							if (params.page() > 1 && (!data.content || data.content.length == 0)) {
								params.page(params.page() - 1);
							} else {
								$defer.resolve(data.content);
							}

							MemberService.getMemberAttribute($scope.cSite.id,50,0).then(function (response) {
								var attributeList = response.data.data.content;
								$scope.userAttributes = [];
								angular.forEach(attributeList, function (attribute) {
									var isExist = false;
									angular.forEach(data.content, function (loginAttribute) {
										if (loginAttribute.attributeName == attribute.name) {
											isExist = true;
										}
									});
									if (!isExist) {
										$scope.userAttributes.push(attribute);
									}
								});
							});
						});
					}
				});
		}
	}

	$scope.newLoginField = function () {
		$scope.loginField = {
			id: null,
			attributeName: "",
			name: "",
			required: true,
			type: "",
			value: ""
		};
		$scope.isShowAdd = true;
	};

	$scope.clearLoginField = function (field) {
		field.$$edit = false;
		$scope.isShowAdd = false;
		for (var i = 0; i < $scope.temploginList.length; i++) {
			if ($scope.temploginList[i].id == field.id) {
				field.name = $scope.temploginList[i].name;
				field.required = $scope.temploginList[i].required;
				field.type = $scope.temploginList[i].type;
			}
		}
	};

	$scope.saveLoginField = function (field) {
		var deferred = $q.defer();
		if (ValidateService.isEmptyInput(["icem.dynamic.field.name", "icem.dynamic.field.attribute", "icem.dynamic.field.type"], [ field.name,field.attributeName,field.type])) {
            deferred.reject("Fail - ValidateService");
            return deferred.promise;
        }

		if (!field.required) {
			field.required = false;
		}

		UserService.saveLoginField($scope.cSite.id, field).then(function () {
			deferred.resolve("Success");
			$scope.isShowAdd = false;
			field.$edit = false;
			reloadDynamicField();
		});
		return deferred.promise;
	};

	$scope.deleteLoginField = function (field) {
		var deleteObj = {
            serviceApi: "UserService",
            deleteApi: "deleteLoginFieldsDetail",
            siteId: $scope.cSite.id,
            id: field.id
        };
		CommonService.deleteItem(deleteObj).then(function(){
            reloadDynamicField();
        });
	};
};


