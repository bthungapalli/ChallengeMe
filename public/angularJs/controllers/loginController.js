angular.module("challengeMeApp").controller("loginController",["$scope","$http","$state","$rootScope","challengeMeConstants",function($scope,$http,$state,$rootScope,challengeMeConstants){
	
	
	$scope.user={
			userName:"",
			password:"",
			errorMessage:"",
			invalidCredentials:false
		};
	console.log(challengeMeConstants.authenticateUserUrl);
		
		$scope.authenticateUser=function(){
			$scope.user.errorMessage="";
			$scope.user.invalidCredentials=false;
			var data = {
					userName : $scope.user.userName,
					password :  $scope.user.password
				};
			$http.post(challengeMeConstants.authenticateUserUrl,data).success(function(response){
				
				if(angular.isDefined(response._id)){
					$state.go("main");
				}else if(response==="Not able to access server"){
					$scope.user.errorMessage="Not able to access server";
				}else if(response==="Invalid Credentials"){
					$scope.user.errorMessage="Invalid Credentials";
					$scope.user.invalidCredentials=true;
				}
			}).error(function(error){
				$scope.user.errorMessage=challengeMeConstants.errorMessage;
			});
			
		};
		
		$scope.redirectToLoginIfSessionExpires=function(msg){
			if(msg==="sessionExpired"){
				$state.go("/");
			};
		};

	$state.go("/");
}]);
