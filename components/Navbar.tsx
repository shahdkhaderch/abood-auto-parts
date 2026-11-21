"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import FavoritesDot from "@/components/FavoritesDot";
import SearchForm from "@/components/SearchForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { btnPrimary, iconBtn } from "@/components/ui";
import { isClassModel } from "@/lib/catalog";
import { OFFER_LABEL, productsHref, type NavData } from "@/lib/filters";
import { site, whatsappLink } from "@/lib/site";

function IconHeart(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>);}
function IconMenu(){return(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconPlus(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconMinus(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconClose(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function ChevronLeft(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 7l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function ChevronDown(){return(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}

/** The brand mark (light circle, transparent corners), used wherever the logo appears. */
function Mark({ size }: { size: number }) {
  return <Image src="/abood-mark.png" alt="" width={size} height={size} priority className="shrink-0 object-contain" style={{ width: size, height: size }} />;
}

/** Own pages (2026-11-21). The old hash links (/#why, #contact) did not scroll from the open mobile drawer. */
const ABOUT_HREF = "/about";
const CONTACT_HREF = "/contact";

export default function Navbar({ nav }: { nav: NavData }){
  const pathname = usePathname();
  const [drawerOpen,setDrawerOpen]=useState(false),[mobilePartsOpen,setMobilePartsOpen]=useState(false),[partsOpen,setPartsOpen]=useState(false);
  const whatsappHref=useMemo(()=>whatsappLink(),[]),partsRef=useRef<HTMLDivElement|null>(null);
  // /products has its own search + filters, so the header search is hidden there (no duplicate).
  const showHeaderSearch = pathname !== "/products";
  const closeAll=()=>{setDrawerOpen(false);setMobilePartsOpen(false);setPartsOpen(false);};

  // Links that only appear when they have products (categories from القسم, offers from عرض).
  const sectionLinks = [
    ...nav.categories.map((c) => ({ href: productsHref({ category: c.value }), label: c.label })),
    ...(nav.offerCount > 0 ? [{ href: productsHref({ offer: true }), label: OFFER_LABEL }] : []),
  ];

  useEffect(()=>{document.body.style.overflow=drawerOpen?"hidden":"";return()=>{document.body.style.overflow="";};},[drawerOpen]);
  useEffect(()=>{function onDocClick(e:MouseEvent){if(!partsOpen)return;const t=e.target as Node;if(partsRef.current&&!partsRef.current.contains(t))setPartsOpen(false);}document.addEventListener("mousedown",onDocClick);return()=>document.removeEventListener("mousedown",onDocClick);},[partsOpen]);

  // Active item: white with a thin red underline.
  const navLink = (active: boolean) => [
    "relative inline-flex h-10 items-center gap-1 whitespace-nowrap px-1 text-[15px] font-medium transition",
    "after:absolute after:inset-x-1 after:-bottom-1 after:h-0.5 after:rounded-full after:transition",
    active ? "text-fg after:bg-red" : "text-mist hover:text-fg after:bg-transparent",
  ].join(" ");
  const menuLink = "flex items-center justify-between gap-2 rounded-ui px-3 py-2 text-sm font-medium text-mist transition hover:bg-field hover:text-fg active:bg-field active:text-fg";
  const drawerLink = "flex items-center justify-between rounded-ui border border-tile-line bg-tile px-4 py-3 text-base font-medium text-fg transition hover:border-mist active:scale-[0.98] active:border-mist";

  // Models in two groups (already sorted): the "… Class" models, then the others (CLA, GLC, Vito …).
  const modelGroups = [nav.models.filter((m) => isClassModel(m.label)), nav.models.filter((m) => !isClassModel(m.label))].filter((g) => g.length > 0);
  const modelLinks = (cols: string) => modelGroups.map((g, i) => (
    <div key={i} className={["grid", cols, i > 0 ? "mt-1 border-t border-tile-line pt-1" : ""].join(" ")}>
      {g.map((m)=>(<Link key={m.value} href={productsHref({ model: m.value })} prefetch={false} onClick={closeAll} className={menuLink}><span dir="ltr">{m.label}</span></Link>))}
    </div>
  ));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-tile-line bg-header">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex h-16 items-center gap-2 sm:gap-3 lg:h-[82px] lg:gap-6">
            <button type="button" onClick={()=>setDrawerOpen(true)} className={`${iconBtn} inline-flex lg:hidden`} aria-label="فتح القائمة" aria-expanded={drawerOpen}><IconMenu /></button>

            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name} - الرئيسية`}>
              <Mark size={46} />
              <div className="hidden leading-tight sm:block"><div className="text-base font-bold text-fg lg:text-lg">{site.name}</div><div className="text-xs text-mist">{site.tagline}</div></div>
            </Link>

            <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-5 lg:flex">
              <Link href="/" className={navLink(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>الرئيسية</Link>

              <div ref={partsRef} className="relative" onMouseLeave={()=>setPartsOpen(false)}>
                {/* Mouse: hover already opened it, so a click keeps it open (a toggle would close it under the pointer). Keyboard (detail 0): toggle. */}
                <button type="button" onClick={(e)=>setPartsOpen(v=>e.detail===0?!v:true)} onKeyDown={(e)=>{if(e.key==="Escape")setPartsOpen(false);}} onMouseEnter={()=>setPartsOpen(true)} className={navLink(pathname.startsWith("/products"))} aria-expanded={partsOpen} aria-haspopup="true">جميع القطع <ChevronDown /></button>

                {/* pt-3 bridges the gap so the menu stays open while the mouse moves into it */}
                <div onKeyDown={(e)=>{if(e.key==="Escape")setPartsOpen(false);}} className={["absolute right-0 top-full pt-3 transition-all duration-200",partsOpen?"pointer-events-auto translate-y-0 opacity-100":"pointer-events-none invisible -translate-y-1 opacity-0"].join(" ")}>
                  <div className="grid w-[560px] grid-cols-[1fr_1.3fr] gap-4 rounded-ui border border-tile-line bg-header p-4 shadow-card">
                    <div>
                      <div className="mb-2 px-3 text-xs font-bold text-fg">الأقسام</div>
                      <Link href="/products" onClick={closeAll} className={menuLink}>كل القطع <ChevronLeft /></Link>
                      {sectionLinks.map((x)=>(<Link key={x.href} href={x.href} onClick={closeAll} className={menuLink}>{x.label} <ChevronLeft /></Link>))}
                    </div>
                    {nav.models.length > 0 && (
                      <div className="border-r border-tile-line pr-4">
                        <div className="mb-2 px-3 text-xs font-bold text-fg">الموديلات</div>
                        <div className="max-h-96 overflow-y-auto">{modelLinks("grid-cols-2 gap-x-1")}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link href={ABOUT_HREF} className={navLink(pathname === ABOUT_HREF)} aria-current={pathname === ABOUT_HREF ? "page" : undefined}>عن الشركة</Link>
              <Link href={CONTACT_HREF} className={navLink(pathname === CONTACT_HREF)} aria-current={pathname === CONTACT_HREF ? "page" : undefined}>تواصل معنا</Link>
            </nav>

            {showHeaderSearch ? (
              <div className="hidden min-w-0 flex-1 sm:block lg:max-w-sm"><Suspense fallback={null}><SearchForm /></Suspense></div>
            ) : (
              <div className="hidden flex-1 sm:block lg:max-w-sm" />
            )}

            <div className="ms-auto flex items-center gap-2">
              {/* A red dot while favourites are saved — never a count (no numbers are shown to customers, decision 5). */}
              <Link href="/favorites" className={`${iconBtn} hidden sm:inline-flex`} aria-label="المفضلة"><IconHeart /><FavoritesDot className="right-1.5 top-1.5" /></Link>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className={`${iconBtn} inline-flex`} aria-label="تواصل عبر واتساب"><WhatsAppIcon size={20} /></a>
            </div>
          </div>

          {/* Mobile: search under the logo row (except on /products, which has its own). */}
          {showHeaderSearch && (
            <div className="pb-3 sm:hidden"><Suspense fallback={null}><SearchForm /></Suspense></div>
          )}
        </div>
      </header>

      {/* z-[60]: above the sticky header and the mobile bottom nav (both z-50), so nothing covers the menu. */}
      <div className={["fixed inset-0 z-[60] transition",drawerOpen?"pointer-events-auto opacity-100":"pointer-events-none opacity-0"].join(" ")} aria-hidden={!drawerOpen} inert={!drawerOpen}>
        <div className={["absolute inset-0 bg-night/70 backdrop-blur-sm transition-opacity",drawerOpen?"opacity-100":"opacity-0"].join(" ")} onClick={closeAll}/>
        <div className={["absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto overscroll-contain border-l border-tile-line bg-header shadow-card transition-transform duration-300",drawerOpen?"translate-x-0":"translate-x-full"].join(" ")} role="dialog" aria-modal="true" aria-label="القائمة">
          <div className="shrink-0 border-b border-tile-line px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mark size={48} />
                <div className="leading-tight"><div className="text-base font-bold text-fg">{site.name}</div><div className="text-xs text-mist">{site.tagline}</div></div>
              </div>
              <button type="button" onClick={closeAll} className={`${iconBtn} inline-flex`} aria-label="إغلاق"><IconClose /></button>
            </div>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className={`${btnPrimary} mt-4 w-full`}><WhatsAppIcon size={20} />تواصل واتساب الآن</a>
          </div>

          <nav className="grid gap-2 px-4 py-4">
            <Link href="/" onClick={closeAll} className={drawerLink}><span>الرئيسية</span><span className="text-mist"><ChevronLeft/></span></Link>

            <button type="button" onClick={()=>setMobilePartsOpen(v=>!v)} aria-expanded={mobilePartsOpen} className={`${drawerLink} w-full`}>
              <span>جميع القطع</span><span className="text-mist">{mobilePartsOpen?<IconMinus/>:<IconPlus/>}</span>
            </button>
            <div className={["overflow-hidden transition-all duration-300",mobilePartsOpen?"max-h-[1400px]":"max-h-0"].join(" ")}>
              <div className="rounded-ui border border-tile-line bg-page p-2">
                <Link href="/products" onClick={closeAll} className={menuLink}>كل القطع <ChevronLeft/></Link>
                {sectionLinks.map((x)=>(<Link key={x.href} href={x.href} onClick={closeAll} className={menuLink}>{x.label} <ChevronLeft/></Link>))}
                {nav.models.length > 0 && (
                  <>
                    <div className="mx-3 mb-1 mt-3 border-t border-tile-line pt-3 text-xs font-bold text-fg">الموديلات</div>
                    {modelLinks("grid-cols-2")}
                  </>
                )}
              </div>
            </div>

            <Link href={ABOUT_HREF} onClick={closeAll} className={drawerLink}><span>عن الشركة</span><span className="text-mist"><ChevronLeft/></span></Link>
            <Link href={CONTACT_HREF} onClick={closeAll} className={drawerLink}><span>تواصل معنا</span><span className="text-mist"><ChevronLeft/></span></Link>
            <Link href="/favorites" onClick={closeAll} className="mt-2 flex items-center justify-center gap-2 rounded-ui border border-tile-line bg-tile px-4 py-3 text-base font-bold text-fg transition hover:border-mist"><IconHeart />المفضلة</Link>
          </nav>

          {/* Bottom padding = bottom-nav height + safe area, so the last items are never hidden on small phones. */}
          <div className="mt-auto border-t border-tile-line px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-[calc(1rem+env(safe-area-inset-bottom))]"><div className="text-sm text-mist">بنرد بسرعة على واتساب.</div></div>
        </div>
      </div>
    </>
  );
}
