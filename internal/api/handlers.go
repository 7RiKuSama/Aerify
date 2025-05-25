package api

import (
	"errors"

	"github.com/7RiKuSama/Aerify/internal/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateUserInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}



type VerifyUserInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}


type Handlers struct {
	DB *db.Database
}


func HandlersInit(DB *db.Database) *Handlers {
	return &Handlers{
		DB: DB,
	}
}

func GetUserID(c *gin.Context) (primitive.ObjectID, error) {
	// Extract userID from context
	userID, exists := c.Get("userID")
	if !exists {
		return primitive.NilObjectID, errors.New("User ID not found in request context")
	}

	// Assert it’s a string
	idStr, ok := userID.(string)
	if !ok {
		return primitive.NilObjectID, errors.New("Cannot convert userID.")
	}

	// Convert string to ObjectID
	objectID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		return primitive.NilObjectID, err
	}

	return objectID, nil
}




