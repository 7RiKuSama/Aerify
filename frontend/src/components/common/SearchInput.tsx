import { Input, Box, InputGroup, CloseButton, Image } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { useContext, useRef } from "react"
import MainContext from "../../Contexts/MainContext"
import { Colors, darkTheme } from "../../theme/themeInstance"


const SearchInput = ({ width }: { width: string}) => {

    const { theme, searchText, setSearchText } = useContext(MainContext)
    const inputRef = useRef<HTMLInputElement | null>(null)
    return (
    <>
        <InputGroup width={{base: "100%", sm: width}}>
            <>
                {/* Icon with proper spacing */}
                <Box 
                    position="absolute" 
                    left="10px" 
                    top="50%" 
                    transform="translateY(-50%)" 
                    zIndex={3}
                    color="gray.500"
                    pointerEvents="none"
                >
                    <Image src="../../../public/aerify_logo.png" w={"25px"} display={{ base: "block", sm: "none" }}/>
                    <Box display={{base: "none", sm: "block"}}><LuSearch size={16} color={theme.secondColor}/></Box>
                </Box>
                <Box 
                    position="absolute" 
                    right="10px" 
                    top="50%" 
                    transform="translateY(-50%)" 
                    zIndex={3}
                    color="gray.500"
                >
                    {
                        searchText ? (
                            <CloseButton
                                size="xs"
                                color={Colors.danger}
                                onClick={() => {
                                setSearchText("")
                                inputRef.current?.focus()
                                }}
                                me="-2"
                            />
                            ) : undefined
                    }
                </Box>
                <Input
                    ref={inputRef} 
                    onChange={(e) => {
                        setSearchText(e.target.value)
                    }}
                    bg={darkTheme.boxBg}
                    value={searchText}
                    border={`1px solid ${darkTheme.borderColor}`}
                    borderRadius="10px"
                    pl="45px" // Adjust based on icon size + desired spacing
                    placeholder="Search for a location..."
                    _placeholder={{color: darkTheme.borderColor}}
                    style={searchText? {borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"} : undefined}
                    color={darkTheme.boxColor}
                />
            </>
        </InputGroup>
    </>
    )
}

export default SearchInput