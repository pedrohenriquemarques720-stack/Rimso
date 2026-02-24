// ==================== FEED DE NOVIDADES ====================
// Feed social com postagens de clientes e promoções das lojas

// Estrutura de dados
let feedPosts = JSON.parse(localStorage.getItem('rimso_feed')) || [];
let curtidas = JSON.parse(localStorage.getItem('rimso_curtidas')) || [];
let seguidores = JSON.parse(localStorage.getItem('rimso_seguidores')) || {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    criarFeedInicial();
    carregarFeed();
});

// Criar posts iniciais de exemplo
function criarFeedInicial() {
    if (feedPosts.length === 0) {
        feedPosts = [
            {
                id: 1,
                tipo: 'cliente',
                usuarioId: 1,
                usuarioNome: 'Ana Silva',
                usuarioAvatar: 'AS',
                lojaId: 1,
                lojaNome: 'StreetWear Club',
                mensagem: 'Amei minha nova jaqueta! 🔥',
                imagem: '🧥',
                fotos: [],
                curtidas: 45,
                comentarios: 12,
                data: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 2,
                tipo: 'promocao',
                lojaId: 2,
                lojaNome: 'Moda Center',
                mensagem: '🔥 PROMOÇÃO RELÂMPAGO: 30% OFF em todas as camisetas!',
                imagem: '👕',
                curtidas: 89,
                comentarios: 23,
                data: new Date().toISOString()
            },
            {
                id: 3,
                tipo: 'cliente',
                usuarioId: 2,
                usuarioNome: 'João Pedro',
                usuarioAvatar: 'JP',
                lojaId: 3,
                lojaNome: 'Kids Fashion',
                mensagem: 'Roupas lindas para meu bebê! 🧸',
                imagem: '👶',
                fotos: ['foto1', 'foto2'],
                curtidas: 67,
                comentarios: 8,
                data: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        localStorage.setItem('rimso_feed', JSON.stringify(feedPosts));
    }
}

// Carregar feed
function carregarFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    
    const postsOrdenados = [...feedPosts].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
    );
    
    container.innerHTML = postsOrdenados.map(post => `
        <div class="feed-card" style="background: var(--card-bg); border-radius: 20px; border: 2px solid var(--border); margin-bottom: 20px; overflow: hidden;">
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 45px; height: 45px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; color: var(--black); font-weight: 700;">
                            ${post.tipo === 'cliente' ? (post.usuarioAvatar || '👤') : '🏪'}
                        </div>
                        <div>
                            <strong>${post.tipo === 'cliente' ? post.usuarioNome : post.lojaNome}</strong>
                            <div style="font-size: 12px; color: var(--gray);">
                                ${post.tipo === 'cliente' ? 'cliente' : 'loja'} • ${timeAgo(post.data)}
                            </div>
                        </div>
                    </div>
                    ${post.tipo === 'promocao' ? '<span style="background: var(--red); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">🔥 PROMO</span>' : ''}
                </div>
                
                <p style="margin: 10px 0;">${post.mensagem}</p>
                
                <div style="font-size: 48px; text-align: center; padding: 20px; background: var(--light); border-radius: 16px; margin: 15px 0;">
                    ${post.imagem || '📸'}
                </div>
                
                <div style="display: flex; gap: 20px; margin-top: 15px;">
                    <div style="display: flex; align-items: center; gap: 5px; cursor: pointer;" onclick="curtirPost(${post.id})">
                        <i class="fa${curtidas.includes(post.id) ? 's' : 'r'} fa-heart" style="color: var(--red);"></i>
                        <span>${post.curtidas + (curtidas.includes(post.id) ? 1 : 0)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; cursor: pointer;" onclick="comentarPost(${post.id})">
                        <i class="far fa-comment" style="color: var(--gray);"></i>
                        <span>${post.comentarios || 0}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; cursor: pointer;" onclick="compartilharPost(${post.id})">
                        <i class="far fa-share-square" style="color: var(--gray);"></i>
                        <span>Compartilhar</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Formatar tempo
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

// Curtir post
function curtirPost(postId) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para curtir', 'error');
        abrirModal('modalLogin');
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

// Comentar post
function comentarPost(postId) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para comentar', 'error');
        abrirModal('modalLogin');
        return;
    }
    
    const comentario = prompt('Digite seu comentário:');
    if (comentario) {
        mostrarToast('Comentário adicionado! (Em breve disponível)');
    }
}

// Compartilhar post
function compartilharPost(postId) {
    const post = feedPosts.find(p => p.id === postId);
    if (post) {
        if (navigator.share) {
            navigator.share({
                title: 'RIMSO - Lojas do seu bairro',
                text: post.mensagem,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            mostrarToast('Link copiado!');
        }
    }
}

// Seguir loja
function seguirLoja(lojaId) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para seguir', 'error');
        abrirModal('modalLogin');
        return;
    }
    
    if (!seguidores[lojaId]) {
        seguidores[lojaId] = [];
    }
    
    const index = seguidores[lojaId].indexOf(usuarioLogado.id);
    if (index === -1) {
        seguidores[lojaId].push(usuarioLogado.id);
        mostrarToast('Agora você segue esta loja!');
    } else {
        seguidores[lojaId].splice(index, 1);
        mostrarToast('Você deixou de seguir');
    }
    
    localStorage.setItem('rimso_seguidores', JSON.stringify(seguidores));
}

// Criar postagem de cliente
function criarPostCliente(lojaId, mensagem, imagem) {
    if (!usuarioLogado) {
        mostrarToast('Faça login para postar', 'error');
        return;
    }
    
    const novaLoja = lojas?.find(l => l.id === lojaId);
    
    const novoPost = {
        id: Date.now(),
        tipo: 'cliente',
        usuarioId: usuarioLogado.id,
        usuarioNome: usuarioLogado.nome,
        usuarioAvatar: usuarioLogado.nome.charAt(0),
        lojaId: lojaId,
        lojaNome: novaLoja?.nome || 'Loja',
        mensagem: mensagem,
        imagem: imagem || '📸',
        fotos: [],
        curtidas: 0,
        comentarios: 0,
        data: new Date().toISOString()
    };
    
    feedPosts.unshift(novoPost);
    localStorage.setItem('rimso_feed', JSON.stringify(feedPosts));
    carregarFeed();
    mostrarToast('Postagem publicada!');
}

// Carregar feed personalizado (seguindo)
function carregarFeedPersonalizado() {
    if (!usuarioLogado) return feedPosts;
    
    const lojasSeguindo = [];
    for (let lojaId in seguidores) {
        if (seguidores[lojaId]?.includes(usuarioLogado.id)) {
            lojasSeguindo.push(parseInt(lojaId));
        }
    }
    
    return feedPosts.filter(post => 
        lojasSeguindo.includes(post.lojaId) || post.tipo === 'cliente'
    );
}

// Exportar funções
window.seguirLoja = seguirLoja;
window.curtirPost = curtirPost;
window.criarPostCliente = criarPostCliente;