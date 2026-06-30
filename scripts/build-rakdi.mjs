import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "rakdi", "index.html");
const cssPath = path.join(root, "rakdi", "styles.css");
const outputPath = path.join(root, "rakdi", "wordpress-content.html");

let html = await readFile(pagePath, "utf8");
const css = await readFile(cssPath, "utf8");

// Strip HTML wrapper tags for WordPress Custom HTML block
html = html
  .replace(/<!doctype html>[\s\S]*?<body>/i, "")
  .replace(/<\/body>[\s\S]*?<\/html>\s*$/i, "")
  .replace(/<link[^>]+styles\.css[^>]*>\s*/i, "")
  .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>\s*/gi, "")
  .replace(/<link[^>]+fonts\.gstatic\.com[^>]*>\s*/gi, "");

const content = [
  "<!-- wp:html -->",
  `<style>${css}</style>`,
  html.trim(),
  "<!-- /wp:html -->",
  "",
].join("\n");

await writeFile(outputPath, content, "utf8");
console.log(`Successfully compiled new RAKDI content to: ${outputPath}`);
