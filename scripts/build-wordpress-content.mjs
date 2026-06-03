import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "suriya-ebci-work", "index.html");
const cssPath = path.join(root, "suriya-ebci-work", "styles.css");
const dataPath = path.join(root, "suriya-ebci-work", "data.js");
const outputPath = path.join(root, "suriya-ebci-work", "wordpress-content.html");

let html = await readFile(pagePath, "utf8");
const css = await readFile(cssPath, "utf8");
const data = await readFile(dataPath, "utf8");

html = html
  .replace(/<!doctype html>[\s\S]*?<body>/i, "")
  .replace(/<\/body>[\s\S]*?<\/html>\s*$/i, "")
  .replace(/<link[^>]+styles\.css[^>]*>\s*/i, "")
  .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>\s*/gi, "")
  .replace(/<link[^>]+fonts\.gstatic\.com[^>]*>\s*/gi, "")
  .replace(/<script src="\.\/data\.js" defer><\/script>\s*/i, "")
  .replace(/<script defer>/i, "<script>")
  .replace(/window\.addEventListener\("DOMContentLoaded", \(\) => \{/, `${data}\nwindow.addEventListener("DOMContentLoaded", () => {`);

const content = [
  "<!-- wp:html -->",
  `<style>${css}</style>`,
  html.trim(),
  "<!-- /wp:html -->",
  "",
].join("\n");

await writeFile(outputPath, content, "utf8");
console.log(outputPath);
