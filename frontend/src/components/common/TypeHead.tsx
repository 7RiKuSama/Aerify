import { useContext, useEffect, useState } from "react";
import MainContext from "../../Contexts/MainContext";
import { Flex, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { Colors, darkTheme } from "../../theme/themeInstance";
import { Suggestion } from "../../types/weather";
import { useLocation } from "react-router-dom";

const TypeHead = () => {
    const { theme, suggestions } = useContext(MainContext)
    const location = useLocation()
    const [whereToGo, setWhereToGo] = useState("search")

    
    useEffect(() => {
        if (location.pathname.startsWith("/hourly")) {
            setWhereToGo("hourly");
        } else {
            setWhereToGo("search");
        }
    }, [location.pathname]);
    
    return (
        <Flex 
            w={"100%"}
            flexDirection={"row"}
            bg= {darkTheme.bg}
            border= {`1px solid ${darkTheme.borderColor}`}
            borderRadius= "10px"
            borderTop={"0px"}
            borderTopRadius={"0px"}
            position={"absolute"}
            top={"40px"}
            left={"0"}
            h={"fit-content"}
            maxHeight={"400px"}
            overflowY={"scroll"}
        >
            <ul
                style={{
                    listStyle: "none",
                    fontSize: "0.9rem",
                    width: "100%",
                }}
            >
                {
                    suggestions.map((value: Suggestion) => <li
                        key={value.country} 
                        style={{
                            display: "flex", 
                            alignItems: "center"
                        }}>
                                <Box
                                    
                                    width= "100%"
                                    color={darkTheme.secondColor}
                                    _hover={{
                                        backgroundColor: theme.isEnabled ? theme.borderColor : Colors.hoverLight,
                                        textDecoration: "none", 
                                        color: Colors.hoverText
                                    }}
                                >
                                    <Link 
                                        to={`/${whereToGo}/${encodeURIComponent(
                                            value.city ?? value.state ?? value.province ?? value.country ?? ""
                                        )}`}
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            padding: "10px",
                                            paddingLeft: "10px",
                                        }}
                                    >
                                        <LuSearch style={{marginRight: ".5em"}}/>
                                        {value.formatted}
                                    </Link>
                                </Box>
                            </li>)
                }
            </ul>
        </Flex>
    )
}

export default TypeHead;