import { Provider } from "./components/ui/provider"
import { 
  Grid, 
  GridItem,
  Flex
} from "@chakra-ui/react"



import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Header from "./components/layouts/Header"
import "./styles/App.css"
import Drawer from "./components/common/Drawer"
import fetchWeather from "./services/GetCurrentWeater"
import MainContext from "./Contexts/MainContext"
import { lightTheme } from "./theme/themeInstance"
import useAutocompleteLocation from "./services/UseAutocompleLocation"
import useNews from "./services/useNews"
import AppRoutes from "./routes/AppRoutes"
import Footer from "./components/layouts/Footer"





function App() {
 
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState(lightTheme)
  const [unit, setUnit] = useState("C")
  const {weather, isLoading} = fetchWeather()
  const {searchText, setSearchText, suggestions} = useAutocompleteLocation()
  const { news, newsLoading } = useNews()  
  return (
    <MainContext.Provider value={{weather, isLoading, location, theme, searchText, setSearchText, suggestions, unit, setUnit, news, newsLoading}}>
      <div style={{ background: theme.bg }}>
        <Provider>
          <BrowserRouter>
            <Drawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
            <Grid
              h="fit-content"
              templateRows="40px 1fr"
              templateColumns= "1fr"
              gap={0}
            >
              <GridItem rowSpan={1} colSpan={1}>
                <Header 
                  drawerOpen={drawerOpen} 
                  setDrawerOpen={setDrawerOpen} 
                  theme={theme}
                  setTheme={setTheme}      
                />
              </GridItem>
              <GridItem 
                rowSpan={1} 
                colSpan={1}
              >
                <Flex direction={"column"} justifyContent={"center"} alignItems={"center"}>
                  <AppRoutes />
                </Flex>
              </GridItem>
            </Grid>
            <Footer />
          </BrowserRouter>
        </Provider>
      </div>
    </MainContext.Provider>
  )
}

export default App
