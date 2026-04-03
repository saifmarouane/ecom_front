import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useI18n } from "./I18nProvider";
import { useCart } from "./CartProvider";
import { getCategories, toServerUrl } from "../services/api";
import marklogo from '../images/marklogo.png';

function toId(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

const Header = ({ showCategories = true }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const cart = useCart();
  const [categories, setCategories] = useState([]);

  const navItems = [
    { label: t("navHome"), to: "/" },
    { label: t("navProducts"), to: "/products" },
    { label: t("navContact"), to: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsOpen(false);
    setIsBrandOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!showCategories) return;
    let mounted = true;

    (async () => {
      try {
        const list = await getCategories();
        if (!mounted) return;
        setCategories(Array.isArray(list) ? list : []);
      } catch {
        if (!mounted) return;
        setCategories([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [showCategories]);

  const topCategories = useMemo(() => {
    // Show only root categories (exclude children/subcategories) in the menu.
    const list = Array.isArray(categories) ? categories : [];
    return list.filter((c) => {
      const parentId = toId(c?.parentId);
      return parentId === "" || parentId === "null";
    });
  }, [categories]);

  const isCategoryRoute = location.pathname.startsWith("/categories/");

  return (
    <header className={`topbar ${isOpen ? "topbar-open" : ""}`}>
      <div className="topbar-inner">
        <Link className="brand" to="/">
          <img className="brand-mark" src={marklogo} alt="BeldiMarket" />
          <span className="brand-text">{t("brandMarket")}</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <nav className={`nav ${isOpen ? "nav-open" : ""}`}>
          {navItems.slice(0, 1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${isActive(item.to) ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className={`nav-dropdown ${isBrandOpen ? "open" : ""}`}>
            <button
              type="button"
              className="nav-link nav-dropdown-btn"
              aria-haspopup="menu"
              aria-expanded={isBrandOpen}
              onClick={() => setIsBrandOpen((prev) => !prev)}
            >
              {t("navBrand")} <span className="nav-caret" aria-hidden="true">▾</span>
            </button>
            <div className="nav-dropdown-menu" role="menu">
              <Link className="nav-dropdown-item" role="menuitem" to="/about" onClick={() => { setIsBrandOpen(false); setIsOpen(false); }}>
                {t("navAbout")}
              </Link>
              <Link className="nav-dropdown-item" role="menuitem" to="/blog" onClick={() => { setIsBrandOpen(false); setIsOpen(false); }}>
                {t("navBlog")}
              </Link>
              <Link className="nav-dropdown-item" role="menuitem" to="/about" onClick={() => { setIsBrandOpen(false); setIsOpen(false); }}>
                {t("ourStory")}
              </Link>
            </div>
          </div>

          {navItems.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${isActive(item.to) ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="nav-actions">
            <Link className="btn solid" to="/products" onClick={() => setIsOpen(false)}>
              {t("shopNow")}
            </Link>
            <Link className="btn ghost cart-btn" to="/cart" onClick={() => setIsOpen(false)}>
              {t("cart")} <span className="cart-count">{cart.count}</span>
            </Link>
            {user?.role === "admin" ? (
              <>
                <Link className="btn ghost" to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  {t("admin")}
                </Link>
                <button
                  className="btn ghost logout-btn"
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  {t("logout")}
                </button>
              </>
            ) : user ? (
              <>
                <Link className="btn ghost" to="/" onClick={() => setIsOpen(false)}>
                  {user.username}
                </Link>
                <button
                  className="btn ghost logout-btn"
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link className="btn ghost" to="/login" onClick={() => setIsOpen(false)}>
                {t("loginBtn")}
              </Link>
            )}
            <select
              className="lang-switch"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                setIsOpen(false);
                setIsBrandOpen(false);
              }}
            >
              <option value="ar">{t("langAr")}</option>
              <option value="en">{t("langEn")}</option>
              <option value="fr">{t("langFr")}</option>
            </select>
          </div>
        </nav>
      </div>

      {showCategories && topCategories.length > 0 && (
        <div className="categorybar" role="navigation" aria-label={t("categories")}>
          <div className="categorybar-inner">
            <Link
              to="/products"
              className={`categorybar-link ${location.pathname === "/products" ? "active" : ""}`}
            >
              {t("allCategories")}
            </Link>
            {topCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className={`categorybar-link ${isCategoryRoute && location.pathname.startsWith(`/categories/${cat.id}`) ? "active" : ""}`}
              >
                {cat.image ? (
                  <img className="categorybar-thumb" src={toServerUrl(cat.image)} alt={cat.name} loading="lazy" />
                ) : null}
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
