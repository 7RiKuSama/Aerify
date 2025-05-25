import { useState } from "react"
import { Errors } from "../types/error"
import { useNavigate } from "react-router-dom"


const useDeleteAllFavorites = () => {
    const [error, setError] = useState<Errors|null>(null)
    const [loading, setLoading] = useState(false) 
    const navigate = useNavigate()
    
    const deleteFavorites = async () => {
        setLoading(true)
        
        try {
            const res = await fetch(`http://localhost:4000/api/favorite`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })
            if (!res.ok) {
                setError({
                    status: res.statusText,
                    message: "Something happned while deleting favorites."
                })
            }
            navigate("/dashboard")
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    return {deleteFavorites, loading, error}
}


export default useDeleteAllFavorites
