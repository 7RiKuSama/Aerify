package api

import (
	"context"
	"log"
	"net/http"

	"github.com/7RiKuSama/Aerify/internal/models"
	"github.com/7RiKuSama/Aerify/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/gomail.v2"
)

// HandleCreateUser handles user registration, including validation, creation, and setting default settings.
func (h *Handlers) HandleCreateUser(c *gin.Context) {

	var userInput CreateUserInput

	// Bind and validate input JSON
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

	// Validate username, password, and email
	usernameVerified, err1 := utils.VerifyUsername(username)
	passwordVerified, err2 := utils.VerifyPassword(password)
	emailVerified, err3 := utils.VerifyEmail(email)

	if err := utils.CheckErrors(err1, err2, err3); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": http.StatusText(http.StatusInternalServerError),
			},
			"code": http.StatusInternalServerError,
		})
		return
	}

	// Check username validity
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

	// Check password validity
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

	// Check email validity
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

	// Create user model
	user := &models.User{
		Username: username,
		Email:    email,
		Password: password,
	}

	// Check if user already exists
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

	// Create user in database
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

	// Get user ID from result
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

	// Set default user settings
	settings := models.Settings{
		UserID:            userID,
		TemperatureUnit:   "Celsius (°C)",
		WindSpeedUnit:     "kph",
		PressureUnit:      "mb",
		PrecipitationUnit: "mm",
		Theme:             "Light",
		Location: models.LocationSettings{
			Option:  "gps",
			Default: nil,
		},
	}

	// Create settings in database
	result, err = h.DB.Settings.Create(context.TODO(), &settings)

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

	// Generate authentication token
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

	_ = h.DB.Stats.IncrementConnectedCount(context.TODO())
	_ = h.DB.Connections.AddOrUpdateConnection(context.TODO())

	// Set authentication cookie
	c.SetCookie(
		"auth_token",
		token,
		3600*24*3,
		"/",
		"localhost", // Specify the domain
		false,       // Not secure since using HTTP
		true,        // HttpOnly
	)

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"details": gin.H{
			"other": "Sign up successful.",
		},
		"code":   http.StatusCreated,
		"target": "main",
	})

}

// HandleVerifyUser handles user login by verifying credentials and issuing a token.
func (h *Handlers) HandleVerifyUser(c *gin.Context) {
	var user VerifyUserInput

	// Bind and validate input JSON
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "Invalid or Missing Required Fields",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	// Verify user credentials
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

	// Check if credentials are valid
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

	// Generate authentication token
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

	err = h.DB.Stats.IncrementConnectedCount(context.TODO())
	err = h.DB.Connections.AddOrUpdateConnection(context.TODO())

	if err != nil {
		log.Println(err)
	}

	// Set authentication cookie
	c.SetCookie(
		"auth_token",
		token,
		3600*24*3,
		"/",
		"localhost",
		false,
		true,
	)

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"details": gin.H{
			"other": "Login successful.",
		},
		"code":   http.StatusOK,
		"target": "main",
	})

}

// HandleGetUserInfo retrieves and returns user information based on userID from context.
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
		"username":    user.Username,
		"email":       user.Email,
		"created_at":  user.CreatedAt,
	})
}

// HandleDeleteUser deletes a user and all associated data.
func (h *Handlers) HandleDeleteUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in request context"})
		return
	}

	idStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID in context is not a valid string"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID format is invalid"})
		return
	}

	ctx := c.Request.Context()

	// Delete user settings
	if err := h.DB.Settings.Delete(ctx, objectID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during deleting the user settings.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	// Delete all user favorites
	if err := h.DB.Favorites.DeleteAll(ctx, objectID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during deleting all favorites.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	// Delete user account
	if err := h.DB.Users.DeleteUser(ctx, objectID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Something went wrong during deleting the account.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	// Clear authentication cookie
	c.SetCookie("auth_token", "", -1, "/", "localhost", false, true)

	err = h.DB.Stats.IncrementDeletedCount(context.TODO())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldn't increment delete count.",
		})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "The user has been deleted.",
		"code":    http.StatusOK,
		"target":  "main",
	})
}

// HandleUpdateUser updates user information and settings.
func (h *Handlers) HandleUpdateUser(c *gin.Context) {

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

	var updatedUser models.UpdatedUser

	// Bind and validate input JSON
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "Invalid or Missing Required Fields",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	// Validate username and email
	usernameVerified, err1 := utils.VerifyUsername(updatedUser.Username)
	emailVerified, err2 := utils.VerifyEmail(updatedUser.Email)

	if err := utils.CheckErrors(err1, err2); err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"details": gin.H{
				"other": http.StatusText(http.StatusInternalServerError),
			},
			"code": http.StatusInternalServerError,
		})
		return
	}

	// Check username validity
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

	// Check email validity
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

	// Check if email is already taken if being updated
	if updatedUser.StateEmail {
		result, err := h.DB.Users.CheckEmailExist(context.TODO(), updatedUser.Email)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "fail",
				"message": "Something happened during your Credentials.",
				"code":    http.StatusInternalServerError,
				"target":  "main",
			})
			return
		}

		if result {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "This email is already taken.",
				"code":    http.StatusBadRequest,
				"target":  "main",
			})
			return
		}
	}

	// Check if username is already taken if being updated
	if updatedUser.StateUsername {

		result, err := h.DB.Users.CheckUsernameExist(context.TODO(), updatedUser.Email)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "fail",
				"message": "Something happened during your Credentials.",
				"code":    http.StatusInternalServerError,
				"target":  "main",
			})
			return
		}

		if result {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "This username is already taken.",
				"code":    http.StatusBadRequest,
				"target":  "main",
			})
			return
		}
	}

	// Verify current password before updating
	err = h.DB.Users.VerifyPassword(context.TODO(), updatedUser.Password, objectID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": "Wrong Password.",
			"code":    http.StatusBadRequest,
			"target":  "main",
		})
		return
	}

	// Update user information in database
	err = h.DB.Users.UpdateUser(context.TODO(), objectID, updatedUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Failed to update user information.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	// Update user settings in database
	err = h.DB.Settings.UpdateUserSettings(context.TODO(), objectID, updatedUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": "Failed to update user settings.",
			"code":    http.StatusInternalServerError,
			"target":  "main",
		})
		return
	}

	// Retrieve updated user settings
	userSettings, err := h.DB.Settings.Get(context.TODO(), objectID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":       "fail",
			"message":      "Couldn't fetch user settings.",
			"code":         http.StatusBadRequest,
			"target":       "main",
			"userSettings": userSettings.Theme,
		})
		return
	}

	// Respond with updated user and settings
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "User information fetched successfully.",
		"user": gin.H{
			"username":      updatedUser.Username,
			"email":         updatedUser.Email,
			"stateEmail":    false,
			"stateUsername": false,
		},
		"settings": userSettings,
	})
}

// HandleUpdatePassword updates the user's password after verifying the current password.
func (h *Handlers) HandleUpdatePassword(c *gin.Context) {
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

	passwords := make(map[string]string)

	// Bind and validate input JSON
	if err := c.ShouldBindJSON(&passwords); err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "Something wrong happened, Try later.",
			},
		)
		return
	}

	// Verify current password
	err = h.DB.Users.VerifyPassword(context.TODO(), passwords["current"], objectID)

	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "Wrong current password",
			},
		)
		return
	}

	// Validate new password
	result, err := utils.VerifyPassword(passwords["current"])

	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "Something wrong happened, Try later.",
			},
		)
		return
	}

	if !result {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "New Password is not valid, Try another one.",
			},
		)
		return
	}

	// Update password in database
	err = h.DB.Users.UpdatePassword(context.TODO(), objectID, passwords["new"])

	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "Something wrong happened, Try again.",
			},
		)
		return
	}

	// Respond with success
	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "the password has been changed.",
		},
	)
}

// HandleLogout logs out the user by clearing the authentication cookie.
func (h *Handlers) HandleLogout(c *gin.Context) {

	c.SetCookie("auth_token", "", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Logged out successfully.",
		"code":    http.StatusOK,
		"target":  "main",
	})
}

type ContactForm struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Subject string `json:"subject" binding:"required"`
	Message string `json:"message" binding:"required"`
}

func (h *Handlers) HandleSendContactEmail(c *gin.Context) {
	var form ContactForm

	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "fail", "error": err.Error()})
		return
	}

	// Email details
	mail := gomail.NewMessage()
	mail.SetHeader("From", form.Email)
	mail.SetHeader("To", "ghalem1chaouch@gmail.com") // CHANGE THIS TO YOUR EMAIL
	mail.SetHeader("Subject", "Contact Form: "+form.Subject)
	mail.SetBody("text/plain", "Name: "+form.Name+"\nEmail: "+form.Email+"\n\n"+form.Message)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "ghalem1chaouch@gmail.com", "qcrm jjiu yvwh vqxc") // Update SMTP creds

	if err := dialer.DialAndSend(mail); err != nil {
		log.Println("Email error:", err) // <-- Add this
		c.JSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Failed to send email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Email sent"})
}
