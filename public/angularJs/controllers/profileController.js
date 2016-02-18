angular.module("challengeMeApp").controller("profileController",["$scope","$http",function($scope,$http){
	
	$scope.allCategories=[];
	$scope.userCategories=[];
	$scope.selection=[];
	$scope.locations=[];
	$scope.editProfile=false;
	
	$scope.getAllCategories=function(){
		
		$http.get("/categories").success(function(response){
			
			$scope.userCategories=[{"_id":"4","name":"ggqw","description":"gggqw","__v":0,"updated_at":"2016-02-17T11:09:26.032Z","created_at":"2016-02-17T11:09:26.032Z"}];
			
			$scope.allCategories=response;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		};
		
		$scope.getLocations=function(){
			
			$http.get("/locations").success(function(response){
				$scope.locations=response;
				}).error(function(error){
					$scope.category.errorMessage="Some thing went wrong.";
				});
		};
	
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
		  $scope.editProfile=false;
		 /* $http.post("/updateUser").success(function(response){
			  $scope.editProfile=false;
				}).error(function(error){
					$scope.category.errorMessage="Some thing went wrong.";
				});*/
	  };
	  
	  $scope.edit=function(){
		  $scope.editProfile=true;
	  };
	  
/*	$scope.handleDropInAllCategory = function(item) {
		 var itemJson=  JSON.parse(item);
		$scope.allCategories.push(itemJson);
		angular.forEach($scope.userCategories,function(userCategory,index){
			if(userCategory.name===itemJson.name){
				$scope.userCategories.splice(index,1);
			}
		});
	  };
	
	$scope.handleDropInUserCategory = function(item) {
		 var itemJson=  JSON.parse(item);
		$scope.userCategories.push(itemJson);
		angular.forEach($scope.allCategories,function(allCategory,index){
			if(allCategory.name===itemJson.name){
				$scope.allCategories.splice(index,1);
			}
		});
	  };*/

	
}]);
