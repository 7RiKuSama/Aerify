import { useEffect, useState } from "react"
import { Errors } from "../types/error"
import { Favorite } from "../types/weather"





const useGetAllFavorite = () => {

    const [favorites, setFavorites] = useState<Favorite[] | null>(null)
    const [error, setError] = useState<Errors | null>(null)
    const [loading, setLoading] = useState(false)



    const getAllFavorites = async () => {
        setLoading(true)
        setError(null)



        try {

            const res = await fetch("http://localhost:4000/api/favorite", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"

                },
                credentials: "include",
            })
            if (!res.ok) {
                const errText = await res.text()
                setError({
                    status: res.statusText,
                    message: errText || "Something happened while getting favorites."
                })
                return
            }

            const data = await res.json()
            setFavorites(data.favorites) // backend should return { favorites: [...] }

        } catch (error) {
            setError({
                status: "Network Error",
                message: error instanceof Error ? error.message : String(error)

            })

        } finally {
            setLoading(false)
        }

    }



    useEffect(() => {
        getAllFavorites()
    }, [])
    return { getAllFavorites, favorites, loading, error }
}

export default useGetAllFavorite
