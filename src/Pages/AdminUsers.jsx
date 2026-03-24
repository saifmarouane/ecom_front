import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from "../services/api";
import { useI18n } from "../Components/I18nProvider";

const emptyForm = { username: "", email: "", password: "", role: "client" };

export default function AdminUsers() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getAdminUsers();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({ username: u.username || "", email: u.email || "", password: "", role: u.role || "client" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        username: form.username,
        email: form.email || null,
        role: form.role,
      };
      if (form.password) payload.password = form.password;

      if (editingId) await updateAdminUser(editingId, payload);
      else await createAdminUser({ ...payload, password: form.password || "Client@123" });

      reset();
      await load();
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;
    setError("");
    try {
      await deleteAdminUser(id);
      await load();
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="admin-header">
        <h1>{t("adminUsers")}</h1>
        <p className="admin-dashboard-intro">{t("adminCrudHint")}</p>
      </div>

      <div className="admin-grid">
        <div className="admin-panel">
          <h2>{editingId ? t("edit") : t("create")}</h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <label>
              {t("username")}
              <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
            </label>
            <label>
              {t("email")}
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </label>
            <label>
              {t("password")}
              <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder={editingId ? t("optional") : ""} />
            </label>
            <label>
              {t("role")}
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                <option value="client">client</option>
                <option value="admin">admin</option>
              </select>
            </label>
            {error && <p className="form-error">{error}</p>}
            <div className="admin-row">
              <button type="submit" disabled={saving}>{saving ? "..." : (editingId ? t("save") : t("create"))}</button>
              {editingId && <button type="button" className="btn ghost" onClick={reset}>{t("cancel")}</button>}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <h2>{t("list")}</h2>
          {loading && <p className="products-status">{t("loading")}</p>}
          {!loading && (
            <div className="admin-table cols-5">
              <div className="admin-thead">
                <div>ID</div>
                <div>{t("username")}</div>
                <div>{t("email")}</div>
                <div>{t("role")}</div>
                <div>{t("actions")}</div>
              </div>
              {items.map((u) => (
                <div className="admin-tr" key={u.id}>
                  <div>{u.id}</div>
                  <div>{u.username}</div>
                  <div>{u.email || "-"}</div>
                  <div>{u.role}</div>
                  <div className="admin-actions">
                    <button type="button" className="btn ghost" onClick={() => startEdit(u)}>{t("edit")}</button>
                    <button type="button" className="btn ghost danger" onClick={() => remove(u.id)}>{t("delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
