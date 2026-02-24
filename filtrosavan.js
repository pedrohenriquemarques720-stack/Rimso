// ==================== FILTROS AVANÇADOS ====================
// Sistema de busca e filtros para encontrar lojas

// Configuração dos filtros
const filtrosConfig = {
    categorias: [
        'Moda Feminina',
        'Moda Masculina',
        'Moda Infantil',
        'Plus Size',
        'Streetwear',
        'Calçados',
        'Acessórios',
        'Brechó'
    ],
    faixasPreco: [
        { id: 'ate50', label: 'Até R$ 50', min: 0, max: 50 },
        { id: '50a100', label: 'R$ 50 a R$ 100', min: 50, max: 100 },
        { id: '100a200', label: 'R$ 100 a R$ 200', min: 100, max: 200 },
        { id: 'acima200', label: 'Acima de R$ 200', min: 200, max: Infinity }
    ],
    avaliacoes: [5, 4, 3, 2, 1]
};

// Estado dos filtros
let filtrosAtivos = {
    busca: '',
    bairro: '',
    categoria: '',
    faixaPreco: '',
    avaliacaoMinima: 0,
    ordenarPor: 'relevancia'
};

// Inicializar filtros
document.addEventListener('DOMContentLoaded', function() {
    criarBarraFiltros();
});

// Criar barra de filtros
function criarBarraFiltros() {
    const barra = document.createElement('div');
    barra.id = 'barraFiltros';
    barra.className = 'filtros-avancados';
    barra.style.cssText = `
        background: var(--card-bg);
        border: 2px solid var(--border);
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 20px;
    `;
    
    barra.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div class="form-group">
                <label><i class="fas fa-search"></i> Buscar</label>
                <input type="text" id="filtroBusca" class="form-input" placeholder="Nome da loja ou produto...">
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-map-marker-alt"></i> Bairro</label>
                <select id="filtroBairro" class="form-select">
                    <option value="">Todos os bairros</option>
                </select>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-tag"></i> Categoria</label>
                <select id="filtroCategoria" class="form-select">
                    <option value="">Todas as categorias</option>
                    ${filtrosConfig.categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-dollar-sign"></i> Faixa de preço</label>
                <select id="filtroPreco" class="form-select">
                    <option value="">Qualquer preço</option>
                    ${filtrosConfig.faixasPreco.map(f => `<option value="${f.id}">${f.label}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-star"></i> Avaliação mínima</label>
                <select id="filtroAvaliacao" class="form-select">
                    <option value="0">Qualquer avaliação</option>
                    <option value="5">5 estrelas</option>
                    <option value="4">4+ estrelas</option>
                    <option value="3">3+ estrelas</option>
                    <option value="2">2+ estrelas</option>
                </select>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-sort"></i> Ordenar por</label>
                <select id="filtroOrdenar" class="form-select">
                    <option value="relevancia">Mais relevantes</option>
                    <option value="avaliacao">Melhor avaliação</option>
                    <option value="nome">Nome (A-Z)</option>
                    <option value="distancia">Mais próximas</option>
                </select>
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
            <button class="btn btn-secondary" onclick="limparFiltros()">Limpar filtros</button>
            <button class="btn btn-primary" onclick="aplicarFiltros()">Aplicar filtros</button>
        </div>
        
        <div id="filtrosAtivos" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;"></div>
    `;
    
    // Inserir antes do grid de lojas
    const lojasContainer = document.getElementById('lojasContainer');
    if (lojasContainer) {
        lojasContainer.parentNode.insertBefore(barra, lojasContainer);
    }
    
    // Carregar bairros
    carregarBairrosFiltro();
    
    // Event listeners
    document.getElementById('filtroBusca').addEventListener('input', debounce(aplicarFiltros, 500));
    document.getElementById('filtroBairro').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroCategoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroPreco').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroAvaliacao').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroOrdenar').addEventListener('change', aplicarFiltros);
}

// Carregar bairros no filtro
function carregarBairrosFiltro() {
    const select = document.getElementById('filtroBairro');
    if (!select) return;
    
    // Usar a lista global de bairros
    if (typeof bairrosPiracicaba !== 'undefined') {
        select.innerHTML = '<option value="">Todos os bairros</option>' + 
            bairrosPiracicaba.map(b => `<option value="${b}">${b}</option>`).join('');
    }
}

// Aplicar filtros
function aplicarFiltros() {
    // Atualizar estado
    filtrosAtivos = {
        busca: document.getElementById('filtroBusca')?.value.toLowerCase() || '',
        bairro: document.getElementById('filtroBairro')?.value || '',
        categoria: document.getElementById('filtroCategoria')?.value || '',
        faixaPreco: document.getElementById('filtroPreco')?.value || '',
        avaliacaoMinima: parseInt(document.getElementById('filtroAvaliacao')?.value) || 0,
        ordenarPor: document.getElementById('filtroOrdenar')?.value || 'relevancia'
    };
    
    // Filtrar lojas
    let lojasFiltradas = lojasExemplo ? [...lojasExemplo] : [];
    
    // Filtro de busca
    if (filtrosAtivos.busca) {
        lojasFiltradas = lojasFiltradas.filter(loja => 
            loja.nome.toLowerCase().includes(filtrosAtivos.busca) ||
            loja.bairro.toLowerCase().includes(filtrosAtivos.busca) ||
            (loja.categoria && loja.categoria.toLowerCase().includes(filtrosAtivos.busca))
        );
    }
    
    // Filtro de bairro
    if (filtrosAtivos.bairro) {
        lojasFiltradas = lojasFiltradas.filter(loja => 
            loja.bairro === filtrosAtivos.bairro
        );
    }
    
    // Filtro de categoria
    if (filtrosAtivos.categoria) {
        lojasFiltradas = lojasFiltradas.filter(loja => 
            loja.categoria === filtrosAtivos.categoria
        );
    }
    
    // Filtro de avaliação
    if (filtrosAtivos.avaliacaoMinima > 0) {
        lojasFiltradas = lojasFiltradas.filter(loja => 
            (loja.avaliacaoMedia || 0) >= filtrosAtivos.avaliacaoMinima
        );
    }
    
    // Ordenação
    switch(filtrosAtivos.ordenarPor) {
        case 'avaliacao':
            lojasFiltradas.sort((a, b) => (b.avaliacaoMedia || 0) - (a.avaliacaoMedia || 0));
            break;
        case 'nome':
            lojasFiltradas.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case 'distancia':
            // Simular distância (em produção, usaria geolocalização)
            lojasFiltradas.sort((a, b) => (a.distanciaSimulada || 0) - (b.distanciaSimulada || 0));
            break;
        default:
            // relevância (mantém ordem original)
            break;
    }
    
    // Atualizar contador
    atualizarContadorResultados(lojasFiltradas.length);
    
    // Mostrar filtros ativos
    mostrarFiltrosAtivos();
    
    // Disparar evento com lojas filtradas
    document.dispatchEvent(new CustomEvent('filtrosAplicados', { 
        detail: lojasFiltradas 
    }));
    
    return lojasFiltradas;
}

// Mostrar filtros ativos
function mostrarFiltrosAtivos() {
    const container = document.getElementById('filtrosAtivos');
    if (!container) return;
    
    const filtros = [];
    
    if (filtrosAtivos.busca) {
        filtros.push(`<span class="filtro-tag">Busca: ${filtrosAtivos.busca} <i class="fas fa-times" onclick="removerFiltro('busca')"></i></span>`);
    }
    if (filtrosAtivos.bairro) {
        filtros.push(`<span class="filtro-tag">Bairro: ${filtrosAtivos.bairro} <i class="fas fa-times" onclick="removerFiltro('bairro')"></i></span>`);
    }
    if (filtrosAtivos.categoria) {
        filtros.push(`<span class="filtro-tag">Categoria: ${filtrosAtivos.categoria} <i class="fas fa-times" onclick="removerFiltro('categoria')"></i></span>`);
    }
    if (filtrosAtivos.avaliacaoMinima > 0) {
        filtros.push(`<span class="filtro-tag">${filtrosAtivos.avaliacaoMinima}+ estrelas <i class="fas fa-times" onclick="removerFiltro('avaliacao')"></i></span>`);
    }
    
    container.innerHTML = filtros.map(f => `
        <span style="background: var(--light); padding: 5px 10px; border-radius: 20px; font-size: 13px;">
            ${f}
        </span>
    `).join('');
}

// Remover filtro específico
function removerFiltro(tipo) {
    switch(tipo) {
        case 'busca':
            document.getElementById('filtroBusca').value = '';
            break;
        case 'bairro':
            document.getElementById('filtroBairro').value = '';
            break;
        case 'categoria':
            document.getElementById('filtroCategoria').value = '';
            break;
        case 'avaliacao':
            document.getElementById('filtroAvaliacao').value = '0';
            break;
    }
    aplicarFiltros();
}

// Limpar todos os filtros
function limparFiltros() {
    document.getElementById('filtroBusca').value = '';
    document.getElementById('filtroBairro').value = '';
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroPreco').value = '';
    document.getElementById('filtroAvaliacao').value = '0';
    document.getElementById('filtroOrdenar').value = 'relevancia';
    
    aplicarFiltros();
    mostrarToast('Filtros limpos');
}

// Atualizar contador de resultados
function atualizarContadorResultados(total) {
    const contador = document.getElementById('resultadosContador') || criarContador();
    contador.textContent = `${total} lojas encontradas`;
}

function criarContador() {
    const contador = document.createElement('div');
    contador.id = 'resultadosContador';
    contador.style.cssText = `
        text-align: right;
        margin-bottom: 15px;
        color: var(--text-secondary);
        font-weight: 600;
    `;
    
    const lojasContainer = document.getElementById('lojasContainer');
    if (lojasContainer) {
        lojasContainer.parentNode.insertBefore(contador, lojasContainer);
    }
    
    return contador;
}

// Debounce para busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exportar funções
window.aplicarFiltros = aplicarFiltros;
window.limparFiltros = limparFiltros;
window.removerFiltro = removerFiltro;