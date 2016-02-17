angular.module("challengeMeApp").controller("profileController",["$scope","$http",function($scope,$http){
	
	$scope.allCategories=[];
	$scope.userCategories=[];
	$scope.selection=[];
	$scope.locations=[];
	
	$scope.getAllCategories=function(){
		
		$http.get("/categories").success(function(response){
			
			/*var userCat=[{
				    "_id" : "4",
				    "name" : "ggqw",
				    "description" : "gggqw",
				    "updated_at" : "2016-02-17T11:04:29.608Z",
				    "created_at" : "2016-02-17T11:04:29.608Z",
				    "__v" : 0
				}];
			*/
		//	$scope.userCategories=userDetails.categories;
			
		/*	angular.forEach($scope.userCategories,function(userCategory){
				angular.forEach(response,function(allCategory,index){
					if(allCategory.name===userCategory.name){
						response.splice(index,1);
					}
				});
			});*/
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
	    var idx = $scope.userCategories.indexOf(category);

	    if (idx > -1) {
	      $scope.userCategories.splice(idx, 1);
	    }
	    else {
	      $scope.userCategories.push(category);
	    }
	  };
	  
	  $scope.checkCategory=function(categoryId){
		  angular.forEach($scope.userCategories,function(category,index){
				if(category._id==categoryId){
					return true;
				}
			});
	  }
	
	
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
