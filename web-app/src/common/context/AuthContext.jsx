import React from "react";

export const AuthContext = React.createContext();

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState({
    _id: "9018273na9ph8fqp23",
    firstName: "AJ",
    lastName: "Johnson",
    username: "AJJohnson",
    primaryOrganization: "Flower Boy",
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn: Boolean(currentUser), currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return React.useContext(AuthContext);
}
