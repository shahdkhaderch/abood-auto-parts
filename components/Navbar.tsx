"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const WHATSAPP_NUMBER="972599842238",WHATSAPP_TEXT="مرحبا، بدي استفسر عن قطع مرسيدس.";
function getWhatsAppLink(){const text=encodeURIComponent(WHATSAPP_TEXT);return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;}
const MERCEDES_MODELS=["CLA","CLS","CLK","A Class","B Class","C Class","E Class","S Class","GLA","GLB","GLC","GLE","GLS","GLK","M/ML CLASS"];

function IconUser(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2"/></svg>);}
function IconHeart(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>);}
function IconSearch(){return(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconMenu(){return(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconPlus(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function IconMinus(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);}
function ChevronLeft(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 7l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}

export default function Navbar(){
  const [drawerOpen,setDrawerOpen]=useState(false),[mobileMercedesOpen,setMobileMercedesOpen]=useState(false),[desktopMercedesOpen,setDesktopMercedesOpen]=useState(false);
  const whatsappHref=useMemo(()=>getWhatsAppLink(),[]),mercedesRef=useRef<HTMLDivElement|null>(null);
  const closeAll=()=>{setDrawerOpen(false);setMobileMercedesOpen(false);setDesktopMercedesOpen(false);};

  useEffect(()=>{document.body.style.overflow=drawerOpen?"hidden":"auto";return()=>{document.body.style.overflow="auto";};},[drawerOpen]);
  useEffect(()=>{function onDocClick(e:MouseEvent){if(!desktopMercedesOpen)return;const t=e.target as Node;if(mercedesRef.current&&!mercedesRef.current.contains(t))setDesktopMercedesOpen(false);}document.addEventListener("mousedown",onDocClick);return()=>document.removeEventListener("mousedown",onDocClick);},[desktopMercedesOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={()=>setDrawerOpen(true)} className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 active:scale-95 transition" aria-label="فتح القائمة"><IconMenu /></button>
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <img src="/abood-logo.png" alt="عبود عبد ربه" className="h-14 w-14 rounded-2xl object-cover ring-1 ring-neutral-200"/>
                <div className="leading-tight hidden sm:block"><div className="text-sm font-semibold text-neutral-900">عبود عبد ربه</div><div className="text-[11px] text-neutral-500">قطع مرسيدس</div></div>
              </Link>
            </div>

            <div className="hidden sm:flex relative flex-1 mx-3">
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400"><IconSearch /></div>
              <input type="text" placeholder="ابحث بالاسم أو رقم القطعة أو الموديل..." className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pr-10 pl-3 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/>
            </div>

            <div className="flex items-center gap-2">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center justify-center rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 active:scale-95 transition">واتساب</a>
              <button type="button" className="inline-flex sm:hidden h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 active:scale-95 transition" aria-label="بحث"><IconSearch /></button>
              <button type="button" className="hidden sm:inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 transition" aria-label="الحساب"><IconUser /></button>
              <button type="button" className="hidden sm:inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 transition" aria-label="المفضلة"><IconHeart /></button>
            </div>
          </div>
        </div>

        <div className="hidden sm:block bg-gradient-to-b from-orange-500 to-orange-600">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 py-2 relative">
              <div ref={mercedesRef} className="relative">
                <button type="button" onClick={()=>setDesktopMercedesOpen(v=>!v)} onMouseEnter={()=>setDesktopMercedesOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition shadow-sm" aria-label="مرسيدس">مرسيدس <span className="text-white/85">▾</span></button>

                <div onMouseLeave={()=>setDesktopMercedesOpen(false)} className={["absolute top-full right-0 mt-2 w-[720px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-200",desktopMercedesOpen?"opacity-100 translate-y-0 pointer-events-auto":"opacity-0 -translate-y-2 pointer-events-none"].join(" ")}>
                  <div className="flex items-center justify-between px-5 py-4 bg-neutral-50 border-b border-neutral-200">
                    <div className="text-sm font-extrabold text-neutral-900">موديلات مرسيدس</div>
                    <div className="text-xs text-neutral-500">اختر الموديل</div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3">
                      {MERCEDES_MODELS.map((m)=>(
                        <a key={m} href={`#mercedes-${m.replace(/\s+/g,"-").toLowerCase()}`} onClick={()=>setDesktopMercedesOpen(false)} className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:border-orange-300 hover:bg-orange-50 transition">
                          <span>{m}</span><span className="text-neutral-300 group-hover:text-orange-600 transition"><ChevronLeft /></span>
                        </a>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                      <div className="text-xs font-extrabold text-neutral-800">روابط سريعة</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href="#interior" className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-900 border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition">كماليات داخلية</a>
                        <a href="#exterior" className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-900 border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition">كماليات خارجية</a>
                        <a href="#lights" className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-900 border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition">أضوية السيارة</a>
                        <a href="#offers" className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-900 border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition">عروض</a>
                        <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-900 border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition">تواصل معنا</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a href="#interior" className="inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition shadow-sm">كماليات داخلية</a>
              <a href="#exterior" className="inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition shadow-sm">كماليات خارجية</a>
              <a href="#lights" className="inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition shadow-sm">أضوية السيارة</a>
              <a href="#offers" className="inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition shadow-sm">عروض</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition shadow-sm">تواصل معنا</a>
            </div>
          </div>
        </div>
      </header>

      <div className={["fixed inset-0 z-50 transition",drawerOpen?"pointer-events-auto opacity-100":"pointer-events-none opacity-0"].join(" ")} aria-hidden={!drawerOpen}>
        <div className={["absolute inset-0 bg-black/50 transition-opacity",drawerOpen?"opacity-100":"opacity-0"].join(" ")} onClick={closeAll}/>
        <div className={["absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl transition-transform duration-300",drawerOpen?"translate-x-0":"translate-x-full"].join(" ")} role="dialog" aria-modal="true">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-orange-600"/>
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl"/>
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-black/10 blur-xl"/>
            <div className="relative flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <img src="/abood-logo.png" alt="عبود عبد ربه" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/30"/>
                <div className="leading-tight"><div className="text-sm font-bold text-white">عبود عبد ربه</div><div className="text-[11px] text-white/85">قطع مرسيدس</div></div>
              </div>
              <button type="button" onClick={closeAll} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white hover:bg-white/20 active:scale-95 transition" aria-label="إغلاق"><span className="text-2xl leading-none">×</span></button>
            </div>

            <div className="relative px-4 pb-4">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-orange-600 shadow-sm active:scale-[0.99] transition">تواصل واتساب الآن</a>
            </div>
          </div>

          <nav className="px-4 py-4">
            <button type="button" onClick={()=>setMobileMercedesOpen(v=>!v)} className="relative w-full flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition">
              <span className="absolute right-0 top-0 h-full w-1 bg-orange-500"/>
              <span>مرسيدس</span><span className="text-neutral-700">{mobileMercedesOpen?<IconMinus/>:<IconPlus/>}</span>
            </button>

            <div className={["overflow-hidden transition-all duration-300",mobileMercedesOpen?"max-h-[560px] mt-3":"max-h-0"].join(" ")}>
              <div className="rounded-2xl border border-orange-100 bg-gradient-to-b from-orange-50 to-white p-2">
                <div className="max-h-[420px] overflow-auto pr-1">
                  {MERCEDES_MODELS.map((m)=>(
                    <a key={m} href={`#mercedes-${m.replace(/\s+/g,"-").toLowerCase()}`} onClick={closeAll} className="group flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold text-neutral-900 hover:bg-white transition">
                      <span className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-orange-500"/>{m}</span>
                      <span className="text-neutral-300 group-hover:text-orange-600 transition"><ChevronLeft/></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {[{href:"#interior",label:"كماليات داخلية"},{href:"#exterior",label:"كماليات خارجية"},{href:"#lights",label:"أضوية السيارة"},{href:"#offers",label:"عروض"},{href:whatsappHref,label:"تواصل معنا",external:true}].map((x)=>(
                <a key={x.label} href={x.href} target={x.external ? "_blank" : undefined} rel={x.external ? "noreferrer" : undefined} onClick={closeAll} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition active:scale-[0.995]">
                  <span className="absolute right-0 top-0 h-full w-1 bg-orange-500"/><div className="flex items-center justify-between"><span>{x.label}</span><span className="text-neutral-300">‹</span></div>
                </a>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-neutral-900 text-white font-extrabold hover:opacity-95 active:scale-[0.99] transition" aria-label="الحساب"><IconUser />الحساب</button>
              <button type="button" className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.99] transition" aria-label="المفضلة"><IconHeart />المفضلة</button>
            </div>
          </nav>

          <div className="mt-auto border-t border-neutral-200 px-4 py-4"><div className="text-xs text-neutral-500">بنرد بسرعة على واتساب.</div></div>
        </div>
      </div>
    </>
  );
}