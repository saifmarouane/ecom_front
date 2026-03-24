import React from "react";
import { Link } from "react-router-dom";
import honeyComb from "../images/honeycomb.webp";

import ProductsSection from "../Components/ProductsSection";
import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";
import HeroStatic from "../Components/HeroStatic";

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
          <img src={honeyComb} alt="Honeycomb" />
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

      <ProductsSection />

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

