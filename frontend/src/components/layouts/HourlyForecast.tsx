import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainContext from "../../Contexts/MainContext";
import { WeatherProps } from "../../types/weather";
import useFetchWeatherByLocation from "../../services/useFetchWeatherByLocation";
import { Flex, Heading, ThemeProps } from "@chakra-ui/react";
import HourlyWeather from "../features/HourlyWeather";
import Container from "../common/Container";
import HourlyForecastAccordion from "../features/HourlyForecastAccordion";

const HourlyForecast = ( { theme }: {theme: ThemeProps}) => {
    const { weather, isLoading, userSettingParam } = useContext(MainContext);
    const { location } = useParams();
    const navigate = useNavigate();

    const { searchedWeather, searchedLoading } = useFetchWeatherByLocation(location || "");

    useEffect(() => {
        if (!location && userSettingParam?.location?.option === "manual") {
        const defaultCity = userSettingParam.location.default?.city;
        if (defaultCity) {
            navigate(`/hourly/${defaultCity}`, { replace: true });
        }
        }
    }, [location, userSettingParam, navigate]);

    const weatherToDisplay = location ? (searchedWeather || weather) : weather;
    const loadingToUse = location ? searchedLoading : isLoading;



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