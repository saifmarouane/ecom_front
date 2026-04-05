import React from "react";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";
import { Helmet } from "react-helmet";
const Contact = () => {
  const { t } = useI18n();
  return (
    <div>
            <Helmet>
        <title>Beldi Market | Contacts</title>
        <meta
          name="description"
          content="Contactez Beldi Market, votre boutique en ligne au Maroc."
        />
        <meta name="keywords" content="beldi market, produits, e-commerce, maroc, miel, artisanat" />
      </Helmet>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}>
        <div className="contact-section">
          <h1>{t('contactTitle')}</h1>
          <p className="contact-intro">
            {t('contactIntro')}
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <h3>{t('contactEmail')}</h3>
              <p>marouane@beldimarket.ma</p>
            </div>
            <div className="contact-item">
              <h3>{t('contactPhone')}</h3>
              <p>+212 666599460</p>
            </div>
            <div className="contact-item">
              <h3>{t('contactAddress')}</h3>
              <p>Salmia 2, Casablanca, Maroc</p>
            </div>
          </div>
          <div className="contact-form">
            <h2>{t('contactFormTitle')}</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">{t('contactName')}</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">{t('contactSubject')}</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('contactMessage')}</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">{t('contactSend')}</button>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
