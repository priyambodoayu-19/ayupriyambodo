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
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { ProjectItem, SiteMetadata } from "@/data/projects";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("site");
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
            : "Saved successfully to local content store."
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
            Studio CMS
          </span>
        </div>

        <div className="flex items-center gap-3">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#141413] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2C2A26] transition-colors cursor-pointer disabled:opacity-50"
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

      {/* Main CMS Layout with Sidebar Navigation */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-3 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-3 px-3">
            Content Sections
          </span>

          <button
            onClick={() => setActiveTab("site")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
              activeTab === "site"
                ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                : "text-[#5A5852] hover:bg-[#F0EEE8]"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Site Profile &amp; Bio</span>
          </button>

          <div className="pt-4 pb-2 px-3 text-[11px] font-mono uppercase tracking-wider text-[#8A8881]">
            The 4 Pillars
          </div>

          {projects.map((p) => {
            const icons = {
              nidhi: <Sparkles className="w-4 h-4 shrink-0" />,
              "packaging-production": <Box className="w-4 h-4 shrink-0" />,
              "art-direction-campaign": <Film className="w-4 h-4 shrink-0" />,
              "editorial-decks": <FileText className="w-4 h-4 shrink-0" />,
            };

            return (
              <button
                key={p.slug}
                onClick={() => setActiveTab(p.slug)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                  activeTab === p.slug
                    ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                    : "text-[#5A5852] hover:bg-[#F0EEE8]"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  {icons[p.slug as keyof typeof icons] || <Box className="w-4 h-4" />}
                  <span className="truncate">{p.title}</span>
                </div>
                <span className="font-mono text-[10px] opacity-70 shrink-0">P{p.pillarNumber}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content Editor */}
        <main className="lg:col-span-9 bg-[#F4F2EC] border border-[#E5E2DA] rounded-2xl p-6 sm:p-10 space-y-10">
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

          {selectedProject && (
            <div className="space-y-8">
              {/* Project Header */}
              <div className="border-b border-[#E5E2DA] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
                    <span>PILLAR {selectedProject.pillarNumber}</span>
                    <span>·</span>
                    <span className="uppercase">{selectedProject.pillarTitle}</span>
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
                    {selectedProject.title}
                  </h2>
                </div>

                <Link
                  href={`/work/${selectedProject.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#141413] hover:underline self-start sm:self-auto"
                >
                  <span>Preview Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* SPECIAL SECTION FOR PILLAR 3: COMMERCIAL VIDEO RESULT SHOWCASE */}
              {selectedProject.slug === "art-direction-campaign" && (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#141413] text-[#FAF9F5] space-y-6 shadow-md">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-editorial text-2xl text-[#FAF9F5]">
                        Commercial Video Result Showcase
                      </h3>
                      <p className="text-xs text-[#A8A29E]">
                        Featured commercial launch film directed by Ayu Priyambodo.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E]">
                        Video URL (Direct MP4, Vimeo, or YouTube)
                      </label>
                      <input
                        type="url"
                        value={selectedProject.videoData?.url || ""}
                        onChange={(e) =>
                          updateProjectVideo(selectedProject.slug, "url", e.target.value)
                        }
                        placeholder="e.g. https://vimeo.com/123456789 or https://.../video.mp4"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#24221F] border border-[#3E3A34] text-xs font-mono text-[#FAF9F5] focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[11px] text-[#A8A29E]">
                        Paste a Vimeo link (recommended for commercial reels), a YouTube link, or a direct .mp4 file.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E]">
                          Video Caption / Credits
                        </label>
                        <input
                          type="text"
                          value={selectedProject.videoData?.caption || ""}
                          onChange={(e) =>
                            updateProjectVideo(selectedProject.slug, "caption", e.target.value)
                          }
                          className="w-full px-4 py-2.5 rounded-lg bg-[#24221F] border border-[#3E3A34] text-xs text-[#FAF9F5]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E]">
                          Poster / Fallback Image Path
                        </label>
                        <input
                          type="text"
                          value={selectedProject.videoData?.poster || ""}
                          onChange={(e) =>
                            updateProjectVideo(selectedProject.slug, "poster", e.target.value)
                          }
                          className="w-full px-4 py-2.5 rounded-lg bg-[#24221F] border border-[#3E3A34] text-xs font-mono text-[#FAF9F5]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

                <div className="space-y-2">
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
        </main>
      </div>
    </div>
  );
}
