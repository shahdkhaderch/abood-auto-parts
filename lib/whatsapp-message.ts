// The prefilled WhatsApp message for a product. WhatsApp shows the text with the Unicode bidi algorithm,
// so Arabic, Latin and numbers on one line get reordered ("AMG C205 2019-2021" → "05 2019-2021AMG C2").
// Therefore: one value per line, every line starts with RLM (right-to-left mark), and every Latin/number
// value (model, years, link) is isolated with LRI … PDI so it is always shown left-to-right as typed.
// No item code, price or chassis field. Pure, no imports (unit-tested in lib/whatsapp-message.test.ts).

export const RLM = "‏";
export const LRI = "⁦";
export const PDI = "⁩";

const ltr = (value: string) => `${LRI}${value}${PDI}`;

export type MessageParts = {
  /** Arabic part name, e.g. "طبون امامي" (the card's second line). */
  part: string;
  /** Model / chassis tokens, e.g. "AMG C205" (the card's first line). */
  model: string;
  /** "2019 - 2021" (the card's third line). */
  years: string;
  /** Absolute product page URL. */
  url: string;
};

/** Lines of the message; a part that is empty is skipped. The link is the last line, with nothing after it. */
export function buildProductMessage({ part, model, years, url }: MessageParts): string {
  const lines = [
    "مرحبا، بدي استفسر عن هالقطعة:",
    part && `القطعة: ${part}`,
    model && `الموديل: ${ltr(model)}`,
    years && `السنوات: ${ltr(years)}`,
    url && `الرابط: ${ltr(url)}`,
  ].filter(Boolean);
  return lines.map((line) => `${RLM}${line}`).join("\n");
}
