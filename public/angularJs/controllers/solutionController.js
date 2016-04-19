angular.module("challengeMeApp").controller("solutionController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	
	
	$scope.errorMessage="";
	$scope.successMessageForSolution="";
	$scope.hideEdit=false;
	$scope.solutionObj={
			"_id":"",
			"solution":"",
			"anonymous":false,
			"challengeId":$scope.challenge._id,
			"file":""
	};
	$(":file").jfilestyle({placeholder: "",buttonText: "Browse",'inputSize': '72%'});
	$scope.getSolution=function(){
		$scope.loadingMessage="fetching solution..";
		$loading.start('solution');
		console.log("inside getSolution");
		$http.get(challengeMeConstants.solution+"/"+$scope.challenge._id).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			console.log("inside response"+response);
			if(response!==""){
				$scope.solutionIdForFileUpload=response._id;
			}else{
				$scope.solutionIdForFileUpload="-1"
			}
			
			if(response!==undefined && response!==""){
				$scope.solutionObj=response;
				if($scope.solutionObj.file===undefined){
					$scope.solutionObj.file="";
				}
				
			}
			$loading.finish('solution');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('solution');
			});
	};

	$scope.getSolution();
	
	
	 $('#uploadForm').submit(function() {
		 $scope.loadingMessage="Saving file..";
			$loading.start('createChallenge');
	        $(this).ajaxSubmit({
	            error: function(xhr) {
	        	status('Error: ' + xhr.status);
	            },
	            success: function(response) {
	            	if(response==="error"){
	            		$scope.errorMessage=challengeMeConstants.errorMessage;
	            	}else{
	            		
	            		$scope.$apply(function(){
	            			$scope.solutionObj.file=response;
	            			$scope.successMessageForSolution="";
	            			$scope.loadingMessage="saving solution..";
	            			$loading.start('solution');
	            			$scope.errorMessage="";
	            			$http.post(challengeMeConstants.solution,$scope.solutionObj).success(function(response){
	            				$scope.redirectToLoginIfSessionExpires(response);
	            				if(response=="error"){
	            					$scope.errorMessage=challengeMeConstants.errorMessage;
	            				};
	            				$scope.solutionObj._id=response._id;
	            				if($scope.solutionObj.status==="create"){
	            					$scope.hideEdit=true;
	            					$scope.challenge.solutionStatus="create";
	            				}
	            				$scope.challenge.collapse=false;
	            				$scope.successMessageForSolution="solution updated."
	            				$loading.finish('solution');
	            				}).error(function(error){
	            					$scope.successMessageForSolution="";
	            					$scope.errorMessage=challengeMeConstants.errorMessage;
	            					$loading.finish('solution');
	            				});
	            			
	            		})
	            		
	            			
	            	}
	             }
	    });
	        //Very important line, it disable the page refresh.
	    return false;
	    }); 
	
	

	
	
}]);
