// ==================== RIMSO - ARQUIVO ÚNICO CORRIGIDO ====================
console.log('🚀 RIMSO - Carregando...');

// ==================== VARIÁVEIS GLOBAIS ====================
let usuarioLogado = null;
let lojasExemplo = [];

// ==================== FUNÇÃO PARA MOSTRAR TOAST ====================
function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensagem;
        toast.className = `toast ${tipo} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        console.log('📢', mensagem);
    }
}

// ==================== FUNÇÃO PARA CRIAR LOJAS DE EXEMPLO ====================
function criarLojasExemplo() {
    console.log('🏪 Criando lojas de exemplo...');
    
    lojasExemplo = [
        {
            id: 1,
            nome: 'Moda Center Piracicaba',
            bairro: 'Centro',
            endereco: 'Rua do Rosário, 500',
            categoria: 'Roupas',
            avaliacao: 4.8,
            totalAvaliacoes: 156,
            whatsapp: '1999991234'
        },
        {
            id: 2,
            nome: 'StreetWear Club',
            bairro: 'Alto',
            endereco: 'Av. Independência, 1200',
            categoria: 'Streetwear',
            avaliacao: 4.6,
            totalAvaliacoes: 89,
            whatsapp: '1998885678'
        },
        {
            id: 3,
            nome: 'Kids Fashion',
            bairro: 'Pauliceia',
            endereco: 'Rua Voluntários, 300',
            categoria: 'Infantil',
            avaliacao: 4.9,
            totalAvaliacoes: 234,
            whatsapp: '1997779012'
        }
    ];
    
    return lojasExemplo;
}

// ==================== FUNÇÃO PARA MOSTRAR LOJAS ====================
function mostrarLojas() {
    console.log('🔄 Tentando mostrar lojas...');
    
    // Procurar o content area do cliente
    const clienteContent = document.getElementById('clienteContent');
    if (!clienteContent) {
        console.log('⚠️ clienteContent não encontrado');
        return;
    }
    
    // Criar lojas se não existirem
    if (lojasExemplo.length === 0) {
        criarLojasExemplo();
    }
    
    // Injetar HTML com as lojas
    clienteContent.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #1A1A1A;">Todas as Lojas</h2>
        <div class="lojas-grid" id="lojasGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${lojasExemplo.map(loja => `
                <div class="loja-card" data-loja-id="${loja.id}" style="background: white; border-radius: 20px; padding: 20px; border: 2px solid #E5E7EB; cursor: pointer; position: relative; transition: all 0.3s;">
                    <h3 style="margin-bottom: 10px; color: #1A1A1A;">${loja.nome}</h3>
                    <p style="margin-bottom: 5px; color: #DD0000;">📍 ${loja.bairro}</p>
                    <p style="margin-bottom: 5px; color: #FFCE00;">⭐ ${loja.avaliacao} (${loja.totalAvaliacoes} avaliações)</p>
                    <p style="color: #6B7280; font-size: 14px;">${loja.categoria}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    console.log('✅ Lojas inseridas no DOM');
    
    // Disparar evento para adicionar botões
    setTimeout(() => {
        adicionarBotoesNosCards();
    }, 500);
}

// ==================== FUNÇÃO PARA ADICIONAR BOTÕES NOS CARDS ====================
function adicionarBotoesNosCards() {
    console.log('🔍 Procurando cards para adicionar botões...');
    
    const cards = document.querySelectorAll('.loja-card');
    console.log(`📦 Encontrados ${cards.length} cards`);
    
    if (cards.length === 0) {
        console.log('⚠️ Nenhum card encontrado');
        return;
    }
    
    cards.forEach((card, index) => {
        // Evitar duplicar botões
        if (card.querySelector('.botoes-rimso')) return;
        
        // Criar container
        const container = document.createElement('div');
        container.className = 'botoes-rimso';
        container.style.cssText = 'display: flex; gap: 10px; margin-top: 15px;';
        
        // Botão Avaliar
        const btnAvaliar = document.createElement('button');
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
        const btnShare = document.createElement('button');
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
    
    console.log('✅ Botões adicionados!');
}

// ==================== FUNÇÃO PARA INICIALIZAR ====================
function inicializar() {
    console.log('🚀 Inicializando RIMSO...');
    
    // Criar lojas de exemplo
    criarLojasExemplo();
    
    // Observar mudanças no DOM de forma segura
    if (document.body) {
        try {
            const observer = new MutationObserver(() => {
                // Verificar se estamos no modo cliente
                if (document.getElementById('appCliente') && !document.getElementById('appCliente').classList.contains('hidden')) {
                    mostrarLojas();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('✅ Observer configurado');
        } catch (e) {
            console.error('❌ Erro no observer:', e);
        }
    }
    
    // Verificar se já estamos no modo cliente
    setTimeout(() => {
        if (document.getElementById('appCliente') && !document.getElementById('appCliente').classList.contains('hidden')) {
            mostrarLojas();
        }
    }, 2000);
    
    console.log('✅ RIMSO inicializado!');
}

// ==================== FUNÇÃO PARA ABRIR MODO CLIENTE ====================
// Sobrescrever a função original se existir
window.abrirModoClienteOriginal = window.abrirModoCliente;
window.abrirModoCliente = function() {
    console.log('👤 Abrindo modo cliente');
    if (typeof abrirModoClienteOriginal === 'function') {
        abrirModoClienteOriginal();
    }
    setTimeout(mostrarLojas, 1000);
};

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

console.log('🎯 Script carregado com sucesso!');
