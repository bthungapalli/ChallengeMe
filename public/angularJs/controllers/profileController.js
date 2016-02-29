angular.module("challengeMeApp").controller("profileController",["$scope","$http","$rootScope","challengeMeConstants",function($scope,$http,$rootScope,challengeMeConstants){
	
	$scope.allCategories=[];
	$scope.userCategories=[];
	$scope.selection=[];
	$scope.locations=[];
	$scope.editProfile=false;
	$scope.imagePath='';
	
	$scope.getAllCategories=function(){
		
		$http.get(challengeMeConstants.categoriesURL).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.userCategories=$rootScope.userDetails.categories;
			$scope.allCategories=response;
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
		};
		
		$scope.getLocations=function(){
			$http.get(challengeMeConstants.locations).success(function(response){
				$scope.locations=response;
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};
		$scope.getImagePath = function(){
			$scope.imagePath = "profile/imagePath";
		};
		$scope.updateImage = function( response){
			  $scope.$apply(function () {
				  console.log("came to update");
				  $scope.imagePath = "profile/imagePath";
		        });
		}
		
		
	$scope.getImagePath();
	$scope.getAllCategories();
	$scope.getLocations();
	
	$scope.toggleSelection = function toggleSelection(category) {
		var idx=-1;
	    angular.forEach($scope.userCategories,function(userCategory,index){
			if(userCategory._id===category._id){
				idx=index;
			}
		});

	    if (idx > -1) {
	      $scope.userCategories.splice(idx, 1);
	    }
	    else {
	      $scope.userCategories.push(category);
	    }
	  };
	  
	  $scope.checkCategory=function(categoryId){
		  var checked=false;
		  angular.forEach($scope.userCategories,function(category,index){
				if(category._id===categoryId){
					checked=true;
				}
			});
		  return checked;
	  };
	  
	  $scope.updateProfile=function(){
		  
		  var data={
				  "emailId":$scope.userDetails.emailId,
				  "empId":$scope.userDetails.empId,
				  "workPhone":$scope.userDetails.workPhone,
				  "location":$scope.userDetails.location,
				  "categories":$scope.userCategories
		  };
		 $http.post(challengeMeConstants.profileUpdate,data).success(function(response){
			 $scope.redirectToLoginIfSessionExpires(response);
			 if(response==="updated"){
				 $scope.editProfile=false;
			 }else{
				 $scope.errorMessage="Dint not save";
			 }
			  
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
	  };
	  
	  $scope.edit=function(){
		  $scope.editProfile=true;
	  };
	  
	
}]);
