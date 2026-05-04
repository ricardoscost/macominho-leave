# LeaveFlow

Aplicação web para gestão de férias, folgas e faltas com React + TypeScript + Tailwind + Supabase.

## Stack
- React + TypeScript
- Tailwind CSS (base preparada para componentes shadcn/ui)
- Supabase (Auth + PostgreSQL + RLS)

## Setup
1. Copiar `.env.example` para `.env` e preencher:
```bash
cp .env.example .env
```
2. Instalar dependências e correr:
```bash
npm install
npm run dev
```
3. No Supabase SQL Editor, executar `supabase/schema.sql`.

## Estrutura
- `src/components`: UI reutilizável
- `src/pages`: páginas (login, dashboard)
- `src/services`: regras de negócio e validações de pedidos
- `src/hooks`: hooks de sessão
- `src/types`: contratos de dados
- `src/lib`: cliente Supabase e utilitários
- `supabase/schema.sql`: schema completo, RLS e seed inicial

## Evolução futura
- Contagem de dias úteis/feriados
- Notificações
- Múltiplas equipas/departamentos
- Exportações

## Deploy (evitar erro 404/NOT_FOUND)
Para deploy em plataformas com SPA routing:

- **Vercel**: já incluído `vercel.json` com rewrite global para `index.html`.
- **Netlify**: já incluído `netlify.toml` com redirect `/* -> /index.html`.

Isto evita erros `404: NOT_FOUND` ao abrir rotas do React Router diretamente.
