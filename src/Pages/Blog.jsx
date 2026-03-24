import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import { useI18n } from "../Components/I18nProvider";

const Blog = () => {
  const { t } = useI18n();
  return (
    <div>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}>
        <div className="blog-section">
          <h1>{t('blogTitle')}</h1>
          <p className="blog-intro">
            {t('blogIntro')}
          </p>
          <div className="blog-posts">
            {/* Placeholder for blog posts */}
            <div className="blog-post">
              <h2>The Benefits of Raw Honey</h2>
              <p className="blog-post-date">January 15, 2026</p>
              <p className="blog-post-excerpt">
                Raw honey is more than just a sweetener. It's packed with antioxidants, 
                has antibacterial properties, and can help soothe sore throats.
              </p>
              <Link to='/blog/raw-honey-benefits'>Read More</Link>
            </div>
            <div className="blog-post">
              <h2>How to Start Your Own Beehive</h2>
              <p className="blog-post-date">January 10, 2026</p>
              <p className="blog-post-excerpt">
                Interested in beekeeping? Here's a beginner's guide to setting up your 
                first beehive and caring for your bees.
              </p>
              <Link to='/blog/start-beehive'>Read More</Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Blog;
