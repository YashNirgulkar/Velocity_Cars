import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("veloce_token")));

  useEffect(() => {
    const token = localStorage.getItem("veloce_token");
    if (!token) return;
    authApi
      .me()
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem("veloce_token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const { data } = await authApi.login({ email, password });
        localStorage.setItem("veloce_token", data.token);
        setUser(data.user);
        return data.user;
      },
      logout() {
        localStorage.removeItem("veloce_token");
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
