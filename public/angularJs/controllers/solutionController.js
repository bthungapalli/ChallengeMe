angular.module("challengeMeApp").controller("solutionController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	
	
	$scope.errorMessage="";
	$scope.successMessageForSolution="";
	$scope.solutionEmpty="";
	$scope.hideEdit=false;
	$scope.solutionObj={
			"_id":"",
			"solution":"",
			"anonymous":false,
			"challengeId":$scope.challenge._id,
			"file":""
	};
	$(":file").jfilestyle({placeholder: "",buttonText: "Browse",'inputSize': '50%'});
	$scope.getSolution=function(){
		$scope.loadingMessage="fetching solution..";
		$loading.start('solution');
		$http.get(challengeMeConstants.solution+"/"+$scope.challenge._id).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response!==""){
				$scope.solutionIdForFileUpload=response._id;
			}else{
				$scope.solutionIdForFileUpload="-1"
			}
			
			if(response!==undefined && response!==""){
				$scope.solutionObj=response;
			
				$("#solution"+$scope.challenge._id).val(response.solution);
				//tinymce.get('solution'+$scope.challenge._id).setContent(response.solution)
				if($scope.solutionObj.file===undefined){
					$scope.solutionObj.file="";
				}
				
			}
			
			
			if (tinymce.editors.length > 0) {
			    tinymce.execCommand('mceFocus', true, "solution"+$scope.challenge._id );       
			    tinymce.execCommand('mceRemoveEditor',true, "solution"+$scope.challenge._id);        
			    tinymce.execCommand('mceAddEditor',true,"solution"+$scope.challenge._id);
			}else{
					 
					tinymce.init({
					    selector: "#solution"+$scope.challenge._id,
						 plugins: [
					        "advlist autolink lists link image charmap print preview anchor ",
					        "searchreplace visualblocks code fullscreen",
					        "insertdatetime media table contextmenu paste textcolor colorpicker "
					    ],
					    toolbar: "insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image "
				   });	

			}
			$loading.finish('solution');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('solution');
			});
	};

	$scope.getSolution();
	
	$scope.saveSolution=function(challenge){
		
		$scope.solutionEmpty="";
		
		if(tinymce.get('solution'+$scope.challenge._id).getContent().length>0 ){
			$scope.successMessageForSolution="";
			$scope.loadingMessage="saving solution..";
			$loading.start('solution');
			$scope.errorMessage="";
			$('#uploadForm').ajaxSubmit({
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
	            			$scope.solutionObj.solution=tinymce.get('solution'+$scope.challenge._id).getContent();
	            			$http.post(challengeMeConstants.solution,$scope.solutionObj).success(function(response){
	            				$scope.redirectToLoginIfSessionExpires(response);
	            				if(response=="error"){
	            					$scope.errorMessage=challengeMeConstants.errorMessage;
	            				};
	            				$scope.solutionObj._id=response._id;
	            				if($scope.solutionObj.status==="create"){
	            					$scope.hideEdit=true;
	            					challenge.solutionStatus="create";
	            				}
	            			    challenge.collapse=false;
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
			
		}else{
			$scope.solutionEmpty="Please Enter Solution";
		}
		
	
	
	};
	
	
}]);
