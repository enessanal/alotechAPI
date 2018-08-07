import logging, json, requests, os, datetime, hashlib,base64
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), './static')
app = Flask(__name__, template_folder=ASSETS_DIR, static_folder=ASSETS_DIR)


@app.route('/api/listRecords',methods=['GET'])
def listRecords():

	startDate =  request.args.get("startDate")
	endDate = request.args.get("endDate")

	url="http://staging1.alo-tech.com/api/?function=reportsCDRLogs&startdate="+startDate+"%2000:00:00&finishdate="+endDate+"%2023:59:59&app_token=ag9zfnRlbGVmb25pLXRlc3RyHwsSElRlbmFudEFwcGxpY2F0aW9ucxiAgICw46OcCQyiARVzdGFnaW5nMS5hbG8tdGVjaC5jb20"
	r = requests.get(url)
	
	plain=request.remote_addr+"\t"+request.headers.get('User-Agent')+"\t"+str(datetime.datetime.now())+"\t"+startDate+"\t"+endDate+"\t"+str(len(json.loads(r.text)['CallList']))
	hash=hashlib.sha224(base64.encodestring(plain.encode())).hexdigest()
		
	f = open("queries.log", "a")
	f.write(plain+"\t"+hash+"\n")
	f.close() 

	return jsonify(json.loads(r.text))
	
@app.route('/')
def main():	
	return app.send_static_file("index.html")
if __name__ == "__main__":
	app.run(host='0.0.0.0' , port=8000,debug=False) 
