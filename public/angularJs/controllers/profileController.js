angular.module("challengeMeApp").controller("profileController",["$scope","$http","$rootScope","challengeMeConstants","$loading",function($scope,$http,$rootScope,challengeMeConstants,$loading){
	
	$scope.allCategories=[];
	$scope.userCategories=[];
	$scope.selection=[];
	$scope.locations=[];
	$scope.editProfile=false;
	$scope.imagePath='';

	 $(":file").jfilestyle({placeholder: "",buttonText: "Profile",'inputSize': '62%'});
	
	 $('#uploadForm').submit(function() {
	        $(this).ajaxSubmit({
	            error: function(xhr) {
	        	status('Error: ' + xhr.status);
	            },
	            success: function(response) {
	            	var randomNumber=Math.random();
	            	$("#profileImage > img").attr("src","profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random());
	            	$("#userDetails > img").attr("src","profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random());
	                }
	    });
	        //Very important line, it disable the page refresh.
	    return false;
	    }); 
	
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
			$scope.imagePath = "profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random();
		};
		$scope.updateImage = function( response){
			  $scope.$apply(function () {
				  console.log("came to update");
				  $scope.imagePath = "profile/imagePath";
		        });
		}
		
		$scope.loadingMessage="loading profile..";
		$loading.start('profile');
	$scope.getImagePath();
	$scope.getAllCategories();
	$scope.getLocations();
	$loading.finish('profile');
	
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
		  $scope.loadingMessage="updating profile..";
			$loading.start('profile');
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
			 $loading.finish('profile');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('profile');
				});
	  };
	  
	  $scope.edit=function(){
		  $scope.editProfile=true;
	  };
	  
	
}]);
