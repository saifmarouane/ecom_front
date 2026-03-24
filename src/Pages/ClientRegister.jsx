import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { registerClient } from "../services/api";
import { useAuth } from "../Components/AuthProvider";
import { useI18n } from "../Components/I18nProvider";

const ClientRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await registerClient(form.username, form.password, form.email);
      login(result);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "خطأ في التسجيل");
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
          <div>
            <p className="eyebrow">{t("clientRegister")}</p>
            <h1>{t("clientRegisterTitle")}</h1>
            <p className="lede">{t("clientRegisterSubtitle")}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {t("username")}
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>
            <label>
              {t("password")}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "..." : t("registerBtn")}
            </button>
          </form>
          <p className="footnote">
            {t("haveAccount")} <Link to="/login">{t("goLogin")}</Link>
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default ClientRegister;
