import { useState } from 'react';

const setLogoColor = (color: string) => {
    const [logoColor, useLogoColor] = useState(color)
    
    const handleMouseEnter = () => {
        useLogoColor("#4d98fa")
    }

    const handleMouseLeave = () => {
        useLogoColor("white")
    }

    return {logoColor, handleMouseEnter, handleMouseLeave, useLogoColor}
}


export default setLogoColor;