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
}


processAPIs(config);



function processAPIs(config){


	//just for testing now, but will need to make some requests in order 
	for(var i=0; i < config.length; i++){
		
		request(config[i].options, callback);

		//console.log(config[i].options);
	}


}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
    }
}



 
