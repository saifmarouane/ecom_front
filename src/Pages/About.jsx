import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import Seo from "../Components/Seo";
import { useI18n } from "../Components/I18nProvider";

const About = () => {
  const { lang } = useI18n();

  const content = {
    fr: {
      title: "À propos de nous – Beldimarket",
      subtitle: "Chez Beldimarket, nous ne faisons pas que vendre des produits…\nNous vous livrons l'âme du terroir 🌿",
      paragraph1: "Nous sommes une coopérative agricole située au cœur de la Chaouia, engagée chaque jour à vous proposer des produits naturels, authentiques et de qualité, directement de la ferme jusqu'à votre porte. Du lait frais aux légumes de saison, en passant par le miel, les plantes aromatiques, le safran et les dattes… chaque produit est soigneusement sélectionné et provient directement du travail de nos agriculteurs.",
      paragraph2: "Notre histoire est née d'une idée simple :\nPourquoi les consommateurs en ville n'auraient-ils pas accès à la même qualité que celle disponible dans les zones rurales ?",
      paragraph3: "C'est ainsi qu'est né Beldimarket…\nPour rapprocher le producteur du consommateur et redonner confiance aux produits du terroir marocain.",
      paragraph4: "Nous croyons que l'agriculture n'est pas seulement un métier…\nC'est un mode de vie, un héritage et une relation de confiance qui mérite d'être préservée ❤️",
      paragraph5: "Aujourd'hui, nous sommes fiers de faire partie des premières coopératives agricoles digitales au Maroc, combinant tradition et innovation pour vous offrir une expérience simple, fiable et moderne, avec une livraison directe jusqu'à votre domicile 🚚",
      closing: "Du terroir à votre table, avec confiance et passion 🤝"
    },
    en: {
      title: "About Us – Beldimarket",
      subtitle: "At Beldimarket, we don't just sell products…\nWe deliver the soul of local heritage 🌿",
      paragraph1: "We are an agricultural cooperative located in the heart of Chaouia, committed every day to offering you natural, authentic and quality products, directly from farm to your door. From fresh milk to seasonal vegetables, through honey, aromatic plants, saffron and dates… each product is carefully selected and comes directly from the work of our farmers.",
      paragraph2: "Our story was born from a simple idea:\nWhy shouldn't city consumers have access to the same quality available in rural areas?",
      paragraph3: "This is how Beldimarket was born…\nTo bring producer and consumer closer together and restore confidence in Moroccan local products.",
      paragraph4: "We believe that agriculture is not just a profession…\nIt's a way of life, a heritage and a relationship of trust that deserves to be preserved ❤️",
      paragraph5: "Today, we are proud to be among the first digital agricultural cooperatives in Morocco, combining tradition and innovation to offer you a simple, reliable and modern experience, with direct delivery to your home 🚚",
      closing: "From farm to your table, with confidence and passion 🤝"
    },
    ar: {
      title: "من نحن – بيلديماركت",
      subtitle: "في بيلديماركت، لا نبيع المنتجات فقط...\nنحن نوصل روح الموروث المحلي 🌿",
      paragraph1: "نحن تعاونية زراعية تقع في قلب الشاويا، ملتزمة كل يوم بتقديم لك منتجات طبيعية وأصلية وذات جودة عالية، مباشرة من المزرعة إلى بابك. من الحليب الطازج إلى الخضروات الموسمية، مرورًا بالعسل والنباتات العطرية والزعفران والتمر... كل منتج يتم انتقاؤه بعناية ويأتي مباشرة من عمل مزارعينا.",
      paragraph2: "وُلدت قصتنا من فكرة بسيطة:\nلماذا لا يتمتع المستهلكون في المدينة بنفس الجودة المتاحة في المناطق الريفية؟",
      paragraph3: "هكذا وُلدت بيلديماركت...\nللاقتراب بين المنتج والمستهلك واستعادة الثقة بالمنتجات المحلية المغربية.",
      paragraph4: "نحن نعتقد أن الزراعة ليست مجرد مهنة...\nإنها أسلوب حياة وتراث وعلاقة ثقة تستحق أن تُحافظ عليها ❤️",
      paragraph5: "اليوم، نحن فخورون بكوننا من أوائل التعاونيات الزراعية الرقمية في المغرب، حيث نجمع بين التقاليد والابتكار لنقدم لك تجربة بسيطة وموثوقة وحديثة، مع التوصيل المباشر إلى منزلك 🚚",
      closing: "من المزرعة إلى مائدتك، بثقة وشغف 🤝"
    }
  };

  const currentContent = content[lang] || content.fr;

  return (
    <div>
      <Seo
        title="Beldi Market | À propos"
        description="En savoir plus sur Beldi Market, la boutique en ligne marocaine dédiée aux produits locaux et au miel naturel."
        keywords="beldi market, à propos, boutique en ligne, miel, artisanat, maroc"
      />
      <Header />
      


      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}>
        <div className="about-section" style={{ padding: "40px 20px" }}>
          <div className="about-container" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.5em", marginBottom: "20px", color: "#8B4513", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.title}
            </h1>
            
            <p style={{ fontSize: "1.3em", fontStyle: "italic", marginBottom: "40px", lineHeight: "1.6", whiteSpace: "pre-line", color: "#5b5b5b", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.subtitle}
            </p>

            {/* Image 1 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                width: "100%",
                height: "300px",
                marginBottom: "30px",
                borderRadius: "10px",
                overflow: "hidden"
              }}>
<img src="images/about1.png" alt="About 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            <p className="about-text" style={{ fontSize: "1.1em", lineHeight: "1.8", marginBottom: "20px", color: "#5b5b5b", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.paragraph1}
            </p>

            <p className="about-text" style={{ fontSize: "1.1em", lineHeight: "1.8", marginBottom: "20px", color: "#5b5b5b", whiteSpace: "pre-line", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.paragraph2}
            </p>

            {/* Image 2 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                width: "100%",
                height: "300px",
                marginBottom: "30px",
                borderRadius: "10px",
                overflow: "hidden"
              }}>
<img src="images/about2.png" alt="About 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            <p className="about-text" style={{ fontSize: "1.1em", lineHeight: "1.8", marginBottom: "20px", color: "#5b5b5b", whiteSpace: "pre-line", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.paragraph3}
            </p>

            <p className="about-text" style={{ fontSize: "1.1em", lineHeight: "1.8", marginBottom: "20px", color: "#5b5b5b", whiteSpace: "pre-line", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.paragraph4}
            </p>

            {/* Image 3 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                width: "100%",
                height: "300px",
                marginBottom: "30px",
                borderRadius: "10px",
                overflow: "hidden"
              }}>
<img src="images/about3.png" alt="About 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            <p className="about-text" style={{ fontSize: "1.1em", lineHeight: "1.8", marginBottom: "30px", color: "#5b5b5b", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.paragraph5}
            </p>

            <h2 style={{ fontSize: "1.8em", fontStyle: "italic", color: "#5b5b5b", marginTop: "30px", paddingTop: "30px", borderTop: "2px solid #E8D5C4", textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {currentContent.closing}
            </h2>

            <Link className="view-link" to='/products' style={{
              display: "inline-block",
              marginTop: "30px",
              padding: "12px 30px",
              backgroundColor: "#8B4513",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}>
              Explore Products / Voir les Produits / منتجات الاستكشاف
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
