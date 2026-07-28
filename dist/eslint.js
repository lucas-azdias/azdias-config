import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import css from "@eslint/css";
import js from "@eslint/js";
import markdown from "@eslint/markdown";
import html from "@html-eslint/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin";
import simpleImport from "eslint-plugin-import";
import jsonc from "eslint-plugin-jsonc";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import yml from "eslint-plugin-yml";
import globals from "globals";
import tseslint from "typescript-eslint";
import { Linter } from "eslint";
import { globalIgnores } from "eslint/config";
const root = resolve(import.meta.dirname, "../../../");
export const ignorePatterns = await (async (files) => {
    const patterns = await Promise.all(files.map(async (file) => {
        try {
            return (await readFile(resolve(root, file), "utf8"))
                .split(/\r?\n/)
                .map(line => line.replace(/\s*#.*$/, "").trim())
                .filter(Boolean);
        }
        catch {
            return [];
        }
    }));
    return [...new Set(patterns.flat())];
})([".gitignore", ".prettierignore"]);
export const filePatterns = {
    text: "**/*.txt",
    markdown: "**/*.md",
    yml: "**/*.{yml,yaml}",
    json: "**/*.{json,jsonc,json5,prettierrc}",
    html: "**/*.html",
    css: "**/*.css",
    tailwind: "**/*.tailwind.css",
    script: "**/*.{js,jsx,ts,tsx}",
};
export const config = [
    globalIgnores(ignorePatterns),
    {
        files: ["**/*"],
        ignores: Object.values(filePatterns).flat(),
        rules: {
            "no-restricted-syntax": ["error", {
                    selector: "Program",
                    message: "This file type is not allowed in this project.",
                }],
        },
    },
    globalIgnores([filePatterns.text]),
    ...markdown.configs.recommended.map(cfg => ({
        ...cfg,
        files: [filePatterns.markdown],
        language: "markdown/gfm",
    })),
    ...yml.configs.standard.map(cfg => ({
        ...cfg,
        files: [filePatterns.yml],
        rules: {
            ...cfg.rules,
            "yml/indent": ["error", 4, {
                    indentBlockSequences: true,
                    indicatorValueIndent: 2,
                    alignMultilineFlowScalars: true,
                }],
            "yml/block-mapping-colon-indicator-newline": ["error", "never"],
            "yml/block-mapping": ["error", "always"],
        },
    })),
    ...jsonc.configs["recommended-with-jsonc"].map(cfg => ({
        ...cfg,
        files: [filePatterns.json],
        rules: {
            ...cfg.rules,
            "jsonc/key-name-casing": "off",
            "jsonc/sort-keys": "off",
        },
    })),
    {
        files: [filePatterns.html],
        plugins: {
            "@html-eslint": html,
        },
        rules: {
            ...html.configs["flat/recommended"].rules,
            "@html-eslint/no-extra-spacing-tags": ["error", {
                    enforceBeforeSelfClose: true,
                    disallowMissing: true,
                    disallowTabs: true,
                    disallowInAssignment: true,
                }],
            "@html-eslint/require-closing-tags": ["error", {
                    selfClosing: "always",
                }],
            "@html-eslint/attrs-newline": ["error", {
                    maxLen: 120,
                    closeStyle: "newline",
                    inline: ["$inline", "meta", "link"],
                }],
        },
        language: "@html-eslint/html",
    },
    {
        ...css.configs.recommended,
        files: [filePatterns.css],
        ignores: [filePatterns.tailwind],
        plugins: {
            css: css,
        },
        language: "css/css",
    },
    globalIgnores([filePatterns.tailwind]),
    ...tseslint.configs.strictTypeChecked.map(cfg => ({
        ...cfg,
        files: [filePatterns.script],
    })),
    ...tseslint.configs.stylisticTypeChecked.map(cfg => ({
        ...cfg,
        files: [filePatterns.script],
    })),
    {
        ...(({ parserOptions: _, ...rest }) => rest)(react.configs.recommended),
        files: [filePatterns.script],
        languageOptions: {
            ecmaVersion: 2024,
            parserOptions: {
                projectService: true,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2024,
                ...globals.node,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        plugins: {
            react: react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "@stylistic": stylistic,
            import: simpleImport,
            perfectionist: perfectionist,
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["off"],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            "react/react-in-jsx-scope": "off",
            ...reactHooks.configs.recommended.rules,
            ...reactRefresh.configs.vite.rules,
            ...stylistic.configs.recommended.rules,
            "@stylistic/semi": ["error", "always"],
            "@stylistic/no-extra-semi": "error",
            "@stylistic/quotes": ["error", "double", { avoidEscape: false }],
            "@stylistic/indent": ["error", 4],
            "@stylistic/indent-binary-ops": ["error", 4],
            "@stylistic/jsx-indent-props": ["error", 4],
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/eol-last": ["error", "always"],
            "@stylistic/comma-dangle": ["error", {
                    arrays: "always-multiline",
                    objects: "always-multiline",
                    imports: "always-multiline",
                    exports: "always-multiline",
                    functions: "never",
                }],
            "@stylistic/comma-spacing": ["error", { before: false, after: true }],
            "@stylistic/max-len": ["error", {
                    code: 120,
                    tabWidth: 4,
                    ignoreComments: true,
                    ignoreUrls: true,
                }],
            "@stylistic/quote-props": ["error", "as-needed"],
            "@stylistic/padding-line-between-statements": ["error", {
                    blankLine: "always",
                    prev: "export",
                    next: "*",
                }],
            "import/no-duplicates": "error",
            "import/no-cycle": "error",
            "import/no-self-import": "error",
            "import/no-absolute-path": "error",
            "import/no-useless-path-segments": "error",
            "import/first": "error",
            "import/newline-after-import": ["error", {
                    count: 1,
                }],
            "perfectionist/sort-imports": ["error", {
                    type: "alphabetical",
                    order: "asc",
                    fallbackSort: { type: "line-length", order: "desc" },
                    internalPattern: ["^@/.+", "^!/.+", "^\\+.+/.+"],
                    sortSideEffects: true,
                    newlinesBetween: 1,
                    newlinesInside: 0,
                    groups: [
                        "default-builtin",
                        { newlinesBetween: 0 },
                        "named-builtin",
                        { newlinesBetween: 0 },
                        "type-builtin",
                        "default-external",
                        { newlinesBetween: 0 },
                        "named-external",
                        { newlinesBetween: 0 },
                        "type-external",
                        "default-internal",
                        { newlinesBetween: 0 },
                        "named-internal",
                        { newlinesBetween: 0 },
                        "type-internal",
                        "named-style",
                        "side-effect-style",
                        "side-effect",
                    ],
                }],
            "perfectionist/sort-named-imports": ["error", {
                    groups: ["value-import", "type-import"],
                    type: "alphabetical",
                    order: "asc",
                    fallbackSort: { type: "line-length", order: "desc" },
                }],
        },
    },
];
//# sourceMappingURL=eslint.js.map