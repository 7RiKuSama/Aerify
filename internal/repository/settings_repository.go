package repository

import (
	"context"
	"fmt"

	"github.com/7RiKuSama/Aerify/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type SettingsRepo struct {
	collection *mongo.Collection
}

func NewSettingsRepo(collection *mongo.Collection) *SettingsRepo {
	return &SettingsRepo{collection: collection}
}

func (s *SettingsRepo) Create(ctx context.Context, settings *models.Settings) (interface{}, error) {
	result, err := s.collection.InsertOne(ctx, settings)

	if err != nil {
		return nil, err
	}

	return result.InsertedID, nil
}

func (s *SettingsRepo) Delete(ctx context.Context, userID primitive.ObjectID) error {
	fmt.Println("Attempting to delete settings for:", userID.Hex())
	result, err := s.collection.DeleteOne(ctx, bson.M{"user_id": userID})
	fmt.Printf("Delete result: %+v, err: %v\n", result, err)
	if err != nil {
		return err
	}

	return nil
}

func (s *SettingsRepo) Update(ctx context.Context, userID primitive.ObjectID, update models.Settings) (bool, error) {
	result, err := s.collection.UpdateOne(ctx, bson.M{"user_id": userID}, bson.M{"$set": update})

	if err != nil {
		return false, err
	}

	if result.ModifiedCount == 0 {
		return false, mongo.ErrNoDocuments
	}

	return true, nil
}

func (s *SettingsRepo) Get(ctx context.Context, userID primitive.ObjectID) (models.Settings, error) {

	var userSettings models.Settings
	err := s.collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&userSettings)

	if err != nil {
		return models.Settings{}, err
	}

	return userSettings, nil
}

func (s *SettingsRepo) UpdateUserSettings(ctx context.Context, userId primitive.ObjectID, update models.UpdatedUser) error {
	// Initialize update map
	updateMap := bson.M{}

	// Add weather settings from array
	for _, setting := range update.Settings {
		updateMap[setting.Key] = setting.Value
	}

	// Add location from UpdatedUser object
	updateMap["location"] = update.Location

	// Update the document
	result, err := s.collection.UpdateOne(
		ctx,
		bson.M{"user_id": userId},
		bson.M{"$set": updateMap},
	)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
