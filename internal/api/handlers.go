package api

import (
	"context"
	"log"
	"net/http"

	"github.com/7RiKuSama/Aerify/internal/db"
	"github.com/7RiKuSama/Aerify/internal/models"
	"github.com/7RiKuSama/Aerify/internal/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateUserInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type VerifyUserInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Handlers struct {
	DB *db.Database
}

func HandlersInit(DB *db.Database) *Handlers {
	return &Handlers{
		DB: DB,
	}
}

func (h *Handlers) HandleCreateUser(c *gin.Context) {

	var userInput CreateUserInput

	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "Invalid or Missing Required Fields",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	username := userInput.Username
	email := userInput.Email
	password := userInput.Password

	usernameVerified, err1 := utils.VerifyUsername(username)
	passwordVerified, err2 := utils.VerifyPassword(password)
	emailVerified, err3 := utils.VerifyEmail(email)

	if err := utils.CheckErrors(err1, err2, err3); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": http.StatusText(http.StatusInternalServerError),
			},
			"code": http.StatusInternalServerError,
		})
		return
	}

	if !usernameVerified {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"details": gin.H{
				"username": "Username is invalid. It must not start with a dot or contain spaces or special characters.",
			},
			"code": http.StatusBadRequest,
		})
		return
	}

	if !passwordVerified {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"details": gin.H{
				"password": "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
			},
			"code": http.StatusBadRequest,
		})
		return
	}

	if !emailVerified {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"details": gin.H{
				"email": "Email address is invalid",
			},
			"code": http.StatusBadRequest,
		})
		return
	}

	user := &models.User{
		Username: username,
		Email:    email,
		Password: password,
	}

	exist, err := h.DB.Users.ExistsByUsernameOrEmail(context.TODO(), username, email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": http.StatusText(http.StatusInternalServerError),
			},
			"code": http.StatusInternalServerError,
		})
		return
	}

	if exist {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"details": gin.H{
				"other": "An account with this username or email already exists.",
			},
			"code": http.StatusBadRequest,
		})
		return
	}

	result, err := h.DB.Users.Create(context.TODO(), user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": http.StatusText(http.StatusInternalServerError),
			},
			"code": http.StatusInternalServerError,
		})
		return
	}

	userID, ok := result.(primitive.ObjectID)

	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": http.StatusText(http.StatusInternalServerError),
			},
			"code": http.StatusInternalServerError,
		})
		return
	}

	token, err := utils.GenerateToken(userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during Sign up. Please try again later.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	c.SetCookie(
		"auth_token",
		token,
		3600 * 24 * 3,
		"/",
		"localhost", // Specify the domain
		false,       // Not secure since using HTTP
		true,        // HttpOnly
	)

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"details": gin.H{
			"other": "Sign up successful.",
		},
		"code":   http.StatusCreated,
		"target": "main",
	})

}

func (h *Handlers) HandleVerifyUser(c *gin.Context) {
	var user VerifyUserInput

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "Invalid or Missing Required Fields",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	result, err := h.DB.Users.VerifyCredentials(context.TODO(), user.Password, user.Username)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": "Something went wrong during login. Please try again later.",
			},
			"code":   http.StatusInternalServerError,
			"target": "main",
		})
		return
	}

	if result == primitive.NilObjectID {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": "fail",
			"details": gin.H{
				"other": "Invalid email or password.",
			},
			"code": http.StatusUnauthorized,
		})
		return
	}

	token, err := utils.GenerateToken(result)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": "Something went wrong during login. Please try again later.",
			},
			"code":   http.StatusInternalServerError,
			"target": "main",
		})
		return
	}

	c.SetCookie(
		"auth_token",
		token,
		3600*24*3,
		"/",
		"localhost",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"details": gin.H{
			"other": "Login successful.",
		},
		"code":   http.StatusOK,
		"target": "main",
	})

}

func (h *Handlers) HandleGetUserInfo(c *gin.Context) {
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

	// Retrieve user from database
	user, err := h.DB.Users.GetUserByID(context.TODO(), objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user information"})
		return
	}

	// Return user info
	c.JSON(http.StatusOK, gin.H{
		"isConnected": true,
		"username":   user.Username,
		"email":      user.Email,
		"created_at": user.CreatedAt,
	})
}


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
			City: location.City,
			Country: location.Country,
		},
	}

	isFound, err := h.DB.Favorites.CheckLocationIfExist(context.TODO(), fav)
	
	if (err != nil || isFound) {
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
		"status":  "success",
		"message": "Favorites retrieved successfully.",
		"code":    http.StatusOK,
		"target":  "main",
		"favorites": result,
	})
}

