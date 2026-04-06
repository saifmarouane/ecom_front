import React from "react";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import Seo from "../Components/Seo";
import { useI18n } from "../Components/I18nProvider";

const Blog = () => {
  const { lang } = useI18n();

  const blogPosts = {
    fr: [
      {
        id: 1,
        title: "📝 La coopérative agricole à l'ère digitale",
        date: "6 Avril 2026",
        imageDescription: "ضيعة + فلاح كيخدم + téléphone ولا ordinateur (فكرة ديال modern + traditionnel)",
        content: "Dans un monde en pleine transformation digitale, même l'agriculture évolue.\nLes coopératives agricoles ne sont plus seulement des structures locales, mais deviennent aujourd'hui des acteurs modernes capables de connecter directement le producteur au consommateur.\n\nGrâce au digital, une coopérative peut désormais présenter ses produits en ligne, communiquer avec ses clients et élargir son marché bien au-delà de sa région.\n\nChez Beldimarket, nous croyons que la technologie est une opportunité pour valoriser le travail des agriculteurs, améliorer leur visibilité et offrir aux consommateurs un accès simple à des produits authentiques.\n\nLa coopérative digitale, c'est l'avenir d'une agriculture plus équitable, plus transparente et plus proche du consommateur."
      },
      {
        id: 2,
        title: "📝 Le rôle du produit 'Beldi' dans la vie du consommateur",
        date: "6 Avril 2026",
        imageDescription: "خضرة بلدية + عسل + زيتون (table naturelle)",
        content: "Aujourd'hui, le consommateur recherche plus que jamais des produits sains, naturels et authentiques.\nLe 'Beldi' n'est pas seulement un produit… c'est un symbole de qualité, de tradition et de confiance.\n\nContrairement aux produits industriels, les produits beldi sont souvent cultivés de manière naturelle, avec un respect du rythme de la terre et du savoir-faire traditionnel.\n\nConsommer beldi, c'est faire le choix de la santé, mais aussi soutenir les agriculteurs locaux et préserver un héritage agricole précieux.\n\nChez Beldimarket, nous mettons en avant cette richesse pour offrir à nos clients une alimentation plus saine et plus responsable."
      },
      {
        id: 3,
        title: "📝 Le digital et la livraison à domicile : une révolution",
        date: "6 Avril 2026",
        imageDescription: "Livreur + panier de produits + livraison للدار",
        content: "Le digital a profondément changé nos habitudes de consommation.\nAujourd'hui, il est possible de commander en quelques clics et de recevoir ses produits directement chez soi.\n\nDans le domaine agricole, cette évolution est une véritable révolution.\nElle permet de supprimer les intermédiaires et de garantir des produits plus frais, livrés rapidement du producteur au consommateur.\n\nLa livraison à domicile apporte confort, gain de temps et sécurité, tout en renforçant le lien entre la ferme et le client.\n\nBeldimarket s'inscrit dans cette dynamique en proposant une expérience simple, moderne et fiable, adaptée aux besoins des consommateurs d'aujourd'hui."
      },
      {
        id: 4,
        title: "📝 Du champ à votre table : une chaîne de confiance",
        date: "6 Avril 2026",
        imageDescription: "فلاح كيحصد + produit كيوصل للدار (avant/après)",
        content: "Derrière chaque produit agricole, il y a une histoire…\ncelle d'un agriculteur, d'une terre et d'un savoir-faire transmis de génération en génération.\n\nChez Beldimarket, nous avons fait le choix de réduire la distance entre le champ et votre table.\nNos produits passent directement de la coopérative à votre domicile, sans compromis sur la qualité.\n\nCette proximité garantit fraîcheur, traçabilité et surtout confiance.\n\nNotre mission est simple :\nvous offrir des produits authentiques, tout en valorisant le travail de ceux qui les cultivent."
      }
    ],
    en: [
      {
        id: 1,
        title: "📝 Agricultural Cooperatives in the Digital Age",
        date: "April 6, 2026",
        imageDescription: "Farm + farmer working + phone or computer (modern + traditional concept)",
        content: "In a world undergoing digital transformation, agriculture is evolving too.\nAgricultural cooperatives are no longer just local structures, but have become modern actors capable of connecting producers directly to consumers.\n\nThanks to digital technology, a cooperative can now present its products online, communicate with its customers, and expand its market far beyond its region.\n\nAt Beldimarket, we believe that technology is an opportunity to enhance the work of farmers, improve their visibility, and offer consumers simple access to authentic products.\n\nThe digital cooperative is the future of more equitable, transparent agriculture that is closer to the consumer."
      },
      {
        id: 2,
        title: "📝 The Role of 'Beldi' Products in Consumer Life",
        date: "April 6, 2026",
        imageDescription: "Local vegetables + honey + olives (natural table)",
        content: "Today, consumers are searching more than ever for healthy, natural, and authentic products.\n'Beldi' is not just a product… it's a symbol of quality, tradition, and trust.\n\nUnlike industrial products, beldi products are often grown naturally, with respect for the rhythm of the earth and traditional know-how.\n\nConsuming beldi is making a choice for health, but also supporting local farmers and preserving precious agricultural heritage.\n\nAt Beldimarket, we highlight this richness to offer our customers healthier and more responsible nutrition."
      },
      {
        id: 3,
        title: "📝 Digital and Home Delivery: A Revolution",
        date: "April 6, 2026",
        imageDescription: "Delivery person + basket of products + home delivery",
        content: "Digital technology has profoundly changed our consumption habits.\nToday, it's possible to order in just a few clicks and receive your products directly at home.\n\nIn the agricultural sector, this evolution is a true revolution.\nIt eliminates intermediaries and guarantees fresher products, delivered quickly from producer to consumer.\n\nHome delivery brings convenience, time savings, and security, while strengthening the bond between farm and customer.\n\nBeldimarket embodies this dynamic by offering a simple, modern, and reliable experience tailored to today's consumers' needs."
      },
      {
        id: 4,
        title: "📝 From Field to Your Table: A Chain of Trust",
        date: "April 6, 2026",
        imageDescription: "Farmer harvesting + product being delivered home (before/after)",
        content: "Behind every agricultural product is a story…\nthat of a farmer, a land, and a know-how passed down through generations.\n\nAt Beldimarket, we chose to reduce the distance between the field and your table.\nOur products go directly from the cooperative to your home, without compromising quality.\n\nThis proximity guarantees freshness, traceability, and above all trust.\n\nOur mission is simple:\nto offer you authentic products while valorizing the work of those who cultivate them."
      }
    ],
    ar: [
      {
        id: 1,
        title: "📝 التعاونية الزراعية في العصر الرقمي",
        date: "6 أبريل 2026",
        imageDescription: "ضيعة + فلاح يعمل + هاتف أو حاسوب (مفهوم حديث + تقليدي)",
        content: "في عالم يشهد تحولًا رقميًا كاملاً، حتى الزراعة تتطور.\nالتعاونيات الزراعية لم تعد مجرد هياكل محلية، بل أصبحت اليوم جهات فاعلة حديثة قادرة على ربط المنتج بالمستهلك مباشرة.\n\nبفضل التكنولوجيا الرقمية، يمكن للتعاونية الآن عرض منتجاتها عبر الإنترنت والتواصل مع عملائها وتوسيع سوقها بعيدًا عن منطقتها.\n\nفي بيلديماركت، نعتقد أن التكنولوجيا هي فرصة لتحسين عمل المزارعين وزيادة رؤيتهم وتقديم وصول بسيط للمستهلكين للمنتجات الأصلية.\n\nالتعاونية الرقمية هي مستقبل زراعة أكثر عدلاً وشفافية وأقرب للمستهلك."
      },
      {
        id: 2,
        title: "📝 دور منتجات 'البلدي' في حياة المستهلك",
        date: "6 أبريل 2026",
        imageDescription: "خضروات محلية + عسل + زيتون (طاولة طبيعية)",
        content: "في الوقت الحالي، يبحث المستهلكون أكثر من أي وقت مضى عن منتجات صحية وطبيعية وأصلية.\n'البلدي' ليس مجرد منتج... إنه رمز الجودة والتقاليد والثقة.\n\nعلى عكس المنتجات الصناعية، غالبًا ما تُزرع المنتجات البلدية بطريقة طبيعية، مع احترام إيقاع الأرض والمهارات التقليدية.\n\nشراء البلدي يعني اختيار الصحة، بل أيضًا دعم المزارعين المحليين والحفاظ على تراث زراعي ثمين.\n\nفي بيلديماركت، نركز على هذه الثروة لنقدم لعملائنا تغذية أكثر صحة ومسؤولية."
      },
      {
        id: 3,
        title: "📝 التكنولوجيا الرقمية والتسليم للمنزل: ثورة",
        date: "6 أبريل 2026",
        imageDescription: "شخص التوصيل + سلة منتجات + توصيل للمنزل",
        content: "غيّرت التكنولوجيا الرقمية عاداتنا الاستهلاكية بشكل جذري.\nاليوم، من الممكن الطلب ببضع نقرات واستقبال منتجاتك مباشرة في منزلك.\n\nفي القطاع الزراعي، هذا التطور هو ثورة حقيقية.\nيسمح بحذف الوسطاء وضمان منتجات أكثر طازة، يتم توصيلها بسرعة من المنتج للمستهلك.\n\nالتسليم للمنزل يجلب الراحة والوقت والأمان، مع تعزيز العلاقة بين المزرعة والعميل.\n\nبيلديماركت تجسد هذا الديناميكية من خلال تقديم تجربة بسيطة وحديثة وموثوقة مناسبة لاحتياجات المستهلكين اليوم."
      },
      {
        id: 4,
        title: "📝 من الحقل إلى مائدتك: سلسلة الثقة",
        date: "6 أبريل 2026",
        imageDescription: "مزارع يحصد + منتج يوصل للمنزل (قبل/بعد)",
        content: "خلف كل منتج زراعي توجد قصة...\nقصة مزارع وأرض ومهارة تناقلتها الأجيال.\n\nفي بيلديماركت، اخترنا تقليل المسافة بين الحقل ومائدتك.\nتنتقل منتجاتنا مباشرة من التعاونية إلى منزلك، بدون المساس بالجودة.\n\nتضمن هذه القرب الطزاجة والقابلية للتتبع والثقة بالدرجة الأولى.\n\nمهمتنا بسيطة:\nتقديم منتجات أصلية لك، مع تقييم عمل من يزرعونها."
      }
    ]
  };

  const posts = blogPosts[lang] || blogPosts.fr;

  return (
    <div>
      <Seo
        title="Beldi Market | Blog"
        description="Découvrez nos derniers articles sur le miel, l'artisanat et la vie en général."
        keywords="beldi market, blog, miel, artisanat, conseils, commerce en ligne"
      />
      <Header />



      {/* Blog Posts */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}>
        <div className="blog-section" style={{ padding: "40px 20px" }}>
          <h1 style={{ fontSize: "2.5em", marginBottom: "40px", color: "#8B4513", textAlign: "center" }}>Notre Blog</h1>
          <div className="blog-posts" style={{ maxWidth: "900px", margin: "0 auto" }}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                className="blog-post"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  marginBottom: "50px",
                  paddingBottom: "40px",
                  borderBottom: index !== posts.length - 1 ? "2px solid #E8D5C4" : "none"
                }}>
                <h2 style={{ fontSize: "1.8em", color: "#8B4513", marginBottom: "10px", textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  {post.title}
                </h2>
                <p className="blog-post-date" style={{ color: "#fff", marginBottom: "30px", fontStyle: "italic", textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  {post.date}
                </p>

                {/* Image Placeholder */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    width: "100%",
                    height: "350px",
                    marginBottom: "30px",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                  <div className="blog-image-placeholder" style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#E8D5C4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #8B4513",
                    padding: "20px",
                    textAlign: "center"
                  }}>
                    <p style={{ color: "#8B4513", fontSize: "1.1em", fontWeight: "bold" }}>
                      📷 {post.imageDescription}
                    </p>
                  </div>
                </motion.div>

                <p className="blog-post-content" style={{
                  fontSize: "1.1em",
                  lineHeight: "1.8",
                  color: "#fff",
                  marginBottom: "20px",
                  whiteSpace: "pre-line",
                  textAlign: lang === 'ar' ? 'right' : 'left'
                }}>
                  {post.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Blog;
