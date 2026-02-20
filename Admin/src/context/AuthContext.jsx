import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Restore login on refresh
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedToken = localStorage.getItem("token");

    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    setAdmin(data);
    setToken(data.token);

    localStorage.setItem("admin", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);

    localStorage.removeItem("admin");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
