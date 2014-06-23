nansen
======

node.js module for processing one or many APIs sequentially

### How to use:

call:

`nansen.processAPIs({options}, callback(err, report) {} );`

The options param is an array of objects called "options":
```javascript
[
{ "options":{
    "url": "http://apiURL/:id",
    "method": "post",
    "headers": {
        "User-Agent": "api-processor"
    	}, 
    "form":{
        "username": "nansen",
        "password": "test"
        }
	},
    "save_params_to_global": { 
        "session_key": "data.session_key" 
    }
    "set_rest_params_from_previous": {
        ":id" : "data.users.0.id"
    }
},
{ "options":{
    "url": "http://apiURL/",
    "method": "get",
    "headers": {
        "User-Agent": "api-processor"
        }
    },
    "set_params_from_global": {
         "session_key": "headers.session_key"
    }
}
```

the options object is the same as the request.js options object

see https://github.com/mikeal/request


The folling objects are optional and preform the following when picked up by the API processor:

save_params_to_global: saves a data from an API responce for use later

set_params_from_global: sets a request param from a value saved to global

set_rest_params_from_global: sets a rest request param from a value saved to global

set_params_from_previous: sets a request param from a value in the previous request

set_rest_params_from_previous: sets a rest request param from a value in the previous request

subprocess: process data as another list of APIs (this will also be attemped if a responce contains "subprocess")


The callback will return all of the responce data as an array if successful, otherwise it will return an error string.
