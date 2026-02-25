// ==================== SISTEMA DE NOTIFICAÇÕES ====================
// Gerencia notificações push, alertas e lembretes

// Estrutura de dados
let notificacoes = JSON.parse(localStorage.getItem('rimso_notificacoes')) || [];
let permissoesNotificacao = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    verificarPermissao();
    carregarNotificacoes();
    criarPainelNotificacoes();
});

// Verificar permissão para notificações
function verificarPermissao() {
    if (!('Notification' in window)) {
        console.log('Notificações não suportadas');
        return;
    }
    
    if (Notification.permission === 'granted') {
        permissoesNotificacao = true;
    }
}

// Solicitar permissão
function solicitarPermissao() {
    if (!('Notification' in window)) return;
    
    Notification.requestPermission().then(permission => {
        permissoesNotificacao = permission === 'granted';
        if (permissoesNotificacao) {
            mostrarToast('Notificações ativadas!');
        }
    });
}

// Criar painel de notificações
function criarPainelNotificacoes() {
    const painel = document.createElement('div');
    painel.id = 'painelNotificacoes';
    painel.className = 'modal';
    painel.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">Notificações</h3>
                <span class="modal-close" onclick="fecharPainelNotificacoes()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="listaNotificacoes" style="max-height: 400px; overflow-y: auto;"></div>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="marcarTodasLidas()">Marcar todas como lidas</button>
                    <button class="btn btn-primary" onclick="limparNotificacoes()">Limpar todas</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(painel);
}

// Abrir painel de notificações
function abrirNotificacoes() {
    carregarListaNotificacoes();
    document.getElementById('painelNotificacoes').classList.add('active');
    
    // Resetar badge
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = '0';
    }
}

function fecharPainelNotificacoes() {
    document.getElementById('painelNotificacoes').classList.remove('active');
}

// Carregar notificações
function carregarNotificacoes() {
    // Notificações de exemplo
    if (notificacoes.length === 0) {
        notificacoes = [
            {
                id: 1,
                tipo: 'promocao',
                titulo: '🔥 Promoção Relâmpago!',
                mensagem: 'StreetWear Club: 30% OFF em jaquetas',
                lojaId: 1,
                lida: false,
                data: new Date().toISOString()
            },
            {
                id: 2,
                tipo: 'avaliacao',
                titulo: 'Nova avaliação',
                mensagem: 'Ana Silva avaliou sua loja com 5 estrelas! ⭐',
                lojaId: 1,
                lida: false,
                data: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 3,
                tipo: 'seguidor',
                titulo: 'Novo seguidor',
                mensagem: 'João Pedro começou a seguir sua loja',
                lojaId: 1,
                lida: true,
                data: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
    }
    
    atualizarBadge();
}

// Atualizar badge de notificações
function atualizarBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const naoLidas = notificacoes.filter(n => !n.lida).length;
    badge.textContent = naoLidas;
    badge.style.display = naoLidas > 0 ? 'block' : 'none';
}

// Carregar lista no painel
function carregarListaNotificacoes() {
    const lista = document.getElementById('listaNotificacoes');
    if (!lista) return;
    
    const notificacoesOrdenadas = [...notificacoes].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
    );
    
    lista.innerHTML = notificacoesOrdenadas.map(n => `
        <div onclick="abrirNotificacao(${n.id})" style="
            background: ${n.lida ? 'var(--card-bg)' : 'var(--light)'};
            border: 2px solid var(--border);
            border-radius: 16px;
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: var(--transition);
            ${!n.lida ? 'border-left: 4px solid var(--red);' : ''}
        ">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong>${n.titulo}</strong>
                <small style="color: var(--gray);">${timeAgo(n.data)}</small>
            </div>
            <p style="font-size: 14px;">${n.mensagem}</p>
        </div>
    `).join('');
}

// Marcar notificação como lida
function marcarLida(id) {
    const notificacao = notificacoes.find(n => n.id === id);
    if (notificacao) {
        notificacao.lida = true;
        localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
        atualizarBadge();
    }
}

// Marcar todas como lidas
function marcarTodasLidas() {
    notificacoes.forEach(n => n.lida = true);
    localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
    carregarListaNotificacoes();
    atualizarBadge();
    mostrarToast('Todas notificações marcadas como lidas');
}

// Limpar todas notificações
function limparNotificacoes() {
    if (confirm('Limpar todas as notificações?')) {
        notificacoes = [];
        localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
        carregarListaNotificacoes();
        atualizarBadge();
        mostrarToast('Notificações limpas');
    }
}

// Abrir notificação específica
function abrirNotificacao(id) {
    marcarLida(id);
    const notificacao = notificacoes.find(n => n.id === id);
    
    if (notificacao.tipo === 'promocao' && notificacao.lojaId) {
        verLoja(notificacao.lojaId);
        fecharPainelNotificacoes();
    }
}

// Criar notificação
function criarNotificacao(tipo, titulo, mensagem, lojaId = null) {
    const novaNotificacao = {
        id: Date.now(),
        tipo,
        titulo,
        mensagem,
        lojaId,
        lida: false,
        data: new Date().toISOString()
    };
    
    notificacoes.unshift(novaNotificacao);
    localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
    atualizarBadge();
    
    // Enviar notificação push se permitido
    if (permissoesNotificacao) {
        new Notification(titulo, {
            body: mensagem,
            icon: '/icon.png'
        });
    }
    
    return novaNotificacao;
}

// Notificações para lojista
function criarNotificacaoLojista(lojaId, tipo, dados) {
    let titulo, mensagem;
    
    switch(tipo) {
        case 'nova_avaliacao':
            titulo = 'Nova avaliação! ⭐';
            mensagem = `${dados.usuario} avaliou sua loja com ${dados.nota} estrelas`;
            break;
        case 'novo_seguidor':
            titulo = 'Novo seguidor! 👥';
            mensagem = `${dados.usuario} começou a seguir sua loja`;
            break;
        case 'venda_realizada':
            titulo = 'Venda realizada! 💰';
            mensagem = `Nova venda de R$ ${dados.valor}`;
            break;
        default:
            return;
    }
    
    return criarNotificacao('lojista', titulo, mensagem, lojaId);
}

// Notificações para cliente
function criarNotificacaoCliente(usuarioId, tipo, dados) {
    let titulo, mensagem;
    
    switch(tipo) {
        case 'promocao':
            titulo = '🔥 Promoção na sua loja favorita!';
            mensagem = `${dados.loja} está com ${dados.promocao}`;
            break;
        case 'nova_loja':
            titulo = '🆕 Nova loja no seu bairro!';
            mensagem = `${dados.loja} acaba de abrir no ${dados.bairro}`;
            break;
        case 'lembrete':
            titulo = '⏰ Lembrete de visita';
            mensagem = dados.mensagem;
            break;
        default:
            return;
    }
    
    return criarNotificacao('cliente', titulo, mensagem, dados.lojaId);
}

// Lembretes programados
function criarLembrete(lojaId, data, mensagem) {
    const lembrete = {
        id: Date.now(),
        lojaId,
        mensagem,
        data: new Date(data).toISOString(),
        ativo: true
    };
    
    let lembretes = JSON.parse(localStorage.getItem('rimso_lembretes')) || [];
    lembretes.push(lembrete);
    localStorage.setItem('rimso_lembretes', JSON.stringify(lembretes));
    
    mostrarToast('Lembrete criado!');
    
    // Agendar notificação
    agendarLembrete(lembrete);
}

// Agendar lembrete
function agendarLembrete(lembrete) {
    const agora = new Date();
    const dataLembrete = new Date(lembrete.data);
    const diffMs = dataLembrete - agora;
    
    if (diffMs > 0) {
        setTimeout(() => {
            if (lembrete.ativo) {
                criarNotificacao('lembrete', 'Lembrete', lembrete.mensagem, lembrete.lojaId);
            }
        }, diffMs);
    }
}

// Verificar lembretes ao carregar
function verificarLembretes() {
    const lembretes = JSON.parse(localStorage.getItem('rimso_lembretes')) || [];
    const agora = new Date();
    
    lembretes.forEach(lembrete => {
        const dataLembrete = new Date(lembrete.data);
        if (dataLembrete <= agora && lembrete.ativo) {
            criarNotificacao('lembrete', 'Lembrete', lembrete.mensagem, lembrete.lojaId);
            lembrete.ativo = false;
        }
    });
    
    localStorage.setItem('rimso_lembretes', JSON.stringify(lembretes));
}

// Exportar funções
window.abrirNotificacoes = abrirNotificacoes;
window.solicitarPermissao = solicitarPermissao;
window.criarNotificacao = criarNotificacao;
window.criarLembrete = criarLembrete;
