// One component system for the whole site: same radius (14px), border, soft shadow, paddings and buttons.
// Every card, filter panel, search box, slider and button builds on these strings.

/** White surface with the standard border, radius and soft shadow. */
export const card = "rounded-ui border border-line bg-card shadow-soft";
/** Soft grey panel (filters, alternate blocks). Same radius and border as a card, no shadow. */
export const panel = "rounded-ui border border-line bg-soft";

// Size variants are complete strings: never append another px-/text-/gap-/h- class to a button,
// because with two conflicting utilities the stylesheet order (not the class order) decides which wins.
const btnShape = "inline-flex items-center justify-center rounded-ui font-bold text-ink transition duration-200 active:scale-[0.98]";
const primary = "bg-accent hover:bg-accent-hover";
const md = "h-12 gap-2 px-6 text-base";
/** Primary: soft orange with ink text (also the WhatsApp button). */
export const btnPrimary = `${btnShape} ${md} ${primary}`;
/** Primary, compact (header). */
export const btnPrimarySm = `${btnShape} h-11 gap-2 px-4 text-sm ${primary}`;
/** Primary, large (product page WhatsApp). */
export const btnPrimaryLg = `${btnShape} h-14 gap-2 px-6 text-lg ${primary}`;
/** Primary, full width inside a product card; stays on one line in the narrow two-column phone grid. */
export const btnPrimaryCard = `${btnShape} h-11 w-full gap-1.5 whitespace-nowrap px-2 text-sm sm:gap-2 sm:text-base ${primary}`;
/** Secondary: white with a border. */
export const btnSecondary = `${btnShape} ${md} border border-line bg-card hover:border-accent hover:bg-accent-tint`;
/** Square icon button in the header. */
export const iconBtn =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ui border border-line bg-card text-ink transition hover:border-accent hover:bg-accent-tint";

/** Text input on the soft surface; turns white with an orange border when focused. */
export const input =
  "h-12 w-full rounded-ui border border-line bg-soft text-base text-ink outline-none transition placeholder:text-ink-soft focus:border-accent-hover focus:bg-card";

/** Filter / navigation chip. */
export const chip = "inline-flex h-10 shrink-0 items-center rounded-ui border px-4 text-sm font-medium text-ink transition";
export const chipIdle = "border-line bg-card hover:border-accent hover:bg-accent-tint";
export const chipActive = "border-accent bg-accent-tint font-bold";

/** Small label (category chip on cards, badges). */
export const tag = "inline-flex w-fit items-center rounded-ui bg-accent-tint px-3 py-0.5 text-sm font-medium leading-6 text-ink";

/** Inline text link: ink text, orange underline. */
export const textLink = "font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 transition hover:decoration-accent-hover";
