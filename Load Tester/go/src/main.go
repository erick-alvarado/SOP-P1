package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"tester/src/models"
)

type lista []models.Publicacion

func main() {
	data, err := readJson()
	if err != nil {
		fmt.Println()
	} else {
		clienteHttp := &http.Client{}
		//URL del load balancer
		url := "http://localhost:4000/endpoint/go/publicar"

		for i := 0; i < 3; i++ {
			publicacion, err := json.Marshal(data[i])
			if err != nil {
				// Maneja el error de acuerdo a tu situación
				log.Fatalf("Error codificando usuario como JSON: %v", err)
			}
			peticion, err := http.NewRequest("POST", url, bytes.NewBuffer(publicacion))
			if err != nil {
				// Maneja el error de acuerdo a tu situación
				log.Fatalf("Error creando petición: %v", err)
			}
			// Podemos agregar encabezados
			peticion.Header.Add("Content-Type", "application/json")
			respuesta, err := clienteHttp.Do(peticion)
			if err != nil {
				// Maneja el error de acuerdo a tu situación
				log.Fatalf("Error haciendo petición: %v", err)
			}

			// No olvides cerrar el cuerpo al terminar
			defer respuesta.Body.Close()

			cuerpoRespuesta, err := ioutil.ReadAll(respuesta.Body)
			if err != nil {
				log.Fatalf("Error leyendo respuesta: %v", err)
			}
			// Aquí puedes decodificar la respuesta si es un JSON, o convertirla a cadena
			respuestaString := string(cuerpoRespuesta)
			log.Printf("Código de respuesta: %d", respuesta.StatusCode)
			log.Printf("Encabezados: '%q'", respuesta.Header)
			contentType := respuesta.Header.Get("Content-Type")
			log.Printf("El tipo de contenido: '%s'", contentType)
			log.Printf("Cuerpo de respuesta del servidor: '%s'", respuestaString)
		}
	}
}

func readJson() ([]models.Publicacion, error) {
	var data lista
	pwd, err := os.Getwd()
	file, err := ioutil.ReadFile(pwd + "/" + "data.json")
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(file, &data)
	if err != nil {
		return nil, err
	}

	return data, nil
}
