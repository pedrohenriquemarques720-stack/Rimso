// ==================== RIMSO - VERSÃO CORRIGIDA ====================
console.log('🚀 RIMSO - Carregando...');

// ==================== 1. VARIÁVEIS GLOBAIS ====================
let lojasInjetadas = false;
let botoesAdicionados = false;

// ==================== 2. FUNÇÃO PARA ACESSAR DOCUMENTO ====================
function getDoc() {
    return window.top?.document || document;
}

// ==================== 3. FUNÇÃO PARA MOSTRAR TOAST ====================
function mostrarToast(mensagem, tipo = 'success') {
    const doc = getDoc();
    let toast = doc.getElementById('toast');
    
    if (!toast) {
        toast = doc.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            color: #1A1A1A;
            padding: 12px 20px;
            border-radius: 40px;
            font-size: 13px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s;
            border: 2px solid #FFCE00;
        `;
        doc.body.appendChild(toast);
    }
    
    toast.textContent = mensagem;
    toast.style.borderColor = tipo === 'success' ? '#10b981' : '#DD0000';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 3000);
}

// ==================== 4. LOJAS DE EXEMPLO ====================
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

// ==================== 5. FUNÇÃO PARA CRIAR LOJAS (APENAS UMA VEZ) ====================
function criarLojasUmaVez() {
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    
    if (!clienteContent) {
        console.log('❌ clienteContent não encontrado');
        return false;
    }
    
    // Verificar se já tem lojas
    if (clienteContent.querySelector('.lojas-grid')) {
        console.log('✅ Lojas já existem');
        return true;
    }
    
    console.log('🏪 Criando lojas...');
    
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
                        
                        <!-- Container fixo para botões -->
                        <div class="botoes-container" style="display: flex; gap: 10px; margin-top: 15px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    clienteContent.innerHTML = lojasHTML;
    console.log('✅ Lojas criadas');
    return true;
}

// ==================== 6. FUNÇÃO PARA ADICIONAR BOTÕES (APENAS UMA VEZ) ====================
function adicionarBotoesUmaVez() {
    const doc = getDoc();
    const containers = doc.querySelectorAll('.botoes-container');
    
    if (containers.length === 0) {
        console.log('⏳ Containers não encontrados ainda');
        return false;
    }
    
    // Verificar se já tem botões
    if (doc.querySelector('.botoes-container button')) {
        console.log('✅ Botões já existem');
        return true;
    }
    
    console.log(`🔧 Adicionando botões em ${containers.length} containers...`);
    
    containers.forEach((container, index) => {
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
            alert('🔗 Link copiado!');
        };
        
        container.appendChild(btnAvaliar);
        container.appendChild(btnShare);
    });
    
    console.log('✅ Botões adicionados com sucesso!');
    return true;
}

// ==================== 7. FUNÇÃO PRINCIPAL (EXECUTA APENAS UMA VEZ) ====================
function inicializarModoCliente() {
    console.log('👀 Verificando modo cliente...');
    
    const doc = getDoc();
    const appCliente = doc.getElementById('appCliente');
    
    if (!appCliente || appCliente.classList.contains('hidden')) {
        return; // Não está no modo cliente
    }
    
    console.log('✅ Modo cliente ativo!');
    
    // Criar lojas se necessário
    if (!lojasInjetadas) {
        lojasInjetadas = criarLojasUmaVez();
    }
    
    // Adicionar botões se necessário
    if (!botoesAdicionados) {
        botoesAdicionados = adicionarBotoesUmaVez();
    }
}

// ==================== 8. OBSERVAR MUDANÇAS (SEM RECRIAR) ====================
function observarModoCliente() {
    console.log('👀 Iniciando observação...');
    
    // Verificar a cada segundo
    setInterval(() => {
        inicializarModoCliente();
    }, 1000);
    
    console.log('✅ Observação iniciada');
}

// ==================== 9. SOBRESCREVER FUNÇÃO DO ADMIN ====================
function sobrescreverFuncaoAdmin() {
    if (window.top?.abrirModoCliente) {
        const original = window.top.abrirModoCliente;
        window.top.abrirModoCliente = function() {
            console.log('👤 Modo cliente ativado por clique');
            if (typeof original === 'function') {
                original();
            }
            // Resetar flags para recriar se necessário
            lojasInjetadas = false;
            botoesAdicionados = false;
            setTimeout(inicializarModoCliente, 1000);
        };
        console.log('✅ Função abrirModoCliente sobrescrita');
    }
}

// ==================== 10. INICIAR TUDO ====================
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
