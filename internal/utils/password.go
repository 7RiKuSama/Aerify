package utils

import (
	"fmt"

	"github.com/dlclark/regexp2"
	"golang.org/x/crypto/bcrypt"
)

func VerifyPassword(password string) (bool, error) {
	re, err := regexp2.Compile(`^(?!.*[@!#$%^&*]{2,}).{8,}$`, regexp2.None)
	if err != nil {
		return false, err
	}

	matched, err := re.MatchString(password)
	if err != nil {
		return false, err
	}

	return matched, nil
}

// hashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("error hashing password: %w", err)
	}
	return string(hash), nil
}

// CheckPasswordHash compares the hashed password with the provided password
func CheckPasswordHash(storedHash, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password))
	if err != nil {
		return fmt.Errorf("invalid password: %w", err)
	}
	return nil
}
