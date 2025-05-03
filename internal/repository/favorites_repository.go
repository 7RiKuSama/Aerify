package repository

import (
	"context"
	"github.com/7RiKuSama/Aerify/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type FavoriteRepo struct {
	collection *mongo.Collection
}

func NewFavoritesnRepo(collection *mongo.Collection) *FavoriteRepo {
	return &FavoriteRepo{collection: collection}
}

func (f *FavoriteRepo) Create(ctx context.Context, userID primitive.ObjectID, location models.Location) (interface{}, error) {
	
	fav := models.Favorite{
		UserID: userID,
		Details: location,
		CreatedAt: time.Now(),
	}
	
	result, err := f.collection.InsertOne(ctx, fav)

	if err != nil {
		return nil, err
	}

	return result.InsertedID, nil
}

func (f *FavoriteRepo) Delete(ctx context.Context, favoriteId primitive.ObjectID) error {
	result, err := f.collection.DeleteOne(ctx, bson.M{"_id": favoriteId})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}

func (f *FavoriteRepo) GetAll(ctx context.Context, userId primitive.ObjectID) ([]models.Favorite, error) {
	cursor, err := f.collection.Find(ctx, bson.M{"user_id": userId})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)
	var favorites []models.Favorite

	for cursor.Next(ctx) {
		var fav models.Favorite
		if err := cursor.Decode(&fav); err != nil {
			return nil, err
		}
		favorites = append(favorites, fav)
	}

	return favorites, nil
}
