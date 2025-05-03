import { Stat, Icon, HStack, Box, Text, Flex } from "@chakra-ui/react";
import React from "react";
import MainContext from "../../../Contexts/MainContext";
import { useContext } from "react";

interface WeatherStatCardProps {
  label: string | null;
  value: string | number | {
    icon: string;
    condition: string;
    minTemp: string;
    avgTemp: string;
    maxTemp: string;
  } | null;
  unit: string | null;
  forecast: boolean;
  children: React.ReactNode | null;
}

const WeatherStatCard: React.FC<WeatherStatCardProps> = ({
  label,
  value,
  unit,
  forecast,
  children
}) => {
  const { theme} = useContext(MainContext);

  const renderForecastContent = () => {
    if (!value || typeof value !== 'object') return null;
    
    return (
      <Flex width="100%" height="100%" justifyContent="center" alignItems={"center"}>
        <Box display="flex" flexDirection="column" justifyContent="center">
            <Flex alignItems="center">
                {
                    value && typeof value === 'object' && value.icon && (
                    <img src={value.icon} style={{ height: "90px" }} alt="Weather icon" />)
                }
                
                <Box>
                <Text fontSize="15px">{value.condition}</Text>
                <Flex>
                    <Text fontSize={{ lg: "50px" }}>{value.avgTemp}</Text>
                    <Text mx={2}>/</Text>
                    <Text color={theme.secondColor}>{value.minTemp}</Text>
                    <Stat.ValueUnit>{unit}</Stat.ValueUnit>
                </Flex>
                </Box>
            </Flex>
          
        </Box>
        <Box ml={{ base: 4, lg: 10 }} display={{base: "block"  ,md: "none", lg: "block" }} >
            {[
                { label: "Average", value: value.avgTemp },
                { label: "Min", value: value.minTemp },
                { label: "Max", value: value.maxTemp }
            ].map((item) => (
                <Text key={item.label} fontWeight="normal">
                {item.label}:{' '}
                <Text as="span" color={theme.secondColor}>
                    {item.value}{unit}
                </Text>
                </Text>
            ))}
        </Box>
      </Flex>
    );
  };

  const renderSimpleContent = () => {
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    return (
      <>
        {value} <Stat.ValueUnit>{unit}</Stat.ValueUnit>
      </>
    );
  };

  return (
    <Stat.Root
      height="100%"
      borderWidth="1px"
      borderRadius="5px"
      padding={2}
      width="100%"
      display="flex"
      gap={forecast ? 5 : undefined}
      border={`1px solid ${theme.borderColor}`}
    >
      {/* Header Section */}
      <HStack
        display="flex"
        justifyContent={forecast ? "center" : "space-between"}
        alignItems="center"
        width="100%"
      >
        <Stat.Label color={theme.secondColor}>{label}</Stat.Label>
        {!forecast && (
          <Icon color="fg.muted" fontSize="15px">
            {children}
          </Icon>
        )}
      </HStack>

      {/* Content Section */}
      <Stat.ValueText
        fontSize={{ base: "14px", sm: "25px" }}
        display="flex"
        justifyContent={forecast ? "center" : "flex-start"}
        alignItems="center"
        alignSelf="center"
        height="100%"
        width="100%"
      >
        {forecast ? renderForecastContent() : renderSimpleContent()}
      </Stat.ValueText>
    </Stat.Root>
  );
};

export default WeatherStatCard;