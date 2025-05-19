import { useContext } from "react";
import MainContext from "../../Contexts/MainContext";
import { WeatherProps } from "../../types/weather";

const WindyMap = ({weather, isLoading, showDetails, showCalendar, height}: {weather:WeatherProps; isLoading:boolean, showDetails: boolean, showCalendar: boolean, height: number}) => {

    const { unit } = useContext(MainContext);
    
    if ( isLoading || !weather || !weather.location) {
        return <p>Loading...</p>;
    }
    

    const windyEmbedUrl = `https://embed.windy.com/embed2.html
        ?lat=${weather.location.lat}
        &lon=${weather.location.lon}
        &detailLat=${weather.location.lat}
        &detailLon=${weather.location.lon}
        &width=650
        &height=600
        &zoom=5
        &level=surface
        &overlay=wind
        &marker=true
        &menu=
        &message=true
        &pressure=true
        &type=map
        &location=coordinates
        &metricWind=default
        &metricTemp=default
        ${showDetails ? '&detail=true' : ''}
        ${showCalendar ? '&calendar=now' : ''}
    `.replace(/\s+/g, '');

    return (
        
        <iframe
            title="Windy Map"
            width="100%"
            height={height}
            src={windyEmbedUrl}
            style={{ borderRadius: "5px" }}
        />
    )
};

export default WindyMap