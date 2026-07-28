import { copyFileSync } from "node:fs";
import { join } from "node:path";

import { root } from "../src/root.ts";

copyFileSync(".prettierignore", join(root, ".prettierignore"));
copyFileSync(".prettierrc", join(root, ".prettierrc"));
