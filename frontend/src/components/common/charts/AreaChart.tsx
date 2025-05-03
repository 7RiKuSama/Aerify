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
import { useContext } from "react";

const AreaChartLayout = ({ dataChart }: { dataChart: AreaChartData[] }) => {
  const { theme } = useContext(MainContext);

  return (
    <Box height={{ base: "200px", md: "350px" }} width={"100%"}>
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
          <CartesianGrid vertical={false} horizontal={false} /> {/* disables all grid lines */}
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
    </Box>
  );
};

export default AreaChartLayout;
