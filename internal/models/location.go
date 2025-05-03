package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Location struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Latitude  float64            `bson:"latitude" json:"latitude"`
	Longitude float64            `bson:"longitude" json:"longitude"`
	Address   string             `bson:"address" json:"address"`
}
