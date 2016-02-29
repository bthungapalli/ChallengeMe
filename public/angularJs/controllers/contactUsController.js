angular.module("challengeMeApp").controller("contactUsController",["$scope","$http","$state","challengeMeConstants",function($scope,$http,$state,challengeMeConstants){
	
$scope.contactUs={
		"subject":"",
		"query":""
}
	
	
	$scope.sendQuery=function(){
		$http.post(challengeMeConstants.contactUs,$scope.contactUs).success(function(response){
			alert(response);
			}).error(function(error){
			});
	};
	
}]);
