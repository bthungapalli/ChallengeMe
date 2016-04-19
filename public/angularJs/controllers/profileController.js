angular.module("challengeMeApp").controller("profileController",["$scope","$http","$rootScope","challengeMeConstants","$loading",function($scope,$http,$rootScope,challengeMeConstants,$loading){
	
	$scope.allCategories=[];
	$scope.userCategories=[];
	$scope.selection=[];
	$scope.locations=[];
	$scope.editProfile=false;
	$scope.imagePath='';
	$scope.successMessage="";
	$scope.regex = '\\d+';
	$scope.errorMessageForImage="";
	 $(":file").jfilestyle({placeholder: "",buttonText: "Browse",'inputSize': '62%'});
	
/*	 $('#uploadForm2').submit(function() {
		 $scope.errorMessageForImage="";
		 
		var imageSize= $('#profile')[0].files[0].size/1024;
		 if(imageSize>500){
			 $scope.errorMessageForImage="Max image size 500 kb.";
			 $scope.$digest();
		 }else{
			 $(this).ajaxSubmit({
		            error: function(xhr) {
		        	status('Error: ' + xhr.status);
		            },
		            success: function(response) {
		            	if(response==="error"){
		            		$scope.errorMessage=challengeMeConstants.errorMessage;
		            	}else{
		            		var randomNumber=Math.random();
			            	$("#profileImage > img").attr("src","profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random());
			            	$("#userDetails > img").attr("src","profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random());
			            	$scope.editProfile=false;
			            	$scope.$digest();
		            	}
		             }
		    });
		 }
	        //Very important line, it disable the page refresh.
	    return false;
	    }); */
	
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
	
	$scope.toggleSelection = function(category) {
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
	  
	  $scope.toggleAllSelection = function() {
		  if($scope.userCategories.length===$scope.allCategories.length){
			  $scope.userCategories=[];
		  }else{
			  $scope.userCategories=angular.copy($scope.allCategories);
		   }
	  };
	  
	  $scope.selectAllCategories = function() {
		  if($scope.userCategories.length===$scope.allCategories.length){
			 return true;
		  }else{
			  return false;
		   }
	  };
	
	  $scope.updateProfile=function(){
		  $scope.successMessage="";
		  $scope.errorMessageForImage="";
		  
		 // var imageSize= $('#profile')[0].files[0].size/1024;
			 if( $('#profile')[0].files.length>0 && ($('#profile')[0].files[0].size/1024>500)){
				 $scope.errorMessageForImage="Max image size 500 kb.";
			 }else{
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
							$rootScope.userDetails.categories=$scope.userCategories;
							 $("#uploadForm").ajaxSubmit({
						            error: function(xhr) {
						        	status('Error: ' + xhr.status);
						            },
						            success: function(response) {
						            	if(response==="error"){
						            		$scope.errorMessage=challengeMeConstants.errorMessage;
						            	}else{
						            		var randomNumber=Math.random();
							            	$("#profileImage > img").attr("src","profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random());
							            	$("#userDetails > img").attr("src","profile/imagePath/emailId/"+$scope.userDetails.username+"/number/"+Math.random());
							            	$scope.editProfile=false;
							            	 $scope.successMessage="Profile updated.";
											 $scope.errorMessageForImage="";
							            	$scope.$digest();
						            	}
						             }
						    });
					 }else if(response==="error"){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					 }
					 $loading.finish('profile');
						}).error(function(error){
							 $scope.successMessage="";
							$scope.errorMessage=challengeMeConstants.errorMessage;
							$loading.finish('profile');
						});
			 }
		 
	  };
	  
	  $scope.edit=function(){
		  $scope.editProfile=true;
	  };
	  
	
}]);
