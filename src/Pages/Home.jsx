import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";
import Seo from "../Components/Seo";
import OptimizedPicture from "../Components/OptimizedPicture";
import LazyImage from "../Components/LazyImage";
import { getCategories, toServerUrl } from "../services/api";
import honeyCombAvif640 from "../images/optimized/Honeycomb-w640.avif";
import honeyCombAvif960 from "../images/optimized/Honeycomb-w960.avif";
import honeyCombAvif1280 from "../images/optimized/Honeycomb-w1280.avif";
import honeyCombAvif1600 from "../images/optimized/Honeycomb-w1600.avif";
import honeyCombWebp640 from "../images/optimized/Honeycomb-w640.webp";
import honeyCombWebp960 from "../images/optimized/Honeycomb-w960.webp";
import honeyCombWebp1280 from "../images/optimized/Honeycomb-w1280.webp";
import honeyCombWebp1600 from "../images/optimized/Honeycomb-w1600.webp";

const ProductsSection = lazy(() => import("../Components/ProductsSection"));
const TestimonialsSection = lazy(() => import("../Components/TestimonialsSection"));

function toId(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

const Home = () => {
  const { t } = useI18n();
  const [categories, setCategories] = useState([]);
  const highlights = [
    { title: t("highlight1Title"), text: t("highlight1Txt") },
    { title: t("highlight2Title"), text: t("highlight2Txt") },
    { title: t("highlight3Title"), text: t("highlight3Txt") },
  ];

  const values = [
    { label: t("pillCold"), detail: t("pillColdTxt") },
    { label: t("pillLab"), detail: t("pillLabTxt") },
    { label: t("pillBee"), detail: t("pillBeeTxt") },
  ];

  useEffect(() => {
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
  }, []);

  const topCategories = useMemo(() => {
    return categories.filter((category) => {
      const parentId = toId(category?.parentId);
      return parentId === "" || parentId === "null";
    });
  }, [categories]);

		  return (
		    <div>
      <Seo
        title="Beldi Market | Boutique en ligne au Maroc"
        description="Beldi Market, votre boutique en ligne au Maroc. Produits locaux, livraison rapide."
        keywords="beldi market, maroc, e-commerce, produits locaux, miel, artisanat"
      />
	      <Header showCategories={false} />

	      <div className="home-layout">
	        <aside className="home-category-sidebar" aria-label={t("categories")}>
	          <div className="home-category-sidebar__title">{t("categories")}</div>
	          <Link className="home-category-link active" to="/products">
	            <span className="home-category-icon">⌁</span>
	            <span>{t("allCategories")}</span>
	          </Link>
	          {topCategories.map((category) => (
	            <Link className="home-category-link" key={category.id} to={`/categories/${category.id}`}>
	              {category.image ? (
	                <LazyImage
	                  className="home-category-icon home-category-img"
	                  src={toServerUrl(category.image)}
	                  alt={category.name}
	                  width={42}
	                  height={42}
	                />
	              ) : (
	                <span className="home-category-icon">◇</span>
	              )}
	              <span>{category.name}</span>
	            </Link>
	          ))}
	        </aside>

	        <div className="home-content">
	          <section className="highlight-grid">
	            {highlights.map((item) => (
	              <div className="card" key={item.title}>
	                <h3>{item.title}</h3>
	                <p>{item.text}</p>
	                <Link to="/about" className="link-arrow">{t("learnMore")}</Link>
	              </div>
	            ))}
	          </section>

	          <section className="story">
	            <div className="story__image">
	              <OptimizedPicture
	                alt="Honeycomb"
	                width={2752}
	                height={1536}
	                sizes="(max-width: 980px) 92vw, 520px"
	                srcSetAvif={`${honeyCombAvif640} 640w, ${honeyCombAvif960} 960w, ${honeyCombAvif1280} 1280w, ${honeyCombAvif1600} 1600w`}
	                srcSetWebp={`${honeyCombWebp640} 640w, ${honeyCombWebp960} 960w, ${honeyCombWebp1280} 1280w, ${honeyCombWebp1600} 1600w`}
	                src={honeyCombWebp960}
	                style={{ display: "block" }}
	              />
	            </div>
	            <div className="story__content">
	              <p className="eyebrow">{t("storyEyebrow")}</p>
	              <h2>{t("storyTitle")}</h2>
	              <p className="lede">
	                {t("storyLede")}
	              </p>
	              <div className="pill-row">
	                {values.map((value) => (
	                  <div className="pill" key={value.label}>
	                    <strong>{value.label}</strong>
	                    <span>{value.detail}</span>
	                  </div>
	                ))}
	              </div>
	            </div>
	          </section>

	          <Suspense fallback={null}>
	            <ProductsSection />
	          </Suspense>

	          <Suspense fallback={null}>
	            <TestimonialsSection />
	          </Suspense>

	          <section className="cta">
	            <div>
	              <p className="eyebrow">{t("ctaEyebrow")}</p>
	              <h2>{t("ctaTitle")}</h2>
	              <p className="lede">{t("ctaLede")}</p>
	              <div className="cta__form">
	                <input type="email" placeholder={t("ctaPlaceholder")} aria-label="Email" />
	                <button type="button">{t("ctaButton")}</button>
	              </div>
	              <p className="footnote">{t("ctaFootnote")}</p>
	            </div>
	          </section>
	        </div>
	      </div>
	    </div>
	  );
};

export default Home;

