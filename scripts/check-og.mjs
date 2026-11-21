// Link-preview check, as WhatsApp's crawler sees it:
//   npm run check:og                     → https://aboodparts.com (or NEXT_PUBLIC_SITE_URL)
//   npm run check:og -- http://localhost:3000
//   npm run check:og -- https://aboodparts.com /products/<slug> …
// Fetches product pages with a WhatsApp User-Agent and checks og:title, og:url and og:image: og:image must be an
// absolute https URL that answers 200 with a JPG/PNG under 300 KB (bigger images are dropped by WhatsApp).
// Without explicit paths it checks the first product with a photo, one without, and an old /products/<code> URL.
// Exit code 1 when something fails.

const UA = "WhatsApp/2.23";
const MAX_BYTES = 300 * 1024;
const [base = process.env.NEXT_PUBLIC_SITE_URL || "https://aboodparts.com", ...paths] = process.argv.slice(2);
const origin = base.replace(/\/+$/, "");
let failed = false;

const meta = (html, prop) => {
  const m = html.match(new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, "i"));
  return m ? m[1].replace(/&amp;/g, "&") : null;
};
const ok = (cond, label, detail = "") => {
  console.log(`  ${cond ? "✓" : "✗"} ${label}${detail ? `  ${detail}` : ""}`);
  if (!cond) failed = true;
};

async function check(path) {
  const res = await fetch(origin + path, { headers: { "User-Agent": UA }, redirect: "follow" });
  console.log(`\n${path}${res.redirected ? `  → ${res.url.replace(origin, "")}` : ""}`);
  ok(res.status === 200, "page 200", String(res.status));
  const html = await res.text();
  const title = meta(html, "og:title");
  const url = meta(html, "og:url");
  const image = meta(html, "og:image");
  ok(!!title, "og:title", title ?? "");
  ok(!!url && /^https:\/\//.test(url), "og:url absolute https", url ?? "");
  ok(!!url && !/\/products\/[a-z]{2,}\d{3,}$/i.test(url), "og:url has no item code");
  ok(meta(html, "twitter:card") === "summary_large_image", "twitter:card");
  ok(!!image && /^https:\/\//.test(image), "og:image absolute https", image ?? "");
  if (!image) return;
  const img = await fetch(image, { headers: { "User-Agent": UA } });
  const bytes = (await img.arrayBuffer()).byteLength;
  const type = img.headers.get("content-type") ?? "";
  ok(img.status === 200, "og:image 200", String(img.status));
  ok(/image\/(jpeg|png)/.test(type), "og:image JPG/PNG", type);
  ok(bytes < MAX_BYTES, "og:image under 300 KB", `${Math.round(bytes / 1024)} KB`);
  console.log(`  og:image:width/height ${meta(html, "og:image:width")}×${meta(html, "og:image:height")}`);
}

if (paths.length === 0) {
  // Pick one product with a photo and one without from /products (photo-less products are listed last).
  const list = await (await fetch(`${origin}/products?show=2400`, { headers: { "User-Agent": UA } })).text();
  const links = [...new Set([...list.matchAll(/href="(\/products\/[a-z0-9-]+-[0-9a-z]{6})"/g)].map((m) => m[1]))];
  if (links.length === 0) throw new Error("no product links found on /products");
  paths.push(links[0], links.at(-1));
}
for (const p of paths) await check(p);
console.log(failed ? "\nFAILED" : "\nAll checks passed");
process.exit(failed ? 1 : 0);
