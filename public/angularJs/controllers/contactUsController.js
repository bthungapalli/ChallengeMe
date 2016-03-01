angular.module("challengeMeApp").controller("contactUsController",["$scope","$http","$state","challengeMeConstants","$loading",function($scope,$http,$state,challengeMeConstants,$loading){
	
$scope.contactUs={
		"subject":"",
		"query":""
}
	
	
	$scope.sendQuery=function(){
	$scope.loadingMessage="sending mail..";
	$loading.start('contactUs');
		$http.post(challengeMeConstants.contactUs,$scope.contactUs).success(function(response){
			alert(response);
			$loading.finish('contactUs');
			}).error(function(error){
			});
	};
	
}]);
