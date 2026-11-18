"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ProjectItem } from "@/data/projects";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col justify-between border-t border-[#E5E2DA] pt-10 pb-16 transition-colors">
      <div className="space-y-6">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-wider text-[#8A8881]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#EAE7DF] text-[#141413] font-semibold">
              PILLAR {project.pillarNumber}
            </span>
            <span className="uppercase">{project.category}</span>
          </div>
          <span>{project.year}</span>
        </div>

        {/* Title and Short Value Prop */}
        <div className="space-y-2">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-2 group-hover:text-[#64625C] transition-colors"
          >
            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-tight">
              {project.title}
            </h3>
            <ArrowUpRight className="w-6 h-6 text-[#141413] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </Link>
          <p className="font-serif italic text-lg text-[#5A5852] max-w-3xl">
            {project.subtitle}
          </p>
          <p className="text-sm text-[#64625C] max-w-2xl leading-relaxed pt-1">
            {project.summary}
          </p>
        </div>

        {/* Visual Showcase / Cover Preview */}
        <Link
          href={`/work/${project.slug}`}
          className="relative block w-full overflow-hidden rounded-xl border border-[#E5E2DA] bg-[#F2EFE9] transition-all duration-500 group-hover:shadow-lg group-hover:border-[#D5D1C7]"
        >
          <div className="relative aspect-16/9 w-full">
            <Image
              src={project.coverImage}
              alt={`${project.title} — ${project.subtitle}`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority={index === 0}
            />
          </div>
        </Link>

        {/* Bottom Details & Tags */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#EAE7DF]/70 text-[#64625C] border border-[#DDD9CE]"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#141413] hover:underline underline-offset-4 self-start sm:self-auto"
          >
            <span>Read Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
