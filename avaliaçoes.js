// ==================== SISTEMA DE AVALIAÇÕES ====================
// Gerencia avaliações de lojas com fotos, comentários e médias

// Estrutura de dados
let avaliacoes = JSON.parse(localStorage.getItem('rimso_avaliacoes')) || [];

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    criarModalAvaliacao();
    carregarAvaliacoes();
});

// Criar modal de avaliação
function criarModalAvaliacao() {
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
                    <div id="avaliacaoEstrelas" style="font-size: 30px; color: var(--gold); cursor: pointer;">
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
                    <small style="color: var(--gray);">Você pode selecionar múltiplas fotos</small>
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
                img.className = 'preview-item';
                img.style.cssText = 'width: 80px; height: 80px; border-radius: 10px; overflow: hidden; border: 2px solid var(--border);';
                img.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                preview.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Variáveis de controle
let avaliacaoNotaSelecionada = 0;
let avaliacaoLojaId = null;

// Abrir modal de avaliação
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

// Funções das estrelas
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

// Enviar avaliação
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
    const fotos = [];
    
    // Simular upload de fotos (base64)
    const fileInput = document.getElementById('avaliacaoFotos');
    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            // Em produção, isso seria upload para servidor
            fotos.push(`foto_${Date.now()}_${i}`);
        }
    }
    
    const novaAvaliacao = {
        id: Date.now(),
        lojaId: avaliacaoLojaId,
        usuarioId: usuarioLogado.id,
        usuarioNome: usuarioLogado.nome,
        nota: avaliacaoNotaSelecionada,
        comentario: comentario,
        fotos: fotos,
        data: new Date().toISOString()
    };
    
    avaliacoes.push(novaAvaliacao);
    localStorage.setItem('rimso_avaliacoes', JSON.stringify(avaliacoes));
    
    // Atualizar média da loja
    atualizarMediaLoja(avaliacaoLojaId);
    
    mostrarToast('Avaliação enviada com sucesso! Obrigado!');
    fecharModalAvaliacao();
    
    // Atualizar interface se estiver na loja
    if (document.getElementById('lojaDetalhes')) {
        carregarAvaliacoesLoja(avaliacaoLojaId);
    }
}

// Atualizar média da loja
function atualizarMediaLoja(lojaId) {
    const avaliacoesLoja = avaliacoes.filter(a => a.lojaId === lojaId);
    
    if (avaliacoesLoja.length === 0) return;
    
    const soma = avaliacoesLoja.reduce((acc, a) => acc + a.nota, 0);
    const media = soma / avaliacoesLoja.length;
    
    // Encontrar e atualizar loja
    const loja = lojas?.find(l => l.id === lojaId);
    if (loja) {
        loja.avaliacaoMedia = media.toFixed(1);
        loja.totalAvaliacoes = avaliacoesLoja.length;
    }
    
    // Disparar evento de atualização
    document.dispatchEvent(new CustomEvent('avaliacoesAtualizadas', { 
        detail: { lojaId, media, total: avaliacoesLoja.length } 
    }));
}

// Carregar avaliações de uma loja
function carregarAvaliacoesLoja(lojaId) {
    const avaliacoesLoja = avaliacoes
        .filter(a => a.lojaId === lojaId)
        .sort((a, b) => new Date(b.data) - new Date(a.data));
    
    const container = document.getElementById('avaliacoesContainer');
    if (!container) return;
    
    if (avaliacoesLoja.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>';
        return;
    }
    
    container.innerHTML = avaliacoesLoja.map(av => `
        <div class="avaliacao-card" style="background: var(--light); border-radius: 16px; padding: 20px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; color: var(--black); font-weight: 700;">
                        ${av.usuarioNome.charAt(0)}
                    </div>
                    <div>
                        <strong>${av.usuarioNome}</strong>
                        <div style="font-size: 12px; color: var(--gray);">${new Date(av.data).toLocaleDateString()}</div>
                    </div>
                </div>
                <div style="color: var(--gold);">
                    ${'★'.repeat(av.nota)}${'☆'.repeat(5-av.nota)}
                </div>
            </div>
            
            ${av.comentario ? `<p style="margin: 10px 0;">${av.comentario}</p>` : ''}
            
            ${av.fotos.length > 0 ? `
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    ${av.fotos.map(() => `
                        <div style="width: 60px; height: 60px; background: var(--gradient); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            📸
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Estatísticas de avaliações para lojista
function getEstatisticasAvaliacoes(lojaId) {
    const avaliacoesLoja = avaliacoes.filter(a => a.lojaId === lojaId);
    
    const estatisticas = {
        total: avaliacoesLoja.length,
        media: 0,
        distribuicao: [0,0,0,0,0]
    };
    
    if (avaliacoesLoja.length > 0) {
        const soma = avaliacoesLoja.reduce((acc, a) => acc + a.nota, 0);
        estatisticas.media = (soma / avaliacoesLoja.length).toFixed(1);
        
        avaliacoesLoja.forEach(a => {
            estatisticas.distribuicao[a.nota-1]++;
        });
    }
    
    return estatisticas;
}

// Exportar funções para uso global
window.avaliacoes = avaliacoes;
window.abrirAvaliacao = abrirAvaliacao;
window.getEstatisticasAvaliacoes = getEstatisticasAvaliacoes;