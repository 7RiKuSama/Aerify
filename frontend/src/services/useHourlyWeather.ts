import { useEffect, useState } from "react";

// interface HourlyWeatherProps {
//   time: string;
//   temp: number;          // Temperature in °C
//   humidity: number;      // Humidity percentage
//   rain: number;          // Rain in mm
//   windSpeed: number;     // Wind speed in km/h or m/s
//   uvIndex: number;       // UV Index
//   precipitation: number; // Precipitation in mm
//   pressure: number;      // Air Pressure in hPa (or mb)
//   condition: string;     // Weather condition (e.g., "Clear", "Rainy")
// }

const useHourlyWeather = (apiData: any) => {
  const [chartData, setChartData] = useState<any>({}); // Changed to store multiple types

  useEffect(() => {
    if (apiData && apiData.forecast && apiData.forecast.forecastday) {
      const forecastDay = apiData.forecast.forecastday[0]; // Get data for the first day

      if (forecastDay.hour) {
        const filteredData = forecastDay.hour.map((hour: any) => ({
          time: hour.time,         // Time (e.g., "00:00", "01:00")
          temp: hour.temp_c,       // Temperature
          humidity: hour.humidity, // Humidity
          rain: hour.precip_mm || 0, // Rain in mm
          windSpeed: hour.wind_kph || 0, // Wind Speed
          uvIndex: hour.uv || 0,   // UV Index
          precipitation: hour.precip_mm || 0, // Precipitation
          pressure: hour.pressure_mb || hour.pressure, // Air Pressure
          condition: hour.condition.text, // Weather Condition
        }));

        // Return all data types as separate arrays
        setChartData({
          temperature: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.temp, // Temp data mapped to uv
          })),
          humidity: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.humidity, // Humidity data mapped to uv
          })),
          rain: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.rain, // Rain data mapped to uv
          })),
          wind: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.windSpeed, // Wind Speed mapped to uv
          })),
          uvIndex: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.uvIndex, // UV Index mapped to uv
          })),
          precipitation: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.precipitation, // Precipitation mapped to uv
          })),
          pressure: filteredData.map((data: any) => ({
            name: data.time.substring(11),
            uv: data.pressure, // Pressure mapped to uv
          })),
        });
      }
    }
  }, [apiData]);
  return chartData;
};

export default useHourlyWeather;
