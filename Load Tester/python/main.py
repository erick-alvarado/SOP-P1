import json
import requests

print("Leer archivos")
leer = json.loads(open('data.json').read())
respuesta_iniciar_rust = requests.get("http://34.120.185.238:80/endpoint/rust/iniciarCarga")
respuesta_iniciar_go = requests.get("http://34.120.185.238:80/endpoint/go/iniciarCarga")
respuesta_iniciar_python = requests.get("http://34.120.185.238:80/python/iniciarCarga")

for publicacion in leer:
    respuesta_publicar_rust = requests.post("http://34.120.185.238:80/endpoint/rust/publicar", json=publicacion)
    respuesta_publicar_go = requests.post("http://34.120.185.238:80/endpoint/go/publicar", json=publicacion)
    respuesta_publicar_python = requests.post("http://34.120.185.238:80/python/publicar", json=publicacion)

respuesta_finalizar_rust = requests.get("http://34.120.185.238:80/endpoint/rust/finalizarCarga")
respuesta_finalizar_go = requests.get("http://34.120.185.238:80/endpoint/go/finalizarCarga")
respuesta_finalizar_python = requests.get("http://34.120.185.238:80/python/finalizarCarga")