package repository

import (
	"context"
	"github.com/7RiKuSama/Aerify/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationRepo struct {
	collection *mongo.Collection
}

func NewNotificationsRepo(collection *mongo.Collection) *NotificationRepo {
	return &NotificationRepo{collection: collection}
}

func (n *NotificationRepo) Create(ctx context.Context, userID primitive.ObjectID, title, message string) error {

	notification := &models.Notification{
		UserID:    userID,
		Title:     title,
		Message:   message,
		IsRead:    false,
		CreatedAt: time.Now(),
	}

	_, err := n.collection.InsertOne(ctx, notification)

	if err != nil {
		return err
	}

	return nil
}

func (n *NotificationRepo) Delete(ctx context.Context, notificationId primitive.ObjectID) error {
	result, err := n.collection.DeleteOne(ctx, bson.M{"_id": notificationId})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (n *NotificationRepo) GetAll(ctx context.Context, userID primitive.ObjectID) ([]models.Notification, error) {
	cursor, err := n.collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var notifications []models.Notification

	for cursor.Next(ctx) {
		var notif models.Notification
		if err := cursor.Decode(&notif); err != nil {
			return nil, err
		}
		notifications = append(notifications, notif)
	}

	return notifications, nil
}
