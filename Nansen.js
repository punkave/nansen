module.exports = nansen;

function nansen(config) {
    return new Nansen(config);
}

var Nansen = function(script) {
    var self = this;

    self.run = function() {
        var items = script.setup();
        cache.save(items);

        _.each(items,function(item) {
            var data = script.doOutbound(item);
            if (script.validateResponse(response)) {
                var payload = script.createPostbackPayload(response);
                self.doPostback(script.postback_setup, payload);
            }
        });

    }
};


