import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/data/**",
      "**/*.map",
    ],
  },

  js.configs.recommended,

  // TypeScript base (NOT the super strict unsafe set)
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // Use eslint-specific tsconfigs so ESLint can "see" config/test files
        project: [
          "./server/tsconfig.eslint.json",
          "./sdk/tsconfig.eslint.json",
        ],
        tsconfigRootDir: import.meta.dirname,
        noWarnOnMultipleProjects: true,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "./server/tsconfig.eslint.json",
            "./sdk/tsconfig.eslint.json",
          ],
        },
      },
    },
    rules: {
      // high-signal rules (worth it)
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // avoid style bikeshedding
      "@typescript-eslint/consistent-type-definitions": "off",

      // avoid take-home pain (turn off unsafe family)
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",

      // import hygiene (light)
      "import/no-duplicates": "warn",
    },
  },

  // Tests: relax further
  {
    files: ["**/*.test.ts", "**/test/**/*.ts", "**/src/test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-misused-promises": "off",
    },
  },

  // Prettier: disable conflicting formatting rules
  prettier,
];
