import {
  Flex,
  Input,
  Link,
  Tabs,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import { Switch,  } from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import { SiAccuweather } from "react-icons/si";
import { useContext, useState } from "react";
import MainContext from "../../Contexts/MainContext";
import { PasswordInput } from "../ui/password-input";
import { SegmentGroup } from "@ark-ui/react";
import { UserSettingsProps } from "../../types/user";

const Settings = () => {
  const { theme } = useContext(MainContext);

  const [userSettingParam, setSettingParam] = useState<UserSettingsProps>({
    email: { state: false, value: "example@gmail.com" },
    password: { state: false },
    notification: { state: false },
    username: { state: false, value: "Example" },
  });

  const handleToggle = (key: keyof UserSettingsProps) => {
    setSettingParam({
      ...userSettingParam,
      [key]: { ...userSettingParam[key], state: true },
    });
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
          color={theme.secondColor}
          onClick={() => handleToggle(key)}
        >
          {value}
        </Link>
      ) : (
        <Input
          defaultValue={value}
          p={1}
          w="50%"
          bg={theme.boxBg}
          border={`1px solid ${theme.borderColor}`}
        />
      )}
    </Flex>
  );

  const userSettingsContent = (
    <Flex
      p={5}
      gap={5}
      flexDirection="column"
      color={theme.color}
      h="100%"
      w="100%"
      borderRadius="md"
    >
      {renderEditableField("Username:", "username", userSettingParam.username.value)}
      {renderEditableField("Email:", "email", userSettingParam.email.value)}

      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="sm">Password:</Text>
        {!userSettingParam.password.state ? (
          <Link
            color={theme.secondColor}
            onClick={() => handleToggle("password")}
          >
            Change Password
          </Link>
        ) : (
          <PasswordInput
            bg={theme.boxBg}
            p={1}
            border={`1px solid ${theme.borderColor}`}
          />
        )}
      </Flex>

      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="sm">Activate Notifications:</Text>
        <Switch.Root>
            <Switch.HiddenInput />
            <Switch.Control />
        </Switch.Root>
      </Flex>
    </Flex>
  );

  const weatherSettingsContent = (
    <Flex
      p={5}
      gap={5}
      flexDirection="column"
      color={theme.color}
      h="100%"
      w="100%"
      borderRadius="md"
    >
      {[
        {
          label: "Temperature Units",
          items: ["Celsius (°C)", "Fahrenheit (°F)"],
          defaultValue: "Celsius (°C)",
        },
        {
          label: "Wind Speed Units",
          items: ["km/h", "mph", "m/s"],
          defaultValue: "km/h",
        },
        {
          label: "Pressure Units",
          items: ["hPa", "mmHg", "inHg"],
          defaultValue: "hPa",
        },
        {
          label: "Theme",
          items: ["☀️ Light", "🌕 Dark"],
          defaultValue: "☀️ Light",
        },
      ].map(({ label, items, defaultValue }) => (
        <Flex key={label} justify="space-between" align="center" w="100%">
          <Text fontSize="sm">{label}:</Text>
          <SegmentGroup.Root defaultValue={defaultValue}>
            <SegmentGroup.Indicator />
            {items.map((item) => (
              <SegmentGroup.Item key={item} value={item}>
                {item}
              </SegmentGroup.Item>
            ))}
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

  const orientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "horizontal",
    lg: "vertical",
  });

  return (
    <Flex w="100%" h="100vh" justify="center" align="center" p={4}>
    <Tabs.Root
      defaultValue={settingsCategories[0].value}
      orientation={orientation}
      w="90%"
      h="60%"
    >
      <Tabs.List p={2}>
        {settingsCategories.map(({ label, value, icon }) => (
          <Tabs.Trigger key={value} value={value} color={theme.color}>
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
          bg={theme.boxBg}
          p={4}
          borderRadius="md"
        >
          {content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
    </Flex>
  );
};

export default Settings;
  