package utils

func CheckErrors(errors ...error) error {
	for _, val := range errors {
		if val != nil {
			return val
		}
	}
	return nil
}