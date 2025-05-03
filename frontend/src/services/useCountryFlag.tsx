// services/useCountryFlag.ts
import { useEffect, useState } from "react"

const useCountryFlag = (country: string) => {
  const [flag, setFlag] = useState<string>("")
  const [isFlagLoading, setFlagLoading] = useState(false)

  useEffect(() => {
    if (!country) return;

    setFlagLoading(true)
    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Couldn't fetch the flag")
        }
        return response.json()
      })
      .then((data) => {
        setFlag(data[0].flags.png)
      })
      .catch((error) => {
        console.error("Flag fetch error:", error)
      })
      .finally(() => {
        setFlagLoading(false)
      })
  }, [country])

  return { flag, isFlagLoading }
}

export default useCountryFlag
