package database

import (
	"os"

	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetClient() *options.ClientOptions {
	user := os.Getenv("MONGO_USER")
	password := os.Getenv("MONGO_PASSWORD")
	host := os.Getenv("MONGO_HOST")
	port := os.Getenv("MONGO_PORT")
	database := os.Getenv("MONGO_NAME")
	client := options.Client().ApplyURI("mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database + "?ssl=true&replicaSet=globaldb&retrywrites=false")
	return client
}
