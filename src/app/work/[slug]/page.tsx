import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparisonSlider from "@/components/ComparisonSlider";
import DielineInspector from "@/components/DielineInspector";
import VideoPlayer from "@/components/VideoPlayer";
import CarouselSlider from "@/components/CarouselSlider";
import { getLiveProjects, getLiveSite } from "@/data/content-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getLiveProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found — Ayu Priyambodo",
    };
  }

  return {
    title: `${project.title} (${project.pillarTitle}) — Ayu Priyambodo`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, projects] = await Promise.all([
    getLiveSite(),
    getLiveProjects(),
  ]);

  const projectIndex = projects.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const prevProject =
    projects[(projectIndex - 1 + projects.length) % projects.length];

  return (
    <>
      <Header site={site} />

      <main className="flex-1">
        {/* TOP BREADCRUMB & BACK LINK */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-6">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A8881] hover:text-[#141413] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Work</span>
          </Link>
        </div>

        {/* HERO TITLE SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16">
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-wider text-[#8A8881]">
              <span className="px-3 py-1 rounded bg-[#141413] text-[#FAF9F5] font-semibold">
                PILLAR {project.pillarNumber}
              </span>
              <span className="uppercase text-[#5A5852] font-semibold">
                {project.pillarTitle}
              </span>
              <span>·</span>
              <span>{project.year}</span>
            </div>

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[#141413]">
              {project.title}
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl text-[#5A5852] leading-snug">
              {project.subtitle}
            </p>

            <p className="text-base sm:text-lg text-[#64625C] leading-relaxed max-w-4xl pt-2">
              {project.summary}
            </p>
          </div>

          {/* PROJECT METADATA BAR */}
          <div className="mt-12 pt-8 pb-8 border-y border-[#E5E2DA] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
                Role / Discipline
              </span>
              <span className="font-medium text-[#141413]">{project.role}</span>
            </div>
            <div>
              <span className="font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
                Client / Brand
              </span>
              <span className="font-medium text-[#141413]">{project.client}</span>
            </div>
            <div>
              <span className="font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
                Timeline / Year
              </span>
              <span className="font-medium text-[#141413]">{project.year}</span>
            </div>
            <div>
              <span className="font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
                Project Status
              </span>
              <span className="font-medium text-emerald-800">{project.status}</span>
            </div>
          </div>

          {/* KEY METRICS / IMPACT CARDS */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {project.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA]"
                >
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-2">
                    {metric.label}
                  </span>
                  <span className="font-editorial text-2xl sm:text-3xl text-[#141413] font-semibold">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HERO IMAGE OR VIDEO SHOWCASE */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 space-y-12">
          {project.videoData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                  Commercial Motion Direction // Final Result
                </span>
                <span className="text-xs font-mono text-[#8A8881] hidden sm:inline">
                  Sound On · 1080p
                </span>
              </div>
              <VideoPlayer video={project.videoData} />
            </div>
          ) : (
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden border border-[#E5E2DA] bg-[#F2EFE9] shadow-md">
              <Image
                src={project.coverImage}
                alt={`${project.title} Primary Showcase`}
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                priority
              />
            </div>
          )}
        </section>

        {/* NARRATIVE & STRATEGY SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-t border-[#E5E2DA]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                Context &amp; Strategy
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#141413] tracking-tight">
                The Creative Challenge &amp; Strategic Solution
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-8 text-base text-[#5A5852] leading-relaxed">
              <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  The Challenge
                </h3>
                <p>{project.overview.challenge}</p>
              </div>

              <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  Strategic Solution
                </h3>
                <p>{project.overview.strategicSolution}</p>
              </div>

              <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  The Outcome
                </h3>
                <p>{project.overview.outcome}</p>
              </div>
            </div>
          </div>
        </section>

        {/* DELIVERABLES & TECHNICAL SPECS */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-t border-[#E5E2DA]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Deliverables List */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                Scope of Work
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#141413]">
                Delivered Outputs
              </h3>
              <ul className="space-y-3 pt-2">
                {project.deliverables.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[#4A4843]"
                  >
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Spec Matrix */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                Technical Standards
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#141413]">
                Production &amp; System Specs
              </h3>
              {project.specs && (
                <div className="space-y-4 pt-2">
                  {Object.entries(project.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-lg bg-[#FAF9F5] border border-[#E5E2DA]"
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
                        {key}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[#141413]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BESPOKE SECTIONS (DIELINE, COMPARISON, GALLERY, CAROUSEL) */}
        {project.sections.map((section) => {
          const spacingClass =
            section.spacing === "compact"
              ? "py-10"
              : section.spacing === "generous"
              ? "py-24"
              : "py-16";

          const titleSizeClass =
            section.fontSize === "7xl"
              ? "text-5xl sm:text-6xl lg:text-7xl"
              : section.fontSize === "5xl"
              ? "text-4xl sm:text-5xl"
              : section.fontSize === "xl"
              ? "text-2xl sm:text-3xl"
              : "text-3xl sm:text-4xl";

          const hasBgImage =
            section.background?.type === "image" && section.background?.imageUrl;
          const hasBgColor =
            section.background?.type === "color" && section.background?.color;

          return (
            <section
              key={section.id}
              className={`relative border-t border-[#E5E2DA] ${spacingClass} ${
                hasBgColor ? "" : ""
              }`}
              style={{
                backgroundColor: hasBgColor ? section.background?.color : undefined,
              }}
            >
              {/* Optional Background Image with Overlay */}
              {hasBgImage && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={section.background!.imageUrl!}
                    alt="Section background"
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-[#141413]"
                    style={{
                      opacity: section.background?.overlayOpacity ?? 0.5,
                    }}
                  />
                </div>
              )}

              <div
                className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8 ${
                  hasBgImage ? "text-[#FAF9F5]" : ""
                }`}
              >
                <div className="max-w-3xl space-y-2">
                  {section.kicker && (
                    <span
                      className={`text-xs font-mono uppercase tracking-widest ${
                        hasBgImage ? "text-amber-300" : "text-[#8A8881]"
                      }`}
                    >
                      {section.kicker}
                    </span>
                  )}
                  <h2
                    className={`font-editorial ${titleSizeClass} ${
                      hasBgImage ? "text-[#FAF9F5]" : "text-[#141413]"
                    }`}
                  >
                    {section.title}
                  </h2>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      hasBgImage ? "text-[#EAE7DF]" : "text-[#5A5852]"
                    }`}
                  >
                    {section.description}
                  </p>
                </div>

                {/* Dynamic Rendering Based on Section Type */}
                {section.type === "carousel" && section.items && (
                  <CarouselSlider
                    items={section.items}
                    fallbackImage={project.coverImage}
                    settings={section.carouselSettings}
                  />
                )}

                {section.type === "dieline" && section.dielineData && (
                  <DielineInspector
                    dielineData={section.dielineData}
                    coverImage={project.coverImage}
                  />
                )}

                {section.type === "comparison" && section.comparisonData && (
                  <ComparisonSlider
                    beforeLabel={section.comparisonData.beforeLabel}
                    afterLabel={section.comparisonData.afterLabel}
                    beforeImage={section.comparisonData.beforeImage}
                    afterImage={section.comparisonData.afterImage}
                    beforeDescription={section.comparisonData.beforeDescription}
                    afterDescription={section.comparisonData.afterDescription}
                  />
                )}

                {(section.type === "gallery" || section.type === "editorial") &&
                  section.items && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {section.items.map((item, index) => (
                        <div
                          key={index}
                          className="group p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs"
                        >
                          <div className="relative aspect-16/9 w-full rounded-lg overflow-hidden border border-[#E5E2DA] bg-[#F2EFE9]">
                            <Image
                              src={item.image || project.coverImage}
                              alt={item.caption}
                              fill
                              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-editorial text-lg text-[#141413]">
                              {item.caption}
                            </h4>
                            {item.subcaption && (
                              <p className="text-xs text-[#64625C] leading-relaxed">
                                {item.subcaption}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </section>
          );
        })}

        {/* BOTTOM CASE STUDY NEXT / PREV NAVIGATION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-t border-[#E5E2DA]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href={`/work/${prevProject.slug}`}
              className="p-6 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA] hover:border-[#C5C0B3] transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#8A8881]">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Case Study</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8A8881] block">
                  PILLAR {prevProject.pillarNumber}
                </span>
                <h4 className="font-editorial text-2xl text-[#141413] group-hover:text-[#64625C] transition-colors">
                  {prevProject.title}
                </h4>
              </div>
            </Link>

            <Link
              href={`/work/${nextProject.slug}`}
              className="p-6 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA] hover:border-[#C5C0B3] transition-all group flex flex-col justify-between space-y-4 text-right"
            >
              <div className="flex items-center justify-end gap-2 text-xs font-mono uppercase text-[#8A8881]">
                <span>Next Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8A8881] block">
                  PILLAR {nextProject.pillarNumber}
                </span>
                <h4 className="font-editorial text-2xl text-[#141413] group-hover:text-[#64625C] transition-colors">
                  {nextProject.title}
                </h4>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer site={site} />
    </>
  );
}
