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

	router := api.NewRouter()

	handlers := api.HandlersInit(myDataBase)
	router.Engine.POST("/user", handlers.HandleCreateUser)
	router.Engine.POST("/login", handlers.HandleVerifyUser)
	router.Engine.POST("/contact", handlers.HandleSendContactEmail)

	protected := router.Engine.Group("/api", api.JWTMiddleware())

	{
		protected.GET("/verify", handlers.HandleGetUserInfo)
		protected.GET("/favorite", handlers.HandleGetAllFavorites)
		protected.POST("/favorite/:id", handlers.HandleCreateFavorite)
		protected.DELETE("/favorite/:id", handlers.HandleDeleteFavorite)
		protected.DELETE("/favorite", handlers.HandleDeleteAllFavorites)
		protected.GET("/settings", handlers.HandleGetSettings)
		protected.PUT("/user", handlers.HandleUpdateUser)
		protected.GET("/user/logout", handlers.HandleLogout)
		protected.DELETE("/user", handlers.HandleDeleteUser)
		protected.POST("/password", handlers.HandleUpdatePassword)
		
		
		protected.GET("/admin/users", handlers.HandleGetFirstTenUsers)
		protected.GET("admin/stat/users", handlers.HandleGetUserCount)
		protected.GET("admin/stat/deleted", handlers.HandleGetDeletedCount)
		protected.GET("/admin/user", handlers.HandleGetUsers)
		protected.DELETE("/admin/users/:id", handlers.HandleDeleteUserByID)
		protected.GET("/admin/stat/connected", handlers.HandleGetConnectedCount)
		protected.GET("/admin/stat/connected/data", handlers.HandleGetConnections)
	}

	router.Engine.Run(":4000")
}
