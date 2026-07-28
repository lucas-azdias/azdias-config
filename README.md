# @azdias-config
Common `azdias` configurations for web development.

This is a shared development configuration package for any monorepo. It centralizes common tooling configuration (ESLint, Prettier, etc.) so the entire monorepo uses the same standards.

---

## Installing
Inside your monorepo's root:

```sh
git submodule add https://github.com/lucas-azdias/azdias-config.git packages/config
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
