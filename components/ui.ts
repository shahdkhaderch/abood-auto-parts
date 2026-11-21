// One component system for the whole site (charcoal theme): flat grey tiles, white pill buttons,
// dark pill inputs/chips. Every card, filter, search box and button builds on these strings.

/** Charcoal card (category/model cards, detail tables, empty states). */
export const tile = "rounded-ui border border-tile-line bg-tile shadow-card";
/** Product card: 24px radius, thin soft border, light shadow. */
export const card = "rounded-card border border-tile-line bg-tile shadow-card";
/** Flat dark panel (filters). */
export const panel = "rounded-ui border border-tile-line bg-header";

// Size variants are complete strings: never append another px-/text-/gap-/h- class to a button,
// because with two conflicting utilities the stylesheet order (not the class order) decides which wins.
const pill = "inline-flex items-center justify-center rounded-full font-bold transition duration-200 active:scale-[0.98]";
const white = "bg-white text-ink hover:bg-cloud";
/** White pill with dark text: the primary button everywhere (also WhatsApp). */
export const btnPrimary = `${pill} h-12 gap-2 px-6 text-base ${white}`;
/** Compact. */
export const btnPrimarySm = `${pill} h-10 gap-2 px-4 text-sm ${white}`;
/** Large (product page WhatsApp). */
export const btnPrimaryLg = `${pill} h-14 gap-2 px-7 text-lg ${white}`;
/** Product card WhatsApp button: fills the row beside the heart. 14px text + 16px icon fit from 375px (13px text below that); the icon never shrinks. */
export const btnPrimaryCard = `${pill} h-10 min-w-0 flex-1 gap-1 whitespace-nowrap px-1 text-sm max-[374px]:text-[13px] sm:h-11 sm:gap-2 sm:px-2 sm:text-[15px] [&>svg]:shrink-0 ${white}`;
/** Outline pill on dark (hero WhatsApp): transparent, light border. */
export const btnOutline = `${pill} h-12 gap-2 px-6 text-base border border-fg/70 text-fg hover:border-fg hover:bg-white/10`;
/** Secondary: dark pill with a thin border. */
export const btnSecondary = `${pill} h-12 gap-2 px-6 text-base border border-field-line bg-field text-fg hover:border-mist`;

/**
 * Round icon button on dark. No display class on purpose: add `inline-flex` or
 * `hidden sm:inline-flex` where it is used (two display classes in one list conflict).
 */
export const iconBtn =
  "relative h-11 w-11 shrink-0 items-center justify-center rounded-full border border-field-line bg-field text-fg transition hover:border-mist";

/** Dark pill text input. */
export const input =
  "h-12 w-full rounded-full border border-field-line bg-field text-base text-fg outline-none transition placeholder:text-mist focus:border-mist";

/** Filter chip (dark pill; active = white). */
export const chip = "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition";
export const chipIdle = "border-field-line bg-field text-mist hover:border-mist hover:text-fg";
export const chipActive = "border-white bg-white font-bold text-ink";

/** Small label over a photo or on dark (category chip on cards). */
export const tag = "inline-flex w-fit items-center rounded-full border border-field-line bg-header/90 px-3 py-0.5 text-xs font-medium leading-5 text-fg sm:text-sm";
/** Red badge (offers, small highlights). */
export const badge = "inline-flex w-fit items-center rounded-full bg-red px-3 py-0.5 text-xs font-bold leading-5 text-fg sm:text-sm";

/** Inline text link on dark: white text, red underline. */
export const textLink = "font-bold text-fg underline decoration-red decoration-2 underline-offset-4 transition hover:decoration-white";

/** Small uppercase English label above section titles (Inter, letter-spaced). */
export const eyebrowBase = "font-label text-xs font-medium uppercase tracking-[0.2em] sm:text-sm";
export const eyebrow = `${eyebrowBase} text-mist`;
