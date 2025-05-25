package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Settings struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID            primitive.ObjectID `bson:"user_id,omitempty" json:"userID"`
	TemperatureUnit   string             `bson:"temperature_unit" json:"temperature_unit"`
	WindSpeedUnit     string             `bson:"wind_speed" json:"wind_speed"`
	PressureUnit      string             `bson:"pressure" json:"pressure"`
	PrecipitationUnit string             `bson:"precipitation" json:"precipitation"`
	Theme             string             `bson:"theme" json:"theme"`
	Location          LocationSettings   `bson:"location" json:"location"`
}
