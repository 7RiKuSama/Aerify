import { useEffect, useState, useContext } from "react";
import { WeatherProps } from "../../types/weather";
import { Box, Flex, Text } from "@chakra-ui/react";
import MainContext from "../../Contexts/MainContext";

const MajorCitiesWeather = () => {
    
    const cities = ["New York", "Tokyo", "London", "Paris", "Shanghai", "Dubai"];
    const [weatherList, setWeatherList] = useState<WeatherProps[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useContext(MainContext)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const results = await Promise.all(
                    cities.map(async (city) => {
                        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=6e1d4b43b9ff49a48f8233905251003&q=${city}&days=14&aqi=yes`);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${city}`);
                        }
                        return response.json();
                    })
                );
                setWeatherList(results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);
    

    return (
        <Box
            w="100%"
            bg={theme.boxBg}
            borderRadius="5px"
            border={`1px solid ${theme.borderColor}`}
            p={3}
            display="flex"
            flexDirection="column"
            gap={3}
            >
            {!loading && weatherList.map((weather, index) => (
                <Flex
                key={index}
                align="center"
                justify="space-between"
                bg={theme.secondBg}
                p={2}
                borderRadius="6px"
                _hover={{ bg: theme.hoverBg, transition: "0.3s" }}
                >
                {/* Left side: Icon + City */}
                <Flex align="center" gap={2}>
                    <Box boxSize="30px">
                    <img
                        src={weather.current.condition.icon}
                        alt={weather.current.condition.text}
                        style={{ width: "100%", height: "auto" }}
                    />
                    </Box>
                    <Box>
                    <Text fontSize="md" fontWeight="semibold">{weather.location.name}</Text>
                    <Text fontSize="xs" color="gray.400">{weather.current.condition.text}</Text>
                    </Box>
                </Flex>

                {/* Right side: Temperature */}
                <Text fontSize="lg" fontWeight="bold">
                    {Math.round(weather.current.temp_c)}°C
                </Text>
                </Flex>
            ))}
            </Box>
    )
}

export default MajorCitiesWeather