"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, Copy, Check, ArrowUpRight } from "lucide-react";
import { SITE_METADATA } from "@/data/projects";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SITE_METADATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="border-t border-[#E5E2DA] bg-[#F4F2EC] text-[#141413] mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
        {/* Main CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#E5E2DA]">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A8881]">
              Initiate Collaboration
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#141413]">
              Have a brand to define, packaging to engineer, or a campaign to direct?
            </h2>
            <p className="text-base sm:text-lg text-[#64625C] max-w-xl font-normal leading-relaxed">
              Available for full zero-to-one brand identity, pre-press manufacturing consulting,
              and design direction worldwide.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end space-y-6">
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] shadow-xs">
              <span className="text-xs uppercase tracking-wider text-[#8A8881] block mb-2 font-medium">
                Direct Inquiries
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <a
                  href={`mailto:${SITE_METADATA.email}`}
                  className="font-editorial text-2xl text-[#141413] hover:underline underline-offset-4"
                >
                  {SITE_METADATA.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#D5D1C7] hover:bg-[#EAE7DF] transition-colors self-start sm:self-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#64625C]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {SITE_METADATA.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#4A4843] hover:text-[#141413] transition-colors border-b border-transparent hover:border-[#141413]"
                >
                  <span>{social.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#8A8881]">
          <div className="space-y-1">
            <p>© 2026 Ayu Priyambodo. All rights reserved.</p>
            <p>Jakarta, Indonesia · Working Globally</p>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Set in Newsreader & Geist</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#141413] transition-colors group cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
