"use client";

/**
 * LazyImage — Blur-up progressive loading
 * Technique : placeholder base64 flou → image HD nette au chargement
 * Inspiration Adobe Lightroom : transition douce + color-grading CSS
 */

import { useRef, useState, useEffect, CSSProperties } from "react";
import Image, { ImageProps } from "next/image";

interface LazyImageProps extends Omit<ImageProps, "onLoad" | "placeholder"> {
  /** Petite image base64 floue (optionnelle, sinon shimmer CSS) */
  blurDataURL?: string;
  /** Active le filtre cinématique (contrast/saturate) */
  cinematic?: boolean;
  /** Classe wrapper (contient l'aspect-ratio) */
  wrapperClassName?: string;
  /** Style wrapper */
  wrapperStyle?: CSSProperties;
  /** Overlay teinté warm (mix-blend-mode multiply) */
  warmOverlay?: boolean;
}

export function LazyImage({
  blurDataURL,
  cinematic = false,
  wrapperClassName = "",
  wrapperStyle,
  warmOverlay = false,
  className = "",
  alt,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Intersection Observer — ne charge qu'au viewport */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cinematicClass = cinematic ? "img-cinematic" : "";
  const blurClass = `img-blur-up ${loaded ? "loaded" : ""}`;

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${warmOverlay ? "img-overlay-warm" : ""} ${wrapperClassName}`}
      style={wrapperStyle}
    >
      {/* Shimmer placeholder visible avant chargement */}
      {!loaded && (
        <div
          className="absolute inset-0 img-placeholder z-10"
          aria-hidden="true"
        />
      )}

      {/* Blur-up thumbnail si fourni */}
      {blurDataURL && !loaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 z-[5]"
        />
      )}

      {/* Image principale — chargée uniquement quand visible */}
      {visible && (
        <Image
          {...props}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`${blurClass} ${cinematicClass} ${className}`}
        />
      )}
    </div>
  );
}

/**
 * HeroImage — Version spécialisée pour les illustrations hero
 * Rapport golden ratio · filtre cinématique · overlay warm
 */
export function HeroImage({
  src,
  alt,
  width = 960,
  height = 580,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(priority); // si priority, pas de blur-up
  const blurClass = priority ? "" : `img-blur-up ${loaded ? "loaded" : ""}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-card img-overlay-warm">
      {/* Subtle gradient vignette — Photoshop Inner Glow */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, hsl(212,50%,8%,0.25) 100%)",
        }}
        aria-hidden="true"
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto ${blurClass} img-cinematic ${className}`}
      />
    </div>
  );
}
