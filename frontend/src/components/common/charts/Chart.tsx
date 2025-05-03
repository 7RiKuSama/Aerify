import { ResponsiveContainer } from "recharts"

import React from "react";

interface ChartProps {
    children: React.ReactNode;
}

const Chart = ({ children }: ChartProps) => {
    return (
            <ResponsiveContainer width="100%" height="100%">
                {React.isValidElement(children) ? children : <div />}
            </ResponsiveContainer>
    )
}

export default Chart
