// ==================== RIMSO - VERSÃO CORRIGIDA (PRIMEIRO LOJAS, DEPOIS BOTÕES) ====================
console.log('🚀 RIMSO - Iniciando...');

// ==================== 1. VARIÁVEIS GLOBAIS ====================
let sistemaInicializado = false;

// ==================== 2. LOJAS DE EXEMPLO ====================
const lojasExemplo = [
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
    }
];

// ==================== 3. FUNÇÃO PARA ACESSAR DOCUMENTO ====================
function getDoc() {
    return window.top?.document || document;
}

// ==================== 4. FUNÇÃO PARA CRIAR LOJAS ====================
function criarLojas() {
    console.log('🏪 Criando lojas...');
    
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    
    if (!clienteContent) {
        console.log('❌ clienteContent não encontrado');
        return false;
    }
    
    // Limpar conteúdo existente
    clienteContent.innerHTML = '';
    
    // Criar HTML das lojas
    const lojasHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; color: #1A1A1A; font-size: 24px;">Todas as Lojas</h2>
            <div class="lojas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                ${lojasExemplo.map(loja => `
                    <div class="loja-card" data-loja-id="${loja.id}" style="background: white; border-radius: 20px; padding: 20px; border: 2px solid #E5E7EB; position: relative;">
                        <h3 style="margin-bottom: 10px; color: #1A1A1A;">${loja.nome}</h3>
                        <p style="margin-bottom: 5px; color: #DD0000;">📍 ${loja.bairro}</p>
                        <p style="margin-bottom: 5px; color: #FFCE00;">⭐ ${loja.avaliacao} (${loja.totalAvaliacoes} avaliações)</p>
                        <p style="color: #6B7280;">${loja.categoria}</p>
                        <div class="botoes-container" style="display: flex; gap: 10px; margin-top: 15px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    clienteContent.innerHTML = lojasHTML;
    console.log(`✅ ${lojasExemplo.length} lojas criadas`);
    return true;
}

// ==================== 5. FUNÇÃO PARA ADICIONAR BOTÕES ====================
function adicionarBotoes() {
    console.log('🔧 Adicionando botões...');
    
    const doc = getDoc();
    const containers = doc.querySelectorAll('.botoes-container');
    
    if (containers.length === 0) {
        console.log('❌ Nenhum container encontrado');
        return false;
    }
    
    containers.forEach((container, index) => {
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
            alert('📤 Link copiado!');
        };
        
        container.appendChild(btnAvaliar);
        container.appendChild(btnShare);
    });
    
    console.log(`✅ Botões adicionados em ${containers.length} cards`);
    return true;
}

// ==================== 6. FUNÇÃO PRINCIPAL ====================
function inicializarModoCliente() {
    console.log('👀 Verificando modo cliente...');
    
    const doc = getDoc();
    const appCliente = doc.getElementById('appCliente');
    
    if (!appCliente || appCliente.classList.contains('hidden')) {
        return; // Não está no modo cliente
    }
    
    console.log('✅ Modo cliente ativo!');
    
    // PASSO 1: Criar lojas
    const lojasCriadas = criarLojas();
    
    if (lojasCriadas) {
        // PASSO 2: Adicionar botões (com pequeno delay)
        setTimeout(() => {
            adicionarBotoes();
            sistemaInicializado = true;
        }, 100);
    }
}

// ==================== 7. OBSERVAR MUDANÇAS ====================
function observarModoCliente() {
    console.log('👀 Iniciando observação...');
    
    setInterval(() => {
        if (!sistemaInicializado) {
            inicializarModoCliente();
        }
    }, 1000);
}

// ==================== 8. SOBRESCREVER FUNÇÃO DO ADMIN ====================
function sobrescreverFuncaoAdmin() {
    if (window.top?.abrirModoCliente) {
        const original = window.top.abrirModoCliente;
        window.top.abrirModoCliente = function() {
            console.log('👤 Modo cliente ativado por clique');
            if (typeof original === 'function') {
                original();
            }
            sistemaInicializado = false;
            setTimeout(inicializarModoCliente, 500);
        };
        console.log('✅ Função abrirModoCliente sobrescrita');
    }
}

// ==================== 9. INICIAR ====================
function iniciar() {
    console.log('🚀 Sistema iniciado');
    sobrescreverFuncaoAdmin();
    observarModoCliente();
}

// Iniciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}
