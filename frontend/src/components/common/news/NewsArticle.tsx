import { Box, Heading, Image, Link, Text, HStack, useBreakpointValue } from "@chakra-ui/react"
import { NewsArticleProps } from "../../../types/weather"
import MainContext from "../../../Contexts/MainContext"
import { useContext } from "react"
const NewsArticle = (article: NewsArticleProps) => {
    const {theme} = useContext(MainContext)
    const titleLength = useBreakpointValue({
        base: 50,
        sm: 50,
        md: 20,
        lg: 20,   
        xl: 36,  
      });
    return(
        <Box 
            w={"100%"} 
            h={{base: "400px",sm : "fit-content", lg: "260px"}} 
            borderRadius={"5px"} 
            display={"flex"} 
            flexDirection={{base: "column", sm: "row"}}
            marginBottom={2}
            p={2}
        >
            <Image src={article.image} width={{base: "100%", sm: "70%", lg: "50%"}} h={{base: "60%", sm: "300px", lg: "100%"}} borderRadius={"5px"} mr={2}/>
            <Box width={{base: "100%", md: "80%"}} display={"flex"} flexDirection={"column"} h={{base: "60%", md: "10%", lg: "fit-content"}} p={2}>
                <Heading>
                    <Link 
                        color= {theme.secondColor}
                        href={article.url}
                        fontSize={"20px"}
                    >
                        {
                            article.title.length > titleLength! 
                            ? article.title.slice(0, titleLength) + "..." 
                            : article.title
                        }
                    </Link>
                </Heading>
                <Text mb={2}>{
                    article.content.length > 100! 
                    ? article.content.slice(0, 100) + "..." 
                    : article.content
                }</Text>
                <HStack fontSize={"10px"} color={"gray"} display={"flex"} alignItems={"end"} justifyContent={"start"} h={"100%"}>
                <Text>Source: {article.source}</Text>
                </HStack>
                

            </Box>
        </Box>
    )
}

export default NewsArticle 