import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/api";
import { useI18n } from "../Components/I18nProvider";
import { toServerUrl } from "../services/api";

const emptyForm = { name: "", description: "", parentId: "", image: null, currentImage: "" };

export default function AdminCategories() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const parents = useMemo(() => items.filter((c) => !c.parentId), [items]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getCategories();
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

  useEffect(() => {
    if (!(form.image instanceof File)) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description || null,
      parentId: form.parentId ? String(form.parentId) : null,
      image: form.image instanceof File ? form.image : undefined,
    };
    try {
      if (editingId) await updateCategory(editingId, payload);
      else await createCategory(payload);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      parentId: cat.parentId ? String(cat.parentId) : "",
      image: null,
      currentImage: cat.image || "",
    });
  };

  const remove = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;
    setError("");
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="admin-header">
        <h1>{t("adminCategories")}</h1>
        <p className="admin-dashboard-intro">{t("adminCrudHint")}</p>
      </div>

      <div className="admin-grid">
        <div className="admin-panel">
          <h2>{editingId ? t("edit") : t("create")}</h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <label>
              {t("name")}
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </label>
            <label>
              {t("description")}
              <textarea rows="3" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </label>
            <label>
              {t("parentCategory")}
              <select value={form.parentId} onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}>
                <option value="">{t("none")}</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label>
              {t("categoryImage")}
              {form.currentImage && !form.image && (
                <img
                  src={toServerUrl(form.currentImage)}
                  alt={form.name || "category"}
                  style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
                />
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={form.name || "category"}
                  style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <div className="admin-row">
              <button type="submit" disabled={saving}>{saving ? "..." : (editingId ? t("save") : t("create"))}</button>
              {editingId && (
                <button type="button" className="btn ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  {t("cancel")}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <h2>{t("list")}</h2>
          {loading && <p className="products-status">{t("loading")}</p>}
          {!loading && (
            <div className="admin-table cols-4">
              <div className="admin-thead">
                <div>ID</div>
                <div>{t("name")}</div>
                <div>{t("parentCategory")}</div>
                <div>{t("actions")}</div>
              </div>
              {items.map((c) => (
                <div className="admin-tr" key={c.id}>
                  <div>{c.id}</div>
                  <div>{c.name}</div>
                  <div>{c.parentId || "-"}</div>
                  <div className="admin-actions">
                    <button type="button" className="btn ghost" onClick={() => startEdit(c)}>{t("edit")}</button>
                    <button type="button" className="btn ghost danger" onClick={() => remove(c.id)}>{t("delete")}</button>
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
