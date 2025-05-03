package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Notification struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Title     string             `bson:"title" json:"title"`
	Message   string             `bson:"message" json:"message"`
	IsRead    bool               `bson:"isRead" json:"is_read"`
	CreatedAt time.Time          `bson:"createdAt" json:"created_at"`
}
