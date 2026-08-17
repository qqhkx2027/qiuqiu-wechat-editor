import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "dist", "client");
const prefix = "/qiuqiu-wechat-editor";
const textExtensions = new Set([".html", ".js", ".css", ".json", ".rsc"]);

async function walk(dir) {
  for (const name of await readdir(dir)) {
    const file = join(dir, name);
    const info = await stat(file);
    if (info.isDirectory()) await walk(file);
    else if (textExtensions.has(name.slice(name.lastIndexOf(".")))) {
      let content = await readFile(file, "utf8");
      content = content
        .replaceAll('"/_next/', `"${prefix}/_next/`)
        .replaceAll("'/_next/", `'${prefix}/_next/`)
        .replaceAll('"/favicon.svg"', `"${prefix}/favicon.svg"`)
        .replaceAll("'/favicon.svg'", `'${prefix}/favicon.svg'`);
      await writeFile(file, content);
    }
  }
}

await walk(root);
