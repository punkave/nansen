module.exports = script;

function script(config) {
    return new Script(config);
}

var Script = function(config) {
    var self = this;

    self.initial_req = {
        url: "http://" + config.hostname + "/" + config.studysite_slug + "/api/v1/Data/ConnectorInfo",
        headers: {
            "User-Agent": "nansen",
            client_auth_key: config.wth_auth_key
        },
        getItemsArray: function(response) {
            return response.message;
        }
    };

    self.get_config = {
    	auth: config.vitality_auth,
        url: function(item) {
            var base = "https://vli.vitality.net:7312/api/0.1/opens/";
            return base + item.cap_id + "?start=" + item.last_datum;
        }
	};

    self.post_config = {
		url: "http://waytohealth/heartstrong-backend/api/v1/Data/GlowcapsEventInfo",
		params: ["source_id", "study_user_id", "connector_group"],
		headers: {
            "User-Agent": "nansen",
            client_auth_key: config.wth_auth_key
    	}	
	};

    self.logging = {
        success_message: function(item) {
            return "Successfully completed glowcaps request/post loop for study_user_source_id="=item.source_id;
        },
    };
};


