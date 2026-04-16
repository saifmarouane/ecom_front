import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";

import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";
import HeroStatic from "../Components/HeroStatic";
import Seo from "../Components/Seo";
import OptimizedPicture from "../Components/OptimizedPicture";
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
const Home = () => {
  const { t } = useI18n();
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

	  return (
	    <div>
      <Seo
        title="Beldi Market | Boutique en ligne au Maroc"
        description="Beldi Market, votre boutique en ligne au Maroc. Produits locaux, livraison rapide."
        keywords="beldi market, maroc, e-commerce, produits locaux, miel, artisanat"
      />
      <Header />

      <HeroStatic />

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
  );
};

export default Home;

