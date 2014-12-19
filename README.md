# Nansen

Nansen is a node.js module for processing APIs.

- [Configuration](#config)
- [Request Model](#request)
- [Options](#options)
- [Example](#example)


## <a name="config"></a>Configuration File
The configuration for each application is a javascript file that exports a function with required properties `setup`, `get`, and `post`.  Nansen is run from the command line, and initiating a new api task is as simple as passing the configration into nansen.

```bash
npm install -g nansen

nansen ./cmmi-glowcaps.js
```

## <a name="request"></a>Request Model
The three required objects represent the order of request operations for the api consumption.

#### `1. Setup`
An intial request to obtain a collection items for the subsequent GET and POST requests.
#### `2. Get`
A GET request made for each item obtained during `setup`.  Each request is made with partially unique parameters available in the item object. 
#### `3. Post`
A POST request made for each successful `Get`.  Each POST can also be made with unique parameters avialble in the item.


## Request Configuration
Each of the requests above can be configured with these options.  The following options are executed sequentially for each request.


#### `request`
- `{}`
- `function(item, callback)`
- `function(item, response, callback)`


The configuration of the HTTP request follows the node-request module schema which can be found [here](https://github.com/request/request#requestoptions-callback).  You can simply pass an object of options. Or, for `Get`, and `Post` requests, provide a function and access the `item` or the  `response` from the previous request.  

#### `validate`
- `['json']`
- `function(response, callback)`

If a request is successful, we can validate the response here. Errors can be asserted, by passing them in the callback, but modification to the response is not allowed.  For basic format validation, nansen provides built in functions for `json` and `xml`, which can be passed as string in an array.

#### `complete`
- `function(response, callback)`

Complete is the last step for each `request`.  Here, we can translate and format the data we need from the response.  For the `setup` and `get` steps, we should pass something different in the callback.  


* Setup
>The array of items to be looped over.  The subsequent `get` will run for each item in the array, and each individual item is passed to the the request function in `get`.
  
* Get
>The data from response which we want to POST.
        
By default, the entire response is passed.


## <a name="options"></a>Options
Available in the configuration file or the CLI.

#### `Parallel`
Executes the item requests in Parallel instead of Series.  For individual items, GET and POST will still execute sequentially.
- Config File: `parallel: [value]`
- CLI: `nansen -p [value] <config_file>`

#### `Verbose`
Logs all the request steps as they occur. 
- Config File: `verbose: true`
- CLI: `nansen -v <config_file>`

#### `Progress`
Show progress bar during job process.
- Config File: `progress: true`
- CLI: `nansen -P <config_file>`

#### `Debug`
Logs all the request responses and other extranious information.
- Config File: `debug: true`
- CLI: `nansen -d <config_file>`


<a name="example"></a>Example Configuration File
----
```javascript
// Configuration File for 'Moves Connector'
modules.exports = {

    // Options
    name: 'MovesConnector',
    verbose: true,           // Log the requests for each item
    debug: true,             // Log the request responses and other extra info
    parallel: 3,             // Process 3 items in parallel
    progress: true,          // Show progress bar during job process


    // 1.  Setup request configuration
    self.setup: {
    
        // The 'request' object follows the schema of node-request options.
        request: {
            method: 'get',
            url: 'https://my.waytohealth.upenn.edu/pedometer',
            headers: {
                'Client-Auth-Key': '<key>';
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
    },

    // 2.  Get request configuration
    get: {

        // Request can also be a function that is
        // provided with <item> and returns the
        // <request> object in the callback.  
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
    },

    // 3.  Post request configuration
    post:  {
    
        // For this request, we want to POST the entire
        // response from our previous GET.  We can 
        // access this response, and the original <item>
        // by using the three agrument deleration.
        request: function(item, response, callback) {

            callback(null, {
                method: 'post',
                url: 'https://my.waytohealth.upenn.edu/pedometer',
                params: {
                    study_user_id: item.study_user_id,
                    source_id: item.source_id,
                    connector_group: 'MovesConnector',
                    info: response
                },
                headers: {
                    'Authorization': 'Bearer ' + item.apidata.access_token
                }
            });
        },
    },
}
```
