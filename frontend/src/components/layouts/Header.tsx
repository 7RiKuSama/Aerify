import { Provider } from '../ui/provider';
import { 
    IconButton,
    Menu, 
    Box, 
    Flex,
    HStack, 
    Link, 
    Avatar,
    Image,
    VStack,
    Portal
} from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa';
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { useState, useContext, useEffect } from "react";
import "../../styles/App.css"
import { HeaderProps } from "../../types/header"
import { lightTheme, darkTheme } from '../../theme/themeInstance';
import SearchInput from '../common/SearchInput';
import TypeHead from '../common/TypeHead';
import MainContext from '../../Contexts/MainContext';
import { IoMdSettings } from 'react-icons/io';
import { LuChevronRight } from 'react-icons/lu';
import { IoLogInOutline } from 'react-icons/io5';

const Header = (props: HeaderProps) => {

    const {searchText, userInfo, userInfoLoading, unit, setUnit} = useContext(MainContext)
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      if (!userInfoLoading && userInfo?.isConnected === true) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }, [userInfoLoading, userInfo]);    
    
    
    return <>
        <Provider>
            <header>
                <Box bg="rgb(29, 30, 38)" h="100%" color="white" style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "65px",
                    width: "100%",
                    zIndex: 1000,
                }}>
                    <Flex
                        gap={0}
                        alignItems="center"
                        justify="space-between"
                        h={"100%"}
                    >
                        <HStack>
                            <IconButton id="navbar-btn" bg={"none"} ml={2} onClick={() => props.setDrawerOpen(!props.drawerOpen)} display={{sm: "block", md: "none"}}>
                                <FaBars color="white" />
                            </IconButton>
                            <Link ml={3}>
                                <Image 
                                    src="../../../public/aerify_logo.png" 
                                    w={"40px"}
                                    display={{
                                        base: "none",
                                        sm: "block"
                                    }}
                                />
                                <Image 
                                    src="../../../public/aerify_logo_text.png" 
                                    w={"50px"}
                                    display={{
                                        base: "none",
                                        md: "block"
                                    }}
                                />
                            </Link>
                                <Box w={"300px"} display={{base: "none", md: "block"}} fontSize={{base: "10px", sm: "12px"}} ml={{md: "20px"}}>
                                    <nav>
                                        <div className="nav-container">
                                            <Link variant="plain" className="nav-link transitioned" href='/dashboard'>Dashboard</Link>
                                            <Link variant="plain" className="nav-link transitioned">Features</Link>
                                            <Link variant="plain" className="nav-link transitioned">About</Link>
                                            <Link variant="plain" className="nav-link transitioned" href='/contact'>Contact</Link>
                                        </div>
                                    </nav>
                            </Box>
                        </HStack>
                        <VStack w={{base: "100%", sm:"45%", lg:"60%"}} position={"relative"}>
                            <SearchInput width="100%"></SearchInput>
                            {searchText && <TypeHead />}
                        </VStack>
                        <HStack mr={{base: 1, sm: 4}}>
                        <IconButton
                            variant="plain"
                            onClick={() =>
                                props.setTheme({
                                bg: props.theme.isEnabled ? lightTheme.bg: darkTheme.bg,
                                color: props.theme.isEnabled ? lightTheme.color : darkTheme.color,
                                boxColor: props.theme ? lightTheme.boxColor: darkTheme.borderColor,
                                boxBg: props.theme.isEnabled ? lightTheme.boxBg : "rgba(0, 0, 0, 0.2)",
                                borderColor: props.theme.isEnabled ? lightTheme.borderColor : darkTheme.borderColor,
                                secondColor: props.theme.isEnabled ? lightTheme.secondColor : darkTheme.secondColor,
                                isEnabled: !props.theme.isEnabled,
                                })
                            }
                            >
                            {props.theme.isEnabled ? <MdDarkMode color="#4d98fa"/> : <MdOutlineDarkMode color="#4d98fa"/>}
                            </IconButton>
                            <Box
                                display={{ base: "none", sm: "block" }}
                            >
                                {!isConnected && 
                                    <>
                                        <Link className="button transitioned" textAlign={"center"} href={"/signIn"}>Sign In</Link>
                                    </>
                                }

                                {
                                    isConnected && (
                                        <>
                                            <Menu.Root>
                                                <Menu.Trigger>
                                                    <Avatar.Root colorPalette={"blue"}>
                                                        <Avatar.Fallback name={userInfo?.username} />
                                                    </Avatar.Root>
                                                </Menu.Trigger>
                                                <Portal>
                                                    <Menu.Positioner>
                                                        <Menu.Content p={1}>
        
                                                            <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                                                                <Menu.TriggerItem>
                                                                    Temperature Unit <LuChevronRight />
                                                                </Menu.TriggerItem>
                                                                <Portal>
                                                                    <Menu.Positioner>
                                                                        <Menu.Content p={4}>
                                                                            <Menu.RadioItemGroup
                                                                                value={unit}
                                                                                onValueChange={(e) => setUnit(e.value)}
                                                                            >
                                                                                <Menu.RadioItem key="temp" value="C">
                                                                                    Celcius (°C)
                                                                                    <Menu.ItemIndicator />
                                                                                </Menu.RadioItem>
                                                                                <Menu.RadioItem key="temp" value="F">
                                                                                    Fahrenheit (°F)
                                                                                    <Menu.ItemIndicator />
                                                                                </Menu.RadioItem>
                                                                            </Menu.RadioItemGroup>
                                                                        </Menu.Content>
                                                                    </Menu.Positioner>
                                                                </Portal>
                                                            </Menu.Root>
                                                            <Menu.Item value='settings' asChild>
                                                                <Box>
                                                                    <IoMdSettings /> 
                                                                    <a href="/settings">Settings</a>
                                                                </Box>
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                value="delete"
                                                                color="fg.error"
                                                                _hover={{ bg: "bg.error", color: "fg.error" }}
                                                            >
                                                            <IoLogInOutline />
                                                            Log out
                                                            </Menu.Item>
                                                        </Menu.Content>
                                                    </Menu.Positioner>
                                                </Portal>
                                            </Menu.Root>
                                        </>
                                    )
                                }
                            </Box>
                            
                        </HStack>
                    </Flex>
                </Box>
            </header>
        </Provider>
    </>
}


export default Header