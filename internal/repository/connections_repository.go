package repository

import (
	"context"
	"time"

	"github.com/7RiKuSama/Aerify/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ConnectionRepo struct {
	collection *mongo.Collection
}

func NewConnectionsRepo(collection *mongo.Collection) *ConnectionRepo {
	return &ConnectionRepo{collection: collection}
}


// AddOrUpdateConnection increments today's connection count or creates a new document.
// It also deletes documents older than 30 days.
func (r *ConnectionRepo) AddOrUpdateConnection(ctx context.Context) error {
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	filter := bson.M{"date": today}
	update := bson.M{
		"$inc": bson.M{"count": 1},
		"$setOnInsert": bson.M{
			"date": today,
		},
	}
	opts := options.Update().SetUpsert(true)

	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return err
	}

	// Delete documents older than 30 days
	cutoff := today.AddDate(0, 0, -30)
	_, err = r.collection.DeleteMany(ctx, bson.M{"date": bson.M{"$lt": cutoff}})
	return err
}



// GetAllConnections retrieves all documents from the connections collection.
func (r *ConnectionRepo) GetAllConnections(ctx context.Context) ([]models.Connection, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var connections []models.Connection
	
	for cursor.Next(ctx) {
		var conn models.Connection
		if err := cursor.Decode(&conn); err != nil {
			return nil, err
		}
		conn.FormattedDate = conn.Date.Format("02 Jan") // e.g., "22 May"
		connections = append(connections, conn)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return connections, nil
}
