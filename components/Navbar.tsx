"use client";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import SearchForm from "@/components/SearchForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { OFFER_LABEL, productsHref, type NavData } from "@/lib/filters";
import { site, whatsappLink } from "@/lib/site";

function IconHeart(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>);}
function IconMenu(){return(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconPlus(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconMinus(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconClose(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function ChevronLeft(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 7l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function ChevronDown(){return(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}

export default function Navbar({ nav }: { nav: NavData }){
  const [drawerOpen,setDrawerOpen]=useState(false),[mobileMercedesOpen,setMobileMercedesOpen]=useState(false),[desktopMercedesOpen,setDesktopMercedesOpen]=useState(false);
  const whatsappHref=useMemo(()=>whatsappLink(),[]),mercedesRef=useRef<HTMLDivElement|null>(null);
  const closeAll=()=>{setDrawerOpen(false);setMobileMercedesOpen(false);setDesktopMercedesOpen(false);};

  // Links that only appear when they have products (categories from القسم, offers from عرض).
  const sectionLinks = [
    ...nav.categories.map((c) => ({ href: productsHref({ category: c.value }), label: c.label })),
    ...(nav.offerCount > 0 ? [{ href: productsHref({ offer: true }), label: OFFER_LABEL }] : []),
  ];

  useEffect(()=>{document.body.style.overflow=drawerOpen?"hidden":"";return()=>{document.body.style.overflow="";};},[drawerOpen]);
  useEffect(()=>{function onDocClick(e:MouseEvent){if(!desktopMercedesOpen)return;const t=e.target as Node;if(mercedesRef.current&&!mercedesRef.current.contains(t))setDesktopMercedesOpen(false);}document.addEventListener("mousedown",onDocClick);return()=>document.removeEventListener("mousedown",onDocClick);},[desktopMercedesOpen]);

  const barLink = "inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-on-dark-soft transition hover:bg-dark-line hover:text-on-dark";
  const quickLink = "inline-flex items-center rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-line-strong hover:bg-surface";
  const drawerLink = "flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3 text-base font-medium text-ink transition hover:bg-surface active:scale-[0.995]";
  const iconBtn = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dark-line bg-dark-raised text-on-dark transition hover:border-on-dark-soft active:scale-95";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-dark-line bg-dark text-on-dark">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center gap-2 sm:gap-4">
            <button type="button" onClick={()=>setDrawerOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="فتح القائمة" aria-expanded={drawerOpen}><IconMenu /></button>

            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${site.name} - الرئيسية`}>
              <Image src="/abood-logo.png" alt={site.name} width={44} height={44} priority className="h-11 w-11 rounded-xl object-cover"/>
              <div className="hidden leading-tight md:block"><div className="text-base font-bold text-on-dark">{site.name}</div><div className="text-sm text-on-dark-soft">{site.tagline}</div></div>
            </Link>

            <div className="hidden flex-1 sm:block">
              <Suspense fallback={null}><SearchForm /></Suspense>
            </div>

            <div className="ms-auto flex items-center gap-2 sm:ms-0">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-bold text-ink transition hover:bg-whatsapp-hover active:scale-95"><WhatsAppIcon />واتساب</a>
              <Link href="/favorites" className={`${iconBtn} hidden sm:inline-flex`} aria-label="المفضلة"><IconHeart /></Link>
            </div>
          </div>

          {/* Mobile: search is always visible under the logo row. */}
          <div className="pb-3 sm:hidden">
            <Suspense fallback={null}><SearchForm /></Suspense>
          </div>
        </div>

        <div className="hidden border-t border-dark-line bg-dark-raised lg:block">
          <div className="mx-auto max-w-6xl px-4">
            <div className="relative flex items-center gap-1 py-1">
              {nav.models.length > 0 && (
                <div ref={mercedesRef} className="relative">
                  <button type="button" onClick={()=>setDesktopMercedesOpen(true)} onMouseEnter={()=>setDesktopMercedesOpen(true)} className={`${barLink} text-on-dark`} aria-expanded={desktopMercedesOpen} aria-haspopup="true">مرسيدس <ChevronDown /></button>

                  <div onMouseLeave={()=>setDesktopMercedesOpen(false)} onKeyDown={(e)=>{if(e.key==="Escape")setDesktopMercedesOpen(false);}} className={["absolute right-0 top-full mt-2 w-[720px] overflow-hidden rounded-xl border border-line bg-card text-ink shadow-xl transition-all duration-200",desktopMercedesOpen?"pointer-events-auto translate-y-0 opacity-100":"pointer-events-none invisible -translate-y-2 opacity-0"].join(" ")}>
                    <div className="flex items-center justify-between border-b border-line bg-surface px-6 py-4">
                      <div className="text-base font-bold text-ink">موديلات مرسيدس</div>
                      <div className="text-sm text-ink-soft">اختر الموديل</div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-2">
                        {nav.models.map((m)=>(
                          <Link key={m.value} href={productsHref({ model: m.value })} prefetch={false} onClick={()=>setDesktopMercedesOpen(false)} className="group flex items-center justify-between gap-2 rounded-lg border border-line bg-card px-4 py-2 text-base font-medium text-ink transition hover:border-line-strong hover:bg-surface">
                            <span dir="ltr">{m.label}</span>
                            <span className="text-line-strong transition group-hover:text-accent-text"><ChevronLeft /></span>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl border border-line bg-surface p-4">
                        <div className="text-sm font-bold text-ink">روابط سريعة</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link href="/products" onClick={()=>setDesktopMercedesOpen(false)} className={quickLink}>كل القطع</Link>
                          {sectionLinks.map((x)=>(
                            <Link key={x.href} href={x.href} onClick={()=>setDesktopMercedesOpen(false)} className={quickLink}>{x.label}</Link>
                          ))}
                          <a href={whatsappHref} target="_blank" rel="noreferrer" className={quickLink}>تواصل معنا</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Link href="/products" className={barLink}>كل القطع</Link>
              {sectionLinks.map((x)=>(<Link key={x.href} href={x.href} className={barLink}>{x.label}</Link>))}
              <a href={whatsappHref} target="_blank" rel="noreferrer" className={barLink}>تواصل معنا</a>
            </div>
          </div>
        </div>
      </header>

      <div className={["fixed inset-0 z-50 transition",drawerOpen?"pointer-events-auto opacity-100":"pointer-events-none opacity-0"].join(" ")} aria-hidden={!drawerOpen} inert={!drawerOpen}>
        <div className={["absolute inset-0 bg-dark/60 transition-opacity",drawerOpen?"opacity-100":"opacity-0"].join(" ")} onClick={closeAll}/>
        <div className={["absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-surface shadow-2xl transition-transform duration-300",drawerOpen?"translate-x-0":"translate-x-full"].join(" ")} role="dialog" aria-modal="true" aria-label="القائمة">
          <div className="shrink-0 bg-dark px-4 pb-4 pt-4 text-on-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/abood-logo.png" alt={site.name} width={48} height={48} className="h-12 w-12 rounded-xl object-cover"/>
                <div className="leading-tight"><div className="text-base font-bold text-on-dark">{site.name}</div><div className="text-sm text-on-dark-soft">{site.tagline}</div></div>
              </div>
              <button type="button" onClick={closeAll} className={iconBtn} aria-label="إغلاق"><IconClose /></button>
            </div>

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 text-base font-bold text-ink transition hover:bg-whatsapp-hover active:scale-[0.99]"><WhatsAppIcon size={20} />تواصل واتساب الآن</a>
          </div>

          <nav className="px-4 py-4">
            {nav.models.length > 0 && (
              <>
                <button type="button" onClick={()=>setMobileMercedesOpen(v=>!v)} aria-expanded={mobileMercedesOpen} className={`${drawerLink} w-full`}>
                  <span className="font-bold">مرسيدس</span><span className="text-ink-soft">{mobileMercedesOpen?<IconMinus/>:<IconPlus/>}</span>
                </button>

                <div className={["overflow-hidden transition-all duration-300",mobileMercedesOpen?"mt-2 max-h-[560px]":"max-h-0"].join(" ")}>
                  <div className="rounded-xl border border-line bg-card p-2">
                    <div className="max-h-[420px] overflow-auto">
                      {nav.models.map((m)=>(
                        <Link key={m.value} href={productsHref({ model: m.value })} prefetch={false} onClick={closeAll} className="group flex items-center justify-between rounded-lg px-4 py-2 text-base font-medium text-ink transition hover:bg-surface">
                          <span dir="ltr">{m.label}</span>
                          <span className="text-line-strong transition group-hover:text-accent-text"><ChevronLeft/></span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-2 grid gap-2">
              <Link href="/products" onClick={closeAll} className={drawerLink}><span>كل القطع</span><span className="text-ink-soft"><ChevronLeft/></span></Link>
              {sectionLinks.map((x)=>(
                <Link key={x.href} href={x.href} onClick={closeAll} className={drawerLink}><span>{x.label}</span><span className="text-ink-soft"><ChevronLeft/></span></Link>
              ))}
              <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={closeAll} className={drawerLink}><span>تواصل معنا</span><span className="text-ink-soft"><ChevronLeft/></span></a>
            </div>

            <div className="mt-4">
              <Link href="/favorites" onClick={closeAll} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-card text-base font-bold text-ink transition hover:bg-surface active:scale-[0.99]"><IconHeart />المفضلة</Link>
            </div>
          </nav>

          <div className="mt-auto border-t border-line px-4 py-4"><div className="text-sm text-ink-soft">بنرد بسرعة على واتساب.</div></div>
        </div>
      </div>
    </>
  );
}
