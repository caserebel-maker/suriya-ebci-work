import { readFile } from "node:fs/promises";
import path from "node:path";

// Helper to load environment variables from .env and .env.local
async function loadEnv() {
  const root = process.cwd();
  for (const filename of [".env", ".env.local"]) {
    try {
      const content = await readFile(path.join(root, filename), "utf8");
      for (const line of content.split("\n")) {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          process.env[key] = val;
        }
      }
    } catch (e) {
      // Ignore if file doesn't exist
    }
  }
}

await loadEnv();

const {
  WP_SITE_URL = "https://ebcinext.com",
  WP_USERNAME,
  WP_APP_PASSWORD,
} = process.env;

if (!WP_USERNAME || !WP_APP_PASSWORD) {
  console.error("❌ Error: Missing WP_USERNAME or WP_APP_PASSWORD in .env or .env.local");
  process.exit(1);
}

const baseUrl = WP_SITE_URL.replace(/\/+$/, "");
const auth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64");

async function wp(pathname, options = {}) {
  const response = await fetch(`${baseUrl}/wp-json/wp/v2/${pathname}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new Error(`WordPress API ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
}

try {
  console.log("Fetching original 'rakdi' page content...");
  // Fetch existing rakdi page with context=edit to get the raw content (including Gutenberg blocks)
  const existingSourceList = await wp("pages?slug=rakdi&status=any&context=edit");
  if (!Array.isArray(existingSourceList) || existingSourceList.length === 0) {
    throw new Error("Could not find the original page with slug 'rakdi'. Make sure it exists.");
  }

  const sourcePage = existingSourceList[0];
  const sourceContent = sourcePage.content.raw || sourcePage.content.rendered;

  console.log(`Original content fetched. Publishing backup to page 'rakdi26'...`);

  const slug = "rakdi26";
  const existingBackupList = await wp(`pages?slug=${encodeURIComponent(slug)}&status=any`);

  const payload = {
    title: "RAKDI Backup (rakdi26)",
    slug,
    status: "publish",
    content: sourceContent,
  };

  let page;
  if (Array.isArray(existingBackupList) && existingBackupList.length > 0) {
    console.log(`Updating existing backup page (ID: ${existingBackupList[0].id})...`);
    page = await wp(`pages/${existingBackupList[0].id}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } else {
    console.log("Creating a new backup page...");
    page = await wp("pages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  console.log(`\n🎉 Backup successfully published to WordPress!`);
  console.log(`URL: ${page.link || `${baseUrl}/${slug}/`}`);
} catch (error) {
  console.error("❌ Backup failed:", error.message);
  process.exit(1);
}
