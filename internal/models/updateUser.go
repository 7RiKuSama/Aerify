package models

type WeatherSettings struct {
	Key   string `json:"key" bson:"key"`
	Value string `json:"value" bson:"value"`
}

type LocationSettings struct {
	Option  string    `json:"option" bson:"option"`
	Default *Location `bson:"default,omitempty" json:"default,omitempty"`
}

type UpdatedUser struct {
	Username      string            `json:"username"`
	Email         string            `json:"email"`
	StateUsername bool              `json:"stateUsername"`
	StateEmail    bool              `json:"stateEmail"`
	Location      LocationSettings  `json:"location"`
	Password      string            `json:"password"`
	Settings      []WeatherSettings `json:"settings" `
}
