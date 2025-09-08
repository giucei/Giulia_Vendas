import sqlite3
from faker import Faker

fake = Faker('pt_BR')

def seed_db():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    categorias = ['Papelaria', 'Acessórios', 'Material Escolar', 'Tecnologia', 'Livros']
    for i in range(20):
        nome = fake.word().capitalize() + ' ' + fake.word().capitalize()
        descricao = fake.sentence(nb_words=8)
        preco = round(fake.pyfloat(left_digits=2, right_digits=2, positive=True, min_value=1, max_value=200), 2)
        estoque = fake.random_int(min=0, max=50)
        categoria = fake.random_element(elements=categorias)
        sku = f"SKU{i+1:03d}"
        cursor.execute("INSERT INTO produtos (nome, descricao, preco, estoque, categoria, sku) VALUES (?, ?, ?, ?, ?, ?)",
                       (nome, descricao, preco, estoque, categoria, sku))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_db()
