import { useContext } from "react";
import { useParams } from "react-router-dom";
import MainContext from "../../Contexts/MainContext";
import { WeatherProps } from "../../types/weather";
import useFetchWeatherByLocation from "../../services/useFetchWeatherByLocation";
import { Flex, Heading, ThemeProps } from "@chakra-ui/react";
import HourlyWeather from "../features/HourlyWeather";
import Container from "../common/Container";
import HourlyForecastAccordion from "../features/HourlyForecastAccordion";

const HourlyForecast = ( { theme }: {theme: ThemeProps}) => {
    const { weather, isLoading } = useContext(MainContext);
    const { location } = useParams();

    // Fetch the searched weather but only if the location is provided
    const { searchedWeather, searchedLoading } = useFetchWeatherByLocation(location || "");

    let weatherToDisplay: WeatherProps;
    let loadingToUse: boolean;

    if (location) {
        // If there's a location, use the searched weather data and its loading state
        weatherToDisplay = searchedWeather ? searchedWeather : weather;
        loadingToUse = searchedLoading;
    } else {
        // If there's no location, use the general weather data and its loading state
        weatherToDisplay = weather;
        loadingToUse = isLoading;
    }




    return (
        <>
            <Flex h="100%" w="90vw" paddingInline={15} paddingBlock={10} style={{
                color: String(theme.color),
                backgroundColor: String(theme.bg),
                justifyContent: "center",
                textAlign: "justify",
            }}>
                <Flex h={"100%"} w={"100%"} flexDirection={"column"} gap={2}>
                    <Heading>Hourly Weather</Heading>
                    <Container><HourlyWeather weather={weatherToDisplay} /></Container>
                    <HourlyForecastAccordion weather={weatherToDisplay} loadingToUse={loadingToUse}/>
                </Flex>
            </Flex>
        </>
    )
}

export default HourlyForecast