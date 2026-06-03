import { readFile } from "node:fs/promises";
import path from "node:path";

const {
  WP_SITE_URL = "https://ebcinext.com",
  WP_USERNAME,
  WP_APP_PASSWORD,
} = process.env;

if (!WP_USERNAME || !WP_APP_PASSWORD) {
  throw new Error("Missing WP_USERNAME or WP_APP_PASSWORD");
}

const root = process.cwd();
const contentPath = path.join(root, "suriya-ebci-work", "wordpress-content.html");
const content = await readFile(contentPath, "utf8");
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

const slug = "suriya-ebci-work";
const existing = await wp(`pages?slug=${encodeURIComponent(slug)}&status=any`);
const payload = {
  title: "Suriya EBCI Work Report",
  slug,
  status: "publish",
  content,
};

const page = Array.isArray(existing) && existing.length
  ? await wp(`pages/${existing[0].id}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  : await wp("pages", {
      method: "POST",
      body: JSON.stringify(payload),
    });

console.log(page.link || `${baseUrl}/${slug}/`);
