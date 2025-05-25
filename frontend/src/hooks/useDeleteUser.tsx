import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function useDeleteUser() {
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  async function deleteUser() {
    
    try {
      const res = await fetch("http://localhost:4000/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!res.ok) {
        setError("Couldn't delete the user")
        return
      }

      const data = await res.json()
      setMessage(data.message)
      navigate("/dashboard")
    } catch (err) {
      setError("Something went wrong")
    }
  }

  return { deleteUser, error, message }
}
