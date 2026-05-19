import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import ProductGrid from "../Components/ProductGrid";
import { useI18n } from "../Components/I18nProvider";
import Seo from "../Components/Seo";
import Reveal from "../Components/Reveal";
import { getCategories, getProducts } from "../services/api";

const PAGE_SIZE = 6;

const categoryIcons = ["⌁", "◇", "□", "○", "△", "◌"];

function toId(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if (value.id) return String(value.id);
    if (value._id) return String(value._id);
    if (value.$oid) return String(value.$oid);
  }
  return String(value);
}

function productCategoryId(product) {
  return toId(product?.categoryId || product?.category?.id || product?.category?._id);
}

const Products = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        if (!mounted) return;
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || t("productsError"));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [t]);

  const rootCategories = useMemo(() => {
    return categories.filter((category) => {
      const parentId = toId(category?.parentId);
      return parentId === "" || parentId === "null";
    });
  }, [categories]);

  const categoryById = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(toId(category.id), category));
    return map;
  }, [categories]);

  const activeSubcategories = useMemo(() => {
    if (!activeCategory) return [];
    return categories.filter((category) => toId(category.parentId) === activeCategory);
  }, [activeCategory, categories]);

  const productCounts = useMemo(() => {
    const counts = new Map();

    products.forEach((product) => {
      const ownId = productCategoryId(product);
      const parentId = toId(categoryById.get(ownId)?.parentId);
      const rootId = parentId && parentId !== "null" ? parentId : ownId;
      counts.set(rootId, (counts.get(rootId) || 0) + 1);
      counts.set(ownId, (counts.get(ownId) || 0) + 1);
    });

    return counts;
  }, [categoryById, products]);

  const filteredProducts = useMemo(() => {
    const activeSubs = activeSubcategories.map((category) => toId(category.id));
    const allowedIds = new Set(activeCategory ? [activeCategory, ...activeSubs] : []);
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const filtered = products.filter((product) => {
      const categoryId = productCategoryId(product);
      const price = Number(product?.price || 0);
      const productRating = Number(product?.rating || product?.stars || 5);
      const searchable = [product?.name, product?.description, product?.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (allowedIds.size > 0 && !allowedIds.has(categoryId)) return false;
      if (min !== null && !Number.isNaN(min) && price < min) return false;
      if (max !== null && !Number.isNaN(max) && price > max) return false;
      if (rating > 0 && productRating < rating) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-desc") return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === "newest") return Number(b.id || 0) - Number(a.id || 0);
      return Number(b.stock || 0) - Number(a.stock || 0);
    });
  }, [activeCategory, activeSubcategories, maxPrice, minPrice, products, query, rating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCategoryName = activeCategory ? categoryById.get(activeCategory)?.name : t("allCategories");

  useEffect(() => {
    setPage(1);
  }, [activeCategory, minPrice, maxPrice, query, rating, sortBy]);

  return (
    <div>
      <Seo
        title="Beldi Market | Tous les produits"
        description="Découvrez tous les produits disponibles sur Beldi Market, votre boutique en ligne au Maroc."
        keywords="beldi market, produits, e-commerce, maroc, miel, artisanat"
      />
      <Header showCategories={false} />
      <Reveal as="section">
        <div className="products-page catalog-page">
          <aside className="catalog-sidebar" aria-label={t("categories")}>
            <div className="catalog-sidebar__head">
              <h2>{t("categories")}</h2>
              <span>{products.length}</span>
            </div>

            <button
              type="button"
              className={`catalog-category ${activeCategory === "" ? "active" : ""}`}
              onClick={() => setActiveCategory("")}
            >
              <span className="catalog-category__icon">⌁</span>
              <span>{t("allCategories")}</span>
              <small>{products.length}</small>
            </button>

            {rootCategories.map((category, index) => {
              const id = toId(category.id);
              const isActive = activeCategory === id;

              return (
                <div key={category.id} className="catalog-category-group">
                  <button
                    type="button"
                    className={`catalog-category ${isActive ? "active" : ""}`}
                    onClick={() => setActiveCategory(id)}
                  >
                    <span className="catalog-category__icon">{categoryIcons[index % categoryIcons.length]}</span>
                    <span>{category.name}</span>
                    <small>{productCounts.get(id) || 0}</small>
                  </button>

                  {isActive && activeSubcategories.length > 0 && (
                    <div className="catalog-subcategories">
                      {activeSubcategories.map((sub) => (
                        <span key={sub.id}>{sub.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="catalog-filter">
              <h3>{t("price")}</h3>
              <div className="catalog-price-row">
                <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" placeholder={t("min")} />
                <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" placeholder={t("max")} />
              </div>
            </div>

            <div className="catalog-filter">
              <h3>Note</h3>
              <div className="rating-filter" aria-label="Filtrer par note">
                {[5, 4, 3, 2, 1].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={rating === value ? "active" : ""}
                    onClick={() => setRating((current) => (current === value ? 0 : value))}
                  >
                    {"★".repeat(value)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="catalog-main">
            <div className="catalog-breadcrumb">
              <span>{t("navHome")}</span>
              <span>/</span>
              <strong>{activeCategoryName}</strong>
            </div>

            <div className="catalog-toolbar">
              <div>
                <h1>{t("productsPageTitle")}</h1>
                <p>{filteredProducts.length} résultats</p>
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Trier les produits">
                <option value="popular">Popularité</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>

            {loading && <p className="products-status">{t("productsLoading")}</p>}
            {!loading && error && <p className="products-status error">{error}</p>}
            {!loading && !error && paginatedProducts.length === 0 && <p className="products-status">{t("productsEmpty")}</p>}
            {!loading && !error && paginatedProducts.length > 0 && <ProductGrid products={paginatedProducts} />}

            {!loading && !error && totalPages > 1 && (
              <div className="catalog-pagination" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={pageNumber === currentPage ? "active" : ""}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </Reveal>
    </div>
  );
};

export default Products;
