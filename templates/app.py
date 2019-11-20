#!/user/bin/env python3
"""
This tool built to keep track CVE list provided by NVD, and display the list in a table format
the tool creates a new thread every (x) seconds to request last modified meta date
and check if there's an update since last request.
"""
__author__ = "Nourah Altawallah"
__copyright__ = "Copyright 2019"
__license__ = "GPL"
__version__ = "1.0.5"
__date__ = "2019-10-09"
__maintainer__ = "Fahad Alduraibi"
__email__ = "fahad@fadvisor.net"


import datetime
import json
import random
import time
import flashtext 
import gzip
import json
import threading
import random
from datetime import timedelta
from flask import Flask, render_template, jsonify, Response,request, redirect
import requests
from io import BytesIO
from guppy import hpy


## PROXY SETTINGS ========
# If you are behind a proxy then set it here
# proxies = {'http': 'http://myproxy:8080', 'https': 'http://myproxy:8080'}
# If the proxy requires authentication use the following:
# proxies = {'http': 'http://user:password@myproxy:8080', 'https': 'http://user:password@myproxy:8080'}
proxies = ""
##===================

## SSL VERIFICATION SETTINGS =
SSL_verify = True
##===================
def myconverter(o):
    if isinstance(o, datetime.datetime):
       return o.__str__()
def generate_random_data():
        print(MyVariables.msg)
    
        while True: 

            json_data = json.dumps(MyVariables.content,default = myconverter)
            MyVariables.msg="hello"
            now = datetime.datetime.now()
            sec_left = (now - MyVariables.last_req).seconds
            next_req = abs(MyVariables.interval - sec_left)
            print("next request")
            print(next_req)
            yield f"data:{json_data}\n\n" 
            yield f"data:{ MyVariables.msg}\n\n"
            
            time.sleep(next_req+5)
            
            
def checkMetadate(metadate, status, msg, content, metaFile):
	""""
	:param  metadate, status, msg, content current values and downloaded metaFile
	:returns updated metadate, status, msg, content

	"""
	metaFile = metaFile.decode("utf-8")
	modifiedDate = metaFile.split('\n', 1)[0].split(':', 1)[1].split(':', 1)[0]
	modifiedDate = datetime.datetime.strptime(modifiedDate, '%Y-%m-%dT%H')

	if (modifiedDate > metadate):
		metadate = modifiedDate
		status = 'fine'
		msg = ''

		try:
			# Request the latest CVE list from nvd.nist.gov
			buffer = requests.get("https://nvd.nist.gov/feeds/json/cve/1.0/nvdcve-1.0-modified.json.gz" ,proxies=proxies, verify=SSL_verify)
			
			# Decompress the downloaded file 
			json_bytes = gzip.GzipFile(fileobj=BytesIO(buffer.content)).read()
			status, msg, content = get_content(status, msg, content, json_bytes)
			print(content)

		except Exception as e:
			print("ERROR: " + str(e))
			status = 'error'
			msg = "Downloading of the CVE file has failed!"

	# No new data
	else:
		status = 'fine'
		msg = ''
		content, status, msg = refilter_content(content, status, msg)
 

	return metadate, status, msg, content


def get_content(status, msg, content, json_bytes):
	""""
	 :param  metadate, status, msg, content current values and downloaded json_bytes file which contains cve data
	 :returns updated metadate, status, msg, content
	 """

	cve_list = []
	# get UTC current time
	date = datetime.datetime.utcnow()
	json_str = json_bytes.decode('utf-8')
	data = json.loads(json_str)
	extracted_list = {}
	score = 1
	stored_list = data['CVE_Items']
	keyword_processor = flashtext.KeywordProcessor()
	keyword_processor.add_keyword('Apache', "<span style=\"background-color: #FFFF00;\">Apache</span> ")
	keyword_processor.add_keyword('root user', "<span style=\"background-color: #FFFF00;\">root user</span> ") 
	keyword_processor.add_keyword('denial of service', "<span style=\"background-color: #FFFF00;\">denial of service</span> ") 
	keyword_processor.add_keyword('overflow', "<span style=\"background-color: #FFFF00;\">overflow</span> ")
	keyword_processor.add_keyword('ghostscript', "<span style=\"background-color: #FFFF00;\">ghostscript</span> ")
	#print(keyword_processor.extract_keywords("Apache jkdksahdhwej ewhdhjwj"))
					
				 
				

	#   collect cve info where is last update date < 24 hour & score>9
	for index in range(len(stored_list)):
		if 'baseMetricV3' in stored_list[index]['impact']:
			lastMod_object = datetime.datetime.strptime(stored_list[index]['lastModifiedDate'],'%Y-%m-%dT%H:%MZ')
			publish_object = datetime.datetime.strptime(stored_list[index]['publishedDate'],	'%Y-%m-%dT%H:%MZ')
			# check score based on cvss version 3
			if (stored_list[index]['impact']['baseMetricV3']['cvssV3'][
				'baseScore'] >= score and (
					date - lastMod_object <= timedelta(hours=24) or date - publish_object <= timedelta(hours=24))):
				extracted_list = {'URL':('https://nvd.nist.gov/vuln/detail/'+stored_list[index]['cve']['CVE_data_meta']['ID']),
					'ID': stored_list[index]['cve']['CVE_data_meta']['ID'],
					'Description': keyword_processor.replace_keywords(stored_list[index]['cve']['description']['description_data'][0]['value']),
					'Score': stored_list[index]['impact']['baseMetricV3']['cvssV3']['baseScore'],
					'Last_Updated': (
						datetime.datetime.strptime(str(lastMod_object + timedelta(seconds=3600 * 3)), '%Y-%m-%d %H:%M:%S')),
				}


				#keyword_processor.add_keywords_from_dict(keyword_dic)
				#print(keyword_processor.extract_keywords(stored_list[index]['cve']['description']['description_data'][0]['value']))
 
				cve_list.append(extracted_list)
	            
	            
	            
				

	# check cve score version 2
	else:
		if 'baseMetricV2' in stored_list[index]['impact']:
			lastMod_object = datetime.datetime.strptime(stored_list[index]['lastModifiedDate'],'%Y-%m-%dT%H:%MZ')
			publish_object = datetime.datetime.strptime(stored_list[index]['publishedDate'],'%Y-%m-%dT%H:%MZ')
			if (stored_list[index]['impact']['baseMetricV2']['cvssV2']['baseScore'] >= score and (
					date - lastMod_object <= timedelta(hours=24) or date - publish_object <= timedelta(hours=24))):
				extracted_list = {'URL': ('https://nvd.nist.gov/vuln/detail/'+stored_list[index]['cve']['CVE_data_meta']['ID']),
					'ID': stored_list[index]['cve']['CVE_data_meta']['ID'],
					'Description': keyword_processor.replace_keywords(stored_list[index]['cve']['description']['description_data'][0]['value']),
					'Score': stored_list[index]['impact']['baseMetricV2']['cvssV2']['baseScore'],'Last_Updated': (
						datetime.datetime.strptime(str(lastMod_object + timedelta(seconds=3600 * 3)), '%Y-%m-%d %H:%M:%S')),
				}
 
				cve_list.append(extracted_list)

	if len(cve_list) > 0:  # sort new content
		content, status, msg = sort_content(cve_list, content, status, msg)

	else:  # no new content ->filter current content
		content, status, msg = refilter_content(content, status, msg)

	return status, msg, content


def sort_content(cve_list, content, status, msg):
	# Sort by recent updated cve ,if two IDs have the same hours then put the highest score first
	if len(cve_list) > 0:
		sort = sorted(cve_list, key=lambda x: (x['Last_Updated'], x['Score']), reverse=True)
		content = sort
		msg = ''
	elif len(cve_list) <= 0:
		msg = 'No new data since last 24 hours'

	return content, status, msg


def refilter_content(content, status, msg):
	"""
	 re-filter current content to remove any old data(24h since it last modified)
	"""
	# get local date&time
	date = datetime.datetime.now()
	list2 = []


	if len(content) > 0:
		for dic in content:
			for key in dic:
				if key == 'Last_Updated':

					if date - dic[key] < timedelta(days=1, hours=24):
						list2.append(dic)
       
    
	content, status, msg = sort_content(list2, content, status, msg)
	print("refilter content")

	return content, status, msg


def main():
	try:
		url = 'https://nvd.nist.gov/feeds/json/cve/1.0/nvdcve-1.0-modified.meta'
		buffer = requests.get(url, proxies=proxies, verify=SSL_verify)
		metaFile = buffer.content
		MyVariables.interval = 1800 # check meta data every 30 minutes (30*60seconds=1800 seconds)
		threading.Timer(MyVariables.interval, main).start()
		MyVariables.last_req = datetime.datetime.now()

		MyVariables.metadate, MyVariables.status, MyVariables.msg, MyVariables.content = checkMetadate(MyVariables.metadate, MyVariables.status, MyVariables.msg, MyVariables.content, metaFile)
        

		# All exceptions
	except requests.exceptions.RequestException as e:
		MyVariables.status = 'error'
		MyVariables.msg = str(e)

		if "getaddrinfo failed" in MyVariables.msg:

			MyVariables.msg = "Internet Connection Problem"
		elif "Error 404" in MyVariables.msg:

			MyVariables.msg = "Page Not Found"
		elif "urlopen error" in MyVariables.msg:

			MyVariables.msg = "Internet Connection Problem"
		else:
			MyVariables.msg = MyVariables.msg[1:len(MyVariables.msg) - 1]
			# check connection after 5 mins
			MyVariables.interval = 60 * 5
			threading.Timer(MyVariables.interval, main).start()
			MyVariables.last_req = datetime.datetime.now()


class MyVariables:
	"""
	this class created to initiate and keep metadate, content , status, msg,interval,last_req current values

	"""
	metadate = datetime.datetime.strptime('2019-07-04T01', '%Y-%m-%dT%H')
	content = ''
	status = 'error'
	msg = ''
	interval = 60 * 5
	last_req = datetime.datetime.now()


main()
h = hpy()
print (h.heap())

# app section
app = Flask(__name__)


# return view.html to each client first request
@app.route('/')
def view_page():
 return render_template('view.html')
	
	
	
@app.route('/handle_data', methods=['GET'])
def handle_data():
   #projectpath = request.form.getlist('score')
   #print(projectpath)
   def generate():
      #with app.app_context():
        while True:         # jon_data = json.dumps( {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'value': random.random() * 100})
 
            json_data = json.dumps(MyVariables.content,default = myconverter)
            print("send from handel")
         # json.dumps(MyVariables.content,default = myconverter)
            yield f"data:{json_data}\n\n"
            time.sleep(4)
 
   return Response(generate(), mimetype='text/event-stream')
    
    
@app.route('/_sort/', methods=['GET'])
def _sort():
   return jsonify({'data': 'from sort request', 'msgerror': s, 'next_req': next_req})
"""
# every time client request updated data
@app.route('/_get_data/', methods=['GET'])
def _get_data():
 
	waiting time before next request calculation:
	1- Find how many seconds since last meta date request
	2- Find how many seconds left before next meta date request
	3- Add random number of seconds to avoid server overload


   
	now = datetime.datetime.now()
	sec_left = (now - MyVariables.last_req).seconds
	next_req = abs(MyVariables.interval - sec_left)
	next_req = next_req + (random.randrange(20, 70, 1))
	print("client request data")

	# convert seconds to milliseconds
	next_req = next_req * 1000
	print("next request",next_req)
    #print(next_req)

	# status is fine (no msg ), available content is either new or filtered
	if MyVariables.status == 'fine' and len(MyVariables.content) > 0:
		return jsonify({'data': render_template('dynamic_data.html', cve_list=MyVariables.content),'msgerror': str(MyVariables.msg), 'next_req': next_req})

	# status error (error msg ) , old content is filtered
	if MyVariables.status == 'error' and len(MyVariables.content) > 0:
		s = str(MyVariables.msg)
		return jsonify(
			{'data': render_template('dynamic_data.html', cve_list=MyVariables.content), 'msgerror': s, 'next_req': next_req})

	# status  either fine of error , no content
	if ((MyVariables.status == 'fine' and len(MyVariables.content) <= 0) or (MyVariables.status == 'error' and len(MyVariables.content) <= 0)):
		# no new data last24
		s = str(MyVariables.msg)
		return jsonify({'data': '', 'msgerror': s, 'next_req': next_req})
	# any unexpected scenario
	else:
		s = str(MyVariables.msg)

		return jsonify({'data': '', 'msgerror': s, 'next_req': next_req})"""
@app.route('/data', methods=['GET'])
def data():

    return Response(generate_random_data(), mimetype='text/event-stream')



if __name__ == '__main__':
	app.run(threaded = True)
