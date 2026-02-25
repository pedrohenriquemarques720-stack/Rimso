import streamlit as st
import requests
from streamlit.components.v1 import html
import time
import os

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# URL do seu index.html no GitHub
GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

# ==================== LISTA DOS ARQUIVOS JS ====================
ARQUIVOS_JS = [
    "avaliacoes.js",
    "feed.js",
    "favoritos.js",
    "rotas.js",
    "filtrosavan.js",
    "notificacoes.js",
    "estatisticas.js",
    "promocoes.js",
    "compartilhar.js",
    "adminadv.js"
]

# ==================== FUNÇÃO PARA LER ARQUIVOS JS ====================
def ler_arquivo_js(nome_arquivo):
    """Lê um arquivo JS da pasta static"""
    caminho = os.path.join("static", nome_arquivo)
    if os.path.exists(caminho):
        with open(caminho, 'r', encoding='utf-8') as f:
            return f.read()
    return None

# ==================== FUNÇÃO PARA CARREGAR HTML DO GITHUB ====================
def carregar_html_github():
    try:
        response = requests.get(f"{GITHUB_HTML_URL}?t={int(time.time())}", timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            st.error(f"Erro {response.status_code}: Não foi possível acessar o arquivo.")
            return None
    except Exception as e:
        st.error(f"Erro inesperado: {e}")
        return None

# ==================== CSS ====================
st.markdown("""
<style>
    .main .block-container { padding: 0 !important; max-width: 100% !important; }
    #MainMenu, footer, header { display: none; }
    iframe { width: 100%; border: none; min-height: 100vh; }
    .stApp { padding: 0 !important; }
</style>
""", unsafe_allow_html=True)

# ==================== SIDEBAR ====================
with st.sidebar:
    st.markdown("""
    <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 48px;">👕</div>
        <div style="font-size: 24px; font-weight: 800;">RIM<span style="color: #DD0000;">SO</span></div>
    </div>
    """, unsafe_allow_html=True)
    
    status_placeholder = st.empty()
    
    if st.button("🔄 Recarregar", use_container_width=True):
        st.cache_data.clear()
        st.rerun()

# ==================== ÁREA PRINCIPAL ====================
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando interface..."):
    html_content = carregar_html_github()
    
    if html_content:
        # --- INJEÇÃO DOS ARQUIVOS JS DIRETAMENTE NO HTML ---
        scripts_completos = ""
        arquivos_encontrados = []
        arquivos_nao_encontrados = []
        
        for arquivo in ARQUIVOS_JS:
            conteudo = ler_arquivo_js(arquivo)
            if conteudo:
                arquivos_encontrados.append(arquivo)
                # Envolve o conteúdo em uma tag <script> e adiciona um log
                scripts_completos += f"""
<script>
// ===== INÍCIO: {arquivo} =====
console.log('✅ Carregando: {arquivo}');
{conteudo}
console.log('✅ {arquivo} carregado com sucesso!');
// ===== FIM: {arquivo} =====
</script>
"""
            else:
                arquivos_nao_encontrados.append(arquivo)
        
        # Script de inicialização da interface
        script_inicializacao = """
<script>
// ===== SCRIPT DE INICIALIZAÇÃO DA INTERFACE =====
console.log('🚀 Inicializando interface...');

function inicializarInterface() {
    console.log('📦 Adicionando elementos na interface...');
    
    // Adicionar botões de avaliação
    const lojaCards = document.querySelectorAll('.loja-card');
    if (lojaCards.length > 0) {
        lojaCards.forEach((card, index) => {
            // Botão Avaliar
            if (!card.querySelector('.btn-avaliar')) {
                const btnAvaliar = document.createElement('button');
                btnAvaliar.className = 'btn-avaliar';
                btnAvaliar.innerHTML = '<i class="fas fa-star"></i> Avaliar';
                btnAvaliar.style.cssText = `
                    background: transparent;
                    border: 2px solid #FFCE00;
                    color: #FFCE00;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    margin-top: 10px;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.3s;
                `;
                btnAvaliar.onmouseover = () => {
                    btnAvaliar.style.background = '#FFCE00';
                    btnAvaliar.style.color = '#000000';
                };
                btnAvaliar.onmouseout = () => {
                    btnAvaliar.style.background = 'transparent';
                    btnAvaliar.style.color = '#FFCE00';
                };
                btnAvaliar.onclick = (e) => {
                    e.stopPropagation();
                    alert(`Função de avaliação para loja ${index + 1} será implementada em breve!`);
                };
                card.appendChild(btnAvaliar);
            }
            
            // Botão Compartilhar
            if (!card.querySelector('.btn-compartilhar')) {
                const btnCompartilhar = document.createElement('button');
                btnCompartilhar.className = 'btn-compartilhar';
                btnCompartilhar.innerHTML = '<i class="fas fa-share-alt"></i>';
                btnCompartilhar.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 45px;
                    background: #FFCE00;
                    color: #000000;
                    border: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    transition: all 0.3s;
                `;
                btnCompartilhar.onmouseover = () => {
                    btnCompartilhar.style.transform = 'scale(1.1)';
                };
                btnCompartilhar.onmouseout = () => {
                    btnCompartilhar.style.transform = 'scale(1)';
                };
                btnCompartilhar.onclick = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copiado para a área de transferência!');
                };
                card.style.position = 'relative';
                card.appendChild(btnCompartilhar);
            }
        });
        console.log(`✅ Botões adicionados em ${lojaCards.length} lojas.`);
    } else {
        console.log('⚠️ Nenhum card de loja encontrado ainda.');
    }
}

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(inicializarInterface, 1000);
});

// Observar mudanças no DOM para adicionar botões em lojas carregadas dinamicamente
const observer = new MutationObserver(function() {
    setTimeout(inicializarInterface, 500);
});
observer.observe(document.body, { childList: true, subtree: true });

console.log('🎉 Interface inicializada com sucesso!');
</script>
"""
        
        # Injetar todos os scripts no HTML
        html_content = html_content.replace('</body>', f'{scripts_completos}{script_inicializacao}</body>')
        
        # Remover as tags <script src="..."> antigas para evitar duplicação
        import re
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        
        # Injetar o HTML final
        html(html_content, height=1000, scrolling=True)
        
        # Atualizar status
        status_placeholder.success(f"✅ {len(arquivos_encontrados)} arquivos carregados, {len(arquivos_nao_encontrados)} não encontrados")
        
        with st.sidebar:
            if arquivos_encontrados:
                st.success(f"✅ Carregados: {', '.join(arquivos_encontrados)}")
            if arquivos_nao_encontrados:
                st.error(f"❌ Não encontrados: {', '.join(arquivos_nao_encontrados)}")
    else:
        status_placeholder.error("❌ Falha ao carregar")
