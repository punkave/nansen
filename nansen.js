var commands = require('commander');
var request = require('request');
var bunyan = require('bunyan');

var log = bunyan.createLogger({name: "nansen"});
var config;
var global_params = [];

commands
  .version('0.0.0')
  .option('-o, --config [filename]', 'Process api config from config file [filename]')
  .parse(process.argv);

if(!commands.config){
	console.log('nansen requires a config to process APIs, see --help.');

}
else{

	config = require('./' + commands.config);

	var tasks = [];

	processAPIs(config);
}


log.info("nansen has started.");

function processAPIs(config) {


var APIs = config;
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

	  if(API.sub_process) { 
	  	//console.log("entering sub_process");
	  	//console.log(APIs);

	  	APIs = API.sub_process.concat(APIs);
	  	//console.log(APIs);
	  	//processAPIs(API.sub_process);
	  }

	  request(API.options, function(err, res, body) { 
	  	
	  	if(!err)	{

	  		//for testing
	  		console.log(API.options.url);
	  		console.log("success");
	  		//console.log(body);
	  		//
	  	
	  		body = JSON.parse(body);
	    	
	    	if( APIs.length ) {

	    		if(API.save_params_to_global) {
	    			saveToGlobal(API.save_params_to_global, body);
	    		}

	      		callAPIs (APIs, body);
	    	}
		}
	  });
	}

	callAPIs(APIs);
}

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

    //console.log("saved params to global " + getValue(options[key], data));
}

function setFromGlobal(options, data) {



	for (var key in options) {

        setValue(options[key], data, global_params[key]);
    }

    //console.log(global_params);
}

function setRestParamsFromPrevious(restParams, options, data) {

      for (var key in restParams) {

        options.url =  options.url.replace(key,  getValue(restParams[key], data));
    }
    //    console.log(options.url);
}

function setRestParamsFromGlobal(restParams, options) {

      for (var key in restParams) {

        options.url =  options.url.replace(key, global_params[restParams[key]]);
    }
        //console.log(global_params);
}