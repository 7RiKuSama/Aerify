package repository

import (
	"context"
	"github.com/7RiKuSama/Aerify/internal/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)
 
type NotificationRepository interface {
	Create(ctx context.Context, userID primitive.ObjectID, title, message string) error
	Delete(ctx context.Context, notificationID primitive.ObjectID) error
	GetAll(ctx context.Context, userID primitive.ObjectID) ([]models.Notification, error)
}
