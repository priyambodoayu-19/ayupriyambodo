"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SITE_METADATA } from "@/data/projects";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Work", href: "/#work" },
    { label: "Pillars", href: "/#pillars" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F5]/90 border-b border-[#E5E2DA]/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Name / Brand Mark */}
        <Link
          href="/"
          className="group flex flex-col items-start transition-opacity hover:opacity-80"
        >
          <span className="font-editorial text-2xl tracking-tight text-[#141413]">
            {SITE_METADATA.author}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-[#8A8881] font-medium">
            Creative Direction & Brand Identity
          </span>
        </Link>

        {/* Availability Badge & Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE7DF]/70 text-[12px] text-[#64625C] border border-[#DDD9CE]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Available for Select Projects</span>
          </div>

          <nav className="flex items-center gap-7 text-sm font-medium tracking-wide text-[#4A4843]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-[#141413] relative py-1 ${
                    isActive ? "text-[#141413] font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={`mailto:${SITE_METADATA.email}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] transition-colors"
            >
              Get in Touch
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-[#141413] hover:text-black focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F5] border-b border-[#E5E2DA] px-6 py-6 space-y-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAE7DF] text-[12px] text-[#64625C] border border-[#DDD9CE] w-fit">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Available for Select Projects</span>
          </div>

          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-editorial text-[#141413] hover:opacity-75 py-1 border-b border-[#EAE7DF]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`mailto:${SITE_METADATA.email}`}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold rounded-full bg-[#141413] text-[#FAF9F5] mt-4"
            >
              Get in Touch
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
