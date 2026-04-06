import React from "react";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import ProductsSection from "../Components/ProductsSection";
import { useI18n } from "../Components/I18nProvider";
import Seo from "../Components/Seo";
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
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}>
        <div className="products-page">
          <h1>{t('productsPageTitle')}</h1>
          <p className="products-page-intro">
            {t('productsPageIntro')}
          </p>
          <ProductsSection />
        </div>
      </motion.section>
    </div>
  );
};

export default Products;
