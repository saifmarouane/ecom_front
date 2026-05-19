import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartProvider";
import { toServerUrl } from "../services/api";
import LazyImage from "./LazyImage";

export default function ProductGrid({ products }) {
  const cart = useCart();

  const list = Array.isArray(products) ? products : [];

  return (
    <div className={`products-grid ${list.length === 1 ? 'single-product' : ''}`}>
      {list.map((product) => (
        <div key={product.id} className="product-card modern">
          <Link to={`/products/${product.id}`} className="product-link">
            <div className="product-media">
	              {product.imageLarge || product.imageSmall ? (
	                <LazyImage
	                  className="product-image"
	                  src={toServerUrl(product.imageSmall || product.imageLarge)}
	                  alt={product.name}
	                  width={800}
	                  height={600}
	                />
		              ) : (
		                <div className="product-noimage">—</div>
		              )}
            </div>
            <div className="product-body">
              <span className="product-brand">{product.category?.name || "Beldi Market"}</span>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <div className="price-stack">
                  <span className="product-price">
                    {Number(product.price || 0).toFixed(2)} DH
                  </span>
                  {product.originalPrice && (
                    <span className="product-original">
                      {Number(product.originalPrice).toFixed(2)} DH
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="add-btn"
                  aria-label={`Ajouter ${product.name} au panier`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cart.add(product, 1);
                  }}
                >
                  <span className="cart-icon" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
