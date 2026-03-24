import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { loginAdmin } from "../services/api";
import { useAuth } from "../Components/AuthProvider";
import { useI18n } from "../Components/I18nProvider";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({ username: "", password: "" });
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
      const result = await loginAdmin(form.username, form.password);
      login(result);
      const target = location.state?.from?.pathname || "/admin/dashboard";
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "خطأ في تسجيل الدخول");
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
            <p className="eyebrow">{t("adminLogin")}</p>
            <h1>{t("loginTitle")}</h1>
            <p className="lede">
              {t("loginSubtitle")}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {t("username")}
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </label>
            <label>
              {t("password")}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "..." : t("loginBtn")}
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default AdminLogin;
