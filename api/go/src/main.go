package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go/src/database"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type notify struct {
	Name  string    `json:"name"`
	State bool      `json:"state"`
	Time  time.Time `json:"time"`
	Error bool      `json:"error"`
}

type allNotifies []notify

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

func iniciarCargaMysql() notify {
	var notificacion = notify{
		Name:  "Mysql",
		State: true,
		Time:  time.Now(),
		Error: false,
	}
	db, err := database.GetConnectionMysql()
	if err != nil {
		fmt.Printf("Error obteniendo base de datos: %v", err)
		fmt.Println()
		notificacion.State = false
		notificacion.Error = true

		return notificacion
	}
	// Terminar conexión al terminar función
	defer db.Close()

	// Ahora vemos si tenemos conexión
	err = db.Ping()
	if err != nil {
		fmt.Printf("Error conectando: %v", err)
		fmt.Println()
		notificacion.State = false
		notificacion.Error = true
		return notificacion
	}
	// Listo, aquí ya podemos usar a db!
	fmt.Println("Mysql is connected to: " + os.Getenv("MYSQL_NAME"))
	return notificacion
}

func iniciarCargaMongodb() notify {
	var notificacion = notify{
		Name:  "Mongo",
		State: true,
		Time:  time.Now(),
		Error: false,
	}
	db, err := database.GetConnectionMongodb()
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err = db.Connect(ctx)
	if err != nil {
		log.Fatal(err)
		notificacion.State = false
		notificacion.Error = true
		return notificacion
	}
	defer db.Disconnect(ctx)
	err = db.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
		notificacion.State = false
		notificacion.Error = true
		return notificacion
	}
	fmt.Println("MongoDB is connected to: " + os.Getenv("MONGO_NAME"))

	return notificacion
}

func iniciarCarga(w http.ResponseWriter, r *http.Request) {
	var notifies = allNotifies{
		iniciarCargaMysql(),
		iniciarCargaMongodb(),
	}
	json.NewEncoder(w).Encode(notifies)
}

func publicar(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(tasks)
}

func finalizarCargaMysql() notify {
	var notificacion = notify{
		Name:  "Mysql",
		State: false,
		Time:  time.Now(),
		Error: false,
	}
	db, err := database.GetConnectionMysql()
	if err != nil {
		fmt.Printf("Error obteniendo base de datos: %v", err)
		fmt.Println()
		notificacion.Error = true

		return notificacion
	}
	// Terminar conexión al terminar función
	defer db.Close()
	fmt.Println("Mysql is disconnected to: " + os.Getenv("MYSQL_NAME"))
	return notificacion
}

func finalizarCargaMongodb() notify {
	var notificacion = notify{
		Name:  "Mongo",
		State: false,
		Time:  time.Now(),
		Error: false,
	}
	db, err := database.GetConnectionMongodb()
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err = db.Connect(ctx)
	if err != nil {
		log.Fatal(err)
		notificacion.Error = true
		return notificacion
	}
	// Terminar conexión al terminar función
	defer db.Disconnect(ctx)
	fmt.Println("MongoDB is disconnected to: " + os.Getenv("MONGO_NAME"))
	return notificacion
}

func finalizarCarga(w http.ResponseWriter, r *http.Request) {
	var notifies = allNotifies{
		finalizarCargaMysql(),
		finalizarCargaMongodb(),
	}
	json.NewEncoder(w).Encode(notifies)
}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to my api")
}

func main() {
	//Iniciamos variables de entorno
	loadEnv()
	port := os.Getenv("PORT")
	//Creamos el router
	router := mux.NewRouter().StrictSlash(true)
	//Ruta principal
	router.HandleFunc("/", indexRoute)
	//Ruta para conectarse a la base de datos y esperar los datos
	router.HandleFunc("/endpoint/go/iniciarCarga", iniciarCarga)
	//Ruta para publicar la informacion de la base de datos
	router.HandleFunc("/endpoint/go/publicar", publicar)
	//Ruta para cerrar la conexion de la base de datos y mandar una notificacion
	router.HandleFunc("/endpoint/go/finalizarCarga", finalizarCarga)
	//Escuchamos al puerto
	fmt.Println("Server on port:" + port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env")
	}
}
