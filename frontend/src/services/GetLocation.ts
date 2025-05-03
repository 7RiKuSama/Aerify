import { useState, useEffect } from "react";

// Check if cached time is still valid
function isCacheValid(cachedTime: string | null, maxHours = 24): boolean {
  if (!cachedTime) return false;
  const now = Date.now();
  const age = now - parseInt(cachedTime);
  return age < maxHours * 60 * 60 * 1000; // maxHours in ms
}

// Save location and timestamp in localStorage
function cacheLocation(longitude: string | null, latitude: string | null, timestamp: string | null) {
  localStorage.setItem("longitude", longitude || "");
  localStorage.setItem("latitude", latitude || "");
  localStorage.setItem("weatherTimestamp", timestamp || "");
}

// Get location using browser's geolocation API
const getLocation = (): Promise<{ longitude: number; latitude: number }> => {
  const options: PositionOptions = {
    timeout: 70000,
    maximumAge: 30000,
    enableHighAccuracy: true,
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          resolve({ longitude, latitude });
        },
        () => {
          reject("Unable to retrieve your location");
        },
        options
      );
    }
  });
};

// React hook to handle location logic
const useLocation = () => {
  const [location, setLocation] = useState<{
    longitude: number | null;
    latitude: number | null;
    error: string | null;
  }>({ longitude: null, latitude: null, error: null });

  const fetchLocation = async () => {
    try {
      const { longitude, latitude } = await getLocation();
      setLocation({ longitude, latitude, error: null });
      cacheLocation(
        longitude.toString(),
        latitude.toString(),
        Date.now().toString()
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Unknown error";
      setLocation({ longitude: null, latitude: null, error: errorMessage });
    }
  };

  useEffect(() => {
    const cachedLatitude = localStorage.getItem("latitude");
    const cachedLongitude = localStorage.getItem("longitude");
    const cachedTimestamp = localStorage.getItem("weatherTimestamp");

    if (
      cachedLatitude &&
      cachedLongitude &&
      isCacheValid(cachedTimestamp)
    ) {
      setLocation({
        longitude: parseFloat(cachedLongitude),
        latitude: parseFloat(cachedLatitude),
        error: null,
      });
    } else {
      fetchLocation();
    }
  }, []);

  return { location, fetchLocation };
};

export default useLocation;
