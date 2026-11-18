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
} from "lucide-react";
import { ProjectItem, SiteMetadata, ToolchainItem } from "@/data/projects";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [site, setSite] = useState<SiteMetadata | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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
        setStatusMessage(
          data.savedTarget === "github_and_disk"
            ? "Saved and committed directly to GitHub! Vercel is updating."
            : "Saved successfully to content store."
        );
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

  const updateSiteHero = (field: string, value: string) => {
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
            "I partner with ambitious brand founders, creative directors, and executive teams to build enduring visual worlds—from raw botanical formulation concepts and factory pre-press dielines to high-impact launch films and bilingual investor publications.",
          primaryButtonText: "Explore Featured Work",
          primaryButtonLink: "#work",
          secondaryButtonText: "Read Profile & Approach",
          secondaryButtonLink: "/about",
        }),
        [field]: value,
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
          subheading: "Bridging the gap between zero-to-one brand storytelling and real-world physical manufacturing.",
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
  // PROJECT HELPERS
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
      deliverables: ["Visual Identity System", "Label Architecture", "Manufacturing Specs"],
      overview: {
        challenge: "Describe the foundational challenge and brand dilemma.",
        strategicSolution: "Detail the strategic concept, aesthetic discipline, and solution executed.",
        outcome: "Highlight the market reception, shelf presence, or executive results.",
      },
      sections: [],
    };

    setProjects([...projects, newProject]);
    setActiveTab(newSlug);
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

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col">
      {/* Top Admin Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E2DA] px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-editorial text-xl text-[#141413] hover:opacity-80">
            Ayu Priyambodo
          </Link>
          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#EAE7DF] text-[#64625C] border border-[#DDD9CE]">
            Studio CMS &amp; Website Builder
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium animate-fadeIn">
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

      {/* Main CMS Layout with Sidebar Navigation Tree */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Navigation Sidebar Tree */}
        <aside className="lg:col-span-3 space-y-6">
          {/* PAGES GROUP */}
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
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
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
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
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
              onClick={() => setActiveTab("work-overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
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
                    onClick={() => setActiveTab(p.slug)}
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

          {/* SITE SETTINGS GROUP */}
          <div className="space-y-1.5 pt-4 border-t border-[#E5E2DA]">
            <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
              <Sliders className="w-3 h-3 text-[#8A8881]" />
              <span>Site Configuration</span>
            </div>

            <button
              onClick={() => setActiveTab("navigation")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
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
              onClick={() => setActiveTab("site")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
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

        {/* Tab Content Editor Panel */}
        <main className="lg:col-span-9 bg-[#F4F2EC] border border-[#E5E2DA] rounded-2xl p-6 sm:p-10 space-y-10">
          {/* ========================================================= */}
          {/* 1. HOME PAGE EDITOR */}
          {/* ========================================================= */}
          {activeTab === "home" && (
            <div className="space-y-8">
              <div className="border-b border-[#E5E2DA] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
                    <span className="px-2 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">Route: /</span>
                    <span>·</span>
                    <span>PRIMARY LANDING PAGE</span>
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
                    Home Page &amp; Hero Editor
                  </h2>
                  <p className="text-xs text-[#64625C] pt-1">
                    Manage the main positioning statement, editorial typography, and intro paragraph.
                  </p>
                </div>

                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase bg-[#FAF9F5] border border-[#D5D1C7] hover:bg-[#EAE7DF] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </Link>
              </div>

              {/* Real-time Visual Preview Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-6 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                  Live Editorial Preview
                </span>

                <div className="space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE7DF] text-[11px] font-mono text-[#64625C] border border-[#DDD9CE]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141413]" />
                    <span>{site.hero?.badge || "CREATIVE DIRECTION & BRAND IDENTITY PORTFOLIO"}</span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#141413] leading-snug">
                    {site.hero?.headlinePrefix || "Translating zero-to-one concepts into"}{" "}
                    <span className="font-serif italic font-normal text-[#5A5852]">
                      {site.hero?.headlineItalic || "shelf-ready systems"}
                    </span>
                    {site.hero?.headlineSuffix || ", commercial campaigns, & executive editorial."}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5A5852] leading-relaxed">
                    {site.hero?.subheadline ||
                      "I partner with ambitious brand founders, creative directors, and executive teams to build enduring visual worlds..."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full bg-[#141413] text-[#FAF9F5]">
                      {site.hero?.primaryButtonText || "Explore Featured Work"}
                    </span>
                    <span className="px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full border border-[#D5D1C7] text-[#141413]">
                      {site.hero?.secondaryButtonText || "Read Profile & Approach"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Tagline Badge */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                  Top Tagline Badge
                </label>
                <input
                  type="text"
                  value={site.hero?.badge || ""}
                  onChange={(e) => updateSiteHero("badge", e.target.value)}
                  placeholder="e.g. CREATIVE DIRECTION & BRAND IDENTITY PORTFOLIO"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                />
              </div>

              {/* Headline Split Fields */}
              <div className="space-y-4 p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  Main Editorial Headline Anatomy
                </h4>
                <p className="text-xs text-[#64625C]">
                  Split into three parts so you can emphasize specific words with the luxury italic font style.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      1. Headline Opening Prefix
                    </label>
                    <input
                      type="text"
                      value={site.hero?.headlinePrefix || ""}
                      onChange={(e) => updateSiteHero("headlinePrefix", e.target.value)}
                      placeholder="e.g. Translating zero-to-one concepts into"
                      className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-amber-800">
                      2. Highlighted Emphasis Phrase (Renders in Editorial Italic)
                    </label>
                    <input
                      type="text"
                      value={site.hero?.headlineItalic || ""}
                      onChange={(e) => updateSiteHero("headlineItalic", e.target.value)}
                      placeholder="e.g. shelf-ready systems"
                      className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-amber-300 text-sm font-serif italic text-[#141413]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      3. Headline Closing Suffix
                    </label>
                    <input
                      type="text"
                      value={site.hero?.headlineSuffix || ""}
                      onChange={(e) => updateSiteHero("headlineSuffix", e.target.value)}
                      placeholder="e.g. , commercial campaigns, & executive editorial."
                      className="w-full px-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                    />
                  </div>
                </div>
              </div>

              {/* Subheadline Paragraph */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                  Subheadline / Introductory Paragraph
                </label>
                <textarea
                  rows={4}
                  value={site.hero?.subheadline || ""}
                  onChange={(e) => updateSiteHero("subheadline", e.target.value)}
                  placeholder="Describe your creative partnership approach..."
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413] leading-relaxed"
                />
              </div>

              {/* Call to Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Primary Button (Dark)
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={site.hero?.primaryButtonText || ""}
                      onChange={(e) => updateSiteHero("primaryButtonText", e.target.value)}
                      placeholder="Label (e.g. Explore Featured Work)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413]"
                    />
                    <input
                      type="text"
                      value={site.hero?.primaryButtonLink || ""}
                      onChange={(e) => updateSiteHero("primaryButtonLink", e.target.value)}
                      placeholder="Link (e.g. #work)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Secondary Button (Outline)
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={site.hero?.secondaryButtonText || ""}
                      onChange={(e) => updateSiteHero("secondaryButtonText", e.target.value)}
                      placeholder="Label (e.g. Read Profile & Approach)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413]"
                    />
                    <input
                      type="text"
                      value={site.hero?.secondaryButtonLink || ""}
                      onChange={(e) => updateSiteHero("secondaryButtonLink", e.target.value)}
                      placeholder="Link (e.g. /about)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ABOUT PAGE EDITOR */}
          {/* ========================================================= */}
          {activeTab === "about" && (
            <div className="space-y-8">
              <div className="border-b border-[#E5E2DA] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
                    <span className="px-2 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">Route: /about</span>
                    <span>·</span>
                    <span>BIOGRAPHY &amp; METHODOLOGY</span>
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
                    About Page Editor
                  </h2>
                  <p className="text-xs text-[#64625C] pt-1">
                    Edit your editorial manifesto, story paragraphs, availability status box, and toolchain fluency.
                  </p>
                </div>

                <Link
                  href="/about"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase bg-[#FAF9F5] border border-[#D5D1C7] hover:bg-[#EAE7DF] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </Link>
              </div>

              {/* About Header Fields */}
              <div className="space-y-4 p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  Page Header &amp; Manifesto
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      Header Tagline / Kicker Badge
                    </label>
                    <input
                      type="text"
                      value={site.about?.badge || ""}
                      onChange={(e) => updateSiteAbout("badge", e.target.value)}
                      placeholder="e.g. Profile & Perspective"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={site.about?.headline || ""}
                      onChange={(e) => updateSiteAbout("headline", e.target.value)}
                      placeholder="e.g. Designing with aesthetic authority & manufacturing rigor."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413] font-editorial text-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      Subheading / Philosophy Italics
                    </label>
                    <textarea
                      rows={2}
                      value={site.about?.subheading || ""}
                      onChange={(e) => updateSiteAbout("subheading", e.target.value)}
                      placeholder="e.g. Bridging the gap between zero-to-one brand storytelling and physical manufacturing."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-serif italic text-[#141413]"
                    />
                  </div>
                </div>
              </div>

              {/* Story Paragraphs */}
              <div className="space-y-4 p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                      Biography Story Paragraphs
                    </h4>
                    <p className="text-xs text-[#64625C]">
                      Rendered sequentially in the main editorial column on /about.
                    </p>
                  </div>
                  <button
                    onClick={addAboutStoryParagraph}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {(site.about?.storyParagraphs || []).map((paragraph, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <span className="font-mono text-xs font-bold text-[#8A8881] pt-3 shrink-0 w-6">
                        0{index + 1}
                      </span>
                      <textarea
                        rows={3}
                        value={paragraph}
                        onChange={(e) => updateAboutStoryParagraph(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs sm:text-sm text-[#141413] leading-relaxed"
                      />
                      <button
                        onClick={() => removeAboutStoryParagraph(index)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 mt-1"
                        title="Delete paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Box & Resume Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Current Status Box
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={site.about?.statusBoxTitle || ""}
                      onChange={(e) => updateSiteAbout("statusBoxTitle", e.target.value)}
                      placeholder="Title (e.g. Current Status)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                    />
                    <textarea
                      rows={3}
                      value={site.about?.statusBoxText || ""}
                      onChange={(e) => updateSiteAbout("statusBoxText", e.target.value)}
                      placeholder="e.g. Accepting select brand identity engagements for Q3/Q4."
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413]"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Resume &amp; Contact CTAs
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={site.about?.resumeButtonText || ""}
                      onChange={(e) => updateSiteAbout("resumeButtonText", e.target.value)}
                      placeholder="CV Button Label"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413]"
                    />
                    <input
                      type="text"
                      value={site.about?.resumeUrl || ""}
                      onChange={(e) => updateSiteAbout("resumeUrl", e.target.value)}
                      placeholder="CV Download URL or File Link"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                    />
                    <input
                      type="text"
                      value={site.about?.contactButtonText || ""}
                      onChange={(e) => updateSiteAbout("contactButtonText", e.target.value)}
                      placeholder="Contact Button Label"
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413]"
                    />
                  </div>
                </div>
              </div>

              {/* Toolchain & Software Fluency */}
              <div className="space-y-4 p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                      Software &amp; Toolchain Fluency
                    </h4>
                    <p className="text-xs text-[#64625C]">
                      Manage tools, software, and your specific roles shown on the About page.
                    </p>
                  </div>
                  <button
                    onClick={addAboutTool}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tool</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(site.about?.toolchain || []).map((tool, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateAboutTool(index, "name", e.target.value)}
                          placeholder="Tool Name"
                          className="w-full font-mono text-xs font-bold text-[#141413] bg-transparent border-b border-transparent focus:border-[#141413] outline-none"
                        />
                        <input
                          type="text"
                          value={tool.role}
                          onChange={(e) => updateAboutTool(index, "role", e.target.value)}
                          placeholder="Application / Role"
                          className="w-full text-xs text-[#5A5852] bg-transparent border-b border-transparent focus:border-[#141413] outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeAboutTool(index)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete tool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. WORK SECTION OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === "work-overview" && (
            <div className="space-y-8">
              <div className="border-b border-[#E5E2DA] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
                    <span className="px-2 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">Anchor: /#work</span>
                    <span>·</span>
                    <span>PORTFOLIO SHOWCASE CATALOG</span>
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
                    Work Section &amp; Case Studies
                  </h2>
                  <p className="text-xs text-[#64625C] pt-1">
                    Manage the work section titles, intro narrative, and the catalog of published case study pages.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={addNewProject}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Case Study</span>
                  </button>
                  <Link
                    href="/#work"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono uppercase bg-[#FAF9F5] border border-[#D5D1C7] hover:bg-[#EAE7DF] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Section</span>
                  </Link>
                </div>
              </div>

              {/* Work Section Intro */}
              <div className="space-y-4 p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  Work Section Heading &amp; Narrative
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      Section Kicker Badge
                    </label>
                    <input
                      type="text"
                      value={site.workSection?.kicker || ""}
                      onChange={(e) => updateSiteWorkSection("kicker", e.target.value)}
                      placeholder="e.g. Core Curated Portfolio"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                      Section Main Title
                    </label>
                    <input
                      type="text"
                      value={site.workSection?.title || ""}
                      onChange={(e) => updateSiteWorkSection("title", e.target.value)}
                      placeholder="e.g. The Four Pillars"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                    Section Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={site.workSection?.description || ""}
                    onChange={(e) => updateSiteWorkSection("description", e.target.value)}
                    placeholder="Short description of the curated case studies..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>
              </div>

              {/* Published Case Studies Catalog */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Published Case Studies ({projects.length})
                  </h4>
                  <span className="text-xs text-[#8A8881]">
                    Click any item to edit its complete page content &amp; video
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {projects.map((p, index) => (
                    <div
                      key={p.slug}
                      className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#D5D1C7]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-bold text-[#8A8881] w-8">
                          {p.pillarNumber || `0${index + 1}`}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-editorial text-lg text-[#141413]">{p.title}</h3>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">
                              {p.status || "Live"}
                            </span>
                            {p.videoData?.url && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <Video className="w-3 h-3" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64625C] line-clamp-1">{p.subtitle}</p>
                          <span className="font-mono text-[10px] text-[#8A8881]">
                            /work/{p.slug} · {p.client}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          href={`/work/${p.slug}`}
                          target="_blank"
                          className="p-2 text-[#8A8881] hover:text-[#141413] transition-colors rounded-lg hover:bg-[#EAE7DF]"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setActiveTab(p.slug)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] transition-colors cursor-pointer"
                        >
                          Edit Page Content
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. CASE STUDY DETAIL PAGE EDITOR (E.G. PILLAR 01-04) */}
          {/* ========================================================= */}
          {selectedProject && (
            <div className="space-y-8">
              {/* Project Header */}
              <div className="border-b border-[#E5E2DA] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
                    <span className="px-2 py-0.5 rounded bg-[#EAE7DF] text-[#64625C]">
                      Route: /work/{selectedProject.slug}
                    </span>
                    <span>·</span>
                    <span>PILLAR {selectedProject.pillarNumber}</span>
                    <span>·</span>
                    <span className="uppercase">{selectedProject.pillarTitle}</span>
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteProject(selectedProject.slug)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete this project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Case Study</span>
                  </button>

                  <Link
                    href={`/work/${selectedProject.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase bg-[#FAF9F5] border border-[#D5D1C7] hover:bg-[#EAE7DF] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Page</span>
                  </Link>
                </div>
              </div>

              {/* COMMERCIAL VIDEO RESULT SHOWCASE (FOR PILLAR 3 & ANY VIDEO CASE STUDY) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#141413] text-[#FAF9F5] space-y-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-editorial text-2xl text-[#FAF9F5]">
                        Commercial Video Result Showcase
                      </h3>
                      <p className="text-xs text-[#A8A29E]">
                        Embed commercial campaign launch films, brand reels, or motion studies.
                      </p>
                    </div>
                  </div>
                  {selectedProject.videoData?.url && (
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Video Active
                    </span>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E]">
                      Video URL (Vimeo, YouTube, or direct .mp4)
                    </label>
                    <input
                      type="url"
                      value={selectedProject.videoData?.url || ""}
                      onChange={(e) =>
                        updateProjectVideo(selectedProject.slug, "url", e.target.value)
                      }
                      placeholder="e.g. https://vimeo.com/76979871 or https://.../video.mp4"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#24221F] border border-[#3E3A34] text-xs font-mono text-[#FAF9F5] focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[11px] text-[#A8A29E]">
                      Tip: Vimeo links provide the cleanest unbranded cinematic player for client showcases.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E]">
                        Video Caption / Director Credits
                      </label>
                      <input
                        type="text"
                        value={selectedProject.videoData?.caption || ""}
                        onChange={(e) =>
                          updateProjectVideo(selectedProject.slug, "caption", e.target.value)
                        }
                        placeholder="e.g. 60-second broadcast commercial spot & digital campaign"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#24221F] border border-[#3E3A34] text-xs text-[#FAF9F5]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E]">
                        Poster Image Path (Fallback)
                      </label>
                      <input
                        type="text"
                        value={selectedProject.videoData?.poster || ""}
                        onChange={(e) =>
                          updateProjectVideo(selectedProject.slug, "poster", e.target.value)
                        }
                        placeholder="/images/poster.jpg or https://..."
                        className="w-full px-4 py-2.5 rounded-lg bg-[#24221F] border border-[#3E3A34] text-xs font-mono text-[#FAF9F5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title, Subtitle, and Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Case Study Title
                  </label>
                  <input
                    type="text"
                    value={selectedProject.title}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "title", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    URL Slug (Route Path)
                  </label>
                  <input
                    type="text"
                    value={selectedProject.slug}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "slug", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-mono text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Pillar Number (e.g. 01, 02, 03, 04)
                  </label>
                  <input
                    type="text"
                    value={selectedProject.pillarNumber}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "pillarNumber", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-mono text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Pillar Category Title
                  </label>
                  <input
                    type="text"
                    value={selectedProject.pillarTitle}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "pillarTitle", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Client / Partner
                  </label>
                  <input
                    type="text"
                    value={selectedProject.client}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "client", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Year &amp; Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={selectedProject.year}
                      onChange={(e) =>
                        updateProjectField(selectedProject.slug, "year", e.target.value)
                      }
                      placeholder="Year"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-mono text-[#141413]"
                    />
                    <input
                      type="text"
                      value={selectedProject.role}
                      onChange={(e) =>
                        updateProjectField(selectedProject.slug, "role", e.target.value)
                      }
                      placeholder="Role"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Subtitle / Value Proposition
                  </label>
                  <input
                    type="text"
                    value={selectedProject.subtitle}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "subtitle", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Cover Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={selectedProject.coverImage}
                    onChange={(e) =>
                      updateProjectField(selectedProject.slug, "coverImage", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm font-mono text-[#141413]"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                  Executive Summary
                </label>
                <textarea
                  rows={3}
                  value={selectedProject.summary}
                  onChange={(e) =>
                    updateProjectField(selectedProject.slug, "summary", e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413] leading-relaxed"
                />
              </div>

              {/* Strategic Overview Fields */}
              <div className="space-y-4 pt-4 border-t border-[#E5E2DA]">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                  Case Study Narrative
                </h3>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                    The Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={selectedProject.overview.challenge}
                    onChange={(e) =>
                      updateProjectOverview(selectedProject.slug, "challenge", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413] leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                    The Strategic Solution
                  </label>
                  <textarea
                    rows={3}
                    value={selectedProject.overview.strategicSolution}
                    onChange={(e) =>
                      updateProjectOverview(
                        selectedProject.slug,
                        "strategicSolution",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413] leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                    The Outcome
                  </label>
                  <textarea
                    rows={2}
                    value={selectedProject.overview.outcome}
                    onChange={(e) =>
                      updateProjectOverview(selectedProject.slug, "outcome", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs text-[#141413] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. NAVIGATION BAR & MENU */}
          {/* ========================================================= */}
          {activeTab === "navigation" && (
            <div className="space-y-8">
              <div className="border-b border-[#E5E2DA] pb-6 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                  Header &amp; Navigation Settings
                </span>
                <h2 className="font-editorial text-3xl text-[#141413]">
                  Navbar Page Tabs
                </h2>
                <p className="text-xs text-[#64625C] pt-1">
                  Add, remove, rename, or reorder the page links that appear in your header navbar and mobile menu.
                </p>
              </div>

              {/* Real-time Header Navbar Visual Preview */}
              <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E2DA] space-y-3 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881] block">
                  Navbar Real-time Preview
                </span>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] flex items-center justify-between overflow-x-auto gap-4">
                  <div className="flex flex-col shrink-0">
                    <span className="font-editorial text-base text-[#141413]">
                      {site.author}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#8A8881]">
                      Creative Direction
                    </span>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    {(site.navLinks || []).map((link) => (
                      <span
                        key={link.id}
                        className="text-xs font-medium text-[#4A4843] hover:text-black cursor-default border-b border-transparent"
                      >
                        {link.label}
                      </span>
                    ))}

                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] uppercase font-semibold rounded-full bg-[#141413] text-[#FAF9F5]">
                      <span>Get in Touch</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141413]">
                    Active Navbar Tabs ({(site.navLinks || []).length})
                  </h4>
                  <button
                    onClick={() => addNavLink("New Page", "/#")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2A26] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Page Tab</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(site.navLinks || []).map((link, index) => (
                    <div
                      key={link.id}
                      className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#D5D1C7]"
                    >
                      {/* Reorder Controls & Index */}
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveNavLink(index, "up")}
                            disabled={index === 0}
                            className="p-1 rounded text-[#8A8881] hover:text-[#141413] hover:bg-[#EAE7DF] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveNavLink(index, "down")}
                            disabled={index === (site.navLinks || []).length - 1}
                            className="p-1 rounded text-[#8A8881] hover:text-[#141413] hover:bg-[#EAE7DF] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#8A8881] w-6">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Inputs: Label & Path */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881]">
                            Tab Title / Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => updateNavLink(link.id, "label", e.target.value)}
                            placeholder="e.g. Work"
                            className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-medium text-[#141413]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A8881]">
                            Link / Destination Path
                          </label>
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => updateNavLink(link.id, "href", e.target.value)}
                            placeholder="e.g. /#work or /about"
                            className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                          />
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeNavLink(link.id)}
                        className="p-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                        title="Remove Tab"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Preset Buttons */}
                <div className="pt-4 border-t border-[#E5E2DA] space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block">
                    Quick Preset Tabs
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "About", href: "/about" },
                      { label: "Services", href: "/#services" },
                      { label: "Press", href: "/press" },
                      { label: "Resume", href: "/about#resume" },
                      { label: "Catalog", href: "/#catalog" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => addNavLink(preset.label, preset.href)}
                        className="px-3 py-1.5 rounded-full text-xs font-mono border border-[#DDD9CE] bg-[#FAF9F5] text-[#5A5852] hover:bg-[#EAE7DF] hover:text-[#141413] transition-colors cursor-pointer"
                      >
                        + Add &ldquo;{preset.label}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. GLOBAL PROFILE SETTINGS */}
          {/* ========================================================= */}
          {activeTab === "site" && (
            <div className="space-y-8">
              <div className="border-b border-[#E5E2DA] pb-6 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
                  Global Profile Settings
                </span>
                <h2 className="font-editorial text-3xl text-[#141413]">
                  Author, Bio &amp; Inquiries
                </h2>
              </div>

              {/* Availability Toggle */}
              <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#141413]">
                    Availability Indicator
                  </h4>
                  <p className="text-xs text-[#64625C] pt-0.5">
                    Displays your live client availability status pill in the header.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={site.availabilityText}
                    onChange={(e) => setSite({ ...site, availabilityText: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-xs font-mono text-[#141413]"
                  />
                  <input
                    type="checkbox"
                    checked={site.availableForProjects}
                    onChange={(e) =>
                      setSite({ ...site, availableForProjects: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#141413] cursor-pointer"
                  />
                </div>
              </div>

              {/* Bio & Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={site.author}
                    onChange={(e) => setSite({ ...site, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Discipline / Role
                  </label>
                  <input
                    type="text"
                    value={site.role}
                    onChange={(e) => setSite({ ...site, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Direct Contact Email
                  </label>
                  <input
                    type="email"
                    value={site.email}
                    onChange={(e) => setSite({ ...site, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                    Location / Working Basis
                  </label>
                  <input
                    type="text"
                    value={site.location}
                    onChange={(e) => setSite({ ...site, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881]">
                  Editorial Positioning Bio
                </label>
                <textarea
                  rows={4}
                  value={site.shortBio}
                  onChange={(e) => setSite({ ...site, shortBio: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413] leading-relaxed"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
