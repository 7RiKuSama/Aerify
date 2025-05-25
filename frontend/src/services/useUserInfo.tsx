import { useState, useEffect } from "react"
import { UserInformation } from "../types/user"

const useUserInfo = () => {

    const [userInfo, setUserInfo] = useState<UserInformation |null>(null)
    const [userInfoError, setUserInfoError] = useState<string|null>(null)
    const [userInfoLoading, setUserInfoLoading] = useState(true)
    
    const fetchUserInfo = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/verify", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            
            if (res.status === 200) {
                const data = await res.json()
                setUserInfo({
                    isConnected: true,
                    username: data.username,
                    email: data.email
                })
            } else {
                setUserInfoError("Couldn't fetch the user info")
                throw new Error("Couldn't fetch the user info")
            }

        } catch(error) {
            throw new Error("Couldn't get User Information")
        } finally {
            setUserInfoLoading(false)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    return {userInfo, setUserInfo, userInfoError, userInfoLoading, refetchUserInfo: fetchUserInfo}
}

export default useUserInfo