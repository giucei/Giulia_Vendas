import sqlite3
from faker import Faker

fake = Faker('pt_BR')

def seed_db():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # Produtos de moda e acessórios
    produtos = [
        # Roupas Femininas
        {"nome": "Vestido Floral Midi", "categoria": "Feminino", "preco": 259.99},
        {"nome": "Blazer Alfaiataria", "categoria": "Feminino", "preco": 299.99},
        {"nome": "Calça Wide Leg", "categoria": "Feminino", "preco": 189.99},
        {"nome": "Blusa Cropped", "categoria": "Feminino", "preco": 89.99},
        {"nome": "Saia Plissada", "categoria": "Feminino", "preco": 159.99},
        
        # Roupas Masculinas
        {"nome": "Camisa Social Slim", "categoria": "Masculino", "preco": 159.99},
        {"nome": "Calça Jeans Premium", "categoria": "Masculino", "preco": 219.99},
        {"nome": "Camiseta Básica", "categoria": "Masculino", "preco": 79.99},
        {"nome": "Jaqueta Bomber", "categoria": "Masculino", "preco": 299.99},
        {"nome": "Moletom Oversized", "categoria": "Masculino", "preco": 189.99},
        
        # Calçados
        {"nome": "Tênis Chunky", "categoria": "Calçados", "preco": 329.99},
        {"nome": "Sandália Trançada", "categoria": "Calçados", "preco": 159.99},
        {"nome": "Mocassim Couro", "categoria": "Calçados", "preco": 259.99},
        {"nome": "Bota Chelsea", "categoria": "Calçados", "preco": 289.99},
        
        # Acessórios
        {"nome": "Bolsa Tote Couro", "categoria": "Acessórios", "preco": 399.99},
        {"nome": "Colar Delicado", "categoria": "Acessórios", "preco": 89.99},
        {"nome": "Óculos de Sol", "categoria": "Acessórios", "preco": 199.99},
        {"nome": "Carteira Minimalista", "categoria": "Acessórios", "preco": 129.99},
        {"nome": "Cinto Couro", "categoria": "Acessórios", "preco": 119.99},
        {"nome": "Relógio Minimalista", "categoria": "Acessórios", "preco": 299.99}
    ]
    
    for i, produto in enumerate(produtos):
        nome = produto["nome"]
        categoria = produto["categoria"]
        preco = produto["preco"]
        descricao = fake.paragraph(nb_sentences=3)
        estoque = fake.random_int(min=5, max=30)
        sku = f"{categoria[:3].upper()}{str(i+1).zfill(3)}"
        cursor.execute("INSERT INTO produtos (nome, descricao, preco, estoque, categoria, sku) VALUES (?, ?, ?, ?, ?, ?)",
                       (nome, descricao, preco, estoque, categoria, sku))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_db()
