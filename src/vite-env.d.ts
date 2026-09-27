/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEPLOY_TARGET?: string;
  readonly GTIH_SDK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
