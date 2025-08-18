import sqlite3

def create_db():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_db()
