import sqlite3
from faker import Faker

fake = Faker('pt_BR')

def seed_db():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
          # Materiais Básicos
        {
            "nome": "Cola Branca 90g",
            "categoria": "Básicos",
            "preco": 4.99,
            "descricao": "Cola branca lavável, não tóxica, ideal para papel e cartolina.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/cola_branca_90g_tenaz_7896_1_20201214151908.jpg"
        },
        {
            "nome": "Tesoura Escolar",
            "categoria": "Básicos",
            "preco": 7.99,
            "descricao": "Tesoura com ponta arredondada, cabo ergonômico e lâmina inox.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/tesoura_escolar_13cm_sem_ponta_cis_7896_1_20201214151908.jpg"
        },
        {
            "nome": "Régua 30cm",
            "categoria": "Básicos",
            "preco": 3.99,
            "descricao": "Régua transparente de 30cm em acrílico resistente.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/regua_30cm_acrilica_waleu_7896_1_20201214151908.jpg"
        },
        {
            "nome": "Borracha Branca",
            "categoria": "Básicos",
            "preco": 1.99,
            "descricao": "Borracha macia, não mancha o papel, ideal para grafite.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/borracha_escolar_branca_record_20_7896_1_20201214151908.jpg"
        },
        {
            "nome": "Apontador com Depósito",
            "categoria": "Básicos",
            "preco": 4.99,
            "descricao": "Apontador com lâmina de aço e depósito transparente.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/apontador_com_deposito_faber_castell_7896_1_20201214151908.jpg"
        }
    ]  # Produtos de material escolar
    produtos = [
        # Cadernos e Papéis
        {
            "nome": "Caderno Universitário 10 Matérias",
            "categoria": "Cadernos",
            "preco": 29.99,
            "descricao": "Caderno com 200 folhas, capa dura e espiral. Divisórias coloridas e folhas pautadas.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/737424/caderno_universitario_sortido_10_materias_capa_dura_200_folhas_4684_1_f4fc1b1bc18ceea3d9c5f3507452dcf8.jpg"
        },
        {
            "nome": "Bloco de Notas A4",
            "categoria": "Papelaria",
            "preco": 12.99,
            "descricao": "Bloco com 100 folhas brancas, sem pauta. Ideal para desenho e anotações.",
            "imagem": "https://d3ugyf2ht6aenh.cloudfront.net/stores/974/142/products/bloco-a4-branco1-b7aa77e01d29ebb93a16543337263492-1024-1024.jpg"
        },
        {
            "nome": "Caderno de Desenho A4",
            "categoria": "Cadernos",
            "preco": 19.99,
            "descricao": "Caderno com espiral, 96 folhas brancas próprias para desenho artístico.",
            "imagem": "https://decapapelaria.com.br/cdn/shop/products/0000384_caderno-desenho-a4-96-folhas-credeal.jpg"
        },
        {
            "nome": "Papel Sulfite A4 500 folhas",
            "categoria": "Papelaria",
            "preco": 24.99,
            "descricao": "Pacote de papel sulfite branco, formato A4, 75g/m².",
            "imagem": "https://cdnv2.moovin.com.br/marbig/imagens/produtos/det/papel-sulfite-a4-report-premium-75g-500-folhas-internacional-paper-d6a3a8135d3c18c599a9a72e89389bff.jpg"
        },
        {
            "nome": "Caderno Inteligente Grande",
            "categoria": "Cadernos",
            "preco": 89.99,
            "descricao": "Caderno com discas, capa em couro sintético e divisórias removíveis.",
            "imagem": "https://cf.shopee.com.br/file/54c60fc8e333ce11482aeec1c6600413"
        },
        
        # Canetas e Escrita
        {
            "nome": "Kit Canetas Gel Coloridas",
            "categoria": "Escrita",
            "preco": 25.99,
            "descricao": "Conjunto com 12 canetas gel em cores variadas. Ponta 0.7mm.",
            "imagem": "https://cf.shopee.com.br/file/br-11134201-22120-04zye89agredc7"
        },
        {
            "nome": "Caneta Esferográfica Azul",
            "categoria": "Escrita",
            "preco": 1.99,
            "descricao": "Caneta azul com ponta média de 1.0mm. Escrita macia e sem falhas.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/caneta_esferografica_cristal_azul_bic_916_1_20201214003131.png"
        },
        {
            "nome": "Marca Texto Pastel",
            "categoria": "Escrita",
            "preco": 14.99,
            "descricao": "Kit com 6 marca-textos em cores pastel. Ponta chanfrada.",
            "imagem": "https://m.media-amazon.com/images/I/71VQl2k8gXL._AC_SL1500_.jpg"
        },
        {
            "nome": "Lapiseira 0.7mm",
            "categoria": "Escrita",
            "preco": 12.99,
            "descricao": "Lapiseira técnica com grip emborrachado e clip metálico.",
            "imagem": "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/537/086/products/lapiseira-pentel1-68443f279b28369c5316495441553324-1024-1024.jpg"
        },
        {
            "nome": "Grafite 0.7mm 2B",
            "categoria": "Escrita",
            "preco": 5.99,
            "descricao": "Tubo com 12 minas de grafite 0.7mm, graduação 2B.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/648418/grafite_faber_castell_0_7mm_2b_363_1_c759022b71e41ae66c25251372c0d65f.jpg"
        },
        
        # Mochilas e Estojos
        {
            "nome": "Mochila Escolar Grande",
            "categoria": "Mochilas",
            "preco": 149.99,
            "descricao": "Mochila resistente com compartimento para notebook, vários bolsos e alças acolchoadas.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/mochila_escolar_juvenil_clio_style_preto_7630_1_9383ce800ade93e89fbeabffb63d9f79.png"
        },
        {
            "nome": "Estojo Duplo",
            "categoria": "Acessórios",
            "preco": 39.99,
            "descricao": "Estojo com dois compartimentos, material resistente e zíper de qualidade.",
            "imagem": "https://a-static.mlcdn.com.br/450x450/estojo-escolar-duplo-grande-dac-colors-roxo/papelariauniverso/15920/c9dc3b029ea35a2f5c99d7a3e2563c05.jpeg"
        },
        {
            "nome": "Mochila com Rodinhas",
            "categoria": "Mochilas",
            "preco": 179.99,
            "descricao": "Mochila com rodinhas, alça retrátil e compartimentos organizadores.",
            "imagem": "https://m.media-amazon.com/images/I/71RDhzxjp5L._AC_SX679_.jpg"
        },
        {
            "nome": "Pasta Escolar A4",
            "categoria": "Acessórios",
            "preco": 24.99,
            "descricao": "Pasta com elástico, em polipropileno resistente, formato A4.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/648418/pasta_plastica_com_elastico_oficio_35mm_azul_acp_182_1_20200527152201.jpg"
        },
        
        # Materiais Artísticos
        {
            "nome": "Lápis de Cor 36 Cores",
            "categoria": "Artístico",
            "preco": 49.99,
            "descricao": "Estojo com 36 lápis de cor, cores vivas e alta pigmentação.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/lapis_de_cor_36_cores_aquarelavel_faber_castell_7896_1_4039550e2fcca23492abafc7f17c64b5.jpg"
        },
        {
            "nome": "Kit Pincéis Artísticos",
            "categoria": "Artístico",
            "preco": 34.99,
            "descricao": "Conjunto com 12 pincéis de diferentes tamanhos para pintura.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/pincel_escolar_com_12_unidades_leo_e_leo_5660_1_20201214132040.jpg"
        },
        {
            "nome": "Tinta Guache 12 Cores",
            "categoria": "Artístico",
            "preco": 19.99,
            "descricao": "Kit com 12 cores de tinta guache, 15ml cada.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/tinta_guache_12_cores_15ml_acrilex_7896_1_20201214151908.jpg"
        },
        {
            "nome": "Massa de Modelar 12 Cores",
            "categoria": "Artístico",
            "preco": 9.99,
            "descricao": "Conjunto com 12 cores de massa de modelar, não tóxica.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/massinha_de_modelar_12_cores_acrilex_7896_1_20201214151908.jpg"
        },
        {
            "nome": "Giz de Cera Jumbo",
            "categoria": "Artístico",
            "preco": 15.99,
            "descricao": "Estojo com 12 giz de cera grosso, ideal para crianças.",
            "imagem": "https://images.tcdn.com.br/img/img_prod/1066780/giz_de_cera_12_cores_jumbo_acrilex_7896_1_20201214151908.jpg"
        },
        
        # Materiais Básicos
        {"nome": "Cola Branca 90g", "categoria": "Básicos", "preco": 4.99, "descricao": "Cola branca lavável, não tóxica, ideal para papel e cartolina."},
        {"nome": "Tesoura Escolar", "categoria": "Básicos", "preco": 7.99, "descricao": "Tesoura com ponta arredondada, cabo ergonômico e lâmina inox."},
        {"nome": "Régua 30cm", "categoria": "Básicos", "preco": 3.99, "descricao": "Régua transparente de 30cm em acrílico resistente."},
        {"nome": "Borracha Branca", "categoria": "Básicos", "preco": 1.99, "descricao": "Borracha macia, não mancha o papel, ideal para grafite."},
        {"nome": "Apontador com Depósito", "categoria": "Básicos", "preco": 4.99, "descricao": "Apontador com lâmina de aço e depósito transparente."}
    ]
    
    for i, produto in enumerate(produtos):
        nome = produto["nome"]
        categoria = produto["categoria"]
        preco = produto["preco"]
        descricao = fake.paragraph(nb_sentences=3)
        estoque = fake.random_int(min=5, max=30)
        sku = f"{categoria[:3].upper()}{str(i+1).zfill(3)}"
        imagem = produto.get("imagem")
        cursor.execute("INSERT INTO produtos (nome, descricao, preco, estoque, categoria, sku, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (nome, descricao, preco, estoque, categoria, sku, imagem))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_db()
