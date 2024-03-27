import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetupOrganization from "../../Profile/Organization/SetupOrganization";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthenticationService } from "../services/AuthenticationService";
import { UserService } from "../services/UserService";

export const CURRENT_USER_STORAGE_KEY = "APP_CURRENT_USER";
export const AuthContext = React.createContext();

export function NonAuthRoute({ children }) {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  React.useEffect(() => {
    if (currentUser) {
      return navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return <>{children}</>;
}

export function AuthRoute({ children }) {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  React.useEffect(() => {
    if (!currentUser) {
      return navigate("/public");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  if (currentUser?.primaryOrganization) {
    return <>{children}</>;
  } else {
    return <SetupOrganization />;
  }
}

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage(CURRENT_USER_STORAGE_KEY, null);

  const isAdminForCurrentOrg = currentUser?.primaryOrganization?.role?.includes("ADMIN");

  const attemptReloadCurrentUser = useCallback(() => {
    UserService.getCurrentAuthUser()
      .then(loginAsUser)
      .catch((e) => {
        if (e.response.status === 401) {
          return Promise.resolve(null);
        } else {
          return Promise.reject(e);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    attemptReloadCurrentUser();
  }, [attemptReloadCurrentUser]);

  function logOut() {
    setCurrentUser(null);
    return AuthenticationService.logout();
  }

  if (!window.globalLogout) {
    window.globalLogout = logOut;
  }

  function loginAsUser(user, primaryOrgId) {
    if (!user.organizations) {
      user.primaryOrganization = null;
    } else if (primaryOrgId) {
      user.primaryOrganization = user.organizations.find((o) => o._id === primaryOrgId);
    } else if (currentUser?.primaryOrganization) {
      user.primaryOrganization =
        user.organizations.find((o) => o._id === currentUser.primaryOrganization._id) || user.organizations[0];
    } else {
      user.primaryOrganization = user.organizations[0];
    }
    setCurrentUser(user);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: Boolean(currentUser),
        currentUser,
        loginAsUser,
        logOut,
        isAdminForCurrentOrg,
        attemptReloadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return React.useContext(AuthContext);
}
