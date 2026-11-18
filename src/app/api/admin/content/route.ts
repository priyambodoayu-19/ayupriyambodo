import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { DEFAULT_PROJECTS, DEFAULT_SITE_METADATA, ProjectItem, SiteMetadata } from "@/data/projects";

const COOKIE_NAME = "ayu_admin_session";
const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const SITE_FILE = path.join(CONTENT_DIR, "site.json");
const PROJECTS_FILE = path.join(CONTENT_DIR, "projects.json");

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === "authorized_session";
}

export async function GET() {
  try {
    let site: SiteMetadata = DEFAULT_SITE_METADATA;
    let projects: ProjectItem[] = DEFAULT_PROJECTS;

    try {
      const siteRaw = await fs.readFile(SITE_FILE, "utf-8");
      site = JSON.parse(siteRaw);
    } catch {
      // fallback to default
    }

    try {
      const projectsRaw = await fs.readFile(PROJECTS_FILE, "utf-8");
      projects = JSON.parse(projectsRaw);
    } catch {
      // fallback to default
    }

    return NextResponse.json({ site, projects });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read content data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const isAuthorized = await checkAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { site, projects } = body as { site: SiteMetadata; projects: ProjectItem[] };

    if (!site || !projects) {
      return NextResponse.json(
        { error: "Missing required site or projects payload" },
        { status: 400 }
      );
    }

    let savedTarget = "local_disk";

    // 1. Always attempt local file write (works in dev and serverful runtime)
    try {
      await fs.mkdir(CONTENT_DIR, { recursive: true });
      await fs.writeFile(SITE_FILE, JSON.stringify(site, null, 2), "utf-8");
      await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Filesystem write warning:", fsErr);
    }

    // 2. If GITHUB_TOKEN is available, commit to GitHub repository
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || "priyambodoayu-19/ayupriyambodo";

    if (githubToken) {
      try {
        const updateGitHubFile = async (filePath: string, content: string, message: string) => {
          const url = `https://api.github.com/repos/${githubRepo}/contents/${filePath}`;
          const headers = {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "AyuPriyambodo-CMS",
          };

          // Get current file sha
          const getRes = await fetch(url, { headers });
          let sha: string | undefined;
          if (getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
          }

          const encoded = Buffer.from(content).toString("base64");
          const putRes = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify({
              message,
              content: encoded,
              sha,
              branch: "main",
            }),
          });

          return putRes.ok;
        };

        await updateGitHubFile(
          "src/content/site.json",
          JSON.stringify(site, null, 2),
          "cms: update site profile and metadata"
        );
        await updateGitHubFile(
          "src/content/projects.json",
          JSON.stringify(projects, null, 2),
          "cms: update project pillars and video configuration"
        );

        savedTarget = "github_and_disk";
      } catch (ghErr) {
        console.error("GitHub API commit error:", ghErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Content successfully updated and saved.",
      savedTarget,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
