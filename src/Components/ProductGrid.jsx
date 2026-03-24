import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export default function ProductGrid({ products }) {
  const cart = useCart();
  const { t } = useI18n();

  const list = Array.isArray(products) ? products : [];

  return (
    <div className="products-grid">
      {list.map((product) => (
        <div key={product.id} className="product-card modern">
          <Link to={`/products/${product.id}`} className="product-link">
            <div className="product-media">
              {product.imageLarge || product.imageSmall ? (
                <img
                  className="product-image"
                  src={product.imageSmall || product.imageLarge}
                  alt={product.name}
                  loading="lazy"
                />
              ) : (
                <div className="product-noimage">—</div>
              )}
              {product.category?.name && (
                <div className="product-pill">{product.category.name}</div>
              )}
            </div>
            <div className="product-body">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <div className="price-stack">
                  <span className="product-price">
                    {Number(product.price || 0).toFixed(2)} €
                  </span>
                  {product.originalPrice && (
                    <span className="product-original">
                      {Number(product.originalPrice).toFixed(2)} €
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn ghost add-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cart.add(product, 1);
                  }}
                >
                  {t("addToCart")}
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

