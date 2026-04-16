import React from "react";
import hiveimg from '../images/hive.webp';
import hiveDesign from '../images/hive-design.webp';
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";
import Reveal from "./Reveal";


const HiveSection = () => {
  return (
    <Reveal as="section">
      <div className="hive-home-section">
        <LazyImage src={hiveDesign} alt='' className="hive-design" />
        <div className="special-wrap">
          <div className="hive-img-section">
            <div className="tilted-bg">
              <LazyImage src={hiveimg} alt='From Hive to Home' /></div>
          </div>
          <div className="hive-text-wrap">
            <u><h2>From Hive to Home</h2></u>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dapibus augue. Nulla eu est lacus. Nulla bibendum, metus scelerisque hendrerit pretium, eros turpis porttitor risus, id volutpat nisi nulla ac leo. Curabitur congue et odio et feugiat. Proin ullamcorper elementum risus eget accumsan. Aliquam at aliquet massa, eu lacinia leo. Aenean venenatis dolor vel pellentesque facilisis. Donec vitae ipsum in eros porta varius. Pellentesque sollicitudin faucibus orci, eu interdum quam scelerisque faucibus. Integer tincidunt quam sit amet metus condimentum, at viverra arcu ullamcorper. Vivamus odio velit, pretium ac lectus id, consequat lacinia mi.</p>
            <Link className="view-link" to='/#'>Know More</Link>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default HiveSection;
