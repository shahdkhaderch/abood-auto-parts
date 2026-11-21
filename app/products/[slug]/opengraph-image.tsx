import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { ImageResponse } from "next/og";
import PartIcon from "@/components/PartIcon";
import { getProductBySlug } from "@/lib/products";
import { productLabel } from "@/lib/catalog";
import { rtlVisualRuns } from "@/lib/arabic-shaping";
import { getProductPhoto, isRemotePhoto } from "@/lib/product-images";
import { absoluteUrl, cloudinaryBaseUrl, site } from "@/lib/site";

// Link preview image (WhatsApp, Facebook, ...). Same design as the on-site placeholder,
// or the product photo (Cloudinary file from the sheet, or public/products/[CODE].jpg) when there is one.
//
// Notes on the renderer (Satori):
// - Noto Arabic fonts crash it (unsupported GSUB lookup), so Cairo is used. See assets/fonts.
// - It lays Arabic words out left-to-right and mis-measures joined letters, so RtlText
//   uses lib/arabic-shaping.ts to pre-join letters and order words right-to-left.

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori cannot read CSS variables: these repeat the @theme tokens in app/globals.css.
const C = { page: "#3F444C", header: "#383C44", tile: "#525862", line: "#646B76", white: "#FFFFFF", mist: "#C3C8D0", ink: "#383C44", cloud: "#EEF0F3", red: "#D0202A" };
const SHADOW = "0 4px 14px rgba(56,60,68,0.25)";
const cwd = process.cwd();

async function loadFonts() {
  const [bold, black] = await Promise.all([
    readFile(join(cwd, "assets/fonts/Cairo-Bold.ttf")),
    readFile(join(cwd, "assets/fonts/Cairo-Black.ttf")),
  ]);
  return [
    { name: "Cairo", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Cairo", data: black, weight: 900 as const, style: "normal" as const },
  ];
}

function mimeFor(path: string) {
  const p = path.toLowerCase();
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

/** Read a file from /public as a data URI; fall back to fetching it from the live site. */
async function publicAsDataUri(publicPath: string): Promise<string | null> {
  try {
    const buf = await readFile(join(cwd, "public", publicPath));
    return `data:${mimeFor(publicPath)};base64,${buf.toString("base64")}`;
  } catch {
    try {
      const res = await fetch(absoluteUrl(publicPath));
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      return `data:${mimeFor(publicPath)};base64,${buf.toString("base64")}`;
    } catch {
      return null;
    }
  }
}

async function fetchAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const type = res.headers.get("content-type")?.split(";")[0] || mimeFor(url);
    if (!/^image\/(jpeg|png)$/.test(type)) return null; // Satori only decodes JPEG and PNG
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Cloudinary photo as a data URI. Asks Cloudinary for a JPEG no bigger than the photo area first so the preview
 * stays small and fast; falls back to the original file. null → the placeholder design is used.
 */
async function remotePhotoAsDataUri(url: string): Promise<string | null> {
  if (url.startsWith(`${cloudinaryBaseUrl}/`)) {
    const file = url.slice(cloudinaryBaseUrl.length + 1);
    const resized = await fetchAsDataUri(`${cloudinaryBaseUrl}/c_limit,w_1000,h_1000,f_jpg,q_80/${file}`);
    if (resized) return resized;
  }
  return fetchAsDataUri(url);
}

/** Right-to-left paragraph for Satori. */
function RtlText({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
      {rtlVisualRuns(text).map((run, i) => (
        <span key={i}>{run}</span>
      ))}
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, fonts, logo] = await Promise.all([
    getProductBySlug(slug),
    loadFonts(),
    publicAsDataUri("/abood-mark.png"),
  ]);

  const photoSrc = product ? getProductPhoto(product) : null;
  const photo = !photoSrc ? null : isRemotePhoto(photoSrc) ? await remotePhotoAsDataUri(photoSrc) : await publicAsDataUri(photoSrc);

  const brand = (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.25 }}>
        <RtlText text={site.name} style={{ fontSize: 34, fontWeight: 900, color: C.white }} />
        <RtlText text={site.tagline} style={{ fontSize: 22, fontWeight: 700, color: C.mist }} />
      </div>
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- rendered by Satori, not the browser
        <img src={logo} width={84} height={84} style={{ borderRadius: 999, objectFit: "contain" }} />
      )}
    </div>
  );

  // Photo: the whole photo (catalogue shots are square, on white) with the brand badge in the
  // top corner (same as on the site), above a strip with the model and the part type (no chassis field).
  if (product && photo) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.white, fontFamily: "Cairo" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={photo} width={1200} height={480} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 480, objectFit: "contain" }} />
          <div style={{ position: "absolute", top: 24, right: 28, display: "flex", alignItems: "center", gap: 12, padding: "6px 6px 6px 24px", borderRadius: 999, background: C.white, border: `2px solid ${C.cloud}`, boxShadow: SHADOW }}>
            <RtlText text={site.name} style={{ fontSize: 28, fontWeight: 900, color: C.ink }} />
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img src={logo} width={56} height={56} style={{ borderRadius: 999, objectFit: "contain" }} />
            )}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: C.header, borderTop: `4px solid ${C.red}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontSize: 52, fontWeight: 900, color: C.white }}>
              <span>{product.model}</span>
            </div>
            <div style={{ display: "flex", padding: "6px 26px", borderRadius: 999, color: C.ink, background: C.white }}>
              <RtlText text={productLabel(product)} style={{ fontSize: 34, fontWeight: 900 }} />
            </div>
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  // Placeholder design (also used when the slug is unknown).
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "44px 56px 40px",
          color: C.white,
          fontFamily: "Cairo",
          backgroundColor: C.page,
          borderBottom: `8px solid ${C.red}`,
        }}
      >
        {/* top: part type (left) + brand (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {product ? (
            <div style={{ display: "flex", padding: "6px 26px", borderRadius: 999, color: C.ink, background: C.white }}>
              <RtlText text={productLabel(product)} style={{ fontSize: 30, fontWeight: 900 }} />
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
          {brand}
        </div>

        {/* middle: icon + model */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 220, height: 220, borderRadius: 44, background: C.tile, border: `2px solid ${C.line}`, boxShadow: SHADOW }}>
            <PartIcon type={!product ? "other" : product.partType === "other" ? product.category : product.partType} size={160} color={C.white} strokeWidth={3} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <div style={{ fontSize: 108, fontWeight: 900, letterSpacing: -2 }}>{product?.model || "Mercedes"}</div>
          </div>
        </div>

        {/* bottom: product name (the item code is never shown to customers) */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <RtlText
            text={product?.name ?? site.tagline}
            style={{ flex: 1, fontSize: 42, fontWeight: 700, color: C.mist, justifyContent: "flex-start", lineHeight: 1.3 }}
          />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
