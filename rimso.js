// ==================== RIMSO - ARQUIVO ÚNICO COM TODAS AS FUNÇÕES ====================
// Data: 25/02/2026
// Versão: 1.0 Completa

console.log('🚀 RIMSO - Carregando módulos completos...');

// ==================== 1. SISTEMA DE AVALIAÇÕES ====================
let avaliacoes = JSON.parse(localStorage.getItem('rimso_avaliacoes')) || [];

function criarModalAvaliacao() {
    // Verificar se o modal já existe
    if (document.getElementById('modalAvaliacao')) return;
    
    const modal = document.createElement('div');
    modal.id = 'modalAvaliacao';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3 class="modal-title">Avaliar Loja</h3>
                <span class="modal-close" onclick="fecharModalAvaliacao()">&times;</span>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div id="avaliacaoEstrelas" style="font-size: 30px; color: #FFCE00; cursor: pointer;">
                        <i class="far fa-star" data-nota="1"></i>
                        <i class="far fa-star" data-nota="2"></i>
                        <i class="far fa-star" data-nota="3"></i>
                        <i class="far fa-star" data-nota="4"></i>
                        <i class="far fa-star" data-nota="5"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Seu comentário</label>
                    <textarea id="avaliacaoComentario" class="form-input" rows="4" placeholder="Conte sua experiência..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Fotos (opcional)</label>
                    <input type="file" id="avaliacaoFotos" class="form-input" accept="image/*" multiple>
                    <small style="color: #6B7280;">Você pode selecionar múltiplas fotos</small>
                </div>
                
                <div id="previewFotos" style="display: flex; gap: 10px; flex-wrap: wrap; margin: 10px 0;"></div>
                
                <button class="btn btn-primary" onclick="enviarAvaliacao()">Enviar Avaliação</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Eventos das estrelas
    document.querySelectorAll('#avaliacaoEstrelas i').forEach(star => {
        star.addEventListener('mouseover', function() {
            const nota = this.dataset.nota;
            destacarEstrelas(nota, 'hover');
        });
        
        star.addEventListener('mouseout', function() {
            resetarEstrelas();
        });
        
        star.addEventListener('click', function() {
            const nota = this.dataset.nota;
            selecionarEstrelas(nota);
        });
    });
    
    // Preview de fotos
    document.getElementById('avaliacaoFotos')?.addEventListener('change', function(e) {
        const preview = document.getElementById('previewFotos');
        preview.innerHTML = '';
        
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const img = document.createElement('div');
                img.style.cssText = 'width: 80px; height: 80px; border-radius: 10px; overflow: hidden; border: 2px solid #E5E7EB;';
                img.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                preview.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        }
    });
}

let avaliacaoNotaSelecionada = 0;
let avaliacaoLojaId = null;

function abrirAvaliacao(lojaId) {
    avaliacaoLojaId = lojaId;
    avaliacaoNotaSelecionada = 0;
    resetarEstrelas();
    document.getElementById('avaliacaoComentario').value = '';
    document.getElementById('previewFotos').innerHTML = '';
    document.getElementById('modalAvaliacao').classList.add('active');
}

function fecharModalAvaliacao() {
    document.getElementById('modalAvaliacao').classList.remove('active');
}

function destacarEstrelas(nota, tipo) {
    const estrelas = document.querySelectorAll('#avaliacaoEstrelas i');
    estrelas.forEach((star, index) => {
        if (index < nota) {
            star.className = 'fas fa-star';
            star.style.color = tipo === 'hover' ? '#FFCE00' : '#DD0000';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#FFCE00';
        }
    });
}

function resetarEstrelas() {
    if (avaliacaoNotaSelecionada > 0) {
        destacarEstrelas(avaliacaoNotaSelecionada, 'selected');
    } else {
        const estrelas = document.querySelectorAll('#avaliacaoEstrelas i');
        estrelas.forEach(star => {
            star.className = 'far fa-star';
            star.style.color = '#FFCE00';
        });
    }
}

function selecionarEstrelas(nota) {
    avaliacaoNotaSelecionada = parseInt(nota);
    destacarEstrelas(nota, 'selected');
}

function enviarAvaliacao() {
    if (!usuarioLogado) {
        mostrarToast('Faça login para avaliar', 'error');
        abrirModal('modalLogin');
        return;
    }
    
    if (avaliacaoNotaSelecionada === 0) {
        mostrarToast('Selecione uma nota', 'error');
        return;
    }
    
    const comentario = document.getElementById('avaliacaoComentario').value;
    
    const novaAvaliacao = {
        id: Date.now(),
        lojaId: avaliacaoLojaId,
        usuarioId: usuarioLogado.id,
        usuarioNome: usuarioLogado.nome,
        nota: avaliacaoNotaSelecionada,
        comentario: comentario,
        data: new Date().toISOString()
    };
    
    avaliacoes.push(novaAvaliacao);
    localStorage.setItem('rimso_avaliacoes', JSON.stringify(avaliacoes));
    
    mostrarToast('Avaliação enviada com sucesso! Obrigado!');
    fecharModalAvaliacao();
}

// ==================== 2. FEED DE NOVIDADES ====================
let feedPosts = JSON.parse(localStorage.getItem('rimso_feed')) || [];
let curtidas = JSON.parse(localStorage.getItem('rimso_curtidas')) || [];

function criarFeedInicial() {
    if (feedPosts.length === 0) {
        feedPosts = [
            {
                id: 1,
                tipo: 'cliente',
                usuarioNome: 'Ana Silva',
                usuarioAvatar: 'AS',
                lojaNome: 'StreetWear Club',
                mensagem: 'Amei minha nova jaqueta! 🔥',
                imagem: '🧥',
                curtidas: 45,
                comentarios: 12,
                data: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 2,
                tipo: 'promocao',
                lojaNome: 'Moda Center',
                mensagem: '🔥 PROMOÇÃO RELÂMPAGO: 30% OFF em todas as camisetas!',
                imagem: '👕',
                curtidas: 89,
                comentarios: 23,
                data: new Date().toISOString()
            }
        ];
        localStorage.setItem('rimso_feed', JSON.stringify(feedPosts));
    }
}

function carregarFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    
    const postsOrdenados = [...feedPosts].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
    );
    
    container.innerHTML = postsOrdenados.map(post => `
        <div class="feed-card" style="background: white; border-radius: 20px; border: 2px solid #E5E7EB; margin-bottom: 20px; overflow: hidden; padding: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(145deg, #DD0000, #FFCE00); display: flex; align-items: center; justify-content: center; color: black; font-weight: 700;">
                        ${post.tipo === 'cliente' ? (post.usuarioAvatar || '👤') : '🏪'}
                    </div>
                    <div>
                        <strong>${post.tipo === 'cliente' ? post.usuarioNome : post.lojaNome}</strong>
                        <div style="font-size: 12px; color: #6B7280;">
                            ${timeAgo(post.data)}
                        </div>
                    </div>
                </div>
                ${post.tipo === 'promocao' ? '<span style="background: #DD0000; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">🔥 PROMO</span>' : ''}
            </div>
            
            <p style="margin: 10px 0;">${post.mensagem}</p>
            
            <div style="font-size: 48px; text-align: center; padding: 20px; background: #F9FAFB; border-radius: 16px; margin: 15px 0;">
                ${post.imagem || '📸'}
            </div>
            
            <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div style="display: flex; align-items: center; gap: 5px; cursor: pointer;" onclick="curtirPost(${post.id})">
                    <i class="fa${curtidas.includes(post.id) ? 's' : 'r'} fa-heart" style="color: #DD0000;"></i>
                    <span>${post.curtidas + (curtidas.includes(post.id) ? 1 : 0)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <i class="far fa-comment" style="color: #6B7280;"></i>
                    <span>${post.comentarios || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function timeAgo(dataISO) {
    const data = new Date(dataISO);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHora = Math.floor(diffMin / 60);
    const diffDia = Math.floor(diffHora / 24);
    
    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHora < 24) return `há ${diffHora} h`;
    if (diffDia < 7) return `há ${diffDia} dias`;
    return data.toLocaleDateString();
}

function curtirPost(postId) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para curtir', 'error');
        return;
    }
    
    const index = curtidas.indexOf(postId);
    if (index === -1) {
        curtidas.push(postId);
        mostrarToast('❤️ Curtiu!');
    } else {
        curtidas.splice(index, 1);
    }
    
    localStorage.setItem('rimso_curtidas', JSON.stringify(curtidas));
    carregarFeed();
}

// ==================== 3. FAVORITOS E LISTAS ====================
let listasFavoritos = JSON.parse(localStorage.getItem('rimso_listas')) || {
    'Favoritas': [],
    'Quero Visitar': [],
    'Promoções': []
};

function criarModalListas() {
    if (document.getElementById('modalListas')) return;
    
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

function abrirModalListas() {
    carregarListasContainer();
    document.getElementById('modalListas').classList.add('active');
}

function fecharModalListas() {
    document.getElementById('modalListas').classList.remove('active');
}

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
    mostrarToast(`Lista "${nome}" criada!`);
}

function carregarListasContainer() {
    const container = document.getElementById('listasContainer');
    if (!container) return;
    
    container.innerHTML = Object.entries(listasFavoritos).map(([nome, lojas]) => `
        <div style="background: #F9FAFB; border-radius: 16px; padding: 15px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4>${nome} <span style="color: #6B7280;">(${lojas.length})</span></h4>
            </div>
            ${lojas.length > 0 ? '' : '<p style="color: #6B7280;">Nenhuma loja nesta lista</p>'}
        </div>
    `).join('');
}

function adicionarALista(lojaId, listaNome) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para salvar', 'error');
        return;
    }
    
    if (!listasFavoritos[listaNome].includes(lojaId)) {
        listasFavoritos[listaNome].push(lojaId);
        localStorage.setItem('rimso_listas', JSON.stringify(listasFavoritos));
        mostrarToast(`Adicionado à lista "${listaNome}"`);
    }
}

// ==================== 4. NOTIFICAÇÕES ====================
let notificacoes = JSON.parse(localStorage.getItem('rimso_notificacoes')) || [];

function criarPainelNotificacoes() {
    if (document.getElementById('painelNotificacoes')) return;
    
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
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(painel);
}

function abrirNotificacoes() {
    carregarListaNotificacoes();
    document.getElementById('painelNotificacoes').classList.add('active');
    
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = '0';
    }
}

function fecharPainelNotificacoes() {
    document.getElementById('painelNotificacoes').classList.remove('active');
}

function carregarListaNotificacoes() {
    const lista = document.getElementById('listaNotificacoes');
    if (!lista) return;
    
    if (notificacoes.length === 0) {
        lista.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhuma notificação</p>';
        return;
    }
    
    lista.innerHTML = notificacoes.map(n => `
        <div style="background: ${n.lida ? 'white' : '#F9FAFB'}; border: 2px solid #E5E7EB; border-radius: 16px; padding: 15px; margin-bottom: 10px; ${!n.lida ? 'border-left: 4px solid #DD0000;' : ''}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong>${n.titulo}</strong>
                <small style="color: #6B7280;">${timeAgo(n.data)}</small>
            </div>
            <p style="font-size: 14px;">${n.mensagem}</p>
        </div>
    `).join('');
}

function marcarTodasLidas() {
    notificacoes.forEach(n => n.lida = true);
    localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
    carregarListaNotificacoes();
}

function criarNotificacao(titulo, mensagem, tipo = 'info') {
    const novaNotificacao = {
        id: Date.now(),
        titulo,
        mensagem,
        tipo,
        lida: false,
        data: new Date().toISOString()
    };
    
    notificacoes.unshift(novaNotificacao);
    localStorage.setItem('rimso_notificacoes', JSON.stringify(notificacoes));
    
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = notificacoes.filter(n => !n.lida).length;
    }
}

// ==================== 5. PROMOÇÕES ====================
let promocoes = JSON.parse(localStorage.getItem('rimso_promocoes')) || [];

function criarModalPromocao() {
    if (document.getElementById('modalPromocao')) return;
    
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
                    
                    <button type="submit" class="btn btn-gold">Ativar Promoção</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function abrirModalPromocao() {
    document.getElementById('modalPromocao').classList.add('active');
}

function fecharModalPromocao() {
    document.getElementById('modalPromocao').classList.remove('active');
}

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
        titulo,
        descricao,
        desconto: parseInt(desconto),
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        ativa: true
    };
    
    promocoes.push(novaPromocao);
    localStorage.setItem('rimso_promocoes', JSON.stringify(promocoes));
    
    mostrarToast('Promoção criada com sucesso!');
    fecharModalPromocao();
}

// ==================== 6. COMPARTILHAR ====================
function compartilharLoja(lojaId) {
    const texto = `Confira esta loja no RIMSO!`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'RIMSO - Lojas do seu bairro',
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url);
        mostrarToast('Link copiado!');
    }
}

function criarBotaoCompartilhar() {
    if (document.getElementById('botaoCompartilhar')) return;
    
    const botao = document.createElement('div');
    botao.id = 'botaoCompartilhar';
    botao.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(145deg, #DD0000, #FFCE00);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 999;
        transition: all 0.3s;
    `;
    botao.innerHTML = '<i class="fas fa-share-alt"></i>';
    botao.onclick = () => compartilharLoja(1);
    
    document.body.appendChild(botao);
}

// ==================== 7. BOTÕES NOS CARDS ====================
function adicionarBotoesNosCards() {
    console.log('🔍 Procurando cards para adicionar botões...');
    
    const cards = document.querySelectorAll('.loja-card');
    console.log(`📦 Encontrados ${cards.length} cards`);
    
    if (cards.length === 0) {
        console.log('⚠️ Nenhum card encontrado');
        return;
    }
    
    cards.forEach((card, index) => {
        if (card.querySelector('.botoes-rimso')) return;
        
        // Criar container
        const container = document.createElement('div');
        container.className = 'botoes-rimso';
        container.style.cssText = 'display: flex; gap: 10px; margin-top: 15px;';
        
        // Botão Avaliar
        const btnAvaliar = document.createElement('button');
        btnAvaliar.innerHTML = '<i class="fas fa-star"></i> Avaliar';
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
        btnShare.innerHTML = '<i class="fas fa-share-alt"></i>';
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

// ==================== 8. INICIALIZAÇÃO GERAL ====================
function inicializarTodasFuncoes() {
    console.log('🚀 Inicializando todas as funções...');
    
    // Criar modais
    criarModalAvaliacao();
    criarModalListas();
    criarPainelNotificacoes();
    criarModalPromocao();
    criarBotaoCompartilhar();
    
    // Inicializar dados
    criarFeedInicial();
    
    // Adicionar botões nos cards
    setTimeout(adicionarBotoesNosCards, 1000);
    setTimeout(adicionarBotoesNosCards, 2000);
    setTimeout(adicionarBotoesNosCards, 3000);
    
    // Observar mudanças
    const observer = new MutationObserver(() => {
        setTimeout(adicionarBotoesNosCards, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('✅ Todas as funções inicializadas!');
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarTodasFuncoes);

// Exportar funções para uso global
window.abrirAvaliacao = abrirAvaliacao;
window.abrirModalListas = abrirModalListas;
window.abrirNotificacoes = abrirNotificacoes;
window.abrirModalPromocao = abrirModalPromocao;
window.compartilharLoja = compartilharLoja;
window.adicionarBotoesNosCards = adicionarBotoesNosCards;
window.mostrarToast = function(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensagem;
        toast.className = `toast ${tipo} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        alert(mensagem);
    }
};

console.log('🎯 RIMSO - Arquivo único carregado com sucesso!');
