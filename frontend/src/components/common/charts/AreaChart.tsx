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
import MainContext from "../../../Contexts/MainContext";
import { useContext, useEffect, useRef, useState } from "react";

const AreaChartLayout = ({ dataChart }: { dataChart: AreaChartData[] }) => {
  const { theme } = useContext(MainContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
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
              top: 10,
              bottom: 10,
              left: 0,
              right: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.secondColor} stopOpacity={1} />
                <stop offset="95%" stopColor={theme.secondColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" />
            <YAxis hide={true} />
            <CartesianGrid vertical={false} horizontal={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#4d98fa"
              fill="url(#colorUv)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default AreaChartLayout;