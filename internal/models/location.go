package models

type Location struct {
	Country string `bson:"country" json:"country"`
	City    string `bson:"city" json:"city"`
}
