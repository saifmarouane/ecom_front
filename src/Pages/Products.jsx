import React from "react";
import Header from "../Components/Header";
import ProductsSection from "../Components/ProductsSection";
import { useI18n } from "../Components/I18nProvider";
import Seo from "../Components/Seo";
import Reveal from "../Components/Reveal";
const Products = () => {
  const { t } = useI18n();
  return (
    <div>
      <Seo
        title="Beldi Market | Tous les produits"
        description="Découvrez tous les produits disponibles sur Beldi Market, votre boutique en ligne au Maroc."
        keywords="beldi market, produits, e-commerce, maroc, miel, artisanat"
      />
      <Header />
      <Reveal as="section">
        <div className="products-page">
          <h1>{t('productsPageTitle')}</h1>
          <p className="products-page-intro">
            {t('productsPageIntro')}
          </p>
          <ProductsSection />
        </div>
      </Reveal>
    </div>
  );
};

export default Products;
