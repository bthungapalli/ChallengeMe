angular.module("challengeMeApp").controller("solutionController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading","$parse",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading,$parse){
	
	
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
	
	$scope.updateSolutionComment=function(challengeObj,solution,commentIndex){
		//update the call for update
	if($("#updateSolutionTextArea"+challengeObj.index+commentIndex).val().trim().length>0){
		var comment = $("#updateSolutionTextArea"+challengeObj.index+commentIndex).val();
		var data={"solutionId":solution._id,"commentId":solution.comments[commentIndex]._id,"comment":comment}
		$http.post(challengeMeConstants.solution+"/"+challengeMeConstants.updateComment,data).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response==="error"){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			}else{
				solution.comments[commentIndex].comment = comment;
				var editId="isSolutionEdit"+challengeObj.index+commentIndex;
				$parse(editId).assign($scope, false); 
			};
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
	}
};


$scope.deleteSolutionComment=function(challengeObj,solution,commentIndex){
	var data={"solutionId":solution._id,"commentId":solution.comments[commentIndex]._id}
	$http.post(challengeMeConstants.solution+"/"+challengeMeConstants.deleteComment,data).success(function(response){
		$scope.redirectToLoginIfSessionExpires(response);
		if(response==="error"){
			$scope.errorMessage=challengeMeConstants.errorMessage;
		}else{
			solution.comments.splice(commentIndex,1);
			$scope["isSolutionEdit"+solution.index+commentIndex] = false;
		};
		}).error(function(error){
			$scope.errorMessage=challengeMeConstants.errorMessage;
		});
};

$scope.editSolutionComment = function(challengeObj,solution,commentIndex){
$("#updateSolutionTextArea"+challengeObj.index+commentIndex).val(solution.comments[commentIndex].comment);
var editId="isSolutionEdit"+challengeObj.index+commentIndex;
$parse(editId).assign($scope, true);

}
	
	
}]);
