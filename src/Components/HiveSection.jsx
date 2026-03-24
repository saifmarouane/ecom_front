import React from "react";
import hiveimg from '../images/hive.webp';
import hiveDesign from '../images/hive-design.webp';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const HiveSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}>
      <div className="hive-home-section">
        <img src={hiveDesign} alt='' className="hive-design"></img>
        <div className="special-wrap">
          <div className="hive-img-section">
            <div className="tilted-bg">
              <img src={hiveimg} alt='From Hive to Home'></img></div>
          </div>
          <div className="hive-text-wrap">
            <u><h2>From Hive to Home</h2></u>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dapibus augue. Nulla eu est lacus. Nulla bibendum, metus scelerisque hendrerit pretium, eros turpis porttitor risus, id volutpat nisi nulla ac leo. Curabitur congue et odio et feugiat. Proin ullamcorper elementum risus eget accumsan. Aliquam at aliquet massa, eu lacinia leo. Aenean venenatis dolor vel pellentesque facilisis. Donec vitae ipsum in eros porta varius. Pellentesque sollicitudin faucibus orci, eu interdum quam scelerisque faucibus. Integer tincidunt quam sit amet metus condimentum, at viverra arcu ullamcorper. Vivamus odio velit, pretium ac lectus id, consequat lacinia mi.</p>
            <Link className="view-link" to='/#'>Know More</Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default HiveSection;