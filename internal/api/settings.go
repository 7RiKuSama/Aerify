package api

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func (h *Handlers) HandleGetSettings(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in request context"})
		return
	}

	// Assert it’s a string
	idStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID in context is not a valid string"})
		return
	}

	// Convert string to ObjectID
	objectID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID format is invalid"})
		return
	}

	result, err := h.DB.Settings.Get(context.TODO(), objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong while retrieving user settings.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	userInfo, err := h.DB.Users.GetUserByID(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during Getting All user's Information. Please try again later.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	var defaultLocation any
	if result.Location.Default != nil {
		defaultLocation = *result.Location.Default
	} else {
		defaultLocation = nil
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Favorites retrieved successfully.",
		"code":    http.StatusOK,
		"target":  "main",
		"location": gin.H{
			"option":  result.Location.Option,
			"default": defaultLocation,
		},
		"data": []gin.H{
			{"key": "temperature_unit", "value": result.TemperatureUnit},
			{"key": "wind_speed", "value": result.WindSpeedUnit},
			{"key": "pressure", "value": result.PressureUnit},
			{"key": "precipitation", "value": result.PrecipitationUnit},
			{"key": "theme", "value": result.Theme},
		},
		"username": userInfo.Username,
		"email":    userInfo.Email,
	})
}