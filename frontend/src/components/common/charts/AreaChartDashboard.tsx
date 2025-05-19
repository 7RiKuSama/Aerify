import { useEffect, useRef, useState } from "react";
import { WeatherProps } from "../../../types/weather";
import useHourlyWeather from "../../../services/useHourlyWeather";
import { Link, Tabs, useBreakpointValue, Text } from "@chakra-ui/react";
import AreaChartLayout from "./AreaChart";


const AreaChartDashboard = ({ weather, color, options }: { weather: WeatherProps, color: string, options: {label: string; key: string; icon: React.ReactElement }[]}) => {
  
  const [selected, setSelected] = useState("temperature");
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const plotData = useHourlyWeather(weather, 0);
  
  // Create a ref for timeout
  const renderTimeoutRef = useRef<number | null>(null);
  
  

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
      variant="plain"
      orientation={useBreakpointValue({ base: "horizontal" })}
      value={selected}
      onValueChange={handleTabChange}
    >
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
            <div key={`${key}-${renderKey}`} style={{ width: "100%", height: "100%", marginTop: "10px"}}>
              <AreaChartLayout dataChart={plotData[key] || []} color={color}/>
            </div>
          )}
        </Tabs.Content>
      ))}
      <Tabs.List
        p={2}
        w={"100%"}
        bg={"transparent"}
        borderRadius={"5px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        flexWrap={{base: "wrap", sm:"nowrap"}}
      >
        {options.map(({ label, key, icon }) => (
          <Tabs.Trigger
            key={label}
            value={key as string}
            _selected={{ color: "black", bg: color }}
            color={color}
            background={"#17222b"}
            outline="transparent"
            borderRadius={"50px"}
            fontSize={"12px"}
            w={{base: "fit-content", md: "100%"}}
            p={2}
          >
            <Link
              unstyled
              style={{ textAlign: "center" }}
              href={`#${String(key)}`}
              w={"100%"}
              display={"flex"}
              alignItems={"center"}
              gap={4}
            >
              {icon}<Text>{label}</Text>
            </Link>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
};

export default AreaChartDashboard;