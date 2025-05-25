import { Provider } from "./components/ui/provider"
import { 
  Grid, 
  GridItem,
  Flex,
  Heading
} from "@chakra-ui/react"



import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Header from "./components/layouts/Header"
import "./styles/App.css"
import Drawer from "./components/common/Drawer"
import fetchWeather from "./services/GetCurrentWeater"
import MainContext from "./Contexts/MainContext"
import { darkTheme, lightTheme } from "./theme/themeInstance"
import useAutocompleteLocation from "./services/UseAutocompleLocation"
import useNews from "./services/useNews"
import AppRoutes from "./routes/AppRoutes"
import Footer from "./components/layouts/Footer"
import useUserInfo from "./services/useUserInfo"
import { Errors } from "./types/error"
import useGetUserSettings from "./hooks/useGetUserSettings"


function App() {
 
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false);
  const [unit, setUnit] = useState("C")
  const {weather, isLoading} = fetchWeather()
  const {searchText, setSearchText, suggestions} = useAutocompleteLocation()
  const { news, newsLoading } = useNews()  
  const {userInfo, setUserInfo, userInfoError, userInfoLoading, refetchUserInfo} = useUserInfo()
  const [favoriteError, setFavoriteError] = useState<Errors|null>(null)
  const { userSettingParam, setSettingParam, refreshUserSettings:fetchUserSettings} = useGetUserSettings()
  const theme_unit = userSettingParam?.settings?.data[4]?.value
  const trimmedTheme = (theme_unit || "").trim().toLowerCase()
  const [theme, setTheme] = useState(lightTheme)

  useEffect(() => {
    if (trimmedTheme === "dark") {
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  }, [trimmedTheme])
  
  return (
    
    <MainContext.Provider value={{weather, isConnected, setIsConnected, isLoading, location, theme, searchText, setSearchText, suggestions, unit, setUnit, news, newsLoading, userInfo, setUserInfo, userInfoError, userInfoLoading, refetchUserInfo, favoriteError, setFavoriteError, userSettingParam, setSettingParam, fetchUserSettings}}>
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
