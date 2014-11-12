module.exports = script;

function script(config) {
    return new Script(config);
}

var Script = function(config) {
    var self = this;


    self.setup = function() {
        var url = "http://" + config.hostname + "/" + config.studysite_slug + "/api/v1/Data/ConnectorInfo";
        var headers = {
            "User-Agent": "nansen",
            client_auth_key: config.wth_auth_key
        };

        var response = Nansen.fetch(url, headers);
        var data = JSON.parse(response);

        // Nansen.setItems(data.items);
        return data.items;

    }

    self.doOutbound = function(item) {
        var base = "https://vli.vitality.net:7312/api/0.1/opens/";
        var url = base + item.cap_id + "?start=" + item.last_datum;
        return Nansen.fetch(url, headers);
    };

    self.validateResponse = function(response) {
        try {
            data = JSON.parse(response);
            return true;
        } catch {
            return false;
        }
    }


    self.createPostbackPayload = function(item, response) {
        return JSON.stringify({
            source_id:       item.source_id,
            study_user_id:   item.study_user_id,
            connector_group: item.connector_group,
            foo:             response
        });
    }

   self.logging = {
        success_message: function(item) {
            return "Successfully completed glowcaps request/post loop for study_user_source_id="=item.source_id;
        },
    };
};


