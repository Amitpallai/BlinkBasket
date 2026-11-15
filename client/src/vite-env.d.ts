/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_server_URL?: string;
  readonly VITE_CURRENCY?: string;
  readonly VITE_DEMO_USER_EMAIL?: string;
  readonly VITE_DEMO_USER_PASSWORD?: string;
  readonly VITE_DEMO_SELLER_EMAIL?: string;
  readonly VITE_DEMO_SELLER_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}