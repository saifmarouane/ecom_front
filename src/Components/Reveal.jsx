import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  as: As = "div",
  className = "",
  style,
  children,
  once = true,
  rootMargin = "120px 0px",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { root: null, rootMargin, threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return (
    <As ref={ref} className={`reveal ${visible ? "reveal--visible" : ""} ${className}`.trim()} style={style}>
      {children}
    </As>
  );
}

