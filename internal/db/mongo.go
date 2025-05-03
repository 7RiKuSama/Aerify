package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoConnection struct {
	Client *mongo.Client
}

func NewMongoConnection(username, password string) *MongoConnection {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := fmt.Sprintf("mongodb+srv://rikusama:aqpYIfmEszOIxmtI@cluster0.havtds4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}

	return &MongoConnection{
		Client: client,
	}
}

func (d *MongoConnection) Disconnect(ctx context.Context) error {
	return d.Client.Disconnect(ctx)

}
