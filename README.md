# @azdias-config
Common `azdias` configurations for web development.

This is a shared development configuration package for any monorepo. It centralizes common tooling configuration (ESLint, Prettier, etc.) so the entire monorepo uses the same standards.

---

## Installing
Inside your monorepo's root:

```sh
git submodule add https://github.com/lucas-azdias/azdias-config.git packages/config
```

### Enabling ESLint
Inside each project, insert the following minimal ESLint config file:

```ts
// eslint.config.ts
import { eslintConfig } from "@azdias/config";
import { Linter } from "eslint";

export default [
    ...eslintConfig,
] as Linter.Config[];
```

---

> [!NOTE]
> You can install the default Prettier configuration files in your project's root for your IDE to automatically format files:
>
> ```sh
> pnpm install-prettier
> ```
>
> This copies `.prettierrc` and `.prettierignore` to the project root, allowing IDEs such as Zed to use the same formatting configuration as the linter.
