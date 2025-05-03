import { Box } from '@chakra-ui/react'
import { ContainerProps } from "../../types/componants"
import MainContext from '../../Contexts/MainContext'
import { useContext } from 'react'



const Container: React.FC<ContainerProps> = ({children}) => {
    const {theme} = useContext(MainContext)
    
    return (
        <>
            <Box w="100%" h={"100%"} style={{
                backgroundColor: theme.boxBg,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: "5px",
            }}
            >
                {children}
            </Box>
        </>
    )
}

export default Container