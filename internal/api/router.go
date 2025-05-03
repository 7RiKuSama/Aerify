package api

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Router struct {
	Engine *gin.Engine
}


func NewRouter(middlewares ...gin.HandlerFunc) *Router {
	return &Router{
		Engine: func() *gin.Engine {
			engine := gin.New()
			engine.Use(cors.New(cors.Config{
				AllowOrigins:     []string{"http://localhost:5173"}, // Frontend origin
				AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
				AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
				ExposeHeaders:    []string{"Content-Length"},
				AllowCredentials: true, // This is important for cookies
				MaxAge:           12 * time.Hour,
			}))
			engine.Use(gin.Logger(), gin.Recovery())
			engine.Use(middlewares...)
			return engine
		}(),
	}
}






