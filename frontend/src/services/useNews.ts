import { useState, useEffect } from "react"

const CACHE_KEY = "cached_news"
const CACHE_TIMESTAMP_KEY = "cached_news_timestamp"
const CACHE_DURATION_MS = 1000 * 60 * 60 * 12 // 12 hours

const useNews = () => {
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true)

        const now = Date.now()
        const cachedNews = localStorage.getItem(CACHE_KEY)
        const cachedTime = localStorage.getItem(CACHE_TIMESTAMP_KEY)

        // If cache exists and is fresh, use it
        if (cachedNews && cachedTime && now - Number(cachedTime) < CACHE_DURATION_MS) {
          const parsedNews = JSON.parse(cachedNews)
          setNews(parsedNews)
          console.log("Loaded news from cache")
          return
        }

        // Otherwise fetch new data
        const url = `https://gnews.io/api/v4/search?q=weather&lang=en&max=10&token=5064bdc162160790fdb2c01f3fdc9e45`
        const response = await fetch(url)
        if (!response.ok) throw new Error("Couldn't fetch the news articles")

        const data = await response.json()
        if (Array.isArray(data.articles)) {
          setNews(data.articles)
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.articles))
          localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString())
          console.log("Fetched news from API")
        } else {
          console.warn("Unexpected API response format")
        }
      } catch (error) {
        console.error("News fetch error:", error)
      } finally {
        setNewsLoading(false)
      }
    }

    fetchNews()
  }, [])

  return { news, newsLoading }
}

export default useNews
