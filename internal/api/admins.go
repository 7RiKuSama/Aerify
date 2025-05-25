package api

import (
	"context"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Query struct {
	Search string `json:"search"`
}

func (h *Handlers) HandleGetUsers(c *gin.Context) {
	search := c.Query("search") // Use query param: /admin/users?search=...
	users, err := h.DB.Users.SearchUsers(context.TODO(), search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something happened getting Users",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (h *Handlers) HandleGetFirstTenUsers(c *gin.Context) {
	users, err := h.DB.Users.GetLast10Users(context.TODO())
	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "Something happened getting Users",
			},
		)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (h *Handlers) HandleDeleteUserByID(c *gin.Context) {
	result := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(result)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID format is invalid"})
		return
	}

	err = h.DB.Users.DeleteUser(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't delete the user with the given ID",
		})
		return
	}

	err = h.DB.Favorites.DeleteAll(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't delete favorites of user with the given ID",
		})
		return
	}

	err = h.DB.Settings.Delete(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't delete the settings of user with the given ID",
		})
		return
	}

	err = h.DB.Stats.IncrementDeletedCount(context.TODO())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't increment delete count.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User has been deleted.",
	})
}

func (h *Handlers) HandleGetUserCount(c *gin.Context) {
	result, err := h.DB.Users.CountUsers(context.TODO())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't get user count.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": result,
	})
}

func (h *Handlers) HandleGetDeletedCount(c *gin.Context) {
	result, err := h.DB.Stats.GetDeletedCount(context.TODO())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't get user count.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": result,
	})
}

func (h *Handlers) HandleGetConnectedCount(c *gin.Context) {
	result, err := h.DB.Stats.GetConnectedCount(context.TODO())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't get user count.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": result,
	})
}

func (h *Handlers) HandleGetConnections(c *gin.Context) {
	result, err := h.DB.Connections.GetAllConnections(context.TODO())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldn't get users connection chart data.",
		})
		return
	}

	type connectionResponse struct {
		Date  string `json:"date"` // formatted
		Count int    `json:"count"`
	}

	var responses []connectionResponse
	for _, conn := range result {
		responses = append(responses, connectionResponse{
			Date:  conn.Date.Format("02 Jan"), // adjust format as needed
			Count: conn.Count,
		})
	}

	// Sort responses by date ascending
	sort.Slice(responses, func(i, j int) bool {
		// Parse the formatted date back to time.Time for comparison
		ti, _ := time.Parse("02 Jan", responses[i].Date)
		tj, _ := time.Parse("02 Jan", responses[j].Date)
		return ti.Before(tj)
	})

	c.JSON(http.StatusOK, gin.H{
		"result": responses,
	})
}
