import { useEffect, useState } from "react";
import * as authService from "../services/auth";
import { firebaseConfigured } from "../firebase";

import { AuthContext } from "./auth-context";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => authService.observeAuth((currentUser) => {
    setUser(currentUser); setLoading(false); setError("");
  }, (err) => { setError(authService.authErrorMessage(err)); setLoading(false); }), []);
  return <AuthContext.Provider value={{ user, loading, error, configured: firebaseConfigured,
    signup: authService.signup, login: authService.login,
    loginWithGoogle: authService.loginWithGoogle, logout: authService.logout,
  }}>{children}</AuthContext.Provider>;
}
