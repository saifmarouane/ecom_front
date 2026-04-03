import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "../Components/I18nProvider";
import { getAdminOrderStats } from "../services/api";

function toStatusCards(t, byStatus) {
  const map = byStatus || {};
  return [
    { key: "ordered", label: t("orderStatusOrdered"), value: Number(map.ordered || 0) },
    { key: "processing", label: t("orderStatusProcessing"), value: Number(map.processing || 0) },
    { key: "shipped", label: t("orderStatusShipped"), value: Number(map.shipped || 0) },
    { key: "delivered", label: t("orderStatusDelivered"), value: Number(map.delivered || 0) },
    { key: "canceled", label: t("orderStatusCanceled"), value: Number(map.canceled || 0) },
  ];
}

const AdminDashboard = () => {
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingStats(true);
      setStatsError("");
      try {
        const s = await getAdminOrderStats();
        if (mounted) setStats(s);
      } catch (e) {
        if (mounted) setStatsError(e.message || "Error");
      } finally {
        if (mounted) setLoadingStats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => toStatusCards(t, stats?.byStatus), [t, stats?.byStatus]);
  const daily = useMemo(() => (Array.isArray(stats?.last7Days) ? stats.last7Days : []), [stats?.last7Days]);
  const maxDaily = useMemo(() => Math.max(1, ...daily.map((d) => Number(d?.count || 0))), [daily]);
  const totalOrders = Number(stats?.total || 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="admin-header">
        <h1>{t('dashboardTitle')}</h1>
        <p className="admin-dashboard-intro">{t('dashboardIntro')}</p>
      </div>
      <div className="admin-actions">
        <Link to='/admin/products' className="admin-btn">{t('adminManageProducts')}</Link>
        <Link to='/admin/categories' className="admin-btn">{t('adminManageCategories')}</Link>
        <Link to='/admin/orders' className="admin-btn">{t('adminOrders')}</Link>
        <Link to='/admin/users' className="admin-btn">{t('adminUsers')}</Link>
      </div>

      <div className="admin-grid" style={{ marginTop: 18 }}>
        <div className="admin-panel">
          <h2>{t("orders")}</h2>
          {loadingStats && <p className="products-status">{t("loading")}</p>}
          {statsError && <p className="form-error">{statsError}</p>}
          {!loadingStats && !statsError && (
            <>
              <div className="admin-kpis">
                <div className="admin-kpi">
                  <div className="admin-kpi__label">{t("totalOrders")}</div>
                  <div className="admin-kpi__value">{totalOrders}</div>
                </div>
                {cards.map((c) => (
                  <div key={c.key} className="admin-kpi">
                    <div className="admin-kpi__label">{c.label}</div>
                    <div className="admin-kpi__value">{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="admin-chart">
                <div className="admin-chart__title">{t("ordersLast7Days")}</div>
                <div className="admin-chart__bars" role="img" aria-label={t("ordersLast7Days")}>
                  {daily.map((d) => {
                    const h = Math.round((Number(d?.count || 0) / maxDaily) * 100);
                    const label = String(d?.date || "").slice(5);
                    return (
                      <div key={d.date} className="admin-chart__barwrap" title={`${d.date}: ${d.count}`}>
                        <div className="admin-chart__bar" style={{ height: `${h}%` }} />
                        <div className="admin-chart__xlabel">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="admin-panel">
          <h2>{t("quickActions")}</h2>
          <div className="admin-actions" style={{ padding: 0 }}>
            <Link to="/admin/orders" className="admin-btn">{t("manageOrders")}</Link>
            <Link to="/admin/products" className="admin-btn">{t("adminManageProducts")}</Link>
            <Link to="/admin/categories" className="admin-btn">{t("adminManageCategories")}</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
