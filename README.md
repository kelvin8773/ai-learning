# Learnig AI with Deepseek and Copilot

This repo contains a small React + Vite app that demos DeepSeek chat integration.

## Tailwind CSS setup

Tailwind config and PostCSS files were added. To enable Tailwind locally:

1. Install dependencies:

```bash
npm install
```

2. The `postinstall` script runs the Tailwind CLI to generate CSS; you can also run manually:

```bash
npx tailwindcss -i ./src/index.css -o ./src/tailwind-output.css --minify
```

3. Import the generated CSS (`src/tailwind-output.css`) or `src/index.css` in your entry point (the project already imports `src/index.css`).

Run the dev server:

```bash
npm run dev
```

