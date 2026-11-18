import fs from "fs/promises";
import path from "path";
import { DEFAULT_PROJECTS, DEFAULT_SITE_METADATA, ProjectItem, SiteMetadata } from "./projects";
import siteFallback from "@/content/site.json";
import projectsFallback from "@/content/projects.json";

const BLOB_URL_SITE = "https://1n8uakqvaovjoz1v.public.blob.vercel-storage.com/site.json";
const BLOB_URL_PROJECTS = "https://1n8uakqvaovjoz1v.public.blob.vercel-storage.com/projects.json";

export async function getLiveSite(): Promise<SiteMetadata> {
  // 1. Fetch from Vercel Blob (syncs immediately across all environments)
  try {
    const res = await fetch(BLOB_URL_SITE, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.author) {
        return data;
      }
    }
  } catch {
    // fallback to local disk
  }

  // 2. Local disk read (for offline development)
  try {
    const filePath = path.join(process.cwd(), "src", "content", "site.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && parsed.author) {
      return parsed;
    }
  } catch {
    // fallback to static bundled JSON
  }

  return (siteFallback as unknown as SiteMetadata) || DEFAULT_SITE_METADATA;
}

export async function getLiveProjects(): Promise<ProjectItem[]> {
  // 1. Fetch from Vercel Blob
  try {
    const res = await fetch(BLOB_URL_PROJECTS, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // fallback to local disk
  }

  // 2. Local disk read (for offline development)
  try {
    const filePath = path.join(process.cwd(), "src", "content", "projects.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback to static bundled JSON
  }

  return (projectsFallback as unknown as ProjectItem[]) || DEFAULT_PROJECTS;
}
