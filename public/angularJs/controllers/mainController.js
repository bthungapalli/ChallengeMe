angular.module("challengeMeApp").controller("mainController",["$scope","$http","$state","$rootScope","challengeMeConstants",function($scope,$http,$state,$rootScope,challengeMeConstants){
	

	$rootScope.history=[];
	$rootScope.userDetails;
	$rootScope.shortMenu=false;
	 $scope.sideMenuClass="three wide column sideMenuBackGround";
	 $scope.mainContentClass="thirteen wide column mainContentBackGround";
	 $scope.myStyle="#00b3ac";
	$scope.getUserDetails=function(){
		$http.get(challengeMeConstants.userDetails).success(function(response){
			$rootScope.userDetails=response;
			$scope.userPhotoPath="profile/imagePath/emailId/"+$rootScope.userDetails.username+"/number/"+Math.random();
			$state.go("main.dashboard");
			$scope.currentTab="dashboard";
			}).error(function(error){
			});
	};
	$scope.getUserDetails();
	$scope.setCurrentTab=function(tabName){
		$scope.currentTab=tabName;
		if($scope.currentTab!=='myChallenges'){
			$rootScope.paddingLeft="8%"
		}else{
			$rootScope.paddingLeft="";
		}
		$rootScope.history.push(tabName);
		 //$scope.openCloseSideMenu(false,false);
	}
	
	$scope.goToState=function(tabName){
		$state.go("main."+tabName);
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
	 
	 $scope.toggleSideMenu=function(){
		 $scope.shortMenu=! $scope.shortMenu;
		 if($scope.shortMenu){
			 $scope.myStyle="#2e4356";
		 }else{
			 $scope.myStyle="#00b3ac";
		 }
		 $scope.openCloseSideMenu( $scope.shortMenu,true);
	 }
	 
	 $scope.openCloseSideMenu=function(shortMenu,collapse){
		 if(shortMenu && collapse){
			 $scope.shortMenu= shortMenu;
			 $("#nav").removeAttr( "class" );
			 $("#main").removeAttr( "class" );
			 $( "#nav" ).attr( "class" ,"one wide column sideMenuBackGroundForShortMenu");
			 $( "#main" ).attr( "class" ,"fifteen wide column mainContentBackGroundForShortMenu");
		 }else{ 
			 $scope.shortMenu= shortMenu;
			 $("#nav").removeAttr( "class" );
			 $("#main").removeAttr( "class" );
			 $( "#nav" ).attr( "class" ,"three wide column sideMenuBackGround");
			 $( "#main" ).attr( "class" ,"thirteen wide column mainContentBackGround");
		 }
	 }
}]);
