import { ThemeProps } from "../types/theme"
import { ColorProps } from "../types/theme"

export const lightTheme: ThemeProps['theme'] = {
    bg: 'white',
    color: "black",
    boxColor: "black",
    boxBg: "rgba(66, 66, 66, 0.1)",
    borderColor: "rgba(10, 33, 54, 0.29)",
    secondColor: "rgb(63, 116, 185)",
    isEnabled: false
};



export const darkTheme: ThemeProps['theme'] = {
    bg: "rgb(29, 30, 38)",
    color: "white",
    boxColor: "white",
    boxBg: "rgb(8, 23, 37)",
    borderColor: "rgba(98, 164, 226, 0.27)",
    secondColor: "rgb(0, 153, 255)",
    isEnabled: true
};

export const Colors: ColorProps = {
    danger: "rgba(255, 57, 57, 0.84)",
    hoverText: "rgba(255, 255, 255, 0.84)",
    hoverLight: "rgba(17, 79, 107, 0.88)",
    hoverDark: "rgba(0, 174, 255, 0.88)",
    menuColor: "rgb(255, 255, 255)",
    footer: "rgb(15, 21, 29)",
}


