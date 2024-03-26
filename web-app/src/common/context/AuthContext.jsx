import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthenticationService } from "../services/AuthenticationService";

export const CURRENT_USER_STORAGE_KEY = "APP_CURRENT_USER";
export const AuthContext = React.createContext();

export function AuthRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuthContext();

  if (!currentUser && !location.pathname.startsWith("/public")) {
    return navigate("/public");
  }

  return <>{children}</>;
}

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage(CURRENT_USER_STORAGE_KEY, null);

  const isAdminForCurrentOrg = currentUser?.primaryOrganization?.role?.includes("ADMIN");

  const navigate = useNavigate();
  const location = useLocation();

  function logOut() {
    setCurrentUser(null);
    return AuthenticationService.logout();
  }

  if (!window.globalLogout) {
    window.globalLogout = logOut;
  }

  function loginAsUser(user) {
    user.primaryOrganization = user.organizations[0];
    setCurrentUser(user);
  }

  React.useEffect(() => {
    if (!currentUser) {
      navigate("/public");
    } else if (location.pathname.startsWith("/public") || location.pathname.startsWith("/verify-email")) {
      navigate("/dashboard");
    }
  }, [navigate, currentUser, location.pathname]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: Boolean(currentUser), currentUser, loginAsUser, logOut, isAdminForCurrentOrg }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return React.useContext(AuthContext);
}
