import { useState, useEffect } from "react"
import useLocation from "./GetLocation";

const fetchWeather = () => {
    const { location } = useLocation()
    const [weather, useWeather] = useState({})
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (location.latitude !== null && location.longitude !== null) {
            let url = `http://api.weatherapi.com/v1/forecast.json?key=6e1d4b43b9ff49a48f8233905251003&q=${location.latitude},${location.longitude}&days=14&aqi=yes`;
            fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Couldn't fetch weather");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                useWeather(data)
                setLoading(true)
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [location]);

        return {weather, isLoading}
}

export default fetchWeather
