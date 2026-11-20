"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Check,
  ArrowUpRight,
  LogOut,
  Video,
  Sparkles,
  Box,
  Film,
  FileText,
  User,
  Layout,
  Compass,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  ExternalLink,
  Briefcase,
  Layers,
  Sliders,
  Eye,
  CheckCircle2,
  FileBox,
  Image as ImageIcon,
  Tag,
  SlidersHorizontal,
  Copy,
  Monitor,
  Smartphone,
  Palette,
  Type,
  Maximize2,
  Sparkle,
  Settings2,
  HelpCircle,
} from "lucide-react";
import { ProjectItem, ProjectSection, SectionBackground, CarouselSettings, SiteMetadata, ToolchainItem } from "@/data/projects";
import CarouselSlider from "@/components/CarouselSlider";
import ComparisonSlider from "@/components/ComparisonSlider";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [site, setSite] = useState<SiteMetadata | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Visual Builder Modes
  const [viewMode, setViewMode] = useState<"visual" | "form">("visual");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number | null>(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Check auth and load content on mount
  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch("/api/admin/auth");
        if (!authRes.ok) {
          router.push("/admin/login");
          return;
        }

        const res = await fetch("/api/admin/content");
        const data = await res.json();
        setSite(data.site);
        setProjects(data.projects);
      } catch (err) {
        console.error("Failed to load CMS data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleSave = async () => {
    if (!site || !projects) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setStatusMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site, projects }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setStatusMessage("Saved & synced live to your website!");
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert(data.error || "Failed to save");
      }
    } catch {
      alert("Error saving data. Please check network connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // ==========================================
  // SITE METADATA HELPERS
  // ==========================================

  const updateSiteHero = (field: string, value: any) => {
    if (!site) return;
    setSite({
      ...site,
      hero: {
        ...(site.hero || {
          badge: "CREATIVE DIRECTION & BRAND IDENTITY PORTFOLIO",
          headlinePrefix: "Translating zero-to-one concepts into",
          headlineItalic: "shelf-ready systems",
          headlineSuffix: ", commercial campaigns, & executive editorial.",
          subheadline:
            "I partner with ambitious brand founders, creative directors, and executive teams to build enduring visual worlds.",
          primaryButtonText: "Explore Featured Work",
          primaryButtonLink: "#work",
          secondaryButtonText: "Read Profile & Approach",
          secondaryButtonLink: "/about",
          fontSize: "7xl",
          spacing: "normal",
        }),
        [field]: value,
      },
    });
  };

  const updateSiteHeroBackground = (field: string, value: any) => {
    if (!site) return;
    setSite({
      ...site,
      hero: {
        ...site.hero,
        background: {
          ...(site.hero?.background || { type: "color", color: "#FAF9F5" }),
          [field]: value,
        },
      },
    });
  };

  const updateSiteAbout = (field: string, value: any) => {
    if (!site) return;
    setSite({
      ...site,
      about: {
        ...(site.about || {
          badge: "Profile & Perspective",
          headline: "Designing with aesthetic authority & manufacturing rigor.",
          subheading: "Bridging the gap between zero-to-one brand storytelling and physical manufacturing.",
          storyParagraphs: [],
          statusBoxTitle: "Current Status",
          statusBoxText: "Accepting select brand identity engagements for Q3/Q4.",
          resumeButtonText: "Download Curriculum Vitae",
          resumeUrl: "#resume",
          contactButtonText: "Initiate a Conversation",
          toolchainTitle: "Software & Toolchain Fluency",
          toolchainDescription: "Operating with precision across publishing, vector geometry, and motion.",
          toolchain: [],
        }),
        [field]: value,
      },
    });
  };

  const updateAboutStoryParagraph = (index: number, text: string) => {
    if (!site?.about) return;
    const updated = [...(site.about.storyParagraphs || [])];
    updated[index] = text;
    updateSiteAbout("storyParagraphs", updated);
  };

  const addAboutStoryParagraph = () => {
    if (!site?.about) return;
    const updated = [...(site.about.storyParagraphs || []), ""];
    updateSiteAbout("storyParagraphs", updated);
  };

  const removeAboutStoryParagraph = (index: number) => {
    if (!site?.about) return;
    const updated = (site.about.storyParagraphs || []).filter((_, i) => i !== index);
    updateSiteAbout("storyParagraphs", updated);
  };

  const updateAboutTool = (index: number, field: "name" | "role", value: string) => {
    if (!site?.about) return;
    const updated = [...(site.about.toolchain || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      updateSiteAbout("toolchain", updated);
    }
  };

  const addAboutTool = () => {
    if (!site?.about) return;
    const updated: ToolchainItem[] = [
      ...(site.about.toolchain || []),
      { name: "New Tool / Software", role: "Specialization details" },
    ];
    updateSiteAbout("toolchain", updated);
  };

  const removeAboutTool = (index: number) => {
    if (!site?.about) return;
    const updated = (site.about.toolchain || []).filter((_, i) => i !== index);
    updateSiteAbout("toolchain", updated);
  };

  const updateSiteWorkSection = (field: string, value: string) => {
    if (!site) return;
    setSite({
      ...site,
      workSection: {
        ...(site.workSection || {
          kicker: "Core Curated Portfolio",
          title: "The Four Pillars",
          description: "Every angle required by design directors, brand managers, and lead recruiters.",
        }),
        [field]: value,
      },
    });
  };

  // ==========================================
  // NAVIGATION HELPERS
  // ==========================================

  const addNavLink = (label: string = "New Page", href: string = "/#") => {
    if (!site) return;
    const currentLinks = site.navLinks || [];
    const newLink = {
      id: `nav-${Date.now()}`,
      label,
      href,
    };
    setSite({
      ...site,
      navLinks: [...currentLinks, newLink],
    });
  };

  const removeNavLink = (id: string) => {
    if (!site) return;
    const currentLinks = site.navLinks || [];
    setSite({
      ...site,
      navLinks: currentLinks.filter((item) => item.id !== id),
    });
  };

  const updateNavLink = (id: string, field: "label" | "href", value: string) => {
    if (!site) return;
    const currentLinks = site.navLinks || [];
    setSite({
      ...site,
      navLinks: currentLinks.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    });
  };

  const moveNavLink = (index: number, direction: "up" | "down") => {
    if (!site) return;
    const currentLinks = [...(site.navLinks || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentLinks.length) return;
    const temp = currentLinks[index];
    currentLinks[index] = currentLinks[targetIndex];
    currentLinks[targetIndex] = temp;
    setSite({ ...site, navLinks: currentLinks });
  };

  // ==========================================
  // PROJECT HELPERS (METADATA, VIDEO, METRICS)
  // ==========================================

  const updateProjectField = (slug: string, field: string, value: any) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const updateProjectOverview = (slug: string, field: string, value: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return {
            ...p,
            overview: { ...p.overview, [field]: value },
          };
        }
        return p;
      })
    );
  };

  const updateProjectVideo = (slug: string, field: string, value: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return {
            ...p,
            videoData: {
              ...(p.videoData || { url: "" }),
              [field]: value,
            },
          };
        }
        return p;
      })
    );
  };

  // Key Impact Metrics Helpers
  const updateProjectMetric = (slug: string, index: number, field: "label" | "value", val: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const metrics = [...(p.metrics || [])];
          if (metrics[index]) {
            metrics[index] = { ...metrics[index], [field]: val };
          }
          return { ...p, metrics };
        }
        return p;
      })
    );
  };

  const addProjectMetric = (slug: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const metrics = [...(p.metrics || []), { label: "New Metric", value: "Metric Value" }];
          return { ...p, metrics };
        }
        return p;
      })
    );
  };

  const removeProjectMetric = (slug: string, index: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const metrics = (p.metrics || []).filter((_, i) => i !== index);
          return { ...p, metrics };
        }
        return p;
      })
    );
  };

  // Deliverables Helpers
  const updateProjectDeliverable = (slug: string, index: number, val: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const deliverables = [...(p.deliverables || [])];
          deliverables[index] = val;
          return { ...p, deliverables };
        }
        return p;
      })
    );
  };

  const addProjectDeliverable = (slug: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const deliverables = [...(p.deliverables || []), "New Deliverable Output"];
          return { ...p, deliverables };
        }
        return p;
      })
    );
  };

  const removeProjectDeliverable = (slug: string, index: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const deliverables = (p.deliverables || []).filter((_, i) => i !== index);
          return { ...p, deliverables };
        }
        return p;
      })
    );
  };

  // Technical Specs Helpers
  const updateProjectSpecKey = (slug: string, oldKey: string, newKey: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug && p.specs) {
          const newSpecs: Record<string, string> = {};
          for (const [k, v] of Object.entries(p.specs)) {
            if (k === oldKey) {
              newSpecs[newKey] = v;
            } else {
              newSpecs[k] = v;
            }
          }
          return { ...p, specs: newSpecs };
        }
        return p;
      })
    );
  };

  const updateProjectSpecValue = (slug: string, key: string, value: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return {
            ...p,
            specs: { ...(p.specs || {}), [key]: value },
          };
        }
        return p;
      })
    );
  };

  const addProjectSpec = (slug: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const existingSpecs = p.specs || {};
          const newKey = `Specification ${Object.keys(existingSpecs).length + 1}`;
          return {
            ...p,
            specs: { ...existingSpecs, [newKey]: "Details & specifications" },
          };
        }
        return p;
      })
    );
  };

  const removeProjectSpec = (slug: string, key: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug && p.specs) {
          const newSpecs = { ...p.specs };
          delete newSpecs[key];
          return { ...p, specs: newSpecs };
        }
        return p;
      })
    );
  };

  // ==========================================
  // MODULAR SECTION & VISUAL BUILDER HELPERS
  // ==========================================

  const updateSectionField = (slug: string, secIdx: number, field: string, val: any) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          if (sections[secIdx]) {
            sections[secIdx] = { ...sections[secIdx], [field]: val };
          }
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const updateSectionBackground = (slug: string, secIdx: number, field: string, val: any) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          if (sections[secIdx]) {
            const currentBg = sections[secIdx].background || { type: "color", color: "#FAF9F5" };
            sections[secIdx] = {
              ...sections[secIdx],
              background: { ...currentBg, [field]: val },
            };
          }
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const updateSectionCarouselSettings = (slug: string, secIdx: number, field: string, val: any) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          if (sections[secIdx]) {
            const currentSettings = sections[secIdx].carouselSettings || {
              autoplay: false,
              intervalSeconds: 5,
              showArrows: true,
              showDots: true,
            };
            sections[secIdx] = {
              ...sections[secIdx],
              carouselSettings: { ...currentSettings, [field]: val },
            };
          }
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const moveSection = (slug: string, secIdx: number, direction: "up" | "down") => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          const targetIdx = direction === "up" ? secIdx - 1 : secIdx + 1;
          if (targetIdx < 0 || targetIdx >= sections.length) return p;
          const temp = sections[secIdx];
          sections[secIdx] = sections[targetIdx];
          sections[targetIdx] = temp;
          setSelectedSectionIdx(targetIdx);
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const duplicateSection = (slug: string, secIdx: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          const original = sections[secIdx];
          if (!original) return p;
          const cloned: ProjectSection = {
            ...original,
            id: `sec-${Date.now()}`,
            title: `${original.title} (Copy)`,
          };
          sections.splice(secIdx + 1, 0, cloned);
          setSelectedSectionIdx(secIdx + 1);
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const addSectionWithTemplate = (slug: string, templateType: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          let newSec: ProjectSection;
          if (templateType === "carousel") {
            newSec = {
              id: `sec-${Date.now()}`,
              title: "Interactive Visual Carousel",
              kicker: "Curated Showcase",
              description: "Swipe or use navigation controls to explore the visual gallery.",
              type: "carousel",
              spacing: "normal",
              fontSize: "3xl",
              carouselSettings: {
                autoplay: true,
                intervalSeconds: 4,
                showArrows: true,
                showDots: true,
              },
              items: [
                {
                  caption: "Primary Formulation Slide",
                  subcaption: "High-resolution packaging profile with spot Pantone finishes.",
                  image: p.coverImage,
                  aspect: "16/9",
                },
                {
                  caption: "Secondary Detail Slide",
                  subcaption: "Macro focus on tactile unboxing and debossed closures.",
                  image: p.coverImage,
                  aspect: "16/9",
                },
              ],
            };
          } else if (templateType === "comparison") {
            newSec = {
              id: `sec-${Date.now()}`,
              title: "Transformation & Retouching Slider",
              kicker: "Before & After",
              description: "Drag the slider handle to inspect precision retouching and color grading.",
              type: "comparison",
              spacing: "normal",
              fontSize: "3xl",
              comparisonData: {
                beforeLabel: "Raw Camera Capture",
                afterLabel: "Commercial Retouched Master",
                beforeImage: p.coverImage,
                afterImage: p.coverImage,
                beforeDescription: "Flat log-profile capture prior to color grading.",
                afterDescription: "Polished luxury visual with calibrated specular highlights.",
              },
            };
          } else {
            newSec = {
              id: `sec-${Date.now()}`,
              title: "New Architectural Section",
              kicker: "System Foundations",
              description: "Detailed description of this section's rationale and design execution.",
              type: "gallery",
              spacing: "normal",
              fontSize: "3xl",
              items: [
                {
                  caption: "First Visual Component",
                  subcaption: "Technical explanation or design rationale.",
                  image: p.coverImage,
                  aspect: "4/3",
                },
              ],
            };
          }
          const updated = [...(p.sections || []), newSec];
          setSelectedSectionIdx(updated.length - 1);
          return { ...p, sections: updated };
        }
        return p;
      })
    );
    setShowTemplateModal(false);
  };

  const removeSection = (slug: string, secIdx: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = (p.sections || []).filter((_, i) => i !== secIdx);
          return { ...p, sections };
        }
        return p;
      })
    );
    setSelectedSectionIdx(null);
  };

  const updateSectionItem = (
    slug: string,
    secIdx: number,
    itemIdx: number,
    field: "caption" | "subcaption" | "image" | "aspect",
    val: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          if (sections[secIdx]) {
            const items = [...(sections[secIdx].items || [])];
            if (items[itemIdx]) {
              items[itemIdx] = { ...items[itemIdx], [field]: val };
              sections[secIdx] = { ...sections[secIdx], items };
            }
          }
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const addSectionItem = (slug: string, secIdx: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          if (sections[secIdx]) {
            const items = [
              ...(sections[secIdx].items || []),
              {
                caption: "New Visual Component Card",
                subcaption: "Descriptive rationale and specification.",
                aspect: "4/3",
              },
            ];
            sections[secIdx] = { ...sections[secIdx], items };
          }
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const removeSectionItem = (slug: string, secIdx: number, itemIdx: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const sections = [...(p.sections || [])];
          if (sections[secIdx]) {
            const items = (sections[secIdx].items || []).filter((_, i) => i !== itemIdx);
            sections[secIdx] = { ...sections[secIdx], items };
          }
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const addNewProject = () => {
    const newSlug = `new-case-study-${Date.now().toString().slice(-4)}`;
    const newPillarNumber = String(projects.length + 1).padStart(2, "0");
    const newProject: ProjectItem = {
      id: `p-${Date.now()}`,
      slug: newSlug,
      title: "Untitled Case Study",
      pillarNumber: newPillarNumber,
      pillarTitle: "Brand & Packaging Direction",
      subtitle: "Strategic case study overview and manufacturing specifications",
      category: "Creative Direction & Brand Identity",
      year: "2026",
      role: "Creative Director & Lead Designer",
      client: "Private Client",
      status: "Production Ready",
      summary: "Executive case study summary outlining strategic context and results.",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85",
      tags: ["Brand Identity", "Packaging", "Art Direction"],
      deliverables: [
        "Full Zero-to-One Visual Identity",
        "Custom Wordmark & Monogram Seal",
        "Packaging Design System",
      ],
      specs: {
        "Primary Typography": "Bespoke High-Contrast Serif + Suisse Int'l Grotesk",
        "Color Palette": "Raw Obsidian (#141413), Warm Alabaster (#FAF9F5)",
      },
      overview: {
        challenge: "Describe the foundational challenge and brand dilemma.",
        strategicSolution: "Detail the strategic concept, aesthetic discipline, and solution executed.",
        outcome: "Highlight the market reception, shelf presence, or executive results.",
      },
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          title: "System Foundations & Visual Architecture",
          kicker: "System Foundations",
          description: "The identity is built upon an unyielding mathematical grid and custom type systems.",
          type: "gallery",
          spacing: "normal",
          fontSize: "3xl",
          items: [
            {
              caption: "Logotype Anatomy & Kerning Matrix",
              subcaption: "Drawn with bespoke ligature transitions echoing brand geometry.",
              aspect: "4/3",
            },
          ],
        },
      ],
    };

    setProjects([...projects, newProject]);
    setActiveTab(newSlug);
    setSelectedSectionIdx(0);
  };

  const deleteProject = (slug: string) => {
    const proj = projects.find((p) => p.slug === slug);
    if (!proj) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the case study "${proj.title}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    const remaining = projects.filter((p) => p.slug !== slug);
    setProjects(remaining);
    setActiveTab("work-overview");
  };

  if (isLoading || !site) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-xs font-mono text-[#8A8881]">
        Loading Studio CMS...
      </div>
    );
  }

  const selectedProject = projects.find((p) => p.slug === activeTab);
  const activeSection =
    selectedProject && selectedSectionIdx !== null && selectedProject.sections
      ? selectedProject.sections[selectedSectionIdx]
      : null;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col font-sans">
      {/* Top Admin Sticky Navbar with Mode Toggles */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E2DA] px-4 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-editorial text-xl text-[#141413] hover:opacity-80">
            Ayu Priyambodo
          </Link>
          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#EAE7DF] text-[#64625C] border border-[#DDD9CE]">
            Studio CMS &amp; Page Builder
          </span>
        </div>

        {/* Center Mode Controls: Visual Page Builder vs Form Editor */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EAE7DF] border border-[#DDD9CE]">
          <button
            onClick={() => setViewMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "visual"
                ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                : "text-[#5A5852] hover:text-[#141413]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visual Builder</span>
          </button>
          <button
            onClick={() => setViewMode("form")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "form"
                ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                : "text-[#5A5852] hover:text-[#141413]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Structured Editor</span>
          </button>
        </div>

        {/* Right Actions: Device Preview, Save & Logout */}
        <div className="flex items-center gap-3">
          {viewMode === "visual" && (
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#EAE7DF] border border-[#DDD9CE]">
              <button
                onClick={() => setDevicePreview("desktop")}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  devicePreview === "desktop"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#5A5852] hover:text-[#141413]"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevicePreview("mobile")}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  devicePreview === "mobile"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#5A5852] hover:text-[#141413]"
                }`}
                title="Mobile View (420px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {saveSuccess && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <Check className="w-4 h-4" />
              <span>{statusMessage || "Saved"}</span>
            </span>
          )}

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#D5D1C7] hover:bg-[#EAE7DF] transition-colors"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#141413] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2C2A26] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-[#8A8881] hover:text-[#141413] transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Pages & Blocks Navigator */}
        <aside className="lg:col-span-3 space-y-6">
          {/* PAGES TREE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#8A8881]" />
                <span>Pages (Halaman)</span>
              </span>
              <span className="text-[10px] opacity-70">
                {2 + projects.length} pages
              </span>
            </div>

            {/* Home Page */}
            <button
              onClick={() => {
                setActiveTab("home");
                setSelectedSectionIdx(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Layout className="w-4 h-4 shrink-0" />
                <span className="truncate">Home Page</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/</span>
            </button>

            {/* About Page */}
            <button
              onClick={() => {
                setActiveTab("about");
                setSelectedSectionIdx(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">About Page</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/about</span>
            </button>

            {/* Work Section Overview */}
            <button
              onClick={() => {
                setActiveTab("work-overview");
                setSelectedSectionIdx(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "work-overview"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span className="truncate">Work Section</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/#work</span>
            </button>

            {/* Case Studies Tree Branch */}
            <div className="pt-2 pl-3 space-y-1 border-l-2 border-[#E5E2DA] ml-3.5 my-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block px-2 pb-1">
                Case Studies ({projects.length})
              </span>

              {projects.map((p) => {
                const icons = {
                  nidhi: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
                  "packaging-production": <Box className="w-3.5 h-3.5 shrink-0" />,
                  "art-direction-campaign": <Film className="w-3.5 h-3.5 shrink-0" />,
                  "editorial-decks": <FileText className="w-3.5 h-3.5 shrink-0" />,
                };

                const isCurrent = activeTab === p.slug;

                return (
                  <button
                    key={p.slug}
                    onClick={() => {
                      setActiveTab(p.slug);
                      setSelectedSectionIdx(0);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#141413] text-[#FAF9F5] font-medium"
                        : "text-[#5A5852] hover:bg-[#F0EEE8]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {icons[p.slug as keyof typeof icons] || <FileBox className="w-3.5 h-3.5" />}
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="font-mono text-[10px] opacity-70 shrink-0 ml-1">
                      P{p.pillarNumber}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={addNewProject}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-mono text-[#8A8881] hover:text-[#141413] hover:bg-[#EAE7DF] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Case Study</span>
              </button>
            </div>
          </div>

          {/* ACTIVE PAGE SECTIONS OUTLINE (FOR VISUAL BUILDER) */}
          {selectedProject && (
            <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881]">
                  Section Blocks ({selectedProject.sections?.length || 0})
                </span>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Insert Block</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {(selectedProject.sections || []).map((sec, idx) => {
                  const isSelected = selectedSectionIdx === idx;
                  return (
                    <div
                      key={sec.id || idx}
                      onClick={() => setSelectedSectionIdx(idx)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#141413] text-[#FAF9F5] font-medium"
                          : "bg-[#FAF9F5] text-[#4A4843] hover:bg-[#EAE7DF]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] opacity-60">0{idx + 1}</span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase opacity-70 px-1.5 py-0.5 rounded bg-black/10">
                        {sec.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SITE SETTINGS GROUP */}
          <div className="space-y-1.5 pt-4 border-t border-[#E5E2DA]">
            <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
              <Sliders className="w-3 h-3 text-[#8A8881]" />
              <span>Site Configuration</span>
            </div>

            <button
              onClick={() => {
                setActiveTab("navigation");
                setSelectedSectionIdx(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "navigation"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 shrink-0" />
                <span>Navbar &amp; Page Tabs</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">
                {(site.navLinks || []).length} items
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("site");
                setSelectedSectionIdx(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "site"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 shrink-0" />
                <span>Profile &amp; Inquiries</span>
              </div>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: INTERACTIVE VISUAL CANVAS OR FORM EDITOR */}
        {/* ========================================================= */}
        <main
          className={`${
            viewMode === "visual" && selectedProject
              ? "lg:col-span-6"
              : "lg:col-span-9"
          } space-y-8`}
        >
          {/* VISUAL BUILDER CANVAS (WEBFLOW-STYLE) */}
          {viewMode === "visual" && selectedProject ? (
            <div
              className={`mx-auto transition-all ${
                devicePreview === "mobile"
                  ? "max-w-[420px] border-4 border-[#141413] rounded-3xl overflow-hidden shadow-2xl"
                  : "w-full"
              }`}
            >
              <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-2xl p-6 sm:p-8 space-y-12 min-h-[700px] shadow-xs">
                {/* Visual Header / Breadcrumb */}
                <div className="border-b border-[#E5E2DA] pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
                    <span className="px-2 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">
                      Route: /work/{selectedProject.slug}
                    </span>
                    <span>·</span>
                    <span>PILLAR {selectedProject.pillarNumber}</span>
                  </div>
                  <h1 className="font-editorial text-4xl sm:text-5xl text-[#141413]">
                    {selectedProject.title}
                  </h1>
                  <p className="font-serif italic text-lg text-[#5A5852]">
                    {selectedProject.subtitle}
                  </p>
                </div>

                {/* Cover Image or Video Showcase */}
                {selectedProject.videoData?.url ? (
                  <div className="p-4 rounded-xl bg-[#141413] text-[#FAF9F5] space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase">
                      Commercial Motion Result
                    </span>
                    <p className="text-xs font-mono">{selectedProject.videoData.url}</p>
                  </div>
                ) : (
                  <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-[#E5E2DA]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedProject.coverImage}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* MODULAR SECTION BLOCKS CANVAS */}
                <div className="space-y-8">
                  {(selectedProject.sections || []).map((sec, idx) => {
                    const isSelected = selectedSectionIdx === idx;
                    const hasBgImage = sec.background?.type === "image" && sec.background.imageUrl;
                    const hasBgColor = sec.background?.type === "color" && sec.background.color;

                    return (
                      <div
                        key={sec.id || idx}
                        onClick={() => setSelectedSectionIdx(idx)}
                        className={`group relative rounded-2xl p-6 transition-all cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-[#141413] shadow-lg bg-white"
                            : "hover:ring-1 hover:ring-[#8A8881] bg-[#FAF9F5] border border-[#E5E2DA]"
                        }`}
                        style={{
                          backgroundColor: hasBgColor ? sec.background?.color : undefined,
                        }}
                      >
                        {/* Floating Quick Action Pill */}
                        <div
                          className={`absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 rounded-full bg-[#141413] text-[#FAF9F5] text-xs shadow-md ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          } transition-opacity`}
                        >
                          <span className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300">
                            {sec.type}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(selectedProject.slug, idx, "up");
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:bg-white/20 rounded-full disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(selectedProject.slug, idx, "down");
                            }}
                            disabled={idx === (selectedProject.sections || []).length - 1}
                            className="p-1 hover:bg-white/20 rounded-full disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSection(selectedProject.slug, idx);
                            }}
                            className="p-1 hover:bg-white/20 rounded-full cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSection(selectedProject.slug, idx);
                            }}
                            className="p-1 hover:bg-rose-600 rounded-full cursor-pointer text-rose-300 hover:text-white"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Background Image Overlay Preview */}
                        {hasBgImage && (
                          <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sec.background!.imageUrl!}
                              alt="Background"
                              className="w-full h-full object-cover"
                            />
                            <div
                              className="absolute inset-0 bg-[#141413]"
                              style={{
                                opacity: sec.background?.overlayOpacity ?? 0.5,
                              }}
                            />
                          </div>
                        )}

                        <div className={`relative z-10 space-y-4 ${hasBgImage ? "text-[#FAF9F5]" : ""}`}>
                          {sec.kicker && (
                            <span
                              className={`text-[10px] font-mono uppercase tracking-widest ${
                                hasBgImage ? "text-amber-300" : "text-[#8A8881]"
                              }`}
                            >
                              {sec.kicker}
                            </span>
                          )}
                          <h3
                            className={`font-editorial ${
                              sec.fontSize === "7xl"
                                ? "text-4xl sm:text-5xl"
                                : sec.fontSize === "5xl"
                                ? "text-3xl sm:text-4xl"
                                : "text-2xl sm:text-3xl"
                            } ${hasBgImage ? "text-[#FAF9F5]" : "text-[#141413]"}`}
                          >
                            {sec.title}
                          </h3>
                          <p
                            className={`text-xs leading-relaxed ${
                              hasBgImage ? "text-[#EAE7DF]" : "text-[#5A5852]"
                            }`}
                          >
                            {sec.description}
                          </p>

                          {/* RENDER COMPONENT: CAROUSEL SLIDER */}
                          {sec.type === "carousel" && sec.items && (
                            <div className="pt-2">
                              <CarouselSlider
                                items={sec.items}
                                fallbackImage={selectedProject.coverImage}
                                settings={sec.carouselSettings}
                              />
                            </div>
                          )}

                          {/* RENDER COMPONENT: COMPARISON SLIDER */}
                          {sec.type === "comparison" && sec.comparisonData && (
                            <div className="pt-2">
                              <ComparisonSlider
                                beforeLabel={sec.comparisonData.beforeLabel}
                                afterLabel={sec.comparisonData.afterLabel}
                                beforeImage={sec.comparisonData.beforeImage}
                                afterImage={sec.comparisonData.afterImage}
                                beforeDescription={sec.comparisonData.beforeDescription}
                                afterDescription={sec.comparisonData.afterDescription}
                              />
                            </div>
                          )}

                          {/* RENDER COMPONENT: 2-COL GALLERY */}
                          {(sec.type === "gallery" || sec.type === "editorial") && sec.items && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              {sec.items.map((item, itemIdx) => (
                                <div
                                  key={itemIdx}
                                  className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2 shadow-2xs"
                                >
                                  <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-[#F2EFE9]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={item.image || selectedProject.coverImage}
                                      alt={item.caption}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <h4 className="font-editorial text-sm font-bold text-[#141413]">
                                    {item.caption}
                                  </h4>
                                  {item.subcaption && (
                                    <p className="text-[11px] text-[#5A5852] line-clamp-2">
                                      {item.subcaption}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Insert Section Button */}
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2C2A26] transition-all cursor-pointer shadow-sm hover:scale-102"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Insert New Section Block</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STRUCTURED FORM EDITOR (EXISTING FALLBACK) */
            <div className="bg-[#F4F2EC] border border-[#E5E2DA] rounded-2xl p-6 sm:p-10 space-y-10">
              {activeTab === "home" && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-3xl text-[#141413]">Home Page Editor</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={site.hero?.headlinePrefix || ""}
                      onChange={(e) => updateSiteHero("headlinePrefix", e.target.value)}
                      placeholder="Headline Prefix"
                      className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm"
                    />
                    <input
                      type="text"
                      value={site.hero?.headlineItalic || ""}
                      onChange={(e) => updateSiteHero("headlineItalic", e.target.value)}
                      placeholder="Headline Italic"
                      className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-serif italic"
                    />
                    <textarea
                      rows={4}
                      value={site.hero?.subheadline || ""}
                      onChange={(e) => updateSiteHero("subheadline", e.target.value)}
                      placeholder="Subheadline"
                      className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm"
                    />
                  </div>
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-3xl text-[#141413]">About Page Editor</h2>
                  <input
                    type="text"
                    value={site.about?.headline || ""}
                    onChange={(e) => updateSiteAbout("headline", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm"
                  />
                  <textarea
                    rows={3}
                    value={site.about?.subheading || ""}
                    onChange={(e) => updateSiteAbout("subheading", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm"
                  />
                </div>
              )}

              {selectedProject && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-3xl text-[#141413]">{selectedProject.title}</h2>
                  <p className="text-xs text-[#5A5852]">
                    Switch to &ldquo;Visual Builder&rdquo; in the top bar for live Webflow-style editing.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CONTEXTUAL INSPECTOR PANEL (WEBFLOW-STYLE) */}
        {/* ========================================================= */}
        {viewMode === "visual" && selectedProject && (
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-2xl p-5 space-y-6 sticky top-24 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[#141413]" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Section Inspector
                  </span>
                </div>
                {activeSection && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#141413] text-[#FAF9F5]">
                    {activeSection.type}
                  </span>
                )}
              </div>

              {activeSection && selectedSectionIdx !== null ? (
                <div className="space-y-6">
                  {/* 1. LAYOUT / VARIANT SWITCHER */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Component Layout Variant
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#EAE7DF]">
                      <button
                        onClick={() =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "type", "gallery")
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          activeSection.type === "gallery"
                            ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                            : "text-[#5A5852] hover:text-[#141413]"
                        }`}
                      >
                        2-Col Grid
                      </button>
                      <button
                        onClick={() =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "type", "carousel")
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          activeSection.type === "carousel"
                            ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                            : "text-[#5A5852] hover:text-[#141413]"
                        }`}
                      >
                        Carousel Slider
                      </button>
                    </div>
                  </div>

                  {/* 2. TYPOGRAPHY SIZE PRESETS */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Headline Font Size Scale
                    </label>
                    <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {[
                        { label: "7XL", val: "7xl" },
                        { label: "5XL", val: "5xl" },
                        { label: "3XL", val: "3xl" },
                        { label: "XL", val: "xl" },
                      ].map((size) => (
                        <button
                          key={size.val}
                          onClick={() =>
                            updateSectionField(
                              selectedProject.slug,
                              selectedSectionIdx,
                              "fontSize",
                              size.val
                            )
                          }
                          className={`py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                            (activeSection.fontSize || "3xl") === size.val
                              ? "bg-[#141413] text-[#FAF9F5] font-bold"
                              : "text-[#5A5852] hover:text-[#141413]"
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. SECTION PADDING / SPACING */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Section Padding / Spacing
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {[
                        { label: "Compact", val: "compact" },
                        { label: "Normal", val: "normal" },
                        { label: "Generous", val: "generous" },
                      ].map((space) => (
                        <button
                          key={space.val}
                          onClick={() =>
                            updateSectionField(
                              selectedProject.slug,
                              selectedSectionIdx,
                              "spacing",
                              space.val
                            )
                          }
                          className={`py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            (activeSection.spacing || "normal") === space.val
                              ? "bg-[#141413] text-[#FAF9F5]"
                              : "text-[#5A5852] hover:text-[#141413]"
                          }`}
                        >
                          {space.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. BACKGROUND STYLING (COLOR VS IMAGE) */}
                  <div className="space-y-3 pt-2 border-t border-[#E5E2DA]">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Background Styling
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#EAE7DF]">
                      <button
                        onClick={() =>
                          updateSectionBackground(selectedProject.slug, selectedSectionIdx, "type", "color")
                        }
                        className={`py-1 text-xs font-medium rounded-lg cursor-pointer ${
                          activeSection.background?.type !== "image"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Solid Color
                      </button>
                      <button
                        onClick={() =>
                          updateSectionBackground(selectedProject.slug, selectedSectionIdx, "type", "image")
                        }
                        className={`py-1 text-xs font-medium rounded-lg cursor-pointer ${
                          activeSection.background?.type === "image"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Image &amp; Overlay
                      </button>
                    </div>

                    {activeSection.background?.type === "image" ? (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={activeSection.background?.imageUrl || ""}
                          onChange={(e) =>
                            updateSectionBackground(
                              selectedProject.slug,
                              selectedSectionIdx,
                              "imageUrl",
                              e.target.value
                            )
                          }
                          placeholder="Image URL (e.g. https://...)"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                        />
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#8A8881]">
                            <span>Dark Overlay Opacity</span>
                            <span>{Math.round((activeSection.background?.overlayOpacity ?? 0.5) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={activeSection.background?.overlayOpacity ?? 0.5}
                            onChange={(e) =>
                              updateSectionBackground(
                                selectedProject.slug,
                                selectedSectionIdx,
                                "overlayOpacity",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full accent-[#141413] cursor-pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-1">
                        {[
                          { name: "Alabaster", hex: "#FAF9F5" },
                          { name: "Stone", hex: "#F4F2EC" },
                          { name: "Obsidian", hex: "#141413" },
                        ].map((swatch) => (
                          <button
                            key={swatch.hex}
                            onClick={() =>
                              updateSectionBackground(
                                selectedProject.slug,
                                selectedSectionIdx,
                                "color",
                                swatch.hex
                              )
                            }
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                              (activeSection.background?.color || "#FAF9F5") === swatch.hex
                                ? "ring-2 ring-black font-bold"
                                : "border-[#DDD9CE]"
                            }`}
                            style={{
                              backgroundColor: swatch.hex,
                              color: swatch.hex === "#141413" ? "#FAF9F5" : "#141413",
                            }}
                          >
                            {swatch.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. CAROUSEL SETTINGS (IF ACTIVE) */}
                  {activeSection.type === "carousel" && (
                    <div className="space-y-3 pt-2 border-t border-[#E5E2DA]">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Carousel Controls
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center justify-between text-xs text-[#141413] cursor-pointer">
                          <span>Autoplay Carousel</span>
                          <input
                            type="checkbox"
                            checked={activeSection.carouselSettings?.autoplay ?? false}
                            onChange={(e) =>
                              updateSectionCarouselSettings(
                                selectedProject.slug,
                                selectedSectionIdx,
                                "autoplay",
                                e.target.checked
                              )
                            }
                            className="accent-[#141413] cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between text-xs text-[#141413] cursor-pointer">
                          <span>Show Navigation Arrows</span>
                          <input
                            type="checkbox"
                            checked={activeSection.carouselSettings?.showArrows ?? true}
                            onChange={(e) =>
                              updateSectionCarouselSettings(
                                selectedProject.slug,
                                selectedSectionIdx,
                                "showArrows",
                                e.target.checked
                              )
                            }
                            className="accent-[#141413] cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between text-xs text-[#141413] cursor-pointer">
                          <span>Show Indicator Dots</span>
                          <input
                            type="checkbox"
                            checked={activeSection.carouselSettings?.showDots ?? true}
                            onChange={(e) =>
                              updateSectionCarouselSettings(
                                selectedProject.slug,
                                selectedSectionIdx,
                                "showDots",
                                e.target.checked
                              )
                            }
                            className="accent-[#141413] cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 6. DIRECT CONTENT EDITING */}
                  <div className="space-y-3 pt-2 border-t border-[#E5E2DA]">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Content Copywriting
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={activeSection.kicker || ""}
                        onChange={(e) =>
                          updateSectionField(
                            selectedProject.slug,
                            selectedSectionIdx,
                            "kicker",
                            e.target.value
                          )
                        }
                        placeholder="Kicker Badge"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono uppercase"
                      />
                      <input
                        type="text"
                        value={activeSection.title}
                        onChange={(e) =>
                          updateSectionField(
                            selectedProject.slug,
                            selectedSectionIdx,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Section Title"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-editorial font-bold"
                      />
                      <textarea
                        rows={3}
                        value={activeSection.description}
                        onChange={(e) =>
                          updateSectionField(
                            selectedProject.slug,
                            selectedSectionIdx,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Section Narrative Description"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 7. SLIDES / CARDS MANAGER */}
                  <div className="space-y-3 pt-2 border-t border-[#E5E2DA]">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881]">
                        Visual Slides ({(activeSection.items || []).length})
                      </label>
                      <button
                        onClick={() => addSectionItem(selectedProject.slug, selectedSectionIdx)}
                        className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                      >
                        + Add Slide
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {(activeSection.items || []).map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] space-y-1.5 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] text-[#8A8881]">Slide 0{itemIdx + 1}</span>
                            <button
                              onClick={() =>
                                removeSectionItem(selectedProject.slug, selectedSectionIdx, itemIdx)
                              }
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) =>
                              updateSectionItem(
                                selectedProject.slug,
                                selectedSectionIdx,
                                itemIdx,
                                "caption",
                                e.target.value
                              )
                            }
                            placeholder="Slide Title"
                            className="w-full text-xs font-bold bg-transparent outline-none border-b border-transparent focus:border-[#141413]"
                          />
                          <input
                            type="text"
                            value={item.subcaption || ""}
                            onChange={(e) =>
                              updateSectionItem(
                                selectedProject.slug,
                                selectedSectionIdx,
                                itemIdx,
                                "subcaption",
                                e.target.value
                              )
                            }
                            placeholder="Description"
                            className="w-full text-[11px] text-[#5A5852] bg-transparent outline-none border-b border-transparent focus:border-[#141413]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-[#8A8881] space-y-2">
                  <Eye className="w-5 h-5 mx-auto opacity-50" />
                  <p>Click any section block in the center canvas to inspect and edit its style.</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* INSERT SECTION BLOCK MODAL */}
      {showTemplateModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-4">
              <div>
                <h3 className="font-editorial text-2xl text-[#141413]">Insert Section Block</h3>
                <p className="text-xs text-[#64625C] pt-0.5">
                  Select an architectural template to add to &ldquo;{selectedProject.title}&rdquo;.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-full hover:bg-[#EAE7DF] text-[#8A8881]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "carousel",
                  title: "Carousel Slider",
                  desc: "Swipeable horizontal slides with dot navigation & autoplay",
                  icon: <ImageIcon className="w-5 h-5 text-amber-700" />,
                },
                {
                  id: "gallery",
                  title: "2-Column Gallery Grid",
                  desc: "Classic side-by-side packaging & visual components",
                  icon: <Layout className="w-5 h-5 text-blue-700" />,
                },
                {
                  id: "comparison",
                  title: "Comparison Slider",
                  desc: "Interactive before/after curtain slider for retouching",
                  icon: <Sliders className="w-5 h-5 text-emerald-700" />,
                },
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => addSectionWithTemplate(selectedProject.slug, template.id)}
                  className="p-4 rounded-2xl bg-white border border-[#DDD9CE] hover:border-[#141413] hover:shadow-md text-left space-y-2 transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded-xl bg-[#F4F2EC] w-fit group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  <h4 className="font-editorial text-base text-[#141413] font-bold">
                    {template.title}
                  </h4>
                  <p className="text-[11px] text-[#64625C] leading-snug">{template.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
