import { Flex, Box, Heading, Grid, GridItem } from "@chakra-ui/react"
import Container from "../common/Container"
import ForcastCards from "../features/ForcastCards"
import WeatherOverviewPanel from "../features/WeatherOverviewPanel"
import { ThemeProps } from "../../types/theme"
import HourlyWeather from "../features/HourlyWeather"
import NewsSection from "../features/NewsSection"
import MainContext from "../../Contexts/MainContext"
import { useContext, useEffect } from "react"
import useFetchWeatherByLocation from "../../services/useFetchWeatherByLocation"
import { useNavigate, useParams } from "react-router-dom"
import WindyMap from "../features/WindyMap"
import AirQuality from "../features/AirQuality"
import MajorCitiesWeather from "../features/MajorCitiesWeather"
import Favorites from "../features/Favorites"


const MainContent = ({ theme }: ThemeProps) => {

    const { weather, isLoading, userSettingParam } = useContext(MainContext);
    const { location } = useParams();
    const navigate = useNavigate();

    const { searchedWeather, searchedLoading } = useFetchWeatherByLocation(location || "");

    useEffect(() => {
        if (!location && userSettingParam?.location?.option === "manual") {
        const defaultCity = userSettingParam.location.default?.city;
        if (defaultCity) {
            navigate(`/search/${defaultCity}`, { replace: true });
        }
        }
    }, [location, userSettingParam, navigate]);

    const weatherToDisplay = location ? (searchedWeather || weather) : weather;
    const loadingToUse = location ? searchedLoading : isLoading;

    return (
        <>
            <Flex h="100%" w="90vw" paddingInline={15} paddingBlock={10} style={{
                color: theme.color,
                backgroundColor: theme.bg,
                justifyContent: "center",
                textAlign: "justify",
            }}>

                <Flex h={"100%"} w={"100%"} flexDirection={"column"} gap={2}>
                    
                    <Heading>Weather Summary</Heading>
                    <Container>
                        <WeatherOverviewPanel weather={weatherToDisplay} isLoading={loadingToUse} height="850px" />
                    </Container>
                    <Favorites weather={weatherToDisplay} isLoading={loadingToUse} />
                    <Heading mt={3}>Weekly Weather</Heading>
                    <Container>
                        <ForcastCards weather={weatherToDisplay} isLoading={loadingToUse} />
                    </Container>
                    <Heading>Hourly Weather Graph</Heading>
                    <Container><HourlyWeather weather={weatherToDisplay} /></Container>
                    <Grid
                        templateRows={{ base: "repeat(3, auto)", lg: "630px 1fr" }}
                        templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
                        gap={2}
                    >
                    {/* Weather Map */}
                    <GridItem colSpan={{ base: 1, lg: 2 }} h={"fit-content"}>
                        <Heading mb={{base: 0, lg: 4}}>Weather Map</Heading>
                        <WindyMap weather={weatherToDisplay} isLoading={loadingToUse} showDetails={true} showCalendar={true} height={500}/>
                    </GridItem>

                    {/* News Section */}
                    <GridItem 
                        colSpan={{ base: 1, lg: 1 }} 
                        rowSpan={{ base: 1, lg: 2 }}
                        ml={{ base: 0, lg: 2 }}
                    >
                        <Heading mb={{base: 0, lg: 4}}>News Related to Weather</Heading>
                        <NewsSection />
                    </GridItem>

                    {/* Major Cities + Air Quality */}
                    <GridItem 
                        colSpan={{ base: 1, lg: 2 }} 
                        display="flex" 
                        flexDirection={{ base: "column", lg: "row" }} 
                        gap={2}
                    >
                        <Box w={{ base: "100%", lg: "50%" }}>
                        <Heading mb={2}>Weather in Major Cities</Heading>
                        <MajorCitiesWeather />
                        </Box>
                        <Box w={{ base: "100%", lg: "50%" }}>
                        <Heading mb={2}>Air Quality</Heading>
                        <AirQuality weather={weatherToDisplay} isLoading={loadingToUse} />
                        </Box>
                    </GridItem>

                    </Grid>




                </Flex>
            </Flex>
        </>
    );
}

export default MainContent