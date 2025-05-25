import { useState, useEffect } from "react"

const useConnectionsData = () => {
    const [connectionsData, setConnectionsData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/admin/stat/connected/data", {
                    credentials: "include",
                })

                if (!res.ok) {
                    throw new Error("Couldn't get users connections data")
                }

                const data = await res.json()
                setConnectionsData(data.result)
            } catch (error) {
                console.error("Couldn't connect to the server")
            }
        }

        fetchData()
    }, []) // 👈 Empty dependency array ensures it runs only once on mount

    return connectionsData
}

export default useConnectionsData
