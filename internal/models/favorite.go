package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Favorite struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID  primitive.ObjectID `bson:"user_id" json:"user_id"`
	Details Location           `bson:"Details" json:"Details"`
}
