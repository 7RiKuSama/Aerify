package db

import (
	"github.com/7RiKuSama/Aerify/internal/repository"

	"go.mongodb.org/mongo-driver/mongo"
)

type Database struct {
	Users         *repository.UserRepo
	Favorites     *repository.FavoriteRepo
	Notifications *repository.NotificationRepo
}

func DbInit(client *mongo.Client) *Database {

	userRepo := repository.NewUsersRepo(client.Database("CloudHunter").Collection("users"))
	favRepo := repository.NewFavoritesnRepo(client.Database("CloudHunter").Collection("favorites"))
	notifRepo := repository.NewNotificationsRepo(client.Database("CloudHunter").Collection("notifications"))
	
	return &Database{
		Users:         userRepo,
		Favorites:     favRepo,
		Notifications: notifRepo,
	}
}
