import { Routes, Route } from "react-router-dom";
import MainContent from "../components/layouts/MainContent";
import MainContext from "../Contexts/MainContext";
import { useContext } from "react";
import SignIn from "../components/features/SignIn";
import SignUp from "../components/features/SignUp";
import ContactPage from "../components/features/ContactPage";
import Settings from "../components/features/Settings";


const AppRoutes = () => {
    const {theme} = useContext(MainContext)
    return (
        <Routes>
            <Route path="/" element={<MainContent theme={theme} />} />
            <Route path="/search/:location" element={<MainContent theme={theme} />} />
            <Route path="/dashboard" element={<MainContent theme={theme} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    )
}

export default AppRoutes