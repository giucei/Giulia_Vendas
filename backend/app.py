from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import sqlite3
from models import Item
import seed

app = FastAPI()

@app.get("/items", response_model=list[Item])
def get_items():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, descricao FROM items")
    items = cursor.fetchall()
    conn.close()
    return [Item(id=row[0], nome=row[1], descricao=row[2]) for row in items]

@app.post("/items", status_code=201)
def create_item(item: Item):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO items (nome, descricao) VALUES (?, ?)", (item.nome, item.descricao))
        conn.commit()
        item_id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"id": item_id, **item.dict()}

@app.get("/items/{item_id}")
def get_item(item_id: int):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, descricao FROM items WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return Item(id=row[0], nome=row[1], descricao=row[2])
    raise HTTPException(status_code=404, detail="Item não encontrado")
