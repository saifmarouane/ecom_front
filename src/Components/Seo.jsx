import React from "react";
import { Helmet } from "react-helmet";

const getCanonical = (fallbackPath) => {
  if (typeof window !== "undefined" && window.location) {
    return window.location.href;
  }
  return fallbackPath || "";
};

const Seo = ({
  title,
  description,
  keywords,
  url,
  image,
  type = "website",
  children,
}) => {
  const canonical = url || getCanonical();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {children}
    </Helmet>
  );
};

export default Seo;
