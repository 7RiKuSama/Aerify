import { WeatherProps } from "../../types/weather";
import { Flex, Heading, Text, Box, Image } from "@chakra-ui/react";
import { TbTemperature } from "react-icons/tb";
import { BsCloudRain } from "react-icons/bs";
import { PiWindFill } from "react-icons/pi";
import { WiHumidity } from "react-icons/wi";
import { GoSun } from "react-icons/go";
import AreaChartDashboard from "../common/charts/AreaChartDashboard";
import { FaCameraRetro, FaHiking, FaRegSmileBeam } from "react-icons/fa";
import { MdWarningAmber } from "react-icons/md";


const Tourism = ({weatherToDisplay}: {weatherToDisplay: WeatherProps}) => {
    
    const temperature = parseInt(weatherToDisplay.current?.temp_c.toString().split(".")[0])
    const precipitation = parseInt(weatherToDisplay?.current?.precip_mm.toString())
    const wind = parseInt(weatherToDisplay?.current?.wind_kph.toString())
    const uvIndex = parseInt(weatherToDisplay?.current?.uv.toString())
    const humidity = parseInt(weatherToDisplay?.current?.humidity.toString())
    const cloud = parseInt(weatherToDisplay?.current?.cloud.toString())
    
    // Calculate tourism suitability and comfort scores
    let score = 0;
    let comfort = 100;
    let photoScore = 0;

    const isRisky = precipitation > 10 || wind > 30 || temperature > 35;

    // Scoring for ideal tourism conditions
    if (temperature >= 15 && temperature <= 30) score += 1;
    if (precipitation <= 2) score += 1;
    if (wind <= 20) score += 1;
    if (uvIndex <= 7) score += 1;
    if (cloud >= 30 && cloud <= 70) score += 1;

    // Comfort adjustments
    if (temperature < 10 || temperature > 32) comfort -= 30;
    if (humidity < 30 || humidity > 80) comfort -= 30;
    if (wind > 30) comfort -= 20;

    // Additional scoring for photography/weather enjoyment
    if (cloud < 30) photoScore += 1;
    if (uvIndex <= 5) photoScore += 1;
    if (precipitation === 0) photoScore += 1;




    const options: { label: string; key: string; icon: React.ReactElement }[] = [
        { label: "Temperature", key: "temperature", icon:  <TbTemperature size={20}/>},
        { label: "Humidity", key: "humidity", icon:  <WiHumidity size={20} />},
        { label: "Wind", key: "wind", icon: <PiWindFill size={20} /> },
        { label: "UV Index", key: "uvIndex", icon:  <GoSun size={20} />},
        { label: "Precipitation", key: "precipitation", icon: <BsCloudRain size={20}/>},
      ];

    const colorTxt = "rgb(255, 255, 255)"


    return (
        <Box
                id="tourism"
                bg={"rgb(156, 31, 31)"}
                h={"90vh"} // now 40% of 100vh = visible
                w={"100%"}
                borderRadius={"20px"}
                display={"flex"}
                alignItems={"center"}
                color={colorTxt}
                marginBlock={5}
            >
                <Image src="/public/tourist.png" h={"600px"}/>
                <Flex direction={"column"} mr={5}>
                    <Flex justify={"space-between"} align={"start"}>
                        <Box>
                            <Heading mb={4} fontWeight={"bolder"} fontSize={"40px"}>Today in Tourism</Heading>
                            <Text mb={5} w={"30%"}>Daily weather insights for travelers, hikers, and outdoor enthusiasts, highlighting how temperature, rain, wind, UV index, and cloud cover affect comfort, safety, and activity planning.</Text>
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
                    <Flex gap={5}>
                        <Box
                            border={`1px solid ${colorTxt}`}
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
                            <Heading fontWeight={"bold"} textAlign={"center"}>Outdoor Suitability Score: {score}</Heading>
                            <FaHiking size={60}/>
                            <Text textAlign={"center"}>
                            {
                                score === 5	
                                    ? "☀️ Ideal for all outdoor activities!"
                                    : score === 4
                                        ? "🌤️ Great weather — minor precautions."
                                        : score === 3
                                            ? "🌥️ Fair — check specific conditions."
                                            : score === 2
                                                ? "☁️ Caution — plan for backup options."
                                                : "🌧️ Poor conditions for outdoor plans."
                            }
                            </Text>
                            
                        </Box>

                        <Box
                            border={`1px solid ${colorTxt}`}
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
                            <Heading fontWeight={"bold"} textAlign={"center"}>Comfort Index: {comfort}</Heading>
                            <FaRegSmileBeam size={60}/>
                            <Text textAlign={"center"}>
                            {
                                comfort >= 80 && comfort <= 100
                                    ? "😊 Very comfortable — enjoy your day!"
                                    : comfort >= 60 && comfort <= 79
                                        ? "🙂 Comfortable — may need minor adjustments."
                                        : comfort >= 40 && comfort < 59
                                            ? "😐 Some discomfort — dress accordingly."
                                            : "	😓 Unpleasant — plan shorter or indoor trips."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={`1px solid ${colorTxt}`}
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
                            <Heading fontWeight={"bold"} textAlign={"center"}>Photo Opportunity Score: {photoScore}</Heading>
                            <FaCameraRetro size={60} />
                            <Text textAlign={"center"}>
                            {
                                photoScore === 30
                                    ? "📸 Perfect lighting for photography!"
                                    :  photoScore === 2
                                    ? "🌤️ Decent photo opportunities."
                                    :  photoScore === 1
                                        ? "🌫️ Low visibility or harsh light."
                                        : "🌧️ Poor photo conditions — consider indoor shots."
                            }
                            </Text>
                        </Box>

                        <Box
                            border={`1px solid ${colorTxt}`}
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
                            <Heading fontWeight={"bold"} textAlign={"center"}>Event Risk Flag: {!isRisky? "Safe!" : "Risky!"}</Heading>
                            <MdWarningAmber size={60} />
                            <Text textAlign={"center"}>
                            {
                                !isRisky 
                                    ? "	✅ No major risks for outdoor events."
                                    : "⚠️ Event risk due to weather — check forecast!"
                            }
                            </Text>
                        </Box>
                    </Flex>
                    <AreaChartDashboard weather={weatherToDisplay} color={colorTxt} options={options} />
                </Flex>
            </Box>
    )
}

export default Tourism