package database

import (
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetConnectionMongodb() (*mongo.Client, error) {
	user := os.Getenv("MONGO_USER")
	password := os.Getenv("MONGO_PASSWORD")
	host := os.Getenv("MONGO_HOST")
	port := os.Getenv("MONGO_PORT")
	database := os.Getenv("MONGO_NAME")
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database + "?ssl=true"))
	if err != nil {
		return nil, err
	}
	return client, nil
}
