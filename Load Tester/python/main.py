import json
import requests

print("Leer archivos")
leer = json.loads(open('data.json').read())
respuesta_finalizar_rust = requests.get('')
for publicacion in leer:
    respuesta_publicar_rust = requests.post('', json=publicacion)

respuesta_finalizar_rust = requests.get('')