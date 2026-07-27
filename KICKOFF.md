# KICKOFF — iniciar o desenvolvimento do Rumo no Claude Code

Você já criou o repositório no GitHub. Siga:

## 1. Colocar estes arquivos no seu repo
Extraia o conteúdo de `rumo-repo.zip` DENTRO da pasta do seu repositório clonado, depois:
```bash
git add -A
git commit -m "chore: scaffold inicial do Rumo"
git push
```

## 2. Abrir no Claude Code e colar este prompt
> Leia o `CLAUDE.md` e os arquivos em `docs/`. Este é o app **Rumo**: planejador e gestor de viagens, cujo módulo central é o **controle de gastos durante a viagem** (lançamento rápido, multi-moeda, divisão entre pessoas e acerto de contas). O monitor de passagens é secundário.
>
> Comece pelo **MVP** na ordem do `docs/roadmap.md`:
> 1. Faça o scaffold do frontend em `web/`: `npm create vite@latest . -- --template react-ts`, e instale `@supabase/supabase-js @tanstack/react-query react-router-dom` + Tailwind.
> 2. Configure o cliente Supabase (use `.env` a partir de `.env.example`) e Auth por magic link.
> 3. Rode `supabase/schema.sql` no meu projeto Supabase (vou te dar as credenciais) e gere os tipos.
> 4. Implemente **Viagens (CRUD)** e depois a tela de **Gastos** (adicionar em ~3 toques, listar, total) com **divisão** e **acerto de contas**.
> Antes de codar cada bloco, me mostre um plano curto. Priorize velocidade de UX no lançamento de gasto.

## 3. O que você precisa ter em mãos
- Conta no **Supabase** (grátis): crie um projeto, pegue `Project URL` e `anon key` para o `.env`.
- Conta no **Vercel** (grátis) para deploy, quando o MVP rodar.
- Node 18+ instalado.

## 4. Semente de UX
Abra `prototype/index.html` no navegador — é a referência visual e de regras (monitor, roteiro, orçamento, calc. de milhas).
