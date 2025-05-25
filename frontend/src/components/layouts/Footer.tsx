import { Box, Flex, Image, Link, Text } from '@chakra-ui/react'
import { Colors, darkTheme } from '../../theme/themeInstance'

const Footer = () => {
    return <>
        <Flex 
            h={"250px"}
            w={"100%"}
            bg={Colors.footer}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            gap={15}
        >
            <Box>
                <Flex gap={2} justifyContent={"center"}>
                    <Image src="../../../public/aerify_logo.png" height={"70px"}/>
                    <Image src="../../../public/aerify_logo_text.png" height={"70px"}/>
                </Flex>
                <Text color={darkTheme.secondColor}>© 2025 Aerify. All rights reserved.</Text>
            </Box>
            <Box>
                <div className="nav-container" style={{fontSize: "20px"}}>
                    <Link variant="plain" className="nav-link transitioned" href='/dashboard'>Dashboard</Link>
                    <Link variant="plain" className="nav-link transitioned" href='/hourly'>Hourly</Link>
                    <Link variant="plain" className="nav-link transitioned" href='/impact'>Impact</Link>
                    <Link variant="plain" className="nav-link transitioned" href='/contact'>Contact</Link>
                </div>
            </Box>
            <Box></Box>
        </Flex>
    </>
}


export default Footer