// ==================== RIMSO - VERSÃO COM FEED FUNCIONANDO ====================
console.log('🚀 RIMSO - Carregando...');

// ==================== 1. DADOS ====================
let usuarioLogado = null;
let avaliacoes = JSON.parse(localStorage.getItem('rimso_avaliacoes')) || [];
let favoritos = JSON.parse(localStorage.getItem('rimso_favoritos')) || [];
let curtidas = JSON.parse(localStorage.getItem('rimso_curtidas')) || [];

const lojas = [
    {
        id: 1,
        nome: 'Moda Center Piracicaba',
        bairro: 'Centro',
        categoria: 'Roupas',
        avaliacao: 4.8,
        totalAvaliacoes: 156,
        telefone: '(19) 3434-5678',
        whatsapp: '1999991234',
        horario: '9h às 19h',
        fotos: ['👗', '👔', '👖']
    },
    {
        id: 2,
        nome: 'StreetWear Club',
        bairro: 'Alto',
        categoria: 'Streetwear',
        avaliacao: 4.6,
        totalAvaliacoes: 89,
        telefone: '(19) 3433-9012',
        whatsapp: '1998885678',
        horario: '10h às 20h',
        fotos: ['👕', '🧥', '🧢']
    },
    {
        id: 3,
        nome: 'Kids Fashion',
        bairro: 'Pauliceia',
        categoria: 'Infantil',
        avaliacao: 4.9,
        totalAvaliacoes: 234,
        telefone: '(19) 3432-3456',
        whatsapp: '1997779012',
        horario: '9h às 18h',
        fotos: ['🧸', '👚', '👖']
    }
];

// ==================== 2. FEED DE EXEMPLO ====================
const feed = [
    {
        id: 1,
        tipo: 'cliente',
        usuario: 'Ana Silva',
        avatar: '👩',
        loja: 'Moda Center',
        mensagem: 'Amei esse vestido! ❤️ Perfeito para o fim de semana!',
        imagem: '👗',
        curtidas: 45,
        comentarios: 12,
        data: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
    },
    {
        id: 2,
        tipo: 'promocao',
        loja: 'StreetWear Club',
        mensagem: '🔥 PROMOÇÃO RELÂMPAGO: 30% OFF em todas as jaquetas! Corre que é por tempo limitado!',
        imagem: '🧥',
        curtidas: 89,
        comentarios: 23,
        data: new Date().toISOString() // agora
    },
    {
        id: 3,
        tipo: 'cliente',
        usuario: 'João Pedro',
        avatar: '👨',
        loja: 'Kids Fashion',
        mensagem: 'Roupas lindas para meu bebê! Super recomendo 🧸',
        imagem: '👶',
        curtidas: 67,
        comentarios: 15,
        data: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
    },
    {
        id: 4,
        tipo: 'cliente',
        usuario: 'Maria Oliveira',
        avatar: '👩‍🦰',
        loja: 'Moda Center',
        mensagem: 'Comprei uma calça jeans maravilhosa! Atendimento excelente!',
        imagem: '👖',
        curtidas: 34,
        comentarios: 8,
        data: new Date(Date.now() - 172800000).toISOString() // 2 dias atrás
    }
];

// ==================== 3. FUNÇÕES AUXILIARES ====================
function getDoc() {
    return window.top?.document || document;
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
    if (diffDia === 1) return 'ontem';
    return `há ${diffDia} dias`;
}

// ==================== 4. TELA DE LOJAS ====================
function mostrarLojas() {
    console.log('🏪 Mostrando lojas');
    
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    if (!clienteContent) return;
    
    let lojasHTML = '<h2 style="margin:20px; color:#1A1A1A;">Todas as Lojas</h2>';
    lojasHTML += '<div class="lojas-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:20px; padding:20px;">';
    
    lojas.forEach(loja => {
        const isFavorito = favoritos.includes(loja.id);
        
        lojasHTML += `
            <div class="loja-card" data-id="${loja.id}" style="background:white; border-radius:20px; padding:20px; border:2px solid #E5E7EB; cursor:pointer; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
                    <h3 style="margin:0; color:#1A1A1A;">${loja.nome}</h3>
                    <span style="background:#F9FAFB; padding:4px 8px; border-radius:20px; font-size:12px;">${loja.categoria}</span>
                </div>
                
                <p style="margin:5px 0; color:#DD0000;"><i class="fas fa-map-marker-alt"></i> ${loja.bairro}</p>
                <p style="margin:5px 0; color:#FFCE00;"><i class="fas fa-star"></i> ${loja.avaliacao} (${loja.totalAvaliacoes})</p>
                <p style="margin:5px 0; color:#6B7280;"><i class="far fa-clock"></i> ${loja.horario}</p>
                
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <button class="btn-avaliar" data-id="${loja.id}" style="background:#FFCE00; color:#000; border:none; padding:8px; border-radius:20px; flex:1; cursor:pointer;">⭐ Avaliar</button>
                    <button class="btn-favorito" data-id="${loja.id}" style="background:${isFavorito ? '#DD0000' : 'transparent'}; color:${isFavorito ? 'white' : '#DD0000'}; border:2px solid #DD0000; width:40px; height:40px; border-radius:50%; cursor:pointer;">❤️</button>
                    <button class="btn-compartilhar" data-id="${loja.id}" style="background:#FFCE00; color:#000; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer;">📤</button>
                </div>
            </div>
        `;
    });
    
    lojasHTML += '</div>';
    clienteContent.innerHTML = lojasHTML;
    
    adicionarEventosLojas();
}

function adicionarEventosLojas() {
    const doc = getDoc();
    
    doc.querySelectorAll('.loja-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-avaliar') && 
                !e.target.classList.contains('btn-favorito') && 
                !e.target.classList.contains('btn-compartilhar')) {
                const id = card.dataset.id;
                mostrarDetalhesLoja(parseInt(id));
            }
        });
    });
    
    doc.querySelectorAll('.btn-avaliar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            abrirModalAvaliacao(parseInt(id));
        });
    });
    
    doc.querySelectorAll('.btn-favorito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const index = favoritos.indexOf(id);
            
            if (index === -1) {
                favoritos.push(id);
                btn.style.background = '#DD0000';
                btn.style.color = 'white';
                mostrarToast('❤️ Adicionado aos favoritos');
            } else {
                favoritos.splice(index, 1);
                btn.style.background = 'transparent';
                btn.style.color = '#DD0000';
                mostrarToast('Removido dos favoritos');
            }
            localStorage.setItem('rimso_favoritos', JSON.stringify(favoritos));
        });
    });
    
    doc.querySelectorAll('.btn-compartilhar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const loja = lojas.find(l => l.id === id);
            
            if (navigator.share) {
                navigator.share({
                    title: loja.nome,
                    text: `Confira ${loja.nome} no RIMSO!`,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(`Confira ${loja.nome} no RIMSO!`);
                mostrarToast('📤 Link copiado!');
            }
        });
    });
}

// ==================== 5. DETALHES DA LOJA ====================
function mostrarDetalhesLoja(id) {
    const loja = lojas.find(l => l.id === id);
    if (!loja) return;
    
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    
    clienteContent.innerHTML = `
        <div style="padding:20px;">
            <button class="btn-voltar" style="background:transparent; border:2px solid #DD0000; color:#DD0000; padding:8px 16px; border-radius:60px; margin-bottom:20px; cursor:pointer;">← Voltar</button>
            
            <div style="background:white; border-radius:24px; border:2px solid #E5E7EB; overflow:hidden;">
                <div style="height:200px; background:linear-gradient(145deg, rgba(221,0,0,0.1), rgba(255,206,0,0.1)); display:flex; align-items:center; justify-content:center; font-size:48px;">
                    ${loja.fotos[0]}
                </div>
                
                <div style="padding:30px;">
                    <h2 style="font-size:28px; margin-bottom:10px;">${loja.nome}</h2>
                    <p style="color:#DD0000; margin-bottom:20px;"><i class="fas fa-map-marker-alt"></i> ${loja.bairro}</p>
                    
                    <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; margin-bottom:30px;">
                        <div style="background:#F9FAFB; border-radius:16px; padding:15px;">
                            <div style="color:#6B7280; font-size:12px;">Horário</div>
                            <div style="font-weight:600;"><i class="far fa-clock"></i> ${loja.horario}</div>
                        </div>
                        <div style="background:#F9FAFB; border-radius:16px; padding:15px;">
                            <div style="color:#6B7280; font-size:12px;">Avaliação</div>
                            <div style="font-weight:600; color:#FFCE00;"><i class="fas fa-star"></i> ${loja.avaliacao} (${loja.totalAvaliacoes})</div>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom:15px;">Contato</h3>
                    <div style="display:flex; gap:10px; margin-bottom:30px;">
                        <a href="https://wa.me/55${loja.whatsapp}" target="_blank" style="flex:1; background:#25D366; color:white; padding:12px; border-radius:60px; text-align:center; text-decoration:none;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="tel:${loja.telefone}" style="flex:1; background:#DD0000; color:white; padding:12px; border-radius:60px; text-align:center; text-decoration:none;">
                            <i class="fas fa-phone"></i> Ligar
                        </a>
                    </div>
                    
                    <h3 style="margin-bottom:15px;">Fotos</h3>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
                        ${loja.fotos.map(f => `<div style="aspect-ratio:1; background:#F9FAFB; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:32px;">${f}</div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    doc.querySelector('.btn-voltar').addEventListener('click', mostrarLojas);
}

// ==================== 6. MODAL DE AVALIAÇÃO ====================
function criarModalAvaliacao() {
    const doc = getDoc();
    if (doc.getElementById('modalAvaliacao')) return;
    
    const modal = doc.createElement('div');
    modal.id = 'modalAvaliacao';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    `;
    modal.innerHTML = `
        <div style="background:white; border-radius:30px; padding:30px; max-width:500px; width:90%; border:3px solid #FFCE00;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="font-size:24px;">Avaliar Loja</h3>
                <span id="fecharModal" style="font-size:28px; cursor:pointer;">&times;</span>
            </div>
            
            <div style="text-align:center; margin-bottom:20px;">
                <div id="estrelas" style="font-size:30px; color:#FFCE00;">
                    <i class="far fa-star" data-nota="1"></i>
                    <i class="far fa-star" data-nota="2"></i>
                    <i class="far fa-star" data-nota="3"></i>
                    <i class="far fa-star" data-nota="4"></i>
                    <i class="far fa-star" data-nota="5"></i>
                </div>
            </div>
            
            <textarea id="comentario" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:12px; margin-bottom:20px;" rows="4" placeholder="Seu comentário..."></textarea>
            
            <button id="enviarAvaliacao" style="width:100%; padding:14px; background:#DD0000; color:white; border:none; border-radius:60px; font-weight:600; cursor:pointer;">Enviar Avaliação</button>
        </div>
    `;
    
    doc.body.appendChild(modal);
    
    let notaSelecionada = 0;
    const estrelas = modal.querySelectorAll('#estrelas i');
    
    estrelas.forEach(star => {
        star.addEventListener('mouseover', function() {
            const nota = this.dataset.nota;
            estrelas.forEach((s, i) => {
                s.className = i < nota ? 'fas fa-star' : 'far fa-star';
            });
        });
        
        star.addEventListener('mouseout', () => {
            estrelas.forEach((s, i) => {
                s.className = i < notaSelecionada ? 'fas fa-star' : 'far fa-star';
            });
        });
        
        star.addEventListener('click', function() {
            notaSelecionada = parseInt(this.dataset.nota);
            estrelas.forEach((s, i) => {
                s.className = i < notaSelecionada ? 'fas fa-star' : 'far fa-star';
            });
        });
    });
    
    modal.querySelector('#fecharModal').onclick = () => {
        modal.style.display = 'none';
    };
    
    modal.querySelector('#enviarAvaliacao').onclick = () => {
        if (notaSelecionada === 0) {
            mostrarToast('Selecione uma nota', 'error');
            return;
        }
        
        const comentario = modal.querySelector('#comentario').value;
        const lojaId = parseInt(modal.dataset.lojaId);
        
        avaliacoes.push({
            id: Date.now(),
            lojaId,
            nota: notaSelecionada,
            comentario,
            data: new Date().toISOString()
        });
        
        localStorage.setItem('rimso_avaliacoes', JSON.stringify(avaliacoes));
        mostrarToast('⭐ Avaliação enviada!');
        modal.style.display = 'none';
    };
}

function abrirModalAvaliacao(id) {
    const doc = getDoc();
    const modal = doc.getElementById('modalAvaliacao');
    if (modal) {
        modal.dataset.lojaId = id;
        modal.style.display = 'flex';
    }
}

// ==================== 7. FEED DE NOVIDADES ====================
function mostrarFeed() {
    console.log('📱 Mostrando feed');
    
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    if (!clienteContent) return;
    
    let feedHTML = '<h2 style="margin:20px; color:#1A1A1A;">Feed de Novidades</h2>';
    feedHTML += '<div style="padding:20px;">';
    
    // Ordenar do mais novo para o mais velho
    const feedOrdenado = [...feed].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    feedOrdenado.forEach(post => {
        const curtido = curtidas.includes(post.id);
        
        feedHTML += `
            <div style="background:white; border-radius:20px; border:2px solid #E5E7EB; margin-bottom:20px; padding:20px; transition:all 0.3s;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(145deg, #DD0000, #FFCE00); display:flex; align-items:center; justify-content:center; font-size:20px;">
                        ${post.avatar || '👤'}
                    </div>
                    <div style="flex:1;">
                        <strong>${post.tipo === 'cliente' ? post.usuario : post.loja}</strong>
                        <div style="font-size:12px; color:#6B7280;">${timeAgo(post.data)}</div>
                    </div>
                    ${post.tipo === 'promocao' ? '<span style="background:#DD0000; color:white; padding:4px 12px; border-radius:20px; font-size:12px;">🔥 PROMO</span>' : ''}
                </div>
                
                <p style="margin:15px 0; line-height:1.5;">${post.mensagem}</p>
                
                <div style="font-size:48px; text-align:center; padding:30px; background:#F9FAFB; border-radius:16px; margin:15px 0;">
                    ${post.imagem}
                </div>
                
                <div style="display:flex; gap:20px; margin-top:15px; padding-top:15px; border-top:2px solid #E5E7EB;">
                    <div style="display:flex; align-items:center; gap:5px; cursor:pointer;" class="curtir-post" data-id="${post.id}">
                        <i class="fa${curtido ? 's' : 'r'} fa-heart" style="color:#DD0000; font-size:18px;"></i>
                        <span style="font-weight:600;">${post.curtidas + (curtido ? 1 : 0)}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:5px;">
                        <i class="far fa-comment" style="color:#6B7280; font-size:18px;"></i>
                        <span style="font-weight:600;">${post.comentarios}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    feedHTML += '</div>';
    clienteContent.innerHTML = feedHTML;
    
    // Adicionar eventos de curtir
    doc.querySelectorAll('.curtir-post').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(el.dataset.id);
            
            const index = curtidas.indexOf(id);
            if (index === -1) {
                curtidas.push(id);
                mostrarToast('❤️ Curtiu!');
            } else {
                curtidas.splice(index, 1);
            }
            localStorage.setItem('rimso_curtidas', JSON.stringify(curtidas));
            
            // Recarregar o feed para mostrar a mudança
            mostrarFeed();
        });
    });
}

// ==================== 8. MENU DO CLIENTE ====================
function configurarMenu() {
    const doc = getDoc();
    const menu = doc.querySelector('#appCliente .sidebar-cliente');
    if (!menu) return;
    
    // Verificar se já tem o item Feed
    if (menu.querySelector('[data-feed="true"]')) return;
    
    console.log('📱 Adicionando item Feed ao menu...');
    
    // Criar item do Feed
    const feedItem = doc.createElement('div');
    feedItem.className = 'menu-item';
    feedItem.setAttribute('data-feed', 'true');
    feedItem.innerHTML = '<i class="fas fa-rss"></i> Feed';
    feedItem.onclick = () => {
        // Remover active de todos
        doc.querySelectorAll('#appCliente .menu-item').forEach(i => i.classList.remove('active'));
        // Ativar este item
        feedItem.classList.add('active');
        // Mostrar feed
        mostrarFeed();
    };
    
    // Encontrar onde inserir (antes do Voltar)
    const itens = Array.from(menu.children);
    const voltarItem = itens.find(el => el.textContent.includes('Voltar'));
    
    if (voltarItem) {
        menu.insertBefore(feedItem, voltarItem);
    } else {
        menu.appendChild(feedItem);
    }
    
    console.log('✅ Item Feed adicionado ao menu');
}

// ==================== 9. INICIALIZAÇÃO ====================
function iniciar() {
    console.log('🚀 Inicializando RIMSO...');
    
    // Criar modal de avaliação
    criarModalAvaliacao();
    
    // Observar modo cliente
    setInterval(() => {
        const doc = getDoc();
        const appCliente = doc.getElementById('appCliente');
        
        if (appCliente && !appCliente.classList.contains('hidden')) {
            // Configurar menu (uma vez)
            configurarMenu();
            
            // Verificar conteúdo
            const content = doc.getElementById('clienteContent');
            if (content) {
                // Se estiver vazio ou com mensagem de boas-vindas, mostrar lojas
                if (content.children.length === 1) {
                    const primeiroFilho = content.children[0];
                    if (primeiroFilho.textContent.includes('Bem-vindo')) {
                        mostrarLojas();
                    }
                }
            }
        }
    }, 1000);
    
    console.log('✅ RIMSO pronto!');
}

// Iniciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}
