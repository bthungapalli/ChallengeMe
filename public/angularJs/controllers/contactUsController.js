angular.module("challengeMeApp").controller("contactUsController",["$scope","$http","$state","challengeMeConstants","$loading",function($scope,$http,$state,challengeMeConstants,$loading){
	
$scope.contactUs={
		"subject":"",
		"query":""
}
	
$scope.successMessage="";
$scope.errorMessage="";
	$scope.sendQuery=function(){
		$scope.successMessage="";
	$scope.loadingMessage="sending mail..";
	$loading.start('contactUs');
		$http.post(challengeMeConstants.contactUs,$scope.contactUs).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.successMessage="Thank you for contacting us."
				$scope.contactUs={
					"subject":"",
					"query":""
			};
			$loading.finish('contactUs');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
	};
	
}]);
