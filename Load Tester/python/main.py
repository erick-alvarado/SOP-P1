import json
import requests
import random

print("Leer archivos")
leer = json.loads(open('SO1_2S2021.json').read())
for publicacion in leer:
    conteo = random.randint(1, 4)
    print(conteo)
    if conteo == 1:
        respuesta_publicar1 = requests.post('http://34.120.185.238:80/publicar', json=publicacion)
        print(respuesta_publicar1.ok)
    if conteo == 2:
        respuesta_publicar2 = requests.post('http://34.120.185.238:80/go/publicar', json=publicacion)
        print(respuesta_publicar2.ok)
    if conteo == 3:
        respuesta_publicar3 = requests.post('http://34.120.185.238:80/python/publicar', json=publicacion)
        print(respuesta_publicar3.ok)
    if conteo == 4:
        respuesta_publicar4 = requests.post('http://34.120.185.238:80/function/python/publicar', json=publicacion)
        print(respuesta_publicar4.ok)
    

respuesta_finalizar = requests.get('http://34.136.183.70:7000/finalizarCarga')
print(respuesta_finalizar.ok)