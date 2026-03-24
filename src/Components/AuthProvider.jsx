import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isReady, setIsReady] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsReady(true);
        return;
      }
      setChecking(true);
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        setToken("");
        setUser(null);
      } finally {
        setChecking(false);
        setIsReady(true);
      }
    };
    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isReady,
      checking,
      login: (payload) => {
        setAuthToken(payload.token);
        setToken(payload.token);
        setUser(payload.user);
      },
      logout: () => {
        setAuthToken("");
        setToken("");
        setUser(null);
      },
    }),
    [token, user, isReady, checking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
