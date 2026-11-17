import Image from "next/image";
import { site } from "@/lib/site";

/** Brand badge on real photos, same as on the placeholder. Dark glass pill so it reads on white and dark photos. */
export default function PhotoBadge({ variant }: { variant: "card" | "page" }) {
  const isPage = variant === "page";
  return (
    <div
      className={[
        "pointer-events-none absolute flex items-center rounded-full bg-neutral-950/70 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm",
        isPage
          ? "right-2.5 top-2.5 gap-1.5 py-0.5 pl-2.5 pr-0.5 sm:right-4 sm:top-4 sm:gap-2 sm:py-1 sm:pl-3.5 sm:pr-1"
          : "right-1.5 top-1.5 gap-1 py-0.5 pl-2 pr-0.5 sm:right-2 sm:top-2 sm:gap-1.5",
      ].join(" ")}
    >
      <Image
        src="/abood-logo.png"
        alt=""
        width={isPage ? 32 : 20}
        height={isPage ? 32 : 20}
        className={["shrink-0 rounded-full object-cover", isPage ? "h-6 w-6 sm:h-8 sm:w-8" : "h-5 w-5"].join(" ")}
      />
      <span className={["whitespace-nowrap font-bold", isPage ? "text-xs sm:text-sm" : "text-[10px] sm:text-[11px]"].join(" ")}>{site.name}</span>
    </div>
  );
}
