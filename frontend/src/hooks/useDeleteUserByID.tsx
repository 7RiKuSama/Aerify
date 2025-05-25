import { useState } from "react"

export function useDeleteUserByID() {
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")


  async function deleteUser(id:string) {
    
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
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
    } catch (err) {
      setError("Something went wrong")
    }
  }

  return { deleteUser, error, message }
}


export default useDeleteUserByID