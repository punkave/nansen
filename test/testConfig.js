module.exports = {

	name: 'TestConfig',
	setup: {

		request: {
			method: 'GET',
			uri: 'http://jsonplaceholder.typicode.com'
		},
		complete: function(res, callback) {
			callback(null, [{uri: 'http://jsonplaceholder.typicode.com/posts/1'}, {uri: 'http://jsonplaceholder.typicode.com/posts/2'}, {uri: 'http://jsonplaceholder.typicode.com/posts/3'}]);
		}
	},

	get: {
		request: function(item, callback ) {
			callback(null, {
				method: 'GET',
				uri: item.uri
			});
		},
	},

	post: {

		request: function(item, response, callback) {

			callback(null, {
				method: 'POST',
				uri: 'http://jsonplaceholder.typicode.com/posts',
				data: {
                  title: 'foo',
                  body: 'bar',
                  userId: 1
                }
			});

		},
		validate: function(res, callback) {
			res = JSON.parse(res);
			if (res.id) {
				callback(null);
			} else {
				callback("POST Validation Failed");
			}
		}
	}
}