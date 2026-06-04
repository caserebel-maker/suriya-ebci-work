import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataJsonPath = path.join(root, "suriya-ebci-work", "data.json");
const dataJsPath = path.join(root, "suriya-ebci-work", "data.js");

try {
  const jsonContent = await readFile(dataJsonPath, "utf8");
  // Validate that it is valid JSON before compiling
  JSON.parse(jsonContent);

  const jsContent = `window.SURIYA_EBCI_WORK = ${jsonContent.trim()};\n`;
  await writeFile(dataJsPath, jsContent, "utf8");
  console.log("Successfully compiled data.json to data.js!");
} catch (error) {
  console.error("Compilation failed:", error);
  process.exit(1);
}
