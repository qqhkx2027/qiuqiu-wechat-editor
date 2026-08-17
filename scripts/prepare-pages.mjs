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
        // Vinext's runtime keeps lazy chunk paths without a leading slash and
        // prepends `/` at runtime. On a project Pages site that would escape
        // the repository path, so teach the runtime to include the prefix.
        .replaceAll(
          "Vc=function(e){return`/`+e}",
          `Vc=function(e){return\`${prefix}/\`+e}`,
        )
        .replaceAll('"/favicon.svg"', `"${prefix}/favicon.svg"`)
        .replaceAll("'/favicon.svg'", `'${prefix}/favicon.svg'`);
      await writeFile(file, content);
    }
  }
}

await walk(root);
