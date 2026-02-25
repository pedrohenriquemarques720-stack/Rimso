// ==================== INTEGRAÇÃO DAS FUNÇÕES ====================

// Aguardar carregamento completo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Iniciando integração...');
    
    // Pequeno delay para garantir que todos os scripts carregaram
    setTimeout(() => {
        integrarTodasFuncoes();
    }, 1000);
});

// Função principal de integração
function integrarTodasFuncoes() {
    console.log('📦 Integrando módulos...');
    
    integrarAvaliacoes();
    integrarFeed();
    integrarFavoritos();
    integrarNotificacoes();
    integrarPromocoes();
    integrarCompartilhamento();
    integrarFiltros();
    integrarRotas();
    integrarEstatisticas();
    integrarAdminAdv();
    
    console.log('✅ Integração concluída!');
}

// ==================== 1. AVALIAÇÕES ====================
function integrarAvaliacoes() {
    if (typeof criarModalAvaliacao !== 'function') {
        console.warn('⚠️ Função criarModalAvaliacao não encontrada');
        return;
    }
    
    // Criar modal de avaliação
    criarModalAvaliacao();
    
    // Adicionar botão "Avaliar" nos cards de loja
    adicionarBotoesAvaliacao();
    
    console.log('✅ Avaliações integrado');
}

function adicionarBotoesAvaliacao() {
    const lojaCards = document.querySelectorAll('.loja-card');
    
    lojaCards.forEach((card, index) => {
        if (card.querySelector('.btn-avaliar')) return;
        
        const lojaId = index + 1;
        const btnAvaliar = document.createElement('button');
        btnAvaliar.className = 'btn-avaliar';
        btnAvaliar.innerHTML = '<i class="fas fa-star"></i> Avaliar';
        btnAvaliar.style.cssText = `
            background: transparent;
            border: 2px solid var(--gold);
            color: var(--gold);
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 13px;
            margin-top: 10px;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s;
        `;
        btnAvaliar.onmouseover = () => {
            btnAvaliar.style.background = 'var(--gold)';
            btnAvaliar.style.color = 'var(--black)';
        };
        btnAvaliar.onmouseout = () => {
            btnAvaliar.style.background = 'transparent';
            btnAvaliar.style.color = 'var(--gold)';
        };
        btnAvaliar.onclick = (e) => {
            e.stopPropagation();
            if (typeof abrirAvaliacao === 'function') {
                abrirAvaliacao(lojaId);
            } else {
                alert('Função de avaliação não disponível');
            }
        };
        
        card.style.position = 'relative';
        card.appendChild(btnAvaliar);
    });
}

// ==================== 2. FEED ====================
function integrarFeed() {
    if (typeof criarFeedInicial !== 'function') {
        console.warn('⚠️ Função criarFeedInicial não encontrada');
        return;
    }
    
    criarFeedInicial();
    
    // Adicionar item "Feed" no menu do cliente
    adicionarItemMenuFeed();
    
    console.log('✅ Feed integrado');
}

function adicionarItemMenuFeed() {
    const menuCliente = document.querySelector('#appCliente .sidebar-cliente');
    if (!menuCliente) return;
    
    // Verificar se já existe
    if (document.querySelector('[data-menu="feed"]')) return;
    
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-menu', 'feed');
    menuItem.innerHTML = '<i class="fas fa-rss"></i> Feed';
    menuItem.onclick = () => {
        // Ativar item
        document.querySelectorAll('#appCliente .menu-item').forEach(i => i.classList.remove('active'));
        menuItem.classList.add('active');
        
        // Mostrar feed
        mostrarFeed();
    };
    
    // Inserir antes do último item (Voltar ao Admin)
    const itens = menuCliente.children;
    const voltarItem = Array.from(itens).find(el => el.textContent.includes('Voltar'));
    if (voltarItem) {
        menuCliente.insertBefore(menuItem, voltarItem);
    }
}

function mostrarFeed() {
    const content = document.getElementById('clienteContent');
    if (!content) return;
    
    if (typeof carregarFeed === 'function') {
        // Criar container do feed se não existir
        let feedContainer = document.getElementById('feedContainer');
        if (!feedContainer) {
            feedContainer = document.createElement('div');
            feedContainer.id = 'feedContainer';
            content.innerHTML = '';
            content.appendChild(feedContainer);
        }
        carregarFeed();
    } else {
        content.innerHTML = '<p style="text-align: center; padding: 40px;">Feed não disponível</p>';
    }
}

// ==================== 3. FAVORITOS ====================
function integrarFavoritos() {
    if (typeof criarModalListas !== 'function') {
        console.warn('⚠️ Função criarModalListas não encontrada');
        return;
    }
    
    criarModalListas();
    
    // Modificar botões de favorito existentes
    modificarBotoesFavorito();
    
    console.log('✅ Favoritos integrado');
}

function modificarBotoesFavorito() {
    const botoesFavorito = document.querySelectorAll('.loja-favorite');
    
    botoesFavorito.forEach((botao, index) => {
        const lojaId = index + 1;
        
        botao.onclick = (e) => {
            e.stopPropagation();
            if (typeof mostrarMenuListas === 'function') {
                mostrarMenuListas(lojaId, e);
            } else {
                // Fallback para favorito simples
                botao.classList.toggle('active');
                const icon = botao.querySelector('i');
                if (icon) {
                    icon.className = botao.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
                }
            }
        };
    });
}

// ==================== 4. NOTIFICAÇÕES ====================
function integrarNotificacoes() {
    if (typeof criarPainelNotificacoes !== 'function') {
        console.warn('⚠️ Função criarPainelNotificacoes não encontrada');
        return;
    }
    
    criarPainelNotificacoes();
    
    // Conectar o sino de notificação
    const notificacaoBtn = document.querySelector('.notification-badge');
    if (notificacaoBtn && typeof abrirNotificacoes === 'function') {
        notificacaoBtn.onclick = abrirNotificacoes;
    }
    
    console.log('✅ Notificações integrado');
}

// ==================== 5. PROMOÇÕES ====================
function integrarPromocoes() {
    if (typeof criarModalPromocao !== 'function') {
        console.warn('⚠️ Função criarModalPromocao não encontrada');
        return;
    }
    
    criarModalPromocao();
    
    // Adicionar botão no painel do lojista
    adicionarBotaoPromocoes();
    
    console.log('✅ Promoções integrado');
}

function adicionarBotaoPromocoes() {
    const menuLojista = document.querySelector('#appLojista .sidebar-lojista');
    if (!menuLojista) return;
    
    // Verificar se já existe
    if (document.querySelector('[data-menu="promocoes"]')) return;
    
    // Encontrar o botão de promoções existente no conteúdo
    const btnPromo = document.querySelector('.btn-gold[onclick*="criarPromocao"]');
    if (btnPromo && typeof btnPromo.onclick !== 'function') {
        btnPromo.onclick = (e) => {
            e.preventDefault();
            if (typeof abrirModalPromocao === 'function') {
                abrirModalPromocao();
            }
        };
    }
}

// ==================== 6. COMPARTILHAMENTO ====================
function integrarCompartilhamento() {
    if (typeof criarBotaoCompartilhar !== 'function') {
        console.warn('⚠️ Função criarBotaoCompartilhar não encontrada');
        return;
    }
    
    criarBotaoCompartilhar();
    
    // Adicionar botões de compartilhar nos cards
    adicionarBotoesCompartilhar();
    
    console.log('✅ Compartilhamento integrado');
}

function adicionarBotoesCompartilhar() {
    const lojaCards = document.querySelectorAll('.loja-card');
    
    lojaCards.forEach((card, index) => {
        if (card.querySelector('.btn-compartilhar')) return;
        
        const lojaId = index + 1;
        const btnCompartilhar = document.createElement('button');
        btnCompartilhar.className = 'btn-compartilhar';
        btnCompartilhar.innerHTML = '<i class="fas fa-share-alt"></i>';
        btnCompartilhar.style.cssText = `
            position: absolute;
            top: 10px;
            right: 45px;
            background: var(--gold);
            color: var(--black);
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: all 0.3s;
        `;
        btnCompartilhar.onmouseover = () => {
            btnCompartilhar.style.transform = 'scale(1.1)';
        };
        btnCompartilhar.onmouseout = () => {
            btnCompartilhar.style.transform = 'scale(1)';
        };
        btnCompartilhar.onclick = (e) => {
            e.stopPropagation();
            if (typeof compartilharLoja === 'function') {
                compartilharLoja(lojaId);
            } else {
                // Fallback
                navigator.clipboard.writeText(window.location.href);
                mostrarToast('Link copiado!');
            }
        };
        
        card.style.position = 'relative';
        card.appendChild(btnCompartilhar);
    });
}

// ==================== 7. FILTROS ====================
function integrarFiltros() {
    if (typeof criarBarraFiltros !== 'function') {
        console.warn('⚠️ Função criarBarraFiltros não encontrada');
        return;
    }
    
    // Verificar se estamos na seção de lojas
    const lojasContainer = document.getElementById('lojasContainer');
    if (lojasContainer) {
        criarBarraFiltros();
    }
    
    console.log('✅ Filtros integrado');
}

// ==================== 8. ROTAS ====================
function integrarRotas() {
    if (typeof inicializarMapa !== 'function') {
        console.warn('⚠️ Função inicializarMapa não encontrada');
        return;
    }
    
    // Inicializar mapa quando a seção mapa for aberta
    const mapaBtn = document.querySelector('[data-secao="mapa"]');
    if (mapaBtn) {
        mapaBtn.addEventListener('click', function() {
            setTimeout(() => {
                const mapElement = document.getElementById('map');
                if (mapElement && typeof inicializarMapa === 'function') {
                    inicializarMapa('map');
                }
            }, 500);
        });
    }
    
    console.log('✅ Rotas integrado');
}

// ==================== 9. ESTATÍSTICAS ====================
function integrarEstatisticas() {
    if (typeof carregarDashboardLojista !== 'function') {
        console.warn('⚠️ Função carregarDashboardLojista não encontrada');
        return;
    }
    
    // Quando entrar no modo lojista, carregar estatísticas
    const modoLojistaBtn = document.querySelector('.admin-btn.lojista');
    if (modoLojistaBtn) {
        modoLojistaBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (typeof carregarDashboardLojista === 'function') {
                    carregarDashboardLojista(1);
                }
            }, 1000);
        });
    }
    
    console.log('✅ Estatísticas integrado');
}

// ==================== 10. ADMIN AVANÇADO ====================
function integrarAdminAdv() {
    if (typeof inicializarPainelAdmin !== 'function') {
        console.warn('⚠️ Função inicializarPainelAdmin não encontrada');
        return;
    }
    
    // Inicializar painel admin quando logado como admin
    if (document.getElementById('adminPanel') && !document.getElementById('adminPanel').classList.contains('hidden')) {
        inicializarPainelAdmin();
    }
    
    console.log('✅ Admin avançado integrado');
}

// ==================== OBSERVAR MUDANÇAS ====================
// Observar quando novas lojas são carregadas
function observarMudancas() {
    const observer = new MutationObserver(() => {
        adicionarBotoesAvaliacao();
        modificarBotoesFavorito();
        adicionarBotoesCompartilhar();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Iniciar observador
setTimeout(observarMudancas, 2000);
