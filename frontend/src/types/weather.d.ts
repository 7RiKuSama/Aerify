export interface Suggestion {
    country: string | null;
    city: string | null;
    county: string | null;
    state : string | null;
    province: string | null;
    formatted: string | null;
  }

export interface NewsArticleProps {
    title: string;
    publishedAt: string;
    source: string;
    url: string;
    description: string;
    image: string;
    content: string
}


export interface WeatherProps {
  location: {
      name: string;
      country: string;
      lat: string;
      lon: string;
  };
  current: {
      condition: {
          text: string;
          icon: string;
      };
      temp_c: number;
      temp_f: number;
      humidity: number;
      wind_kph: number;
      wind_dir: string;
      precip_mm: number;
      vis_km: number;
      uv: number;
      pressure_mb: number;
      cloud: number;
      air_quality: {
        co: number;
        no2: number;
        o3: number;
        so2: number;
        pm2_5: number;
        pm10: number;
        "us-epa-index": number;
        "gb-defra-index": number;
    }
  };
  forecast: {
    forecastday: Array<{
        date: string;
        astro: {
            sunrise: string;
            sunset: string;
        };
        day: {
            avgtemp_c: number;
            avgtemp_f: number;
            mintemp_c: number;
            mintemp_f: number;
            maxtemp_c: number;
            maxtemp_f: number;
            condition: {
                text: string;
                icon: string;
            };
        };
    }>;
};
}

export interface HourlyWeatherProps {
  time: string;
  temp: number;          // Temperature in °C
  humidity: number;      // Humidity percentage
  rain: number;          // Rain in mm
  windSpeed: number;     // Wind speed in km/h or m/s
  uvIndex: number;       // UV Index
  precipitation: number; // Precipitation in mm
  pressure: number;      // Air Pressure in hPa (or mb)
  condition: string;     // Weather condition (e.g., "Clear", "Rainy")
}


export interface LocationProps {
    city: string|null;
    country: string|null
}


export interface Favorite 
{ 
    id: string;
    user_id: string;
    Details: LocationProps
}
