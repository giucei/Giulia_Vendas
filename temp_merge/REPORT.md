
# Relatório Técnico do Projeto Giulia_Vendas

## Arquitetura

```
[Usuário] ⇄ [Frontend (HTML/JS)] ⇄ [API FastAPI] ⇄ [SQLite]
```

**Fluxo:**
1. Usuário faz requisição (ex: adicionar produto, buscar lista).
2. Frontend envia requisição para API FastAPI.
3. FastAPI processa, valida, usa SQLite para persistência.
4. Resposta JSON é devolvida ao frontend.

## Tecnologias e Versões
- Python 3.11+
- FastAPI (backend REST)
- SQLite (banco de dados)
- Faker (seed de dados)
- JavaScript (ES6+), HTML5, CSS3
- VS Code (extensões: Python, Thunder Client, Copilot)
- Copilot sugeriu: uso de Pydantic, validações, endpoints REST, seed com Faker, acessibilidade no front, filtros JS, PATCH/PUT, feedback visual.

## Prompts do Copilot (exemplos)
1. "faça as especificações por favor" — gerou modelos, endpoints e seed.
2. "implemente filtro avançado no front" — sugeriu múltiplos campos e integração JS.
3. "adicione validações customizadas no backend" — sugeriu uso de Pydantic e checagens manuais.
4. "adicione acessibilidade real" — sugeriu aria-label, tabindex, foco visível.
5. "gere um arquivo de testes .http" — sugeriu exemplos de requisições REST.
6. "corrija imagens do catálogo" — sugeriu links diretos e fallback.

## Peculiaridades implementadas
- Cupom "ALUNO10" (10% off) validado no backend e frontend.
- Filtro avançado (nome, categoria, preço, estoque) sem recarregar.
- Ordenação persistida (localStorage).
- Acessibilidade real (tabindex, aria, foco visível).
- Seed script com 20 produtos plausíveis.

## Validações
- Frontend: nome (3-60), preço (>=0.01), estoque (>=0), campos obrigatórios, feedback visual.
- Backend: validações Pydantic + checagens manuais (nome, preço, estoque, erros claros).

## Acessibilidade
- aria-label em botões e seções.
- tabindex nos campos de filtro.
- Foco visível customizado.
- Contraste mínimo e navegação por teclado.

## Como rodar
1. Instale dependências: `pip install fastapi uvicorn faker`.
2. Gere o banco: `python backend/database.py`.
3. Popule com seed: `python backend/seed.py`.
4. Rode a API: `uvicorn backend.app:app --reload`.
5. Abra `frontend/index.html` em um servidor local (ex: `npx http-server frontend`).
6. Teste endpoints com Thunder Client ou arquivo `testes.http`.

**Prints de sucesso:**
- [ ] (adicione prints do catálogo, carrinho, API funcionando)

## Limitações e melhorias futuras
- Falta autenticação/admin real.
- Não há upload de imagens.
- Testes automatizados ausentes.
- Melhorar feedback visual de erros.
- Adicionar paginação e exportação CSV/JSON.
- Refatorar para usar SQLAlchemy.
