import mysql.connector
import json
from flask import Flask, jsonify, request
from google.cloud import pubsub_v1
from datetime import datetime

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

    mycursor = mydb.cursor()
    time = datetime.today()
    return jsonify({'response': 'Python db connected!'})

# Publish 
@app.route('/python/publicar', methods=['POST'])
def publicar():
    print(request.json)

    #sql = "INSERT INTO customers (name, address) VALUES (%s, %s)"
    #val = ("John", "Highway 21")
    #mycursor.execute(sql, val)

    #mydb.commit()
    return jsonify({'response': 'pong!'})

# End Load
@app.route('/python/finalizarCarga')
def finalizarCarga():
    #Time loading
    loadtime = (datetime.today()-time).total_seconds()
    # TODO(developer)
    project_id = "sopess1"
    topic_id = "olimpiada"

    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(project_id, topic_id)

    cosmo_json = json.dumps({
        "guardados": mycursor.rowcount,
        "api": "Python",
        "tiempoDeCarga":loadtime,
        "bd": "CosmoDB"
    })
    sql_json = json.dumps({
        "guardados": mycursor.rowcount,
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

    app.run(debug=True, port=4000)