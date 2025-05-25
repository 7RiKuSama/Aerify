import { WeatherProps } from "../../types/weather";
import { Flex, Heading, Text, Box, Image } from "@chakra-ui/react";
import { TbTemperature } from "react-icons/tb";
import { BsCloudRain } from "react-icons/bs";
import { PiWindFill } from "react-icons/pi";
import { WiHumidity } from "react-icons/wi";
import { GoSun } from "react-icons/go";
import AreaChartDashboard from "../common/charts/AreaChartDashboard";
import { useContext } from "react";
import MainContext from "../../Contexts/MainContext";


const Agriculture = ({weatherToDisplay}: {weatherToDisplay: WeatherProps}) => {
    
    const {userSettingParam} = useContext(MainContext)

    if (!userSettingParam) {
        return <p>Loading...</p>
    }
    
    const temp_unit = userSettingParam?.settings?.data[0]?.value
    const wind_unit = userSettingParam?.settings?.data[1]?.value
    const precipitation_unit = userSettingParam?.settings?.data[3]?.value
    
    const temperature = parseInt(temp_unit === "Celsius (°C)" ? weatherToDisplay?.current?.temp_c.toString() : weatherToDisplay?.current?.temp_f.toString())
    const precipitation = parseInt(precipitation_unit === "mm" ? weatherToDisplay?.current?.precip_mm.toString() : weatherToDisplay?.current?.precip_in.toString())
    const wind = parseInt(wind_unit === "kph" ? weatherToDisplay?.current?.wind_kph.toString() : weatherToDisplay?.current?.wind_mph.toString())
    const uvIndex = parseInt(weatherToDisplay?.current?.uv.toString())
    const humidity = parseInt(weatherToDisplay?.current?.humidity.toString())

    
    
    
    const options: { label: string; key: string; icon: React.ReactElement }[] = [
        { label: "Temperature", key: "temperature", icon:  <TbTemperature size={20}/>},
        { label: "Humidity", key: "humidity", icon:  <WiHumidity size={20} />},
        { label: "Wind", key: "wind", icon: <PiWindFill size={20} /> },
        { label: "UV Index", key: "uvIndex", icon:  <GoSun size={20} />},
        { label: "Precipitation", key: "precipitation", icon: <BsCloudRain size={20}/>},
      ];


    return (
        <Box
                id="agriculture"
                bg={"rgb(13, 121, 56)"}
                h={"90vh"} // now 40% of 100vh = visible
                w={"100%"}
                borderRadius={"20px"}
                display={"flex"}
                alignItems={"center"}
                color={"rgb(251, 255, 0)"}
                marginBlock={5}
            >
                <p>{temperature}</p>
                <Image src="/public/farmer.png" h={"500px"}/>
                <Flex direction={"column"}>
                    <Flex justify={"space-between"} align={"start"}>
                        <Box>
                            <Heading mb={4} fontWeight={"bolder"} fontSize={"40px"}>Today in Agriculture in {weatherToDisplay?.location?.region}</Heading>
                            <Text mb={5} w={"30%"}>Daily weather insights for farmers and gardeners, with tips on how temperature, rain, humidity, wind, and sunlight impact crop health and growth.</Text>
                        </Box>
                        <Flex align={"center"}>
                                <Heading>Today</Heading>
                                <Flex align={"center"}>
                                    <Image src={weatherToDisplay?.forecast?.forecastday[0]?.day?.condition?.icon}/>
                                    <Flex direction={"column"}>
                                        <Text fontWeight={"bold"} fontSize={"xl"}>{weatherToDisplay?.current?.condition?.text}</Text>
                                        <Text fontWeight={"bold"}>{temperature}°</Text>
                                    </Flex>
                                </Flex>
                        </Flex>
                    </Flex>
                    <Flex gap={2} justify={"space-between"}>
                        <Box
                            border={"1px solid rgba(251, 255, 0, 0.66)"}
                            h={"200px"}
                            w={"200px"}
                            borderRadius={10}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            bg={"#17222b"}
                            p={2}
                        >
                            <Heading fontWeight={"bold"} textAlign={"center"} fontSize={"md"}>Temperature: {temperature} {temp_unit  === "Celsius (°C)" ? "°C" : "°F"}</Heading>
                            <TbTemperature size={80}/>
                            <Text textAlign={"center"}>
                            {
                                temperature < 5
                                    ? "Frost risk! Protect sensitive crops."
                                    : temperature >= 5 && temperature < 15
                                        ? "Cool day — good for leafy greens and cool-weather crops."
                                        : temperature >= 15 && temperature <= 30
                                            ? "Ideal growing conditions for most summer crops."
                                            : temperature >= 30 && temperature <= 35
                                                ? "Warm day — monitor soil moisture, avoid heat stress."
                                                : "High heat may stress crops like lettuce and spinach."
                            }
                            </Text>
                            
                        </Box>

                        <Box
                            border={"1px solid rgba(251, 255, 0, 0.66)"}
                            h={"200px"}
                            w={"200px"}
                            borderRadius={10}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            bg={"#17222b"}
                            p={2}
                        >
                            <Heading fontWeight={"bold"} fontSize={"md"}>Rainfall: {precipitation} {precipitation_unit}</Heading>
                            <BsCloudRain size={80}/>
                            <Text textAlign={"center"}>
                            {
                                precipitation === 0
                                    ? "No rainfall. Irrigation needed if soil moisture is low."
                                    : precipitation > 0 && temperature <= 2
                                        ? "Light rain — dry spell. Consider irrigation for root crops."
                                        : precipitation > 2 && precipitation <= 10
                                            ? "Moderate rainfall — monitor waterlogging and drainage."
                                            : "Heavy rain — hold off irrigation and fertilizer application."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={"1px solid rgba(251, 255, 0, 0.66)"}
                            h={"200px"}
                            w={"200px"}
                            borderRadius={10}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            bg={"#17222b"}
                            p={2}
                        >
                            <Heading fontWeight={"bold"}>Wind: {wind} {wind_unit}</Heading>
                            <PiWindFill size={80} />
                            <Text textAlign={"center"}>
                            {
                                wind <= 15
                                    ? "Calm conditions — good for spraying and fieldwork."
                                    : wind > 15  && wind <= 30
                                        ? "Moderate wind — caution with pesticide spraying."
                                        : "Strong winds — avoid spraying today, protect sensitive crops."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={"1px solid rgba(251, 255, 0, 0.66)"}
                            h={"200px"}
                            w={"200px"}
                            borderRadius={10}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            bg={"#17222b"}
                            p={2}
                        >
                            <Heading fontWeight={"bold"}>humidity: {humidity}%</Heading>
                            <WiHumidity size={80} />
                            <Text textAlign={"center"}>
                            {
                                humidity < 40
                                    ? "Dry air — may affect crop flowering and pollination."
                                    : wind >= 40  && wind <= 80
                                        ? "Optimal humidity for most crops."
                                        : "High humidity — mildew and fungal disease risk is elevated."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={"1px solid rgba(251, 255, 0, 0.66)"}
                            h={"200px"}
                            w={"200px"}
                            borderRadius={10}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            bg={"#17222b"}
                            p={2}
                        >
                            <Heading fontWeight={"bold"}>UV Index: {uvIndex}</Heading>
                            <GoSun size={80} />
                            <Text textAlign={"center"}>
                            {
                                uvIndex <= 2
                                    ? "	Low UV — minimal risk to crops and workers."
                                    : wind >= 3  && wind <= 5
                                        ? "Moderate UV — some protection recommended."
                                    : wind >= 6  && wind <= 7
                                        ? "High UV — protect crops and workers, reduce outdoor exposure."
                                        : "Very high UV — shade required for nursery plants and workers."
                            }
                            </Text>
                        </Box>
                    </Flex>
                    <AreaChartDashboard weather={weatherToDisplay} color={"rgb(251, 255, 0)"} options={options} />
                </Flex>
            </Box>
    )
}

export default Agriculture