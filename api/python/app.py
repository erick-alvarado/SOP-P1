import os
import json
from flask import Flask, jsonify, request
from google.cloud import pubsub_v1
from datetime import datetime

import mysql.connector
from pymongo import MongoClient


""" import settings """


app = Flask(__name__)

#$env:GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
# Connection Database
mydb = mysql.connector.connect(
  host= os.environ.get("MYSQL_HOST"),
  user=os.environ.get("MYSQL_USER"),
  password=os.environ.get("MYSQL_PASSWORD"),
  database=os.environ.get("MYSQL_NAME")
)

user = os.environ.get("MONGO_USER")
password = os.environ.get("MONGO_PASSWORD")
host = os.environ.get("MONGO_HOST")
port = os.environ.get("MONGO_PORT")
database = os.environ.get("MONGO_NAME")

CONNECTION_STRING = "mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database + "?ssl=true&replicaSet=globaldb&retrywrites=false"

client = MongoClient(CONNECTION_STRING)
mydb_mongo = client['olympics-game-news']
mydb2 = mydb_mongo['publicaciones']



# Start load
@app.route('/python/iniciarCarga')
def iniciarCarga():
    global mycursor, timeSQL,timeMONGO, counterSQL , counterMONGO
    counterSQL = 0
    counterMONGO = 0
    timeSQL= 0
    timeMONGO= 0 

    mycursor = mydb.cursor()
    return jsonify({'response': 'Python db connected!'})





# Publish 
@app.route('/python/publicar', methods=['POST'])
def publicar():
    global counterSQL , counterMONGO, timeSQL,timeMONGO
    json_data = request.json
    
    #Insert MySQL
    hashtags = ""
    for h in request.json['hashtags']:
        hashtags+=h+","
    sql = 'call split(%s,%s,%s,%s,%s,%s,%s);'

    try:

        a = datetime.strptime(json_data['fecha'], "%d/%m/%Y")
        val = (hashtags, ",",json_data['nombre'],json_data['comentario'],a.strftime('%Y-%m-%d %H:%M:%S'),json_data['upvotes'],json_data['downvotes'])
        
        time = datetime.today()
        mycursor.execute(sql, val)   
        mydb.commit()
        timeSQL += (datetime.today()-time).total_seconds()
        
        counterSQL+=1
    except:
        print("MySQL insert:"+ json.dumps(json_data))
   
    

    #Insert Mongo
    try:
        time = datetime.today()
        mydb2.insert_one(json_data)
        timeMONGO += (datetime.today()-time).total_seconds()
        counterMONGO+=1
    except:
        print("MONGO insert:"+ json.dumps(json_data))


    
    return jsonify({'response': 'pong!'})


# End Load
@app.route('/python/finalizarCarga')
def finalizarCarga():
    global counterSQL , counterMONGO, timeSQL,timeMONGO
    # TODO(developer)
    
    project_id = "sopess1"
    topic_id = "olimpiada"
    
    cosmo_json = json.dumps({
            "guardados":counterSQL,
            "api": "Python",
            "tiempoDeCarga":timeSQL,
            "bd": "CosmoDB"
        })
    sql_json = json.dumps({
            "guardados": counterMONGO,
            "api": "Python",
            "tiempoDeCarga":timeMONGO,
            "bd": "MySQL"
        })
    try:
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(project_id, topic_id)
    except Exception as e:
        print("ERR: Failed connecting to pubsub. "+str(e))
        

    sql_json = sql_json.encode('utf-8')
    cosmo_json = cosmo_json.encode('utf-8')

    try:
        future = publisher.publish(topic_path, cosmo_json)
        future = publisher.publish(topic_path, sql_json)
    except:
        print("ERR: Sending data to pubsub")
        

    return jsonify({'response': 'pong!'})
    

if __name__ == '__main__':

    app.run(port = 5000,debug=True)