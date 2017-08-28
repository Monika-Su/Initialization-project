'use strict';

app.controller('applyCtrl', function ($scope, $modalInstance, $resource, $modal, siteId, tempApplyList, $location) {
	$scope.tempApplyList = tempApplyList;
	var ApplyDetail= $resource(serverName + "api/ipcrm/changes/detail", {siteId:siteId});
	var ApplyList= $resource(serverName + "api/ipcrm/changes/list", {siteId:siteId});
	 $scope.allBtn = function(model,type){
    	angular.forEach(model, function(m){
			m.action=type;
		});
    };

    $scope.toValueString = function(value){
    	if(value instanceof Array){
    		var valueString = '';
    		angular.forEach(value, function(m){
    			valueString += (m  + '\n');
			});
    		return valueString;
    	}else if(typeof value === 'string'){
    		return value;
    	}else{
    		var valueString = '';
    		for(var key in value){
    			valueString += (key + '\n');// + ":" + value[key]);
    		}
    		return valueString;
    	}
    };

	$scope.previewApply = function(id,type){
    	ApplyDetail.get({id:id,type:type,filter:[{property:'changed',value:'true'}]},function(data) {
    		angular.forEach(data.list, function(m){
    			if(angular.isArray(m.before)){
    				if(typeof m.before[0] == 'object'){
    					m.type = 'objectArray';
    				}else{
    					m.type = 'array';
    				}
    			}else{
    				m.type = 'string';
    			}
    		});
    		 $modal.open({
	            templateUrl: 'applyPreview.html',
	            controller: 'applyPreviewCtrl',
	            size: 'lg',
	            resolve: {
	            	tempApplyDetail: function () {
	                return  data.list;
	              }
	            }
	          });
    	});
    };

    $scope.saveApply = function(applyList){
    	var obj={};
    	var hasSupervisorConfig = false;
    	angular.forEach(applyList, function(a){
    		if(a.name != 'supervisorConfig'){
	    		var list = [];
	    		angular.forEach(a.changes, function(c){
	    			if(c.action){
	    				list.push({id:c.id,action:c.action});
	    			}
	    		});
	    		if(list.length > 0){
	    			obj[a.name] = list;
	    		}
    		}else{
    			hasSupervisorConfig = true;
    		}
    	});
    	if(!isObjectEmpty(obj) || hasSupervisorConfig){
    		var applyList = new ApplyList(obj);
    		applyList.$save(function(data) {
    			return;
			}, function(error) {
				console.log("save failed " + JSON.stringify(error));
				$location.url("/");
			});
    	}
    	$modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

   function isObjectEmpty( o ) {
        for ( var p in o ) {
            if ( o.hasOwnProperty( p ) ) { return false; }
        }
        return true;
    }
});

app.controller('applyPreviewCtrl', function ($scope, $modalInstance, tempApplyDetail) {
	$scope.tempApplyDetail = tempApplyDetail;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});