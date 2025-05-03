import { useContext } from "react";
import MainContext from "../../Contexts/MainContext";
import { WeatherProps } from "../../types/weather";

const WindyMap = ({weather, isLoading}: {weather:WeatherProps; isLoading:boolean}) => {

    const { unit } = useContext(MainContext);
    
    if ( isLoading || !weather || !weather.location) {
        return <p>Loading...</p>;
    }
    

    const windyUrl = `https://embed.windy.com/embed2.html?lat=${weather.location.lat}&lon=${weather.location.lon}&detailLat=${weather.location.lat}&detailLon=${weather.location.lon}&width=650&height=600&zoom=5&level=surface&overlay=wind&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`;

    return (
        
        <iframe
            title="Windy Map"
            width="100%"
            height="500"
            src={windyUrl}
            style={{ borderRadius: "5px" }}
        />
    )
};

export default WindyMap