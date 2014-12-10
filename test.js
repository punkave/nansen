var nansen = require('./lib/nansen');


var config = {

	name: 'TestConfig',
	setup: {

		request: function(data, callback) {
			var path = 'setup';

			callback(null, {
				method: 'GET',
				uri: 'http://demo0841709.mockable.io/' + path
			});
			
		},
		complete: function(response, callback) {

			response = JSON.parse(response);

			var items = [];

			response.paths.forEach(function(p, i){
				items.push({ "path": p.path });
			});

			callback(null, {"items": items});
		}

	},

	get: {

		request: function(data, callback ){

			callback(null, {
				method: 'GET',
				uri: 'http://demo0841709.mockable.io/' + data.path
			});
		}
	},

	post: {

		request: {
			method: 'POST',
			uri: 'http://demo0841709.mockable.io/post'
		}
	}
}


nansen.job(config);

nansen.run();