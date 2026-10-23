import { defineConfig } from "vite";

// Gemini credentials are deliberately NOT embedded in the client bundle.
// All provider calls run in Vercel Functions under /api.
export default defineConfig({});
