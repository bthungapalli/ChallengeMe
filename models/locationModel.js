
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel"); 
var Schema      = mongoose.Schema;


var location = Schema({
    _id: {type: Number, required: true,default:0},
    name: { type: String, required: true}
});

var location=mongoose.model('location', location);

location.find(function(err,locations){
    if(err)
          res.send(err);
    	if(locations.length!==5){
    		
    	var location1 = new location({
    		_id:1,
    		name: "Ruby Towers, Hyd"
    		});
    		 
    	location1.save(function(err){
    		  if ( err ) throw err;
    		  console.log("location1 Saved Successfully");
    		});

    	var location2 = new location({
    		_id:2,
    		name: "Krithika Layout, Hyd"
    		});
    		 
    	location2.save(function(err){
    		  if ( err ) throw err;
    		  console.log("location2 Saved Successfully");
    		});
    	
    	var location3 = new location({
    		_id:3,
    		name: "Pune Office"
    		});
    		 
    	location3.save(function(err){
    		  if ( err ) throw err;
    		  console.log("location3 Saved Successfully");
    		});

    	var location4 = new location({
    		_id:4,
    		name: "Jubilee Hills, Hyd"
    		});
    		 
    	location4.save(function(err){
    		  if ( err ) throw err;
    		  console.log("location4 Saved Successfully");
    		});
    	
    	var location5 = new location({
    		_id:5,
    		name: "Others"
    		});
    		 
    	location5.save(function(err){
    		  if ( err ) throw err;
    		  console.log("location5 Saved Successfully");
    		});
    	
    	
    	
    	};
    
	});



module.exports = mongoose.model('location', location);