'use strict';

var ngCommon = angular.module('ng-common', ['ngResource']);

function changeApplyColor(data) {
	var ele = document.getElementById('applyBell');

	if (ele) {
		if (data.data) {
			ele.style.color = '#ff8830';
			ele.className = 'fa fa-lg fa-bell fa-fw fa-spin';
			ele.style['animation-iteration-count'] = 1;
			ele.attributes['count'] = 1;
		} else {
			ele.style.color = '';
			ele.className = 'fa fa-lg fa-bell-o fa-fw';
			ele.attributes['count'] = '';
		}
	}
}

ngCommon.directive('helperLink', function ($modal, CommonService) {
	return {
		link: function (scope, element, attrs) {
			scope.openHelper = function () {
				//check locale and assign path
				var lang = window.navigator.userLanguage || window.navigator.language;
				if (lang === "zh-CN" || lang === "zh-TW" || lang === "zh_CN" || lang === "zh_TW") {
					lang = lang.replace(/-/g, "_");
				} else {
					lang = "en_US";
				}

				var prefix = '/icem-docs/' + lang;
				var postfix = '/index.html';
				// disable now
				// if (attrs.helperLink) {
				// 	postfix = attrs.helperLink;
				// }
				//console.log("helperLink:",prefix + postfix);
				window.open(prefix + postfix, 'helperLink');
			};
		}
	};
});

ngCommon.directive('applyDialog', function ($modal, $window, CommonService, ChangeService) {
	return {
		templateUrl: 'views/template/apply-tpl.html',
		scope: {},
		link: function (scope, element) {
			scope.applyAuth = CommonService.getPermission().APPLY;
			scope.tempApplyList = [];
			scope.tempApplyDetail = [];
			// console.log("applyDialog:",scope);
			var loginInfo = $window.sessionStorage['roleName'];

			if (loginInfo == "ACCOUNT_MANAGER") {
				var data = { "data": "false" };
				// changeApplyColor(data);
			}

			scope.applyBtn = function () {
				var loginInfo = $window.sessionStorage['roleName'];

				if (loginInfo == "ACCOUNT_MANAGER") {
					/*ChangeService.saveApply().then(function(response){
						alert(i18n.t("icem.commit.applyConfig"));
					});*/
				} else {
					var ele = document.getElementById('applyBell');
					if (ele && ele.attributes['count'] == 1) {
						if (CommonService.getPermission().APPLY === 'ENABLE') {
							ChangeService.getList(loginInfo.siteId).then(function (response) {
								// console.log("getList:",response.data);
								var data = response.data;
								if (data.list.length > 0) {
									$modal.open({
										templateUrl: 'applyList.html',
										controller: 'applyCtrl',
										size: 'lg',
										resolve: {
											tempApplyList: function () {
												return data.list;
											},
											siteId: function () {
												return loginInfo.siteId;
											}
										}
									});
								}
							});

						}
					}
				}
			};
		}
	};
});

ngCommon.directive('scorePanel', function () {
	return {
		templateUrl: 'views/template/score.directive.html',
		scope: {
			loadContainer: '=',
			scoreList: '='
		},
		replace: true,
		restrict: 'EA',
		controller: function ($scope, $element, $attrs) {
			// operator
			$scope.scoreOperator = [
				null,
				"EQUAL",
				"NOT_EQUAL",
				"GREATER_THAN",
				"GREATER_OR_EQUAL",
				"LESS_THAN",
				"LESS_OR_EQUAL"
			];

			if ($scope.loadContainer.scoreRuleId === null && $scope.scoreList.length > 0) {
				$scope.loadContainer.scoreRuleId = $scope.scoreList[0].id;
			}

        }
    };
});

ngCommon.directive('referrerPanel', function () {
	return {
		templateUrl: 'views/template/referrer.directive.html',
		scope: {
			loadContainer: '=',
		},
		replace: true,
		restrict: 'EA',
		controller: function ($scope, $element, $attrs) {
			// operator
			$scope.stringOperator = [
				null,
				"EQUAL",
				"NOT_EQUAL",
				"CONTAIN",
				"NOT_CONTAIN",
				"BEGIN",
				"NOT_BEGIN",
				"END",
				"NOT_END",
				"REGEX"
			];
        }
    };
});

ngCommon.directive('requestPanel', function () {
	return {
		templateUrl: 'views/template/request.directive.html',
		scope: {
			loadContainer: '=',
		},
		replace: true,
		restrict: 'EA',
		controller: function ($scope, $element, $attrs) {

			// operator
			$scope.stringOperator = [
				null,
				"EQUAL",
				"NOT_EQUAL",
				"CONTAIN",
				"NOT_CONTAIN",
				"BEGIN",
				"NOT_BEGIN",
				"END",
				"NOT_END",
				"REGEX"
			];

			$scope.unitContainer = {
				"paramOperator": null,
				"paramValue": "",
				"parmName": ""
			};

			function initUnitContainer() {
				$scope.unitContainer = {
					"paramOperator": null,
					"paramValue": "",
					"parmName": ""
				};
			};

			$scope.editUnit = function (model) {
				model.$$backup = angular.copy(model);
			};

			$scope.cancelSaveUnit = function (model, idx) {
				$scope.loadContainer.urlParams[idx].parmName = model.$$backup.parmName;
				$scope.loadContainer.urlParams[idx].paramValue = model.$$backup.paramValue;
				$scope.loadContainer.urlParams[idx].paramOperator = model.$$backup.paramOperator;
				$scope.loadContainer.urlParams[idx].$$edit = false;
			};

			$scope.deleteUnit = function (idx) {
				$scope.loadContainer.urlParams.splice(idx, 1);
			};

			function checkEmpty(model) {
				var flag = false;
				if (!model || !model.parmName) {
					alert("[" + i18n.t("icem.recommend.rule.request.parameters.name") + "] "
						+ i18n.t("icem.mandatory"));
					flag = true;
				} else if (!model.paramValue) {
					alert("[" + i18n.t("icem.recommend.rule.request.parameters.value") + "] "
						+ i18n.t("icem.mandatory"));
					flag = true;
				} else if (!model.paramOperator) {
					alert("[" + i18n.t("icem.recommend.rule.request.parameters.condition") + "] "
						+ i18n.t("icem.mandatory"));
					flag = true;
				}
				return flag;
			}

			$scope.saveUnit = function (model) {
				if (checkEmpty(model)) {
					return;
				}
				if (model.$$backup) {
					// edit existed one
					model.$$edit = false;
				} else {
					// add new one
					$scope.loadContainer.urlParams.push(model);
				}
				initUnitContainer();
			};
        }
    };
});

ngCommon.directive('clickOnce', function ($timeout, $q) {
    return {
        restrict: 'EA',
		scope: {
			inputData1: '=',
			inputData2: '=',
			inputData3: '=',
			inputData4: '=',
			timeOut: '=',
			apiMethod: '&'
		},
		link: function (scope, element, attrs) {
            $(element).click(function (e) {
				element.attr('disabled', true);
				var inputData1 = noValue(scope.inputData1) ? null : scope.inputData1;
				var inputData2 = noValue(scope.inputData2) ? null : scope.inputData2;
				var inputData3 = noValue(scope.inputData3) ? null : scope.inputData3;
				var inputData4 = noValue(scope.inputData4) ? null : scope.inputData4;
				var timeOut = noValue(scope.inputData4) ? null : scope.timeOut;
				var apiFunc = scope.apiMethod();

				if (scope.timeOut) {
					apiFunc(inputData1, inputData2, inputData3, inputData4);
					$timeout(function () {
						// console.log('Timeout Finally');
						element.attr('disabled', false);
					}, 450);
				} else {
					apiFunc(inputData1, inputData2, inputData3, inputData4).then(function (value) {
						// console.log('click-once value : ', value);
					}, function (e) {
						// console.log('click-once error : ', e);
					}, function (notify) {
						// console.log('click-once notify : ', notify);
					})
						.finally(function () {
							// console.log("click-once finally : ");
							element.attr('disabled', false);
						});
				}
            });

			function noValue(model) {
				var flag = true;
				switch (typeof model) {
					case "object":
					case "boolean":
					case "number":
					case "string":
						flag = false;
						break;
					default:
						flag = true;
				}
				return flag;
			};
		}
    };
});


ngCommon.directive('onlyNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function (inputValue) {
				if (inputValue == undefined)
					return '';
				var transformedInput = inputValue.replace(/[^0-9]/g, '');
				if (transformedInput != inputValue) {
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}

				return transformedInput;
			});
		}
	};
});

ngCommon.directive('onlyFloat', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}

			ngModelCtrl.$parsers.push(function (val) {
				if (angular.isUndefined(val)) {
					val = '';
				}
				var clean = val.replace(/[^0-9\.]/g, '');
				var decimalCheck = clean.split('.');

				if (!angular.isUndefined(decimalCheck[1])) {
					if (attrs.onlyFloat > 0) {
						decimalCheck[1] = decimalCheck[1].slice(0, attrs.onlyFloat);
					} else {
						decimalCheck[1] = decimalCheck[1].slice(0, 3); //set default 3 digit
					}
					clean = decimalCheck[0] + '.' + decimalCheck[1];
				}

				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				return clean;
			});

			element.bind('keypress', function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
});

ngCommon.directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
	// contains
	function contains(arr, item, comparator) {
		if (angular.isArray(arr)) {
			for (var i = arr.length; i--;) {
				if (comparator(arr[i], item)) {
					return true;
				}
			}
		}
		return false;
	}

	// add
	function add(arr, item, comparator) {
		arr = angular.isArray(arr) ? arr : [];
		if (!contains(arr, item, comparator)) {
			arr.push(item);
		}
		return arr;
	}

	// remove
	function remove(arr, item, comparator) {
		if (angular.isArray(arr)) {
			for (var i = arr.length; i--;) {
				if (comparator(arr[i], item)) {
					arr.splice(i, 1);
					break;
				}
			}
		}
		return arr;
	}

	// http://stackoverflow.com/a/19228302/1458162
	function postLinkFn(scope, elem, attrs) {
		// exclude recursion, but still keep the model
		var checklistModel = attrs.checklistModel;
		attrs.$set("checklistModel", null);
		// compile with `ng-model` pointing to `checked`
		$compile(elem)(scope);
		attrs.$set("checklistModel", checklistModel);

		// getter / setter for original model
		var getter = $parse(checklistModel);
		var setter = getter.assign;
		var checklistChange = $parse(attrs.checklistChange);

		// value added to list
		var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


		var comparator = angular.equals;

		if (attrs.hasOwnProperty('checklistComparator')) {
			if (attrs.checklistComparator[0] == '.') {
				var comparatorExpression = attrs.checklistComparator.substring(1);
				comparator = function (a, b) {
					return a[comparatorExpression] === b[comparatorExpression];
				}

			} else {
				comparator = $parse(attrs.checklistComparator)(scope.$parent);
			}
		}

		// watch UI checked change
		scope.$watch(attrs.ngModel, function (newValue, oldValue) {
			if (newValue === oldValue) {
				return;
			}
			var current = getter(scope.$parent);
			if (angular.isFunction(setter)) {
				if (newValue === true) {
					setter(scope.$parent, add(current, value, comparator));
				} else {
					setter(scope.$parent, remove(current, value, comparator));
				}
			}

			if (checklistChange) {
				checklistChange(scope);
			}
		});

		// declare one function to be used for both $watch functions
		function setChecked(newArr, oldArr) {
			scope[attrs.ngModel] = contains(newArr, value, comparator);
		}

		// watch original model change
		// use the faster $watchCollection method if it's available
		if (angular.isFunction(scope.$parent.$watchCollection)) {
			scope.$parent.$watchCollection(checklistModel, setChecked);
		} else {
			scope.$parent.$watch(checklistModel, setChecked, true);
		}
	}

	return {
		restrict: 'A',
		priority: 1000,
		terminal: true,
		scope: true,
		compile: function (tElement, tAttrs) {
			if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox')
				&& (tElement[0].tagName !== 'MD-CHECKBOX')
				&& (!tAttrs.btnCheckbox)) {
				throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
			}

			if (!tAttrs.checklistValue && !tAttrs.value) {
				throw 'You should provide `value` or `checklist-value`.';
			}

			// by default ngModel is 'checked', so we set it if not specified
			if (!tAttrs.ngModel) {
				// local scope var storing individual checkbox model
				tAttrs.$set("ngModel", "checked");
			}

			return postLinkFn;
		}
	};
}]);

//import Modal directive
ngCommon.directive('importDialog', function ($resource, $modal, $templateCache, ngTableParams, CommonService) {
	return {
		template: "<button class=\"right btn btn-outline btn-info fa fa-upload fa-2x\"></button>",
		scope: true,
		replace: true,
		controller: function ($scope) {
			$scope.auth = CommonService.getPermission();
			$scope.importBtn = function () {
				$scope.popImportBtn();
			};
			$scope.importBtnTwo = function () {
				$scope.previewUrl = $scope.previewUrlTwo;
				$scope.contentListPreview = $scope.contentListPreviewTwo;
				$scope.imTitlePreview = $scope.imTitlePreviewTwo;
				$scope.popImportBtn();
			};
		},
		link: function (scope, element) {
			scope.auth = CommonService.getPermission();
			scope.popImportBtn = function () {
				$modal.open({
					templateUrl: 'views/template/imUpload-tpl.html',
					controller: 'importController',
					size: 'lg',
					scope: scope,
				});
			};
		},
	};
});

// schedule tab
ngCommon.directive('schedulePick', function ($filter, $timeout) {
	return {
		templateUrl: 'views/template/schedule-tpl.html',
		scope: {
			ngModel: '=',
			useDatepicker: '@',
			loadSchedule: '='
		},
		replace: true,
		restrict: 'EA',
		controller: function ($scope, $element, $attrs) {
			$scope.monthOfYear = [{ name: 1, selected: false }, { name: 2, selected: false }, { name: 3, selected: false }, { name: 4, selected: false }, { name: 5, selected: false }, { name: 6, selected: false }, { name: 7, selected: false }, { name: 8, selected: false }, { name: 9, selected: false }, { name: 10, selected: false }, { name: 11, selected: false }, { name: 12, selected: false }];

			$scope.dayOfMonth = [{ name: 1, selected: false }, { name: 2, selected: false }, { name: 3, selected: false }, { name: 4, selected: false }, { name: 5, selected: false }, { name: 6, selected: false }, { name: 7, selected: false }, { name: 8, selected: false }, { name: 9, selected: false }, { name: 10, selected: false }, { name: 11, selected: false }, { name: 12, selected: false }, { name: 13, selected: false }, { name: 14, selected: false }, { name: 15, selected: false }, { name: 16, selected: false }, { name: 17, selected: false }, { name: 18, selected: false }, { name: 19, selected: false }, { name: 20, selected: false }, { name: 21, selected: false }, { name: 22, selected: false }, { name: 23, selected: false }, { name: 24, selected: false }, { name: 25, selected: false }, { name: 26, selected: false }, { name: 27, selected: false }, { name: 28, selected: false }, { name: 29, selected: false }, { name: 30, selected: false }, { name: 31, selected: false }];

			$scope.dayOfWeek = [{ name: 'MONDAY', selected: false }, { name: 'TUESDAY', selected: false }, { name: 'WEDNESDAY', selected: false }, { name: 'THURSDAY', selected: false }, { name: 'FRIDAY', selected: false }, { name: 'SATURDAY', selected: false }, { name: 'SUNDAY', selected: false }];

			$scope.hourOfDayList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

			$scope.booFilter = function (x, arrayName) {
				if (x.selected) {
					// add to array
					arrayName.push(x.name);
				} else {
					// remove from array
					for (var i = 0, item; item = arrayName[i]; i++) {
						if (x.name === item) {
							arrayName.splice(i, 1);
						}
					}
				};
			};

			$scope.clearAllDate = function () {
				$scope.loadSchedule.startDate = null;
				$scope.loadSchedule.endDate = null;
				$scope.loadSchedule.fromHour = null;
				$scope.loadSchedule.toHour = null;
			};

			// datepicker
			$scope.format = 'yyyy-MM-dd';
			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};

		},
	};
});

// Attribute tab
ngCommon.directive('userAttribute', ['MemberService', function (MemberService) {
	return {
		templateUrl: 'views/template/attribute-tpl.html',
		scope: {
			siteId: '=',
			loadService: '@',
			loadApi: '@',
			loadContainer: '='
		},
		replace: true,
		controller: function ($scope, $resource, $window, $filter, $q, $injector) {
			// Options
			$scope.mixOperator = [
				{ isShow: true, name: "EQUAL" },
				{ isShow: true, name: "NOT_EQUAL" },
				{ isShow: true, name: "GREATER_OR_EQUAL" },
				{ isShow: true, name: "GREATER_THAN" },
				{ isShow: true, name: "LESS_OR_EQUAL" },
				{ isShow: true, name: "LESS_THAN" },
				{ isShow: false, name: "CONTAIN" },
				{ isShow: false, name: "NOT_CONTAIN" },
				{ isShow: false, name: "BEGIN" },
				{ isShow: false, name: "NOT_BEGIN" },
				{ isShow: false, name: "END" },
				{ isShow: false, name: "NOT_END" },
				{ isShow: false, name: "REGEX" }
			];

			$scope.optionOperator = [
				"EQUAL",
				"NOT_EQUAL",
			];

			/*---------------------------------------------------------*/
			/*                load member attribute
            /*---------------------------------------------------------*/
			initAttributeEdit(true);
			$scope.attributeList = [];
			function loadMemberAttribute() {
				var deferred = $q.defer();
				var useService = $injector.get($scope.loadService);
				useService[$scope.loadApi]($scope.siteId).then(function (response) {
					var data = response.data.data;
					$scope.attributeList = angular.copy(data);
					deferred.resolve("Success - " + $scope.loadService + ' - ' + $scope.loadApi);
				});
				return deferred.promise;
			};

			$scope.checkOperator = function (value) {
				var isString = !isNaN(value);
				if (!isString) {
					$scope.mixOperator = [
						{ isShow: false, name: "EQUAL" },
						{ isShow: false, name: "NOT_EQUAL" },
						{ isShow: false, name: "GREATER_OR_EQUAL" },
						{ isShow: false, name: "GREATER_THAN" },
						{ isShow: false, name: "LESS_OR_EQUAL" },
						{ isShow: false, name: "LESS_THAN" },
						{ isShow: true, name: "CONTAIN" },
						{ isShow: true, name: "NOT_CONTAIN" },
						{ isShow: true, name: "BEGIN" },
						{ isShow: true, name: "NOT_BEGIN" },
						{ isShow: true, name: "END" },
						{ isShow: true, name: "NOT_END" },
						{ isShow: true, name: "REGEX" }
					];
				} else {
					$scope.mixOperator = [
						{ isShow: true, name: "EQUAL" },
						{ isShow: true, name: "NOT_EQUAL" },
						{ isShow: true, name: "GREATER_OR_EQUAL" },
						{ isShow: true, name: "GREATER_THAN" },
						{ isShow: true, name: "LESS_OR_EQUAL" },
						{ isShow: true, name: "LESS_THAN" },
						{ isShow: false, name: "CONTAIN" },
						{ isShow: false, name: "NOT_CONTAIN" },
						{ isShow: false, name: "BEGIN" },
						{ isShow: false, name: "NOT_BEGIN" },
						{ isShow: false, name: "END" },
						{ isShow: false, name: "NOT_END" },
						{ isShow: false, name: "REGEX" }
					];
				}
			};


			$scope.attributeValueOperator = [
				"EQUALS",
				"NOT_EQUAL"
			];

			$scope.editRuleAttribute = function (model) {
				$scope.ruleAttributeEdit = angular.copy(model);
				$scope.filterAttributeValue($scope.ruleAttributeEdit.memberCustomAttrId);
				$scope.checkOperator($scope.ruleAttributeEdit.memberCustomAttrValue);
				$scope.showAttributeEdit = true;
			};

			$scope.changeRuleAttribute = function (attrId) {
				$scope.ruleAttributeEdit.memberCustomAttrValue = null;
				$scope.memberAttrOptions = null;
				$scope.filterAttributeValue(attrId);
				$scope.showAttributeEdit = true;
			};

			$scope.filterAttributeValue = function (attrId) {
				for (var i = 0, item; item = $scope.attributeList[i]; i++) {
					if (item.attributeId == attrId) {
						$scope.memberAttrOptions = angular.copy(item.valueOptions);
						break;
					}
				}
			};



			// --------save--------
			$scope.saveRuleAttribute = function (model) {
				var isNewRuleAttribute = true;

				if (!model.memberCustomAttrId && model.memberCustomAttrId != 0) {
					alert("[" + i18n.t("icem.recommend.rule.attribute") + "] "
						+ i18n.t("icem.mandatory"));
					return;
				}

				for (var i = 0, item; item = $scope.attributeList[i]; i++) {
					if (item.attributeId == model.memberCustomAttrId) {
						model.memberCustomAttrName = angular.copy(item.name);
						break;
					}
				}

				if (!model.memberCustomAttrValue || model.memberCustomAttrValue.length <= 0) {
					alert("[" + i18n.t("icem.recommend.rule.attribute.value") + "] "
						+ i18n.t("icem.mandatory"));
					return;
				}

				if (!model.operator) {
					alert("[" + i18n.t("icem.recommend.rule.attribute") + " " + i18n.t("icem.recommend.rule.operator") + "] "
						+ i18n.t("icem.mandatory"));
					return;
				}

				for (var i = 0, item; item = $scope.loadContainer[i]; i++) {
					if (model.memberCustomAttrId == item.memberCustomAttrId) {
						var replaceRc = $window.confirm(i18n.t('icem.recommend.rule.attribute.exist') + ' ' + i18n.t('icem.update.confirm'));
						if (replaceRc) {
							$scope.loadContainer[i] = angular.copy(model);
						}
						isNewRuleAttribute = false;
						break;
					}
				}

				if (isNewRuleAttribute) {
					$scope.loadContainer.push(angular.copy(model));
				}

				$scope.showAttributeEdit = false;
			};
			// --------save--------

			$scope.openRuleAttribute = function (flag) {
				$scope.showAttributeEdit = flag;
				// initAttributeEdit(flag);
			};

			$scope.deleteRuleAttribute = function (model) {

				for (var i = 0, item; item = $scope.loadContainer[i]; i++) {
					if (model.memberCustomAttrValue == item.memberCustomAttrValue) {
						$scope.loadContainer.splice(i, 1);
						break;
					}
				}
			};

			function initAttributeEdit(flag) {
				loadMemberAttribute().then(function (res) {
					$scope.ruleAttributeEdit = {
						"memberCustomAttrValue": "",
						"operator": "EQUAL",
						"memberCustomAttrId": $scope.attributeList[0].attributeId
					};

					// initial the memberAttrOptions
					if (flag) {
						$scope.changeRuleAttribute($scope.ruleAttributeEdit.memberCustomAttrId);
					}

				}).catch(function (err) {
					console.log(err);
				});
			};
		},
	};
}]);
