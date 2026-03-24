import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { useCart } from "../Components/CartProvider";
import { useI18n } from "../Components/I18nProvider";
import { useAuth } from "../Components/AuthProvider";

export default function Cart() {
  const { t } = useI18n();
  const { user } = useAuth();
  const cart = useCart();

  const total = useMemo(() => {
    return cart.items.reduce((sum, it) => {
      const p = it.product || {};
      const price = Number(p.price || 0);
      return sum + price * Number(it.quantity || 0);
    }, 0);
  }, [cart.items]);

  return (
    <div>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="cart-page">
          <div className="cart-head">
            <h1>{t("cart")}</h1>
            <div className="cart-actions">
              <Link className="btn ghost" to="/products">{t("continueShopping")}</Link>
              <button className="btn ghost danger" type="button" onClick={cart.clear} disabled={!cart.items.length}>
                {t("clearCart")}
              </button>
            </div>
          </div>

          {!cart.items.length ? (
            <div className="cart-empty">
              <p className="lede">{t("cartEmpty")}</p>
              <Link className="btn solid" to="/products">{t("browseProducts")}</Link>
            </div>
          ) : (
            <div className="cart-grid">
              <div className="cart-list">
                {cart.items.map((it) => {
                  const p = it.product || {};
                  const img = p.imageSmall || p.imageLarge;
                  return (
                    <div className="cart-row" key={it.id || it.productId}>
                      <div className="cart-thumb">
                        {img ? <img src={img} alt={p.name || "product"} /> : <div className="product-noimage">—</div>}
                      </div>
                      <div className="cart-info">
                        <div className="cart-title">{p.name || "-"}</div>
                        <div className="cart-sub">{p.category?.name || ""}</div>
                      </div>
                      <div className="cart-qty">
                        <button type="button" className="qty-btn" onClick={() => cart.setQty(it, Math.max(0, Number(it.quantity) - 1))}>-</button>
                        <input
                          value={it.quantity}
                          onChange={(e) => cart.setQty(it, Number(e.target.value))}
                          inputMode="numeric"
                        />
                        <button type="button" className="qty-btn" onClick={() => cart.setQty(it, Number(it.quantity) + 1)}>+</button>
                      </div>
                      <div className="cart-price">{Number(p.price || 0).toFixed(2)} €</div>
                      <div className="cart-remove">
                        <button type="button" className="btn ghost danger" onClick={() => cart.remove(it)}>{t("remove")}</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="cart-summary">
                <h2>{t("summary")}</h2>
                <div className="sum-row">
                  <span>{t("items")}</span>
                  <span>{cart.count}</span>
                </div>
                <div className="sum-row total">
                  <span>{t("total")}</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                {!user ? (
                  <Link className="btn solid" to="/login">{t("loginToCheckout")}</Link>
                ) : (
                  <button className="btn solid" type="button">{t("checkout")}</button>
                )}
                <p className="footnote">{t("cartNote")}</p>
              </aside>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

