'use strict';

app.controller('memberAttributeCtrl', memberAttributeCtrl);

memberAttributeCtrl.$inject = ['$scope', '$window', '$upload', '$q', 'ngTableParams', 'CommonService', 'MemberService', 'ValidateService'];

function memberAttributeCtrl($scope, $window, $upload, $q, ngTableParams, CommonService, MemberService, ValidateService){

	// Loading animation
	$scope.isLoading = true;

	// panel show and hide
	$scope.isShowAttribute = false;

	// data from API
	$scope.attributeList = [];

	// const
	$scope.attributeLimit = 25;
	$scope.attributeCount = 0;
	$scope.attributeValueLimit = 100;
	$scope.attributeValueCount = 0;
	$scope.imTitlePreview = [
		{ title: "icem.import.status", width: "10%" },
		{ title: "icem.memberAttribute.name", width: "10%" },
		{ title: "icem.status", width: "10%" }
	];

	loadMemberAttritubeTable();

	$scope.getTitle = function (key) {
		return i18n.t(key);
	};


	function loadMemberAttritubeTable(){
		$scope.memberAttritubeTableParams = new ngTableParams({
			page: 1,
			count: 10
		}, {
				total: 0,
				counts: [],
				getData: function ($defer, params) {
					if (!$scope.cSite) return;
					MemberService.getMemberAttribute($scope.cSite.id, params.count(), params.page() - 1).then(function (response) {
						var data = response.data.data;
						$scope.attributeCount = data.totalElements;
						params.total(data.totalElements);
						$scope.isLoading = false;
						if (params.page() > 1 && (!data.content || data.content.length == 0)) {
							params.page(params.page() - 1);
						} else {
							$scope.attributeList = angular.copy(data.content);
							$defer.resolve(data.content);
						}
					});
				}
			});
	};

	$scope.newMemberAttribute = function () {

		$scope.newModal = {
			attributeId: null,
			name: "",
			ignoreInRoleSetting: false,
			calculationFrequency: "",
			sourceAttributeId: null,
			target: "",
			status: false,
			valueOptions: []
						  };

		$scope.isShow = false;
		$scope.isShowAttribute = true;
		closeInLineEdit();
	};

	$scope.closeAttribute = function () {
		$scope.isShowAttribute = false;
		$("html,body").animate({ scrollTop: 0 }, 700);
	};

	function closeInLineEdit() {
		for (var i = 0, item; item = $scope.attributeList[i]; i++) {
			item.$$edit = false;
		}
		$scope.memberAttritubeTableParams.reload();
	};

	$scope.editMemberAttribute = function (model) {
		closeInLineEdit();
		MemberService.getMemberCustomAttribute($scope.cSite.id, model.attributeId).then(function (response) {
			var data = response.data.data;
			for (var i = 0; i < $scope.attributeList.length; i++) {
				if ($scope.attributeList[i].attributeId == data.sourceAttributeId) {
					data.target = $scope.attributeList[i].name;
					break;
				}
			}
			$scope.newModal = angular.copy(data);
			$scope.attributeValueCount = (data.valueOptions) ? data.valueOptions.length : 0;
			$scope.isShowAttribute = true;
			$("html,body").animate({ scrollTop: 0 }, 700);
		});
	};

	$scope.saveAttribute = function (model, flag) {
		var deferred = $q.defer();
		if (ValidateService.isEmptyInput(["icem.memberAttribute.name"], [model.name])) {
			deferred.reject("Fail - ValidateService");
		} else if (checkAttrName($scope.attributeList, model)) {
			alert("[" + i18n.t("icem.memberAttribute.name") + "] "
				+ i18n.t("icem.duplicate"));
			deferred.reject("Fail");
		} else if (model.ignoreInRoleSetting && !model.calculationFrequency && !flag) {
			alert("[" + i18n.t("icem.memberAttribute.func") + "] "
				+ i18n.t("icem.mandatory"));
			deferred.reject("Fail");
		} else if (model.ignoreInRoleSetting && !model.target && !flag) {
			alert("[" + i18n.t("icem.memberAttribute.target") + "] "
				+ i18n.t("icem.mandatory"));
			deferred.reject("Fail");
		} else {
			MemberService.saveMemberAttribute($scope.cSite.id, fomatAttribute(model)).then(function (response) {
				if (response) {
					deferred.resolve("Success");
					$scope.isShowAttribute = false;
					$scope.memberAttritubeTableParams.reload();
				} else {
					deferred.reject("Fail");
				}
			})
				.catch(function (err) {
					deferred.reject("Fail - err: ", err);
				});
		}
		return deferred.promise;
	};

	$scope.deleteAttribute = function (model) {
		var deleteObj = {
			serviceApi: "MemberService",
			deleteApi: "deleteCustomAttribute",
			siteId: $scope.cSite.id,
			id: model.attributeId
		};
		CommonService.deleteItem(deleteObj).then(function () {
			$scope.memberAttritubeTableParams.reload();
		});
	};

	$scope.cancelNewValue = function () {
		$scope.isShow = false;
	};

	$scope.addValue = function () {
		$scope.isShow = true;
		$scope.newValue = { valueOptionId: null, optionName: "", inUse: "", updateAt: null };
	};

	$scope.editValue = function (model) {
		$scope.isShow = true;
		$scope.newValue = angular.copy(model);
	};

	$scope.deleteValue = function (model) {
		var index = $scope.newModal.valueOptions.indexOf(model);
		if (model.valueOptionId) {
			MemberService.deleteCustomAttributeValue($scope.cSite.id, model.valueOptionId).then(function (response) {
				if (response.data.success) {
					$scope.newModal.valueOptions.splice(index, 1);
					$scope.attributeValueCount = ($scope.newModal.valueOptions) ? $scope.newModal.valueOptions.length : 0;
					$scope.isShow = false;
				} else {
				}
			});
		} else {
			$scope.newModal.valueOptions.splice(index, 1);
			$scope.attributeValueCount = ($scope.newModal.valueOptions) ? $scope.newModal.valueOptions.length : 0;
			$scope.isShow = false;
		}
	};

	$scope.saveNewValue = function (model) {
		if (!model || !model.optionName) {
			alert("[" + i18n.t("icem.memberAttribute.value") + "] "
				+ i18n.t("icem.mandatory"));
		} else if (checkValuesName($scope.newModal.valueOptions, model)) {
			alert("[" + i18n.t("icem.memberAttribute.value") + "] "
				+ i18n.t("icem.duplicate"));
		} else {
			if (model.valueOptionId) {
				angular.forEach($scope.newModal.valueOptions, function (v) {
					if (v.valueOptionId == model.valueOptionId) {
						v.customAttributeStatus = "IN_USE";
						v.optionName = model.optionName;
					}
				});

			} else if (model.customAttributeStatus == "NEW") {
				angular.forEach($scope.newModal.valueOptions, function (v) {
					if (v.origin == model.origin) {
						v.optionName = model.optionName;
						v.origin = model.optionName;
					}
				});
			} else {
				model.customAttributeStatus = "NEW";
				model.origin = model.optionName;
				if (!$scope.newModal.valueOptions) {
					$scope.newModal.valueOptions = [];
				}
				$scope.newModal.valueOptions.unshift(model);
				$scope.attributeValueCount = $scope.newModal.valueOptions.length;
			}

			$scope.newValue = {};
			$scope.isShow = false;
		}
	};

	$scope.inLineEditAttr = function (model) {
		model.$$edit = true;
		topPanel(false);
	};

	$scope.cancelAttr = function (model) {
		model.$$edit = false;
		for (var i = 0, item; item = $scope.attributeList[i]; i++) {
			if (item.attributeId === model.attributeId) {
				model.name = item.name;
				model.status = item.status;
				break;
			}
		}
		topPanel(false);
	};

	$scope.changeStatus = function (model) {
		if (model.ignoreInRoleSetting) {
			model.status = false;
		}
	}

	function topPanel(flag) {
		if ($scope.isShowAttribute) {
			$("html,body").animate({ scrollTop: 0 }, 700);
		}
		$scope.isShow = !flag;
		$scope.isShowAttribute = flag;
	}

	function checkAttrName(list, model) {
		var isFindFlag = false;
		angular.forEach(list, function (m) {
			if (!isFindFlag) {
				if (m.name == model.name && (m.attributeId != model.attributeId || !m.attributeId && !model.attributeId)) {
					isFindFlag = true;
				}
			}
		});
		return isFindFlag;
	}

	function checkValuesName(list, model) {
		var isFindFlag = false;
		angular.forEach(list, function (m) {
			if (!isFindFlag) {
				if (m.optionName == model.optionName && (m.valueOptionId != model.valueOptionId || !m.valueOptionId && !model.valueOptionId)) {
					isFindFlag = true;
				}
			}
		});
		return isFindFlag;
	}

	function fomatAttribute(model) {
		if (!model.ignoreInRoleSetting) {
			model.calculationFrequency = "";
			model.target = "";
		}
		model.status = (model.status === "true" || model.status === true);
		var attrObj = {
			attributeId: model.attributeId,
			name: model.name,
			status: model.status,
			sourceAttributeId: null,
			calculationFrequency: model.calculationFrequency,
			ignoreInRoleSetting: model.ignoreInRoleSetting,
			valueOptions: []
		};

		if (model.target != "") {
			angular.forEach($scope.attributeList, function (v) {
				if (v.name == model.target) {
					attrObj.sourceAttributeId = v.attributeId;
				}
			});
		}

		angular.forEach(model.valueOptions, function (value) {
			var optionObj = {
				customAttributeStatus: value.customAttributeStatus,
				optionName: value.optionName,
				updateAt: value.updateAt,
				valueOptionId: value.valueOptionId
			};
			attrObj.valueOptions.push(optionObj);
		});

		return attrObj;
	}
};




