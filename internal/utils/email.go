package utils

import "github.com/dlclark/regexp2"

func VerifyEmail(email string) (bool, error) {
	re, err := regexp2.Compile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, regexp2.None)

	if err != nil {
		return false, err
	}

	matched, err := re.MatchString(email)

	if err != nil {
		return false, err
	}

	return matched, nil
}
