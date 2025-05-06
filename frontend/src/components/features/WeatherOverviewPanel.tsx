import { Grid, GridItem, Flex, Text, Box, Image } from "@chakra-ui/react"

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
    
    const { theme, unit } = useContext(MainContext);
    // Add a check to ensure `weather` and `weather.current` exist
    if ( isLoading || !weather || !weather.location || !weather.current) {
        return <Text>Loading...</Text>;  // Display loading state if weather is not available
    }
    const locationImageResult = useLocationImage(weather.location.country)
    const {flag, isFlagLoading} = useCountryFlag(weather.location.country)
    
    if (locationImageResult.imageLoading ) {
        return <Text>Loading...</Text>;
    }
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
                        <WeatherStatCard value={weather.current.temp_c} label={"Temperature"} unit={"C"} forecast={false}>
                            <FaTemperatureEmpty color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem>
                        <WeatherStatCard value={weather.current.humidity} label={"Humidity"} unit={"%"} forecast={false}>
                            <IoMdWater color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem>
                        <WeatherStatCard value={weather.current.wind_kph} label={"Wind"} unit={`kph (${weather.current.wind_dir})`} forecast={false}>
                            <FaWind color={theme.secondColor} />
                        </WeatherStatCard>
                    </GridItem>
                    <GridItem colSpan={{ md: 1, lg: 1 }}>
                        <WeatherStatCard value={weather.current.precip_mm} label={"Precipitation"} unit={"mm"} forecast={false}>
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
                        <WeatherStatCard value={weather.current.pressure_mb} label={"Pressure"} unit={"mb"} forecast={false}>
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
                            <Text fontSize={{base: "4xl", sm: "70px"}}>{weather.current.temp_c.toString().split(".")[0]}°{unit}</Text>
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Text>{weather.location.name}</Text>
                                <Text display={{base: "none", md: "block"}} fontWeight={"normal"}>, {weather.location.country}</Text>
                                <Image
                                    src={!isFlagLoading && flag ? flag : ""}
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
