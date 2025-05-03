import { Box, Flex, Text } from "@chakra-ui/react";
import MainContext from "../../Contexts/MainContext";
import { useContext } from "react";
import { WeatherProps } from "../../types/weather";

// Importing necessary icons
import { GiPoisonGas, GiVolcano, GiDesert } from "react-icons/gi";
import { FaIndustry, FaGlobeAmericas } from "react-icons/fa";
import { WiDust } from "react-icons/wi";
import { BiTestTube } from "react-icons/bi";
import { TbFlag } from "react-icons/tb";

const AirQuality = ({ weather, isLoading }: { weather: WeatherProps; isLoading: boolean }) => {
  const { theme } = useContext(MainContext);

  if (isLoading || !weather?.current || !weather?.current?.air_quality) {
    return <Text>Loading...</Text>;
  }

  // Mapping each air quality metric to its label, unit, and icon
  const AirQualityList = [
    { key: "us-epa-index", label: "AQI (EPA)", unit: "", icon: <BiTestTube /> },
    { key: "gb-defra-index", label: "AQI (UK DEFRA)", unit: "", icon: <TbFlag /> },
    { key: "co", label: "Carbon Monoxide (CO)", unit: "ppb", icon: <GiPoisonGas /> },
    { key: "no2", label: "Nitrogen Dioxide (NO₂)", unit: "ppb", icon: <FaIndustry /> },
    { key: "o3", label: "Ozone (O₃)", unit: "ppb", icon: <FaGlobeAmericas /> },
    { key: "so2", label: "Sulfur Dioxide (SO₂)", unit: "ppb", icon: <GiVolcano /> },
    { key: "pm2_5", label: "PM2.5", unit: "µg/m³", icon: <WiDust /> },
    { key: "pm10", label: "PM10", unit: "µg/m³", icon: <GiDesert /> },
  ];

  return (
    <Box
        w="100%"
        bg={theme.boxBg}
        borderRadius="5px"
        border={`1px solid ${theme.borderColor}`}
        p={3}
        display="flex"
        flexDirection="column"
        gap={2}
        >
        {AirQualityList.map(({ key, label, unit, icon }) => (
            <Flex
            key={key}
            align="center"
            p={1}
            borderRadius="5px"
            _hover={{ bg: theme.hoverBg, transition: "0.3s" }}
            >
            {/* Icon */}
            <Box as="span" mr={2} fontSize="30px" color={theme.secondColor}>
                {icon}
            </Box>

            {/* Label + Value */}
            <Flex direction="column" flex="1">
                <Text fontSize="14px" fontWeight="semibold" color={theme.textColor}>
                {label}
                </Text>
                <Text fontSize="10px" color={theme.subTextColor}>
                {weather.current.air_quality[key as keyof typeof weather.current.air_quality]} {unit}
                </Text>
            </Flex>
            </Flex>
        ))}
        </Box>
  );
};

export default AirQuality;
