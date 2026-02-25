// ==================== RIMSO - ARQUIVO ÚNICO CORRIGIDO PARA IFRAME ====================
console.log('🚀 RIMSO - Iniciando...');

// Função para acessar o documento correto (dentro ou fora do iframe)
function getDocument() {
    // Tenta acessar o documento principal
    if (window.top.document) {
        return window.top.document;
    }
    return document;
}

// Função para aguardar elemento aparecer
function waitForElement(selector, callback, maxAttempts = 20) {
    let attempts = 0;
    
    const checkInterval = setInterval(() => {
        attempts++;
        const doc = getDocument();
        const element = doc.querySelector(selector);
        
        if (element) {
            clearInterval(checkInterval);
            console.log(`✅ Elemento encontrado: ${selector}`);
            callback(element);
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.log(`❌ Elemento não encontrado após ${maxAttempts} tentativas: ${selector}`);
        }
    }, 500);
}

// Função para injetar lojas diretamente no DOM
function injetarLojas() {
    console.log('🏪 Tentando injetar lojas...');
    
    const doc = getDocument();
    
    // Procurar pelo conteúdo do cliente
    const clienteContent = doc.getElementById('clienteContent');
    if (!clienteContent) {
        console.log('⏳ Aguardando clienteContent...');
        return false;
    }
    
    // Verificar se está no modo cliente
    const appCliente = doc.getElementById('appCliente');
    if (appCliente && appCliente.classList.contains('hidden')) {
        console.log('⏳ Modo cliente não está ativo');
        return false;
    }
    
    console.log('✅ ClienteContent encontrado, injetando lojas...');
    
    // Lojas de exemplo
    const lojas = [
        {
            id: 1,
            nome: 'Moda Center Piracicaba',
            bairro: 'Centro',
            categoria: 'Roupas',
            avaliacao: 4.8,
            totalAvaliacoes: 156
        },
        {
            id: 2,
            nome: 'StreetWear Club',
            bairro: 'Alto',
            categoria: 'Streetwear',
            avaliacao: 4.6,
            totalAvaliacoes: 89
        },
        {
            id: 3,
            nome: 'Kids Fashion',
            bairro: 'Pauliceia',
            categoria: 'Infantil',
            avaliacao: 4.9,
            totalAvaliacoes: 234
        },
        {
            id: 4,
            nome: 'Plus Size Store',
            bairro: 'Cidade Alta',
            categoria: 'Plus Size',
            avaliacao: 4.7,
            totalAvaliacoes: 67
        },
        {
            id: 5,
            nome: 'Calçados City',
            bairro: 'Centro',
            categoria: 'Calçados',
            avaliacao: 4.5,
            totalAvaliacoes: 112
        }
    ];
    
    // Criar HTML das lojas
    const lojasHTML = `
        <h2 style="margin-bottom: 20px; color: #1A1A1A;">Lojas em Piracicaba</h2>
        <div class="lojas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${lojas.map(loja => `
                <div class="loja-card" data-loja-id="${loja.id}" style="background: white; border-radius: 20px; padding: 20px; border: 2px solid #E5E7EB; cursor: pointer; position: relative; transition: all 0.3s;">
                    <h3 style="margin-bottom: 10px; color: #1A1A1A; font-size: 18px;">${loja.nome}</h3>
                    <p style="margin-bottom: 5px; color: #DD0000;">📍 ${loja.bairro}</p>
                    <p style="margin-bottom: 5px; color: #FFCE00;">⭐ ${loja.avaliacao} (${loja.totalAvaliacoes} avaliações)</p>
                    <p style="color: #6B7280; font-size: 14px;">${loja.categoria}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    clienteContent.innerHTML = lojasHTML;
    console.log('✅ Lojas injetadas com sucesso!');
    
    // Adicionar botões após injetar as lojas
    setTimeout(adicionarBotoes, 500);
    
    return true;
}

// Função para adicionar botões nos cards
function adicionarBotoes() {
    console.log('🔧 Adicionando botões nos cards...');
    
    const doc = getDocument();
    const cards = doc.querySelectorAll('.loja-card');
    
    console.log(`📦 Encontrados ${cards.length} cards`);
    
    if (cards.length === 0) {
        console.log('⚠️ Nenhum card encontrado');
        return;
    }
    
    cards.forEach((card, index) => {
        // Evitar duplicar
        if (card.querySelector('.botoes-rimso')) return;
        
        // Container
        const container = doc.createElement('div');
        container.className = 'botoes-rimso';
        container.style.cssText = 'display: flex; gap: 10px; margin-top: 15px;';
        
        // Botão Avaliar
        const btnAvaliar = doc.createElement('button');
        btnAvaliar.innerHTML = '⭐ Avaliar';
        btnAvaliar.style.cssText = `
            background: #FFCE00;
            color: #000;
            border: none;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            flex: 1;
            transition: all 0.3s;
        `;
        btnAvaliar.onmouseover = () => {
            btnAvaliar.style.background = '#DD0000';
            btnAvaliar.style.color = '#FFF';
        };
        btnAvaliar.onmouseout = () => {
            btnAvaliar.style.background = '#FFCE00';
            btnAvaliar.style.color = '#000';
        };
        btnAvaliar.onclick = (e) => {
            e.stopPropagation();
            alert(`⭐ Avaliar loja ${index + 1}`);
        };
        
        // Botão Compartilhar
        const btnShare = doc.createElement('button');
        btnShare.innerHTML = '📤';
        btnShare.style.cssText = `
            background: #FFCE00;
            color: #000;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        `;
        btnShare.onmouseover = () => {
            btnShare.style.background = '#DD0000';
            btnShare.style.color = '#FFF';
            btnShare.style.transform = 'scale(1.1)';
        };
        btnShare.onmouseout = () => {
            btnShare.style.background = '#FFCE00';
            btnShare.style.color = '#000';
            btnShare.style.transform = 'scale(1)';
        };
        btnShare.onclick = (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.href);
            alert('🔗 Link copiado!');
        };
        
        container.appendChild(btnAvaliar);
        container.appendChild(btnShare);
        card.appendChild(container);
    });
    
    console.log(`✅ Botões adicionados em ${cards.length} cards!`);
}

// Função para observar mudanças
function observarMudancas() {
    console.log('👀 Iniciando observação...');
    
    const doc = getDocument();
    
    // Verificar a cada segundo se o modo cliente foi ativado
    setInterval(() => {
        const appCliente = doc.getElementById('appCliente');
        const clienteContent = doc.getElementById('clienteContent');
        
        if (appCliente && !appCliente.classList.contains('hidden')) {
            // Verificar se já tem lojas
            const lojasGrid = doc.querySelector('.lojas-grid');
            if (!lojasGrid) {
                console.log('🔄 Modo cliente ativo, injetando lojas...');
                injetarLojas();
            } else {
                // Se já tem lojas mas não tem botões, adicionar botões
                const primeiroCard = doc.querySelector('.loja-card');
                if (primeiroCard && !primeiroCard.querySelector('.botoes-rimso')) {
                    console.log('🔄 Cards encontrados sem botões, adicionando...');
                    adicionarBotoes();
                }
            }
        }
    }, 1000);
    
    // Também observar quando o admin clicar no botão de modo cliente
    const originalAbrirModoCliente = window.top.abrirModoCliente;
    if (originalAbrirModoCliente) {
        window.top.abrirModoCliente = function() {
            console.log('👤 Modo cliente ativado por clique');
            if (typeof originalAbrirModoCliente === 'function') {
                originalAbrirModoCliente();
            }
            setTimeout(injetarLojas, 1000);
        };
    }
    
    console.log('✅ Observação iniciada');
}

// Iniciar tudo
console.log('🚀 Sistema RIMSO iniciando...');
setTimeout(observarMudancas, 2000);
