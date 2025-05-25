import { useState } from "react"

const useMemeberCount = () => {
    const [members, setMembers] = useState(0)

    const getMembersCount = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/admin/stat/users",
                {
                    credentials: "include"
                }
            )
            if (!res.ok) {
                throw new Error("Couldn't get user count")
            }
            const data = await res.json()
            setMembers(data.count)

        } catch(error) {
            throw new Error("Couldn't connect to the backend")
        }
    }
    getMembersCount()

    return members
}

export default useMemeberCount