package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Location struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Country string             `bson:"country" json:"country"`
	City    string             `bson:"city" json:"city"`
}
