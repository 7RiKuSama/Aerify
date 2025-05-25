import { Box, Flex, HStack, Skeleton, SkeletonText, Stack } from "@chakra-ui/react"
import WeatherStatCard from "../common/weatherCards/WeatherStatCard";
import MainContext from "../../Contexts/MainContext";
import { useContext } from "react";
import { WeatherProps } from "../../types/weather";


const ForcastCard = ({weather, isLoading}: {weather:WeatherProps; isLoading: boolean}) => {
    const { userSettingParam } = useContext(MainContext);

    const forecastDays = weather?.forecast?.forecastday;

    if ( isLoading || !weather || !weather.location || !weather.current || !userSettingParam) {
            return (
                <Box p={10}>
                    <Stack gap="6" maxW="100%">
                        <HStack width="full">
                            <SkeletonText noOfLines={8} />
                        </HStack>
                    <Skeleton 
                        height="100%"
                    />
                </Stack>
              </Box>
              )
        }
        const temp_unit = userSettingParam?.settings?.data[0]?.value

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
                                avgTemp: temp_unit === "Celsius (°C)"
                                    ? day.day.avgtemp_c.toString().split(".")[0]
                                    : day.day.avgtemp_f.toString().split(".")[0],
                                minTemp: temp_unit === "Celsius (°C)"
                                    ? day.day.mintemp_c.toString().split(".")[0]
                                    : day.day.mintemp_f.toString().split(".")[0],
                                maxTemp: temp_unit === "Celsius (°C)"
                                    ? day.day.maxtemp_c.toString().split(".")[0]
                                    : day.day.maxtemp_f.toString().split(".")[0],
                                
                                condition: day.day.condition.text,
                            }}
                            label={`${day.date.substring(5).slice(3, 5)}/${day.date.substring(5).slice(0, 2)}`}
                            unit={`°${temp_unit === "Celsius (°C)"? "C" : "F"}`}
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
