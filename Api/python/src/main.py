from itertools import count
import mysql.connector
import json
from flask import Flask, jsonify, request
from google.cloud import pubsub_v1
from datetime import datetime

#$env:GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"

app = Flask(__name__)

# Connection Database
mydb = mysql.connector.connect(
  host="35.231.149.154",
  user="root",
  password="g%dEh7uWVS9j0p*",
  database="olympics_game_news"
)


# Start load
@app.route('/python/iniciarCarga')
def iniciarCarga():
    global mycursor
    global time
    global counter 
    counter = 0
    mycursor = mydb.cursor()
    time = datetime.today()
    return jsonify({'response': 'Python db connected!'})

# Publish 
@app.route('/python/publicar', methods=['POST'])
def publicar():
    global counter
    json_data = request.json
    hashtags = ""
    for h in request.json['hashtags']:
        hashtags+=h+","
    date = datetime.today()
    sql = 'call split(%s,%s,%s,%s,%s,%s,%s);'
    val = (hashtags, ",",json_data['nombre'],json_data['comentario'],date,json_data['upvotes'],json_data['downvotes'])
    
    #sql = "INSERT INTO customers (name, address) VALUES (%s, %s)"
    #val = ("John", "Highway 21")
    mycursor.execute(sql, val)   
    mydb.commit()
    counter+=1
    return jsonify({'response': 'pong!'})

# End Load
@app.route('/python/finalizarCarga')
def finalizarCarga():
    global counter
    #Time loading
    loadtime = (datetime.today()-time).total_seconds()
    # TODO(developer)
    project_id = "sopess1"
    topic_id = "olimpiada"

    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(project_id, topic_id)

    cosmo_json = json.dumps({
        "guardados":counter,
        "api": "Python",
        "tiempoDeCarga":loadtime,
        "bd": "CosmoDB"
    })
    sql_json = json.dumps({
        "guardados": counter,
        "api": "Python",
        "tiempoDeCarga":loadtime,
        "bd": "MySQL"
    })
    sql_json = sql_json.encode('utf-8')
    cosmo_json = cosmo_json.encode('utf-8')

    future = publisher.publish(topic_path, cosmo_json)
    future = publisher.publish(topic_path, sql_json)
    return jsonify({'response': 'pong!'})
    

if __name__ == '__main__':

    app.run(debug=True)