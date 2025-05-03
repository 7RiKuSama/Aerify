export interface ContainerProps {
    children: React.ReactNode
}

export interface DrawerProps {
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

export interface LogoProps {
    color: string;
    lWidth: string;
    lHeight: string
}

export interface AreaChartData {
    name: string;
    uv: number;
}