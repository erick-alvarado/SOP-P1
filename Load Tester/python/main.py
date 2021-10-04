import json
import requests

print("Leer archivos")
leer = json.loads(open('data.json').read())
for publicacion in leer:
    respuesta_publicar_rust = requests.post('http://34.120.185.238/rust/publicar', json=publicacion)
    print(respuesta_publicar_rust.ok)