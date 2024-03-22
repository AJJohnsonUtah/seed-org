import React from "react";
import LoginPage from "../../Login/LoginPage";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthenticationService } from "../services/AuthenticationService";

export const AuthContext = React.createContext();

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage("CURRENT_USER", null);

  function logOut() {
    AuthenticationService.logout().finally(() => {
      setCurrentUser(null);
    });
  }

  if (!window.globalLogout) {
    window.globalLogout = logOut;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: Boolean(currentUser), currentUser, setCurrentUser, logOut }}>
      {!currentUser ? <LoginPage /> : children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return React.useContext(AuthContext);
}
