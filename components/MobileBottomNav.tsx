"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome({ active }:{ active:boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={active ? "scale-105" : ""}>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function IconHeart({ active }:{ active:boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={active ? "scale-105" : ""}>
      <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function IconUser({ active }:{ active:boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={active ? "scale-105" : ""}>
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function NavItem({ href, label, active, children }:{ href:string; label:string; active:boolean; children:React.ReactNode }) {
  return (
    <Link href={href} className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-white transition active:scale-95">
      {active ? <span className="absolute top-0 h-1 w-10 rounded-full bg-white" /> : null}
      <span className={["flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-200", active ? "bg-white/15 shadow-[0_8px_18px_rgba(0,0,0,0.18)]" : "bg-transparent"].join(" ")}>{children}</span>
      <span className={["text-[11px] font-extrabold tracking-tight transition", active ? "text-white" : "text-white/85"].join(" ")}>{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const isFavorites = pathname.startsWith("/favorites");
  const isAccount = pathname.startsWith("/account");

  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-50">
      <div className="border-t border-white/10 bg-gradient-to-b from-orange-500 to-orange-600 shadow-[0_-10px_30px_rgba(0,0,0,0.18)]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="grid grid-cols-3 px-0 pb-[max(env(safe-area-inset-bottom),6px)] pt-0">
          <NavItem href="/" label="الرئيسية" active={isHome}><IconHome active={isHome} /></NavItem>
          <NavItem href="/favorites" label="المفضلة" active={isFavorites}><IconHeart active={isFavorites} /></NavItem>
          <NavItem href="/account" label="حسابي" active={isAccount}><IconUser active={isAccount} /></NavItem>
        </div>
      </div>
    </div>
  );
}