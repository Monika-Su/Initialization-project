'use strict';

app.controller('importController', function ($window, $timeout, $scope, $modalInstance, $modal, $upload, $resource, CommonService, ngTableParams) {
	$scope.preShow = false; // for PreviewModal

	if($scope.disableMerge){
		$scope.importModal={"tempFile":"","uploadType":"renew"};
	}else{
		$scope.importModal={"tempFile":"","uploadType":"merge"};
	}

	var arrayImport = $scope.imTitlePreview;
	var imtitleArray = [];

	for(var i = 0; i< arrayImport.length; i++){
	    if(imtitleArray.indexOf(arrayImport[i].title) === -1){
	    	imtitleArray.push(arrayImport[i].title);
	    };
	};

	$scope.prnameExist = false;
	$scope.prtypeExist = false;
	$scope.prmemoExist = false;
	$scope.contentExist = false;
	$scope.statusExist = false;
	$scope.disableExist = false;
	$scope.ruleContentExist = false;
	$scope.ruleConditionExist = false;
	$scope.elemIDExist = false;
	$scope.optionExist = false;
	$scope.operationExist = false;
	$scope.expireExist = false;
	$scope.actionExist = false;
	$scope.segmentExist = false;
	$scope.userFilter = false;
	$scope.itemFilter = false;
	$scope.rankingFilter = false;

	var prname = /^(?=.*?\bicem.itemList.name\b)|(?=.*?\bicem.mailRecommendContent.name\b)|(?=.*?\bicem.recommendContent.name\b)|(?=.*?\bicem.template.name\b)|(?=.*?\bicem.recommend.name\b)|(?=.*?\bicem.recommend.rule.name\b)|(?=.*?\bicem.recommend.mail.positions\b)|(?=.*?\bicem.memberAttribute.name\b)|(?=.*?\bicem.conversion.name\b)|(?=.*?\bicem.name\b)|(?=.*?\bicem.segment.name\b)|(?=.*?\bicem.score.group.name\b)|(?=.*?\bicem.recommend.ads.segment.name\b)|(?=.*?\bicem.ads.segment.rule.list\b).*$/;
	var prtype = /^(?=.*?\bicem.itemList.method\b)|(?=.*?\bicem.recommend.type\b).*$/;
	var prmemo = /^(?=.*?\bicem.memo\b)|(?=.*?\bicem.recommendContent.memo\b)|(?=.*?\bicem.template.memo\b)|(?=.*?\bicem.recommend.rule.memo\b).*$/;
	var prcontent = /^(?=.*?\bicem.recommendContent.content\b).*$/;
	var prstatus = /^(?=.*?\bicem.status\b).*$/;
	var prdisable = /^(?=.*?\bicem.enable.status\b).*$/;
	var ruleContent = /^(?=.*?\bicem.rule.content\b).*$/;
	var ruleCondition = /^(?=.*?\bicem.rule.condition\b).*$/;
	var elemID = /^(?=.*?\bicem.recommend.elementId\b).*$/;
	var converOption = /^(?=.*?\bicem.conversion.options\b).*$/;
	var scoreOperation = /^(?=.*?\bicem.operation\b).*$/;
	var scoreExpiration = /^(?=.*?\bicem.score.group.expiration\b).*$/;
	var scoreAction = /^(?=.*?\bicem.score.action\b).*$/;
	var adsSegment = /^(?=.*?\bicem.recommend.ads.segment.type\b).*$/;
	var userFilter = /^(?=.*?\bicem.filter.user.condition\b).*$/;
	var itemFilter = /^(?=.*?\bicem.filter.target.item.condition\b).*$/;
	var rankingFilter = /^(?=.*?\bicem.filter.exception.flag\b).*$/;

	if (imtitleArray.toString().match(prname)) {
		$scope.prnameExist = true;
	};

	if (imtitleArray.toString().match(prtype)) {
		$scope.prtypeExist = true;
	};

	if (imtitleArray.toString().match(prmemo)) {
		$scope.prmemoExist = true;
	};

	if (imtitleArray.toString().match(prcontent)) {
		$scope.contentExist = true;
	};

	if (imtitleArray.toString().match(prstatus)) {
		$scope.statusExist = true;
	};

	if (imtitleArray.toString().match(prdisable)) {
		$scope.disableExist = true;
	};

	if (imtitleArray.toString().match(ruleContent)) {
		$scope.ruleContentExist = true;
	};

	if (imtitleArray.toString().match(ruleCondition)) {
		$scope.ruleConditionExist = true;
	};

	if (imtitleArray.toString().match(elemID)) {
		$scope.elemIDExist = true;
	};

	if (imtitleArray.toString().match(converOption)) {
		$scope.optionExist = true;
	};

	if (imtitleArray.toString().match(scoreOperation)) {
		$scope.operationExist = true;
	};

	if (imtitleArray.toString().match(scoreExpiration)) {
		$scope.expireExist = true;
	};

	if (imtitleArray.toString().match(scoreAction)) {
		$scope.actionExist = true;
	};

	if (imtitleArray.toString().match(adsSegment)) {
		$scope.segmentExist = true;
	};

	if (imtitleArray.toString().match(userFilter)) {
		$scope.userFilter = true;
	};

	if (imtitleArray.toString().match(itemFilter)) {
		$scope.itemFilter = true;
	};

	if (imtitleArray.toString().match(rankingFilter)) {
		$scope.rankingFilter = true;
	};

	$scope.cancel = function () {
		        $modalInstance.dismiss('cancel');
		      };

    $scope.onBatchFileSelect = function($batchFile, $modal) {
        		if ($batchFile.length > 0){
        			$scope.upload = $upload.upload({
        				url : $scope.previewUrl + "/bulk?siteId=" + $scope.loginInformation.siteId+"&type="+$scope.importModal.uploadType + ($scope.previewUrl === $scope.previewUrlTwo ? $scope.recomPositionId + $scope.recommendObject.id : ""),
        				file : $batchFile[0]
        			}).progress(function(evt) {
//            				 console.log('progress: ' + parseInt(100.0 * evt.loaded /
//            				 evt.total) + '% file :'+ evt.config.file.name);
        			}).success(function(data, status, headers, config) {
        				if(data.error){
        					var errorMsg = i18n.t("icem.uploadFail") + ':\n';
        					angular.forEach(data.errors, function(err){
        						errorMsg += err + '\n';
        			    	});
        					alert(errorMsg);
        					$scope.cancel();
        				}else{
        					if(!data.changed){
        					       alert(i18n.t('icem.uploadSuccess') + ' 0 ' + i18n.t("icem.upload.row"));
        					       $scope.cancel();
        					}else{
        						//member import does not have preview page
        						if(!$scope.contentListPreview){
        							alert(data.infos[0] + i18n.t("icem.items.UploadSuccess"));
        							return;
        						}

        						$scope.infos = data.infos;
        						$scope.preShow = true;
        						$scope.impoortPreviewTableParams = new ngTableParams({
        					        page: 1,            // show first page
        					        count: 10
        					    }, {
        					        total: 0,           // length of data
        					        getData: function($defer, params) {
        					            // get preview
        								var requestUrl = params.url();

        								if (typeof $scope.preview == "undefined") {
        								}else{
        									if($scope.preview.siteGroupId){
            					        		requestUrl.listId = $scope.preview.siteGroupId;
            					        	}else{
            					        		requestUrl.listId = $scope.search.siteGroupId;
            					        		$scope.preview.siteGroupId = requestUrl.listId;
            					        	}
        								}
        								if('listID' in requestUrl){
            					        	$scope.contentListPreview.get(param.url(), function(previewData) {
        					                    $timeout(function($scope) {
        					                    params.total(previewData.data.grandTotal);
        						                $defer.resolve(previewData.data.items);
        					                }, 500);
        					            });
        								}else{
            					        	$scope.contentListPreview.get(requestUrl, function(previewData) {
        					                    $timeout(function($scope) {
        					                    params.total(previewData.data.grandTotal);
        						                $defer.resolve(previewData.data.items);
        					                }, 500);
        					            });
        								}
        					        }
        					    });

        					}
        				}
        			});
        		}
        	};

        	$scope.applyImport = function() {
            	$scope.contentListPreview.save(function(data) {
            		$scope.contentTableParams.reload();
            		if($scope.contentTableParamsTwo){
            			$scope.contentTableParamsTwo.reload();
            			}
                	$scope.cancel();
                }, function(error) {
                     console.log("save failed " + JSON.stringify(error));
                });
            };

});