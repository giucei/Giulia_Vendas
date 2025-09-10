// Estado global
let produtos = [];
let carrinho = [];

// Funções do carrinho
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const cart = getCart();
    badge.textContent = cart.reduce((sum, item) => sum + item.quantidade, 0);
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const isHidden = drawer.hidden;
    drawer.hidden = !isHidden;
    
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.setAttribute('aria-pressed', !isHidden);
    
    if (!isHidden) {
        document.querySelector('.close-cart').focus();
    }
}

function addToCart(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto || produto.estoque === 0) return;
    
    let cart = getCart();
    let item = cart.find(i => i.produto_id === produtoId);
    
    if (item) {
        if (item.quantidade >= produto.estoque) {
            showToast('Estoque insuficiente');
            return;
        }
        item.quantidade++;
    } else {
        cart.push({
            produto_id: produtoId,
            quantidade: 1,
            nome: produto.nome,
            preco: produto.preco
        });
    }
    
    setCart(cart);
    showToast('Produto adicionado ao carrinho');
}

function removeFromCart(produtoId) {
    let cart = getCart();
    cart = cart.filter(item => item.produto_id !== produtoId);
    setCart(cart);
    showToast('Produto removido do carrinho');
}

function updateQuantity(produtoId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.produto_id === produtoId);
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!item || !produto) return;
    
    const novaQtd = item.quantidade + delta;
    if (novaQtd <= 0) {
        removeFromCart(produtoId);
        return;
    }
    
    if (novaQtd > produto.estoque) {
        showToast('Estoque insuficiente');
        return;
    }
    
    item.quantidade = novaQtd;
    setCart(cart);
}

function renderCart() {
    const cart = getCart();
    const itemsList = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    
    itemsList.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const li = document.createElement('li');
        subtotal += item.preco * item.quantidade;
        
        li.innerHTML = `
            <div class="cart-item">
                <span class="item-name">${item.nome}</span>
                <div class="item-controls">
                    <button aria-label="Diminuir quantidade" onclick="updateQuantity(${item.produto_id}, -1)">-</button>
                    <span class="item-quantity">${item.quantidade}</span>
                    <button aria-label="Aumentar quantidade" onclick="updateQuantity(${item.produto_id}, 1)">+</button>
                    <button class="remove-item" aria-label="Remover item" onclick="removeFromCart(${item.produto_id})">🗑️</button>
                </div>
                <div class="item-price">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
            </div>
        `;
        itemsList.appendChild(li);
    });
    
    subtotalEl.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
    
    const cupom = document.getElementById('coupon').value;
    const desconto = cupom === 'ALUNO10' ? subtotal * 0.1 : 0;
    
    if (desconto > 0) {
        discountEl.textContent = `Desconto: R$ ${desconto.toFixed(2)}`;
        discountEl.hidden = false;
    } else {
        discountEl.hidden = true;
    }
    
    const total = subtotal - desconto;
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

async function applyCoupon() {
    const cupomInput = document.getElementById('coupon');
    const cupom = cupomInput.value.trim();
    
    if (cupom === 'ALUNO10') {
        showToast('Cupom aplicado com sucesso!');
        renderCart();
    } else {
        showToast('Cupom inválido');
        cupomInput.value = '';
    }
}

async function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Carrinho vazio');
        return;
    }
    
    try {
        const cupom = document.getElementById('coupon').value;
        const response = await fetch('http://localhost:8000/carrinho/confirmar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    produto_id: item.produto_id,
                    quantidade: item.quantidade
                })),
                cupom: cupom === 'ALUNO10' ? cupom : null
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao processar pedido');
        }
        
        const result = await response.json();
        showToast(`Pedido confirmado! Total: R$ ${result.total_final.toFixed(2)}`);
        setCart([]);
        toggleCart();
        
        // Atualizar lista de produtos com novo estoque
        loadProdutos();
        
    } catch (error) {
        showToast(error.message);
    }
}

// Função para carregar produtos da API
async function loadProdutos() {
    try {
        const response = await fetch('http://localhost:8000/produtos');
        produtos = await response.json();
        renderProducts(produtos);
        fillFilterCategorias();
    } catch (error) {
        showToast('Erro ao carregar produtos');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadProdutos();
    
    // Restaurar ordenação salva
    const savedSort = localStorage.getItem('sort');
    if (savedSort) {
        document.getElementById('sort').value = savedSort;
    }
    
    // Event listeners
    document.getElementById('filter-form').addEventListener('input', filterAndSortProducts);
    document.getElementById('sort').addEventListener('change', filterAndSortProducts);
    
    // Inicializar carrinho
    updateCartBadge();
});
