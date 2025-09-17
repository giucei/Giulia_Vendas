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

// Função para renderizar produtos
function renderProducts(produtos) {
    const grid = document.getElementById('product-grid');
    if (!grid) {
        console.error('Elemento product-grid não encontrado');
        return;
    }
    
    grid.innerHTML = '';
    console.log('Renderizando produtos:', produtos); // Debug
    
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imageUrl = produto.imagem || `https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=${encodeURIComponent(produto.nome)}`;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${produto.nome}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${produto.nome}</h3>
                <p class="product-description">${produto.descricao || 'Sem descrição disponível'}</p>
                <div class="product-details">
                    <span class="product-price">R$ ${Number(produto.preco).toFixed(2)}</span>
                    <span class="product-stock">${produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}</span>
                </div>
                <button 
                    onclick="addToCart(${produto.id})" 
                    class="add-to-cart-btn"
                    ${produto.estoque === 0 ? 'disabled' : ''}
                    aria-label="${produto.estoque === 0 ? 'Produto sem estoque' : `Adicionar ${produto.nome} ao carrinho`}"
                >
                    ${produto.estoque === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });

    // Se não houver produtos, mostrar mensagem
    if (produtos.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <p>Nenhum produto encontrado.</p>
            </div>
        `;
    }
}

// Função para carregar produtos da API
async function loadProdutos() {
    try {
        showToast('Carregando produtos...');
        const response = await fetch('http://localhost:8000/produtos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        produtos = await response.json();
        console.log('Produtos carregados:', produtos); // Debug
        if (produtos.length === 0) {
            showToast('Nenhum produto encontrado');
            return;
        }
        renderProducts(produtos);
        fillFilterCategorias();
        showToast(`${produtos.length} produtos carregados`);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos. Verifique se o backend está rodando.');
    }
}

// Função para filtrar e ordenar produtos
function filterAndSortProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoria = document.getElementById('filter-categoria').value;
    const precoMin = parseFloat(document.getElementById('filter-preco-min').value) || 0;
    const precoMax = parseFloat(document.getElementById('filter-preco-max').value) || Infinity;
    const estoqueMin = parseInt(document.getElementById('filter-estoque').value) || 0;
    const sortBy = document.getElementById('sort').value;
    
    let filtered = produtos.filter(produto => {
        const matchesSearch = produto.nome.toLowerCase().includes(searchTerm);
        const matchesCategoria = !categoria || produto.categoria === categoria;
        const matchesPreco = produto.preco >= precoMin && produto.preco <= precoMax;
        const matchesEstoque = produto.estoque >= estoqueMin;
        
        return matchesSearch && matchesCategoria && matchesPreco && matchesEstoque;
    });
    
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.nome.localeCompare(b.nome);
            case 'name-desc':
                return b.nome.localeCompare(a.nome);
            case 'price-asc':
                return a.preco - b.preco;
            case 'price-desc':
                return b.preco - a.preco;
            default:
                return 0;
        }
    });
    
    renderProducts(filtered);
    localStorage.setItem('sort', sortBy);
}

// Função para preencher o select de categorias com valores únicos
function fillFilterCategorias() {
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    const select = document.getElementById('filter-categoria');
    
    select.innerHTML = '<option value="">Todas categorias</option>';
    categorias.forEach(categoria => {
        if (categoria) {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            select.appendChild(option);
        }
    });
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}

// Funções de administração de produtos
let currentProductId = null;

function toggleAdmin() {
    const adminPanel = document.getElementById('admin-panel');
    const isHidden = adminPanel.hidden;
    adminPanel.hidden = !isHidden;
    
    if (!isHidden) {
        // Limpar formulário ao fechar
        document.getElementById('product-form').reset();
        currentProductId = null;
    }
}

function fillProductForm(product) {
    const form = document.getElementById('product-form');
    form.querySelector('#prod-name').value = product.nome;
    form.querySelector('#prod-desc').value = product.descricao || '';
    form.querySelector('#prod-preco').value = product.preco;
    form.querySelector('#prod-estoque').value = product.estoque;
    form.querySelector('#prod-categoria').value = product.categoria;
    form.querySelector('#prod-imagem').value = product.imagem || '';
    currentProductId = product.id;
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const produto = {
        nome: formData.get('nome'),
        descricao: formData.get('descricao'),
        preco: parseFloat(formData.get('preco')),
        estoque: parseInt(formData.get('estoque')),
        categoria: formData.get('categoria'),
        imagem: formData.get('imagem')
    };
    
    try {
        const method = currentProductId ? 'PUT' : 'POST';
        const url = currentProductId 
            ? `http://localhost:8000/produtos/${currentProductId}`
            : 'http://localhost:8000/produtos';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao salvar produto');
        }
        
        showToast(currentProductId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
        toggleAdmin();
        loadProdutos(); // Recarregar lista de produtos
        
    } catch (error) {
        showToast(error.message);
    }
}

async function editProduct(productId) {
    try {
        const produto = produtos.find(p => p.id === productId);
        if (!produto) {
            throw new Error('Produto não encontrado');
        }
        
        fillProductForm(produto);
        toggleAdmin();
        
    } catch (error) {
        showToast(error.message);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8000/produtos/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }
        
        showToast('Produto excluído com sucesso!');
        loadProdutos(); // Recarregar lista de produtos
        
    } catch (error) {
        showToast(error.message);
    }
}

// Modificar função renderProducts para incluir botões de edição/exclusão
function renderProducts(produtos) {
    const grid = document.getElementById('product-grid');
    if (!grid) {
        console.error('Elemento product-grid não encontrado');
        return;
    }
    
    grid.innerHTML = '';
    console.log('Renderizando produtos:', produtos); // Debug
    
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imageUrl = produto.imagem || `https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=${encodeURIComponent(produto.nome)}`;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${produto.nome}" loading="lazy">
                <div class="admin-controls">
                    <button onclick="editProduct(${produto.id})" class="edit-btn" aria-label="Editar produto">✏️</button>
                    <button onclick="deleteProduct(${produto.id})" class="delete-btn" aria-label="Excluir produto">🗑️</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${produto.nome}</h3>
                <p class="product-description">${produto.descricao || 'Sem descrição disponível'}</p>
                <div class="product-details">
                    <span class="product-price">R$ ${Number(produto.preco).toFixed(2)}</span>
                    <span class="product-stock">${produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}</span>
                </div>
                <button 
                    onclick="addToCart(${produto.id})" 
                    class="add-to-cart-btn"
                    ${produto.estoque === 0 ? 'disabled' : ''}
                    aria-label="${produto.estoque === 0 ? 'Produto sem estoque' : `Adicionar ${produto.nome} ao carrinho`}"
                >
                    ${produto.estoque === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });

    // Se não houver produtos, mostrar mensagem
    if (produtos.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <p>Nenhum produto encontrado.</p>
            </div>
        `;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário está logado
    const user = localStorage.getItem('user');
    if (!user) {
        // Se não estiver logado, redireciona para a página de registro
        window.location.href = 'register.html';
        return;
    }

    // Carregar dados do usuário
    const userData = JSON.parse(user);
    
    // Atualizar header com nome do usuário
    const headerNav = document.querySelector('.main-nav');
    const userElement = document.createElement('span');
    userElement.className = 'user-name';
    userElement.textContent = `Olá, ${userData.name.split(' ')[0]}`;
    headerNav.appendChild(userElement);
    
    // Setup do formulário de produtos
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', handleProductSubmit);
    
    loadProdutos();
    
    // Restaurar ordenação salva
    const savedSort = localStorage.getItem('sort');
    if (savedSort) {
        document.getElementById('sort').value = savedSort;
    }
    
    // Event listeners para filtros
    document.querySelectorAll('.filters input, .filters select').forEach(element => {
        element.addEventListener('input', filterAndSortProducts);
    });
    
    // Inicializar carrinho
    updateCartBadge();
});
