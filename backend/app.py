
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import sqlite3
from models import Produto, Pedido, Carrinho, CarrinhoItem
from datetime import datetime

app = FastAPI()

# GET /produtos?search=&categoria=&sort=
@app.get("/produtos", response_model=list[Produto])
def get_produtos(search: str = "", categoria: str = "", sort: str = ""):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    query = "SELECT id, nome, descricao, preco, estoque, categoria, sku FROM produtos WHERE 1=1"
    params = []
    if search:
        query += " AND nome LIKE ?"
        params.append(f"%{search}%")
    if categoria:
        query += " AND categoria = ?"
        params.append(categoria)
    if sort == "name-asc":
        query += " ORDER BY nome ASC"
    elif sort == "name-desc":
        query += " ORDER BY nome DESC"
    elif sort == "price-asc":
        query += " ORDER BY preco ASC"
    elif sort == "price-desc":
        query += " ORDER BY preco DESC"
    cursor.execute(query, params)
    produtos = cursor.fetchall()
    conn.close()
    return [Produto(id=row[0], nome=row[1], descricao=row[2], preco=row[3], estoque=row[4], categoria=row[5], sku=row[6]) for row in produtos]

# POST /produtos
@app.post("/produtos", response_model=Produto, status_code=201)
def create_produto(produto: Produto):
    if len(produto.nome) < 3 or len(produto.nome) > 60:
        raise HTTPException(status_code=422, detail="Nome deve ter entre 3 e 60 caracteres.")
    if produto.preco <= 0:
        raise HTTPException(status_code=422, detail="Preço deve ser maior que zero.")
    if produto.estoque < 0:
        raise HTTPException(status_code=422, detail="Estoque não pode ser negativo.")
    if not produto.categoria or len(produto.categoria) < 2:
        raise HTTPException(status_code=422, detail="Categoria obrigatória.")
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO produtos (nome, descricao, preco, estoque, categoria, sku) VALUES (?, ?, ?, ?, ?, ?)",
                       (produto.nome, produto.descricao, produto.preco, produto.estoque, produto.categoria, produto.sku))
        conn.commit()
        produto_id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar produto: {str(e)}")
    finally:
        conn.close()
    return Produto(id=produto_id, **produto.dict())

# PUT /produtos/{id}
@app.put("/produtos/{produto_id}", response_model=Produto)
def update_produto(produto_id: int, produto: Produto):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM produtos WHERE id = ?", (produto_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    try:
        cursor.execute("UPDATE produtos SET nome=?, descricao=?, preco=?, estoque=?, categoria=?, sku=? WHERE id=?",
                       (produto.nome, produto.descricao, produto.preco, produto.estoque, produto.categoria, produto.sku, produto_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar produto: {str(e)}")
    finally:
        conn.close()
    return Produto(id=produto_id, **produto.dict())

# DELETE /produtos/{id}
@app.delete("/produtos/{produto_id}", status_code=204)
def delete_produto(produto_id: int):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM produtos WHERE id = ?", (produto_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    try:
        cursor.execute("DELETE FROM produtos WHERE id = ?", (produto_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao deletar produto: {str(e)}")
    finally:
        conn.close()
    return JSONResponse(status_code=204, content={})

# POST /carrinho/confirmar
@app.post("/carrinho/confirmar", status_code=201)
def confirmar_carrinho(carrinho: Carrinho):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    try:
        # Validar e processar itens
        subtotal = 0
        items_processados = []
        
        for item in carrinho.items:
            # Verificar produto e estoque
            cursor.execute("SELECT preco, estoque FROM produtos WHERE id = ?", (item.produto_id,))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado")
            
            preco, estoque = result
            if estoque < item.quantidade:
                raise HTTPException(status_code=400, detail=f"Estoque insuficiente para produto {item.produto_id}")
            
            # Calcular subtotal do item
            item_subtotal = preco * item.quantidade
            subtotal += item_subtotal
            
            items_processados.append({
                "produto_id": item.produto_id,
                "quantidade": item.quantidade,
                "preco_unitario": preco,
                "subtotal": item_subtotal
            })
            
            # Atualizar estoque
            novo_estoque = estoque - item.quantidade
            cursor.execute("UPDATE produtos SET estoque = ? WHERE id = ?", 
                         (novo_estoque, item.produto_id))
        
        # Aplicar desconto se cupom válido
        desconto = 0
        if carrinho.cupom == "ALUNO10":
            desconto = subtotal * 0.1
        
        total_final = subtotal - desconto
        
        # Criar pedido
        cursor.execute("""
            INSERT INTO pedidos (cupom, subtotal, desconto, total_final, data)
            VALUES (?, ?, ?, ?, ?)
        """, (carrinho.cupom, subtotal, desconto, total_final, datetime.now().isoformat()))
        
        pedido_id = cursor.lastrowid
        
        # Inserir items do pedido
        for item in items_processados:
            cursor.execute("""
                INSERT INTO items_pedido (pedido_id, produto_id, quantidade, 
                                        preco_unitario, subtotal)
                VALUES (?, ?, ?, ?, ?)
            """, (pedido_id, item["produto_id"], item["quantidade"], 
                  item["preco_unitario"], item["subtotal"]))
        
        conn.commit()
        return {
            "pedido_id": pedido_id,
            "subtotal": subtotal,
            "desconto": desconto,
            "total_final": total_final
        }
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
@app.post("/carrinho/confirmar", response_model=Pedido)
def confirmar_carrinho(itens: list[dict], cupom: str = ""):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    total = 0.0
    for item in itens:
        cursor.execute("SELECT preco, estoque FROM produtos WHERE id = ?", (item.get('id'),))
        row = cursor.fetchone()
        if not row:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Produto id {item.get('id')} não encontrado.")
        preco, estoque = row
        if estoque < item.get('qtd', 1):
            conn.close()
            raise HTTPException(status_code=400, detail=f"Estoque insuficiente para produto id {item.get('id')}.")
        total += preco * item.get('qtd', 1)
    desconto = 0.0
    if cupom == "ALUNO10":
        desconto = total * 0.10
    total_final = total - desconto
    # Baixa estoque
    for item in itens:
        cursor.execute("UPDATE produtos SET estoque = estoque - ? WHERE id = ?", (item.get('qtd', 1), item.get('id')))
    # Cria pedido
    data = datetime.now().isoformat()
    cursor.execute("INSERT INTO pedidos (total_final, data) VALUES (?, ?)", (total_final, data))
    pedido_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return Pedido(id=pedido_id, total_final=total_final, data=data)
