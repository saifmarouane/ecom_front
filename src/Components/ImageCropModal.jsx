import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function replaceFileExtension(filename, extWithDot) {
  const name = String(filename || "image");
  const idx = name.lastIndexOf(".");
  if (idx <= 0) return `${name}${extWithDot}`;
  return `${name.slice(0, idx)}${extWithDot}`;
}

export default function ImageCropModal({
  open,
  file,
  aspect = 1,
  outputWidth = 1200,
  outputHeight = 1200,
  title = "Crop image",
  hint = "",
  cancelLabel = "Cancel",
  applyLabel = "Apply",
  resetLabel = "Reset",
  zoomLabel = "Zoom",
  onCancel,
  onApply,
}) {
  const viewportRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSize, setImgSize] = useState(null); // {w,h}
  const [viewport, setViewport] = useState(null); // {w,h}
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const objectUrl = useMemo(() => {
    if (!open || !(file instanceof File)) return "";
    return URL.createObjectURL(file);
  }, [open, file]);

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setImgSize(null);
    setViewport(null);
    setSaving(false);
  }, [open, file]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setViewport({ w: rect.width, h: rect.height });
    };
    measure();
    const id = window.setTimeout(measure, 0);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  const baseScale = useMemo(() => {
    if (!imgSize || !viewport) return 1;
    return Math.max(viewport.w / imgSize.w, viewport.h / imgSize.h);
  }, [imgSize, viewport]);

  const scale = useMemo(() => baseScale * zoom, [baseScale, zoom]);

  const clampOffset = (nextOffset, nextScale = scale) => {
    if (!imgSize || !viewport) return nextOffset;
    const scaledW = imgSize.w * nextScale;
    const scaledH = imgSize.h * nextScale;
    const maxX = Math.max(0, (scaledW - viewport.w) / 2);
    const maxY = Math.max(0, (scaledH - viewport.h) / 2);
    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  };

  useEffect(() => {
    setOffset((p) => clampOffset(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, imgSize?.w, imgSize?.h, viewport?.w, viewport?.h]);

  const onPointerDown = (e) => {
    if (saving) return;
    const el = viewportRef.current;
    if (!el) return;
    e.preventDefault();
    el.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffset: offset };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(
      clampOffset({
        x: dragRef.current.startOffset.x + dx,
        y: dragRef.current.startOffset.y + dy,
      }),
    );
  };

  const onPointerUp = (e) => {
    const el = viewportRef.current;
    if (!el) return;
    dragRef.current = null;
    el.releasePointerCapture?.(e.pointerId);
  };

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const apply = async () => {
    if (saving) return;
    if (!imgRef.current || !imgSize || !viewport) return;
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Number(outputWidth) || 1);
      canvas.height = Math.max(1, Number(outputHeight) || 1);

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) throw new Error("Canvas not supported");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Map viewport pixels -> output pixels
      const canvasScale = canvas.width / viewport.w;
      ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);

      // Background for JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, viewport.w, viewport.h);

      const centerX = viewport.w / 2 + offset.x;
      const centerY = viewport.h / 2 + offset.y;
      const drawW = imgSize.w * scale;
      const drawH = imgSize.h * scale;
      const drawX = centerX - drawW / 2;
      const drawY = centerY - drawH / 2;

      ctx.drawImage(imgRef.current, drawX, drawY, drawW, drawH);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed to export image"))),
          "image/jpeg",
          0.9,
        );
      });

      const outName = replaceFileExtension(file?.name || "image.jpg", ".jpg");
      const outFile = new File([blob], outName, { type: blob.type || "image/jpeg" });
      onApply?.(outFile);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="crop-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="crop-modal">
        <div className="crop-modal-head">
          <div className="crop-modal-title">{title}</div>
          <button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>
            {cancelLabel}
          </button>
        </div>

        {hint ? <p className="crop-hint">{hint}</p> : null}

        <div
          className="crop-viewport"
          ref={viewportRef}
          style={{ aspectRatio: String(aspect || 1) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {objectUrl ? (
            <img
              ref={imgRef}
              className="crop-image"
              src={objectUrl}
              alt=""
              draggable={false}
              onLoad={() => {
                const el = imgRef.current;
                if (!el) return;
                setImgSize({ w: el.naturalWidth, h: el.naturalHeight });
              }}
              style={{
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              }}
            />
          ) : null}
        </div>

        <div className="crop-controls">
          <label className="crop-zoom">
            <span>{zoomLabel}</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value) || 1)}
              disabled={saving}
            />
          </label>

          <div className="crop-actions">
            <button type="button" className="btn ghost" onClick={reset} disabled={saving}>
              {resetLabel}
            </button>
            <button type="button" className="btn solid" onClick={apply} disabled={saving}>
              {saving ? "..." : applyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

