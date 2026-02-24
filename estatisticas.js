// ==================== ESTATÍSTICAS DO LOJISTA ====================
// Dashboard completo com gráficos e métricas para lojistas

// Dados de exemplo para estatísticas
let estatisticasLojista = {
    visualizacoes: [],
    contatos: [],
    vendas: [],
    avaliacoes: []
};

// Inicializar estatísticas
function inicializarEstatisticas(lojaId) {
    // Gerar dados dos últimos 30 dias
    const hoje = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - i);
        const dataStr = data.toISOString().split('T')[0];
        
        estatisticasLojista.visualizacoes.push({
            data: dataStr,
            total: Math.floor(Math.random() * 100) + 20
        });
        
        estatisticasLojista.contatos.push({
            data: dataStr,
            total: Math.floor(Math.random() * 20) + 1
        });
        
        estatisticasLojista.vendas.push({
            data: dataStr,
            total: Math.floor(Math.random() * 10) + 1,
            valor: Math.floor(Math.random() * 500) + 50
        });
    }
    
    // Avaliações aleatórias
    for (let i = 0; i < 20; i++) {
        estatisticasLojista.avaliacoes.push({
            id: i,
            nota: Math.floor(Math.random() * 5) + 1,
            data: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
        });
    }
    
    return estatisticasLojista;
}

// Carregar dashboard do lojista
function carregarDashboardLojista(lojaId) {
    const stats = inicializarEstatisticas(lojaId);
    
    const container = document.getElementById('lojistaContent');
    if (!container) return;
    
    container.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h2 style="margin-bottom: 20px;">Dashboard da Loja</h2>
            
            <!-- Cards rápidos -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${calcularTotal(stats.visualizacoes, 'total')}</div>
                    <div class="stat-label">Visualizações (30 dias)</div>
                    <div style="color: var(--success);">+${Math.floor(Math.random() * 20)}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${calcularTotal(stats.contatos, 'total')}</div>
                    <div class="stat-label">Contatos WhatsApp</div>
                    <div style="color: var(--success);">+${Math.floor(Math.random() * 15)}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${calcularTotal(stats.vendas, 'total')}</div>
                    <div class="stat-label">Vendas realizadas</div>
                    <div style="color: var(--success);">+${Math.floor(Math.random() * 10)}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">R$ ${calcularTotal(stats.vendas, 'valor')}</div>
                    <div class="stat-label">Faturamento</div>
                    <div style="color: var(--success);">+${Math.floor(Math.random() * 25)}%</div>
                </div>
            </div>
            
            <!-- Gráficos -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 30px;">
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3 style="margin-bottom: 15px;">Visualizações (últimos 30 dias)</h3>
                    <canvas id="graficoVisualizacoes" style="height: 300px;"></canvas>
                </div>
                
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3 style="margin-bottom: 15px;">Distribuição de Avaliações</h3>
                    <canvas id="graficoAvaliacoes" style="height: 300px;"></canvas>
                </div>
            </div>
            
            <!-- Tabelas -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3 style="margin-bottom: 15px;">Últimas vendas</h3>
                    <table style="width: 100%;">
                        <tr style="background: var(--light);">
                            <th style="padding: 10px; text-align: left;">Data</th>
                            <th>Valor</th>
                        </tr>
                        ${stats.vendas.slice(-5).reverse().map(v => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${formatarData(v.data)}</td>
                                <td>R$ ${v.valor}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div style="background: var(--card-bg); border: 2px solid var(--border); border-radius: 20px; padding: 20px;">
                    <h3 style="margin-bottom: 15px;">Últimas avaliações</h3>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${stats.avaliacoes.slice(-5).reverse().map(a => `
                            <div style="padding: 10px; border-bottom: 1px solid var(--border);">
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Cliente ${a.id}</span>
                                    <span style="color: var(--gold);">${'★'.repeat(a.nota)}${'☆'.repeat(5-a.nota)}</span>
                                </div>
                                <small style="color: var(--gray);">${formatarData(a.data)}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar gráficos
    setTimeout(() => {
        criarGraficoVisualizacoes(stats.visualizacoes);
        criarGraficoAvaliacoes(stats.avaliacoes);
    }, 100);
}

// Calcular total
function calcularTotal(array, campo) {
    return array.reduce((acc, item) => acc + item[campo], 0);
}

// Criar gráfico de visualizações
function criarGraficoVisualizacoes(dados) {
    const ctx = document.getElementById('graficoVisualizacoes')?.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dados.map(d => formatarDataCurta(d.data)),
            datasets: [{
                label: 'Visualizações',
                data: dados.map(d => d.total),
                borderColor: '#DD0000',
                backgroundColor: 'rgba(221, 0, 0, 0.1)',
                tension: 0.4,
                fill: true
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

// Criar gráfico de avaliações
function criarGraficoAvaliacoes(avaliacoes) {
    const ctx = document.getElementById('graficoAvaliacoes')?.getContext('2d');
    if (!ctx) return;
    
    const distribuicao = [0, 0, 0, 0, 0];
    avaliacoes.forEach(a => {
        distribuicao[a.nota - 1]++;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['5 estrelas', '4 estrelas', '3 estrelas', '2 estrelas', '1 estrela'],
            datasets: [{
                data: distribuicao,
                backgroundColor: ['#DD0000', '#FFCE00', '#10b981', '#f59e0b', '#6B7280'],
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

// Métricas em tempo real (simuladas)
function iniciarMetricasTempoReal(lojaId) {
    setInterval(() => {
        // Simular nova visualização
        const novaVisita = {
            data: new Date().toISOString().split('T')[0],
            total: 1
        };
        
        // Atualizar contadores
        const badge = document.getElementById('metricasTempoReal');
        if (badge) {
            const atual = parseInt(badge.textContent) || 0;
            badge.textContent = atual + 1;
        }
        
        // Notificar lojista
        if (Math.random() > 0.7) { // 30% de chance
            criarNotificacaoLojista(lojaId, 'venda_realizada', {
                valor: Math.floor(Math.random() * 200) + 50
            });
        }
    }, 30000); // A cada 30 segundos
}

// Exportar relatório
function exportarRelatorio(formato = 'pdf') {
    const dados = {
        visualizacoes: calcularTotal(estatisticasLojista.visualizacoes, 'total'),
        contatos: calcularTotal(estatisticasLojista.contatos, 'total'),
        vendas: calcularTotal(estatisticasLojista.vendas, 'total'),
        faturamento: calcularTotal(estatisticasLojista.vendas, 'valor'),
        periodo: '30 dias'
    };
    
    // Simular download
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-rimso-${new Date().toISOString().split('T')[0]}.${formato}`;
    a.click();
    
    mostrarToast(`Relatório exportado como ${formato.toUpperCase()}`);
}

// Formatar data
function formatarData(dataStr) {
    return new Date(dataStr).toLocaleDateString();
}

function formatarDataCurta(dataStr) {
    const data = new Date(dataStr);
    return `${data.getDate()}/${data.getMonth() + 1}`;
}

// Exportar funções
window.carregarDashboardLojista = carregarDashboardLojista;
window.exportarRelatorio = exportarRelatorio;