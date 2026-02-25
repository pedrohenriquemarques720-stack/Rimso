// ==================== RIMSO - FASE 2: ÁREA DO LOJISTA ====================
console.log('🚀 RIMSO Fase 2 - Carregando...');

// ==================== 1. DADOS DO LOJISTA ====================
let lojaAtual = {
    id: 1,
    nome: 'StreetWear Club',
    proprietario: 'João Silva',
    email: 'contato@streetwear.com',
    telefone: '(19) 3433-9012',
    whatsapp: '1998885678',
    endereco: 'Av. Independência, 1200',
    bairro: 'Alto',
    cidade: 'Piracicaba',
    categoria: 'Streetwear',
    descricao: 'A melhor loja de streetwear da cidade!',
    horario: '10h às 20h',
    plano: 'Profissional',
    status: 'ativo'
};

let produtos = JSON.parse(localStorage.getItem('rimso_produtos')) || [
    {
        id: 1,
        lojaId: 1,
        nome: 'Camiseta Oversized',
        descricao: 'Camiseta oversized em algodão',
        preco: 89.90,
        categoria: 'Camisetas',
        estoque: 45,
        vendas: 23,
        imagem: '👕',
        destaque: true
    },
    {
        id: 2,
        lojaId: 1,
        nome: 'Calça Cargo',
        descricao: 'Calça cargo com vários bolsos',
        preco: 159.90,
        categoria: 'Calças',
        estoque: 32,
        vendas: 18,
        imagem: '👖',
        destaque: false
    },
    {
        id: 3,
        lojaId: 1,
        nome: 'Jaqueta Jeans',
        descricao: 'Jaqueta jeans clássica',
        preco: 199.90,
        categoria: 'Jaquetas',
        estoque: 12,
        vendas: 8,
        imagem: '🧥',
        destaque: true
    }
];

let vendas = JSON.parse(localStorage.getItem('rimso_vendas')) || [
    {
        id: 1,
        lojaId: 1,
        produtoId: 1,
        produto: 'Camiseta Oversized',
        cliente: 'Ana Silva',
        valor: 89.90,
        data: new Date(Date.now() - 86400000).toISOString(),
        status: 'pago'
    },
    {
        id: 2,
        lojaId: 1,
        produtoId: 2,
        produto: 'Calça Cargo',
        cliente: 'João Santos',
        valor: 159.90,
        data: new Date(Date.now() - 172800000).toISOString(),
        status: 'pago'
    },
    {
        id: 3,
        lojaId: 1,
        produtoId: 3,
        produto: 'Jaqueta Jeans',
        cliente: 'Maria Oliveira',
        valor: 199.90,
        data: new Date(Date.now() - 259200000).toISOString(),
        status: 'pendente'
    }
];

// ==================== 2. FUNÇÕES AUXILIARES ====================
function getDoc() {
    return window.top?.document || document;
}

function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

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

// ==================== 3. DASHBOARD DO LOJISTA ====================
function mostrarDashboardLojista() {
    console.log('📊 Mostrando dashboard do lojista');
    
    const doc = getDoc();
    const lojistaContent = doc.getElementById('lojistaContent');
    if (!lojistaContent) return;
    
    // Calcular estatísticas
    const totalVendas = vendas.length;
    const totalFaturado = vendas.reduce((acc, v) => acc + v.valor, 0);
    const totalProdutos = produtos.length;
    const totalEstoque = produtos.reduce((acc, p) => acc + p.estoque, 0);
    const produtosMaisVendidos = [...produtos].sort((a, b) => b.vendas - a.vendas).slice(0, 3);
    const vendasHoje = vendas.filter(v => new Date(v.data).toDateString() === new Date().toDateString()).length;
    const vendasEstaSemana = vendas.filter(v => {
        const data = new Date(v.data);
        const hoje = new Date();
        const diff = hoje - data;
        return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    
    let dashboardHTML = `
        <div style="padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h2 style="font-size:24px;">Dashboard da Loja</h2>
                <div style="display:flex; gap:10px;">
                    <button class="btn-atualizar" style="background:#FFCE00; color:#000; border:none; padding:8px 16px; border-radius:60px; cursor:pointer;">
                        <i class="fas fa-sync-alt"></i> Atualizar
                    </button>
                    <button class="btn-config" style="background:transparent; border:2px solid #DD0000; color:#DD0000; padding:8px 16px; border-radius:60px; cursor:pointer;">
                        <i class="fas fa-cog"></i> Configurar
                    </button>
                </div>
            </div>
            
            <!-- Cards de Estatísticas -->
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:30px;">
                <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                    <div style="font-size:14px; color:#6B7280;">Vendas Hoje</div>
                    <div style="font-size:32px; font-weight:800; color:#DD0000;">${vendasHoje}</div>
                </div>
                <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                    <div style="font-size:14px; color:#6B7280;">Esta Semana</div>
                    <div style="font-size:32px; font-weight:800; color:#DD0000;">${vendasEstaSemana}</div>
                </div>
                <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                    <div style="font-size:14px; color:#6B7280;">Faturamento</div>
                    <div style="font-size:32px; font-weight:800; color:#DD0000;">${formatarMoeda(totalFaturado)}</div>
                </div>
                <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                    <div style="font-size:14px; color:#6B7280;">Produtos</div>
                    <div style="font-size:32px; font-weight:800; color:#DD0000;">${totalProdutos}</div>
                </div>
            </div>
            
            <!-- Gráficos e Tabelas -->
            <div style="display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:30px;">
                <!-- Gráfico de Vendas -->
                <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                    <h3 style="margin-bottom:15px;">Últimas Vendas</h3>
                    <table style="width:100%; border-collapse:collapse;">
                        <tr style="background:#F9FAFB;">
                            <th style="padding:12px; text-align:left;">Produto</th>
                            <th style="padding:12px; text-align:left;">Cliente</th>
                            <th style="padding:12px; text-align:left;">Valor</th>
                            <th style="padding:12px; text-align:left;">Status</th>
                        </tr>
                        ${vendas.slice(0, 5).map(v => `
                            <tr style="border-bottom:1px solid #E5E7EB;">
                                <td style="padding:12px;">${v.produto}</td>
                                <td style="padding:12px;">${v.cliente}</td>
                                <td style="padding:12px;">${formatarMoeda(v.valor)}</td>
                                <td style="padding:12px;">
                                    <span style="background:${v.status === 'pago' ? '#10b981' : '#f59e0b'}20; color:${v.status === 'pago' ? '#10b981' : '#f59e0b'}; padding:4px 8px; border-radius:20px; font-size:12px;">
                                        ${v.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <!-- Produtos Mais Vendidos -->
                <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                    <h3 style="margin-bottom:15px;">Mais Vendidos</h3>
                    ${produtosMaisVendidos.map(p => `
                        <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px; padding:10px; background:#F9FAFB; border-radius:12px;">
                            <div style="font-size:32px;">${p.imagem}</div>
                            <div style="flex:1;">
                                <div><strong>${p.nome}</strong></div>
                                <div style="font-size:12px; color:#6B7280;">${p.vendas} vendidos • ${formatarMoeda(p.preco)}</div>
                            </div>
                            <div style="background:#DD0000; color:white; padding:4px 8px; border-radius:20px; font-size:12px;">${p.vendas}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Gestão de Produtos -->
            <div style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3>Meus Produtos</h3>
                    <button class="btn-novo-produto" style="background:#DD0000; color:white; border:none; padding:8px 16px; border-radius:60px; cursor:pointer;">
                        <i class="fas fa-plus"></i> Novo Produto
                    </button>
                </div>
                
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px;">
                    ${produtos.map(p => `
                        <div style="background:#F9FAFB; border-radius:16px; padding:15px; border:2px solid ${p.destaque ? '#FFCE00' : 'transparent'};">
                            <div style="font-size:48px; text-align:center; margin-bottom:10px;">${p.imagem}</div>
                            <h4 style="margin-bottom:5px;">${p.nome}</h4>
                            <p style="font-size:12px; color:#6B7280; margin-bottom:5px;">${p.categoria}</p>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:700; color:#DD0000;">${formatarMoeda(p.preco)}</span>
                                <span style="font-size:12px;">Estoque: ${p.estoque}</span>
                            </div>
                            <div style="display:flex; gap:5px; margin-top:10px;">
                                <button class="btn-editar-produto" data-id="${p.id}" style="flex:1; background:transparent; border:1px solid #DD0000; color:#DD0000; padding:5px; border-radius:20px; cursor:pointer;">Editar</button>
                                <button class="btn-excluir-produto" data-id="${p.id}" style="flex:1; background:#DD0000; color:white; border:none; padding:5px; border-radius:20px; cursor:pointer;">Excluir</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    lojistaContent.innerHTML = dashboardHTML;
    
    // Eventos
    doc.querySelector('.btn-novo-produto')?.addEventListener('click', mostrarFormProduto);
    doc.querySelector('.btn-atualizar')?.addEventListener('click', mostrarDashboardLojista);
    
    doc.querySelectorAll('.btn-editar-produto').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            editarProduto(parseInt(id));
        });
    });
    
    doc.querySelectorAll('.btn-excluir-produto').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                excluirProduto(parseInt(id));
            }
        });
    });
}

// ==================== 4. FORMULÁRIO DE PRODUTO ====================
function mostrarFormProduto(produtoId = null) {
    const doc = getDoc();
    const lojistaContent = doc.getElementById('lojistaContent');
    const produto = produtoId ? produtos.find(p => p.id === produtoId) : null;
    
    const formHTML = `
        <div style="padding:20px;">
            <button class="btn-voltar" style="background:transparent; border:2px solid #DD0000; color:#DD0000; padding:8px 16px; border-radius:60px; margin-bottom:20px; cursor:pointer;">
                ← Voltar ao Dashboard
            </button>
            
            <div style="background:white; border-radius:20px; padding:30px; border:2px solid #E5E7EB; max-width:600px; margin:0 auto;">
                <h2 style="margin-bottom:20px;">${produto ? 'Editar' : 'Novo'} Produto</h2>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600;">Imagem (emoji)</label>
                    <input type="text" id="produtoImagem" class="form-input" value="${produto ? produto.imagem : '👕'}" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px;">
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600;">Nome do Produto</label>
                    <input type="text" id="produtoNome" class="form-input" value="${produto ? produto.nome : ''}" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px;">
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600;">Descrição</label>
                    <textarea id="produtoDescricao" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px;" rows="3">${produto ? produto.descricao : ''}</textarea>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
                    <div>
                        <label style="display:block; margin-bottom:5px; font-weight:600;">Preço (R$)</label>
                        <input type="number" id="produtoPreco" step="0.01" value="${produto ? produto.preco : ''}" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:5px; font-weight:600;">Estoque</label>
                        <input type="number" id="produtoEstoque" value="${produto ? produto.estoque : ''}" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px;">
                    </div>
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600;">Categoria</label>
                    <select id="produtoCategoria" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px;">
                        <option value="Camisetas" ${produto?.categoria === 'Camisetas' ? 'selected' : ''}>Camisetas</option>
                        <option value="Calças" ${produto?.categoria === 'Calças' ? 'selected' : ''}>Calças</option>
                        <option value="Jaquetas" ${produto?.categoria === 'Jaquetas' ? 'selected' : ''}>Jaquetas</option>
                        <option value="Vestidos" ${produto?.categoria === 'Vestidos' ? 'selected' : ''}>Vestidos</option>
                        <option value="Saias" ${produto?.categoria === 'Saias' ? 'selected' : ''}>Saias</option>
                        <option value="Acessórios" ${produto?.categoria === 'Acessórios' ? 'selected' : ''}>Acessórios</option>
                    </select>
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="produtoDestaque" ${produto?.destaque ? 'checked' : ''}>
                        <span>Destacar este produto</span>
                    </label>
                </div>
                
                <button class="btn-salvar" style="width:100%; background:#DD0000; color:white; border:none; padding:14px; border-radius:60px; font-weight:600; cursor:pointer;">
                    ${produto ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
            </div>
        </div>
    `;
    
    lojistaContent.innerHTML = formHTML;
    
    doc.querySelector('.btn-voltar').addEventListener('click', mostrarDashboardLojista);
    doc.querySelector('.btn-salvar').addEventListener('click', () => salvarProduto(produtoId));
}

function salvarProduto(produtoId) {
    const doc = getDoc();
    
    const novoProduto = {
        id: produtoId || Date.now(),
        lojaId: 1,
        nome: doc.getElementById('produtoNome').value,
        descricao: doc.getElementById('produtoDescricao').value,
        preco: parseFloat(doc.getElementById('produtoPreco').value),
        categoria: doc.getElementById('produtoCategoria').value,
        estoque: parseInt(doc.getElementById('produtoEstoque').value),
        imagem: doc.getElementById('produtoImagem').value,
        destaque: doc.getElementById('produtoDestaque').checked,
        vendas: produtoId ? produtos.find(p => p.id === produtoId)?.vendas || 0 : 0
    };
    
    if (!novoProduto.nome || !novoProduto.preco) {
        mostrarToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    if (produtoId) {
        // Editar existente
        const index = produtos.findIndex(p => p.id === produtoId);
        if (index !== -1) {
            produtos[index] = { ...produtos[index], ...novoProduto };
        }
        mostrarToast('Produto atualizado!');
    } else {
        // Novo produto
        produtos.push(novoProduto);
        mostrarToast('Produto cadastrado!');
    }
    
    localStorage.setItem('rimso_produtos', JSON.stringify(produtos));
    mostrarDashboardLojista();
}

function excluirProduto(id) {
    produtos = produtos.filter(p => p.id !== id);
    localStorage.setItem('rimso_produtos', JSON.stringify(produtos));
    mostrarToast('Produto excluído!');
    mostrarDashboardLojista();
}

function editarProduto(id) {
    mostrarFormProduto(id);
}

// ==================== 5. INICIALIZAR MODO LOJISTA ====================
function configurarMenuLojista() {
    const doc = getDoc();
    const menuLojista = doc.querySelector('#appLojista .sidebar-lojista');
    if (!menuLojista) return;
    
    // Garantir que o dashboard seja mostrado ao entrar
    const dashboardItem = Array.from(menuLojista.children).find(el => 
        el.textContent.includes('Dashboard')
    );
    
    if (dashboardItem) {
        dashboardItem.classList.add('active');
    }
}

function observarModoLojista() {
    setInterval(() => {
        const doc = getDoc();
        const appLojista = doc.getElementById('appLojista');
        
        if (appLojista && !appLojista.classList.contains('hidden')) {
            configurarMenuLojista();
            
            const content = doc.getElementById('lojistaContent');
            if (content && content.children.length === 1) {
                const primeiroFilho = content.children[0];
                if (primeiroFilho.textContent.includes('Bem-vindo')) {
                    mostrarDashboardLojista();
                }
            }
        }
    }, 1000);
}

// Sobrescrever função do admin para modo lojista
function sobrescreverFuncaoLojista() {
    if (window.top?.abrirModoLojista) {
        const original = window.top.abrirModoLojista;
        window.top.abrirModoLojista = function() {
            console.log('🏬 Modo lojista ativado');
            if (typeof original === 'function') original();
            setTimeout(mostrarDashboardLojista, 1000);
        };
    }
}

// ==================== 6. INICIALIZAR ====================
function inicializarFase2() {
    console.log('🚀 Inicializando Fase 2...');
    
    sobrescreverFuncaoLojista();
    observarModoLojista();
    
    console.log('✅ Fase 2 pronta!');
}

// Iniciar junto com o resto
if (typeof iniciar === 'function') {
    const originalIniciar = iniciar;
    window.iniciar = function() {
        originalIniciar();
        inicializarFase2();
    };
} else {
    inicializarFase2();
}
