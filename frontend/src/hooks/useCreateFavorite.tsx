import { useState, useContext } from "react"
import { LocationProps } from "../types/weather"
import MainContext from "../Contexts/MainContext"

const useCreateFavorite = () => {
    
    const {favoriteError, setFavoriteError} = useContext(MainContext)
    const [loading, setLoading] = useState(false)
    
    const createFavorite = async (location: LocationProps) => {
        setLoading(true)
        
        try {
            const res = await fetch("http://localhost:4000/api/favorite/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    city: location.city,
                    country: location.country
                })
            })
            if (!res.ok) {
                setFavoriteError({
                    status: res.statusText,
                    message: "Something happned while adding it to favorites."
                })
            } else {
                setFavoriteError(null)
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    return {createFavorite, loading, favoriteError}
}


export default useCreateFavorite


