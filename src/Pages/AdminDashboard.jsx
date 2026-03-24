import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "../Components/I18nProvider";

const AdminDashboard = () => {
  const { t } = useI18n();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="admin-header">
        <h1>{t('dashboardTitle')}</h1>
        <p className="admin-dashboard-intro">{t('dashboardIntro')}</p>
      </div>
      <div className="admin-actions">
        <Link to='/admin/products' className="admin-btn">{t('adminManageProducts')}</Link>
        <Link to='/admin/categories' className="admin-btn">{t('adminManageCategories')}</Link>
        <Link to='/admin/users' className="admin-btn">{t('adminUsers')}</Link>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
