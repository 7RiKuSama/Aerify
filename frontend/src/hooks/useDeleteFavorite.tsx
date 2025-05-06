import { useState } from "react"
import { Errors } from "../types/error"


const useDeleteFavorite = () => {
    const [error, setError] = useState<Errors|null>(null)
    const [loading, setLoading] = useState(false)
    
    const deleteFavorite = async (favoriteID:string) => {
        setLoading(true)
        
        try {
            const res = await fetch(`http://localhost:4000/api/favorite/${favoriteID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })
            if (!res.ok) {
                setError({
                    status: res.statusText,
                    message: "Something happned while deleting this favorite."
                })
            }

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    return {deleteFavorite, loading, error}
}


export default useDeleteFavorite

