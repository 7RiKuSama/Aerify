import { Routes, Route } from "react-router-dom";
import MainContent from "../components/layouts/MainContent";
import MainContext from "../Contexts/MainContext";
import { useContext } from "react";
import SignIn from "../components/features/SignIn";
import SignUp from "../components/features/SignUp";
import ContactPage from "../components/features/ContactPage";
import Settings from "../components/features/Settings";
import AuthRoute from "../hooks/AuthRoute";
import HourlyForecast from "../components/layouts/HourlyForecast";
import Impact from "../components/layouts/Impact";
import ResetPassword from "../components/features/ResetPassword";
import Admin from "../components/layouts/Admin";


const AppRoutes = () => {
    const {theme} = useContext(MainContext)

    return (
        <Routes>
            <Route path="/" element={<MainContent theme={theme} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/impact" element={<Impact />} /> 
            <Route path="/impact/:location" element={<Impact />} />            
            <Route path="/hourly" element={<HourlyForecast theme={theme} />} />
            <Route path="/hourly/:location" element={<HourlyForecast theme={theme} />} />
            <Route path="/password" element={<ResetPassword />} />
            <Route path="/search/:location" element={<MainContent theme={theme} />} />
            <Route path="/dashboard" element={<MainContent theme={theme} />} />
            <Route path="/signin" element={
                <AuthRoute requireAuth={false}>
                    <SignIn />
                </AuthRoute>
            } />
            <Route path="/signup" element={
                <AuthRoute requireAuth={false}>
                    <SignUp />
                </AuthRoute>
            } />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/settings" element={
                <AuthRoute requireAuth={true}>
                    <Settings />
                </AuthRoute>
            } />
        </Routes>
    )
}

export default AppRoutes