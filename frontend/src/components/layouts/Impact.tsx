import { useContext } from "react";
import { useParams } from "react-router-dom";
import MainContext from "../../Contexts/MainContext";
import { WeatherProps } from "../../types/weather";
import useFetchWeatherByLocation from "../../services/useFetchWeatherByLocation";
import { Flex, Text, Heading, Box, Link, Image} from "@chakra-ui/react";

import Agriculture from "../features/Agriculture";
import Fishing from "../features/Fishing";
import Tourism from "../features/Tourism";
import useCountryFlag from "../../services/useCountryFlag";
import { RxDoubleArrowDown } from "react-icons/rx";

const Impact = () => {
    const { weather, theme} = useContext(MainContext);
    const { location } = useParams();

    // Fetch the searched weather but only if the location is provided
    const { searchedWeather } = useFetchWeatherByLocation(location || "");

    let weatherToDisplay: WeatherProps;
    

    if (location) {
        // If there's a location, use the searched weather data and its loading state
        weatherToDisplay = searchedWeather ? searchedWeather : weather;
    } else {
        // If there's no location, use the general weather data and its loading state
        weatherToDisplay = weather;
    }

    //const {flag, isFlagLoading} = useCountryFlag(weatherToDisplay?.location?.country)
    


    

    return (
        <Flex
            h="fit-content"
            w="90vw"
            paddingInline={15}
            direction={"column"}
            paddingBlock={10}
            style={{
                color: String(theme.color),
                backgroundColor: String(theme.bg),
                justifyContent: "center",
                textAlign: "justify",
                marginTop: "50px"
            }}
        >   
           <Box>
                <Heading textAlign={"center"} fontWeight={"bold"} color={theme.secondColor} fontSize={50} marginBlock={20}>Select a Category to Explore Weather Impact</Heading>
                <Flex gap={5} fontSize={50} marginBottom={"50px"} h={"30vh"} align={"center"}>
                    <Link href={"#agriculture"} h={"50%"} w={"100%"} bg={"rgb(13, 121, 56)"} _hover={{background: "rgb(21, 167, 79)", transition: "ease-in-out .2s"}} color={"rgb(251, 255, 0)"} display={"flex"} alignItems={"center"} justifyContent={"center"} fontWeight={"bold"} borderRadius={"30px"}><Image src="/public/farmer.png" h={"200px"}/>Agriculture</Link>
                    <Link href={"#fishing"} h={"50%"} w={"100%"} bg={"rgb(1, 73, 180)"} _hover={{background: "rgb(6, 89, 214)", transition: "ease-in-out .2s"}} color={"rgb(0, 225, 255)"} display={"flex"} alignItems={"center"} justifyContent={"center"} fontWeight={"bold"} borderRadius={"30px"}><Image src="/public/fisherman.png" h={"200px"} mr={5}/>Fisishing</Link>
                    <Link href={"#tourism"} h={"50%"} w={"100%"} bg={"rgb(156, 31, 31)"} color={"white"} _hover={{background: "rgb(214, 48, 48)", transition: "ease-in-out .2s"}} display={"flex"} alignItems={"center"} justifyContent={"center"} fontWeight={"bold"} borderRadius={"30px"}><Image src="/public/tourist.png" h={"250px"}/>Tourism</Link>
                </Flex>
           </Box>
           <Agriculture weatherToDisplay={weatherToDisplay} />
           <Fishing weatherToDisplay={weatherToDisplay} />
           <Tourism weatherToDisplay={weatherToDisplay} />
        </Flex>
    );
}

export default Impact