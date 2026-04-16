import React from "react";
import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";
import Seo from "../Components/Seo";
import Reveal from "../Components/Reveal";
const Contact = () => {
  const { t } = useI18n();
  return (
    <div>
      <Seo
        title="Beldi Market | Contacts"
        description="Contactez Beldi Market, votre boutique en ligne au Maroc."
        keywords="beldi market, contact, support, service client, e-commerce"
      />
      <Header />
      <Reveal as="section">
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
      </Reveal>
    </div>
  );
};

export default Contact;
