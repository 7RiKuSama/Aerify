import { WeatherProps } from "../../types/weather";
import { Flex, Heading, Text, Box, Image } from "@chakra-ui/react";
import { TbTemperature } from "react-icons/tb";
import { BsCloudRain } from "react-icons/bs";
import { PiWindFill } from "react-icons/pi";
import { FaWeightHanging } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import AreaChartDashboard from "../common/charts/AreaChartDashboard";
import { useContext } from "react";
import MainContext from "../../Contexts/MainContext";


const Fishing = ({weatherToDisplay}: {weatherToDisplay: WeatherProps}) => {
    
    const {userSettingParam} = useContext(MainContext)
    
    const temp_unit = userSettingParam?.settings?.data[0]?.value
    const wind_unit = userSettingParam?.settings?.data[1]?.value
    const precipitation_unit = userSettingParam?.settings?.data[3]?.value
    const pressure_unit = userSettingParam?.settings?.data[2]?.value


    const temperature = parseInt(temp_unit === "Celsius (°C)" ? weatherToDisplay?.current?.temp_c.toString() : weatherToDisplay?.current?.temp_f.toString())
    const precipitation = parseInt(precipitation_unit === "mm" ? weatherToDisplay?.current?.precip_mm.toString() : weatherToDisplay?.current?.precip_in.toString())
    const wind = parseInt(wind_unit === "kph" ? weatherToDisplay?.current?.wind_kph.toString() : weatherToDisplay?.current?.wind_mph.toString())
    const uvIndex = parseInt(weatherToDisplay?.current?.uv.toString())
    const pressure = parseInt(pressure_unit === "mb" ? weatherToDisplay?.current?.pressure_mb.toString() : weatherToDisplay?.current?.pressure_in.toString())

    
    
    
    
    
   

    const options: { label: string; key: string; icon: React.ReactElement }[] = [
            { label: "Temperature", key: "temperature", icon:  <TbTemperature size={20}/>},
            { label: "Pressure", key: "pressure", icon:  <FaWeightHanging size={20} />},
            { label: "Wind", key: "wind", icon: <PiWindFill size={20} /> },
            { label: "UV Index", key: "uvIndex", icon:  <GoSun size={20} />},
            { label: "Precipitation", key: "precipitation", icon: <BsCloudRain size={20}/>},
          ];
    
    return (
        <Box
                id="fishing"
                bg={"rgb(1, 73, 180)"}
                h={"90vh"} // now 40% of 100vh = visible
                w={"100%"}
                borderRadius={"20px"}
                display={"flex"}
                flexDirection={"row-reverse"}
                marginBlock={5}
                alignItems={"center"}
                color={"rgb(0, 225, 255)"}
                padding={5}
            >
                <Image src="/public/fisherman.png" h={"400px"} alignSelf={"end"}/>
                <Flex direction={"column"}>
                    <Flex justify={"space-between"} align={"start"}>
                        <Box>
                        <Heading mb={4} fontWeight={"bolder"} fontSize={"40px"}>Today in Fishing</Heading>
                        <Text mb={5} w={"30%"}>
                            Daily weather insights for anglers, highlighting how temperature, wind, rain, pressure, and sunlight affect fish behavior, depth, and feeding patterns.
                        </Text>
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
                            border={"1px solid rgb(0, 225, 255)"}
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
                            <TbTemperature 
                                size={80}
                            />
                            <Text textAlign={"center"}>
                            {
                                temperature < 10
                                    ? "Water is cold – fish are likely sluggish and deeper."
                                    : temperature >= 10 && temperature < 25
                                        ? "Comfortable water temps – fish are likely active."
                                        : "Hot conditions – fish may seek deeper, cooler areas."
                            }
                            </Text>
                            
                        </Box>

                        <Box
                            border={"1px solid rgb(0, 225, 255)"}
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
                            <Heading fontWeight={"bold"}>Rainfall: {precipitation} {precipitation_unit}</Heading>
                            <BsCloudRain size={80} />
                            <Text textAlign={"center"}>
                            {
                                precipitation === 0
                                    ? "Dry conditions – normal fish patterns."
                                    : precipitation > 0 && temperature < 2
                                        ? "Light rain – fish may roam away from cover."
                                        : "Heavy rain – fish likely retreat to deeper waters."
                                            
                            }
                            </Text>
                        </Box>

                        <Box
                            border={"1px solid rgb(0, 225, 255)"}
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
                                wind < 10
                                    ? "Calm conditions – great for boat fishing and casting."
                                    : wind > 15  && wind <= 25
                                        ? "Moderate breeze – fish may be near structure."
                                        : "Strong wind – rough waters, fish may be deeper."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={"1px solid rgb(0, 225, 255)"}
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
                            <Heading fontWeight={"bold"}>Pressure: {pressure} {pressure_unit}</Heading>
                            <FaWeightHanging size={80} color={"rgb(0, 225, 255)"}/>
                            <Text textAlign={"center"}>
                            {
                                pressure < 1005
                                    ? "Falling pressure — fish may be inactive or deeper."
                                    : pressure >= 1005  && pressure <= 1015
                                        ? "Stable pressure — consistent fish behavior."
                                        : "Rising pressure — fish feeding actively."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={"1px solid rgb(0, 225, 255)"}
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
                                    ? "Low sunlight — fish may surface more."
                                    : wind >= 3  && wind <= 5
                                        ? "Moderate light — balanced surface and depth activity."
                                    : wind >= 6  && wind <= 8
                                        ? "High UV — fish prefer shaded spots or deeper waters."
                                        : "	Intense sun — fish are likely deep and near cover."
                            }
                            </Text>
                        </Box>
                    </Flex>
                    <AreaChartDashboard weather={weatherToDisplay} options={options} color="rgb(0, 225, 255)" />
                </Flex>
                
            </Box>
    )
}

export default Fishing