# Backend - ChatIA

API RESTful com FastAPI, SQLite e scripts de seed.

## Como rodar

1. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
2. Crie o banco de dados:
   ```bash
   python database.py
   ```
3. Popule o banco com dados fictícios:
   ```bash
   python seed.py
   ```
4. Inicie a API:
   ```bash
   uvicorn app:app --reload
   ```
