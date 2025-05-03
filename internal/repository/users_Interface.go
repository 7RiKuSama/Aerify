package repository

import (
	"context"
	"github.com/7RiKuSama/Aerify/internal/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) (interface{}, error)
	GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
	DeleteUser(ctx context.Context, userID primitive.ObjectID) error
	CheckUsername(ctx context.Context, username string) bool
	VerifyCredentials(ctx context.Context, password, username string) (bool, error)
	UpdateUser(ctx context.Context, userId primitive.ObjectID, update *models.User) error
}
