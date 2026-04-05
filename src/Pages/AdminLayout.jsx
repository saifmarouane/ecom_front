import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";
import { Helmet } from "react-helmet";
const AdminLayout = () => {
  const { t } = useI18n();
  const items = [
    { to: "/admin/dashboard", label: t("adminDashboard") },
    { to: "/admin/orders", label: t("adminOrders") },
    { to: "/admin/categories", label: t("adminCategories") },
    { to: "/admin/products", label: t("adminProducts") },
    { to: "/admin/users", label: t("adminUsers") },
  ];

  return (
    <div>
      <Header showCategories={false} />
      <div className="admin-shell">
        <aside className="admin-side">
          <Link className="admin-side__title" to="/admin/dashboard">
            {t("admin")}
          </Link>
          <nav className="admin-side__nav">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `admin-navlink ${isActive ? "active" : ""}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="admin-main">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
