from __future__ import division

import base64
import sys
import os
import urllib
import urllib2
from math import ceil
from json import loads as decodeJson

FILE_SIZE_LIMIT = 75000 #75 kb

# usage: 
#       injection: python injection.py inject -k <keyname> -d <directory_of_payload>
#       download:  python injection.py download -k <keyname> -d <directory_to_store_download>
def main():
	if len(sys.argv) != 6:
		print "invalid number of arguments"
		return

	path = ""
	keyname = ""
	command = sys.argv[1]

	if sys.argv[2] == "-k":
		keyname = sys.argv[3]
		path = sys.argv[5]
	elif sys.argv[2] == "-d":
		path = sys.argv[3]
		keyname = sys.argv[5]
	else:
		print "invalid arguments"
		return

	if command == "inject":
		inject(keyname, path)
	elif command == "download":
		download(keyname, path)
	else:
		print "invalid command"
		return


class inject:
	def __init__(self, keyname, path):
		if not os.path.exists(os.path.dirname(path)):
			print "invalid directory"
		else:
			self.inject(keyname, path)

	def inject(self, keyname, path):
		print "Injecting..."
		for fileName in os.listdir(path):
			fullpath = os.path.join(path, fileName)
			if os.path.isfile(fullpath) and fileName[0] != ".":
				payload = {"username": keyname,
		                   "score": 1024,
		                   "grid": "doesnt matter",
		                   "filename": fileName,
		      			   "entryNum": 1,
		      			   "totalEntries": 1}

				file = open(fullpath)
				fileData = base64.b64encode(file.read())
				fileDataSize = sys.getsizeof(fileData)

				if fileDataSize > FILE_SIZE_LIMIT: 
					payload['totalEntries'] = int(ceil(fileDataSize / FILE_SIZE_LIMIT))

				for i in range(0, payload["totalEntries"]):
					payload['entryNum'] = i + 1
					payload['data'] = fileData[i*FILE_SIZE_LIMIT : (i+1) * FILE_SIZE_LIMIT]
					self.printStatus(fileName, payload["entryNum"], payload["totalEntries"])
					self.sendPayload(payload)

				file.close()
				print ""

	def printStatus(self, filename, entryNum, totalEntries):
		print "\r\t" + filename + " : " + str(entryNum) + " of " + str(totalEntries),
		sys.stdout.flush()

	def sendPayload(self, payload):
		url = 'https://mod2048.herokuapp.com/submit.json'
		data = urllib.urlencode(payload)

		request = urllib2.Request(url, data)
		response = urllib2.urlopen(request)
		return response.read() == "200"

class download:
	def __init__(self, keyname, path):
		if not path.endswith("/"):
			path += "/"
		if not os.path.exists(os.path.dirname(path)):
			print path + " does not exist, creating...."
			os.makedirs(path)

		jsondata = self.download(keyname)
		files = self.parse(jsondata)
		self.write(files, path)

	def download(self, keyname):
		print "Downloading..."
		response = urllib2.urlopen("https://mod2048.herokuapp.com/scores.json?username=" + keyname)
		data = decodeJson(response.read())
		return data

	def parse(self, jsondata):
		files = {}
		for entry in jsondata:
			if not set(("data", "totalEntries", "entryNum", "filename")) <= set(entry):
				continue

			if not entry["filename"] in files:
				files[entry["filename"]] = [""] * int(entry["totalEntries"])


			files[entry["filename"]][int(entry["entryNum"]) - 1] = entry["data"]
		return files

	def write(self, files, path):		
		for fileName in files:
			fullData = ""
			for datapart in files[fileName]:
				fullData += datapart

			f = open(os.path.join(path, fileName), "wb")
			f.write(fullData.decode('base64'))
			f.close()


if __name__ == "__main__":
	main()
