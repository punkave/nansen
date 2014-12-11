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
		validate: function(res, callback) {

			res = JSON.parse(res);

			if (res && res.paths) {
				callback(null, res);
			} else {
				callback("Error: No paths in Setup response.");
			}
		},
		complete: function(res, callback) {

			res = JSON.parse(res);

			var items = [];

			res.paths.forEach(function(p, i){
				items.push({ "path": p.path });
			});

			callback(null, {"items": items});
		}

	},

	get: {

		request: function(data, callback ) {

			callback(null, {
				method: 'GET',
				uri: 'http://demo0841709.mockable.io/' + data.path
			});
		},
		validate: ['json']
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