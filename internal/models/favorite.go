package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Favorite struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Details   Location           `bson:"Details" json:"Details"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}


