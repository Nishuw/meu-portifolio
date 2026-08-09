/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Chave de acesso do Web3Forms para envio do formulário de contato por e-mail. */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
