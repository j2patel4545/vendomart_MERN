import { createContext, useContext, useState } from "react";

// 1️⃣ Create Context
const AppContext = createContext();

// 2️⃣ Create Provider
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Example function
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 3️⃣ Custom Hook (IMPORTANT & CLEAN)
export const useAppContext = () => {
  return useContext(AppContext);
};
