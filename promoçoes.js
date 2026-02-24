// ==================== PROMOÇÕES RELÂMPAGO ====================
// Sistema de promoções com temporizador e notificações

// Estrutura de dados
let promocoes = JSON.parse(localStorage.getItem('rimso_promocoes')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    verificarPromocoesAtivas();
    iniciarTimerPromocoes();
});

// Criar modal de promoção
function criarModalPromocao() {
    const modal = document.createElement('div');
    modal.id = 'modalPromocao';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3 class="modal-title">Criar Promoção Relâmpago</h3>
                <span class="modal-close" onclick="fecharModalPromocao()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="formPromocao" onsubmit="criarPromocao(event)">
                    <div class="form-group">
                        <label>Título da promoção</label>
                        <input type="text" class="form-input" id="promocaoTitulo" placeholder="Ex: 30% OFF em jaquetas" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea class="form-input" id="promocaoDescricao" rows="3" placeholder="Detalhes da promoção..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Desconto (%)</label>
                            <input type="number" class="form-input" id="promocaoDesconto" min="1" max="100" required>
                        </div>
                        <div class="form-group">
                            <label>Duração (horas)</label>
                            <input type="number" class="form-input" id="promocaoDuracao" min="1" max="72" value="24" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Produtos em promoção</label>
                        <select class="form-select" id="promocaoProdutos" multiple size="3">
                            <option value="todos">Todos os produtos</option>
                            <option value="categoria">Categoria específica</option>
                            <option value="selecionados">Produtos selecionados</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-gold">Ativar Promoção</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Abrir modal de promoção
function abrirModalPromocao() {
    if (!document.getElementById('modalPromocao')) {
        criarModalPromocao();
    }
    document.getElementById('modalPromocao').classList.add('active');
}

function fecharModalPromocao() {
    document.getElementById('modalPromocao').classList.remove('active');
}

// Criar promoção
function criarPromocao(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('promocaoTitulo').value;
    const descricao = document.getElementById('promocaoDescricao').value;
    const desconto = document.getElementById('promocaoDesconto').value;
    const duracao = document.getElementById('promocaoDuracao').value;
    
    const inicio = new Date();
    const fim = new Date(inicio.getTime() + duracao * 60 * 60 * 1000);
    
    const novaPromocao = {
        id: Date.now(),
        lojaId: usuarioLogado?.id,
        titulo,
        descricao,
        desconto: parseInt(desconto),
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        ativa: true,
        visualizacoes: 0,
        cliques: 0
    };
    
    promocoes.push(novaPromocao);
    localStorage.setItem('rimso_promocoes', JSON.stringify(promocoes));
    
    // Notificar clientes que seguem a loja
    notificarClientesPromocao(novaPromocao);
    
    mostrarToast('Promoção criada com sucesso!');
    fecharModalPromocao();
    carregarPromocoesLojista();
}

// Verificar promoções ativas
function verificarPromocoesAtivas() {
    const agora = new Date();
    
    promocoes.forEach(promo => {
        const fim = new Date(promo.fim);
        if (fim < agora && promo.ativa) {
            promo.ativa = false;
        }
    });
    
    localStorage.setItem('rimso_promocoes', JSON.stringify(promocoes));
}

// Iniciar timer das promoções
function iniciarTimerPromocoes() {
    setInterval(() => {
        verificarPromocoesAtivas();
        atualizarTemporizadores();
    }, 1000); // Atualizar a cada segundo
}

// Atualizar temporizadores na interface
function atualizarTemporizadores() {
    document.querySelectorAll('[data-promocao-id]').forEach(el => {
        const id = parseInt(el.dataset.promocaoId);
        const promocao = promocoes.find(p => p.id === id);
        
        if (promocao && promocao.ativa) {
            const fim = new Date(promocao.fim);
            const agora = new Date();
            const diffMs = fim - agora;
            
            if (diffMs > 0) {
                const horas = Math.floor(diffMs / (1000 * 60 * 60));
                const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);
                
                el.textContent = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            } else {
                el.textContent = 'Promoção encerrada';
                promocao.ativa = false;
            }
        }
    });
}

// Carregar promoções do lojista
function carregarPromocoesLojista() {
    const container = document.getElementById('lojistaContent');
    if (!container) return;
    
    const promocoesAtivas = promocoes.filter(p => p.ativa);
    const promocoesEncerradas = promocoes.filter(p => !p.ativa);
    
    container.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h2 style="margin-bottom: 20px;">Promoções Relâmpago</h2>
            
            <button class="btn btn-gold" onclick="abrirModalPromocao()" style="margin-bottom: 20px;">
                <i class="fas fa-bolt"></i> Nova Promoção
            </button>
            
            <h3 style="margin-bottom: 15px;">Ativas (${promocoesAtivas.length})</h3>
            <div style="display: grid; gap: 15px;">
                ${promocoesAtivas.map(p => `
                    <div style="background: var(--card-bg); border: 2px solid var(--gold); border-radius: 20px; padding: 20px;">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <h4>${p.titulo}</h4>
                                <p style="color: var(--gray);">${p.descricao || ''}</p>
                                <p><strong>${p.desconto}% OFF</strong></p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 24px; font-weight: 800; color: var(--red);" data-promocao-id="${p.id}">
                                    ${calcularTempoRestante(p.fim)}
                                </div>
                                <small style="color: var(--gray);">visualizações: ${p.visualizacoes}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${promocoesEncerradas.length > 0 ? `
                <h3 style="margin: 30px 0 15px;">Encerradas</h3>
                <div style="display: grid; gap: 15px;">
                    ${promocoesEncerradas.slice(0, 3).map(p => `
                        <div style="background: var(--light); border: 2px solid var(--border); border-radius: 20px; padding: 20px; opacity: 0.7;">
                            <h4>${p.titulo}</h4>
                            <p><strong>${p.desconto}% OFF</strong> • ${new Date(p.fim).toLocaleDateString()}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Calcular tempo restante
function calcularTempoRestante(fimISO) {
    const fim = new Date(fimISO);
    const agora = new Date();
    const diffMs = fim - agora;
    
    if (diffMs <= 0) return 'Encerrada';
    
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m`;
}

// Notificar clientes sobre promoção
function notificarClientesPromocao(promocao) {
    // Simular envio de notificações
    console.log('Notificando clientes sobre:', promocao.titulo);
    
    // Em produção, isso enviaria push notifications
    if (typeof criarNotificacaoCliente === 'function') {
        criarNotificacaoCliente(null, 'promocao', {
            loja: 'Sua loja',
            promocao: promocao.titulo,
            lojaId: promocao.lojaId
        });
    }
}

// Registrar clique em promoção
function registrarCliquePromocao(promocaoId) {
    const promocao = promocoes.find(p => p.id === promocaoId);
    if (promocao) {
        promocao.cliques++;
        localStorage.setItem('rimso_promocoes', JSON.stringify(promocoes));
    }
}

// Registrar visualização
function registrarVisualizacao(promocaoId) {
    const promocao = promocoes.find(p => p.id === promocaoId);
    if (promocao) {
        promocao.visualizacoes++;
        localStorage.setItem('rimso_promocoes', JSON.stringify(promocoes));
    }
}

// Exportar funções
window.abrirModalPromocao = abrirModalPromocao;
window.carregarPromocoesLojista = carregarPromocoesLojista;
window.registrarCliquePromocao = registrarCliquePromocao;