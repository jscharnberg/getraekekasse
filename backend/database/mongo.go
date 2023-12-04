package database

import (
	"context"
	"errors"
	"fmt"
	"getraenkekasse/config"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client
var dbName string

func GetCollection(name string) *mongo.Collection {
	return mongoClient.Database(dbName).Collection(name)
}

func GetInstance() *mongo.Client {
	if mongoClient == nil {
		StartMongoDB()
		err := config.LoadENV()
		if err != nil {
			panic(err)
		}
	}

	return mongoClient
}

func StartMongoDB() error {

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return errors.New("you must set your 'MONGODB_URI' environmental variable. See\n\t https://www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}

	database := os.Getenv("DATABASE")
	if database == "" {
		return errors.New("you must set your 'DATABASE' environmental variable")
	} else {
		dbName = database
	}

	var err error

	mongoClient, err = mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	fmt.Println("df")
	if err != nil {
		panic(err)
	}

	err = mongoClient.Ping(context.Background(), nil)
	if err != nil {
		return errors.New("can't verify a connection")
	}

	return nil
}

func CloseMongoDB() {
	err := mongoClient.Disconnect(context.Background())
	if err != nil {
		panic(err)
	}
}
