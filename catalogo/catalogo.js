import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.32.0'

// Configuração do Supabase (Carregada via window.supabaseConfig no index.html)
const supabaseUrl = window.supabaseConfig.url;
const supabaseKey = window.supabaseConfig.key;
const supabase = createClient(supabaseUrl, supabaseKey);
// Usando client anônimo - acesso público, sem autenticação

// Estado global do aplicativo
const state = {
    products: [],
    filteredProducts: [],
    categories: new Set(),
    capacities: new Set(),
    brands: new Set(),
    currentPage: 1,
    itemsPerPage: 12,
    filters: {
        category: '',
        capacity: '',
        brand: '',
        search: '',
        tag: ''
    },
    sort: 'nome_asc',
    cart: [],
    currentProductQuantity: 1
};

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const categoryFilter = document.getElementById('categoria');
const capacityFilter = document.getElementById('capacidade');
const brandFilter = document.getElementById('marca');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const clearFiltersBtn = document.getElementById('clear-filters');
const sortSelect = document.getElementById('sort');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbers = document.getElementById('page-numbers');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const modalDetails = document.getElementById('modal-details');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cart-items');
const cartNotes = document.getElementById('cart-notes');
const quoteName = document.getElementById('quote-name');
const quotePhone = document.getElementById('quote-phone');
const submitQuoteBtn = document.getElementById('submit-quote');

// Buscar dados do Supabase
async function fetchProducts() {
    showLoading();
    
    try {
        // Buscar dados da view no Supabase - requisição pública, sem autenticação
        const { data, error } = await supabase
            .from('view_dispositivos_publicos')
            .select('*')
            .order('nome', { ascending: true });
        
        if (error) {
            console.error('Erro Supabase:', error);
            throw error;
        }
        
        console.log('Dados recebidos:', data);
        
        if (data) {
            state.products = data;
            state.filteredProducts = [...data];
            
            // Extrair valores únicos para os filtros
            data.forEach(product => {
                if (product.categoria) state.categories.add(product.categoria);
                
                // Extrair capacidades dos dados técnicos
                if (product.dados_tecnicos && product.dados_tecnicos.capacidade) {
                    state.capacities.add(product.dados_tecnicos.capacidade);
                }
                
                // Extrair materiais como "marcas" para filtro
                if (product.dados_tecnicos && product.dados_tecnicos.material) {
                    state.brands.add(product.dados_tecnicos.material);
                }
            });
            
            // Preencher os filtros
            populateFilters();
            
            // Aplicar filtros iniciais
            applyFilters();
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        showEmptyState('Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.');
    }
}

// Preencher filtros com dados
function populateFilters() {
    // Categoria
    state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Capacidade
    state.capacities.forEach(capacity => {
        const option = document.createElement('option');
        option.value = capacity;
        option.textContent = capacity;
        capacityFilter.appendChild(option);
    });
    
    // Marca
    state.brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

// Aplicar filtros
function applyFilters() {
    state.filteredProducts = state.products.filter(product => {
        // Filtro de categoria
        if (state.filters.category && product.categoria !== state.filters.category) {
            return false;
        }
        
        // Filtro de capacidade (agora em dados_tecnicos)
        if (state.filters.capacity && 
            (!product.dados_tecnicos || 
             product.dados_tecnicos.capacidade !== state.filters.capacity)) {
            return false;
        }
        
        // Filtro de marca/material (agora em dados_tecnicos)
        if (state.filters.brand && 
            (!product.dados_tecnicos || 
             product.dados_tecnicos.material !== state.filters.brand)) {
            return false;
        }
        
        // Filtro de tag
        if (state.filters.tag && 
            (!product.tags || 
             !product.tags.includes(state.filters.tag))) {
            return false;
        }
        
        // Filtro de busca
        if (state.filters.search) {
            const searchTerm = state.filters.search.toLowerCase();
            const nameMatch = product.nome?.toLowerCase().includes(searchTerm);
            const descMatch = product.dados_tecnicos?.descricao?.toLowerCase().includes(searchTerm);
            const categoryMatch = product.categoria?.toLowerCase().includes(searchTerm);
            
            if (!nameMatch && !descMatch && !categoryMatch) {
                return false;
            }
        }
        
        return true;
    });
    
    // Aplicar ordenação
    applySorting();
    
    // Voltar para a primeira página
    state.currentPage = 1;
    
    // Renderizar produtos
    renderProducts();
    // Atualizar paginação
    renderPagination();
}

// Aplicar ordenação
function applySorting() {
    switch (state.sort) {
        case 'nome_asc':
            state.filteredProducts.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
            break;
        case 'nome_desc':
            state.filteredProducts.sort((a, b) => (b.nome || '').localeCompare(a.nome || ''));
            break;
        case 'preco_asc':
            state.filteredProducts.sort((a, b) => parseFloat(a.preco || 0) - parseFloat(b.preco || 0));
            break;
        case 'preco_desc':
            state.filteredProducts.sort((a, b) => parseFloat(b.preco || 0) - parseFloat(a.preco || 0));
            break;
    }
}

// Renderizar produtos
function renderProducts() {
    productsGrid.innerHTML = '';
    
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedProducts = state.filteredProducts.slice(startIndex, endIndex);
    
    if (paginatedProducts.length === 0) {
        showEmptyState('Nenhum produto encontrado com os filtros selecionados.');
        return;
    }
    
    paginatedProducts.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

// Criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    // Verificar se há imagem, caso contrário usar fallback
    const imageUrl = product.url_img || 'https://raw.githubusercontent.com/ElevDispositivos/site/main/midias/elev-fallback-tratores.png'
;
    
    // Extrair dados técnicos relevantes para o card
    const capacity = product.dados_tecnicos?.capacidade || 'Capacidade não especificada';
    const application = product.dados_tecnicos?.aplicacao || 'Aplicação não especificada';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.nome || 'Equipamento ELEV'}" onerror="this.src='https://raw.githubusercontent.com/ElevDispositivos/site/main/midias/elev-fallback-tratores.png'
">
        </div>
        <div class="product-info">
            <div class="product-category">${product.categoria || 'Categoria não especificada'}</div>
            <h3 class="product-name">${product.nome || 'Produto sem nome'}</h3>
            <div class="product-specs">
                <div>Capacidade: ${capacity}</div>
                <div>Aplicação: ${application}</div>
                ${product.estoque ? `<div class="product-stock">Em estoque: ${product.estoque}</div>` : ''}
            </div>
            <div class="product-footer">
                <button class="product-button">Ver Detalhes</button>
                <button class="cart-button" title="Adicionar ao orçamento"><i class="fas fa-shopping-cart"></i></button>
            </div>
        </div>
    `;
    
    // Adicionar evento de clique para detalhes
    card.querySelector('.product-button').addEventListener('click', () => showProductDetails(product));
    
    // Adicionar evento para adicionar ao carrinho
    card.querySelector('.cart-button').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    });
    
    return card;
}

// Mostrar estado vazio
function showEmptyState(message) {
    productsGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>${message}</p>
        </div>
    `;
}

// Mostrar loading
function showLoading() {
    productsGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// Renderizar paginação
function renderPagination() {
    const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
    
    // Desabilitar/habilitar botões de página
    prevPageBtn.disabled = state.currentPage === 1;
    nextPageBtn.disabled = state.currentPage === totalPages || totalPages === 0;
    
    // Renderizar números de página
    pageNumbers.innerHTML = '';
    
    // Limitar número de páginas exibidas
    let startPage = Math.max(1, state.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4 && totalPages > 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number${i === state.currentPage ? ' active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
            state.currentPage = i;
            renderProducts();
            renderPagination();
        });
        pageNumbers.appendChild(pageNumber);
    }
}

// Mostrar detalhes do produto
function showProductDetails(product) {
    // Reset quantidade atual
    state.currentProductQuantity = 1;
    
    // Verificar se há imagem, caso contrário usar fallback
    const mainImageUrl = product.url_img || 'https://github.com/ElevDispositivos/site/blob/main/midias/elev-fallback-tratores.png';
    
    // Preparar galeria de imagens
    let galleryHtml = '';
    if (product.url_midias_lista && product.url_midias_lista.length > 0) {
        galleryHtml = `
            <div class="modal-gallery">
                <h4>Galeria</h4>
                <div class="gallery-container">
                    ${product.url_midias_lista.map(url => 
                        `<div class="gallery-item">
                            <img src="${url}" alt="${product.nome}" onerror="this.src='https://github.com/ElevDispositivos/site/blob/main/midias/elev-fallback-tratores.png'">
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Preparar dados técnicos
    let techSpecsHtml = '<div class="modal-specs">';
    if (product.dados_tecnicos) {
        for (const [key, value] of Object.entries(product.dados_tecnicos)) {
            // Formatar a chave para exibição (capitalize primeira letra, substituir underscore por espaço)
            const formattedKey = key.charAt(0).toUpperCase() + 
                key.slice(1).replace(/_/g, ' ');
            
            techSpecsHtml += `
                <div class="specs-item">
                    <div class="specs-label">${formattedKey}:</div>
                    <div class="specs-value">${value}</div>
                </div>
            `;
        }
    } else {
        techSpecsHtml += '<p>Sem dados técnicos disponíveis</p>';
    }
    techSpecsHtml += '</div>';
    
    modalDetails.innerHTML = `
        <div class="modal-image">
            <img src="${mainImageUrl}" alt="${product.nome}" onerror="this.src='https://raw.githubusercontent.com/ElevDispositivos/site/main/midias/elev-fallback-tratores.png'
">
        </div>
        <div class="modal-info">
            <div class="modal-category">${product.categoria || 'Categoria não especificada'}</div>
            <h3>${product.nome || 'Produto sem nome'}</h3>
            
            ${techSpecsHtml}
            
            ${galleryHtml}
            
            <div class="quantity-control">
                <div class="quantity-label">Quantidade:</div>
                <div class="quantity-input">
                    <button class="quantity-btn minus-btn">-</button>
                    <input type="number" class="quantity-value" value="1" min="1" max="999">
                    <button class="quantity-btn plus-btn">+</button>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="modal-button">Solicitar Orçamento</button>
                <button class="modal-button add-to-cart"><i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho</button>
            </div>
        </div>
    `;
    
    // Controles de quantidade
    const quantityInput = modalDetails.querySelector('.quantity-value');
    const minusBtn = modalDetails.querySelector('.minus-btn');
    const plusBtn = modalDetails.querySelector('.plus-btn');
    
    minusBtn.addEventListener('click', () => {
        if (state.currentProductQuantity > 1) {
            state.currentProductQuantity--;
            quantityInput.value = state.currentProductQuantity;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        state.currentProductQuantity++;
        quantityInput.value = state.currentProductQuantity;
    });
    
    quantityInput.addEventListener('change', () => {
        const value = parseInt(quantityInput.value);
        if (value < 1) {
            quantityInput.value = 1;
            state.currentProductQuantity = 1;
        } else {
            state.currentProductQuantity = value;
        }
    });
    
    // Botão de orçamento direto
    modalDetails.querySelector('.modal-button').addEventListener('click', () => {
        addToCart(product, state.currentProductQuantity);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        openCart();
    });
    
    // Botão de adicionar ao carrinho
    modalDetails.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product, state.currentProductQuantity);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Funções do Carrinho
function addToCart(product, quantity) {
    const existingItemIndex = state.cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Atualizar quantidade se o item já existe
        state.cart[existingItemIndex].quantity += quantity;
    } else {
        // Adicionar novo item
        state.cart.push({
            id: product.id,
            nome: product.nome,
            categoria: product.categoria,
            dados_tecnicos: product.dados_tecnicos,
            quantity: quantity
        });
    }
    
    // Atualizar interface
    updateCartCount();
    updateCartDisplay();
    
    // Mostrar notificação
    showNotification(`${product.nome} adicionado ao carrinho`);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    if (state.cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    
    state.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.nome}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <span class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></span>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.cart-item .minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = state.cart.find(item => item.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartCount();
                updateCartDisplay();
            }
        });
    });
    
    document.querySelectorAll('.cart-item .plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = state.cart.find(item => item.id === id);
            if (item) {
                item.quantity++;
                updateCartCount();
                updateCartDisplay();
            }
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartMenu() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
}

function showNotification(message) {
    // Implementação simples de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Estilo da notificação
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--green)';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

async function submitQuote() {
    if (state.cart.length === 0) {
        alert('Adicione itens ao carrinho para solicitar um orçamento.');
        return;
    }
    
    if (!quoteName.value.trim()) {
        alert('Por favor, informe seu nome para solicitar o orçamento.');
        quoteName.focus();
        return;
    }
    
    try {
        // Preparar dados para a tabela solicitacoes
        const solicitacaoData = {
            nome: quoteName.value.trim(),
            telefone: quotePhone.value.trim() || null,
            mensagem: cartNotes.value.trim(),
            dados: {
                itens: state.cart.map(item => ({
                    id: item.id,
                    nome: item.nome,
                    quantidade: item.quantity,
                    categoria: item.categoria,
                    dados_tecnicos: item.dados_tecnicos
                }))
            },
            contatado: false
            // recebido_em será preenchido automaticamente pelo Supabase
        };
        
        // Inserir na tabela solicitacoes - requisição pública, sem autenticação
        const { data, error } = await supabase
            .from('solicitacoes')
            .insert([solicitacaoData])
            .select();
            
        if (error) throw error;
        
        // Limpar o carrinho após sucesso
        state.cart = [];
        updateCartCount();
        updateCartDisplay();
        quoteName.value = '';
        quotePhone.value = '';
        cartNotes.value = '';
        closeCartMenu();
        
        alert('Orçamento enviado com sucesso! Entraremos em contato em breve.');
        
    } catch (error) {
        console.error('Erro ao enviar orçamento:', error);
        alert('Ocorreu um erro ao enviar o orçamento. Por favor, tente novamente.');
    }
}

// Formatar preço
function formatPrice(price) {
    if (!price) return 'Preço sob consulta';
    return `R$ ${parseFloat(price).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar produtos
    fetchProducts();
    
    // Adicionar filtro de tags se necessário
    const tagFilter = document.createElement('div');
    tagFilter.className = 'filter-group';
    tagFilter.innerHTML = `
        <label for="tag">Tag</label>
        <select id="tag">
            <option value="">Todas</option>
            <option value="destaque">Destaque</option>
            <option value="promocao">Promoção</option>
            <option value="mais_vendidos">Mais Vendidos</option>
        </select>
    `;
    
    // Encontrar o elemento correto e adicionar o filtro de tag de forma segura
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
        // Adicionar o filtro antes do botão de limpar filtros ou no final se não encontrar o botão
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn && clearFiltersBtn.parentNode === filterSection) {
            filterSection.insertBefore(tagFilter, clearFiltersBtn);
        } else {
            filterSection.appendChild(tagFilter);
        }
    }
    
    const tagSelect = document.getElementById('tag');
    if (tagSelect) {
        tagSelect.addEventListener('change', () => {
            state.filters.tag = tagSelect.value;
            applyFilters();
        });
    }
    
    // Eventos de filtros
    categoryFilter.addEventListener('change', () => {
        state.filters.category = categoryFilter.value;
        applyFilters();
    });
    
    capacityFilter.addEventListener('change', () => {
        state.filters.capacity = capacityFilter.value;
        applyFilters();
    });
    
    brandFilter.addEventListener('change', () => {
        state.filters.brand = brandFilter.value;
        applyFilters();
    });
    
    searchBtn.addEventListener('click', () => {
        state.filters.search = searchInput.value.trim();
        applyFilters();
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            state.filters.search = searchInput.value.trim();
            applyFilters();
        }
    });
    
    clearFiltersBtn.addEventListener('click', () => {
        // Limpar filtros
        categoryFilter.value = '';
        capacityFilter.value = '';
        brandFilter.value = '';
        searchInput.value = '';
        sortSelect.value = 'nome_asc';
        if (tagSelect) tagSelect.value = '';
        
        // Resetar estado de filtros
        state.filters.category = '';
        state.filters.capacity = '';
        state.filters.brand = '';
        state.filters.search = '';
        state.filters.tag = '';
        state.sort = 'nome_asc';
        
        applyFilters();
    });
    
    // Evento de ordenação
    sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        applySorting();
        renderProducts();
    });
    
    // Eventos de paginação
    prevPageBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProducts();
            renderPagination();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderProducts();
            renderPagination();
        }
    });
    
    // Eventos do modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Eventos do carrinho
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartMenu);
    cartOverlay.addEventListener('click', closeCartMenu);
    submitQuoteBtn.addEventListener('click', submitQuote);
    
    // Inicializar contador do carrinho
    updateCartCount();
});