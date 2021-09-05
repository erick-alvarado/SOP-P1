package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type task struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Content string `json:"content"`
}

type allTasks []task

var tasks = allTasks{
	{
		Id:      1,
		Name:    "Task one",
		Content: "Some content",
	},
}

func iniciarCarga(w http.ResponseWriter, r *http.Request) {

}

func publicar(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(tasks)
}

func finalizarCarga(w http.ResponseWriter, r *http.Request) {

}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to my api")
}

func main() {
	//Creamos el router
	router := mux.NewRouter().StrictSlash(true)
	//Ruta principal
	router.HandleFunc("/", indexRoute)
	//Ruta para conectarse a la base de datos y esperar los datos
	router.HandleFunc("/iniciarCarga", iniciarCarga)
	//Ruta para publicar la informacion de la base de datos
	router.HandleFunc("/publicar", publicar)
	//Ruta para cerrar la conexion de la base de datos y mandar una notificacion
	router.HandleFunc("/finalizarCarga", publicar)
	//Escuchamos al puerto
	log.Fatal(http.ListenAndServe(":3000", router))
}
