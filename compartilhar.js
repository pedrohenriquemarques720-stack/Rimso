// ==================== SISTEMA DE COMPARTILHAMENTO ====================
// Compartilhar lojas, produtos e promoções em redes sociais

// Compartilhar loja
function compartilharLoja(lojaId) {
    const loja = lojasExemplo?.find(l => l.id === lojaId);
    if (!loja) return;
    
    const texto = `Conheci a ${loja.nome} no RIMSO! 🏪\n📍 ${loja.bairro}\n⭐ Avaliação: ${loja.avaliacaoMedia || 'Nova'}\n\nEncontre lojas no seu bairro:`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: loja.nome,
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copiar link
        copiarTexto(`${texto} ${url}`);
    }
}

// Compartilhar produto
function compartilharProduto(lojaId, produtoNome) {
    const loja = lojasExemplo?.find(l => l.id === lojaId);
    if (!loja) return;
    
    const texto = `Olha esse produto que encontrei na ${loja.nome}: ${produtoNome} 👕\n\nEncontre no RIMSO:`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: produtoNome,
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        copiarTexto(`${texto} ${url}`);
    }
}

// Compartilhar promoção
function compartilharPromocao(promocaoId) {
    const promocao = promocoes?.find(p => p.id === promocaoId);
    if (!promocao) return;
    
    const loja = lojasExemplo?.find(l => l.id === promocao.lojaId);
    
    const texto = `🔥 PROMOÇÃO RELÂMPAGO!\n${loja?.nome}: ${promocao.titulo}\n💰 ${promocao.desconto}% OFF\n⏰ Corra, tempo limitado!\n\nVeja no RIMSO:`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: promocao.titulo,
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        copiarTexto(`${texto} ${url}`);
    }
}

// Compartilhar avaliação
function compartilharAvaliacao(avaliacaoId) {
    const avaliacao = avaliacoes?.find(a => a.id === avaliacaoId);
    if (!avaliacao) return;
    
    const loja = lojasExemplo?.find(l => l.id === avaliacao.lojaId);
    
    const texto = `Avaliei a loja ${loja?.nome} com ${avaliacao.nota} ⭐ no RIMSO!\n"${avaliacao.comentario}"\n\nVeja você também:`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: `Avaliação de ${loja?.nome}`,
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        copiarTexto(`${texto} ${url}`);
    }
}

// Compartilhar feed
function compartilharPost(postId) {
    const post = feedPosts?.find(p => p.id === postId);
    if (!post) return;
    
    let texto = '';
    
    if (post.tipo === 'cliente') {
        texto = `${post.usuarioNome} postou no RIMSO: "${post.mensagem}" 👕\n\nVeja você também:`;
    } else {
        texto = `${post.lojaNome}: ${post.mensagem} 🔥\n\nVeja no RIMSO:`;
    }
    
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'RIMSO - Lojas do seu bairro',
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        copiarTexto(`${texto} ${url}`);
    }
}

// Copiar texto para área de transferência
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast('Link copiado para área de transferência!');
    }).catch(() => {
        mostrarToast('Erro ao copiar', 'error');
    });
}

// Compartilhar via WhatsApp
function compartilharWhatsApp(texto) {
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Compartilhar via Facebook
function compartilharFacebook(url) {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
}

// Compartilhar via Twitter
function compartilharTwitter(texto, url) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// Compartilhar via Instagram (apenas link)
function compartilharInstagram() {
    copiarTexto(window.location.href);
    mostrarToast('Link copiado! Cole no Instagram');
}

// Botão de compartilhamento flutuante
function criarBotaoCompartilhar() {
    const botao = document.createElement('div');
    botao.id = 'botaoCompartilhar';
    botao.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--gradient);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 999;
        transition: var(--transition);
    `;
    botao.innerHTML = '<i class="fas fa-share-alt"></i>';
    botao.onclick = abrirMenuCompartilhar;
    
    document.body.appendChild(botao);
}

// Abrir menu de compartilhamento
function abrirMenuCompartilhar() {
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: var(--card-bg);
        border: 2px solid var(--border);
        border-radius: 20px;
        padding: 15px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        min-width: 200px;
    `;
    
    menu.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div onclick="compartilharWhatsApp('Confira as lojas no RIMSO! ' + window.location.href)" style="padding: 10px; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <i class="fab fa-whatsapp" style="color: #25D366;"></i> WhatsApp
            </div>
            <div onclick="compartilharFacebook(window.location.href)" style="padding: 10px; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <i class="fab fa-facebook" style="color: #1877F2;"></i> Facebook
            </div>
            <div onclick="compartilharTwitter('Confira as lojas no RIMSO!', window.location.href)" style="padding: 10px; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <i class="fab fa-twitter" style="color: #1DA1F2;"></i> Twitter
            </div>
            <div onclick="compartilharInstagram()" style="padding: 10px; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <i class="fab fa-instagram" style="color: #E4405F;"></i> Instagram
            </div>
            <div onclick="copiarTexto(window.location.href)" style="padding: 10px; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-link" style="color: var(--gray);"></i> Copiar link
            </div>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function removerMenu(e) {
            if (!menu.contains(e.target) && e.target.id !== 'botaoCompartilhar') {
                menu.remove();
                document.removeEventListener('click', removerMenu);
            }
        });
    }, 100);
}

// QR Code da loja
function gerarQRCode(lojaId) {
    const loja = lojasExemplo?.find(l => l.id === lojaId);
    if (!loja) return;
    
    const url = `${window.location.origin}?loja=${lojaId}`;
    
    // Criar modal com QR Code
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalQRCode';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div class="modal-header">
                <h3 class="modal-title">QR Code da Loja</h3>
                <span class="modal-close" onclick="fecharModal('modalQRCode')">&times;</span>
            </div>
            <div class="modal-body">
                <div style="background: white; padding: 20px; border-radius: 20px; margin-bottom: 20px;">
                    <div style="width: 200px; height: 200px; margin: 0 auto; background: var(--light); display: flex; align-items: center; justify-content: center;">
                        🏪 QR Code
                    </div>
                </div>
                <p style="margin-bottom: 10px;"><strong>${loja.nome}</strong></p>
                <p style="color: var(--gray);">Escaneie para ver a loja</p>
                <button class="btn btn-primary" onclick="window.print()">Imprimir QR Code</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('active');
}

// Exportar funções
window.compartilharLoja = compartilharLoja;
window.compartilharProduto = compartilharProduto;
window.compartilharPromocao = compartilharPromocao;
window.compartilharWhatsApp = compartilharWhatsApp;
window.gerarQRCode = gerarQRCode;