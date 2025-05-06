import { Flex, Input, Link, SegmentGroup, Switch, Tabs, Text, useBreakpointValue } from "@chakra-ui/react"
import { FaUserAlt } from "react-icons/fa";
import { useContext, useState } from "react";
import MainContext from "../../Contexts/MainContext";
import { SiAccuweather } from "react-icons/si";
import { UserSettingsProps } from "../../types/user";
import { PasswordInput } from "../ui/password-input";

const Settings = () => {
    const { theme } = useContext(MainContext)
    const [userSettingParam, setSettingParam] = useState<UserSettingsProps>({
        email: {
            state: false,
            value: "example@gmail.com"
        },
        password: {
            state: false
        },
        notification: {
            state: false
        },
        username: {
            state: false,
            value: "Example"
        }
    })
    const settingsCategories = [
        { value: "user_settings", label: "User Settings", icon: <FaUserAlt />, 
            content: 
                <Flex h={"100%"} w={"100%"} borderRadius={"5px"} color={theme.color} p={5} flexDirection={"column"} justify={"center"} gap={5}>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Username: </Text>
                        {!userSettingParam.email.state && <Link color={theme.secondColor} onClick={() => {
                            setSettingParam({ ...userSettingParam, username: { ...userSettingParam.username, state: true } })}
                        }
                        >
                            {userSettingParam.username.value}
                        </Link>}
                        {userSettingParam.username.state && <Input p={1} bg={theme.boxBg} border={`1px solid ${theme.borderColor}`} width={"50%"} />}
                    </Flex>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Email: </Text>
                        {!userSettingParam.email.state && <Link color={theme.secondColor} onClick={() => {
                            setSettingParam({ ...userSettingParam, email: { ...userSettingParam.email, state: true } })}
                        }
                        >
                            {userSettingParam.email.value}
                        </Link>}
                        {userSettingParam.email.state && <Input p={1} bg={theme.boxBg} border={`1px solid ${theme.borderColor}`} width={"50%"} />}
                    </Flex>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"} mr={335}>Password: </Text>
                        {!userSettingParam.password.state && <Link color={theme.secondColor} onClick={() => {
                            setSettingParam({ ...userSettingParam, password: { ...userSettingParam.password, state: true } })}
                        }
                        >
                            Change Password
                        </Link>}
                        {userSettingParam.password.state && <PasswordInput bg={theme.boxBg} p={1} border={`1px solid ${theme.borderColor}`} />}
                    </Flex>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Activate Notifications: </Text>
                        <Switch.Root>
                            <Switch.HiddenInput/>
                            <Switch.Control />
                        </Switch.Root>
                    </Flex>
            </Flex>
        }, 
        { value: "weather_settings", label: "Weather Settings", icon: <SiAccuweather />, 
            content: 
                <Flex h={"100%"} w={"100%"} borderRadius={"5px"} color={theme.color} p={5} flexDirection={"column"} justify={"center"} gap={5}>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Temperature Units:</Text>
                        <SegmentGroup.Root 
                            size={"sm"} 
                            defaultValue="Celcius (°C)" 
                            _notFirst={{ borderLeft: "0" }} 
                            border="none"
                        >
                            <SegmentGroup.Indicator />
                            <SegmentGroup.Items items={["Celcius (°C)", "Fahrenheit (°F)"]} p={2} />
                        </SegmentGroup.Root>
                    </Flex>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Wind Speed Units: </Text>
                        <SegmentGroup.Root size={"sm"} defaultValue="km/h">
                            <SegmentGroup.Indicator />
                            <SegmentGroup.Items items={["km/h", "mph", "m/s"]} p={2}/>
                        </SegmentGroup.Root>
                    </Flex>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Pressure Units: </Text>
                        <SegmentGroup.Root size={"sm"} defaultValue="hPa">
                            <SegmentGroup.Indicator />
                            <SegmentGroup.Items items={["hPa", "mmHg", "inHg"]} p={2}/>
                        </SegmentGroup.Root>
                    </Flex>
                    <Flex display={"flex"} justify={"space-between"} w={"100%"} align={"center"}>
                        <Text fontSize={"sm"}>Theme: </Text>
                        <SegmentGroup.Root size={"sm"} defaultValue="hPa">
                            <SegmentGroup.Indicator />
                            <SegmentGroup.Items items={["☀️ Light", "🌕 Dark"]} p={2}/>
                        </SegmentGroup.Root>
                    </Flex>
                </Flex>
        }
    ]
    return (
        <Flex
            height={"100vh"}
            width={"100%"}
            justify={"center"}
            align={"center"}
        >
            <Tabs.Root 
                defaultValue="weather_settings" 
                variant="plain" 
                orientation={useBreakpointValue({ base: "horizontal", lg: "vertical" })}
                height={"60%"} width={"90%"}
                borderRadius={"5px"}
            >
                <Tabs.List 
                    rounded="l3" 
                    p="1"
                >
                    {settingsCategories.map(({label, value, icon}) => (
                        <Tabs.Trigger 
                            value={value} 
                            bg={"none"}
                            color={theme.color}
                            m={1}
                        >
                            {icon}{label}
                        </Tabs.Trigger>
                    ))}
                    <Tabs.Indicator rounded="l2" bg={theme.secondColor}/>
                </Tabs.List>
                {
                settingsCategories.map(({value, content}) => (
                    <Tabs.Content value={value} key={value} h={"90%"} w={"100%"} bg={theme.boxBg}>
                        {content}
                    </Tabs.Content>
                ))}
            </Tabs.Root>
            </Flex>
      )
}


export default Settings