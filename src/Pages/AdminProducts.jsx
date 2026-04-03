import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createProduct, deleteProduct, getCategories, getProducts, updateProduct } from "../services/api";
import { useI18n } from "../Components/I18nProvider";
import ImageCropModal from "../Components/ImageCropModal";
import AdminTable from "../Components/AdminTable";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  stock: "",
  isActive: true,
  categoryId: "",
  imageLarge: null,
  imageSmall: null,
};

export default function AdminProducts() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [crop, setCrop] = useState(null);
  const [previewLarge, setPreviewLarge] = useState("");
  const [previewSmall, setPreviewSmall] = useState("");

  const catById = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(String(c.id), c));
    return map;
  }, [categories]);

  useEffect(() => {
    if (!(form.imageLarge instanceof File)) {
      setPreviewLarge("");
      return;
    }
    const url = URL.createObjectURL(form.imageLarge);
    setPreviewLarge(url);
    return () => URL.revokeObjectURL(url);
  }, [form.imageLarge]);

  useEffect(() => {
    if (!(form.imageSmall instanceof File)) {
      setPreviewSmall("");
      return;
    }
    const url = URL.createObjectURL(form.imageSmall);
    setPreviewSmall(url);
    return () => URL.revokeObjectURL(url);
  }, [form.imageSmall]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setItems(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      originalPrice: p.originalPrice ?? "",
      stock: p.stock ?? "",
      isActive: Boolean(p.isActive),
      categoryId: p.categoryId ? String(p.categoryId) : "",
      imageLarge: null,
      imageSmall: null,
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) {
      if (!(form.imageSmall instanceof File)) {
        setError(t("imageSmallRequired"));
        return;
      }
      if (!(form.imageLarge instanceof File)) {
        setError(t("imageLargeRequired"));
        return;
      }
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description || null,
      price: form.price,
      originalPrice: form.originalPrice || null,
      stock: form.stock || 0,
      isActive: form.isActive ? "true" : "false",
      categoryId: form.categoryId || "",
    };
    if (form.imageLarge) payload.imageLarge = form.imageLarge;
    if (form.imageSmall) payload.imageSmall = form.imageSmall;

    try {
      if (editingId) await updateProduct(editingId, payload);
      else await createProduct(payload);
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
      await deleteProduct(id);
      await load();
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="admin-header">
        <h1>{t("adminProducts")}</h1>
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
            <div className="admin-form-2">
              <label>
                {t("price")}
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
              </label>
              <label>
                {t("originalPrice")}
                <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: e.target.value }))} />
              </label>
            </div>
            <div className="admin-form-2">
              <label>
                {t("stock")}
                <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
              </label>
              <label>
                {t("category")}
                <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
                  <option value="">{t("none")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="admin-check">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
              {t("active")}
            </label>

	            <div className="admin-form-2">
	              <label>
	                {t("imageLarge")}
                  {previewLarge && (
                    <img
                      src={previewLarge}
                      alt={form.name || "product"}
                      style={{ width: "100%", maxWidth: 260, height: 160, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
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
                        aspect: 4 / 3,
                        outputWidth: 1600,
                        outputHeight: 1200,
                        title: t("cropLargeTitle"),
                        hint: t("cropHint"),
                        onApply: (croppedFile) => {
                          setForm((p) => ({ ...p, imageLarge: croppedFile }));
                          setCrop(null);
                        },
                      });
                    }}
                  />
	              </label>
	              <label>
	                {t("imageSmall")}
                  {previewSmall && (
                    <img
                      src={previewSmall}
                      alt={form.name || "product"}
                      style={{ width: "100%", maxWidth: 220, height: 140, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
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
                        aspect: 4 / 3,
                        outputWidth: 800,
                        outputHeight: 600,
                        title: t("cropSmallTitle"),
                        hint: t("cropHint"),
                        onApply: (croppedFile) => {
                          setForm((p) => ({ ...p, imageSmall: croppedFile }));
                          setCrop(null);
                        },
                      });
                    }}
                  />
	              </label>
	            </div>

	            {error && <p className="form-error">{error}</p>}
            <div className="admin-row">
              <button type="submit" disabled={saving}>{saving ? "..." : (editingId ? t("save") : t("create"))}</button>
              {editingId && (
                <button type="button" className="btn ghost" onClick={reset}>
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
              {
                key: "name",
                label: t("name"),
                render: (val, item) => (
                  <div>
                    <div>{val}</div>
                    <div className="admin-sub" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                      {item.isActive ? t("active") : t("inactive")}
                    </div>
                  </div>
                ),
              },
              {
                key: "category",
                label: t("category"),
                render: (val, item) => item.category?.name || catById.get(String(item.categoryId))?.name || "-",
              },
              { key: "price", label: t("price"), render: (val) => Number(val || 0).toFixed(2) },
              { key: "originalPrice", label: t("originalPrice"), render: (val) => val ? Number(val).toFixed(2) : "-" },
              { key: "stock", label: t("stock") },
            ]}
            data={items}
            loading={loading}
            onEdit={startEdit}
            onDelete={remove}
            emptyMessage={t("noData") || "No products"}
          />
        </div>
	      </div>

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
	    </motion.div>
	  );
}
