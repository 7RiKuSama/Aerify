export interface HeaderProps {
    setDrawerOpen: (open: boolean) => void;
    drawerOpen: boolean;
    setTheme: (mode: {bg: string, color: string, isEnabled: boolean, boxColor: string, boxBg: string, borderColor: string, secondColor: string}) => void;
    theme: {isEnabled: boolean, bg: string, color: string, boxColor: string, boxBg: string, borderColor: string, secondColor: string};
}

