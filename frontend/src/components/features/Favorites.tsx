import { Box, Text, Flex, Heading, IconButton } from "@chakra-ui/react"
import MainContext from "../../Contexts/MainContext"
import { useContext } from "react"
import Favorite from "../common/Favorite"
import { FaPlus } from "react-icons/fa"
import useCreateFavorite from "../../hooks/useCreateFavorite"
import { WeatherProps } from "../../types/weather"
import useGetAllFavorite from "../../hooks/useGetAllFavorites"

const Favorites = ({weather, isLoading}: {weather:WeatherProps, isLoading:boolean}) => {
    const { theme } = useContext(MainContext)
    const { loading, createFavorite} = useCreateFavorite()
    const { favorites, loading:allFavLoading } = useGetAllFavorite()
    
    if ( allFavLoading || loading || isLoading || !weather || !weather.location || !weather.current) {
            return <Text>Loading...</Text>;  // Display loading state if weather is not available
        }
    
    return (
        <Box>
            <Heading>Favorites</Heading>
            <Flex
                w={"100%"}
                direction={"row"}
                h={"fit-content"}
                bg={theme.border}
                paddingBlock={2}
                overflowY={"hidden"}
                overflowX={"auto"}
            >
                {favorites?.map((favorite, index) => (
                    <Favorite key={index} city={favorite.Details.city || ""} country={favorite.Details.country || ""} id={favorite.id} />
                ))}
                <IconButton
                    h={{base: "100px", sm: "200px"}}
                    w={{base: "100px", sm: "200px"}}
                    bg={theme.borderColor}
                    borderRadius={"5px"}
                    display={"flex"}
                    onClick={() => createFavorite({city: weather.location.name, country: weather.location.country})}
                    justifyContent={"center"}
                    alignItems={"center"}
                    _hover={{
                        background: theme.boxBg, 
                    }}
                >
                    <FaPlus />  
                </IconButton>
            </Flex>
        </Box>
    )
}

export default Favorites