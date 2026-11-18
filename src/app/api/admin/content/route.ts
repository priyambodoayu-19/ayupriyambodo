import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { ProjectItem, SiteMetadata } from "@/data/projects";
import { getLiveProjects, getLiveSite } from "@/data/content-store";

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
    const [site, projects] = await Promise.all([
      getLiveSite(),
      getLiveProjects(),
    ]);

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
    const siteJson = JSON.stringify(site, null, 2);
    const projectsJson = JSON.stringify(projects, null, 2);

    // 1. Save directly to Vercel Blob (syncs live to CDN across the entire internet)
    try {
      await Promise.all([
        put("site.json", siteJson, { access: "public", addRandomSuffix: false, allowOverwrite: true }),
        put("projects.json", projectsJson, { access: "public", addRandomSuffix: false, allowOverwrite: true }),
      ]);
      savedTarget = "vercel_blob";
    } catch (blobErr) {
      console.warn("Vercel Blob write error:", blobErr);
    }

    // 2. Also save to local filesystem (works in dev and serverful runtime)
    try {
      await fs.mkdir(CONTENT_DIR, { recursive: true });
      await fs.writeFile(SITE_FILE, siteJson, "utf-8");
      await fs.writeFile(PROJECTS_FILE, projectsJson, "utf-8");
      if (savedTarget === "vercel_blob") {
        savedTarget = "vercel_blob_and_disk";
      }
    } catch {
      // expected on read-only serverless
    }

    // 3. Optional: GitHub commit if GITHUB_TOKEN exists
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
          siteJson,
          "cms: update site profile and metadata"
        );
        await updateGitHubFile(
          "src/content/projects.json",
          projectsJson,
          "cms: update project pillars and video configuration"
        );
        savedTarget = `${savedTarget}_and_github`;
      } catch (ghErr) {
        console.error("GitHub API commit error:", ghErr);
      }
    }

    // 4. Instantly purge & revalidate Next.js cache for all live pages
    try {
      revalidatePath("/", "layout");
      revalidatePath("/about");
      revalidatePath("/work/[slug]", "page");
    } catch (revErr) {
      console.warn("Revalidate path warning:", revErr);
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
