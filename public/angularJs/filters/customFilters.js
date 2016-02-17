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
		});