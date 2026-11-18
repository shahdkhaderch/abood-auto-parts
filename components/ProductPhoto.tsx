"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import PhotoBadge from "@/components/PhotoBadge";

type Props = {
  src: string;
  /** Second photo, cross-faded in while the card (a `group`) is hovered. Hover-capable devices only. */
  hoverSrc?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className: string;
  /** Shown instead when the photo fails to load (e.g. the file is missing on Cloudinary). */
  fallback: ReactNode;
};

/** A single product photo (product card) with the brand badge. Always object-contain on white: parts are never cropped. */
export default function ProductPhoto({ src, hoverSrc, alt, sizes, priority, className, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);
  if (failed) return fallback;
  const showHover = Boolean(hoverSrc) && !hoverFailed;
  return (
    <div className={`${className} bg-card`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={["object-contain transition-opacity duration-300", showHover ? "group-hover:opacity-0" : ""].join(" ")}
        onError={() => setFailed(true)}
      />
      {showHover && hoverSrc && (
        <Image
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onError={() => setHoverFailed(true)}
        />
      )}
      <PhotoBadge variant="card" />
    </div>
  );
}
