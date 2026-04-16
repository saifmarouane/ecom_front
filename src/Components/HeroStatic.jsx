import React from "react";
import { Link } from "react-router-dom";

import { useI18n } from "./I18nProvider";
import OptimizedPicture from "./OptimizedPicture";

import homeHeroImgAvif640 from "../images/optimized/home-hero-img-w640.avif";
import homeHeroImgAvif960 from "../images/optimized/home-hero-img-w960.avif";
import homeHeroImgAvif1280 from "../images/optimized/home-hero-img-w1280.avif";
import homeHeroImgAvif1600 from "../images/optimized/home-hero-img-w1600.avif";
import homeHeroImgWebp640 from "../images/optimized/home-hero-img-w640.webp";
import homeHeroImgWebp960 from "../images/optimized/home-hero-img-w960.webp";
import homeHeroImgWebp1280 from "../images/optimized/home-hero-img-w1280.webp";
import homeHeroImgWebp1600 from "../images/optimized/home-hero-img-w1600.webp";

export default function HeroStatic() {
  const { t } = useI18n();

  return (
    <section className="hero">
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
          <OptimizedPicture
            alt="Honey jar"
            width={2752}
            height={1536}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 980px) 92vw, 520px"
            srcSetAvif={`${homeHeroImgAvif640} 640w, ${homeHeroImgAvif960} 960w, ${homeHeroImgAvif1280} 1280w, ${homeHeroImgAvif1600} 1600w`}
            srcSetWebp={`${homeHeroImgWebp640} 640w, ${homeHeroImgWebp960} 960w, ${homeHeroImgWebp1280} 1280w, ${homeHeroImgWebp1600} 1600w`}
            src={homeHeroImgWebp960}
            style={{ display: "block" }}
          />
          <div className="hero-card__body">
            <h3>{t("heroCardTitle")}</h3>
            <p>{t("heroCardDesc")}</p>
            <div className="price-row">
              <span className="price">DH18.00</span>
              <span className="badge">{t("priceInStock")}</span>
            </div>
            <Link className="btn full" to="/products">
              {t("addToCart")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
