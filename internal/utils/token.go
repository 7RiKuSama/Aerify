package utils

import (
	"github.com/7RiKuSama/Aerify/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GenerateToken(userID primitive.ObjectID) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID.Hex(), // Convert ObjectID to string
		"exp": time.Now().Add(72 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(config.JWT_TOKEN_GENERATOR))
}
