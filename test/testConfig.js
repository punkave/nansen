module.exports = {

	name: 'Local Test',
	setup: {

		request: {
			method: 'GET',
			uri: 'http://localhost:3000'
		},
		complete: function(res, callback) {
			callback(null, [{uri: 'http://localhost:3000/posts/1'}, {uri: 'http://localhost:3000/posts/2'}, {uri: 'http://localhost:3000/posts/3'}]);
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
				uri: 'http://localhost:3000/posts',
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