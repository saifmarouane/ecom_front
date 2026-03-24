import React from "react";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import ProductsSection from "../Components/ProductsSection";
import { useI18n } from "../Components/I18nProvider";

const Products = () => {
  const { t } = useI18n();
  return (
    <div>
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
