angular.module('challengeMeApp')
.filter('substringCreatedDate', function() {
  return function(input) {
	  if(input===undefined){
		  var year=new Date().getFullYear();
		  var month=new Date().getMonth()+1;
		  month=month<10?"0"+month:month;
		  var date=new Date().getDate();
		  return year+"-"+month+"-"+date;
	  }
    return input.substring(0,11);
  };
}).filter('camelCase', function() {
	  return function(input) {
		  var result="";
		 if(input!==undefined){
			 var inputArray=input.trim().split(" ");

			  for(var i=0;i<inputArray.length;i++){
			  var temp=inputArray[i];
			  inputArray[i]=temp[0].toUpperCase()+inputArray[i].substring(1,inputArray[i].length);
			  }
			 
			  for(var i=0;i<inputArray.length;i++){
			  result=result+" "+inputArray[i];
			  } 
		 }
			 
			  return result;
	  };
}).filter('delimiterForEdition', function() {
		  return function(input) {
			  var result="";
			 if(input!==undefined){
				 var inputArray=input.trim().split(":");
				 if(inputArray.length>1){
					 result = inputArray[1];
				 }
				 result = inputArray[0];
			 }
				 
				  return result;
		  };
 }).filter('dateFormat', function() {
			  return function(input) {
				  var months=["January", "February", "March", "April", "May",
				              "June", "July", "August", "September", "October",
				              "November", "December"];
				  var inputArray=input.trim().split("/");
				  if(inputArray.length>1){
					  return inputArray[1]+" "+months[inputArray[0]-1]+" "+inputArray[2];
				  }else{
					  var inputArray=input.trim().split("T");
					  var dates=inputArray[0].split("-");
					  return dates[2]+" "+months[dates[1]-1]+" "+dates[0];
				  }
			  };
})
.filter('displayTab', function() {
			  return function(input) {
				var tabName=""
					if(input==="allChallenges"){
						tabName="All Posts";
					}else if(input==="myChallenges"){
						tabName="My Posts";
					}else if(input==="subcribedChallenges"){
						tabName="Subcribed Challenges";
					}else if(input==="contactUs"){
						tabName="Contact Us";
					}else if(input==="createChallenge"){
						tabName="Post Challenge";
					}else if(input==="createLearning"){
						tabName="Share A Learning";
					}else if(input==="profile"){
						tabName="My Profile";
					}else if(input==="faq"){
						tabName="FAQ";
					}else{
						tabName=input;
					}
				  return tabName
			  };
}).filter('displayDescriptionForTab', function() {
	  return function(input) {
			var tabName=""
				if(input==="allChallenges"){
					tabName="List of all Challenges & Learnings";
				}else if(input==="myChallenges"){
					tabName="My Challenges & Learnings";
				}else if(input==="subcribedChallenges"){
					tabName="Subcribed Challenges";
				}else if(input==="contactUs"){
					tabName="Feel free to Contact us";
				}else if(input==="createChallenge"){
					tabName="Post Challenge";
				}else if(input==="createLearning"){
					tabName="Share A Learning";
				}else if(input==="profile"){
					tabName="My Profile";
				}else if(input==="faq"){
					tabName="Frequently Asked Questions";
				}else if(input==="dashboard"){
					tabName="Dashboard";
				}else if(input==="categories"){
					tabName="Add or Update Categories";
				}else {
					tabName=input;
				}
			  return tabName
		  };
});