import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import HeroStatic from "../Components/HeroStatic";
import ProductGrid from "../Components/ProductGrid";
import { getCategories, getProducts } from "../services/api";
import { useI18n } from "../Components/I18nProvider";

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

function parseSubList(value) {
  const raw = toId(value);
  if (!raw) return [];
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function Category() {
  const { t } = useI18n();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedSub = toId(searchParams.get("sub"));
  const selectedSubs = useMemo(() => parseSubList(searchParams.get("sub")), [searchParams]);
  const minParam = toId(searchParams.get("min"));
  const maxParam = toId(searchParams.get("max"));
  const minPrice = minParam ? Number(minParam) : null;
  const maxPrice = maxParam ? Number(maxParam) : null;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        if (!mounted) return;
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || t("productsError"));
        setCategories([]);
        setProducts([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, t]);

  const category = useMemo(() => {
    return (Array.isArray(categories) ? categories : []).find((c) => toId(c.id) === toId(id));
  }, [categories, id]);

  const subcategories = useMemo(() => {
    return (Array.isArray(categories) ? categories : []).filter((c) => toId(c.parentId) === toId(id));
  }, [categories, id]);

  useEffect(() => {
    if (!selectedSub) return;
    const wanted = parseSubList(selectedSub);
    const allowed = new Set(subcategories.map((c) => toId(c.id)));
    const next = wanted.filter((x) => allowed.has(x));
    if (next.length === 0) setSearchParams({});
    else if (next.join(",") !== wanted.join(",")) setSearchParams({ sub: next.join(","), ...(minParam ? { min: minParam } : {}), ...(maxParam ? { max: maxParam } : {}) });
  }, [selectedSub, subcategories, setSearchParams, minParam, maxParam]);

  const filteredProducts = useMemo(() => {
    if (!id) return [];

    const list = Array.isArray(products) ? products : [];

    const hasSubs = subcategories.length > 0;
    const subIds = new Set(subcategories.map((c) => toId(c.id)));

    // If the category has subcategories:
    // - default view shows products from ALL subcategories (not the parent)
    // - selecting a subcategory shows ONLY that subcategory's products
    // If no subcategories: show products directly under the category.
    let scoped = [];
    if (hasSubs) {
      scoped = list.filter((p) => subIds.has(productCategoryId(p)));
      if (selectedSubs.length > 0) {
        const selectedSet = new Set(selectedSubs);
        scoped = scoped.filter((p) => selectedSet.has(productCategoryId(p)));
      }
    } else {
      scoped = list.filter((p) => productCategoryId(p) === toId(id));
    }

    const priceFiltered = scoped.filter((p) => {
      const price = Number(p?.price ?? 0);
      if (minPrice !== null && !Number.isNaN(minPrice) && price < minPrice) return false;
      if (maxPrice !== null && !Number.isNaN(maxPrice) && price > maxPrice) return false;
      return true;
    });

    return priceFiltered;
  }, [products, id, subcategories, selectedSubs, minPrice, maxPrice]);

  const setParams = (next) => {
    const params = {};
    if (next.sub) params.sub = next.sub;
    if (next.min !== "" && next.min !== null && next.min !== undefined) params.min = String(next.min);
    if (next.max !== "" && next.max !== null && next.max !== undefined) params.max = String(next.max);
    setSearchParams(params);
  };

  const toggleSub = (subId) => {
    const current = new Set(selectedSubs);
    const key = toId(subId);
    if (!key) return;
    if (current.has(key)) current.delete(key);
    else current.add(key);
    const nextList = Array.from(current);
    nextList.sort();
    setParams({ sub: nextList.join(","), min: minParam, max: maxParam });
  };

  return (
    <div>
      <Header />
      <HeroStatic />

      <section className="category-products">
        <div className="products-header">
          <h2>
            {t("productsTitle")}
            {category?.name ? ` — ${category.name}` : ""}
          </h2>
          <p>{t("productsLede")}</p>
        </div>

        {loading && <p className="products-status">{t("productsLoading")}</p>}
        {!loading && error && <p className="products-status error">{error}</p>}

        {!loading && !error && (
          <div className="category-products__body">
            <aside className="filter-panel" aria-label={t("filters")}>
              <div className="filter-title">{t("filters")}</div>

              <div className="filter-group">
                <div className="filter-label">{t("subcategories")}</div>
                {subcategories.length === 0 ? (
                  <p className="filter-muted">{t("none")}</p>
                ) : (
                  <div className="subcategory-nav">
                    <label className="subcat-option">
                      <input
                        type="checkbox"
                        checked={selectedSubs.length === 0}
                        onChange={() => setParams({ sub: "", min: minParam, max: maxParam })}
                      />
                      <span>{t("allSubcategories")}</span>
                    </label>

                    {subcategories.map((sub) => {
                      const subId = toId(sub.id);
                      const checked = selectedSubs.includes(subId);
                      return (
                        <label key={sub.id} className="subcat-option">
                          <input type="checkbox" checked={checked} onChange={() => toggleSub(subId)} />
                          <span>{sub.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="filter-group">
                <div className="filter-label">{t("price")}</div>
                <div className="filter-row">
                  <label className="filter-field">
                    <span>{t("min")}</span>
                    <input
                      className="filter-input"
                      type="number"
                      inputMode="decimal"
                      value={minParam}
                      onChange={(e) => setParams({ sub: selectedSub, min: e.target.value, max: maxParam })}
                      placeholder="0"
                    />
                  </label>
                  <label className="filter-field">
                    <span>{t("max")}</span>
                    <input
                      className="filter-input"
                      type="number"
                      inputMode="decimal"
                      value={maxParam}
                      onChange={(e) => setParams({ sub: selectedSub, min: minParam, max: e.target.value })}
                      placeholder="999"
                    />
                  </label>
                </div>
                <div className="filter-actions">
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setSearchParams(selectedSub ? { sub: selectedSub } : {})}
                  >
                    {t("resetFilters")}
                  </button>
                </div>
              </div>
            </aside>

            <div className="category-products__grid">
              {filteredProducts.length === 0 ? (
                <p className="products-status">{t("productsEmpty")}</p>
              ) : (
                <ProductGrid products={filteredProducts} />
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
