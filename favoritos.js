// ==================== LISTAS PERSONALIZADAS DE FAVORITOS ====================
// Permite criar múltiplas listas de lojas favoritas

// Estrutura de dados
let listasFavoritos = JSON.parse(localStorage.getItem('rimso_listas')) || {
    'Favoritas': [],
    'Quero Visitar': [],
    'Promoções': []
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    criarModalListas();
    carregarListasSidebar();
});

// Criar modal de listas
function criarModalListas() {
    const modal = document.createElement('div');
    modal.id = 'modalListas';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3 class="modal-title">Minhas Listas</h3>
                <span class="modal-close" onclick="fecharModalListas()">&times;</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="novaListaNome" class="form-input" placeholder="Nome da nova lista">
                        <button class="btn btn-primary" onclick="criarLista()">Criar</button>
                    </div>
                </div>
                
                <div id="listasContainer"></div>
                
                <div style="margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="fecharModalListas()">Fechar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Abrir modal de listas
function abrirModalListas() {
    carregarListasContainer();
    document.getElementById('modalListas').classList.add('active');
}

function fecharModalListas() {
    document.getElementById('modalListas').classList.remove('active');
}

// Criar nova lista
function criarLista() {
    const nome = document.getElementById('novaListaNome').value.trim();
    if (!nome) {
        mostrarToast('Digite um nome para a lista', 'error');
        return;
    }
    
    if (listasFavoritos[nome]) {
        mostrarToast('Lista já existe', 'error');
        return;
    }
    
    listasFavoritos[nome] = [];
    localStorage.setItem('rimso_listas', JSON.stringify(listasFavoritos));
    
    document.getElementById('novaListaNome').value = '';
    carregarListasContainer();
    carregarListasSidebar();
    mostrarToast(`Lista "${nome}" criada!`);
}

// Renomear lista
function renomearLista(nomeAntigo) {
    const novoNome = prompt('Novo nome para a lista:', nomeAntigo);
    if (!novoNome || novoNome === nomeAntigo) return;
    
    if (listasFavoritos[novoNome]) {
        mostrarToast('Nome já existe', 'error');
        return;
    }
    
    listasFavoritos[novoNome] = listasFavoritos[nomeAntigo];
    delete listasFavoritos[nomeAntigo];
    localStorage.setItem('rimso_listas', JSON.stringify(listasFavoritos));
    
    carregarListasContainer();
    carregarListasSidebar();
    mostrarToast('Lista renomeada!');
}

// Deletar lista
function deletarLista(nome) {
    if (nome === 'Favoritas') {
        mostrarToast('Não é possível deletar a lista padrão', 'error');
        return;
    }
    
    if (confirm(`Deletar lista "${nome}"?`)) {
        delete listasFavoritos[nome];
        localStorage.setItem('rimso_listas', JSON.stringify(listasFavoritos));
        carregarListasContainer();
        carregarListasSidebar();
        mostrarToast('Lista deletada!');
    }
}

// Adicionar loja à lista
function adicionarALista(lojaId, listaNome) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para salvar', 'error');
        abrirModal('modalLogin');
        return;
    }
    
    if (!listasFavoritos[listaNome].includes(lojaId)) {
        listasFavoritos[listaNome].push(lojaId);
        localStorage.setItem('rimso_listas', JSON.stringify(listasFavoritos));
        mostrarToast(`Adicionado à lista "${listaNome}"`);
    } else {
        mostrarToast('Loja já está nesta lista');
    }
}

// Remover loja da lista
function removerDaLista(lojaId, listaNome) {
    const index = listasFavoritos[listaNome].indexOf(lojaId);
    if (index > -1) {
        listasFavoritos[listaNome].splice(index, 1);
        localStorage.setItem('rimso_listas', JSON.stringify(listasFavoritos));
        mostrarToast(`Removido da lista "${listaNome}"`);
    }
}

// Carregar listas na sidebar
function carregarListasSidebar() {
    const container = document.getElementById('listasSidebar');
    if (!container) return;
    
    container.innerHTML = Object.keys(listasFavoritos).map(nome => `
        <div class="menu-item" onclick="abrirLista('${nome}')" style="display: flex; justify-content: space-between;">
            <span><i class="fas fa-list"></i> ${nome}</span>
            <span class="badge">${listasFavoritos[nome].length}</span>
        </div>
    `).join('');
}

// Carregar container de listas (no modal)
function carregarListasContainer() {
    const container = document.getElementById('listasContainer');
    if (!container) return;
    
    container.innerHTML = Object.entries(listasFavoritos).map(([nome, lojas]) => `
        <div style="background: var(--light); border-radius: 16px; padding: 15px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4>${nome} <span style="color: var(--gray);">(${lojas.length})</span></h4>
                <div>
                    <button class="btn btn-small" onclick="renomearLista('${nome}')" style="padding: 5px 10px;">✏️</button>
                    ${nome !== 'Favoritas' ? `
                        <button class="btn btn-small" onclick="deletarLista('${nome}')" style="padding: 5px 10px;">🗑️</button>
                    ` : ''}
                </div>
            </div>
            
            ${lojas.length > 0 ? `
                <div style="max-height: 200px; overflow-y: auto;">
                    ${lojas.map(lojaId => {
                        const loja = lojasExemplo?.find(l => l.id === lojaId);
                        return loja ? `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid var(--border);">
                                <span>${loja.nome}</span>
                                <button class="btn btn-small" onclick="removerDaLista(${lojaId}, '${nome}')" style="padding: 2px 8px;">❌</button>
                            </div>
                        ` : '';
                    }).join('')}
                </div>
            ` : '<p style="color: var(--gray);">Nenhuma loja nesta lista</p>'}
        </div>
    `).join('');
}

// Abrir lista (ver lojas)
function abrirLista(nome) {
    const lojasLista = listasFavoritos[nome];
    
    const content = document.getElementById('clienteContent');
    content.innerHTML = `
        <h2 style="margin-bottom: 20px;">Lista: ${nome}</h2>
        <div class="lojas-grid">
            ${lojasLista.map(lojaId => {
                const loja = lojasExemplo?.find(l => l.id === lojaId);
                return loja ? `
                    <div class="loja-card" onclick="verLoja(${loja.id})">
                        <h3>${loja.nome}</h3>
                        <p>📍 ${loja.bairro}</p>
                        <p>⭐ ${loja.avaliacaoMedia || 'Novo'}</p>
                    </div>
                ` : '';
            }).join('')}
        </div>
        <button class="btn btn-secondary" style="margin-top: 20px;" onclick="voltarParaLojas()">Voltar</button>
    `;
}

// Menu de contexto ao favoritar
function mostrarMenuListas(lojaId, event) {
    event.stopPropagation();
    
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 10px;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
    
    menu.innerHTML = Object.keys(listasFavoritos).map(nome => `
        <div onclick="adicionarALista(${lojaId}, '${nome}')" style="padding: 8px 15px; cursor: pointer; border-radius: 8px;">
            <i class="fas fa-${listasFavoritos[nome].includes(lojaId) ? 'check' : 'plus'}"></i> ${nome}
        </div>
    `).join('');
    
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function removerMenu() {
            menu.remove();
            document.removeEventListener('click', removerMenu);
        });
    }, 100);
}

// Exportar funções
window.abrirModalListas = abrirModalListas;
window.adicionarALista = adicionarALista;
window.removerDaLista = removerDaLista;
window.mostrarMenuListas = mostrarMenuListas;