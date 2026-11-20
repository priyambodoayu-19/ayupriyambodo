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
  ArrowLeft,
  ArrowRight,
  Layers,
  Sliders,
  SlidersHorizontal,
  Settings2,
  Eye,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  Monitor,
  Smartphone,
  Save,
  LogOut,
  Layout,
  User,
  Briefcase,
  FileBox,
  Check,
  X,
  Menu,
} from "lucide-react";
import ComparisonSlider from "@/components/ComparisonSlider";
import DielineInspector from "@/components/DielineInspector";
import CarouselSlider from "@/components/CarouselSlider";
import {
  SiteMetadata,
  ProjectItem,
  ProjectSection,
  DEFAULT_SITE_METADATA,
  DEFAULT_PROJECTS,
  ToolchainItem,
} from "@/data/projects";

type DeviceMode = "desktop" | "mobile";
type ViewMode = "visual" | "form";

export default function AdminPage() {
  const [site, setSite] = useState<SiteMetadata | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("home");

  // Selection states for Visual Builder
  // selectedBlock: "hero" | "pillars" | "work-header" | "capabilities" | "about-hero" | "about-story" | "about-status" | "about-toolchain" | "proj-hero" | "proj-metrics" | "proj-strategy" | "proj-deliverables" | "proj-showcase" | "section"
  const [selectedBlock, setSelectedBlock] = useState<string>("hero");
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number | null>(null);

  const [devicePreview, setDevicePreview] = useState<DeviceMode>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("visual");
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
        setStatusMessage("Changes saved & synced live!");
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

  // Helper when clicking tabs
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      setSelectedBlock("hero");
      setSelectedSectionIdx(null);
    } else if (tab === "about") {
      setSelectedBlock("about-hero");
      setSelectedSectionIdx(null);
    } else if (tab === "work-overview") {
      setSelectedBlock("work-header");
      setSelectedSectionIdx(null);
    } else if (tab === "site" || tab === "navigation") {
      setSelectedBlock(tab);
      setSelectedSectionIdx(null);
    } else {
      // Case study
      setSelectedBlock("proj-hero");
      setSelectedSectionIdx(0);
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
        skills: [...capabilities[catIdx].skills, "New Skill / Technical Fluency"],
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
      { name: "New Tool / Software", role: "Specialization details" },
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
  // PROJECT / CASE STUDY HELPERS
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
            specs: { ...(p.specs || {}), [newKey]: "System details and material tolerances" },
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

  // Bespoke Sections
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
          setSelectedBlock("section");
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
    handleSelectTab(newSlug);
  };

  const deleteProject = (slug: string) => {
    if (confirm("Are you sure you want to delete this case study page?")) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      handleSelectTab("home");
    }
  };

  if (isLoading || !site) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#141413] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-editorial text-lg text-[#141413]">Loading Editorial Studio Builder...</p>
        </div>
      </div>
    );
  }

  const activeSection: ProjectSection | null =
    selectedProject && selectedSectionIdx !== null && selectedProject.sections
      ? selectedProject.sections[selectedSectionIdx] || null
      : null;

  return (
    <div className="min-h-screen bg-[#F0EEE8] text-[#141413] flex flex-col font-sans">
      {/* ========================================================= */}
      {/* TOP STUDIO TOOLBAR                                        */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5] border-b border-[#E5E2DA] px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
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
            Visual Page Studio
          </span>
        </div>

        {/* Center: Builder Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EAE7DF] border border-[#DDD9CE]">
          <button
            onClick={() => setViewMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "visual"
                ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                : "text-[#5A5852] hover:text-[#141413]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Builder</span>
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
            <span>Structured Data</span>
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

      {/* ========================================================= */}
      {/* 3-COLUMN STUDIO LAYOUT                                    */}
      {/* ========================================================= */}
      <div className="flex-1 w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN: PAGE NAVIGATOR & SECTION OUTLINE             */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 space-y-6">
          {/* PAGES SELECTOR */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#141413]" />
                <span className="font-bold text-[#141413]">Pages</span>
              </span>
              <span className="text-[10px] opacity-70">{2 + projects.length} pages</span>
            </div>

            {/* Home Page */}
            <button
              onClick={() => handleSelectTab("home")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Layout className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Home Page</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/</span>
            </button>

            {/* About Page */}
            <button
              onClick={() => handleSelectTab("about")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                  : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">About Page</span>
              </div>
              <span className="font-mono text-[10px] opacity-60 shrink-0">/about</span>
            </button>

            {/* Case Studies Tree Branch */}
            <div className="pt-2 pl-2 space-y-1 border-l-2 border-[#E5E2DA] ml-2.5 my-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block px-2 pb-1">
                Case Studies ({projects.length})
              </span>

              {projects.map((p) => {
                const isCurrent = activeTab === p.slug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => handleSelectTab(p.slug)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#141413] text-[#FAF9F5] font-medium"
                        : "text-[#5A5852] hover:bg-[#F0EEE8]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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

          {/* ACTIVE PAGE SECTION OUTLINE (WEBFLOW-STYLE NAVIGATOR) */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] font-bold">
                Section Outline
              </span>
              {selectedProject && (
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Insert Block</span>
                </button>
              )}
            </div>

            {/* SECTIONS FOR HOME */}
            {activeTab === "home" && (
              <div className="space-y-1.5">
                {[
                  { key: "hero", label: "01 Hero Banner", sub: "Headline, CTA, Background" },
                  { key: "pillars", label: "02 Pillar Index Strip", sub: "Pillar 01 to 04 Grid" },
                  { key: "work-header", label: "03 Curated Work Header", sub: "Kicker & Title" },
                  { key: "capabilities", label: "04 Capabilities & Fluency", sub: "4 Categories & Skills" },
                ].map((sec) => (
                  <button
                    key={sec.key}
                    onClick={() => {
                      setSelectedBlock(sec.key);
                      setSelectedSectionIdx(null);
                    }}
                    className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      selectedBlock === sec.key
                        ? "bg-[#141413] text-[#FAF9F5]"
                        : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                    }`}
                  >
                    <span className="text-xs font-medium">{sec.label}</span>
                    <span className="text-[10px] font-mono opacity-60">{sec.sub}</span>
                  </button>
                ))}
              </div>
            )}

            {/* SECTIONS FOR ABOUT */}
            {activeTab === "about" && (
              <div className="space-y-1.5">
                {[
                  { key: "about-hero", label: "01 Profile & Bio Hero", sub: "Headline, Badges & CTAs" },
                  { key: "about-story", label: "02 Story Narrative", sub: "Long-form editorial paragraphs" },
                  { key: "about-status", label: "03 Availability Status", sub: "Client acceptance card" },
                  { key: "about-toolchain", label: "04 Technical Toolchain", sub: "Software mastery grid" },
                ].map((sec) => (
                  <button
                    key={sec.key}
                    onClick={() => {
                      setSelectedBlock(sec.key);
                      setSelectedSectionIdx(null);
                    }}
                    className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      selectedBlock === sec.key
                        ? "bg-[#141413] text-[#FAF9F5]"
                        : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                    }`}
                  >
                    <span className="text-xs font-medium">{sec.label}</span>
                    <span className="text-[10px] font-mono opacity-60">{sec.sub}</span>
                  </button>
                ))}
              </div>
            )}

            {/* SECTIONS FOR CASE STUDY */}
            {selectedProject && (
              <div className="space-y-1.5">
                {/* Fixed Structural Blocks */}
                <button
                  onClick={() => {
                    setSelectedBlock("proj-hero");
                    setSelectedSectionIdx(null);
                  }}
                  className={`w-full flex flex-col p-2 rounded-lg text-left transition-all cursor-pointer ${
                    selectedBlock === "proj-hero"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                  }`}
                >
                  <span className="text-xs font-medium">01 Project Hero &amp; Meta Bar</span>
                  <span className="text-[10px] font-mono opacity-60">Title, Client, Year, Status</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBlock("proj-metrics");
                    setSelectedSectionIdx(null);
                  }}
                  className={`w-full flex flex-col p-2 rounded-lg text-left transition-all cursor-pointer ${
                    selectedBlock === "proj-metrics"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                  }`}
                >
                  <span className="text-xs font-medium">02 Impact Metrics</span>
                  <span className="text-[10px] font-mono opacity-60">Key quantitative results</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBlock("proj-strategy");
                    setSelectedSectionIdx(null);
                  }}
                  className={`w-full flex flex-col p-2 rounded-lg text-left transition-all cursor-pointer ${
                    selectedBlock === "proj-strategy"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                  }`}
                >
                  <span className="text-xs font-medium">03 Context &amp; Strategy</span>
                  <span className="text-[10px] font-mono opacity-60">Challenge, Solution, Outcome</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBlock("proj-deliverables");
                    setSelectedSectionIdx(null);
                  }}
                  className={`w-full flex flex-col p-2 rounded-lg text-left transition-all cursor-pointer ${
                    selectedBlock === "proj-deliverables"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                  }`}
                >
                  <span className="text-xs font-medium">04 Scope of Work &amp; Specs</span>
                  <span className="text-[10px] font-mono opacity-60">Delivered Outputs &amp; Standards</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBlock("proj-showcase");
                    setSelectedSectionIdx(null);
                  }}
                  className={`w-full flex flex-col p-2 rounded-lg text-left transition-all cursor-pointer ${
                    selectedBlock === "proj-showcase"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F4F2EC] text-[#4A4843] hover:bg-[#EAE7DF]"
                  }`}
                >
                  <span className="text-xs font-medium">05 Primary Cover Showcase</span>
                  <span className="text-[10px] font-mono opacity-60">Hero Image / Video URL</span>
                </button>

                {/* Bespoke Modular Sections */}
                <div className="pt-2 border-t border-[#E5E2DA] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8A8881] block px-1">
                    Custom Sections ({selectedProject.sections?.length || 0})
                  </span>
                  {(selectedProject.sections || []).map((sec, idx) => {
                    const isSelected = selectedBlock === "section" && selectedSectionIdx === idx;
                    return (
                      <div
                        key={sec.id || idx}
                        onClick={() => {
                          setSelectedBlock("section");
                          setSelectedSectionIdx(idx);
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#141413] text-[#FAF9F5] font-medium"
                            : "bg-[#FAF9F5] text-[#4A4843] hover:bg-[#EAE7DF]"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[10px] opacity-60">
                            {String(idx + 6).padStart(2, "0")}
                          </span>
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
          </div>

          {/* SITE CONFIGURATION LINKS */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-2 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
              Site Configuration
            </span>
            <button
              onClick={() => handleSelectTab("navigation")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "navigation" ? "bg-[#141413] text-[#FAF9F5]" : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Menu className="w-3.5 h-3.5" />
                <span>Navigation Menu</span>
              </div>
            </button>
            <button
              onClick={() => handleSelectTab("site")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === "site" ? "bg-[#141413] text-[#FAF9F5]" : "text-[#4A4843] hover:bg-[#F0EEE8]"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                <span>Author Profile &amp; Contact</span>
              </div>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: INTERACTIVE VISUAL CANVAS                  */}
        {/* ========================================================= */}
        <main
          className={`${
            viewMode === "visual" ? "lg:col-span-6" : "lg:col-span-9"
          } space-y-8`}
        >
          {viewMode === "visual" ? (
            <div
              className={`mx-auto transition-all ${
                devicePreview === "mobile"
                  ? "max-w-[420px] border-4 border-[#141413] rounded-3xl overflow-hidden shadow-2xl"
                  : "w-full"
              }`}
            >
              <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-2xl p-6 sm:p-8 space-y-12 min-h-[750px] shadow-xs">
                {/* BREADCRUMB ROUTE INDICATOR */}
                <div className="border-b border-[#E5E2DA] pb-4 flex items-center justify-between text-xs font-mono text-[#8A8881]">
                  <span className="px-2.5 py-1 rounded bg-[#EAE7DF] text-[#64625C]">
                    Route: {activeTab === "home" ? "/" : activeTab === "about" ? "/about" : `/work/${activeTab}`}
                  </span>
                  <span className="uppercase tracking-wider">
                    {activeTab === "home"
                      ? "Primary Landing Page"
                      : activeTab === "about"
                      ? "Profile & Philosophy"
                      : selectedProject
                      ? `PILLAR ${selectedProject.pillarNumber}`
                      : "Site Settings"}
                  </span>
                </div>

                {/* ========================================================= */}
                {/* 1. VISUAL CANVAS: HOME PAGE                               */}
                {/* ========================================================= */}
                {activeTab === "home" && (
                  <div className="space-y-12">
                    {/* HERO SECTION BLOCK */}
                    {(() => {
                      const hero = site.hero;
                      const hasBgImage = hero?.background?.type === "image" && hero.background.imageUrl;
                      const hasBgColor = hero?.background?.type === "color" && hero.background.color;
                      const isSelected = selectedBlock === "hero";

                      return (
                        <div
                          onClick={() => setSelectedBlock("hero")}
                          className={`relative rounded-2xl p-6 sm:p-8 transition-all cursor-pointer overflow-hidden ${
                            isSelected
                              ? "ring-2 ring-[#141413] shadow-lg bg-white"
                              : "hover:ring-1 hover:ring-[#8A8881] border border-[#E5E2DA]"
                          }`}
                          style={{
                            backgroundColor: hasBgColor ? hero.background?.color : undefined,
                          }}
                        >
                          {/* Floating Pill */}
                          <div className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full bg-[#141413] text-[#FAF9F5] text-[10px] font-mono uppercase tracking-wider">
                            Hero Banner Block
                          </div>

                          {/* Background Image Preview */}
                          {hasBgImage && (
                            <div className="absolute inset-0 z-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={hero.background!.imageUrl!}
                                alt="Hero Background"
                                className="w-full h-full object-cover"
                              />
                              <div
                                className="absolute inset-0 bg-[#141413]"
                                style={{ opacity: hero.background?.overlayOpacity ?? 0.5 }}
                              />
                            </div>
                          )}

                          <div className={`relative z-10 space-y-6 ${hasBgImage ? "text-[#FAF9F5]" : ""}`}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider bg-black/5 border-black/10">
                              <span className="w-2 h-2 rounded-full bg-[#141413]" />
                              <span>{hero?.badge || "CREATIVE DIRECTION & BRAND IDENTITY PORTFOLIO"}</span>
                            </div>

                            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                              {hero?.headlinePrefix || "Translating zero-to-one concepts into"}{" "}
                              <span className="font-serif italic font-normal">
                                {hero?.headlineItalic || "shelf-ready systems"}
                              </span>
                              {hero?.headlineSuffix || ", commercial campaigns, & executive editorial."}
                            </h1>

                            <p className="text-sm sm:text-base leading-relaxed max-w-2xl opacity-90">
                              {hero?.subheadline || "I partner with ambitious brand founders..."}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              <span className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-[#141413] text-[#FAF9F5]">
                                {hero?.primaryButtonText || "Explore Featured Work"}
                              </span>
                              <span className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full border border-[#D5D1C7]">
                                {hero?.secondaryButtonText || "Read Profile & Approach"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* PILLARS STRIP PREVIEW */}
                    <div
                      onClick={() => setSelectedBlock("pillars")}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "pillars"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#F4F2EC] hover:border-[#C5C0B3]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881]">
                          02 Pillar Navigation Strip
                        </span>
                        <span className="text-[10px] font-mono text-[#8A8881]">4 Pillars</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {projects.slice(0, 4).map((p) => (
                          <div key={p.slug} className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E2DA]">
                            <span className="text-[9px] font-mono text-[#8A8881] block">PILLAR {p.pillarNumber}</span>
                            <span className="font-editorial text-sm font-medium">{p.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WORK SECTION HEADER */}
                    <div
                      onClick={() => setSelectedBlock("work-header")}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "work-header"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#C5C0B3]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-1">
                        {site.workSection?.kicker || "Core Curated Portfolio"}
                      </span>
                      <h2 className="font-editorial text-3xl text-[#141413]">
                        {site.workSection?.title || "The Four Pillars"}
                      </h2>
                      <p className="text-xs text-[#5A5852] mt-2 leading-relaxed">
                        {site.workSection?.description}
                      </p>
                    </div>

                    {/* CAPABILITIES SECTION */}
                    <div
                      onClick={() => setSelectedBlock("capabilities")}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "capabilities"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#F4F2EC] hover:border-[#C5C0B3]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-1">
                        Comprehensive Fluency
                      </span>
                      <h2 className="font-editorial text-2xl text-[#141413] mb-4">
                        End-to-End Capabilities
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {(site.capabilities || []).map((cat) => (
                          <div key={cat.category} className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E2DA]">
                            <span className="font-mono text-[10px] uppercase font-bold text-[#141413] block mb-1">
                              {cat.category}
                            </span>
                            <span className="text-[11px] text-[#5A5852]">
                              {cat.skills?.length || 0} technical skills listed
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 2. VISUAL CANVAS: ABOUT PAGE                              */}
                {/* ========================================================= */}
                {activeTab === "about" && (
                  <div className="space-y-12">
                    {/* ABOUT HERO */}
                    <div
                      onClick={() => setSelectedBlock("about-hero")}
                      className={`p-6 sm:p-8 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "about-hero"
                          ? "ring-2 ring-[#141413] shadow-lg bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-2">
                        {site.about?.badge || "Profile & Perspective"}
                      </span>
                      <h1 className="font-editorial text-4xl sm:text-5xl text-[#141413] leading-tight">
                        {site.about?.headline}
                      </h1>
                      <p className="font-serif italic text-lg text-[#5A5852] mt-3">
                        {site.about?.subheading}
                      </p>
                      <div className="flex gap-3 pt-4">
                        <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#141413] text-[#FAF9F5]">
                          {site.about?.contactButtonText || "Initiate a Conversation"}
                        </span>
                        <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-[#D5D1C7]">
                          {site.about?.resumeButtonText || "Download CV"}
                        </span>
                      </div>
                    </div>

                    {/* STORY PARAGRAPHS */}
                    <div
                      onClick={() => setSelectedBlock("about-story")}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "about-story"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-3">
                        Story Narrative ({site.about?.storyParagraphs?.length || 0} Paragraphs)
                      </span>
                      <div className="space-y-3 text-xs sm:text-sm text-[#5A5852] leading-relaxed">
                        {(site.about?.storyParagraphs || []).map((p, i) => (
                          <p key={i} className="line-clamp-2">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* STATUS CARD */}
                    <div
                      onClick={() => setSelectedBlock("about-status")}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "about-status"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#F4F2EC] hover:border-[#8A8881]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
                        {site.about?.statusBoxTitle || "Current Status"}
                      </span>
                      <p className="text-sm font-medium text-[#141413]">
                        {site.about?.statusBoxText}
                      </p>
                    </div>

                    {/* TOOLCHAIN MASTERY */}
                    <div
                      onClick={() => setSelectedBlock("about-toolchain")}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "about-toolchain"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-1">
                        Technical Mastery
                      </span>
                      <h2 className="font-editorial text-2xl text-[#141413] mb-4">
                        {site.about?.toolchainTitle || "Software & Toolchain Fluency"}
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {(site.about?.toolchain || []).map((t, i) => (
                          <div key={i} className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E2DA]">
                            <span className="font-mono text-xs font-bold text-[#141413] block">{t.name}</span>
                            <span className="text-[11px] text-[#64625C] line-clamp-1">{t.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 3. VISUAL CANVAS: CASE STUDY (MODULAR BLOCKS)             */}
                {/* ========================================================= */}
                {selectedProject && (
                  <div className="space-y-10">
                    {/* 01 PROJECT HERO & META BAR */}
                    <div
                      onClick={() => {
                        setSelectedBlock("proj-hero");
                        setSelectedSectionIdx(null);
                      }}
                      className={`p-6 sm:p-8 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "proj-hero"
                          ? "ring-2 ring-[#141413] shadow-lg bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881] mb-3">
                        <span className="px-2.5 py-0.5 rounded bg-[#141413] text-[#FAF9F5] font-semibold">
                          PILLAR {selectedProject.pillarNumber}
                        </span>
                        <span className="uppercase text-[#5A5852] font-semibold">
                          {selectedProject.pillarTitle}
                        </span>
                        <span>·</span>
                        <span>{selectedProject.year}</span>
                      </div>

                      <h1 className="font-editorial text-4xl sm:text-5xl text-[#141413] leading-tight">
                        {selectedProject.title}
                      </h1>
                      <p className="font-serif italic text-lg sm:text-xl text-[#5A5852] mt-2">
                        {selectedProject.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[#64625C] mt-3 leading-relaxed">
                        {selectedProject.summary}
                      </p>

                      {/* Meta bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[#E5E2DA] text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8A8881] block">Role</span>
                          <span className="font-medium text-[#141413] truncate block">{selectedProject.role}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8A8881] block">Client</span>
                          <span className="font-medium text-[#141413] truncate block">{selectedProject.client}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8A8881] block">Year</span>
                          <span className="font-medium text-[#141413]">{selectedProject.year}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8A8881] block">Status</span>
                          <span className="font-medium text-emerald-800">{selectedProject.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* 02 IMPACT METRICS */}
                    {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                      <div
                        onClick={() => {
                          setSelectedBlock("proj-metrics");
                          setSelectedSectionIdx(null);
                        }}
                        className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                          selectedBlock === "proj-metrics"
                            ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                            : "border-[#E5E2DA] bg-[#F4F2EC] hover:border-[#8A8881]"
                        }`}
                      >
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-3">
                          02 Impact Metrics
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {selectedProject.metrics.map((m, i) => (
                            <div key={i} className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E2DA]">
                              <span className="text-[10px] font-mono uppercase text-[#8A8881] block">{m.label}</span>
                              <span className="font-editorial text-2xl font-bold text-[#141413]">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 03 CONTEXT & STRATEGY */}
                    <div
                      onClick={() => {
                        setSelectedBlock("proj-strategy");
                        setSelectedSectionIdx(null);
                      }}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "proj-strategy"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-2">
                        03 Context &amp; Strategy
                      </span>
                      <h3 className="font-editorial text-xl text-[#141413] mb-4">
                        The Creative Challenge &amp; Strategic Solution
                      </h3>
                      <div className="space-y-3 text-xs sm:text-sm text-[#5A5852]">
                        <div className="p-3 rounded-lg bg-[#F4F2EC]">
                          <strong className="font-mono text-[10px] uppercase text-[#141413] block mb-1">
                            Challenge:
                          </strong>
                          <p className="line-clamp-2">{selectedProject.overview?.challenge}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F2EC]">
                          <strong className="font-mono text-[10px] uppercase text-[#141413] block mb-1">
                            Solution:
                          </strong>
                          <p className="line-clamp-2">{selectedProject.overview?.strategicSolution}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F2EC]">
                          <strong className="font-mono text-[10px] uppercase text-[#141413] block mb-1">
                            Outcome:
                          </strong>
                          <p className="line-clamp-2">{selectedProject.overview?.outcome}</p>
                        </div>
                      </div>
                    </div>

                    {/* 04 DELIVERED OUTPUTS & SPECS */}
                    <div
                      onClick={() => {
                        setSelectedBlock("proj-deliverables");
                        setSelectedSectionIdx(null);
                      }}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "proj-deliverables"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Scope */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-1">
                            Scope of Work
                          </span>
                          <h4 className="font-editorial text-lg text-[#141413] mb-3">Delivered Outputs</h4>
                          <ul className="space-y-2 text-xs text-[#5A5852]">
                            {(selectedProject.deliverables || []).map((d, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Specs */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-1">
                            Technical Standards
                          </span>
                          <h4 className="font-editorial text-lg text-[#141413] mb-3">Production &amp; Specs</h4>
                          <div className="space-y-2 text-xs">
                            {Object.entries(selectedProject.specs || {}).map(([k, v]) => (
                              <div key={k} className="p-2 rounded bg-[#F4F2EC]">
                                <span className="font-mono text-[9px] uppercase text-[#8A8881] block">{k}</span>
                                <span className="text-[#141413] font-medium line-clamp-1">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 05 SHOWCASE (COVER IMAGE OR VIDEO) */}
                    <div
                      onClick={() => {
                        setSelectedBlock("proj-showcase");
                        setSelectedSectionIdx(null);
                      }}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        selectedBlock === "proj-showcase"
                          ? "ring-2 ring-[#141413] shadow-md bg-white border-transparent"
                          : "border-[#E5E2DA] bg-[#FAF9F5] hover:border-[#8A8881]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8881] block mb-2">
                        05 Primary Cover Showcase
                      </span>
                      {selectedProject.videoData?.url ? (
                        <div className="p-4 rounded-xl bg-[#141413] text-[#FAF9F5] text-xs font-mono">
                          Video Source: {selectedProject.videoData.url}
                        </div>
                      ) : (
                        <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#E5E2DA]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedProject.coverImage}
                            alt={selectedProject.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* 06+ BESPOKE MODULAR SECTIONS */}
                    <div className="space-y-8 pt-4 border-t border-[#E5E2DA]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#8A8881]">
                          Modular Content Sections ({selectedProject.sections?.length || 0})
                        </span>
                        <button
                          onClick={() => setShowTemplateModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Section</span>
                        </button>
                      </div>

                      {(selectedProject.sections || []).map((sec, idx) => {
                        const isSelected = selectedBlock === "section" && selectedSectionIdx === idx;
                        const hasBgImage = sec.background?.type === "image" && sec.background.imageUrl;
                        const hasBgColor = sec.background?.type === "color" && sec.background.color;

                        return (
                          <div
                            key={sec.id || idx}
                            onClick={() => {
                              setSelectedBlock("section");
                              setSelectedSectionIdx(idx);
                            }}
                            className={`group relative rounded-2xl p-6 transition-all cursor-pointer ${
                              isSelected
                                ? "ring-2 ring-[#141413] shadow-lg bg-white"
                                : "hover:ring-1 hover:ring-[#8A8881] bg-[#FAF9F5] border border-[#E5E2DA]"
                            }`}
                            style={{
                              backgroundColor: hasBgColor ? sec.background?.color : undefined,
                            }}
                          >
                            {/* Floating Actions Pill */}
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
                                  style={{ opacity: sec.background?.overlayOpacity ?? 0.5 }}
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

                              {/* CAROUSEL SLIDER RENDER */}
                              {sec.type === "carousel" && sec.items && (
                                <div className="pt-2">
                                  <CarouselSlider
                                    items={sec.items}
                                    fallbackImage={selectedProject.coverImage}
                                    settings={sec.carouselSettings}
                                  />
                                </div>
                              )}

                              {/* COMPARISON SLIDER RENDER */}
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

                              {/* 2-COL GALLERY RENDER */}
                              {(sec.type === "gallery" || sec.type === "editorial") && sec.items && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                  {sec.items.map((item, itemIdx) => (
                                    <div
                                      key={itemIdx}
                                      className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2 shadow-2xs"
                                    >
                                      <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-[#F2EFE9] border border-[#E5E2DA]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={item.image || selectedProject.coverImage}
                                          alt={item.caption}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <h4 className="font-editorial text-sm text-[#141413]">{item.caption}</h4>
                                      {item.subcaption && (
                                        <p className="text-[11px] text-[#64625C]">{item.subcaption}</p>
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
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STRUCTURED DATA EDITOR (FALLBACK / FORM MODE) */
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6">
              <h2 className="font-editorial text-2xl text-[#141413]">Structured Raw Editor</h2>
              <p className="text-xs text-[#5A5852]">
                Switch to &ldquo;Visual Builder&rdquo; in the top bar for interactive live preview and point-and-click editing.
              </p>
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CONTEXTUAL INSPECTOR PANEL (WEBFLOW-STYLE)  */}
        {/* ========================================================= */}
        {viewMode === "visual" && (
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-2xl p-5 space-y-6 sticky top-20 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto">
              {/* INSPECTOR HEADER */}
              <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[#141413]" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Inspector Panel
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#141413] text-[#FAF9F5]">
                  {selectedBlock}
                </span>
              </div>

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: HOME HERO                              */}
              {/* ----------------------------------------------------- */}
              {activeTab === "home" && selectedBlock === "hero" && (
                <div className="space-y-5">
                  {/* Typography Scale */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Headline Font Scale
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {["7xl", "5xl", "3xl"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateSiteHero("fontSize", s)}
                          className={`py-1 rounded-md text-xs font-mono uppercase transition-all cursor-pointer ${
                            (site.hero?.fontSize || "7xl") === s
                              ? "bg-[#141413] text-[#FAF9F5] font-bold"
                              : "text-[#5A5852] hover:text-[#141413]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Spacing */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Vertical Spacing
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {["compact", "normal", "generous"].map((sp) => (
                        <button
                          key={sp}
                          onClick={() => updateSiteHero("spacing", sp)}
                          className={`py-1 rounded-md text-xs font-mono capitalize transition-all cursor-pointer ${
                            (site.hero?.spacing || "normal") === sp
                              ? "bg-[#141413] text-[#FAF9F5] font-bold"
                              : "text-[#5A5852] hover:text-[#141413]"
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Styling */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                      Hero Background Styling
                    </label>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      <button
                        onClick={() => updateSiteHeroBackground("type", "color")}
                        className={`py-1 rounded-md text-xs font-medium cursor-pointer ${
                          (site.hero?.background?.type || "color") === "color"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Solid Color
                      </button>
                      <button
                        onClick={() => updateSiteHeroBackground("type", "image")}
                        className={`py-1 rounded-md text-xs font-medium cursor-pointer ${
                          site.hero?.background?.type === "image"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Photo / Image
                      </button>
                    </div>

                    {site.hero?.background?.type === "image" ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={site.hero?.background?.imageUrl || ""}
                          onChange={(e) => updateSiteHeroBackground("imageUrl", e.target.value)}
                          placeholder="High-Res Image URL"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                        />
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#8A8881]">
                            <span>Dark Overlay Opacity</span>
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
                      <div className="flex gap-2">
                        {["#FAF9F5", "#F4F2EC", "#141413", "#EAE7DF"].map((c) => (
                          <button
                            key={c}
                            onClick={() => updateSiteHeroBackground("color", c)}
                            className="w-7 h-7 rounded-full border border-black/20 cursor-pointer shadow-2xs"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Copywriting */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Badge / Tagline
                      </label>
                      <input
                        type="text"
                        value={site.hero?.badge || ""}
                        onChange={(e) => updateSiteHero("badge", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Headline Prefix
                      </label>
                      <input
                        type="text"
                        value={site.hero?.headlinePrefix || ""}
                        onChange={(e) => updateSiteHero("headlinePrefix", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Headline Italic Accent
                      </label>
                      <input
                        type="text"
                        value={site.hero?.headlineItalic || ""}
                        onChange={(e) => updateSiteHero("headlineItalic", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-serif italic"
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
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Subheadline Paragraph
                      </label>
                      <textarea
                        rows={4}
                        value={site.hero?.subheadline || ""}
                        onChange={(e) => updateSiteHero("subheadline", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                        Primary CTA Button
                      </label>
                      <input
                        type="text"
                        value={site.hero?.primaryButtonText || ""}
                        onChange={(e) => updateSiteHero("primaryButtonText", e.target.value)}
                        placeholder="Button Text"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs mb-1"
                      />
                      <input
                        type="text"
                        value={site.hero?.primaryButtonLink || ""}
                        onChange={(e) => updateSiteHero("primaryButtonLink", e.target.value)}
                        placeholder="Link URL / Anchor (e.g. #work)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: WORK HEADER                            */}
              {/* ----------------------------------------------------- */}
              {activeTab === "home" && selectedBlock === "work-header" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Kicker</label>
                    <input
                      type="text"
                      value={site.workSection?.kicker || ""}
                      onChange={(e) => updateSiteWorkSection("kicker", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Title</label>
                    <input
                      type="text"
                      value={site.workSection?.title || ""}
                      onChange={(e) => updateSiteWorkSection("title", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Description</label>
                    <textarea
                      rows={4}
                      value={site.workSection?.description || ""}
                      onChange={(e) => updateSiteWorkSection("description", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: CAPABILITIES                           */}
              {/* ----------------------------------------------------- */}
              {activeTab === "home" && selectedBlock === "capabilities" && (
                <div className="space-y-5">
                  <span className="text-[10px] font-mono uppercase text-[#8A8881] block">
                    Manage 4 Core Disciplines
                  </span>
                  {(site.capabilities || []).map((cat, catIdx) => (
                    <div key={catIdx} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => updateCapabilityCategory(catIdx, e.target.value)}
                        className="w-full font-mono text-xs font-bold px-2 py-1 border-b border-[#E5E2DA] bg-transparent"
                      />
                      <div className="space-y-1 pt-1">
                        {cat.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => updateCapabilitySkill(catIdx, sIdx, e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-[#F4F2EC] text-xs border border-[#DDD9CE]"
                            />
                            <button
                              onClick={() => removeCapabilitySkill(catIdx, sIdx)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addCapabilitySkill(catIdx)}
                          className="text-[10px] font-mono text-[#141413] hover:underline pt-1 cursor-pointer"
                        >
                          + Add Skill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: ABOUT HERO                             */}
              {/* ----------------------------------------------------- */}
              {activeTab === "about" && selectedBlock === "about-hero" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Badge</label>
                    <input
                      type="text"
                      value={site.about?.badge || ""}
                      onChange={(e) => updateSiteAbout("badge", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Main Headline</label>
                    <input
                      type="text"
                      value={site.about?.headline || ""}
                      onChange={(e) => updateSiteAbout("headline", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-editorial"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Subheading (Italic)</label>
                    <textarea
                      rows={3}
                      value={site.about?.subheading || ""}
                      onChange={(e) => updateSiteAbout("subheading", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-serif italic"
                    />
                  </div>
                  <div className="space-y-1 pt-2 border-t border-[#E5E2DA]">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Contact Button Text</label>
                    <input
                      type="text"
                      value={site.about?.contactButtonText || ""}
                      onChange={(e) => updateSiteAbout("contactButtonText", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Resume / CV Button Text</label>
                    <input
                      type="text"
                      value={site.about?.resumeButtonText || ""}
                      onChange={(e) => updateSiteAbout("resumeButtonText", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: ABOUT STORY PARAGRAPHS                 */}
              {/* ----------------------------------------------------- */}
              {activeTab === "about" && selectedBlock === "about-story" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#8A8881]">Editorial Paragraphs</span>
                    <button
                      onClick={addAboutStoryParagraph}
                      className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                    >
                      + Add Paragraph
                    </button>
                  </div>
                  {(site.about?.storyParagraphs || []).map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8881]">
                        <span>Paragraph 0{i + 1}</span>
                        <button
                          onClick={() => removeAboutStoryParagraph(i)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={p}
                        onChange={(e) => updateAboutStoryParagraph(i, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: ABOUT STATUS BOX                       */}
              {/* ----------------------------------------------------- */}
              {activeTab === "about" && selectedBlock === "about-status" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Card Title</label>
                    <input
                      type="text"
                      value={site.about?.statusBoxTitle || ""}
                      onChange={(e) => updateSiteAbout("statusBoxTitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Status Details</label>
                    <textarea
                      rows={4}
                      value={site.about?.statusBoxText || ""}
                      onChange={(e) => updateSiteAbout("statusBoxText", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: ABOUT TOOLCHAIN                        */}
              {/* ----------------------------------------------------- */}
              {activeTab === "about" && selectedBlock === "about-toolchain" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#8A8881]">Toolchain Grid</span>
                    <button
                      onClick={addAboutTool}
                      className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                    >
                      + Add Tool
                    </button>
                  </div>
                  {(site.about?.toolchain || []).map((tool, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateAboutTool(i, "name", e.target.value)}
                          placeholder="Tool Name"
                          className="font-mono text-xs font-bold px-2 py-1 rounded bg-[#F4F2EC] border border-[#DDD9CE]"
                        />
                        <button
                          onClick={() => removeAboutTool(i)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tool.role}
                        onChange={(e) => updateAboutTool(i, "role", e.target.value)}
                        placeholder="Role / Mastery description"
                        className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: CASE STUDY HERO & META                 */}
              {/* ----------------------------------------------------- */}
              {selectedProject && selectedBlock === "proj-hero" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Pillar #</label>
                      <input
                        type="text"
                        value={selectedProject.pillarNumber}
                        onChange={(e) => updateProjectField(selectedProject.slug, "pillarNumber", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Year</label>
                      <input
                        type="text"
                        value={selectedProject.year}
                        onChange={(e) => updateProjectField(selectedProject.slug, "year", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Case Study Title</label>
                    <input
                      type="text"
                      value={selectedProject.title}
                      onChange={(e) => updateProjectField(selectedProject.slug, "title", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-editorial text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Editorial Subtitle</label>
                    <textarea
                      rows={2}
                      value={selectedProject.subtitle}
                      onChange={(e) => updateProjectField(selectedProject.slug, "subtitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-serif italic"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Summary Paragraph</label>
                    <textarea
                      rows={3}
                      value={selectedProject.summary}
                      onChange={(e) => updateProjectField(selectedProject.slug, "summary", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E2DA]">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Role</label>
                      <input
                        type="text"
                        value={selectedProject.role}
                        onChange={(e) => updateProjectField(selectedProject.slug, "role", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Client</label>
                      <input
                        type="text"
                        value={selectedProject.client}
                        onChange={(e) => updateProjectField(selectedProject.slug, "client", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Status</label>
                    <input
                      type="text"
                      value={selectedProject.status}
                      onChange={(e) => updateProjectField(selectedProject.slug, "status", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs text-emerald-800 font-medium"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#E5E2DA]">
                    <button
                      onClick={() => deleteProject(selectedProject.slug)}
                      className="w-full py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-mono transition-colors cursor-pointer"
                    >
                      Delete This Entire Case Study
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: CASE STUDY METRICS                     */}
              {/* ----------------------------------------------------- */}
              {selectedProject && selectedBlock === "proj-metrics" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#8A8881]">Impact Metrics</span>
                    <button
                      onClick={() => addProjectMetric(selectedProject.slug)}
                      className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                    >
                      + Add Metric
                    </button>
                  </div>
                  {(selectedProject.metrics || []).map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8881]">
                        <span>Metric 0{i + 1}</span>
                        <button
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
                        placeholder="Label (e.g. Design Tokens)"
                        className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                      />
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) =>
                          updateProjectMetric(selectedProject.slug, i, "value", e.target.value)
                        }
                        placeholder="Value (e.g. 240+)"
                        className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-bold"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: CASE STUDY STRATEGY                    */}
              {/* ----------------------------------------------------- */}
              {selectedProject && selectedBlock === "proj-strategy" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">The Challenge</label>
                    <textarea
                      rows={3}
                      value={selectedProject.overview?.challenge || ""}
                      onChange={(e) => updateProjectOverview(selectedProject.slug, "challenge", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Strategic Solution</label>
                    <textarea
                      rows={3}
                      value={selectedProject.overview?.strategicSolution || ""}
                      onChange={(e) =>
                        updateProjectOverview(selectedProject.slug, "strategicSolution", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">The Outcome</label>
                    <textarea
                      rows={3}
                      value={selectedProject.overview?.outcome || ""}
                      onChange={(e) => updateProjectOverview(selectedProject.slug, "outcome", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: DELIVERABLES & SPECS                   */}
              {/* ----------------------------------------------------- */}
              {selectedProject && selectedBlock === "proj-deliverables" && (
                <div className="space-y-5">
                  {/* Delivered Outputs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#8A8881]">Delivered Outputs</span>
                      <button
                        onClick={() => addProjectDeliverable(selectedProject.slug)}
                        className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                      >
                        + Add Output
                      </button>
                    </div>
                    {(selectedProject.deliverables || []).map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={d}
                          onChange={(e) =>
                            updateProjectDeliverable(selectedProject.slug, i, e.target.value)
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                        />
                        <button
                          onClick={() => removeProjectDeliverable(selectedProject.slug, i)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Production Specs */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#8A8881]">Production Specs</span>
                      <button
                        onClick={() => addProjectSpec(selectedProject.slug)}
                        className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                      >
                        + Add Spec
                      </button>
                    </div>
                    {Object.entries(selectedProject.specs || {}).map(([k, v]) => (
                      <div key={k} className="p-2.5 rounded-xl bg-white border border-[#E5E2DA] space-y-1.5">
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
                            onClick={() => removeProjectSpec(selectedProject.slug, k)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={v}
                          onChange={(e) =>
                            updateProjectSpecValue(selectedProject.slug, k, e.target.value)
                          }
                          className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: SHOWCASE COVER                         */}
              {/* ----------------------------------------------------- */}
              {selectedProject && selectedBlock === "proj-showcase" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Cover Image URL</label>
                    <input
                      type="text"
                      value={selectedProject.coverImage}
                      onChange={(e) => updateProjectField(selectedProject.slug, "coverImage", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Video Player URL (Optional)</label>
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
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: BESPOKE SECTION BLOCK                  */}
              {/* ----------------------------------------------------- */}
              {selectedProject && selectedBlock === "section" && activeSection && selectedSectionIdx !== null && (
                <div className="space-y-6">
                  {/* Variant Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Component Layout</label>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      <button
                        onClick={() =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "type", "gallery")
                        }
                        className={`py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          activeSection.type === "gallery" ? "bg-[#141413] text-[#FAF9F5]" : "text-[#5A5852]"
                        }`}
                      >
                        2-Col Grid
                      </button>
                      <button
                        onClick={() =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "type", "carousel")
                        }
                        className={`py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          activeSection.type === "carousel" ? "bg-[#141413] text-[#FAF9F5]" : "text-[#5A5852]"
                        }`}
                      >
                        Carousel Slider
                      </button>
                    </div>
                  </div>

                  {/* Font scale */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Headline Scale</label>
                    <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {["7xl", "5xl", "3xl", "xl"].map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            updateSectionField(selectedProject.slug, selectedSectionIdx, "fontSize", s)
                          }
                          className={`py-1 rounded-md text-xs font-mono uppercase cursor-pointer ${
                            (activeSection.fontSize || "3xl") === s
                              ? "bg-[#141413] text-[#FAF9F5] font-bold"
                              : "text-[#5A5852]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Vertical Spacing</label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      {["compact", "normal", "generous"].map((sp) => (
                        <button
                          key={sp}
                          onClick={() =>
                            updateSectionField(selectedProject.slug, selectedSectionIdx, "spacing", sp)
                          }
                          className={`py-1 rounded-md text-xs font-mono capitalize cursor-pointer ${
                            (activeSection.spacing || "normal") === sp
                              ? "bg-[#141413] text-[#FAF9F5] font-bold"
                              : "text-[#5A5852]"
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Background Styling</label>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EAE7DF]">
                      <button
                        onClick={() =>
                          updateSectionBackground(selectedProject.slug, selectedSectionIdx, "type", "color")
                        }
                        className={`py-1 rounded-md text-xs font-medium cursor-pointer ${
                          (activeSection.background?.type || "color") === "color"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Color
                      </button>
                      <button
                        onClick={() =>
                          updateSectionBackground(selectedProject.slug, selectedSectionIdx, "type", "image")
                        }
                        className={`py-1 rounded-md text-xs font-medium cursor-pointer ${
                          activeSection.background?.type === "image"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#5A5852]"
                        }`}
                      >
                        Image
                      </button>
                    </div>

                    {activeSection.background?.type === "image" ? (
                      <div className="space-y-2">
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
                          placeholder="Image URL"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-[#8A8881]">
                          <span>Overlay Opacity</span>
                          <span>{Math.round((activeSection.background?.overlayOpacity ?? 0.5) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.9"
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
                          className="w-full accent-[#141413]"
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {["#FAF9F5", "#F4F2EC", "#141413", "#EAE7DF"].map((c) => (
                          <button
                            key={c}
                            onClick={() =>
                              updateSectionBackground(selectedProject.slug, selectedSectionIdx, "color", c)
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
                  {activeSection.type === "carousel" && (
                    <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                      <span className="text-[10px] font-mono uppercase text-[#8A8881] block">Carousel Settings</span>
                      <div className="flex items-center justify-between text-xs">
                        <span>Autoplay Loop</span>
                        <input
                          type="checkbox"
                          checked={activeSection.carouselSettings?.autoplay ?? true}
                          onChange={(e) =>
                            updateSectionCarouselSettings(
                              selectedProject.slug,
                              selectedSectionIdx,
                              "autoplay",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 accent-[#141413]"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Interval (Seconds)</span>
                        <select
                          value={activeSection.carouselSettings?.intervalSeconds ?? 4}
                          onChange={(e) =>
                            updateSectionCarouselSettings(
                              selectedProject.slug,
                              selectedSectionIdx,
                              "intervalSeconds",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-2 py-1 rounded bg-white border border-[#DDD9CE] text-xs font-mono"
                        >
                          <option value={3}>3s</option>
                          <option value={4}>4s</option>
                          <option value={6}>6s</option>
                          <option value={8}>8s</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Texts */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Kicker</label>
                      <input
                        type="text"
                        value={activeSection.kicker || ""}
                        onChange={(e) =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "kicker", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Section Title</label>
                      <input
                        type="text"
                        value={activeSection.title}
                        onChange={(e) =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "title", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs font-editorial"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8881]">Description</label>
                      <textarea
                        rows={3}
                        value={activeSection.description}
                        onChange={(e) =>
                          updateSectionField(selectedProject.slug, selectedSectionIdx, "description", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                      />
                    </div>
                  </div>

                  {/* Cards / Items */}
                  <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#8A8881]">
                        Visual Cards ({activeSection.items?.length || 0})
                      </span>
                      <button
                        onClick={() => addSectionItem(selectedProject.slug, selectedSectionIdx)}
                        className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                      >
                        + Add Card
                      </button>
                    </div>

                    {(activeSection.items || []).map((item, itemIdx) => (
                      <div key={itemIdx} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8881]">
                          <span>Card 0{itemIdx + 1}</span>
                          <button
                            onClick={() =>
                              removeSectionItem(selectedProject.slug, selectedSectionIdx, itemIdx)
                            }
                            className="text-rose-500 hover:text-rose-700 cursor-pointer"
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
                              selectedSectionIdx,
                              itemIdx,
                              "caption",
                              e.target.value
                            )
                          }
                          placeholder="Card Title / Caption"
                          className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-editorial"
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
                          placeholder="Card Subcaption / Details"
                          className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs"
                        />
                        <input
                          type="text"
                          value={item.image || ""}
                          onChange={(e) =>
                            updateSectionItem(
                              selectedProject.slug,
                              selectedSectionIdx,
                              itemIdx,
                              "image",
                              e.target.value
                            )
                          }
                          placeholder="Image URL"
                          className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: NAVIGATION LINKS                       */}
              {/* ----------------------------------------------------- */}
              {activeTab === "navigation" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#8A8881]">Header Nav Links</span>
                    <button
                      onClick={() => addNavLink("New Page", "/#")}
                      className="text-[11px] font-mono text-[#141413] hover:underline cursor-pointer"
                    >
                      + Add Link
                    </button>
                  </div>
                  {(site.navLinks || []).map((link) => (
                    <div key={link.id} className="p-3 rounded-xl bg-white border border-[#E5E2DA] space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateNavLink(link.id, "label", e.target.value)}
                          placeholder="Label (e.g. Work)"
                          className="w-1/2 px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-medium"
                        />
                        <button
                          onClick={() => removeNavLink(link.id)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateNavLink(link.id, "href", e.target.value)}
                        placeholder="Path / Anchor (e.g. /about or #work)"
                        className="w-full px-2 py-1 rounded bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* INSPECTOR FOR: AUTHOR PROFILE & CONTACT               */}
              {/* ----------------------------------------------------- */}
              {activeTab === "site" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Author Name</label>
                    <input
                      type="text"
                      value={site.author || ""}
                      onChange={(e) => setSite({ ...site, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-editorial"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Role Title</label>
                    <input
                      type="text"
                      value={site.role || ""}
                      onChange={(e) => setSite({ ...site, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Contact Email</label>
                    <input
                      type="email"
                      value={site.email || ""}
                      onChange={(e) => setSite({ ...site, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8881]">Location Badge</label>
                    <input
                      type="text"
                      value={site.location || ""}
                      onChange={(e) => setSite({ ...site, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDD9CE] text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DA] text-xs">
                    <span>Available for Inquiries</span>
                    <input
                      type="checkbox"
                      checked={site.availableForProjects}
                      onChange={(e) => setSite({ ...site, availableForProjects: e.target.checked })}
                      className="w-4 h-4 accent-[#141413]"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
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
