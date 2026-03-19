// Configuração do Supabase (Carregada via window.supabaseConfig no index.html)
const supabaseUrl = window.supabaseConfig.url;
const supabaseKey = window.supabaseConfig.key;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let dispositivosOriginais = [];

// Paginação
let paginaAtual = 1;
const itensPorPagina = 18;
let dispositivosOrdenados = [];

// Modal HTML
function criarModal() {
    if (document.getElementById('modal-ficha')) return;
    const modal = document.createElement('div');
    modal.id = 'modal-ficha';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    // Fechar modal
    modal.querySelector('.modal-close').onclick = fecharModal;
    modal.querySelector('.modal-overlay').onclick = fecharModal;
}

function abrirModal(dispositivo) {
    const modal = document.getElementById('modal-ficha');
    const body = modal.querySelector('.modal-body');
    // Renderiza os dados técnicos de forma formatada e responsiva
    const dados = dispositivo.dados_tecnicos || {};
    body.innerHTML = `
        <style>
            #modal-ficha {
                position: fixed !important;
                top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
            }
            #modal-ficha .modal-overlay {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.55);
                z-index: 9998;
            }
            #modal-ficha .modal-content {
                position: relative;
                z-index: 9999;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.18);
                padding: 0;
                margin: 0 8px;
                display: flex;
                flex-direction: row;
                align-items: stretch;
                gap: 0;
                pointer-events: all;
            }
            #modal-ficha .modal-close {
                position: absolute;
                top: 12px; right: 18px;
                font-size: 2rem;
                color: #333;
                cursor: pointer;
                z-index: 10000;
                font-weight: bold;
                transition: color 0.2s;
            }
            #modal-ficha .modal-close:hover {
                color: #c00;
            }
            #modal-ficha .modal-body {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
            }
            #modal-ficha .modal-img {
                flex: 1 1 320px;
                min-width: 220px;
                max-width: 380px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f7f7f7;
                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;
                overflow: hidden;
            }
            #modal-ficha .modal-img img {
                width: 100%;
                height: auto;
                max-width: 360px;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 0;
            }
            #modal-ficha .modal-info {
                flex: 2 1 0;
                padding: 32px 24px 24px 24px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                min-width: 0;
            }
            #modal-ficha .modal-info h2 {
                margin-bottom: 12px;
                font-size: 1.6rem;
                font-weight: 700;
            }
            #modal-ficha .modal-info table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 18px;
            }
            #modal-ficha .modal-info th, #modal-ficha .modal-info td {
                text-align: left;
                padding: 6px 8px;
                border-bottom: 1px solid #eee;
                font-size: 1rem;
            }
            #modal-ficha .modal-info th {
                color: #666;
                font-weight: 600;
                width: 120px;
            }
            #modal-ficha .modal-info ul {
                margin: 0 0 0 0;
                padding: 0;
                list-style: none;
            }
            #modal-ficha .modal-info ul li {
                margin-bottom: 4px;
                font-size: 0.98rem;
            }
            @media (max-width: 800px) {
                #modal-ficha .modal-content {
                    flex-direction: column;
                    max-width: 98vw;
                    max-height: 98vh;
                }
                #modal-ficha .modal-img {
                    max-width: 100vw;
                    border-radius: 12px 12px 0 0;
                }
                #modal-ficha .modal-info {
                    padding: 18px 8vw 18px 8vw;
                }
            }
            @media (max-width: 600px) {
                #modal-ficha .modal-content {
                    padding: 0;
                }
                #modal-ficha .modal-info {
                    padding: 14px 2vw 14px 2vw;
                }
                #modal-ficha .modal-img img {
                    max-width: 98vw;
                }
            }
        </style>
        <div class="modal-img">
            <img src="${dispositivo.url_img || '/midias/elev-fallback-tratores.png'}" alt="${dispositivo.nome}">
        </div>
        <div class="modal-info">
            <h2>${dispositivo.nome}</h2>
            <table>
                <tr><th>Código</th><td>${dados.codigo || '-'}</td></tr>
                <tr><th>Categoria</th><td>${dispositivo.categoria}</td></tr>
                <tr><th>Capacidade</th><td>${dados.capacidade || '-'}</td></tr>
                <tr><th>Tags</th><td>${(dispositivo.tags || []).join(', ')}</td></tr>
            </table>
            <h4 style="margin-top:18px;">Outros dados técnicos</h4>
            <ul>
                ${Object.entries(dados)
                    .filter(([k]) => !['codigo','capacidade','travamento'].includes(k))
                    .map(([k,v]) => `<li><strong>${k}:</strong> ${typeof v === 'object' ? JSON.stringify(v) : v}</li>`)
                    .join('')}
            </ul>
        </div>
    `;
    modal.style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-ficha').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    criarModal();
    await buscarDispositivos();
    configurarFiltros();
});

function gerarCategoriasDinamicamente(dispositivos) {
    const categorias = Array.from(new Set(dispositivos.map(d => d.categoria))).filter(Boolean);
    const select = document.getElementById('categoria-select');
    if (!select) return;
    select.innerHTML = '';
    // Opção 'Todas as categorias'
    const optTodos = document.createElement('option');
    optTodos.value = 'todos';
    optTodos.textContent = 'Todas as categorias';
    select.appendChild(optTodos);
    // Demais categorias
    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(opt);
    });
}

function ordenarDispositivosPorNome(dispositivos) {
    return [...dispositivos].sort((a, b) => {
        if (!a.nome) return 1;
        if (!b.nome) return -1;
        return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
    });
}

function renderizarPaginacao(totalItens) {
    let paginacao = document.getElementById('paginacao-dispositivos');
    if (!paginacao) {
        paginacao = document.createElement('div');
        paginacao.id = 'paginacao-dispositivos';
        paginacao.style.display = 'flex';
        paginacao.style.justifyContent = 'center';
        paginacao.style.gap = '12px';
        paginacao.style.margin = '32px 0 0 0';
        document.querySelector('.products-grid .container').appendChild(paginacao);
    }
    paginacao.innerHTML = '';
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    if (totalPaginas <= 1) {
        paginacao.style.display = 'none';
        return;
    }
    paginacao.style.display = 'flex';
    // Botão Anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'btn btn-outline';
    btnAnterior.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.onclick = () => { paginaAtual--; renderizarDispositivosPaginados(); };
    paginacao.appendChild(btnAnterior);
    // Números das páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = (i === paginaAtual) ? 'btn btn-primary' : 'btn btn-outline';
        btn.textContent = i;
        btn.disabled = i === paginaAtual;
        btn.onclick = () => { paginaAtual = i; renderizarDispositivosPaginados(); };
        paginacao.appendChild(btn);
    }
    // Botão Próxima
    const btnProximo = document.createElement('button');
    btnProximo.className = 'btn btn-outline';
    btnProximo.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.onclick = () => { paginaAtual++; renderizarDispositivosPaginados(); };
    paginacao.appendChild(btnProximo);
}

function renderizarDispositivosPaginados() {
    const total = dispositivosOrdenados.length;
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    renderizarDispositivos(dispositivosOrdenados.slice(inicio, fim));
    renderizarPaginacao(total);
    
    // Scroll suave ao topo da página, considerando a altura do cabeçalho
    const headerHeight = document.querySelector('header').offsetHeight; // Altura do cabeçalho
    window.scrollTo({
        top: headerHeight,
        behavior: 'smooth' // Transição suave
    });
}

async function buscarDispositivos() {
    // Selecionar apenas as colunas necessárias para o grid, aumentando a velocidade de resposta
    const { data, error } = await supabase
        .from('view_dispositivos_publicos')
        .select('id, nome, categoria, url_img, tags, dados_tecnicos');

    if (error) {
        console.error('Erro ao buscar dispositivos:', error);
        return;
    }
    dispositivosOriginais = data;
    gerarCategoriasDinamicamente(data);
    dispositivosOrdenados = ordenarDispositivosPorNome(data);
    paginaAtual = 1;
    renderizarDispositivosPaginados();
}

function renderizarDispositivos(dispositivos) {
    const wrapper = document.querySelector('.products-wrapper');
    wrapper.innerHTML = '';

    if (!dispositivos.length) {
        wrapper.innerHTML = '<p>Nenhum dispositivo encontrado.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    dispositivos.forEach(dispositivo => {
        const item = document.createElement('div');
        item.className = 'product-item';
        
        // Atributos de dados para filtros
        const capacidade = getCapacidadeFiltro(dispositivo.dados_tecnicos?.capacidade);
        item.setAttribute('data-category', dispositivo.categoria);
        item.setAttribute('data-capacidade', capacidade);

        const imgUrl = dispositivo.url_img || '/midias/elev-fallback-tratores.png';
        const codigo = dispositivo.dados_tecnicos?.codigo || '-';

        item.innerHTML = `
            <div class="product-image">
                <img src="${imgUrl}" 
                     alt="${dispositivo.nome}" 
                     loading="lazy" 
                     decoding="async"
                     style="width:100%;height:200px;object-fit:cover;">
            </div>
            <div class="product-details">
                <h3>${dispositivo.nome}</h3>
                <p class="product-code">Código: ${codigo}</p>
                <ul class="specs">
                    <li><strong>Categoria:</strong> ${dispositivo.categoria}</li>
                    <li><strong>Capacidade:</strong> ${dispositivo.dados_tecnicos?.capacidade || '-'}</li>
                    <li><strong>Tags:</strong> ${(dispositivo.tags || []).join(', ')}</li>
                </ul>
                <div class="product-actions">
                    <a href="https://wa.me/5551992399960?text=Gostaria%20de%20um%20orçamento" class="btn btn-primary" target="_blank">Solicitar orçamento</a>
                    <a href="#" class="btn btn-outline ver-ficha" data-id="${dispositivo.id}">Ver ficha técnica</a>
                </div>
            </div>
        `;
        
        // Evento para abrir modal
        item.querySelector('.ver-ficha').addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal(dispositivo);
        });
        
        fragment.appendChild(item);
    });
    
    wrapper.appendChild(fragment);
}

// Função para mapear capacidade para o filtro
function getCapacidadeFiltro(capacidade) {
    if (!capacidade) return 'todos';
    const cap = capacidade.toString().replace(/[^\d]/g, '');
    const valor = parseInt(cap, 10);
    if (valor <= 8) return 'ate-8t';
    if (valor <= 12) return 'ate-12t';
    if (valor <= 20) return 'ate-20t';
    if (valor > 20) return 'acima-20t';
    return 'todos';
}

// Filtros
function configurarFiltros() {
    const catSelect = document.getElementById('categoria-select');
    const capSelect = document.getElementById('capacidade');
    
    if (catSelect) catSelect.addEventListener('change', aplicarFiltros);
    if (capSelect) capSelect.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const categoria = document.getElementById('categoria-select').value;
    const capacidade = document.getElementById('capacidade').value;

    let filtrados = dispositivosOriginais;

    if (categoria !== 'todos') {
        filtrados = filtrados.filter(d => d.categoria === categoria);
    }

    if (capacidade !== 'todos') {
        filtrados = filtrados.filter(d => getCapacidadeFiltro(d.dados_tecnicos?.capacidade) === capacidade);
    }

    dispositivosOrdenados = ordenarDispositivosPorNome(filtrados);
    paginaAtual = 1;
    renderizarDispositivosPaginados();
}
