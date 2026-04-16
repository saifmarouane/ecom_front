import React from "react";

export default function OptimizedPicture({
  alt = "",
  className,
  style,
  imgClassName,
  imgStyle,
  width,
  height,
  sizes,
  fetchPriority,
  loading = "lazy",
  decoding = "async",
  srcSetAvif,
  srcSetWebp,
  src,
  ...props
}) {
  return (
    <picture className={className} style={style}>
      {srcSetAvif ? <source type="image/avif" srcSet={srcSetAvif} sizes={sizes} /> : null}
      {srcSetWebp ? <source type="image/webp" srcSet={srcSetWebp} sizes={sizes} /> : null}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        style={imgStyle}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        {...props}
      />
    </picture>
  );
}
