"""
Download every photo from a Facebook page's Photos tab (a page you own/manage), for your own use.

    python scripts/fb_photos/download_photos.py              # scan the Photos tab, then download
    python scripts/fb_photos/download_photos.py --skip-scan  # reuse the saved link list, only download
    python scripts/fb_photos/download_photos.py --edge       # use installed Microsoft Edge instead of Chromium

Login: the first run opens a browser window. Log in to Facebook there, then press Enter in the
terminal. The session is kept in scripts/fb_photos/.profile, so later runs are already logged in.

Resumable: progress is saved to output/state.json after every photo. Press Ctrl+C at any time and
run the script again later; photos already downloaded are skipped, failed ones are tried again.

The script stops (it does not retry) if Facebook shows a checkpoint, captcha, login wall or a
"temporarily blocked" message. Wait a while, open Facebook normally, resolve it, then run again.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import random
import re
import sys
import time
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlparse

from playwright.sync_api import BrowserContext, Page, TimeoutError as PWTimeout, sync_playwright

PHOTOS_URL = "https://www.facebook.com/profile.php?id=61575819384981&sk=photos"

HERE = Path(__file__).resolve().parent
PROFILE_DIR = HERE / ".profile"
OUT_DIR = HERE / "output"
STATE_FILE = OUT_DIR / "state.json"
LINKS_FILE = OUT_DIR / "links.json"
CSV_FILE = OUT_DIR / "photos.csv"

SCROLL_PAUSE = (1.5, 3.0)  # seconds between scrolls
PHOTO_DELAY = (2.0, 4.0)  # seconds between photos
NO_NEW_ROUNDS = 6  # stop scrolling after this many scrolls with no new photo links

# Text Facebook shows when it wants a security check or has rate-limited the account (English + Arabic).
BLOCK_PHRASES = [
    "you're temporarily blocked",
    "you’re temporarily blocked",
    "temporarily blocked",
    "you've been temporarily blocked",
    "security check",
    "confirm you're human",
    "confirm that you're human",
    "help us confirm it's you",
    "enter the characters you see",
    "captcha",
    "your account has been locked",
    "we suspended your account",
    "تم حظرك مؤقتًا",
    "تم حظرك مؤقتا",
    "محظور مؤقتًا",
    "فحص الأمان",
    "تأكيد أنك إنسان",
    "ساعدنا في التأكد من أنك",
]
BLOCK_URL_PARTS = ["/checkpoint", "captcha", "/login", "login.php", "two_step_verification"]


class Blocked(Exception):
    """Facebook showed a checkpoint / captcha / block. Stop, don't retry."""


# --------------------------------------------------------------------------------------------- state


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"photos": {}}  # fbid -> {index, photo_url, filename, caption, date, status, image_url}


def write_atomic(path: Path, text: str, encoding: str = "utf-8") -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding=encoding, newline="")
    os.replace(tmp, path)


def save_state(state: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    write_atomic(STATE_FILE, json.dumps(state, ensure_ascii=False, indent=2))
    write_csv(state)


def write_csv(state: dict) -> None:
    rows = sorted(state["photos"].items(), key=lambda kv: kv[1]["index"])
    tmp = CSV_FILE.with_suffix(".csv.tmp")
    # utf-8-sig so Excel shows Arabic captions correctly.
    with tmp.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["index", "fbid", "filename", "photo_url", "caption", "date"])
        for fbid, p in rows:
            w.writerow([p["index"], fbid, p.get("filename", ""), p["photo_url"], p.get("caption", ""), p.get("date", "")])
    os.replace(tmp, CSV_FILE)


# ------------------------------------------------------------------------------------------- helpers


def pause(rng: tuple[float, float]) -> None:
    time.sleep(random.uniform(*rng))


def check_blocked(page: Page) -> None:
    url = page.url.lower()
    if any(part in url for part in BLOCK_URL_PARTS):
        raise Blocked(f"Facebook redirected to {page.url}")
    try:
        text = page.evaluate("() => (document.body && document.body.innerText || '').slice(0, 5000)").lower()
    except Exception:
        return
    for phrase in BLOCK_PHRASES:
        if phrase in text:
            raise Blocked(f'Facebook page says: "{phrase}"')
    if page.locator('iframe[src*="captcha" i], iframe[title*="captcha" i]').count() > 0:
        raise Blocked("Facebook is showing a captcha")


def fbid_from_url(href: str) -> str | None:
    """fbid from photo.php?fbid=…, /photo/?fbid=…, /photo.php?fbid=… or /<page>/photos/<album>/<fbid>/."""
    u = urlparse(href)
    if "facebook.com" not in u.netloc:
        return None
    q = parse_qs(u.query)
    if ("/photo" in u.path) and q.get("fbid"):
        fbid = q["fbid"][0]
        return fbid if fbid.isdigit() else None
    m = re.search(r"/photos/(?:[^/]+/)?(\d{6,})/?$", u.path)
    return m.group(1) if m else None


def clean_photo_url(href: str, fbid: str) -> str:
    """Drop Facebook tracking parameters; keep fbid and set (the album context)."""
    q = parse_qs(urlparse(href).query)
    url = f"https://www.facebook.com/photo/?fbid={fbid}"
    if q.get("set"):
        url += f"&set={q['set'][0]}"
    return url


# --------------------------------------------------------------------------------------------- scan


def collect_links(page: Page) -> dict[str, str]:
    hrefs = page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
    found: dict[str, str] = {}
    for href in hrefs:
        if "/photo" not in href:  # /photo/, /photo.php, /photos/
            continue
        fbid = fbid_from_url(urljoin("https://www.facebook.com/", href))
        if fbid and fbid not in found:
            found[fbid] = clean_photo_url(href, fbid)
    return found


def scan_photos_tab(page: Page) -> list[tuple[str, str]]:
    print(f"Opening {PHOTOS_URL}")
    page.goto(PHOTOS_URL, wait_until="domcontentloaded")
    pause((3, 5))
    check_blocked(page)

    links: dict[str, str] = {}  # insertion order = order on the page
    idle = 0
    while idle < NO_NEW_ROUNDS:
        before = len(links)
        for fbid, url in collect_links(page).items():
            links.setdefault(fbid, url)
        if len(links) > before:
            idle = 0
            print(f"  scanning… {len(links)} photo links")
        else:
            idle += 1
        # Scroll slowly, in a few small wheel steps, like a person would.
        for _ in range(random.randint(2, 4)):
            page.mouse.wheel(0, random.randint(350, 700))
            time.sleep(random.uniform(0.2, 0.5))
        pause(SCROLL_PAUSE)
        check_blocked(page)

    print(f"Scan finished: {len(links)} photo links.")
    return list(links.items())


# ---------------------------------------------------------------------------------------- one photo

# Largest loaded image on the page that comes from Facebook's CDN (the photo in the viewer).
LARGEST_IMG_JS = """
() => {
  let best = null, bestArea = 0;
  for (const img of document.images) {
    const src = img.currentSrc || img.src || '';
    if (!/fbcdn\\.net|scontent/.test(src)) continue;
    if (!img.complete || !img.naturalWidth) continue;
    const r = img.getBoundingClientRect();
    if (r.width < 200 || r.height < 200) continue;          // thumbnails, avatars
    const area = img.naturalWidth * img.naturalHeight;
    if (area > bestArea) { bestArea = area; best = { src, w: img.naturalWidth, h: img.naturalHeight, alt: img.alt || '' }; }
  }
  return best;
}
"""

# Best effort: Facebook's markup changes often and has no stable class names.
# Caption = longest dir="auto" text block in the side panel; date = a short link text that looks like a date.
META_JS = """
() => {
  const panel = document.querySelector('[role="complementary"]') || document.querySelector('[role="dialog"]') || document.body;
  const skip = /^(like|comment|share|reply|see more|see less|most relevant|all comments|write a comment|أعجبني|تعليق|مشاركة|رد|عرض المزيد|عرض أقل)/i;
  let caption = '';
  for (const el of panel.querySelectorAll('div[dir="auto"], span[dir="auto"]')) {
    if (el.closest('[role="article"] [role="article"]')) continue;   // skip comments
    if (el.closest('form, [role="textbox"], [contenteditable="true"]')) continue;
    const t = (el.innerText || '').trim();
    if (t.length > caption.length && t.length < 5000 && !skip.test(t)) caption = t;
  }
  const months = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|يناير|فبراير|مارس|أبريل|ابريل|مايو|يونيو|يوليو|أغسطس|اغسطس|سبتمبر|أكتوبر|اكتوبر|نوفمبر|ديسمبر|كانون|شباط|آذار|نيسان|أيار|حزيران|تموز|آب|أيلول|تشرين';
  const dateRe = new RegExp('(' + months + ')|^\\\\d+\\\\s*(h|d|w|m|y|min|hr|hrs|س|د|ي)(\\\\s|$)|yesterday|أمس|منذ', 'i');
  let date = '';
  for (const el of panel.querySelectorAll('a[role="link"], a[href*="photo"], abbr, time, span')) {
    const t = (el.getAttribute('aria-label') || el.innerText || '').trim();
    if (t && t.length <= 40 && dateRe.test(t) && /\\d/.test(t)) { date = t; break; }
  }
  return { caption, date };
}
"""


def read_photo_page(page: Page, photo_url: str) -> dict:
    page.goto(photo_url, wait_until="domcontentloaded")
    check_blocked(page)
    best = None
    deadline = time.time() + 15
    while time.time() < deadline:
        best = page.evaluate(LARGEST_IMG_JS)
        if best and best["w"] >= 400:
            break
        time.sleep(0.7)
    check_blocked(page)
    if not best:
        raise RuntimeError("no full-size image found on the photo page")
    time.sleep(1)  # let the side panel (caption/date) render
    meta = page.evaluate(META_JS)
    return {"image_url": best["src"], "caption": meta["caption"], "date": meta["date"], "size": f'{best["w"]}x{best["h"]}'}


EXT_BY_TYPE = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}


def download(ctx: BrowserContext, image_url: str, dest_stem: Path) -> Path:
    """Save the exact bytes Facebook serves (no re-encoding). Normally JPEG → .jpg."""
    resp = ctx.request.get(image_url, timeout=60_000)
    if not resp.ok:
        raise RuntimeError(f"image download failed: HTTP {resp.status}")
    ctype = resp.headers.get("content-type", "image/jpeg").split(";")[0].strip().lower()
    dest = dest_stem.with_suffix(EXT_BY_TYPE.get(ctype, ".jpg"))
    tmp = dest.with_suffix(dest.suffix + ".part")
    tmp.write_bytes(resp.body())
    os.replace(tmp, dest)
    return dest


# --------------------------------------------------------------------------------------------- main


def main() -> int:
    ap = argparse.ArgumentParser(description="Download all photos from a Facebook page's Photos tab.")
    ap.add_argument("--skip-scan", action="store_true", help="reuse output/links.json instead of scrolling the Photos tab again")
    ap.add_argument("--edge", action="store_true", help="use the installed Microsoft Edge instead of Playwright's Chromium")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    state = load_state()
    photos = state["photos"]

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            str(PROFILE_DIR),
            headless=False,
            channel="msedge" if args.edge else None,
            viewport={"width": 1280, "height": 900},
            locale="en-US",
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        downloaded_now = failed_now = 0
        try:
            page.goto("https://www.facebook.com/", wait_until="domcontentloaded")
            print("\nA browser window is open. Log in to Facebook there if needed")
            print("(switch to the profile/page that manages the photos), then come back here.")
            input("Press Enter to continue… ")
            check_blocked(page)

            # 1. Photo links (scan, or reuse the saved list).
            if args.skip_scan and LINKS_FILE.exists():
                links = [tuple(x) for x in json.loads(LINKS_FILE.read_text(encoding="utf-8"))]
                print(f"Using {len(links)} saved photo links from {LINKS_FILE.name}.")
            else:
                links = scan_photos_tab(page)
                if not links:
                    print("No photo links found. Are you logged in, and does the Photos tab show photos?")
                    return 1
                write_atomic(LINKS_FILE, json.dumps(links, ensure_ascii=False, indent=2))

            # Stable numbering across runs: known fbids keep their index, new ones get the next numbers.
            next_index = max((p["index"] for p in photos.values()), default=0) + 1
            for fbid, url in links:
                if fbid not in photos:
                    photos[fbid] = {"index": next_index, "photo_url": url, "status": "pending"}
                    next_index += 1
            save_state(state)

            # 2. Download.
            todo = [
                (fbid, p) for fbid, p in sorted(photos.items(), key=lambda kv: kv[1]["index"])
                if not (p.get("status") == "done" and (OUT_DIR / p.get("filename", "")).is_file() and p.get("filename"))
            ]
            total = len(photos)
            already = total - len(todo)
            print(f"\n{total} photos in total, {already} already downloaded, {len(todo)} to go.\n")

            for n, (fbid, p) in enumerate(todo, start=already + 1):
                label = f"[{n}/{total}] #{p['index']} fbid {fbid}"
                try:
                    info = read_photo_page(page, p["photo_url"])
                    dest = download(ctx, info["image_url"], OUT_DIR / f"{p['index']}_{fbid}")
                    p.update(
                        filename=dest.name, image_url=info["image_url"], caption=info["caption"],
                        date=info["date"], status="done",
                    )
                    p.pop("error", None)
                    downloaded_now += 1
                    print(f"{label}  ✓ {dest.name} ({info['size']})  {info['date']}")
                except Blocked:
                    raise
                except Exception as e:  # one bad photo must not stop the run; it is retried next time
                    p.update(status="failed", error=str(e)[:300])
                    failed_now += 1
                    print(f"{label}  ✗ {e}")
                save_state(state)
                pause(PHOTO_DELAY)

        except Blocked as e:
            save_state(state)
            print("\n" + "=" * 70)
            print("STOPPED: Facebook is asking for a security check or has limited this account.")
            print(f"  {e}")
            print("Progress is saved. Do NOT run the script again right away.")
            print("Open Facebook normally in a browser, complete any check, wait a few hours,")
            print("then run the script again. It will continue where it stopped.")
            print("=" * 70)
            return 2
        except KeyboardInterrupt:
            save_state(state)
            print("\nInterrupted. Progress is saved; run the script again to continue.")
            return 130
        finally:
            try:
                ctx.close()
            except Exception:
                pass

    done = sum(1 for p in photos.values() if p.get("status") == "done")
    failed = [p["index"] for p in photos.values() if p.get("status") == "failed"]
    print("\n" + "-" * 70)
    print(f"Downloaded this run: {downloaded_now}   failed this run: {failed_now}")
    print(f"Total downloaded: {done}/{len(photos)}")
    if failed:
        print(f"Failed (run again to retry): {', '.join(map(str, sorted(failed)))}")
    print(f"Images and photos.csv are in: {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
