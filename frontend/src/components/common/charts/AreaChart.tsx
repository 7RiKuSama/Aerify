import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AreaChartData } from "../../../types/componants";
import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const AreaChartLayout = ({ dataChart, color }: { dataChart: AreaChartData[], color: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const gradientId = `color-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  // Update dimensions when the component mounts and on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    // Initial measurement
    updateDimensions();
    
    // Add listener for resize events
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  return (
    <Box 
      ref={containerRef}
      height={{ base: "200px", md: "350px" }} 
      width={"100%"}
      position="relative"
    >
      {dimensions.width > 0 && (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            data={dataChart}
            margin={{
              top: 30,
              bottom: 10,
              left: 20,
              right: 20,
            }}
            >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor={color} stopOpacity={0.7} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: color, fontSize: 12 }} />
            <YAxis hide={true} />
            <CartesianGrid vertical={true} horizontal={true} strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke={color}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
            />
            </AreaChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default AreaChartLayout;