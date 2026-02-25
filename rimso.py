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
            st.error(f"Erro {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Erro: {e}")
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
        # --- INJEÇÃO DOS ARQUIVOS JS ---
        scripts_completos = ""
        arquivos_encontrados = []
        
        for arquivo in ARQUIVOS_JS:
            conteudo = ler_arquivo_js(arquivo)
            if conteudo:
                arquivos_encontrados.append(arquivo)
                scripts_completos += f"""
<script>
// ===== {arquivo} =====
{conteudo}
console.log('✅ {arquivo} carregado');
</script>
"""
        
        # === SCRIPT DE INTERFACE OTIMIZADO ===
        script_interface = """
<script>
// ===== INTERFACE RIMSO =====
console.log('🚀 Iniciando RIMSO...');

// Função para adicionar botões nos cards
function adicionarBotoes() {
    const cards = document.querySelectorAll('.loja-card');
    console.log(`📦 Encontrados ${cards.length} cards de loja`);
    
    cards.forEach((card, index) => {
        // Já tem botões?
        if (card.querySelector('.btn-avaliar')) return;
        
        // Botão Avaliar
        const btnAvaliar = document.createElement('button');
        btnAvaliar.className = 'btn-avaliar';
        btnAvaliar.innerHTML = '<i class="fas fa-star"></i> Avaliar';
        btnAvaliar.style.cssText = 'background:#FFCE00; color:#000; border:none; padding:8px; border-radius:20px; margin-top:10px; width:100%; cursor:pointer;';
        btnAvaliar.onclick = () => alert('Função de avaliação em breve!');
        card.appendChild(btnAvaliar);
        
        // Botão Compartilhar
        const btnShare = document.createElement('button');
        btnShare.className = 'btn-compartilhar';
        btnShare.innerHTML = '<i class="fas fa-share-alt"></i>';
        btnShare.style.cssText = 'position:absolute; top:10px; right:45px; background:#FFCE00; border:none; width:35px; height:35px; border-radius:50%; cursor:pointer; z-index:10;';
        btnShare.onclick = () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado!');
        };
        card.style.position = 'relative';
        card.appendChild(btnShare);
    });
}

// Executar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adicionarBotoes);
} else {
    adicionarBotoes();
}

// Observar mudanças (APENAS UMA VEZ)
if (!window.rimsoObserver) {
    window.rimsoObserver = new MutationObserver(adicionarBotoes);
    window.rimsoObserver.observe(document.body, { childList: true, subtree: true });
}

console.log('✅ RIMSO pronto!');
</script>
"""
        
        # Remover tags antigas
        import re
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        
        # Injetar tudo na ordem correta
        html_content = html_content.replace('</body>', f'{scripts_completos}{script_interface}</body>')
        
        # Mostrar o resultado
        html(html_content, height=1000, scrolling=True)
        status_placeholder.success(f"✅ {len(arquivos_encontrados)} arquivos carregados")
        
        with st.sidebar:
            st.info("👉 Clique em 'Modo Cliente' para ver os botões")
    else:
        status_placeholder.error("❌ Falha ao carregar")
