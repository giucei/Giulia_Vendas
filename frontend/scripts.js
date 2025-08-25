
// Dados mock de produtos (poderia vir da API)
const produtos = [
    {id: 1, nome: 'Caderno', descricao: 'Caderno universitário 96 folhas', preco: 18.90, estoque: 10, categoria: 'Papelaria', sku: 'CAD001', imagem: 'https://images.tcdn.com.br/img/img_prod/639335/caderno_espiral_1_4_sem_pauta_neon_80_folhas_tilibra_12947_1_20200824193308.jpg'},
    {id: 2, nome: 'Lápis', descricao: 'Lápis preto HB', preco: 1.50, estoque: 50, categoria: 'Papelaria', sku: 'LAP001', imagem: 'https://images.tcdn.com.br/img/img_prod/1106500/lapis_preto_faber_castell_poster_12721_1_75ac1fd3ee9f86bc328877e62d51ec88.jpg'},
    {id: 3, nome: 'Mochila', descricao: 'Mochila escolar resistente', preco: 99.90, estoque: 5, categoria: 'Acessórios', sku: 'MOC001', imagem: 'https://m.media-amazon.com/images/I/91JgvoIza1L._AC_SL1500_.jpg'},
    {id: 4, nome: 'Caneta', descricao: 'Caneta azul', preco: 2.00, estoque: 30, categoria: 'Papelaria', sku: 'CAN001', imagem: 'https://m.media-amazon.com/images/I/71XQHYv0m8L._AC_.jpg'},
    {id: 5, nome: 'Borracha', descricao: 'Borracha branca', preco: 0.99, estoque: 20, categoria: 'Papelaria', sku: 'BOR001', imagem: 'https://images.tcdn.com.br/img/img_prod/719748/borracha_faber_castell_fc_max_rosa_463_1_20190929171214.jpg'},
    {id: 6, nome: 'Estojo', descricao: 'Estojo escolar', preco: 15.00, estoque: 8, categoria: 'Acessórios', sku: 'EST001', imagem: 'https://http2.mlstatic.com/estojo-escolar-grande-jumbo-100-pens-rosa-aig-D_NQ_NP_843510-MLB27094062968_032018-F.jpg'}
];


const categorias = [...new Set(produtos.map(p => p.categoria))];

// Preencher select de categoria do filtro
function fillFilterCategorias() {
    const sel = document.getElementById('filter-categoria');
    if (!sel) return;
    sel.innerHTML = '<option value="">Todas categorias</option>';
    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        sel.appendChild(opt);
    });
}

// Carrinho no localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const cart = getCart();
    badge.textContent = cart.reduce((sum, item) => sum + item.qtd, 0);
}

function renderProducts(list) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    list.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.tabIndex = 0;
        card.innerHTML = `
            <img src="${prod.imagem}" alt="Imagem de ${prod.nome}">
            <div class="prod-name">${prod.nome}</div>
            <div class="prod-price">R$ ${prod.preco.toFixed(2)}</div>
            <div class="prod-stock">${prod.estoque > 0 ? 'Estoque: ' + prod.estoque : '<span style=\'color:#EF4444\'>Esgotado</span>'}</div>
            <button aria-pressed="false" ${prod.estoque === 0 ? 'disabled' : ''} onclick="addToCart(${prod.id})">Adicionar</button>
        `;
        grid.appendChild(card);
    });
}


function filterAndSortProducts() {
    const search = document.getElementById('search').value.toLowerCase();
    const categoria = document.getElementById('filter-categoria').value;
    const precoMin = parseFloat(document.getElementById('filter-preco-min').value) || 0;
    const precoMax = parseFloat(document.getElementById('filter-preco-max').value) || Infinity;
    const estoqueMin = parseInt(document.getElementById('filter-estoque').value) || 0;
    let filtered = produtos.filter(p => {
        return (
            p.nome.toLowerCase().includes(search) &&
            (categoria === '' || p.categoria === categoria) &&
            p.preco >= precoMin &&
            p.preco <= precoMax &&
            p.estoque >= estoqueMin
        );
    });
    const sort = document.getElementById('sort').value;
    localStorage.setItem('sort', sort);
    if (sort === 'name-asc') filtered.sort((a,b) => a.nome.localeCompare(b.nome));
    if (sort === 'name-desc') filtered.sort((a,b) => b.nome.localeCompare(a.nome));
    if (sort === 'price-asc') filtered.sort((a,b) => a.preco - b.preco);
    if (sort === 'price-desc') filtered.sort((a,b) => b.preco - a.preco);
    renderProducts(filtered);
}

function addToCart(id) {
    const prod = produtos.find(p => p.id === id);
    if (!prod || prod.estoque === 0) return;
    let cart = getCart();
    const idx = cart.findIndex(item => item.id === id);
    // Efeito visual no botão
    const grid = document.getElementById('product-grid');
    // Busca o botão correto pelo id do produto
    const btn = Array.from(grid.querySelectorAll('button')).find(b => b && b.getAttribute('onclick') === `addToCart(${id})`);
    if (btn) {
        btn.classList.add('added');
        setTimeout(() => btn.classList.remove('added'), 700);
    }
    if (idx > -1) {
        if (cart[idx].qtd < prod.estoque) {
            cart[idx].qtd++;
            showToast('Mais uma unidade adicionada ao carrinho!');
        } else {
            showToast('Limite de estoque atingido!');
            return;
        }
    } else {
        cart.push({id, qtd: 1});
        showToast('Produto adicionado ao carrinho!');
    }
    setCart(cart);
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const btn = document.querySelector('.cart-btn');
    const isOpen = !drawer.hasAttribute('hidden');
    drawer.toggleAttribute('hidden');
    btn.setAttribute('aria-pressed', String(!isOpen));
    if (!drawer.hasAttribute('hidden')) renderCart();
}

function renderCart() {
    const cart = getCart();
    const ul = document.getElementById('cart-items');
    ul.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        const prod = produtos.find(p => p.id === item.id);
        if (!prod) return;
        subtotal += prod.preco * item.qtd;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${prod.nome} (${item.qtd}x)</span>
            <span>R$ ${(prod.preco * item.qtd).toFixed(2)}</span>
            <button aria-label="Remover" onclick="removeFromCart(${prod.id})">&times;</button>
        `;
        ul.appendChild(li);
    });
    document.getElementById('cart-subtotal').textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
    updateCartTotal(subtotal);
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    setCart(cart);
    renderCart();
}

function applyCoupon() {
    renderCart();
}

function updateCartTotal(subtotal) {
    const coupon = document.getElementById('coupon').value.trim();
    let discount = 0;
    if (coupon === 'ALUNO10') {
        discount = subtotal * 0.10;
        document.getElementById('cart-discount').hidden = false;
        document.getElementById('cart-discount').textContent = `Desconto: R$ ${discount.toFixed(2)}`;
    } else {
        document.getElementById('cart-discount').hidden = true;
    }
    const total = subtotal - discount;
    document.getElementById('cart-total').textContent = `Total: R$ ${total.toFixed(2)}`;
}

function checkout() {
    let cart = getCart();
    let ok = true;
    cart.forEach(item => {
        const prod = produtos.find(p => p.id === item.id);
        if (!prod || prod.estoque < item.qtd) ok = false;
    });
    if (!ok) {
        alert('Estoque insuficiente para um ou mais itens.');
        return;
    }
    // Reduz estoque (mock)
    cart.forEach(item => {
        const prod = produtos.find(p => p.id === item.id);
        if (prod) prod.estoque -= item.qtd;
    });
    setCart([]);
    renderProducts(produtos);
    toggleCart();
    alert('Pedido realizado com sucesso!');
}

// Admin: preencher categorias
function fillCategorias() {
    const sel = document.getElementById('prod-categoria');
    sel.innerHTML = '';
    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        sel.appendChild(opt);
    });
}

// Admin: validação e CRUD (mock)
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('prod-name').value.trim();
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const estoque = parseInt(document.getElementById('prod-estoque').value);
    const categoria = document.getElementById('prod-categoria').value;
    if (nome.length < 3 || nome.length > 60 || isNaN(preco) || preco < 0.01 || isNaN(estoque) || estoque < 0 || !categoria) {
        alert('Preencha corretamente os campos obrigatórios.');
        return;
    }
    // Adiciona produto (mock, não persiste)
    alert('Produto salvo (mock).');
    this.reset();
});

// Busca, ordenação, renderização inicial

document.getElementById('search').addEventListener('input', filterAndSortProducts);
document.getElementById('sort').addEventListener('change', filterAndSortProducts);
document.getElementById('filter-categoria').addEventListener('change', filterAndSortProducts);
document.getElementById('filter-preco-min').addEventListener('input', filterAndSortProducts);
document.getElementById('filter-preco-max').addEventListener('input', filterAndSortProducts);
document.getElementById('filter-estoque').addEventListener('input', filterAndSortProducts);
document.getElementById('coupon').addEventListener('input', function() { renderCart(); });

window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.applyCoupon = applyCoupon;
window.checkout = checkout;


document.addEventListener('DOMContentLoaded', function() {
    fillCategorias();
    fillFilterCategorias();
    // Restaurar ordenação persistida
    const savedSort = localStorage.getItem('sort');
    if (savedSort) document.getElementById('sort').value = savedSort;
    filterAndSortProducts();
    updateCartBadge();
    document.getElementById('search').focus();
});
