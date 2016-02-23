angular.module("challengeMeApp").controller("mainController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

	$rootScope.history=[];
	$rootScope.userDetails;
	$scope.getUserDetails=function(){
		$http.get("/userDetails").success(function(response){
			$rootScope.userDetails=response;
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
		$http.get("/logout").success(function(response){
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
