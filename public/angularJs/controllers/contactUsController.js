angular.module("challengeMeApp").controller("contactUsController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	
$scope.contactUs={
		"subject":"",
		"query":""
}
	
	
	$scope.sendQuery=function(){
		$http.post("/contactUs",$scope.contactUs).success(function(response){
			alert(response);
			}).error(function(error){
			});
	};
	
}]);
