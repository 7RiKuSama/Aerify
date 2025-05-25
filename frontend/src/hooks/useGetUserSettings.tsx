import { useCallback, useEffect, useState } from "react";
import { UserSettingsProps } from "../types/user";

const useGetUserSettings = () => {
  const [userSettingParam, setSettingParam] = useState<UserSettingsProps>({
    email: { state: false, value: "" },
    username: { state: false, value: "" },
    location: {state: false, option: "gps", default: undefined},
    settings: {
      state: false,
      data: [
        { key: "temperature_units", value: "Celsius (°C)" },
        { key: "wind_speed", value: "km/h" },
        { key: "pressure", value: "mmHg" },
        { key: "Precipitation", value: "mm" },
        { key: "theme", value: "Light" },
      ],
    },
  });

  const fetchUserSettings = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/settings", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Fail to fetch user settings", data);
        return;
      }

      const updated = await res.json();

      setSettingParam({
        email: { state: false, value: updated.email },
        username: { state: false, value: updated.username },
        location: {state: false, option: updated.location.option, default: updated.location.option === "gps" ? undefined : updated.location.default},
        settings: { state: false, data: updated.data },
      });
    } catch (error) {
      console.error("An error occurred while fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  return { userSettingParam, setSettingParam, refreshUserSettings: fetchUserSettings };
};

export default useGetUserSettings;