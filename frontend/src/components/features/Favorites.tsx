import { Box, Flex, Heading, IconButton, Stack, HStack, SkeletonText, Skeleton } from "@chakra-ui/react"
import MainContext from "../../Contexts/MainContext"
import { useContext } from "react"
import Favorite from "../common/Favorite"
import { FaPlus } from "react-icons/fa"
import useCreateFavorite from "../../hooks/useCreateFavorite"
import { WeatherProps } from "../../types/weather"
import useGetAllFavorite from "../../hooks/useGetAllFavorites"

const Favorites = ({weather, isLoading}: {weather:WeatherProps, isLoading:boolean}) => {
    const { theme, isConnected } = useContext(MainContext)
    const { loading, createFavorite} = useCreateFavorite()
    const { favorites, loading: allFavLoading, getAllFavorites } = useGetAllFavorite()
    
    if ( allFavLoading || loading || isLoading || !weather || !weather.location || !weather.current) {
            return (
                        <Box p={10}>
                            <Stack gap="6" maxW="100%">
                                <HStack width="full">
                                    <SkeletonText noOfLines={4} />
                                </HStack>
                            <Skeleton 
                                height="100%"
                            />
                        </Stack>
                      </Box>
                      )
        }
    
    return (
        <Box>
            {isConnected && 
                <>
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
                            <Favorite
                                key={index}
                                city={favorite.Details.city || ""}
                                country={favorite.Details.country || ""}
                                id={favorite.id}
                                onChange={getAllFavorites} // Pass it here
                        />
                        ))}
                        <IconButton
                            h={{base: "100px", sm: "200px"}}
                            w={{base: "100px", sm: "200px"}}
                            bg={theme.borderColor}
                            borderRadius={"5px"}
                            display={"flex"}
                            onClick={async () => {
                                await createFavorite({ city: weather.location.region, country: weather.location.country })
                                await getAllFavorites()
                            }}
                            justifyContent={"center"}
                            alignItems={"center"}
                            _hover={{
                                background: theme.boxBg, 
                            }}
                        >
                            <FaPlus />  
                        </IconButton>
                    </Flex>
                </>
            }
        </Box>
    )
}

export default Favorites