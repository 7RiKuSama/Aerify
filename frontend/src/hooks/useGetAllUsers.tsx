import { useState } from "react"

const useGetAllUsers = () => {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Accepts an optional search input
    const getUsers = async (searchInput: string = "") => {
        setLoading(true)
        setError(null)
        try {
            // Add search input as a query parameter if provided
            const url = searchInput
                ? `http://localhost:4000/api/admin/user?search=${encodeURIComponent(searchInput)}`
                : "http://localhost:4000/api/admin/users"
            const res = await fetch(url, {
                method: "GET",
                credentials: "include"
            })
            if (!res.ok) {
                throw new Error("Couldn't get users with the given search input.")
            }
            const data = await res.json()
            setUsers(data.users || [])

        } catch (error) {
            setError("Connection Failed")
        } finally {
            setLoading(false)
        }
    }

    return { users, loading, error, getUsers }
}

export default useGetAllUsers