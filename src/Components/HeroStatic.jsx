import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import homeHeroImg from "../images/home-hero-img.webp";
import { useI18n } from "./I18nProvider";

export default function HeroStatic() {
  const { t } = useI18n();

  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="hero__content">
        <p className="eyebrow">{t("heroEyebrow")}</p>
        <h1>{t("heroTitle")}</h1>
        <p className="lede">{t("heroLede")}</p>
        <div className="hero__actions">
          <Link className="btn solid" to="/products">
            {t("heroBrowse")}
          </Link>
          <Link className="btn ghost" to="/about">
            {t("heroHow")}
          </Link>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <span>{t("statDelivery")}</span>
            <p>{t("statDeliveryTxt")}</p>
          </div>
          <div className="stat">
            <span>{t("statRating")}</span>
            <p>{t("statRatingTxt")}</p>
          </div>
          <div className="stat">
            <span>{t("statCo2")}</span>
            <p>{t("statCo2Txt")}</p>
          </div>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero-card">
          <div className="tag">{t("heroCardTag")}</div>
          <img src={homeHeroImg} alt="Honey jar" />
          <div className="hero-card__body">
            <h3>{t("heroCardTitle")}</h3>
            <p>{t("heroCardDesc")}</p>
            <div className="price-row">
              <span className="price">€18.00</span>
              <span className="badge">{t("priceInStock")}</span>
            </div>
            <Link className="btn full" to="/products">
              {t("addToCart")}
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

