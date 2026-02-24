// ==================== PAINEL ADMIN AVANÇADO ====================
// Funcionalidades completas para administradores

// Dados do admin
let adminDados = {
    totalUsuarios: 0,
    totalLojas: 0,
    totalVendas: 0,
    receitaTotal: 0,
    usuariosPorDia: [],
    lojasPorBairro: {}
};

// Inicializar painel admin
function inicializarPainelAdmin() {
    carregarDadosAdmin();
    criarGraficosAdmin();
    carregarTabelasAdmin();
    iniciarAtualizacaoTempoReal();
}

// Carregar dados
function carregarDadosAdmin() {
    // Usuários
    adminDados.totalUsuarios = usuarios.length;
    
    // Lojas
    adminDados.totalLojas = lojas.length;
    
    // Vendas (simulado)
    adminDados.totalVendas = Math.floor(Math.random() * 500) + 100;
    adminDados.receitaTotal = adminDados.totalVendas * Math.floor(Math.random() * 100) + 50;
    
    // Usuários por dia (últimos 30 dias)
    for (let i = 29; i >= 0; i--) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        adminDados.usuariosPorDia.push({
            data: data.toISOString().split('T')[0],
            novos: Math.floor(Math.random() * 10) + 1
        });
    }
    
    // Lojas por bairro
    lojas.forEach(loja => {
        if (!adminDados.lojasPorBairro[loja.bairro]) {
            adminDados.lojasPorBairro[loja.bairro] = 0;
        }
        adminDados.lojasPorBairro[loja.bairro]++;
    });
}

// Criar gráficos admin
function criarGraficosAdmin() {
    const container = document.getElementById('adminContent');
    if (!container) return;
    
    container.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h2 style="margin-bottom: 20px;">Dashboard Administrativo</h2>
            
            <!-- Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${adminDados.totalUsuarios}</div>
                    <div class="stat-label">Usuários</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${adminDados.totalLojas}</div>
                    <div class="stat-label">Lojas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${adminDados.totalVendas}</div>
                    <div class="stat-label">Vendas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">R$ ${adminDados.receitaTotal}</div>
                    <div class="stat-label">Receita</div>
                </div>
            </div>
            
            <!-- Gráficos -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 30px;">
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3>Novos usuários (30 dias)</h3>
                    <canvas id="graficoNovosUsuarios" style="height: 300px;"></canvas>
                </div>
                
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3>Lojas por bairro</h3>
                    <canvas id="graficoLojasBairro" style="height: 300px;"></canvas>
                </div>
            </div>
            
            <!-- Tabelas -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3 style="margin-bottom: 15px;">Últimos usuários</h3>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${usuarios.slice(-5).reverse().map(u => `
                            <div style="padding: 10px; border-bottom: 1px solid var(--border);">
                                <div><strong>${u.nome}</strong> <span class="badge ${u.tipo}">${u.tipo}</span></div>
                                <small style="color: var(--gray);">${u.email}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3 style="margin-bottom: 15px;">Últimas lojas</h3>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${lojas.slice(-5).reverse().map(l => `
                            <div style="padding: 10px; border-bottom: 1px solid var(--border);">
                                <div><strong>${l.nome}</strong></div>
                                <small style="color: var(--gray);">${l.bairro} • ${l.proprietario}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Ações admin -->
            <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                <button class="btn btn-primary" onclick="exportarRelatorioCompleto()">
                    <i class="fas fa-download"></i> Exportar relatório completo
                </button>
                <button class="btn btn-gold" onclick="enviarNotificacaoMassa()">
                    <i class="fas fa-bullhorn"></i> Notificação em massa
                </button>
                <button class="btn btn-secondary" onclick="verLogs()">
                    <i class="fas fa-history"></i> Logs do sistema
                </button>
            </div>
        </div>
    `;
    
    // Inicializar gráficos
    setTimeout(() => {
        criarGraficoNovosUsuarios();
        criarGraficoLojasBairro();
    }, 100);
}

// Gráfico de novos usuários
function criarGraficoNovosUsuarios() {
    const ctx = document.getElementById('graficoNovosUsuarios')?.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: adminDados.usuariosPorDia.slice(-15).map(d => formatarDataCurta(d.data)),
            datasets: [{
                label: 'Novos usuários',
                data: adminDados.usuariosPorDia.slice(-15).map(d => d.novos),
                backgroundColor: '#DD0000',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Gráfico de lojas por bairro
function criarGraficoLojasBairro() {
    const ctx = document.getElementById('graficoLojasBairro')?.getContext('2d');
    if (!ctx) return;
    
    const bairros = Object.keys(adminDados.lojasPorBairro).slice(0, 8);
    const quantidades = bairros.map(b => adminDados.lojasPorBairro[b]);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: bairros,
            datasets: [{
                data: quantidades,
                backgroundColor: ['#DD0000', '#FFCE00', '#10b981', '#f59e0b', '#6B7280', '#AA0000', '#FF8C42', '#4A4A4A'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            cutout: '65%'
        }
    });
}

// Exportar relatório completo
function exportarRelatorioCompleto() {
    const relatorio = {
        data: new Date().toISOString(),
        estatisticas: adminDados,
        usuarios: usuarios,
        lojas: lojas
    };
    
    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rimso-relatorio-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    mostrarToast('Relatório exportado!');
}

// Enviar notificação em massa
function enviarNotificacaoMassa() {
    const mensagem = prompt('Digite a mensagem para enviar a todos os usuários:');
    if (!mensagem) return;
    
    // Simular envio
    mostrarToast(`Notificação enviada para ${usuarios.length} usuários!`);
}

// Ver logs do sistema
function verLogs() {
    const logs = [
        { data: new Date().toISOString(), acao: 'Login admin', usuario: 'admin' },
        { data: new Date(Date.now() - 3600000).toISOString(), acao: 'Nova loja cadastrada', usuario: 'lojista' },
        { data: new Date(Date.now() - 7200000).toISOString(), acao: 'Avaliação recebida', usuario: 'cliente' }
    ];
    
    console.table(logs);
    alert('Logs disponíveis no console (F12)');
}

// Aprovar lojista
function aprovarLojista(usuarioId) {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (usuario) {
        usuario.status = 'aprovado';
        mostrarToast(`Lojista ${usuario.nome} aprovado!`);
    }
}

// Bloquear usuário
function bloquearUsuario(usuarioId) {
    if (confirm('Bloquear este usuário?')) {
        const usuario = usuarios.find(u => u.id === usuarioId);
        if (usuario) {
            usuario.status = 'bloqueado';
            mostrarToast(`Usuário ${usuario.nome} bloqueado`);
        }
    }
}

// Estatísticas em tempo real
function iniciarAtualizacaoTempoReal() {
    setInterval(() => {
        // Simular novos dados
        const statsCards = document.querySelectorAll('.stat-card .stat-value');
        if (statsCards.length > 0) {
            // Pequena variação para simular dados em tempo real
            statsCards[0].textContent = usuarios.length + Math.floor(Math.random() * 3);
        }
    }, 10000); // A cada 10 segundos
}

// Exportar funções
window.inicializarPainelAdmin = inicializarPainelAdmin;
window.aprovarLojista = aprovarLojista;
window.bloquearUsuario = bloquearUsuario;