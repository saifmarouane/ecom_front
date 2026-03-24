import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";

const About = () => {
  const { t } = useI18n();
  return (
    <div>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}>
        <div className="about-section">
          <div className="about-container">
            <h1>{t('aboutTitle')}</h1>
            <p className="about-text">
              {t('aboutTxt1')}
            </p>
            <p className="about-text">
              {t('aboutTxt2')}
            </p>
            <Link className="view-link" to='/products'>{t('aboutExplore')}</Link>
          </div>
          <div className="about-image">
            {/* Placeholder for about image */}
            <div className="about-placeholder">
              <p>About Image Placeholder</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
