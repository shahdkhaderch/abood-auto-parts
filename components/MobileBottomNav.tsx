"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4h7v7H4ZM13 4h7v7h-7ZM4 13h7v7H4ZM13 13h7v7h-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function NavItem({ href, label, active, children }:{ href:string; label:string; active:boolean; children:React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={["relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition active:scale-95", active ? "text-ink" : "text-ink-soft"].join(" ")}
    >
      {active ? <span className="absolute top-0 h-1 w-10 rounded-ui bg-accent" /> : null}
      <span className={["flex h-8 w-12 items-center justify-center rounded-ui transition", active ? "bg-accent-tint" : ""].join(" ")}>{children}</span>
      <span className={["text-sm", active ? "font-bold" : "font-medium"].join(" ")}>{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const isProducts = pathname.startsWith("/products");
  const isFavorites = pathname.startsWith("/favorites");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-card/95 backdrop-blur-md sm:hidden">
      <div className="grid grid-cols-3 pb-[max(env(safe-area-inset-bottom),4px)]">
        <NavItem href="/" label="الرئيسية" active={isHome}><IconHome /></NavItem>
        <NavItem href="/products" label="القطع" active={isProducts}><IconGrid /></NavItem>
        <NavItem href="/favorites" label="المفضلة" active={isFavorites}><IconHeart /></NavItem>
      </div>
    </div>
  );
}
