/**
 * Illustration — composant <picture> réutilisable
 * AVIF (1024w) → WebP (640w + 1024w) avec srcset responsive
 * Aspect carré 1:1 (toutes les illustrations Gemini sont 1024×1024 ou 2048×2048)
 */
type Props = {
  /** Slug de fichier sans extension (ex: "menu-ia-multilingue") */
  slug: string;
  alt: string;
  /** sizes CSS (défaut adapté à une colonne d'illustration) */
  sizes?: string;
  className?: string;
  /** Hint navigateur LCP (uniquement pour above-the-fold) */
  priority?: boolean;
};

export function Illustration({
  slug,
  alt,
  sizes = "(max-width: 640px) 100vw, 480px",
  className = "",
  priority = false,
}: Props) {
  const base = `/illustrations/${slug}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}-1024.avif`} sizes={sizes} />
      <source
        type="image/webp"
        srcSet={`${base}-640.webp 640w, ${base}-1024.webp 1024w`}
        sizes={sizes}
      />
      <img
        src={`${base}-1024.webp`}
        alt={alt}
        width={1024}
        height={1024}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`block w-full h-auto ${className}`}
      />
    </picture>
  );
}
