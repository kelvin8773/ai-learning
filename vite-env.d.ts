/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Required API Configuration
  readonly VITE_OPENAI_API_KEY: string;
  
  // Optional API Configuration
  readonly VITE_DEEPSEEK_API_URL?: string;
  readonly VITE_DEFAULT_MODEL?: string;
  
  // Optional App Configuration
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  
  // Development Configuration
  readonly VITE_DEV_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}