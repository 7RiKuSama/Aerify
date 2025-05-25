import { useState } from "react"

const useDeleteCount = () => {
    const [deleted, setDeleted] = useState(0)

    const deleteCount = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/admin/stat/deleted",
                {
                    credentials: "include"
                }
            )
            if (!res.ok) {
                throw new Error("Couldn't get user count")
            }
            const data = await res.json()
            setDeleted(data.count)

        } catch(error) {
            throw new Error("Couldn't connect to the backend")
        }
    }
    deleteCount()

    return deleted
}

export default useDeleteCount