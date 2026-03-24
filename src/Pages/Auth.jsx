import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { loginAdmin, registerClient } from "../services/api";
import { useAuth } from "../Components/AuthProvider";
import { useI18n } from "../Components/I18nProvider";

function useQueryMode(location) {
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  return mode === "register" ? "register" : "login";
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const { t } = useI18n();

  const initialMode = useQueryMode(location);
  const [mode, setMode] = useState(initialMode);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const returnTo = useMemo(() => location.state?.from?.pathname || null, [location.state]);

  // Already logged in: go to the right place
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard", { replace: true });
    else if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginAdmin(loginForm.username, loginForm.password);
      login(result);
      const target =
        result.user?.role === "admin"
          ? "/admin/dashboard"
          : returnTo || "/";
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || t("authError"));
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await registerClient(
        registerForm.username,
        registerForm.password,
        registerForm.email
      );
      login(result);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || t("authError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              {t("authLoginTab")}
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              {t("authRegisterTab")}
            </button>
          </div>

          {mode === "login" ? (
            <>
              <div>
                <p className="eyebrow">{t("authEyebrow")}</p>
                <h1>{t("authLoginTitle")}</h1>
                <p className="lede">{t("authLoginSubtitle")}</p>
              </div>
              <form className="auth-form" onSubmit={submitLogin}>
                <label>
                  {t("username")}
                  <input
                    name="username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    autoComplete="username"
                    required
                  />
                </label>
                <label>
                  {t("password")}
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    autoComplete="current-password"
                    required
                  />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" disabled={loading}>
                  {loading ? "..." : t("loginBtn")}
                </button>
              </form>
              <p className="footnote">
                {t("noAccount")}{" "}
                <button type="button" className="linklike" onClick={() => setMode("register")}>
                  {t("goRegister")}
                </button>
              </p>
            </>
          ) : (
            <>
              <div>
                <p className="eyebrow">{t("authEyebrow")}</p>
                <h1>{t("authRegisterTitle")}</h1>
                <p className="lede">{t("authRegisterSubtitle")}</p>
              </div>
              <form className="auth-form" onSubmit={submitRegister}>
                <label>
                  {t("username")}
                  <input
                    name="username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
                <label>
                  {t("email")}
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                </label>
                <label>
                  {t("password")}
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" disabled={loading}>
                  {loading ? "..." : t("registerBtn")}
                </button>
              </form>
              <p className="footnote">
                {t("haveAccount")}{" "}
                <button type="button" className="linklike" onClick={() => setMode("login")}>
                  {t("goLogin")}
                </button>
              </p>
            </>
          )}

          <p className="footnote">
            <Link to="/">{t("backToShop")}</Link>
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default Auth;
