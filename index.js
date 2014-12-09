var nansen = require('./lib/nansen');


var config = {

	name: 'TestConfig',
	setup: {

		request: {
			method: 'GET',
			uri: 'http://demo0841709.mockable.io/setup'
		}

	},

	get: {

		request: {
			method: 'GET',
			uri: 'http://demo0841709.mockable.io/get'
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