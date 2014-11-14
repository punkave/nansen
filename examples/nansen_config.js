// Configuration File for 'Moves Connector'
modules.export = function(options) {
    var self = this;

    // Global properties
    self.name: 'MovesConnector';
    self.clientAuthKey = 'ai39adfaasdf8u';
    self.studySlug = 'pedometer';

    // 1.  Setup request configuration
    self.setup = {
    
        // The 'request' object follows the schema of node-request options.
        request: {
            method: 'get',
            url: 'https://my.waytohealth.upenn.edu/' + self.studySlug,
            headers: {
                'Client-Auth-Key': self.clientAuthKey;
            },
        },
        
        // Validate the response.
        // An error can be asserted here, but no modification
        // to the response is permitted.
        validate: function(res, callback) {
            // Do we have the right data?
            callback(null);
        },

        // Complete is our opportunity to translate the 
        // response to our needs.  Locate, format, and return the
        // array of items.
        complete: function(res, callback) {
            // JSONify our response and 
            // pass the array of items to 'Get'
            callback(null, JSON.parse(res.items));
        },
    };

    // 2.  Get request configuration
    self.get = {

        // Request can also be a function that is
        // provided with *item* and returns the
        // *request* object in the callback.  
        // This allows us to pass unique data for
        // each item request. 
        request: function(item, callback) {

            callback(null, {
                method: 'get',
                url: 'https://api.moves-app.com/api/v1/user/summary/daily',
                params: {
                    from: item.lastdatum
                    to: moment('Y-m-d')
                },
                headers: {
                    'Authorization': 'Bearer ' + item.apidata.access_token
                }
            });
        },

        // Handling for errors returned in the response header
        errors: {
            HTTP_429: function(res, callback) {
                // too many requests, sleep.
            }
        },

        complete: function(res, callback) {
            // Format the response data for POST
            callback(null, JSON.parse(res.data));
        }
    };

    // 3.  Post request configuration
    post = {
    
        // For this request, we want to POST the entire
        // response from our previous GET.  We can 
        // access this response, and the original item
        // by using the three agrument deleration.
        request: function(item, response, callback) {
            callback(null, {
                method: 'post',
                url: 'https://my.waytohealth.upenn.edu/' + self.studySlug,
                params: {
                    study_user_id: item.study_user_id,
                    source_id: item.source_id,
                    connector_group: self.name,
                    as_of: moment('YYYY-mm-dd'),
                    info: res
                },
                headers: {
                    'Authorization': 'Bearer ' + item.apidata.access_token
                }
            });
        },


    };

}