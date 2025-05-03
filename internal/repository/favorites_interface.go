package repository

import (
	"context"
	"github.com/7RiKuSama/Aerify/internal/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FavoriteRepository interface {
	Create(ctx context.Context, userID primitive.ObjectID, location models.Location) (interface{}, error)
	Delete(ctx context.Context, favoriteId primitive.ObjectID) error
	GetAll(ctx context.Context, userId primitive.ObjectID) ([]models.Favorite, error)
}
