import { eslintConfig } from "@azdias/config";
import { Linter } from "eslint";

export default [
    ...eslintConfig,
] as Linter.Config[];
