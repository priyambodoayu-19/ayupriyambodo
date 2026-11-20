"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Box,
  Film,
  FileText,
  CheckCircle2,
  ArrowDown,
  ArrowUpRight,
  ArrowUp,
  Layers,
  Settings2,
  Plus,
  Trash2,
  Copy,
  Save,
  LogOut,
  Layout,
  User,
  Briefcase,
  FileBox,
  Check,
  X,
  Menu,
  ExternalLink,
  ChevronRight,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";
import {
  SiteMetadata,
  ProjectItem,
  ProjectSection,
  DEFAULT_SITE_METADATA,
  DEFAULT_PROJECTS,
  ToolchainItem,
} from "@/data/projects";

export default function AdminPage() {
  const [site, setSite] = useState<SiteMetadata | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("home");

  // Template modal for adding new sections
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  // Status & Auth
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch("/api/admin/auth");
        if (!authRes.ok) {
          window.location.href = "/admin/login";
          return;
        }

        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const data = await res.json();
          setSite(data.site || DEFAULT_SITE_METADATA);
          setProjects(data.projects || DEFAULT_PROJECTS);
        } else {
          setSite(DEFAULT_SITE_METADATA);
          setProjects(DEFAULT_PROJECTS);
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        setSite(DEFAULT_SITE_METADATA);
        setProjects(DEFAULT_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!site) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setStatusMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site, projects }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setStatusMessage("All changes saved & synced live!");
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        const data = await res.json();
        alert(`Error saving: ${data.message || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  // ==========================================
  // HOME / SITE HELPERS
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
          subheadline: "I partner with ambitious brand founders...",
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
          ...(site.hero?.background || { type: "color", color: "#FAF9F5", overlayOpacity: 0.5 }),
          [field]: value,
        },
      },
    });
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

  const updateCapabilityCategory = (index: number, newCategory: string) => {
    if (!site) return;
    const capabilities = [...(site.capabilities || [])];
    if (capabilities[index]) {
      capabilities[index] = { ...capabilities[index], category: newCategory };
      setSite({ ...site, capabilities });
    }
  };

  const updateCapabilitySkill = (catIdx: number, skillIdx: number, val: string) => {
    if (!site) return;
    const capabilities = [...(site.capabilities || [])];
    if (capabilities[catIdx]) {
      const skills = [...capabilities[catIdx].skills];
      skills[skillIdx] = val;
      capabilities[catIdx] = { ...capabilities[catIdx], skills };
      setSite({ ...site, capabilities });
    }
  };

  const addCapabilitySkill = (catIdx: number) => {
    if (!site) return;
    const capabilities = [...(site.capabilities || [])];
    if (capabilities[catIdx]) {
      capabilities[catIdx] = {
        ...capabilities[catIdx],
        skills: [...capabilities[catIdx].skills, "New Technical Skill / Deliverable"],
      };
      setSite({ ...site, capabilities });
    }
  };

  const removeCapabilitySkill = (catIdx: number, skillIdx: number) => {
    if (!site) return;
    const capabilities = [...(site.capabilities || [])];
    if (capabilities[catIdx]) {
      capabilities[catIdx] = {
        ...capabilities[catIdx],
        skills: capabilities[catIdx].skills.filter((_, i) => i !== skillIdx),
      };
      setSite({ ...site, capabilities });
    }
  };

  // ==========================================
  // ABOUT PAGE HELPERS
  // ==========================================
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
      { name: "New Software / Platform", role: "Specialization and technical output" },
    ];
    updateSiteAbout("toolchain", updated);
  };

  const removeAboutTool = (index: number) => {
    if (!site?.about) return;
    const updated = (site.about.toolchain || []).filter((_, i) => i !== index);
    updateSiteAbout("toolchain", updated);
  };

  // ==========================================
  // NAVIGATION HELPERS
  // ==========================================
  const addNavLink = (label: string = "New Page", href: string = "/#") => {
    if (!site) return;
    const currentLinks = site.navLinks || [];
    const newLink = { id: `nav-${Date.now()}`, label, href };
    setSite({ ...site, navLinks: [...currentLinks, newLink] });
  };

  const removeNavLink = (id: string) => {
    if (!site) return;
    const currentLinks = site.navLinks || [];
    setSite({ ...site, navLinks: currentLinks.filter((item) => item.id !== id) });
  };

  const updateNavLink = (id: string, field: "label" | "href", value: string) => {
    if (!site) return;
    const currentLinks = site.navLinks || [];
    setSite({
      ...site,
      navLinks: currentLinks.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  // ==========================================
  // CASE STUDY HELPERS
  // ==========================================
  const selectedProject = projects.find((p) => p.slug === activeTab);

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

  // Metrics
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
          const metrics = [...(p.metrics || []), { label: "Design System Metric", value: "Metric Value" }];
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

  // Deliverables
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
          const deliverables = [...(p.deliverables || []), "New Delivered Output"];
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

  // Specs
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
          const newKey = `SPECIFICATION_${Date.now().toString().slice(-4)}`;
          return {
            ...p,
            specs: { ...(p.specs || {}), [newKey]: "Specification details" },
          };
        }
        return p;
      })
    );
  };

  const removeProjectSpec = (slug: string, keyToRemove: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug === slug && p.specs) {
          const newSpecs: Record<string, string> = {};
          for (const [k, v] of Object.entries(p.specs)) {
            if (k !== keyToRemove) {
              newSpecs[k] = v;
            }
          }
          return { ...p, specs: newSpecs };
        }
        return p;
      })
    );
  };

  // Modular Bespoke Sections
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
            const currentBg = sections[secIdx].background || { type: "color", color: "#FAF9F5", overlayOpacity: 0.5 };
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
          return { ...p, sections };
        }
        return p;
      })
    );
  };

  const removeSection = (slug: string, secIdx: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.slug === slug) {
            const sections = (p.sections || []).filter((_, i) => i !== secIdx);
            return { ...p, sections };
          }
          return p;
        })
      );
    }
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
          return { ...p, sections: updated };
        }
        return p;
      })
    );
    setShowTemplateModal(false);
  };

  const addNewProject = () => {
    const newSlug = `new-case-study-${Date.now().toString().slice(-4)}`;
    const newPillarNumber = String(projects.length + 1).padStart(2, "0");
    const newProject: ProjectItem = {
      id: `p-${Date.now()}`,
      slug: newSlug,
      title: "Untitled Case Study",
      pillarNumber: newPillarNumber,
      pillarTitle: "Brand System & Architecture",
      subtitle: "Zero-to-one identity design, packaging architecture, and editorial systems.",
      category: "Brand Identity",
      year: "2026",
      role: "Lead Brand Identity Designer",
      client: "Confidential Client",
      status: "In Development",
      summary: "Executive case study summary outlining strategic rationale and tactile deliverables.",
      coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=85",
      tags: ["Brand Identity", "Packaging", "Art Direction"],
      metrics: [
        { label: "Design System Tokens", value: "240+" },
        { label: "Bespoke Packaging SKUs", value: "05" },
      ],
      overview: {
        challenge: "Establish an unyielding, high-contrast visual world in a saturated category.",
        strategicSolution: "Synthesized tactile packaging substrates with mathematical typography grids.",
        outcome: "Immediate wholesale adoption across premier international retailers.",
      },
      deliverables: [
        "Full Zero-to-One Visual Identity System",
        "Primary & Secondary Packaging Dielines",
        "Editorial Brand Guidelines Manual",
      ],
      specs: {
        PRIMARY_TYPOGRAPHY: "Bespoke Editorial Serif + Swiss Neo-Grotesk",
        COLOR_SYSTEM: "Raw Obsidian (#141413), Alabaster (#FAF9F5)",
      },
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          title: "System Foundations & Typography Matrix",
          kicker: "Architecture",
          description: "Constructed upon an uncompromising mathematical grid.",
          type: "gallery",
          spacing: "normal",
          fontSize: "3xl",
          items: [
            {
              caption: "Logotype Anatomy & Kerning Matrix",
              subcaption: "Drawn with bespoke ligature transitions.",
              aspect: "16/9",
            },
          ],
        },
      ],
    };

    setProjects([...projects, newProject]);
    setActiveTab(newSlug);
  };

  const deleteProject = (slug: string) => {
    if (confirm("Are you sure you want to delete this case study page?")) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      setActiveTab("home");
    }
  };

  if (isLoading || !site) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#141413] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-editorial text-lg text-[#141413]">Loading Content Studio...</p>
        </div>
      </div>
    );
  }

  // Live URL determination
  const liveUrl =
    activeTab === "home"
      ? "/"
      : activeTab === "about"
      ? "/about"
      : selectedProject
      ? `/work/${selectedProject.slug}`
      : "/";

  return (
    <div className="min-h-screen bg-[#F0EEE8] text-[#141413] flex flex-col font-sans">
      {/* ========================================================= */}
      {/* TOP STUDIO TOOLBAR                                        */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5] border-b border-[#E5E2DA] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-[#141413]" />
            <span className="font-editorial text-base tracking-tight text-[#141413] font-semibold group-hover:underline">
              Ayu Priyambodo
            </span>
          </Link>
          <span className="text-[#8A8881] text-xs font-mono">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#EAE7DF] text-[#64625C] text-[11px] font-mono font-medium">
            CMS Page &amp; Content Editor
          </span>
        </div>

        {/* Right Actions: View Actual Live Page, Save & Logout */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <Check className="w-4 h-4" />
              <span>{statusMessage || "Saved"}</span>
            </span>
          )}

          <Link
            href={liveUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#D5D1C7] bg-[#FAF9F5] hover:bg-[#EAE7DF] transition-colors"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
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

      {/* ========================================================= */}
      {/* 2-COLUMN CMS WORKSPACE                                    */}
      {/* ========================================================= */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========================================================= */}
        {/* LEFT COLUMN: PAGE NAVIGATION TREE                         */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3 shadow-xs sticky top-24">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#141413]" />
                <span className="font-bold text-[#141413]">Pages</span>
              </span>
              <span className="text-[10px] opacity-70">{2 + projects.length} pages</span>
            </div>

            {/* Home Page */}
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs font-semibold"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Layout className="w-4 h-4 shrink-0" />
                <span className="truncate">Home Page</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/</span>
            </button>

            {/* About Page */}
            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs font-semibold"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">About Page</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/about</span>
            </button>

            {/* Case Studies Tree Branch */}
            <div className="pt-2 pl-2 space-y-1 border-l-2 border-[#E5E2DA] ml-2.5 my-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block px-2 pb-1 font-semibold">
                Case Studies ({projects.length})
              </span>

              {projects.map((p) => {
                const isCurrent = activeTab === p.slug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => setActiveTab(p.slug)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#141413] text-[#FAF9F5] font-semibold shadow-2xs"
                        : "text-[#5A5852] hover:bg-[#F0EEE8]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
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
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-mono text-[#8A8881] hover:text-[#141413] hover:bg-[#EAE7DF] transition-colors cursor-pointer pt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Case Study</span>
              </button>
            </div>

            {/* Global Settings */}
            <div className="pt-3 border-t border-[#E5E2DA] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block px-1 font-semibold">
                Global Settings
              </span>
              <button
                onClick={() => setActiveTab("navigation")}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                  activeTab === "navigation" ? "bg-[#141413] text-[#FAF9F5] font-medium" : "text-[#5A5852] hover:bg-[#F0EEE8]"
                }`}
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Header Navigation Menu</span>
              </button>
              <button
                onClick={() => setActiveTab("site")}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                  activeTab === "site" ? "bg-[#141413] text-[#FAF9F5] font-medium" : "text-[#5A5852] hover:bg-[#F0EEE8]"
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Author Profile &amp; Contact</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: MAIN STRUCTURED EDITORIAL FORM              */}
        {/* ========================================================= */}
        <main className="lg:col-span-9 space-y-8">
          {/* HEADER BANNER FOR CURRENT PAGE */}
          <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881] mb-1">
                <span className="px-2.5 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">
                  Route: {liveUrl}
                </span>
                <span>·</span>
                <span className="uppercase">
                  {activeTab === "home"
                    ? "Primary Landing Page"
                    : activeTab === "about"
                    ? "Profile & Perspective"
                    : selectedProject
                    ? `Pillar ${selectedProject.pillarNumber} Case Study`
                    : "Global Settings"}
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
                {activeTab === "home"
                  ? "Home Page Content"
                  : activeTab === "about"
                  ? "About & Biography"
                  : selectedProject
                  ? selectedProject.title
                  : activeTab === "navigation"
                  ? "Navigation Menu"
                  : "Author Profile"}
              </h1>
            </div>

            <Link
              href={liveUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D5D1C7] text-xs font-medium hover:bg-[#EAE7DF] transition-colors self-start sm:self-auto"
            >
              <span>Preview Actual Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ========================================================= */}
          {/* 1. HOME PAGE EDITOR                                       */}
          {/* ========================================================= */}
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* SECTION 1: HERO BANNER */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                      Section 01
                    </span>
                    <h2 className="font-editorial text-2xl text-[#141413]">Hero Banner &amp; Typography</h2>
                  </div>
                </div>

                {/* Typography Scale & Spacing Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Headline Font Scale
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {["7xl", "5xl", "3xl"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateSiteHero("fontSize", s)}
                          className={`py-1.5 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${
                            (site.hero?.fontSize || "7xl") === s
                              ? "bg-[#141413] text-[#FAF9F5] font-bold shadow-xs"
                              : "text-[#5A5852] hover:text-[#141413]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Vertical Spacing Rhythm
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {["compact", "normal", "generous"].map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => updateSiteHero("spacing", sp)}
                          className={`py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                            (site.hero?.spacing || "normal") === sp
                              ? "bg-[#141413] text-[#FAF9F5] font-bold shadow-xs"
                              : "text-[#5A5852] hover:text-[#141413]"
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background Styling */}
                <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-[#141413]">
                      Hero Background Styling
                    </span>
                    <div className="flex gap-1 p-1 rounded-lg bg-[#EAE7DF]">
                      <button
                        type="button"
                        onClick={() => updateSiteHeroBackground("type", "color")}
                        className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                          (site.hero?.background?.type || "color") === "color"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Solid Color
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSiteHeroBackground("type", "image")}
                        className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                          site.hero?.background?.type === "image"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Background Photo
                      </button>
                    </div>
                  </div>

                  {site.hero?.background?.type === "image" ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[#8A8881]">Background Image URL</label>
                        <input
                          type="text"
                          value={site.hero?.background?.imageUrl || ""}
                          onChange={(e) => updateSiteHeroBackground("imageUrl", e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-[#8A8881]">
                          <span>Dark Overlay Opacity (for typography contrast)</span>
                          <span>{Math.round((site.hero?.background?.overlayOpacity ?? 0.5) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.9"
                          step="0.05"
                          value={site.hero?.background?.overlayOpacity ?? 0.5}
                          onChange={(e) =>
                            updateSiteHeroBackground("overlayOpacity", parseFloat(e.target.value))
                          }
                          className="w-full accent-[#141413]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#5A5852]">Presets:</span>
                      {["#FAF9F5", "#F4F2EC", "#141413", "#EAE7DF"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateSiteHeroBackground("color", c)}
                          className="w-8 h-8 rounded-full border border-black/20 cursor-pointer shadow-2xs"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Hero Copywriting */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Top Badge / Tagline
                    </label>
                    <input
                      type="text"
                      value={site.hero?.badge || ""}
                      onChange={(e) => updateSiteHero("badge", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Headline Prefix
                      </label>
                      <input
                        type="text"
                        value={site.hero?.headlinePrefix || ""}
                        onChange={(e) => updateSiteHero("headlinePrefix", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Italic Accent (Newsreader Serif)
                      </label>
                      <input
                        type="text"
                        value={site.hero?.headlineItalic || ""}
                        onChange={(e) => updateSiteHero("headlineItalic", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm font-serif italic"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Headline Suffix
                      </label>
                      <input
                        type="text"
                        value={site.hero?.headlineSuffix || ""}
                        onChange={(e) => updateSiteHero("headlineSuffix", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Subheadline / Intro Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={site.hero?.subheadline || ""}
                      onChange={(e) => updateSiteHero("subheadline", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2 p-3 rounded-lg bg-[#F4F2EC]">
                      <span className="text-[10px] font-mono uppercase text-[#8A8881] block">
                        Primary CTA Button
                      </span>
                      <input
                        type="text"
                        value={site.hero?.primaryButtonText || ""}
                        onChange={(e) => updateSiteHero("primaryButtonText", e.target.value)}
                        placeholder="Button Text"
                        className="w-full px-3 py-2 rounded bg-white border border-[#DDD9CE] text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={site.hero?.primaryButtonLink || ""}
                        onChange={(e) => updateSiteHero("primaryButtonLink", e.target.value)}
                        placeholder="Link (e.g. #work)"
                        className="w-full px-3 py-2 rounded bg-white border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-2 p-3 rounded-lg bg-[#F4F2EC]">
                      <span className="text-[10px] font-mono uppercase text-[#8A8881] block">
                        Secondary CTA Button
                      </span>
                      <input
                        type="text"
                        value={site.hero?.secondaryButtonText || ""}
                        onChange={(e) => updateSiteHero("secondaryButtonText", e.target.value)}
                        placeholder="Button Text"
                        className="w-full px-3 py-2 rounded bg-white border border-[#DDD9CE] text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={site.hero?.secondaryButtonLink || ""}
                        onChange={(e) => updateSiteHero("secondaryButtonLink", e.target.value)}
                        placeholder="Link (e.g. /about)"
                        className="w-full px-3 py-2 rounded bg-white border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: WORK SECTION HEADER */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 02
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">Curated Work Section Header</h2>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Section Kicker</label>
                    <input
                      type="text"
                      value={site.workSection?.kicker || ""}
                      onChange={(e) => updateSiteWorkSection("kicker", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Section Title</label>
                    <input
                      type="text"
                      value={site.workSection?.title || ""}
                      onChange={(e) => updateSiteWorkSection("title", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD9CE] text-sm font-editorial text-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Description</label>
                    <textarea
                      rows={3}
                      value={site.workSection?.description || ""}
                      onChange={(e) => updateSiteWorkSection("description", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: END-TO-END CAPABILITIES */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 03
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">End-to-End Capabilities &amp; Fluency</h2>
                  <p className="text-xs text-[#64625C] mt-1">Manage the 4 capability categories and their checklists</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(site.capabilities || []).map((cat, catIdx) => (
                    <div key={catIdx} className="p-4 rounded-xl bg-white border border-[#E5E2DA] space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#141413]" />
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => updateCapabilityCategory(catIdx, e.target.value)}
                          className="font-mono text-xs uppercase font-bold text-[#141413] w-full border-b border-[#E5E2DA] pb-1 bg-transparent"
                        />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {cat.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => updateCapabilitySkill(catIdx, sIdx, e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded bg-[#FAF9F5] text-xs border border-[#DDD9CE]"
                            />
                            <button
                              type="button"
                              onClick={() => removeCapabilitySkill(catIdx, sIdx)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                              title="Delete skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addCapabilitySkill(catIdx)}
                          className="text-[11px] font-mono text-[#141413] hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Skill Item</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ABOUT PAGE EDITOR                                      */}
          {/* ========================================================= */}
          {activeTab === "about" && (
            <div className="space-y-8">
              {/* SECTION 1: PROFILE & BIO HERO */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 01
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">Profile &amp; Biography Hero</h2>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Badge</label>
                    <input
                      type="text"
                      value={site.about?.badge || ""}
                      onChange={(e) => updateSiteAbout("badge", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Main Headline</label>
                    <input
                      type="text"
                      value={site.about?.headline || ""}
                      onChange={(e) => updateSiteAbout("headline", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm font-editorial text-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Subheading (Italic)</label>
                    <textarea
                      rows={2}
                      value={site.about?.subheading || ""}
                      onChange={(e) => updateSiteAbout("subheading", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm font-serif italic"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Contact Button Text</label>
                      <input
                        type="text"
                        value={site.about?.contactButtonText || ""}
                        onChange={(e) => updateSiteAbout("contactButtonText", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Resume / CV Button Text</label>
                      <input
                        type="text"
                        value={site.about?.resumeButtonText || ""}
                        onChange={(e) => updateSiteAbout("resumeButtonText", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: EDITORIAL STORY PARAGRAPHS */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                      Section 02
                    </span>
                    <h2 className="font-editorial text-2xl text-[#141413]">Long-Form Story Narrative</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addAboutStoryParagraph}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(site.about?.storyParagraphs || []).map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8881]">
                        <span>Paragraph 0{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeAboutStoryParagraph(i)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={p}
                        onChange={(e) => updateAboutStoryParagraph(i, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: AVAILABILITY STATUS BOX */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 03
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">Availability Status Box</h2>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Box Title</label>
                    <input
                      type="text"
                      value={site.about?.statusBoxTitle || ""}
                      onChange={(e) => updateSiteAbout("statusBoxTitle", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Status Details</label>
                    <textarea
                      rows={3}
                      value={site.about?.statusBoxText || ""}
                      onChange={(e) => updateSiteAbout("statusBoxText", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: SOFTWARE & TOOLCHAIN FLUENCY */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                      Section 04
                    </span>
                    <h2 className="font-editorial text-2xl text-[#141413]">Software &amp; Toolchain Mastery</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addAboutTool}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tool</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(site.about?.toolchain || []).map((tool, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-[#E5E2DA] space-y-2 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateAboutTool(i, "name", e.target.value)}
                          placeholder="Tool Name (e.g. Figma)"
                          className="font-mono text-xs font-bold px-2 py-1 rounded bg-[#F4F2EC] border border-[#DDD9CE] w-2/3"
                        />
                        <button
                          type="button"
                          onClick={() => removeAboutTool(i)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={tool.role}
                        onChange={(e) => updateAboutTool(i, "role", e.target.value)}
                        placeholder="Mastery role description"
                        className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. CASE STUDY DETAILED SECTION EDITOR                     */}
          {/* ========================================================= */}
          {selectedProject && (
            <div className="space-y-8">
              {/* SECTION 1: IDENTITY & METADATA BAR */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                      Section 01
                    </span>
                    <h2 className="font-editorial text-2xl text-[#141413]">Project Identity &amp; Meta Bar</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteProject(selectedProject.slug)}
                    className="px-3 py-1 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-mono cursor-pointer"
                  >
                    Delete Case Study
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Pillar #</label>
                    <input
                      type="text"
                      value={selectedProject.pillarNumber}
                      onChange={(e) => updateProjectField(selectedProject.slug, "pillarNumber", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Pillar Title</label>
                    <input
                      type="text"
                      value={selectedProject.pillarTitle}
                      onChange={(e) => updateProjectField(selectedProject.slug, "pillarTitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Year</label>
                    <input
                      type="text"
                      value={selectedProject.year}
                      onChange={(e) => updateProjectField(selectedProject.slug, "year", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Case Study Title</label>
                    <input
                      type="text"
                      value={selectedProject.title}
                      onChange={(e) => updateProjectField(selectedProject.slug, "title", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-base font-editorial"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Editorial Subtitle</label>
                    <textarea
                      rows={2}
                      value={selectedProject.subtitle}
                      onChange={(e) => updateProjectField(selectedProject.slug, "subtitle", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD9CE] text-sm font-serif italic"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Executive Summary</label>
                    <textarea
                      rows={3}
                      value={selectedProject.summary}
                      onChange={(e) => updateProjectField(selectedProject.slug, "summary", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm leading-relaxed"
                    />
                  </div>
                </div>

                {/* Metadata Bar Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E2DA]">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Role / Discipline</label>
                    <input
                      type="text"
                      value={selectedProject.role}
                      onChange={(e) => updateProjectField(selectedProject.slug, "role", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Client / Brand</label>
                    <input
                      type="text"
                      value={selectedProject.client}
                      onChange={(e) => updateProjectField(selectedProject.slug, "client", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Project Status</label>
                    <input
                      type="text"
                      value={selectedProject.status}
                      onChange={(e) => updateProjectField(selectedProject.slug, "status", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs text-emerald-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: KEY IMPACT & METRICS */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                      Section 02
                    </span>
                    <h2 className="font-editorial text-2xl text-[#141413]">Key Impact &amp; Metrics</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProjectMetric(selectedProject.slug)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(selectedProject.metrics || []).map((m, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-[#E5E2DA] space-y-2 shadow-2xs">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8881]">
                        <span>Metric 0{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeProjectMetric(selectedProject.slug, i)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) =>
                          updateProjectMetric(selectedProject.slug, i, "label", e.target.value)
                        }
                        placeholder="Label"
                        className="w-full px-2.5 py-1.5 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                      />
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) =>
                          updateProjectMetric(selectedProject.slug, i, "value", e.target.value)
                        }
                        placeholder="Value (e.g. 240+)"
                        className="w-full px-2.5 py-1.5 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-base font-bold font-editorial text-[#141413]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: COVER SHOWCASE */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 03
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">Cover Image &amp; Showcase Media</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Cover Image URL</label>
                    <input
                      type="text"
                      value={selectedProject.coverImage}
                      onChange={(e) => updateProjectField(selectedProject.slug, "coverImage", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                    />
                    <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-[#E5E2DA] mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProject.coverImage}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">
                      Commercial Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={selectedProject.videoData?.url || ""}
                      onChange={(e) =>
                        updateProjectField(selectedProject.slug, "videoData", {
                          ...(selectedProject.videoData || {}),
                          url: e.target.value,
                        })
                      }
                      placeholder="e.g. https://.../video.mp4"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                    />
                    <p className="text-[11px] text-[#64625C] pt-2">
                      If filled, the page will embed a direct video player instead of a static cover photo.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: CONTEXT & STRATEGY */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-4 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 04
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">
                    Context &amp; Strategy (Challenge, Solution, Outcome)
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881] font-bold">
                      The Challenge
                    </label>
                    <textarea
                      rows={3}
                      value={selectedProject.overview?.challenge || ""}
                      onChange={(e) => updateProjectOverview(selectedProject.slug, "challenge", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881] font-bold">
                      The Strategic Solution
                    </label>
                    <textarea
                      rows={3}
                      value={selectedProject.overview?.strategicSolution || ""}
                      onChange={(e) =>
                        updateProjectOverview(selectedProject.slug, "strategicSolution", e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881] font-bold">
                      The Outcome
                    </label>
                    <textarea
                      rows={3}
                      value={selectedProject.overview?.outcome || ""}
                      onChange={(e) => updateProjectOverview(selectedProject.slug, "outcome", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: SCOPE OF WORK & TECHNICAL SPECS */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
                <div className="border-b border-[#E5E2DA] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                    Section 05
                  </span>
                  <h2 className="font-editorial text-2xl text-[#141413]">
                    Scope of Work &amp; Technical Standards
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Delivered Outputs Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#141413]">
                        Delivered Outputs ({selectedProject.deliverables?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => addProjectDeliverable(selectedProject.slug)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Output</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(selectedProject.deliverables || []).map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={d}
                            onChange={(e) =>
                              updateProjectDeliverable(selectedProject.slug, i, e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectDeliverable(selectedProject.slug, i)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Production & System Specs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#141413]">
                        Production &amp; System Specs
                      </span>
                      <button
                        type="button"
                        onClick={() => addProjectSpec(selectedProject.slug)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Spec</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(selectedProject.specs || {}).map(([k, v]) => (
                        <div key={k} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={k}
                              onChange={(e) =>
                                updateProjectSpecKey(selectedProject.slug, k, e.target.value)
                              }
                              className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F4F2EC] border border-[#DDD9CE]"
                            />
                            <button
                              type="button"
                              onClick={() => removeProjectSpec(selectedProject.slug, k)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={v}
                            onChange={(e) =>
                              updateProjectSpecValue(selectedProject.slug, k, e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: MODULAR CONTENT SECTIONS (GALLERY / CAROUSEL / DIELINE) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                      Section 06+
                    </span>
                    <h2 className="font-editorial text-3xl text-[#141413]">
                      Bespoke Modular Content Sections ({selectedProject.sections?.length || 0})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert New Section</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {(selectedProject.sections || []).map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs relative"
                    >
                      {/* Section Header & Reorder Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E2DA] gap-3">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded bg-[#141413] text-[#FAF9F5] font-mono text-xs font-bold">
                            Block 0{idx + 1}
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#EAE7DF] text-[#64625C] font-semibold">
                            {sec.type}
                          </span>
                          <span className="font-editorial text-xl font-semibold text-[#141413]">
                            {sec.title}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSection(selectedProject.slug, idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg hover:bg-[#EAE7DF] disabled:opacity-30 cursor-pointer text-xs"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(selectedProject.slug, idx, "down")}
                            disabled={idx === (selectedProject.sections || []).length - 1}
                            className="p-1.5 rounded-lg hover:bg-[#EAE7DF] disabled:opacity-30 cursor-pointer text-xs"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateSection(selectedProject.slug, idx)}
                            className="p-1.5 rounded-lg hover:bg-[#EAE7DF] cursor-pointer text-xs"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(selectedProject.slug, idx)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer text-xs ml-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Section Styling: Type, Typography scale, Spacing */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Variant */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-[#8A8881]">
                            Layout Variant
                          </label>
                          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                            <button
                              type="button"
                              onClick={() =>
                                updateSectionField(selectedProject.slug, idx, "type", "gallery")
                              }
                              className={`py-1 rounded-lg text-xs font-medium cursor-pointer ${
                                sec.type === "gallery" ? "bg-[#141413] text-[#FAF9F5]" : "text-[#5A5852]"
                              }`}
                            >
                              2-Col Grid
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSectionField(selectedProject.slug, idx, "type", "carousel")
                              }
                              className={`py-1 rounded-lg text-xs font-medium cursor-pointer ${
                                sec.type === "carousel" ? "bg-[#141413] text-[#FAF9F5]" : "text-[#5A5852]"
                              }`}
                            >
                              Carousel
                            </button>
                          </div>
                        </div>

                        {/* Font Scale */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-[#8A8881]">
                            Headline Scale
                          </label>
                          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                            {["7xl", "5xl", "3xl", "xl"].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() =>
                                  updateSectionField(selectedProject.slug, idx, "fontSize", s)
                                }
                                className={`py-1 rounded-md text-xs font-mono uppercase cursor-pointer ${
                                  (sec.fontSize || "3xl") === s
                                    ? "bg-[#141413] text-[#FAF9F5] font-bold"
                                    : "text-[#5A5852]"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Spacing */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-[#8A8881]">
                            Vertical Padding
                          </label>
                          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                            {["compact", "normal", "generous"].map((sp) => (
                              <button
                                key={sp}
                                type="button"
                                onClick={() =>
                                  updateSectionField(selectedProject.slug, idx, "spacing", sp)
                                }
                                className={`py-1 rounded-md text-xs font-mono capitalize cursor-pointer ${
                                  (sec.spacing || "normal") === sp
                                    ? "bg-[#141413] text-[#FAF9F5] font-bold"
                                    : "text-[#5A5852]"
                                }`}
                              >
                                {sp}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Background Styling */}
                      <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase font-bold text-[#141413]">
                            Section Background
                          </span>
                          <div className="flex gap-1 p-1 rounded-lg bg-[#EAE7DF]">
                            <button
                              type="button"
                              onClick={() =>
                                updateSectionBackground(selectedProject.slug, idx, "type", "color")
                              }
                              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                                (sec.background?.type || "color") === "color"
                                  ? "bg-[#141413] text-[#FAF9F5]"
                                  : "text-[#5A5852]"
                              }`}
                            >
                              Color
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSectionBackground(selectedProject.slug, idx, "type", "image")
                              }
                              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                                sec.background?.type === "image"
                                  ? "bg-[#141413] text-[#FAF9F5]"
                                  : "text-[#5A5852]"
                              }`}
                            >
                              Image
                            </button>
                          </div>
                        </div>

                        {sec.background?.type === "image" ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={sec.background?.imageUrl || ""}
                              onChange={(e) =>
                                updateSectionBackground(selectedProject.slug, idx, "imageUrl", e.target.value)
                              }
                              placeholder="Image URL"
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-[#8A8881]">
                              <span>Dark Overlay Opacity</span>
                              <span>{Math.round((sec.background?.overlayOpacity ?? 0.5) * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="0.9"
                              step="0.05"
                              value={sec.background?.overlayOpacity ?? 0.5}
                              onChange={(e) =>
                                updateSectionBackground(
                                  selectedProject.slug,
                                  idx,
                                  "overlayOpacity",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full accent-[#141413]"
                            />
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {["#FAF9F5", "#F4F2EC", "#141413", "#EAE7DF"].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() =>
                                  updateSectionBackground(selectedProject.slug, idx, "color", c)
                                }
                                className="w-7 h-7 rounded-full border border-black/20 cursor-pointer shadow-2xs"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Carousel Settings */}
                      {sec.type === "carousel" && (
                        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3">
                          <span className="text-xs font-mono uppercase font-bold text-[#141413] block">
                            Carousel Slider Controls
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between text-xs p-2 rounded bg-white">
                              <span>Autoplay Slides</span>
                              <input
                                type="checkbox"
                                checked={sec.carouselSettings?.autoplay ?? true}
                                onChange={(e) =>
                                  updateSectionCarouselSettings(
                                    selectedProject.slug,
                                    idx,
                                    "autoplay",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 accent-[#141413]"
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs p-2 rounded bg-white">
                              <span>Slide Duration</span>
                              <select
                                value={sec.carouselSettings?.intervalSeconds ?? 4}
                                onChange={(e) =>
                                  updateSectionCarouselSettings(
                                    selectedProject.slug,
                                    idx,
                                    "intervalSeconds",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono"
                              >
                                <option value={3}>3 seconds</option>
                                <option value={4}>4 seconds</option>
                                <option value={6}>6 seconds</option>
                                <option value={8}>8 seconds</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Texts */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-[#8A8881]">Kicker</label>
                          <input
                            type="text"
                            value={sec.kicker || ""}
                            onChange={(e) =>
                              updateSectionField(selectedProject.slug, idx, "kicker", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-[#8A8881]">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) =>
                              updateSectionField(selectedProject.slug, idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-sm font-editorial text-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-[#8A8881]">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={sec.description}
                            onChange={(e) =>
                              updateSectionField(selectedProject.slug, idx, "description", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Visual Component Cards */}
                      <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase font-bold text-[#141413]">
                            Visual Cards / Slides ({sec.items?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => addSectionItem(selectedProject.slug, idx)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Visual Card</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(sec.items || []).map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-4 rounded-xl bg-white border border-[#E5E2DA] space-y-2 shadow-2xs"
                            >
                              <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8881]">
                                <span>Card 0{itemIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(selectedProject.slug, idx, itemIdx)}
                                  className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.caption}
                                onChange={(e) =>
                                  updateSectionItem(
                                    selectedProject.slug,
                                    idx,
                                    itemIdx,
                                    "caption",
                                    e.target.value
                                  )
                                }
                                placeholder="Caption / Title"
                                className="w-full px-2.5 py-1.5 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-editorial text-sm font-semibold"
                              />
                              <textarea
                                rows={2}
                                value={item.subcaption || ""}
                                onChange={(e) =>
                                  updateSectionItem(
                                    selectedProject.slug,
                                    idx,
                                    itemIdx,
                                    "subcaption",
                                    e.target.value
                                  )
                                }
                                placeholder="Subcaption / Rationale"
                                className="w-full px-2.5 py-1.5 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                              />
                              <input
                                type="text"
                                value={item.image || ""}
                                onChange={(e) =>
                                  updateSectionItem(
                                    selectedProject.slug,
                                    idx,
                                    itemIdx,
                                    "image",
                                    e.target.value
                                  )
                                }
                                placeholder="Image URL"
                                className="w-full px-2.5 py-1.5 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. NAVIGATION MENU                                        */}
          {/* ========================================================= */}
          {activeTab === "navigation" && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                <div>
                  <h2 className="font-editorial text-2xl text-[#141413]">Header Navigation Menu</h2>
                  <p className="text-xs text-[#64625C]">Manage the navigation links displayed in the website header</p>
                </div>
                <button
                  type="button"
                  onClick={() => addNavLink("New Page", "/#")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Nav Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {(site.navLinks || []).map((link) => (
                  <div key={link.id} className="p-4 rounded-xl bg-white border border-[#E5E2DA] flex items-center gap-4">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateNavLink(link.id, "label", e.target.value)}
                      placeholder="Label"
                      className="w-1/3 px-3 py-2 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-medium"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateNavLink(link.id, "href", e.target.value)}
                      placeholder="Link (e.g. /about or #work)"
                      className="flex-1 px-3 py-2 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeNavLink(link.id)}
                      className="text-rose-500 hover:text-rose-700 p-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. SITE PROFILE & CONTACT                                 */}
          {/* ========================================================= */}
          {activeTab === "site" && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
              <div className="border-b border-[#E5E2DA] pb-3">
                <h2 className="font-editorial text-2xl text-[#141413]">Author Profile &amp; Contact</h2>
                <p className="text-xs text-[#64625C]">Metadata displayed across footer, browser tabs, and inquiry links</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Author Name</label>
                    <input
                      type="text"
                      value={site.author || ""}
                      onChange={(e) => setSite({ ...site, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm font-editorial text-base"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Role Title</label>
                    <input
                      type="text"
                      value={site.role || ""}
                      onChange={(e) => setSite({ ...site, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Contact Email</label>
                    <input
                      type="email"
                      value={site.email || ""}
                      onChange={(e) => setSite({ ...site, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Location Badge</label>
                    <input
                      type="text"
                      value={site.location || ""}
                      onChange={(e) => setSite({ ...site, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD9CE] text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E5E2DA]">
                  <div>
                    <span className="text-xs font-semibold text-[#141413] block">Available for Engagements</span>
                    <span className="text-[11px] text-[#64625C]">Toggles the green availability dot in header</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.availableForProjects}
                    onChange={(e) => setSite({ ...site, availableForProjects: e.target.checked })}
                    className="w-5 h-5 accent-[#141413]"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: INSERT TEMPLATE SECTION                            */}
      {/* ========================================================= */}
      {showTemplateModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-4">
              <div>
                <h3 className="font-editorial text-2xl text-[#141413]">Insert Section Template</h3>
                <p className="text-xs text-[#64625C]">Choose an editorial layout for this case study</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-full hover:bg-[#EAE7DF] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#8A8881]" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  type: "carousel",
                  title: "Interactive Carousel Slider",
                  desc: "Multi-slide showcase with autoplay, touch-swipe gestures, dot indicators, and count badge.",
                },
                {
                  type: "gallery",
                  title: "2-Column Split Gallery",
                  desc: "High-contrast editorial grid showcasing photography, logotypes, and packaging details.",
                },
                {
                  type: "comparison",
                  title: "Before & After Transformation Slider",
                  desc: "Interactive split slider comparing raw flat capture with retouched commercial finish.",
                },
              ].map((tmpl) => (
                <div
                  key={tmpl.type}
                  onClick={() => addSectionWithTemplate(selectedProject.slug, tmpl.type)}
                  className="p-4 rounded-2xl bg-white border border-[#E5E2DA] hover:border-[#141413] hover:shadow-md transition-all cursor-pointer space-y-1"
                >
                  <span className="font-editorial text-base text-[#141413] font-semibold block">
                    {tmpl.title}
                  </span>
                  <p className="text-xs text-[#5A5852] leading-relaxed">{tmpl.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-5 py-2 rounded-full border border-[#D5D1C7] text-xs font-medium hover:bg-[#EAE7DF] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
