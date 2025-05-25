import { Grid, GridItem, Flex, Text, Box, Image, Stack, HStack, SkeletonCircle, SkeletonText, Skeleton } from "@chakra-ui/react"

import { useContext } from "react"
import MainContext from "../../Contexts/MainContext"
import WeatherStatCard from "../common/weatherCards/WeatherStatCard"
import { FaTemperatureEmpty } from "react-icons/fa6";
import { FaWind } from "react-icons/fa"
import { IoMdWater } from "react-icons/io";
import { IoIosRainy } from "react-icons/io";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { GiRadiations } from "react-icons/gi";
import { FaWeightHanging } from "react-icons/fa6";
import { WeatherProps } from "../../types/weather";
import useLocationImage from "../../services/useLocationImage";
import useCountryFlag from "../../services/useCountryFlag";
import { IoCloudSharp } from "react-icons/io5";
import { FaSun } from "react-icons/fa";
import { FiSunset } from "react-icons/fi";



const Home = ({ height, weather, isLoading }: { height: string; weather: WeatherProps; isLoading: boolean }) => {
    
    const { theme, userSettingParam } = useContext(MainContext)

    if (isLoading || !weather || !weather.location || !weather.current || !userSettingParam) {
    return <p>...</p>;
    }

    const locationImageResult = useLocationImage(weather?.location?.country ?? "");
    const { flag, isFlagLoading } = useCountryFlag(weather?.location?.country ?? "");

    if (locationImageResult.imageLoading) {
    return <p>...</p>;
    }
    if (locationImageResult.imageLoading ) {
        return (
        <Box>
            <Stack gap="6" maxW="xs">
                <HStack width="full">
                    <SkeletonCircle size="10" />
                    <SkeletonText noOfLines={2} />
                </HStack>
            <Skeleton height="200px" />
        </Stack>
      </Box>
      )
    }

    const temp_unit = userSettingParam?.settings?.data[0]?.value
    const wind_unit = userSettingParam?.settings?.data[1]?.value
    const pressure_unit = userSettingParam?.settings?.data[2]?.value
    const precipitation_unit = userSettingParam?.settings?.data[3]?.value
    

    return (
        <>
            <Flex
                direction={{ base: "column-reverse", md: "column-reverse", lg: "row" }} 
                alignItems="start"
                height={{ base: "fit-content", md: height, lg: "fit-content" }}
                p={0}
                gap={0}
                className="weather-card"
            >
                <Grid
                    w={{ base: "100%", lg: "25%" }}
                    templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)", lg: "repeat(2, 1fr)" }}
                    templateRows={{ md: "repeat(3, 110px)", lg: "repeat(5, 90px)" }}
                    gap={2}
                    p={2}
                >
                    <GridItem colSpan={{ md: 2, lg: 1 }}>
                        <WeatherStatCard 
                            value={temp_unit === "Celsius (°C)"? weather.current.temp_c : weather.current.temp_f} 
                            label={"Temperature"} unit={temp_unit === "Celsius (°C)"? "°C" : "°F"} 
                            forecast={false}
                        >
                            <FaTemperatureEmpty color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem>
                        <WeatherStatCard value={weather.current.humidity} label={"Humidity"} unit={"%"} forecast={false}>
                            <IoMdWater color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem>
                        <WeatherStatCard 
                            value={wind_unit === "kph"? weather.current.wind_kph: weather.current.wind_mph} 
                            label={"Wind"} unit={`${wind_unit === "kph"? "kph": "mph"} (${weather.current.wind_dir})`} 
                        forecast={false}>
                            <FaWind color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem colSpan={{ md: 1, lg: 1 }}>
                        <WeatherStatCard value={precipitation_unit === "mm"? weather.current.precip_mm: weather.current.precip_in} label={"Precipitation"} unit={precipitation_unit === "mm"? "mm" : "inch"} forecast={false}>
                            <IoIosRainy color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem colSpan={{ md: 2, lg: 1 }}>
                        <WeatherStatCard value={weather.current.vis_km} label={"Visibility"} unit={"km"} forecast={false}>
                            <AiOutlineEyeInvisible color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem colSpan={{ md: 2, lg: 1 }}>
                        <WeatherStatCard value={weather.current.uv} label={"UV Index"} unit={""} forecast={false}>
                            <GiRadiations color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem>
                        <WeatherStatCard value={pressure_unit === "inch"? weather.current.pressure_in : weather.current.pressure_mb} label={"Pressure"} unit={pressure_unit === "inch"? "inch" : "mb"} forecast={false}>
                            <FaWeightHanging color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem>
                        <WeatherStatCard value={weather.current.cloud} label={"Clouds"} unit={""} forecast={false}>
                            <IoCloudSharp color={theme.secondColor}/>
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem colSpan={{ md: 2, lg: 1 }}>
                        <WeatherStatCard value={weather.forecast.forecastday[0].astro.sunrise.split(" ")[0]} label={"Sunrise"} unit={"AM"} forecast={false}>
                            <FaSun color={theme.secondColor}/>
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem colSpan={{ md: 2, lg: 1 }}>
                        <WeatherStatCard value={weather.forecast.forecastday[0].astro.sunset.split(" ")[0]} label={"Sunset"} unit={"PM"} forecast={false}>
                            <FiSunset color={theme.secondColor}/>
                        </WeatherStatCard>
                    </GridItem>
                </Grid>
                <Box 
                    h={{ base: "200px", sm: "300px", md: "490px", lg: "500px" }} 
                    w={{ base: "100%", lg: "100%" }} 
                    position="relative" 
                    borderRadius="5px" 
                    overflow="hidden" // optional, prevents text from spilling
                >
                    <Image 
                        src={locationImageResult.image?.urls?.regular || undefined} 
                        h="100%" 
                        w="100%" 
                        objectFit="cover"
                    />

                    {/* This Box must be INSIDE the container Box */}
                    <Box
                        fontSize={{ base: "xl", sm: "2xl", lg: "3xl" }}
                        position="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                        display="flex"
                        alignItems="end"
                        justifyContent="left"
                        color="white"
                        textAlign="center"
                        p={5}
                        
                        bg="rgba(0, 0, 0, 0.4)" // optional dark overlay
                        
                    >
                        <Box fontWeight="bold" display={"flex"} flexDirection={"column"} alignItems={"start"} w={"100%"}>
                            <Text fontWeight={"normal"}>{weather.current.condition.text}</Text>
                            <Text fontSize={{base: "4xl", sm: "70px"}}>{temp_unit === "Celsius (°C)"? weather.current.temp_c.toString().split(".")[0] : weather.current.temp_f.toString().split(".")[0]}{temp_unit === "Celsius (°C)"? "°C" : "°F"}</Text>
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Text>{weather.location.region}</Text>
                                <Text display={{base: "none", md: "block"}} fontWeight={"normal"}>, {weather.location.country}</Text>
                                <Image
                                    src={!isFlagLoading && flag ? flag : undefined}
                                    alt={`${weather.location.country} flag`}
                                    width="auto"
                                    height={{base: "15px", sm: "25px"}}
                                    ml={2}
                                />
                            </Box>
                        </Box>
                        <Box display={"flex"} alignSelf={"end"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                            <Image src={weather.current.condition.icon} height={{base: "50px", sm: "100px"}}/>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </>
    );
}

export default Home;
