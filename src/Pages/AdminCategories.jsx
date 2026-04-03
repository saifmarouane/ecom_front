import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/api";
import { useI18n } from "../Components/I18nProvider";
import { toServerUrl } from "../services/api";
import ImageCropModal from "../Components/ImageCropModal";
import AdminTable from "../Components/AdminTable";

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
  const [crop, setCrop] = useState(null);

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
    if (!editingId && !(form.image instanceof File)) {
      setError(t("categoryImageRequired"));
      return;
    }
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
    <>
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
	                onChange={(e) => {
	                  const f = e.target.files?.[0] || null;
	                  e.target.value = "";
	                  if (!f) return;
	                  setCrop({
	                    file: f,
	                    aspect: 16 / 10,
	                    outputWidth: 960,
	                    outputHeight: 600,
	                    title: t("cropCategoryTitle"),
	                    hint: t("cropHint"),
	                    onApply: (croppedFile) => {
	                      setForm((p) => ({ ...p, image: croppedFile }));
	                      setCrop(null);
	                    },
	                  });
	                }}
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
          <AdminTable
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: t("name") },
              {
                key: "image",
                label: t("image"),
                render: (val) =>
                  val ? (
                    <img
                      src={toServerUrl(val)}
                      alt="category"
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    "-"
                  ),
              },
              { key: "description", label: t("description"), render: (val) => val?.substring(0, 50) + (val?.length > 50 ? "..." : "") || "-" },
              {
                key: "parentId",
                label: t("parentCategory"),
                render: (val, item) => {
                  const parent = items.find((c) => c.id === val);
                  return parent ? parent.name : "-";
                },
              },
            ]}
            data={items}
            loading={loading}
            onEdit={startEdit}
            onDelete={remove}
            emptyMessage={t("noData") || "No categories"}
          />
        </div>
	      </div>
      </motion.div>

      <ImageCropModal
        open={Boolean(crop?.file)}
        file={crop?.file || null}
        aspect={crop?.aspect || 1}
        outputWidth={crop?.outputWidth || 1200}
        outputHeight={crop?.outputHeight || 1200}
        title={crop?.title || t("cropImage")}
        hint={crop?.hint || ""}
        cancelLabel={t("cropCancel")}
        applyLabel={t("cropApply")}
        resetLabel={t("cropReset")}
        zoomLabel={t("cropZoom")}
        onCancel={() => setCrop(null)}
        onApply={(croppedFile) => {
          if (typeof crop?.onApply === "function") crop.onApply(croppedFile);
          else setCrop(null);
        }}
      />
    </>
  );
}
