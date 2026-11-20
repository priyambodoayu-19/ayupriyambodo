import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles, Box, Film, FileText, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { getLiveProjects, getLiveSite } from "@/data/content-store";

export default async function HomePage() {
  const [site, projects] = await Promise.all([
    getLiveSite(),
    getLiveProjects(),
  ]);

  const pillarIcons = [
    <Sparkles key="1" className="w-5 h-5 text-[#141413]" />,
    <Box key="2" className="w-5 h-5 text-[#141413]" />,
    <Film key="3" className="w-5 h-5 text-[#141413]" />,
    <FileText key="4" className="w-5 h-5 text-[#141413]" />,
  ];

  return (
    <>
      <Header site={site} />

      <main className="flex-1">
        {/* HERO SECTION */}
        {(() => {
          const hero = site.hero;
          const heroPadding =
            hero?.spacing === "compact"
              ? "pt-14 pb-16 md:pt-20 md:pb-24"
              : hero?.spacing === "generous"
              ? "pt-28 pb-32 md:pt-36 md:pb-44"
              : "pt-20 pb-24 md:pt-28 md:pb-32";

          const headlineClass =
            hero?.fontSize === "7xl"
              ? "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
              : hero?.fontSize === "5xl"
              ? "text-4xl sm:text-5xl lg:text-6xl"
              : hero?.fontSize === "3xl"
              ? "text-3xl sm:text-4xl lg:text-5xl"
              : "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl";

          const hasBgImage = hero?.background?.type === "image" && hero.background.imageUrl;
          const hasBgColor = hero?.background?.type === "color" && hero.background.color;

          return (
            <div
              className={`relative ${heroPadding} overflow-hidden`}
              style={{
                backgroundColor: hasBgColor ? hero.background?.color : undefined,
              }}
            >
              {hasBgImage && (
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.background!.imageUrl!}
                    alt="Hero background"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-[#141413]"
                    style={{
                      opacity: hero.background?.overlayOpacity ?? 0.5,
                    }}
                  />
                </div>
              )}

              <div className={`relative z-10 space-y-8 max-w-5xl ${hasBgImage ? "text-[#FAF9F5]" : ""}`}>
                {/* Tag / Pre-headline */}
                <div
                  className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-wider ${
                    hasBgImage
                      ? "bg-black/50 border-white/20 text-[#FAF9F5]"
                      : "bg-[#EAE7DF] border-[#DDD9CE] text-[#64625C]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${hasBgImage ? "bg-amber-400" : "bg-[#141413]"}`} />
                  <span>{hero?.badge || "CREATIVE DIRECTION & BRAND IDENTITY PORTFOLIO"}</span>
                </div>

                {/* Main Editorial Headline */}
                <h1 className={`font-editorial ${headlineClass} tracking-tight leading-[1.04] ${hasBgImage ? "text-[#FAF9F5]" : "text-[#141413]"}`}>
                  {hero?.headlinePrefix || "Translating zero-to-one concepts into"}{" "}
                  <span className={`font-serif italic font-normal ${hasBgImage ? "text-amber-200" : "text-[#5A5852]"}`}>
                    {hero?.headlineItalic || "shelf-ready systems"}
                  </span>
                  {hero?.headlineSuffix || ", commercial campaigns, & executive editorial."}
                </h1>

                {/* Sub-paragraph */}
                <p className={`text-lg sm:text-xl max-w-3xl font-normal leading-relaxed pt-2 ${hasBgImage ? "text-[#EAE7DF]" : "text-[#5A5852]"}`}>
                  {hero?.subheadline ||
                    "I partner with ambitious brand founders, creative directors, and executive teams to build enduring visual worlds—from raw botanical formulation concepts and factory pre-press dielines to high-impact launch films and bilingual investor publications."}
                </p>

                {/* Quick Action Buttons & Scroll Anchor */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <a
                    href={hero?.primaryButtonLink || "#work"}
                    className={`inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold rounded-full transition-colors ${
                      hasBgImage
                        ? "bg-[#FAF9F5] text-[#141413] hover:bg-white"
                        : "bg-[#141413] text-[#FAF9F5] hover:bg-[#2D2B27]"
                    }`}
                  >
                    <span>{hero?.primaryButtonText || "Explore Featured Work"}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href={hero?.secondaryButtonLink || "/about"}
                    className={`inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold rounded-full border transition-colors ${
                      hasBgImage
                        ? "border-white/40 text-[#FAF9F5] hover:bg-white/10"
                        : "border-[#D5D1C7] text-[#141413] hover:bg-[#EAE7DF]"
                    }`}
                  >
                    <span>{hero?.secondaryButtonText || "Read Profile & Approach"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Quick Pillar Index Strip */}
        <div id="pillars" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-16 pt-10 border-t border-[#E5E2DA] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group p-5 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA] hover:border-[#C5C0B3] transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#8A8881]">
                    PILLAR {project.pillarNumber}
                  </span>
                  {pillarIcons[index % pillarIcons.length]}
                </div>
                <h3 className="font-editorial text-xl text-[#141413] group-hover:text-[#64625C] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-[#64625C] leading-relaxed line-clamp-2">
                  {project.subtitle}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-[11px] font-mono uppercase text-[#8A8881] group-hover:text-[#141413] transition-colors">
                <span>View Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* FEATURED WORK / THE 4 PILLARS SECTION */}
        <section id="work" className="py-20 md:py-28 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                {site.workSection?.kicker || "Core Curated Portfolio"}
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#141413] tracking-tight">
                {site.workSection?.title || "The Four Pillars"}
              </h2>
            </div>
            <p className="text-sm text-[#64625C] max-w-md font-normal leading-relaxed">
              {site.workSection?.description ||
                "Every angle required by design directors, brand managers, and lead recruiters: from zero-to-one design systems and manufacturing specs to commercial film and bilingual publications."}
            </p>
          </div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* CAPABILITIES & TECHNICAL FLUENCY */}
        <section className="py-20 md:py-28 bg-[#F4F2EC] border-y border-[#E5E2DA]">
          <div className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                Comprehensive Fluency
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl text-[#141413] tracking-tight">
                End-to-End Capabilities
              </h2>
              <p className="text-base text-[#5A5852] leading-relaxed">
                Bridging the critical gap between conceptual aesthetic vision and rigorous technical execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(site.capabilities || []).map((group) => (
                <div
                  key={group.category}
                  className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#141413]" />
                    <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                      {group.category}
                    </h3>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#5A5852]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8A8881] shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
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
