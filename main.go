package main

import (
	"context"
	"time"

	"github.com/7RiKuSama/Aerify/internal/api"
	"github.com/7RiKuSama/Aerify/internal/config"
	"github.com/7RiKuSama/Aerify/internal/db"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	dbConnect := db.NewMongoConnection(config.MONGO_USERNAME, config.MONGO_PASSWORD)
	defer dbConnect.Disconnect(ctx)
	myDataBase := db.DbInit(dbConnect.Client)

	// id := "67f9afc44833f193f59d4169"

	// hexID, err := primitive.ObjectIDFromHex(id)

	// if err != nil {
	// 	panic(err)
	// }

	// err = myDataBase.Users.DeleteUser(ctx, hexID)

	// if err != nil {
	// 	panic(err)
	// }

	router := api.NewRouter()

	handlers := api.HandlersInit(myDataBase)
	router.Engine.POST("/user", handlers.HandleCreateUser)
	router.Engine.POST("/login", handlers.HandleVerifyUser)

	protected := router.Engine.Group("/api", api.JWTMiddleware())

	{
		protected.GET("/verify", handlers.HandleGetUserInfo)
		protected.GET("/favorite", handlers.HandleGetAllFavorites)
		protected.POST("/favorite/:id", handlers.HandleCreateFavorite)
		protected.DELETE("/favorite/:id", handlers.HandleDeleteFavorite)
		protected.DELETE("/favorite", handlers.HandleDeleteAllFavorites)
	}

	router.Engine.Run(":4000")
}
