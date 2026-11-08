"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Extrait de reel en boucle silencieuse ; lu seulement à l'écran, jamais si l'utilisateur réduit les animations.
 * Avec `fade`, la vidéo apparaît en fondu par-dessus l'image déjà affichée dessous (hero : l'image reste le LCP).
 */
export function LoopVideo({ src, poster, label, className = "", fade = false }: { src: string; poster?: string; label: string; className?: string; fade?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`${className} ${fade ? `video-fade ${playing ? "playing" : ""}` : ""}`}
      src={src}
      poster={fade ? undefined : poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      onPlaying={() => setPlaying(true)}
    />
  );
}
