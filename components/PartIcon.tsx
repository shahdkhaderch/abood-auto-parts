import type { Category, PartType } from "@/lib/catalog";

// Plain SVG with attributes only (no className, no fragments, no conditional children),
// so the same component renders both in the site and inside next/og ImageResponse (Satori).

/** A bumper/diffuser part type, or a category for every other part. */
export type IconKind = Exclude<PartType, "other"> | Category | "other";

type Props = { type: IconKind; size?: number; color?: string; strokeWidth?: number };

// Car body (roof + bumper outline) shared by front and rear views.
const CAR_ROOF = "M14 28l5-11a4 4 0 0 1 3.6-2.4h18.8A4 4 0 0 1 45 17l5 11";
const CAR_BODY = "M8 32a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v10a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6Z";

const PATHS: Record<IconKind, string[]> = {
  // car front: headlights, grille, wheels
  "front-bumper": [CAR_ROOF, CAR_BODY, "M12 34h8M44 34h8", "M25 34h14v7H25Z", "M14 48v5M50 48v5"],
  // car rear: tail lights, plate, exhausts
  "rear-bumper": [CAR_ROOF, CAR_BODY, "M11 33h10v4H11ZM43 33h10v4H43Z", "M26 36h12v6H26Z", "M17 52h6M41 52h6"],
  // rear diffuser: tapered lower panel with fins and twin exhausts
  diffuser: ["M6 22h52l-7 22a4 4 0 0 1-3.8 2.8H16.8A4 4 0 0 1 13 44Z", "M22 22v24.8M28 22v24.8M36 22v24.8M42 22v24.8", "M12 52h8M44 52h8"],
  // lights: headlamp with beams
  lights: ["M30 16c-9 0-16 7.2-16 16s7 16 16 16h4V16Z", "M22 26h8M22 32h8M22 38h8", "M42 22h12M42 32h14M42 42h12"],
  // light parts: lamp housing (no beams) with a bolt beside it
  "light-parts": ["M30 14c-10 0-18 8-18 18s8 18 18 18h4V14Z", "M34 22h4M34 42h4", "M48 26a6 6 0 1 0 0 12 6 6 0 1 0 0-12Z", "M48 30v4"],
  // emblems & badges: shield badge with a ribbon line
  emblems: ["M32 8 50 15v14c0 12-8 21-18 27-10-6-18-15-18-27V15Z", "M22 30h20", "M26 22h12M26 38h12"],
  // interior: steering wheel
  interior: ["M32 8a24 24 0 1 0 0 48 24 24 0 1 0 0-48Z", "M32 26a6 6 0 1 0 0 12 6 6 0 1 0 0-12Z", "M9 30c8-3 15-4 17-1M55 30c-8-3-15-4-17-1M32 38v17"],
  // exterior: side mirror on a door line
  exterior: ["M10 46h44", "M18 46V30a8 8 0 0 1 8-8h8", "M34 16h14a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H34Z", "M38 34v12"],
  // body & spare parts: wrench
  parts: ["M40 10a12 12 0 0 0-11 16L10 45a5 5 0 0 0 7 7l19-19a12 12 0 0 0 16-11l-7 4-6-3-1-7 6-6a12 12 0 0 0-4 0Z"],
  // fallback: box
  other: ["M32 8 54 20v24L32 56 10 44V20Z", "M10 20l22 12 22-12M32 32v24"],
};

export default function PartIcon({ type, size = 64, color = "currentColor", strokeWidth = 3 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {(PATHS[type] ?? PATHS.other).map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
