# Portfólio — Ryan Nishikawa

Portfólio pessoal de Ryan Nishikawa, desenvolvedor focado em Python, automação e Inteligência Artificial (agentes com LLMs, sistemas RAG, APIs e integrações corporativas).

Site editorial, minimalista e majoritariamente branco, com tipografia serifada de destaque, grade fluida de projetos, páginas dedicadas por projeto, visualizador de galeria (lightbox) e formulário de contato validado.

## Stack

- **Vite 5** + **React 18** + **TypeScript**
- **React Router** (SPA)
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **react-hook-form** + **zod** (validação de formulários)
- **lucide-react** (ícones) · **sonner** (toasts)

## Estrutura

```
src/
├── pages/          # ProjectIndex (home/listagem), Project, About, Contact, NotFound
├── components/     # Navbar, FloatingNav, Lightbox, e componentes shadcn em ui/
├── hooks/          # useSEO (metatags dinâmicas por rota) e outros
├── data/           # projects.ts — fonte única dos projetos
└── assets/         # imagens dos projetos
```

## Desenvolvimento

Requer Node.js e npm.

```sh
npm install
npm run dev
```

O servidor sobe em `http://localhost:8080`.

### Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — pré-visualização do build
- `npm run lint` — análise estática com ESLint

## Envio de e-mail no formulário de contato

O formulário em `/contact` envia e-mails via [Web3Forms](https://web3forms.com). Para ativar, crie um arquivo `.env` na raiz:

```sh
VITE_WEB3FORMS_KEY=sua_chave_de_acesso
```

Sem a chave configurada, o formulário faz fallback automático para `mailto:`, abrindo o app de e-mail do visitante com a mensagem pré-preenchida.

## Deploy

Por ser um SPA, configure o host para servir `index.html` em todas as rotas (fallback), garantindo que rotas como `/about`, `/contact` e `/project/:id` funcionem em acesso direto.
