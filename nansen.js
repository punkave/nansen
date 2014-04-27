var commands = require('commander');
var request = require('request');


var orders;

commands
  .version('0.0.0')
  .option('-o, --orders [filename]', 'Process api orders from config file [filename]')
  .parse(process.argv);

if(!commands.orders){
	console.log('Nansen requires orders to process APIs, see --help.');

}
else{

	orders = require('./' + commands.orders);
}


processOrders(orders);



function processOrders(orders){


	//just for testing now, but will need to make some requests in order 
	for(var i=0; i < orders.length; i++){
		
		request(orders[i].options, callback);

		//console.log(orders[i].options);
	}


}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
    }
}



 
