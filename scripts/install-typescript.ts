import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

import { root } from "../src/root.ts";

const outputDir = process.argv[2];

if (!outputDir) {
    throw new Error("Usage: tsx install-typescript.ts <output-directory>");
}

const path = import.meta.dirname;

const destination = join(root, outputDir);

mkdirSync(destination, { recursive: true });

const files = [
    "../typescript/tsconfig.json",
    "../typescript/tsconfig.app.json",
    "../typescript/tsconfig.node.json",
];

for (const file of files) {
    const source = join(path, file);
    const target = join(destination, basename(file));

    copyFileSync(source, target);

    const fromTargetToRoot = relative(dirname(target), root).replaceAll("\\", "/") || ".";

    const fromRootToPath = relative(root, path).replaceAll("\\", "/");

    const replacement = fromRootToPath
        ? `${fromTargetToRoot}/${fromRootToPath}`
        : fromTargetToRoot;

    const content = readFileSync(target, "utf-8").replaceAll("$/", `${replacement}/`);

    writeFileSync(target, content);
}
