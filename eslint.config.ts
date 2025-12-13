import js from "@eslint/js"
import pluginRouter from "@tanstack/eslint-plugin-router"
import prettier from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
    globalIgnores(["src/proto", "eslint.config.ts", "vite.config.ts"]),
    ...pluginRouter.configs["flat/recommended"],
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            // reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
            prettier,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ["./tsconfig.app.json"],
            },
        },
        rules: {},
    },
])
