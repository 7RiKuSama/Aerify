import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Link,
  RadioGroup,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { SegmentGroup } from "@chakra-ui/react";
import { FaRegTrashAlt, FaUserAlt } from "react-icons/fa";
import { SiAccuweather } from "react-icons/si";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../Contexts/MainContext";
import { UserSettingsProps } from "../../types/user";
import { darkTheme } from "../../theme/themeInstance";
import PasswordDialog from "../common/PasswordDialog";
import useDeleteAllFavorites from "../../hooks/useDeleteAllFavorites";
import { useDeleteUser } from "../../hooks/useDeleteUser";

const Settings = () => {
  const { theme, userInfo, userInfoLoading, userSettingParam, setSettingParam, fetchUserSettings } = useContext(MainContext);
  const [location, setLocation] = useState(userSettingParam?.location?.default?.city + "," + userSettingParam?.location?.default?.country)
  const {deleteFavorites} = useDeleteAllFavorites()
  const { deleteUser, error } = useDeleteUser()
  const weatherItems = [
    {label: "Temperature Units", items: ["Celsius (°C)", "Fahrenheit (°F)"], value: userSettingParam?.settings?.data[0]?.value },
    { label: "Wind Speed Units", items: ["kph", "mph"], value: userSettingParam?.settings?.data[1]?.value },
    { label: "Pressure Units", items: ["mb", "inch"], value: userSettingParam?.settings?.data[2]?.value },
    { label: "Precipitation Units", items: ["mm", "inch"], value: userSettingParam?.settings?.data[3]?.value },
    { label: "Theme", items: ["Light", "Dark"], value: userSettingParam?.settings?.data[4]?.value }
  ]

  const locationOpt = [
    {label: "GPS", value: "gps"},
    {label: "Manual", value: "manual"}
  ]

  let selectedIndex = locationOpt.findIndex(
    (opt) => opt.value === userSettingParam?.location?.option
  )

  selectedIndex = selectedIndex + 1

  useEffect(() => {
    if (!userInfoLoading && userInfo) {
      setSettingParam((prev:UserSettingsProps) => ({
        ...prev,
        email: { ...prev.email, value: userInfo.email },
        username: { ...prev.username, value: userInfo.username }
      }));
    }
  }, [userInfoLoading, userInfo]);

  //const [settingsError, setSettingsError] = useState([])

  

  const handleToggle = (key: keyof UserSettingsProps) => {
    setSettingParam((prev:UserSettingsProps) => ({
      ...prev,
      [key]: {
        ...prev[key],
        state: !prev[key].state,
      },
    }));
  };

  const renderEditableField = (
    label: string,
    key: "username" | "email",
    value: string
  ) => (
    <Flex justify="space-between" align="center" w="100%">
      <Text fontSize="sm">{label}</Text>
      {!userSettingParam[key].state ? (
        <Link
          color={darkTheme.secondColor}
          onClick={() => handleToggle(key)}
        >
          {value}
        </Link>
      ) : (
        <Input
          value={userSettingParam[key].value}
          onChange={(e) =>
            setSettingParam({
              ...userSettingParam,
              [key]: {
                ...userSettingParam[key],
                value: e.target.value,
              },
            })
          }
          p={1}
          pl={4}
          w="50%"
          bg={darkTheme.boxBg}
          border={`1px solid ${darkTheme.borderColor}`}
        />
      )}
    </Flex>
  );

  const userSettingsContent = (
    <Flex
      p={5}
      gap={5}
      flexDirection="column"
      color={darkTheme.color}
      h="100%"
      w="100%"
      borderRadius="md"
    >
      {renderEditableField("Username:", "username", userInfo?.username)}
      {renderEditableField("Email:", "email", userInfo?.email)}

      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="sm">Password:</Text>
        <Link
          color={darkTheme.secondColor}
          href="/password"
        >
          Change Password
        </Link>
      </Flex>
      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="sm">Location Source:</Text>
        <RadioGroup.Root
          value={userSettingParam?.location?.option || "gps"}
          onValueChange={({ value }: { value: string }) => {
            setSettingParam((prev: UserSettingsProps) => ({
              ...prev,
              location: {
                ...prev.location,
                state: true,
                option: value,
              },
            }));
          }}
        >
          <HStack gap="6">
            {locationOpt.map((item) => (
              <RadioGroup.Item key={item.value} value={item.value}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
            {userSettingParam?.location?.option === "manual"? 
              <Input 
                p={2} 
                placeholder="(city, country)" 
                border={`1px solid ${darkTheme.borderColor}`}
                value={location}
                onChange={(e) => {
                  const newLocation = e.target.value;
                  setLocation(newLocation);
            
                  const [city, country] = newLocation.split(",").map(s => s.trim());
                  
                  setSettingParam((prev: UserSettingsProps) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      default: {
                        ...prev.location.default,
                        city,
                        country,
                      },
                    },
                  }));
                }}
              /> : 
            <></>}
          </HStack>
        </RadioGroup.Root>
      </Flex>
      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="sm">Delete Favorites:</Text>
        <Button
          colorPalette={"red"}
          fontSize={"13px"}
          padding={1}
          onClick={deleteFavorites}
        >
          <FaRegTrashAlt size={"5px"}/>
        </Button>
      </Flex>
      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="sm">Delete Account:</Text>
        <Button
          colorPalette={"red"}
          fontSize={"13px"}
          padding={1}
          onClick={deleteUser}
        >
          <FaRegTrashAlt size={"5px"}/>
        </Button>
      </Flex>
    </Flex>
  );

  const weatherSettingsContent = (
    <Flex
      p={5}
      gap={5}
      flexDirection="column"
      color={darkTheme.color}
      h="100%"
      w="100%"
      borderRadius="md"
    >
      {weatherItems.map(({ label, value, items }, index) => (
        <Flex key={label} justify="space-between" align="center" w="100%">
          <Text fontSize="sm">{label}:</Text>
          <SegmentGroup.Root 
            value={value}
            onValueChange={(details) => {
              const newValue = details.value;
              const newWeatherSettings = [...userSettingParam?.settings?.data];
              newWeatherSettings[index].value = newValue;
              setSettingParam({
                ...userSettingParam,
                settings: {
                  state: true,
                  data: newWeatherSettings
                }
              });
            }} 
          >
            <SegmentGroup.Indicator />
              <SegmentGroup.Items items={items} p={2} colorPalette={"blue"} />
          </SegmentGroup.Root>

        </Flex>
      ))}
    </Flex>
  );

  const settingsCategories = [
    {
      value: "user_settings",
      label: "User Settings",
      icon: <FaUserAlt />,
      content: userSettingsContent,
    },
    {
      value: "weather_settings",
      label: "Weather Settings",
      icon: <SiAccuweather />,
      content: weatherSettingsContent,
    },
  ];


  return (
    <Flex w="100%" h="100vh" justify="center" align="center" p={4} direction={"column"}>
    {error === "" ? <></> : <Text>{error}</Text>}
    <Tabs.Root
      defaultValue={settingsCategories[0].value}
      display={"flex"}
      flexDirection={"column"}
      orientation={"horizontal"}
      w="90%"
      h="700px"
    >
      <Tabs.List border={"transparent"}>
        {settingsCategories.map(({ label, value, icon }) => (
          <Tabs.Trigger key={value} value={value} color={"white"} p={2} bg={theme.secondColor} m={1} borderTopLeftRadius={10} borderTopRightRadius={10} borderBottomLeftRadius={0} borderBottomRightRadius={0} _selected={{background: "green", transition: "ease-in-out .2s", border: "transparent"}}>
            <Flex align="center" gap={2}>
              {icon}
              {label}
            </Flex>
          </Tabs.Trigger>
        ))}

      </Tabs.List>
      {settingsCategories.map(({ value, content }) => (
        <Tabs.Content
          key={value}
          value={value}
          bg={darkTheme.boxBg}
          p={4}
          borderRadius="md"
          
          h={"90%"}
        >
          {content}
        </Tabs.Content>
      ))}
      <Box w={"100%"} display={"flex"} gap={2} justifyContent={"space-between"} mt={2}>
        <Button w={"49.5%"} onClick={fetchUserSettings} paddingInline={5} bg={"red.600"}>Cancel</Button>
        <PasswordDialog userSetting={userSettingParam} setSetting={setSettingParam} />
      </Box>
    </Tabs.Root>
    </Flex>
  )
}
export default Settings;
  