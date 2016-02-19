angular.module("challengeMeApp").controller("loginController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	
	
	$scope.user={
			userName:"apatha@osius.com",
			password:"Cricket@100",
			errorMessage:""
		};
	$scope.userDetiails;
		
		$scope.authenticateUser=function(){
			$scope.user.errorMessage="";
			var authenticateUserUrl = "/authenticate";
			var data = {
					userName : $scope.user.userName,
					password :  $scope.user.password
				};
			$http.post(authenticateUserUrl,data).success(function(response){
				
				if(angular.isDefined(response._id)){
					$rootScope.locations=response.locations;
					$scope.userDetails=response;
					$state.go("main");
				}else if(response==="Not able to access server"){
					$scope.user.errorMessage="Not able to access server";
				}
			}).error(function(error){
				$scope.user.errorMessage="Some thing went wrong.";
			});
			
		};
		
		$scope.redirectToLoginIfSessionExpires=function(msg){
			if(msg==="sessionExpired"){
				$state.go("/");
			};
		};

	$state.go("/");
}]);
