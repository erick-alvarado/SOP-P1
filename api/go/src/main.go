package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"go/src/database"
	"go/src/entorno"
	"go/src/models"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

var numMongo int
var clienteMongo *mongo.Client

type notify struct {
	Name      string    `json:"name"`
	State     bool      `json:"state"`
	Time      time.Time `json:"time"`
	Error     bool      `json:"error"`
	Insercion int       `json:"insercion"`
}

type allNotifies []notify

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
	err := ConnectMongo()
	if err != nil {
		notificacion.State = false
		notificacion.Error = true
		return notificacion
	}
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
	var publicacion models.Publicacion
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		json.NewEncoder(w).Encode(false)
		return
	}

	json.Unmarshal(reqBody, &publicacion)
	err = InsertMongo(publicacion)
	if err != nil {
		log.Println(err)
		json.NewEncoder(w).Encode(false)
		return
	}
	json.NewEncoder(w).Encode(true)
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
		Name:      "Mongo",
		State:     false,
		Time:      time.Now(),
		Error:     false,
		Insercion: numMongo,
	}
	err := DisconnectMongo()
	if err != nil {
		notificacion.Error = true
		return notificacion
	}
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
	entorno.LoadEnv()
	port := os.Getenv("PORT")
	//Creamos el router
	router := mux.NewRouter().StrictSlash(true)
	//Ruta principal
	router.HandleFunc("/", indexRoute)
	//Ruta para conectarse a la base de datos y esperar los datos
	router.HandleFunc("/endpoint/go/iniciarCarga", iniciarCarga).Methods("GET")
	//Ruta para publicar la informacion de la base de datos
	router.HandleFunc("/endpoint/go/publicar", publicar).Methods("POST")
	//Ruta para cerrar la conexion de la base de datos y mandar una notificacion
	router.HandleFunc("/endpoint/go/finalizarCarga", finalizarCarga).Methods("GET")
	//Escuchamos al puerto
	fmt.Println("Server on port:" + port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func ConnectMongo() error {
	var err error
	clienteMongo, err = mongo.Connect(context.TODO(), database.GetClient())
	if err != nil {
		log.Println(err)
		return err
	}
	err = clienteMongo.Ping(context.TODO(), nil)
	if err != nil {
		log.Println(err)
		return err
	}

	fmt.Println("MongoDB is connected to: " + os.Getenv("MONGO_NAME"))
	return nil
}

func DisconnectMongo() error {
	var err error
	clienteMongo, err = mongo.Connect(context.TODO(), database.GetClient())
	if err != nil {
		log.Println(err)
		return err
	}
	err = clienteMongo.Disconnect(context.TODO())
	if err != nil {
		log.Println(err)
		return err
	}
	fmt.Println("MongoDB is disconnected to: " + os.Getenv("MONGO_NAME"))
	numMongo = 0
	return nil
}

func InsertMongo(p models.Publicacion) error {
	/* 	var err error
	   	clienteMongo, err = mongo.Connect(context.TODO(), database.GetClient())
	   	if err != nil {
	   		fmt.Println("No ha iniciado conexion con mongo")
	   		return err
	   	} */
	if clienteMongo != nil {
		collection := clienteMongo.Database("olympics-game-news").Collection("publicaciones")
		insertResult, err := collection.InsertOne(context.TODO(), p)
		if err != nil {
			fmt.Println("the collection does not exist in MongoDB ")
			return err
		}
		//fmt.Println(collection.Name())
		fmt.Println("Publicacion had been inserted: ", insertResult.InsertedID)
		numMongo++
		return nil
	} else {
		fmt.Println("MongoDB is not connected")
		return errors.New("unavailable")
	}
}
