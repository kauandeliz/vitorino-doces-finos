import { cp, mkdir, rm, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "03_landing_page");
const output = path.join(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const template = path.join(output, "export_template.html");
const index = path.join(output, "index.html");

if (!existsSync(template)) {
  throw new Error("03_landing_page/export_template.html não foi encontrado.");
}

await copyFile(template, index);
console.log("Cloudflare build pronto em dist/.");
