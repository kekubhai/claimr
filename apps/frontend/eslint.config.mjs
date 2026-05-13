import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow explicit `any` as a warning instead of failing the build
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow decorative `//`-style labels in JSX content
      "react/jsx-no-comment-textnodes": "off",
      // Do not fail builds on simple quote usage inside JSX text
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;
