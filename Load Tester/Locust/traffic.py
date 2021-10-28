import json
from random import randint
from locust import HttpUser, task, between

#locust --locustfile traffic.py
#http://localhost:8089/


class MessageTraffic(HttpUser):
    def on_start(self):
        try:
            with open("data.json", 'r') as data_file:
                self.data = json.loads(data_file.read())

            print (f'>> Reader: Datos cargados correctamente, {len(self.data)} ')
        except Exception as e:
            # Imprimimos que no pudimos procesar la carga de datos
            print (f'>> Reader: No se cargaron los datos {e}')
    @task
    def PostMessage(self):
        wait_time = between(0.1, 0.9)
        if len(self.data) != 0 :
            value = randint(0, 3)
            
            if(value ==0):
                res = self.client.post("/publicar", json=self.data[0])
            elif value ==1:
                res = self.client.post("/go/publicar", json=self.data[0])
            elif value ==2:
                res = self.client.post("/python/publicar", json=self.data[0])
            else:
                res = self.client.post("/function/python/publicar", json=self.data[0])

            print(res)
            self.data.pop(0)
        else:
            print(">> MessageTraffic: Envio de tráfico finalizado, no hay más datos que enviar.")
            self.stop(True)
