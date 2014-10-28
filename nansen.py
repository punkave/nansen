#Nansen API consumption module
import json
import requests
import sys


#check if a config file param is present
if len(sys.argv) < 2:
	print "Nansen requires a config file to run"
	sys.exit(0)

configFile = open(sys.argv[1])
config = json.load(configFile)

#format a rest url given a formatted sting and params
def formatRestUrl(base, params):
	return base.format(*params)

#populates a new dict where dict1's values are set to dict2's using dict1's values as keys
def populateValues(dict1, dict2):
	newDict = {}
	for key, value in dict1.iteritems():
		if dict2[value] is not None:
			newDict[key] = dict2[value]
	return newDict

#consume API's according to the Nansen module
def consumeAPIs(config):
	#1. make the inital request to get items to be processed 
	try:
		data = requests.get(config['inital_req']['url'], headers=config['inital_req']['headers'])
		#on success read json
		data = data.json()
		#the load the entry point defined in the as items
		items = data[config['inital_req']['entry_point']]
		print "Success loading items from entry point"
	except Exception, e:
		print "Error from inital request with url: " + config['inital_req']['url']
		print e

	for item in items:
		if 'error' not in item: 
			#load config for get request
			getConfig = config['get_config']
			#get rest param
			urlRestParams = [item[x] for x in getConfig['url_rest_params']]
			#get query params
			urlQueryParams = populateValues(getConfig['url_query_params'], item) 
			#format request url
			getUrl = formatRestUrl(getConfig['url_base'], urlRestParams)
			#assume get and post sucess false by default
			getSuccess = False
			postSuccess = False
			
			try:
				#make get request
				get = requests.get(getUrl, params=urlQueryParams, auth=(getConfig['auth']['username'], getConfig['auth']['password']))
			except Exception, e:
				print "Error from get request with url: " + getUrl
				print e
			
			try:
				json.loads(get.content)
				getSuccess = True
  			except ValueError, e:
  				print "Responce from get request with url: " + getUrl + " is not valid json:"
  				print e
				
			if getSuccess:
				#load the post config
				postConfig = config['post_config']
				#add the item's data to the post payload
				payload = item
				#add the binary content of the get request as info 
				payload['info'] = get.content
				try:
					#make the post request
					post = requests.post(postConfig['url_base'], data=payload, headers=postConfig['headers'])
					if post.status_code == 200:
						postSuccess = True
				except Exception, e:
					print "Error from post request with url: " + postConfig['url_base']
					print e

				if postSuccess:
					print "Sucessfull get/post cycle completed for " + config['item_name'] + ": " + item[config['item_id']] 

#run consume APIs
consumeAPIs(config);