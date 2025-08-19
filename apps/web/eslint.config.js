import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      ".react-router/**",
      "tailwind.config.ts",
      "routes/+types/*",
    ],
  },
  { files: ["**/*.{js,jsx,ts,tsx}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ".",
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-leaked-render": ["warn", { validStrategies: ["ternary"] }],
      "react/jsx-boolean-value": ["error", "never"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type", // Type imports last
          ],
          pathGroups: [
            {
              pattern: "~/**",
              group: "internal",
            },
          ],
          "newlines-between": "always",
          distinctGroup: false,
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
        },
      ],
      "import/no-unresolved": "error",
      "import/newline-after-import": "error",
    },
  },
];
