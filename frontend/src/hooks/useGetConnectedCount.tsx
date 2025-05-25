import { useState } from "react"

const useConnectedCount = () => {
    const [connect, setConnect] = useState(0)

    const deleteCount = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/admin/stat/connected",
                {
                    credentials: "include"
                }
            )
            if (!res.ok) {
                throw new Error("Couldn't get user count")
            }
            const data = await res.json()
            setConnect(data.count)

        } catch(error) {
            throw new Error("Couldn't connect to the backend")
        }
    }
    deleteCount()

    return connect
}

export default useConnectedCount