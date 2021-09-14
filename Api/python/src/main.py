from os import system
import mysql.connector
from flask import Flask, jsonify, request

app = Flask(__name__)

# Connection Database
mydb = mysql.connector.connect(
  host="35.231.149.154",
  user="root",
  password="g%dEh7uWVS9j0p*",
  database="olympics_game_news"
)
mycursor = mydb.cursor()

# Start load
@app.route('/python/iniciarCarga')
def iniciarCarga():
    mycursor = mydb.cursor()
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
    print(mycursor.rowcount, "record inserted.")
    return jsonify({'response': 'pong!'})
    

if __name__ == '__main__':

    app.run(debug=True, port=4000)