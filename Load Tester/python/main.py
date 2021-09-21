import json
import requests

print("Leer archivos")
leer = json.loads(open('data.json').read())

for publicacion in leer:
    respuesta = requests.post("localhost:8000/endpoint/rust/publicar", json=publicacion)
    como_json = respuesta.json()
    print("respuesta: ")
    print(como_json)
    