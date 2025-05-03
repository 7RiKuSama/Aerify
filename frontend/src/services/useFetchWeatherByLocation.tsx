import { useEffect, useState } from "react"
import { WeatherProps } from "../types/weather"

const useFetchWeatherByLocation = (location: string) => {
    const [searchedWeather, setSearchedWeather] = useState<WeatherProps | null>(null)
    const [searchedLoading, setSearchedLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!location) return;

        setSearchedLoading(true)
        let url = `http://api.weatherapi.com/v1/forecast.json?key=6e1d4b43b9ff49a48f8233905251003&q=${location}&days=14&aqi=yes`
        
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Couldn't fetch weather for the given location")
                }
                return response.json()
            })
            .then((data) => {
                setSearchedWeather(data)
                console.log(data)
            })
            .catch((error) => {
                console.error(error)
                setSearchedWeather(null)
            })
            .finally(() => {
                setSearchedLoading(false)
            })

    }, [location])

    return { searchedWeather, searchedLoading }
}

export default useFetchWeatherByLocation