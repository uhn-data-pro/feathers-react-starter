import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(["dist/**/*", "static/**/*", "lib/**/*", "node_modules/**/*"]),
  {
    extends: fixupConfigRules(compat.extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
    )),

    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      "unused-imports": unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },

      ecmaVersion: 2018,
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },

    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },

    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "never"],
      "eol-last": ["error", "always"],

      "no-multiple-empty-lines": ["error", {
        max: 2,
        maxEOF: 0,
      }],

      "unused-imports/no-unused-imports": "error",

      "import/order": ["error", {
        groups: ["builtin", "external", ["index", "sibling", "parent", "internal"], "type"],

        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },

        "newlines-between": "always",
      }],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
    },
  },
]);