package main

import (
	"context"
	"database/sql"
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
	"strconv"
	"time"

	"cloud.google.com/go/pubsub"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

var numMongo int
var numMysql int
var clienteMongo *mongo.Client
var clienteMysql *sql.DB
var tiempoMongo int
var tiempoMysql int

type notify struct {
	Guardados     int    `json:"guardados"`
	Api           string `json:"api"`
	TiempoDeCarga int    `json:"tiempoDeCarga"`
	Bd            string `json:"bd"`
}

type allNotifies []notify

func iniciarCargaMysql() notify {
	var notificacion = notify{
		Guardados:     0,
		Api:           "Go",
		TiempoDeCarga: 0,
		Bd:            "Mysql",
	}
	var err error
	clienteMysql, err = database.GetConnectionMysql()
	if err != nil {
		fmt.Printf("Error obteniendo base de datos: %v", err)
		fmt.Println()
		return notificacion
	}
	// Terminar conexión al terminar función
	/* defer clienteMysql.Close() */

	// Ahora vemos si tenemos conexión
	err = clienteMysql.Ping()
	if err != nil {
		fmt.Printf("Error conectando: %v", err)
		fmt.Println()
		return notificacion
	}
	// Listo, aquí ya podemos usar a db!
	fmt.Println("Mysql is connected to: " + os.Getenv("MYSQL_NAME"))
	return notificacion
}

func iniciarCargaMongodb() notify {
	var notificacion = notify{
		Guardados:     0,
		Api:           "Go",
		TiempoDeCarga: 0,
		Bd:            "CosmosDB",
	}
	err := ConnectMongo()
	if err != nil {
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
	err = InsertMysql(publicacion)
	if err != nil {
		log.Println(err)
		json.NewEncoder(w).Encode(false)
		return
	}
	json.NewEncoder(w).Encode(true)
}

func finalizarCargaMysql() notify {
	var notificacion = notify{
		Guardados:     numMysql,
		Api:           "Go",
		TiempoDeCarga: tiempoMysql,
		Bd:            "Mysql",
	}
	var err error
	clienteMysql, err = database.GetConnectionMysql()
	if err != nil {
		fmt.Printf("Error obteniendo base de datos: %v", err)
		fmt.Println()

		return notificacion
	}
	// Terminar conexión al terminar función
	defer clienteMysql.Close()
	numMysql = 0
	tiempoMysql = 0
	fmt.Println("Mysql is disconnected to: " + os.Getenv("MYSQL_NAME"))
	return notificacion
}

func finalizarCargaMongodb() notify {
	var notificacion = notify{
		Guardados:     numMongo,
		Api:           "Go",
		TiempoDeCarga: tiempoMongo,
		Bd:            "CosmosDB",
	}
	err := DisconnectMongo()
	if err != nil {
		return notificacion
	}
	return notificacion
}

func finalizarCarga(w http.ResponseWriter, r *http.Request) {
	var notifies = allNotifies{
		finalizarCargaMongodb(),
		finalizarCargaMysql(),
	}
	mongoDB, _ := json.Marshal(notifies[0])
	pub(string(mongoDB))
	mysql, _ := json.Marshal(notifies[1])
	pub(string(mysql))
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
	router.HandleFunc("/go/iniciarCarga", iniciarCarga).Methods("GET")
	//Ruta para publicar la informacion de la base de datos
	router.HandleFunc("/go/publicar", publicar).Methods("POST")
	//Ruta para cerrar la conexion de la base de datos y mandar una notificacion
	router.HandleFunc("/go/finalizarCarga", finalizarCarga).Methods("GET")
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
	tiempoMongo = 0
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
		tInicio := time.Now().UnixNano() / 1e9
		collection := clienteMongo.Database("olympics-game-news").Collection("publicaciones")
		insertResult, err := collection.InsertOne(context.TODO(), p)
		if err != nil {
			fmt.Println("the collection does not exist in MongoDB ")
			return err
		}
		//fmt.Println(collection.Name())
		fmt.Println("Publicacion had been inserted: ", insertResult.InsertedID)
		numMongo++
		tFinal := time.Now().UnixNano() / 1e9
		tiempoMongo = int(tFinal) - int(tInicio)
		return nil
	} else {
		fmt.Println("MongoDB is not connected")
		return errors.New("unavailable")
	}
}

func InsertMysql(p models.Publicacion) error {
	if clienteMysql != nil {
		var cadena string
		cadena2 := "\"" + p.Nombre + "\",\"" + p.Comentario + "\",\"" + p.Fecha + "\"," + strconv.Itoa(p.Upvotes) + "," + strconv.Itoa(p.Downvotes)
		tInicio := time.Now().UnixNano() / 1e9
		for i := 0; i < len(p.Hashtags); i++ {
			if i == len(p.Hashtags)-1 {
				cadena += p.Hashtags[i]
			} else {
				cadena += p.Hashtags[i] + "#"
			}
		}
		fmt.Println("call split(\"" + cadena + "\",\"#\"," + cadena2 + ")")

		insert, err := clienteMysql.Query("call split(\"" + cadena + "\",\"#\"," + cadena2 + ")")
		if err != nil {
			return err
		}
		insert.Close()
		fmt.Println("Succesfully inserted into Publicacion, Hashtag tables")
		numMysql++
		tFinal := time.Now().UnixNano() / 1e9
		numMysql += int(tFinal) - int(tInicio)

		return nil
	} else {
		fmt.Println("Mysql is not connected")
		return errors.New("unavailable")
	}
}

func pub(msg string) error {
	// Definimos el ProjectID del proyecto
	// Este dato lo sacamos de Google Cloud
	projectID := "sopess1"

	// Definimos el TopicId del proyecto
	// Este dato lo sacamos de Google Cloud
	topicID := "olimpiada"

	// Definimos el contexto en el que ejecutaremos PubSub
	ctx := context.Background()
	// Creamos un nuevo cliente
	client, err := pubsub.NewClient(ctx, projectID)
	// Si un error ocurrio creando el nuevo cliente, entonces imprimimos un error y salimos
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("pubsub.NewClient: %v", err)
	}

	// Obtenemos el topico al que queremos enviar el mensaje
	t := client.Topic(topicID)

	// Publicamos los datos del mensaje
	result := t.Publish(ctx, &pubsub.Message{Data: []byte(msg)})

	// Bloquear el contexto hasta que se tenga una respuesta de parte de GooglePubSub
	id, err := result.Get(ctx)

	// Si hubo un error creando el mensaje, entonces mostrar que existio un error
	if err != nil {
		fmt.Println(err)
		return err
	}

	// El mensaje fue publicado correctamente
	fmt.Println("Published a message; msg ID: %v\n", id)
	return nil
}
