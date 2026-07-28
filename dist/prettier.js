import { resolveConfig } from "prettier";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "../../../");
const baseConfig = (await resolveConfig(resolve(root, ".prettierrc"))) ?? {};
export const config = {
    ...baseConfig,
};
//# sourceMappingURL=prettier.js.map