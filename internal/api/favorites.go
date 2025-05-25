package api

import (
	"context"
	"net/http"

	"github.com/7RiKuSama/Aerify/internal/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func (h *Handlers) HandleCreateFavorite(c *gin.Context) {
	// Extract userID from context
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

	var location models.Location

	if err := c.ShouldBindJSON(&location); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "Wrong Location format.",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	fav := models.Favorite{
		UserID: objectID,
		Details: models.Location{
			City:    location.City,
			Country: location.Country,
		},
	}

	isFound, err := h.DB.Favorites.CheckLocationIfExist(context.TODO(), fav)

	if err != nil || isFound {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "You already added this location to your favorites.",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	_, err = h.DB.Favorites.Create(context.TODO(), objectID, location)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during Adding the favorite. Please try again later.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "A Location have been added to favorites.",
	})
}

func (h *Handlers) HandleDeleteFavorite(c *gin.Context) {
	idStr := c.Param("id")

	// Convert string to ObjectID
	objectID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID format is invalid"})
		return
	}

	err = h.DB.Favorites.Delete(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during Deleting the favorite. Please try again later.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Favorite in the given Location has been deleted.",
		"code":    http.StatusOK,
		"target":  "main",
	})

}

func (h *Handlers) HandleDeleteAllFavorites(c *gin.Context) {
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

	err = h.DB.Favorites.DeleteAll(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during Deleting All the favorites. Please try again later.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Favorites List has been deleted.",
		"code":    http.StatusOK,
		"target":  "main",
	})
}

func (h *Handlers) HandleGetAllFavorites(c *gin.Context) {
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

	result, err := h.DB.Favorites.GetAll(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during Getting All user's favorites. Please try again later.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "success",
		"message":   "Favorites retrieved successfully.",
		"code":      http.StatusOK,
		"target":    "main",
		"favorites": result,
	})
}