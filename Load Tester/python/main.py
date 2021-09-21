import json
import requests

print("Leer archivos")
leer = json.loads(open('data.json').read())

for publicacion in leer:
    respuesta = requests.post("http://localhost:8000/endpoint/rust/publicar", json=publicacion)
    