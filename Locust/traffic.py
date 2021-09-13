from locust import HttpUser, task, between

class UsuarioDeApi(HttpUser):
    @task
    def test(self):
        self.client.get('/')
