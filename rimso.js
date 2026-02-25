// ==================== RIMSO - TODAS AS FUNCIONALIDADES DA FASE 1 ====================
console.log('🚀 RIMSO - Carregando todas as funcionalidades...');

// ==================== 1. CONFIGURAÇÃO INICIAL ====================
let usuarioLogado = null;
let avaliacoes = JSON.parse(localStorage.getItem('rimso_avaliacoes')) || [];
let favoritos = JSON.parse(localStorage.getItem('rimso_favoritos')) || [];
let listasFavoritos = JSON.parse(localStorage.getItem('rimso_listas')) || {
    'Favoritas': [],
    'Quero Visitar': [],
    'Promoções': []
};
let notificacoes = JSON.parse(localStorage.getItem('rimso_notificacoes')) || [];
let curtidas = JSON.parse(localStorage.getItem('rimso_curtidas')) || [];
let promocoes = JSON.parse(localStorage.getItem('rimso_promocoes')) || [];

// ==================== 2. LOJAS DE EXEMPLO ====================
const lojasExemplo = [
    {
        id: 1,
        nome: 'Moda Center Piracicaba',
        bairro: 'Centro',
        endereco: 'Rua do Rosário, 500',
        categoria: 'Roupas',
        subcategorias: ['Moda Feminina', 'Moda Masculina'],
        avaliacao: 4.8,
        totalAvaliacoes: 156,
        telefone: '(19) 3434-5678',
        whatsapp: '1999991234',
        horario: '9h às 19h',
        latitude: -22.7243,
        longitude: -47.6475,
        fotos: ['👗', '👔', '👖']
    },
    {
        id: 2,
        nome: 'StreetWear Club',
        bairro: 'Alto',
        endereco: 'Av. Independência, 1200',
        categoria: 'Streetwear',
        subcategorias: ['Masculino', 'Skatewear'],
        avaliacao: 4.6,
        totalAvaliacoes: 89,
        telefone: '(19) 3433-9012',
        whatsapp: '1998885678',
        horario: '10h às 20h',
        latitude: -22.7143,
        longitude: -47.6375,
        fotos: ['👕', '🧥', '🧢']
    },
    {
        id: 3,
        nome: 'Kids Fashion',
        bairro: 'Pauliceia',
        endereco: 'Rua Voluntários, 300',
        categoria: 'Infantil',
        subcategorias: ['Bebê', 'Infantil'],
        avaliacao: 4.9,
        totalAvaliacoes: 234,
        telefone: '(19) 3432-3456',
        whatsapp: '1997779012',
        horario: '9h às 18h',
        latitude: -22.7343,
        longitude: -47.6575,
        fotos: ['🧸', '👚', '👖']
    },
    {
        id: 4,
        nome: 'Plus Size Store',
        bairro: 'Cidade Alta',
        endereco: 'Rua Governador Pedro de Toledo, 150',
        categoria: 'Plus Size',
        subcategorias: ['Moda Feminina', 'Moda Masculina'],
        avaliacao: 4.7,
        totalAvaliacoes: 67,
        telefone: '(19) 3435-7890',
        whatsapp: '1996663456',
        horario: '9h às 19h',
        latitude: -22.7043,
        longitude: -47.6275,
        fotos: ['👗', '👔', '👖']
    },
    {
        id: 5,
        nome: 'Calçados City',
        bairro: 'Centro',
        endereco: 'Rua do Mercado, 250',
        categoria: 'Calçados',
        subcategorias: ['Feminino', 'Masculino', 'Infantil'],
        avaliacao: 4.5,
        totalAvaliacoes: 112,
        telefone: '(19) 3436-1234',
        whatsapp: '1995556789',
        horario: '9h às 18h',
        latitude: -22.7248,
        longitude: -47.6480,
        fotos: ['👟', '👠', '👞']
    }
];

// ==================== 3. FEED DE EXEMPLO ====================
const feedExemplo = [
    {
        id: 1,
        tipo: 'cliente',
        usuarioNome: 'Ana Silva',
        usuarioAvatar: '👩',
        lojaId: 1,
        lojaNome: 'Moda Center Piracicaba',
        mensagem: 'Amei esse vestido! #moda #piracicaba',
        imagem: '👗',
        curtidas: 45,
        comentarios: 12,
        data: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 2,
        tipo: 'cliente',
        usuarioNome: 'João Santos',
        usuarioAvatar: '👨',
        lojaId: 2,
        lojaNome: 'StreetWear Club',
        mensagem: 'Look do dia! #streetwear',
        imagem: '👕',
        curtidas: 32,
        comentarios: 8,
        data: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        tipo: 'promocao',
        lojaId: 1,
        lojaNome: 'Moda Center Piracicaba',
        mensagem: '🔥 PROMOÇÃO RELÂMPAGO: 30% OFF em todas as camisetas!',
        imagem: '🔥',
        curtidas: 89,
        comentarios: 23,
        data: new Date().toISOString()
    }
];

// ==================== 4. FUNÇÃO PARA ACESSAR DOCUMENTO CORRETO ====================
function getDoc() {
    return window.top?.document || document;
}

// ==================== 5. FUNÇÃO PARA MOSTRAR TOAST ====================
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

// ==================== 6. FUNÇÃO PARA INJETAR LOJAS ====================
function injetarLojas() {
    console.log('🏪 Injetando lojas...');
    
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    
    if (!clienteContent) {
        console.log('❌ clienteContent não encontrado');
        return false;
    }
    
    // Verificar se já tem lojas
    if (clienteContent.querySelector('.lojas-grid')) {
        console.log('✅ Lojas já existem');
        return true;
    }
    
    const lojasHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; color: #1A1A1A; font-size: 24px;">Todas as Lojas</h2>
            <div class="lojas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
                ${lojasExemplo.map(loja => `
                    <div class="loja-card" data-loja-id="${loja.id}" style="background: white; border-radius: 20px; padding: 20px; border: 2px solid #E5E7EB; cursor: pointer; position: relative; transition: all 0.3s;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; margin: 0;">${loja.nome}</h3>
                            <span style="background: #FFCE00; padding: 4px 8px; border-radius: 20px; font-size: 12px;">${loja.categoria}</span>
                        </div>
                        
                        <p style="margin-bottom: 5px; color: #DD0000;"><i class="fas fa-map-marker-alt"></i> ${loja.bairro}</p>
                        
                        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                            ${loja.subcategorias.map(cat => `
                                <span style="background: #F9FAFB; padding: 4px 8px; border-radius: 20px; font-size: 11px; color: #6B7280;">${cat}</span>
                            `).join('')}
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div style="color: #FFCE00;">
                                <i class="fas fa-star"></i> ${loja.avaliacao} (${loja.totalAvaliacoes})
                            </div>
                            <div>
                                <i class="fas fa-clock" style="color: #6B7280;"></i> ${loja.horario}
                            </div>
                        </div>
                        
                        <!-- Botões serão adicionados aqui -->
                        <div class="botoes-container" style="display: flex; gap: 10px; margin-top: 15px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    clienteContent.innerHTML = lojasHTML;
    console.log(`✅ ${lojasExemplo.length} lojas injetadas`);
    
    adicionarBotoes();
    adicionarEventosCards();
    
    return true;
}

// ==================== 7. ADICIONAR BOTÕES NOS CARDS ====================
function adicionarBotoes() {
    console.log('🔧 Adicionando botões...');
    
    const doc = getDoc();
    const cards = doc.querySelectorAll('.loja-card');
    
    cards.forEach((card, index) => {
        const container = card.querySelector('.botoes-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Botão Avaliar
        const btnAvaliar = doc.createElement('button');
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
            abrirModalAvaliacao(lojasExemplo[index].id);
        };
        
        // Botão Compartilhar
        const btnShare = doc.createElement('button');
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
            compartilharLoja(lojasExemplo[index].id);
        };
        
        // Botão Favorito
        const btnFav = doc.createElement('button');
        btnFav.innerHTML = '<i class="far fa-heart"></i>';
        btnFav.style.cssText = `
            background: transparent;
            color: #DD0000;
            border: 2px solid #DD0000;
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
        btnFav.onmouseover = () => {
            btnFav.style.background = '#DD0000';
            btnFav.style.color = '#FFF';
        };
        btnFav.onmouseout = () => {
            btnFav.style.background = 'transparent';
            btnFav.style.color = '#DD0000';
        };
        btnFav.onclick = (e) => {
            e.stopPropagation();
            toggleFavorito(lojasExemplo[index].id, btnFav);
        };
        
        container.appendChild(btnAvaliar);
        container.appendChild(btnShare);
        container.appendChild(btnFav);
    });
    
    console.log(`✅ Botões adicionados em ${cards.length} cards`);
}

// ==================== 8. EVENTOS DOS CARDS ====================
function adicionarEventosCards() {
    const doc = getDoc();
    const cards = doc.querySelectorAll('.loja-card');
    
    cards.forEach((card, index) => {
        card.onclick = () => {
            abrirDetalhesLoja(lojasExemplo[index].id);
        };
    });
}

// ==================== 9. MODAL DE AVALIAÇÃO ====================
function criarModalAvaliacao() {
    const doc = getDoc();
    if (doc.getElementById('modalAvaliacao')) return;
    
    const modal = doc.createElement('div');
    modal.id = 'modalAvaliacao';
    modal.className = 'modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    `;
    modal.innerHTML = `
        <div style="background: white; border-radius: 30px; padding: 30px; max-width: 500px; width: 90%; border: 3px solid #FFCE00;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-size: 24px; color: #1A1A1A;">Avaliar Loja</h3>
                <span style="font-size: 28px; cursor: pointer; color: #6B7280;" onclick="fecharModalAvaliacao()">&times;</span>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <div id="avaliacaoEstrelas" style="font-size: 30px; color: #FFCE00; cursor: pointer;">
                    <i class="far fa-star" data-nota="1"></i>
                    <i class="far fa-star" data-nota="2"></i>
                    <i class="far fa-star" data-nota="3"></i>
                    <i class="far fa-star" data-nota="4"></i>
                    <i class="far fa-star" data-nota="5"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Seu comentário</label>
                <textarea id="avaliacaoComentario" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 14px;" rows="4" placeholder="Conte sua experiência..."></textarea>
            </div>
            
            <button id="btnEnviarAvaliacao" style="width: 100%; padding: 14px; background: #DD0000; color: white; border: none; border-radius: 60px; font-weight: 600; cursor: pointer;">Enviar Avaliação</button>
        </div>
    `;
    
    doc.body.appendChild(modal);
    
    // Eventos das estrelas
    const estrelas = modal.querySelectorAll('#avaliacaoEstrelas i');
    estrelas.forEach(star => {
        star.addEventListener('mouseover', function() {
            const nota = this.dataset.nota;
            estrelas.forEach((s, i) => {
                if (i < nota) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            const notaSelecionada = modal.dataset.notaSelecionada || 0;
            estrelas.forEach((s, i) => {
                if (i < notaSelecionada) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('click', function() {
            const nota = this.dataset.nota;
            modal.dataset.notaSelecionada = nota;
            estrelas.forEach((s, i) => {
                if (i < nota) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });
}

function abrirModalAvaliacao(lojaId) {
    const doc = getDoc();
    const modal = doc.getElementById('modalAvaliacao');
    if (!modal) {
        criarModalAvaliacao();
        setTimeout(() => abrirModalAvaliacao(lojaId), 100);
        return;
    }
    
    modal.dataset.lojaId = lojaId;
    modal.dataset.notaSelecionada = '0';
    modal.style.display = 'flex';
    
    const btnEnviar = modal.querySelector('#btnEnviarAvaliacao');
    btnEnviar.onclick = () => enviarAvaliacao(lojaId);
}

function fecharModalAvaliacao() {
    const doc = getDoc();
    const modal = doc.getElementById('modalAvaliacao');
    if (modal) modal.style.display = 'none';
}

function enviarAvaliacao(lojaId) {
    const doc = getDoc();
    const modal = doc.getElementById('modalAvaliacao');
    const nota = parseInt(modal.dataset.notaSelecionada || '0');
    const comentario = doc.getElementById('avaliacaoComentario')?.value || '';
    
    if (nota === 0) {
        mostrarToast('Selecione uma nota', 'error');
        return;
    }
    
    const novaAvaliacao = {
        id: Date.now(),
        lojaId,
        nota,
        comentario,
        usuario: 'Usuário',
        data: new Date().toISOString()
    };
    
    avaliacoes.push(novaAvaliacao);
    localStorage.setItem('rimso_avaliacoes', JSON.stringify(avaliacoes));
    
    mostrarToast('Avaliação enviada! Obrigado!');
    fecharModalAvaliacao();
}

// ==================== 10. FAVORITOS ====================
function toggleFavorito(lojaId, btn) {
    const index = favoritos.indexOf(lojaId);
    if (index === -1) {
        favoritos.push(lojaId);
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        btn.style.background = '#DD0000';
        btn.style.color = '#FFF';
        mostrarToast('❤️ Adicionado aos favoritos!');
    } else {
        favoritos.splice(index, 1);
        btn.innerHTML = '<i class="far fa-heart"></i>';
        btn.style.background = 'transparent';
        btn.style.color = '#DD0000';
        mostrarToast('Removido dos favoritos');
    }
    localStorage.setItem('rimso_favoritos', JSON.stringify(favoritos));
}

// ==================== 11. COMPARTILHAR ====================
function compartilharLoja(lojaId) {
    const loja = lojasExemplo.find(l => l.id === lojaId);
    if (!loja) return;
    
    const texto = `Confira a loja ${loja.nome} no RIMSO! 📍 ${loja.bairro}`;
    
    if (navigator.share) {
        navigator.share({
            title: loja.nome,
            text: texto,
            url: window.location.href
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(`${texto} - ${window.location.href}`);
        mostrarToast('🔗 Link copiado!');
    }
}

// ==================== 12. DETALHES DA LOJA ====================
function abrirDetalhesLoja(lojaId) {
    const loja = lojasExemplo.find(l => l.id === lojaId);
    if (!loja) return;
    
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    
    clienteContent.innerHTML = `
        <div style="padding: 20px;">
            <button onclick="voltarParaLojas()" style="background: transparent; border: 2px solid #DD0000; color: #DD0000; padding: 8px 16px; border-radius: 60px; margin-bottom: 20px; cursor: pointer;">
                <i class="fas fa-arrow-left"></i> Voltar
            </button>
            
            <div style="background: white; border-radius: 24px; border: 2px solid #E5E7EB; overflow: hidden;">
                <div style="height: 200px; background: linear-gradient(145deg, rgba(221,0,0,0.1), rgba(255,206,0,0.1)); display: flex; align-items: center; justify-content: center; font-size: 48px;">
                    ${loja.fotos[0]}
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="font-size: 28px; margin-bottom: 10px;">${loja.nome}</h2>
                    <p style="color: #DD0000; margin-bottom: 20px;"><i class="fas fa-map-marker-alt"></i> ${loja.bairro}, ${loja.endereco}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
                        <div style="background: #F9FAFB; border-radius: 16px; padding: 15px;">
                            <div style="color: #6B7280; font-size: 12px;">Horário</div>
                            <div style="font-weight: 600;"><i class="far fa-clock"></i> ${loja.horario}</div>
                        </div>
                        <div style="background: #F9FAFB; border-radius: 16px; padding: 15px;">
                            <div style="color: #6B7280; font-size: 12px;">Avaliação</div>
                            <div style="font-weight: 600; color: #FFCE00;"><i class="fas fa-star"></i> ${loja.avaliacao} (${loja.totalAvaliacoes})</div>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom: 15px;">Contato</h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                        <a href="https://wa.me/55${loja.whatsapp}" target="_blank" style="flex: 1; background: #25D366; color: white; padding: 12px; border-radius: 60px; text-align: center; text-decoration: none;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="tel:${loja.telefone}" style="flex: 1; background: #DD0000; color: white; padding: 12px; border-radius: 60px; text-align: center; text-decoration: none;">
                            <i class="fas fa-phone"></i> Ligar
                        </a>
                    </div>
                    
                    <h3 style="margin-bottom: 15px;">Fotos da Loja</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${loja.fotos.map(foto => `
                            <div style="aspect-ratio: 1; background: #F9FAFB; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px;">${foto}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Salvar função para voltar
    window.voltarParaLojas = function() {
        injetarLojas();
    };
}

// ==================== 13. FEED ====================
function mostrarFeed() {
    const doc = getDoc();
    const clienteContent = doc.getElementById('clienteContent');
    
    const feedHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; color: #1A1A1A;">Feed de Novidades</h2>
            <div style="display: flex; flex-direction: column; gap: 20px;">
                ${feedExemplo.map(post => `
                    <div style="background: white; border-radius: 20px; border: 2px solid #E5E7EB; overflow: hidden;">
                        <div style="padding: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <div style="width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(145deg, #DD0000, #FFCE00); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                        ${post.usuarioAvatar || '👤'}
                                    </div>
                                    <div>
                                        <strong>${post.tipo === 'cliente' ? post.usuarioNome : post.lojaNome}</strong>
                                        <div style="font-size: 12px; color: #6B7280;">${new Date(post.data).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                ${post.tipo === 'promocao' ? '<span style="background: #DD0000; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">🔥 PROMO</span>' : ''}
                            </div>
                            
                            <p style="margin: 10px 0;">${post.mensagem}</p>
                            
                            <div style="font-size: 48px; text-align: center; padding: 20px; background: #F9FAFB; border-radius: 16px;">
                                ${post.imagem}
                            </div>
                            
                            <div style="display: flex; gap: 20px; margin-top: 15px;">
                                <div style="display: flex; align-items: center; gap: 5px; cursor: pointer;" onclick="curtirPost(${post.id})">
                                    <i class="fa${curtidas.includes(post.id) ? 's' : 'r'} fa-heart" style="color: #DD0000;"></i>
                                    <span>${post.curtidas + (curtidas.includes(post.id) ? 1 : 0)}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <i class="far fa-comment" style="color: #6B7280;"></i>
                                    <span>${post.comentarios}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    clienteContent.innerHTML = feedHTML;
}

function curtirPost(postId) {
    const index = curtidas.indexOf(postId);
    if (index === -1) {
        curtidas.push(postId);
        mostrarToast('❤️ Curtiu!');
    } else {
        curtidas.splice(index, 1);
    }
    localStorage.setItem('rimso_curtidas', JSON.stringify(curtidas));
    mostrarFeed();
}

// ==================== 14. MENU DO CLIENTE ====================
function configurarMenuCliente() {
    const doc = getDoc();
    const menuCliente = doc.querySelector('#appCliente .sidebar-cliente');
    if (!menuCliente) return;
    
    // Verificar se já configurou
    if (menuCliente.dataset.configurado === 'true') return;
    
    // Adicionar item Feed
    const feedItem = doc.createElement('div');
    feedItem.className = 'menu-item';
    feedItem.innerHTML = '<i class="fas fa-rss"></i> Feed';
    feedItem.onclick = () => {
        doc.querySelectorAll('#appCliente .menu-item').forEach(i => i.classList.remove('active'));
        feedItem.classList.add('active');
        mostrarFeed();
    };
    
    // Adicionar antes do Voltar
    const voltarItem = menuCliente.querySelector('[onclick*="voltarAdmin"]');
    if (voltarItem) {
        menuCliente.insertBefore(feedItem, voltarItem);
    }
    
    menuCliente.dataset.configurado = 'true';
    console.log('✅ Menu do cliente configurado');
}

// ==================== 15. OBSERVAR MODO CLIENTE ====================
function observarModoCliente() {
    console.log('👀 Observando modo cliente...');
    
    setInterval(() => {
        const doc = getDoc();
        const appCliente = doc.getElementById('appCliente');
        
        if (appCliente && !appCliente.classList.contains('hidden')) {
            configurarMenuCliente();
            
            const clienteContent = doc.getElementById('clienteContent');
            if (clienteContent && clienteContent.children.length === 1) {
                injetarLojas();
            }
        }
    }, 1000);
}

// ==================== 16. SOBRESCREVER FUNÇÃO DO ADMIN ====================
function sobrescreverFuncaoAdmin() {
    if (window.top?.abrirModoCliente) {
        const original = window.top.abrirModoCliente;
        window.top.abrirModoCliente = function() {
            if (typeof original === 'function') original();
            setTimeout(injetarLojas, 1000);
        };
        console.log('✅ Função abrirModoCliente sobrescrita');
    }
}

// ==================== 17. INICIALIZAR ====================
function inicializar() {
    console.log('🚀 Inicializando todas as funcionalidades...');
    
    criarModalAvaliacao();
    sobrescreverFuncaoAdmin();
    observarModoCliente();
    
    console.log('✅ Todas as funcionalidades inicializadas!');
}

// Iniciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
