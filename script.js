// ==================== RIMSO - JAVASCRIPT COMPLETO ====================

// ==================== DADOS ====================
const lojas = [
    {
        id: 1,
        nome: 'CS Surf Shop',
        categoria: 'surfwear',
        bairro: 'centro',
        endereco: 'Rua Moraes Barros, 806 - Centro',
        telefone: '(19) 3434-2454',
        whatsapp: '1999991234',
        avaliacao: 5.0,
        totalAvaliacoes: 127,
        descricao: 'A mais completa loja de surfwear de Piracicaba, com as melhores marcas do mercado.',
        imagem: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300',
        produtos: [
            { id: 1, nome: 'Chinelo Havaina', preco: 39.90, imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
            { id: 2, nome: 'Camiseta Surf', preco: 89.90, imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
            { id: 3, nome: 'Bermuda Surf', preco: 129.90, imagem: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200' }
        ]
    },
    {
        id: 2,
        nome: 'NRSurf',
        categoria: 'surfwear',
        bairro: 'alto',
        endereco: 'Av. Independência, 1200 - Alto',
        telefone: '(19) 3433-9012',
        whatsapp: '1998885678',
        avaliacao: 4.5,
        totalAvaliacoes: 89,
        descricao: 'Moda surfwear e streetwear para quem busca estilo e qualidade.',
        imagem: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300',
        produtos: [
            { id: 4, nome: 'Camiseta Oversized', preco: 89.90, imagem: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200' },
            { id: 5, nome: 'Boné Snapback', preco: 59.90, imagem: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=200' },
            { id: 6, nome: 'Moletom', preco: 149.90, imagem: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200' }
        ]
    },
    {
        id: 3,
        nome: 'Renata Modas',
        categoria: 'feminina',
        bairro: 'jardim-alvorada',
        endereco: 'Rua Carlos Augusto Strazzer, 20 - Jardim Alvorada',
        telefone: '(19) 3411-1193',
        whatsapp: '1997779012',
        avaliacao: 4.5,
        totalAvaliacoes: 156,
        descricao: 'Moda feminina para todas as ocasiões, com peças casuais e plus size.',
        imagem: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300',
        produtos: [
            { id: 7, nome: 'Vestido Floral', preco: 129.90, imagem: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=200' },
            { id: 8, nome: 'Blusa de Tricô', preco: 79.90, imagem: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200' },
            { id: 9, nome: 'Calça Legging', preco: 69.90, imagem: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200' }
        ]
    },
    {
        id: 4,
        nome: 'Teka Surf',
        categoria: 'surfwear',
        bairro: 'centro',
        endereco: 'Rua do Rosário, 450 - Centro',
        telefone: '(19) 3432-7890',
        whatsapp: '1996663456',
        avaliacao: 5.0,
        totalAvaliacoes: 234,
        descricao: 'Referência em surfwear em Piracicaba, com as principais marcas nacionais e internacionais.',
        imagem: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=300',
        produtos: [
            { id: 10, nome: 'Prancha de Surf', preco: 1899.90, imagem: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=200' },
            { id: 11, nome: 'Rash Guard', preco: 149.90, imagem: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200' },
            { id: 12, nome: 'Cera para prancha', preco: 19.90, imagem: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200' }
        ]
    },
    {
        id: 5,
        nome: 'Radical Vest Surf Shop',
        categoria: 'surfwear',
        bairro: 'centro',
        endereco: 'Rua Moraes Barros, 806 - Centro',
        telefone: '(19) 3434-2454',
        whatsapp: '1995556789',
        avaliacao: 4.0,
        totalAvaliacoes: 67,
        descricao: 'Tudo para o surfista, desde roupas até acessórios e equipamentos.',
        imagem: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=300',
        produtos: [
            { id: 13, nome: 'Jaqueta Jeans', preco: 199.90, imagem: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200' },
            { id: 14, nome: 'Camiseta Estampada', preco: 79.90, imagem: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200' },
            { id: 15, nome: 'Boné Trucker', preco: 49.90, imagem: 'https://images.unsplash.com/photo-1521369909029-2afc882c4ec7?w=200' }
        ]
    },
    {
        id: 6,
        nome: 'LÖS',
        categoria: 'autoral',
        bairro: 'centro',
        endereco: 'Rua do Porto, 300 - Centro',
        telefone: '(19) 3434-5678',
        whatsapp: '1994445678',
        avaliacao: 5.0,
        totalAvaliacoes: 98,
        descricao: 'Moda autoral da estilista Renata Kalil, com peças exclusivas e design único.',
        imagem: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
        produtos: [
            { id: 16, nome: 'Vestido Autoral', preco: 299.90, imagem: 'https://images.unsplash.com/photo-1583846783214-7229c91fdaeb?w=200' },
            { id: 17, nome: 'Camisa Social', preco: 189.90, imagem: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3cc7?w=200' },
            { id: 18, nome: 'Lenço de Seda', preco: 89.90, imagem: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200' }
        ]
    },
    {
        id: 7,
        nome: 'Vila Hípica Modas',
        categoria: 'masculina',
        bairro: 'vila-hipica',
        endereco: 'Av. Carlos Kuntz Busch, 600 - Vila Hípica',
        telefone: '(19) 3435-1234',
        whatsapp: '1993335678',
        avaliacao: 4.5,
        totalAvaliacoes: 145,
        descricao: 'Moda masculina para todas as ocasiões, do social ao esporte.',
        imagem: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
        produtos: [
            { id: 19, nome: 'Camisa Social', preco: 129.90, imagem: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200' },
            { id: 20, nome: 'Calça Jeans', preco: 149.90, imagem: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200' },
            { id: 21, nome: 'Tênis Casual', preco: 189.90, imagem: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200' }
        ]
    },
    {
        id: 8,
        nome: 'Ki Kids Moda Infantil',
        categoria: 'infantil',
        bairro: 'centro',
        endereco: 'Rua do Rosário, 800 - Centro',
        telefone: '(19) 3432-3456',
        whatsapp: '1992225678',
        avaliacao: 5.0,
        totalAvaliacoes: 234,
        descricao: 'A maior loja de moda infantil de Piracicaba, com roupas para crianças de todas as idades.',
        imagem: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300',
        produtos: [
            { id: 22, nome: 'Conjunto Infantil', preco: 89.90, imagem: 'https://images.unsplash.com/photo-1519278409-1f56dfe3f2b1?w=200' },
            { id: 23, nome: 'Vestido Infantil', preco: 69.90, imagem: 'https://images.unsplash.com/photo-1503919545889-a8c2cd2a8f1f?w=200' },
            { id: 24, nome: 'Macacão Bebê', preco: 59.90, imagem: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200' }
        ]
    }
];

let favoritos = JSON.parse(localStorage.getItem('rimso_favoritos')) || [];
let avaliacoes = JSON.parse(localStorage.getItem('rimso_avaliacoes')) || [];
let usuarios = JSON.parse(localStorage.getItem('rimso_usuarios')) || [];
let usuarioLogado = null;
let lojaAtual = null;
let timeoutBusca;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    carregarLojas();
    carregarProdutosDestaque();
    configurarEventos();
    console.log('🚀 RIMSO inicializado!');
});

function configurarEventos() {
    // Busca em tempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', buscarLojasInstantaneo);
    }
    
    // Estrelas da avaliação
    const ratingStars = document.querySelectorAll('#ratingStars i');
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingStars.forEach((s, i) => {
                s.className = i < rating ? 'fas fa-star' : 'far fa-star';
            });
        });
    });
    
    // Fechar modais clicando fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
}

// ==================== LOJAS ====================
function carregarLojas() {
    mostrarLoading(true);
    
    setTimeout(() => {
        const grid = document.getElementById('lojasGrid');
        const total = document.getElementById('totalLojas');
        
        if (total) total.textContent = `${lojas.length} lojas encontradas`;
        
        if (grid) {
            grid.innerHTML = lojas.map(loja => criarCardLoja(loja)).join('');
        }
        
        mostrarLoading(false);
    }, 500);
}

function criarCardLoja(loja) {
    const isFavorito = favoritos.includes(loja.id);
    
    return `
        <div class="loja-card" onclick="abrirLoja(${loja.id})">
            <div class="loja-cover">
                <img src="${loja.imagem}" alt="${loja.nome}" loading="lazy">
                <span class="loja-badge">${loja.categoria.toUpperCase()}</span>
                <div class="loja-favorite" onclick="event.stopPropagation(); toggleFavorito(${loja.id})">
                    <i class="fa${isFavorito ? 's' : 'r'} fa-heart"></i>
                </div>
            </div>
            <div class="loja-info">
                <div class="loja-nome">${loja.nome}</div>
                <div class="loja-endereco">
                    <i class="fas fa-map-marker-alt"></i> ${loja.endereco}
                </div>
                <div class="loja-avaliacao">
                    <span class="stars">${'★'.repeat(Math.floor(loja.avaliacao))}${loja.avaliacao % 1 ? '½' : ''}</span>
                    <span class="avaliacao-numero">(${loja.totalAvaliacoes})</span>
                </div>
                <div class="loja-categorias">
                    ${loja.produtos.slice(0,3).map(p => `<span class="categoria-tag">${p.nome}</span>`).join('')}
                </div>
                <div class="loja-footer">
                    <button class="loja-contato" onclick="event.stopPropagation(); contatoWhatsapp('${loja.whatsapp}')">
                        <i class="fab fa-whatsapp"></i> Contato
                    </button>
                    <span class="loja-whatsapp"><i class="fab fa-whatsapp"></i></span>
                </div>
            </div>
        </div>
    `;
}

function abrirLoja(id) {
    const loja = lojas.find(l => l.id === id);
    if (!loja) return;
    
    lojaAtual = loja;
    
    const content = document.getElementById('lojaPageContent');
    const siteContent = document.getElementById('siteContent');
    const lojaPage = document.getElementById('lojaPage');
    
    if (content) {
        content.innerHTML = `
            <div style="margin-bottom: 30px;">
                <div class="loja-page-header">
                    <div class="loja-page-cover">
                        <img src="${loja.imagem}" alt="${loja.nome}">
                    </div>
                    <div class="loja-page-info">
                        <div class="loja-page-nome">${loja.nome}</div>
                        <div class="loja-page-endereco">
                            <i class="fas fa-map-marker-alt"></i> ${loja.endereco}
                        </div>
                        <div class="loja-page-meta">
                            <div class="loja-page-meta-item">
                                <i class="fas fa-phone" style="color: var(--accent);"></i> ${loja.telefone}
                            </div>
                            <div class="loja-page-meta-item">
                                <i class="fab fa-whatsapp" style="color: #25D366;"></i> ${loja.whatsapp}
                            </div>
                            <div class="loja-page-meta-item">
                                <i class="fas fa-star" style="color: var(--warning);"></i> ${loja.avaliacao} (${loja.totalAvaliacoes} avaliações)
                            </div>
                        </div>
                        <p style="color: var(--gray); margin-top: 15px;">${loja.descricao}</p>
                        <button class="banner-btn" style="margin-top: 15px;" onclick="abrirModalAvaliacao(${loja.id})">
                            <i class="fas fa-star"></i> Avaliar esta loja
                        </button>
                    </div>
                </div>
                
                <h3 style="margin: 30px 0 20px;">Produtos</h3>
                <div class="produtos-grid">
                    ${loja.produtos.map(p => `
                        <div class="produto-card" onclick="abrirProduto(${p.id})">
                            <div class="produto-image">
                                <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
                            </div>
                            <div class="produto-nome">${p.nome}</div>
                            <div class="produto-preco">R$ ${p.preco.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <h3 style="margin: 30px 0 20px;">Avaliações</h3>
                <div id="avaliacoesLista">
                    ${carregarAvaliacoes(loja.id)}
                </div>
                
                <div class="map-container" id="map"></div>
            </div>
        `;
    }
    
    if (siteContent) siteContent.classList.add('hidden');
    if (lojaPage) lojaPage.classList.remove('hidden');
    
    setTimeout(() => {
        inicializarMapa(loja);
    }, 500);
}

function voltarHome() {
    const lojaPage = document.getElementById('lojaPage');
    const dashboard = document.getElementById('dashboardLojista');
    const siteContent = document.getElementById('siteContent');
    
    if (lojaPage) lojaPage.classList.add('hidden');
    if (dashboard) dashboard.classList.add('hidden');
    if (siteContent) siteContent.classList.remove('hidden');
    
    carregarLojas();
}

// ==================== PRODUTOS ====================
function carregarProdutosDestaque() {
    const destaques = lojas.flatMap(l => l.produtos).slice(0, 8);
    const grid = document.getElementById('produtosDestaque');
    
    if (grid) {
        grid.innerHTML = destaques.map(p => {
            const loja = lojas.find(l => l.produtos.some(prod => prod.id === p.id));
            return `
                <div class="featured-item" onclick="abrirProduto(${p.id})">
                    <div class="featured-image">
                        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
                    </div>
                    <div class="featured-info">
                        <div class="featured-nome">${p.nome}</div>
                        <div class="featured-preco">R$ ${p.preco.toFixed(2)}</div>
                        <div class="featured-loja">${loja.nome}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function abrirProduto(id) {
    let produtoEncontrado = null;
    let lojaEncontrada = null;
    
    for (const loja of lojas) {
        const produto = loja.produtos.find(p => p.id === id);
        if (produto) {
            produtoEncontrado = produto;
            lojaEncontrada = loja;
            break;
        }
    }
    
    if (!produtoEncontrado) return;
    
    const modalNome = document.getElementById('modalProdutoNome');
    const modalContent = document.getElementById('modalProdutoContent');
    
    if (modalNome) modalNome.textContent = produtoEncontrado.nome;
    if (modalContent) {
        modalContent.innerHTML = `
            <div style="text-align: center;">
                <img src="${produtoEncontrado.imagem}" alt="${produtoEncontrado.nome}" style="max-width: 100%; border-radius: 20px; margin-bottom: 20px;">
                <p style="margin-bottom: 10px;"><strong>Loja:</strong> ${lojaEncontrada.nome}</p>
                <p style="margin-bottom: 10px;"><strong>Preço:</strong> R$ ${produtoEncontrado.preco.toFixed(2)}</p>
                <button class="banner-btn" style="width: 100%;" onclick="contatoWhatsapp('${lojaEncontrada.whatsapp}')">
                    <i class="fab fa-whatsapp"></i> Comprar via WhatsApp
                </button>
            </div>
        `;
    }
    
    abrirModal('modalProduto');
}

// ==================== FILTROS ====================
function filtrarCategoria(categoria) {
    // Atualizar classes active
    document.querySelectorAll('.filter-chip, .categories-list a, .sidebar-menu a').forEach(el => {
        el.classList.remove('active');
    });
    
    if (event?.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    const lojasFiltradas = categoria === 'todos' 
        ? lojas 
        : lojas.filter(l => l.categoria === categoria);
    
    const grid = document.getElementById('lojasGrid');
    const titulo = document.getElementById('tituloLojas');
    const total = document.getElementById('totalLojas');
    
    if (titulo) titulo.textContent = categoria === 'todos' ? 'Todas as lojas' : `Lojas de ${categoria}`;
    if (total) total.textContent = `${lojasFiltradas.length} lojas encontradas`;
    
    if (grid) {
        grid.innerHTML = lojasFiltradas.map(loja => criarCardLoja(loja)).join('');
    }
}

function filtrarBairro(bairro) {
    const lojasFiltradas = lojas.filter(l => l.bairro === bairro);
    
    const grid = document.getElementById('lojasGrid');
    const titulo = document.getElementById('tituloLojas');
    const total = document.getElementById('totalLojas');
    
    if (titulo) titulo.textContent = `Lojas em ${bairro}`;
    if (total) total.textContent = `${lojasFiltradas.length} lojas encontradas`;
    
    if (grid) {
        grid.innerHTML = lojasFiltradas.map(loja => criarCardLoja(loja)).join('');
    }
}

function buscarLojasInstantaneo() {
    clearTimeout(timeoutBusca);
    
    timeoutBusca = setTimeout(() => {
        const termo = document.getElementById('searchInput').value.toLowerCase();
        
        if (termo.length < 2 && termo.length > 0) return;
        
        const lojasFiltradas = lojas.filter(l => 
            l.nome.toLowerCase().includes(termo) || 
            l.descricao.toLowerCase().includes(termo) ||
            l.produtos.some(p => p.nome.toLowerCase().includes(termo))
        );
        
        const grid = document.getElementById('lojasGrid');
        const titulo = document.getElementById('tituloLojas');
        const total = document.getElementById('totalLojas');
        
        if (titulo) titulo.textContent = termo ? `Resultados para "${termo}"` : 'Todas as lojas';
        if (total) total.textContent = `${lojasFiltradas.length} lojas encontradas`;
        
        if (lojasFiltradas.length === 0) {
            if (grid) grid.innerHTML = '<div style="text-align: center; padding: 50px; grid-column: 1/-1;">Nenhuma loja encontrada</div>';
            return;
        }
        
        if (grid) {
            grid.innerHTML = lojasFiltradas.map(loja => {
                let card = criarCardLoja(loja);
                if (termo) {
                    const regex = new RegExp(termo, 'gi');
                    card = card.replace(new RegExp(termo, 'gi'), match => `<mark style="background: var(--warning);">${match}</mark>`);
                }
                return card;
            }).join('');
        }
    }, 300);
}

function ordenarLojas(tipo) {
    let lojasOrdenadas = [...lojas];
    
    switch(tipo) {
        case 'avaliacao':
            lojasOrdenadas.sort((a, b) => b.avaliacao - a.avaliacao);
            break;
        case 'nome':
            lojasOrdenadas.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        default:
            lojasOrdenadas = lojas;
    }
    
    const grid = document.getElementById('lojasGrid');
    const total = document.getElementById('totalLojas');
    
    if (total) total.textContent = `${lojasOrdenadas.length} lojas encontradas`;
    
    if (grid) {
        grid.innerHTML = lojasOrdenadas.map(loja => criarCardLoja(loja)).join('');
    }
}

// ==================== FAVORITOS ====================
function toggleFavorito(id) {
    const index = favoritos.indexOf(id);
    if (index === -1) {
        favoritos.push(id);
        mostrarToast('❤️ Adicionado aos favoritos');
    } else {
        favoritos.splice(index, 1);
        mostrarToast('Removido dos favoritos');
    }
    localStorage.setItem('rimso_favoritos', JSON.stringify(favoritos));
    
    // Atualizar ícones na página atual
    document.querySelectorAll(`.loja-favorite i`).forEach(icon => {
        const card = icon.closest('.loja-card');
        if (card && card.querySelector(`[onclick*="abrirLoja(${id})"]`)) {
            icon.className = favoritos.includes(id) ? 'fas fa-heart' : 'far fa-heart';
        }
    });
}

// ==================== AVALIAÇÕES ====================
function carregarAvaliacoes(lojaId) {
    const avals = avaliacoes.filter(a => a.lojaId === lojaId);
    
    if (avals.length === 0) {
        return '<p style="text-align: center; padding: 20px;">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>';
    }
    
    return avals.map(av => `
        <div class="avaliacao-item">
            <div class="avaliacao-header">
                <div class="avaliacao-usuario">
                    <div class="avaliacao-avatar">${av.usuario?.charAt(0) || 'U'}</div>
                    <span>${av.usuario || 'Cliente'}</span>
                </div>
                <div class="avaliacao-nota">${'★'.repeat(av.nota)}${'☆'.repeat(5-av.nota)}</div>
            </div>
            <div class="avaliacao-data">${new Date(av.data).toLocaleDateString()}</div>
            <div class="avaliacao-comentario">${av.comentario}</div>
        </div>
    `).join('');
}

function abrirModalAvaliacao(lojaId) {
    const modal = document.getElementById('modalAvaliar');
    if (modal) {
        modal.dataset.lojaId = lojaId;
        
        // Resetar estrelas
        const stars = modal.querySelectorAll('#ratingStars i');
        stars.forEach(star => {
            star.className = 'far fa-star';
        });
        
        // Limpar comentário
        const comentario = document.getElementById('avaliacaoComentario');
        if (comentario) comentario.value = '';
        
        abrirModal('modalAvaliar');
    }
}

function enviarAvaliacao() {
    const modal = document.getElementById('modalAvaliar');
    const lojaId = parseInt(modal?.dataset.lojaId || '0');
    const nota = document.querySelectorAll('#ratingStars i.fas').length;
    const comentario = document.getElementById('avaliacaoComentario')?.value || '';
    
    if (nota === 0) {
        mostrarToast('Selecione uma nota', 'error');
        return;
    }
    
    const novaAvaliacao = {
        id: Date.now(),
        lojaId,
        usuario: usuarioLogado?.nome || 'Cliente',
        nota,
        comentario,
        data: new Date().toISOString()
    };
    
    avaliacoes.push(novaAvaliacao);
    localStorage.setItem('rimso_avaliacoes', JSON.stringify(avaliacoes));
    
    mostrarToast('⭐ Avaliação enviada! Obrigado!');
    fecharModal('modalAvaliar');
    
    // Se estiver na página da loja, recarregar avaliações
    if (lojaAtual && lojaAtual.id === lojaId) {
        const lista = document.getElementById('avaliacoesLista');
        if (lista) lista.innerHTML = carregarAvaliacoes(lojaId);
    }
}

// ==================== MAPA ====================
function inicializarMapa(loja) {
    if (!window.google) return;
    
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;
    
    // Coordenadas aproximadas de Piracicaba
    const pos = { lat: -22.7243, lng: -47.6475 };
    
    const map = new google.maps.Map(mapDiv, {
        center: pos,
        zoom: 15,
        styles: [
            {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
            }
        ]
    });
    
    new google.maps.Marker({
        position: pos,
        map: map,
        title: loja.nome,
        animation: google.maps.Animation.DROP
    });
}

// ==================== DASHBOARD ====================
function mostrarDashboard() {
    const siteContent = document.getElementById('siteContent');
    const lojaPage = document.getElementById('lojaPage');
    const dashboard = document.getElementById('dashboardLojista');
    
    if (siteContent) siteContent.classList.add('hidden');
    if (lojaPage) lojaPage.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
}

// ==================== CONTATO ====================
function contatoWhatsapp(numero) {
    const numeroLimpo = numero.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
}

// ==================== LOGIN / CADASTRO ====================
function fazerLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const senha = document.getElementById('loginSenha')?.value;
    
    // Simular login
    usuarioLogado = { nome: 'Lojista', email };
    mostrarToast('✅ Login realizado com sucesso!');
    fecharModal('modalLogin');
}

function fazerCadastro(event) {
    event.preventDefault();
    const nome = document.getElementById('cadastroNome')?.value;
    
    if (nome) {
        usuarios.push({ nome });
        localStorage.setItem('rimso_usuarios', JSON.stringify(usuarios));
        
        mostrarToast('✅ Cadastro realizado com sucesso!');
        fecharModal('modalCadastro');
    }
}

// ==================== MODAIS ====================
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// ==================== TOAST ====================
function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = mensagem;
    toast.className = `toast ${tipo} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== LOADING ====================
function mostrarLoading(mostrar = true) {
    let loading = document.getElementById('loading-spinner');
    
    if (mostrar) {
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loading-spinner';
            loading.className = 'loading-spinner';
            loading.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
            `;
            document.body.appendChild(loading);
        }
    } else {
        if (loading) {
            loading.remove();
        }
    }
}

// ==================== MENU MOBILE ====================
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay') || criarOverlay();
    
    if (sidebar) sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function criarOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleMobileMenu;
    document.body.appendChild(overlay);
    return overlay;
}
