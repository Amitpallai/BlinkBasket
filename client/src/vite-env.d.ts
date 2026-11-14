/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_server_URL?: string;
  readonly VITE_CURRENCY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}