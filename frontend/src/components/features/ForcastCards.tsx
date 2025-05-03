import { Flex, HStack } from "@chakra-ui/react"
import WeatherStatCard from "../common/weatherCards/WeatherStatCard";
import MainContext from "../../Contexts/MainContext";
import { useContext } from "react";
import { WeatherProps } from "../../types/weather";


const ForcastCard = ({weather, isLoading}: {weather:WeatherProps; isLoading: boolean}) => {
    const { unit } = useContext(MainContext);

    const forecastDays = weather?.forecast?.forecastday;

    return (
        <>
            <Flex
                h={{ md: "220px", lg: "250px" }}
                p={2}
                gap={2}
            >
                {/* Desktop */}
                <HStack display={"flex"} w={"100%"} flexDirection={{base: "column", md: "row"}} alignItems={"center"}>
                    {!isLoading && forecastDays?.map((day: any) => (
                        <WeatherStatCard
                            key={day.date}
                            value={{
                                icon: day.day.condition.icon,
                                avgTemp: unit === "C"
                                    ? day.day.avgtemp_c.toString().split(".")[0]
                                    : day.day.avgtemp_f.toString().split(".")[0],
                                minTemp: unit === "C"
                                    ? day.day.mintemp_c.toString().split(".")[0]
                                    : day.day.mintemp_f.toString().split(".")[0],
                                maxTemp: unit === "C"
                                    ? day.day.maxtemp_c.toString().split(".")[0]
                                    : day.day.maxtemp_f.toString().split(".")[0],
                                
                                condition: day.day.condition.text,
                            }}
                            label={`${day.date.substring(5).slice(3, 5)}/${day.date.substring(5).slice(0, 2)}`}
                            unit={`°${unit}`}
                            forecast={true}
                        >
                            <></>
                        </WeatherStatCard>
                    ))}
                </HStack>
            </Flex>
        </>
    );
};

export default ForcastCard;
