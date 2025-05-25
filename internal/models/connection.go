package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Connection struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Date          time.Time          `bson:"date" json:"-"`
	Count         int                `bson:"count" json:"count"`
	FormattedDate string             `json:"date"`
}
