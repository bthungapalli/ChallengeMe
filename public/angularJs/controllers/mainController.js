angular.module("challengeMeApp").controller("mainController",["$scope","$http","$state","$rootScope","challengeMeConstants",function($scope,$http,$state,$rootScope,challengeMeConstants){
	

	$rootScope.history=[];
	$rootScope.userDetails;
	$scope.getUserDetails=function(){
		$http.get(challengeMeConstants.userDetails).success(function(response){
			$rootScope.userDetails=response;
			$scope.userPhotoPath="profile/imagePath/emailId/"+$rootScope.userDetails.username+"/number/"+Math.random();
			$state.go("main.allChallenges");
			$scope.currentTab="allChallenges";
			}).error(function(error){
			});
	};
	$scope.getUserDetails();
	$scope.setCurrentTab=function(tabName){
		$scope.currentTab=tabName;
		$rootScope.history.push(tabName);
	}
	
	if($state.current.name==="main.logout"){
		$http.get(challengeMeConstants.logout).success(function(response){
			if(response==="logout"){
				$state.go("/");
			};
			}).error(function(error){
			});
	};
	
	 $scope.sort = function(keyname){
	        $scope.sortKey = keyname;   
	        $scope.reverse = !$scope.reverse; 
	    }
}]);
