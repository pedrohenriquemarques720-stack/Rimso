// ===== INTERFACE.JS - FUNÇÕES QUE MODIFICAM A INTERFACE =====
console.log('🚀 Inicializando interface...');

// ==================== 1. BOTÕES DE AVALIAÇÃO ====================
function adicionarBotoesAvaliacao() {
    console.log('📝 Adicionando botões de avaliação...');
    
    const lojaCards = document.querySelectorAll('.loja-card');
    let contador = 0;
    
    lojaCards.forEach((card, index) => {
        // Evitar duplicar
        if (card.querySelector('.btn-avaliar')) return;
        
        const btnAvaliar = document.createElement('button');
        btnAvaliar.className = 'btn-avaliar';
        btnAvaliar.innerHTML = '<i class="fas fa-star"></i> Avaliar';
        btnAvaliar.style.cssText = `
            background: transparent;
            border: 2px solid #FFCE00;
            color: #FFCE00;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 13px;
            margin-top: 10px;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s;
        `;
        btnAvaliar.onmouseover = () => {
            btnAvaliar.style.background = '#FFCE00';
            btnAvaliar.style.color = '#000000';
        };
        btnAvaliar.onmouseout = () => {
            btnAvaliar.style.background = 'transparent';
            btnAvaliar.style.color = '#FFCE00';
        };
        btnAvaliar.onclick = (e) => {
            e.stopPropagation();
            alert(`Avaliar loja ${index + 1} - Função em desenvolvimento`);
        };
        
        card.style.position = 'relative';
        card.appendChild(btnAvaliar);
        contador++;
    });
    
    console.log(`✅ ${contador} botões de avaliação adicionados`);
}

// ==================== 2. BOTÕES DE COMPARTILHAR ====================
function adicionarBotoesCompartilhar() {
    console.log('📤 Adicionando botões de compartilhar...');
    
    const lojaCards = document.querySelectorAll('.loja-card');
    let contador = 0;
    
    lojaCards.forEach((card, index) => {
        if (card.querySelector('.btn-compartilhar')) return;
        
        const btnCompartilhar = document.createElement('button');
        btnCompartilhar.className = 'btn-compartilhar';
        btnCompartilhar.innerHTML = '<i class="fas fa-share-alt"></i>';
        btnCompartilhar.style.cssText = `
            position: absolute;
            top: 10px;
            right: 45px;
            background: #FFCE00;
            color: #000000;
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
        btnCompartilhar.onclick = (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado!');
        };
        
        card.style.position = 'relative';
        card.appendChild(btnCompartilhar);
        contador++;
    });
    
    console.log(`✅ ${contador} botões de compartilhar adicionados`);
}

// ==================== 3. MODIFICAR BOTÕES DE FAVORITO ====================
function modificarBotoesFavorito() {
    console.log('❤️ Modificando botões de favorito...');
    
    const botoesFavorito = document.querySelectorAll('.loja-favorite');
    let contador = 0;
    
    botoesFavorito.forEach((botao, index) => {
        botao.onclick = (e) => {
            e.stopPropagation();
            botao.classList.toggle('active');
            const icon = botao.querySelector('i');
            if (icon) {
                icon.className = botao.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
            }
            alert(botao.classList.contains('active') ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos');
        };
        contador++;
    });
    
    console.log(`✅ ${contador} botões de favorito modificados`);
}

// ==================== 4. ITEM FEED NO MENU ====================
function adicionarItemMenuFeed() {
    console.log('📱 Adicionando item Feed ao menu...');
    
    const menuCliente = document.querySelector('#appCliente .sidebar-cliente');
    if (!menuCliente) {
        console.log('⚠️ Menu do cliente não encontrado');
        return;
    }
    
    // Verificar se já existe
    if (document.querySelector('[data-menu="feed"]')) return;
    
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-menu', 'feed');
    menuItem.innerHTML = '<i class="fas fa-rss"></i> Feed';
    menuItem.onclick = () => {
        // Remover active de todos
        document.querySelectorAll('#appCliente .menu-item').forEach(i => i.classList.remove('active'));
        menuItem.classList.add('active');
        
        // Mostrar feed
        const content = document.getElementById('clienteContent');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h2>Feed de Novidades</h2>
                    <p>Em breve você verá as novidades das lojas aqui!</p>
                </div>
            `;
        }
    };
    
    // Inserir antes do "Voltar ao Admin"
    const voltarItem = Array.from(menuCliente.children).find(el => el.textContent.includes('Voltar'));
    if (voltarItem) {
        menuCliente.insertBefore(menuItem, voltarItem);
        console.log('✅ Item Feed adicionado ao menu');
    }
}

// ==================== 5. INICIALIZAR TUDO ====================
function inicializarInterface() {
    console.log('🎨 Inicializando interface...');
    
    adicionarBotoesAvaliacao();
    adicionarBotoesCompartilhar();
    modificarBotoesFavorito();
    adicionarItemMenuFeed();
    
    console.log('✅ Interface inicializada com sucesso!');
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para o DOM estar pronto
    setTimeout(inicializarInterface, 1500);
});

// Também executar quando mudar de seção
function observarMudancas() {
    const observer = new MutationObserver(() => {
        // Quando novas lojas forem carregadas, adicionar botões
        if (document.querySelector('.lojas-grid')) {
            setTimeout(() => {
                adicionarBotoesAvaliacao();
                adicionarBotoesCompartilhar();
                modificarBotoesFavorito();
            }, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

setTimeout(observarMudancas, 2000);
