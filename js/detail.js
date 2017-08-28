/**
 * Created by bjwsl-001 on 2016/9/19.
 */
var app = angular.module('myApp',['ng','ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/products-detail',{templateUrl:'tpl/products-detail.html',controller:'mainCtrl'})
        .when('/products-detail/:did',{templateUrl:'tpl/products-detail.html',controller:'mainCtrl'})
        .when('/products-detail-m',{templateUrl:'tpl/products-detail-m.html',controller:'detail_mCtrl'})
        .when('/products-detail-m/:did',{templateUrl:'tpl/products-detail-m.html',controller:'detail_mCtrl'})
        //.when('/products-detail_s',{templateUrl:'tpl/products-detail_s.html',controller:'detail_sCtrl'})
        //.when('/products-detail_s/:did',{templateUrl:'tpl/products-detail_s.html',controller:'detail_sCtrl'})
        .otherwise({redirectTo:'/products-detail'})
});
app.controller("parentCtrl",function($scope,$location){
    $scope.jump = function (path) {
        $location.path(path);
    }
});
app.controller("mainCtrl",function($scope,$http,$routeParams){
    $scope.hasMore = true;
    $http.get("data/pro_detail_m.php?start=0").success(function(data){
        $scope.dishList=data;
    });
    $scope.moreLoad=function(){
        $http.get("data/pro_detail_m.php?id="+$scope.dishList.length).success(function(data){
            $scope.dishList=$scope.dishList.concat(data);
            if(data.length<5){
                $scope.hasMore=false;
            }
        });
    };
    $scope.$watch("kw",function(){
        if($scope.kw){
            $http.get("data/pro_kw.php?kw="+$scope.kw).success(function(data){
                $scope.dishList=data;
            });
        }
    });
});
app.controller('detail_mCtrl', function ($scope,$http,$routeParams) {
    $http.get('data/pro_detail_m.php?id='+$routeParams.did)
        .success(function (data) {
            console.log(data);
            $scope.dish = data[0];
        })
});






