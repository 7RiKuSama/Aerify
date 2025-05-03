import { Key, useContext } from "react"
import MainContext from "../../Contexts/MainContext"
import { Box, Spinner, Text } from "@chakra-ui/react"
import NewsArticle from "../common/news/NewsArticle"



const NewsSection = () => {
  const { news, newsLoading } = useContext(MainContext)

  return (
    <Box h="100%" w="100%">
      {newsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" h="200px">
          <Spinner size="xl" />
        </Box>
      ) : news.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" h="200px">
          <Text>No news articles found.</Text>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          {news.slice(0, 4).map((article: { title: string; publishedAt: string; source: { name: string }; url: string; content: string; description: string; image: string }, idx: Key | null | undefined) => (
            <NewsArticle
              key={idx}
              title={article.title}
              publishedAt={article.publishedAt.split("T")[0]}
              source={article.source.name}
              url={article.url}
              content={article.content}
              description={article.description}
              image={article.image}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default NewsSection