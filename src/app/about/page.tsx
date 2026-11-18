import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLiveSite } from "@/data/content-store";

export const metadata = {
  title: "About & Philosophy — Ayu Priyambodo",
  description:
    "Background, design philosophy, and technical fluency of Ayu Priyambodo — Creative Director & Brand Identity Designer.",
};

export default async function AboutPage() {
  const site = await getLiveSite();
  const about = site.about;
  const tools = about?.toolchain || [
    { name: "Adobe InDesign", role: "Long-form editorial, bilingual grid pagination, bookbinding" },
    { name: "Adobe Illustrator", role: "Vector dielines, logotype drawing, packaging geometry" },
    { name: "Adobe Photoshop", role: "High-end retouching, pre-press CMYK profiling, key visuals" },
    { name: "Figma", role: "Design systems, typography scale tokens, responsive layouts" },
    { name: "CAD / ArtiosCAD", role: "2D packaging dielines, folding tolerances, structural design" },
    { name: "DaVinci Resolve", role: "Color grading (LUTs), commercial edit supervision, film delivery" },
  ];

  return (
    <>
      <Header site={site} />

      <main className="flex-1">
        {/* TOP BREADCRUMB */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A8881] hover:text-[#141413] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* HERO / BIO SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="space-y-6 max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
              {about?.badge || "Profile & Perspective"}
            </span>
            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#141413]">
              {about?.headline || "Designing with aesthetic authority & manufacturing rigor."}
            </h1>
            <p className="font-serif italic text-xl sm:text-2xl text-[#5A5852] leading-relaxed">
              {about?.subheading || "Bridging the gap between zero-to-one brand storytelling and real-world physical manufacturing."}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 border-t border-[#E5E2DA]">
            {/* Left Story Column */}
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#5A5852] leading-relaxed">
              {(about?.storyParagraphs || []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#2D2B27] transition-colors"
                >
                  <span>{about?.contactButtonText || "Initiate a Conversation"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={about?.resumeUrl || "#resume"}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold rounded-full border border-[#D5D1C7] text-[#141413] hover:bg-[#EAE7DF] transition-colors"
                >
                  <span>{about?.resumeButtonText || "Download Curriculum Vitae"}</span>
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Quick Facts & Philosophy Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-2xl bg-[#F4F2EC] border border-[#E5E2DA] space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                  Core Philosophy
                </span>
                <h3 className="font-editorial text-2xl text-[#141413]">
                  The Four Pillars of Discipline
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#5A5852] pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-[#141413]">01.</span>
                    <span><strong>Zero-to-One Brand Systems:</strong> Cohesive visual universes with scalable label and typographic anatomy.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-[#141413]">02.</span>
                    <span><strong>Packaging &amp; Pre-Press:</strong> Dielines, substrate caliper tolerances, and zero press downtime.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-[#141413]">03.</span>
                    <span><strong>Art Direction &amp; Film:</strong> Translating abstract moodboards into high-production commercial motion.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-[#141413]">04.</span>
                    <span><strong>Editorial &amp; B2B Systems:</strong> Complex bilingual grids and data clarity for C-suite decision-makers.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                  {about?.statusBoxTitle || "Current Status"}
                </span>
                <p className="text-sm text-[#141413] font-medium">
                  {about?.statusBoxText || "Accepting select brand identity, packaging design, and creative direction engagements for Q3/Q4."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL TOOLCHAIN SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 border-t border-[#E5E2DA]">
          <div className="space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                Technical Mastery
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl text-[#141413]">
                {about?.toolchainTitle || "Software & Toolchain Fluency"}
              </h2>
              <p className="text-sm text-[#64625C] leading-relaxed">
                {about?.toolchainDescription || "Operating with precision across industry-standard publishing, vector geometry, pre-press profiling, and color grading suites."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-2"
                >
                  <h3 className="font-mono text-sm font-bold text-[#141413]">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#64625C] leading-relaxed">
                    {tool.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer site={site} />
    </>
  );
}
