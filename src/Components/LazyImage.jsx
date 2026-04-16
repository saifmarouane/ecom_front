import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function LazyImage({ src, alt = "", className, style, placeholderSrc, ...props }) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      style={style}
      placeholderSrc={placeholderSrc}
      effect="blur"
      threshold={100}
      loading={props.loading || "lazy"}
      decoding={props.decoding || "async"}
      {...props}
    />
  );
}
