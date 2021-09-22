import os
import json
from flask import Flask, jsonify, request
from google.cloud import pubsub_v1
from datetime import datetime

import mysql.connector
from pymongo import MongoClient


#import settings


app = Flask(__name__)


# Connection Database
mydb = mysql.connector.connect(
  host= os.environ.get("MYSQL_HOST"),
  user=os.environ.get("MYSQL_USER"),
  password=os.environ.get("MYSQL_PASSWORD"),
  database=os.environ.get("MYSQL_NAME")
)

user = os.Getenv("MONGO_USER")
password = os.Getenv("MONGO_PASSWORD")
host = os.Getenv("MONGO_HOST")
port = os.Getenv("MONGO_PORT")
database = os.Getenv("MONGO_NAME")

CONNECTION_STRING = "mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database + "?ssl=true&replicaSet=globaldb&retrywrites=false"

client = MongoClient(CONNECTION_STRING)
mydb_mongo = client['olympics-game-news']
mydb2 = mydb_mongo['publicaciones']



# Start load
@app.route('/python/iniciarCarga')
def iniciarCarga():
    global mycursor, time, counterSQL , counterMONGO
    counterSQL = 0
    counterMONGO = 0
    mycursor = mydb.cursor()
    time = datetime.today()
    return jsonify({'response': 'Python db connected!'})





# Publish 
@app.route('/python/publicar', methods=['POST'])
def publicar():
    global counterSQL , counterMONGO
    json_data = request.json
    
    #Insert MySQL
    hashtags = ""
    for h in request.json['hashtags']:
        hashtags+=h+","
    sql = 'call split(%s,%s,%s,%s,%s,%s,%s);'

    try:
        a = datetime.strptime(json_data['fecha'], "%d/%m/%Y")
        val = (hashtags, ",",json_data['nombre'],json_data['comentario'],a.strftime('%Y-%m-%d %H:%M:%S'),json_data['upvotes'],json_data['downvotes'])
        mycursor.execute(sql, val)   
        mydb.commit()
        counterSQL+=1
    except:
        print("MySQL insert:"+ json.dumps(json_data))
   
    

    #Insert Mongo
    try:
        mydb2.insert_one(json_data)
        counterMONGO+=1
    except:
        print("MONGO insert:"+ json.dumps(json_data))


    
    return jsonify({'response': 'pong!'})


# End Load
@app.route('/python/finalizarCarga')
def finalizarCarga():
    global counterSQL , counterMONGO
    #Time loading
    loadtime = (datetime.today()-time).total_seconds()
    # TODO(developer)
    
    project_id = "sopess1"
    topic_id = "olimpiada"
    
    cosmo_json = json.dumps({
            "guardados":counterSQL,
            "api": "Python",
            "tiempoDeCarga":loadtime,
            "bd": "CosmoDB"
        })
    sql_json = json.dumps({
            "guardados": counterMONGO,
            "api": "Python",
            "tiempoDeCarga":loadtime,
            "bd": "MySQL"
        })
    try:
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(project_id, topic_id)
    except:
        print("ERR: Failed connecting to pubsub")
        

    sql_json = sql_json.encode('utf-8')
    cosmo_json = cosmo_json.encode('utf-8')

    try:
        future = publisher.publish(topic_path, cosmo_json)
        future = publisher.publish(topic_path, sql_json)
    except:
        print("ERR: Sending data to pubsub")
        

    return jsonify({'response': 'pong!'})
    

if __name__ == '__main__':

    app.run(debug=True)