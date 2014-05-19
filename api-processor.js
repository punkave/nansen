var commands = require('commander');
var request = require('request');

var config;

commands
  .version('0.0.0')
  .option('-o, --config [filename]', 'Process api config from config file [filename]')
  .parse(process.argv);

if(!commands.config){
	console.log('Nansen requires config to process APIs, see --help.');

}
else{

	config = require('./' + commands.config);

	var tasks = [];

	processAPIs(config);
}


var global = [];


function processAPIs(config){


var APIs = config;
var APIs = APIs.map(function (api) {
  return api;
});

function callAPIs (APIs, data) {
  var API = APIs.shift();

  	if(API.get_data){
  		getValue(API.get_data.get, data);
  		setValue(API.get_data.set, API.options, getValue(API.get_data.get, data));
  	}

  	if(API.set_from_global) {
  		setFromGlobal(API.set_from_global, API.options);
  	}

  request(API.options, function(err, res, body) { 
  	console.log(body);

  	body = JSON.parse(body);
    if( APIs.length ) {

    	if(API.set_to_global) {
    		setToGlobal(API.set_to_global, body);
    	}

      callAPIs (APIs, body);
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

function setToGlobal(options, data) {



	for (var key in options) {

        global[key] =  getValue(options[key], data);
    }

    //console.log(options);
}

function setFromGlobal(options, data) {



	for (var key in options) {

        setValue(options[key], data, global[key]);
    }

    //console.log(global);
}

