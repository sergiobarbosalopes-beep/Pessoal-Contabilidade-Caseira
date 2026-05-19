# Pessoal - Contabilidade Caseira

Webpage estatica e responsiva para gestao financeira pessoal, com dashboard inicial, navegacao lateral e paginas tematicas.

## Estrutura atual

- `index.html`: dashboard principal com hero, cards, tiles e graficos em mock data
- `cgd.html`: pagina dedicada a Caixa Geral de Depositos
- `novobanco.html`: pagina dedicada a Novo Banco
- `coverflex.html`: pagina dedicada a Coverflex
- `credito-habitacao.html`: pagina dedicada a Credito Habitacao
- `paineis-solares.html`: pagina dedicada a Paineis Solares
- `styles.css`: sistema visual responsivo
- `data.js`: mock data para indicadores
- `app.js`: comportamento da navegacao e renderizacao dos componentes

## Deploy para GitHub Pages

Existe um workflow em `.github/workflows/deploy-pages.yml` que publica automaticamente no GitHub Pages sempre que ha push para `main`.

URL esperado da pagina inicial:

`https://sergiobarbosalopes-beep.github.io/Pessoal-Contabilidade-Caseira/`

## Script para facilitar commit e deploy

Foi criado o script `deploy.ps1` para automatizar:

1. `git add .`
2. `git commit -m <mensagem>`
3. `git push origin main`

Exemplo:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy.ps1 -Message "feat: atualizar dashboard"
```

Quando o push termina, o GitHub Actions trata da publicacao no GitHub Pages.
