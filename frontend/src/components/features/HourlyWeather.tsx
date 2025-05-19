import { Link, Tabs, useBreakpointValue } from "@chakra-ui/react";
import { Colors } from "../../theme/themeInstance";
import MainContext from "../../Contexts/MainContext";
import { useContext, useState, useEffect, useRef } from "react";
import AreaChartLayout from "../common/charts/AreaChart";
import { WeatherProps } from "../../types/weather";
import useHourlyWeather from "../../services/useHourlyWeather";

const HourlyWeather = ({ weather }: { weather: WeatherProps }) => {
  const { theme } = useContext(MainContext);
  const [selected, setSelected] = useState("temperature");
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const plotData = useHourlyWeather(weather, 0);
  
  // Create a ref for timeout
  const renderTimeoutRef = useRef<number | null>(null);
  
  // Display names mapped to their keys in plotData
  const options: { label: string; key: keyof typeof plotData }[] = [
    { label: "Temperature", key: "temperature" },
    { label: "Humidity", key: "humidity" },
    { label: "Wind", key: "wind" },
    { label: "UV Index", key: "uvIndex" },
    { label: "Precipitation", key: "precipitation" },
  ];

  // Re-render chart when tab changes
  useEffect(() => {
    // Clear any existing timeout
    if (renderTimeoutRef.current !== null) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    // Set a slight delay to allow DOM to update before re-rendering the chart
    renderTimeoutRef.current = window.setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 400);
    
    return () => {
      if (renderTimeoutRef.current !== null) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [selected]);

  const handleTabChange = ({ value }: { value: string }) => {
    setSelected(value);
  };

  return (
    <Tabs.Root
      variant="subtle"
      orientation={useBreakpointValue({ base: "horizontal", lg: "vertical" })}
      value={selected}
      onValueChange={handleTabChange}
    >
      <Tabs.List
        p={2}
        w={{base: "100%", lg: "25%"}}
        bg={theme.boxBg}
        borderRadius={"5px"}
        borderRight={`1px solid ${theme.borderColor}`}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        flexWrap={{base: "wrap", sm:"nowrap"}}
      >
        {options.map(({ label, key }) => (
          <Tabs.Trigger
            key={label}
            value={key as string}
            _selected={{ color: "white", bg: Colors.hoverDark }}
            color={theme.color}
            background="transparent"
            outline="transparent"
            fontSize={"12px"}
            w={{base: "fit-content", md: "100%"}}
            p={2}
          >
            <Link
              unstyled
              style={{ textAlign: "center" }}
              href={`#${String(key)}`}
            >
              {label}
            </Link>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {options.map(({ key }) => (
        <Tabs.Content
          key={key as string}
          value={key as string}
          style={{ 
            height: "auto", 
            width: "100%"
          }}
        >
          {/* Only render chart when this tab is selected, with key for forcing re-render */}
          {selected === key && (
            <div key={`${key}-${renderKey}`} style={{ width: "100%", height: "100%" }}>
              <AreaChartLayout dataChart={plotData[key] || []} color={theme.secondColor} />
            </div>
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default HourlyWeather;