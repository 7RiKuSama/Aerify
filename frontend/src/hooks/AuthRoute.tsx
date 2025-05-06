import { useNavigate } from "react-router-dom";
import useUserInfo from "../services/useUserInfo";




function AuthRoute({ requireAuth, children }: { requireAuth: boolean; children: React.ReactElement; }) {
    const { userInfo, userInfoLoading } = useUserInfo();
    const navigate = useNavigate();
    
    // Show loading spinner while checking auth status
    if (userInfoLoading) {
      return <p>Loading...</p>;
    }
    
    // If page requires auth and user isn't logged in, redirect to login
    if (requireAuth && !userInfo) {
      navigate('/login');
      return null;
    }
    
    // If page requires NO auth (like login page) and user IS logged in, redirect to dashboard
    if (!requireAuth && userInfo) {
      navigate('/dashboard');
      return null;
    }
    
    // Otherwise show the requested page
    return children;
  }

export default AuthRoute