/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_ASSETS_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
