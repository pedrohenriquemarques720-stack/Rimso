// ==================== RIMSO - VERSÃO ULTRA SIMPLIFICADA ====================
console.log('🚀 RIMSO iniciando...');

// ==================== FUNÇÃO PARA CRIAR LOJAS DE EXEMPLO ====================
function criarLojasExemplo() {
    console.log('🏪 Criando lojas de exemplo...');
    
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
    
    return lojas;
}

// ==================== FUNÇÃO PARA INJETAR LOJAS NO MODO CLIENTE ====================
function injetarLojasNoModoCliente() {
    console.log('🔍 Procurando modo cliente...');
    
    // Tentar acessar o documento correto (iframe)
    const doc = window.top?.document || document;
    
    // Verificar se o modo cliente está ativo
    const appCliente = doc.getElementById('appCliente');
    if (!appCliente || appCliente.classList.contains('hidden')) {
        console.log('⏳ Modo cliente não está ativo');
        return false;
    }
    
    console.log('✅ Modo cliente ativo!');
    
    // Encontrar o content area
    const clienteContent = doc.getElementById('clienteContent');
    if (!clienteContent) {
        console.log('❌ clienteContent não encontrado');
        return false;
    }
    
    console.log('✅ clienteContent encontrado, injetando lojas...');
    
    // Criar lojas
    const lojas = criarLojasExemplo();
    
    // Criar HTML
    const lojasHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; color: #1A1A1A; font-size: 24px;">Lojas em Piracicaba</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                ${lojas.map(loja => `
                    <div class="loja-card" data-loja-id="${loja.id}" style="background: white; border-radius: 20px; padding: 20px; border: 2px solid #E5E7EB; cursor: pointer; position: relative; transition: all 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        <h3 style="margin-bottom: 10px; color: #1A1A1A; font-size: 18px;">${loja.nome}</h3>
                        <p style="margin-bottom: 5px; color: #DD0000;">📍 ${loja.bairro}</p>
                        <p style="margin-bottom: 5px; color: #FFCE00;">⭐ ${loja.avaliacao} (${loja.totalAvaliacoes} avaliações)</p>
                        <p style="color: #6B7280; font-size: 14px;">${loja.categoria}</p>
                        
                        <!-- Botões serão adicionados aqui pelo JavaScript -->
                        <div class="botoes-container" style="display: flex; gap: 10px; margin-top: 15px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    clienteContent.innerHTML = lojasHTML;
    console.log(`✅ ${lojas.length} lojas injetadas com sucesso!`);
    
    // Adicionar botões
    adicionarBotoes();
    
    return true;
}

// ==================== FUNÇÃO PARA ADICIONAR BOTÕES ====================
function adicionarBotoes() {
    console.log('🔧 Adicionando botões...');
    
    const doc = window.top?.document || document;
    const cards = doc.querySelectorAll('.loja-card');
    
    console.log(`📦 Encontrados ${cards.length} cards para adicionar botões`);
    
    cards.forEach((card, index) => {
        // Encontrar container de botões
        const container = card.querySelector('.botoes-container');
        if (!container) return;
        
        // Limpar container
        container.innerHTML = '';
        
        // Botão Avaliar
        const btnAvaliar = doc.createElement('button');
        btnAvaliar.textContent = '⭐ Avaliar';
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
        btnShare.textContent = '📤';
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
            alert('🔗 Link copiado! (função de compartilhar)');
        };
        
        container.appendChild(btnAvaliar);
        container.appendChild(btnShare);
    });
    
    console.log(`✅ Botões adicionados em ${cards.length} cards!`);
}

// ==================== FUNÇÃO PARA OBSERVAR MUDANÇAS ====================
function observarModoCliente() {
    console.log('👀 Iniciando observação do modo cliente...');
    
    // Verificar a cada segundo
    setInterval(() => {
        const doc = window.top?.document || document;
        const appCliente = doc.getElementById('appCliente');
        
        if (appCliente && !appCliente.classList.contains('hidden')) {
            const clienteContent = doc.getElementById('clienteContent');
            
            // Verificar se já tem lojas
            if (clienteContent && clienteContent.children.length === 1) {
                // Se só tem o conteúdo padrão, injetar lojas
                injetarLojasNoModoCliente();
            }
        }
    }, 1000);
    
    console.log('✅ Observação iniciada');
}

// ==================== FUNÇÃO PARA SOBRESCREVER O MODO CLIENTE ====================
function sobrescreverFuncaoCliente() {
    const doc = window.top?.document || document;
    
    // Sobrescrever a função abrirModoCliente se existir
    if (window.top?.abrirModoCliente) {
        const original = window.top.abrirModoCliente;
        window.top.abrirModoCliente = function() {
            console.log('👤 Modo cliente ativado por clique');
            if (typeof original === 'function') {
                original();
            }
            setTimeout(injetarLojasNoModoCliente, 1000);
        };
        console.log('✅ Função abrirModoCliente sobrescrita');
    }
    
    // Também sobrescrever no escopo atual
    if (window.abrirModoCliente) {
        const original2 = window.abrirModoCliente;
        window.abrirModoCliente = function() {
            console.log('👤 Modo cliente ativado (escopo atual)');
            if (typeof original2 === 'function') {
                original2();
            }
            setTimeout(injetarLojasNoModoCliente, 1000);
        };
    }
}

// ==================== INICIALIZAÇÃO ====================
function inicializar() {
    console.log('🚀 Inicializando sistema RIMSO...');
    
    // Tentar diferentes métodos
    sobrescreverFuncaoCliente();
    observarModoCliente();
    
    // Verificar se já está no modo cliente
    setTimeout(injetarLojasNoModoCliente, 2000);
    
    console.log('✅ Sistema RIMSO inicializado!');
}

// Iniciar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
