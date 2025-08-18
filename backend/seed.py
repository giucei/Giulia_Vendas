import sqlite3
from faker import Faker

fake = Faker('pt_BR')

def seed_db():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    for _ in range(20):
        nome = fake.name()
        descricao = fake.sentence(nb_words=6)
        cursor.execute("INSERT INTO items (nome, descricao) VALUES (?, ?)", (nome, descricao))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_db()
