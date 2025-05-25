import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const logout = async () => {
    setError(""); // Clear old error
    try {
      const res = await fetch("http://localhost:4000/api/user/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setError("Couldn't log out. Please try again.");
        return;
      }

      navigate("/dashboard")

    } catch (err) {
      setError("Something went wrong during logout.");
    }
  };

  return { logout, error };
};

export default useLogout;