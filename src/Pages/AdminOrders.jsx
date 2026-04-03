import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getAdminOrders, updateAdminOrderComment, updateAdminOrderStatus } from "../services/api";
import { useI18n } from "../Components/I18nProvider";
import { toServerUrl } from "../services/api";

function toStatusOptions(t) {
  return [
    { value: "ordered", label: t("orderStatusOrdered") },
    { value: "processing", label: t("orderStatusProcessing") },
    { value: "shipped", label: t("orderStatusShipped") },
    { value: "delivered", label: t("orderStatusDelivered") },
    { value: "canceled", label: t("orderStatusCanceled") },
  ];
}

function computeTotal(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((sum, it) => {
    const price = Number(it?.product?.price || 0);
    const qty = Number(it?.quantity || 0);
    return sum + price * qty;
  }, 0);
}

function escapeCsv(value) {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename, rows) {
  const bom = "\uFEFF";
  const csv = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminOrders() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [commentDrafts, setCommentDrafts] = useState({});
  const [savingCommentId, setSavingCommentId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [statusDrafts, setStatusDrafts] = useState({});

  const statusOptions = useMemo(() => toStatusOptions(t), [t]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getAdminOrders({ status, limit: 120 });
      setItems(Array.isArray(list) ? list : []);
      setSelected(new Set());
      setCommentDrafts({});
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const startEdit = (order) => {
    setEditingId(order.id);
    setStatusDrafts((prev) => ({ ...prev, [order.id]: order.status || "ordered" }));
    setCommentDrafts((prev) => ({ ...prev, [order.id]: order.comment ?? "" }));
  };

  const cancelEdit = () => {
    setEditingId("");
  };

  const saveEdit = async (order) => {
    const orderId = order.id;
    const nextStatus = statusDrafts[orderId] ?? order.status ?? "ordered";
    const nextComment = String(commentDrafts[orderId] ?? order.comment ?? "").trim();

    setUpdatingId(orderId);
    setSavingCommentId(orderId);
    setError("");

    try {
      if (nextStatus !== (order.status || "ordered")) {
        await updateAdminOrderStatus(orderId, nextStatus);
      }
      if (nextComment !== (order.comment ?? "")) {
        await updateAdminOrderComment(orderId, nextComment);
      }
      setEditingId("");
      await load();
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setUpdatingId("");
      setSavingCommentId("");
    }
  };



  const allSelected = useMemo(() => {
    if (!items.length) return false;
    return items.every((o) => selected.has(o.id));
  }, [items, selected]);

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (items.every((o) => next.has(o.id))) return new Set();
      items.forEach((o) => next.add(o.id));
      return next;
    });
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exportSelected = () => {
    const chosen = items.filter((o) => selected.has(o.id));
    const rows = [
      [t("orderId"), t("username"), t("email"), t("createdAt"), t("status"), t("items"), t("total"), t("comment")],
      ...chosen.map((o) => {
        const created = o?.createdAt ? new Date(o.createdAt).toLocaleString() : "-";
        const username = o?.userId?.username || "-";
        const email = o?.userId?.email || "-";
        const count = Array.isArray(o?.items) ? o.items.length : 0;
        const total = computeTotal(o);
        const statusLabel = statusOptions.find((s) => s.value === (o.status || "ordered"))?.label || (o.status || "-");
        const comment = (commentDrafts[o.id] ?? o?.comment ?? "").toString();
        return [o.id, username, email, created, statusLabel, count, Number(total || 0).toFixed(2), comment];
      }),
    ];
    const d = new Date();
    const pad2 = (n) => String(n).padStart(2, "0");
    const filename = `orders_${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}.csv`;
    downloadCsv(filename, rows);
  };



  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="admin-header">
        <h1>{t("adminOrders")}</h1>
        <p className="admin-dashboard-intro">{t("adminOrdersIntro")}</p>
      </div>

      <div className="admin-panel">
        <div className="admin-row" style={{ justifyContent: "space-between" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ opacity: 0.8, fontWeight: 700 }}>{t("filterStatus")}</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">{t("all")}</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-actions">
            <button type="button" className="btn ghost" onClick={load} disabled={loading}>
              {t("refresh")}
            </button>
            <button type="button" className="btn solid" onClick={exportSelected} disabled={!selected.size}>
              {t("exportExcel")} ({selected.size})
            </button>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading && <p className="products-status">{t("loading")}</p>}

        {!loading && (
          <div className="admin-table-container">
            <div className="admin-table cols-9">
              <div className="admin-thead">
                <div>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label={t("selectAll")} />
                </div>
                <div>{t("orderId")}</div>
                <div>{t("username")}</div>
                <div>{t("email")}</div>
                <div>{t("createdAt")}</div>
                <div>{t("items")}</div>
                <div>{t("total")}</div>
                <div>{t("status")}</div>
                <div>{t("comment")}</div>
              </div>
              {items.map((o) => {
                const total = computeTotal(o);
                const created = o?.createdAt ? new Date(o.createdAt).toLocaleString() : "-";
                const count = Array.isArray(o?.items) ? o.items.length : 0;
                const username = o?.userId?.username || "-";
                const email = o?.userId?.email || "-";
                const isEditing = editingId === o.id;
                const statusValue = statusDrafts[o.id] ?? o.status ?? "ordered";
                const commentValue = commentDrafts[o.id] ?? o?.comment ?? "";
                return (
                  <React.Fragment key={o.id}>
                    <div className="admin-tr" style={isEditing ? { backgroundColor: "rgba(225, 245, 225, 0.7)" } : {}}>
                      <div>
                        <input
                          type="checkbox"
                          checked={selected.has(o.id)}
                          onChange={() => toggleOne(o.id)}
                          aria-label={`${t("select")}: ${o.id}`}
                        />
                      </div>
                      <div style={{ fontFamily: "monospace" }}>{o.id}</div>
                      <div>{username}</div>
                      <div>{email}</div>
                      <div>{created}</div>
                      <div>{count}</div>
                      <div>{Number(total || 0).toFixed(2)} €</div>
                      <div style={isEditing ? { border: "1px solid #b2f0b2", borderRadius: 4, padding: "4px" } : {}}>
                        {isEditing ? (
                          <>
                            <select
                              value={statusValue}
                              onChange={(e) => setStatusDrafts((p) => ({ ...p, [o.id]: e.target.value }))}
                              disabled={updatingId === o.id}
                              style={{ width: "100%" }}
                            >
                              {statusOptions.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <div style={{ marginTop: 5, display: "flex", gap: 6 }}>
                              <button
                                type="button"
                                className="btn solid btn-sm"
                                disabled={updatingId === o.id || savingCommentId === o.id}
                                onClick={() => saveEdit(o)}
                              >
                                {t("save")}
                              </button>
                              <button type="button" className="btn ghost btn-sm" onClick={cancelEdit}>
                                {t("cancel")}
                              </button>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>
                              {statusOptions.find((s) => s.value === (o.status || "ordered"))?.label || (o.status || "-")}
                            </span>
                            <button type="button" className="btn ghost btn-sm" onClick={() => startEdit(o)}>
                              {t("edit")}
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={isEditing ? { border: "1px solid #b2f0b2", borderRadius: 4, padding: "4px" } : {}}>
                        {isEditing ? (
                          <input
                            value={commentValue}
                            placeholder={t("commentPlaceholder")}
                            onChange={(e) => setCommentDrafts((p) => ({ ...p, [o.id]: e.target.value }))}
                            disabled={savingCommentId === o.id}
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <span>{commentValue ? commentValue : "-"}</span>
                        )}
                      </div>
                    </div>

                    <div className="admin-tr admin-tr-full">
                      <details>
                        <summary style={{ cursor: "pointer", opacity: 0.9 }}>{t("viewDetails")}</summary>
                        <div className="order-details">
                          <div className="order-details__meta">
                            <div>
                              <strong>{t("orderId")}:</strong> <span style={{ fontFamily: "monospace" }}>{o.id}</span>
                            </div>
                            <div>
                              <strong>{t("username")}:</strong> {username}
                            </div>
                            <div>
                              <strong>{t("email")}:</strong> {email}
                            </div>
                            <div>
                              <strong>{t("createdAt")}:</strong> {created}
                            </div>
                            <div>
                              <strong>{t("status")}:</strong>{" "}
                              {statusOptions.find((s) => s.value === (o.status || "ordered"))?.label || (o.status || "-")}
                            </div>
                            <div>
                              <strong>{t("total")}:</strong> {Number(total || 0).toFixed(2)} €
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                              <strong>{t("comment")}:</strong> {(commentDrafts[o.id] ?? o?.comment ?? "").toString() || "-"}
                            </div>
                          </div>

                          <div className="order-items">
                            {(Array.isArray(o?.items) ? o.items : []).map((it) => {
                              const p = it?.product || null;
                              const img = p?.imageSmall || p?.imageLarge || "";
                              const lineTotal = Number(p?.price || 0) * Number(it?.quantity || 0);
                              return (
                                <div key={it.id} className="order-item">
                                  <div className="order-item__thumb">
                                    {img ? (
                                      <img src={toServerUrl(img)} alt={p?.name || t("product")} />
                                    ) : (
                                      <div className="order-item__noimg">—</div>
                                    )}
                                  </div>
                                  <div className="order-item__body">
                                    <div className="order-item__title">
                                      <strong>{p?.name || t("product")}</strong>
                                      {p?.category?.name ? <span className="order-item__muted"> — {p.category.name}</span> : null}
                                    </div>
                                    <div className="order-item__muted">
                                      <span style={{ fontFamily: "monospace" }}>{p?.id || it?.productId || "-"}</span>
                                    </div>
                                    <div className="order-item__row">
                                      <span>{t("price")}: {Number(p?.price || 0).toFixed(2)} €</span>
                                      <span>{t("originalPrice")}: {p?.originalPrice ? Number(p.originalPrice).toFixed(2) : "-"} €</span>
                                      <span>x{Number(it?.quantity || 0)}</span>
                                      <span>{t("total")}: {Number(lineTotal || 0).toFixed(2)} €</span>
                                    </div>
                                    <div className="order-item__row">
                                      <span>{t("stock")}: {p?.stock ?? "-"}</span>
                                      <span>{t("active")}: {p?.isActive ? t("active") : t("inactive")}</span>
                                      <span>{t("publishedAt")}: {p?.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "-"}</span>
                                    </div>
                                    {p?.description ? (
                                      <div className="order-item__desc">{p.description}</div>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </details>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
