import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "./I18nProvider";

const Footer = () => {
    const { t } = useI18n();
    return (
        <div className="footer-div">
            <div className="main-footer-section">
                <div className="footer-text">
                    <div className="footer-section">
                        <h1>{t('brand')}</h1>
                        <p>{t('heroLede')}</p>
                    </div>
                    <div className="footer-section">
                        <h2>{t('footerShop')}</h2>
                        <ul>
                            <li><Link to='/products'>Organic Forest Honey</Link></li>
                            <li><Link to='/products'>Raw Unprocessed Honey</Link></li>
                            <li><Link to='/products'>Wildflower Honey</Link></li>
                            <li><Link to='/products'>View all Products</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h2>{t('footerQuick')}</h2>
                        <ul>
                            <li><Link to='/'>{t('brand')}</Link></li>
                            <li><Link to='/about'>{t('footerAbout')}</Link></li>
                            <li><Link to='/products'>{t('productsTitle')}</Link></li>
                            <li><Link to='/blog'>{t('blogTitle')}</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section map-div">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58652.63718518435!2d69.62772033056196!3d23.250734077445316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3950e209000b6f17%3A0x7077f358af0774a6!2sBhuj%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1758004559084!5m2!1sen!2sin" className="map-display" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title='Our Location'></iframe>
                    </div>
                </div>
            </div>
            <div className="bottom-footer-section">
                <div className="bottom-footer-text">
                    <p>{t('footerCopy')}</p>
                    <p><Link to='/'>Privacy Policy</Link> | <Link to='/'>Sitemap</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Footer;
