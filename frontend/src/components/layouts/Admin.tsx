import { Box, Button, Flex, Heading, Input, Spinner } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import MainContext from "../../Contexts/MainContext"
import { FaSearch, FaUser } from "react-icons/fa"
import { PiPlugsConnectedFill } from "react-icons/pi"
import { MdDelete } from "react-icons/md"
import { RiSurveyFill } from "react-icons/ri";
import useGetAllUsers from "../../hooks/useGetAllUsers"
import useDeleteUserByID from "../../hooks/useDeleteUserByID"
import useMemeberCount from "../../hooks/useMemberCount"
import useDeleteCount from "../../hooks/useDeletedCount"
import useConnectedCount from "../../hooks/useGetConnectedCount"
import useConnectionsData from "../../hooks/useGetConnectionsData"
import BarChartCustom from "../common/charts/BarChart"

const Admin = () => {

    const { theme } = useContext(MainContext)
    const [searchInput, setSearchInput] = useState("")
    const { users, loading, getUsers } = useGetAllUsers()
    const { deleteUser } = useDeleteUserByID()
    const members = useMemeberCount()
    const deleted = useDeleteCount()
    const connected = useConnectedCount()
    const connectionData = useConnectionsData()

    useEffect(() => {
        getUsers(searchInput)
    }, [searchInput])

    return (
        <Flex h="100vh" w="90vw" gap={2} direction="column" paddingInline={15} paddingBlock={10} style={{
            color: theme.color,
            backgroundColor: theme.bg,
            alignItems: "center",
            textAlign: "justify",
            
        }}>
            <Flex w={"100%"} h={"250px"} justify={"space-between"}>
                <Box bg={theme.boxBg} w={"33%"} h={"100%"} borderRadius={10} display={"flex"} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                    <FaUser size={"80px"} color={theme.secondColor}/> 
                    <Box ml={2}><Heading mb={2}>Member Count</Heading><Heading fontSize={"6xl"}>{members}</Heading></Box>
                </Box>
                <Box bg={theme.boxBg} w={"33%"} h={"100%"} borderRadius={10} display={"flex"} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                    <PiPlugsConnectedFill size={"80px"} color={theme.secondColor}/> 
                    <Box ml={2}><Heading mb={2}>Conections</Heading><Heading fontSize={"6xl"}>{connected}</Heading></Box>
                </Box>
                <Box bg={theme.boxBg} w={"33%"} h={"100%"} borderRadius={10} display={"flex"} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                    <MdDelete size={"80px"} color={theme.secondColor}/> 
                    <Box ml={2}><Heading mb={2}>Deleted Accounts</Heading><Heading fontSize={"6xl"}>{deleted}</Heading></Box>
                </Box>
            </Flex>
            <Flex p={5} borderRadius={10} w={"100%"} bg={theme.boxBg} h={"100%"} gap={2}>
                <Flex w={"70%"} p={10} borderRadius={10} bg={theme.bg} direction={"column"}>
                    <Heading color={theme.secondColor}>Connections In 30 days</Heading>
                    <BarChartCustom data={Array.isArray(connectionData) ? connectionData : []}/>
                </Flex>
                <Flex w={"30%"} borderRadius={10} bg={theme.boxBg} p={5} direction={"column"}>
                    <Flex justify={"center"} mb={5}>
                        <Flex align={"center"} h={"fit-content"} gap={5}>
                            <FaUser size={"50px"} color={theme.secondColor}/>
                            <Heading fontSize={"4xl"}>User List</Heading>
                        </Flex>
                    </Flex>
                    <Flex h={"100%"} bg={theme.bg} w={"100%"} borderRadius={10} p={2} direction={"column"} gap={2}>
                        <Flex gap={2}>
                            <Input bg={theme.bg} value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}} placeholder="Search for a user" p={2}/>
                            <Button onClick={() => getUsers(searchInput)}><FaSearch /></Button>
                        </Flex>
                        <Flex h={"100%"} bg={theme.boxBg} w={"100%"} borderRadius={10} p={2} direction="column" gap={2}>
                            {!loading && users?.map(({ username, email, id }: { username: string; email: string, id: string }) => (
                                <Flex key={email} align="center" justify="space-between" bg={theme.boxBg} borderRadius={5} p={2}>
                                    <Box>
                                        <Heading size="sm">{username}</Heading>
                                        <Box fontSize="sm">{email}</Box>
                                    </Box>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={async () => {
                                            await deleteUser(id);
                                            await getUsers(searchInput); // optionally keep the current search
                                        }}
                                        ml={2}
                                        _hover={{ background: "red.500" }}
                                    >
                                        <MdDelete />
                                    </Button>
                                </Flex>
                            ))}
                            {loading && <Flex h={"100%"} justify={"center"} align={"center"}>
                                <Spinner size={"lg"}/>
                            </Flex>}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>


        </Flex>
    )
}

export default Admin
