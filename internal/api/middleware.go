package api

import (
	"fmt"
	"github.com/7RiKuSama/Aerify/internal/config"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Step 1: Get token from cookie only
		tokenStr, err := c.Cookie("auth_token")
		if err != nil || tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentication required - please login"})
			return
		}

		// Step 3: Parse and verify token (regardless of source)
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			// Check if the signing method is HMAC
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(config.JWT_TOKEN_GENERATOR), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Step 4: Extract user ID from claims
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userID := claims["sub"].(string)
			c.Set("userID", userID) // store in context for other handlers
			c.Next()
			return
		}

		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
	}
}


func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Step 1: Get token from cookie only
		tokenStr, err := c.Cookie("admin_token")
		if err != nil || tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentication required - please login"})
			return
		}

		// Step 2: Parse and verify token
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(config.JWT_TOKEN_GENERATOR), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Step 3: Extract user role from claims and check if admin
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			role, ok := claims["role"].(string)
			if !ok || role != "admin" {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
				return
			}
			userID, _ := claims["sub"].(string)
			c.Set("userID", userID)
			c.Next()
			return
		}

		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
	}
}