import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { getProductById, toServerUrl } from "../services/api";
import { useCart } from "../Components/CartProvider";
import { useI18n } from "../Components/I18nProvider";

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useI18n();
  const cart = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const p = await getProductById(id);
        if (mounted) setProduct(p);
      } catch (e) {
        if (mounted) setError(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const price = useMemo(() => Number(product?.price || 0), [product]);
  const original = useMemo(() => (product?.originalPrice ? Number(product.originalPrice) : null), [product]);
  const img = product?.imageLarge || product?.imageSmall || null;
  const imgUrl = useMemo(() => toServerUrl(img), [img]);

  return (
    <div>
            <Helmet>
        <title>{product.name} | Beldi Market</title>
        <meta
          name="description"
          content={`Achetez ${product.name} sur Beldi Market, boutique en ligne au Maroc. ${product.description}`}
        />
        <meta name="keywords" content={`beldi market, ${product.name}, produits locaux, e-commerce`} />
      </Helmet>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="pd-wrap">
          <div className="pd-breadcrumb">
            <Link to="/products">{t("productsTitle")}</Link> / <span>{product?.name || "-"}</span>
          </div>

          {loading && <p className="products-status">{t("loading")}</p>}
          {error && <p className="products-status error">{error}</p>}

          {!loading && product && (
            <div className="pd-grid">
	              <div className="pd-media">
	                <div className="pd-media-card">
	                  {imgUrl ? <img src={imgUrl} alt={product.name} /> : <div className="product-noimage">—</div>}
	                </div>
	              </div>
              <div className="pd-info">
                <p className="eyebrow">{product.category?.name || t("category")}</p>
                <h1 className="pd-title">{product.name}</h1>
                <p className="lede">{product.description || t("noDescription")}</p>

                <div className="pd-price">
                  <span className="pd-price-main">{price.toFixed(2)} €</span>
                  {original && <span className="pd-price-old">{original.toFixed(2)} €</span>}
                  <span className={`pd-stock ${product.stock > 0 ? "ok" : "no"}`}>
                    {product.stock > 0 ? t("inStock") : t("outOfStock")}
                  </span>
                </div>

                <div className="pd-buy">
                  <div className="pd-qty">
                    <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                    <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
                    <button type="button" className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
                  </div>
                  <button
                    type="button"
                    className="btn solid"
                    onClick={() => cart.add(product, qty)}
                    disabled={product.stock <= 0}
                  >
                    {t("addToCart")}
                  </button>
                  <Link className="btn ghost" to="/cart">{t("goToCart")}</Link>
                </div>

                <div className="pd-meta">
                  <div className="pill">
                    <strong>{t("stock")}</strong>
                    <span>{product.stock ?? 0}</span>
                  </div>
                  <div className="pill">
                    <strong>{t("active")}</strong>
                    <span>{product.isActive ? t("active") : t("inactive")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
