package db

import (
	"github.com/7RiKuSama/Aerify/internal/repository"
	"go.mongodb.org/mongo-driver/mongo"
)

type Database struct {
	Users         *repository.UserRepo
	Favorites     *repository.FavoriteRepo
	Notifications *repository.NotificationRepo
	Settings      *repository.SettingsRepo
	Stats         *repository.StatsRepo
	Connections   *repository.ConnectionRepo
}

func DbInit(client *mongo.Client) *Database {

	userRepo := repository.NewUsersRepo(client.Database("CloudHunter").Collection("users"))
	favRepo := repository.NewFavoritesnRepo(client.Database("CloudHunter").Collection("favorites"))
	notifRepo := repository.NewNotificationsRepo(client.Database("CloudHunter").Collection("notifications"))
	settingsRepo := repository.NewSettingsRepo(client.Database("CloudHunter").Collection("settings"))
	statsRepo := repository.NewStatsRepo(client.Database("CloudHunter").Collection("stats"))
	connectionsRepo := repository.NewConnectionsRepo(client.Database("CloudHunter").Collection("connections"))
	
	return &Database{
		Users:         userRepo,
		Favorites:     favRepo,
		Notifications: notifRepo,
		Settings:      settingsRepo,
		Stats:         statsRepo,
		Connections:   connectionsRepo,
	}
}
