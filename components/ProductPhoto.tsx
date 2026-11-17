"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import PhotoBadge from "@/components/PhotoBadge";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className: string;
  /** Shown instead when the photo fails to load (e.g. the file is missing on Cloudinary). */
  fallback: ReactNode;
};

/** A single product photo (product card) with the brand badge. */
export default function ProductPhoto({ src, alt, sizes, priority, className, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  return (
    <div className={`${className} bg-white`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-contain" onError={() => setFailed(true)} />
      <PhotoBadge variant="card" />
    </div>
  );
}
