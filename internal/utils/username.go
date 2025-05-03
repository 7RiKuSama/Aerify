package utils

import "github.com/dlclark/regexp2"

func VerifyUsername(username string) (bool, error) {
	re, err := regexp2.Compile("^(?!\\.)(?!.*[@!#$\\s])[a-zA-Z0-9_.-]{3,}$", regexp2.None)
	if err != nil {
		return false, err
	}

	matched, err := re.MatchString(username)

	if err != nil {
		return false, err
	}

	return matched, nil
}
