import json
import requests

print("Leer archivos")
leer = json.loads(open('data.json').read())
respuesta_iniciar_rust = requests.get("")
respuesta_iniciar_go = requests.get("")
respuesta_iniciar_python = requests.get("")

for publicacion in leer:
    respuesta_publicar_rust = requests.post("", json=publicacion)
    respuesta_publicar_go = requests.post("", json=publicacion)
    respuesta_publicar_python = requests.post("", json=publicacion)

respuesta_finalizar_rust = requests.get("")
respuesta_finalizar_go = requests.get("")
respuesta_finalizar_python = requests.get("")