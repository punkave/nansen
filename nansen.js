var request = require('request');

var global_params = [];
var responce_data = [];


module.exports = {
   /**
   * Processes a list of APIs for the given options
   *
   * @param  {obj} options
   * @param  {function} callback
   */
  processAPIs: function(options, callback) {

	infoMessage = "Starting to process APIs";
	callback(infoMessage);

	var errorMessage;
	var infoMessage;

	var APIs = options;
	var APIs = APIs.map(function (api) {
	  return api;
	});

	function callAPIs (APIs, data) {
		  
		  var API = APIs.shift();

		  if(API.set_params_from_previous) {
		  	getValue(API.set_params_from_previous, data);
		  	setValue(API.set_params_from_previous, API.options, getValue(API.set_params_from_previous.get, data));
		  }

		  if(API.set_rest_params_from_previous) {
		  	setRestParamsFromPrevious(API.set_rest_params_from_previous, API.options, data);
		  }

		  if(API.set_params_from_global) {
		  	setFromGlobal(API.set_params_from_global, API.options);
		  }

		  if(API.set_rest_params_from_global) {
		  	setRestParamsFromGlobal(API.set_rest_params_from_global, API.options);
		  }

		  request(API.options, function(err, res, body) { 
		  	
		  	if(!err)	{

		  		infoMessage = "Success processing: " + API.options.url;
		  		callback(infoMessage);

		  		if (res){
	    			try{
	        			body = JSON.parse(body);
	        			responce_data.push(body);	
	    			}
	    			catch(e){
	        			errorMessage = "Encountered an error attempting to parse responce from: " + API.options.url + " Error :" + e;
						callback(errorMessage);
	    			}			
				}else{
					errorMessage = "Got an empty responce from: " + API.options.url;
					callback(errorMessage);
				}
		    	
		    	if(APIs.length) {

		    		if(API.save_params_to_global) {
		    			saveToGlobal(API.save_params_to_global, body);
		    		}

		    		if(API.sub_process) { 
		  				infoMessage = "Adding subprocess of " + API.sub_process.length + " APIs to process queue";
		  				callback(infoMessage);
		  				APIs = API.sub_process.concat(APIs);
		  			}

		  			if(data) {
		  				if(data.sub_process){
		  					infoMessage = "Adding subprocess of " + data.sub_process.length + " APIs to process queue";
		  					callback(infoMessage);
		  					APIs = data.sub_process.concat(APIs);
		  				}
		  			}

		      		callAPIs (APIs, body);
		    	}
		    	else {
		    		callback(null, responce_data);
		    	}
			}
			else{
				errorMessage = "encountered an error attempting to process " + API.options.url + "Error :" + err;
				callback(errorMessage);
			}
		  });
		}

		callAPIs(APIs);
	}
};

function getValue(path, data) {
	
	var keys = path.split(".");

	for (var i = 0; i < keys.length; i++){
		data = data[keys[i]];
	}

	return data;
}

function setValue(path, options, value) {

	var keys = path.split(".");
	var opValue = options;

	for (var i = 0; i < keys.length -1; i++) {
		opValue = opValue[keys[i]];
	}

	opValue[keys[keys.length - 1]] = value;
}

function saveToGlobal(options, data) {

	for (var key in options) {
        global_params[key] =  getValue(options[key], data);
    }
}

function setFromGlobal(options, data) {

	for (var key in options) {
        setValue(options[key], data, global_params[key]);
    }
}

function setRestParamsFromPrevious(restParams, options, data) {

    for (var key in restParams) {
		options.url =  options.url.replace(key,  getValue(restParams[key], data));
    }
}

function setRestParamsFromGlobal(restParams, options) {

      for (var key in restParams) {
		options.url =  options.url.replace(key, global_params[restParams[key]]);
    }
}