
var config = require('./config/cmmi-localhost.js');

var script = require('./scripts/glowcaps.js')(config);

var Nansen = require('nansen')(script);


Nansen.loadSetup()
	.then(function() {
		Nansen.doGetsAndPosts();
	});
