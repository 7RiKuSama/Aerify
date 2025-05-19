import { Accordion, Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react"
import Container from "../common/Container"
import { WeatherProps } from "../../types/weather"
import useHourlyWeather from "../../services/useHourlyWeather";
import { useContext, useState } from "react";
import MainContext from "../../Contexts/MainContext";
import { FaWeightHanging, FaWind } from "react-icons/fa";
import { IoMdWater } from "react-icons/io";
import { darkTheme } from "../../theme/themeInstance";
import WindyMap from "./WindyMap";
import NewsSection from "./NewsSection";
import AirQuality from "./AirQuality";
import MajorCitiesWeather from "./MajorCitiesWeather";

const HourlyForecastAccordion = ({ weather, loadingToUse }: { weather: WeatherProps, loadingToUse: boolean }) => {

    const {theme} = useContext(MainContext)

    if ( loadingToUse || !weather || !weather.location || !weather.current) {
            return <Text>Loading...</Text>;  // Display loading state if weather is not available
    }

    const [day, setDay] = useState(0)
    const plotData = useHourlyWeather(weather, day);
    const forecastDays = weather?.forecast?.forecastday;
    
    
    return (
            <Box w={"100%"} h={"100%"}>
                <Flex height={"100px"} gap={4} align={"center"} justify={"start"}>
                    {forecastDays.map((value, index) => (
                        <Link onClick={() => setDay(index)}>
                            <Flex 
                                align={"center"} 
                                bg={theme.boxBg} 
                                h={"fit-content"}
                                color={theme.color}
                                p={3} 
                                pr={5} 
                                justify={"center"} 
                                borderRadius={30}
                                transition={"ease-in-out .2s"}
                                _hover={{
                                    background: darkTheme.boxBg,
                                    color: darkTheme.color
                                }}
                            >
                                <Image src={value?.day.condition?.icon} h={"50px"}/>
                                <Text fontWeight={"bold"}>{value?.date?.toString().split("-")[2]}/{value?.date?.toString().split("-")[1]}</Text>
                            </Flex>
                        </Link>
                    ))}
                </Flex>
                <Flex>
                    <Container>
                        <Flex p={5} gap={6} justify={"space-between"} align={"center"} bg={theme.boxBg}>
                            <Flex direction={"column"}>
                                <Heading>{weather.location.country}</Heading>
                                <Text>{weather.location.name}</Text>
                            </Flex>
                            <Flex align={"center"}>
                                <Heading>Today</Heading>
                                <Flex align={"center"}>
                                    <Image src={weather.forecast.forecastday[0].day.condition.icon}/>
                                    <Flex direction={"column"}>
                                        <Text fontWeight={"bold"} fontSize={"xl"}>{weather.current.condition.text}</Text>
                                        <Text fontWeight={"bold"}>{weather.current.temp_c.toString().split(".")[0]}° | {weather.current.temp_f.toString().split(".")[0]}°</Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Accordion.Root multiple defaultValue={["b"]}>
                        {plotData?.temperature?.length === 24 && hours.map((item, index) => (
                            <Accordion.Item key={index} value={item}>
                            <Accordion.ItemTrigger
                                p={5}
                            >
                                <Flex w={"100%"} align={"center"} justify={"space-between"}>
                                    <Heading>{plotData?.temperature[index]?.name}</Heading>
                                    <Flex
                                        align={"center"}
                                    >
                                        <Image src={plotData?.icon[index]?.uv} />
                                        <Text fontSize={{base: "10px", sm: "sm", md: "lg"}}>{plotData?.condition[index]?.uv}</Text>
                                    </Flex>
                                    <Text fontSize={{base: "10px", sm: "sm", md: "lg"}}>{plotData?.temperature[index]?.uv.toString().split(".")[0]}°C</Text>
                                    <Flex align={"center"} gap={2}>
                                        <IoMdWater color={theme.secondColor} />
                                        <Text fontSize={{base: "10px", sm: "sm", md: "lg"}}>{plotData?.humidity[index]?.uv.toString().split(".")[0]}%</Text>
                                    </Flex>
                                    <Flex align={"center"} gap={2}>
                                        <FaWind color={theme.secondColor} />
                                        <Text fontSize={{base: "10px", sm: "sm", md: "lg"}}>{plotData?.wind[index]?.uv.toString().split(".")[0]} mph</Text>
                                    </Flex>
                                    <Flex align={"center"} gap={2}>
                                        <FaWeightHanging color={theme.secondColor} />
                                        <Text fontSize={{base: "10px", sm: "sm", md: "lg"}}>{plotData?.pressure[index]?.uv.toString().split(".")[0]}</Text>
                                    </Flex>
                                    
                                    

                                </Flex>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent p={5}>
                                <Accordion.ItemBody display={"flex"}>
                                    <Flex justifyContent={"space-between"} w={"100%"}>
                                        <Box>
                                            <Text fontWeight={"bolder"}>Feels Like</Text>
                                            <Text>{plotData?.feelslike_c[index]?.uv.toString().split(".")[0]} °</Text> 
                                        </Box>
                                        <Box>
                                            <Text fontWeight={"bolder"}>Cloud Cover</Text>
                                            <Text>{plotData?.cloud[index]?.uv.toString().split(".")[0]}%</Text> 
                                        </Box>
                                        <Box>
                                            <Text fontWeight={"bolder"}>Pressure</Text>
                                            <Text>{plotData?.pressure[index]?.uv.toString().split(".")[0]}</Text> 
                                        </Box>
                                        <Box>
                                            <Text fontWeight={"bolder"}>Dew Point</Text>
                                            <Text>{plotData?.dewpoint_c[index]?.uv.toString().split(".")[0]} °</Text> 
                                        </Box>
                                        <Box>
                                            <Text fontWeight={"bolder"}>Precipitation</Text>
                                            <Text>{plotData?.precipitation[index]?.uv.toString().split(".")[0]} mm</Text> 
                                        </Box>
                                        <Box>
                                            <Text fontWeight={"bolder"}>UV Index</Text>
                                            <Text>{plotData?.uvIndex[index]?.uv.toString().split(".")[0]} </Text> 
                                        </Box>
                                        
                                    </Flex>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                            </Accordion.Item>
                        ))}
                        </Accordion.Root>
                    </Container>
                    <Flex display={{base: "none", lg: "block"}} w={"50%"} ml={2} h={"100%"}>
                            <Box
                                mb={2}
                                background={"rgb(0, 141, 56)"}
                                borderRadius={5}
                                p={10}
                                color={"rgb(64, 255, 141)"}
                            >
                                <Heading textAlign={"center"}>Hourly Forecast</Heading>
                                <Text>
                                    The Hourly Forecast feature in Aerify gives you a clear, hour-by-hour view of the weather for any selected day. It displays detailed information such as temperature, humidity, wind speed, precipitation, and UV index, helping you understand how conditions will change throughout the day. Whether you're planning a morning run or an evening outing, this feature ensures you stay one step ahead of the weather with timely and accurate insights.
                                </Text>
                            </Box>
                            <WindyMap weather={weather} isLoading={loadingToUse} showDetails={false} showCalendar={false} height={280}/>
                            <Heading marginBlock={2}>Air Quality</Heading>
                            <AirQuality weather={weather} isLoading={loadingToUse} />
                            <Box mb={3}></Box>
                            <MajorCitiesWeather />
                            <Heading marginBlock={2}>Weather News</Heading>
                            <NewsSection />
                        </Flex>
                    </Flex>
            </Box>
    )
}

const hours = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

export default HourlyForecastAccordion