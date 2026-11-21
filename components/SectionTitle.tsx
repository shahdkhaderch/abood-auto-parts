import { eyebrowBase } from "@/components/ui";

/**
 * Section heading: small uppercase English label, big Arabic title with thin lines on both sides.
 * `tone="light"` for the light section (dark title).
 */
export default function SectionTitle({ label, title, tone = "dark", id }: { label: string; title: string; tone?: "dark" | "light"; id?: string }) {
  const light = tone === "light";
  return (
    <div className="mb-7 text-center sm:mb-8">
      <p className={`${eyebrowBase} ${light ? "text-ink-soft" : "text-mist"}`} dir="ltr">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-4 sm:gap-8">
        <span aria-hidden="true" className={`h-px w-10 sm:w-32 lg:w-72 ${light ? "bg-ink/15" : "bg-dim"}`} />
        <h2 id={id} className={`text-2xl font-extrabold sm:text-4xl ${light ? "text-ink" : "text-fg"}`}>{title}</h2>
        <span aria-hidden="true" className={`h-px w-10 sm:w-32 lg:w-72 ${light ? "bg-ink/15" : "bg-dim"}`} />
      </div>
    </div>
  );
}
