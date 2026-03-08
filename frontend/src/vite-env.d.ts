/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_ENABLE_CHAT_ASSISTANT: string;
  readonly VITE_ENABLE_AI_EXPLANATIONS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
