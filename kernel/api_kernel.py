from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/ram', methods=['GET'])
def getRam():
    dfile = open("/proc/modram", 'r')
    datos = dfile.read()
    datos = json.loads(datos)
    print(datos)
    return datos

@app.route('/cpu', methods=['GET'])
def getCpu():
    num = 0
    response = json_util.dumps(num)
    return Response(response,mimetype="application/json")


if __name__ == "__main__":
    app.run(host = "0.0.0.0", port=7000, debug=True)