import { useState } from "react"
import { Errors } from "../types/error"
import { LocationProps } from "../types/weather"

const useCreateFavorite = () => {
    const [error, setError] = useState<Errors|null>(null)
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
                setError({
                    status: res.statusText,
                    message: "Something happned while adding it to favorites."
                })
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    return {createFavorite, loading, error}
}


export default useCreateFavorite


