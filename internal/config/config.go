package config

import "os"

var JWT_TOKEN_GENERATOR = os.Getenv("JWT_TOKEN_GENERATOR")
var MONGO_USERNAME = os.Getenv("MONGO_URSERNAME")
var MONGO_PASSWORD = os.Getenv("MONGO_PASSWORD")
var PORT_NUMBER = os.Getenv("PORT_NUMBER")
