package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type StatsRepo struct {
	collection *mongo.Collection
}

func NewStatsRepo(collection *mongo.Collection) *StatsRepo {
	return &StatsRepo{collection: collection}
}

func (s *StatsRepo) IncrementDeletedCount(ctx context.Context) error {

	id, err := primitive.ObjectIDFromHex("683201fefdc2dbb40dc5da48")
	if err != nil {
		return err
	}

	filter := bson.M{"_id": id}

	update := bson.M{
		"$inc": bson.M{
			"deleted": 1,
		},
	}

	_, err = s.collection.UpdateOne(ctx, filter, update)
	return err
}

func (s *StatsRepo) GetDeletedCount(ctx context.Context) (int, error) {

	id, err := primitive.ObjectIDFromHex("683201fefdc2dbb40dc5da48")

	if err != nil {
		return 0, err
	}

	filter := bson.M{"_id": id}

	var result struct {
		Deleted int `bson:"deleted"`
	}

	err = s.collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		return 0, err
	}

	return result.Deleted, nil
}

func (s *StatsRepo) IncrementConnectedCount(ctx context.Context) error {
	id, err := primitive.ObjectIDFromHex("68321e9cfdc2dbb40dc5da49")
	if err != nil {
		return err
	}

	filter := bson.M{"_id": id}

	var result struct {
		Connected  int       `bson:"connected"`
		CreatedAt  time.Time `bson:"created_at"`
	}

	err = s.collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return err
	}

	now := time.Now()
	// Reset count if the day or month has changed
	if result.CreatedAt.Day() != now.Day() || result.CreatedAt.Month() != now.Month() || result.CreatedAt.Year() != now.Year() {
		update := bson.M{
			"$set": bson.M{
				"connected": 1,
				"created_at": now,
			},
		}
		_, err = s.collection.UpdateOne(ctx, filter, update)
		return err
	}

	update := bson.M{
		"$inc": bson.M{
			"connected": 1,
		},
	}
	_, err = s.collection.UpdateOne(ctx, filter, update)
	return err
}

func (s *StatsRepo) GetConnectedCount(ctx context.Context) (int, error) {

	id, err := primitive.ObjectIDFromHex("68321e9cfdc2dbb40dc5da49")

	if err != nil {
		return 0, err
	}

	filter := bson.M{"_id": id}

	var result struct {
		Deleted    int `bson:"connected"`
		Created_at time.Time `bson:"created_at"`
	}

	err = s.collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		return 0, err
	}

	return result.Deleted, nil
}
